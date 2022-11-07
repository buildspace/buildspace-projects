Agora que temos nosso código base configurado, podemos começar com um botão de conexão de carteira. Estou usando a carteira Phantom [carteira Phantom](https://phantom.app/), mas você pode usar qualquer uma! Apenas tenha em mente que eu não testei isso com outras carteiras.

A beleza de usar um modelo inicial é que ele já tem um monte de coisas que vamos precisar. Eu removi a maior parte 🙈 para podermos colocar nós mesmos e aprender como tudo funciona.

### 🤖 Configure provedores de carteira

A primeira coisa que precisamos fazer é configurar a raiz do nosso aplicativo `app.js` para procurar carteiras e conectar-se a elas. Veja como vai ficar:

```jsx
import React, { useMemo } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import {
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

import "@solana/wallet-adapter-react-ui/styles.css";
import "../styles/globals.css";
import "../styles/App.css";

const App = ({ Component, pageProps }) => {
  // Pode ser definido como 'devnet', 'testnet' ou 'mainnet-beta'
  const network = WalletAdapterNetwork.Devnet;

  // Você também pode fornecer um ponto de extremidade RPC personalizado
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets inclui todos os adaptadores, mas dá suporte a tree
  // shaking e lazy loading – Apenas as carteiras que você configurar aqui serão compiladas 
  // em seu aplicativo, e somente as dependências de carteiras às quais seus usuários se 
  // conectarem serão carregadas
   const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Component {...pageProps} />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
```

Vemos aqui muitas importações. Não se preocupe, tudo o que você precisa saber é para que serve cada uma delas. Não precisa entender como elas funcionam em profundidade.

A primeira coisa que tenho são apenas algumas importações do React. [`useMemo()`](https://reactjs.org/docs/hooks-reference.html#usememo) é um gancho do React que carrega alguma coisa somente se uma das dependências mudar. No nosso caso, se a **rede** à qual o usuário está conectado não mudar, o valor de `clusterApiUrl` também não mudará.

A primeira importação da Solana que temos é `wallet-adapter-network` de [`@solana/wallet-adapter-base`](https://github.com/solana-labs/wallet-adapter/tree/master/packages/core/base). Este é apenas um objeto enumerável para as redes disponíveis.

O `WalletModalProvider` é exatamente isso rsrs - é um componente sofisticado do React que solicitará ao usuário que selecione sua carteira. Bem fácil!

`ConnectionProvider` e `WalletProvider` são provavelmente os mais importantes.

`ConnectionProvider` recebe um ponto de extremidade RPC e nos permite falar diretamente com os nós na blockchain Solana. Usaremos isso sempre em nosso aplicativo para enviar transações.

`WalletProvider` nos dá uma interface padrão para conectar a todos os tipos de carteiras, então não precisamos nos preocupar em ler a documentação de cada carteira hehe.

Em seguida, você verá vários adaptadores de carteira em `wallet-adapter-wallets`. Usaremos essas importações para criar uma lista de carteiras que daremos ao `WalletProvider`. Há vários outros adaptadores de carteira disponíveis, mesmo alguns feitos para outras blockchains! Confira-os [aqui](https://github.com/solana-labs/wallet-adapter/#wallets). Eu apenas fui com os que estavam no modelo inicial por padrão.

Por fim, temos `clusterApiURL`, que é apenas uma função que gera um ponto de extremidade RPC para nós com base na rede que fornecemos.

Para a instrução return dentro do componente React App, estamos envolvendo os filhos (o restante do aplicativo) com alguns provedores de [contexto](https://reactjs.org/docs/context.html#contextprovider).

Para resumir: este arquivo é o **início** da nossa aplicação web. Tudo o que disponibilizamos aqui é acessível pelo resto do nosso aplicativo. Estamos disponibilizando todas as ferramentas de carteira e rede aqui, então não precisamos olhar para o objeto `Solana` injetado no componente `Window` e não precisamos reinicializá-los em cada componente-filho.

Copiei tudo isso do modelo Next.js, então não se sinta mal por copiar/colar (desta vez).

### 🧞‍♂️ Usando os provedores para se conectar a carteiras

Ufa, isso foi um monte de configuração! Agora você pode ver como é fácil interagir com carteiras. Tudo o que temos que fazer é configurar alguns ganchos do React. Aqui está meu `index.js`:
```jsx
import React from 'react';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

// Constantes
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // Isso buscará a chave pública dos usuários (endereço da carteira) de qualquer carteira que suportamos
  const { publicKey } = useWallet();

  const renderNotConnectedContainer = () => (
    <div>
      <img src="https://media.giphy.com/media/eSwGh3YK54JKU/giphy.gif" alt="emoji" />

      <div className="button-container">
        <WalletMultiButton className="cta-button connect-wallet-button" />
      </div>    
    </div>
  );

  return (
    <div className="App">
      <div className="container">
        <header className="header-container">
          <p className="header"> 😳 Loja de emojis do Buildspace 😈</p>
          <p className="sub-text">A única loja de emojis que aceita shitcoins</p>
        </header>

        <main>
          {/* Nós só renderizamos o botão de conexão se a chave pública não existir */}
          {publicKey ? 'Conectado!' : renderNotConnectedContainer()}

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

Bem fácil, né? O gancho `useWallet()` nos dará o endereço dos usuários conectados em qualquer lugar do aplicativo. Ele se inscreve nos provedores que configuramos em `app.js`.

### 🚨 Relatório de progresso

Por favor faça isso, senão um gatinho vai miar muito triste hoje :(

Agora temos um aplicativo *web3* bem adequado!

**Faça upload da captura de tela do seu modal de conexão de carteira >:D**
