You've learned what Flow is. You're familiar with Cadence and understand what a resource is. Your environment is ready to get you off localhost.

### 👁 A real NFT contract
Time to make a proper NFT contract. As you noticed, our current NFT contract just makes blank NFTs. There's also no mint function so no one else can get NFTs lol

Here's what an NFT contract with basic features like:
```js
pub contract BottomShot {
  // This is a simple NFT mint counter
  pub var totalSupply: UInt64
  
  pub resource NFT {
    // The unique ID that differentiates each NFT
    pub let id: UInt64

    // We set the ID of the NFT and update the NFT counter
    init() {
        self.id = BottomShot.totalSupply
        // totalSupply is a global variable for this contract
        BottomShot.totalSupply = BottomShot.totalSupply + (1 as UInt64)
    }
  }
  
  // This is a resource that's going to contain all the NFTs any one account owns
  pub resource Collection {
    // This is a dictionary that maps ID integers with NFT resources
    // the @ indicates that we're working with a resource
    pub var ownedNFTs: @{UInt64: NFT}

    // This function will deposit an NFT into the collection
    // Takes in a variable called token of type NFT that's a resource
    pub fun deposit(token: @NFT) {
      // Move the NFT into the ownedNFTs dictionary
      // <-! is the force-assignment operator
      self.ownedNFTs[token.id] <-! token
    }

    pub fun withdraw(id: UInt64): @NFT {
      // We pull out the NFT resource from the dictionary 
      let token <- self.ownedNFTs.remove(key: id) ??
        panic("This collection doesn't contain an NFT with that id")
      
      return <- token
    }
    
    // Returns an array of integers
    pub fun getIDs(): [UInt64] {
      // The keys in the ownedNFTs dictionary are the IDs
      return self.ownedNFTs.keys
    }

    init() {
      // All resource values MUST be initiated so we make it empty!
      self.ownedNFTs <- {}
    }
  
    // This burns the ENTIRE collection (i.e. every NFT the user owns) 
    destroy () {
      destroy self.ownedNFTs
    }
  }

  pub fun createCollection(): @Collection {
    return <- create Collection()
  }

  pub fun mintNFT(): @NFT {
    return <- create NFT()
  } 

  init() {
    self.totalSupply = 0
  }
}
```

Be not overwhelmed! This is the moment you realise how **easy** Cadence is. 

I've left a bunch of comments. **Read them.** Then make sure you read the code, it almost explains itself! 

For the parts that don't explain themselves, you've got me <3 

Starting from the top:
```
  // This is a simple NFT mint counter
  pub var totalSupply: UInt64
  
  pub resource NFT {
    // The unique ID that differentiates each NFT
    pub let id: UInt64

    // We set the ID of the NFT and update the NFT counter
    init() {
        self.id = BottomShot.totalSupply
        // totalSupply is a global variable for this contract
        BottomShot.totalSupply = BottomShot.totalSupply + (1 as UInt64)
    }
  }
```

Our NFT resource definition is slightly different: we only need the NFT ID here. Remember, the init function runs every time a resource is created. In it we set the ID for the created NFT and update the global counter. This guarantees each NFT has a unique ID so we can use them for identification!

Right after this, you have a `Collection` resource. Think back to when you were a kid. Did you have a Pokemon card collection? Maybe you collected marbles, coins or stamps? Or maybe I'm a boomer and kids collect Fortnite skins these days. Whatever you collected, you probably kept them all *in the same place* (or same Fortnite account lol). This made it way easier to keep track of them. 

We're doing the same thing in Cadence. A collection is a resource that owns all of our NFTs. This makes storing + retrieving them really easy. Each account that wants to mint an NFT will first have to make a collection.

The new syntax we see in the collection resource:

