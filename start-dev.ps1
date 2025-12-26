# 🔧 稳定启动脚本 - 清理端口并启动 Astro 开发服务器

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🚀 启动 Astro 开发服务器" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Node.js 版本
Write-Host "📌 检查 Node.js 版本..." -ForegroundColor Yellow
$nodeVersion = node --version
Write-Host "   Node.js: $nodeVersion" -ForegroundColor Green
Write-Host ""

# 清理端口 4331
Write-Host "🧹 清理端口 4331..." -ForegroundColor Yellow
$process = Get-NetTCPConnection -LocalPort 4331 -ErrorAction SilentlyContinue
if ($process) {
    $pid = $process.OwningProcess
    Write-Host "   找到占用进程 PID: $pid" -ForegroundColor Yellow
    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    Write-Host "   ✅ 端口已清理" -ForegroundColor Green
    Start-Sleep -Seconds 2
} else {
    Write-Host "   ✅ 端口未被占用" -ForegroundColor Green
}
Write-Host ""

# 清理 Astro 缓存
Write-Host "🧹 清理 Astro 缓存..." -ForegroundColor Yellow
if (Test-Path ".astro") {
    Remove-Item -Recurse -Force ".astro" -ErrorAction SilentlyContinue
    Write-Host "   ✅ 缓存已清理" -ForegroundColor Green
} else {
    Write-Host "   ✅ 无缓存需要清理" -ForegroundColor Green
}
Write-Host ""

# 清理 node_modules/.vite 缓存
Write-Host "🧹 清理 Vite 缓存..." -ForegroundColor Yellow
if (Test-Path "node_modules/.vite") {
    Remove-Item -Recurse -Force "node_modules/.vite" -ErrorAction SilentlyContinue
    Write-Host "   ✅ Vite 缓存已清理" -ForegroundColor Green
} else {
    Write-Host "   ✅ 无 Vite 缓存需要清理" -ForegroundColor Green
}
Write-Host ""

# 启动开发服务器
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🚀 启动开发服务器 (端口 4331)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📌 提示：" -ForegroundColor Yellow
Write-Host "   - 服务器启动后，访问: http://localhost:4331" -ForegroundColor Yellow
Write-Host "   - 按 Ctrl+C 停止服务器" -ForegroundColor Yellow
Write-Host "   - 按 D 键开启调试模式" -ForegroundColor Yellow
Write-Host ""

# 启动 npm run dev
npm run dev
