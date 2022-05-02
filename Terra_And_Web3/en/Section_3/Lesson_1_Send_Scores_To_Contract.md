## 📝 Send scores to your contract
We've come a long way. You're getting the user to connect their wallet and loading data from the contract. Time for the final piece - writing data back to the contract. 

### 🗣 Sending execute messages
This is the heart of every Terra smart contract. Execute messages are what do all the work. Swapping UST for some Doge tokens? That's an execute message. Depositing your grandma's savings into a high yield savings account on Anchor cause you don't want to let her down? That's an execute message. Also, that's very responsible of you. I'm proud of you.

Fundamentally, execute messages on the front-end are very simple. We choose a contract function we want to call and feed it the correct parameters. Remember how easy and simple the query message was? Well, the execute message is going be quite similar, except with a bunch more code. 

Create an `execute.js` file in your `terra-starter/src/contract` folder. Here's what it'll look like:
```javascript
import { LCDClient, MsgExecuteContract, Fee } from '@terra-money/terra.js';
import { contractAddress } from './address';

// ==== utils ====

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const until = Date.now() + 1000 * 60 * 60;
const untilInterval = Date.now() + 1000 * 60;

const _exec =
  (msg, fee = new Fee(200000, { uluna: 10000 })) =>
  async (wallet) => {
    const lcd = new LCDClient({
      URL: wallet.network.lcd,
      chainID: wallet.network.chainID,
    });

    const { result } = await wallet.post({
      fee,
      msgs: [
        new MsgExecuteContract(
          wallet.walletAddress,
          contractAddress(wallet),
          msg
        ),
      ],
    });

    while (true) {
      try {
        return await lcd.tx.txInfo(result.txhash);
      } catch (e) {
        if (Date.now() < untilInterval) {
          await sleep(500);
        } else if (Date.now() < until) {
          await sleep(1000 * 10);
        } else {
          throw new Error(
            `Transaction queued. To verify the status, please check the transaction hash: ${result.txhash}`
          );
        }
      }
    }
  };

// ==== execute contract ====
// THIS IS ALL I ADDED!!!
export const setScore = async (wallet, score) =>
  _exec({ upsert_score: { score } })(wallet);
```

Fear not, young warrior, this is like 90% boilerplate code lol. The utils were given to me by the awesome Terrain template contract. All we have to add is an export at the bottom that calles the `upsert_score` function on our contract.

The `_exec` utility function is mostly just doing transaction management. It creates a client and sends off the message request. It then waits for the transaction hash to confirm the transaction was sent through. 

Let's test it out the same way we tested the score fetcher, in `terra-starter/src/pages/play.js`:
```javascript
import React, { useState, useEffect } from "react";
import * as execute from '../contract/execute';
import { useConnectedWallet } from '@terra-money/wallet-provider';

const Play = () => {
  const connectedWallet = useConnectedWallet();
  const playTime = 15;

  const [score, setScore] = useState(0);
  const [time, setTime] = useState(playTime);

  const submitScore = async () => {
    if (connectedWallet && connectedWallet.network.name === 'testnet') {
      // This will return the transaction object on confirmation
      const tx = await execute.setScore(connectedWallet, score);
      console.log(tx);
      // Once the transaction is confirmed, we let the user know
      alert('Score submitted!');
    }
  };

  return (
    <div className="score-board-container">
      <div className="play-container">
        <span>Score: {score}</span>
        <span>Fight!</span>
        <span>Time left: {time} s</span>
      </div>

      {/* Button to manually set score for testing */}
      <button className="cta-button connect-wallet-button" onClick={() => setScore(score => score + 1)}>+1 score</button>

      {/* Button to submit score to be removed later, don't be a cheater >:(  */}
      <button className="cta-button connect-wallet-button" onClick={submitScore}>Submit score</button>
    </div>
  )
}

export default Play;
```

Alrighty, we're back in familiar territory. The execute function is identical to the query function except for the additional parameter we're passing in. For new we're just going to fake it. 

Save you file, refresh, and tap the +1 to increase your score a few times. When you click submit, you should get a transaction confirmation. 

![](https://hackmd.io/_uploads/By_i8D-Bq.png)

This will send your score to the contract!

If you check the console, you'll see a bunch of HTTP code 400 errors. These are expected. Remember how `_exec` in `execute.js` checks for the transaction hash a bunch of times? When the transaction hasn't been confirmed, you get HTTP 400 bad request errors.

Congrats. You now know how to interact with every smart contract on the Terra mainnet. It's all about the `execute` and `query`!

### 🚨 Progress Report

*Please do this else Raza will be sad :(*

Post a screenshot of your console showing the confirmed transaction!

You're doing great, the most fun part is up next :).
