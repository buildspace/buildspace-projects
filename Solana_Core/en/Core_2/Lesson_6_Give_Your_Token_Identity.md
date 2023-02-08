Time for the tokens to meet their maker (you). We'll resume where we left off in our previous build section. If you need, you can get the starter code from [here](https://github.com/buildspace/solana-token-client/tree/solution-without-burn) (make sure you're on the `solution-without-burn` branch).

Start by adding the new dependencies:
```
npm install @metaplex-foundation/js fs
npm install @metaplex-foundation/mpl-token-metadata
```

We'll be using the Metaplex SDK to add the metadata and the `fs` library so we can read the token logo image. Create a new folder called `assets` and add your logo. This will be on the testnet so have fun with it! I'm going with a pizza emoji so I named my file pizza.png lol

Metaplex will be doing all the heavy lifting for us so add these imports at the top in `index.ts`:
```ts
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  toMetaplexFile,
} from "@metaplex-foundation/js"
import {
  DataV2,
  createCreateMetadataAccountV2Instruction,
  createUpdateMetadataAccountV2Instruction,
} from "@metaplex-foundation/mpl-token-metadata"
import * as fs from "fs"
```

Now that we have everything set up, we'll start the metadata bits. We'll do the off-chain part first, then create the token metadata account.

At a high level here's what'll need to happen:
1. Convert the image file to metaplex file using `toMetaplexFile()`
2. Upload the image using `metaplex.storage().upload`
3. Upload off-chain metadata using `metaplex.uploadMetadata()`
4. Derive the metadata account PDA using `findMetadataPda()` 
5. Build on-chain data format of type `DataV2`
6. Build instruction to create metadata account using `createCreateMetadataAccountV2Instruction` (not a typo lol)
7. Send transaction with instruction to create the token metadata account

There's a lot happening here, but it's all basic stuff. Take a moment to go through this, you know everything that's going on!

We'll create a single function to do all this:
```ts
async function createTokenMetadata(
  connection: web3.Connection,
  metaplex: Metaplex,
  mint: web3.PublicKey,
  user: web3.Keypair,
  name: string,
  symbol: string,
  description: string
) {
  // file to buffer
  const buffer = fs.readFileSync("assets/pizza.png")

  // buffer to metaplex file
  const file = toMetaplexFile(buffer, "pizza.png")

  // upload image and get image uri
  const imageUri = await metaplex.storage().upload(file)
  console.log("image uri:", imageUri)

  // upload metadata and get metadata uri (off chain metadata)
  const { uri } = await metaplex
    .nfts()
    .uploadMetadata({
      name: name,
      description: description,
      image: imageUri,
    })
 
  console.log("metadata uri:", uri)

  // get metadata account address
  const metadataPDA = metaplex.nfts().pdas().metadata({mint})

  // onchain metadata format
  const tokenMetadata = {
    name: name,
    symbol: symbol,
    uri: uri,
    sellerFeeBasisPoints: 0,
    creators: null,
    collection: null,
    uses: null,
  } as DataV2

  // transaction to create metadata account
  const transaction = new web3.Transaction().add(
    createCreateMetadataAccountV2Instruction(
      {
        metadata: metadataPDA,
        mint: mint,
        mintAuthority: user.publicKey,
        payer: user.publicKey,
        updateAuthority: user.publicKey,
      },
      {
        createMetadataAccountArgsV2: {
          data: tokenMetadata,
          isMutable: true,
        },
      }
    )
  )

  // send transaction
  const transactionSignature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [user]
  )

  console.log(
    `Create Metadata Account: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
  )
}
```

Make sure you update the file name! Also, don't worry about the `nfts()` call - Metaplex was initially built for NFTs and was recently expanded to work for fungible tokens too.

You'll notice we're leaving a bunch of stuff null here - that's cause you don't need to set that stuff when making fungible tokens. Non-fungible tokens have more specific behaviour that you need to define. 

I *could* go over this function bit by bit but I'd just be repeating myself lol. More important than *how* this works, is knowing how to get to it. You need to read docs to use the APIs to make functions like these.

I'm talking about learning how to fish instead of just taking this fish. 

Your first resource should **always** be the docs. But the docs won't exist when the code is just being written. So you do just that - look at the code as it's being written. If you were to poke around in the Metaplex repo, you'd see these:

- [Function definition docs for createMetadataAccountV2 instruction](https://metaplex-foundation.github.io/metaplex-program-library/docs/token-metadata/index.html#createCreateMetadataAccountV2Instruction)
- [Actual function definition for the createCreateMetadataAccountV2Instruction instruction](https://github.com/metaplex-foundation/metaplex-program-library/blob/caeab0f7/token-metadata/js/src/generated/instructions/CreateMetadataAccountV2.ts#L73)
- [The test for createMetadataAccountV2 instruction](https://github.com/metaplex-foundation/js/blob/c171e1e31d9fe12852afb39e449123339848180e/packages/js/test/plugins/nftModule/createNft.test.ts#L465)

There's not much science to this, you need to get in the code and find what you need. You'll have to understand the primitives that the code is built on (Solana instructions in this case) and it'll take a few tries, but the rewards will be massive.

Generally what I try to do is:
- search/ask in discord (metaplex, anchor, etc)
- search/ask on stackexchange
- look through the project/program repo, if you're trying to figure out how to set up instructions for a program try to reference the tests
- alternatively, if there are no tests to reference copy/paste GitHub and hope to find a reference somewhere

Hopefully, that gives you an idea of how the pioneers do it :)

Back to our regularly scheduled building!

Remember the token mint address you saved earlier? We'll be using that when we call this new function in `main`. If you've lost the token mint account address, you can always just look up the wallet address using the [explorer](https://explorer.solana.com/?cluster=devnet) and check Tokens tab.

![](https://hackmd.io/_uploads/rynIYBrXj.png)

Here's what our updated `main()` function will look like when calling the `createTokenMetadata` function:

```ts
async function main() {
  const connection = new web3.Connection(web3.clusterApiUrl("devnet"))
  const user = await initializeKeypair(connection)

  console.log("PublicKey:", user.publicKey.toBase58())

  // MAKE SURE YOU REPLACE THIS ADDRESS WITH YOURS!
  const MINT_ADDRESS = "87MGWR6EbAqegYXr3LoZmKKC9fSFXQx4EwJEAczcMpMF"

  // metaplex setup
  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(user))
    .use(
      bundlrStorage({
        address: "https://devnet.bundlr.network",
        providerUrl: "https://api.devnet.solana.com",
        timeout: 60000,
      })
    )
  
  // Calling the token 
  await createTokenMetadata(
    connection,
    metaplex,
    new web3.PublicKey(MINT_ADDRESS),
    user,
    "Pizza", // Token name - REPLACE THIS WITH YOURS
    "PZA",     // Token symbol - REPLACE THIS WITH YOURS
    "Whoever holds this token is invited to my pizza party" // Token description - REPLACE THIS WITH YOURS
  )
}
```

Update the mint address and the token details and smash `npm run start`, you'll see something like this:
```
> solana-course-client@1.0.0 start
> ts-node src/index.ts

