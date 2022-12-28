治理代币的确很酷，但如果人们不能用它来治理任何东西，它就没一点用！ 我们接下来要做的是建立一个治理合约，让人们使用他们的代币对提案进行投票

### 📝 部署治理合约

我不想把这部分太复杂化。

归根结底，投票合约实际上是一种让人们对真实事件进行投票的方式，并自动计算这些选票，然后任何成员都可以在链上执行提案， 所有这些都不涉及任何中心化。

您可能想创建一个提案，例如 *“将 1000 代币转移到 EpicDesign5222 以重新设计我们的首页”。* 谁可以投票？投票持续多长时间？ 某人创建提案所需的最低代币数量是多少？

所有这些问题都在我们创建的初始投票合约中都能找到答案。

这几乎就像你在建立一个小国家，你需要建立你的初始政府+投票系统！

前往 `8-deploy-vote.js` 并添加以下内容：

```jsx
import sdk from "./1-initialize-sdk.js";

(async () => {
  try {
    const voteContractAddress = await sdk.deployer.deployVote({
      // Give your governance contract a name.
      name: "My amazing DAO",

      // This is the location of our governance token, our ERC-20 contract!
      voting_token_address: "INSERT_TOKEN_ADDRESS",

      // These parameters are specified in number of blocks. 
      // Assuming block time of around 13.14 seconds (for Ethereum)

      // After a proposal is created, when can members start voting?
      // For now, we set this to immediately.
      voting_delay_in_blocks: 0,

      // How long do members have to vote on a proposal when it's created?
      // we will set it to 1 day = 6570 blocks
      voting_period_in_blocks: 6570,

      // The minimum % of the total supply that need to vote for
      // the proposal to be valid after the time for the proposal has ended.
      voting_quorum_fraction: 0,

      // What's the minimum # of tokens a user needs to be allowed to create a proposal?
      // I set it to 0. Meaning no tokens are required for a user to be allowed to
      // create a proposal.
      proposal_token_threshold: 0,
    });

    console.log(
      "✅ Successfully deployed vote contract, address:",
      voteContractAddress,
    );
  } catch (err) {
    console.error("Failed to deploy vote contract", err);
  }
})();
```

我们正在使用 `deployer.deployVote` 来设置合约。 这将部署一个全新的投票合约！

注意我们如何给 `voting_token_address` 赋值。 这是我们的合约，它知道要接受哪个治理代币。 我们不希望人们随机尝试使用 $DOGE 来投票，哈哈。

我们有 `voting_delay_in_blocks`，如果你想给人们一些时间以允许他们投票之前检查提案，这会很有用。 同样，我们有`voting_period_in_blocks`，它只是指定一旦提案生效，该投票必须持续多长时间，我们以区块为单位进行投票，这取决于您所在的区块链，可能需要更长的时间，对于以太坊/Goerli，每个区块大概 13 秒左右，所以平均一天有 6570 个区块。

`voting_quorum_fraction` 真很有趣。 假设一个成员创建了一个提案，而其他 **199** DAO 成员正在迪斯尼世界度假并且不在线。 好吧，在这种情况下，如果一个 DAO 成员创建了提案并对自己的提案投了“YES”的投票——这意味着 100% 的选票说“YES”（因为只有一票）并且提案**将在** `voting_period_in_blocks` 启动后获得通过！ 为了避免这种情况，我们设置了一个法定人数，上面写着“为了使提案通过，必须在投票中使用最少 x% 的代币”。

举个例子，我们只做 `voting_quorum_fraction: 0` 这意味着无论投票中使用了多少百分比的代币，提案都会通过。 这意味着如果其他成员正在休假，一个人在技术上可以自己通过一项提案，哈哈。 现在，这很好。 你在现实世界中设置的法定人数取决于你的供应量和你最初空投的数量。

最后，我们有`proposal_token_threshold: "0"`，它允许任何人实际创建提案，即使他们不持有治理代币。 由您决定要将其设置成什么！ 让我们暂时将其保持为零。

继续并运行 `node scripts/8-deploy-vote.js` ， 这是我最终得到的：

```plaintext
buildspace-dao-starter % node scripts/8-deploy-vote.js
👋 SDK initialized by address: 0xF11D6862e655b5F4e8f62E00471261D2f9c7E380
✅ Successfully deployed vote contract, address: 0xE079991f3c26b832C3E8171F512694899E831eDB
```

