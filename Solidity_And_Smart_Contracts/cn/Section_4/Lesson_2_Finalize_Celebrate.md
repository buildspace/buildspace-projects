🎨 完成 UI，发布你自己的产品。
-------------------------------

您已经完成了所有核心功能！现在，如果您还没有的话，是时候真正将它变成您自己的了。更改 CSS、文本、添加一些有趣的 YouTube 嵌入、添加您自己的个人简介等等。让东西看起来很酷:)。

**如果你愿意，花 30 分钟在这上面！！我强烈推荐它！**

顺便说一句，在我们进行测试时 - 您可能希望将合约的冷却时间更改为 30 秒而不是 15 分钟，如下所示：

```
require(lastWavedAt[msg.sender] + 30 seconds < block.timestamp, "Must wait 30 seconds before waving again.");
```

为什么？好吧，当您测试只能每 15 分钟挥手一次时，这可能会很烦人！

所以，我把我的改为 30 秒！

当您部署 **final** 合约时，可以将其设置为您想要的任何内容！

⛽️ 设置gas限制
--------------------

当您现在尝试“挥手”时，您可能会注意到有时会出现类似于“gas不足”的错误。为什么？

嗯，基本上 Metamask 会尝试估计交易将使用多少 gas。但是，有时是错误的！在这种情况下，由于我们涉及一些随机性，因此变得更加困难。因此，如果合约发送奖品，那么由于我们正在运行 **more** 代码，因此波动者需要支付更多的 gas。

估计 gas 是一个难题，一个简单的解决方法（这样我们的用户在交易失败时不会生气）是设置一个限制。

在 App.js 上，我将发送 wave 的行更改为

```solidity
wavePortalContract.wave(message, { gasLimit: 300000 })
```

这样做是让用户支付 300,000 的固定数量的 gas。而且，如果他们没有在交易中使用所有这些，他们将自动获得退款。

因此，如果交易花费 250,000 gas，那么*在交易完成后，用户未使用的剩余 50,000 gas 将被退还:)。

🔍 验证交易
---------------------------

当你的合约被部署并且你正在用你的 UI 和你的钱包测试它时，首先确定你的钱包帐户是否成功获得奖品可能会令人困惑。您的账户将消耗一定数量的 gas 并可能获得 ETH 奖励。那么您如何验证您的合约是否按预期工作？

要验证，您可以在 [Goerli Etherscan](https://goerli.etherscan.io/)上打开您的合约地址并查看已发生的交易。您会在此处找到各种有用的信息，包括被调用的方法，在本例中为`Wave`。如果您单击`Wave`交易，您会注意到在`To`属性中，它将标识调用了合约地址。如果用户中了奖，您会在该字段中注意到，已从合约地址转移了 0.0001 ETH 到您的帐户地址。

请注意，交易的`Value`仍然是 0 ETH，因为用户从未支付任何费用来发起wave。从智能合约内部转移 ETH 称为“内部交易”。

🎤 事件
---------

还记得我们如何在我们的智能合约中使用下面的魔术线吗？我告诉过你去谷歌搜索 Solidity 中的事件是如何工作的。如果你还没有，请现在就做！

```solidity
emit NewWave(msg.sender, block.timestamp, _message);
```

在基本层面上，事件是我们的智能合约抛出的消息，我们可以在客户端上实时捕获这些消息。

假设我打开你的网站，准备挥手。我这样做时，你的另一个朋友杰里米向你挥手致意。现在，我看到 Jeremy 的挥手的唯一方法是刷新我的页面。这似乎很糟糕。如果我能知道该合约已更新并神奇地更新我的 UI，那不是很酷吗？

即使是现在，当我们自己提交一条消息，然后我们必须等待它被挖矿交易然后刷新页面才能看到所有更新的消息列表时，这有点烦人，对吧？让我们解决这个问题。

在此处查看我在`App.js.`中更新`getAllWaves` 的代码。

```javascript
const getAllWaves = async () => {
  const { ethereum } = window;

  try {
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      const waves = await wavePortalContract.getAllWaves();

      const wavesCleaned = waves.map(wave => {
        return {
          address: wave.waver,
          timestamp: new Date(wave.timestamp * 1000),
          message: wave.message,
        };
      });

      setAllWaves(wavesCleaned);
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * Listen in for emitter events!
 */
useEffect(() => {
  let wavePortalContract;

  const onNewWave = (from, timestamp, message) => {
    console.log("NewWave", from, timestamp, message);
    setAllWaves(prevState => [
      ...prevState,
      {
        address: from,
        timestamp: new Date(timestamp * 1000),
        message: message,
      },
    ]);
  };

  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
    wavePortalContract.on("NewWave", onNewWave);
  }

  return () => {
    if (wavePortalContract) {
      wavePortalContract.off("NewWave", onNewWave);
    }
  };
}, []);
```

在最底部你会看到我添加的神奇代码:)。在这里，当我的合约引发 `NewWave` 事件时，我实际上可以“侦听”。就像一个网络钩子:)。很毒，对吧？

