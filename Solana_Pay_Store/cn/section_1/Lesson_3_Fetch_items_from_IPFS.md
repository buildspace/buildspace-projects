我们伟大冒险的是：下一步将向我们的商店添加商品。 这里的大问题是：您将文件存储在哪里？ 您可以将它们放在 AWS 或其他云服务器上，但这不是 web3。 相反，我们将使用 [IPFS](https://en.wikipedia.org/wiki/InterPlanetary_File_System)，它本质上是一个分布式文件系统。 今天 — 您可能会使用 S3 或 GCP 存储之类的东西。 但是，在这种情况下，我们可以简单地信任由使用网络的陌生人运行的 IPFS。 快速阅读 [这个](https://decrypt.co/resources/how-to-use-ipfs-the-backbone-of-web3)， 里面涵盖了很多很好的基础知识:)。

真的，你只需要知道 IPFS 是存储资产的行业标准。 它是不更改的、永久的和去中心化的。

### 🛸 上传文件到 IPFS

IPFS 的使用非常简单。 您需要做的就是将您的文件上传到 IPFS，然后在人们想要下载东西时使用它在 Web 应用程序中返回的唯一的内容 ID hash。

首先，您需要将文件上传到 “[pinning](https://docs.ipfs.io/how-to/pin-files/)”的服务——这意味着您的文件基本上会被缓存所以它很容易检索。 我喜欢使用 [**Pinata**](https://www.pinata.cloud/?utm_source=buildspace) 作为我的 pinning 服务——它们免费为您提供 1 GB 的存储空间，足以容纳数百个资产。 只需注册一个帐户，通过他们的 UI 上传您的商店文件，就是这样！

![](https://hackmd.io/_uploads/ry9MWF8P9.png)

继续并复制 “CID”， 这是IPFS上的文件内容地址！ 现在很棒的是我们可以创建这个链接来访问文件：

```javascript
https://cloudflare-ipfs.com/ipfs/INSERT_YOUR_CID_HERE
```
如果您使用的是**Brave Browser**（内置了IPFS），您只需在URL中键入此链接：

```javascript
ipfs://INSERT_YOUR_CID_HERE
```

这实际上会在您的本地计算机上启动一个 IPFS 节点并检索文件！ 如果您尝试在 Chrome 之类的浏览器上执行此操作，它只会执行 Google 搜索，哈哈。 因此，您不如使用“cloudflare-ipfs” 链接。

现在您知道如何使用 IPFS 了！ 不过在我们的场景中有一个问题——因为 IPFS 上的项目是公开的，**任何人** 如果他们有唯一的内容 ID 哈希就可以访问它们。 稍后我们将探讨保护我们的商店免受此影响的方法；）

### 🎈 从 IPFS 下载文件

有起飞，就一定会有降落。 除非它是登月火箭。 或者我四岁生日时瞒着父母买了 21 个氦气球。 我想知道他们今天在哪里。

从 IPFS 下载文件几乎比上传文件更容易，哈哈。 我在 hooks 文件夹中留下了一个名为 `useIPFS` 的文件。 看看它——它所做的就是将哈希和文件名添加到 IPFS 网关 URL。

您可以在 [此处](https://luke.lol/ipfs.php) 找到其他 IPFS 网关。

这是一个非常小的文件，因此我们可以把它保存在我们将要使用它的组件中，但最好与 hook 分开。 接下来我们将创建一个组件来使用 hook。

在 `components` 文件夹中添加一个名为 `IpfsDownload.js` 的文件并将下方代码添加到其中：

```jsx
import React  from 'react';
import useIPFS from '../hooks/useIPFS';

const IPFSDownload = ({ hash, filename }) => {

  const file = useIPFS(hash, filename);

  return (
    <div>
      {file ? (
        <div className="download-component">
          <a className="download-button" href={file} download={filename}>Download</a>
        </div>
      ) : (
        <p>Downloading file...</p>
      )}
    </div>
  );
};

export default IPFSDownload;
```

是的。 这些真的很简单！ 所有这一切都是在返回一个链接组件，您可以将其放在应用程序的任何位置。 当有人单击该链接时，他们将下载该文件！

### 😔 免费赠品

我撒谎：我们不是在开店。 我们实际上是在建立一个相信世界需要更好的表情符号的慈善机构。

由于我们还没有设置交易，我们只是让人们现在免费下载我们商店的项目。 这将使我们把所有的小问题放在一边并专注于交易。

在 `pages` 目录中创建一个 `api` 文件夹，并在其中添加一个 `products.json` 文件。 这将是我们的模拟 “数据库” 。 我希望你创造一个可以在现实世界中使用的产品，所以当你走上比 Gumroad(一家电子商务平台) 更大的轨道时，你需要做的就是将端点从 `/products.json` 替换成像 Supabase 或 CockroachDB 这样的真实数据库。

这是我的 josn 文件概览，您可以根据您的产品添加或删除字段：

```json
[
  {
    "id": 1,
    "name": "OG Emoji pack",
    "price": "0.09",
    "description": "Get this fire emoji pack for only $0.09! Includes 3 hot emojis: Forreal, Flooshed, and Sheesh!",
    "image_url": "https://i.imgur.com/rVD8bjt.png",
    "filename": "Emojis.zip",
    "hash": "QmWWH69mTL66r3H8P4wUn24t1L5pvdTJGUTKBqT11KCHS5"
  }
]
```

我们关心的主要是 id、name 和 price 字段。

接下来，我们将在 `components` 文件夹中创建一个 `Product.js` 文件。 我们将用它来展示我们的产品。 它看起来像这样：

```jsx
import React from "react";
import styles from "../styles/Product.module.css";
import IPFSDownload from './IpfsDownload';

export default function Product({ product }) {
  const { id, name, price, description, image_url } = product;

  return (
    <div className={styles.product_container}>
      <div >
        <img className={styles.product_image}src={image_url} alt={name} />
      </div>

      <div className={styles.product_details}>
        <div className={styles.product_text}>
          <div className={styles.product_title}>{name}</div>
          <div className={styles.product_description}>{description}</div>
        </div>

        <div className={styles.product_action}>
          <div className={styles.product_price}>{price} USDC</div>
          {/* I'm hardcoding these for now, we'll fetch the hash from the API later*/}
          <IPFSDownload filename="emojis.zip" hash="QmWWH69mTL66r3H8P4wUn24t1L5pvdTJGUTKBqT11KCHS5" cta="Download emojis"/>
        </div>
      </div>
    </div>
  );
}
```

在这之前，我们需要创建一个 API 端点，它可以从我们的 “数据库” 中获取我们的产品。 转到 `pages` 目录中的 `api` 文件夹并添加一个名为 `fetchProducts.js` 的文件：

```jsx
import products from "./products.json"

export default function handler(req, res) {
  // If get request
  if (req.method === "GET") {
    // Create a copy of products without the hashes and filenames
    const productsNoHashes = products.map((product) => {

      const { hash, filename, ...rest } = product;
      return rest;
    });

    res.status(200).json(productsNoHashes);  
  }
  else {
    res.status(405).send(`Method ${req.method} not allowed`);
  }
}
```
您会注意到我们没有使用 hash 值！ 这是因为我们不想在观众为项目付款之前向他们提供哈希值，实际上他们可以直接下载它们，哈哈

现在要使用这个端点和 Product 组件，我们只需要更新我们的 `index.js`:

```jsx
import React, { useEffect, useState } from 'react';
import Product from "../components/Product";

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const { publicKey } = useWallet();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (publicKey) {
      fetch(`/api/fetchProducts`)
        .then(response => response.json())
        .then(data => {
          setProducts(data);
          console.log("Products", data);
        });
    }
  }, [publicKey]);

  const renderNotConnectedContainer = () => (
    <div className="button-container">
      <WalletMultiButton className="cta-button connect-wallet-button" />
    </div>
  );
  
  const renderItemBuyContainer = () => (
    <div className="products-container">
      {products.map((product) => (
        <Product key={product.id} product={product} />
      ))}
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
          {publicKey ? renderItemBuyContainer() : renderNotConnectedContainer()}
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

连接钱包后，您现在应该会在应用程序上看到一个“Download”(下载)按钮！ 单击下载后，我们的 hook 函数将被调用，文件将从 IPFS 获取和下载。 第一次这可能需要一些时间，所以请耐心等待！

请记住，IPFS 上的文件是跨多个节点缓存的，所以如果你 _刚刚_ 上传了一些东西，它只会存在于几个节点上，并且需要一些时间来下载。 您的文件被访问的次数越多，它们被缓存的节点就越多，它们下载的速度就越快！

如果您的文件无法下载，您将不得不切换到不同的 IPFS 网关。 查看[这篇很棒的文章](https://github.com/maxim-saplin/ipfs_gateway_research/blob/main/README.md) 比较流行的选项。

### 🚨 进度报告
请一定记得报告，否则Raza会伤心💔的:(

**上传你在Pinata中上传文件的截图:D**
