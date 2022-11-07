Isso vai ser BOM DEMAIS. Eu me diverti muito fazendo a loja, colocando todo tipo de bobagem que não pertence a uma loja. Imagine uma loja que vende itens imaginários.

Vamos começar com uma das coisas mais mágicas da web3, conectar-se a um aplicativo com sua carteira.

Permitiremos que nosso usuário essencialmente "faça login" com sua carteira Solana. A construção da autenticação geralmente é bem difícil. Você precisa ter um banco de dados de nomes de usuário, senha, etc. Eu odeio como as lojas sempre pedem seu endereço de e-mail, nome de solteira da mãe, tamanho da meia esquerda e pontuação ELO do Lichess. Apenas deixe-me comprar minha única cópia do JavaScript para Leigos e sair daqui.

Neste caso é muito mais fácil do que você imagina! Aqui está o plano:

1. Obtenha o código base do aplicativo da Web para este projeto (forneci alguns HTML/CSS iniciais para que você possa se concentrar nas coisas que realmente importam rsrs).
2. Escreva o código que permitirá que os usuários conectem sua carteira Solana e se conectem ao seu aplicativo para configurar um estado de "autenticação" básico.
3. Configure um item que você deseja vender no IPFS.
4. Comece a escrever o código Solana Pay para receber pagamentos.

Vai ser **MUITO MASSA**!

Uma coisa que realmente amamos no buildspace é a criatividade insana que as pessoas colocam em seus projetos. Torne este projeto seu e faça as coisas da maneira que achar melhor.

**Se tudo o que você está fazendo é copiar/colar código, isso não será tão divertido.**

O código base do aplicativo da Web que forneço é apenas para você começar. Mude as coisas. Talvez você odeie as cores que usei. Mude. Talvez você queira o site com um tema em modo mais claro. Faça isso.

Se você acabar mudando as coisas, me marque em #progress e diga - "Yo Raza I made your code better" e poste uma captura de tela.

Então pronto - mão na massa!

### 🏁 Começando

Vamos usar o **Next.js** para construir nosso aplicativo da web. É um framework **construído em cima do React.js**. Se você já está familiarizado com o React, isso será muito fácil. Se você não praticou muito com o React, não se preocupe! Você ainda pode passar por este projeto, mas pode ser um pouco mais difícil.

Porém não desista! Quanto mais dificuldades você passa, mais você aprende 🧠.

Se você não tem experiência com React ou Next - confira [este tutorial de introdução](https://www.freecodecamp.org/news/nextjs-tutorial/) antes de começar, ou talvez confira os documentos de introdução [aqui](https://nextjs.org/learn/foundations/about-nextjs). Ou não faça nada de especial, apenas comece. O que for melhor para você :).

Você será um Feiticeiro em Next após este projeto… isso se você já não for um 🧙‍♂!

Na verdade, eu escrevi este projeto primeiro no React, mas o migrei para o Next por causa do servidor embutido. Isso torna as coisas muuuuito fáceis e você não precisa lidar com o Express.js.

### ⬇️ Obtendo o código

Vá até [este link](https://github.com/buildspace/solana-pay-starter) e clique em "Fork" no canto superior direito.

![](https://i.imgur.com/OnOIO2A.png)

Ótimo! Quando você bifurca esse repositório, na verdade você está criando uma cópia idêntica dele que reside no seu perfil do GitHub. Então agora você tem sua própria versão deste código que você pode editar para o conteúdo que desejar.

A etapa final aqui é realmente obter o repositório recém-bifurcado em sua máquina local. Clique no botão "Code" e copie o link!

Vá para o seu terminal e faça cd para o diretório em que seu projeto ficará. Eu recomendo colocá-lo em uma pasta conhecida onde você tem outros projetos. Estou colocando o meu na área de trabalho.

```
# Estou executando isso no meu diretório "Desktop/"
git clone LINK_DA_BIFURCAÇÃO
cd solana-pay-starter
```

É isso! A partir daí, vá em frente e execute:

```
npm install
```

Um erro pode ocorrer se você não tiver o Node instalado. Você pode instalá-lo via NVM, seguindo [estas instruções](https://github.com/nvm-sh/nvm#installing-and-updating).

Agora você pode executar o aplicativo Web localmente com:

```
npm run dev
```

Isso deve abrir o aplicativo em seu navegador em localhost:3000. Seu aplicativo está vazio agora, exatamente como queremos. Esta vai ser a nossa tela em branco, que daremos vida de acordo com o nosso gosto. Por enquanto, basta atualizar o texto para o que quiser!

Para quem quer começar do zero: atenção! As bibliotecas Solana Pay são novinhas em folha. Isso significa que, se você configurar do zero usando o Create-React-App, terá [vários problemas](https://github.com/solana-labs/wallet-adapter/issues/241).. Eu passei por esses problemas de antemão e deixei tudo pronto para você!

Você pode estar se perguntando "Hmm, como o Raza faz isso? Que segredos ele está escondendo de mim?". Bem, caro leitor, uma das primeiras coisas que todo projeto lança são **os modelos**, para que pioneiros como *você* possam trabalhar em vez de desperdiçar tempo nas configurações. Dei uma olhada nos documentos e [encontrei esses modelos iniciais](https://github.com/solana-labs/wallet-adapter/tree/master/packages/starter). Tudo o que fiz foi converter o modelo inicial do Next.js do TypeScript para JavaScript e adicionei várias estilizações.

E simples assim, você tem uma configuração de frontend para sua loja 😎. Veja como ficou a minha:

![](https://hackmd.io/_uploads/Hy9JJK8Pq.png)

### 🚨 Relatório de progresso

Por favor, faça isso, senão o Raza vai ficar triste :(

Brinque com a sua página inicial! Talvez dar outro nome? Que tipo de coisa você quer vender? Esta é a sua chance de ser criativo!

**Poste uma captura de tela do seu aplicativo da Web inicial em #progress :).**
