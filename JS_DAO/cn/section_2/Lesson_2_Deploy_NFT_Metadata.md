### 👾 设置 NFT 数据

好的，现在我们要开始部署与我们的会员 NFT 相关的元数据。 我们之前还没有这样做过。 到目前为止，我们所做的只是创建 ERC-1155 合约并添加一些基本元数据。 我们还没有真正设置我们的 NFT，让我们开始吧！

转到 `scripts/3-config-nft.js` 文件并添加：

```jsx
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

(async () => {
  try {
    const editionDrop = await sdk.getContract("INSERT_EDITION_DROP_ADDRESS", "edition-drop");
    await editionDrop.createBatch([
      {
        name: "Leaf Village Headband",
        description: "This NFT will give you access to NarutoDAO!",
        image: readFileSync("scripts/assets/headband.png"),
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failed to create the new NFT", error);
  }
})();
```

非常简单！

我们要做的第一件事是访问我们的 `editionDrop` 合约，它是一个 ERC-1155类型的合约。 `INSERT_EDITION_DROP_ADDRESS` 是之前步骤输出的地址， 就是 `Successfully deployed editionDrop contract, address`后输出来的地址。
您还可以在 [Thirdweb 仪表板](https://thirdweb.com/dashboard?utm_source=buildspace) 上找到它。 你的 Thirdweb 仪表板将显示你当前正在编辑的合约，它还会显示合约地址，以便你轻松复制和粘贴。

![](https://i.imgur.com/nzvJpQb.png)

然后，我们通过 `createBatch` 在我们的 ERC-1155 上设置我们实际的 NFT。 我们需要设置一些属性：

- **name**： NFT 的名称。
- **description**：对 NFT 的描述
- **image**：我们 NFT 的图像。 这是用户铸造称能够访问您的 DAO 的 NFT 图像。

*请记住，因为这是 ERC-1155 标准 nft，所以我们所有的成员铸造的 NFT 都是一样的。*

请务必将 `image: readFileSync("scripts/assets/headband.png")` 替换为您自己的图像。 和以前一样，确保它是本地图像，因为如果您使用 Internet 链接，这将不起作用。

我正在构建 `NarutoDAO`(火影忍者)，所以，我的成员需要一个 `Leaf Village`(叶村发带) 才能加入！hehe

![](https://i.imgur.com/1F5I12o.png)

发挥你的创意，不要完全模仿我！

一切准备就绪，运行：

```plaintext
node scripts/3-config-nft.js
```

然后将会输出：

```plaintext
👋 SDK initialized by address: 0xF11D6862e655b5F4e8f62E00471261D2f9c7E380
✅ Successfully created a new NFT in the drop!
```

### 😼 设置铸造规则

现在我们需要设置我们的“铸造规则”。 可以铸造的 NFT 的最大数量是多少？ 用户什么时候可以开始铸造 NFT？ 同样，这通常是您需要写入合约的自定义逻辑，但在这种情况下，使用Thirdweb 会它变得简单。

转到 `scripts/4-set-claim-condition.js` 并添加：

```jsx
import sdk from "./1-initialize-sdk.js";
import { MaxUint256 } from "@ethersproject/constants";

(async () => {
  try {
    const editionDrop = await sdk.getContract("INSERT_EDITION_DROP_ADDRESS", "edition-drop");
    // We define our claim conditions, this is an array of objects because
    // we can have multiple phases starting at different times if we want to
    const claimConditions = [{
      // When people are gonna be able to start claiming the NFTs (now)
      startTime: new Date(),
      // The maximum number of NFTs that can be claimed.
      maxClaimable: 50_000,
      // The price of our NFT (free)
      price: 0,
      // The amount of NFTs people can claim in one transaction.
      maxClaimablePerWallet: 1,
      // We set the wait between transactions to unlimited, which means
      // people are only allowed to claim once.
      waitInSeconds: MaxUint256,
    }]

    await editionDrop.claimConditions.set("0", claimConditions);
    console.log("✅ Sucessfully set claim condition!");
  } catch (error) {
    console.error("Failed to set claim condition", error);
  }
})();
```

这里和之前一样，一定要用你的 ERC-1155 合约地址替换 `INSERT_EDITION_DROP_ADDRESS`。

`startTime` 是允许用户开始铸造 NFT 的时间，在这种情况下，我们只需将该日期/时间设置为当前时间，这意味着铸造可以立即开始。

`maxClaimable`是可铸造的 NFT 最大数量。`maxClaimablePerWallet` 是设置一个人可以在一次交易中铸造多少 NFT，我们将其设置为一个，因为我们只希望用户一次铸造一个NFT！在某些情况下，您可能希望一次向用户创建多个NFT（例如，当他们打开一个包含多个 NFTs 的集合时），但在这种情况下，我们只想创建一个NFT。 `price` 是设置我们 NFT 的价格，现在，设置为 0 代表是免费的。`waitInSeconds` 是交易之间的时间间隔，因为我们只希望人们铸造一次，我们将其设置为区块链允许的最大数值。

最后，我们执行 `editionDrop.claimConditions.set("0", claimConditions)`，这实际上会**与我们在链上部署的合约交互**并调整条件，非常酷！ 为什么我们传入一个 `0`？ 好吧，基本上我们的会员 NFT 的 `tokenId` 为 `0`，因为它是我们 ERC-1155 合约中的第一个代币。 请记住——使用 ERC-1155，我们可以让多个人铸造同一个 NFT。 在这种情况下，每个人都会铸造一个 ID 为 `0` 的 NFT。 但是，我们也可以有一个不同的 id,比如 `1`。也许我们可以把 NFT 送给我们 DAO 的杰出成员！ 这一切都取决于我们。

运行 `node scripts/4-set-claim-condition.js` 后，会输出：

```
👋 SDK initialized by address: 0xF11D6862e655b5F4e8f62E00471261D2f9c7E380
✅ Successfully set claim condition!
```

BOOM！ 我们已经成功地与我们部署的智能合约进行了交互，并为我们的 NFT 提供了它必须遵循的某些规则！ 如果您复制粘贴输出的地址并在 https://goerli.etherscan.io/ 上搜索它，您会在那里看到我们与合同进行交互的记录！

![](https://i.imgur.com/6sRMQpA.png)

### 🚨 进度报告

*请一定记得报告，否则 Farza 会伤心的 :(.*

嘿！ 请继续在 `#progress` 频道中分享你的会员 NFT，并告诉我们您为什么选择这个史诗级的 NFT 作为DAO。

