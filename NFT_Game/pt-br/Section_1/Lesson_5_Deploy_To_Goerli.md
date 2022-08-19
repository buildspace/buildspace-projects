### **🎉 Colocando nossas NFTs online.**

Quando usamos  `run.js`, só está funcionando localmente.

O próximo passo é uma testnet, que você pode pensar como ambiente de desenvolvimento, de teste. Quando fizermos o deploy para uma testnet, estaremos aptos a  **ver a nossa NFT online** e a mais um passo de conseguir  **usuários reais.**

### 🦊 Metamask

Depois, precisamos de uma carteira Ethereum. Existem várias, mas, para esse projeto, vamos usar a Metamask. Baixe a extensão de navegador e configure sua carteira  [aqui](https://metamask.io/download.html). Mesmo se você tiver outra carteira, só use a Metamask por agora.

Por quê precisamos da Metamask? Bom. Precisamos estar aptos a chamar funções no nosso contrato inteligente que vive na blockchain. E, para fazer isso, precisamos ter uma carteira que tem nosso endereço Ethereum e chave privada.

**Mas, precisamos de algo para conectar o nosso site com a nossa carteira para que possamos passar nossas credenciais de carteira para o site de maneira segura, para que o site possa usar essas credenciais para chamar nosso contrato inteligente. Você precisa ter credenciais válidas para acessar funções nos contratos inteligentes.**

É quase como autenticação. Precisamos de algo para fazer "login" na blockchain e depois usar essas credenciais para fazer requisições na API pelo nosso site.

Então, vá em frente e configure! O fluxo de setup deles é bem autoexplicativo :).

### **💳 Transações**

Então, quando nós quisermos realizar uma ação que mude a blockchain, nós chamamos isso de _transação_. Por exemplo, mandar ETH para alguém é uma transação porque estamos mudando o saldo das contas. Fazer algo que atualiza uma variável no nosso contrato também é considerado uma transação porque estamos mudando dados. Mintar uma NFT é uma transação porque estamos salvando dados no contrato.

**Implementando (deploying) um contrato inteligente também é uma transação.**

Lembre-se, a blockchain não tem dono. É só um monte de computadores ao redor do mundo rodando através de **mineradores** que tem a cópia da blockchain.

Quando implementarmos nosso contrato, nós precisamos falar **para todos esses** mineradores, "ei, esse é um contrato inteligente novo, por favor adicione meu contrato inteligente à blockchain e diga para todo mundo sobre ele também".

