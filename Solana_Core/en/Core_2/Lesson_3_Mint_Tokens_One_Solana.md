Enough talking, let's make some magic internet money. In our final project we will be creating a token that you will gain over time as you stake your community NFT. Until we get there, let's play around with the process of actually building this minting process. This is a great time to use your imagination and just **have fun with it**. Maybe you've always wanted to create your own meme coin -- **NOW IS YOUR CHANCE** 🚀

We'll start with a new Solana client, head over to your Solana workspace and run this command:
```
npx create-solana-client [name] --initialize-keypair
cd [name]
```
Name your client after your token. I'm gonna be making Pizzacoin cause I had some really good pizza yesterday. This is your time to be creative. Maybe you wanna tokenise time itself? You could make HokageCoin or maybe even TwitterThreadCoin. Infinite possibilities!

The `--initialize-keypair` flag does all the magic we did last time with `initalizeKeypair`. Run `npm run start` and you'll have a new keypair with some SOL airdropped. LET'S TURN ON THE MONEY PRINTER AND MAKE IT GO BRRRR

![](https://media.giphy.com/media/Y2ZUWLrTy63j9T6qrK/giphy.gif)
Pictured: Jerome Powell, head of the US Federal Reserve Bank, making printer go brr.

#### 🎁 Build a token minter
Remember the steps:
1. Create a token mint account
2. Create an associated token account for a specific wallet
3. Mint tokens to that wallet

Here's step 1 in `src/index.ts`, put this after the imports and above `main()`:
```ts
// Add the spl-token import at the top
import * as token from "@solana/spl-token"

async function createNewMint(
    connection: web3.Connection,
    payer: web3.Keypair,
    mintAuthority: web3.PublicKey,
    freezeAuthority: web3.PublicKey,
    decimals: number
): Promise<web3.PublicKey> {

    const tokenMint = await token.createMint(
        connection,
        payer,
        mintAuthority,
        freezeAuthority,
        decimals
    );

    console.log(`The token mint account address is ${tokenMint}`)
    console.log(
        `Token Mint: https://explorer.solana.com/address/${tokenMint}?cluster=devnet`
    );

    return tokenMint;
}
```
This should be looking familiar. If not, go back to the last section and read it again 😠

Again - the `@solana/spl-token` program makes this easy. `tokenMint` is the address of the token mint account.

Next we gotta make the associated token account, put this after the `createNewMint` function:
```ts
async function createTokenAccount(
    connection: web3.Connection,
    payer: web3.Keypair,
    mint: web3.PublicKey,
    owner: web3.PublicKey
) {
    const tokenAccount = await token.getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        mint,
        owner
    )
    
    console.log(
        `Token Account: https://explorer.solana.com/address/${tokenAccount.address}?cluster=devnet`
    )

    return tokenAccount
}
```

Nothing new here. One thing to note is that `payer` and `owner` can be different - you can pay to create someone's account. This can get expensive since you'll be paying "rent" for their account, so make sure you don't do this without doing the math. 

And finally, the mint function:
```ts
async function mintTokens(
  connection: web3.Connection,
  payer: web3.Keypair,
  mint: web3.PublicKey,
  destination: web3.PublicKey,
  authority: web3.Keypair,
  amount: number
) {
  const mintInfo = await token.getMint(connection, mint)

  const transactionSignature = await token.mintTo(
    connection,
    payer,
    mint,
    destination,
    authority,
    amount * 10 ** mintInfo.decimals
  )

  console.log(
    `Mint Token Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
  )
}
```

Let's call each of these in the main function, here's what I've got:

```ts
async function main() {
  const connection = new web3.Connection(web3.clusterApiUrl("devnet"))
  const user = await initializeKeypair(connection)

  console.log("PublicKey:", user.publicKey.toBase58())

  const mint = await createNewMint(
    connection,
    user,           // We'll pay the fees
    user.publicKey, // We're the mint authority
    user.publicKey, // And the freeze authority >:)
    2               // Only two decimals!
  )

  const tokenAccount = await createTokenAccount(
    connection,     
    user,           
    mint,            
    user.publicKey   // Associating our address with the token account
  )
  
  // Mint 100 tokens to our address
  await mintTokens(connection, user, mint, tokenAccount.address, user, 100)
}
```

Run `npm run dev` - you should see three explorer links logged in the terminal. **Save the token mint account address.** You'll need it later. Open up the last link and scroll down to the token balances section:

![](https://hackmd.io/_uploads/BJBT5nXms.png)

You just minted some tokens! These tokens can represent anything you want. 100 USD each? 100 minutes of your time? 100 cat memes? 100 slices off 12" butter chicken thin base stuffed-crust Pizza? This is your reality. You're the only one who controls the mint account, so the value of the token supply is as worthless or precious as you let it be.

Before you go on to reinvent modern finance on the Solana blockchain, let's look at how you can transfer and burn tokens:

```ts
async function transferTokens(
  connection: web3.Connection,
  payer: web3.Keypair,
  source: web3.PublicKey,
  destination: web3.PublicKey,
  owner: web3.PublicKey,
  amount: number,
  mint: web3.PublicKey
) {
  const mintInfo = await token.getMint(connection, mint)

  const transactionSignature = await token.transfer(
    connection,
    payer,
    source,
    destination,
    owner,
    amount * 10 ** mintInfo.decimals
  )

  console.log(
    `Transfer Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
  )
}

async function burnTokens(
    connection: web3.Connection,
    payer: web3.Keypair,
    account: web3.PublicKey,
    mint: web3.PublicKey,
    owner: web3.Keypair,
    amount: number
) {
    const transactionSignature = await token.burn(
        connection,
        payer,
        account,
        mint,
        owner,
        amount
    )

    console.log(
        `Burn Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
    )
}
```

These functions look long because I gave each parameter their own line, they're actually just 3 lines each lol. 

Using them is just as simple:
```ts
async function main() {
		...
    
    const receiver = web3.Keypair.generate().publicKey
    
    const receiverTokenAccount = await createTokenAccount(
        connection,
        user,
        mint,
        receiver
    )

    await transferTokens(
        connection,
        user,
        tokenAccount.address,
        receiverTokenAccount.address,
        user,
        50
    )
    
   await burnTokens(connection, user, tokenAccount.address, mint, user, 25)
}
```

Play around with the transfer function, send some tokens to your wallet address and see what it looks like. Here's what I see:

![](https://hackmd.io/_uploads/S1MMfh1Ss.png)

Hmmm... why does it say unknown? Let's fix that!
