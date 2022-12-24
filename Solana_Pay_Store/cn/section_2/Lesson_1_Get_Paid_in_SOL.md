那不是很容易吗？ 我喜欢用 React。 现在我们有了店面，我们需要聘请收银员并让他们向消费者收费，哈哈。

好吧，我们即将获得收益！ 我们将添加一些函数，以便我们可以：
1. 在服务端生成交易对象
2. 从服务器获取交易对象
3. 要求用户签署交易
4. 检查交易是否已确认

一旦交易处理完毕，我们可以通过下载按钮将文件发送给用户。

### 💥 发送 SOL Token
由于区块链交易有很多部分，我们将从发送 SOL 而不是 USDC 开始。

您要做的第一件事是在 api 文件夹中添加一个 `createTransaction.js` 文件。 它看起来像这样：

```jsx
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import BigNumber from "bignumber.js";
import products from "./products.json";

// Make sure you replace this with your wallet address!
const sellerAddress = 'B1aLAAe4vW8nSQCetXnYqJfRxzTjnbooczwkUJAr7yMS'
const sellerPublicKey = new PublicKey(sellerAddress);

const createTransaction = async (req, res) => {
  try {
    // Extract the transaction data from the request body
    const { buyer, orderID, itemID } = req.body;

    // If we don't have something we need, stop!
    if (!buyer) {
      return res.status(400).json({
        message: "Missing buyer address",
      });
    }

    if (!orderID) {
      return res.status(400).json({
        message: "Missing order ID",
      });
    }

    // Fetch item price from products.json using itemID
    const itemPrice = products.find((item) => item.id === itemID).price;

    if (!itemPrice) {
      return res.status(404).json({
        message: "Item not found. please check item ID",
      });
    }
    
    // Convert our price to the correct format
    const bigAmount = BigNumber(itemPrice);
    const buyerPublicKey = new PublicKey(buyer);
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = clusterApiUrl(network);
    const connection = new Connection(endpoint);

    // A blockhash is sort of like an ID for a block. It lets you identify each block.
    const { blockhash } = await connection.getLatestBlockhash("finalized");
    
    // The first two things we need - a recent block ID 
    // and the public key of the fee payer 
    const tx = new Transaction({
      recentBlockhash: blockhash,
      feePayer: buyerPublicKey,
    });

    // This is the "action" that the transaction will take
    // We're just going to transfer some SOL
    const transferInstruction = SystemProgram.transfer({
      fromPubkey: buyerPublicKey,
      // Lamports are the smallest unit of SOL, like Gwei with Ethereum
      lamports: bigAmount.multipliedBy(LAMPORTS_PER_SOL).toNumber(), 
      toPubkey: sellerPublicKey,
    });

    // We're adding more instructions to the transaction
    transferInstruction.keys.push({
      // We'll use our OrderId to find this transaction later
      pubkey: new PublicKey(orderID), 
      isSigner: false,
      isWritable: false,
    });

    tx.add(transferInstruction);
  
    // Formatting our transaction
    const serializedTransaction = tx.serialize({
      requireAllSignatures: false,
    });
    const base64 = serializedTransaction.toString("base64");

    res.status(200).json({
      transaction: base64,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: "error creating tx" });
    return;
  }
}

export default function handler(req, res) {
  if (req.method === "POST") {
    createTransaction(req, res);
  } else {
    res.status(405).end();
  }
}
```

别不知所措！ 这实际上比看起来简单得多。 您在这里需要知道的是，我们正在创建一个 Solana 交易对象，该对象将一定数量的 SOL Token 从一个地址转移到另一个地址。 我在新加的代码中留了注释：D

要调用此端点，我们将创建一个新组件 - 一个购买按钮（buy button）！ 转到组件文件夹并创建一个名为 `Buy.js` 的新文件。 它的代码如下：

