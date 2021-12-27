### ⛓ Specify your chain and wallet type.

So, in order for our website to talk to the blockchain, we need to somehow connect our wallet to it. Once we connect our wallet to our website, our website will have permission to call smart contracts on our behalf. **Remember, it's just like authenticating into a website.**

You may have built "Connect to Wallet" buttons in the past! This time, we'll be using thirdweb’s front-end SDK which makes it crazy easy.

Head over to `index.js` in your React App and add the following code:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// Import ThirdWeb
import { ThirdwebWeb3Provider } from '@3rdweb/hooks';

// Include what chains you wanna support.
// 4 = Rinkeby.
const supportedChainIds = [4];

// Include what type of wallet you want to support.
// In this case, we support Metamask which is an "injected wallet".
const connectors = {
  injected: {},
};

// Finally, wrap App with ThirdwebWeb3Provider.
ReactDOM.render(
  <React.StrictMode>
    <ThirdwebWeb3Provider
      connectors={connectors}
      supportedChainIds={supportedChainIds}
    >
      <App />
    </ThirdwebWeb3Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
```

Pretty simple. We're importing thirdweb and then specifying the `chainId` of the chain we're working on, which is Rinkeby! Feel free to check out all the ids [here](https://besu.hyperledger.org/en/stable/Concepts/NetworkID-And-ChainID/). Then, under `connectors` we are specifying what type of wallet we are supporting. There are many types of wallets. Mobile wallets, injected wallets, hardware wallets, etc. thirdweb makes it easy to support all of them in a few lines. In this case, we just support `injected` wallets which allows us to support browser extension-based wallets like Metamask.

Finally, we're wrapping everything with `<ThirdwebWeb3Provider>`, this provider holds the user's authenticated wallet data (if they've connected to our website before) and passes it over to `App`.

*Note: If you've worked on dapps before, make sure you disconnect your wallet from [https://localhost:3000](https://localhost:3000) on Metamask if you have ever connected it before.*

### 🌟 Add Connect to Wallet.

If you head over to your web app, you'll see a blank purple page. Let's add some basic copy + a button to let users connect their wallet.

Head over to `App.jsx`. Add the following code.

```jsx
import { useEffect, useMemo, useState } from "react";

// import thirdweb
import { useWeb3 } from "@3rdweb/hooks";

const App = () => {
  // Use the connectWallet hook thirdweb gives us.
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("👋 Address:", address)

  // This is the case where the user hasn't connected their wallet
  // to your web app. Let them call connectWallet.
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
  
  // This is the case where we have the user's address
  // which means they've connected their wallet to our site!
  return (
    <div className="landing">
      <h1>👀 wallet connected, now what!</h1>
    </div>);
};

export default App;
```

Pretty easy! BTW -- at this point make sure your web app is running using `npm start` if you're working locally.

Now, when you go to your web app and click connect to wallet, you'll see it pops Metamask! After you authorize your wallet, you'll see this screen:

![Untitled](https://i.imgur.com/oDG9uiz.png)

Boom. And if you go to your console, you'll see it prints out your public address. If you refresh your page here, you'll see our wallet connection sticks around as well.

If you've built a connect to wallet in the past, you'll notice how it is way easier w/ thirdweb's client SDK since it handles common edge cases for you (ex. maintaining the state of a user's wallet in a variable). 

BTW — here I do `<h1>Welcome to NarutoDAO</h1>`, please make this your own. Don’t copy me! This is your DAO!

*Note: feel free to [disconnect your website](https://metamask.zendesk.com/hc/en-us/articles/360059535551-Disconnect-wallet-from-Dapp) from Metamask as well if you want to test the case where a user hasn't connected their wallet.* 

### 🚨 Progress Report

*Please do this else Farza will be sad :(*

Post a screenshot in `#progress` showing your DAO’s main welcome screen with the connect to wallet button. It better not say NarutoDAO!
