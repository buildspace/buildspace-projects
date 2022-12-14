Flow 游乐场不能做的一件大事就是将合约部署到测试网。 是时候从 playground 毕业到合适的开发环境了。

### 🤠 安装 Cadence VS Code 扩展
首先，[下载并安装 VS Code](https://code.visualstudio.com/download)（如果您还没有的话）。 我们将需要 Cadence 扩展，该扩展可正式用于 VS Code，非官方可用于 [IntelliJ 平台](https://github.com/cadence-tools/cadence-for-intellij-platform#installation)。

MacOS/Linux 用户可以从 marketplace 安装扩展：
![](https://hackmd.io/_uploads/HyJKJIdK5.png)



**Windows 用户！**

由于 Windows 上最新版本 (0.7.0) 的扩展存在问题，您必须安装适用于 Linux 的 Windows 子系统，并在 WSL 中完成整个项目。 这非常简单！ 查看 [官方说明](https://docs.microsoft.com/en-us/windows/wsl/install) 并按照完整安装进行操作。 在整个项目中，每当我说“在终端中”时，您都需要在 WSL2 中打开一个终端！ 如果您安装 Remote WSL `https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl` 扩展，这会让您在 Linux 中远程工作，这会更容易。

这是我制作的一段视频，解释了这个过程：

[Loom](https://www.loom.com/share/39909f64123a400ebd113d8382a0c726)



如果你无法在你的机器上设置 WSL，你将不得不使用手动安装旧版本的 Cadence 扩展。

启动终端并运行以下命令：
```
git clone -b submissions/issue-3/koala https://github.com/onflow/vscode-cadence.git
cd vscode-candence
npm i
npm run package
code --install-extension cadence-0.6.4.vsix
```



这将下载旧版本，导航到其文件夹，安装依赖项，构建它，然后将其安装到 VS Code 中。 您还需要禁用自动更新，这样 VSCode 就不会更新它，哈哈，打开设置 (CTRL+,) 并搜索扩展自动更新并确保它设置为无！
![](https://hackmd.io/_uploads/rJ940HuY9.png)


请注意，旧版本运行时，模拟器会出现问题。 我强烈建议设置 WSL！

### 🤠 为 IntelliJ 平台安装 Cadence 扩展
如前所述，IntelliJ 未正式支持该扩展。 它还缺少一些功能（在撰写本文时），所以我将由您决定是否要使用它。 我建议只坚持使用 VS Code。 您可以在 [此处](https://github.com/cadence-tools/cadence-for-intellij-platform#installation) 找到 IntelliJ 版本。
![](https://user-images.githubusercontent.com/231274/175892621-ac4e8764-36b5-4f4a-b16d-2a214bd0ee0a.png)



### 🎮 安装 Flow CLI
接下来，我们将安装 Flow CLI。 这很简单！

**Mac 用户**

打开你的终端并注入这个 Homebrew。
```
brew install flow-cli
```



**Linux 和 WSL 用户**

在您的终端中运行：
```
sh -ci "$(curl -fsSL https://storage.googleapis.com/flow-cli/install.sh)"
```



如果在此之后无法识别 `flow version`，请运行 `export PATH=$PATH:/home/YOUR_MACHINE_NAME_HERE/.local/bin`

**Windows**

如果您安装了 WSL，请运行 ^ 上方的 Linux 命令。

如果您想在本机 Windows 上试试运气，请打开 PowerShell 并运行：
```
iex "& { $(irm 'https://storage.googleapis.com/flow-cli/install.ps1') }"
```


而已！ 您可以通过运行来检查您的安装
```
flow version
```


这是我在windows上看到的：
![](https://hackmd.io/_uploads/r12cwfUO9.png)


这是MacOS:
![](https://hackmd.io/_uploads/SyhyiK_K5.png)



您的版本可能不同，没关系！

Flow CLI 让我们可以做很多很酷的事情。 我们可以用它来与 Flow 网络对话、部署合约甚至发送交易。 让我们用它来建立一个 Flow 项目吧！

### 🐣 设置 Flow 项目
好了，我们准备开始了。 在您机器上的某个位置创建一个`Learn-Flow`文件夹。 该文件夹将包含我们所有的项目文件。 我要把我的放在桌面上。

```
# Desktop/
mkdir Learn-Flow
cd Learn-Flow
```



现在让我们为我们的智能合约创建一个文件夹并在其中初始化一个流程项目
```
# Desktop/Learn-Flow
mkdir FlowNFTs
cd FlowNFTs
flow init
```

![](https://hackmd.io/_uploads/Bkd8HIOtq.png)



这将创建一个`flow.json`文件，其中包含 Flow 区块链的基本配置详细信息。 您可以在 [此处的配置页面](https://docs.onflow.org/flow-cli/configuration/) 上阅读更多相关信息。

我们将大量使用这个文件，这样您很快就会了解它的全部内容！

🚨**在这里重新启动编辑器**🚨

最好在此处重新启动您的 VSCode 编辑器，以便安装的 Cadence 扩展检测到您将要编写流程并启动！

您可以通过在终端中输入`code .`来打开 VS Code 中的`FlowNFTs`文件夹。 如果这没有任何作用，则说明您还没有在您的机器上安装 shell 命令。 您可以通过启动命令选项板（`CMD/CTRL`+`SHIFT`+`P`）并键入“shell 命令”来安装它。

![](https://hackmd.io/_uploads/ByLsN8dYq.png)



### 🔥 本地部署一个合约

快速回顾一下，我们安装了 FLOW CLI，初始化了 FLOW 项目并设置了测试网帐户。 酷豆。 现在让我们编写一个简单的合约并将其部署到本地。

在你的`FlowNFTs`文件夹中，创建一个`contracts` 目录，并制作一个 NFT 合约文件。 我将我的命名为`BottomShot.cdc`（与 TopShot 相反，哈哈），您可以随意调用它。

在 VS Code 中打开这个文件并在其中添加这个婴儿 NFT 合约：
```cdc
pub contract BottomShot {

    // Declare an NFT resource type
    pub resource NFT {
        // The ID that differentiates each NFT
        pub let id: UInt64

        // String mapping to hold metadata
        pub var metadata: {String: String}

        // Initialize both fields in the init function
        init(initID: UInt64) {
            self.id = initID
            self.metadata = {}
        }
    }

    // Create a single new NFT and save it to account storage
    init() {
        self.account.save<@NFT>(<-create NFT(initID: 1), to: /storage/BottomShot1)
    }
}
```


这份合约非常简单。 它允许您创建仅具有两个属性的单个 NFT：ID 和元数据字符串。

```
self.account.save<@NFT>(<-create NFT(initID: 1), to: /storage/BottomShot1)
```


这是我们创建 NFT 的地方。 我们不检查 ID，因此可以使用相同的 ID 创建多个 NFT，目前还可以。 我们没有设置元数据字符串，所以这是一个非常无用的 NFT 哈哈

语法分解：
- `self.account.save`：在部署此合约的帐户上调用保存功能
-`<@NFT>`：我们正在保存 NFT 类型的资源
- `<-`：移动资源（不能使用“=”）
- `create NFT(initID: 1)`: 创建一个 NFT，传入 id 参数 1
- `to: /storage/BottomShot1`: save 函数的第二个参数——我们想要保存它的地方

接下来我们要做一些非常神奇的事情：我们将创建一个区块链！

Flow CLI 带有一个叫做 Flow Emulator 的东西——一个模拟真实 Flow 网络行为的轻量级工具。 它基本上在您的机器上创建了一个本地 Flow 区块链。 您可以通过在终端中运行它来启动它
```
flow emulator
```


由于这是在模拟真实的区块链网络，您需要保持终端运行以保持区块链活动。

**注意 - 扩展问题**

Cadence 扩展有时无法检测到您已启动模拟器。 如果您在合同文件的开头看到“模拟器离线”消息，请关闭运行模拟器的终端窗口，然后单击文件中的消息。

![](https://hackmd.io/_uploads/SyllhDjdFc.png)



这将在其自己的窗口中启动终端并将其附加到扩展程序。
![](https://hackmd.io/_uploads/S15uOodYc.png)



让我们在这个本地区块链上部署一个合约。 创建一个新的终端窗口并运行：
```
flow accounts add-contract BottomShot ./contracts/BottomShot.cdc
```



这里的语法是
```
flow accounts add-contract <name> <filename>
```



这会将合约添加到我们的本地模拟器，这是我的终端显示的内容：

![](https://hackmd.io/_uploads/rk-2nqdY9.png)



只要有我的模拟器的终端正在运行，就可以在那里访问这个合约。

**注意 - 扩展问题！**

同样，扩展有时无法检测到您刚刚部署了一个合约。 如果您遇到这种情况，只需重新启动您的编辑器，然后**仅**使用扩展提示！ 不要使用命令！

![](https://hackmd.io/_uploads/HkDjFoOF5.png)



做得很好！ 这就是在 Flow 上进行本地开发的简单之处。 我们现在已经准备好使用适当的 NFT 合约，而不仅仅是制作空白 NFT 的合约。

### 🚨 进度报告

您好，Flow 智能合约编写器。

发布您的终端输出的屏幕截图，显示本地部署的合同！