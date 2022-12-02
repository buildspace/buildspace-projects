### 😍编写你的第一个Solana程序
去VSCodes中打开`myepicproject`文件夹。

如果你是Windows用户，请记住这一切都需在WSL下完成。如果你已忘记你的文件安装在Ubuntu中哪个位置了，请按照以下步骤回到你的项目:

按`windows + R`打开命令终端。在这里，你可以输入命令`\\wsl$\Ubuntu`，然后弹出资源管理器窗口。

在这些文件夹中，找到`home`到主文件夹，然后转到`username`文件夹,在这里你可以找到`myyepicproject`!

如果你在浏览器中没有看到任何文件/文件夹，请确保你已经打开了Ubuntu终端窗口。

💡如果您找不到`home`或`myepicproject`文件夹，试着用另一种在WSL终端中键入以下命令的方法：

`wslpath -w [myepicproject_path_in_wsl]`

（只需将 [myepicproject_path_in_wsl] 替换为您的Unbuntu中myepicproject的文件路径），然后它将显示您Windows文件系统中的相应路径。

在这里，您将看到Anchor为我们的的项目施加魔法。

**删除**`programs/myepicproject/src/lib`和`tests/myepicproject.js`中的代码内容。不要删除文件，只是删除其中的内容。

_注意:实际上我并没有给VSCode安装Rust插件，但它自带了Rust语法高亮显示功能。_

#### 👶 一个基础程序
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



