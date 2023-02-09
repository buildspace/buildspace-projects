

### 📝 更新域记录

我们使我们的域记录在我们的合约中可以更新，但我们还没有在我们的应用程序中构建该功能。 如果我们不能随着时间的推移将其指向不同的事物以与酷孩子一起嬉戏，那么永久域名的意义何在？ 想象一下，您链接到一个非常酷的 YouTube 视频但被删除了，或者您可能有一首新的最喜欢的歌曲？ 我们应该让每个人都更新他们的记录！ 让我们在 App.js 中的 `mintDomain` 函数旁边添加这个函数：
```jsx
const updateDomain = async () => {
  if (!record || !domain) { return }
  setLoading(true);
  console.log("Updating domain", domain, "with record", record);
    try {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);

      let tx = await contract.setRecord(domain, record);
      await tx.wait();
      console.log("Record set https://mumbai.polygonscan.com/tx/"+tx.hash);

      fetchMints();
      setRecord('');
      setDomain('');
    }
    } catch(error) {
      console.log(error);
    }
  setLoading(false);
}
```


这里没有什么新东西，它只是我们的 `mintDomain` 函数的一个较小版本。 你现在是这方面的专家了，所以我希望你能理解这一点呵呵。

要实际调用它，我们必须对我们的 `renderInputForm` 函数进行更多更改以显示 `Set record` 按钮。 我们还将使用有状态变量来检测我们是否处于`editing`模式。 我只是称之为`editing`。 这是代码：
```jsx
  const App = () => {
  // Add a new stateful variable at the start of our component next to all the old ones
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  
  // Here's the updated renderInputForm function (do not make a new one)
  const renderInputForm = () =>{
    if (network !== 'Polygon Mumbai Testnet') {
      return (
        <div className="connect-wallet-container">
          <p>Please connect to Polygon Mumbai Testnet</p>
          <button className='cta-button mint-button' onClick={switchNetwork}>Click here to switch</button>
        </div>
      );
    }

    return (
      <div className="form-container">
        <div className="first-row">
          <input
            type="text"
            value={domain}
            placeholder='domain'
            onChange={e => setDomain(e.target.value)}
          />
          <p className='tld'> {tld} </p>
        </div>

        <input
          type="text"
          value={record}
          placeholder='whats ur ninja power?'
          onChange={e => setRecord(e.target.value)}
        />
          {/* If the editing variable is true, return the "Set record" and "Cancel" button */}
          {editing ? (
            <div className="button-container">
              {/* This will call the updateDomain function we just made */}
              <button className='cta-button mint-button' disabled={loading} onClick={updateDomain}>
                Set record
              </button>  
              {/* This will let us get out of editing mode by setting editing to false */}
              <button className='cta-button mint-button' onClick={() => {setEditing(false)}}>
                Cancel
              </button>  
            </div>
          ) : (
            // If editing is not true, the mint button will be returned instead
            <button className='cta-button mint-button' disabled={loading} onClick={mintDomain}>
              Mint
            </button>  
          )}
      </div>
    );
  }
```



如果应用程序处于编辑模式，这里发生的所有事情是我们渲染两个不同的按钮。 “设置记录”按钮将调用我们编写的更新功能，而取消按钮将使我们退出编辑模式。

### 🎞 获取 mint 记录

你做了这么多工作！ 不再幼稚。 是时候向世界展示其他人购买的所有精彩域名了。 我们在合约中添加了一个功能来做到这一点！ 让我们把它拉出来 哈哈
```jsx
// Add a stateful array at the top next to all the other useState calls
const [mints, setMints] = useState([]);

// Add this function anywhere in your component (maybe after the mint function)
const fetchMints = async () => {
  try {
    const { ethereum } = window;
    if (ethereum) {
      // You know all this
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);
        
      // Get all the domain names from our contract
      const names = await contract.getAllNames();
        
      // For each name, get the record and the address
      const mintRecords = await Promise.all(names.map(async (name) => {
      const mintRecord = await contract.records(name);
      const owner = await contract.domains(name);
      return {
        id: names.indexOf(name),
        name: name,
        record: mintRecord,
        owner: owner,
      };
    }));

    console.log("MINTS FETCHED ", mintRecords);
    setMints(mintRecords);
    }
  } catch(error){
    console.log(error);
  }
}

// This will run any time currentAccount or network are changed
useEffect(() => {
  if (network === 'Polygon Mumbai Testnet') {
    fetchMints();
  }
}, [currentAccount, network]);
```



这个 fetchMints 函数正在获取三样东西：

1. 合约中的所有域名
2. 获取到的每个域名的记录
3. 获得的每个域名的所有者地址

