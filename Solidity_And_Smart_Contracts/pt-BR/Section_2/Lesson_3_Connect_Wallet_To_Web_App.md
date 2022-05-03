🌅 Usando window.ethereum()
--------------------------

Então, para que nosso site converse com a blockchain, precisamos de alguma forma conectar nossa carteira a ele. Assim que conectarmos nossa carteira ao nosso site, nosso site terá permissões para chamar contratos inteligentes em nosso nome. Lembre-se, é como se autenticar em um site.

Vá ao Replit e depois abra o arquivo `App.jsx` em `src`, é aqui que faremos todo o nosso trabalho.

Se estivermos logados na Metamask, ela injetará automaticamente um objeto especial chamado `ethereum` em nossa janela. Vamos verificar primeiro se temos isso.


```javascript
import React, { useEffect } from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {

  const checkIfWalletIsConnected = () => {
    /*
    * Primeiro checamos se temos acesso ao objeto window.ethereum
    */
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Garanta que possua a Metamask instalada!");
      return;
    } else {
      console.log("Temos o objeto ethereum", ethereum);
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  const wave = () => {
    
  }

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Olá Pessoal!
        </div>

        <div className="bio">
        Eu sou o danicuki e já trabalhei com música, sabia? Legal, né? Conecte sua carteira Ethereum wallet e me manda um tchauzinho!
        </div>

        <button className="waveButton" onClick={wave}>
          Mandar Tchauzinho 🌟
        </button>
      </div>
    </div>
  );
}
```

🔒 Veja se podemos acessar a conta do usuário
-----------------------------------------

Então quando você executar o projeto, deverá ver a linha "Temos o objeto ethereum" impressa no console do site quando for inspecioná-lo. Se você estiver usando o Replit, verifique se está olhando para o console do site do seu projeto, não para o espaço de trabalho do Replit! Você pode acessar o console do seu site abrindo-o em sua própria janela/guia e iniciando as ferramentas do desenvolvedor. A URL deve ser algo como - `https://projeto-tchauzinho.seuusuario.repl.co/`

**LEGAL.**

Em seguida, precisamos verificar se estamos autorizados a acessar a carteira do usuário. Assim que tivermos acesso a ela, podemos chamar nosso contrato inteligente!

Basicamente, a Metamask não fornece nossas credenciais para todos os sites que visitamos. Ela só fornece aos sites que autorizamos. Novamente, é como fazer login! Mas o que estamos fazendo aqui é **verificar se estamos "conectados".**

Confira o código abaixo.

```javascript
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {

  /*
  * Apenas uma variável de estado que utilizamos para armazenar a carteira pública do usuário.
  */
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Garanta que possua a Metamask instalada!");
        return;
      } else {
        console.log("Temos o objeto ethereum", ethereum);
      }

      /*
      * Confirma se estamos autorizados a acessar a carteira do cliente
      */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Encontrada a conta autorizada:", account);
        setCurrentAccount(account)
      } else {
        console.log("Nenhuma conta autorizada foi encontrada")
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  const wave = () => {
    
  }

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Olá Pessoal!
        </div>

        <div className="bio">
        Eu sou o danicuki e já trabalhei com música, sabia? Legal, né? Conecte sua carteira  Ethereum wallet e me manda um tchauzinho!
        </div>

        <button className="waveButton" onClick={wave}>
          Mandar Tchauzinho 🌟
        </button>
      </div>
    </div>
  );
}
```

Então, usamos esse método especial `eth_accounts` para ver se estamos autorizados a acessar alguma das contas na carteira do usuário. Uma coisa a ter em mente é que o usuário pode ter várias contas em sua carteira. Neste caso, pegamos apenas a primeira.

💰 Crie um botão para conectar a carteira
--------------------------------

Quando você executar o código acima, o console.log deve imprimir `Nenhuma conta autorizada foi encontrada`. Por quê? Bem, porque nunca dissemos explicitamente à Metamask, "Olá Metamask, dê a este site acesso à minha carteira, por favor".

Precisamos criar um botão `connectWallet`. No mundo da Web3, conectar sua carteira é literalmente um botão "Login" para seu usuário :). Confira:


```javascript
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Garanta que possua a Metamask instalada!");
        return;
      } else {
        console.log("Temos o objeto ethereum", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Encontrada a conta autorizada:", account);
        setCurrentAccount(account)
      } else {
        console.log("Nenhuma conta autorizada foi encontrada")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implemente aqui o seu método connectWallet
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("MetaMask encontrada!");
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

  const wave = () => {
    
  }

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Olá Pessoal!
        </div>

        <div className="bio">
        Eu sou o danicuki e já trabalhei com música, sabia? Legal, né? Conecte sua carteira  Ethereum wallet e me manda um tchauzinho!
        </div>

        <button className="waveButton" onClick={wave}>
          Mandar Tchauzinho 🌟
        </button>
        {/*
        * Se não existir currentAccount, apresente este botão
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Conectar carteira
          </button>
        )}
      </div>
      
    </div>
  );
}
```

Nosso código está ficando um pouco longo, mas você pode ver como nossa função `connectWallet` é curta. Neste caso, eu uso a função `eth_requestAccounts` porque estou literalmente pedindo à Metamask para me dar acesso à carteira do usuário.

Também adicionei um botão para que possamos chamar nossa função `connectWallet`. Você notará que só mostro este botão se não tivermos `currentAccount`. Se já temos `currentAccount`, isso significa que já temos acesso a uma conta autorizada na carteira do usuário.

🌐 Conecte-se!
-----------

Agora, é hora da mágica! Confira o vídeo abaixo:
[Tear](https://www.loom.com/share/2a5794fca9064a059dca1989cdfa2c37?t=0)

🚨 Obrigatório: Antes de clicar em "Próxima lição"
--------------------------------------------

Fizemos muito nas duas últimas aulas. Alguma pergunta? Certifique-se de perguntar na #seção-2-ajuda!
