### **🙉 Uma nota sobre o github**

**Se estiver fazendo upload para o Github, não faça upload do seu arquivo hardhat config com sua chave privada para seu repositório. Você vai ser roubado.**

Eu uso o dotenv para isso.

```javascript
npm install --save dotenv
```

```javascript
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
  solidity: "0.8.0",
  networks: {
    goerli: {
      url: process.env.STAGING_ALCHEMY_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
    mainnet: {
      chainId: 1,
      url: process.env.PROD_ALCHEMY_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
```

E o seu arquivo .env vai se parecer com isso:

```javascript
STAGING_ALCHEMY_KEY=BLAHBLAH;
PROD_ALCHEMY_KEY=BLAHBLAH;
PRIVATE_KEY=BLAHBLAH;
```

(não commite seu arquivo .env depois disso)

### 🌎 Pegue seus assets de imagem no IPFS.

Agora - as imagens do nosso boss e do personagem estão no Imgur.

**Isso não é bom**. Se o Imgur for derrubado, nossos incríveis personagens se vão e nossas NFTs são inúteis!!

Com sorte nós temos algo chamado [IPFS](https://en.wikipedia.org/wiki/InterPlanetary_File_System) que é essencialmente um sistema de arquivos distribuídos hoje em dia - você pode usar algo como S2 ou GCP Storage. Mas, nesse caso nós simplesmente confiamos no IPFS que é rodada por estranhos que estão usando a rede. Leia [isso](https://decrypt.co/resources/how-to-use-ipfs-the-backbone-of-web3) rapidamente quando puder! Fala muito sobre conhecimentos base :).

Eu não vou estar cobrindo como colocar suas coisas no IPFS + conectar seu React app passo a passo, mas vou te dar alguma direção!

Primeiro, você vai precisar fazer upload das suas imagens para um serviço que se especializa em "[pinning](https://docs.ipfs.io/how-to/pin-files/)" - que significa que o seu arquivo vai essencialmente ficar em cachê para que seja facilmente recuperado. Eu gosto de usar o [Pinata](https://www.pinata.cloud/) como o meu serviço de pinning - só crie uma conta, faça upload sua imagem do personagem a partir da UI deles, e é isso!

![Untitled](https://i.imgur.com/LA0RExz.png)

Vá em frente e copie os arquivos "CID". Esses são os endereços do conteúdo no IPFS! O que é legal é que agora temos que criar esse link:

```javascript
https://cloudflare-ipfs.com/ipfs/INSIRA_SUA_CID_AQUI
```

Se você estiver usando o **Brave Browser** (que tem IPFS construído nele) você pode só escrever esse paste no seu URL:

```javascript
ipfs://INSIRA_SUA_CID_AQUI
```

E isso vai começar um node IPFS na sua máquina local e recuperar o arquivo! Mas de novo, eu só fiz isso no **Brave**. Se você tentar fazer isso em algo como o Chrome, só fará uma pesquisa no Google.

![Untitled](https://i.imgur.com/NplQpes.png)

Daqui, você pode mudar seu link imgur em `run.js` para `ipfs` hashes! Para o exemplo, eu usei o mesmo CID para todos os personagens mas no seu caso você deve ter três diferentes, um para cada personagem!

```javascript
const gameContract = await gameContractFactory.deploy(
  ["Anitta", "Ronaldinho Gaúcho", "Zeca Pagodinho"],
  [
    "bafybeihyuz2nvvi6srxnyp2g54p3xhwufhu4d2wvewnkak7lifq7lsjo5a",
    "bafybeihyuz2nvvi6srxnyp2g54p3xhwufhu4d2wvewnkak7lifq7lsjo5a",
    "bafybeihyuz2nvvi6srxnyp2g54p3xhwufhu4d2wvewnkak7lifq7lsjo5a",
  ],
  [100, 200, 300],
  [100, 50, 25],
  "Capitão Nascimento",
  "bafybeichyipy7k757abludnvidqqfukyy56cclsxlb63ppl2fm75olpzcm",
  10000,
  50
);
```

Daqui, nós precisamos atualizar nossa função `tokenURI` para preceder `ipfs://`. Basicamente, o OpenSea gosta quando nosso URI de imagem é estruturada como isso: `ipfs://INSIRA_SUA_CID_AQUI`.

Você deve estar se perguntando porque em `run.js` eu não apenas diretamente linkei para `ipfs://INSIRA_SUA_CID_AQUI` ou `https://cloudflare-ipfs.com/ipfs/INSIRA_SUA_CID_AQUI`. Basicamente - é mais seguro só armazenar o hash no contrato, isso nos deixa ser mais flexível :).

Então, eu mudei a variável `json` no `tokenURI` para parecer com isso:

```javascript
string memory json = Base64.encode(
      bytes(
        string(
          abi.encodePacked(
            '{"name": "',
            charAttributes.name,
            ' -- NFT #: ',
            Strings.toString(_tokenId),
            '", "description": "An epic NFT", "image": "ipfs://',
            charAttributes.imageURI,
            '", "attributes": [ { "trait_type": "Health Points", "value": ',strHp,', "max_value":',strMaxHp,'}, { "trait_type": "Attack Damage", "value": ',
            strAttackDamage,'} ]}'
          )
        )
      )
    );
```

Tudo que eu fiz foi preceder aquele pequeno `ipfs://` depois da tag `image` - e depois eu anexo na CID! Isso vai basicamente criar nosso link. Nota: é realmente fácil confundir isso então seja cuidadoso com todas as marcas de cotação, etc! Aqui está como meus metadados parecem agora, por exemplo:

```javascript
{
	"name": "Zeca Pagodinho -- NFT #: 1",
	"description": "An epic NFT",
	"image": "ipfs://bafybeiaaghdi5oio5a5gt6gwgxcii4h54ua4kvpjqbwszcmxvxisjoawoy",
	"attributes": [{
		"trait_type": "Health Points",
		"value": 300,
		"max_value": 300
	}, {
		"trait_type": "Attack Damage",
		"value": 25
	}]
}
```

Épico, estamos fora do imgur.

Plataformas como OpenSea suportam links `ipfs` para que isso funcione - eles vão saber como ler e renderizar isso! Nós agora temos um problema final - **renderizar a imagem no nosso app React**!! Se nós só dermos ao nosso app React como `ipfs://bafybeiaaghdi5oio5a5gt6gwgxcii4h54ua4kvpjqbwszcmxvxisjoawoy` na tag `src` do `<img>` que não vai funcionar! Ao invés disso, no nosso app React, onde for que você renderizar a tag `src` da imagem, simplesmente faça isso:

```javascript
<img
  src={`https://cloudflare-ipfs.com/ipfs/${INSIRA_A_CID_QUE_VEIO_DO_CONTRATO}`}
/>
```

Agora, você deve estar se perguntando - o que o Cloudflare está fazendo aqui? Basicamente - eles estão rodando um nó IPFS no seu comportamente e nos deixar usá-lo para acessar os arquivos na rede. Tecnicamente, você poderia fazer isso [você mesmo](https://dev.to/dabit3/uploading-files-to-ipfs-from-a-web-application-50a) se você realmente quisesse!

**Bam - você agora está usando IPFS :). Não foi tão difícil, certo!?**

## 🐸 Mostre todos os outros jogadores no jogo!

Agora, tudo que você vê é você mesmo e o boss -- e se pudéssemos ver uma lista de todos os outros jogadores? Talvez você poderia mostrar o endereço de suas carteiras, a imagem dos seus personagens, e quanto dano eles deram no boss!

**Faria o jogo se sentir mais "multiplayer" :).**

Dê uma tentativa. Não vou tentar explicar aqui mas eu acho que você tem todas as informações necessárias para mudar esse contrato e o web app para fazer isso acontecer! Tudo que você precisa é criar uma função como `getAllPlayers` e depois chamá-la a partir do seu web app + renderizar os dados.

## ⚡️ Adicione a chance de hit crítico

Muitos jogos tem um conceito legal de "hit crítico", como em Pokémon! Introduzir RNG para os jogos é muito legal, já que traz a chance para o jogo. Seria legal se você implementasse hits críticos -- por exemplo se tivesse 5% de chance que algum dos seus personagens desse o dobro de dano. Ou talvez 20% de chance que o ataque do boss erre e o player não perca vida!

Seria legal se personagem específicos tivessem uma chance maior de um ataque crítico!

![](https://i.imgur.com/S0r7rfm.png)

Conseguir um número aleatório **verdadeiro** é impossível em Solidity. Sinta-se livre para ler mais sobre [aqui](https://github.com/buildspace/buildspace-projects/blob/main/Solidity_And_Smart_Contracts/en/Section_4/Lesson_1_Randomly_Pick_Winner.md) de um projeto anterior da buildspace.

Aqui é onde o Chainlink entra -- que é um oracle que nos dá números que são verdadeiramente aleatórios. Aqui está um guia na implementação [disso](https://www.youtube.com/watch?v=JqZWariqh5s). Você pode tentar implementar números aleatórios sem Chainlink primeiro, como fazemos [aqui](https://github.com/buildspace/buildspace-projects/blob/main/Solidity_And_Smart_Contracts/en/Section_4/Lesson_1_Randomly_Pick_Winner.md).
