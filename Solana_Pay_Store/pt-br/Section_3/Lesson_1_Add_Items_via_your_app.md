Você conseguiu! EXCELENTE TRABALHO!

Você tem uma loja totalmente funcional que pode vender o que quiser! Vamos finalizar transformando tudo isso em um portal para o IPFS.

Vamos adicionar uma funcionalidade que permitirá que você, o proprietário da loja, adicione itens à loja **a partir do frontend!**.

Primeiro, crie um arquivo `.env` na pasta raiz do seu projeto e adicione seu endereço lá. Aqui está a aparência do meu arquivo `.env`:

```
NEXT_PUBLIC_OWNER_PUBLIC_KEY=B1aLAAe4vW8nSQCetXnYqJfRxzTjnbooczwkUJAr7yMS
```

**Nota:** NextJs tem o dotenv embutido, mas você **precisa** iniciar variáveis de ambiente publicamente disponíveis com `NEXT_PUBLIC`. Observe também que você precisará reiniciar o Next para pegar a alteração em `.env`.

É hora de mais um componente! Adicione `CreateProduct.js` na pasta de componentes.

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
      console.log("Erro ao fazer upload do arquivo: ", error);
    }
    setUploading(false);
  }

  const createProduct = async () => {
    try {
      // Combine dados do produto e file.name
      const product = { ...newProduct, ...file };
      console.log("Enviando produto para api",product);
      const response = await fetch("../api/addProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
      const data = await response.json();
      if (response.status === 200) {
        alert("Produto adicionado!");
      }
      else{
        alert("Não foi possível adicionar o produto: ", data.error);
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
            <h1>Criar Produto</h1>
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
              placeholder="Descrição aqui..."
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

Em seguida, adicionaremos isso ao index.js, juntamente com uma verificação se somos o proprietário.

```jsx
import React, { useState, useEffect} from "react";
import CreateProduct from "../components/CreateProduct";
import Product from "../components/Product";
import HeadComponent from '../components/Head';

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

// Constantes
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
          console.log("Produtos", data);
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
          <p className="header"> 😳 Loja de emojis do Buildspace 😈</p>
          <p className="sub-text">A única loja de emojis que aceita shitcoins</p>

          {isOwner && (
            <button className="create-product-button" onClick={() => setCreating(!creating)}>
              {creating ? "Close" : "Criar Produto"}
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

Agora, quando você se conectar com a mesma carteira que o proprietário, deverá ver um botão "Criar produto" no canto superior direito. Aaaah isso é tão lindo.

![](https://hackmd.io/_uploads/SkQiCcUPc.png)

A última parte de que precisamos é o ponto de extremidade da API para adicionar coisas ao nosso "banco de dados". Crie um arquivo `addProduct.js` no diretório `pages/api`:

```jsx
import products from './products.json';
import fs from "fs";

export default function handler(req, res){
  if (req.method === "POST"){
    try {
      console.log("body is ", req.body)
      const { name, price, image_url, description, filename, hash } = req.body;
 
      // Criar um novo ID do produto com base no último ID do produto
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
      res.status(500).json({error: "erro ao adicionar produto"});
      return;
    }
  }
  else {
    res.status(405).send(`Método ${req.method} não permitido`);
  }
}
```

Vá em frente e teste! O upload do IPFS é ✨**mágico**✨.

### 🤝 Deixe outras pessoas adicionarem coisas

Agora realmente temos tudo o que precisamos para permitir que outras pessoas adicionem coisas. Tudo o que precisamos fazer é:

1. Tornar o formulário de criação de produto público
2. Armazenar endereços de "vendedor" em products.json
3. Atualizar o ponto de extremidade da API `createTransaction` para ler também o endereço do "vendedor" de products.json

Já pensou como seria legal se você tivesse uma loja focada em tipos específicos de itens?? Você pode adicionar vários recursos extras para atrair vendedores e talvez pegar uma pequena porcentagem (1%) e *ainda* ser 1,9% mais barato que o Stripe e outros processadores de pagamento!

### 🚨 Relatório de progresso

Por favor faça isso, senão o Raza vai ficar triste :(

VOCÊ JÁ CONSEGUIU! ESTOU TÃO ORGULHOSO DE VOCÊ.

Adicione um item à sua loja e faça upload de uma captura de tela!
