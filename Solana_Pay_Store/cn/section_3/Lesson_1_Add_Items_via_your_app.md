你成功了！ 很好！

你有一个功能齐全的商店，可以出售任何你想要的东西！ 让我们通过将其作为 IPFS 的门户来完成它。

我们将添加一些函数，让您可以（店主）**从前端向商店添加商品！**。

首先，在您的项目根目录中创建一个 .env 文件，并在其中添加您的地址。 这是我的 .env 文件的样子：

```
NEXT_PUBLIC_OWNER_PUBLIC_KEY=B1aLAAe4vW8nSQCetXnYqJfRxzTjnbooczwkUJAr7yMS
```

**注意：** NextJs 内置了 dotenv，但您**需要**使用 “NEXT_PUBLIC” 启动公开可用的环境变量。 另请注意，您需要重新启动 Next 以获取对 .env 的更改。

是时候使用另一个组件了！ 在 `components` 文件夹中添加 `CreateProduct.js`文件。

```jsx
import React, { useState } from "react";
import { create } from "ipfs-http-client";
import styles from "../styles/CreateProduct.module.css";

const client = create("https://ipfs.infura.io:5001/api/v0");

const CreateProduct = () => {

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image_url: "",
    description: "",
  });
  const [file, setFile] = useState({});
  const [uploading, setUploading] = useState(false);

  async function onChange(e) {
    setUploading(true);
    const files = e.target.files;
    try {
      console.log(files[0]);
      const added = await client.add(files[0]);
      setFile({ filename: files[0].name, hash: added.path });
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
    setUploading(false);
  }

  const createProduct = async () => {
    try {
      // Combine product data and file.name
      const product = { ...newProduct, ...file };
      console.log("Sending product to api",product);
      const response = await fetch("../api/addProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
      const data = await response.json();
      if (response.status === 200) {
        alert("Product added!");
      }
      else{
        alert("Unable to add product: ", data.error);
      }

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.background_blur}>
      <div className={styles.create_product_container}>
        <div className={styles.create_product_form}>
          <header className={styles.header}>
            <h1>Create Product</h1>
          </header>

          <div className={styles.form_container}>
            <input
              type="file"
              className={styles.input}
              accept=".zip,.rar,.7zip"
              placeholder="Emojis"
              onChange={onChange}
            />
            {file.name != null && <p className="file-name">{file.filename}</p>}
            <div className={styles.flex_row}>
              <input
                className={styles.input}
                type="text"
                placeholder="Product Name"
                onChange={(e) => {
                  setNewProduct({ ...newProduct, name: e.target.value });
                }}
              />
              <input
                className={styles.input}
                type="text"
                placeholder="0.01 USDC"
                onChange={(e) => {
                  setNewProduct({ ...newProduct, price: e.target.value });
                }}
              />
            </div>
            
            <div className={styles.flex_row}>
              <input
                className={styles.input}
                type="url"
                placeholder="Image URL ex: https://i.imgur.com/rVD8bjt.png"
                onChange={(e) => {
                  setNewProduct({ ...newProduct, image_url: e.target.value });
                }}
              />
            </div>      
            <textarea
              className={styles.text_area}
              placeholder="Description here..."
              onChange={(e) => {
                setNewProduct({ ...newProduct, description: e.target.value });
              }}
            />

            <button
              className={styles.button}
              onClick={() => {
                createProduct();
              }}
              disabled={uploading}
            >
              Create Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
```

接下来，我们把下方代码添加到 `index.js` 中，同时检查我们是否是所有者。

```jsx
import React, { useState, useEffect} from "react";
import CreateProduct from "../components/CreateProduct";
import Product from "../components/Product";
import HeadComponent from '../components/Head';

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const { publicKey } = useWallet();
  const isOwner = ( publicKey ? publicKey.toString() === process.env.NEXT_PUBLIC_OWNER_PUBLIC_KEY : false );
  const [creating, setCreating] = useState(false);
  const [products, setProducts] = useState([]);
  
  const renderNotConnectedContainer = () => (
    <div>
      <img src="https://media.giphy.com/media/eSwGh3YK54JKU/giphy.gif" alt="emoji" />

      <div className="button-container">
        <WalletMultiButton className="cta-button connect-wallet-button" />
      </div>    
    </div>
  );
  
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

  const renderItemBuyContainer = () => (
    <div className="products-container">
      {products.map((product) => (
        <Product key={product.id} product={product} />
      ))}
    </div>
  );

  return (
    <div className="App">
      <HeadComponent/>
      <div className="container">
        <header className="header-container">
          <p className="header"> 😳 Buildspace Emoji Store 😈</p>
          <p className="sub-text">The only emoji store that accepts shitcoins</p>

          {isOwner && (
            <button className="create-product-button" onClick={() => setCreating(!creating)}>
              {creating ? "Close" : "Create Product"}
            </button>
          )}
        </header>

        <main>
          {creating && <CreateProduct />}
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

现在，当您连接与所有者相同的钱包时，您应该会在右上角看到一个“Create Product”（创建产品）按钮。 Aaaah 这太漂亮了。

![](https://hackmd.io/_uploads/SkQiCcUPc.png)

我们需要的最后一点是将内容添加到我们的“数据库”的 API 端点。 在 `pages/api` 目录中创建一个 `addProduct.js` 文件：

```jsx
import products from './products.json';
import fs from "fs";

export default function handler(req, res){
  if (req.method === "POST"){
    try {
      console.log("body is ", req.body)
      const { name, price, image_url, description, filename, hash } = req.body;
  
      // Create new product ID based on last product ID
      const maxID = products.reduce((max, product) => Math.max(max, product.id), 0);
      products.push({
        id: maxID + 1,
        name,
        price,
        image_url,
        description,
        filename,
        hash,
      });
      fs.writeFileSync("./pages/api/products.json", JSON.stringify(products, null, 2));
      res.status(200).send({ status: "ok" });
    } catch (error) {
      console.error(error);
      res.status(500).json({error: "error adding product"});
      return;
    }
  }
  else {
    res.status(405).send(`Method ${req.method} not allowed`);
  }
}
```

继续测试吧！ 在IPFS 上传文件是 ✨**神奇的**✨。

### 🤝 让其他人添加内容

我们实际上拥有让其他人添加内容所需的一切。 我们需要做的就是：

1. 公开创建产品表单
2. 在 products.json 中存储“卖家”地址
3. 更新 `createTransaction` 文件中 API 端点以便同时从 `products.json` 中读取“卖家”地址

如果您有一家专注于特定类型商品的商店，那该有多酷？ 您可以添加一些额外的功能来吸引卖家，虽然可能占比很小 (1%)，但*仍然*比 Stripe 和其他支付处理商便宜 (1.9%)！

### 🚨 进度报告

请记得一定报告，否则 Raza 会很难过💔:(

现在，你已经完全做到了！ 我很为你骄傲。

将商品添加到您的商店并分享屏幕截图！



