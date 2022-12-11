太棒了。 我们已经在 Solana 项目上存储数据。并没有多少人知道如何做这些事情，所以，你肯定会觉得自己有点像高手。这个生态系统真的很早期，而你现在正处于神奇的中心。

虽然，计数器很酷。 但是，我们想要存储更复杂的数据！

现在让我们来设置一个可以存储更多我们在意的数据的一个结构数组。比如: *一个gif的链接和提交它的用户的钱包地址。* 然后，我们可以在我们的客户端检索这些数据!

### 💎 设置Vec<ItemStruct>

查看以下的一些更新:

```rust
use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod myepicproject {
  use super::*;
  pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> Result <()> {
    let base_account = &mut ctx.accounts.base_account;
    base_account.total_gifs = 0;
    Ok(())
  }

  // The function now accepts a gif_link param from the user. We also reference the user from the Context
  pub fn add_gif(ctx: Context<AddGif>, gif_link: String) -> Result <()> {
    let base_account = &mut ctx.accounts.base_account;
    let user = &mut ctx.accounts.user;

	// Build the struct.
    let item = ItemStruct {
      gif_link: gif_link.to_string(),
      user_address: *user.to_account_info().key,
    };
		
	// Add it to the gif_list vector.
    base_account.gif_list.push(item);
    base_account.total_gifs += 1;
    Ok(())
  }
}

#[derive(Accounts)]
pub struct StartStuffOff<'info> {
  #[account(init, payer = user, space = 9000)]
  pub base_account: Account<'info, BaseAccount>,
  #[account(mut)]
  pub user: Signer<'info>,
  pub system_program: Program <'info, System>,
}

// Add the signer who calls the AddGif method to the struct so that we can save it
#[derive(Accounts)]
pub struct AddGif<'info> {
  #[account(mut)]
  pub base_account: Account<'info, BaseAccount>,
  #[account(mut)]
  pub user: Signer<'info>,
}

// Create a custom struct for us to work with.
#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ItemStruct {
    pub gif_link: String,
    pub user_address: Pubkey,
}

#[account]
pub struct BaseAccount {
    pub total_gifs: u64,
	// Attach a Vector of type ItemStruct to the account.
    pub gif_list: Vec<ItemStruct>,
}
```

再次从代码底部开始，您会看到 `BaseAccount` 现在有一个名为 `gif_list` 的新参数。 它是 `Vec` 类型，这是 `Vector` 的缩写。 您可以在[此处](https://doc.rust-lang.org/std/vec/struct.Vec.html) 了解更多有关它的信息。 它基本上是一个数组！ 在本例中，它包含一个 `ItemStruct` 数组。

然后我用这段花哨的代码来声明我的 `ItemStruct`。

```rust
#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ItemStruct {
    pub gif_link: String,
    pub user_address: Pubkey,
}
```

它只包含一个带有 `gif_link` 的 `String` 和一个带有 `user_address` 的 `PubKey`。 非常简单。 有时候，我们就是这么任选：

```rust
#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
```

这有点复杂，但是，基本上是告诉 Anchor 如何序列化/反序列化结构。 请记住，数据存储在“帐户”中，对吗？ 该帐户基本上是一个文件，我们在存储数据之前将其序列化为二进制格式。 然后，当我们想要检索它时，我们实际上会反序列化它。

这一行负责确保我们的数据被正确序列化/反序列化，因为我们在这里创建了一个自定义结构。

我是怎么弄清楚这些东西的？ 好吧——我实际上只是自己深入研究了 [docs](https://docs.rs/anchor-lang/0.4.0/anchor_lang/trait.AnchorSerialize.html) 并阅读了源代码！ 我也在[Anchor Discord](https://discord.gg/8HwmBtt2ss)中提问！ 请记住，这些东西是最新的，当文档没有提供答案时，您可以自行寻找答案。

### 🤯 更新测试脚本

与往常一样，我们需要返回到我们的测试脚本！ 以下是更新后的代码：

```javascript
const anchor = require('@project-serum/anchor');
const { SystemProgram } = anchor.web3;

const main = async() => {
  console.log("🚀 Starting test...")

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Myepicproject;
  const baseAccount = anchor.web3.Keypair.generate();
  let tx = await program.rpc.startStuffOff({
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [baseAccount],
  });
  console.log("📝 Your transaction signature", tx);

  let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF Count', account.totalGifs.toString())

  // You'll need to now pass a GIF link to the function! You'll also need to pass in the user submitting the GIF!
  await program.rpc.addGif("insert_a_giphy_link_here", {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  });
  
  // Call the account.
  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF Count', account.totalGifs.toString())

  // Access gif_list on the account!
  console.log('👀 GIF List', account.gifList)
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
```

*注意：不要忘记给 `addGif` 赋一个 GIF 链接，上面写着 `insert_a_giphy_link_here` 否则你会得到一个令人困惑的错误，例如：`baseAccount not provided`。*

这里没有什么新鲜的！ 对我来说最神奇的时刻之一是当我看到 `console.log('👀 GIF List', account.gifList)` 的输出时。 能够将数据附加到帐户并通过帐户访问数据真是太酷了。

这是一种非常新奇的方式来思考如何存储数据，真的非常酷！！！

以下是我在运行 `anchor test` 后的输出：


```bash
🚀 Starting test...
📝 Your transaction signature 3CuBdZx8ocXmzXRctvKkhttWHpP9knvAZnXQ9XyNcgr1xeqs6E3Hj9RVkEWSc2iEW15xXprKzip1hQw8o5kWVgsa
👀 GIF Count 0
👀 GIF Count 1
👀 GIF List [
  {
    gifLink: 'insert_a_giphy_link_here',
    userAddress: PublicKey {
      _bn: <BN: 69f90845012df1b26922a9e895b073309e647c36e9052f7c9ec29793b8be9e99>
    }
  }
]
```

我们已经行走得很远了。 我们现在不仅在编写和运行 Solana 程序，而且，我们现在还想出了如何存储一些复杂的数据！ ✌️ ：）。

### 🚨 进度报告

*请一定要记得提交，否则 Farza 会伤心的:(*

在 `#progress` 频道中发布显示您的项目结构的终端屏幕截图！

这些步骤真的是超难的。 但是你做到了 :)。

