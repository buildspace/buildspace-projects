We're here. Didn't take too long. Monkey pictures. Apes. Rocks. Some other animal-themed profile picture that looks ugly as heck but sells for $100k, that's what an NFT is.

Unlike Ethereum, NFTs are super cheap to mint on Solana which makes them extra fun. Even in these bear market days it's like $5 to mint an NFT on ETH, which is pretty lame. Why do I need to pay $5 to make my meme immortal?

#### 🫣 NFTs are tokens
One of the big reasons NFTs are so cheap on Solana is because they're not an extra special piece of code - they're just regular tokens but with additional data attached. 

![](https://hackmd.io/_uploads/HkhxqLS7s.png)

The first major difference is the mint account. With NFTs, the mint account
- Has **a supply of 1**, meaning only one token is in circulation.
- Has **zero decimals**, meaning there cannot be such a thing as 0.5 tokens.
- Has **no mint authority**, meaning no one can ever mint additional tokens.

As you can probably guess, the additional data is stored in program derived accounts. Let's meet these new accounts :D

#### 🐙 Master Edition Account
![](https://hackmd.io/_uploads/B1RMVWNQi.png)

The Token Metadata program offers another account specifically for NFTs called the **Master Edition Account.** Instead of voiding the Mint Authority, it will transfer both the Mint Authority and the Freeze Authority to the Master Edition PDA.

In other words, the Mint Authority is transferred to a PDA that belongs to the Token Metadata program. This ensure no one can mint or freeze tokens without going through the Token Metadata program. 

Only an instruction provided by the program could make use of it and such instruction does not exist on the program. The reason for this is to enable Metaplex to deploy upgrades to the Token Metadata program and migrating existing NFTs to the new version.

#### 🪰 Editions Account
![](https://hackmd.io/_uploads/HJOD68Smo.png)

In addition to being Non-Fungibility evidence, the Master Edition account also allows users to print one or multiple copies of an NFT. This feature allows creators to offer multiple copies of their 1/1 NFTs.

The Master Edition account contains an optional `Max Supply` attribute: 
- If set to `0`, printing is disabled.
- If set to `None`, an unlimited amount of copies can be printed.

#### 🧰 Metaplex SDK
Doing all this is made easy by our new best friend the Metaplex SDK. It lets you create and update NFTs easily - you give it the bare minimum and it fills in the rest with the default values.

Just like the token metadata, we'll use the same process to: 
- Upload an image
- Upload the metadata
- Then use the metadata uri to create an NFT

Can you guess what the code will look like? Try to visualise it in your head before we go ahead and smash it out :)
