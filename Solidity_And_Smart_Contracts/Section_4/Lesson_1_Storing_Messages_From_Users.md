📦 Storing messages in arrays using structs
-------------------------------------------

So, we now have a full-fledged web app that can talk to the blockchain!

Now, if we remember we want our final app to be a place where people can come, wave to us, and send us a message. We also want to show all the past waves/messages we've gotten. That's what we'll be doing in this lesson!

So at the end of the lessons we want to

1\. Let users submit a message along with their wave.

2\. Have that data saved somehow on the blockchain.

3\. Actually show that data on our site, so, anyone can come to see all the people who have waved at us and their messages.

Check out my updated smart contract code. I added lots of comments here to help you see what changed :).

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;

    /*
     * A little magic, Google what events are in Solodity!
     */
    event NewWave(address indexed from, uint256 timestamp, string message);

    /*
     * I created a struct here named Wave.
     * A struct is basically a custom datatype where we can customize what we want to hold inside it.
     */
    struct Wave {
        address waver; // The address of the user who waved.
        string message; // The message the user sent.
        uint256 timestamp; // The timestamp when the user waved.
    }

    /*
     * I declare a variable waves that lets me store an array of structs.
     * This is what lets me gold all the waves anyone ever sends to me!
     */
    Wave[] waves;

    constructor() {
        console.log("I AM SMART CONTRACT. POG.");
    }

    /*
     * You'll notice I changed the wave function a little here as well and
     * now it requires a string called _message. This is the message out user
     * sends us from the frontend!
     */
    function wave(string memory _message) public {
        totalWaves += 1;
        console.log("%s has waved!", msg.sender);

        /*
         * This is where I actually store the wave data in the array.
         */
        waves.push(Wave(msg.sender, _message, block.timestamp));

        /*
         * I added some fanciness here, Google it and try to figure out what it is!
         * Let me know what you learn in #course-chat
         */
        emit NewWave(msg.sender, block.timestamp, _message);
    }

    /*
     * I added a function getAllWaves which will return the struct array, waves, to us.
     * This will make it easy to retrieve the waves from our website!
     */
    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        return totalWaves;
    }
}
```

🧐 Test it
----------

Whenever we change our contract, we want to change `run.js` to test the new functionality we added. That how we know it's working how we want! Here's what mines looks like now.

Here's my updated `run.js`. 

```javascript
const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();
  console.log('Contract addy:', waveContract.address);

  let waveCount;
  waveCount = await waveContract.getTotalWaves();
  console.log(waveCount.toNumber());

  /**
   * Let's send a few waves!
   */
  let waveTxn = await waveContract.wave('A message!');
  await waveTxn.wait(); // Wait for the transaction to be mined

  const [_, randoPerson] = await ethers.getSigners();
  waveTxn = await waveContract.connect(randoPerson).wave('Another message!');
  await waveTxn.wait(); // Wait for the transaction to be mined

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

Here's what I get in my terminal when I run this using `npx hardhat run scripts/run.js`.

![](https://i.imgur.com/oPKy2dP.png)

Boom! Pretty awesome, right :)? 

The array looks a little scary but we can see the data next to the words `waver`, `message`, and `timestamp`!! It properly stores our messages `"A message"` and `"Another message"` :).

Note: "timestamp" is given back to us as type "BigNumber". We'll learn how to work with it later but just know there's nothing wrong here!

Looks like things work, lets move to our **frontend** so we can see all our waves on our website!

✈️ Re-deploy
------------

So, now that we've updated our contract we need to do a few things:

1\. We need to deploy it again.

2\. We need to update the contract address on our frontend.

3\. We need to update the abi file on our frontend. 

**People constantly forget to these 3 steps when they change their contract. Don't forget lol.**

Why do we need to do all this? Well, it's because smart contracts are **immutable.** They can't change. They're permanent. That means changing a contract requires a full redeploy. This will also **reset** all the variables since it'd be treated as a brand new contract. **That means we'd lose all our wave data if we wanted to update the contract's code.**

**Bonus**: In #course-chat, can anyone tell me some solutions here? Where else could we store our wave data where we could update our contract's code and keep our original data around? There are quite a few solutions here let me know what you find!

So what you'll need to do now is:

1\. Deploy again using `npx hardhat run scripts/deploy.js --network rinkeby`

2\. Change `contractAddress` in `App.js` to be the new contract address we got from the step above in the terminal just like we did before the first time we deployed.

3\. Get the updated abi file from `artifacts` like we did before and copy-paste it into Replit just like we did before. If you forgot how to do this be sure to revisit the lesson [here](https://app.buildspace.so/courses/CO02cf0f1c-f996-4f50-9669-cf945ca3fb0b/lessons/LE52134606-af90-47ed-9441-980479599350) and watch the video I made on ABI files by [clicking here](https://www.loom.com/share/ddecf3caf54848a3a01edd740683ec48).

**Again -- you need to do this every time you change your contracts code.**

🔌 Hooking it all up to our client
----------------------------------

So, here's the new function I added to `App.js`.

```javascript
const [currentAccount, setCurrentAccount] = useState("");
  /*
   * All state property to store all waves
   */
  const [allWaves, setAllWaves] = useState([]);
  const contractAddress = "0xd5f08a0ae197482FA808cE84E00E97d940dBD26E";

  /*
   * Create a method that gets all waves from your contract
   */
  const getAllWaves = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, waveportal.abi, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await waveportalContract.getAllWaves();
        

        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }
  ```

Pretty simple and very similar to stuff we worked on earlier with how we're connecting to the provider, getting the signer, and connecting to the contract! I do a little magic here by looping through all our waves and saving them nicely in an array that we can use later. Feel free to console.log `waves` to see what you get there if you're having issues.

Where do we call this brand new `getAllWaves()` function, though? Well -- we want to call it when we know for sure the user has a connected wallet with an authorized account because we need an authorized account to call it! Hint: you have to call this function somewhere in `checkIfWalletIsConnected()`. I'll leave it to you to figure it out. Remember, we want to call it when we know for sure we have a connected + authorized account!

The last thing I did was update our HTML code to render the data for us to see!

```jsx
return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          👋 Hey there!
        </div>

        <div className="bio">
          I am farza and I worked on self-driving cars so that's pretty cool right? Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {allWaves.map((wave, index) => {
          return (
            <div style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
  ```

Basically, I just go through `allWaves` and create new divs for every single wave and show that data on the screen.

🙀 Ah!! `wave()` is broken!
---------------------------

So, in `App.js`, our `wave()` function no longer works! If we try to wave it'll give us an error because it's expecting a message to be sent now with it now! For now, you can fix this by hardcoding a message like:

```
const waveTxn = await waveportalContract.wave("this is a message")
```

I'll leave this up you: figure out how to add a textbox that lets users add their own custom message they can send to the wave function :).

The goal? You want to give your users the ability to send you a custom message using a textbox they can type in! Or, maybe you want them to send you a link to a meme? Or a Spotify link? It's up to you!

👷‍♀️ Go build a UI!
--------------------

Go make this thing look how you want it to look! I won't be teaching you much of that here. Feel free to ask questions in #section-4-help!
