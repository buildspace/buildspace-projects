### 👾 Setup NFT Data

Okay, now we're going to actually deploy metadata associated with our membership NFT. We haven't done that yet. All we did so far was create the ERC-1155 contract and add some basic metadata. We haven't actually set up our membership NFTs, let's do that!

Head over to `scripts/3-config-nft.js` and add in:

```jsx
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

(async () => {
  try {
    const editionDrop = await sdk.getContract("INSERT_EDITION_DROP_ADDRESS", "edition-drop");
    await editionDrop.createBatch([
      {
        name: "Leaf Village Headband",
        description: "This NFT will give you access to NarutoDAO!",
        image: readFileSync("scripts/assets/headband.png"),
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failed to create the new NFT", error);
  }
})();
```

Pretty straightforward!

The first thing we're doing is accessing our `editionDrop` contract, which is an ERC-1155. The `INSERT_EDITION_DROP_ADDRESS` is the address printed out from the step before. It's the address printed out after `Successfully deployed editionDrop contract, address`.
You can also find this on your [thirdweb dashboard](https://thirdweb.com/dashboard?utm_source=buildspace). Your thirdweb dashboard will display the contracts you are currently working on and it will show the addresses there as well for you to easily copy and paste.

![image](https://i.imgur.com/nzvJpQb.png)


Then, we're setting up our actual NFT on our ERC-1155 using `createBatch`. We need to set up some properties:

- **name**: The name of our NFT.
- **description**: The description of our NFT
- **image**: The image for our NFT. This is the image of the NFT that users will claim to be able to access your DAO.

*Remember, because it's an ERC-1155, all our members will mint the same NFT.*

Be sure to replace `image: readFileSync("scripts/assets/headband.png")` with your own image. Same as before, be sure it's a local image as this won't work if you use an internet link.

I'm building NarutoDAO, so, my members will need a Leaf Village Headband to join hehe:

![headband.png](https://i.imgur.com/1F5I12o.png)

Get creative with yours, don't copy me!

When you're ready, run:

```plaintext
node scripts/3-config-nft.js
```

Here's what I get:

```plaintext
👋 SDK initialized by address: 0xF11D6862e655b5F4e8f62E00471261D2f9c7E380
✅ Successfully created a new NFT in the drop!
```

### 😼 Setup claim condition

Now we need to actually set up our "claim conditions". What's the max # of NFTs that can be minted? When can users start minting NFTs? Again, this is usually custom logic you'd need to write into your contract but in this case thirdweb makes it easy. 

Head over to `scripts/4-set-claim-condition.js` and add:

```jsx
import sdk from "./1-initialize-sdk.js";
import { MaxUint256 } from "@ethersproject/constants";

(async () => {
  try {
    const editionDrop = await sdk.getContract("INSERT_EDITION_DROP_ADDRESS", "edition-drop");
    // We define our claim conditions, this is an array of objects because
    // we can have multiple phases starting at different times if we want to
    const claimConditions = [{
      // When people are gonna be able to start claiming the NFTs (now)
      startTime: new Date(),
      // The maximum number of NFTs that can be claimed.
      maxClaimable: 50_000,
      // The price of our NFT (free)
      price: 0,
      // The amount of NFTs people can claim in one transaction.
      maxClaimablePerWallet: 1,
      // We set the wait between transactions to unlimited, which means
      // people are only allowed to claim once.
      waitInSeconds: MaxUint256,
    }]

    await editionDrop.claimConditions.set("0", claimConditions);
    console.log("✅ Sucessfully set claim condition!");
  } catch (error) {
    console.error("Failed to set claim condition", error);
  }
})();
```

Same thing here as before, be sure to replace `INSERT_EDITION_DROP_ADDRESS` with your ERC-1155 contract's address.

`startTime` is the time when users are allowed to start minting NFTs and in this case we just set that date/time to the current time meaning minting can start immediately.

`maxClaimable` is the max # of membership NFTs that can be minted. `maxClaimablePerWallet` specifies how many tokens someone can claim in a single transaction, we set this to one because we only want users minting one NFT at a time! In some cases, you may want to mint multiple NFTs to your user at once (ex. when they open a loot box of multiple NFTs) but in this case we just wanna do one. `price` sets the price of our NFT, in our case, 0 for free. `waitInSeconds` is the amount of time between transactions, because we only want people claiming once, we set it to the maximum number that the blockchain allows.

Finally, we do `editionDrop.claimConditions.set("0", claimConditions)` and this will actually **interact with our deployed contract on-chain** and adjust the conditions, pretty cool! Why do we pass in a `0`? Well, basically our membership NFT has a `tokenId` of `0` since it's the first token in our ERC-1155 contract. Remember — w/ ERC-1155 we can have multiple people mint the same NFT. In this case, everyone mints an NFT w/ id `0`. But, we could have a different NFT as well w/ id `1` perhaps and maybe we give the NFT to members of our DAO that are outstanding! It's all up to us.

After running `node scripts/4-set-claim-condition.js` here's what I get:

```
👋 SDK initialized by address: 0xF11D6862e655b5F4e8f62E00471261D2f9c7E380
✅ Successfully set claim condition!
```

Boom! We've successfully interacted w/ our deployed smart contract and have given our NFT certain rules it must follow, hell yea! If you copy-paste your bundle drop address printed out there and search it on `https://goerli.etherscan.io/`, you'll see proof right there that we interacted w/ the contract!

![Untitled](https://i.imgur.com/6sRMQpA.png)

### 🚨 Progress Report

*Please do this or Farza will be sad :(.*

Hey! Go ahead and share the membership NFT you chose in `#progress` and tell us why you chose this epic NFT for your DAO. 
