Ready to poke the Solana network? We're going to write a script that will generate a keypair, fund it with devnet SOL and interact with an existing program on the Solana network.

The program is a simple "ping" counter: we hit it and it records our ping to it and increments a counter. We'll get to Rust and our own programs later, for now we'll cruise with JS/TS.
 
#### 🚧 Set up a local Solana Client
Let's switch things up - we'll step away from React/Next.js here and build a local client with just Typescript. This is much faster than setting up a front-end and building a bunch of UI. You can work in a single TS file and run it asynchronously to interact with the network.

Create a new folder in your Solana workspace and use this handy command to set up a local client:
```
npx create-solana-client solana-intro-client
```

If it asks you if you want to install the `create-solana-client` package, say yes.

Now just navigate into the directory and launch it in VS Code
```
cd solana-intro-client
code .
```

#### ⚙ Set up the client script
The beauty of `create-solana-client` is that we can get started writing client code right away! Jump into `index.ts` and import our dependencies and add this `initializeKeypair` function:
```ts
// We're adding these
import * as Web3 from '@solana/web3.js';
import * as fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
}

main()
  .then(() => {
    console.log('Finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
```
If you run `npm start` in the terminal, you'll see the script is run! All it takes to set up a Solana client is one command. 

Let's add an `initializeKeypair` function that will automatically create a keypair for us if we don't have one. Add this right after the imports:
```ts
async function initializeKeypair(connection: Web3.Connection): Promise<Web3.Keypair> {
  if (!process.env.PRIVATE_KEY) {
    console.log('Generating new keypair... 🗝️');
    const signer = Web3.Keypair.generate();

    console.log('Creating .env file');
    fs.writeFileSync('.env', `PRIVATE_KEY=[${signer.secretKey.toString()}]`);

    return signer;
  }

  const secret = JSON.parse(process.env.PRIVATE_KEY ?? '') as number[];
  const secretKey = Uint8Array.from(secret);
  const keypairFromSecret = Web3.Keypair.fromSecretKey(secretKey);
  return keypairFromSecret;
}
```
This is a pretty smart function - it'll check if you have a private key in your .env file, and if you don't, it'll make one! 

You're already familiar with everything happening here - we call the `Web3.Keypair.generate()` function and write the result to a local [dotenv](https://www.npmjs.com/package/dotenv) file. Once we've created it, we return the keypair so we can use it in the rest of our script.

Update your main function and run the script with `npm start` to test it out:
```ts
async function main() {
  const connection = new Web3.Connection(Web3.clusterApiUrl('devnet'));
  const signer = await initializeKeypair(connection);

  console.log("Public key:", signer.publicKey.toBase58());
}
```
You should see something like this in your terminal:
```
> solana-course-client@1.0.0 start
> ts-node src/index.ts

Generating new keypair... 🗝️
Creating .env file
Public key: jTAsqBrjsYp4uEJNmED5R66gHPnFW4wvQrbmFG3c4QS
Finished successfully
```
Nice! If you check the `.env` file, you'll see a byte format private key! This key is only as secret as the file. If you push this file to a public GitHub repo, anyone can access funds on it, so make sure you don't use it for real money stuff lol.

Running `npm start` again will use this instead of creating a new one.

It's important to keep testing accounts separate, which is why this script is extra cool - it takes away the headache of having to create and manage testing wallets. 

Now if only we could also automate needing to get devnet SOL. Oh wait, we can!

Check out this sick airdrop function - 
```ts
async function airdropSolIfNeeded(
  signer: Web3.Keypair,
  connection: Web3.Connection
) {
  const balance = await connection.getBalance(signer.publicKey);
  console.log('Current balance is', balance / Web3.LAMPORTS_PER_SOL, 'SOL');

  // 1 SOL should be enough for almost anything you wanna do
  if (balance / Web3.LAMPORTS_PER_SOL < 1) {
    // You can only get up to 2 SOL per request 
    console.log('Airdropping 1 SOL');
    const airdropSignature = await connection.requestAirdrop(
      signer.publicKey,
      Web3.LAMPORTS_PER_SOL
    );

    const latestBlockhash = await connection.getLatestBlockhash();

    await connection.confirmTransaction({
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      signature: airdropSignature,
    });

    const newBalance = await connection.getBalance(signer.publicKey);
    console.log('New balance is', newBalance / Web3.LAMPORTS_PER_SOL, 'SOL');
  }
}
```

This may *seem* overwhelming, but you actually know everything that's happening here! We're using our old friend `getBalance` to check if we're broke, and if we are, we use the `requestAidrop` function to make it rain. 

Blockhash and block height are block identifiers used to communicate to the network that we're up to date and aren't sending outdated transactions.

Don't try running this on a loop though - the faucet has a cooldown and the request will fail if you keep spamming it lol.

