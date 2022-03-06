### 🍪 Getting started w/ thirdweb.

Awesome! We can now connect to a user's wallet, which means we can now check if they're in our DAO! In order to join our DAO, the user will need a membership NFT. If they don't have a membership NFT, we'll prompt them actually mint a membership NFT and join our DAO!

But, there's a problem. In order for us to mint NFTs, we need to write + deploy our own NFT smart contract. **This is actually where ThirdWeb comes in clutch.**

What ThirdWeb gives us, is a set of tools to create all our smart contracts without writing any Solidity.

We write no Solidity. All we need to do is write a script using just javascript to create + deploy our contracts. thirdweb will use a set of secure, standard contracts they've created [here](https://github.com/thirdweb-dev/contracts/tree/v1). **The cool part is after you create the contracts, you own them and they're associated with your wallet.** 

Once you deploy the contract, you can interact with those contracts from your frontend easily using their client-side SDK.

I can't stress how easy it is to create a smart contract with thirdweb compared to writing your own Solidity code, it will feel like interacting with a normal backend library. Lets get into it:

Head over to the thirdweb dashboard [here](https://thirdweb.com/start?utm_source=buildspace). Click "**Let's get started**". Connect your wallet. Select your network (**Rinkeby**).

Create your first project and give it a name like "My DAO" or something. When you click "Create" you'll see it prompts Metamask and has you pay a gas fee on Rinkeby. Why? 

This creates the container for the contracts we'll be deploying, on-chain. **thirdweb doesn't have a database, all your data is stored on-chain.**

### 📝 Create a place to run thirdweb scripts.

Now we need to actually write some scripts that let us create/deploy our contract to Rinkeby using thirdweb. The first thing we're going to do is create a `.env` file that looks like this in the root of our project.

```plaintext
PRIVATE_KEY=YOUR_PRIVATE_KEY_HERE
WALLET_ADDRESS=YOUR_WALLET_ADDRESS
ALCHEMY_API_URL=YOUR_ALCHEMY_API_URL
```

*Note: On Replit? You'll need to use [this](https://docs.replit.com/programming-ide/storing-sensitive-information-environment-variables). Basically, .env files don’t work on Replit. You should use this method to add your variables one-by-one w/ the same names. When you’re done you’ll need to start Replit by stopping/running the repo so it picks up the new env variables!* 

thirdweb needs all this stuff to deploy contracts on your behalf. Nothing is stored on their end, everything stays locally on your `.env` file. **Don't commit your `.env` file to Github. You will get robbed. Be careful.**

To get your private key from Metamask, check [this](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key) out. 

To get your wallet address, check [this](https://metamask.zendesk.com/hc/en-us/articles/360015289512-How-to-copy-your-MetaMask-account-public-address-) out.

### 🚀 Alchemy.

The last thing you need in your `.env` file is `ALCHEMY_API_URL`.

Alchemy essentially helps us broadcast our contract creation transaction so that it can be picked up by miners on the testnet as quickly as possible. Once the transaction is mined, it is then broadcasted to the blockchain as a legit transaction. From there, everyone updates their copy of the blockchain.

So, make an account with Alchemy [here](https://alchemy.com/?r=b93d1f12b8828a57).

Check out the video below to see how to get your API key for a **testnet**! Don't mess up and create a mainnet key, **we want a testnet key.** 

[Loom](https://www.loom.com/share/21aa1d64ea634c0c9da8fc5faaf24283)

You should now have all three items in your `.env` file!

### 🥳 Initialize SDK

Head over to `scripts/1-initialize-sdk.js`.

```jsx
import { ThirdwebSDK } from "@3rdweb/sdk";
import ethers from "ethers";

//Importing and configuring our .env file that we use to securely store our environment variables
import dotenv from "dotenv";
dotenv.config();

// Some quick checks to make sure our .env is working.
if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY == "") {
  console.log("🛑 Private key not found.")
}

if (!process.env.ALCHEMY_API_URL || process.env.ALCHEMY_API_URL == "") {
  console.log("🛑 Alchemy API URL not found.")
}

if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS == "") {
  console.log("🛑 Wallet Address not found.")
}

const sdk = new ThirdwebSDK(
  new ethers.Wallet(
    // Your wallet private key. ALWAYS KEEP THIS PRIVATE, DO NOT SHARE IT WITH ANYONE, add it to your .env file and do not commit that file to github!
    process.env.PRIVATE_KEY,
    // RPC URL, we'll use our Alchemy API URL from our .env file.
    ethers.getDefaultProvider(process.env.ALCHEMY_API_URL),
  ),
);

(async () => {
  try {
    const apps = await sdk.getApps();
    console.log("Your app address is:", apps[0].address);
  } catch (err) {
    console.error("Failed to get apps from the sdk", err);
    process.exit(1);
  }
})()

// We are exporting the initialized thirdweb SDK so that we can use it in our other scripts
export default sdk;
```

It looks like a lot, but, all we're doing is initializing thirdweb and then adding an `export default sdk` since we'll be reusing the initialized sdk in other scripts. It's almost like initializing a connection to a database from a server. We give it stuff like our private key and our provider (which is Alchemy).

We're also running this:

```jsx
(async () => {
  try {
    const apps = await sdk.getApps();
    console.log("Your app address is:", apps[0].address);
  } catch (err) {
    console.error("Failed to get apps from the sdk", err);
    process.exit(1);
  }
})()
```

To make sure we can retrieve the project we made using thirdweb's web app!

Before executing the function, make sure you have Node 16+ installed, you can check your version with:

```plaintext
node -v
```

*Note: if you’re on Replit you can actually run scripts from the shell it provides:*

If you have an old version of Node, you can update it [here](https://nodejs.org/en/). (Download the LTS version) Let's execute it! Go to your terminal and paste the following command:

```plaintext
node scripts/1-initialize-sdk.js
```

Here's what I get when I run the script.

```plaintext
buildspace-dao-starter % node scripts/1-initialize-sdk.js
👋 Your app address is: 0xa002D595189bF9D50D5897C64b6e07BE5bdEe9b8
```

*Note: You might also see some random warnings like `ExperimentalWarning`, just be sure your app address is printed out!*

Make sure to copy the address of your app! You'll need it in a second!

Epic. If you see it print out your app address then that means everything is initialized!

### 🧨 Create an ERC-1155 collection.

What we're going to do now is create + deploy an ERC-1155 contract to Rinkeby. This is basically the base module we'll need to create our NFTs. **We're not creating our NFT here, yet. We're just setting up metadata around the collection itself.** This is stuff like the name of the collection (ex. CryptoPunks) and an image associated with the collection that shows up on OpenSea as the header.

*Note: You may know ERC-721 where every NFT is unique, even if they have the same image, name, and properties. With an ERC-1155, multiple people can be the holder of the same NFT. In this case, our "membership NFT" is the same for everyone, so instead of making a new NFT every time we can simply assign the same NFT to all our members. This is also more gas efficient! This is a pretty common approach for cases where the NFT is the same for all holders.*

Head to `scripts/2-deploy-drop.js` and add the following code:

```jsx
import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const app = sdk.getAppModule("INSERT_YOUR_APP_ADDRESS_HERE");

(async () => {
  try {
    const bundleDropModule = await app.deployBundleDropModule({
      // The collection's name, ex. CryptoPunks
      name: "NarutoDAO Membership",
      // A description for the collection.
      description: "A DAO for fans of Naruto.",
      // The image for the collection that will show up on OpenSea.
      image: readFileSync("scripts/assets/naruto.png"),
      // We need to pass in the address of the person who will be receiving the proceeds from sales of nfts in the module.
      // We're planning on not charging people for the drop, so we'll pass in the 0x0 address
      // you can set this to your own wallet address if you want to charge for the drop.
      primarySaleRecipientAddress: ethers.constants.AddressZero,
    });
    
    console.log(
      "✅ Successfully deployed bundleDrop module, address:",
      bundleDropModule.address,
    );
    console.log(
      "✅ bundleDrop metadata:",
      await bundleDropModule.getMetadata(),
    );
  } catch (error) {
    console.log("failed to deploy bundleDrop module", error);
  }
})()
```

*Note: be sure to replace `INSERT_YOUR_APP_ADDRESS_HERE` with the address printed out from `1-initialize-sdk.js`.*

A pretty simple script!

We give our collection a `name`, `description` and `primarySaleRecipientAddress`, and `image`. The `image` we're loading from our local file so be sure to include that image under `scripts/assets`. Be sure it's a PNG, JPG, or GIF for now and be sure it's a local image — this won't work if you use an internet link!

When I run this using `node scripts/2-deploy-drop.js`, I get.

```plaintext
buildspace-dao-starter % node scripts/2-deploy-drop.js
👋 Your app address is: 0xa002D595189bF9D50D5897C64b6e07BE5bdEe9b8
✅ Successfully deployed bundleDrop module, address: 0x31c70F45060AE0870624Dd9D79A1d8dafC095A5d
✅ bundleDrop metadata: {
  metadata: {
    name: 'NarutoDAO Membership',
    description: 'A DAO for fans of Naruto.',
    image: 'https://cloudflare-ipfs.com/ipfs/bafybeicuuhilocc2tskhnvbwjqarsc5k7flfqdr4ifvwxct32vzjmb3sam',
    primary_sale_recipient_address: '0x0000000000000000000000000000000000000000',
    uri: 'ipfs://bafkreieti3mpdd3pytt3v6vxbc3rki2ja6qpbblfznmup2tnw5mghrihnu'
  },
  address: '0x31c70F45060AE0870624Dd9D79A1d8dafC095A5d',
  type: 11
}
```

Okay, what just happened is pretty freaking epic. Two things happened:

**One, we just deployed an [ERC-1155](https://docs.openzeppelin.com/contracts/3.x/erc1155) contract to Rinkeby.** That's right! If you head over to `https://rinkeby.etherscan.io/` and paste in the address of the `bundleDrop` module, you'll see you just deployed a smart contract! The coolest part is you **own** this contract and it's deployed from **your** wallet. The “From” address will be **your** public address. 

*Note: Keep the address of your `bundleDrop` around, we'll need it later!*

![Untitled](https://i.imgur.com/suqHbB4.png)

Pretty epic. A deployed, custom contract with just javascript. You can see the actual smart contract code thirdweb uses [here](https://github.com/thirdweb-dev/contracts/blob/v1/contracts/LazyNFT.sol).

**The other thing we did here is thirdweb automatically uploaded and pinned our collection's image to IPFS.** You'll see a link that starts with `https://cloudflare-ipfs.com` printed out. If you paste that into your browser, you'll see your NFT's image being retrieved from IPFS via CloudFlare!

You can even hit IPFS directly using the `ipfs://` URI (note — wont work on Chrome since you need to be running an IPFS node, but works on Brave which does that for you!)

*Note: IPFS is basically a decentralized storage system, read more on it [here](https://docs.ipfs.io/concepts/what-is-ipfs/)!* 

If you've developed a custom smart contract in Solidity before, this is kinda mind-blowing. We already have a contract deployed to Rinkeby + data hosted on IPFS. Wild. Next, we need to actually create our NFTs!

### 🚨 Progress Report

*Please do this or Farza will be sad :(.*

Go ahead and share a screenshot of Etherscan in `#progress` showing off your deployed contract.
