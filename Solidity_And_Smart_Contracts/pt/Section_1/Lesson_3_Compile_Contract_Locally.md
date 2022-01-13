🔥 Imitando o ambiente blockchain para testar
-----------------------------------------------

Você já fez isso. Você já escreveu um contrato inteligente. Você é um campeão!

Agora precisamos realmente\
1\. Compilar.\
2\. Fazer o deploy em nossa blockchain local.\
3\. Quando estiver lá, esse console.log será executado :).

Precisamos fazer isso porque no mundo real, os contratos inteligentes vivem na blockchain. E queremos que nosso site e contrato inteligente sejam usados por pessoas reais para que eles possam 👋 para nós ou fazer o que você quiser que elas façam!

Então, mesmo quando estamos trabalhando localmente, queremos imitar esse ambiente. Tecnicamente, poderíamos apenas compilar e executar o código Solidity, mas o que torna o Solidity mágico é como ele pode interagir com a blockchain e carteiras Ethereum (que veremos mais na próxima lição). Então, é melhor acabar com isso agora.

Vamos apenas escrever um script personalizado que trata dessas 3 etapas para nós.

Vamos fazer isso!

📝 Crie um script para executar nosso contrato
-------------------------------------

Vá para o diretório **`scripts`** e crie um arquivo chamado **`run.js`.**

Então, para testar um contrato inteligente, temos que fazer um monte de coisas certas. Como: compilar, implantar e executar.

Nosso script tornará muito fácil iterar em nosso contrato muito rápido :).

Então, isso é o que **`run.js`** vai ter:

```javascript
const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();
  console.log("Contrato deployado para:", waveContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
```

Impressionante.

🤔 Como funciona?
-----------------

Novamente indo linha por linha aqui.

```javascript
const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
```

Isso irá compilar nosso contrato e gerar os arquivos necessários que precisamos para trabalhar com nosso contrato no diretório `artifacts`. Vá dar uma olhada depois de executar isso :).

```javascript
const waveContract = await waveContractFactory.deploy();
```

Isso é bem chique :).

O que está acontecendo aqui é que o Hardhat criará uma rede Ethereum local para nós, mas apenas para este contrato. Então, depois que o script for concluído, ele destruirá essa rede local. Então, toda vez que você executar o contrato, será uma nova blockchain. Pra que isso? É como atualizar seu servidor local todas as vezes para que você sempre comece de um servidor limpo, o que facilita para debugar.

```javascript
await waveContract.deployed();
```

Vamos esperar até que nosso contrato seja oficialmente deployado em nossa rede blockchain local! Nosso `constructor` é executado quando realmente implantamos.

```javascript
console.log("Contrato deployado para:", waveContract.address);
```

Finalmente, uma vez deployado, o `waveContract.address` basicamente nos dará o endereço do contrato implantado. Este endereço é como podemos realmente encontrar nosso contrato na blockchain. Existem milhões de contratos na rede blockchain de verdade. Assim, este endereço nos dá acesso fácil ao contrato com o qual estamos interessados em trabalhar! Isso será mais importante um pouco mais tarde, quando deployarmos em uma rede Ethereum real.

Vamos executá-lo!

```bash
npx hardhat run scripts/run.js
```

Você deverá ver seu `console.log` rodando dentro do contrato e então você também deverá ver o endereço do contrato aparecer!!! Aqui está o que eu recebo:

![](https://i.imgur.com/ug79rOM.png)


🎩 Hardhat & HRE
----------------

Nesses blocos de código você notará constantemente que usamos `hre.ethers`, mas `hre` nunca é importado em lugar algum? Que tipo de feitiçaria é essa? 🧙

Diretamente da própria documentação do Hardhat, você notará isso:

> O Hardhat Runtime Environment, ou HRE abreviado, é um objeto que contém todas as funcionalidades que o Hardhat disponibiliza ao executar uma tarefa, teste ou script. Na realidade, Hardhat é o HRE.

Então o que isso quer dizer? Bem, toda vez que você executa um comando de terminal que começa com `npx hardhat`, você obtém este objeto `hre` construído em tempo real usando o `hardhat.config.js` especificado em seu código! Isso significa que você nunca precisará fazer algum tipo de importação em seus arquivos como:

`const hre = require("hardhat")`

**Você verá muito `hre` em nosso código, mas nunca será importado para lugar nenhum! Confira esta [documentação do Hardhat](https://hardhat.org/advanced/hardhat-runtime-environment.html) legal para saber mais sobre isso!**

🚨 Antes de clicar em "Próxima lição"
-------------------------------------------

*Nota: se você não fizer isso, Farza ficará muito triste :(.*

Vá para #progress e poste um screenshot do seu terminal com a saída.

Certifique-se de fazer o console.log do que quiser! Agora você escreveu seu próprio contrato e o executou deployando em uma blockchain local WOOOOOOOOOO VAMOOOS LÁ.