Make sure you update the `initializeKeypair` function to call the airdrop after you create/fetch the keypair.
```ts
  // When generating a keypair
  await airdropSolIfNeeded(signer, connection);
 
  // When creating it from the secret key
  await airdropSolIfNeeded(keypairFromSecret, connection);
```

Now if you `npm run start`, you'll see the airdrop:
```
Current balance is 0 SOL
Airdropping 1 SOL
New balance is 1 SOL
Public key: 7Fw3bXskk5eonycvET6BSufxAsuNudvuxF7MMnS8KMqX
```

We are ready to rrrrrrrrrrrrumble 🥊

#### 🖱 Call an on-chain program
Time to put our client to use. We're going to write data to an existing program on the Solana network. People think that Solana development is all about writing programs in Rust. Nah! The majority of blockchain development is interacting with existing programs. 

You can build hundreds of apps that just interact with all the programs already out there. This is where the fun begins! We'll keep it simple - our client will ping a counter program, which will increment a counter. You're going to tell everyone on the network you're a builder. 

We need to tell our client what programs it'll be interacting with. Start by adding these addresses at the top, right below the imports:
```ts
const PROGRAM_ID = new Web3.PublicKey("ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa")
const PROGRAM_DATA_PUBLIC_KEY = new Web3.PublicKey("Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod")
```

`PROGRAM_ID` is the address of the ping program itself. `PROGRAM_DATA_PUBLIC_KEY` is the address of an account that stores the data for the program. Remember - executable code and stateful data are stored separately on Solana!

Then add this function to ping the program anywhere:
```ts
async function pingProgram(connection: Web3.Connection, payer: Web3.Keypair) {
  const transaction = new Web3.Transaction()
  const instruction = new Web3.TransactionInstruction({
    // Instructions need 3 things 
    
    // 1. The public keys of all the accounts the instruction will read/write
    keys: [
      {
        pubkey: PROGRAM_DATA_PUBLIC_KEY,
        isSigner: false,
        isWritable: true
      }
    ],
    
    // 2. The ID of the program this instruction will be sent to
    programId: PROGRAM_ID
    
    // 3. Data - in this case, there's none!
  })

  transaction.add(instruction)
  const transactionSignature = await Web3.sendAndConfirmTransaction(connection, transaction, [payer])

  console.log(
    `Transaction https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
    )
}
```
This is not as complex as it looks! You already know the parts of this - 
* we make a transaction
* we make an instruction
* we add the instruction to the transaction
* we send the transaction to the network!

Go over the code comments above - I recap the three parts of an instruction.

The big thing here is the `keys` value - it's an array of account metadata for each account that this instruction will read from or write to. In our case, I'm *telling you* what accounts this instruction will deal with. 

You *need* to know what this will be - you find out by either reading the program itself or the documentation for it. If you don't know this, you can't interact with the program cause the instruction will be invalid. You'll send a transaction that will touch a data account but you won't tell the runtime which account, so it'll be dropped.

Think of it like trying to drive to an address without a GPS. You know *where* you want to go, but not the route to take to get there. 
 
Since this write doesn't require a signature from the data account, we set `isSigner` to false. `isWritable` is true cause the account is being written to!

By telling the network which accounts we need to interact with and if we're writing to them, the Solana runtime knows which transactions it can run in parallel. This is part of why Solana is so fast!

Add this function call `await pingProgram(connection, signer)` to `main()` and run the script with `npm start`. Visit the explorer link that's logged and you'll see the data you wrote at the bottom of the page (you can ignore everything else) - 

![](https://hackmd.io/_uploads/HkFIkghMo.png)

You just wrote data to the blockchain. How easy was that?!

This might *seem* simple, but you just made your mark, quite literally. While everyone on Twitter is yelling about monkey pictures, you're BUILDINGGGGGGGGGGGGGGGGGGG. What you've learnt in this section - reading and writing data from the Solana network, is enough to make a $10k product. Just imagine what you'll be able to do by the end of this program 🤘

#### 🚢 Ship challenge - a SOL transfer script
Now that we’ve worked through sending transactions to the network together, it’s your turn to try it out independently. 

Following a similar process to what we did in the last step, create a script from scratch that will let you **transfer SOL from one account to another** on Devnet. Be sure to print out the transaction signature so you can look at it on the Solana Explorer.

Think about what you've learned so far - 
* Writing data to the network happens through transactions 
* Transactions require instructions
* Instructions tell the network which programs they touch and what they do
* Transferring SOL happens using the system program (hmm I wonder what it's called. 🤔 transfer?)

All you'd need to do here is find out what the exact function name is and what the instructions should look like. I'd start with Google :P

P.S. if you're sure you've figured it out but the transfer still fails, you might be transferring too little - try to transfer at least 0.1 SOL.

As usual, try to do this on your own before referencing the solution code. Once you do need to reference the solution, have a look [here](https://github.com/buildspace/solana-send-sol-client/tree/main). 👀
