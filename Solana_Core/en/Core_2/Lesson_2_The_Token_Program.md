The humble token - the original promise of the blockchain, and probably the main reason you installed a wallet. From synthetic stocks to the hundreds of dog coins, tokens are the purest representation of assets on the blockchain.

This lesson is all about how tokens work on Solana. If you’re familiar with other chains, there are likely some differences here, so try not to draw too many connections to how you currently think about tokens.

Talking about how tokens work in Solana is also a great opportunity to see how different programs use accounts. The deeper and deeper you get into Solana, the more important you see accounts have. They’re abstract and flexible like files in a file system, but that also means the accounts on any given program can get complex! It may be confusing starting out, but give it time and it’ll start to make more sense.

Tokens on Solana are made and managed using the Solana Token Program, one of the few programs in the Solana Program Library (SPL). Both regular tokens and NFTs are Solana program library tokens. We won't be working with NFTs today, but don't worry we'll get there soon.

#### 🗃 Account relationships
We'll start by getting a lay of the land. There's three essential accounts necessary for the token program:
![](https://hackmd.io/_uploads/H1IFWTMQi.png)
* Wallet account - this is your wallet! 
* Mint account - stores metadata about the token mint
* Token account - this is tied to a wallet and stores info about that specific wallet, like how many tokens it has.

Let's dive into each account and see what it looks like on the inside. 

#### 🌌 The Mint Account
![](https://hackmd.io/_uploads/r149baMQo.png)
The mint account stores metadata about the token itself, so not your ownership of the token, but the token more broadly. It has these properties:
* **mint authority** - Only one account can sign and mint tokens from the mint account. When you create a mint account, you have to designate the mint authority, which could be your personal wallet or another program
* **supply** - how many total tokens exist. Supply basically says, “what’s up master coder? This is how many tokens have been issued overall.”
* **decimals** - Decimals is how many decimal places do we allow tokens to be broken up into - the precision with our tokens. This can get tricky because there aren't actually decimals on chain. *What?* The total supply is represented as an integer so you have to do the math to convert between decimals *#sorrynotsorry*. For example, if you set decimals to two and your supply is one hundred, then you actually have one token. One token in supply, but you're allowing it to be split up into smaller denominations of that token.
* **Is Initialized** - Basically if this account is ready to go or not. It has to do with the account in general, not the token program.
* **Freeze authority** - The freeze authority is similar to the mint authority where you are saying one person or program has the authority to freeze (or mint).

It's pretty standard to set the mint authority to your wallet, mint everything you want, and then remove the mint authority to basically say no more supply will be issued in the future. Alternatively, if you have some kind of dynamic issuance of tokens, it would be common to put them into authority as a program that program manages the minting of tokens.

The freeze authority works the same way. 

#### 👛 Token Accounts
You've probably seen **TONS** of different tokens floating around the ecosysystem. Your wallet could be filled with tons of different ones right now. So, how does the network know you hold certain tokens? An account stores that data! The preferred way to do this is via an associated token account. Check it --

![](https://hackmd.io/_uploads/H1fjZTzXj.png)
Here's what the data relationships and account properties look like. 

The token account has to be associated with a user or a wallet. An easy way to do that is to create a PDA whose address links the mint account and the wallet. The seeds for the token account PDA are the address of the mint account and the wallet address (the token program ID is there by default). 

There’s a lot of different information included, but for now it’s just important to know that your wallet doesn't actually hold the specific tokens. It's associated with a different account that you have that stores the number of tokens. Separately, there is a mint account that stores information about all of the tokens and the mint more broadly.

Spend some time staring at the graph and google the bits that don't make sense (like wtf is the associated token program?). After all the borsh stuff, this is easy!

#### 🤑 The token minting process
Enough looking at graphs, let's look at some code to find out how this all happens.

To create a new SPL-Token you first have to create a Token Mint (the account that holds data about that specific token). 

Think of it like baking a pizza. You need a recipe (the data about the token), the ingredients (the mint account and the address of the wallet), and someone to put it all together (derive a new PDA). Just like with a pizza, if you have all of the right ingredients and follow the recipe, you'll end up with a delicious new token!

Since the token program is part of the SPL, you can create the transaction pretty easily with the [`@solana/spl-token`](https://www.npmjs.com/package/@solana/spl-token) Typescript SDK.

Here's what a `createMint` call would look like: 

![](https://hackmd.io/_uploads/rkAaLFm7o.png)

You'd need these arguments:

- `connection` - the JSON-RPC connection to the cluster
- `payer` - the public key of the payer for the transaction
- `mintAuthority` - the account which is authorized to mint new tokens
- `freezeAuthority` - an account authorized to freeze the tokens in a token account. If you don't wanna be able to freeze, set it to null!
- `decimals` - specifies the desired decimal precision of the token

Once this is done, you'll be able to take the next steps:
* Create the Associated Token Account
* Mint the tokens to an account
* Airdrop to multiple accounts with the transfer function if you want

Everything you need to make this happen is in the `@solana/spl-token` SDK.  Check out the docs [here](https://spl.solana.com/token) if you're curious about a specific part.

Most of the time, you won't need to create the raw transactions yourself, the SDK will be enough.

A cool sidenote on this -- _if for some reason you wanna create the mint along with another instruction, you would want to create the instructions yourself and package them into one transaction to ensure that it all happens atomically._ Maybe you're building a super secret token program where you want all tokens to be locked up right after mint without anyone being able to tranfer theirs.

Needless to say, there is a crazy amount of stuff thats happening around these tokens. You can check out what's happening with each of these functions under the hood [here](https://soldev.app/course/token-program) and even checkout some of the instructions around things like burning tokens :).
