We are looking great right now. We have setup two scenarios and got the basics down for actually calling our Smart Contract from our UI. Go ahead send some 👏s  in `#progress` to show your **HYPE** levels. More 👏 === more hype.

Now that we are able to interact with our Smart Contract from our UI and we have created our `SelectCharacter` Component, we can easily grab all mint-able characters from our Smart Contract and display them in our UI. Let's jump right in.

### 👀 Just one more thing
Before you begin, be sure to remove any function calls to mint a character or attack a boss in your `scripts/deploy.js` file! This will help prevent some React state errors in your UI.

### ♻️ Setting up a reusable contract object

Since we know we are going to use our Smart Contract let's start by setting up an `ethers` object to interact with it. It's going to be the same flow as before, with a little twist. Let's start by importing all the things in `Components/SelectCharacter/index.js` :

```javascript
import React, { useEffect, useState } from 'react';
import './SelectCharacter.css';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import myEpicGame from '../../utils/MyEpicGame.json';
```

 

Next let's get some state properties setup. In this component we are going to need a few different state properties:

`characters` - This will hold all the character metadata we get back from our contract

`gameContract` - This one is cool! Since we are going to be using our contract in multiple spots, let's just initialize it once and store it in state to use throughout our contract:

```javascript
const SelectCharacter = ({ setCharacterNFT }) => {
  const [characters, setCharacters] = useState([]);
  const [gameContract, setGameContract] = useState(null);

  return (
    <div className="select-character-container">
      <h2>Mint Your Hero. Choose wisely.</h2>
    </div>
  );
};

export default SelectCharacter;
```

As soon as our component is mounted, we are going to want to create our `gameContract` to start using right away! We want to display our mint-able characters as soon as possible. Which means we need to call our contract ASAP. Note: This block of code goes under the useState variable ie. under `const [gameContract, setGameContract] = useState(null);`. 

```javascript
// UseEffect
useEffect(() => {
  const { ethereum } = window;

  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const gameContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      myEpicGame.abi,
      signer
    );

    /*
     * This is the big difference. Set our gameContract in state.
     */
    setGameContract(gameContract);
  } else {
    console.log('Ethereum object not found');
  }
}, []);
```

### 😎 Fetching all the characters

There isn't much different here other than setting our `gameContract` in state. We are going to use a bit more `useEffect` fanciness! Since we need to get our data ASAP, we want to know as soon as our `gameContract` is ready to use. So, why don't we just setup another `useEffect` to listen for any changes with `gameContract` ? Right under the `useEffect` you wrote above, add this:

```javascript
useEffect(() => {
  const getCharacters = async () => {
    try {
      console.log('Getting contract characters to mint');

      /*
       * Call contract to get all mint-able characters
       */
      const charactersTxn = await gameContract.getAllDefaultCharacters();
      console.log('charactersTxn:', charactersTxn);

      /*
       * Go through all of our characters and transform the data
       */
      const characters = charactersTxn.map((characterData) =>
        transformCharacterData(characterData)
      );

      /*
       * Set all mint-able characters in state
       */
      setCharacters(characters);
    } catch (error) {
      console.error('Something went wrong fetching characters:', error);
    }
  };

  /*
   * If our gameContract is ready, let's get characters!
   */
  if (gameContract) {
    getCharacters();
  }
}, [gameContract]);
```

Nice. So this is looking pretty similar to what we had in `App.js` right? We have this async function called `getCharacters` that uses our `gameContract` to call our `getAllDefaultCharacters` function which we wrote earlier in Solidity Land!

We then map through what is returned to us to transform the data in a way that our UI can easily understand.

After, we can set this data in our state to start using!

Finally, every time `gameContract` changes we want to make sure it's not `null` so we wrap our function call in a quick check.

