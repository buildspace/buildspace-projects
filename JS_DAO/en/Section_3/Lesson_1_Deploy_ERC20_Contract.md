Our members have an NFT now to cement themselves as members of our DAO. Awesome. Let’s take it a step further. Let’s actually create a supply of “governance token” to airdrop to our members.

You might remember the ENS DAO governance token airdrop [here](https://decrypt.co/85894/ethereum-name-service-market-cap-hits-1-billion-just-days-after-ens-airdrop). What does it all mean? Why does a “governance token” have a market cap of nearly a billion dollars [right now](https://coinmarketcap.com/currencies/ethereum-name-service/)?

Basically, a governance token allows users to vote on proposals. For example, a proposal may say something like “I want Naruto DAO to send 100,000 $HOKAGE to wallet address `0xf79a3bb8d5b93686c4068e2a97eaec5fe4843e7d` for being an extraordinary member”. Then, members would vote on it.

Users with more governance token are more powerful. Usually, token is awarded to members of the community who have brought the most value.

For example, for the ENS airdrop, the people who were awarded the most token was the core dev team and active users in their Discord. But, you would have also received ENS DAO token based on how long you had held your ENS domain (ex. `farza.eth`). BTW, if you didn’t know, an ENS Name is an NFT.

So, the longer you had this NFT, the more token you got.

Why? Because the ENS team wanted early supporters of the networks to be rewarded. This was their formula:

![Untitled](https://i.imgur.com/syh3F01.png)

I want to make it clear, this is a custom formula! Your DAO can also have a custom formula. Maybe you also want to reward people in your DAO more based on how long they’ve had their membership NFT. It’s all up to you.

### 🥵 Deploy your token

Let’s create and deploy our token smart contract! Head to `scripts/5-deploy-token.js` and add:

```jsx
import { AddressZero } from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";

(async () => {
  try {
    // Deploy a standard ERC-20 contract.
    const tokenAddress = await sdk.deployer.deployToken({
      // What's your token's name? Ex. "Ethereum"
      name: "NarutoDAO Governance Token",
      // What's your token's symbol? Ex. "ETH"
      symbol: "HOKAGE",
      // This will be in case we want to sell our token,
      // because we don't, we set it to AddressZero again.
      primary_sale_recipient: AddressZero,
    });
    console.log(
      "✅ Successfully deployed token contract, address:",
      tokenAddress,
    );
  } catch (error) {
    console.error("failed to deploy token contract", error);
  }
})();
```

We call `sdk.deployer.deployToken` which will deploy a standard [ERC-20](https://docs.openzeppelin.com/contracts/2.x/api/token/erc20) token contract for you which is the standard all the massive coins on Ethereum adopt. All you need to give it is your token’s `name` and `symbol`! Have fun with this one, don’t copy me of course. I hope you're building something **you** think is cool!

Here I give my token the symbol HOKAGE. If you don’t know what that is — check [this](https://naruto.fandom.com/wiki/Hokage) out lol. TLDR: If you’re a Hokage you’re one of the best ninja’s of all time.

BTW — you can see the exact contract thirdweb uses [here](https://github.com/thirdweb-dev/contracts/blob/main/contracts/token/TokenERC20.sol).

Here’s what I get when I run it:

```plaintext
buildspace-dao-starter % node scripts/5-deploy-token.js
👋 SDK initialized by address: 0xF11D6862e655b5F4e8f62E00471261D2f9c7E380
✅ Successfully deployed token contract, address: 0xF93B8AE0a84325D1d7Aa09593DCA3Ad5Fe868eA7
```

Boom! It deployed a fresh token contract. If you head to [`https://goerli.etherscan.io/`](https://goerli.etherscan.io/) and search the token module’s address, you’ll see the contract you just deployed. Again, you’ll see it deployed from **your wallet** so **you own it**.

![Untitled](https://i.imgur.com/4tHQ20A.png)

You can even add your token to Metamask as a custom token.

Just click “Import tokens”:

![Untitled](https://i.imgur.com/Bf56dyv.png)

Then, paste in your ERC-20 contract address and you’ll see Metamask magically grab your token symbol automatically:

![Untitled](https://i.imgur.com/bbg9nEz.png)

Then, head back to your wallet, scroll down, and boom!

![Untitled](https://i.imgur.com/yhUdkc3.png)

You officially have your own token :).

### 💸 Create your token’s supply

Right now, **there are zero tokens available for people claim.** Our ERC-20 contract doesn’t magically know how many tokens are available. We have to tell it!

Head to `6-print-money.js` and add:

```jsx
import sdk from "./1-initialize-sdk.js";

(async () => {
  try {
    // This is the address of our ERC-20 contract printed out in the step before.
    const token = await sdk.getContract("INSERT_TOKEN_ADDRESS", "token");
    // What's the max supply you want to set? 1,000,000 is a nice number!
    const amount = 1_000_000;
    // Interact with your deployed ERC-20 contract and mint the tokens!
    await token.mint(amount);
    const totalSupply = await token.totalSupply();

    // Print out how many of our token's are out there now!
    console.log("✅ There now is", totalSupply.displayValue, "$HOKAGE in circulation");
  } catch (error) {
    console.error("Failed to print money", error);
  }
})();
```
Remember that the address to insert here is your **Token Contract address**. If you enter the wrong address, you might get an error like this one: 'UNPREDICTABLE_GAS_LIMIT'.

Again, you can refer to your cool [thirdweb dashboard](https://thirdweb.com/dashboard?utm_source=buildspace) for this address if you lost it! You should now see that the token contract has popped up!

![image](https://i.imgur.com/W4PsTzD.png)


So, here we’re actually minting the token supply and setting the `amount` we want to mint and set as the max supply of token.

Here’s what I get when I run the script:

```plaintext
buildspace-dao-starter % node scripts/6-print-money.js
👋 Your app address is: 0xa002D595189bF9D50D5897C64b6e07BE5bdEe9b8
✅ There now is 1000000.0 $HOKAGE in circulation
```

Now for the epic part. Go back to your ERC-20 contract in Etherscan. You’ll now see you have your own token tracker!

![Untitled](https://i.imgur.com/tEJU2oA.png)

Go ahead and click the tracker and you’ll see all the supply info along with stuff like: who holds your token, who’s transferring around tokens, and how much token is being moved around. You’ll also see here we have a “Max Total Supply”.

Pretty cool. We did this all with a couple of lines of Javascript. That’s wild. You can literally go make the next meme coin at this point if you wanted to lol.

![Untitled](https://i.imgur.com/vmeoTfU.png)

### ✈️ Airdrop it

It’s airdrop time. Right now you’re probably the only member of your DAO and that’s okay!

Open up `7-airdrop-token.js` and add the following code:

```jsx
import sdk from "./1-initialize-sdk.js";

(async () => {
  try {
    // This is the address to our ERC-1155 membership NFT contract.
    const editionDrop = await sdk.getContract("INSERT_EDITION_DROP_ADDRESS", "edition-drop");
    // This is the address to our ERC-20 token contract.
    const token = await sdk.getContract("INSERT_TOKEN_ADDRESS", "token");
    // Grab all the addresses of people who own our membership NFT, which has 
    // a tokenId of 0.
    const walletAddresses = await editionDrop.history.getAllClaimerAddresses(0);

    if (walletAddresses.length === 0) {
      console.log(
        "No NFTs have been claimed yet, maybe get some friends to claim your free NFTs!",
      );
      process.exit(0);
    }

    // Loop through the array of addresses.
    const airdropTargets = walletAddresses.map((address) => {
      // Pick a random # between 1000 and 10000.
      const randomAmount = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);
      console.log("✅ Going to airdrop", randomAmount, "tokens to", address);

      // Set up the target.
      const airdropTarget = {
        toAddress: address,
        amount: randomAmount,
      };

      return airdropTarget;
    });

    // Call transferBatch on all our airdrop targets.
    console.log("🌈 Starting airdrop...");
    await token.transferBatch(airdropTargets);
    console.log("✅ Successfully airdropped tokens to all the holders of the NFT!");
  } catch (err) {
    console.error("Failed to airdrop tokens", err);
  }
})();
```

This is a lot. But you’re a thirdweb pro now ezpz.

First, you’ll see we need both `editionDrop` and `token` contracts because we will be interacting with both contracts.

We need to first grab holders of our NFT from the `editionDrop` and then mint them their token using functions on the `token`.

We use `getAllClaimerAddresses` to grab all `walletAddresses` of the people who have our membership NFT w/ tokenId `"0"`.

From there, we loop through all the `walletAddresses` and pick a `randomAmount` of token to airdrop to each user and store this data in an `airdropTarget` dictionary.

Finally, we run `transferBatch` on all my `airdropTargets`. And, that’s it! `transferBatch` will automatically loop through all the targets, and send the token!

When I run the script, here’s what I get:

```plaintext
buildspace-dao-starter % node scripts/7-airdrop-token.js
👋 SDK initialized by address: 0xF11D6862e655b5F4e8f62E00471261D2f9c7E380
✅ Going to airdrop 8761 tokens to 0xF11D6862e655b5F4e8f62E00471261D2f9c7E380
✅ Going to airdrop 9606 tokens to 0x14fb3a9B317612ddc6d6Cc3c907CD9F2Aa091eE7
✅ Going to airdrop 7376 tokens to 0xF79A3bb8d5b93686c4068E2A97eAeC5fE4843E7D
✅ Going to airdrop 9418 tokens to 0xc33817A8e3DD0687FB830666c2658eBBf4696245
✅ Going to airdrop 8311 tokens to 0xe50b229DC4D053b95fA586EBd1874423D9Be5145
✅ Going to airdrop 9603 tokens to 0x7FA42Aa5BF1CA8084f51F3Bab884c3aCB5180C86
🌈 Starting airdrop...
✅ Successfully airdropped tokens to all the holders of the NFT!
```

YOOOO. You just did an airdrop, hell yes!! In my case, you can see I have 6 unique members in my DAO and they all received the airdrop. In your case, it’ll likely be just you right now! Feel free to run this script again as more members join.

**In the real world**, an airdrop usually happens just one time. But, we’re just hacking around right now so it’s okay. Plus, there are no real rules to this world lol. If you wanna do 4 airdrops a day go for it!

You could create your own little airdrop formula just like ENS did for example:

![Untitled](https://i.imgur.com/IqboZsX.png)

You want to think — “The people who are receiving token will have more power over the DAO. Is this good? Are the biggest token holders going to do the right thing for the DAO?”.  This gets into the very broad topic of tokenomics which you can read about [here](https://www.google.com/search?q=tokenomics).

Okay, so now if I head back to my ERC-20 contract on Etherscan, I can see all my new token holders and how much of`$HOKAGE` they own.

LETS GOOO.

![Untitled](https://i.imgur.com/VrM2inr.png)

### 🚨 Progress Report

*Please do this or Farza will be sad :(.*

Go ahead and share a screenshot in `#progress` of your token contract on Etherscan where it shows off your token’s name, supply, etc!

**BTW, if you made it this far and are having a good time -- maybe tweet out that you're building your own DAO and tag [@_buildspace](https://twitter.com/_buildspace) :)?** 
