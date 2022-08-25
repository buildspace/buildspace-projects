### **🌅 Usando o objeto Ethereum.**

Então, para conseguir que o nosso site fale com a blockchain, precisamos de alguma maneira conectar nossa carteira nele. Uma vez que conectarmos nossa carteira no website, nosso site terá a permissão de chamar um contrato inteligente no nosso comportamento. **Lembre-se, é como fazer a autenticação dentro de um site.**

Vá para o seu código e entre em  `App.js` embaixo de `src`. Aí é o ponto de entrada principal do nosso site será feito.

Se estivermos logados no MetaMask, ele vai injetar automaticamente um objeto chamado `ethereum` dentro da nossa janela que tem alguns métodos mágicos. Vamos checar se temos isso primeiro:

```javascript
import React, { useEffect } from "react";
import "./App.css";
import twitterLogo from "./assets/twitter-logo.svg";

// Constantes
const TWITTER_HANDLE = "Web3dev_";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  /*
   * Comece criando uma nova ação que vamos rodar enquanto os componentes carregam
   */
  // Ações
  const checkIfWalletIsConnected = () => {
    /*
     * Primeiro teremos certeza que temos acesso a window.ethereum
     */
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Eu acho que você não tem a metamask!");
      return;
    } else {
      console.log("Nós temos o objeto ethereum", ethereum);
    }
  };

  /*
   * Isso roda quando a página carrega.
   */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Batalhas no Metaverso ⚔️</p>
          <p className="sub-text">Junte-se a mim para vencer os inimigos do Metaverso!</p>
        </div>
        <div className="connect-wallet-container">
          <img
            src="https://thumbs.gfycat.com/AnchoredPleasedBergerpicard-size_restricted.gif"
            alt="Monty Python Gif"
          />
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
```

### **🔒 Acessando a conta do usuário.**

Então, quando você rodar isso, você deve ver aquela linha "_Nós temos o objeto ethereum_" escrita no console do website quando você inspecioná-lo.

**Legal.**

Depois, precisamos checar se estamos autorizados a acessar a carteira do usuário. Uma vez que tivermos acesso a isso, poderemos chamar o nosso contrato inteligente!

Basicamente, a Metamask não dá as credenciais da carteira para todo o site que vamos. Só para os que autorizamos. De novo, parece com uma tela de login! Mas, o que estamos fazendo aqui é **checando se estamos logados**.

Cheque o código abaixo:

```javascript
/*
 * Nós vamos precisar usar estados agora! Não esqueça de importar useState
 */
import React, { useEffect, useState } from "react";
import "./App.css";
import twitterLogo from "./assets/twitter-logo.svg";

// Constantes
const TWITTER_HANDLE = "Web3dev_";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  /*
   * Só uma variável de estado que vamos usar para armazenar a carteira pública do usuário.
   */
  const [currentAccount, setCurrentAccount] = useState(null);

  /*
   * Já que esse método vai levar um tempo, lembre-se de declará-lo como async
   */
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Eu acho que você não tem a metamask!");
        return;
      } else {
        console.log("Nós temos o objeto ethereum", ethereum);
      }
        /*
         * Checa se estamos autorizados a acessar a carteira do usuário.
         */
        const accounts = await ethereum.request({ method: "eth_accounts" });

        /*
         * Usuário pode ter múltiplas contas autorizadas, pegamos a primeira se estiver ali!
         */
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Carteira conectada::", account);
          setCurrentAccount(account);
        } else {
          console.log("Não encontramos uma carteira conectada");
        }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Batalhas no Metaverso ⚔️</p>
          <p className="sub-text">Junte os amigos e proteja o Metaverso!!</p>
          <div className="connect-wallet-container">
            <img
              src="https://thumbs.gfycat.com/AnchoredPleasedBergerpicard-size_restricted.gif"
              alt="Nascimento Gif"
            />
          </div>
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
```

### **🛍 Renderizar o botão de conectar a carteira.**

Quando você roda o código acima, o `console.log` que escreve deve ser `Não encontramos uma carteira conectada`. Por quê? Bom porque nós não falamos explicitamente para o Metamask, *"Ei Metamask, por favor dê a esse website o acesso à minha carteira".*

Precisamos criar um botão `connectWallet` . No mundo da web3, conectar a sua carteira é literalmente fazer login como usuário.

Pronto para a experiência de login mais fácil da sua vida?

```javascript
/*
 * Nós vamos precisar usar estados agora! Não esqueça de importar useState
 */
import React, { useEffect, useState } from "react";
import "./App.css";
import twitterLogo from "./assets/twitter-logo.svg";

// Constantes
const TWITTER_HANDLE = "Web3dev_";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  /*
   * Só uma variável de estado que vamos usar para armazenar a carteira pública do usuário.
   */
  const [currentAccount, setCurrentAccount] = useState(null);

  /*
   * Já que esse método vai levar um tempo, lembre-se de declará-lo como async
   */
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Eu acho que você não tem a metamask!");
        return;
      } else {
        console.log("Nós temos o objeto ethereum", ethereum);

        /*
         * Checa se estamos autorizados a acessar a carteira do usuário.
         */
        const accounts = await ethereum.request({ method: "eth_accounts" });

        /*
         * Usuário pode ter múltiplas contas autorizadas, pegamos a primeira se estiver ali!
         */
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Carteira conectada::", account);
          setCurrentAccount(account);
        } else {
          console.log("Não encontramos uma carteira conectada");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  /*
   * Implementa o seu método connectWallet aqui
   */
  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Instale a MetaMask!");
        return;
      }

      /*
       * Método chique para pedir acesso para a conta.
       */
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      /*
       * Boom! Isso deve escrever o endereço público uma vez que autorizarmos Metamask.
       */
      console.log("Contectado", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Batalhas no Metaverso ⚔️</p>
          <p className="sub-text">Junte os amigos e proteja o Metaverso!!</p>
          <div className="connect-wallet-container">
            <img
              src="https://thumbs.gfycat.com/AnchoredPleasedBergerpicard-size_restricted.gif"
              alt="Nascimento Gif"
            />
            {/*
             * Botão que vamos usar para disparar a conexão da carteira. Não esqueça de adicionar o evento onClick para chamar seu método!
             */}
            <button
              className="cta-button connect-wallet-button"
              onClick={connectWalletAction}
            >
              Conecte sua carteira para começar
            </button>
          </div>
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
```

Clique seu novo botão chique e você deve ver sua extensão Chrome do Metamask aparecer. Boa!

![Untitled](https://i.imgur.com/8pJqLFd.png)


## 🚨 Reporte seu Progresso!

Em #progresso, poste uma screenshot do seu site muito chique e não se esqueça de mudar seus GIFs e títulos para ficar algo mais a sua cara. Faça do SEU jeito!
