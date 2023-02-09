你已经了解了 Flow 是什么。 您熟悉 Cadence 并了解什么是资源。 您的环境已准备好让您离开本地主机。

### 👁 一个真正的 NFT 合约
是时候制定一个合适的 NFT 合约了。 正如你所注意到的，我们当前的 NFT 合约只是制作空白的 NFT。 也没有铸造功能，所以没有其他人可以获得 NFT 哈哈

这是具有以下基本功能的 NFT 合约：
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



不要不知所措！ 这就是您意识到 Cadence 是多么**简单**的时刻。

我留下了很多注释。 **阅读它们。** 然后确保您阅读了代码，上面几乎都有注释！

对于没法理解的部分，不用怕，你有我 <3

从顶部开始：
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



我们的 NFT 资源定义略有不同：在这里我们只需要 NFT ID。 请记住，每次创建资源时都会运行 init 函数。 在其中，我们为创建的 NFT 设置 ID 并更新全局计数器。 这保证了每个 NFT 都有一个唯一的 ID，因此我们可以使用它们进行识别！

在此之后，您将拥有一个`Collection`资源。 回想一下你小时候的情景。 你有口袋妖怪卡片收藏吗？ 也许你收集过弹珠、硬币或邮票？ 或者，也许我是婴儿潮一代（*指二战结束后，1946年初至1964年底出生的人*），现在孩子们都在收集 Fortnite 皮肤。 无论您收集什么，您可能都将它们*放在同一个地方*（或同一个 Fortnite 帐户，哈哈）。 这使得跟踪它们变得更加容易。

我们在 Cadence 中做同样的事情。 集合是拥有我们所有 NFT 的资源。 这使得存储 + 检索它们变得非常容易。 每个想要铸造 NFT 的账户都必须先进行收藏。

我们在集合资源中看到的新语法：

```ts
pub var ownedNFTs: @{UInt64: NFT}
```


