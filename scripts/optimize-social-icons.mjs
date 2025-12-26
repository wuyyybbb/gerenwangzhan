/**
 * 社交媒体图标专用优化脚本
 *
 * 功能：
 * 1. 激进优化 SVG（去除所有冗余）
 * 2. 转换为 WebP（高质量压缩）
 * 3. 转换为 AVIF（最高压缩率）
 */

import { optimize } from 'svgo';
import sharp from 'sharp';
import { readFile, writeFile, readdir } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MAP_DIR = join(__dirname, '../public/map');

// 目标社交图标文件名
const SOCIAL_ICONS = [
  'github.svg',
  'wechat.svg',
  'bilibili.svg',
  'xiaohongshu.svg',
  'email.svg',
  'gongzhonghao.svg',
  'resume.svg',
];

// 🔧 激进的 SVGO 配置（专为图标设计）
const svgoConfig = {
  multipass: true, // 多次优化
  floatPrecision: 1, // 只保留 1 位小数
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false, // 保留 viewBox
          cleanupIds: {
            minify: true,
            remove: true,
            preserve: [],
          },
          convertPathData: {
            floatPrecision: 1, // 路径精度降到 1 位小数
            transformPrecision: 1,
            removeUseless: true,
            collapseRepeated: true,
            utilizeAbsolute: true,
            leadingZero: true,
            negativeExtraSpace: true,
            makeArcs: {
              threshold: 2.5, // 转换为弧线
              tolerance: 0.5,
            },
          },
          convertShapeToPath: true, // 转换形状为路径
          mergePaths: true, // 合并路径
          convertTransform: true, // 转换 transform
          removeUselessStrokeAndFill: true,
          removeUnusedNS: true,
          cleanupNumericValues: {
            floatPrecision: 1,
          },
          collapseGroups: true, // 折叠组
        },
      },
    },
    'removeDoctype',
    'removeXMLProcInst',
    'removeComments',
    'removeMetadata',
    'removeEditorsNSData',
    'cleanupAttrs',
    'mergeStyles',
    'inlineStyles',
    'minifyStyles',
    'cleanupIds',
    'removeUselessDefs',
    'cleanupNumericValues',
    'convertColors',
    'removeUnknownsAndDefaults',
    'removeNonInheritableGroupAttrs',
    'removeUselessStrokeAndFill',
    'removeHiddenElems',
    'removeEmptyText',
    'convertShapeToPath',
    'convertEllipseToCircle',
    'moveElemsAttrsToGroup',
    'moveGroupAttrsToElems',
    'collapseGroups',
    'convertPathData',
    'convertTransform',
    'removeEmptyAttrs',
    'removeEmptyContainers',
    'mergePaths',
    'removeUnusedNS',
    'sortDefsChildren',
    'removeTitle',
    'removeDesc',
    {
      name: 'removeAttrs',
      params: {
        attrs: [
          'data-name',
          'data-.*',
          'fill-rule',
          'clip-rule',
          'stroke.*',
          'opacity',
        ],
      },
    },
  ],
};

/**
 * 优化单个 SVG 文件
 */
async function optimizeSVG(filePath, fileName) {
  try {
    console.log(`\n🔧 处理: ${fileName}`);

    const svgString = await readFile(filePath, 'utf8');
    const originalSize = Buffer.byteLength(svgString, 'utf8');
    console.log(`   📦 原始大小: ${(originalSize / 1024).toFixed(1)} KB`);

    // 优化 SVG
    const result = optimize(svgString, {
      path: filePath,
      ...svgoConfig,
    });

    if (result.error) {
      console.error(`   ❌ 优化失败: ${result.error}`);
      return false;
    }

    const optimizedSvg = result.data;
    const optimizedSize = Buffer.byteLength(optimizedSvg, 'utf8');
    const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);

    // 保存优化后的 SVG
    await writeFile(filePath, optimizedSvg, 'utf8');
    console.log(`   ✅ 优化完成: ${(optimizedSize / 1024).toFixed(1)} KB (节省 ${savings}%)`);

    return true;
  } catch (error) {
    console.error(`   ❌ 处理失败:`, error.message);
    return false;
  }
}

