📒 Lendo a blockchain a partir do nosso site
-----------------------------------------------

Impressionante. Conseguimos. Implantamos nosso site. Implementamos nosso contrato. Conectamos nossa carteira. Agora precisamos chamar nosso contrato a partir do nosso site usando as credenciais da Metamask às quais temos acesso agora!

Então, nosso contrato inteligente tem essa função que recupera o número total de ondas.

```solidity
  function getTotalWaves() public view returns (uint256) {
      console.log("Temos %d de acenos!", totalWaves);
      return totalWaves;
  }
```

Vamos chamar esta função do nosso site :).

Vá em frente e escreva esta função logo abaixo da nossa função `connectWallet()`.


```javascript
const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Recuperado o número de acenos...", count.toNumber());
      } else {
        console.log("Objeto Ethereum não encontrado!");
      }
    } catch (error) {
      console.log(error)
    }
}
```

Explicação rápida aqui:

```javascript
const provider = new ethers.providers.Web3Provider(ethereum);
const signer = provider.getSigner();
```

`ethers` é uma biblioteca que ajuda nosso frontend a falar com nosso contrato. Certifique-se de importá-lo no topo usando `import { ethers } from "ethers";`.

Um "Provedor" é o que usamos para conversar com os nós Ethereum. Lembra como estávamos usando o Alchemy para o **deploy**? Bem, neste caso, usamos os nós que a Metamask fornece em segundo plano para enviar/receber dados do nosso contrato.

