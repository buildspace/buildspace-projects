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

```
git version
> git versão 2.31.1 (ou superior!)

node --version
> v14.17.0 (ou superior, abaixo da v17 -- descobrimos que o node v16 funciona melhor)

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

_Nota: Uma vez instalada a Solana, e dependendo do seu sistema, você poderá ver um output assim "Please update your PATH environment variable” (Atualize sua variável de ambiente PATH). Você também verá uma linha para copiar e executar. Vá em frente e copie + execute esse comando para que seu PATH seja configurado corretamente._

Quando terminar de instalar, execute isso para garantir que as coisas estejam funcionando:


```
solana --version
```


Se isso gerar um número de versão, você está pronto para ir adiante! A próxima coisa que você vai querer fazer é executar esses dois comandos separadamente:


```
solana config set --url devnet
solana config get
```


Isso dará um output assim:


```
Config File: /Users/flynn/.config/solana/cli/config.yml
RPC URL: https://api.devnet.solana.com
WebSocket URL: wss://api.devnet.solana.com/ (computed)
Keypair Path: /Users/flynn/.config/solana/id.json
Commitment: confirmed
```


Durante todo este projeto estaremos construindo diretamente na devnet da Solana. Isso é muito louco! É como se fosse uma versão da Solana em um ambiente de "encenação". É uma blockchain real executada por validadores reais e gratuita para desenvolvedores.


### ☹️ Ahhhh me ajude… tá quebrado!

Que droga! Pode ser um pouco difícil iniciar os trabalhos com a Solana. Contudo, estamos felizes em ajudar!! Poste uma mensagem na `#seção-2-ajuda` para que seus colegas da Buildspace possam ajudá-lo! Certifique-se de nos fornecer o máximo possível de informações, como: seu sistema operacional, capturas de tela do erro etc.


### 🤩 Começando com a CLI do Metaplex 

Agora que temos nossa CLI da Solana instalada, precisaremos instalar a CLI do Metaplex, que nos permite realmente criar nossa Candy Machine.

**Se você tiver um Mac com chip M1, precisará instalar algumas dependências adicionais antes de instalar a CLI do Metaplex**, siga estas [instruções](https://docs.metaplex.com/storefront/installation#apple-m1-chip).

Vamos começar clonando o repositório do metaplex no Github. Verifique [aqui](https://github.com/metaplex-foundation/metaplex/tags) o nome da tag da versão mais recente, você pode substituir a `v1.1.1` pela versão mais recente. _Eu recomendo clonar o repositório para a pasta inicial do seu usuário. Então, para chegar lá, você pode fazer um `cd ~` (não tenho certeza como é no Windows (risos))._


```
git clone -b v1.1.1 https://github.com/metaplex-foundation/metaplex.git
```


A partir daqui é só instalar todas as dependências desta CLI, usando este comando no diretório onde você acabou de instalar o Metaplex. Observação: eu geralmente não executo um cd na pasta. Só executo todos os comandos que preciso de fora da pasta. Eu nunca realmente entro na pasta `metaplex`. Você verá mais tarde porque fazer isso é mais fácil!


```
yarn install --cwd ~/metaplex/js/
```


Caso você receba um erro como `There appears to be trouble with your network connection. Retrying...` (Parece haver problemas com sua conexão de rede. Tentando novamente…), você pode tentar usar:


```
yarn install --cwd ~/metaplex/js/ --network-timeout 600000
```


Na maioria das vezes, isso acontece porque o tempo limite padrão definido na configuração do Yarn é muito baixo, portanto, quando esse tempo se esgota, ele assume que é um problema de rede.

Antes de prosseguirmos, vamos verificar se tudo está funcionando conforme o esperado, executando o seguinte comando para obter a `versão`.


```
ts-node ~/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts --version
```


O output disso deve exibir `0.0.2`. Neste ponto, estamos prontos para começar a configurar nossos NFTs :).

**Nota**: Se você estiver no MacOS, poderá ter um problema se tiver a versão antiga da CLI do Metaplex instalada. Certifique-se de excluir o diretório `metaplex-foundation` ou `metaplex` em sua pasta `~`!


### 🚨 Relatório de progresso

Por favor faça isso, senão o Farza vai ficar triste :(

Em `#progress`, publique uma captura de tela do seu terminal mostrando o output do comando `solana config get`!
