Esta será uma das partes mais épicas deste projeto - trazer sua Candy Machine e NFTs para a devnet.

A Candy Machine v2 tornou esse processo muito mais simples. Com apenas um comando, você fará o seguinte:



1. Faça o upload dos seus NFTs no [Arweave](https://www.arweave.org) (que é um armazenamento de arquivos descentralizado) e inicialize a configuração da sua Candy Machine.
2. Crie sua Candy Machine no contrato do Metaplex.
3. Configure sua Candy Machine com o preço, número, data de lançamento e várias outras coisas.


### 🔑 Configurando um par de chaves Solana.

Para iniciar o upload, precisamos configurar um par de chaves Solana localmente. _Observação: se você já fez isso anteriormente, siga as instruções abaixo._

Para fazermos o upload dos NFTs para a Solana, precisamos trabalhar com uma "carteira local" na linha de comando. Lembre-se: você não pode se comunicar com a Solana a menos que tenha uma carteira. E uma carteira é basicamente um "par de chaves", ou seja, uma chave pública e uma chave privada.

Isso pode ser feito executando o comando abaixo. _Nota: Quando for solicitado, não há necessidade de fornecer uma senha. Basta deixar vazio e pressionar enter._


```
solana-keygen new --outfile ~/.config/solana/devnet.json
```


A partir daqui, podemos definir este par de chaves como nosso par de chaves padrão.


```
solana config set --keypair ~/.config/solana/devnet.json
```


Agora, quando executarmos `solana config get`, você deverá ver o arquivo `devnet.json` sendo declarado como `Keypair Path` (caminho do par de chaves). Veja abaixo:


```
Config File: /Users/flynn/.config/solana/cli/config.yml
RPC URL: https://api.devnet.solana.com
WebSocket URL: wss://api.devnet.solana.com/ (computed)
Keypair Path: /Users/flynn/.config/solana/devnet.json
Commitment: confirmed
```


A partir daqui você pode executar:


```
solana balance
```


E aqui deve exibir `0 SOL`. Não podemos implantar coisas na Solana sem SOL, pois gravar dados na blockchain custa dinheiro. Nesse caso, estamos na rede de desenvolvimento, então podemos nos dar um pouco de SOL falso. Vá em frente e execute:


```
solana airdrop 2
```


Depois disso, você pode executar `solana balance` novamente e pronto, você terá um pouco de SOL. _Nota: se você ficar sem SOL falso, você pode simplesmente executar este comando novamente._


### ⚙ Configure sua Candy Machine

Para dizer à sua Candy Machine como ela deve se comportar, você precisa configurá-la. A Versão 2 torna isso fácil! Crie um arquivo chamado `config.json` na pasta raiz do seu projeto (o mesmo local da pasta assets) e adicione o seguinte a ele:


```json
{
    "price": 0.1,
    "number": 3,
    "gatekeeper": null,
    "solTreasuryAccount": "<ENDEREÇO DA SUA CARTEIRA>",
    "splTokenAccount": null,
    "splToken": null,
    "goLiveDate": "04 Aug 2022 00:00:00 GMT",
    "endSettings": null,
    "whitelistMintSettings": null,
    "hiddenSettings": null,
    "storage": "arweave",
    "ipfsInfuraProjectId": null,
    "ipfsInfuraSecret": null,
    "awsS3Bucket": null,
    "noRetainAuthority": false,
    "noMutable": false
}
```


Isso pode parecer um pouco desafiador no começo, mas não se preocupe! Você só precisa saber sobre 5 destes itens! O resto adiciona funcionalidades extras que você pode ignorar por enquanto. Vamos aos que você precisa saber:

`price`: O preço de cada NFT. `number`: Quantos NFTs você deseja implantar. Isso precisa corresponder ao número de pares imagem + json ou as coisas darão errado mais tarde. `solTreasuryAccount`: Este é o endereço da sua carteira, é para onde irão os fundos dos pagamentos em SOL. `goLiveDate`: Quando você quer que a cunhagem comece. `storage`: Onde seus NFTs serão armazenados.

A única coisa que você precisará alterar aqui é o endereço da sua carteira. Se você estiver implantando mais de 3 NFTs, atualize o número! Você pode implantar até 10 NFTs na devnet.

### 🚀 Faça o upload dos NFTs e crie a sua Candy Machine

Agora vamos usar o comando `upload` do Metaplex para fazer o upload de nossos NFTs que residem na pasta `assets` e criar a Candy Machine. Lembre-se, isso acontecerá de uma só vez.

Observe como colocamos `./assets` no comando abaixo. Isso significa que precisamos executar este comando de apenas um nível fora da pasta `assets`.


```
ts-node ~/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts upload -e devnet -k ~/.config/solana/devnet.json -cp config.json ./assets
```


_Observação: se você receber um erro como "no such file or directory, scandir './assets'" significa que você executou o comando no lugar errado. Certifique-se de executá-lo no mesmo diretório onde está a sua pasta `assets`</code>`._

O comando `upload` está essencialmente dizendo - "Olá, CLI do Metaplex. Pegue todos os pares de NFT da minha pasta `assets`, carregue-os no Arweave, inicialize a configuração da Candy Machine que contém os ponteiros para esses NFTs e salve essa configuração na rede de desenvolvimento da Solana".

À medida que este comando é executado, você deve ver um output no terminal sobre qual NFT está sendo carregado no momento.


```
wallet public key: A1AfJpXEiqiP3twp6CdZCWixpyx6p8E26zej4TNQ12GT
WARNING: The "arweave" storage option will be going away soon. Please migrate to arweave-bundle or arweave-sol for mainnet.

Beginning the upload for 3 (img+json) pairs
started at: 1641470635118
Size 3 { mediaExt: '.png', index: '0' }
Processing asset: 0
initializing candy machine
initialized config for a candy machine with publickey: 5FUh6tm4sATuCA6hth9a4JAuko9GEAhsewULrXa5zS8C
Processing asset: 0
Processing asset: 1
Processing asset: 2
Writing indices 0-2
Done. Successful = true.
ended at: 2022-01-06T12:04:38.862Z. time taken: 00:00:43
```


Sabe onde diz "initialized config for a candy machine with publickey" e depois exibe uma chave? Você pode literalmente copiar/colar essa chave no Explorador da Devnet da Solana [aqui](https://explorer.solana.com/?cluster=devnet) para ver se ela realmente foi implantada na blockchain. Faça um teste por aí!

Mantenha este endereço à mão, você precisará dele no futuro.

Você notará aqui que se você alterar seus NFTs e fizer o `upload` novamente, ele não enviará nada de novo! A razão para isso é que existe uma pasta `.cache` criada que armazena esses dados.

Na verdade, você precisará excluir a pasta `.cache` e fazer o `upload` novamente. Isso forçará a inicialização de uma nova configuração da Candy Machine. Certifique-se de fazer isso se quiser fazer alterações em sua coleção antes de lançá-la oficialmente!


### ✅ Verifique os NFTs

Antes de prosseguir, verifique se seus NFTs foram realmente carregados executando o comando `verify`:


```
ts-node ~/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts verify_upload -e devnet -k ~/.config/solana/devnet.json
```


_Nota: Você notará aqui que não informamos nada a este comando sobre nossos NFTs. Como então ele sabe o que verificar? Bem, a pasta `.cache` tem todos os dados. Se você olhar dentro de `devnet-temp.json`, verá todos os nossos dados ali._

Se tudo correu bem, seu output deve se parecer um pouco com isso:


```
wallet public key: A1AfJpXEiqiP3twp6CdZCWixpyx6p8E26zej4TNQ12GT
Key size 3
uploaded (3) out of (3)
ready to deploy!
```


Boom! Você está pronto para avançar!

Se você olhar dentro do arquivo `devnet-temp.json` na pasta `.cache`, você encontrará 3 links do Arweave. Copie e cole um desses links do Arweave no seu navegador e confira os metadados do seu NFT! O Arweave é muito massa! Ele armazena dados **permanentemente**. Isso é bem diferente do mundo do IPFS/Filecoin — onde os dados são armazenados ponto a ponto com base em nós que decidem manter o arquivo disponível.

O Arweave funciona assim: pague uma vez, armazene **para sempre**. Eles fazem isso usando um [algoritmo](https://arwiki.wiki/#/en/storage-endowment#toc_Transaction_Pricing) criado por eles que basicamente estima o custo necessário para armazenar algo para sempre com base no tamanho. Você pode brincar com a calculadora [aqui](https://arweavefees.com/). Por exemplo, para armazenar 1 MB para sempre, custa `~US$0,0083649802618`. Nada mal!

Você pode estar se perguntando - "Quem está pagando para hospedar minhas coisas então!?". Bem, se você olhar o código-fonte do script [aqui](https://github.com/metaplex-foundation/metaplex/blob/59ab126e41e6d85b53c79ad7358964dadd12b5f4/js/packages/cli/src/helpers/upload/arweave.ts#L93), verá que por enquanto o próprio Metaplex paga por isso, o que ajuda bastante!


### 🔨 Atualize a configuração da Candy Machine.

Para atualizar a configuração da sua Candy Machine, tudo o que você precisa fazer é atualizar o arquivo `config.json` e executar este comando:


```
ts-node ~/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts update_candy_machine -e devnet -k ~/.config/solana/devnet.json -cp config.json
```



### 😡 Esteja ciente deste erro.

Se em algum momento você encontrar um erro parecido com este:


```
/Users/flynn/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts:53
      return fs.readdirSync(`${val}`).map(file => path.join(val, file));
                      ^
TypeError: Cannot read property 'candyMachineAddress' of undefined
    at /Users/flynn/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts:649:53
    at step (/Users/flynn/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts:53:23)
    at Object.next (/Users/flynn/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts:34:53)
    at fulfilled (/Users/flynn/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts:25:58)
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
```


Isso significa que o comando não pode acessar a pasta `.cache` com os dados importantes da sua Candy Machine e dos seus NFTs. Portanto, se você receber este erro, tenha 100% de certeza de que está executando os comandos da Candy Machine no mesmo diretório onde estão as pastas `.cache` e `assets`. Isso é muito fácil de dar errado, pois no futuro você pode estar no diretório `app` editando seu aplicativo web e atualizando a Candy Machine; verifique sempre o seu diretório!!


### 🚨 Relatório de progresso

Por favor faça isso, senão o Farza vai ficar triste :(

Poste um dos links Arweave dos seus NFTs em `#progress`!
