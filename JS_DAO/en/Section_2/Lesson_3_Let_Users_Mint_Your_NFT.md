Let's head over to `App.jsx`. What we'll be doing now is

1) if we detect that our user has a membership NFT, show them our "DAO Dashboard" screen where they can vote on proposals and see DAO related info.

2) if we detect that the user doesn't have our NFT, we'll give them a button to mint one.

Let's do it! We'll attack case #1 first, we need to detect if the user has our NFT.

### 🤔 Check if user owns a membership NFT.

Head over to `App.jsx`. At the top add:

```jsx
import { ThirdwebSDK } from "@3rdweb/sdk";
```

From there, here's what we're going to add:

```jsx
// We instantiate the sdk on Rinkeby.
const sdk = new ThirdwebSDK("rinkeby");

// We can grab a reference to our ERC-1155 contract.
const bundleDropModule = sdk.getBundleDropModule(
  "INSERT_BUNDLE_DROP_ADDRESS",
);

const App = () => {
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("👋 Address:", address)

  // State variable for us to know if user has our NFT.
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);

  useEffect(() => {
    // If they don't have an connected wallet, exit!
    if (!address) {
      return;
    }
    
    // Check if the user has the NFT by using bundleDropModule.balanceOf
    return bundleDropModule
      .balanceOf(address, "0")
      .then((balance) => {
        // If balance is greater than 0, they have our NFT!
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("🌟 this user has a membership NFT!")
        } else {
          setHasClaimedNFT(false);
          console.log("😭 this user doesn't have a membership NFT.")
        }
      })
      .catch((error) => {
        setHasClaimedNFT(false);
        console.error("failed to nft balance", error);
      });
  }, [address]);

  // ... include all your other code that was alread there below.
```

We just tell thirdweb that we want to be on Rinkeby using `new ThirdwebSDK("rinkeby")`. Then, we create `bundleDropModule` and all we need is the address of our deployed ERC-1155 contract! When we do this, thirdweb gives us a little object we can easily use to interact with our contract.

From there, we use `bundleDropModule.balanceOf(address, "0")` to check if the user has our NFT. This will actually query our deployed smart contract for the data. Why do we do `"0"`? Well, basically because if you remember `0` is the tokenId of our membership NFT. So, here we're asking our contract, "Hey, does this user own a token with id 0?".

When you refresh this page, you'll see something like this:

![Untitled](https://i.imgur.com/m6e1sJb.png)

Perfect! We get "this user doesn't have a membership NFT". Let's create a button to let the user mint one.

### ✨ Build a "Mint NFT" button.

Let's do it! Head back to `App.jsx`. I added some comments on the lines I added:

```javascript
import { useEffect, useMemo, useState } from "react";

import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk";

const sdk = new ThirdwebSDK("rinkeby");

const bundleDropModule = sdk.getBundleDropModule(
  "INSERT_YOUR_DROP_ADDRESS",
);

const App = () => {
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("👋 Address:", address)

  // The signer is required to sign transactions on the blockchain.
  // Without it we can only read data, not write.
  const signer = provider ? provider.getSigner() : undefined;

  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  // isClaiming lets us easily keep a loading state while the NFT is minting.
  const [isClaiming, setIsClaiming] = useState(false);

  // Another useEffect!
  useEffect(() => {
    // We pass the signer to the sdk, which enables us to interact with
    // our deployed contract!
    sdk.setProviderOrSigner(signer);
  }, [signer]);

  useEffect(() => {
    if (!address) {
      return;
    }
    return bundleDropModule
      .balanceOf(address, "0")
      .then((balance) => {
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("🌟 this user has a membership NFT!")
        } else {
          setHasClaimedNFT(false);
          console.log("😭 this user doesn't have a membership NFT.")
        }
      })
      .catch((error) => {
        setHasClaimedNFT(false);
        console.error("failed to nft balance", error);
      });
  }, [address]);

  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to NarutoDAO</h1>
        <button onClick={() => connectWallet("injected")} className="btn-hero">
          Connect your wallet
        </button>
      </div>
    );
  }
  
  const mintNft = () => {
    setIsClaiming(true);
    // Call bundleDropModule.claim("0", 1) to mint nft to user's wallet.
    bundleDropModule
    .claim("0", 1)
    .then(() => {
      // Set claim state.
      setHasClaimedNFT(true);
      // Show user their fancy new NFT!
      console.log(
        `🌊 Successfully Minted! Check it our on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address}/0`
      );
    })
    .catch((err) => {
      console.error("failed to claim", err);
    })
    .finally(() => {
      // Stop loading state.
      setIsClaiming(false);
    });
  }
  
  // Render mint nft screen.
  return (
    <div className="mint-nft">
      <h1>Mint your free 🍪DAO Membership NFT</h1>
      <button
        disabled={isClaiming}
        onClick={() => mintNft()}
      >
        {isClaiming ? "Minting..." : "Mint your nft (FREE)"}
      </button>
    </div>
  );
};

export default App;
```

Okay a lot of stuff happening! The first thing we do is set up our `signer` which is what we need to actually send transactions on behalf of a user. See more [here](https://docs.ethers.io/v5/api/signer/). From there, we call `bundleDropModule.claim("0", 1)` to actually mint the NFT to the users wallet when they click the button. In this case the tokenId of our membership NFT is `0` so we pass 0. Then, we pass `1` because we only want to mint one membership NFT to the user's wallet!

Once it's all done, we do `setIsClaiming(false)` to stop the loading state. And, then we do `setHasClaimedNFT(true)` so that we can let our react app know that this user has successfully claimed an NFT.

When you actually go to mint the NFT, Metamask will pop so you can pay gas. Once it's done minting, you should see `Successfully Minted!` in your console along w/ the Testnet OpenSea link. On [`testnets.opensea.io`](http://testnets.opensea.io/) we can actually see NFTs minted on the testnet which is pretty cool! When you head to your link, you'll see something like this:

![Untitled](https://i.imgur.com/PjjDSxd.png)

Nice! Here you'll see my NFT here has "6 owners". You’ll also see it says “You own 1” which you’d see on your end as well as long as you minted on!

![Untitled](https://i.imgur.com/fdn9Qs4.png)

This is because I actually had a few friends mint this NFT for me to test it out. Also, because it's an ERC-1155 **everyone is an owner of the same NFT**. This is pretty cool and it's also more gas efficient. Minting an ERC721 costs 96,073 gas. Minting an ERC1155 costs 51,935 gas. Why? Because everyone is sharing the same NFT data. We don't have to copy new data for each user. 

### 🛑 Show DAO Dashboard only if user owns the NFT.

Okay, so if you remember we need to handle two cases:

1) if we detect that our user has a membership NFT, show them our "DAO Dashboard" screen where they can vote on proposals and see DAO related info.

2) if we detect that the user doesn't have our NFT, we'll give them a button to mint one.

This is pretty easy. All we need to add is the following to `App.jsx`

```jsx
if (!address) {
  return (
    <div className="landing">
      <h1>Welcome to NarutoDAO</h1>
      <button onClick={() => connectWallet("injected")} className="btn-hero">
        Connect your wallet
      </button>
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
