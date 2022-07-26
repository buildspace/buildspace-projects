### 📜 Crie as primeiras duas propostas da sua DAO.

Legal. Tudo está configurado agora, nós precisamos só criar nossa primeira proposta! Vá para `10-create-vote-proposals.js` e adicione o seguinte:

```jsx
import sdk from "./1-initialize-sdk.js";
import { ethers } from "ethers";

// Nosso contrato de votação.
const vote = sdk.getVote("INSIRA_O_ENDEREÇO_DO_VOTE");

// Nosso contrato ERC-20.
const token = sdk.getToken("INSIRA_O_ENDEREÇO_DO_TOKEN");

(async () => {
  try {
    const amount = 420_000;
    // Crie uma proposta para cunhar 420.000 novos tokens para o tesouro.
    const description = "Cunhar para a DAO uma quantidade adicional de " + amount + " tokens no tesouro?";

    const executions = [
      {
        // Nosso token module que de fato executa a cunhagem.
        toAddress: token.getAddress(),
        // Nosso nativeToken é ETH. nativeTokenValue é a quantidade de ETH que nós queremos 
        // mandar nessa proposta. Nesse caso, estamos mandando 0 ETH.
        // Nós estamos apenas cunhando novos tokens para o tesouro. Então, deixe 0.
        nativeTokenValue: 0,
          // Estamos fazendo uma cunhagem! E, estamos cunhando no vote, que está
          // agindo como nosso tesouro. 
          // nesse caso, usamos ethers.js para converter a quantidade
          // ao formato correto. Isso porque a quantidade precisa ser em wei
        transactionData: token.encoder.encode(
          "mintTo", [
            vote.getAddress(),
            ethers.utils.parseUnits(amount.toString(), 18),
          ]
        ),
      }
    ];

    await vote.propose(description, executions);


    console.log("✅ Proposta de cunhar tokens criada com sucesso!");
  } catch (error) {
    console.error("falha ao criar primeira proposta", error);
    process.exit(1);
  }

  try {
    // Crie uma proposta para transferir para nós mesmos 6,900 tokens por sermos irados.
    const amount = 6_900;

    const description = "A DAO deveria transferir " + amount + " tokens do tesouro para " +
      process.env.WALLET_ADDRESS + " por ser uma pessoa incrível?";

    const executions = [
      {
        // Novamente, estamos mandando para nós mesmos 0 ETH. Apenas mandando nosso próprio token.
        nativeTokenValue: 0,
        transactionData: token.encoder.encode(
          // Nós estamos fazendo uma transferência do tesouro para a nossa carteira.
          "transfer",
          [
            process.env.WALLET_ADDRESS,
            ethers.utils.parseUnits(amount.toString(), 18),
          ]
        ),

        toAddress: token.getAddress(),
      },
    ];

    await vote.propose(description, executions);

    console.log(
      "✅ Proposta de dar prêmio do tesouro para si mesmo criada com sucesso, vamos torcer para votarem sim!"
    );
  } catch (error) {
    console.error("falha ao criar segunda proposta", error);
  }
})();

```

Parece muita coisa. Vá em frente e leia passo a passo! Nós estamos criando duas novas propostas para membros votarem:

**1) Nós estamos criando uma proposta que permite o tesouro cunhar 420.000 novos tokens.** Você pode ver que fazemos um `mint` no código.

Talvez o tesouro está na baixa e queremos mais tokens para premiar membros. Lembre-se, mais cedo nós demos para o nosso contrato de votação a habilidade de cunhar novos tokens — então isso funciona! É um tesouro democrático. Se os membros acharem que essa proposta é estúpida e votarem “NÃO”, ela simplesmente não vai passar!

**2) Nós estamos criando uma proposta para transferir 6.900 tokens para a nossa carteira a partir do tesouro.** Você pode ver que nós fazemos uma `"transfer"` no código.

Talvez tenhamos feito algo legal e queremos ser recompensados por isso! No mundo real você criaria propostas para mandar tokens pra outras pessoas. Por exemplo, talvez alguém ajudou a codar um novo website para a DAO e quer ser recompensado por isso. Nós podemos mandar tokens para ele!

A propósito, eu quero fazer um comentário sobre `nativeTokenValue`. Digamos que queremos que nossa proposta faça algo como, "Nós queremos recompensar danicuki_biker por nos ajudar com marketing com 2500 tokens de governança e 0.1 ETH". Isso é bem legal! Quer dizer que você pode recompensar pessoas com ETH e tokens de governança — o melhor dos dois mundos. *Nota: Esses 0.1 ETH tem que estar no seu tesouro se quisermos enviá-lo!*

Quando eu rodo `node scripts/10-create-vote-proposals.js` eu recebo:

```plaintext
$ node scripts/10-create-vote-proposals.js
👋 SDK inicializado pelo endereço: 0xf9aD3D930AB5df972558636A2B8749e772aC9297
✅ Proposta de cunhar tokens criada com sucesso!
✅ Proposta de dar prêmio do tesouro para si mesmo criada com sucesso, vamos torcer para votarem sim!
```

BOOM. Aí estão nossas propostas. A última coisa que vamos fazer é de fato permitir que nosso usuários votem nas propostas no nosso DAO dashboard!

### ✍️ Permita que usuários votem nas propostas no dashboard.

Finalmente, vamos juntar tudo agora. Nesse momento, nossas propostas vivem no nosso smart contract. Mas nós queremos que os usuários as vejam facilmente e votem nelas! Vamos fazer isso. Vá para `App.jsx`. Adicione o hook `useVote` às importações:

