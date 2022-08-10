Let's code. 

We're going to write a simple smart contract that will 
- Create a new resource
- Save it in account storage

We'll then write a transaction to retrieve it from storage.

Let's go!

### 🎴 The Flow Playground
Flow has an awesome development environment that's perfect for playing around with Cadence. Go to Flow Playground.

[Start a playground session here.](https://play.onflow.org/local-project)

Here's a handy video that goes over how you can use the Flow Playground

[Loom](https://www.loom.com/share/34b1c0f40c7a4a51bcf322ef33c27bec)

### 👋 gm world 
Let's say gm on the Flow playground! On account 0x01, add this code
```js
// "pub" is shorthand for "public", meaning this contract can be accessed by anyone 
pub contract HelloWorld {

    // Declare a public field of type String.
    //
    // All fields must be initialized in the init() function.
    pub let greeting: String

    // The init() function is required if the contract contains any fields.
    init() {
        self.greeting = "gm, World!"
    }

    // Public function that returns our friendly greeting!
    pub fun hello(): String {
        return self.greeting
    }
}
```

This contract contains two very simple things: a string variable `greeting` and a function that returns its value. 

In Cadence, you **need** to declare the starting values of every field in the `init()` function. Think of it like a constructor. You *can* leave fields empty. 

One thing to note here - `let` variables are **not** mutable/changeable. That means we have no way of changing the value of `greeting` once the contract is published. 

The `hello()` function just returns the contract variable greeting. `self` refers to the current contract. Nothing too new here. 

The playground isn't connected to the actual blockchain, it's just a "local" blockchain running in your browser. You can deploy the contract to the browser blockchain by hitting the deploy button. On the bottom of your screen you should see a `Deployed Contract To: 0x01` log. Nice!

Let's interact with it!

### 🎫 Transactions and scripts
Flow has quite a unique method of interacting with the blockchain. You create a "transaction" code block in Cadence, sign it, and send it to the blockchain to be run. Think of them like mini smart contracts. 

The beauty of transactions is that you don't need to learn how to use a library in another language (like Ethers/web3js) to interact with your smart contracts. You have an easier time cause you can just write more Cadence lol.

Scripts are the same as transactions, except they don't write any data to the blockchain. You can run them without paying any gas and without signing. 

Transactions are used to read **and** write from the blockchain. Scripts are used to just read from the blockchain (sorta like SQL queries) so this *could* have been done with a script, but you'll see why I went with a transaction soon!

Reading our greeting is pretty easy, here's what the transaction looks like:

```js
import HelloWorld from 0x01

transaction {

  prepare(acct: AuthAccount) {}

  execute {
    log(HelloWorld.hello())
  }
}
```

First, we import the HelloWorld contract from the address it was deployed to. On the testnet this address would look something like `0x4aa1a46d5b95f4bb`.

Next, in the transaction body, we can make variable declarations (just like a contract or a JS file) that will be available for the entire transaction. 

Transactions have four main phases, two of which we're seeing here:
- `prepare`: This is where you pass in signers and the only place you can access their stuff.
- `execute`: This contains the main logic of the transaction. 

In our transaction, we don't do anything in the prepare phase and just log the value that the `hello()` function from the HelloWorld contract returns.

Since our contract is just reading a public variable, it doesn't matter which account you choose to sign. Just select any and hit the send button. You should see your greeting printed out in the Transaction results section at the bottom.

Bored? Here comes the most exciting part!

### 😋 Making our gm a resource
Now we're going to do something special - make our gm a "resource". Click on account `0x02` and add this contract:

```js
pub contract HelloWorld {

    // Declare a resource that only includes one function.
    // Think of this like a recipe
	pub resource HelloAsset {
        // A transaction can call this function to get the "gm, World!"
        // message from the resource.
		pub fun hello(): String {
			return "gm, World!"
		}
	}

	init() {
        // Use the built-in "create" function to create a new instance
        // of the HelloAsset resource. 
        // Think of it like using the recipe to create a dish.
        let newHello <- create HelloAsset()

        // We can do anything in the init function, including accessing
        // the storage of the account that this contract is deployed to.
        //
        // Here we are storing the newly created HelloAsset resource
        // in the private account storage 
        // by specifying a custom path to the resource
        // make sure the path is specific!
		self.account.save(<-newHello, to: /storage/Hello)

        log("HelloAsset created and stored")
	}
} 
```

This is pretty cool. When we make something a resource, we have to follow some extra rules. The main thing to keep in mind is that resources can only exist in one place at one time. 

What's a "place"? In Cadence, a place is an account. If you try to create a new resource but don't store it on an account, the blockchain will stop you. Contracts won't deploy and transactions will be reverted. 

```js
pub resource HelloAsset {
    pub fun hello(): String {
        return "gm, World!"
    }
}
```

This is our resource definition. It contains a single function and nothing else.

```js
let newHello <- create HelloAsset()
```

This is where we actually do the creation of the resource. Arrows `<-` in Cadence indicate you're dealing with resources. If we stopped our contract here, it would not deploy because we're leaving the resource hanging without assigning it a place.

```js
self.account.save(<-newHello, to: /storage/Hello)
```

`self` refers to the current contract. `account` refers to the account that is deploying the contract (your account). We call the save function to store the `newHello` resource in the `/storage/` path on our account's custom `Hello` domain. Think of it like a directory path on your computer's hard drive!

Recap: We defined a resource, we created it, and then we stored it in our accounts' storage.

These three things are sort of comparable to a bank account vault.
1. The bank - Everything is happening *on our contract*, which is in a Flow account. This is the bank.
2. The bank account owner - This is you - your credentials are the Flow account you're using to sign the deploy transaction.
3. The bank account vault - This is *your storage* in a vault at this bank.

If you try to access the `/storage/Hello` domain on another contract, you'll get an error cause that's just like trying to look at a vault in another bank. There's nothing there!

### 🏦 Load resource from storage
Now that our resource is in storage, here's how we can pull it out. 

Create a new transaction:
```js
import HelloWorld from 0x02

// This transaction calls the "hello" method on the HelloAsset object
// that is stored in the account's storage by removing that object
// from storage, calling the method, and then putting it back in storage

transaction {

    prepare(acct: AuthAccount) {

        // load the resource from storage, specifying the type to load it as
        // and the path where it is stored
        let helloResource <- acct.load<@HelloWorld.HelloAsset>(from: /storage/Hello)

        // We use optional chaining (?) because the value in storage
        // may or may not exist, and thus is considered optional.
        log(helloResource?.hello())

        // Put the resource back in storage at the same spot
        // We use the force-unwrap operator `!` to get the value
        // out of the optional. It aborts if the optional is nil
        acct.save(<-helloResource!, to: /storage/Hello)
    }
}
```

First thing you didn't notice: we don't have an execute block here. That's cause we can do everything we need in the prepare block.

```js
let helloResource <- acct.load<@HelloWorld.HelloAsset>(from: /storage/Hello)
```

This line is doing a bunch of things. We start with `acct`, this is the account which has the resource. We call the `load` function. We specify the type with `<@HelloWorld.HelloAsset>` (this is why we imported the contract). We pass in the location at `from: /storage/hello`.

The code almost just *tells* you what it's doing. This is why I love Cadence, it's so explanatory if you understand the syntax. 

Whatever the load function returns is treated as a resource and assigned to the `helloResource` variable. 

`log()` is just like `console.log` in Javascript and `print()` in Python. The weird thing here is the `?`. This is used to indicate an [optional](https://docs.onflow.org/cadence/language/values-and-types/#optionals) type. Optionals are values that can represent the absence of a value. i.e. instead of saying a value is undefined, it explicitly states that a value is missing. If booleans can be true or false, optionals can be absent or have a value. Check out [this awesome blog post](https://joshuahannan.medium.com/optionals-in-cadence-not-optional-fb39bb4b0081#:~:text=you%E2%80%99re%20done%20reading.-,What%20are%20Optionals%3F,-Optionals%20in%20Cadence) for more detail.

```js
acct.save(<-helloResource!, to: /storage/Hello)
```
Finally, we need to put the resource back! Remember, if we leave the resource in a variable, our transaction won't work! The syntax to save is the same, you should be getting used to this :)

Before clicking "Send" on the transaction, make sure you change the transaction signer to 0x02:
![](https://hackmd.io/_uploads/H1g37dE99.png)

You can do this by clicking 0x01 in the square box and then clicking 0x02. 

We need to change signers because the contract is deployed on 0x02. If we try to access a resource stored on 0x02 from 0x01, we'll just get an error.

### 🚨 Progress report
**wow**. That was a lot. Good job.

I want you to play around with this contract a bit. Store other variables and try signing with an account that doesn't own the resource (this will error). This is how you learn!

Once you've broken something, post the error message in #progress. Stuff breaks all the time, not everything is rainbows and unicorns!