Agora que estamos adicionando itens ao nosso "banco de dados" de pedidos, seria bom se o usássemos rsrs.

### 👀 Verificar no carregamento se eles já compraram anteriormente

O fluxo para fazer isso vai ser muito semelhante ao `addOrder`. Primeiro, volte para `lib/api.js` e acrescente este manipulador:

```jsx
// Retorna verdadeiro se uma determinada chave pública tiver adquirido um item anteriormente
export const hasPurchased = async (publicKey, itemID) => {
  // Enviar um pedido GET com a chave pública como parâmetro
  const response = await fetch(`../api/orders?buyer=${publicKey.toString()}`);
  // Se o código-resposta é 200
  if (response.status === 200) {
    const json = await response.json();
    console.log("Os pedidos atuais de carteira são:", json);
    // Se os pedidos não estiverem vazios
    if (json.length > 0) {
      // Verifique se há algum registro com este comprador e identificação do item
      const order = json.find((order) => order.buyer === publicKey.toString() && order.itemID === itemID);
      if (order) {
        return true;
      }
    }
  }
  return false;
};
```


Isto só vai interagir com nosso ponto de extremidade /orders e verificar se um determinado endereço comprou um item específico. Para implementá-lo, precisaremos fazer 3 coisas em `Buy.js`:

1. Atualizar as importações para incluir hasPurchased
2. Executar a verificação hasPurchased no carregamento da página em um useEffect 

Eis como vai ficar:

```jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Keypair, Transaction } from '@solana/web3.js';
import { findReference, FindReferenceError } from '@solana/pay';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { InfinitySpin } from 'react-loader-spinner';
import IPFSDownload from './IpfsDownload';
import { addOrder, hasPurchased } from '../lib/api';

const STATUS = {
  Initial: 'Initial',
  Submitted: 'Submitted',
  Paid: 'Paid',
};

export default function Buy({ itemID }) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const orderID = useMemo(() => Keypair.generate().publicKey, []); // Chave pública utilizada para identificar o pedido

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(STATUS.Initial); // Status do rastreamento da transação

  const order = useMemo(
    () => ({
      buyer: publicKey.toString(),
      orderID: orderID.toString(),
      itemID: itemID,
    }),
    [publicKey, orderID, itemID]
  );

  const processTransaction = async () => {
    setLoading(true);
    const txResponse = await fetch('../api/createTransaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });
    const txData = await txResponse.json();

    const tx = Transaction.from(Buffer.from(txData.transaction, 'base64'));
    console.log('Os dados da transação são', tx);

    try {
      const txHash = await sendTransaction(tx, connection);
      console.log(
        `Transação enviada: https://solscan.io/tx/${txHash}?cluster=devnet`
      );
      setStatus(STATUS.Submitted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Verificar se este endereço já comprou este item
    // Se for o caso, buscar o item e ajustar o pagamento para verdadeiro
    // Função Async para evitar o bloqueio da IU
    async function checkPurchased() {
      const purchased = await hasPurchased(publicKey, itemID);
      if (purchased) {
        setStatus(STATUS.Paid);
        console.log("O endereço já adquiriu esse item!");
      }
    }
    checkPurchased();
  }, [publicKey, itemID]);

  useEffect(() => {
    if (status === STATUS.Submitted) {
      setLoading(true);
      const interval = setInterval(async () => {
        try {
          const result = await findReference(connection, orderID);
          console.log('Localizar a referência da transação', result.confirmationStatus);
          if (
            result.confirmationStatus === 'confirmed' ||
            result.confirmationStatus === 'finalized'
          ) {
            clearInterval(interval);
            setStatus(STATUS.Paid);
            setLoading(false);
            addOrder(order);
            alert('Obrigado por sua compra!');
          }
        } catch (e) {
          if (e instanceof FindReferenceError) {
            return null;
          }
          console.error('Erro desconhecido', e);
        } finally {
          setLoading(false);
        }
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [status]);

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
      {status === STATUS.Paid ? (
        <IPFSDownload
          filename="emojis.zip"
          hash="QmWWH69mTL66r3H8P4wUn24t1L5pvdTJGUTKBqT11KCHS5"
          cta="Download emojis"
        />
      ) : (
        <button
          disabled={loading}
          className="buy-button"
          onClick={processTransaction}
        >
          Compre Agora 🠚
        </button>
      )}
    </div>
  );
}
```

Aqui está a nova parte, bem direta!

```jsx
 useEffect(() => {
    // Verifique se este endereço já comprou este item
    // Se for o caso, buscar o item e ajustar o pagamento para verdadeiro
    // Função Async para evitar o bloqueio da IU
    async function checkPurchased() {
      const purchased = await hasPurchased(publicKey, itemID);
      if (purchased) {
        setStatus(STATUS.Paid);
        console.log("O endereço já adquiriu esse item!");
      }
    }
    checkPurchased();
  }, [publicKey, itemID]);
```

### 👏 Pegue os itens da API

Algo está me causando comichão há algum tempo. Nós fizemos uma codificação rígida desde o início para que pudéssemos acelerar as transações. Vamos consertar isso!

Primeiro, vamos criar um arquivo chamado `fetchItem.js` no diretório `pages/api`. Sim. Outro ponto de extremidade. Não se preocupe, é bem pequeno!


```jsx
// Este ponto de extremidade enviará ao usuário um hash de arquivo do IPFS
import products from "./products.json"

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { itemID } = req.body;

    if (!itemID) {
      return res.status(400).send('itemID faltando');
    }

    const product = products.find((p) => p.id === itemID);


    if (product) {
      const { hash, filename } = product;
      return res.status(200).send({ hash, filename });
    } else {
      return res.status(404).send("Item não encontrado");
    }
  } else {
    return res.status(405).send(`Método ${req.method} não permitido`);
  }
}
```


Não podemos usar `fetchProducts` porque estamos removendo os hashes dela. Acrescente esta parte final em `lib/api.js`:


```jsx
export const fetchItem = async (itemID) => {
  const response = await fetch("../api/fetchItem", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ itemID }),
  });
  const item = await response.json();
  return item;
}
```

E agora, podemos juntar tudo isso em `Buy.js`:

```jsx
import React, { useEffect, useState, useMemo } from "react";
import { Keypair, Transaction } from "@solana/web3.js";
import { findReference, FindReferenceError } from "@solana/pay";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { InfinitySpin } from "react-loader-spinner";
import IPFSDownload from "./IpfsDownload";
import { addOrder, hasPurchased, fetchItem } from "../lib/api";

