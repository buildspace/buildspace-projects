## 📤 Setting up to deploy to the blockchain

Go ahead and close the terminal with your local blockchain network running which is where you ran `npx hardhat node`. We won't need it anymore ;). I mainly just wanted to show you how deploying works locally.

Now we're going to be doing the real deal, deploying to the actual blockchain.

For this, we are going to use a tool called thirdweb deploy. Thirdweb deploy is a feature that allows you to deploy contracts without writing scripts or managing configurations such as dotenv.

@ando: For this, we are going to use a tool called thirdweb deploy. Thirdweb deploy is an all encompassing tool that manages your contracts. What is cool here for us is that it takes care of the node end of things for ya and it can deploy your smart contracts without dealing with private keys or scripts.

## 💳 Transactions

So, when we want to perform an action on the Ethereum blockchain we call it a **transaction**. For example, sending someone ETH is a transaction. Doing something that updates a variable in our contract is also considered a transaction.

So when we call `wave` and it does `totalWaves += 1`, that's a transaction! ****Deploying a smart contract is also a transaction.****

Remember, the blockchain has no owner. It's just a bunch of computers around the world run by ****miners**** that have a copy of the blockchain.

When we deploy our contract, we need to tell ****all those**** miners, "hey, this is a new smart contract, please add my smart contract to the blockchain and then tell everyone else about it as well".

## 🕸️ Testnets

We're not going to be deploying to the "Ethereum mainnet" until the very end. Why? Because it costs real $ and it's not worth messing up! We're going to start with a "testnet" which is a clone of "mainnet" but it uses fake $ so we can test stuff out as much as we want. But, it's important to know that testnets are run by actual miners and mimic real-world scenarios.

This is awesome because we can test our application in a real-world scenario where we're actually going to:

1\. Broadcast our transaction

2\. Wait for it to be picked up by actual miners

3\. Wait for it to be mined

4\. Wait for it to be broadcasted back to the blockchain telling all the other miners to update their copies

So, you'll be doing all this within the next few lessons :).

## 🤑 Getting some fake $

There are a few testnets out there and the one we'll be using is called "Rinkeby" which is run by the Ethereum foundation.

In order to deploy to Rinkeby, we need fake ether. Why? Because if you were deploying to the actual Ethereum mainnet, you'd use real money! So, testnets copy how mainnet works, only difference is no real money is involved.

In order to get fake ETH, we have to ask the network for some. ****This fake ETH will only work on this specific testnet.**** You can grab some fake ETH for Rinkeby through a faucet. Make sure that your MetaMask wallet is set to the "Rinkeby Test Network" before using faucet.

For MyCrypto, you'll need to connect your wallet, make an account, and then click that same link again to request funds. For the official rinkeby faucet, if it lists 0 peers, it is not worth the time to make a tweet/public Facebook post.

| Name             | Link                                  | Amount          | Time         |

| ---------------- | ------------------------------------- | --------------- | ------------ |

| MyCrypto         | https://app.mycrypto.com/faucet       | 0.01            | None         |

| Official Rinkeby | https://faucet.rinkeby.io/            | 3 / 7.5 / 18.75 | 8h / 1d / 3d |

| Chainlink        | https://faucets.chain.link/rinkeby    | 0.1             | None         |

## 🙃 Having trouble getting Testnet ETH?

If the above doesn't work, use the `/faucet` command in the #faucet-request channel and our bot will send you some! If you want some more, send your public wallet address and drop a funny gif. Either me, or someone from the project will send you some fake ETH as soon as they can. The funnier the gif, the faster you will get sent fake ETH LOL.

## 📈 Deploy to Rinkeby testnet

We'll need to change our `hardhat.config.js` file. You can find this in the root directory of your smart contract project. We no longer need lines 7-18 so you can comment them out or delete them.

javascript

require("@nomiclabs/hardhat-waffle");

module.exports = {

solidity: "0.8.0",

};

Next, we need to install thirdweb deploy SDK in our terminal. We can do this by running

```jsx
npm install @thirdweb-dev/contracts
```

We are going to need to modify our WavePortal.sol file to import this package and also extend the contract to be a thirdweb contract.

```jsx
// SPDX-License-Identifier: UNLICENSED

 pragma solidity ^0.8.0;

 import "@thirdweb-dev/contracts/ThirdwebContract.sol";

 contract WavePortal is ThirdwebContract {
     // rest of your contract 
 }
```

Once we make these changes and save our modified WavePortal.sol file, we can run `npx thirdweb deploy` in our terminal to compile our contract. The output should look something like this.

![Untitled](Section%202-%20Lesson%202%20f5a2b90876e24f229144ccfefad7822e/Untitled.png)

When we run this command a link will also open up in our default browser with the thirdweb dashboard and our contract ready to deploy. @ando: The thirdweb dashboard provides a nice UI for you manage all of your smart contract in ONE PLACE! ✨

![Untitled](Section%202-%20Lesson%202%20f5a2b90876e24f229144ccfefad7822e/Untitled%201.png)

Go ahead and connect your wallet to the thirdweb dashboard so we can deploy. 

Side note: what’s really cool about this is we can also share this link and others are able to deploy the same contract with their wallet.

Alright, once we are connected we can go ahead and click `Deploy Now`

on our dashboard. 

![Untitled](Section%202-%20Lesson%202%20f5a2b90876e24f229144ccfefad7822e/Untitled%202.png)

Almost there! Now we just have to name our contract and add an optional name and description to go with it. Select our chain as Rinkeby (ETH) and now we can hit the big blue button that says `Deploy Now`

Our wallet will pop up with a prompt to confirm a transaction. After we confirm we are now live on testnet! On our dashboard we can manage our contract and view some of our contract’s functions we will use later in our frontend.

![Untitled](Section%202-%20Lesson%202%20f5a2b90876e24f229144ccfefad7822e/Untitled%203.png)

## ❤️ Deployed!

Copy that address of the deployed contract from the thirdweb dashboard GUI. Don't lose it! You'll need it for the frontend later :). Yours will be different from mine.

- ***You just deployed your contract. WOOOOOOOOO.****

You can actually take that address and then paste it into Etherscan [here](https://rinkeby.etherscan.io/). Etherscan is a place that just shows us the state of the blockchain and helps us see where our transaction is at. You should see your transaction here :). It may take a minute to show up!

For example, [here's](https://rinkeby.etherscan.io/address/0xd5f08a0ae197482FA808cE84E00E97d940dBD26E) mine!

## 🚨 Before you click "Next Lesson"

- ***YOU JUST DID A LOT.****

You should totally ****tweet**** out that you just wrote and deployed your first smart contract and tag @_buildspace. If you want, include a screenshot of the Etherscan page that shows that your contract is on the blockchain!

It's a big deal that you got this far. You created and deployed something to the actual blockchain. ****Holy shit****. ****I'm proud of you.****

You're now someone who is actually "doing" the thing that mostly everyone else is just "talking" about.

You're a step closer to mastering the arts of web3.

KEEP GOING :).

- -
- *Ty to the people who have already been tweeting about us, y'all are legends <3.**

![](https://i.imgur.com/1lMrpFh.png)

![](https://i.imgur.com/W9Xcn4A.png)

![](https://i.imgur.com/k3lJlls.png)