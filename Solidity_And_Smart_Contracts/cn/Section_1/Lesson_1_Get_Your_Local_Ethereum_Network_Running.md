✅ 设置你的环境，开始在区块链上工作
---------------------------------------------------

在做任何事情之前，我们需要让我们的本地Ethereum网络工作。这样我们才能编译和测试我们的智能合约代码! 你知道你需要启动一个本地环境来进行工作吗？这里也一样!

现在，你所需要知道的是，智能合约是一段生活在区块链上的代码。区块链是一个公共场所，任何人都可以安全地读取和写入数据，并收取费用。想想看，它有点像AWS或Heroku，只是没有人真正拥有它

所以在这种情况下，我们希望人们能够👋我们。这里的大背景是：

1\. **我们要写一个智能合约。** 该合约有所有围绕如何处理👋的逻辑。这就像你的服务器代码。

2\. **我们的智能合约将被部署到区块链上。** 这样，世界上任何一个人都可以访问和运行我们的智能合约（如果我们允许他们这么做）。所以，很像一个服务器:)。

3\. **我们要建立一个客户端网站**，让人们轻松地与我们在区块链上的智能合约互动。

我会根据需要深入解释某些事情（例如，挖矿是如何进行的，智能合约是如何编译和运行的，等等），*但现在我们只关注让东西运行*。 

如果你在这里有任何问题，只需要在Discord的`#section-1-help`中留言就可以了。 

✨ Hardhat的魅力
----------------------

1\. 我们将经常使用一个叫Hardhat的工具。这将让我们轻松地启动一个本地以太坊网络，并给我们提供假的测试ETH和假的测试账户来工作。记住，这就像一个本地服务器，除了 "服务器 "是区块链。

2\. 快速编译智能合约，并在我们的本地区块链上测试它们。

首先，您需要获取 Node/NPM。 如果没有，请前往 [此处](https://hardhat.org/tutorial/setting-up-the-environment.html)。

我们建议使用当前的 LTS Node.js 版本运行 Hardhat，否则您可能会遇到一些问题！ 您可以在 [此处](https://nodejs.org/en/about/releases/) 找到当前版本。 **确保您的 NodeJs 版本正确，否则您会遇到问题！**我们现在推荐版本 16。

接下来，让我们前往(CMD)终端（Git Bash 将无法运行）。 继续并 cd 到你想要工作的目录。一旦你在那里运行这些命令：

```bash
mkdir my-wave-portal
cd my-wave-portal
npm init -y
npm install --save-dev hardhat
```


👏 获取样本项目
---------------------------

酷，现在我们应该有Hardhat了。让我们启动一个示例项目。

运行。

```bash
npx hardhat
```

*注意：如果你在安装 npm 的同时安装了 yarn，你可能会收到诸如 `npm ERR! could not determine executable to run`。 在这种情况下，您可以执行 `yarn add hardhat`。* 

选择**Create a JavaScript project**的选项。对一切都选择yes。
<img width="571" alt="Screen Shot 2022-06-10 at 22 51 21" src="https://i.imgur.com/j1e8vJT.png">

这个样本项目会要求你安装hardhat-waffle和hardhat-ethers。这些是我们以后会用到的其他好东西:)。

继续安装这些其他依赖项，以防它没有自动完成。
```bash
npm install --save-dev chai @nomiclabs/hardhat-ethers ethers @nomicfoundation/hardhat-toolbox @nomicfoundation/hardhat-chai-matchers
```

你的`hardhat.config.js` 文件应该看起来是这样.
```javascript
require("@nomicfoundation/hardhat-toolbox");

// 这是一个hardhat的项目示例。可以到下面网站去学习创建你自己的项目。
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

// 您需要导出一个对象来设置您的配置
// 到 https://hardhat.org/config/ 学习更多内容

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    solidity: "0.8.17",
};
```

最后，运行`npx hardhat accounts`，这应该会打印出一堆字符串，看起来像这样。

```
0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
0x70997970C51812dc3A010C7d01b50e0d17dc79C8
0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
0x90F79bf6EB2c4f870365E785982E1f101E93b906
0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65
0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc
0x976EA74026E726554dB657fA54763abd0C3a0aa9
0x14dC79964da2C08b23698B3D3cc7Ca32193d9955
0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f
0xa0Ee7A142d267C1f36714E4a8F75612F20a79720
0xBcd4042DE499D14e55001CcbB24a551F3b954096
0x71bE63f3384f5fb98995898A86B02Fb2426c5788
0xFABB0ac9d68B0B445fB7357272Ff202C5651694a
0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec
0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097
0xcd3B766CCDd6AE721141F452C550Ca635964ce71
0x2546BcD3c84621e976D8185a91A922aE77ECEc30
0xbDA5747bFD65F08deb54cb465eB87D40e51B197E
0xdD2FD4581271e230360230F9337D5c0430Bf44C0
0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199
```

这些是Hardhat为我们生成的Ethereum地址，用于模拟区块链上的真实用户。在项目后期，当我们想模拟用户👋在我们身边时，这将对我们有很大的帮助!

🌟 运行它
---------

为了确保一切正常，运行。

```bash
 npx hardhat compile
```
然后运行。

```bash
npx hardhat test
```

你应该看到像这样的东西。

![](https://i.imgur.com/OI9YKaU.png)

让我们做一个小小的清理。

继续，现在在您最喜欢的代码编辑器中打开项目的代码。 我最喜欢 VSCode！ 我们想删除为我们生成的所有蹩脚的启动代码。 我们不需要这些。 我们是专业人士 ;)！

继续并删除 `test` 下的文件 `Lock.js`。 另外，删除 `scripts` 下的 `deploy.js`。 然后，删除 `contracts` 下的 `Lock.sol`文件。是删文件，不是删除文件夹！

🚨 在你点击 "下一课 "之前
-------------------------------------------

*注意：如果你不这样做，Farza会很伤心的：(.*)

前往#progress，并发布一张**你的**终端的截图，显示测试的输出结果! 你刚刚运行了一个智能合约，这可是件大事！! 炫耀一下吧:)。

P.S: 如果你**没有访问#progress的权限，请确保你链接了你的Discord，加入Discord[这里](https://discord.gg/buildspace)，在#general里打给我们，我们会帮助你进入正确的频道!
