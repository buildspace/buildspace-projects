_Nota: essa lição é um pouco mais longa do que as outras!_

Agora que todos os nossos scripts estão funcionando e fizemos o básico, vamos mintar algumas NFTs! Assim que o meu arquivo `MyEpicNft.sol` atualizado se parece:

```solidity
pragma solidity ^0.8.1;
// Primeiro importamos alguns contratos do OpenZeppelin.
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";
// Nós herdamos o contrato que importamos. Isso significa que
// teremos acesso aos métodos do contrato herdado.
contract MyEpicNFT is ERC721URIStorage {
    // Mágica dada pelo OpenZeppelin para nos ajudar a observar os tokenIds.
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    // Nós precisamos passar o nome do nosso token NFT e o símbolo dele.
    constructor() ERC721 ("SquareNFT", "SQUARE"){
      console.log("Esse eh meu contrato de NFT! Tchu-hu");
    }
    // Uma função que o nosso usuário irá chamar para pegar sua NFT.
    function makeAnEpicNFT() public {
        // Pega o tokenId atual, que começa por 0.
        uint256 newItemId = _tokenIds.current();
        // Minta ("cunha") o NFT para o sender (quem ativa o contrato) usando msg.sender.
        _safeMint(msg.sender, newItemId);
        // Designa os dados do NFT.
        _setTokenURI(newItemId, "blah");
        // Incrementa o contador para quando o próximo NFT for mintado.
        _tokenIds.increment();
    }
}
```

