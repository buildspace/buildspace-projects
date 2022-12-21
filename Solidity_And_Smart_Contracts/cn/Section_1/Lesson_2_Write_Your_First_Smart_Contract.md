👩‍💻 让我们写一个智能合约
----------------------------

太棒了，我们做到了！

我们将直接开始开始项目。

让我们来编写一个智能合约发送 👋 到合约上并记录一共有多少次 # 挥动。因为在你的网站上可能会经常需要统计 # 次数，所以它是非常重要的。可以根据你的实际需要做出适合你的修改。 

在 **`contracts`** 目录下创建一个文件并将其命名为 **`WavePortal.sol`**. 当你在使用  Hardhat 时候，文件的架构至关重要，所以要特别小心！

我们将从每个智能合约开头都需要用到的架构开始。

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract WavePortal {
    constructor() {
        console.log("Yo yo, I am a contract and I am smart");
    }
}
```

注：如果你想方便语法高亮，可以在 [这里](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity) 下载 VS Code 的 Solidity 插件.

```solidity
// SPDX-License-Identifier: UNLICENSED
```

真是美妙的一刻！它被称为 "SPDX license identifier" ，欢迎随时 Google 一下这是什么：）

```solidity
pragma solidity ^0.8.17;
```

这是我们希望合约使用的 Solidity 编译器的版本。基本意思是 “当运行合约的时候，我只想要使用 0.8.17 版本的 Solidity 编译器，低一点都不行。” 注意，要确保编译器的版本在 `hardhat.config.js` 中是一样的。

```solidity
import "hardhat/console.sol";
```
Hardhat 魔法一般在我们的合约中做了一些控制台日志。实际上，调试智能合约是很有挑战性的，但这正是 Hardhat 带给我们的好东西之一，它使一切变得更加容易。

```solidity
contract WavePortal {
    constructor() {
        console.log("Yo yo, I am a contract and I am smart");
    }
}
```

所以，智能合约有点像其他语言中的 "类"，如果你见过他们的话！"。一旦我们第一次初始化这个合约，这个结构函数就会运行并打印出这一行，请在这一行写上你想要的任何内容:)!

在下一节课，我们将允许它，并看看我们能得到什么！

🚨 在你点击“下一课”之前
-------------------------------------------

*注意：如果你不这样做，Farza会很伤心的 :(.*

请前往 #progress 的 WavePortal.sol 文件里发布一张你优美合约的截图吧:).
