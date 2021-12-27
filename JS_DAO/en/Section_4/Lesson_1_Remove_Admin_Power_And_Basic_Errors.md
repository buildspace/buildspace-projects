### 😡 Revoke roles.

If you remember, you actually still hold “minting” rights on the ERC-20 contract. That means you can go and create more tokens if you wanted which may freak out members of your DAO lol. You could go and mint like a billion tokens to yourself lol.

It’s best if you revoke your “minting” role completely.

That way, only the voting contract is able to mint new tokens. We can do this by adding the following to `scripts/11-revoke-roles.js`:

```jsx
import sdk from "./1-initialize-sdk.js";

const tokenModule = sdk.getTokenModule(
  "INSERT_TOKEN_MODULE_ADDRESS",
);

(async () => {
  try {
    // Log the current roles.
    console.log(
      "👀 Roles that exist right now:",
      await tokenModule.getAllRoleMembers()
    );

    // Revoke all the superpowers your wallet had over the ERC-20 contract.
    await tokenModule.revokeAllRolesFromAddress(process.env.WALLET_ADDRESS);
    console.log(
      "🎉 Roles after revoking ourselves",
      await tokenModule.getAllRoleMembers()
    );
    console.log("✅ Successfully revoked our superpowers from the ERC-20 contract");

  } catch (error) {
    console.error("Failed to revoke ourselves from the DAO treasury", error);
  }
})();
```

When I run this using `node scripts/11-revoke-roles.js` I get:

```plaintext
buildspace-dao-starter % node scripts/11-revoke-roles.js
👀 Roles that exist right now: {
  admin: [ '0xF79A3bb8d5b93686c4068E2A97eAeC5fE4843E7D' ],
  minter: [
    '0xF79A3bb8d5b93686c4068E2A97eAeC5fE4843E7D',
    '0xFE667920172882D0695E199b361E94325F0641B6'
  ],
  pauser: [ '0xF79A3bb8d5b93686c4068E2A97eAeC5fE4843E7D' ],
  transfer: [ '0xF79A3bb8d5b93686c4068E2A97eAeC5fE4843E7D' ]
}
🎉 Roles after revoking ourselves {
  admin: [],
  minter: [ '0xFE667920172882D0695E199b361E94325F0641B6' ],
  pauser: [],
  transfer: []
}
✅ Successfully revoked our superpowers from the ERC-20 contract
```

At the beginning you can see my address `0xF79A3bb8` had a bunch of privileges over the ERC-20. So, after we run `tokenModule.revokeAllRolesFromAddress` you’ll see the only person who has the minter role is my voting contract!

We are now safe from an admin takeover :).

### 👍 Handle basic unsupported network error.

First, you'll need to import the type `UnsupportedChainIdError` at the top of `App.jsx` to recognize a connection outside of the Rinkeby network. Just add the line below to your other imports.

```jsx
import { UnsupportedChainIdError } from "@web3-react/core";
```

Next, add the following in your `App.jsx` file right under your last `useEffect`.

```jsx
if (error instanceof UnsupportedChainIdError ) {
  return (
    <div className="unsupported-network">
      <h2>Please connect to Rinkeby</h2>
      <p>
        This dapp only works on the Rinkeby network, please switch networks
        in your connected wallet.
      </p>
    </div>
  );
}
```

Pretty simple! But, very useful. It’ll pop a message if the user isn’t on Rinkeby!

### 🤑 See your token on Uniswap.

You may ask yourself how tokens like [ENS DAO](https://coinmarketcap.com/currencies/ethereum-name-service/) or the more recent [Constitution DAO](https://coinmarketcap.com/currencies/constitutiondao/) have governance token worth real money. Well basically, it’s because other people can actually just buy their governance tokens directly on decentralized exchanges like Uniswap.

For example — maybe a random person walks up to us and says, “Hey, I’ll give you $100 for 100 $HOKAGE because I want to join NarutoDAO and have some governance power”. Well, that means $HOKAGE has real value now. It means 1 $HOKAGE = 1 US Dollar. And, since there are 1,000,000 $HOKAGE, that means that my token’s fully diluted market cap would be $1,000,000.

Pretty wild, right :)?

People usually do swaps like these on Uniswap.

Believe it or not, your token will now show up on Uniswap under Rinkeby.

Here’s a quick video for you to actually do it yourself:

[Loom](https://www.loom.com/share/8c235f0c5d974c978e5dbd564bbca59d)

You can read more about liquidity pools [here](https://docs.uniswap.org/protocol/V2/concepts/core-concepts/pools). You’ll notice in the video there wasn’t one for $HOKAGE. But, technically anyone could come in and create a pool that lets people swap $ETH for $HOKAGE. That pool could have $100. Or, it could have a $1,000,000,000. Depends on how popular my token is!

### 🎨 Customize your web app a little!

Take some time to customize your web app a little. Change up some colors. Change up the copy. Add some cool emojis. Head to `public/index.html` and change up stuff like the title and description!

Random idea: when people are voting, play your country’s national anthem or something lolol.

Take some time here before moving on to really make these pages your own. Even if all you do is change the background colors that’s good lol. Have fun with it.

### 🚨 Progress Report

*Please do this or Farza will be sad :(.*

Go ahead and post a screenshot in `#progress` of your DAO’s Dashboard after a little customization!
