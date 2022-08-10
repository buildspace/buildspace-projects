Since we're using FCL, we can use *any* Flow wallet we want! I'm going to go with the most popular Flow wallet - [Blocto](https://docs.onflow.org/flow-token/available-wallets/#how-to-use-blocto).

You can also try out [Lilico](https://lilico.app/) - it's a custodial wallet that works as a browser extension, just like other popular wallets. If you decide to use this, download it and set it up now.

Head back to VS Code and open the `App.js` file in the `src` directory. You should see a bunch of code already there. Apart from the Cadence folder, this is a plain React app, just like the one you'd generate with Create React App. I've just added styling to save you some time :D

### ⚡ Using the FCL (Flow Client Library)
Remember what I mentioned about FCL at the start? It standardises wallet connections so you only need to write wallet connection code *once*. Let's set it up!

Import the following two packages in your app.js file. Copy & paste it right below where you're importing the twitter logo.
```
import * as fcl from "@onflow/fcl";
import * as types from "@onflow/types";
```
The first import is the main library which helps us interact with the Flow blockchain. The second library helps us convert javascript data types into flow/cadence compatible data types.

Right after, add this:
```
fcl.config({
  "flow.network": "testnet",
  "app.detail.title": "BottomShot", // Change the title!
  "accessNode.api": "https://rest-testnet.onflow.org",
  "app.detail.icon": "https://placekitten.com/g/200/200",
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
});
```
This is all you need to set up your App to be compatible and work with the Flow testnet.

Here's what `fcl.config()` is setting: 
* `"flow.network": "testnet"` configures the current network of the dapp to testnet
* `"accessNode.api": "https://rest-testnet.onflow.org"` configures the url of the node, which we use to interact with the blockchain.
* `"discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn"` tells the dapp about the wallet that needs to be used to interact with the dapp. 
* `"app.detail.title": "BottomShot"` gives the dapp a name. You can change it to whatever value you want.
* And finally, `"app.detail.icon": "https://placekitten.com/g/200/200"` displays an icon for the app when you're authenticating with a wallet.

You can check out [this part](https://docs.onflow.org/fcl/reference/api/#common-configuration-keys) of the official flow docs to learn more about the configuration values.

### 🔓 Build the wallet connect button
Time for the easiest authentication you'll ever do on a web app (yes, even easier than Metamask). 

The FCL makes authentication *very* easy, literally just 3 lines of code and one button you can click.

Start by making a stateful variable with the [`useState`](https://reactjs.org/docs/hooks-state.html) hook to store the current `user`. This will go at the top of your `App()` function

```js
  const [ user, setUser ] = useState();
```

Next let's make the authentication (wallet connection) functions and use the `setUser` function everytime a user change is detected. Add these below the `useState` variable:

```js
  const logIn = () => {
      fcl.authenticate();
  };

  const logOut = () => {
      fcl.unauthenticate();
  };

  useEffect(() => {
    // This listens to changes in the user objects
    // and updates the connected user
    fcl.currentUser().subscribe(setUser);
  }, [])
```

**Lilico!**
Btw if you're building for Lilico, you should check the user's network. With Blocto we set the network in the fcl config. On Lilico users can change the network themselves. Here's how you can track which network Lilico users switch to:
```js
const [network, setNetwork] = useState("");

useEffect(()=>{
    // This is an event listener for all messages that are sent to the window
    window.addEventListener("message", d => {
    // This only works for Lilico testnet to mainnet changes
      if(d.data.type==='LILICO:NETWORK') setNetwork(d.data.network)
    })
  }, [])
```
You can use the network value to warn the user if they're on the wrong network :D

**Note**
When you change `Lilico` networks your account address changes. So when network is switched, authentication needs to be done again to get the updated account address. 

Right after, make render components for both our buttons: 
```js
  const RenderLogin = () => {
    return (
      <div>
        <button className="cta-button button-glow" onClick={() => logIn()}>
          Log In
        </button>
      </div>
    );
  };

  const RenderLogout = () => {
    if (user && user.addr) {
      return (
        <div className="logout-container">
          <button className="cta-button logout-btn" onClick={() => logOut()}>
            ❎ {"  "}
            {user.addr.substring(0, 6)}...{user.addr.substring(user.addr.length - 4)}
          </button>
        </div>
      );
    }
    return undefined;
  };
```

Put your logout render function at the top and the login render function right before the `footer-container` div. I made my login button disappear like this:
```
{user && user.addr ? "Wallet connected!" : <RenderLogin />}
```

This is what your App.js file should look like now:
```
//importing required libraries
import React, { useState, useEffect } from "react";
import './App.css';
import twitterLogo from "./assets/twitter-logo.svg";
import * as fcl from "@onflow/fcl";
import * as types from "@onflow/types";

const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

fcl.config({
  "flow.network": "testnet",
  "app.detail.title": "BottomShot", // Change the title!
  "accessNode.api": "https://rest-testnet.onflow.org",
  "app.detail.icon": "https://placekitten.com/g/200/200",
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
});

function App() {

  const [ user, setUser ] = useState();

  const logIn = () => {
    fcl.authenticate();
  };

  const logOut = () => {
    fcl.unauthenticate();
  };
  
  useEffect(() => {
    // This listens to changes in the user objects
    // and updates the connected user
    fcl.currentUser().subscribe(setUser);
  }, [])

  const RenderLogin = () => {
    return (
      <div>
        <button className="cta-button button-glow" onClick={() => logIn()}>
          Log In
        </button>
      </div>
    );
  };

  const RenderLogout = () => {
    if (user && user.addr) {
      return (
        <div className="logout-container">
          <button className="cta-button logout-btn" onClick={() => logOut()}>
            ❎ {"  "}
            {user.addr.substring(0, 6)}...{user.addr.substring(user.addr.length - 4)}
          </button>
        </div>
      );
    }
    return undefined;
  };

  return (
    <div className="App">
      <RenderLogout />
      <div className="container">
        <div className="header-container">
          <div className="logo-container">
            <img src="./logo.png" className="flow-logo" alt="flow logo"/>
            <p className="header">✨Awesome NFTs on Flow ✨</p>
          </div>

          <p className="sub-text">The easiest NFT mint experience ever!</p>
        </div>

        {/* If not logged in, render login button */}
        {user && user.addr ? "Wallet connected!" : <RenderLogin />}

        <div className="footer-container">
            <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
            <a className="footer-text" href={TWITTER_LINK} target="_blank" rel="noreferrer">{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
}

export default App;
```

**Important:** You *might* see this warning when you log in for the first time. You can ignore it or add the required info later.

![Dashboard](https://i.imgur.com/rGV2MBL.png)

Head over to `http://localhost:3000/` in your browser and you should see your fancy login button! Make sure you test it out by logging in with your account 😎