### 🛍 Render connect to wallet button

Alright, we are already checking to see if a user is already connected to our app or not. What if they aren't connected? We have no way in our app to prompt Phantom Wallet to connect to our app!

We need to create a `connectWallet` button. In the world of web3, connecting your wallet is literally a "Sign Up/Login" button built into one for your user.

Ready for the easiest "Sign Up" experience of your life :)? Check out the code below. I dropped comments on lines I changed.

```jsx
import React, { useEffect } from 'react';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            'Connected with Public Key:',
            response.publicKey.toString()
          );
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };

  /*
   * Let's define this method so our code doesn't break.
   * We will write the logic for this next!
   */
  const connectWallet = async () => {};

  /*
   * We want to render this UI when the user hasn't connected
   * their wallet to our app yet.
   */
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

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

Nice! You should now have a cool looking gradient button that says "Connect to Wallet" rendered on your page.

![Untitled](https://i.imgur.com/5Y2lUYP.png)

**We only want our "Connect to Wallet" button to render when our user has not actually connected their wallet to the app.**

So, why don't we store this wallet data in the React state? **Then** we could also use that as the flag to determine if we should show or hide our button.

First you will need to import `useState` into your component like so:

```jsx
import React, { useEffect, useState } from 'react';
```

Then, right above your `checkIfWalletIsConnected` function go ahead and add the following state declaration:

```jsx
// State
const [walletAddress, setWalletAddress] = useState(null);
```

Very nice. So now that we are ready to hold some state, let's update a few things in our code here:

```jsx
import React, { useEffect, useState } from 'react';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // State
  const [walletAddress, setWalletAddress] = useState(null);

  // Actions
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            'Connected with Public Key:',
            response.publicKey.toString()
          );

          /*
           * Set the user's publicKey in state to be used later!
           */
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {};

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">🍭 Candy Drop</p>
          <p className="sub-text">NFT drop machine with fair mint</p>
          {/* Add the condition to show this only if we don't have a wallet address */}
          {!walletAddress && renderNotConnectedContainer()}
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

Lets just go over the changes really quick:

```jsx
const checkIfWalletIsConnected = async () => {
  try {
    const { solana } = window;

    if (solana) {
      if (solana.isPhantom) {
        console.log('Phantom wallet found!');
        const response = await solana.connect({ onlyIfTrusted: true });
        console.log(
          'Connected with Public Key:',
          response.publicKey.toString()
        );

        /*
         * Set the user's publicKey in state to be used later!
         */
        setWalletAddress(response.publicKey.toString());
      }
    } else {
      alert('Solana object not found! Get a Phantom Wallet 👻');
    }
  } catch (error) {
    console.error(error);
  }
};
```

I think this is pretty self explanatory. We just connected our Phantom Wallet and now received the data from the user's wallet. Now that we have that, let's go ahead and save that in our state to use later

```jsx
{/* Add the condition to show this only if we don't have a wallet address */}
{!walletAddress && renderNotConnectedContainer()}
```

Here, we're telling React to only call this render method if there is no `walletAddress` set in our state. So, if there is no wallet address that means a user has not connected their wallet and we should show them the button to connect their wallet. 

### 😅 **Okay — now actually connect to wallet lol.**

We are almost there! If you click on your spicy new button you notice it still doesn't do anything! What the heck — that's pretty lame 👎.

Remember that one function we setup, but didn't add any logic to it yet? It's time to add the connect logic to `connectWallet` :

```jsx
const connectWallet = async () => {
  const { solana } = window;

  if (solana) {
    const response = await solana.connect();
    console.log('Connected with Public Key:', response.publicKey.toString());
    setWalletAddress(response.publicKey.toString());
  }
};
```

Simple enough! When the user wants to connect their wallet — call the `connect` function on the `solana` object to handle all the fanciness of authorizing our web app with the user's wallet. Once we do that, we'll have access to the user's wallet info — for example their wallet address!

Then we're going to set the `walletAddress` property so our page will update and **remove** the Connect to Wallet button once we connect.

Go ahead and refresh your page and press your Connect to Wallet button! If all works, you should finally see the Phantom Wallet extension appear like this:

![Untitled](https://i.imgur.com/wXQyWEe.png)

Once you press connect, your button should disappear! LET'S. FREAKING. GO.

**You just connected a Solana wallet to your app. This is pretty wild.**

Now if you refresh the page your `checkIfWalletIsConnected` function will get called and your button should disappear almost immediately 🤘. In your console, you'll also see your public key printed out.

Pretty big moves right here! You have your basic UI setup and can easily "auth" a user with their Solana wallet. Easy.

Next, we are going to get all setup with the functions we need to call our Solana program + get some data going. Our web app is kinda boring/empty rn! Let's change that :).

*Note: In your Phantom settings (which you can get to by clicking the gear near the bottom right) you'll see a "Trusted Apps" section. Here, you'll see your Replit URL, or `localhost:3000` if you are running your app locally. Feel free to **revoke** this if you want to test the case of someone coming to your site that's never connected before. It'll basically reset your wallets access to the site and show the "Connect to Wallet" button again.*

### 🚨 Progress Report

*Please do this else Farza will be sad :(*

Post a screenshot in `#progress` of your console printing out your public key! Don't worry, the public key is safe to share :).