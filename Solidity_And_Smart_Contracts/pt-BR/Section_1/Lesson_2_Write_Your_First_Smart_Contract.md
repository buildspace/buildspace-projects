👩‍💻 Vamos escrever um contrato
----------------------------

Ótimo, conseguimos.

Vamos pular direto para o nosso projeto.

Vamos construir um contrato inteligente que nos permita enviar um 👋 ao nosso contrato e acompanhar o número total de tchauzinhos. Isso será útil porque em seu site você pode querer acompanhar este #! Sinta-se à vontade para alterar isso para se adequar ao seu caso de uso.

Crie um arquivo chamado **`WavePortal.sol`** no diretório **`contracts`**. A estrutura de arquivos é super importante ao usar o Hardhat, então, tenha cuidado!

Copie e cole o conteúdo abaixo e salve no arquivo `contracts/WavePortal.sol`.

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    constructor() {
        console.log("Ueba, eu sou um contrato e eu sou inteligente");
    }
}
```

Observação: talvez você queira [fazer o download da extensão VS Code Solidity]((https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity)) para facilitar o _syntax highlighting_.


Abra o arquivo `hardhat.config.js` e altere a versão do solidity para `0.8.0` na parte indicada abaixo:

```javascript

...

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.0",
};
```

Vamos começar com a estrutura com a qual cada contrato começa.

```solidity
// SPDX-License-Identifier: UNLICENSED
```

Apenas uma linha de comentário chique. É chamado de SPDX-License-Identifier, sinta-se à vontade para [pesquisar no Google](https://www.google.com.br/search?q=SPDX-License-Identifier+solidity) o que é :).

```solidity
pragma solidity ^0.8.0;
```

Esta é a versão do compilador Solidity que queremos que nosso contrato use. Ele basicamente diz "ao executar isso, eu só quero usar a versão 0.8.0 do compilador Solidity, nada inferior. Note, certifique-se de que a versão do compilador seja a mesma no arquivo `hardhat.config.js`.

```solidity
import "hardhat/console.sol";
```

Um pouco da mágica que o Hardhat adiciona ao nosso contrato para logar mensagens no console. Na verdade, é um desafio debugar contratos inteligentes, mas esse é um dos benefícios que o Hardhat nos oferece e que facilita a vida.

Esse arquivo está instalado na pasta `node_modules` que foi instalado automaticamente pelos comandos que rodamos na lição anterior.

```solidity
contract WavePortal {
    constructor() {
        console.log("Ueba, eu sou um contrato e eu sou inteligente");
    }
}
```
Então, contratos inteligentes parecem uma 'classe' em outras linguagens, caso já tenha visto isso antes! Assim que inicializarmos esse contrato pela primeira vez, esse construtor será executado e imprimirá essa linha. Por favor, altere essa linha para a frase que quiser, use a imaginação! :)

Na próxima lição, executaremos o contrato e veremos o que conseguimos!

🚨 Antes de clicar em "Próxima lição"
--------------------------------------------

*Nota: se você não fizer isso, o Daniel ficará muito triste :(.*

Vá para o canal #progresso no nosso servidor do Discord e poste uma captura de tela do seu contrato no arquivo WavePortal.sol :)

Esta atividade é importante para você subir de nível no Discord, temos um bot que fica de olho nisso 👀
