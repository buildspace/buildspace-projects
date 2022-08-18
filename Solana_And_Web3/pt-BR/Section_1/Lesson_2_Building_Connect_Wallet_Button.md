### 👛 Instalando a extensão da carteira Phantom

Para este projeto, usaremos uma carteira chamada [Phantom](https://phantom.app/).

Esta é uma das principais extensões de carteira para Solana e também é apoiada pela Solana (assim você fica sabendo que é verdadeira).

Antes de entrarmos em qualquer código - certifique-se de ter baixado a extensão e configurado uma carteira Solana! Atualmente, a carteira Phantom é compatível com **Chrome**, **Brave**, **Firefox**, **Edge.** e **Opera** Mas, observe: testamos esse código apenas no Brave e no Chrome.

### 👻 Usando o objeto 'Solana'

Para que nosso site converse com nosso programa Solana, precisamos de alguma forma conectar nossa carteira (que é a extensão Phantom Wallet) a ele.

Assim que conectarmos nossa carteira ao nosso site, nosso site terá permissão para executar funções do nosso programa, em nosso nome. Se nossos usuários não conectarem suas carteiras, eles simplesmente não poderão se comunicar com a blockchain Solana.

**Lembre-se, é como se autenticar em um site.** Se você não estiver "conectado" ao G-Mail, não poderá usar o produto de e-mail deles!

Vá para seu código e abra o `App.js` em `src`. É aqui que estará o principal ponto de entrada do nosso aplicativo.

Se você tiver a extensão Phantom Wallet instalada, ela injetará automaticamente um objeto especial chamado `solana` em seu objeto `window` que possui algumas funções mágicas. Isso significa que antes de fazermos qualquer coisa, precisamos verificar se isso existe. Se não existir, vamos dizer ao nosso usuário para fazer o download:

```jsx
/*
 * Usaremos o hook useEffect!
 */
import React, { useEffect } from "react";
import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";

// Mude isso para seu Twitter se quiser.
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  /*
   * Essa função possui a lógica para definir se a Phantom Wallet
   * está conectada ou não
   */
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom wallet encontrada!");
        }
      } else {
        alert("Objeto Solana não encontrado! Instale a Phantom Wallet 👻");
      }
    } catch (error) {
      console.error(error);
    }
  };

  /*
   * Quando seu componente 'montar' pela primeira vez, vamos verificar se
   * temos uma Phantom Wallet conectada
   */
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">Veja sua coleção de GIF no metaverso ✨</p>
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`feito por @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
```

Legal! Nada mal hein? Vamos quebrar isso um pouco:

```jsx
const checkIfWalletIsConnected = async () => {
  try {
    const { solana } = window;

    if (solana) {
      if (solana.isPhantom) {
        console.log("Phantom wallet encontrada!");
      }
    } else {
      alert("Objeto Solana não encontrado! Instale a Phantom Wallet 👻");
    }
  } catch (error) {
    console.error(error);
  }
};
```

Nossa função aqui está verificando o objeto `window` no nosso DOM se a extensão Phantom Wallet injetou o objeto `solana`.
Se temos o objeto `solana`, também podemos verificar se é a Phantom Wallet.

Como testamos esse projeto inteiramente com a Phantom Wallet, nós recomendamos ficar com ela. Apesar disso, nada está te impedindo de explorar ou suportar outras carteiras 👀.

```jsx
useEffect(() => {
  const onLoad = async () => {
    await checkIfWalletIsConnected();
  };
  window.addEventListener("load", onLoad);
  return () => window.removeEventListener("load", onLoad);
}, []);
```

Finalmente, só precisamos chamar isso!

No React, o hook `useEffect` é chamado uma vez na montagem do componente quando esse segundo parâmetro (o `[]`) está vazio! Então, isso é perfeito para nós. Assim que alguém acessa nosso aplicativo, podemos verificar se ele possui o Phantom Wallet instalado ou não. Isso será **muito importante** em breve.

Atualmente, a equipe da Phantom Wallet sugere esperar que a janela termine de carregar completamente antes de verificar o objeto `solana`. Uma vez que este evento é chamado, podemos garantir que este objeto esteja disponível se o usuário tiver a extensão Phantom Wallet instalada.

### 🔒 Acessando a conta do usuário

Então, quando você executar isso, você deverá ver a linha _"Phantom wallet encontrada!"_ impressa no console do site quando for inspecioná-lo.

![Untitled](https://i.imgur.com/MZQlPl5.png)

**ÓTIMO.**

Em seguida, precisamos realmente verificar se estamos **autorizados** para realmente acessar a carteira do usuário. Assim que tivermos acesso a isso, podemos começar a ter acesso às funções do nosso programa Solana 🤘.

Basicamente, a **Phantom Wallet não simplesmente fornece nossas credenciais de carteira para todos os sites que visitamos**. Ela só o fornece a sites que autorizamos. Novamente, é como fazer login! Mas o que estamos fazendo aqui é **verificar se estamos "conectados".**

Tudo o que precisamos fazer é adicionar mais uma linha à nossa função `checkIfWalletIsConnected`. Confira o código abaixo:

```jsx
const checkIfWalletIsConnected = async () => {
  try {
    const { solana } = window;

    if (solana) {
      if (solana.isPhantom) {
        console.log("Phantom wallet encontrada!");

        /*
         * O objeto 'solana' nos fornece uma função que nos permitirá conectar
         * diretamente com a carteira do usuário!
         */
        const response = await solana.connect({ onlyIfTrusted: true });
        console.log(
          "Conectado com a Chave Pública:",
          response.publicKey.toString()
        );
      }
    } else {
      alert("Objeto Solana não encontrado! Instale a Phantom Wallet 👻");
    }
  } catch (error) {
    console.error(error);
  }
};
```

É tão simples quanto chamar `connect` que informa à Phantom Wallet que nosso Portal GIF está autorizado a acessar informações sobre essa carteira! Alguns de vocês podem estar se perguntando o que é essa propriedade `onlyIfTrusted`.

Se um usuário já conectou sua carteira ao seu aplicativo, esse sinalizador puxará imediatamente seus dados sem avisá-lo com outro pop-up de conexão! Bem bacana, hein? Curioso para saber mais - [dê uma olhada neste documento](https://docs.phantom.app/integrating/establishing-a-connection#eagerly-connecting) do Phantom!

Caramba, é isso. _Neste ponto, você ainda deve estar vendo apenas a declaração de log "Phantom wallet encontrada!"_!

Por que? Bem, o método `connect` só será executado **se** o usuário já tiver autorizado uma conexão com seu aplicativo. **O que eles nunca fizeram até agora.**

Então, vamos inicializar essa conexão!

### 🛍 Renderizar botão 'conecte sua carteira'

Tudo bem, já estamos verificando se um usuário já está conectado ao nosso aplicativo ou não. E se eles não estiverem conectados? Não temos em nosso aplicativo uma forma de solicitar que a Phantom Wallet se conecte ao nosso aplicativo ainda!

Precisamos criar um botão `connectWallet` . No mundo da web3, conectar sua carteira é literalmente um botão "Cadastre-se/Login" embutido para o seu usuário.

Pronto para a experiência "Cadastre-se" mais fácil da sua vida :)? Confira:

```jsx
import React, { useEffect } from "react";
import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";

// Constantes
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // Acoes
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom wallet encontrada!");
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            "Conectado com a Chave Pública:",
            response.publicKey.toString()
          );
        }
      } else {
        alert("Objeto Solana não encontrado! Instale a Phantom Wallet 👻");
      }
    } catch (error) {
      console.error(error);
    }
  };

  /*
   * Vamos definir esse método para que nosso código não quebre.
   * Vamos escrever a lógica dele em seguida!
   */
  const connectWallet = async () => {};

  /*
   * Queremos renderizar essa UI quando o usuário não conectou
   * sua carteira ainda.
   */
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Conecte sua carteira
    </button>
  );

  // UseEffects
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">Veja sua coleção de GIF no metaverso ✨</p>
          {/* Renderizar seu botão 'conecte sua carteira' aqui */}
          {renderNotConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`feito por @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
```

Ótimo! Agora você deve ter um botão de gradiente legal que diz "Conecte sua carteira" renderizado em sua página.

![Untitled](https://i.imgur.com/TmZWnqn.png)

A maior coisa a entender aqui são os **métodos de renderização**.

_Observação: se você já estiver familiarizado com os métodos React e render, sinta-se à vontade para pular esta seção._

Estas são **apenas funções que retornam algum código de interface do usuário.** Queremos apenas que nosso botão "Conecte sua carteira" seja renderizado quando alguém não tiver conectado sua carteira ao nosso aplicativo.

Você pode estar pensando agora - "_como nosso aplicativo controla quando renderizar ou não renderizar este botão?"._

**_ÓTIMO PONTO_**. Vamos precisar usar a carteira de uma pessoa para interagir com nosso programa mais tarde. Então, por que não armazenamos esses dados da carteira em algum estado React? **Então** também poderíamos usar isso como o sinalizador para determinar se devemos mostrar ou ocultar nosso botão!

Primeiro você precisará importar `useState` para seu componente assim:

```jsx
import React, { useEffect, useState } from "react";
```

Então, logo acima da sua função `checkIfWalletIsConnected` vá em frente e adicione a seguinte declaração de estado:

```jsx
// State
const [walletAddress, setWalletAddress] = useState(null);
```

Muito bom. Então, agora que estamos prontos para manter algum estado, vamos atualizar algumas coisas em nosso código aqui:

```jsx
import React, { useEffect, useState } from "react";
import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";

// Constantes
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // State
  const [walletAddress, setWalletAddress] = useState(null);

  // Acoes
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom wallet encontrada!");
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            "Conectado com a Chave Pública:",
            response.publicKey.toString()
          );

          /*
           * Define a chave pública do usuário no estado para ser usado posteriormente!
           */
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert("Objeto Solana não encontrado! Instale a Phantom Wallet 👻");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {};

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Conecte sua carteira
    </button>
  );

  // UseEffects
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <div className="App">
      {/* Isso só foi adicionar para um estilozinho */}
      <div className={walletAddress ? "authed-container" : "container"}>
        <div className="header-container">
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">Veja sua coleção de GIF no metaverso ✨</p>
          {/* Adiciona a condição para mostrar isso apenas se não tivermos um endereço de carteira */}
          {!walletAddress && renderNotConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`feito por @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
```

Olhe para todo esse React bonitão. Hype! Vamos apenas revisar as mudanças bem rápido:

```jsx
const checkIfWalletIsConnected = async () => {
  try {
    const { solana } = window;

    if (solana) {
      if (solana.isPhantom) {
        console.log("Phantom wallet encontrada!");
        const response = await solana.connect({ onlyIfTrusted: true });
        console.log(
          "Conectado com a Chave Pública:",
          response.publicKey.toString()
        );

        /*
         * Define a chave pública do usuário no estado para ser usado posteriormente!
         */
        setWalletAddress(response.publicKey.toString());
      }
    } else {
      alert("Objeto Solana não encontrado! Instale a Phantom Wallet 👻");
    }
  } catch (error) {
    console.error(error);
  }
};
```

Acho que isso é bem autoexplicativo. Acabamos de conectar nossa Phantom Wallet e agora recebemos os dados da carteira do usuário. Agora que temos isso, vamos em frente e vamos salvá-lo em nosso estado para usar mais tarde.

```jsx
{
  /* Adiciona a condição para mostrar isso apenas se não tivermos um endereço de carteira */
}
{
  !walletAddress && renderNotConnectedContainer();
}
```

Isso é um belo pedaço de código. Nós estamos dizendo ao React para apenas chamar esse método de renderização se não existir um `walletAddress` definido no nosso estado. Isso é chamado [**renderização condicional**](https://reactjs.org/docs/conditional-rendering.html) e vai nos ajudar a manter o rastreamento de diferentes estados para mostrar no nosso app!

```jsx
{/* Isso só foi adicionar para um estilozinho */}
<div className={walletAddress ? 'authed-container' : 'container'}>
```

Agora que vimos alguma renderização condicional, espero que faça um pouco de sentido! Queremos mudar alguns de nossos estilos CSS com base em se temos um `walletAddress` ou não! Você verá a diferença aqui na próxima seção quando construirmos a grade GIF.

### 🔥 Ok - agora conecte-se REALMENTE à carteira lol

Estamos quase lá! Se você clicar no seu novo botão invocado, perceberá que ele ainda não faz nada! Que diabos - isso é muito chato 👎.

Lembra daquela função que configuramos, mas ainda não adicionamos nenhuma lógica a ela? É hora de adicionar a lógica de conexão ao `connectWallet` :

```jsx
const connectWallet = async () => {
  const { solana } = window;

  if (solana) {
    const response = await solana.connect();
    console.log(
      "Conectado com a Chave Pública:",
      response.publicKey.toString()
    );
    setWalletAddress(response.publicKey.toString());
  }
};
```

Simples assim! Chame a função `connect` no objeto `solana` para lidar com todo o capricho de autorizar nosso Portal GIF com a carteira do usuário. Em seguida, vamos definir a propriedade `walletAddress` para que nossa página atualize e remova o botão 'Conecte sua carteira'.

Vá em frente e atualize sua página e pressione o botão 'Conecte sua carteira'! Se tudo funcionar, você finalmente verá a extensão Phantom Wallet aparecer assim:

![https://i.imgur.com/XhaYIuk.png](https://i.imgur.com/XhaYIuk.png)

Depois de pressionar conectar, seu botão deve desaparecer! VAMOS. LÁ. VAI.

**Você acabou de conectar uma carteira Solana ao seu aplicativo. Isso é muito louco!**

Agora, se você atualizar a página, sua função `checkIfWalletIsConnected` será chamada e seu botão deve desaparecer quase imediatamente 🤘.

Movimentos bem grandes aqui!

Você tem sua configuração básica de interface do usuário e pode facilmente "autenticar" um usuário com sua carteira Solana. Mole-mole.

Em seguida, vamos obter todas as configurações com as funções que precisamos para chamar nosso programa Solana + obter alguns dados. Nosso web app é meio chato/vazio rn! Vamos mudar isso :).

_Observação: nas configurações da Phantom (que você pode acessar clicando na engrenagem no canto inferior direito), você verá uma seção "Aplicativos confiáveis". Aqui, você verá seu URL Replit, ou `localhost:3000` se estiver executando seu aplicativo localmente. Sinta-se à vontade para revogar isso se quiser simular como se fosse alguém que acessa seu site e nunca se conectou antes. Ele basicamente redefinirá o acesso de suas carteiras a este site._

### 🚨 Relatório de progresso

_Faça isso senão Farza vai ficar triste :(_

Poste uma captura de tela do seu console em `#progress` mostrando sua chave pública com sua carteira conectada. Não se preocupe, você pode compartilhar sua chave pública. Por isso é "público" ;).
