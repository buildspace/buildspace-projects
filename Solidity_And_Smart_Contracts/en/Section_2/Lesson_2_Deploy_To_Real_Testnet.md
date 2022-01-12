📤 Setting up to deploy to the blockchain
-----------------------------------------

Go ahead and close the terminal with your local blockchain network running which is where you ran `npx hardhat node`. We won't need it anymore ;). I mainly just wanted to show you how deploying works locally.

Now we're going to be doing the real deal, deploying to the actual blockchain.

Go ahead and make an account with Alchemy [here](https://alchemy.com/?r=b93d1f12b8828a57).

Sorry for having you make so many accounts, but, this ecosystem is complex and we want to take advantage of the awesome tools out there. What Alchemy does is it gives us a simple way to deploy to the real Ethereum blockchain.

💳 Transactions
---------------

So, when we want to perform an action on the Ethereum blockchain we call it a *transaction*. For example, sending someone ETH is a transaction. Doing something that updates a variable in our contract is also considered a transaction.

So when we call `wave` and it does `totalWaves += 1`, that's a transaction! **Deploying a smart contract is also a transaction.**

Remember, the blockchain has no owner. It's just a bunch of computers around the world run by **miners** that have a copy of the blockchain.

When we deploy our contract, we need to tell **all those** miners, "hey, this is a new smart contract, please add my smart contract to the blockchain and then tell everyone else about it as well".

This is where Alchemy comes in.

Alchemy essentially helps us broadcast our contract creation transaction so that it can be picked up by miners as quickly as possible. Once the transaction is mined, it is then broadcasted to the blockchain as a legit transaction. From there, everyone updates their copy of the blockchain.

This is complicated. And, don't worry if you don't fully understand it. As you write more code and actually build this app, it'll naturally make more sense. 

So, make an account with Alchemy [here](https://alchemy.com/?r=b93d1f12b8828a57).

Checkout the video below to see how to get your API key for a testnet!
[Loom](https://www.loom.com/share/21aa1d64ea634c0c9da8fc5faaf24283)

🕸️ Testnets
------------

We're not going to be deploying to the "Ethereum mainnet" until the very end. Why? Because it costs real $ and it's not worth messing up! We're going to start with a "testnet" which is a clone of "mainnet" but it uses fake $ so we can test stuff out as much as we want. But, it's important to know that testnets are run by actual miners and mimic real-world scenarios.

This is awesome because we can test our application in a real-world scenario where we're actually going to:

1\. Broadcast our transaction

2\. Wait for it to be picked up by actual miners

3\. Wait for it to be mined

4\. Wait for it to be broadcasted back to the blockchain telling all the other miners to update their copies

So, you'll be doing all this within the next few lessons :).

🤑 Getting some fake $
------------------------

There are a few testnets out there and the one we'll be using is called "Rinkeby" which is run by the Ethereum foundation.

In order to deploy to Rinkeby, we need fake ether. Why? Because if you were deploying to the actual Ethereum mainnet, you'd use real money! So, testnets copy how mainnet works, only difference is no real money is involved.

In order to get fake ETH, we have to ask the network for some. **This fake ETH will only work on this specific testnet.** You can grab some fake ETH for Rinkeby through a faucet. Make sure that your MetaMask wallet is set to the "Rinkeby Test Network" before using faucet.

For MyCrypto, you'll need to connect your wallet, make an account, and then click that same link again to request funds. For the official rinkeby faucet, if it lists 0 peers, it is not worth the time to make a tweet/public Facebook post.

| Name             | Link                                  | Amount          | Time         |
| ---------------- | ------------------------------------- | --------------- | ------------ |
| MyCrypto         | https://app.mycrypto.com/faucet       | 0.01            | None         |
| Buildspace       | https://buildspace-faucet.vercel.app/ | 0.025           | 1d           |
| Ethily           | https://ethily.io/rinkeby-faucet/     | 0.2             | 1w           |
| Official Rinkeby | https://faucet.rinkeby.io/            | 3 / 7.5 / 18.75 | 8h / 1d / 3d |
| Chainlink        | https://faucets.chain.link/rinkeby    | 0.1             | None         |


🙃 Having trouble getting Testnet ETH?
-----------------------------------

If the above doesn't work, use the `/faucet` command in the #faucet-request channel and our bot will send you some! If you want some more, send your public wallet address and drop a funny gif. Either me, or someone from the project will send you some fake ETH as soon as they can. The funnier the gif, the faster you will get sent fake ETH LOL.

📈 Deploy to Rinkeby testnet.
---------------------------------

We'll need to change our `hardhat.config.js` file. You can find this in the root directory of your smart contract project.

```javascript
require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.0",
  networks: {
    rinkeby: {
      url: "YOUR_ALCHEMY_API_URL",
      accounts: ["YOUR_PRIVATE_RINKEBY_ACCOUNT_KEY"],
    },
  },
};
```

**Note: DON'T COMMIT THIS FILE TO GITHUB. IT HAS YOUR PRIVATE KEY. YOU WILL GET HACKED + ROBBED. THIS PRIVATE KEY IS THE SAME AS YOUR MAINNET PRIVATE KEY.** We'll talk about `.env` variables later and how to keep this stuff secret.

You can grab your API URL from the Alchemy dashboard and paste that in. Then, you'll need your **private** rinkeby key (not your public address!) which you can grab from metamask and paste that in there as well.

**Note: Accessing your private key can be done by opening MetaMask, change the network to "Rinkeby Test Network" and then click the three dots and select "Account Details" > "Export Private Key"**

Why do you need to use your private key? Because in order to perform a transaction like deploying a contract, you need to "login" to the blockchain. And, your username is your public address and your password is your private key. It's kinda like logging into AWS or GCP to deploy.

Once you've got your config setup we're set to deploy with the deploy script we wrote earlier.

Run this command from the root directory of `my-wave-portal`. Notice all we do is change it from `localhost` to `rinkeby`.

```bash
npx hardhat run scripts/deploy.js --network rinkeby
```

❤️ Deployed! 
-------------

Here's my output:

```bash
Deploying contracts with the account: 0xF79A3bb8d5b93686c4068E2A97eAeC5fE4843E7D
Account balance: 3198297774605223721
WavePortal address: 0xd5f08a0ae197482FA808cE84E00E97d940dBD26E
```

Copy that address of the deployed contract in the last line and save it somewhere. Don't lose it! You'll need it for the frontend later :). Yours will be different from mine.

**You just deployed your contract. WOOOOOOOOO.**

You can actually take that address and then paste it into Etherscan [here](https://rinkeby.etherscan.io/). Etherscan is a place that just shows us the state of the blockchain and helps us see where our transaction is at. You should see your transaction here :). It may take a minute to show up!

For example, [here's](https://rinkeby.etherscan.io/address/0xd5f08a0ae197482FA808cE84E00E97d940dBD26E) mine!

🚨 Before you click "Next Lesson"
---------------------------------

**YOU JUST DID A LOT.**

You should totally **tweet** out that you just wrote and deployed your first smart contract and tag @_buildspace. If you want, include a screenshot of the Etherscan page that shows that your contract is on the blockchain!

It's a big deal that you got this far. You created and deployed something to the actual blockchain. **Holy shit**. **I'm proud of you.**

You're now someone who is actually "doing" the thing that mostly everyone else is just "talking" about.

You're a step closer to mastering the arts of web3.

KEEP GOING :).

--

*Ty to the people who have already been tweeting about us, y'all are legends <3.*

![](https://i.imgur.com/1lMrpFh.png)

![](https://i.imgur.com/W9Xcn4A.png)

![](https://i.imgur.com/k3lJlls.png)
