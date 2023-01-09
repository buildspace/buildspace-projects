我们的成员现在有一个 NFT 来巩固自己作为我们 DAO 成员的地位。 更进一步， 让我们创建一个真正“治理代币”来空投给我们的成员。

您可能记得 [此处](https://decrypt.co/85894/ethereum-name-service-market-cap-hits-1-billion-just-days-after-ens-airdrop) 的 ENS DAO 治理代币空投。 这是什么意思呢？ 为什么[现在](https://coinmarketcap.com/currencies/ethereum-name-service/) “治理代币”的市值接近 10 亿美元？

基本上，治理代币允许用户对提案进行投票。 例如，提案可能会是“我希望 Naruto DAO 发送 100,000 $HOKAGE 到钱包地址为 `0xf79a3bb8d5b93686c4068e2a97eaec5fe4843e7d` 的这名杰出成员”。 然后，成员将对其进行投票。

拥有更多治理代币的用户将更加强大。 通常，代币会奖励给带来最大价值的社区成员。

例如，对于 ENS 空投，获得最多代币的是核心开发团队和 Discord 中的活跃用户。 但是，根据您持有 ENS 域的时间长短，您也会收到 ENS DAO 令牌（例如“farza.eth”）。 顺便说一句，如果你还不知道，ENS 其实也是 NFT。

所以，你拥有这个 NFT 的时间越长，你得到的代币就越多。

为什么？ 因为 ENS 团队希望网络的早期支持者得到奖励。 这是他们的计算公式：

![无标题](https://i.imgur.com/syh3F01.png)

我要说清楚，这是自定义公式！ 您的 DAO 也可以自定义公式。 也许你还想根据他们拥有会员 NFT 的时间来更多地奖励你 DAO 中的人， 这完全取决于你。

### 🥵 部署代币合约

让我们创建并部署我们的代币智能合约！ 前往 `scripts/5-deploy-token.js` 并添加：

```jsx
import { AddressZero } from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";

(async () => {
  try {
    // Deploy a standard ERC-20 contract.
    const tokenAddress = await sdk.deployer.deployToken({
      // What's your token's name? Ex. "Ethereum"
      name: "NarutoDAO Governance Token",
      // What's your token's symbol? Ex. "ETH"
      symbol: "HOKAGE",
      // This will be in case we want to sell our token,
      // because we don't, we set it to AddressZero again.
      primary_sale_recipient: AddressZero,
    });
    console.log(
      "✅ Successfully deployed token contract, address:",
      tokenAddress,
    );
  } catch (error) {
    console.error("failed to deploy token contract", error);
  }
})();
```

我们调用 `sdk.deployer.deployToken`，它将为您部署一个标准的 [ERC-20](https://docs.openzeppelin.com/contracts/2.x/api/token/erc20) 代币合约，这是以太坊上所有代币都采用的标准。 你只需要给它你的代币的“名称”和“符号”！ 玩得开心，当然不要完全复制我的。 我希望你正在构建一些你认为很酷的东西！

在这里，我将我的代币标记为 HOKAGE。 如果您不知道那是什么，请查看 [这里](https://naruto.fandom.com/wiki/Hokage) 哈哈。 TLDR：如果您是 Hokage，那么您就是有史以来最好的忍者之一。

顺便说一句——您可以在 [此处](https://github.com/thirdweb-dev/contracts/blob/main/contracts/token/TokenERC20.sol) 查看 thirdweb 使用的确切合约。

运行后， 我们将看到如下输出：

```plaintext
buildspace-dao-starter % node scripts/5-deploy-token.js
👋 SDK initialized by address: 0xF11D6862e655b5F4e8f62E00471261D2f9c7E380
✅ Successfully deployed token contract, address: 0xF93B8AE0a84325D1d7Aa09593DCA3Ad5Fe868eA7
```

BOOM！ 现在我们部署了一个新的代币合约。 如果您前往 [`https://goerli.etherscan.io/`](https://goerli.etherscan.io/) 并搜索代币模块的地址，您将看到刚刚部署的合约。 同样，您会看到它是从**您的钱包**部署的，所以**您拥有该合约权限**。

![无标题](https://i.imgur.com/4tHQ20A.png)

您甚至可以将您的代币作为自定义代币添加到 Metamask。

只需点击“导入代币”：

![无标题](https://i.imgur.com/Bf56dyv.png)

然后，粘贴你的 ERC-20 合约地址，你会看到 Metamask 会神奇地自动抓取你的代币符号：

![无标题](https://i.imgur.com/bbg9nEz.png)

然后，回到你的钱包，向下滚动，然后砰！

![无标题](https://i.imgur.com/yhUdkc3.png)

您现在正式拥有自己的代币了 :)。

### 💸 创建您的代币供应量

现在，**可供人们认领的代币数量为零。** 我们的 ERC-20 合约不会神奇地知道有多少代币可用。 我们必须告诉它！

前往 `6-print-money.js` 并添加：

```jsx
import sdk from "./1-initialize-sdk.js";

(async () => {
  try {
    // This is the address of our ERC-20 contract printed out in the step before.
    const token = await sdk.getContract("INSERT_TOKEN_ADDRESS", "token");
    // What's the max supply you want to set? 1,000,000 is a nice number!
    const amount = 1_000_000;
    // Interact with your deployed ERC-20 contract and mint the tokens!
    await token.mint(amount);
    const totalSupply = await token.totalSupply();

    // Print out how many of our token's are out there now!
    console.log("✅ There now is", totalSupply.displayValue, "$HOKAGE in circulation");
  } catch (error) {
    console.error("Failed to print money", error);
  }
})();
```

请记住，此处插入的地址是您的**代币合约地址**。 如果你输入错误的地址，您可能会收到类似这样的错误：`UNPREDICTABLE_GAS_LIMIT`。

同样，如果您忘记了这个地址，可以参考您的 [thirdweb dashboard](https://thirdweb.com/dashboard?utm_source=buildspace)！ 您现在应该看到代币合约已经弹出！

![图片](https://i.imgur.com/W4PsTzD.png)


所以，这里我们实际上是在铸造代币供应量，并设置我们想要铸造的“数量”，且将其设置为代币的最大供应量。

当我们运行脚本时，将输出：

```plaintext
buildspace-dao-starter % node scripts/6-print-money.js
👋 Your app address is: 0xa002D595189bF9D50D5897C64b6e07BE5bdEe9b8
✅ There now is 1000000.0 $HOKAGE in circulation
```

现在是最神奇的部分。 返回 Etherscan 中的 ERC-20 合约， 您现在会看到您拥有自己的代币跟踪器！

![无标题](https://i.imgur.com/tEJU2oA.png)

继续并单击跟踪器，您将看到所有供应信息以及以下内容：谁持有您的代币，谁在转移代币，以及有多少代币被转移。 您还会在这里看到我们有一个“最大总供应量”。

很酷。 我们用几行 Javascript 完成了这一切。 那太疯狂了。 如果你感到很高兴，你现在真的可以去制作下一个meme 代币。

![无标题](https://i.imgur.com/vmeoTfU.png)

### ✈️空投

空投时间， 现在， 您可能是DAO的唯一成员，这没关系！

打开 `7-airdrop-token.js `并添加以下代码：

```jsx
import sdk from "./1-initialize-sdk.js";

(async () => {
  try {
    // This is the address to our ERC-1155 membership NFT contract.
    const editionDrop = await sdk.getContract("INSERT_EDITION_DROP_ADDRESS", "edition-drop");
    // This is the address to our ERC-20 token contract.
    const token = await sdk.getContract("INSERT_TOKEN_ADDRESS", "token");
    // Grab all the addresses of people who own our membership NFT, which has 
    // a tokenId of 0.
    const walletAddresses = await editionDrop.history.getAllClaimerAddresses(0);

    if (walletAddresses.length === 0) {
      console.log(
        "No NFTs have been claimed yet, maybe get some friends to claim your free NFTs!",
      );
      process.exit(0);
    }

    // Loop through the array of addresses.
    const airdropTargets = walletAddresses.map((address) => {
      // Pick a random # between 1000 and 10000.
      const randomAmount = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);
      console.log("✅ Going to airdrop", randomAmount, "tokens to", address);

      // Set up the target.
      const airdropTarget = {
        toAddress: address,
        amount: randomAmount,
      };

      return airdropTarget;
    });

    // Call transferBatch on all our airdrop targets.
    console.log("🌈 Starting airdrop...");
    await token.transferBatch(airdropTargets);
    console.log("✅ Successfully airdropped tokens to all the holders of the NFT!");
  } catch (err) {
    console.error("Failed to airdrop tokens", err);
  }
})();
```

这里看起来有很多代码。 但是你现在是 thirdweb 专业人士。

首先，您会看到我们同时需要 editionDrop 和 token 合约，因为我们将与这两个合约进行交互。

我们需要首先从“editionDrop”中获取 NFT 的持有者，然后使用“token”合约的函数为他们铸造代币。

我们使用 `getAllClaimerAddresses` 来获取拥有我们的会员 NFT 且令牌 ID `"0"` 的人的所有 `walletAddresses`。

从那里，我们遍历所有的 `walletAddresses` 并选择一个 `randomAmount` 代币空投给每个用户，并将此数据存储在`airdropTarget` 字典中。

最后，我们在我所有的 `airdropTargets` 上运行 `transferBatch`。 而且，就是这样！ `transferBatch` 将自动循环遍历所有地址，并发送代币！

当我们运行脚本后，会得到以下输出：

```plaintext
buildspace-dao-starter % node scripts/7-airdrop-token.js
👋 SDK initialized by address: 0xF11D6862e655b5F4e8f62E00471261D2f9c7E380
✅ Going to airdrop 8761 tokens to 0xF11D6862e655b5F4e8f62E00471261D2f9c7E380
✅ Going to airdrop 9606 tokens to 0x14fb3a9B317612ddc6d6Cc3c907CD9F2Aa091eE7
✅ Going to airdrop 7376 tokens to 0xF79A3bb8d5b93686c4068E2A97eAeC5fE4843E7D
✅ Going to airdrop 9418 tokens to 0xc33817A8e3DD0687FB830666c2658eBBf4696245
✅ Going to airdrop 8311 tokens to 0xe50b229DC4D053b95fA586EBd1874423D9Be5145
✅ Going to airdrop 9603 tokens to 0x7FA42Aa5BF1CA8084f51F3Bab884c3aCB5180C86
🌈 Starting airdrop...
✅ Successfully airdropped tokens to all the holders of the NFT!
```

YOOOO。 我们刚刚做了一个空投！ 在我的示例中，如果有更多成员的加入，请随时再次运行此脚本。

**在现实世界中**，空投通常只发生一次。 但是，我们现在只是随便玩玩，所以没关系。 另外，这个世界没有真正的规则，哈哈。 如果您想每天进行 4 次空投，那就去做吧！

您可以像 ENS 那样创建自己的小空投公式，例如：

![无标题](https://i.imgur.com/IqboZsX.png)

你想——“收到代币的人将对 DAO 拥有更多权力。 这个好吗？ 最大的代币持有者会为 DAO 做正确的事吗？”。 这涉及到非常广泛的代币经济学问题，您可以在 [此处](https://www.google.com/search?q=tokenomics) 阅读相关内容。

好的，现在如果我回到 Etherscan 上的 ERC-20 合约，我可以看到我所有的新代币持有者以及他们拥有多少“$HOKAGE”。

让我们开始吧。

![无标题](https://i.imgur.com/VrM2inr.png)

### 🚨 进度报告

*请一定记得报告，否则 Farza 会很伤心的 :(.*

在 `#progress` 频道中分享该合约在 Etherscan 上的截图，其中显示了您的代币名称、供应量等！

**顺便说一句，如果你做到了这一点并且玩得很开心——也许发推文说你正在构建你自己的 DAO 并艾特 [@_buildspace](https://twitter.com/_buildspace) :)?* *


