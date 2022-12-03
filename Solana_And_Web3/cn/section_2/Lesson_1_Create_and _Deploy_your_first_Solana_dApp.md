## ☀️ 搭建Solana本地运行环境

#### 🦾我们接下来要做什么？
我们已经完成了所有网页app的内容。但是，我们之前用的都是是测试数据！现在，我们将构建一个Solana程序，并允许用户1）向看板提交gif动图2）将它们保存在Solana区块链上3）检索所有已提交的gif动图。

一旦我们完成了以上这些，我们将部署Solana程序，并将其连接到我们的网页app，就像您部署一个API，然后将它连接到您的网页app！

#### 📝 开始前让我们来谈谈Solana

好吧，老实说，现在让Solana 正常运行起来并不容易。
这是不是意味着Solana已经烂透了?Ehh
NO!我不这么认为。

我认为 Solana使用的是非常早期的技术，正因如此，它的迭代非常频繁，所以很难仅通过谷歌搜索问题或从Solana官方文档中获得准确、简洁的答案。

时光回到2015年，那时候我正痴迷于机器学习，它是如此的新颖有趣。在2015 年，机器学习技术的相关文档非常糟糕，很难通过谷歌找到自己满意的答案，因为大多数时候我是第一个提出这个问题的人，哈哈。于是乎，只能由我自己找到答案并更新文档。
这就是痴迷新兴技术的代价。

我认为Solana目前也处于类似的尴尬境地，我真的想对大家说——不要过多期望于超级丝滑的开发体验。踏上开发学习的道路随时遇到的坎坷，取决于您能否找到解决问题的答案以及乐于帮助他人。

**综上所述，我认为一旦你搭建好了Solana的运行环境并熟练掌握其工作原理，它会变得非常有趣。它是如此之快，gas费是如此神奇的低。致力于成为突破性技术的社区的一员真的很有成就感，就感觉像自己是Solana的团队中的一员。**

#### 🚦选择你的部署路径
安装Solana首先要从您的系统开始。在不同的操作系统上有一堆“陷阱”。如果您的系统是Intel macOS或Linux，请按教程继续操作。如果您运行的是Windows或M1 macOS系统，请点击下面的链接:

