This section will cover some really valuable goodies that you’ll see on all sorts of dapps out there. This is the time to take your new found skills and be super creative! You have the building blocks - now you are ready build the perfect dapp for you.

First off, the UX on our app can be improved a lot. Let’s start by showing the user their address. Head over to your React app and update your `header-container` div in App.js:

```html
<div className="header-container">
  <header>
    <div className="left">
      <p className="title">🐱‍👤 Ninja Name Service</p>
      <p className="subtitle">Your immortal API on the blockchain!</p>
    </div>
    {/* Display a logo and wallet connection status*/}
    <div className="right">
      <img alt="Network logo" className="logo" src={ network.includes("Polygon") ? polygonLogo : ethLogo} />
      { currentAccount ? <p> Wallet: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)} </p> : <p> Not connected </p> }
    </div>
  </header>
</div>
```

What’s happening here is a bit of JavaScript fanciness. If you don't understand the `? :`  syntax, skim [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator), those are ternary operators and they're really cool. One thing worth mentioning here is that I'm just checking if the network name has the word "Polygon" in it. So if you're on the Polygon mainnet, the polygon logo shows!

Ahh more errors... Don’t worry this is expected and we are going to fix them right now!

Head back to the top of the component and add the following (do not copy/paste the whole thing, you will break it):

```jsx
// At the very top of the file, after the other imports
import polygonLogo from './assets/polygonlogo.png';
import ethLogo from './assets/ethlogo.png';
import { networks } from './utils/networks';

const App = () => {
  // Create a stateful variable to store the network next to all the others
    const [network, setNetwork] = useState('');
  
  // Update your checkIfWalletIsConnected function to handle the network
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log('Make sure you have metamask!');
      return;
    } else {
      console.log('We have the ethereum object', ethereum);
    }
    
    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log('Found an authorized account:', account);
      setCurrentAccount(account);
    } else {
      console.log('No authorized account found');
    }
    
    // This is the new part, we check the user's network chain ID
    const chainId = await ethereum.request({ method: 'eth_chainId' });
    setNetwork(networks[chainId]);

    ethereum.on('chainChanged', handleChainChanged);
    
    // Reload the page when they change networks
    function handleChainChanged(_chainId) {
      window.location.reload();
    }
  };

// The rest of the file stays the same
```

The rest of your App.js should remain the same. Check it out in your browser, it should look like this:

![https://i.imgur.com/wh4zap4.png](https://i.imgur.com/wh4zap4.png)

Now that we are checking their network, we should disable the minting form if they’re not on the Mumbai testnet. Add this to the top of your `renderInputForm`: 

```jsx
const renderInputForm = () =>{
  // If not on Polygon Mumbai Testnet, render "Please connect to Polygon Mumbai Testnet"
  if (network !== 'Polygon Mumbai Testnet') {
    return (
      <div className="connect-wallet-container">
        <p>Please connect to the Polygon Mumbai Testnet</p>
      </div>
    );
  }

// The rest of the function remains the same
return (	
  ...
```

All it does is renders a text message instead of the input fields and mint button. Looking pretty fancy, eh?

### 🦊 Add and switch networks in MetaMask

We want our app to be accessible to all sorts of users - the ones just starting off w/ web3 and the experienced ones as well!

Right now, all we're doing is telling them to connect to Mumbai. It would be a lot cooler if we added a button that did that for them! Plus lazy people like me will really appreciate it lol. We can use the MetaMask API to actually help them swap and add networks. Here's what that looks like in a function (in App.js again, you can put it next to the wallet connection functions): 

```jsx
const switchNetwork = async () => {
  if (window.ethereum) {
    try {
      // Try to switch to the Mumbai testnet
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x13881' }], // Check networks.js for hexadecimal network ids
      });
    } catch (error) {
      // This error code means that the chain we want has not been added to MetaMask
      // In this case we ask the user to add it to their MetaMask
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {	
                chainId: '0x13881',
                chainName: 'Polygon Mumbai Testnet',
                rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
                nativeCurrency: {
                    name: "Mumbai Matic",
                    symbol: "MATIC",
                    decimals: 18
                },
                blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
              },
            ],
          });
        } catch (error) {
          console.log(error);
        }
      }
      console.log(error);
    }
  } else {
    // If window.ethereum is not found then MetaMask is not installed
    alert('MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html');
  } 
}
```

The first thing this function does is try to change their network like this:

```jsx
await window.ethereum.request({
  method: 'wallet_switchEthereumChain',
  params: [{ chainId: '0x13881' }], // Check networks.js for hexadecimal network ids
});
```

The `chainId` parameter is a hexadecimal value that identifies different networks. The most common ones are in the `networks.js` file. If you add a fancy new network later, you can just google the ID for it. The second part just prompts the user to add the network if they don’t have it. If you want to learn more about this bit, you can check the MetaMask docs [here](https://docs.metamask.io/guide/rpc-api.html#unrestricted-methods).

The last part of all this is just adding a button that calls this function into our `renderInputForm`:

```jsx
const renderInputForm = () =>{
  // If not on Polygon Mumbai Testnet, render the switch button
  if (network !== 'Polygon Mumbai Testnet') {
    return (
      <div className="connect-wallet-container">
        <h2>Please switch to Polygon Mumbai Testnet</h2>
        {/* This button will call our switch network function */}
        <button className='cta-button mint-button' onClick={switchNetwork}>Click here to switch</button>
      </div>
    );
  }

  // The rest of the function remains the same
  return (
```

### 🚨Progress report

Jump into the CSS and chuck a fancy gradient on the address container or the switch button. Maybe bring back the corners?

Post a screenshot of your newly added component :)