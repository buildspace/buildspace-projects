### 🦾 O que vamos fazer?

Temos quase todas as nossas coisas do web app prontas. Mas, estamos usando dados falsos! Vamos construir um programa Solana que permite aos usuários 1) enviar gifs para o quadro 2) salvá-los no blockchain Solana 3) recuperar todos os GIFs que foram enviados.

Assim que fizermos isso, vamos implantar nosso programa Solana e conectá-lo ao nosso aplicativo da web - como se você implantasse uma API e depois o conectasse ao seu aplicativo da web!!

### 📝 Uma nota sobre Solana antes de entrarmos

Ok, então, para ser honesto, colocar Solana rodando e funcionando **não é tão fácil.**

Agora, isso significa que Solana é ruim? Hmmmm. Não, eu não acho.

Acho que Solana é uma tecnologia realmente **nova** e, como é tão recente, está mudando com frequência, por isso é difícil apenas pesquisar uma pergunta no Google ou obter uma resposta clara e concisa do Solana Docs.

Em 2015, eu gostava muito de aprendizado de máquina e tudo isso ainda era muito novo. Em 2015, os documentos de aprendizado de máquina eram péssimos e era difícil apenas procurar uma resposta para uma pergunta, porque na maioria das vezes eu era a primeira pessoa a fazer essa pergunta lol. *Cabia a mim descobrir uma resposta e, em seguida, atualizar os documentos por conta própria.*

Esse é o preço de brincar com uma tecnologia emergente :).

Acho que Solana está em uma situação semelhante e realmente quero deixar claro - **não espere uma experiência de desenvolvedor super limpa. Você provavelmente encontrará obstáculos aleatórios e cabe a você descobrir uma resposta + ajudar os outros.**

Eu gosto deste [tweet](https://twitter.com/armaniferrante/status/1434554725093949452) também, que meio que apresenta uma ideia semelhante.

**Tudo isso dito, acho que Solana é insanamente divertido quando você o configura e entende como ele funciona. É tão rápido. As baixas taxas de gás são mágicas. É muito divertido fazer parte de uma comunidade trabalhando em uma tecnologia inovadora. Parece que você faz parte da equipe que está construindo Solana :).**

### 🚦 Escolha o seu caminho
A configuração do Solana começa com sua máquina. Há um monte de "gotchas" em diferentes sistemas operacionais. Se você estiver executando uma **máquina Intel macOS ou uma máquina Linux**, sinta-se à vontade para prosseguir aqui. Se você estiver executando uma **máquina Windows ou uma máquina M1 macOS**, siga um dos links abaixo:

