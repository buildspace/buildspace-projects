### 🌍 Aprimore seus NFTs com IPFS

Ao implantar na devnet, você não precisa se preocupar em armazenar seus NFTs, pois o Metaplex permite que você carregue até 10 ativos gratuitamente. Isso é super útil, mas você não pode depender disso quando for para a rede principal (risos).

O que acontece quando você quiser ir para a rede principal? Você pode seguir a rota padrão e enviá-los para o Arweave, mas isso custará algum dinheiro. Em vez disso, podemos usar algo chamado [IPFS](https://en.wikipedia.org/wiki/InterPlanetary_File_System). Em poucas palavras, é um sistema de armazenamento de arquivos descentralizado, semelhante ao Arweave, mas **muito** mais barato (às vezes até gratuito). Achei mais fácil usar o [Pinata](https://www.pinata.cloud/?utm_source=buildspace) para fazer o upload para o IPFS. Além disso, eles oferecem 1 GB de armazenamento gratuito, o que é suficiente para milhares de ativos. Eu ainda não implantei nada na rede principal, mas de qualquer maneira usei o Pinata, porque ele permite fazer o upload de arquivos muito maiores.

Usá-lo é bastante simples. Depois de se inscrever em uma conta, selecione "API Keys" (chaves de API) no menu suspenso do canto superior direito.

![https://camo.githubusercontent.com/13eef8b1e6ef5671384cedaa32e2c3e47a60c6ddf56d4d16ebaa1939441357c9/68747470733a2f2f692e696d6775722e636f6d2f334370393277752e706e67](https://camo.githubusercontent.com/13eef8b1e6ef5671384cedaa32e2c3e47a60c6ddf56d4d16ebaa1939441357c9/68747470733a2f2f692e696d6775722e636f6d2f334370393277752e706e67)

Crie uma nova chave e certifique-se de que o acesso à `pinFileToIPFS` esteja ativado.

![https://camo.githubusercontent.com/4c569a4a041609d6e3659417f49d9929859300881e3ca0225919121455e9d2f0/68747470733a2f2f692e696d6775722e636f6d2f5142436d4753762e706e67](https://camo.githubusercontent.com/4c569a4a041609d6e3659417f49d9929859300881e3ca0225919121455e9d2f0/68747470733a2f2f692e696d6775722e636f6d2f5142436d4753762e706e67)

Depois de criar a chave, você verá um pop-up com todos os segredos. Copie o token JWT e mantenha-o à mão. Agora apenas atualizaremos nosso arquivo `config.json` com 2 novas propriedades:


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
    "storage": "pinata",
    "pinataJwt": "SEU TOKEN JWT DO PINATA",
    "pinataGateway": "null",
    "ipfsInfuraProjectId": null,
    "ipfsInfuraSecret": null,
    "awsS3Bucket": null,
    "noRetainAuthority": false,
    "noMutable": false
}
```


Eu adicionei o `pinataJwt` e o `pinataGateway`. Eu também defini o `storage` (armazenamento) para o `pinata`. Cole seu token JWT na propriedade `pinataJwt` e pronto! Exclua sua pasta `.cache` e execute o comando de upload novamente:


```
ts-node ~/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts upload -e devnet -k ~/.config/solana/devnet.json -cp config.json ./assets
```


E pronto! Agora realmente você tem NFTs de alta qualidade na devnet. Se você quiser saber mais sobre o IPFS, [confira isso aqui](https://decrypt.co/resources/how-to-use-ipfs-the-backbone-of-web3).

### 🚀 Lance para o mundo

A implantação de um aplicativo do React ficou tão fácil que não há razão para não fazê-la neste momento (risos). Além disso, é **grátis**. Você chegou até aqui, a implantação é a etapa final. Além disso, seus colegas construtores da Buildspace não devem ser privados de seus NFTs!! Por favor, nos dê a oportunidade de cunhar suas criações raras hehe.

Deixei um vídeo bem rápido abaixo sobre a implantação via Vercel. Se você não quiser usar o Vercel, tudo bem. Use o programa que quiser.

Basicamente:

* Envie seu código mais recente para o Github. Não faça o commit do `.cache`;
* Conecte o Vercel ao seu repositório;
* Certifique-se de definir sua raiz para `app`;
* Adicione suas variáveis `.env` (já que não vamos fazer o commit do nosso arquivo `.env`);
* Faça a implantação;
* Concluído!

[Loom](https://www.loom.com/share/ce89a285b90a4b34ac358fce9ae7f92d)

Nota: No Vercel, você precisará adicionar a 6ª variável de ambiente como `CI=false`. Isso garantirá que nossa compilação não falhe devido a avisos.

![https://camo.githubusercontent.com/daa43421b435444beec8a23878d1138c1929e48b97c1a571745bbab0ca3056b0/68747470733a2f2f692e696d6775722e636f6d2f776e3255686a342e706e67](https://camo.githubusercontent.com/daa43421b435444beec8a23878d1138c1929e48b97c1a571745bbab0ca3056b0/68747470733a2f2f692e696d6775722e636f6d2f776e3255686a342e706e67)


### 😍 Olá, Mestre da Solana

É super emocionante que você conseguiu chegar ao fim. Isso é algo grandioso!! A Solana ainda está **super no início** e já é muito poderosa! E agora você teve a chance de mexer com a tecnologia principal. Aí sim!! Agora você tem todas as habilidades que precisa para construir seus próprios drops de NFT na Solana.

Obrigado por contribuir para o futuro da web3 aprendendo essas coisas. O fato de você saber como isso funciona e como codificar tudo isso é um superpoder. Use seu poder com sabedoria ;).


### 🥞 Carreiras na Web3

Um grande número de pessoas também conseguiram empregos em tempo integral nas principais empresas da web3 através da Buildspace. Estou constantemente vendo as pessoas arrasarem em suas entrevistas depois de fazerem alguns projetos da Buildspace.

![https://camo.githubusercontent.com/99547045e82bba224e619aa968c873e0355f5482c63e428b2590948806fadb66/68747470733a2f2f692e696d6775722e636f6d2f434e7a4c6451632e706e67](https://camo.githubusercontent.com/99547045e82bba224e619aa968c873e0355f5482c63e428b2590948806fadb66/68747470733a2f2f692e696d6775722e636f6d2f434e7a4c6451632e706e67)

**As pessoas parecem pensar que a web3 só precisa de pessoas que possam codificar contratos inteligentes ou escrever código que faça interface com a blockchain. Isso não é verdade.**

Há muito trabalho a fazer e a maior parte do trabalho nem precisa ser feito com contratos inteligentes (risos). **Ser um engenheiro em web3 significa apenas pegar suas habilidades de web2 e aplicá-las à web3.**

Eu quero passar rapidamente pelo significado de "trabalhar na web3" como engenheiro. _Você precisa ser um profissional na Solana? Você precisa saber como funciona cada pequena coisa sobre a blockchain?_

Por exemplo, digamos que você seja um ótimo engenheiro de front-end. Se você terminou este projeto, **você tem quase tudo o que precisa para ser um ótimo engenheiro de front-end em uma empresa web3**. Por exemplo, a empresa pode dizer "Ei, por favor, vá e construa nosso recurso de conexão à carteira" - e você já terá uma ideia sólida de como fazer isso :).

Eu só quero inspirá-lo a trabalhar na web3 (risos). Essa área é incrível. E seria legal se você desse uma chance ;).

Certifique-se de clicar em "Trabalhar na Web3" à esquerda e preencher seu perfil se ainda não o fez!!! **Somos parceiros de algumas das melhores empresas web3 do mundo (ex. ex. Uniswap, OpenSea, Chainlink, Edge & Node, e mais) e elas querem contratar desenvolvedores da rede Buildspace :).** Você já adquiriu uma habilidade que é extremamente valiosa e as empresas estão pagando caro por incríveis engenheiros da web3.


### 🤟 Seu NFT!

Enviaremos seu NFT por airdrop dentro de uma hora e enviaremos um e-mail assim que ele estiver em sua carteira. Está rodando em uma tarefa do cron! Se você não receber o e-mail dentro de 24 horas, por favor envie-nos uma mensagem em #feedback e marque o **@alec#8853.**

**Certifique-se de clicar no botão na parte inferior desta página e de enviar o seu último link. Caso contrário, nosso sistema não o marcará como "concluído".**

### 🌈 Antes de sair

Vá para #progress no Discord e envie-nos o link do seu produto final, pois queremos mexer nele :).

Além disso, você deve twittar seu projeto final e mostrar para o mundo a sua criação épica! O que você fez não foi nada fácil. Tente até fazer um pequeno vídeo mostrando seu projeto e anexe-o ao tweet. Deixe seu tweet bonito e mostre para o mundo o que você fez!!

E se você quiser, marque a @_buildspace :). **Isso nos dá muita motivação, sempre que vemos as pessoas enviarem seus projetos.** Além disso, você pode inspirar outra pessoa a entrar no mundo da Solana.

Nos dê essa dose de dopamina, por favor.

Por fim, o que também seria incrível, é se você nos dissesse na seção de feedback do Discord o quanto gostou deste projeto e de como ele foi estruturado. O que você mais gostou no Buildspace? O que não curtiu? O que gostaria que mudássemos para projetos futuros? Seu feedback seria incrível!

Vejo você por aí!!!
