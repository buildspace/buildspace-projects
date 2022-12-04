
我们的合同开始成形。但是，我们现在只是做了映射。你还无法在你的钱包或 OpenSea 上真正查看它们。那不是很像现金。我们在这里要做的是**将我们的域名变成可以在 OpenSea 上查看的 NFT**，并根据域名的长度以不同的价格出售它们。

顺便说一下，**ENS 域只是引擎盖下的 NFT**。它是独一无二的，一次只能有一个钱包可以保存某个域。

如果您想了解什么是 NFT，请在继续之前单击[此处](https://github.com/buildspace/buildspace-projects/blob/main/NFT_Collection/en/Section_1/Lesson_1_What_Is_A_NFT.md) 了解入门知识.只要您对什么是 NFT 有一个*大致的了解*，您就是天才！

### 💰 获得报酬并继续使用 .ninja

奇怪的是，我们实际上并没有在我们的合同中加入像“.eth”这样的 TLD（顶级域名）。不再！让我们设置一个我们希望我们的朋友能够创建的域！我选择`.ninja`🥷

**请将此更改为您喜欢的任何内容**。也许是“.fren”、“.vibes”或只是“.toast”：
```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

// Don't forget to add this import
import { StringUtils } from "./libraries/StringUtils.sol";
import "hardhat/console.sol";

contract Domains {
  // Here's our domain TLD!
  string public tld;

  mapping(string => address) public domains;
  mapping(string => string) public records;
		
  // We make the contract "payable" by adding this to the constructor
  constructor(string memory _tld) payable {
    tld = _tld;
    console.log("%s name service deployed", _tld);
  }
		
  // This function will give us the price of a domain based on length
  function price(string calldata name) public pure returns(uint) {
    uint len = StringUtils.strlen(name);
    require(len > 0);
    if (len == 3) {
      return 5 * 10**17; // 5 MATIC = 5 000 000 000 000 000 000 (18 decimals). We're going with 0.5 Matic cause the faucets don't give a lot
    } else if (len == 4) {
      return 3 * 10**17; // To charge smaller amounts, reduce the decimals. This is 0.3
    } else {
      return 1 * 10**17;
    }
  }
  // Added "payable" modifier to register function
  function register(string calldata name) public payable{
    require(domains[name] == address(0));
    
    uint _price = price(name);

    // Check if enough Matic was paid in the transaction
    require(msg.value >= _price, "Not enough Matic paid");

    domains[name] = msg.sender;
    console.log("%s has registered a domain!", msg.sender);
  }
  // Other functions unchanged
}
```



*注意：我们仍然需要* `getAddress`、`setRecord` *和* `getRecord` *函数，它们只是没有改变所以我删除了它们以保持简短。*

你会发现这里有一些额外的属性！ 我们在 `register` 中添加了 `payable`。

我还添加了：

```solidity
uint _price = price(name);  
require(msg.value >= _price, "Not enough Matic paid");
```



在这里，我们检查发送的“msg”的“值”是否超过一定数量。 “Value”是发送的 Matic 数量，“msg”是交易。

我希望你花一点时间来体会这有多么疯狂。 只需一行代码，我们就可以将支付添加到我们的应用程序中。 不需要 API 密钥。 没有授权。 没有来自支付提供商的回调。

这就是区块链的美妙之处。 它是为交易价值而构建的。 如果交易没有足够的 Matic，它将被还原并且没有任何变化。

仔细观察价格函数，我们发现它是一个纯函数——这意味着它不读取或修改合约状态。 它只是一个帮手。 我们可以使用 JavaScript 等在前端完成吗？ 是的，但它不会那么安全！ 在这里，我们计算链上的最终价格。

**我已将我的设置为根据域的长度返回价格。 较短的域名更贵！**

由于 MATIC 代币有 18 位小数，我们需要在价格末尾加上 `* 10**18`。

```solidity
function price(string calldata name) public pure returns(uint) {
  uint len = StringUtils.strlen(name);
  require(len > 0);
  if (len == 3) {
    return 5 * 10**17; // 5 MATIC = 5 000 000 000 000 000 000 (18 decimals). We're going with 0.5 Matic cause the faucets don't give a lot
  } else if (len == 4) {
    return 3 * 10**17; // To charge smaller amounts, reduce the decimals. This is 0.3
  } else {
    return 1 * 10**17;
  }
}
```



*注意：**您需要降低价格才能在孟买测试网上铸币**！如果您收取 1 Matic 的费用，您将很快耗尽测试网资金。在本地运行时你可以收取任何费用，但在真实测试网络上时要小心。*

至于其余的，我们添加了三件事：

- `import { StringUtils }` - 我们正在导入一个帮助文件。我很快就会讨论这个。
- 一个名为 `tld` 的公共字符串 - 这将记录您的史诗域以什么结尾（例如 `.ninja`）。
- 构造函数中的 `string memory _tld` - 构造函数只运行一次！这就是我们设置公共 `tld` 变量的方式。

对于新导入 - 获取 [此文件](https://gist.github.com/AlmostEfficient/669ac250214f30347097a1aeedcdfa12) 并将其放入合同文件夹中名为“libraries”的新文件夹中。 Solidity 中的字符串很奇怪，所以我们需要一个自定义函数来检查它们的长度。此函数首先将它们转换为字节，从而提高 gas 效率！耶节省！

`tld` 字符串和构造函数的更改非常简单。我们稍后会用到这个字符串。
![https://i.imgur.com/1lZJzfa.png](https://i.imgur.com/1lZJzfa.png)



我们的合约已准备好了。 现在，我们从所有想要我们出色域名的人那里拿钱。 准备好迎接您将打造的最惊人的支付体验了吗？

你知道演习 - 让我们前往我们的 run.js 并像这样更新它：

```jsx
const main = async () => {
  const domainContractFactory = await hre.ethers.getContractFactory('Domains');
  // We pass in "ninja" to the constructor when deploying
  const domainContract = await domainContractFactory.deploy("ninja");
  await domainContract.deployed();

  console.log("Contract deployed to:", domainContract.address);

  // We're passing in a second variable - value. This is the moneyyyyyyyyyy
  let txn = await domainContract.register("mortal",  {value: hre.ethers.utils.parseEther('0.1')});
  await txn.wait();

  const address = await domainContract.getAddress("mortal");
  console.log("Owner of domain mortal:", address);

  const balance = await hre.ethers.provider.getBalance(domainContract.address);
  console.log("Contract balance:", hre.ethers.utils.formatEther(balance));
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



那么我们实际上在这里做什么？

我希望所有注册域名的结尾都是“.ninja”。 这意味着我们需要将 `ninja` 传递给我们的部署函数来初始化我们的 `tld` 属性！ 接下来，要注册一个域，我们需要实际调用我们的注册函数。 请记住，这需要两个参数：

- 您要注册的域名
- **Matic 中域名（包括 gas）的花费**

我们使用特殊的 `parseEther` 函数，因为单位 [在 Solidity 中的工作方式不同](https://docs.soliditylang.org/en/v0.8.14/units-and-global-variables.html#units-and-globally-available-variables)。 这将从我的钱包中向合约发送 0.1 Matic 作为付款。 一旦发生这种情况，该域将被铸造到我的钱包地址。

**BOOM。 就是这样。** 这就是使用智能合约进行付款是多么容易！ 没有愚蠢的支付处理器、注册、随机信用卡费用。 一行代码。 EZPZ。

继续运行你的脚本！ 一旦你这样做了，你应该会看到类似这样的东西：

![https://i.imgur.com/nLCRCKl.png](https://i.imgur.com/nLCRCKl.png)



**我们走吧**。 仅仅通过这个简单的合约代码，我们基本上就能够让我们的 ENS 的主要动作准备就绪！ 花点时间欣赏一下这里的炒作——太不可思议了🥲。

不过，它并不止于此——我们将通过一些 NFT 使这个领域的温度提高 10 倍👀。

### 💎 不可替代域

我们将在这里做一些神奇的事情——将我们的域映射变成 **✨NFTs ✨**！

如果你今天去 OpenSea 并且你拥有一个 ENS 域，你实际上可以看到这样的东西：
![https://i.imgur.com/fs9TVN5.png](https://i.imgur.com/fs9TVN5.png)



我们将做完全相同的事情！你可能在想——为什么我们需要让我们的域名成为 NFT？重点是什么？

好吧，如果您考虑传统的 web2 域，它们已经是 NFT。每个名称只能有一个域。多个人不能拥有同一个域。当您购买域名时，您实际上拥有并控制整个互联网上的唯一副本！所以我们只是把它带过来，但更好的是你可以很容易地交易/转移这些。

归根结底，您的 ENS 域名只是一个代币，对吧？让我们继续前进，用 NFT 永远巩固我们在区块链上的领域🤘

在我们深入研究代码之前，让我们回顾一下我们在这里实际要做的事情：

1. 使用 OpenZeppelin 的合约轻松铸造 ERC721 代币
2. 为我们的 NFT 创建 SVG 并在链上存储使用
3. 设置令牌元数据（NFT 将持有的数据）
4. 记住它！

归根结底——**我们想使用我们新注册的域名并从中创建一个 NFT。**

这是我们现在需要的所有代码更改。这将在之后逐步解释：


```jsx
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

// We first import some OpenZeppelin Contracts.
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {StringUtils} from "./libraries/StringUtils.sol";
// We import another help function
import "@openzeppelin/contracts/utils/Base64.sol";

import "hardhat/console.sol";

// We inherit the contract we imported. This means we'll have access
// to the inherited contract's methods.
contract Domains is ERC721URIStorage {
  // Magic given to us by OpenZeppelin to help us keep track of tokenIds.
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  string public tld;
  
  // We'll be storing our NFT images on chain as SVGs
  string svgPartOne = '<svg xmlns="http://www.w3.org/2000/svg" width="270" height="270" fill="none"><path fill="url(#B)" d="M0 0h270v270H0z"/><defs><filter id="A" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse" height="270" width="270"><feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity=".225" width="200%" height="200%"/></filter></defs><path d="M72.863 42.949c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-10.081 6.032-6.85 3.934-10.081 6.032c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-8.013-4.721a4.52 4.52 0 0 1-1.589-1.616c-.384-.665-.594-1.418-.608-2.187v-9.31c-.013-.775.185-1.538.572-2.208a4.25 4.25 0 0 1 1.625-1.595l7.884-4.59c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v6.032l6.85-4.065v-6.032c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595L41.456 24.59c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-14.864 8.655a4.25 4.25 0 0 0-1.625 1.595c-.387.67-.585 1.434-.572 2.208v17.441c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l10.081-5.901 6.85-4.065 10.081-5.901c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v9.311c.013.775-.185 1.538-.572 2.208a4.25 4.25 0 0 1-1.625 1.595l-7.884 4.721c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-7.884-4.59a4.52 4.52 0 0 1-1.589-1.616c-.385-.665-.594-1.418-.608-2.187v-6.032l-6.85 4.065v6.032c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l14.864-8.655c.657-.394 1.204-.95 1.589-1.616s.594-1.418.609-2.187V55.538c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595l-14.993-8.786z" fill="#fff"/><defs><linearGradient id="B" x1="0" y1="0" x2="270" y2="270" gradientUnits="userSpaceOnUse"><stop stop-color="#cb5eee"/><stop offset="1" stop-color="#0cd7e4" stop-opacity=".99"/></linearGradient></defs><text x="32.5" y="231" font-size="27" fill="#fff" filter="url(#A)" font-family="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif" font-weight="bold">';
  string svgPartTwo = '</text></svg>';

  mapping(string => address) public domains;
  mapping(string => string) public records;

  constructor(string memory _tld) payable ERC721("Ninja Name Service", "NNS") {
    tld = _tld;
    console.log("%s name service deployed", _tld);
  }

  function register(string calldata name) public payable {
    require(domains[name] == address(0));

    uint256 _price = price(name);
    require(msg.value >= _price, "Not enough Matic paid");
    
    // Combine the name passed into the function  with the TLD
    string memory _name = string(abi.encodePacked(name, ".", tld));
    // Create the SVG (image) for the NFT with the name
    string memory finalSvg = string(abi.encodePacked(svgPartOne, _name, svgPartTwo));
    uint256 newRecordId = _tokenIds.current();
    uint256 length = StringUtils.strlen(name);
    string memory strLen = Strings.toString(length);

    console.log("Registering %s.%s on the contract with tokenID %d", name, tld, newRecordId);

    // Create the JSON metadata of our NFT. We do this by combining strings and encoding as base64
    string memory json = Base64.encode(
      abi.encodePacked(
        '{"name": "',
        _name,
        '", "description": "A domain on the Ninja name service", "image": "data:image/svg+xml;base64,',
        Base64.encode(bytes(finalSvg)),
        '","length":"',
        strLen,
        '"}'
      )
    );

    string memory finalTokenUri = string( abi.encodePacked("data:application/json;base64,", json));

    console.log("\n--------------------------------------------------------");
    console.log("Final tokenURI", finalTokenUri);
    console.log("--------------------------------------------------------\n");

    _safeMint(msg.sender, newRecordId);
    _setTokenURI(newRecordId, finalTokenUri);
    domains[name] = msg.sender;

    _tokenIds.increment();
  }

  // We still need the price, getAddress, setRecord and getRecord functions, they just don't change
}
```



*注意：我们仍然需要 `price`、`getAddress`、`setRecord` *和* `getRecord` *函数，它们只是没有改变，所以我删除了它们以保持简短。 确保您不要忘记它们！*

这似乎势不可挡。 别担心，年轻的学徒！ 我是你的天行者的克诺比（请不要像电影中那样背叛我）。 让我们从头开始：

```solidity
// We first import some OpenZeppelin Contracts.
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// We import more another help function
import "@openzeppelin/contracts/utils/Base64.sol";

contract Domains is ERC721URIStorage {
```



就像 `StringUtils`一样，我们正在导入现有的合同。这次我们从 OpenZeppelin 导入它们。然后我们在声明域合约时使用“ERC721URIStorage”“继承”它们。您可以在 [此处](https://solidity-by-example.org/inheritance/) 阅读更多关于继承的信息，但基本上，这意味着我们可以从我们的合约中调用其他合约。差不多就是导入函数供我们使用了！

那么我们从中得到了什么？

我们能够使用称为`ERC721` 的标准铸造 NFT，您可以在 [此处](https://eips.ethereum.org/EIPS/eip-721) 阅读更多相关信息。 OpenZeppelin 本质上为我们实现了 NFT 标准，然后让我们在其之上编写自己的逻辑以对其进行自定义。这意味着我们不需要编写样板代码。在不使用库的情况下从头开始编写 HTTP 服务器会很疯狂，对吧？同样——从头开始编写 NFT 合约是很疯狂的！

至于 `Base64`——它有一些由其他人创建的辅助函数，可以帮助我们将用于 NFT 图像的 SVG 和用于其元数据的 JSON 转换为 Solidity 中的 `Base64`。
```solidity
using Counters for Counters.Counter;
Counters.Counter private _tokenIds;
```



接下来，在合同的顶部，您会看到`counters`。 卧槽？ 为什么我们需要一个图书馆来统计东西？ 我们不**需要**一个，最好是导入一个省gas且专为 NFT 打造的。

我们将使用`_tokenIds`来跟踪 NFT 的唯一标识符。 当我们声明 `private _tokenIds` 时，它是一个自动初始化为 0 的数字。

所以，当我们第一次调用 `register` 时，`newRecordId` 是 0。当我们再次运行它时，`newRecordId` 将是 1，以此类推！ 请记住，`_tokenIds` 是一个**状态变量**，这意味着如果我们更改它，该值将直接存储在合约中。
```solidity
constructor(string memory _tld) payable ERC721("Ninja Name Service", "NNS") {
  tld = _tld;
  console.log("%s name service deployed", _tld);
}
```



此时我们告诉我们的合约引入我们想要继承的所有 ERC721 合约信息！ 我们唯一需要提供的是：

- NFT Collection 的名称，我将其命名为`Ninja Name Service`。
- NFT 的 Symbol，我把我的命名为 `NNS`。

这是你闪耀的时刻！ 确保将其更改为您想要的任何内容:)

现在我们要设计我们的 NFT。 这是您的应用程序中非常重要的一部分。 NFT 是每个人都会在他们的钱包和 OpenSea 上看到的东西。 它真的太棒了！ 我们实际上将把我们的 NFT 存储在 Polygon 区块链本身上。 许多 NFT 只是指向图像托管服务的链接。 如果这些服务宕机，你的 NFT 就看不到了！ 通过将其放在区块链上，它变得永久。

为此，我们将使用 SVG——一种用代码构建的图像。 这是带有渐变、ploygon徽标和我们的域文本的方形框的 SVG 代码：

```html
<svg xmlns="http://www.w3.org/2000/svg" width="270" height="270" fill="none">
	<path fill="url(#B)" d="M0 0h270v270H0z"/>
		<defs>
			<filter id="A" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse" height="270" width="270">
				<feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity=".225" width="200%" height="200%"/>
			</filter>
		</defs>
	<path d="M72.863 42.949c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-10.081 6.032-6.85 3.934-10.081 6.032c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-8.013-4.721a4.52 4.52 0 0 1-1.589-1.616c-.384-.665-.594-1.418-.608-2.187v-9.31c-.013-.775.185-1.538.572-2.208a4.25 4.25 0 0 1 1.625-1.595l7.884-4.59c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v6.032l6.85-4.065v-6.032c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595L41.456 24.59c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-14.864 8.655a4.25 4.25 0 0 0-1.625 1.595c-.387.67-.585 1.434-.572 2.208v17.441c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l10.081-5.901 6.85-4.065 10.081-5.901c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v9.311c.013.775-.185 1.538-.572 2.208a4.25 4.25 0 0 1-1.625 1.595l-7.884 4.721c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-7.884-4.59a4.52 4.52 0 0 1-1.589-1.616c-.385-.665-.594-1.418-.608-2.187v-6.032l-6.85 4.065v6.032c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l14.864-8.655c.657-.394 1.204-.95 1.589-1.616s.594-1.418.609-2.187V55.538c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595l-14.993-8.786z" fill="#fff"/>
	<defs>
		<linearGradient id="B" x1="0" y1="0" x2="270" y2="270" gradientUnits="userSpaceOnUse">
			<stop stop-color="#cb5eee"/><stop offset="1" stop-color="#0cd7e4" stop-opacity=".99"/>
		</linearGradient>
	</defs>
	<text x="32.5" y="231" font-size="27" fill="#fff" filter="url(#A)" font-family="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif" font-weight="bold">
		mortal.ninja
	</text>
</svg>
```



有点像 HTML 文件，是吗？ 您不需要知道如何***编写*** SVG。 有很多工具可以让你免费制作它们。 我用 Figma 制作了这个。

前往 [这个](https://www.svgviewer.dev/) 网站并粘贴上面的代码以查看它。 随意摆弄它。

这真的很酷，因为它让我们可以用代码创建**图像**。

SVG 可以定制 **很多。** 您甚至可以为它们制作动画，哈哈。 欢迎在[此处](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial) 阅读更多关于它们的信息。 完成 NFT 后，请确保点击“在 SVGViewer 网站上优化”。 这将压缩它们，使它们适合您的合同。

**看**。 我一直在听真人快打主题曲，所以这就是我最终的 NFT 的样子😎：

![https://i.imgur.com/epYuKfc.png](https://i.imgur.com/epYuKfc.png)



确保自定义您的 SVG！ 也许您想要彩虹表情符号而不是ploygon徽标。 如果你够大胆——你甚至可以试试动画 SVG 👀

请注意**合同有长度限制**！

不要制作超长的极其复杂的 SVG。 ENS 的做法是在注册时使用网络服务器生成 SVG，并将其存储在链下。 你可以做类似的事情！

```solidity
  string svgPartOne = '<svg xmlns="http://www.w3.org/2000/svg" width="270" height="270" fill="none"><path fill="url(#B)" d="M0 0h270v270H0z"/><defs><filter id="A" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse" height="270" width="270"><feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity=".225" width="200%" height="200%"/></filter></defs><path d="M72.863 42.949c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-10.081 6.032-6.85 3.934-10.081 6.032c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-8.013-4.721a4.52 4.52 0 0 1-1.589-1.616c-.384-.665-.594-1.418-.608-2.187v-9.31c-.013-.775.185-1.538.572-2.208a4.25 4.25 0 0 1 1.625-1.595l7.884-4.59c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v6.032l6.85-4.065v-6.032c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595L41.456 24.59c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-14.864 8.655a4.25 4.25 0 0 0-1.625 1.595c-.387.67-.585 1.434-.572 2.208v17.441c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l10.081-5.901 6.85-4.065 10.081-5.901c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v9.311c.013.775-.185 1.538-.572 2.208a4.25 4.25 0 0 1-1.625 1.595l-7.884 4.721c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-7.884-4.59a4.52 4.52 0 0 1-1.589-1.616c-.385-.665-.594-1.418-.608-2.187v-6.032l-6.85 4.065v6.032c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l14.864-8.655c.657-.394 1.204-.95 1.589-1.616s.594-1.418.609-2.187V55.538c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595l-14.993-8.786z" fill="#fff"/><defs><linearGradient id="B" x1="0" y1="0" x2="270" y2="270" gradientUnits="userSpaceOnUse"><stop stop-color="#cb5eee"/><stop offset="1" stop-color="#0cd7e4" stop-opacity=".99"/></linearGradient></defs><text x="32.5" y="231" font-size="27" fill="#fff" filter="url(#A)" font-family="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif" font-weight="bold">';
  string svgPartTwo = '</text></svg>';
```



这看起来有点好笑。 基本上，我们在这里所做的就是基于我们的域创建一个 SVG。 我们将 SVG 分成两部分，并将我们的域放在它们之间。

```solidity
string memory _name = string(abi.encodePacked(name, ".", tld));
string memory finalSvg = string(abi.encodePacked(svgPartOne, _name, svgPartTwo));
```



让我们快速看一下这个 `abi.encodePacked` 东西。

还记得我说过 Solidity 中的字符串很奇怪吗？ 好吧，你也不能直接组合字符串。 相反，您必须使用 `encodePacked` 函数将一堆字符串转换为字节，然后将它们组合起来！

```jsx
string(abi.encodePacked(svgPartOne, _name, svgPartTwo))
```



这是我们实际将 SVG 代码与我们的域结合起来的神奇线路。 这就像做`<svg>my domain</svg>`。 一旦你看到这个合同运行，这将更有意义！

现在我们有一个不全面的资产来展示我们的域，让我们更深入地研究 register 函数，看看我们的元数据是如何构建的。
```solidity
function register(string calldata name) public payable {
  require(domains[name] == address(0));

  uint256 _price = price(name);
  require(msg.value >= _price, "Not enough Matic paid");
  
  string memory _name = string(abi.encodePacked(name, ".", tld));
  string memory finalSvg = string(abi.encodePacked(svgPartOne, _name, svgPartTwo));
  uint256 newRecordId = _tokenIds.current();
  uint256 length = StringUtils.strlen(name);
  string memory strLen = Strings.toString(length);

  console.log("Registering %s on the contract with tokenID %d", name, newRecordId);

  string memory json = Base64.encode(
    abi.encodePacked(
        '{"name": "',
        _name,
        '", "description": "A domain on the Ninja name service", "image": "data:image/svg+xml;base64,',
        Base64.encode(bytes(finalSvg)),
        '","length":"',
        strLen,
        '"}'
    )
  );

  string memory finalTokenUri = string( abi.encodePacked("data:application/json;base64,", json));
    
  console.log("\n--------------------------------------------------------");
  console.log("Final tokenURI", finalTokenUri);
  console.log("--------------------------------------------------------\n");

  _safeMint(msg.sender, newRecordId);
  _setTokenURI(newRecordId, finalTokenUri);
  domains[name] = msg.sender;

  _tokenIds.increment();
}
```



你其实已经知道一半了！ 我们唯一没有涉及的是 `_tokenIds` 和 `json` 的使用。

对于“json”——NFT 使用 JSON 来存储名称、描述、属性和媒体等详细信息。 我们用 `json` 做的是将字符串与 `abi.encodePacked` 结合起来生成一个 JSON 对象。 然后我们将其编码为 Base64 字符串，然后再将其设置为令牌 URI。

关于`_tokenIds`，你只需要知道它是一个让我们访问和设置 NFT 唯一代币编号的对象。 每个 NFT 都有一个唯一的`id`，这有助于我们确保这一点。 下面两行是真正创造我们 NFT 的神奇线条。

```jsx
// Mint the NFT to newRecordId
_safeMint(msg.sender, newRecordId);

// Set the NFTs data -- in this case the JSON blob w/ our domain's info!
_setTokenURI(newRecordId, finalTokenUri);
```



我添加了一个控制台日志，它将 `finalTokenUri` 打印到控制台。 如果您将其中一个 `data:application/json;base64` blob 放入浏览器地址栏，您将看到所有 JSON 元数据！

### 🥸 在本地创建一个 NFT 域

天啊。 我们准备好运行我们的合约了！ 一切似乎都是为了让我们生成一个辛辣的域 NFT 并将其铸造在我们的本地区块链上！

您只需运行`npx hardhat run scripts/run.js`即可开始。 最大的不同是控制台输出的内容。 这是我的样子（我缩短了这个屏幕截图的 URI）：
![https://i.imgur.com/nOpI3oD.png](https://i.imgur.com/nOpI3oD.png)


如果您复制`tokenURI`并将其粘贴到浏览器中，您将看到一个 JSON 对象。 如果您将图像 blob 粘贴到另一个选项卡中的 JSON 对象中，您将获得 NFT 图像！

![https://i.imgur.com/UDQC0Wn.png](https://i.imgur.com/UDQC0Wn.png)



### 🚨进度报告

喘口气。

拍拍自己的背。

您刚刚创建了一个域服务。

并且您正在链上动态生成 SVGS。

您正在 POLYGON 上获取付款。

**这是很难的事情。 干得好！**

在#progress 中发布你很棒的自定义 NFT 域的屏幕截图，甚至可以在推特上发布，向人们展示你在做什么——一定要标记`@_buildspace`，`@bitcoinmaobuyi`(译者)；）