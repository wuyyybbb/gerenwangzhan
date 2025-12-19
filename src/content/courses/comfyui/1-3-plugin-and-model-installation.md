---
title_en: "Plugin and Model Installation Methods"
title_zh: "插件+模型安装方法"
type: "course"
lesson_number: 13
date: 2024-06-01
status: "published"
tags: ["ComfyUI", "Stable Diffusion", "AI Art"]
---

# 1-3. 插件+模型安装方法

# 开头

上节课我们讲了ComfyUI的安装和部署，但是，想要完美的运行ComfyUI，那么插件肯定是必不可少的。

所以，本节课的任务是，让你能够熟练地安装和配置各种必备工具，掌握它们的基本用途和潜在的应用场景，从而在实际工作中能够更加从容。

首先，我们将通过三种不同的方法来安装插件和模型，每种方法都有他的特点和适用场景，你可以根据自己的具体需求和环境 选择最合适的安装方式。

另外，我们还将介绍一些常见的设置选项，帮助你更好地理解，配置和优化这些工具，确保它们能在你的工作环境中发挥最大的效果。

那话不多说，开始吧

# 目录及内容

## 安装方法一——适用于本地整合包——git clone

方法一的

第一步，先安装git，

![Untitled](Untitled%2031.png)

![Untitled](Untitled%2032.png)

导航至**`D:\ComfyUI_windows_portable\ComfyUI\custom_nodes`**，在空白区域右键打开**`open git bash here`** 并按回车键，打开窗口之后，来到我们的第二步

![Untitled](Untitled%2033.png)

- 在github网站，打开需要安装的插件。这里，把我们最常用的插件——controlnet作为演示。首先，在github网页中搜索comfyui controlnet
    
    ![Untitled](Untitled%2034.png)
    
     https://github.com/Fannovel16/comfyui_controlnet_aux。
    
    在页面右上角点击绿色的“Code”按钮，复制GitHub地址以下载安装文件夹。
    
    ![Untitled](Untitled%2035.png)
    
    这里有个小tips，当我们想要下载插件但是不知道如何使用它的时候，可以在该页面查看 readme 文件，作者通常会在这里写上 安装和使用方法，以及需要匹配的模型等关键信息。养成阅读 readme 的习惯对了解插件十分有帮助。
    
    以controlnet为例子，installation就是作者写的详细安装步骤，
    
    nodes这部分是节点的说明，可以看到webui中对应的名称在comfyui中有部分是不同的。比如softedge，在comfyui中是hed，深度depths在comfyui中式zoe。
    
    最下面还有节点的对比展示图片。所以养成阅读readme非常重要。
    
- 3.在窗口输入 git clone + 粘贴网址， 回车自动运行下载。下载完成后，若文件夹中显示“done”，则表示安装成功。
    
    ![Untitled](Untitled%2036.png)
    

下载完成之后，我们来复现一下工作流试试效果，

![Untitled](Untitled%2037.png)

- 需注意的是，这种方法对于 一些插件可能频繁更新，同时你又没有及时更新可能会影响使用。并且该方法只适用于本地整合包，并不适用于云端。
    
    

## 安装方法二——手动下载后安装环境依赖

接下来介绍的方法二就是同时适用云端和本地，不过操作步骤略有差别。

我们先将一下本地安装步骤，先进入github，

我们以https://github.com/kijai/ComfyUI-SUPIR为例，这个是我们之后会常用的放大高清插件。

在下载安装插件前我们先看一下readme文件，首先在installing安装步骤中作者写的很清楚：

![Untitled](Untitled%2038.png)

那么我们根据作者的建议来安装，首先

1.直接下载安装包

2.将下载的压缩文件解压到**`D:\ComfyUI_windows_portable\ComfyUI\custom_nodes`**目录下。与webui中extension的目录是同一个功能。到这一步部分插件就属于安装好了，可以重启直接使用。但是有部分插件重启之后还是不能使用，那就代表需要安装环境依赖，这时候就要来到第三步，

3.安装环境依赖。

安装环境的方式，对于云端和本地也不一样。

