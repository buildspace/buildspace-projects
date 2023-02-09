### ✈️ 更新你的程序

假设您想向 Solana 程序添加一些新功能。

我之前说过不要碰 `lib.rs`，因为在本地工作和重新部署会很奇怪。

所以，基本上有了 Solana，我几乎 *从不* 在 `localnet` 上工作。 不断在 `localnet` 和 `devnet` 之间切换真的很烦人。

相反，我更新了我的程序，然后为了测试它，只需通过 `tests/myepicproject.js` 上的 `anchor test` 运行我的脚本，以确保一切正常，Anchor 实际上会直接在 `devnet` 上运行测试，这真的很酷。

然后，当我准备好在我的 Web 应用程序上测试我的 dapp 的更新时——我只需执行 `anchor deploy` 。 从那里您需要确保为 Web 应用程序获取更新后的 IDL 文件。

**无论何时重新部署，都需要更新 Web 应用程序上的 IDL 文件**

就像以前一样，您需要将您的 idl 上传到 solana，但这次您将调用 upgrade 而不是调用 init 。
```
anchor idl upgrade -f target/idl/myepicproject.json `solana address -k target/deploy/myepicproject-keypair.json`
```

现在，我想介绍一些您可以添加的我认为会很有趣的**可选**功能。 同样，这些是可选的。 我也不会指导您如何构建它们。 这些将留给您自行探索解决。

### 🏠 在网络 dapp 上展示用户的公共地址

我们目前没有在任何情况下展示用户的公共地址:

```rust
pub struct ItemStruct {
    pub gif_link: String,
    pub user_address: Pubkey,
}
```

在他们提交的 GIF 下展示用户的地址可能会很酷！！ 在您的 Web 应用程序上执行类似 `item.userAddress.toString() ` 的操作应该可行。 如果您愿意，我会让您弄清楚如何实施它。

### 🙉 让用户为 GIF 投票

如果每个 GIF 都以 0 票开始，那就太酷了，人们可以在您的网络 dapp 上“投票”他们最喜欢的 GIF。

不过我不会告诉您如何制作它；）。 想要的话就自己想办法吧！ 提示：您需要在 Solana 程序中创建一个 `update_item` 函数。 在那里，您需要弄清楚如何进入 `gif_list`，找到被点赞的 GIF，然后对其执行类似 `votes += 1`的操作。

看看你能不能想出来！！

### 💰向最佳 GIF 的提交者发送 Solana“小费”

我们在这里完全没有涉及的一件事是如何向其他用户汇款！

如果您非常喜欢另一个用户提交的某个 GIF 以至于您可以向该用户发送小费，那将是非常酷的。 也许像 50 美分或价值 1 美元的 SOL。 也许您会点击“小费”，输入您想要小费的 SOL 数量，然后点击“发送”将其直接发送到该用户的钱包！

**Solana 的超低 gas 费用意味着像这样发送少量资金实际上是可行的。** 如果你这样做，你甚至可以在 Solana 上制作一个 Patreon 或 BuyMeACoffee 版本。 没那么疯狂。 你现在已经具备了所有的基本技能。

当你有一个超低 gas 费用的区块链可以让你即时支付时，谁还需要 Stripe 和 PayPal？！？

这是我想让你弄清楚的另一件事，如果你想通过在 [Anchor Discord](https://discord.gg/8HwmBtt2ss) 闲逛或询问你的 buildspacer 伙伴来弄清楚。 **为什么我不告诉你答案？** 哈哈，因为我希望你活跃在 Solana 社区，想出办法，并通过努力学习提升自己。

例如，这是我问的问题lol：

![无标题](https://i.imgur.com/b94aOcG.png)

哈哈哈！！顺便说一句：@cqfd#6977 是绝对传奇人物！！ 他甚至打电话给我，分享我遇到的错误。 在 Anchor Discord 中时刻保持友善，不要随便问问题。 努力搜索 Discord，看看是否有其他人遇到过与您相同的问题，并在有人提供帮助时始终说 thank you ;)。

友善的人总是能够行走的更远。

### 👍 几个示例 dapp

您可以在 [此处](https://github.com/project-serum/anchor/tree/master/tests) 的 Anchor 存储库中找到大量示例 dapp。 您可以查看不同的示例来弄清楚如何实现它。