Current balance is 1.996472479
PublicKey: 5y3G3Rz5vgK9rKRxu3BaC3PvhsMKGyAmtcizgrxojYAA
image uri: https://arweave.net/7sDCnvGRJAqfgEuGOYWhIshfgTC-hNfG4NSjwsKunQs
metadata uri: https://arweave.net/-2vGrM69PNtb2YaHnOErh1_006D28JJa825CIcEGIok
Create Metadata Account: https://explorer.solana.com/tx/4w8XEGCJY82MnBnErW9F5r1i5UL5ffJCCujcgFeXS8TTdZ6tHBEMznWnPoQXVcsPY3WoPbL2Nb1ubXCUJWWt2GWi?cluster=devnet
Finished successfully
```

Everything necessary has been done all at once! Feel free to hit the Arweave links - it's like decentralized & permanent AWS S3/Google Cloud storage and will show you what the uploaded assets look like. 

If you head back to your token mint account on the explorer, you'll see the fancy new icon and name. Here's mine:

![](https://hackmd.io/_uploads/B11-Arrms.png)

As a wise philosopher once said,
![](https://media.tenor.com/Da1ZhyJ_Ew8AAAAC/spider-man-pizza-time.gif)

One of the coolest parts of the token metadata program is how easy it is to update. All you need to do is change the transaction from `createCreateMetadataAccountV2Instruction` to `createUpdateMetadataAccountV2Instruction`:
```ts
async function updateTokenMetadata(
  connection: web3.Connection,
  metaplex: Metaplex,
  mint: web3.PublicKey,
  user: web3.Keypair,
  name: string,
  symbol: string,
  description: string
) {

  ... 
  
  // transaction to update metadata account
  const transaction = new web3.Transaction().add(
    createUpdateMetadataAccountV2Instruction(
      {
        metadata: metadataPDA,
        updateAuthority: user.publicKey,
      },
      {
        updateMetadataAccountArgsV2: {
          data: tokenMetadata,
          updateAuthority: user.publicKey,
          primarySaleHappened: true,
          isMutable: true,
        },
      }
    )
  )
  
  // Everything else remains the same
  ...
}
```

Your token is now complete! Make sure you spread the love. Maybe send some tokens to your friends or other builders in the Discord server. Share your address in #progress so people can airdrop you their tokens :D

#### 🚢 Ship challenge
Young glass chewer, it's time to reimplement the lesson concepts from scratch.

Try to build a single transaction that includes the following instructions:

* create a new token mint
* create a metadata account for the token mint
* create a token account
    * try to add this instruction conditionally if you can
    * Hint: Reference the implementation for `getOrCreateAssociatedTokenAccount`
    * Hint: https://github.com/solana-labs/solana-program-library/blob/48fbb5b7c49ea35848442bba470b89331dea2b2b/token/js/src/actions/getOrCreateAssociatedTokenAccount.ts#L35
* mints tokens

This is pretty much exactly how you'll be doing it in production - everything together all at once.

**Note**
This is a bit more freeform than normal. Push yourself. Experiment. Really try to understand each piece of the puzzle.

To do this the way we're envisioning, you will need to build each instruction and then add all of them to a single transaction. Once you've wrestled with this on your own, you can view one possible implementation on the challenge branch of this [repository](https://github.com/Unboxed-Software/solana-token-metadata).
![](https://hackmd.io/_uploads/H1QZWUBmj.png)

Extra hint: https://solana-labs.github.io/solana-program-library/token/js/modules.html - look at the source code, don't use the helper functions.
