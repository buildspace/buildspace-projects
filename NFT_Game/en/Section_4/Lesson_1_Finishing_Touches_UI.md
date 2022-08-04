## 🔥 Finishing touches on the UI

You've probably noticed quite a few spots where it wasn't indicated to the user that something was happening - when you did things like minted a character NFT or fetched big boss data. I wanted to go through and show you the loading indicators I thought could be cool to add!

We are going to setup a few loading indicators:

1. `App.js` - Waiting to see if the user has a minted NFT
2. `SelectCharacter Component` - Waiting for our character NFT to mint
3. `Arena Component` - Waiting for an attack action to finish

Remember that one `LoadingIndicator` component that was given to you? We are finally going to be able to use it!

### 🔁 Adding loading indicators to App.js

We want to ensure the user can see something is happening as we are waiting for our app to figure out which scenario we are in. For this it's pretty simple - just show a loading indicator until all our data comes back.

We need to know when something is loading. This is the perfect scenario for a state property. Start by adding an `isLoading` state property right under your `characterNFT` state like so:

```javascript
// State
const [currentAccount, setCurrentAccount] = useState(null);
const [characterNFT, setCharacterNFT] = useState(null);
/*
* New state property added here
*/
const [isLoading, setIsLoading] = useState(false);
```

Next, we are going to need to set the state when we are running async operations, such as as calling `checkIfUserHasNFT` from our contract. We are going to add these setters in both `useEffects` like so:

```javascript
// UseEffects
useEffect(() => {
  /*
   * Anytime our component mounts, make sure to immiediately set our loading state
   */
  setIsLoading(true);
  checkIfWalletIsConnected();
}, []);

useEffect(() => {
  const fetchNFTMetadata = async () => {
    console.log('Checking for Character NFT on address:', currentAccount);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const gameContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      myEpicGame.abi,
      signer
    );

    const characterNFT = await gameContract.checkIfUserHasNFT();
    if (characterNFT.name) {
      console.log('User has character NFT');
      setCharacterNFT(transformCharacterData(characterNFT));
    }

    /*
     * Once we are done with all the fetching, set loading state to false
     */
    setIsLoading(false);
  };

  if (currentAccount) {
    console.log('CurrentAccount:', currentAccount);
    fetchNFTMetadata();
  }
}, [currentAccount]);
```

Now that we have that setup, we need to actually show something. First make sure to import `LoadingIndicator` at the top of your file like so:

```javascript
import LoadingIndicator from './Components/LoadingIndicator';
```

Then it's just as easy as adding this to our `renderContent` function to say, "Hey show my Loading Indicator anytime we are loading":

```javascript
const renderContent = () => {
  /*
   * If the app is currently loading, just render out LoadingIndicator
   */
  if (isLoading) {
    return <LoadingIndicator />;
  }

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
  } else if (currentAccount && !characterNFT) {
    return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
  } else if (currentAccount && characterNFT) {
    return (
      <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />
    );
  }
};
```

If you disconnect your wallet you should see a circular loading indicator. We should release the `isLoading` state property for your connect wallet button to show up!

```javascript
  // Actions
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Make sure you have MetaMask!');
        /*
         * We set isLoading here because we use return in the next line
         */
        setIsLoading(false);
        return;
      } else {
        console.log('We have the ethereum object', ethereum);

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log('Found an authorized account:', account);
          setCurrentAccount(account);
        } else {
          console.log('No authorized account found');
        }
      }
    } catch (error) {
      console.log(error);
    }
    /*
     * We release the state property after all the function logic
     */
    setIsLoading(false);
};
```

### 🔁 Adding loading indicators to the Select Character page

In our `SelectCharacter` Component we are going to be minting a character NFT. This is definitely a cool time to add some cool loading indicator. I have the perfect one in mind 👀

Let's start by heading to this `Components/SelectCharacter/index.js` . Just like in `App.js` , we are going to want to hold state to know when we are the minting phase or not. Start by adding a new state property like so:

```javascript
// State
const [characters, setCharacters] = useState([]);
const [gameContract, setGameContract] = useState(null);
/*
 * New minting state property we will be using
 */
const [mintingCharacter, setMintingCharacter] = useState(false);
```

Then let's go ahead and head over to the `mintCharacterNFTAction` , since this is the function that is doing the minting for us. Just like before, we could tweak this to include our new state updates:

```javascript
const mintCharacterNFTAction = (characterId) => async () => {
  try {
    if (gameContract) {
      /*
       * Show our loading indicator
       */
      setMintingCharacter(true);
      console.log('Minting character in progress...');
      const mintTxn = await gameContract.mintCharacterNFT(characterId);
      await mintTxn.wait();
      console.log(mintTxn);
      /*
       * Hide our loading indicator when minting is finished
       */
      setMintingCharacter(false);
    }
  } catch (error) {
    console.warn('MintCharacterAction Error:', error);
    /*
     * If there is a problem, hide the loading indicator as well
     */
    setMintingCharacter(false);
  }
};
```

