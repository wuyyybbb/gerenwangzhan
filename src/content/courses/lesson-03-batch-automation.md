---
title_en: "Scaling AI Workflows: Batch Processing & API Automation for Production"
title_zh: "AI 工作流规模化：批量生成与 API 自动化实战指南"
date: 2024-04-22
type: course
lesson_number: 3
tags: ["ComfyUI", "Automation", "Batch Processing", "API", "Production Workflow"]
status: published
duration: "20 min"
difficulty: intermediate
summary: "如何用 API 批量生成 1000 张图？Primitive 节点如何统一管理参数？我在生产环境中遇到的 3 个问题：VRAM 爆炸、队列拥堵、参数模板化管理。"
author: "吴叶贝 (Wu Yebei)"
topic: "AI 工作流 / 自动化 / 批量处理"
audience: "AI 工程师 / 产品开发者 / 技术团队"
tools: "ComfyUI / Python API / 工作流模板化"
updated: "2024-04"
---

## 课程目标

学完本课，你将能够：
- 批量生成多个种子的图像
- 使用 Primitive 节点创建可复用变量
- 理解循环节点和批处理
- 通过 API 调用 ComfyUI（无 GUI）

## 批量生成：多种子迭代

### 为什么需要批量生成？

单次生成只产生一张图。实际使用中，你需要：
- 测试不同种子找到最佳结果
- 生成多个变体供选择
- 自动化大规模生成（如游戏资产、商品图）

### 方法 1：手动队列（最简单）

1. 设置工作流
2. 在 KSampler 中选择 **control_after_generate: randomize**
3. 点击 **Queue Prompt** 多次（或输入队列数量）

ComfyUI 会自动生成多张图，每次使用新的随机种子。

**优点**：零配置
**缺点**：无法精确控制种子范围

### 方法 2：Seed Loop 节点（精确控制）

某些自定义节点包提供批量采样节点（如 ComfyUI-Manager 的扩展）。

标准流程：
1. 安装 `efficiency-nodes` 插件
2. Add Node → efficiency → KSampler (Efficient)
3. 设置 **batch_size** 参数（如 4 = 一次生成 4 张）

### 方法 3：Python 脚本调用（高级）

通过 ComfyUI 的 API 批量提交工作流（见后续 API 部分）。

## Primitive 节点：可复用变量

### 问题：参数分散

假设你的工作流中有 5 个节点都使用相同的分辨率（512x512）。如果要改成 768x768，需要修改 5 处。

### 解决方案：Primitive 节点

Primitive 节点是**变量容器**，可以连接到多个节点的输入。

#### 创建 Primitive 节点

1. 右键任意节点的输入槽位（如 KSampler 的 steps）
2. 选择 **Convert Widget to Input**
3. Add Node → utils → Primitive
4. 在 Primitive 节点中设置值
5. 连接 Primitive 的输出到多个节点的输入

#### 示例：统一分辨率

```
[Primitive: width=768]
    ├─→ Empty Latent Image 的 width
    └─→ Upscale Model 的 width

[Primitive: height=768]
    ├─→ Empty Latent Image 的 height
    └─→ Upscale Model 的 height
```

现在修改分辨率只需改一处！

### 常见 Primitive 用途

- **全局分辨率**：width, height
- **统一步数**：steps
- **共享种子**：seed（用于对比实验）
- **CFG 值**：cfg
- **模型路径**：ckpt_name

## 批处理：一次处理多张图

### 场景：批量后处理

你有 10 张生成的图像，想批量应用相同的后处理（如锐化、色彩校正）。

### 使用 Batch 节点

1. Add Node → image → Load Images Batch
2. 选择文件夹路径
3. 连接到后处理节点（如 ImageSharpen）
4. 所有图像会自动批量处理

### Latent Batch：批量采样

如果想在一个工作流中生成多个变体：

1. Add Node → latent → Latent Batch
2. 连接多个 Empty Latent Image 的输出
3. 连接到 KSampler
4. 一次采样生成多张图

**注意**：批量采样消耗更多 VRAM。4GB 显卡建议 batch_size ≤ 2。

## ComfyUI API：无 GUI 自动化

ComfyUI 提供 HTTP API，可以通过脚本提交工作流。

### 启用 API

ComfyUI 默认启用 API，监听 `http://127.0.0.1:8188`。

### API 工作流

1. 在 GUI 中构建工作流
2. 菜单 → Save (API Format) → 保存为 `workflow_api.json`
3. 使用 Python/Node.js 发送 POST 请求

### Python 示例：提交工作流

