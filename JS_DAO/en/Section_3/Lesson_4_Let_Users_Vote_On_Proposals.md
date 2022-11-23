### 📜 Create your DAO’s first two proposals

Cool. Everything is set up, now, we just need to create our first proposal! Head to `10-create-vote-proposals.js` and add the following:

```jsx
import sdk from "./1-initialize-sdk.js";
import { ethers } from "ethers";

(async () => {
  try {
    // This is our governance contract.
    const vote = await sdk.getContract("INSERT_VOTE_ADDRESS", "vote");
    // This is our ERC-20 contract.
    const token = await sdk.getContract("INSERT_TOKEN_ADDRESS", "token");
    // Create proposal to mint 420,000 new token to the treasury.
    const amount = 420_000;
    const description = "Should the DAO mint an additional " + amount + " tokens into the treasury?";
    const executions = [
      {
        // Our token contract that actually executes the mint.
        toAddress: token.getAddress(),
        // Our nativeToken is ETH. nativeTokenValue is the amount of ETH we want
        // to send in this proposal. In this case, we're sending 0 ETH.
        // We're just minting new tokens to the treasury. So, set to 0.
        nativeTokenValue: 0,
        // We're doing a mint! And, we're minting to the vote, which is
        // acting as our treasury.
        // in this case, we need to use ethers.js to convert the amount
        // to the correct format. This is because the amount it requires is in wei.
        transactionData: token.encoder.encode(
          "mintTo", [
          vote.getAddress(),
          ethers.utils.parseUnits(amount.toString(), 18),
        ]
        ),
      }
    ];

    await vote.propose(description, executions);

    console.log("✅ Successfully created proposal to mint tokens");
  } catch (error) {
    console.error("failed to create first proposal", error);
    process.exit(1);
  }

  try {
    // This is our governance contract.
    const vote = await sdk.getContract("INSERT_VOTE_ADDRESS", "vote");
    // This is our ERC-20 contract.
    const token = await sdk.getContract("INSERT_TOKEN_ADDRESS", "token");
    // Create proposal to transfer ourselves 6,900 tokens for being awesome.
    const amount = 6_900;
    const description = "Should the DAO transfer " + amount + " tokens from the treasury to " +
      process.env.WALLET_ADDRESS + " for being awesome?";
    const executions = [
      {
        // Again, we're sending ourselves 0 ETH. Just sending our own token.
        nativeTokenValue: 0,
        transactionData: token.encoder.encode(
          // We're doing a transfer from the treasury to our wallet.
          "transfer",
          [
            process.env.WALLET_ADDRESS,
            ethers.utils.parseUnits(amount.toString(), 18),
          ]
        ),
        toAddress: token.getAddress(),
      },
    ];

    await vote.propose(description, executions);

    console.log(
      "✅ Successfully created proposal to reward ourselves from the treasury, let's hope people vote for it!"
    );
  } catch (error) {
    console.error("failed to create second proposal", error);
  }
})();
```

It looks like a lot. Go ahead and read through it step by step! We’re actually creating two new proposals for members to vote on:

**1) We’re creating a proposal that allows the treasury to mint 420,000 new token.** You can see we do a `"mint"` in the code.

Maybe the treasury is running low and we want more tokens to award members. Remember, earlier we gave our voting contract the ability to mint new token — so this works! It’s a democratic treasury. If your members think this proposal is stupid and vote “NO”, this simply won’t pass!

**2) We’re creating a proposal that transfer 6,900 token to our wallet from the treasury.** You can see we do a `"transfer"` in the code.

Maybe we did something good and want to be rewarded for it! In the real world, you’d usually create proposals to send other people tokens. For example, maybe someone helped code up a new website for the DAO and wants to be rewarded for it. We can transfer them tokens!

BTW, I want to make a note on `nativeTokenValue`. Lets say we wanted to have our proposal say, “We’d like to reward NarutoFangirl27 for helping us with marketing with 2500 governance token and 0.1 ETH”. This is really cool! It means you can reward people with both ETH and governance tokens — best of both worlds. *Note: That 0.1 ETH would need to be in our treasury if we wanted to send it!*

When I run `node scripts/10-create-vote-proposals.js` I get:

```plaintext
buildspace-dao-starter % node scripts/10-create-vote-proposals.js
👋 SDK initialized by address: 0xF11D6862e655b5F4e8f62E00471261D2f9c7E380
✅ Successfully created proposal to mint tokens
✅ Successfully created proposal to reward ourselves from the treasury, let's hope people vote for it!

```

BOOM. There are our proposals. The last thing we’re going to do is actually let users vote on proposals from our DAO dashboard now!

