*Note: this lesson is a bit longer than the others!*

Now that we got all our scripts good to go and the basics down, we're going to mint some NFTs! Here's what my updated `MyEpicNFT.sol` looks like:

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

// We first import some OpenZeppelin Contracts.
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

// We inherit the contract we imported. This means we'll have access
// to the inherited contract's methods.
contract MyEpicNFT is ERC721 {
  // Magic given to us by OpenZeppelin to help us keep track of tokenIds.
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  // We need to pass the name of our NFTs token and its symbol.
  constructor() ERC721 ("SquareNFT", "SQUARE") {
    console.log("This is my NFT contract. Woah!");
  }

  // A function our user will hit to get their NFT.
  function makeAnEpicNFT() public {
     // Get the current tokenId, this starts at 0.
    uint256 newItemId = _tokenIds.current();

     // Actually mint the NFT to the sender using msg.sender.
    _safeMint(msg.sender, newItemId);
    
    // Return the NFT's metadata
    tokenURI(newItemId);

    // Increment the counter for when the next NFT is minted.
    _tokenIds.increment();
  }

  // Set the NFT's metadata
  function tokenURI(uint256 _tokenId) public view override returns (string memory) {
    require(_exists(_tokenId));
    return "blah";
  }
}
```

A lot of stuff going on here. First you'll see I "inherit" an OpenZeppelin contract using `is ERC721` when I declare the contract. You can read more about inheritance [here](https://solidity-by-example.org/inheritance/), but basically, it means we can call other contracts from ours. It's almost like importing functions for us to use!

The NFT standard is known as `ERC721` which you can read a bit about [here](https://eips.ethereum.org/EIPS/eip-721). OpenZeppelin essentially implements the NFT standard for us and then lets us write our own logic on top of it to customize it. That means we don't need to write boiler plate code.

It'd be crazy to write a HTTP server from scratch without using a library, right? Of course, unless you wanted to explore lol. But we just wanna get up and running here.

Similarly — it'd be crazy to just write an NFT contract from complete scratch! You can explore the `ERC721` contract we're inheriting from [here](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol).

Let's take it step-by-step through the `makeAnEpicNFT` function.

```solidity
uint256 newItemId = _tokenIds.current();
```

Wtf is `_tokenIds`? Well, remember the Picasso example? He had 100 NFT sketches named like Sketch #1, Sketch #2, Sketch #3, etc. Those were the unique identifiers.

Same thing here, we're using `_tokenIds` to keep track of the NFTs unique identifier, and it's just a number! It's automatically initialized to 0 when we declare `private _tokenIds`. So, when we first call `makeAnEpicNFT`, `newItemId` is 0. When we run it again, `newItemId` will be 1, and so on!

`_tokenIds` is a **state variable** which means if we change it, the value is stored on the contract directly.

```solidity
_safeMint(msg.sender, newItemId);
```

When we do `_safeMint(msg.sender, newItemId)` it's pretty much saying: "mint the NFT with id `newItemId` to the user with address `msg.sender`". Here, `msg.sender` is a variable [Solidity itself provides](https://docs.soliditylang.org/en/develop/units-and-global-variables.html#block-and-transaction-properties) that easily gives us access to the **public address** of the person calling the contract.

What's awesome here is this is a **super-secure way to get the user's public address**. Keeping public address itself a secret isn't an issue, that's already public!! Everyone sees it. But, by using `msg.sender` you can't "fake" someone else's public address unless you had their wallet credentials and called the contract on their behalf!

**You can't call a contract anonymously**, you need to have your wallet credentials connected. This is almost like "signing in" and being authenticated :).

```solidity
function tokenURI(uint256 _tokenId) public view override returns (string memory);
```

We then do, override the `tokenURI()` function in ERC721.sol which will set the NFTs unique identifier along with the data associated w/ that unique identifier. It's literally us setting the actual data that makes the NFT valuable. In this case, we're setting it as "blah" which....isn't that valuable ;). It's also not following the standard of `ERC721`. We'll cover `tokenURI` more in a bit.

```solidity
_tokenIds.increment();
```

After the NFT is minted, we increment `tokenIds` using `_tokenIds.increment()` (which is a function OpenZeppelin gives us). This makes sure that next time an NFT is minted, it'll have a different `tokenIds` identifier. No one can have a `tokenIds` that's already been minted too.

## 🎟 `tokenURI` and running locally

The `tokenURI` is where the actual NFT data lives. And it usually **links** to a JSON file called the `metadata` that looks something like this:

```bash
{
    "name": "Spongebob Cowboy Pants",
    "description": "A silent hero. A watchful protector.",
    "image": "https://i.imgur.com/v7U019j.png"
}
```

You can customize this, but, almost every NFT has a name, description, and a link to something like a video, image, etc. It can even have custom attributes on it! Be careful with the structure of your metadata, if your structure does not match the [OpenSea Requirements](https://docs.opensea.io/docs/metadata-standards) your NFT will appear broken on the website.

This is all part of the `ERC721` standards and it allows people to build websites on top of NFT data. For example, [OpenSea](https://testnets.opensea.io/) is a platform to view NFTs. And, every NFT on OpenSea follows the `ERC721` metadata standard which makes it easy for people to view their NFTs. Imagine if everyone followed their own NFT standards and structured their metadata however they wanted, it'd be chaos!

We can copy the `Spongebob Cowboy Pants` JSON metadata above and paste it into [this](https://jsonkeeper.com/) website. This website is just an easy place for people to host JSON data and we'll be using it to keep our NFT data for now. Once you click "Save" you'll get a link to the JSON file. (For example, mine is [`https://jsonkeeper.com/b/RUUS`](https://jsonkeeper.com/b/RUUS)). Be sure to test your link out and be sure it all looks good!

