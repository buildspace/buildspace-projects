A parte legal sobre o jogo? Nós mintamos NFTs de verdade que são usadas para jogar e toda a lógica do jogo acontece on-chain. Mais cedo nesse projeto, nós configuramos toda a lógica do nosso contrato inteligente. Agora é hora de interagir com ele.

### 🌊 O flow.

A primeira coisa que vamos começar é checar se o endereço da carteira conectada com o nosso app tem um personagem NFT. Se tiver, podemos ir em frente e pegar os metadados da NFT e usá-los para batalhar contra o boss no metaverso ⚔️.

Aqui está o flow de conseguir o nosso web app conectando com nosso contrato inteligente na Testnet Goerli:

1. Copie o endereço do último contrato que você fez deploy, e cole dentro do nosso web app.

2. Copie o último arquivo ABI, cole no nosso diretório do web app. (Depois vamos falar mais sobre oq ABI is).

3. Importe o [ethers.js](https://github.com/ethers-io/ethers.js) para nos ajudar a falar com nosso contrato inteligente a partir do cliente.

4. Chamar uma função no contrato inteligente para fazer alguma coisa!

Bem intuitivo, certo? Vamos nessa!

### 🏠 Pegando o endereço do último contrato inteligente.

Bem simples, esse é o endereço do contrato que fizemos deploy. Lembra que cada vez que você roda seu script `run.js`, seu console escreve o endereço de onde seu contrato vive? Precisamos desse endereço para conectar a UI com o nosso contrato inteligente. A blockchain tem milhões de contratos nela. Nosso cliente precisa desse endereço para saber com qual contrato ele vai se conectar.

Nós vamos usar esse endereço em múltiplos componentes, então, vamos fazer isso funcionar! Na raíz do seu projeto, embaixo de `src` vá em frente e crie um arquivo `constants.js` e adicione o seguinte código:

```javascript
const CONTRACT_ADDRESS = "ENDEREÇO_DO_SEU_CONTRATO";

export { CONTRACT_ADDRESS };
```

Então volte para o arquivo `App.js` e importe isto no topo do seu arquivo para ter acesso, assim:

```javascript
import { CONTRACT_ADDRESS } from "./constants";
```

### 📁 Pegandos o último arquivo ABI.

**Eu fiz um pequeno vídeo abaixo explicando as coisas sobre ABI:**

[VEJA O VÍDEO](https://www.loom.com/share/6aa1031ea502453d9b9e77733e4cbd3b)

**Por favor assista isso já que falo sobre coisas importantes (note que esse vídeo mostra esse processo acontecendo em outro projeto, mas o flow é o mesmo)**.

Quando você compilar seu contrato inteligente, o compilador devolverá vários arquivos necessários que nos deixam interagir com o contrato. Você pode achar esses arquivos na pasta `artifacts` localizada na raíz do seu projeto Solidity.

Nosso web app confia no arquivo ABI para saber como se comunicar com nosso contrato. Leia mais sobre isso [aqui](https://docs.soliditylang.org/en/v0.5.3/abi-spec.html).

Os conteúdos do nosso arquivo ABI pode ser encontrado em um arquivo JSON chique no seu projeto hardhat:

`artifacts/contracts/MyEpicGame.sol/MyEpicGame.json`

Então, a questão se torna - como conseguir o nosso arquivo JSON dentro do nosso frontend? A bom e velho método copiar e colar!

Copie os conteúdos dentro do seu arquivo `MyEpicGame.json` e vá para o nosso web app. Você vai criar uma nova pasta chamada `utils` dentro de `src`. Dentro de `utils` crie um arquivo novo `MyEpicGame.json`. O caminho completo ficará assim: `src/utils/MyEpicGame.json`

Cole o arquivo ABI dentro do nosso novo arquivo.

**BOA**. Agora que temos nosso arquivo configurado, precisamos importar dentro do nosso arquivo `App.js` para utilizá-lo! Simplesmente adicione isso no topo dos seus imports:

```javascript
import myEpicGame from "./utils/MyEpicGame.json";
```

**Nota: você pode precisar Parar (Stop) e depois Começar(Run) seu Replit depois de adicionar esse arquivo**. Algumas vezes ele não pega o novo arquivo!

Nós agora temos as duas coisas necessárias para chamar nosso contrato a partir do web app: **o arquivo ABI e o endereço do contrato que fizemos deploy**!

### 🧐 **Algumas notas em atualizar o contrato inteligente.**

Contratos que já foram feitos o deploy são permanentes. Você não pode mudá-los. A única maneira de atualizar um contrato e refazer o deploy.

Digamos que você queira mudar aleatoriamente seu contrat agora mesmo. Aqui está o que você precisaria fazer:

1. Refazer o deploy

2. Atualizar o endereço do contrato no frontend

3. Atualizar o arquivo abi no nosso frontend

**As pessoas esquecem constantemente de fazer esses 3 passos quando mudam seus contratos. Não esqueça.**

Por quê precisamos fazer tudo isso? Porque contratos inteligentes são **imutáveis.** Eles não podem mudar, eles são permanentes. Isso significa que mudar um contrato exige um redeploy completo. Fazer um redeploy também **reiniciaria** todas as variáveis já que serão tratadas como um novo contrato. **Isso significa que perdemos todos os dados das nossas NFTs quando atualizarmos o código do contrato.**

Então, o que você precisa fazer é isso:

1. Fazer o dpeloy de novo usando `npx hardhat run scripts/deploy.js --network goerli`

2. Mudar `contractAddress` em `constants.js` para ser o novo endereço do contrato que pegamos do passo acima no terminal (como fizemos antes da primeira vez que fizemos deploy).

3. Pegar o arquivo abi atualizado de `artifacts` e copiar e colar dentro do nosso web app como fizemos acima.

**De novo -- você precisa fazer isso toda vez que mudar o código do seu contrato, senão você terá erros :).**

### 📞 Chamando os contratos inteligentes com ethers.js.

Agora que temos tudo o que precisamos, nós podemos configurar um objeto em JavaScript para interagir com nosso contrato inteligente. Aqui é onde o [ethers.js](https://github.com/ethers-io/ethers.js) entra!

Importe o ethers dentro do seu arquivo `App.js`:

```javascript
import { ethers } from "ethers";
```

### 🌐 Cheque sua rede!

Nesse ponto é realmente importante ter certeza que você está conectada na rede de teste do Goerli com o Metamask! Se não, você vai estar tentando usar funções no contrato inteligente que não existem em outras redes, e isso pode causar erros no React como "Unhandled Rejection (Error): call revert exception." Algo que você pode adicionar no seu código React para manter as coisas certas é uma função que deixa você saber se estiver na rede errada! Coloque isso na função dentro do seu useEffect:

```javascript
const checkNetwork = async () => {
  try {
    if (window.ethereum.networkVersion !== "5") {
      alert("Please connect to Goerli!");
    }
  } catch (error) {
    console.log(error);
  }
};
```

Aqui está um passo a passo do que estamos fazendo aqui. Semelhante a como definimos `const { ethereum } = window` nós estamos usando `networkVersion` no objeto ethereum para checar qual rede ethereum nós estamos. As redes ethereum tem diferentes chain IDs, e o ID do Goerli é 5. Tudo que precisamos fazer é falar "se a atual rede ethereum não for o Goerli, alerte o usuário!" Agora a qualquer hora que a página não estiver carregado no Goerli você terá um aviso para seus usuários trocarem para o Goerli.

### Recapitulação

Nós fizemos bastante coisa, mas vamos ter certeza que estamos na mesma página aqui -

Nossa meta é chamar nosso contrato para checar se o endereço de carteira atual já mintou um personagem NFT. Se já tiver mintado, podemos mover o jogadore para a ⚔️ Arena. ⚔️ **SENÃO**, _precisamos que eles mintem um personagem NFT antes de jogar!_

Lembra quando criamos `checkIfUserHasNFT` no contrato inteligente?

Se o jogador mintou uma NFT, esse método irá retornar os metadados do personagem NFT. Senão, ele vai retornar uma estrutura `CharacterAttributes` vazia. Então - quando queremos chamar isso?

Se pensarmos de novo no cenário #2:

**Se o usuário conectou com o seu app E não tiver um personagem NFT, mostra o componente `SelectCharacter`.**

Isso significa que devemos provavelmente checar isso quando nosso app carregar, certo? Vamos configurar um outro `useEffect` para fazer algo chique aqui 💅:

```javascript
/*
 * Adicione esse useEffect logo embaixo do outro useEffect que você está chamando checkIfWalletIsConnected
 */
useEffect(() => {
  /*
   * A função que vamos chamar que interage com nosso contrato inteligente
   */
  const fetchNFTMetadata = async () => {
    console.log("Checking for Character NFT on address:", currentAccount);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const gameContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      myEpicGame.abi,
      signer
    );

    const txn = await gameContract.checkIfUserHasNFT();
    if (txn.name) {
      console.log("User has character NFT");
      setCharacterNFT(transformCharacterData(txn));
    } else {
      console.log("No character NFT found");
    }
  };

  /*
   * Nós so queremos rodar isso se tivermos uma wallet conectada
   */
  if (currentAccount) {
    console.log("CurrentAccount:", currentAccount);
    fetchNFTMetadata();
  }
}, [currentAccount]);
```

Isso é um pouco do React chique que eu estava falando antes. Você provavelmente também vai ter um erro falando como `transformCharacterData` é undefined :(. Continue - vamos resolver isso rapidamente:

```javascript
const fetchNFTMetadata = async () => {
  console.log("Checking for Character NFT on address:", currentAccount);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const gameContract = new ethers.Contract(
    CONTRACT_ADDRESS,
    myEpicGame.abi,
    signer
  );

  const txn = await gameContract.checkIfUserHasNFT();
  if (txn.name) {
    console.log("User has character NFT");
    setCharacterNFT(transformCharacterData(txn));
  } else {
    console.log("No character NFT found");
  }
};
```

Essa é a lógica principal usada para configurar nosso objeto Ethers e chamar nosso contrato 🚀. Um "Provedor" é o que usamos para falar com os nodes Ethereum. Lembra como estávamos usando o Alchemy para **fazer deploy?** Bom, nesse caso, nós usamos os nodes que o MetaMask provém no background para mandar/receber dados do nosso contrato que fizemos deploy.

Nós não vamos entrar muito em signers, mas [aqui está um link](https://docs.ethers.io/v5/api/signer/#signers) explicando o que é um signer!

```javascript
const gameContract = new ethers.Contract(
  CONTRACT_ADDRESS,
  myEpicGame.abi,
  signer
);

const txn = await gameContract.checkIfUserHasNFT();
```

Depois que criarmos nosso provedor e o signer, estamos prontos para criar nosso objeto do contrato! Essa linha é o que cria a conexão para o nosso contrato. Ele precisa: o endereço do contrato, o arquivo ABI e um signer. Essas são as três coisas que sempre precisamos para comunicar com os contratos na blockchain.

Com isso configurado, nós podemos finalmente chamar o método `checkIfUserHasNFT`. De novo, isso vai ir para o nosso contrato na blockchain e rodar um request de leitura e retornar dados para nós. **Podemos parar e ver quão legal é isso?** Você é um desenvolvedor blockchain agora 🔥!

Sinta-se livre para fazer `console.log(txn)` e vejo o que está nele!

```javascript
if (txn.name) {
  console.log("User has character NFT");
  setCharacterNFT(transformCharacterData(txn));
} else {
  console.log("No character NFT found!");
}
```

Uma vez que tivermos a resposta do nosso contrato, precisamos checar se existe um personagem NFT que foi mintado. Nós vamos fazer isso checando se tem um nome. Se tiver um nome para o personagem NFT, então saberemos que essa pessoa já tem uma!

Com isso, vamos configurar nosso estado `characterNFT` com esses dados para que possamos usá-lo no nosso app!

Agora é hora de endereçar aquele método `transformCharacterData` que estamos chamando. Já que vamos estar pegando os dados do personagem em outros lugares do nosso app, porque nós iríamos querer escrever código de novo e de novo? Vamos deixar um pouco chique.

Podemos nos livrar do erro undefined fazendo com que o arquivo `constants.js` que criamos segure o endereço do nosso contrato e adicionando o seguinte:

```javascript
const CONTRACT_ADDRESS = "ENDEREÇO_DO_CONTRATO";

/*
 * Adicione esse método e tenha certeza de exportá-lo no final!
 */
const transformCharacterData = (characterData) => {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp.toNumber(),
    maxHp: characterData.maxHp.toNumber(),
    attackDamage: characterData.attackDamage.toNumber(),
  };
};

export { CONTRACT_ADDRESS, transformCharacterData };
```

Agora, para o final desse pequeno código do snippet abaixo:

```javascript
if (currentAccount) {
  console.log("CurrentAccount:", currentAccount);
  fetchNFTMetadata();
}
```

Lembre-se nós só queremos chamar essa função se tivermos um endereço de carteira conectada! Nós não podemos fazer nada se não tiver nenhum endereço de carteira, certo? Qualquer hora que `useEffect` roda, tenha certeza que temos um endereço de carteira conectada. Senão, não rode nada.

```javascript
useEffect(() => {
	...
}, [currentAccount]);
```

Bom, o que diabos é essa `[currentAccount]`? É o endereço público da carteira que pegamos do Metamask. **Qualquer hora que o valor de `currentAccount` muda, esse `useEffect` será disparado!** Por exemplo, quando `currentAccount` muda de `null` para um endereço novo de carteira, essa lógica rodaria.

Pesquise um pouco e [cheque esse link](https://reactjs.org/docs/hooks-effect.html) das docs do React para aprender mais.

### ⭕️ Trazendo o círculo inteiro.

Todas as coisas estão no lugar. Você está se sentindo bem e é um engenheiro insanamente talentoso. Então vamos testar isso, sim?

Recarregue o seu app e tenha certeza que você não tenha uma carteira conectada ainda. Aí, vá em frente e conecte sua carteira. Tenha certeza de que você abra o console para que possa ver os logs entrando!

Recarregue a página. Nesse ponto, você deve ver seu console devolver: `No character NFT found` . Boa! Isso significa que seu código está rodando corretamente e que você está pronto para mintar personagens NFT 🤘!