[Aqui está](https://docs.ethers.io/v5/api/signer/#signers) um link explicando o que é um signatário na linha 2.

Conecte esta função ao nosso botão wave atualizando a prop `onClick` de `null` para `wave`:

```html
<button className="waveButton" onClick={wave}>
    Acene para mim
</button>
```

Impressionante.

Então, agora este código **quebra**. Em nosso shell do Replit, aparecerá:

![](https://i.imgur.com/JP2rryE.png)

Precisamos dessas duas variáveis!!

Então, o endereço do contrato você tem -- certo? Lembra quando você fez o deploy do seu contrato e eu disse para você salvar o endereço? É isso que está pedindo!

Mas, o que é um ABI? Muito antes eu mencionei como quando você compila um contrato, ele cria um monte de arquivos para você em `artifacts`. Um ABI é um desses arquivos.

🏠 Configurando o endereço do seu contrato
-----------------------------

Lembra quando você implantou seu contrato no Rinkeby Testnet (épico, por sinal)? A saída dessa implantação incluiu seu endereço de contrato inteligente, que deve ser algo assim:

```
Deploying contracts with the account: 0xF79A3bb8d5b93686c4068E2A97eAeC5fE4843E7D
Account balance: 3198297774605223721
WavePortal address: 0xd5f08a0ae197482FA808cE84E00E97d940dBD26E
```

Você precisa ter acesso a ele em seu aplicativo React. É tão fácil quanto criar uma nova propriedade em seu arquivo `App.js` chamada `contractAddress` e definir seu valor para o `WavePortal address` que é impresso em seu console:

```javascript
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  /**
   * Cria uma variável para guardar o endereço do contrato após o deploy!
   */
  const contractAddress = "0xd5f08a0ae197482FA808cE84E00E97d940dBD26E";
```

🛠 Obtendo o conteúdo do arquivo ABI
---------------------------
** Prefere me ver passar por isso? Confira o vídeo abaixo!**
[Tear](https://www.loom.com/share/ddecf3caf54848a3a01edd740683ec48)

Olhe para você, já está no meio do caminho! Vamos voltar para nossa pasta do contrato inteligente.

Quando você compila seu contrato inteligente, o compilador gera vários arquivos necessários que permitem que você interaja com o contrato. Você pode encontrar esses arquivos na pasta `artifacts` localizada na raiz do seu projeto Solidity.

O arquivo ABI é algo que nosso aplicativo web precisa para saber como se comunicar com nosso contrato. Leia sobre isso [aqui](https://docs.soliditylang.org/en/v0.5.3/abi-spec.html).

O conteúdo do arquivo ABI pode ser encontrado em um arquivo JSON em seu projeto Hardhat:

`artifacts/contracts/WavePortal.sol/WavePortal.json`

Então, a questão é como colocamos esse arquivo JSON em nosso frontend? Para este projeto vamos fazer o bom e velho "control c, control v"!

Copie o conteúdo do seu `WavePortal.json` e depois vá para o seu aplicativo web. Você vai criar uma nova pasta chamada `utils` em `src`. Em `utils` crie um arquivo chamado `WavePortal.json`. Assim, o caminho completo ficará assim:

`src/utils/WavePortal.json`

Cole todo o arquivo JSON ali mesmo!

Agora que você tem seu arquivo com todo o conteúdo da ABI pronto, é hora de importá-lo para o arquivo `App.js` e criar uma referência a ele. Logo abaixo de onde você importou `App.css` vá em frente e importe seu arquivo JSON e crie sua referência para o conteúdo ABI:


```javascript
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/WavePortal.json";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");

  const contractAddress = "0xd5f08a0ae197482FA808cE84E00E97d940dBD26E";
  /**
   * Cria uma variável para referenciar o conteúdo ABI!
   */
  const contractABI = abi.abi;
```
Vamos dar uma olhada onde você está usando o conteúdo ABI:

```javascript
const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        /*
        * Você está usando o contractABI aqui
        */
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Recuperado o número de acenos...", count.toNumber());
      } else {
        console.log("Objeto Ethereum não encontrado!");
      }
    } catch (error) {
      console.log(error)
    }
  }
  ```

Depois de adicionar esse arquivo e clicar no botão "Acenar" -- **você estará lendo oficialmente os dados do seu contrato na blockchain por meio do seu cliente web**.

📝 Escrevendo dados
---------------

O código para gravar dados em nosso contrato não é muito diferente de ler dados. A principal diferença é que quando queremos escrever novos dados em nosso contrato, precisamos notificar os mineradores para que a transação possa ser minerada. Quando lemos dados, não precisamos fazer isso. As leituras são "gratuitas" porque tudo o que estamos fazendo é ler da blockchain, **não a estamos alterando. **

Aqui está o código para acenar:

```javascript
const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Recuperando o total de acenos...", count.toNumber());

        /*
        * Executar o aceno a partir do contrato inteligente
        */
        const waveTxn = await wavePortalContract.wave();
        console.log("Minerando...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Minerado -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Total de acenos recuperado...", count.toNumber());
      } else {
        console.log("Objeto Ethereum não encontrado!");
      }
    } catch (error) {
      console.log(error)
    }
  }
```

Bem simples, né :)?

O que é incrível aqui é que, enquanto a transação está sendo minerada, você pode imprimir o hash da transação, copiar/colar no [Etherscan](https://rinkeby.etherscan.io/) e vê-lo sendo processado em tempo real: ).

Quando executarmos isso, você verá que a contagem total de acenos é aumentada em 1. Você também verá que a Metamask aparece e nos pede para pagar "gas" que pagamos usando nosso $ falso. Há um ótimo artigo sobre isso [aqui](https://ethereum.org/en/developers/docs/gas/). Tente descobrir o que é o **gas** :).

🎉 Sucesso
----------

**BOAAA :).**

Coisas realmente boas. Agora temos um cliente real que pode ler e gravar dados na blockchain. A partir daqui, você pode fazer o que quiser. Você já sabe o básico. Você pode construir uma versão descentralizada do Twitter. Você pode criar uma maneira para as pessoas postarem seus memes favoritos e permitir que as pessoas "pontuem" as pessoas que postarem os melhores memes com ETH. Você pode construir um sistema de votação descentralizado que um país pode usar para votar em um político onde tudo é aberto e claro.

As possibilidades são infinitas.

🚨 Antes de clicar em "Próxima lição"
--------------------------------------------

*Nota: se você não fizer isso, Farza ficará muito triste :(.*

Personalize um pouco seu site para mostrar o número total de acenos. Talvez mostrar uma barra de carregamento enquanto a onda está sendo minerada, o que você quiser. Faça algo um pouco diferente!

Quando sentir que está pronto, compartilhe o link do seu site conosco em #progress para que possamos conectar nossas carteiras e acenar para você :).

🎁 Encerramento
--------------------

Você está a caminho de conquistar a web descentralizada. IMPRESSIONANTE. Dê uma olhada em todo o código que você escreveu nesta seção visitando [este link](https://gist.github.com/adilanchian/71890bf4fcd8f78e94c77cf694b24659) para ter certeza de que está no caminho certo com seu código!
