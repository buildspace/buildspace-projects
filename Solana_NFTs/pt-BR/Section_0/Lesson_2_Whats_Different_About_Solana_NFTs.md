### 🐸 Metaplex

Fazendo uma rápida revisão, nosso objetivo é criar um aplicativo da web que permita ao usuário **conectar sua carteira, clicar em cunhar e receber um NFT de nossa coleção em sua carteira**. Simples o suficiente!

Faremos isso usando o [Metaplex](https://www.metaplex.com).

Basicamente, o Metaplex é o padrão NFT na Solana, o qual criou um conjunto de ferramentas e bibliotecas padronizadas de criação de NFTs. Mais de US$1 bilhão em vendas foram feitos até agora em NFTs que usam o padrão Metaplex.

Então, como isso funciona?

Bem, vamos comparar! Na Ethereum, para criar um NFT, o que faríamos é criar nosso próprio contrato NFT/OpenZeppelin ERC-721 e implantá-lo, certo? Então, quando quisermos cunhar um NFT, basta chamar a função mint em nosso contrato personalizado.

Utilizar o Metaplex é **bem** diferente. Com o Metaplex **não** precisamos redigir nosso próprio contrato. O Metaplex já implantou seus próprios contratos NFT padrão com os quais **qualquer desenvolvedor** pode interagir e construir suas próprias coleções de NFTs.

Isso é meio louco. É como se fosse um contrato-inteligente-como-um-serviço (risos).

Alguns de vocês podem dizer algo como "Que chato isso! Quero eu mesmo criar um programa personalizado". Você pode totalmente fazer isso. [Aqui está](https://github.com/metaplex-foundation/metaplex-program-library/blob/master/candy-machine/program/src/lib.rs) o código. Mas, é bem complexo. Por quê? Principalmente porque a Solana permite transações paralelas. Portanto, seu código precisa levar em conta casos como "se 5 pessoas forem cunhar um NFT ao mesmo tempo e apenas restarem 2 NFTs, quem levará?".

Na Ethereum isso é fácil. É tudo síncrono e atômico, então não precisamos pensar nisso. Mas, parte do marketing da Solana é que ela pode fazer transações paralelas, o que a torna mais rápida. **Mas, isso torna o código mais complexo**. Assim, ferramentas como o Metaplex são extremamente úteis. Elas lidam com os casos extremos para nós e nos dão um contrato inteligente com o qual podemos interagir.

### 🍭 Candy Machine (Máquina de Doces)

Falaremos muito sobre essa coisa chamada "Candy Machine" ao longo do projeto. Uma Candy Machine é o que o Metaplex chama de um drop básico de NFTs, onde os usuários podem entrar, clicar em cunhar e obter um NFT.

Uma coisa que é muito especial sobre a Candy Machine é que ela não aceitará os fundos de um usuário se não houver mais NFTs para vender. Bem, isso pode parecer algo bem trivial, mas no mundo da computação paralela é realmente difícil. Por exemplo, vejamos este caso:

1. Sobrou um NFT.
2. A pessoa A e a pessoa B clicam em cunhar ao mesmo tempo.
3. Em paralelo, o contrato inteligente verifica se a Pessoa A e a Pessoa B têm fundos para pagar o NFT. Ambos têm. Ele verifica se existem NFTs restantes, existem.
4. O programa retira fundos da conta da Pessoa A e da conta da Pessoa B para pagar o NFT.
5. O programa irá cunhar um NFT para a Pessoa B que teve a compra processada primeiro em paralelo. A pessoa A recebe um erro como - "Não há mais NFTs".
6. A pessoa A perde a corrida e fica triste, e agora perdeu dinheiro em um NFT que nunca recebeu. A pessoa B está feliz.

Este é um problema clássico na computação paralela. A correção é usar algo chamado [mutex](https://doc.rust-lang.org/std/sync/struct.Mutex.html) junto com uma [transação atômica](https://en.wikipedia.org/wiki/Atomicity_(database_systems)), que são decentemente complexos de implementar.

**A Candy Machine do Metaplex implementa isso para nós :).**

A Candy Machine também tem algumas outras coisas interessantes que vamos cobrir depois, mas espero que esta visão geral te ajude mais tarde! Sinta-se à vontade para voltar a ela assim que se aprofundar mais nas coisas da Candy Machine.

Nota: Não vamos explicar o que são os NFTs aqui. Se você está confuso sobre o que é um NFT, confira [esta](https://github.com/w3b3d3v/buildspace-projects/blob/main/NFT_Collection/pt-br/Section_1/Lesson_1_What_is_a_NFT.md) seção rápida de bônus que escrevemos.