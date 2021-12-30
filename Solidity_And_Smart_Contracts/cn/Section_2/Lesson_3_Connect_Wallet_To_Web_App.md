🌅 使用 window.ethereum()
--------------------------

因此，为了让我们的网站与区块链对话，我们需要以某种方式将我们的钱包连接到它。一旦我们将钱包连接到我们的网站，我们的网站将有权限代表我们调用智能合约。记住，这就像在网站上进行身份验证一样。

前往Replit，进入`src`下的`App.jsx`，这就是我们要做的所有工作。

如果我们登录了Metamask，它会自动向我们的窗口注入一个名为`ethereum`的特殊对象。让我们先检查一下我们是否有这个对象。

```javascript
import React, { useEffect } from "react";
import './App.css';

const App = () => {
  const checkIfWalletIsConnected = () => {
    /*
    * First make sure we have access to window.ethereum
    */
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }
  }

  /*
  * This runs our function when the page loads.
  */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
  
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
          I am farza and I worked on self-driving cars so that's pretty cool right? Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={null}>
          Wave at Me
        </button>
      </div>
    </div>
  );
}

export default App
```

🔒 看看我们是否可以访问用户的账户
-----------------------------------------

因此，当你运行这个时，你去检查应该看到网站的控制台中打印出那行 "我们有以太坊对象"。如果你使用的是Replit，请确保你看到的是你的项目网站的控制台，而不是Replit的。你可以通过在自己的窗口/标签中打开网站的控制台并启动开发工具来访问它。URL应该是这样的 - `https://waveportal-starter-project.yourUsername.repl.co/`。

**很棒.**

接下来，我们需要实际检查我们是否被授权实际访问用户的钱包。一旦我们有了这个权限，我们就可以调用我们的智能合约了。

基本上，Metamask不只是将我们的钱包凭证提供给我们去的每个网站。它只把它提供给我们授权的网站。同样，这就像登录一样! 但是我们在这里做的是**检查我们是否已经 "登录 "了。

请看下面的代码。

```javascript
import React, { useEffect, useState } from "react";
import './App.css';

const App = () => {
  /*
  * Just a state variable we use to store our user's public wallet.
  */
  const [currentAccount, setCurrentAccount] = useState("");
  
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      
      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }
      
      /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
  
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          👋 Hey there!
        </div>
    
        <div className="bio">
          I am farza and I worked on self-driving cars so that's pretty cool right? Connect your Ethereum wallet and wave at me!
        </div>
    
        <button className="waveButton" onClick={null}>
          Wave at Me
        </button>
      </div>
    </div>
    );
  }
export default App
```

因此，我们使用那个特殊的方法`eth_accounts`来查看我们是否被授权访问用户钱包中的任何账户。需要记住的一点是，用户的钱包里可能有多个账户。在这种情况下，我们只关注第一个。

💰 建立一个连接钱包的按钮
--------------------------------

当你运行上述代码时，打印出来的console.log应该是 "没有找到授权账户"。为什么呢？因为我们从未明确告诉Metamask，"嘿，Metamask，请给这个网站访问我的钱包的权限"。 

我们需要创建一个`connectWallet`按钮。在Web3的世界里，连接你的钱包对你的用户来说简直就是一个 "登录 "按钮:)。看看这个吧。

```javascript
import React, { useEffect, useState } from "react";
import './App.css';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
  
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
          I am farza and I worked on self-driving cars so that's pretty cool right? Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={null}>
          Wave at Me
        </button>
        
        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}

export default App
```

我们的代码在这里变得有点长，但你可以看到我们的`connectWallet`函数是多么短。在这种情况下，我使用`eth_requestAccounts`函数，因为我实际上是要求Metamask给我访问用户的钱包。

在第67行，我还添加了一个按钮，以便我们可以调用我们的`connectWallet`函数。你会注意到我只在我们没有`currentAccount`的情况下显示这个按钮。如果我们已经有了currentAccount，那么这意味着我们已经可以访问用户钱包中的授权账户。

🌐 联网！
-----------

现在，是见证奇迹的时候了! 请看下面的视频。
[Loom](https://www.loom.com/share/1d30b147047141ce8fde590c7673128d?t=0)

🚨 要求。在你点击 "下一课 "之前
-------------------------------------------

在过去的两节课中，我们刚刚做了很多。 有什么问题吗？请务必在#section-2-help中提问!
