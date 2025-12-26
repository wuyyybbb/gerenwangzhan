#!/bin/bash
# 🔧 稳定启动脚本 - 清理端口并启动 Astro 开发服务器

echo "========================================"
echo "🚀 启动 Astro 开发服务器"
echo "========================================"
echo ""

# 检查 Node.js 版本
echo "📌 检查 Node.js 版本..."
node --version
echo ""

# 清理端口 4331（Windows）
echo "🧹 清理端口 4331..."
if command -v netstat &> /dev/null; then
    # 查找占用端口的进程
    PORT_PID=$(netstat -ano | grep :4331 | awk '{print $5}' | head -n 1)
    if [ ! -z "$PORT_PID" ]; then
        echo "   找到占用进程 PID: $PORT_PID"
        taskkill //F //PID $PORT_PID 2>/dev/null || true
        echo "   ✅ 端口已清理"
        sleep 2
    else
        echo "   ✅ 端口未被占用"
    fi
else
    echo "   ⚠️  netstat 不可用，跳过端口清理"
fi
echo ""

# 清理 Astro 缓存
echo "🧹 清理 Astro 缓存..."
if [ -d ".astro" ]; then
    rm -rf .astro
    echo "   ✅ 缓存已清理"
else
    echo "   ✅ 无缓存需要清理"
fi
echo ""

# 清理 Vite 缓存
echo "🧹 清理 Vite 缓存..."
if [ -d "node_modules/.vite" ]; then
    rm -rf node_modules/.vite
    echo "   ✅ Vite 缓存已清理"
else
    echo "   ✅ 无 Vite 缓存需要清理"
fi
echo ""

# 启动开发服务器
echo "========================================"
echo "🚀 启动开发服务器 (端口 4331)"
echo "========================================"
echo ""
echo "📌 提示："
echo "   - 服务器启动后，访问: http://localhost:4331"
echo "   - 按 Ctrl+C 停止服务器"
echo "   - 按 D 键开启调试模式"
echo ""

# 启动 npm run dev
npm run dev
