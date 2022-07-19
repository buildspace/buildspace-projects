Time to make our NFTs shine. We're going to use the Metadata Views we added to fetch the Metadata of the NFTs we mint and display them on our React app.

### 💝 Update our mint transaction
Now that we have a new contract, we need to update our mint transaction. Open the `mintNFT_tx.js` file update it:

```js
export const mintNFT = 
`
// REPLACE THIS WITH YOUR CONTRACT NAME + ADDRESS
import CatMoji from 0x7b6adb682517f137 

// Do not change these
import NonFungibleToken from 0x631e88ae7f1d7c20
import MetadataViews from 0x631e88ae7f1d7c20

transaction(
  recipient: Address,
  name: String,
  description: String,
  thumbnail: String,
) {
  prepare(signer: AuthAccount) {
    if signer.borrow<&CatMoji.Collection>(from: CatMoji.CollectionStoragePath) != nil {
      return
    }

    // Create a new empty collection
    let collection <- CatMoji.createEmptyCollection()

    // save it to the account
    signer.save(<-collection, to: CatMoji.CollectionStoragePath)

    // create a public capability for the collection
    signer.link<&{NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection}>(
      CatMoji.CollectionPublicPath,
      target: CatMoji.CollectionStoragePath
    )
  }


  execute {
    // Borrow the recipient's public NFT collection reference
    let receiver = getAccount(recipient)
      .getCapability(CatMoji.CollectionPublicPath)
      .borrow<&{NonFungibleToken.CollectionPublic}>()
      ?? panic("Could not get receiver reference to the NFT Collection")

    // Mint the NFT and deposit it to the recipient's collection
    CatMoji.mintNFT(
      recipient: receiver,
      name: name,
      description: description,
      thumbnail: thumbnail,
    )
    
    log("Minted an NFT and stored it into the collection")
  } 
}
`
```

The first change is just the name - I've changed it from `BottomShot` everywhere to `CatMoji`, because that's the name in my contract. Next I've imported the `MetadataViews` from the same address as the `NonFungibleToken` on the testnet. 

The last change I made here is the public capability link for the collection
```
signer.link<&{NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection}>(
```

This is so we can borrow our NFT collection as the MetadataViews type to fetch the thumbnail!

### ✍ Fetch metadata with scripts
Next we're going to create two scripts. Make a `getID_script.js` file in the scripts folder. It's pretty simple:
```js
export const getIDs = `
import MetadataViews from 0x631e88ae7f1d7c20;

pub fun main(address: Address): [UInt64] {
    
  let account = getAccount(address)

  let collection = account
    .getCapability(/public/CatMojiCollection)
    .borrow<&{MetadataViews.ResolverCollection}>()
    ?? panic("Could not borrow a reference to the collection")

  let IDs = collection.getIDs()
  return IDs;
}
`;
```

We pass in a user address, get their account, get the capability we need and then borrow the metadata resolver collection. Isn't Cadence beautiful?

To fetch the metadata, create a file named `getMetadata_script.js` in the scripts folder (**remember to update the path to match your contract**):
```
export const getMetadata = 
`
import MetadataViews from 0x631e88ae7f1d7c20;

pub fun main(address: Address, id: UInt64): NFTResult {
  
  let account = getAccount(address)

  let collection = account
      .getCapability(/public/CatMojiCollection) // Update the path here!
      .borrow<&{MetadataViews.ResolverCollection}>()
      ?? panic("Could not borrow a reference to the collection")

  let nft = collection.borrowViewResolver(id: id)

  var data = NFTResult()

  // Get the basic display information for this NFT
  if let view = nft.resolveView(Type<MetadataViews.Display>()) {
    let display = view as! MetadataViews.Display

    data.name = display.name
    data.description = display.description
    data.thumbnail = display.thumbnail.uri()
  }

  // The owner is stored directly on the NFT object
  let owner: Address = nft.owner!.address

  data.owner = owner

  return data
}

pub struct NFTResult {
  pub(set) var name: String
  pub(set) var description: String
  pub(set) var thumbnail: String
  pub(set) var owner: Address
  pub(set) var type: String

