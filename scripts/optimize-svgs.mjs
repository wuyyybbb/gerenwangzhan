/**
 * SVG 优化脚本
 * 功能：压缩所有地图建筑 SVG 文件，减少文件大小
 *
 * 使用 SVGO 进行优化，移除：
 * - 不必要的元数据
 * - 编辑器数据
 * - 注释
 * - 隐藏元素
 * - 空属性
 * - 优化路径
 */

import { optimize } from 'svgo';
import { readFile, writeFile, readdir } from 'fs/promises';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MAP_DIR = join(__dirname, '../public/map');

// SVGO 配置 - 激进的压缩策略
const config = {
  multipass: true, // 多次优化以获得更好的压缩
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // 保留 viewBox（重要！）
          removeViewBox: false,
          // 移除不必要的组标签
          collapseGroups: true,
          // 合并路径
          mergePaths: true,
          // 清理属性
          cleanupIds: {
            minify: true,
            remove: true,
            preserve: [],
          },
        },
      },
    },
    // 移除编辑器特定元数据
    'removeEditorsNSData',
    // 移除隐藏元素
    'removeHiddenElems',
    // 移除空属性
    'removeEmptyAttrs',
    // 移除空容器
    'removeEmptyContainers',
    // 移除不必要的属性
    'removeUselessDefs',
    // 清理数值
    {
      name: 'cleanupNumericValues',
      params: {
        floatPrecision: 2, // 保留2位小数
      },
    },
    // 简化路径
    {
      name: 'convertPathData',
      params: {
        floatPrecision: 2,
        transformPrecision: 2,
        removeUseless: true,
        collapseRepeated: true,
        utilizeAbsolute: true,
        leadingZero: true,
        negativeExtraSpace: true,
      },
    },
    // 移除未使用的命名空间
    'removeUnusedNS',
    // 排序属性
    'sortAttrs',
  ],
};

async function optimizeSVG(filePath, fileName) {
  try {
    const svgString = await readFile(filePath, 'utf8');
    const originalSize = Buffer.byteLength(svgString, 'utf8');

    const result = optimize(svgString, {
      path: filePath,
      ...config,
    });

    if (result.error) {
      console.error(`   ❌ 优化失败: ${result.error}`);
      return;
    }

    const optimizedSvg = result.data;
    const optimizedSize = Buffer.byteLength(optimizedSvg, 'utf8');
    const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);

    // 只有在文件变小时才保存（防止意外）
    if (optimizedSize < originalSize) {
      await writeFile(filePath, optimizedSvg, 'utf8');
      console.log(`   ✅ ${fileName}`);
      console.log(`      原始: ${(originalSize / 1024).toFixed(1)} KB`);
      console.log(`      优化: ${(optimizedSize / 1024).toFixed(1)} KB`);
      console.log(`      节省: ${savings}% (${((originalSize - optimizedSize) / 1024).toFixed(1)} KB)`);
    } else {
      console.log(`   ⚠️  ${fileName} - 优化后反而更大，跳过`);
    }
  } catch (error) {
    console.error(`   ❌ 处理 ${fileName} 失败:`, error.message);
  }
}

async function main() {
  console.log('🎨 开始优化 SVG 文件...\n');
  console.log(`📁 目录: ${MAP_DIR}\n`);

  try {
    const files = await readdir(MAP_DIR);
    const svgFiles = files.filter(file => extname(file).toLowerCase() === '.svg');

    if (svgFiles.length === 0) {
      console.log('⚠️  未找到 SVG 文件');
      return;
    }

    console.log(`📊 找到 ${svgFiles.length} 个 SVG 文件\n`);

    let totalOriginalSize = 0;
    let totalOptimizedSize = 0;

    for (const file of svgFiles) {
      const filePath = join(MAP_DIR, file);
      const originalSize = Buffer.byteLength(await readFile(filePath, 'utf8'), 'utf8');
      totalOriginalSize += originalSize;

      await optimizeSVG(filePath, file);

      const optimizedSize = Buffer.byteLength(await readFile(filePath, 'utf8'), 'utf8');
      totalOptimizedSize += optimizedSize;

      console.log('');
    }

    const totalSavings = ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(1);

    console.log('\n🎉 所有 SVG 优化完成！');
    console.log(`📊 总体统计:`);
    console.log(`   原始总大小: ${(totalOriginalSize / 1024).toFixed(1)} KB`);
    console.log(`   优化总大小: ${(totalOptimizedSize / 1024).toFixed(1)} KB`);
    console.log(`   总共节省: ${totalSavings}% (${((totalOriginalSize - totalOptimizedSize) / 1024).toFixed(1)} KB)`);
  } catch (error) {
    console.error('❌ 读取目录失败:', error);
  }
}

main().catch(console.error);
