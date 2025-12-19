---
title_en: "Image Extension and Q&A"
title_zh: "扩展图片+问题答疑"
type: "course"
lesson_number: 19
date: 2024-06-01
status: "published"
tags: ["ComfyUI", "Stable Diffusion", "AI Art"]
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