### 💌 Getting data from the user

Awesome. **We made it**. We've deployed our website. We've deployed our contract. We've connected our wallet. **Now we need to actually call our contract from our web app** using the credentials we have access to now from MetaMask! 

To start, we need to get the user’s domain name and what data they’re going to store, so let’s do that!

```jsx
import React, { useEffect, useState } from "react";
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import {ethers} from "ethers";

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
// Add the domain you will be minting
const tld = '.ninja';
const CONTRACT_ADDRESS = 'YOUR_CONTRACT_ADDRESS_HERE';

const App = () => {
	const [currentAccount, setCurrentAccount] = useState('');
	// Add some state data propertie
	const [domain, setDomain] = useState('');
	const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState('');

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask -> https://metamask.io/");
        return;
      }
			
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

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
	};

	// Render methods
	const renderNotConnectedContainer = () => (
		<div className="connect-wallet-container">
			<img src="https://media.giphy.com/media/3ohhwytHcusSCXXOUg/giphy.gif" alt="Ninja donut gif" />
      {/* Call the connectWallet function we just wrote when the button is clicked */}
			<button onClick={connectWallet} className="cta-button connect-wallet-button">
				Connect Wallet
			</button>
		</div>
	);
	
	// Form to enter domain name and data
	const renderInputForm = () =>{
		return (
			<div className="form-container">
				<div className="first-row">
					<input
						type="text"
						value={domain}
						placeholder='domain'
						onChange={e => setDomain(e.target.value)}
					/>
					<p className='tld'> {tld} </p>
				</div>

				<input
					type="text"
					value={record}
					placeholder='whats ur ninja power'
					onChange={e => setRecord(e.target.value)}
				/>

				<div className="button-container">
					<button className='cta-button mint-button' disabled={null} onClick={null}>
						Mint
					</button>  
					<button className='cta-button mint-button' disabled={null} onClick={null}>
						Set data
					</button>  
				</div>

			</div>
		);
	}
  
	useEffect(() => {
		checkIfWalletIsConnected();
	}, []);

	return (
		<div className="App">
			<div className="container">
				<div className="header-container">
					<header>
						<div className="left">
							<p className="title">🐱‍👤 Ninja Name Service</p>
							<p className="subtitle">Your immortal API on the blockchain!</p>
						</div>
					</header>
				</div>
				
				{!currentAccount && renderNotConnectedContainer()}
				{/* Render the input form if an account is connected */}
				{currentAccount && renderInputForm()}
				
				<div className="footer-container">
					<img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
					<a
						className="footer-text"
						href={TWITTER_LINK}
						target="_blank"
						rel="noreferrer"
					>{`built with @${TWITTER_HANDLE}`}</a>
				</div>
			</div>
		</div>
	);
};

export default App;
```

Not a lot has changed here! All we’ve added is two stateful variables under the old `currentAccount` variable and a `renderInputForm` function that returns input fields. 

Lets get a more focused look on these new additions:

```jsx
// Update this to your top level domain
const tld = '.ninja'; 

const App = () => {
// New React state variables 
const [domain, setDomain] = useState('');
const [record, setRecord] = useState('');

return (
	<div className="App">
			...
			{/* Header stuff here */}

			{/* This will hide the connect button if currentAccount isn't empty*/}
			{!currentAccount && renderNotConnectedContainer()}

			{/* Render the input form if an account is connected */}
			{currentAccount && renderInputForm()}
			
			{/* Footer stuff here*/}
			...
	</div>
);
```

The `&&` syntax might look a bit weird, all it does is returns the render function if the condition before the `&&` is true. So if `currentAccount` is empty (i.e. NOT true), it’ll render the connect wallet button. 

