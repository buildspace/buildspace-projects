Isso não foi fácil? Eu amo React. Agora que temos uma vitrine, precisamos contratar um caixa e dizer-lhes para cobrar dinheiro das pessoas rsrs.

Muito bem, estamos prestes a sermos pagos! Vamos acrescentar algumas funções para que possamos:

1. Gerar um objeto de transação no servidor
2. Pegar o objeto da transação no servidor
3. Pedir ao usuário para assinar a transação
4. Verificar se a transação foi confirmada

Uma vez que a transação tenha sido processada, vamos utilizar a exibição do botão de download que fizemos para enviar o arquivo para o usuário.

### 💥 Enviando tokens SOL

Uma vez que as transações blockchain têm várias de partes, vamos começar apenas com o envio de SOL em vez de USDC.

A primeira coisa que você vai fazer é adicionar um arquivo `createTransaction.js` na pasta api. Aqui está como vai ser:

```jsx
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import BigNumber from "bignumber.js";
import products from "./products.json";

// Certifique-se de substituir isto pelo endereço de sua carteira!
const sellerAddress = 'B1aLAAe4vW8nSQCetXnYqJfRxzTjnbooczwkUJAr7yMS'
const sellerPublicKey = new PublicKey(sellerAddress);

const createTransaction = async (req, res) => {
  try {
    // Extraia os dados da transação do órgão solicitante
    const { buyer, orderID, itemID } = req.body;

    // Se não tivermos algo que precisamos, paramos!
    if (!buyer) {
      return res.status(400).json({
        message: "Missing buyer address",
      });
    }

    if (!orderID) {
      return res.status(400).json({
        message: "Missing order ID",
      });
    }

    // Pegue o preço do item de products.json usando itemID
    const itemPrice = products.find((item) => item.id === itemID).price;

    if (!itemPrice) {
      return res.status(404).json({
        message: "Item não encontrado. Por favor, verifique o ID do item",
      });
    }


    // Converta nosso preço para o formato correto
    const bigAmount = BigNumber(itemPrice);
    const buyerPublicKey = new PublicKey(buyer);
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = clusterApiUrl(network);
    const connection = new Connection(endpoint);

    //Um blockhash (hash de bloco) é como uma identificação para um bloco. Ele permite que você identifique cada bloco.
    const { blockhash } = await connection.getLatestBlockhash("finalized");


    // As duas primeiras coisas que precisamos - uma identificação recente do bloco 
    // e a chave pública do pagador da taxa 
    const tx = new Transaction({
      recentBlockhash: blockhash,
      feePayer: buyerPublicKey,
    });

    // Esta é a "ação" que a transação realizará
    // Vamos apenas transferir algum SOL
    const transferInstruction = SystemProgram.transfer({
      fromPubkey: buyerPublicKey,
      // Lamports são a menor unidade do SOL, como a Gwei é da Ethereum
      lamports: bigAmount.multipliedBy(LAMPORTS_PER_SOL).toNumber(), 
      toPubkey: sellerPublicKey,
    });

    // Estamos acrescentando mais instruções à transação
    transferInstruction.keys.push({
      // Usaremos nosso OrderId para encontrar esta transação mais tarde
      pubkey: new PublicKey(orderID), 
      isSigner: false,
      isWritable: false,
    });

    tx.add(transferInstruction);


    // Formatando nossa transação
    const serializedTransaction = tx.serialize({
      requireAllSignatures: false,
    });
    const base64 = serializedTransaction.toString("base64");

    res.status(200).json({
      transaction: base64,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: "error creating tx" });
    return;
  }
}

export default function handler(req, res) {
  if (req.method === "POST") {
    createTransaction(req, res);
  } else {
    res.status(405).end();
  }
}
```

Não fique assustado! Na verdade, isto é muito mais simples do que parece. Tudo o que você precisa saber aqui é que estamos criando um objeto de transação Solana que transfere uma certa quantidade de tokens SOL de um endereço para outro. Deixei comentários no código explicando as novas coisas :D

