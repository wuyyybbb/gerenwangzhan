---
title_en: "IC-Light: Professional AI Lighting Control for Product Photography"
title_zh: "IC-Light 专业级光影控制：产品摄影的 AI 打光技术"
type: "course"
lesson_number: 27
date: 2024-05-12
status: "published"
tags: ["ComfyUI", "IC-Light", "Lighting Control", "Product Photography"]
summary: "如何用 AI 重新打光？IC-Light 如何实现专业级光影效果？我的产品摄影工作流：环境光→方向光→细节高光三层打光法。"
author: "吴叶贝 (Wu Yebei)"
topic: "光影控制 / 产品摄影 / AI 打光"
audience: "产品摄影师 / 3D 渲染师 / 电商视觉"
tools: "ComfyUI / IC-Light / Relighting"
updated: "2024-05"
---

# 2-7.光影魔术：IC-Light专业级光影处理(只支持1.5）

> [https://www.runcomfy.com/zh-CN/comfyui-workflows/comfyui-ic-light-image-relighting-tool](https://www.runcomfy.com/zh-CN/comfyui-workflows/comfyui-ic-light-image-relighting-tool)
> 

## **什么是IC-Light?**

IC-Light是一种基于AI的图像编辑工具,与Stable Diffusion模型集成,可对生成的图像执行局部编辑。它的工作原理是将图像编码为潜在空间表示,对特定区域应用编辑,然后将修改后的潜在表示解码回图像。这种方法可以精确控制编辑过程,同时保留原始图像的整体风格和连贯性。

目前已发布两种模型:文本条件重光照模型和背景条件模型。两种类型都以前景图像作为输入。

## **2. IC-Light如何工作**

在底层,IC-Light利用Stable Diffusion模型的能力来编码和解码图像。该过程可以分为以下步骤:

2.1. 编码:输入图像通过Stable Diffusion VAE(变分自动编码器)以获得压缩的潜在空间表示。 2.2. 编辑:所需的编辑应用于潜在表示的特定区域。这通常通过将原始潜在与指示要修改的区域的掩码以及相应的编辑提示连接来完成。 2.3. 解码:修改后的潜在表示通过Stable Diffusion解码器传递以重构编辑后的图像。 通过在潜在空间中操作,IC-Light可以进行局部编辑,同时保持图像的整体连贯性和风格。

## **3. 如何使用ComfyUI IC-Light**

您将使用的主节点是"IC-Light Apply"节点,它处理编码、编辑和解码图像的整个过程。

### **3.1. "IC-Light Apply"输入参数:**

"IC-Light Apply"节点需要三个主要输入:

- model:这是将用于编码和解码图像的基本Stable Diffusion模型。
- ic_model:这是预训练的IC-Light模型,包含编辑过程所需的权重。
- c_concat:这是一个特殊的输入,结合了原始图像、指示要编辑的区域的掩码以及定义如何修改这些区域的编辑提示。

要创建c_concat输入:

1. 使用VAEEncodeArgMax节点对原始图像进行编码。该节点确保获得图像最可能的潜在表示。
2. 使用ICLightApplyMaskGrey节点创建图像的掩码版本。该节点将原始图像和掩码作为输入,并输出一个版本的图像,其中未掩码的区域被灰化。
3. 为编辑提示创建潜在表示。这些提示将指导对图像选定区域进行的修改。
4. 将原始图像、掩码和编辑提示的潜在表示组合成"IC-Light Apply"节点的单个输入。

### **3.2. "IC-Light Apply"输出参数:**

处理完输入后,"IC-Light Apply"节点将输出单个参数:

- model:这是应用了IC-Light修改的修补后的Stable Diffusion模型。

要生成最终编辑的图像,只需将输出模型连接到ComfyUI工作流程中的相应节点,例如KSampler和VAEDecode节点。

### **3.3. 获得最佳结果的提示:**

1. 使用高质量的掩码:为确保编辑精确有效,请确保掩码准确勾勒出要修改的区域。
2. 尝试不同的编辑提示:编辑提示指导对图像选定区域进行的修改。随意尝试不同的提示以达到所需的效果,并根据结果毫不犹豫地完善提示。
3. 平衡全局和局部编辑:虽然IC-Light非常适合进行局部编辑,但考虑图像的整体构图和连贯性也很重要。尝试在重点编辑和全局调整之间找到平衡,以维持生成艺术品的完整性。

# 开头

# 内容

[一文详解打光神器 IC-Light！可控制光照方向和色彩氛围，免费使用](https://www.uisdc.com/ic-light)

[https://github.com/kijai/ComfyUI-IC-Light](https://github.com/kijai/ComfyUI-IC-Light)

1. iclight_sd15_fc.safetensors：默认的重照模式，以文本和前景为条件。您可以使用初始潜影来影响重照效果。在 FG 工作流程中使用它
2. iclight_sd15_fcon.safetensors： 与 “iclight_sd15_fc.safetensors ”相同，但使用偏移噪声进行训练。在 FG 工作流程中使用它
3. iclight_sd15_fbc.safetensors： 以文本、前景和背景为条件的重新照明模型。在 BG 工作流程中使用它

## 1.背景+前景+光源 fbc16

## 2.前景+光源，背景自动生成 fc

## 3.商业用法：保持背景不变，产品色调与细节不变，融入光影

# 结尾