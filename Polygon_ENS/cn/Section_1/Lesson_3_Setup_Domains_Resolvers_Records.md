

### 💽 在链上存储域数据

从这里开始，让我们为我们的合约添加一些花哨的东西。

域名服务的全部意义在于帮助将人们引导到您在互联网上的位置！ 就像您输入 [`google.com`](http://google.com) 以访问 Google 一样，人们将能够使用您的域名服务前往他们想去的任何地方！ 这就是我们要做的地方。 用户将向我们发送一个名称，我们将为他们提供该名称的域名！

所以，我们首先需要的是一个函数，他们可以点击这个函数来注册他们的域名和一个存储他们名字的地方：
```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.10;

import "hardhat/console.sol";

contract Domains {
  // A "mapping" data type to store their names
  mapping(string => address) public domains;

  constructor() {
      console.log("THIS IS MY DOMAIN CONTRACT. NICE.");
  }

  // A register function that adds their names to our mapping
  function register(string calldata name) public {
      domains[name] = msg.sender;
      console.log("%s has registered a domain!", msg.sender);
  }

  // This will give us the domain owners' address
  function getAddress(string calldata name) public view returns (address) {
      return domains[name];
  }
}
```



我们在这里添加了一些函数，还有 `domains` [映射](https://docs.soliditylang.org/en/v0.8.14/types.html#mapping-types) 变量！映射是一种“映射”两个值的简单数据类型。在我们的例子中，我们将字符串（域名）与钱包地址进行匹配。

这个变量很特别，因为它被称为“状态变量”，而且很酷，因为它**永久**存储在合约的存储中。这意味着任何调用注册函数的人都将在我们的合同中永久存储与其域相关的数据。

我们在这里还使用了 `msg.sender` 的一些魔法。这是调用函数的人的钱包地址。这太棒了！这就像内置身份验证。我们确切地知道谁调用了该函数，因为为了调用智能合约函数，您需要使用有效的钱包签署交易！

以后我们可以写出只有特定钱包地址才能命中的功能。例如，我们可以更改此功能，以便只有拥有域的钱包才能更新它们。

`getAddress` 函数正是这样做的——**它获取域所有者的钱包地址**。你会注意到函数定义中的很多东西，所以让我们来看看这些：

- `calldata` - 这表示应存储 `name` 参数的“位置”。由于在区块链上处理数据需要花费大量金钱，因此 Solidity 允许您指示引用类型应存储在何处。 `calldata` 是非持久性的，无法修改。我们喜欢这个，因为它需要最少的gas！
- `public` - 这是一个可见性修饰符。我们希望每个人都可以访问我们的功能，包括其他合约。
- `view` - 这只是意味着该函数只查看合约上的数据，而不是修改它。
- `returns (address)` - 该函数返回域所有者的钱包地址作为本地 Solidity 地址类型。 ezpz。

### ✅ 更新 run.js 以调用我们的函数

是时候再次运行了，但是 `run.js` 需要在我们这样做之前进行更改！现在我们有一些函数可以调用，我们可以使用 `run.js` 手动测试它们！请记住，`run.js` 是我们的游乐场 :)。

当我们将合约部署到区块链时（当我们运行 `domainContractFactory.deploy()` 时）我们的函数可以在区块链上调用，因为我们在函数上使用了特殊的 **public** 关键字。

把它想象成一个公共 API 端点！

所以现在我们要专门测试那些功能！
```jsx
const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const domainContractFactory = await hre.ethers.getContractFactory('Domains');
  const domainContract = await domainContractFactory.deploy();
  await domainContract.deployed();
  console.log("Contract deployed to:", domainContract.address);
  console.log("Contract deployed by:", owner.address);
  
  const txn = await domainContract.register("doom");
  await txn.wait();

  const domainOwner = await domainContract.getAddress("doom");
  console.log("Owner of domain:", domainOwner);
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





**VSCode 可能会自动导入 `ethers`。 我们不需要导入 `ethers`。 所以，确保你没有导入。 还记得我们上节课讲的关于 hre 的内容吗？**

### 🤔它是如何工作的？

```jsx
const [owner, randomPerson] = await hre.ethers.getSigners();
```




为了将某些东西部署到区块链，我们需要有一个钱包地址！ Hardhat 在后台神奇地为我们做了这件事，但在这里我抓取了合约所有者的钱包地址，我还抓取了一个随机钱包地址并将其称为 `randomPerson`。 稍后这会更有意义。
我还加上了：

```jsx
console.log("Contract deployed by:", owner.address);
```



我这样做只是为了查看部署我们合同的人的地址。

我添加的最后一件事是：

```jsx
const txn = await domainContract.register("doom");
await txn.wait();

const domainOwner = await domainContract.getAddress("doom");
console.log("Owner of domain:", domainOwner);
```



和以前一样，让我们手动调用我们的新函数！

首先，我调用函数来注册名称“doom”。 然后我调用 getAddress 函数返回该域的所有者。 很简单，这是对的吗？

好的。 让我们运行这个，好吗？ 像往常一样运行脚本：
```bash
npx hardhat run scripts/run.js
```

Here's my output:

这是我输出的内容：

![https://i.imgur.com/aOfyP0N.png](https://i.imgur.com/aOfyP0N.png)



**这是疯狂的。**您正在 **✨ 区块链 ✨** 上注册域名

### 🎯 存储记录

非常好！所以，我们现在有办法在我们的智能合约上注册域名！我们现在需要一种方法让该域为我们指向一些数据！归根结底，这就是域的作用吗？它是指向其他东西的东西，例如 reddit.com 指向 Reddit 的服务器。

**将此视为您域的 DNS 设置。您知道如何前往 Namecheap 或 Cloudflare 并自定义与该域关联的 DNS 记录吗？同样的事情在这里。我们正在构建我们的 DNS 记录系统。**

使用 ENS，你可以存储一堆不同的东西，就像我之前展示的那样。为了完成我们应用程序的“名称服务”部分，我们将向每个域添加记录。这意味着我们会将每个名称连接到一个值，有点像数据库。这些值可以是任何东西——钱包地址、秘密加密消息、Spotify 链接、我们服务器的 IP 地址，任何你想要的！

我会选择字符串类型，原因我已经说了很多，现在我想在链上谈谈。这是我更新后的合同的样子：

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "hardhat/console.sol";

contract Domains {
  mapping(string => address) public domains;
  
  // Checkout our new mapping! This will store values
  mapping(string => string) public records;

  constructor() {
      console.log("Yo yo, I am a contract and I am smart");
  }

  function register(string calldata name) public {
      // Check that the name is unregistered (explained in notes)
      require(domains[name] == address(0));
      domains[name] = msg.sender;
      console.log("%s has registered a domain!", msg.sender);
  }

  function getAddress(string calldata name) public view returns (address) {
      return domains[name];
  }

  function setRecord(string calldata name, string calldata record) public {
      // Check that the owner is the transaction sender
      require(domains[name] == msg.sender);
      records[name] = record;
  }

  function getRecord(string calldata name) public view returns(string memory) {
      return records[name];
  }
}
```



是的。 这是另一个映射。 这里唯一的新东西是 `require` 语句。 这些是为了阻止其他人使用您的域或更改记录。 想象一下，如果您从麦当劳订购了一顿快乐的大餐，然后有人将您的订单更改为 Egg McMuffin。 😠

这就是你的合约中发生的事情！ 如果要求逻辑失败，交易将被**恢复**，这意味着区块链数据不会改变。

让我们来看看这些要求：

```solidity
require(domains[name] == address(0));
```



在这里，我们正在检查您要注册的域的地址是否与零地址相同。 Solidity 中的零地址有点像一切都来自的虚空（字面意义上）。 当初始化地址映射时，其中的所有条目都指向零地址。 因此，如果域尚未注册，它将指向零地址！

```solidity
require(domains[name] == msg.sender);
```



这个很简单——检查交易发送者是否是拥有该域的地址。 我们不想让*任何人*设置我们的域名记录。

### 🤝 测试其他用户

好吧 - 是时候测试这个东西了！ 如果我们只能发送和注册一个域名，那就太无聊了！！ 我们希望每个人都使用我们的域 :)。

