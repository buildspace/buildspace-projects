We now know a bunch about interacting with the network via code. To make transactions, we used private keys. That won't work with users lol. To let people buy jpegs for real money from us, we need to work with wallets.

"Wallet" is kind of a weird name, since they do a lot more than just hold stuff. A wallet is *anything* that stores a secret key securely and lets the user sign transactions. They come in many forms, most commonly browser extensions, and they give you (the developer) APIs to suggest transactions to the user. Wallets make it possible for you to safely do this:

![](https://hackmd.io/_uploads/SkyPUbnfs.png)

We'll be using the Phantom browser extension as it's the most popular, you can use another if you want :)

Let's connect our web app with a wallet and make it give the user a trade offer!

#### 🛠 Solana Wallet-Adapter
There's DOZENS of wallets out there. Each of them doing something their own way. Imagine what a nightmare it would be if you had to build for each individual wallet API. Thankfully, we have [Solana Wallet-Adapter](https://github.com/solana-labs/wallet-adapter) - it's a suite of libraries that give you an almost universal API that works with a load of wallets out there (full list [here](https://github.com/solana-labs/wallet-adapter#wallets)).

You'll mainly be working with the `wallet-adapter-base` and `wallet-adapter-react` libraries. You can choose specific wallets you want to support, or just support everything. The difference here is which libraries you'd use - either a specific wallet library, or `wallet-adapter-wallets`. Since we're going with Phantom, we can just use the Phantom library!

Here's what we'd need to install (you don't need to run this right now):
```
npm install @solana/wallet-adapter-base \
    @solana/wallet-adapter-react \
    @solana/wallet-adapter-phantom \
    @solana/wallet-adapter-react-ui
```

`wallet-adapter-react-ui` takes care of the whole UI for us - connecting, selecting your wallet, disconnecting, all sorted!

![Solana Wallet adapter popup](https://github.com/solana-labs/wallet-adapter/raw/master/wallets.png)

Thanks to all these sick libraries, we never have to build wallet connection stuff on Solana! Take this moment to be greatful to the maintainers for saving you time and the hair on your head.

#### 👜 Build a wallet connect button
Let's take these libraries out for a spin! Set up a new project in your workspace:

```
git clone https://github.com/buildspace/solana-ping-frontend.git
cd solana-ping-frontend
git checkout starter
npm i
```

This template picks up where our last build left off - we've got a front-end for our ping client for writing data to the blockchain. Use `npm run dev` and you'll see this at localhost:

![](https://hackmd.io/_uploads/BkrPbM2Go.png)

This is a barebones UI - let's hook it up to the `wallet-adapter-react` library.

Pull up `_app.tsx` and make it look like this:
```ts
import React, { useMemo } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import {
  GlowWalletAdapter,
  PhantomWalletAdapter
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

require("@solana/wallet-adapter-react-ui/styles.css");
require("../styles/globals.css");
require ("../styles/Home.module.css");

const App = ({ Component, pageProps }) => {
  // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetwork.Devnet;

  // You can provide a custom RPC endpoint here
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new GlowWalletAdapter()
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

That's a lot of imports. Don't worry, all you need to know is what each of them are for, no need to understand how they work in depth. Here's a quick summary for each bit.

We start with React. `useMemo()` is a hook that loads stuff only if one of the dependencies changes. In our case, the value of `clusterApiUrl` will only change if the network that the user is connected to, changes.

The first Solana import we have is `wallet-adapter-network` from `@solana/wallet-adapter-base`. This is just an enumerable object for the available networks.

The `WalletModalProvider` is exactly that lol - it's a fancy React component that will prompt the user to select their wallet. Ezpz.

`ConnectionProvider` takes an RPC endpoint in and lets us talk directly to the nodes on the Solana blockchain. We'll use this throughout our app to send transactions.

`WalletProvider` gives us a standard interface for connecting to all sorts of wallets, so we don't have to bother reading docs for each wallet hehe.

Next you'll see a bunch of wallet adapters from `wallet-adapter-wallets`. We'll use the imports from this to create a list of wallets we'll feed the `WalletProvider`. There's a bunch of other wallet adapters available, even some made for other blockchains! Check them out [here](https://github.com/solana-labs/wallet-adapter/blob/master/PACKAGES.md#wallets). I just went with Phantom and Glow.

Finally, we have `clusterApiURL`, which is just a function that generates an RPC endpoint for us based on the network we give it.

For the return statement inside the React App component, we're wrapping the children (the rest of the app) with some context providers.

To summarise: this file is the `start` of our web application. Whatever we make available here is accessible by the rest of our app. We're making all the wallet and network tools available here so we don't need to reinitialize them in every child component.

I copied all of this code from the official `wallet-adapter` Next.js template, so don't feel bad about copy/pasting (this time).

#### 🧞‍♂️ Using the providers to connect to wallets
Phew, that was a bunch of setup! Now you get to see how easy interacting with wallets is. All we have to do is set up one React hook in `components/AppBar.tsx`:
```ts
import { FC } from 'react'
import styles from '../styles/Home.module.css'
import Image from 'next/image'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export const AppBar: FC = () => {
    return (
        <div className={styles.AppHeader}>
            <Image src="/solanaLogo.png" height={30} width={200} />
            <span>Wallet-Adapter Example</span>
            <WalletMultiButton/>
        </div>
    )
}
```

Pretty easy, eh? `WalletMultiButton` works a bunch of magic for us and handles all the connection bits. If you hard refresh your app now, you should see a fancy purple button in the top right corner!
