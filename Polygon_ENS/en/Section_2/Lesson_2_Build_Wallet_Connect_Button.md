*Note: if you’ve done projects with us in the past, feel free to speed through this!*

### 🌅 Using the Ethereum object

**NOW** it’s go time 😎. As part of any proper web3 app, we need a way to get access to a person’s public address - **but why is that?**

In order for our website to talk to the blockchain, we need to somehow connect our wallet to it. Once we connect our wallet to our website, our website will have permission to call smart contracts on our behalf. **Remember, it's just like authenticating into a website.**

Head over to `App.js` under `src`, this is where we'll be doing all our work.

If you’re logged into MetaMask, it will automatically inject a special object named `ethereum` into our window that has some magical methods. Let's check if we have that first. 

**Note: MetaMask injects the `ethereum` object even if we’re on a different network like Polygon.**

```jsx
import React, { useEffect } from "react";
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {

  // Gotta make sure this is async.
  const checkIfWalletIsConnected = () => {
    // First make sure we have access to window.ethereum
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have MetaMask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }
  }

  // Create a function to render if wallet is not connected yet
  const renderNotConnectedContainer = () => (
    <div className="connect-wallet-container">
      <img src="https://media.giphy.com/media/3ohhwytHcusSCXXOUg/giphy.gif" alt="Ninja gif" />
      <button className="cta-button connect-wallet-button">
        Connect Wallet
      </button>
    </div>
    );

  // This runs our function when the page loads.
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <header>
            <div className="left">
            <p className="title">🐱‍👤 Ninja Name Service</p>
            <p className="subtitle">Your immortal API on the blockchain!</p>
            </div>
          </header>
        </div>

        {/* Add your render method here */}
        {renderNotConnectedContainer()}

        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a className="footer-text" 
            href={TWITTER_LINK} 
            target="_blank"
            rel="noreferrer">
              {`built with @${TWITTER_HANDLE}`}
          </a>
        </div>
      </div>
    </div>
  );
};

export default App;
```

Nice! You now have some logic that runs when your app starts to check to see if someone has the MetaMask extension installed or not! If you refresh your app you should see - “We have the Ethereum object" printed out in your console (if you have MetaMask installed)!

If you’re using Replit, make sure you're looking at the console of your project website, not the Replit workspace! You can access the console of your website by opening it in its own window/tab and launching the developer tools. The URL should look something like this - `https://domain-starter-project.yourUsername.repl.co/`

Take time here to customize the page to your liking. Go to [https://giphy.com/](https://giphy.com/) and find a gif that fits your domain. I went with a ninja gif obv:

![https://i.imgur.com/lyR6lsj.png](https://i.imgur.com/lyR6lsj.png)

### 🔒 See if we can access the user’s account

**NICE.** Next, we need to actually check if we're authorized to actually access the user's wallet. Once we have access to this, we can call our smart contract!

MetaMask doesn't just give our wallet credentials to every website we go to. That would be wack. It only gives it to websites we authorize. Again, it's just like logging in! But, what we're doing here is **checking if we're "logged in".**

Check out the code below, I’ve updated the `checkIfWalletIsConnected` function and added a stateful React variable called `currentAccount` with `useState`. Again, I’ve left comments for stuff I’ve changed.

```jsx
// Make sure to import useState
import React, { useEffect, useState } from "react";
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';

const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  //Just a state variable we use to store our user's public wallet. Don't forget to import useState at the top.
  const [currentAccount, setCurrentAccount] = useState('');
  
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log('Make sure you have metamask!');
      return;
    } else {
      console.log('We have the ethereum object', ethereum);
    }

    // Check if we're authorized to access the user's wallet
    const accounts = await ethereum.request({ method: 'eth_accounts' });

    // Users can have multiple authorized accounts, we grab the first one if its there!
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log('Found an authorized account:', account);
      setCurrentAccount(account);
    } else {
      console.log('No authorized account found');
    }
  };

  // Render Methods
  const renderNotConnectedContainer = () => (
    <div className="connect-wallet-container">
      <img src="https://media.giphy.com/media/3ohhwytHcusSCXXOUg/giphy.gif" alt="Ninja gif" />
      <button className="cta-button connect-wallet-button">
        Connect Wallet
      </button>
    </div>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <header>
            <div className="left">
              <p className="title">🐱‍👤 Ninja Name Service</p>
              <p className="subtitle">Your immortal API on the blockchain!</p>
            </div>
          </header>
        </div>

        {renderNotConnectedContainer()}

        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
```

The connect button will not do anything and you should see `No authorized account found` in the console. This is because we never explicitly told MetaMask, *"hey MetaMask, please give this website access to my wallet".*

Let’s work on getting permission from the user to access their wallet next!

### 🛍 Connect to the user’s wallet

In the world of Web3, connecting your wallet is literally a "Login" button for your user. We send a request to MetaMask to give us read-only access to the users’ wallet.

Ready for the easiest "login" experience for your life :)? Check it out:

```jsx
import React, { useEffect, useState } from "react";
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState('');
    
  // Implement your connectWallet method here
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask -> https://metamask.io/");
        return;
      }

      // Fancy method to request access to account.
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    
      // Boom! This should print out public address once we authorize Metamask.
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log('Make sure you have metamask!');
      return;
    } else {
      console.log('We have the ethereum object', ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log('Found an authorized account:', account);
      setCurrentAccount(account);
    } else {
      console.log('No authorized account found');
    }
  };

  // Render Methods
  const renderNotConnectedContainer = () => (
    <div className="connect-wallet-container">
      <img src="https://media.giphy.com/media/3ohhwytHcusSCXXOUg/giphy.gif" alt="Ninja donut gif" />
      {/* Call the connectWallet function we just wrote when the button is clicked */}
      <button onClick={connectWallet} className="cta-button connect-wallet-button">
        Connect Wallet
      </button>
    </div>
  );
  
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <header>
            <div className="left">
              <p className="title">🐱‍👤 Ninja Name Service</p>
              <p className="subtitle">Your immortal API on the blockchain!</p>
            </div>
          </header>
        </div>
        
        {/* Hide the connect button if currentAccount isn't empty*/}
        {!currentAccount && renderNotConnectedContainer()}

        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
```

Make sure you remember to update the `Connect Wallet` button to actually call the `connectWallet`  function we just wrote.

To recap what we’ve done with our app so far: 

1. Checked if the user has the MetaMask extension installed 
2. If they do, request permissions to read their account addresses and balances when the connect button is clicked.

Nice! Go ahead and test that fancy button out! MetaMask should prompt you to “Connect With MetaMask” and once you connect your wallet, the connect button should disappear and your console should print out “Connected SOME_WALLET_ADDRESS”

![https://i.imgur.com/wzMPQH8.png](https://i.imgur.com/wzMPQH8.png)

### 🚨Progress report

*Please do this else Raza will be sad :(*

Post a screenshot of your website in #progress!
