Right now, our program does literally nothing haha. Let's change it up to store some data! 

Our website will allow people to submit GIFs. So, storing something like a `total_gifs` number would be pretty helpful too.

### 🥞 Create an integer to store GIF count

Cool so we just want to store a basic integer with the number of `total_gifs` people have submitted. So, every time someone adds a new gif we'd just do `total_gifs += 1`.

Let's think about this. 

Remember earlier I said Solana programs are **stateless**. They **don't** hold data permanently. This is very different from the world of Ethereum smart contracts — which hold state right on the contract.

But, Solana programs can interact w/ "accounts".

Again, accounts are basically files that programs can read and write to. The word "accounts" is confusing and super shitty. For example, when you create a wallet on Solana — you create an "account". But, your program can also make an "account" that it can write data to. Programs themselves are considered "accounts". 

**Everything is an account lol**. Just remember an account isn't just like your actual wallet — **it's a general way for programs to pass data between each other**. Read about them more [here](https://docs.solana.com/developing/programming-model/accounts). 

Check out the code below, I added some comments as well.

```rust
use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod myepicproject {
  use super::*;
  pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> Result <()> {
    // Get a reference to the account.
    let base_account = &mut ctx.accounts.base_account;
    // Initialize total_gifs.
    base_account.total_gifs = 0;
    Ok(())
  }
}

// Attach certain variables to the StartStuffOff context.
#[derive(Accounts)]
pub struct StartStuffOff<'info> {
    #[account(init, payer = user, space = 9000)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program <'info, System>,
}

// Tell Solana what we want to store on this account.
#[account]
pub struct BaseAccount {
    pub total_gifs: u64,
}
```

**A lot happening here.** Let's step through it.

### 🤠 Initializing an account

Lets check out this line at the bottom:

```rust
#[account]
pub struct BaseAccount {
    pub total_gifs: u64,
}
```

This is dope. Basically, it tells our program what kind of account it can make and what to hold inside of it. So, here, `BaseAccount` holds one thing and it's an integer named `total_gifs`.

Then, here we actually specify how to initialize it and what to hold in our `StartStuffOff` context.

```rust
#[derive(Accounts)]
pub struct StartStuffOff<'info> {
    #[account(init, payer = user, space = 9000)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program <'info, System>,
}
```

Looks complicated lol.

First we've got `[account(init, payer = user, space = 9000)]`. **All we're doing here is telling Solana how we want to initialize `BaseAccount`.**

Note, if after running your test below you get the error `Transaction simulation failed: Error processing Instruction 0: custom program error: 0x64`, you will need to change `space = 9000` to `space = 10000`. If you look at [these docs from anchor](https://project-serum.github.io/anchor/tutorials/tutorial-1.html#defining-a-program) you can see that they define a simple program that declares space = 8 + 8 (eg, 8 bytes + 8 bytes). The more logic we add to our program, the more space it will take up!

1. `init` will tell Solana to create a new account owned by our current program.
2. `payer = user` tells our program who's paying for the account to be created. In this case, it's the `user` calling the function. 
3. We then say `space = 9000` which will allocate 9000 bytes of space for our account. You can change this # if you wanted, but, 9000 bytes is enough for the program we'll be building here!

Why are we paying for an account? Well — storing data isn't free! How Solana works is users will pay "rent" on their accounts. You can read more on it [here](https://docs.solana.com/developing/programming-model/accounts#rent) and how rent is calculated. Pretty wild, right? If you don't pay rent, validators will clear the account!

[Here's](https://docs.solana.com/storage_rent_economics) another article from the docs on rent I liked as well!

> "With this approach, accounts with two-years worth of rent deposits secured are exempt from network rent charges. By maintaining this minimum-balance, the broader network benefits from reduced liquidity and the account holder can rest assured that their `Account::data` will be retained for continual access/usage."
> 

We then have `pub user: Signer<'info>` which is data passed into the program that proves to the program that the user calling this program actually owns their wallet account.

Finally, we have `pub system_program: Program` which is actually pretty freaking cool. It's basically a reference to the [SystemProgram](https://docs.solana.com/developing/runtime-facilities/programs#system-program). The SystemProgram is the program that basically runs Solana. It is responsible for a lot of stuff, but one of the main things it does is create accounts on Solana. The SystemProgram is a program the creators of Solana deployed that other programs like ours talk to haha — it has an id of `11111111111111111111111111111111`.

Lastly, we do this thing in our function where we just grab `base_account` from the `StartStuffOff` context by doing `Context<StartStuffOff>`.

```rust
pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> Result <()> {
	// Get a reference to the account.
  let base_account = &mut ctx.accounts.base_account;
	// Initialize total_gifs.
  base_account.total_gifs = 0;
  Ok(())
}
```

Boom! Again — a lot of this stuff may seem confusing especially if you're new to Rust but **let's just keep writing and running code**. I think this stuff makes more sense the more you do write code → run → get errors → fix errors → repeat.

*Note: We do `&mut` to get a "mutable reference" to `base_account`. When we do this it actually gives us the power to make **changes** to `base_account`. Otherwise, we'd simply be working w/ a "local copy" of `base_account`.*

### 👋  Retrieve account data

Let's put it all together.

So, we can actually retrieve account data now as well over in javascript land. Go ahead and update `myepicproject.js`. I added some comments on lines I changed.

```javascript
const anchor = require('@project-serum/anchor');

// Need the system program, will talk about this soon.
const { SystemProgram } = anchor.web3;

const main = async() => {
  console.log("🚀 Starting test...")

  // Create and set the provider. We set it before but we needed to update it, so that it can communicate with our frontend!
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Myepicproject;
	
  // Create an account keypair for our program to use.
  const baseAccount = anchor.web3.Keypair.generate();

  // Call start_stuff_off, pass it the params it needs!
  let tx = await program.rpc.startStuffOff({
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [baseAccount],
  });

  console.log("📝 Your transaction signature", tx);

  // Fetch data from the account.
  let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF Count', account.totalGifs.toString())
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
```

`anchor.web3.Keypair.generate()` may also be kinda confusing — why are we doing this? Well, basically it's because we need to create some credentials for the `BaseAccount` we're creating.

Most of the script is the same but you'll see I pass `startStuffOff` some important params that we specified in the struct `pub struct StartStuffOff`.

*Note: notice also that in `lib.rs` the function is called `start_stuff_off` since in Rust we use snake case (`snake_case`) instead of camel case. But, over in our javascript file we use camel case and actually call `startStuffOff`. This is something nice Anchor does for us so we can follow best practices regardless of what language we're using. You can use snake case in Rust-land and camel case in JS-land.*

And perhaps the coolest part about all this is where we call:

```javascript
await program.account.baseAccount.fetch(baseAccount.publicKey)
console.log('👀 GIF Count', account.totalGifs.toString())
```

Here we actually retrieve the account we created and then access `totalGifs`. When I run this via `anchor test`, I get:

```
🚀 Starting test...
📝 Your transaction signature 2KiCcXmdDyhMhJpnYpWXQy3FxuuqnNSANeaH1CBjvomuLZ8LfzDKHtDDB2LHfsfoVQZSyxoF1R39ao6VfTrD7bG7
👀 GIF Count 0
```

Yay! It's `0`! This is pretty freaking epic. We now are actually calling a program *and* storing data in a permissionless manner on the Solana chain. NICE.

### 👷‍♀️ Build a function to update GIF counter

Let's actually create a new function named `add_gif` that lets us actually increment the GIF counter. Check out some of my changes below.

```rust
use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod myepicproject {
  use super::*;
  pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> Result <()> {
    let base_account = &mut ctx.accounts.base_account;
    base_account.total_gifs = 0;
    Ok(())
  }
  
	// Another function woo!
  pub fn add_gif(ctx: Context<AddGif>) -> Result <()> {
    // Get a reference to the account and increment total_gifs.
    let base_account = &mut ctx.accounts.base_account;
    base_account.total_gifs += 1;
    Ok(())
  }
}

#[derive(Accounts)]
pub struct StartStuffOff<'info> {
  #[account(init, payer = user, space = 9000)]
  pub base_account: Account<'info, BaseAccount>,
  #[account(mut)]
  pub user: Signer<'info>,
  pub system_program: Program <'info, System>,
}

// Specify what data you want in the AddGif Context.
// Getting a handle on the flow of things :)?
#[derive(Accounts)]
pub struct AddGif<'info> {
  #[account(mut)]
  pub base_account: Account<'info, BaseAccount>,
}

#[account]
pub struct BaseAccount {
    pub total_gifs: u64,
}
```

Pretty simple! Near the bottom I added:

```rust
#[derive(Accounts)]
pub struct AddGif<'info> {
  #[account(mut)]
  pub base_account: Account<'info, BaseAccount>,
}
```

I create a `Context` named `AddGif` that has access to a mutable reference to `base_account`. That's why I do `#[account(mut)]`. Basically it means I can actually change the `total_gifs` value stored on `BaseAccount`.

Otherwise, I may change data on it within my function but it *wouldn't actually change* on my account. Now, w/ a "mutable" reference if I mess w/ `base_account` in my function it'll change data on the account itself.

Last, I create a lil `add_gif` function!

```rust
pub fn add_gif(ctx: Context<AddGif>) -> Result <()> {
    // Get a reference to the account and increment total_gifs.
    let base_account = &mut ctx.accounts.base_account;
    base_account.total_gifs += 1;
    Ok(())
}
```

All I do is grab the `base_account` which was passed in to the function via `Context<AddGif>`. Then, I increment the counter and that's it!!

Hope you can kinda see how the `Context` we set up near the bottom of the program actually becomes useful within the function. It's basically a nice way to say, "Hey, when someone calls `add_gif` be sure to attach the `AddGif` context to it as well so the user can access the `base_account` and whatever else is attached to `AddGif`.

### 🌈 Update the test script...again!

Every time we update our program, we need to change up our script to test the changes! Let's update `myepicproject.js` to call `add_gif`.

```javascript
const anchor = require('@project-serum/anchor');
const { SystemProgram } = anchor.web3;

const main = async() => {
  console.log("🚀 Starting test...")

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Myepicproject;
  const baseAccount = anchor.web3.Keypair.generate();
  let tx = await program.rpc.startStuffOff({
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [baseAccount],
  });
  console.log("📝 Your transaction signature", tx);

  let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF Count', account.totalGifs.toString())
	
  // Call add_gif!
  await program.rpc.addGif({
    accounts: {
      baseAccount: baseAccount.publicKey,
    },
  });
  
  // Get the account again to see what changed.
  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF Count', account.totalGifs.toString())
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
```

When I run this via `anchor test` I get:

```bash
🚀 Starting test...
📝 Your transaction signature 2Z9LZc5sFr8GHvwjZkrkqGJZ1hFNzZq2rTPV7jSEUjFoMZ16QQwPS2B7qqyNrmfFEpodHTBhvt5oSBi958mbwiR8
👀 GIF Count 0
👀 GIF Count 1
```

NICE. We are now actually storing *and* changing data on our Solana program. Epic. 

*Note: You'll notice when you run `anchor test` again it'll start the counter from 0 again. Why? Well — basically it's because whenever we run `anchor test` we generate a key pair for our account via `anchor.web3.Keypair.generate()`. This will actually create a new account every time. On our web app — we'll make sure to address this properly. But for testing purposes it's useful because we can start w/ a fresh account every time we test.*

### 🚨 Progress Report

*Please do this else Farza will be sad :(*

Post a screenshot of your terminal showing your GIF count incrementing in `#progress`!

Epic work so far :).
