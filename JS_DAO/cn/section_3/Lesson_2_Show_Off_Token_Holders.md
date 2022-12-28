### 🥺 在web dapp 上检索代币持有者

对于我们 DAO 的所有成员来说，很容易看到 DAO 中所有持有代币的人以及他们持有多少代币。要做到这一点，我们需要从客户端调用智能合约并检索数据。

前往 `App.jsx`，然后在 `editionDrop` 下，添加您的 `token` 合约：

```jsx
// Initialize our token contract
const { contract: token } = useContract('INSERT_TOKEN_ADDRESS', 'token');
```

我们需要这个，以便我们可以与 ERC-1155 和 ERC-20 合约进行交互。 我们将从 ERC-1155 中获取所有成员的地址。 从 ERC-20 中，我们将检索每个成员拥有的代币数量。

接下来，在 `const hasClaimedNFT...` 下添加以下代码：

```jsx
// Holds the amount of token each member has in state.
const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
// The array holding all of our members addresses.
const [memberAddresses, setMemberAddresses] = useState([]);

// A fancy function to shorten someones wallet address, no need to show the whole thing.
const shortenAddress = (str) => {
  return str.substring(0, 6) + '...' + str.substring(str.length - 4);
};

// This useEffect grabs all the addresses of our members holding our NFT.
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }

  // Just like we did in the 7-airdrop-token.js file! Grab the users who hold our NFT
  // with tokenId 0.
  const getAllAddresses = async () => {
    try {
      const memberAddresses = await editionDrop?.history.getAllClaimerAddresses(
        0,
      );
      setMemberAddresses(memberAddresses);
      console.log('🚀 Members addresses', memberAddresses);
    } catch (error) {
      console.error('failed to get member list', error);
    }
  };
  getAllAddresses();
}, [hasClaimedNFT, editionDrop?.history]);

// This useEffect grabs the # of token each member holds.
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }

  const getAllBalances = async () => {
    try {
      const amounts = await token?.history.getAllHolderBalances();
      setMemberTokenAmounts(amounts);
      console.log('👜 Amounts', amounts);
    } catch (error) {
      console.error('failed to get member balances', error);
    }
  };
  getAllBalances();
}, [hasClaimedNFT, token?.history]);

// Now, we combine the memberAddresses and memberTokenAmounts into a single array
const memberList = useMemo(() => {
  return memberAddresses.map((address) => {
    // We're checking if we are finding the address in the memberTokenAmounts array.
    // If we are, we'll return the amount of token the user has.
    // Otherwise, return 0.
    const member = memberTokenAmounts?.find(({ holder }) => holder === address);

    return {
      address,
      tokenAmount: member?.balance.displayValue || '0',
    };
  });
}, [memberAddresses, memberTokenAmounts]);
```

乍一看好像代码很多！ 但只要知道我们要做的三件事：

1. 我们正在调用 `getAllClaimerAddresses` 以从我们的 ERC-1155 合约中获取持有 NFT 的所有成员的地址。

2. 我们正在调用 `getAllHolderBalances` 以获取在我们的 ERC-20 合约上持有我们代币的每个人的代币余额。

3. 我们将数据合并到 `memberList` 中，这是一个很好的数组，结合了会员的地址和代币余额。 欢迎在 [此处](https://reactjs.org/docs/hooks-reference.html#usememo) 查看 `useMemo` 的作用。 这是 React 中存储计算变量的一种神奇方式。

现在，您可能会问自己，“我们不能只执行 `getAllHolderBalances` 来获取持有我们代币的每个人吗？”。 好吧，基本上，有人可以在我们的 DAO 中不持有代币！ _而且，没关系。_ 所以仍然希望他们出现在列表中。

在我的控制台中，我得到了类似这样的信息，我现在可以成功地从我的两个合约——ERC-20 和我的 ERC-1155 中检索数据。 当然好！！ 随意在这里查看并检查所有数据。

![无标题](https://i.imgur.com/qx8rfRZ.png)

### 🤯 在 DAO 仪表板上呈现成员数据

现在我们已经将所有数据完整地保存在 React dapp 的状态中，让我们渲染它。

**将** `if (hasClaimedNFT) { }` 替换为以下内容：

```jsx
// If the user has already claimed their NFT we want to display the internal DAO page to them
// only DAO members will see this. Render all the members + token amounts.
if (hasClaimedNFT) {
  return (
    <div className="member-page">
      <h1>🍪DAO Member Page</h1>
      <p>Congratulations on being a member</p>
      <div>
        <div>
          <h2>Member List</h2>
          <table className="card">
            <thead>
              <tr>
                <th>Address</th>
                <th>Token Amount</th>
              </tr>
            </thead>
            <tbody>
              {memberList.map((member) => {
                return (
                  <tr key={member.address}>
                    <td>{shortenAddress(member.address)}</td>
                    <td>{member.tokenAmount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
```

So easy！ 我们只是渲染了一个漂亮的小表格，它将在我们的 `memberList` 中展示数据。 查看页面后，您会看到类似下面的屏幕截图！ _注意：居中是关闭的，这是故意的。 我们稍后会添加其他内容！_

![无标题](https://i.imgur.com/HZCHFak.png)

 现在，我们所有的成员都可以在内部的、代币的 DAO 仪表板上看到其他成员。 

### 🚨 进度报告

_请一定记得熬膏，否则 Farza 会很难过的 :(._

在`#progress` 频道中分享 DAO 仪表板的屏幕截图，并展示您当前的成员和他们的代币价值！

