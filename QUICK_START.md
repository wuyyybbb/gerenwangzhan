# ⚡ 快速启动指南

## 🎯 目标
确保 http://localhost:4331 在 30 次连续刷新下都不出现 ERR_CONNECTION_REFUSED/RESET

## 🚀 立即开始

### 方式 1：使用启动脚本（推荐）

#### Windows PowerShell
```powershell
cd personal-map-site
.\start-dev.ps1
```

#### Git Bash / macOS / Linux
```bash
cd personal-map-site
./start-dev.sh
```

### 方式 2：使用 npm 命令

#### 干净启动（清理缓存）
```bash
cd personal-map-site
npm run dev:clean
```

#### 普通启动
```bash
cd personal-map-site
npm run dev
```

## ✅ 验证稳定性

### 步骤 1：等待服务器启动
看到以下输出说明启动成功：
```
🚀 astro v5.16.5 started in 123 ms

  ┃ Local   http://localhost:4331/
  ┃ Network use --host to expose
```

### 步骤 2：打开浏览器
访问：http://localhost:4331

### 步骤 3：运行自动化测试（新终端窗口）
```bash
cd personal-map-site
npm run test:connection
```

### 步骤 4：检查测试结果

**✅ 成功（目标达成）：**
```
成功率: 100.00%
✅ 连接稳定！所有请求都成功
```

**⚠️ 可接受（基本稳定）：**
```
成功率: 93.33%
⚠️ 连接基本稳定，但有少量失败 (2 次)
```

**❌ 失败（需要继续修复）：**
```
成功率: 60.00%
❌ 连接不稳定！失败次数过多 (12 次)
```

### 步骤 5：手动验证（可选）
在浏览器中连续刷新 30 次（Ctrl+F5 或 Cmd+Shift+R）：
- 打开 Chrome DevTools (F12)
- 切换到 Network 标签页
- 连续刷新，观察是否有红色失败请求

## 🐛 如果仍不稳定

### 快速修复检查清单

- [ ] **清理端口**
  ```bash
  # Windows Git Bash
  netstat -ano | grep :4331
  taskkill //F //PID <PID>
  ```

- [ ] **清理所有缓存**
  ```bash
  cd personal-map-site
  rm -rf .astro node_modules/.vite
  npm run dev
  ```

- [ ] **重装依赖**
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  npm run dev
  ```

- [ ] **检查防火墙/杀毒软件**
  - 临时关闭测试
  - 添加 Node.js 到白名单

- [ ] **增加 Node.js 内存**
  ```bash
  export NODE_OPTIONS="--max-old-space-size=4096"
  npm run dev
  ```

- [ ] **使用轮询模式（Windows）**

  编辑 `astro.config.mjs`:
  ```javascript
  watch: {
    usePolling: true,
    interval: 1000,
  }
  ```

## 📊 监控工具

### 1. 查看服务器日志
注意观察终端输出：
```
✅ 正常：[vite] page reload
⚠️ 警告：[vite] hmr update (x10 HMR calls in 2s)
❌ 错误：[astro] Error: ECONNRESET
```

### 2. 使用 Chrome DevTools
- F12 打开开发者工具
- Network 标签页
- 观察请求状态（绿色=成功，红色=失败）
- 查看失败请求的详细信息

### 3. 使用测试脚本
```bash
npm run test:connection
```

## 🎯 验收标准

**在继续开发之前，必须确认：**

1. ✅ 服务器能正常启动
2. ✅ 浏览器能访问 http://localhost:4331
3. ✅ 自动化测试成功率 ≥ 90%
4. ✅ 手动连续刷新 30 次无错误
5. ✅ Network 面板无红色失败请求
6. ✅ 修改文件后 HMR 正常工作

## ✅ 稳定后的下一步

验收标准通过后，回到 building/sign 显示问题调试：

1. **启用调试模式**
   ```
   按 D 键
   ```

2. **查看诊断报告**
   ```
   控制台会输出完整的容器状态
   ```

3. **分析问题**
   - childCount 是否 > 0？
   - getBoundingRect 是否 > 0？
   - 是否有"被遮挡"警告？

4. **按照 DEBUG_GUIDE.md 排查**
   ```
   参考 F:\resume\DEBUG_GUIDE.md
   ```

## 📚 相关文档

- **详细修复方案**：`F:\resume\STABILITY_FIX.md`
- **调试指南**：`F:\resume\DEBUG_GUIDE.md`

---

**最后更新：** 2025-12-26
