😈 Escolha um vencedor aleatoriamente
-----------------------

Então, agora, nosso código está configurado para dar 0.0001 ETH a todo tchauzinho! Nosso contrato ficará sem dinheiro muito rápido, e então a diversão acaba e precisaríamos adicionar mais fundos ao nosso contrato. Nesta lição, mostrarei como:

1\. Escolher **aleatoriamente** um vencedor.

2\. Criar um mecanismo de **cooldown** (esfriamento) para evitar que as pessoas enviem spam para você na tentativa de ganhar o prêmio ou de incomodá-lo.

Vamos fazer primeiro a parte do vencedor aleatório!

Então, gerar um número aleatório em contratos inteligentes é amplamente conhecido como um **problema difícil**.

Por quê? Bem, pense em como um número aleatório é gerado normalmente. Quando você gera um random normalmente em um programa, **vai pegar vários números diferentes do seu computador como fonte de aleatoriedade** como: a velocidade das ventoinhas, a temperatura da CPU, o número de vezes que você pressionou "L" às 15h52 desde que comprou o computador, a velocidade da sua internet e muitos outros #s que são difíceis de controlar. Ele pega **todos** esses números que são "aleatórios" e os reúne em um algoritmo que gera um número que parece ser a melhor tentativa de um número realmente "aleatório". Faz sentido?

Na blockchain, não há **quase nenhuma fonte de aleatoriedade**. Tudo o que o contrato vê, o público vê. Por causa disso, alguém poderia manipular o sistema apenas olhando para o contrato inteligente, vendo em que #s ele depende para aleatoriedade e, em seguida, a pessoa poderia fornecer os números exatos de que precisa para vencer.

Vamos conferir o código abaixo :).

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;

    /*
     * Utilizaremos isso abaixo para gerar um número randômico
     */
    uint256 private seed;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;

    constructor() payable {
        console.log("Contrato no ar!");
        /*
         * Define a semente inicial
         */
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public {
        totalWaves += 1;
        console.log("%s tchauzinhou!", msg.sender);

        waves.push(Wave(msg.sender, _message, block.timestamp));

        /*
         * Gera uma nova semente para o próximo que mandar um tchauzinho
         */
        seed = (block.difficulty + block.timestamp + seed) % 100;

        console.log("# randomico gerado: %d", seed);

        /*
         * Dá 50%  de chance do usuário ganhar o prêmio.
         */
        if (seed <= 50) {
            console.log("%s ganhou!", msg.sender);

            /*
             * O mesmo código que tínhamos anteriormente para enviar o prêmio.
             */
            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Tentando sacar mais dinheiro que o contrato possui."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Falhou em sacar dinheiro do contrato.");
        }

        emit NewWave(msg.sender, block.timestamp, _message);
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        return totalWaves;
    }
}
```

Aqui, eu pego dois números dados a mim pelo Solidity, `block.difficulty` e `block.timestamp` e os combino para criar um número aleatório. `block.difficulty` informa aos mineradores o quão difícil o bloco será para minerar com base nas transações no bloco. Os blocos ficam mais difíceis por vários motivos, mas, principalmente, ficam mais difíceis quando há mais transações no bloco (alguns mineradores preferem blocos mais fáceis, mas pagam menos). `block.timestamp` é apenas o timestamp Unix que o bloco está sendo processado.

Esses #s são *bastante* aleatórios. Mas, tecnicamente, tanto o `block.difficulty` quanto o `block.timestamp` podem ser controlados por um invasor sofisticado.

Para tornar isso mais difícil, crio uma variável `seed` que mudará essencialmente toda vez que um usuário enviar um novo tchauzinho. Então, combino todas essas três variáveis para gerar uma nova semente aleatória. Então eu apenas faço `% 100`, o que garantirá que o número seja reduzido para um intervalo entre 0 e 100.

É isso! Então eu apenas escrevo uma simples declaração IF para ver se a semente é menor ou igual a 50, se for -- então o "acenador" ganha o prêmio! Então, isso significa que o "acenador" tem 50% de chance de ganhar desde que escrevemos `seed <= 50`. Você pode mudar isso para o que quiser :). Acabei de fazer 50% porque é mais fácil testar assim!!

É importante ver que um ataque poderia tecnicamente enganar seu sistema se eles realmente quisessem. Seria muito difícil. Existem outras maneiras de gerar números aleatórios no blockchain, mas o Solidity não nos fornece nada confiável porque não pode! Todos os #s que nosso contrato pode acessar são públicos e *nunca* verdadeiramente aleatórios.

Realmente, este é um dos pontos fortes do blockchain. Mas, pode ser um pouco chato para algum aplicativo como o nosso!

De qualquer forma, ninguém vai atacar nosso pequeno aplicativo, mas quero que você saiba tudo isso quando estiver criando um dApp que tenha milhões de usuários!

Teste!
-------

Vamos garantir que funcione! Aqui está meu `run.js` atualizado. Neste caso, eu só quero ter certeza de que o saldo do contrato muda no caso em que a pessoa que deu tchauzinhou ganhou!

```javascript
const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await waveContract.deployed();
  console.log("Endereço do contrato:", waveContract.address);

  let contractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  );
  console.log(
    "Saldo do contrato:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  /*
   * Vamos tentar mandar um tchauzinho 2 vezes agora
   */
  const waveTxn = await waveContract.wave("tchauzinho #1");
  await waveTxn.wait();

  const waveTxn2 = await waveContract.wave("tchauzinho #2");
  await waveTxn2.wait();

  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log(
    "Saldo do contrato:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  let allWaves = await waveContract.getAllWaves();
  console.log(allWaves);
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

Você nem sempre terá bons tutoriais como este para orientá-lo sobre como testar seu código. Cabe a você descobrir 1) o que você quer testar 2) como testá-lo. Nesse caso, eu sabia que queria garantir que o saldo do contrato fosse reduzido em 0.0001 apenas no caso de um # aleatório menor que 50 ser gerado!

