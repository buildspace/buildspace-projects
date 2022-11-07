As transações em USDC são muito semelhantes às transações em SOL. A parte mais importante que muda é que em nossa função de transação chamamos um tipo diferente de instrução de transferência.

Em primeiro lugar, vamos a este [faucet](https://spl-token-faucet.com/?token-name=USDC) para solicitar alguns tokens USDC. Estes não são realmente USDC, mas não importa. O método de envio de tokens SPL é o mesmo para todos eles.

A seguir, dê uma olhada na versão atualizada do `createTransaction.js`:

```jsx
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl, Connection, PublicKey, Transaction } from "@solana/web3.js";
import { createTransferCheckedInstruction, getAssociatedTokenAddress, getMint } from "@solana/spl-token";
import BigNumber from "bignumber.js";
import products from "./products.json";

const usdcAddress = new PublicKey("Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr");
const sellerAddress = "B1aLAAe4vW8nSQCetXnYqJfRxzTjnbooczwkUJAr7yMS";
const sellerPublicKey = new PublicKey(sellerAddress);

const createTransaction = async (req, res) => {
  try {
    const { buyer, orderID, itemID } = req.body;
    if (!buyer) {
      res.status(400).json({
        message: "Faltando o endereço do comprador",
      });
    }

    if (!orderID) {
      res.status(400).json({
        message: "Faltando a identificação do pedido",
      });
    }

    const itemPrice = products.find((item) => item.id === itemID).price;

    if (!itemPrice) {
      res.status(404).json({
        message: "Item não encontrado. Favor verificar a identificação do item",
      });
    }

    const bigAmount = BigNumber(itemPrice);
    const buyerPublicKey = new PublicKey(buyer);

    const network = WalletAdapterNetwork.Devnet;
    const endpoint = clusterApiUrl(network);
    const connection = new Connection(endpoint);

    const buyerUsdcAddress = await getAssociatedTokenAddress(usdcAddress, buyerPublicKey);
    const shopUsdcAddress = await getAssociatedTokenAddress(usdcAddress, sellerPublicKey);
    const { blockhash } = await connection.getLatestBlockhash("finalized");


    // Isto é novo, estamos recebendo o endereço da cunhagem do token que queremos transferir
    const usdcMint = await getMint(connection, usdcAddress);


    const tx = new Transaction({
      recentBlockhash: blockhash,
      feePayer: buyerPublicKey,
    });


    // Aqui estamos criando um tipo diferente de instrução de transferência
    const transferInstruction = createTransferCheckedInstruction(
      buyerUsdcAddress, 
      usdcAddress,     // Este é o endereço do token que queremos transferir
      shopUsdcAddress, 
      buyerPublicKey, 
      bigAmount.toNumber() * 10 ** (await usdcMint).decimals, 
      usdcMint.decimals // O token pode ter qualquer número de decimais
    );

    // O resto permanece o mesmo :)
    transferInstruction.keys.push({
      pubkey: new PublicKey(orderID),
      isSigner: false,
      isWritable: false,
    });

    tx.add(transferInstruction);

    const serializedTransaction = tx.serialize({
      requireAllSignatures: false,
    });

    const base64 = serializedTransaction.toString("base64");

    res.status(200).json({
      transaction: base64,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({ error: "error creating transaction" });
    return;
  }
};

export default function handler(req, res) {
  if (req.method === "POST") {
    createTransaction(req, res);
  } else {
    res.status(405).end();
  }
}
```


Mais uma vez - isto pode parecer assustador, mas é relativamente simples.

A primeira coisa nova que acrescentamos é o endereço USDC:


```jsx
const usdcAddress = new PublicKey("Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr");
```


Este é o endereço do token USDC na devnet que obtivemos do faucet. Vamos usar este endereço para encontrar os endereços de conta do token USDC.

Veja como funcionam as contas de token na Solana. 

![Untitled](https://i.imgur.com/8T8BFGL.png)

Todos os tokens fungíveis na Solana são feitos usando o [programa token](https://spl.solana.com/token). Isto significa que cada token tem a sua **própria conta**, que tem um endereço. Para poder enviar tokens dessa conta, você precisa do seu endereço.

Você pode pensar em sua conta Solana como um hotel infinito e em todas as contas token como quartos de hotel. Como proprietário do hotel, você é proprietário dos quartos do hotel. Para poder olhar dentro de um quarto, você precisa saber o seu número :)

**Nota**: Por causa do modelo de conta, **você precisa ter USDC em AMBAS AS contas de usuário**. Se uma conta de usuário não tiver USDC, ela também não terá um endereço de token USDC, e esta função vai falhar.

Muito louco que a única diferença no envio de SOL e *qualquer* outro token seja apenas esta parte:


```jsx
   // Aqui estamos criando um tipo diferente de instrução de transferência
    const transferInstruction = createTransferCheckedInstruction(
      buyerUsdcAddress, 
      usdcAddress,     // Este é o endereço do token que queremos transferir
      shopUsdcAddress, 
      buyerPublicKey, 
      bigAmount.toNumber() * 10 ** (await usdcMint).decimals, 
      usdcMint.decimals // O token pode ter qualquer número de decimais
    );
```


Você pode substituir isto por *qualquer* token SPL, que vai funcionar!

Agora se você clicar no botão "Comprar agora", você deve ver um pedido da Phantom de um token "Gh9Zw". Este é o endereço do falso token USDC. Na rede principal, isto indicará USDC real rsrs

![](https://hackmd.io/_uploads/ryaoth9P9.png)

É isso aí, você está aceitando pagamentos em USDC!

A parte mais legal disso para mim é a experiência de "checkout". Sem cadastros. Sem endereços. Sem e-mails. Há empresas de bilhões de dólares por aí que estão tentando tornar popular o checkout com um clique. Você acabou de implementá-lo em 15 minutos, **gratuitamente** :)

### 🚨 Relatório de Progresso

Por favor, faça isso, senão o Raza ficará triste :(

Publique uma captura de tela de seu navegador em #progress mostrando seu pedido de transação USDC!
