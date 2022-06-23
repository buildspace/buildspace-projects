## 👀 Writing a script to deploy locally

*"Wait, didn't I already deploy to my local network??"*

Well, sorta.

Remember, when you run `scripts/run.js` it's actually 

1\. Creating a new local Ethereum network.\
2\. Deploying your contract.\
3\. Then, when the script ends Hardhat will automatically **destroy** that local network.

We need a way to keep the local network alive. Why? Well, think about a local server. You want to keep it alive so you can keep talking to it! For example, if you have a local server with an API you made, you want to keep that local server alive so you can work on your website and test it out.

We're going to do the same thing here. 

Head to your terminal and create a **new** window. In this window, cd back to your `my-wave-portal` project. Then, in here go ahead and run

```bash
npx hardhat node
```

BOOM.

You just started a local Ethereum network that **stays alive**. And, as you can see Hardhat gave us 20 accounts to work with and gave them all 10000 ETH we are now rich! Wow! Best project ever.

So right now, this is just an empty blockchain. No blocks!

We want to create a new block and get our smart contract on it! Lets do that.

Under the `scripts` folder, create a file called `deploy.js`. Here's the code for it. It looks super similar to `run.js`.

```javascript
const main = async () => {
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();

  console.log("Deploying contracts with account: ", deployer.address);
  console.log("Account balance: ", accountBalance.toString());

  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();

  console.log("WavePortal address: ", waveContract.address);
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

## 🎉 DEPLOY

Now the command we're going to run to deploy locally is:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

**You need to make sure you do this from the** `my-wave-portal` **directory from a different terminal window. We don't want to mess with the terminal window that's keeping our local Ethereum network alive.**

Okay, so once I run that here's what I get:

![](https://i.imgur.com/ZXehYOk.png)

Epic. 

We deployed the contract, and we also have its address on the blockchain! Our website is going to need this so it knows where to look on the blockchain for your contract. (Imagine if it had to search the whole blockchain for our contract. That would be...bad!).

In your terminal window that's keeping your local Ethereum network alive, you'll see something new!

![](https://i.imgur.com/DmhZRJN.png)

INTERESTING. But...what's gas? What does it mean by block #1? What's the big code next to "Transaction"? I want you to try and Google this stuff. Ask questions in #general-chill-chat :).


## 🚨 Before you click "Next Lesson"

Honestly, just give yourself a pat on the back. You've done a lot. Next we'll be actually building a website that will interact with our local Ethereum network and it's going to be awesome. Head to #progress and let me know how this project is going so far for you. I'd love your feedback.


## 🎁 Section Wrap Up

Nice! You made it to the end of the section. Checkout [this link](https://gist.github.com/adilanchian/9f745fdfa9186047e7a779c02f4bffb7) to make sure you are on track with your code!
