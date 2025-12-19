---
title_en: "Advanced Sampling: LoRA and ControlNet"
title_zh: "进阶采样：LoRA 与 ControlNet 控制"
date: 2024-10-08
type: course
lesson_number: 2
tags: ["ComfyUI", "LoRA", "ControlNet"]
status: published
duration: "25 min"
difficulty: intermediate
summary: "学习如何使用 LoRA 微调风格，ControlNet 控制构图，以及构建多步精炼工作流。"
---

## 课程目标

学完本课，你将能够：
- 在工作流中叠加 LoRA 模型
- 使用 ControlNet 控制图像构图
- 理解 LoRA 强度调节
- 构建 base + refine 两步采样流程

## 什么是 LoRA？

**LoRA (Low-Rank Adaptation)** 是一种轻量级模型微调技术。它不是完整的 SD 模型，而是**补丁（patch）**，可以叠加在基础模型上以注入特定风格或概念。

### LoRA vs 完整模型

| 特性 | 完整模型 | LoRA |
|------|---------|------|
| 大小 | 2-7 GB | 10-200 MB |
| 用途 | 完整图像生成 | 风格/角色微调 |
| 叠加性 | 互斥（一次一个） | 可叠加多个 |
| 训练成本 | 高（需 GPU 集群） | 低（消费级 GPU 可训练） |

**例子**：
- 基础模型：`sd_v1-5.safetensors`（通用）
- LoRA：`anime-style.safetensors`（动漫风格）
- 叠加效果：通用模型 + 动漫风格

## 在 ComfyUI 中使用 LoRA

### 步骤 1：加载 LoRA 节点

1. 在 Load Checkpoint 和 KSampler 之间插入空间
2. Add Node → loaders → Load LoRA
3. 连接：
   - Load Checkpoint 的 **MODEL** → Load LoRA 的 model 输入
   - Load Checkpoint 的 **CLIP** → Load LoRA 的 clip 输入

### 步骤 2：选择 LoRA 文件

在 Load LoRA 节点中：
- **lora_name**：选择你的 LoRA 文件（如 `studio-ghibli-style.safetensors`）
- **strength_model**：0.0-2.0（通常 0.7-1.0），控制对图像的影响
- **strength_clip**：0.0-2.0（通常与 strength_model 相同），控制对文本理解的影响

### 步骤 3：重新连接下游节点

将 Load LoRA 的输出连接到 KSampler：
- Load LoRA 的 **MODEL** 输出 → KSampler 的 model 输入
- Load LoRA 的 **CLIP** 输出 → CLIP Text Encode 的 CLIP 输入

### 叠加多个 LoRA

LoRA 可以链式叠加：

```
Load Checkpoint
    ↓
Load LoRA (风格 LoRA, strength=0.8)
    ↓
Load LoRA (角色 LoRA, strength=0.6)
    ↓
KSampler
```

每个 LoRA 的输出作为下一个 LoRA 的输入。

**注意强度**：
- 多个 LoRA 叠加时，总影响会累积
- 建议每个 LoRA 强度 ≤ 0.8，避免过拟合

## ControlNet：构图控制

ControlNet 让你用**参考图像**控制生成结果的构图、姿势或边缘。

### 常见 ControlNet 类型

| 类型 | 输入 | 用途 |
|------|------|------|
| **Canny** | 边缘检测图 | 保持物体轮廓 |
| **Depth** | 深度图 | 控制 3D 空间关系 |
| **Pose** | 骨骼关键点 | 控制人物姿势 |
| **Scribble** | 手绘草图 | 快速构图 |

### 在 ComfyUI 中使用 ControlNet

#### 步骤 1：准备控制图像

假设我们用 Canny 边缘检测：

1. Add Node → image → Load Image（加载参考图）
2. Add Node → preprocessors → Canny Edge（边缘检测）
3. 连接：Load Image 的 **IMAGE** → Canny Edge 的 image 输入

#### 步骤 2：加载 ControlNet 模型

1. Add Node → loaders → Load ControlNet Model
2. 选择对应的 ControlNet 模型（如 `control_canny.safetensors`）

#### 步骤 3：应用 ControlNet