检查一下 - 我在函数底部添加了几行。 我不打算解释太多（但请在#general-chill-chat 中提问）。 基本上这就是我们如何模拟其他人点击我们的功能 :)。
```jsx
const main = async () => {
  // The first return is the deployer, the second is a random account
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const domainContractFactory = await hre.ethers.getContractFactory('Domains');
  const domainContract = await domainContractFactory.deploy();
  await domainContract.deployed();
  console.log("Contract deployed to:", domainContract.address);
  console.log("Contract deployed by:", owner.address);

  let txn = await domainContract.register("doom");
  await txn.wait();

  const domainAddress = await domainContract.getAddress("doom");
  console.log("Owner of domain doom:", domainAddress);

  // Trying to set a record that doesn't belong to me!
  txn = await domainContract.connect(randomPerson).setRecord("doom", "Haha my domain now!");
  await txn.wait();
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


添加到此代码块的最新内容是：

```jsx
txn = await domainContract.connect(randomPerson).setRecord("doom", "Haha my domain now!");
await txn.wait();
```



**运行这个脚本会给你一个错误！我们想要一个错误。** 那是因为我们正在尝试为不属于我们的域设置记录。现在我们知道我们的 require 语句起作用了。好的。

### 🚨 点击“下一课”之前

*注意：如果你不这样做，Raza 会很伤心:(*

自定义您的代码一点！随意使用合约和 run.js 文件并注册多个域并设置各种记录。也许你希望人们将他们的域映射到他们的电子邮件地址——所以 `raza.mycustomdomain` 将映射到我的电子邮件。或者，您可能希望人们能够将其个人网站的 IP 地址添加为记录。您甚至可以将域映射到人们最喜欢的 meme lol 的 SVG。

无论你想要什么！支持的数据类型是极限！

即使您只是将变量名和函数名更改为您认为有趣的名称，这也很重要。尽量不要直接复制我！想想您的最终网站和您想要的功能类型。构建您想要的功能**。

在这里完成所有操作后，请务必在#progress 中发布终端输出的屏幕截图。