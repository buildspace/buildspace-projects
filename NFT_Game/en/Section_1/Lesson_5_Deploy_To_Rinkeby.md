### 🎉 Getting our NFTs online

When we use `run.js`, it's just us working locally.

The next step is a testnet which you can think of as like a "staging" environment. When we deploy to a testnet we'll actually be able to to **view our NFT online** and we are a step closer to getting this to **real users.**

### 🦊 Metamask

**Note: It's a good idea to create a new account in MetaMask strictly for development purposes. This way, if your development account credentials accidentally leak, your real funds will still be safe.**

[Instructions for adding an account in MetaMask](https://metamask.zendesk.com/hc/en-us/articles/360015289452-How-to-create-an-additional-account-in-your-MetaMask-wallet)

Next we need an Ethereum wallet. There are a bunch of these, but, for this project we're going to use Metamask. Download the browser extension and set up your wallet [here](https://metamask.io/download.html). Even if you already have another wallet provider, just use Metamask for now.

Why do we need Metamask? Well. We need to be able to call functions on our smart contract that live on the blockchain. And, to do that we need to have a wallet that has our Ethereum address and private key.

**But, we need something to connect our website with our wallet so we can securely pass our wallet credentials to our website so our website can use those credentials to call our smart contract. You need to have valid credentials to access functions on smart contracts.**

It's almost like authentication. We need something to "login" to the blockchain and then use those login credentials to make API requests from our website.

So, go ahead and set it all up! Their setup flow is pretty self-explanatory :).

### 💳 Transactions

When we want to perform an action that changes the blockchain we call it a *transaction*. For example, sending someone ETH is a transaction because we're changing account balances. Doing something that updates a variable in our contract is also considered a transaction because we're changing data. Minting an NFT is a transaction because we're saving data on the contract.

**Deploying a smart contract is also a transaction.**

Remember, the blockchain has no owner. It's just a bunch of computers around the world run by **miners** that have a copy of the blockchain.

When we deploy our contract, we need to tell **all those** miners, "hey, this is a new smart contract, please add my smart contract to the blockchain and then tell everyone else about it as well".