它将这些放在一个数组中并将该数组设置为我们的铸造品。 让我们开始吧。

顺便说一句——我也将它添加到我的“mintDomain”函数的底部，这样当我们自己创建一个域时，我们的应用程序就会更新。 我们正在等待两秒钟以确保交易被挖掘。 现在我们的用户可以实时查看他们的铸造品！
```jsx
const mintDomain = async () => {
  // Don't run if the domain is empty
  if (!domain) { return }
  // Alert the user if the domain is too short
  if (domain.length < 3) {
    alert('Domain must be at least 3 characters long');
    return;
  }
  // Calculate price based on length of domain (change this to match your contract)	
  // 3 chars = 0.5 MATIC, 4 chars = 0.3 MATIC, 5 or more = 0.1 MATIC
  const price = domain.length === 3 ? '0.5' : domain.length === 4 ? '0.3' : '0.1';
  console.log("Minting domain", domain, "with price", price);
  try {
      const { ethereum } = window;
      if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);

      console.log("Going to pop wallet now to pay gas...")
          let tx = await contract.register(domain, {value: ethers.utils.parseEther(price)});
          // Wait for the transaction to be mined
      const receipt = await tx.wait();

      // Check if the transaction was successfully completed
      if (receipt.status === 1) {
        console.log("Domain minted! https://mumbai.polygonscan.com/tx/"+tx.hash);
        
        // Set the record for the domain
        tx = await contract.setRecord(domain, record);
        await tx.wait();

        console.log("Record set! https://mumbai.polygonscan.com/tx/"+tx.hash);
        
        // Call fetchMints after 2 seconds
        setTimeout(() => {
          fetchMints();
        }, 2000);

        setRecord('');
        setDomain('');
      } else {
        alert("Transaction failed! Please try again");
      }
      }
    } catch(error) {
      console.log(error);
    }
}
```


### 🧙 渲染 minted 域

好的，我们快完成了，坚持住！ 现在我们有了这些，我们可以在底部渲染它们：
```jsx
// Add this render function next to your other render functions
const renderMints = () => {
  if (currentAccount && mints.length > 0) {
    return (
      <div className="mint-container">
        <p className="subtitle"> Recently minted domains!</p>
        <div className="mint-list">
          { mints.map((mint, index) => {
            return (
              <div className="mint-item" key={index}>
                <div className='mint-row'>
                  <a className="link" href={`https://testnets.opensea.io/assets/mumbai/${CONTRACT_ADDRESS}/${mint.id}`} target="_blank" rel="noopener noreferrer">
                    <p className="underlined">{' '}{mint.name}{tld}{' '}</p>
                  </a>
                  {/* If mint.owner is currentAccount, add an "edit" button*/}
                  { mint.owner.toLowerCase() === currentAccount.toLowerCase() ?
                    <button className="edit-button" onClick={() => editRecord(mint.name)}>
                      <img className="edit-icon" src="https://img.icons8.com/metro/26/000000/pencil.png" alt="Edit button" />
                    </button>
                    :
                    null
                  }
                </div>
          <p> {mint.record} </p>
        </div>)
        })}
      </div>
    </div>);
  }
};

// This will take us into edit mode and show us the edit buttons!
const editRecord = (name) => {
  console.log("Editing record for", name);
  setEditing(true);
  setDomain(name);
}
```



这是一堆 React，唯一花哨的是 `mints.map` 部分。 它所做的是获取 `mints` 数组中的每个项目并为其呈现一些 HTML。 它使用带有`mint.name`和`mint.id`的实际 HTML 中的项目值。 非常好！ 您可以在所有其他渲染函数下调用此函数 :)

这是我最终的渲染部分的样子：
```jsx
{!currentAccount && renderNotConnectedContainer()}
{currentAccount && renderInputForm()}
{mints && renderMints()}
```



这就是它呈现的样子：

![https://i.imgur.com/EWZCQ0a.png](https://i.imgur.com/EWZCQ0a.png)


看着 goooooooooooooooooooooooood！ 看到小铅笔了吗？ 他们允许您编辑您拥有的每个域的记录。

### 🥂 显示“domain minted”弹出窗口

我们应用程序的铸造过程现在有点乏味。 你按下一个按钮。 有事情发生。 这是给你的挑战：显示一个弹出窗口，告诉用户他们的域已经创建。 查看我们如何在 `renderMints` 函数中将它们发送到 OpenSea 以获得提示 :)

### 🚨进度报告

您的应用现在应该看起来超级漂亮！ 在#progress 中发布成品。 我迫不及待地想看看你在这个项目上的所有出色表现：）