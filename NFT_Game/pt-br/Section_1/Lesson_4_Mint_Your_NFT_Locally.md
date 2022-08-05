### ✨ Minte as NFTs

Agora que temos todos os dados configurados para nossos personagens, a próxima coisa a fazer é mintar a NFT. Vamos passar pelo processo. Aqui está meu contrato atualizado, e eu comentei as linhas que mudei ou adicionei coisas para ficar mais fácil!

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Contrato NFT para herdar.
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Funções de ajuda que o OpenZeppelin providencia.
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


import "hardhat/console.sol";

// Nosso contrato herda do ERC721, que é o contrato padrão de
// NFT!
contract MyEpicGame is ERC721 {

  struct CharacterAttributes {
    uint characterIndex;
    string name;
    string imageURI;
    uint hp;
    uint maxHp;
    uint attackDamage;
  }

  // O tokenId é o identificador único das NFTs, é um número
  // que vai incrementando, como 0, 1, 2, 3, etc.

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  CharacterAttributes[] defaultCharacters;

  // Nós criamos um mapping do tokenId => atributos das NFTs.
  mapping(uint256 => CharacterAttributes) public nftHolderAttributes;

  // Um mapping de um endereço => tokenId das NFTs, nos dá um
  // jeito fácil de armazenar o dono da NFT e referenciar ele
  // depois.
  mapping(address => uint256) public nftHolders;

  constructor(
    string[] memory characterNames,
    string[] memory characterImageURIs,
    uint[] memory characterHp,
    uint[] memory characterAttackDmg
    // Embaixo, você também pode ver que adicionei um símbolo especial para identificar nossas NFTs
    // Esse é o nome e o símbolo do nosso token, ex Ethereum ETH.
    // Eu chamei o meu de Heroes e HERO. Lembre-se, um NFT é só um token!
  )
    ERC721("Heroes", "HERO")
  {
    for(uint i = 0; i < characterNames.length; i += 1) {
      defaultCharacters.push(CharacterAttributes({
        characterIndex: i,
        name: characterNames[i],
        imageURI: characterImageURIs[i],
        hp: characterHp[i],
        maxHp: characterHp[i],
        attackDamage: characterAttackDmg[i]
      }));

      CharacterAttributes memory c = defaultCharacters[i];

      // O uso do console.log() do hardhat nos permite 4 parâmetros em qualquer order dos seguintes tipos: uint, string, bool, address

      console.log("Done initializing %s w/ HP %s, img %s", c.name, c.hp, c.imageURI);
    }

    // Eu incrementei tokenIds aqui para que minha primeira NFT tenha o ID 1.
    // Mais nisso na aula!
    _tokenIds.increment();
  }

  // Usuários vão poder usar essa função e pegar a NFT baseado no personagem que mandarem!
  function mintCharacterNFT(uint _characterIndex) external {
    // Pega o tokenId atual (começa em 1 já que incrementamos no constructor).
    uint256 newItemId = _tokenIds.current();

    // A função mágica! Atribui o tokenID para o endereço da carteira de quem chamou o contrato.

    _safeMint(msg.sender, newItemId);

    // Nós mapeamos o tokenId => os atributos dos personagens. Mais disso abaixo

    nftHolderAttributes[newItemId] = CharacterAttributes({
      characterIndex: _characterIndex,
      name: defaultCharacters[_characterIndex].name,
      imageURI: defaultCharacters[_characterIndex].imageURI,
      hp: defaultCharacters[_characterIndex].hp,
      maxHp: defaultCharacters[_characterIndex].maxHp,
      attackDamage: defaultCharacters[_characterIndex].attackDamage
    });

    console.log("Minted NFT w/ tokenId %s and characterIndex %s", newItemId, _characterIndex);

    // Mantém um jeito fácil de ver quem possui a NFT
    nftHolders[msg.sender] = newItemId;

    // Incrementa o tokenId para a próxima pessoa que usar.
    _tokenIds.increment();
  }
}
```

Muitas coisas acontecendo aqui. A primeira coisa que fiz foi criar duas variáveis de estado que são quase como variáveis globais permanentes no contrato. Leia sobre elas [aqui](https://ethereum.stackexchange.com/a/25556).

```javascript
mapping(uint256 => CharacterAttributes) public nftHolderAttributes;
mapping(address => uint256) public nftHolders;
```

`nftHolderAttributes` vai ser onde nós armazenamos o estado das NFTs dos jogadores. Nós mapeamos o id da NFT para uma estrutura `CharacterAttributes`.

Lembre-se, cada jogador tem o próprio personagem NFT. E, cada NFT tem o próprio estado como `HP`, `Dano de Ataque`, etc! Então se o player #172 tem uma NFT "Pikachu" e o Pikachu dele perder vida em uma batalha, **então só a NFT Pikachu do jogador #172 deve ser mudada**, e a NFT Pikachu de todo o resto das pessoas deve se manter a mesma! Então, nós armazenamos o nível dos dados do personagem desse jogador em um map.

Depois, eu tenho `nftHolders` que basicamente me deixa mapear facilmente o endereço de um usuário para o ID da NFT que eles possuem. Por exemplo, eu poderia fazer `nftHolders[INSIRA_UM_ENDERECO_AQUI]` e instantaneamente saber qual NFT que aquele endereço possui. Ajuda muito manter esses dados no contrato para que seja facilmente acessível.

### ⚡️ ERC 721

Você também vai ver que eu "herdo" um contrato OpenZeppelin usando `is ERC721`  quando eu declaro o contrato. Você pode ler mais sobre hereditariedade [aqui](https://solidity-by-example.org/inheritance/), mas basicamente, significa que podemos chamar outros contratos a partir do nosso. É quase como importar funções para usarmos.

O padrão NFT é conhecido como `ERC721` , o qual você pode ler um pouco mais sobre [aqui](https://eips.ethereum.org/EIPS/eip-721). OpenZeppelin essencialmente implementa o padrão NFT para nós e nos deixa escrever nossa própria lógica em cima disso para customizá-lo. Isso significa que não precisamos escrever código repetitivo e básico.

Seria loucura escrever um servidor HTTP do zero sem usar uma biblioteca, certo? Claro, a menos que você quisesse explorar. De maneira semelhante - seria loucura apenas escrever um contrato NFT do zero! Você pode explorar o contrato `ERC721`  que estamos herdando  [daqui](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol).

```solidity
_tokenIds.increment();
```

Então, `_tokenIds` começa no `0`. É só um contador. `increment()´ só adiciona mais 1 - veja [aqui](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/fa64a1ced0b70ab89073d5d0b6e01b0778f7e7d6/contracts/utils/Counters.sol#L32).

**No constructor** eu incremento ele em 1. Por quê? Basicamente porque eu não gosto de lidar com zeros no meu código. Em Solidity, 0 é um [valor padrão](https://docs.soliditylang.org/en/v0.5.11/control-structures.html#scoping-and-declarations) e eu tento me manter longe de valores padrão. Só confie em mim por agora ;).

Eu também tenho `increment()` em `mintCharacterNFT` mas não esqueça de adicioná-la no `constructor` também ;).

```solidity
function mintCharacterNFT(uint _characterIndex)
```

Essa função é onde o minting está acontecendo.

Primeiro, você vai ver que passamos `_characterIndex` para a função. Por quê?

Bom, porque os jogadores precisam estar aptos a falar para nós **Qual personagem eles querem**! Por exemplo, se eu fizer `mintCharacterNFT(0)` então o personagem com as estatísticas de `defaultCharacters[0]` será mintado!

```solidity
uint256 newItemId = _tokenIds.current();
```

Daqui nós temos um número chamado `newItemId`. Esse é o id da NFT. Lembre-se, cada NFT é um ID único. É só um contador básico. `_tokenIds.current()` começa no 0, mas, nós fizemos `_tokenIds.increment()` no `constructor` para que esteja no 1.

Nós estamos usando `_tokenIds` para manter a contagem dos identificadores únicos das NFTs, e é só um número! Então, quando chamamos primeiro `mintCharacterNFT`, `newItemId` é 1. Quando rodamos de novo, `newItemId` será 2 e assim por diante.

`_tokenIds` é uma **variável de estado** o que significa que se mudarmos, o valor é armazenado diretamente no contrato como uma variável global que fica permanentemente na memória.

```solidity
_safeMint(msg.sender, newItemId).
```

Essa é a linha mágica! Quando fazemos `_safeMint(msg.sender, newItemId)`  está basicamente dizendo: "minte a NFT com o id `newItemId` para o usuário com endereço `msg.sender`". Aqui, `msg.sender` é uma variável que o  [Solidity providencia](https://docs.soliditylang.org/en/develop/units-and-global-variables.html#block-and-transaction-properties) que nos dá fácil acesso ao  **endereço público** da pessoa que estiver chamando o contrato.

**Você não pode chamar um contrato anonimamente**, você precisa ter as credenciais da sua carteira conectadas. Isso é quase como "fazendo login" e ser autenticado :).

O que é incrível aqui é que essa é uma  **maneira super segura de conseguir o endereço público do usuário**. Manter o endereço público em segredo não é um problema, já é público, todo mundo consegue enxergar. Mas, usando `msg.sender` você não consegue fingir ser o endereço público de outra pessoa a não ser que você tenha as credenciais da carteira dela!

### 🎨 Mantendo dados dinâmicos em uma NFT.

Então, na medida que jogadores jogam o jogo, certos valores em seus personagens vão mudar, certo? Por exemplo, se meu personagem atacar o boss, o boss vai atacar de volta! **Nesse caso, o HP da minha NFT vai precisar ser diminuído.** Nós precisamos de uma maneira de armazenar esses dados por jogador:

```solidity
nftHolderAttributes[newItemId] = CharacterAttributes({
  characterIndex: _characterIndex,
  name: defaultCharacters[_characterIndex].name,
  imageURI: defaultCharacters[_characterIndex].imageURI,
  hp: defaultCharacters[_characterIndex].hp,
  maxHp:defaultCharacters[_characterIndex].maxHp,
  attackDamage: defaultCharacters[_characterIndex].attackDamage
});
```

Muitas coisas acontecendo aqui! Basicamente, **nossa NFT segura dados relacionados à NFT do nosso jogador. Mas, esses dados são dinâmicos. Por exemplo**, digamos que eu criasse uma NFT. Por padrão minha NFT começa com estatísticas padrões como:

```json
{
  "characterIndex": 1,
  "name": "Aang",
  "imageURI": "https://i.imgur.com/xVu4vFL.png",
  "hp": 200,
  "maxHp": 200,
  "attackDamage": 50
}
```

**Lembre-se, todo jogador tem seu próprio personagem NFT e a NFT mesma segura os dados do estado do personagem.**

Digamos que o meu personagem seja atacado e perca 50 de HP, bom, então o HP iria de 200 -> 150, certo? Esse valor vai precisar mudar na NFT!

```json
{
  "characterIndex": 1,
  "name": "Aang",
  "imageURI": "https://i.imgur.com/xVu4vFL.png",
  "hp": 150,
  "maxHp": 200,
  "attackDamage": 50
}
```

Ou talvez nós queremos que nosso jogo tenham personagens **atualizáveis, que possam subir de nível e ter itens**, onde você poderia dar ao seu personagem uma espada que adicionaria +10 de dano de ataque, de 50 -> 60. Então, `attackDamage` precisaria mudar na NFT!

As pessoas muitas vezes pensam que os metadados não permitem mudanças, mas isso não é verdade. É o criador quem decide!!!

Nesse caso, o nome e a imagem do personagem **nunca** mudam, mas o valor do HP definitivamente muda! **Nossas NFTs** precisam estar aptas a manter o estado do personagem específico do jogador.

Esse é o porquê de nós precisarmos da variável `nftHolderAttributes`que mapeia o tokenId da NFT para uma estrutura de `CharacterAttributes`. Nos permite atualizar facilmente os valores das NFTs do jogador. Isso significa quando o jogador joga nosso jogo e o `hp` da NFT dele muda (pois o boss ataca ele), nós na verdade mudamos o valor do `hp` em `nftHolderAttributes`. E assim é como nós armazenamos os dados específicos da NFT de cada jogador no nosso contrato!

Depois, fazemos:

```solidity
nftHolders[msg.sender] = newItemId;
```

Mapeia o endereço público da carteira para o tokenId das NFTs. Isso é o que nos deixa manter a contagem de quem possui as NFTs facilmente.

_Nota: Nesse momento isso é desenhado de maneira que cada jogador possa ter apenas um personagem NFT por endereço de carteira. Se você quisesse, você poderia ajustar isso para os jogadores poderem ter múltiplos personagens, mas eu fiquei com 1 por jogador para facilitar! Esse é nosso jogo, faça o que quiser!_

```solidity
_tokenIds.increment();
```

Depois que a NFT é mintada, nós incrementamos `tokenIds` usando `_tokenIds.increment()` (que é uma função que o OpenZeppelin nos dá). Isso nos dá a certeza de que da próxima vez que uma NFT for mintada, vai ter um identificador `tokenIds` diferente. Ninguém pode ter um `tokenIds` que já foi mintado.

### 😳 Rodando localmente.

Em `run.js` o que precisamos fazer é chamar `mintCharacterNFT`. Eu adicionei as linhas seguintes em `run.js` logo embaixo de onde escrevemos o endereço do contrato.

```javascript
let txn;
// Só temos três personagens.
// Uma NFT com personagem no index 2 da nossa array.
txn = await gameContract.mintCharacterNFT(2);
await txn.wait();

// Pega o valor da URI da NFT
let returnedTokenUri = await gameContract.tokenURI(1);
console.log("Token URI:", returnedTokenUri);
```

Quando fazemos `mintCharacterNFT(2)` o Hardhat vai chamar essa função com uma **carteira padrão** que está configurada para nós localmente. Isso significa que `msg.sender` será o endereço público da nossa carteira local! **Isso é outro motivo do porque o Hardhat é tão legal,** ele nos deixa usar carteiras locais facilmente!! Isso é geralmente uma dor enorme para fazer você mesmo.

A função `tokenURI` é algo que pegamos de graça do `ERC721` já que herdamos dele.

Basicamente, `tokenUri` é uma função em **cada NFT** que retorna os **dados atuais** que estão ligados à NFT. Então quando eu chamo `gameContract.tokenURI(1)` está basicamente dizendo, _"vá pegar para mims os dados dentro da NFT com tokenId 1"_, que seria a primeira NFT mintada. E, deveria me devolver todas as coisas, como o nome do personagem, o hp atual e etc.

Plataformas como o OpenSea e Rarible sabem como pegar o `tokenURI` já que a forma padrão de pegar os metadados da NFT. Vamos tentar rodar o nosso contrato de novo (lembre-se que o comando é `npx hardhat run scripts/run.js`)

Meu output (saída) se parece com isso:

```plaintext
Done initializing Leo w/ HP 100, img https://i.imgur.com/pKd5Sdk.png
Done initializing Aang w/ HP 200, img https://i.imgur.com/xVu4vFL.png
Done initializing Pikachu w/ HP 300, img https://i.imgur.com/u7T87A6.png
Contrato implantado no endereço: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Mintou um NFT com tokenId 1 e characterIndex 2
Token URI:
```

**Hmmmmmm**. Token URI não escreve nada! Isso significa que não temos nenhum dado ligado à nossa NFT. Mas espera, isso não faz sentido. Nós não configuramos os dados com `nftHolderAttributes`?

**Não. `nftHolderAttributes` não ligou os dados às NFTs de nenhuma maneira. É só um mapping que vive no contrato nesse momento.** O que vamos fazer agora é basicamente fixar `nftHolderAttributes` para o `tokenURI` sobrescrevendo ele :).

