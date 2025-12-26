/**
 * SVG → WebP/AVIF 转换脚本
 *
 * 功能：将所有大型 SVG 文件转换为 WebP 和 AVIF 格式
 * 根据实际显示尺寸导出，大幅减小文件体积
 *
 * 目标：单个文件 < 100KB
 */

import sharp from 'sharp';
import { readdir } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MAP_DIR = join(__dirname, '../public/map');
const GIRL_DIR = join(__dirname, '../public/girl');

// 根据代码中的实际显示尺寸配置
// rect.w 是宽度，transform.scale 是缩放系数
// 实际显示宽度 = rect.w * transform.scale
const SVG_CONFIGS = {
  // 核心建筑
  'core_building.svg': {
    dir: 'map',
    width: 280, // 200 * 1.4 = 280px
    quality: 75,
  },

  // 地标建筑
  'workshop_building.svg': {
    dir: 'map',
    width: 336, // 240 * 1.4 = 336px
    quality: 75,
  },
  'knowledge_building.svg': {
    dir: 'map',
    width: 390, // 300 * 1.3 = 390px
    quality: 75,
  },
  'archives_building.svg': {
    dir: 'map',
    width: 416, // 320 * 1.3 = 416px
    quality: 75,
  },
  'command_building.svg': {
    dir: 'map',
    width: 288, // 360 * 0.8 = 288px
    quality: 75,
  },

  // 标牌（更小，可以用更高质量）
  'workshop_sign.svg': {
    dir: 'map',
    width: 280, // 140 * 2.0 = 280px
    quality: 80,
  },
  'knowledge_sign.svg': {
    dir: 'map',
    width: 252, // 140 * 1.8 = 252px
    quality: 80,
  },
  'archives_sign.svg': {
    dir: 'map',
    width: 280, // 200 * 1.4 = 280px
    quality: 80,
  },
  'command_sign.svg': {
    dir: 'map',
    width: 280, // 200 * 1.4 = 280px
    quality: 80,
  },

  // 其他
  'resume.svg': {
    dir: 'map',
    width: 500, // 原始宽度
    quality: 80,
  },

  // 小人角色
  'girl.svg': {
    dir: 'girl',
    width: 144, // 72px * 2 for retina
    quality: 80,
  },

  // 社交图标（小图标，高质量）
  'bilibili.svg': {
    dir: 'map',
    width: 64, // 32px * 2 for retina
    quality: 85,
  },
  'github.svg': {
    dir: 'map',
    width: 64,
    quality: 85,
  },
  'gongzhonghao.svg': {
    dir: 'map',
    width: 64,
    quality: 85,
  },
  'email.svg': {
    dir: 'map',
    width: 64,
    quality: 85,
  },
  'xiaohongshu.svg': {
    dir: 'map',
    width: 64,
    quality: 85,
  },
  'wechat.svg': {
    dir: 'map',
    width: 64,
    quality: 85,
  },
};

async function convertSVG(svgPath, fileName, config, outputDir) {
  const baseName = basename(fileName, '.svg');
  const webpPath = join(outputDir, `${baseName}.webp`);
  const avifPath = join(outputDir, `${baseName}.avif`);

  console.log(`\n📸 转换: ${fileName}`);
  console.log(`   目标宽度: ${config.width}px`);

  try {
    // 转换为 WebP
    await sharp(svgPath)
      .resize({
        width: config.width,
        height: null, // 保持宽高比
        fit: 'inside',
      })
      .webp({
        quality: config.quality,
        effort: 6,
      })
      .toFile(webpPath);

    const webpStats = await import('fs').then(fs => fs.promises.stat(webpPath));
    const webpSizeKB = (webpStats.size / 1024).toFixed(1);
    console.log(`   ✅ WebP: ${webpSizeKB} KB`);

    // 转换为 AVIF
    await sharp(svgPath)
      .resize({
        width: config.width,
        height: null,
        fit: 'inside',
      })
      .avif({
        quality: config.quality - 10, // AVIF 质量可以低一点
        effort: 6,
        chromaSubsampling: '4:2:0',
      })
      .toFile(avifPath);

    const avifStats = await import('fs').then(fs => fs.promises.stat(avifPath));
    const avifSizeKB = (avifStats.size / 1024).toFixed(1);
    console.log(`   ✅ AVIF: ${avifSizeKB} KB`);

    // 检查是否超过 100KB 目标
    if (webpStats.size > 100 * 1024) {
      console.log(`   ⚠️  WebP 超过 100KB，建议降低质量`);
    }
    if (avifStats.size > 100 * 1024) {
      console.log(`   ⚠️  AVIF 超过 100KB，建议降低质量`);
    }

    return {
      original: fileName,
      webpSize: webpStats.size,
      avifSize: avifStats.size,
    };
  } catch (error) {
    console.error(`   ❌ 转换失败: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('🎨 开始将 SVG 转换为 WebP/AVIF...\n');

  let totalOriginalSize = 0;
  let totalWebpSize = 0;
  let totalAvifSize = 0;
  let convertedCount = 0;

  for (const [fileName, config] of Object.entries(SVG_CONFIGS)) {
    const sourceDir = config.dir === 'girl' ? GIRL_DIR : MAP_DIR;
    const outputDir = sourceDir;
    const svgPath = join(sourceDir, fileName);

    console.log(`📁 处理: ${config.dir}/${fileName}`);

    try {
      // 获取原始 SVG 大小
      const originalStats = await import('fs').then(fs => fs.promises.stat(svgPath));
      totalOriginalSize += originalStats.size;

      const result = await convertSVG(svgPath, fileName, config, outputDir);

      if (result) {
        totalWebpSize += result.webpSize;
        totalAvifSize += result.avifSize;
        convertedCount++;
      }
    } catch (error) {
      console.warn(`   ⚠️  跳过 ${fileName}: ${error.message}`);
    }
  }

  console.log('\n🎉 转换完成！');
  console.log(`\n📊 总体统计:`);
  console.log(`   转换文件数: ${convertedCount}`);
  console.log(`   原始 SVG 总大小: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   WebP 总大小: ${(totalWebpSize / 1024).toFixed(1)} KB`);
  console.log(`   AVIF 总大小: ${(totalAvifSize / 1024).toFixed(1)} KB`);
  console.log(`   WebP 节省: ${((totalOriginalSize - totalWebpSize) / totalOriginalSize * 100).toFixed(1)}%`);
  console.log(`   AVIF 节省: ${((totalOriginalSize - totalAvifSize) / totalOriginalSize * 100).toFixed(1)}%`);

  console.log('\n💡 下一步：');
  console.log('   1. 检查生成的图片质量是否可接受');
  console.log('   2. 更新 HTML 中的图片引用（.svg → .webp/.avif）');
  console.log('   3. 重新测试性能');
}

main().catch(console.error);
