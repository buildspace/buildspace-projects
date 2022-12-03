## 😍编写你的第一个Solana程序
去VSCodes中打开`myepicproject`文件夹。

如果你是Windows用户，请记住这一切都需在WSL下完成。如果你已忘记你的文件安装在Ubuntu中哪个位置了，请按照以下步骤回到你的项目:

按`windows + R`打开命令终端。在这里，你可以输入`\\wsl$\Ubuntu`，然后弹出资源管理器窗口。

在这些文件夹中，找到`home`到主文件夹，然后转到`username`文件夹,在这里你可以找到`myyepicproject`!

如果你在浏览器中没有看到任何文件/文件夹，请确保你已经打开了Ubuntu终端窗口。

💡如果您找不到`home`或`myepicproject`文件夹，试着用另一种在WSL终端中键入以下命令的方法：

`wslpath -w [myepicproject_path_in_wsl]`

（只需将 [myepicproject_path_in_wsl] 替换为您的Unbuntu中myepicproject的文件路径），然后它将显示您Windows文件系统中的相应路径。

在这里，您将看到Anchor为我们的的项目施加魔法。

**删除**`programs/myepicproject/src/lib`和`tests/myepicproject.js`中的代码内容。不要删除文件，只是删除其中的内容。

_注意:实际上我并没有给VSCode安装Rust插件，但它自带了Rust语法高亮显示功能。_

### 👶 一个基础程序
让我们编写第一个 Solana 程序！将下方Rust 代码存放到lib.rs文件中。

看起来像这样：
```rust
use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod myepicproject {
  use super::*;
  pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> Result <()> {
    Ok(())
  }
}

#[derive(Accounts)]
pub struct StartStuffOff {}
```
让我们逐行来看看这里发生了什么。如果你不懂Rust，也不用担心，我觉得你很快就能掌握这些知识。你不会就这样成为一个Rust高手，你可以暂缓焦虑:)。

```rust
use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;
```
代码顶部有一个简单的`use`声明，有点像import语句。我们希望可以导入更多Anchor为我们提供的工具，使编写Solana程序更加容易。

```rust
declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");
```

我们稍后再谈这件事。一般来说，这是“程序id”，上面有Solana如何运行我们的程序的信息。Anchor为我们生成了这个，我们稍后会进行更换。

```rust
#[program]
```

这是我们告诉程序的方式，“嘿，下面这些小模块中的所有内容都是我们的程序，我们希望其他人可以调用这些”，您将看到它是如何发挥作用的。但实质上，这让我们能够从前端通过取回请求调用我们的Solana程序。我们将在一些地方看到这类`#[blah]`语法。

它们被称为[宏](http://web.mit.edu/rust-lang_v1.25/arch/amd64_ubuntu1404/share/doc/rust/html/book/first-edition/macros.html)-它们基本上是将代码附加到模块中。这有点像“继承”一个类。

```rust
pub mod myepicproject {
  use super::*;
  pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> Result <()> {
    Ok(())
  }
}
```
`pub mod`是一个Rust "[模块](https://stevedonovan.github.io/rust-gentle-intro/4-modules.html)"，这是一种定义函数和变量集合的简单方法，有点像类。

在模块“mypicproject”里，我们编写了一个“start_stuff_off”函数，该函数接受`Context`的内容并输出`Result<（）>`。而且，你可以看到这个函数除了调用`Ok(())`之外没有别的功能，这只是一个`Result`类型，阅读[这里](https://doc.rust-lang.org/std/result/)以了解更多。

所以，实际上`start_stuff_off`只是一个其他人当前可以调用的函数。它现在不起作用，但是，我们会稍后会进行更改：）。

```rust
#[derive(Accounts)]
pub struct StartStuffOff {}
```
最后代码底部这行，稍后我们会明白这里有多重要。但基本上它是另一个“宏”。在这里，我们基本上能够指定不同的帐户约束。再说一遍，稍后我们会意识到这里多么重要。

让我们把程序跑起来，看看会发生什么。

### 💎编写一个脚本并了解它如何在本地工作
我们需要告诉Anchor我们希望程序如何运行以及我们想调用什么函数。打开`tests/myepicproject.js`。实际上这些代码是用javascript写的:)。
代码如下：

```javascript
const anchor = require('@project-serum/anchor');

const main = async() => {
  console.log("🚀 Starting test...")

  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.Myepicproject;
  const tx = await program.rpc.startStuffOff();

  console.log("📝 Your transaction signature", tx);
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
我们逐行来学习下这些代码。首先，`runMain`只是一个让我们的`main`函数异步运行的javascript小魔法，没什么特别的。
真正的奇迹发生在这里:
```javascript
anchor.setProvider(anchor.AnchorProvider.env());
const program = anchor.workspace.Myepicproject;
const tx = await program.rpc.startStuffOff();
```
首先，我们告诉Anchor设置我们的节点提供商。通过运行`solana config get`获取这些数据。通过这种方式，获取我们本地环境!这样，Anchor就知道我们在本地运行的代码(稍后我们将能够在devnet上测试我们的代码!)

然后，我们转到`anchor.workspace.Myepicproject`，这是Anchor提供的一个非常酷的东西，它将自动编译`lib.rs`文件中的代码，并将其部署在本地节点上。这一行代码中有太多妙不可言魔法，这也是Anchor很棒的一个重要原因。

*注意：命名和文件夹结构在这里非常重要。例如，Anchor知道我们运行的是`programs/myepicproject/src/lib.rs`是因为命名了`Anchor.workspace.Mypecproject`。*

最后，我们实际上调用了`program.rpc.startStuffOff()`函数，并等待它本地节点的`mine`指令。

在运行之前，我们需要做一点点修改。

在`Anchor.toml`文件中我们要稍微修改一下`[scripts]`条目，更改为如下所示代码：

```rust
[scripts]
test = "node tests/myepicproject.js"
```
**`Anchor.toml`文件中的其他代码保持不变。**

最后，运行如下命令：

```bash
anchor test
```
在接近底部的数据行中，我们可以看到：

```bash
🚀 Starting test...
📝 Your transaction signature 4EPghDAKXjtseY1dB4DT3xwpt18L1QrL8qbAJ3a3mRaTTZURkgBuUhN3sNhppDbwJNRL75fE53ucTBytoPWNEMAx
```

*注意:如果你正在使用VSCode，请一定记得在运行`anchor test`之前**保存**(Ctrl+K+S）所有你修改过的文件!我编写的时候遇到了很多这样的问题，我以为我保存了，但实际上并没有😤

*注意:如果显示这个错误`Attempt to load a program that does not exist`，你可以执行`solana address -k target/deploy/myepicproject-keypair.json`，并在`lib.rs`、`Anchor.Toml`和`myepicproject.js`中替换该地址。*

**BOOOOM🎉🎉很明显你成功了。**

当你看到"transaction signature"，这意味着你成功地调用了`startStuffOff`函数，这个签名基本上就是你的成功的凭证。

太精彩了！您已经成功编写了一个Solana程序，并将其**部署到本地Solana节点上**，实际上就是与部署在本地Solana网络程序进行了通信。

NICE！！！虽然这听起来有些不太可能，但我想你应该已经掌握了整个的工作流程。

1.在`lib.rs`中编写代码

2.用`tests/myepicproject.js`测试特定函数。

掌握这个工作闭环流程！这是迭代Solana程序的最快方式🤪

### 🚨进度证明提交

*请这一定要提交证明，否则Farza会难过的😭

在`#progress`频道发布的测试截图！以此激励我们的朋友们。























