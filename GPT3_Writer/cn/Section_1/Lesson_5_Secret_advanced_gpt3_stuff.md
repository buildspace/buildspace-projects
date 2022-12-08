


我想再介绍几种提示类型，之后我们再开始写代码。

### 提示链接——一种被高度低估的策略。

你可以用 GPT-3 做的一件非常疯狂的事情是提示链接——这是你使用一个提示的输出作为另一个提示的输入的地方。

让我告诉你——**假设我想写一篇关于初创公司的推文。**

我真的很喜欢 Paul Graham 的写作风格，所以我让 GPT-3 给我写一篇关于这件事的文章，我一直在思考创业公司不只是“解决问题”的地方。 当我们开始构建空间时，我们并没有试图解决我们只是在胡闹的问题。 我认为当我们所做的一切都集中在问题上时，创业公司就会失去灵魂。 对我来说，我更相信了解用户。

你想看一篇关于什么的创业文章？ 问保罗格雷厄姆！ 想出你自己的提示。

这是我的提示——我在最后留下了句子，因为我希望 GPT-3 完成它。

```
Help me write an essay in the style of Paul Graham, the co-founder of Y-Combinator.

I don't think it's always about "solving a problem", sometimes it's worth thinking about
```



然后，将其填入GPT-3。

```
Help me write an essay in the style of Paul Graham, the co-founder of Y-Combinator.

I don't think it's always about "solving a problem", sometimes it's worth thinking about the problem in a different way.

In the early days of a startup, it's often more important to focus on building something people want, than on solving a particular problem. It's easier to change your approach later, once you have a better understanding of what people want and what the problem is.

This is why I often encourage founders to start by building something small and simple, rather than trying to solve a big problem from the start. It's important to get feedback from users as early as possible, so you can validate your assumptions and course correct if necessary.

Of course, there are exceptions to this rule and some problems are so big and complex that it makes sense to focus on them from the start. But in general, I think it's more important to focus on building something people want, than on solving a particular problem.
```



其实还不错！！ 但是，我想把它们变成一条推文。

让我给你看一些疯狂的东西。 打开一个带有空 Playground 的新网页。 所以，你现在应该有两个选项卡。 一张有文章（Playground #1），另一张是空的（Playground #2）。

在 Playground #2 中，继续编写此提示：

```
Take the essay below and turn it into a tweet thread.
```



现在，在下面——复制粘贴 Playground #1 的输出。 所以对我来说它看起来像这样：

```
Take the essay below and turn it into a tweet thread.

I don't think it's always about "solving a problem", sometimes it's worth thinking about the problem in a different way. In the early days of a startup, it's often more important to focus on building something people want, than on solving a particular problem. It's easier to change your approach later, once you have a better understanding of what people want and what the problem is. This is why I often encourage founders to start by building something small and simple, rather than trying to solve a big problem from the start. It's important to get feedback from users as early as possible, so you can validate your assumptions and course correct if necessary. Of course, there are exceptions to this rule and some problems are so big and complex that it makes sense to focus on them from the start. But in general, I think it's more important to focus on building something people want, than on solving a particular problem.
```



当我运行 Playground #2 时，生成的内容如下：

```
1/ It's not always about "solving a problem". Sometimes it's more important to focus on building something people want. 

2/ This is why I often encourage founders to start by building something small and simple, rather than trying to solve a big problem from the start. 

3/ It's important to get feedback from users as early as possible, so you can validate your assumptions and course correct if necessary. 

4/ Of course, there are exceptions to this rule and some problems are so big and complex that it makes sense to focus on them from the start. 

5/ But in general, I think it's more important to focus on building something people want, than on solving a particular problem.
```



疯了，对吧？ 你现在有一个 2 分钟长的 Twitter 线程，讲述你的一个想法——这听起来也非常合理。 它非常简洁明了，这正是 Paul Graham 所写的。

现在任何人都可以成为思想领袖，哈哈。

**这称为提示链接。**我们从 Playground #1 中的提示中获取输出，并将其插入到 Playground #2 中的另一个专门提示中。 你可以继续这样做，它会在专门的任务中变得更好。

为什么这个效果这么好？

好吧，GPT-3 在以下情况下表现更好：1）你给它更多的例子 2）你对它的要求非常具体。 提示链接混合了这两者！

以下是您可以链接的提示的其他示例：

- *为博客生成目录→为每个部分写一个句子→为每个句子写两个段落→完成*
- **生成一个关于男孩和女孩的悲伤爱情故事 → 生成一个说唱合唱 → 生成一个押韵的副歌，并有德雷克风格的歌词 → 根据副歌生成前奏和尾声 → 完成。**
- **为产品生成标题着陆页副本 → 为产品生成更详细的副本 → 生成针对巴基斯坦 26 岁年轻人的广告副本 → 完成**

