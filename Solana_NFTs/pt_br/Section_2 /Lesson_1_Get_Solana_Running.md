### 🦾 O que vamos fazer?

Então - o objetivo é criar um aplicativo da web que permite que usuários **conectem suas carteiras, cliquem em cunhar e recebam um NFT de nossa coleção em sua carteira**. Simples o suficiente!

Precisaremos instalar as CLIs (Command-Line Interfaces, Interfaces de linha de comando) da Solana e do Metaplex para fazer isso acontecer.

A CLI da Solana nos permitirá implantar na devnet uma blockchain real que é executada por [validadores](https://solana.com/validators) reais.

A CLI do Metaplex nos permitirá interagir com os contratos NFT implantados do Metaplex. Usando seus contratos-inteligentes-como-um-serviço, podemos 1) criar nossa própria Candy Machine 2) enviar nossos NFTs para nossa Candy Machine 3) permitir que os usuários realmente acessem nossa Candy Machine para cunhar um NFT.

### 📝 Uma observação sobre a Solana antes de entrarmos

Ok, então, para ser honesto, colocar a Solana funcionando e em atividade **não é fácil nesse momento**.

Então isso significa que a Solana não presta? Beeem... Não, eu não penso assim.

Eu acho que como a Solana é uma tecnologia muito **nova**, está mudando com frequência, então é difícil apenas pesquisar no Google sobre uma questão ou obter uma resposta clara e concisa do Solana Docs.

Em 2015, eu estava bem interessado em machine learning, que era bem novo na época. Em 2015, os documentos sobre machine learning eram péssimos e era difícil apenas procurar uma resposta para uma pergunta, porque na maioria das vezes eu era a primeira pessoa a fazer essa pergunta (risos). _Cabia a mim descobrir uma resposta e, em seguida, atualizar os documentos por conta própria._

Esse é o preço de brincar com uma tecnologia emergente :).

Acho que a Solana está em uma situação semelhante, e quero deixar claro - **não espere uma experiência de desenvolvimento super limpa. Você provavelmente encontrará obstáculos aleatórios e cabe a você descobrir uma resposta + ajudar os outros.**

Eu gosto deste [tweet](https://twitter.com/armaniferrante/status/1434554725093949452) também, que meio que apresenta uma ideia semelhante.

**Dito tudo isso, eu acho que a Solana é insanamente divertida quando você a configura e entende como ela funciona. É tão rápida! As baixas taxas de gas são mágicas. É muito divertido fazer parte de uma comunidade que trabalha em uma tecnologia inovadora. Parece que você faz parte da equipe que está construindo a Solana :).**

### 🤖 Instale os pré-requisitos

Para começar a interagir com a CLI da Candy Machine, precisamos garantir que você tenha algumas ferramentas básicas de desenvolvimento. Vá em frente, execute esses comandos e instale qualquer coisa que você ainda não tenha!

```plaintext
git version
> git versão 2.31.1 (ou superior!)

node --version
> v16.17.0 (ou superior, abaixo da v17 -- descobrimos que o node v16 funciona melhor)

yarn --version
> 1.22.11 (ou superior!)

ts-node --version
> v10.2.1 (ou superior!)
```

Se algum desses comandos não for encontrado, certifique-se de instalá-lo antes de prosseguir.

