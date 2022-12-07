*注意:这节课比以往其他课程要长一点!*

现在我们已经准备好了所有的脚本并掌握了相关基础知识，我们将制作一些NFT。这是我更新后的 `MyEpicNFT.sol` 文件内容：

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

// We first import some OpenZeppelin Contracts.
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

// We inherit the contract we imported. This means we'll have access
// to the inherited contract's methods.
contract MyEpicNFT is ERC721 {
  // Magic given to us by OpenZeppelin to help us keep track of tokenIds.
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  // We need to pass the name of our NFTs token and its symbol.
  constructor() ERC721 ("SquareNFT", "SQUARE") {
    console.log("This is my NFT contract. Woah!");
  }

  // A function our user will hit to get their NFT.
  function makeAnEpicNFT() public {
     // Get the current tokenId, this starts at 0.
    uint256 newItemId = _tokenIds.current();

     // Actually mint the NFT to the sender using msg.sender.
    _safeMint(msg.sender, newItemId);
    
    // Return the NFT's metadata
    tokenURI(newItemId);

    // Increment the counter for when the next NFT is minted.
    _tokenIds.increment();
  }

  // Set the NFT's metadata
  function tokenURI(uint256 _tokenId) public view override returns (string memory) {
    require(_exists(_tokenId));
    return "blah";
  }
}
```

这里发生了很多事情。首先，当我声明合约时，您会看到我使用 `is ERC721`**继承**了一个 OpenZeppelin 合约。您可以在 [此处](https://solidity-by-example.org/inheritance/) 查阅更多关于**继承**的信息。但基本上，这意味着我们可以从我们的合约中调用其他合约，差不多就是导入函数供我们自己使用了！

NFT 标准被称为 `ERC721`，您可以在 [此处](https://eips.ethereum.org/EIPS/eip-721) 阅读一些相关内容。OpenZeppelin 本质上为我们实现了 NFT 标准，然后让我们在其之上编写自己的逻辑以对其进行自定义，这意味着我们不需要编写样板代码。

从头开始编写HTTP服务器而不使用样板库是很疯狂的，对吧? 当然，除非你想探索一下,哈哈。但我们只想尽快开始工作。

同样——从头开始编写 NFT 合约是很疯狂的！您可以探索我们从 [此处](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol) 继承的“ERC721”合约。

让我们通过 `makeAnEpicNFT` 函数逐步了解它。

```solidity
uint256 newItemId = _tokenIds.current();
```

`_tokenIds`是什么鬼?还记得毕加索的例子吗?他有 100 个 NFT 草图，命名为 Sketch #1、Sketch #2、Sketch #3 等。这些都是唯一标识符。

同样，我们使用 `_tokenIds` 来跟踪 NFT 的唯一标识符，它只是一个数字！当我们声明 `private _tokenIds` 时，它会自动初始化为 `0`。 因此，当我们第一次调用 `makeAnEpicNFT` 时，`newItemId` 为 `0`。当我们再次运行时，`newItemId` 将为 `1`，依此类推！

`_tokenIds` 是一个**状态变量**，这意味着如果我们更改它，该值将直接存储在合约中。

```solidity
_safeMint(msg.sender, newItemId);
```

当我们执行 `_safeMint(msg.sender, newItemId) `时，它几乎是在说：“将 ID 为 `newItemId` 的 NFT 铸造给地址为 `msg.sender` 的用户”。 在这里，`msg.sender` 是一个由[Solidity提供](https://docs.soliditylang.org/en/develop/units-and-global-variables.html#block-and-transaction-properties)的变量，让我们可以轻松访问调用合约的人的**公共地址**。

这里最棒的是，这是一种获取用户公共地址**超级安全的方法**。将公共地址自身保密不是问题，这已经公开了！！ 但是，通过使用 `msg.sender` 你不能“伪造”别人的公共地址，除非你有他们的钱包凭证并代表他们调用合约！

**你不能匿名调用合约**，你需要连接你的钱包。 这几乎就像“登录”并通过身份验证。

```solidity
_tokenIds.increment();
```
然后，我们重写 `ERC721.sol` 中的`tokenURI()`函数，该函数将设置 NFT 的唯一标识符以及与该标识符相关联的数据。从字面上看，是我们设置了使 NFT 有价值的实际数据。 在这种情况下，我们将其设置为`blah`，这……其实没什么价值；）。 它也不遵循 `ERC721` 的标准。 我们稍后会详细介绍 `tokenURI`。

```solidity
function tokenURI(uint256 _tokenId) public view override returns (string memory);
```

NFT 生成后，我们使用 `_tokenIds.increment()` 增加 `tokenIds`（这是 OpenZeppelin 给我们的一个函数）。 可确保下次铸造 NFT 时，具有不同的`tokenIds`标识符。没有人可以拥有已经铸造的`tokenIds`。

### 🎟在本地生成`tokenURI` 

`tokenURI` 实际 NFT 数据所在的位置。它通常**链接**到一个名为`元数据`的 JSON 文件，看起来像这样：
```bash
{
    "name": "Spongebob Cowboy Pants",
    "description": "A silent hero. A watchful protector.",
    "image": "https://i.imgur.com/v7U019j.png"
}
```
您可以对其进行自定义，但是，几乎每个 NFT 都有名字、描述以及指向视频、图像等内容的链接。它甚至可以具有自定义属性！请注意元数据的结构，如果您的结构不符合 [OpenSea 要求](https://docs.opensea.io/docs/metadata-standards)，您的 NFT 将在网站上显示为损坏。

这些都是`ERC721`标准的一部分，它允许人们在非功能性数据的基础上建立网站。例如，[OpenSea](https://testnets.opensea.io/)是一个查看 NFT 的平台。而且，OpenSea上的每个NFT都遵循`ERC721`元数据标准，这使得人们可以很容易地查看他们的NFT。想象一下，如果每个人都遵循他们自己的 NFT 标准，并按照自己的意愿构建他们的元数据，那将会是一片混乱!

我们可以复制`Spongebob Cowboy Pants`的JSON元数据，并将其粘贴到[这个](https://jsonkeeper.com/)网站。这个网站只是一个方便人们托管JSON数据的地方，目前我们将使用它来保存NFT 数据。当你点击`保存`，你会得到一个JSON文件的链接，(例如，我的是[`https://jsonkeeper.com/b/RUUS`](https://jsonkeeper.com/b/RUUS)。一定要先测试你的链接，确保它能正常使用!

