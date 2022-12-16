👀 编写脚本并在本地部署
-------------------------------------

*“等等，我不是已经部署到本地网络了吗？？”*

嗯，一部分。

请记住，当您运行 `scripts/run.js` 时，它实际上是

1\.创建一个新的本地以太坊网络。\
2\.正在部署您的合约。\
3\.然后，当脚本结束时，Hardhat 将自动**销毁**该本地网络。

我们需要一种方法来保留本地网络。为什么？好吧，想想本地服务器。你想让它保持，这样你就可以继续和它对话！例如，如果您有一个自己提供 API 的本地服务器，您希望保持该本地服务器处于活动状态，以便您可以在您的网站上工作并对其进行测试。

我们将在这里做同样的事情。

前往您的终端并创建一个**新窗口**。在这个窗口中，cd 回到你的“my-wave-portal project”。然后，在这里继续运行本地节点

```bash
npx hardhat node
```

搞定。

您刚刚启动了一个**保持活动**的本地以太坊网络。而且，正如您所看到的，Hardhat 为我们提供了 20 个帐户，并给了每个账户 10000 ETH，我们现在很富有！哇！有史以来最好的项目。（本地的测试币）

所以现在，这只是一个空的区块链。没有块！

我们想创建一个新块并在其上获取我们的智能合约！开始吧。

在 `scripts` 文件夹下，创建一个名为 `deploy.js` 的文件。这是代码。看起来与 `run.js` 非常相似。

```javascript
const main = async () => {
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();

  console.log("Deploying contracts with account: ", deployer.address);
  console.log("Account balance: ", accountBalance.toString());

  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();

  console.log("WavePortal address: ", waveContract.address);
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

🎉 部署
---------

现在我们要在本地部署的命令是：

```bash
npx hardhat run scripts/deploy.js --network localhost
```

**您需要确保使用和** `my-wave-portal` **不同的目录执行此操作（简言之，使用单独的窗口来跟踪本地节点的消息）。我们不想弄乱保持我们本地以太坊网络活跃的终端窗口。**

好的，所以一旦我运行，这就是我得到的：

![](https://i.imgur.com/ZXehYOk.png)

太棒了。

我们部署了合约，我们也在区块链上有它的地址！我们的网站将需要它，以便知道在区块链上的何处查找合约。 （想象一下，如果必须在整个区块链中搜索我们的合约。那将是......糟糕！）。

在本地以太坊网络保持活跃的终端窗口中，您会看到一些新东西！

![](https://i.imgur.com/DmhZRJN.png)

有趣的。但是……什么是 gas？块 #1 是什么意思？ “交易”旁边的大段代码是什么？我想让你尝试谷歌这些东西。在 #general-chill-chat 中提问:)。


🚨 在您点击“下一课”之前
-------------------------------------

老实说，只需轻拍自己的后背。你做了很多。接下来，我们将实际构建一个网站，该网站将与我们当地的以太坊网络进行交互，这将非常棒。前往#progress，让我知道这个项目到目前为止对你来说进展如何。我很想得到你的反馈。


🎁 部分总结
------------------

好的！你已经到了本节的结尾。查看 [此链接](https://gist.github.com/adilanchian/9f745fdfa9186047e7a779c02f4bffb7) 以确保您的代码步入正轨！