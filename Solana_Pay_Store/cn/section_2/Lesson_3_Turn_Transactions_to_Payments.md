我们的交易正在发送中，但我们并没有真正做任何操作来检查它们是否真的得到确认。 也许他们因为某种原因失败了？ 这是您需要确认的操作！

### 🤔 确认交易

回到你的 `Buy.js` 组件并将其更新为：

```jsx
import React, { useState, useEffect, useMemo } from "react";
import { Keypair, Transaction } from "@solana/web3.js";
import { findReference, FindReferenceError } from "@solana/pay";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { InfinitySpin } from "react-loader-spinner";
import IPFSDownload from "./IpfsDownload";

const STATUS = {
  Initial: "Initial",
  Submitted: "Submitted",
  Paid: "Paid",
};

export default function Buy({ itemID }) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const orderID = useMemo(() => Keypair.generate().publicKey, []); // Public key used to identify the order

  const [loading, setLoading] = useState(false); 
  const [status, setStatus] = useState(STATUS.Initial); // Tracking transaction status

  const order = useMemo(
    () => ({
      buyer: publicKey.toString(),
      orderID: orderID.toString(),
      itemID: itemID,
    }),
    [publicKey, orderID, itemID]
  );

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

    const tx = Transaction.from(Buffer.from(txData.transaction, "base64"));
    console.log("Tx data is", tx);

    try {
      const txHash = await sendTransaction(tx, connection);
      console.log(`Transaction sent: https://solscan.io/tx/${txHash}?cluster=devnet`);
      setStatus(STATUS.Submitted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    // Check if transaction was confirmed
    if (status === STATUS.Submitted) {
      setLoading(true);
      const interval = setInterval(async () => {
        try {
          const result = await findReference(connection, orderID);
          console.log("Finding tx reference", result.confirmationStatus);
          if (result.confirmationStatus === "confirmed" || result.confirmationStatus === "finalized") {
            clearInterval(interval);
            setStatus(STATUS.Paid);
            setLoading(false);
            alert("Thank you for your purchase!");
          }
        } catch (e) {
          if (e instanceof FindReferenceError) {
            return null;
          }
          console.error("Unknown error", e);
        } finally {
          setLoading(false);
        }
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [status]);

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
      { status === STATUS.Paid ? (
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

下面是我们添加的新模块：

```jsx
  useEffect(() => {
    // Check if transaction was confirmed
    if (status === STATUS.Submitted) {
      setLoading(true);
      const interval = setInterval(async () => {
        try {
          // Look for our orderID on the blockchain
          const result = await findReference(connection, orderID);
          console.log("Finding tx reference", result.confirmationStatus);
          
          // If the transaction is confirmed or finalized, the payment was successful!
          if (result.confirmationStatus === "confirmed" || result.confirmationStatus === "finalized") {
            clearInterval(interval);
            setStatus(STATUS.Paid);
            setLoading(false);
            alert("Thank you for your purchase!");
          }
        } catch (e) {
          if (e instanceof FindReferenceError) {
            return null;
          }
          console.error("Unknown error", e);
        } finally {
          setLoading(false);
        }
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [status]);
```

这就是 Solana Pay 的魔力。 当我们创建交易对象时，我们添加了一个订单 ID 作为参考字段。 Solana Pay 允许我们通过参考来检索交易。 这意味着我们可以立即检查是否已付款，而无需深入挖掘。

```jsx
const result = await findReference(connection, orderID);
```

[`findReference`](https://docs.solanapay.com/api/core/function/findReference) 函数是查找引用我们 orderID 的最早交易签名。 如果我们找到一个，我们会检查交易状态是否已确认或已完成。

```jsx
  if (e instanceof FindReferenceError) {
    return null;
  }
```

如果未找到交易，此函数将报错，并且可能在交易提交后立即发生。 因此，我们需要检查错误是否来自 [`FindReferenceError`](https://docs.solanapay.com/api/core/class/FindReferenceError) 类并忽略它。

如果一切按计划进行，我们的代码将在用户单击 “aaprove” 时开始查找交易。 第一次搜索可能会失败，因为交易大约需要 0.5 秒。 这就是我们使用 `setInterval` 的原因 >:D。 第二次检查时，它会找到交易并确认它，更新我们的应用程序以指示付款。

这是一件大事！ 我们使用区块链的全部原因是我们不必担心无效交易。 当 Solana Pay 告诉您交易已确认时，您**知道**交易已成功并且您的钱包已收到了钱。 而没有被退单。

### 🧠 添加到订单簿

现在有个小问题。 如果您付款后刷新页面，下载按钮就会消失！

这是因为我们没有在任何地方保存订单。 让我们解决这个问题。

首先，我们需要在 `pages/api` 目录中创建一个 `orders.json` 文件。 现在把它留空，看起来像这样：

```json
[

]
```

接下来我们将创建一个 API 端点来写入和读取它。 我们将使用 `orders.json` 作为另一个数据库，哈哈。

这是我的 `orders.js` API 端点文件（在 `pages/api` 目录中）：

```jsx
// This API endpoint will let users POST data to add records and GET to retrieve
import orders from "./orders.json";
import { writeFile } from "fs/promises";

function get(req, res) {
  const { buyer } = req.query;

  // Check if this address has any orders
  const buyerOrders = orders.filter((order) => order.buyer === buyer);
  if (buyerOrders.length === 0) {
    // 204 = successfully processed the request, not returning any content
    res.status(204).send();
  } else {
    res.status(200).json(buyerOrders);
  }
}

async function post(req, res) {
  console.log("Received add order request", req.body);
  // Add new order to orders.json
  try {
    const newOrder = req.body;

    // If this address has not purchased this item, add order to orders.json
    if (!orders.find((order) => order.buyer === newOrder.buyer.toString() && order.itemID === newOrder.itemID)) {
      orders.push(newOrder);
      await writeFile("./pages/api/orders.json", JSON.stringify(orders, null, 2));
      res.status(200).json(orders);
    } else {
      res.status(400).send("Order already exists");
    }
  } catch (err) {
    res.status(400).send(err);
  }
}

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      get(req, res);
      break;
    case "POST":
      await post(req, res);
      break;
    default:
      res.status(405).send(`Method ${req.method} not allowed`);
  }
}

```

这都是些普通的 JavaScript，请随意浏览它 :)

实际上，它所做的只是读取数据并写入到 `orders.json` 文件。

接下来，我们需要与这个 API 进行交互。 我们*可以*只在单个文件中需要的地方执行它，但这是不好的做法。 相反，我们将为它创建一个专用文件。

在项目的根目录（与components同级）中创建一个“lib”文件夹，并在其中添加一个 `api.js `文件。

看起来像这样：

```jsx
export const addOrder = async (order) => {
  console.log("adding order ", order, "To DB");
  await fetch("../api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });
};
```

非常好！ 现在要使用它，我们需要做的就是导入 addOrder 函数并在交易确认后立即在 `Buy.js` 中调用它。 这是我最新的 `Buy.js` 的样子：

```jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Keypair, Transaction } from '@solana/web3.js';
import { findReference, FindReferenceError } from '@solana/pay';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { InfinitySpin } from 'react-loader-spinner';
import IPFSDownload from './IpfsDownload';
import { addOrder } from '../lib/api';

const STATUS = {
  Initial: 'Initial',
  Submitted: 'Submitted',
  Paid: 'Paid',
};

export default function Buy({ itemID }) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const orderID = useMemo(() => Keypair.generate().publicKey, []); // Public key used to identify the order

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(STATUS.Initial); // Tracking transaction status

  const order = useMemo(
    () => ({
      buyer: publicKey.toString(),
      orderID: orderID.toString(),
      itemID: itemID,
    }),
    [publicKey, orderID, itemID]
  );

  const processTransaction = async () => {
    setLoading(true);
    const txResponse = await fetch('../api/createTransaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });
    const txData = await txResponse.json();

    const tx = Transaction.from(Buffer.from(txData.transaction, 'base64'));
    console.log('Tx data is', tx);

    try {
      const txHash = await sendTransaction(tx, connection);
      console.log(
        `Transaction sent: https://solscan.io/tx/${txHash}?cluster=devnet`
      );
      setStatus(STATUS.Submitted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if transaction was confirmed
    if (status === STATUS.Submitted) {
      setLoading(true);
      const interval = setInterval(async () => {
        try {
          const result = await findReference(connection, orderID);
          console.log('Finding tx reference', result.confirmationStatus);
          if (
            result.confirmationStatus === 'confirmed' ||
            result.confirmationStatus === 'finalized'
          ) {
            clearInterval(interval);
            setStatus(STATUS.Paid);
            setLoading(false);
            addOrder(order);
            alert('Thank you for your purchase!');
          }
        } catch (e) {
          if (e instanceof FindReferenceError) {
            return null;
          }
          console.error('Unknown error', e);
        } finally {
          setLoading(false);
        }
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [status]);

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
      {status === STATUS.Paid ? (
        <IPFSDownload
          filename="emojis.zip"
          hash="QmWWH69mTL66r3H8P4wUn24t1L5pvdTJGUTKBqT11KCHS5"
          cta="Download emojis"
        />
      ) : (
        <button
          disabled={loading}
          className="buy-button"
          onClick={processTransaction}
        >
          Buy now 🠚
        </button>
      )}
    </div>
  );
}

```

### 🚨 进度报告
您现在拥有一个全栈应用程序！ 前端、后端、服务器、区块链，哇哦！

在 `#progress` 频道中分享您的代码编辑器的截图，并展示 "Adding order" 后控制台的输出语句。









