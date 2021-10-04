🎨 Finalize your UI, make it your own.
--------------------------------------

You've got all the core functionality down! Now, it's time for you to really make this your own if you haven't already. Change up the CSS, the text, add some funny YouTube embeds, add your own bio, whatever. Make stuff look cool :).

**Spend like 30-minutes on this if you want!! I highly recommend it!**

Btw, while we're testing -- you might want to change your contract's cooldown timer to like 30-seconds instead of 15 minutes like this:

```
require(lastWavedAt[msg.sender] + 30 seconds < block.timestamp, "Must wait 30 seconds before waving again.");
```

Why? Well it can be annoying while you're testing to only be able to wave every 15-minutes! 

So, I changed mine to 30-seconds!

When you deploy your **final** contract, can set this to whatever you want!

⛽️ Setting gas limit
--------------------

When you try to "wave" now, you may notice you sometimes get an error that looks something like "out of gas". Why?

Well, basically Metamask will try to estimate how much gas a transaction will use. But, sometimes it's wrong! In this case, it's made more difficult by the fact that we have some randomness involved. So, if the contract sends a prize then the waver need to pay more gas since we're running **more** code.

Estimating gas is a hard problem and an easy workaround for this (so our users don't get angry when a transaction fails) is to set a limit.

On App.js, I changed the line that sends the wave to 

```solidity
waveportalContract.wave(message, { gasLimit: 300000 })
```

What this does is make the user pay a set amount of gas of 300,000. And, if they don't use all of it in the transaction they'll automatically be refunded.

So, if a transaction costs 250,000 gas then *after *that transaction is finalized that 50,000 gas left over that the user didn't use will be refunded :).

🎤 Events
---------

Remember how we used that magic line below in our smart contract? I told you to Google how events in Solidity work. Please do that now if you didn't already!

```solidity
emit NewWave(msg.sender, block.timestamp, _message);
```

At a basic level, events are messages our smart contracts throw out that we can capture on our client in real-time.

Lets say I'm chilling on your website and I just have it open. While I'm doing this, your other friend Jeremy waves to you. Right now, the only way I'd see Jeremy's wave is if I refreshed my page. This seems bad. Wouldn't it be cool if I could know that that contract was updated and have my UI magically update?

Even now, it's kinda annoying when we ourselves submit a message, and then we have to wait for it to be mined and then refresh the page to see all the updated list of messages, right? Lets fix that.

Check out my code here where I updated `getAllWaves` in `App.js.` 

```javascript
 const getAllWaves = async () => {
    const { ethereum } = window;

    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const waves = await wavePortalContract.getAllWaves();

        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        setAllWaves(wavesCleaned);

        /**
         * Listen in for emitter events!
         */
        wavePortalContract.on("NewWave", (from, timestamp, message) => {
          console.log("NewWave", from, timestamp, message);

          setAllWaves(prevState => [...prevState, {
            address: from,
            timestamp: new Date(timestamp * 1000),
            message: message
          }]);
        });
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }
```

At the very bottom you'll see the magic bit of code I added :). Here, I can actually "listen" when my contract throws the `NewWave` event. Like a webhook :). Pretty dope, right?

I can also access that data on that event like `message` and `from`. Here, I do a `setAllWaves` when I get this event which means the user's message will automatically be appended to my `allWaves` array when we receive the event and our UI will update!

This is super powerful. It lets us create web apps that update in real-time :). Think about if you were making something like a Uber or Twitter on the blockchain, web apps that update in real-time become mega important.

I want you to hack around with this and build whatever you want :).


🙉 A note on github
----------------

**If uploading to Github, don't upload your hardhat config file with your private key to your repo. You will get robbed.**

I use dotenv for this.

```bash
npm install --save dotenv
```

```javascript
require('@nomiclabs/hardhat-waffle');
require('dotenv').config();

module.exports = {
  solidity: '0.8.0',
  networks: {
    rinkeby: {
      url: process.env.STAGING_ALCHEMY_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
    mainnet: {
      chainId: 1,
      url: process.env.PROD_ALCHEMY_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
```

And your .env file would look something like:

```
STAGING_ALCHEMY_KEY=BLAHBLAH
PROD_ALCHEMY_KEY=BLAHBLAH
PRIVATE_KEY=BLAHBLAH
```

 Be sure to have the .env in your .gitignore.

🎉 That's a wrap
----------------

You've done it. You've deployed a smart contract and you've written a web app that talks to it. These are two skills that are going to change the world even more as we move towards a reality where decentralized web apps become more commonplace. 

I hope this was a fun introduction to web3 and I hope you continue your journey.

I'll keep you all posted on new projects in the Discord :).

See yah around!!

🚨 Before you head out...
-------------------------

Go to #showcase and show us your final product that we can mess around with :). If you tweet it out and tag @_buildspace we'll retweet it!

What would also be awesome is if you told us in #feedback how you liked this project and the structure of the course. What did you love most about buildspace? What would like us to change for future projects? Your feedback would be awesome!!

🎁 Wrap Up
----------

*YOU DID IT.* Claps all around 👏! Want to see all the code we wrote for this section? Click on [this link](https://gist.github.com/adilanchian/93fbd2e06b3b5d3acb99b5723cebd925) to see it all!
