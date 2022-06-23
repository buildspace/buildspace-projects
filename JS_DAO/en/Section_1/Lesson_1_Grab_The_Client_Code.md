### 💎 What we're going to do

We're going to build a web app for people to: **connect their wallet → mint a membership NFT → receive a token airdrop → and actually vote on proposals.** The web app is what I'll be calling our  "DAO Dashboard". It's where our new members can join and it allows existing members to see what the DAO is up to.

### 🤯 Replit!

We'll be using this thing called [Replit](https://replit.com/~)! It is a browser-based IDE that lets us easily build web apps and deploy them all from the browser. It is super legit. Instead of having to set up a full local environment and write commands to deploy, it's all just given to us.

Make an account on Replit before moving on.

I've already created a basic react project that you can **fork** on Replit. **Just go [here](https://replit.com/@NachoIacovino/buildspace-dao-starter-v2), and near the right you'll see the "Fork" button.** Be sure you're logged in, then click this.

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

Once you set up your wallet, be sure to switch the network to "**Rinkeby**" which is the test network we'll be working with.

![Untitled](https://i.imgur.com/Kx3AZDp.png)

### 💸 Make sure you have testnet funds

We're **not** going to be deploying to the "Ethereum mainnet". Why? Because it costs real $ and it's not worth messing up. We're going to start with a "testnet" which is a clone of "mainnet" but it uses fake $ so we can test stuff out as much as we want. But, it's important to know that testnets are run by actual miners and mimic real-world scenarios.

We'll be using "Rinkeby" which is run by the Ethereum Foundation. To get some fake ETH, head to the buildspace Discord, and go to the `#faucet-request` under the "Resources" section. In this channel run:

```plaintext
/faucet INSERT_YOUR_PUBLIC_ADDRESS_HERE
```

You can find your public address [here](https://metamask.zendesk.com/hc/en-us/articles/360015289512-How-to-copy-your-MetaMask-account-public-address-).

Once your transaction is mined, you'll have some fake ETH in your wallet.

![Untitled](https://i.imgur.com/9kZbhTN.png)

### 🚨 Progress Report

*Please do this else Farza will be sad :(*

In `#progress` upload a screenshot of your Metamask showing your total balance on Rinkeby like I have above.
