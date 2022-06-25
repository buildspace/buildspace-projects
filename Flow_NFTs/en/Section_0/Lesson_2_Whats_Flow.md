Flow is a new blockchain network built from the ground up for the mainstream. Why make a new ecosystem? Because the existing ones aren't ready for the entire planet. 

Think about your favourite web3 app. It can be anything built on a blockchain - an NFT trading site like OpenSea or MagicEden or maybe a trading site like UniSwap. Heck, it could even just be a simple guestbook you made! Now imagine your mom or your grandma trying to use it. They'd have to download a wallet, set up a "secret phrase" and then *buy* crypto just to try it out! 

Flow changes the game. Everything on Flow is made for scale. Your grandma can start using *any* Flow app in 10 seconds with just her email address. No wallet setup necessary. Transaction fees are subsidized (free for starters) even on the mainnet. 
![](https://hackmd.io/_uploads/Hk0T5g7qc.png)

We're going to spend a ton of time diving into Flow in this project and you'll have plenty of time to learn about what the heck Flow is by **actually building** on it.

Don't worry — we'll get to a bunch of stuff like how Flow has low gas-fees, how it's really fast, etc.

I **don't** want us to spend a ton of time on theory here.

The last thing I want you to do is to go down the blockchain rabbit hole and start watching tons of random YT videos or Wikipedia posts. I think doing that stuff is good, *but just finish this project first*. Then go down the rabbit hole!

I promise all your research will make a ton more sense once you actually ship this project.

I do think it's valuable to have a base level understanding of some of the concepts and get a high-level picture of how stuff is working on Flow, though! So, let's do that :).

### 👩‍💻 Smart contracts
Flow Smart Contracts are a lot like other blockchains. Here's a recap of the parts you **need** to know about.

![](https://hackmd.io/_uploads/SyT0Ow3uc.png)
[Image source](https://docs.onflow.org/dapp-development/flow-dapp-anatomy/)

The majority of your users start at the client - this can be a plain website or a mobile application. They connect their wallet to your client and interact with the blockchain. Your account lives on the blockchain and communicates with smart contracts to do things like buy tokens or NFTs. 

The only thing "new" here is the [Flow Client Library](https://www.npmjs.com/package/@onflow/fcl). This is just a package that makes communicating with wallets and smart contracts a lot easier. It's sort of like Ethers.js or Web3js, except it's waaaay easier to use! FCL makes it so you don't have to worry about which wallet the user is on - you'll write wallet communication code once and it'll work for *every* Flow wallet!

If you're not familiar with smart contracts, think of them like vending machines that only take cheques. There's no blockchain in this picture, so just imagine it lol

![](https://hackmd.io/_uploads/r1id5d4tc.png)

The attendant (react app) asks you what you want and gives you a cheque (transaction), you sign it with your pen (wallet app like Blocto, Lilico or Metamask) and you submit it to the vending machine (smart contract). The vending machine is **on** the blockchain and it does what your transaction tells it to if the transaction follows the rules of the blockchain. In our example, the transaction could be taking some tokens from you and giving you a diet coke!

### 🏦 Accounts
Flow also uses a new kind of data structure called "Accounts" to store things. You can think of a Flow account just like an email account or Dropbox/Google Drive/Baidu Cloud account. They have access credentials (login/password) and store things inside them like files and text.

Here's the structure of a Flow account: 
![](https://hackmd.io/_uploads/rklMwaau5.png)
[Image source](https://youtu.be/pRz7EzrWchs?t=37)

Flow accounts have two main parts:
1. Contract storage area: This is where your smart contract code lives. You can store as many smart contracts as you want. This means you can also [upgrade smart contracts](https://docs.onflow.org/cadence/language/contract-updatability/) easily! This area also contains the  **interfaces** that you can use to interact with it.
2. Account file system: Flow accounts have their own file system! You can think of this like folders on your desktop which have files inside them. The three valid paths are: 
- `/storage/`: accessible only by the account owner
- `/private/`: like a private API, the owner & allowed accounts have access
- `/public/`: like a public API, anyone in the network can access this

If we think back to the vending machine example, the file system is sort of like the storage space **inside** the vending machine. 

![](https://hackmd.io/_uploads/S1LDNuEtq.png)
<sup>Icon from Flaticon</sup>

Sadly we can't store diet Cokes in these storage domains, only data objects. Wtf is a data object? Any data structure in a contract, be it a resource or a simple string. "Hello World" variable? Chuck it in there. A "vault" that keeps track of token balances? In you go! Mapping of NFTs to owners? Yup. 


### 💚 Cadence
Flow comes with an awesome new programming language called Cadence. The syntax was inspired by other awesome languages like Swift and Rust, with a focus on clarity. 

But why? Why did they have to make a new language? Weren't Solidity/Rust enough? 

No. Blockchain programming is a completely new space. When software moves into new spaces, you need new paradigms. Existing programming languages were made to program computers as we knew them - private and stateless. Blockchains are inherently different (distributed, stateful and public) so the same language primitives do not apply anymore. It's like trying to use a 1,000 year old stone oven to cook 60-second microwave ramen/noodles!

When computers were becoming commodity hardware, we needed **portable** code. C was born. From supercomputer CPUs to microcontrollers, it ran on all hardware!

When graphical UIs were becoming a thing in the 90s, we saw that Java with its Object Oriented Programming was a great fit.

With the rise of web apps that did client-side scripting, we used JavaScript.

And now, with the scarcity and access requirements of the blockchain, we have Cadence.

### 🔒 Resource Oriented Programming
The problem with Solidity and WASM (Rust) is that the "scarce resources" are just data structures. If a smart contract doesn't add guards and checks, anyone can change ownership of an asset by updating a data structure like a mapping. You own NFTs, but only because the contract says so. **If the contract isn't built right, someone might be able to change who the owner is without their permission.**

Cadence solves this with Resource Oriented Programming. This wasn't a random decision, a lot of [research](https://www.onflow.org/technical-paper) was done to get here. I don't want to get into deep theory here, **all you need to know is**:

Objects on blockchains have two major requirements:
1. They must be controllably scarce
2. Their access must be controlled and enforced

To meet these requirements, Cadence uses "resources". When we make something a resource, it must follow these rules:

1. **Each Resource exists in exactly one place at any given time**. Resources can’t be duplicated or accidentally deleted, either through programming error or malicious code.
2. **Ownership of a Resource is defined by where it is stored**. There is no central ledger that needs to be consulted to determine ownership.
3. **Access to methods on a Resource is limited to the owner**. For example, only the owner of a CryptoKitty can initiate a breeding operation that will lead to the birth of a new Kitty.
[Source](https://www.onflow.org/post/resources-programming-ownership)

These rules are enforced both at compile-time *and* at runtime. So if you write bad Cadence code that doesn't check if you're allowed to transfer an NFT, the transfer **will not happen!** The blockchain will  essentially say "Hey you're trying to do something you're not allowed to, get outta here" and cancel your transaction.

The unique thing about resources is that because of Cadence's strong static type system, they can only exist in one location at a time and cannot be copied or lost because of a coding mistake. Instead of a ledger-style approach to record ownership, resources directly tie an asset’s ownership to the account that owns it by saving the resources in the account’s storage. 

Even cooler, since resources are just data types, they can own another resource. So if you're 
making an on-chain version of Pokemon, your Pikachu can **own** items like an evolution stone or powerups!

If you're struggling to understand this, don't worry, you'll get it once we start writing code! For now, you can think of Cadence like a world where you're not allowed to steal stuff because the laws of physics prevent you lol

Enough reading, LET'S PRESS SOME BUTTONS ON OUR KEYBOARD!