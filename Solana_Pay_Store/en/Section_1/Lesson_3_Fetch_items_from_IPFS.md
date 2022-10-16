The next step in our mighty adventure is to add items to our store. The big question here is: where do you store your files? You could put them on AWS or another cloud storage provider, but that's not very web3. Instead, we'll use [IPFS](https://en.wikipedia.org/wiki/InterPlanetary_File_System), which is essentially a distributed file system. Today — you might use something like S3 or GCP Storage. But, in this case we can simply trust IPFS which is run by strangers who are using the network. Give [this](https://decrypt.co/resources/how-to-use-ipfs-the-backbone-of-web3) a quick read when you can! Covers a lot of good base knowledge :). 

Really, all you need to know is that IPFS is the industry standard for storing assets. It's immutable, permanent, and decentralized. 

### 🛸 Uploading files to IPFS
Using it is pretty simple. All you need to do is upload your files to IPFS and then use the unique content ID hash it gives you back in your web app when people want to download stuff.

First, you'll need to upload your files to a service that specializes in "[pinning](https://docs.ipfs.io/how-to/pin-files/)" — which means your file will essentially be cached so its easily retrievable. I like using [**Pinata**](https://www.pinata.cloud/?utm_source=buildspace) as my pinning service — they give you 1 GB of storage for free, which is enough for 100s of assets. Just make an account, upload your store files through their UI, and that's it! 

![](https://hackmd.io/_uploads/ry9MWF8P9.png)

Go ahead and copy the files "CID". This is the files content address on IPFS! What's cool now is we can create this link to access the file:

```javascript
https://cloudflare-ipfs.com/ipfs/INSERT_YOUR_CID_HERE
```

If you are using **Brave Browser** (which has IPFS built in) you can just type this paste into the URL:

```javascript
ipfs://INSERT_YOUR_CID_HERE
```

And that'll actually start an IPFS node on your local machine and retrieve the file! If you try to do it on something like Chrome it just does a Google search lol. Instead you'll have to use the `cloudflare-ipfs` link.

And now you know how to use IPFS! There's a catch in our scenario though - since items on IPFS are public, **anyone** can access them if they have the unique content ID hash. We'll explore methods of protecting our stores from this later ;)

### 🎈 Downloading files from IPFS
Whatever goes up, must come down. Unless it's a rocket to the moon. Or the 21 helium balloons I bought on my fourth birthday without telling my parents. I wonder where they are today. 

Downloading files from IPFS is almost easier than uploading them lol. I've left a file called `useIPFS` in the hooks folder. Take a look at it - all it does is add the hash and filename to an IPFS gateway URL.

You can find other public IPFS gateways [here](https://luke.lol/ipfs.php).

This is a pretty small file so we could keep it in the component we'll use it in but it's good practice to separate hooks. Next we're going to create a component to use this hook. 

Add a file named `IpfsDownload.js` in the `components` folder and add this to it:
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

Yes. It really is **THAT** easy! All this does is return a link component that you can put anywhere in your app. When someone clicks that link, they'll download the file!

### 😔 Give away the goods for free
I lied: we're not making a store. We're actually building a charity that believes the world needs better emojis. 

Since we don't have transactions set up yet, we're just going to let people download the items on our store for free right now. This will let us get all the small stuff out of the way and focus on the transactions.

Create an `api` folder in the `pages` directory and add a `products.json` file in it. This is going to be our mock "database". I want you to make a product that you can use in the real world, so when you're on the trajectory to be bigger than Gumroad, all you'll need to do is swap out the endpoint from `/products.json` to a real database like Supabase or CockroachDB.

Here's what mine looks like, you can add or remove fields based on your product:
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

The main fields we care about are the id, name, and price fields.

Next, we'll create a `Product.js` file in the `components` folder. We'll use this to display our products. Here's what it'll look like:
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

Before we can use it, we'll need to create an API endpoint that can fetch our products from our "database". Go over to the `api` folder in the `pages` directory and add a file called `fetchProducts.js`:
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

You'll note we're not taking the hashes! This is because we don't want to give viewers the hashes before they've paid for the items as they can just download them lol

Now to use this endpoint and the Product component, we just need to update our `index.js`:
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

You should now see a "Download" button on your app after you connect your wallet! Once you click download, our hook will be called and the file will be fetched and downloaded from IPFS. This can take a bit of time the first time, so please be patient! 

Keep in mind that files on IPFS are cached across multiple nodes, so if you _just_ uploaded something, it will only exist on a few nodes and will take a bit of time to download. The more your files are accessed, the more nodes they will be cached on and the faster they will download! 

If your file won't download, you'll have to switch to a different IPFS gateway. Check out [this great article](https://github.com/maxim-saplin/ipfs_gateway_research/blob/main/README.md) comparing the popular options.

### 🚨 Progress Report
Please do this else Raza will be sad :(

**Upload a screenshot of your uploaded file on Pinata :D**
