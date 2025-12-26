#!/bin/bash
# 🧪 连接稳定性测试脚本 - 连续刷新 30 次，检查失败率

echo "========================================"
echo "🧪 连接稳定性测试"
echo "========================================"
echo ""
echo "测试目标: http://localhost:4331"
echo "测试次数: 30 次"
echo "测试间隔: 500ms"
echo ""

SUCCESS_COUNT=0
FAIL_COUNT=0
TOTAL_COUNT=30

echo "开始测试..."
echo ""

for i in $(seq 1 $TOTAL_COUNT); do
    # 使用 curl 测试连接
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4331 --max-time 5 2>/dev/null)

    if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "304" ]; then
        echo "[$i/$TOTAL_COUNT] ✅ 成功 (HTTP $HTTP_CODE)"
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
    else
        echo "[$i/$TOTAL_COUNT] ❌ 失败 (HTTP $HTTP_CODE)"
        FAIL_COUNT=$((FAIL_COUNT + 1))
    fi

    # 等待 500ms
    sleep 0.5
done

echo ""
echo "========================================"
echo "📊 测试结果"
echo "========================================"
echo ""
echo "总测试次数: $TOTAL_COUNT"
echo "成功次数: $SUCCESS_COUNT"
echo "失败次数: $FAIL_COUNT"
echo ""

SUCCESS_RATE=$(echo "scale=2; $SUCCESS_COUNT * 100 / $TOTAL_COUNT" | bc)
echo "成功率: ${SUCCESS_RATE}%"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
    echo "✅ 连接稳定！所有请求都成功"
    exit 0
elif [ $FAIL_COUNT -le 3 ]; then
    echo "⚠️  连接基本稳定，但有少量失败 ($FAIL_COUNT 次)"
    exit 0
else
    echo "❌ 连接不稳定！失败次数过多 ($FAIL_COUNT 次)"
    echo ""
    echo "建议："
    echo "1. 检查开发服务器是否正常运行"
    echo "2. 查看终端是否有错误日志"
    echo "3. 尝试重启开发服务器"
    exit 1
fi
