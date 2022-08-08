Abaixo eu vou passar por algumas funções. Elas não vão parecer muito úteis por agora, mas vão ser absurdamente úteis quando formos trabalhar no nosso web app.

### ✅ Construir função para checar se o usuário tem a NFT.

Nós precisamos de uma maneira de checar se o usuário tem um personagem NFT que demos a ele, e depois recuperar os atributos da NFT se ela existir. Por quê?

Quando jogadores vão jogar nosso jogo e conectam suas carteiras no nosso web app, **nós precisamos estar aptos a recuperar sua NFT para que ele possa jogar o jogo e para que nós possamos saber coisas como o HP e o dano de ataque da NFT - de outro jeito precisamos dizer pra eles mintarem uma.**

Aqui está como vamos configurar a função:

```solidity
function checkIfUserHasNFT() public view returns (CharacterAttributes memory) {
 // Pega o tokenId do personagem NFT do usuário
 // Se o usuário tiver um tokenId no map, retorne seu personagem
 // Senão, retorne um personagem vazio
}
```

O plano aqui é retornar `CharacterAttributes` preenchido com o estado da NFT do usuário se ele tiver uma. Se ele não tiver uma NFT para o nosso jogo em sua carteira, retornamos um `CharacterAttributes` vazio.

```solidity
function checkIfUserHasNFT() public view returns (CharacterAttributes memory) {
 // Pega o tokenId do personagem NFT do usuário
 uint256 userNftTokenId = nftHolders[msg.sender];
 // Se o usuário tiver um tokenId no map, retorne seu personagem
 if (userNftTokenId > 0) {
    return nftHolderAttributes[userNftTokenId];
  }
 // Senão, retorne um personagem vazio
 else {
    CharacterAttributes memory emptyStruct;
    return emptyStruct;
   }
}
```

Porquê fazemos `userNftTokenId > 0`? Bom, basicamente [não tem outro jeito](https://ethereum.stackexchange.com/a/13029) de checar se uma chave existe em um map. Nós configuramos nosso map desse jeito: `mapping(address => uint256) public nftHolders`. Não importa qual a chave que estamos procurando, vai ter um valor padrão de 0.

Esse é um problema para o usuário que tem a NFT com o tokenId `0`. Aí está o motivo do porque eu fiz `_tokenIds.increment()` antes no constructor! Dessa maneira, **ninguém está permitido a ter o tokenID 0.** Esse é um dos casos em que precisamos ser espertos para configurar nosso código por causa de algumas especificidades do Solidity :).

### 🎃 Recuperando os personagens padrão.

Nosso web app vai ter uma "tela de selecionar personagem" para novos jogadores para que eles possam escolher qual personagem NFT eles querem mintar!

Essa é uma função bem intuitiva de se escrever :).

```solidity
function getAllDefaultCharacters() public view returns (CharacterAttributes[] memory) {
  return defaultCharacters;
}
```

Você deve estar se perguntando, "Porque estamos construindo funções para pegar variáveis sozinhas? Não podemos acessar elas diretamente do contrato?". Sim, você pode! Mas, é uma boa prática criar funções `get` :). Isso faz tudo organizado.

### 💀 Recuperando o boss.

Precisamos poder recuperar o boss. Por quê? Bom - quando nosso jogador estiver jogando o nosso jogo, o nosso ap vai precisar estar apto a mostrar coisas para ele, como o HP do boss, o nome, a imagem e etc!

Essa também é uma função bem fácil de escrever:

```solidity
function getBigBoss() public view returns (BigBoss memory) {
  return bigBoss;
}
```

É isso!

### 🧠 Adicionando `Event` no nosso contrato.

Quando chamamos `mintCharacterNFT`, como vamos saber se foi **feito**? Quando fazemos:

```javascript
let txn = await gameContract.mintCharacterNFT(1);
await txn.wait();
```

