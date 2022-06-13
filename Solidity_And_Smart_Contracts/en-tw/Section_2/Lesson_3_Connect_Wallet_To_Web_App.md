## 🌅 Using thirdweb's React library

So, for our website to talk to the blockchain, we need to somehow connect our wallet to it. Once we connect our wallet to our website, our website will have permission to call smart contracts on our behalf. Remember, it’s just like authenticating into a website.

Head over to Replit and go to `index.jsx` under `src`, this is where we’ll start.

To connect our wallet, we’re going to use thirdweb’s React library. Start by importing the `ChainID` and the `ThirdwebProvider`.

Blockchains have an `id` and by passing an id we’ll tell our app to which blockchain we want to connect. Luckily for us, we don’t need to pass an id manually, instead the `ChainId` method allows us to pick. In this case we’re choosing the polygon testnet `Mumbai`.

The second thing we’ll do is **wrap** our app in the `ThirdwebProvider` tags. 

This enables our app to make use of the thirdweb library in App.jsx, where we will be building out our connect wallet button.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';

// This is the chainId your dApp will work on.
const activeChainId = ChainId.Mumbai;

ReactDOM.render(
  <React.StrictMode>
    <ThirdwebProvider desiredChainId={activeChainId}>
      <App />
    </ThirdwebProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
```

Now go to your `App.jsx` file and let’s build a button to connect to our MetaMask wallet.

First, we’ll import all the hooks that we need.

Hooks are just pre-built functions that we can import and use.

We are grabbing the useDisconnect and useMetamask hooks to show whether or not our MetaMask wallet is connected. The useAddress hook grabs the address from the connected wallet.

Your `App.jsx` should look something like this.

```jsx
import React, { useEffect } from "react";
import "./App.css";
import { useAddress, useDisconnect, useMetamask } from '@thirdweb-dev/react';

const App = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect();

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
          I am farza and I worked on self-driving cars so that's pretty cool right? Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={null}>
          Wave at Me
        </button>
      </div>
    </div>
  );
}
```

Cool.

Now that we have the functionality to connect and disconnect the wallet, we need to link it to some buttons to do this. 

While we’re at it, let’s build a check in our app to see if we have a connected wallet.
If we have one, we show the `disconnect` button. If we don’t, we will display a `connect` wallet button.

We do this because Metamask doesn't just give our wallet credentials to every website we go to. It only gives it to websites we authorize and **connect to**. Think of this like logging in!

```jsx
return (
  //if there is an address show the page and a disconnect button
  {address ? (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
          I am farza and I worked on self-driving cars so that's pretty cool right? Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={null}>
          Wave at Me
        </button>
      </div>
    </div>
  ) : (
    //else show a connect button and ask to connect your wallet
      <button onClick={connectWithMetamask}>Connect with Metamask</button>
  )}
  );
```

Boom.

Like that we intergrated a functionality in our app that connects our wallet.

Now we can use our wallet to approve transactions!

ps, this is what the code looks like if you don't use thirdweb. 
Yikes!


```javascript
import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
          I am farza and I worked on self-driving cars so that's pretty cool right? Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={null}>
          Wave at Me
        </button>

        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}

export default App
```

## 🌐 Connect!

Now, it's time for the magic! Check out the video below:


## 🚨 Required: Before you click "Next Lesson"

We just did a lot in the last two lessons. Any questions? Be sure to ask in #section-2-help!
