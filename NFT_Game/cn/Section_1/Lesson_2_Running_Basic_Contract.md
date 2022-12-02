### 📝 Write our starter contract

Pick your favorite code editor and open up the directory where you setup your hardhat project! Let's do a little clean-up.

We want to delete all the lame starter code generated for us. We're going to write this stuff ourselves! Go ahead and delete the file `Lock.js` under `test`.  Also, delete `deploy.js` under `scripts`. Then, delete `Lock.sol` under `contracts`. **Don't delete the actual folders!**

Now, let's get to writing our NFT contract. If you've never written a smart contract don't worry. **Just follow along. Google stuff you don't understand. Ask questions in Discord.**

Create a file named `MyEpicGame.sol` under the `contracts` directory. File structure is super important when using Hardhat, so, be careful here!

Note: I recommend downloading the [Solidity extension](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity) for VSCode which gives nice syntax highlighting.

I always like starting with a really basic contract, just to get things going.

```javascript
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract MyEpicGame {
  constructor() {
    console.log("THIS IS MY GAME CONTRACT. NICE.");
  }
}
```

Note: Sometimes VSCode itself will throw errors that aren't actually a problem. For example, it may underline the hardhat import and say it doesn't exist. These happens because your global Solidity compiler isn't set locally. If you don't know how to fix this, don't worry. Ignore this for now. Also I recommend that you don't use VSCode's terminal, use your own separate terminal! Sometimes the VSCode terminal gives issues if the compiler isn't set.

Let's go line-by-line here.

```javascript
// SPDX-License-Identifier: UNLICENSED
```

Just a fancy comment.  It's called an "SPDX license identifier", feel free to Google what it is :).

```javascript
pragma solidity ^0.8.17;
```

This is the version of the Solidity compiler we want our contract to use. It basically says "when running this, I only want to use version 0.8.17 of the Solidity compiler, nothing lower. Note, be sure your compiler is set to 0.8.17 in `hardhat.config.js`.

```javascript
import "hardhat/console.sol";
```

Some magic given to us by Hardhat to do some console logs in our contract. It's actually challenging to debug smart contracts but this is one of the goodies Hardhat gives us to make life easier.

```javascript
contract MyEpicGame {
    constructor() {
        console.log("THIS IS MY GAME CONTRACT. NICE.");
    }
}
```

So, smart contracts kinda look like a `class` in other languages, if you've ever seen those! Once we initialize this contract for the first time, that constructor will run and print out that line. Please make that line say whatever you want. Have a little fun with it.

### 😲 How do we run it?

Awesome — we've got a smart contract! But, we don't know if it works. We need to actually:

1. Compile it.
2. Deploy it to our local blockchain.
3. Once it's there, that console.log will run.

We're just going to write a custom script that handles those 3 steps for us.

Go into the `scripts` directory and make a file named `run.js`. This is what `run.js` is going to have inside it:

```javascript
const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
  const gameContract = await gameContractFactory.deploy();
  await gameContract.deployed();
  console.log("Contract deployed to:", gameContract.address);
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

`run.js` is our playground to mess around with our contract!

### 🤔 How's it work?

**Note: VSCode might auto-import ethers. We don't need to import ethers or anything. So, make sure not to import anything.**

Again going line by line here.

```javascript
const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
```

This will actually compile our contract and generate the necessary files we need to work with our contract under the `artifacts` directory. Go check it out after you run this :).

```javascript
const gameContract = await gameContractFactory.deploy();
```

This is pretty fancy :).

What's happening here is Hardhat will create a local Ethereum network for us, but just for this contract. Then, after the script completes it'll destroy that local network. So, every time you run the contract, it'll be a fresh blockchain. Whats the point? It's kinda like refreshing your local server every time so you always start from a clean slate which makes it easy to debug errors.

```javascript
await gameContract.deployed();
```

We'll wait until our contract is officially mined and deployed to our local blockchain! That's right, hardhat actually creates fake "miners" on your machine to try its best to imitate the actual blockchain.

Our `constructor` runs when we actually are fully deployed!

```javascript
console.log("Contract deployed to:", gameContract.address);
```

Finally, once it's deployed `gameContract.address` will basically give us the address of the deployed contract. This address is how we can actually find our contract on the blockchain. Right now on our local blockchain it's just us. So, this isn't that cool.

But, there are millions of contracts on the actual blockchain. So, this address gives us easy access to the contract we're interested in working with! This will come in handy when we deploy to the actual blockchain in a few lessons.

### 💨 Run it

Before you run this, be sure to change `solidity: "0.8.4",` to `solidity: "0.8.17",` in your `hardhat.config.js`.

Let's run it! Open up your terminal and run:

```javascript
npx hardhat run scripts/run.js
```

You should see your `console.log` run from within the contract and then you should also see the contract address print out!!!


### 🎩 Hardhat & HRE

In these code blocks you will constantly notice that we use `hre.ethers`, but `hre` is never imported anywhere? What type of sorcery is this?

Directly from the Hardhat docs themselves, you will notice this:

> The Hardhat Runtime Environment, or HRE for short, is an object containing all the functionality that Hardhat exposes when running a task, test or script. In reality, Hardhat is the HRE.
> 

So what does this mean? Every time you run a terminal command that starts with `npx hardhat` you are getting this `hre` object built on the fly using the `hardhat.config.js` specified in your code! This means you will never have to actually do some sort of import into your files like:

`const hardhat = require("hardhat")`

**TL;DR - you will be seeing `hre` a lot in our code, but never imported anywhere! Check out the [Hardhat documentation](https://hardhat.org/advanced/hardhat-runtime-environment.html) to learn more about it!**

### 🚨 Progress report!

Post a screenshot in #progress with the output of `npx hardhat run scripts/run.js` :).
