# Section_3_Lesson_2_Fund_Contract_Set_Prize

## 💸 Send ETH to people waving at you

Now what we want to do is send some ETH to people waving at us! For example, maybe you want to make it where there’s a 1% chance someone can win $5 from waving at you. Or, maybe you want to make it where everyone who waves at you gets $0.01 in ETH for waving at you lol.

You can even make it where you can manually send ETH to people whose messages you loved the most. Maybe they sent you an awesome song!!

**Easily sending ETH to users is a core part of smart contracts and one of the coolest parts about them**, so, let’s do it!

To start we’re just going to give everyone who waves at us `0.0001 ETH`. Which is $0.31 :). And this is all happening on testnet, so, it’s fake $!

Check out my updated `wave` function on `WavePortal.sol`.

```solidity
function wave(string memory _message) public {
    totalWaves += 1;
    console.log("%s has waved!", msg.sender);

    waves.push(Wave(msg.sender, _message, block.timestamp));

    emit NewWave(msg.sender, block.timestamp, _message);

    receive() external payable {}

    uint256 prizeAmount = 0.0001 ether;
    require(
        prizeAmount <= address(this).balance,
        "Trying to withdraw more money than the contract has."
    );
    (bool success, ) = (msg.sender).call{value: prizeAmount}("");
    require(success, "Failed to withdraw money from contract.");
}
```

This is pretty awesome.

With `prizeAmount` I just initiate a prize amount. Solidity actually lets us use the keyword `ether` so we can easily represent monetary amounts. Convenient :)!

We have some new keywords as well. You’ll see `require` which basically checks to see that some condition is true. If it’s not true, it will quit the function and cancel the transaction. It’s like a fancy if statement!

In this case, it’s checking if `prizeAmount <= address(this).balance`. Here, `address(this).balance` is the **balance of the contract itself.**

Why? **Well, for us to send ETH to someone, our contract needs to have ETH on it.**

How this works is when we first deploy the contract, we “fund” it :). So far, we’ve **never** funded our contract!! It’s always been worth 0 ETH. That means our contract can’t send people ETH because it **simply doesn’t have any**! We’ll cover funding in the next section!

What’s cool about

```solidity
require(prizeAmount <= address(this).balance, "Trying to withdraw more money than the contract has.");
```

is that it lets us make sure that the *balance of the contract* is bigger than the *prize amount,* and if it is, we can move forward with giving the prize! If it isn’t `require` will essentially kill the transaction and be like, “Yo, this contract can’t even pay you out!”.

`(msg.sender).call{value: prizeAmount}("")` is the magic line where we send money :). The syntax is a little weird! Notice how we pass it `prizeAmount`!

`require(success` is where we know the transaction was a success :). If it wasn’t, it’d mark the transaction as an error and say `"Failed to withdraw money from contract."`.

Pretty awesome, right :)?

## 🏦 Fund the contract so we can send ETH!

We’ve now set up our code to send ETH. Nice! Now we need to actually make sure our contract is funded, otherwise, we have no ETH to send!

We’re going to first work in run.js. Remember, run.js is like our testing grounds where we want to make sure our contracts core functionality works before we go and deploy it. It’s really hard to debug contract code and frontend code at the same time, so, we separate it out!

Lets head to run.js and make some changes to make sure everything works. Here’s my updated run.js.

Next we’re going to work in `run.js`. Remember, `run.js` is like our testing grounds where we want to make sure our contracts core functionality works before we go and deploy it. It’s **really hard** to debug contract code and frontend code at the same time, so, we separate it out!

Lets head to `run.js` and make some changes to make sure everything works. Here’s my updated `run.js`.

```jsx
const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();
  console.log("Contract addy:", waveContract.address);

  /*
   * transfer some eth from our wallet to the contract
   */

  let walletSigner = await hre.ethers.getSigners()[0]
  let sendTransaction = await walletSigner.sendTransaction({
  to: waveContract.address,
  value: ethers.utils.parseEther("0.1") // 0.1 ether
  })

  /*
   * Get Contract balance
   */
  let contractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  );
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  /*
   * Send Wave
   */
  let waveTxn = await waveContract.wave("A message!");
  await waveTxn.wait();

  /*
   * Get Contract balance to see what happened!
   */
  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  let allWaves = await waveContract.getAllWaves();
  console.log(allWaves);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
```

The magic is on `let sendTransaction = await walletSigner.sendTransaction({to: waveContract.address, value: ethers.utils.parseEther("0.1")`. This is where I say, “go and deploy my contract and fund it with 0.1 ETH”. This will remove ETH from my wallet, and use it to fund the contract. That’s it.

I do `hre.ethers.utils.formatEther(contractBalance)` to test out to see if my contract actually has a balance of 0.1. I use a function that `ethers` gives me here called `getBalance` and pass it my contract’s address!

But then, we also want to see if when we call `wave` if 0.0001 ETH is properly removed from the contract!! That’s why I print the balance out again after I call `wave`.

When we run

```bash
npx hardhat run scripts/run.js
```

You’ll see we run into a bit of an error!

It’ll say something like

```bash
Error: non-payable constructor cannot override value
```

What this is saying is, our contract isn’t allowed to pay people right now! This is quick fix, we need to add the keyword `payable` to our constructor in `WavePortal.sol`. Check it out:

```solidity
constructor() payable {
  console.log("We have been constructed!");
}
```

That’s it :).

Now, when I do

```bash
npx hardhat run scripts/run.js
```

This is what I get:

![https://i.imgur.com/8jZHL6b.png](https://i.imgur.com/8jZHL6b.png)

**Boom**.

We just sent some ETH from our contract, big success! And, we know we succeeded because the contract balance went down by 0.0001 ETH from 0.1 to 0.0999!

## ✈️ Update deploy script to fund contract

We’ve now set up our code to send ETH. Nice! Now we need to actually make sure our contract is funded, otherwise, we have no ETH to send! We will use our app to fund our contract, but before we do that, lets deploy our contract using the same old line

```bash
thirdweb deploy
```

We can use our app to send ETH to our contract like this 👇

```jsx
const sdk = useSDK();
const address = useAddress();

const transfer = async () => {
   if (sdk && address) {
      await sdk.wallet.transfer("smart_contract_address", 0.001);
   }
}
```

The code checks if we’re connected to the sdk and wallet. If we’er connected, we send some ETH to our smart contract. We can make the button visible if the connected address is the same as the owner of the smart contract. **That’s it**

Now when you go to [Etherscan](https://rinkeby.etherscan.io/) and paste in your contract address you’ll see that your contract now has a value of 0.001 ETH! Success!

**Remember to update your frontend with the new contract address *and* the new ABI file. Otherwise, it will** **break**.

Test out your wave function and make sure it still works!

## 🎁 Wrap Up

There is something about using actual ETH to fuel your contracts right? Take a look at [this link](https://gist.github.com/adilanchian/236fe9f3a56b73751060800cae3a780d) to see all the code written in this section!