1. Add Node → conditioning → ControlNet Apply
2. 连接：
   - CLIP Text Encode（正面提示）的输出 → conditioning 输入
   - Canny Edge 的输出 → image 输入
   - Load ControlNet Model 的输出 → control_net 输入
3. 设置 **strength**：0.0-2.0（通常 0.7-1.0），控制影响强度

#### 步骤 4：连接到采样器

将 ControlNet Apply 的 **CONDITIONING** 输出连接到 KSampler 的 positive 输入（替代原有的正面提示）。

### ControlNet 工作流结构

```
[Load Image] → [Canny Edge]
                     ↓
[Load Checkpoint] → [CLIP Text Encode] → [ControlNet Apply] → [KSampler]
                           ↑                     ↑
                   [Load ControlNet Model] ──────┘
```

## 进阶：Base + Refine 两步采样

高质量图像生成常用**两步法**：
1. **Base 阶段**：快速生成大致结构（低步数）
2. **Refine 阶段**：精细化细节（高步数）

### 为什么分两步？

- **效率**：Base 阶段用快速采样器，Refine 阶段用高质量采样器
- **灵活性**：可以在 Refine 阶段切换模型或调整参数
- **质量**：避免过度采样（overfitting）

### 实现方法

#### 步骤 1：Base KSampler

设置第一个 KSampler：
- **steps**：15（较少）
- **denoise**：1.0（完全生成）
- **sampler**：dpm++ 2m（快速）

#### 步骤 2：Refine KSampler

添加第二个 KSampler：
- 连接第一个 KSampler 的 **LATENT** 输出到第二个的 latent_image 输入
- **steps**：10（精炼步数）
- **denoise**：0.4-0.6（**关键**：不是 1.0！保留 base 结果，只精炼细节）
- **sampler**：dpm++ sde（高质量）

#### 步骤 3：共享条件

两个 KSampler 使用相同的 positive 和 negative 条件。

### 两步采样流程图

```
[Load Checkpoint]
    ↓
[CLIP Text Encode] ×2 (正面+负面)
    ↓
[KSampler Base] (steps=15, denoise=1.0)
    ↓ LATENT
[KSampler Refine] (steps=10, denoise=0.5)
    ↓ LATENT
[VAE Decode]
    ↓
[Save Image]
```

## 参数调优指南

### LoRA 强度
- **0.3-0.5**：轻微风格提示
- **0.7-0.9**：明显风格
- **1.0-1.5**：强烈风格（可能过拟合）
- **> 1.5**：实验性（可能崩溃）

### ControlNet 强度
- **0.5-0.7**：柔和引导（保留创造性）
- **0.8-1.0**：严格遵循控制图
- **> 1.0**：极度约束（可能失真）

### Refine Denoise
- **0.3-0.4**：轻微修正（保留 base 99%）
- **0.5-0.6**：平衡修正（推荐）
- **0.7-0.8**：大幅调整（可能偏离 base）

## 常见问题

### Q: LoRA 不生效？
A: 检查：
1. LoRA 文件是否匹配基础模型版本（SD1.5/SDXL）
2. strength_model 是否 > 0
3. 是否正确连接到 KSampler

### Q: ControlNet 控制太强/太弱？
A: 调整 strength 参数。如果太强，降到 0.6；太弱，升到 1.0。

### Q: Refine 阶段图像崩溃？
A: denoise 值太高。尝试降到 0.4-0.5。

### Q: 可以同时用 LoRA 和 ControlNet 吗？
A: 可以！LoRA 作用于模型，ControlNet 作用于条件。它们兼容。

## 下一课预告

第 3 课：**批量生成与工作流自动化**

我们将学习：
- 批量处理多个种子
- 使用变量节点创建动态工作流
- 导出工作流为 API

## 练习

1. 下载一个动漫风格 LoRA，叠加到你的工作流
2. 使用 Canny ControlNet 根据参考图生成新图像
3. 构建 base + refine 两步工作流，对比单步采样的区别
4. 叠加 2-3 个 LoRA，调整强度找到最佳组合

---

**课程文件**：
- [下载 LoRA 工作流示例](#)
- [下载 ControlNet 工作流示例](#)
- [推荐 LoRA 下载站](#)
