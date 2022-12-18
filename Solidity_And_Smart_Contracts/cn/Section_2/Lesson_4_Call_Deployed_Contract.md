📒 通过我们的网站从区块链上阅读
-----------------------------------------------

真棒。我们成功了。我们已经部署了我们的网站和合约并且已经成功连接了钱包。现在我们需要从网站上使用Metamask获得的凭证来实际调用我们的合同。

因此，我们的智能合约有这样的功能，可以检索到wave的总数。

```solidity
  function getTotalWaves() public view returns (uint256) {
      console.log("We have %d total waves!", totalWaves);
      return totalWaves;
  }
```

让我们从我们的网站上调用这个功能:)。

继续写这个函数，就在我们的`connectWallet()`函数下面。

```javascript
const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
}
```

在此快速解释一下：

```javascript
const provider = new ethers.providers.Web3Provider(ethereum);
const signer = provider.getSigner();
```

`ethers` 是一个库，可以帮助我们的前端与我们的合约对话。 确保使用 `import { ethers } from "ethers";` 将其导入到顶部。

“提供者”是我们用来与以太坊节点实际交谈的东西。 还记得我们是如何使用 QuickNode 来**部署**的吗？ 那么在这种情况下，我们使用 Metamask 在后台提供的节点来从我们部署的合约发送/接收数据。

[这里是](https://docs.ethers.io/v5/api/signer/#signers) 解释第 2 行签名者是什么的链接。

通过将 `onClick` 属性从 `null` 更新为 `wave` 将此函数连接到我们的 wave 按钮：

```html
<button className="waveButton" onClick={wave}>
    Wave at Me
</button>
```

太棒了！

所以，现在这段代码**断了**。在我们的replit shell中，它会出现。

![](https://i.imgur.com/JP2rryE.png)

我们需要这两个变量!

那么，你有的合约地址 -- 对吗？还记得你部署合约的时候，我告诉你要保存地址吗？这就是它所要求的!

但是，什么是ABI？早些时候，我提到当你编译一个合同时，它会在`artifacts`下为你创建一堆文件。ABI就是这些文件中的一个。

🏠 设置你的合约地址
-----------------------------
 
还记得你在Goerli Testnet上部署你的合约吗（史诗级的）？那次部署的输出包括你的智能合约地址，看起来应该是这样的。

```
Deploying contracts with the account: 0xF79A3bb8d5b93686c4068E2A97eAeC5fE4843E7D
Account balance: 3198297774605223721
WavePortal address: 0x957fe7381be45A31967F1EcfAc6Ff001D8AF8D6c
```

你需要在你的React应用程序中获得这个访问权。这很简单，只要在你的`App.js`文件中创建一个名为`contractAddress`的新属性，并将其值设置为`WavePortal address`，并在控制台中打印出来。

```javascript
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  /**
   * Create a variable here that holds the contract address after you deploy!
   */
  const contractAddress = "0x957fe7381be45A31967F1EcfAc6Ff001D8AF8D6c";
```

🛠 获取ABI文件内容
---------------------------
看看你，已经下到一半了！ 让我们回到我们的智能合约文件夹。

当你编译你的智能合约时，编译器会吐出一堆让你与合约交互所需的文件。 您可以在 Solidity 项目根目录下的 `artifacts`文件夹中找到这些文件。

ABI 文件是我们的网络应用程序需要知道如何与我们的合约进行通信的文件。 [此处](https://docs.soliditylang.org/en/v0.8.14/abi-spec.html) 了解相关信息。

ABI 文件的内容可以在您的 hardhat 项目中的一个精美的 JSON 文件中找到：

`artifacts/contracts/WavePortal.sol/WavePortal.json`


那么，问题就变成了我们如何将这个 JSON 文件放入我们的前端？ 对于这个项目，我们将做一些不错的旧“复制意大利面”！

复制`WavePortal.json`中的内容，然后转到您的网络应用程序。 您将在 `src` 下创建一个名为 `utils` 的新文件夹。 在`utils`下创建一个名为`WavePortal.json`的文件。 所以完整的路径看起来像：

`src/utils/WavePortal.json`


将整个 JSON 文件粘贴到那里！

现在您已经准备好包含所有 ABI 内容的文件，是时候将其导入您的`App.js`文件并创建对它的引用了。 就在您导入 `App.css`的位置下，继续导入您的 JSON 文件并创建对 abi 内容的引用：


```javascript
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/WavePortal.json";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");

  const contractAddress = "0x957fe7381be45A31967F1EcfAc6Ff001D8AF8D6c";
  /**
   * Create a variable here that references the abi content!
   */
  const contractABI = abi.abi;
```
让我们来看看你究竟在哪里使用这些ABI内容：

```javascript
const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        /*
        * You're using contractABI here
        */
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }
  ```

一旦你添加该文件并点击 "Wave "按钮 -- **你将通过你的网络客户端正式从你的区块链合约中读取数据**。

📝 写入数据
---------------

向我们的合约写数据的代码与读数据没有超级大的区别。主要的区别是，当我们想向合约写入新的数据时，我们需要通知矿工，以便交易可以被开采。当我们读取数据时，我们不需要这样做。读取是 "免费 "的，因为我们所做的只是从区块链上读取，**我们没有改变它。**

下面是wave的代码：

```javascript
const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
        * Execute the actual wave from your smart contract
        */
        const waveTxn = await wavePortalContract.wave();
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }
```

很简单，对吧 :)?

这里最棒的是，当交易被挖出时，你实际上可以打印出交易哈希值，将其复制/粘贴到 [Etherscan](https://rinkeby.etherscan.io/), 并看到它正在被实时处理 :)。

当我们运行这个时，你会看到总波数增加了1。 你还会看到Metamask弹出并要求我们支付 "Gas"，我们用我们的假美元支付。 有一篇关于它的很好的文章[这里](https://ethereum.org/en/developers/docs/gas/). 试着弄清楚什么是Gas:)。

🎉 成功
----------

**碉堡了.**

真是一个好东西！我们现在有一个实际的客户端，可以读取和写入区块链的数据。从这里，你可以做任何你想做的事情。你已经有了基本的东西了。你可以建立一个去中心化的Twitter版本。你可以建立一种方式，让人们发布他们最喜欢的备忘录，并允许人们用ETH给发布最佳备忘录的人 "打赏"。你可以建立一个去中心化的投票系统，一个国家可以用它来投票选举一个政治家，在那里一切都公开而清晰。

可能性确实是无穷无尽的。

🚨 在你点击 "下一课 "之前
-------------------------------------------

*注意：如果你不这样做，Farza会非常伤心。:(.*

将你的网站定制一下，以显示波浪的总数。也许在波浪被开采的时候显示一个加载条，不管你想怎样。做一点不同的事情吧!

一旦你觉得自己准备好了，请在#进展#中与我们分享你的网站链接，这样我们就可以连接我们的钱包并向你挥手:)。

🎁 总结
--------------------

你正在征服去中心化网络的道路上。令人印象深刻的是。通过访问[此链接]，看看你在本节中写的所有代码。 [这个链接](https://gist.github.com/adilanchian/71890bf4fcd8f78e94c77cf694b24659) 用来确保你的代码是正确的!
如果你想要捐赠我们：
0x45ca2696d9a4f762c7a51a22a230797700e28794
这会让我们更有动力。