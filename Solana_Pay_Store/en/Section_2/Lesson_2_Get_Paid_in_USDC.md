USDC transactions are very similar to SOL transactions. The key bit that changes is that in our transaction function we call a different type of transfer instruction. 

First, head over to this [faucet](https://spl-token-faucet.com/?token-name=USDC) to request some USDC tokens. These aren't *actually* USDC, but it doesn't matter. The method of sending SPL tokens is the same for all of them.

Next, take a look at the updated `createTransaction.js`:
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
Again - this might seem overwhelming but it's relatively simple. 

The first new thing we add is the USDC address:
```jsx
const usdcAddress = new PublicKey("Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr");
```

This is the token address of the USDC token on the devnet that we got from the faucet. We're going to use this address to find the USDC token account addresses.

Here's how token accounts in Solana work. 
![Untitled](https://i.imgur.com/8T8BFGL.png)

All fungible tokens on Solana are made using the [token program](https://spl.solana.com/token). This means that each token has it's **own account**, which has an address. To be able to send tokens from that account, you need it's address. 

You can think of your Solana account like an infinite hotel and all the token accounts like hotel rooms. As the owner of the hotel, you own the hotel rooms. To be able to look inside a room, you need to know it's number :)

Pretty crazy that the only difference in sending SOL and *any* other token is just this bit:
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

You can replace this with *any* SPL token and it'll work!


### 🚨 Progress Report
Please do this else Raza will be sad :(

Post a screenshot of your browser in #progress showing off your USDC transaction request!
