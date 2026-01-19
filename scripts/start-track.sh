#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi

export TRACK_PORT="${TRACK_PORT:-3001}"
export TRACK_HOST="${TRACK_HOST:-127.0.0.1}"
export TRACK_LOG_PATH="${TRACK_LOG_PATH:-/var/log/personal_site/track.log}"

node server/track/track-server.js
