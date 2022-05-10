### 👛 Getting Started with Web3Auth

For this project we are going to use [Web3Auth](https://web3auth.io/).

Web3Auth is a pluggable auth infrastructure for Web3 wallets and applications. It streamlines the onboarding of both mainstream and crypto native users under a minute by providing experiences that they're most comfortable with. With support for all social logins, web & mobile native platforms, wallets and other key management methods, Web3Auth results in a standard cryptographic key provider specific to the user and application.


**Web3Auth Signin**

Our website needs to talk to Solana, for this, the user needs to connect to a wallet. Traditionally, these wallets rely on seed phrases and do not have a very good user experience. Web3Auth allows wallet creation in ways that users are already familiar with eg :- google, facebook etc and yet stay non-custodial.

### Register your application

In order to use Web3Auth, you'll need to create a project in the [Developer Dashboard](https://dashboard.web3auth.io/) and get your client ID. App registration is not required for localhost development.

### Installations 

```
npm create-react-app my-app
cd my-app
npm i @web3auth/web3auth
npm i @web3auth/solana-provider @web3auth/base
```

### Connecting Web3Auth

Edit App.jsx 

```jsx
/*
 * We are going to be using the useEffect hook!
 */
import { ADAPTER_EVENTS, CHAIN_NAMESPACES } from "@web3auth/base";
import { SolanaWallet } from "@web3auth/solana-provider";
import { Web3Auth } from "@web3auth/web3auth";
import { useEffect, useState } from 'react';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';

// Change this up to be your Twitter if you want.
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

// Register your app and get clientId from https://dashboard.web3auth.io
const clientId =
  "BBv_C9-2bpk82YbRXr9djcqATdYUvb51XkA8uvTmycJCHcW1PLaPsm08L8tSJ0P9iewcMSngIa663uTdpsTgscA";
const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.SOLANA,
  rpcTarget: "https://api.devnet.solana.com",
  blockExplorer: "https://explorer.solana.com/?cluster=devnet",
  chainId: "0x3",
  displayName: "Solana Devnet",
  ticker: "SOL",
  tickerName: "Solana",
};

const App = () => {
  
  const [web3auth, setWeb3Auth] = useState(null);
  const [web3AuthProvider, setWeb3AuthProvider] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);


  /*
   * Let's define this method so our code doesn't break.
   * We will write the logic for this next!
   */
  const connectWeb3Auth = async () => {
    if (web3auth) {
      const web3AuthProvider = await web3auth.connect();
      const solanaWallet = new SolanaWallet(web3auth.provider);
      const [publicKey] = await solanaWallet.requestAccounts();
      setWeb3AuthProvider(web3AuthProvider);
      setWalletAddress(publicKey);
    }
  };

  /*
   * This function holds the logic for deciding if a Web3Auth is
   * connected or not
   */
  const checkIfWeb3AuthIsConnected = async (web3AuthInstance) => {
    try {
      if (web3AuthInstance.provider) {
        setWeb3AuthProvider(web3AuthInstance.provider);
        const solanaWallet = new SolanaWallet(web3AuthInstance.provider);
        const [publicKey] = await solanaWallet.requestAccounts();
        /*
         * Set the user's publicKey in state to be used later!
         */
        setWalletAddress(publicKey);
      }
    } catch (error) {
      console.error(error);
    }
  };

  /*
   * When our component first mounts, let's initialize Web3Auth and check to see if user is already connected.
   *
   */
  useEffect(() => {
    const subscribeAuthEvents = (web3auth) => {
      web3auth.on(ADAPTER_EVENTS.CONNECTED, () => {
        setWeb3AuthProvider(web3auth.provider);
      });
    };

    async function init() {
      try {
        const web3AuthInstance = new Web3Auth({
          chainConfig,
          // get your client id from https://dashboard.web3auth.io
          clientId,
        });
        subscribeAuthEvents(web3AuthInstance);
        setWeb3Auth(web3AuthInstance);
        await web3AuthInstance.initModal();

        // check if user is already connected
        await checkIfWeb3AuthIsConnected(web3AuthInstance);
      } catch (error) {
        console.error(error);
      }
    }
    init();
  }, []);

  const logout = async () => {
    await web3auth.logout();
    setWeb3AuthProvider(null);
    setWalletAddress("");
  };

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWeb3Auth}>Connect Web3Auth</button>
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
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

Nice! Not too bad right? Let's break this down a bit:

```jsx
const connectWeb3Auth = async () => {
    if (web3auth) {
      const web3AuthProvider = await web3auth.connect();
      const solanaWallet = new SolanaWallet(web3auth.provider);
      const [publicKey] = await solanaWallet.requestAccounts();
      setWeb3AuthProvider(web3AuthProvider);
      setWalletAddress(publicKey);
    }
  };
```
Opens the web3auth modal that performs the entire login flow. Once the account is authenticated, the solanaWallet.requestAccounts() method will return the publicKey

```jsx
const checkIfWeb3AuthIsConnected = async (web3AuthInstance) => {
    try {
      if (web3AuthInstance.provider) {
        setWeb3AuthProvider(web3AuthInstance.provider);
        const solanaWallet = new SolanaWallet(web3AuthInstance.provider);
        const [publicKey] = await solanaWallet.requestAccounts();
        /*
         * Set the user's publicKey in state to be used later!
         */
        setWalletAddress(publicKey);
      }
    } catch (error) {
      console.error(error);
    }
  };
```

Our function here is checking if we have a web3AuthInstance provider (Solana JRPC provider). We then initialize our SolanaWallet with the provider. 
`solanaWallet.requestAccount()` returns the publicKey of the account connected with the website
`setWalletAddress(publicKey)` allows our app to access the connected account without calling the solanaWallet.requestAccounts() method everytime.

```jsx
    useEffect(() => {
    const subscribeAuthEvents = (web3auth) => {
      web3auth.on(ADAPTER_EVENTS.CONNECTED, () => {
        setWeb3AuthProvider(web3auth.provider);
      });
    };

    async function init() {
      try {
        const web3AuthInstance = new Web3Auth({
          chainConfig,
          // get your client id from https://dashboard.web3auth.io
          clientId,
        });
        subscribeAuthEvents(web3AuthInstance);
        setWeb3Auth(web3AuthInstance);
        await web3AuthInstance.initModal();

        // check if user is already connected
        await checkIfWeb3AuthIsConnected(web3AuthInstance);
      } catch (error) {
        console.error(error);
      } 
    }
    init();
  }, []);
```

In React, the `useEffect` hook gets called once on component mount when that second parameter (the `[]`) is empty! So, this is perfect for us. As soon as someone goes to our app, we can check to see if the user is already connected to Web3Auth. This will be **very important** soon.

```jsx
const subscribeAuthEvents = (web3auth) => {
  web3auth.on(ADAPTER_EVENTS.CONNECTED, () => {
    setWeb3AuthProvider(web3auth.provider);
  });
};
```
Here we subscribe to the events emitted by Web3Auth
These events notify our app of a user's interactions with Web3Auth and handle them. For example, you can implement the logic of checking whether user is logged in or not.

The init() does the initialization of Web3Auth components 
Here is where you choose your logins, whether to login with popups or redirects, whitelabel config and more. You can use the default set of logins & wallets (adapters), or choose for yourself.


### CSS Magic

Replace contents of App.css with 

```css
.App {
  height: 100vh;
  background-color: #1a202c;
  overflow: scroll;
  text-align: center;
}

.authed-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 30px;
}

