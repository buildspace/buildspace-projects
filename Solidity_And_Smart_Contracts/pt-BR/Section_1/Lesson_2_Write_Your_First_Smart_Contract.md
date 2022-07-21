👩‍💻 Vamos escrever um contrato
----------------------------

Ótimo, conseguimos.

Vamos pular direto para o nosso projeto.

Vamos construir um contrato inteligente que nos permita enviar um 👋 ao nosso contrato e acompanhar o número total de acenos. Isso será útil porque em seu site você pode querer acompanhar este #! Sinta-se à vontade para alterar isso para se adequar ao seu caso de uso.

Crie um arquivo chamado **`WavePortal.sol`** no diretório **`contracts`**. A estrutura de arquivos é super importante ao usar o Hardhat, então, tenha cuidado!

Vamos começar com a estrutura com a qual cada contrato começa.

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    constructor() {
        console.log("Yo yo, I am a contract and I am smart");
    }
}
```

Observação: talvez você queira fazer o download da extensão VS Code Solidity para facilitar o _syntax highlighting_ [aqui](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity).

```solidity
// SPDX-License-Identifier: UNLICENSED
```

Apenas um comentário chique. É chamado de "identificador de licença SPDX", sinta-se à vontade para pesquisar no Google o que é :).

```solidity
pragma solidity ^0.8.0;
```

Esta é a versão do compilador Solidity que queremos que nosso contrato use. Ele basicamente diz "ao executar isso, eu só quero usar a versão 0.8.0 do compilador Solidity, nada inferior. Note, certifique-se de que a versão do compilador seja a mesma em `hardhat.config.js`.

```solidity
import "hardhat/console.sol";
```

Um pouco da mágica que o Hardhat adiciona ao nosso contrato para logar mensagens no console. Na verdade, é um desafio depurar (debug) contratos inteligentes, mas esse é um dos benefícios que o Hardhat nos oferece e que facilita a vida.

```solidity
contract WavePortal {
    constructor() {
        console.log("Yo yo, I am a contract and I am smart");
    }
}
```

Então, contratos inteligentes parecem uma 'classe' em outros linguagens, caso já tenha visto isso antes! Assim que inicializarmos esse contrato pela primeira vez, esse construtor será executado e imprimirá essa linha. Por favor, altere essa linha para o que quiser :)!

Na próxima lição, executaremos o contrato e veremos o que conseguimos!

🚨 Antes de clicar em "Próxima lição"
--------------------------------------------

*Nota: se você não fizer isso, Farza ficará muito triste :(.*

Vá para #progress e poste um screenshot (captura de tela) do seu contrato no arquivo WavePortal.sol :).