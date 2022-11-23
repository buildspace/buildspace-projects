At this point, we have been introduced to pretty much everything we need to know to build our React app. Let's jump right into setting up our `Arena` Component:

Just like with the `SelectCharacter` Component, let's create a new file in the `Components/Arena`  folder called `index.js`. Again, you should already see an `Arena.css` file in this folder! Once you setup your base don't forget to get fancy with your styling 💅.

### ⚔️ Setting up the Arena

Next, we are going to setup our `Arena` component. Make sure you're working out of `Arena/index.js`. I'm going to add a lot more base code here as we are familiar with everything that is happening:

```javascript
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import myEpicGame from '../../utils/MyEpicGame.json';
import './Arena.css';

/*
 * We pass in our characterNFT metadata so we can show a cool card in our UI
 */
const Arena = ({ characterNFT }) => {
  // State
  const [gameContract, setGameContract] = useState(null);

  // UseEffects
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

      setGameContract(gameContract);
    } else {
      console.log('Ethereum object not found');
    }
  }, []);

  return (
    <div className="arena-container">
      {/* Boss */}
      <p>BOSS GOES HERE</p>

      {/* Character NFT */}
      <p>CHARACTER NFT GOES HERE</p>
    </div>
  );
};

export default Arena;
```

Now that we have the base of our `Arena` component all setup and ready to go, it's time to head back to `App.js` to add the final scenario in our render method:

**If user has connected to your app AND does have a character NFT - Show `Arena` Component**

All we need to do is import `Arena` and then add the `else/if` statement to our `renderContent` function:

```javascript
import Arena from './Components/Arena';

...

const renderContent = () => {

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
	/*
	* If there is a connected wallet and characterNFT, it's time to battle!
	*/
  } else if (currentAccount && characterNFT) {
    return <Arena characterNFT={characterNFT} />;
  }
}; 
```

