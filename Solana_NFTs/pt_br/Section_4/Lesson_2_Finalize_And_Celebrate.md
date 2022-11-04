### 🌍 Aprimore seus NFTs com IPFS

Ao implantar na devnet, você não precisa se preocupar em armazenar seus NFTs, pois o Metaplex permite que você carregue até 10 ativos gratuitamente. Isso é super útil, mas você não pode depender disso quando for para a rede principal (risos).

O que acontece quando você quiser ir para a rede principal? Você pode seguir a rota padrão e enviá-los para o Arweave, mas isso custará algum dinheiro. Em vez disso, podemos usar algo chamado [IPFS](https://en.wikipedia.org/wiki/InterPlanetary_File_System). Em poucas palavras, é um sistema de armazenamento de arquivos descentralizado, semelhante ao Arweave, mas **muito** mais barato (às vezes até gratuito). Achei mais fácil usar o [Pinata](https://www.pinata.cloud/?utm_source=buildspace) para fazer o upload para o IPFS. Além disso, eles oferecem 1 GB de armazenamento gratuito, o que é suficiente para milhares de ativos. Eu ainda não implantei nada na rede principal, mas de qualquer maneira usei o Pinata, porque ele permite fazer o upload de arquivos muito maiores.

Usá-lo é bastante simples. Depois de se inscrever em uma conta, selecione "API Keys" (chaves de API) no menu suspenso do canto superior direito.

![API KEY](https://i.imgur.com/3Cp92wu.png)

Crie uma nova chave e certifique-se de que o acesso à `pinFileToIPFS` esteja ativado.

![Pinata config](https://i.imgur.com/QBCmGSv.png)

Depois de criar a chave, você verá um pop-up com todos os segredos. Copie o token JWT e mantenha-o à mão. Agora apenas atualizaremos nosso arquivo `config.json` com 2 novas propriedades:

```json
{
  "price": 0.01,
  "number": 3,
  "gatekeeper": null,
  "creators": [
    {
      "address": "ENDEREÇO_DA_SUA_CARTEIRA",
      "share": 100      // Certifique -se de que a participação total entre todos os criadores se resume até exatamente 100
    }
  ],
  "solTreasuryAccount": "ENDEREÇO_DA_SUA_CARTEIRA",
  "splTokenAccount": null,
  "splToken": null,
  "goLiveDate": "2022-05-02T18:00:00+00:00",
  "endSettings": null,
  "whitelistMintSettings": null,
  "hiddenSettings": null,
  "freezeTime": null,
  "uploadMethod": "nft_storage",
  "retainAuthority": true,
  "isMutable": true,
  "symbol": "NB",
  "sellerFeeBasisPoints": 1,
  "awsConfig": null,
  "nftStorageAuthToken": "SUA_CHAVE_DE_API_DO_NFT_STORAGE",
  "shdwStorageAccount": null
}
```

Aqui adiciono o `nft_storage`. Eu também defino `uploadMethod` para o `nft_storage`. Cole sua chave de API do [nft.storage](https://nft.storage/) na propriedade `nftStorageAuthToken` e você está pronto! Exclua o arquivo `cache.json` e execute o comando de upload novamente:

```
sugar upload
```

E pronto! Agora realmente você tem NFTs de alta qualidade na devnet. Se você quiser saber mais sobre o IPFS, [confira isso aqui](https://decrypt.co/resources/how-to-use-ipfs-the-backbone-of-web3).

### 🚀 Lance para o mundo

A implantação de um aplicativo do React ficou tão fácil que não há razão para não fazê-la neste momento (risos). Além disso, é **grátis**. Você chegou até aqui, a implantação é a etapa final. Além disso, seus colegas construtores do Buildspace não devem ser privados de seus NFTs!! Por favor, nos dê a oportunidade de cunhar suas criações raras hehe.

Deixei um vídeo bem rápido abaixo sobre a implantação via Vercel. Se você não quiser usar o Vercel, tudo bem. Use o programa que quiser.

Basicamente:

* Envie seu código mais recente para o Github. Não faça o commit do `cache.json`;
* Conecte o Vercel ao seu repositório;
* Certifique-se de definir sua raiz para `app`;
* Adicione suas variáveis `.env.local` (já que não vamos fazer o commit do nosso arquivo `.env.local`);
* Faça a implantação;
* Concluído!

Para dar mais segurança, crie um arquivo `.gitignore` na pasta `root`, para que ele ignore automaticamente todos os arquivos e não seja enviado ao Github. É assim que meu `gitignore` se parece:

```javascript
.DS_Store
.env
.env.local
node_modules
cache.json
config.json
```

[Loom](https://www.loom.com/share/ce89a285b90a4b34ac358fce9ae7f92d)

Nota: No Vercel, você precisará adicionar a 6ª variável de ambiente como `CI=false`. Isso garantirá que nossa compilação não falhe devido a avisos.

![Untitled](https://i.imgur.com/wn2Uhj4.png)


### 😍 Olá, Mestre da Solana

É super emocionante que você conseguiu chegar ao fim. Isso é algo grandioso!! A Solana ainda está **super no início** e já é muito poderosa! E agora você teve a chance de mexer com a tecnologia principal. Aí sim!! Agora você tem todas as habilidades que precisa para construir seus próprios drops de NFT na Solana.

Obrigado por contribuir para o futuro da web3 aprendendo essas coisas. O fato de você saber como isso funciona e como codificar tudo isso é um superpoder. Use seu poder com sabedoria ;).

### 🌈 Antes de você ir embora

Vá para **#showcase** no Discord e envie-nos o link do seu produto final, pois queremos mexer nele :).

Além disso, você deve postar seu projeto final no Twitter e mostrar para o mundo a sua criação épica! O que você fez não foi nada fácil. Tente até fazer um pequeno vídeo mostrando seu projeto e anexe-o ao tweet. Deixe seu tweet bonito e mostre para o mundo o que você fez!!

E se você quiser, marque o @_buildspace :). **Isso nos dá muita motivação, sempre que vemos as pessoas enviarem seus projetos.** Além disso, você pode inspirar outra pessoa a entrar no mundo da Solana.

Nos dê essa dose de dopamina, por favor.

Por fim, o que também seria incrível, é se você nos dissesse na seção de feedback do Discord o quanto gostou deste projeto e de como ele foi estruturado. O que você mais gostou no Buildspace? O que não curtiu? O que gostaria que mudássemos para projetos futuros? Seu feedback seria incrível!

Vejo você por aí!!!
