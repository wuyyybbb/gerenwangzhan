---
title_en: "Why ComfyUI Changed My AI Workflow: Node-based vs Traditional Interfaces"
title_zh: "ComfyUI 如何改变我的 AI 创作流程：节点式 vs 传统界面深度对比"
type: "course"
lesson_number: 11
date: 2024-04-23
status: "published"
tags: ["ComfyUI", "Stable Diffusion", "AI Art", "Workflow Automation"]
summary: "为什么我放弃 WebUI 转向 ComfyUI？100 张图批量 AI 换脸如何 1 键完成？节点式工作流的 3 大优势与 2 个学习陷阱。"
author: "吴叶贝 (Wu Yebei)"
topic: "AI 工作流 / 效率工具 / 自动化"
audience: "AI 创作者 / 设计师 / 内容生产者"
tools: "ComfyUI / Stable Diffusion / 节点编辑器"
updated: "2024-02"
---

# 1-1. 工作原理+ComfyUI优缺点

# 开头

想要提升你出图的效率吗？或是寻找一种简洁而强大的框架  来实现那些令人眼前一亮的效果？那你就不能错过ComfyUI！

ComfyUI提供了丰富的组件库和交互功能，就像一盒乐高，你可以自由地拼接和搭建，打造出完全符合你想象的结果。

那你可能会问，这一切听起来都很美好，但是ComfyUI真的适合我吗？它是否真的能够满足我的特定需求？别急，下面我们就来详细分析ComfyUI的各个方面。

我们将一步步探索它的核心功能和优势，同时也不会忽略那些可能需要你额外注意的局限性。通过这种方式，你将能更好地理解ComfyUI的全貌，以及它如何能成为你设计工具箱中的一员。准备好了吗？让我们一起潜入ComfyUI的世界，解锁其背后的秘密！

# 目录及内容

这节课我们主要从三个方面探讨，包括“为什么要学习ComfyUI”，“它的优缺点是什么”，以及“最适合使用ComfyUI的人群”。

![Untitled](Untitled.png)

## 为什么要学习ComfyUI

为什么要学习ComfyUI？这个问题很有意思。

![Untitled](Untitled%201.png)

想象一下，你正在AI换脸，在weibui中我们需要做的是

第一步—手动涂抹面部蒙版，

第二步重新发到图生图调整局部重绘幅度，使得脸部光影与身体进行融合，

最后我们还需要借助photoshop之类的工具进行脸部五官的涂抹，

一张AI换脸的图片你需要进行多达四步，如果想要扩图或者调整其他细节，那则需要在原基础上进行更多的步骤。

当你只处理一张图片的时候可能还能应付，但是，现在有100张图需要批量处理呢？怎么办？那么通过comfyui就能迎刃而解。

![Untitled](Untitled%202.png)

ComfyUI就是一台高效的机器，你只需投入原材料（也就是图片和关键词），搭建你想要的流程，然后按下启动键，剩下的事情就交给它来处理。
它的界面简洁直观，同时包含了很多实用的组件和插件工具，让整个过程变得既快捷又简单。

![Untitled](Untitled%203.png)

简而言之，ComfyUI将重复的操作过程  隐藏在直观的操作界面之后，大大提高了工作效率，
无论是个人还是团队，都能通过它来增加 项目开发的速度，更好地迎合市场需求。所以学习ComfyUI是一个明智的选择。

另外comfyui它更加接近Stable Diffusion的底层逻辑，

![Untitled](Untitled%204.png)

让你通过拖拽各种 节点模块（比如文本提示、模型选择、采样方式等），就能够轻松地拼凑出一个完整的AI生成流程。这不仅让你能够直观地看到每一步的变化，而且还能掌控整个创作过程。

举个简单的例子，我们根据官网提供的原理图，来一步步搭建我们工作流，

首先根据原理图，我们可以看到第一步是conditioning条件输入（包含了text文本输入，和images图片输入等），

然后通过encode编码器进入sd的潜空间，图片在里面主要是进行一个去噪的过程，

接着denosing step进行降噪，

最后把去噪结果还原到像素空间，也就是pixel space。

![Untitled](Untitled%205.png)