* [Instalação do git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
* [Instalação do node](https://nodejs.org/en/download/)
* [instalação do yarn](https://classic.yarnpkg.com/lang/en/docs/install)
* [Instalação do ts-node](https://www.npmjs.com/package/ts-node#installation)

Certifique-se de instalar o `ts-node` globalmente. Eu usei este comando: `npm install -g ts-node`

> Se você encontrar erros de permissões do EACCES durante a instalação, confira este [link](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally).

### 🔥 Instale Solana

As etapas de instalação são bem simples. Confira [aqui](https://docs.solana.com/cli/install-solana-cli-tools#use-solanas-install-tool)! Existem etapas claras para instalar a CLI da Solana em Windows, Linux e Mac.

**Não** se preocupe em atualizar para a versão mais recente da Solana. Você pode instalar a versão estável substituindo o número da versão por "stable" assim: `sh -c "$(curl -sSfL https://release.solana.com/stable/install)"`

*Nota: Uma vez instalada a Solana, e dependendo do seu sistema, você poderá ver um output assim "Please update your PATH environment variable” (Atualize sua variável de ambiente PATH). Você também verá uma linha para copiar e executar. Vá em frente e copie + execute esse comando para que seu PATH seja configurado corretamente.*

Quando terminar de instalar, execute isso para garantir que as coisas estejam funcionando:

```plaintext
solana --version
```

Se isso gerar um número de versão, você está pronto para ir adiante! A próxima coisa que você vai querer fazer é executar esses dois comandos separadamente:

```plaintext
solana config set --url devnet
solana config get
```

Isso dará um output assim:

```plaintext
Config File: /Users/flynn/.config/solana/cli/config.yml
RPC URL: https://api.devnet.solana.com
WebSocket URL: wss://api.devnet.solana.com/ (computed)
Keypair Path: /Users/flynn/.config/solana/id.json
Commitment: confirmed
```

Durante todo este projeto estaremos construindo diretamente na devnet da Solana. Isso é muito louco! É como se fosse uma versão da Solana em um ambiente de "encenação". É uma blockchain real executada por validadores reais e gratuita para desenvolvedores.

### ☹️ Ahhhh me ajude… tem alguma coisa quebrada!

Que droga! Pode ser meio difícil de fazer a Solana funcionar. Contudo, estamos dispostos a ajudar!! Poste uma mensagem na `#seção-2-ajuda` para que seus colegas do Buildspace possam ajudá-lo! Certifique-se de nos fornecer o máximo possível de informações, como: seu sistema operacional, capturas de tela do erro etc.

### 🤩 Começando com a CLI do Metaplex 

Agora que temos nossa CLI da Solana instalada, precisaremos instalar a CLI do Metaplex, que nos permite realmente criar nossa Candy Machine. Você pode seguir o processo de instalação [aqui](https://docs.metaplex.com/developer-tools/sugar/overview/installation).

### 🍬 Instale o Sugar

```plaintext
1. sudo apt install libudev-dev pkg-config unzip
2. bash <(curl -sSf https://sugar.metaplex.com/install.sh)
```

Depois de instalar o Sugar com sucesso, você poderá obter o seguinte output digitando `sugar` no terminal.

```bash
sugar-cli 1.0.0-rc.2
Command line tool for creating and managing Metaplex Candy Machines.

USAGE:
sugar [OPTIONS] <SUBCOMMAND>

OPTIONS:

-h, --help Print help information
-l, --log-level <LOG_LEVEL> Log level: trace, debug, info, warn, error, off
-V, --version Print version information

SUBCOMMANDS:
    bundlr            Interact with the bundlr network
    collection        Manage the collection on the candy machine
    create-config     Interactive process to create the config file
    deploy            Deploy cache items into candy machine config on-chain
    freeze            Commands for the Candy Machine Freeze feature
    hash              Generate hash of cache file for hidden settings
    help              Print this message or the help of the given subcommand(s)
    launch            Create a candy machine deployment from assets
    mint              Mint one NFT from candy machine
    reveal            Reveal the NFTs from a hidden settings candy machine
    show              Show the on-chain config of an existing candy machine
    sign              Sign one or all NFTs from candy machine
    thaw              Thaw an NFT or all NFTs in a candy machine
    unfreeze-funds    Unlock treasury funds after freeze is turned off or expires
    update            Update the candy machine config on-chain
    upload            Upload assets to storage and creates the cache config
    validate          Validate JSON metadata files
    verify            Verify uploaded data
    withdraw          Withdraw funds from candy machine account closing it
```

### 🚨 Relatório de progresso

*Por favor, faça isso, senão o Farza vai ficar triste :(*

Em `#progress`, publique uma captura de tela do seu terminal mostrando o output do comando `solana config get`!