很酷。 基本上，我们创建并部署了一个新的智能合约，可以让我们实际对链上的提案进行投票。 这是一个标准的[治理](https://docs.openzeppelin.com/contracts/4.x/api/governance) 合约。 您可以在 [此处](https://github.com/thirdweb-dev/contracts/blob/main/contracts/vote/VoteERC20.sol) 查看您部署的确切合约。

如果您前往`https://goerli.etherscan.io/`，您会在那里看到它！

所以，现在我们有了三个合约：我们的 NFT 合约、我们的代币合约和我们的投票合约！ 请务必保存您的投票合约地址，我们稍后会再次使用它。

### 🏦 设置国库

所以现在我们有了我们的治理合约，我们可以对提案进行投票。 但是有一个问题。

**投票合约本身无法转移我们的代币。** 假设我们现在想创建一个提案，例如“向 NarutoLover67 发送 1000 $HOKAGE 给一名杰出的会员”。 这实际上是行不通， *投票合约目前没有token的访问权限*。

为什么？ **因为** **您创建了代币供应。 您的钱包拥有对整个供应量的访问权限。 因此，只有您有权访问供应、移动代币、空投等。** 基本上，这是一种独裁统治哈哈。 这就是我们要做的——我们将把所有代币的 90% 转移到投票合约中。 一旦我们的代币被转移到我们的投票合约中，投票合约本身就可以访问供应。

**这实际上将成为我们的“社区金库”。**

这里的 90% 只是我随机选择的一个数字。 在实践中，这取决于你。 例如，ENS 是这样分发它的：

![](https://i.imgur.com/9rhwrzV.png)

他们决定将 50% 的供应分配给他们的社区金库！ 每个 DAO 的代币经济学都非常不同，目前还没有一种“标准”的做事方式。 我非常喜欢 ENS 的做法。 50%在社区，25%空投，另外25%给核心团队+贡献者。

前往 `9-setup-vote.js` 并添加以下内容：

```jsx
import sdk from "./1-initialize-sdk.js";

(async () => {
  try {
    // This is our governance contract.
    const vote = await sdk.getContract("INSERT_VOTE_ADDRESS", "vote");
    // This is our ERC-20 contract.
    const token = await sdk.getContract("INSERT_TOKEN_ADDRESS", "token");
    // Give our treasury the power to mint additional token if needed.
    await token.roles.grant("minter", vote.getAddress());

    console.log(
      "Successfully gave vote contract permissions to act on token contract"
    );
  } catch (error) {
    console.error(
      "failed to grant vote contract permissions on token contract",
      error
    );
    process.exit(1);
  }

  try {
    // This is our governance contract.
    const vote = await sdk.getContract("INSERT_VOTE_ADDRESS", "vote");
    // This is our ERC-20 contract.
    const token = await sdk.getContract("INSERT_TOKEN_ADDRESS", "token");
    // Grab our wallet's token balance, remember -- we hold basically the entire supply right now!
    const ownedTokenBalance = await token.balanceOf(
      process.env.WALLET_ADDRESS
    );

    // Grab 90% of the supply that we hold.
    const ownedAmount = ownedTokenBalance.displayValue;
    const percent90 = Number(ownedAmount) / 100 * 90;

    // Transfer 90% of the supply to our voting contract.
    await token.transfer(
      vote.getAddress(),
      percent90
    ); 

    console.log("✅ Successfully transferred " + percent90 + " tokens to vote contract");
  } catch (err) {
    console.error("failed to transfer tokens to vote contract", err);
  }
})();
```

这里有一个非常简单的脚本！ 我们只需完成两件事：

1. 我们使用 `token.balanceOf` 获取我们钱包中的代币总数。 请记住，现在我们的钱包基本上拥有除了我们空投的代币之外的全部供应量。
2. 我们获取代币的总供应量的 90%，并使用 `token.transfer` 将这 90% 转移到投票模块。 如果你愿意，你可以100% 转让！ 但是，也许您想为自己作为创作者保留一些代币！

完成后，我们可以使用 `node scripts/9-setup-vote.js` 来运行， 这将输出：

```plaintext
buildspace-dao-starter % node scripts/9-setup-vote.js
👋 SDK initialized by address: 0xF11D6862e655b5F4e8f62E00471261D2f9c7E380
✅ Successfully gave vote module permissions to act on token module
✅ Successfully transferred 900000 tokens to vote contract

```

好吧，准备好了吗？ 前往 `https://goerli.etherscan.io/` 上的投票合约。 单击`token`的下拉菜单。 在这里，您会看到我的合约上有“844,527 $HOKAGE”。

当我第一次看到它时，这让我大吃一惊。 *我们真正拥有自己的金库。*

*注意：根据您的供应量和空投量，您的金库中可能是不同的数量。*

![](https://i.imgur.com/4AA5nlb.png)

### 🚨 进度报告

*请一定记得报告，否则 Farza 会很难过的 :(.*

在`#progress` 频道中中分享投票合约上的代币供应在 Etherscan 的截图。 让我们瞧瞧你史诗般的金库！




