Our contract is now ready! Let's take it for a spin on a real network :)

### 🔐 Create new Testnet Account
The first thing we need to do is create a new testnet account. There are two parts to this, we'll use the flow CLI for the first, run this command:

```
flow keys generate
```

You should get a response like:
```
Desktop/Learn-flow/FlowNFTs$ flow keys generate
 If you want to create an account on testnet with the generated keys use this link:
https://testnet-faucet.onflow.org/?key=02febe07cd5cae683e...7b0ff6af0591


 Store private key safely and don't share with anyone!
Private Key      82349cd3f8a8b02d6132ac04deac657f34edb9c0e87b4377af7943c9e4ae20b8
Public Key       02febe07cd5cae683e...7b0ff6af0591
```

Nice! You just created a flow keypair using the CLI! Click the link it printed out, solve the captcha and click "Create account".

🚨 **SAVE SPOT!** 🚨
Make sure you save the account address (from the website) and the generated keys somewhere handy!

We'll be deploying our contracts with these.

You might be wondering why we had to make an "account" after we created a public/private keypair. Wtf? Isn't the "account" made of the public/private keys???

Nope. Unlike Bitcoin and Ethereum, Flow addresses are not derived from cryptographic public keys. Accounts and Keys are two different things. Once you have a keypair, you need to run an on-chain function to create an account using them. That's what the website did. It also gave us 1,000 Flow tokens. Woohoo!

If we go back to the bank vault example:
- The vault is the blockchain
- The "account" is a box inside the vault
- The "address" is the number of the box
- The "keys" are used to unlock the box

![](https://hackmd.io/_uploads/H1GjxwOY9.png)

One tiny inaccuracy in this image is that the public key (the text on the key) and the account address (the vault number) are not the same. Also, we can have more than two keys per account lol

Because of this decoupling, we can use control multiple accounts with one key and one account with several keys, sort of like a multi-sig. 

You can read more about this [here](https://docs.onflow.org/concepts/accounts-and-keys).

### 🔑 Add our keys and account to our project
We need to tell the Flow project on our computer about these keys. Open up our `flow.json` file and add our keys and the account. 

Inside your `flow.json` at the bottom you should see a section for `accounts`. We'll add our account right below the `emulator-account` making our file look like this:

```json
{
  "emulators": {
    "default": {
      "port": 3569,
      "serviceAccount": "emulator-account"
    }
  },
  "contracts": {},
  "networks": {
    "emulator": "127.0.0.1:3569",
    "mainnet": "access.mainnet.nodes.onflow.org:9000",
    "testnet": "access.devnet.nodes.onflow.org:9000"
  },
  "accounts": {
    "emulator-account": {
      "address": "f8d6e0586b0a20c7",
      "key": "3314a7fca73b5c091da87027265180a5d85e6930047f2d9bf98cc979d52c5022"
    },
    "testnet-account": {
      "address": "REPLACE_WITH_ACCOUNT_ADDRESS_FROM_WEBSITE",
      "key": "REPLACE_WITH_PRIVATE_KEY_GENERATED_VIA_CLI"
    }
  },
  "deployments": {}
}

```

You've got two things here - `address` and `key`. **Replace these with the ones you saved from the flow testnet faucet website and the terminal.**

You now have everything you need to deploy contracts and interact with the Flow testnet!

### 🔥 Deploy our contract
So quick recap: we have our Flow CLI installed, initialised our Flow project, and set up our testnet account. Cool beans. Let's now set up the contract we're going to deploy.

In `flow.json` you should see a section for contracts that currently looks like:
```
"contracts": {},
```

Add our contract to it like this:
```json
"contracts": {
		"BottomShot": "./contracts/BottomShot.cdc"
	}
```

Pretty simple, eh?

Next, scroll down to the bottom of the file to `"deployments": {}` and add this:
```json
"deployments": {
	"testnet": {
		"testnet-account": [
			"BottomShot"
		]
	}
}
```

This is how we tell our Flow CLI *what* we want to deploy, which account we want to deploy it with, and our network of choice. If we had another contract we want to deploy on the testnet, we'd just add it below the "BottomShot" value and it'll deploy them in order.

The final piece of this is changing the address of the import in our contract. Change the first line to:
```
import NonFungibleToken from 0x631e88ae7f1d7c20;
```

This is the address the contract is deployed to on the [Flow testnet](https://docs.onflow.org/core-contracts/non-fungible-token/). Since the Flow team has already deployed it, we don't need to redeploy it.

And now for the magic moment, enter this command in the terminal to deploy:
```
flow project deploy --network testnet
```

If all goes smoothly, you should see a response of:
```
Deploying 1 contracts for accounts: testnet-account

BottomShot -> 0x7b6adb682517f137 (bd892198518206e8fed6f7d7bba520b94bc9036ff5cefc856eef242c114756ec)
```

![](https://hackmd.io/_uploads/rJBkipW5q.png)


BOOM! You just deployed your first contract on the Flow testnet!!!

You can see all the contracts you've deployed on https://flow-view-source.com/testnet/

Put in your account address and you'll see your sick NFT contract!

![](https://hackmd.io/_uploads/Syk7DTbq9.png)

**Quick recap**
In this section:
1. We created Flow keys and a testnet account
2. We configured our environment with our keys and the contract
3. We deployed our contract to a real network!

Nicely done! Next we're going to make an app that will let *anyone* mint NFTs from this contract :D

### 🚨 Progress report 🚨 
Hi there Flow smart contract deployer. 

Post the URL of your deployed contract on flow-view-source in the #progress section. 