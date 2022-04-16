Now that we have access to a wallet address we can start minting character NFTs from our contract! 

This section is going to help you understand how we will be rendering each state of our app. Why don't we just break down the logic real quick:

1. If user has not connected to your app - **Show Connect To Wallet Button**
2. If user has connected to your app **AND** does not have a character NFT - **Show `SelectCharacter` Component**
3. If user has connected to your app AND does have a character NFT - **Show `Arena` Component.** The `Arena` is where users will be able to attack our boss!

Nice. So it looks like we have three different views we need to create! We are going to be getting into some pretty cool React.js that may be new to you. If you don't fully understand it - **don't worry**! Make sure to reach out to others in Discord and do some research! Remember, Google is your friend :).

### 🧱 Setting up the SelectCharacter Component.

Let's start off with creating our `SelectCharacter` Component! Head to the `src/Components/SelectCharacter` folder and create a new file named `index.js` . This directory will hold the core logic for our `SelectCharacter` component as well as it's styling! You should already see a `SelectCharacter.css` file in there with a bunch of styling! 

Oh, one thing to note - you probably see the `LoadingIndicator` component in the `Components` folder. Don't worry about that just yet, we will get to it later 🤘.

Go ahead and add the following code to the `index.js` you just created:

```javascript
import React, { useEffect, useState } from 'react';
import './SelectCharacter.css';

/*
 * Don't worry about setCharacterNFT just yet, we will talk about it soon!
 */
const SelectCharacter = ({ setCharacterNFT }) => {
  return (
    <div className="select-character-container">
      <h2>Mint Your Hero. Choose wisely.</h2>
    </div>
  );
};

export default SelectCharacter;
```

Very nice 😎. See how easy that was? You already have a component ready to go! Let's go ahead and get our conditional rendering setup so we can see this thing.

### 👁 Showing the SelectCharacter Component.

We are going to need to go back to the `App.js` file and import our newly created component. Right under where you import your `App.css` file add this line:

```javascript
import SelectCharacter from './Components/SelectCharacter';
```

You now have access to your new component! We need to add just a tad bit of fanciness here to get our component to render, though. Let's take a look at the piece of logic we are trying to account for again:

`If user has connected to your app **AND** does not have a character NFT - **Show SelectCharacter Component**`

We currently are holding state for whether someone has connected their wallet or not, but we don't have anything setup for knowing if someone has minted a character NFT yet! 

We are going to start by creating a render function named: `renderContent` . This will handle all the logic for what to render. Let's start by adding this new function right under where we declared `checkIfWalletIsConnected` :

```javascript
// Render Methods
const renderContent = () => {};
```

Great. Now that we have this setup, we can start adding our logic for the two scenarios we are ready to handle:

1. If user has has not connected to your app - **Show Connect To Wallet Button**
2. If user has connected to your app **AND** does not have a character NFT - **Show `SelectCharacter` Component**

```javascript
// Render Methods
const renderContent = () => {
  /*
   * Scenario #1
   */
  if (!currentAccount) {
    return (
      <div className="connect-wallet-container">
        <img
          src="https://64.media.tumblr.com/tumblr_mbia5vdmRd1r1mkubo1_500.gifv"
          alt="Monty Python Gif"
        />
        <button
          className="cta-button connect-wallet-button"
          onClick={connectWalletAction}
        >
          Connect Wallet To Get Started
        </button>
      </div>
    );
    /*
     * Scenario #2
     */
  } else if (currentAccount && !characterNFT) {
    return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
  }
};
```

**Oh snap 😅.** Your app is probably yelling at you that `characterNFT` and `setCharacterNFT`  are `undefined`. If you think about it, we never setup any state variables for this! This is a really easy fix - just add another state variable in `App.js`:

```javascript
// State
const [currentAccount, setCurrentAccount] = useState(null);

/*
 * Right under current account, setup this new state property
 */
const [characterNFT, setCharacterNFT] = useState(null);
```

***VERY NICE.*** We are so close. One more thing to get this thing working perfectly ✨ - **calling the render method!** This is as simple as replacing our button in our HTML with our render method. It should look something like this:

```javascript
return (
  <div className="App">
    <div className="container">
      <div className="header-container">
        <p className="header gradient-text">⚔️ Metaverse Slayer ⚔️</p>
        <p className="sub-text">Team up to protect the Metaverse!</p>
        {/* This is where our button and image code used to be!
         *	Remember we moved it into the render method.
         */}
        {renderContent()}
      </div>
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
```

Note: Remember to import SelectCharacter by adding this line to the top of your file:

`import SelectCharacter from './Components/SelectCharacter';`

### 🥵 Make sure stuff is working!

We've done a lot! At this point, let's make sure both methods are working:

**Scenario #1**

The first scenario is the user has has not connected to our app w/ their wallet — so show them the connect to wallet button!

Note: Make sure your wallet is not connected to your app from a past project. To do this, click your MetaMask extension and click on the three dots on the right. You should then see "Connected sites". Go ahead and click that. You should see `[localhost:3000](http://localhost:3000)` with a trash can icon next to it. Just click the trash can icon to remove your wallet address connection from your app. 

![Untitled](https://i.imgur.com/zPAVBYb.png)

Go ahead and refresh your page and and you should see your "Connect To Wallet" button ready to go! Go ahead and connect! Once you do, your console should print out the word `Connected` and then your wallet's public address!

![Untitled](https://i.imgur.com/LvoDEBK.png)

Nice - Scenario #1 **IS A GO.**

**Scenario #2**

Go ahead and connect your wallet! Once your wallet is connected you should see your app render something that looks like this:

![Untitled](https://i.imgur.com/K3kvxeE.png)

**BOOM.** Very nice work! You just created a component in React, setup some smooth condition rendering, ***AND*** got your wallet sign in setup and ready to go! With buildspace projects, it's all about making it your own. Feel free to do whatever the heck you want with these pages!

In the next section we are going to start interacting with our contract to see if the wallet address connected has already minted a character NFT! This will unlock us to do the following:

1. Write the logic to actually mint a Character NFT 
2. Setup our `Arena` component so we can take down any boss in our way 😈


🚨 Progress update
------------------------
In #progress, post a screenshot of the output of your console showing off your "Connected" Ethereum wallet message! Big deal you got this working. Basic connect wallet stuff is core to the magic of web3!