提示链接被**高度**低估并且没有被谈论太多。 它确实可以让您在完成您想到的特定任务时获得真正出色的性能。 感谢我的好友 [Sharif](https://twitter.com/sharifshameem) 向我展示了它！

### 使用端到端的 GPT-3 建立一家初创公司：从创意到 VC 推销。 在 5 分钟内。

让我们将这些提示技能用于测试，并使用 GPT-3 建立一家初创公司——从创意到落地再到 VC 推销。 创业最难的部分通常是想出好主意，所以让我们问问 GPT-3！

我要征求关于 GPT-3 和阅读的好主意，因为我觉得 GPT-3 超级酷，阅读是每个人都想做的事情！ 我还专门告诉它为孩子可以使用的东西产生想法。 我这样做是因为我曾经经营一家名为 [ZipSchool](https://mobile.twitter.com/FarzaTV/status/1488965852519022592) 的公司，该公司为孩子们制作科学内容。

```
Give me some cool startup ideas around ML and reading for kids:
```



一定要让它围绕你感兴趣的东西产生想法！

同样，尽可能具体。 您希望您的初创公司使用什么技术？ 你感兴趣的观众是什么？ 您真正希望产品做什么？

我的输出实际上非常酷。

```
Give me some cool startup ideas around GPT-3 and reading for kids:

1. A GPT-3-powered reading app that can customize reading material for each individual child based on their reading level, interests, and needs.

2. A GPT-3-powered app that can generate personalized reading material for kids based on their interests and areas of need.

3. A GPT-3-powered app that can read aloud to kids, highlighting words as it goes so they can follow along.

4. A GPT-3-powered app that can answer questions kids have about the material they're reading, helping them to understand and engage with the text.
```



我喜欢第一个想法——它很漂亮。

想象一下，如果孩子们可以通过专门为他们生成的定制故事来学习阅读。

这些故事对他们来说是完美的。 GPT-3 甚至可以生成他们真正喜欢的故事（例如侦探故事、冒险故事等）。 这些故事甚至可以包括他们想出的角色的名字。 他们可能在他们自己的故事中。 另外，我们甚至可以告诉 GPT-3 使用某些类型的词汇来确保阅读水平恰到好处。

**在继续之前，一定要在一个你认为有趣的行业中产生一个你有点喜欢的想法——虚拟现实、加密、增强现实、游戏、金融科技、消费者等。你需要在这个行业中进行很多尝试， 观众等。一如既往，不要复制我！ 善于提示！**

### 为您虚构的初创公司编写登陆副本。

现在检查一下，我将获取该输出并将其链接到新提示。 我想在这里更深入地写一些着陆页副本。 **着陆页文案对我来说总是超级困难**因为很难做到简短、甜美和描述性强。

我一直很喜欢 Apple 的营销/文案！ 让我们这样生成它：

打开 Playground #2。 这是初始提示：

```
Write a list of short landing page headlines in the style of Apple for a startup that builds the following:

<insert the generated idea from above here>
```



所以对我来说，我的完整链接提示看起来像这样，我所做的就是采用 GPT-3 为我生成的想法。 同样，你应该改变你的提示——也许你更喜欢迪士尼或耐克等其他品牌。 也许您喜欢更励志的标题！ 同样，您只需要确保告诉 GPT-3 您想要什么。
```
Write a list of short landing page headlines in the style of Apple for a startup that builds the following:

A GPT-3-powered reading app that can customize reading material for each individual child based on their reading level, interests, and needs.
```


这是我生成出来的：

```
1. The ultimate reading app for kids – powered by GPT-3!
2. Customize reading material for each child – based on their reading level, interests, and needs.
3. The perfect reading app for kids of all ages and abilities!
4. Get your kids reading with the help of GPT-3!
5. The best reading app for kids – GPT-3 powered!
```



非常好！ 但我们可以做得更好。 在提示中，我们应该包括这个产品是给谁的！ 毕竟，网站页通常针对特定用户类型进行了超级优化。

我要为我的父母指定父母，因为我想我将主要针对将应用程序提供给他们的小孩的父母进行营销。 我也不希望其中出现像“GPT-3”这样令人困惑的词，因为大多数人甚至不知道那是什么。

我不会更多地介绍这个例子，但一定要自己尝试一下。

如果您想查看，这是我的提示：
```
Write a list of short landing page headlines in the style of Apple for a startup. Write the copy to appeal to parents with kids in kindergarten. Don't include confusing terms like GPT-3 in it. The startup builds:

<insert the generated idea from above here>
```



### 写一个音调！

惊人！ 我们现在有了一个想法+一个网站标题——现在我们只需要制定一个商业计划并从一些风投那里筹集一些资金！ 但是，该死的，写音调很难。 是时候让 GPT-3 让我们成为一体了。

这是我创建的提示，用 GPT-3 从上面生成的启动想法填写它。 我还包括了 Y-Combinator 说要包括的音调的基本部分 [此处](https://www.ycombinator.com/library/2u-how-to-build-your-seed-round-pitch-deck) .
```
Write me a pitch to a VC for a startup that includes the problem it's solving, the solution, market size, and the business plan. This startup builds a:
```



这是我对以下想法的完整提示——如果需要，请随意编辑 GPT-3 吐出的想法。 如果您想重新表述这个想法，或者如果您有其他想法，只需根据需要更改提示：

```
Write me a pitch to a VC for a startup that includes the problem it's solving, the solution, market size, and the business plan. This startup builds a: GPT-3-powered reading app that can customize reading material for each individual child based on their reading level, interests, and needs.
```


一旦我运行它，输出就非常疯狂：

```
Hi, 

Our startup is developing a GPT-3-powered reading app that can customize reading material for each individual child based on their reading level, interests, and needs. By using natural language processing and machine learning, our app is able to provide a personalized reading experience for every child. 

The reading app market is growing rapidly and is expected to be worth $2.4 billion by 2025. Our app will be available for a monthly subscription of $9.99. 

We have a strong team of experienced developers and educators who are committed to making our app the best it can be. We have a clear business plan and are confident in our ability to execute it. 

We would love to have the opportunity to pitch our startup to you and answer any questions you may have. Thank you for your time!
```



**GPT-3 确实给我写了一个比 99% 的创始人更好的音调，哈哈。**

它包括所有好的东西——市场规模、商业计划、团队等等。它甚至包括这个应用程序每月花费 9.99 美元的事实，哈哈。 不过，它本可以更好地解释问题。 但是，我们可以更改我们的提示并告诉 GPT-3 确保它更多地关注这一点。

同样，您生成的音调现在可能很糟糕。 花时间玩提示。

只是对 GPT-3 非常具体——*“包括每月订阅的描述”*，*“包括市场规模的描述”*，*“包括我们计划如何花钱”，* 等等。你可以 甚至可以做*“给我写一封电子邮件，向 VC 推荐 Paul Graham 风格的初创公司”* 或您认为合法的任何其他创始人！

每当你阅读你的输出并想，“伙计！ 我希望 GPT-3 能给我更多 X 的东西”——直接向 GPT-3 索取 X 的东西！

### 让我们真正地构建一些东西。

希望这对你来说是一次有趣的小冒险——我希望你对你能做的很酷的事情充满想法。 一个帮助人们编写登陆页面副本的网站，一个帮助人们写出更好推文的应用程序，一个帮助脚本作者创造更有趣世界的工具，等等。

GPT-3 的用例实际上是无穷无尽的，我只介绍了其中的几个。 该死，这个东西甚至可以为你生成正则表达式——[看看我们的一位校友建造的这个东西](https://twitter.com/gd3kr/status/1545370626273120256) 已经 **病毒式传播了**。

我甚至没有向您展示它可以用代码做的事情！ [这里](https://www.buildgpt3.com/) 是一个非常好的网站，我建议您滚动浏览以获取更多提示示例和用例 + 演示。

嘿！ 我甚至给了你一个免费的创业点子，用这个为孩子们准备的阅读应用程序可以用 GPT-3 生成故事，哈哈。 甚至给了你一封免费的冷电子邮件发送给风投！ 希望你们中的一个能从中筹集到几百万美元，哈哈。

更新：哈哈，我们的一位校友正在 [现在正在研究它。](https://onceuponabot.com/) 可以免费使用它 rn！

### 请这样做，否则 Farza 会很难过。

对您想建造的东西有想法吗？ 我知道这个版本的标题是“构建你的 A.I 写作助手”，但你可以随意构建任何你想要的东西 哈哈。 随机疯狂的想法：

- 一个 AI 健身教练，人们可以在其中选择他们想要的教练，想象 Goku 为您提供锻炼建议和锻炼计划。
- 帮助人们编写清晰的产品文档的 Notion 写作助手——它将规范作为输入并输出一个更清晰、更可操作的规范版本。
- 一种工具，可为 YouTube 视频生成非常好的标题，并自动对它们进行 A/B 测试以查看哪个获得更多观看次数。
- 一个食谱生成器，它可以获取冰箱中的配料清单，并为您提供可以使用它制作的东西的食谱。

想法是无穷无尽的。

在继续之前，想出你自己认为很酷的疯狂想法。 得到一个后，将其张贴在#ideas 中。 随时查看频道以获取其他人的想法以及灵感！

*P.S：大多数想法都可以在 Playground 中快速测试。 无论你有什么想法——在 Playground 中为它写一个快速提示，然后看看它是如何进行的。 迭代！*