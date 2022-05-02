Now that we have authentication done, let's set our landing page menu. I'm going to keep mine pretty simple with just three options:
1. Play - launches the game
2. Leaderboard - shows the top scores
3. How to play - gives you basic instructions

The way we'll set it up will make it easy to change pages or add more if you want!

### 🎯 Add a menu screen
Our menu is going to be a dedicated page. Create a file called "Menu.js" in your components folder. 

```javascript
import { Link } from 'react-router-dom';

const menu_options = [
  { name: 'Play', link: '/play' },
  { name: 'Leaderboard', link: '/leaderboard' },
  { name: 'How to play', link: '/guide' },
];

const Menu = () => {

  const renderMenu = () => {
    return menu_options.map((mb, index) => {

      const { name, link } = mb;
      
      return (
        <Link to={link} key={index} className="menu-item">
          <span className="item-text">{name}</span>
        </Link>
      );
    });
  };

  return <div className="game-menu">{renderMenu()}</div>;
};

export default Menu;
```

Nothing fancy here, just plain React and Javascript. We use the `menu_options` array to map links to components. This is where you can get creative - add another section! Maybe a credits page? Settings to make the game HARDER??? Or maybe just a meme page lol

Now to render this in `App.js`:
```javascript
import './App.css';
import { useWallet, WalletStatus } from "@terra-money/wallet-provider";

// Here's the new import for the file we just added
import Menu from './components/Menu';

function App() {
  const { status, connect, disconnect, availableConnectTypes } = useWallet();

  console.log("Wallet status is ", status);
  console.log("Available connection types:", availableConnectTypes);

  const renderConnectButton = () => {
    if (status === WalletStatus.WALLET_NOT_CONNECTED) {
      return (
        <div className="connect-wallet-div">
          <button
            type="button"
            key={`connect-EXTENSION`}
            onClick={() => connect("EXTENSION")}
            className="cta-button connect-wallet-button"
          >
            Connect wallet
          </button>
        </div>
      );
    }
    else if (status === WalletStatus.WALLET_CONNECTED) {
      return (
        <button
          type="button"
          onClick={() => disconnect()}
          className="cta-button connect-wallet-button"
        >
          Disconnect
        </button>
      );
    }
  };

  return (
    <main className="App">
      <header>
        <div className="header-titles">
          <h1>⚔ Goblin War ⚔</h1>
          <p>Only you can save us from Goblin town</p>
        </div>

      </header>

      {/* If not connected, show the goblin GIF! */}
      {status === WalletStatus.WALLET_NOT_CONNECTED && (
        <div>
          <img
            src="https://media.giphy.com/media/B19AYwNXoXtcs/giphy.gif"
            alt="Goblin gif"
          />
        </div>
      )}

      {/* Show the menu after connection */}
      {status === WalletStatus.WALLET_CONNECTED && (
          <div className="game-menu-container">
            <Menu />
          </div>
        )}
        

      {renderConnectButton()}
    </main>
  );
}

export default App;
```

I just added a conditional render statement for the menu and updated the Goblin gif to be the same. Now if their wallet is connected, they see the menu.

The syntax here can be a bit confusing  - the logical && acts like an `if` statement. If the condition before it is true, whatever is after gets returned.

### 🤨 Add a how to play guide
The process for adding pages is going to be the same every time. Update the main menu options in `Menu.js` (we've just done this), add the corresponding file in the "pages" folder and add the route in `index.js`.

Here are the menu options we previously set up:
```javascript
const menu_options = [
  { name: 'Play', link: '/play' },
  { name: 'Leaderboard', link: '/leaderboard' },
  { name: 'How to play', link: '/guide' },
];
```

Go ahead and create a folder called "pages" in your terra-starter/src folder and add these files in the pages folder: `play.js`, `leaderboard.js`, and `guide.js`.

Next, lets update the `index.js` routes. I've left comments for the stuff I added:
```javascript
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';

import { Route, Routes, BrowserRouter } from 'react-router-dom';
import './index.css';

// We import the pages we just created
import Play from './pages/play';
import Guide from './pages/guide';
import Leaderboard from './pages/leaderboard';

import { getChainOptions, WalletProvider } from '@terra-money/wallet-provider';

const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

getChainOptions().then((chainOptions) => {
  ReactDOM.render(
    <React.StrictMode>
      <WalletProvider {...chainOptions}>
        <div className="App-header">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<App />} />
              {/* Here are the routes we need to declare.*/}
              {/* These are empty so they will error for now, don't worry! */}
              <Route path="/play" element={<Play />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/guide" element={<Guide />} />
            </Routes>
          </BrowserRouter>

          <div className="footer-container">
            <img
              alt="Twitter Logo"
              className="twitter-logo"
              src="/twitter-logo.svg"
            />
            <a
              className="footer-text"
              href={TWITTER_LINK}
              target="_blank"
              rel="noreferrer"
            >{`Made with @${TWITTER_HANDLE}`}</a>
          </div>
        </div>
      </WalletProvider>
    </React.StrictMode>,
    document.getElementById('root')
  );
})
```
We'll need to restart our server to update the routes. Terminate the running process using `CTRL` + `C` and then start it again with `yarn start`.

Nice. Now the `/play`, `/leaderboard` and `/guide` routes are going to work. You'll see a "type is invalid" error though. **This is expected.** We made the files but haven't put anything in them lol

As a temporary fix, just put these in the `play.js` and `leaderboard.js` files:
```javascript
const Play = () => {
}

export default Play;
```

```javascript
const Leaderboard = () => {
 
};

export default Leaderboard; 
```
Your errors should now be gone :D

Moving on, I've kept my how to play guide pretty simple:
```javascript
import { Link } from 'react-router-dom';

const Guide = () => {
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
        <h3>How to play</h3>
        
        <div>
          <span className="help">
            Click as many goblins as you can within 15 seconds!
          </span>
        </div>
      </div>
    </main>
  );
};

export default Guide;
```

### 🚨 Progress Report
*Please do this else Raza will be sad :(*

Post a screenshot of your guide in #progress to let people know how your game is meant to be played. 
