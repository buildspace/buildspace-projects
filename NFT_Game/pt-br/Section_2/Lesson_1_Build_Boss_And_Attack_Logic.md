### 🙀 Construindo nosso boss.

Então, no nosso jogo o personagem NFT vai estar apto a atacar um boss.

O grande objetivo do jogo é atacar o boss e levar o HP dele a 0! Mas, o truque aqui é que o boss tem muito HP e toda vez que atacarmos ele, ele irá atacar de voltar e diminuir o nosso HP. Se a vida do nosso personagem chegar a 0, então o nosso personagem não vai mais poder atacar o boss e vai estar “morto“.

Talvez no futuro, outro pessoa poderá construir uma função de “reviver“ que permite que as NFTs mortas ganhem 100% dos pontos de vida ;). Mas por agora, se nosso personagem morrer, é game over. E nós podemos descansar sabendo que nosso personagem deu o melhor e se deu pelo time. Isso significa que precisamos que outros players ataquem o boss também, não podemos fazer isso sozinhos.

Vamos primeiro só construir uma estrutura básica de um boss e inicializar os dados, de maneira similar ao que fizemos com nossos personagens. O boss vai basicamente ter um nome, imagem, dano de ataque e HP. O boss **não vai** ser uma NFT. Os dados do boss vão apenas viver no contrato inteligente.

Nós podemos adicionar o seguinte código logo abaixo de onde declaramos `nftHolderAttributes`.

```solidity
struct BigBoss {
  string name;
  string imageURI;
  uint hp;
  uint maxHp;
  uint attackDamage;
}

BigBoss public bigBoss;

```

Bem simples! Só uma estrutura para manter os dados do boss de uma maneira organizada e uma variável `bigBoss` também que vai segurar nosso boss para que podemos referenciá-los em diferentes funções.

Então, nós podemos só inicializar nosso boss direto no nosso contrato como isso:

```solidity
constructor(
  string[] memory characterNames,
  string[] memory characterImageURIs,
  uint[] memory characterHp,
  uint[] memory characterAttackDmg,
  string memory bossName, // Essas novas variáveis serão passadas via run.js ou deploy.js
  string memory bossImageURI,
  uint bossHp,
  uint bossAttackDamage
)
  ERC721("Heroes", "HERO")
{
  // Inicializa o boss. Salva na nossa variável global de estado "bigBoss".
  bigBoss = BigBoss({
    name: bossName,
    imageURI: bossImageURI,
    hp: bossHp,
    maxHp: bossHp,
    attackDamage: bossAttackDamage
  });

  console.log("Boss inicializado com sucesso %s com HP %s, img %s", bigBoss.name, bigBoss.hp, bigBoss.imageURI);

  // Todo o código do outro personagem está aqui embaixo do mesmo jeito que antes, só não estamos mostrando para manter as coisas simples!

```

Finalmente, só mudamos `run.js` e `deploy.js` para passar em parâmetros para o nosso boss:

```javascript
const gameContract = await gameContractFactory.deploy(
  ["Leo", "Aang", "Pikachu"],
  [
    "https://i.imgur.com/pKd5Sdk.png",
    "https://i.imgur.com/xVu4vFL.png",
    "https://i.imgur.com/u7T87A6.png",
  ],
  [100, 200, 300],
  [100, 50, 25],
  "Elon Musk", // Boss name
  "https://i.imgur.com/AksR0tt.png", // Boss image
  10000, // Boss hp
  50 // Boss attack damage
);
```

Parece um pouco feio, mas, é isso!

Nós agora temos um boss cujos dados vivem no nosso contrato. O boss que escolhi é `Elon Musk`. Isso significa que nossos jogadores precisam andar juntos para **destruir** Elon Musk. Por quê estamos destruindo Elon? Nem ideia. Eu só pensei que seria engraçado se tivéssemos personagens como Aang e o Pikachu atacando o Elon XD.

**Por favor escolha seu próprio boss - talvez seja o Darth Vader? Talvez o seu tio? Talvez seu gato?** Qualquer coisa que você trocar, tenha certeza que é o seu próprio, não me copie :).

