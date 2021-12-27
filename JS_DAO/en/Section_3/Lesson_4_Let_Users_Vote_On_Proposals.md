### 📜 Create your DAO’s first two proposals.

Cool. Everything is set up, now, we just need to create our first proposal! Head to `10-create-vote-proposals.js` and add the following:

```jsx
import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// Our voting contract.
const voteModule = sdk.getVoteModule(
  "INSERT_VOTE_MODULE_ADDRESS",
);

// Our ERC-20 contract.
const tokenModule = sdk.getTokenModule(
  "INSERT_TOKEN_MODULE_ADDRESS",
);

(async () => {
  try {
    const amount = 420_000;
    // Create proposal to mint 420,000 new token to the treasury.
    await voteModule.propose(
      "Should the DAO mint an additional " + amount + " tokens into the treasury?",
      [
        {
          // Our nativeToken is ETH. nativeTokenValue is the amount of ETH we want
          // to send in this proposal. In this case, we're sending 0 ETH.
          // We're just minting new tokens to the treasury. So, set to 0.
          nativeTokenValue: 0,
          transactionData: tokenModule.contract.interface.encodeFunctionData(
            // We're doing a mint! And, we're minting to the voteModule, which is
            // acting as our treasury.
            "mint",
            [
              voteModule.address,
              ethers.utils.parseUnits(amount.toString(), 18),
            ]
          ),
          // Our token module that actually executes the mint.
          toAddress: tokenModule.address,
        },
      ]
    );

    console.log("✅ Successfully created proposal to mint tokens");
  } catch (error) {
    console.error("failed to create first proposal", error);
    process.exit(1);
  }

  try {
    const amount = 6_900;
    // Create proposal to transfer ourselves 6,900 tokens for being awesome.
    await voteModule.propose(
      "Should the DAO transfer " +
      amount + " tokens from the treasury to " +
      process.env.WALLET_ADDRESS + " for being awesome?",
      [
        {
          // Again, we're sending ourselves 0 ETH. Just sending our own token.
          nativeTokenValue: 0,
          transactionData: tokenModule.contract.interface.encodeFunctionData(
            // We're doing a transfer from the treasury to our wallet.
            "transfer",
            [
              process.env.WALLET_ADDRESS,
              ethers.utils.parseUnits(amount.toString(), 18),
            ]
          ),

          toAddress: tokenModule.address,
        },
      ]
    );

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

Maybe the treasury is running low and we want more tokens to award members. Remember, earlier we gave our voting contract the ability to mint new token — so this works! It’s a democratic treasury. If you members think this is proposal is stupid and vote “NO”, this simply won’t pass!

**2) We’re creating a proposal that transfer 6,900 token to our wallet from the treasury.** You can see we do a `"transfer"` in the code.

Maybe we did something good and want to be rewarded for it! In the real world, you’d usually create proposals to send other people token. For example, maybe someone helped code up a new website for the DAO and wants to be rewarded for it. We can transfer them token!

BTW, I want to make a note on `nativeTokenValue`. Lets say we wanted to have our proposal say, “We’d like to reward NarutoFangirl27 for helping us with marketing with 2500 governance token and 0.1 ETH”. This is really cool! It means you can reward people with both ETH and governance token — best of both worlds. *Note: That 0.1 ETH would need to be in our treasury if we wanted to send it!*

When I run `node scripts/10-create-vote-proposals.js` I get:

```plaintext
buildspace-dao-starter % node scripts/10-create-vote-proposals.js
👋 Your app address is: 0xa002D595189bF9D50D5897C64b6e07BE5bdEe9b8
✅ Successfully created proposal to mint tokens
✅ Successfully created proposal to reward ourselves from the treasury, let's hope people vote for it!

