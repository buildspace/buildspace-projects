What we have right now is a plain React application. It doesn't have any logic, just a bunch of styling that I've prepared so you can save time :P

We want to interact with our contract using this web app. To do this, we need to be able to talk to the Terra blockchain. We'll do this via the Terra Station Wallet browser extension. Let's connect to it first.

### 🛰 Using the Wallet Provider API
Once we connect our wallet to our website, our website will be able to trigger transactions that send messages to our contract from our wallet. If our users don't connect their wallet, they simply can't communicate with the Terra blockchain.

Remember, it's just like authenticating into a website. If you aren't "logged in" to G-Mail, then you can't use their email product!

Terra has an awesome library called [wallet-provider](https://github.com/terra-money/wallet-provider) that makes this process pretty smooth. Start by setting it up in `terra-starter/src/index.js`:

```jsx
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';

import { Route, Routes, BrowserRouter } from 'react-router-dom';
import './index.css';

// We import Wallet Provider and a util function
import { getChainOptions, WalletProvider } from '@terra-money/wallet-provider';

const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

// Fetch available connection options
getChainOptions().then((chainOptions) => {
  ReactDOM.render(
    <React.StrictMode>
      {/* Wrap the app in a context provider for the wallet */}
      <WalletProvider {...chainOptions}>
        <div className="App-header">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<App />} />
            </Routes>
          </BrowserRouter>

          <div className="footer-container">
            <img
              alt="Twitter Logo"
              className="twitter-logo"
              src="/twitter-logo.svg"
            />
            <a
              className="footer-text"
              href={TWITTER_LINK}
              target="_blank"
              rel="noreferrer"
            >{`Made with @${TWITTER_HANDLE}`}</a>
          </div>
        </div>
      </WalletProvider>
    </React.StrictMode>,
    document.getElementById('root')
  );
});
```

If you're new to React, some of this might seem confusing. Worry not! React is older than Ethereum and every common question you might have has been answered by someone on the internet. 

Let's break down the new stuff line by line.

```javascript
getChainOptions().then((chainOptions) => {
```
First, we import the Wallet Provider objects from the library. Then we call the `getChainOptions` function to contact the Terra servers and check which chains we can connect to and what their endpoints are (try logging the `chainOptions` param with `console.log`). Pretty simple so far.

```jsx
<WalletProvider {...chainOptions}>
    {/* Rest of app in here */}
</WalletProvider>
```
Next, we set up a React [context provider](https://reactjs.org/docs/context.html#contextprovider). In simple terms, context is just state (storage) across multiple parts of the app in React. The provider makes certain data available to all it's children and if they want to access that data, they can subscribe to it. Since `index.js` is the entry point of our app, we can access WalletProvider *everywhere*. 

```jsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<App />} />
  </Routes>
</BrowserRouter>
```

The route stuff is something extra we're doing to easily support different app paths. You *could* do this with plain React components but I wanna give you the tools to make this a real product! It's pretty easy to use, all you need is a `<Route/>` for each path and just point it to the right element. Check out the docs [here](https://v5.reactrouter.com/web/guides/quick-start) if you wanna learn more.

Now that we have the Wallet Provider set up, we can use it to connect the wallet. In `terra-starter/src/app.js`:

```javascript
import './App.css';
//Bring in the required hooks and possible wallet states
import { useWallet, WalletStatus } from "@terra-money/wallet-provider";

function App() {
  // Current wallet status, connect & disconnect functions, available connections
  const { status, connect, disconnect, availableConnectTypes } = useWallet();
    
  // Let's take a look at what the starting states are!
  console.log("Wallet status is ", status);
  console.log("Available connection types:", availableConnectTypes);

  // Nothing changes here :D
  return (
    <main className="App">
      <header>
        <div className="header-titles">
          <h1>⚔ Goblin War ⚔</h1>
          <p>Only you can save us from Goblin town</p>
        </div>

      </header>

      <div>
        <img
          src="https://media.giphy.com/media/B19AYwNXoXtcs/giphy.gif"
          alt="Goblin gif"
        />
      </div>
    </main>
  );
}

export default App;
```

Pretty straightforward so far. We're bringing in the custom `useWallet` hook from the `wallet-provider` package and the `WalletStatus` enum, which lists all **possible** statuses. `useWallet` subscribes to the provider we set up just before this.

The objects we destructure from `useWallet()` are:
* `status`: What the current connection status of the app is. The result is one of the `WalletStatus` enums.
* `connect` & `disconnect`: functions that do exactly what they say lol
* `availableConnectTypes`: the wallet provider checks the browser and returns this array which lists the ways you can connect. You can use this to detect if the extension is installed!

Save your files and head over to the browser console (inspect element -> console tab) at `localhost:3000`. You should see the two console log statements printed out a bunch of times.

![](https://hackmd.io/_uploads/H13xY4ZS9.png)

🚨 **Note: The Wallet-Provider package has a bug at the moment where hot reloads often crash your app.** If you see a `process is not defined` error, don't worry about it. Just refresh your app manually and it'll go away.

Alright, now that we know the extension is available, here's how to connect to it:
```javascript
  const renderConnectButton = () => {
    if (status === WalletStatus.WALLET_NOT_CONNECTED) {
      return (
        <div className="connect-wallet-div">
          <button
            type="button"
            key={`connect-EXTENSION`}
            onClick={() => connect("EXTENSION")}
            className="cta-button connect-wallet-button"
          >
            Connect wallet
          </button>
        </div>
      );
    }
  };
```
Add this right under the `useWallet()` hook (line 6).

Easiest login button ever? If the app isn't connected, render a simple button that calls the `connect()` function. You control which type of wallet you want to connect with using the `key` and `connect()` arguments.

To call this function, put it in the return near the bottom, right before the closing `</main>` tag:
```javascript
    <main className="App">
      <header>
        <div className="header-titles">
          <h1>⚔ Goblin War ⚔</h1>
          <p>Only you can save us from Goblin town</p>
        </div>

      </header>

      <div>
        <img
          src="https://media.giphy.com/media/B19AYwNXoXtcs/giphy.gif"
          alt="Goblin gif"
        />
      </div>
        
      {/* Add it here */}
      {renderConnectButton()}
    </main>
```

Save. Run. Click connect. You should see the wallet status change to `WALLET_CONNECTED` in the console after you click. WOWOWOW. I wish all authentication was this easy.

The weird part about the Terra Station Wallet is there's no disconnect button lol. Let's add one, all you need to do is call `disconnect()` on click haha. Here's my completed `App.js` so far:

```javascript
import './App.css';
import { useWallet, WalletStatus } from "@terra-money/wallet-provider";

function App() {
  const { status, connect, disconnect, availableConnectTypes } = useWallet();

  console.log("Wallet status is ", status);
  console.log("Available connection types:", availableConnectTypes);

  const renderConnectButton = () => {
    if (status === WalletStatus.WALLET_NOT_CONNECTED) {
      return (
        <div className="connect-wallet-div">
          <button
            type="button"
            key={`connect-EXTENSION`}
            onClick={() => connect("EXTENSION")}
            className="cta-button connect-wallet-button"
          >
            Connect wallet
          </button>
        </div>
      );
    }
    // Check if wallet is connect
    else if (status === WalletStatus.WALLET_CONNECTED) {
      return (
        <button
          type="button"
          onClick={() => disconnect()}
          className="cta-button connect-wallet-button"
        >
          Disconnect
        </button>
      );
    }
  };

  return (
    <main className="App">
      <header>
        <div className="header-titles">
          <h1>⚔ Goblin War ⚔</h1>
          <p>Only you can save us from Goblin town</p>
        </div>

      </header>

      <div>
        <img
          src="https://media.giphy.com/media/B19AYwNXoXtcs/giphy.gif"
          alt="Goblin gif"
        />
      </div>

      {renderConnectButton()}
    </main>
  );
}

export default App;
```

Once you press connect, the button should change to disconnect. Pretty simple, eh?

You just connected a Terra Station wallet to your app. This is pretty wild. Look at how fast you're going!


### 🚨 Progress Report
*Please do this else Raza will be sad :(*

Post a screenshot of your console in #progress showing off your connected wallet.
