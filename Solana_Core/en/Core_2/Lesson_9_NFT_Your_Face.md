What better to make an NFT of than your face? You get to immortalise yourself as an early buildooor and you can tell your mom you're on the blockchain.

We'll start with a client 
```
npx create-solana-client [name] --initialize-keypair
cd [name]
```

Bring in the big guns:
```
npm install @metaplex-foundation/js fs
```

Add two images to the `src` folder. We'll use one as the initial image and the second as the updated image.

Here are the imports we'll need, nothing new here:
```ts
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js"
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  toMetaplexFile,
  NftWithToken,
} from "@metaplex-foundation/js"
import * as fs from "fs"
```

It's easier if we declare constants so we can change variables between creating and updating NFTs
```ts
const tokenName = "Token Name"
const description = "Description"
const symbol = "SYMBOL"
const sellerFeeBasisPoints = 100
const imageFile = "test.png"

async function main() {
		...
}
```

We won't create a helper function, instead we can just put everything in `main()`. We'll start by creating a `Metaplex` instance:
```ts
async function main() {
  ...

  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(user))
    .use(
      bundlrStorage({
        address: "https://devnet.bundlr.network",
        providerUrl: "https://api.devnet.solana.com",
        timeout: 60000,
      })
    )
}
```
To upload the image, we need to: 
- read image file
- convert to metaplex file
- upload image

```ts
async function main() {
	...

  // file to buffer
  const buffer = fs.readFileSync("src/" + imageFile)

  // buffer to metaplex file
  const file = toMetaplexFile(buffer, imageFile)

  // upload image and get image uri
  const imageUri = await metaplex.storage().upload(file)
  console.log("image uri:", imageUri)
}
```

And finally we can upload the metadata using the image URI we'll get:
```ts
async function main() {
	...

  // upload metadata and get metadata uri (off chain metadata)
  const { uri } = await metaplex
    .nfts()
    .uploadMetadata({
      name: tokenName,
      description: description,
      image: imageUri,
    })
    .run()

  console.log("metadata uri:", uri)
}
```

A dedicated mint NFT function is a good idea here, put this outside main:
```ts
// create NFT
async function createNft(
  metaplex: Metaplex,
  uri: string
): Promise<NftWithToken> {
  const { nft } = await metaplex
    .nfts()
    .create({
      uri: uri,
      name: tokenName,
      sellerFeeBasisPoints: sellerFeeBasisPoints,
      symbol: symbol,
    })
    .run()

  console.log(
    `Token Mint: https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`
  )

  return nft
}
```

And now you can just call it at the end of your `main()` function:
```
async function main() {
	...
	
  await createNft(metaplex, uri)
}
```

We're ready to mint our NFT! Run the script with `npm start` and hit the Solana Explrer URL in your terminal, you should see something like this:

![](https://hackmd.io/_uploads/B1cb9cqXs.png)

We just made an NFT on Solana 🎉🎉🎉. That was as easy as warming up precooked meal. 

#### 🤯 Update your NFT
To wrap this up, let's quickly take a look at how we can update the NFT we just minted. 

At the top of your script, update the `imageFile` constant to the name of the final image of your NFT.

The only other thing that changes is the Metaplex method we call. Add this anywhere outside main:
```ts
async function updateNft(
  metaplex: Metaplex,
  uri: string,
  mintAddress: PublicKey
) {
  // get "NftWithToken" type from mint address
  const nft = await metaplex.nfts().findByMint({ mintAddress })

  // omit any fields to keep unchanged
  await metaplex
    .nfts()
    .update({
      nftOrSft: nft,
      name: tokenName,
      symbol: symbol,
      uri: uri,
      sellerFeeBasisPoints: sellerFeeBasisPoints,
    })

  console.log(
    `Token Mint: https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`
  )
}
```

Now in main, you can comment out the `createNFT` call and use the `updateNFT` helper function:
```ts
async function main() {

  ...

  // await createNft(metaplex, uri)

  // You can get this from the Solana Explorer URL 
  const mintAddress = new PublicKey("EPd324PkQx53Cx2g2B9ZfxVmu6m6gyneMaoWTy2hk2bW")
  await updateNft(metaplex, uri, mintAddress)
}
```

You can get the mint address from the URL that was logged when you minted the NFT. It's in seveal places - the URL itself, the "Address" property and the metadata tab. 

![](https://hackmd.io/_uploads/H17jnFjXo.png)
