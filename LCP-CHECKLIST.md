# 🎯 LCP 优化检查清单

## ✅ 第 3 步完成：LCP 锁定到 background.webp

### 1️⃣ img.map-background 配置确认

**HTML 属性**（`src/pages/index.astro:106-115`）：
```html
<img
  class="map-background"
  src="/map/background.webp"
  alt="Interactive Map Background"
  loading="eager"              ✅ 首屏立即加载
  fetchpriority="high"         ✅ 最高优先级
  decoding="async"             ✅ 异步解码
  data-lcp-target              ✅ LCP 标记
  onerror="..."                ✅ 错误处理（无 opacity:0）
/>
```

**CSS 样式**（`src/pages/index.astro:658-669`）：
```css
.map-background {
  position: absolute;
  left: 0;
  top: 0;
  width: 1376px;
  height: 768px;
  object-fit: fill;
  display: block;             ✅ 无 display:none
  pointer-events: none;
  z-index: 1;                 ✅ 最底层，最先渲染
}
```

**Preload 配置**（`src/layouts/BaseLayout.astro:24-33`）：
```html
<link
  rel="preload"
  as="image"
  href="/map/background.webp"
  imagesizes="100vw"
  fetchpriority="high"
/>
```

### 2️⃣ Hero 容器检查

**主标题**（不影响 LCP）：
- ✅ 纯文本内容
- ✅ 字体大小适中（1rem + 1.85rem）
- ✅ 无大块背景色
- ✅ pointer-events: none

**其他元素**：
- ✅ 所有建筑图片：延迟加载（IntersectionObserver）
- ✅ 所有标牌：延迟加载
- ✅ 社交图标：延迟加载
- ✅ Girl 角色：延迟加载

### 3️⃣ 隐藏元素检查

**没有以下干扰因素**：
- ❌ 无 display: none 的大图
- ❌ 无 opacity: 0 的首屏元素
- ❌ 无巨大的隐藏 block
- ❌ 无延迟显示的 splash screen

### 4️⃣ LCP 监控代码

**已添加 Performance Observer**（`src/pages/index.astro:1165-1199`）：
```javascript
const lcpObserver = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  const lastEntry = entries[entries.length - 1];

  console.log('📊 LCP 检测结果:');
  console.log(`  ⏱️  时间: ${lastEntry.renderTime || lastEntry.loadTime}ms`);
  console.log(`  🎯 元素:`, lastEntry.element);
  console.log(`  📏 尺寸: ${lastEntry.size}px²`);

  const isBackgroundImg = lastEntry.element?.classList?.contains('map-background');
  if (isBackgroundImg) {
    console.log('  ✅ LCP 已正确锁定到背景图！');
  } else {
    console.warn('  ⚠️  LCP 不是背景图，请检查！');
  }
});

lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
```

## 📋 验证步骤

### 方法 1：浏览器 DevTools

1. 打开 **Chrome DevTools** → **Performance** 标签
2. 点击 **Reload** 按钮（或 Ctrl+Shift+E）
3. 等待页面加载完成
4. 查找 **LCP** 标记
5. 确认 LCP element 是 `img.map-background`

### 方法 2：Console 日志

1. 打开 **Console** 标签
2. 刷新页面
3. 查找输出：
   ```
   📊 LCP 检测结果:
     ⏱️  时间: XXXms
     🎯 元素: <img class="map-background" ...>
     📏 尺寸: XXXXXpx²
     ✅ LCP 已正确锁定到背景图！
   ```

### 方法 3：Lighthouse

1. 打开 **Lighthouse** 标签
2. 选择 **Performance** 类别
3. 点击 **Analyze page load**
4. 查看 **Largest Contentful Paint** 指标
5. 点击查看详情，确认是 `background.webp`

## 🎯 预期结果

- ✅ LCP element: `img.map-background`
- ✅ LCP 时间: < 2.5s（良好）
- ✅ 无其他大元素干扰
- ✅ Console 显示正确的 LCP 信息

## 🚀 性能目标

| 指标 | 目标 | 说明 |
|------|------|------|
| LCP | < 2.5s | 良好 |
| FID | < 100ms | 良好 |
| CLS | < 0.1 | 良好 |

## 📝 备注

- 背景图尺寸：1376×768px
- 文件大小：~500KB（已优化）
- 格式：WebP
- 加载策略：eager + high priority + preload