```jsx
import React, { useState, useMemo } from "react";
import { Keypair, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { InfinitySpin } from "react-loader-spinner";
import IPFSDownload from "./IpfsDownload";

export default function Buy({ itemID }) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const orderID = useMemo(() => Keypair.generate().publicKey, []); // Public key used to identify the order

  const [paid, setPaid] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state of all above
  
  // useMemo is a React hook that only computes the value if the dependencies change
  const order = useMemo(
    () => ({
      buyer: publicKey.toString(),
      orderID: orderID.toString(),
      itemID: itemID,
    }),
    [publicKey, orderID, itemID]
  );

  // Fetch the transaction object from the server 
  const processTransaction = async () => {
    setLoading(true);
    const txResponse = await fetch("../api/createTransaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });
    const txData = await txResponse.json();
    
    // We create a transaction object
    const tx = Transaction.from(Buffer.from(txData.transaction, "base64"));
    console.log("Tx data is", tx);
    
    // Attempt to send the transaction to the network
    try {
      // Send the transaction to the network
      const txHash = await sendTransaction(tx, connection);
      console.log(`Transaction sent: https://solscan.io/tx/${txHash}?cluster=devnet`);
      // Even though this could fail, we're just going to set it to true for now
      setPaid(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!publicKey) {
    return (
      <div>
        <p>You need to connect your wallet to make transactions</p>
      </div>
    );
  }

  if (loading) {
    return <InfinitySpin color="gray" />;
  }

  return (
    <div>
      {paid ? (
        <IPFSDownload filename="emojis.zip" hash="QmWWH69mTL66r3H8P4wUn24t1L5pvdTJGUTKBqT11KCHS5" cta="Download emojis"/>
      ) : (
        <button disabled={loading} className="buy-button" onClick={processTransaction}>
          Buy now 🠚
        </button>
      )}
    </div>
  );
}
```

该组件是我们应用程序的核心， 我们将会多次访问它以向其添加函数。 现在我们只是用它来发送交易并启用下载按钮。

要使用它，我们需要对我们的 `Product.js` 组件做一个微小的改变：

```jsx
import React from "react";
import styles from "../styles/Product.module.css";
import Buy from "./Buy";

export default function Product({ product }) {
  const { id, name, price, description, image_url } = product;

  return (
    <div className={styles.product_container}>
      <div >
        <img className={styles.product_image}src={image_url} alt={name} />
      </div>

      <div className={styles.product_details}>
        <div className={styles.product_text}>
          <div className={styles.product_title}>{name}</div>
          <div className={styles.product_description}>{description}</div>
        </div>

        <div className={styles.product_action}>
          <div className={styles.product_price}>{price} USDC</div>
            {/* Replace the IPFS component with the Buy component! */}
            <Buy itemID={id} />
        </div>
      </div>
    </div>
  );
}
```

我们在这里所做的就是用 Buy 组件替换 IPFS 组件，哈哈。

### 🧪 设置 Devnet

收款前的最后一步！ 您需要确保 Phantom 上的网络设置为 Devnet。 为此，请打开您的 Phantom 钱包并转到设置：

![](https://i.imgur.com/U5moHfW.png)

然后选择 **Change Network** 并将其设置为 **Devnet**。 现在一切就绪，所有交易都将在 Devnet 上进行！

![](https://i.imgur.com/WkPUkcu.png)

如果您身无分文并且钱包中没有 SOL，您可以使用水龙头获得一些。 在 [Sol Facuet](https://solfaucet.com/) 上获取一些 SOL 测试币。

现在，如果你点击闪亮的购买按钮，你应该会看到一个交易请求：

![](https://hackmd.io/_uploads/ByAeaFIPc.png)

这里发生的事情是，我们的点击 “buy” 按钮后端以获取该项目的交易对象。完成后，我们只需将“Paid” 变量设置为 true 并启用下载按钮。很酷，是吧?

接下来，我们将使用 USDC 而不是 SOL！

### 🚨 进度报告

请一定记得报告，否则 Raza 会很难过的💔:(

在 `#progress` 频道 中分享您的浏览器屏幕截图，以展示您的 SOL 交易请求！
