It's time to finally mint our first NFT on Solana.

At this point we are going to be calling our Candy Machine to mint a single NFT when someone clicks our button.

Let's do this.

### 🎩 Going through the `mintToken` function.

In your `CandyMachine` component you'll see a function named `mintToken`. This is part of Metaplex's front-end library *(**huge shoutout to the [Exiled Ape's Candy Machine Mint repo](https://github.com/exiled-apes/candy-machine-mint)** for giving a good baseline for this code)*.

This function is pretty complex. I'm not going to go through it line by line. Go and figure out how it works yourself! One thing I recommend doing is using CMD (MacOS) or CTRL (Windows) + click on functions to see how they work at a lower level. Looking at the code is usually the best way to learn how it works.

But lets look at some chunks of code:

```jsx
const mint = web3.Keypair.generate();
const token = await getTokenWallet(
  walletAddress.publicKey,
  mint.publicKey
);
const metadata = await getMetadata(mint.publicKey);
const masterEdition = await getMasterEdition(mint.publicKey);
const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST;
const connection = new Connection(rpcHost);
const rent = await connection.getMinimumBalanceForRentExemption(
  MintLayout.span
);
```

Here we're creating an account for our NFT. In Solana, programs are **stateless** which is very different from Ethereum where contracts hold state. Check out more on accounts [here](https://docs.solana.com/developing/programming-model/accounts).

```jsx
const accounts = {
  config,
  candyMachine: process.env.REACT_APP_CANDY_MACHINE_ID,
  payer: walletAddress.publicKey,
  wallet: process.env.REACT_APP_TREASURY_ADDRESS,
  mint: mint.publicKey,
  metadata,
  masterEdition,
  mintAuthority: walletAddress.publicKey,
  updateAuthority: walletAddress.publicKey,
  tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
  tokenProgram: TOKEN_PROGRAM_ID,
  systemProgram: SystemProgram.programId,
  rent: web3.SYSVAR_RENT_PUBKEY,
  clock: web3.SYSVAR_CLOCK_PUBKEY,
};

const signers = [mint];
```

Here's are all the params candy machine needs to mint the NFT. It needs everything from `payer` (which is the person paying + receiving for the NFT) to the `mint` which is account address of the NFT we'll be minting.

```jsx
const instructions = [
  web3.SystemProgram.createAccount({
    fromPubkey: walletAddress.publicKey,
    newAccountPubkey: mint.publicKey,
    space: MintLayout.span,
    lamports: rent,
    programId: TOKEN_PROGRAM_ID,
  }),
  Token.createInitMintInstruction(
    TOKEN_PROGRAM_ID,
    mint.publicKey,
    0,
    walletAddress.publicKey,
    walletAddress.publicKey
  ),
  createAssociatedTokenAccountInstruction(
    token,
    walletAddress.publicKey,
    walletAddress.publicKey,
    mint.publicKey
  ),
  Token.createMintToInstruction(
    TOKEN_PROGRAM_ID,
    mint.publicKey,
    token,
    walletAddress.publicKey,
    [],
    1
  ),
];
```

In Solana, a transaction is a bundle of instructions. So, here we bundle a few instructions which are basically functions that live on our candy machine. Metaplex gave us these functions. We just hit them.

```jsx
const provider = getProvider();
const idl = await Program.fetchIdl(candyMachineProgram, provider);
const program = new Program(idl, candyMachineProgram, provider);

const txn = await program.rpc.mintNft({
  accounts,
  signers,
  instructions,
});
```

This you already know! We set up a provider, then call `mintNft` which is a function that lives on our candy machine. **This is the magic line where we actually hit our candy machine** **and tell it to mint our NFT.**

```jsx
// Setup listener
connection.onSignatureWithOptions(
  txn,
  async (notification, context) => {
    if (notification.type === 'status') {
      console.log('Received status event');

      const { result } = notification;
      if (!result.err) {
        console.log('NFT Minted!');
        await getCandyMachineState();
      }
    }
  },
  { commitment: 'processed' }
);
```

Once we get the signal from our candy machine that the NFT was minted, we let the user know! This is very much like a web hook. Metaplex will actually "emit" a "success" flag on-chain and our web app can capture it. Pretty cool :).

I know I blazed through all this stuff, so, be sure to go through it yourself! Also, it'd be awesome if someone just made this one nice NPM module lol.

### ✨ Mint your NFT.

In your `CandyMachine` component, have your "Mint" button call the `mintToken` function:

```jsx
return (
    // Only show this if machineStats is available
    machineStats && (
      <div className="machine-container">
        <p>{`Drop Date: ${machineStats.goLiveDateTimeString}`}</p>
        <p>{`Items Minted: ${machineStats.itemsRedeemed} / ${machineStats.itemsAvailable}`}</p>
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
solana airdrop 5 INSERT_YOUR_PHANTOM_WALLET_ADDRESS
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

### 👀 Display minted NFTs from your drop.

We like making things spicy at buildspace. It's cool to be able to make a mint machine, but what else can we do?

At this point people don't know what items have already been minted from your machine. What if we could show all the NFTs ever minted from your drop? That would inspire others to mint their own NFT as well. It's actually pretty easy to do! Let's dive into some code

We are going to go back to the `CandyMachine` component and make some more changes. Head over to the `index.js` file and start by adding some new state properties we are going to use to store all the  metadata for each minted NFT:

```jsx
// State
const [machineStats, setMachineStats] = useState(null);
// New state property
const [mints, setMints] = useState([]);
```



Now that we have a way to store all our minted NFTs let's head over to the `getCandyMachineState` function and add the following code right under our `console.log` line:

```jsx
const data = await fetchHashTable(
  process.env.REACT_APP_CANDY_MACHINE_ID,
  true
);

if (data.length !== 0) {
  const requests = data.map(async (mint) => {
    // Get URI
    try {
      const response = await fetch(mint.data.uri);
      const parse = await response.json();
      console.log("Past Minted NFT", mint)

      // Get image URI
      return parse.image;
    } catch(e) {
      // If any request fails, we'll just disregard it and carry on
      console.error("Failed retrieving Minted NFT", mint);
      return null;
    }
  });

  // Wait for all requests to finish
  const allMints = await Promise.all(requests);

  // Filter requests that failed
  const filteredMints = allMints.filter(mint => mint !== null);

  // Store all the minted image URIs
  setMints(filteredMints);
}
```

Not too bad right? Let's go ahead and break some of these pieces down a little more.

```jsx
const data = await fetchHashTable(
  process.env.REACT_APP_CANDY_MACHINE_ID,
  true
);
```

`fetchHashTable` was another one of those functions that was given to you off the bat. I encourage you to take a look at it and try your best to understand it. Basically what it says is: *"Get all the accounts that have a minted NFT on this program and return the Token URI's which point to our metadata for that NFT".*

So once you call that we are going to need to actually fetch the metadata from the provided URI:

```jsx
if (data.length !== 0) {
  const requests = data.map(async (mint) => {
    // Get URI
    try {
      const response = await fetch(mint.data.uri);
      const parse = await response.json();
      console.log("Past Minted NFT", mint);
      
      // Get image URI
      return parse.image;
    } catch(e) {
      // If any request fails, we'll just disregard it and carry on
      console.error("Failed retrieving Minted NFT", mint);
      return null;
    }
  });
  
  // Wait for all requests to finish
  const allMints = await Promise.all(requests);
  
  // Filter requests that failed
  const filteredMints = allMints.filter(mint => mint !== null);
  
  // Store all the minted image URIs
  setMints(allMints);
}
```

Pretty simple here - we need to loop through every mint, get the Token URI, use it to fetch the `json` file and then parse out the asset address of each of our NFT! After we got them all, let's store them in our state and we are done.

Okay nice. If you start minting items you should start seeing parsed data with some data being printed out in your console.

![Untitled](https://i.imgur.com/ybqT4m5.png)

Let's start displaying this in our app now! We are going to start by making a render function that will render out a grid of these assets:

```jsx
const renderMintedItems = () => (
  <div className="gif-container">
    <p className="sub-text">Minted Items ✨</p>
    <div className="gif-grid">
      {mints.map((mint) => (
        <div className="gif-item" key={mint}>
          <img src={mint} alt={`Minted NFT ${mint}`} />
        </div>
      ))}
    </div>
  </div>
);
```

Nice. Now that we have this function ready to call, we actually need to place it in our component render function! Head over to the return block and add the following code:

```jsx
return (
  machineStats && (
    <div className="machine-container">
      <p>{`Drop Date: ${machineStats.goLiveDateTimeString}`}</p>
      <p>{`Items Minted: ${machineStats.itemsRedeemed} / ${machineStats.itemsAvailable}`}</p>
      <button className="cta-button mint-button" onClick={mintToken}>
          Mint NFT
      </button>
      {/* If we have mints available in our array, let's render some items */}
      {mints.length > 0 && renderMintedItems()}
    </div>
  )
);
```

EZPZ. Anytime our `mints` property changes, our component will see if it can be rendered or not! By this point you should have some NFTs minted. Go ahead and refresh your page and see if you get some images that render!

Note - this may take a bit of time so don't be alarmed if it doesn't appear right away! When we call `fetchHashTable`, it fetches all accounts that have interacted with the program (using `MetadataProgram.getProgramAccounts`) and that takes some time. After we get that info, we can request the metadata for all NFTs in parallel and it's smooth sailing until we get all those shiny minted images on your UI!

![Untitled](https://i.imgur.com/rRry6SK.png)

**Feel free to render other info that you get as well, like the "name" of the NFT, which # minted it is, or even the wallet address of the NFTs owner.**

Go crazy :).

### 🚨 Progress Report

*Please do this else Farza will be sad :(*

In `#progress` post a screenshot of your rendered NFTs! Maybe make a tweet here telling the world what you're up to. Be sure to tag `@_buildspace`.