Before we move on, let's give this a quick test! We should be able to see some cool log statements in our console. Make sure your console is open and ready to go and give your app a quick refresh. If all was successful you should see some like this:
![Untitled](https://i.imgur.com/XHEeMZ5.png)

**🦄 LOOK AT THAT. You just pulled some data from your smart contract 🦄**

Always a sight to see, that's for sure. This is cool and all, but it would be even cooler if it showed up in our app, right?

### 👓 Actually rendering the characters UI

We are going to take the same render method approach here by creating function that will map through all of our characters and create some UI to render them on the page. Let's start by creating the render method in the `SelectCharacter` component:

```javascript
// Render Methods
const renderCharacters = () =>
  characters.map((character, index) => (
    <div className="character-item" key={character.name}>
      <div className="name-container">
        <p>{character.name}</p>
      </div>
      <img src={character.imageURI} alt={character.name} />
      <button
        type="button"
        className="character-mint-button"
        onClick={()=> mintCharacterNFTAction(index)}
      >{`Mint ${character.name}`}</button>
    </div>
  ));
```

There are a few things I want to note here before we move on — 

1. If you remember from an earlier lesson, I gave you all the css needed for this component. This will make everything "just work", but I ***HIGHLY***  encourage you to tweak this!
2. You are probably going to see another undefined error for `mintCharacterNFTAction` . Don't worry - this will be added later! **Comment this line out for now :).**
3. We still need to call this render method, so why don't we do that now in the `SelectCharacter` component:

```javascript
return (
  <div className="select-character-container">
    <h2>Mint Your Hero. Choose wisely.</h2>
    {/* Only show this when there are characters in state */}
    {characters.length > 0 && (
      <div className="character-grid">{renderCharacters()}</div>
    )}
  </div>
);
```

It's that easy! Go ahead and give your page a quick refresh and you should see something like this:

![Untitled](https://i.imgur.com/ycbOfNh.png)

**YOOOOO LETS GO. WE GOT SOME CHARACTERS :).**

*Note: the characters may be arranged vertically instead of horizontally!*

### ✨ Minting your Character NFT from the UI

This is amazing, but we can take it one step further - **a one button click to mint our NFT.** We are going to start by adding in our minting function `mintCharacterNFTAction` . Go ahead and add this right under where you declared your state in `SelectCharacter`:

```javascript
// Actions
const mintCharacterNFTAction = async (characterId) => {
  try {
    if (gameContract) {
      console.log('Minting character in progress...');
      const mintTxn = await gameContract.mintCharacterNFT(characterId);
      await mintTxn.wait();
      console.log('mintTxn:', mintTxn);
    }
  } catch (error) {
    console.warn('MintCharacterAction Error:', error);
  }
};
```

*Note: Remember to uncomment out `onClick={()=> mintCharacterNFTAction(index)}` in `renderCharacters`.*

I hope you are starting to see the common trend of interacting with a smart contract! If you have the `onClick` attribute commented out in your render method code, make sure to uncomment it now.

This function is going to call the `mintCharacterNFT` function on our contract. It needs to know which character to mint though, so we pass it the index of that character!

We then just wait for the transaction to finish before we do anything else. Something seems a bit off though... It doesn't look like we are returning any data from our smart contract? How do we know when the NFT is truly minted? **Remember that `event` you created that fires off after an NFT is minted?** That's the thing we are going to use!

We are going to listen in for an event from our smart contract that says, "Yo I'm done minting your NFT. You can continue."

Let's head back to the first `useEffect` where we waited for our `gameContract` to be generated. We are going to need to add a few things here:

```javascript
useEffect(() => {
  const getCharacters = async () => {
    try {
      console.log('Getting contract characters to mint');

      const charactersTxn = await gameContract.getAllDefaultCharacters();
      console.log('charactersTxn:', charactersTxn);

      const characters = charactersTxn.map((characterData) =>
        transformCharacterData(characterData)
      );

      setCharacters(characters);
    } catch (error) {
      console.error('Something went wrong fetching characters:', error);
    }
  };

  /*
   * Add a callback method that will fire when this event is received
   */
  const onCharacterMint = async (sender, tokenId, characterIndex) => {
    console.log(
      `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
    );

    /*
     * Once our character NFT is minted we can fetch the metadata from our contract
     * and set it in state to move onto the Arena
     */
    if (gameContract) {
      const characterNFT = await gameContract.checkIfUserHasNFT();
      console.log('CharacterNFT: ', characterNFT);
      setCharacterNFT(transformCharacterData(characterNFT));
    }
  };

  if (gameContract) {
    getCharacters();

    /*
     * Setup NFT Minted Listener
     */
    gameContract.on('CharacterNFTMinted', onCharacterMint);
  }

  return () => {
    /*
     * When your component unmounts, let;s make sure to clean up this listener
     */
    if (gameContract) {
      gameContract.off('CharacterNFTMinted', onCharacterMint);
    }
  };
}, [gameContract]);
```

This is pretty epic. You are now listening for `CharacterNFTMinted` events that will trigger your `onCharacterMint` function! Let's talk a bit more about how this is working:

```javascript
const onCharacterMint = async (sender, tokenId, characterIndex) => {
  console.log(
    `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
  );

  if (gameContract) {
    const characterNFT = await gameContract.checkIfUserHasNFT();
    console.log('CharacterNFT: ', characterNFT);
    setCharacterNFT(transformCharacterData(characterNFT));
  }
};
```

This method is called anytime a new character NFT is minted. Simply print out the data to make sure things are looking good and then we need to get the actual metadata of our newly minted character NFT! If you are experienced in React, you may see some routes where we can get the character metadata without having to call our contract again! Definitely make this change if you know how :). If not, no worries! We already setup this logic on our contract (thank your past self at this moment).

All we are doing is calling the `checkIfUserHasNFT` function which will return all of our metadata! At that point, we can transform the data and set it in our state. Once our state is set, we will be transported to our `Arena` Component (as soon as we set it up of course).

```javascript
gameContract.on('CharacterNFTMinted', onCharacterMint);
```

This is pretty simple - use our `gameContract` object to listen for the `CharacterNFtMinted` fired from our smart contact. Our UI will then run the `onCharacterMint` logic!

```javascript
return () => {
  if (gameContract) {
    gameContract.off('CharacterNFTMinted', onCharacterMint);
  }
};
```

Finally, we want to make sure to stop listening to this event when the component is not being used anymore! This is good practice in React and helps with future improvements down the road :). 

