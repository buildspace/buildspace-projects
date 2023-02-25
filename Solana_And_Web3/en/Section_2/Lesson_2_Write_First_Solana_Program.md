Go ahead an open up `myepicproject` in VSCode.

If you are on Windows, remember that this all needs to be done with WSL. In case you don't remember where you installed everything in your Ubuntu instance, follow these steps to get back to your project:

Press `'windows' + R` to open up the `RUN` Box. This is where you can type the command `\\wsl$\Ubuntu` and an explorer window should pop up.
Inside these folders, go to the `home` folder and then `username` folder. This is where you will find `myepicproject`!

*If you don't see any files/folders in the explorer, make sure you are have an Ubuntu terminal window open.*

💡if you cannot find the `home` folder or `myepicproject`, another way is to type this command in the wsl terminal

`wslpath -w [myepicproject_path_in_wsl]`

(just replace the [myepicproject_path_in_wsl] with the path of `myepicproject` in your Unbuntu instance.) , then it will show u the corresponding path in your windows filesystem.

You'll see all the magic stuff Anchor has generated for us here.

**Delete** the contents of `programs/myepicproject/src/lib.rs` and  `tests/myepicproject.js`. Don't actually delete the files, just what's in them.

*Note: I **didn't** actually install the Rust extension for VSCode. It already has Rust syntax highlighting for me out of the box.*

### 👶 A basic program

Let's write our first Solana program! This Rust code is going to live in the `lib.rs` file.

Here's what it looks like:

```rust
use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod myepicproject {
  use super::*;
  pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> Result <()> {
    Ok(())
  }
}

#[derive(Accounts)]
pub struct StartStuffOff {}
```

A lot happening here so let's just step line-by-line. Again, if you don't know Rust — don't worry too much. I think you can pick this stuff up pretty quickly. You won't become a Rust Master like this, but, you can worry about that later :).

```rust
use anchor_lang::prelude::*;

```

A simple `use` declaration at the top. Kinda like an import statement. We want to import in a lot of the tools Anchor provides for us to make writing Solana programs easier.

```rust
declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");
```

We'll cover this thing a little later. Basically, this is the "program id" and has info for Solana on how to run our program. Anchor has generated this one for us. We'll be changing it later.

```rust
#[program]
```

This is how we tell our program, "Hey — everything in this little module below is our program that we want to create handlers for that other people can call". You'll see how this comes into play. But, essentially this lets us actually call our Solana program from our frontend via a fetch request. We'll be seeing this `#[blah]` syntax a few places.

They're called [macros](http://web.mit.edu/rust-lang_v1.25/arch/amd64_ubuntu1404/share/doc/rust/html/book/first-edition/macros.html) — and they basically attach code to our module. It's sorta like "inheriting" a class.

```rust
pub mod myepicproject {
  use super::*;
  pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> Result <()> {
    Ok(())
  }
}
```

`pub mod` tells us that this is a Rust "[module](https://stevedonovan.github.io/rust-gentle-intro/4-modules.html)" which is an easy way to define a collection of functions and variables — kinda like a class if you know what that is. And we call this module `myepicproject`. Within here we write a function `start_stuff_off` which takes something called a `Context` and outputs a `Result <()>`. You can see this function doesn't do anything except call `Ok(())` which is just a `Result` type you can read about [here](https://doc.rust-lang.org/std/result/).

So really, this thing `start_stuff_off` is just a function that someone else can call now. It doesn't do anything right now, but, we'll change that :).

```rust
#[derive(Accounts)]
pub struct StartStuffOff {}
```

Lastly we have this thing at the bottom. It'll be more obvious why this is important later. But basically it's another `macro`. Here, we'll basically be able to specify different account constraints. Again, it'll make more sense in a bit hehe.

Let's just get stuff running and see what happens.

### 💎 Write a script to see it working locally

We need to basically tell Anchor how we want our program to run and what functions we want to call. Head over to `tests/myepicproject.js`. This is actually written in javascript :).

Go ahead and code this up:

```javascript
const anchor = require('@project-serum/anchor');

const main = async() => {
  console.log("🚀 Starting test...")

  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.Myepicproject;
  const tx = await program.rpc.startStuffOff();

  console.log("📝 Your transaction signature", tx);
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

We can step line by line here. First off, the `runMain` thing is just some javascript magic to get our `main` function to run asynchronously. Nothing special really.

The real magic happens here:

```javascript
anchor.setProvider(anchor.AnchorProvider.env());
const program = anchor.workspace.Myepicproject;
const tx = await program.rpc.startStuffOff();
```

First, we tell Anchor to set our provider. So, it gets this data from `solana config get`. In this case, it's grabbing our local environment! This way Anchor knows to run our code locally (later we'll be able to test our code on devnet!).

Then, we grab `anchor.workspace.Myepicproject` and this is a super cool thing given to us by Anchor that will automatically compile our code in `lib.rs` and get it deployed locally on a local validator. A lot of magic in one line and this is a big reason Anchor is awesome.

*Note: Naming + folder structure is mega important here. Ex. Anchor knows to look at `programs/myepicproject/src/lib.rs` b/c we used `anchor.workspace.Myepicproject`.*

Finally, we actually call our function we made by doing `program.rpc.startStuffOff()` and we `await` it which will wait for our local validator to "mine" the instruction.

Before we run it, need to make a quick change.

In `Anchor.toml` we want to change the `[scripts]` tags a little:

```
[scripts]
test = "node tests/myepicproject.js"
```

**Keep everything else in `Anchor.toml` the same!**

Finally, let's run it using:

```bash
anchor test
```

Here's what I get near the bottom:

```bash
🚀 Starting test...
📝 Your transaction signature 4EPghDAKXjtseY1dB4DT3xwpt18L1QrL8qbAJ3a3mRaTTZURkgBuUhN3sNhppDbwJNRL75fE53ucTBytoPWNEMAx
```

*Note: If you are using VSCode, don't forget to **save** all the files you're changing before running `anchor test`! I personally ran into so many issues because I thought I saved the file, but in reality I didn't :(.*

*Note: If you see this error `Attempt to load a program that does not exist`, you can do `solana address -k target/deploy/myepicproject-keypair.json` and replace with this address every occurency in `lib.rs`, `Anchor.toml`, and  `myepicproject.js`.*

**BOOOOM. YOU DID IT.**

As long as you see a "transaction signature", you're good! This means you successfully called the `startStuffOff` function and this signature is basically your receipt.

Pretty epic. You've written a Solana program, **deployed it to your local Solana node**, and are now actually speaking to your deployed program on your local Solana network.

**NICEEEEEEE.** I know it may not seem like much but you now have a basic flow to do stuff.

1. Write code in `lib.rs`
2. Test specific functions using `tests/myepicproject.js`.

Get used to this cycle! It's the fastest way to iterate on your Solana programs :).

### 🚨 Progress Report

*Please do this else Farza will be sad :(*

Post a screenshot of your basic test working in `#progress`! It's always motivating for others to see people figuring shit out.
