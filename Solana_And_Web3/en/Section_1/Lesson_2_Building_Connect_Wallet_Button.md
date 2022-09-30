### 👛 Installing Phantom Wallet Extension

For this project we are going to be using a wallet called [Phantom](https://phantom.app/).

This is one of the top wallet extensions for Solana and is actually backed by Solana as well (so you know it's legit).

Before we dive into any code - make sure you have downloaded the extension and setup a Solana wallet! Currently, Phantom Wallet supports **Chrome**, **Brave**, **Firefox**, and **Edge.** But, as a note: we only tested this code on Brave and Chrome.

### 👻 Using the Solana object

In order for our website to talk to our Solana program, we need to somehow connect our wallet (which is the Phantom Wallet extension) to it.

Once we connect our wallet to our website, our website will have permission to run functions from our program, on our behalf. If our users don't connect their wallet, they simply can't communicate with the Solana blockchain.

**Remember, it's just like authenticating into a website.** If you aren't "logged in" to G-Mail, then you can't use their email product!

Head over to your code and go to `App.js` under `src`. This is where the main entry point of our app will be.

If you have the Phantom Wallet extension installed, it will automatically inject a special object named `solana` into your `window` object that has some magical functions. This means before we do anything, we need to check to see if this exists. If it doesn't exist, let's tell our user to go download it:

```jsx
/*
 * We are going to be using the useEffect hook!
 */
import React, { useEffect } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Change this up to be your Twitter if you want.
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  /*
   * This function holds the logic for deciding if a Phantom Wallet is
   * connected or not
   */
  const checkIfWalletIsConnected = async () => {
  // We're using optional chaining (question mark) to check if the object is null
    if (window?.solana?.isPhantom) {
      console.log('Phantom wallet found!');
    } else {
      alert('Solana object not found! Get a Phantom Wallet 👻');
    }
  };

  /*
   * When our component first mounts, let's check to see if we have a connected
   * Phantom Wallet
   */
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
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
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
const checkIfWalletIsConnected = async () => {
    if (window?.solana?.isPhantom) {
      console.log('Phantom wallet found!');
    } else {
      alert('Solana object not found! Get a Phantom Wallet 👻');
    }
  };
```

Our function here is checking the `window` object in our DOM to see if the Phantom Wallet extension has injected the `solana` object. If we do have a `solana` object, we can also check to see if it's a Phantom Wallet.

Since we have tested this project fully with Phantom Wallets, we recommend sticking with that. Nothing is stopping you with exploring or supporting other wallets, though 👀.

```jsx
useEffect(() => {
  const onLoad = async () => {
    await checkIfWalletIsConnected();
  };
  window.addEventListener('load', onLoad);
  return () => window.removeEventListener('load', onLoad);
}, []);
```

Finally, we just need to call this thing!

In React, the `useEffect` hook gets called once on component mount when that second parameter (the `[]`) is empty! So, this is perfect for us. As soon as someone goes to our app, we can check to see if they have Phantom Wallet installed or not. This will be **very important** soon.

Currently, the Phantom Wallet team suggests to wait for the window to fully finish loading before checking for the `solana` object. Once this event gets called, we can guarantee that this object is available if the user has the Phantom Wallet extension installed.

### 🔒 Accessing the user's account

So when you run this, you should see that line *"Phantom wallet found!"* printed in the console of the website when you go to inspect it.

![Untitled](https://i.imgur.com/MZQlPl5.png)

**NICE.**

Next, we need to actually check if we're **authorized** to actually access the user's wallet. Once we have access to this, we can start getting access to the functions in our Solana program 🤘.

Basically, **Phantom Wallet doesn't just give our wallet credentials to every website we go to**. It only gives it to websites we authorize. Again, it's just like logging in! But, what we're doing here is **checking if we're "logged in".**

All we need to do is add one more line to our `checkIfWalletIsConnected` function. Check out the code below:

```jsx
const checkIfWalletIsConnected = async () => {
  if (window?.solana?.isPhantom) {
    console.log('Phantom wallet found!');
    /*
    * The solana object gives us a function that will allow us to connect
    * directly with the user's wallet
    */
    const response = await window.solana.connect({ onlyIfTrusted: true });
    console.log(
      'Connected with Public Key:',
      response.publicKey.toString()
    );
  } else {
    alert('Solana object not found! Get a Phantom Wallet 👻');
  }
};
```

It's as simple as calling `connect` which tells Phantom Wallet that our GIF Portal is authorized to access information about that wallet! Some of you may be asking what this `onlyIfTrusted` property is.

If a user has already connected their wallet with your app, this flag will immediately pull their data without prompting them with another connect popup! Pretty nifty, eh? Curious to know more - [take a look at this doc](https://docs.phantom.app/integrating/establishing-a-connection#eagerly-connecting) from Phantom!

Heck ya that's it. *At this point you should still only be seeing the "Phantom wallet found!"* log statement!

Why is that? Well, the `connect` method will only run **if** the user has already authorized a connection to your app. **Which they've never done so far.**

So, let's actually initialize this connection!

### 🛍 Render connect to wallet button

Alright, we are already checking to see if a user is already connected to our app or not. What if they aren't connected? We have no way in our app to prompt Phantom Wallet to connect to our app!

We need to create a `connectWallet` button. In the world of web3, connecting your wallet is literally a "Sign Up/Login" button built into one for your user.

Ready for the easiest "Sign Up" experience of your life :)? Check it out:

```jsx
import React, { useEffect } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // Actions
  const checkIfWalletIsConnected = async () => {
    if (window?.solana?.isPhantom) {
      console.log('Phantom wallet found!');
      const response = await window.solana.connect({ onlyIfTrusted: true });
      console.log(
        'Connected with Public Key:',
        response.publicKey.toString()
      );
    } else {
      alert('Solana object not found! Get a Phantom Wallet 👻');
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

  // UseEffects
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
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
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

![Untitled](https://i.imgur.com/TmZWnqn.png)

The biggest thing to understand here are **render methods.**

*Note: if you're already familiar w/ React and render methods feel free to blaze through this section.*

These are **just functions that return some UI code.** We only want our "Connect to Wallet" button to render when someone hasn't actually connected their wallet to our app. 

You may be thinking now - "*how does our app control when to render or not render this button?".*

***GREAT POINT***. We are going to need to use a person's wallet to interact with our program later down the line. So, why don't we store this wallet data in some React state? **Then** we could also use that as the flag to determine if we should show or hide our button!

First you will need to import `useState` into your component like so:

```jsx
import React, { useEffect, useState } from 'react';
```

Then, right above your `checkIfWalletIsConnected` function go ahead and add the following state declaration:

```jsx
// State
const [walletAddress, setWalletAddress] = useState(null);
```

Very nice. So now that we are ready to hold some state, let's update a few things in our code here:

```jsx
import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // State
  const [walletAddress, setWalletAddress] = useState(null);

  // Actions
  const checkIfWalletIsConnected = async () => {
    if (window?.solana?.isPhantom) {
      console.log('Phantom wallet found!');
      const response = await window.solana.connect({ onlyIfTrusted: true });
      console.log(
        'Connected with Public Key:',
        response.publicKey.toString()
      );

      /*
       * Set the user's publicKey in state to be used later!
       */
      setWalletAddress(response.publicKey.toString());
    } else {
      alert('Solana object not found! Get a Phantom Wallet 👻');
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

  // UseEffects
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return (
    <div className="App">
			{/* This was solely added for some styling fanciness */}
			<div className={walletAddress ? 'authed-container' : 'container'}>
        <div className="header-container">
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
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

Look at all this fancy React. Hype. Lets just go over the changes really quick:

```jsx
const checkIfWalletIsConnected = async () => {
  if (window?.solana?.isPhantom) {
    console.log('Phantom wallet found!');
    const response = await window.solana.connect({ onlyIfTrusted: true });
    console.log(
      'Connected with Public Key:',
      response.publicKey.toString()
    );

    /*
     * Set the user's publicKey in state to be used later!
     */
    setWalletAddress(response.publicKey.toString());
  } else {
    alert('Solana object not found! Get a Phantom Wallet 👻');
  }
};
```

I think this is pretty self explanatory. We just connected our Phantom Wallet and now received the data from the user's wallet. Now that we have that, let's go ahead and save that in our state to use later. 

```jsx
{/* Add the condition to show this only if we don't have a wallet address */}
{!walletAddress && renderNotConnectedContainer()}
```

This is a pretty cool piece of code. We are telling React to only call this render method if there is no `walletAddress` set in our state. This is called [**conditional rendering**](https://reactjs.org/docs/conditional-rendering.html) and it will help us keep track of the different states we want to show in our app!

```jsx
{/* This was solely added for some styling fanciness */}
<div className={walletAddress ? 'authed-container' : 'container'}>
```

Now that we have seen some conditional rendering, this hopefully makes a bit of sense! We want to change some of our CSS styles based on whether we have a `walletAddress` or not! You will see the difference here in the next section when we build out the GIF grid.

### 🔥 Okay — now ACTUALLY connect to wallet lol

We are almost there! If you click on your spicy new button you notice it still doesn't do anything! What the heck — that's pretty lame 👎. 

Remember that one function we setup, but didn't add any logic to it yet? It's time to add the connect logic to `connectWallet` :

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

Simple enough! Call the `connect` function on the `solana` object to handle all the fanciness of authorizing our GIF Portal with the user's wallet. Then we are going to set the `walletAddress` property so our page will update and remove the Connect to Wallet button.

Go ahead and refresh your page and press your Connect to Wallet button! If all works, you should finally see the Phantom Wallet extension appear like this:

![https://i.imgur.com/XhaYIuk.png](https://i.imgur.com/XhaYIuk.png)

Once you press connect, your button should disappear! LET'S. FREAKING. GO.

**You just connected a Solana wallet to your app. This is pretty wild.**

Now if you refresh the page your `checkIfWalletIsConnected` function will get called and your button should disappear almost immediately 🤘.

Pretty big moves right here!

You have your basic UI setup and can easily "auth" a user with their Solana wallet. EZPZ.

Next, we are going to get all setup with the functions we need to call our Solana program + get some data going. Our web app is kinda boring/empty rn! Let's change that :).

*Note: In your Phantom settings (which you can get to by clicking the gear near the bottom right) you'll see a "Trusted Apps" section. Here, you'll see your Replit URL, or `localhost:3000` if you are running your app locally. Feel free to revoke this if you want to test the case of someone coming to your site that's never connected before. It'll basically reset your wallets access to this site.*

### 🚨 Progress Report

*Please do this else Farza will be sad :(*

Post a screenshot of your console in `#progress` showing off your public key w/ your connected wallet. Don't worry, you can share your public key. That's why it's "public" ;).