***注意:我希望你创建自己的JSON元数据，而不只是复制我的。使用你自己的图片、名字和描述。也许你想让你的NFT是你最喜欢的动画角色，最喜欢的乐队，无论是什么!!让它成为定制品。别担心，我们将来会改变这一点!***

如果您决定使用自己的图片，请确保 URL 直接指向实际图片，而不是托管图片的网站！直接的 Imgur 链接看起来像这样 - `https://i.imgur.com/123123.png` 而不是 `https://imgur.com/gallery/123123`。最简单的判断方法是检查 URL 是否以图像扩展名结尾，例如 `.png` 或 `.jpg`。您可以右键单击 imgur 图片并“复制图片地址”，这将为您提供正确的 URL。

现在，让我们前往我们的智能合约并更改 `tokenURI()` 中的一行。替换：

```solidity
return "blah";
```

我们实际上要将 URL 设置为我们的 JSON 文件链接。
```solidity
return "INSERT_YOUR_JSON_URL_HERE";
```

我们还可以添加一个 `console.log` 来帮助我们查看 NFT 的铸造时间和铸造对象！

```solidity
console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);
```
这就是您的 `tokenURI` 函数现在的样子。 `_exists` 是一个内置函数，用于验证合约中是否存在 `tokenId`。 您可以在 [此处](https://docs.openzeppelin.com/contracts/3.x/api/token/erc721#ERC721-_exists-uint256-)了解更多信息。

```solidity
function tokenURI(uint256 _tokenId) public view override returns (string memory) {
  require(_exists(_tokenId));
  console.log("An NFT w/ ID %s has been minted to %s", _tokenId, msg.sender);
  return "INSERT_YOUR_JSON_URL_HERE";
}
```

### 🎉在本地铸造 NFT

从这里开始，我们需要做的就是更改我们的 `run.js` 文件以真实调用我们的 `makeAnEpicNFT() `函数。

下方代码就是我们需要做的所有事情：

```javascript
const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory('MyEpicNFT');
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);

  // Call the function.
  let txn = await nftContract.makeAnEpicNFT()
  // Wait for it to be mined.
  await txn.wait()

  // Mint another NFT for fun.
  txn = await nftContract.makeAnEpicNFT()
  // Wait for it to be mined.
  await txn.wait()

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
当我们运行以下命令：

```bash
npx hardhat run scripts/run.js
```

我们将看到：
![Untitled](https://i.imgur.com/EfsOs5O.png)

BOOM！我们刚刚在本地给我们自己铸造了一个 ID 为`0`的 NFT！所以，我们知道代码是可以正常运行，没有任何错误。 令人惊叹的您总是希望使用`run.js`，以确保内容在本地运行而不会崩溃,这是你自己的小小试验场！

所以，现在每次有人用这个功能铸造一个 NFT，它总是同一个 NFT——“Spongebob Cowboy Pants”！ 我们将在接下来的部分中学习如何改变这一点，以便每个与您一起铸造 NFT 的人都将获得一个随机的、独特的 NFT。

现在，让我们进入下一步——部署到测试网。

### 🎉部署到Goerli并在OpenSea上查看

由于OpenSea不支持Goerli，我们必须寻找替代方案。当部署到Goerli时，您可以登录[OpenSea](https://testnets.opensea.io/)查看您的 NFT。当我们使用 `run.js`时，只是在我们在本地工作。

下一步是测试网，您可以将其视为“彩排”演练环境。当我们部署到测试网时，我们实际上能够**在线查看我们的 NFT**，并且我们距离将其提交给**真实用户更近了一步。**

### 💳交易

因此，当我们想要执行更改区块链的操作时，我们将其称为*交易*。 例如，向某人发送 ETH 是一笔交易，因为我们正在更改账户余额。 在我们的合约中做一些更新变量的事情也被认为是一个交易，因为我们正在改变数据。铸造 NFT 是一项交易，因为我们在合约上保存了数据。

**部署智能合约也是一项交易。**

请记住，区块链是去中心化的。它一个是由世界各地的**矿工**通过大量计算机运行的区块链副本。

当我们部署合约时，我们需要告诉**所有这些**矿工，“嘿，这是一个新的智能合约，请将我的智能合约添加到区块链，然后也告诉其他人”。

这就是[QuickNode](https://www.quicknode.com/?utm_source=buildspace&utm_campaign=generic&utm_content=sign-up&utm_medium=buildspace)发挥作用的地方。


QuickNode基本上帮助我们广播我们的合约创建交易，以便矿工能尽可能快地获取它。一旦交易被挖掘，它将作为合法交易广播到区块链。从那里，每个人可以更新他们的区块链副本。

这是很复杂的。而且，如果您不完全理解它，请不要担心。当您见识过更多代码并实际构建此应用程序时，它自然会更有意义。

所以，在QuickNode[ 这里 ](https://www.quicknode.com/?utm_source=buildspace&utm_campaign=generic&utm_content=sign-up&utm_medium=buildspace)注册一个帐户。

然后看看我下面的视频，学习如何获得测试网的API密钥:

[LOOM](https://www.loom.com/share/c079028c612340e8b7439d0d2103a313)

### 🕸测试网

我们暂时不会部署到“Ethereum主网”。 为什么？ 因为它要花费真金白银，一旦搞砸很不值!我们现在还在学习，我们将从`测试网`开始，它是`主网`的克隆，但它使用测试币，所以我们可以尽可能多地测试这些内容。但是，重要的是要知道测试网是由真实矿工运行并模仿“Ethereum主网”世界的场景。

这太棒了，因为我们可以在实际场景中测试我们的dapp，我们实际上将要：
1. 广播我们的交易
2. 等着被真实的矿工发现
3. 等着它被挖出来
4. 等待它被广播回区块链告诉所有其他矿工更新他们的副本

### 🤑获取一些测试币

Ethereum有很多测试网，我们将使用“Goerli”测试网，它由以太坊基金会运行的。

为了部署到 `Goerli`，我们需要用到`GoerliETH`。为什么？ 因为如果你要部署到Ethereum主网上，你要用到主网ETH ！ 因此，测试网克隆了主网的工作方式，唯一的区别是不涉及到真钱。

为了获得测试的ETH，我们必须向网络索要一些。 **这个测试 ETH 只能在这个特定的测试网上工作**，你可以通过水龙头为 Goerli 获取一些 测试ETH。你只需要找到一个有效的水龙头，哈哈。

对于 MyCrypto，您需要连接您的钱包，注册一个帐户，然后再次单击相同的链接以请求资金。Goerli官方水龙头，需要登录 Alchemy 账户，可以获得2倍的数量。

你可以从下面选择水龙头网址：
| 网站             | 网址                                   | 数量            | 时间限制      |
| ---------------- | ------------------------------------- | --------------- | ------------ |
| MyCrypto         | https://app.mycrypto.com/faucet       | 0.01            | None         |
| Official Goerli  | https://goerlifaucet.com/             | 0.25            | 24 Hours
| Chainlink        | https://faucets.chain.link/goerli     | 0.1             | None         |

### 🚀设置`deploy.js`文件

将 `deploy.js` 与 `run.js` 分开是一个很好的实践经验。`run.js` 是我们经常搞砸的地方，我们想把它们分开。在`scripts` 文件夹下创建一个名为 `deploy.js` 的文件。复制 `run.js` 中的所有内容到`deploy.js`中。现在他们的内容完全一样了，不过，我添加了一些 `console.log` 语句。

```javascript
const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory('MyEpicNFT');
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);

  // Call the function.
  let txn = await nftContract.makeAnEpicNFT()
  // Wait for it to be mined.
  await txn.wait()
  console.log("Minted NFT #1")

  txn = await nftContract.makeAnEpicNFT()
  // Wait for it to be mined.
  await txn.wait()
  console.log("Minted NFT #2")
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

