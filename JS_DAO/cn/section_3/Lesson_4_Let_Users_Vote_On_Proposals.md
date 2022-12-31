### 📜 创建两个 DAO 的提案

Cool !!! 一切都准备就绪，现在，我们只需要创建我们的第一个提案！ 前往 `10-create-vote-proposals.js` 并添加以下内容：

```jsx
import sdk from "./1-initialize-sdk.js";
import { ethers } from "ethers";

(async () => {
  try {
    // This is our governance contract.
    const vote = await sdk.getContract("INSERT_VOTE_ADDRESS", "vote");
    // This is our ERC-20 contract.
    const token = await sdk.getContract("INSERT_TOKEN_ADDRESS", "token");
    // Create proposal to mint 420,000 new token to the treasury.
    const amount = 420_000;
    const description = "Should the DAO mint an additional " + amount + " tokens into the treasury?";
    const executions = [
      {
        // Our token contract that actually executes the mint.
        toAddress: token.getAddress(),
        // Our nativeToken is ETH. nativeTokenValue is the amount of ETH we want
        // to send in this proposal. In this case, we're sending 0 ETH.
        // We're just minting new tokens to the treasury. So, set to 0.
        nativeTokenValue: 0,
        // We're doing a mint! And, we're minting to the vote, which is
        // acting as our treasury.
        // in this case, we need to use ethers.js to convert the amount
        // to the correct format. This is because the amount it requires is in wei.
        transactionData: token.encoder.encode(
          "mintTo", [
          vote.getAddress(),
          ethers.utils.parseUnits(amount.toString(), 18),
        ]
        ),
      }
    ];

    await vote.propose(description, executions);

    console.log("✅ Successfully created proposal to mint tokens");
  } catch (error) {
    console.error("failed to create first proposal", error);
    process.exit(1);
  }

  try {
    // This is our governance contract.
    const vote = await sdk.getContract("INSERT_VOTE_ADDRESS", "vote");
    // This is our ERC-20 contract.
    const token = await sdk.getContract("INSERT_TOKEN_ADDRESS", "token");
    // Create proposal to transfer ourselves 6,900 tokens for being awesome.
    const amount = 6_900;
    const description = "Should the DAO transfer " + amount + " tokens from the treasury to " +
      process.env.WALLET_ADDRESS + " for being awesome?";
    const executions = [
      {
        // Again, we're sending ourselves 0 ETH. Just sending our own token.
        nativeTokenValue: 0,
        transactionData: token.encoder.encode(
          // We're doing a transfer from the treasury to our wallet.
          "transfer",
          [
            process.env.WALLET_ADDRESS,
            ethers.utils.parseUnits(amount.toString(), 18),
          ]
        ),
        toAddress: token.getAddress(),
      },
    ];

    await vote.propose(description, executions);

    console.log(
      "✅ Successfully created proposal to reward ourselves from the treasury, let's hope people vote for it!"
    );
  } catch (error) {
    console.error("failed to create second proposal", error);
  }
})();
```

乍一看代码很多。 让我们来逐行阅读！ 我们实际上正在创建两个新提案以供成员投票：

**1) 我们正在创建一个提案，允许财政部铸造 420,000 个新代币。** 您可以看到我们在代码中添加了一个 `“mint”`。

也许国库所剩无几，我们想要更多的代币来奖励会员。 请记住，早些时候我们赋予了我们的投票合约铸造新代币的能力——所以这是可行的！ 这是一个民主的财政部。 如果您的成员认为这个提议很愚蠢并投反对票，这根本不会通过！

**2) 我们正在创建另一个提案，将 6,900 代币从国库转移到我们的钱包。** 你可以看到我们在代码中做了一个`"transfer"`。

也许我们做了好事并希望得到回报！ 在现实世界中，您通常会创建提案来向其他人发送代币。 例如，也许有人帮助为 DAO 编写了一个新网站并希望因此获得奖励。 我们可以给他们发送代币！

顺便说一句，我想对 `nativeTokenValue` 做个说明。 假设我们想提议，“我们想用 2500个 治理代币和 0.1 ETH 奖励 NarutoFangirl27 以帮助我们进行营销”。 这真的很酷！ 这意味着您可以同时使用 ETH 和治理代币奖励人们——两全其美。 *注意：如果我们想发送 ETH，那 0.1 ETH 就需要在我们的金库中！*


当运行 `node scripts/10-create-vote-proposals.js` 时，将输出：

```plaintext
buildspace-dao-starter % node scripts/10-create-vote-proposals.js
👋 SDK initialized by address: 0xF11D6862e655b5F4e8f62E00471261D2f9c7E380
✅ Successfully created proposal to mint tokens
✅ Successfully created proposal to reward ourselves from the treasury, let's hope people vote for it!

```

BOOM。 这是我们的建议， 我们要做的最后一件事实际上是让用户现在从我们的 DAO 仪表板对提案进行投票！

注意：如果您设置了 `proposal_token_threshold` > 0 - 代码可能会抛出错误。 您必须将您的代币委托给
投票合约（在相关网络上）以使其在部署提案之前工作。

