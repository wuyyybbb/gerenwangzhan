/**
 * 图片优化脚本
 * 功能：将 background.webp 转换为多格式多尺寸版本
 *
 * 生成的文件：
 * - background.avif (桌面端 AVIF, 目标 <300KB)
 * - background.webp (桌面端 WebP, 已存在但可重新压缩)
 * - background-mobile.avif (移动端 AVIF, 目标 <150KB)
 * - background-mobile.webp (移动端 WebP, 目标 <150KB)
 * - background-placeholder.webp (LQIP 占位图, 10-20KB, 模糊)
 */

import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const INPUT_FILE = join(__dirname, '../public/map/background.webp');
const OUTPUT_DIR = join(__dirname, '../public/map');

// 配置
const configs = [
  {
    name: 'background.avif',
    width: 1376, // 桌面端原始宽度
    format: 'avif',
    quality: 60, // AVIF 60 质量通常等同于 WebP 80
    effort: 6, // 0-9，越高压缩越好但越慢
  },
  {
    name: 'background.webp',
    width: 1376,
    format: 'webp',
    quality: 75, // 重新压缩 WebP
  },
  {
    name: 'background-mobile.avif',
    width: 768, // 移动端宽度
    format: 'avif',
    quality: 55,
    effort: 6,
  },
  {
    name: 'background-mobile.webp',
    width: 768,
    format: 'webp',
    quality: 70,
  },
  {
    name: 'background-placeholder.webp',
    width: 100, // 极小宽度 (会被拉伸，所以会很模糊)
    format: 'webp',
    quality: 40, // 低质量
    blur: 5, // 添加模糊效果
  },
];

async function optimizeImage(config) {
  const outputPath = join(OUTPUT_DIR, config.name);

  console.log(`\n📸 正在生成: ${config.name}`);
  console.log(`   尺寸: ${config.width}px 宽`);
  console.log(`   格式: ${config.format.toUpperCase()}`);
  console.log(`   质量: ${config.quality}`);
  if (config.blur) {
    console.log(`   模糊: ${config.blur}px (LQIP 占位图)`);
  }

  try {
    const pipeline = sharp(INPUT_FILE)
      .resize({
        width: config.width,
        height: null, // 保持宽高比
        fit: 'inside',
        withoutEnlargement: true,
      });

    // 如果需要模糊效果（LQIP）
    if (config.blur) {
      pipeline.blur(config.blur);
    }

    // 根据格式配置输出
    if (config.format === 'avif') {
      await pipeline
        .avif({
          quality: config.quality,
          effort: config.effort,
          chromaSubsampling: '4:2:0',
        })
        .toFile(outputPath);
    } else if (config.format === 'webp') {
      await pipeline
        .webp({
          quality: config.quality,
          effort: 6,
        })
        .toFile(outputPath);
    }

    // 获取文件大小
    const metadata = await sharp(outputPath).metadata();
    const stats = await import('fs').then(fs => fs.promises.stat(outputPath));
    const sizeKB = (stats.size / 1024).toFixed(1);

    console.log(`   ✅ 成功！文件大小: ${sizeKB} KB`);
    console.log(`   尺寸: ${metadata.width}x${metadata.height}px`);

    // 检查是否超过目标大小
    if (config.name.includes('placeholder')) {
      if (stats.size > 20 * 1024) {
        console.log(`   ⚠️  警告：占位图超过 20KB，建议降低质量或宽度`);
      } else {
        console.log(`   🎉 占位图大小完美！(< 20KB)`);
      }
    } else {
      const targetSize = config.width === 768 ? 150 : 300;
      if (stats.size / 1024 > targetSize) {
        console.log(`   ⚠️  警告：文件大小超过目标 ${targetSize}KB，建议降低质量`);
      }
    }
  } catch (error) {
    console.error(`   ❌ 失败:`, error.message);
  }
}

async function main() {
  console.log('🎨 开始优化背景图片...\n');
  console.log(`📁 输入文件: ${INPUT_FILE}`);
  console.log(`📁 输出目录: ${OUTPUT_DIR}`);

  for (const config of configs) {
    await optimizeImage(config);
  }

  console.log('\n🎉 所有图片优化完成！');
  console.log('\n📊 建议检查：');
  console.log('   1. 查看生成的文件大小是否符合预期');
  console.log('   2. 在浏览器中测试视觉质量');
  console.log('   3. 特别检查 background-placeholder.webp 是否 < 20KB');
}

main().catch(console.error);
