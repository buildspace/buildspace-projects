### 💎 O que iremos fazer.

Nós vamos criar um web app para as pessoas poderem: **conectar suas carteiras → mintar um NFT de filiação → receber um airdrop do token → e votar em propostas.** O web app é o que nós vamos chamar de nosso "DAO Dashboard". É onde os novos membros podem se juntar a DAO e onde os membros existentes podem ver o que está acontecendo na DAO.

### 🤯 Replit!

Nós vamos usar essa coisa chamada [Replit](https://replit.com/~)! É uma IDE baseada no navegador que permite facilmente o desenvolvimento e deploy de web apps diretamente do navegador. É super útil. Em vez de ter que fazer o setup de um ambiente de desenvolvimento local e escrever comandos para fazer o deploy, isso tudo é dado para nós.

Faça uma conta no Replit antes de continuar.

Eu já criei um projeto react básico que você pode fazer **fork** no Replit. **Simplesmente vá [aqui](https://replit.com/@DanielCukier/dao-app-web3dev), e perto da direita você vai ver o botão "Fork".** cheque se você está logado, e então clique no botão.

Você vai magicamente clonar meu repositório e vai ter uma IDE completa no seu navegador para trabalhar com o código. Uma vez que terminar de carregar e mostrar algum código, clique em "run" no topo e você está pronto.

Aqui está um vídeo que eu fiz explicando sobre o Replit em um projeto passado:

[Aqui](https://www.loom.com/share/4578eb9fba1243499a6913d214b21dc3)


### 👩‍💻 Quer trabalhar localmente? Pegue o código.

Se você não quer usar o Replit, não precisa.

Começe indo [aqui](https://github.com/w3b3d3v/dao-app-web3dev) onde você acha o código do repositório. A partir disso você vai querer clicar no botão "Fork" no topo direito da página:

![Fork](https://i.imgur.com/OnOIO2A.png)

Perfeito! Quando você faz fork desse repositório, você está criando uma cópia idêntica dele que fica no seu perfil do Github. Agora você tem sua própria versão desse código que você pode editar para deixar do seu jeito.

O passo final aqui é de fato ter o seu novo repositório na sua máquina local. Clique no botão "Code" e copie o link!

Vá para o seu terminal e `cd` na pasta em que seu projeto vai ficar. Por exemplo, eu gosto de clonar meus projetos na minha pasta `Developer`. Depende do que você quer! Uma vez que você achar o local, clone o repositório rodando:

```plaintext
git clone SEU_LINK_DO_FORK
REVIEW cd dao-app-web3dev 
```

É isto! A partir daí você pode rodar:

```plaintext
npm install
```

E depois:

```plaintext
npm start
```

### 🦊 Obtendo a Metamask.

Agora nós precisamos de uma carteira Ethereum. Existem várias delas, mas para esse projeto nós vamos usar a Metamask. Baixe a extensão do navegador e configure sua carteira [aqui](https://metamask.io/download.html). Mesmo se você tiver outra carteira, use a Metamask por enquanto.

Mas por que precisamos da Metamask?

Bom. Precisamos para ser capazes de chamar funções do nosso smart contract que vive na blockchain, e para fazer isso precisamos de uma carteira que tem nosso endereço Ethereum e nossa chave privada.

É quase como uma autenticação. Precisamos de algo para "logar" na blockchain e então usar essas credenciais de login para fazer requisições API a partir do nosso website.

Então, para nosso website se comunicar com a blockchain, nós precisamos de algum modo conectar nossa carteira a ele. Uma vez que a carteira está conectada ao nosso website, ele terá permissão de chamar smart contracts em nosso favor. **Lembre-se, é como se fosse um login num website.**

Então, vá em frente e configure tudo! A configuração deles é bem auto-explicativa.

Uma vez que sua carteira estiver configurada, certifique-se de mudar para a rede "**Rinkeby**" que é a rede de teste que nós vamos trabalhar.

![Untitled](https://i.imgur.com/Kx3AZDp.png)

### 💸 Certifique-se de ter fundos na rede de teste.

Nós **não** vamos fazer o deploy na rede mainnet do Ethereum. Por que? Porque custa dinheiro de verdade e não vale a pena quando se está testando. Nós vamos começar com uma "testnet" que é um clone da "mainnet" mas que usa dinheiro de mentira para que possamos testar o tanto que quisermos. Mas é importante saber que que testnets são rodadas por miners que imitam os cenários do mundo real.

Para conseguirmos ETH falso, precisamos pedir alguns para a rede. **Esse ETH falso só vai funcionar nessa testnet específica.** Você pode conseguir alguns Ethereum falsos para o Rinkeby por um faucet. Você só precisa achar algum que funcione.

Para o MyCrypto, você vai precisar conectar a sua carteira, criar uma conta e então clicar no mesmo link para pedir fundos. Para o faucet oficial do rinkeby, se listar 0 "peers", não vale o tempo para fazer um tweet/post público no Facebook.

Seguem alguns _faucets_ onde você pode solicitar ETH falso para a rede _Rinkeby_.

| Nome | Link | Quantidade | Tempo |
| ---------------- | -------------------------- | --------------- | ------------ |
| MyCrypto | https://app.mycrypto.com/faucet | 0,01 | Nenhum |
| Buildspace | https://buildspace-faucet.vercel.app/ | 0,025 | 1d |
| Rinkeby Oficial | https://faucet.rinkeby.io/ | 3 / 7,5 / 18,75 | 8h / 1d / 3d |
| Chainlink | https://faucets.chain.link/rinkeby | 0,1 | Nenhum |

Quando sua transação for minerada, você terá alguns ETH fake na sua carteira.

![Untitled](https://i.imgur.com/9kZbhTN.png)

### 🚨 Relatório de Progresso

*Por favor faça isso ou Yan ficará triste :)*

Em `#progresso` envie uma captura de tela da sua Metamask mostrando o balanço total na rede Rinkeby como na imagem acima.