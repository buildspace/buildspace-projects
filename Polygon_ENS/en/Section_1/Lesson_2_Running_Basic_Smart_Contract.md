### 👶 Let’s write a contract

*Note: If you already know how to do a lot of the stuff in this section from the ["WavePortal" project](https://app.buildspace.so/projects/CO02cf0f1c-f996-4f50-9669-cf945ca3fb0b) we ran in the past, awesome! You'll get through this quickly :). Much of it is repeated.*

Awesome, we made it. We are ready to start writing smart contracts. We're just going to hop right into our project. Open the project folder in your favorite text editor, I like VSCode. If you've never written a smart contract don't worry. **Just follow along. Google stuff you don't understand. Ask questions in Discord.**

Create a file named `Domains.sol` under the `contracts` directory. File structure is super important when using Hardhat, so, be careful here!

Note: I recommend downloading the [Solidity extension](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity) for VSCode which gives nice syntax highlighting.

I always like starting with a really basic contract, just to get things going.

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.10;

import "hardhat/console.sol";

contract Domains {
  constructor() {
    console.log("THIS IS MY DOMAINS CONTRACT. NICE.");
  }
}
```

Note: Sometimes VSCode itself will throw errors that aren't actually a problem. For example, it may underline the hardhat import and say it doesn't exist. This happens because your global Solidity compiler isn't set locally. If you don't know how to fix this, don't worry. Ignore this for now. Also, I recommend that you don't use VSCode's terminal, use your own separate terminal! Sometimes the VSCode terminal gives issues if the compiler isn't set.

Let's go line-by-line here.

```solidity
// SPDX-License-Identifier: UNLICENSED
```

Just a fancy comment.  It's called an "SPDX license identifier", feel free to Google what it is :).

```solidity
pragma solidity ^0.8.10;
```

This is the version of the Solidity compiler we want our contract to use. It basically says "when running this, I only want to use version 0.8.10 of the Solidity compiler, nothing lower. Note, be sure your compiler is set to 0.8.10 in `hardhat.config.js`.

```solidity
import "hardhat/console.sol";
```

Some magic given to us by Hardhat to do some console logs in our contract. It's actually challenging to debug smart contracts but this is one of the goodies Hardhat gives us to make life easier.

```solidity
contract Domains{
    constructor() {
        console.log("THIS IS MY DOMAIN CONTRACT. NICE.");
    }
}

```

So, smart contracts kinda look like a `class` in other languages, if you've ever seen those! Once we initialize this contract for the first time, that constructor will run and print out that line. Please make that line say whatever you want. Have a little fun with it.

### 😲 How do we run it?

Awesome — we've got a smart contract! But, we don't know if it works. We need to actually:

1. Compile it.
2. Deploy it to our local blockchain.
3. Once it's there, that `console.log` will run.

We're just going to write a custom script that handles those 3 steps for us.

Go into the `scripts` directory and make a file named `run.js`. This is what `run.js` is going to have inside it:

```jsx
const main = async () => {
  const domainContractFactory = await hre.ethers.getContractFactory('Domains');
  const domainContract = await domainContractFactory.deploy();
  await domainContract.deployed();
  console.log("Contract deployed to:", domainContract.address);
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

`run.js` is our playground to mess around with our contract!

### 🤔 How does it work?

**Note: VSCode might auto-import ethers. We don't need to import ethers or anything. So, make sure not to import anything.**

Again, going line by line here.

```jsx
const domainContractFactory = await hre.ethers.getContractFactory('Domains');
```

This will actually compile our contract and generate the necessary files we need to work with our contract under the `artifacts` directory. Go check it out after you run this :).

```jsx
const domainContract = await domainContractFactory.deploy();
```

This is pretty fancy :).

What's happening here is Hardhat will create a local Ethereum network for us, **but just for this contract**. Then after the script completes, it will destroy that local network. So, every time you run the contract it will be a fresh blockchain. Whats the point? It's kinda like refreshing your local server every time so you always start from a clean slate which makes it easy to debug errors.

```jsx
await domainContract.deployed();
```

We'll wait until our contract is officially mined and deployed to our local blockchain! That's right, hardhat actually creates fake "miners" on your machine to try its best to imitate the actual blockchain.

Our `constructor` runs when we actually are fully deployed!

```jsx
console.log("Contract deployed to:", domainContract.address);
```

Finally, once it's deployed `domainContract.address` will basically give us the address of the deployed contract. This address is how we can actually find our contract on the blockchain. Right now on our local blockchain it's just us. So, this isn't that cool.

But, there are millions of contracts on the actual blockchain. So, this address gives us easy access to the contract we're interested in working with! This will come in handy when we deploy to the actual blockchain in a few lessons.

### 💨 Run it

Before you run this, be sure to change `solidity: "0.8.4",` to `solidity: "0.8.10",` in your `hardhat.config.js`.

Let's run it! Open up your terminal and run:

```bash
npx hardhat run scripts/run.js
```

You should see your `console.log` run from within the contract and then you should also see the contract address printed out!!!

### 🎩 Hardhat & HRE

In these code blocks you will constantly notice that we use `hre.ethers`, but `hre` is never imported anywhere? What type of sorcery is this?

Directly from the Hardhat docs themselves, you will notice this:

> The Hardhat Runtime Environment, or HRE for short, is an object containing all the functionality that Hardhat exposes when running a task, test or script. In reality, Hardhat is the HRE.
> 

So what does this mean? Every time you run a terminal command that starts with `npx hardhat` you are getting this `hre` object built on the fly using the `hardhat.config.js` specified in your code! This means you will never have to actually do some sort of import into your files like:

`const hardhat = require("hardhat")`

**TL;DR - you will be seeing `hre` a lot in our code, but never imported anywhere! Check out the [Hardhat documentation](https://hardhat.org/advanced/hardhat-runtime-environment.html) to learn more about it!**

### 🚨 Progress report!

Post a screenshot in #progress with the output of `npx hardhat run scripts/run.js` :)