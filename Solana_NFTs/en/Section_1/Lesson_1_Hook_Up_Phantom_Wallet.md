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

Head over to your code and go to `App.js` under `src`. This is where the main entry point of our app will be.

If you have the Phantom Wallet extension installed, it will automatically inject a special object named `solana` into your `window` object that has some magical functions. This means before we do anything, we need to check to see if this exists. If it doesn't exist, let's tell our user to go download it:

```jsx
import React, { useEffect } from 'react';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // Actions

  /*
  * Declare your function
  */
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana && solana.isPhantom) {
          console.log('Phantom wallet found!');
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
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
          <p className="header">🍭 Candy Drop</p>
          <p className="sub-text">NFT drop machine with fair mint</p>
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
  try {
    const { solana } = window;

    if (solana && solana.isPhantom) {
        console.log('Phantom wallet found!');
    } else {
      alert('Solana object not found! Get a Phantom Wallet 👻');
    }
  } catch (error) {
    console.error(error);
  }
};
```

Our function here is checking the `window` object in our DOM to see if the Phantom Wallet extension has injected the `solana` object. If we do have a `solana` object, we can also check to see if it's a Phantom Wallet.

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

In React, the `useEffect` hook gets called once on component mount when that second parameter (the `[]`) is empty! So, this is perfect for us. As soon as someone goes to our app, we can check to see if they have Phantom Wallet installed or not. This will be **very important** soon.

Currently, the Phantom Wallet team suggests to wait for the window to fully finish loading before checking for the `solana` object. Once this event gets called, we can guarantee that this object is available if the user has the Phantom Wallet extension installed.

### 🔒 Accessing the user's account

So when you run this, you should see that line *"Phantom wallet found!"* printed in the console of the website when you go to inspect it.

![Untitled](https://i.imgur.com/uyGcSJ4.png)

_For additional instructions on getting your app running, refer to `README.md` at the root of your project._

**NICE.**

Next, we need to actually check if we're **authorized** to actually access the user's wallet. Once we have access to this, we can start getting access to the functions in our Solana program 🤘.

Basically, **Phantom Wallet doesn't just give our wallet information to every website we go to**. It only gives it to websites we authorize. So far, we have **not** given Phantom explicit access to share our wallet's info.

The first thing we need to do is check if a user has given us permission to use their wallet on our site — this is sorta like checking if our user is "logged in". All we need to do is add one more line to our `checkIfWalletIsConnected` function. Check out the code below:

```jsx
const checkIfWalletIsConnected = async () => {
  try {
    const { solana } = window;

    if (solana && solana.isPhantom) {
        console.log('Phantom wallet found!');

        /*
         * The solana object gives us a function that will allow us to connect
         * directly with the user's wallet!
         */
        const response = await solana.connect({ onlyIfTrusted: true });
        console.log(
          'Connected with Public Key:',
          response.publicKey.toString()
        );
    } else {
      alert('Solana object not found! Get a Phantom Wallet 👻');
    }
  } catch (error) {
    console.error(error);
  }
};
```

It's as simple as calling `connect` which tells Phantom Wallet that our NFT website is authorized to access information about that wallet! Some of you may be asking what this `onlyIfTrusted` property is.

If a user has already connected their wallet with your app, this flag will immediately pull their data without prompting them with another connect popup! Pretty nifty, eh? Curious to know more - [take a look at this doc](https://docs.phantom.app/integrating/establishing-a-connection#eagerly-connecting) from Phantom!

And that's it!

*At this point you should still only be seeing the "Phantom wallet found!"* log statement in your console!

Don't worry if you're seeing the "User Rejected Request" error in the console. It is totally expected at this point of the project ;), It's there because we added that `onlyIfTrusted: true` parameter inside the `connect` method.
It will make the Phantom wallet reject the user's connection request for now (as the error's name suggests 😁).

Why is that? Well, the `connect` method with `onlyIfTrusted` parameter set to `true` will only run **if** the user has already authorized a connection between their wallet and the web app. **Which they've never done so far.** Let's do that next :).

### 🚨 Progress Report

*Please do this else Farza will be sad :(*

Post a screenshot in `#progress` showing off the that message "Phantom wallet found" in your console. May seem simple, but, not many people know how to do this stuff! It's epic.
