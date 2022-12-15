## 💚 Mint NFT through our website

Awesome. We made it. We've deployed our website. We've deployed our contract. We've connected our wallet. **Now we need to actually call our contract from our web app** using the credentials we have access to now from Metamask!

So, remember, our contract has the function `makeAnEpicNFT` which will actually mint the NFT. We'll need to now call this function from our web app. Go ahead and add the following function below the `connectWallet` function.

```javascript
const askContractToMintNft = async () => {
  const CONTRACT_ADDRESS = "INSERT_YOUR_DEPLOYED_GOERLI_CONTRACT_ADDRESS";

  try {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

      console.log("Going to pop wallet now to pay gas...")
      let nftTxn = await connectedContract.makeAnEpicNFT();

      console.log("Mining...please wait.")
      await nftTxn.wait();
      
      console.log(`Mined, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`);

    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error)
  }
}
```

This will throw some errors. Don't worry! We'll fix it in a bit. Lets step through the code a bit.

```javascript
const provider = new ethers.providers.Web3Provider(ethereum);
const signer = provider.getSigner();
```

`ethers` is a library that helps our frontend talk to our contract. Be sure to import it at the top using `import { ethers } from "ethers";`.

A "Provider" is what we use to actually talk to Ethereum nodes. Remember how we were using QuickNode to **deploy**? Well in this case we use nodes that Metamask provides in the background to send/receive data from our deployed contract.

[Here's](https://docs.ethers.io/v5/api/signer/#signers) a link explaining what a signer is on line 2.

```javascript
const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);
```

We'll cover this in a bit. Just know that this line is what actually **creates the connection to our contract**. It needs: the contract's address, something called an `abi` file, and a `signer`. These are the three things we always need to communicate with contracts on the blockchain.

Notice how I hardcode `const CONTRACT_ADDRESS`? **Be sure to change this variable to the deployed contract address of your latest deployed contract**. If you forgot it or lost it don't worry, just re-deploy the contract and get a new address :).

```javascript
console.log("Going to pop wallet now to pay gas...")
let nftTxn = await connectedContract.makeAnEpicNFT();

console.log("Mining...please wait.")
await nftTxn.wait();

console.log(`Mined, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`);
```

The rest of the code should already make sense. It looks sorta like the code we deployed with :)! We call our contract using `makeAnEpicNFT`, wait for it to be mined, and then link the Etherscan URL!

Finally, we'll want to call this function when someone clicks the "Mint NFT" button.

```javascript
return (
  {currentAccount === "" 
    ? renderNotConnectedContainer()
    : (
      /** Add askContractToMintNft Action for the onClick event **/
      <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
        Mint NFT
      </button>
    )
  }
);
```


## 📂 ABI files

**Made a little video here explaining all this ABI stuff. Please give it a watch I go over some important stuff!**
[Loom](https://www.loom.com/share/2d493d687e5e4172ba9d47eeede64a37)

So — when you compile your smart contract, the compiler spits out a bunch of files needed that lets you interact with the contract. You can find these files in the `artifacts` folder located in the root of your Solidity project.

The ABI file is something our web app needs to know how to communicate with our contract. Read about it [here](https://docs.soliditylang.org/en/v0.8.14/abi-spec.html).

The contents of the ABI file can be found in a fancy JSON file in your hardhat project:

`artifacts/contracts/MyEpicNFT.sol/MyEpicNFT.json`

So, the question becomes how do we get this JSON file into our frontend? Just going to copy-paste.

Copy the contents from your `MyEpicNFT.json` and then head to your web app. You are going to make a new folder called `utils` under `src`. Under `utils` create a file named `MyEpicNFT.json`. So the full path will look like:

`src/utils/MyEpicNFT.json`

Paste the ABI file contents right there in our new file.

Now that you have your file with all your ABI content ready to go, it's time to import it into your `App.js` file. It's just going to be:

```javascript
import myEpicNft from './utils/MyEpicNFT.json';
```

And we're all done. Shouldn't have errors anymore! You're ready to mint some NFTs!

All you'll need to do from here is click "Mint NFT", pay gas (using your fake ETH), wait for the transaction to be mined, and bam! Your NFT should show up on OpenSea either immediately or within 5-15m max.

You may be asking yourself wtf gas is. I'm not going to answer that here. But, you can start researching [here](https://ethereum.org/en/developers/docs/gas/) ;).

## 🤩 Test

You should be able to go and actually mint an NFT right from your website now. **Let's go!!! THAT'S EPICCCCC.** This is basically how all these NFT minting sites work and you just got it done yourself :).

I actually go through and test the whole thing in the ABI video I already linked above. Be sure to give it a watch! I go over some super important stuff around what to do when you **change** your contract. Because your contract is permanent, changes require you to redeploy, update the address on your frontend, and finally update the ABI file on the frontend.

## ✈️ A note on contract redeploys

Let's say you want to change your contract. You'd need to do 3 things:

1. We need to deploy it again.

2. We need to update the contract address on our frontend.

3. We need to update the abi file on our frontend.

**People constantly forget to do these 3 steps when they change their contract. Don't forget lol.**

Why do we need to do all this? Well, it's because smart contracts are **immutable.** They can't change. They're permanent. That means changing a contract requires a full redeploy. This will also **reset** all the variables since it'd be treated as a brand new contract. **That means we'd lose all our NFT data if we wanted to update the contract's code.**

## 🚨Progress report

Post a screenshot of your console after you mint a few NFTs and show off all those `console.log`s!
