---
title_en: "AI Inpainting Mastery: 局部重绘的 4 种实现方法对比"
title_zh: "AI 局部重绘实战：Mask 蒙版、Inpaint 模型、Outpaint 扩图全解析"
type: "course"
lesson_number: 16
date: 2024-04-28
status: "published"
tags: ["ComfyUI", "Inpainting", "Outpainting", "Mask Editing"]
summary: "如何让 AI 只修改图像的特定区域？Inpaint 模型 vs 普通模型+蒙版有何区别？我在商业项目中用到的 4 种局部编辑技巧。"
author: "吴叶贝 (Wu Yebei)"
topic: "图像编辑 / 局部重绘 / AI 修图"
audience: "电商设计师 / 修图师 / 内容创作者"
tools: "ComfyUI / Inpaint Model / Mask Editor"
updated: "2024-03"
---

# 1-6. 局部重绘4种方式

![How to Keep a Litter Box from Smelling_ 10 Proven Ways.jpg](How_to_Keep_a_Litter_Box_from_Smelling__10_Proven_Ways.jpg)

# 开头

蒙版——可以让AI在指定范围内进行重绘，保留不想被重绘的部分。可是蒙版扣不干净怎么办？
在WebUI中，我们时常需要借助PS来制作蒙版
但在ComfyUI，可以让ai帮我指制作精细的蒙版。解放双手~

这节课教你局部重绘的多种方式，制作蒙版，从手动到自动，每个方法都不错过，以适应不同的场景需求。

你想要的我都有。快来跟我一起动手玩转局部重绘的5种方法吧

# 局部重绘的5种方式

## 方法一——VAE内补编码器

选择图片单击右键，选择open in maskeditor打开蒙版编辑，

调整笔刷大小后，在蒙版编辑的范围，我想把猫换成狗，所以就把整只猫都进行涂抹，选择save保存。并修改关键词等信息

![Untitled](Untitled%20104.png)

![Untitled](Untitled%20105.png)

保存好的图片我们需要连接mask，但是encode上面却没有mask，怎么办，

加载出vae encode for inpainting，它比基础的encode多出一个mask，并且可以调整mask外扩的范围,不过一般默认6就可以了。

![Untitled](Untitled%20106.png)

点击生成看看效果，

注意，如果我们一直抽卡出现抽不了，可能是种子固定了，这个是efficiency插件新版本的bug，之后更新可能就没有问题了。

不过现在，我们需要通过点击seed randomize种子随机后，再点击启动就可以了。

或者有一种更加方便的方式，我们需要右键单击选择convert widget to input意思就是，把下面小窗口转移到上面输入点中，选择转移seed种子后，

![Untitled](Untitled%20107.png)

上面接口就会出现小圆点，点击圆点连线空空白处松手，选择seed everywhere，把控制种子方式改成randomize随机，现在我们就可以无限抽卡了。

![Untitled](Untitled%20108.png)

![Untitled](Untitled%20109.png)

## 方法二——set latent noise mask，Latent噪波遮罩

上一种方法是把encode改成了encode for painting

这里我们有另一种方法，保留encode之后，增加set latent noise mask，

![Untitled](Untitled%20110.png)

我们可以固定一下种子，对比2个方法哪种更好，

在连接过程中，会出现距离太远的情况，那我们可以增加一个reroute作为转接点

![Untitled](Untitled%20111.png)

整理一下线条，为了更加直观，我们还可以增加组件，空白处右键单击add group后，可以修改组件的名称，

![Untitled](Untitled%20112.png)

第一个名称是内部编码器vae encode for inpainting，尽量不要写中文，可能会导致报错，点击右下角小三角形进行拖拽，形成组件后，组件内的所有节点都可以一起移动，

![Untitled](Untitled%20113.png)

点击生成，看看两者这件的区别，可以明显看到set latent noise mask表现力更好一些，

从效果上看set latent noise mask能够更好的理解重新生成的内容。

所以我更加推荐Latent噪波遮罩的方式。

[workflow对比.json](workflow%25E5%25AF%25B9%25E6%25AF%2594.json)

## 方法三——Controlnet Inpaint

但是Latent噪波遮罩的方式有时候的表现力度还是不够完美，通常我们还需要叠加controlnet inpaint来组合使用。

我们复制一组工作流，并在上面增加controlnet inpaint做对比。

首先调出apply controlnet，我们可以看到前后两个黄色点，说明它是作为条件输入信息的，连到我们的正向conditioning就行。

剩下的controlnet连接的是controlnet的模型。image是连接inpaint的预处理器。

那我们分别调出model loader，选择inpaint模型。

![Untitled](Untitled%20114.png)

