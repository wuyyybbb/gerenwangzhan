#!/bin/bash
echo "🔍 检查所有引用的图片文件是否存在..."
echo ""

# 定义要检查的图片列表
images=(
  "public/map/background.webp"
  "public/map/core_building.svg"
  "public/map/workshop_building.svg"
  "public/map/workshop_sign.svg"
  "public/map/knowledge_building.svg"
  "public/map/knowledge_sign.svg"
  "public/map/archives_building.svg"
  "public/map/archives_sign.svg"
  "public/map/command_building.svg"
  "public/map/command_sign.svg"
  "public/map/resume.svg"
  "public/map/bilibili.svg"
  "public/map/github.svg"
  "public/map/gongzhonghao.svg"
  "public/map/email.svg"
  "public/map/xiaohongshu.svg"
  "public/map/wechat.svg"
  "public/girl/girl.svg"
  "public/map/qrcode.png"
)

missing_count=0
success_count=0

for img in "${images[@]}"; do
  if [ -f "$img" ]; then
    echo "✅ $img"
    ((success_count++))
  else
    echo "❌ $img - 文件不存在！"
    ((missing_count++))
  fi
done

echo ""
echo "📊 检查结果："
echo "   ✅ 存在: $success_count"
echo "   ❌ 缺失: $missing_count"

if [ $missing_count -eq 0 ]; then
  echo ""
  echo "🎉 所有图片文件都存在！"
  exit 0
else
  echo ""
  echo "⚠️  发现缺失的图片文件，请补充！"
  exit 1
fi
