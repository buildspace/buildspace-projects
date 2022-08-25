## 🪟 Configurando Solana em uma máquina Windows
Este recurso o guiará pelo fluxo de configuração do ambiente Solana em sua máquina Windows local. O grande problema aqui é **O Windows não é realmente suportado pela Anchor no momento.** Isso significa que precisamos usar uma plataforma que *é* suportada.
O Windows permite que você inicialize um ambiente Linux para cenários como este! Haverá algumas etapas extras para resolver tudo isso antes de começarmos a configurar todas as dependências do Solana.

### 👩‍💻 Configurar WSL
Como eu disse acima, tecnicamente não vamos usar o Windows para este projeto, mas sim o Linux! O Windows introduziu essa coisa legal chamada [**Windows Subsystem for Linux**](https://docs.microsoft.com/en-us/windows/wsl/). Se você está realmente curioso para saber como tudo isso vai funcionar, faça uma pequena pesquisa e relate para os outros em seu cohort!

Para começar a usar o WSL, precisaremos instalá-lo. Vá em frente e abra `cmd.exe` no modo Admin para iniciar e então você vai executar este comando:

```bash
wsl --install
```

Este comando habilitará os componentes opcionais necessários, baixará o kernel Linux mais recente, definirá o WSL 2 como seu padrão e instalará uma distribuição Linux para você (Ubuntu por padrão, veja abaixo para alterar isso).

Se você estiver interessado em fazer uma configuração um pouco mais personalizada, sinta-se à vontade para fazer o check-out [este guia de instalação](https://docs.microsoft.com/en-us/windows/wsl/install).

Uma vez que esta instalação é feita, você **PRECISA** reiniciar seu computador. As coisas definitivamente não funcionarão se você instalar o WSL e não reiniciar sua máquina. Reserve um segundo para fazer isso e nos encontraremos aqui na próxima seção!

### 📀 Instalando o Node.js
Ótimo! Agora você tem um subsistema Linux disponível em sua máquina. É realmente muito legal ver como tudo isso funciona. A única coisa que você precisa perceber é que esse ambiente é abstraído do seu ambiente Windows. Portanto, tudo em sua máquina Windows não está acessível em sua instância do Ubuntu. Isso significa que não temos o Node.js instalado, algo que precisaremos para configurar o restante do nosso ambiente Solana!

Comece indo ao seu menu de pesquisa e digitando `Ubuntu`. Você deve ver uma opção shell do Ubuntu subindo - vá em frente e clique nela. Agora, alguns de vocês podem se deparar com um erro onde você abre seu terminal e depois diz que há um erro e fecha o terminal! Certifique-se de seguir estas duas etapas para corrigir isso:

**- Verifique se o recurso do subsistema Linux está ativado**

Para isso, queremos ter certeza de que sua máquina está realmente habilitada para usar WSL. Na barra de pesquisa, vá em frente e digite "Recursos do Windows". Você deve ver uma opção que diz algo como habilitar e desabilitar recursos do Windows. Vá em frente e escolha isso. Agora você precisará certificar-se de que as seguintes opções estão marcadas:

- Subsistema Windows para Linux
- Plataforma de Máquinas Virtuais

Depois de ter tudo pronto, reinicie sua máquina mais uma vez e veja se você pode abrir o terminal Ubuntu! Se você ainda estiver tendo problemas com ele, isso pode significar que sua CPU não tem a virtualização habilitada.

**- Ative a virtualização.**

Isso soa mais intenso do que realmente é. Essencialmente, algumas pessoas podem não ter um recurso em sua CPU ativado. Nós vamos ter certeza de que ele está ativado.
Para isso, você precisará entrar no BIOS da sua máquina. Nem todos os computadores podem entrar no BIOS da mesma maneira. Eu recomendaria procurar como obter acesso ao seu BIOS. Isso exigirá que você reinicie seu computador, portanto, abra esse guia em outra máquina ou em seu telefone!

Quando o computador for reiniciado, pressione a tecla “DEL” e “F2″. Uma dessas chaves geralmente é a maneira de entrar no BIOS do seu computador. Neste ponto, você continuará para a seção "Opções avançadas". Novamente, isso pode ter um nome diferente, mas deve ser algo semelhante a mais opções.
A partir daqui, você irá para uma seção de CPU ou seção de virtualização e certifique-se de que diz "Ativado".

Essas duas etapas devem colocá-lo no seu caminho agora! Se não, certifique-se de entrar em contato na sua seção do Discord com o erro que você esteja enfrentando.

Agora que temos o Terminal Ubuntu pronto para uso - podemos começar a instalar o Node.js 😎. Na verdade, usaremos algo chamado [nvm](https://github.com/nvm-sh/nvm). Isso tornará incrivelmente fácil instalar e alterar as versões do Node!

Sinta-se à vontade para seguir [este guia](https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl) sobre como obter essa configuração no WSL, mas essencialmente o seu fluxo ficará assim:

```
// Instale Curl
sudo apt-get install curl

// Instale NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash

// Reinicie o Terminal Ubuntu

// Teste se o nvm existe - isso retornará "nvm" e não um número de versão se estiver funcionando corretamente!
command -v nvm

// Instale a última versão LTS do Node.js
nvm install --lts
```

Fácil assim! Uma vez que você tem tudo isso configurado, você está pronto para voltar aos trilhos com o resto de sua configuração! Apenas lembre-se - todos os seus comandos de terminal **DEVEM** ser executados neste Terminal Ubuntu a partir de agora.

### 🦀 Instale o Rust

Em Solana, os programas são escritos em Rust! Se você não conhece Rust, não se preocupe. Contanto que você conheça alguma outra linguagem - você aprenderá Rust ao longo deste projeto.

Para instalar o Rust, vamos abrir nosso terminal e executar este comando:

```bash
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

Você será solicitado com várias opções para instalar. Vamos usar o padrão digitando 1 e depois enter!

Quando terminar, vá em frente e reinicie seu terminal e verifique se ele foi instalado digitando:

```bash
rustup --version
```

Em seguida, verifique se o compilador de Rust está instalado:

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

Tudo o que você precisa para baixar e instalar o Solana CLI é executar este comando no seu terminal:

```bash
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
```

Isso levará um minuto ou dois, dependendo da velocidade da sua internet. Quando terminar, você deverá ver algo assim no seu terminal:
```bash
downloading stable installer
  ✨ stable commit 5b413da initialized
```

Ta-da! Solana acabou de ser instalada! Se você quer detalhes extras, os passos da instalação são bem diretos, veja-os [aqui](https://docs.solana.com/cli/install-solana-cli-tools#use-solanas-install-tool). Existem etapas claras para instalar a CLI do Solana para Linux.

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

Isso pode demorar um pouco para começar, mas quando estiver funcionando, você deverá ver algo assim:

![Untitled](https://i.imgur.com/F2YwcAB.png)

Boom!! Agora você está rodando um validador local. Muito legal :).

Agora, vá em frente e CONTROL + C para parar o validador. **Nós nunca usaremos o `solana-test-validator` manualmente novamente.** O fluxo de trabalho que seguiremos executará automaticamente o validador em segundo plano para nós. Eu só queria mostrar a você como funciona para que você possa começar a ter uma ideia de como as coisas funcionam magicamente à medida que avançamos ;).

### ☕️ Instalar Mocha e Yarn

Mocha é um pequeno framework de testes para nos ajudar a testar nossos programas Solana.

```bash
npm install -g mocha
```

É isso! Nós vamos usar isso mais tarde :).

Também precisaremos do Yarn para algum gerenciamento de pacotes. Você pode instalá-lo usando
```bash
npm install -g yarn
```

### ⚓️ A magia do 'Anchor'

Vamos usar muito essa ferramenta chamada "Anchor". Se você já conhece o Hardhat do mundo do Ethereum, é algo parecido! Exceto - é construído para Solana. **Basicamente, torna-se muito fácil para nós executarmos os programas Solana localmente e implantá-los na cadeia Solana real quando estivermos prontos!**

O Anchor é um *projeto realmente novo* executado por alguns desenvolvedores principais. Há grandes chances de se deparar com alguns problemas. Certifique-se de participar do [Anchor Discord](https://discord.gg/8HwmBtt2ss) e sinta-se à vontade para fazer perguntas ou [criar uma issue](https://github.com/project-serum/anchor/issues) em seu Github à medida que você encontrar problemas. Os desenvolvedores são incríveis. Talvez até diga que você é do buildspace em #general no Discord deles :).

** BTW - não apenas entre no Discord e faça perguntas aleatórias esperando que as pessoas ajudem. Tente pesquisar no Discord deles para ver se mais alguém teve a mesma dúvida que você. Dê o máximo de informações possível sobre suas dúvidas. Faça as pessoas quererem te ajudar lol.**

_Sério — junte-se ao Discord, os desenvolvedores são muito prestativos._

Para instalar o Anchor, iremos precisar do Ancher Version Manager (Gerenciador de Versão do Anchor). Vá em frente e rode:

```bash
cargo install --git https://github.com/project-serum/anchor avm --locked --force
```

O comando acima pode demorar um pouco e seu computador pode ficar um pouco quentinho 🔥.

Este comando *pode* falhar se você não tiver todas as dependências necessárias. Execute isto se a instalação do cargo falhar:
```bash
sudo apt-get update && sudo apt-get upgrade && sudo apt-get install -y pkg-config build-essential libudev-dev
```

Feito isso, você terá o **Anchor Version Manager** instalado. Agora podemos realmente instalar o Anchor:

```bash
avm install latest
avm use latest
```

A partir daqui rode:

```bash
anchor --version
```

Se você fez isso funcionar, legal, você tem o Anchor!!

### 🏃‍♂️ Crie um projeto de teste e execute-o

Ok, estamos _quase terminando_ haha. A última coisa que precisamos fazer para finalizar a instalação é realmente executar um programa Solana
localmente e certificar de que realmente funciona.

Podemos fazer o projeto boilerplate do Solana chamado `myepicproject` com um comando fácil:

```
anchor init myepicproject --javascript
cd myepicproject
```

`anchor init` vai criar um monte de arquivos/diretórios para nós. É parecido com o `create-react-app` de certo modo. Vá em frente e abra o diretório do projeto no VSCode e dê uma olhada ao redor!


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
