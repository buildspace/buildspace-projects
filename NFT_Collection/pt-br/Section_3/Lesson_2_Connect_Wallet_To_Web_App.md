## 🌅 Usando window.ethereum()

Então, para o nosso site conseguir falar com a blockchain, precisamos de alguma maneira conectar nossa carteira nele. Uma vez que conectarmos a carteira no site, ele vai ter a permissão para chamar contratos inteligentes no nosso nome. **Lembre-se, é como ser autenticado para entrar em um site.**

Vá para o Replit e vá para  `App.js` dentro de `src`, aqui é onde vamos estar fazendo todo trabalho.

Se estivermos logados na Metamask, um objeto especial chamado  `ethereum`  será injetado dentro da nossa aba, que tem alguns métodos mágicos. Vamos checar se temos isso primeiro.

```javascript
import React, { useEffect } from "react";
import "./styles/App.css";
import twitterLogo from "./assets/twitter-logo.svg";
// Constants
const TWITTER_HANDLE = "Web3dev_";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = "";
const TOTAL_MINT_COUNT = 50;
const App = () => {
  const checkIfWalletIsConnected = () => {
    /*
     * Primeiro tenha certeza que temos acesso a window.ethereum
     */
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }
  };
  // Render Methods
  const renderNotConnectedContainer = () => (
    <button className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );
  /*
   * Isso roda nossa função quando a página carrega.
   */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Minha Coleção NFT</p>
          <p className="sub-text">
            Únicas. Lindas. Descubra a sua NFT hoje.
          </p>
          {/* adicione o seu render method aqui */}
          {renderNotConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
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

## 🔒 Ver se conseguimos acessar a conta do usuário

Então quando você rodar isso, você deve ver aquela linha "We have the Ethereum object" escrita no console do site quando você for inspecioná-lo. Se você estiver usando o Replit, tenha certeza que você está olhando para o console do site do projeto, e não o do Replit! Você pode acessar o console do seu site abrindo ele na sua própria aba e carregando as ferramentas de desenvolvedor. O URL deve se parecer com isso - `https://nft-starter-project.seuUsuario.repl.co/`

**BOA.**

Depois, nós precisamos checar se estamos autorizados mesmo a acessar a carteira do usuário. Uma vez que tivermos acesso a isso, podemos chamar nosso contrato inteligente.

Basicamente, a Metamask não dá as credenciais da carteira para todo website que vamos. Ele apenas dá para sites que foram autorizados. De novo, é como fazer login! Mas, o que estamos fazendo aqui é  **checando se estamos logados.**

Cheque o código abaixo.

```javascript
import React, { useEffect, useState } from "react";
import "./styles/App.css";
import twitterLogo from "./assets/twitter-logo.svg";
// Constantes
const TWITTER_HANDLE = "Web3dev_";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = "";
const TOTAL_MINT_COUNT = 50;
const App = () => {
  /*
   * Só uma variável de estado que usamos pra armazenar nossa carteira pública. Não esqueça de importar o useState.
   */
  const [currentAccount, setCurrentAccount] = useState("");
  /*
   * Precisamos ter certeza que isso é assíncrono.
   */
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }
    /*
     * Checa se estamos autorizados a carteira do usuário.
     */
    const accounts = await ethereum.request({ method: "eth_accounts" });
    /*
     * Usuário pode ter múltiplas carteiras autorizadas, nós podemos pegar a primeira que está lá!
     */
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };
  // Render Methods
  const renderNotConnectedContainer = () => (
    <button className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Minha Coleção NFT</p>
          <p className="sub-text">
            Únicas. Lindas. Descubra a sua NFT hoje.
          </p>
          {renderNotConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
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

## 🛍 Construir um botão de conecte sua carteira

Quando você rodar o código acima, o console.log deve escrever   `Nenhuma conta autorizada foi encontrada. (No authorized account found")`. Por quê? Porque nós nunca dissemos explicitamente para o Metamask, _"hey metamask, por favor dê acesso à minha carteira para esse site_.

Precisamos criar um botão  `connectWallet` . No mundo da Web3, conectar a sua carteira é literalmente um botão de Login para o usuário.

Pronto para o login mais fácil da sua vida? :)
Cheque:

```javascript
import React, { useEffect, useState } from "react";
import "./styles/App.css";
import twitterLogo from "./assets/twitter-logo.svg";
const TWITTER_HANDLE = "Web3dev_";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = "";
const TOTAL_MINT_COUNT = 50;
const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }
    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };
  /*
   * Implemente seu método connectWallet aqui
   */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      /*
       * Método chique para pedir acesso a conta.
       */
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      /*
       * Boom! Isso deve escrever o endereço público uma vez que autorizar o Metamask.
       */
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };
  // Render Methods
  const renderNotConnectedContainer = () => (
    <button
      onClick={connectWallet}
      className="cta-button connect-wallet-button"
    >
      Connect to Wallet
    </button>
  );
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);
  /*
   * Adicionei um render condicional! Nós não queremos mostrar o Connect to Wallet se já estivermos conectados
   */
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Minha Coleção NFT</p>
          <p className="sub-text">
            Únicas. Lindas. Descubra a sua NFT hoje.
          </p>
          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            <button onClick={null} className="cta-button connect-wallet-button">
              Mint NFT
            </button>
          )}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
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