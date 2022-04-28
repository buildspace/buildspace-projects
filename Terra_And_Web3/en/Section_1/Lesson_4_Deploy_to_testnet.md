We pretty much have a basic API now — right :)?

We're able to POST data and we're able to GET data.

Let's hook up a web app with our contract! What we'll need to do is deploy to the Bombay testnet. This is a network run by Terra that runs on fake testnet tokens.

Technically, we could deploy our contract locally w/ localterra and build our web app using the local network — but here at buildspace we're pretty interested in getting to prod as quickly as possible :). Why mess around locally when we can deploy to the actual blockchain!?! Hehe.

### 🛰  Set up your wallet
Before we can do anything on a real network, we need a wallet. So far we're been using `test1` whenever deploying with Terrain, this works cause it's built into Terrain. 

Head over to the [Terra Station Chrome Extension page](https://chrome.google.com/webstore/detail/terra-station-wallet/aiifbnbfobpmeekipheeijimdpnlpgpp) and install it. As you go through setup, make sure you store the seed phrase somewhere handy.

🚨 **NOTE**🚨
If you already had a wallet from before, **make another one for development.** I **highly** recommend keeping your development wallet separate from your production wallet with real money in it. It takes ~10 seconds and you’ll thank yourself when you accidentally publish a public repo with your private key late at night.

Once you've finished setup, copy your wallet address and go to the [Terra Faucet](https://faucet.terra.money/) to get some free testnet tokens.

Switch to the testnet 
![](https://hackmd.io/_uploads/SJWizlRVc.png)


You've got money!
![](https://hackmd.io/_uploads/SyvtzeRVc.png)


Now we *could* add the seed phrase directly to the `keys.terrain.js` file, but this is pretty insecure. Instead, we'll use a package called [Dotenv](https://www.npmjs.com/package/dotenv) to keep them hidden:
```
# Desktop/Learn-Terra/clicker-portal/
npm install dotenv
```
The way dotenv works is you put all your secrets in a single file and use it to "inject" them into various JavaScript files. 

Create a `.env` file in the `clicker-portal` folder and add the following (remember to actually replace the seed phrase lol):
```
SEED_PHRASE="PLACE YOUR BOMBAY SEED PHRASE HERE"
```
**WARNING:** DO NOT COMMIT THIS FILE (.env) TO GITHUB! The mnemonic seed phrase gives access to all the funds in your wallet on all networks. **YOU WILL GET HACKED + ROBBED**.

You can now use `process.env.SEED_PHRASE` instead of the actual seed phrase in JavaScript files with dotenv.

To finish dotenv setup, open the `keys.terrain.js` dotenv and add our environment variable:
```js
// We are configuring dotenv here 
require('dotenv').config();

module.exports = {
  custom_tester_1: {
    mnemonic:
      "shiver position copy catalog upset verify cheap library enjoy extend second peasant basic kit polar business document shrug pass chuckle lottery blind ecology stand",
  },
  custom_tester_2: {
    privateKey: "fGl1yNoUnnNUqTUXXhxH9vJU0htlz9lWwBt3fQw+ixw=",
  },
  bombay: {
    // Instead of the actual seed phrase we can use this :D
    mnemonic: process.env.SEED_PHRASE,
  },
};
```

Finally, create a `.gitignore` file in `clicker-portal` and add `.env` to this. This way Git will ignore the file whenever we commit.

Recap:
* We installed dotenv
* We created a `.env` file and put our seed phrase in it
* We created a `.gitignore` file and added `.env` to it so Git will ignore it
* We updated our `keys.terrain.js` file to use dotenv.

We are SECURE! Let's launch!

### 🚀 Deploy to the Bombay testnet
Terrain makes deploying super easy. The main pre-flight check I do is looking at my `config.terrain.json` file for the `instantiateMsg` value. Deploying costs 1 Luna and we have a limited supply so you've gotta be careful!

Green light. We are GO for launch:
```
# Desktop/Learn-Terra/clicker-portal/
terrain deploy clicker --signer bombay --network testnet
```

You should see a bunch of outputs, including this near the end:
```
storing wasm bytecode on chain... done
code is stored at code id: 65532
instantiating contract with code id: 65532... done
- events:
    - type: from_contract
      attributes:
        - key: contract_address
          value: terra1xpx88vypkmkvc403slclf7wnlq4h4ch6sjvq68
```

**Note:** If you get "insufficient funds", you'll need to swap some LUNA tokens to UST. You can do this within the Terra station wallet. Just click the extension icon and click the swap button on the LUNA token.

Once you do, head over to the [Terra Testnet Explorer](https://finder.terra.money/testnet/) and paste in the contract address. 

![](https://hackmd.io/_uploads/r1a0geREc.png)

You'll see your deployed contract!! Scroll down and see the transaction history and you'll see the deployment right there.

![](https://hackmd.io/_uploads/BkeaFeVCVc.png)

If you want to interact with your deployed contract, you can do it with Terrain like this:
```
# Desktop/Learn-Terra/clicker-portal
terrain console --network testnet
```

**YO — YOU JUST DEPLOYED TO THE ACTUAL TERRA BLOCKCHAIN. NICE.**

This of course is not "Mainnet", but the "Testnet". It's  run by actual nodes and is legit - anyone can access it.

There aren't that many "Terra developers". So this point you're probably in the top 10% of Terra developers lol. Congrats!

*Note: From this point on, please don't make changes to your contract files until I say so. Basically, whenever you change your contract src files you need to redeploy and follow the steps above all over again. I always easily miss steps and get weird bugs lol. Let's focus on the web app now, we'll come back to the contract later*

### 🚨 Progress Report
Please do this else Raza will be sad :(

You deployed a complete Terra contract!!! Hell yes!! Go ahead and post the Terra Finder link to your deployed contract in #progress.

This is also a good time to tweet out that you're learning about Terra and just deployed your first contract to the Terra Testnet. Inspire others to join web3!

Be sure to include your Terra Finder link and attach a screenshot of your deployed contract as well perhaps. Or, add a screenshot of it on Terra Finder!! Tag @_buildspace if you're feeling fancy ;).
