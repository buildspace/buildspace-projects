好吧！ 你已经部署了一个花哨的域智能合约，发布了一个让人们铸造你的域的小 React 应用程序，现在钱正在涌入。是时候买一个 Bored Ape 并整天在 Twitter 上发布表情包了！

但是等等 - 你还不能！ 不是因为 Twitter 在这些方面有害，而是因为你没有创建提取资金的方法！ 您如何获得人们为域名支付的资金？

### 👻 函数修饰符和 withdraw 函数

让我们解决这个问题。 回到我们的合同，让我们在底部添加以下内容：

```solidity
modifier onlyOwner() {
  require(isOwner());
  _;
}

function isOwner() public view returns (bool) {
  return msg.sender == owner;
}

function withdraw() public onlyOwner {
  uint amount = address(this).balance;
  
  (bool success, ) = msg.sender.call{value: amount}("");
  require(success, "Failed to withdraw Matic");
} 
```



您现在可能遇到错误。别担心，这是意料之中的！让我们继续分解一下：

我们创建的第一件事是一个函数 `modifier`。这允许我们改变函数的行为。将它们视为实现`require`语句的更漂亮的方式。我们的修饰符所做的只是要求 `isOwner()` 函数返回 true。否则，使用此修饰符声明的任何函数都将失败。

它的奇怪部分是末尾的`_;`。它真正的意思是任何使用修饰符的函数都应该在 require **之后**执行。因此，如果 `_;` 在 require 之前，withdraw 函数将首先被调用，然后是 require，这将是无用的，因为它无论如何都会恢复。

至于 `withdraw()` 函数，它所做的只是获取合约的余额并将其发送给请求者（必须是函数运行的所有者）。这是提取资金的简单方法。 `msg.sender.call{value: amount}("")` 是我们汇款的魔法线 :)。语法有点奇怪！注意我们是如何传递它的`amount`！ `require(success` 是我们知道交易成功的地方:)。如果不是，它会将交易标记为错误并说“无法提取 Matic”。

### 🤠 设置合约所有者

现在要修复那个讨厌的 `owner` 错误，您需要做的就是在合约顶部创建一个全局 `owner` 变量并在构造函数中设置，如下所示：

```solidity
address payable public owner;

constructor(string memory _tld) ERC721 ("Ninja Name Service", "NNS") payable {
  owner = payable(msg.sender);
  tld = _tld;
  console.log("%s name service deployed", _tld);
}
```



这个变量的妙处在于我们将其设置为`payable`类型。 这只是意味着所有者的地址可以接收付款。 是的。 您需要明确声明。 您可以在 [此处](https://solidity-by-example.org/payable/) 阅读更多相关信息。

现在您可以提取合约中的资金了！ 财务独立，我们来了！ 哇哦！

### 🏦 测试一下

让我们尝试“抢劫”我们自己的合约😈。 我将成为逃亡司机，请你设置 `run.js` 脚本：

```jsx
const main = async () => {
  const [owner, superCoder] = await hre.ethers.getSigners();
  const domainContractFactory = await hre.ethers.getContractFactory('Domains');
  const domainContract = await domainContractFactory.deploy("ninja");
  await domainContract.deployed();

  console.log("Contract owner:", owner.address);

  // Let's be extra generous with our payment (we're paying more than required)
  let txn = await domainContract.register("a16z",  {value: hre.ethers.utils.parseEther('1234')});
  await txn.wait();

  // How much money is in here?
  const balance = await hre.ethers.provider.getBalance(domainContract.address);
  console.log("Contract balance:", hre.ethers.utils.formatEther(balance));

  // Quick! Grab the funds from the contract! (as superCoder)
  try {
    txn = await domainContract.connect(superCoder).withdraw();
    await txn.wait();
  } catch(error){
    console.log("Could not rob contract");
  }

  // Let's look in their wallet so we can compare later
  let ownerBalance = await hre.ethers.provider.getBalance(owner.address);
  console.log("Balance of owner before withdrawal:", hre.ethers.utils.formatEther(ownerBalance));

  // Oops, looks like the owner is saving their money!
  txn = await domainContract.connect(owner).withdraw();
  await txn.wait();
  
  // Fetch balance of contract & owner
  const contractBalance = await hre.ethers.provider.getBalance(domainContract.address);
  ownerBalance = await hre.ethers.provider.getBalance(owner.address);

  console.log("Contract balance after withdrawal:", hre.ethers.utils.formatEther(contractBalance));
  console.log("Balance of owner after withdrawal:", hre.ethers.utils.formatEther(ownerBalance));
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

![https://i.imgur.com/3ieh5KW.png](https://i.imgur.com/3ieh5KW.png)



当您使用 `npx hardhat run scripts/run.js` 运行此脚本时，您会注意到抢劫未遂后的 catch 块被触发，这意味着我们的尝试失败了！ 哎呀。

这里发生的事情是，当我们以随机人 (`superCoder`) 的身份调用 `withdraw()` 函数时，修饰符会检查我们不是所有者并恢复交易。 但是当我们作为所有者退出时，代币就通过了！ 如果需要，您可以在 try catch 块中记录错误，以查看合约的内容。

### 🚨进度报告

*请这样做，否则 Raza 会伤心的:(*

在您尝试“抢劫”您的合约后，在控制台的“#progress”中发布屏幕截图。