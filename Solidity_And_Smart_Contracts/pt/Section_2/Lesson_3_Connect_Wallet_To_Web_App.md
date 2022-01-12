🌅 Usando window.ethereum()
--------------------------

Então, para nosso website conversar com a blockchain, nós precisamos encontrar alguma forma de conectar nossa carteira a ele. Uma vez que ela está conectada ao nosso site, ele terá permissão para chamar smart contracts por nós. Lembre-se, isso é parecido com o processo de autenticação em um website.

Vá até o Replit e vá para `App.jsx` abaixo de `src`, é aí que faremos todo nosso trabalho.

Se estivermos logados no Metamask, ele automaticamente irá injetar um objeto especial chamado named `ethereum` na nossa janela. Vamos primeiro conferir se nós já temos isso.

```javascript
import React, { useEffect } from "react";
import "./App.css";

const App = () => {
  const checkIfWalletIsConnected = () => {
    /*
    * Primeiramente vamos conferir se temos acesso a window.ethereum
    */
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Confira se tem metamask!");
    } else {
      console.log("Nós temos o objeto ethereum", ethereum);
    }
  }

  /*
  * Isto roda nossa função quando a página carrega.
  */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        👋 Olá!
        </div>

        <div className="bio">
          Eu sou farza e eu trabalhei com carros autônomos, bem legal né? Conecte sua carteira Ethereum e me mande um tchau!
        </div>

        <button className="waveButton" onClick={null}>
          Acene para mim
        </button>
      </div>
    </div>
  );
}

export default App
```

🔒 Veja se podemos acessar a conta do usuario
-----------------------------------------

Então quando você roda isso, você deve ver a frase "Nós temos o objeto ethereum" impressa no console do website queando você fizer o inspect. Se você estiver usando o Replit, cheque que você está olhando para o console do site do seu projeto, e não para o workspace do Replit! Você pode acessar o console do seu website abrindo-o na sua propria janela e inicializando as ferramentas de desenvolvimento. A URL deve ser parecida com isto - `https://waveportal-starter-project.yourUsername.repl.co/`

**BOA.**

Em seguida, precisamos checar se nós temos mesmo autorização para acessar a carteira do usuário. Um vez que temos acesso a ela, nós podemos chamar o nosso smart contract!

Basicamente, o Metamask não dá nossas credenciais para todos os sites que acessamos. Ele dá somente para os sites que autorizamos. Novamente, é muito parecido com o processo de login! Mas, o que nós estamos fazendo aqui é **checar se nós estamos "logados".**

Confira o código abaixo.

```javascript
import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  /*
  * Apenas uma variável de estado que usamos para guardar o endereço público da carteira do nosso usuário.
  */
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Confira se tem metamask!");
        return;
      } else {
        console.log("Nós temos o objeto ethereum", ethereum);
      }

      /*
      * Confira se temos autorização para acessar a carteira do usuário
      */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Foi encontrada uma conta autorizada:", account);
        setCurrentAccount(account)
      } else {
        console.log("Não foi encontrada nenhuma conta autorizada")
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          👋 Olá!
        </div>

        <div className="bio">
          Eu sou farza e eu trabalhei com carros autônomos, bem legal né? Conecte sua carteira Ethereum e me mande um tchau!
        </div>

        <button className="waveButton" onClick={null}>
          Acene para mim
        </button>
      </div>
    </div>
    );
  }
export default App
```

Portanto, nós usamos aquele metodo especial `eth_accounts` para ver se nós temos autorização para acessar qualquer uma das contas na carteira do usuário. É importante lembrar que o usuário pode ter várias contar na carteira dele. Neste caso, só pegaremos a primeira.

💰 Construa um botão para conectar a carteira
--------------------------------

Quando você roda o código acima, o console.log na tela deveria ser `Não foi encontrada nenhuma conta autorizada`. Por quê? Porque nós nunca falamos explicitamente para o Metamask, "hey Metamask, dê a este site accesso a minha carteira, por favor". 

Precisamos criar um botão `connectWallet`. Nos mundo do Web3, conectar sua carteira é literalmente um botão de "Login" para seu usuário :). Olha só:

```javascript
import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Confira se tem metamask!");
        return;
      } else {
        console.log("Nós temos o objeto ethereum", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Foi encontrada uma conta autorizada:", account);
        setCurrentAccount(account);
      } else {
        console.log("Não foi encontrada nenhuma conta autorizada")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Faça seu método connectWallet aqui
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Pegar MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Conectado", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        👋 Olá!
        </div>

        <div className="bio">
          Eu sou farza e eu trabalhei com carros autônomos, bem legal né? Conecte sua carteira Ethereum e me mande um tchau!
        </div>

        <button className="waveButton" onClick={null}>
          Acene para mim
        </button>

        {/*
        * Se não tiver nenhum currentAccount renderize este butão
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Conectar Carteira
          </button>
        )}
      </div>
    </div>
  );
}

export default App
```

Nosso código está ficando grande aqui, mas você pode ver o quão curta é a nossa função `connectWallet` . Neste caso, eu uso a função `eth_requestAccounts` porque eu estou literalmente pedindo ao Metamask para me dar acesso a carteira do usuário.

Na linha 67, eu também adicionei o botão para que nós possamos chamar nossa função `connectWallet`. Você notará que eu apena mostrei este botão se nós não tivermos uma `currentAccount`. Se nós já tivermos uma currentAccount (conta atual), então isso significa que nós já temos acesso a uma contar autorizada na carteira do usuário. 

🌐 Conecte!
-----------

Agora é o hora da mágica! Confira o vídeo abaixo:
[Loom](https://www.loom.com/share/1d30b147047141ce8fde590c7673128d?t=0)

🚨 Obrigatório: Antes de você clicar em "Próxima Lição"
-------------------------------------------

Nós acabamos de fazer muita coisa nas duas últimas lições. Dúvidas? Não deixe de perguntar em #section-2-help!
