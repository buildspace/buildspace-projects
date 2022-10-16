## 📝 Write our starter contract

*Note: If you already know how to do a lot of the stuff in this section from the "WavePortal" project we ran in the past, awesome! You'll get through this quickly :). Much of it is repeated.*

Let's do a little clean-up.

Go ahead and open the code for the project now in your favorite code editor. I like VSCode best! We want to delete all the lame starter code generated for us. We don't need any of that. We're pros ;)!

Go ahead and delete the file `Lock.js` under `test`.  Also, delete `deploy.js` under `scripts`. Then, delete `Lock.sol` under `contracts`. **Don't delete the actual folders!**

Now, open the project up in VSCode and let's get to writing our NFT contract. If you've never written a smart contract don't worry. **Just follow along. Google stuff you don't understand. Ask questions in Discord.**

Create a file named `MyEpicNFT.sol` under the `contracts` directory. File structure is super important when using Hardhat, so, be careful here!

Note: I recommend downloading the [Solidity extension](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity) for VSCode which gives nice syntax highlighting.

I always like starting with a really basic contract, just to get things going.

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract MyEpicNFT {
    constructor() {
        console.log("This is my NFT contract. Whoa!");
    }
}
```

Note: Sometimes VSCode itself will throw errors that aren't real, for example, it may underline the hardhat import and say it doesn't exist. These happen because your global Solidity compiler isn't set locally. If you don't know how to fix this, don't worry. Ignore these for now. Also I recommend that you don't use VSCode's terminal, use your own separate terminal! Sometimes the VSCode terminal gives issues if the compiler isn't set.

Let's go line-by-line here.

```solidity
// SPDX-License-Identifier: UNLICENSED
```

Just a fancy comment.  It's called an "SPDX license identifier", You can read more about that [here](https://spdx.org/licenses/).

```solidity
pragma solidity ^0.8.17;
```

This is the version of the Solidity compiler we want our contract to use. It basically says "when running this, I only want to use a Solidity compiler with its version 0.8.17 or higher, but not higher than 0.9.0". Note, be sure your compiler is set accordingly (eg. 0.8.17) in `hardhat.config.js`.

```solidity
import "hardhat/console.sol";
```

Some magic given to us by Hardhat allows us to do some console logs in our contract. It's actually challenging to debug smart contracts but this is one of the goodies Hardhat gives us to make life easier.

```solidity
contract MyEpicNFT {
    constructor() {
        console.log("This is my NFT contract. Whoa!");
    }
}
```

So, smart contracts kinda look like a `class` in other languages, if you've ever seen those! Once we initialize this contract for the first time, that constructor will run and print out that line. Please make that line say whatever you want. Have a little fun with it.

## 😲 How do we run it?

Awesome — we've got a smart contract! But, we don't know if it works. We need to actually:

1. Compile it.

2. Deploy it to our local blockchain.

3. Once it's there, that console.log will run.

We're just going to write a custom script that handles those 3 steps for us.

Go into the `scripts` directory and make a file named `run.js`.  This is what `run.js` is going to have inside it:

```javascript
const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory('MyEpicNFT');
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);
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

## 🤔 How's it work?

**Note: VSCode might auto-import ethers. We don't need to import ethers.**

Again going line by line here.

```javascript
const nftContractFactory = await hre.ethers.getContractFactory("MyEpicNFT");
```

This will actually compile our contract and generate the necessary files we need to work with our contract under the `artifacts` directory. Go check it out after you run this :).

```javascript
const nftContract = await nftContractFactory.deploy();
```

This is pretty fancy :).

What's happening here is Hardhat will create a local Ethereum network for us, but just for this contract. Then, after the script completes it'll destroy that local network. So, every time you run the contract, it'll be a fresh blockchain. Whats the point? It's kinda like refreshing your local server every time so you always start from a clean slate which makes it easy to debug errors.

```javascript
await nftContract.deployed();
```

We'll wait until our contract is officially mined and deployed to our local blockchain! That's right, hardhat actually creates fake "miners" on your machine to try its best to imitate the actual blockchain. 

Our `constructor` runs when we actually are fully deployed!


```javascript
console.log("Contract deployed to:", nftContract.address);
```

Finally, once it's deployed `nftContract.address` will basically give us the address of the deployed contract. This address is how we can actually find our contract on the blockchain. Right now on our local blockchain it's just us. So, this isn't that cool.

But, there are millions of contracts on the actual blockchain. So, this address gives us easy access to the contract we're interested in working with! This will come in handy when we deploy to the actual blockchain in a few lessons.

## 💨 Run it

Before you run this, be sure to change `solidity: "0.8.4",` to `solidity: "0.8.17",` in your `hardhat.config.js`.

Let's run it! Open up your terminal and run:

```bash
npx hardhat run scripts/run.js
```

You should see your `console.log` run from within the contract and then you should also see the contract address print out!!! Here's what I get:

![Untitled](https://i.imgur.com/CSBimfv.png)

## 🎩 Hardhat & HRE

In these code blocks you will constantly notice that we use `hre.ethers`, but `hre` is never imported anywhere? What type of sorcery is this?

Directly from the Hardhat docs themselves you will notice this:

> The Hardhat Runtime Environment, or HRE for short, is an object containing all the functionality that Hardhat exposes when running a task, test or script. In reality, Hardhat is the HRE.

So what does this mean? Well, every time you run a terminal command that starts with `npx hardhat` you are getting this `hre` object built on the fly using the `hardhat.config.js` specified in your code! This means you will never have to actually do some sort of import into your files like:

`const hardhat = require("hardhat")`

**TL;DR - you will be seeing `hre` a lot in our code, but never imported anywhere! Checkout this cool [Hardhat documentation](https://hardhat.org/advanced/hardhat-runtime-environment.html) to learn more about it!**

## 🚨 Progress report!

Post a screenshot in #progress with the output of `npx hardhat run scripts/run.js` :).