Então, quando executo o código acima, aqui está o que recebo:

![](https://i.imgur.com/V3k35Dg.png)

Legal! Funciona. Quando "65" foi gerado, o usuário não ganhou o prêmio. Mas, quando 45 foi gerado, o tchauzinho venceu! E o saldo do contrato caiu exatamente 0.0001. Ótimo :).

Cooldowns para evitar spammers
-----------------------------

Impressionante. Você tem uma maneira de enviar ETH aleatoriamente para as pessoas! Agora, pode ser útil adicionar uma função de cooldown ao seu site para que as pessoas não possam simplesmente enviar spam para você. Por quê? Bem, talvez você simplesmente não queira que eles continuem tentando ganhar o prêmio repetidamente acenando para você. Ou talvez você não queira *apenas* *as* mensagens deles preenchendo seu mural de mensagens.

Confira o código. Eu adicionei comentários onde adicionei novas linhas.

Eu uso uma estrutura de dados especial chamada [mapa](https://medium.com/upstate-interactive/mappings-in-solidity-explained-in-under-two-minutes-ecba88aff96e).

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    uint256 private seed;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;

    /*
     * Este é um endereço => uint mapping, o que significa que eu posso associar o endereço com um número!
     * Neste caso, armazenarei o endereço com o últimoo horário que o usuário tchauzinhou.
     */
    mapping(address => uint256) public lastWavedAt;

    constructor() payable {
        console.log("Contrato construido!");
        /*
         * Define a semente inicial
         */
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public {
        /*
         * Precisamos garantir que o valor corrente de timestamp é ao menos 15 minutos maior que o último timestamp armazenado
         */
        require(
            lastWavedAt[msg.sender] + 15 minutes < block.timestamp,
            "Espere 15m"
        );

        /*
         * Atualiza o timestamp atual do usuário
         */
        lastWavedAt[msg.sender] = block.timestamp;

        totalWaves += 1;
        console.log("%s tchauzinhou!", msg.sender);

        waves.push(Wave(msg.sender, _message, block.timestamp));

        /*
         * Gera uma nova semente para o próximo usuário que mandar um tchauzinho
         */
        seed = (block.difficulty + block.timestamp + seed) % 100;

        if (seed <= 50) {
            console.log("%s venceu!", msg.sender);

            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Tentando sacar mais dinheiro que o contrato possui."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Falhou em sacar dinheiro do contrato.");
        }

        emit NewWave(msg.sender, block.timestamp, _message);
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        return totalWaves;
    }
}
```
Tente executar `npx hardhat run scripts/run.js` e veja a mensagem de erro que você recebe se tentar mandar um tchauzinho duas vezes seguidas sem esperar 15 minutos :).

Bam! E é assim que você constrói cooldowns!
