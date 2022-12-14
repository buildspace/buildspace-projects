我们的合约现已准备就绪！ 让我们在真实网络上试一试 :)

### 🔐 创建新的测试网账户
我们需要做的第一件事是创建一个新的 testnet 帐户。 这有两个部分，我们将首先使用 flow CLI，运行此命令：

```
flow keys generate
```


你应该得到这样的回应：
```
Desktop/Learn-flow/FlowNFTs$ flow keys generate
 If you want to create an account on testnet with the generated keys use this link:
https://testnet-faucet.onflow.org/?key=02febe07cd5cae683e...7b0ff6af0591


 Store private key safely and don't share with anyone!
Private Key      82349cd3f8a8b02d6132ac04deac657f34edb9c0e87b4377af7943c9e4ae20b8
Public Key       02febe07cd5cae683e...7b0ff6af0591
```



不错！ 您刚刚使用 CLI 创建了一个流密钥对！ 点击它打印出来的链接，解决验证码，然后点击“创建帐户”。

🚨 **保存位置！** 🚨

确保将帐户地址（来自网站）和生成的密钥保存在方便的地方！

我们将用这些来部署我们的合同。

您可能想知道为什么我们必须在创建公钥/私钥对后创建一个“帐户”。 卧槽？ “账户”不是由公钥/私钥组成的吗？？？

没有。 与比特币和以太坊不同，Flow 地址不是从加密公钥中派生出来的。 帐户和密钥是两个不同的东西。 拥有密钥对后，您需要运行一个链上函数来使用它们创建一个帐户。 网站就是这么做的。 它还给了我们 1,000 个 Flow 代币。 哇哦！

如果我们回到银行金库的例子：
- 保险库是区块链
- “帐户”是保险库内的一个盒子
- “地址”是箱子的编号
- “钥匙”用于解锁盒子

![](https://hackmd.io/_uploads/H1GjxwOY9.png)



此图像中的一个小错误是公钥（密钥上的文本）和帐户地址（保险库编号）不同。 此外，我们每个帐户可以拥有两个以上的密钥，哈哈

由于这种解耦，我们可以使用一个密钥控制多个帐户，并使用多个密钥控制一个帐户，有点像多重签名。

您可以在 [此处](https://docs.onflow.org/concepts/accounts-and-keys) 阅读更多相关信息。

### 🔑 将我们的密钥和帐户添加到我们的项目中
我们需要将这些密钥告知计算机上的 Flow 项目。 打开我们的“flow.json”文件并添加我们的密钥和帐户。

在底部的 `flow.json` 中，您应该会看到一个用于 `accounts` 的部分。 我们将在 `emulator-account` 的正下方添加我们的帐户，使我们的文件看起来像这样：

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



你在这里有两个东西 - `address` 和 `key`。 **将这些替换为您从 Flow testnet 水龙头网站和终端保存的那些。**

您现在拥有部署合约和与 Flow 测试网交互所需的一切！

### 🔥 部署我们的合约
快速回顾一下：我们安装了 Flow CLI，初始化了我们的 Flow 项目，并设置了我们的测试网帐户。 酷豆。 现在让我们设置我们要部署的合约。

在 `flow.json` 中，您应该看到一个合同部分，目前看起来像这样：
```
"contracts": {},
```


像这样添加我们的合同：
```json
"contracts": {
		"BottomShot": "./contracts/BottomShot.cdc"
	}
```



很简单，是吧？

接下来，向下滚动到文件底部的 `"deployments": {}` 并添加以下内容：
```json
"deployments": {
	"testnet": {
		"testnet-account": [
			"BottomShot"
		]
	}
}
```


这就是我们如何告诉我们的 Flow CLI *我们想要部署什么*，我们想用哪个帐户部署它，以及我们选择的网络。 如果我们有另一个要部署在测试网上的合约，我们只需将其添加到“BottomShot”值下方，它就会按顺序部署它们。

最后一部分是在我们的合同中更改导入地址。 将第一行更改为：
```
import NonFungibleToken from 0x631e88ae7f1d7c20;
```



这是在 [Flow testnet](https://docs.onflow.org/core-contracts/non-fungible-token/) 上部署合约的地址。 由于 Flow 团队已经部署了它，我们不需要重新部署它。

现在是神奇的时刻，在终端中输入此命令进行部署：
```
flow project deploy --network testnet
```


如果一切顺利，您应该会看到以下响应：
```
Deploying 1 contracts for accounts: testnet-account

BottomShot -> 0x7b6adb682517f137 (bd892198518206e8fed6f7d7bba520b94bc9036ff5cefc856eef242c114756ec)
```

![](https://hackmd.io/_uploads/rJBkipW5q.png)




BOOM！ 您刚刚在 Flow 测试网上部署了您的第一个合约！！！

你可以在 https://flow-view-source.com/testnet/ 上看到你部署的所有合约

输入你的账户地址，你会看到你的 NFT 合约！

![](https://hackmd.io/_uploads/Syk7DTbq9.png)



**快速回顾**在这个部分：
1. 我们创建了 Flow keys 和一个 testnet 帐户
2. 我们用我们的密钥和合约配置了我们的环境
3. 我们将合约部署到真实网络！

做得很好！ 接下来我们将制作一个应用程序，让*任何人*从这个合约中铸造 NFTs :D

### 🚨进度报告🚨
您好，Flow 智能合约部署器。

在 #progress 部分的 flow-view-source 上发布已部署合约的 URL。