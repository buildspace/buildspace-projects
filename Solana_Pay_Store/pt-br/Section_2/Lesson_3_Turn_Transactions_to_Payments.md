Nossas transações estão sendo enviadas, mas não estamos fazendo nada para verificar se elas estão realmente sendo confirmadas. Talvez elas tenham falhado por algum motivo? Aqui está o que você precisa fazer para confirmar!

### 🤔 Confirme transações

Volte para o seu componente `Buy.js` e atualize-o para:

```jsx
import React, { useState, useEffect, useMemo } from "react";
import { Keypair, Transaction } from "@solana/web3.js";
import { findReference, FindReferenceError } from "@solana/pay";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { InfinitySpin } from "react-loader-spinner";
import IPFSDownload from "./IpfsDownload";

const STATUS = {
  Initial: "Initial",
  Submitted: "Submitted",
  Paid: "Paid",
};

export default function Buy({ itemID }) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const orderID = useMemo(() => Keypair.generate().publicKey, []); // Chave pública usada para identificar o pedido

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(STATUS.Initial); // Acompanhamento do status da transação

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
    const txResponse = await fetch("../api/createTransaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });
    const txData = await txResponse.json();

    const tx = Transaction.from(Buffer.from(txData.transaction, "base64"));
    console.log("Os dados da Tx são", tx);

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
    // Verifique se a transação foi confirmada
    if (status === STATUS.Submitted) {
      setLoading(true);
      const interval = setInterval(async () => {
        try {
          const result = await findReference(connection, orderID);
          console.log("Encontrando referência da tx", result.confirmationStatus);
          if (result.confirmationStatus === "confirmed" || result.confirmationStatus === "finalized") {
            clearInterval(interval);
            setStatus(STATUS.Paid);
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
  }, [status]);

  if (!publicKey) {
    return (
      <div>
        <p>Você precisa conectar sua carteira para fazer transações</p>
      </div>
    );
  }

  if (loading) {
    return <InfinitySpin color="gray" />;
  }

  return (
    <div>
      { status === STATUS.Paid ? (
        <IPFSDownload filename="emojis.zip" hash="QmWWH69mTL66r3H8P4wUn24t1L5pvdTJGUTKBqT11KCHS5" cta="Download emojis"/>
      ) : (
        <button disabled={loading} className="buy-button" onClick={processTransaction}>
          Compre Agora 🠚
        </button>
      )}
    </div>
  );
}
```

Aqui está o novo bloco que adicionamos:

```jsx
  useEffect(() => {
    // Verifique se a transação foi confirmada
    if (status === STATUS.Submitted) {
      setLoading(true);
      const interval = setInterval(async () => {
        try {
          // Procure nosso orderID na blockchain
          const result = await findReference(connection, orderID);
          console.log("Encontrando referência da tx", result.confirmationStatus);
          
          // Se a transação for confirmada ou finalizada, o pagamento foi efetuado com sucesso!
          if (result.confirmationStatus === "confirmed" || result.confirmationStatus === "finalized") {
            clearInterval(interval);
            setStatus(STATUS.Paid);
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
  }, [status]);
```
Esta é a magia da Solana Pay. Quando criamos nosso objeto de transação, adicionamos um ID de pedido como campo de referência. A Solana Pay nos permite pesquisar transações por referência. Isso significa que podemos verificar instantaneamente se um pagamento foi feito sem qualquer busca profunda.

```jsx
const result = await findReference(connection, orderID);
```

