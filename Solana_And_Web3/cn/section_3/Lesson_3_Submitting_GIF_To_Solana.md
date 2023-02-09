好了——我们终于可以保存一些 GIF 了。 这很容易做到。 我们只要稍微改变一下我们的 `sendGif` 函数，并添加最后一个 `import` 。
所以我们现在要调用 `addGif` 然后调用 `getGifList` 以便我们的网络 dapp 刷新以显示最新提交的 GIF！

```javascript
// Other imports...
// Add this 2 new lines
import { Buffer } from "buffer";
window.Buffer = Buffer;

const sendGif = async () => {
  if (inputValue.length === 0) {
    console.log("No gif link given!")
    return
  }
  setInputValue('');
  console.log('Gif link:', inputValue);
  try {
    const provider = getProvider()
    const program = await getProgram(); 

    await program.rpc.addGif(inputValue, {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      },
    });
    console.log("GIF successfully sent to program", inputValue)

    await getGifList();
  } catch (error) {
    console.log("Error sending GIF:", error)
  }
};
```

现在，您将能够提交一个链接，通过 Phantom 批准交易，您的网络 dapp 现在应该会显示您刚刚提交的 GIF :)。

### 🙈 解决账号不能记住的问题

之前，我们已经讨论过这个问题，每次刷新页面时，我们的帐户都会被重置。让我们来解决它。

核心问题是这一行:

```javascript
let baseAccount = Keypair.generate();
```

这里发生的事情是我们正在为程序生成一个新帐户以使**每次都与之通信**。因此，这里的解决方法是我们只需要有一个所有用户可以共享的密钥对。

在 `src` 目录下，继续创建一个名为 `createKeyPair.js` 的文件。 将以下内容粘贴到进去

```javascript
// Shoutout to Nader Dabit for helping w/ this!
// https://twitter.com/dabit3

const fs = require('fs')
const anchor = require("@project-serum/anchor")

const account = anchor.web3.Keypair.generate()

fs.writeFileSync('./keypair.json', JSON.stringify(account))
```

这个脚本所做的就是将一个密钥对直接写入我们的文件系统，这样无论何时人们访问我们的网络dapp ，他们都会加载相同的密钥对。

当您准备好运行它时，请继续执行以下操作：

```bash
cd src
node createKeyPair.js
```

输入 `cd` 进入目录 `createKeyPair.js` 所在的位置。

这将用我们密钥对生成一个名为 `keypair.json` 的文件 :)。

**Replit 用户注意事项**：您实际上可以直接在 Replit 中运行 shell 命令。 单击“Shell”一词，然后只需执行 `cd src`，然后执行 `node createKeyPair.js`，它就会像使用本地终端一样工作！

现在我们有了这个文件，我们只需要稍微改变一下 `App.js`。 在顶部，您需要像这样导入密钥对：

```javascript
import kp from './keypair.json'
```

接下来，删除 `let baseAccount = Keypair.generate()`;  然后，我们将用这个替换它：

```javascript
const arr = Object.values(kp._keypair.secretKey)
const secret = new Uint8Array(arr)
const baseAccount = web3.Keypair.fromSecretKey(secret)
```

是的，就是这样。 现在，我们有了一个永久的密钥对！ 如果您去刷新，您会在初始化帐户后看到它 — 它甚至在刷新后仍然存在！！！ 随意从这里提交一些 GIF。

您还可以根据需要多次运行 `createKeyPair.js`，这样您就可以创建一个新的 `BaseAccount`。 不过，这也意味着新帐户将完全为空且没有数据。 重要的是要了解您**不会在再次运行**`createKeyPair.js` 时删除帐户。 您只需为您的程序创建一个指向的新帐户。

### 🚨 进度报告

*请一定记得要报告，否则 Farza 会伤心的💔*

你完成了 GIF 的提交工作！ 在 `#progress` 频道中发布包含从 Solana 程序中检索到的 GIF 截图。
