💸 向朝你招手的人发送 ETH
----------------------------------------

现在我们要做的是向朝我们招手的人发送一些 ETH！例如，也许您想在某人向您挥手的时候有 1% 的机会赢得 5 美元。或者，也许你想让每个向你挥手的人都获得 0.01 美元的 ETH，哈哈。

你甚至可以手动将 ETH 发送给你最喜欢的人。也许他们给你寄了一首很棒的歌！！

**轻松地向用户发送 ETH 是智能合约的核心部分，也是他们最酷的部分之一**，所以，让我们去做吧！

首先，我们将给所有向我们挥手致意的人发送`0.0001 ETH`。这是 $0.31 :)。而这一切都发生在测试网上，所以，它是假的！

在`WavePortal.sol`上查看我更新的`wave`函数。

```solidity
function wave(string memory _message) public {
    totalWaves += 1;
    console.log("%s has waved!", msg.sender);

    waves.push(Wave(msg.sender, _message, block.timestamp));

    emit NewWave(msg.sender, block.timestamp, _message);

    uint256 prizeAmount = 0.0001 ether;
    require(
        prizeAmount <= address(this).balance,
        "Trying to withdraw more money than the contract has."
    );
    (bool success, ) = (msg.sender).call{value: prizeAmount}("");
    require(success, "Failed to withdraw money from contract.");
}
```

这真是太棒了。

使用`prizeAmount` 我只是启动一个奖金金额。 Solidity 实际上让我们使用关键字 `ether`，这样我们就可以轻松地表示货币金额。很方便的 ：）！

我们也有一些新的关键字。你会看到`require`，它基本上会检查某些条件是否为真。如果不正确，它将退出该功能并取消交易。这就像一个花哨的 if 语句！

在这种情况下，它会检查是否`prizeAmount <= address(this).balance`。这里，`address(this).balance` 是合约本身的**余额。**

为什么？ **好吧，为了让我们将 ETH 发送给某人，我们的合约上需要有 ETH。**

这是如何工作的，当我们第一次部署合约时，我们“资助”它:)。到目前为止，我们**从未**为我们的合约提供资金！！它的价值一直是 0 ETH。这意味着我们的合约不能向人们发送 ETH，因为它**根本没有任何 ETH**！我们将在下一节介绍资金！

```solidity
require(prizeAmount <= address(this).balance, "Trying to withdraw more money than the contract has.");
```

是它让我们确保*合约的余额*大于*奖品金额*，如果是这样，我们可以继续发放奖品！如果它不是， `require` 将基本上终止交易并且就像，“哟，这个合约不能支付给你！”。

`(msg.sender).call{value: PrizeAmount}("")` 是我们汇款的魔法线:)。语法有点奇怪！注意我们如何传递它`prizeAmount`！

`require(success` 是我们知道交易成功的地方:)。如果不是，它会将交易标记为错误并说`"Failed to withdraw money from contract."`。

非常棒，对吧:)？

🏦 为合约提供资金，以便我们可以发送 ETH！
-----------------------------------------------

我们现在已经设置了发送 ETH 的代码。好的！现在我们需要真正确保我们的合约有资金，否则，我们没有 ETH 可以发送！

我们将首先在 `run.js` 中工作。请记住，`run.js` 就像我们的测试场，我们希望在部署之前确保我们的合约核心功能正常工作。 **真的很难**同时调试合约代码和前端代码，所以，我们把它分开！

让我们前往 `run.js` 并进行一些更改以确保一切正常。这是我更新的 `run.js`。

```javascript
const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await waveContract.deployed();
  console.log("Contract addy:", waveContract.address);

  /*
   * Get Contract balance
   */
  let contractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  );
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  /*
   * Send Wave
   */
  let waveTxn = await waveContract.wave("A message!");
  await waveTxn.wait();

  /*
   * Get Contract balance to see what happened!
   */
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

魔法在于`hre.ethers.utils.parseEther('0.1'),`。这就是我说的，“去部署我的合约并用 0.1 ETH 为其提供资金”。这将从我的钱包中删除 ETH，并用它来资助合约。 **仅此而已**。

然后执行 `hre.ethers.utils.formatEther(contractBalance)` 来测试合约是否真的有 0.1 的余额。我使用了 `ethers` 给一个名为 `getBalance` 的函数，并将它传递给合约地址！

但是，我们还想看看当我们调用 `wave` 时是否从合约中正确删除了 0.0001 ETH！！这就是为什么我在调用`wave`后再次打印出余额。

当我们运行

```bash
npx hardhat run scripts/run.js
```

你会看到我们遇到了一些错误！

类似如下：

```bash
Error: non-payable constructor cannot override value
```

这就是说，我们的合约现在不允许付钱给人！这是快速修复，我们需要在`WavePortal.sol`的构造函数中添加关键字`payable`。看看这个：

```solidity
constructor() payable {
  console.log("We have been constructed!");
}
```

仅此而已 ：）。

现在，当运行

```bash
npx hardhat run scripts/run.js
```

这就是我得到的：

![](https://i.imgur.com/8jZHL6b.png)

**搞定**。

我们刚刚从合约中发送了一些 ETH，大获成功！而且，我们知道成功了，因为合约余额从 0.1 到 0.0999 减少了 0.0001 ETH！

✈️ 更新部署脚本以资助合约
----------------------------------------

我们需要对 `deploy.js` 做一个小的更新。

```javascript
const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.001"),
  });

  await waveContract.deployed();

  console.log("WavePortal address: ", waveContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
```

我所做的就是像这样为合约提供 0.001 ETH 的资金：

```javascript
const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.001"),
});
```

我喜欢首先使用少量 ETH 部署到测试网进行测试！

我还添加了 `await waveContract.deployed()` 以便我很容易知道它何时部署！

简单！

让我们使用相同的方法部署我们的合约

```bash
npx hardhat run scripts/deploy.js --network goerli
```

现在，当您转到 [Etherscan](https://rinkeby.etherscan.io/) 并粘贴合约地址时，您会看到合约现在的价值为 0.001 ETH！成功！

**记住用新的合约地址*和*新的ABI文件更新前端。否则，它将** **无法运行**。

测试您的 wave 函数并确保它仍然有效！

🎁 总结
----------

使用实际的 ETH 来为你的合约充值，对吗？看一下[这个链接](https://gist.github.com/adilanchian/236fe9f3a56b73751060800cae3a780d)可以看到本节写的所有代码！

如果你想要捐赠我们：
0x45ca2696d9a4f762c7a51a22a230797700e28794
这会让我们更有动力。