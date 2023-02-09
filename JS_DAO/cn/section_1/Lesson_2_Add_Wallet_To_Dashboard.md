### ⛓ 指定链和钱包类型

因此，为了让我们的网站与区块链通信，我们需要以某种方式将我们的钱包连接到它。 一旦我们将钱包连接到我们的网站，我们的网站将有权代表我们调用智能合约。 **请记住，这就像在网站中进行身份验证一样。**

您过去可能已经构建过“Connect to Wallet”按钮！ 这一次，我们将使用 thirdweb 的前端 SDK，这使它变得非常简单。

转到 React 应用程序中的 `src/index.js` 文件并添加以下代码：

```jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Import thirdweb provider and Goerli ChainId
import { ThirdwebProvider } from '@thirdweb-dev/react';
import { ChainId } from '@thirdweb-dev/sdk';

// This is the chainId your dApp will work on.
const activeChainId = ChainId.Goerli;

// Wrap your app with the thirdweb provider
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ThirdwebProvider desiredChainId={activeChainId}>
      <App />
    </ThirdwebProvider>
  </React.StrictMode>,
);
```
很简单。 我们现在正在导入 thirdweb，然后指定我们正在处理的链的 `chainId`，即 Goerli!。

然后我们用 `<ThirdwebProvider>` 封装所有东西，这个 `Provider` 持有用户的经过身份验证的钱包数据（如果他们之前连接过我们的网站）并将其传递给 `App`。

*注意：如果您之前使用过 dapp，请确保断开您的钱包与 Metamask 上的 [https://localhost:3000](https://localhost:3000) 的连接（如果您之前曾连接过的话）。*

### 🌟 添加`Connect to Wallet`

如果你转到你的 web 应用，你会看到一个空白的紫色页面。让我们添加一些基本的副本和按钮，让用户连接他们的钱包。

转到 `App.jsx`, 添加以下代码:

```jsx
import { useAddress, ConnectWallet } from '@thirdweb-dev/react';

const App = () => {
  // Use the hooks thirdweb give us.
  const address = useAddress();
  console.log("👋 Address:", address);

  // This is the case where the user hasn't connected their wallet
  // to your web app. Let them call connectWallet.
  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to NarutoDAO</h1>
        <div className="btn-hero">
          <ConnectWallet />
        </div>
      </div>
    );
  }

  // This is the case where we have the user's address
  // which means they've connected their wallet to our site!
  return (
    <div className="landing">
      <h1>👀 wallet connected, now what!</h1>
    </div>);
}

export default App;
```
相当容易！ 顺便说一句——如果您在本地工作，此时请确保您的 Web 应用程序正在使用 `npm start` 运行。

现在，当您转到您的 Web 应用程序并单击 `Connect to Wallet` 时，您会看到它弹出 Metamask！ 授权你的钱包后，你会看到这个屏幕：

![无标题](https://i.imgur.com/oDG9uiz.png)

如果去你的控制台，你会看到它输出出你的公共地址。 如果您在此处刷新页面，您会看到我们的钱包连接也保持不变。

如果你过去建立过一个钱包连接，你会注意到使用 thirdweb 的客户端 SDK 是多么容易，因为它为你处理常见的边缘情况（例如，在变量中维护用户钱包的状态）。

顺便说一句——我这里写的是 `<h1>Welcome to NarutoDAO</h1>`，请把它改成你自己的。 不要复制我的！ 因为这是你的 Dao！

*注意:如果您想测试用户没有连接钱包的情况，请随意从Metamask [断开您的网站](https://metamask.zendesk.com/hc/en-us/articles/360059535551-Disconnect-wallet-from-Dapp)。*

### 🚨 进度报告

*请一定记得这样做，否则 Farza 会伤心的💔*

在 `#progress` 频道中发布显示您的 DAO 的欢迎界面和 `Connect to Wallet` 按钮的截图， 最好不要说火影忍者！