```jsx
import { useAddress, useMetamask, useEditionDrop, useToken, useVote } from '@thirdweb-dev/react';
```

Vá em frente e adicione isso abaixo de `token`.

```jsx
const vote = useVote("INSIRA_O_ENDEREÇO_DO_VOTE");
```

Nosso web app precisa acessar nosso `vote` para que usuários possam interagir com nosso contrato.

A partir daqui, vamos adicionar o código abaixo em algum lugar em baixo da função `shortenAddress`:

```jsx
const [proposals, setProposals] = useState([]);
const [isVoting, setIsVoting] = useState(false);
const [hasVoted, setHasVoted] = useState(false);

// Recupere todas as propostas existentes no contrato. 
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }
  // Uma chamada simples para vote.getAll() para pegar as propostas.
  const getAllProposals = async () => {
    try {
      const proposals = await vote.getAll();
      setProposals(proposals);
      console.log("🌈 Propostas:", proposals);
    } catch (error) {
      console.log("falha ao buscar propostas", error);
    }
  };
  getAllProposals();
}, [hasClaimedNFT, vote]);

// Nós também precisamos checar se o usuário já votou.
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }

  // Se nós não tivermos terminado de recuperar as propostas do useEffect acima
  // então ainda nao podemos checar se o usuário votou!
  if (!proposals.length) {
    return;
  }

  const checkIfUserHasVoted = async () => {
    try {
      const hasVoted = await vote.hasVoted(proposals[0].proposalId, address);
      setHasVoted(hasVoted);
      if (hasVoted) {
        console.log("🥵 Usuário já votou");
      } else {
        console.log("🙂 Usuário ainda não votou");
      }
    } catch (error) {
      console.error("Falha ao verificar se carteira já votou", error);
    }
  };
  checkIfUserHasVoted();

}, [hasClaimedNFT, proposals, address, vote]);
```

Estamos fazendo duas coisas aqui!

No primeiro `useEffect` estamos fazendo `vote.getAll()` para pegar todas as propostas que existem no nosso contrato de governança e então fazemos `setProposals` para que possamos renderizá-las depois.

No segundo useEffect, nós estamos fazendo `vote.hasVoted(proposals[0].proposalId, address)` que checa se esse endereço já votou na primeira proposta. Se sim, então nós fazemos `setHasVoted` para que o usuário não possa votar novamente! Mesmo se nós não tivéssemos isso, nosso contrato rejeitaria a transação se um usuário tentasse votar duas vezes!

A magia do thirdweb é que não somente é fácil fazer deploy de smart contracts, também é fácil interagir com eles diretamente do nosso cliente com funções simples como `vote.getAll()`!

Vá em frente e atualize sua página, você deve ver suas propostas impressas perto do 🌈 e você pode explorar todos os dados!

![Untitled](https://i.imgur.com/tNhXvHY.png)

E se você já votou, você vai ver algo assim:

![Untitled](https://i.imgur.com/zOQ6Rim.png)

O próximo pedaço de código é massivo lol. Ele lida com de fato renderizar as propostas que nós recuperamos para que os usuários possam ter três opções de voto:

1) A Favor

2) Contra

3) Abstençãoa

Se você tem familiaridade com React/JS, você pode facilmente dar uma olhada e entender como funciona sozinho. Se você não sabe React/JS muito bem, não se preocupe. Só copie e cole. Sem vergonha mesmo!

Adicione o `AddressZero` nas importações:

```jsx
import { AddressZero } from "@ethersproject/constants";
```

Vá em frente e substitua o conteúdo de `if (hasClaimedNFT) { }` com este código [aqui](https://gist.github.com/danicuki/ed841dfdea802b3bb9d887d3be59c67c#file-app-jsx-L188).

Quando você checar seu web app, você verá algo como:

![Untitled](https://i.imgur.com/Xl9PiJz.png)

Muito legal. Agora você pode usar esses botões para votar.

Nós configuramos nosso contrato de governança para terminar a votação depois de 24 horas. Isso significa que depois de 24 horas se:
```plaintext
votos "para" a proposta > votos "contra" a proposta
```

Então qualquer membro deve ser apto a executar a proposta através do nosso contrato de governança. Propostas não podem ser executadas automaticamente. Mas, uma vez que uma proposta passa, **qualquer membro** da DAO pode acionar a proposta aceita.

Por exemplo. Digamos que nós estamos lidando com a proposta em que estamos cunhando 420.000 tokens adicionais. se `votos "para" a propsta > votos "contra" a proposta` — então qualquer pessoa pode acionar a proposta e nosso contrato irá cunhar os tokens. Bem louco, certo? Nós não precisamos confiar em ninguém além da blockchain.

Imagine estar num país de corruptos, votando por algo, e então o seu governo mente para você e diz “Ei na verdade nós não conseguimos tokens suficientes rs” quando na verdade conseguiram sim. Ou imagine que eles falamm, “Okay, nós temos votos suficientes e nós vamos fazer isso que nós prometemos” e nunca fazem!

Nesse caso, tudo está codificado e código não mente.

De qualquer forma, agora não é a hora de discutir como DAOs podem potencialmente melhorar nossos governos ;). Precisamos terminar nossa DAO meme, aqui e agora! Estamos tão perto.

### 🚨 Relatório de Progresso

*Por favor faça isso ou Yan vai ficar triste :(.*

Vá em frente e compartilhe uma captura de tela do seu DAO dashboard mostrando sua lista de membros + sistema de votação em `#progresso`!
