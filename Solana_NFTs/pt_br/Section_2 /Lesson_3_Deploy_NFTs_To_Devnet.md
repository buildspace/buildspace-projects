Esta será uma das partes mais épicas deste projeto - trazer sua Candy Machine e NFTs para a devnet.

A Candy Machine Sugar tornou esse processo muito mais simples. Com apenas um comando, você fará o seguinte:

1. Faça o upload dos seus NFTs no [NFT Storage](https://nft.storage/) (que é um armazenamento de arquivos descentralizado) - ou use qualquer opção de armazenamento configurada em seu `config.json` - e inicialize a configuração da sua Candy Machine.
2. Crie sua Candy Machine no contrato do Metaplex.
3. Configure sua Candy Machine com o preço, número, data de lançamento e várias outras coisas.

### 🔑 Configurando um par de chaves Solana.

Para iniciar o upload, precisamos configurar um par de chaves Solana localmente. _Observação: se você já fez isso anteriormente, siga as instruções abaixo._

Para fazermos o upload dos NFTs para a Solana, precisamos trabalhar com uma "carteira local" na linha de comando. Lembre-se: você não pode se comunicar com a Solana a menos que tenha uma carteira. E uma carteira é basicamente um "par de chaves", ou seja, uma chave pública e uma chave privada.

Isso pode ser feito executando o comando abaixo. _Nota: Quando for solicitado, não há necessidade de fornecer uma senha. Basta deixar vazio e pressionar enter._

```plaintext
solana-keygen new --outfile ~/.config/solana/devnet.json
```

A partir daqui, podemos definir este par de chaves como nosso par de chaves padrão.

```plaintext
solana config set --keypair ~/.config/solana/devnet.json
```

Agora, quando executarmos `solana config get`, você deverá ver o arquivo `devnet.json` sendo declarado como `Keypair Path` (caminho do par de chaves). Veja abaixo:

```plaintext
Config File: /Users/flynn/.config/solana/cli/config.yml
RPC URL: https://api.devnet.solana.com
WebSocket URL: wss://api.devnet.solana.com/ (computed)
Keypair Path: /Users/flynn/.config/solana/devnet.json
Commitment: confirmed
```

A partir daqui você pode executar:

```plaintext
solana balance
```

Aqui deve exibir `0 SOL`. Não podemos implantar coisas na Solana sem SOL, pois gravar dados na blockchain custa dinheiro. Nesse caso, estamos na rede de desenvolvimento, então podemos nos dar um pouco de SOL falso. Vá em frente e execute:

```plaintext
solana airdrop 2
```

Depois disso, você pode executar `solana balance` novamente e pronto, você terá um pouco de SOL. _Nota: se você ficar sem SOL falso, você pode simplesmente executar este comando novamente._

### ⚙ Configure sua Candy Machine

Para dizer à sua Candy Machine como ela deve se comportar, você precisa configurá-la. A versão Sugar torna isso bem fácil! Execute o `sugar create-config` na pasta raiz do seu projeto (o mesmo local da pasta assets) e preencha tudo o que for requisitado. Caso contrário, você pode simplesmente criar um `config.json` na pasta raiz do seu projeto. É assim que sua configuração deve ficar:

```json
{
  "price": 0.01,
  "number": 3,
  "gatekeeper": null,
  "creators": [
    {
      "address": "ENDEREÇO_DA_SUA_CARTEIRA",
      "share": 100
    }
  ],
  "solTreasuryAccount": "ENDEREÇO_DA_SUA_CARTEIRA",
  "splTokenAccount": null,
  "splToken": null,
  "goLiveDate": "2022-05-02T18:00:00+00:00",  // Isso é para especificar quando sua cunhagem será lançada
  "endSettings": null,
  "whitelistMintSettings": null,
  "hiddenSettings": null,
  "freezeTime": null,
  "uploadMethod": "nft_storage", // Isso é para especificar o uso do nft.storage para armazenar suas imagens
  "retainAuthority": true,
  "isMutable": true,
  "symbol": "NB",
  "sellerFeeBasisPoints": 1,
  "awsConfig": null,
  "nftStorageAuthToken": "SUA_CHAVE_DE_API_DO_NFT_STORAGE",
  "shdwStorageAccount": null
}
```
**Nota: Acesse o [nft.storage](https://nft.storage/manage/) para criar sua chave de API.**

<img src="https://i.imgur.com/AuVl16x.png" />

No passo 2, você pode dar o nome que quiser à chave de API. Para que eu possa identificar facilmente qual chave pertence a qual produto, chamei-a de `metaplex`.

Isso pode parecer um pouco desafiador no começo, mas não se preocupe! Você só precisa saber sobre 5 destes itens! O resto adiciona funcionalidades extras que você pode ignorar por enquanto. Vamos aos que você precisa saber:

`price`: O preço de cada NFT. Duh!
`number`: Quantos NFTs você deseja implantar. Isso precisa corresponder ao número de pares imagem + json ou as coisas darão errado mais tarde. 
`solTreasuryAccount`: Este é o endereço da sua carteira, é para onde irão os fundos dos pagamentos em SOL. 
`goLiveDate`: Quando você quer que a cunhagem comece. 
`storage`: Onde seus NFTs serão armazenados.

A única coisa que você precisará alterar aqui é o endereço da sua carteira. Se você estiver implantando mais de 3 NFTs, atualize o número! Você pode implantar até 10 NFTs na devnet.

### Armazenamento Alternativo

Se você acha que o nft.storage não é bom e está procurando um armazenamento de imagens alternativo, considere usar o Bundlr. É assim que seu `config.js` deve ficar.

```json
{
  "price": 1.0,
  "number": 10,
  "gatekeeper": null,
  "creators": [
    {
      "address": "ENDEREÇO_DA_SUA_CARTEIRA",
      "share": 100
    }
  ],
  "solTreasuryAccount": "ENDEREÇO_DA_SUA_CARTEIRA",
  "splTokenAccount": null,
  "splToken": null,
  "goLiveDate": "11 Aug 2022 18:19:16 +0000",
  "endSettings": null,
  "whitelistMintSettings": null,
  "hiddenSettings": null,
  "freezeTime": null,
  "uploadMethod": "bundlr",
  "retainAuthority": true,
  "isMutable": true,
  "symbol": "TESTE",
  "sellerFeeBasisPoints": 500,
  "awsS3Bucket": null,
  "nftStorageAuthToken": null,
  "shdwStorageAccount": null
}
```

### 🚀 Faça o upload dos NFTs e crie a sua Candy Machine

Agora vamos usar o comando `upload` do Sugar para fazer o upload de nossos NFTs que residem na pasta `assets` e criar a Candy Machine. Lembre-se, isso acontecerá de uma só vez.

Observe como colocamos `./assets` no comando abaixo. Isso significa que precisamos executar este comando de apenas um nível fora da pasta `assets`.

```plaintext
sugar upload
```

_Nota: se você receber um erro como "no such file or directory, scandir './assets'" significa que você executou o comando no lugar errado. Certifique-se de executá-lo no mesmo diretório onde está a sua pasta `assets`._

O comando `upload` está essencialmente dizendo - "Olá, CLI do Sugar. Pegue todos os pares de NFT da minha pasta `assets`, carregue-os no NFT.Storage (ou qualquer armazenamento configurado em `config.js`) e inicialize a configuração da Candy Machine que contém os ponteiros para esses NFTs".

À medida que este comando é executado, você deve ver um output no terminal sobre qual NFT está sendo carregado no momento.

```plaintext
sean@DESKTOP-BMVDNJH:/mnt/c/Users/seanl/Desktop/test$ sugar create-config
[1/2] 🍬 Sugar interactive config maker
+--------------------+
| images    |      3 |
| metadata  |      3 |
+--------------------+

[2/4] 🖥  Initializing upload
▪▪▪▪▪ Connected

[3/4] 📤 Uploading image files 

Sending data: (Ctrl+C to abort)
[00:00:05] Upload successful ██████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████ 1/1

[4/4] 📤 Uploading metadata files 

Sending data: (Ctrl+C to abort)
[00:00:03] Upload successful ██████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████ 1/1

3/3 asset pair(s) uploaded.

✅ Command successful.
```

Agora que todos os NFTs são enviados para o NFT.Storage, o Sugar deve gerar um arquivo `cache.json`. Ele deve se parecer com isso... dê uma olhada:

```json
{
  "program": {
    "candyMachine": "",
    "candyMachineCreator": "",
    "collectionMint": ""
  },
  "items": {
    "0": {
      "name": "Number #0001",
      "image_hash": "6e7fcf86a39f332caa9da55afff12f3bbf7de43458a0586e05c00c1c58a3dcbd",
      "image_link": "https://nftstorage.link/ipfs/bafybeidqys52bzlqnt4mclhmkzojtgs622pbsvwjqsn5vfwg5puqu7aimi/0.png",
      "metadata_hash": "8914d9935ddcf560152e40b0cdb2ecfa1086ab6225997c35d91373a88dc935bf",
      "metadata_link": "https://nftstorage.link/ipfs/bafybeih3n56rqtq5573dcdgiedh7hkukfmeqdd6wdsdpranyw322k7hrb4/0.json",
      "onChain": false
    },
    "1": {
      "name": "Number #0002",
      "image_hash": "003389bcc3b62044113897f81c3b39e2238b6b73218f73cfb51182db5a9a0635",
      "image_link": "https://nftstorage.link/ipfs/bafybeidqys52bzlqnt4mclhmkzojtgs622pbsvwjqsn5vfwg5puqu7aimi/1.png",
      "metadata_hash": "1c1a1bb8cb7b7bff0640fc87c69c6db0b6a404e648c81cdf9b08a8199e9bb1a7",
      "metadata_link": "https://nftstorage.link/ipfs/bafybeih3n56rqtq5573dcdgiedh7hkukfmeqdd6wdsdpranyw322k7hrb4/1.json",
      "onChain": false
    },
    "2": {
      "name": "Number #0003",
      "image_hash": "1e103f64268d4f67ee9591a5d63e565a42e7a72d8eb95523f1a5c079ad9181c1",
      "image_link": "https://nftstorage.link/ipfs/bafybeidqys52bzlqnt4mclhmkzojtgs622pbsvwjqsn5vfwg5puqu7aimi/2.png",
      "metadata_hash": "a5e48e419e40062e6b3e84f944e1d2372ee211894dddcd4c8029711d8bf78c5a",
      "metadata_link": "https://nftstorage.link/ipfs/bafybeih3n56rqtq5573dcdgiedh7hkukfmeqdd6wdsdpranyw322k7hrb4/2.json",
      "onChain": false
    }
  }
}
```
Ele deve conter o link para cada uma das imagens que foram carregadas para o NFT.Storage. Vamos prosseguir e implantar nossos NFTs na blockchain. Execute isso em seu terminal:

```plaintext
sugar deploy
```
O output deve se parecer com isso:

```bash
sean@DESKTOP-BMVDNJH:/mnt/c/Users/seanl/Desktop/test$ sugar deploy
[1/2] 🍬 Creating candy machine
Candy machine ID: 9izUuhTxKhJ3qJTDtjR2UYNEvzTRiUiVebCqYdPNjxD8

[2/2] 📝 Writing config lines
Sending config line(s) in 1 transaction(s): (Ctrl+C to abort)
[00:00:02] Write config lines successful ██████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████ 1/1

✅ Command successful.
```


### ✅ Verifique os NFTs

Antes de prosseguir, verifique se seus NFTs foram realmente carregados executando o comando `verify`:

```plaintext
sugar verify
```

**Nota: Você notará aqui que não informamos nada a este comando sobre nossos NFTs. Como então ele sabe o que verificar? Bem, o arquivo `cache.json` tem todos os dados.**

Se tudo correu bem, seu output deve se parecer um pouco com isso:

```bash
sean@DESKTOP-BMVDNJH:/mnt/c/Users/seanl/Desktop/test$ sugar verify
[1/2] 🍬 Loading candy machine
▪▪▪▪▪ Completed

[2/2] 📝 Verification
Verifying 3 config line(s): (Ctrl+C to abort)
[00:00:01] Config line verification successful ████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████ 3/3

Verification successful. You're good to go!

See your candy machine at:
  -> https://www.solaneyes.com/address/9izUuhTxKhJ3qJTDtjR2UYNEvzTRiUiVebCqYdPNjxD8?cluster=devnet

✅ Command successful.
```

Boom! Você está pronto para avançar! Você notará que há um link fornecido no terminal. Clique nele e você deve ser redirecionado para sua página da coleção de NFTs. Deve se parecer com algo assim:

<img src="https://i.imgur.com/XGo48BZ.png" />

Se você olhar no arquivo `cache.json`, encontrará um atributo `image_link` anexado a cada um dos seus itens NFT. Copie + Cole um desses links no seu navegador e confira a imagem do seu NFT. Você também encontrará outro atributo `metadata_link` em cada um dos seus itens NFT. Copie + Cole no seu navegador e você poderá ver os metadados do seu NFT! Se você estiver usando o `bundlr`, ele armazenará sua imagem no Arweave, que armazena dados **permanentemente**. Isso é muito diferente do mundo do IPFS/Filecoin - onde os dados são armazenado ponto a ponto, com base em nós que decidem manter o arquivo na rede.

O Arweave funciona assim: pague uma vez, armazene **para sempre**. Eles fazem isso usando um [algoritmo](https://arwiki.wiki/#/en/storage-endowment#toc_Transaction_Pricing) criado por eles que basicamente estima o custo necessário para armazenar algo para sempre com base no tamanho. Você pode brincar com a calculadora [aqui](https://arweavefees.com/). Por exemplo, para armazenar 1 MB para sempre, custa `~US$0,0083649802618`. Nada mal!

### 🔨 Atualize a configuração da Candy Machine.

Para atualizar a configuração da sua Candy Machine, tudo o que você precisa fazer é atualizar o arquivo `config.json` e executar este comando:

```plaintext
sugar update
```

### 😡 Esteja ciente deste erro.

Se em algum momento você encontrar um erro parecido com este:

```plaintext
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


Isso significa que o comando não pode acessar o arquivo `cache.json` com os dados importantes da sua Candy Machine e dos seus NFTs. Portanto, se você receber este erro, tenha 100% de certeza de que está executando os comandos do Sugar no mesmo diretório onde estão o arquivo `cache.json` e a pasta `assets`. Isso é muito fácil de dar errado, pois no futuro você pode estar no diretório `app` editando seu aplicativo web e atualizando a Candy Machine; verifique sempre o seu diretório!!


### 🚨 Relatório de progresso

Por favor, faça isso, senão o Farza vai ficar triste :(

Poste um dos links Arweave dos seus NFTs em `#progress`!
