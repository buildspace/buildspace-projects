### 🤔 O que é uma NFT?

Haha, essa é uma grande questão. Esteja certo de ler [isso](https://github.com/w3b3d3v/buildspace-projects/blob/web3dev-version/NFT_Collection/pt-br/Section_1/Lesson_1_What_Is_A_NFT.md) rapidamente para te dar uma noção antes de seguir em frente. Enquanto você tiver a _ideia geral_ sobre o que é uma NFT, isso é tudo o que você precisa aqui!

### 😮 Como vamos usar NFTs jogáveis.

Legal. Nós temos todo ambiente básico configurado. Vamos dar uma passo pra trás para explicar esse jogo que estamos fazendo em um nível mais alto:

O objetivo do nosso jogo vai ser destruir um chefão, um boss. Vamos falar que o boss tenha 1,000,000 de vida. O que os jogadores fazem é, quando começarem o jogo, eles mintam um **personagem NFT** que tem uma quantidade de **Dano de Ataque** e **Vida**. Jogadores podem pedir que o seu **personagem NFT** ataque o boss e aplicar dano nele. Quase como Pokémon!

O objetivo? Jogadores precisam trabalhar juntos para atacar o boss e trazer seu HP (vida) para 0. Qual é o truque? Toda vez que um player bater no boss, o boss bate nele de volta! Se a vida da NFT for pra 0 ou menos, o jogador daquela NFT **morre** e ele não pode mais bater no boss. Jogadores **só podem ter um personagem NFT em suas carteiras.** Uma vez que o personagem NFT morre, o jogo acaba. Isso significa que muitos jogadores precisam juntar forças para atacar o boss e matá-lo.

**Nota: Se você quiser que o seu jogador esteja apto a segurar múltiplos personagens em sua carteira (como no Pokémon), sinta-se livro para fazer modificações você mesmo!**

O importante a saber aqui é que os personagens são **NFTs**.

Então, quando um jogador for jogar o jogo:

1. Eles vão conectar sua carteira.
2. Nosso jogo vai detectar se eles tem ou não um personagem NFT na carteira.
3. Vamos deixar eles escolherem um personagem e mintar seu próprio personagem NFT para jogar o jogo. Cada personagem NFT tem seu próprios atributos guardados na NFT diretamente, como: HP (vida), Dano de Ataque, a imagem do personagem, etc. Então, quando a vida do personagem chegar a 0, diria `hp: 0` na NFT.

**Isso é exatamente como o jogo NFT mais popular do mundo funciona :).** Nós vamos construir nós mesmos! O que precisamos fazer primeiro é basicamente configurar nosso código de mintar a NFT, porque sem isso, os jogadores não podem nem entrar no jogo para jogar!

### ✨ Configurando os dados para suas NFTs

Hora da parte divertida, configurar os personagens NFTs. Cada personagem vai ter alguns atributos: uma imagem, um nome, valor de HP (vida) e valor do dano de ataque. **Esses atributos vão viver diretamente na NFT.** Nós podemos adicionar mais atributos mais tarde.

O jeito que nosso personagem NFT vai funcionar é: vai haverum número X de personagens (ex: 3). **Mas, um número ilimitado X de NFTs de cada personagens podem ser mintados.** De novo, você pode mudar isso se você quiser - por exemplo se você quiser só uma pequena quantidade X de um certo personagem para ser mintado.

Então isso significa que se 5 pessoas quisessem mintar o personagem #1, 5 pessoas teriam o exato mesmo personagem mas cada pessoa teria uma NFT única e **cada NFT possui seu próprio estado.** Por exemplo, se a NFT do Player #245 levar um ataque e perder vida, só a NFT do Player #245 vai perder vida!

Se isso não fizer sentido, não se preocupe. Vamos direto para o código - vai fazer mais sentido lentamente.

A primeira coisa que precisamos fazer é uma maneira de inicializar os **atributos padrão** de um personagem (ex. sua vida padrão, dano de ataque padrão, imagem padrão, etc). Por exemplo, se tivéssemos um personagem chamado "Pikachu", então nós precisamos configurar a vida base do Pikachu, o dano de ataque base, etc.

