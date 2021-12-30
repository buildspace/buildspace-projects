🔤 Gerando randomicamente palavras em uma imagem.
------------------

Bacana — nós criamos um contrato que agora cria NFTs dentro da rede (on-chain). Mas ainda é sempre o mesmo NFT argh !!! Vamos torná-lo dinâmico. 

**Eu escrevi esse código [aqui](https://gist.github.com/farzaa/b788ba3a8dbaf6f1ef9af57eefa63c27) que irá gerar um SVG com uma combinação de três palavras aleatórias.**

Eu acho que essa seria a melhor maneira para as pessoas olharem todo o código de uma vez e entender como ele está funcionando.

Eu também escrevi um comentário acima da maioria das linhas que adicionei/alterei! Quando você olhar para este código, tente escrevê-lo você mesmo. Pesquise no Google as funções que você não entende!

Eu quero fazer algumas observações sobre algumas dessas linhas.

📝 Escolha as suas próprias palavras.
------------------

```solidity
string[] firstWords = ["YOUR_WORD", "YOUR_WORD", "YOUR_WORD", "YOUR_WORD", "YOUR_WORD", "YOUR_WORD"];

string[] secondWords = ["YOUR_WORD", "YOUR_WORD", "YOUR_WORD", "YOUR_WORD", "YOUR_WORD", "YOUR_WORD"];

string[] thirdWords = ["YOUR_WORD", "YOUR_WORD", "YOUR_WORD", "YOUR_WORD", "YOUR_WORD", "YOUR_WORD"];
```

Estas são nossas palavras aleatórias!! Por favor, divirta-se com isso. Certifique-se de que cada palavra seja única e sem espaços!

Quanto mais engraçadas as palavras, melhor será rs. Eu gostei de fazer de cada array um determinado tema. Por exemplo, `firstWords` pode ser o primeiro nome de seus personagens favoritos de anime. Então, `secondWords` pode ser um alimento de que você goste. E `thirdWords` podem ser nomes de animais aleatórios. Divirta-se com isso!!! Deixe com a sua cara

Aqui estão alguns dos meus. Eu gosto que a primeira linha tenha palavras que parecem "descrever" algo!

![](https://i.imgur.com/ADawgrB.png)

Talvez você queira gerar um nome de banda aleatório. Talvez você queira gerar nomes de personagens aleatórios para suas sessões de Dungeons and Dragons. Faça o que você quiser. Talvez você não dê a mínima para combinações de três palavras e só queira fazer SVGs de pinguins de pixel art. Vá em frente. Faça o que você quiser :).

Observação: Eu comendo entre 15-20 palavras por array. Notei que cerca de 10 geralmente não é aleatório o suficiente.

🥴 Números aleatórios.
------------------

```solidity
function pickRandomFirstWord
```

Esta função parece meio descoladona, né? Vamos falar sobre como estamos escolhendo aleatoriamente as coisas dos arrays

Então, gerar um número aleatório em contratos inteligentes é amplamente conhecido como um **problema difícil**.

Por quê? Bem, pense em como um número aleatório é gerado normalmente. Quando você gera um número aleatório normalmente em um programa, **pegará vários números diferentes de seu computador como uma fonte de aleatoriedade** como: a velocidade das ventoinhas, a temperatura da CPU, o número de vezes que você pressionou "L" às 15:52 desde que comprou o computador, a velocidade da sua internet e vários outros variáveis que são difíceis de controlar. Ele pega **todos** esses números que são "aleatórios" e os coloca juntos em um algoritmo que gera um número que parece ser a melhor tentativa de um número verdadeiramente "aleatório". Fez sentido?

No blockchain, não há **quase nenhuma fonte de aleatoriedade**. É determinista e tudo o que o contrato vê, o público vê. Por causa disso, alguém poderia enganar o sistema apenas olhando para o smart contract, vendo em que variável ele se baseia para aleatoriedade, e então a pessoa poderia manipulá-lo, se quisesse.

```solidity
random(string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId))));
```

O que isso está fazendo é pegar duas coisas: a string atual `FIRST_WORD` e uma versão stringificada do` tokenId`. Eu combino essas duas strings usando `abi.encodePacked` e então essa string combinada é o que eu uso como fonte de aleatoriedade.

**Isso não é aleatoriedade verdadeira.** Mas é o melhor que temos por agora!

There are other ways to generate random numbers on the blockchain (check out [Chainlink](https://docs.chain.link/docs/chainlink-vrf/)) but Solidity doesn't natively give us anything reliable because it can't! All the #'s our contract can access are public and never truly random.

Existem outras maneiras de gerar números aleatórios no blockchain (verifique o [Chainlink] (https://docs.chain.link/docs/chainlink-vrf/)), mas o Solidity nativamente não nos dá nada confiável porque não pode! Todos as varaiveis que nosso contrato pode acessar são públicas e nunca verdadeiramente aleatórios.

Isso pode ser um pouco irritante para alguns aplicativos como o nosso aqui! Em qualquer caso, ninguém vai atacar nosso pequeno aplicativo, mas quero que você saiba de tudo isso quando estiver construindo um dApp que tem milhões de usuários!

✨  Criando o SVG dinamicamente.
------------------
