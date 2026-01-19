import http from 'http';
import { promises as fs } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const PORT = Number(process.env.TRACK_PORT || 3001);
const LOG_PATH = process.env.TRACK_LOG_PATH || '/var/log/personal_site/track.log';
const MAX_LIMIT = 10000;

async function ensureLogDir() {
  const dir = dirname(LOG_PATH);
  await fs.mkdir(dir, { recursive: true });
}

function getClientIp(req) {
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.length > 0) {
    return xff.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || '';
}

function readRequestBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => resolve(body));
  });
}

async function readLastLines(filePath, limit) {
  try {
    const stat = await fs.stat(filePath);
    const fileSize = stat.size;
    if (fileSize === 0) return [];

    const fd = await fs.open(filePath, 'r');
    const chunkSize = 64 * 1024;
    let position = fileSize;
    let buffer = '';
    let lines = [];

    while (position > 0 && lines.length <= limit) {
      const readSize = Math.min(chunkSize, position);
      position -= readSize;
      const chunk = Buffer.alloc(readSize);
      await fd.read(chunk, 0, readSize, position);
      buffer = chunk.toString('utf-8') + buffer;
      lines = buffer.split('\n');
    }

    await fd.close();
    return lines.filter(Boolean).slice(-limit);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

function parseQuery(url) {
  const query = {};
  const idx = url.indexOf('?');
  if (idx === -1) return query;
  const search = url.slice(idx + 1);
  search.split('&').forEach(pair => {
    const [k, v] = pair.split('=');
    if (!k) return;
    query[decodeURIComponent(k)] = decodeURIComponent(v || '');
  });
  return query;
}

function toMs(input) {
  if (!input) return null;
  const num = Number(input);
  if (!Number.isNaN(num)) return num;
  const t = Date.parse(input);
  return Number.isNaN(t) ? null : t;
}

function buildStats(items) {
  const now = Date.now();
  const since24h = now - 24 * 60 * 60 * 1000;
  const since1h = now - 60 * 60 * 1000;
  const pvItems = items.filter(item => item.event === 'page_view');

  const pv24h = pvItems.filter(item => Date.parse(item.ts) >= since24h);
  const uv24h = new Set(pv24h.map(item => item.session_id)).size;
  const topPathMap = new Map();
  pv24h.forEach(item => {
    const key = item.path || '';
    topPathMap.set(key, (topPathMap.get(key) || 0) + 1);
  });
  const topPaths = Array.from(topPathMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([path, count]) => ({ path, count }));

  const ip1h = new Set(
    items
      .filter(item => Date.parse(item.ts) >= since1h)
      .map(item => item.ip)
      .filter(Boolean)
  ).size;

  const sessionDurations = buildSessionDurations(items, 15000);
  const durationValues = Object.values(sessionDurations);
  const totalDurationMs = durationValues.reduce((sum, value) => sum + value, 0);
  const avgDurationMs = durationValues.length > 0 ? Math.round(totalDurationMs / durationValues.length) : 0;

  return {
    pv_24h: pv24h.length,
    uv_24h: uv24h,
    top_paths_24h: topPaths,
    unique_ip_1h: ip1h,
    avg_session_duration_ms: avgDurationMs,
    total_session_duration_ms: totalDurationMs,
  };
}

function buildSessionDurations(items, heartbeatIntervalMs) {
  const sessionMap = new Map();

  items.forEach(item => {
    const sid = item.session_id || '';
    if (!sid) return;
    if (!sessionMap.has(sid)) {
      sessionMap.set(sid, { heartbeatCount: 0 });
    }
    const entry = sessionMap.get(sid);
    if (item.event === 'heartbeat') {
      entry.heartbeatCount += 1;
    }
  });

  const durations = {};
  sessionMap.forEach((value, sid) => {
    durations[sid] = value.heartbeatCount * heartbeatIntervalMs;
  });

  return durations;
}

async function handleTrack(req, res) {
  const bodyText = await readRequestBody(req);
  let payload = null;
  try {
    payload = JSON.parse(bodyText || '{}');
  } catch {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: false, error: 'invalid_json' }));
    return;
  }

  const entry = {
    ts: new Date().toISOString(),
    ip: getClientIp(req),
    ua: String(payload.ua || req.headers['user-agent'] || ''),
    ref: String(payload.ref || ''),
    path: String(payload.path || ''),
    event: String(payload.event || ''),
    session_id: String(payload.session_id || ''),
  };

  try {
    await ensureLogDir();
    await fs.appendFile(LOG_PATH, JSON.stringify(entry) + '\n', 'utf-8');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: false, error: 'write_failed' }));
  }
}

async function handleAdmin(req, res) {
  const query = parseQuery(req.url || '');
  const limit = Math.min(Number(query.limit || 2000), MAX_LIMIT);
  const now = Date.now();
  const defaultFromMs = now - 24 * 60 * 60 * 1000;
  const defaultToMs = now;
  const fromMs = toMs(query.from) ?? defaultFromMs;
  const toMs = toMs(query.to) ?? defaultToMs;
  const keyword = (query.q || '').toLowerCase();

  const lines = await readLastLines(LOG_PATH, limit);
  const rawItems = lines
    .map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .filter(item => {
      const ts = Date.parse(item.ts || '');
      if (Number.isNaN(ts)) return false;
      if (ts < fromMs) return false;
      if (ts > toMs) return false;
      if (!keyword) return true;
      return [
        item.ip,
        item.ua,
        item.ref,
        item.path,
        item.session_id,
        item.event,
      ].some(field => String(field || '').toLowerCase().includes(keyword));
    });

  const items = rawItems.sort((a, b) => Date.parse(b.ts) - Date.parse(a.ts));
  const stats = buildStats(items);
  const sessionDurations = buildSessionPathDurations(items, 15000);

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ ok: true, items, stats, session_durations: sessionDurations }));
}

function buildSessionPathDurations(items, heartbeatIntervalMs) {
  const sessionMap = new Map();

  items.forEach(item => {
    const sid = item.session_id || '';
    const path = item.path || '';
    if (!sid || !path) return;
    const key = `${sid}__${path}`;
    if (!sessionMap.has(key)) {
      sessionMap.set(key, { heartbeatCount: 0 });
    }
    const entry = sessionMap.get(key);
    if (item.event === 'heartbeat') {
      entry.heartbeatCount += 1;
    }
  });

  const durations = {};
  sessionMap.forEach((value, key) => {
    durations[key] = value.heartbeatCount * heartbeatIntervalMs;
  });

  return durations;
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'POST' && req.url?.startsWith('/api/track')) {
      await handleTrack(req, res);
      return;
    }

    if (req.method === 'GET' && req.url?.startsWith('/api/track/admin')) {
      await handleAdmin(req, res);
      return;
    }

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: false, error: 'not_found' }));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: false, error: 'server_error' }));
  }
});

server.listen(PORT, () => {
  console.log(`track server listening on ${PORT}`);
});
