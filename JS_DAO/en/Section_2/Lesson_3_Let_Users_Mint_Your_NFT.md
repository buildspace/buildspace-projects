Let's head over to `App.jsx`. What we'll be doing now is

1) if we detect that our user has a membership NFT, show them our "DAO Dashboard" screen where they can vote on proposals and see DAO related info.

2) if we detect that the user doesn't have our NFT, we'll give them a button to mint one.

Let's do it! We'll attack case #1 first, we need to detect if the user has our NFT.

### 🤔 Check if user owns a membership NFT

Head over to `App.jsx`. Update our imports to:

```jsx
import { useAddress, ConnectWallet, useContract, useNFTBalance } from '@thirdweb-dev/react';
import { useState, useEffect, useMemo } from 'react';
```

From there, below our `console.log("👋 Address:", address);` we're going to add:

```jsx
  // Initialize our Edition Drop contract
  const editionDropAddress = "INSERT_EDITION_DROP_ADDRESS"
  const { contract: editionDrop } = useContract(editionDropAddress, "edition-drop");
  // Hook to check if the user has our NFT
  const { data: nftBalance } = useNFTBalance(editionDrop, address, "0")

  const hasClaimedNFT = useMemo(() => {
    return nftBalance && nftBalance.gt(0)
  }, [nftBalance])

  // ... include all your other code that was already there below.
```

We first initialize our `editionDrop` contract.

From there, we use `useNFTBalance` to check how many NFTs the connected wallet holds. This will actually query our deployed smart contract for the data. Why do we do `"0"`? Well, basically because if you remember `"0"` is the `tokenId` of our membership NFT. So, here we're asking our contract, "Hey, does this user own a token with id `"0"`?".

Now we know when a user doesn't have an NFT! Let's create a button to let the user mint one.

### ✨ Build a "Mint NFT" button

Let's do it! Head back to `App.jsx`. I added some comments on the lines I added:

```javascript
import { useAddress, ConnectWallet, Web3Button, useContract, useNFTBalance } from '@thirdweb-dev/react';
import { useState, useEffect, useMemo } from 'react';

const App = () => {
  // Use the hooks thirdweb give us.
  const address = useAddress();
  console.log("👋 Address:", address);
  // Initialize our Edition Drop contract
  const editionDropAddress = "INSERT_EDITION_DROP_ADDRESS";
  const { contract: editionDrop } = useContract(editionDropAddress, "edition-drop");
  // Hook to check if the user has our NFT
  const { data: nftBalance } = useNFTBalance(editionDrop, address, "0")

  const hasClaimedNFT = useMemo(() => {
    return nftBalance && nftBalance.gt(0)
  }, [nftBalance])

  // This is the case where the user hasn't connected their wallet
  // to your web app. Let them call connectWallet.
  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to NarutoDAO</h1>
        <div className="btn-hero">
          <ConnectWallet />
        </div>
      </div>
    );
  }

  // Render mint nft screen.
  return (
    <div className="mint-nft">
      <h1>Mint your free 🍪DAO Membership NFT</h1>
      <div className="btn-hero">
        <Web3Button 
          contractAddress={editionDropAddress}
          action={contract => {
            contract.erc1155.claim(0, 1)
          }}
          onSuccess={() => {
            console.log(`🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
          }}
          onError={error => {
            console.error("Failed to mint NFT", error);
          }}
        >
          Mint your NFT (FREE)
        </Web3Button>
      </div>
    </div>
  );
}

export default App;
```

We're using `Web3Button` to create a button that will call our `claim` function on our `editionDrop` contract. We're passing in the `address` of the user, `1` for the `amount` of NFTs to mint, and `0` for the `tokenId` of the NFT to mint.

This will make a transaction to our smart contract, and mint the NFT for the user. We're also passing in `onSuccess` and `onError` callbacks to handle the success and error cases.

When you actually go to mint the NFT, Metamask will pop up so you can pay gas. Once it's done minting, you should see `Successfully Minted!` in your console along w/ the Testnet OpenSea link. On [`testnets.opensea.io`](http://testnets.opensea.io/) we can actually see NFTs minted on the testnet which is pretty cool! When you head to your link, you'll see something like this:

![Untitled](https://i.imgur.com/PjjDSxd.png)

Nice! Here you'll see my NFT has "6 owners". You’ll also see it says “You own 1” which you’d see on your end as well as long as you minted one!

![Untitled](https://i.imgur.com/fdn9Qs4.png)

This is because I actually had a few friends mint this NFT for me to test it out. Also, because it's an ERC-1155 **everyone is an owner of the same NFT**. This is pretty cool and it's also more gas efficient. Minting an ERC721 costs 96,073 gas. Minting an ERC1155 costs 51,935 gas. Why? Because everyone is sharing the same NFT data. We don't have to copy new data for each user.

### 🛑 Show DAO Dashboard only if user owns the NFT

Okay, so if you remember we need to handle two cases:

1) if we detect that our user has a membership NFT, show them our "DAO Dashboard" screen where they can vote on proposals and see DAO related info.

2) if we detect that the user doesn't have our NFT, we'll give them a button to mint one.

This is pretty easy. All we need to add is the following to `App.jsx` before rendering mint nft screen.

```jsx
if (!address) {
  return (
    <div className="landing">
      <h1>Welcome to NarutoDAO</h1>
      <div className="btn-hero">
        <ConnectWallet />
      </div>
    </div>
  );
}

// Add this little piece!
if (hasClaimedNFT) {
  return (
    <div className="member-page">
      <h1>🍪DAO Member Page</h1>
      <p>Congratulations on being a member</p>
    </div>
  );
};
```

That’s it! Now, when you refresh the page you’ll see that you’re in the DAO Member Page. Yes!!! If you disconnect your wallet from your web app, you’ll be taken to the “Connect Wallet” page.

Finally, if you connect your wallet and **don’t** have the membership NFT, it’ll prompt you to mint one. I recommend you test this case:

1) **disconnect** your wallet from your web app

2) actually [create a new account](https://metamask.zendesk.com/hc/en-us/articles/360015289452-How-to-create-an-additional-account-in-your-MetaMask-wallet)

Which will get you a fresh public address so you can have a new address to receive the NFT on. Metamask lets you have as many accounts as you want.

Be sure to test all three cases!

1) Wallet not connected:

![Untitled](https://i.imgur.com/wIWqk4L.png)

2) Wallet connected, but the user doesn’t own a membership NFT:

![Untitled](https://i.imgur.com/4y06Gvb.png)

3) User owns a membership NFT, so, show them the page that only DAO members can see:

![Untitled](https://i.imgur.com/SVy3Yne.png)

### 🚨 Progress Report

*Please do this or Farza will be sad :(.*

Go ahead and share a screenshot of your membership NFT on OpenSea in `#progress`.
