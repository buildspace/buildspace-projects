### ✅ Running a test on devnet

I actually like to run an `anchor test` at this point before I start integrating my web app. This could potentially save us from some random, annoying errors.

Because our config is set to devnet, Anchor will actually run our tests directly on the devnet which is exactly what we want. That way we can make sure our actual functions are working properly on devnet!

Go ahead run it using:

```bash
anchor test
```

As long as nothing crashed and it's showing you something like:

```bash
Deploy success
🚀 Starting test...
📝 Your transaction signature 41aW8pAtFLyxgg1S54EATUSKSXB9LKe1qSGgLvuy3Fh58vWgiHuXK8jsrtRy5Spm32xCytXoNyJTMKVpa4ZHcnEB
👀 GIF Count 0
👀 GIF Count 1
👀 GIF List [
  {
    gifLink: 'insert_a_giphy_link_here',
    userAddress: PublicKey {
      _bn: <BN: 368327095334a46e8bf98ccfd43f4662111b633d3989f6f9df869306bcc64458>
    }
  }
```

Then you're good to go.

What's actually interesting here is if you go to the [Solana Explorer](https://explorer.solana.com/?cluster=devnet) and paste in your program id (just like you did before) you'll see some new transactions there. These were caused by the test you just ran! Feel free to check them out.

I should mention something super important here. When you ran `anchor test` just now, it'll actually re-deploy the program and then run all the functions on the script.

You may be asking yourself, "Why did it re-deploy? Why isn't it just talking to the program already deployed? Also, if we re-deployed wouldn't it have been deployed to a completely different program id?".

**So — Solana programs are [upgradeable](https://docs.solana.com/cli/deploy-a-program#redeploy-a-program).** That means when we re-deploy we're updating the same program id to point to the latest version of the program we deployed. And, what's cool here is the *accounts* that the programs talk to will stick around — remember, these accounts keep data related to the program.

**That means we can upgrade programs while keeping the data piece separate**. Pretty cool, right :)?

*Note: this is **very very** different from Ethereum where you can never change a smart contract once it's deployed!*

### 🤟 Hooking up our IDL file to the web app

So, we now have a deployed Solana program. Let's connect it up to our web app :).

The first thing we need is the `idl` file that was magically output by `anchor build` earlier without you knowing. You should see it in `target/idl/myepicproject.json`.

The `idl` file is actually just a JSON file that has some info about our Solana program like the names of our functions and the parameters they accept. This helps our web app actually know how to interact w/ our deployed program.

You'll also see near the bottom it has our program id! This is how our web app will know what program to actually connect to. There are *millions* of programs deployed on Solana and this address is how our web app can get quick access to our program specifically.