.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 30px 0 30px;
}

.header {
  margin: 0;
  font-size: 50px;
  font-weight: bold;
  color: white;
}

.sub-text {
  font-size: 25px;
  color: white;
}

.gradient-text {
  background: -webkit-linear-gradient(left, #60c657 30%, #35aee2 60%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.cta-button {
  height: 45px;
  border: 0;
  width: auto;
  padding-left: 40px;
  padding-right: 40px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  color: white;
}

.connect-wallet-button {
  background: -webkit-linear-gradient(left, #60c657, #35aee2);
  background-size: 200% 200%;
  animation: gradient-animation 4s ease infinite;
}

.submit-gif-button {
  background: -webkit-linear-gradient(left, #4e44ce, #35aee2);
  background-size: 200% 200%;
  animation: gradient-animation 4s ease infinite;
  margin-left: 10px;
}

.footer-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 0;
  padding-bottom: 45px;
}

.twitter-logo {
  width: 35px;
  height: 35px;
}

.footer-text {
  color: white;
  font-size: 16px;
  font-weight: bold;
}

.gif-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  grid-gap: 1.5rem;
  justify-items: center;
  margin: 0;
  padding: 0;
}

.gif-grid .gif-item {
  display: flex;
  flex-direction: column;
  position: relative;
  justify-self: center;
  align-self: center;
}

.gif-item img {
  width: 100%;
  height: 300px;
  border-radius: 10px;
  object-fit: cover;
}

.connected-container input[type="text"] {
  display: inline-block;
  color: white;
  padding: 10px;
  width: 50%;
  height: 60px;
  font-size: 16px;
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0.25);
  border: none;
  border-radius: 10px;
  margin: 50px auto;
}

.connected-container button {
  height: 50px;
}

.flex-column {
  display: flex;
  flex-direction: column;
}
```

### What we have so far ?

By now we have a flow where the user can connect to our website using Web3Auth.
