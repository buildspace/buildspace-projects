

### 💌 从用户获取数据

惊人的。 **我们做到了**。 我们已经部署了我们的网站。 我们已经部署了我们的合约。 我们已经连接了我们的钱包。 **现在我们需要使用我们现在可以从 MetaMask 访问的凭据实际从我们的网络应用程序调用我们的合约**！

首先，我们需要获取用户的域名以及他们要存储的数据，让我们开始吧！
```jsx
import React, { useEffect, useState } from "react";
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import {ethers} from "ethers";

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
// Add the domain you will be minting
const tld = '.ninja';
const CONTRACT_ADDRESS = 'YOUR_CONTRACT_ADDRESS_HERE';

const App = () => {
	const [currentAccount, setCurrentAccount] = useState('');
	// Add some state data propertie
	const [domain, setDomain] = useState('');
	const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState('');

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask -> https://metamask.io/");
        return;
      }
			
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

	const checkIfWalletIsConnected = async () => {
		const { ethereum } = window;

		if (!ethereum) {
			console.log('Make sure you have metamask!');
			return;
		} else {
			console.log('We have the ethereum object', ethereum);
		}

		const accounts = await ethereum.request({ method: 'eth_accounts' });

		if (accounts.length !== 0) {
			const account = accounts[0];
			console.log('Found an authorized account:', account);
			setCurrentAccount(account);
		} else {
			console.log('No authorized account found');
		}
	};

	// Render methods
	const renderNotConnectedContainer = () => (
		<div className="connect-wallet-container">
			<img src="https://media.giphy.com/media/3ohhwytHcusSCXXOUg/giphy.gif" alt="Ninja donut gif" />
      {/* Call the connectWallet function we just wrote when the button is clicked */}
			<button onClick={connectWallet} className="cta-button connect-wallet-button">
				Connect Wallet
			</button>
		</div>
	);
	
	// Form to enter domain name and data
	const renderInputForm = () =>{
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
					placeholder='whats ur ninja power'
					onChange={e => setRecord(e.target.value)}
				/>

				<div className="button-container">
					<button className='cta-button mint-button' disabled={null} onClick={null}>
						Mint
					</button>  
					<button className='cta-button mint-button' disabled={null} onClick={null}>
						Set data
					</button>  
				</div>

			</div>
		);
	}
  
	useEffect(() => {
		checkIfWalletIsConnected();
	}, []);

	return (
		<div className="App">
			<div className="container">
				<div className="header-container">
					<header>
						<div className="left">
							<p className="title">🐱‍👤 Ninja Name Service</p>
							<p className="subtitle">Your immortal API on the blockchain!</p>
						</div>
					</header>
				</div>
				
				{!currentAccount && renderNotConnectedContainer()}
				{/* Render the input form if an account is connected */}
				{currentAccount && renderInputForm()}
				
				<div className="footer-container">
					<img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
					<a
						className="footer-text"
						href={TWITTER_LINK}
						target="_blank"
						rel="noreferrer"
					>{`built with @${TWITTER_HANDLE}`}</a>
				</div>
			</div>
		</div>
	);
};

export default App;
```



这里没有太大变化！ 我们添加的只是旧`currentAccount`变量下的两个有状态变量和一个返回输入字段的`renderInputForm`函数。

让我们更加关注这些新增功能：

```jsx
// Update this to your top level domain
const tld = '.ninja'; 

const App = () => {
// New React state variables 
const [domain, setDomain] = useState('');
const [record, setRecord] = useState('');

return (
	<div className="App">
			...
			{/* Header stuff here */}

			{/* This will hide the connect button if currentAccount isn't empty*/}
			{!currentAccount && renderNotConnectedContainer()}

			{/* Render the input form if an account is connected */}
			{currentAccount && renderInputForm()}
			
			{/* Footer stuff here*/}
			...
	</div>
);
```



`&&` 语法可能看起来有点奇怪，它所做的只是在 `&&` 之前的条件为真时返回渲染函数。 因此，如果 `currentAccount` 为空（即不为真），它将呈现连接钱包按钮。

