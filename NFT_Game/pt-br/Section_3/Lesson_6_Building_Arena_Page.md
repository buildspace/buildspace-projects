Nesse ponto, fomos introduzidos a basicamente tudo que precisamos saber para construir nosso app React. Vamos configurar nosso componente `Arena`:

Com com o componente `SelectCharacter`, vamos criar um novo arquivo em `Components/Arena` chamado `index.js`. De novo, você deve ver um arquivo `Arena.css` nessa pasta! Uma vez que você tiver configurado sua base, não se esqueça de estilizar do seu jeito 💅.

### ⚔️ Configurando a Arena.

Depois, vamos configurar nosso componente `Arena`. Esteja certo de que você está trabalhando em `Arena/index.js`. Eu vou adicionar muito mais código base aqui já que já estamos familiarizados com o que está acontecendo:

```javascript
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformCharacterData } from "../../constants";
import myEpicGame from "../../utils/MyEpicGame.json";
import "./Arena.css";

/*
 * Passamos os metadados do nosso personagem NFT para que podemos ter um card legal na nossa UI
 */
const Arena = ({ characterNFT }) => {
  // estado
  const [gameContract, setGameContract] = useState(null);

  // UseEffects
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

      setGameContract(gameContract);
    } else {
      console.log("Ethereum object not found");
    }
  }, []);

  return (
    <div className="arena-container">
      {/* Boss */}
      <p>O Boss vai ficar aqui</p>

      {/* Personagem NFT */}
      <p>Seus NFTS vão ficar aqui</p>
    </div>
  );
};

export default Arena;
```

Agora que temos a base do nosso componente `arena` configurado e pronto, é hora de voltar para `App.js` e adicionar o cenário final para nosso método de renderização:

**Se o usuário tiver conectado com o app E tiver um personagem NFT - Mostre o componente `arena`.**

Tudo o que precisamos fazer é importar `Arena` e depois adicionar o `else/if` para a nossa função `renderContent`:

```javascript
import Arena from './Components/Arena';

...

const renderContent = () => {

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
          Connect Wallet To Get Started
        </button>
      </div>
    );
  } else if (currentAccount && !characterNFT) {
    return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
	/*
	* Se tiver uma carteira conectada e um personagem NFT, é hora de batalhar!
	*/
  } else if (currentAccount && characterNFT) {
    return <Arena characterNFT={characterNFT} />;
  }
};
```

