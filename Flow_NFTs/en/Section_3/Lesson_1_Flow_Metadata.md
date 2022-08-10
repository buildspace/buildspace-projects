Our app is taking shape. You can mint a fancy immortal cat NFT that no one can take away from you. But it could have something more: it could display our NFTs.

To do this, we need to *look* at the media the NFT has. How would we find out how to do that? 

We'd look at the contract, see that it has a `thumbnail` field and find out which accessible functions give us the `thumbnail` value. But what if OpenSea thinks that we were really cool and decides to list us? They'd have to do the same! Imagine how much work that would be for OpenSea. 

This is similar to the problem we had with our first contract. It didn't follow a standard so no one could be *sure* it was an NFT contract.

Our current contract does not follow any **Metadata** standards so there's no way for anyone to easily find out what type of media our NFTs have and how you can access it. 

The solution? Another interface! The MetadataViews standard allows all NFT projects to speak a common language.

Head back to your contract file, we're going to implement this standard! 

Since not a whole lot changes, I've put the contract in a Gist, get it from [here](https://gist.github.com/AlmostEfficient/28d2fa6bdf8c920cbbc03f1b9f770b5f).

### 🔍 Views
The big addition in this standard are Views. In simple words, a view is a description of how an NFT can be viewed. A basic view would be a name, a description and a thumbnail.  

Here are the two main functions added:
```
    pub fun getViews(): [Type] {
      return [
        Type<MetadataViews.Display>()
      ]
    }

    pub fun resolveView(_ view: Type): AnyStruct? {
      switch view {
        case Type<MetadataViews.Display>():
          return MetadataViews.Display(
            name: self.name,
            description: self.description,
            thumbnail: MetadataViews.HTTPFile(
              url: self.thumbnail
            )
          )
      }
      return nil
    }
  }

```

The first function - `getViews` - return an array of Type. This tells us all the types that the NFT can be viewed as. 

A crude comparison is thinking of the NFT like a landscape. Each view is a window looking at the landscape, showing different parts of it.

![](https://hackmd.io/_uploads/By0HwZM9q.jpg)

Your contract can have as many views as you want, each showing a unique part of the NFT. 

The `resolveView` function takes in a view type and can give back *anything*. It tosses the view into a switch. This switch is where you'd add new view resolutions.

The `_` in the `resolveView` function definition before view is a [special argument label](https://docs.onflow.org/cadence/language/functions/#:~:text=parameter%20name.%20The-,special%20argument%20label,-_%20indicates%20that) which indicates that a function call can omit the argument label.

This means when calling the function you don't have to include the label. 
```
contract.function{
  label: value,
  name: "CatMoji"
}
```

Finally, we have a borrow function for the `viewResolver`:
```
pub fun borrowViewResolver(id: UInt64): &AnyResource{MetadataViews.Resolver} {
  let nft = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
  let CatMoji = nft as! &CatMoji.NFT
  return CatMoji as &AnyResource{MetadataViews.Resolver}
}
```
This lets anyone pass in an ID and get a reference to the resolver so they can fetch the metadata of that NFT :)

Check out the Metadata proposal [here](https://forum.onflow.org/t/introducing-nft-metadata-on-flow/2798) and the entire standard [here](https://github.com/onflow/flow/blob/master/flips/20210916-nft-metadata.md).

That's it! Your contract is now superpowered, compliant with everything and ready for final deploy!

### 🚀 Deploy our final contract
You'll notice the name of this contract is different. We're also using different storage paths. 

This is because we're **not** going to upgrade our old contract. We're going to deploy this final contract as a new one. 

The steps to deploy are the same, here's a quick recap:
1. Create a new contract file. I'm naming mine `CatMoji.cdc` - the actual name of my collection
2. Add the contract from the Gist (make sure you update the collection name inside the contract for yours!!!)
3. Add the file in the `contracts` in flow.json
4. Replace the contract name in `deployments`
5. Use the `flow project deploy --network testnet` command to deploy

Here's what my final flow.json looks like:
```json
{
  "emulators": {
    "default": {
      "port": 3569,
      "serviceAccount": "emulator-account"
    }
  },
  "contracts": {
		"BottomShot": "./contracts/BottomShot.cdc",
        "CatMoji": "./contracts/CatMoji.cdc"
	},
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
      "address": "YOUR_ADDRESS_HERE",
      "key": "YOUR_PRIVATE_KEY_HERE"
    }
  },
	"deployments": {
    "testnet": {
      "testnet-account": [
        "CatMoji"
      ]
    }
  }
}
```

Now if you go to [Flow View Source](https://flow-view-source.com/testnet/) you'll see both your old and new contract!

![](https://hackmd.io/_uploads/ryncaNQ5c.png)

If you want to update this contract later, you can use the same command but with an additional flag:
```
flow project deploy --network testnet --update
```

This will update your contract on the same address and name 🤠

Now that's done, we can make use of the fancy new view! 

### 🚨 Progress report 🚨
Wow. Not one, but TWO contracts deployed to the testnet?? You're probably top 10% of Cadence devs right now 😎

Once again, post the URL of your deployed contract on flow-view-source in #progress. This will show people all the other contracts that are out there. Maybe someone can learn from all the fancy stuff you've done!