### ⭐️ Configurando tokenURI

O `tokenURI` tem um formato específico, na verdade! Na verdade, está esperando os dados NFT em **JSON**.

Vamos ver como fazer isso :).

Crie uma pasta nova dentro de `contracts` chamada `libraries`. Crie um arquivo chamado `Base64.sol` e coloque ele dentro de libraries. Copie e cole o código [REVIEW(Eu tenh o o link do seu gist mas eu vi uma diferença na versão do solidity, o farza ta com a 0.8.0 e vc ta usando a 0.8.1, não sei se tem mais diferenças mas queria que vc olhasse por favor.)](https://gist.github.com/farzaa/f13f5d9bda13af68cc96b54851345832) dentro de `Base64.sol`. Isso basicamente nos dá funções que nos ajudam a codificar qualquer tipo de dado em uma string Base64 - que é um padrão para codificar pedaços de dado em uma string. Não se preocupe, você vai ver como isso funciona logo!

Vamos precisar importar essa biblioteca no nosso contrato. Para isso, adicione o snippet a seguir perto do topo do seu arquivo, junto com os outros imports.

```solidity
// Helper que escrevemos para codificar em Base64
import "./libraries/Base64.sol";
```

Depois, escrevemos uma função chamada `tokenURI` em `MyEpicGame.sol`.

```solidity
function tokenURI(uint256 _tokenId) public view override returns (string memory) {
  CharacterAttributes memory charAttributes = nftHolderAttributes[_tokenId];

  string memory strHp = Strings.toString(charAttributes.hp);
  string memory strMaxHp = Strings.toString(charAttributes.maxHp);
  string memory strAttackDamage = Strings.toString(charAttributes.attackDamage);

  string memory json = Base64.encode(
    abi.encodePacked(
      '{"name": "',
      charAttributes.name,
      ' -- NFT #: ',
      Strings.toString(_tokenId),
      '", "description": "Esta NFT dá acesso ao meu jogo NFT!", "image": "',
      charAttributes.imageURI,
      '", "attributes": [ { "trait_type": "Health Points", "value": ',strHp,', "max_value":',strMaxHp,'}, { "trait_type": "Attack Damage", "value": ',
      strAttackDamage,'} ]}'
    )
  );

  string memory output = string(
    abi.encodePacked("data:application/json;base64,", json)
  );

  return output;
}
```

Isso parece complexo. Mas, não é tão louco! Primeiro nós começamos aqui:

```solidity
CharacterAttributes memory charAttributes = nftHolderAttributes[_tokenId];
```

Essa linha **recupera** os dados dessa NFT específica buscando por ele usando `_tokenId` que foi passado para a função. Então, se eu tivesse feito `tokenURI(256)` ele retornaria o JSON com os dados relacionados a NFT 256 (se existisse!).

Então, pegamos todos esses dados e empacotamos ele em uma variável chamada `json`. A estrutura JSON se parece com isso (quando está limpa):

```json
{
  "name": "Aang",
  "description": "Aqui é a descrição",
  "image": "https://i.imgur.com/xVu4vFL.png",
  "attributes": [
    { "trait_type": "Health Points", "value": 200, "max_value": 200 },
    { "trait_type": "Attack Damage", "value": 50 }
  ]
}
```

Você poder ler mais sobre a estrutura dos dados [aqui](https://docs.opensea.io/docs/metadata-standards#metadata-structure).

Então, isso pode parecer loucura, mas só está estruturando os dados para seguir o formato a seguir:

```solidity
string memory json = Base64.encode(
  abi.encodePacked(
        '{"name": "',
        charAttributes.name,
        ' -- NFT #: ',
        Strings.toString(_tokenId),
        '", "description": "Esta NFT dá acesso ao meu jogo NFT!", "image": "',
        charAttributes.imageURI,
        '", "attributes": [ { "trait_type": "Health Points", "value": ',strHp,', "max_value":',strMaxHp,'}, { "trait_type": "Attack Damage", "value": ',
        strAttackDamage,'} ]}'
  )
);
```

Nós configuramos coisas como o nome da NFT, o HP, o Dano de ataque e etc **dinâmicamente**. _Nota: abi.encodePacked só combina strings._ Isso é realmente legal porque nós podemos mudar coisas como o HP da NFT e a imagem dela se quiséssemos, e atualizar na NFT! **É dinâmico!**

Também esse padrão de metadados é seguido por muitos sites populares de NFT como o OpenSea. Então, tudo que estamos fazendo na função é formatando a nossa variável `json` para seguir os padrões. Note: `max_value` não é necessário, mas eu quis adicioná-lo por diversão.

```solidity
abi.encodePacked("data:application/json;base64,", json)
```

Essa linha é na verdade difícil de explicar, é mais fácil apenas mostrar! Vá em frente e rode `run.js`. Aqui está meu output:

```plaintext
Done initializing Leo w/ HP 100, img https://i.imgur.com/pKd5Sdk.png
Done initializing Aang w/ HP 200, img https://i.imgur.com/xVu4vFL.png
Done initializing Pikachu w/ HP 300, img https://i.imgur.com/u7T87A6.png
Contrato implantado no endereço: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Mintou um NFT com tokenId 1 e characterIndex 2
Token URI: data:application/json;base64,eyJuYW1lIjogIlBpa2FjaHUgLS0gTkZUICM6IDEiLCAiZGVzY3JpcHRpb24iOiAiQ3JpdGljYWxIaXQgaXMgYSB0dXJuLWJhc2VkIE5GVCBnYW1lIHdoZXJlIHlvdSB0YWtlIHR1cm5zIHRvIGF0dGFjayB0aGUgYm9vcy4iLCAiaW1hZ2UiOiAiaHR0cHM6Ly9pLmltZ3VyLmNvbS91N1Q4N0E2LnBuZyIsICJhdHRyaWJ1dGVzIjogWyB7ICJ0cmFpdF90eXBlIjogIkhlYWx0aCBQb2ludHMiLCAidmFsdWUiOiAzMDAsICJtYXhfdmFsdWUiOjMwMH0sIHsgInRyYWl0X3R5cGUiOiAiQXR0YWNrIERhbWFnZSIsICJ2YWx1ZSI6IDI1fSBdfQ==
```

Você verá que Token URI agora escreve coisas! **Boa!!** Vá em frente e copie essa grande string depois de `Token URI:`. Por exemplo, a minha se parece com isso:

```plaintext
data:application/json;base64,eyJuYW1lIjogIlBpa2FjaHUgLS0gTkZUICM6IDEiLCAiZGVzY3JpcHRpb24iOiAiQ3JpdGljYWxIaXQgaXMgYSB0dXJuLWJhc2VkIE5GVCBnYW1lIHdoZXJlIHlvdSB0YWtlIHR1cm5zIHRvIGF0dGFjayB0aGUgYm9vcy4iLCAiaW1hZ2UiOiAiaHR0cHM6Ly9pLmltZ3VyLmNvbS91N1Q4N0E2LnBuZyIsICJhdHRyaWJ1dGVzIjogWyB7ICJ0cmFpdF90eXBlIjogIkhlYWx0aCBQb2ludHMiLCAidmFsdWUiOiAzMDAsICJtYXhfdmFsdWUiOjMwMH0sIHsgInRyYWl0X3R5cGUiOiAiQXR0YWNrIERhbWFnZSIsICJ2YWx1ZSI6IDI1fSBdfQ==
```

Cole essa string dentro da barra de URL no seu browser. Você vai ver algo como isso:

![REVIEW](https://i.imgur.com/C3QmD2G.png)

BOOOM!!!

Basicamente o que fizemos foi que formatamos nosso arquivo JSON e **codificamos ele** em Base64. Então, acontece que o arquivo JSON se torna essa string codificada super longa, que é legível para o nosso browser quando usamos o prefixo `data:application/json;base64,`.

Adicionamos `data:application/json;base64,` porque o nosso browser precisa saber como ler a string codificada que estamos passando. Nesse caso, estamos dizendo,

"Ei, estamos passando um arquivo JSON codificado com Base64, por favor renderize ele de maneira adequada."

De novo, isso é considerado um padrão para a maioria dos navegadores, o que é perfeito porque nós queremos que os dados das nossas NFT sejam compatíveis com o maior número de sistemas possível.

Por quê estamos fazendo essas coisas de Base64? Bom, basicamente isso é como sites populares ocomo o OpenSea, Rarible e muitos outros preferem quando passam dados JSON diretamente do nosso conrtato.

**Incrível**. Então, agora estamos no ponto em que mintamos oficialmente e localmente as NFTs e a NFT tem dados fixados nela em uma maneira que siga os padrões.

**Estamos prontos para fazer o deploy da nossa NFT no OpenSea :).**

### 🚨 Reporte seu Progresso !

Poste uma screenshot do seu JSON quando você colou o `tokenURI` no endereço do seu navegador :)!