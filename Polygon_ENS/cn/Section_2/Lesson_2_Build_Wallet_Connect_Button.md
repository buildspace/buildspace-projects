
*注意：如果您过去曾与我们一起做过项目，请随时加快速度！*

### 🌅 使用以太坊对象

**现在**该出发了😎。 作为任何适当的 web3 应用程序的一部分，我们需要一种方法来访问私人的公共地址——**但这是为什么呢？**

为了让我们的网站与区块链对话，我们需要以某种方式将我们的钱包连接到它。 一旦我们将钱包连接到我们的网站，我们的网站将有权代表我们调用智能合约。 **请记住，这就像在网站中进行身份验证一样。**

前往 `src` 下的 `App.js`，这是我们将完成所有工作的地方。

如果您登录到 MetaMask，它会自动将一个名为 `ethereum` 的特殊对象注入我们的窗口，该对象具有一些神奇的方法。 让我们先检查一下是否有。

**注意：MetaMask 会注入 `ethereum` 对象，即使我们在不同的网络上，如 Polygon。**
```jsx
import React, { useEffect } from "react";
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {

  // Gotta make sure this is async.
  const checkIfWalletIsConnected = () => {
    // First make sure we have access to window.ethereum
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have MetaMask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }
  }

  // Create a function to render if wallet is not connected yet
  const renderNotConnectedContainer = () => (
    <div className="connect-wallet-container">
      <img src="https://media.giphy.com/media/3ohhwytHcusSCXXOUg/giphy.gif" alt="Ninja gif" />
      <button className="cta-button connect-wallet-button">
        Connect Wallet
      </button>
    </div>
    );

  // This runs our function when the page loads.
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

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

        {/* Add your render method here */}
        {renderNotConnectedContainer()}

        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a className="footer-text" 
            href={TWITTER_LINK} 
            target="_blank"
            rel="noreferrer">
              {`built with @${TWITTER_HANDLE}`}
          </a>
        </div>
      </div>
    </div>
  );
};

export default App;
```



好的！ 您现在有一些运行的逻辑，检查你是否安装了 MetaMask 扩展！ 如果你刷新你的应用程序，你应该会看到 - “We have the Ethereum object” 在你的控制台中打印出来（如果你安装了 MetaMask）！

如果您正在使用 Replit，请确保您正在查看项目网站的控制台，而不是 Replit 工作区！ 您可以通过在自己的窗口/选项卡中打开它并启动开发人员工具来访问您网站的控制台。 该 URL 应如下所示 - `https://domain-starter-project.yourUsername.repl.co/`

花点时间根据自己的喜好自定义页面。 转到 [https://giphy.com/](https://giphy.com/) 并找到适合您的域的 gif。 下图是我选择的：
![https://i.imgur.com/lyR6lsj.png](https://i.imgur.com/lyR6lsj.png)



### 🔒 看看我们是否可以访问用户的帐户

**很好。** 接下来，我们需要实际检查我们是否有权实际访问用户的钱包。 一旦我们可以访问它，我们就可以调用我们的智能合约！

MetaMask 不只是将我们的钱包凭证提供给我们访问的每个网站。 那太古怪了。 它只会将其提供给我们授权的网站。 同样，这就像登录一样！ 但是，我们在这里做的是**检查我们是否“登录”。**

查看下面的代码，我更新了 `checkIfWalletIsConnected` 函数并添加了一个名为 `currentAccount` 的有状态 React 变量和 `useState`。 同样，我已经对我更改的内容留下了注释。
```jsx
// Make sure to import useState
import React, { useEffect, useState } from "react";
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';

const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  //Just a state variable we use to store our user's public wallet. Don't forget to import useState at the top.
  const [currentAccount, setCurrentAccount] = useState('');
  
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log('Make sure you have metamask!');
      return;
    } else {
      console.log('We have the ethereum object', ethereum);
    }

    // Check if we're authorized to access the user's wallet
    const accounts = await ethereum.request({ method: 'eth_accounts' });

    // Users can have multiple authorized accounts, we grab the first one if its there!
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log('Found an authorized account:', account);
      setCurrentAccount(account);
    } else {
      console.log('No authorized account found');
    }
  };

  // Render Methods
  const renderNotConnectedContainer = () => (
    <div className="connect-wallet-container">
      <img src="https://media.giphy.com/media/3ohhwytHcusSCXXOUg/giphy.gif" alt="Ninja gif" />
      <button className="cta-button connect-wallet-button">
        Connect Wallet
      </button>
    </div>
  );

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

        {renderNotConnectedContainer()}

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



连接按钮不会执行任何操作，您应该会在控制台中看到`No authorized account found` 。 这是因为我们从未明确告诉 MetaMask，“*嘿 MetaMask，请允许该网站访问我的钱包*”。

接下来让我们获得用户访问他们钱包的权限！

### 🛍 连接到用户的钱包

在 Web3 的世界里，连接你的钱包实际上就是你的用户的一个“登录”按钮。 我们向 MetaMask 发送请求，以授予我们对用户钱包的只读访问权限。

准备好享受最简单的“登录”体验了吗:)？ 一探究竟：
```jsx
import React, { useEffect, useState } from "react";
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState('');
    
  // Implement your connectWallet method here
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask -> https://metamask.io/");
        return;
      }

      // Fancy method to request access to account.
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    
      // Boom! This should print out public address once we authorize Metamask.
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

  // Render Methods
  const renderNotConnectedContainer = () => (
    <div className="connect-wallet-container">
      <img src="https://media.giphy.com/media/3ohhwytHcusSCXXOUg/giphy.gif" alt="Ninja donut gif" />
      {/* Call the connectWallet function we just wrote when the button is clicked */}
      <button onClick={connectWallet} className="cta-button connect-wallet-button">
        Connect Wallet
      </button>
    </div>
  );
  
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
        
        {/* Hide the connect button if currentAccount isn't empty*/}
        {!currentAccount && renderNotConnectedContainer()}

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



确保您记得更新`Connect Wallet`按钮以实际调用我们刚刚编写的`connectWallet`函数。

回顾一下我们到目前为止对我们的应用程序所做的事情：

1. 检查用户是否安装了MetaMask扩展
2. 如果他们这样做，请在单击连接按钮时请求读取其帐户地址和余额的权限。

好的！ 继续测试那个花哨的按钮！ MetaMask 应该会提示你“连接 MetaMask”，一旦你连接了你的钱包，连接按钮应该会消失，你的控制台应该会打印出“Connected SOME_WALLET_ADDRESS”

![https://i.imgur.com/wzMPQH8.png](https://i.imgur.com/wzMPQH8.png)



### 🚨进度报告

*请这样做，否则 Raza 会伤心的:(*

在#progress 中发布您网站的屏幕截图！