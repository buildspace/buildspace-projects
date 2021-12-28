A governance token is cool and all, but it’s kinda useless if people can’t use it to govern anything! What we’re going to do next here is set up a governance contract that lets people vote on proposals using their tokens

### 📝 Deploy a governance contract.

I don’t want to complicate this too much.

At the end of the day, the voting contract is literally a way to let people vote on stuff, automatically count up those votes, and then any member would be able to execute the proposal on-chain. All without any central party.

For example, maybe you want to create a proposal like, *“Transfer 1000 token to EpicDesign5222 for redesigning our landing page”.* Who’s allowed to vote? How long do people have to vote? What’s the minimum # of token someone needs to create a proposal?

All these questions are answered in the initial voting contract we create

It’s almost like your setting up a little country and you need to set up your initial government + voting system!

Head over to `8-deploy-vote.js` and add the following:

```jsx
import sdk from "./1-initialize-sdk.js";

// Grab the app module address.
const appModule = sdk.getAppModule(
  "INSERT_APP_MODULE_ADDRESS",
);

(async () => {
  try {
    const voteModule = await appModule.deployVoteModule({
      // Give your governance contract a name.
      name: "NarutoDAO's Epic Proposals",

      // This is the location of our governance token, our ERC-20 contract!
      votingTokenAddress: "INSERT_TOKEN_MODULE_ADDRESS",

      // After a proposal is created, when can members start voting?
      // For now, we set this to immediately.
      proposalStartWaitTimeInSeconds: 0,

      // How long do members have to vote on a proposal when it's created?
      // Here, we set it to 24 hours (86400 seconds)
      proposalVotingTimeInSeconds: 24 * 60 * 60,

      // Will explain more below.
      votingQuorumFraction: 0,

      // What's the minimum # of tokens a user needs to be allowed to create a proposal?
      // I set it to 0. Meaning no tokens are required for a user to be allowed to
      // create a proposal.
      minimumNumberOfTokensNeededToPropose: "0",
    });

    console.log(
      "✅ Successfully deployed vote module, address:",
      voteModule.address,
    );
  } catch (err) {
    console.error("Failed to deploy vote module", err);
  }
})();

```

We’re using `deployVoteModule` to actually set up the contract. This will deploy a brand new voting contract!

Notice how we give it `votingTokenAddress`. This is our contract that knows which governance token to accept. We don’t want people randomly trying to use $DOGE to vote lol.

We have `proposalStartWaitTimeInSeconds`, which can be useful if you want to give people some time to go over the proposal before they’re allowed to vote on it. Similarly, we have `proposalVotingTimeInSeconds` which just specifies how long someone has to vote once a proposal goes lives.

`votingQuorumFraction` is really interesting. Let’s say a member creates a proposal and the other **199** DAO members are on vacation at Disney World and aren’t online. Well, in this case, if that one DAO member creates the proposal and votes “YES” on their own proposal — that means 100% of the votes said “YES” (since there was only one vote) and the proposal **would pass once** `proposalVotingTimeInSeconds` is up! To avoid this, we use a quorum which says “In order for a proposal to pass, a minimum x % of token must be used in the vote”.

For the sake of example, let’s just do `votingQuorumFraction: 0` which means the proposal will pass regardless of what % of token was used on the vote. This means one person could technically pass a proposal themselves if the other members are on vacation lol. For now, this is fine. The quorum you set in the real world depends on your supply and how much you initially airdropped.

Finally, we have `minimumNumberOfTokensNeededToPropose: "0"` which allows anyone to actually create a proposal even if they hold zero governance token. Up to you what you want to set this at! Let’s keep it at zero for now.

Go ahead and run this using `node scripts/8-deploy-vote.js`. Here’s what I end up getting:

```plaintext
buildspace-dao-starter % node scripts/8-deploy-vote.js
✅ Successfully deployed vote module, address: 0xFE667920172882D0695E199b361E94325F0641B6
👋 Your app address is: 0xa002D595189bF9D50D5897C64b6e07BE5bdEe9b8

```