Seria bem divertido se o boss fosse seu cachorro, e ao invés de tentar destruí-lo você tentasse conseguir que ele o amasse mais. E, quanto mais pessoas fizessem carinho nele na cabeça, mais ele amaria o player. Você poderia ter até um quadro de líderes de pessoas que fizeram mais carinho nele.

De qualquer jeito, seja criativo. Esse é o seu projeto :).

### 👾 Recuperando os atributos dos NFTs do jogador.

Nós vamos criar uma função `attackBoss`. Aqui está um início dela:

```solidity
function attackBoss() public {
 // Pega o estado do NFT do jogador
 // Tenha certeza que o player tenha mais que 0 de HP
 // Tenha certeza de que o boss tenha mais que 0 de HP
 // Permita que o player ataque o boss
 // Permita que o boss ataque o player
}
```

Vamos começar!

A primeira coisa que precisamos fazer é **recuperar o estado do NFT do personagem do jogador.** Isso vai recuperar tudo, como o HP, dano de ataque dos jogadores e etc. Esses dados são armazenados no `nftHolderAttributes`, que exige o `tokenId` do NFT. Podemos pegar o `tokenId` a partir de `nftHolders`! Cheque isso :

```solidity
function attackBoss() public {
  // Pega o estado do NFT do jogador
  uint256 nftTokenIdOfPlayer = nftHolders[msg.sender];
  CharacterAttributes storage player = nftHolderAttributes[nftTokenIdOfPlayer];
  console.log("\nJogador com personagem %s irá atacar. Tem %s de HP e %s de Poder de Ataque", player.name, player.hp, player.attackDamage);
  console.log("Boss %s tem %s de HP e %s de PA", bigBoss.name, bigBoss.hp, bigBoss.attackDamage);
}
```

Primeiro, eu pego o `tokenId` da NFT que o player possui usando `nftHolders[msg.sender]`. Então por exemplo, se eu tivesse mintado a terceira NFT na coleção, `nftHolders[msg.sender]` seria igual a `3`!

Eu então pego os atributos do jogador usando `nftHolderAttributes[nftTokenIdOfPlayer]`. Eu uso a palavra chave `storage` aqui também que vai ser mais importante depois. Basicamente, quando fazemos `storage` e depois `player.hp = 0` que iria mudar o valor da vida **na NFT** para `0`.

Em contraste, se fôssemos usar `memory` ao invés de `storage`, iria criar uma cópia local da variável dentro do escopo da função. Isso significa que se fizéssemos `player.hp = 0` seria desse jeito apenas na função e não mudaria o valor global da variável.

Em `run.js` você pode testar isso adicionando isso em qualquer lugar embaixo de `gameContract.deployed();`:

```javascript
let txn;
txn = await gameContract.mintCharacterNFT(2);
await txn.wait();

txn = await gameContract.attackBoss();
await txn.wait();
```

Aqui primeiro mintamos um personagem com index `2` que é o terceiro personagem na nossa array! Para mim, meu terceiro personagem é o Pikachu. Tem algo bem engraçado sobre ter o Pikachu atacando o Elon Musk no jogo.

Esse é o primeiro personagem NFT que mintamos, então ele terá automaticamente um id de `1`. Por quê? Porque `_tokenIds` começa no 0, mas então incrementamos ele para `1` no `constructor`. Então, nossa primeira NFT terá um ID de `1`, **não** `0`.

Então, fazemos `attackBoss()`.

Quando rodo isso, isso é o que consigo:

```plaintext
Terminamos de incializar o boss Elon Musk com HP 10000, img https://i.imgur.com/AksR0tt.png
Terminamos de incializar o Leo com HP 100, img https://i.imgur.com/pKd5Sdk.png
Terminamos de incializar o Aang com HP 200, img https://i.imgur.com/xVu4vFL.png
Terminamos de incializar o Pikachu com HP 300, img https://i.imgur.com/u7T87A6.png
Contrato deployado no endereço: 0x5FbDB2315678afecb367f032d93F642f64180aa3
NFT Mintado com tokenId 0 e characterId 2

Jogador com personagem Pikachu irá atacar. Tem 300 de HP e 25 de PD
Boss Elon Musk tem 10000 HP e 50 PD
```