![Untitled](https://i.imgur.com/bnorlgJ.png)

*Note: if you don't see the idl file or you don't see an "address" parameter near the bottom, then something has gone wrong! Start again from the "Deploy program to the devnet" section of the project.*

Go ahead and copy all the content in `target/idl/myepicproject.json`.

Head over to your web app.

In the `src` directory of your react app **create an empty file** named `idl.json`. It should be in the same directory as `App.js`. So for me, I have the file at `app/src/idl.json`. Once you create the file, paste the content of `target/idl/myepicproject.json` into your newly created `app/src/idl.json`.

Finally, in `App.js`, go ahead and drop this in as an import:

```javascript
import idl from './idl.json';
```

Nice!! 

### 🌐 Change the network Phantom connects to

Right now, Phantom is probably connected to the Solana Mainnet. We need it to connect to the Solana Devnet. You can change this by going to the settings (click the little gear on the bottom right) , click "Change Network", and then click "Devnet". That's it!

![Untitled](https://i.imgur.com/JWHwPJX.png)

### 👻 Fund Phantom wallet

We also need to fund our Phantom wallet w/ some fake SOL. **Reading** **data** on accounts on Solana is free. But doing things like creating accounts and adding data to accounts costs SOL.

You'll need the public address associated w/ your Phantom wallet which you can grab at the top by clicking your address:

![Screen Shot 2021-11-03 at 12.31.15 PM.png](https://i.imgur.com/3I2Wjv3.png)

Now, go ahead and run this from your terminal.

```bash
solana airdrop 2 INSERT_YOUR_PHANTOM_PUBLIC_ADDRESS_HERE  --url devnet
```

Now, when you go back to your Phantom wallet you should have 2 SOL associated w/ your devnet wallet. Nice :).

### 🍔 Setup a Solana `provider` on our web app

In your web app, we'll need to install two packages. You may remember installing these for your Anchor project, we'll also be using them in our web app :).

```bash
npm install @project-serum/anchor @solana/web3.js
```

*Note: If you're on Replit you should have these already pre-installed. If you don't and start getting errors later, you can install packages by clicking "Shell" and then running commands like in a normal terminal. They also have a fancy "Packages" installer on the left sidebar.*

Before we can interact with the packages that we installed earlier, we need to import them into our web app! Add the following lines of code at the top of App.js:

```javascript
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';
```

*Note (only for Replit users):*  
*1. If you get an error `global is not defined`, change the vite.config.js into:*
```javascript
import reactRefresh from '@vitejs/plugin-react-refresh';
import { defineConfig } from "vite";
/**
 * https://vitejs.dev/config/
 * @type { import('vite').UserConfig }
 */
export default defineConfig({
  define: {
    global: {},
    process: {
      'env': {}
    } 
  },
  plugins: [reactRefresh()],
  server: {
    host: '0.0.0.0',
    hmr: {
      port: 443,
    }
  }
})
```

*2. If you get an error related to `buffer`, add it to `App.jsx`:*
```javascript
import { Buffer } from 'buffer';
window.Buffer = Buffer;
```

Let's create a function called `getProvider`. Add this right below `onInputChange` . Here's the code below.

```javascript
const getProvider = () => {
  const connection = new Connection(network, opts.preflightCommitment);
  const provider = new Provider(
    connection, window.solana, opts.preflightCommitment,
  );
  return provider;
}
```

This of course will throw a bunch of errors since we have none of the variables lol. But, this is basically us creating a `provider` which is an **authenticated connection to Solana**. Notice how `window.solana` is needed here!

Why? Because to make a `provider` we need a connected wallet. **You already did this earlier** when you click "Connect" on Phantom which gave it permission to give our web app access to our wallet.

![https://i.imgur.com/vOUldRN.png](https://i.imgur.com/vOUldRN.png)

**You can't communicate with Solana at all unless you have a connected wallet. We can't even retrieve data from Solana unless we have a connected wallet!**

This is a big reason Phantom is helpful. It gives our users a simple, secure way to connect their wallet to our site so we can create a `provider` that lets us talk to programs on Solana :).

Lets create some variables we're missing. We'll also need to import some stuff. 

Go ahead and add this code in:

```javascript
import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import { Connection, PublicKey, clusterApiUrl} from '@solana/web3.js';
import {
  Program, Provider, web3
} from '@project-serum/anchor';

import idl from './idl.json';

// SystemProgram is a reference to the Solana runtime!
const { SystemProgram, Keypair } = web3;

// Create a keypair for the account that will hold the GIF data.
let baseAccount = Keypair.generate();

// Get our program's id from the IDL file.
const programID = new PublicKey(idl.metadata.address);

// Set our network to devnet.
const network = clusterApiUrl('devnet');

// Controls how we want to acknowledge when a transaction is "done".
const opts = {
  preflightCommitment: "processed"
}

// All your other Twitter and GIF constants you had.

const App = () => {
	// All your other code.
}
```

All pretty straightforward and things will make more sense as we start using these variables later. 

`SystemProgram` is a reference to the [core program](https://docs.solana.com/developing/runtime-facilities/programs#system-program) that runs Solana we already talked about. `Keypair.generate()` gives us some parameters we need to create the `BaseAccount` account that will hold the GIF data for our program.

Then, we use `idl.metadata.address` to get our program's id and then we specify that we want to make sure we connect to devnet by doing `clusterApiUrl('devnet')`.

This `preflightCommitment: "processed"` thing is interesting. You can read on it a little [here](https://solana-labs.github.io/solana-web3.js/modules.html#Commitment). Basically, we can actually choose *when* to receive a confirmation for when our transaction has succeeded. Because the blockchain is fully decentralized, we can choose how long we want to wait for a transaction. Do we want to wait for just one node to acknowledge our transaction? Do we want to wait for the whole Solana chain to acknowledge our transaction?

In this case, we simply wait for our transaction to be confirmed by the *node we're connected to*. This is generally okay — but if you wanna be super super sure you may use something like `"finalized"` instead. For now, let's roll with `"processed"`.

### 🏈 Retrieve GIFs from our program's account

It's actually super simple now to call our program now that we have everything set up. It's a simple `fetch` to get the account — similar to how you'd call an API. Remember this chunk of code?

```javascript
useEffect(() => {
  if (walletAddress) {
    console.log('Fetching GIF list...');

    // Call Solana Program

    // Set state
    setGifList(TEST_GIFS);
  }
}, [walletAddress]);
```

We're still using `TEST_GIFS`! Lame. Let's call our program. It should give us back an empty list of GIFs right? Since we never actually added any GIFs yet.

Let's change this up to the following:

```javascript
const getGifList = async() => {
  try {
    const provider = getProvider();
    const program = new Program(idl, programID, provider);
    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    
    console.log("Got the account", account)
    setGifList(account.gifList)

  } catch (error) {
    console.log("Error in getGifList: ", error)
    setGifList(null);
  }
}

useEffect(() => {
  if (walletAddress) {
    console.log('Fetching GIF list...');
    getGifList()
  }
}, [walletAddress]);
```

### 🤬 Wtf an error!?

When you refresh your page, you'll get an error that looks something like this:

![Untitled](https://i.imgur.com/wUArqKJ.png)

Hmmmm — "Account does not exist". 

This error confused the hell out of me when I first saw it. Originally, I thought it meant my actual wallet "account" didn't exist.

But, what this error actually means is our program's `BaseAccount` does not exist.

Which makes sense, we haven't yet initialized the account via `startStuffOff`!! Our account doesn't just magically get created. Let's do that.

### 🔥 Call `startStuffOff` to initialize program

Let's build a simple function to call `startStuffOff`. You are going to want to add this under your `getProvider` function! 

This looks exactly like we had it working in the test script!

```javascript
const createGifAccount = async () => {
  try {
    const provider = getProvider();
    const program = new Program(idl, programID, provider);
    console.log("ping")
    await program.rpc.startStuffOff({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount]
    });
    console.log("Created a new BaseAccount w/ address:", baseAccount.publicKey.toString())
    await getGifList();

  } catch(error) {
    console.log("Error creating BaseAccount account:", error)
  }
}
```

Then, we just need to change up `renderConnectedContainer` to account for two cases.

1. User has connected their wallet, but `BaseAccount` account has **not** been created. Give them a button to create account.
2. User has connected their wallet, and `BaseAccount` exists, so, render `gifList` and let people submit a GIF.

```jsx
const renderConnectedContainer = () => {
// If we hit this, it means the program account hasn't been initialized.
  if (gifList === null) {
    return (
      <div className="connected-container">
        <button className="cta-button submit-gif-button" onClick={createGifAccount}>
          Do One-Time Initialization For GIF Program Account
        </button>
      </div>
    )
  } 
  // Otherwise, we're good! Account exists. User can submit GIFs.
  else {
    return(
      <div className="connected-container">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            sendGif();
          }}
        >
          <input
            type="text"
            placeholder="Enter gif link!"
            value={inputValue}
            onChange={onInputChange}
          />
          <button type="submit" className="cta-button submit-gif-button">
            Submit
          </button>
        </form>
        <div className="gif-grid">
					{/* We use index as the key instead, also, the src is now item.gifLink */}
          {gifList.map((item, index) => (
            <div className="gif-item" key={index}>
              <img src={item.gifLink} />
            </div>
          ))}
        </div>
      </div>
    )
  }
}
```

Pretty straightforward! I made some changes in `gifList.map`. Watch out for those!

### 🥳 Let's test!

Let's go ahead and test! If you refresh the page and have your wallet connected, you'll see "Do One-Time Initialization For GIF Program Account". When you click this, you'll see Phantom prompt you to pay for the transaction w/ some SOL!!

If everything went well, then you'll see this in the console:

![Untitled](https://i.imgur.com/0CdFajf.png)

So, here we created an account *and then* retrieved the account itself!! And, `gifList` is empty since we haven't added any GIFs to this account yet!!! **NICEEEEE.**

**So, now you'll notice that every time we refresh the page — it asks us to create an account again. We'll fix this later but why does this happen? I made a little video about it below**

[Loom](https://www.loom.com/share/fc1cf249073e45d6bf31d985b4b11580)


### 🚨 Progress Report

*Please do this else Farza will be sad :(*

Post a screenshot in `#progress` with the "Got the account" stuff in your console :).

