是时候制作我们应用程序中最神奇的部分了 - 铸造按钮！

这就是您意识到 Flow 架构有多么方便的地方。 还记得您的交易和脚本吗？ 您也可以在前端使用它们！ 我在 Cadence 文件夹中包含了常见的事务和脚本。 现在我们只需要其中两个，其中一个您之前使用过🤯

🚨**更新公告**🚨

你需要进入脚本文件并在所有地方更新账户地址+合约名称！ 我将名称保留为“BottomShot”，以防您懒惰并且实际上没有更改合同名称。 如果您不更改地址或名称，您的 mint 函数可能会出错 哈哈

回到你的 `App.js`，让我们开始构建一个 `mint` 函数。

首先导入我们之前编写的`mintNFT` 交易和我包含的帮助程序`getTotalSupply`脚本：
```
#App.js
import { mintNFT } from "./cadence/transactions/mintNFT_tx";
import { getTotalSupply } from "./cadence/scripts/getTotalSupply_script";
```



在身份验证功能之后，添加此 mint 功能：
```js
  const mint = async() => {

    let _totalSupply;
    try {
      _totalSupply = await fcl.query({
        cadence: `${getTotalSupply}`
      })
    } catch(err) {console.log(err)}
    
    const _id = parseInt(_totalSupply) + 1;
    
    try {
      const transactionId = await fcl.mutate({
        cadence: `${mintNFT}`,
        args: (arg, t) => [
          arg(user.addr, types.Address), //address to which the NFT should be minted
          arg("CatMoji # "+_id.toString(), types.String), // Name
          arg("Cat emojis on the blockchain", types.String), // Description
          arg("ipfs://bafybeigmeykxsur4ya2p3nw6r7hz2kp3r2clhvzwiqaashhz5efhewkkgu/"+_id+".png", types.String),
        ],
        proposer: fcl.currentUser,
        payer: fcl.currentUser,
        limit: 99
      })
      console.log("Minting NFT now with transaction ID", transactionId);
      const transaction = await fcl.tx(transactionId).onceSealed();
      console.log("Testnet explorer link:", `https://testnet.flowscan.org/transaction/${transactionId}`);
      console.log(transaction);
      alert("NFT minted successfully!")
    } catch (error) {
      console.log(error);
      alert("Error minting NFT, please check the console for error details!")
    }
  }
```



不用害怕一下子理解不了。 让我们一步一步地分解它！

```
    let _totalSupply;
    try {
      _totalSupply = await fcl.query({
        cadence: `${getTotalSupply}`
      })
    } catch(err) {console.log(err)}
    
    const _id = parseInt(_totalSupply) + 1;
```


我们做的第一件事是使用 getTotalSupply 脚本获取铸造的 NFT 总数。 我们用这个数字+1作为下一个NFT的ID。 这里的新事物是`fcl.query`函数调用。 FCL 让我们运行脚本来从区块链中获取我们想要的*任何*数据。 这是非常有用的，因为您可以只使用其他人编写的脚本来获取您需要的东西！ 我们在这里传递了一个完整的节奏文件。 请随意查看 `/cadence/scripts/getTotalSupply_script.js` 看看它长什么样。

紧随其后，我们有了函数的核心，即`mint`交易：
```
const transactionId = await fcl.mutate({
  cadence: `${mintNFT}`,
  args: (arg, t) => [
    arg(user.addr, types.Address), //address to which the NFT should be minted (connected wallet)
    arg("CatMoji # "+_id.toString(), types.String), // Name
    arg("Cat emojis on the blockchain", types.String), // Description
    arg("ipfs://bafybeigmeykxsur4ya2p3nw6r7hz2kp3r2clhvzwiqaashhz5efhewkkgu/"+_id+".png", types.String),
  ],
  proposer: fcl.currentUser,
  payer: fcl.currentUser,
  limit: 99
})
```


其中一些内容现在对您来说可能没有意义，但这没关系。 让我快速解释一下这里的内容。 我们以前用过这个事务，只是在不同的地方！

此块使用 FCL 创建一个`mutate`请求。 “Mutate”就是改变的意思，这只是一个写请求！ 我们在这里传递了 5 个参数：
- `cadence`：这是我们编写的用于在本地铸造 NFT 的铸币交易。 它告诉区块链要更改的内容。
- `args`：这些只是交易的参数。 这是我们传递 NFT 名称和媒体链接等详细信息的地方。 我正在使用 `_id` 字段来遍历上传的 NFT！
- `proposer`：发送交易的账户
- `payer`：为本次交易支付gas费（计算费）的账户
- `limit`：此交易的计算限制。

还记得我们导入的名为`@onflow/types`的库吗？ 这里我们用它来告诉 FCL 预期的 Flow 数据类型是什么，以便它可以进行转换（例如，从字符串到地址）。 `args` 值的语法很奇怪。 为了使我们的 Cadence 事务正常工作——它需要一种非常特定的格式。 我们将我们的 JS 类型转换为 `args` 的实际值，以一种 Flow 不会生我们的气的方式格式化我们的数据:)

`(arg, t)`中的`arg`是一个函数，它接受两个变量——第一个是流交易中需要传递的参数的值，第二个是数据类型。

您可以在 [此处](https://docs.onflow.org/fcl/reference/api/#mutate) 阅读更多关于变异的信息，在 [此处](https://docs.onflow.org/fcl) /reference/api/#argumentfunction) 和交易签名者 [此处](https://docs.onflow.org/concepts/transaction-signing)。

这里的所有都是它的！

```
console.log("Minting NFT now with transaction ID", transactionId);
const transaction = await fcl.tx(transactionId).onceSealed();
console.log("Testnet explorer link:", `https://testnet.flowscan.org/transaction/${transactionId}`);
console.log(transaction);
alert("NFT minted successfully!")
```



最后我们只是在链上密封后注销测试网浏览器和交易对象，确保铸币成功！

为这个新按钮创建一个渲染函数：
```js
  const RenderMintButton = () => {
    return (
      <div>
        <button className="cta-button button-glow" onClick={() => mint()}>
          Mint
        </button>
      </div>
    );
  }
```



最后一点，更新你的 JSX 以使用 mint 按钮：
```jsx
{user && user.addr ? <RenderMintButton /> : <RenderLogin />}
```



尝试一下并检查您的控制台。 我会`await`结果，哈哈。

您应该会在浏览器控制台中看到一堆打印输出，包括指向名为 Flowscan 的 Flow 测试网区块链扫描器的链接。 点击这个链接！
![](https://hackmd.io/_uploads/ByCIFffq5.png)



您可以在真实网络上看到NFT正在转入您的账户！
![](https://hackmd.io/_uploads/ByYOtR-59.png)



🎉 **恭喜！** 🎉 您刚刚在 Flow 区块链上创建了一个 NFT！！！

这是一个大问题。 你写了合同。 你部署了它。 你构建了 React 应用程序。 你谈到了你的合同。 你做了所有这些。 以您积累这些技能的方式称自己为全栈开发人员！

### 🚨进度报告🚨
Huuuuuuuuuuuuuuuu 一个巨大的里程碑。 炫耀一下！ 在 Flowscan 上的#progress 中发布铸造交易链接。