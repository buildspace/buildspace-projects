📦 存储数据！
------------------

从这里开始，让我们为我们的合约添加一些幻想。

我们希望能够让某人向我们挥手wave，然后存储该挥手。

所以，我们首先需要的是一个他们可以点击向我们挥手的功能！

区块链 = 把它想象成一个云提供商，有点像 AWS，但它不归任何人所有。它由来自世界各地的矿机的计算能力运行。通常这些人被称为矿工，我们付钱给他们来运行我们的代码！

智能合约 = 有点像我们服务器的代码，具有人们可以点击的不同功能。

所以，这是我们可以用来“存储” wave 的更新合约。

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

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

搞定！

所以，这就是你在 Solidity 中编写函数的方式。而且，我们还添加了一个自动初始化为 0 的 `totalWaves` 变量。但是，这个变量很特别，因为它被称为“状态变量”，它很酷，因为它永久存储在合约存储中。

我们还在这里使用了一些魔法和 `msg.sender`。这是调用该函数的钱包地址。这太棒了！这就像内置身份验证。我们确切地知道是谁调用了这个函数，因为为了调用智能合约函数，你需要连接一个有效的钱包！

未来我们可以编写只有特定钱包地址才能命中的函数。例如，我们可以更改此功能，以便只允许我们的地址发送wave。或者，也许把它放在只有你的朋友可以向你挥手的地方！

✅ 更新 run.js 来调用我们的函数
-------------------------------

所以，`run.js` 需要改变！

为什么？

好吧，我们需要手动调用我们创建的函数。

基本上，当我们将合约部署到区块链时（我们在运行 `waveContractFactory.deploy()` 时会这样做），我们的函数就可以在区块链上被调用，因为我们在函数上使用了那个特殊的 **public** 关键字。

把它想象成一个公共 API 端点:)。

所以现在我们要专门测试这些功能！

```javascript
const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();

  console.log("Contract deployed to:", waveContract.address);
  console.log("Contract deployed by:", owner.address);

  await waveContract.getTotalWaves();

  const waveTxn = await waveContract.wave();
  await waveTxn.wait();

  await waveContract.getTotalWaves();
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
**VSCode 可能会自动导入 `ethers`。我们不需要导入`ethers`。因此，请确保您没有导入。还记得我们上节课讲的关于 hre 的内容吗？**

🤔效果如何？
-----------------

```javascript
const [owner, randomPerson] = await hre.ethers.getSigners();
```

为了将某些东西部署到区块链，我们需要有一个钱包地址！ Hardhat在后台神奇地为我们做了这件事，但在这里我抓取了合约所有者的钱包地址，我也抓取了一个随机的钱包地址，并将其命名为“randomPerson”。这会更有意义。

我还添加了：

```javascript
console.log("Contract deployed by:", owner.address);
```

我这样做只是为了查看部署合约的地址。我很好奇！

我添加的最后一件事是：

```javascript
await waveContract.getTotalWaves();

const waveTxn = await waveContract.wave();
await waveTxn.wait();

await waveContract.getTotalWaves();
```

基本上，我们需要手动调用我们的函数！ 就像我们使用任何普通 API 一样。 首先，我调用函数来获取总波数。 然后，我做波浪。

请注意，函数调用 `await waveContract.getTotalWaves()` 也会返回波数。 我们可以将它存储在一个变量中以记录它或在需要时做任何其他事情。 此处没有必要，因为 getTotalWaves 会在每次调用时记录一些内容。

像往常一样运行脚本：

```bash
npx hardhat run scripts/run.js
```

这是我的输出：

![](https://i.imgur.com/NgfOns3.png)

非常棒，嗯:)？

您还可以看到挥手的钱包地址等于部署合约的地址。我对自己挥手！

所以我们：\
1\. 称为我们的波函数。\
2\. 更改了状态变量。

这几乎是大多数智能合约的基础。 读取函数。 编写函数。 并更改状态变量。 我们现在拥有继续开发史诗般的 WavePortal 所需的构建块。

很快，我们将能够从我们将要开发的 React 应用程序中调用这些函数 :)。


🤝 测试其他用户
--------------------

所以，我们可能希望我们以外的其他人向我们发送wave挥手，对吗？要是能发个wave就太无聊了！！我们想让我们的网站 **有很多人**！

看一下这个。我在函数底部添加了几行。我不打算解释太多（但请在#general-chill-chat 中提问）。基本上这就是我们如何模拟其他人点击我们的功能:)。更改代码并运行后，请密切注意终端中的钱包地址。

```javascript
const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();

  console.log("Contract deployed to:", waveContract.address);
  console.log("Contract deployed by:", owner.address);

  await waveContract.getTotalWaves();

  const firstWaveTxn = await waveContract.wave();
  await firstWaveTxn.wait();

  await waveContract.getTotalWaves();

  const secondWaveTxn = await waveContract.connect(randomPerson).wave();
  await secondWaveTxn.wait();

  await waveContract.getTotalWaves();
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

在这一部分中，我将 `waveTxn` 重命名为 `firstWaveTxn` 并将这些行添加到代码中：

```javascript
secondWaveTxn = await waveContract.connect(randomPerson).wave();
await secondWaveTxn.wait();

await waveContract.getTotalWaves();
```

🚨 在您点击“下一课”之前
-------------------------------------

*注意：如果你不这样做，Farza 会很伤心 :(.*

自定义您的代码一点！ 也许您想存储其他东西？ 我要你乱来 也许您想将发件人的地址存储在一个数组中？ 也许您想存储地址和波数的地图，以便跟踪谁最常向您挥手？ 即使您只是将变量名和函数名更改为您认为有趣的名称，这也很重要。 尽量不要直接抄袭我！ 想想您的最终网站和您想要的功能类型。 构建功能**您想要**。

完成此处的所有操作后，请务必在#progress 中发布终端输出的屏幕截图。