**We now have covered all three scenarios!** At this point, if you refresh your app you should be taken directly to the `Arena` component which should look a little something like this:
![Untitled](https://i.imgur.com/s0DyCYr.png)

So to recap, at this point you:

- Have a wallet connected to your app
- Minted a character NFT to this wallet
- Are now ready to take on your **🔥 Boss 🔥**

### 😈 Fetching the Big Boss from the Smart Contract

In the `SelectCharacter` component we setup a way to fetch all mint-able characters from your contract. Well, in the `Arena` component we are going to be doing the same thing, but with fetching our boss!

In Solidity land, you setup a function that fetches the boss on your contract. All we need to do is call that function here and setup our data to be able to display in our UI. This will be the same exact setup as `SelectCharacter` , so let's get started by adding a boss state to our component and setup another `useEffect` to listen for `gameContract` changes:

```javascript
// State
const [gameContract, setGameContract] = useState(null);
/*
 * State that will hold our boss metadata
 */
const [boss, setBoss] = useState(null);

// UseEffects
useEffect(() => {
  /*
   * Setup async function that will get the boss from our contract and sets in state
   */
  const fetchBoss = async () => {
    const bossTxn = await gameContract.getBigBoss();
    console.log('Boss:', bossTxn);
    setBoss(transformCharacterData(bossTxn));
  };

  if (gameContract) {
    /*
     * gameContract is ready to go! Let's fetch our boss
     */
    fetchBoss();
  }
}, [gameContract]);
```

Nice! To make sure everything is working, quickly refresh your app and check your console. If everything is setup correctly, you should see your boss data in all it's glory:

![Untitled](https://i.imgur.com/0bQQgAR.png)

Elon has arrived. Let's go ahead and setup our component to display Elon in all his glory.

### 🙀 Actually rendering the Big Boss

This is where the fun starts 🤘. Again, building out your UI is something you can be extremely creative with! While I gave you all the styling you needed to get started, explore the CSS and make something that you ***LOVE*** and can show off to your friends.

Alright, we are going to start by adding some HTML to our component:

```javascript
return (
  <div className="arena-container">
    {/* Replace your Boss UI with this */}
    {boss && (
      <div className="boss-container">
        <div className={`boss-content`}>
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
      </div>
    )}

    {/* Character NFT */}
    <p>CHARACTER NFT GOES HERE</p>
  </div>
);
```

You probably will run into an error where `runAttackAction` is undefined! Let's quickly add a placeholder for this right under our state so we can at least see what our UI is going to look like. We will worry about the logic **#soon**:

```javascript
// Actions
const runAttackAction = async () => {};
```

Go ahead and give your app a refresh and you should see Elon, his health, and a button to attack him!

This is some pretty simple UI with a solid amount of styling. The cool part is we are pulling all the data from our smart contract:
![Untitled](https://i.imgur.com/o8AJpfw.png)

### 🛡 Actually rendering the Character NFT

Now that we can see a boss, it only makes sense to see our character NFT as well right? This is going to be pretty much the same setup as our boss, just with some different styling! EZPZ let's do it:

```javascript
return (
  <div className="arena-container">
    {/* Boss */}
    {boss && (
      <div className="boss-container">
        <div className={`boss-content`}>
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
      </div>
    )}

    {/* Replace your Character UI with this */}
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
      </div>
    )}
  </div>
);
```

You can see this is pretty much the same sort of layout we have for our character NFT. The main things to notice about both of these sections is that we check to make sure we have the data before rendering. If you don't - our app will crash! 

Your app should look a little something like this:

![Untitled](https://i.imgur.com/l7oCuCN.png)

The great Elon & Leo are ready for an epic battle 🔥. Now that we have our boss and hero ready to go, it is time.

![Untitled](https://media.giphy.com/media/26wkP6n7c8fQJbhVS/giphy.gif)

### 💥 Attacking the Big Boss

The whole point of our game is to defeat the boss in your Metaverse! We take into account all the attack damage your character NFT has and the health for each player. The goal of this section is to land an attack on Elon and see if he lands an attack on us.

If you remember when we were setting up the attack logic on our contract, we tested this all out. Let's just add a little spice here 🌶. It's time to add the logic to `runAttackAction` function we added earlier & another state variable called `attackState` :

 

```javascript
// State
const [gameContract, setGameContract] = useState(null);
const [boss, setBoss] = useState(null);
/*
* We are going to use this to add a bit of fancy animations during attacks
*/
const [attackState, setAttackState] = useState('');

const runAttackAction = async () => {
  try {
    if (gameContract) {
      setAttackState('attacking');
      console.log('Attacking boss...');
      const attackTxn = await gameContract.attackBoss();
      await attackTxn.wait();
      console.log('attackTxn:', attackTxn);
      setAttackState('hit');
    }
  } catch (error) {
    console.error('Error attacking boss:', error);
    setAttackState('');
  }
};
```

**EASY**. Like in the rest of our contract interactions, all we are doing is calling a function we made on our contract! A couple things to remember about this function:

- We will always hit the boss with our attack damage level
- The boss will always hit us back with some attack damage level
- We call `attackTxn.wait()` here to tell our UI to not do anything until our transaction has been mined

In later sections, we will go over how to build out your own RNG into your attacks!

Let's talk a little bit about `setAttackState` . As mentioned above, we are using this to add some animations during our attack plays! I got the idea from Pokemon Yellow for Gameboy Color (Shoutout to my Pokemon Yellow friends 🤘).

We are going to have 3 different states:

- `attacking` - When we are waiting for the transaction to finish
- `hit` - When we land a hit on our boss
- `''` - Default state where we don't want anything to happen

We just need to add one more piece to our UI to get this all to work together! Head back down to your HTML and go to your boss section. Add `${attackState}` to the `div` with the class name `boss-content` .

```javascript
return (
  <div className="arena-container">
    {/* Boss */}
    {boss && (
      <div className="boss-container">
        {/* Add attackState to the className! After all, it's just class names */}
        <div className={`boss-content ${attackState}`}>
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
      </div>
    )}
    ...
  </div>
);
```

We are going to dynamically add this class name to our `div` which in turn will apply some new styles to it! One thing to note here is that you can change these attack state names, just make sure to update them in the `Arena.css` file as well. That's where the styling for the animations is defined!

**NOICE.** We should be ready to try and land an attack on Elon. Go ahead and click the Attack button and see what happens! You should see a few things:

1. MetaMask pops up to make sure you want to confirm the attack action
2. You should see logs in your console starting with "Attacking boss..."
3. Then you should see the transaction hash once the attack is complete
4. During this time you should see some small animations happening 👀

![Untitled](https://i.imgur.com/WuT9ytY.png)

**YOU JUST LANDED YOUR FIRST ATTACK ON ELON 😲.** But wait a minute, Elon's health or Leo's health didn't change? How do our players know what happened? If you are thinking about the Event we made earlier in our Smart Contract - you're right! Thats easy, we've already done that! let's setup a listener in this component to listen to this attack event:

```javascript
/*
* We are going to need to update our character NFT so pass setCharacterNFT here.
*/
const Arena = ({ characterNFT, setCharacterNFT }) => {
	
    ...

    // UseEffects
    useEffect(() => {
        const fetchBoss = async () => {
            const bossTxn = await gameContract.getBigBoss();
            console.log('Boss:', bossTxn);
            setBoss(transformCharacterData(bossTxn));
        };

        /*
        * Setup logic when this event is fired off
        */
        const onAttackComplete = (from, newBossHp, newPlayerHp) => {
            const bossHp = newBossHp.toNumber();
            const playerHp = newPlayerHp.toNumber();
            const sender = from.toString();

            console.log(`AttackComplete: Boss Hp: ${bossHp} Player Hp: ${playerHp}`);

            /*
            * If player is our own, update both player and boss Hp
            */
            if (currentAccount === sender.toLowerCase()) {

              setBoss((prevState) => {
                  return { ...prevState, hp: bossHp };
              });
              setCharacterNFT((prevState) => {
                  return { ...prevState, hp: playerHp };
              });
            }
            /*
            * If player isn't ours, update boss Hp only
            */
            else {
              setBoss((prevState) => {
                  return { ...prevState, hp: bossHp };
              });
            }
        }

        if (gameContract) {
            fetchBoss();
            gameContract.on('AttackComplete', onAttackComplete);
        }

        /*
        * Make sure to clean up this event when this component is removed
        */
        return () => {
            if (gameContract) {
                gameContract.off('AttackComplete', onAttackComplete);
            }
        }
    }, [gameContract]);
}
```

Also, don't forget to head back to `App.js` and pass the `setCharacterNFT` property to your Arena component:

```javascript
  <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />
```

This should all look pretty familiar to you! Our contract will return `newBossHp` and `newPlayerHp` which we will then use to update the state of the boss, and also the character NFT (if it's our player). This part may look a bit funky, so let's dive into this a bit:

```javascript
setBoss((prevState) => {
  return { ...prevState, hp: bossHp };
});

setCharacterNFT((prevState) => {
  return { ...prevState, hp: playerHp };
});
```

In React, `useState` allows us to get the previous state value before we set a new one! This is really useful for us because all we want to do is overwrite the hp of each character. The way we are doing this is through a thing called a [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax). I'm not going to go in depth on that here, but just know it makes a copy of all the properties in our object.

Finally, we just need to add the `hp` property and the new value. Since this is AFTER the spread, JavaScript knows to overwrite the current `hp` value with this new one. Thats it!

Let's try running an attack on Elon again. Go through your same setup and you should now see the character health bars update 😮. Take a look at your console and you can also see your data print out like this:

![Untitled](https://i.imgur.com/HhZcYFe.png)

You have a pretty legit game right now. Animations, health, and live updates! Elon is too strong though, as he has slayed Leo 😞. Head over to #progress and throw a "🪦 RIP LEO 🪦" in the chat. It's the least we can do.