### ✍️ 让用户对提案进行投票

最后，让我们一次性来完成。 现在，我们的提案基于我们的智能合约。 但是，我们希望用户能够轻松地看到它们并投票！ 前往`App.jsx`。

在 `token` 下添加以下内容：

```jsx
const { contract: vote } = useContract("INSERT_VOTE_ADDRESS", "vote");
```

我们的 dapp 需要访问 `vote`，以便用户可以与该合约进行交互。

从这里开始，让我们在 `shortenAddress` 函数下面的某处添加以下内容：

```jsx
const [proposals, setProposals] = useState([]);
const [isVoting, setIsVoting] = useState(false);
const [hasVoted, setHasVoted] = useState(false);

// Retrieve all our existing proposals from the contract.
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }

  // A simple call to vote.getAll() to grab the proposals.
  const getAllProposals = async () => {
    try {
      const proposals = await vote.getAll();
      setProposals(proposals);
      console.log("🌈 Proposals:", proposals);
    } catch (error) {
      console.log("failed to get proposals", error);
    }
  };
  getAllProposals();
}, [hasClaimedNFT, vote]);

// We also need to check if the user already voted.
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }

  // If we haven't finished retrieving the proposals from the useEffect above
  // then we can't check if the user voted yet!
  if (!proposals.length) {
    return;
  }

  const checkIfUserHasVoted = async () => {
    try {
      const hasVoted = await vote.hasVoted(proposals[0].proposalId, address);
      setHasVoted(hasVoted);
      if (hasVoted) {
        console.log("🥵 User has already voted");
      } else {
        console.log("🙂 User has not voted yet");
      }
    } catch (error) {
      console.error("Failed to check if wallet has voted", error);
    }
  };
  checkIfUserHasVoted();

}, [hasClaimedNFT, proposals, address, vote]);
```

所以，在这里只需做两件事！

在第一个 `useEffect` 中，我们正在执行 `vote.getAll()` 以获取我们治理合约中存在的所有提案，然后执行 `setProposals` 以便我们稍后可以呈现它们。

在第二个 `useEffect` 中，我们正在做 `vote.hasVoted(proposals[0].proposalId, address)` 以检查这个地址是否已经对第一个提案投票。 如果有，那么我们就做 `setHasVoted` 这样用户就不能再投票了！ 即使我们没有这个，如果用户试图重复投票，我们的合约也会拒绝！

thirdweb 的神奇之处在于，它不仅让部署智能合约变得非常容易，而且还让我们的客户端通过简单的函数（如 `vote.getAll()` ）与它们进行交互变得非常容易！

继续并刷新您的页面，您应该会看到在 🌈 旁边输出您的建议，并且您可以检索所有数据！

![无标题](https://i.imgur.com/tNhXvHY.png)

如果你已经投票，你会看到类似下图所示的东西：

![无标题](https://i.imgur.com/zOQ6Rim.png)

下一段代码相当庞大，哈哈。它实际处理了我们刚刚在这里检索到的提案，这样用户可以有三个投票选项:

1) For （同意）

2) Against（反对）

3) Abstain（弃权）

如果你熟悉 React/JS，你可以很容易地浏览它并弄清楚它是如何工作的。如果你不是很了解React/JS，也不用担心。复制粘贴就可以了。没有什么不好意思的!

在现有模块之后添加零地址导入：

```jsx
import { AddressZero } from "@ethersproject/constants";
```

继续，用 [此处](https://github.com/buildspace/buildspace-dao-final/blob/main/src/App.jsx#L184) 代码替换 `if (hasClaimedNFT) { }` 的内容 .

当你检查你的 dapp 时，你会看到类似下图所示的内容：

![无标题](https://i.imgur.com/Q5bzFWb.png)

非常棒。 您现在可以真正使用这些按钮进行投票。

我们将治理合约设置为在 24 小时后停止投票。 这意味着 24 小时后，如果：

```plaintext
votes "for" proposal > votes "against" proposal
```

任何成员都可以通过我们的治理合约执行提案， 当然提案不能自动执行。 但是，一旦提案通过，DAO 的**任何成员**都可以触发已接受的提案。

例如。 假设我们正在处理要铸造额外 420,000 个代币的提案。 如果`投票“for”提案 > 投票“against”提案`——那么任何人都可以触发提案并且我们的合约将铸造代币。 有点狂野，对吧？ 除了区块链，我们不必相信任何人。

想象一下在一个腐败的国家，为某事投票，然后你的政府对你撒谎说“嘿，实际上我们没有得到足够的选票 jk”，而你真的做了哈哈。 或者，想象他们说，“好吧，我们得到了足够多的选票，我们会做到我们承诺的”，但永远不会！

在这种情况下，一切都已编码，代码不会撒谎。

无论如何，现在不是讨论 DAO 如何可能改善我们政府的时候；）。 我们必须在此时此地完成我们的 meme DAO！ 很接近了。

### 🚨 进度报告

*请一定记得报告，否则 Farza 会很难过的 :(.*

在 `#progress`频道 中分享您的 DAO 仪表板的屏幕截图，并展示您的成员列表和投票系统！







