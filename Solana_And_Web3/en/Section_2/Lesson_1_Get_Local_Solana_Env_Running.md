### 🦾 What are we going to do?

We have all our web app stuff mostly done. But, we're using fake data! We're going to build a Solana program that lets users 1) submit gifs to the board 2) have them saved on the Solana blockchain 3) retrieve all the GIFs that have been submitted.

Once we do this, we'll deploy our Solana program and hook it up to our web app — kinda like you'd deploy an API and then hook it up to your web app!!

### 📝 A note on Solana before we hop in

Okay, so, to be honest getting Solana running and working is **not easy right now.**

Now, does this mean Solana sucks? Ehhhh. No, I don't think so.

I think Solana is a really **early** piece of technology and because it's so early it's changing often so it's hard to just Google a question or get a clear, concise answer from the Solana Docs.

Back in 2015, I was really into machine learning and it was still pretty new. In 2015, machine learning docs sucked and it was hard to just search for an answer to a question myself because most of the time I was the first person asking that question lol. *It was up to me to actually figure out an answer and then update the docs myself.*

That's the price of playing around with a piece of emerging technology :).

I think Solana is in a similar spot and I really want to make it clear — **don't expect a super clean developer experience. You will likely run into random bumps and it's up to you to figure out an answer + help others.**

