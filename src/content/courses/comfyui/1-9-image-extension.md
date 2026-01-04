---
title_en: "AI Outpainting: Extending Images Beyond Original Boundaries"
title_zh: "AI 智能扩图：超越原始边界的图像延伸技术"
type: "course"
lesson_number: 19
date: 2024-04-30
status: "published"
tags: ["ComfyUI", "Outpainting", "Image Extension", "Canvas Expansion"]
summary: "如何让 AI 智能补全图像外的内容？Outpaint 与 Inpaint 有何区别？我在实际项目中遇到的边缘融合问题与解决方案。"
author: "吴叶贝 (Wu Yebei)"
topic: "图像扩展 / AI 补全 / 画布扩展"
audience: "设计师 / 内容创作者 / 摄影后期"
tools: "ComfyUI / Outpaint / Canvas Extension"
updated: "2024-04"
---

# 1-9. 扩展图片

![Untitled](Untitled%20175.png)

# 搭建逻辑

延续controlnet inpaint工作流

增加外补画板pad image for outpaiting

插件：external tooling

# 步骤

### 1.controlnet inpaint工作流

![Untitled](Untitled%20176.png)

### 2.增加外补画板pad image for outpaiting

![Untitled](Untitled%20177.png)

![Untitled](Untitled%20178.png)

![Untitled](Untitled%20179.png)

### 3.效果不好的话，在基础上增加IP-Adapter

![Untitled](Untitled%20180.png)

![Untitled](Untitled%20181.png)

### 4.引入efficient loader简便高效工作流

[https://github.com/LucianoCirino/efficiency-nodes-comfyui](https://github.com/LucianoCirino/efficiency-nodes-comfyui)

![Untitled](Untitled%20182.png)

![Untitled](Untitled%20183.png)

### 5.efficient loader用法工作流

1.高分辨率修复

![Untitled](Untitled%20184.png)

2.**XY 图**

![Untitled](Untitled%20185.png)

# 总结

![Untitled](Untitled%20186.png)