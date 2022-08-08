Nós estamos muito bem agora. Nós configuramos dois cenários e vimos o básico de chamar o nosso contrato inteligente a partir de uma UI.

Agora que estamos aptos a interagir com o nosso contrato inteligente a partir da UI e criamos nosso componente `SelectCharacter`, nós podemos facilmente pegar todos os personagens mintáveis do nosso contrato e mostrá=los na nossa UI. Vamos nessa.

### 👀 Só mais uma coisa.

Antes de começar, remova qualquer chamada de função para mintar um personagem ou atacar o boss no seu arquivo `script/deploy.js`! Isso vai prevenir alguns erros de estado na nossa UI.

### ♻️ Configurando um objeto reutilizável de contrato.

Já que sabemos que vamos usar nosso contrato inteligente, vamos começar configurando nosso objeto `ethers` para interagir com ele. Vai ser o mesmo flow que antes, com algumas mudanças. Vamos começar importando todas as coisas em `Components/SelectCharacter/index.js`:

```javascript
import React, { useEffect, useState } from "react";
import "./SelectCharacter.css";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformCharacterData } from "../../constants";
import myEpicGame from "../../utils/MyEpicGame.json";
```

Depois, vamos configurar algumas propriedades de estado. Nesse componente nós vamos precisar algumas propriedades de estado diferentes:

`characters` - Isso vai segurar todos os metadados de personagem que pegamos do nosso contrato.

`gameContract` - Essa é legal! Já que vamos estar usando nosso contrato várias vezes, vamos só inicializar uma vez e armazenar no estado para usar no contrato:

```javascript
const SelectCharacter = ({ setCharacterNFT }) => {
  const [characters, setCharacters] = useState([]);
  const [gameContract, setGameContract] = useState(null);

  return (
    <div className="select-character-container">
      <h2>Minte seu Herói. Escolha com sabedoria.</h2>
    </div>
  );
};

export default SelectCharacter;
```