Isso vai basicamente retornar quando a transação foi **minerada**. Mas, como saberemos se a NFT foi mintada com sucesso? _É possível que nossa transação tenha sido minerada, mas falhou por algum motivo_ (ex. por causa de um caso específico ou bug no código). Também é possivel que nossa transação foi **minerada**, **mas depois foi [largada](https://www.reddit.com/r/ethereum/comments/m4mmy9/etherscan_dropped_my_transaction_why/)** (ex. mudanças nas taxas de gas.)

Nós só queremos dizer ao usuário "Ei, sua NFT foi mintada" quando tivermos certeza que a função rodou sem nenhum erro.

E você deve estar se perguntando, "Ei, nós não podemos só retornar um valor de `mintCharacterNFT`? Nós retornaríamos `true` se ela foi mintada com sucesso e `false` se teve algum erro. Bom - [nós não podemos fazer isso também](https://ethereum.stackexchange.com/a/88122). Você não pode retornar valores de uma transação.

Nós podemos retornar valores de funções `view` facilmente porque são chamadas simples de leitura, não são transações que alteram o estado.

Com sorte, temos uma solução, e eles são chamados [Events](https://ethereum.stackexchange.com/a/11232). São basicamente como webhooks. Nós podemos "disparar" um evento a partir do Solidity, e depois "pegar" aquele evento no nosso web app. Muito legal, né? Vamos nessa!

Crie esses dois eventos, você pode adicioná-los embaixo de onde criamos `mapping(address => uint256) public nftHolders`. Nós precisamos basicamente falar ao Solidity o formato dos nossos eventos antes de dispararmos eles.

Eu também adicionei um evento `AttackComplete` que será útil quando construirmos nossa UI para atacar o boss - já que precisamos saber se ele foi atacado com sucesso!

```solidity
event CharacterNFTMinted(address sender, uint256 tokenId, uint256 characterIndex);
event AttackComplete(uint newBossHp, uint newPlayerHp);
```

O primeiro evento, `CharacterNFTMinted` nós iremos disparar quando acabarmos de mintar um NFT para o usuário! Isso vai nos permitir notificar eles quando acabarmos de mintar a NFT! Então, nós podemos disparar esse evento adicionando essa linha bem no final da nossa função `mintCharacterNFT` (logo depois da parte `_tokenIds.increment()`):

```solidity
emit CharacterNFTMinted(msg.sender, newItemId, _characterIndex);
```

Boom! É isso. Nosso web app vai estar apto a "pegar" esse evento (como com um webhook, que podemos **ouvir**) quando a NFT for oficialmente mintada. Nós vamos ver como pegar esse evento depois.

Depois nós temos o evento `AttackComplete`. Isso iria disparar quando oficialmente atacarmos nosso boss. Você pode ver o que evento nos retorna o novo HP do boss e do jogador!

Isso é bem legal porque nós podemos pegar esse evento no nosso cliente e ele vai permitir atualizações o HP do player e do boss dinamicamente sem recarregar a página. Parece um jogo real.

Tudo o que precisamos fazer é adicionar essa linha no final da função `attackBoss`:

```solidity
emit AttackComplete(bigBoss.hp, player.hp);
```

### ➡️ Fazendo Deploy das mudanças.

Muito bom! Agora adicionamos as funções que nosso web app vai usasr no nosso jogo! Estamos caminhando para um jogo incrível! Lembre-se que precisamos fazer o deploy do contrato de novo para usarmos essas funções.

Antes de irmos para o nosso web app, vamos precisar ter certeza de que temos um contrato limpo e pornto. Vamos ter certeza de que nosso arquivo de deploy não minte nenhum personagem ou faça algum ataque.

Aqui está meu arquivo `deploy.js` depois que removi as NFTs mintadas e os ataques do nosso último deploy:

```javascript
const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory("MyEpicGame");

  const gameContract = await gameContractFactory.deploy(
    ["Leo", "Aang", "Pikachu"],
    [
      "https://i.imgur.com/pKd5Sdk.png",
      "https://i.imgur.com/xVu4vFL.png",
      "https://i.imgur.com/u7T87A6.png",
    ],
    [100, 200, 300],
    [100, 50, 25],
    "Elon Musk",
    "https://i.imgur.com/AksR0tt.png",
    10000,
    50
  );

  await gameContract.deployed();
  console.log("Contrato deployado no endereço:", gameContract.address);
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

Tudo o que sobrou é fazer o deploy usando `npx hardhat run scripts/deploy.js --network rinkeby`. Lembre-se de salvar o endereço do seu contrato para a próxima seção.

É isso :). Vamos para o nosso web app!