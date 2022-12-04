*注意：如果您在 buildspace 上做过以前的项目，那么接下来两节课中的许多初始设置项目都是从以前的项目中重复的。如果你已经明白了，太棒了！你是专业人士。随意快速地通过它*。

### 📚 一点区块链入门

首先，我们需要让我们的本地以太坊网络正常工作。这就是我们编译和测试智能合约代码的方式！您知道如何启动本地环境来处理 Web 应用程序吗？在这里是同样的处理方式！

现在，您只需要知道智能合约是一段存在于区块链上的代码。区块链是一个公共场所，任何人都可以通过一些费用安全地读写数据。把它想象成有点像 AWS 或 Heroku，只是没有人真正拥有它！它由成千上万被称为“矿工”的随机人员经营。



这里的整体情况是：

1 -- **我们要编写一个智能合约**。该合同包含我们域名的所有逻辑。

2 -- **我们的智能合约将部署到区块链**。这样，世界上任何人都可以访问和运行我们的智能合约——我们将让他们创建域名！

3 -- **我们将建立一个客户网站，让人们可以轻松地从我们的作品中创建域名。**

我建议您还可以阅读 [这些](https://ethereum.org/en/developers/docs/intro-to-ethereum/) 文档，以寻求乐趣。在我看来，这些是互联网上了解以太坊运作方式的最佳指南！



### ⚙️ 设置本地工具

我们将经常使用一个名为 **Hardhat** 的工具，它可以让我们快速编译智能合约并在本地进行测试。首先，您需要获取 node/npm。我们建议使用当前的 LTS（Long Term Support） Node.js 版本运行 Hardhat，否则您可能会遇到一些问题！您可以在 [此处](https://nodejs.org/en/about/releases/) 找到当前版本。要下载 Node，请访问 [此处](https://nodejs.org/en/download/)。

接下来，让我们前往我们的终端（不是用Git Bash ）。继续并 `cd` 到您想要工作的目录。并运行这些命令：
```bash
mkdir cool-domains
cd cool-domains
npm init -y
npm install --save-dev hardhat@latest
```



在运行最后一个命令并安装 Hardhat 后，您可能会看到有关漏洞的消息。 每次您从 NPM 安装某些东西时，都会进行安全检查，以查看您正在安装的库中是否有任何已报告的漏洞。 这更像是对你的警告，所以你要知道！ 运行 `npx audit fix` 会破坏一切，所以最好跳过它。 如果您想了解更多信息，请在 Google 上搜索一下这些漏洞！

### 🪄 示例项目

太棒了，现在我们应该有hardhat了。 让我们开始一个示例项目。

运行：
```bash
npx hardhat
```


选择“Create a JavaScript project”选项。 对一切都说yes。

示例项目将要求您安装“@nomicfoundation/hardhat-toolbox”。 这些是我们稍后会用到的其他好东西:)。

继续安装这些其他依赖项，以防它没有自动执行。
```bash
npm install --save-dev @nomicfoundation/hardhat-chai-matchers chai @nomiclabs/hardhat-ethers ethers
```



您还需要安装一个名为 **OpenZeppelin** 的东西，这是另一个经常用于开发安全智能合约的库。 我们稍后会详细了解它。 现在，只需安装它 :)。



```bash
npm install @openzeppelin/contracts
```

### 🌟 运行它

确保一切都在运作，运行：

```bash
 npx hardhat compile
```
然后运行:

```bash
npx hardhat test
```

你看到的应该是这样的界面:

![https://i.imgur.com/0pmWiND.png](https://i.imgur.com/0pmWiND.png)

让我们做一些清理工作。

继续，现在在您最喜欢的代码编辑器中打开项目的代码。 我最喜欢 VSCode！ 我们想删除为我们生成的所有蹩脚的启动代码。 我们不需要这些。 我们是专业人士！

继续并删除 `test` 下的文件 `Lock.js`。 另外，删除 `scripts` 下的 `deploy.js`。 然后，删除 `contracts` 下的 `Lock.sol`。 不要删除实际的文件夹！



### 🚨 点击“下一课”之前

*注意：如果你不这样做，Raza 会很伤心:(*

前往#progress 并张贴一张显示测试输出的**您的**终端的屏幕截图！ 你刚刚运行了一个智能合约，这很重要！！ 炫耀它:)。

P.S：如果您**没有** 访问#progress，请确保您链接了您的 Discord，在 [此处](https://discord.gg/buildspace) 加入 Discord，在#general 中联系我们，我们' 将帮助您访问正确的频道！


