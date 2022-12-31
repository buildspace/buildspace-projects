## ✅ Setup your env to start working w/ the blockchain

Before anything, we'll need to get our local Ethereum network working. This is how we can compile and test our smart contract code! You know how you need to spin up a local environment to work on it? Same deal here!

For now, all you need to know is that a smart contract is a piece of code that lives on the blockchain. The blockchain is a public place where anyone can securely read and write data for a fee. Think of it sorta like AWS or Heroku, except no one actually owns it!

So in this case, we want people to 👋 at us. The bigger picture here is:

1\. **We're going to write a smart contract.** That contract has all the logic around how the 👋 s are handled. This is like your server code.

2\. **Our smart contract will be deployed to the blockchain.** This way, anyone in the world will be able to access and run our smart contract (if we give them permission to do so). So, pretty much like a server :).

3\. **We're going to build a client website** that will let people easily interact with our smart contract on the blockchain.

I'll explain certain things in-depth as needed (ex. how mining works, how smart contracts are compiled and run, etc) *but for now let's just focus on getting stuff running*.

If you have any issues throughout here, just drop a message on Discord in  `#section-1-help`. 

## ✨ The magic of Hardhat

1\. We're going to be using a tool called Hardhat a lot. This will let us easily spin up a local Ethereum network and give us fake test ETH and fake test accounts to work with. Remember, it's just like a local server, except the "server" is the blockchain.

2\. Quickly compile smart contracts and test them on our local blockchain.

First you'll need to get Node/NPM. If you don't have it head over [here](https://hardhat.org/tutorial/setting-up-the-environment.html). 

We recommend running Hardhat using the current LTS Node.js version or you may run into some issues! You can find the current releases [here](https://nodejs.org/en/about/releases/). **Make sure your version of NodeJs is correct or you'll run into issues!** We recommend version 16.15.1 right now. You can install it [here](https://nodejs.org/en/download/releases/).

<img src="https://i.imgur.com/UFr0oJn.png" />

Next, let's head to the terminal (Git Bash will not work). Go ahead and cd to the directory you want to work in. Once you're there run these commands:

```bash
mkdir my-wave-portal
cd my-wave-portal
npm init -y
npm install --save-dev hardhat@latest
```

## 👏 Get sample project going

Cool, now we should have Hardhat. Let's get a sample project going.

Run:

```bash
npx hardhat
```

*Note: if you have yarn installed along with npm, you may get errors such as `npm ERR! could not determine executable to run`. In this case, you can do `yarn add hardhat`.*

Choose the option _**Create a JavaScript project**_. Say yes to everything.

<img width="571" alt="Screen Shot 2022-06-10 at 22 51 21" src="https://i.imgur.com/j1e8vJT.png">

The sample project will ask you to install hardhat-waffle and hardhat-ethers. These are other goodies we'll use later :).

Go ahead and install these other dependencies just in case it didn't do it automatically.

```bash
npm install --save-dev chai @nomiclabs/hardhat-ethers ethers @nomicfoundation/hardhat-toolbox @nomicfoundation/hardhat-chai-matchers
```

Your `hardhat.config.js` should look like this.
```javascript
require("@nomicfoundation/hardhat-toolbox");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    solidity: "0.8.17",
};
```

Finally, run `npx hardhat accounts` and this should print out a bunch of accounts that looks like this: 

```
0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
0x70997970C51812dc3A010C7d01b50e0d17dc79C8
0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
0x90F79bf6EB2c4f870365E785982E1f101E93b906
0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65
0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc
0x976EA74026E726554dB657fA54763abd0C3a0aa9
0x14dC79964da2C08b23698B3D3cc7Ca32193d9955
0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f
0xa0Ee7A142d267C1f36714E4a8F75612F20a79720
0xBcd4042DE499D14e55001CcbB24a551F3b954096
0x71bE63f3384f5fb98995898A86B02Fb2426c5788
0xFABB0ac9d68B0B445fB7357272Ff202C5651694a
0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec
0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097
0xcd3B766CCDd6AE721141F452C550Ca635964ce71
0x2546BcD3c84621e976D8185a91A922aE77ECEc30
0xbDA5747bFD65F08deb54cb465eB87D40e51B197E
0xdD2FD4581271e230360230F9337D5c0430Bf44C0
0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199
```

These are Ethereum addresses that Hardhat generates for us to simulate real users on the blockchain. This is going to help us a ton later in the project when we want to simulate users 👋-ing at us!

## 🌟 Run it

To make sure everything is working, run:

```bash
 npx hardhat compile
```
Then run:

```bash
npx hardhat test
```

You should see something like this:

![](https://i.imgur.com/OI9YKaU.png)

Lets do a little clean-up.

Go ahead and open the code for the project now in your favorite code editor. I like VSCode best! We want to delete all the lame starter code generated for us. We don't need any of that. We're pros ;)!

Go ahead and delete the file `Lock.js` under `test`.  Also, delete `deploy.js` under `scripts`. Then, delete `Lock.sol` under `contracts`. Don't delete the actual folders!

## 🚨 Before you click "Next Lesson"

*Note: if you don't do this, Farza will be very sad :(.*

Head to #progress and post a screenshot of **your** terminal showing the output of the test! You just ran a smart contract, that's a big deal!! Show it off :).

P.S: If you **don't** have access to #progress, be sure you linked your Discord, join the Discord [here](https://discord.gg/buildspace), hit us up in #general we'll help you get access to the right channels!
