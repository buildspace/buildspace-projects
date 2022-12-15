### 🙉 关于Github 小提示

**如果你将代码上传到Github，不要上传你的 `hardhat config`配置文件与你的私钥到你的仓库。你可能会被盗。**

所以我们一般用dotenv：
```bash
npm install --save dotenv
```

```javascript
require('@nomiclabs/hardhat-waffle');
require('dotenv').config();

module.exports = {
  solidity: '0.8.1',
  networks: {
    goerli: {
      url: process.env.STAGING_QUICKNODE_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
    mainnet: {
      chainId: 1,
      url: process.env.PROD_QUICKNODE_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
```

然后你的`.env` 文件看起来应该像这样：
```plaintext
STAGING_QUICKNODE_KEY=BLAHBLAH
PROD_QUICKNODE_KEY=BLAHBLAH
PRIVATE_KEY=BLAHBLAH
```

（不要提交你的`.env` 文件，确保它在你的 `.gitignore` 文件中）。

还记得我们之前对 `.gitignore` 所做的修改吗？ 您现在可以通过删除 `hardhat.config.js` 行来恢复它，因为现在该文件只包含代表您的秘钥的变量，而不掌握您真正的秘钥信息。

### 🌎 用 IPFS 升级你的 NFT

想想你的 NFT 资产现在实际存储在哪里。 他们在以太坊区块链上！ 出于很多原因，这很不错，但它有一些问题。 主要是，它**非常昂贵**，因为以太坊上的存储成本很高。 合约也有长度限制，所以如果你制作了一个非常长的非常花哨的动画 SVG，它不适合存储在合约上。

