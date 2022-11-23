Now that we have our base code set up, we can get started with a wallet connect button. I'm using [Phantom wallet](https://phantom.app/) but you can use any! Just be warned that I haven't tested this with other wallets.

The beauty of using a starter template is that it already has a bunch of stuff we'll need. I removed most of it 🙈 so we can put it in ourselves and learn how it works.

### 🤖 Set up wallet providers
The first thing we'll need to do is set up the root of our app, `_app.js` to look for wallets and connect to them. Here's what it'll look like:
```jsx 
import React, { useMemo } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import {
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

import "@solana/wallet-adapter-react-ui/styles.css";
import "../styles/globals.css";
import "../styles/App.css";

const App = ({ Component, pageProps }) => {
  // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
    ],
    [network]
  );

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

That's a lot of imports. Don't worry, all you need to know is what each of them are for, no need to understand how they work in depth.

The first thing I have is just some React imports. [`useMemo()` ](https://reactjs.org/docs/hooks-reference.html#usememo) is a React hook that loads stuff only if one of the dependencies changes. In our case, if the **network** the user is connected to doesn't change, the value of `clusterApiUrl` won't change either. 

The first Solana import we have is `wallet-adapter-network` from [`@solana/wallet-adapter-base`](https://github.com/solana-labs/wallet-adapter/tree/master/packages/core/base). This is just an enumerable object for the available networks.

The `WalletModalProvider` is exactly that lol - it's a fancy React component that will prompt the user to select their wallet. Ezpz.

`ConnectionProvider` and `WalletProvider` are probably the most important ones. 

`ConnectionProvider` takes an RPC endpoint in and lets us talk directly to the nodes on the Solana blockchain. We'll use this throughout our app to send transactions. 

`WalletProvider` gives us a standard interface for connecting to all sorts of wallets, so we don't have to bother reading docs for each wallet hehe.

Next you'll see a bunch of wallet adapters from `wallet-adapter-wallets`. We'll use the imports from this to create a list of wallets we'll feed the `WalletProvider`. There's a bunch of other wallet adapters available, even some made for other blockchains! Check them out [here](https://github.com/solana-labs/wallet-adapter/blob/master/PACKAGES.md#wallets). I just went with the ones that were in the starter by default.

Finally, we have `clusterApiURL`, which is just a function that generates an RPC endpoint for us based on the network we give it.

For the return statement inside the React App component, we're wrapping the children (the rest of the app) with some [context](https://reactjs.org/docs/context.html#contextprovider) providers. 

To summarise: this file is the **start** of our web application. Whatever we make available here is accessible by the rest of our app. We're making all the wallet and network tools available here so we don't need to look at the `Solana` object injected into the `Window` component and we don't have to reinitialize them in every child component.

I copied all of this from the Next.js template, so don't feel bad about copy/pasting (this time).

### 🧞‍♂️ Using the providers to connect to wallets
Phew, that was a bunch of setup! Now you get to see how easy it makes interacting with wallets. All we have to do is set up some React hooks. Here's my `index.js`:
```jsx
import React from 'react';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from "next/dynamic";

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
// Dynamic import `WalletMultiButton` to prevent hydration error
const WalletMultiButtonDynamic = dynamic(
    async () =>
      (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
  );
  
  // This will fetch the users' public key (wallet address) from any wallet we support
  const { publicKey } = useWallet();

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
        <header className="header-container">
          <p className="header"> 😳 Buildspace Emoji Store 😈</p>
          <p className="sub-text">The only emoji store that accepts shitcoins</p>
        </header>

        <main>
          {/* We only render the connect button if public key doesn't exist */}
          {publicKey ? 'Connected!' : renderNotConnectedContainer()}

        </main>

        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src="twitter-logo.svg" />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
```

Pretty easy, eh? The `useWallet()` hook will give us the connected users' address anywhere in the app. It subscribes to the providers we set up in `_app.js`. 


### 🚨 Progress Report
Please do this else a kitten will meow very sadly :(

We've got a proper *web3* app now! 

**Upload screenshot of your wallet connection modal >:D**
