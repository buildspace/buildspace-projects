Time to get back to shipping our custom NFT staking app. We'll use our learnings with the token program and the candy machine to build out our app.

Go ahead and create a new folder named `tokens` in your root directory. Inside that folder, we'll need to create 2 more folders named `bld` and `candy-machine`. It should look something like this:

![](https://i.imgur.com/ZlT3TxP.png)

The reason why we're creating this is for our reward tokens when we stack our Builder and also for our NFT related stuff.

Now let's start creating our assets folder. This will be used for the image of our token. Go into your `bld` folder and create a new folder named `assets` and create a new file named `index.ts` inside of your `bld` folder. It should look something like this

```text
├── styles
├── tokens
│   ├── bld
│   |   ├── assets
│   |   ├── index.ts
```

_Note: Make sure that your index.ts file is inside your bld folder and not inside your assets folder_

You'll notice that your `index.ts` file is highlighted in red. This is because we currently don't have any code yet. Let's fix that by adding some code to your `index.ts`. We'll also need to shift our `initializeKeypair` file into the `bld` folder. You will also need to add an image to your `bld/assets` folder which will be your token image.

```javascript
import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";
import { initializeKeypair } from "./initializeKeypair";

async function main() {
  const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
  const payer = await initializeKeypair(connection);
}

main()
  .then(() => {
    console.log("Finished successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
```

Awesome! Now that we have the code to get started, let's paste the next chunk of code into your `index.ts` file. You can place it above your `main` function.

```javascript
import * as fs from "fs";
import {
  bundlrStorage,
  findMetadataPda,
  keypairIdentity,
  Metaplex,
  toMetaplexFile,
} from "@metaplex-foundation/js";

import {
  DataV2,
  createCreateMetadataAccountV2Instruction,
} from "@metaplex-foundation/mpl-token-metadata";

const TOKEN_NAME = "BUILD";
const TOKEN_SYMBOL = "BLD";
const TOKEN_DESCRIPTION = "A token for buildoors";
const TOKEN_IMAGE_NAME = "unicorn.png"; // Replace unicorn.png with your image name
const TOKEN_IMAGE_PATH = `tokens/bld/assets/${TOKEN_IMAGE_NAME}`;

async function createBldToken(
  connection: web3.Connection,
  payer: web3.Keypair
) {
    // This will create a token with all the necessary inputs
    const tokenMint = await token.createMint(
        connection, // Connection
        payer, // Payer
        payer.publicKey, // Your wallet public key
        payer.publicKey, // Freeze authority
        2 // Decimals
    );

    // Create a metaplex object so that we can create a metaplex metadata
    const metaplex = Metaplex.make(connection)
        .use(keypairIdentity(payer))
        .use(
        bundlrStorage({
            address: "https://devnet.bundlr.network",
            providerUrl: "https://api.devnet.solana.com",
            timeout: 60000,
        })
        );

    // Read image file
    const imageBuffer = fs.readFileSync(TOKEN_IMAGE_PATH);
    const file = toMetaplexFile(imageBuffer, TOKEN_IMAGE_NAME);
    const imageUri = await metaplex.storage().upload(file);

    // Upload the rest of offchain metadata
    const { uri } = await metaplex
        .nfts()
        .uploadMetadata({
        name: TOKEN_NAME,
        description: TOKEN_DESCRIPTION,
        image: imageUri,
        })
        .run();

    // Finding out the address where the metadata is stored
    const metadataPda = findMetadataPda(tokenMint);
    const tokenMetadata = {
        name: TOKEN_NAME,
        symbol: TOKEN_SYMBOL,
        uri: uri,
        sellerFeeBasisPoints: 0,
        creators: null,
        collection: null,
        uses: null,
    } as DataV2

    const instruction = createCreateMetadataAccountV2Instruction({
        metadata: metadataPda,
        mint: tokenMint,
        mintAuthority: payer.publicKey,
        payer: payer.publicKey,
        updateAuthority: payer.publicKey
    },
    {
        createMetadataAccountArgsV2: {
            data: tokenMetadata,
            isMutable: true
        }
    })

    const transaction = new web3.Transaction()
    transaction.add(instruction)

    const transactionSignature = await web3.sendAndConfirmTransaction(
        connection,
        transaction,
        [payer]
    )
}

// The rest of your main function
```

#### 🥳 Code breakdown
Aight let's break that all down, it's easy as lemonade.

In here, we're calling the `createMint` function to create an intialize a new mint. You can read more about this function [here](https://solana-labs.github.io/solana-program-library/token/js/modules.html#createMint)

```javascript
// This will create a token with all the necessary inputs
const tokenMint = await token.createMint(
  connection, // Connection
  payer, // Payer
  payer.publicKey, // Your wallet public key
  payer.publicKey, // Freeze authority
  2 // Decimals
);
```

Next, we're creating a metaplex object so that it can generate a metaplex metadata and upload it to bundlrStorage.

```javascript
// Create a metaplex object so that we can create a metaplex metadata
const metaplex = Metaplex.make(connection)
  .use(keypairIdentity(payer))
  .use(
    bundlrStorage({
      address: "https://devnet.bundlr.network",
      providerUrl: "https://api.devnet.solana.com",
      timeout: 60000,
    })
  );
```

This section is pretty self explanatory. We're now trying to read the image file that we placed in the `bld/assets` folder and upload the metadata to the storage.

```javascript
// Read image file
const imageBuffer = fs.readFileSync(TOKEN_IMAGE_PATH);
const file = toMetaplexFile(imageBuffer, TOKEN_IMAGE_NAME);
const imageUri = await metaplex.storage().upload(file);
// Upload the rest of offchain metadata
const { uri } = await metaplex
  .nfts()
  .uploadMetadata({
    name: TOKEN_NAME,
    description: TOKEN_DESCRIPTION,
    image: imageUri,
  })
  .run();
```

Once we've successfully uploaded our image to metaplex, we'll then fetch the address by calling the following section below.

```javascript
 // Finding out the address where the metadata is stored
const metadataPda = findMetadataPda(tokenMint);
const tokenMetadata = {
    name: TOKEN_NAME,
    symbol: TOKEN_SYMBOL,
    uri: uri,
    sellerFeeBasisPoints: 0,
    creators: null,
    collection: null,
    uses: null,
} as DataV2

const instruction = createCreateMetadataAccountV2Instruction({
    metadata: metadataPda,
    mint: tokenMint,
    mintAuthority: payer.publicKey,
    payer: payer.publicKey,
    updateAuthority: payer.publicKey
},
{
    createMetadataAccountArgsV2: {
        data: tokenMetadata,
        isMutable: true
    }
})

const transaction = new web3.Transaction()
transaction.add(instruction)
const transactionSignature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [payer]
)
```

#### 🫙 Storing of metadata
Now that we've created our mint with all the metadata below. Let's move on to the next step! We'll now be writing our metadata file to our folder by writing this code in.

Just below where you defined your `transactionSignature`, let's place this code in.

```javascript
fs.writeFileSync(
  "token/bld/cache.json",
  JSON.stringify({
    mint: tokenMint.toBase58(),
    imageUri: imageUri,
    metadataUri: uri,
    tokenMetadata: metadataPda.toBase58(),
    metadataTransaction: transactionSignature,
  })
);
```

Great! Now we're done writing our `createBldToken` function. Now, let's start calling the function in our `main` function below. This is how your `main` function should look now.

```javascript
async function main() {
  const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
  const payer = await initializeKeypair(connection);

  await createBldToken(connection, payer);
}
```

That's it. You're done now. Let's start running our code.

#### 🚀 Running our code
Open up your terminal in VS Code. You'll first need to install a module named `ts-node`. This is essential as we'll be running some typescript commands. Type `npm install --save-dev ts-node` into the terminal. Now, headover to your `package.json` and add this line to your `scripts` section.

`"create-bld-token": "ts-node ./tokens/bld/index.ts"`.

This is how it should look now.

![](https://i.imgur.com/JzMArbs.png)

Remember to save your changes! You should now be able to use the new commands you added by running `npm run create-bld-token` in your terminal. This should start creating and minting your token for you in the devnet. Once that's done, you should be able to see a `cache.json` generated in your folder. Open it up, it should look like this.

![](https://i.imgur.com/nBwN6Ii.png)

Go ahead and copy the address listed in the `mint` and paste it in https://explorer.solana.com/?cluster=devnet. You should now be able to see your token with the image you selected, like this

![](https://i.imgur.com/9374BYr.png)
