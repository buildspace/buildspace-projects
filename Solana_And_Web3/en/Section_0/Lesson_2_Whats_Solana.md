We're going to spend a ton of time diving into Solana in this project and you'll have plenty of time to learn about what the heck Solana is by **actually building** on it.

Don't worry — we'll get to a bunch of stuff like how Solana has low gas-fees, how it's really fast, etc.

I **don't** want us to spend a ton of time on theory here.

The last thing I want you to do is to go down the blockchain rabbit hole and start watching tons of random YT videos or Wikipedia posts. I think doing that stuff is good, *but just finish this project first*. Then go down the rabbit hole!

I promise all your research will make a ton more sense once you actually ship this project.

I do think it's valuable to have a base level understanding of some of the concepts and get a high-level picture of how stuff is working on Solana, though! So, let's do that :).

### 👩‍💻 Programs

On Solana, we write "Solana programs".

*Note: This is sorta like a smart contract if you know about Ethereum!*

A Solana program is just a piece of code that lives on the blockchain. The blockchain is a place where anyone can run code for a fee. You can think of the blockchain like AWS or Heroku. But, instead of being run by a big corporation these chains are run by "miners". In the world of Solana we actually call them "validators".

### 🏦 Accounts

On Solana, programs are "stateless". **This is very different from Ethereum.** On Ethereum, you write "smart contracts" and contracts actually maintain state where you can actually store data on variables directly on the contracts.

On Solana, how it works is users have "accounts" and Solana programs can interact with "accounts" users own. One user can own 1000s of accounts. The easiest way to think of an account is sort of like a file. Users can have many different files. Developers can write programs that can talk to these files.

*The program itself doesn't hold a user's data. The program just talks to "accounts" that hold the user's data.*

That's pretty much all the theory we really need to go over right now! If it still doesn't make sense,  don't worry! This took me a while to grasp. I think it makes more sense when we hop into the code.

### 👀 "Should I use Solana or Ethereum?"

Hmmmm. This is a tough question. It also may be the wrong question. Sorry, I know its not the answer you want but the real answer is — *it depends.*

For example — today, we don't really talk about which *backend server language* is the "best".

We just pick the one we are most comfortable with or the one that makes the most sense given our use case. For example, if speed is your goal — writing your backend in Go may make sense. If you just want to get something off the ground, something like Node or Ruby might be better.

This is pretty much how we should look at different blockchains. Each one has it's own pros and cons and you should just pick the one that fits your use case or comfort level. Solana is known as the super fast, low-gas fee blockchain — and in this project we'll mess with it so you can get a feel for how you like it! **Form your own opinion!!**

### ⛓ Cross chain future

Every blockchain has it's own pros and cons. I don't think any one of the big blockchains are "the best". And, we **don't** **need to** have just one be the best. Competition is good. A world where *just* Apple makes smartphones would suck. A world where only Krispy Kreme made donuts would suck. We need a lot of people pushing the industry forward in their own ways. 

*This is just a personal take*, but I think we're quickly moving towards a world where we're going to have many different blockchains (already happening now). This is actually a good thing. Instead of having one blockchain be a clear winner, we have many different chains each with their own specialties.

**But we'll have [bridges](https://wiki.polkadot.network/docs/learn-bridges) that let different chains talk to each other.**

That means you can deploy your program on Solana, and have it communicate with a contract on a different blockchain like Ethereum, Avalanche, Polygon, etc. For example, you could buy an NFT on Ethereum and then move it to Solana if you wanted. Or, maybe you could have a bridge that lets you easily move tokens from the Solana chain, to the Ethereum chain.

What would **suck** is if we just had like 100+ different chains and **none** of them could talk to each other. Then, each chain becomes a walled garden where data transfer between chains is near impossible. Users lose the freedom of choice.

Bridges are becoming more popular. Feel free to read [this](https://medium.com/1kxnetwork/blockchain-bridges-5db6afac44f8) post whenever! But for now, let's get building.