**本地**的方案是：在秋叶包 **`D:\ComfyUI-aki-v1.2\python`** 地址下，右键单击，选择open in terminal，输入**`.`** ,并复制**`\python.exe -m pip install -r`** 。整体表现为

![Untitled](Untitled%2039.png)

然后打开 解压好的插件文件，从**`D:\ComfyUI-aki-v1.2\custom_nodes\ComfyUI-SUPIR-main`**  文件夹中拖入requirements文件在后面，回车，没有报红就代表安装成功了。

**云端**的方案是：下载的文件放在root/comfyui/custom_nodes中

![Untitled](Untitled%2040.png)

![Untitled](Untitled%2041.png)

  **复制reqirement路径**

![Untitled](Untitled%2042.png)

![Untitled](Untitled%2043.png)

![Untitled](Untitled%2044.png)

记得要粘贴纯文本，然后右键回车即可

最后我们安装好之后，来试试效果

![Untitled](Untitled%2045.png)

此方法的缺点是：操作复杂，对不懂编程的人来说困难。

## 安装方法三

1.manager中查找插件名字

2.点击install即可。当安装栏显示 try update，关闭，卸载的工具是则表示安装成功。我们需要重启来调出刚刚安装的插件。

这种安装方法是最为推荐的，不仅操作简便且效率高，同时适用于本地和云端方案。

## 模型安装

## 本地安装方法

注意大模型的名称与webui有所区别，webui中叫stable_diffusion,comfyui叫checkpoints， 其他相同，包括controlnet模型，embedding， Lora，vae,

![Untitled](Untitled%2046.png)

## 云端安装方法

直接在应用栏拖入文件即可，

![Untitled](Untitled%2047.png)

其他文件，比如controlnet模型可以进入文件管理，在root/ComfyUI/models/controlnet/中拖入模型文件即可

![Untitled](Untitled%2048.png)

## 方法三

第三种方法在本地和云端都可用，进入comfyui界面，在管理中选择 install models，

![Untitled](Untitled%2049.png)

输入模型名字，点击install即可

![Untitled](Untitled%2050.png)

## 常用设置

包含了保存、加载工作流、清除、加载默认工作流、管理器等

![Untitled](Untitled%2051.png)

1.管理器

点开之后就能看到“ComfyUI管理器”的界面，“跳过更新检查”可以关掉的话，它就会帮我们自动检查是否有插件需要更新。

![Untitled](Untitled%2052.png)

点击**“安装节点”**，可以进入到插件的管理界面。在这里，你可以下载到你需要的插件，如果插件有新版本，也可以在右边点击“更新”进行插件升级。

如果使用别人的工作流，出现节点缺失的情况，可以点击**“安装缺失节点”**，需要模型的时候，还可以点击**“安装模型”**。

我们还可以在**标签栏**打开id+名称，这样便于在后期查看 插件名称和工作流制作顺序，尤其是查看他人工作流时，便于学习别人的思路。

![Untitled](Untitled%2053.png)

2.设置

![Untitled](Untitled%2054.png)

![Untitled](Untitled%2055.png)

常用设置：link render mode也就是我们连线 线条形态：

![Untitled](Untitled%2056.png)

![Untitled](Untitled%2057.png)

最后有同学可能想要安装中文插件，切换中文界面，需要强调一下comfyui与webui不同，不建议大家安装中文插件，或者翻译插件，因为中文可能会导致报错。

所以我们要从现在开始习惯英文的界面，英语不好的小伙伴也无需担心，在教学过程中，我会翻译一些常用的重点词汇。

# 结尾

那么通过今天的课程，我们讲到了三种不同的插件安装方法和一些常用管理设置。
每种方法都有优势，同学们可以根据自己的具体需求和环境选择最合适的安装方式。

注意一点，我们的结果是成功安装上插件，所以不用死磕其中一种安装方法，有报错我们就换下一个方法，在安装插件期间遇到任何问题都，可以随时咨询老师。

纸上得来终觉浅，现在去安装一下你需要的插件试试吧