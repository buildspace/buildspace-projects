### 🙉 A note on github

**If uploading to Github, don't upload your hardhat config file with your private key to your repo. You will get robbed.**

I use dotenv for this.

```bash
npm install --save dotenv
```

```solidity
require('@nomiclabs/hardhat-waffle');
require('dotenv').config();

module.exports = {
  solidity: '0.8.10',
  networks: {
    mumbai: {
      url: process.env.STAGING_QUICKNODE_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
    mainnet: {
      chainId: 1,
      url: process.env.PROD_QUICKNODE_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
```

And your .env file would look something like:

```
STAGING_QUICKNODE_KEY=BLAHBLAH
PROD_QUICKNODE_KEY=BLAHBLAH
PRIVATE_KEY=BLAHBLAH
```

(don't commit your `.env` after this lol, make sure it's in your `.gitignore` file).

Remember the change we made to `.gitignore` earlier? You can now revert it by removing the `hardhat.config.js` line, because now that file only contains variables representing your keys, and not your actual key info.

### 🌎 Upgrade your immortal domain NFTs with IPFS

Think about where your NFT assets are actually stored right now. They're on the Ethereum blockchain! This is awesome for lots of reasons, but it has a few issues. Mainly, it's **very expensive** because of how much storage costs on Ethereum. Contracts also have a length limit, so if you make a really fancy animated SVG that's very long, it won't fit in a contract. 

