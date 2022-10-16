## 🪟 Setting up Solana on a Windows machine
This resource will take you through the flow of setting up the Solana environment on your local, Windows machine. The big gotchya here is **Windows isn't really supported by Anchor at the moment.** This means we need to use a platform that *is* supported.
Windows allows for you to boot up a Linux environment for scenarios just like this! There will be a few extra steps to get this all sorted before we actually get started with setting up all the Solana dependencies. 

### 👩‍💻 Setup WSL
Like I said above, we are technically not going to use Windows for this project, but instead Linux! Windows introduced this cool thing call [**Windows Subsystem for Linux**](httphttps://docs.microsoft.com/en-us/windows/wsl/). If you are really curious how this will all works, go do a little research and report back to the others in your cohort!

To get started with WSL, we are going to need to install it. Go ahead and open up `cmd.exe` in Admin mode to start and then you are going to run this command:

```bash
wsl --install
```

This command will enable the required optional components, download the latest Linux kernel, set WSL 2 as your default, and install a Linux distribution for you (Ubuntu by default, see below to change this).

If you are interested in doing a bit more custom setup, feel free to checkout [this installation guide](https://docs.microsoft.com/en-us/windows/wsl/install).

Once this installation is done you **NEED** to restart your computer. Things will definitely not work if you install WSL and don't restart your machine. Take a second to do that and we will meet here in the next section!

### 📀 Installing Node.js
Nice! You now have a Linux subsystem available on your machine. It's actually pretty cool to see how this all works. The one thing you need to realize is this environment is abstracted from your Windows environment. So, everything on your Windows machine is not accessible on your Ubuntu instance. This means we don't have Node.js installed which something we will need to setup the rest of our Solana environment!

Start by going to your search menu and typing in `Ubuntu`. You should see a shell Ubuntu shell option pop up - go ahead and click that. Now, some of you may run into an error where you open your terminal and then there says there is an error and it closes the terminal! Make sure you go through these two steps to fix that:

**- Verify Linux Subsystem Feature is enabled**

For this, we want to make sure your machine is actually enabled to use WSL. In your search bar go aheaad and type in "Windows Features". You should see an option that says something along the lines of enabling and disabling Windows features. Go ahead and choose that. You will now need to make sure that the following options are checked:

- Windows Subsystem for Linux
- Virtual Machine Platform

After you have this all ready to go, restart your machine once again and see if you can open Ubuntu terminal! If you are still running into problems with it, this may mean your CPU does not have Virtualization enabled.

**- Turn on Virtualization.**

This sounds more intense than it truly is. Essentially some people may not have a feature on their CPU turned on. We are going to make sure it's turned on. 
For this you will need to enter the BIOS of your machine. Not all computers can enter their BIOS in the same way. I would recommend looking up how to get access to your BIOS. This will require you to restart your computer so make sure to pull this open on another machine or your phone!

As your computer restarts hit the "DEL" and "F2" key. One of these keys is usually the way to enter your computer's BIOS. At this point you will want to continue to the "Advanced Options" section. Again, this may be named differently, but it should be something similar to more options. 
From here you will want to head to a CPU section or Virtualization section and make sure it says "Enabled".

These two steps should get you on your way now! If they don't make sure to reach out in your section chat on Discord with whatever error you are running into.

Now that we have Ubuntu Terminal ready to go - we can start installing Node.js 😎. We are actually going to be using something called [nvm](https://github.com/nvm-sh/nvm). It will make it insanely easy to install and change versions of Node!

Feel free to just follow [this guide](https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl) on how to get this setup on WSL, but essentially your flow is going to look like this:

```
// Install Curl
sudo apt-get install curl

// Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash

// Restart Ubuntu Terminal

// Test if nvm exists - this will return "nvm" and not a version number if working correctly!
command -v nvm

// Install the latest version of Node.js
nvm install --lts
```

It's thats easy! One you have this all setup, you are ready to get back on track with the rest of your setup! Just remember - all of your terminal commands **NEED** to be ran in this Ubuntu Terminal from now on.

### 🦀 Install Rust

In Solana, programs are written in Rust! If you don't know Rust don't worry. As long as you know some other language — you'll pick it up over the course of this project.

To install Rust just use this command -

```bash
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

Once you're done, restart Ubuntu terminal. Once it's up, verify by doing:

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

All you need to download and install the Solana CLI is run this command in your terminal:

```bash
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
```

This will take a minute or two depending on your internet speed. Once it finishes, you should see something like this in your terminal:
```bash
downloading stable installer
  ✨ stable commit 5b413da initialized
```

Ta-da! Solana just installed!  If you want extra detail, the installation steps are pretty straight forward, check them out [here](https://docs.solana.com/cli/install-solana-cli-tools#use-solanas-install-tool). There are clear steps for getting the Solana CLI installed for Linux.

**Don't** worry about upgrading to the latest version of Solana.

*Note: Depending on your system — once you install Solana, it may output a message like "Please update your PATH environment variable" and it'd give you a line to copy and run. Go ahead and copy + run that command so your PATH gets setup properly.*

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

This may take a bit to get started but once it's going you should see something like this:

![Untitled](https://i.imgur.com/F2YwcAB.png)

Boom!! You're now running a local validator. Pretty cool :).

Now, go ahead and CONTROL + C to stop the validator. **We're never going to actually use `solana-test-validator` manually ourselves again.** The workflow we're going to follow will actually automatically run the validator in the background for us. I just wanted to show you it working so you can start getting an idea of how stuff is working magically as we move forward ;). 

### ☕️ Install Mocha and Yarn

Mocha is a nice little testing framework to help us test our Solana programs.

```bash
npm install -g mocha
```

That's it! We are going to be using this later on :).

We'll also need Yarn for some package management. You can install it using
```bash
npm install -g yarn
```

### ⚓️ The magic of Anchor

We're going to be using this tool called "Anchor" a lot. If you know about Hardhat from the world of Ethereum, it's sorta like that! Except — it's built for Solana. **Basically, it makes it really easy for us to run Solana programs locally and deploy them to the actual Solana chain when we're ready!**

Anchor is a *really early project* run by a few core devs. You're bound to run into a few issues. Be sure to join the [Anchor Discord](https://discord.gg/8HwmBtt2ss) and feel free to ask questions or [create an issue](https://github.com/project-serum/anchor/issues) on their Github as you run into issues. The devs are awesome. Maybe even say you're from buildspace in #general on their Discord :).

**BTW — don't just join their Discord and ask random questions expecting people to help. Try hard yourself to search the their Discord to see if anyone else has had the same question you have. Give as much info about your questions as possible. Make people want to help you lol.**

*Seriously — join that Discord, the devs are really helpful.*

To install Anchor, we'll need Anchor Version Manager first. Go ahead and run:

```bash
cargo install --git https://github.com/project-serum/anchor avm --locked --force
```

The above command may take a while and your computer may get a little toasty 🔥. 

This command *can* fail if you don't have all the necessary dependencies. Run this **if** cargo install fails (and then run the above command again to install Anchor Version Manager) :
```bash
sudo apt-get update && sudo apt-get upgrade && sudo apt-get install -y pkg-config build-essential libudev-dev libssl-dev
```

If you're having issues with `openssl-sys v0.9.72` try running command below. This make sures the development packages of `openssl` are installed.

If you're on Ubuntu:

```bash
sudo apt-get install libssl-dev
```

If you're on Fedora:

```bash
sudo apt-get install openssl-devel
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


### 🏃‍♂️ Create a test project and run it

Okay, we're *nearly done* haha. The last thing we need to do to finalize installation is to actually run a Solana program locally and make sure it actually works.

Let's start a boilerplate Solana project named `myepicproject`.

```
anchor init myepicproject --javascript
cd myepicproject
```

`anchor init` will create a bunch of files/folders for us. It's sorta like `create-react-app` in a way. We'll check out all the stuff it's created in moment.


### 🔑 Create a local keypair

Next thing we need to do is actually generate a local Solana wallet to work with. Don't worry about create a passphrase for now, just tap "Enter" when it asks.

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

This may take a while the first time you run it! As long as you get the green words the bottom that say "1 passing" you're good to go!! Keep us posted in the Discord if you run into issues here.

![Untitled](https://i.imgur.com/V35KchA.png)

**Note: If you receive the message `node: --dns-result-order= is not allowed in NODE_OPTIONS` this mean you are on an older version of Node and technically, this didn't pass! Since I tested this all with Node v16.13.0 I would highly suggest you just upgrade to this version.**

**Congrats you've successfully set up your Solana environment :).** It's been quite the journey, but, we made it fam.

### 🚨 Progress Report

*Please do this else Farza will be sad :(*

That was all pretty tough!!! Definitely one of the more difficult installations.

Post a screenshot of your test working in `#progress` so people know you made it :).

Now go ahead and get back to your [buildspace Dashboard](https://app.buildspace.so/courses/CObd6d35ce-3394-4bd8-977e-cbee82ae07a3) to continue on!