Eu atualizei `MyEpicGame.sol` para parecer com isso:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract MyEpicGame {
  // Nós vamos segurar os atributos dos nossos personagens em uma
  //struct. Sinta-se livre para adicionar o que quiser como um
  //atributo! (ex: defesa, chance de crítico, etc).
  struct CharacterAttributes {
    uint characterIndex;
    string name;
    string imageURI;
    uint hp;
    uint maxHp;
    uint attackDamage;
  }
  // Uma pequena array vai nos ajudar a segurar os dados padrão dos
  // nossos personagens. Isso vai ajudar muito quando mintarmos nossos
  // personagens novos e precisarmos saber o HP, dano de ataque e etc.
  CharacterAttributes[] defaultCharacters;

  // Dados passados no contrato quando ele for criado inicialmente,
  // inicializando os personagens.
  // Nós vamos passar esse valores do run.js
  constructor(
    string[] memory characterNames,
    string[] memory characterImageURIs,
    uint[] memory characterHp,
    uint[] memory characterAttackDmg
  )
  {
    // Faz um loop por todos os personagens e salva os valores deles no
    // contrato para que possamos usá-los depois para mintar as NFTs
    // for(uint i = 0; i < characterNames.length; i += 1) {
      defaultCharacters.push(CharacterAttributes({
        characterIndex: i,
        name: characterNames[i],
        imageURI: characterImageURIs[i],
        hp: characterHp[i],
        maxHp: characterHp[i],
        attackDamage: characterAttackDmg[i]
      }));

      CharacterAttributes memory c = defaultCharacters[i];
      console.log("Done initializing %s w/ HP %s, img %s", c.name, c.hp, c.imageURI);
    }
  }
}
```

Tem muita coisa acontecendo aqui mas essencialmente estamos passando vários valores para o `constructor` para setar os personagens. Por quê? Bom - eu preciso de uma maneira de dizer ao nosso contrato "Ei - quando um jogador pedir uma NFT do Pikachu, dê a ele o HP base, o dano de ataque, a imagem e etc dessa NFT."

Lembre-se, o constructor roda apenas **uma vez** quando o contrato é executado.

Pegamos os dados do personagem no `constructor` e guardo no contrato, em uma `struct` do tipo `Character Attributes`. Cada `CharacterAttributes` segura os atributos base de cada personagem.

```solidity
struct CharacterAttributes {
  uint characterIndex;
  string name;
  string imageURI;
  uint hp;
  uint maxHp;
  uint attackDamage;
}
```

Na verdade, eu armazeno cada personagem em uma array chamada `defaultCharacters`.

```solidity
CharacterAttributes[] defaultCharacters;
```

Tudo isso nos dá fácil acesso a cada personagem. Por exemplo, eu posso apenas fazer `defaultCharacters[0]` e conseguir acesso para os atributos padrão do primeiro personagem. Isso é útil para quando mintarmos nossas NFTs e precisarmos inicializar os dados!

Precisamos atualizar `run.js`. Aqui está como se parece:

```javascript
const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory("MyEpicGame");
  const gameContract = await gameContractFactory.deploy(
    ["Leo", "Aang", "Pikachu"], // Names
    [
      "https://i.imgur.com/pKd5Sdk.png", // Images
      "https://i.imgur.com/xVu4vFL.png",
      "https://i.imgur.com/WMB6g9u.png",
    ],
    [100, 200, 300], // HP values
    [100, 50, 25] // Attack damage values
  );
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

Não estou fazendo nada muito chique aqui. Em `run.js`, basicamente definimos os três personagens e suas estatísticas. Meus personagens são Leonardo DiCaprio, Aang de Avatar e Pikachu... Cada personagem tem basicamente um id, nome, imagem, valor de vida, e valor de ataque.

Por exemplo, nesse caso `Aang` tem 200 HP, 50 de dano de ataque. Ele tem muita vida, mas seu ataque não dá tanto dano quanto o de Leonardo! Leonardo tem menos HP, mas dá mais dano. Isso significa que no jogo, ele morrerá mais rápido, mas dará muito dano.

**Você pode balancear seus personagens como quiser :). Por favor, não copie os meus. Adicione três seus.**

Ok, é isso :)!! Quando eu rodar isso usando `npx hardhat run scripts/run.js` e aqui é o que eu tenho:

```plaintext
Done initializing Leo w/ HP 100, img https://i.imgur.com/pKd5Sdk.png
Done initializing Aang w/ HP 200, img https://i.imgur.com/xVu4vFL.png
Done initializing Pikachu w/ HP 300, img https://i.imgur.com/WMB6g9u.png
Contrato implantado no endereço: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

Boom! Nós oficialmente criamos três personagens e estamos salvando os dados deles diretamente no nosso contrato.

**De novo**, **não copie meus personagens. Tenha ideias próprias antes de ir em frente.**

Talvez os seus personagens podem ser do seu anime ou vídeo game favorito.

Talvez você nem queria personagens. Você pode querer que as pessoas mintem "**armas**" que eles usem no jogo, como uma **espada, arma ou canhão de laser**.

Talvez queira que seus personagens tenham coisas como "mana", "energia", ou "chakra" onde os seus personagens podem invocar "feitiços" usando esses atributos.

**Customize seus personagens. É isso que faz ficar divertido!** Por exemplo, eu adicionei Leonardo DiCaprio e Pikachu como personagens pois pensei que seria engraçado - e eu rio toda vez que vejo haha.

Mudar coisas pequenas como personagens vai fazer você sentir que é uma coisa mais sua e você estará mais motivado a construir tudo isso no caminho :).

### 🚨 Reporte seu Progresso!

Poste uma screenshot em #progresso exibindo alguns dos seus personagens -- talvez você possa mostrar o personagem e nos falar o nome dele e quanto HP e Ataque ele tem!!!
Post a screenshot in #progress introducing one of your characters -- perhaps post their image + let us know their name and amount of AD/HP they have!! 