One thing I wanted to point out here is the `setMintingCharacter` in the catch block. This is totally up to you, but I prefer to remove my indicator and then maybe display some alert with the error! Do as you wish.

Finally, let's setup some UI that will display when we are in the minting state. I provided some default HTML code for this, but be creative. Setup your minting state however the heck you want!

```javascript
return (
  <div className="select-character-container">
    <h2>Mint Your Hero. Choose wisely.</h2>
    {characters.length > 0 && (
      <div className="character-grid">{renderCharacters()}</div>
    )}
    {/* Only show our loading state if mintingCharacter is true */}
    {mintingCharacter && (
      <div className="loading">
        <div className="indicator">
          <LoadingIndicator />
          <p>Minting In Progress...</p>
        </div>
        <img
          src="https://media2.giphy.com/media/61tYloUgq1eOk/giphy.gif?cid=ecf05e47dg95zbpabxhmhaksvoy8h526f96k4em0ndvx078s&rid=giphy.gif&ct=g"
          alt="Minting loading indicator"
        />
      </div>
    )}
  </div>
);
```

Make sure to import `LoadingIndicator` at the top of your file like so:

```javascript
import LoadingIndicator from "../../Components/LoadingIndicator";
```

Don't forget to add some CSS to your `SelectedCharacter.css` as well:

```css
.select-character-container .loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 75px;
}

.select-character-container .loading .indicator {
  display: flex;
}

.select-character-container .loading .indicator p {
  font-weight: bold;
  font-size: 28px;
  padding-left: 5px;
}

.select-character-container .loading img {
  width: 450px;
  padding-top: 25px;
}
```

With this HTML and CSS, you should have something that looks like this:

