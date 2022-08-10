Wasn't that easy? I love React. Now that we have a storefront, we need to hire a cashier and tell them to charge people money lol.

Alrighty, we're about to get PAID! We're going to add a few functions so that we can:
1. Generate a transaction object on the server
2. Fetch the transaction object from the server
3. Ask the user to sign the transaction
4. Check if the transaction has been confirmed

Once the transaction has been processed, we're going to use the display the download button we made to send the file to the user.

### 💥 Sending SOL tokens
Since blockchain transactions have a bunch of parts, we're going to start with just sending SOL instead of USDC.

The first thing you're going to do is add a `createTransaction.js` file in the api folder. Here's what it'll look like:
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

Don't get overwhelmed! This is actually a lot simpler than it looks. All you need to know here is that we're creating a Solana transaction object that transfers a certain amount of SOL tokens from one address to another. I left comments in the code explaining the new stuff :D

To call this endpoint, we'll create a new component - a buy button! Head over to the components folder and create a new file called "Buy.js". Here's what it'll have:
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

This component is the heart of our application. We're going to revisit it several times to add functionality to it. Right now we're just using it to send a transaction and enabling the download button.

To use it, we'll need to make a tiny change to our `Product.js` component
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
All we did here was replace the IPFS component with the Buy component lol.

### 🧪 Setting up Devnet 

One last step before you get paid! You need to make sure your network on Phantom is set to the Devnet. To do this, open up your Phantom wallet and go to settings:

![](https://i.imgur.com/U5moHfW.png)

Then select **Change Network** and set it to **Devnet**. Now you're all set, All transactions will be on the Devnet!

![](https://i.imgur.com/WkPUkcu.png)

If you are broke and you have no SOL in your wallet, you can use a faucet to get some. Checkout [Sol Facuet](https://solfaucet.com/) for some fake money.

And now if you click the shiny new buy button, you should see a transaction request:
![](https://hackmd.io/_uploads/ByAeaFIPc.png)

What's happening here is that our buy button hits the backend to fetch the transaction object for this item. Once that's done, we just set a `Paid` variable to true and enable the download button. Pretty cool, eh?

Next, we're going to use USDC instead of SOL!

### 🚨 Progress Report
Please do this else Raza will be sad :(

Post a screenshot of your browser in #progress showing off your SOL transaction request!
