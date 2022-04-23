We're going to spend a ton of time diving into Terra in this project and you'll have plenty of time to learn about what the heck Terra is by actually building on it.

Don't worry — we'll get to a bunch of stuff like how Terra has low gas-fees, how it's really fast, etc.
I don't want us to spend a ton of time on theory here.

The last thing I want you to do is to go down the blockchain rabbit hole and start watching tons of random YT videos or Wikipedia posts. I think doing that stuff is good, but just *finish this project first*. Then go down the rabbit hole!

I promise all your research will make a ton more sense once you actually ship this project.
I do think it's valuable to have a base level understanding of some of the concepts and get a high-level picture of how stuff is working on Terra, though! So, let's do that :).

**What you need to know**
Terra is a blockchain protocol for [algorithmic stablecoins](https://docs.terra.money/docs/learn/glossary.html#algorithmic-stablecoin). You know how you can't really use Ethereum or Bitcoin for payments cause of how much their prices fluctuate and how slow they are? Terra was founded to solve that. It has millions of active users spending stablecoins to buy stuff, save, and invest. When you build on Terra, you get access to all these users and billions of $ in stablecoins.

Here's the TL;DR of everything you might care about:
* Proof-of-stake
* You can pay gas fees in LUNA or stablecoins
* Unused gas isn't refunded
* Transaction time of ~2 seconds
* Average transaction cost of <$0.5
* There are currently 15 stablecoins available 
* Anyone can propose to mint new stablecoins 

Here's what a swap page looks like. It's awesome when you don't have to do maths in your head to figure out how much you're paying for gas.
![](https://hackmd.io/_uploads/H1_IyIAE9.png)


### 🏛 Architecture 
Terra is built on top of the [CosmWasm smart contracting platform](https://docs.cosmwasm.com/docs/1.0/). This means that all the resources available to learn about Cosmos smart contracts also apply to Terra, as they're using the same technology. 

Along with Cosmos, Terra is fully connected to the Inter-Blockchain Communication protocol, allowing it to talk to a bunch of other blockchains. This means you can bridge assets to/from these blockchains easily. Check out the map [here](https://mapofzones.com/), it's pretty cool.

![](https://hackmd.io/_uploads/SyMFVLCE5.png)


### 📑 Smart contracts
Smart contracts on Terra are a lot like smart contracts on Ethereum. They're just pieces of code that live on the blockchain. The blockchain is a place where anyone can run code for a fee. You can think of the blockchain like AWS or Heroku. But, instead of being run by a big corporation these chains are run by a number of decentralised "validators".

### 💬 Messages in CosmWasm
The way you communicate with contracts in CosmWasm is with messages. There are a few different types, but the only ones we care about are the 3 of these:

`instantiate()`: a constructor which is called during contract instantiation to provide initial state. <br>
`execute()`: gets called when a user wants to invoke a method on the smart contract. <br>
`query()`: gets called when a user wants to get data out of a smart contract. <br>

That's pretty much all the theory we really need to go over right now! If it still doesn't make sense, don't worry! It'll start making sense when we hop into the code.
