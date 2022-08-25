## 🔥 Toque finais na UI.

Você provavelmente notou alguns pontos onde nada foi indicado ao usuário sobre o que estava acontecendo quando fizemos coisas como mintar o personagem NFT ou buscar os dados do Boss. Eu vou passar por isso e mostrar indicadores de carregamento que pensei serem legais para adicionar!

Vamos configurar alguns indicadores de carregamento:

1. `App.js` - Esperando para ver se o usuário já mintou a NFT
2. `SelectCharacter Component` - Esperando que o personagem seja mintado.
3. - `Arena Component` - Esperando pela ação de ataque terminar.

Lembra daquele componente `LoadingIndicator` que foi dado para você? Nós finalmente vamos poder usá-lo!

### 🔁 Adicionando indicadores de carregamento para App.js.

Nós queremos ter certeza que o usuário possa ver que algo está acontecendo já que estamos esperando que o nosso app descubra em qual cenário estamos. Para isso, é bem simples - mostre um indicador de carregamento até que os nossos dados voltem.

Precisamos saber quando algo está carregando. É o cenário perfeito para uma propriedade de estado. Comece adicionando o estado `isLoading` bem abaixo do estado `characterNFT` como:

```javascript
// Estado
const [currentAccount, setCurrentAccount] = useState(null);
const [characterNFT, setCharacterNFT] = useState(null);
/*
 * Nova propriedade de estado adicionado aqui
 */
const [isLoading, setIsLoading] = useState(false);
```

Depois, vamos precisar configurar o estado quando estivermos rodando operações assíncronas, como chamar `checkIfUserHasNFT` a partir do nosso contrato. Nós vamos adicionar esse configuradores nos `useEffects` como esse:

```javascript
// UseEffects
useEffect(() => {
  /*
   * Quando nosso componente for montado, tenha certeza de configurar o estado de carregamento
   */
  setIsLoading(true);
  checkIfWalletIsConnected();
}, []);

useEffect(() => {
  const fetchNFTMetadata = async () => {
    console.log("Procurando personagens NFT na carteira:", currentAccount);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const gameContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      myEpicGame.abi,
      signer
    );

    const characterNFT = await gameContract.checkIfUserHasNFT();
    if (characterNFT.name) {
      console.log("User has character NFT");
      setCharacterNFT(transformCharacterData(characterNFT));
    }

    /*
     * Uma vez que tivermos acabado a busca, configure o estado de carregamento para falso.
     */
    setIsLoading(false);
  };

  if (currentAccount) {
    console.log("Carteira conectada:", currentAccount);
    fetchNFTMetadata();
  }
}, [currentAccount]);
```

Agora que temos tudo configurado, nós precisamos mostrar alguma coisa. Primeiro tenha certeza de importar o `LoadingIndicator` em cima do seu arquivo:

```javascript
import LoadingIndicator from "./Components/LoadingIndicator";
```

Depois é tão fácil quanto adicionar isso para nossa função `renderContent` para ela falar, "Ei mostre meu indicador de carregamento quando estivermos carregando":

```javascript
const renderContent = () => {
  /*
   * Se esse app estiver carregando, renderize o indicador de carregamento
   */
  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (!currentAccount) {
    return (
      <div className="connect-wallet-container">
        <img
          src="https://thumbs.gfycat.com/AnchoredPleasedBergerpicard-size_restricted.gif"
          alt="Nascimento Gif"
        />
        <button
          className="cta-button connect-wallet-button"
          onClick={connectWalletAction}
        >
          Conecte sua carteira
        </button>
      </div>
    );
  } else if (currentAccount && !characterNFT) {
    return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
  } else if (currentAccount && characterNFT) {
    return (
      <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />
    );
  }
};
```

Se você desconectar sua carteira você deve ver um indicador de carregamento circular. Nós devemos lançar a propriedade `isLoading` para seu botão de conectar a carteira aparecer!

```javascript
// Actions
const checkIfWalletIsConnected = async () => {
  try {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Parece que você não tem a metamask instalada!");
      /*
       * Nós configuramos o isLoading aqui porque usamos o return na proxima linha
       */
      setIsLoading(false);
      return;
    } else {
      console.log("Objeto ethereum encontrado:", ethereum);

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Carteira conectada:", account);
        setCurrentAccount(account);
      } else {
        console.log("Não foi encontrada uma carteira conectada");
      }
    }
  } catch (error) {
    console.log(error);
  }
  /*
   * Nós lançamos a propriedade de estado depois de toda lógica da função
   */
  setIsLoading(false);
};
```

