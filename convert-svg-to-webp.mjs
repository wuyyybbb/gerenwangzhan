#!/usr/bin/env node
/**
 * SVG → WebP + AVIF 转换脚本
 * 目标：building<80KB, sign<50KB, girl<80KB
 */

import sharp from 'sharp';
import { readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 配置：文件列表和目标体积
const config = [
  // Buildings (target: <80KB)
  {
    input: 'public/map/core_building.svg',
    outputBase: 'public/map/core_building',
    width: 400, // 2x of design (200px)
    targetKB: 80,
    webpQuality: 82,
    avifQuality: 70,
  },
  {
    input: 'public/map/workshop_building.svg',
    outputBase: 'public/map/workshop_building',
    width: 480, // 2x of design (240px)
    targetKB: 80,
    webpQuality: 82,
    avifQuality: 70,
  },
  {
    input: 'public/map/knowledge_building.svg',
    outputBase: 'public/map/knowledge_building',
    width: 600, // 2x of design (300px)
    targetKB: 80,
    webpQuality: 82,
    avifQuality: 70,
  },
  {
    input: 'public/map/archives_building.svg',
    outputBase: 'public/map/archives_building',
    width: 640, // 2x of design (320px)
    targetKB: 80,
    webpQuality: 82,
    avifQuality: 70,
  },
  {
    input: 'public/map/command_building.svg',
    outputBase: 'public/map/command_building',
    width: 720, // 2x of design (360px)
    targetKB: 80,
    webpQuality: 82,
    avifQuality: 70,
  },

  // Signs (target: <50KB)
  {
    input: 'public/map/workshop_sign.svg',
    outputBase: 'public/map/workshop_sign',
    width: 280, // 2x of design (140px)
    targetKB: 50,
    webpQuality: 82,
    avifQuality: 70,
  },
  {
    input: 'public/map/knowledge_sign.svg',
    outputBase: 'public/map/knowledge_sign',
    width: 280, // 2x of design (140px)
    targetKB: 50,
    webpQuality: 82,
    avifQuality: 70,
  },
  {
    input: 'public/map/archives_sign.svg',
    outputBase: 'public/map/archives_sign',
    width: 400, // 2x of design (200px)
    targetKB: 50,
    webpQuality: 82,
    avifQuality: 70,
  },
  {
    input: 'public/map/command_sign.svg',
    outputBase: 'public/map/command_sign',
    width: 400, // 2x of design (200px)
    targetKB: 50,
    webpQuality: 82,
    avifQuality: 70,
  },

  // Girl character (target: <80KB)
  {
    input: 'public/girl/girl.svg',
    outputBase: 'public/girl/girl',
    width: 144, // 2x of design (72px)
    targetKB: 80,
    webpQuality: 82,
    avifQuality: 70,
  },
];

async function convertFile(item) {
  const inputPath = join(__dirname, item.input);
  const webpPath = `${join(__dirname, item.outputBase)}.webp`;
  const avifPath = `${join(__dirname, item.outputBase)}.avif`;

  console.log(`\n🔄 Converting: ${item.input}`);
  console.log(`   Target: <${item.targetKB}KB, Width: ${item.width}px`);

  if (!existsSync(inputPath)) {
    console.error(`   ❌ File not found: ${inputPath}`);
    return;
  }

  try {
    // 读取 SVG
    const svgBuffer = readFileSync(inputPath);
    const image = sharp(svgBuffer);

    // 获取 SVG 元数据
    const metadata = await image.metadata();

    // 计算高度（保持宽高比）
    const height = Math.round(item.width * (metadata.height / metadata.width));

    console.log(`   📐 Original: ${metadata.width}x${metadata.height}, Output: ${item.width}x${height}`);

    // 转换为 WebP
    await image
      .clone()
      .resize(item.width, height, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 } // 透明背景
      })
      .webp({
        quality: item.webpQuality,
        alphaQuality: 100, // Alpha 通道质量
        lossless: false,
      })
      .toFile(webpPath);

    const webpStats = await sharp(webpPath).metadata();
    const webpSize = (await import('fs')).statSync(webpPath).size;
    console.log(`   ✅ WebP: ${(webpSize / 1024).toFixed(2)} KB ${webpSize / 1024 < item.targetKB ? '✓' : '⚠️ OVER TARGET'}`);

    // 转换为 AVIF
    await image
      .clone()
      .resize(item.width, height, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .avif({
        quality: item.avifQuality,
        lossless: false,
      })
      .toFile(avifPath);

    const avifStats = await sharp(avifPath).metadata();
    const avifSize = (await import('fs')).statSync(avifPath).size;
    console.log(`   ✅ AVIF: ${(avifSize / 1024).toFixed(2)} KB ${avifSize / 1024 < item.targetKB ? '✓' : '⚠️ OVER TARGET'}`);

  } catch (err) {
    console.error(`   ❌ Error: ${err.message}`);
  }
}

async function main() {
  console.log('🚀 Starting SVG → WebP + AVIF conversion...\n');
  console.log('📊 Summary:');
  console.log(`   Files to convert: ${config.length}`);
  console.log(`   Target total size: ~${config.reduce((sum, item) => sum + item.targetKB, 0)} KB`);

  for (const item of config) {
    await convertFile(item);
  }

  console.log('\n✨ Conversion complete!');
  console.log('\n📋 Next steps:');
  console.log('   1. Check file sizes in public/map/ and public/girl/');
  console.log('   2. Update HTML to use WebP/AVIF instead of SVG');
  console.log('   3. Test in browser');
}

main().catch(console.error);