  init() {
    self.name = ""
    self.description = ""
    self.thumbnail = ""
    self.owner = 0x0
    self.type = ""
  }
}
`
```
This starts out just like the `getID` script. The interesting bit is this part:
```
  // Get the basic display information for this NFT
  if let view = nft.resolveView(Type<MetadataViews.Display>()) {
    let display = view as! MetadataViews.Display

    data.name = display.name
    data.description = display.description
    data.thumbnail = display.thumbnail.uri()
  }

  // The owner is stored directly on the NFT object
  let owner: Address = nft.owner!.address

  data.owner = owner

  return data
```
The first line is an [optional binding](https://docs.onflow.org/cadence/language/control-flow/#optional-binding) - think of it like a fancy if statement that does two things: it checks if a value exists, and if it does, it assigns (binds) that value to a variable.

Quick recap - an [optional](https://docs.onflow.org/cadence/language/values-and-types/#optionals) is a value which can represent the absence of a value. i.e. instead of saying a value is undefined, it explicitly states that a value is missing. If booleans can be true or false, optionals can be absent or have a value. 

With this if statement, we check if `nft.resolveView(Type<MetadataViews.Display>())` (an optional type) has a value. If it does, that value is temporarily assigned to `view` and the code in the if statement is run. 

The content of the if statement are pretty simple. We [force unwrap](https://docs.onflow.org/cadence/language/values-and-types/#force-unwrap-) the view and extract the metadata from it. Ezpz!

### 🎁 Use the scripts in our app
Start by importing two scripts we just made:
```
import { getMetadata } from "./cadence/scripts/getMetadata_script";
import { getIDs } from "./cadence/scripts/getID_script";
```

Create a stateful array called `images` at the top of your component. 
```js
const [ images, setImages ] = useState([])
```

Next up we've got the `fetchNFTs` function, you can put this next to your mint function:
```js
  const fetchNFTs = async () => {
    // Empty the images array
    setImages([]);
    let IDs = [];
    
    // Fetch the IDs with our script (no fees or signers necessary)
    try {
      IDs = await fcl.query({
        cadence: `${getIDs}`,
        args: (arg, t) => [
          arg(user.addr, types.Address), 
        ],
      })
    } catch(err) {
      console.log("No NFTs Owned")
    }
    
    let _imageSrc = []
    try{
      for(let i=0; i<IDs.length; i++) {
        const result = await fcl.query({
          cadence: `${getMetadata}`,
          args: (arg, t) => [
            arg(user.addr, types.Address), 
            arg(IDs[i].toString(), types.UInt64),
          ],
        })
        // If the source is an IPFS link, remove the "ipfs://" prefix
        if (result["thumbnail"].startsWith("ipfs://")) {
          _imageSrc.push(result["thumbnail"].substring(7))
          // Add a gateway prefix
          _imageSrc[i] = "https://nftstorage.link/ipfs/" + _imageSrc[i]
        }
        else {
          _imageSrc.push(result["thumbnail"])
        }
      }
    } catch(err) {
      console.log(err)
    }
    
    if(images.length < _imageSrc.length) {
      setImages((Array.from({length: _imageSrc.length}, (_, i) => i).map((number, index)=>
        <img style={{margin:"10px", height: "150px"}} src={_imageSrc[index]} key={number} alt={"NFT #"+number}
        />
      )))
    }
  }
```

This does 3 things: 
1. Gets the token IDs from the contract
2. Fetches the NFT metadata for each token with the ID
3. Updates the thumbnail link if we're using IPFS
4. Adds an image component to an array of images for each NFT 

This is all just Javascript with two query functions using FCL. Nothing new here!

All we need to do now is render our images and call the `fetchNFTs` function. I've just put my fetch call in a useEffect next to the other useEffect:

```
  useEffect(() => {
    if (user && user.addr) {
      fetchNFTs();
    }
  }
  , [user]);
```

To keep things simple I just added the images to my mint component:
```
  const RenderMint = () => {
    return (
      <div>
        <div className="button-container">
          <button className="cta-button button-glow" onClick={() => mint()}>
            Mint
          </button>
        </div>
        {images.length > 0 ? 
          <>
            <h2>Your NFTs</h2>
              <div className="image-container">
                {images}
              </ div>
          </> 
        : ""}
    </div>
    );
  }
```

You'll need to clear out the loaded images on logout so if the user swaps wallets they don't see their old NFTs:
```
  const logOut = () => {
    setImages([]);
    fcl.unauthenticate();
  };
```

Finally, I added some gifs to spice it up!
```
  const RenderGif = () => {
    const gifUrl = user?.addr
        ? "https://media.giphy.com/media/VbnUQpnihPSIgIXuZv/giphy-downsized.gif"
        : "https://i.giphy.com/media/Y2ZUWLrTy63j9T6qrK/giphy.webp";
    return <img className="gif-image" src={gifUrl} height="300px" alt="Funny gif"/>;
  };
```

Putting it all together, here's the final `App.js`:
```js
import React, { useState, useEffect } from "react";
import './App.css';
import twitterLogo from "./assets/twitter-logo.svg";
import * as fcl from "@onflow/fcl";
import * as types from "@onflow/types";
import { mintNFT } from "./cadence/transactions/mintNFT_tx";
import { getTotalSupply } from "./cadence/scripts/getTotalSupply_script";
import { getIDs } from "./cadence/scripts/getID_script";
import { getMetadata } from "./cadence/scripts/getMetadata_script";

const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

fcl.config({
  "flow.network": "testnet",
  "app.detail.title": "CatMoji", // Change the title!
  "accessNode.api": "https://rest-testnet.onflow.org",
  "app.detail.icon": "https://placekitten.com/g/200/200",
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
});

function App() {

  const [ user, setUser ] = useState();
  const [ images, setImages ] = useState([])

  const logIn = () => {
    fcl.authenticate();
  };

  const logOut = () => {
    setImages([]);
    fcl.unauthenticate();
  };

  const RenderGif = () => {
    const gifUrl = user?.addr
        ? "https://media.giphy.com/media/VbnUQpnihPSIgIXuZv/giphy-downsized.gif"
        : "https://i.giphy.com/media/Y2ZUWLrTy63j9T6qrK/giphy.webp";
    return <img className="gif-image" src={gifUrl} height="300px" alt="Funny gif"/>;
  };

  const RenderLogin = () => {
    return (
      <div>
        <button className="cta-button button-glow" onClick={() => logIn()}>
          Log In
        </button>
      </div>
    );
  };

  const RenderMint = () => {
    return (
      <div>
        <div className="button-container">
          <button className="cta-button button-glow" onClick={() => mint()}>
            Mint
          </button>
        </div>
        {images.length > 0 ? 
          <>
            <h2>Your NFTs</h2>
              <div className="image-container">
                {images}
              </ div>
          </> 
        : ""}
    </div>
    );
  }

  const RenderLogout = () => {
    if (
      user && user.addr) {
      return (
        <div className="logout-container">
          <button className="cta-button logout-btn" onClick={() => logOut()}>
            ❎ {"  "}
            {user.addr.substring(0, 6)}...{user.addr.substring(user.addr.length - 4)}
          </button>
        </div>
      );
    }
    return undefined;
  };

  const fetchNFTs = async () => {
    // Empty the images array
    setImages([]);
    let IDs = [];
    
    // Fetch the IDs with a script (no fees or signers)
    try {
      IDs = await fcl.query({
        cadence: `${getIDs}`,
        args: (arg, t) => [
          arg(user.addr, types.Address), 
        ],
      })
    } catch(err) {
      console.log("No NFTs Owned")
    }
    
    let _imageSrc = []
    try{
      for(let i=0; i<IDs.length; i++) {
        const result = await fcl.query({
          cadence: `${getMetadata}`,
          args: (arg, t) => [
            arg(user.addr, types.Address), 
            arg(IDs[i].toString(), types.UInt64),
          ],
        })
        // If the source is an IPFS link, remove the "ipfs://" prefix
        if (result["thumbnail"].startsWith("ipfs://")) {
          _imageSrc.push(result["thumbnail"].substring(7))
          // Add a gateway prefix
          _imageSrc[i] = "https://nftstorage.link/ipfs/" + _imageSrc[i]
        }
        else {
          _imageSrc.push(result["thumbnail"])
        }
      }
    } catch(err) {
      console.log(err)
    }
    
    if(images.length < _imageSrc.length) {
      setImages((Array.from({length: _imageSrc.length}, (_, i) => i).map((number, index)=>
        <img style={{margin:"10px", height: "150px"}} src={_imageSrc[index]} key={number} alt={"NFT #"+number}
        />
      )))
    }
  }

  const mint = async() => {

    let _totalSupply;
    try {
      _totalSupply = await fcl.query({
        cadence: `${getTotalSupply}`
      })
    } catch(err) {console.log(err)}
    
    const _id = parseInt(_totalSupply) + 1;
    
    try {
      const transactionId = await fcl.mutate({
        cadence: `${mintNFT}`,
        args: (arg, t) => [
          arg(user.addr, types.Address), //address to which NFT should be minted
          arg("CatMoji # "+_id.toString(), types.String),
          arg("Cat emojis on the blockchain", types.String),
          arg("ipfs://bafybeigmeykxsur4ya2p3nw6r7hz2kp3r2clhvzwiqaashhz5efhewkkgu/"+_id+".png", types.String),
        ],
        proposer: fcl.currentUser,
        payer: fcl.currentUser,
        limit: 99
      })
      console.log("Minting NFT now with transaction ID", transactionId);
      const transaction = await fcl.tx(transactionId).onceSealed();
      console.log("Testnet explorer link:", `https://testnet.flowscan.org/transaction/${transactionId}`);
      console.log(transaction);
      alert("NFT minted successfully!")
    } catch (error) {
      console.log(error);
      alert("Error minting NFT, please check the console for error details!")
    }
  }

  useEffect(() => {
    fcl.currentUser().subscribe(setUser);  
  }, [])

  useEffect(() => {
    if (user && user.addr) {
      fetchNFTs();
    }
  }
  , [user]);

  return (
    <div className="App">
      <RenderLogout />
      <div className="container">
        <div className="header-container">
          <div className="logo-container">
            <img src="./logo.png" className="flow-logo" alt="flow logo"/>
            <p className="header">✨Awesome NFTs on Flow ✨</p>
          </div>
          <RenderGif/>
          <p className="sub-text">The easiest NFT mint experience ever!</p>
        </div>

        {user && user.addr ? <RenderMint /> : <RenderLogin />}

        <div className="footer-container">
            <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
            <a className="footer-text" href={TWITTER_LINK} target="_blank" rel="noreferrer">{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
}

export default App;
```

And here's what it looks like!
![](https://hackmd.io/_uploads/rJ3GQD7qc.png)



### 🚨 Progress report 🚨
You've come the entire way! WELL DONE!

Post a screenshot of your finished app in #progress. 