幸运的是，我们有一个叫做 [IPFS](https://en.wikipedia.org/wiki/InterPlanetary_File_System) 的软件，它本质上是一个分布式文件系统。 今天 — 您可能会使用 S3 或 GCP 存储之类的东西。 但是，在这种情况下，我们可以简单地信任由使用网络的陌生人运行的 IPFS。 尽可能快速阅读 [这里](https://decrypt.co/resources/how-to-use-ipfs-the-backbone-of-web3)涵盖了很多基础知识:)。 真的，你只需要知道 IPFS 是存储 NFT 资产的行业标准。 它是不可变的、永久的和去中心化的。

它的使用非常简单。 您需要做的就是将您的 NFT 上传到 IPFS，然后使用它在您的合约中返回给您的唯一内容 ID 哈希，而不是 Imgur URL 或 SVG 数据。

首先，您需要将图像上传到专门从事“[pinning](https://docs.ipfs.io/how-to/pin-files/)”的服务——这意味着您的文件基本上会被缓存，所以它很容易检索。 我喜欢使用 [**Pinata**](https://www.pinata.cloud/?utm_source=buildspace) 作为我的pinning服务——它们免费为您提供 1 GB 的存储空间，足以容纳 1000 个 NFT 资产。 只需创建一个帐户，通过他们的 UI 上传您角色的图像文件，像这样！

![](https://i.imgur.com/lTpmIIj.png)

继续并复制“CID”文件。 这是文件在 IPFS 上的内容地址！ 现在很棒的是我们可以创建这个链接：
```javascript
https://cloudflare-ipfs.com/ipfs/你的cid
```
如果您使用的是 **Brave 浏览器**（内置 IPFS），您只需将此粘贴到 URL输入框：
```javascript
ipfs://你的cid
```

这实际上会在您的本地计算机上启动一个 IPFS 节点并检索文件！ 如果您尝试在 Chrome 之类的浏览器上执行此操作，它只会执行 Google 搜索，哈哈。 相反，您必须使用“cloudflare-ipfs”链接。
![](https://i.imgur.com/tWHtVbO.png)

从这里开始，我们只需要更新我们的 `tokenURI` 函数来添加 `ipfs://`。 基本上，OpenSea 喜欢我们的图像 URI 结构如下：`ipfs://你的cid`。

您的 `_setTokenURI` 函数应该如下所示：
```javascript
_setTokenURI(newItemId, "ipfs://你的cid")
```

现在您知道如何使用 IPFS 了！ 不过我们的场景中有一个陷阱——我们在链上动态生成的 SVG 代码。 您无法从合约内部将资产上传到 IPFS，因此您必须在浏览器或专用服务器中生成 SVG，将它们上传到 IPFS，并将 CID 作为字符串传递到您的 mint 函数中。

我想把这个留给你自己去探索，但是，有时你不想将你的 NFT 存储在链上。 也许您想将视频作为 NFT。 由于gas费，在链上进行会非常昂贵。

记住，NFT只是一个JSON文件，它链接到一些元数据。你可以把这个JSON文件放到IPFS上，你也可以把NFT数据本身(如图像、视频等)放到IPFS上。不要过于复杂:)。

**目前，大部分 NFT 使用 IPFS存储。 这是当今存储 NFT 数据最流行的方式。**

当然，我还是想留给你自己去探索这些！ ;)

### 📝 在 Etherscan 上验证合约

你知道我们可以向外部世界展示你的智能合约源代码吗？ 这样做将使您的逻辑真正透明。 这很符合区块链透明的精神。 每个希望在区块链上与您的智能合约进行交互的人都可以首先查看合约逻辑！ 为此，Etherscan 具有**验证合约**功能。[此处](https://goerli.etherscan.io/address/0x902ebbecafc54f7a8013a9d7954e7355309b50e6#code) 是经过验证的合约的示例。 请自行检查智能合约。

如果您在 Etherscan 中选择 **Contract** 选项卡，您会注意到一长串从 `0x608060405234801...` 开始的文本字符 嗯..那是什么🤔？
![图片](https://user-images.githubusercontent.com/60590919/139609052-f4bba83c-f224-44b1-be74-de8eaf31b403.png)

事实证明，这一长串乱七八糟的字符实际上是您部署的合约字节码！字节码代表 EVM 中的一系列操作码，它们将为我们在链上执行指令。

这里有很多需要理解的新信息，所以如果现在没有多大意义，请不要担心。 花点时间了解一下字节码和 EVM 的含义！ 使用 Google 或在 Discord 上的 `#general-chill-chat` 联系我们:)。 [这里有一篇很酷的文章](https://ethervm.io/) 可以帮你了解 EVM 操作码🤘。

所以，我们知道字节码对我们来说是不可读的。 我们希望能够在 Etherscan 中看到我们编写的代码。 幸运的是，Etherscan 有帮我们实现这一点的魔力！

请注意，有一个提示要求我们**验证并发布**我们的合同源代码。 如果我们点击链接，我们需要手动选择我们的合同设置并粘贴我们的代码以发布我们的源代码。

幸运的是，hardhat 提供了一种更聪明的方法来做到这一点。

回到您的 hardhat 项目并通过运行以下命令安装 `@nomiclabs/hardhat-etherscan`：
```
npm i -D @nomiclabs/hardhat-etherscan
```

然后在 `hardhat.config.js` 中添加以下内容:
```javascript
require("@nomiclabs/hardhat-etherscan");

// Rest of code
...

module.exports = {
  solidity: "0.8.17",

  // Rest of the config
  ...,
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: "",
  }
};
```

我们就快成功了！您可能已经注意到我们配置中的“etherscan”对象需要一个“apiKey”！这意味着您需要一个 Etherscan 帐户才能获得此密钥。

如果您还没有帐户，请前往[https://etherscan.io/register](https://etherscan.io/register) 注册一个免费帐户。 之后前往您的个人资料设置并在 `API-KEYs` 下创建一个新的 `apikey`。
![image](https://user-images.githubusercontent.com/60590919/139610459-b590bbc1-0d4e-4e78-920b-c45e61bf2d7e.png)

太好了，当你拿到 API 密钥。 是时候回到您的 `hardhat.config.js` 文件并将 `apiKey`属性更改为您新生成的密钥了。

***注意：不要与他人分享您的 Etherscan api 密钥***

我保证，我们已经走到最后一步了。 现在剩下的就是运行下方命令：
```
npx hardhat verify YOUR_CONTRACT_ADDRESS --network goerli 
```

如果一切顺利，您应该会在终端中看到一些输出内容。 看起来像我的这样：
![图片](https://user-images.githubusercontent.com/60590919/139611432-16d8c3fc-04b1-44c8-b58a-27f49e94d492.png)

通过终端中返回的链接返回 Goerli Etherscan 中的合约页面，您会注意到 Etherscan 神奇地（在您的帮助下）将字节码转换为更易读的 Solidity 代码。
![图片](https://user-images.githubusercontent.com/60590919/139611635-3d1d7aae-8bb8-47f5-9396-6a4544badebf.png)

现在每个人都可以看到您的智能合约有多棒了！

等等，还有更多。 现在有两个新的子选项卡 `Read Contract”和“Write Contract` ，我们可以使用它们与链上的智能合约即时交互。看起来挺简洁的！
![图片](https://user-images.githubusercontent.com/60590919/139611805-b2a41039-ec79-402d-b198-4936d25ff277.png)

### 😍 成功了

超级令人兴奋，你能一步步跟着走到最后。

在您启动之前，如果您愿意，请务必遵循上一课程来给 UI 做最后润色。 这些真的很重要。 准备就绪后，在 `#showcase`频道中发布项目链接。 你的朋友们将是第一个铸造你的 NFT 的人！

感谢您通过学习这些东西为 web3 的未来做出贡献。 事实上，您知道它是如何工作的以及如何对其进行编码是一种超能力。 希望你能善用你的知识;)。

### 🔮 让你的项目更进一步！

你在这个项目中学到的只是一个开始！ 您可以使用 NFT 和智能合约做更多的事情，这里有一些您可以进一步研究的示例 ✨

- **卖掉你的 NFTs** - 现在你的用户只需要支付 gas 费来铸造你的 nfts 而你不会得到任何钱！ 有几种方法可以改变你的智能合约，让用户支付你的钱来铸造你的 nft，比如在你的合约中添加```payable```，并使用```require```来设置最低金额。 由于您这里涉及到真正的 $eth ，因此最好仔细研究并询问专业人士您的代码是否安全。 OpenZeppelin 有一个论坛，您可以在 [这里！](https://forum.openzeppelin.com/t/implementation-of-sellable-nft/5517/) 提出这些问题。

- **添加版税** - 您还可以将版税添加到您的智能合约中，这将使您在未来每次 NFT 销售中获得一定比例版税！ 在这里阅读更多相关信息：[EIP-2981：NFT 版税标准](https://eips.ethereum.org/EIPS/eip-2981)
- **在本地测试你的合约** - 如果你想更广泛地测试你的合约而不像 Goerli 这样部署到测试网络，Hardhat 当然可以让你这样做！ 实现这一目标的最佳方法是打开一个单独的终端窗口，导航到您的项目目录，然后运行 ```npx hardhat node``` 并保持该窗口打开！ 就像在项目开始时一样，您会看到一堆带有大量以太币的帐户。 在您的其他终端窗口中，您可以运行您的测试脚本，并观察它对节点窗口的影响!

### 🌈出发前

转到 Discord 中的 `#showcase`频道并向我们展示您的最终产品，以使我们可以随意使用 :)。

此外，你应该发布您的最终完整版项目并向世界展示您的史诗般的创作！ 无论如何，你所做的并不容易。 甚至可以制作一个小视频来展示您的项目并将其附加到推文中。 让你的推文看起来漂亮并酷炫 :)。

如果您愿意，请艾特@_buildspace :)。 我们会转发它。 此外，每当我们看到人们发布他们的项目时，它都会给我们带来极大的动力。

最后，如果您在 `#feedback` 频道中告诉我们您如何喜欢这个项目以及项目的结构，那就太棒了。 你最喜欢buildspace的什么？ 希望我们为未来的项目做出哪些改变？ 你的反馈会很棒！！

回头见！！！





