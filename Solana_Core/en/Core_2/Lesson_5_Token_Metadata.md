![](https://hackmd.io/_uploads/BJBIRn77o.png)

Token Metadata is the information of a token, like the name, the symbol, and the logo. Notice how the various tokens in your wallet have this stuff except the token you made?

![](https://hackmd.io/_uploads/r1D9xAm7i.png)

That's all metadata! This is applicable to **all** tokens, not just fungible currencies. On Solana, NFTs are just like any other tokens, except the metadata defines them as NFTs via attributes such as the decimals. 

This is all done using the [Token Metadata Program](https://docs.metaplex.com/programs/token-metadata/overview) - one of the most important programs when dealing with Tokens and NFTs on the Solana blockchain. Its main goal is to attach additional data to fungible or Non-Fungible Tokens on Solana. It does this using Program Derived Addresses (PDAs) that are derived from the address of Mint Accounts.

#### 🎭 The Token Metadata Account
Once we've made a shiny new token, we need to make it fancy. We'll use the Token Metadata Program to do this, here's what the generated account will look like:

![](https://hackmd.io/_uploads/Ska2-0Xms.png)

This is called the Metadata Account. It can store a variety of information about a specific Token Mint Account. You'll notice there's a `URI` (Uniform Resource Identifier) attribute - this points to a JSON file off-chain which is used mainly for NFTs. Since the off-chain portion isn't constrained by on-chain fees, you can store high quality graphics any other large data objects.

The Metadata account has a lot of values, you don't need to know about most of them. We'll dive into the relevant bits as we need them. Right now, we just care about the off-chain part, which is the first thing we'll need to make for Pizzacoin.

#### 🖼 The Token Standard
The off-chain portion follows the [Metaplex token standard](https://docs.metaplex.com/programs/token-metadata/token-standard), which is basically a format that you need to follow for implementing metadata for different types of tokens. We tell all the apps on the network which type our token is in the `Token Standard` field on the on-chain part of the Metadata account. Our options are:

- `NonFungible`: A non-fungible token with a Master Edition. (NFTs)
- `FungibleAsset`: A token with metadata that can also have attributes, sometimes called Semi-Fungible. (ex. game-items)
- `Fungible`: A token with simple metadata. (regular tokens like USDC or SOL)
- `NonFungibleEdition`: A non-fungible token with an Edition account (printed from a Master edition, think 1 of 100).

The Metaplex Token Standard is accepted throughout the industry. All the various apps, exchanges, and wallets expect tokens to conform to it. The Token Standard is set automatically by the Token Metadata program and cannot be manually updated. Here's how it figures out how to apply the correct standard:
- If the token has a **Master Edition account**, it is a `NonFungible`.
- If the token has an **Edition account**, it is a `NonFungibleEdition`.
- If the token has no (Master) Edition account (ensuring its supply can be > 1) and **uses zero decimals places**, it is a `FungibleAsset`.
- If the token has no (Master) Edition account (ensuring its supply can be > 1) and **uses at least one decimal place**, it is a `Fungible`.

You can ignore what "Master Edition" means right now, Pizzacoin is entirely fungible so we'll be focusing on `Fungible` tokens. 

![](https://hackmd.io/_uploads/Sk1zJeEQj.png)

#### 🧰 The Metaplex SDK
Welcome to one of the most useful SDKs on Solana. If you've ever minted an NFT on Solana, you've likely used the Metaplex SDK without knowing it. We'll use the `@metaplex-foundation/js` and `@metaplex-foundation/mpl-token-metadata` libraries to create a metadata account associated with our token mint. Time to give Pizzacoin an identity.

We'll start with the off-chain portion, and only once that's ready will we move on to creating the Token Metadata account.

The general workflow will be:
1. Set up the Metaplex SDK - you will likely use an existing keypair
2. Upload an image for the logo - we'll use a local file, but the SDK supports uploading from the browser too
3. Upload the off-chain metadata (along with the URI for the image you uploaded)
You are now ready to do the on-chain stuff.
4. Derive the Metadata Account PDA (the egg)
5. Create the on-chain Token Metadata account - instruction, transaction, etc.

Feeling unsure? Let's vanquish those feelings with some **CODE** 🤺
