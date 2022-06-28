We're here. The promised land. I saved the best for last. We've got a fully functional web app that can read, write and update data on our smart contract. How much of a banger our app is depends on what we do here. 

Smart contracts are tools for execution of certain tasks. The products you build around those tasks is how you get users and revenue.

Here's what our final `Play.js` will look like:
```javascript
import React, { useState, useEffect } from "react";
import * as execute from '../contract/execute';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import LoadingIndicator from '../components/LoadingIndicator';

const Play = () => {
  const connectedWallet = useConnectedWallet();
  // Configure this as you want, I like shorter games
  const playTime = 15;

  const [time, setTime] = useState(playTime);
  const [gameOver, setGameOver] = useState(false);
  // We use this to track where the target is on the screen
  const [targetPosition, setTargetPosition] = useState({ top: "15%", left: "50%" });
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  
  // Every second we're going to lower the value of time.
  useEffect(() => {
    const unsubscribe = setInterval(() => {
      setTime(time => time > 0 ? time - 1 : 0);
    }, 1000);
    return unsubscribe;
  }, []);
  
  useEffect(() => {
    if (time === 0) {
      setTargetPosition({ display: 'none' });
      // Show alert to let user know it's game over
      alert(`Game Over! Your score is ${score}. Please confirm transaction to submit score.`);
      submitScore();
    }
  }, [time]);

  const submitScore = async () => {
    if (connectedWallet && connectedWallet.network.name === 'testnet') {
      setLoading(true);
      const tx = await execute.setScore(connectedWallet, score);
      console.log(tx);
      // Once the transaction is confirmed, we let the user know and navigate to the leaderboard
      alert('Score submitted!');
      setLoading(false);
      window.location.href = '/leaderboard';
    }
  };

  const handleClick = () => {
    // OGs will know this :)
    let audio = new Audio("/Zergling_explodes.mp3");
    
    // Don't let it get too loud!
    audio.volume = 0.2;
    audio.play();

    setScore(score => score + 1);
    
    // Play around with this to control bounds!
    setTargetPosition({
      top: `${Math.floor(Math.random() * 80)}%`,
      left: `${Math.floor(Math.random() * 80)}%`
    });
  };

  return (
    <div className="score-board-container">
      <div className="play-container">
        <span>Score: {score}</span>
        <span>Fight!</span>
        <span>Time left: {time} s</span>
      </div>

      {/* Render loading or game container */}
      {loading ? (
        <LoadingIndicator />
      ) : (
        <div className="game-container">
          {/* CHANGE THIS IMAGE! It's loaded from the public folder. */}
          <img src={"pepe.png"} id="target" alt="Target" style={{ ...targetPosition }} onClick={handleClick} />
          <img src="Marine.png" id="marine-img" alt="Marine" />
        </div>
      )}
    </div>
  );
};

export default Play;
```

A lot going on here, but nothing unfamiliar. 

We've got two useEffects here - one for controlling time and one for game state. Once the timer runs out, we submit the score and clear the screen.

```javascript
  const submitScore = async () => {
    if (connectedWallet && connectedWallet.network.name === 'testnet') {
      setLoading(true);
      const tx = await execute.setScore(connectedWallet, score);
      console.log(tx);
      // Once the transaction is confirmed, we let the user know and navigate to the leaderboard
      alert('Score submitted!');
      setLoading(false);
      window.location.href = '/leaderboard';
    }
  };
```

I added loading states cause it's weird when you're just sitting there waiting for the transaction to confirm. The execute call returns the transaction hash once it has it, so we can use it to check when the transaction is confirmed. 

```javascript
  const handleClick = () => {
    // OGs will know this :)
    let audio = new Audio("/Zergling_explodes.mp3");
    
    // Don't let it get too loud!
    audio.volume = 0.2;
    audio.play();

    setScore(score => score + 1);
    
    // Play around with this to control bounds!
    setTargetPosition({
      top: `${Math.floor(Math.random() * 80)}%`,
      left: `${Math.floor(Math.random() * 80)}%`
    });
  };
```

This is the core logic of our game right now. All it does it play a special audio clip. We're intentionally stacking plays instead of playing sequentially cause it sounds way more responsive. Every time a click comes in, we create a *new* audio stream and blast it out. 

`setTargetPosition` just moves our target around randomly. You can use this to control spawn areas. 


**CHALLENGE!**
Play around with the game mechanics, it's really fun. You should **definitely** change the target image. I don't want to see the pepe getting blasted by everyone. 

Here's a few ideas:
* Add multiple rounds
* Add multiple enemies
* Randomise respawn timings
* Add different types of enemies that require more clicks
* Add multipliers for accuracy

There's soooo much you can do with a simple clicker game like this. You can add a lot of this config to the contract and control difficulty or behaviour using it. 

Most importantly, HAVE FUN!

### 🚨 Progress report
Post a screenshot of your fancy game! I want to see all your awesome twists lol