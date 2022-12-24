USDC 交易与 SOL 交易非常相似。 不同关键点在于，在我们的交易函数中，我们调用了不同类型的传输指令。

首先，前往此 [水龙头](https://spl-token-faucet.com/?token-name=USDC) 获取一些 USDC 。 这些不是*真正的* USDC，但这并不重要， 发送 SPL token 的方法跟其他都是一样的。

接下来，看看更新后的 `createTransaction.js`：

```jsx
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl, Connection, PublicKey, Transaction } from "@solana/web3.js";
import { createTransferCheckedInstruction, getAssociatedTokenAddress, getMint } from "@solana/spl-token";
import BigNumber from "bignumber.js";
import products from "./products.json";

const usdcAddress = new PublicKey("Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr");
const sellerAddress = "B1aLAAe4vW8nSQCetXnYqJfRxzTjnbooczwkUJAr7yMS";
const sellerPublicKey = new PublicKey(sellerAddress);

const createTransaction = async (req, res) => {
  try {
    const { buyer, orderID, itemID } = req.body;
    if (!buyer) {
      res.status(400).json({
        message: "Missing buyer address",
      });
    }

    if (!orderID) {
      res.status(400).json({
        message: "Missing order ID",
      });
    }

    const itemPrice = products.find((item) => item.id === itemID).price;

    if (!itemPrice) {
      res.status(404).json({
        message: "Item not found. please check item ID",
      });
    }

    const bigAmount = BigNumber(itemPrice);
    const buyerPublicKey = new PublicKey(buyer);

    const network = WalletAdapterNetwork.Devnet;
    const endpoint = clusterApiUrl(network);
    const connection = new Connection(endpoint);

    const buyerUsdcAddress = await getAssociatedTokenAddress(usdcAddress, buyerPublicKey);
    const shopUsdcAddress = await getAssociatedTokenAddress(usdcAddress, sellerPublicKey);
    const { blockhash } = await connection.getLatestBlockhash("finalized");
    
    // This is new, we're getting the mint address of the token we want to transfer
    const usdcMint = await getMint(connection, usdcAddress);
    
    const tx = new Transaction({
      recentBlockhash: blockhash,
      feePayer: buyerPublicKey,
    });
    
    // Here we're creating a different type of transfer instruction
    const transferInstruction = createTransferCheckedInstruction(
      buyerUsdcAddress, 
      usdcAddress,     // This is the address of the token we want to transfer
      shopUsdcAddress, 
      buyerPublicKey, 
      bigAmount.toNumber() * 10 ** (await usdcMint).decimals, 
      usdcMint.decimals // The token could have any number of decimals
    );

    // The rest remains the same :)
    transferInstruction.keys.push({
      pubkey: new PublicKey(orderID),
      isSigner: false,
      isWritable: false,
    });

    tx.add(transferInstruction);

    const serializedTransaction = tx.serialize({
      requireAllSignatures: false,
    });

    const base64 = serializedTransaction.toString("base64");

    res.status(200).json({
      transaction: base64,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({ error: "error creating transaction" });
    return;
  }
};

export default function handler(req, res) {
  if (req.method === "POST") {
    createTransaction(req, res);
  } else {
    res.status(405).end();
  }
}
```

再次重申——这可能看起来很复杂，但它其实很简单。

我们添加的第一个新内容是 USDC 合约地址：

```jsx
const usdcAddress = new PublicKey("Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr");
```

这是我们从水龙头得到的 devnet 上 USDC 的合约地址。 我们将使用此地址查找 USDC 帐户地址。

以下是 Solana 中 token 账户的工作方式：

![无标题](https://i.imgur.com/8T8BFGL.png)

Solana 上的所有可替代 token 都是使用 [token program](https://spl.solana.com/token) 创建的。 这意味着每个 token 都有自己的 **账户**，它有一个地址。 为了能够从该帐户发送 token，您需要这个地址。

您可以将您的 Solana 账户想象成一家无限旅馆，将所有 token 账户想象成旅馆房间。 作为酒店的所有者，您拥有酒店客房。 为了能够查看房间内部，您需要知道它的编号 :)

**注意：** 因为账户模型，**您需要在两个用户账户中都有USDC**。 如果用户账户没有 USDC，也就没有 USDC 合约地址，这个函数就会报错。

发送 SOL 和*任何*其他 token 的唯一区别就是这一点，这真是太疯狂了：

```jsx
    // Here we're creating a different type of transfer instruction
    const transferInstruction = createTransferCheckedInstruction(
      buyerUsdcAddress, 
      usdcAddress,     // This is the address of the token we want to transfer
      shopUsdcAddress, 
      buyerPublicKey, 
      bigAmount.toNumber() * 10 ** (await usdcMint).decimals, 
      usdcMint.decimals // The token could have any number of decimals
    );
```

您可以用*任何* SPL token 替换它，它也会起作用！

现在，如果您单击 “Buy now” 按钮，您应该会在钱包看到一个以 "Gh9Zw" 开头的 token 请求。 这是 USDC 测试币的合约地址。 如果在主网上，这会是真正的 USDC 哈哈！！

![](https://hackmd.io/_uploads/ryaoth9P9.png)

就是这样，您正在接受 USDC 付款！

对我而言，最酷的部分是 “checkout”（结账） 体验。 无需注册，没有地址，无需E-mail。 有很多价值数十亿美元的公司都在尝试普及一键结账， 而你只是在15分钟内就免费实现了它。* *:)

### 🚨 进度报告
请一定记得报告，否则 Raza 会很难过的💔:(

在 `#progress` 频道中分享您的浏览器屏幕截图，以展示您的 USDC 交易请求！