### 🌌 Seeing your Character NFT in the Metaverse

![Untitled](https://media.giphy.com/media/rHR8qP1mC5V3G/giphy.gif)

Big salute to you for your endeavors. At this point we should be able to give this a solid test — lets mint an NFT! As always, make sure your console is open so we can see your log statements! Mint your favorite character and wait for your hard earned work to prosper right in front of you:

![Untitled](https://i.imgur.com/PQHzJzq.png)

My. Goodness. You just minted a character NFT from your Smart Contract. Straight up legend out here 🔥. Before we move on let's head over to Pixxiti and see if our character was truly minted. To get the direct link to your NFT you can just do:

```javascript
https://goerli.pixxiti.com/nfts/CONTRACT_ADDRES/TOKEN_ID
```

Here's what mines looks like:

![Untitled](https://i.imgur.com/W3eca7t.png)

AHH YES. There is my Leo. One thing to note here - make sure to look for your NFT on the [https://goerli.pixxiti.com](https://goerli.pixxiti.com) since we are using Goerli!

You freaking did it! Now that we have our character NFT we can finally go out and protect the Metaverse from rogue beings ⚔️.

Feel free to also set up an `alert` that automatically gives your player the Goerli link when it's done minting. For example something like:

```javascript
alert(`Your NFT is all done -- see it here: https://goerli.pixxiti.com/nfts/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
```

### 🚨 Progress report

Post a screenshot of your character select screen in #progress -- it's always fun to see everyone's characters!! It's also a perfect thing to tweet out :). Tell the world about your NFT characters and what your game is all about :).

![Untitled](https://i.imgur.com/ycbOfNh.png)
