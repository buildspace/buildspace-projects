### **📝 Escrevendo nosso contrato inicial.**

Escolha seu editor de código favorito e abra o diretório em que você configurou o projeto hardhat. Vamos fazer uma pequena faxina.

Nós queremos deletar todo o código inicial gerado para nós. Vamos escrever as coisas nós mesmos! Vá em frente e delete o arquivo `sample-test.js` dentro de `test`. Também delete `sample-script.js` dentro de `scripts`. Depois, delete `Greeter.sol` dentro de `contracts`. **Não delete os diretórios!**

Agora, vamos começar a escrever nosso contrato NFT. Se você nunca escreveu um contrato inteligente, não se preocupe. **Só siga os passos. Procure no Google coisas que você não entenda.**

Crie um arquivo chamado  `MyEpicGame.sol` dentro de  `contracts` . A estrutura de arquivos é super importante quando usamos Hardhat, então seja cuidadoso.

Nota: eu recomendo baixar a [extensão Solidity](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity) para VSCode que dá um boa colorida na sintaxe.

Eu sempre gosto de começar com um contrato bem básico, só para as coisas fluírem.

```javascript
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract MyEpicGame {
  constructor() {
    console.log("Esse é o contrato do meu jogo, vamo!");
  }
}
```

Nota: As vezes o VSCode nos dá erros que não são um problema de verdade. Por exemplo, pode sublinhar o import do Hardhat e dizer que não existe. Isso acontece porque seu compilador global de Solidity não está configurado localmente. Se você não sabe arrumar isso, sem problemas. Ignore isso por agora. Eu também recomendo que você não use o terminal VSCode, use o seu terminal separado. As vezes o terminal VSCode nos dá erros se o compilador não estiver configurado.

Vamos entender linha-por-linha do que fizemos até aqui.

```javascript
// SPDX-License-Identifier: UNLICENSED
```

Só um comentário chique.  É chamado um "Identificador de licença SPDX", sinta-se livre para pesquisar o que é isso :).

```javascript
pragma solidity ^0.8.0;
```

Essa é a versão do compilador Solidity que queremos que o nosso contrato use. Basicamente diz: "quando rodar isso, eu só quero usar a versão 0.8.0 do compilador Solidity, nada menos que isso. Nota, tenha certeza que o seu compilador esteja configurado para 0.8.0 no arquivo  `hardhat.config.js`.

```javascript
import "hardhat/console.sol";
```

Um pouco de mágica nos é dada pelo Hardhat para fazermos alguns console logs no nosso contrato. É bem desafiador debugar contratos inteligentes, mas essa é uma das coisas boas que o Hardhat nos dá para deixar a vida mais fácil.

```javascript
contract MyEpicGame {
    constructor() {
        console.log("Esse é o contrato do meu jogo, vamo!");
    }
}
```

Então, contratos inteligentes se parecem com uma  `class`  em outras linguagens, se você já viu alguma delas! Uma vez que inicializarmos esse contrato pela primeira vez, esse construtor vai rodar e escrever aquela linha. Por favor, faça a linha dizer o que você quiser. Se divirta!

### **😲 Como nós rodamos?**

Legal - nós temos um contrato inteligente! Mas, nós não sabemos se ele funciona. Precisamos:

1. Compilar.
2. Fazer o deploy na nossa blockchain local.
3. Uma vez que estiver ali, o console.log vai rodar.

Nós vamos escrever um script customizado que cuide desses 3 passo para nós.

Vá dentro de  `scripts` e crie um arquivo chamado `run.js`. Isso é o que `run.js`  vai ter dentro dele:

```javascript
const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory("MyEpicGame");
  const gameContract = await gameContractFactory.deploy();
  await gameContract.deployed();
  console.log("Contrato implantado no endereço:", gameContract.address);
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

`run.js` é o nosso playground para brincar com o contrato!

### **🤔 Como isso funciona?**

**Nota: VSCode vai auto-importar o ethers. Nós não precisamos importar o ethers ou qualquer coias. Então, esteja certo de não importar nada.**

Vamos entender linha-por-linha do que fizemos até aqui.

```javascript
const gameContractFactory = await hre.ethers.getContractFactory("MyEpicGame");
```

Isso vai compilar nosso contrato e gerar os arquivos necessários que precisamos para trabalhar com o contrato dentro de  `artifacts` . Vá olhar depois que rodarmos isso :).

```javascript
const gameContract = await gameContractFactory.deploy();
```

Isso é bem chique :).

O que está acontecendo aqui é que o Hardhat cria uma rede Ethereum local para a gente, mas só para esse contrato. Depois que o script for completo, ele vai destruir essa rede local. Então, cada vez que você rodar o contrato, será uma blockchain nova. E qual é o objetivo? É como refazer o seu server local toda vez de maneira que você sempre parta de um ponto limpo, o que deixa mais fácil o debug de erros.

```javascript
await gameContract.deployed();
```

Nós vamos esperar até que o nosso contrato esteja oficialmente minerado e implementado na nossa blockchain local! Exatamente, hardhat cria "mineradores" falsos na nossa máquina para tentar imitar da melhor forma a blockchain.

Nosso  `constructor`  roda quando o contrato está completamente implantado (deployed)!

```javascript
console.log("Contrato implantado no endereço:", gameContract.address);
```

Finalmente, uma vez que estiver implantado, `gameContract.address` vai basicamente nos dar o endereço do contrato implementado. Esse endereço é como nós vamos achar o nosso contrato na blockchain. Nesse momento nossa blockchain local só tem nós. Então, isso não é tão legal.

Mas, tem milhões de contratos na blockchain de verdade. Então, esse endereço nos dá fácil acesso ao contrato que estamos interessados em trabalhar! Isso vai ser muito útil quando implantarmos nosso contrato na blockchain de verdade algumas aulas para frente.

### **💨 Rode.**

Antes de rodar isso, esteja certo de trocar `solidity: "0.8.4",` para `solidity: "0.8.0",` no seu `hardhat.config.js`.

Vamos rodá-lo! Abra o terminal e rode:

```javascript
npx hardhat run scripts/run.js
```

Você deve ver o seu `console.log` rodar de dentro do contrato e você deve ver também o endereço do contrato escrito.

### **🎩 Hardhat & HRE**

Nesses blocos de código você vai notar constantemente que usamos hre.ethers, mas hre não está importado em lugar nenhum? Que tipo de magia é essa?

Diretamente das documentações do Hardhat (traduzidas), vocês notarão isso:

> O Ambiente de Execução Hardhat (Hardhat Runtime Environment), ou HRE, é um objeto que contém toda a funcionalidade que o hardhat expõe quando roda uma tarefa, um teste ou um script. Na realidade, Hardhat é o HRE.

Mas o que isso significa? Então, toda vez que você roda um comando de terminal que começa com `npx hardhat` você está pegando esse objeto `hre` construído usando `hardhat.config.js` especificado no seu código! Isso significa que você nunca vai ter que importar isso nos seus códigos, como:

`const hardhat = require("hardhat")`

Você vai ver hre várias vezes no seu código, mas nunca importado em lugar nenhum! Dê uma olhada na [documentação Hardhat](https://hardhat.org/advanced/hardhat-runtime-environment.html) para aprender mais sobre!

### 🚨 Reporte seu Progresso!

Poste uma screenshot em #progresso com a saída do terminal quando você rodou `npx hardhat run scripts/run.js` :).
