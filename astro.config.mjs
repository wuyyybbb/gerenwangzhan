// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  server: {
    // 🔧 稳定性修复：固定端口，避免端口冲突
    port: 4331,
    // 🔧 启用 host 监听，避免 localhost 解析问题
    host: true,
    // 🔧 禁用自动打开浏览器，减少并发请求
    open: false,
  },
  vite: {
    plugins: [tailwindcss()],
    // 🔧 优化文件监听和 HMR
    server: {
      // 增加 websocket 超时，避免频繁断开
      hmr: {
        timeout: 60000, // 60 秒超时
        overlay: true,
      },
      // 监听配置优化
      watch: {
        // 忽略 node_modules，减少文件监听数量
        ignored: ['**/node_modules/**', '**/.git/**'],
        // 使用轮询作为备选方案（Windows 下更稳定）
        usePolling: false,
      },
      // 预加载优化
      warmup: {
        // 预热关键文件，加快首次访问速度
        clientFiles: [
          './src/pages/index.astro',
          './src/layouts/BaseLayout.astro',
          './src/scripts/girl-runner.ts'
        ],
      },
    },
    // 🔧 优化依赖处理
    optimizeDeps: {
      // 排除 Sharp（图片处理库），避免二进制依赖问题
      exclude: ['sharp'],
    },
    // 🔧 构建优化
    build: {
      // 禁用源码映射，减少构建时间和内存占用
      sourcemap: false,
      // 增加 chunk 大小限制，减少文件数量
      chunkSizeWarningLimit: 1000,
      // 关闭 CSS 代码分割，减少请求数
      cssCodeSplit: false,
    },
    // 🔧 日志级别
    logLevel: 'info',
  },
});