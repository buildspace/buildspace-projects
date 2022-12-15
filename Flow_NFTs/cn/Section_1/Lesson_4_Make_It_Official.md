### 🤑 创建并上传我们的 NFT 资产
这段时间我们一直在写代码。 让我们换一换并提出 NFT 创意！

在这里您可以决定您的 NFT 收藏实际上是关于什么的。 是关于你最喜欢的动漫角色吗？ 也许一些很酷的电影海报？ 您也可以第 n 次将猫放在区块链上。 这正是我要做的😹

**现在，是时候发挥你的创意了。 为你的收藏想出五个随机的 NFT**。你的 NFT 可以是视频、图像，甚至是 mp3 文件！ 我将使用 .png 格式的普通旧图像。

创建一个名为“assets”的文件夹，并将您的文件添加到其中。 确保它们从 0 到 5（或更多）按顺序命名。 我们将把这些存储在 [IPFS](https://en.wikipedia.org/wiki/InterPlanetary_File_System?utm_source=buildspace.so&utm_medium=buildspace_project) 上，它本质上是一个分布式文件系统。 今天 — 您可能会使用 S3、GCP 存储或 Dropbox 之类的东西。 但是，在这种情况下，我们可以简单地信任由正在使用该网络的陌生人运行的 IPFS。 尽可能快速阅读 [这里](https://decrypt.co/resources/how-to-use-ipfs-the-backbone-of-web3?utm_source=buildspace.so&utm_medium=buildspace_project)！ 涵盖了很多很好的基础知识 :)。

我们将使用一种名为 [NFT.Storage](https://nft.storage/) 的免费服务将我们的资产上传到 IPFS。 创建一个帐户并登录。我们将使用他们的 NFTUp 桌面应用程序上传文件。 设置大约需要 60 秒，只需[按照此处的说明](https://nft.storage/docs/how-to/nftup/)。

拖放您的文件或点击上传按钮并选择它们。
![](https://hackmd.io/_uploads/r1dkjF-cc.png)

它会给你三样东西——CID（内容 ID）、IPFS URL 和网关 URL。 IPFS URL 是我们将在合同中使用的。
![](https://hackmd.io/_uploads/HJ88YtWq5.png)

您可以点击网关 URL 在浏览器中查看您的 NFT。 这里最酷的部分是它的行为就像一个包含您资产的云存储驱动器。 您只需替换末尾的文件名，即可使用相同的链接访问所有文件。

![](https://hackmd.io/_uploads/SJhzaYZcc.png)

我们的资产已准备就绪！ 这些资产是永久性的——它们永远不会下降或改变，所以你可以确定你的 NFT 将在*任何情况下存活！*

**注意**

您*可以*在常规互联网上使用来自 Imgur 等网站的图像，但这些链接可能会中断，因此不推荐用于 NFT。

如果您决定使用自己的图片，请确保 URL 直接指向实际图片，而不是托管图片的网站！ 例如，直接的 Imgur 链接看起来像这样 - `https://i.imgur.com/123123.png` 而不是 `https://imgur.com/gallery/123123`。 最简单的判断方法是检查 URL 是否以图像扩展名（如 .png 或 .jpg）结尾。 您可以右键单击 imgur 图片并“复制图片地址”。 这将为您提供正确的 URL。

我们的合约现在还不错。 我们可以将其部署到测试网，这已经足够好了。 但现在只是另一份合约。 它里面没有任何东西可以告诉在 Flow 上运行的所有应用程序它是一个 NFT 合约。

如果 OpenSea 决定 BottomShot 是下一件大事，并且他们想要列出 NFT，他们将不得不检查合同并查看所有功能并围绕它构建。 这有点蹩脚，我们应该遵循与其他项目相同的标准！ 我们的合约没有明确声明它符合任何 NFT 标准。 我们来解决这个问题！

### 🎟 非同质代币标准
Flow 生态系统有一个每个人都同意的 NFT 标准。 Flow 团队将其部署在 [testnet 和 mainnet](https://docs.onflow.org/core-contracts/non-fungible-token/) 上，因此当您到达这些网络时，您只需从 现有地址。 现在，我们将自己部署在我们的模拟器上。

我们将为 Nonfungible 代币导入一个*接口*，该代币实施 Flow 上所有 NFT 的标准。 如果你来自以太坊，这就像 Flow 的 ERC721。

前往 [此处](https://github.com/onflow/flow-nft/blob/master/contracts/NonFungibleToken.cdc) 获取代码。 在您的合同文件夹中创建一个名为`NonFungibleToken.cdc`的新文件并添加代码。

复制完成后，单击 NonFungibleToken.cdc 文件顶部的“部署”按钮。 这会将此合约接口部署到默认服务帐户 - `0xf8d6e0586b0a20c7`

回到你的合同文件，这样你就可以在顶部导入它并添加一些其他的变化：
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



如果 Cadence 扩展向你尖叫，只需从命令选项板 (`CMD`/`CTRL`+`SHIFT`+`P`) 重启服务器：

![](https://hackmd.io/_uploads/rkDOcnOYq.png)



哇。 这看起来像很多代码。 别担心，大部分你都知道！ 此外，Cadence 使新部件变得非常简单。 让我们逐行分解。
```
import NonFungibleToken from 0xf8d6e0586b0a20c7;

pub contract BottomShot: NonFungibleToken {
```

如前所述，我们正在从其部署到的帐户中导入 NonFungibleToken 接口。 我们在声明我们的合约时使用它，告诉编译器我们的合约满足接口的要求。

接口是什么？ 它是一种抽象类型，用于定义实现它的事物的行为。 还迷茫吗？ 我也是 哈哈

您可以将接口想象成一组规则或描述。 想象一下轿车的界面：4 扇门、一个封闭的车身（没有敞开的车顶）以及一个供驾驶员和乘客使用的独立部分。 如果我给你看一辆没有车顶的豪华 2 门 BMW，你会告诉我那不是轿车！ 同样，合约接口帮助我们定义和设置标准。 如果我声明我的合约符合 NFT 接口，但我没有实现所有要求，它就不会运行。

```
  pub var totalSupply: UInt64

  pub event ContractInitialized()
  pub event Withdraw(id: UInt64, from: Address?)
  pub event Deposit(id: UInt64, to: Address?)
  
  pub let CollectionStoragePath: StoragePath
  pub let CollectionPublicPath: PublicPath
```


接下来我们得到了一堆新变量。 我们已经知道 `totalSupply`。

`event` 类型是新的——它基本上是区块链上的一个 webhook。 我们可以在某些地方触发/发出这些事件以指示发生了某些事情。 我们传入的参数也被发出，使得在该合约中跟踪 NFT 转移变得容易。 最后两个只是我们存储我们的 NFT 集合的存储路径。 将它们存储在合约中意味着脚本和交易不必一遍又一遍地硬编码它们。

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



我们的 NFT 资源已经进化！ 它现在有一个名称、一个描述和一个缩略图。 这些是为了适应新的界面——NFT 现在实现了 NonFungibleToken 标准中的 `INFT`。 所有这些值都是在创建时设置的，它们都是 `let`，这意味着您不能更改它们的名称、ID 或缩略图！

```
  pub resource interface BottomShotCollectionPublic {
    pub fun deposit(token: @NonFungibleToken.NFT)
    pub fun getIDs(): [UInt64]
    pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
  }
```



我们方便的公共收藏界面也增加了一些额外的功能。 由于我们将`deposit`公开，因此任何人都可以将 NFT 添加到该集合中。 如果你不喜欢垃圾邮件，你可以删除 `deposit`！ 我会保留它，因为谁知道我可能会空投什么 哈哈

我们也公开了一个“借用”功能。 这是来自界面，当我们到达它时我们会讨论这个。
```
pub resource Collection: BottomShotCollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic {
```


我们的主要收藏资源发生了很大变化。 首先，我们从 NonFungibleToken 标准中实现了几个接口。 你可以跳转到合同文件看看这些是什么。

接下来我们有了新的存款功能：
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


这里我们有两个新事物：使用 `as!` 进行类型转换（转换类型）并明确销毁旧的 NFT。 为什么这是必要的？ 因为 Cadence 不知道 `ownedNFTs[id]` 会是空的。 所以我们从该索引中获取资源（即使它不存在），然后将新的资源移入。

我们的 `withdraw` 函数非常相似，它只有一个事件并使用新类型。 `getIDs` 是相同的。

最后，我们看到了一些新东西：
```
    pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
      return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
    }
```



顾名思义，此功能允许任何人从收藏中借用 NFT。 使用它，我们可以在不将其从存储中删除的情况下获取对存储中对象的引用。 这意味着我们可以轻松访问资源拥有的所有公共数据，例如描述和缩略图！

语法分解：
- `pub fun borrowNFT(id: UInt64)`：一个名为 borrowNFT 的公共函数，它接收一个 `UInt64` 类型的参数“id”
- `&NonFungibleToken.NFT`：返回类型为`NonFungibleToken.NFT` 的 *reference*
- `&self.ownedNFTs[id]`：获取对存储在 ownedNFTs [id] 索引处的资源的引用
- `as &NonFungibleToken.NFT?`: 转换类型
- `!`: [Force Unwrap](https://docs.onflow.org/cadence/language/values-and-types/#force-unwrap-) 在返回之前 () 中的值

最后，我们有了新的 mint 函数：
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



这非常简单。 您要注意的主要内容是`thumbnail`字段。 它存储我们 NFT 的媒体位置。 这可以是普通的 HTTP 链接或 IPFS 哈希。

现在**这**是一个值得部署的合约！

### 👀 在本地铸造一个 NFT
让我们进行快速交易以检查我们的 mint 函数是否正常工作。 在您的交易文件夹中创建一个`mintNFT.cdc`文件并添加：
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


这是一笔更重的交易，请仔细阅读评论！ 它做了两件事：必要时创建一个空集合*和*它铸造 NFT。 您应该熟悉此处的大部分语法。 如果有什么让您感到困惑，只需在 Discord 上的#section-1-help 中标记@Raza，我会来救您的：太阳镜：

我们将无法使用扩展程序运行它。 在您的终端中输入（确保更新参数！）：
```
flow transactions send ./transactions/mintNFT.cdc "0xf8d6e0586b0a20c7" "CatMoji #1" "Cat emojis on the blockchain" "ipfs://bafybeigmeykxsur4ya2p3nw6r7hz2kp3r2clhvzwiqaashhz5efhewkkgu/0.png"
```



在这里，我创建了一个名为“CatMoji #1”的 NFT，并将缩略图设置为 IPFS 哈希。 如果您不使用 IPFS，您可以将其替换为您的常规互联网链接，例如 `https://i.imgur.com/123123.png`。

语法是
```
flow transactions send <code filename> [<argument> <argument>...] [flags]
```



您会看到打印出的确认信息：
![](https://hackmd.io/_uploads/HyZUZsZ5c.png)



**我们正在做。**我们正在 Flow 上制作 NFT！ 接下来让我们离开本地主机！

### 🚨进度报告🚨
我们正处于最后阶段。

在 NFT.storage 上将您上传的 NFT 资产截图发布到 IPFS！