- [Setup Solana on Windows Machine](https://github.com/w3b3d3v/buildspace-projects/tree/main/Solana_And_Web3/en/Section_2/Resources/windows_setup.md)

- [Setup Solana on a M1 macOS Machine](https://github.com/w3b3d3v/buildspace-projects/tree/main/Solana_And_Web3/en/Section_2/Resources/m1_setup.md)

Good luck - you got this!

### 🦀 Instale o Rust

Em Solana, os programas são escritos em Rust! Se você não conhece Rust, não se preocupe. Contanto que você conheça alguma outra linguagem - você aprenderá Rust ao longo deste projeto.

Para instalar o Rust, basta seguir as etapas de instalação [aqui](https://doc.rust-lang.org/book/ch01-01-installation.html). Existem etapas claras para instalar o Rust para Windows, Linux e Mac.

Quando terminar, verifique fazendo:

```bash
rustup --version
```

Em seguida, verifique se o compilador Rust está instalado:

```bash
rustc --version
```

Por último, vamos garantir que o Cargo também esteja funcionando. Cargo é o gerenciador de pacotes de Rust.

```bash
cargo --version
```

Contanto que todos esses comandos soltem uma versão no console e não apresentem erros, você está pronto para continuar!

### 🔥 Instale Solana

Solana tem uma CLI super legal que será útil mais tarde quando quisermos testar os programas que escrevemos.

Novamente, as etapas de instalação são bastante simples [aqui](https://docs.solana.com/cli/install-solana-cli-tools#use-solanas-install-tool). Existem etapas claras para instalar a Solana CLI para Windows, Linux e Mac.

**Não** se preocupe em atualizar para a versão mais recente do Solana.

*Nota: Dependendo do seu sistema — depois de instalar o Solana, ele pode gerar uma mensagem como "Atualize sua variável de ambiente PATH" e fornecerá uma linha para copiar e executar. Vá em frente e copie + execute esse comando para que seu PATH seja configurado corretamente.*

Quando terminar de instalar, execute isso para garantir que as coisas estejam funcionando:

```bash
solana --version
```

Se isso aparecer um número de versão no console, você está pronto para continuar!

A próxima coisa que você vai querer fazer é executar esses dois comandos separadamente:

```bash
solana config set --url localhost
solana config get
```

Isso produzirá algo assim:

```bash
Config File: /Users/flynn/.config/solana/cli/config.yml
RPC URL: http://localhost:8899
WebSocket URL: ws://localhost:8900/ (computed)
Keypair Path: /Users/flynn/.config/solana/id.json
Commitment: confirmed
```

Isso significa que Solana está configurado para falar com nossa rede local! Ao desenvolver programas, trabalharemos com nossa rede local Solana para que possamos testar rapidamente as coisas em nosso computador.

A última coisa a testar é que queremos ter certeza de que podemos ter um **nó local Solana em execução**. Basicamente, lembra como dissemos que a cadeia Solana é administrada por "validadores"? Bem, podemos configurar um validador em nosso computador para testar nossos programas.

```bash
solana-test-validator
```

### Notes for Windows users

Se você é um usuário do Windows e o comando acima não funciona, ou você recebe o seguinte erro `Unable to connect to validator: Client error: test-ledger/admin.rpc does not exist`, certifique-se de fazer o seguinte.

1. Abra o WSL ao invés do Powershell.
2. Entre com o comando `cd ~/` para sair do diretório inicial
3. Agora entre com `solana-test-validator`

Isso pode demorar um pouco para começar, mas quando estiver funcionando, você deverá ver algo assim:

![Untitled](https://i.imgur.com/F2YwcAB.png)

Boom!! Agora você está rodando um validador local. Muito legal :).

Se você estiver executando um Intel Mac e vir o erro abaixo, precisará instalar a biblioteca `OpenSSL`. A maneira mais fácil de fazer isso seria através do brew assim: `brew install openssl@1.1`

```bash
solana-gif-portal solana-test-validator
dyld: Library not loaded: /usr/local/opt/openssl@1.1/lib/libssl.1.1.dylib
  Referenced from: /Users/<your-username>/.local/share/solana/install/active_release/bin/solana-test-validator
  Reason: image not found
```

Agora, vá em frente e CONTROL + C para parar o validador. **Nós nunca usaremos o `solana-test-validator` manualmente novamente.** O fluxo de trabalho que seguiremos executará automaticamente o validador em segundo plano para nós. Eu só queria mostrar a você como funciona para que você possa começar a ter uma ideia de como as coisas funcionam magicamente à medida que avançamos ;).

### ☕️ Install Node, NPM, Mocha e Yarn

Grandes chances de você já ter Node e NPM. Quando eu faço `node --version` recebo `v16.0.0`. A versão mínima é `v11.0.0`. Se você não tiver o Node e o NPM, instale-o usando o NVM [aqui](https://github.com/nvm-sh/nvm#installing-and-updating).

Depois disso, certifique-se de instalar essa coisa chamada Mocha. É uma pequena estrutura de teste para nos ajudar a testar nossos programas Solana.


```bash
npm install -g mocha
```

### ⚓️ A magia do 'Anchor'

Vamos usar muito essa ferramenta chamada "Anchor". Se você já conhece o Hardhat do mundo do Ethereum, é algo parecido! Exceto - é construído para Solana. **Basicamente, torna-se muito fácil para nós executarmos os programas Solana localmente e implantá-los na cadeia Solana real quando estivermos prontos!**

O Anchor é um *projeto realmente novo* executado por alguns desenvolvedores principais. Há grandes chances de se deparar com alguns problemas. Certifique-se de participar do [Anchor Discord](https://discord.gg/8HwmBtt2ss) e sinta-se à vontade para fazer perguntas ou [criar uma issue](https://github.com/project-serum/anchor/issues) em seu Github à medida que você encontrar problemas. Os desenvolvedores são incríveis. Talvez até diga que você é do buildspace em #general no Discord deles :).

**BTW - não apenas entre no Discord e faça perguntas aleatórias esperando que as pessoas ajudem. Tente pesquisar no Discord deles para ver se mais alguém teve a mesma dúvida que você. Dê o máximo de informações possível sobre suas dúvidas. Faça as pessoas quererem te ajudar lol.**

_Sério — junte-se ao Discord, os desenvolvedores são muito prestativos._

Instalar isso foi um pouco problemático para mim, mas consegui funcionar através das etapas abaixo! Vamos construí-lo a partir da fonte. *Observação: se você estiver no Linux, há algumas instruções especiais que você pode seguir [aqui](https://www.anchor-lang.com/docs/installation). Mac e Windows abaixo. Além disso, se você estiver usando Linux para Windows, siga os comandos do Linux!*

Para instalar o Anchor, vá em frente e execute:

```bash
cargo install --git https://github.com/project-serum/anchor anchor-cli --locked
```

O comando acima pode demorar um pouco. Uma vez feito, ele pode solicitar que você atualize seu PATH, lembre-se de fazer isso.

A partir daqui, execute:

```bash
anchor --version
```

Se você fez isso funcionar, legal, você tem o Anchor!!

Também usaremos o módulo npm do Anchor e o Solana Web3 JS — ambos nos ajudarão a conectar nosso aplicativo da web ao nosso programa Solana!

```bash
npm install @project-serum/anchor @solana/web3.js
```

### 🏃‍♂️ Crie um projeto de teste e execute-o

Ok, estamos _quase terminando_ haha. A última coisa que precisamos fazer para finalizar a instalação é realmente executar um programa Solana
localmente e certificar de que realmente funciona.

Podemos fazer o projeto boilerplate do Solana chamado `myepicproject` com um comando fácil:

```bash
anchor init myepicproject --javascript
cd myepicproject
```

### Notas para usuários do Windows

1. Execute os comandos usando o WSL2 e não o powershell.
2. Se `cargo install --git https://github.com/project-serum/anchor avm --locked --force` der erros. Consulte os documentos de usuário do Anchor. Talvez seja necessário instalar as dependências do Linux (WSL). Para fazer isso, execute `sudo apt-get update && sudo apt-get upgrade && sudo apt-get install -y pkg-config build-essential libudev-dev`
3. Se você tiver mais problemas como `erro: falhou ao executar o comando de compilação personalizado` para `openssl-sys v0.9.71`, execute `sudo apt install libssl-dev`
4. Uma vez instaladas essas dependências, o comando da etapa 2 deve funcionar.
5. Agora defina a versão do Anchor com `avm use latest` e você deve estar pronto para ir!

`anchor init` vai criar um monte de arquivos/diretórios para nós. É parecido com o `create-react-app` de certo modo. Vá em frente e abra o diretório do projeto no VSCode e dê uma olhada ao redor!

Se você estiver executando o projeto localmente e não tiver o yarn instalado, o `anchor init` falhará. Para resolver isso, você pode instalar o yarn executando `npm install --global yarn`.

### 🔑 Criar um par de chaves locais

A próxima coisa que precisamos fazer é gerar uma carteira Solana local para trabalhar. Não se preocupe em criar uma senha por enquanto, basta dar "Enter" quando for solicitado.

```bash
solana-keygen new
```

O que isso fará é criar um par de chaves Solana local — que é mais ou menos como nossa carteira local que usaremos para conversar com nossos programas por meio da linha de comando. Se você executar `solana config get` você verá algo chamado `Keypair Path`. Foi aí que a carteira foi criada, fique à vontade para conferir :).

Se você executar:

```bash
solana address
```

Você verá o endereço público de sua carteira local que acabamos de criar.

### 🥳 Vamos executar nosso programa

Quando fizemos `anchor init`, ele criou um programa Solana básico para nós. O que queremos fazer agora é:

1. Compile nosso programa.
2. Rode o `solana-test-validator` e implante o programa em nossa rede Solana **local** com nossa carteira. Isso é como implantar nosso servidor local com novo código.
3. Chame funções em nosso programa implantado. Isso é como atingir uma rota específica em nosso servidor para testar se está funcionando.

Anchor é incrível. Ele nos permite fazer tudo isso em uma única etapa, executando:

*Nota: Certifique-se de **não** ter o `solana-test-validator` rodando em qualquer outro lugar senão entrará em conflito com o Anchor. Demorei um pouco para descobrir isso.*

```bash
anchor test
```

Isso pode demorar um pouco na primeira vez que você executá-lo! Contanto que você obtenha as palavras verdes na parte inferior que dizem "1 passing", você está pronto para ir !! Mantenha-nos informados no Discord se você tiver problemas aqui.

![Untitled](https://i.imgur.com/V35KchA.png)

**Nota: Se você receber a mensagem `node: --dns-result-order= is not allowed in NODE_OPTIONS` isso significa que você está em uma versão mais antiga do Node e, tecnicamente, isso não foi aprovado! Como testei tudo isso com o Node v16.13.0, sugiro fortemente que você apenas atualize para esta versão.**

**Parabéns, você configurou com sucesso seu ambiente Solana :).** Tem sido uma jornada e tanto, mas nós o tornamos famoso.

### 🚨 Relatório de progresso

*Faça isso senão Dani vai ficar triste :(*

Foi tudo muito difícil!!! Definitivamente uma das instalações mais difíceis.

Poste uma captura de tela do seu teste funcionando em `#progress` para que as pessoas saibam que você fez isso :).

Agora vá em frente e volte ao seu [buildspace Dashboard](https://app.buildspace.so/courses/CObd6d35ce-3394-4bd8-977e-cbee82ae07a3) para continuar!