Várias coisas estão acontecendo aqui. Primeiro você vai ver que eu "herdei" um contrato do OpenZeppelin usando `is ERC721URIStorage` quando eu declaro o contrato. Você pode ler mais sobre herança [aqui](https://solidity.web3dev.com.br/exemplos/linguagem-v0.8.3/heranca) e [aqui](https://www.web3dev.com.br/fatimalima/heranca-em-smart-contracts-com-uso-da-metodologia-orientada-a-objetos-28fa), mas basicamente, significa que podemos chamar outros contratos a partir do nosso. É quase como importar funções para usarmos!

O padrão NFT é conhecido como `ERC721`, o qual você pode ler um pouco sobre [aqui](https://www.web3dev.com.br/lorenzobattistela/erc20-vs-erc721-vs-erc-1155-36la) e [aqui](https://eips.ethereum.org/EIPS/eip-721). O OpenZeppelin essencialmente implementa o padrão NFT para nós e deixa escrevermos nossa própria lógica e customizá-la em cima disso. Isso significa que não precisamos escrever código repetido.

Eu seria louco de escrever um servidor HTTP do zero sem usar uma library, certo? Claro, a não ser que você quisesse explorar. Mas nós só queremos levantar e correr aqui.

De maneira semelhante - seria loucura escrever um contrato NFT totalmente do zero. Você pode explorar o contrato `ERC721` que estamos herdando [daqui](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol).

Vamos olhar passo a passo a função `makeAnEpicNFT`.

```solidity
uint256 newItemId = _tokenIds.current();
```

Mas o que diabos é `_tokenIds`? Bom, lembra do exemplo do Picasso? Ele tinha 100 esboços NFT nomeados Esboço #1, Esboço #2, Esboço #3, etc. Esses eram os identificadores únicos.

A mesma coisa acontece aqui, estamos usando `_tokenIds` para observar os identificadores únicos das NFTs, e é só um número! É automaticamente inicializado para 0 quando declaramos `private _tokenIds`. Então, quando chamamos `makeAnEpicNFT`, `newItemId` é 0. Quando rodamos de novo, `newItemId` será 1, e assim por diante.

`_tokenIds` é uma **variável de estado (state variable)**, o que significa que se a mudarmos, o valor vai ser guardado diretamente no contrato.

```solidity
_safeMint(msg.sender, newItemId);
```

Quando fazemos `_safeMint(msg.sender, newItemId);`, está basicamente dizendo: "minte a NFT com o id `newItemId` para o usuário com o endereço `msg.sender`". Aqui, `msg.sender` é uma variável que o [Solidity dispõe](https://solidity.web3dev.com.br/apostila/variaveis-built-in-msg.sender-msg.value...) que nos dá fácil acesso ao **endereço público** da pessoa que chamou o contrato.

O que é incrível aqui é que essa é uma **maneira super segura de conseguir o endereço público do usuário**. Manter o endereço público um segredo não é um problema, porque ele já é público!! Todo mundo pode ver. Mas, usando `msg.sender`, você não pode "fingir" o endereço público de alguém a não ser que você tenha as credenciais da carteira da pessoa e chame o contrato ao invés do dono.

**Você não pode chamar um contrato anonimamente.**, você precisa ter as credenciais da sua carteira conectadas. É quase como fazer "login" e ser autenticado.

```solidity
_setTokenURI(newItemId, "blah");
```

Por fim, rodamos `_setTokenURI(newItemId, "blah");`, que define o identificador único da NFT juntamento com os dados associados com o identificador único. É literalmente nós configurando os dados que fazem a NFT valiosa. Nesse caso, estamos definindo como "blah", o qual... não é tão valioso ;). Também não está seguindo o padrão do `ERC721`. Vamos entrar em mais detalhes sobre `tokenURI` daqui a pouco.

```solidity
_tokenIds.increment();
```

Depois que NFT é mintada, nós incrementamos `tokenIds` usando `_tokenIds.increment()` (que é uma função que o OpenZeppelin nos dá). Isso certifica que da próxima vez que uma NFT for mintada, vai ter um diferente `tokenIds` identificador. Ninguém pode ter um `tokenIds` que já tenha sido mintado.

## 🎟 `tokenURI` e rodando localmente.

O `tokenURI` é onde os dados da NFT vivem. E geralmente **liga** para um arquivo JSON chamado `metadata``que parece com algo assim:
```bash
{
    "name": "Meu Amigo Chaves",
    "description": "Um grande herói e comedor de sanduíches de presunto.",
    "image": "https://i.imgur.com/3l8uo2p.png"
}
```

Você pode customizar isso, mas quase toda NFT tem um nome, uma descrição e um link para alguma coisa como um vídeo, uma imagem, etc. Pode ter inclusive atributos customizados! Tenha cuidado com a estrutura dos seus metadados, se sua estrutura não coincidir com os [requerimentos OpenSea](https://docs.opensea.io/docs/metadata-standards) sua NFT vai aparecer "quebrada" no site.

Isso faz parte dos padrões `ERC721` e permite que as pessoas construam site em cima dos dados das NFTs. Por exemplo, o [OpenSea](https://opensea.io/assets) é um marketplace de NFTs. E, toda NFT no OpenSea segue o padrão de metadata `ERC721` que deixa mais fácil para as pessoas comprarem e venderem NFTs. Imagine se todo mundo seguisse os próprios padrões e estruturassem suas metadatas como quisessem, seria um caos!

Nós podemos copiar o metadado `Meu Amigo Chaves` acima e colar dentro [desse](https://jsonkeeper.com/) site. Esse site é um lugar fácil para hostear dados JSON e nós vamos usá-lo para manter os dados da nossa NFT por agora. Uma vez que você clicar em "Salvar" você vai ter um link para o arquivo JSON. (Por exemplo, o meu é [`https://jsonkeeper.com/b/9WB6`](https://jsonkeeper.com/b/9WB6)). Lembre-se de testar o seu link e tenha certeza que tudo esteja bem!

**Nota: Eu amaria que você criasse o metadata JSON ao invés de só copiar o meu. Use sua própria imagem, nome e descrição. Talvez você queira sua NFT com a imagem de seu personagem favorito de anime, banda favorita, qualquer coisa!! Faça-o customizado. Não se preocupe, vamos poder mudar isso no futuro!**

Se você decidir usar sua própria imagem, tenha certeza que o URL leve diretamente para a imagem, e não para o site que hospeda a imagem! Links diretos do Imgur parecem com isso `https://i.imgur.com/123123.png` e NÃO `https://imgur.com/gallery/123123`. A maneira mais fácil de checar é ver se o URL termina com uma extensão de imagem como `.png` ou `.jpg`. Você pode clicar com o botão direito na imagem do imgur e "copiar o link da imagem". Isso vai te dar o URL correto.

Agora, vamos pro nosso contrato inteligente e mudar uma linha. Ao invés de:

```solidity
_setTokenURI(newItemId, "blah")
```

Nós vamos setar o URI para o link do nosso arquivo JSON.

```solidity
_setTokenURI(newItemId, "INSIRA A URL DO SEU JSON AQUI");
```

Embaixo dessa linha, também podemos adicionar um `console.log` para nos ajudar a ver qual NFT foi mintada e para quem!

```solidity
console.log("Uma NFT com o ID %s foi mintada para %s", newItemId, msg.sender);
```

## 🎉 Minte uma NFT localmente

A partir daqui, tudo que precisamos fazer é mudar nosso arquivo `run.js` para chamar nossa função `makeAnEpicNFT()`. Isso é tudo que precisamos fazer:

```javascript
const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory("MyEpicNFT");
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log("Contrato implantado em:", nftContract.address)
  // Chama a função.
  let txn = await nftContract.makeAnEpicNFT();
  // Espera ela ser minerada.
  await txn.wait();
  // Minta outra NFT por diversão.
  txn = await nftContract.makeAnEpicNFT();
  // Espera ela ser minerada.
  await txn.wait();
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

Quando eu rodo isso usando:

```bash
npx hardhat run scripts/run.js
```

Aqui está o resultado:

![Imagem log console](https://i.imgur.com/Xj9zMx6.png)

Boom! Nós acabamos de mintar uma NFT com id `0` localmente para nós mesmos! Então, sabemos que o código está funcionando e nada está crashando. Incrível. Você sempre vai querer usar `run.js` para ter certeza que as coisas estão funcionando localmente e sem crashar. É o nosso pequeno playground!

A partir de agora, toda vez que alguém mintar uma NFT com essa função, será sempre a mesma NFT - `Meu Amigo Chaves`! Nós vamos aprender nas seções daqui pra frente como mudar isso para que cada pessoa que minte uma NFT obterá uma NFT aleatória e única.

Agora, vamos para o próximo passo - implementar em uma testnet :).

## 🎉 Implantar no Rinkeby e ver no OpenSea

Quando usamos `run.js`, somos apenas nós trabalhando localmente.

O próximo passo é uma testnet, a qual você pode pensar como um ambiente de "testes", de "encenação". Quando nós implementarmos (deploy) em uma testnet, vamos estar habilitados a **ver nossa NFT online** e estamos um passo mais próximo de levar isso para **usuários reais**.

## 💳 Transações

Então, quando nós quisermos performar uma ação que mude a blockchain, nós chamamos isso de  *transaction*. Por exemplo, mandar ETH para alguém é uma transação porque estamos mudando o saldo das contas. Fazer algo que atualiza uma variável no nosso contrato também é considerado uma transação porque estamos mudando dados. Mintar uma NFT é uma transação porque estamos salvando dados no contrato.

**Implementando (deploying) um contrato inteligente também é uma transação.**

Lembre-se, a blockchain não tem dono. É só um monte de computadores ao redor do mundo rodando através de **mineradores** que tem a cópia da blockchain.

Quando implementarmos nosso contrato,  nós precisamos falar **para todos esses** mineradores, "ei, esse é um contrato inteligente novo, por favor adicione meu contrato inteligente à blockchain e diga para todo mundo sobre ele também".

Aqui é onde o [Alchemy](https://alchemy.com/) entra.

Alchemy essencialmente nos ajuda a transmitir a criação do nosso contrato para que ele possa ser pego pelos mineradores o mais rápido possível. Uma vez que a transação for minerada (validada), será então transmitida para a blockchain como uma transação legítima. A partir daí, todo mundo atualiza suas cópias da blockchain.

Isso é complicado. E, não se preocupe se você não entendeu completamente. Enquanto você escrever mais código e construir esse app, vai fazer mais sentido naturalmente.

Então, se você não tiver, crie uma conta com o Alchemy [aqui](https://alchemy.com/).

E depois dê uma olhada no meu vídeo abaixo para aprender como pegar sua API key para uma testnet:
[Loom](https://www.loom.com/share/35aabe54c3294ef88145a03c311f1933?t=0)
)

## 🕸 Testnets

Nós não vamos estar implantando (deploying) diretamente na rede principal do Ethereum (Ethereum mainnet) por enquanto. Por quê? Porque custa dinheiro real e não vale a pena bagunçar as coisas. Nós estamos apenas aprendendo nesse momento. Nós vamos começar com uma "tesnet" (rede de teste) que é um clone da mainnet, mas usa dinheiro falso para que possamos testar coisas o quanto quisermos. Mas, é importante saber que testnets são mantidas por mineradores e cenários mímicos de mundo real.

Isso é incrível porque podemos testar nossa aplicação num cenário de mundo real, onde vamos fazer algumas coisas:

1. Transmitir nossa transação

2. Esperar ela ser escolhida por mineradores

3. Esperar ela ser minerada

4. Esperar ela ser transmitida de volta para a blockchain dizendo para todos os outros mineradores para atualizarem suas cópias.

## 🤑 Pegando um pouco de dinheiro falso

Existem algumas testnets por aí, e a que usaremos é chamada "Rinkeby", e ela é rodada pela fundação Ethereum.

Para poder fazer deploy na Rinkeby, precisamos de ETH falso. Por quê? Porque se estivéssemos fazendo deploy na mainnet Ethereum, você usaria dinheiro real! Por isso, testnets copiam como a mainnet funciona, a única diferença é que não tem dinheiro real envolvido.

Para conseguirmos ETH falso, precisamos pedir alguns para a rede. **Esse ETH falso só vai funcionar nessa testnet específica.** Você pode conseguir alguns Ethereum falsos para o Rinkeby por um faucet. Você só precisa achar algum que funcione.

Para o MyCrypto, você vai precisar conectar a sua carteira, criar uma conta e então clicar no mesmo link para pedir fundos. Para o faucet oficial do rinkeby, se listar 0 "peers", não vale o tempo para fazer um tweet/post público no Facebook.

Seguem alguns _faucets_ onde você pode solicitar ETH falso para a rede _Rinkeby_.

| Nome | Link | Quantidade | Tempo |
| ---------------- | -------------------------- | --------------- | ------------ |
| MyCrypto | https://app.mycrypto.com/faucet | 0,01 | Nenhum |
| Buildspace | https://buildspace-faucet.vercel.app/ | 0,025 | 1d |
| Ethily | https://ethily.io/rinkeby-faucet/ | 0,2 | 1s |
| Rinkeby Oficial | https://faucet.rinkeby.io/ | 3 / 7,5 / 18,75 | 8h / 1d / 3d |
| Chainlink | https://faucets.chain.link/rinkeby | 0,1 | Nenhum |

## 🚀 Configurar um arquivo deploy.js

É boa prática separar o seu script para deploy do seu script `run.js`. `run.js` é onde podemos bagunçar as coisas, então queremos manter separado. Vá em frente e crie um arquivo chamado `deploy.js` dentro do folder `scripts`. Copie e cole todo o código de `run.js` dentro de `deploy.js`. Por enquanto, será exatamente a mesma coisa. Entretanto, adicionei alguns `console.log`.

```javascript
const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory("MyEpicNFT")
  const nftContract = await nftContractFactory.deploy()
  await nftContract.deployed()
  console.log("Contrato implantado em:", nftContract.address)
  // Chama a função.
  let txn = await nftContract.makeAnEpicNFT()
  // Espera ela ser minerada.
  await txn.wait()
  console.log("Cunhou NFT #1")
  txn = await nftContract.makeAnEpicNFT()
  // Espera ela ser minerada.
  await txn.wait()
  console.log("Cunhou NFT #2")
}
const runMain = async () => {
  try {
    await main()
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}
runMain()
```

## **📈 Fazer o deploy para a testnet Rinkeby.**

Nós vamos precisar mudar nosso arquivo  `hardhat.config.js` . Você pode encontrá-lo na raíz do diretório do projeto do seu contrato inteligente.

```javascript
require("@nomiclabs/hardhat-waffle");
module.exports = {
  solidity: "0.8.1",
  networks: {
    rinkeby: {
      url: "SEU_URL_DA_API_ALCHEMY",
      accounts: ["SUA_KEY_PRIVADA_DA_CONTA_RINKEBY"],
    },
  },
};
```

Você pode conseguir URL da sua API no dashboard do Alchemy e colar ali mesmo. Depois, você vai precisar da sua chave **privada** do rinkeby (não o seu endereço público!) o qual você pode pegar no metamask e colar ali também.

ℹ️ **Nota:** O acesso à sua chave privada pode ser feito abrindo a MetaMask, alterando a rede para "Rinkeby Test Network" e depois clicando nos três pontos e selecionando "Account Details" > "Export Private Key"

**Nota: NÃO FAÇA COMMIT DESSE ARQUIVO NO GITHUB. ELE CONTÉM SUA CHAVE PRIVADA. VOCÊ PODE SER ROUBADO E HACKEADO. ESSA CHAVE PRIVADA É A MESMA QUE A DA MAINNET.** Nós vamos falar sobre variáveis `.env` depois e como mantê-las em segredo.

Por quê você precisa dessa chave privada? Porque para executar uma transação como fazer deploy de um contrato, você precisa "logar" na blockchain e assinar/ fazer deploy do contrato. E, o seu nome de usuário é o seu endereço público, e sua senha é sua chave privada. É como fazer login na AWS ou GCP para fazer deploy.

Uma vez que você configurou o seu setup, estamos prontos para fazer o deploy com o script que escrevemos mais cedo.

Rode esse comando pela raíz do seu diretório  `epic-nfts`.

```bash
npx hardhat run scripts/deploy.js --network rinkeby
```

Geralmente, leva de 20 a 40 segundos para fazer o deploy. Nós não estamos apenas fazendo deploy! Nós também estamos mintando NFTs no arquivo `deploy.js` então isso vai tomar algum tempo também. Na verdade, precisamos esperar que a transação seja minerada e validada pelos mineradores. Muito épico :). Esse único comando faz tudo isso!

Quando eu rodo esse comando, esse é o resultado (o seu vai ser diferente):

![gcWPqJp.png](https://i.imgur.com/gcWPqJp.png)

Podemos ter certeza que tudo funcionou corretamente usando o [Rinkeby Etherscan](https://rinkeby.etherscan.io/) onde você pode colar o endereço do contrato e ver o que está acontecendo com ele.

Se acostume a usar o Etherscan porque é a maneira mais fácil de acompanhar os deploys e se alguma coisa der errado. Se não está aparecendo no Etherscan, significa que ou está processando ainda ou algo deu errado.

Se funcionou - INCRÍVEL!!! VOCÊ ACABOU DE IMPLEMENTAR UM CONTRATO!

## 🌊 Ver no OpenSea

Acredite ou não. As NFTs que você acabou de mintar vão estar no site do OpenSea Testnet.

Vá para [testnets.opensea.io](https://testnets.opensea.io/). Procure o endereço do seu contrato que é o endereço ao qual nós fizemos deploy que você pode achar no seu terminal, **Não clique enter**, clique na coleção quando ela aparecer na pesquisa.

![Untitled](https://i.imgur.com/Nl5kxXT.png)

Aqui, você clica "ChavesNFT" embaixo de "Collections" e boom, você vai ver as NFTs que você mintou!

![Untitled](https://i.imgur.com/9n7tO6c.png)

É ISSO! VAMOS NESSA! ESTOU MUITO HYPADO **POR** VOCÊ.

Muito épico, acabamos de criar nosso contrato NFT _e_ mintamos duas NFTs. Épico. ENQUANTO ISSO É ÉPICO, também é _meio chato —_ certo? É a mesma foto do Chaves toda a vez! Como podemos adicionar alguma aleatoriedade para isso e gerar coisas no caminho? Isso é o que vamos ver depois :).

## 🙀 Me ajuda, minhas NFTs não estão aparecendo no OpenSea!

**Se suas NFTs não estiverem aparecendo no OpenSea** - espere alguns minutos, as vezes o OpenSea pode levar até 5 minutos. Aqui vai meu conselho, se já fazem mais de 5 minutos e seus metadados ainda se parecem com isso:

![Untitled](https://i.imgur.com/dVACrDl.png)

**Use o Rarible ao invés do OpenSea.** Rarible é outro marketplace NFT como o OpenSea. Aqui está como configurá-lo:

1. Vá para `rinkeby.rarible.com`.
2. Crie esse URL: `https://rinkeby.rarible.com/token/INSIRA_O_CONTRACT_ADDRESS_AQUI:INSIRA_O_TOKEN_ID_AQUI.`

Por exemplo, esse é meu link: https://rinkeby.rarible.com/token/0x5794653132ed3cb5c1758c2908bf283f4fe57f45:0 para o NFT do Chaves!! Meu `tokenId` é `0` porque foi o primeiro mint daquele contrato.

**Basicamente, se você não vir sua NFT no OpenSea dentro de alguns minutos, tente o Rarible e Rarible URLs para o resto do projeto.**

## 💻 O código

[Aqui](https://gist.github.com/danicuki/6f023edfd76e52e4c558abd3d75b871d) está um link para como o nosso código se parece até esse ponto. 

🚨 Relatório de progresso.
------------------------
TCHU-HUUUU. PODE SE DAR UM TAPINHA NAS COSTAS. VOCÊ FEZ DEPLOY DE UM SMART CONTRACT QUE FAZ MINT DE NFTS. 

Isso é coisa boa demais :).

Você deveria parar tudo agora e mandar um **tweet** contanto que você acabou de escrever e deployar seu smart contract que cria NFTs na blockchain e marcar @web3dev_. Pra ficar mais chique, inclua também uma foto da tela do OpenSea/Rarible mostrando seu NFT :)!

Você tem que se sentir incrível por ter construído de verdade algo que todo mundo só fica falando. Você tem super-poderes :-)

*Obrigado a todas as pessoas que estão twitando sobre nós, vocês são lendas <3.*

![](https://i.imgur.com/BazDcs3.png)

![](https://i.imgur.com/M5Y7God.png)

![](https://i.imgur.com/w3RNVce.png)
