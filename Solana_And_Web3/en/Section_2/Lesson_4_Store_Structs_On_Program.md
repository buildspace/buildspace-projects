Epic. We're storing data on our Solana program. Not many people know how to do this stuff, so, you should definitely feel like a bit of a wizard. This ecosystem is really early and you're at the center of the magic right now.

So, a counter is cool. But, we want to store more complex data!

Let's now set it up where we can store an array of structs with more data we care about like: *a link to the gif and the public address of the person who submitted it.* Then, we'd be able to retrieve this data on our client!

### 💎 Set up Vec<ItemStruct>

Check out some of the updates below:

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

  // The function now accepts a gif_link param from the user. We also reference the user from the Context
  pub fn add_gif(ctx: Context<AddGif>, gif_link: String) -> Result <()> {
    let base_account = &mut ctx.accounts.base_account;
    let user = &mut ctx.accounts.user;

	// Build the struct.
    let item = ItemStruct {
      gif_link: gif_link.to_string(),
      user_address: *user.to_account_info().key,
    };
		
	// Add it to the gif_list vector.
    base_account.gif_list.push(item);
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

// Add the signer who calls the AddGif method to the struct so that we can save it
#[derive(Accounts)]
pub struct AddGif<'info> {
  #[account(mut)]
  pub base_account: Account<'info, BaseAccount>,
  #[account(mut)]
  pub user: Signer<'info>,
}

// Create a custom struct for us to work with.
#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ItemStruct {
    pub gif_link: String,
    pub user_address: Pubkey,
}

#[account]
pub struct BaseAccount {
    pub total_gifs: u64,
	// Attach a Vector of type ItemStruct to the account.
    pub gif_list: Vec<ItemStruct>,
}
```

Starting from the bottom again, you'll see `BaseAccount` now has a new param named `gif_list`.  It's of type `Vec` which is basically short for `Vector`. You can read about them [here](https://doc.rust-lang.org/std/vec/struct.Vec.html). It's basically an array! In this case, it holds an array of `ItemStruct`s.

Then I have this fancy piece of code to declare my `ItemStruct`.

```rust
#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ItemStruct {
    pub gif_link: String,
    pub user_address: Pubkey,
}
```

It just holds a `String` w/ a `gif_link` and a `PubKey` w/ the user's `user_address`. Pretty straightforward. We also have this craziness:

```rust
#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
```

It's a little complex, but, basically this tells Anchor how to serialize/deserialize the struct. Remember, data is being stored in an "account" right? That account is basically a file and we serialize our data into binary format before storing it. Then, when we want to retrieve it we'll actually deserialize it.

This line takes care of that to make sure our data is properly serialized/deserialized since we're creating a custom struct here.

How did I figure this stuff out? Well  — I actually just dig through the [docs](https://docs.rs/anchor-lang/0.4.0/anchor_lang/trait.AnchorSerialize.html) myself and just read the source code! I also ask questions in the [Anchor Discord](https://discord.gg/8HwmBtt2ss)! Remember, this stuff is new and it's up to you to discover answers when the docs don't provide them.

### 🤯 Update the test script and boom!

As always, we need to return to our test script! Here are the updates:

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

  // You'll need to now pass a GIF link to the function! You'll also need to pass in the user submitting the GIF!
  await program.rpc.addGif("insert_a_giphy_link_here", {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  });
  
  // Call the account.
  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF Count', account.totalGifs.toString())

  // Access gif_list on the account!
  console.log('👀 GIF List', account.gifList)
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

*Note: don't forget to pass `addGif` a GIF link where it says `insert_a_giphy_link_here` else you'll get a confusing error like: `baseAccount not provided`.*

Nothing new here really! One of the magic moments for me was when I saw the output of `console.log('👀 GIF List', account.gifList)`. It's so cool to be able to just attach data to an account and access data via the account.

It's a really weird and new way to think about storing data, but it's pretty cool!!!

Here's what my output looked like upon doing `anchor test`.

```bash
🚀 Starting test...
📝 Your transaction signature 3CuBdZx8ocXmzXRctvKkhttWHpP9knvAZnXQ9XyNcgr1xeqs6E3Hj9RVkEWSc2iEW15xXprKzip1hQw8o5kWVgsa
👀 GIF Count 0
👀 GIF Count 1
👀 GIF List [
  {
    gifLink: 'insert_a_giphy_link_here',
    userAddress: PublicKey {
      _bn: <BN: 69f90845012df1b26922a9e895b073309e647c36e9052f7c9ec29793b8be9e99>
    }
  }
]
```

We've gotten pretty far. We're now not only writing and running Solana programs, but, we've figured out how to store some complex data now as well! Yay :).

### 🚨 Progress Report

*Please do this else Farza will be sad :(*

Post a screenshot of your terminal showing your item structs in `#progress`!

Pretty tough to get all this working. You're doing great :).
