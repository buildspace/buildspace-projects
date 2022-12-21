🔥 模拟区块链环境进行测试
-----------------------------------------------

你已经做到了。你已经写了一份智能合约。你是冠军！

现在我们需要实际\
1\.编译它。\
2\.将其部署到我们的本地区块链。\
3\.一旦它在那里，console.log 将运行 :) 。

我们需要这样做，因为在现实世界中，智能合约存在于区块链上。而且，我们希望我们的网站和智能合约能够被真实的人使用，这样他们就可以👋在我们这里或者做任何你想让他们做的事情！

所以，即使我们在本地工作，我们也想模仿那个环境。从技术上讲，我们可以编译和运行 Solidity 代码，但 Solidity 的神奇之处在于它如何与区块链和以太坊钱包交互（我们将在下一课中看到更多）。所以，最好现在就解决这个问题。

我们将编写一个自定义脚本来为我们处理这 3 个步骤。

我们开始做吧！

📝 构建一个脚本来运行我们的合约
-------------------------------------

进入 **`scripts`** 目录并创建一个名为 **`run.js`.** 的文件

因此，要测试智能合约，我们必须正确地做很多事情。比如：编译，部署，然后执行。

我们的脚本将使我们非常容易地快速迭代我们的合约 :) 。

所以，这就是 **`run.js`** 将要拥有的:

```javascript
const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();
  console.log("Contract deployed to:", waveContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0); // exit Node process without error
  } catch (error) {
    console.log(error);
    process.exit(1); // exit Node process while indicating 'Uncaught Fatal Exception' error
  }
  // Read more about Node exit ('process.exit(num)') status codes here: https://stackoverflow.com/a/47163396/7974948
};

runMain();
```

太棒了.

🤔 效果如何？
-----------------

在这里一行一行看。

```javascript
const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
```

这将实际编译我们的合约并在 `artifacts` 目录下生成我们需要使用我们的合约的必要文件。运行后去检查一下 :) 。

```javascript
const waveContract = await waveContractFactory.deploy();
```

这很有趣 :) 。

这里发生的事情是，Hardhat 将为我们创建一个本地以太坊网络，但只是为了这个合约。然后，在脚本完成后，它会破坏该本地网络。因此，每次运行合约时，它都会是一个全新的区块链。重点是什么？这有点像每次都刷新您的本地服务器，所以您总是从一个干净的石板开始，这样可以轻松调试错误。

```javascript
await waveContract.deployed();
```

我们将等到我们的合约正式部署到我们的本地区块链！我们的 `constructor` 在我们实际部署时运行。

```javascript
console.log("Contract deployed to:", waveContract.address);
```

最后，一旦它被部署，`waveContract.address` 基本上会给我们部署合约的地址。这个地址是我们在区块链上实际找到我们的合约的方式。实际区块链上有数百万个合约。所以，这个地址让我们可以轻松访问我们有兴趣使用的合同！一旦我们部署到真正的以太坊网络，这将在稍后变得更加重要。

让我们运行它！

```bash
npx hardhat run scripts/run.js
```

你应该看到你的 `console.log` 在合约中运行，然后你还应该看到合约地址打印出来！！！这是我得到的：

![](https://i.imgur.com/ug79rOM.png)


🎩 Hardhat & HRE
----------------

在这些代码块中，您会经常注意到我们使用了 `hre.ethers`，但从不导入任何地方的 `hre`？这是什么类型的魔法？

直接从 Hardhat 文档本身，您会注意到这一点：

> Hardhat 运行时环境，或简称 HRE，是一个包含 Hardhat 在运行任务、测试或脚本时公开的所有功能的对象。实际上，Hardhat 是 HRE。

那么这是什么意思？好吧，每次运行以 `npx hardhat` 开头的终端命令时，你都会使用代码中指定的 `hardhat.config.js` 动态构建这个 `hre` 对象！这意味着您将永远不必实际对文件进行某种导入，例如：

`const hre = require("hardhat")`

**TL;DR - 你会在我们的代码中看到很多 `hre`，但从未在任何地方导入！查看这个很酷的 [Hardhat 文档](https://hardhat.org/advanced/hardhat-runtime-environment.html) 以了解更多信息！**

🚨 在您点击“下一课”之前
-------------------------------------------

*注意：如果你不这样做，Farza 会很伤心 :( 。*

转到 #progress 并发布带有输出的终端屏幕截图。

一定要让这个 console.log 随心所欲！您现在已经编写了自己的合约并通过部署到本地区块链来运行它。冲啊！
