📦 在数组中使用结构体存储消息
-------------------------------------

所以，我们现在有了一个可以与区块链对话的完整的网络应用程序！

现在，如果您还记得，我们希望我们的最终应用成为人们可以向我们挥手并给我们发送消息的地方。我们还想显示我们收到的所有过去的挥手和消息。这就是我们在本课中要做的事情！

所以在课程结束时，我们希望：

1\.让用户连同他们的 wave 一起提交消息。

2\.将该数据以某种方式保存在区块链上。

3\.在我们的网站上显示该数据，以便任何人都可以看到所有向我们挥手致意的人和他们的消息。

查看更新的智能合约代码。我在这里添加了很多注释，以帮助您了解发生了什么变化:)。

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;

    /*
     * 小魔法，试试谷歌一下events在solidity中是什么
     */
    event NewWave(address indexed from, uint256 timestamp, string message);

    /*
     *我创建了一个叫wave的结构体。 
     * 结构体基本上是一种自定义数据类型，我们可以在其中自定义我们想要在其中保存的内容。
     */
    struct Wave {
        address waver; // 向我们招手的用户的地址。
        string message; // 用户发送的信息。
        uint256 timestamp; // 用户招手时的时间戳。
    }

    /*
     * 我声明了一个变量 wave，它可以让我存储一个结构数组
     * 这就是让我能够承受任何人发送给我的所有wave的原因！
     */
    Wave[] waves;

    constructor() {
        console.log("I AM SMART CONTRACT. POG.");
    }

    /*
     * 你会注意到，这里wave函数也有一些改变，You'll notice I changed the wave function a little here as well and
     * 现在他要求我们用户从前端给我们发一些信息
     * 
     */
    function wave(string memory _message) public {
        totalWaves += 1;
        console.log("%s waved w/ message %s", msg.sender, _message);

        /*
         * 我在这里储存wave的数据在数组中。
         */
        waves.push(Wave(msg.sender, _message, block.timestamp));

        /*
         *我在这添加了一些有趣的东西，去谷歌并弄懂他把。
         * 在#general-chill-chat 频道中告诉我们你学到的吧
         */
        emit NewWave(msg.sender, block.timestamp, _message);
    }

    /*
     * 我添加了一个函数 getAllWaves，它将返回结构数组 waves 给我们。
      * 这将使从我们的网站检索wave变得容易！
     */
    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        // Optional: Add this line if you want to see the contract print the value!
        // We'll also print it over in run.js as well.
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }
}
```

🧐 测试
----------

每当我们更改合约时，我们都希望更改 `run.js` 以测试我们添加的新功能。这就是我们知道它以我们想要的方式工作！这是我现在的样子。

这是我更新的 `run.js`。

```javascript
const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();
  console.log("Contract addy:", waveContract.address);

  let waveCount;
  waveCount = await waveContract.getTotalWaves();
  console.log(waveCount.toNumber());

  /**
   * Let's send a few waves!
   */
  let waveTxn = await waveContract.wave("A message!");
  await waveTxn.wait(); // Wait for the transaction to be mined

  const [_, randomPerson] = await hre.ethers.getSigners();
  waveTxn = await waveContract.connect(randomPerson).wave("Another message!");
  await waveTxn.wait(); // Wait for the transaction to be mined

  let allWaves = await waveContract.getAllWaves();
  console.log(allWaves);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