**Nós agora cobrimos esses três cenários!** Nesse ponto, se você recarregar seu app você deve ser diretamente levado para o componente `Arena`, que deve parecer algo com isso:
![Untitled](https://i.imgur.com/ZvSFEpn.png)

Então para recapitular, até agora você:

- Tem uma carteira conectada no seu app
- Mintou um personagem NFT para essa carteira
- Está pronto para levar seu próprio **🔥 Boss 🔥**

### 😈 Buscando o Boss a partir do contrato inteligente.

No componente `SelectCharacter` nós configuramos uma maneira de buscar todos os personagens mintáveis a partir do nosso contrato. Bom, no componente `Arena` nós vamos fazer a mesma coisa, mas buscando nosso boss!

Na seu contrato em Solidity , você configurou uma função que busca o boss no seu contrato. Tudo que precisamos fazer é chamar essa função aqui e configurar nossos dados para mostrá-los na nossa UI. Isso vai ser exatamente a mesma coisa do que configurar o `SelectCharacter`, então vamos começar adicionando um estado de boss para o nosso componente e configurando outro `useEffect` para ouvir por mudanças no `gameContract`:

```javascript
// Estado
const [gameContract, setGameContract] = useState(null);
/*
 * Estado que vai segurar os metadados do boss
 */
const [boss, setBoss] = useState(null);

// UseEffects
useEffect(() => {
  /*
   * Configurando função async que vai pegar o bosso do nosso contrato e setar ele no estado
   */
  const fetchBoss = async () => {
    const bossTxn = await gameContract.getBigBoss();
    console.log("Boss:", bossTxn);
    setBoss(transformCharacterData(bossTxn));
  };

  if (gameContract) {
    /*
     * gameContract está pronto! Vamos buscar nosso boss
     */
    fetchBoss();
  }
}, [gameContract]);
```

Boa! Pra ter certeza que tudo está funcionando, recarregue seu app rapidamente e cheque o seu console. Se tudo estiver configurado corretamente, você deve ver os dados do seu boss:

![Untitled](https://i.imgur.com/0bQQgAR.png)

Capitão Nascimento chegou. Vamos em frente e configurar nosso componente para mostrar o Capitão Nascimento com toda sua glória.

### 🙀 Renderizando o grande Boss.

Aqui é onde a diversão começa 🤘. De novo, construir nossa UI é algo que você pode ser bem criativo. Enquanto eu dei toda a estilização necessária para começar, explore o CSS e faça algo que você **_AMA_** e mostre para seus amigos.

Muito bem, vamos começar adicionando algum HTML para nosso componente:

```javascript
return (
  <div className="arena-container">
    {/* Troque a sua boss UI por isso */}
    {boss && (
      <div className="boss-container">
        <div className={`boss-content`}>
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
      </div>
    )}

    {/* Personagem NFT */}
    <p>Seus NFTS vão ficar aqui</p>
  </div>
);
```

Você provavelmente vai ter um erro onde `runAttackAction` é undefined! Vamos adicionar um placeholder por isso embaixo do nosso estado para que possamos pelo menos ver como nossa UI vai se parecer. Vamos nos preocupar com essa lógica **#logo**:

```javascript
// Actions
const runAttackAction = async () => {};
```

Vá em frente e recarregue o app e você deve ver Capitão Nascimento, sua saúde e um botão para atacá-lo!

Essa é uma UI simples com uma estilização sólida. A parte boa é pegar todos os dados do nosso contrato inteligente:
![Untitled](https://i.imgur.com/gbmw11d.png)

### 🛡 Renderizando o personagem NFT.

Agora que podemos ver o boss, só faz sentido ver também o sue personagem NFT, certo? Isso vai ser basicamente a mesma coisa que configurar o boss, só com uma estilização diferente! Vamos lá:

```javascript
return (
  <div className="arena-container">
    {/* Boss */}
    {boss && (
      <div className="boss-container">
        <div className={`boss-content`}>
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
      </div>
    )}

    {/* Troque a UI de personagem por isso */}
    {characterNFT && (
      <div className="players-container">
        <div className="player-container">
          <h2>Your Character</h2>
          <div className="player">
            <div className="image-content">
              <h2>{characterNFT.name}</h2>
              <img
                src={characterNFT.imageURI}
                alt={`Character ${characterNFT.name}`}
              />
              <div className="health-bar">
                <progress value={characterNFT.hp} max={characterNFT.maxHp} />
                <p>{`${characterNFT.hp} / ${characterNFT.maxHp} HP`}</p>
              </div>
            </div>
            <div className="stats">
              <h4>{`⚔️ Attack Damage: ${characterNFT.attackDamage}`}</h4>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);
```

Você pode ver basicamente o mesmo tipo de layout que temos para nosso personagem NFT. Principais coisas para se notar nessa duas seções é que checamos para ter certeza que temos os dados antes de renderizá-los. Se não tivermos - o app vai crashar!

Seu app deve se parecer com isso:

![REVIEW - Untitled](https://i.imgur.com/xgC5Kzd.png)

Capitão Nascimento e Anitta estão prontos para uma batalha épica 🔥. Agora que temos nosso boss e o herói prontos, chegou a hora:

![Untitled](https://media.giphy.com/media/26wkP6n7c8fQJbhVS/giphy.gif)

### 💥 Atacando o Boss.

O grande objetivo do nosso jogo é derrotar o Boss no metaverso! Nós levamos em conta todo o dano de ataque que seu personagem NFT tem e a vida para cada jogador. O objetivo dessa seção é desferir um ataque em Capitão Nascimento e ver se ele desfere um em nós.

Se você lembra quando estávamos configurando a lógica de ataque no nosso contrato, nós testamos tudo. É hora de adicionar a lógica para a função `runAttackAction` que adicionamos mais cedo e outra variável de estado chamada `attackState`:

```javascript
// estado
const [gameContract, setGameContract] = useState(null);
const [boss, setBoss] = useState(null);
/*
 * Vamos usar isso para adicionar algumas animações durante ataques
 */
const [attackState, setAttackState] = useState("");

const runAttackAction = async () => {
  try {
    if (gameContract) {
      setAttackState("attacking");
      console.log("Attacking boss...");
      const attackTxn = await gameContract.attackBoss();
      await attackTxn.wait();
      console.log("attackTxn:", attackTxn);
      setAttackState("hit");
    }
  } catch (error) {
    console.error("Error attacking boss:", error);
    setAttackState("");
  }
};
```

**Fácil.** Como nas outras interações com o contrato, tudo que estamos fazendo é chamando a função que fizemos no nosso contrato! Algumas coisas para se lembrar sobre essa função:

- Nós sempre vamos acertar o boss com o nível do nosso dano de ataque
- O boss sempre vai nós acertar de volta com o dano de ataque dele
- Nós chamamos `attackTxn.wait()` aqui para dizer nossa UI para não fazer nada até que nossa transação seja minerada.

Em seções próximas, vamos falar mais sobre coonstruir noss RNG nos ataques!

Vamos falar um pouco sobre `setAttackState`. Como mencionado em cima, estamos usando isso para adicionar algumas animações enquanto os ataques ocorrem. Eu tive a ideia a partir do Pokemon Yellow para Gameboy Color.

Temos 3 estados diferentes:

- `attacking` - Quando estamos esperando que a transação termine
- `hit` - Quando desferimos um ataque ao boss
- `''` - Estado padrão quando não queremos que nada aconteça

Precisamos adicionar só mais uma peça para a nossa UI para tudo isso funcionar junto! Vá de volta para o seu HTML e vá para a seção do boss. Adicione `${attackState}` para a `div` com nome de classe `boss-content`.

```javascript
return (
  <div className="arena-container">
    {/* Boss */}
    {boss && (
      <div className="boss-container">
        {/* Adicionando attackState para o className! São só nomes de classe */}
        <div className={`boss-content ${attackState}`}>
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
      </div>
    )}
    ...
  </div>
);
```

Nós vamos adicionar dinamicamente esse nome de classe para a nossa `div` que vai aplicar novos estilos nele! Uma coisa para notar aqui é que você pode mudar o nome dos estados de ataque, mas tenha certeza de atualizar eles no arquivo `Arena.css` já que os nomes de classe são necessários para as animações funcionarem!

**Boa.** Devemos estar prontos para testar e desferir um ataque em Capitão Nascimento. Vá em frente e clique no botão de Ataque e veja o que acontece! Você deve ver algumas coisas:

1. O Metamask aparece para ter certeza que você quer confirmar a ação de ataque.
2. Você deve ver logs no seu console começando com "Attacking boss..."
3. Depois você deve ver o hash da transação uma vez que o ataque for completo
4. Durante esse tempo você deve ver algumas animações

![Untitled](https://i.imgur.com/WuT9ytY.png)

**Você acabou de desferir seu primeiro ataque no Capitão Nascimento 😲.** Mas espere um minuto, a vida do Capitão Nascimento e do Anitta não mudaram? Como nossos jogadores vão saber o que aconteceu? Você deve estar pensando no evento que fizemos antes no nosso contrato inteligente - você está certo! Isso é fácil, nós já fizemos isso! Vamos configurar um listener para ouvir ao evento de ataque:

```javascript
/*
* Nós vamos precisar atualizar nosso personagem NFT para passar setCharacterNFT aqui.
*/
const Arena = ({ characterNFT, setCharacterNFT }) => {

    ...

    // UseEffects
    useEffect(() => {
        const fetchBoss = async () => {
            const bossTxn = await gameContract.getBigBoss();
            console.log('Boss:', bossTxn);
            setBoss(transformCharacterData(bossTxn));
        };

        /*
        * Configura a lógica quando esse evento for disparado
        */
        const onAttackComplete = (newBossHp, newPlayerHp) => {
            const bossHp = newBossHp.toNumber();
            const playerHp = newPlayerHp.toNumber();

            console.log(`AttackComplete: Boss Hp: ${bossHp} Player Hp: ${playerHp}`);

            /*
            * Atualiza o hp do boss e do player
            */
            setBoss((prevState) => {
                return { ...prevState, hp: bossHp };
            });

            setCharacterNFT((prevState) => {
                return { ...prevState, hp: playerHp };
            });
        };

        if (gameContract) {
            fetchBoss();
            gameContract.on('AttackComplete', onAttackComplete);
        }

        /*
        * Tem certeza de limpar esse evento quando componente for removido
        */
        return () => {
            if (gameContract) {
                gameContract.off('AttackComplete', onAttackComplete);
            }
        }
    }, [gameContract]);
}
```

Não se esqueça de voltar ao `App.js` e passar a propriedade `setCharacterNFT` para seu componente Arena:

```javascript
<Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />
```

Isso deve parecer familiar para você! Nosso contrato vai retornar `newBossHp` e `newPlayerHp` o que vai então atualizar o estado do nosso boss e do personagem NFT. Vamos ver mais agora:

```javascript
setBoss((prevState) => {
  return { ...prevState, hp: bossHp };
});

setCharacterNFT((prevState) => {
  return { ...prevState, hp: playerHp };
});
```

No React, `useState` nos permite pegar o valor anterior do estado antes de setar um novo! Isso é muito útil porque tudo que queremos é sobrescrever a vida para cada personagem. A maneira de fazer isso é com algo chamado [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax). Eu não vou entrar muito a fundo nisso, mas saiba que faz uma cópia de todas as propriedades no nosso objeto.

Finalmente, nós precisamos só adicionar a propriedade `hp` e os novos valores. Já que isso é DEPOIS do spread, o JavaScript sabe sobrescrever o valor de HP atual com o novo. É isso.

Vamos tentar atacar o Capitão Nascimento novamente. Passe pelo seu mesmo setup e você deve ver agora as barras de vida do personagem atualizarem. Olhe seu console e você também verá seus dados escritos como isso:

![Untitled](https://i.imgur.com/3rPMyK6.png)

Você tem um jogo bem legítimo agora. Animações, vida e atualizações em tempo real. Capitão Nascimento é muito forte agora, pois ele matou o Anitta :(.