Para chamar este ponto de extremidade, vamos criar um novo componente - um botão de compra! Vá até a pasta de componentes e crie um novo arquivo chamado "Buy.js". Aqui está o que ele terá:


```jsx
import React, { useState, useMemo } from "react";
import { Keypair, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { InfinitySpin } from "react-loader-spinner";
import IPFSDownload from "./IpfsDownload";

export default function Buy({ itemID }) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const orderID = useMemo(() => Keypair.generate().publicKey, []); // Public key used to identify the order

  const [paid, setPaid] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state of all above


  // useMemo é um gancho do React que só computa o valor se as dependências mudarem

  const order = useMemo(
    () => ({
      buyer: publicKey.toString(),
      orderID: orderID.toString(),
      itemID: itemID,
    }),
    [publicKey, orderID, itemID]
  );

  // Pegue o objeto transação do servidor 
  const processTransaction = async () => {
    setLoading(true);
    const txResponse = await fetch("../api/createTransaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });
    const txData = await txResponse.json();


    // Nós criamos um objeto transação
    const tx = Transaction.from(Buffer.from(txData.transaction, "base64"));
    console.log("Tx data is", tx);


    // Tente enviar a transação para a rede
    try {
      // Envie a transação para a rede
      const txHash = await sendTransaction(tx, connection);
      console.log(`Transação enviada: https://solscan.io/tx/${txHash}?cluster=devnet`);
      // Mesmo que isso possa falhar, por ora, vamos apenas torná-lo realidade
      setPaid(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!publicKey) {
    return (
      <div>
        <p>É necessário conectar sua carteira para realizar a transação</p>
      </div>
    );
  }

  if (loading) {
    return <InfinitySpin color="gray" />;
  }

  return (
    <div>
      {paid ? (
        <IPFSDownload filename="emojis.zip" hash="QmWWH69mTL66r3H8P4wUn24t1L5pvdTJGUTKBqT11KCHS5" cta="Download emojis"/>
      ) : (
        <button disabled={loading} className="buy-button" onClick={processTransaction}>
          Compre agora 🠚
        </button>
      )}
    </div>
  );
}
```

Este componente é o coração de nosso aplicativo. Vamos revisitá-lo várias vezes para acrescentar funcionalidade a ele. Neste momento estamos apenas usando-o para enviar uma transação e habilitando o botão de download.

Para usá-lo, precisaremos fazer uma pequena alteração em nosso componente `Product.js` 

```jsx
import React from "react";
import styles from "../styles/Product.module.css";
import Buy from "./Buy";

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
            {/* Substitua o componente IPFS pelo componente Buy! */}
            <Buy itemID={id} />
        </div>
      </div>
    </div>
  );
}
```

Tudo o que fizemos aqui foi substituir o componente IPFS pelo componente Buy rsrs.

### 🧪 Configurando a Devnet

Um último passo antes de ser pago! Você precisa ter certeza de que sua rede na Phantom está configurada para a Devnet. Para fazer isso, abra sua carteira Phantom e vá para as configurações:

![](https://i.imgur.com/U5moHfW.png)

Em seguida, selecione **Change Network** (Troque a Rede) e configure-a para Devnet. Agora você está pronto, todas as transações estarão na Devnet!

![](https://i.imgur.com/WkPUkcu.png)

Se você estiver quebrado e não tiver SOL em sua carteira, você pode usar uma faucet para obter algum. Acesse [Sol Faucet](https://solfaucet.com/) para algum dinheiro falso.

E agora, se você clicar no novo botão brilhoso de compra, você deve ver um pedido de transação: 

![](https://hackmd.io/_uploads/ByAeaFIPc.png)

O que está ocorrendo aqui é que nosso botão de compra acessa o backend para ir pegar o objeto da transação para este item. Uma vez feito isso, apenas definimos uma variável `Paid` (Paga) para verdadeira e ativamos o botão de download. Muito legal, não é?

A seguir, vamos usar USDC ao invés de SOL

### 🚨 Relatório de Progresso

Por favor, faça isso, senão o Raza vai ficar triste :(

Publique uma captura de tela de seu navegador em #progress mostrando seu pedido de transação SOL!


