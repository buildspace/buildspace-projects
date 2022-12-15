### 💚 从网站页铸造NFT

真棒。我们已经做到成功构建了我们的网站，部署了我们的合同，并已经连接了我们的钱包。 **现在，我们需要使用从 Metamask 获取的访问凭据，在网页dapp中**调用我们的合约！

所以，请记住，我们的合约具有 `makeAnEpicNFT` 函数，它的功能实际上是铸造 NFT。 我们现在需要从我们的网页dapp中调用此函数，继续在 `connectWallet` 函数下方添加以下函数。
```javascript
const askContractToMintNft = async () => {
  const CONTRACT_ADDRESS = "INSERT_YOUR_DEPLOYED_GOERLI_CONTRACT_ADDRESS";

  try {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

      console.log("Going to pop wallet now to pay gas...")
      let nftTxn = await connectedContract.makeAnEpicNFT();

      console.log("Mining...please wait.")
      await nftTxn.wait();
      
      console.log(`Mined, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`);

    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error)
  }
}
```

这会弹出一些错误。不用担心！我们稍后会修复它，让我们逐步完成代码。
```javascript
const provider = new ethers.providers.Web3Provider(ethereum);
const signer = provider.getSigner();
```
`ethers` 是一个帮助我们的前端与我们的合约对话的库。 
在码最顶部写入 `import { ethers } from "ethers";`，确保将 `ethers` 库导入。

`Provider` 是我们用来与以太坊节点进行通信的工具。还记得我们是如何使用QuickNode**部署**的吗？在本例中，我们使用Metamask在后台提供的节点来发送/接收自已部署合约的数据。

[这里](https://docs.ethers.io/v5/api/signer/#signers) 是解释第 2 行签名者是什么的链接。

```javascript
const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);
```
我们稍后会介绍以上代码。只需知道这行代码实际上是**创建与我们合约的连接**。它需要：合约地址，一个叫做 `abi` 文件，和一个 `signer`。 这是我们始终需要与区块链上的合约进行通信的三个必要因素。

请注意我是如何硬编码 `const CONTRACT_ADDRESS` 的？ **请务必将此变量更改为您最新部署的合约的部署合约地址**。如果您忘记或丢失了它，请不要担心，只需重新部署合约并获得一个新的合约地址 :)。

```javascript
console.log("Going to pop wallet now to pay gas...")
let nftTxn = await connectedContract.makeAnEpicNFT();

console.log("Mining...please wait.")
await nftTxn.wait();

console.log(`Mined, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`);
```

其余代码应该已经有效了。它看起来有点像我们部署的代码:)！ 我们使用 `makeAnEpicNFT` 调用我们的合约，等待它被矿工挖掘，然后链接 Etherscan URL！

最后，我们要在有人单击“Mint NFT”按钮时调用此函数。
```javascript
return (
  {currentAccount === "" 
    ? renderNotConnectedContainer()
    : (
      /** Add askContractToMintNft Action for the onClick event **/
      <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
        Mint NFT
      </button>
    )
  }
);
```
### 📂 ABI文件

**在这里我制作了一个小视频来解释 ABI 文件。 请等一下，让我们要复习一些重要的东西。**
[LOOM](https://www.loom.com/share/2d493d687e5e4172ba9d47eeede64a37)

所以，当你编译你的智能合约时，编译器会导出一堆你需要的文件，让你与合约交互。您可以在位于Solidity项目根目录下的 `artifacts` 文件夹中找到这些文件。

ABI 文件是我们的dapp需要知道如何与我们的合约进行通信的文件。 [此处](https://docs.soliditylang.org/en/v0.8.14/abi-spec.html) 可以了解相关信息。

ABI 文件的内容可以在您的 hardhat 项目中的一个神奇的 JSON 文件中找到：
`artifacts/contracts/MyEpicNFT.sol/MyEpicNFT.json`

那么，问题就变成了我们如何将这个 JSON 文件放入我们的前端？只需要复制粘贴。

复制 `MyEpicNFT.json` 中的内容，然后转到您的dapp。 您将在 `src` 下创建一个名为 `utils` 的新文件夹。在 `utils` 下创建一个名为 `MyEpicNFT.json` 的文件。所以完整的路径看起来是：`src/utils/MyEpicNFT.json`

将 ABI 文件内容粘贴到我们的新文件中。

现在您已经准备好包含所有的 ABI 内容文件，是时候将它导入到您的 `App.js` 文件中了。应该这样导入：
```javascript
import myEpicNft from './utils/MyEpicNFT.json';
```

所有的代码都已经写完。应该不会再有错误了！你准备好铸造一些 NFT 了！

从这里你需要做的就是点击“Mint NFT”，支付gas（使用你的测试网 ETH），等待交易被开采，然后BOOM！ 您的 NFT 应该立即或在最大 5-15 分钟内在 OpenSea 上显示。

您可能会问自己 gas 是什么。我不打算在这里回答。 但是，您可以在 [此处](https://ethereum.org/en/developers/docs/gas/) 获取相关信息。

### 🤩 测试

您现在应该可以直接从您的网站上开始铸造真正的 NFT。 **走吧！！！ 这就是 EPICCCCC。** 这基本上就是所有这些 NFT 铸造网站的工作方式了，而现在你也会了:)。

实际上，我已经在上面链接的 ABI 视频中完成并测试了整个过程。 一定要看一看！当您**更改**您的合约时，我会讨论一些关于该怎么做的重要事情。 因为你的合约是永久的，改变合约需要你重新部署，更新你前端的地址，最后更新前端的 ABI 文件。

### ✈️ 关于合约重新部署的说明

假设你想改变你的合约。你需要做三件事:
1. 我们需要再次部署它。
2. 我们需要更新我们前端的合约地址。
3. 我们需要更新前端的abi文件。

**人们在更改合约时经常忘记执行这3个步骤。别忘了lol。**

为什么我们需要做这些？这是因为智能合约是不可变的。他们不可更改，它们是永久的。这意味着更改合约需要完全重新部署。这也将**重置**所有变量，因为它将被视为一个全新的合同**这意味着如果我们想更新合约的代码，我们将丢失所有的NFT数据**

### 🚨进证明提交

发布一张你铸造 NFT 后的控制台截图。






