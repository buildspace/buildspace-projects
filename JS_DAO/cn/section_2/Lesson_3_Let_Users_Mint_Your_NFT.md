让我们转到 `App.jsx`, 现在要做的是:

1) 如果检测到我们的用户已经持有会员 NFT，请向他们展示我们的“DAO 仪表板”，他们可以对提案进行投票并查看 DAO 相关信息。

2) 如果检测到用户没有我们的 NFT，我们会展示一个按钮来铸造一个。

开始吧！ 我们将首先攻克 #1，我们需要检测用户是否持有我们的 NFT。

### 🤔 检索用户是否持有 NFT

转到 `App.jsx`, 更新我们的 `import` 代码：

```jsx
import { useAddress, ConnectWallet, useContract, useNFTBalance } from '@thirdweb-dev/react';
import { useState, useEffect, useMemo } from 'react';
```

从那里开始，在 `console.log("👋 Address:", address)` 下方，我们将添加：

```jsx
  // Initialize our Edition Drop contract
  const editionDropAddress = "INSERT_EDITION_DROP_ADDRESS"
  const { contract: editionDrop } = useContract(editionDropAddress, "edition-drop");
  // Hook to check if the user has our NFT
  const { data: nftBalance } = useNFTBalance(editionDrop, address, "0")

  const hasClaimedNFT = useMemo(() => {
    return nftBalance && nftBalance.gt(0)
  }, [nftBalance])

  // ... include all your other code that was already there below.
```

首先，初始化我们的 `editionDrop` 合约。

从那里，我们使用 `useNFTBalance` 来检查连接的钱包持有多少 NFT。 这实际上将查询我们已部署的智能合约数据。 为什么要设置 0 ？ 好吧，如果你还记得 0 是我们 NFT 的 tokenId。 所以，我们在这里就是问我们的合约，“嘿，这个用户是否拥有一个 ID 为 0 的 token？”。

现在我们知道用户是否有 NFT！ 让我们创建一个按钮来让用户铸造一个。

### ✨构建一个“Mint NFT”按钮

开始吧！ 回到 `App.jsx`， 我在改动的代码处添加了一些注释：

```javascript
import { useAddress, ConnectWallet, Web3Button, useContract, useNFTBalance } from '@thirdweb-dev/react';
import { useState, useEffect, useMemo } from 'react';

const App = () => {
  // Use the hooks thirdweb give us.
  const address = useAddress();
  console.log("👋 Address:", address);
  // Initialize our Edition Drop contract
  const { contract: editionDrop } = useContract("INSERT_EDITION_DROP_ADDRESS", "edition-drop");
  // Hook to check if the user has our NFT
  const { data: nftBalance } = useNFTBalance(editionDrop, address, "0")

  const hasClaimedNFT = useMemo(() => {
    return nftBalance && nftBalance.gt(0)
  }, [nftBalance])

  // This is the case where the user hasn't connected their wallet
  // to your web app. Let them call connectWallet.
  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to NarutoDAO</h1>
        <div className="btn-hero">
          <ConnectWallet />
        </div>
      </div>
    );
  }

  // Render mint nft screen.
  return (
    <div className="mint-nft">
      <h1>Mint your free 🍪DAO Membership NFT</h1>
      <div className="btn-hero">
        <Web3Button 
          contractAddress={editionDropAddress}
          action={contract => {
            contract.erc1155.claim(0, 1)
          }}
          onSuccess={() => {
            console.log(`🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
          }}
          onError={error => {
            console.error("Failed to mint NFT", error);
          }}
        >
          Mint your NFT (FREE)
        </Web3Button>
      </div>
    </div>
  );
}

export default App;
```

我们正在使用 `Web3Button` 创建一个按钮，它将在我们的 `editionDrop` 合约上调用我们的 `claim` 函数。 我们将传入用户的 `address`，`1 `表示要铸造的 NFT 的 `数量` ，`0` 表示要铸造的 NFT 的 `tokenId`。

这将与我们的智能合约进行交易，并为用户铸造 NFT。 我们还传递了 `onSuccess` 和 `onError` 回调来处理成功和错误情况。

当你铸造 NFT 时，Metamask 会弹出以支付gas费。 完成铸造后，您应该会在控制台中看到 `Successfully Minted!` 以及 Testnet OpenSea 链接。 在 [`testnets.opensea.io`](http://testnets.opensea.io/) 上，我们实际上可以看到在测试网上铸造的 NFT，这非常酷！ 当您转到您的链接时，您会看到如下内容：

![](https://i.imgur.com/PjjDSxd.png)

### 🛑 给 NFT 会员展示 DAO 仪表板

好的，如果你还记得我们需要处理两种情况：

1) 如果我们检测到我们的用户已经持有会员 NFT，请向他们展示我们的“DAO 仪表板”，他们可以对提案进行投票并查看 DAO 相关信息。

2) 如果我们检测到用户没有我们的 NFT，我们会展示一个按钮来铸造一个。

这很容易。在渲染 `mint nft` 之前，我们只需要将以下代码添加到 `App.jsx`：

```jsx
if (!address) {
  return (
    <div className="landing">
      <h1>Welcome to NarutoDAO</h1>
      <div className="btn-hero">
        <ConnectWallet />
      </div>
    </div>
  );
}

// Add this little piece!
if (hasClaimedNFT) {
  return (
    <div className="member-page">
      <h1>🍪DAO Member Page</h1>
      <p>Congratulations on being a member</p>
    </div>
  );
};
```

就是这样!现在，当您刷新页面时，您将看到处于 DAO 成员页面。是的! 如果你断开了你的钱连接，你会被转到 “连接钱包” 页面。

最后，如果你连接了你的钱包，而**没有**会员NFT，它会提示你创建一个。我建议你测试一下这个案例:

1) **断开**钱包与 web 应用的连接

2) [创建新账户](https://metamask.zendesk.com/hc/en-us/articles/360015289452-How-to-create-an-additional-account-in-your-MetaMask-wallet)

这样你就有了一个新的地址来接收NFT了，Metamask可以让你拥有尽可能多的账户。

务必测试以下三种情况！

1） 钱包未连接时：

![](https://i.imgur.com/wIWqk4L.png)

2） 钱包已连接，但用户没有 NFT时：

![](https://i.imgur.com/4y06Gvb.png)

3） 用户拥有一个成员NFT，因此，向他们显示只有 DAO 成员才能看到的页面：

![](https://i.imgur.com/SVy3Yne.png)

### 🚨 进度报告

*请一定记得报告，否则Fraza会伤心的：*

继续在 `#progress` 中分享您在OpenSea上的会员 NFT 截图。



