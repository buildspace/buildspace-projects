💸 Send Ethereum to people waving at you
----------------------------------------

Now what we want to do is send some Ethereum to people waving at us! For example, maybe you want to make it where there's a 1% chance someone can win $5 from waving at you. Or, maybe you want to make it where everyone who waves at you gets $0.01 in Etheruem for waving at you lol.

You can even make it where you can manually send Ethereum to people whose messages you loved the most. Maybe they sent you an awesome song!!

**Easily sending Ethereum to users is a core part of smart contracts and one of the coolest parts about them**, so, let's do it!

To start we're just going to give everyone who waves at us `0.0001 ether`. Which is $0.31 :). And this is all happening on testnet, so, it's fake $!

Check out my updated `wave` function on `WavePortal.sol`.

```solidity
function wave(string memory _message) public {
        totalWaves += 1;
        console.log("%s has waved!", msg.sender);

        waves.push(Wave(msg.sender, _message, block.timestamp));

        emit NewWave(msg.sender, block.timestamp, _message);

        uint256 prizeAmount = 0.0001 ether;
        require(
            prizeAmount <= address(this).balance,
            "Trying to withdraw more money than they contract has."
        );
        (bool success, ) = (msg.sender).call{value: prizeAmount}("");
        require(success, "Failed to withdraw money from contract.");
    }
```

This is pretty awesome.

On line 7, I just initiate a prize amount. Solidity actually lets us use the keyword `ether` so we can easily represent monetary amounts. Convenient :)!

On line 8 we have some new keywords as well. This is `require`, and it basically checks to see that some condition is true. If it's not true, it will quit the function and cancel the transaction. It's like a fancy if statement!

In this case, it's checking if `prizeAmount <= address(this).balance`. Here, `address(this).balance` is the **balance of the contract itself.**

Why? **Well, for us to send Ethereum to someone, our contract needs to have Ethereum on it.**

How this works is when we first deploy the contract, we "fund" it :). So far, we've **never** funded our contract!! It's always been worth 0 ETH. That means our contract can't send people Ethereum because it **simply doesn't have any**! We'll cover funding in the next section!

What's cool about

```
require(prizeAmount <= address(this).balance, "Trying to withdraw more money than the contract has.");
```

is that it lets us make sure that the *balance of the contract* is bigger than the *prize amount,* and if it is, we can move forward with giving the prize! If it isn't `require` will essentially kill the transaction and be like, "Yo, this contract can't even pay you out!". 

Line 9 is the magic line where we send money :). The syntax is a little weird! Notice how we pass it `prizeAmount`!

Line 10 is where we know the transaction was a success :). If it wasn't, it'd mark the transaction as an error and say `"Failed to withdraw money from contract."`.

Pretty awesome, right :)?

🏦 Fund the contract we can even send Ethereum!
-----------------------------------------------

We've now set up our code send Ethereum. Nice! Now we need to actually make sure our contract is funded, otherwise, we have no Ethereum to send!

We're going to first work in `run.js`. Remember, run.js is like our testing grounds where we want to make sure our contracts core functionality works before we go and deploy it. It's **really hard** to debug contract code and frontend code at the same time, so, we separate it out!

Lets head to `run.js` and make some changes to make sure everything works. Here's my updated `run.js`.

```javascript
const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();
  console.log('Contract addy:', waveContract.address);

  /*
   * Get Contract balance
   */
  let contractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  );
  console.log(
    'Contract balance:',
    hre.ethers.utils.formatEther(contractBalance)
  );

  /*
   * Send Wave
   */
  let waveTxn = await waveContract.wave('A message!');
  await waveTxn.wait();

  /*
   * Get Contract balance to see what happened!
   */
  contractBalance = await hre.ethers.provider.getBalance(waveContract.addresss);
  console.log(
    'Contract balance:',
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

The magic is on line 3. This where I say, "go and deploy my contract and fund it with 0.1 Ethereum". This will remove Ethereum from my wallet, and use it to fund the contract. **That's it**.

On lines 7 + 8 I test out to see if my contract actually has a balance of 0.1. I use a function that `ethers` gives me here called `getBalance` and pass it my contract's address!

But then, we also want to see if when we call `wave` if 0.0001 Ethereum is properly removed from the contract!! That's why I print the balance out again on lines 13 + 14 after I call `wave`.

When we run 

```
npx hardhat run scripts/run.js
```

You'll see we run into a bit of an error!

It'll say something like

```
Error: non-payable constructor cannot override value
```

What this is saying is, our contract isn't allowed to pay people right now! This is quick fix, we need to add the keyword `payable` to our constructor in `WavePortal.sol`. Check it out:

```solidity
constructor() payable {
    console.log("We have been constructed!");
}
```

That's it :).

Now, when I do 

```
npx hardhat run scripts/run.js
```

This is what I get:

![](https://i.imgur.com/8jZHL6b.png)

**Boom**.

We just sent some Ethereum from our contract, big success! And, we know we succeeded because the contract balance went down by 0.0001 Ethereum from 0.1 to 0.0999!

✈️ Update deploy script to fund contract
----------------------------------------

We need to make a small update to `deploy.js`.

```javascript
const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther('0.1'),
  });

  await waveContract.deployed();

  console.log('WavePortal address: ', waveContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
```

All I did was fund the contract 0.1 Ethereum like this:

```javascript
const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther('0.1'),
});
```

 And I also added `await waveContract.deployed()` to make it easy for me to know when it's deployed!

Easy!

Lets deploy our contract using the same old line

```
npx hardhat run scripts/deploy.js --network rinkeby
```

Now when you go to [Etherscan](https://rinkeby.etherscan.io/) and paste in your contract address you'll see that your contract now has a value of 0.1 Ethereum! Success!

**Remember to update your frontend with the new contract address *and* the new ABI file. Otherwise, it will** **break**. Test out your wave function and make sure it still works!

🎁 Wrap Up
----------

There is something about using actual ETH to fuel your contracts right? Take a look at [this link](https://gist.github.com/adilanchian/236fe9f3a56b73751060800cae3a780d) to see all the code written in this section! 