Quando o nosso componente for montado, nós vamos criar nosso `gameContract` para começar a usá-lo em seguida! Quero mostrar nossos personagens mintáveis o mais rápido possível. Isso significa que vamos chamar nosso contrato o mais cedo que pudermos. Nota: esse bloco de código vai embaixo da variável useState (embaixo de `const [gameContract, setGameContract] = useState(null);`.

```javascript
// UseEffect
useEffect(() => {
  const { ethereum } = window;

  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const gameContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      myEpicGame.abi,
      signer
    );

    /*
     * Essa é a grande diferença. Configura nosso gameContract no estado.
     */
    setGameContract(gameContract);
  } else {
    console.log("Ethereum object not found");
  }
}, []);
```

### 😎 Buscando todos os personagens.

Não tem muita diferença aqui com configurar nosso `gameContract` no estado. Nós vamos usar um pouco mais das ferramentas do `useEffect`! Já que precisamos dos nossos dados o mais rápido possível, queremos saber logo quando nosso `gameContract` ficar pronto para o uso. Então, porque não configurar outro `useEffect` para ouvir qualquer mudanças em `gameContract`? Logo abaixo do `useEffect` que você escreveu acima, adiciona isso:

```javascript
useEffect(() => {
  const getCharacters = async () => {
    try {
      console.log("Getting contract characters to mint");

      /*
       * Chama o contrato para buscar todos os personagens mintáveis
       */
      const charactersTxn = await gameContract.getAllDefaultCharacters();
      console.log("charactersTxn:", charactersTxn);

      /*
       * Passa por todos os personagens e transforma os dados
       */
      const characters = charactersTxn.map((characterData) =>
        transformCharacterData(characterData)
      );

      /*
       * Configura os personagens mintáveis no estado
       */
      setCharacters(characters);
    } catch (error) {
      console.error("Something went wrong fetching characters:", error);
    }
  };

  /*
   * Se nosso gameContract estiver pronto, vamos pegar os personagens!
   */
  if (gameContract) {
    getCharacters();
  }
}, [gameContract]);
```

Boa. Isso está se parecendo bem similar com o que tínhamos em `App.js`, certo? Nós temos essa função async chamada `getCharacters` que usa o nosso `gameContract` para chamar nossa função `getAllDefaultCharacters` que escrevemos anteriormente na Solidity Land!

Nós então mapeamos o que é retornado para nós para transformar os dados em uma maneira que nossa UI possa entender facilmente.

Depois, nós podemos configurar esses dados no nosso estado para começar a usá-los!

Finalmente, toda vez que `gameContract` muda nós queremos ter certeza que não é `null`, então envolvemos a nossa chamada de função em um teste rápido.

Antes de ir em frente, vamos tentar um teste rápido! Nós devemos poder ver alguns log statements no nosso console. Tenha certeza que seu console está aberto e recarregue a página do site. Se tudo ocorreu com sucesso, você deve ver algo como isso:
![Untitled](https://i.imgur.com/XHEeMZ5.png)

**🦄 OLHE ISSO! Você conseguiu pegar dados do seu contrato inteligente 🦄**

Isso é legal, mas seria mais legal se fosse mostrado no nosso app, certo?

### 👓 Renderizando a UI dos personagens.

Nós vamos pegar o mesmo método de renderização aqui criando uma função que vai mapear por todos os personagens e criar uma UI para renderizá-los na página. Vamos começar criando o método de renderização no componente `SelectCharacter`:

```javascript
// Métodos de renderização
const renderCharacters = () =>
  characters.map((character, index) => (
    <div className="character-item" key={character.name}>
      <div className="name-container">
        <p>{character.name}</p>
      </div>
      <img src={character.imageURI} alt={character.name} />
      <button
        type="button"
        className="character-mint-button"
        onClick={mintCharacterNFTAction(index)}
      >{`Mint ${character.name}`}</button>
    </div>
  ));
```

Tem algumas coisas que quero falar aqui antes de irmos em frente:

1. Se você lembra da lição anterior, eu dei todo o css necessário para esse componente. Isso vai fazer as coisas funcionarem, mas eu recomendo _FORTEMENTE_ a mudar isso!
2. Você provavelmente vai ver outro erro de undefined para `mintCharacterNFTAction`. Não se preocupe - isso vai ser adicionado depois!
3. Nós ainda precisamos chamar esse método de renderização, então faremos isso agora no componente `SelectCharacter`:

```javascript
return (
  <div className="select-character-container">
    <h2>Minte seu Herói. Escolha com sabedoria.</h2>
    {/* Só mostra isso se tiver personagens no estado
     */}
    {characters.length > 0 && (
      <div className="character-grid">{renderCharacters()}</div>
    )}
  </div>
);
```

É fácil assim! Vá em frente e recarregue a página e você deve ver algo como isso:

![Untitled](https://i.imgur.com/ycbOfNh.png)

**VAMOS NESSA! CONSEGUIMOS ALGUNS PERSONAGENS :).**

_Nota: os personagens podem estar na vertical ao invés de na horizontal!_

### ✨ Mintando nosso personagen NFT a partir da UI.

Isso é incrível, mas nós podemos levar isso um passo mais longe - **um botão para mintar nossa NFT.** Nós vamos começar adicionando na nossa função `mintCharacterNFTAction`. Vá em frente e adicione isso logo abaixo de onde você declarou seu estado em `SelectCharacter`:

```javascript
// Actions
const mintCharacterNFTAction = (characterId) => async () => {
  try {
    if (gameContract) {
      console.log("Minting character in progress...");
      const mintTxn = await gameContract.mintCharacterNFT(characterId);
      await mintTxn.wait();
      console.log("mintTxn:", mintTxn);
    }
  } catch (error) {
    console.warn("MintCharacterAction Error:", error);
  }
};
```

_Nota: Lembre-se de tirar os comentários de `onClick={mintCharacterNFTAction(index)} em `renderCharacters`._

Eu espero que você esteja começando a se familizar com interações com contratos inteligentes! Se você tiver o atributo `onClick` comentado no seu código de método de renderização, tire o comentário dele agora.

Essa função vai chamar a função `mintCharacterNFT` no nosso contrato. Ela precisa saber qual personagem mintar, então passamos o index daquele personagem!

Nós então esperamos a transação acabar antes de fazer qualquer coisa. Algo parece estranho... Não parece que estamos retornando dados do nosso contrato inteligente, certo? Como sabemos que a NFT foi mintada? **Lembra daquele `event` que você criou que dispara quando uma NFT foi mintada?** Isso que vamos usar!

Nós vamos escutar por esse evento do nosso contrato inteligente que diz: "Ei, acabei de mintar sua NFT. Pode continuar."

Vamos ir para o primeiro `useEffect` onde esperamos pelo nosso `gameContract` ser gerado. Nós vamos precisar adicionar algumas coisas aqui:

```javascript
useEffect(() => {
  const getCharacters = async () => {
    try {
      console.log("Getting contract characters to mint");

      const charactersTxn = await gameContract.getAllDefaultCharacters();
      console.log("charactersTxn:", charactersTxn);

      const characters = charactersTxn.map((characterData) =>
        transformCharacterData(characterData)
      );

      setCharacters(characters);
    } catch (error) {
      console.error("Something went wrong fetching characters:", error);
    }
  };

  /*
   * Adiciona um método callback que vai disparar quando o evento for recebido
   */
  const onCharacterMint = async (sender, tokenId, characterIndex) => {
    console.log(
      `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
    );

    /*
     * Uma vez que nosso personagem for mintado, podemos buscar os metadados a partir do nosso contrato e configurar no estado para se mover para a Arena.
     */
    if (gameContract) {
      const characterNFT = await gameContract.checkIfUserHasNFT();
      console.log("CharacterNFT: ", characterNFT);
      setCharacterNFT(transformCharacterData(characterNFT));
    }
  };

  if (gameContract) {
    getCharacters();

    /*
     * Configurar NFT Minted Listener
     */
    gameContract.on("CharacterNFTMinted", onCharacterMint);
  }

  return () => {
    /*
     * Quando seu componente se desmonta, vamos limpar esse listener
     */
    if (gameContract) {
      gameContract.off("CharacterNFTMinted", onCharacterMint);
    }
  };
}, [gameContract]);
```

Isso é bem épico. Você agora está ouvindo eventos de `CharacterNFTMinted` que vão ativar sua função `onCharacterMint`! Vamos falar um pouco mais sobre como isso está funcionando:

```javascript
const onCharacterMint = async (sender, tokenId, characterIndex) => {
  console.log(
    `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
  );

  if (gameContract) {
    const characterNFT = await gameContract.checkIfUserHasNFT();
    console.log("CharacterNFT: ", characterNFT);
    setCharacterNFT(transformCharacterData(characterNFT));
  }
};
```

Esse método é chamado toda vez que uma nova NFT é mintada. Ela simplesmente escreve os dados para ter certeza que as coisas estão funcionando e depois nós precisamos pegar os metadados atuais da nossa recém mintada personagem NFT! Se você tem experiência em React, você pode ver algumas rotas onde você pode pegar os metadados do personagem sem ter que chamar nosso contrato de novo! Se você souber como, mude isso :). Senão, sem problemas! Nós já configuramos essa lógica no nosso contrato (graças ao seu antigo eu).

Tudo que estamos fazendo é chamar a função `checkIfUserHasNFT` que vai retornar todos os nossos metadados! Nesse ponto, podemos transformar os dados configurados no nosso estado. Uma vez que ele estiver configurado, vamos ser transportados para o componente `Arena` (logo que configurarmos ele, claro).

```javascript
gameContract.on("CharacterNFTMinted", onCharacterMint);
```

Isso é bem simples - use seu objeto `gameContract` para ouvir o disparo de `CharacterNFTMinted` a partir do nosso contrato inteligente. Nossa UI vai então rodar a lógica em `onCharacterMint`!

```javascript
return () => {
  if (gameContract) {
    gameContract.off("CharacterNFTMinted", onCharacterMint);
  }
};
```

Finalmente, nós queremos ter certeza de parar de ouvir esse evento quando o componente não estiver sendo mais usado! É boa prática no React e ajuda com futuras melhorias :).

### 🌌 Vendo seu personagem NFT no Metaverso.

![Untitled](https://media.giphy.com/media/rHR8qP1mC5V3G/giphy.gif)

Nesse ponto podemos fazer um teste sólido - vamos mintar uma NFT! Como sempre, tenha seu console aberto para que possamos ver os log statements! Minte seu personagem favorito e espere o seu trabalho funcionar na sua frente:

![Untitled](https://i.imgur.com/PQHzJzq.png)

Você acabou de mintar um personagem NFT do seu contrato inteligente. Antes de ir em frente, vá para o OpenSea e veja se seu personagem foi mintado de verdade. Para pegar o link direto para sua NFT você pode só fazer:

```javascript
https://testnets.opensea.io/assets/CONTRACT_ADDRES/TOKEN_ID
```

Aqui está como o meu se parece:

![Untitled](https://i.imgur.com/W3eca7t.png)

Aí está meu Leo. Uma coisa para notar aqui - tenha certeza de ver sua NFT no [https://testnets.opensea.io/](https://testnets.opensea.io/) já que estamos usando o Rinkeby!

Você conseguiu! Agora que temos nosso personagem NFT nós podemos finalmente sair e proteger o Metaverso de seres malignos!

Sinta-se livre para configurar um `alert` que dá automaticamente o link do OpenSea quando acabar de mintar, algo como isso:

```javascript
alert(
  `Your NFT is all done -- see it here: https://testnets.opensea.io/assets/${gameContract}/${tokenId.toNumber()}`
);
```


### 🚨 Reporte seu Progresso!

Poste uma screenshot da sua seleção de personagens em #progresso -- é sempre muito divertido ver os personagens da galera!! É também ótima ideia fazer um tweet disso! Espalhe ao mundo que seu jogo NFT tem um personagem novo e fale do seu jogo para outras pessoas :).

![Untitled](https://i.imgur.com/ycbOfNh.png)