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
      console.log(error)
    }
}
```

在此快速解释一下：

```javascript
const provider = new ethers.providers.Web3Provider(ethereum);
const signer = provider.getSigner();
```

`ethers` 是一个帮助我们的前端与合同对话的库。请确保在顶部使用 `import { ethers } from "ethers";`.

"提供者"是我们用来与Ethereum节点实际对话的东西。还记得我们是如何使用Alchemy来**部署的吗？那么在这种情况下，我们使用Metamask在后台提供的节点来发送/接收来自我们部署的合约的数据。

[这里的](https://docs.ethers.io/v5/api/signer/#signers) 是在第2行有一个链接，解释什么是签名人。

通过将 "onClick "功能从 "null "更新为 "wave"，将这个函数连接到我们的wave按钮。

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
 
还记得你在Rinkeby Testnet上部署你的合约吗（史诗级的）？那次部署的输出包括你的智能合约地址，看起来应该是这样的。

```
Deploying contracts with the account: 0xF79A3bb8d5b93686c4068E2A97eAeC5fE4843E7D
Account balance: 3198297774605223721
WavePortal address: 0xd5f08a0ae197482FA808cE84E00E97d940dBD26E
```

你需要在你的React应用程序中获得这个访问权。这很简单，只要在你的`App.js`文件中创建一个名为`contractAddress`的新属性，并将其值设置为`WavePortal地址`，并在控制台中打印出来。

```javascript
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  /**
   * Create a variable here that holds the contract address after you deploy!
   */
  const contractAddress = "0xd5f08a0ae197482FA808cE84E00E97d940dBD26E";
```

🛠 获取ABI文件内容
---------------------------
**不如看着我经历这些？看看下面的视频吧！**
[Loom](https://www.loom.com/share/ddecf3caf54848a3a01edd740683ec48)

看看你，已经走了一半的路了! 让我们搬回我们的智能合约文件夹。

当你编译你的智能合约时，编译器会吐出一堆需要的文件，让你与合约互动。你可以在位于你Solidity项目根部的`artifacts`文件夹中找到这些文件。

ABI文件是我们的网络应用需要知道如何与我们的合约沟通的东西。阅读相关内容 [这里](https://docs.soliditylang.org/en/v0.5.3/abi-spec.html).

ABI文件的内容可以在你的hardhat项目中的一个性感的JSON文件中找到。

`artifacts/contracts/WavePortal.sol/WavePortal.json`


那么，问题来了，我们如何把这个JSON文件放到我们的前端？在这个项目中，我们要做一些好的老的 "复制粘贴"!

复制`WavePortal.json`中的内容，然后前往你的网络应用。你将在`src`下建立一个名为`utils`的新文件夹。在`utils`下创建一个名为`WavePortal.json`的文件。因此，完整的路径将看起来像。

`src/utils/WavePortal.json`


将整个JSON文件粘贴在那里！

现在你已经有了包含所有ABI内容的文件，是时候把它导入你的`App.js`文件并创建对它的引用。就在你导入`App.css`的地方，继续导入你的JSON文件并创建对ABI内容的引用。


```javascript
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  
  const contractAddress = "0xd5f08a0ae197482FA808cE84E00E97d940dBD26E";
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
      console.log(error)
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
      console.log(error)
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
