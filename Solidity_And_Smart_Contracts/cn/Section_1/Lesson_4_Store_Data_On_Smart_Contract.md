📦 储存数据!
------------------
从这里开始，让我们把我们的合约变得花哨一些。

我们希望能够让某人向我们招手，然后存储该招手。

所以，我们首先需要的是一个他们可以调用的向我们挥手的函数！

区块链 = 把它想象成一个云服务提供商，有点像 AWS，但它不归任何人所有。它由来自世界各地的矿机的计算能力运行。通常这些人被称为矿工，我们付钱给他们来运行我们的代码！

智能合约 = 有点像我们服务器的代码，包含很多可以调用的函数。

所以，这是我们更新后的可以用来“存储” wave 的合约。

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;

    constructor() {
        console.log("Yo yo, I am a contract and I am smart");
    }

    function wave() public {
        totalWaves += 1;
        console.log("%s has waved!", msg.sender);
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }
}
```
Boom！

所以，这就是你在 Solidity 中编写函数的方式。而且，我们还添加了一个自动初始化为 0 的 `totalWaves` 变量。但是，这个变量很特别，因为它被称为“状态变量”，而且它很酷，因为它永久存储在合约存储中。

我们还在 `msg.sender` 中使用了一些魔法。这是调用该函数的人的钱包地址。这太棒了！这就像内置身份验证。我们确切地知道是谁调用了这个函数，因为为了调用智能合约函数，你需要连接一个有效的钱包！

未来我们可以编写只有特定钱包地址才能调用的函数。例如，我们可以更改此功能，以便只允许我们的地址发送挥手。或者，也许把它放在只有你的朋友可以向你挥手的地方！

✅ 更新 run.js 来调用我们的函数
---------------------------------------

所以, `run.js` 需要一些改变!

为什么?

好吧，我们需要手动调用我们创建的函数。

基本上，当我们将合约部署到区块链时（我们需要运行 `waveContractFactory.deploy()` ），我们的函数就可以在区块链上调用，因为我们在函数上使用了那个特殊的 **public** 关键字。

把它想象成一个公共 API 端点:)。

所以现在我们要专门测试这些功能！

```javascript
const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();

  console.log("Contract deployed to:", waveContract.address);
  console.log("Contract deployed by:", owner.address);

  let waveCount;
  waveCount = await waveContract.getTotalWaves();
  
  let waveTxn = await waveContract.wave();
  await waveTxn.wait();

  waveCount = await waveContract.getTotalWaves();
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

**VSCode 可能会自动导入 `ethers`. 我们不需要导入 `ethers`. 所以，确认这里没有任何导入。 记住，上一课我们讲了什么关于hre？**

🤔 这是怎么工作的？
-----------------

```javascript
const [owner, randomPerson] = await hre.ethers.getSigners();
```
为了将某些东西部署到区块链，我们需要有一个钱包地址！ Hardhat在后台为我们做了这件事，但在这里我抓取了合约所有者的钱包地址，我还抓取了一个随机的钱包地址，并将其命名为`randomPerson`。这会更有意义。

我还添加了这行：
```javascript
console.log("Contract deployed by:", owner.address);
```
我这么做只是因为好奇想看看这个合约部署者的钱包地址

最后我加上这段代码：

```javascript
let waveCount;
waveCount = await waveContract.getTotalWaves();

let waveTxn = await waveContract.wave();
await waveTxn.wait();

waveCount = await waveContract.getTotalWaves();
```

基本上，我们需要手动调用我们的函数！就像我们调用任何普通 API 一样。首先我调用函数来获取总挥手数。然后，我调用一次、挥手。最后，我再次抓取 waveCount 以查看它是否发生了变化。

像往常一样运行脚本：

```bash
npx hardhat run scripts/run.js
```

这是输出结果:

![](https://i.imgur.com/NgfOns3.png)

怎么样，帅不帅 :)?

您还可以看到挥手的钱包地址等于部署合约的地址。我对自己挥手！

所以我们：\
1\. 调用了我们的挥手函数。\
2\. 改变了状态变量。\
3\. 读取变量的新值。

这几乎是大多数智能合约的基础。读取函数。编写函数。并改变状态变量。我们现在拥有继续开发我们史诗般的 WavePortal 所需的组件。

很快，我们将能够从我们将要处理的 React 应用程序中调用这些函数:)。

🤝 测试其他用户 
--------------------

所以，我们可能希望我们以外的其他人向我们发送挥手，对吗？要是只能挥个手就太无聊了！！我们想让我们的网站变成**多人游戏**！

看一下这个。我在函数底部添加了几行。我不打算解释太多（但请在#general-chill-chat 中提问）。基本上这就是我们如何模拟其他人点击我们的功能:)。更改代码并运行后，请密切注意终端中的钱包地址。

```javascript
const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();

  console.log('Contract deployed to:', waveContract.address);
  console.log('Contract deployed by:', owner.address);

  let waveCount;
  waveCount = await waveContract.getTotalWaves();

  let waveTxn = await waveContract.wave();
  await waveTxn.wait();

  waveCount = await waveContract.getTotalWaves();

  waveTxn = await waveContract.connect(randomPerson).wave();
  await waveTxn.wait();

  waveCount = await waveContract.getTotalWaves();
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

新加的代码块：

```javascript
waveTxn = await waveContract.connect(randomPerson).wave();
await waveTxn.wait();

waveCount = await waveContract.getTotalWaves();
```

🚨 在你点击”下一节课“之前
-------------------------------------------

*Note: 如果你不这样做，Farza 会很伤心:(。*

稍微自定义你的代码！！也许你想存储其他东西？随便捣鼓吧。也许你想将调用者的地址存储在一个数组中？也许你想存一个地址和挥手次数的map，以便追踪谁挥的手最多？即使你只是将变量名称和函数名称更改为你认为有趣的东西，这也是挺好的。尽量不要直接复制我！想想你的最终网站和你想要的功能类型。做你想要做的。

在完成所有这里的操作后，请务必在#progress 频道中发布你的命令行输出的屏幕截图。