### 🔁 Adicionando indicadores de carregamento para a página de Selecionar Personagem

No nosso componente `SelectCharacter`, vamos mintar um personagem NFT. Isso é uma boa hora para adicionar um indicador de carregamento. Eu tenho um perfeito!

Vamos começar indo para `Components/SelectCharacter/index.js` . Como em `App.js`, nós vamos querer segurar o estado para saber quando estamos na fase de mint ou não. Comece adicionando uma propriedade nova de estado como essa:

```javascript
// State
const [characters, setCharacters] = useState([]);
const [gameContract, setGameContract] = useState(null);
/*
 * New minting state property we will be using
 */
const [mintingCharacter, setMintingCharacter] = useState(false);
```

Então vamos em frente, vá para a `mintCharacterNFTAction`, já que esta é uma função que estava fazendo o mint para nós. Assim como antes, nós poderíamos mudar isso para incluir nossos novos estados atualizados:

```javascript
const mintCharacterNFTAction = (characterId) => async () => {
  try {
    if (gameContract) {
      /*
       * Mostre nosso indicador de carregamento
       */
      setMintingCharacter(true);
      console.log("Mintando personagem...");
      const mintTxn = await gameContract.mintCharacterNFT(characterId);
      await mintTxn.wait();
      console.log(mintTxn);
      /*
       * Esconde nosso indicador de carregamento quando o mint for terminado
       */
      setMintingCharacter(false);
    }
  } catch (error) {
    console.warn("Ação de mintar com erro: ", error);
    /*
     * Se tiver um problema, esconda o indicador de carregamento também
     */
    setMintingCharacter(false);
  }
};
```

Uma coisa que eu queria apontar aqui é o `setMintingCharacter` no bloco catch. Isso é sua escolha, mas eu preferi remover o meu indicador e talvez mostrar algum alerta de erro! Faça como quiser.

Finalmente, vamos configurar alguma UI que vai mostrar quando estivermos no estado de mint. Eu disponibilizei um código HTML padrão para isso, mas seja criativo. Configure seu estado de mint como você quiser!

```javascript
return (
  <div className="select-character-container">
    <h2>Minte seu herói. Escolha com sabedoria</h2>
    {characters.length > 0 && (
      <div className="character-grid">{renderCharacters()}</div>
    )}
    {/* Só mostre o seu indicador de carregamento se mintingCharacter for verdadeiro */}
    {mintingCharacter && (
      <div className="loading">
        <div className="indicator">
          <LoadingIndicator />
          <p>Mintando personagem...</p>
        </div>
        <img
          src="https://media2.giphy.com/media/61tYloUgq1eOk/giphy.gif?cid=ecf05e47dg95zbpabxhmhaksvoy8h526f96k4em0ndvx078s&rid=giphy.gif&ct=g"
          alt="Minting loading indicator"
        />
      </div>
    )}
  </div>
);
```

Não esqueça de adicionar algum CSS para o seu `SelectedCharacter.css` também:

```css
.select-character-container .loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 75px;
}

.select-character-container .loading .indicator {
  display: flex;
}

.select-character-container .loading .indicator p {
  font-weight: bold;
  font-size: 28px;
  padding-left: 5px;
}

.select-character-container .loading img {
  width: 450px;
  padding-top: 25px;
}
```

Com esse HTML e CSS, você deve ver algo como isso:

