---
title_en: "Tools I Actually Use: 2024 Edition"
title_zh: "我真正在用的工具：2024 版"
date: 2024-11-01
type: reflection
tags: ["Tools", "Productivity", "Setup"]
status: published
category: "Setup"
summary: "去掉炫耀和噪音，这是我实际每天使用的工具清单。重点不是最新最酷，而是真正有用。"
author: "吴叶贝 (Wu Yebei)"
topic: "效率工具 / 工作流程 / 软件推荐"
audience: "开发者 / 设计师 / 知识工作者"
tools: "VSCode / Figma / Notion / Arc Browser"
updated: "2024-11"
---

## 前言

每年都会看到"我的工具栈"文章，列出 50 个工具，其中 45 个作者从不使用。

这是我真正**每天**使用的工具。标准：如果明天消失我会痛苦。

## 编程

### VS Code
- **用途**：主力代码编辑器
- **为什么不是 Neovim**：我试过，配置太累。VS Code 开箱即用 + 插件生态无敌。
- **关键插件**：
  - GitHub Copilot（有争议，但我离不开）
  - ESLint + Prettier
  - Tailwind CSS IntelliSense
  - GitLens（理解代码历史）

### Cursor (偶尔)
- **用途**：AI 辅助编程
- **何时用**：写 boilerplate、重构大块代码、debug 奇怪的错误
- **何时不用**：核心逻辑、需要深度思考的算法

### Warp Terminal
- **用途**：终端
- **为什么不是 iTerm2**：AI 命令补全太好用。输入"找到所有大于 100MB 的文件"，自动生成 `find` 命令。
- **缺点**：略重，占用内存多

### Git + GitHub Desktop
- **Git CLI**：日常 add/commit/push
- **GitHub Desktop**：复杂的 merge conflict、cherry-pick、rebase。GUI 让我看清楚在做什么。

## 设计

### Figma
- **用途**：所有 UI 设计
- **为什么不是 Sketch**：协作。客户直接看设计，不需要下载文件。
- **实际工作流**：
  - 低保真：直接在纸上画 → 拍照
  - 中保真：Figma 快速原型
  - 高保真：Figma + 真实组件库

### Excalidraw
- **用途**：架构图、流程图、脑暴
- **为什么不是 Miro/Lucidchart**：太重。Excalidraw 够轻，够快，手绘风格让人放松（不会纠结像素对齐）。

## 笔记 & 知识管理

### Obsidian
- **用途**：个人知识库
- **结构**：
  - `daily/`：每日笔记（日记 + 任务）
  - `projects/`：项目相关笔记
  - `learn/`：学习笔记和研究
  - `archive/`：不再活跃的内容
- **关键插件**：
  - Dataview（查询笔记）
  - Templater（模板）
  - Calendar（日历视图）

### Notion (减少中)
- **用途**：协作文档、项目管理（和团队用）
- **为什么减少**：太慢。加载一个页面需要 2-3 秒。越来越多迁移到 Obsidian + Git。

### Apple Notes
- **用途**：临时想法、购物清单、快速捕捉
- **为什么不是 Obsidian**：Obsidian 太重。打开 → 找到文件 → 写下想法，需要 5 个步骤。Apple Notes 是 1 个步骤。

## AI 工具

### ChatGPT (Claude Sonnet)
- **用途**：
  - Rubber duck debugging（解释代码给它听，发现自己的错误）
  - 快速研究（如"CRDT 和 OT 的区别"）
  - 改写尴尬的邮件
- **不用于**：直接复制代码（理解后自己写）

### Perplexity
- **用途**：快速事实查询
- **为什么不是 Google**：Perplexity 直接给答案 + 引用来源。Google 给 10 个 SEO 垃圾链接。

### Midjourney (减少中)
- **用途**：概念图、Mockup 背景图
- **为什么减少**：成本高，生成质量不稳定。越来越多用 ComfyUI（本地，免费，可控）。

## 部署 & 基础设施

### Vercel
- **用途**：部署前端（Next.js, Astro）
- **为什么**：零配置部署。`git push` = 自动部署 + 预览链接。

### Railway (之前 Heroku)
- **用途**：后端服务（Node.js, Python API）
- **为什么不是 AWS**：AWS 配置地狱。Railway 5 分钟搞定。

### Supabase
- **用途**：数据库 + Auth + Storage
- **为什么不是 Firebase**：开源，PostgreSQL（真正的 SQL），价格透明。

### Cloudflare
- **用途**：DNS + CDN + Workers（边缘函数）
- **为什么**：免费 tier 非常慷慨。Workers 比 AWS Lambda 快 10 倍。

## 其他

### 1Password
- **用途**：密码管理
- **为什么不是浏览器密码管理器**：跨平台，支持 2FA，家庭共享。

### Raycast (macOS)
- **用途**：替代 Spotlight
- **关键功能**：
  - 剪贴板历史（回溯到 3 个月前）
  - 快速计算（直接在搜索框算数学）
  - 窗口管理（快捷键调整窗口布局）
  - 自定义脚本（如"创建今天的日记笔记"）

### Things 3 (macOS/iOS)
- **用途**：任务管理
- **为什么不是 Todoist/Notion**：快。打开 → 添加任务 → 关闭，不到 2 秒。

### Arc Browser
- **用途**：主力浏览器
- **为什么不是 Chrome**：
  - Spaces（工作/个人项目分离）
  - 垂直标签栏（我有 50+ 标签同时打开）
  - 内置 Split View

## 不用的"热门"工具

### Linear
- **为什么不用**：一个人项目用 GitHub Issues 够了。团队项目用 Notion。不需要专门的任务管理系统。

### Slack
- **为什么不用**：异步远程工作。Email + Notion 评论足够。Slack 是注意力黑洞。

### Docker (本地开发)
- **为什么不用**：本地开发直接跑服务。Docker 增加一层复杂度，调试更难。生产环境用，开发环境不用。

## 原则

选择工具的原则：

1. **默认简单**：优先选轻量工具。复杂度只有在证明必要时才加。
2. **快速启动**：工具要够快。如果打开需要 5 秒，我不会用。
3. **离线优先**：尽量选本地工具或有离线模式的。网络不该是阻塞点。
4. **可导出**：数据要能导出。如果工具倒闭，我的数据不能丢。
5. **实际测试**：不在 HN/Reddit 看到就用。试 1 周，看是否真正提高效率。

## 最后

这个清单每年都会变。去年 Notion 占 80%，今年降到 20%。明年可能又不同。

重点不是"用什么工具"，而是**工具为目标服务，不是目标本身**。

如果你花更多时间配置工具而非使用它，换一个。

---

**你的清单是什么？有哪些工具是你离不开的？**
