### 🍪 Se familiarizando com o thirdweb.

Impressionante! Agora podemos nos conectar a carteria de um usuário, o que significa que podemos checar se ele está na nossa DAO! Para poder se juntar a nossa DAO, o usuário precisa de um NFT de filiação. Se ele não tiver um NFT de filiação, nós vamos incentivá-lo a cunhar um para se juntar à nossa DAO!

Mas existe um problema. Para que possamos cunhar NFTs, precisamos escrever + dar deploy no nosso próprio smart contract. **É aqui em que Thirdweb brilha.**

O que o Thirdweb nos dá, é um conjunto de ferramentas para criar todos os nossos smart contrats sem escrever nada de Solidity.

Nós não escrevemos nada em Solidity. Tudo o que precisamos fazer é escrever um script usando apenas Javascript para criar + dar deploy nos nossos contratos. O thridweb vai usar um conjunto de contratos seguros que eles criaram [aqui](https://github.com/nftlabs/nftlabs-protocols). **A parte boa é que depois de você criar os contratos, você é o dono deles e os contratos ficam associados com a sua carteira.**

Uma vez que você dá deploy no contrato, você pode interagir com ele diretamente do frontend facilmente usando o SDK para o cliente deles.

Eu não posso ser mais claro sobre como é fácil de criar um smart contract usando o thirdweb comparado com escrever seu próprio código em Solidity, vai ser como interagir com uma biblioteca backend normal. Vamos lá:

Vá para o dashboard do thirdweb [aqui](https://thirdweb.com/start?utm_source=web3dev). Clique em "**Let's get started**". Conecte sua carteira. Selecione sua rede (**Goerli**).

Crie o seu primeiro projeto e dê um nome como "My DAO" ou algo do tipo. Quando você clicar em "Criar" você vai ver que um pop-up da Metamask é aberto e você tem que pagar uma taxa de transação na rede Goerli. Por que?

Essa ação cria o container para os contratos que vamos dar deploy, on-chain. **o thirdweb não tem uma base de dados, todos os seus dados são armazenados on-chain.** 

### 📝 Crie um lugar para rodar os scripts do thirdweb.

Agora precisamos escrever alguns scripts que nos permitem criar/dar deploy no nosso contrato para a Goerli usando o thirdweb. A primeira coisa que nós precisamos fazer é criar um arquivo `.env` na raiz do seu projeto que se parece com isso:

```plaintext
PRIVATE_KEY=SUA_CHAVE_PRIVADA_AQUI
WALLET_ADDRESS=ENDEREÇO_DA_SUA_CARTEIRA
ALCHEMY_API_URL=SUA_URL_HTTPS_ALCHEMY
```

*Nota: está no Replit? Você vai precisar usar [isto](https://docs.replit.com/programming-ide/storing-sensitive-information-environment-variables). Basicamente arquivos .env não funcionam no Replit. Você precisa usar esse método para adicionar suas variáveis uma por uma com os mesmos nomes. Quando você terminar você precisará reiniciar o Replit parando e rodando o repositóro de novo, para que ele possa ter acesso as novas variáveis de ambiente!*

O thirdweb precisa dessas variáveis para fazer o deploy desses contratos em nosso favor. Nada é guardado do lado delees, tudo fica localmente no seu arquivo `.env`. **Não faça commit do seu arquivo `env` para o Github. Você será roubado. Tenha cuidado.**

Para acessar sua chave privada na Metamask, veja [isto aqui](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key).

Para acessar o endereço da sua carteira, veja [isto aqui](https://metamask.zendesk.com/hc/en-us/articles/360015289512-How-to-copy-your-MetaMask-account-public-address-).

E se você quiser aprender um pouco mais sobre assinaturas digitais com chaves privadas e públicas, veja [isto aqui](https://www.web3dev.com.br/bernardojaymovic/porque-as-assinaturas-digitais-sao-essenciais-nas-blockchains-11i1)

### 🚀 Alchemy.

A última coisa que você precisa no seu arquivo `.env` é a `ALCHEMY_HTTPS_URL`.

Alchemy essencialmente nos ajuda a transmitir a criação do nosso smart contract para que ele possa ser pego pelos miners na testnet o mais rápido o possível. Uma vez que a transação é minerada, ela é então transmitida para a blockchain como uma transação legítima. A partir dai, todo mundo atualiza a sua cópia da blockchain.

Então, [faça uma conta na Alchemy](https://alchemy.com/?r=jQ3MDMxMzUyMDU3N).

Veja esse vídeo abaixo para ver como acessar sua chave API para uma **testnet**! Não se confunda criando uma chave para a mainnet, **nós queremos uma chave para a testnet.**

[Loom](https://www.loom.com/share/35aabe54c3294ef88145a03c311f1933)

Você deve ter por agora os três itens no seu arquivo `.env`!

### 🥳 Inicializando o SDK

Vá para `scripts/1-initialize-sdk.js`.

```jsx
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import ethers from "ethers";

//Importando e configurando nosso arquivo .env para que possamos usar nossas variáveis de ambiente de maneira segura
import dotenv from "dotenv";
dotenv.config();

// Algumas verificações rápidas para ter certeza de que nosso .env está funcionando.
if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY == "") {
  console.log("🛑 Chave privada não encontrada.")
}

if (!process.env.ALCHEMY_API_URL || process.env.ALCHEMY_API_URL == "") {
  console.log("🛑 Alchemy API não encontrada.")
}

if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS == "") {
  console.log("🛑 Endereço de carteira não encontrado.")
}

// RPC URL, nós usaremos nossa URL da API do Alchemy do nosso arquivo .env.
const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_API_URL);

// A chave privada da nossa carteira. SEMPRE MANTENHA ISSO PRIVADO, NÃO COMPARTILHE COM NINGUÉM, adicione no seu arquivo .env e NÃO comite aquele arquivo para o github!
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const sdk = new ThirdwebSDK(wallet);

(async () => {
  try {
    const address = await sdk.getSigner().getAddress();
    console.log("👋 SDK inicializado pelo endereço:", address)
  } catch (err) {
    console.error("Falha ao buscar apps no sdk", err);
    process.exit(1);
  }
})()

// Nós estamos exportando o SDK thirdweb inicializado para que possamos usar em outros scprits do projeto
export default sdk;
```

Parece ser muita coisa, mas tudo o que estamos fazendo é inicializar o thirdweb e então adicionar um `export default sdk` dado que vamos reusar o sdk inicializado em outros scripts. É quase como inicializar uma conexão com uma base de dados a partir de um servidor. Nós damos coisas como nossa chave privada e o nosso provedor (Que no caso é o Alchemy).

Nós também estamos rodando isto:

```jsx
(async () => {
  try {
    const address = await sdk.getSigner().getAddress()
    console.log("👋 SDK inicializado pelo endereço:", address)
  } catch (err) {
    console.error("Falha ao buscar apps no sdk", err)
    process.exit(1)
  }
})()
```

Para ter certeza de que podemos recuperar o projeto que fizemos usando o web app do thirdweb!

Antes de executar a função, certifique-se de que você tem o Node 12+ instalado, você pode checar sua versão com: 

```plaintext
node -v
```

*Nota: se você está no Replit você pode rodar scprits pelo shell:*
```bash
npm init -y && npm i --save-dev node@17 && npm config set prefix=$(pwd)/node_modules/node && export PATH=$(pwd)/node_modules/node/bin:$PATH
```

Se você tem uma versão antiga do Node, você pode atualizá-lo [aqui](https://nodejs.org/en/). (Baixe a versão LTS) Vamos executar! Vá para o seu terminal e cole o seguinte comando;

```plaintext
node scripts/1-initialize-sdk.js
```

Aqui está o que eu recebo quando rodo o script.

```plaintext
$ node scripts/1-initialize-sdk.js
👋 SDK inicializado pelo endereço: 0xf9aD3D930AB5df972558636A2B8749e772aC9297
```

*Nota: você talvez veja alguns avisos aleatórios tipo `ExperimentalWarning`, apenas certifique-se de que seu endereço está sendo impresso!*

Certifique-se de copiar o endereço do seu app! Você vai precisar dele em um segundo!

Épico. Se você ver o endereço do seu app sendo impresso quer dizer que tudo foi inicializado!

### 🧨 Crie uma coleção ERC-1155.

O que nós vamos fazer agora é criar + fazer deploy de um contrato ERC-1155 para a Goerli. Isso é basicamente o módulo base que nós vamos precisar para criar nossos NFTs. **Nós não estamos criando nossos NFT aqui ainda, nós estamos apenas configurado os metadados ao redor da coleção em si.** Coisas como o nome da coleção (ex. CryptoPunks) e uma imagem associada com a coleção que aparece no cabeçalho do OpenSea.

*Nota: Você deve conhecer ERC-721 onde todo NFT é único, mesmo se eles tiverem a mesma imagem, nome e propriedades. Com um ERC-1155, múltiplas pessoas podem ser holders do mesmo NFT. Nesse caso, nosso NFT de filiação é o mesmo para todo mundo, então ao invés de fazer um novo NFT todas as vezes, nós podemos simplesmente atribuir o mesmo NFT para todos os nossos membros. Isso também é mais eficiente em relação a taxas! Essa é uma abordagem bem comum para casos em que o NFT é o mesmo para todos os holders.*

Vá para `scripts/2-deploy-drop.js` e adicione o código abaixo: 

```jsx
import { AddressZero } from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

(async () => {
  try {
    const editionDropAddress = await sdk.deployer.deployEditionDrop({
      // O nome da coleção, ex. CryptoPunks
      name: "Membro da MTBDAO",
      // Uma descrição para a coleção.
      description: "A DAO dos pedaleiros de montanha",
      // Uma imagem para a coleção que vai aparecer no OpenSea.
      image: readFileSync("scripts/assets/mtb.png"),
      // Nós precisamos passar o endereço da pessoa que vai estar recebendo os rendimentos das vendas dos nfts do módulo.
      // Nós estamos planejando não cobrar as pessoas pelo drop, então passaremos o endereço 0x0
      // você pode configurar isso para sua própria carteira se você quiser cobrar pelo drop.
      primary_sale_recipient: AddressZero,
    });

    // essa inicialização retorna o endereço do nosso contrato
    // usamos para inicializar o contrato no sdk
    const editionDrop = sdk.getEditionDrop(editionDropAddress);

    // com isso, temos os metadados no nosso contrato
    const metadata = await editionDrop.metadata.get();
    
    console.log(
      "✅ Contrato editionDrop implantado com sucesso, endereço:",
      editionDropAddress,
    );
    console.log(
      "✅ bundleDrop metadados:",
      metadata,
    );
  } catch (error) {
    console.log("falha ao implantar contrato editionDrop", error);
  }
})()
```

Um scprit bem simples!

Nós damos para nossa coleção um `name`,  `description` e `primary_sale_recipient`, e `image`. A `image` nós estamos carregando nosso arquivo local então certifique-se de incluir sua imagem dentro de `scripts/assets`. Certifique-se de que é um PNG, JPG, ou GIF e que seja um arquivo local por agora - isso não vai funcionar se você usar uma link da internet!

Quando eu rodo isso usando `node scripts/2-deploy-drop.js`, eu recebo.

```plaintext
$ node scripts/2-deploy-drop.js
👋 SDK inicializado pelo endereço: 0xf9aD3D930AB5df972558636A2B8749e772aC9297
(node:84590) ExperimentalWarning: stream/web is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
✅ Contrato editionDrop implantado com sucesso, endereço: 0x828102F33E3Fb4798E71434F94C29fe2a8EeC27F
✅ bundleDrop metadados: {
  name: 'Membro da MTBDAO',
  description: 'A DAO dos pedaleiros de montanha',
  image: 'https://gateway.ipfscdn.io/ipfs/QmbWpS7akcej1unepzE2ZBJWg8bCjopGxM3em9SpLXejxN/0',
  seller_fee_basis_points: 0,
  fee_recipient: '0x0000000000000000000000000000000000000000',
  merkle: {},
  symbol: ''
}
```

Okay, o que acabou de acontecer é muito lôko. Duas coisas aconteceram:

**Um, nós acabamos de fazer deploy de um contrato [ERC-1155](https://docs.openzeppelin.com/contracts/3.x/erc1155) na rede Goerli.** Isso mesmo! Se você for em `https://goerli.etherscan.io/` e colar o endereço do módulo `bundleDrop`, você vai ver que você acabou de dar deploy num smart contract! A parte mais legal é que você é o **dono** desse contrato e ele foi feito usando a **sua** carteira. O endereço "From" vai ser o **seu** endereço público.

*Nota: Mantenha o endereço do seu `editionDrop` por perto, vamos precisar dele mais tarde.*

![Untitled](https://i.imgur.com/igkj8JH.png)

Bem Épico. Um contrato customizado e lançado usando apenas javascript. Você pode ver o código do smart contract que o thridweb usa [aqui](https://github.com/thirdweb-dev/contracts/blob/main/contracts/drop/DropERC1155.sol).

**A outra coisa que nós fizemos aqui foi usar o thirdweb para automaticamente fazer o upload e fixar a imagem da nossa coleção no IPFS.** Você vai ver um link que inicia com `https://gateway.ipfscdn.io` impresso. Se você copiar esse link no navegador, você vai ver a imagem do seu NFT sendo recuperada do IFPS via CloudFare!

Você pode até ir para o IFPS diretamente usando a URI `ipfs://` (nota - não vai funcionar no Chrome porque você precisa está rodando um nó IPFS, mas funciona no Brave que faz isso por você!)

*Nota: IPFS é basicamente um sistema de armazenamento descentralizado. Temos vários artigos sobre o tema [nas páginas da comunidade](https://www.web3dev.com.br/t/ipfs) e [vídeos no nosso YouTube](https://www.youtube.com/watch?v=GZCUdnIuZD8&list=PLVX4xVoD65UMJmx0RabEw-Cv0PDxoLWDs)

Se você desenvolveu um smart contract personalizado em Solidity antes, isso é um pouco de explodir cabeças. Nós já temos um contrato lançado na Goerli + dados hospedados no IPFS. Louco. Seguindo, nós precisamos de fato criar nossos NFTs!

### 🚨 Relatório de Progresso

*Por favor faça isso ou Yan vai ficar triste :(.*

Vá lá e compartilhe uma screenshot do Etherscan em `#progresso` mostrando o seu contrato lançado.