**Note: I'd love for you to create your own JSON metadata instead of just copying mine. Use your own image, name, and description. Maybe you want your NFT to be an image of your fav anime character, fav band, whatever!! Make it custom. Don't worry, we'll be able to change this in the future!**

If you decide to use your own image, make sure the URL goes directly to the actual image, not the website that hosts the image! Direct Imgur links look like this - `https://i.imgur.com/123123.png` NOT `https://imgur.com/gallery/123123`. The easiest way to tell is to check if the URL ends in an image extension like `.png` or `.jpg`. You can right click the imgur image and "copy image address". This will give you the correct URL.

Now, lets head to our smart contract and change one line in `tokenURI()`. Instead of:

```solidity
return "blah";
```

We're going to actually set the URI as the link to our JSON file.

```solidity
return "INSERT_YOUR_JSON_URL_HERE";
```

We can also add a `console.log` to help us see when the NFT is minted and to who!

```solidity
console.log("An NFT w/ ID %s has been minted to %s", _tokenId, msg.sender);
```

This is how your tokenURI function should look now. `_exists` is a built in function to to verify if the tokenId exists in a contract. You can learn more about it [here](https://docs.openzeppelin.com/contracts/3.x/api/token/erc721#ERC721-_exists-uint256-)

```solidity
function tokenURI(uint256 _tokenId) public view override returns (string memory) {
  require(_exists(_tokenId));
  console.log("An NFT w/ ID %s has been minted to %s", _tokenId, msg.sender);
  return "INSERT_YOUR_JSON_URL_HERE";
}
```

## 🎉 Mint an NFT locally

From here, all we'll need to do is actually change our `run.js` file to actually call our `makeAnEpicNFT()` function. Here's all we need to do:

```javascript
const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory('MyEpicNFT');
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);

  // Call the function.
  let txn = await nftContract.makeAnEpicNFT()
  // Wait for it to be mined.
  await txn.wait()

  // Mint another NFT for fun.
  txn = await nftContract.makeAnEpicNFT()
  // Wait for it to be mined.
  await txn.wait()

};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
```

When I run this using:

```bash
npx hardhat run scripts/run.js
```

Here's what I get:

![Untitled](https://i.imgur.com/EfsOs5O.png)

Boom! We just minted an NFT w/ id `0` locally to ourselves! So, we know that the code is working and nothing is crashing. Awesome. You always want to use `run.js` to just make sure stuff is working locally and not crashing. It's your own little playground!

So, right now every time someone mints an NFT with this function, it's always the same NFT — `Spongebob Cowboy Pants`! We'll learn in the coming sections how to actually change this up such that every person who mints an NFT with you will get a random, unique NFT.

Now, let's move to the next step — deploying to a testnet :).

## 🎉 Deploy to Goerli and see on OpenSea

Since OpenSea doesn't support Goerli, we have to look for an alternative. You can check out [OpenSea](https://testnets.opensea.io/) to view your NFT when you deploy to Goerli. When we use `run.js`, it's just us working locally.

The next step is a testnet which you can think of as like a "staging" environment. When we deploy to a testnet we'll actually be able to to **view our NFT online** and we are a step closer to getting this to **real users.**

You are a badass look at you! 

##  💳 Transactions

So, when we want to perform an action that changes the blockchain we call it a *transaction*. For example, sending someone ETH is a transaction because we're changing account balances. Doing something that updates a variable in our contract is also considered a transaction because we're changing data. Minting an NFT is a transaction because we're saving data on the contract.

**Deploying a smart contract is also a transaction.**

Remember, the blockchain has no owner. It's just a bunch of computers around the world run by **miners** that have a copy of the blockchain.

When we deploy our contract, we need to tell **all those** miners, "hey, this is a new smart contract, please add my smart contract to the blockchain and then tell everyone else about it as well".

This is where [QuickNode](https://www.quicknode.com/?utm_source=buildspace&utm_campaign=generic&utm_content=sign-up&utm_medium=buildspace) comes in.

QuickNode essentially helps us broadcast our contract creation transaction so that it can be picked up by miners as quickly as possible. Once the transaction is mined, it is then broadcasted to the blockchain as a legit transaction. From there, everyone updates their copy of the blockchain.

This is complicated. And, don't worry if you don't fully understand it. As you write more code and actually build this app, it'll naturally make more sense. 

So, make an account with QuickNode [here](https://www.quicknode.com/?utm_source=buildspace&utm_campaign=generic&utm_content=sign-up&utm_medium=buildspace).

And then check out my video below to learn how to get your API key for a testnet:
[Loom](https://www.loom.com/share/c079028c612340e8b7439d0d2103a313)

## 🕸 Testnets

We're not going to be deploying to the "Ethereum mainnet" for now. Why? Because it costs real $ and it's not worth messing up! We're just learning right now. We're going to start with a "testnet" which is a clone of "mainnet" but it uses fake $ so we can test stuff out as much as we want. But, it's important to know that testnets are run by actual miners and mimic real-world scenarios.

This is awesome because we can test our application in a real-world scenario where we're actually going to:


1. Broadcast our transaction

2. Wait for it to be picked up by actual miners

3. Wait for it to be mined

4. Wait for it to be broadcasted back to the blockchain telling all the other miners to update their copies


## 🤑 Getting some fake $

There are a few testnets out there and the one we'll be using is called "Goerli" which is run by the Ethereum foundation.

In order to deploy to Goerli, we need fake ETH. Why? Because if you were deploying to the actual Ethereum mainnet, you'd use real money! So, testnets copies how mainnet works, only difference is no real money is involved.

In order to get fake ETH, we have to ask the network for some. **This fake ETH will only work on this specific testnet.** You can grab some fake Ethereum for Goerli through a faucet. You just gotta find one that works lol.

For MyCrypto, you'll need to connect your wallet, make an account, and then click that same link again to request funds. For the official Goerli faucet, if you log into your Alchemy account, you should be able to get 2x the amount.

You have a few faucets to choose from:

| Name             | Link                                  | Amount          | Time         |
| ---------------- | ------------------------------------- | --------------- | ------------ |
| MyCrypto         | https://app.mycrypto.com/faucet       | 0.01            | None         |
| Official Goerli  | https://goerlifaucet.com/             | 0.20            | 24 Hours
| Chainlink        | https://faucets.chain.link/goerli     | 0.1             | None         |

## 🚀 Setup a deploy.js file

It's good practice to separate your deploy script from your `run.js` script. `run.js` is where we mess around a lot, we want to keep it separate. Go ahead and create a file named `deploy.js` under the `scripts` folder. Copy-paste all of `run.js` into `deploy.js`. It's going to be exactly the same right now. I added some `console.log` statements, though.

```javascript
const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory('MyEpicNFT');
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);

  // Call the function.
  let txn = await nftContract.makeAnEpicNFT()
  // Wait for it to be mined.
  await txn.wait()
  console.log("Minted NFT #1")

  txn = await nftContract.makeAnEpicNFT()
  // Wait for it to be mined.
  await txn.wait()
  console.log("Minted NFT #2")
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
```

## 📈 Deploy to Goerli testnet

We'll need to change our `hardhat.config.js` file. You can find this in the root directory of your smart contract project.

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: '0.8.17',
  networks: {
    goerli: {
      url: process.env.QUICKNODE_API_KEY_URL,
      accounts: [process.env.GOERLI_PRIVATE_KEY],
    },
  },
};
```
Here we are basically configuring our `hardhat.config.js` to use our env variables securely which are the **process.env.QUICKNODE_API_KEY_URL** & our **process.env.GOERLI_PRIVATE_KEY**. You'll now need to open your terminal and type in
```
npm install dotenv
```
This basically just installs the `dotenv` package which allows us to use env variables.

And now you can create a **.env** file in the root of your project. To be sure, it should be matching with the path that contains the **hardhat.config.js** file.

You can grab your API URL from the QuickNode dashboard and paste that in. Then, you'll need your **private** key (not your public address!) which you can [grab from metamask](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key) and paste that in there as well.

Open the **.env** file and paste the two we've grabbed as shown below.
```
QUICKNODE_API_KEY_URL=<YOUR API URL>
GOERLI_PRIVATE_KEY=<YOUR PRIVATE KEY>
```
Don't forget to remove those `<` `>` after adding your API URL and your PRIVATE KEY! 🔑

**Note: DON'T COMMIT THIS FILE TO GITHUB. IT HAS YOUR PRIVATE KEY. YOU WILL GET HACKED + ROBBED. THIS PRIVATE KEY IS THE SAME AS YOUR MAINNET PRIVATE KEY.
OPEN YOUR `.gitignore` FILE AND ADD A LINE FOR `.env` IF IT DOES NOT EXIST.**

Your `.gitignore` should look somewhat like this now.
```
node_modules
.env
coverage
coverage.json
typechain

#Hardhat files
cache
artifacts
```

Why do you need to use your private key? Because in order to perform a transaction like deploying a contract, you need to "login" to the blockchain and sign/deploy the contract. And, your username is your public address and your password is your private key. It's kinda like logging into AWS or GCP to deploy.

Once you've got your config setup we're set to deploy with the deploy script we wrote earlier.

Run this command from the root directory of `epic-nfts`.

```bash
npx hardhat run scripts/deploy.js --network goerli
```

It takes like 20-40 seconds to deploy usually. We're not only deploying! We're also minting NFTs in `deploy.js` so that'll take some time as well. We actually need to wait for the transaction to be mined + picked up by miners. Pretty epic :). That one command does all that!

When I run this here's the output (yours will ofc look different):

![carbon (7).png](https://i.imgur.com/TwpQOTM.png)

We can make sure it all worked properly using [Goerli Etherscan](https://goerli.etherscan.io/) where you can paste the contract address and see what's up with it!

Get used to using Etherscan because it's like the easiest way to track deployments and if something goes wrong. If it's not showing up on Etherscan, then that means it's either still processing or something went wrong!

If it worked — AWEEEEESOME YOU JUST DEPLOYED A CONTRACT YESSSS.

## 🌊 View on OpenSea

Believe it or not. The NFTs you just minted will be on OpenSea's TestNet site.

1. Head to `https://testnets.opensea.io/`.
2. Create this url: `https://testnets.opensea.io/assets/goerli/INSERT_DEPLOY_CONTRACT_ADDRESS_HERE/TOKEN_ID`

For example, here's my link: https://testnets.opensea.io/assets/goerli/0x78d1e929cfc5256643b3cc67c50e2d7ec3580842/0 for the Spongebob NFT!! My `tokenId` is `0` because it was the first mint from that contract.

**Basically, if you don't see your NFT on OpenSea within a few minutes, refreshing the page and wait for another 15 mins** 

![Untitled](https://i.imgur.com/ePDlYX1.png)

So here, you'd click "SquareNFT" under "Collections", and boom you'll see the NFTs you minted!

![Untitled](https://i.imgur.com/Q96NYK4.png)

HOOOOLY SHIT LET'S GO. IM HYPE **FOR** YOU.

Pretty epic, we've created our own NFT contract *and* minted two NFTs. Epic. WHILE THIS IS EPIC, it is *kinda lame —* right? It's just the same Spongebob picture every time! How can we add some randomness to this and generate stuff on the fly? That's what we'll be getting into next :).

## 💻 The code

[Here](https://gist.github.com/farzaa/483c04bd5929b92d6c4a194bd3c515a5) is a link to what our code looks like up to this point.

## 🚨Progress report

WOOOOOOO. GIVE YOURSELF A PAT ON THE BACK. YOU DEPLOYED A SMART CONTRACT THAT MINTS NFTS. WOW.

Quick note here: We've seen that the best builders have made it a habit to **"build in public"**. All this means is sharing a few learnings about the milestone they've just hit!

You should totally **tweet** out that you just wrote and deployed your smart contract that can mint NFTs and tag @_buildspace. If you want, include a screenshot of the OpenSea/Rarible page that shows that your NFT :)!

You should feel awesome about the fact that you're actually building stuff everyone else is just talking about.  You got superpowers :).

*Ty to the people who have already been tweeting about us, y'all are legends <3.*

![](https://i.imgur.com/ftXoVsn.png)

![](https://i.imgur.com/HBMIgu2.png)

![](https://i.imgur.com/KwbO0Ib.png)
 
