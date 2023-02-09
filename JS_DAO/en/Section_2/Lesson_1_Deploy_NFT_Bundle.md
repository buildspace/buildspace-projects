### 🍪 Getting started w/ thirdweb

Awesome! We can now connect to a user's wallet, which means we can now check if they're in our DAO! In order to join our DAO, the user will need a membership NFT. If they don't have a membership NFT, we'll prompt them actually mint a membership NFT and join our DAO!

But, there's a problem. In order for us to mint NFTs, we need to write + deploy our own NFT smart contract. **This is actually where thirdWeb comes in clutch.**

What thirdWeb gives us, is a set of tools to create all our smart contracts without writing any Solidity.

We write no Solidity. All we need to do is write a script using just JavaScript to create + deploy our contracts. thirdweb will use a set of secure, standard contracts they've created [here](https://github.com/thirdweb-dev/contracts). **The cool part is after you create the contracts, you own them and they're associated with your wallet.** 

Once you deploy the contract, you can interact with those contracts from your frontend easily using their client-side SDK.

I can't stress how easy it is to create a smart contract with thirdweb compared to writing your own Solidity code, it will feel like interacting with a normal backend library. Lets get into it:

[thirdweb dashboard](https://thirdweb.com/dashboard?utm_source=buildspace) allow us to create contracts without writing any code, but for this tutorial, we will be creating them with JavaScript. 

Important! **thirdweb doesn't have a database, all your data is stored on-chain.**

### 📝 Create a place to run thirdweb scripts

Now we need to actually write some scripts that let us create/deploy our contract to Goerli using thirdweb. The first thing we're going to do is create a `.env` file that looks like this in the root of our project.

```plaintext
PRIVATE_KEY=YOUR_PRIVATE_KEY_HERE
WALLET_ADDRESS=YOUR_WALLET_ADDRESS
QUICKNODE_API_URL=YOUR_QUICKNODE_API_URL
```

*Note: On Replit? You'll need to use [this](https://docs.replit.com/programming-ide/storing-sensitive-information-environment-variables). Basically, .env files don’t work on Replit. You should use this method to add your variables one-by-one w/ the same names. When you’re done you’ll need to start Replit by stopping/running the repo so it picks up the new env variables!* 

thirdweb needs all this stuff to deploy contracts on your behalf. Nothing is stored on their end, everything stays locally on your `.env` file. **Don't commit your `.env` file to Github. You will get robbed. Be careful.**

To get your private key from Metamask, check [this](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key) out. 

To get your wallet address, check [this](https://metamask.zendesk.com/hc/en-us/articles/360015289512-How-to-copy-your-MetaMask-account-public-address-) out.

### 🚀 QuickNode

The last thing you need in your `.env` file is `QUICKNODE_API_URL`.

QuickNode essentially helps us broadcast our contract creation transaction so that it can be picked up by miners on the testnet as quickly as possible. Once the transaction is mined, it is then broadcasted to the blockchain as a legit transaction. From there, everyone updates their copy of the blockchain.

So, make an account with QuickNode [here](https://www.quicknode.com/?utm_source=buildspace&utm_campaign=generic&utm_content=sign-up&utm_medium=buildspace).

Check out the video below to see how to get your API key for a **testnet**! Don't mess up and create a mainnet key, **we want a testnet key.** 

[Loom](https://www.loom.com/share/bdbe5470b4b745819782f6727ba60baa)

You should now have all three items in your `.env` file!

### 🥳 Initialize SDK

Head over to `scripts/1-initialize-sdk.js`.

```jsx
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

// Importing and configuring our .env file that we use to securely store our environment variables
import dotenv from "dotenv";
dotenv.config();

// Some quick checks to make sure our .env is working.
if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY === "") {
  console.log("🛑 Private key not found.");
}

if (!process.env.QUICKNODE_API_URL || process.env.QUICKNODE_API_URL === "") {
  console.log("🛑 QuickNode API URL not found.");
}

if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS === "") {
  console.log("🛑 Wallet Address not found.");
}

const sdk = ThirdwebSDK.fromPrivateKey(
  // Your wallet private key. ALWAYS KEEP THIS PRIVATE, DO NOT SHARE IT WITH ANYONE, add it to your .env file and do not commit that file to github!
  process.env.PRIVATE_KEY,
  // RPC URL, we'll use our QuickNode API URL from our .env file.
  process.env.QUICKNODE_API_URL
);

(async () => {
  try {
    const address = await sdk.getSigner().getAddress();
    console.log("👋 SDK initialized by address:", address)
  } catch (err) {
    console.error("Failed to get apps from the sdk", err);
    process.exit(1);
  }
})();

// We are exporting the initialized thirdweb SDK so that we can use it in our other scripts
export default sdk;
```

To make sure that we sdk initialized correctly!

Before executing the function, make sure you have Node 16+ installed, you can check your version with:

```plaintext
node -v
```

*Note: if you’re on Replit you can actually run scripts from the shell it provides:*

If you have an old version of Node, you can update it [here](https://nodejs.org/en/). (Download the LTS version) 

*Note: if you’re on Replit you can actually update the node version by running this from the shell:*

```plaintext
npm init -y && npm i --save-dev node@17 && npm config set prefix=$(pwd)/node_modules/node && export PATH=$(pwd)/node_modules/node/bin:$PATH
```

Let's execute it! Go to your terminal and paste the following command:

```plaintext
node scripts/1-initialize-sdk.js
```

Here's what I get when I run the script.

```plaintext
buildspace-dao-starter % node scripts/1-initialize-sdk.js
👋 SDK initialized by address: 0xF11D6862e655b5F4e8f62E00471261D2f9c7E380
```

*Note: You might also see some random warnings like `ExperimentalWarning`, just be sure your app address is printed out!*

Epic. If you see it print out your wallet address then that means everything is initialized!

### 🧨 Create an ERC-1155 collection

What we're going to do now is create + deploy an ERC-1155 contract to Goerli. This is basically the base module we'll need to create our NFTs. **We're not creating our NFT here, yet. We're just setting up metadata around the collection itself.** This is stuff like the name of the collection (ex. CryptoPunks) and an image associated with the collection that shows up on OpenSea as the header.

*Note: You may know ERC-721 where every NFT is unique, even if they have the same image, name, and properties. With an ERC-1155, multiple people can be the holder of the same NFT. In this case, our "membership NFT" is the same for everyone, so instead of making a new NFT every time we can simply assign the same NFT to all our members. This is also more gas efficient! This is a pretty common approach for cases where the NFT is the same for all holders.*

Head to `scripts/2-deploy-drop.js` and add the following code:

```jsx
import { AddressZero } from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

(async () => {
  try {
    const editionDropAddress = await sdk.deployer.deployEditionDrop({
      // The collection's name, ex. CryptoPunks
      name: "NarutoDAO Membership",
      // A description for the collection.
      description: "A DAO for fans of Naruto.",
      // The image that will be held on our NFT! The fun part :).
      image: readFileSync("scripts/assets/naruto.png"),
      // We need to pass in the address of the person who will be receiving the proceeds from sales of nfts in the contract.
      // We're planning on not charging people for the drop, so we'll pass in the 0x0 address
      // you can set this to your own wallet address if you want to charge for the drop.
      primary_sale_recipient: AddressZero,
    });

    // this initialization returns the address of our contract
    // we use this to initialize the contract on the thirdweb sdk
    const editionDrop = await sdk.getContract(editionDropAddress, "edition-drop");

    // with this, we can get the metadata of our contract
    const metadata = await editionDrop.metadata.get();

    console.log(
      "✅ Successfully deployed editionDrop contract, address:",
      editionDropAddress,
    );
    console.log("✅ editionDrop metadata:", metadata);
  } catch (error) {
    console.log("failed to deploy editionDrop contract", error);
  }
})();
```

A pretty simple script!

We give our collection a `name`, `description` and `primary_sale_recipient`, and `image`. The `image` we're loading from our local file so be sure to include that image under `scripts/assets`. Be sure it's a PNG, JPG, or GIF for now and be sure it's a local image — this won't work if you use an internet link!

When I run this using `node scripts/2-deploy-drop.js`, I get.

```plaintext
buildspace-dao-starter % node scripts/2-deploy-drop.js
👋 SDK initialized by address: 0xF11D6862e655b5F4e8f62E00471261D2f9c7E380
✅ Successfully deployed editionDrop contract, address: 0xE56fb4F83A9a99E40Af1C7eF08643e7bf1259A95
✅ editionDrop metadata: {
  name: 'NarutoDAO Membership',
  description: 'A DAO for fans of Naruto.',
  image: 'https://gateway.ipfscdn.io/ipfs/QmYTQFY2W1K7ucd9GgidKkLL37yJB9sqPGmUqfJiURETxQ/0',
  seller_fee_basis_points: 0,
  fee_recipient: '0x0000000000000000000000000000000000000000',
  merkle: {},
  symbol: ''
}
```

Okay, what just happened is pretty freaking epic. Two things happened:

**One, we just deployed an [ERC-1155](https://docs.openzeppelin.com/contracts/3.x/erc1155) contract to Goerli.** That's right! If you head over to `https://goerli.etherscan.io/` and paste in the address of the `editionDrop` contract, you'll see you just deployed a smart contract! The coolest part is you **own** this contract and it's deployed from **your** wallet. The “From” address will be **your** public address. 

*Note: Keep the address of your `editionDrop` around, we'll need it later!*, if you ever lose it, you can always retrieve from the [thirdweb dashboard](https://thirdweb.com/dashboard?utm_source=buildspace)

![Untitled](https://i.imgur.com/suqHbB4.png)

Pretty epic. A deployed, custom contract with just javascript. You can see the actual smart contract code thirdweb uses [here](https://github.com/thirdweb-dev/contracts/blob/main/contracts/drop/DropERC1155.sol).

**The other thing we did here is thirdweb automatically uploaded and pinned our collection's image to IPFS.** You'll see a link that starts with `https://gateway.ipfscdn.io` printed out. If you paste that into your browser, you'll see your NFT's image being retrieved from IPFS via CloudFlare!

You can even hit IPFS directly using the `ipfs://` URI (note — wont work on Chrome since you need to be running an IPFS node, but works on Brave which does that for you!)

*Note: IPFS is basically a decentralized storage system, read more on it [here](https://docs.ipfs.io/concepts/what-is-ipfs/)!* 

If you've developed a custom smart contract in Solidity before, this is kinda mind-blowing. We already have a contract deployed to Goerli + data hosted on IPFS. Wild. Next, we need to actually create our NFTs!

### 🚨 Progress Report

*Please do this or Farza will be sad :(.*

Go ahead and share a screenshot of Etherscan in `#progress` showing off your deployed contract.