[字典](https://docs.onflow.org/cadence/tutorial/04-non-fungible-tokens/#dictionaries)：这些就像映射一样！

```ts
self.ownedNFTs[token.id] <-! token
```

[强制赋值运算符](https://docs.onflow.org/cadence/language/values-and-types/#force-assignment-operator--)：如果变量为 nil，则将资源分配给变量。 如果变量不为 nil，则执行中止，哈哈

### 🏃‍♂️ 运行我们的合约并与之交互
从现在开始，我们将使用该扩展在本地部署我们的合约。 如果需要，您可以使用 [CLI 命令](https://docs.onflow.org/flow-cli/account-update-contract/)，但我会坚持使用扩展程序以保持一致。

只需点击文件顶部的“部署合同”链接/按钮：
![](https://hackmd.io/_uploads/S12BICKtq.png)



为了与我们的合约进行交互，我们将编写一个交易。 在项目的根目录下创建一个 `transactions` 文件夹，并添加一个名为 `createCollection.cdc` 的文件：
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


此交易调用`createCollection`函数并将其存储在我们合约的 `BottomShot`域中。

同样，要运行它，只需单击文件顶部的提示，对于它显示为“发送由 ServiceAccount 签名”的事务

![](https://hackmd.io/_uploads/Bkou8JcFq.png)



ServiceAccount 是您在模拟器上登录时使用的默认帐户。 您将看到在运行模拟器的终端中打印的日志：
![](https://hackmd.io/_uploads/SyXM4k5Fc.png)


不错！ 我们刚刚在本地运行了一个交易，并在模拟器上与我们的合约进行了交互！

让我们铸造一个 NFT 并将其添加到这个收藏中！ 在你的交易文件夹中创建另一个名为`depositNFT.cdc`的文件：
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



在这里我们看到了一些新东西：`borrow`。

还记得我说过资源在同一时间只能存在于一个地方吗？ 这也意味着您无法运行函数或访问这些资源中的内容。

所以在这个交易中，我们从它存储的地方（`/storage/BottomShot`）借用集合资源。 这为我们提供了对资源的临时*引用*（如果我们被允许访问它），以便我们可以对其进行更改。 一旦事务结束，资源将自动归还。

我们使用引用来调用`deposit`函数，并传入 mint 函数返回的 NFT 资源。

`?` 表示它之前的值是一个 [optional](https://docs.onflow.org/cadence/language/values-and-types/#optionals) - 它可以有一个值，也可以 是 `nil`，没有任何意义。 `??` 用于双重可选，这意味着它可以有一个可选的值，也可以是 `nil`。 如果借用函数没有返回任何内容，我们会 [`panic`](https://docs.onflow.org/cadence/language/built-in-functions/#panic)，这将终止事务并出现错误。

LETSSS GOOOOO WE'RE BALLIN 我们的帐户有一个收藏品 ** 和 ** 里面有一个 NFT！！！

### 😯 功能和脚本
我们的合同现在有一个大问题。 别人没有办法从合约存储中查到我拥有哪些 NFT。 这是因为 `getIDs` 函数在 Collection 资源中*内部*并且只能由我的帐户访问。 这意味着您必须将您的 NFT 赠送给某人，让他们看到它是什么。 哎呀。

回到你的合同，我们将添加一个接口来解决这个问题。 在第 16 行添加 `CollectionPublic` 资源，就在您声明 NFT 资源的位置之后：

```swift=16

  // This interface exposes only the getIDs function
  pub resource interface CollectionPublic {
    pub fun getIDs(): [UInt64]
  }
  
  // Update the Collection resource declaration to implement the new interface
  pub resource Collection: CollectionPublic {
    // The rest of your contract REMAINS THE SAME
```



看起来有点奇怪，不是吗？ 为我们已经拥有的功能添加这个接口如何解决任何问题？ 啊哈！ 你掉进了我的圈套。 通过让你做一些看似无用的事情，我已经让你投入到接下来的事情中。

Cadence 有这个名字很长的东西“[基于能力的访问控制](https://docs.onflow.org/cadence/language/capability-based-access-control/)”。 它让我们做的是创建一个**能力**，使特定用户能够访问存储对象的某些字段或功能。

可以把它想象成一把钥匙，可以解锁您保险箱的特定部分。 您可以将此密钥放在某处（例如，在您的门垫下），任何知道该密钥的人都可以访问该对象。 他们可以拿钥匙然后打开保险箱。

**注意**
确保你记得在这里重新部署你的合约！ 您可以通过单击文件顶部的“部署”来完成此操作。

现在我们有了一个接口，它公开了我们希望人们拥有的唯一功能，我们将为每个人提供*能力*来调用此功能。

打开您的 `createCollection.cdc` 事务并将其更新为：
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



我在这里做了两处改动。

首先：我更改了我们存储集合的路径 (/storage/BottomShot2)。 这是因为您无法覆盖 Flow 上的存储（想象一下不小心覆盖了 CryptoPunk 💀），并且如果您自上次收集后没有关闭您的模拟器，那么将采用该路径。

这里最大的变化是 `link` 函数调用。 该集合存在于 `/storage/` 域中。 我们将它链接到 `/public/` 域。 提醒：/storage 只能由帐户所有者访问。 /public 任何人都可以访问。

语法分解：
- `acct.link`：我们正在使用的帐户和我们正在调用的功能
- `<&BottomShot.Collection{BottomShot.CollectionPublic}>`：这是我们的 `link` 函数所期望的类型 - 对 BottomShot 合约集合上 CollectionPublic 资源的引用 (&)
- `(/public/BottomShot2, target: /storage/BottomShot2)`：我们链接的两条路径

换句话说：
```
account.function<&Contract.Resource{Contract.Interface}>(destinationPath, sourcePath)
```



单击交易文件顶部的“发送签名”以运行它。 使用新路径（“BottomShot2”）更新`depositNFT.cdc`交易并运行它。

我们现在有一个新的合约，一个新的集合，一个新的 NFT。 让我们写一个脚本来读取它们！

创建一个名为 `scripts` 的文件夹并添加一个名为 `getIDs.cdc` 的文件：
```
import BottomShot from 0xf8d6e0586b0a20c7

pub fun main(acct: Address): [UInt64] {
  let publicRef = getAccount(acct).getCapability(/public/BottomShot2)
            .borrow<&BottomShot.Collection{BottomShot.CollectionPublic}>()
            ?? panic ("Oof ouch owie this account doesn't have a collection there")

  return publicRef.getIDs()
}
```



脚本与事务有点不同。 因为他们不需要签名者，所以我们传入一个地址（而不是帐户）作为参数。 我们使用该地址获取帐户，然后调用`getCapability` 函数来访问我们之前链接的资源。 简单来说，我们正在访问一个帐户的公共存储及其地址以调用其上的函数。

`borrow` 函数尝试访问 `CollectionPublic` 资源，因此我们可以调用它的函数。 我们以恐慌结束，以防万一出现问题 :)

一旦我们有了对公共资源的引用，我们只需点击 `getIDs()` 函数。

要运行这个，回到你的终端（保持模拟器运行）并运行这个命令：
```
# In the FlowNFTs folder
flow scripts execute scripts/getIDs.cdc f8d6e0586b0a20c7
```



这将打印出一组 NFT ID！ 如果您只运行一次`depositNFT`交易，您只会看到`Result: [1]`。 多跑几次！ 这是我在两次运行后看到的：

![](https://hackmd.io/_uploads/BJcKPfqF5.png)



### 🚨 进度报告
你刚刚做了很多事情。 拍拍自己的背。 这是困难的事情，你正在解决它！

在#progress 中发布带有 ID 的脚本输出屏幕截图，向所有人展示您的进展情况。