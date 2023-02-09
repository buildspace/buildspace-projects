现在，我们的程序几乎什么都不会做，哈哈。 让我们来修改并存储一些数据！

我们的网站将允许人们提交 GIF。 因此，存储诸如 `total_gifs` 数字之类的东西也会很有帮助。

### 🥞 创建整数以存储 GIF 计数

这真的很酷，所以我们只是想存储一个整数， 其中包含人们提交 `total_gifs` 的次数。 每当有人提交一个新的 gif，我们都会做一次`total_gifs += 1`。

让我们先思考一下。

记得之前我说过 Solana 程序是**无状态的**。 他们**不**永久保存数据。 这与以太坊智能合约的世界截然不同——后者在合约上持有状态权。

但是，Solana 程序可以与“帐户”交互。

同样，帐户基本上是程序可以读取和写入的文件， “帐户”这个词令人困惑而且超级糟糕。 例如，当你在 Solana 上创建钱包时——你创建了一个“帐户”。 但是，您的程序也可以创建一个“帐户”，可以将数据写入其中，程序本身也被视为“帐户”。

**一切都是一个帐户 哈哈哈**。 请记住，帐户不仅仅是您的实际钱包——**它也是程序彼此之间传递数据的一种通用方式**。 [此处](https://docs.solana.com/developing/programming-model/accounts) 可以详细了解其工作原理。

查看下面的代码，有些地方我还添加了一些注释。
```rust
use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod myepicproject {
  use super::*;
  pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> Result <()> {
    // Get a reference to the account.
    let base_account = &mut ctx.accounts.base_account;
    // Initialize total_gifs.
    base_account.total_gifs = 0;
    Ok(())
  }
}

// Attach certain variables to the StartStuffOff context.
#[derive(Accounts)]
pub struct StartStuffOff<'info> {
    #[account(init, payer = user, space = 9000)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program <'info, System>,
}

// Tell Solana what we want to store on this account.
#[account]
pub struct BaseAccount {
    pub total_gifs: u64,
}
```

**这里似乎发生了很多事情。** 让我们逐行来分析。

### 🤠 初始化账户

让我们看看最底部的这一行代码：
```rust
#[account]
pub struct BaseAccount {
    pub total_gifs: u64,
}
```
这太棒了。基本上，这里是告诉我们的程序可以创建什么样的帐户，以及在帐户中保存了什么。这里的 `BaseAccount` 包含一个 `total_gif` 的整数。

然后，这里我们实际上指定了如何初始化它以及在 `StartStuffOff` 上下文中保存什么。

```rust
#[derive(Accounts)]
pub struct StartStuffOff<'info> {
    #[account(init, payer = user, space = 9000)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program <'info, System>,
}
```

看起来很复杂 哈哈。

首先我们有`[account(init, payer = user, space = 9000)]`。 **我们在这里所做的就是告诉 Solana 我们要如何初始化 `BaseAccount`。**

请注意，如果在运行下面的测试后出现错误: `Transaction simulation failed: Error processing Instruction 0: custom program error: 0x64` ，您需要将 `space = 9000` 修改为 `space = 10000`。 如果您查看来自 [Anchor 的这些文档](https://project-serum.github.io/anchor/tutorials/tutorial-1.html#defining-a-program)，您可以看到它们定义了一个简单的程序，该程序声明了 `space = 8 + 8（例如，8 个字节 + 8 个字节）`。 我们在程序中添加的逻辑越多，它占用的空间就越多！

1. `init` 将告诉 Solana 创建我们当前程序的新帐户。
2. `payer = user` 告诉我们的程序谁为要创建的帐户付款。 在这种情况下，调用该函数的是“用户”。
3. 然后我们说 `space = 9000` 将为我们的帐户分配 9000 字节的空间。 您可以按需修改，但是，9000 字节对于我们构建的程序来说已经足够了！

我们为什么要为帐户付款？ 嗯——因为存储数据是收费的！ Solana的工作原理是，用户将为他们的账户支付“租金”。 您可以在 [此处](https://docs.solana.com/developing/programming-model/accounts#rent) 了解更多信息以及租金的计算方式。 很狂野，对吧？ 如果你不支付租金，验证者将清空你的账户！

[这是](https://docs.solana.com/storage_rent_economics)另一篇关于租金的文章，我很喜欢!

> "通过这种方法，有两年租金保证金担保的账户可以免收网络租金。通过保持这个最小余额，网络将受益于低流动性，帐户持有人可以放心，他们的 `account::data`将被保留以继续访问/使用。”
>

然后我们通过 `pub user: Signer<'info>` 传递给程序数据，向程序证明该用户拥有该钱包的权限。

最后，我们有 `pub system_program: Program` 这实际上非常酷。 它基本上是对 [SystemProgram](https://docs.solana.com/developing/runtime-facilities/programs#system-program) 的引用。 SystemProgram 是运行 Solana 最基本的程序。 它负责很多事情，但它所做的主要事情之一是在 Solana 上创建帐户。 SystemProgram 是 Solana 的创建者部署的一个程序，其他程序可以与之通信，哈哈——它的 ID 为“11111111111111111111111111111111”。

最后，我们在函数中执行此操作，只需通过执行 `Context<StartStuffOff>` 从 `StartStuffOff` 上下文中获取 `base_account`。


```rust
pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> Result <()> {
	// Get a reference to the account.
  let base_account = &mut ctx.accounts.base_account;
	// Initialize total_gifs.
  base_account.total_gifs = 0;
  Ok(())
}
```

BOOM！ 再次强调——这些东西可能看起来很混乱，特别是如果你是 Rust 的新手，但**让我们继续编写和运行代码**。 我认为你编写代码 → 运行 → 获取错误 → 修复错误 → 重复的次数越多，这些东西就越有意义。

*注意：我们执行 `&mut` 以获得对 `base_account` 的“变量引用”。 当我们这样做时，它实际上给了我们对 `base_account` 进行**更改**的权力。 否则，我们只是在使用 `base_account` 的“本地副本”。*

### 👋 检索帐户数据

让我们把它们放在一起。

在javascript中，我们也可以检索账户数据。继续更新 `myepicproject.js`。我在改动的代码行上添加了一些注释。

```javascript
const anchor = require('@project-serum/anchor');

// Need the system program, will talk about this soon.
const { SystemProgram } = anchor.web3;

const main = async() => {
  console.log("🚀 Starting test...")

  // Create and set the provider. We set it before but we needed to update it, so that it can communicate with our frontend!
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Myepicproject;
	
  // Create an account keypair for our program to use.
  const baseAccount = anchor.web3.Keypair.generate();

  // Call start_stuff_off, pass it the params it needs!
  let tx = await program.rpc.startStuffOff({
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [baseAccount],
  });

  console.log("📝 Your transaction signature", tx);

  // Fetch data from the account.
  let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF Count', account.totalGifs.toString())
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

`anchor.web3.Keypair.generate()` 可能有点令人困惑——我们为什么要这样做？ 好吧，基本上是因为我们需要为正在创建的 `BaseAccount` 创建已些凭证。

大多数脚本是相同的，但您会看到我向 `startStuffOff` 传递了一些我们在结构 `pub struct StartStuffOff` 中指定的重要参数。

*注意：在 `lib.rs` 中，该函数称为 `start_stuff_off`，因为在 Rust 中我们使用 snake case 大小写（`snake_case`）而不是 camel case大小写。 但是，在我们的 javascript 文件中，我们使用camel case 大小写并实际调用了 `startStuffOff`。 这是 Anchor 为我们做的一件好事，因此无论我们使用什么语言，我们都需要遵循最佳实践。 你可以在 Rust-land 中使用 snake case，在 JS-land 中使用 camel case。*

也许最酷的部分是是下面的代码:

```javascript
await program.account.baseAccount.fetch(baseAccount.publicKey)
console.log('👀 GIF Count', account.totalGifs.toString())
```

这里我们实际上检索了我们创建的帐户，然后访问 `totalGifs`。 当我运行 `anchor test` 时，将输出：

```
🚀 Starting test...
📝 Your transaction signature 2KiCcXmdDyhMhJpnYpWXQy3FxuuqnNSANeaH1CBjvomuLZ8LfzDKHtDDB2LHfsfoVQZSyxoF1R39ao6VfTrD7bG7
👀 GIF Count 0
```

输出的结果是 `0`! 这真是太棒了。我们现在实际上正在调用一个程序，并以无权限的方式在 Solana 链上存储数据。真好。

### 👷‍♀️ 构建一个函数来更新 GIF 计数器

让我们创建一个名为 `add_gif`的新函数，以更新 GIF 计数器。下面是我的一些代码改动：

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
  
	// Another function woo!
  pub fn add_gif(ctx: Context<AddGif>) -> Result <()> {
    // Get a reference to the account and increment total_gifs.
    let base_account = &mut ctx.accounts.base_account;
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

// Specify what data you want in the AddGif Context.
// Getting a handle on the flow of things :)?
#[derive(Accounts)]
pub struct AddGif<'info> {
  #[account(mut)]
  pub base_account: Account<'info, BaseAccount>,
}

#[account]
pub struct BaseAccount {
    pub total_gifs: u64,
}
```

看起来很简单！ 我在底部附近添加了：

```rust
#[derive(Accounts)]
pub struct AddGif<'info> {
  #[account(mut)]
  pub base_account: Account<'info, BaseAccount>,
}
```

我创建了一个名为 `AddGif` 的 `Context`，它可以访问 `base_account` 的变量引用。 这就是我写 `#[account(mut)]` 的原因。 这意味着我实际上可以更改存储在 `BaseAccount` 上的 `total_gifs` 值。

否则，我可能会在我的函数中更改它的数据，但它*实际上不会更改*我的帐户。 现在，有了“变量”引用，如果我在我的函数中弄乱了 `base_account`，它会修改帐户本身的数据。

最后，我创建了一个 `add_gif` 函数！

```rust
pub fn add_gif(ctx: Context<AddGif>) -> Result <()> {
    // Get a reference to the account and increment total_gifs.
    let base_account = &mut ctx.accounts.base_account;
    base_account.total_gifs += 1;
    Ok(())
}
```

我所做的就是获取通过 `Context<AddGif>` 传递给函数 `base_account` 的值 。 然后更新计数器，就是这样！！

希望您能看到我们在程序底部附近设置的 `Context` 如何在函数中变得有用。 这基本上是一种很好的表达方式，“嘿，当有人调用 `add_gif` 一定要附加 `AddGif` 上下文，以便用户可以访问 `base_account` 以及附加到 `AddGif` 的任何其他内容。

### 🌈 再次更新测试脚本！

每次我们更新程序时，我们都需要更新脚本来测试！ 让我们更新 `myepicproject.js` 以调用 `add_gif`。

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
	
  // Call add_gif!
  await program.rpc.addGif({
    accounts: {
      baseAccount: baseAccount.publicKey,
    },
  });
  
  // Get the account again to see what changed.
  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF Count', account.totalGifs.toString())
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

当我运行 `anchor test`命令时，会输出：

```bash
🚀 Starting test...
📝 Your transaction signature 2Z9LZc5sFr8GHvwjZkrkqGJZ1hFNzZq2rTPV7jSEUjFoMZ16QQwPS2B7qqyNrmfFEpodHTBhvt5oSBi958mbwiR8
👀 GIF Count 0
👀 GIF Count 1
```

真棒。 我们现在实际上是在我们的 Solana 程序上存储 **和** 更新数据。🤠

*注意：您会注意到，当您再次运行 `anchor test` 时，它会再次从 0 开始计数。 为什么？ 好吧——基本上是因为每当我们运行 `anchor test` 时，我们都会通过 `anchor.web3.Keypair.generate() `为我们的帐户生成一个新密钥对， 这实际上每次都会创建一个新帐户。 在我们的网络应用程序上——我们将妥善解决这个问题。 但出于测试目的，它很有用，因为我们每次测试时都可以从一个新帐户开始。*

###🚨进度报告

请一定要报告哦，否则Farza会伤心的

在 `#progress`!频道中发布显示你的 GIF 计数的终端屏幕截图!

这是迄今为止最值得骄傲的工作:)。









