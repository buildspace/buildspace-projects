🔥 Imitando o ambiente blockchain para testar
-----------------------------------------------

Você conseguiu. Você escreveu um contrato inteligente. Você é top top!

Agora precisamos realmente\
1\. Compilá-lo.\
2\. Implantá-lo na nossa blockchain local.\
3\. Quando implantado, aquele console.log vai rodar :)

Precisamos fazer isso porque no mundo real, os contratos inteligentes vivem na blockchain. E queremos que nosso site e contrato inteligente sejam usados por pessoas reais para que elas possam 👋 conosco ou fazer o que você quiser que elas façam!

Então, mesmo quando estamos trabalhando localmente, queremos imitar esse ambiente. Tecnicamente, poderíamos apenas compilar e executar o código Solidity, mas o que torna o Solidity mágico é como ele pode interagir com a blockchain e com as carteiras Ethereum (que veremos mais na próxima lição). Então, é melhor resolver isso agora.

Vamos apenas escrever um script personalizado que trata dessas 3 etapas pra gente.

Vamos lá!

📝 Crie um script para executar nosso contrato
--------------------------

Vá para o diretório **`scripts`** e crie um arquivo chamado **`run.js`.**

Então, para testar um contrato inteligente, temos que fazer um monte de coisas da forma correta. Como: compilar, implantar e executar.

Nosso script tornará muito fácil iterar em nosso contrato de forma rápida :)

Copie e cole o conteúdo abaixo e salve no arquivo **`run.js`**:

```javascript
const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();
  console.log("Contract deployed to:", waveContract.address);
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

Novamente indo linha por linha.

```javascript
const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
```

Esse trecho compilará nosso contrato e gerará os arquivos necessários que precisamos para trabalhar com nosso contrato no diretório `artifacts`. Vá dar uma olhada depois que colocar para executar :)

```javascript
const waveContract = await waveContractFactory.deployed();
```

Isso é bem loko :).

O que está acontecendo aqui é que a Hardhat criará uma rede Ethereum local, mas apenas para este contrato. Então, depois que o script for concluído, ele destruirá essa rede local. Então, toda vez que você executar o contrato, será uma nova blockchain. Qual é o ponto? É como atualizar seu servidor local todas as vezes para que você sempre comece de um papel em branco, o que facilita a depuração dos erros.

```javascript
await waveContract.deploy();
```

Vamos esperar até que o nosso contrato seja oficialmente implantado na nossa blockchain local! Nosso `constructor` é executado quando fazemos o deploy.

```javascript
console.log("Contract deployed to:", waveContract.address);
```

Finalmente, uma vez implantado, o `waveContract.address` basicamente nos dará o endereço do contrato. Este endereço é a forma como podemos encontrar nosso contrato na blockchain. Existem milhões de contratos no blockchain real. Assim, este endereço nos dá acesso fácil ao contrato com o qual estamos interessados em trabalhar! Isso será mais importante um pouco mais tarde, quando implantarmos em uma rede Ethereum real.

Vamos executá-lo!

```bash
npx hardhat run scripts/run.js
```

<<<<<<< HEAD
Você deverá ver seu `console.log` rodando dentro do contrato e então você também deverá ver o endereço do contrato impresso!!! Aqui está o que apareceu pra mim:
=======
Você deverá ver seu `console.log` rodando dentro do contrato e então você também deverá ver o endereço do contrato impresso!!! Aqui está o que eu aparece pra mim:
>>>>>>> several updates and fixes

![](https://i.imgur.com/QuQjT5v.png)


🎩 Hardhat e HRE
----------------

Nesses blocos de código você notará que usamos `hre.ethers`, mas que o `hre` nunca é importado? Que tipo de feitiçaria é essa?

Nos documentos da Hardhat, você lerá isso:

> O Hardhat Runtime Environment, ou HRE abreviado, é um objeto que contém todas as funcionalidades que a Hardhat expõe ao executar uma tarefa, teste ou script. Na realidade, Hardhat é o HRE.

Então o que isso quer dizer? Bem, toda vez que você executa um comando no terminal que começa com `npx hardhat`, você obtém este objeto `hre` construído em tempo real usando o `hardhat.config.js` especificado em seu código! Isso significa que você nunca precisará fazer algum tipo de importação em seus arquivos como:

`const hre = require("hardhat")`

**Você verá muito `hre` em nosso código, mas nunca importado em lugar nenhum! Confira esta [documentação da Hardhat em inglês](https://hardhat.org/advanced/hardhat-runtime-environment.html) para aprender um pouco mais sobre ele!**

🚨 Antes de clicar em "Próxima lição"
--------------------------------------------

*Nota: se você não fizer isso, Yan ficará muito triste :(.*

Vá para o canal #progresso no nosso servidor do Discord e poste uma uma captura de tela do seu terminal com a saída.

Certifique-se de fazer o console.log do que quiser! Agora você escreveu seu próprio contrato e o executou através do deploy em uma blockchain local BOORAAA.