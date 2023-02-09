😈 随机抽取中奖者
-----------------------

所以现在，我们的代码设置为每次都给挥手（wave）者 0.0001 ETH！我们的合约很快就会用完钱，然后就没意思了，我们需要为合约增加更多的资金。在本课中，我将向您介绍如何：

1\. **随机**选择一个获胜者。

2\.创建一个**冷却**机制，以防止人们向您发送垃圾邮件以试图赢得奖品或惹恼您。

让我们先做随机赢家！

因此，在智能合约中生成随机数被广泛称为**困难问题**。

为什么？好吧，想想一个随机数是如何正常产生的。当您在程序中正常生成随机数时，**它会从您的计算机中获取一堆不同的数字作为随机性的来源**，例如：风扇速度、CPU 温度、您使用的次数'自从您购买计算机后，您在下午 3 点 52 分按了“L”，您的网速，以及您难以控制的大量其他#s。它需要**所有**这些“随机”数字，并将它们放在一个算法中，该算法生成一个数字，这被认为是真正“随机”数字的最佳尝试。说得通？

在区块链上，**几乎没有随机性的来源**。合约看到的一切，公众都能看到。正因为如此，有人可以通过查看智能合约来玩弄系统，看看它依赖于随机性的#s，然后这个人就可以给它确切的数字来赢得胜利。

让我们看看下面的代码:)。

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;

    /*
     *我们用这个来帮忙生成随机数 
     */
    uint256 private seed;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;

    constructor() payable {
        console.log("We have been constructed!");
        /*
         * 初始化seed
         */
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public {
        totalWaves += 1;
        console.log("%s has waved!", msg.sender);

        waves.push(Wave(msg.sender, _message, block.timestamp));

        /*
         * 生成一个新的seed为接下来的用户
         */
        seed = (block.difficulty + block.timestamp + seed) % 100;

        console.log("Random # generated: %d", seed);

        /*
         * 用户有50%的几率获得奖金。
         */
        if (seed < 50) {
            console.log("%s won!", msg.sender);

            /*
             * The same code we had before to send the prize.
             */
            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }

        emit NewWave(msg.sender, block.timestamp, _message);
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        return totalWaves;
    }
}
```

在这里，我取了 Solidity 给我的两个数字，`block.difficulty` 和 `block.timestamp`，然后将它们组合起来创建一个随机数。 `block.difficulty` 根据区块中的交易告诉矿工该区块的挖掘难度。由于多种原因，区块变得更难，但是，主要是当区块中有更多交易时它们会变得更难（一些矿工更喜欢简单的区块，但这些支出较少）。 `block.timestamp` 只是块正在被处理的 Unix 时间戳。

这些#s 是*非常*随机的。但是，从技术上讲，`block.difficulty`和`block.timestamp`都可以由老练的攻击者控制。

为了使这更难，我创建了一个变量`seed` ，每次用户发送新wave时，它都会发生本质上的变化。因此，我将所有这三个变量结合起来生成一个新的随机种子。然后我只做`% 100`，这将确保数字降低到 0 - 100 之间的范围。

仅此而已！然后我就写一个简单的if语句，看看种子是否小于或等于50，如果是——那么摇摆不定的人就赢了！所以，这意味着自从我们写了 `seed <= 50` 以来，摇摆者有 50% 的机会获胜。您可以将其更改为您想要的任何内容:)。我只做了 50%，因为这样更容易测试！！

重要的是在这里看到，如果他们真的想要，在技术上可以在这里攻击你的系统。真的会很难还有其他方法可以在区块链上生成随机数，但 Solidity 本身并没有给我们任何可靠的东西，因为它不能！我们的合约可以访问的所有#s 都是公开的，并且*从不*真正随机。

真的，这是区块链的优势之一。但是，对于像我们这样的应用程序来说可能有点烦人！

无论如何，没有人会攻击我们的小应用程序，但我希望您在构建拥有数百万用户的 dApp 时了解这一切！

测试
-------

让我们确保它有效！这是我更新的 `run.js`。在这种情况下，我只想确保在挥手的人获胜的情况下合约余额发生变化！

```javascript
const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await waveContract.deployed();
  console.log("Contract addy:", waveContract.address);

  let contractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  );
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  /*
   * Let's try two waves now
   */
  const waveTxn = await waveContract.wave("This is wave #1");
  await waveTxn.wait();

  const waveTxn2 = await waveContract.wave("This is wave #2");
  await waveTxn2.wait();

  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  let allWaves = await waveContract.getAllWaves();
  console.log(allWaves);
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

你不会总是有像这样的好教程来指导你如何测试代码。由您决定 1) 您想测试什么 2) 如何测试它。在这种情况下，我知道我想确保只有在生成小于 50 的随机数的情况下，合约余额才会减少 0.0001！

所以，当我运行上面的代码时，我得到的是：

![](https://i.imgur.com/ArXRCsp.png)

搞定！有用。生成“79”时，用户没有中奖。但是，当生成 23 时，wave 赢了！而且，合约余额正好减少了 0.0001。好的 ：）。

防止垃圾邮件发送者的冷却时间
-----------------------------

惊人的。你现在有一种方法可以将 ETH 随机发送给人们！现在，向您的网站添加冷却功能可能会很有用，这样人们就不能只是向您发送垃圾邮件。为什么？好吧，也许你只是不想让他们继续试图通过向你挥手来一遍又一遍地赢得奖品。或者，也许您不希望*只是* *他们的* 消息填满您的消息墙。

查看代码。我在添加新行的地方添加了注释。

我使用一种称为 [map](https://medium.com/upstate-interactive/mappings-in-solidity-explained-in-under-two-minutes-ecba88aff96e) 的特殊数据结构。

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    uint256 private seed;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;

    /*
     * 这是一个地址型到实数型的映射，我可以把一个地址和一个数字联系起来
     * 在这里，我将把地址和用户向我们wave的时间储存在一起
     */
    mapping(address => uint256) public lastWavedAt;

    constructor() payable {
        console.log("We have been constructed!");
        /*
         * Set the initial seed
         */
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public {
        /*
         *我们需要确保当前时间戳至少比我们存储的上一个时间戳大 15 分钟
         */
        require(
            lastWavedAt[msg.sender] + 15 minutes < block.timestamp,
            "Wait 15m"
        );

        /*
         * 收集用户当前的时间戳
         */
        lastWavedAt[msg.sender] = block.timestamp;

        totalWaves += 1;
        console.log("%s has waved!", msg.sender);

        waves.push(Wave(msg.sender, _message, block.timestamp));

        /*
         * 生成一个新的seed为后面的用户发送wave准备。
         */
        seed = (block.difficulty + block.timestamp + seed) % 100;

        if (seed <= 50) {
            console.log("%s won!", msg.sender);

            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than they contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }

        emit NewWave(msg.sender, block.timestamp, _message);
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        return totalWaves;
    }
}
```

尝试运行 `npx hardhat run scripts/run.js` 并查看如果尝试连续挥手两次而间隔时间小于 15 分钟时得到的错误消息:)。

砰！这就是你建立冷却时间的方式！

如果你想要捐赠我们：
0x45ca2696d9a4f762c7a51a22a230797700e28794
这会让我们更有动力。