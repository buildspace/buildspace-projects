It's time to finally mint our first NFT on Solana.

At this point we are going to be calling our Candy Machine to mint a single NFT when someone clicks our button.

Let's do this.

### 🎩 Going through the `mintToken` function

In your `CandyMachine` component you'll see a function named `mintToken`. This is part of Metaplex's front-end library.

This function is pretty complex. I'm not going to go through it line by line. Go and figure out how it works yourself! One thing I recommend doing is using CMD (MacOS) or CTRL (Windows) + click on functions to see how they work at a lower level. Looking at the code is usually the best way to learn how it works.

But lets look at some chunks of code:

```jsx
const mint = web3.Keypair.generate();

const userTokenAccountAddress = (
  await getAtaForMint(mint.publicKey, walletAddress.publicKey)
)[0];
```

Here we're creating an account for our NFT. In Solana, programs are **stateless** which is very different from Ethereum where contracts hold state. Check out more on accounts [here](https://docs.solana.com/developing/programming-model/accounts).

```jsx
const userPayingAccountAddress = candyMachine.state.tokenMint
  ? (await getAtaForMint(candyMachine.state.tokenMint, walletAddress.publicKey))[0]
  : walletAddress.publicKey;

const candyMachineAddress = candyMachine.id;
const remainingAccounts = [];
const signers = [mint];
```

Here's are all the params candy machine needs to mint the NFT. It needs everything from `userPayingAccountAddress` (which is the person paying + receiving for the NFT) to the `mint` which is account address of the NFT we'll be minting.

```jsx
const instructions = [
  web3.SystemProgram.createAccount({
    fromPubkey: walletAddress.publicKey,
    newAccountPubkey: mint.publicKey,
    space: MintLayout.span,
    lamports: await candyMachine.program.provider.connection.getMinimumBalanceForRentExemption(MintLayout.span),
    programId: TOKEN_PROGRAM_ID,
  }),
  createInitializeMintInstruction(
    mint.publicKey,
    0,
    walletAddress.publicKey,
    walletAddress.publicKey,
    TOKEN_PROGRAM_ID
  ),
  createAssociatedTokenAccountInstruction(
    walletAddress.publicKey,
    userTokenAccountAddress,
    walletAddress.publicKey,
    mint.publicKey,
    TOKEN_PROGRAM_ID
  ),
  createMintToInstruction(mint.publicKey, userTokenAccountAddress, walletAddress.publicKey, 1),
];
```

In Solana, a transaction is a bundle of instructions. So, here we bundle a few instructions which are basically functions that live on our candy machine. Metaplex gave us these functions. We just hit them.

```jsx
if (candyMachine.state.gatekeeper) {
  // Rest of the code
}

if (candyMachine.state.whitelistMintSettings) {
  // Rest of the code
}

if (candyMachine.state.tokenMint) {
  // Rest of the code
}
```
Here, we're checking if the Candy machine is using a captcha to prevent bots (`gatekeeper`), if there is a whitelist setup, or if the mint is token gated. Each of these has a different set of checks which the users' account needs to pass. Once passed, additional instructions are pushed into the transaction.

```jsx
const metadataAddress = await getMetadata(mint.publicKey);
const masterEdition = await getMasterEdition(mint.publicKey);

const [candyMachineCreator, creatorBump] = await getCandyMachineCreator(
  candyMachineAddress,
);

instructions.push(
  await candyMachine.program.instruction.mintNft(creatorBump, {
    accounts: {
      candyMachine: candyMachineAddress,
      candyMachineCreator,
      payer: walletAddress.publicKey,
      wallet: candyMachine.state.treasury,
      mint: mint.publicKey,
      metadata: metadataAddress,
      masterEdition,
      mintAuthority: walletAddress.publicKey,
      updateAuthority: walletAddress.publicKey,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      rent: web3.SYSVAR_RENT_PUBKEY,
      clock: web3.SYSVAR_CLOCK_PUBKEY,
      recentBlockhashes: web3.SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
      instructionSysvarAccount: web3.SYSVAR_INSTRUCTIONS_PUBKEY,
    },
    remainingAccounts:
      remainingAccounts.length > 0 ? remainingAccounts : undefined,
  }),
);
```
Finally, after all the checks have passed, we create the instructions for actually minting the NFT. 

```jsx
  try {
    return (
      await sendTransactions(
        candyMachine.program.provider.connection,
        candyMachine.program.provider.wallet,
        [instructions, cleanupInstructions],
        [signers, []],
      )
    ).txs.map(t => t.txid);
  } catch (e) {
    console.log(e);
  }
```
This you already know! We use a provider, our wallet, all our instructions, and then call `sendTransactions` which is a function that talks to the blockchain. **This is the magic line where we actually hit our candy machine** **and tell it to mint our NFT.**

I know I blazed through all this stuff, so, be sure to go through it yourself! Also, it'd be awesome if someone just made this one nice NPM module lol.

### ✨ Mint your NFT

In your `CandyMachine` component, have your "Mint" button call the `mintToken` function:

```jsx
return (
  // Only show this if candyMachine and candyMachine.state is available
  candyMachine && candyMachine.state && (
    <div className="machine-container">
      <p>{`Drop Date: ${candyMachine.state.goLiveDateTimeString}`}</p>
      <p>{`Items Minted: ${candyMachine.state.itemsRedeemed} / ${candyMachine.state.itemsAvailable}`}</p>
      <button className="cta-button mint-button" onClick={mintToken}>
          Mint NFT
      </button>
    </div>
  )
);
```

Before clicking "Mint NFT", you need to make sure you have some Devnet SOL on your Phantom Wallet. This is pretty easy.

First grab you Phantom wallet's public address:

![Untitled](https://i.imgur.com/WfbIPsb.png)

Then, on your terminal run:

```plaintext
solana airdrop 2 INSERT_YOUR_PHANTOM_WALLET_ADDRESS
```

And that's it. Congrats on all the free money heh.

Cool, so now when you click "Mint NFT", you'll see a pop up like:

![Untitled](https://i.imgur.com/FS4RbPS.png)

Once you click "Approve" and pay the transaction fee, it'll tell your candy machine to mint the NFT.

**We don't have any loading indicators currently setup here**, so it may look like nothing is happening lol. I would suggest keeping a console open for the browser you are in to see the logs go through. It'll take like 3-10 seconds.

Once your NFT successfully mints, you'll see something like this in your console:

![Untitled](https://i.imgur.com/EszxhAH.png)

You have **SUCCESSFULLY** minted your first NFT on Solana. **Hell yeah. So, where is it?**

To double check this actually worked, open your Phantom wallet and check to see if your NFT shows up in the "Collectibles" section like so:

![Untitled](https://i.imgur.com/6DsqLYM.png)

I actually minted two NFTs separately, so, I see two! You'll see "Items Minted" also changes on your web app.

It's pretty amazing to see this all come full circle.

You've put in a ton of work to make this happen and now it's time to have some fun and make it even better. In the next section we are going to add some UI that will display all the NFTs ever minted on your web app.

Take some time now to kinda clean stuff up. Clean up your code a little. Change up some CSS. Take a breather :).

### 🚨 Progress Report

*Please do this else Farza will be sad :(*

In `#progress` post a screenshot of your minted NFTs! Maybe make a tweet here telling the world what you're up to. Be sure to tag `@_buildspace`.
