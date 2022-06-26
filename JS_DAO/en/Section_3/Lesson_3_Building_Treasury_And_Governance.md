A governance token is cool and all, but it’s kinda useless if people can’t use it to govern anything! What we’re going to do next here is set up a governance contract that lets people vote on proposals using their tokens

### 📝 Deploy a governance contract

I don’t want to complicate this too much.

At the end of the day, the voting contract is literally a way to let people vote on stuff, automatically count up those votes, and then any member would be able to execute the proposal on-chain. All without any central party.

For example, maybe you want to create a proposal like, *“Transfer 1000 token to EpicDesign5222 for redesigning our landing page”.* Who’s allowed to vote? How long do people have to vote? What’s the minimum # of token someone needs to create a proposal?

All these questions are answered in the initial voting contract we create

It’s almost like you're setting up a little country and you need to set up your initial government + voting system!

Head over to `8-deploy-vote.js` and add the following:

```jsx
import sdk from "./1-initialize-sdk.js";

(async () => {
  try {
    const voteContractAddress = await sdk.deployer.deployVote({
      // Give your governance contract a name.
      name: "My amazing DAO",

      // This is the location of our governance token, our ERC-20 contract!
      voting_token_address: "INSERT_TOKEN_ADDRESS",

      // These parameters are specified in number of blocks. 
      // Assuming block time of around 13.14 seconds (for Ethereum)

      // After a proposal is created, when can members start voting?
      // For now, we set this to immediately.
      voting_delay_in_blocks: 0,

      // How long do members have to vote on a proposal when it's created?
      // we will set it to 1 day = 6570 blocks
      voting_period_in_blocks: 6570,

      // The minimum % of the total supply that need to vote for
      // the proposal to be valid after the time for the proposal has ended.
      voting_quorum_fraction: 0,

      // What's the minimum # of tokens a user needs to be allowed to create a proposal?
      // I set it to 0. Meaning no tokens are required for a user to be allowed to
      // create a proposal.
      proposal_token_threshold: 0,
    });

    console.log(
      "✅ Successfully deployed vote contract, address:",
      voteContractAddress,
    );
  } catch (err) {
    console.error("Failed to deploy vote contract", err);
  }
})();
```

We’re using `deployer.deployVote` to actually set up the contract. This will deploy a brand new voting contract!

Notice how we give it `voting_token_address`. This is our contract that knows which governance token to accept. We don’t want people randomly trying to use $DOGE to vote lol.

We have `voting_delay_in_blocks`, which can be useful if you want to give people some time to go over the proposal before they’re allowed to vote on it. Similarly, we have `voting_period_in_blocks` which just specifies how long someone has to vote once a proposal goes lives, we do this in blocks, which depending on the blockchain you're on, might take longer, for Ethereum/Rinkeby, there's one block every 13 seconds or so, so on average, there's 6570 blocks in a day.

`voting_quorum_fraction` is really interesting. Let’s say a member creates a proposal and the other **199** DAO members are on vacation at Disney World and aren’t online. Well, in this case, if that one DAO member creates the proposal and votes “YES” on their own proposal — that means 100% of the votes said “YES” (since there was only one vote) and the proposal **would pass once** `voting_period_in_blocks` is up! To avoid this, we use a quorum which says “In order for a proposal to pass, a minimum x % of token must be used in the vote”.

For the sake of example, let’s just do `voting_quorum_fraction: 0` which means the proposal will pass regardless of what % of token was used on the vote. This means one person could technically pass a proposal themselves if the other members are on vacation lol. For now, this is fine. The quorum you set in the real world depends on your supply and how much you initially airdropped.

Finally, we have `proposal_token_threshold: "0"` which allows anyone to actually create a proposal even if they hold zero governance token. Up to you what you want to set this at! Let’s keep it at zero for now.

Go ahead and run this using `node scripts/8-deploy-vote.js`. Here’s what I end up getting:

```plaintext
buildspace-dao-starter % node scripts/8-deploy-vote.js
👋 SDK initialized by address: 0xF11D6862e655b5F4e8f62E00471261D2f9c7E380
✅ Successfully deployed vote contract, address: 0xE079991f3c26b832C3E8171F512694899E831eDB
```

