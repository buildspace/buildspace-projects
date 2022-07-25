Um token de governança é legal e tal, mas é meio inútil se as pessoas não puderem usar para goevernar alguma coisa! O que nós vamos fazer aqui é configurar um contrato de governança que permite pessoas votarem em propostas usando seus tokens.

### 📝 Faça deploy de um contrato de governança.

Eu não quero complicar demais isso.

No fim do dia, o contrato de votação é literalmente uma maneira de permitir pessoas votarem em coisas, automaticamente contando seus votos, e então qualquer membro seria apto a executar a proposta on-chain. Tudo sem uma parte central.

Por exemplo, talvez você queira criar uma proposta tipo, *“Transferir 1000 tokens para EpicDesign5222 por refazer o design da nossa landing page”.* Quem é permitido votar? Por quanto tempo pessoas podem votar? Qual a quantidade mínima de tokens que alguém precisa para criar uma proposta?

Todas essas questões serão respondidas no contrato de votação inicial que nós criaremos

É quase como configurar um pequeno país e você precisa configurar o seu governo inicial + sistema de votação!

Vá para `8-deploy-vote.js` e adicione o seguinte:

```jsx
import sdk from "./1-initialize-sdk.js";

(async () => {
  try {
    const voteContractAddress = await sdk.deployer.deployVote({
      // Dê um nome para o seu contrato de governança.
      name: "MTBDAO - A DAO dos pedaleiros malucos",

      // Essa a localização do seu token de governança, nosso contrato ERC-20!
      voting_token_address: "INSIRA_O_ENDEREÇO_DO_TOKEN",

      // Depois de uma proposta ser criada, quando os membros podem começar a votar?
      // Por agora, colocamos isso como imediatamente.
      voting_delay_in_blocks: 0,

      // Por quanto tempo membros podem votar em uma proposta quando ela é criada?
      // Aqui, nós configuramos como 1 dia (6570 blocos)
      voting_period_in_blocks: 6570,

      // A % mínima da oferta total que precisa votar 
      // para que a proposta sejá válida
      voting_quorum_fraction: 0,

      // Qual a # mínima de tokens que um usuário precisa para poder criar uma proposta?
      // Eu coloco 0. Significando que nenhum token é necessário para um usuário poder
      // criar uma proposta.
      proposal_token_threshold: 0,
    });

    console.log(
      "✅ Módulo de votos implantado com sucesso no endereço:",
      voteContractAddress,
    );
  } catch (err) {
    console.error("Falha ao implantar o módulo de votos", err);
  }
})();

```

Nós estamos usando `deployer.deployVote` para de fato configurar o contrato. Isso vai fazer o deploy de um novo contrato de votação!

Perceba como nós damos um `voting_token_address`. Isso é o nosso contrato que sabe qual token de governança aceitar. Nós não queremos pessoas tentando aleatoriamente usar $DOGE para votar lol.

Nós temos `voting_delay_in_blocks`, que pode ser útil se você quer dar para as pessoas algum tempo para entender a proposta antes deles poderem votar nela. Similarmente, nós temos `voting_period_in_blocks` que especifica quanto tempo alguém tem para votar uma vez que a proposta está online.

`voting_quorum_fraction` é realmente interessante. Vamos dizer que um membro cria uma proposta e os outros **199** membros da DAO estão de férias na Disney World e não estão online. Bem, nesse caso, se um membro da DAO cria a proposta e vota "SIM" na sua própria proposta — isso signifca que 100% dos votos foram "SIM" (dado que só foi feito um voto) e a proposta **seria aprovada quando** `voting_period_in_blocks` terminasse! Para evitar isso, nós usamos um quorum que diz “Para uma proposta passar, um x mínimo da porcentagem dos tokens deve ser usado nos votos”.

Por exemplo, vamos fazer `voting_quorum_fraction: 0` o que significa que a proposta vai passar independentemente de qual % dos tokens foi usado nos votos. Isso significa que uma pessoa poderia tecnicamente passar uma proposta sozinho se todos os outros membros estivessem de férias lol. Por enquanto está tudo bem. O quorum que você configurar no mundo real depende do seu fornecimento e de quanto você fez de airdrop no início.

Finalmente, nós temos `proposal_token_threshold: 0` que permite qualquer pessoa criar uma propsta mesmo se ela tiver zero tokens de governança. Depende de você se você quer deixar isso assim! Vamos deixar em zero por agora.

Vá em frente e rode isso usando `node scripts/8-deploy-vote.js`. Aqui está o que eu recebo:

```plaintext
$ node scripts/8-deploy-vote.js 
👋 SDK inicializado pelo endereço: 0xf9aD3D930AB5df972558636A2B8749e772aC9297
✅ Módulo de votos implantado com sucesso no endereço: 0xB6f4Dcb245638F5C1b694FA8f28E4C37400A437b
```

