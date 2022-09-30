## 📚 A little blockchain primer
Before anything, we'll need to get our local Ethereum network working. This is how we can compile and test our smart contract code! You know how you need to spin up a local environment to work on? Same deal here!

For now, all you need to know is that a smart contract is a piece of code that lives on the blockchain. The blockchain is a public place where anyone can securely read and write data for a fee. Think of it sorta like AWS or Heroku, except no one actually owns it! It's run by thousands of random people known as "miners".

The bigger picture here is:

1 -- We're going to write a smart contract. That contract has all the logic around our NFTs.

2 -- Our smart contract will be deployed to the blockchain. This way, anyone in the world will be able to access and run our smart contract — and we'll let them mint NFTs!

3 -- We're going to build a client website that will let people easily mint NFTs from our collection.

I recommend also reading over [these](https://ethereum.org/en/developers/docs/intro-to-ethereum/) docs when you can for fun. These are the best guides on the internet for understanding how Ethereum works in my opinion!

## ⚙️ Setup local tooling

We're going to be using a tool called **Hardhat** a lot which let us quickly compile smart contracts and test them locally. First you'll need to get node/npm. If you don't have it head over [here](https://hardhat.org/tutorial/setting-up-the-environment.html).

*Note: I'm on Node 16. I know some people have gotten "out of memory errors" on older versions of node so if that happens, get Node 16!*

Next, let's head to the terminal. Go ahead and `cd` to the directory you want to work in. Once you're there run these commands:

```bash
mkdir epic-nfts
cd epic-nfts
npm init -y
npm install --save-dev hardhat
```
What happens here is, you run:
1. `mkdir epic-nfts` to create a directory named "epic-nfts".
2. `cd epic-nfts` to enter the newly created directory.
3. `npm init -y` to generate an empty npm project without going through an interactive process. The -y stands for yes.
4. `npm install --save-dev hardhat@latest` to install Hardhat.

You may see a message about vulnerabilities after you run the last command and install Hardhat. Every time you install something from NPM, there is a security check done to see if any of the packages the library you're installing has any reported vulnerabilities. This is more of a warning to you so you are aware! Google around a bit about these vulnerabilities if you want to know more!


## 🔨 Get sample project working

Cool, now we should have hardhat. Let's get a sample project going.

```
npx hardhat
```

*Note: If you're on Windows using Git Bash to install hardhat, you may run into an error at this step (HH1). You can try using Windows CMD to perform the HardHat install if you run into trouble. Additional info can be found [here](https://github.com/nomiclabs/hardhat/issues/1400#issuecomment-824097242).*

Choose the option _**Create a JavaScript project**_. Say yes to everything.

<img width="571" alt="Screen Shot 2022-06-10 at 22 51 21" src="https://i.imgur.com/j1e8vJT.png">


The sample project will ask you to install `hardhat-waffle` and `hardhat-ethers`. These are other goodies we'll use later.

Go ahead and install these other dependencies just in case it didn't do it automatically.

```bash
npm install --save-dev chai @nomiclabs/hardhat-ethers ethers @nomicfoundation/hardhat-toolbox @nomicfoundation/hardhat-chai-matchers
```

You'll also want to install something called **OpenZeppelin** which is another library that's used a lot to develop secure smart contracts. We'll learn more about it later. For now, just install it :).

```bash
npm install @openzeppelin/contracts
```

Then run:

```bash
npx hardhat test
```

You should see something like this:

![](https://i.imgur.com/OI9YKaU.png)

Boom! If you see this it means your local environment is set up **and** you also ran/deployed a smart contract to a local blockchain.

This is pretty epic. We'll get into this more but basically what's happening here step-by-step is:

1. Hardhat compiles your smart contract from solidity to bytecode.
2. Hardhat will spin up a "local blockchain" on your computer. It's like a mini, test version of Ethereum running on your computer to help you quickly test stuff!
3. Hardhat will then "deploy" your compiled contract to your local blockchain. That's that address you see at the end there. It's our deployed contract, on our mini version of Ethereum.

If you're curious, feel free to look at the code inside the project to see how it works. Specifically, check out `Lock.sol` which is the smart contract and `deploy.js` which actually runs the contract.

Once you're done exploring, let's head to the next section and start our own NFT contract.

## 🚨 Progress report!

Post a screenshot of your terminal with the output of `deploy.js` in #progress :).
