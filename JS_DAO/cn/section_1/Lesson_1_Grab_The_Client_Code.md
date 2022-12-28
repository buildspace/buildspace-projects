### 💎 我们要做什么

我们将为人们构建一个网页 dapp：**连接他们的钱包 → 铸造会员 NFT → 接收Token空投 → 并对提案进行投票。** 我将这个网页 dapp称为我们的“DAO 仪表板”。 这是我们的新成员可以加入的地方，它允许现有成员看到 DAO 在做什么。

### 🤯 Replit！

我们将使用这个叫做 [Replit](https://replit.com/~) 的软件！ 它是一个基于浏览器的 IDE，让我们可以轻松地构建 Web 应用程序并从浏览器部署它们。 这是超级正规的软件，无需我们设置完整的本地环境或编写命令进行部署，我们可以直接开始。

在开始之前先在 Replit 上注册一个帐户。

我已经创建了一个基本的 React 项目，您可以在 Replit 上**fork**。 **只需转到[此处](https://replit.com/@thirdweb/buildspace-dao-starter-v3)，在右侧附近您会看到“Fork”按钮。** 请确保您已登录，然后单击此按钮。

您将在浏览器中神奇地克隆我的存储库和完整的 IDE 以使用代码。 一旦它停止加载并向您显示一些代码。 单击顶部的“运行”，祝您一切顺利。

以下是我在过去的项目中制作的介绍 Replit 的视频：
[LOOM](https://www.loom.com/share/8e8f47eacf6d448eb5d25b6908021035)

### 👩‍💻 想在本地构建？ 获取代码

如果您不想使用 Replit，也行。

首先前往 [此处](https://github.com/buildspace/buildspace-dao-starter)，您可以在其中找到仓库代码。 从这里开始，您需要确保按下页面右上角的“Fork”按钮：

![](https://i.imgur.com/OnOIO2A.png)

当你 fork 这个 repo 时，你实际上是在创建一个完全相同的副本，它存储在你的 Github 配置文件下。现在你有了自己的代码版本，可以随心所欲地进行编辑。

这里的最后一步是在您的本地机器上获取您新 fork 的存储库， 单击“代码”按钮并复制该链接！

前往您的终端，然后输入 `cd` 进入您的项目所在的目录。例如，我喜欢将我的项目克隆到我的 `Developer` 文件夹中。 这取决于你喜欢怎样设置！ 找到位置后，只需运行以下命令克隆存储库：

```plaintext
git clone YOUR_FORKED_LINK
cd buildspace-dao-starter
```

就是这样!然后继续运行:
```plaintext
npm install
```

然后：
```plaintext
npm start
```

### 🦊 获取 Metamask

接下来我们需要一个 Ethereum 钱包。 这样的钱包有很多，但是对于这个项目，我们将使用 Metamask。 在[此处](https://metamask.io/download.html)下载浏览器扩展程序并设置您的钱包。 即使您已经有其他钱包供应商，现在也只需使用 Metamask。

但为什么我们需要 Metamask？

好问题。 因为我们需要调用区块链上的智能合约的函数。 而且，要做到这一点，我们需要有一个钱包，里面有我们的 Ethereum 地址和私钥。

这几乎就像身份验证。 我们需要一些东西来“登录”到区块链，然后使用这些登录凭证从我们的网站发出 API 请求。

因此，为了让我们的网站与区块链对话，我们需要以某种方式将我们的钱包连接到它。 一旦我们将钱包连接到我们的网站，我们的网站将有权代表我们调用智能合约。 **请记住，这就像在网站中进行身份验证一样。**

所以，继续设置吧！ 他们的设置流程是非常简单的。

设置好钱包后，请务必将网络切换到“**Goerli**”，这是我们将要使用的测试网络。

![](https://i.imgur.com/bw6YUMV.png)

### 🤑 获取一些 ETH测试币

Ethereum 有许多的测试网，我们将使用 “Goerli” 测试网，它是由以太坊基金会运行的。

为了部署到 Goerli，我们需要假的 GoerliETH。 为什么？ 因为如果你要部署到真正的 Ethereum 主网上，你得用到 ETH！ 因此，测试网复制了主网的工作方式，唯一的区别是不涉及真 $eth。

为了获得 GoerliETH，我们必须在往上索取一些。 **这个 GoerliETH 只能在这个特定的测试网上工作。** 你可以通过水龙头为 Goerli 获取一些 GoerliETH。 只需要找到一个有效的，哈哈。

对于 MyCrypto，您需要连接您的钱包，创建一个帐户，然后再次单击相同的链接以请求资金。 对于Goerli 官方水龙头，登录Alchemy账户，应该可以获得2倍的奖励。

您有几个水龙头可供选择：
| 名称            | 网址                                  | 数量          | 限时         |
| ---------------- | ------------------------------------- | --------------- | ------------ |
| MyCrypto         | https://app.mycrypto.com/faucet       | 0.01            | None         |
| Official Goerli  | https://goerlifaucet.com/             | 0.25            | 24 Hours     |
| Chainlink        | https://faucets.chain.link/goerli     | 0.1             | None         |

您可以在 [此处](https://metamask.zendesk.com/hc/en-us/articles/360015289512-How-to-copy-your-MetaMask-account-public-address-) 找到您的公共地址。

一旦你的交易被开采，你的钱包里就会有一些 GoerliETH。

![无标题](https://i.imgur.com/7yyYaDx.png)

### 🚨 进度报告

*请一定记得报告，否则 Farza 会伤心的💔 :(*

在 `#progress` 频道上传您的 Metamask 屏幕截图，并显示您在 Goerli 上的余额，就像我上面的那样。