This is where [QuickNode](https://www.quicknode.com?tap_a=67226-09396e&tap_s=3047999-9900de) comes in.

QuickNode essentially helps us broadcast our contract creation transaction so that it can be picked up by miners as quickly as possible. Once the transaction is mined, it is then broadcasted to the blockchain as a legit transaction. From there, everyone updates their copy of the blockchain.

This is complicated. And, don't worry if you don't fully understand it. As you write more code and actually build this app, it'll naturally make more sense.

So, make an account with QuickNode [here](https://www.quicknode.com?tap_a=67226-09396e&tap_s=3047999-9900de).

And then check out my video below!

[Loom](https://www.loom.com/share/c079028c612340e8b7439d0d2103a313)

### 🕸 Testnets

We're not going to be deploying to the "Ethereum mainnet" for now. Why? Because it costs real $ and it's not worth messing up! We're just hacking around right now. We're going to start with a "testnet" which is a clone of "mainnet" but it uses fake $ so we can test stuff out as much as we want. But, it's important to know that testnets are run by actual miners and mimic real-world scenarios.

This is awesome because we can test our application in a real-world scenario where we're actually going to:

1. Broadcast our transaction
2. Wait for it to be picked up by actual miners
3. Wait for it to be mined
4. Wait for it be broadcasted back to the blockchain telling all the other miners to update their copies

### 🤑 Getting some fake $

There are a few testnets out there and the one we'll be using is called "Rinkeby" which is run by the Ethereum foundation.

In order to deploy to Rinkeby, we need fake ETH. Why? Because if you were deploying to the actual Ethereum mainnet, you'd use real money! So, testnets copies how mainnet works, only difference is no real money is involved.

In order get fake ETH, we have to ask the network for some. **This fake ETH will only work on this specific testnet.** You can grab some fake Ethereum for Rinkeby through a "faucet". You just gotta find one that works!

Please make sure you're on the **Rinkeby** network on Metamask. This is a super common issue I see!

![Untitled](https://i.imgur.com/MKjsJXX.png)

You have a few faucets to choose from:

| MyCrypto | [https://app.mycrypto.com/faucet](https://app.mycrypto.com/faucet)

| Buildspace | [https://buildspace-faucet.vercel.app/](https://buildspace-faucet.vercel.app/)

| Chainlink | [https://faucets.chain.link/rinkeby](https://faucets.chain.link/rinkeby)

| Rinkeby | [https://faucet.rinkeby.io/](https://faucet.rinkeby.io/)

Note: For MyCrypto, you'll need to connect your wallet, make an account, and then click that same link **again** to request funds. The buildspace faucet is pretty reliable as well, just make sure Metamask is on the Rinkeby network :).

### 🙃 Having trouble getting Testnet ETH?

**Please try the above faucets a few times before giving up. They are not very reliable and take a little bit of effort to get working! MyCrypto is the one I use all the time and hasn't messed up for me yet.**

If the above doesn't work, use the `/faucet` command in the #faucet-request channel and our bot will send you some! If you want some more, send your public wallet address and drop a funny gif. The funny GIF is very important. The funnier the GIF, the faster your request will likely be taken lol.

Someone from the cohort will send you some fake ETH as soon as they can! 

### 🚀 Setup a deploy.js file

It's good practice to separate your deploy script from your `run.js` script. `run.js` is where we mess around a lot, we want to keep it separate. Go ahead and create a file named `deploy.js` under the `scripts` folder. Copy-paste all of `run.js` into `deploy.js`. It's going to be exactly the same right now.

I added a few extra calls to `mintCharacterNFT` as well just to test stuff out!

```javascript
const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
  const gameContract = await gameContractFactory.deploy(                     
    ["Leo", "Aang", "Pikachu"],       
    ["https://i.imgur.com/pKd5Sdk.png", 
    "https://i.imgur.com/xVu4vFL.png", 
    "https://i.imgur.com/u7T87A6.png"],
    [100, 200, 300],                    
    [100, 50, 25]                       
  );
  await gameContract.deployed();
  console.log("Contract deployed to:", gameContract.address);

  
  let txn;
  txn = await gameContract.mintCharacterNFT(0);
  await txn.wait();
  console.log("Minted NFT #1");

  txn = await gameContract.mintCharacterNFT(1);
  await txn.wait();
  console.log("Minted NFT #2");

  txn = await gameContract.mintCharacterNFT(2);
  await txn.wait();
  console.log("Minted NFT #3");

  txn = await gameContract.mintCharacterNFT(1);
  await txn.wait();
  console.log("Minted NFT #4");

  console.log("Done deploying and minting!");

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

### 📈 Deploy to Rinkeby testnet

We'll need to change our `hardhat.config.js` file. You can find this in the root directory of your smart contract project.

```javascript
require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    rinkeby: {
      url: 'YOUR_QUICKNODE_API_URL',
      accounts: ['YOUR_PRIVATE_RINKEBY_ACCOUNT_KEY'],
    },
  },
};
```

You can grab your API URL from the QuickNode dashboard and paste that in. Then, you'll need your **private** rinkeby key (not your public address!) which you can [grab from metamask](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key) and paste that in there as well.

**Note: DON'T COMMIT THIS FILE TO GITHUB. IT HAS YOUR PRIVATE KEY. YOU WILL GET HACKED + ROBBED. THIS PRIVATE KEY IS THE SAME AS YOUR MAINNET PRIVATE KEY. TO REDUCE RISK EVEN MORE, IT'S ALWAYS BEST TO HAVE A DEDICATED DEVELOPMENT ACCOUNT IN METAMASK.** We'll talk about `.env` variables later and how to keep this stuff secret.

Why do you need to use your private key? Because in order to perform a transaction like deploying a contract, you need to "login" to the blockchain and sign/deploy the contract. Also, your username is your public address and your password is your private key. It's kinda like logging into AWS or GCP to deploy.

Once you've got your config setup you're all set to deploy with the deploy script we wrote earlier.

Run this command from the root directory of `epic-game`.

```bash
npx hardhat run scripts/deploy.js --network rinkeby
```

It takes like 1-2 min to deploy usually. We're not only deploying! We're also minting NFTs in deploy.js so that'll take some time as well. We actually need to wait for the transaction to be mined + picked up by miners. Pretty epic :). That one command does all that!

Here's what I get:

```plaintext
Contract deployed to: 0x1bB5b2f90AaB36E2742886f75DD7F3c5B420Bf33
Minted NFT #1
Minted NFT #2
Minted NFT #3
Minted NFT #4
Done deploying and minting!
```

We can make sure it all worked properly using [Rinkeby Etherscan](https://rinkeby.etherscan.io/) where you can paste the contract address that was output and see what's up with it! Here I can see that we've had **five** transactions. **One** contract creation transaction and **four** transactions where we minted the NFT. Which is correct :)!

![Untitled](https://i.imgur.com/hJtoYRp.png)

**Get used to using Rinkeby Etherscan a lot to debug deploys** because it's the easiest way to track deployments and if something goes wrong. If it's not showing up on Etherscan, then that means it's either still processing or something went wrong! Here's what I get:

If it worked — **AWEEEEESOME YOU JUST DEPLOYED A CONTRACT AND MINTED NFTS.**

### 🌊 View on OpenSea

Believe it or not. The NFTs you just minted will be on OpenSea's Testnet site.

Head to [testnets.opensea.io](https://testnets.opensea.io/). Here, search for your contract address which is the address that you can find in your terminal. **Don't click enter on the search bar**. OpenSea is weird so you'll need click the collection itself when it comes up.

So here, you'd click "Heroes - " under "Collections", and boom you'll see the NFTs you minted!

![Untitled](https://i.imgur.com/9ULR2OW.png)

![Untitled](https://i.imgur.com/F9xQHFE.png)

**BOOM THERE ARE MY CHARACTERS!!** If you click one of your characters, you'll be able to click "**Levels**" on the left and even see specific attributes! **We even have a little health bar!!! EPICCCC. Each health bar is different depending on the NFT**, for example Pikachu has 300 HP and Leo has 100 HP!

For example:

![Untitled](https://i.imgur.com/8lry1nA.png)

![Untitled](https://i.imgur.com/mbMf8CI.png)

In this case, OpenSea rendered all our character's attributes properly!

What's cool here is if we change the HP value of this player's NFT to `150` or whatever, it would actually update on OpenSea! **This is super cool because the NFT itself dynamically holds the state of the player's character :).** We don't need any centralized server holding that data.

This is awesome because now when our players go to play the game and we detect their NFT, we'll know exactly what the state of their character NFT is in the game! 

*Note: You'll notice that we minted 4 NFTs to the same wallet in this case — this **wouldn't** be allowed in our game b/c each player would only be allowed to have 1 NFT. I just wanted to test it out. Also, right now `nftHolders` can only hold one tokenId per unique address. So, everytime a new NFT is minted to the same address, the previous `tokenId` is overwritten. You could throw an error if you wanted to instead.*

### 🙀 "Help my NFTs aren't showing on OpenSea!"

**If your NFTs aren't showing up on OpenSea** — wait a few minutes, sometimes OpenSea can take like 5-minutes. Here's my advice, if it's been 5 minutes and the metadata still looks like something below, **then use Rarible instead of OpenSea.**

![](https://i.imgur.com/1KsJ1vH.png)

Rarible is another NFT marketplace like OpenSea. Here's how to set it up:

1. Head to `rinkeby.rarible.com`.
2. Create this url: `https://rinkeby.rarible.com/token/INSERT_DEPLOY_CONTRACT_ADDRESS_HERE:INSERT_TOKEN_ID_HERE`

For example, here's my link:

```plaintext
https://rinkeby.rarible.com/token/0xcec8593c046364f163926a4327dfce6f546d9f98:4
```

This is for the Pikachu NFT!! My `tokenId` is `4` because it was the 4th mint from that contract. Feel free to try replacing it w/ other #s :).

**Basically, if you don't see your NFT on OpenSea within a few minutes, try Rarible to at least make sure stuff is working.** 

### 🤯 Why is this epic?

It’s worth talking about why what you just did is a big deal.

Basically, you made an NFT. So, that’s already cool. People can own a character from your game in their wallet, yay!

But, these NFTs actually have attributes as well! Like attack damage, health, mana, or whatever else you added. So, that means the NFT itself is more than just a JPG — it has other elements that make it more interactive.

The biggest NFT game in the world, Axie Infinity, functions just like this as well. It's a turn-based, Pokemon style game where you fight against other players 1v1.

Here's what one of their NFT characters looks like. 

![Untitled](https://i.imgur.com/FIJmmbL.png)

[Here](https://opensea.io/assets/0xf5b0a3efb8e8e4c201e2a935f110eaaf3ffecb8d/78852) it is on OpenSea. **Check out all the different attributes it has on properties, levels, etc.** Get inspired :). All these attributes they have actually affect how this character actually plays in the game itself!

What we’re going to do next is we’re going to actually program in logic to our NFT to “fight” a “boss” in our game. So, that means players will be able to take their NFT to the **arena** and collaborate with other players to “attack” a big boss you’ll create! When an NFT attacks this boss, the boss can attack the NFT back and the player's NFT will **lose health**. The HP value on OpenSea would change :).

Sorta like Pokemon!

That means our NFT will have *utility* outside of just being cool to look at.

This is pretty awesome. In normal games today, you’d buy a game and then pick your character (ex. like in Super Smash Brothers).

![Untitled](https://i.imgur.com/BTI8Qhp.png)

**In this case, players pick their character NFT, then can play their NFT in-game, and own that character in their wallet forever or until they want to sell it to another player.** The selling aspect is extremely interesting, because it means as the player you get something back for playing the game or helping it increase in popularity.

Another interesting thing is that players would be able to take their character NFT to other games that support it. 

*This is a pretty wild thing to think about. It’s one of the biggest reasons crypto + gaming is so cool.* 

Remember that Mario NFT example earlier, where others could build on top of Mario? Same deal here with our character NFTs!

For example, let’s say I have 100,000 people mint my “Pikachu” NFT for my game. Now, there are 100,000 unique players who own this NFT.

Another developer could come in and build another game on top of the Pikachu NFT and allow any player who has the NFT to enter their game and play it! They could make it where anyone w/ the Pikachu NFT would be able to play as Pikachu in their game. It’s totally up to them.

*Note: In this case, the Pokemon creators might get mad lol. But, imagine Pikachu was your own original character!* 

Maybe stuff like HP and attack damage is even shared between games, meaning different games could build on top of the original attributes we created.

For example, let’s say we have other devs start building “items” on top of our NFT characters — like swords, shields, potions, etc. Maybe a dev builds something where an NFT character could “equip” a shield in and gain +50 defense. This can all be done in an open, permission-less way :).

On top of that, as the creator of the original Pikachu NFTs — I can charge a royalty fee every time someone buys/sells the original NFTs and that means as my NFTs gain popularity I would make money on every sale.

Okay — lets get to actually programming our game logic now :).

### 🚨 Progress report!
*Pls do this or Farza will be sad :(*

Post a screenshot in #progress of your epic NFTs on OpenSea. Perhaps even tweet it out and tell the world what you've done! Be sure to give @_buildspace tag as well :). We love to see people's tweets, it always gives us a dose of dopamine/motivation. Plus -- your tweet could help get new people to get into web3. You never know who may see it and get inspired to start hacking!!!
