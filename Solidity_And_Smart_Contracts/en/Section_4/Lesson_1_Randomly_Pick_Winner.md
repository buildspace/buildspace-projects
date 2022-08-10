## 😈 Randomly pick winner-

So right now, our code is set to give the waver 0.0001 ETH every single time! Our contract will run out of money pretty fast, and then the fun is over and we'd need to add more funds to our contract. In this lesson, I'll walk you through how to:

1\. **Randomly** pick a winner.

2\. Create a **cooldown** mechanism to prevent people from spam-waving you in an attempt to win the prize or annoy you. 

Let's do the random winner first!

So, generating a random number in smart contracts is widely known as a **difficult problem**.

Why? Well, think about how a random number is generated normally. When you generate a random number normally in a program, **it will take a bunch of different numbers from your computer as a source of randomness** like: the speed of the fans, the temperature of the CPU, the number of times you've pressed "L" at 3:52PM since you've bought the computer, your internet speed, and tons of other #s that are difficult for you to control. It takes **all** these numbers that are "random" and puts them together into an algorithm that generates a number that it feels is the best attempt at a truly "random" number. Make sense?

On the blockchain, there is **nearly no source of randomness**. Everything the contract sees, the public sees. Because of that, someone could game the system by just looking at the smart contract, seeing what #s it relies on for randomness, and then the person could give it the exact numbers they need to win.

Let's check out the code below :).

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;

    /*
     * We will be using this below to help generate a random number
     */
    uint256 private seed;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;

    constructor() payable {
        console.log("We have been constructed!");
        /*
         * Set the initial seed
         */
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public {
        totalWaves += 1;
        console.log("%s has waved!", msg.sender);

        waves.push(Wave(msg.sender, _message, block.timestamp));

        /*
         * Generate a new seed for the next user that sends a wave
         */
        seed = (block.difficulty + block.timestamp + seed) % 100;

        console.log("Random # generated: %d", seed);

        /*
         * Give a 50% chance that the user wins the prize.
         */
        if (seed < 50) {
            console.log("%s won!", msg.sender);

            /*
             * The same code we had before to send the prize.
             */
            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }

        emit NewWave(msg.sender, block.timestamp, _message);
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        return totalWaves;
    }
}
```

Here, I take two numbers given to me by Solidity, `block.difficulty` and `block.timestamp` and combine them to create a random number. `block.difficulty` tells miners how hard the block will be to mine based on the transactions in the block. Blocks get harder for a # of reasons, but, mainly they get harder when there are more transactions in the block (some miners prefer easier blocks, but, these payout less). `block.timestamp` is just the Unix timestamp that the block is being processed.

These #s are *pretty* random. But, technically, both `block.difficulty` and `block.timestamp` could be controlled by a sophisticated attacker. 

To make this harder, I create a variable `seed` that will essentially change every time a user sends a new wave. So, I combine all three of these variables to generate a new random seed. Then I just do `% 100` which will make sure the number is brought down to a range between 0 - 99.

That's it! Then I just write a simple if statement to see if the seed is less than or equal to 50, if it is -- then the waver wins the prize! So, that means the waver has a 50% chance to win since we wrote `seed < 50`. You can change this to whatever you want :). I just made it 50% because it's easier to test that way!!

It's important to see here that an attack could technically game your system here if they really wanted to. It'd just be really hard. There are other ways to generate random numbers on the blockchain but Solidity doesn't natively give us anything reliable because it can't! All the #s our contract can access are public and *never* truly random.

Really, this is one of the strengths of the blockchain. But, can be a bit annoying for some application like ours here!

In any case, no one's going to be attacking our tiny app but I want you to know all this when you're building a dApp that has millions of users!

Test it
-------

Lets make sure it works! Here's my updated `run.js`. In this case, I just want to make sure the contract balance changes in the case where the person who waved won!

```javascript
const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await waveContract.deployed();
  console.log("Contract addy:", waveContract.address);

  let contractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  );
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  /*
   * Let's try two waves now
   */
  const waveTxn = await waveContract.wave("This is wave #1");
  await waveTxn.wait();

  const waveTxn2 = await waveContract.wave("This is wave #2");
  await waveTxn2.wait();

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

You won't always have nice tutorials like this one to guide you on how to test your code. It's up to you to figure out 1) what you want to test 2) how to test it. In this case, I knew I wanted to make sure the contract balance went down by 0.0001 only in the case that a random # less than 50 is generated!

So, when I run the above code here's what I get:

![](https://i.imgur.com/ArXRCsp.png)

Boom! It works. When "79" was generated, the user didn't win the prize. But, when 23 was generated the waver won! And, the contract balance went down by exactly 0.0001. Nice :).

## Cooldowns to prevent spammers

Awesome. You have a way to randomly send ETH to people now! Now, it might be useful to add a cooldown function to your site so people can't just spam wave at you. Why? Well, maybe you just don't want them to keep on trying to win the prize over and over by waving at you. Or, maybe you don't want *just* *their* messages filling up your wall of messages.

Check out the code. I added comments where I added new lines.

I use a special data structure called a [map](https://medium.com/upstate-interactive/mappings-in-solidity-explained-in-under-two-minutes-ecba88aff96e).

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    uint256 private seed;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;

    /*
     * This is an address => uint mapping, meaning I can associate an address with a number!
     * In this case, I'll be storing the address with the last time the user waved at us.
     */
    mapping(address => uint256) public lastWavedAt;

    constructor() payable {
        console.log("We have been constructed!");
        /*
         * Set the initial seed
         */
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public {
        /*
         * We need to make sure the current timestamp is at least 15-minutes bigger than the last timestamp we stored
         */
        require(
            lastWavedAt[msg.sender] + 15 minutes < block.timestamp,
            "Wait 15m"
        );

        /*
         * Update the current timestamp we have for the user
         */
        lastWavedAt[msg.sender] = block.timestamp;

        totalWaves += 1;
        console.log("%s has waved!", msg.sender);

        waves.push(Wave(msg.sender, _message, block.timestamp));

        /*
         * Generate a new seed for the next user that sends a wave
         */
        seed = (block.difficulty + block.timestamp + seed) % 100;

        if (seed <= 50) {
            console.log("%s won!", msg.sender);

            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than they contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }

        emit NewWave(msg.sender, block.timestamp, _message);
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        return totalWaves;
    }
}
```


Try and run `npx hardhat run scripts/run.js` and see the error message you get if you try to wave twice in a row now without waiting 15-minutes :).

Bam! And that's how you build cooldowns!
