### 🤖 Let's grab the starter code

Start by heading over to [this GitHub link](https://github.com/buildspace/nft-drop-starter-project) where you find the starter repo code. From here you are going to want to make sure you press the "Fork" button in the top right of the page

![image](https://i.imgur.com/p2FTyAM.png)

Sweet! When you fork this repo, you are actually creating an identical copy of it that lives under your Github profile. So now you have your own version of this code that you can edit to your hearts content :). This will also come in handy when we are ready to deploy our app to Vercel 🤘.

The final step here is to actually get your newly forked repo on your local machine. Click the "Code" button and copy that link!

![image](https://i.imgur.com/4QtA8wO.png)

Finally, head to your terminal and `cd` into whatever directory your project will live in and run the command:

```plaintext
git clone YOUR_FORKED_LINK
```

There it is :). Time to code!

### 🔌 Building a connect wallet button with Phantom Wallet

For this project we are going to be using a wallet called [Phantom](https://phantom.app/). This is one of the top wallet extensions for Solana.

Before we dive into any code - make sure you have downloaded the extension and setup a Solana wallet! Currently, Phantom Wallet supports **Chrome**, **Brave**, **Firefox**, and **Edge.** But, as a note: we only tested this code on Brave and Chrome.

### 👻 Using the Solana object

In order for our website to talk to our Solana program, we need to somehow connect our wallet (which is the Phantom Wallet extension) to it.

Once we connect our wallet to our website, our website will have permission to run functions from our program, on our behalf. If our users don't connect their wallet, they can't communicate with the Solana blockchain.

**Remember, it's just like authenticating into a website.** If you aren't "logged in" to G-Mail, then you can't use their email product!

Head over to your code and go to `index.js` under `pages`. This is where the main entry point of our app will be.

If you have the Phantom Wallet extension installed, it will automatically inject a special object named `solana` into your `window` object that has some magical functions. This means before we do anything, we need to check to see if this exists. If it doesn't exist, let's tell our user to go download it:

```jsx
import React from "react";
import dynamic from "next/dynamic";

// This is to disable SSR when using WalletMultiButton
const WalletMultiButtonDynamic = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const Home = () => {
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
                    {renderNotConnectedContainer()}
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

Nice! Not too bad right? Let's break this down a bit:

```jsx
const renderNotConnectedContainer = () => (
    <div>
        <img src="https://media.giphy.com/media/eSwGh3YK54JKU/giphy.gif" alt="emoji" />
        <div className="button-container">
            <WalletMultiButton className="cta-button connect-wallet-button" />
        </div>
    </div>
);
```

`WalletMultiButton` will automatically detect any Solana wallet extensions you installed in your browser such as `Phantom`, `Sollet`, `Ledger`, `Solflare` etc. This is dependent on your configurations in `_app.js`. This is how your `_app.js` should look like.

```javascript
import { useMemo } from "react";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";

import "../styles/App.css";
import "../styles/globals.css";
import "../styles/CandyMachine.css";
import "@solana/wallet-adapter-react-ui/styles.css";

const App = ({ Component, pageProps }) => {
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const wallets = useMemo(() => [new PhantomWalletAdapter()], [network]);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <Component {...pageProps} />
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default App;
```

### **Adding support for more wallet adapters (Optional)**

If you're looking to add support for more extensions, you can do so by importing more adapters. Like this

```javascript
// ... Rest of your code
import { PhantomWalletAdapter, SolflareWalletAdapter, TorusWalletAdapter } from "@solana/wallet-adapter-wallets";

// ... Rest of your code

const App = ({ Component, pageProps }) => {
    // ... Rest of your code
    const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter(), new TorusWalletAdapter()], [network]);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <Component {...pageProps} />
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default App;
```

And now run `npm run dev` and click on the `Select Wallet` button. It should list out a few wallets for you to choose from depending on how you configure your adapters.

<img src="https://i.imgur.com/0BZZTsD.png" />

Since we have tested this project fully with Phantom Wallets, we recommend sticking with that. Nothing is stopping you with exploring or supporting other wallets, though 👀.

### 🔒 Accessing the user's account

Once you've successfully log into your wallet, your website should look something like this

<img src="https://i.imgur.com/Rsg01DA.png" />

_For additional instructions on getting your app running, refer to `README.md` at the root of your project._

**NICE.**

Next, we need to actually check if we're **authorized** to actually access the user's wallet. Once we have access to this, we can start getting access to the functions in our Solana program 🤘.

Basically, **Phantom Wallet doesn't just give our wallet information to every website we go to**. It only gives it to websites we authorize. So far, we have **not** given Phantom explicit access to share our wallet's info.

The first thing we need to do is check if a user has given us permission to use their wallet on our site — this is sorta like checking if our user is "logged in".

```jsx
const wallet = useWallet();
```

`useWallet()` is a custom hook that checks if the wallet is connected. If it is, it will return all the necessary information about that wallet.

And that's it!

### 🚨 Progress Report

_Please do this else Farza will be sad :(_

Post a screenshot in `#progress` showing off the that message "Phantom wallet found" in your console. May seem simple, but, not many people know how to do this stuff! It's epic.