Aqui é onde o [Alchemy](https://alchemy.com/?r=jQ3MDMxMzUyMDU3N) entra.

Alchemy essencialmente nos ajuda a transmitir a criação do nosso contrato para que ele possa ser pego pelos mineradores o mais rápido possível. Uma vez que a transação for minerada (validada), será então transmitida para a blockchain como uma transação legítima. A partir daí, todo mundo atualiza suas cópias da blockchain.

Isso é complicado. E, não se preocupe se você não entendeu completamente. Enquanto você escrever mais código e construir esse app, vai fazer mais sentido naturalmente.

Então, crie uma conta com o Alchemy [aqui](https://alchemy.com/?r=jQ3MDMxMzUyMDU3N).

E depois dê uma olhada no meu vídeo abaixo:
[Loom](https://www.loom.com/share/35aabe54c3294ef88145a03c311f1933)

## 🕸 Testnets

Nós não vamos estar implantando (deploying) diretamente na rede principal do Ethereum (Ethereum mainnet) por enquanto. Por quê? Porque custa dinheiro real e não vale a pena bagunçar as coisas. Nós estamos apenas aprendendo nesse momento. Nós vamos começar com uma "tesnet" (rede de teste) que é um clone da mainnet, mas usa dinheiro falso para que possamos testar coisas o quanto quisermos. Mas, é importante saber que testnets são mantidas por minerados e cenários mímicos de mundo real.

Isso é incrível porque podemos testar nossa aplicação num cenário de mundo real, onde vamos fazer algumas coisas:

1. Transmitir nossa transação

2. Esperar ela ser escolhida por mineradores

3. Esperar ela ser minerada

4. Esperar ela ser transmitida de volta para a blockchain dizendo para todos os outros minerados para atualizarem suas cópias.

## 🤑 Pegando um pouco de dinheiro falso

Existem algumas testnets por aí, e a que usaremos é chamada "Goerli".

Para poder fazer deploy na Goerli, precisamos de ETH falso. Por quê? Porque se estivéssemos fazendo deploy na mainnet Ethereum, você usaria dinheiro real! Por isso, testnets copiam como a mainnet funciona, a única diferença é que não tem dinheiro real envolvido.

Para conseguirmos ETH falso, precisamos pedir alguns para a rede. **Esse ETH falso só vai funcionar nessa testnet específica.** Você pode conseguir alguns Ethereum falsos para o Goerli por um faucet. Você só precisa achar algum que funcione.

Você tem alguns faucets para escolher:

| Nome | Link
| ---------------- | --------------------------
| Alchemy | https://goerlifaucet.com/ 
| Mudit | https://goerli-faucet.mudit.blog/ 
| Paradigm | https://faucet.paradigm.xyz/ 

Nota: para o MyCrypto, você vai ter que conectar sua carteira, criar uma conta e clicar no mesmo link **de novo** para pedir fundos. O faucet do buildspace é bem confiável também, só tenha certeza que o seu Metamask estiver na rede Goerli :).

## 🚀 Configurar um arquivo deploy.js

É boa prática separar o seu script para deploy do seu script `run.js`. `run.js` é onde podemos bagunçar as coisas, então queremos manter separado. Vá em frente e crie um arquivo chamado `deploy.js` dentro do folder `scripts`. Copie e cole todo o código de `run.js` dentro de `deploy.js`. Por enquanto, será exatamente a mesma coisa.

Eu adicionei algumas chamadas a mais para `mintCharacterNFT` também só para testar as coisas!

```javascript
const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory("MyEpicGame");
  const gameContract = await gameContractFactory.deploy(
    ["Anitta", "Ronaldinho Gaúcho", "Zeca Pagodinho"],
		[
          "https://i.imgur.com/gC5qXsl.png",
          "https://i.imgur.com/0PvxtwP.png",
          "https://i.imgur.com/Pj8lHpM.png",
		],
    [100, 200, 300],
    [100, 50, 25]
  );
  await gameContract.deployed();
  console.log("Contrato implantado no endereço:", gameContract.address)

  let txn;
  txn = await gameContract.mintCharacterNFT(0);
  await txn.wait();
  console.log("Mintou NFT #1");

  txn = await gameContract.mintCharacterNFT(1);
  await txn.wait();
  console.log("Mintou NFT #2");

  txn = await gameContract.mintCharacterNFT(2);
  await txn.wait();
  console.log("Mintou NFT #3");

  txn = await gameContract.mintCharacterNFT(1);
  await txn.wait();
  console.log("Minted NFT #4");

  console.log("Fim do deploy e mint!");
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

## **📈 Fazer o deploy para a testnet Goerli.**

Nós vamos precisar mudar nosso arquivo `hardhat.config.js` . Você pode encontrá-lo na raíz do diretório do projeto do seu contrato inteligente.

```javascript
require("@nomiclabs/hardhat-waffle");
module.exports = {
  solidity: "0.8.4",
  networks: {
    goerli: {
      url: "SEU_URL_DA_API_ALCHEMY",
      accounts: ["SUA_KEY_PRIVADA_DA_CONTA_GOERLI"],
    },
  },
};
```

Você pode conseguir URL da sua API no dashboard do Alchemy e colar ali mesmo. Depois, você vai precisar da sua chave **privada** do Goerli (não o seu endereço público!) o qual você pode [pegar no metamask](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key) e colar ali também.

**Nota: NÃO FAÇA COMMIT DESSE ARQUIVO NO GITHUB. ELE CONTÉM SUA CHAVE PRIVADA. VOCÊ PODE SER ROUBADO E HACKEADO. ESSA CHAVE PRIVADA É A MESMA QUE A DA MAINNET.** Nós vamos falar sobre variáveis `.env` depois e como mantê-las em segredo.

Por quê você precisa dessa chave privada? Porque para realizar uma transação, como fazer deploy de um contrato, você precisa "logar" na blockchain e assinar / fazer deploy do contrato. E, o seu nome de usuário é o seu endereço público, e sua senha é sua chave privada. É como fazer login na AWS ou GCP para fazer deploy.

Uma vez que você configurou o seu setup, estamos prontos para fazer o deploy com o script que escrevemos mais cedo.

Rode esse comando pela raíz do seu diretório `epic-nfts`.

```bash
npx hardhat run scripts/deploy.js --network goerli
```

Aqui está o que eu consigo:

```plaintext
Contrato implantado no endereço: 0x067f2Ac969091c285BcC1e537EC748aEdD779F02
Mintou NFT #1
Mintou NFT #2
Mintou NFT #3
Minted NFT #4
Fim do deploy e mint!
```

Podemos ter certeza que tudo funcionou corretamente usando o [Goerli Etherscan](https://goerli.etherscan.io/) onde você copiar e colar o endereço do contrato que foi o output para ver o que aconteceu com ele. Aqui eu posso ver que tivemos **cinco** transações. **Uma** transação de criação de contrato e **quatro** transações onde mintamos NFT. Isso está certo :).

![Untitled](https://i.imgur.com/hJtoYRp.png)

**Se acostume a usar muito o Etherscan do Goerli para debugar os deploys** porque é a maneira mais fácil de acompanhar os deployments e se algo der errado. Se não estiver mostrando no Etherscan, isso significa que está ou processando ou algo deu errado. Isso é o que eu consigo:

Se funcionou - **INCRÍVEL VOCÊ ACABOU DE FAZER DEPLOY DE UM CONTRATO E MINTOU NFTS!!**

### **🌊 Ver no OpenSea**

Acredite ou não. As NFTs que você acabou de mintar vão estar no site do OpenSea Tesnet.

Vá para [REVIEW - testnets.opensea.io](https://testnets.opensea.io/). Ali, procure pelo endereço do seu contrato que é o endereço que você vai encontrar no seu terminal. **Não clique enter na barra de pesquia**. OpenSea é estranho então você vai ter que clicar na coleção quando aparecer.

Então aqui, você clicaria "Heroes -" dentro de "Collections", e boom, você veria as NFTs que mintou!!

![REVIEW - Untitled](https://i.imgur.com/9ULR2OW.png)

![REVIEW - Untitled](https://i.imgur.com/F9xQHFE.png)

**BOOM! AÍ ESTÃO MEUS PERSONAGENS!!** Se você clicar em um dos seus personagens, vai poder clicar em "**Levels**" na esquerda e até ver os atributos específicos! **Nós até temos uma barrinha de vida!! ÉPICO!!! Cada barra de vida é diferente dependendo da NFT**, por exemplo o Zeca Pagodinho tem 300 de HP e o Anitta tem apenas 100!

Por exemplo:

![REVIEW - Untitled](https://i.imgur.com/8lry1nA.png)

![REVIEW - Untitled](https://i.imgur.com/mbMf8CI.png)

Nesse caso, o OpenSea renderizou todos os atributos dos personagens eficientemente!

O que é legal aqui é que se nós trocarmos o valor do HP da NFT do jogador para `150` ou qualquer valor, ele mudaria e atualizaria no OpenSea! **Isso é super legal porque a NFT segura dinamicamente o estado do personagem :).** Nós não precisamos de nenhum servidor centralizado para segurar aqueles dados.

Isso é incrível porque agora quando nossos jogadores forem jogar o jogo e nós detectarmos sua NFT, vamos saber exatamente qual o estado do personagem da NFT dele no jogo!

_Nota: você vai perceber que nós mintamos 4 NFTs para a mesma carteira nesse caso - isso **não seria** permitido no nosso jogo porque cada jogador estaria permitido a ter apenas 1 NFT. Eu só queria testar. Também, nesse momento `nftHolders` pode apenas segurar um `tokenId` por endereço único. Então, cada vez que uma nova NFT é mintada para o mesmo endereço, o `tokenId` anterior é sobrescrito. Você poderiar retornar um erro se quisesse ao invés disso._

### **🙀 "Ajuda, minhas NFTs não estão mostrando no OpenSea!"**

**Se suas NFTs não estiverem aparecendo no OpenSea** - espere alguns minutos, as vezes o OpenSea pode levar até 5 minutos. Aqui vai meu conselho, se já fazem mais de 5 minutos e seus metadados ainda se parecem com isso:

![Untitled](https://i.imgur.com/dVACrDl.png)

**Use o Rarible ao invés do OpenSea.** Rarible é outro marketplace NFT como o OpenSea. Aqui está como configurá-lo:

1. Vá para `goerli.rarible.com`.
2. Crie esse URL: `https://goerli.rarible.com/token/INSIRA_O_ENDEREÇO_DO_CONTRATO_AQUI:INSIRA_O_TOKEN_ID_AQUI.`

Por exemplo, esse é o meu link:

```plaintext
https://goerli.rarible.com/token/0xcec8593c046364f163926a4327dfce6f546d9f98:4
```

Esse é a NFT do Zeca Pagodinho!! Meu `tokenId` é `4` porque foi o quarto mint feito daquele contrato. Sinta-se livre para tentar colocar outros Ids.

**Basicamente, se você não vir sua NFT no OpenSea dentro de alguns minutos, tente o Rarible para ter certeza que está funcionando.**

### 🤯 Porque isso é épico?

Vale a pena falar sobre o porque o que você acabou de fazer é grande coisa.

Basicamente, você criou uma NFT. Então, isso já é legal. As pessoas podem possuir um personagem do seu jogo em suas carteiras, yay!

Mas, essas NFTs tem atributos também! Como ataque, vida, mana ou qualquer coisa que você adicionou. Então, isso significa que a NFT é mais do que só um JPG - tem outros elementos que a fazem mais interativa.

O maior jogo NFT do mundo, Axie Infinity, funciona assim também. É um jogo baseado em turnos, estilo Pokemon onde você luta contra outros players 1v1.

Aqui o que um dos personagens NFT deles se parece:

![Untitled](https://i.imgur.com/FIJmmbL.png)

[Aqui](https://opensea.io/assets/0xf5b0a3efb8e8e4c201e2a935f110eaaf3ffecb8d/78852) é no OpenSea. **Cheque todos diferentes atributos ele tem em propriedades, níveis, etc.** Fique inspirado :) Todos esses atributos afetam em como o personagem joga o jogo!

O que vamos fazer depois é que vamos programar a lógica do nosso jogo para lutar com um boss em nosso jogo. Então, isso significa que os jogadores estarão aptos a levar suas NFTs para a **arena** e colaborar com outros jogadores para atacar um boss que vamos criar! Quando uma NFT ataca o boss, o boss pode atacar a NFT de volta e a NFT do jogador **perderá vida**. O valor da Vida no OpenSea mudaria :).

Quase como Pokemon!

Isso significa que nossa NFT terá _utilidade_ além de ser apenas algo de se olhar.

Isso é bem incrível. Em jogos normais hoje em dia, você compraria um jogo e escolheria um personagem (como em Super Smash Brothers).

![Untitled](https://i.imgur.com/BTI8Qhp.png)

**Nesse caso, os jogadores escolhem suas NFTs, jogam com ela in-game, e possuem aquele personagem em sua carteira para sempre ou até eles venderem para outro jogador.** O aspecto de vender é extremamente interessante, porque isso significa que o jogador ganha algo de volta por jogar o jogo e ajuda a incrementar a popularidade.

Outra coisa interessante é que os jogadores estariam aptos a levar seus personagens NFT para outros jogos que o suportam.

_Isso é muito louco de se pensar. É um dos grandes motivos de crypto + jogos serem tão legais._

Lembra do exemplo da NFT do Mario, onde os outros podem construir em cima do Mario? Mesma coisa aqui com nossos personagens NFT!

Por exemplo, digamos que eu tenho 100,000 pessoas que mintaram meu Zeca Pagodinho NFT para o meu jogo. Agora, existem 100,000 jogadores únicos que possuem essa NFT.

Outro desenvolvedor pode vir e construir outro jogo em cima da NFT Zeca Pagodinho e permitir que qualquer jogador que tenha a NFT possa entrar no seu jogo e jogá-lo! Eles poderiam fazer com que qualquer um com a NFT do Zeca Pagodinho possa usá-lo como personagem em seus jogos. Eles que decidem.

_Nota: nesse caso, os criadores de Pokemon podem ficar brabos. Mas imagine o Zeca Pagodinho como seu personagem original!_

Talvez coisas como HP e dano de ataque são até compartilhados entre jogos, significando que diferentes jogos podem usar os atributos originais que criamos.

Por exemplo, digamos que nós temos outros devs construindo itens em cima dos nossos personagens NFT - como espadas, escudos, poções e etc. Talvez um dev construa algo onde um personagem NFT possa equipar um escudo e ganhar +50 de defesa. Isso pode ser feito em um jeito aberto e sem permissão :).

Em cima disso, como o criador das NFTs originais do Zeca Pagodinho - eu posso cobrar uma taxa royalty toda vez que alguém compre ou venda a NFT original e isso significa que quanto mais popular a NFT, mais dinheiro eu faria por venda.

Ok - vamos programar a lógica do jogo.

### 🚨 Reporte seu Progresso !
*Por favor, faça isso se não o yanluiz vai ficar triste :(*

Poste uma screenshot em #progresso dos seus NFTs épicos no OpenSea. Faça um tweet sobre isso, espalhe pro mundo o que você fez, foi incrível! Marque a @Web3dev_ no twitter que a gente retweeta para você. Adoramos quando as pessoas interagem pelo twitter, é como uma dose de dopamina e motivação. Além do mais o seu tweet pode ajudar a divulgar a comunidade e a web3 para o mundo!