[在Windows上安装Solana](https://github.com/buildspace/buildspace-projects/blob/main/Solana_And_Web3/en/Section_2/Resources/windows_setup.md)  

[在 M1 macOS上安装Solana](https://github.com/buildspace/buildspace-projects/blob/main/Solana_And_Web3/en/Section_2/Resources/m1_setup.md)  祝您好运！相信您能掌握它！

#### 🦀安装Rust
在Solana链上，所有程序都是用Rust编写的!如果你不懂Rust，别担心。就像其他编程语言一样，通过这个项目的学习相信你能够掌握它。
您只需按照[这里](https://doc.rust-lang.org/book/ch01-01-installation.html?utm_source=buildspace.so&utm_medium=buildspace_project)的步骤即可成功安装Rust，包括在Windows、Linux和Mac上的安装操作说明。

安装完成后，在控制台输入如下命令：`rustup --version`

然后输入如下命令，确保Rust编译器已成功安装：`rustc --version`

最后，我们输入如下命令以确保Cargo也已成功安装：`cargo --version`

以上3个命令输入后显示软件版本且未出现错误代码，即代表软件安装成功‘请继续！

#### 🔥安装Solana
Solana有一个非常好用的CLI(command-line interface)，后续当我们想要测试程序时，它将发挥巨大作用。

同样地，这里的安装步骤非常简单。对于Windows、Linux和Mac系统安装Solana CLI都有明确的步骤。

而且不用太过担心，Solana会自动升级到最新版本。

_注意:由于系统的差异性—-当你安装完Solana后，可能会输出一行像“Please update your PATH environment variable”这样的信息提示，它会提示你一行代码来复制和运行。继续并复制/运行该行代码，以便正确设置PATH。_

一旦你完成了安装，运行以下命令来验证是否成功：`solana --version`

如果输出一串软件版本号，那么你可以继续了。

接下来继续依次运行以下两行命令：  

    solana config set --url localhost
    solana config get

这将输出类似于如下数据行：

    Config File: /Users/flynn/.config/solana/cli/config.yml                                                                                                            
    RPC URL: http://localhost:8899                                                                                                                                     
    WebSocket URL: ws://localhost:8900/ (computed)
    Keypair Path: /Users/flynn/.config/solana/id.json
    Commitment: confirmed

这意味着Solana已经可以和我们的本地网络进行通信了!当开发程序时，我们将使用Solana本地网络以便快速测试项目。

最后我们还要测试下：确保能够运行本地Solana节点。基本上，还记得之前我们说过Solana链是由“验证节点”运行的吗?我们可以在电脑上设置一个验证器来测试我们的程序。

运行以下命令测试本地节点运行：`solana-test-validator`
按住Ctrl+C可以暂停节点运行。

#### Windows 用户须知：
如果您是Windows 用户并且上述命令不起作用，或者您收到以下错误，`Unable to connect to validator: Client error: test-ledger/admin.rpc does not exist`请确保执行以下操作：

1、打开WSL 而不是 Powershell。

2、输入命令`cd ~/`退出退出并返回到根目录

3、最后输入`solana-test-validator`

这可能需要一点时间，但一旦开始，您应该会看到如下内容：
![](https://i.imgur.com/F2YwcAB.png)
Boom！！现在你也可以成功运行Solana本地网络了Cool：）

如果您是Intel Mac用户并提示以下错误，您将需要安装该OpenSSL库。最简单的方法是通过：`brew install openssl@1.1`命令安装。

    solana-gif-portal solana-test-validator
    dyld: Library not loaded: /usr/local/opt/openssl@1.1/lib/libssl.1.1.dylib
      Referenced from: /Users/<your-username>/.local/share/solana/install/active_release/bin/solana-test-validator
      Reason: image not found

现在，继续通过Ctrl + C来暂停节点。我们再也不会手动使用solana-test-validator了。我们遵循的操作流程实际上会自动在后台为我们运行节点。我只是想向你展示它是如何工作的，这样你就可以开始了解它是如何神奇地工作的;)

#### ☕️安装 Node、NPM 和 Mocha
很有可能您已经安装过Node和NPM。
输入命令：`node --version`查看版本号，我的是v16.0.0,这里要求的最低版本为v11.0.0。

如果您没有安装过Node，请在[此处](https://nodejs.org/en/download/?utm_source=buildspace.so&utm_medium=buildspace_project)获取，Linux用户依次输入以下两行命令安装：

    curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
    sudo apt-get install -y nodejs

这之后，一定要安装这个叫Mocha的小程序。它是一个很好的小测试框架，可以帮助我们测试Solana程序。
`npm install -g mocha`

#### ⚓️魔力Anchor
我们会经常会用到“Anchor”这个工具。他就像Ethreum生态的Harhat!只不过，这是为Solana构建的。Anchor可以让我们非常容易地在本地运行Solana程序，并在一切就绪时部署到Solana主网!

Anchor也是一个非常早期的项目，由几个核心开发人员运行。在操作过程中你肯定会遇到一些问题，加入他们的Discord，随时提出问题或在他们的Github上提交问题。开发人员都非常友善，你甚至可以说你来自buildspace:)。

**顺便提一下，不要只是加入他们的Discord，问一些普遍性的问题并期待得到帮助。自己动手搜索Discord讯息，看看是否有人遇到你同样的问题。关于你的问题，尽可能多地提供信息，让大家有帮助你的欲望，😆**

说真的，加入[Anchor Discord](https://discord.com/invite/8HwmBtt2ss?utm_source=buildspace.so&utm_medium=buildspace_project)吧，你一定会受益匪浅。

接下来我们通过下面的步骤来安装Anchor，我们将从源代码开始构建。
注意:如果您使用的是Linux，则可以查看[此处](https://www.anchor-lang.com/docs/installation?utm_source=buildspace.so&utm_medium=buildspace_project)的一些说明进行操作。下面是Mac和Windows。另外，如果您在Windows上使用Linux，请使用Linux命令!

要安装 Anchor，请继续运行：

`cargo install --git https://github.com/project-serum/anchor anchor-cli --locked`

上面的命令可能需要一段时间才能完成，并且可能会要求您更新PATH，照做吧。

继续运行：  

`anchor --version`

如果能显示版本号，恭喜你，你已经可以成功使用Anchor了。

我们还将使用Anchor的npm和Solana Web3 JS模块，运行以下命令安装 --这两个模块将帮助我们的网页App链接到Solana程序。

`npm install @project-serum/anchor @solana/web3.js`


#### 🏃‍♂️创建并运行一个测试程序
好了，我们快接近完成了，哈哈。要完成安装，我们需要做的最后一件事是在本地运行Solana程序，并确保它真正运行起来。

我们先创建一个名为myepicproject的Solana示例项目，依次运行以下两行命令：

        anchor init myepicproject --javascript
        cd myepicproject
#### Windows 用户须知
1、使用WSL2 而不是powershell来运行命令。

2、如果显示`cargo install --git https://github.com/project-serum/anchor avm --locked --force`这个错误，请参考Anchor用户文档。您可能需要安装Linux (WSL)依赖，为此，运行：`
sudo apt-get update && sudo apt-get upgrade && sudo apt-get install -y pkg-config build-essential libudev-dev`

3、如果出现`error: failed to run custom build command for openssl-sys v0.9.71`等错误，请运行：`sudo apt install libssl-dev`

4、安装完这些依赖，步骤2中的命令应该就可以正常运行了。

5、现在使用avm设置Anchor最新版本后，就可以继续了!

运行anchor init命令将为我们创建一系列文件/文件夹。在某种程度上有点像create-react-app，我们即将检索它创建的所有内容。

如果您在本地运行项目并且没有安装yarn，`anchor init`命令将会失效。要解决这个问题，您可以通过运行`npm install --global yarn`来安装yarn 。

#### 🔑创建本地密钥对
接下来我们需要做的是生成一个真实的本地 Solana 钱包。不要担心助记词的创建，当它运行时，你只需按下“Enter”键。

输入：`solana-keygen new`

这将创建一个本地Solana密钥对——它有点像我们的本地钱包，我们将使用它通过命令行与程序通信。如果你运行solana config get，会显示一个叫Keypair Path的数据行。这就是钱包被创建的地方，请随意查看:)。

如果运行`solana address`，将会显示我们刚才创建的本地钱包地址。

#### 🥳启动我们的程序
当我们在前述步骤运行`ancho init`命令时，就已经创建了一个最基本的Solana程序。现在我们要做的是:

1、编译代码

2、运行`solana-test-validator`命令启动Solana测试节点，并使用我们的钱包将该程序部署到Solana本地网络。这有点像在我们的本地服务器部署代码。

3、真实调用部署程序上的函数。这有点像在我们的服务器上点击一个特定的路由来测试它是否工作。

在这里得夸赞一下Anchor，是它让我们只差最后一行命令就能使得整个程序跑起来。
_注意:请确保您没有在其他任何运行`solana-test-validator`，它会与Anchor产生冲突。这个问题困扰了我很长一段时间才得意想明白，哈哈。_

运行：`anchor test`

第一次运行这行命令可能需要一段时间，耐心等待！当最终在数据行底部显示“1 passing”的绿色单词，说明你已经全部搭建成功了，你可以开始后续的课程了了!如果你在这里遇到任何问题，请在Discord中告诉我们。
![](https://i.imgur.com/V35KchA.png)

**注意:如果您显示`node: --dns-result-order= is not allowed in NODE_OPTIONS`这样的消息，这意味着你当前node版本太低，从技术理论上来看，你没有运行成功。因为我是用的Node v16.13.0测试的，所以我强烈建议您升级到这个版本。升级node是一个繁琐的过程，但是希望你能学到更多知识。我喜欢用nvm。**

**注意:如果您显示`Error: Your configured rpc port: 8899 is already in use`这样的错误，并且您没有正在监听端口8899的应用程序，请尝试运行`solana-test-validator`，并在下一条终端命令中运行：`anchor test --skip-local-validator`，它应该能就能生效。**

现在，恭喜你成功搭建了Solana环境:)。这是一段漫长而艰难的旅程，但我们拿下了。

#### 🚨 进度证明提交
_请一定要提交证明，否则Farza 会伤心的😭

这真是太难了!!绝对是最困难的安装之一。

在`#progress`频道发布你正在进行的测试截图，这样大家就知道你完成了测试🤪。

#### 📝您的提交































