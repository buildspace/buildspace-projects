## 🙉 A note on github

**If uploading to Github, don't upload your hardhat config file with your private key to your repo. You will get robbed.**

I use dotenv for this.

```bash
npm install --save dotenv
```

```javascript
require('@nomiclabs/hardhat-waffle');
require('dotenv').config();

module.exports = {
  solidity: '0.8.1',
  networks: {
    goerli: {
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

```plaintext
STAGING_QUICKNODE_KEY=BLAHBLAH
PROD_QUICKNODE_KEY=BLAHBLAH
PRIVATE_KEY=BLAHBLAH
```

(don't commit your `.env` after this lol, make sure it's in your `.gitignore` file).

Remember the change we made to `.gitignore` earlier? You can now revert it by removing the `hardhat.config.js` line, because now that file only contains variables representing your keys, and not your actual key info.

## 🌎 Upgrade your immortal NFTs with IPFS

Think about where your NFT assets are actually stored right now. They're on the Ethereum blockchain! This is awesome for lots of reasons, but it has a few issues. Mainly, it's **very expensive** because of how much storage costs on Ethereum. Contracts also have a length limit, so if you make a really fancy animated SVG that's very long, it won't fit in a contract. 

Luckily we have something called [IPFS](https://en.wikipedia.org/wiki/InterPlanetary_File_System), which is essentially a distributed file system. Today — you might use something like S3 or GCP Storage. But, in this case we can simply trust IPFS which is run by strangers who are using the network. Give [this](https://decrypt.co/resources/how-to-use-ipfs-the-backbone-of-web3) a quick read when you can! Covers a lot of good base knowledge :). Really, all you need to know is that IPFS is the industry standard for storing NFT assets. It's immutable, permanent, and decentralized. 

Using it is pretty simple. All you need to do is upload your NFTs to IPFS and then use the unique content ID hash it gives you back in your contract instead of the Imgur URL or SVG data.

First, you'll need to upload your images to a service that specializes in "[pinning](https://docs.ipfs.io/how-to/pin-files/)" — which means your file will essentially be cached so its easily retrievable. I like using [**Pinata**](https://www.pinata.cloud/?utm_source=buildspace) as my pinning service — they give you 1 GB of storage for free, which is enough for 1000s of assets. Just make an account, upload your character's image files through their UI, and that's it! 

![Untitled](https://i.imgur.com/lTpmIIj.png)

Go ahead and copy the files "CID". This is the file's content address on IPFS! What's cool now is we can create this link:

```javascript
https://cloudflare-ipfs.com/ipfs/INSERT_YOUR_CID_HERE
```

If you are using **Brave Browser** (which has IPFS built-in) you can just type this paste into the URL:

```javascript
ipfs://INSERT_YOUR_CID_HERE
```

And that'll actually start an IPFS node on your local machine and retrieve the file! If you try to do it on something like Chrome it just does a Google search lol. Instead you'll have to use the `cloudflare-ipfs` link.

![Untitled](https://i.imgur.com/tWHtVbO.png)

From here, we just need to update our `tokenURI` function to prepend `ipfs://`. Basically, OpenSea likes when our image URI is structured like this: `ipfs://INSERT_YOUR_CID_HERE`. 

Here's what your `_setTokenURI` function should look like:
```javascript
_setTokenURI(newItemId, "ipfs://INSERT_YOUR_CID_HERE")
```

And now you know how to use IPFS! There's a catch in our scenario though - we're dynamically generating the SVG code on-chain. You can't upload assets to IPFS from inside contracts, so you'll have to generate the SVGs in your browser or a dedicated server, upload them to IPFS, and pass the CIDs into your mint function as a string. 

I'm just going to leave this for you to explore, but, sometimes you won't want to store your NFTs on-chain. Perhaps you want to have a video as an NFT. Doing it on-chain would be wildly expensive due to gas fees.

Remember, an NFT is just a JSON file at the end of the day that links to some metadata. You can put this JSON file up on IPFS. You can also put the NFT data itself (ex an image, video, etc) up on IPFS. Don't overcomplicate it :).

**A large percentage of NFTs use IPFS. It's the most popular way to store NFT data today.**

I'll leave it to you to explore!! ;)



## 📝 Verify contract on Etherscan

