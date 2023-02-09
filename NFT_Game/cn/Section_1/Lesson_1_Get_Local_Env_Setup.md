*注意:如果您已经在buildspace做过前面的项目，那么接下来两节课中的许多初始设置项将重复以前的项目。如果您已经理解了，那太棒了!您是专业人士。请随意快速浏览即可*

### 📚 区块链入门知识

在做任何事情之前，我们需要让我们的本地以太坊网络工作。这是我们如何编译和测试智能合约代码的方法!您知道如何创建本地环境来进行工作吗?这里也一样!

现在，您只需要知道智能合约是保留在区块链上的一段代码。区块链是一个公共场所，任何人都可以安全地读取和写入数据，但需要付费。你可以把它想象成AWS或Heroku，只不过没有人真正拥有它!它是由数千名被称为“矿工”的随机人员管理的。

整个流程是这样的:

1 - **我们要写一个智能合约**。这份智能合约包含了我们实现游戏的所有逻辑。

2 - **我们的智能合约将被部署到区块链**。这样，世界上任何人都可以访问并运行我们的智能合约——我们也会让他们访问我们的游戏。

3 - **我们将建立一个客户端网站**，让人们可以轻松连接他们的以太坊钱包并玩我们的游戏。

如果你觉得有趣的话，我建议你也阅读[这些](https://ethereum.org/en/developers/docs/intro-to-ethereum/)文档。在我看来，这些是互联网上理解以太坊如何工作的最好指南!

### ⚙️ 设置本地工具

我们将经常使用一个名为**Hardhat**的工具，它可以让我们快速编译智能合约并在本地测试它们。首先，您需要获取node/npm。如果你没有，请到[这里](https://hardhat.org/tutorial/setting-up-the-environment.html)。

*注意:我使用的Node版本在16上。我知道有些人会在旧版本的节点上出现“内存不足错误”，所以如果发生这种情况，请获得Node16 LTS!*

接下来，我们去终端。继续并 `cd` 到你想要工作的目录。一旦你进入了你想要工作的目录，那里，运行这些命令:

```javascript
mkdir epic-game
cd epic-game
npm init -y
npm install --save-dev hardhat@latest
```

在运行最后一个命令并安装Hardhat之后，您可能会看到一条关于漏洞的消息。每次你从NPM安装一些东西时，都会进行一次安全检查，看看你正在安装的库中是否有任何报告的漏洞。这更多的是对你的警告，所以你要意识到!如果你想知道更多的话，我们就来了解一下这些漏洞吧!

### 🔨 让示例项目运行起来

酷，现在我们应该有HardHat了。让我们开始一个JavaScript项目。

```javascript
npx hardhat
```

*注意:如果你在Windows上使用Git Bash安装HardHat，你可能会在这一步(HH1)遇到错误。如果遇到麻烦，您可以尝试使用Windows CMD来执行HardHat安装。更多的信息可以在 [这里](https://github.com/nomiclabs/hardhat/issues/1400#issuecomment-824097242) 找到.*

*注意:如果你安装了基于npm的yarn，你可能会得到诸如' npm ERR!无法确定要运行的可执行文件。在这种情况下，你可以做' yarn add hardhat ' .*

选择选项_**创建一个JavaScript项目**_。对一切都说“yes”。



<img width="571" alt="Screen Shot 2022-06-10 at 22 51 21" src="https://i.imgur.com/j1e8vJT.png">

示例项目将要求您安装hardhat-waffle和hardhat-ethers。这些是我们稍后会用到的其他东西:)。

继续安装下面这些其他依赖项，以防它没有自动完成。

```bash
npm install --save-dev chai @nomiclabs/hardhat-ethers ethers @nomicfoundation/hardhat-toolbox @nomicfoundation/hardhat-chai-matchers
```

您还需要安装一个名为**OpenZeppelin**的程序库，它被广泛用于开发安全智能合约。我们稍后会了解更多。现在，只安装它:)。

```javascript
npm install @openzeppelin/contracts
```

然后运行:

```javascript
npx hardhat run scripts/deploy.js
```

Boom!如果您在终端中看到一些关于正在部署的合约的内容，这意味着您的本地环境已设置**，并且**您还运行/部署了一个智能合约到本地区块链。

这简直是史诗。我们还会进一步讨论这个问题，但基本上这里发生的是:

1. Hardhat将您的智能合约从实体代码编译为字节码。
2. Hardhat将在您的计算机上旋转构成一个“本地区块链”。它就像一个迷你的以太坊测试版本，在你的电脑上运行，帮助你快速测试你编写的合约代码!
3. Hardhat会将编译好的智能合约“部署”到本地区块链。这就是你在末尾看到的地址。这是我们在迷你版以太坊上部署的合约。

如果您感到好奇，可以随意查看项目中的代码，看看它是如何工作的。具体来说，请选中智能合约 `Lock.sol` ，`deploy.js` 是实际运行部署合约的脚本。

当你完成探索后，让我们进入下一节并开始编写真正的游戏智能合约。

### 🚨 进度报告!

发布一个终端的屏幕截图，输出 `deploy.js` 在Discord中的#progress显示你已经得到了你的本地环境工作:)!
