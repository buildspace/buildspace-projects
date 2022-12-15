

本节将介绍一些非常有价值的好东西，你会在各种 dapp 上看到这些好东西。 是时候发挥你的新技能，发挥超级创意了！ 你已经有了构建块——现在你已经准备好为你构建完美的 dapp。

首先，我们应用程序的用户体验可以得到很大改进。 让我们从向用户显示他们的地址开始。 转到您的 React 应用并更新 App.js 中的`header-container`div：
```html
<div className="header-container">
  <header>
    <div className="left">
      <p className="title">🐱‍👤 Ninja Name Service</p>
      <p className="subtitle">Your immortal API on the blockchain!</p>
    </div>
    {/* Display a logo and wallet connection status*/}
    <div className="right">
      <img alt="Network logo" className="logo" src={ network.includes("Polygon") ? polygonLogo : ethLogo} />
      { currentAccount ? <p> Wallet: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)} </p> : <p> Not connected </p> }
    </div>
  </header>
</div>
```



这里发生的事情有点像 JavaScript 的奇思妙想。 如果你不明白`？ :` 语法，略读 [这里](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator)，这些是三元运算符，它们真的很酷。 这里值得一提的是，我只是在检查网络名称中是否包含“Polygon”一词。 因此，如果您在 Polygon 主网上，就会显示ploygon徽标！

啊，还有更多错误……别担心，这是预料之中的，我们会立即修复它们！

回到组件的顶部并添加以下内容（不要复制/粘贴整个内容，否则会破坏它）：
```jsx
// At the very top of the file, after the other imports
import polygonLogo from './assets/polygonlogo.png';
import ethLogo from './assets/ethlogo.png';
import { networks } from './utils/networks';

const App = () => {
  // Create a stateful variable to store the network next to all the others
    const [network, setNetwork] = useState('');
  
  // Update your checkIfWalletIsConnected function to handle the network
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
    
    // This is the new part, we check the user's network chain ID
    const chainId = await ethereum.request({ method: 'eth_chainId' });
    setNetwork(networks[chainId]);

    ethereum.on('chainChanged', handleChainChanged);
    
    // Reload the page when they change networks
    function handleChainChanged(_chainId) {
      window.location.reload();
    }
  };

// The rest of the file stays the same
```



App.js 的其余部分应该保持不变。 在浏览器中查看它，它应该如下所示：

![https://i.imgur.com/wh4zap4.png](https://i.imgur.com/wh4zap4.png)



现在我们正在检查他们的网络，如果他们不在孟买测试网上，我们应该禁用铸造。 将下面代码添加到 `renderInputForm` 的顶部：
```jsx
const renderInputForm = () =>{
  // If not on Polygon Mumbai Testnet, render "Please connect to Polygon Mumbai Testnet"
  if (network !== 'Polygon Mumbai Testnet') {
    return (
      <div className="connect-wallet-container">
        <p>Please connect to the Polygon Mumbai Testnet</p>
      </div>
    );
  }

// The rest of the function remains the same
return (	
  ...
```


它所做的只是呈现一条文本消息，而不是输入字段和 mint 按钮。 看起来很花哨，嗯？

### 🦊 在 MetaMask 中添加和切换网络

我们希望我们的应用程序可供所有类型的用户访问 - 刚开始使用 web3 的用户以及有经验的用户！

现在，我们所做的只是告诉他们连接到孟买。 如果我们添加一个为他们做这件事的按钮，那就更酷了！ 再加上像我这样懒惰的人会非常感激的。 我们可以使用 MetaMask API 实际帮助他们交换和添加网络。 这是函数中的样子（再次在 App.js 中，您可以将它放在钱包连接函数旁边）：
```jsx
const switchNetwork = async () => {
  if (window.ethereum) {
    try {
      // Try to switch to the Mumbai testnet
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x13881' }], // Check networks.js for hexadecimal network ids
      });
    } catch (error) {
      // This error code means that the chain we want has not been added to MetaMask
      // In this case we ask the user to add it to their MetaMask
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {	
                chainId: '0x13881',
                chainName: 'Polygon Mumbai Testnet',
                rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
                nativeCurrency: {
                    name: "Mumbai Matic",
                    symbol: "MATIC",
                    decimals: 18
                },
                blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
              },
            ],
          });
        } catch (error) {
          console.log(error);
        }
      }
      console.log(error);
    }
  } else {
    // If window.ethereum is not found then MetaMask is not installed
    alert('MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html');
  } 
}
```



这个函数做的第一件事就是尝试像这样改变他们的网络：

```jsx
await window.ethereum.request({
  method: 'wallet_switchEthereumChain',
  params: [{ chainId: '0x13881' }], // Check networks.js for hexadecimal network ids
});
```


`chainId` 参数是一个十六进制值，用于标识不同的网络。 最常见的是在 `networks.js` 文件中。 如果您以后添加一个新奇的网络，您可以用谷歌搜索它的 ID。 第二部分只是提示用户如果没有网络则添加网络。 如果您想了解更多关于这方面的信息，可以在 [此处](https://docs.metamask.io/guide/rpc-api.html#unrestricted-methods) 查看 MetaMask 文档。

所有这一切的最后一部分只是添加一个调用此函数的按钮到我们的 `renderInputForm`中：
```jsx
const renderInputForm = () =>{
  // If not on Polygon Mumbai Testnet, render the switch button
  if (network !== 'Polygon Mumbai Testnet') {
    return (
      <div className="connect-wallet-container">
        <h2>Please switch to Polygon Mumbai Testnet</h2>
        {/* This button will call our switch network function */}
        <button className='cta-button mint-button' onClick={switchNetwork}>Click here to switch</button>
      </div>
    );
  }

  // The rest of the function remains the same
  return (
```


### 🚨进度报告

跳入 CSS 并在地址容器或切换按钮上添加一个奇特的渐变。 也许带回角落？

发布您新添加的组件的屏幕截图:)