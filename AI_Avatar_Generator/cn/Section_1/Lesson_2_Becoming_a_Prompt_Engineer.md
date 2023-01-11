让我们直接进入吧——到本节结束时，您将在进入疯狂的提示时生成您的第一个 AI 头像图像。

为什么我们不从 wtf a prompt even is 开始？

提示就像一个魔法咒语 - 它是描述您想要的图像的一个句子或一组短语。 你需要以正确的顺序使用正确的词，否则事情会变得很奇怪。

![](https://hackmd.io/_uploads/S1e-I649j.png)

我们将编写大量提示，我们将很快进入高级内容，所以我建议查看这个很棒的 [Prompt Engineering 101](https://buildspace.so/notes/prompt-engineering-101-sd) 来自我们的常驻提示策划者 Jeffrey 的说明，让我们赶上来。 在 [Twitter](https://twitter.com/ser_ando) 上查看他，他在那里发布了一些疯狂的好东西。

请注意：创建提示是一项技能。 你不会在 30 分钟内成为一个快速的上帝。 你的大部分提示都会很糟糕，但这没关系。

**当你不擅长某事时，唯一的保证就是你会做得更好 :)**

有几个地方可以生成图像，我们将从 [DreamStudio](https://beta.dreamstudio.ai/) 开始——它是 Stability AI 提供的官方工具，Stable Diffusion 背后的公司，它有 最新版本，它可以让你配置一些重要的东西。

![https://hackmd.io/_uploads/HyiEJG3ds.png](https://hackmd.io/_uploads/HyiEJG3ds.png)

您将从 100 个学分开始，根据您的设置，这足以用于 100-200 张图像。 确保打开设置并加快步数——步数越高，图像的准确性就越高。 我走了 75 步。 您还需要将模型更改为 Stable Diffusion 2.1（或最新版本）。 我还把它调低为每个提示两张图片，因为我不想浪费演职员表，哈哈。

我希望你在这里做的是**找到你的风格**。 试用我将要分享的所有修改器。 我们将逐层构建，因此您将有很多机会将它们混在一起。

我将基于在 LOTR 世界中创建 AI 化身来建立我的网站。 现在是你选择一个主题并全力以赴的时候了。 如果您有方向可循，您的应用最终会好 10 倍。

好吧，好吧，解释够了——让我们开始吧。

### 艺术史/理论速成班

你知道人们如何开玩笑说艺术史是一个无用的学位吗？ 这与 AI 艺术大声笑完全相反。 就像杰弗里在 101 笔记中提到的那样——你需要了解真正艺术家的技巧和各种风格，这样你才能知道*如何*描述亚当的下一个创造。

这些模型不是来自另一个星球的外星人——它们是全人类被压缩到一个程序中。 在过去的十年里，我们在互联网上发布的所有内容最终都变成了这些庞大的实体，它们像我们一样给事物贴上标签。

当我们研究使艺术如此吸引人的每个支柱时，我们将产生史诗般的艺术。 您将能够看到每个部分如何相互作用以及它们如何无缝融合在一起。

**当我们踏上艺术史之旅时，我们将积极尝试 DreamStudio 中的提示！ 因此，请确保它已打开并准备好摇滚 🤘。**

**艺术家**

**莱昂纳多。 拉斐尔。 米开朗基罗。 多纳泰罗。**

世界上几乎所有最知名的艺术家都拥有截然不同的艺术风格。 互联网上充斥着他们的作品和各种衍生作品——灵感、致敬、模仿。 这使得在提示中使用艺术家姓名非常强大。

艺术家姓名将对您的图像风格产生**最大**的影响。 它将成为您构建图像的基础，并将对大部分氛围负责。

如果像我一样，你所知道的唯一艺术家是那些以忍者神龟命名的艺术家，那么这里有一个你可以尝试的各种艺术家的列表：

- 詹姆斯格尼
——约翰·辛格·萨金特
——埃德加·德加
- 保罗塞尚
——扬·凡·艾克

这个特定的修改器是一个非常棘手的修改器——所有的文本到图像模型都是根据从互联网上获取的艺术进行训练的，没有得到他们的创作者的明确许可。 有很多关于**谁**拥有使用这些模型生成的图像的讨论，很多艺术家都很生气，因为他们不同意他们的艺术被用于训练。

这份名单上的名字并不是偶然选择的——其中 4 位是历史上著名的肖像艺术家（已经去世），第五位可以将他们的名字用于 AI 艺术。

这就是说 - **尊重艺术家的决定，未经创作者许可不得使用特定的艺术风格。**

你可以去 [ArtStation](https://www.artstation.com/) 和 [DeviantArt](https://www.deviantart.com/) 之类的网站寻找更多你喜欢的艺术家，或者洗个澡 去你当地的艺术博物馆，我保证这是值得的，你会学到更多关于艺术的知识。

**生成时间**

我住在新西兰的奥克兰——离夏尔只有一个小时的路程，所以我要用 SD 来想象甘道夫如果他是迪斯尼制作。 这是我的第一个提示！

```json
A profile picture of Gandalf from Lord of the Rings in the style of Pixar, smiling, in front of The Shire
```

很简单！ 您会了解到您不需要**在提示中**很多细节，您只需要具体说明您想要什么。 这是一个重要的区别。 我将设置中的步骤提高到 150 - 这使结果更好，但会花费更多的 GPU 时间。

这是我得到的最好的：

![](https://hackmd.io/_uploads/S1h7GWH9j.png)
不错。 头发有点乱，牙齿也掉了，但这只是我们的第一个提示：P

让我们尝试改变媒体！

**中等的**
**丙烯酸纤维。 水彩。 微软画图。**

文森特梵高从未制作过像素艺术，但借助稳定扩散的力量，您可以找出它可能的样子。

坚持使用更流行的媒体，如数字插图、绘画和像素艺术。 内容越多，Stable Diffusion 就会越好。 影子画不如油画好，因为互联网上有更多的油。

以下是您可以使用的媒体列表：

- 丙烯画
- 水彩绘画
- 像素艺术
- 数码插画
- 大理石雕塑
- 宝丽来照片
- 3D渲染

其中一些媒体可以结合使用！ 这是一个用“铬铜大理石”制成的奇异博士雕塑，[Jeffrey 用 MidJourney 召唤](https://twitter.com/ser_ando/status/1600335448039006208)：

![](https://hackmd.io/_uploads/rJLILpVqi.png)

我们真的在未来。

我想我想看看甘道夫的 3D 渲染图会是什么样子。 这是我更新的提示：

```
A Pixar style 3D render of Gandalf from Lord of the Rings, smiling with his mouth closed, in front of The Shire, green hills in the back
```

没有太大变化。 我添加了“3D 渲染”，其余部分保持原样。

![](https://hackmd.io/_uploads/By4v8aNqj.png)

**疯了——**这他妈的有多酷？？

**审美的**

你有你的媒介和你的艺术家。 接下来是氛围——这是一种 lofi 风格的氛围还是我们要去赛博朋克？

这是我的最爱：

- 幻想
- 蒸气波
- 赛博朋克
- 蒸汽朋克
- 哥特式
- 科幻，未来

[这里有大量美学列表](https://aesthetics.fandom.com/wiki/List_of_Aesthetics) 供您查看。 您甚至可以打造自己的氛围！ 这是使用 GPT-3 制作的 Dronecore 时装：

![](https://hackmd.io/_uploads/BJxK8TE5s.png)

[来源](https://twitter.com/fabianstelzer/status/1599525776952414208)

我想要一些幻想色彩的东西，所以我选择了这个：

```
A Pixar style 3D artwork of Gandalf from Lord of the Rings, smiling with his mouth closed, in front of The Shire, green hills in the back, fantasy vivid colors
```

![](https://hackmd.io/_uploads/SJEqI6V5o.png)

这开始看起来像 LOTR lol 的 Pixar 版本。

**描述符**

我要介绍的最后一个要素是最模糊的一个——它不是一个特定的区域，而是一般的描述符。

- **时间** 1970年代、石器时代、天启、古代、大萧条、二战、维多利亚时代
- **四季**冬、夏、春、秋
- **假期** 开斋节、圣诞节、排灯节、复活节、万圣节、光明节
- **细节** 详细、超现实、高清、ArtStation 上的趋势（是的，真的）

尝试一下，并在您的提示中添加几个这样的描述符！ 当您获得喜欢的图片时，请确保将其放入我们 Discord 的“#prompts”中，向其他人展示您的创意！

您可以使用提示做**更多**。 你可以花数周时间学习所有关于人类如何描述事物的知识。 我会留给你一点你需要记住的：

**AI 模型在互联网上几乎所有的人类媒体上进行训练**

这意味着您可以在互联网上找到的任何东西，这个模型也可能知道。 著名电影的剧照。 人物的粉丝艺术。 特定导演的标志性场景分解。 不同摄像机角度、不同电影、分辨率、照明、镜头、照片类型的镜头。 AI 已经看到了所有（除了 NSFW 的东西，他们删除了它：P）。

我发现互联网比我的直接想象更大，所以如果你能想象它，人工智能很可能知道它，你只需要找到合适的词。

这里有一些方便的链接，其中包含单词可以做什么的各种示例：

[**中**](https://docs.google.com/document/d/1_yQfkfrS-6PuTyYEVxs-GMSjF6dRpapIAsGANmxeYSg/edit)

[**颜色**](https://docs.google.com/document/d/1XVfmu8313A4P6HudVDJVO5fqDxtiKoGzFjhSdgH7EYc/edit)

[**相机**](https://docs.google.com/document/d/1kh853h409DeRTg-bVo_MSYXrWjMDRMX9kLq9XVFngus/edit)

[**照明**](https://docs.google.com/document/d/1qcpgNsA-M998zy0ngVvNcMs2AYHpMuAjAefM6p63Tp8/edit)

[**电影**](https://docs.google.com/document/d/1vM9izOU4bQIcrKxAZiw85Q826zb6kBsjUQKdawm3lyk/view)

退后一步，看看您美丽（而不是那么美丽）的创作。 你正在为世界创造下一波令人惊叹的艺术浪潮——现在让我们把它扩大 10 倍。

### 高级配置标志

好吧，好吧——很高兴在高级部分见到你。 希望您发现了一些使用 DreamStudio 生成图像的神奇方法。 让我们看看我们如何通过让 SD 更容易理解来使它变得更好。

大多数型号都可以在您的提示*内部*配置设置。 您可以做什么以及如何做取决于模型。 例如，DreamStudio 让您将多个提示与竖线“|”字符结合起来：

```
Portrait illustration of Gandalf from Lord of the Rings : 2.0 | The Shire in the background: 0.4 | Renaissance oil painting
```

提示后的数字表示权重，可以增加 +/-10.0。 点击提示输入框左上角的问号查看更多详情

![](https://hackmd.io/_uploads/r1jo86Vcj.png)

看起来我必须在背景上施加权重，但这非常好！

对于其他型号，它们各有不同的权重。 如果您决定使用其他工具，例如 Midjourney，请务必查看他们的手册！

### 否定提示

我们已经讨论了很多关于如何告诉 Stable Diffusion 如果你想要图像中的东西，但是如果你***不***想要什么东西怎么办？ 让我演示给你看 ：）。

你可能已经注意到我一直在告诉 Stable Diffusion 我希望 Gandalf 闭着嘴微笑以获得一堆提示。 这是因为它通常弄乱了他的牙齿。 我可以通过给它一个负权重来做同样的事情：`smiling:-1`

```
Renaissance portrait of Gandalf from Lord of the Rings in the style of The School of Athens, vibrant colours, highly detailed : 2.0 | The Shire in the background : 0.8 | Detailed baroque painting, Michelangelo Buonarroti, Raphael : 1.0 | Smiling: -1 | Duplication: -1
```

这是我得到的：

![](https://hackmd.io/_uploads/r1vT8aE9i.png)

**哇**。 我越来越喜欢古典艺术了。

我增加了第二个街区的重量，其中两个街区的背景是夏尔！ 其余的，我只是用谷歌搜索了“著名的文艺复兴时期的画作”，因为我知道稳定扩散会知道所有流行的画作。 我选择了我喜欢的人的名字和艺术家，然后跳进 [Lexica](https://lexica.art/) - 一个用于 Stable Diffusion 的搜索引擎。

我查了艺术家的名字，甚至只是查了“文艺复兴”这个词，看看哪些提示做得很好。 作为一个16岁才知道古典艺术时期存在的人，我觉得这个还不错！

我在这里不喜欢的一件事是提示越来越拥挤。 某些服务（如 Lexica）有一个专门用于否定提示的字段，请查看：

![](https://hackmd.io/_uploads/S1rAIaEqs.png)

有趣的是，这也算是“高级”，但其实也没有那么糟糕吧？ 这更像是您可以使用更多工具来使您的提示更加**更好。**

### 请这样做，否则 Raza 会很难过。
您应该在生成史诗提示的**真正**好路径上！ 在这一点上，再走 30 米来处理提示，直到你找到一个让你震惊的提示。

继续复制您的头像并将其发布到 Discord 上的“#prompts”中。 确保在消息中包含您的提示，以给其他人一些启发。