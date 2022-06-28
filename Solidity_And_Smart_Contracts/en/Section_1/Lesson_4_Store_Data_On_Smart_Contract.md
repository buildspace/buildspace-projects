## 📦 Store the data!

From here, let's add some fanciness to our contract.

We want to be able to let someone wave at us and then store that wave.

So, first thing we need is a function they can hit to wave at us!

The blockchain = Think of it as a cloud provider, kinda like AWS, but it's owned by no one. It's run by compute power from mining machines all over the world. Usually these people are called miners and we pay them to run our code!

A smart contract = Kinda like our server's code with different functions people can hit.

So, here's our updated contract we can use to "store" waves.

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;

    constructor() {
        console.log("Yo yo, I am a contract and I am smart");
    }

    function wave() public {
        totalWaves += 1;
        console.log("%s has waved!", msg.sender);
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }
}
```

Boom!

So, that's how you write a function in Solidity.  And, we also added a `totalWaves` variable that automatically is initialized to 0. But, this variable is special because it's called a "state variable" and it's cool because it's stored permanently in contract storage.

We also use some magic here with `msg.sender`. This is the wallet address of the person who called the function. This is awesome! It's like built-in authentication. We know exactly who called the function because in order to even call a smart contract function, you need to be connected with a valid wallet!

In the future, we can write functions that only certain wallet addresses can hit. For example, we can change this function so that only our address is allowed to send a wave. Or, maybe have it where only your friends can wave at you!

## ✅ Updating run.js to call our functions

So, `run.js` needs to change!

Why?

Well, we need to manually call the functions that we've created. 

Basically, when we deploy our contract to the blockchain (which we do when we run `waveContractFactory.deploy()`) our functions become available to be called on the blockchain because we used that special **public** keyword on our function.

Think of this like a public API endpoint :).

So now we want to test those functions specifically!

```javascript
const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();

  console.log("Contract deployed to:", waveContract.address);
  console.log("Contract deployed by:", owner.address);

  let waveCount;
  waveCount = await waveContract.getTotalWaves();

  let waveTxn = await waveContract.wave();
  await waveTxn.wait();

  waveCount = await waveContract.getTotalWaves();
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
**VSCode might auto-import `ethers`. We don't need to import `ethers`. So, make sure you have no imports. Remember, what we talked about last lesson about hre?**

## 🤔 How does it work?

```javascript
const [owner, randomPerson] = await hre.ethers.getSigners();
```

In order to deploy something to the blockchain, we need to have a wallet address! Hardhat does this for us magically in the background, but here I grabbed the wallet address of contract owner and I also grabbed a random wallet address and called it `randomPerson`. This will make more sense in a moment.

I also added:

```javascript
console.log("Contract deployed by:", owner.address);
```

I'm doing this just to see the address of the person deploying our contract. I'm curious!

The last thing I added was this:

```javascript
let waveCount;
waveCount = await waveContract.getTotalWaves();

let waveTxn = await waveContract.wave();
await waveTxn.wait();

waveCount = await waveContract.getTotalWaves();
```

Basically, we need to manually call our functions! Just like we would any normal API. First I call the function to grab the # of total waves. Then, I do the wave. Finally, I grab the waveCount one more time to see if it changed.

Run the script like you would normally:

```bash
npx hardhat run scripts/run.js
```

Here's my output:

![](https://i.imgur.com/NgfOns3.png)

Pretty awesome, eh :)?

You can also see that wallet address that waved equaled to the address that deployed the contract. I waved at myself!

So we:\
1\. Called our wave function.\
2\. Changed the state variable.\
3\. Read the new value of the variable.

This is pretty much the basis of most smart contracts. Read functions. Write functions. And changing a state variable. We have the building blocks we need now to keep on working on our epic WavePortal.

Pretty soon, we'll be able to call these functions from our react app that we'll be working on :).


## 🤝 Test other users 

So, we probably want someone other than us to send us a wave right? It'd be pretty boring if only we could send a wave!! We want to make our website **multiplayer**!

Check this out. I added a few lines at the bottom of the function. I'm not going to explain it much (but please ask questions in #general-chill-chat). Basically this is how we can simulate other people hitting our functions :). Keep an eye on the wallet addresses in your terminal once you change the code and run it.

```javascript
const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();

  console.log("Contract deployed to:", waveContract.address);
  console.log("Contract deployed by:", owner.address);

  let waveCount;
  waveCount = await waveContract.getTotalWaves();

  let waveTxn = await waveContract.wave();
  await waveTxn.wait();

  waveCount = await waveContract.getTotalWaves();

  waveTxn = await waveContract.connect(randomPerson).wave();
  await waveTxn.wait();

  waveCount = await waveContract.getTotalWaves();
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

The newest items added to this code block are:

```javascript
waveTxn = await waveContract.connect(randomPerson).wave();
await waveTxn.wait();

waveCount = await waveContract.getTotalWaves();
```

## 🚨 Before you click "Next Lesson"

*Note: if you don't do this, Farza will be very sad :(.*

Customize your code a little!! Maybe you want to store something else? I want you to mess around. Maybe you want to store the address of the sender in an array? Maybe you want to store a map of addresses and wave counts so you keep track of who's waving at you the most? Even if you just change up the variable names and function names to be something you think is interesting that's a big deal. Try to not straight up copy me! Think of your final website and the kind of functionality you want. Build the functionality **you want**.

Once you're all done here, be sure to post a screenshot of your terminal output in #progress.
