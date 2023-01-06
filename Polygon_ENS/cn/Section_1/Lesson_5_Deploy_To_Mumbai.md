
现在一切都感觉很好。我们正在链上做大量很酷的事情，并学习了很多关于 Polygon 工作原理的知识！

**恭喜 - 您现在已准备好部署到 Polygon 的测试网。**

将它交到**真实用户**手中是多么容易，这真是太疯狂了。我们开工吧。

### 💳 交易

在我们深入研究之前，我想概述一下这是如何工作的——

部署你的合约算作一笔交易。就像区块链上的任何交易一样，整个网络需要知道新的变化。这可以是向链中添加新合约或有人发送一些 MATIC 之类的事情！

当我们部署我们的合约时，我们需要告诉**所有**节点：

**“嘿，这是一个新的智能合约，请将我的智能合约添加到区块链，然后也告诉其他人”**

这就是 [QuickNode](https://www.quicknode.com/?utm_source=buildspace&utm_campaign=generic&utm_content=sign-up&utm_medium=buildspace) 的用武之地。

QuickNode 帮助我们广播我们的合约创建交易，以便它可以尽快被矿工接收。一旦交易被挖掘，它就会作为合法交易广播到区块链。从那里，每个人都更新他们的区块链账单。

这是复杂的。而且，如果您不完全理解它，请不要担心。当您编写更多代码并实际构建此应用程序时，它自然会更有意义。

这是我们开始的地方——使用 QuickNode 创建一个帐户！只需[单击此处](https://www.quicknode.com/?utm_source=buildspace&utm_campaign=generic&utm_content=sign-up&utm_medium=buildspace) 即可开始。一旦您的帐户准备就绪，我们将需要获取我们的 API 密钥。看看我制作的这个视频，了解如何快速获取此密钥，因为我们稍后会用到它：

[BOOM](https://www.loom.com/share/bdbe5470b4b745819782f6727ba60baa)

### 🦊 小狐狸钱包

在我们可以在公共网络上做任何事情之前，我们需要一个钱包！

其中有很多，但是对于这个项目，我们将使用 MetaMask。下载浏览器扩展程序并在[此处](https://metamask.io/download.html) 设置您的钱包。即使您已经有另一个钱包提供商，现在也只需使用 MetaMask，测试起来会容易得多。

为什么我们需要 MetaMask？还记得 Hardhat 如何给我们随机生成的钱包吗？出于同样的原因，我们需要一个钱包——**与区块链交互。**

所以，继续设置吧！他们的设置流程是不言自明的:)。

### ⛓️ 将ploygon添加到 Metamask

由于默认情况下 Polygon 网络不在 Metamask 中，因此您需要添加它们。

这是您需要做的：
1. 使用安装了 Metamask 的浏览器进入 [Polygonscan Mumbai](https://mumbai.polygonscan.com/) 网站
2.一直滚动到底部
3.点击右下角的“添加孟买网络”按钮

这将弹出 Metamask窗口，您可以添加它！

确保添加 **两个链** testnet 和 mainnet 哈哈，它们是分开的。

### 🤑 得到一些假钱 $

那里有一些测试网，我们将使用的测试网称为“Matic Mumbai”，由 Polygon 基金会运营。它是 Polygon 的唯一测试网。

为了部署到孟买，我们需要假的 MATIC 代币。为什么？因为如果你要部署到实际的 Polygon 主网上，你会用到真钱哈哈。因此，测试网复制了主网的工作方式，唯一的区别是不涉及真钱。

为了得到假的 MATIC，我们必须向网络询问一些。 **这个假的 MATIC 只能在这个特定的测试网上工作。**

*注意：您可以在 [此处](https://metamask.zendesk.com/hc/en-us/articles/360015289512-How-to-copy-your-MetaMask-account-public-address- ).*

要获得一些假 MATIC，请在此处访问 Polygon 的水龙头系统 - [https://faucet.polygon.technology/](https://faucet.polygon.technology/)

一旦你的交易被挖掘，你的钱包里就会有一些假的 MATIC。

![https://i.imgur.com/2IjDg3x.png](https://i.imgur.com/2IjDg3x.png)



### 🚀 设置 deploy.js 文件

好的。 我们非常接近部署到世界🌎。 如果您还记得的话，我们创建了我们的 `run.js` 文件以部署到我们的本地区块链，然后在其上运行一些功能来测试。 部署到孟买测试网时，我们希望创建一个单独的文件，我们知道该文件将始终用于部署到测试网。

如果你仔细想想，`run.js` 是我们经常乱搞的地方，我们想把它分开。 继续并在 `scripts` 文件夹下创建一个名为 `deploy.js` 的文件。 它与 `run.js` 文件非常相似，除了有更多的 `console.log` 语句。 这是我的经历：
```jsx
const main = async () => {
  const domainContractFactory = await hre.ethers.getContractFactory('Domains');
  const domainContract = await domainContractFactory.deploy("ninja");
  await domainContract.deployed();

  console.log("Contract deployed to:", domainContract.address);

  // CHANGE THIS DOMAIN TO SOMETHING ELSE! I don't want to see OpenSea full of bananas lol
  let txn = await domainContract.register("banana",  {value: hre.ethers.utils.parseEther('0.1')});
  await txn.wait();
  console.log("Minted domain banana.ninja");

  txn = await domainContract.setRecord("banana", "Am I a banana or a ninja??");
  await txn.wait();
  console.log("Set record for banana.ninja");

  const address = await domainContract.getAddress("banana");
  console.log("Owner of domain banana:", address);

  const balance = await hre.ethers.provider.getBalance(domainContract.address);
  console.log("Contract balance:", hre.ethers.utils.formatEther(balance));
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
```



### 📈 部署到孟买测试网

**是时候了。**

但是 - 在我们可以在测试网上获得我们的精美合约之前，我们需要进行一些更改。

我们需要从我们的 `hardhat.config.js` 文件开始。 您可以在智能合约项目的根目录中找到它。 在这里，我们将添加我们正在使用的网络和一些超级密钥：
```jsx
require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.10",
  networks: {
    mumbai: {
      url: "YOUR_QUICKNODE_MUMBAI_URL",
      accounts: ["YOUR_TEST_WALLET_PRIVATE_KEY"],
    }
  }
};
```



我**强烈建议**您在 MetaMask（或您正在使用的任何其他以太坊钱包应用程序）中创建一个单独的钱包用于开发和测试。这需要大约 10 秒，当你在深夜不小心用你的私钥发布了一个公共回购时，你会感谢自己。

记住您在几步之前获取的 API url - 是时候在 url 部分使用它了！确保您的应用适用于 Polygon Mumbai 测试网。然后，您需要您的**私钥**（不是您的公共地址！），您可以[从 metamask 中获取](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key)并将其粘贴到那里。

**注意：不要将此文件提交给 GITHUB。它有您的私钥。你会被黑+抢劫。此私钥与您的主网私钥相同。**我们稍后将讨论 `.env` 变量以及如何保密这些内容。

与此同时 - 打开你的 .gitignore 文件并为 `hardhat.config.js` 添加一行。您可以稍后在设置 `.env` 时删除它。

为什么需要使用私钥？因为为了执行像部署合同这样的交易，您需要“登录”到区块链并签署/部署合同。而且，您的用户名是您的公共地址，您的密码是您的私钥。这有点像登录 AWS 或 GCP 进行部署。

一旦您完成配置设置，我们就可以使用我们之前编写的部署脚本进行部署。

从 `cool-domains` 的根目录运行此命令。
```
npx hardhat run scripts/deploy.js --network mumbai
```



通常部署需要 20-40 秒。 我们不仅在部署！ 我们还在 `deploy.js` 中创建 NFT，因此这也需要一些时间。 我们实际上需要等待交易被节点“挖掘”+拾取。 非常史诗:)。 一个命令就可以做到这一切！ 如果一切顺利 - 你会看到一个看起来有点像这样的输出
![https://i.imgur.com/OIQo3il.png](https://i.imgur.com/OIQo3il.png)



**哇。 您已部署到 Polygon ✨！**

在继续之前，让我们确保事情看起来不错！ 我们可以通过使用 [Mumbai Polygonscan](https://mumbai.polygonscan.com/) 来做到这一点，您可以在其中粘贴在您的终端中输出的合约地址，然后看看它发生了什么！

如果一切都按预期进行，您应该能够看到一些根据您的合约执行的交易！

![https://i.imgur.com/uc5r1Qz.png](https://i.imgur.com/uc5r1Qz.png)



习惯使用 Polygonscan，因为它就像是在出现问题时跟踪部署和调试问题的最简单方法。 如果它没有出现在 Polygonscan 上，则意味着它仍在处理中或出现问题！

如果它有效——**太棒了，你刚刚部署了一个合约 YESSSS。**

### 🌊 在 OpenSea 上查看

现在还不止这些……你不仅部署了你的合约，而且还创建了你的第一个域作为 NFT 🎉。 更棒的是我们现在可以在 OpenSea 的测试网上看到它！

前往 [testnets.opensea.io](https://testnets.opensea.io/)。 搜索你的合约地址，也就是我们部署到的地址，你可以在你的终端中找到，**不要点击回车**，当它出现在搜索中时点击集合本身。

![https://i.imgur.com/UvRYjhX.png](https://i.imgur.com/UvRYjhX.png)



所以在这里，您单击“集合”下的“Ninja 名称服务”，然后您会看到您创建的域！

![https://i.imgur.com/lvEYCwd.png](https://i.imgur.com/lvEYCwd.png)



太棒了。 我们走吧。 IM HYPE **为了**你。

非常棒，我们已经创建了自己的域合同**并**创建了一个域。

### 🙀 为什么我的 NFT 没有显示在 OpenSea 上！

**如果您的 NFT 没有出现在 OpenSea 上**——请等待几分钟，有时 OpenSea 可能需要 5 分钟。

如果您不想等待，或者 OpenSea 无法正常工作，请前往 [testnets.dev](http://testnets.dev)。 这是我制作的一个小应用程序，因为 OpenSea 很慢并且不支持很多测试网。 选择mumbai，输入你的合约地址并将代币 ID 设置为 0。Ta-da！ 您可以在实际的区块链上看到您的域名！

![https://i.imgur.com/v8ON9VB.png](https://i.imgur.com/v8ON9VB.png)


### 🚨进度报告

*请这样做，否则 Raza 会伤心的:(*

史诗般的工作！ 继续并在 `#progress` 中将您部署的合约发布到 PolygonScan 上

您也可以在#progress 中随意发布您的 OpenSea mint 的屏幕截图。 向所有人展示您的域名看起来有多棒！