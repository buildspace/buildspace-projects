### 🤔关于你的 mint 功能的说明
我们的 mint 函数的设置方式有点不寻常。 我们正在做两件 Flow 上没有多少人会做的事情：
1. 我们让每个人都有能力铸币
2. 我们从前端传入 NFT 元数据

进行 NFT 铸币的更安全的方法是使用 [NFTMinter 资源](https://github.com/onflow/flow-nft/blob/master/contracts/ExampleNFT.cdc#L228)。 该资源为账户提供了铸造 NFT 的能力。 可以把它想象成合同的管理员权限。

现在，如果有人想在我们的合约上铸造 DogMoji NFT，他们完全可以！ 他们只需要更改传递到mint交易中的参数。 这可以通过编写自定义事务并使用 Flow CLI 工具运行它来完成。 处理 NFT 元数据的更好方法是将 IPFS 哈希存储在合约上，并使用 Cadence 增加文件编号。 这样，人们就无法通过您的合约铸造具有各种任意值的 NFT。

我希望您浏览 [文档](https://docs.onflow.org/)，那里有很多教程和文档。 您现在应该能够自己实施这些更改 :)

### 🚀 部署到线上 (GTFOL)
部署 React 应用程序变得如此简单，现在没有理由不这样做，哈哈。 另外，它是免费的。 您已经做到了这一点，部署是最后一步。 另外——一定要得到您在 buildspace 的建设者的 NFTs！！ 请给我们机会铸造您的稀有作品嘿嘿。

基本上：

- 将你最新的前端代码推送到 Github。
- 将 Vercel 连接到您的存储库。
- 确保添加 .env 变量
- 部署。
- 完毕。

注意：在 Vercel 上，您需要添加一个环境变量 `CI=false`。 这将确保我们的构建不会因为警告而失败。

![Environment variables](https://i.imgur.com/wn2Uhj4.png)


### 🥞 Web3 中的职业
许多人还通过 buildspace 在顶级 web3 公司获得了全职工作。 我经常看到人们在完成一些buildspace项目后就完成了面试。

**人们似乎认为 web3 只需要能够编写智能合约代码或编写与区块链接口的代码的人。 不对。**

有很多工作要做，而且大部分工作甚至不需要智能合约来完成，哈哈。 成为 web3 的工程师意味着你掌握了 web2 的技能并将其应用到 web3。

我想快速回顾一下 wtf 它意味着作为一名工程师“在 web3 中工作”。 您需要成为 Flow 的专业人士吗？ 您需要了解区块链的每一件小事是如何运作的吗？

例如，假设您是一位出色的前端工程师。 如果你完成了这个项目，你几乎拥有了在 web3 公司成为优秀前端工程师所需的一切。 例如，公司可能会说“嘿 - 请去构建我们的 NFT 显示功能” - 你已经对如何做到这一点有了一个可靠的想法:)。

我只是想激励你在 web3 中工作，哈哈。 这狗屎真棒 如果你试一试，那会很酷 ;)。

查看 Flow [此处](https://jobs.flowverse.co/) 的职位，他们正在招聘大量很酷的职位！

### 🏝 你的Flow
现在您是一名合格的 Flow 智能合约开发人员，我们将在您的电子邮件中向您发送一个称为 FLOAT 的 ✨*独家*✨ 代币。

它将包含一个您需要领取的特殊代码。 这些都是不可转让的，所以请确保您使用主钱包领取！

### 🌈出发前
转到 Discord 中的#showcase 并给我们一个指向您的最终产品的链接，我们可以玩弄它:)。

此外，您应该完全发布您的最终项目并向世界展示您的史诗般的创作！ 无论如何，你所做的并不容易。 甚至可以制作一个小视频来展示您的项目并将其附加到推文中。 让你的推文看起来漂亮并炫耀！

如果您愿意，请标记@_buildspace,@bitcoinmaobuyi :)。 每当我们看到人们交付他们的项目时，它都会给我们很大的动力。 另外，您可以激励其他人加入 Flow。
如果你想给我们捐赠：0x45ca2696d9a4f762c7a51a22a230797700e28794 

请给我们更多的鼓励吧。

最后，如果您在#feedback 中告诉我们您如何喜欢这个项目以及项目的结构，那就太棒了。 你最喜欢建筑空间的什么？ 什么糟透了？ 我们希望我们为未来的项目做出哪些改变？ 你的反馈会很棒！

[再见！！！](https://twitter.com/AlmostEfficient)

###♥致谢
不管它看起来如何，我确实**没有**自己抽出所有这些内容。 我得到了**很多**的帮助，使这个项目构建得如此惊人。

向我们出色的助教致敬（你绝对应该在 Twitter 上关注他们）：
- [Rohit](https://twitter.com/rohithandique_) - 合同、前端、模板等等
- [Matt](https://twitter.com/TopShotTurtles) - 想法、部分指南、Flow maxi vibes
- [Sean](https://twitter.com/helloitsme_sl) - 前端样式

非常感谢整个 Flow Devrel 和教育团队的所有反馈：
Andrea、Alex、Srinjoy、Kim、Tyllen 以及所有我忘记的人。

最后但def。 尤其重要的是，学习 Cadence 开发的第一名（buildspace 是 #0 ok shh）：
Jacob Tucker 和 Emerald City DAO。