`renderInputForm` 是一个非常标准的 React 块，它使用绑定到有状态变量的输入字段。 您可以在 [此处](https://reactjs.org/docs/hooks-state.html) 阅读更多关于它们的信息。

如果你看一下你的应用程序，你会看到输入字段：
![https://i.imgur.com/8AF7yB5.png](https://i.imgur.com/8AF7yB5.png)



**注意：** mint 按钮现在没有任何作用，这是预料之中的！

非常酷😎。 我们现在可以轻松地收集用户的输入并调用我们的合约！ 在下一节中，您将通过调用我们之前在智能合约上创建的函数来了解这有多么神奇！

### 🧞 与合约交互

史诗。 我们现在准备好获取这些数据并将其发送到我们的智能合约以实际创建我们的域！ 让我们出发吧🤘

还记得我们在合约中放置的将域铸造为 NFT 的`register`功能吗？ 我们现在需要从我们的网络应用程序中调用这个函数。 继续并在 `checkIfWalletIsConnected` 函数下添加以下函数。
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
				
				setRecord('');
				setDomain('');
			}
			else {
				alert("Transaction failed! Please try again");
			}
    }
  }
  catch(error){
    console.log(error);
  }
}
```



这会抛出一些错误。 不用担心！ 我们稍后会修复它。 让我们逐步完善代码 :)。

```jsx
const provider = new ethers.providers.Web3Provider(ethereum);
const signer = provider.getSigner();
```



`ethers` 是一个帮助我们的前端与我们的合约对话的库。

确保在我们导入 Twitter 标志后立即使用 `import { ethers } from "ethers";` 在顶部导入它。

“提供者”是我们用来实际与 Polygon 节点对话的东西。 还记得我们如何使用 QuickNode 来**部署**吗？ 那么在这种情况下，我们使用 MetaMask 在后台提供的节点来从我们部署的合约发送/接收数据。

[这里是](https://docs.ethers.io/v5/api/signer/#signers) 解释第 2 行签名者是什么的链接。
```jsx
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);
```



我们稍后会介绍这个。 只要知道这一行实际上是**创建与我们的合同的连接**。 它需要：合约的地址，一个叫做 `abi` 文件的东西，和一个 `signer`。 这是我们始终需要与区块链上的合约进行通信的三件事。

请注意我是如何使用其他常量在文件顶部硬编码 `const CONTRACT_ADDRESS` 的？

**请务必将此变量更改为您最新部署的合约的部署合约地址**。

如果您忘记或丢失了它，请不要担心，只需重新部署合约并获得一个新地址 :)。
```jsx
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
	
	setRecord('');
	setDomain('');
}
else {
	alert("Transaction failed! Please try again");
}
```



代码的下一部分应该已经有意义了。 它看起来有点像我们部署的代码:)！ 我们使用 `register` 调用我们的合约，等待它被挖掘，然后链接 Polygonscan URL！

我们实际上将在这里调用两个合约函数。 第二个是 `setRecord` - 为我们正在创建的域设置记录。 由于我们的域名需要存在于合约上才能为其设置记录，因此我们必须等待第一笔交易被成功挖掘。 `tx.wait()` 给了我们一张我们可以检查的收据，多么方便！

最后，我们要在有人单击“Mint NFT”按钮时调用此函数。 在 `renderInputForm` 函数中为 mint 按钮添加一个 `onClick` 以调用 `mintDomain` 函数。 其他一切都保持不变。
```jsx
const renderInputForm = () => {
  return (
    <div className="form-container">
      <div className="first-row">
        <input
          type="text"
          value={domain}
          placeholder="domain"
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

      <div className="button-container">
        {/* Call the mintDomain function when the button is clicked*/}
        <button className='cta-button mint-button' onClick={mintDomain}>
          Mint
        </button> 
      </div>

    </div>
  );
}
```



注意：您仍然会看到错误，并且 mint 按钮将不起作用！

### 📂 ABI 文件

**这是 Farza 制作的一个小视频，解释了所有这些 ABI 的东西。如果你不会，请好好看他视频中是怎么做的**

[boom](https://www.loom.com/share/2d493d687e5e4172ba9d47eeede64a37)

*注意：由于这个解释来自另一个项目，文件名会有所不同！*

所以——当你编译你的智能合约时，编译器会吐出一堆让你与合约交互所需的文件。您可以在 Solidity 项目根目录下的 `artifacts` 文件夹中找到这些文件。

ABI 文件是我们的网络应用程序需要知道如何与我们的合约进行通信的文件。 [此处](https://docs.soliditylang.org/en/v0.8.14/abi-spec.html) 了解相关信息。

ABI 文件的内容可以在您的 hardhat 项目中的一个精美的 JSON 文件中找到：

`artifacts/contracts/Domains.sol/Domains.json`

那么，问题就变成了我们如何将这个 JSON 文件放入我们的前端？有很多奇特的方法可以做到这一点，但我们现在要使用好的 ‘ol 复制和粘贴方法！

从您的 `Domains.json` 复制内容，然后前往您的网络应用。您将在 `src` 下创建一个名为 `utils` 的新文件夹。在该文件夹中，您将创建一个名为 `contractABI.json` 的文件。所以完整的路径看起来像：

`src/utils/contractABI.json`

将 ABI 文件内容粘贴到我们的新文件中。

现在您已经准备好包含所有 ABI 内容的文件，是时候将其导入到您的`App.js` 文件中了。这将是：
```jsx
import contractAbi from './utils/contractABI.json';
```



我们都完成了。应该不会再有错误了！

从这里您需要做的就是输入一个域名、一条记录、点击“mint”、支付gas费（使用您的假 MATIC），等待交易被开采，然后砰！您的域应该立即或在最大 5-15 米范围内显示在 OpenSea 上。

您可能会问自己 wtf gas 是什么。我不打算在这里回答。但是，您可以在 [此处](https://ethereum.org/en/developers/docs/gas/); 开始研究。

### 🤩 测试

您现在应该可以直接从您的网站上创建一个域 NFT。

**我们走吧！**

这基本上就是所有这些 NFT 铸币网站的工作方式，而您自己完成了 :)

### ✈️ 关于合约重新部署的说明

假设您想更改合同。你需要做三件事：

1. 我们需要重新部署一下。
2. 我们需要在前端更新合约地址。
3. 我们需要更新前端的 abi 文件。

**人们在更改合同时经常忘记执行这 3 个步骤。别忘了哈哈。**

为什么我们需要做这一切？嗯，这是因为智能合约是**不可变的。**它们无法更改。它们是永久性的。这意味着更改合同需要完全重新部署。这也将**重置**所有变量，因为它会被视为一个全新的合同。 **这意味着如果我们想更新合约代码，我们将丢失所有域数据。**

### 🚨进度报告

在铸造了一些 NFT 并炫耀所有这些 `console.log` 之后，发布您的控制台的屏幕截图！