## 📈 部署到 `Goerli` 测试网

我们需要修改我们的 `hardhat.config.js` 文件,您可以在智能合约项目的根目录中找到它。

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: '0.8.17',
  networks: {
    goerli: {
      url: process.env.QUICKNODE_API_KEY_URL,
      accounts: [process.env.GOERLI_PRIVATE_KEY],
    },
  },
};
```
这里我们基本上是在配置我们的 `hardhat.config.js` 来安全使用我们的`.env`变量，即**process.env.quicknode_api_key_url** & **process.env.GOERLI_PRIVATE_KEY**。您现在需要打开终端并输入:
```
npm install dotenv
```
这基本上只是安装了允许我们使用环境变量的 `dotenv` 包。

现在您可以在项目的根目录中创建一个 **.env** 文件。 可以肯定的是，它应该与包含 **hardhat.config.js** 文件的路径相匹配。

您可以从 QuickNode 仪表板获取 API URL 并将其粘贴。然后，您需要您的**私钥**（不是您的公共地址！），您可以从[Meatmask](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key)中获取并将其粘贴到相应位置。

打开 **.env** 文件并粘贴我们从`quicknode`中获取的的链接，如下所示。

```
QUICKNODE_API_KEY_URL=<YOUR API URL>
GOERLI_PRIVATE_KEY=<YOUR PRIVATE KEY>
```

不要忘记在添加 `YOUR API URL`和 `YOUR PRIVATE KEY`🔑后删除 `<` `>` 。

***注意:不要提交这个文件到GITHUB。它包含您的私钥,你可能会被黑客抢劫,此私钥与您的主网私钥相同。***

***打开您的`.gitignore`文件，并在里面添加一行`.env`。（如果之前没有这行代码的话）***

你的`.gitignore`文件看起应该是这个样子。

```
node_modules
.env
coverage
coverage.json
typechain

