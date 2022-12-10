### ✅ 在 devnet 上运行测试

在我开始集成网络 dappp 之前，我实际上喜欢在此时运行 `anchor test` 。 这可能会使我们免于一些随机的、烦人的错误。

因为我们的配置设置为 devnet，Anchor 实际上会直接在 devnet 上运行我们的测试，这正是我们想要的。 这样我们就可以确保我们的实际功能在 devnet 上能够正常工作！

继续，运行：

```bash
anchor test
```

只要没有崩溃，它将向您显示如下类似的内容：

```bash
Deploy success
🚀 Starting test...
📝 Your transaction signature 41aW8pAtFLyxgg1S54EATUSKSXB9LKe1qSGgLvuy3Fh58vWgiHuXK8jsrtRy5Spm32xCytXoNyJTMKVpa4ZHcnEB
👀 GIF Count 0
👀 GIF Count 1
👀 GIF List [
  {
    gifLink: 'insert_a_giphy_link_here',
    userAddress: PublicKey {
      _bn: <BN: 368327095334a46e8bf98ccfd43f4662111b633d3989f6f9df869306bcc64458>
    }
  }
```

然后我们就可以开始了。

这里真正有趣的是，如果您转到 [Solana Explorer](https://explorer.solana.com/?cluster=devnet) 并粘贴您的 program ID（就像您之前所做的那样），您将在那里看到一些新交易记录。 这些是由您刚刚运行的测试生成的！ 可以随时去查看。

我应该在这里提一些非常重要的事情。 当你刚才运行 `anchor test` 时，它实际上会重新部署程序，然后运行脚本上的所有功能。

您可能会疑惑，“为什么要重新部署？为什么它不能与已部署的程序通信？另外，如果我们重新部署，它会不会被部署到一个完全不同的 program ID 上？”。

**所以 — Solana 程序是 [可升级的](https://docs.solana.com/cli/deploy-a-program#redeploy-a-program)。** 这意味着当我们重新部署时，我们正在更新同一个 program ID 对应的程序的最新版本。 而且，这里很酷的是程序与之通信的*帐户*会被保留下来——记住，这些帐户着保存与程序相关的数据。

**这意味着我们可以升级程序，同时保持数据片段独立**。 很酷，对吧:)？

*注意：这与以太坊**非常非常**不同，以太坊一旦部署就永远无法更改智能合约！*

### 🤟 将 IDL 文件连接到网络 dapp

我们现在有一个已部署好的 Solana 程序。 让我们将它连接到我们的网络 dapp:)。

我们首先需要的是 `idl` 文件，它是在您不知情的情况下由 `anchor build` 之前神奇地创建的。 您应该在 `target/idl/myepicproject.json` 中看到它。

`idl` 实际上只是一个 JSON 文件，其中包含有关我们的 Solana 程序的一些信息，例如我们的函数名称和它们接受的参数。 这有助于我们的网络 dapp 真正知道如何与部署的程序进行交互。

您还会在底部附近看到它有我们的 program ID！ 这就是我们的网络 dapp 是如何知道实际连接到哪个程序的方式。 在 Solana 上部署了*数百万*个程序，这个地址是我们的网络 dapp 可以独立快速访问我们的程序的方式。