```

这是我在终端中使用 `npx hardhat run scripts/run.js` 运行时得到的结果。

![](https://i.imgur.com/oPKy2dP.png)

非常棒，对吧:)？

该数组看起来有点吓人，但我们可以在单词 `waver`、`message` 和 `timestamp` 旁边看到数据！！它正确地存储了我们的消息`“一条消息”`和`“另一条消息”`:)。

注意：“时间戳”作为“BigNumber”类型返回给我们。我们稍后将学习如何使用它，但只知道这里没有错！

看起来一切正常，让我们转到我们的**前端**，以便我们可以在我们的网站上看到我们所有的wave！

✈️重新部署
------------

所以，既然我们已经更新了我们的合约，我们需要做一些事情：

1\.我们需要重新部署。

2\.我们需要在前端更新合约地址。

3\.我们需要更新前端的 abi 文件。

**人们在更改合约时经常忘记执行这 3 个步骤。别忘了哈哈。**

为什么我们需要做这一切？嗯，这是因为智能合约是**不可变的。**合约不能改变。它们是永久性的。这意味着更改合约需要完全重新部署。这也将**重置**所有变量，因为它会被视为一个全新的合约。 **这意味着如果我们想更新合约的代码，我们会丢失所有的 wave 数据。**

**奖励**：在#general-chill-chat 中，有人可以在这里告诉我一些解决方案吗？我们还能在哪里存储我们的 wave 数据，我们可以在那里更新我们的合约代码并保留我们的原始数据？这里有很多解决方案，让我知道你发现了什么！

所以你现在需要做的是：

1\.使用 `npx hardhat run scripts/deploy.js --network goerli` 再次部署

2\.将`App.js`中的`contractAddress`更改为我们在终端上一步得到的新合约地址，就像我们第一次部署之前所做的一样。

3\.像我们之前所做的那样从 `artifacts` 中获取更新的 abi 文件，然后像我们之前所做的那样将其复制粘贴到 Replit 中。如果您忘记了如何执行此操作，请务必重温课程 [此处](https://app.buildspace.so/courses/CO02cf0f1c-f996-4f50-9669-cf945ca3fb0b/lessons/LE52134606-af90-47ed-9441-980479599350)

**再说一遍——每次更改合约代码时都需要这样做。**

🔌 把这一切都发布给客户
----------------------------------

所以，这是我添加到`App.js` 的新函数。

```javascript
const [currentAccount, setCurrentAccount] = useState("");
  /*
   * All state property to store all waves
   */
  const [allWaves, setAllWaves] = useState([]);
  const contractAddress = "0xd5f08a0ae197482FA808cE84E00E97d940dBD26E";
  
   /*
   * Create a variable here that references the abi content!
   */
  const contractABI = abi.abi;

  /*
   * Create a method that gets all waves from your contract
   */
  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();


        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }
  ```

非常简单，与我们之前所做的工作非常相似，即我们如何连接到提供者、获取签名者以及连接到合约！我在这里通过循环遍历我们所有的 waves 并将它们保存在我们可以稍后使用的数组中来做一个小魔术。如果遇到问题，请随时到 console.log `waves` 看看你会得到什么。

但是，我们在哪里调用这个全新的`getAllWaves()`函数呢？好吧——我们想在我们确定用户有一个带有授权帐户的连接钱包时调用它，因为我们需要一个授权帐户来调用它！提示：你必须在 `checkIfWalletIsConnected()` 的某个地方调用这个函数。我会把它留给你去弄清楚。请记住，当我们确定我们有一个连接+授权的帐户时，我们想调用它！

我做的最后一件事是更新我们的 HTML 代码以呈现数据供我们查看！

```javascript
return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          👋 Hey there!
        </div>

        <div className="bio">
          I am farza and I worked on self-driving cars so that's pretty cool right? Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
  ```

基本上，我只是通过 `allWaves` 并为每一 waves 创建新的 div 并在屏幕上显示该数据。

🙀 啊！！ `wave()` 坏了！
---------------------------

因此，在`App.js` 中，我们的`wave()` 函数不再起作用！ 如果我们尝试挥手，它会给我们一个错误，因为它现在正在期待一条消息立即与它一起发送！ 现在，您可以通过对消息进行硬编码来解决此问题，例如：

```
const waveTxn = await wavePortalContract.wave("这是一条消息")
```

我会把这个留给你：弄清楚如何添加一个文本框，让用户添加他们自己的自定义消息，他们可以发送到 wave 函数:)。

目标？ 您想让您的用户能够使用他们可以输入的文本框向您发送自定义消息！ 或者，也许您希望他们向您发送一个 meme 链接？ 还是 Spotify 链接？ 由你决定！

👷‍♀️ 去构建一个 UI！
--------------------

去把这个东西变成你想要的样子！ 我不会在这里教你太多。 请随时在#section-3-help 中提问！
如果你想要捐赠我们：
0x45ca2696d9a4f762c7a51a22a230797700e28794
这会让我们更有动力。