**开始之前，请确保您的 Google Drive 帐户至少有 5 GB 的可用空间。**我们会将微调后的模型保存到 Gdrive，它占用大约 2-3 GB。

我们将使用一个额外的特殊版本的 Stable Diffusion，它针对内存进行了优化。 最好的部分？ 整个训练/调整工作流程将在 Google Colab 中进行，无需编写任何代码！

不过请注意 - 尽管 Colab 是免费的，但资源并非永久可用。 确保您有至少 **60 分钟** 的空闲时间来完成此部分，因为如果您让它继续运行，您可能会用完空闲时间。

如果您***确实***需要在训练结束前随时离开，则必须使用右上角 RAM/磁盘栏旁边的下拉菜单断开运行时。 这将重置您的环境，因此当您下次回来时，您必须从头开始（笔记本中的第 1 步）。

![https://hackmd.io/_uploads/S17baDlYs.png](https://hackmd.io/_uploads/S17baDlYs.png)

从 [单击此链接](https://colab.research.google.com/github/buildspace/diffusers/blob/main/examples/dreambooth/DreamBooth_Stable_Diffusion.ipynb) 开始。 它将在 Colab 中打开一个 Jupyter notebook。 您要做的第一件事是确保您使用的是正确的 Google 帐户。 如果不是，请单击右上角的个人资料并切换到至少有 5 个免费演出的帐户。

接下来，您想将笔记本复制到您的 Gdrive。 这将在新选项卡中打开它。

![](https://hackmd.io/_uploads/H1ONOTVco.png)

我们准备好了！

笔记本有一些额外的字符，您可以在第一次运行时忽略这些字符。

**记住——**每个模块只需要运行一次。

第一个模块将我们的笔记本连接到虚拟机并向我们展示我们连接的是什么。 此块还会启动一个计时器——您只能免费获得有限数量的 GPU 小时数。

![](https://hackmd.io/_uploads/SyBBupV5j.png)

**设置环境**

我们要做的第一件事是整理需求。 每次我们打开一个新的 Colab notebook 时，我们都会连接到一个全新的虚拟机。 每次机器断开连接时，您都需要安装要求 - 状态已清除。

![](https://hackmd.io/_uploads/ryrUu6N9i.png)

这将需要大约 2-4m。

在运行期间，前往 [HuggingFace](https://huggingface.co?ref=buildspace) 并注册。 创建帐户后，我们将需要生成访问令牌！ 这将用于 Colab 的“登录到 HuggingFace”部分。

要获取它，只需单击您的个人资料，单击“设置”，然后转到左侧的“访问令牌”:)。

在这里，您需要点击页面底部的“新令牌”。 随便给这个东西命名，并确保给它 write 角色（稍后会详细介绍）——

![](https://hackmd.io/_uploads/BJ1wdTNqi.png)

将那个坏男孩放入令牌字段，并在需求块全部完成后运行。

![](https://hackmd.io/_uploads/SyG_dpV9o.png)

**举起 - wtf 是 HuggingFace？**

为了让我们在我们的应用程序上从文本→图像，我们需要运行 Stable Diffusion！ 目前，我们可以在 Colab 中执行此操作，但 Colab 没有可以公开的 API 端点。 这意味着我们需要能够在某个地方托管和运行 SD - 请记住，它是疯狂的 GPU 密集型，这意味着它只允许世界上大约 1% 的人使用我们的应用程序，哈哈。

幸运的是，世界一直在使用云计算，我们可以毫无问题地租用 NVIDIA 最新的 GPU 🤘。 **但是** — 这些花哨的 GPU 每月可能要花费 100 美元才能跟上。

这就是 Hugging Face (🤗) 的用武之地。它是世界上最大的 AI 库之一，希望通过开源扩展 AI 的世界。

很多脑细胞都在试图弄清楚我们如何才能让所有人免费使用它，并且正在**炒作 AF** 向您展示如何做到这一点。

但现在，让我们回到 Colab。

接下来，我们需要一个名为 xformers 的精美库。 这些是一个额外的依赖项，将大大加快 Stable Diffusion 的运行速度。 你不需要知道它是如何工作的，只是你应该尽可能地使用它，因为它会提高 2 倍的性能。

该版本需要保持更新，在撰写本文时为 0.0.15 - 如果出现问题，请转到“#section-2”帮助并标记模组。

**配置您的模型**

让我们在这里喘口气！ 您刚刚在 Colab 中做了很多很棒的事情：

1. 开始使用 Google 提供的免费 GPU
2. 设置您的 HuggingFace 帐户 + 创建一个访问令牌
3.安装了一些xformers

**互联网是疯狂的家伙。**

现在我们需要告诉笔记本我们要使用哪种型号。 由于我们正在连接到 HuggingFace，我们可以在那里读取任何公共模型。

V2.1 的提示真的很不稳定，所以我要使用 v1.5。 您可以稍后尝试 v2.1，现在只需将此路径输入“MODEL_NAME”字段并开始：

```
runwayml/stable-diffusion-v1-5
```

选择模型的方法是在HuggingFace 上输入 URL 的路径。 所以 `https://huggingface.co/runwayml/stable-diffusion-v1-5` 变成了 `runwayml/stable-diffusion-v1-5`。

超级重要——**确保选中 `save_to_gdrive`！** 这样，如果笔记本因任何原因崩溃，您就不必再次重新训练整个模型 🥲。

**请注意** — 即使您 **可以** 使用其他微调模型，我们的笔记本电脑仅支持 Stable Diffusion v1.5 和 v2.1。 如果您以某种方式得到了 MidJourney 模型，那么它在这里将不起作用。

**配置训练资源**

这个模型的美妙之处在于它经过了令人难以置信的优化，并且可以配置为以相对较少的资源运行。 幸运的是，我们不需要为此纠结——Google Colab 会推出它。

转到第 5.5 步，这样我们就可以告诉 Stable Diffusion ***我们正在训练它的内容。

**实例提示**：这准确描述了您的图片的内容。 在我们的例子中，它是我们决定的名字（对我来说是“abraza”）和“男人/女人/人”。 这是我们上传图片的**标签**。

**课堂提示**：这只是描述了 Stable Diffusion 应该与您的模型相关的其他内容。 “男人”、“女人”或“人”有效 :)

![](https://hackmd.io/_uploads/SJWi_TE9i.png)

**第 6 步 -** **上传图片**

这个非常简单！ 运行该块，将弹出“选择文件”按钮。 单击选择文件并上传我们之前准备的图像。

![](https://hackmd.io/_uploads/r17adp4qi.png)

**第 7 步 - 配置训练选项**

等等，等等，等等。 我们已经准备好在脸上训练这个东西了吗？ 这感觉就像一个魔术已经暴露给你了是吧？ 我希望您能看到如何做到这一点，虽然需要花费大量时间，但对于当前的技术来说实际上是如此直接！ 让我们疯狂地运行这个东西🤘

好的，下一部分可能看起来很吓人，但您不必接触大部分内容！

同样，如果您真的知道自己在做什么并想自定义您的模型，我将这些留在此处，您第一次需要做的就是：

1. **更改 `max_train_steps`**。 你想让这个数字低于 2000 - 它越高，训练时间越长，你就越“熟悉”SD。 保持这个数字小以避免过度拟合。 这里的一般经验法则是每张图片 100 个步骤，如果您的图片少于 10 张，则加上 100。 所以6张图片，设置成700就好了！ 如果您认为结果看起来不够像您，请回到这里并调高这个数字 哈哈
2. **将 `save_sample_prompt` 更新为带有您的主题的提示。** 训练结束后，此块将使用此提示生成您的 4 张图像。 我建议它比只是“xyz 人的照片”更有趣一点，那些看起来很无聊。 运用那些提示技巧！

![](https://hackmd.io/_uploads/BJflFa4qs.png)

训练进行时，花点时间站起来伸展一下！ 你的背会感谢你，你将能够在更长的生命中盯着屏幕。

![https://hackmd.io/_uploads/rJ2Zt6Nqs.png](https://hackmd.io/_uploads/rJ2Zt6Nqs.png)

当这一切都完成后，运行块 7.2 和 7.3 而不做任何更改。 你应该看到你的第一张图片！！！

**你现在是一名机器学习工程师了。**

好吧，也许现在还不行。

运行接下来的两个块——您不需要在第一次运行时更改任何内容。

第 8 步将权重转换为 CKPT 格式——如果我们想将其上传到 HuggingFace 并获得推理端点，这是必需的。

第 9 步准备转换后的模型，以便为推理做好准备。 再次强调——你不需要知道它是如何工作的，如果你想改变 `model_path` 就在这里。

**生成图像**

我们在这里——应许之地。 使用您神奇的提示能力和唯一的主题标识符来实现一些奇迹。

您可以调高推理步骤以获得更详细的结果，或调高指导比例以使 AI 更听从您的提示。 我喜欢 7.5 的指导等级和 50 的推理步骤。

我发现它最适合定义明确的主题，有很多在线资料，如电视节目、乐队、同人画。

这是我作为 Peaky Blinders 角色，黑手党老大，如果我在 Blink182：

![https://hackmd.io/_uploads/HygXHa49i.png](https://hackmd.io/_uploads/HygXHa49i.png)

我在**第一次**尝试时得到了所有这些！ **虚幻。**

这是我使用的提示：

```
1. concept art oil painting of [SUBJECT] by [ARTIST], extremely detailed, artstation, 4k

2. Portrait of [SUBJECT] in [TV SHOW], highly detailed digital painting, artstation, concept art, smooth, sharp focus, illustration, art by [ARTIST 1] and [ARTIST 2] and [ARTIST 3]

3. Portrait of [PERSON] as [CHARACTER], muscular, fantasy, intricate, elegant, highly detailed, digital painting, artstation, concept art, smooth, sharp focus, illustration, art by [ARTIST] and [ARTIST 2] and [ARTIST 3]
```

我在这里混合了几位不同的艺术家——诀窍是确保他们的风格相似。

给你所有这些魔力的大金罐是你的谷歌驱动器文件夹中的 4GB `.CKPT` 文件。 这就是我们一直以来一直在努力的目标——在**你（**或你的猫）身上训练的自定义稳定扩散模型。

接下来，我们将把它放在 HuggingFace 上，并设置一个 React 应用程序，让世界来试用它！

### 上传到 HuggingFace

最后一步（#11）特别特别——它需要你定制的模型和所有必要的文件，并将它们放在 HuggingFace 上。

在托管模型时，我们通常需要解决两个大问题——

1. **我们在哪里托管我们的新模型？**
2. **我们实际上如何调用我们的托管模型？**

HuggingFace 已经为我们解决了这两个问题！ 它托管我们的模型并具有我们可以访问的推理 API 端点。

你不需要在这里做太多 - 只需更改概念名称（例如：SD-Raza）并从 HuggingFace 输入一个写令牌（你可以使用你在开始时生成的相同的！），点击运行按钮， 并观看魔术发生。

![https://hackmd.io/_uploads/ByCNKTN5s.png](https://hackmd.io/_uploads/ByCNKTN5s.png)

单击链接，您将在右侧看到这一点：

![https://hackmd.io/_uploads/BJMIKpNqi.png](https://hackmd.io/_uploads/BJMIKpNqi.png)

这是您的推理 API 的 UI！ 在那里放一个提示，看看奇迹发生了：D

一旦你按下计算，你会注意到你会收到一条“模型正在加载”的消息。 这是使用HuggingFace 作为免费服务的警告之一。 由于将此模型保存在内存中需要花费大量资金，因此如果您的模型未被使用，Hugging Face 会自动将您的模型从内存中清除。 这为他们节省了资源和在流量不多的模型上的金钱。

有时，此过程最多可能需要 **5 分钟。**因此，如果您要等待几分钟，请不要惊慌。

就这样，您生成了一张图像，就像在 Colab 中一样！ 前往您的[点击此处使用链接](https://api-inference.huggingface.co/dashboard/usage)。 这件事实际上很酷。 Hugging Face 为您提供 30K 个免费字符（基本上是运行这些查询的积分）。 这就是 **PLENTY** 让你开始 :)。

**哇——你刚刚创建了一个自定义模型，将你的模型托管在某个地方，现在有了一个你可以在你的网络应用程序中调用的端点👀**

**请这样做，否则 Raza 会伤心的**

MidJourney 最酷的部分是 Discord 服务器。 你可以看到其他人在做什么，这真的能激励你。 我希望您在 `#prompts` 中分享您最好的提示。 告诉我们什么有效，什么无效！ 这项新技术是个谜，我们可以自己弄清楚:)