*Note: If you've taken previous projects at buildspace, many of the initial setup items in the next two lessons are repeated from previous projects. If you already understand it, awesome! You're a pro. Feel free to blaze through it really fast.*

### 📚 A little blockchain primer

Before anything, we'll need to get our local Ethereum network working. This is how we can compile and test our smart contract code! You know how you need to spin up a local environment to work on web apps? Same deal here!

For now, all you need to know is that a smart contract is a piece of code that lives on the blockchain. The blockchain is a public place where anyone can securely read and write data for a fee. Think of it sorta like AWS or Heroku, except no one actually owns it! It's run by thousands of random people known as "miners".

The bigger picture here is:

1 -- **We're going to write a smart contract**. That contract has all the logic around our domains.

2 -- **Our smart contract will be deployed to the blockchain**. This way, anyone in the world will be able to access and run our smart contract — and we'll let them mint domains!

3 -- **We're going to build a client website that will let people easily mint domains from our collection.**

I recommend also reading over [these](https://ethereum.org/en/developers/docs/intro-to-ethereum/) docs when you can for fun. These are the best guides on the internet for understanding how Ethereum works in my opinion!

### ⚙️ Setup local tooling

We're going to be using a tool called **Hardhat,** a lot, which will let us quickly compile smart contracts and test them locally. First, you'll need to get node/npm. We recommend running Hardhat using the current LTS Node.js version or you may run into some issues! You can find the current releases [here](https://nodejs.org/en/about/releases/). To download Node, head over [here](https://nodejs.org/en/download/).

Next, let's head to our terminal (Git Bash will not work). Go ahead and `cd` to the directory you want to work in. Once you're there run these commands:

```bash
mkdir cool-domains
cd cool-domains
npm init -y
npm install --save-dev hardhat@latest
```

You may see a message about vulnerabilities after you run the last command and install Hardhat. Every time you install something from NPM, there is a security check done to see if any of the packages the library you're installing has any reported vulnerabilities. This is more of a warning to you so you are aware! Running `npx audit fix` can break things, so it’s better to just skip it. Google around a bit about these vulnerabilities if you want to know more!

### 🪄 Sample project

Cool, now we should have Hardhat. Let's get a sample project going.

Run:

```bash
npx hardhat
```

Choose the option to “Create a JavaScript project”. Say yes to everything.

The sample project will ask you to install `@nomicfoundation/hardhat-toolbox`. These are other goodies we'll use later :).

Go ahead and install these other dependencies just in case it didn't do it automatically.

```bash
npm install --save-dev @nomicfoundation/hardhat-chai-matchers chai @nomiclabs/hardhat-ethers ethers
```

You'll also want to install something called **OpenZeppelin** which is another library that's used a lot to develop secure smart contracts. We'll learn more about it later. For now, just install it :).

```bash
npm install @openzeppelin/contracts
```

### 🌟 Run it

To make sure everything is working, run:

```bash
 npx hardhat compile
```

Then run:

```bash
npx hardhat test
```

You should see something like this:

![https://i.imgur.com/0pmWiND.png](https://i.imgur.com/0pmWiND.png)

Let’s do a little clean-up.

Go ahead and open the code for the project now in your favorite code editor. I like VSCode best! We want to delete all the lame starter code generated for us. We don't need any of that. We're pros!

Go ahead and delete the file `Lock.js` under `test`.  Also, delete `deploy.js` under `scripts`. Then, delete `Lock.sol` under `contracts`. Don't delete the actual folders!

### 🚨 Before you click "Next Lesson"

*Note: if you don't do this, Raza will be very sad :(*

Head to #progress and post a screenshot of **your** terminal showing the output of the test! You just ran a smart contract, that's a big deal!! Show it off :).

P.S: If you **don't** have access to #progress, be sure you linked your Discord, join the Discord [here](https://discord.gg/buildspace), hit us up in #general we'll help you get access to the right channels!
