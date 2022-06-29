Um token de governança é legal e tal, mas é meio inútil se as pessoas não puderem usar para goevrnar alguma coisa! O que nós vamos fazer aqui é configurar um contrato de governança que permite pessoas votarem em propostas usando seus tokens.

### 📝 Faça deploy de um contrato de governança.

Eu não quero complicar demais isso.

No fim do dia, o contrato de votação é literalmente uma maneira de permitir pessoas votarem em coisas, automaticamente contando seus votos, e então qualquer membro seria apto a executar a proposta on-chain. Tudo sem uma parte central.

Por exemplo, talvez você queira criar uma proposta tipo, *“Transferir 1000 tokens para EpicDesign5222 por refazer o design da nossa landing page”.* Quem é permitido votar? Por quanto tempo pessoas podem votar? Qual a # mínima de tokens que alguém precisa para criar uma proposta?

Todas essas questões serão respondidas no contrato de votação inicial que nós criaremos

É quase como configurar um pequeno país e você precisa configurar o seu governo inicial + sistema de votação!

Vá para `8-deploy-vote.js` e adicione o seguinte:

```jsx
import sdk from "./1-initialize-sdk.js";

// Pegue o endereço do app module.
const appModule = sdk.getAppModule(
  "INSIRA_O_ENDEREÇO_DO_APP_MODULE",
);

(async () => {
  try {
    const voteModule = await appModule.deployVoteModule({
      // Dê um nome para o seu contrato de governança.
      name: "NarutoDAO's Epic Proposals",

      // Essa a localização do seu token de governança, nosso contrato ERC-20!
      votingTokenAddress: "INSIRA_O_ENDEREÇO_DO_TOKEN_MODULE",

      // Depois de uma proposta ser criada, quando os membros podem começar a votar?
      // Por agora, colocamos isso como imediatamente.
      proposalStartWaitTimeInSeconds: 0,

      // Por quanto tempo membros podem votar em uma proposta quando ela é criada?
      // Aqui, nós configuramos como 24 horas (86400 segundos)
      proposalVotingTimeInSeconds: 24 * 60 * 60,

      // Vou explicar melhor abaixo.
      votingQuorumFraction: 0,

      // Qual a # mínima de tokens que um usuário precisa para poder criar uma proposta?
      // Eu coloco 0. Significando que nenhum token é necessário para um usuário poder
      // criar uma proposta.
      minimumNumberOfTokensNeededToPropose: "0",
    });

    console.log(
      "✅ Successfully deployed vote module, address:",
      voteModule.address,
    );
  } catch (err) {
    console.error("Failed to deploy vote module", err);
  }
})();

```

Nós estamos usando `deployVoteModule` para de fato configurar o contrato. Isso vai fazer o deploy de um novo contrato de votação!

Perceba como nós damos um `votingTokenAddress`. Isso é o nosso contrato que sabe qual token de governança aceitar. Nós não queremos pessoas tentando aleatoriamente usar $DOGE para votar lol.

Nós temos `proposalStartWaitTimeInSeconds`, que pode ser útil se você quer dar para as pessoas algum tempo para entender a proposta antes deles poderem votar nela. Similarmente, nós temos `proposalVotingTimeInSeconds` que especifica quanto tempo alguém tem para votar uma vez que a proposta está online.

`votingQuorumFraction` é realmente interessante. Vamos dizer que um membro cria uma proposta e os outros **199** membros da DAO estão de férias na Disney World e não estão online. Bem, nesse caso, se um membro da DAO cria a proposta e vota "SIM" na sua própria proposta — isso signifca que 100% dos votos foram "SIM" (dado que só foi feito um voto) e a proposta **seria aprovada quando** `proposalVotingTimeInSeconds` terminasse! Para evitar isso, nós usamos um quorum que diz “Para uma proposta passar, um x mínimo da porcentagem dos tokens deve ser usado nos votos”.

Por exemplo, vamos fazer `votingQuorumFraction: 0` o que significa que a proposta vai passar independentemente de qual % dos tokens foi usado nos votos. Isso significa que uma pessoa poderia tecnicamente passar uma proposta sozinho se todos os outros membros estivessem de férias lol. Por enquanto está tudo bem. O quorum que você configurar no mundo real depende do seu fornecimento e de quanto você fez de airdrop no início.

Finalmente, nós temos `minimumNumberOfTokensNeededToPropose: "0"` que permite qualquer pessoa criar uma propsta mesmo se ela tiver zero tokens de governança. Depende de você se você quer deixar isso assim! Vamos deixar em zero por agora.

Vá em frente e rode isso usando `node scripts/8-deploy-vote.js`. Aqui está o que eu recebo:

```plaintext
web3dev-dao-starter % node scripts/8-deploy-vote.js
✅ Successfully deployed vote module, address: 0xFE667920172882D0695E199b361E94325F0641B6
👋 Your app address is: 0xa002D595189bF9D50D5897C64b6e07BE5bdEe9b8

```