Luckily we have something called [IPFS](https://en.wikipedia.org/wiki/InterPlanetary_File_System), which is essentially a distributed file system. Today — you might use something like S3 or GCP Storage. But, in this case we can simply trust IPFS which is run by strangers who are using the network. Give [this](https://decrypt.co/resources/how-to-use-ipfs-the-backbone-of-web3) a quick read when you can! Covers a lot of good base knowledge :). Really, all you need to know is that IPFS is the industry standard for storing NFT assets. It's immutable, permanent, and decentralized. 

Using it is pretty simple. All you need to do is upload your NFTs to IPFS and then use the unique content ID hash it gives you back in your contract instead of the Imgur URL or SVG data.

First, you'll need to upload your images to a service that specializes in "[pinning](https://docs.ipfs.io/how-to/pin-files/)" — which means your file will essentially be cached so its easily retrievable. I like using [**Pinata**](https://www.pinata.cloud/?utm_source=buildspace) as my pinning service — they give you 1 GB of storage for free, which is enough for 1000s of assets. Just make an account, upload your character's image files through their UI, and that's it! 

![Untitled](https://i.imgur.com/lTpmIIj.png)

Go ahead and copy the files "CID". This is the files content address on IPFS! What's cool now is we can create this link:

```javascript
https://cloudflare-ipfs.com/ipfs/INSERT_YOUR_CID_HERE
```

If you are using **Brave Browser** (which has IPFS built in) you can just type this paste into the URL:

```javascript
ipfs://INSERT_YOUR_CID_HERE
```

And that'll actually start an IPFS node on your local machine and retrieve the file! If you try to do it on something like Chrome it just does a Google search lol. Instead you'll have to use the `cloudflare-ipfs` link.

![Untitled](https://i.imgur.com/qaKTEgb.png)

From here, we just need to update our `tokenURI` function to prepend `ipfs://`. Basically, OpenSea likes when our image URI is structured like this: `ipfs://INSERT_YOUR_CID_HERE`. 

Here's what your `_setTokenURI` function should look like:
```javascript
_setTokenURI(newDomainId, "ipfs://INSERT_YOUR_CID_HERE")
```

And now you know how to use IPFS! There's a catch in our scenario though - we're dynamically generating the SVG code on-chain. You can't upload assets to IPFS from inside contracts, so you'll have to generate the SVGs in your browser or a dedicated server, upload them to IPFS, and pass the CIDs into your mint function as a string.  

I'm just going to leave this for you to explore, but, sometimes you won't want to store your NFTs on-chain. Perhaps you want to have a video as the domain NFT. Doing it on-chain would be wildly expensive due to gas fees.

Remember, an NFT is just a JSON file at the end of the day that links to some metadata. You can put this JSON file up on IPFS. You can also put the NFT data itself (ex an image, video, etc) up on IPFS. Don't overcomplicate it :).

**A large percentage of NFTs use IPFS. It's the most popular way to store NFT data today.**

I'll leave it to you to explore!! ;)

### 🚀 Deploy to the world

Deploying a React app has gotten so easy that there is no reason not to do it at this point lol. Plus, it's **free**. You've made it this far, deploying is the final step. Plus -- your fellow builders at buildspace must not be deprived of your awesome domains!! Please give us the opportunity to give you testnet money hehe.

Here’s a quick video Farza made on deploying via Vercel. If you don't want to use Vercel, all good. Use whatever you want.

Basically:

- Push your latest front-end code up to Github. Don't commit `.env`.
- Connect Vercel to your repo.
- Make sure to set your root to `app`.
- Add in your `.env` variables (since we won't be committing our `.env` file).
- Deploy.
- Done.

Note: On Vercel, you will need to add an extra environment variable `CI=false`. This will make sure our build doesn't fail because of warnings.

[Loom](https://www.loom.com/share/ce89a285b90a4b34ac358fce9ae7f92d)

![https://i.imgur.com/wn2Uhj4.png](https://i.imgur.com/wn2Uhj4.png)

### 🥞 Careers in Web3

We’re constantly seeing people nail their interviews at web3 companies after they do a few buildspace projects.

![https://i.imgur.com/QrFjlNH.png](https://i.imgur.com/QrFjlNH.png)

**People seem to think web3 just needs people who can code smart contracts or write code that interfaces w/ the blockchain. Not true.**

There is so much work to do and most of the work doesn't even have to do w/ smart contracts lol. **Being an engineer in web3 just means you take your web2 skills and apply them to web3.**

I want to quickly go over wtf it means to "work in web3" as an engineer. *Do you need to be a pro at Solidity? Do you need to know how every little thing about the blockchain works?*

For example, let's say you're a great frontend engineer. If you finished this project, **you have almost everything you need to be a great frontend engineer at a web3 company**. For example, the company may say "Hey — pls go and build our connect to wallet feature" — and you'd already have a solid idea on how to do that :).

I just wanna inspire you to work in web3 lol. This shit is awesome. And it'd be cool if you gave it a shot ;).

Be sure you click "Work in Web3" on the left and fill out your profile if you haven't done so already!!! **We're partnered w/ some of the best web3 companies in the world (ex. OpenSea, Chainlink, Edge and Node, and more) and they want to hire devs from the buildspace network :).** You've already picked up a skill that is actually extremely valuable and companies are paying top dollar for awesome web3 engineers.

### 🤟 Your NFT!

We'll airdrop you your NFT within a day and will email you once it's in your wallet. It's running on a cron job! If you don't get the email within 24-hours pls pls pls drop us a message in #feedback and tag @ **alec#8853**. Make sure you've submitted a link to your deployed project!

### 🌈 Before you head out

Go to **#showcase** in Discord and drop us a link to your final product that we can mess around with :).

Also, you should totally tweet out your final project and show the world your epic creation! What you did wasn't easy by any means. Maybe even make a little video showing off your project and attach that to the tweet. Make your tweet look pretty and show off!!

And if you feel up to it, tag @_buildspace :). **It gives us a ton of motivation whenever we see people ship their projects.** Plus, you can inspire someone else to get into web3.

Give us that dopamine hit pls.

Lastly, what would also be awesome is if you told us in #feedback how you liked this project and the structure of the project. What did you love most about buildspace? What sucked? What would like us to change for future projects? Your feedback would be awesome!

See yah around!!!