## 🍎 Setting up Solana on a M1 macOS Machine

**First off - I want to give a HUGE shoutout to our TA, Nick! Without Nick, this guide wouldn't have been doable. Once you finish this section make sure to give some love to Nick in Discord (Nick_G#4818)**

We are going to go **from this doesn't work on M1 masOS??** to

![Anakin it's working Gif](https://media.giphy.com/media/CuMiNoTRz2bYc/giphy.gif)

**real quick.**

This guide will get you up and running with the Solana enviroment on your local machine(shoutout to fellow builder, **@billyjacoby#7369** he mocked up the first guide about getting set up without Rosetta!) We made modifications that will get you to becoming a Solana Master faster with less headaches 🙂.

Let's kick it off!

### ⚙️ Install Rust

In Solana, programs are written in Rust! If you don't know Rust don't worry. As long as you know some other language — you'll pick it up over the course of this project.

To install Rust we will open up our terminal and run this command:

```bash
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

You will be prompted with multiple options to install. We are going to go with default entering 1 and then enter!

Once you're done, go ahead and restart your terminal and then verfiy it was installed by entering:

```bash
rustup --version
```

Then, make sure the rust compiler is installed:

```bash
rustc --version
```

Last, let's make sure Cargo is working as well. Cargo is the rust package manager.

```bash
cargo --version
```

As long as all those commands output a version and didn't error, you're good to go!

### 🔥Install Solana - THIS IS WHAT WE CAME FOR!

Solana setup has gotten a whole lot easier! All you need to download and install the Solana CLI is run this command in your terminal:

```bash
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
```

This will take a minute or two depending on your internet speed. Once it finishes, you should see something like this in your terminal:
```bash
downloading stable installer
  ✨ stable commit 5b413da initialized
```

Ta-da! Solana just installed! If you had issues, check out the sections below. If you didn't, just skip past them!


<details>
<summary>Having problems with <code>greadlink</code>?</summary>

If you receive an error that looks like this - `greadlink: command not found` you will need to do three things:

- Install Brew using `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"` (this may take a while)
- Add brew to your path using `export PATH="/opt/homebrew/bin:$PATH"`
- Install coreutils using `brew install coreutils`

Then run the script above once more an see if it works!

You may encounter additional errors like the following:
```
error: failed to download from `https://crates.io/api/v1/crates/console/0.11.3/download`

Caused by:
  [55] Failed sending data to the peer (Connection died, tried 5 times before giving up)
```

This is most likely an intermittent error; attempt to run the script again, and it should eventually download. If it _still_ doesn't end up downloading, you can try [locking your cargo version](https://github.community/t/failed-sending-data-to-the-peer-connection-died-tried-5-times-before-giving-up/189130/4) and running it again.

If that outputs a version number, you're good to go!

</details>

<details>
<summary>Having problems with <code>openssl-sys</code>?</summary>

If you receive an error that looks like this – `error: failed to run custom build command for openssl-sys v0.9.67` you will need to replace the current `openssl` entry with the following line under `[dependencies]` in `programs/bpf_loader/Cargo.toml`:

```toml
openssl = { version = "0.10", features = ["vendored"] }
```

For more information refer to [this PR with the original solution](https://github.com/solana-labs/solana/issues/20783).
  
You may run into another problem with openssl saying that it cannot be found. In this case try installing version 1.1 via brew:

```bash
brew install openssl@1.1
```

</details>

<details>
<summary>Having problems with <code>toolchain</code>?</summary>
  
If you receive an error that looks like this – `toolchain '1.52.1-aarch64-apple-darwin' is not installed` you can try to reinstall it:

```bash
rustup toolchain uninstall stable
rustup toolchain install stable
```

</details>

<details>
<summary>Having problems with <code>linking</code>?</summary>

Try adding the following to `~/.cargo/config`:

```toml
[target.x86_64-apple-darwin]
rustflags = [
  "-C", "link-arg=-undefined",
  "-C", "link-arg=dynamic_lookup",
]

[target.aarch64-apple-darwin]
rustflags = [
  "-C", "link-arg=-undefined",
  "-C", "link-arg=dynamic_lookup",
]
```
  
</details>

This might take some time, so don't be alarmed! Once you're done installing, you may need to ensure it is in your path by pasting in your terminal `export PATH="< install_path >/dev/solana"/bin:"$PATH"` and replacing `< install_path >`, then run this to make sure everything is in working order:

```bash
solana --version
```

Next thing you'll want to do is run these three commands separately:

```bash
solana config set --url localhost
solana config get
```

This will output something like this:

```bash
Config File: /Users/nicholas-g/.config/solana/cli/config.yml
RPC URL: http://localhost:8899
WebSocket URL: ws://localhost:8900/ (computed)
Keypair Path: /Users/nicholas-g/.config/solana/id.json
Commitment: confirmed
```

This means that Solana is set up to talk to our local network! When developing programs, we're going to be working w/ our local Solana network so we can quickly test stuff on our computer.
The last thing to test is we want to make sure we can get a local Solana node running. Basically, remember how we said that the Solana chain is run by "validators"? Well — we can actually set up a validator on our computer to test our programs with.

First, shoutout to **@dimfled#9450**, and send some love his way! He has 'seen things' building with Solana recently and gave us this step to get things working on M1s!

Let's now run our Solana validator

```bash
solana-test-validator
```

This may take a bit to get started but once it's going you should see something like this:

![Untitled](https://i.imgur.com/FUjRage.jpg)

Boom!! You're now running a local validator. Pretty cool :). Now, go ahead and CONTROL + C to stop the validator. We're never going to actually use solana-test-validator manually ourselves again. The workflow we're going to follow will actually automatically run the validator in the background for us. I just wanted to show you it working so you can start getting an idea of how stuff is working magically as we move forward ;).

### ☕️ Install Node, NPM, and Mocha, Yarn

Pretty solid chance you already have Node and NPM. When I do node --version I get v16.0.0. The minimum version is v11.0.0. If you don't have node and NPM, install it using NVM from [here](https://github.com/nvm-sh/nvm#installing-and-updating).

After that, be sure to install this thing called Mocha. It's a nice little testing framework to help us test our Solana programs.

```bash
npm install -g mocha
```

We'll also need Yarn for some package management. You can install it using
```bash
npm install -g yarn
```

### ⚓️ The magic of Anchor

We're going to be using this tool called "Anchor" a lot. If you know about Hardhat from the world of Ethereum, it's sorta like that! Except — it's built for Solana. **Basically, it makes it really easy for us to run Solana programs locally and deploy them to the actual Solana chain when we're ready!**

Anchor is a *really early project* run by a few core devs. You're bound to run into a few issues. Be sure to join the [Anchor Discord](https://discord.gg/8HwmBtt2ss) and feel free to ask questions or [create an issue](https://github.com/project-serum/anchor/issues) on their Github as you run into issues. The devs are awesome. Maybe even say you're from buildspace in #general on their Discord :).

**BTW — don't just join their Discord and ask random questions expecting people to help. Try hard yourself to search through their Discord to see if anyone else has had the same question you have. Give as much info about your questions as possible. Make people want to help you lol.**

_Seriously — join that Discord, the devs are really helpful._

To install Anchor, we'll need Anchor Version Manager first. Go ahead and run:

```bash
cargo install --git https://github.com/project-serum/anchor avm --locked --force
```

The above command may take a while and your computer may get a little toasty 🔥. 

This command *can* fail if you don't have all the necessary dependencies. Run this if cargo install fails:
```bash
sudo apt-get update && sudo apt-get upgrade && sudo apt-get install -y pkg-config build-essential libudev-dev
```

Once this is done, you'll have **Anchor Version Manager** installed. Now we can actually install Anchor:

```bash
avm install latest
avm use latest
```

From here run:

```bash
anchor --version
```

If you got that working, nice, you have Anchor!!

We'll also use Anchor's npm module and Solana Web3 JS — these both will help us connect our web app to our Solana program!

```bash
npm install @project-serum/anchor @solana/web3.js
```

### 🏃‍♂️ Create a test project and run it

Okay, we're _nearly done_ haha. The last thing we need to do to finalize installation is to actually run a Solana program
locally and make sure it actually works.

Before we begin, make sure you have `yarn` installed on your machine:

```bash
brew install yarn
```

We can make the boilerplate Solana project named `myepicproject` with one easy command:

```bash
anchor init myepicproject --javascript
cd myepicproject
```

`anchor init` will create a bunch of files/folders for us. It's sort of like `create-react-app` in a way. Go ahead and open up your project directory in VSCode and take a look around!

### 🔑 Create a local keypair

In order for us to talk to our Solana programs we need to generate a keypair. Really all you need to know about this is it allows us to digitally sign for transactions in Solana! Still curious? [Take a look at this page](https://solana-labs.github.io/solana-web3.js/classes/Keypair.html) for more information!

```bash
solana-keygen new
```

(Don't worry about creating a passphrase for now, just press "Enter" when asked!)

What this will do is create a local Solana keypair — which is sorta like our local wallet we'll use to talk to our programs via the command line. If you run `solana config get` you'll see something called `Keypair Path`. That's where the wallet has been created, feel free to check it out :).

If you run:

```bash
solana address
```

You'll see the public address of your local wallet we just created!

### 🥳 Let's run our program

When we did anchor init it created a basic Solana program for us. What we want to do now is:
1. Compile our program.
2. Spin up solana-test-validator and deploy the program to our local Solana network w/ our wallet. This is kinda like deploying our local server w/ new code.
3. Actually call functions on our deployed program. This is kinda like hitting a specific route on our server to test that it's working.

Anchor is awesome. It lets us do this all in one step by running:

```bash
anchor test
```
*Note*: Be sure you **don't** have solana-test-validator running anywhere else it'll conflict w/ Anchor.

This may take a while the first time you run it! As long as you get the green words the bottom that say "1 passing" you're good to go!! Keep us posted in the Discord if you run into issues here.

![Untitled](https://i.imgur.com/V35KchA.png)

<details>
<summary>Having problems with <code>Error: failed to send transaction: Transaction simulation failed: Attempt to load a program that does not exist</code>?</summary>
If you get this error, this most likely means you forgot to add your Program Id in both your <code>.toml</code> file and <code>.rs</code> file! Go ahead and grab your ID again and verify it's updated in the appropriate spots :).
</details>

<details>
  <summary>Having problems with <code>Insufficient funds</code> or <code>Error: Deploying program failed: Error processing Instruction 1: custom program error: 0x1 There was a problem deploying: Output { status: ExitStatus(unix_wait_status(256)), stdout: "", stderr: "" }</code>?</summary>
  
This means that you don't have enough SOL. Airdrop some SOL to your locahost:

```bash
solana airdrop 2
```

Run the above commands multiple times so that you get enough SOLs.

Check that you have enough balance:
```bash
solana balance
```
</details>


