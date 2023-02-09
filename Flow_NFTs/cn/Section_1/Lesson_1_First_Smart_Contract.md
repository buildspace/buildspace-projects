让我们来编码吧。

我们将编写一个简单的智能合约，它将
- 创建一个新的资源
- 将其保存在帐户存储中

然后我们将编写一个事务来从存储中检索它。

我们走吧！

### 🎴 Flow游乐场
Flow 有一个很棒的开发环境，非常适合与 Cadence 一起玩。 前往 Flow 游乐场。

[在这里开始游乐场会议。](https://play.onflow.org/local-project)

这是一段介绍如何使用 Flow Playground 的小视频

[loom](https://www.loom.com/share/34b1c0f40c7a4a51bcf322ef33c27bec)

### 👋 早安世界
让我们在 Flow playgroud上说 gm！ 在帐户 0x01 上，添加此代码
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



这个合约包含两个非常简单的东西：一个字符串变量 `greeting` 和一个返回它的值的函数。

在 Cadence 中，您**需要**在 `init()` 函数中声明每个字段的起始值。 把它想象成一个构造函数。 您*可以*将字段留空。

这里要注意一件事——`let` 变量是**不**可变/可变的。 这意味着一旦合约发布，我们就无法更改 `greeting` 的值。

`hello()` 函数只返回合约变量 greeting。 `self` 指的是当前合约。 这里没有什么新鲜事。

playground 没有连接到实际的区块链，它只是在浏览器中运行的“本地”区块链。 您可以通过点击部署按钮将合约部署到浏览器区块链。 在屏幕底部，您应该会看到`Deployed Contract To: 0x01`日志。 不错！

来和它互动吧！

### 🎫 交易和脚本
Flow 具有非常独特的与区块链交互的方法。 您在 Cadence 中创建一个“交易”代码块，对其进行签名，然后将其发送到区块链以供运行。 将它们想象成迷你智能合约。

交易的美妙之处在于，您无需学习如何使用另一种语言（如 Ethers/web3js）的库来与您的智能合约进行交互。 你有更轻松的时间因为你可以写更多的 Cadence 哈哈。

脚本与交易相同，只是它们不会将任何数据写入区块链。 你可以运行它们而无需支付任何 gas 且无需签名。

交易用于从区块链读取**和**写入。 脚本用于仅从区块链中读取（有点像 SQL 查询），所以这 *可以* 用脚本完成，但你很快就会明白为什么我要进行交易！

阅读我们的问候语非常简单，这是交易的样子：

```js
import HelloWorld from 0x01

transaction {

  prepare(acct: AuthAccount) {}

  execute {
    log(HelloWorld.hello())
  }
}
```



首先，我们从部署到的地址导入 HelloWorld 合约。 在测试网上，这个地址看起来像`0x4aa1a46d5b95f4bb`。

接下来，在交易主体中，我们可以进行对整个交易可用的变量声明（就像合约或 JS 文件一样）。

交易有四个主要阶段，我们在这里看到其中两个阶段：
- `prepare`：这是您传递签名者的地方，也是您可以访问他们的东西的唯一地方。
- `execute`：这包含交易的主要逻辑。

在我们的交易中，我们在准备阶段不做任何事情，只记录 HelloWorld 合约中的 `hello()` 函数返回的值。

由于我们的合约只是读取一个公共变量，因此您选择签署哪个帐户并不重要。 只需选择任何一个，然后点击发送按钮。 您应该会在底部的“交易结果”部分看到您的问候打印出来。

无聊的？ 最激动人心的部分来啦！

### 😋 让我们的 gm 成为资源
现在我们要做一些特别的事情——让我们的 gm 成为“资源”。 单击帐户`0x02`并添加此合约：

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



这很酷。 当我们将某物作为资源时，我们必须遵循一些额外的规则。 要记住的主要事情是资源一次只能存在于一个地方。

什么是“地方”？ 在 Cadence 中，一个地方就是一个帐户。 如果您尝试创建新资源但不将其存储在帐户中，区块链将阻止您。 合同不会部署，交易将被还原。
```js
pub resource HelloAsset {
    pub fun hello(): String {
        return "gm, World!"
    }
}
```



这是我们对资源的定义。 它只包含一个函数，没有别的。

```js
let newHello <- create HelloAsset()
```



这是我们实际创建资源的地方。 Cadence 中的箭头 `<-` 表示您正在处理资源。 如果我们在这里停止我们的合同，它就不会部署，因为我们没有为它分配一个位置就让资源挂起。

```js
self.account.save(<-newHello, to: /storage/Hello)
```



`self` 指的是当前合约。 `account` 指的是部署合约的账户（您的账户）。 我们调用保存函数将`newHello`资源存储在我们帐户的自定义 `Hello` 域的 `/storage/` 路径中。 把它想象成计算机硬盘上的目录路径！

回顾：我们定义了一个资源，我们创建了它，然后我们将它存储在我们账户的存储中。

这三样东西有点类似于银行账户保险库。
1. 银行——一切都在*我们的合约*上发生，它在 Flow 账户中。 这是银行。
2. 银行账户所有者——这就是您——您的凭据是您用于签署部署交易的 Flow 账户。
3. 银行账户金库 - 这是*您在该银行金库中的存储*。

如果您尝试访问另一个合约上的 `/storage/Hello` 域，您将得到一个错误原因，就像试图查看另一家银行的金库一样。 那里什么都没有！

### 🏦 从存储中加载资源
现在我们的资源在存储中，下面是我们如何将其提取出来。

创建新交易：
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



您没有注意到的第一件事：我们这里没有执行块。 那是因为我们可以在准备块中做我们需要的一切。

```js
let helloResource <- acct.load<@HelloWorld.HelloAsset>(from: /storage/Hello)
```



我们在这条线上做了很多事情。 我们从 `acct` 开始，这是拥有资源的帐户。 我们调用 `load` 函数。 我们使用`<@HelloWorld.HelloAsset>`指定类型（这就是我们导入合约的原因）。 我们将位置传入`from: /storage/hello`。

该代码几乎只是*告诉*您它在做什么。 这就是我喜欢 Cadence 的原因，如果您理解语法，它会非常易于解释。

无论加载函数返回什么，都将被视为资源并分配给`helloResource`变量。

`log()` 就像 Javascript 中的`console.log`和 Python 中的 `print()` 。 这里奇怪的是 `?` 。 这用于指示[可选](https://docs.onflow.org/cadence/language/values-and-types/#optionals) 类型。 可选值是可以表示值不存在的值。 也就是说，它不是说一个值是未定义的，而是明确指出一个值丢失了。 如果布尔值可以为 true 或 false，则可选值可以不存在或具有值。 查看[这篇很棒的博客文章](https://joshuahannan.medium.com/optionals-in-cadence-not-optional-fb39bb4b0081#:~:text=you%E2%80%99re%20done%20reading.-,What%20are%20Optionals%3F,-Optionals%20in%20Cadence) 了解更多详情。

```js
acct.save(<-helloResource!, to: /storage/Hello)
```


最后，我们需要把资源放回去！ 请记住，如果我们将资源留在变量中，我们的交易将无法进行！ 保存的语法是一样的，你应该习惯了:)

在点击交易的“发送”之前，确保将交易签名者更改为 0x02：
![](https://hackmd.io/_uploads/H1g37dE99.png)



您可以通过单击方框中的 0x01 然后单击 0x02 来执行此操作。

我们需要更改签名者，因为合约部署在 0x02 上。 如果我们尝试从 0x01 访问存储在 0x02 上的资源，我们只会得到一个错误。

### 🚨 进度报告
**哇**。 那是很多。 干得好。

我想让你稍微玩一下这份合约。 存储其他变量并尝试使用不拥有该资源的帐户进行签名（这会出错）。 这就是你学习的方式！

一旦你破坏了某些东西，请在#progress 中发布错误消息。 东西总是坏的，并不是所有的东西都是彩虹和独角兽！