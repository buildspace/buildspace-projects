### 🛍 Render connect to wallet button

**We only want our "Connect to Wallet" button to render when our user has not actually connected their wallet to the app.**

So, why don't we fetch the wallet information from the wallet adapter library we installed? **Then** we could also use that as the flag to determine if we should show or hide our button.

First, head over to `index.js`. You will need to import `useWallet` into your component like so:

```jsx
import { useWallet } from "@solana/wallet-adapter-react";
```

Very nice. So now that we are ready to fetch the wallet information, let's update a few things in our code here:

```jsx
import React from "react";
import dynamic from "next/dynamic";
import { useWallet } from "@solana/wallet-adapter-react";

const WalletMultiButtonDynamic = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const Home = () => {
    const wallet = useWallet();
    // Actions
    const renderNotConnectedContainer = () => (
        <div>
            <img src="https://media.giphy.com/media/eSwGh3YK54JKU/giphy.gif" alt="emoji" />

            <div className="button-container">
                <WalletMultiButtonDynamic className="cta-button connect-wallet-button" />
            </div>
        </div>
    );

    return (
        <div className="App">
            <div className="container">
                <div className="header-container">
                    <p className="header">🍭 Candy Drop</p>
                    <p className="sub-text">NFT drop machine with fair mint</p>
                    {/* Render your connect to wallet button right here */}
                    {wallet.publicKey ? "Hello" : renderNotConnectedContainer()}
                </div>

                <div className="footer-container">
                    <img alt="Twitter Logo" className="twitter-logo" src="twitter-logo.svg" />
                    <a className="footer-text" href={TWITTER_LINK} target="_blank" rel="noreferrer">{`built on @${TWITTER_HANDLE}`}</a>
                </div>
            </div>
        </div>
    );
};

export default Home;

```

Lets just go over the changes really quick:

```jsx
const wallet = useWallet();
```

I think this is pretty self explanatory. `useWallet` is a custom hook provided by `@solana/wallet-adapter-react`. We just connected our Phantom Wallet and now received the data from the user's wallet. Now that we have that, we can use a ternary operator to do conditional rendering. You can learn more about ternary operator [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator).

```jsx
{/* Add the condition to show this only if we don't have a wallet address */}
{wallet.publicKey ? "Hello World" : renderNotConnectedContainer()}
```

Here, we're telling React to only render `Hello World` if we have a `publicKey` available. So, if there is no `publicKey`, that means a user has not connected their wallet and we should show them the button to connect their wallet. 

Go ahead and refresh your page and press your Select Wallet button! If all works, you should finally see the Phantom Wallet extension appear like this:

![Untitled](https://i.imgur.com/wXQyWEe.png)

Once you press connect, your button should disappear! LET'S. FREAKING. GO.

**You just connected a Solana wallet to your app. This is pretty wild.**

Pretty big moves right here! You have your basic UI setup and can easily "auth" a user with their Solana wallet. Easy.

Next, we are going to get all setup with the functions we need to call our Solana program + get some data going. Our web app is kinda boring/empty rn! Let's change that :).

*Note: In your Phantom settings (which you can get to by clicking the gear near the bottom right) you'll see a "Trusted Apps" section. Here, you'll see your Replit URL, or `localhost:3000` if you are running your app locally. Feel free to **revoke** this if you want to test the case of someone coming to your site that's never connected before. It'll basically reset your wallets access to the site and show the "Connect to Wallet" button again.*

### 🚨 Progress Report

*Please do this else Farza will be sad :(*

Post a screenshot in `#progress` of your console printing out your public key! Don't worry, the public key is safe to share :).