const STATUS = {
  Initial: "Initial",
  Submitted: "Submitted",
  Paid: "Paid",
};

export default function Buy({ itemID }) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const orderID = useMemo(() => Keypair.generate().publicKey, []); // Chave pública utilizada para identificar o pedido

  const [item, setItem] = useState(null); // hash IPFS & nome do arquivo do item comprado
  const [loading, setLoading] = useState(false); // Estado de carregamento de tudo acima
  const [status, setStatus] = useState(STATUS.Initial); // Status de rastreamento da transação

  const order = useMemo(
    () => ({
      buyer: publicKey.toString(),
      orderID: orderID.toString(),
      itemID: itemID,
    }),
    [publicKey, orderID, itemID]
  );

  // Buscar o objeto da transação no servidor (feito para evitar adulterações)
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

    const tx = Transaction.from(Buffer.from(txData.transaction, "base64"));
    console.log("Os dados da transação são", tx);
    // Tentar enviar a transação para a rede
    try {
      const txHash = await sendTransaction(tx, connection);
      console.log(`Transação enviada: https://solscan.io/tx/${txHash}?cluster=devnet`);
      setStatus(STATUS.Submitted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Verifique se este endereço já comprou este item
    // Se for o caso, pegue o item e configure o pagamento para verdadeiro
    // Função Async para evitar o bloqueio da IU
    async function checkPurchased() {
      const purchased = await hasPurchased(publicKey, itemID);
      if (purchased) {
        setStatus(STATUS.Paid);
        const item = await fetchItem(itemID);
        setItem(item);
      }
    }
    checkPurchased();
  }, [publicKey, itemID]);

  useEffect(() => {
    // Verificar se a transação foi confirmada
    if (status === STATUS.Submitted) {
      setLoading(true);
      const interval = setInterval(async () => {
        try {
          const result = await findReference(connection, orderID);
          console.log("Localizar a referência da transação", result.confirmationStatus);
          if (result.confirmationStatus === "confirmed" || result.confirmationStatus === "finalized") {
            clearInterval(interval);
            setStatus(STATUS.Paid);
            addOrder(order);
            setLoading(false);
            alert("Obrigado por sua compra!");
          }
        } catch (e) {
          if (e instanceof FindReferenceError) {
            return null;
          }
          console.error("Erro desconhecido", e);
        } finally {
          setLoading(false);
        }
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }

    async function getItem(itemID) {
      const item = await fetchItem(itemID);
      setItem(item);
    }

    if (status === STATUS.Paid) {
      getItem(itemID);
    }
  }, [status]);

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
      {/* Exibir ou o botão de compra ou o componente IPFSDownload com base na existência de Hash */}
      {item ? (
        <IPFSDownload hash={item.hash} filename={item.filename} />
      ) : (
        <button disabled={loading} className="buy-button" onClick={processTransaction}>
          Compre agora 🠚
        </button>
      )}
    </div>
  );
}
```

Muito bem feito! Sua loja agora está completa!

### 🚨 Relatório de Progresso 

Por favor, faça isso, senão o Raza ficará triste :(

Você percorreu um longo caminho. Tenho certeza de que você aprendeu muito.

Diga-me em #general-chill-chat qual tem sido sua parte favorita deste projeto :)
