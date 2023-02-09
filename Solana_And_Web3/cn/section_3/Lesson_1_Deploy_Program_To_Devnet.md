我们现在几乎有了一个最基本的API，对吗？

我们可以上载数据，也可以获取数据。

让我们将网页前端与程序连接起来！我们需要做的是部署到 devnet，这是一个由 Solana运营的花费 SOL 测试币的区块链网络。

从技术上讲，我们可以使用 solana-test-validator 在本地部署我们的程序，并使用本地程序构建我们的 web 应用程序，但在 Builsdspace 我们希望尽快投入生产 。 当我们可以部署到真正的区块链时，为什么还要在本地部署？ 呵呵。

此外，我认为一旦我们将 Solana 程序部署到 devnet 后，构建 Web 应用程序会变得更容易！ 我们开工吧。

*注意：确保 solana-test-validator 没有在任何地方运行。*

### 🌳 为 devnet 搭建环境

部署到 devnet 实际上非常棘手。 跟上我，确保不错过任何步骤 :)。

首先，切换到 devnet：

```bash
solana config set --url devnet
```

接下来，运行：

```bash
solana config get
```

你会看到你现在指向的是 [`https://api.devnet.solana.com`](https://api.devnet.solana.com/)， 这是告诉 Anchor 要部署到哪里！

从这里开始，我们需要在 devnet 获取一些 SOL。 其实很简单，我们只需要运行两次：

```bash
solana airdrop 2
```

然后，运行：

```bash
solana balance
```

现在，你应该会在你的钱包里看到 4 个 SOL 测试币！ 上一步的命令实际上是在 devnet 上检索您的钱包余额！

*注意：有时你会收到类似 `insufficient funds` 之类的错误消息——每当发生这种情况时，只需像上面那样获取 `2` 个 SOL。 注意：`2` 是您现在一次可以获取最大值。 因此，您需要时不时地更新您的钱包。*

### ✨ 修改几处变量

现在，我们需要修改 Anchor.toml 中的一些变量。 这个地方有点棘手。

在 `Anchor.toml` 中，将 `[programs.localnet]` 更改为 `[programs.devnet]`。

然后，将 `cluster = "localnet"` 更改为 `cluster = "devnet"`。

现在，运行：

```bash
anchor build
```
这将为我们创建一个新的 Program ID 。 我们可以通过运行以下命令来访问它：

```bash
solana address -k target/deploy/myepicproject-keypair.json
```

这将输出你的 program id，复制它。我们待会再详细讨论。

现在转到 `lib.rs` 文件，你将在顶部看到你的 program id。
```bash
declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");
```

SO…这是什么? 当我第一次研究的时候，也是感到很困惑 lol。

基本上，它是一个最初由 `anchor init` 生成的并指定给程序的id。

这很重要，因为程序的id指定了如何加载和执行程序，并包含有关 Solana 运行时应该如何执行程序的信息。

program id 还可以帮助 Solana 运行时查看程序本身创建的所有帐户——所以，还记得我们的程序如何创建“帐户”来保存与程序相关的数据吗？ 那么，有了这个 ID，Solana 就可以快速查看程序生成的所有帐户并轻松引用它们。

因此，**我们需要将 `declare_id!` 中的这个 id** 更改为 `solana address -k target/deploy/myepicproject-keypair.json` 输出的那个。 为什么？ 好吧，`anchor init` 给我们生成只是一个占位符， 现在我们将拥有一个可以实际部署的程序 ID！

*注意：每个人的 program id都会不一样！ 它由 Anchor 生成。*

现在，转到 `Anchor.toml` 并在 `[programs.devnet]` 下，您会看到类似 `myepicproject = "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"` 的内容。 继续并将此 id 更改为运行 `solana address -k target/deploy/myepicproject-keypair.json` 输出的 id。

太好了，所以您在两个地方更改了您的 program id！

最后，一旦你完成了以上所有这些，我们需要再次运行build命令:

```bash
anchor build
```

为什么？ 因为我们想用新的新 program id 构建项目！ Anchor 在 `target` 目录下构建时生成某些文件，我们希望确保这些生成的文件具有最新的 program id。

**以上包含了很多的步骤，很容易搞砸。一旦搞错，将得到一个随机的、令人困惑的错误信息。 总结下上面的步骤吧：**

```
solana config set --url devnet

// 确认你是在 devnet.
solana config get

anchor build

// 获取最新的 program id.
solana address -k target/deploy/myepicproject-keypair.json

// 更新 Anchor.toml 和 lib.rs 文件中的id 为新 program id.
// 确认 Anchor.toml 是在 devnet 环境.

// 再次运行build命令.
anchor build
```

### 🚀 部署到 devnet！

最后，您可以进行部署了 :)！ 继续运行：

```bash
anchor deploy
```

你应该看到 “Deploy success” 这个词:)。

完成后，您可以前往 [Solana Explorer](https://explorer.solana.com/?cluster=devnet) 查看是否一切正常！ *注意：转到右上角，单击“Mainnet”，然后单击“Devnet”，因为我们已部署到 Devnet。*

在资源管理器上，粘贴您的 program ID（与我们从 `solana address -k target/deploy/myepicproject-keypair.json` 输出的 id 相同）并搜索它。

![Untitled](https://i.imgur.com/U2wgQpj.png)

你会看到你部署的程序！！ 将网页向下滚动并查看历史交易记录，您将在那里看到部署的内容。

![Untitled](https://i.imgur.com/KeTHI7p.png)

**YOO——你刚刚部署到了真正的 SOLANA 区块链。 GOOD。**

这里当然不是 “Mainnet”，但“Devnet”是由真正的矿工合法运行的网络。

**实际上没有那么多“Solana 开发者能做到这些”。 所以在这一点上，您可能是 Solana 开发人员中排名前 10% 的人，哈哈。 恭喜！**

*注意：从现在开始，除非我说，否则请不要更改 lib.rs。 基本上，无论何时更改程序，都需要重新部署并重新执行上述步骤。 我总是很容易错过步骤并遇到奇怪的bug，哈哈。 现在让我们专注于 Web 应用程序，然后我将向您展示修改程序 + 重新部署的良好工作流程！*


### 🚨 进度报告

*请这一定记得报告，否则 Farza 会伤心的💔*

您已经部署了一个 Solana dapp！！！ 这简直是地狱级别的难度 ！

我们已经看到，最好的建设者已经养成了 “公开建设” 的习惯。 所有这一切意味着分享一些关于他们刚刚达到的里程碑的知识是多么令人兴奋！

现在是发推文说您正在学习 Solana 并且刚刚将您的第一个程序部署到 Solana Devnet 的好时机， 并激励其他人加入到 web3！

推文中请务必包含您的 Solana Explorer 链接，并附上您部署的 dapp 屏幕截图。 或者，添加一张 Solana Explorer 的屏幕截图！！ 如果可以，请艾特 `@_buildspace`。









