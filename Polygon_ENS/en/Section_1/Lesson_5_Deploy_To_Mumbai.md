Everything is feeling REALLY good right now. We are doing tons of cool stuff on-chain and learning a lot about how Polygon works!

**Congratulations - you are now ready to deploy to Polygon’s Testnet.**

It’s insane how easy it will be to get this in the hands of **real users**. Let’s do this.

### 💳 Transactions

I want to outline how this is going to work before we dive in -

Deploying your contract counts as a transaction. And just like any transaction on the blockchain, the entire network needs to know of a new change. This can be anything like adding a new contract to the chain or someone sending some MATIC!

When we deploy our contract, we need to tell **all** the nodes: 

**"hey, this is a new smart contract, please add my smart contract to the blockchain and then tell everyone else about it as well"**

This is where [QuickNode](https://www.quicknode.com?tap_a=67226-09396e&tap_s=3047999-9900de) comes in.

QuickNode helps us broadcast our contract creation transaction so that it can be picked up by miners as quickly as possible. Once the transaction is mined, it is then broadcasted to the blockchain as a legit transaction. From there, everyone updates their copy of the blockchain.

This is complicated. And, don't worry if you don't fully understand it. As you write more code and actually build this app, it'll naturally make more sense.

This is where we will start - making an account with QuickNode! Just [click here](https://www.quicknode.com?tap_a=67226-09396e&tap_s=3047999-9900de) to get started. Once you have your account all ready to go, we will need to grab our API key. Take a look at this video I made to learn how to quickly get this key as we will need it for later:

[Loom](https://www.loom.com/share/bdbe5470b4b745819782f6727ba60baa)

### 🦊 MetaMask

Before we can do anything on a public net, we need a wallet!

There are a bunch of these, but, for this project we're going to use MetaMask. Download the browser extension and set up your wallet [here](https://metamask.io/download.html). Even if you already have another wallet provider, just use MetaMask for now, it’s much easier to test with.

Why do we need MetaMask? Remember how Hardhat gave us randomly generated wallets? We need a wallet for the same exact reason - **to interaction with the blockchain.**

So, go ahead and set it all up! Their setup flow is pretty self-explanatory :).

### ⛓️ Adding Polygon to Metamask

Since the Polygon networks aren’t in Metamask by default, you’ll need to add them.

Here's what you'll need to do:
1. Go to the [Polygonscan Mumbai](https://mumbai.polygonscan.com/) website with the browser you have Metamask installed on
2. Scroll all the way to the bottom
3. Click on the "Add Mumbai Network" button on the bottom right

That will pop open Metamask and you can add it! 

Make sure you add **both** the testnet and the mainnet lol, they’re separate.

### 🤑 Getting some fake $

There are a few testnets out there and the one we'll be using is called "Matic Mumbai" which is run by the Polygon foundation. It is the only testnet for Polygon.

In order to deploy to Mumbai, we need fake MATIC tokens. Why? Because if you were deploying to the actual Polygon mainnet, you'd use real money lol. So, testnets copy how mainnet works, only difference is no real money is involved.

In order to get fake MATIC, we have to ask the network for some. **This fake MATIC will only work on this specific testnet.**

*Note: You can find your public Polygon address [here](https://metamask.zendesk.com/hc/en-us/articles/360015289512-How-to-copy-your-MetaMask-account-public-address-).*

To get some fake MATIC, head over to Polygon’s faucet system here - [https://faucet.polygon.technology/](https://faucet.polygon.technology/)

Once your transaction is mined, you'll have some fake MATIC in your wallet.

![https://i.imgur.com/2IjDg3x.png](https://i.imgur.com/2IjDg3x.png)

### 🚀 Setup a deploy.js file

NICE. We are super close to deploying to the world 🌎. If you remember, we created our `run.js` file to deploy to our local blockchain and then run some functions on it to test things out. When deploying to the Mumbai testnet we want to create a separate file that we know will be used to always deploy to the testnet.

If you think about it, `run.js` is where we mess around a lot, we want to keep it separate. Go ahead and create a file named `deploy.js` under the `scripts` folder. It'll be very similar to the `run.js` file, except with more `console.log` statements. Here’s what I went with:

```jsx
const main = async () => {
  const domainContractFactory = await hre.ethers.getContractFactory('Domains');
  const domainContract = await domainContractFactory.deploy("ninja");
  await domainContract.deployed();

  console.log("Contract deployed to:", domainContract.address);

  // CHANGE THIS DOMAIN TO SOMETHING ELSE! I don't want to see OpenSea full of bananas lol
  let txn = await domainContract.register("banana",  {value: hre.ethers.utils.parseEther('0.1')});
  await txn.wait();
  console.log("Minted domain banana.ninja");

  txn = await domainContract.setRecord("banana", "Am I a banana or a ninja??");
  await txn.wait();
  console.log("Set record for banana.ninja");

  const address = await domainContract.getAddress("banana");
  console.log("Owner of domain banana:", address);

  const balance = await hre.ethers.provider.getBalance(domainContract.address);
  console.log("Contract balance:", hre.ethers.utils.formatEther(balance));
}

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

### 📈 Deploy to the Mumbai testnet

**It is time.** 

BUT - before we can get our fancy contract on the testnet, we will need to make a few changes.

We need to start with our `hardhat.config.js` file. You can find this in the root directory of your smart contract project. Here we are going to add what network we are using and some super secret keys:

```jsx
require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.10",
  networks: {
    mumbai: {
      url: "YOUR_QUICKNODE_MUMBAI_URL",
      accounts: ["YOUR_TEST_WALLET_PRIVATE_KEY"],
    }
  }
};
```

I **highly recommend** that you create a separate wallet within MetaMask (or whichever other Ethereum wallet app you’re using) for development and testing. It takes ~10 seconds and you’ll thank yourself when you accidentally publish a public repo with your private key late at night.

Remember the API url you grabbed a few steps ago - time to use it in the url section! Make sure your app is for the Polygon Mumbai testnet. Then, you'll need your **private** key (not your public address!) which you can [grab from metamask](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key) and paste that in there as well.

**Note: DON'T COMMIT THIS FILE TO GITHUB. IT HAS YOUR PRIVATE KEY. YOU WILL GET HACKED + ROBBED. THIS PRIVATE KEY IS THE SAME AS YOUR MAINNET PRIVATE KEY.** We'll talk about `.env` variables later and how to keep this stuff secret.

In the meantime - open your `.gitignore` file and add a line for `hardhat.config.js`. You can remove this later when you set up `.env`.

Why do you need to use your private key? Because in order to perform a transaction like deploying a contract, you need to "login" to the blockchain and sign/deploy the contract. And, your username is your public address and your password is your private key. It's kinda like logging into AWS or GCP to deploy.

Once you've got your config setup we are set to deploy with the deploy script we wrote earlier.

Run this command from the root directory of `cool-domains`.

```
npx hardhat run scripts/deploy.js --network mumbai
```

It takes like 20-40 seconds to deploy usually. We're not only deploying! We're also minting NFTs in `deploy.js` so that'll take some time as well. We actually need to wait for the transaction to be "mined" + picked up by nodes. Pretty epic :). That one command does all that! If all goes well - you will see an output that looks a little something like this

![https://i.imgur.com/OIQo3il.png](https://i.imgur.com/OIQo3il.png)

**WOW. You have deployed to Polygon ✨!** 

Before continuing lets make sure things are looking good! We can do this by using [Mumbai Polygonscan](https://mumbai.polygonscan.com/) where you can paste the contract address that was output in your terminal and see what's up with it! 

If everything worked as expected you should be able to see some transactions that were executed based on your contract!

![https://i.imgur.com/uc5r1Qz.png](https://i.imgur.com/uc5r1Qz.png)

Get used to using Polygonscan because it's like the easiest way to track deployments and debug issues if something goes wrong. If it's not showing up on Polygonscan , then that means it's either still processing or something went wrong!

If it worked — **AWEEEEESOME YOU JUST DEPLOYED A CONTRACT YESSSS.**

### 🌊 View on OpenSea

Now thats not all.. Not only did you just deploy your contract, but you ALSO minted your first domain as an NFT 🎉. Whats even better is we can see it RIGHT NOW on OpenSea’s Testnet!

Head to [testnets.opensea.io](https://testnets.opensea.io/). Search for your contract address which is the address we deployed to that you can find in your terminal, ****Don't click enter****, click the collection itself when it comes up in the search.

![https://i.imgur.com/UvRYjhX.png](https://i.imgur.com/UvRYjhX.png)

So here, you'd click "Ninja Name Service" under "Collections", and boom you'll see the domain you minted!

![https://i.imgur.com/lvEYCwd.png](https://i.imgur.com/lvEYCwd.png)

HOOOOLY. LETS GO. IM HYPE **FOR** YOU.

Pretty epic, we've created our own domain contract **and** minted a domain. 

### 🙀 Help my NFTs aren't showing on OpenSea!

**If your NFTs aren't showing up on OpenSea** — wait a few minutes, sometimes OpenSea can take like 5-minutes.

If you don’t want to wait, or OpenSea is just not working, head over to [testnets.dev](http://testnets.dev). It’s a small app I made because OpenSea is sloooow and doesn’t support many testnets. Select Mumbai, put in your contract address and set the token ID to 0. Ta-da! You can see your domain on the actual blockchain!

![https://i.imgur.com/v8ON9VB.png](https://i.imgur.com/v8ON9VB.png)

### 🚨Progress report

*Please do this else Raza will be sad :(*

Epic work! Go ahead and post your deployed contract on PolygonScan in `#progress`

Feel free to also post a screenshot of your OpenSea mint in #progress. Show everyone how hot your domain looks!