---
title_en: "ComfyUI Fundamentals: Nodes and Workflow"
title_zh: "ComfyUI 基础：节点与工作流"
date: 2024-10-01
type: course
lesson_number: 1
tags: ["ComfyUI", "Stable Diffusion", "AI Art"]
status: published
duration: "15 min"
difficulty: beginner
summary: "理解 ComfyUI 的核心概念：节点系统、数据流和工作流保存。第一课从零开始。"
---

## 课程目标

学完本课，你将能够：
- 理解 ComfyUI 的节点式架构
- 创建基础的图像生成工作流
- 保存和加载工作流文件
- 识别常见节点类型和连接方式

## 什么是 ComfyUI？

ComfyUI 是一个基于节点的 Stable Diffusion GUI。与传统的表单式界面（如 AUTOMATIC1111）不同，ComfyUI 使用**可视化节点图**来构建图像生成流程。

### 为什么选择节点式？

**优势**：
- **可视化数据流**：你能看到数据如何从模型流向采样器再到输出
- **灵活性**：可以插入自定义步骤（如 LoRA、ControlNet、后处理）
- **可复用**：工作流可保存为 JSON，分享给他人
- **调试友好**：每个节点的输出都可以单独检查

**劣势**：
- 学习曲线比表单式界面陡峭
- 初始设置可能看起来复杂

## 核心概念：节点

节点是 ComfyUI 的基本单位。每个节点执行一个特定任务。

### 常见节点类型

| 节点名称 | 功能 | 输入 | 输出 |
|---------|------|------|------|
| **Load Checkpoint** | 加载 SD 模型 | 模型文件名 | MODEL, CLIP, VAE |
| **CLIP Text Encode** | 将提示词编码 | 文本 + CLIP | CONDITIONING |
| **KSampler** | 生成图像（采样） | 模型 + 条件 + 潜空间 | LATENT |
| **VAE Decode** | 解码潜空间为图像 | LATENT + VAE | IMAGE |
| **Save Image** | 保存图像到磁盘 | IMAGE | - |

### 节点连接规则

节点通过**插槽（socket）**连接：
- **左侧插槽**：输入
- **右侧插槽**：输出
- **颜色编码**：相同颜色的插槽可以连接

例如：
```
Load Checkpoint [MODEL输出] → KSampler [MODEL输入]
```

只有类型匹配的插槽才能连接。尝试连接不兼容类型时，ComfyUI 会拒绝连接。

## 第一个工作流：Text-to-Image

让我们构建最基础的 txt2img 工作流。

### 步骤 1：加载模型

1. 右键 → Add Node → loaders → Load Checkpoint
2. 在节点中选择你的 SD 模型（如 `sd_v1-5.safetensors`）
3. 这会输出三个接口：
   - **MODEL**：神经网络权重
   - **CLIP**：文本编码器
   - **VAE**：图像编解码器

### 步骤 2：编码提示词

**正面提示**：
1. Add Node → conditioning → CLIP Text Encode (Prompt)
2. 连接 Load Checkpoint 的 **CLIP** 输出到此节点的 CLIP 输入
3. 在文本框输入：`a beautiful landscape, detailed, high quality`

**负面提示**：
1. 再添加一个 CLIP Text Encode (Prompt) 节点
2. 连接相同的 CLIP 输出
3. 输入：`blurry, low quality, distorted`

### 步骤 3：采样器（生成图像）

1. Add Node → sampling → KSampler
2. 连接：
   - Load Checkpoint 的 **MODEL** → KSampler 的 model
   - 正面提示的输出 → positive
   - 负面提示的输出 → negative
3. 参数设置：
   - **seed**：随机种子（随机或固定）
   - **steps**：20（采样步数，越多越精细但越慢）
   - **cfg**：7.0（提示词遵循强度）
   - **sampler_name**：euler（采样算法）
   - **scheduler**：normal
   - **denoise**：1.0（降噪强度，1.0 = 完全重新生成）

### 步骤 4：解码潜空间

KSampler 输出的是**潜空间表示**（LATENT），需要解码为可见图像：

1. Add Node → latent → VAE Decode
2. 连接：
   - KSampler 的 **LATENT** 输出 → VAE Decode 的 samples 输入
   - Load Checkpoint 的 **VAE** 输出 → VAE Decode 的 vae 输入

### 步骤 5：保存图像

1. Add Node → image → Save Image
2. 连接 VAE Decode 的 **IMAGE** 输出
3. 设置文件名前缀（可选）

### 步骤 6：执行

点击右侧的 **Queue Prompt** 按钮。ComfyUI 会按节点依赖关系执行工作流，最终在输出文件夹生成图像。

## 数据流可视化

```
[Load Checkpoint]
    ├─ MODEL ──────┐
    ├─ CLIP ───┬───┼──────┐
    └─ VAE ────│───│──┐   │
               │   │  │   │
    [正面提示词]  │  │   │
    [负面提示词]  │  │   │
               │   │  │   │
               └───┴──┘   │
                   │      │
              [KSampler]  │
                   │      │
                LATENT    │
                   │      │
              [VAE Decode]│
                   │      │
                 IMAGE ───┘
                   │
              [Save Image]
```

## 保存工作流

1. 菜单 → Save → 输入文件名 → 保存为 `.json`
2. 分享：将 JSON 文件发给他人，他们可以直接加载

**注意**：工作流 JSON 不包含模型文件，只包含节点配置和连接关系。

## 常见问题

### Q: 节点连接失败？
A: 检查插槽颜色。只有相同颜色（类型）的插槽才能连接。

### Q: 为什么需要两个 CLIP Text Encode 节点？
A: 一个用于正面提示（你想要的），一个用于负面提示（你不想要的）。采样器需要两者来引导生成。

### Q: VAE 有什么用？
A: VAE 负责在像素空间和潜空间之间转换。Stable Diffusion 在潜空间工作（更高效），最后需要 VAE 解码回可见图像。

### Q: 可以不保存图像直接预览吗？
A: 可以。添加 **Preview Image** 节点而非 Save Image，图像会在界面显示而不保存到磁盘。

## 下一课预告

第 2 课：**进阶采样：LoRA、ControlNet 和多步工作流**

我们将学习：
- 如何叠加 LoRA 模型微调风格
- ControlNet 如何控制构图
- 多次采样（refine 流程）

## 练习

1. 修改提示词，生成不同风格的图像
2. 调整 CFG 值（3-15），观察对图像的影响
3. 尝试不同采样器（euler、dpm++、heun）
4. 保存你的第一个工作流，命名为 `basic-txt2img.json`

---

**课程文件**：
- [下载基础工作流 JSON](#)
- [示例生成图像](#)