我还可以访问有关该事件的数据，例如 `message` 和 `from`。在这里，当我收到此事件时，我执行了一个 `setAllWaves`，这意味着当我们收到该事件时，用户的消息将自动附加到我的 `allWaves` 数组中，并且我们的 UI 将更新！

这个超级强大。它让我们可以创建实时更新的网络应用程序:)。想想如果你在区块链上制作 Uber 或 Twitter 之类的东西，实时更新的网络应用程序就变得非常重要。

我希望你解决这个问题并构建你想要的任何东西:)。


🙉 github 上的笔记
----------------

**如果上传到 Github，请不要将带有您的私钥的配置文件上传到您的存储库。你会被抢劫。**

我为此使用了 dotenv。

```bash
npm install --save dotenv
```

您的 hardhat.config.js 文件类似于：

```javascript
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
  solidity: "0.8.0",
  networks: {
    goerli: {
      url: process.env.STAGING_QUICKNODE_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
    mainnet: {
      chainId: 1,
      url: process.env.PROD_QUICKNODE_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
```

你的 .env 文件看起来像：

```
STAGING_ALCHEMY_KEY=BLAHBLAH
PROD_ALCHEMY_KEY=BLAHBLAH
PRIVATE_KEY=BLAHBLAH
```

确保在您的 .gitignore 中有 .env。

🎉打包
----------------

你已经做到了。您已经部署了一个智能合约并编写了一个与之对话的网络应用程序。随着我们朝着去中心化 Web 应用程序变得越来越普遍的现实迈进，这两项技能将进一步改变世界。

我希望这是一个有趣的 web3 介绍，我希望你继续你的旅程。

我会让大家在 Discord 中发布新项目的信息 :)。


🚨 结束前...
-------------------------
转到 Discord 中的 #showcase 并向我们展示您的最终产品，我们可以处理:)。

此外，应该完全发布您的最终项目并向世界展示您的史诗般的创作！你所做的事情无论如何都不容易。甚至可以制作一个小视频来展示您的项目并将其附加到推文中。让你的推文看起来很漂亮并炫耀:)。

如果您愿意，请标记@_buildspace :) （译者注：请顺便 @bobjiang123 @bitcoinmaobuyi）。我们会RT它。此外，每当我们看到人们发布他们的项目时，它都会给我们带来很多动力。

最后，如果您在#feedback 中告诉我们您对这个项目的喜爱程度以及项目的结构，那也太棒了。你最喜欢构建空间的什么？我们希望为未来的项目做出哪些改变？你的反馈会很棒！！


看看啊！！！


🎁 总结
----------

*你做到了。*周围鼓掌👏！想查看我们为本节编写的所有代码吗？点击[这个链接](https://gist.github.com/adilanchian/93fbd2e06b3b5d3acb99b5723cebd925) 看全部！

如果你想要捐赠我们：
0x45ca2696d9a4f762c7a51a22a230797700e28794
这会让我们更有动力。