### 🌊 生成OpenSea链接

一件很棒的事情是，在NFT完成后，我们会在OpenSea上看到 NFT 链接，他们可以在Twitter上或与朋友分享!!

OpenSea上的NFT链接如下所示:
`https://testnets.opensea.io/assets/goerli/0x78d1e929cfc5256643b3cc67c50e2d7ec3580842/0`

基本上，这些是变化的。
`https://testnets.opensea.io/assets/goerli/INSERT_CONTRACT_ADDRESS_HERE/INSERT_TOKEN_ID_HERE`

因此，我们的dapp有合约地址，但没有 `Token ID`！ 所以，我们需要修改我们的合约来获取它, 开始吧。

我们将在 Solidity 中使用一种叫 `Event` 的东西。 这些有点像 `webhooks`。 让我们先写出一些代码并让它运行起来！

将此行添加到您使用随机单词创建三个数组的那一行下方！

`event NewEpicNFTMinted(address sender, uint256 tokenId);`

然后，在 makeAnEpicNFT 函数的最底部添加这一行，因此，这是函数的最后一行：

`emit NewEpicNFTMinted(msg.sender, newItemId);`

基本上，Event是我们的智能合约发出的消息，我们可以在客户端实时捕获这些消息。就我们的 NFT 而言，仅仅因为我们的交易被开采**并不意味着该交易会使 NFT 被铸造**。 它可能也会出错！！ 即使它出错了，它仍然会在这个过程中被开采。

这就是为什么我在这里使用Event。 我能够在合约上 `发起`一个Event，然后在前端捕获该Event。 请注意，在我的 `Event`中，我在前端发送了我们需要的 `newItemId`，对吧:)？

同样，它有点像`webhooks`。 但这将是有史以来最容易设置的webhook, lol!

请务必在 [此处](https://docs.soliditylang.org/en/v0.8.17/contracts.html#events) 阅读有关`Event`的更多信息。

和往常一样，当我们改变我们的合约时。

1. 重新部署。
2. 更新`App.js`中的合约地址。
3. 更新网络dapp上的ABI文件。

如果你搞砸了其中的任何一个，将*会*输出错误 :)。

现在在我们的前端，我们添加了这行神奇的代码，我会告诉你把它放在哪里）。

```javascript
connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
	console.log(from, tokenId.toNumber())
	alert(`Hey there! We've minted your NFT. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: <https://testnets.opensea.io/assets/goerli/${CONTRACT_ADDRESS}/${tokenId.toNumber()}>`)
});
```

好了，这是里程碑的大事。 我们将实时捕获铸币事件，获取 tokenId，并为用户提供新铸造 NFT 的 OpenSea 链接。

`App.js` 和合约的代码在 [此处](https://gist.github.com/farzaa/5015532446dfdb267711592107a285a9)。 这真的没什么特别的，只需设置一个event监听器！我确保在我添加的代码行上留下了注释，以便于查看我更改的内容。确保像在我的代码中那样在两个地方添加对 `setupEventListener() ` 的调用！不要错过任何一个:)。

### 🖼 彩色背景!

纯粹是为了好玩，我更改了合约，随机选择了一个彩色的背景。我不打算在这里详细介绍代码，因为它真的只是碗瓢，但请在[这里](https://gist.github.com/farzaa/b3b8ec8aded7e5876b8a1ab786347cc9)查看注释。请记住，如果更改了合约，则需要重新部署、更新 abi 和合约地址。

### 😎 设置 NFT 铸造上限

在此，我建议您更改合约，只允许一组# nft被铸造(例如，也许您希望最多只铸造50个nft !!)。如果在你的网站上写上“迄今为止有4/50个NFT被铸造了”或类似的内容，让你的用户在获得NFT时感到很特别，那就更了不起了!!

提示：你需要一个叫做 `require` 的东西。 而且，您还需要创建一个函数，例如 `getTotalNFTsMintedSoFar` 供您的 Web 应用程序调用。

### ❌ 当用户在错误的网络上时提醒用户

你的网站**只能**在 Goerli 上运行（因为那是你的合约部署的链）。

我们将添加一条善意的提醒来告诉用户！

为此，我们向区块链发出 RPC 请求，以查看我们的钱包连接到的链的 ID。 （为什么是链而不是网络？[问得好！](https://ethereum.stackexchange.com/questions/37533/what-is-a-chainid-in-ethereum-how-is-it-different-than-networkid-and-how-is-it))

我们已经处理了对区块链的请求。我们使用了 `ethereum`、`eth_accounts` 和`eth_requestAccounts` 方法, 现在我们使用 `eth_chainId` 来获取ID。
```javascript
let chainId = await ethereum.request({ method: 'eth_chainId' });
console.log("Connected to chain " + chainId);

// String, hex code of the chainId of the Goerli test network
const goerliChainId = "0x5"; 
if (chainId !== goerliChainId) {
	alert("You are not connected to the Goerli Test Network!");
}
```

在那里，现在用户将知道他们是否在错误的网络!
该请求符合[EIP-695](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-695.md)，因此它返回网络的十六进制值作为字符串。
你可以在[这里](https://docs.metamask.io/guide/ethereum-provider.html#chain-ids) 找到其他网络的id。
 
### 🙉 Mining 动画

你的一些用户可能会非常困惑，当他们点击"Mint"后，什么都没有发生，大约15秒，哈哈!也许添加一个加载动画 ? 让它知道发生了什么! 这里我们就不指导了:)。

### 🐦添加你的Twitter

在底部添加你的Twitter:)!我已经给了你们一个模板。

### 👀 添加一个集合收藏按钮

也许这是最重要的部分！

通常，当人们想看 NFT 收藏时，他们会在 OpenSea 上查看它！！ 这是让人们感受您的收藏的一种超级简单的方式。 因此，如果您将您的网站链接到您的朋友，他们就会知道它是合法的！！

添加一个小按钮，上面写着“🌊 View Collection on OpenSea”，然后当您的用户单击它时，它会链接到您的收藏！ 请记住，每次更改合约时，您的收藏链接都会更改。 因此，请务必链接您的最新和最终收藏。 例如 [这](https://testnets.opensea.io/collection/squarenft-ak8283fv8m) 是我的收藏。

注意：您需要对该链接进行硬编码。 我在顶部留下了一个变量供您填写。它不能动态生成，除非您使用 OpenSea API（现在有点超纲了，哈哈）。

## 🚨 进度证明提交

已经快要结束了:)。 在 `#progress`频道 中发布一张带有直接 OpenSea 链接的弹窗屏幕截图。












