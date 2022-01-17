📒 Leia direto da blockchain através do seu website
-----------------------------------------------

Impressionante. Nós conseguimos. Nós deployamos nosso website. Nós deployamos nosso contrato. Nós conectamos nossa carteira. Agora precisamos chamar nosso contrato diretamente do nosso website usando as credenciais que agora temos acesso do Metamask!

Então, nosso contrato inteligente tem esta função que traz o total de acenos.

```solidity
  function getTotalWaves() public view returns (uint256) {
      console.log("Nós temos um total de %d acenos!", totalWaves);
      return totalWaves;
  }
```

Vamos chamar essa função no nosso site :).

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
        console.log("Total de acenos retornado...", count.toNumber());
      } else {
        console.log("Objeto Ethereum não existe!");
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

`ethers` é uma biblioteca que ajuda nosso frontend a interagir com nosso contrato. Não se esqueça de importá-lo no início usando `import { ethers } from "ethers";`.

Um "Provider" é o que de fato usamos para interagir com os nodes Ethereum. Você se lembra como usamos o Alchemy para **deployar**? Bem, neste caso nós usaremos os nodes que o Metamask oferece por trás dos panos para enviar/receber informações do nosso contrato deployado.

[Aqui](https://docs.ethers.io/v5/api/signer/#signers) está um link explicando o que um signer é na linha 2.

Conecte a função anterior ao nosso butão de aceno atualizando o prop do `onClick` de `null` para `wave`:

```html
<button className="waveButton" onClick={wave}>
    Acene para mim
</button>
```

Impressionante.

Então, nesse momento o nosso código **quebra**. Na shell do nosso replit vai dizer:

![](https://i.imgur.com/JP2rryE.png)

Nós precisamos dessas duas variáveis!!

Você tem o endereço do contrato -- né? Lembra quando você fez o deploy do seu contrato e eu te falaei para salvar o endereço dele? É isso que está sendo pedido aqui!

Mas, o que é uma ABI? Anteriormente eu mencionei que quando você compila um contrato, ele criar vários arquivos para você na pasta `artifacts`. Uma ABI é um desses arquivos.

🏠 Configurando Endereço do Seu Contrato
-----------------------------

Lembra quando você fez o deploy do seu contrato na Testenet da Rinkby (épico, diga-se de passagem)? A informação mostrada na tela inlcuia o endereço do seu contrato inteligente e deve ser parecida como algo assim:

```
Deployando contratos com a conta: 0xF79A3bb8d5b93686c4068E2A97eAeC5fE4843E7D
Balanço da conta: 3198297774605223721
Endereço do WavePortal: 0xd5f08a0ae197482FA808cE84E00E97d940dBD26E
```

Você precisa conseguir acesso a essas informações no seu aplicativo React. E é tão fácil quanto criar uma nova propriedade no seu arquivo `App.js` chamada `contractAddress` e configurar o valor dela para `Endereço do WavePortal` que apareceu no seu console:

```javascript
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  /**
   * Crie uma variável aqui que guarda o endereço do contrato depois que você fez o deploy!
   */
  const contractAddress = "0xd5f08a0ae197482FA808cE84E00E97d940dBD26E";
```

🛠 Pegando o Conteúdo do Arquivo ABI 
---------------------------
**Não é melhor me assistir fazenod isso? Confira o vídeo abaixo!**
[Loom](https://www.loom.com/share/ddecf3caf54848a3a01edd740683ec48)

Olha só, você já tem meio caminho andado! Vamos voltar para a pasta do nosso contrato inteligente.

Quando você compila seu contrato inteligente, o compilador criar vários arquivos necessários para possibilitar a sua intereção com o contrato. Você pode encontrar esses arquivos na pasta `artifacts` localizada na raiz do seu projeto Solidity.

O arquivo ABI é o que nosso web app precisa para saber como se comunicar com nosso contrato. Leia sobre isso [aqui](https://docs.soliditylang.org/en/v0.5.3/abi-spec.html).

O conteúdo do arquivo ABI podem ser encontrados em um sofisticado arquivo JSON no seu projeto hardhat:

`artifacts/contracts/WavePortal.sol/WavePortal.json`


Então, a pergunta que temos que responde é: como colocamos esse arquivo JSON no nosso frontend? Para este projeto nós iremos fazer o bom e velho "copiar e colar"!

Copie o conteúdo do seu `WavePortal.json` e então vá para o seu web app. Você irá criar uma nova pasta chamada `utils` dentro da pasta `src`. Dentro de `utils` crie uma arquivo chamado `WavePortal.json`. Portanto o caminho completo vai ficar assim:

`src/utils/WavePortal.json`


Cole o arquivo JSON inteiro ali mesmo!

Agora que você tem o seu arquivo com todo o conteúdo do seu ABI pronto, é hora de importá-lo para o seu arquivo `App.js` e criar uma referência para ele. Logo abaixo de onde você fez o import do `App.css` faça também o importo do seu arquivo JSON e crie a referência do conteúdo do abi:


```javascript
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/WavePortal.json";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");

  const contractAddress = "0xd5f08a0ae197482FA808cE84E00E97d940dBD26E";
  /**
   * Crie uma variável aqui que referencie o conteúdo do abi!
   */
  const contractABI = abi.abi;
```
Vamos ver onde de fato você está usando este conteúdo do ABI:

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
        console.log("Total de acenos retornado...", count.toNumber());
      } else {
        console.log("Objeto Ethereum não existe!");
      }
    } catch (error) {
      console.log(error)
    }
  }
  ```

Uma vez que você adiciona aquele arquivo e clica no botão "Acene" -- **você estará oficialmente lendo informações do seu contrato na blockchain através do seu cliente web**.

📝 Escrevendo informações
---------------

O código para escrever informações para o seu contrato não é muito diferente do que lê as informações. A principal diferença é que quando nós queremos escrever novas informações para o nosso contrato, nós precisamos notificar os mineradores para que a transação seja minerada. Quando lemos informações, não precisamos fazer isso. Leitura é "gratuita" porque tudo que estamos fazendo é ler da blockchain, **ela não está sendo alterada. **

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
        console.log("Retrieved total wave count...", count.toNumber());

        /*
        * Execute de verdade o aceno do seu contrato inteligente
        */
        const waveTxn = await wavePortalContract.wave();
        console.log("Minerando...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Minerado -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Total de acenos retornado...", count.toNumber());
      } else {
        console.log("Objeto Ethereum não existe!");
      }
    } catch (error) {
      console.log(error)
    }
  }
```

Bem simples, né :)?

O que é incrível aqui é que enquanto a transação está sendo minerada você pode imprimir o hash da transação, copiá-lo/colá-lo no [Etherscan](https://rinkeby.etherscan.io/), e vê-lo sendo processado em tempo real :).

Quando rodamos isso, você verá que o contador de acenos terá aumentado em 1. Você também verá que o Metamask pedirá para pagar o "gas" que nós pagaremos usando nosso $ de mentirinha. Tem um artigo muito bom sobre isso [aqui](https://ethereum.org/en/developers/docs/gas/). Tente entender o que é gas :).

🎉 Sucesso
----------

**BOAAAAAAA :).**

Muita coisa legal mesmo. Agora temos um cliente de verdade que pode ler e escrever informações na blockchain. A partir daqui você pode fazer qualquer coisa que quiser. Você já aprendeu o básico. Você pode construir uma versão descentralizada do Twitter. Você pode contruir algo para as pessoas postarem seus memes favoritos e permitir que as pessoas deem "gorjeta" em ETH para as pessoas que postarem os melhores memes. Você pode construir um sistema de votação descentralizado que um país pode usá-lo para votações onde tudo é aberto e claro.

As possibilidades são verdadeiramente infinitas.

🚨 Antes de clicar em "Próxima Lição"
-------------------------------------------

*Nota: se vocÊ não fizer isso, Farza ficará muito triste :(.*

Customize seu site um pouco para mostrar o número total de acenos. Talvez mostrar uma barra de carregamento enquanto o aceno está sendo minerado, qualquer coisa que você quiser. Faça algo um pouco diferente!

Assim que você sentir que está pronto, compartilhe o link do seu website conosco em #progress para que possamos conectar nossas carteiras e acenar para você :).

🎁 Revisando
--------------------

Você está a caminho de conquistar a web descentralizada. IMPRESSIONANTE. Dê uma olhada em todo o código que você escreveu nesta seção ao visitar [este link](https://gist.github.com/adilanchian/71890bf4fcd8f78e94c77cf694b24659) para conferir se está tudo certo no seu código!
