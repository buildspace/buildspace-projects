### 😡 撤销角色

如果您还记得的话，您实际上仍然拥有 ERC-20 合约的“铸造”权。 这意味着只要你愿意，你可以去创造更多的代币，这可能会让你的 DAO 成员大吃一惊。 你可以去为自己铸造 10 亿个代币，哈哈。

最好的办法完全撤销您的“铸币”角色。

这样，只有投票合约才能铸造新的代币。 我们可以通过将以下内容添加到 `scripts/11-revoke-roles.js` 来做到这一点：

```jsx
import sdk from "./1-initialize-sdk.js";

(async () => {
  try {
    const token = await sdk.getContract("INSERT_TOKEN_ADDRESS", "token");
    // Log the current roles.
    const allRoles = await token.roles.getAll();

    console.log("👀 Roles that exist right now:", allRoles);

    // Revoke all the superpowers your wallet had over the ERC-20 contract.
    await token.roles.setAll({ admin: [], minter: [] });
    console.log(
      "🎉 Roles after revoking ourselves",
      await token.roles.getAll()
    );
    console.log("✅ Successfully revoked our superpowers from the ERC-20 contract");

  } catch (error) {
    console.error("Failed to revoke ourselves from the DAO trasury", error);
  }
})();
```

当我们运行 `node scripts/11-revoke-roles.js` 时，将会输出:

```plaintext
buildspace-dao-starter % node scripts/11-revoke-roles.js
👀 Roles that exist right now: {
  admin: [ '0xF11D6862e655b5F4e8f62E00471261D2f9c7E380' ],
  minter: [ '0xF11D6862e655b5F4e8f62E00471261D2f9c7E380' ],
  transfer: [
    '0xF11D6862e655b5F4e8f62E00471261D2f9c7E380',
    '0x0000000000000000000000000000000000000000'
  ]
}
🎉 Roles after revoking ourselves {
  admin: [],
  minter: [],
  transfer: [
    '0xF11D6862e655b5F4e8f62E00471261D2f9c7E380',
    '0x0000000000000000000000000000000000000000'
  ]
}
✅ Successfully revoked our superpowers from the ERC-20 contract
```

一开始你可以看到我的地址 `0xF79A3bb8` 对 ERC-20 有很多权限。 所以，在我们运行 `token.roles.setAll({ admin: [], minter: [] })` 之后，您会看到唯一拥有铸币权角色的人是投票合约！

我们现在由管理员接管权限 :)。

你会看到我仍然有 `AddressZero` 与 `transfer` 角色，角色数组中的 `AddressZero` 意味着每个人都可以转移代币（这就是我们想要的）， 我们的地址在那里也并不重要。

### 👍 处理不受支持的网络错误

首先，让我们在 `App.jsx` 的顶部导入最后一个 `useNetwork` 以识别 Goerli 网络外部的连接。 此外，我们正在从 thirdweb SDK 中导入 `ChainId` 以获取 Goerli 的链 ID。

```jsx
import {
  useAddress,
  useNetwork,
  useContract,
  ConnectWallet,
  Web3Button,
  useNFTBalance,
} from '@thirdweb-dev/react';
import { ChainId } from '@thirdweb-dev/sdk';
```

然后，在我们的 `useAddress` 下定义 `useNetwork`：

```jsx
const network = useNetwork();
```

接下来，在`App.jsx` 文件中的 `const memberList =...` 函数下添加以下内容：

```jsx
if (address && (network?.[0].data.chain.id !== ChainId.Goerli)) {
  return (
    <div className="unsupported-network">
      <h2>Please connect to Goerli</h2>
      <p>
        This dapp only works on the Goerli network, please switch networks
        in your connected wallet.
      </p>
    </div>
  );
}
```

我们正在检查是否在首选网络上找到该链，在我们的例子中是 Goerli，如果没有，我们会提示用户切换网络。

很简单！ 但是，非常有用。 如果用户不在 Goerli 上，它会弹出一条消息！

### 🤑 在 Uniswap 上查看您的代币

您可能会问自己，像 [ENS DAO](https://coinmarketcap.com/currencies/ethereum-name-service/) 或者更新的 [Constitution DAO](https://coinmarketcap.com/currencies/constitutiondao/ ) 拥有价值真金白银的治理代币。 基本上，这是因为其他人可以直接在 Uniswap 等去中心化交易所购买他们的治理代币。

例如——也许一个陌生的人走到我们面前说，“嘿，我用 100 美元向你换取 100 $HOKAGE，因为我想加入 NarutoDAO 并拥有一些治理权”。 嗯，这意味着 $HOKAGE 现在具有真正的价值。 这意味着 1 $HOKAGE = 1 美元。 而且，由于有 1,000,000 $HOKAGE，这意味着我的代币完全稀释后的市值将为 1,000,000 美元。

很疯狂，对吧:)？

人们通常会在 Uniswap 上进行此类交换。

信不信由你，你的代币现在将出现在 Goerli 的 Uniswap 上。

这是一个快览视频，您可以自己实际操作：

[LOOM](https://www.loom.com/share/8c235f0c5d974c978e5dbd564bbca59d)

您可以在 [此处](https://docs.uniswap.org/protocol/V2/concepts/core-concepts/pools) 阅读更多关于流动资金池的信息。 您会在视频中注意到没有 $HOKAGE。 但是，从技术上讲，任何人都可以进入并创建一个池子，让人们用 $ETH 交换 $HOKAGE。 那个池子可能有 100 美元。 或者，它可能有 1,000,000,000 美元。 取决于我的代币有多受欢迎！

### 🎨 自定义 Dapp

花点时间稍微定制一下您的 Web Dapp。 改变一些颜色或副本， 添加一些很酷的表情符号。 前往 `public/index.html` 并更改标题和描述等内容！

随机的一些想法：当人们投票时，播放您所在国家/地区的国歌或者大笑。

在继续将这些页面真正变成您自己的东西之前，请在这里花些时间。 即使你所做的只是改变背景颜色也很好，哈哈。 
玩得开心。

### 🚨 进度报告

*请一定记得报告，否则 Farza 会很伤心 :(.*

在进行了一些自定义后，去 `#progress` 频道中分享关于 DAO 仪表盘的截图!




