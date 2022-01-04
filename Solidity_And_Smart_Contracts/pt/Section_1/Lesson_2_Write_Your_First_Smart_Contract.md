👩‍💻 Vamos escrever um contrato
----------------------------

Incrível, nós conseguimos.

Vamos pular direto para o nosso projeto.

Vamos escrever um contrato inteligente que nos permita enviar um 👋 para o nosso contrato e manter o controle do número total de ondas. Isso será útil porque, em seu site, você pode querer acompanhar isso! Sinta-se à vontade para alterar isso para se adequar ao seu caso.

Crie um arquivo chamado **`WavePortal.sol`** no diretório **`contracts`**. A estrutura do arquivo é super importante ao usar o Hardhat, então, tome cuidado aqui!

Vamos começar com a estrutura com a qual todo contrato deve começar.

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

Nota: Você pode querer baixar a extensão do Solidity para VS Code para facilitar o realce da sintaxe [aqui](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity).

```solidity
// SPDX-License-Identifier: UNLICENSED
```

É apenas um comentário chique. É chamado de "SPDX license identifier", sinta-se à vontade para pesquisar para saber o que é :).

```solidity
pragma solidity ^0.8.0;
```

Esta é a versão do compilador Solidity que queremos que nosso contrato use. Ele basicamente diz "ao executar isso, eu só quero usar a versão 0.8.0 do compilador Solidity, nada inferior. Obs: certifique-se de que a versão do compilador é a mesma em `hardhat.config.js`.

```solidity
import "hardhat/console.sol";
```

Alguma magia que nos foi dada pelo Hardhat para fazer alguns console logs em nosso contrato. Na verdade, é desafiador debugar contratos inteligentes, mas esta é uma das vantagens que o Hardhat nos oferece para tornar isso um mamão com açúcar.

```solidity
contract WavePortal {
    constructor() {
        console.log("Yo yo, I am a contract and I am smart");
    }
}
```

Portanto, os contratos inteligentes parecem uma espécie de `class` em outras linguagens, se você já viu isso! Assim que inicializarmos este contrato pela primeira vez, o construtor executará e imprimirá essa linha. Por favor, faça essa linha dizer o que você quiser :)!

Na próxima lição, vamos executar isso e ver o que temos!

🚨 Antes de clicar em "Próxima lição"
-------------------------------------------

*Nota: se você não fizer isso, Farza vai ficar muito triste :(.*

Vá para #progress e poste uma captura de tela do seu contrato sofisticado no arquivo WavePortal.sol :).