```python
import requests
import json

# 加载工作流 JSON
with open('workflow_api.json', 'r') as f:
    workflow = json.load(f)

# 修改参数（如种子）
workflow["3"]["inputs"]["seed"] = 42  # 节点 3 是 KSampler

# 提交到 ComfyUI
response = requests.post(
    'http://127.0.0.1:8188/prompt',
    json={"prompt": workflow}
)

print(response.json())
```

### 批量生成脚本

```python
import requests
import json
import time

with open('workflow_api.json', 'r') as f:
    workflow = json.load(f)

# 生成 10 张图，种子 0-9
for seed in range(10):
    workflow["3"]["inputs"]["seed"] = seed
    workflow["9"]["inputs"]["filename_prefix"] = f"batch_{seed:03d}"

    response = requests.post(
        'http://127.0.0.1:8188/prompt',
        json={"prompt": workflow}
    )

    print(f"Queued seed {seed}: {response.json()}")
    time.sleep(1)  # 避免过快提交
```

### 查询队列状态

```python
# 获取当前队列
queue = requests.get('http://127.0.0.1:8188/queue').json()
print(f"Queue length: {len(queue['queue_running'])}")

# 获取历史记录
history = requests.get('http://127.0.0.1:8188/history').json()
```

## 工作流模板化

### 场景：多个客户，相同流程

假设你为多个客户生成品牌图像，流程相同但参数不同（如 logo、配色）。

### 解决方案：参数化工作流

1. 将所有可变参数替换为 Primitive 节点
2. 保存为模板 `brand_template.json`
3. 通过脚本加载模板，注入客户参数
4. 批量生成

#### 示例：客户数据

```python
clients = [
    {"name": "Client A", "prompt": "red theme, tech style", "seed": 10},
    {"name": "Client B", "prompt": "blue theme, minimalist", "seed": 20},
]

for client in clients:
    workflow = load_template('brand_template.json')
    workflow["5"]["inputs"]["text"] = client["prompt"]
    workflow["3"]["inputs"]["seed"] = client["seed"]
    workflow["9"]["inputs"]["filename_prefix"] = client["name"]

    submit_workflow(workflow)
```

## 进阶：自定义节点开发

如果内置节点不够用，可以用 Python 开发自己的节点。

### 最简单的自定义节点

```python
# custom_nodes/my_node.py

class TextMultiplier:
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "text": ("STRING", {"default": ""}),
                "count": ("INT", {"default": 1, "min": 1, "max": 10}),
            }
        }

    RETURN_TYPES = ("STRING",)
    FUNCTION = "multiply"
    CATEGORY = "custom"

    def multiply(self, text, count):
        return (text * count,)

NODE_CLASS_MAPPINGS = {
    "TextMultiplier": TextMultiplier
}
```

重启 ComfyUI，你会在节点菜单看到 **custom → TextMultiplier**。

## 性能优化建议

### 1. 减少 VRAM 占用
- 使用 `--lowvram` 启动参数
- 批量生成时降低分辨率
- 关闭不必要的预览节点

### 2. 加速生成
- 使用快速采样器（DPM++ 2M）
- 降低采样步数（15-20 已足够）
- 启用 xformers（`--xformers` 启动参数）

### 3. 磁盘 I/O 优化
- 使用 SSD 存储模型
- 批量生成时使用 RAM disk（如 Windows 的 ImDisk）

## 常见问题

### Q: API 格式的 JSON 和普通 JSON 有什么区别？
A: API 格式去除了 UI 相关信息（如节点位置），只保留逻辑结构。更紧凑，适合脚本调用。

### Q: 如何找到节点的 ID 号（如 "3"）？
A: 在 API JSON 中，节点 ID 是键名。在 GUI 中右键节点 → Properties 可以看到 ID。

### Q: 批量生成时如何避免覆盖文件？
A: 在 Save Image 节点中使用动态文件名，如 `%seed%_%date%` 或在 API 中动态设置 `filename_prefix`。

### Q: 可以远程调用 ComfyUI API 吗？
A: 可以。启动时加 `--listen 0.0.0.0` 允许外部访问（**注意安全**）。

## 下一课预告

第 4 课：**Upscaling 和高分辨率修复**

我们将学习：
- Latent Upscale vs Pixel Upscale
- Hires.fix 技术
- Real-ESRGAN、Ultimate SD Upscale

## 练习

1. 创建一个工作流，批量生成 10 个不同种子的图像
2. 使用 Primitive 节点统一管理分辨率和步数
3. 将你的工作流导出为 API 格式，用 Python 脚本调用
4. 编写脚本批量生成 5 张图，每张使用不同的提示词

---

**课程文件**：
- [下载批量生成工作流示例](#)
- [Python API 调用完整代码](#)
- [ComfyUI API 官方文档](#)
