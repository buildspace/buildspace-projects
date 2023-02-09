
Let's walk through one possible solution for gear tokens. 

The solution code we're walking through is on the `solution-simple-gear` branch of the [Buildoors Frontend repository](https://github.com/jamesrp13/buildspace-buildoors/tree/solution-simple-gear). Try to build this on your own if you haven't already rather than copy-pasting from solution code.

We'll be looking at two different repositories. If you recall, we had the creation of the BLD token and our NFTs in the client-side project. It just happens that's where we did the work, we could if we wanted, move that over to the program project. 

You can find the images of the gear in the `/tokens/gear/assets` folder. Instead of these being NFTs, we've chosen to make them fungible assets, or SPL tokens with associated metadata and 0 decimals, this is so they're not limited to just one unit.

The script inside [`/tokens/gear/index.ts`](https://github.com/jamesrp13/buildspace-buildoors/blob/solution-simple-gear/tokens/gear/index.ts) is responsible for generating our mints associated with these assets, and stores them in the `cache.json` file in the same folder.

Inside the script, toward the bottom you'll see our main function.

``` typescript
async function main() {
  const connection = new web3.Connection(web3.clusterApiUrl("devnet"))
  const payer = await initializeKeypair(connection)

  await createGear(
    connection,
    payer,
    new web3.PublicKey("6GE3ki2igpw2ZTAt6BV4pTjF5qvtCbFVQP7SGPJaEuoa"),
    ["Bow", "Glasses", "Hat", "Keyboard", "Mustache"]
  )
}

```

The public key we pass in is for our program, and the list of the names of the mints, which need to correspond to what's in the assets folder.

If you scroll up in the function, you'll see it first starts out with an empty object where the mints will go. 

` let collection: any = {} `

Then we create our metaplex object, followed by a loop, which executes the functionality of the script for every single mint. 

It starts with an empty array of mints, this is so we can add multiple mints per asset. 

`let mints: Array<string> = []`

Then we get the image buffer and upload it to Arweave.

``` typescript
const imageBuffer = fs.readFileSync(`tokens/gear/assets/${assets[i]}.png`)
const file = toMetaplexFile(imageBuffer, `${assets[i]}.png`)
const imageUri = await metaplex.storage().upload(file)
```
After that, for as many times as you want different xp levels, for this gear, let's loop through that many times -- our example is only doing it once since we're starting and ending as xp level 10. If you want five of each, simply increase our upper bound to 50, `xp <= 50`.

`for (let xp = 10; xp <= 10; xp += 10)...`

Once inside the loop, we grab the mint auth that we will assign down the road, this it he PDA on the program that we want to be doing the minting -- the PDA for the lootbox program.

``` typescript
const [mintAuth] = await web3.PublicKey.findProgramAddress(
    [Buffer.from("mint")],
    programId
  )
```

We then create a brand new mint and set its decimal to 0, as it is a non-divisible asset.

``` typescript
 const tokenMint = await token.createMint(
    connection,
    payer,
    payer.publicKey,
    payer.publicKey,
    0
  )
```

Once that mint is created, we push it into the mints array. 

` mints.push(tokenMint.toBase58())`

Next we upload our off-chain metadata, which is a name, description, an image uri, and two attributes. 

``` typescript
const { uri } = await metaplex
    .nfts()
    .uploadMetadata({
      name: assets[i],
      description: "Gear that levels up your buildoor",
      image: imageUri,
      attributes: [
        {
          trait_type: "xp",
          value: `${xp}`,
        },
      ],
    })
    .run()
```

Then we grab the metadata PDA for that mint.

`const metadataPda = await findMetadataPda(tokenMint)`

Next we create the on-chain version of the metadata.

``` typescript
 const tokenMetadata = {
    name: assets[i],
    symbol: "BLDRGEAR",
    uri: uri,
    sellerFeeBasisPoints: 0,
    creators: null,
    collection: null,
    uses: null,
  } as DataV2
```

Followe by creating our V2 instruction as we have done previously.

``` typescript
const instruction = createCreateMetadataAccountV2Instruction(
    {
      metadata: metadataPda,
      mint: tokenMint,
      mintAuthority: payer.publicKey,
      payer: payer.publicKey,
      updateAuthority: payer.publicKey,
    },
    {
      createMetadataAccountArgsV2: {
        data: tokenMetadata,
        isMutable: true,
      },
    }
  )
```

You'll notice our mint authority is our payer, we will change this shortly.

We then create a transaction, add the instruction and send it.

``` typescript
const transaction = new web3.Transaction()
  transaction.add(instruction)

  const transactionSignature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [payer]
  )
```

And now we change the authority to be the mintAuth, which is the PDA on the lootbox program.

``` typescript
 await token.setAuthority(
    connection,
    payer,
    tokenMint,
    payer.publicKey,
    token.AuthorityType.MintTokens,
    mintAuth
  )
}
```

Finally, outside that inner loop, we put the mints in the array, so the first one would be 'Bow' (for our example).

`collection[assets[i]] = mints`

Finally, outside all the loops, we write to file the entire collection, which will just be five items for our implementation.

`fs.writeFileSync("tokens/gear/cache.json", JSON.stringify(collection))`

This is just one way to do it, it's quite a simple solution. If you've not already built your code, and you watched this, try to do it on your own, and then come back and use the solution code if need be.

