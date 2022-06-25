### 🤑 Create and upload our NFT assets 
All this time we've been writing code. Let's shift gears and come up with NFT ideas!

This is where you get to decide what your NFT collection is actually going to be about. Is it about your favourite anime characters? Maybe some cool movie posters? You could also just put cats on the blockchain for the nth time. That's exactly what I'm gonna do 😹

**Now, this is the time for you to get insanely creative. Come up with five random NFTs for your collection.** Your NFTs can be videos, images, or even mp3 files! I'm going to go with plain old images in the .png format. 

Create a folder called "assets" and add your files in it. Make sure they're named sequentially from 0 to 5 (or more). We're going to store these on [IPFS](https://en.wikipedia.org/wiki/InterPlanetary_File_System?utm_source=buildspace.so&utm_medium=buildspace_project), which is essentially a distributed file system. Today — you might use something like S3, GCP Storage, or Dropbox. But, in this case we can simply trust IPFS which is run by strangers who are using the network. Give [this](https://decrypt.co/resources/how-to-use-ipfs-the-backbone-of-web3?utm_source=buildspace.so&utm_medium=buildspace_project) a quick read when you can! Covers a lot of good base knowledge :).

We'll use a dope free service called [NFT.Storage](https://nft.storage/) to upload our assets to IPFS. Make an account and log in. We'll use their NFTUp desktop application to upload files. Setup is gonna take about 60 seconds, just [follow the instructions here](https://nft.storage/docs/how-to/nftup/). 

Drag + drop your files or click the upload button and select them. 
![](https://hackmd.io/_uploads/r1dkjF-cc.png)

It'll give you three things - the CID (content ID), the IPFS URL, and the Gateway URL. The IPFS URL is what we'll use in our contract.  
![](https://hackmd.io/_uploads/HJ88YtWq5.png)

You can click the gateway URL to see your NFTs in the browser. The cool part here is that this behaves just like a cloud storage drive with your assets in it. You can access all your files with the same link by just replaced the file-name at the end.

![](https://hackmd.io/_uploads/SJhzaYZcc.png)

Our assets are ready to go! These assets are permanent - they'll never go down or change, so you can be sure that your NFTs will survive *anything!*

**Note**
You *can* use images on the regular internet from websites like Imgur, but these links can break and are not recommended for NFTs. 

If you decide to use your own image, make sure the URL goes directly to the actual image, not the website that hosts the image! For instance, direct Imgur links look like this - `https://i.imgur.com/123123.png` NOT `https://imgur.com/gallery/123123`. The easiest way to tell is to check if the URL ends in an image extension like .png or .jpg. You can right click the imgur image and "copy image address". This will give you the correct URL.

Our contract is pretty good right now. It's good enough that we could deploy it to the testnet. But it's just another contract right now. It has nothing in it that tells all the apps running on Flow that it's an NFT contract. 

If OpenSea decided BottomShot was the next big thing and that they want to list the NFTs, they'd have to go over the contract and look at all the functions and build around it. This is kinda lame, we should be following the same standard as other projects out there! Our contract does not explicitly declare that it meets any NFT standards. Let's fix this!

### 🎟 The NonFungibleToken standard
The Flow ecosystem has a standard for NFTs that everyone has agreed to. The Flow team deployed it on the [testnet and the mainnet](https://docs.onflow.org/core-contracts/non-fungible-token/), so when you get to those networks, you can just import from the existing address. For now, we're going to deploy it on our emulator ourselves.

We're going to import an *interface* for Nonfungible tokens that implements the standard for all NFTs on Flow. If you're coming from Ethereum, this is like the ERC721 of Flow. 

Head over [here](https://github.com/onflow/flow-nft/blob/master/contracts/NonFungibleToken.cdc) for the code. Make a new file called `NonFungibleToken.cdc` in your contracts folder and add the code. 

Once copied over, click the "deploy" button at the top of the NonFungibleToken.cdc file. This will deploy this contract interface to the default service account - `0xf8d6e0586b0a20c7`

Head back into your contract file so you can import it at the top and add a bunch of other changes:

```js
// We're importing the contract from the default service account
import NonFungibleToken from 0xf8d6e0586b0a20c7;

// Here we tell Cadence that our BottomShot contract implements the interface
pub contract BottomShot: NonFungibleToken {

  pub var totalSupply: UInt64

  pub event ContractInitialized()
  pub event Withdraw(id: UInt64, from: Address?)
  pub event Deposit(id: UInt64, to: Address?)

  pub let CollectionStoragePath: StoragePath
  pub let CollectionPublicPath: PublicPath

  // Our NFT resource conforms to the INFT interface
  pub resource NFT: NonFungibleToken.INFT {
    pub let id: UInt64

    pub let name: String
    pub let description: String
    pub let thumbnail: String

    init(
        id: UInt64,
        name: String,
        description: String,
        thumbnail: String,
    ) {
        self.id = id
        self.name = name
        self.description = description
        self.thumbnail = thumbnail
    }
  }

  pub resource interface BottomShotCollectionPublic {
    pub fun deposit(token: @NonFungibleToken.NFT)
    pub fun getIDs(): [UInt64]
    pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
  }

  // Same goes for our Collection, it conforms to multiple interfaces 
  pub resource Collection: BottomShotCollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic {
    pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

    init () {
      self.ownedNFTs <- {}
    }
    
    // An upgraded deposit function
    pub fun deposit(token: @NonFungibleToken.NFT) {
      let token <- token as! @BottomShot.NFT

      let id: UInt64 = token.id

      // Add the new token to the dictionary, this removes the old one
      let oldToken <- self.ownedNFTs[id] <- token
      
      // Trigger an event to let listeners know an NFT was deposited to this collection
      emit Deposit(id: id, to: self.owner?.address)
      
      // Destroy (burn) the old NFT
      destroy oldToken
    }

    pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
      let token <- self.ownedNFTs.remove(key: withdrawID) ??
        panic("This collection doesn't contain an NFT with that ID")

      emit Withdraw(id: token.id, from: self.owner?.address)

      return <-token
    }

    // getIDs returns an array of the IDs that are in the collection
    pub fun getIDs(): [UInt64] {
      return self.ownedNFTs.keys
    }

    pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
      return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
    }

    destroy() {
      destroy self.ownedNFTs
    }
  }

  pub fun createEmptyCollection(): @NonFungibleToken.Collection {
    return <- create Collection()
  }

  // Mints a new NFT with a new ID and deposits it 
  // in the recipients collection using their collection reference
  pub fun mintNFT(
    recipient: &{NonFungibleToken.CollectionPublic},
    name: String,
    description: String,
    thumbnail: String,
  ) {
    // create a new NFT
    var newNFT <- create NFT(
      id: BottomShot.totalSupply,
      name: name,
      description: description,
      thumbnail: thumbnail
    )

    // Deposit it in the recipient's account using their collection ref
    recipient.deposit(token: <-newNFT)

    BottomShot.totalSupply = BottomShot.totalSupply + UInt64(1)
  }

  init() {
    self.totalSupply = 0

    self.CollectionStoragePath = /storage/BottomShotCollection
    self.CollectionPublicPath = /public/BottomShotCollection

    // Create a Collection for the deployer
    let collection <- create Collection()
    self.account.save(<-collection, to: self.CollectionStoragePath)

    // Create a public capability for the collection
    self.account.link<&BottomShot.Collection{NonFungibleToken.CollectionPublic, BottomShot.BottomShotCollectionPublic}>(
      self.CollectionPublicPath,
      target: self.CollectionStoragePath
    )

    emit ContractInitialized()
  }
}
```

If the Cadence extension screams at you, just restart the server from the command palette (`CMD`/`CTRL`+`SHIFT`+`P`):
![](https://hackmd.io/_uploads/rkDOcnOYq.png)

Woah. That looks like a lot of code. Don't worry, you know most of it! Plus Cadence makes the new parts very simple. Let's break it down line by line.
```
import NonFungibleToken from 0xf8d6e0586b0a20c7;

pub contract BottomShot: NonFungibleToken {
```
As previously mentioned, we're importing the NonFungibleToken interface from the account it's deployed to. We use it when declaring our contract, telling the compiler that our contract meets the requirements of the interface.

What's an interface? It's an abstract type that defines the behaviour of things that implement it. Still confused? Me too lol. 

You can think of an interface like a set of rules or a description. Imagine the interface for a sedan: 4 doors, an enclosed body (no open roof), and a separate section for the driver and passengers. If I showed you a fancy 2-door BMW without a roof, you'd tell me that isn't a sedan! Similarly, contract interfaces help us define and set standards. If I declare that my contract meets the NFT interface but then I don't implement all the requirements, it won't run.

```
  pub var totalSupply: UInt64

  pub event ContractInitialized()
  pub event Withdraw(id: UInt64, from: Address?)
  pub event Deposit(id: UInt64, to: Address?)
  
  pub let CollectionStoragePath: StoragePath
  pub let CollectionPublicPath: PublicPath
```

Next we've got a bunch of new variables. We already know `totalSupply`.

The `event` type is new - it's basically a webhook on the blockchain. We can trigger/emit these events in certain places to indicate that something has happened. The arguments we pass in are emitted as well, making it easy to track NFT transfers in this contract. The last two are just storage paths for where we're storing our NFT collection. Storing them on the contract means scripts and transactions won't have to hardcode them over and over again.

```
  pub resource NFT: NonFungibleToken.INFT {
    pub let id: UInt64

    pub let name: String
    pub let description: String
    pub let thumbnail: String

    init(
        id: UInt64,
        name: String,
        description: String,
        thumbnail: String,
    ) {
        self.id = id
        self.name = name
        self.description = description
        self.thumbnail = thumbnail
    }
  }
```

Our NFT resource has evolved! It now has a name, a description and a thumbnail. These are to fit the new interface - NFT now implements `INFT` from the NonFungibleToken standard. All these values are set on creation, and they're all `let`, meaning you can't change their name, ID or thumbnail after! 

```
  pub resource interface BottomShotCollectionPublic {
    pub fun deposit(token: @NonFungibleToken.NFT)
    pub fun getIDs(): [UInt64]
    pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
  }
```

Our handy public collection interface has also added some extra functions. Since we're making `deposit` public, anyone can add NFTs to this collection. If you don't like spam, you can remove `deposit`! I'm gonna keep it in because who knows what I might get airdropped lol

We're also making a "borrow" function public. This is from the interface, we'll go over this when we reach it.

```
pub resource Collection: BottomShotCollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic {
```

Our main collection resource changes quite a bit. First, we implement a couple of interfaces from the NonFungibleToken standard. You can jump into the contract file to see what these are.

Next we've got the new deposit function:
```
  pub fun deposit(token: @NonFungibleToken.NFT) {
    let token <- token as! @BottomShot.NFT

    let id: UInt64 = token.id

    // Add the new token to the dictionary which removes the old one
    let oldToken <- self.ownedNFTs[id] <- token

    emit Deposit(id: id, to: self.owner?.address)

    destroy oldToken
  }
```
Here we're two new things: typecasting (converting types) with `as!` and explicitly destroying old NFTs. Why is this necessary? Because Cadence doesn't know that `ownedNFTs[id]` is going to be empty. So we get the resource out of that index (even if it doesn't exist) and then move the new one in. 

Our `withdraw` function is pretty similar, it just has an event and uses new types. `getIDs` is identical.

Finally, we see something new:
```
    pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
      return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
    }
```

As the name suggests, this function allows anyone to borrow an NFT from a collection. Using it we fetch a reference to an object in storage without removing it from storage. This means we can easily access all public data the resource has, such as the description and thumbnail!

Syntax breakdown:
- `pub fun borrowNFT(id: UInt64)`: A public function called borrowNFT that takes in an argument "id" of type `UInt64`
- `&NonFungibleToken.NFT`: Returns a *reference* of type `NonFungibleToken.NFT`
- `&self.ownedNFTs[id]`: This gets a reference to the resource stored at the [id] index in ownedNFTs
- `as &NonFungibleToken.NFT?`: Converting types
- `!`: [Force Unwrap](https://docs.onflow.org/cadence/language/values-and-types/#force-unwrap-) the value in the () before returning it

Finally, we have the new mint function:
```
  pub fun mintNFT(
    recipient: &{NonFungibleToken.CollectionPublic},
    name: String,
    description: String,
    thumbnail: String,
  ) {
    // create a new NFT
    var newNFT <- create NFT(
      id: BottomShot.totalSupply,
      name: name,
      description: description,
      thumbnail: thumbnail
    )

    // deposit it in the recipient's account using their reference
    recipient.deposit(token: <-newNFT)

    BottomShot.totalSupply = BottomShot.totalSupply + UInt64(1)
  }
```

This is pretty straightforward. The main thing you wanna pay attention to is the `thumbnail` field. It stores the location of the media for our NFTs. This can be a plain HTTP link or an IPFS hash.

Now **this** is a contract worth deploying!

### 👀 Mint an NFT locally
Let's make a quick transaction to check that our mint function works. Create a `mintNFT.cdc` file in your transactions folder and add this:
```
import BottomShot from 0xf8d6e0586b0a20c7
import NonFungibleToken from 0xf8d6e0586b0a20c7

// Our transaction object now takes in arguments!
transaction(
    recipient: Address,
    name: String,
    description: String,
    thumbnail: String,
) {
  prepare(signer: AuthAccount) {
    // Check if the user sending the transaction has a collection
    if signer.borrow<&BottomShot.Collection>(from: BottomShot.CollectionStoragePath) != nil {
        // If they do, we move on to the execute stage
        return
    }

    // If they don't, we create a new empty collection
    let collection <- BottomShot.createEmptyCollection()

    // Save it to the account
    signer.save(<-collection, to: BottomShot.CollectionStoragePath)

    // Create a public capability for the collection
    signer.link<&{NonFungibleToken.CollectionPublic}>(
        BottomShot.CollectionPublicPath,
        target: BottomShot.CollectionStoragePath
    )
  }


  execute {
    // Borrow the recipient's public NFT collection reference
    let receiver = getAccount(recipient)
        .getCapability(BottomShot.CollectionPublicPath)
        .borrow<&{NonFungibleToken.CollectionPublic}>()
        ?? panic("Could not get receiver reference to the NFT Collection")

    // Mint the NFT and deposit it to the recipient's collection
    BottomShot.mintNFT(
        recipient: receiver,
        name: name,
        description: description,
        thumbnail: thumbnail,
    )
    
    log("Minted an NFT and stored it into the collection")
  } 
}
```
This is a heftier transaction, go over the comments! It does two things: creates an empty collection if necessary *and* it mints the NFT. You should be familiar with most of the syntax here. If something confuses you, just tag @Raza in #section-1-help on Discord and I'll come to your rescue :sunglasses: 

We won't be able to run this with the extension. Enter this in your terminal (make sure you update the arguments!):
```
flow transactions send ./transactions/mintNFT.cdc "0xf8d6e0586b0a20c7" "CatMoji #1" "Cat emojis on the blockchain" "ipfs://bafybeigmeykxsur4ya2p3nw6r7hz2kp3r2clhvzwiqaashhz5efhewkkgu/0.png"
```

Here I'm creating an NFT with the name "CatMoji #1" and setting the thumbnail to the IPFS hash. If you're not using IPFS, you can replace it with your regular internet link like `https://i.imgur.com/123123.png`.

The syntax is 
```
flow transactions send <code filename> [<argument> <argument>...] [flags]
```

You'll see a confirmation printed out:
![](https://hackmd.io/_uploads/HyZUZsZ5c.png)

**WE'RE DOING IT.** We're making NFTs on Flow! Let's get off localhost next!

### 🚨 Progress report 🚨 
We're at the last stretch.

Post a screenshot of your uploaded NFT assets to IPFS on NFT.storage!
