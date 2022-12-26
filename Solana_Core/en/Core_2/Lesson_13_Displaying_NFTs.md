What good is an NFT if you can’t show it off! In this lesson, we’re going to help you shake that money-maker (assuming your NFT is a money-maker) by displaying it in a wallet and then displaying it in the Candy Machine.

You might be wondering what the point of this is. Imagine your friend mints a cool Pepe NFT from your collection on your website. They mint a lot of pepe-related stuff so they have dozens of NFTs in their wallet. How are they supposed to know which one is from your collection? You gotta show them!

You'll remember from week 1 that everything we want is stored in accounts. Meaning you *can* just fetch their NFTs using just the wallet address, but it's a lot more work.

Instead, we'll use the Metaplex SDK which makes it as simple as an API call. Here's what it'll look like:

![](https://hackmd.io/_uploads/SJCYQk2Qo.png)

You've got the usual Metaplex setup stuff, but we're using `walletAdapterIdentity` instead of `keypairIdentity` for our connection since we don't want their keypair lol. Once we've done that we can just use the Metaplex object to call the `findAllByOwner` method. 

Here's what the NFT data for a single NFT would look like printed onto the console, we care mainly about the `uri` field:

![](https://hackmd.io/_uploads/Sk4GVk3Xo.png)

Btw there's also a bunch of other ways you can fetch NFTs:

![](https://hackmd.io/_uploads/HkdnmJnms.png)

Let's write some code!