Note : If you've set the `proposal_token_threshold` > 0 - the code might throw an error. You may have to delegate your tokens to the 
voting contract (on the relevant network) for it to work before deploying the proposals.

### ✍️ Let users vote on proposals from the dashboard

Finally, let’s bring it all home. Right now, our proposals live on our smart contract. But, we want our users to easily be able to see them and vote! Let’s do that. Head to `App.jsx`. 

Go ahead and add this under `token`.

```jsx
const { contract: vote } = useContract("INSERT_VOTE_ADDRESS", "vote");
```

Our web app needs access to our `vote` so users can interact with that contract.

From here, lets add the following somewhere underneath your the `shortenAddress` function:

```jsx
const [proposals, setProposals] = useState([]);
const [isVoting, setIsVoting] = useState(false);
const [hasVoted, setHasVoted] = useState(false);

// Retrieve all our existing proposals from the contract.
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }

  // A simple call to vote.getAll() to grab the proposals.
  const getAllProposals = async () => {
    try {
      const proposals = await vote.getAll();
      setProposals(proposals);
      console.log("🌈 Proposals:", proposals);
    } catch (error) {
      console.log("failed to get proposals", error);
    }
  };
  getAllProposals();
}, [hasClaimedNFT, vote]);

// We also need to check if the user already voted.
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }

  // If we haven't finished retrieving the proposals from the useEffect above
  // then we can't check if the user voted yet!
  if (!proposals.length) {
    return;
  }

  const checkIfUserHasVoted = async () => {
    try {
      const hasVoted = await vote.hasVoted(proposals[0].proposalId, address);
      setHasVoted(hasVoted);
      if (hasVoted) {
        console.log("🥵 User has already voted");
      } else {
        console.log("🙂 User has not voted yet");
      }
    } catch (error) {
      console.error("Failed to check if wallet has voted", error);
    }
  };
  checkIfUserHasVoted();

}, [hasClaimedNFT, proposals, address, vote]);
```

So, we’re doing two things here! 

In the first `useEffect` we’re doing `vote.getAll()` to grab all the proposals that exist on our governance contract and then doing `setProposals` so we can render them later.

In the second useEffect, we’re doing `vote.hasVoted(proposals[0].proposalId, address)` which checks if this address has voted on the first proposal. If it has, then we do `setHasVoted` so the user can’t vote again! Even if we didn’t have this, our contract would reject the transaction if a user tried to double vote!

The magic of thirdweb is that it not only makes it really easy to deploy smart contracts, it also makes it crazy easy to interact with them from our client with simple functions like `vote.getAll()`!

Go ahead and refresh your page, you should see your proposals printed out next to the 🌈 and you can explore all the data!

![Untitled](https://i.imgur.com/tNhXvHY.png)

And if you already voted, you’ll see something like:

![Untitled](https://i.imgur.com/zOQ6Rim.png)

The next chunk of code is kinda massive lol. It deals with actually rendering the proposals that we just retrieved here so that users can have three options to vote:

1) For

2) Against

3) Abstain

If you’re familiar with React/JS, you can easily look through it and figure out how it works yourself. If you don’t know React/JS super well, don’t worry. Just copy-paste it. No shame there!

Add the zero address import after your exising imports:
```jsx
import { AddressZero } from "@ethersproject/constants";
```

Go ahead and replace the contents of `if (hasClaimedNFT) { }` with the code [here](https://github.com/buildspace/buildspace-dao-final/blob/main/src/App.jsx#L184).

When you check out your web app, you’ll see something like:

![Untitled](https://i.imgur.com/Q5bzFWb.png)

Pretty awesome. You can now actually use those buttons to vote.

We setup our governance contract to stop voting after 24-hours. That means after 24-hours, if:
```plaintext
votes "for" proposal > votes "against" proposal
```

Then any member would be able to execute the proposal via our governance contract. Proposals can’t be executed automatically. But, once a proposal passes, **any member** of the DAO can trigger the accepted proposal.

For example. Let’s say we’re dealing with the proposal where we’re minting an additional 420,000 tokens. If `votes "for" proposal > votes "against" proposal`  — then anyone can trigger the proposal and bam our contract will mint the tokens. Kinda wild, right? We have to trust no one except the blockchain.

Imagine being in a corrupt country, voting for something, and then your government lies to you and says “Hey actually we didn’t get enough votes jk” when you really did lol. Or, imagine they say, “Okay, we got enough votes we’ll do this we promise” and never do!

In this case, everything is codified and code does not lie.

Anyways, now’s not the time to discuss how DAOs could potentially improve our governments ;). We gotta finish our meme DAO right here and right now! So close.

### 🚨 Progress Report

*Please do this or Farza will be sad :(.*

Go ahead and share a screenshot of your DAO dashboard showing off your member list + voting system in `#progress`!
