### 📚区块链知识入门
在做任何事情之前，我们需要让我们的Ethereum本地网络正常工作。这就是我们编译和测试智能合约代码的方式，你知道需要怎样搭建一个本地环境来工作吗？

目前，你只需要知道智能合约是一段存储在区块链上的代码。区块链是公开的，任何人都可以免费安全地读写数据。你可以把它看成是AWS或Heroku，只不过没有人真正独揽它，它是由数千名被称为`矿工`的随机人员管理的。

我们的宏图大概是：

1--编写一份智能合约。该合约具有我们NFT的所有逻辑。

2--将智能合约部署到区块链。这样，世界上任何人都可以访问和运行我们的智能合约，并可以创建NFT！

3--建立一个客户网站，让人们可以轻松地从我们的网页中Mint NFT。

如果你感兴趣的话，我建议你仔细阅读[这些](https://ethereum.org/en/developers/docs/intro-to-ethereum/)文档。在我看来，这些是互联网上了解Ethereum工作原理的最佳指南！

### ⚙️配置本地工具

我们经常使用一个名为**Hardhat**的工具，它可以让我们快速编译智能合约并在本地测试它们。首先，您需要获取node/npm。如果你没有，请转到[这里](https://hardhat.org/tutorial/setting-up-the-environment.html)安装。

*注意:我的版本是v16。我知道有些人会在旧版本的node上出现`out of memory errors`，所以如果发生这种情况，请升级到v1版本6以上!＊

接下来，我们去控制台。输入`cd`到你想要工作的目录。一旦你进入到目录，运行这些命令:
```bash
mkdir epic-nfts
cd epic-nfts
npm init -y
npm install --save-dev hardhat
```
当你运行这些命令会发生什么：
1. `mkdir epic-nfts`创建一个名为`epic-nfts`的目录。
2. `cd epic-nfts`进入新创建的目录。
3. `npm init -y`生成一个空的`npm`项目，而不经过交互过程。`-y`代表**yes**。
4. `npm install——save-dev hardhat@latest`表示安装Hardhat。

运行最后一个命令并安装Hardhat后，您可能会看到有关漏洞的消息。每次您从NPM安装某个软件包时，都会进行安全检查，以查看您正在安装的库中的任何软件包是否存在报告的漏洞。你要意识到，这更多的是对你的警告，如果您想了解更多信息，请在 Google 上搜索一下这些漏洞信息！

### 🔨示例项目
Cool，现在我们安装了`Hardhat`,让我们开始一个示例项目。

```
npx hardhat
```
*注意:如果你在Windows上使用Git Bash安装`Hardhat`，你可能会在这一步(HH1)遇到错误。如果遇到麻烦，您可以尝试使用Windows CMD来执行`HardHat`安装。更多的信息可以在[这里](https://github.com/nomiclabs/hardhat/issues/1400#issuecomment-824097242)找到。

选择选项**Create a JavaScript project**，每一步都按`yes`。
<img width="571" alt="Screen Shot 2022-06-10 at 22 51 21" src="https://i.imgur.com/j1e8vJT.png">

示例项目会要求您安装`hardhat-waffle`和`hardhat-ethers`,这些是我们稍后会用到的软件。

继续安装这些依赖项，以防它没有自动执行。
```bash
npm install --save-dev chai @nomiclabs/hardhat-ethers ethers @nomicfoundation/hardhat-toolbox @nomicfoundation/hardhat-chai-matchers
```
您还需要安装名为**OpenZeppelin**的程序库，这是另一个用于开发安全智能合约的库。稍后我们将了解更多信息。现在，只需安装它😜

```bash
npm install @openzeppelin/contracts
```
然后运行：

```bash
npx hardhat test
```
你应该会看到如下所示：
![](https://i.imgur.com/OI9YKaU.png)

Boom💥 如果您看到这个，则意味着您的本地环境已搭建好，**并且**您还运行/部署了智能合约到本地区块链。

这是非常具有成就感的。我们将更进一步讨论，但基本上，这里逐步发生的事情是：
1. Hardhat将您的智能合约从实体代码编译为字节码。
2. Hardhat将在您的计算机上启动一个“本地区块链”。它就像一个迷你的本地运行到Ethereum测试版本，以帮助你快速测试合约!
3. Hardhat会将编译好的代码`部署`到本地区块链,就是你在结尾看到的那个地址，也是我们在迷你版Ethereum上部署的合约。

如果您好奇，请随时查看项目内部的代码以了解其工作原理。具体来说是检查智能合约的`Lock.sol`和实际运行合约的`deploy.js`。

完成探索后，让我们进入下一节并开始我们自己的 NFT 合约。

### 🚨进度证明提交

在`#progress`频道中发布带有`deploy.js`输出的终端屏幕截图🎉














