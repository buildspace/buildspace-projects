事情总是在越来越好。 我在开店时经常会很开心地把各种不属于商店的东西放进去。 你能想象一家出售虚构物品的商店吗。

我们将从 web3 最神奇的事情之一开始，用你的钱包连接到一个应用程序。

我们将允许用户使用他们的 Solana 钱包“登录”。 建立授权通常非常困难， 你需要有一个用户名、密码等数据库。我讨厌商店总是要求你提供电子邮件地址、姓氏、左脚袜子尺码和国际象棋等级。 让我们傻瓜式 copy一份 JavaScript 副本然后立马逃离。

在当前情况下，它要比您想象的容易得多！ 这是我们的计划：

1. 获取该 Web 应用程序的基础代码（我提供了一些入门 HTML/CSS，因此您可以专注于真正重要的事情，哈哈）。
2. 编写允许用户使用 Solana 钱包连接到应用程序以设置“身份验证”状态的代码。
3. 在 IPFS 上设置您要出售的商品。
4. 开始编写 Solana Pay 代码以获得报酬。

这真的是非常**漂亮的炒作**。

我们在 buildspace 真正喜欢的一件事是人们在他们的项目中投入的极致创造力。 把这个项目变成你自己的，然后按照你认为合适的方式去做。

**如果您所做的只是复制/粘贴代码，那么这将变得很无趣。**

我提供的 Web 应用程序基础代码只是为了让您更容易入门。 做出一些适当的修改， 也许你讨厌我使用的颜色， 那就改掉它。 也许您的网站想使用更加轻便模式 (ew) 为主题， just do it。

如果你最终做出了某些更改，请在 `#progress`频道中艾特我并说 - “Yo Raza 我让你的代码变得更好了” 并留下截图。

好吧-让我们开始吧。

### 🏁 入门

我们将使用 **Next.js** 来构建我们的 web 应用程序。它是基于 **React.js** 框架。如果您已经很熟悉 React，这将是一件轻而易举的事。如果你还没有很多 React 经验，不要担心！你仍然可以完成这个项目，但可能会觉得有点困难。

但不要放弃！知识往往是经过不断的探索才学到的🧠.

如果您没有使用 React的经验，或许在你开始之前，可以查看该[入门教程](https://www.freecodecamp.org/news/nextjs-tutorial/)。也可以查看[介绍文档](https://nextjs.org/learn/foundations/about-nextjs)。或者就这样，开始你的项目，在实践中开始学习：）。

当您完成此项目后，您将成为下一个高手🧙‍♂!

实际上，我首先在 React 中编写了这个项目，但由于内置了服务器，所以将其迁移到了 Next。它让事情变得非常简单，因为你不必处理Express.js。

### ⬇️ 拉取代码
转到 [此链接](https://github.com/buildspace/solana-pay-starter)，然后单击右上角的 “fork”。

![](https://i.imgur.com/OnOIO2A.png)

非常好！ 当你 fork 这个 repo 时，你实际上是在创建一个副本，它存在于你的 GitHub 配置文件中。 所以现在您有了自己的代码版本，您可以根据自己的喜好进行编辑。

这里的最后一步是在您的本地机器上实际获取您新分叉的存储库。 单击“代码”按钮并复制该链接！

前往您的终端并进入您的项目所在的任何目录。我建议将它跟其他项目一起放在已知文件夹中， 我说把它放在桌面上。

```
# I'm running this in my "Desktop/" directory 
git clone YOUR_FORKED_LINK
cd solana-pay-starter
```
就是这样！从这里开始运行：

```
npm install
```

如果您没有安装 Node，这里可能会出错，您可以按照 [这些说明](https://github.com/nvm-sh/nvm#installing-and-updating) 通过 NVM 安装。

现在您可以通过以下命令在本地运行 Web 应用程序：

```
npm run dev
```

在浏览器中输入 localhost:3000 可以打开应用程序。你的应用现在啥也没有，就像我们想要的那样。这将是我们的空白画布，我们将根据自己的喜好进行调试。现在，只需将文本更新为您想要的任何内容!

如果您想要从头开始：请注意！ Solana Pay 的库是全新的。 这意味着如果您使用 Create-React-App 从头开始设置，您将遇到[一堆麻烦](https://github.com/solana-labs/wallet-adapter/issues/241)。 我已经为您解决了这些麻烦，并准备好出发了！

您可能想知道 “嗯，Raza 是如何构建这些？他对我隐藏了什么秘密？”。 嗯，亲爱的读者，每个项目推出的第一件事就是**模板**，所以像*你*这样的先驱可以花时间发布而不是从头开始设置。 我查看了文档并[找到了这些入门模板](https://github.com/solana-labs/wallet-adapter/tree/master/packages/starter)。 我所做的只是将 Next.js starter 从 Typescript 转换为 JavaScript，并添加了一堆样式。

就像这样，您的商店就有了前端网页😎。 ：

![](https://hackmd.io/_uploads/Hy9JJK8Pq.png)

### 🚨 进度报告
请一定记得报告，否则 Raza 会很伤心的💔:(

玩转你的乐园！ 也许叫别的名字西？ 你想卖什么类型的东西？ 这是您发挥创意的机会！

**在#progress :) 中发布您的入门 Web 应用程序的屏幕截图。**