Parece bom! `Pikachu` está indo atacar nosso boss `Elon Musk`. Tudo funcionou perfeitamente e estamos recuperando o estado das NFTs :).

### 🔍 Conferir algumas coisas antes de atacar.

Depois, nós só precisamos checar que o **personagem tenha HP**, se o personagem está morto ele não pode atacar! Nós vamos precisar ter certeza que o **boss tenha HP**. Não dá para atacar o boss se ele estiver destruído.

Algumas coisas para notar aqui -

- Você também vai notar a palavra chave especial `require` aqui. Sinta-se livre para ler mais [aqui](https://ethereum.stackexchange.com/questions/60585/what-difference-between-if-and-require-in-solidity).

- Se estiver usando VSCode, você pode ter um aviso dizendo "O estado de mutabilidade da função pode ser restringido para view". Não se estresse! Isso tudo será consertado depois assim que adicionarmos mais coisas aqui :).

```solidity
function attackBoss() public {
  // Pega o estado da NFT do player.
  uint256 nftTokenIdOfPlayer = nftHolders[msg.sender];
  CharacterAttributes storage player = nftHolderAttributes[nftTokenIdOfPlayer];

  console.log("\nJogador com personagem %s irá atacar. Tem %s de HP e %s de PD", player.name, player.hp, player.attackDamage);
  console.log("Boss %s tem %s de HP e %s de PD", bigBoss.name, bigBoss.hp, bigBoss.attackDamage);

  // Tenha certeza que o hp do player é maior que 0.
  require (
    player.hp > 0,
    "Error: character must have HP to attack boss."
  );

  // Tenha certeza que o HP do boss seja maior que 0.
  require (
    bigBoss.hp > 0,
    "Error: boss must have HP to attack boss."
  );
}
```

### 🔫 Ataque o boss!!

Atacar, na verdade **não é** super fácil.

Basicamente, estamos trabalhando com `uint` agora. Isso é um "[unsigned integer](https://solidity-by-example.org/primitives/)" significando que não pode ser negativo! Isso é meio estranho. Digamos que o boss tenha 10 HP sobrando e nosso personagem tenha 50 de dano de ataque. Isso significa que precisaremos fazer `10 HP - 50 dano de ataque` para calcular o HP novo do boss, que seria `-40`. Mas, estamos trabalhando com `uint` então não podemos lidar com números negativos!

**Teríamos um erro de overflow ou underflow.**

Nós **poderíamos** usar `int` que permitiria armazenar números negativos. Mas, isso fica bagunçado porque a maioria das libraries como OpenZeppelin ou Hardhat não tem um suporte decente para `int` em suas funções de library. Por exemplo, nós umas `Strings.toString` que só funciona com `uint`. `console.log` também não funciona com `int` facilmente.

Então, vale a pena ficar com `uint` só pela facilidade por agora.

Basicamente, a maneira de passar por isso é simplesmente checar se vamos ter um número negativo. Se for, setar o HP do chefe para 0 manualmente ao invés de deixá-lo se tornar negativo.

Vamos começar mergulhando no código que já escrevemos aqui para que faça mais sentido!

```solidity
function attackBoss() public {
  // Pega o estado da NFT do jogador.
  uint256 nftTokenIdOfPlayer = nftHolders[msg.sender];
  CharacterAttributes storage player = nftHolderAttributes[nftTokenIdOfPlayer];

  console.log("\nPlayer w/ character %s about to attack. Has %s HP and %s AD", player.name, player.hp, player.attackDamage);
  console.log("Boss %s has %s HP and %s AD", bigBoss.name, bigBoss.hp, bigBoss.attackDamage);

  // Checa se o hp do player é maior que 0.
  require (
    player.hp > 0,
    "Error: character must have HP to attack boss."
  );

  // Checa que o hp do boss é maior que 0.
  require (
    bigBoss.hp > 0,
    "Error: boss must have HP to attack boss."
  );

  // Permite que o jogador ataque o boss.
  if (bigBoss.hp < player.attackDamage) {
    bigBoss.hp = 0;
  } else {
    bigBoss.hp = bigBoss.hp - player.attackDamage;
  }
}
```