A função [`findReference`](https://docs.solanapay.com/api/core/function/findReference) procura a assinatura de transação mais antiga referenciando nosso orderID. Se encontrarmos um, verificamos se o status da transação foi confirmado ou finalizado.

```jsx
  if (e instanceof FindReferenceError) {
    return null;
  }
```

Esta função dará erro se a transação não for encontrada e isso pode acontecer logo após a transação ser enviada. Então verificamos se o erro foi da classe [`FindReferenceError`](https://docs.solanapay.com/api/core/class/FindReferenceError) e o ignoramos.

Se tudo correr conforme o planejado, nosso código começará a procurar a transação assim que o usuário clicar em "Aprovar". A primeira pesquisa provavelmente falhará porque as transações demoram cerca de 0,5s. É por isso que estamos usando `setInterval` >:D. Na segunda vez que verificar, encontrará a transação e a confirmará, atualizando nosso aplicativo para indicar o pagamento.

ISSO É ALGO GRANDIOSO! A razão pela qual usamos blockchains é para que não tenhamos que nos preocupar com transações inválidas. Quando a Solana Pay informa que uma transação foi confirmada, você **sabe** que uma transação foi confirmada e que o dinheiro está em sua carteira. Sem estornos :P

### 🧠 Adicionar ao livro de pedidos

Há um pequeno problema agora. Se você fizer um pagamento e atualizar sua página, o botão de download desaparecerá!

Isso ocorre porque não estamos armazenando pedidos em lugar nenhum. Vamos consertar isso.

Primeiro, precisaremos criar um arquivo `orders.json` no diretório `pages/api`. Deixe-o vazio por enquanto, o meu está assim:

```json
[

]
```

Em seguida, criaremos um ponto de extremidade de API para gravar e ler a partir dele. Vamos usar o `orders.json` como outro banco de dados rsrs.

Aqui está meu arquivo de ponto de extremidade da API `orders.js` (dentro do diretório `pages/api`):

```jsx
// Este ponto de extremidade da API permitirá que os usuários usem POST e publiquem dados para adicionar registros e GET para recuperar registros
import orders from "./orders.json";
import { writeFile } from "fs/promises";

function get(req, res) {
  const { buyer } = req.query;

  // Verifique se este endereço tem algum pedido
  const buyerOrders = orders.filter((order) => order.buyer === buyer);
  if (buyerOrders.length === 0) {
    // 204 = processou a solicitação com sucesso, não retornando nenhum conteúdo
    res.status(204).send();
  } else {
    res.status(200).json(buyerOrders);
  }
}

async function post(req, res) {
  console.log("Pedido de adição de pedido recebido", req.body);
  // Adicionar novo pedido a orders.json
  try {
    const newOrder = req.body;

    // Se este endereço não tiver comprado este item, adicione pedido a orders.json
    if (!orders.find((order) => order.buyer === newOrder.buyer.toString() && order.itemID === newOrder.itemID)) {
      orders.push(newOrder);
      await writeFile("./pages/api/orders.json", JSON.stringify(orders, null, 2));
      res.status(200).json(orders);
    } else {
      res.status(400).send("O pedido já existe");
    }
  } catch (err) {
    res.status(400).send(err);
  }
}

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      get(req, res);
      break;
    case "POST":
      await post(req, res);
      break;
    default:
      res.status(405).send(`Método ${req.method} não permitido`);
  }
}
```

Isso tudo é apenas JavaScript simples, sinta-se à vontade para revisar :)

Na verdade, tudo o que é feito é a leitura dos dados e a gravação no arquivo orders.json.

Em seguida, precisaremos interagir com essa API. *Poderíamos* fazer isso sempre que precisarmos dos arquivos individuais, mas isso é uma prática ruim. Em vez disso, criaremos um arquivo dedicado para ele.

Crie uma pasta "lib" no diretório raiz do seu projeto (mesmo nível dos componentes) e adicione um arquivo `api.js` nela.

Veja como ficará:

```jsx
export const addOrder = async (order) => {
  console.log("adicionando pedido", order, "para o banco de dados");
  await fetch("../api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });
};
```

Muito bem! Agora, para usar isso, tudo o que precisamos fazer é importar a função `addOrder` e chamá-la em `Buy.js` logo após a confirmação da transação. Veja como está meu último `Buy.js`:

```jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Keypair, Transaction } from '@solana/web3.js';
import { findReference, FindReferenceError } from '@solana/pay';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { InfinitySpin } from 'react-loader-spinner';
import IPFSDownload from './IpfsDownload';
import { addOrder } from '../lib/api';

const STATUS = {
  Initial: 'Initial',
  Submitted: 'Submitted',
  Paid: 'Paid',
};

export default function Buy({ itemID }) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const orderID = useMemo(() => Keypair.generate().publicKey, []); // Chave pública usada para identificar o pedido

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(STATUS.Initial); // Acompanhamento do status da transação

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
    console.log('Os dados da Tx são', tx);

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
    // Verifique se a transação foi confirmada
    if (status === STATUS.Submitted) {
      setLoading(true);
      const interval = setInterval(async () => {
        try {
          const result = await findReference(connection, orderID);
          console.log('Encontrando referência da tx', result.confirmationStatus);
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
        <p>Você precisa conectar sua carteira para fazer transações</p>
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

### 🚨 Relatório de progresso

Você agora tem um aplicativo Full Stack! Frontend, backend, servidor, blockchain, woohoo!

Poste uma captura de tela do seu editor em #progress mostrando a instrução do console "Adicionando pedido".
