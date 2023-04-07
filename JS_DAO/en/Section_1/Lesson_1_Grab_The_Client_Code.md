### 💎 What we're going to do

We're going to build a web app for people to: **connect their wallet → mint a membership NFT → receive a token airdrop → and actually vote on proposals.** The web app is what I'll be calling our  "DAO Dashboard". It's where our new members can join and it allows existing members to see what the DAO is up to.

### 🤯 Replit!

We'll be using this thing called [Replit](https://replit.com/~)! It is a browser-based IDE that lets us easily build web apps and deploy them all from the browser. It is super legit. Instead of having to set up a full local environment and write commands to deploy, it's all just given to us.

Make an account on Replit before moving on.

I've already created a basic react project that you can **fork** on Replit. **Just go [here](https://replit.com/@thirdweb/buildspace-dao-starter-v3), and near the right you'll see the "Fork" button.** Be sure you're logged in, then click this.

You'll magically clone my repo and full IDE in your browser to work with the code. Once it stops loading and shows you some code. Click "run" at the top and you're good to go.

Here’s a video I made covering Replit in a past project:

[Loom](https://www.loom.com/share/8e8f47eacf6d448eb5d25b6908021035)

### 👩‍💻 Want to work locally? Get the code

If you don’t wanna use Replit, you don’t have to.

Start by heading over [here](https://github.com/buildspace/buildspace-dao-starter) where you find the starter repo code. From here you're going to want to make sure you press the "Fork" button at the top right of the page:

![](https://i.imgur.com/OnOIO2A.png)

Sweet! When you fork this repo, you are actually creating an identical copy of it that lives under your Github profile. So now you have your own version of this code that you can edit to your heart's content.

The final step here is to actually get your newly forked repo on your local machine. Click the "Code" button and copy that link!

Head to your terminal and `cd` into whatever directory your project will live in. For example, I like to clone my projects to my `Developer` folder. Depends on what you like! Once you find the spot, just clone the repo by running:

```plaintext
git clone YOUR_FORKED_LINK
cd buildspace-dao-starter
```

That's it! From there go ahead and run:

```plaintext
npm install
```

And then:

```plaintext
npm start
```

### 🦊 Get Metamask

Next we need an Ethereum wallet. There are a bunch of these, but, for this project we're going to use Metamask. Download the browser extension and set up your wallet [here](https://metamask.io/download.html). Even if you already have another wallet provider, just use Metamask for now.

But why do we need Metamask? 

Well. We need to be able to call functions on our smart contract that live on the blockchain. And, to do that we need to have a wallet that has our Ethereum address and private key.

It's almost like authentication. We need something to "login" to the blockchain and then use those login credentials to make API requests from our website.

So, in order for our website to talk to the blockchain, we need to somehow connect our wallet to it. Once we connect our wallet to our website, our website will have permission to call smart contracts on our behalf. **Remember, it's just like authenticating into a website.**

So, go ahead and set it all up! Their setup flow is pretty self-explanatory.

Once you set up your wallet, be sure to switch the network to "**Goerli**" which is the test network we'll be working with.

![Untitled](https://i.imgur.com/bw6YUMV.png)

## 🤑 Getting some fake $

There are a few testnets out there and the one we'll be using is called "Goerli" which is run by the Ethereum foundation.

In order to deploy to Goerli, we need fake ETH. Why? Because if you were deploying to the actual Ethereum mainnet, you'd use real money! So, testnets copies how mainnet works, only difference is no real money is involved.

In order to get fake ETH, we have to ask the network for some. **This fake ETH will only work on this specific testnet.** You can grab some fake Ethereum for Goerli through a faucet. You just gotta find one that works lol.

For MyCrypto, you'll need to connect your wallet, make an account, and then click that same link again to request funds. For the official Goerli faucet, if you log into your Alchemy account, you should be able to get 2x the amount.

You have a few faucets to choose from:

| Name             | Link                                  | Amount          | Time         |
| ---------------- | ------------------------------------- | --------------- | ------------ |
| MyCrypto         | https://app.mycrypto.com/faucet       | 0.01            | None         |
| Official Goerli  | https://goerlifaucet.com/             | 0.2            | 24 Hours     |
| Chainlink        | https://faucets.chain.link/goerli     | 0.1             | None         |

You can find your public address [here](https://metamask.zendesk.com/hc/en-us/articles/360015289512-How-to-copy-your-MetaMask-account-public-address-).

Once your transaction is mined, you'll have some fake ETH in your wallet.

![Untitled](https://i.imgur.com/7yyYaDx.png)

### 🚨 Progress Report

*Please do this else Farza will be sad :(*

In `#progress` upload a screenshot of your Metamask showing your total balance on Goerli like I have above.
