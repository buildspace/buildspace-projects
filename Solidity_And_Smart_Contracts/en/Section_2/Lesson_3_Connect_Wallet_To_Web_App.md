## 🌅 Using window.ethereum()

So, in order for our website to talk to the blockchain, we need to somehow connect our wallet to it. Once we connect our wallet to our website, our website will have permissions to call smart contracts on our behalf. Remember, it's just like authenticating in to a website.

Head over to Replit and go to `App.jsx` under `src`, this is where we'll be doing all our work.

If we have Metamask browser extension wallet installed, it will automatically inject a special object named `ethereum` into our window. Let's check if we have that first.

```javascript
import React, { useEffect } from "react";
import "./App.css";

const getEthereumObject = () => window.ethereum;

const App = () => {
  /*
   * The passed callback function will be run when the page loads.
   * More technically, when the App component "mounts".
   */
  useEffect(() => {
    const ethereum = getEthereumObject();
    if (!ethereum) {
      console.log("Make sure you have metamask!");
    } else {
      console.log("We have the ethereum object", ethereum);
    }
  }, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          👋 Hey there!
        </div>

        <div className="bio">
          I am Farza and I worked on self-driving cars so that's pretty cool
          right? Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={null}>
          Wave at Me
        </button>
      </div>
    </div>
  );
};

export default App;
```

## 🔒 See if we can access the users account

So when you run this, you should see that line "We have the ethereum object" printed in the console of the website when you go to inspect it. If you are using Replit, make sure you're looking at the console of your project website, not the Replit workspace! You can access the console of your website by opening it in its own window/tab and launching the developer tools. The URL should look something like this - `https://waveportal-starter-project.yourUsername.repl.co/`

**NICE.**

Next, we need to actually check if we're authorized to actually access the user's wallet. Once we have access to this, we can call our smart contract!

Basically, Metamask doesn't just give our wallet credentials to every website we go to. It only gives it to websites we authorize. Again, it's just like logging in! But, what we're doing here is **checking if we're "logged in".**

Check out the code below.

```javascript
import React, { useEffect, useState } from "react";
import "./App.css";

const getEthereumObject = () => window.ethereum;

/*
 * This function returns the first linked account found.
 * If there is no account linked, it will return null.
 */
const findMetaMaskAccount = async () => {
  try {
    const ethereum = getEthereumObject();

    /*
    * First make sure we have access to the Ethereum object.
    */
    if (!ethereum) {
      console.error("Make sure you have Metamask!");
      return null;
    }

    console.log("We have the Ethereum object", ethereum);
    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      return account;
    } else {
      console.error("No authorized account found");
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");

  /*
   * The passed callback function will be run when the page loads.
   * More technically, when the App component "mounts".
   */
  useEffect(() => {
    findMetaMaskAccount().then((account) => {
      if (account !== null) {
        setCurrentAccount(account);
      }
    });
  }, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          👋 Hey there!
        </div>

        <div className="bio">
          I am Farza and I worked on self-driving cars so that's pretty cool
          right? Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={null}>
          Wave at Me
        </button>
      </div>
    </div>
  );
};

export default App;
```

So, we use that special method `eth_accounts` to see if we're authorized to access any of the accounts in the user's wallet. One thing to keep in mind is that the user could have multiple accounts in their wallet. In this case, we just grab the first one.

## 💰 Build a connect wallet button

When you run the above code, the console.log that prints should be `No authorized account found`. Why? Well because we never explicitly told Metamask, "hey Metamask, please give this website access to my wallet". 

We need to create a `connectWallet` button. In the world of Web3, connecting your wallet is literally a "Login" button for your user :). Check it out:

```javascript
import React, { useEffect, useState } from "react";
import "./App.css";

const getEthereumObject = () => window.ethereum;

/*
 * This function returns the first linked account found.
 * If there is no account linked, it will return null.
 */
const findMetaMaskAccount = async () => {
  try {
    const ethereum = getEthereumObject();

    /*
     * First make sure we have access to the Ethereum object.
     */
    if (!ethereum) {
      console.error("Make sure you have Metamask!");
      return null;
    }

    console.log("We have the Ethereum object", ethereum);
    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      return account;
    } else {
      console.error("No authorized account found");
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");

  const connectWallet = async () => {
    try {
      const ethereum = getEthereumObject();
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  /*
   * This runs our function when the page loads.
   * More technically, when the App component "mounts".
   */
  useEffect(async () => {
    const account = await findMetaMaskAccount();
    if (account !== null) {
      setCurrentAccount(account);
    }
  }, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          👋 Hey there!
        </div>

        <div className="bio">
          I am Farza and I worked on self-driving cars so that's pretty cool
          right? Connect your Ethereum wallet and wave at me!
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
};

export default App;
```

Our code is getting a little long here, but you can see how short our `connectWallet` function is. In this case, I use the `eth_requestAccounts` function because I'm literally asking Metamask to give me access to the user's wallet.

On line 90, I also added a button so we can call our `connectWallet` function. You'll notice I only show this button if we don't have `currentAccount`. If we already have currentAccount, then that means we already have access to an authorized account in the user's wallet.

## 🌐 Connect!

Now, it's time for the magic! Check out the video below:
[Loom](https://www.loom.com/share/1d30b147047141ce8fde590c7673128d?t=0)

## 🚨 Required: Before you click "Next Lesson"

We just did a lot in the last two lessons. Any questions? Be sure to ask in #section-2-help!