/**
 * 转换为 WebP
 */
async function convertToWebP(svgPath, baseName) {
  try {
    const outputPath = join(MAP_DIR, `${baseName}.webp`);

    // SVG → PNG → WebP（确保质量）
    const pngBuffer = await sharp(svgPath)
      .resize(512, 512, { // 固定尺寸：512x512
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toBuffer();

    await sharp(pngBuffer)
      .webp({
        quality: 90, // 高质量
        alphaQuality: 100,
        lossless: false,
        effort: 6, // 最大压缩努力
      })
      .toFile(outputPath);

    const stats = await sharp(outputPath).metadata();
    console.log(`   ✅ WebP 生成: ${(stats.size / 1024).toFixed(1)} KB (${stats.width}x${stats.height})`);

    return true;
  } catch (error) {
    console.error(`   ❌ WebP 转换失败:`, error.message);
    return false;
  }
}

/**
 * 转换为 AVIF
 */
async function convertToAVIF(svgPath, baseName) {
  try {
    const outputPath = join(MAP_DIR, `${baseName}.avif`);

    await sharp(svgPath)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .avif({
        quality: 80, // AVIF 可以用更低的 quality 达到同样效果
        effort: 9, // 最大压缩努力
        chromaSubsampling: '4:4:4', // 保留色彩细节
      })
      .toFile(outputPath);

    const stats = await sharp(outputPath).metadata();
    console.log(`   ✅ AVIF 生成: ${(stats.size / 1024).toFixed(1)} KB (${stats.width}x${stats.height})`);

    return true;
  } catch (error) {
    console.error(`   ❌ AVIF 转换失败:`, error.message);
    return false;
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('🎨 ========================================');
  console.log('🎨 社交媒体图标优化工具');
  console.log('🎨 ========================================\n');
  console.log(`📁 目录: ${MAP_DIR}\n`);

  let successCount = 0;
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;

  for (const iconFileName of SOCIAL_ICONS) {
    const filePath = join(MAP_DIR, iconFileName);
    const baseName = basename(iconFileName, '.svg');

    try {
      // 读取原始大小
      const originalContent = await readFile(filePath, 'utf8');
      const originalSize = Buffer.byteLength(originalContent, 'utf8');
      totalOriginalSize += originalSize;

      // 步骤 1: 优化 SVG
      const svgSuccess = await optimizeSVG(filePath, iconFileName);
      if (!svgSuccess) continue;

      // 读取优化后的大小
      const optimizedContent = await readFile(filePath, 'utf8');
      const optimizedSize = Buffer.byteLength(optimizedContent, 'utf8');
      totalOptimizedSize += optimizedSize;

      // 步骤 2: 转换为 WebP
      await convertToWebP(filePath, baseName);

      // 步骤 3: 转换为 AVIF
      await convertToAVIF(filePath, baseName);

      successCount++;
    } catch (error) {
      console.error(`\n❌ 跳过 ${iconFileName}:`, error.message);
    }
  }

  // 总结
  console.log('\n');
  console.log('🎉 ========================================');
  console.log('🎉 优化完成！');
  console.log('🎉 ========================================\n');
  console.log(`📊 处理统计:`);
  console.log(`   ✅ 成功: ${successCount}/${SOCIAL_ICONS.length} 个图标`);
  console.log(`   📦 原始 SVG 总大小: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   📦 优化 SVG 总大小: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)} MB`);

  if (totalOriginalSize > 0) {
    const totalSavings = ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(1);
    console.log(`   💾 总共节省: ${totalSavings}% (${((totalOriginalSize - totalOptimizedSize) / 1024).toFixed(1)} KB)`);
  }

  console.log('\n✨ 建议：');
  console.log('   1. 检查优化后的 SVG 是否显示正常');
  console.log('   2. 在浏览器中测试 WebP/AVIF 加载速度');
  console.log('   3. 如果图标变形，可以降低 floatPrecision');
}

main().catch(console.error);
