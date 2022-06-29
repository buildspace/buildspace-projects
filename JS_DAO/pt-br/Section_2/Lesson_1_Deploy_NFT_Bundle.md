### 🍪 Se familiarizando com o thirdweb.

Impressionante! Agora podemos nos conectar a carteria de um usuário, o que significa que podemos checar se ele está na nossa DAO! Para poder se juntar a nossa DAO, o usuário precisa de um NFT de filiação. Se ele não tiver um NFT de filiação, nós vamos incentivá-lo a cunhar um para se juntar à nossa DAO!

Mas existe um problema. Para que possamos cunhar NFTs, precisamos escrever + dar deploy no nosso próprio smart contract. **É aqui em que Thirdweb brilha.**

O que o Thirdweb nos dá, é um conjunto de ferramentas para criar todos os nossos smart contrats sem escrever nada de Solidity.

Nós não escrevemos nada em Solidity. Tudo o que precisamos fazer é escrever um script usando apenas Javascript para criar + dar deploy nos nossos contratos. O thridweb vai usar um conjunto de contratos seguros que eles criaram [aqui](https://github.com/nftlabs/nftlabs-protocols). **A parte boa é que depois de você criar os contratos, você é o dono deles e os contratos ficam associados com a sua carteira.**

Uma vez que você dá deploy no contrato, você pode interagir com ele diretamente do frontend facilmente usando o SDK para o cliente deles.

Eu não posso ser mais claro sobre como é fácil de criar um smart contract usando o thirdweb comparado com escrever seu próprio código em Solidity, vai ser como interagir com uma biblioteca backend normal. Vamos lá:

Vá para o dashboard do thirdweb [aqui](https://thirdweb.com/start?utm_source=web3dev). Clique em "**Let's get started**". Conecte sua carteira. Selecione sua rede (**Rinkeby**).

Crie o seu primeiro projeto e dê um nome como "My DAO" ou algo do tipo. Quando você clicar em "Criar" você vai ver que um pop-up da Metamask é aberto e você tem que pagar uma taxa de transação na rede Rinkeby. Por que?

Essa ação cria o container para os contratos que vamos dar deploy, on-chain. **o thirdweb não tem uma base de dados, todos os seus dados são armazenados on-chain.** 

### 📝 Crie um lugar para rodar os scripts do thirdweb.

Agora precisamos escrever alguns scripts que nos permitem criar/dar deploy no nosso contrato para a Rinkeby usando o thirdweb. A primeira coisa que nós precisamos fazer é criar um arquivo `.env` na raiz do seu projeto que se parece com isso:

```plaintext
PRIVATE_KEY=SUA_CHAVE_PRIVADA_AQUI
WALLET_ADDRESS=ENDEREÇO_DA_SUA_CARTEIRA
ALCHEMY_API_URL=SUA_URL_DE_API_ALCHEMY
```

*Nota: está no Replit? Você vai precisar usar [isto](https://docs.replit.com/programming-ide/storing-sensitive-information-environment-variables). Basicamente arquivos .env não funcionam no Replit. Você precisa usar esse método para adicionar suas variáveis uma por uma com os mesmos nomes. Quando você terminar você precisará reiniciar o Replit parando e rodando o repositóro de novo, para que ele possa ter acesso as novas variáveis de ambiente!*

O thirdweb precisa dessas variáveis para fazer o deploy desses contratos em nosso favor. Nada é guardado do lado delees, tudo fica localmente no seu arquivo `.env`. **Não faça commit do seu arquivo `env` para o Github. Você será roubado. Tenha cuidado.**

Para acessar sua chave privada na Metamask, veja [isto aqui](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key).

Para acessar o endereço da sua carteira, veja [isto aqui](https://metamask.zendesk.com/hc/en-us/articles/360015289512-How-to-copy-your-MetaMask-account-public-address-).

E se você quiser aprender um pouco mais sobre assinaturas digitais com chaves privadas e públicas, veja [isto aqui](https://www.web3dev.com.br/bernardojaymovic/porque-as-assinaturas-digitais-sao-essenciais-nas-blockchains-11i1)

### 🚀 Alchemy.

A última coisa que você precisa no seu arquivo `.env` é a `ALCHEMY_API_URL`.

Alchemy essencialmente nos ajuda a transmitir a criação do nosso smart contract para que ele possa ser pego pelos miners na testnet o mais rápido o possível. Uma vez que a transação é minerada, ela é então transmitida para a blockchain como uma transação legítima. A partir dai, todo mundo atualiza a sua cópia da blockchain.

Então, faça uma conta na Alchemy [REVIEW](https://alchemy.com/?r=b93d1f12b8828a57).

Veja esse vídeo abaixo para ver como acessar sua chave API para uma **testnet**! Não se confunda criando uma chave para a mainnet, **nós queremos uma chave para a testnet.**

[REVIEW](https://www.loom.com/share/35aabe54c3294ef88145a03c311f1933)

Você deve ter por agora os três itens no seu arquivo `.env`!

### 🥳 Inicializando o SDK

Vá para `scripts/1-initialize-sdk.js`.

```jsx
import { ThirdwebSDK } from "@3rdweb/sdk";
import ethers from "ethers";

//Importando e configurando nosso arquivo .env para que possamos usar nossas variáveis de ambiente de maneira segura
import dotenv from "dotenv";
dotenv.config();

// Algumas verificações rápidas para ter certeza de que nosso .env está funcionando.
if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY == "") {
  console.log("🛑 Private key not found.")
}

if (!process.env.ALCHEMY_API_URL || process.env.ALCHEMY_API_URL == "") {
  console.log("🛑 Alchemy API URL not found.")
}

if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS == "") {
  console.log("🛑 Wallet Address not found.")
}

const sdk = new ThirdwebSDK(
  new ethers.Wallet(
    // A chave privada da nossa carteira. SEMPRE MANTENHA ISSO PRIVADO, NÃO COMPARTILHE COM NINGUÉM, adicione no seu arquivo .env e NÃO comite aquele arquivo para o github!
    process.env.PRIVATE_KEY,
    // RPC URL, nós usaremos nossa URL da API do Alchemy do nosso arquivo .env.
    ethers.getDefaultProvider(process.env.ALCHEMY_API_URL),
  ),
);

(async () => {
  try {
    const apps = await sdk.getApps();
    console.log("Your app address is:", apps[0].address);
  } catch (err) {
    console.error("Failed to get apps from the sdk", err);
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
    const apps = await sdk.getApps();
    console.log("Your app address is:", apps[0].address);
  } catch (err) {
    console.error("Failed to get apps from the sdk", err);
    process.exit(1);
  }
})()
```

Para ter certeza de que podemos recuperar o projeto que fizemos usando o web app do thirdweb!

Antes de executar a função, certifique-se de que você tem o Node 12+ instalado, você pode checar sua versão com: 

```plaintext
node -v
```

*Nota: se você está no Replit você pode rodar scprits pelo shell que é dado*

Se você tem uma versão antiga do Node, você pode atualizá-lo [aqui](https://nodejs.org/en/). (Baixe a versão LTS) Vamos executar! Vá para o seu terminal e cole o seguinte comando;

```plaintext
node scripts/1-initialize-sdk.js
```

Aqui está o que eu recebo quando rodo o script.

```plaintext
web3dev-dao-starter % node scripts/1-initialize-sdk.js
👋 Your app address is: 0xa002D595189bF9D50D5897C64b6e07BE5bdEe9b8
```

*Nota: você talvez veja alguns avisos aleatórios tipo `ExperimentalWarning`, apenas certifique-se de que seu endereço está sendo impresso!*

Certifique-se de copiar o endereço do seu app! Você vai precisar dele em um segundo!

Épico. Se você ver o endereço do seu app sendo impresso quer dizer que tudo foi inicializado!

### 🧨 Crie uma coleção ERC-1155.

O que nós vamos fazer agora é criar + fazer deploy de um contrato ERC-1155 para a Rinkeby. Isso é basicamente o módulo base que nós vamos precisar para criar nossos NFTs. **Nós não estamos criando nossos NFT aqui ainda, nós estamos apenas configurado os metadados ao redor da coleção em si.** Coisas como o nome da coleção (ex. CryptoPunks) e uma imagem associada com a coleção que aparece no cabeçalho do OpenSea.

*Nota: Você deve conhecer ERC-721 onde todo NFT é único, mesmo se eles tiverem a mesma imagem, nome e propriedades. Com um ERC-1155, múltiplas pessoas podem ser holders do mesmo NFT. Nesse caso, nosso NFT de filiação é o mesmo para todo mundo, então ao invés de fazer um novo NFT todas as vezes, nós podemos simplesmente atribuir o mesmo NFT para todos os nossos membros. Isso também é mais eficiente em relação a taxas! Essa é uma abordagem bem comum para casos em que o NFT é o mesmo para todos os holders.*

Vá para `scripts/2-deploy-drop.js` e adicione o código abaixo: 

```jsx
import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const app = sdk.getAppModule("INSIRA_SEU_ENDEREÇO_AQUI");

(async () => {
  try {
    const bundleDropModule = await app.deployBundleDropModule({
      // O nome da coleção, ex. CryptoPunks
      name: "NarutoDAO Membership",
      // Uma descrição para a coleção.
      description: "A DAO for fans of Naruto.",
      // Uma imagem para a coleção que vai aparecer no OpenSea.
      image: readFileSync("scripts/assets/naruto.png"),
      // Nós precisamos passar o endereço da pessoa que vai estar recebendo os rendimentos das vendas dos nfts do módulo.
      // Nós estamos planejando não cobrar as pessoas pelo drop, então passaremos o endereço 0x0
      // você pode configurar isso para sua própria carteira se você quiser cobrar pelo drop.
      primarySaleRecipientAddress: ethers.constants.AddressZero,
    });
    
    console.log(
      "✅ Successfully deployed bundleDrop module, address:",
      bundleDropModule.address,
    );
    console.log(
      "✅ bundleDrop metadata:",
      await bundleDropModule.getMetadata(),
    );
  } catch (error) {
    console.log("failed to deploy bundleDrop module", error);
  }
})()
```

*Nota: certifique-se de mudar `INSIRA_SEU_ENDEREÇO_AQUI` para o endereço impresso por `1-initialize-sdk.js`.*

Um scprit bem simples!

Nós damos para nossa coleção um `name`,  `description` e `primarySaleRecipientAddress`, e `image`. A `image` nós estamos carregando nosso arquivo local então certifique-se de incluir sua imagem dentro de `scripts/assets`. Certifique-se de que é um PNG, JPG, ou GIF e que seja um arquivo local por agora - isso não vai funcionar se você usar uma link da internet!

Quando eu rodo isso usando `node scripts/2-deploy-drop.js`, eu recebo.

```plaintext
web3dev-dao-starter % node scripts/2-deploy-drop.js
👋 Your app address is: 0xa002D595189bF9D50D5897C64b6e07BE5bdEe9b8
✅ Successfully deployed bundleDrop module, address: 0x31c70F45060AE0870624Dd9D79A1d8dafC095A5d
✅ bundleDrop metadata: {
  metadata: {
    name: 'NarutoDAO Membership',
    description: 'A DAO for fans of Naruto.',
    image: 'https://cloudflare-ipfs.com/ipfs/bafybeicuuhilocc2tskhnvbwjqarsc5k7flfqdr4ifvwxct32vzjmb3sam',
    primary_sale_recipient_address: '0x0000000000000000000000000000000000000000',
    uri: 'ipfs://bafkreieti3mpdd3pytt3v6vxbc3rki2ja6qpbblfznmup2tnw5mghrihnu'
  },
  address: '0x31c70F45060AE0870624Dd9D79A1d8dafC095A5d',
  type: 11
}
```

Okay, o que acabou de acontecer é muito épico. Duas coisas aconteceram:

**Um, nós acabamos de fazer deploy de um contrato [ERC-1155](https://docs.openzeppelin.com/contracts/3.x/erc1155) na rede Rinkeby.** Isso mesmo! Se você for em `https://rinkeby.etherscan.io/` e colar o endereço do módulo `bundleDrop`, você vai ver que você acabou de dar deploy num smart contract! A parte mais legal é que você é o **dono** desse contrato e ele foi feito usando a **sua** carteira. O endereço "From" vai ser o **seu** endereço público.

*Nota: Mantenha o endereço do seu `bundleDrop` por perto, vamos precisar dele mais tarde.*

![Untitled](https://i.imgur.com/suqHbB4.png)

Bem Épico. Um contrato customizado e lançado usando apenas javascript. Você pode ver o código do smart contract que o thridweb usa [aqui](https://github.com/nftlabs/nftlabs-protocols/blob/main/contracts/LazyNFT.sol).

**A outra coisa que nós fizemos aqui foi usar o thirdweb para automaticamento fazer o upload e fixar a imagem da nossa coleção no IPFS.** Você vai ver um link que inicia com `https://cloudflare-ipfs.com` impresso. Se você copiar esse link no navegador, você vai ver a imagem do seu NFT sendo recuperada do IFPS via CloudFare!

Você pode até ir para o IFPS diretamente usando a URI `ipfs://` (nota - não vai funcionar no Chrome porque você precisa está rodando um nó IPFS, mas funciona no Brave que faz isso por você!)

*Nota: IPFS é basicamente um sistema de armazenamento descentralizado, leia mais [aqui](https://docs.ipfs.io/concepts/what-is-ipfs/)! (em inglês)*

Se você desenvolveu um smart contract personalizado em Solidity antes, isso é um pouco de explodir cabeças. Nós já temos um contrato lançado na Rinkeby + dados hospedados no IPFS. Louco. Seguindo, nós precisamos de fato criar nossos NFTs!

### 🚨 Relatório de Progresso

*Por favor faça isso ou Yan vai ficar triste :(.*

Vá lá e compartilhe uma screenshot do Etherscan em `#progresso` mostrando o seu contrato lançado.