I like this [tweet](https://twitter.com/armaniferrante/status/1434554725093949452) as well which kinda lays out a similar idea.

**All this being said, I think Solana is insanely fun once you set it up and get a handle on how it works. It's so fast. The low-gas fees are magical. It's just really fun to be part of a community working on a breakthrough technology. It feels like you're part of the team actually building Solana :).**

### 🚦 Choose your path
Getting Solana setup all starts with your machine. There are a bunch of "gotchyas" on different OS's. If you are running an **Intel macOS machine or Linux machine** feel free to move right on through. If you are running a **Windows machine or M1 macOS machine** follow one of the links below:

- [Setup Solana on Windows Machine](https://github.com/buildspace/buildspace-projects/tree/main/Solana_And_Web3/en/Section_2/Resources/windows_setup.md)

- [Setup Solana on a M1 macOS Machine](https://github.com/buildspace/buildspace-projects/tree/main/Solana_And_Web3/en/Section_2/Resources/m1_setup.md)

Good luck - you got this!

### 🦀 Install Rust

In Solana, programs are written in Rust! If you don't know Rust don't worry. As long as you know some other language — you'll pick it up over the course of this project.

To install Rust, you can just follow the installation steps [here](https://doc.rust-lang.org/book/ch01-01-installation.html). There are clear steps for getting Rust installed for Windows, Linux, and Mac.

Once you're done, verify by doing:

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

### 🔥 Install Solana

Solana has a super nice CLI that's going to be helpful later when we want to test the programs we write.

Again, the installation steps are pretty straight forward [here](https://docs.solana.com/cli/install-solana-cli-tools#use-solanas-install-tool). There are clear steps for getting the Solana CLI installed for Windows, Linux, and Mac.

**Don't** worry about upgrading to the latest version of Solana.

*Note: Depending on your system — once you install Solana, it may output a message like "Please update your PATH environment variable" and it'll give you a line to copy and run. Go ahead and copy + run that command so your PATH gets setup properly.*

Once you're done installing, run this to make sure stuff is working:

```bash
solana --version
```

If that output a version number, you're good to go!

Next thing you'll want to do is run these two commands separately:

```bash
solana config set --url localhost
solana config get
```

This will output something like

```bash
Config File: /Users/flynn/.config/solana/cli/config.yml
RPC URL: http://localhost:8899
WebSocket URL: ws://localhost:8900/ (computed)
Keypair Path: /Users/flynn/.config/solana/id.json
Commitment: confirmed
```

This means that Solana is set up to talk to our local network! When developing programs, we're going to be working w/ our local Solana network so we can quickly test stuff on our computer.

The last thing to test is we want to make sure we can get a **local Solana node running**. Basically, remember how we said that the Solana chain is run by "validators"? Well — we can actually set up a validator on our computer to test our programs with.

```bash
solana-test-validator
```
### Notes for Windows users

If you are a Windows user and the above command doesn't work, or you get the following error `Unable to connect to validator: Client error: test-ledger/admin.rpc does not exist` make sure you do the following.

1. Open WSL instead of Powershell.
2. Enter the command `cd ~/` to get out of the starting directory
3. Now enter `solana-test-validator`

This may take a bit to get started but once it's going you should see something like this:

![Untitled](https://i.imgur.com/F2YwcAB.png)

Boom!! You're now running a local validator. Pretty cool :).

If you are running an Intel Mac and see the error below you will need to install the `OpenSSL` library. The easiest way to do this would be through brew like so:  `brew install openssl@1.1`

```bash
solana-gif-portal solana-test-validator
dyld: Library not loaded: /usr/local/opt/openssl@1.1/lib/libssl.1.1.dylib
  Referenced from: /Users/<your-username>/.local/share/solana/install/active_release/bin/solana-test-validator
  Reason: image not found
```

Now, go ahead and CONTROL + C to stop the validator. **We're never going to actually use `solana-test-validator` manually ourselves again.** The workflow we're going to follow will actually automatically run the validator in the background for us. I just wanted to show you it working so you can start getting an idea of how stuff is working magically as we move forward ;).

### ☕️ Install Node, NPM, and Mocha

Pretty solid chance you already have Node and NPM. When I do `node --version` I get `v16.0.0`. The minimum version is `v11.0.0`. If you don't have node and NPM, get it [here](https://nodejs.org/en/download/).

After that, be sure to install this thing called Mocha. It's a nice little testing framework to help us test our Solana programs.

```bash
npm install -g mocha
```

### ⚓️ The magic of Anchor

We're going to be using this tool called "Anchor" a lot. If you know about Hardhat from the world of Ethereum, it's sorta like that! Except — it's built for Solana. **Basically, it makes it really easy for us to run Solana programs locally and deploy them to the actual Solana chain when we're ready!**

Anchor is a *really early projec*t run by a few core devs. You're bound to run into a few issues. Be sure to join the [Anchor Discord](https://discord.gg/8HwmBtt2ss) and feel free to ask questions or [create an issue](https://github.com/project-serum/anchor/issues) on their Github as you run into issues. The devs are awesome. Maybe even say you're from buildspace in #general on their Discord :).

**BTW — don't just join their Discord and ask random questions expecting people to help. Try hard yourself to search their Discord to see if anyone else has had the same question you have. Give as much info about your questions as possible. Make people want to help you lol.**

*Seriously — join that Discord, the devs are really helpful.*

Installing this thing was a little troublesome for me, but, I got it working via the steps below! We're going to build it from source. *Note: If you're on Linux, there are some special instructions you can follow [here](https://www.anchor-lang.com/docs/installation). Mac and Windows below. Also, if you're using Linux for Windows, follow the Linux commands!*

To install Anchor, go ahead an run:

```bash
cargo install --git https://github.com/project-serum/anchor anchor-cli --locked
```

The above command may take a while. Once it's done, it may ask you to update your path, remember to do that.

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

Okay, we're *nearly done* haha. The last thing we need to do to finalize installation is to actually run a Solana program locally and make sure it actually works.

Let's start a boilerplate Solana project named `myepicproject`.

```bash
anchor init myepicproject --javascript
cd myepicproject
```
### Notes for windows users

1. Run the commands using WSL2 and not powershell.
2. If `cargo install --git https://github.com/project-serum/anchor avm --locked --force` gives you errors. Refer to the Anchor user documents. You might need to install the Linux (WSL) dependencies. To do this, run `sudo apt-get update && sudo apt-get upgrade && sudo apt-get install -y pkg-config build-essential libudev-dev`
3. If you get further issues such as `error: failed to run custom build command` for `openssl-sys v0.9.71`, run `sudo apt install libssl-dev`
4. Once these dependencies have been installed, the command from step 2 should work.
5. Now set the anchor version with `avm use latest` and you should be good to go!

`anchor init` will create a bunch of files/folders for us. It's sorta like `create-react-app` in a way. We'll check out all the stuff it's created in moment.

If you are running the project locally and don't have yarn installed `anchor init` will fail. To solve this you can install yarn by running `npm install --global yarn
`.

### 🔑 Create a local keypair

Next thing we need to do is actually generate a local Solana wallet to work with. Don't worry about creating a passphrase for now, just tap "Enter" when it asks.

```bash
solana-keygen new
```

What this will do is create a local Solana keypair — which is sorta like our local wallet we'll use to talk to our programs via the command line. If you run `solana config get` you'll see something called `Keypair Path`. That's where the wallet has been created, feel free to check it out :).

If you run:

```bash
solana address
```

 You'll see the public address of your local wallet we just created.

### 🥳 Let's run our program

When we did `anchor init` it created a basic Solana program for us. What we want to do now is:

1. Compile our program.
2. Spin up `solana-test-validator` and deploy the program to our **local** Solana network w/ our wallet. This is kinda like deploying our local server w/ new code.
3. Actually call functions on our deployed program. This is kinda like hitting a specific route on our server to test that it's working.

Anchor is awesome. It lets us do this all in one step by running:

*Note: Be sure you **don't** have `solana-test-validator` running anywhere else it'll conflict w/ Anchor. This took me a while to figure out lol.*

```bash
anchor test
```

This may take a while the first time you run it! As long as you get the green words at the bottom that say "1 passing" you're good to go!! Keep us posted in the Discord if you run into issues here.

![Untitled](https://i.imgur.com/V35KchA.png)

**Note: If you receive the message `node: --dns-result-order= is not allowed in NODE_OPTIONS` this mean you are on an older version of Node and technically, this didn't pass! Since I tested this all with Node v16.13.0 I would highly suggest you just upgrade to this version. Upgrading node is a pain, learn more here. I like using [nvm](https://heynode.com/tutorial/install-nodejs-locally-nvm/).**

**Note: If you get this message `Error: Your configured rpc port: 8899 is already in use` and you do not have application which is listenning to port 8899, try to run `solana-test-validator`, and in the next terminal tab `anchor test --skip-local-validator`. It should run fine.**

**Congrats you've successfully set up your Solana environment :).** It's been quite the journey, but, we made it fam.

### 🚨 Progress Report

*Please do this else Farza will be sad :(*

That was all pretty tough!!! Definitely one of the more difficult installations.

Post a screenshot of your test working in `#progress` so people know you made it :).