另一端输入inpaint preprocessor也就是inpaint的预处理器。

![Untitled](Untitled%20115.png)

![Untitled](Untitled%20116.png)

点击生成，对比两者效果，可以看出controlnet inpaint+Latent噪波遮罩，组合效果好很多。

![Untitled](Untitled%20117.png)

[workflow对比 (1).json](workflow%25E5%25AF%25B9%25E6%25AF%2594_(1).json)

## 方法四——segment anything

首先出segment anything，选择grounding dino sam segment，可以看到需要连接2个不同的模型，分别是

![Untitled](Untitled%20118.png)

## 方法五——yolo world efficient sam

除此之外，还有另一个插件叫做

yolo world efficient sam， 与sam segment 不同的是对图片的使用范围，你看他的名字中有world，说明他更加适用于更大、更复杂的场景。

我们来官网看一下作者的介绍案例

都是场景大、结构复杂的案例，对于简单的图片来说并不适用。

[GitHub - ZHO-ZHO-ZHO/ComfyUI-YoloWorld-EfficientSAM: Unofficial implementation of  YOLO-World + EfficientSAM for ComfyUI](https://github.com/ZHO-ZHO-ZHO/ComfyUI-YoloWorld-EfficientSAM?tab=readme-ov-file)

![Untitled](Untitled%20119.png)

我们简单来试验一下不同场景下的效果，

首先调出yoloworld esam，可以看到需要连接2个不同的模型，分别是yolo world 和 efficient sam 模型，

prompt中输入需要添加蒙版的关键词，confidence threshold置信阈值，在机器学习中用来预测结果是否可靠，这里表示识别物体的精细程度，

如果需要你扣的蒙版特别小，或者难识别，那就可以把confidence threshold调小点。

比如当我输入这张图片时，关键词输入 bicycle,woman, 

当confidence threshold 为0.1时候只能识别出自行车，

当我调整到0.07的时候，woman才会出现。

![Shibuya  Crossing.jpg](Shibuya__Crossing.jpg)

点击生成后，我们看到画面选中的蒙版范围，上面会有数值，这个数值说明当 confidence threshold 为0.084 的时候，才能出现woman。

其他参数保持默认，一般不会调整它。

比较常用的是 mask combined 代表合并蒙版，

把mask combined 蒙版合并，和 mask extracted 蒙版提取 同时关掉，可以看到多张蒙版。

关掉mask combined ，打开mask extracted 蒙版提取，选择蒙版序号，生成出来就是对应序号的蒙版，注意序号是从0开始的

![Untitled](Untitled%20120.png)

我们回到猫的图片，看看对于简单场景的表现力，关键词设置为eye，ear, 点击生成

可以看到，它无法识别出来相关信息。

![Untitled](Untitled%20121.png)

由此可见， 各种模型都有自己 的优缺点，我们在不同的场景下，可以结合使用，发挥模型的最大效果。

两者没有孰好孰坏，一定要灵活使用，灵活组合。

最后我们回到，城市街道的图片，把他和图生图进行连线，

我们还是输入城市行人的图片，关键词为 sidewalk，我想把它变成草地，所以再正向提示词输入grass，点击生成。

效果还是不错的吧

![Untitled](Untitled%20122.png)

[workflow-seg anything.json](workflow-seg_anything.json)

# 结尾

局部重绘有那么多的方式，并不一定 自动蒙版 就比 手动蒙版 好用，每种方式都有适用他的场景，大家一定要每种方式都多多练习，灵活运用才是真正的融会贯通。

到此，所有的基础工作流都讲完了，之后的工作流都是在此基础上进行修改和扩展。

下节课我们将会学习如何高清放大，清晰画面。

## 方法——Clipseg语义分割 自动蒙版（忽略）

Latent噪波遮罩+inpaint的视觉表现虽然不错，但是这个方法都需要我们自己手动涂抹蒙版，有什么可以自动蒙版吗？

众所周知，在webui中，我们会使用segment anything 来实现自动抠图，在comfyui中也有一样的功能叫做clipseg语义分割，

[https://github.com/facebookresearch/segment-anything](https://github.com/facebookresearch/segment-anything)

![Untitled](Untitled%20123.png)

![Untitled](Untitled%20124.png)

我们调出clipseg看看相关参数设置，其中

模型：整体遮罩的模糊程度

阈值：识别物体的精细程度

膨胀：识别出来的内容的扩散程度

![Untitled](Untitled%20125.png)

右侧 点位 我们可以看到自动分割后的蒙版图、热度图、灰度图

![Untitled](Untitled%20126.png)

我们在text中输入cat，点击生成！结果还是不错的

![Untitled](Untitled%20127.png)