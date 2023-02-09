## 📒 Read from the blockchain through our website

Awesome. We made it. We've deployed our website. We've deployed our contract. We've connected our wallet. Now we need to actually call our contract from our website using the credentials we have access to now from Metamask!

So, our smart contract has this function that retrieves the total number of waves.

```solidity
  function getTotalWaves() public view returns (uint256) {
      console.log("We have %d total waves!", totalWaves);
      return totalWaves;
  }
```

Lets call this function from our website :).

Go ahead and write this function right below our `connectWallet()` function.

```javascript
const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
}
```

Quick explanation here:

```javascript
const provider = new ethers.providers.Web3Provider(ethereum);
const signer = provider.getSigner();
```

`ethers` is a library that helps our frontend talk to our contract. Be sure to import it at the top using `import { ethers } from "ethers";`.

A "Provider" is what we use to actually talk to Ethereum nodes. Remember how we were using QuickNode to **deploy**? Well in this case we use nodes that Metamask provides in the background to send/receive data from our deployed contract.

[Here's](https://docs.ethers.io/v5/api/signer/#signers) a link explaining what a signer is on line 2.

Connect this function to our wave button by updating the `onClick` prop from `null` to `wave`:

```html
<button className="waveButton" onClick={wave}>
    Wave at Me
</button>
```

Awesome.

So, right now this code **breaks**. In our replit shell it'll say:

![](https://i.imgur.com/JP2rryE.png)

We need those two variables!!

So, contract address you have -- right? Remember when you deployed your contract and I told you to save the address? This is what it's asking for!

But, what's an ABI? Much earlier I mentioned how when you compile a contract, it creates a bunch of files for you under `artifacts`. An ABI is one of those files.

## 🏠 Setting Your Contract Address

Remember when you deployed your contract to the Goerli Testnet (epic btw)? The output from that deployment included your smart contract address which should look something like this:

```
Deploying contracts with the account: 0xF79A3bb8d5b93686c4068E2A97eAeC5fE4843E7D
Account balance: 3198297774605223721
WavePortal address: 0x957fe7381be45A31967F1EcfAc6Ff001D8AF8D6c
```

You need to get access to this in your React app. It's as easy as creating a new property in your `App.js` file called `contractAddress` and setting its value to the `WavePortal address` thats printed out in your console:

```javascript
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  /**
   * Create a variable here that holds the contract address after you deploy!
   */
  const contractAddress = "0x957fe7381be45A31967F1EcfAc6Ff001D8AF8D6c";
```

## 🛠 Getting ABI File Content
Look at you, already half way down here! Let's move back to our smart contract folder.

When you compile your smart contract, the compiler spits out a bunch of files needed that lets you interact with the contract. You can find these files in the `artifacts` folder located in the root of your Solidity project.

The ABI file is something our web app needs to know how to communicate with our contract. Read about it [here](https://docs.soliditylang.org/en/v0.8.14/abi-spec.html).

The contents of the ABI file can be found in a fancy JSON file in your hardhat project:

`artifacts/contracts/WavePortal.sol/WavePortal.json`


So, the question becomes how do we get this JSON file into our frontend? For this project we are going to do some good old "copy pasta"!

Copy the contents from your `WavePortal.json` and then head to your web app. You are going to make a new folder called `utils` under `src`. Under `utils` create a file named `WavePortal.json`. So the full path will look like:

`src/utils/WavePortal.json`


Paste the whole JSON file right there!

Now that you have your file with all your ABI content ready to go, it's time to import it into your `App.js` file and create a reference to it. Right under where you imported `App.css` go ahead and import your JSON file and create your reference to the abi content:


```javascript
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/WavePortal.json";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");

  const contractAddress = "0x957fe7381be45A31967F1EcfAc6Ff001D8AF8D6c";
  /**
   * Create a variable here that references the abi content!
   */
  const contractABI = abi.abi;
```
Let's take a look at where you are actually using this ABI content:

```javascript
const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        /*
        * You're using contractABI here
        */
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }
  ```

Once you add that file and click the "Wave" button -- **you'll be officially reading data from your contract on the blockchain through your web client**.

## 📝 Writing data

The code for writing data to our contract isn't super different from reading data. The main difference is that when we want to write new data to our contract, we need to notify the miners so that the transaction can be mined. When we read data, we don't need to do this. Reads are "free" because all we're doing is reading from the blockchain, **we're not changing it.**

Here's the code to wave:

```javascript
const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
        * Execute the actual wave from your smart contract
        */
        const waveTxn = await wavePortalContract.wave();
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }
```

Pretty simple, right :)?

What's awesome here is while the transaction is being mined you can actually print out the transaction hash, copy/paste it to [Etherscan](https://goerli.etherscan.io/), and see it being processed in real-time :).

When we run this, you'll see that total wave count is increased by 1. You'll also see that Metamask pops us and asks us to pay "gas" which we pay for using our fake $. There is a great article on it [here](https://ethereum.org/en/developers/docs/gas/). Try and figure out what gas is :).

## 🎉 Success

**NICEEEEEEE :).**

Really good stuff. We now have an actual client that can read and write data to the blockchain. From here, you can do whatever you want. You have the basics down. You can build a decentralized version of Twitter. You can build a way for people to post their favorite memes and allow people to "tip" the people who post the best memes with ETH. You can build a decentralized voting system that a country can use to vote in an election where everything is open and clear.

The possibilities are truly endless.

## 🚨 Before you click "Next Lesson"

*Note: if you don't do this, Farza will be very sad :(.*

Customize your site a little to show the total number of waves. Maybe show a loading bar while the wave is being mined, whatever you want. Do something a little different!

Once you feel like you're ready, share the link to your website with us in #progress so we can connect our wallets and wave at you :).

## 🎁 Wrap Up

You are on your way to conquering the decentralized web. IMPRESSIVE. Take a look at all the code you wrote in this section by visiting [this link](https://gist.github.com/adilanchian/71890bf4fcd8f78e94c77cf694b24659) to make sure you are on track with your code!
