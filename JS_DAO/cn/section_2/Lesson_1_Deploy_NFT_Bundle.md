### 🍪 开始使用 thirdweb

真神奇！ 现在我们可以连接到用户的钱包，这意味着我们可以查看他们是否是我们的 DAO 成员！ 为了加入我们的 DAO，用户需要持有一个会员 NFT。 如果他们没有 NFT，我们会提示他们去铸造一个 NFT 并加入我们的 DAO！

但是，有一个问题。 为了让他们铸造 NFT，我们需要编写并部署我们的 NFT 智能合约。 **这实际上正是 ThirdWeb 作用之处。**

ThirdWeb 是一整套开源工具，可以在不编写任何 Solidity 代码的情况下创建所有智能合约。

不用 Solidity， 我们需要使用 JavaScript 编写脚本来创建和部署我们的合约。 Thirdweb 将使用他们在 [此处](https://github.com/thirdweb-dev/contracts) 创建的一套安全、标准的合约样板。 **最酷的部分是在您创建合约后，合约的所有权是你的并且可以与钱包连接。**

一旦部署了合约，就可以使用它们的客户端 SDK 从前端轻松地与这些合约交互。

相对于自己编写 Solidity 代码，使用 Thirdweb 创建智能合约是非常容易的，感觉就像与普通后端库交互一样。 让我们开始吧：

[Thirdweb 仪表板](https://thirdweb.com/dashboard?utm_source=buildspace) 让我们无需编写任何代码即可创建合约，但在本教程中，我们将使用 JavaScript 构建它们。

重要的是： **Thirdweb 没有数据库，你所有的数据都存储在链上。**

### 📝创建一个运行 Thirdwe b脚本的位置

现在，我们需要实际编写一些脚本，使用 thirdweb 将合约创建/部署到 Goerli。我们要做的第一件事是在项目的根目录中创建一个包含如下代码的 `.env` 文件。

```plaintext
PRIVATE_KEY=YOUR_PRIVATE_KEY_HERE
WALLET_ADDRESS=YOUR_WALLET_ADDRESS
QUICKNODE_API_URL=YOUR_QUICKNODE_API_URL
```

*注意：在 Replit 上？你需要查看[这个](https://docs.replit.com/programming-ide/storing-sensitive-information-environment-variables) 文档获取信息。 基本上，`.env` 文件在Replit上不起作用。您应该使用此方法逐个添加具有相同名称的变量。完成后，您将需要通过停止/运行 repo 来启动 Replit，以便它获取新的env变量*

Thirdweb 需要所有这些东西来代表您部署合约。 他们没有存储任何东西，所有东西都保存在本地的 `.env` 文件中。 **不要将你的 `.env` 文件上传到 Github。 你会被黑。 当心。**

要从 Metamask 获取私钥，请查看 [这个](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key)。

要获取您的钱包地址，请检查[这个](https://metamask.zendesk.com/hc/en-us/articles/360015289512-How-to-copy-your-MetaMask-account-public-address-)。

### 🚀 QuickNode

最后我们需要`.env` 文件中的 `QUICKNODE_API_URL`。

QuickNode 本质上帮助我们广播我们的合约创建交易，以便它可以尽快被测试网上的矿工接收。 一旦交易被挖掘，它就会作为合法交易广播到区块链。 从那里，每个人都更新他们的区块链副本。

因此，在[此处](https://www.quicknode.com/?utm_source=buildspace&utm_campaign=generic&utm_content=sign-up&utm_medium=buildspace) 注册一个帐户。

观看下面的视频，了解如何获取 **testnet** 的 API 密钥！ 不要忘了创建一个主网密钥，**我们需要一个测试网密钥。**

[LOOM](https://www.loom.com/share/bdbe5470b4b745819782f6727ba60baa)

现在，`.env` 文件中三个条目你应该都已经找到答案了！

### 🥳 初始化 SDK

转到 `scripts/1-initialize-sdk.js`文件：

```jsx
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

// Importing and configuring our .env file that we use to securely store our environment variables
import dotenv from "dotenv";
dotenv.config();

// Some quick checks to make sure our .env is working.
if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY === "") {
  console.log("🛑 Private key not found.");
}

if (!process.env.QUICKNODE_API_URL || process.env.QUICKNODE_API_URL === "") {
  console.log("🛑 QuickNode API URL not found.");
}

if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS === "") {
  console.log("🛑 Wallet Address not found.");
}

const sdk = ThirdwebSDK.fromPrivateKey(
  // Your wallet private key. ALWAYS KEEP THIS PRIVATE, DO NOT SHARE IT WITH ANYONE, add it to your .env file and do not commit that file to github!
  process.env.PRIVATE_KEY,
  // RPC URL, we'll use our QuickNode API URL from our .env file.
  process.env.QUICKNODE_API_URL
);

(async () => {
  try {
    const address = await sdk.getSigner().getAddress();
    console.log("👋 SDK initialized by address:", address)
  } catch (err) {
    console.error("Failed to get apps from the sdk", err);
    process.exit(1);
  }
})();

// We are exporting the initialized thirdweb SDK so that we can use it in our other scripts
export default sdk;
```
为了确保我们的 sdk 初始化正确！

在执行该函数之前，请确保您已安装 Node 16+，您可以使用以下命令检查您的版本：

```plaintext
node -v
```
*注意：如果您使用的是 Replit，您实际上可以从它提供的 shell 运行脚本：*

如果您有旧版本的 Node，可以在[此处](https://nodejs.org/en/) 进行更新。 （下载 LTS 版本）

*注意：如果你在 Replit 上，你实际上可以通过从 shell 运行它来更新节点版本：*

```plaintext
npm init -y && npm i --save-dev node@17 && npm config set prefix=$(pwd)/node_modules/node && export PATH=$(pwd)/node_modules/node/bin:$PATH
```

让我们执行吧！ 转到您的终端并粘贴以下命令：

```plaintext
node scripts/1-initialize-sdk.js
```

下面是运行脚本时得到的结果：

```plaintext
buildspace-dao-starter % node scripts/1-initialize-sdk.js
👋 SDK initialized by address: 0xF11D6862e655b5F4e8f62E00471261D2f9c7E380
```

*注意：您可能还会看到一些随机警告，例如 “ExperimentalWarning” ，请确保输出的是 app 地址！*

Amazing！ 如果你看到它输出的是你的钱包地址，那就意味着一切都已初始化！

### 🧨 创建一个 ERC-1155 集合

我们现在要做的是创建并部署一个 ERC-1155 合约到 Goerli。 这基本上是我们创建 NFT 所需的基本模块。 **我们还没有在这里创建我们的NFT。我们只是围绕集合本身设置元数据。** 这类似于集合的名称(例如CryptoPunks)和与集合相关联的图像，在 OpenSea 上显示为标题。

*注意：您可能知道 ERC-721，其中每个 NFT 都是独一无二的，即使它们具有相同的图像、名称和属性。 使用 ERC-1155，多个人可以持有同一个 NFT 。 在这种情况下，我们的“会员 NFT”对每个人都是一样的，因此我们不必每次都创建一个新的 NFT，而是可以简单地将相同的 NFT 分配给我们所有的会员。 这也更省 gas！ 对于所有人持有同一 NFT 的情况，这是一种非常常见的做法。*

转到 `scripts/2-deploy-drop.js` 并添加以下代码：

```jsx
import { AddressZero } from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

(async () => {
  try {
    const editionDropAddress = await sdk.deployer.deployEditionDrop({
      // The collection's name, ex. CryptoPunks
      name: "NarutoDAO Membership",
      // A description for the collection.
      description: "A DAO for fans of Naruto.",
      // The image that will be held on our NFT! The fun part :).
      image: readFileSync("scripts/assets/naruto.png"),
      // We need to pass in the address of the person who will be receiving the proceeds from sales of nfts in the contract.
      // We're planning on not charging people for the drop, so we'll pass in the 0x0 address
      // you can set this to your own wallet address if you want to charge for the drop.
      primary_sale_recipient: AddressZero,
    });

    // this initialization returns the address of our contract
    // we use this to initialize the contract on the thirdweb sdk
    const editionDrop = await sdk.getContract(editionDropAddress, "edition-drop");

    // with this, we can get the metadata of our contract
    const metadata = await editionDrop.metadata.get();

    console.log(
      "✅ Successfully deployed editionDrop contract, address:",
      editionDropAddress,
    );
    console.log("✅ editionDrop metadata:", metadata);
  } catch (error) {
    console.log("failed to deploy editionDrop contract", error);
  }
})();
```

一个非常简单的脚本！

我们给我们的集合赋予一个 `name`，`description`， `primary_sale_recipient`和 `image`。我们从本地文件加载的 `图片`，所以确保图片上传到 `scripts/assets`下。现在要确保它是PNG, JPG或GIF，并确保它是本地图像-如果你使用互联网链接，这将不起作用!

当我运行 `node scripts/2-deploy-drop`命令时， 会输出：

```plaintext
buildspace-dao-starter % node scripts/2-deploy-drop.js
👋 SDK initialized by address: 0xF11D6862e655b5F4e8f62E00471261D2f9c7E380
✅ Successfully deployed editionDrop contract, address: 0xE56fb4F83A9a99E40Af1C7eF08643e7bf1259A95
✅ editionDrop metadata: {
  name: 'NarutoDAO Membership',
  description: 'A DAO for fans of Naruto.',
  image: 'https://gateway.ipfscdn.io/ipfs/QmYTQFY2W1K7ucd9GgidKkLL37yJB9sqPGmUqfJiURETxQ/0',
  seller_fee_basis_points: 0,
  fee_recipient: '0x0000000000000000000000000000000000000000',
  merkle: {},
  symbol: ''
}
```

好吧，刚才发生的事真是太不可思议了，发生了两件事:

**第一，我们刚刚向 Goerli 部署了一个[ERC-1155](https://docs.openzeppelin.com/contracts/3.x/erc1155)合约。**如果你登录 https://goerli.etherscan。然后粘贴到 `editionDrop` 合约的地址，你会看到你刚刚部署了一个智能合约!最酷的部分是你**拥有**这个合约，它通过**你的**钱包部署。“发送人”地址是**您的**公共地址。

*注意:保存好你的 `editionDrop` 地址，我们以后会用到它!*，如果你丢失了它，你可以随时从[Thirdweb仪表盘](https://thirdweb.com/dashboard?utm_source=buildspace)检索。

![Untitled](https://i.imgur.com/suqHbB4.png)

漂亮!! 一个仅使用 javascript 部署的自定义合约。您可以在[这里](https://github.com/thirdweb-dev/contracts/blob/main/contracts/drop/DropERC1155.sol)。看到 Thirdweb 部署的合约代码。

**我们在这里做的另一件事是 Thirdweb 会自动将我们集合的图像上传到 IPFS。** 你会看到一个以 https://gateway.ipfscdn.io 开头的链接被输出。 如果将其粘贴到浏览器中，您将看到您的 NFT 图像正在通过 CloudFlare 从 IPFS 检索！

您甚至可以使用 `ipfs://` URI 直接访问 IPFS（注意 — 无法在 Chrome 上运行，因为您需要运行 IPFS 节点，但可以在 Brave 上运行，它会为您做到这一点！）

*注意：IPFS 基本上是一个去中心化存储系统，请在 [此处](https://docs.ipfs.io/concepts/what-is-ipfs/) 阅读更多信息！*

如果你以前在 Solidity 中开发过自定义智能合约，这有点令人兴奋。我们已经在 Goerli 上部署了一个智能合约，并将数据托管到 IPFS 上。接下来，我们要创建我们真正的 nft !

### 🚨 进度报告

*请一定记得报告，否则 Farza 会很伤心的  :(.*

在 `#progress` 频道中分享 Etherscan 的屏幕截图，展示您已部署的合约。