This is pretty cool. Basically, we created and deployed a new smart contract that will let us actually vote on proposals on-chain. This is a standard [governance](https://docs.openzeppelin.com/contracts/4.x/api/governance) contract. You can see the exact contract you deployed [here](https://github.com/nftlabs/nftlabs-protocols/blob/main/contracts/vote/VotingGovernor.sol).

If you head to `https://rinkeby.etherscan.io/` you’ll see it there!

So, now we have three contracts: our NFT contract, our token contract, and our voting contract! Be sure to save your voting contract address, we’ll be using it again in just a moment.

### 🏦 Setup your treasury.

So now we have our governance contract and we can vote on stuff. Awesome. But there’s an issue.

**The voting contract itself doesn’t have the ability to move our tokens around.** For example, let’s say we wanted to create a proposal right now like “Send 1000 $HOKAGE to NarutoLover67 for being an awesome member”. This actually wouldn’t work. *The voting contract has access to zero tokens right now.*

Why? **Because** **you created the token supply. Your wallet owns access to the entire supply. So only you have the power to access the supply, move tokens around, airdrop them, etc.** Basically, this is a dictatorship haha. Here’s what we’re going to do — we’re going to transfer 90% of all our token to the voting contract. Once our token is moved to our voting contract, the voting contract itself will have access to the supply.

**This will essentially become our “community treasury”.**

Here I just chose 90% as a random #. In practice, it depends. For example, here’s how ENS distributed it:

![](https://i.imgur.com/9rhwrzV.png)

They decided to allocate 50% of the supply to their community treasury! The tokenomics of every DAO are so different and there isn’t a “standard” way to do things right now. I like how ENS did it a lot. 50% in the community, 25% airdropped, and the other 25% given to the core team + contributors.

Head to `9-setup-vote.js` and add the following:

```jsx
import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// This is our governance contract.
const voteModule = sdk.getVoteModule(
  "INSERT_VOTING_MODULE_ADDRESS",
);

// This is our ERC-20 contract.
const tokenModule = sdk.getTokenModule(
  "INSERT_TOKEN_MODULE_ADDRESS",
);

(async () => {
  try {
    // Give our treasury the power to mint additional token if needed.
    await tokenModule.grantRole("minter", voteModule.address);

    console.log(
      "Successfully gave vote module permissions to act on token module"
    );
  } catch (error) {
    console.error(
      "failed to grant vote module permissions on token module",
      error
    );
    process.exit(1);
  }

  try {
    // Grab our wallet's token balance, remember -- we hold basically the entire supply right now!
    const ownedTokenBalance = await tokenModule.balanceOf(
      process.env.WALLET_ADDRESS
    );

    // Grab 90% of the supply that we hold.
    const ownedAmount = ethers.BigNumber.from(ownedTokenBalance.value);
    const percent90 = ownedAmount.div(100).mul(90);

    // Transfer 90% of the supply to our voting contract.
    await tokenModule.transfer(
      voteModule.address,
      percent90
    );

    console.log("✅ Successfully transferred tokens to vote module");
  } catch (err) {
    console.error("failed to transfer tokens to vote module", err);
  }
})();

```

A pretty simple script here! We do two things:

1. We grab the total # of tokens we have in our wallet using `tokenModule.balanceOf`. Remember, right now our wallet has basically the entire supply apart from the token we airdropped.
2. We take the total supply we own, get 90% of it, and transfer that 90% to the voting module using `tokenModule.transfer`. You can transfer 100% if you want to! But, maybe you wanna keep some token for yourself as the creator!

Once you finish up, we can run this using `node scripts/9-setup-vote.js`. Here’s what I get as my output:

```plaintext
buildspace-dao-starter % node scripts/9-setup-vote.js
👋 Your app address is: 0xa002D595189bF9D50D5897C64b6e07BE5bdEe9b8
✅ Successfully gave vote module permissions to act on token module
✅ Successfully transferred tokens to vote module

```

Okay, ready to see something epic? Head to your voting contract on `https://rinkeby.etherscan.io/`. Click the dropdown next to the word “Token”. Here, you’ll see my contract has “844,527 $HOKAGE” on it.

This kinda blew my mind when I first saw it. *We literally have our own treasury.*

*Note: you may have a different amount in your treasury based on how much was in your supply and how much you airdropped.*

![](https://i.imgur.com/4AA5nlb.png)

### 🚨 Progress Report

*Please do this or Farza will be sad :(.*

Go ahead and share a screenshot from Etherscan in `#progress` of your token supply on your voting contract. Let’s see your epic treasury!