```ts
pub var ownedNFTs: @{UInt64: NFT}
```
[Dictionaries](https://docs.onflow.org/cadence/tutorial/04-non-fungible-tokens/#dictionaries): These are just like mappings!

```ts
self.ownedNFTs[token.id] <-! token
```
[Force assignment operator](https://docs.onflow.org/cadence/language/values-and-types/#force-assignment-operator--): This assigns a resource to a variable if the variable is nil. If the variable is not nil, the execution aborts lol

### 🏃‍♂️ Run and interact with our contract
We're just going to use the extension to deploy our contracts locally from now on. You can use the [CLI commands](https://docs.onflow.org/flow-cli/account-update-contract/) if you want, but I'm gonna stick with the extension to keep things consistent.

Just click the "Deploy contract" link/button at the top of the file:
![](https://hackmd.io/_uploads/S12BICKtq.png)

To interact with our contract, we're going to write a transaction. Make a `transactions` folder at the root of your project and add a file called `createCollection.cdc`:
```ts
import BottomShot from 0xf8d6e0586b0a20c7

transaction {
  
  prepare(acct: AuthAccount) {
    acct.save(<- BottomShot.createCollection(), to: /storage/BottomShot)
  }

  execute {
    log("Stored a collection for our NUTTY empty NFTs")
  }
}
```

This transaction calls the `createCollection` function and stores it on the `BottomShot` domain on our contract. 

Again, to run this, just click the the prompt at the top of the file, for transactions it says "Send signed by ServiceAccount"

![](https://hackmd.io/_uploads/Bkou8JcFq.png)

ServiceAccount is the default account you're logged in with on the emulator. You'll see the logs printed in the terminal running the emulator:

![](https://hackmd.io/_uploads/SyXM4k5Fc.png)

Nice! We just ran a transaction locally and interacted with our contract on the emulator!

Let's mint an NFT and add it to this collection! Create another file in your transactions folder called `depositNFT.cdc`:
```swift
import BottomShot from 0xf8d6e0586b0a20c7

transaction {
  
  prepare(acct: AuthAccount) {
    let collectionReference = 
      acct.borrow<&BottomShot.Collection>(from: /storage/BottomShot)
      ?? panic("No collection found!")

    collectionReference.deposit(token: <- BottomShot.mintNFT())
  }

  execute {
    log("Minted an NFT and stored it into the collection")
  }
}
```

Here we're seeing something new: `borrow`.

Remember how I said that resources can only exist in one place at one time? This also means you can't run functions or access stuff inside those resources. 

So in this transaction, we borrow the collection resource from the place it's stored in (`/storage/BottomShot`). This gives us a temporary *reference* to the resource (if we are allowed access to it) so we can make changes to it. Once the transaction ends, the resource is automatically returned. 

We use the reference to call the `deposit` function and pass in the NFT resource returned by the mint function. 

The `?` is indicating that the value before it is an [optional](https://docs.onflow.org/cadence/language/values-and-types/#optionals) - it can have a value, or it can be `nil`, meaning nothing. `??` is for a double-optional, meaning it can either have a value which is optional, or it can be `nil`. If the borrow function gives nothing back, we [`panic`](https://docs.onflow.org/cadence/language/built-in-functions/#panic), which terminates the transaction with the error.

LETSSS GOOOOO WE'RE BALLIN OUR ACCOUNT HAS A COLLECTION **AND** AN NFT INSIDE IT!!!

### 😯 Capabilities and scripts
There's a big problem with our contract right now. There's no way for others to find out which NFTs I own from contract storage. This is because the `getIDs` function is *inside* the Collection resource and only accessible by my account. This means you'd have to give away your NFT to someone to let them see what it is. Yikes.

Head back over to your contract, we're going to add an interface that'll solve this. Add the `CollectionPublic` resource on line 16, right after where you declare the NFT resource:

```swift=16

  // This interface exposes only the getIDs function
  pub resource interface CollectionPublic {
    pub fun getIDs(): [UInt64]
  }
  
  // Update the Collection resource declaration to implement the new interface
  pub resource Collection: CollectionPublic {
    // The rest of your contract REMAINS THE SAME
```

Seems kinda weird, doesn't it? How does adding this interface for a function that we already had solve anything? AHA! You've fallen into my trap. By making you do something seemingly useless, I've gotten you invested into what comes next.

Cadence has this long-named "[Capability-based Access Control](https://docs.onflow.org/cadence/language/capability-based-access-control/)" thing. What it lets us do is create a **capability** that gives specific users access to certain fields or functions of a stored object. 

Think of it like a key that unlocks a specific part of your safety deposit box. You can put this key somewhere (under your doormat for instance) and anyone who knows about the key has the capability to access the object. They can fetch the key and then open the safety deposit box.

**Note**
Make sure you remember to redeploy your contract here! You can do this by clicking deploy at the top of the file.

Now that we have an interface that exposes the only function we want people to have, we're going to give everyone the *capability* to call this function.

Open your `createCollection.cdc` transaction and update it to this:
```swift
import BottomShot from 0xf8d6e0586b0a20c7

transaction {
  
  prepare(acct: AuthAccount) {
                                                // I changed the storage address here
    acct.save(<- BottomShot.createCollection(), to: /storage/BottomShot2)
    
    // We're linking two resources in different storage domains
    acct.link<&BottomShot.Collection{BottomShot.CollectionPublic}>
      (/public/BottomShot2, target: /storage/BottomShot2)
  }
  
  execute {
    log("Stored a collection for our NUTTY empty NFTs")
  }
}
```

I made two changes here. 

First: I changed the path (/storage/BottomShot2) on which we're storing our collection. This is because you can't overwrite to storage on Flow (imagine accidentally overwriting a CryptoPunk 💀) and if you haven't closed your emulator since the last time you made a collection, that path will be taken. 

The big change here is the `link` function call. The collection exists on the `/storage/` domain. We're linking it to the `/public/` domain. Reminder: /storage is only accessible by the account owner. /public is accessible by anyone.

Syntax breakdown:
- `acct.link`: account we're working with and the function we're calling
- `<&BottomShot.Collection{BottomShot.CollectionPublic}>`: This is the type our `link` function expects - a reference (&) to the CollectionPublic resource on the BottomShot contracts' Collection
- `(/public/BottomShot2, target: /storage/BottomShot2)`: The two paths we're linking

Put another way:
```
account.function<&Contract.Resource{Contract.Interface}>(destinationPath, sourcePath)
```

Click "Send signed" at the top of the transaction file to run it. Update the `depositNFT.cdc` transaction with the new path ("BottomShot2") and run it too. 

We now have a new contract, a new collection, and a new NFT. Let's write a script to read them! 

Create a folder called `scripts` and add a file called `getIDs.cdc`:
```
import BottomShot from 0xf8d6e0586b0a20c7

pub fun main(acct: Address): [UInt64] {
  let publicRef = getAccount(acct).getCapability(/public/BottomShot2)
            .borrow<&BottomShot.Collection{BottomShot.CollectionPublic}>()
            ?? panic ("Oof ouch owie this account doesn't have a collection there")

  return publicRef.getIDs()
}
```

Scripts are a bit different from transactions. Since they don't require signers, we pass in an address (not an account) as a parameter. We use the address to get the account and then call the `getCapability` function to access the resource we linked earlier. In simpler terms, we're accessing the public storage of an account with its address to call a function on it. 

The `borrow` function tries to access the `CollectionPublic` resource so we can call its functions. We end with a panic in case things go wrong :)

Once we have a reference to the public resource, we just hit the `getIDs()` function.

To run this, head back into your terminal (keep the emulator running) and run this command:
```
# In the FlowNFTs folder
flow scripts execute scripts/getIDs.cdc f8d6e0586b0a20c7
```

This will print out an array of NFT IDs! If you only ran the `depositNFT` transaction once, you'll just see `Result: [1]`. Run it a few times more! Here's what I see after two runs:

![](https://hackmd.io/_uploads/BJcKPfqF5.png)

### 🚨 Progress report
You just did a lot of doing. Pat yourself on the back. This is hard stuff and YOU'RE CRUSHING IT!

Post a screenshot of your script output with the IDs in #progress, show everyone how far along you are.
