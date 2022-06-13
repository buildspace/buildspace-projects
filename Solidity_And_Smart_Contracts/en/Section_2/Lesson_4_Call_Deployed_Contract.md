# Lesson_4_Call_Deployed_Contract

## 📒 Read from the blockchain through our website

Awesome. We made it. We’ve deployed our website. We’ve deployed our contract. We’ve connected our wallet. Now we need to actually call our contract from our website using the credentials we have access to now from Metamask!

So, our smart contract has this function that retrieves the total number of waves.

```solidity
function getTotalWaves() public view returns (uint256) {
      console.log("We have %d total waves!", totalWaves);
      return totalWaves;
  }
```

Lets call this function from our website :).

First we’ll connect our website to our smart contract on the blockchain by using useContract.

```jsx
import { useAddress, useDisconnect, useMetamask, useContract } from '@thirdweb-dev/react';
const App = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect()
  //create a connection with your smart contract
  const { contract } = useContract("0xE0ab3D51a3374c371c5D8a39Dc1418FE399ae2EE");
```

Now we’ll write a function to get the total amount of waves.

Go ahead and write this function right under our `connectWallet()` function.

```jsx
const wave = async () => {
    try {
      if (contract) {
        const count = await contract?.functions?.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      }
    } catch (error) {
      console.log("Oh-oh. Something went wrong. Check your code. Is your contract connected?",error);
    }

```

Awesome.

Now we need to link the function to our button

```jsx
<button onClick={wave}>Get all the waves</button>
```

However right now we’re just showing the number inside our console, we want to show it in our app.

Let’s go ahead and show the waves inside our webpage.

```jsx
const App = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect()
  const { contract } = useContract("0xE0ab3D51a3374c371c5D8a39Dc1418FE399ae2EE");
  //declare a variable to store the wave number
  const [myWaves, setMywaves] = useState("");
```

```jsx
const wave = async () => {
    try {
      if (contract) {
        let count = await contract?.functions?.getTotalWaves();
        //add a line to store the wave number inside our variable
        setMywaves(count.toNumber());
        console.log("Retrieved total wave count...", count.toNumber());
      }
    } catch (error) {
      console.log("Oh-oh. Something went wrong:",error);
    }
}
```

Nice, and to show the number in our page.

```jsx
   <h1> {myWaves} </h1>
```

**Check out what it looks like if you were to use web3.js instead of thirdweb’s library - obvi way more lines of code!**

```jsx
const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
}
```

## 🛠 Understanding your contract

We’ve **only** used one function so far, the ‘GetTotalWaves’ method, but **we know** this contract has more functions like the ‘wave’ method to create waves

How can we see all the functions?

**We can look at our Solidity file or we can use the thirdweb dashboard - a pretty sick UI to navigate and organize your contracts.**

Head over to the [dashboard](www.thirdweb.com/dashboard), navigate to your contract and press the button `code`.

Here you can see all the functions your contract contains.

**IMAGE HERE**

Quick explanation here:

When we deployed our contract, a file called ABI was created. An ABI is basically the manual of a smart contract.

The ABI contains all the information of a contract and how to use the functions inside a contract.

The thirdweb dashboard simply reads out the ABI and displays all the read and write functions so you don’t have to include long pieces of code and do it yourself.

## 📝 Writing data

**So right now we’re reading out data on the blockchain, which is “free.”**

**But we want to be able to “wave.”** 

**That’s actually writing data on the blockchain, so we need to create a transaction and approve this with our wallet.** 

**When we write new data to our contract, we need to notify the miners so that the transaction can be mined - now that ain’t free.**

Let’s build our function.

```jsx
const createWave = async () => {
  try{
    await contract?.functions?.wave()
    console.log("wave created!")
  } catch(error){
    console.log("Oh-oh something went wrong:", error)
  }
}
```

Next link the function to the button.

```jsx
<button onClick={createWave}>create a wave</button>
```

Awesome.

Pretty simple, right :)?

What’s awesome here is while the transaction is being mined you can actually copy the contract address and paste it to [Etherscan](https://rinkeby.etherscan.io/), and see the transaction being processed in real-time :).

When we run this, you’ll see that total wave count is increased by 1. You’ll also see that Metamask pops us and asks us to pay “gas” which we pay for using our fake $. There is a great article on it [here](https://ethereum.org/en/developers/docs/gas/). Try and figure out what gas is :).

## 🎉 Success

**NICEEEEEEE :).**

Really good stuff. We now have an actual client that can read and write data to the blockchain. From here, you can do whatever you want. You have the basics down. You can build a decentralized version of Twitter. You can build a way for people to post their favorite memes and allow people to “tip” the people who post the best memes with ETH. You can build a decentralized voting system that a country can use to vote in a politician where everything is open and clear.

The possibilities are truly endless.

## 🚨 Before you click “Next Lesson”

*Note: if you don’t do this, Farza will be very sad :(.*

Customize your site a little to show the total number of waves. Maybe show a loading bar while the wave is being mined, whatever you want. Do something a little different!

Once you feel like you’re ready, share the link to your website with us in #progress so we can connect our wallets and wave at you :).

## 🎁 Wrap Up

You are on your way to conquering the decentralized web. IMPRESSIVE. Take a look at all the code you wrote in this section by visiting this link to make sure you are on track with your code!