![Untitled](https://i.imgur.com/TqcL5cP.png)

Gandalf está agora preparando você para a batalha enquanto você fica pronto para derrotar o boss na Arena 🧙‍♂️.

### 🔁 Adicionando os indicadores de carregamento na página da Arena.

O último ponto que queremos adicionar um indicador de carregamento está no nosso componente `Arena`. Enquanto nós já temos algumas animações acontecendo durante o ataque, porque não adicionamos mais um pouco para ficar melhor!

A coisa legal sobre esse componente é que nós já temos algum estado configurado para isso - `attackState`! Nós sabemos quando um ataque está acontecendo quando nosso `attackState` == `attacking` então porque não usamos ele?

Para isso tudo que precisamos fazer é adicionar mais uma renderização condicional no nosso HTML. Vá em frente e adicione isso:

```javascript
<div className="arena-container">
  {boss && (
    <div className="boss-container">
      <div className={`boss-content  ${attackState}`}>
        <h2>🔥 {boss.name} 🔥</h2>
        <div className="image-content">
          <img src={boss.imageURI} alt={`Boss ${boss.name}`} />
          <div className="health-bar">
            <progress value={boss.hp} max={boss.maxHp} />
            <p>{`${boss.hp} / ${boss.maxHp} HP`}</p>
          </div>
        </div>
      </div>
      <div className="attack-container">
        <button className="cta-button" onClick={runAttackAction}>
          {`💥 Atacar ${boss.name}`}
        </button>
      </div>
      {/* Adicione isso embaixo do seu botão de ataque */}
      {attackState === "attacking" && (
        <div className="loading-indicator">
          <LoadingIndicator />
          <p>Atacando ⚔️</p>
        </div>
      )}
    </div>
  )}
  ...
</div>
```

Tenha certeza de adicionar esse CSS ao seu arquivo `Arena.css`:

```css
.boss-container .loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 25px;
}

.boss-container .loading-indicator p {
  font-weight: bold;
  font-size: 28px;
}
```

Com esse código você deve ter algo que se pareça com isso:

![Untitled](https://i.imgur.com/xuuhAQy.png)

Nada mau, certo? Todos esses indicadores de carregamento funcionam da mesma maneira e vivem nos nossos próprios componentes. Na próxima seção nós vamos adicionar mais uma peça que vai deixar nosso componente `Arena` melhor ainda quando um ataque é desferido!

### 🚨 Adicione os alertas de ataque na página da Arena.

Outra coisa legal que você pode adicionar para o projeto é uma mensagem mostrando quanto dano você deu no boss! Isso faz o seu jogo ser mais interativo ainda. Nós vamos usar um codepen muito legal para configurar nossa UI para isso. [Vá para esse codepen](https://codepen.io/jrsmiffy/pen/eYYwrap) para o código! Se você quer ser ainda mais chique com isso, você pode criar seu próprio componente React para que possa usar isso em qualquer lugar. Por agora, só vamos adicionar o código no nosso componente `Arena`!

Comece adicionando algum CSS para seu arquivo `Arena.css`:

```css
/* Toast */
#toast {
  visibility: hidden;
  max-width: 500px;
  height: 90px;
  margin: auto;
  background-color: gray;
  color: #fff;
  text-align: center;
  border-radius: 10px;
  position: fixed;
  z-index: 1;
  left: 0;
  right: 0;
  bottom: 30px;
  font-size: 17px;
  white-space: nowrap;
}

#toast #desc {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 28px;
  font-weight: bold;
  height: 90px;
  overflow: hidden;
  white-space: nowrap;
}

#toast.show {
  visibility: visible;
  -webkit-animation: fadein 0.5s, expand 0.5s 0.5s, stay 3s 1s, shrink 0.5s 2s,
    fadeout 0.5s 2.5s;
  animation: fadein 0.5s, expand 0.5s 0.5s, stay 3s 1s, shrink 0.5s 4s,
    fadeout 0.5s 4.5s;
}

@-webkit-keyframes fadein {
  from {
    bottom: 0;
    opacity: 0;
  }
  to {
    bottom: 30px;
    opacity: 1;
  }
}

@keyframes fadein {
  from {
    bottom: 0;
    opacity: 0;
  }
  to {
    bottom: 30px;
    opacity: 1;
  }
}

@-webkit-keyframes expand {
  from {
    min-width: 50px;
  }
  to {
    min-width: 350px;
  }
}

@keyframes expand {
  from {
    min-width: 50px;
  }
  to {
    min-width: 350px;
  }
}
@-webkit-keyframes stay {
  from {
    min-width: 350px;
  }
  to {
    min-width: 350px;
  }
}

@keyframes stay {
  from {
    min-width: 350px;
  }
  to {
    min-width: 350px;
  }
}
@-webkit-keyframes shrink {
  from {
    min-width: 350px;
  }
  to {
    min-width: 50px;
  }
}

@keyframes shrink {
  from {
    min-width: 350px;
  }
  to {
    min-width: 50px;
  }
}

@-webkit-keyframes fadeout {
  from {
    bottom: 30px;
    opacity: 1;
  }
  to {
    bottom: 60px;
    opacity: 0;
  }
}

@keyframes fadeout {
  from {
    bottom: 30px;
    opacity: 1;
  }
  to {
    bottom: 60px;
    opacity: 0;
  }
}
```

Vamos então adicionar o renderizador de HTML. Vá em frente e adicione isso à sua função de renderização:

```javascript
return (
  <div className="arena-container">
    {/* Add your toast HTML right here */}
    {boss && characterNFT && (
      <div id="toast" className={showToast ? "show" : ""}>
        <div id="desc">{`💥 ${boss.name} tomou ${characterNFT.attackDamage} de dano!`}</div>
      </div>
    )}

    {/* Boss */}
    {boss && (
      <div className="boss-container">
        <div className={`boss-content  ${attackState}`}>
          <h2>🔥 {boss.name} 🔥</h2>
          <div className="image-content">
            <img src={boss.imageURI} alt={`Boss ${boss.name}`} />
            <div className="health-bar">
              <progress value={boss.hp} max={boss.maxHp} />
              <p>{`${boss.hp} / ${boss.maxHp} HP`}</p>
            </div>
          </div>
        </div>
        <div className="attack-container">
          <button className="cta-button" onClick={runAttackAction}>
            {`💥 Attack ${boss.name}`}
          </button>
        </div>
        {attackState === "attacking" && (
          <div className="loading-indicator">
            <LoadingIndicator />
            <p>Atacando ⚔️</p>
          </div>
        )}
      </div>
    )}

    {/* Personagem NFT */}
    {characterNFT && (
      <div className="players-container">
        <div className="player-container">
          <h2>Your Character</h2>
          <div className="player">
            <div className="image-content">
              <h2>{characterNFT.name}</h2>
              <img
                src={characterNFT.imageURI}
                alt={`Personagem ${characterNFT.name}`}
              />
              <div className="health-bar">
                <progress value={characterNFT.hp} max={characterNFT.maxHp} />
                <p>{`${characterNFT.hp} / ${characterNFT.maxHp} HP`}</p>
              </div>
            </div>
            <div className="stats">
              <h4>{`⚔️ Poder de Ataque: ${characterNFT.attackDamage}`}</h4>
            </div>
          </div>
        </div>
        {/* <div className="active-players">
          <h2>Active Players</h2>
          <div className="players-list">{renderActivePlayersList()}</div>
        </div> */}
      </div>
    )}
  </div>
);
```

Já que sabemos que o nosso Capitão Nascimento sempre vai sofrer o mesmo dano de nós, você pode só adicionar aquilo ali. Se você mudar o contrato para ter algum RNG, você vai precisar fazer isso de maneira um pouco diferente usando algo como React Ref!

Agora que temos tudo isso configurado, como mostramos ou escondemos nosso toast? Se você olhar ao CSS, tem uma classe chamada `show` que vai mostrar nosso toast, e se removermos a classe, vai esconder o toast! Nós precisamos mudar um pouco isso para dinâmicamente mudar o nome da classe. Nós vamos criar mais uma propriedade de estado e adicionar alguma lógica para adicionar e remover a classe `show`:

```javascript
// State
const [gameContract, setGameContract] = useState(null);
const [boss, setBoss] = useState(null);
const [attackState, setAttackState] = useState('');

/*
* Gerenciamento de estado de toast
*/
const [showToast, setShowToast] = useState(false);

...

const runAttackAction = async () => {
  try {
    if (gameContract) {
      setAttackState('attacking');
      console.log('Atacando o Boss...');
      const txn = await gameContract.attackBoss();
      await txn.wait();
      console.log(txn);
      setAttackState('hit');

      /*
      * Configura seu estado toast para true e depois Falso 5 segundos depois
      */
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 5000);
    }
  } catch (error) {
    console.error('Erro ao atacar o boss:', error);
    setAttackState('');
  }
};
```

Boa! A maior coisa de se apontar é o `setTimeout`. Tudo que isso está fazendo é esperando 5 segundos antes de remover a classe `show`, que vai esconder nosso toast!

Se você fizer tudo certo, você vai ver um pequeno e legal toast embaixo do seu app depois de atacar seu boss.

![Untitled](https://i.imgur.com/nDuZnKy.png)