Do you know that you are able to show your smart contract source code to the world? Doing so will enable your logic to be really transparent. True to the spirit of a public blockchain. Everyone who wishes to interact with your smart contract on the blockchain is able to peer into the contract logic first! For that, Etherscan has the **Verify Contract** function. [Here](https://goerli.etherscan.io/address/0x902ebbecafc54f7a8013a9d7954e7355309b50e6#code) is an example of how a verified contract will look like. Feel free to examine the smart contract yourself.

If you select the **Contract** tab in Etherscan, you will notice a long list of text characters that starts from `0x608060405234801...` Hmm.. what could that be 🤔 ?

![image](https://user-images.githubusercontent.com/60590919/139609052-f4bba83c-f224-44b1-be74-de8eaf31b403.png)

It turns out that this long, gibberish looking group of characters is actually the bytecodes of the contract which you have deployed! Bytecodes represent a series of opcodes in the EVM that will perform instructions for us onchain.

This is a lot of new information to understand, so don't worry if it doesn't make much sense right now. Take a moment to look up what bytecodes and EVM mean! Use Google or reach out in the `#general-chill-chat` on Discord :). [This is also a cool article](https://ethervm.io/) about EVM opcodes by the way 🤘.

So, we know that bytecodes aren't readable to us. We want to be able to see the code we wrote right in Etherscan. Luckily, Etherscan has the magic to help us do that!

Notice that there is a prompt that requests us to **Verify and Publish** our contract source code. If we follow the link, we are required to manually select our contract settings and paste our code to publish our source code.

Luckily for us hardhat offers a smarter way of doing this. 

Head back to your hardhat project and install `@nomiclabs/hardhat-etherscan` by running the command:

```
npm i -D @nomiclabs/hardhat-etherscan
```

Then in your `hardhat.config.js` add the following
```javascript
require("@nomiclabs/hardhat-etherscan");

// Rest of code
...

module.exports = {
  solidity: "0.8.17",

  // Rest of the config
  ...,
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: "",
  }
};

```

We are almost there! You may have noticed that the `etherscan` object in our config requires an `apiKey`! This means you will need an account with Etherscan to get this key.

If you don't have an account already, head to [https://etherscan.io/register](https://etherscan.io/register) to create a free user account. After which head to your profile settings and under `API-KEYs` create a new apikey 

![image](https://user-images.githubusercontent.com/60590919/139610459-b590bbc1-0d4e-4e78-920b-c45e61bf2d7e.png)

Sweet you got your API key. Time to head back to your `hardhat.config.js` file and change the `apiKey` property to be your newly generated key.

**Note: Do not share your Etherscan api key with others**

We are down to our last step I promise. All that remains now is to run the command

```
npx hardhat verify YOUR_CONTRACT_ADDRESS --network goerli 
```

If everything runs smoothly, you should see some outputs in the terminal. Mine looks like this:

![image](https://user-images.githubusercontent.com/60590919/139611432-16d8c3fc-04b1-44c8-b58a-27f49e94d492.png)

Head back to the contract page in Goerli Etherscan by following the link returned in the terminal and you will notice that Etherscan has magically (with your help) turned the bytecodes into a much readable Solidity code.

![image](https://user-images.githubusercontent.com/60590919/139611635-3d1d7aae-8bb8-47f5-9396-6a4544badebf.png)

Everyone is able to see how awesome your smart contract looks like now !

Wait and there is more. There are now two new sub tabs `Read Contract` & `Write Contract` which we are able to use them to instantly interact with our smart contract onchain. Pretty neat!

![image](https://user-images.githubusercontent.com/60590919/139611805-b2a41039-ec79-402d-b198-4936d25ff277.png)


## 😍 You've done it

Super exciting that you made it to the end. Pretty big deal!

Before you head out, be sure to add a few of those little final touches from the previous lesson if you feel like it. Those really make the difference. When you're ready, post a link to your project in #showcase. Your fellow classmates will be the first to mint some of your awesome NFTs!

Thank you for contributing to the future of web3 by learning this stuff. The fact that you know how this works and how to code it up is a superpower. Use your power wisely ;).

## 🔮 Taking your project further!

What you learned in this project is just the beginning! There is so much more you can do with NFTs and smart contracts, here's a few examples you can research further ✨

- **Sell your NFTs** - Right now your users only have to pay gas fees to mint your awesome nfts and you're not getting any of that money! There are several ways to alter your smart contract that make the user pay you to mint your transactions, such as adding ```payable``` to your contract and using ```require``` to set a minimum amount. Since you're dealing with real money here it's best to do your research carefully and ask the experts that your code is safe. OpenZeppelin has a forum where you can ask questions like this one [here!](https://forum.openzeppelin.com/t/implementation-of-sellable-nft/5517/) 
- **Add Royalties** - You can also add royalties to your smart contract that would give you a percentage of every future sale of your NFT! Read more about it here: [EIP-2981: NFT Royalty Standard](https://eips.ethereum.org/EIPS/eip-2981)
- **Test your contracts locally** - If you want to test your contracts more extensively without deploying to a test net like Goerli, Hardhat of course will let you do that! Best way to achieve that is to open up a separate terminal window, navigate to your project directory, then run ```npx hardhat node``` and keep that window open! Just like in the beginning of the project you'll see a bunch of accounts with lots of ether. In your other terminal window you can run your test scripts and watch it affect your node window!


## 🌈 Before you head out

Go to #showcase in Discord and show us your final product that we can mess around with :).

Also, should totally tweet out your final project and show the world your epic creation! What you did wasn't easy by any means. Maybe even make a little video showing off your project and attach that to the tweet. Make your tweet look pretty and show off :).

And if you feel up to it, tag @_buildspace :). We'll RT it. Plus, it gives us a ton of motivation whenever we see people ship their projects.

Lastly, what would also be awesome is if you told us in #feedback how you liked this project and the structure of the project. What did you love most about buildspace? What would like us to change for future projects? Your feedback would be awesome!!


See yah around!!!
