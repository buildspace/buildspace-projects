### 👛 安装Phantom钱包
对于这个项目，我们将使用[Phantom](https://phantom.app/)钱包。

这是Solana的顶级钱包扩展之一，实际上是由Solana支持的(所以应该你知道它是正规的)。

在我们深入任何代码之前-请确保您已经下载了钱包插件并设置好了一个Solana钱包!目前，Phantom钱包支持**Chrome**， **Brave**， **Firefox**和**Edge**。但是，需要注意的是:目前我们只在Brave和Chrome上测试了这段代码。

### 👻 使用Solana对象
为了让我们的网站与Solana的dapp进行交互，我们需要以某种方式将我们的钱包(这里是指Phantom钱包)连接到它。

一旦我们钱包连接到网站，网站将有权限代表我们运行dapp中的功能。如果用户不连接他们的钱包，他们就无法与Solana区块链进行通信。

**请记住，这就像认证登陆一个网站**。如果你没有“登录”到G-Mail，那么你就不能使用他们的电子邮件产品!

回到代码，找到在`src`文件夹下的`App.js`,这是我们的dapp的主要入口点。

如果你安装了Phantom钱包，它会自动注入一个名为`solana`的特殊对象到你的`窗口`，并添加一些神奇的功能。这意味着在我们做任何事情之前，都需要检查它是否存在。如果它不存在，告诉用户去下载它:

```jsx
/*
 * We are going to be using the useEffect hook!
 */
import React, { useEffect } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Change this up to be your Twitter if you want.
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  /*
   * This function holds the logic for deciding if a Phantom Wallet is
   * connected or not
   */
  const checkIfWalletIsConnected = async () => {
  // We're using optional chaining (question mark) to check if the object is null
    if (window?.solana?.isPhantom) {
      console.log('Phantom wallet found!');
    } else {
      alert('Solana object not found! Get a Phantom Wallet 👻');
    }
  };

  /*
   * When our component first mounts, let's check to see if we have a connected
   * Phantom Wallet
   */
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
```
好的!看起来还不错?让我们逐行来分析一下:
```jsx
const checkIfWalletIsConnected = async () => {
    if (window?.solana?.isPhantom) {
      console.log('Phantom wallet found!');
    } else {
      alert('Solana object not found! Get a Phantom Wallet 👻');
    }
  };
```
我们这里的函数是检查DOM中的`窗口`对象，以查看Phantom钱包是否注入了`solana`对象。如果我们确实有一个`solana`对象，我们也可以检查它是否是安装了Phantom钱包。

由于我们已经使用 Phantom钱包对这个项目进行了全面地测试，我们建议您一直使用它。不过，您也可以探索并使用其他钱包👀。
```jsx
useEffect(() => {
  const onLoad = async () => {
    await checkIfWalletIsConnected();
  };
  window.addEventListener('load', onLoad);
  return () => window.removeEventListener('load', onLoad);
}, []);
```
最后，我们只需要调用这段代码!

在React中，当第二个参数(`[]`)为空时，钩子函数`useEffect`在组件装载时被调用一次。所以，这对我们来说是完美的。只要有人打开我们的dapp，我们就可以检查他们是否安装了Phantom钱包。看起来这非常重要。

目前，Phantom钱包团队建议等待窗口完全加载完成，然后再检查`solana`对象。一旦这个事件被调用，我们就可以保证只要用户安装了Phantom钱包，那么这个对象就是可用的。

### 🔒访问帐户
所以当你运行代码时去检测时，你应该会看到一行"*Phantom wallet found!*"显示在网站控制台。
![Untitled](https://i.imgur.com/MZQlPl5.png)

接下来，我们需要检测我们是否真正被**授权**访问用户的钱包。一旦我们有了访问权限，我们就可以开始访问Solana应用中的功能🤘.

基本上，**Phantom钱包仅仅是向我们访问的每个网站提供钱包凭证**，并且只是给我们授权过的网站。再次声明，这就像传统网站登录一样。但是，我们在这里做的是**检查我们是否能够“登录”**。

我们需要做的就是在`checkIfWalletIsConnected`函数中再添加一行代码，查看以下代码：
```jsx
const checkIfWalletIsConnected = async () => {
  if (window?.solana?.isPhantom) {
    console.log('Phantom wallet found!');
    /*
    * The solana object gives us a function that will allow us to connect
    * directly with the user's wallet
    */
    const response = await window.solana.connect({ onlyIfTrusted: true });
    console.log(
      'Connected with Public Key:',
      response.publicKey.toString()
    );
  } else {
    alert('Solana object not found! Get a Phantom Wallet 👻');
  }
};
```
这就像调用`connect`一样简单，它告诉Phantom钱包，我们的GIF门户网站被授权访问有关该钱包的信息。有些人可能会问`onlyIfTrusted`属性是什么。

如果用户已经将他们的钱包连接到dapp，标志着将立即提取他们的数据，而不会通过另一个连接弹出窗口提示他们。很漂亮，是吗？ 想知道更多-请查阅来自Phantom的这个[文档](https://docs.phantom.app/integrating/establishing-a-connection#eagerly-connecting) 。

见鬼！*此时，您应该只看到"Phantom wallet found!"* 的日志记录语句！

这是为什么呢?因为`connect`方法只会运行**如果**用户已经授权连接的dapp，**这在以前是从未有过的事**。

因此，让我们初始化这个`connect`!

### 🛍渲染钱包连接按钮

我们已经在检测过用户是否已经连接到我们的dapp。但是如果它们没有连接呢？我们无法在dapp中提示Phantom钱包已连接！

我们需要创建一个`连接钱包`按钮。在web3的世界中，连接你的钱包实际上是为你的用户内置的一个`注册/登录`按钮。

准备好享受人生中最简单的“注册”体验了吗？看过来：
```jsx
import React, { useEffect } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // Actions
  const checkIfWalletIsConnected = async () => {
    if (window?.solana?.isPhantom) {
      console.log('Phantom wallet found!');
      const response = await window.solana.connect({ onlyIfTrusted: true });
      console.log(
        'Connected with Public Key:',
        response.publicKey.toString()
      );
    } else {
      alert('Solana object not found! Get a Phantom Wallet 👻');
    }
  };

  /*
   * Let's define this method so our code doesn't break.
   * We will write the logic for this next!
   */
  const connectWallet = async () => {};

  /*
   * We want to render this UI when the user hasn't connected
   * their wallet to our app yet.
   */
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  // UseEffects
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
          {/* Render your connect to wallet button right here */}
          {renderNotConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
```
好了!现在你的页面上会呈现一个很酷的渐变色按钮，上面写着`Connect to Wallet`。
![Untitled](https://i.imgur.com/TmZWnqn.png)

这里最需要理解的是**渲染方法**。

*注意:如果你已经熟悉React和render方法，请随意浏览本节*。

这些只是返回一些**UI代码的函数**。我们希望在没有真正将钱包连接到我们的dapp时呈现“Connect to Wallet”按钮。

你可能会疑惑:“*我们的dapp如何控制渲染这个按钮的时机*“?

首先，你需要如下这样导入`useState`到你的组件中:
```jsx
import React, { useEffect, useState } from 'react';
```

然后，在`checkIfWalletIsConnected`函数的上方添加如下状态声明:
```jsx
// State
const [walletAddress, setWalletAddress] = useState(null);
```
非常好！所以现在我们已经准备以自信满满的心态，更新一些我们代码：
```jsx
import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // State
  const [walletAddress, setWalletAddress] = useState(null);

  // Actions
  const checkIfWalletIsConnected = async () => {
    if (window?.solana?.isPhantom) {
      console.log('Phantom wallet found!');
      const response = await window.solana.connect({ onlyIfTrusted: true });
      console.log(
        'Connected with Public Key:',
        response.publicKey.toString()
      );

      /*
       * Set the user's publicKey in state to be used later!
       */
      setWalletAddress(response.publicKey.toString());
    } else {
      alert('Solana object not found! Get a Phantom Wallet 👻');
    }
  };

  const connectWallet = async () => {};

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  // UseEffects
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return (
    <div className="App">
			{/* This was solely added for some styling fanciness */}
			<div className={walletAddress ? 'authed-container' : 'container'}>
        <div className="header-container">
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
          {/* Add the condition to show this only if we don't have a wallet address */}
          {!walletAddress && renderNotConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
```

看着这些奇妙的React，让我们快速浏览一下改变之处:

```jsx
const checkIfWalletIsConnected = async () => {
  if (window?.solana?.isPhantom) {
    console.log('Phantom wallet found!');
    const response = await window.solana.connect({ onlyIfTrusted: true });
    console.log(
      'Connected with Public Key:',
      response.publicKey.toString()
    );

    /*
     * Set the user's publicKey in state to be used later!
     */
    setWalletAddress(response.publicKey.toString());
  } else {
    alert('Solana object not found! Get a Phantom Wallet 👻');
  }
};
```
不言而喻，我们刚刚连接了Phantom钱包，并收到了来自用户钱包的数据。现在我们有了它，让我们继续将它保存在我们的状态中以备后用。
```jsx
{/* Add the condition to show this only if we don't have a wallet address */}
{!walletAddress && renderNotConnectedContainer()}
```
这是一段非常酷的代码。如果我们的状态中没有设置`walletAddress`，我们告诉React只是调用这个渲染方法。这称为 [**条件渲染**](https://reactjs.org/docs/conditional-rendering.html)，它将帮助我们跟踪想要在dapp中显示的不同状态！

```jsx
{/* This was solely added for some styling fanciness */}
<div className={walletAddress ? 'authed-container' : 'container'}>
```
现在我们已经看到了一些条件渲染，希望这有一点意义!我们想要修改一些CSS的基本样式，这取决于是否具有`walletAddress`。在下一节构建GIF网格时，您将看到其中的区别。

### 🔥 好的——现在连接到真正的钱包😁
马上就快要完成了，如果你点击新按钮，你会发现它仍然不起任何作用！真见鬼-这太差劲了👎。

还记得我们设置的一个函数，但没有添加任何逻辑吗?是时候给`connectWallet`添加连接逻辑了:

```jsx
const connectWallet = async () => {
  const { solana } = window;

  if (solana) {
    const response = await solana.connect();
    console.log('Connected with Public Key:', response.publicKey.toString());
    setWalletAddress(response.publicKey.toString());
  }
};
```
很简单!调用`solana`对象上的`connect`函数来处理钱包授权给我们GIF门户的所有奇思妙想。然后我们将设置`walletAddress`的属性，这样我们的页面将更新并删除`Connect to Wallet`按钮。

继续刷新您的页面，并按下`Connect to Wallet`按钮!如果一切正常，你应该最终看到Phantom钱包如下所示:
![https://i.imgur.com/XhaYIuk.png](https://i.imgur.com/XhaYIuk.png)

一旦你按下`Connect`，然后一切将会消失!

**您刚刚已经将Solana钱包连接到您的dapp，简直难以置信。**

现在，如果您刷新页面，您的`checkIfWalletIsConnected`函数将被调用，按钮几乎会立即消失🤘。

好了，该迎接我们的大动作了！

您已经设置了基本的UI，并且可以使用Solana钱包轻松地“认证”用户。EZPZ(easy peasy).

接下来，我们将完成所有的设置，调用Solana程序所需的函数来获取一些数据。我们的网页dapp有点无聊，让我们修改一些代码:)。

*注意:在你的Pthantom钱包设置(你可以通过点击右下角的齿轮)中，你会看到一个"Trusted Apps"部分。在这里，你会看到你的Replit URL，或者'localhost:3000'如果你是在本地运行dapp。如果您想测试从未连接过您的站点的用户的情况，请随意撤销此设置，它基本上会重置你的钱包访问这个网站*。

### 🚨 进度证明提交
*请一定要提交否则Fraza会伤心的💔*

在`#progress`频道中发布你的控制台截图，展示你的公钥和连接的钱包。别担心，您可以放心的分享您的公钥,因为它本身就是“公开的”。






