This is pretty cool. Basically, we created and deployed a new smart contract that will let us actually vote on proposals on-chain. This is a standard [governance](https://docs.openzeppelin.com/contracts/4.x/api/governance) contract. You can see the exact contract you deployed [here](https://github.com/thirdweb-dev/contracts/blob/main/contracts/vote/VoteERC20.sol).

If you head to `https://rinkeby.etherscan.io/` you’ll see it there!

So, now we have three contracts: our NFT contract, our token contract, and our voting contract! Be sure to save your voting contract address, we’ll be using it again in just a moment.

### 🏦 Setup your treasury

So now we have our governance contract and we can vote on stuff. Awesome. But there’s an issue.

**The voting contract itself doesn’t have the ability to move our tokens around.** For example, let’s say we wanted to create a proposal right now like “Send 1000 $HOKAGE to NarutoLover67 for being an awesome member”. This actually wouldn’t work. *The voting contract has access to zero tokens right now.*

Why? **Because** **you created the token supply. Your wallet owns access to the entire supply. So only you have the power to access the supply, move tokens around, airdrop them, etc.** Basically, this is a dictatorship haha. Here’s what we’re going to do — we’re going to transfer 90% of all our token to the voting contract. Once our token is moved to our voting contract, the voting contract itself will have access to the supply.

**This will essentially become our “community treasury”.**

Here I just chose 90% as a random #. In practice, it depends. For example, here’s how ENS distributed it:

![](https://i.imgur.com/9rhwrzV.png)

They decided to allocate 50% of the supply to their community treasury! The tokenomics of every DAO are so different and there isn’t a “standard” way to do things right now. I like how ENS did it a lot. 50% in the community, 25% airdropped, and the other 25% given to the core team + contributors.

Head to `9-setup-vote.js` and add the following:

```jsx
import sdk from "./1-initialize-sdk.js";

// This is our governance contract.
const vote = sdk.getVote("INSERT_VOTE_ADDRESS");

// This is our ERC-20 contract.
const token = sdk.getToken("INSERT_TOKEN_ADDRESS");

(async () => {
  try {
    // Give our treasury the power to mint additional token if needed.
    await token.roles.grant("minter", vote.getAddress());

    console.log(
      "Successfully gave vote contract permissions to act on token contract"
    );
  } catch (error) {
    console.error(
      "failed to grant vote contract permissions on token contract",
      error
    );
    process.exit(1);
  }

  try {
    // Grab our wallet's token balance, remember -- we hold basically the entire supply right now!
    const ownedTokenBalance = await token.balanceOf(
      process.env.WALLET_ADDRESS
    );

    // Grab 90% of the supply that we hold.
    const ownedAmount = ownedTokenBalance.displayValue;
    const percent90 = Number(ownedAmount) / 100 * 90;

    // Transfer 90% of the supply to our voting contract.
    await token.transfer(
      vote.getAddress(),
      percent90
    ); 

    console.log("✅ Successfully transferred " + percent90 + " tokens to vote contract");
  } catch (err) {
    console.error("failed to transfer tokens to vote contract", err);
  }
})();
```

A pretty simple script here! We do two things:

1. We grab the total # of tokens we have in our wallet using `token.balanceOf`. Remember, right now our wallet has basically the entire supply apart from the token we airdropped.
2. We take the total supply we own, get 90% of it, and transfer that 90% to the voting module using `token.transfer`. You can transfer 100% if you want to! But, maybe you wanna keep some token for yourself as the creator!

Once you finish up, we can run this using `node scripts/9-setup-vote.js`. Here’s what I get as my output:

```plaintext
buildspace-dao-starter % node scripts/9-setup-vote.js
👋 SDK initialized by address: 0xF11D6862e655b5F4e8f62E00471261D2f9c7E380
✅ Successfully gave vote module permissions to act on token module
✅ Successfully transferred 900000 tokens to vote contract

```

Okay, ready to see something epic? Head to your voting contract on `https://rinkeby.etherscan.io/`. Click the dropdown next to the word “Token”. Here, you’ll see my contract has “844,527 $HOKAGE” on it.

This kinda blew my mind when I first saw it. *We literally have our own treasury.*

*Note: you may have a different amount in your treasury based on how much was in your supply and how much you airdropped.*

![](https://i.imgur.com/4AA5nlb.png)

### 🚨 Progress Report

*Please do this or Farza will be sad :(.*

Go ahead and share a screenshot from Etherscan in `#progress` of your token supply on your voting contract. Let’s see your epic treasury!