#Hardhat files
cache
artifacts
```

为什么需要使用私钥？ 因为为了执行像部署合约这样的交易，您需要 `登录` 到区块链并签署/部署合约。而且，您的用户名是您的公共地址，您的密码是您的私钥，这有点像登录 AWS 或 GCP 进行部署。

一旦您完成了配置，我们就可以使用我们之前编写的`部署脚本`进行部署。

从 `epic-nfts` 的根目录运行此命令：

```bash
npx hardhat run scripts/deploy.js --network goerli
```

部署通常需要20-40秒。我们不仅仅是在部署，我们也在 `deploy.js`中创建NFT，所以这也需要一些时间。我们实际上需要等待交易被矿工挖掘。相当的神奇，就这一个命令可以做到这一切!

当我运行命令，将输出如下(当然你的合约地址应该不一样):

![](https://i.imgur.com/TwpQOTM.png)

我们可以使用 [Goerli Etherscan](https://goerli.etherscan.io/) 来查看合约地址并确保他在正常状态！

要习惯使用 Etherscan，因为它是跟踪部署是否出错的最简单办法。如果Etherscan没有显示，那就意味着它要么还在处理，要么就是出了问题!

如果它有效——太棒了，你刚刚部署了一个合约! YESSSS。

### 🌊在OpenSea上查看

信不信由你。您刚刚创建的NFT将会出现在OpenSea的TestNet站点上。

1. 前往[`https://testnets.opensea.io/`](https://testnets.opensea.io/)
2. 创建此url：[`https://testnets.opensea.io/assets/goerli/替换你的合约地址/TOKEN_ID`](https://testnets.opensea.io/assets/goerli/INSERT_DEPLOY_CONTRACT_ADDRESS_HERE/TOKEN_ID)

例如，这是我的Spongebob NFT 链接：https://testnets.opensea.io/assets/goerli/0x78d1e929cfc5256643b3cc67c50e2d7ec3580842/0 ，我的`tokenId`是'0'，因为它是该合约铸造的第一个NFT。

**基本上，如果您在几分钟内没有在 OpenSea 上看到您的 NFT，请刷新页面并再等待 15 分钟**

![](https://i.imgur.com/ePDlYX1.png)

所以在这里，你点击`Collection`下的 `SquareNFT` ，然后你会看到你铸造的 NFT！

![](https://i.imgur.com/Q96NYK4.png)

非常了不起，我们已经创建了自己的 NFT 合约*并*铸造了两个NFT。虽然这是史诗级别的，但它“有点蹩脚”，对吧?每次都是同样的Spongebob图片!我们如何在此添加一些随机性并快速生成内容?这就是我们接下来要讨论的问题:)。

### 💻代码

[此处](https://gist.github.com/farzaa/483c04bd5929b92d6c4a194bd3c515a5)是到目前为止所有代码的链接。

### 🚨进度证明提交
WOOOOOOO！拍拍自己的背。您部署了一个可以生成 NFTS 的智能合约。

快览：我们已经看到，最好的建设者已经养成了**公开创业**的习惯。所有这一切意味着分享一些关于他们刚刚达到的里程碑知识！

你应该**Tweet** 你刚刚编写并部署了可以铸造 NFT 的智能合约并[@_buildspace](https://twitter.com/_buildspace)。 如果您想，请附上OpenSea/Rarible 页面的屏幕截图，显示您的 NFT :)

你应该为自己真正构建了所有人仅仅只是在谈论的东西而感到自豪。你有超能力:)。


*感谢那些已经在推特上谈论我们的人，你们都是传奇 <3.*
![](https://i.imgur.com/ftXoVsn.png)
![](https://i.imgur.com/HBMIgu2.png)
![](https://i.imgur.com/KwbO0Ib.png)




























