## 🤯 Replit

Nós vamos usar essa coisa chamada  [Replit](https://replit.com/~)!

É uma IDE no navegador que nos permite construir web apps facilmente e fazer deploy de todos eles pelo navegador. É legítimo. Ao invés de ter que configurar todo um ambiente local e escrever comandos para fazer o deploy, tudo isso é dado para nós.

Nota: **Você não precisa usar o replit para construir + fazer deploy do seu site. Se você quer trabalhar localmente no VSCode e usar Vercel/Heroku/AWS para fazer o deploy e está confiante nas suas habilidades com web dev -- está tudo certo. [Aqui](https://github.com/buildspace/buildspace-nft-course-starter) está um link para o repositório base, você pode cloná-lo e trabalhar localmente.**

Crie uma conta no Replit antes de seguir em frente.

Eu já criei um projeto básico em react que você pode fazer o  **fork** no Replit.  **Apenas vá [aqui](https://replit.com/@adilanchian/nft-starter-project?v=1), e perto da direita você verá o botão de Fork.** Tenha certeza que você está logado, e clique nisso.

Você irá magicamente clonar meu repositório e a IDE inteira no seu navegador para trabalhar com o código. Uma vez que parar de carregar e mostrar algum código, clique em "run" em cima e você está pronto. Pode levar 2 a 4 minutos na primeira vez.

**Nota: Ao longo desse projeto, você pode perceber que nós estamos referenciando arquivos `.js`. No Replit, se você estiver criando novos arquivos JavaScript, você vai precisar usar a extensão `.jsx`! Replit tem algumas performances chiques que pedem que você usa `.jsx` na extensão de arquivo :).**

## 🦊 Configurar o Metamask

Incrível, nós temos um projeto em React **já feito o deploy** que podemos trabalhar facilmente. Isso foi simples :).

Após isso, precisamos de uma carteira Ethereum. Existem muitas, mas para esse projeto, vamos usar o Metamask. Baixe a extensão de navegador e configure sua carteira [aqui](https://metamask.io/download.html). Mesmo que você já usar outra carteira, só use o Metamask por agora.

Porque precisamos do Metamask? Bom. Precisamos estar habilitados a chamar funções no nosso contrato inteligente que vive na blockchain. E, para fazer isso, precisamos ter uma carteira que tem o nosso endereço Ethereum e a chave privada.

**Mas, precisamos de algo para conectar o nosso site com nossa carteira, para que possamos passar com segurança nossas credenciais para nosso site. O site pode então usar as credenciais para chamar o contrato inteligente. Assim, você precisará de credenciais válidas para acessar funções nos contratos inteligentes.**

É quase como uma autenticação. Nós precisamos de algo para "logar" na blockchain e depois usar essas credenciais para fazer requests na API pelo nosso site.

Então, vá em frente e configure tudo! O flow de configuração do Metamask é bem auto-explicativo :).