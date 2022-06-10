### 🦾 What are we going to do?

So — the goal is to create a web app that lets users **connect their wallet, click mint, and receive an NFT from our collection in their wallet.** Simple enough!

We'll need to install the Solana CLI and Metaplex CLI to get this going.

The Solana CLI will allow us to deploy to devnet, an actual blockchain run by real [validators](https://solana.com/validators).

The Metaplex CLI will allow us to interact with Metaplex's deployed NFT contracts. Using their smart-contracts-as-a-service we can 1) create our own candy machine 2) upload our NFTs to our candy machine 3) allow users to actually hit our candy machine to mint an NFT.

### 📝 A note on Solana before we hop in

Okay, so, to be honest getting Solana running and working is **not easy right now.**

Now, does this mean Solana sucks? Ehhhh. No, I don't think so.

I think Solana is a really **early** piece of technology and because it's so early it's changing often so it's hard to just Google a question or get a clear, concise answer from the Solana Docs.

Back in 2015, I was really into machine learning and it was still pretty new. In 2015, machine learning docs sucked and it was hard to just search for an answer to a question myself because most of the time I was the first person asking that question lol. *It was up to me to actually figure out an answer and then update the docs myself.*

That's the price of playing around with a piece of emerging technology :).

I think Solana is in a similar spot and I really want to make it clear — **don't expect a super clean developer experience. You will likely run into random bumps and it's up to you to figure out an answer + help others.**

I like this [tweet](https://twitter.com/armaniferrante/status/1434554725093949452) as well which kinda lays out a similar idea.

**All this being said, I think Solana is insanely fun once you set it up and get a handle on how it works. It's so fast. The low-gas fees are magical. It's just really fun to be part of a community working on a breakthrough technology. It feels like you're part of the team actually building Solana :).**

### 🤖 Install the pre-reqs

To begin interacting with the Candy Machine CLI, we need to make sure you have a few basic dev tools. Go ahead and run these commands and install anything that isn't there!

```plaintext
git version
> git version 2.31.1 (or higher!)

node --version
> v14.17.0 (or higher, below v17 -- we found that node v16 works best)

yarn --version
> 1.22.11 (or higher!)

ts-node --version
> v10.2.1 (or higher!)
```

If any of these commands are not found, please make sure to install it before moving on.

- [git Installation](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [node Installation](https://nodejs.org/en/download/)
- [yarn Installation](https://classic.yarnpkg.com/lang/en/docs/install)
- [ts-node Installation](https://www.npmjs.com/package/ts-node#installation)

Be sure to install `ts-node` globally. I used this command: `npm install -g ts-node`
> If you run into EACCES permissions errors while installing, please checkout this [link](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally)

### 🔥 Install Solana

The installation steps are pretty straight forward [here](https://docs.solana.com/cli/install-solana-cli-tools#use-solanas-install-tool). There are clear steps for getting the Solana CLI installed for Windows, Linux, and Mac.

**Don't** worry about upgrading to the latest version of Solana. You can install the stable version by replacing the version number with "stable" like this: `sh -c "$(curl -sSfL https://release.solana.com/stable/install)"`

*Note: Depending on your system — once you install Solana, it may output a message like "Please update your PATH environment variable" and it'll give you a line to copy and run. Go ahead and copy + run that command so your PATH gets setup properly.*

Once you're done installing, run this to make sure stuff is working:

```plaintext
solana --version
```

If that output a version number, you're good to go! Next thing you'll want to do is run these two commands separately:

```plaintext
solana config set --url devnet
solana config get
```

This will output something like:

```plaintext
Config File: /Users/flynn/.config/solana/cli/config.yml
RPC URL: https://api.devnet.solana.com
WebSocket URL: wss://api.devnet.solana.com/ (computed)
Keypair Path: /Users/flynn/.config/solana/id.json
Commitment: confirmed
```

During this entire project we will be building directly on Solana's devnet. This is pretty hype. It's sorta like Solana's version of a "staging" environment. It's an actual blockchain run by real validators and is free to use for developers.

### ☹️ Ahhhh help it's broken!

Dang it! Solana can be rough to get working. We're happy to help though!! Post a message in `#section-2-help` so your fellow buildspacers can help you out! Be sure to give us as much info as possible like: your OS, screenshots of the error, etc.

### 🤩 Getting started with the Metaplex CLI

Now that we have our Solana CLI installed, we'll need to install the Metaplex CLI which allows us to actually create our candy machine.

**If you have a Mac with M1 chip, you'll need to install some additional dependencies before installing the Metaplex CLI**, follow these [instructions](https://docs.metaplex.com/storefront/installation#apple-m1-chip). 

Let's start by cloning the metaplex repo from Github. Check [here](https://github.com/metaplex-foundation/metaplex/tags) for tag name of the latest version, you can replace `v1.1.1` with the latest version. *I recommend cloning the repo to the home folder of your user. So, you can do a `cd ~`  to get there (not sure what it is on Windows lol).*

```plaintext
git clone -b v1.1.1 https://github.com/metaplex-foundation/metaplex.git
```

From here it's just a matter of installing all the dependencies for this CLI, by using this command in the directory where you just installed Metaplex. Note: I don't actually cd into the folder. I just run all the commands I need from outside the folder. I never actually go inside the `metaplex` folder. You'll see why this is easier later!

```plaintext
yarn install --cwd ~/metaplex/js/
```

In case you get an error such as `There appears to be trouble with your network connection. Retrying...`, you may try using:
```plaintext
yarn install --cwd ~/metaplex/js/ --network-timeout 600000
```
Most of the time this happens because the default timeout that is set in the Yarn configuration is too low, so when this time runs out it assumes that it's a network problem. 

Before we move on, let's make sure everything is working as expected by running the following command to get the `version`.

```plaintext
ts-node ~/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts --version
```

This should spit out `0.0.2`. At this point, we are good to go to start setting up our NFTs :).

**Note**: If you're on MacOS, you might run into an issue if you had the old version of the Metaplex CLI installed. Make sure you delete the `metaplex-foundation` or `metaplex` directory in your `~` folder!
 
### 🚨 Progress Report

*Please do this else Farza will be sad :(*

Post a screenshot in `#progress` of your terminal showing off the output of `solana config get`!
