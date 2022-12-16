让我们的 NFT 大放异彩的时候到了。 我们将使用添加的元数据视图来获取我们铸造的 NFT 的元数据，并将它们显示在我们的 React 应用程序上。

### 💝 更新我们的 mint 交易
现在我们有了新合约，我们需要更新我们的 mint 交易。 打开 `mintNFT_tx.js` 文件更新它：
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



第一个变化只是名称——我已将其从`BottomShot`到处更改为`CatMoji`，因为这是我合同中的名称。 接下来，我从与测试网上的 `NonFungibleToken` 相同的地址导入了 `MetadataViews`。

我在这里所做的最后更改是集合的公共功能链接
```
signer.link<&{NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection}>(
```



这样我们就可以借用我们的 NFT 集合作为 MetadataViews 类型来获取缩略图！

### ✍ 使用脚本获取元数据
接下来我们将创建两个脚本。 在脚本文件夹中创建一个 `getID_script.js` 文件。 这很简单：
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



我们传入一个用户地址，获取他们的帐户，获取我们需要的功能，然后借用元数据解析器集合。 Cadence不漂亮吗？

要获取元数据，请在脚本文件夹中创建一个名为`getMetadata_script.js`的文件（**记得更新路径以匹配您的合同**）：
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


这就像 `getID` 脚本一样开始。 有趣的是这一部分：
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


第一行是一个 [optional binding](https://docs.onflow.org/cadence/language/control-flow/#optional-binding) - 把它想象成一个奇特的 if 语句，它做了两件事：它检查是否 一个值存在，如果存在，则将该值分配（绑定）给一个变量。

快速回顾 - [optional](https://docs.onflow.org/cadence/language/values-and-types/#optionals) 是一个可以表示值缺失的值。 也就是说，它不是说一个值是未定义的，而是明确指出一个值丢失了。 如果布尔值可以为 true 或 false，则可选值可以不存在或具有值。

使用此 if 语句，我们检查`nft.resolveView(Type<MetadataViews.Display>())`（可选类型）是否有值。 如果是，则将该值临时分配给 `view` 并运行 if 语句中的代码。

if 语句的内容非常简单。 我们[强制展开](https://docs.onflow.org/cadence/language/values-and-types/#force-unwrap-) 视图并从中提取元数据。 急！

### 🎁在我们的应用程序中使用脚本
首先导入我们刚刚制作的两个脚本：
```
import { getMetadata } from "./cadence/scripts/getMetadata_script";
import { getIDs } from "./cadence/scripts/getID_script";
```



在组件的顶部创建一个名为 `images` 的有状态数组。
```js
const [ images, setImages ] = useState([])
```



接下来我们有 `fetchNFTs`函数，你可以把它放在你的 mint 函数旁边：
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


这做了三件事：
1. 从合约中获取代币 ID
2. 获取每个带有 ID 的代币的 NFT 元数据
3. 如果我们使用 IPFS，则更新缩略图链接
4. 为每个 NFT 添加一个图像组件到图像数组中

这只是带有两个使用 FCL 的查询函数的 Javascript。 这里没有什么新鲜事！

我们现在需要做的就是渲染图像并调用 `fetchNFTs` 函数。 我刚刚将 fetch 调用放在另一个 useEffect 旁边的 useEffect 中：

```
  useEffect(() => {
    if (user && user.addr) {
      fetchNFTs();
    }
  }
  , [user]);
```



为了简单起见，我只是将图像添加到我的 mint 组件中：
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



你需要在注销时清除加载的图像，这样如果用户交换钱包，他们就看不到他们的旧 NFT：
```
  const logOut = () => {
    setImages([]);
    fcl.unauthenticate();
  };
```



最后，我添加了一些 gif 来让它更有趣！
```
  const RenderGif = () => {
    const gifUrl = user?.addr
        ? "https://media.giphy.com/media/VbnUQpnihPSIgIXuZv/giphy-downsized.gif"
        : "https://i.giphy.com/media/Y2ZUWLrTy63j9T6qrK/giphy.webp";
    return <img className="gif-image" src={gifUrl} height="300px" alt="Funny gif"/>;
  };
```



将它们放在一起，这是最终的`App.js`：
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



这就是它的样子！
![](https://hackmd.io/_uploads/rJ3GQD7qc.png)



### 🚨进度报告🚨
你千里迢迢来了！ 做得好！

在#progress 中发布您完成的应用程序的屏幕截图。