![](https://i.imgur.com/bnorlgJ.png)

*注意：如果您没有看到 idl 文件或在底部附近没有看到“地址”参数，那么一定是出了问题！ 从项目的“将程序部署到 devnet”部分重新开始。*

我们如何将 idl 传送给网络 dapp ？
我们可以复制 idl 文件并在网络 dapp 上打开它，或者我们可以直接将 idl 文件上传到 solana，稍后从我们的网络 dapp 中获取它！

```
anchor idl init  -f target/idl/myepicproject.json `solana address -k target/deploy/myepicproject-keypair.json`
```

基本上我们这是告诉 anchor 上传我们的 idl 到项目地址，很好！

> 请注意，每次重新部署 solana 程序时，您需要告诉 solana 您的程序 api 是什么样的，我们可以使用 `anchor idl upgrade` 而不是 `anchor idl init`

转到您的网络 dapp。

### 🌐 更改 Phantom 连接的网络

目前，Phantom 可能已连接到 Solana 主网。 我们需要它来连接到 Solana Devnet。 您可以通过转到设置（单击左上角的小头像图标），单击“开发人员设置”，单击“更改网络”，然后单击“Devnet”来更改此设置。就这样！

![](https://i.imgur.com/JWHwPJX.png)

### 👻 给 Phantom 钱包充值

我们还需要用一些 SOL 测试币给我们的 Phantom 钱包使用。 **读取数据** 在 Solana 上是免费的。 但是创建帐户和向帐户写入数据等操作需要花费 SOL。

您需要 Phantom 钱包相关联的公共地址，您可以通过单击顶部获取该地址：

![](https://i.imgur.com/3I2Wjv3.png)

现在，继续从您的终端运行：

```bash
solana airdrop 2 INSERT_YOUR_PHANTOM_PUBLIC_ADDRESS_HERE  --url devnet
```

现在，当你回到你的 Phantom 钱包时，在你的 devent 网络上应该能看到 2 个 SOL 测试币。 好的 ：）。

### 🍔 在我们的网络 dapp 上设置一个 Solana `provider`

在您的网络 dapp 中，我们需要安装两个库。 您可能记得为您的 Anchor 项目安装了这些，我们也将在我们的网络 dapp 中继续使用它们 :)。

```bash
npm install @project-serum/anchor @solana/web3.js
```
*注意：如果你使用的是 Replit，你应该已经预装了这些。 如果你不这样做并且稍后开始出现错误，你可以通过单击“Shell”然后像在普通终端中一样运行命令来安装库。 他们在左侧边栏上还有一个精美的“Packages”安装程序。*

在我们可以与之前安装的库进行交互之前，我们需要将它们导入到我们的网络应用程序中！ 在 `App.js` 的顶部添加以下代码行：

```javascript
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
```

*注意（仅适用于 Replit 用户）：*

1. *如果出现 `global is not defined` 错误，请将 `vite.config.js`文件更改为：*
```javascript
import reactRefresh from '@vitejs/plugin-react-refresh';
import { defineConfig } from "vite";
/**
 * https://vitejs.dev/config/
 * @type { import('vite').UserConfig }
 */
export default defineConfig({
  define: {
    global: {},
    process: {
      'env': {}
    } 
  },
  plugins: [reactRefresh()],
  server: {
    host: '0.0.0.0',
    hmr: {
      port: 443,
    }
  }
})
```
2. *如果出现 `buffer` 错误, 在 `App.jsx` 文件中添加如下代码行:*
```javascript
import { Buffer } from 'buffer';
window.Buffer = Buffer;
```

### 🧑‍🎄 添加 `getProvider` 函数

让我们创建一个 `getProvider `函数, 并将其添加到 `onInputChange`下方。 代码如下：
```javascript
const getProvider = () => {
  const connection = new Connection(network, opts.preflightCommitment);
  const provider = new AnchorProvider(
    connection, window.solana, opts.preflightCommitment,
  );
  return provider;
}
```

这当然会弹一堆错误，因为我们没有任何变量，哈哈。 这是我们创建的一个 `provider`，它是 一个 **通过身份认证的 Solana 链接**。 注意这里是`window.solana` 必需的！

为什么？ 因为要成为一个“provider”，我们需要一个可以连接的钱包。 **你之前已经这样做了**当你点击 Phantom 上的“连接”时，它将允许我们的网络 dapp 访问我们的钱包。
![https://i.imgur.com/vOUldRN.png](https://i.imgur.com/vOUldRN.png)

**除非你有一个已连接的钱包，否则你根本无法与 Solana 通信， 甚至无法从 Solana 检索数据！**

这是 Phantom 用处所在。 它为我们的用户提供了一种简单、安全的方式来将他们的钱包连接到我们的网站，这样我们就可以创建一个“provider”，让我们可以与 Solana 上的程序对话 :)。

让我们创建一些我们缺少的变量， 这还需要导入一些东西。

继续并将此代码添加到 `app.js`：

```javascript
import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import { Connection, PublicKey, clusterApiUrl} from '@solana/web3.js';
import {
  Program, AnchorProvider, web3
} from '@project-serum/anchor';

// SystemProgram is a reference to the Solana runtime!
const { SystemProgram, Keypair } = web3;

// Create a keypair for the account that will hold the GIF data.
let baseAccount = Keypair.generate();

// This is the address of your solana program, if you forgot, just run solana address -k target/deploy/myepicproject-keypair.json
const programID = new PublicKey(YOUR_PROGRAM_ADDRESS_HERE);

// Set our network to devnet.
const network = clusterApiUrl('devnet');

// Controls how we want to acknowledge when a transaction is "done".
const opts = {
  preflightCommitment: "processed"
}

// All your other Twitter and GIF constants you had.

const App = () => {
	// All your other code.
}
```

一切都非常简单，当我们稍后开始使用这些变量时，事情会变得更有意义。

`SystemProgram` 是我们已经讨论过的运行 Solana 的[核心程序](https://docs.solana.com/developing/runtime-facilities/programs#system-program) 的引用。 `Keypair.generate()` 为我们提供了一些参数，我们需要这些参数来创建 `BaseAccount` 帐户，该帐户将为我们的程序保存 GIF 数据。

然后，我们重用我们的 programID 来告诉 Solana 运行时我们正在尝试与哪个程序通信，最后我们确保通过执行 `clusterApiUrl('devnet')` 连接到 devnet。

这个 `preflightCommitment: "processed"` 很有趣。 您可以 [此处](https://solana-labs.github.io/solana-web3.js/modules.html#Commitment) 稍微阅读一下。 这基本上，决定了我们可以选择 *何时* 收到交易成功的确认。 因为区块链是完全去中心化的，我们可以选择等待交易的时间。 我们是否只想等待一个节点确认我们的交易？ 我们是否要等待整个 Solana 链确认我们的交易？

在这种情况下，我们只需等待我们连接的*节点*确认我们的交易。 这通常没问题——但如果你想多点确认，你可以使用 `finalized`来代替。 但是现在，我们使用 `processed`。

### 🏈 从我们的程序帐户中检索 GIFs

现在调用我们的 dapp 非常简单，因为我们已经设置好了一切。这是一个简单的 `fetch`  用来来获得帐户-类似于调用API的方式。还记得这段代码吗?

```javascript
useEffect(() => {
  if (walletAddress) {
    console.log('Fetching GIF list...');

    // Call Solana Program

    // Set state
    setGifList(TEST_GIFS);
  }
}, [walletAddress]);
```

我们仍然在使用 `TEST_GIFS`！ 这是不行的。 让我们调用我们的 dapp。 它应该返回一个空的 GIF 列表，对吗？ 因为我们还没有真正添加任何 GIF。

让我们将其更改为以下内容：

```javascript
const getProgram = async () => {
  // Get metadata about your solana program
  const idl = await Program.fetchIdl(programID, getProvider());
  // Create a program that you can call
  return new Program(idl, programID, getProvider());
};

const getGifList = async() => {
  try {
    const program = await getProgram(); 
    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    
    console.log("Got the account", account)
    setGifList(account.gifList)

  } catch (error) {
    console.log("Error in getGifList: ", error)
    setGifList(null);
  }
}

useEffect(() => {
  if (walletAddress) {
    console.log('Fetching GIF list...');
    getGifList()
  }
}, [walletAddress]);
```

### 🤬 见鬼的错误信息！！

当您刷新页面时，您会收到如下错误信息：

![](https://i.imgur.com/wUArqKJ.png)

嗯—— "Account does not exist"。

当我第一次看到这个错误时，着实把我给搞糊涂了。 最初，我认为这意味着我的钱包“帐户”不存在。

但是，这个错误实际上意味着我们程序的 `BaseAccount` 不存在。

这是有道理的，我们还没有通过 `startStuffOff` 初始化帐户!!我们的账户不是凭空创建的。我们来做一下。

### 🔥 调用 `startStuffOff` 初始化程序

让我们构建一个简单的函数来调用 `startStuffOff`。 您将要在 `getProvider` 函数下添加它！

这看起来就像我们在测试脚本中使用它一样！

```javascript
const createGifAccount = async () => {
  try {
    const provider = getProvider();
    const program = await getProgram();
    
    console.log("ping")
    await program.rpc.startStuffOff({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount]
    });
    console.log("Created a new BaseAccount w/ address:", baseAccount.publicKey.toString())
    await getGifList();

  } catch(error) {
    console.log("Error creating BaseAccount account:", error)
  }
}
```

然后，我们只需要修改 `renderConnectedContainer` 来解决以下这两种情况：

1. 用户已连接他们的钱包，但 `BaseAccount` 账户**未**被创建。 创建一个按钮来生成帐户。
2. 用户已经连接了他们的钱包，并且 `BaseAccount` 存在。那么 `gifList` 并让人们提交一个 GIF。

```jsx
const renderConnectedContainer = () => {
// If we hit this, it means the program account hasn't been initialized.
  if (gifList === null) {
    return (
      <div className="connected-container">
        <button className="cta-button submit-gif-button" onClick={createGifAccount}>
          Do One-Time Initialization For GIF Program Account
        </button>
      </div>
    )
  } 
  // Otherwise, we're good! Account exists. User can submit GIFs.
  else {
    return(
      <div className="connected-container">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            sendGif();
          }}
        >
          <input
            type="text"
            placeholder="Enter gif link!"
            value={inputValue}
            onChange={onInputChange}
          />
          <button type="submit" className="cta-button submit-gif-button">
            Submit
          </button>
        </form>
        <div className="gif-grid">
					{/* We use index as the key instead, also, the src is now item.gifLink */}
          {gifList.map((item, index) => (
            <div className="gif-item" key={index}>
              <img src={item.gifLink} />
            </div>
          ))}
        </div>
      </div>
    )
  }
}
```

非常简单！ 我对 `gifList.map` 做了一些改动。 注意看那些改动之处！

### 🥳 让我们测试一下！

让我们继续测试吧！ 如果你刷新页面并连接你的钱包，你会看到“Do One-Time Initialization For GIF Program Account”。 当你点击这个时，你会看到 Phantom 提示你用一些 SOL 支付交易！！

如果一切顺利，那么您将在控制台中看到：

![](https://i.imgur.com/0CdFajf.png)

所以，在这里我们创建了一个帐户*然后*检索了该帐户！！ 而且，`gifList` 是空的，因为我们还没有向这个帐户添加任何 GIF！ **NICEEEEE.**

**当然，现在您会注意到，每次我们刷新页面时，它都会要求我们重新创建一个帐户。 我们稍后会解决这个问题，但为什么会发生这种情况？ 我在下面制作了一个关于它的小视频**

[LOOM](https://www.loom.com/share/fc1cf249073e45d6bf31d985b4b11580)

### 🚨 进度报告

*请一定记得要报告，否则 Farza 会伤心的💔*

在在 `#progress` 频道中发布您的控制台中显示 “Got the account" 内容的屏幕截图 :)。








