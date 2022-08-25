## 🍎 Configurando a Solana em uma máquina M1 macOS

** Em primeiro lugar - eu quero dar um ENORME salve para o nosso camarada, Nick! Sem o Nick, este guia não teria sido possível. Depois de terminar esta seção, certifique-se de dar um pouco de amor ao Nick no Discord (Nick_G#4818)**

Nós vamos **a Solana não funciona no M1 macOS??** para

![Anakin está funcionando Gif](https://media.giphy.com/media/CuMiNoTRz2bYc/giphy.gif)

**realmente rápido.**

Este guia o colocará em funcionamento com o ambiente Solana em sua máquina local (salve para o colega construtor, **@billyjacoby#7369** ele montou o primeiro guia sobre como configurar sem o Rosetta!) Fizemos algumas modificações que farão você se tornar um Mestre Solana mais rápido e com menos dores de cabeça 🙂.

Vamos lá!

### ⚙️ Instale Rust

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

### 🔥Instale Solana - É PARA ISSO QUE VIEMOS!

A configuração do Solana ficou muito mais fácil! Tudo o que você precisa para baixar e instalar o Solana CLI é executar este comando no seu terminal:

```bash
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
```

Isso levará um minuto ou dois, dependendo da velocidade da sua internet. Quando terminar, você deverá ver algo assim no seu terminal:
```bash
downloading stable installer
  ✨ stable commit 5b413da initialized
```

Ta-da! Solana acabou de ser instalada! Se você teve problemas, confira as seções abaixo. Se você não teve, apenas pule por eles!


<details>
<summary>Está tendo problemas com <code>greadlink</code>?</summary>

Se você receber um erro parecido com este - `greadlink: command not found`, você precisará fazer três coisas:

- Instale o Brew usando `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"` (isso pode demorar um pouco)
- Adicione brew ao seu PATH usando `export PATH="/opt/homebrew/bin:$PATH"`
- Instale o coreutils usando `brew install coreutils`

Em seguida, execute o script acima mais uma vez e veja se funciona!

Você pode encontrar erros adicionais como os seguintes:
```
error: failed to download from `https://crates.io/api/v1/crates/console/0.11.3/download`

Caused by:
  [55] Failed sending data to the peer (Connection died, tried 5 times before giving up)
```

Este é provavelmente um erro intermitente; tente executar o script novamente e, eventualmente, ele deverá ser baixado. Se _ainda_ não for baixado, você pode tentar [bloquear a versão do Cargo](https://github.community/t/failed-sending-data-to-the-peer-connection-died-tried-5- times-before-giving-up/189130/4) e executá-lo novamente.

Se isso resultar em uma saída de versão, você está pronto para continuar!

</details>

<details>
<summary>Está tendo problemas com <code>openssl-sys</code>?</summary>

Se você receber um erro parecido com este – `error: failed to run custom build command for openssl-sys v0.9.67`, você precisará substituir a entrada `openssl` atual pela seguinte linha em `[dependencies]` em `programs/bpf_loader/Cargo.toml`:

```toml
openssl = { version = "0.10", features = ["vendored"] }
```

Para obter mais informações, consulte [este PR com a solução original](https://github.com/solana-labs/solana/issues/20783).
  
Você pode encontrar outro problema com o openssl dizendo que não pode ser encontrado. Nesse caso, tente instalar a versão 1.1 via brew:

```bash
brew install openssl@1.1
```

</details>

<details>
<summary>Está tendo problemas com <code>toolchain</code>?</summary>
  
Se você receber um erro parecido com esse – `toolchain '1.52.1-aarch64-apple-darwin' is not installed` você pode tentar reinstalá-lo usando:

```bash
rustup toolchain uninstall stable
rustup toolchain install stable
```

</details>

<details>
<summary>Está tendo problemas com <code>linking</code>?</summary>

Tente adicionar o seguinte em `~/.cargo/config`:

```toml
[target.x86_64-apple-darwin]
rustflags = [
  "-C", "link-arg=-undefined",
  "-C", "link-arg=dynamic_lookup",
]

[target.aarch64-apple-darwin]
rustflags = [
  "-C", "link-arg=-undefined",
  "-C", "link-arg=dynamic_lookup",
]
```
  
</details>

Isso pode levar algum tempo, então não se assuste! Quando terminar de instalar, talvez seja necessário garantir que ele esteja no seu PATH colando no seu terminal `export PATH="< install_path >/dev/solana"/bin:"$PATH"` e substituindo `< install_path >` , execute isso para garantir que tudo esteja funcionando:

```bash
solana --version
```

A próxima coisa que você vai querer fazer é executar esses dois comandos separadamente:

```bash
solana config set --url localhost
solana config get
```

Isso produzirá algo assim:

```bash
Config File: /Users/nicholas-g/.config/solana/cli/config.yml
RPC URL: http://localhost:8899
WebSocket URL: ws://localhost:8900/ (computed)
Keypair Path: /Users/nicholas-g/.config/solana/id.json
Commitment: confirmed
```

Isso significa que a Solana está configurada para falar com nossa rede local! Ao desenvolver programas, trabalharemos com nossa rede local Solana para que possamos testar rapidamente as coisas em nosso computador.
A última coisa a testar é que queremos ter certeza de que podemos executar um nó Solana local. Basicamente, lembra como dissemos que a cadeia Solana é administrada por "validadores"? Bem, podemos configurar um validador em nosso computador para testar nossos programas.

Primeiro, mande um salve para **@dimfled#9450** e mande um pouco de amor para ele! Ele 'viu coisas' construindo com Solana recentemente e nos deu este passo para fazer as coisas funcionarem nos M1s!

Vamos executar nosso validador Solana manualmente. Explicará por que precisamos disso em breve:

```bash
solana-test-validator --no-bpf-jit
```

Isso pode demorar um pouco para começar, mas quando estiver funcionando, você deverá ver algo assim:

![Untitled](https://i.imgur.com/FUjRage.jpg)

Boom!! Agora você está rodando um validador local. Muito legal :).

### ☕️ Instale Node, NPM, Mocha e Yarn

Grandes chances de você já ter Node e NPM. Quando eu faço `node --version` recebo `v16.0.0`. A versão mínima é `v11.0.0`. Se você não tiver o Node e o NPM, instale-o usando o NVM [aqui](https://github.com/nvm-sh/nvm#installing-and-updating).

Depois disso, certifique-se de instalar essa coisa chamada Mocha. É uma pequena estrutura de teste para nos ajudar a testar nossos programas Solana.

```bash
npm install -g mocha
```

Também precisaremos do Yarn para algum gerenciamento de pacotes. Você pode instalá-lo usando
```bash
npm install -g yarn
```

### ⚓️ A magia do 'Anchor'

Vamos usar muito essa ferramenta chamada "Anchor". Se você já conhece o Hardhat do mundo do Ethereum, é algo parecido! Exceto - é construído para Solana. **Basicamente, torna-se muito fácil para nós executarmos os programas Solana localmente e implantá-los na cadeia Solana real quando estivermos prontos!**

O Anchor é um *projeto realmente novo* executado por alguns desenvolvedores principais. Há grandes chances de se deparar com alguns problemas. Certifique-se de participar do [Anchor Discord](https://discord.gg/8HwmBtt2ss) e sinta-se à vontade para fazer perguntas ou [criar uma issue](https://github.com/project-serum/anchor/issues) em seu Github à medida que você encontrar problemas. Os desenvolvedores são incríveis. Talvez até diga que você é do buildspace em #general no Discord deles :).

**BTW - não apenas entre no Discord e faça perguntas aleatórias esperando que as pessoas ajudem. Tente pesquisar no Discord deles para ver se mais alguém teve a mesma dúvida que você. Dê o máximo de informações possível sobre suas dúvidas. Faça as pessoas quererem te ajudar lol.**

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

Também usaremos o módulo npm do Anchor e o Solana Web3 JS — ambos nos ajudarão a conectar nosso aplicativo da web ao nosso programa Solana!

```bash
npm install @project-serum/anchor @solana/web3.js
```

### 🏃‍♂️ Crie um projeto de teste e execute-o

Ok, estamos _quase terminando_ haha. A última coisa que precisamos fazer para finalizar a instalação é realmente executar um programa Solana
localmente e certificar de que realmente funciona.

Antes de começarmos, certifique-se de ter o `yarn` instalado em sua máquina:

```bash
brew install yarn
```

Podemos fazer o projeto boilerplate do Solana chamado `myepicproject` com um comando fácil:

```bash
anchor init myepicproject --javascript
cd myepicproject
```

`anchor init` vai criar um monte de arquivos/diretórios para nós. É parecido com o `create-react-app` de certo modo. Vá em frente e abra o diretório do projeto no VSCode e dê uma olhada ao redor!

Antes de nos aprofundarmos, lembra quando configuramos nosso validador local como `solana-test-validator --no-bpf-jit`? Bem, fizemos isso porque as coisas agora ainda são realmente novas com o M1 Mac e o Anchor.
O Anchor realmente executa seu próprio validador, e no M1 ele falhará ao fazer isso e lançará um erro como - `FetchError: request to http://localhost:8899/ failed` quando você for executar o `anchor test`.

A solução agora é executar o Anchor com o validador de Solana. Muito doido!

Ok, de volta para ele! Vamos abrir uma nova janela de terminal e executar:

```bash
solana-test-validator --no-bpf-jit
```

### 🔑 Crie um par de chaves local

Para podermos falar com nossos programas Solana, precisamos gerar um par de chaves. Realmente tudo o que você precisa saber sobre isso é que nos permite assinar digitalmente as transações em Solana! Ainda curioso? [Dê uma olhada nesta página](https://solana-labs.github.io/solana-web3.js/classes/Keypair.html) para mais informações!

```bash
solana-keygen new -o target/deploy/myepicproject-keypair.json
```

(Não se preocupe em criar uma senha por enquanto, apenas pressione "Enter" quando solicitado!)

Você verá este par de chaves em um arquivo `JSON` gerado localizado em `target/deploy/myepicproject-keypair.json`.

Em seguida, execute este comando:

```bash
solana address -k target/deploy/myepicproject-keypair.json
```

Isso retornará o par de chaves no terminal. Vamos copiar esse endereço e abrir nosso projeto em nosso editor de código e ir para `Anchor.toml` na raiz do nosso projeto e colar isso na linha dois substituindo o endereço que já está lá. Vá para o arquivo `lib.rs` localizado no diretório `programs` do projeto e cole esse endereço na linha três substituindo o endereço que já está lá.
Agora, vamos voltar ao nosso terminal onde configuramos a pasta do nosso projeto e executar:

```bash
anchor test --skip-local-validator
```

Isso pode demorar um pouco na primeira vez que você executá-lo! Contanto que você obtenha as palavras verdes na parte inferior que dizem "1 passing", você está pronto para continuar !! Mantenha-nos informados no Discord se você tiver problemas aqui.

![Untitled](https://i.imgur.com/V35KchA.png)

<details>
<summary>Tendo problemas com <code>Error: failed to send transaction: Transaction simulation failed: Attempt to load a program that does not exist</code>?</summary>
Se você tiver esse erro, isso provavelmente significa que você esqueceu de adicionar seu Program Id em ambos os seus arquivos <code>.toml</code> e <code>.rs</code>! Vá em frente e pege seu ID de novo e verifique se está atualizado nos lugares devidos :).
</details>

<details>
  <summary>Tendo problemas com <code>Insufficient funds</code> or <code>Error: Deploying program failed: Error processing Instruction 1: custom program error: 0x1 There was a problem deploying: Output { status: ExitStatus(unix_wait_status(256)), stdout: "", stderr: "" }</code>?</summary>
  
Isso significa que você não tem SOL suficiente. Airdrop algumas SOL para o seu localhost:

```bash
solana airdrop 2 --url localhost
```

Rode o comando acima várias vezes para que você tenha SOLs o suficiente.

Verifique se você tem saldo o suficiente:
```bash
solana balance
```
</details>