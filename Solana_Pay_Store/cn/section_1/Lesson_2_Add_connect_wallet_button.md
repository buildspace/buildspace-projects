现在我们已经设置了基础代码，我们可以开始使用钱包连接按钮。 我正在使用 [Phantom 钱包](https://phantom.app/)，但你也可以使用其他任何钱包！ 请注意，我还没有用其他钱包测试过这个。

使用基础模板的美妙之处在于它已经包含了我们所需的很多代码。 我删除了大部分无用的代码🙈，我们可以专注于有用的部分并了解它是如何工作的。

### 🤖 设置 RPC

我们需要做的第一件事是设置应用程根目录中的 `_app.js` 来查找钱包并连接到它们。下面是它的代码：

```jsx 
import React, { useMemo } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import {
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

import "@solana/wallet-adapter-react-ui/styles.css";
import "../styles/globals.css";
import "../styles/App.css";

const App = ({ Component, pageProps }) => {
  // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Component {...pageProps} />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
```

这里有很多外部导入的库。 不用担心，您只需要了解它们各自的用途即可，无需深入了解它们的工作原理。

我关注到的第一件事就是一些 React 导入。 [`useMemo()`](https://reactjs.org/docs/hooks-reference.html#usememo) 是一个 React 挂钩，仅当其中一个依赖项发生变化时才加载内容。 在我们的例子中，如果用户连接的 **网络** 没有改变，那么 clusterApiUrl 的值也不会改变。

我们导入的第一个 Solana 是来自 [`@solana/wallet-adapter-base`](https://github.com/solana-labs/wallet-adapter/tree/master/packages/core/base) 。 这只是可用网络的枚举对象。

`WalletModalProvider` 就是。。额。。——一个花哨的 React 组件，会提示用户选择他们的钱包。 Ezpz。

`ConnectionProvider` 和 `WalletProvider` 可能是最重要的。

`ConnectionProvider` 是一个 RPC 端点，让我们直接与 Solana 区块链上的节点通信。 我们将在整个应用程序中使用它来发送交易。

`WalletProvider` 为我们提供了一个连接各种钱包的标准接口，因此我们不必为每个钱包查阅文档，嘿嘿。

接下来你会看到一堆来自 `wallet-adapter-wallets` 的钱包适配器。 我们将使用从这里导入的内容来创建一个钱包列表，我们将提供给 WalletProvider。 还有很多其他钱包适配器可用，甚至有些是为其他区块链制作的！ 在 [此处](https://github.com/solana-labs/wallet-adapter/blob/master/PACKAGES.md#wallets) 查看它们。 我只是选择了默认的初始值。

最后，我们看到 `clusterApiURL`，它只是一个函数，它根据我们提供的网络为我们生成一个 RPC 端点。

对于React App组件中的return语句，我们用一些[context](https://reactjs.org/docs/context.html#contextprovider)提供程序来包装子语句(应用程序的其余部分)。

综上：这个文件是我们 web 应用程序的**开始**。 我们在此处提供的任何内容都可供我们应用程序的其余部分访问。 我们在这里提供所有钱包和网络工具，因此我们不需要查看注入到 “Window” 组件中的 “Solana” 对象，也不必在每个子组件中重新初始化它们。

我从 Next.js 模板中复制了所有这些，所以不要对复制/粘贴感到惭愧（这次）。

### 🧞‍♂️ 使用 RPC 连接到钱包

哇，那一堆的设置真烦琐! 现在您可以看到它使与钱包的交互变得多么容易。我们所要做的就是设置一些React钩子。这是我的 `index.js`:

```jsx
import React from 'react';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from "next/dynamic";

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
// Dynamic import `WalletMultiButton` to prevent hydration error
const WalletMultiButtonDynamic = dynamic(
    async () =>
      (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
  );
  
  // This will fetch the users' public key (wallet address) from any wallet we support
  const { publicKey } = useWallet();

  const renderNotConnectedContainer = () => (
    <div>
      <img src="https://media.giphy.com/media/eSwGh3YK54JKU/giphy.gif" alt="emoji" />

      <div className="button-container">
        <WalletMultiButtonDynamic className="cta-button connect-wallet-button" />
      </div>    
    </div>
  );

  return (
    <div className="App">
      <div className="container">
        <header className="header-container">
          <p className="header"> 😳 Buildspace Emoji Store 😈</p>
          <p className="sub-text">The only emoji store that accepts shitcoins</p>
        </header>

        <main>
          {/* We only render the connect button if public key doesn't exist */}
          {publicKey ? 'Connected!' : renderNotConnectedContainer()}

        </main>

        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src="twitter-logo.svg" />
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

挺简单的，是吗？ `useWallet()` 将为我们提供应用程序中已连接用户的地址。 它订阅了我们在 `_app.js` 中设置的 RPC。

### 🚨 进度报告
请一定记得报告，否则小猫咪会很伤心💔地喵喵叫:(

我们现在有一个适当的 *web3* 应用程序！

**上传你的钱包连接模式的截图 >:D**