Isso é bem legal. Basicamente, nós criamos e fizemos o deploy de um novo smart contract que vai nos permitir de fato votar em propostas on-chain. Esse é um contrato de [governança](https://docs.openzeppelin.com/contracts/4.x/api/governance?utm_source=web3dev&utm_medium=web3dev_project) padrão. Você pode ver o contrato exato que você fez o deploy [aqui](https://github.com/thirdweb-dev/contracts/blob/main/contracts/vote/VoteERC20.sol?utm_source=web3dev&utm_medium=web3dev_project).

Se você for para `https://rinkeby.etherscan.io/` você vai ver ele lá!

Então, agora nós temos três contratos: nosso contrato do NFT, o contrato do token, e o contrato de votação! Certifique-se de salvar o endereço do seu contrato de votação, nós vamos usá-lo novamente em um momento.

### 🏦 Configure seu tesouro

Agora nós temos o contrato de governança e podemos votar em coisas. Perfeito. Mas existe um problema.

**O contrato de votação sozinho não tem a habilidade de mover tokens de um lugar pro outro.** Por exemplo, vamos dizer que você queira criar a seguinte proposta agora “Mandar 1000 $BIKES para danicuki_montanheiro por ser um membro impressionante”. Isso na verdade não iria funcionar. *O contrato de votação não tem acesso aos tokens agora.*

Por que? **Porque você criou o fornecimento dos tokens. Sua carteira tem o acesso ao fornecimento inteiro. Então apenas você tem o poder de acesso aos fornecimento, mover tokens de um lado para o outro, fazer airdrops etc.** Basicamente, isso é uma ditadura haha. Aqui está o que vamos fazer — nós vamos transferir 90% de todos os nossos tokens para o contrato de votação. Uma vez que nosso token é movido para o contrato, ele tem acesso ao fornecimento de tokens.

**Isso vai essencialmente se tornar nosso “Tesouro Comunitário”.**

Aqui eu escolhi apenas 90% como um # aleatório. Na prática, depende. Por exemplo, aqui está como o ENS distruibiu seus tokens:

![](https://i.imgur.com/9rhwrzV.png)

Eles decidiram alocar 50% do fornecimento no tesouro comunitário! A tokenomics de cada DAO é tão diferente e não existe um padrão de como fazer as coisas no momento. Eu gosto muito de como o ENS fez. 50% para a comunidade, 25% em airdrops, e os outros 25% dado para o time central + contribuidores.

Vá para `9-setup-vote.js` e adicione o seguinte:

```jsx
import sdk from "./1-initialize-sdk.js";

// Esse é o nosso contrato de governança.
const vote = sdk.getVote("INSERIR_ENDEREÇO_DO_CONTRATO_DE_VOTOS");

// Esse é o nosso contrato ERC-20.
const token = sdk.getToken("INSERIR_ENDEREÇO_DO_TOKEN");

(async () => {
  try {
    // Dê para a nosso tesouro o poder de cunhar tokens adicionais se necessário.
    await token.roles.grant("minter", vote.getAddress());

    console.log(
      "✅  Módulo de votos recebeu permissão de manipular os tokens com sucesso"
    );
  } catch (error) {
    console.error(
      "falha ao dar acesso aos tokens ao módulo de votos",
      error
    );
    process.exit(1);
  }

  try {
    //Pegue o saldo de tokens da nossa carteira, lembre-se -- nós detemos basicamente o fornecimento inteiro agora!
    const ownedTokenBalance = await token.balanceOf(
      process.env.WALLET_ADDRESS
    );

    // Pegue 90% do fornecimento que nós detemos.
    const ownedAmount = ownedTokenBalance.displayValue;
    const percent90 = Number(ownedAmount) / 100 * 90;

    // Transfira 90% do fornecimento para nosso contrato de votação.
    await token.transfer(
      vote.getAddress(),
      percent90
    ); 

    console.log("✅ Transferiu " + percent90 + " tokens para o módulo de votos com sucesso");
  } catch (err) {
    console.error("falhar ao transferir tokens ao módulo de votos", err);
  }
})();

```

Um contrato bem simples aqui! Nós fazemos duas coisas:

1. Nós pegamos o # total de tokens que temos na nossa carteira usando `token.balanceOf`. Lembre-se, nesse momento nossa carteira tem basicamente o fornecimento inteiro além dos tokens que fizemos airdrop.
2. Nós pegamos o fornecimento total que temos, pegamos 90% disso, e transferimos esses 90% para o módulo de votação usando `token.transfer`. Você pode transferir 100% se você quiser! Mas, talvez você queira manter alguns tokens para você como o criador!

Uma vez que você terminar, nós podemos rodar isso usando `node scripts/9-setup-vote.js`. Aqui está o que eu recebo na minha saída:

```plaintext
$ node scripts/9-setup-vote.js 
👋 SDK inicializado pelo endereço: 0xf9aD3D930AB5df972558636A2B8749e772aC9297
✅ Módulo de votos recebeu permissão ao de manipular os tokens com sucesso
✅ Transferiu 887433.3 tokens para o módulo de votos com sucesso
```

Okay, preparado para ver algo épico? Vá para o seu contrato de votação no `https://rinkeby.etherscan.io/`. Clique no dropdown perto da palavra “Token”. Aqui você vai ver que meu contrato tem “887433,3 $BIKES” nele.

Isso meio que explodiu minha mente quando eu vi pela primeira vez. *Nós literalmente temos nosso próprio tesouro.*

*Nota: você talvez tenha uma quantidade diferente no seu tesouro baseado em quantos tokens estavam no seu fornecimento e quantos foram usados no airdrop.*

![](https://i.imgur.com/bdAUxM6.png)

### 🚨 Relatório de Progresso

*Por favor faça isso ou danicuki vai ficar triste :(.*

Vá em frente e compartilhe uma captura de tela do Etherscan em `#progresso` do seu fornecimento de tokens no seu contrato de votação. Vamos ver seu tesouro épico!