`bigBoss.hp < player.attackDamage` só está checando se o boss vai ter seu HP reduzido para menos do que 0 no dano de ataque dos jogadores. Por exemplo, se `bigBoss.hp` fosse 10 e `player.attackDamage` fosse 30, então sabemos que o boss teria seu HP reduzido para menos que 0, o que causaria um erro! Então, vamos checar esse caso e configurar o hp do boss para 0 manualmente. Se não for para menos que 0, nós só fazemos `bigBoss.hp = bigBoss.hp - player.attackDamage` o que iria reduzir o HP do boss baseado em quanto dano o jogador dá!

### 🔪 Adicionando a lógica para o boss atacar o jogador.

Nós também precisamos ter certeza que o HP do jogador não se torne negativo também, porque o HP dos jogadores é um `uint` também. Então fazemos:

```solidity
function attackBoss() public {
  // Pega o estado da NFT do jogador.
  uint256 nftTokenIdOfPlayer = nftHolders[msg.sender];
  CharacterAttributes storage player = nftHolderAttributes[nftTokenIdOfPlayer];

  console.log("\nPlayer w/ character %s about to attack. Has %s HP and %s AD", player.name, player.hp, player.attackDamage);
  console.log("Boss %s has %s HP and %s AD", bigBoss.name, bigBoss.hp, bigBoss.attackDamage);

  // Checa se o hp do player é maior que 0.
  require (
    player.hp > 0,
    "Error: personagem deve ter HP para atacar o boss."
  );

  // Checa que o hp do boss é maior que 0.
  require (
    bigBoss.hp > 0,
    "Error: Boss deve ter HP para ser atacado."
  );

  // Permite que o jogador ataque o boss.
  if (bigBoss.hp < player.attackDamage) {
    bigBoss.hp = 0;
  } else {
    bigBoss.hp = bigBoss.hp - player.attackDamage;
  }

// Permite que o boss ataque o jogador.
  if (player.hp < bigBoss.attackDamage) {
    player.hp = 0;
  } else {
    player.hp = player.hp - bigBoss.attackDamage;
  }

  console.log("Jogador atacou o boss. Boss ficou com HP: %s", bigBoss.hp);
  console.log("Boss atacou o jogador. Jogador ficou com hp: %s\n", player.hp);
}
```

É isso! Se `player.hp < bigBoss.attackDamage` então isso significa que o boss causaria um dano que levaria a vida do jogador para menos que 0, e isso causaria um erro. Então, checamos isso e manualmente configuramos `player.hp = 0`. Senão, apenas configuramos o novo valor de HP dos jogadores usando `player.hp = player.hp - bigBoss.attackDamage;`

Antes de rodar isso, tenha certeza que `run.js` chame `attackBoss` duas vezes :).

```javascript
let txn;
txn = await gameContract.mintCharacterNFT(2);
await txn.wait();

txn = await gameContract.attackBoss();
await txn.wait();

txn = await gameContract.attackBoss();
await txn.wait();
```

Agora quando rodo `run.js` aqui está o que eu consigo:

```plaintext
Terminamos de incializar o boss Elon Musk w/ HP 10000, img https://i.imgur.com/AksR0tt.png
Terminamos de incializar o Leo com HP 100, img https://i.imgur.com/pKd5Sdk.png
Terminamos de incializar o Aang com HP 200, img https://i.imgur.com/xVu4vFL.png
Terminamos de incializar o Pikachu com HP 300, img https://i.imgur.com/u7T87A6.png
Contrato deployado no endereço: 0x5FbDB2315678afecb367f032d93F642f64180aa3
NFT Mintado com tokenId 0 e characterId 2

Jogador com personagem Pikachu irá atacar. Tem 300 de HP e 25 de PD
Boss Elon Musk tem 10000 HP and 50 AD
Jogador atacou o boss. Boss ficou com hp: 9975
Boss atacou o jogador. Jogador ficou com hp: 250

Jogador com personagem Pikachu irá atacar. Tem 250 de HP e 25 de PD
Boss Elon Musk tem 9975 de HP e 50 de PD
Jogador atacou o boss. Boss ficou com hp: 9950
Boss atacou o jogador. Jogador ficou com hp: 200
```

**Está tudo funcionando?** Vamos ver. Parece que o `Pikachu` atacou o `Elon Musk` com `25 AD` e a saúde do Elon caiu de `10000` para `9975` o que está certo! Então o Elon ataca o Pikachu com `50` de dano de ataque e a saúde do Pikachu cai de `300` para `250`. Parece que tudo está funcionando bem :).

Você pode ver que quando atacamos uma segunda vez, os valores atualizados de HP são usados tanto para o personagem quanto para o boss :).

Sinta-se livre para testar essa função tentando com um boss com `1 de HP` ou um player com `1 de HP` brincando com os valores passados no constructor em `run.js`.

Por exemplo, se eu dou ao jogador `1 HP`, aqui está o resultado:

```plaintext
Terminamos de incializar o boss Elon Musk HP 10000, img https://i.imgur.com/AksR0tt.png
Terminamos de incializar o Leo com, img https://i.imgur.com/pKd5Sdk.png
Terminamos de incializar o Aang com, img https://i.imgur.com/xVu4vFL.png
Terminamos de incializar o Pikachu com, img https://i.imgur.com/u7T87A6.png
Contrato deployado no endereço: 0x5FbDB2315678afecb367f032d93F642f64180aa3
NFT Mintado com tokenId 0 e characterId 2

Jogador com personagem Pikachu irá atacar. Tem 1 HP e 25 de PD
Boss Elon Musk tem 10000 de HP e 50 de PD
Jogador atacou o boss. Boss ficou com hp: 9975
Boss atacou player. Jogador ficou com hp: 0

Jogador com personagem Pikachu irá atacar. Tem 0 de HP e 25 de PD
Boss Elon Musk tem 9975 de HP e 50 de PD
Error: VM Exception while processing transaction: reverted with reason string 'Error: personagem precisa ter HP para atacar o boss.'
    at MyEpicGame.attackBoss (contracts/MyEpicGame.sol:88)
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
    at runNextTicks (node:internal/process/task_queues:65:3)
    at listOnTimeout (node:internal/timers:526:9)
    at processTimers (node:internal/timers:500:7)
    at HardhatNode._mineBlockWithPendingTxs (/Users/flynn/Developer/epic-game/node_modules/hardhat/src/internal/hardhat-network/provider/node.ts:1582:23)
    at HardhatNode.mineBlock (/Users/flynn/Developer/epic-game/node_modules/hardhat/src/internal/hardhat-network/provider/node.ts:435:16)
    at EthModule._sendTransactionAndReturnHash (/Users/flynn/Developer/epic-game/node_modules/hardhat/src/internal/hardhat-network/provider/modules/eth.ts:1494:18)
```

Então, você pode ver que o primeiro ataque aconteceu de maneira correta, `Boss attacked player. New player hp: 0`. Incrível! Nossa função funcionou perfeitamente. O hp do nosso personagem ia ser negativo, mas foi configurado para `0`! Yay!

Mas, na segunda vez que atacamos, conseguimos um erro com: `Error: character must have HP to attack boss`. O que está correto!!! Isso é basciamente como devolver um erro na nsosa API quando algo dá errado.

Legal - nossa função `attack boss` está basicamente feita. Vamos adicionar mais alguma mágica depois mas por agora estamos bem. Nós oficialmente temos nossa lógica de jogo **on-chain** :).