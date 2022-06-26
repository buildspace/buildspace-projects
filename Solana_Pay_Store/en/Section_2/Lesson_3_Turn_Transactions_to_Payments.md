Our transactions are being sent, but we're not really doing anything to check if they're actually being confirmed. Maybe they failed for some reason? Here's what you'll need to do to confirm!

### 🤔 Confirm transactions
Head over back to your `Buy.js` component and update it to this:
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
Here's the new block we added:
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

This is the magic of Solana Pay. When we created our transaction object, we added an order ID as a reference field. Solana Pay allows us to search for transactions by their reference. This means we can instantly check if a payment has been made without any deep digging. 

```jsx
const result = await findReference(connection, orderID);
```

The [`findReference`](https://docs.solanapay.com/api/core/function/findReference) function looks for the oldest transaction signature referencing our orderID. If we find one, we check that the transaction status was either confirmed or finalized. 

```jsx
  if (e instanceof FindReferenceError) {
    return null;
  }
```

This function will error if the transaction isn't found and that can happen right after the transaction is submitted. So we check if the error was from the [`FindReferenceError`](https://docs.solanapay.com/api/core/class/FindReferenceError) class and ignore it.

If all goes according to plan, our code will start looking for the transaction just as the user clicks "Approve". The first search will probably fail because transactions take about 0.5s. This is why we're using `setInterval` >:D. The second time it checks, it'll find the transaction and will confirm it, updating our app to indicate payment.

THIS IS A BIG DEAL! The whole reason we use blockchains is so that we don't have to worry about invalid transactions. When Solana Pay tells you a transaction was confirmed, you **know** a transaction was confirmed and that the money is in your wallet. No chargebacks :P

### 🧠 Add to orderbook
There's a tiny problem right now. If you make a payment and then refresh your page, the download button goes away! 

This is because we're not storing orders anywhere. Let's fix that. 

First, we'll need to create a `orders.json` in the `pages/api` directory. Leave it empty for now, mine looks like this:
```json
[

]
```

Next we'll create an API endpoint to write and read from it. We're going to use `orders.json` as another database lol.

Here's my `orders.js` API endpoint file (inside the `pages/api` directory):
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

This is all just plain JavaScript, feel free to go over it :)

Really, all it does is that it reads data and writes to the orders.json file.

Next, we'll need to interact with this API. We *could* just do it wherever we need to in the individual files, but that's bad practice. Instead, we'll create a dedicated file for it.

Create a "lib" folder in the root directory of your project (same level as components) and add an `api.js` file in it.

Here's what it'll look like:
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

Nice! Now to use this, all we need to do is import the `addOrder` function and call it in `Buy.js` right after the transaction is confirm. Here's what my latest `Buy.js` looks like:
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

### 🚨 Progress Report
You have a full-stack application now! Front-end, back-end, server, blockchain, woohoo! 

Post a screenshot of your editor in #progress showing off the "Adding order" console statement.
