
### 🙉 关于 github 的注释

**如果上传到 Github，请不要将带有私钥的hardhat配置文件上传到您的存储库。 你会被抢劫。**

我为此使用 dotenv。

```bash
npm install --save dotenv
```

```solidity
require('@nomiclabs/hardhat-waffle');
require('dotenv').config();

module.exports = {
  solidity: '0.8.10',
  networks: {
    mumbai: {
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



你的.env文件看起来应该是这样

```
STAGING_QUICKNODE_KEY=BLAHBLAH
PROD_QUICKNODE_KEY=BLAHBLAH
PRIVATE_KEY=BLAHBLAH
```



（不要在此 lol 之后提交你的 `.env`，确保它在你的 `.gitignore` 文件中）。

还记得我们之前对 `.gitignore` 所做的更改吗？您现在可以通过删除`hardhat.config.js` 行来恢复它，因为现在该文件只包含代表您的密钥的变量，而不是您的实际密钥信息。

### 🌎 使用 IPFS 升级你的不朽域 NFT

想想你的 NFT 资产现在实际存储在哪里。他们在以太坊区块链上！出于很多原因，这很棒，但它有一些问题。主要是，它**非常昂贵**，因为以太坊上的存储成本很高。合约也有长度限制，所以如果你制作了一个非常长的非常花哨的动画 SVG，它将不适合合同。

幸运的是，我们有一个叫做 [IPFS](https://en.wikipedia.org/wiki/InterPlanetary_File_System) 的东西，它本质上是一个分布式文件系统。今天 — 您可能会使用 S3 或 GCP 存储之类的东西。但是，在这种情况下，我们可以简单地信任由使用网络的陌生人运行的 IPFS。尽可能快速阅读 [this](https://decrypt.co/resources/how-to-use-ipfs-the-backbone-of-web3)！涵盖了很多很好的基础知识:)。真的，你只需要知道 IPFS 是存储 NFT 资产的行业标准。它是不可变的、永久的和去中心化的。

使用它非常简单。您需要做的就是将您的 NFT 上传到 IPFS，然后使用它在您的合同中返回给您的唯一内容 ID 哈希，而不是 Imgur URL 或 SVG 数据。

首先，您需要将图像上传到专门从事“[固定](https://docs.ipfs.io/how-to/pin-files/)”的服务——这意味着您的文件基本上会被缓存所以它很容易检索。我喜欢使用 [**Pinata**](https://www.pinata.cloud/?utm_source=buildspace) 作为我的固定服务——它们免费为您提供 1 GB 的存储空间，足以容纳 1000 个资产。只需创建一个帐户，通过他们的 UI 上传您角色的图像文件，就是这样！
![Untitled](https://i.imgur.com/lTpmIIj.png)



继续并复制文件“CID”。 这是IPFS上的文件内容地址！ 现在很棒的是我们可以创建这个链接：
```javascript
https://cloudflare-ipfs.com/ipfs/INSERT_YOUR_CID_HERE
```



如果您使用的是 **Brave 浏览器**（内置 IPFS），您只需将此粘贴输入 URL：
```javascript
ipfs://INSERT_YOUR_CID_HERE
```


这实际上会在您的本地计算机上启动一个 IPFS 节点并检索文件！ 如果您尝试在 Chrome 之类的东西上执行此操作，它只会执行 Google 搜索，哈哈。 相反，您必须使用`cloudflare-ipfs`链接。

![Untitled](https://i.imgur.com/qaKTEgb.png)



从这里开始，我们只需要更新我们的 `tokenURI` 函数来添加 `ipfs://`。 基本上，OpenSea 喜欢我们的图像 URI 结构如下：`ipfs://INSERT_YOUR_CID_HERE`。

您的 `_setTokenURI` 函数应该如下所示：
```javascript
_setTokenURI(newDomainId, "ipfs://INSERT_YOUR_CID_HERE")
```



现在您知道如何使用 IPFS 了！不过我们的场景中有一个陷阱——我们在链上动态生成 SVG 代码。您无法从合同内部将资产上传到 IPFS，因此您必须在浏览器或专用服务器中生成 SVG，将它们上传到 IPFS，并将 CID 作为字符串传递到您的 mint 函数中。

我只是想把这个留给你去探索，但是，有时你不想将你的 NFT 存储在链上。也许你想拥有一个视频作为域的 NFT。由于gas费，在链上进行会非常昂贵。

请记住，NFT 在一天结束时只是一个链接到某些元数据的 JSON 文件。您可以将此 JSON 文件放在 IPFS 上。您还可以将 NFT 数据本身（例如图像、视频等）放在 IPFS 上。不要让它过于复杂 :)。

**很大一部分 NFT 使用 IPFS。这是当今存储 NFT 数据最流行的方式。**

我会留给你探索！ ;)

### 🚀 部署到世界

部署 React 应用程序变得如此简单，现在没有理由不这样做，哈哈。另外，它是**免费的**。您已经做到了这一点，部署是最后一步。另外——一定不能剥夺您在 buildspace 的建设者伙伴们的宝贵域名！！请给我们机会给你测试网钱嘿嘿。

这是 Farza 制作的关于通过 Vercel 进行部署的快速视频。如果您不想使用 Vercel，那也没关系。使用任何你想要的。

基本上：

- 将你最新的前端代码推送到 Github。不要提交 `.env`。
- 将 Vercel 连接到您的存储库。
- 确保将根目录设置为 `app`。
- 添加您的 `.env` 变量（因为我们不会提交我们的 `.env` 文件）。
- 部署。
- 完毕。

注意：在 Vercel 上，您需要添加一个额外的环境变量 `CI=false`。这将确保我们的构建不会因为警告而失败。

[Loom](https://www.loom.com/share/ce89a285b90a4b34ac358fce9ae7f92d)

![https://i.imgur.com/wn2Uhj4.png](https://i.imgur.com/wn2Uhj4.png)



### 🌈出发前

转到 Discord 中的#**showcase** 并给我们一个指向您的最终产品的链接，我们可以处理它:)。

此外，您应该完全发布您的最终项目并向世界展示您的史诗般的创作！ 无论如何，你所做的并不容易。 甚至可以制作一个小视频来展示您的项目并将其附加到推文中。 让你的推文看起来漂亮并炫耀！

如果您愿意，请标记`@_buildspace`和`@bitcoinmaobuyi`（译者） :)。 **每当我们看到人们交付他们的项目时，它都会给我们很大的动力**。另外，您可以激励其他人进入 web3。

请给我们多巴胺打击。

最后，如果您在#feedback 中告诉我们您如何喜欢这个项目以及项目的结构，那就太棒了。 你最喜欢建筑空间的什么？ 什么糟透了？ 我们希望我们为未来的项目做出哪些改变？ 你的反馈会很棒！

回头见！！！