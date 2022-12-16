我们的应用程序正在形成。 您可以铸造一款精美的不朽猫 NFT，任何人都无法从您手中夺走。 但它可以有更多的东西：它可以展示我们的 NFT。

为此，我们需要*查看* NFT 拥有的媒体。 我们怎么知道如何做到这一点？

我们会查看合约，看到它有一个`thumbnail`字段，并找出哪些可访问的函数为我们提供了`thumbnail`值。 但是，如果 OpenSea 认为我们真的很酷并决定将我们列入名单怎么办？ 他们必须做同样的事情！ 想象一下 OpenSea 的工作量有多大。

这类似于我们在第一份合同中遇到的问题。 它没有遵循标准，所以没有人可以*确定*这是一份 NFT 合约。

我们当前的合约不遵循任何**元数据**标准，因此任何人都无法轻松了解我们的 NFT 拥有何种类型的媒体以及您如何访问它。

解决方案？ 另一个界面！ MetadataViews 标准允许所有 NFT 项目使用一种通用语言。

回到你的合同文件，我们将实施这个标准！

由于变化不大，我将合同放在 Gist 中，从 [此处](https://gist.github.com/AlmostEfficient/28d2fa6bdf8c920cbbc03f1b9f770b5f) 获取。

### 🔍 视图
该标准中的重要补充是视图。 简单来说，视图是描述如何查看 NFT。 基本视图是名称、描述和缩略图。

以下是添加的两个主要功能：
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



第一个函数 - `getViews` - 返回一个 Type 数组。 这告诉我们 NFT 可以被视为的所有类型。

粗略的比喻就是把 NFT 想成风景。 每个视图都是一个观察风景的窗口，显示它的不同部分。

![](https://hackmd.io/_uploads/By0HwZM9q.jpg)



您的合约可以有任意多个视图，每个视图都显示 NFT 的一个独特部分。

`resolveView` 函数接受一个视图类型并且可以返回*任何东西*。 它将视图扔进一个开关。 此开关是您添加新视图分辨率的地方。

view之前的`resolveView`函数定义中的`_`是一个[特殊参数标签](https://docs.onflow.org/cadence/language/functions/#:~:text=parameter%20name.%20The-,special%20argument%20label,-_%20indicates%20that) 表示函数调用可以省略参数标签。

这意味着调用函数时不必包含标签。
```
contract.function{
  label: value,
  name: "CatMoji"
}
```



最后，我们有一个`viewResolver` 的借用函数：
```
pub fun borrowViewResolver(id: UInt64): &AnyResource{MetadataViews.Resolver} {
  let nft = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
  let CatMoji = nft as! &CatMoji.NFT
  return CatMoji as &AnyResource{MetadataViews.Resolver}
}
```


这让任何人都可以传入一个 ID 并获得对解析器的引用，这样他们就可以获取该 NFT 的元数据 :)

查看元数据提案 [此处](https://forum.onflow.org/t/introducing-nft-metadata-on-flow/2798) 和整个标准 [此处](https://github.com/onflow /flow/blob/master/flips/20210916-nft-metadata.md）。

就是这样！ 您的合约现在已具备超能力，符合所有要求并准备好进行最终部署！

### 🚀 部署我们的最终合约
您会注意到该合同的名称不同。 我们还使用不同的存储路径。

这是因为我们**不**要升级我们的旧合同。 我们将把这个最终合约作为一个新合约来部署。

部署的步骤是一样的，下面是一个快速回顾：
1. 创建一个新的合约文件。 我正在命名我的`CatMoji.cdc`——我收藏的实际名称
2. 从 Gist 添加合约（确保你更新了合约中的集合名称！！！）
3.在flow.json的`contracts`中添加文件
4.替换`deployments`中的合约名称
5.使用`flow project deploy --network testnet`命令进行部署

这是我最终的 flow.json 的样子：
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



现在，如果您转到 [Flow View Source](https://flow-view-source.com/testnet/)，您将同时看到您的旧合约和新合约！

![](https://hackmd.io/_uploads/ryncaNQ5c.png)



如果你想稍后更新这个合约，你可以使用相同的命令，但有一个额外的标志：
```
flow project deploy --network testnet --update
```



这将使用相同的地址和名称更新您的合同🤠

现在已经完成了，我们可以使用漂亮的新视图了！

### 🚨进度报告🚨
哇。 不是一个，而是两个部署到测试网的合约？ 你现在可能是前 10% 的 Cadence 开发者😎

再次在#progress 的 flow-view-source 上发布已部署合约的 URL。 这将向人们展示所有其他的合约。 也许有人可以从您所做的所有花哨的事情中学到东西！