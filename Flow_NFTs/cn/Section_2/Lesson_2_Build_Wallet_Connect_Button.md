由于我们使用的是 FCL，因此我们可以使用我们想要的*任何* Flow 钱包！ 我将使用最受欢迎的 Flow 钱包 - [Blocto](https://docs.onflow.org/flow-token/available-wallets/#how-to-use-blocto)。

您也可以试用 [Lilico](https://lilico.app/) - 它是一个可作为浏览器扩展的托管钱包，就像其他流行的钱包一样。 如果您决定使用它，请立即下载并设置它。

返回 VS Code 并打开 `src` 目录中的 `App.js` 文件。 你应该看到一堆代码已经在那里。 除了 Cadence 文件夹之外，这是一个普通的 React 应用程序，就像您使用 Create React App 生成的应用程序一样。 我刚刚添加了样式以节省您一些时间：D

### ⚡ 使用 FCL（流客户端库）
还记得我一开始提到的 FCL 吗？ 它标准化了钱包连接，因此您只需*一次*编写钱包连接代码。 让我们设置它！

在您的 app.js 文件中导入以下两个包。 将其复制并粘贴到您导入 Twitter LOGO的位置下方。
```
import * as fcl from "@onflow/fcl";
import * as types from "@onflow/types";
```


第一个导入是帮助我们与 Flow 区块链交互的主库。 第二个库帮助我们将 javascript 数据类型转换为 flow/cadence 兼容的数据类型。

紧随其后，添加以下内容：
```
fcl.config({
  "flow.network": "testnet",
  "app.detail.title": "BottomShot", // Change the title!
  "accessNode.api": "https://rest-testnet.onflow.org",
  "app.detail.icon": "https://placekitten.com/g/200/200",
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
});
```



这就是设置您的应用程序以兼容并使用 Flow 测试网所需的全部内容。

以下是 `fcl.config()` 的设置：
* `"flow.network": "testnet"` 配置dapp当前网络为testnet
* `"accessNode.api": "https://rest-testnet.onflow.org"` 配置我们用来与区块链交互的节点的 url。
* `"discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn"` 告诉 dapp 需要用于与 dapp 交互的钱包。
* `"app.detail.title": "BottomShot"` 为 dapp 命名。 您可以将其更改为您想要的任何值。
* 最后，当您使用钱包进行身份验证时，`"app.detail.icon": "https://placekitten.com/g/200/200"` 会显示应用程序图标。

您可以查看官方流程文档的[这部分](https://docs.onflow.org/fcl/reference/api/#common-configuration-keys) 以了解有关配置值的更多信息。

### 🔓 构建钱包连接按钮
是时候进行您将在 Web 应用程序上执行的最简单的身份验证了（是的，甚至比 Metamask 更容易）。

FCL 使身份验证*非常*简单，实际上只需 3 行代码和一个您可以单击的按钮。

首先使用 [`useState`](https://reactjs.org/docs/hooks-state.html) 挂钩创建一个有状态变量来存储当前的 `user`。 这将位于 `App()` 函数的顶部
```js
  const [ user, setUser ] = useState();
```


接下来让我们进行身份验证（钱包连接）功能，并在每次检测到用户更改时使用`setUser`功能。 在`useState`变量下方添加这些：

```js
  const logIn = () => {
      fcl.authenticate();
  };

  const logOut = () => {
      fcl.unauthenticate();
  };

  useEffect(() => {
    // This listens to changes in the user objects
    // and updates the connected user
    fcl.currentUser().subscribe(setUser);
  }, [])
```



**Lilico!**

顺便说一句，如果你正在为 Lilico 构建，你应该检查用户的网络。 使用 Blocto，我们在 fcl 配置中设置网络。 在 Lilico 上，用户可以自己更改网络。 以下是跟踪 Lilico 用户切换到哪个网络的方法：
```js
const [network, setNetwork] = useState("");

useEffect(()=>{
    // This is an event listener for all messages that are sent to the window
    window.addEventListener("message", d => {
    // This only works for Lilico testnet to mainnet changes
      if(d.data.type==='LILICO:NETWORK') setNetwork(d.data.network)
    })
  }, [])
```


如果用户在错误的网络上，您可以使用网络值来警告用户：D

**注意**
当您更改 `Lilico` 网络时，您的帐户地址会发生变化。 所以当切换网络时，需要重新认证才能得到更新后的账户地址。

之后，为我们的两个按钮创建渲染组件：
```js
  const RenderLogin = () => {
    return (
      <div>
        <button className="cta-button button-glow" onClick={() => logIn()}>
          Log In
        </button>
      </div>
    );
  };

  const RenderLogout = () => {
    if (user && user.addr) {
      return (
        <div className="logout-container">
          <button className="cta-button logout-btn" onClick={() => logOut()}>
            ❎ {"  "}
            {user.addr.substring(0, 6)}...{user.addr.substring(user.addr.length - 4)}
          </button>
        </div>
      );
    }
    return undefined;
  };
```


将注销渲染函数放在顶部，将登录渲染函数放在 `footer-container` div 之前。 我让我的登录按钮像这样消失了：
```
{user && user.addr ? "Wallet connected!" : <RenderLogin />}
```



这就是您的 App.js 文件现在的样子：
```
//importing required libraries
import React, { useState, useEffect } from "react";
import './App.css';
import twitterLogo from "./assets/twitter-logo.svg";
import * as fcl from "@onflow/fcl";
import * as types from "@onflow/types";

const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

fcl.config({
  "flow.network": "testnet",
  "app.detail.title": "BottomShot", // Change the title!
  "accessNode.api": "https://rest-testnet.onflow.org",
  "app.detail.icon": "https://placekitten.com/g/200/200",
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
});

function App() {

  const [ user, setUser ] = useState();

  const logIn = () => {
    fcl.authenticate();
  };

  const logOut = () => {
    fcl.unauthenticate();
  };
  
  useEffect(() => {
    // This listens to changes in the user objects
    // and updates the connected user
    fcl.currentUser().subscribe(setUser);
  }, [])

  const RenderLogin = () => {
    return (
      <div>
        <button className="cta-button button-glow" onClick={() => logIn()}>
          Log In
        </button>
      </div>
    );
  };

  const RenderLogout = () => {
    if (user && user.addr) {
      return (
        <div className="logout-container">
          <button className="cta-button logout-btn" onClick={() => logOut()}>
            ❎ {"  "}
            {user.addr.substring(0, 6)}...{user.addr.substring(user.addr.length - 4)}
          </button>
        </div>
      );
    }
    return undefined;
  };

  return (
    <div className="App">
      <RenderLogout />
      <div className="container">
        <div className="header-container">
          <div className="logo-container">
            <img src="./logo.png" className="flow-logo" alt="flow logo"/>
            <p className="header">✨Awesome NFTs on Flow ✨</p>
          </div>

          <p className="sub-text">The easiest NFT mint experience ever!</p>
        </div>

        {/* If not logged in, render login button */}
        {user && user.addr ? "Wallet connected!" : <RenderLogin />}

        <div className="footer-container">
            <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
            <a className="footer-text" href={TWITTER_LINK} target="_blank" rel="noreferrer">{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
}

export default App;
```



**重要提示：**您*可能*在第一次登录时看到此警告。 您可以忽略它或稍后添加所需的信息。

![Dashboard](https://i.imgur.com/rGV2MBL.png)



在您的浏览器中转到“http://localhost:3000/”，您应该会看到您喜欢的登录按钮！ 请确保您通过使用您的帐户登录来测试它😎