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

First you'll need to get node/npm. If you don't have it head over [here](https://hardhat.org/tutorial/setting-up-the-environment.html).

We recommend running Hardhat using the current LTS Node.js version or you may run into some issues! You can find the current releases [here](https://nodejs.org/en/about/releases/).

Next, let's head to the terminal (Git Bash will not work). Go ahead and cd to the directory you want to work in. Once you're there run these commands:

```bash
mkdir my-wave-portal
cd my-wave-portal
npm init -y
npm install --save-dev hardhat@2.9.9
```

## 👏 Get sample project going

Cool, now we should have Hardhat. Let's get a sample project going.

Run:

```bash
npx hardhat
```

*Note: if you have yarn installed along with npm, you may get errors such as `npm ERR! could not determine executable to run`. In this case, you can do `yarn add hardhat`.*

Choose the option _**Create a basic sample project**_. Say yes to everything.

<img width="571" alt="Screen Shot 2022-06-10 at 22 51 21" src="https://user-images.githubusercontent.com/5970751/173140637-8693bab8-f610-4f1b-83ed-c6abaacf91c2.png">

The sample project will ask you to install hardhat-waffle and hardhat-ethers. These are other goodies we'll use later :).

Go ahead and install these other dependencies just in case it didn't do it automatically.

```bash
npm install --save-dev @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers
```

Finally, run `npx hardhat accounts` and this should print out a bunch of strings that look like this: 

`0xa0Ee7A142d267C1f36714E4a8F75612F20a79720`

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

![](https://i.imgur.com/rjPvls0.png)

Lets do a little clean-up.

Go ahead and open the code for the project now in your favorite code editor. I like VSCode best! We want to delete all the lame starter code generated for us. We don't need any of that. We're pros ;)!

Go ahead and delete the file `sample-test.js` under `test`.  Also, delete `sample-script.js` under `scripts`. Then, delete `Greeter.sol` under `contracts`. Don't delete the actual folders!

## 🚨 Before you click "Next Lesson"

*Note: if you don't do this, Farza will be very sad :(.*

Head to #progress and post a screenshot of **your** terminal showing the output of the test! You just ran a smart contract, that's a big deal!! Show it off :).

P.S: If you **don't** have access to #progress, be sure you linked your Discord, join the Discord [here](https://discord.gg/mXDqs6Ubcc), hit us up in #general we'll help you get access to the right channels!