The `renderInputForm` is a pretty standard React block that uses input fields tied to stateful variables. You can read more about them [here](https://reactjs.org/docs/hooks-state.html). 

If you take a look at your app, you’ll see the input fields:

![https://i.imgur.com/8AF7yB5.png](https://i.imgur.com/8AF7yB5.png)

**Note:** the mint button doesn’t do anything right now, this is expected! 

Very cool 😎. We can now easily collect inputs from our user and call our contract! In the next session, you are going to see how magical this is by calling the functions we made earlier on our smart contract!

### 🧞 Interacting with the contract

EPIC. We are now ready to take this data and send it off to our smart contract to actually mint our domain! Lets do this 🤘

Remember the `register` function we put in our contract that mints a domain as an NFT? We’ll now need to call this function from our web app. Go ahead and add the following function under the `checkIfWalletIsConnected` function.

```jsx
const mintDomain = async () => {
	// Don't run if the domain is empty
	if (!domain) { return }
	// Alert the user if the domain is too short
	if (domain.length < 3) {
		alert('Domain must be at least 3 characters long');
		return;
	}
	// Calculate price based on length of domain (change this to match your contract)	
	// 3 chars = 0.5 MATIC, 4 chars = 0.3 MATIC, 5 or more = 0.1 MATIC
	const price = domain.length === 3 ? '0.5' : domain.length === 4 ? '0.3' : '0.1';
	console.log("Minting domain", domain, "with price", price);
  try {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);

			console.log("Going to pop wallet now to pay gas...")
      let tx = await contract.register(domain, {value: ethers.utils.parseEther(price)});
      // Wait for the transaction to be mined
			const receipt = await tx.wait();

			// Check if the transaction was successfully completed
			if (receipt.status === 1) {
				console.log("Domain minted! https://mumbai.polygonscan.com/tx/"+tx.hash);
				
				// Set the record for the domain
				tx = await contract.setRecord(domain, record);
				await tx.wait();

				console.log("Record set! https://mumbai.polygonscan.com/tx/"+tx.hash);
				
				setRecord('');
				setDomain('');
			}
			else {
				alert("Transaction failed! Please try again");
			}
    }
  }
  catch(error){
    console.log(error);
  }
}
```

This will throw some errors. Don't worry! We'll fix it in a bit. Let’s step through the code a bit :).

```jsx
const provider = new ethers.providers.Web3Provider(ethereum);
const signer = provider.getSigner();
```

`ethers` is a library that helps our frontend talk to our contract. 

Be sure to import it at the top using `import { ethers } from "ethers";`, right after we import the Twitter logo.

A "provider" is what we use to actually talk to Polygon nodes. Remember how we were using QuickNode to **deploy**? Well in this case we use nodes that MetaMask provides in the background to send/receive data from our deployed contract.

[Here's](https://docs.ethers.io/v5/api/signer/#signers) a link explaining what a signer is on line 2.

```jsx
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);
```

We'll cover this in a bit. Just know that this line is what actually **creates the connection to our contract**. It needs: the contract's address, something called an `abi` file, and a `signer`. These are the three things we always need to communicate with contracts on the blockchain.

Notice how I hardcode `const CONTRACT_ADDRESS` at the top of the file with other constants? 

**Be sure to change this variable to the deployed contract address of your latest deployed contract**. 

If you forgot it or lost it don't worry, just re-deploy the contract and get a new address :).

```jsx
console.log("Going to pop wallet now to pay gas...")
let tx = await contract.register(domain, {value: ethers.utils.parseEther(price)});
// Wait for the transaction to be mined
const receipt = await tx.wait();

// Check if the transaction was successfully completed
if (receipt.status === 1) {
	console.log("Domain minted! https://mumbai.polygonscan.com/tx/"+tx.hash);
	
	// Set the record for the domain
	tx = await contract.setRecord(domain, record);
	await tx.wait();

	console.log("Record set! https://mumbai.polygonscan.com/tx/"+tx.hash);
	
	setRecord('');
	setDomain('');
}
else {
	alert("Transaction failed! Please try again");
}
```

The next bit of the code should already make sense. It looks sorta like the code we deployed with :)! We call our contract using `register`, wait for it to be mined, and then link the Polygonscan URL!

We're actually going to be calling two contract functions here. The second one is `setRecord` - to set the record for the domain we're minting. Since our domain needs to exist on the contract before we can set a record for it, we have to wait for the first transaction to be successfully mined. `tx.wait()` gives us a receipt which we can check, how handy!

Finally, we'll want to call this function when someone clicks the "Mint NFT" button. Add an `onClick` for the mint button in the `renderInputForm` function to call the `mintDomain` function. Everything else remains the same.

```jsx
const renderInputForm = () => {
  return (
    <div className="form-container">
      <div className="first-row">
        <input
          type="text"
          value={domain}
          placeholder="domain"
          onChange={e => setDomain(e.target.value)}
        />
        <p className='tld'> {tld} </p>
      </div>

      <input
        type="text"
        value={record}
        placeholder='whats ur ninja power?'
        onChange={e => setRecord(e.target.value)}
      />

      <div className="button-container">
        {/* Call the mintDomain function when the button is clicked*/}
        <button className='cta-button mint-button' onClick={mintDomain}>
          Mint
        </button> 
      </div>

    </div>
  );
}
```

Note: You’ll still see errors and the mint button won’t work!

### 📂 ABI files

**Here’s a little video Farza made explaining all this ABI stuff. Please give it a watch as he goes over some important stuff**

[Loom](https://www.loom.com/share/2d493d687e5e4172ba9d47eeede64a37)

*Note: Since this explanation is from another project, the filenames will be different!*

So — when you compile your smart contract, the compiler spits out a bunch of files needed that lets you interact with the contract. You can find these files in the `artifacts` folder located in the root of your Solidity project.

The ABI file is something our web app needs to know how to communicate with our contract. Read about it [here](https://docs.soliditylang.org/en/v0.8.14/abi-spec.html).

The contents of the ABI file can be found in a fancy JSON file in your hardhat project:

`artifacts/contracts/Domains.sol/Domains.json`

So, the question becomes how do we get this JSON file into our frontend? There are a lot of fancy ways to do this, but we are going to use the good ‘ol copy and paste method for now!

Copy the contents from your `Domains.json` and then head to your web app. You are going to make a new folder called `utils` under `src`. In that folder you are going to create a file named `contractABI.json`. So the full path will look like:

`src/utils/contractABI.json`

Paste the ABI file contents right there in our new file.

Now that you have your file with all your ABI content ready to go, it's time to import it into your `App.js` file. It's just going to be:

```jsx
import contractAbi from './utils/contractABI.json';
```

And we're all done. Shouldn't have errors anymore!

All you'll need to do from here is enter a domain name, a record, click "Mint", pay gas (using your fake MATIC), wait for the transaction to be mined, and bam! Your domain should show up on OpenSea either immediately or within 5-15m max.

You may be asking yourself wtf gas is. I'm not going to answer that here. But, you can start researching [here](https://ethereum.org/en/developers/docs/gas/) ;).

### 🤩 Test

You should be able to go and actually mint a domain NFT right from your website now. 

**Let's go!**

This is basically how all these NFT minting sites work and you just got it done yourself :).

### ✈️ A note on contract redeploys

Let's say you want to change your contract. You'd need to do 3 things:

1. We need to deploy it again.
2. We need to update the contract address on our frontend.
3. We need to update the abi file on our frontend.

**People constantly forget to do these 3 steps when they change their contract. Don't forget lol.**

Why do we need to do all this? Well, it's because smart contracts are **immutable.** They can't change. They're permanent. That means changing a contract requires a full redeploy. This will also **reset** all the variables since it'd be treated as a brand new contract. **That means we'd lose all our domain data if we wanted to update the contract's code.**

### 🚨Progress report

Post a screenshot of your console after you mint a few NFTs and show off all those `console.log`s!