Isso é bem legal. Basicamente, nós criamos e fizemos o deploy de um novo smart contract que vai nos permitir de fato votar em propostas on-chain. Esse é um contrato de [governança](https://docs.openzeppelin.com/contracts/4.x/api/governance) padrão. Você pode ver o contrato exato que você fez o deploy [REVIEW](https://github.com/nftlabs/nftlabs-protocols/blob/main/contracts/vote/VotingGovernor.sol).

Se você for para `https://rinkeby.etherscan.io/` você vai ver ele lá!

Então, agora nós temos três contratos: nosso contrato do NFT, o contrato do token, e o contrato de votação! Certifique-se de salvar o endereço do seu contrato de votação, nós vamos usá-lo novamente em um momento.

### 🏦 Configure a sua tesouraria.

Agora nós temos o contrato de governança e podemos votar em coisas. Perfeito. Mas existe um problema.

**O contrato de votação sozinho não tem a habilidade de mover tokens de um lugar pro outro.** Por exemplo, vamos dizer que você queira criar a seguinte proposta agora “Mandar 1000 $HOKAGE para NarutoLover67 por ser um membro impressionante”. Isso na verdade não iria funcionar. *O contrato de votação não tem acesso aos tokens agora.*

Por que? **Porque você criou o fornecimento dos tokens. Sua carteira tem o acesso ao fornecimento inteiro. Então apenas você tem o poder de acesso aos fornecimento, mover tokens de um lado para o outro, fazer airdrops etc.** Basicamente, isso é uma ditadura haha. Aqui está o que vamos fazer — nós vamos transferir 90% de todos os nossos tokens para o contrato de votação. Uma vez que nosso token é movido para o contrato, ele tem acesso ao fornecimento de tokens.

**Isso vai essencialmente se tornar nossa “Tesouraria Comunitária”.**

Aqui eu escolhi apenas 90% como um # aleatório. Na prática, depende. Por exemplo, aqui está como o ENS distruibiu seus tokens:

![](https://i.imgur.com/9rhwrzV.png)

Eles decidiram alocar 50% do fornecimento na sua tesouraria comunitária! A tokenomics de cada DAO é tão diferente e não existe um padrão de como fazer as coisas no momento. Eu gosto muito de como o ENS fez. 50% para a comunidade, 25% em airdrops, e os outros 25% dado para o time central + contribuidores.

Vá para `9-setup-vote.js` e adicione o seguinte:

```jsx
import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// Esse é o nosso contrato de governança.
const voteModule = sdk.getVoteModule(
  "INSERIR_ENDEREÇO_DO_VOTING_MODULE",
);

// Esse é o nosso contrato ERC-20.
const tokenModule = sdk.getTokenModule(
  "INSERIR_ENDEREÇO_DO_TOKEN_MODULE",
);

(async () => {
  try {
    // Dê para a nossa tesouraria o poder de cunhar tokens adicionais se necessário.
    await tokenModule.grantRole("minter", voteModule.address);

    console.log(
      "Successfully gave vote module permissions to act on token module"
    );
  } catch (error) {
    console.error(
      "failed to grant vote module permissions on token module",
      error
    );
    process.exit(1);
  }

  try {
    //Pegue o saldo de tokens da nossa carteira, lembre-se -- nós detemos basicamente o fornecimento inteiro agora!
    const ownedTokenBalance = await tokenModule.balanceOf(
      process.env.WALLET_ADDRESS
    );

    // Pegue 90% do fornecimento que nós detemos.
    const ownedAmount = ethers.BigNumber.from(ownedTokenBalance.value);
    const percent90 = ownedAmount.div(100).mul(90);

    // Transfira 90% do fornecimento para nosso contrato de votação.
    await tokenModule.transfer(
      voteModule.address,
      percent90
    );

    console.log("✅ Successfully transferred tokens to vote module");
  } catch (err) {
    console.error("failed to transfer tokens to vote module", err);
  }
})();

```

Um contrato bem simples aqui! Nós fazemos duas coisas:

1. Nós pegamos o # total de tokens que temos na nossa carteira usando `tokenModule.balanceOf`. Lembre-se, nesse momento nossa carteira tem basicamente o fornecimento inteiro além dos tokens que fizemos airdrop.
2. Nós pegamos o fornecimento total que temos, pegamos 90% disso, e transferimos esses 90% para o módulo de votação usando `tokenModule.transfer`. Você pode transferir 100% se você quiser! Mas, talvez você queira manter alguns tokens para você como o criador!

Uma vez que você terminar, nós podemos rodar isso usando `node scripts/9-setup-vote.js`. Aqui está o que eu recebo na minha saída:

```plaintext
web3dev-dao-starter % node scripts/9-setup-vote.js
👋 Your app address is: 0xa002D595189bF9D50D5897C64b6e07BE5bdEe9b8
✅ Successfully gave vote module permissions to act on token module
✅ Successfully transferred tokens to vote module

```

Okay, preparado para ver algo épico? Vá para o seu contrato de votação no `https://rinkeby.etherscan.io/`. Clique no dropdown perto da palavra “Token”. Aqui você vai ver que meu contrato tem “844,527 $HOKAGE” nele.

Isso meio que explodiu minha mente quando eu vi pela primeira vez. *Nós literalmente temos nossa própria tesouraria.*

*Nota: você talvez tenha uma quantidade diferente na sua tesouraria baseado em quantos tokens estavam no seu fornecimento e quantos foram usados no airdrop.*

![](https://i.imgur.com/4AA5nlb.png)

### 🚨 Relatório de Progresso

*Por favor faça isso ou danicuki vai ficar triste :(.*

Vá em frente e compartilhe uma captura de tela do Etherscan em `#progresso` do seu fornecimento de tokens no seu contrato de votação. Vamos ver sua tesouraria épica!