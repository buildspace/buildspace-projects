### 😡 Revoke roles

If you remember, you actually still hold “minting” rights on the ERC-20 contract. That means you can go and create more tokens if you wanted which may freak out members of your DAO lol. You could go and mint like a billion tokens to yourself lol.

It’s best if you revoke your “minting” role completely.

That way, only the voting contract is able to mint new tokens. We can do this by adding the following to `scripts/11-revoke-roles.js`:

```jsx
import sdk from "./1-initialize-sdk.js";

(async () => {
  try {
    const token = await sdk.getContract("INSERT_TOKEN_ADDRESS", "token");
    // Log the current roles.
    const allRoles = await token.roles.getAll();

    console.log("👀 Roles that exist right now:", allRoles);

    // Revoke all the superpowers your wallet had over the ERC-20 contract.
    await token.roles.setAll({ admin: [], minter: [] });
    console.log(
      "🎉 Roles after revoking ourselves",
      await token.roles.getAll()
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
  admin: [ '0xF11D6862e655b5F4e8f62E00471261D2f9c7E380' ],
  minter: [ '0xF11D6862e655b5F4e8f62E00471261D2f9c7E380' ],
  transfer: [
    '0xF11D6862e655b5F4e8f62E00471261D2f9c7E380',
    '0x0000000000000000000000000000000000000000'
  ]
}
🎉 Roles after revoking ourselves {
  admin: [],
  minter: [],
  transfer: [
    '0xF11D6862e655b5F4e8f62E00471261D2f9c7E380',
    '0x0000000000000000000000000000000000000000'
  ]
}
✅ Successfully revoked our superpowers from the ERC-20 contract
```

At the beginning you can see my address `0xF79A3bb8` had a bunch of privileges over the ERC-20. So, after we run `token.roles.setAll({ admin: [], minter: [] })` you’ll see the only person who has the minter role is my voting contract!

We are now safe from an admin takeover :).

You'll see I still have the `transfer` role in conjunction with `AddressZero`, `AddressZero` in the roles array means that everybody can transfer tokens (which is what we want). It doesn't matter that our address is also there.

### 👍 Handle basic unsupported network error

First, let's import one last hook `useNetwork` at the top of `App.jsx` to recognize a connection outside of the Goerli network. Also, we're importing `ChainId` from the thirdweb SDK to get Goerli's chain ID.

```jsx
import {
  useAddress,
  useNetwork,
  useContract,
  ConnectWallet,
  Web3Button,
  useNFTBalance,
} from '@thirdweb-dev/react';
import { ChainId } from '@thirdweb-dev/sdk';
```

Then, define our `useNetwork` hook under our `useAddress` hook:

```jsx
const network = useNetwork();
```

Next, add the following in your `App.jsx` file right under `const memberList =...` function:

```jsx
if (address && (network?.[0].data.chain.id !== ChainId.Goerli)) {
  return (
    <div className="unsupported-network">
      <h2>Please connect to Goerli</h2>
      <p>
        This dapp only works on the Goerli network, please switch networks
        in your connected wallet.
      </p>
    </div>
  );
}
```

We're checking if we're finding a chain on our preferred network, in our case Goerli, if we are not, we're prompting users to switch network.

Pretty simple! But, very useful. It’ll pop a message if the user isn’t on Goerli!

### 🤑 See your token on Uniswap

You may ask yourself how tokens like [ENS DAO](https://coinmarketcap.com/currencies/ethereum-name-service/) or the more recent [Constitution DAO](https://coinmarketcap.com/currencies/constitutiondao/) have governance token worth real money. Well basically, it’s because other people can actually just buy their governance tokens directly on decentralized exchanges like Uniswap.

For example — maybe a random person walks up to us and says, “Hey, I’ll give you $100 for 100 $HOKAGE because I want to join NarutoDAO and have some governance power”. Well, that means $HOKAGE has real value now. It means 1 $HOKAGE = 1 US Dollar. And, since there are 1,000,000 $HOKAGE, that means that my token’s fully diluted market cap would be $1,000,000.

Pretty wild, right :)?

People usually do swaps like these on Uniswap.

Believe it or not, your token will now show up on Uniswap under Goerli.

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
