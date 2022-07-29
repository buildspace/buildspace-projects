## 🎨 Finalize your UI, make it your own

You've got all the core functionality down! Now, it's time for you to really make this your own if you haven't already. Change up the CSS, the text, add some funny YouTube embeds, add your own bio, whatever. Make stuff look cool :).

**Spend like 30-minutes on this if you want!! I highly recommend it!**

Btw, while we're testing -- you might want to change your contract's cooldown timer to like 30-seconds instead of 15 minutes like this:

```
require(lastWavedAt[msg.sender] + 30 seconds < block.timestamp, "Must wait 30 seconds before waving again.");
```

Why? Well it can be annoying while you're testing to only be able to wave every 15-minutes! 

So, I changed mine to 30-seconds!

When you deploy your **final** contract, can set this to whatever you want!

## ⛽️ Setting gas limit

When you try to "wave" now, you may notice you sometimes get an error that looks something like "out of gas". Why?

Well, basically Metamask will try to estimate how much gas a transaction will use. But, sometimes it's wrong! In this case, it's made more difficult by the fact that we have some randomness involved. So, if the contract sends a prize then the waver needs to pay more gas since we're running **more** code.

Estimating gas is a hard problem and an easy workaround for this (so our users don't get angry when a transaction fails) is to set a limit.

On App.js, I changed the line that sends the wave to 

```solidity
wavePortalContract.wave(message, { gasLimit: 300000 })
```

What this does is make the user pay a set amount of gas of 300,000. And, if they don't use all of it in the transaction they'll automatically be refunded.

So, if a transaction costs 250,000 gas then *after* that transaction is finalized that 50,000 gas left over that the user didn't use will be refunded :).

## 🔍 Validating the transaction

When your contract has been deployed and you're testing it out with your UI and your wallet, it may be confusing at first to determine whether your wallet's account was successfully rewarded with the prize. Your account will have used up some amount of gas and potentially have been rewarded with ETH. So how can you validate whether your contract is working as expected?

To validate, you can open up your contract address on [Rinkeby Etherscan](https://rinkeby.etherscan.io/) and view the transactions that have taken place. You'll find all sorts of useful information in here, including the method that was called, which in this case is `Wave`. If you click into a `Wave` transaction, you'll notice that in the `To` property, it will identify that the contract address was called. If the user had won a prize, you'll notice in that field, that the contract has transferred 0.0001 ETH from the contract address to your account address.

Note that the `Value` of the transaction is still 0 ETH, because the user never paid anything to initiate the wave. The transfer of ETH internally from a smart contract is called an "internal transaction" and you can view them by switching the tab on Etherscan.

## 🎤 Events

Remember how we used that magic line below in our smart contract? I told you to Google how events in Solidity work. Please do that now if you didn't already!

```solidity
emit NewWave(msg.sender, block.timestamp, _message);
```

At a basic level, events are messages our smart contracts throw out that we can capture on our client in real-time.

Let's say I'm chilling on your website and I just have it open. While I'm doing this, your other friend Jeremy waves to you. Right now, the only way I'd see Jeremy's wave is if I refreshed my page. This seems bad. Wouldn't it be cool if I could know that that contract was updated and have my UI magically update?

Even now, it's kinda annoying when we ourselves submit a message, and then we have to wait for it to be mined and then refresh the page to see all the updated list of messages, right? Let's fix that.

Check out my code here where I updated `getAllWaves` in `App.js.` 

```javascript
const getAllWaves = async () => {
  const { ethereum } = window;

  try {
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      const waves = await wavePortalContract.getAllWaves();

      const wavesCleaned = waves.map(wave => {
        return {
          address: wave.waver,
          timestamp: new Date(wave.timestamp * 1000),
          message: wave.message,
        };
      });

      setAllWaves(wavesCleaned);
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * Listen in for emitter events!
 */
useEffect(() => {
  let wavePortalContract;

  const onNewWave = (from, timestamp, message) => {
    console.log("NewWave", from, timestamp, message);
    setAllWaves(prevState => [
      ...prevState,
      {
        address: from,
        timestamp: new Date(timestamp * 1000),
        message: message,
      },
    ]);
  };

  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
    wavePortalContract.on("NewWave", onNewWave);
  }

  return () => {
    if (wavePortalContract) {
      wavePortalContract.off("NewWave", onNewWave);
    }
  };
}, []);
```

At the very bottom you'll see the magic bit of code I added :). Here, I can actually "listen" when my contract throws the `NewWave` event. Like a webhook :). Pretty dope, right?

I can also access that data on that event like `message` and `from`. Here, I do a `setAllWaves` when I get this event which means the user's message will automatically be appended to my `allWaves` array when we receive the event and our UI will update!

This is super powerful. It lets us create web apps that update in real-time :). Think about if you were making something like a Uber or Twitter on the blockchain, web apps that update in real-time become mega important.

I want you to hack around with this and build whatever you want :).


## 🙉 A note on github

**If uploading to Github, don't upload your hardhat config file with your private key to your repo. You will get robbed.**

I use dotenv for this.

```bash
npm install --save dotenv
```

Your hardhat.config.js file would look something like:

```javascript
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
  solidity: "0.8.0",
  networks: {
    rinkeby: {
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

```
STAGING_QUICKNODE_KEY=BLAHBLAH
PROD_QUICKNODE_KEY=BLAHBLAH
PRIVATE_KEY=BLAHBLAH
```

 Be sure to have the .env in your .gitignore.

## 🎉 That's a wrap

You've done it. You've deployed a smart contract and you've written a web app that talks to it. These are two skills that are going to change the world even more as we move towards a reality where decentralized web apps become more commonplace. 

I hope this was a fun introduction to web3 and I hope you continue your journey.

I'll keep you all posted on new projects in the Discord :).

## 🤟 Your NFT!

We'll airdrop you your NFT within an hour and will email you once it's in your wallet. It's running on a cron job! If you don't get the email within 24-hours pls pls pls drop us a message in #feedback and tag @ **alec#8853**.


## 🚨 Before you head out

Go to #showcase in Discord and show us your final product that we can mess around with :).

Also, should totally tweet out your final project and show the world your epic creation! What you did wasn't easy by any means. Maybe even make a little video showing off your project and attach that to the tweet. Make your tweet look pretty and show off :).

And if you feel up to it, tag @_buildspace :). We'll RT it. Plus, it gives us a ton of motivation whenever we see people ship their projects.

Lastly, what would also be awesome is if you told us in #feedback how you liked this project and the structure of the project. What did you love most about buildspace? What would like us to change for future projects? Your feedback would be awesome!!


See yah around!!!


## 🎁 Wrap Up

*YOU DID IT.* Claps all around 👏! Want to see all the code we wrote for this section? Click on [this link](https://gist.github.com/adilanchian/93fbd2e06b3b5d3acb99b5723cebd925) to see it all!