同理，按照顺序我们在comfyui调出我们的节点，首先右键add node增加节点，找到conditioning条件输入中的text文本节点，该节点同时包含了encode编码器，接着在loader载入中找到load checkpoint载入模型

然后在sampling中调出我们的潜空间的内容，也是就ksampler采样器，

接着调出decode解码，

最后打开我们的像素空间image。

![Untitled](Untitled%206.png)

[01workflow_theory logic.json](01workflow_theory_logic.json)

以上整个过程还原了sd的底层逻辑。

另外根据官网小猫咪的噪点讲解图片，我们还可以通过工作流的搭建，来还原官网增加噪点的过程，使我们更加了解潜空间里面在进行什么。

首先固定我们的种子fixed，

然后根据前面搭载好的工作流，我们进行复制三步ksampler采样方式，decode解码器，和pixel image像素空间图片，

第一步我们可以把开始步数为0，结束步数为5，return with leftover noise 继续去除剩余的噪点打开enable，

第二步的步数开始为5，结束为10，打开return with leftover noise，并关掉add noise 增加噪点disable，

第三步的步数开始为10，结束为总步数20，打开return with leftover noise，并关掉add noise 增加噪点disable，

点击生成之后，就可以看到图片使如何一步步增加噪点的。

![Untitled](Untitled%207.png)

![Untitled](Untitled%208.png)

[02workflow_noise.json](02workflow_noise.json)

怎么样？这样一套流程下来，大家对sd的底层逻辑了解的更加透彻了，是不是比webui死记硬背一些参数更加硬核。

不仅如此，使用ComfyUI，你不需要懂编程或深入了解AI理论就能够使用。

![Untitled](Untitled%209.png)

ComfyUI就像是一座连接创意与技术的桥梁，让复杂的技术变得触手可及，帮助你释放创造力，轻松创造出专业级的图像作品。

## ComfyUI的优缺点

ComfyUI作为提升效率的工具，他的优势显而易见，但同时它也存在一些问题。让我们详细探讨这些优点与劣势。

### 优点

首先，谈谈ComfyUI的性能优化和出图效率。对比webui和comfyui在相同显存的情况下，comfyui出图速度更快，大约能快20%左右，所以xl模型在comfyui中，能够得到好的发挥。

其次，ComfyUI在工作流的透明度和共享性方面也做得非常好。它的界面非常简洁，支持高度自定义和重复利用工作流，我们可以到openart网站下载工作流/图片，直接拖进我们的comfyui即可复现别人搭建好的工作流，直接秒变大师。

### 缺点

说完优点我们说缺点，ComfyUI节点式的界面对于没有接触过此类软件的小白来说，一开始，确实看上去会让人一脸困惑。尤其是连webui基础都没有的同学。

另外，虽然ComfyUI的插件 带来了巨大的灵活性和扩展性，但是管理这些插件的过程可能比较复杂，尤其是需要解决插件的环境依赖，如果你没有编程基础，安装就会十分困难。为此，我们已经提供了云端解决方案，这个会在后面的课程中详细讲解。

总的来说，ComfyUI提供了一条更加高效的道路，它的优势可以帮助我们提高生产力，同时也需要用户在使用前做好准备，以充分利用这个强大的工具。

## ComfyUI适合人群

那么comfyui适合哪些人群呢？

![Untitled](Untitled%2010.png)

第一，追求效率，并且不想频繁使用ps或其他辅助画图工具的同学，comfyui能让你一键生成图像，极大地简化了整个创作过程，让你有更多时间专注于创意本身。

第二，需要降本增效的老板们，ComfyUI在ai生图中提供了一个强大的解决方案。它不仅可以加速项目完成的速度，还能保持高质量的输出，从而提高整个团队的工作效率。

最后，对AI技术有浓厚兴趣的学生和爱好者，ComfyUI是一个宝贵的学习资源。通过它，用户不仅可以实践最前沿的AI技术，还可以根据自己的需求调整和优化工作流程。

# 总结

好了，现在我们已经全面了解了ComfyUI，包括为什么要学习它，它的强项和短板，以及适合谁使用。不论你是刚开始接触，还是从未了解过，学习ComfyUI都是对自己未来的一种投资。

所以，现在就开启你的ComfyUI学习之路吧！