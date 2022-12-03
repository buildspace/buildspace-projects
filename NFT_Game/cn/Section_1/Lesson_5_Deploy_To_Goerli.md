### 🎉 让我们的NFTs在线

当我们使用`run.js`时，只有我们在本地工作。

下一步是一个测试网，你可以把它想象成一个“登台”环境。当我们部署到测试网络时，我们实际上能够**在线查看我们的NFT **，我们离真正的用户更近了一步。

### 🦊 Metamask

**注意:在MetaMask中创建一个严格用于开发目的的新帐户是一个好主意。这样，如果您的开发帐户凭证意外泄露，您的真实资金仍然是安全的**

[在MetaMask中添加帐户的说明](https://metamask.zendesk.com/hc/en-us/articles/360015289452-How-to-create-an-additional-account-in-your-MetaMask-wallet)

接下来我们需要一个以太坊钱包。有很多这样的，但是，对于这个项目，我们将使用Metamask。从[这里](https://metamask.io/download.html)下载浏览器扩展和设置您的钱包。即使您已经有了另一个钱包提供商，也可以暂时使用Metamask。

为什么我们需要Metamask?我们需要能够调用位于区块链上的智能合约上的函数。要做到这一点，我们需要有一个钱包，里面有我们的以太坊地址和私钥。

**但是，我们需要一些东西来连接我们的网站与我们的钱包，这样我们就可以安全地传递我们的钱包证书到我们的网站，同时我们的网站可以使用这些证书来调用我们的智能合约。您需要有有效的凭证来访问智能合约上的函数。**

这就像认证一样。我们需要一些东西来“登录”到区块链，然后使用这些登录凭证从我们的网站发出API请求。

所以，去把它都设置好吧!他们的设置流程是不言自明的:)。

### 💳 交易

QuickNode essentially helps us broadcast our contract creation transaction so that it can be picked up by miners as quickly as possible. Once the transaction is mined, it is then broadcasted to the blockchain as a legit transaction. From there, everyone updates their copy of the blockchain.

This is complicated. And, don't worry if you don't fully understand it. As you write more code and actually build this app, it'll naturally make more sense.

So, make an account with QuickNode [here](https://www.quicknode.com/?utm_source=buildspace&utm_campaign=generic&utm_content=sign-up&utm_medium=buildspace).

And then check out my video below!

[Loom](https://www.loom.com/share/c079028c612340e8b7439d0d2103a313)

当我们想要执行一个改变区块链的操作时，我们称之为交易。例如，给某人发送ETH是一种交易，因为我们正在改变账户余额。更新合约中的变量的操作也被视为交易，因为我们正在更改数据。创建NFT是一个交易，因为我们在保存合约上的数据。

**部署智能合约也是一个交易**

记住，区块链没有主人。它只是世界上由**矿工**运行的一堆计算机，拥有区块链的副本。

当我们部署我们的合约时，我们需要告诉**所有的**矿工，“嘿，这是一个新的智能合约，请将我的智能合约添加到区块链，然后将它也告诉所有其他人”。

这就是[QuickNode](https://www.quicknode.com/?utm_source=buildspace&utm_campaign=generic&utm_content=sign-up&utm_medium=buildspace)发挥作用的地方。

QuickNode可以帮助我们广播我们的合约创建交易，以便矿工能够尽可能快地获取它。一旦交易被挖掘，它将作为合法交易广播到区块链。从那里，每个人更新他们的区块链副本。

这很复杂。如果你没有完全理解，也不要担心。当你写更多的代码并真正构建这个应用时，它自然会更有意义。

所以，在QuickNode[这里](https://www.quicknode.com/?utm_source=buildspace&utm_campaign=generic&utm_content=sign-up&utm_medium=buildspace)建立一个帐户。

然后看看我下面的视频!

[Loom](https://www.loom.com/share/c079028c612340e8b7439d0d2103a313)

### 🕸 测试网

我们现在还不打算部署到“以太坊主网”。为什么?因为它很贵，不值得测试!我们现在只是随便走走。我们将从一个“测试网”开始，它是“主网”的克隆，但它使用假美元，所以我们可以尽可能多地测试内容。但是，重要的是要知道测试网是由真正的矿工运行的，并模拟真实的场景。

这很棒，因为我们可以在现实场景中测试我们的应用程序，我们实际上要:

1. 广播我们的交易
2. 等着被真正的矿工捡起来吧
3. 等着它被挖出来
4. 等待它被广播回区块链告诉所有其他矿工更新他们的副本

### 🤑 得到一些假美元

有一些测试网，我们将使用的是由以太坊基金会运行的“Goerli”。

为了部署到Goerli，我们需要假ETH。为什么?因为如果你部署到实际的以太坊主网，你将使用真钱!所以，测试网复制了主网的工作方式，唯一的区别是没有真正的钱。

为了获得假ETH，我们必须向网络请求一些。**这个假ETH只在这个特定的测试网上工作。**你可以通过“水龙头”为Goerli抓取一些假冒的以太坊。你只需要找到一个有用的!

请确保您在Metamask上的**Goerli**网络上。这是我看到的一个超级常见的问题!

![Untitled](https://imgur.com/a/j8iN46I)

你有几个水龙头可以选择:

| Name             | Link                                  | Amount          | Time         |
| ---------------- | ------------------------------------- | --------------- | ------------ |
| Chainlink        | https://faucets.chain.link/goerli     | 0.1             | None         |
| Official Goerli  | https://goerlifaucet.com              | 0.25            | 24 hrs       |
| MyCrypto         | https://app.mycrypto.com/faucet       | 0.01            | None         |

注意:对于MyCrypto，你需要连接你的钱包，创建一个账户，然后再次点击相同的链接请求资金。buildspace的水龙头也很可靠，只要确保Metamask在Goerli网络上:)。

### 🙃获得测试网ETH有困难吗?

**在放弃之前，请多尝试几次以上的水龙头。它们不是很稳定，需要多点尝试才能工作!MyCrypto是我一直在使用的，还没有给我带来麻烦。**

### 🚀 设置一个deploy.js文件

将部署脚本与`run.js`脚本分开是一个很好的实践。`run.js`是我们经常测试的地方，我们想要把它分开。在 `scripts` 文件夹下创建一个名为`deploy.js`的文件。复制粘贴所有的 `run.js` 到`deploy.js`。现在的情况完全一样。

我添加了一些额外的调用 `mintCharacterNFT` ，当然这只是测试代码!

```javascript
const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
  const gameContract = await gameContractFactory.deploy(                     
    ["Leo", "Aang", "Pikachu"],       
    ["https://i.imgur.com/pKd5Sdk.png", 
    "https://i.imgur.com/xVu4vFL.png", 
    "https://i.imgur.com/u7T87A6.png"],
    [100, 200, 300],                    
    [100, 50, 25]                       
  );
  await gameContract.deployed();
  console.log("Contract deployed to:", gameContract.address);

  
  let txn;
  txn = await gameContract.mintCharacterNFT(0);
  await txn.wait();
  console.log("Minted NFT #1");

  txn = await gameContract.mintCharacterNFT(1);
  await txn.wait();
  console.log("Minted NFT #2");

  txn = await gameContract.mintCharacterNFT(2);
  await txn.wait();
  console.log("Minted NFT #3");

  txn = await gameContract.mintCharacterNFT(1);
  await txn.wait();
  console.log("Minted NFT #4");

  console.log("Done deploying and minting!");

};

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

### 📈 部署到Goerli测试网

我们需要修改我们的 `hardhat.config.js` 文件。您可以在智能合约项目的根目录中找到它。

```javascript
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: '0.8.17',
  networks: {
    goerli: {
      url: 'YOUR_QUICKNODE_API_URL',
      accounts: ['YOUR_PRIVATE_GOERLI_ACCOUNT_KEY'],
    },
  },
};
```

您可以从quickknode仪表板获取API URL并将其粘贴进来。然后，你需要你的**私人** goerli密钥(不是你的公共地址!)，你可以[从metamask[获取](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key)并粘贴到那里。

**注意:不要提交这个文件到GITHUB。它有您的私钥。你会被黑+抢劫。此私钥与您的主网私钥相同。为了进一步降低风险，最好在metamask中有一个专门的开发帐户。我们后面会使用 `.env` 来配置变量以及如何保持这些东西的秘密。**

为什么需要使用您的私钥?因为为了执行像部署合约这样的交易，您需要“登录”到区块链并签署/部署合约。此外，您的用户名是您的公共地址，您的密码是您的私钥。这有点像登录到AWS或GCP进行部署。

配置设置完成后，就可以使用前面编写的部署脚本进行部署了。

在`epic-game`的根目录下运行此命令。

```bash
npx hardhat run scripts/deploy.js --network goerli
```

部署通常需要1-2分钟。我们不仅仅是在部署!我们也在`deploy.js`中创建NFTs，所以这也需要一些时间。我们实际上需要等待交易被挖矿+被挖矿者拾取。相当的史诗。这一个命令就可以做到这一切!

我得到的是:

```plaintext
Contract deployed to: 0x1bB5b2f90AaB36E2742886f75DD7F3c5B420Bf33
Minted NFT #1
Minted NFT #2
Minted NFT #3
Minted NFT #4
Done deploying and minting!
```

我们可以使用[Goerli Etherscan](https://goerli.etherscan.io/)确保它正常工作，在那里您可以粘贴输出的合约地址，看看它发生了什么!在这里我可以看到我们有** 5 **个交易。**一个合约创建交易和**四个我们铸造NFTs的** *交易。哪个是正确的:)!

![Untitled](https://i.imgur.com/cI4a1Oh.png)

**Get used to using Goerli Etherscan a lot to debug deploys** because it's the easiest way to track deployments and if something goes wrong. If it's not showing up on Etherscan, then that means it's either still processing or something went wrong! Here's what I get:

If it worked — **AWEEEEESOME YOU JUST DEPLOYED A CONTRACT AND MINTED NFTS.**

**习惯大量使用Goerli Etherscan来调试部署**，因为这是跟踪部署以及出现错误的最简单方法。如果Etherscan没有显示出来，那就意味着它要么还在处理，要么出了什么问题!我得到的是:

如果它工作,**太棒了，你部署一个合约和铸造NFTS测试。**

### 🌊 Pixxiti上查看

信不信由你。您刚刚铸造的nft将在Pixxiti的Testnet站点上。

1. 登录 `goerli.pixxiti.com`。
2. 创建这个url:  `https://goerli.pixxiti.com/nfts/部署的合约地址/TOKEN_ID`

例如，这是我的链接:

```plaintext
https://goerli.pixxiti.com/nfts/0xcec8593c046364f163926a4327dfce6f546d9f98/4
```

这是皮卡丘的NFT!!我的 `tokenId` 是 `4` ，因为它是该合约中的第4个铸币。请随意尝试用其他你自己铸造的TOKEN_ID替换它:)。

**基本上，等待至少15分钟，Pixxiti才能更新您的NFT**

所以在这里，你点击“Collections"”下的“Heroes -”，你就会看到你铸造的NFT !

![Untitled](https://i.imgur.com/9ULR2OW.png)

![Untitled](https://i.imgur.com/F9xQHFE.png)

BOOM，我的角色来了!!**如果你点击你的一个角色，你将能够点击左边的“Levels**”，甚至可以看到特定的属性!我们甚至有一个小生命棒!!EPICCCC。每个生命条根据 NFT的不同而不同，例如皮卡丘有300 HP而Leo有100 HP!

例如:

![Untitled](https://i.imgur.com/8lry1nA.png)



![Untitled](https://i.imgur.com/mbMf8CI.png)

在这种情况下，Pixxiti正确渲染了我们所有角色的属性!

这里最酷的是，如果我们将这个玩家的NFT的HP值更改为 `150` 或其他值，它就会在Pixiti上更新!**这非常酷，因为NFT本身动态地保存着玩家角色的状态:)。**我们不需要任何中央服务器保存数据。

这非常棒，因为现在当我们的玩家开始玩游戏时，我们检测到他们的NFT，我们就能确切地知道他们的角色在游戏中的NFT,状态!

*注意:你会注意到我们在这种情况下铸造了4个NFT到同一个钱包-这**不**被允许在我们的游戏中，每个玩家将只允许有1个NFT。我只是想测试一下。另外，现在 `nftHolders` 每个唯一地址只能保存一个tokenId。因此，每当一个新的NFT被铸造到相同的地址，之前的 `tokenId` 将被覆盖。如果你想，你可以抛出一个错误。*

### 🤯 为什么这是史诗?

我们有必要谈谈为什么你刚刚做的事很重要。

基本上，你做了一个NFT。这已经很酷了。人们可以在钱包里拥有你游戏中的一个角色。

但是，这些NFT实际上也有属性!就像攻击伤害，生命值，法力值或任何你添加的东西。因此，这意味着NFT本身不仅仅是一个JPG格式——它还有其他元素使其更具互动性。

世界上最大的NFT游戏Axie Infinity的功能也是如此。这是一款回合制、《口袋妖怪》风格的游戏，玩家在游戏中与其他玩家进行1v1对战。

这是他们的一个NFT角色的样子。

![Untitled](https://i.imgur.com/FIJmmbL.png)

[这里](https://goerli.pixxiti.com/nfts/0x4e8100e6f42357fcc5ad1c54bdd048470dc60af0/3701)在Pixxiti上可以查看，**查看它在属性，levels等所有不同属性。**获得灵感:)所有这些属性都会影响角色在游戏中的表现!

我们接下来要做的是，在我们的NFT中编写逻辑程序，让它在游戏中“对抗”一个“boss”。所以，这意味着玩家将能够带着他们的NFT去**竞技场**与其他玩家合作去“攻击”你所创造的大boss !当一个NFT攻击这个boss时，boss可以反击这个NFT，而玩家的NFT将**损失生命值**。Pixxiti的HP值会改变:)。

有点像《口袋妖怪》!

这意味着我们的NFT将除了看起来很酷之外还有“实用”。

这真是太棒了。在今天的普通游戏中，你会购买一款游戏，然后选择你的角色(游戏邦注:例如《Super Smash Brothers》)。

![Untitled](https://i.imgur.com/BTI8Qhp.png)

**在这种情况下，玩家选择自己的角色NFT，然后在游戏中玩他们的角色，并在钱包中永远拥有这个NFT，或者直到他们想要出售给其他玩家。**销售方面非常有趣，因为这意味着作为玩家，你可以通过玩游戏或帮助游戏提高人气而获得回报。

另一件有趣的事情是，玩家将能够将他们的角色带到其他支持它的游戏中。

这是一个非常疯狂的想法。这也是加密+游戏如此酷的最大原因之一

还记得之前的马里奥NFT例子吗?我们的角色NFTs也是如此!

例如，假设有10万人为我的游戏铸造“皮卡丘”NFT。现在，有10万名独立玩家拥有这个NFT游戏。

其他开发者可以在皮卡丘NFT基础上开发另一款游戏，并允许任何拥有NFT的玩家进入他们的游戏并体验它!他们可以让任何拥有皮卡丘NFT的人都能够在游戏中扮演皮卡丘。这完全取决于他们。

**注意:在这种情况下，口袋妖怪的创造者可能会生气。但是，想象一下皮卡丘是你自己最初的角色!**

也许像HP和攻击伤害等内容是在游戏间共享的，这意味着不同的游戏能够基于我们所创造的最初属性而创造。

例如，假设我们有其他开发者开始在我们的NFT角色上制作“物品”——如剑、盾、药水等。也许开发者会创造一些非游戏角色能够“装备”盾牌并获得+50防御的内容。这一切都可以以一种开放的、无需许可的方式完成:)。

除此之外，作为原版皮卡丘NFT的创造者，我可以在每次有人购买/出售原版NFT时收取版税，这意味着随着我的NFT越来越受欢迎，我可以从每笔销售中获利。

好了-让我们现在开始编程我们的游戏逻辑:)。

### 🚨 进度报告!
请这么做，否则Farza会伤心的:(*

在Discord的 #progress 中贴出你在Pixxiti上发布你的史诗NFTs的截图。甚至可以在推特上发布，告诉全世界你都做了什么!一定要加上@_buildspace标签:)。我们喜欢看人们的推文，这总是给我们一剂多巴胺/动力。另外，你的推文可以帮助吸引更多的人使用web3。你永远不知道谁会看到它，并受到启发，开始吧!!
