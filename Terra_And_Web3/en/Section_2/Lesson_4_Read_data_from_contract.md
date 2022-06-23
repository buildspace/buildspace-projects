Our web app is starting to take shape now. Soon you'll become a game developer too 😈

For now, let's use packages called Terrajs and LCDClient to retrieve scores from our contract!

The first thing you'll need to do is set your contract details in your `refs.terrain.json` folder. This is where we will tell Terrajs to look for contract addresses. Look for a `refs.terrain.json` file in the `Learn-Terra/clicker-portal` directory. Copy whatever it has into the file inside your `terra-starter` folder. I repeat: 

Copy the data from 
```
Learn-Terra/clicker-portal/refs.terrain.json
```
to 
```
Learn-Terra/clicker-portal/terra-starter/refs.terrain.json
```

You should have two networks and addresses there. Here's what my file looks like:
```json
{
  "localterra": {
    "clicker": {
      "codeId": "34",
      "contractAddresses": {
        "default": "terra1hpyvv9l8ngtc3rzmgad3pxf4l0tqm2prps6dd6"
      }
    }
  },
  "testnet": {
    "clicker": {
      "codeId": "65532",
      "contractAddresses": {
        "default": "YOUR_DEPLOYED_CONTRACT_ADDRESS_WILL_BE_HERE"
      }
    }
  }
}
```

The Terrajs package is smart enough that it will automatically shift which network it's communicating on based on which network the extension is connected to. So if you connect your extension to the localterra network, it will use the localterra contract address & network. Pretty cool, eh?

### 📩 Fetch our scores from the contract
Getting our scores from the contract on the testnet is going to be very similar to how we did it using Terrain locally. We're going to follow the same `QueryMsg` and `ExecuteMsg` structure. Start by creating these three files in the `terra-starter/src/contract` directory: `address.js`, `execute.js`, `query.js`. 

`address.js` will load the correct contract address based on the network. It's tiny but powerful:
```javascript
import config from "../refs.terrain.json"

export const contractAddress = (wallet) => config[wallet.network.name].clicker.contractAddresses.default
```

We're exporting this so we can use it in different places like `execute.js` and maybe even the UI.

Next, we're going to set up our query message sender in `query.js`:
```javascript
import { LCDClient } from "@terra-money/terra.js";
import { contractAddress } from "./address";

export const getScores = async (wallet) => {
    console.log("Contract address is ", contractAddress(wallet));
    const lcd = new LCDClient({
        URL: wallet.network.lcd,
        chainID: wallet.network.chainID,
    });
    return lcd.wasm.contractQuery(contractAddress(wallet), { get_scores: {} });
};
```

Look familiar? It's the same thing we did in `clicker-portal/lib/index.js`, just has some extra syntax.

The [Light Client Daemon (LCD)](https://docs.terra.money/docs/develop/how-to/start-lcd.html) gives us a REST-based adapter for the RPC endpoints. Basically, it lets us talk to the blockchain nodes. 

We use its built in function called `contractQuery` to call the `get_scores` method. The first argument is our wallet, which is used as the sender. 

Before we get into the UI, let's test that this works in `Leaderboard.js`:
```javascript
import * as query from '../contract/query';
import { useConnectedWallet } from '@terra-money/wallet-provider';

const Leaderboard = () => {
  const connectedWallet = useConnectedWallet();

  const fetchScores = async () => {
    if (connectedWallet && connectedWallet.network.name === 'testnet') {
      console.log("Scores fetched", (await query.getScores(connectedWallet)).scores);
    }
  };

  fetchScores();

  return (
    <>
    </>
  );
};

export default Leaderboard;
```

If you save your document and refresh `localhost:3000/leaderboard`, you should see the scores logged in your console! **This might be empty if you haven't added any scores lol.** Use the Terrain console to add one!

![](https://hackmd.io/_uploads/rklnvI-Sq.png)

LETS GOOOOO. We're contract readers now. Put on your fancy monocle. 

### 🥇 Create our leaderboard
We've got the score, let's make it pretty. 

First we'll move our `fetchScores` into a useEffect so it gets called properly:
```javascript
  useEffect(() => {
    const fetchScores = async () => {
      if (connectedWallet && connectedWallet.network.name === 'testnet') {
        // We're returning instead of logging           
        return (await query.getScores(connectedWallet)).scores;
      }
    };

    fetchScores().then(scores => {
      // We're going to add a stateful variable to store scores
      setScores(scores);
    });
      // We want to only run this only when the wallet is loaded
  }, [connectedWallet]);
```

The render function is going to map through the scores and format them. I love React.
```javascript
  const renderScores = (scores) => {
    {/* If the game has never been played :(*/}
    if (!scores || scores.length < 1) {
      return <div> No scores available :( </div>;
    }
      
    // Load the scores from the stateful React variable as they're updated
    return scores.map((score, index) => {
      return (
        <div key={index} className="score">
          {/* Format is address: score */}
          {/* Slice address to first 5 and last 4 digits so it looks like terra...a1b2*/}
          <span>
            {score[0].slice(0, 5) + '...' + score[0].slice(-4)}:{' '}
            {score[1].toString().padStart(2, '0')}
          </span>
        </div>
      );
    });
  };
```


Putting it all together, (I also added a loading state):
```javascript
import { Link } from 'react-router-dom';
import * as query from '../contract/query';
import { useState, useEffect } from 'react';
import { useConnectedWallet } from '@terra-money/wallet-provider';

const Leaderboard = () => {
  const [scores, setScores] = useState();
  const [loading, setLoading] = useState(true);
  const connectedWallet = useConnectedWallet();

  useEffect(() => {
    setLoading(true);
    const fetchScores = async () => {
      if (connectedWallet && connectedWallet.network.name === 'testnet') {      
        return (await query.getScores(connectedWallet)).scores;
      }
    };

    fetchScores().then(scores => {
      setScores(scores);
      setLoading(false);
    });
  }, [connectedWallet]);

  const renderScores = (scores) => {
    if (!scores || scores.length < 1) {
      return <div> No scores available :( </div>;
    }

    return scores.map((score, index) => {
      return (
        <div key={index} className="score">
          {/* Format is address: score */}
          {/* Slice address to first 5 and last 4 digits so it looks like terra...a1b2*/}
          <span>
            {score[0].slice(0, 5) + '...' + score[0].slice(-4)}:{' '}
            {score[1].toString().padStart(2, '0')}
          </span>
        </div>
      );
    });
  };

  return (
    <main className="App">
      <header>
        <Link to="/" className="home-link">
          <div className="header-titles">
            <h1>⚔ Goblin War ⚔️</h1>
            <p>Only you can save us from Goblin town</p>
          </div>
        </Link>
      </header>

      <div className="score-board-container">
        <h3>Scoreboard</h3>
        {/* If loading, show loading, else render */}
        {loading ? (
          <div>Loading...</div>
        ) : (
          renderScores(scores)
        )}
        
        <div></div>
      </div>
    </main>
  );
};

export default Leaderboard;
```

Go to [http://localhost:3000/leaderboard](http://localhost:3000/leaderboard) and see how beautiful it looks!

![](https://hackmd.io/_uploads/rJmpsUWSc.png)


### 🚨 Progress Report
*Please do this else Raza will be sad :(*

Post a screenshot in #progress with your scoreboard!