```

BOOM. There are our proposals. The last thing we’re going to do is actually let users vote on proposals from our DAO dashboard now!

### ✍️ Let users vote on proposals from the dashboard.

Finally, let’s bring it all home. Right now, our proposals live on our smart contract. But, we want our users to easily be able to see them and vote! Let’s do that. Head to `App.jsx`. Go ahead and add this under `tokenModule`.

```jsx
const voteModule = sdk.getVoteModule(
  "INSERT_YOUR_VOTE_MODULE_ADDRESS",
);
```

Our web app needs access to our `voteModule` so users can interact with that contract.

From here, lets add the following somewhere underneath your other state variables:

```jsx
const [proposals, setProposals] = useState([]);
const [isVoting, setIsVoting] = useState(false);
const [hasVoted, setHasVoted] = useState(false);

// Retrieve all our existing proposals from the contract.
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }
  // A simple call to voteModule.getAll() to grab the proposals.
  voteModule
    .getAll()
    .then((proposals) => {
      // Set state!
      setProposals(proposals);
      console.log("🌈 Proposals:", proposals)
    })
    .catch((err) => {
      console.error("failed to get proposals", err);
    });
}, [hasClaimedNFT]);

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

  // Check if the user has already voted on the first proposal.
  voteModule
    .hasVoted(proposals[0].proposalId, address)
    .then((hasVoted) => {
      setHasVoted(hasVoted);
      if (hasVoted) {
        console.log("🥵 User has already voted")
      }
    })
    .catch((err) => {
      console.error("failed to check if wallet has voted", err);
    });
}, [hasClaimedNFT, proposals, address]);
```

So, we’re doing two things here! 

In the first `useEffect` we’re doing `voteModule.getAll()` to grab all the proposals that exist on our governance contract and then doing `setProposals` so we can render them later.

In the second useEffect, we’re doing `voteModule.hasVoted(proposals[0].proposalId, address)` which check if this address has voted on the first proposal. If it has, then we do `setHasVoted` so the user can’t vote again! Even if we didn’t have this, our contract would reject the transaction if a user tried to double vote!

The magic of thirdweb is that it not only makes it really easy to deploy smart contracts, it also makes it crazy easy to interact with them from our client with simple functions like `voteModule.getAll()`!

Go ahead and refresh your page, you should see your proposals printed out next to the 🌈 and you can explore all the data!

![Untitled](https://i.imgur.com/tNhXvHY.png)

And if you already voted, you’ll see something like:

![Untitled](https://i.imgur.com/zOQ6Rim.png)

The next chunk of code is kinda massive lol. It deals with actually rendering the proposals that we just retrieved here so that users can have three options to vote:

1) For

2) Against

3) Abstain

If you’re familiar with React/JS, you can easily look through it and figure out how it works yourself. If you don’t know React/JS super well, don’t worry. Just copy-paste it. No shame there!

Go ahead and replace the contents of `if (hasClaimedNFT) { }` with the code [here](https://github.com/buildspace/buildspace-dao-final/blob/d94cadc73703c09561fda946a338237eee7f9bee/src/App.jsx#L194).

When you check out your web app, you’ll see something like:

![Untitled](https://i.imgur.com/Q5bzFWb.png)

Pretty awesome. You can now actually use those buttons to vote.

We setup our governance contract to stop voting after 24-hours. That means after 24-hours, if:
```plaintext
votes "for" proposal > votes "against" proposal
```

Then any member would be able to execute the proposal via our governance contract. Proposals can’t be executed automatically. But, once a proposal passes, **any member** of the DAO can trigger the accepted proposal.

For example. Let’s say we’re dealing with the proposal where we’re minting an additional 420,000 token. If `votes "for" proposal > votes "against" proposal`  — then anyone can trigger the proposal and bam our contract will mint the token. Kinda wild, right? We have to trust no one except the blockchain.

Imagine being in a corrupt country, voting for something, and then your government lies to you and says “Hey actually we didn’t get enough votes jk” when you really did lol. Or, imagine they say, “Okay, we got enough votes we’ll do this we promise” and never do!

In this case, everything is codified and code does not lie.

Anyways, now’s not the time to discuss how DAOs could potentially improve our governments ;). We gotta finish our meme DAO right here and right now! So close.

### 🚨 Progress Report

*Please do this or Farza will be sad :(.*

Go ahead and share a screenshot of your DAO dashboard showing off your member list + voting system in `#progress`!