![Untitled](https://i.imgur.com/0w2VNro.png)

Gandalf is now preparing you for battle as you get ready to defeat the boss in Arena 🧙‍♂️.

### 🔁 Adding loading indicators to the Arena page

The last spot we want to add some sort of loading indicator is in our `Arena` Component. While we do already have some shaking animations happening during an attack, why don't we add a bit more to really get the point across!

The cool thing about this component is we actually already have some state setup for this - `attackState` ! We know when an attack is happening when our `attackState`  == `attacking` so why don't we just use that?

For this all we will need to do is add some conditional rendering in our HTML. Go ahead and add this: 

```javascript
<div className="arena-container">
  {boss && (
    <div className="boss-container">
      <div className={`boss-content  ${attackState}`}>
        <h2>🔥 {boss.name} 🔥</h2>
        <div className="image-content">
          <img src={boss.imageURI} alt={`Boss ${boss.name}`} />
          <div className="health-bar">
            <progress value={boss.hp} max={boss.maxHp} />
            <p>{`${boss.hp} / ${boss.maxHp} HP`}</p>
          </div>
        </div>
      </div>
      <div className="attack-container">
        <button className="cta-button" onClick={runAttackAction}>
          {`💥 Attack ${boss.name}`}
        </button>
      </div>
      {/* Add this right under your attack button */}
      {attackState === 'attacking' && (
        <div className="loading-indicator">
          <LoadingIndicator />
          <p>Attacking ⚔️</p>
        </div>
      )}
    </div>
  )}
  ...
</div>;
```

Don't forget to import `LoadingIndicator` at the top of your file like so:

```javascript
import LoadingIndicator from "../../Components/LoadingIndicator";
```

Make sure to also add this CSS to your `Arena.css` file:

```css
.boss-container .loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 25px;
}

.boss-container .loading-indicator p {
  font-weight: bold;
  font-size: 28px;
}
```

With this code you should have something that looks like this:

![Untitled](https://i.imgur.com/ggEvT7l.png)

Not too bad right? All of these loading indicators all work the same way and live in their own components. In the next section we are going to add one more piece of fanciness that will give your `Arena` Component even more fanciness when an attack lands!

### 🚨 Adding attack alerts in the Arena page

Another real cool addition you can add to your project is a little toast message showing how much damage you dealt to the boss! This make your game feel even more interactive. We are actually going to use a cool codepen to setup our UI for this. [Shoutout to this codepen](https://codepen.io/jrsmiffy/pen/eYYwrap) for the code! If you want to get even more fancy with this, you can create your own React Component so you can use this toast anywhere 👀. For now, we are just going to add the code in our `Arena` Component!

Start by adding some CSS to your `Arena.css` file:

```css
/* Toast */
#toast {
  visibility: hidden;
  max-width: 500px;
  height: 90px;
  margin: auto;
  background-color: gray;
  color: #fff;
  text-align: center;
  border-radius: 10px;
  position: fixed;
  z-index: 1;
  left: 0;
  right: 0;
  bottom: 30px;
  font-size: 17px;
  white-space: nowrap;
}

#toast #desc {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 28px;
  font-weight: bold;
  height: 90px;
  overflow: hidden;
  white-space: nowrap;
}

#toast.show {
  visibility: visible;
  -webkit-animation: fadein 0.5s, expand 0.5s 0.5s, stay 3s 1s, shrink 0.5s 2s,
    fadeout 0.5s 2.5s;
  animation: fadein 0.5s, expand 0.5s 0.5s, stay 3s 1s, shrink 0.5s 4s,
    fadeout 0.5s 4.5s;
}

@-webkit-keyframes fadein {
  from {
    bottom: 0;
    opacity: 0;
  }
  to {
    bottom: 30px;
    opacity: 1;
  }
}

@keyframes fadein {
  from {
    bottom: 0;
    opacity: 0;
  }
  to {
    bottom: 30px;
    opacity: 1;
  }
}

@-webkit-keyframes expand {
  from {
    min-width: 50px;
  }
  to {
    min-width: 350px;
  }
}

@keyframes expand {
  from {
    min-width: 50px;
  }
  to {
    min-width: 350px;
  }
}
@-webkit-keyframes stay {
  from {
    min-width: 350px;
  }
  to {
    min-width: 350px;
  }
}

@keyframes stay {
  from {
    min-width: 350px;
  }
  to {
    min-width: 350px;
  }
}
@-webkit-keyframes shrink {
  from {
    min-width: 350px;
  }
  to {
    min-width: 50px;
  }
}

@keyframes shrink {
  from {
    min-width: 350px;
  }
  to {
    min-width: 50px;
  }
}

@-webkit-keyframes fadeout {
  from {
    bottom: 30px;
    opacity: 1;
  }
  to {
    bottom: 60px;
    opacity: 0;
  }
}

@keyframes fadeout {
  from {
    bottom: 30px;
    opacity: 1;
  }
  to {
    bottom: 60px;
    opacity: 0;
  }
}
```

Let's then add the HTML to render what our toast will look like! Go ahead an add this to your render function:

```javascript
return (
  <div className="arena-container">
    {/* Add your toast HTML right here */}
    {boss && characterNFT && (
      <div id="toast" className={showToast ? 'show' : ''}>
        <div id="desc">{`💥 ${boss.name} was hit for ${characterNFT.attackDamage}!`}</div>
      </div>
    )}

    {/* Boss */}
    {boss && (
      <div className="boss-container">
        <div className={`boss-content  ${attackState}`}>
          <h2>🔥 {boss.name} 🔥</h2>
          <div className="image-content">
            <img src={boss.imageURI} alt={`Boss ${boss.name}`} />
            <div className="health-bar">
              <progress value={boss.hp} max={boss.maxHp} />
              <p>{`${boss.hp} / ${boss.maxHp} HP`}</p>
            </div>
          </div>
        </div>
        <div className="attack-container">
          <button className="cta-button" onClick={runAttackAction}>
            {`💥 Attack ${boss.name}`}
          </button>
        </div>
        {attackState === 'attacking' && (
          <div className="loading-indicator">
            <LoadingIndicator />
            <p>Attacking ⚔️</p>
          </div>
        )}
      </div>
    )}

    {/* Character NFT */}
    {characterNFT && (
      <div className="players-container">
        <div className="player-container">
          <h2>Your Character</h2>
          <div className="player">
            <div className="image-content">
              <h2>{characterNFT.name}</h2>
              <img
                src={characterNFT.imageURI}
                alt={`Character ${characterNFT.name}`}
              />
              <div className="health-bar">
                <progress value={characterNFT.hp} max={characterNFT.maxHp} />
                <p>{`${characterNFT.hp} / ${characterNFT.maxHp} HP`}</p>
              </div>
            </div>
            <div className="stats">
              <h4>{`⚔️ Attack Damage: ${characterNFT.attackDamage}`}</h4>
            </div>
          </div>
        </div>
        {/* <div className="active-players">
          <h2>Active Players</h2>
          <div className="players-list">{renderActivePlayersList()}</div>
        </div> */}
      </div>
    )}
  </div>
);
```

Since we know our Elon will always be hit with the same value from us, we can just add that here. If you change your contract to have some sort of RNG, you'll need to do this a bit differently using some like React References!

Now that we have this all setup, how do we show and hide our toast? If you look at the CSS there is a class called `show` which will show our toast and if we remove the class, it will hide the toast! We actually need to tweak this just a tad to change dynamically change this class name. We are going to create one more state property and then add some logic to add and remove the `show` class:

```javascript
// State
const [gameContract, setGameContract] = useState(null);
const [boss, setBoss] = useState(null);
const [attackState, setAttackState] = useState('');

/*
* Toast state management
*/
const [showToast, setShowToast] = useState(false);

...

const runAttackAction = async () => {
  try {
    if (gameContract) {
      setAttackState('attacking');
      console.log('Attacking boss...');
      const txn = await gameContract.attackBoss();
      await txn.wait();
      console.log(txn);
      setAttackState('hit');
            
      /*
      * Set your toast state to true and then false 5 seconds later
      */
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 5000);
    }
  } catch (error) {
    console.error('Error attacking boss:', error);
    setAttackState('');
  }
};
```

Nice! The biggest thing to point out is the `setTimeout` . All this is doing is waiting 5 seconds before we remove the `show` class, which will hide our toast!

If you did everything right, you'll see you have a cool little toast at the bottom of your app after attacking your boss.

![Untitled](https://i.imgur.com/l64M22i.png)
