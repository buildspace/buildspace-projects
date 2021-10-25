The cool part about our game is we mint actual NFTs that are used to play + all the game logic happens on-chain. We already set up all of our smart contract logic earlier in this project so now it's time to actually interact with it.

### 🌊 The flow.

The first thing we are going to start with is checking to see if the wallet address connected to our app has a character NFT already. If they do, we can go ahead and grab the metadata from their NFT and use it to battle a boss in the metaverse ⚔️.

Let's go over the flow of getting our web app connected to our deployed smart contract on the Rinkeby Testnet.

Here's the flow:

1. Get latest deployed contract address, paste it in to our web app.
2. Get the latest ABI file, paste the file into our web app's directory (more on what an ABI is later).
3. Use [ethers.js](https://github.com/ethers-io/ethers.js)  to help us talk to our smart contract from the client
4. Call function on our contract to do something!

Pretty straight forward, right? Let's dive into each on of these get things setup!

### 🏠 Get the latest Smart Contract Address.

Plain and simple - this is the deployed address of your smart contract. Every time you run your `deploy.js` script, you print out the address of where your contract lives, right? We need that address to connect to our smart contract from our UI. There are millions of contracts on the blockchain, that address is what our client needed to know what contract to connect to.

We are going to be using this address in multiple components, so, let's make it ezpz to get to! At the root of your project under `src` go ahead and create a `constants.js` file and add the following code:

```javascript
const CONTRACT_ADDRESS = 'YOUR_CONTRACT_ADDRESS_GOES_HERE';

export { CONTRACT_ADDRESS };
```

Then head back to your `App.js` file and import this at the top of your file to get access to it like so:

```javascript
import { CONTRACT_ADDRESS } from './constants';
```

### 📁 Get the latest ABI file.

**I made a little video below explaining ABI stuff.**

[Loom](https://www.loom.com/share/2d493d687e5e4172ba9d47eeede64a37)

**Please give it a watch as I go over some important stuff (note this video shows this process happening in another project. Don't worry - it's the same exact flow)**

So — when you compile your smart contract, the compiler spits out a bunch of files needed that lets you interact with the contract. You can find these files in the `artifacts` folder located in the root of your Solidity project.

The ABI file is something our web app needs to know how to communicate with our contract. Read about it [here](https://docs.soliditylang.org/en/v0.5.3/abi-spec.html).

The contents of the ABI file can be found in a fancy JSON file in your hardhat project:

`artifacts/contracts/MyEpicGame.sol/MyEpicGame.json`

So, the question becomes how do we get this JSON file into our frontend? Well, we are just going to do the good 'ol copy / paste method!

Copy the contents from your `MyEpicGame.json` file and then head to your web app. You are going to make a new folder called `utils` under `src`. Under `utils` create a file named `MyEpicGame.json`. So the full path will look like: `src/utils/MyEpicGame.json`

Paste the ABI file contents right there in our new file.

**SWEET**. Now that we have our file setup we need to import it into our `App.js` file to utilize it! Simply add this to the top of your imports:

```javascript
import myEpicGame from './utils/MyEpicGame.json';
```

**Note: You may need to Stop and then Start your Replit after adding this file in**. Sometimes I've noticed it doesn't catch the new file!

SO — we now have the two things needed to call our contract from web app: **the ABI file and the deployed contract address!** 

### 🧐 **Some notes on updating your Smart Contract.**

Deployed contracts are permanent. You can't change them. The only way to update a contract is to actually re-deploy it. Let's say you wanted to randomly change your contract right now. Here's what we'd need to do:

1. We need to deploy it again.

2. We need to update the contract address on our frontend.

3. We need to update the abi file on our frontend.

**People constantly forget to do these 3 steps when they change their contract. Don't forget lol.**

Why do we need to do all this? Well, it's because smart contracts are **immutable.** They can't change. They're permanent. That means changing a contract requires a full redeploy. This will also **reset** all the variables since it'd be treated as a brand new contract. **That means we'd lose all our NFT data if we wanted to update the contract's code.**

So what you'll need to do is:

1. Deploy again using `npx hardhat run scripts/deploy.js --network rinkeby`

2. Change `contractAddress` in `constants.js` to be the new contract address we got from the step above in the terminal just like we did before the first time we deployed.

3. Get the updated abi file from `artifacts` like we did before and copy-paste it into your web app just like we did above.

**Again -- you need to do this every time you change your contracts code else you'll get errors :).**

### 📞 Calling the Smart Contract with ethers.js.

Now that we have everything we need, we can setup an object in JavaScript to interact with our smart contract. This is where [ethers.js](https://github.com/ethers-io/ethers.js)  comes in handy!

The first thing you are going to want to do is make sure to import ethers into your `App.js` file:

```javascript
import { ethers } from 'ethers';
```

We have done a lot up to this point so let's make sure we are on the same page here - 

Our goal is to call our contract to check to see if the current wallet address has minted a character NFT. If it does, we can move the player right along to the ⚔️ Arena ⚔️ **ELSE** *we need to take them to mint a character NFT before they can play!*

Remember when we created the `checkIfUserHasNFT` in our smart contract?

That method will return the character NFT metadata (if the player minted an NFT) else, it will return a blank `CharacterAttributes` struct. So - when do we actually want to call this, though? 

If we think back to scenario #2:

**If user has connected to your app AND does not have a character NFT - Show `SelectCharacter` Component**

This means we should probably check this as soon as our app loads right? Let's setup another `useEffect` to do a little fanciness here 💅:

```javascript
/*
 * Add this useEffect right under the other useEffect where you are calling checkIfWalletIsConnected
 */
useEffect(() => {
  /*
   * The function we will call that interacts with out smart contract
   */
  const fetchNFTMetadata = async () => {
    console.log('Checking for Character NFT on address:', currentAccount);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const gameContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      myEpicGame.abi,
      signer
    );

    const txn = await gameContract.checkIfUserHasNFT();
    if (txn.name) {
      console.log('User has character NFT');
      setCharacterNFT(transformCharacterData(txn));
    }
  };

  /*
   * We only want to run this, if we have a connected wallet
   */
  if (currentAccount) {
    console.log('CurrentAccount:', currentAccount);
    fetchNFTMetadata();
  }
}, [currentAccount]);
```

This is some of that fancy React I was talking about before. You also will probably have some error saying how `transformCharacterData` is undefined :(. Keep going - we will address it all shortly: 

Lets go over the stuff we wrote above!

```javascript
const fetchNFTMetadata = async () => {
  console.log('Checking for Character NFT on address:', currentAccount);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const gameContract = new ethers.Contract(
    CONTRACT_ADDRESS,
    myEpicGame.abi,
    signer
  );

  const txn = await gameContract.checkIfUserHasNFT();
  if (txn.name) {
    console.log('User has character NFT');
    setCharacterNFT(transformCharacterData(txn));
  } else {
    console.log('No character NFT found');
  }
};
```

We are declaring the function to run inside our hook. Looks sort of weird right? The reason why we have to do this is because `useEffect` + async don't play well together. So we declare our async function like this, we can get around that. This is definitely a more difficult thing to understand, so definitely take a look on Google if you are still a little confused.

```javascript
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
```

This is the main logic used to setup our Ethers object and actually call our contract 🚀.  A "Provider" is what we use to actually talk to Ethereum nodes. Remember how we were using Alchemy to **deploy**? Well in this case we use nodes that MetaMask provides in the background to send/receive data from our deployed contract. 

We won't get too much into signers, but [here is a link](https://docs.ethers.io/v5/api/signer/#signers) explaining what a signer is!

```javascript
const gameContract = new ethers.Contract(
  CONTRACT_ADDRESS,
  myEpicGame.abi,
  signer
);

const characterNFT = await gameContract.checkIfUserHasNFT();
```

After we create our provider and signer we are all ready to go to create our contract object! Just know that this line is what actually creates the connection to our contract. It needs: the contract's address, ABI file, and a signer. These are the three things we always need to communicate with contracts on the blockchain.

With this all setup, we can then finally call the `checkIfUserHasNFT` method. Again, this is going to go to our contract on the blockchain and run a read request and return back some data for us.  **Can we pause and realize how insanely cool that is.** You're a straight up blockchain developer right now 🔥.

Feel free to `console.log(txn)` and see what's in it!

```javascript
if (characterNFT.name) {
  console.log('User has character NFT');
  setCharacterNFT(transformCharacterData(characterNFT));
} else {
  console.log('No character NFT found!');
}
```

Once we get a response from our contract we need to check to see if there is indeed a minted character NFT. The way we are going to do this is by checking to see if there is a name. If there is a name for the character NFT then we know this person has already one!

With that, let's set our `characterNFT` state with this data so we can use it in our app! It's now time to address that `transformCharacterData` method we are calling. Since we will be getting character data in other spots in our app, why would we want to write the some code over and over again? Let's just get a little fancy with it 😎. 

Let's start by getting rid of this undefined error but heading to the `constants.js` file that we created earlier to hold our contract address and add the following:

```javascript
const CONTRACT_ADDRESS = 'YOUR_CONTRACT_ADDRESS_GOES_HERE';

/*
 * Add this method and make sure to export it on the bottom!
 */
const transformCharacterData = (characterData) => {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp.toNumber(),
    maxHp: characterData.maxHp.toNumber(),
    attackDamage: characterData.attackDamage.toNumber(),
  };
};

export { CONTRACT_ADDRESS, transformCharacterData };
```

All this is doing is putting our data from our smart contract it a nice object that we can easily use in our UI code! Pretty nifty, eh?

Don't forget to import this back in `App.js` like so:

```javascript
/*
* Just add transformCharacterData!
*/
import { CONTRACT_ADDRESS, transformCharacterData } from './constants';
```

Now, onto the final little bit of code from my snippet above:

```javascript
if (currentAccount) {
  console.log('CurrentAccount:', currentAccount);
  fetchNFTMetadata();
}
```

Remember, we only want to call this function if we have a connected wallet address! We can't do anything if there is no wallet address right?  Anytime this `useEffect` runs, just make sure we actually have a wallet address connected else, don't run anything.

```javascript
useEffect(() => {
	...
}, [currentAccount]);
```

Alright, so what the heck is this `[currentAccount]` thing? It's just the user's public wallet address that we get back from Metamask. **Anytime the value of `currentAccount` changes, this `useffect` will get fired**! For example when `currentAccount` changes from `null` to a new wallet address, this logic will be ran. 

Do some Googling and [checkout this link](https://reactjs.org/docs/hooks-effect.html) from React docs to learn more.

### ⭕️ Bringing it full circle.

All the things are in place. You are feeling good and you're an insanely talented engineer. So let's test this then, shall we?

Give your app a good 'ol refresh and make sure you don't have a connected wallet just yet. Go ahead and connect your wallet. Make sure you open up your console so you can see the log statements come in!

Go ahead and refresh your page and at this point you should see your console spit out: `No character NFT found` . Nice! This means that your code is running as it's suppose to and you are ready to start minting some character NFTs 🤘!
