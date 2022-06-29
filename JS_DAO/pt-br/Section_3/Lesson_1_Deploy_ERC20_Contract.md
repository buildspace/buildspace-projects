Agora nossos membros tem um NFT para comprovar que são membros da nossa DAO. Perfeito. Vamos dar mais um passo. Vamos criar um fornecimento de tokens de governança para fazer um airdrop para os nosso membros.

Talvez você se lembre do airdrop do token de governança da ENS DAO [aqui](https://decrypt.co/85894/ethereum-name-service-market-cap-hits-1-billion-just-days-after-ens-airdrop). O que isso tudo significa? Por que um token de governança tem uma capitalização de mercado tem quase um bilhão de dólares [nesse momento](https://coinmarketcap.com/currencies/ethereum-name-service/)?

Basicamente, um token de goverança permite que usuários votem nas propostas. Por exemplo, uma proposta poderia dizer algo tipo "Eu quero que a Naturo DAO envie 100,000 $HOKAGE para o endereço `0xf79a3bb8d5b93686c4068e2a97eaec5fe4843e7d` por ser um membro extraordinário". Então os membros poderiam votar.

Usuários com mais tokens de governança são mais poderosos. Geralmente, tokens são dados para membros da comunidade que mais trouxeram valor.

Por exemplo, para o airdrop do ENS, as pessoas que mais receberam tokens foram as do time central de desenvolvimento e os usuários ativos no Discord deles. Mas você também poderia receber tokens da ENS DAO baseado em quanto tempo você teve seu domínio ENS (ex. `yanluiz.eth`). A propósito, se você não sabe, um nome ENS é um NFT.

Então, quanto mais tempo você tivesse com o NFT, mais tokens você recebia.

Por que? Porque o time do ENS queria que os primeiros adeptos da rede fossem recompensados. Essa foi a fórmula deles:

![Untitled](https://i.imgur.com/syh3F01.png)

Eu quero ser claro, essa é uma fórmula personalizada! Sua DAO também pode ter uma fórmula personalizada. Talvez você também queira recompensar pessoas na sua DAO baseado em quanto tempo eles tiveram seu NFT de filiação. Tudo depende de você.

### 🥵 Faça Deploy do Seu Token.

Vamos criar nosso smart contract para o nosso token! Vá para `scripts/5-deploy-token.js` e adicione:

```jsx
import sdk from "./1-initialize-sdk.js";

// Para que possamos fazer o deploy do contrato precisamos do nosso amigo o app module.
const app = sdk.getAppModule("INSERIR_O_ENDEREÇO_DO_SEU_APP");

(async () => {
  try {
    // Faça o Deploy de um contracto ERC-20 padrão.
    const tokenModule = await app.deployTokenModule({
      // Qual o nome do seu token? Ex. "Ethereum"
      name: "NarutoDAO Governance Token",
      // Qual o símbolo do seu token? Ex. "ETH"
      symbol: "HOKAGE",
    });
    console.log(
      "✅ Successfully deployed token module, address:",
      tokenModule.address,
    );
  } catch (error) {
    console.error("failed to deploy token module", error);
  }
})();
```

Bem facinho!! A propósito, você vai precisar `INSERIR_O_ENDEREÇO_DO_SEU_APP`. se você perdeu, sinta-se a vontade para rodar `./1-initialize-sdk.js` de novo.

Nós chamamos o `deployTokenModule` que vai fazer o deploy de um contrato [ERC-20](https://docs.openzeppelin.com/contracts/2.x/api/token/erc20) padrão para você, que é o padrão que todas as grandes moedas na Ethereum adotam. Tudo o que você precisa dar é o `name` e `symbol` do seu token! Se divirta com essa parte, não me copie é claro. Eu espero que você esteja construindo algo que **você** ache legal!

Aqui eu dou o símbolo HOKAGE para o meu token. Se você não sabe o que é isso — veja [aqui](https://naruto.fandom.com/wiki/Hokage) lol. TLDR: se você é um Hokage você é um dos melhores ninjas de todos os tempos.

A propósito — você pode ver o contrato exato que o thirdweb usa [REVIEW](https://github.com/nftlabs/nftlabs-protocols/blob/main/contracts/Coin.sol).

Aqui está o que eu recebo quando eu rodo:

```plaintext
web3dev-dao-starter % node scripts/5-deploy-token.js
👋 Your app address is: 0xa002D595189bF9D50D5897C64b6e07BE5bdEe9b8
✅ Successfully deployed token module, address: 0xae0E627f7495C5dbdc9adE4D4C9Af50C8858438F
```

Boom! O deploy do contrato do token foi feito. Se você for para [`https://rinkeby.etherscan.io/`](https://rinkeby.etherscan.io/) e pesquisar o endereço do módulo do token, você vai ver o contrato que acabou de subir. Novamente, você vai ver que o deploy foi feito da **sua carteira**, então **você é o dono**.

![Untitled](https://i.imgur.com/4tHQ20A.png)

Você pode até adicionar o seu token à Metamask como um token personalizado.

Cliquem em "Import Token":

![Untitled](https://i.imgur.com/Bf56dyv.png)

Então cole o endereço do seu contrato ERC-20 e você vai ver que a Metamask magicamente pega o símbolo do seu token:

![Untitled](https://i.imgur.com/bbg9nEz.png)

Então, volte para a sua carteira, role para baixo e boom!

![Untitled](https://i.imgur.com/yhUdkc3.png)

Você oficialmente tem o seu próprio token :).

### 💸 Crie o Fornecimento do Seu Token.

No momento, **existem zero tokens disponíveis para as pessoas reivindicarem.** Nosso contrato ERC-20 não sabe magicamente quantos tokens estão disponíveis. Nós temos que dizer!

Vá para `6-print-money.js` e adicione:

```jsx
import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// Esse é o endereço do nosso contrato ERC-20 impresso no passo anterior.
const tokenModule = sdk.getTokenModule(
  "INSIRA_O_ENDEREÇO_DO_TOKEN_MODULE",
);

(async () => {
  try {
    // Qual o fornecimento máximo que você quer? 1,000,000 é um número legal!
    const amount = 1_000_000;
    // Nós usamos a função utils da biblioteca "ethers" para converter o valor
    // para ter 18 decimais (o que é o padrão para tokens ERC20).
    const amountWith18Decimals = ethers.utils.parseUnits(amount.toString(), 18);
    // Interaja com o seu contrato ERC-20 e cunhe os tokens!
    await tokenModule.mint(amountWith18Decimals);
    const totalSupply = await tokenModule.totalSupply();
    
    // Mostre quantos dos seus tokens existem agora!
    console.log(
      "✅ There now is",
      ethers.utils.formatUnits(totalSupply, 18),
      "$HOKAGE in circulation",
    );
  } catch (error) {
    console.error("Failed to print money", error);
  }
})();
```
Lembre-se de que o endereço para inserir aqui é o endereço do seu **Token Module**. Se você colocar o endereço errado, talvez você receba um erro como esse: 'UNPREDICTABLE_GAS_LIMIT'.

Novamente, você pode ir no dashboard do thirdweb e procurar o endereço se você tiver perdido! Você deve ver que agora o módulo do token apareceu!

![image](https://user-images.githubusercontent.com/73496577/147308250-cf6a90cb-fd4e-4ec0-b5be-f4b9a7e25e1f.png)


Então, aqui nós estamos de fato cunhando o fornecimento do token e configurando o `amount` que queremos cunhar e configuramos o fornecimento máximo do token. Nós então fazemos `amountWith18Decimals` o que é bem importante. Basicamente, ele vai converter o número do nosso fornecimento do token para uma string com 18 casas decimais. Então, `1000000` se transforma em `"1000000.000000000000000000"` — 18 decimais são adicionados e o número vira uma string. Fazemos isso por dois motivos:

1) Números em código não são muito preciso em termos de casas decimais e matemática. Aqui nós decidimos trabalhar com números como strings, não como números de fato, o que faz com que a precisão seja boa mas a matemática difícil. A biblioteca Ethers tem várias funcionalidades para interagir com esses números strings.

2) Por que usamos 18 números decimais? Bom, isso permite que o nosso token seja enviado muito precisamente pelos usuários. Por exemplo, e se eu quisesse mandar `0.00000001` do meu token para um amigo? Nesse caso eu poderia! Eu tenho 18 casas decimais de precisão. Basicamente — podemos mandar quantias muito pequenas de token sem nenhum problema.

Aqui está o que eu recebo quando rodo o script:

```plaintext
web3dev-dao-starter % node scripts/6-print-money.js
👋 Your app address is: 0xa002D595189bF9D50D5897C64b6e07BE5bdEe9b8
✅ There now is 1000000.0 $HOKAGE in circulation
```

Agora para a parte épica. Volte para o seu contrato ERC-20 na Etherscan. Você vai ver que você tem seu próprio rastreador de token!

![Untitled](https://i.imgur.com/tEJU2oA.png)

Vá em frente e clique no rastreador e você vai ver toda a informação de fornecimento juntamente com coisas tipo: quem tem o seu token, quem está transferindo tokens, quantos tokens estão sendo transferidos. Você também verá que temos um "Total máximo de fornecimento".

Muito legal. Nós fizemos tudo isso usando apenas algumas linhas de javascript. Isso é insano. Você pode literalmente fazer a próxima moeda meme nesse ponto se você quiser lol.

![Untitled](https://i.imgur.com/vmeoTfU.png)

### ✈️ Faça o Airdrop.

Está na hora do airdrop. No momento você é provavelmente o único membro da sua DAO e está tudo bem!

Abra `7-airdrop-token.js` e adicione o código abaixo:

```jsx
import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// Esse é o endereço do nosso contrato ERC-1155 do NFT de filiação.
const bundleDropModule = sdk.getBundleDropModule(
  "INSIRA_O_ENDEREÇO_DO_DROP_MODULE",
);

// Esse é o endereço do nosso contrato ERC-20 do nosso token.
const tokenModule = sdk.getTokenModule(
  "INSIRA_O_ENDEREÇO_DO_TOKEN_MODULE",
);

(async () => {
  try {
    // Pegue o endereço de todas as pessoas que possuem o nosso NFT de filiação, que tem
    // o tokenId 0.
    const walletAddresses = await bundleDropModule.getAllClaimerAddresses("0");
  
    if (walletAddresses.length === 0) {
      console.log(
        "No NFTs have been claimed yet, maybe get some friends to claim your free NFTs!",
      );
      process.exit(0);
    }
    
    // faça um loop no array de endereços.
    const airdropTargets = walletAddresses.map((address) => {
      // Escolha um # aleatório entre 1000 e 10000.
      const randomAmount = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);
      console.log("✅ Going to airdrop", randomAmount, "tokens to", address);
      
      // Configure o alvo.
      const airdropTarget = {
        address,
        // Lembre-se, precisamos de 18 casas decimais!
        amount: ethers.utils.parseUnits(randomAmount.toString(), 18),
      };
  
      return airdropTarget;
    });
    
    // Chame transferBatch em todos os alvos do airdrop.
    console.log("🌈 Starting airdrop...")
    await tokenModule.transferBatch(airdropTargets);
    console.log("✅ Successfully airdropped tokens to all the holders of the NFT!");
  } catch (err) {
    console.error("Failed to airdrop tokens", err);
  }
})();
```

Isso é muita coisa. Mas você é um pro do thirdweb agora então GG!

Primeiro, você vai ver que precisamos tanto do `bundleDropModule` como do `tokenModule` porque vamos estar interagindo com ambos os contratos.

Primeiro precisamos pegar os titulares do nosso NFT do `bundleDropModule` e então cunhar para eles os seus tokens usando as funções do `tokenModule`.

Nós usamos `getAllClaimerAddresses` para pegar todos os `walletAddresses` das pessoas que tem nosso NFT de filiação com o token id `"0"`.

A partir daí, fazemos um loop através de todos os `walletAddresses` e escolhemos um `randomAmount` de tokens para dar para cada usuário e salvamos esses dados num dicionário `airdropTarget`.

Finalmente, rodamos `transferBatch` em todos os `airdropTargets`. E é isto! `transferBatch` vai automaticamente fazer um loop por todos os alvos e lhes mandar os tokens!

quando eu rodo o script eu recebo:

```plaintext
web3dev-dao-starter % node scripts/7-airdrop-token.js
✅ Going to airdrop 7376 tokens to 0xF79A3bb8d5b93686c4068E2A97eAeC5fE4843E7D
✅ Going to airdrop 9418 tokens to 0xc33817A8e3DD0687FB830666c2658eBBf4696245
✅ Going to airdrop 8311 tokens to 0xe50b229DC4D053b95fA586EBd1874423D9Be5145
✅ Going to airdrop 9603 tokens to 0x7FA42Aa5BF1CA8084f51F3Bab884c3aCB5180C86
✅ Going to airdrop 1299 tokens to 0xC122ECf38cfB18325FAC66ED62eC87169515BD77
✅ Going to airdrop 7708 tokens to 0x2Ba123871290cf55A8158D01F8EDC94f14A0e8Cb
🌈 Starting airdrop...
👋 Your app address is: 0xa002D595189bF9D50D5897C64b6e07BE5bdEe9b8
✅ Successfully airdropped tokens to all the holders of the NFT!
```

YOOOO. Você acabou de fazer um aidrop, isso aí!! No meu caso, você pode ver que eu tenho 6 membros únicos na minha DAO e todos eles receberam o airdrop. No seu caso, provavelmente vai ser só você por enquanto! Sinta-se à vontade para rodar esse script novamente quando novos membros se juntarem.

**No mundo real**, um airdrop geralmente acontece apenas uma vez. Mas nós estamos apenas aprendendo então está tudo bem. Além do mais, não existem regras de verdade nesse mundo lol. Se você quiser fazer 4 airdrops no dia faça!

Você poderia criar a sua própria fórmula como o ENS fez por exemplo:

![Untitled](https://i.imgur.com/IqboZsX.png)

Você pode pensar — “As pessoas que estão recebendo o token vão ter mais poder sobre a DAO. Isso é bom? Os maiores detentores de tokens vão fazer o que é certo pra DAO?”. Isso entra num tópico chamado tokenomics o qual você pode ler sobre [aqui](https://www.google.com/search?q=tokenomics).

Okay, então agora se eu for ver meu contrato ERC-20 na Etherscan, eu posso ver todos os meus novos detentores de tokens e quantos `$HOKAGE` eles tem.

É ISSO AÍ.

![Untitled](https://i.imgur.com/VrM2inr.png)

### 🚨 Relatório de Progresso

*Por favor faça isso ou danicuki vai ficar triste :(.*

Vá em frente e compartilhe uma captura de tela em `#progresso` do contrato do seu token na Etherscan que mostre o nome do token, fornecimento, etc!

**A propósito, se você chegou até aqui e está se divertindo -- talvez você queira tweetar que está construindo sua própria DAO e marcar [@Web3dev_](https://twitter.com/Web3dev_) :)?**