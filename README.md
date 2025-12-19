# Personal Map Site

> Mythic Engraving Interactive Map Portfolio - 个人作品集/简历网站（神话雕刻风格）

## 项目简介

这是一个基于 Astro 的静态站点生成器（SSG），采用**神话雕刻（Mythic Engraving）**设计系统，以交互式地图为核心，展示个人经历、作品、决策日志等内容。

### 设计理念

- **视觉风格**：羊皮纸背景 + 墨色系统 + 神话雕刻美学
- **交互方式**：地图探索式导航 + 光束连接 + 建筑隐喻
- **内容组织**：多个独立"建筑"对应不同内容模块

## 技术栈

- **框架**: Astro 5.16.5
- **样式**: Tailwind CSS 4.1.18
- **类型检查**: TypeScript
- **构建工具**: Vite
- **部署**: Docker + Nginx

## Docker 部署

### 快速启动

```bash
# 使用 docker-compose
docker-compose up -d

# 访问网站
open http://localhost:8080
```

### 手动构建

```bash
# 构建镜像
docker build -t personal-map-site .

# 运行容器
docker run -d -p 8080:80 --name personal-map-site personal-map-site
```

### 停止服务

```bash
# 使用 docker-compose
docker-compose down

# 或手动停止
docker stop personal-map-site
docker rm personal-map-site
```

## 本地开发

### 环境要求

- Node.js >= 18
- npm

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:4321

### 构建生产版本

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## Project Structure

```
personal-map-site/
├── src/
│   ├── components/
│   │   ├── Map/
│   │   │   ├── WorldMap.astro       # Main interactive map
│   │   │   └── MapNode.astro        # Individual map nodes
│   │   ├── Workshop/
│   │   │   └── CrystalCard.astro    # Project showcase cards
│   │   ├── Log/
│   │   │   └── QuestLogList.astro   # Article list
│   │   └── Command/
│   │       └── StatsPanel.astro     # Resume stats panel
│   │
│   ├── content/
│   │   ├── projects.json            # Project data
│   │   ├── articles/                # Article content
│   │   └── archives/                # Architecture portfolio
│   │
│   ├── layouts/
│   │   └── BaseLayout.astro         # Base page layout
│   │
│   ├── pages/
│   │   ├── index.astro              # Landing page (World Map)
│   │   ├── workshop.astro           # AI/Product works
│   │   ├── log.astro                # Articles
│   │   ├── archives.astro           # Architecture
│   │   └── command.astro            # Resume/About
│   │
│   └── styles/
│       ├── tokens.css               # Design tokens & colors
│       └── global.css               # Global styles
│
├── public/                          # Static assets
└── astro.config.mjs                 # Astro configuration
```

## Style Guidelines

### Core Aesthetic
- **Theme**: Mythic Engraving Interactive Map
- **Keywords**: Allegorical, Editorial, Museum-grade, Minimalist
- **Color Palette**: Parchment background (#efe9c6), dark ink text (#1f1f1f)

### Typography
- **Body/UI**: Inter
- **Titles**: Cinzel (used sparingly)

### Prohibited Styles
- Modern SaaS UI (shadows, glass effects, gradients)
- Neon/Cyberpunk/HUD aesthetics
- 3D WebGL scenes
- Heavy animations

## Development

```powershell
# Install dependencies (already done)
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Pages

- `/` - World Map (Landing/Navigation)
- `/workshop` - AI & Product Works
- `/log` - Knowledge Tower (Articles)
- `/archives` - Ancient Blueprints (Architecture)
- `/command` - Command Center (Resume/About)

## Design Tokens

See `src/styles/tokens.css` for color and spacing variables:
- `--bg-parchment`: Parchment background
- `--ink-main`: Primary text color
- `--ink-soft`: Secondary text color
- `--accent-glow`: Accent highlight

## Performance

- Target: 60fps animations
- All animations use CSS `transform` and `opacity`
- Respects `prefers-reduced-motion`
- Static site generation for optimal loading

## Tech Stack

- **Framework**: Astro (SSG)
- **Styling**: Tailwind CSS v4
- **Fonts**: Inter, Cinzel (Google Fonts)
- **Deployment**: Cloudflare Pages / Vercel / GitHub Pages

## Next Steps

1. Develop the interactive WorldMap component with SVG paths
2. Add content to projects.json and create article files
3. Build out each page with actual content
4. Create SVG engraving-style illustrations
5. Implement smooth navigation transitions
