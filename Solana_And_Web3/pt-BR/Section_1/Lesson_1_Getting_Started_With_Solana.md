Antes de começarmos, assista [este](https://giphy.com/clips/hamlet-jJjb9AUHOiP3nJJMdy) vídeo muito importante, certifique-se de ativar o som passando o mouse sobre ele.

Ok, uma vez que você está distante, vamos seguir em frente!

Vamos começar com uma das coisas mais mágicas da web3, conectar-se a um produto com sua carteira.

Permitiremos que nosso usuário faça essencialmente "autenticação" com sua carteira Solana. Construir uma autenticação geralmente é bastante difícil. Você precisa ter um banco de dados de nomes de usuário, senha, etc.

Neste caso é **muito** mais fácil do que você imagina! Aqui está o plano:

1. Obtenha o código base do aplicativo da web para este projeto (forneci alguns HTML/CSS iniciais para que você possa se concentrar nas coisas que realmente importam *lol*).
2. Escreva o código que permitirá que os usuários conectem sua carteira Solana e se conectem ao seu aplicativo para configurar um estado básico de "autenticação".
3. Comece a escrever seu primeiro programa Solana com Rust + deploy no blockchain real.

Vai ser **MUITO HYPE**.

Uma coisa que realmente amamos na web3 é a criatividade insana que as pessoas colocam em seus projetos. Torne este projeto seu e faça as coisas da maneira que achar melhor.

**Se tudo que você está fazendo é apenas copiar/colar código, não vai ser tão divertido.**

O código base do aplicativo da Web que forneço é apenas para você começar. Mude as coisas. Talvez você odeie as cores que usei. Mude. Talvez você queira tornar o site mais temático de anime. Faça isso.

Se você acabar mudando as coisas, me marque em `#progress` e diga - "Hey Farza, eu fiz seu código melhor" e mande uma captura de tela.

Tudo bem - vamos fazer isso.

### 🏁 **Primeiros passos**

Usaremos o **React.js** para criar nosso aplicativo da Web. Se você já está familiarizado com o React, isso será muito fácil. Se você não conhece muito React, não se preocupe! Você ainda pode completar este projeto, mas pode parecer um pouco mais difícil.

Não desista, porém! Quanto mais você luta, mais aprende 🧠.

Se você não tem experiência com React - [confira esta série de introdução](https://scrimba.com/learn/learnreact) antes de começar com esta seção ou talvez confira os documentos de introdução [aqui](https:// reactjs.org/docs/getting-started.html). Ou não faça nada de especial, apenas continue. **O que funcionar melhor para você :).**

Você será um Mago do React após este projeto, se ainda não for 🧙‍♂!

### ⬇️ Obtendo o código

Usaremos essa coisa chamada [Replit](https://replit.com/~)!

É um IDE baseado em navegador que nos permite facilmente criar aplicativos web e fazer o deploy deles a partir do navegador. E é totalmente legal. Em vez de ter que configurar um ambiente local completo e escrever comandos para fazer o deploy, tudo é dado para a gente.

Observação: **Você não precisa usar o replit para criar + deploy do seu site. Se você quiser trabalhar localmente no VSCode e usar Vercel/Heroku/AWS para fazer o deploy e estiver confiante em suas habilidades de desenvolvimento web - isso é totalmente legal. [Aqui está o link](https://github.com/buildspace/gif-portal-starter) para o repositório base que você pode clonar e trabalhar localmente.**

Se você decidir ir com a Replit, faça uma conta lá antes de seguir em frente!

Já criei um projeto básico de React que você pode fazer um **fork** no Replit.

[Basta clicar aqui](https://replit.com/@adilanchian/gif-portal-starter-project?v=1) **e, à direita, você verá o botão "Fork".** Certifique-se você está logado, então clique no botão.

Você clonará magicamente meu repositório e IDE completo em seu navegador para trabalhar com o código. Quando ele parar de carregar e mostrar algum código, clique em "Run" na parte superior e pronto. Pode levar de 2 a 4 minutos na primeira vez.

**Observação: à medida que avança neste projeto, você pode notar que estamos fazendo referência a arquivos `.js`. No Replit, se você estiver criando novos arquivos JavaScript, precisará usar a extensão `.jsx`! Replit tem algumas frescuras de desempenho que obrigam que você use a extensão de arquivo `.jsx` :).**

[Aqui está um vídeo rápido](https://www.loom.com/share/8e8f47eacf6d448eb5d25b6908021035) que fiz para outro projeto, abordando alguns conceitos básicos da Replit.

Pronto, agora você tem um setup de frontend para seu aplicativo web3 😎.

### 🚨 Relatório de progresso

*Faça isso senão Farza vai ficar triste :(*

Poste uma captura de tela do seu aplicativo web inicial em `#progress` :).
**