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





