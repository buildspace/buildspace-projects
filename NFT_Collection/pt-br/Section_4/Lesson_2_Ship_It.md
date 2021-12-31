🙉 Uma observação sobre o Github
----------------

**Se estiver fazendo upload para o Github, não faça upload do arquivo de configuração do hardhat com a sua chave privada para o repositorio. Você será roubado.**

Eu uso o dontenv para isso.


```bash
npm install --save dotenv
```

```javascript
require('@nomiclabs/hardhat-waffle');
require('dotenv').config();

module.exports = {
  solidity: '0.8.0',
  networks: {
    rinkeby: {
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
E seu arquivo .env seria algo como:

```plaintext
STAGING_ALCHEMY_KEY=BLAHBLAH
PROD_ALCHEMY_KEY=BLAHBLAH
PRIVATE_KEY=BLAHBLAH
```

(Não commite o seu `.env` depois disso rs, tenha certeza que ele está no seu arquivo `.gitignore`).)

Lembra da mudança que fizemos no `.gitignore` anteriormente? Agora você pode revertê-lo removendo a linha `hardhat.config.js`, porque agora esse arquivo contém apenas variáveis que representam suas chaves, e não suas informações de chave reais.

🌎 Uma observação sobre IPFS
----------------

Vou apenas deixar isso para você explorar, mas, às vezes, você não vai querer armazenar todos os dados seus NFTs dentro da blockchain (on-chaibn). Talvez você queira ter um vídeo como NFT. Fazer isso (on-chain) seria extremamente caro devido às taxas de gas.

Nesse caso, você poderia usar algo chamado [IPFS](https://docs.ipfs.io/concepts/what-is-ipfs/), que é quase como um sistema de armazenamento de dados descentralizado que ninguém realmente possui. É administrado pelo povo.

Na verdade, é muito fácil de implementar com um serviço chamado [Pinata](https://www.pinata.cloud/).

Lembre-se de que um NFT é apenas um arquivo JSON que no final do dia esta vinculado a alguns metadados. Você pode colocar esse arquivo JSON no IPFS. Você também pode colocar os próprios dados NFT (por exemplo, uma imagem, vídeo, etc.) no IPFS. Não complique demais :).

**Uma grande porcentagem de NFTs usa IPFS. É a forma mais popular de armazenar dados NFT hoje.**

Vou deixar para você explorar!! ;)

📝 Verifique o contrato no Etherscan.
------------------

Você sabe que pode mostrar o código-fonte do seu contrato inteligente para o mundo? Isso permitirá que sua lógica seja realmente transparente. Fiel ao conceito de blockchain público. Todos que desejam interagir com seu smart contract na blockchain são capazes de examinar a lógica do contrato primeiro! Para isso, o Etherscan possui a função **Verify Contract**. [Aqui](https://rinkeby.etherscan.io/address/0x902ebbecafc54f7a8013a9d7954e7355309b50e6#code) é um exemplo de como será um contrato verificado. Sinta-se à vontade para examinar o contrato você mesmo.

Se você selecionar a aba **Contract** no Etherscan, notará uma longa lista de caracteres de texto que começa em `0x608060405234801 ...` Hmm .. o que poderia ser 🤔?

![image](https://user-images.githubusercontent.com/60590919/139609052-f4bba83c-f224-44b1-be74-de8eaf31b403.png)

Acontece que esse grupo de coisa escrita grande e confusa é, na verdade, os bytecodes do contrato que você lançou! Bytecodes representam uma série de opcodes no EVM que irão executar as instruções para nós on-chain.

São muitas informações novas para entender, então não se preocupe se não fizer muito sentido agora. Reserve um momento para verificar o que significam os bytecodes e o EVM! Use o Google ou entre em contato com o `#general-chill-chat` no Discord :). [Este aqui também é um artigo legal](https://ethervm.io/) sobre opcodes EVM, a propósito 🤘.

Portanto, sabemos que os bytecodes não podem ser lidos por nós. Mas queremos ser capazes de ver o código que escrevemos certo no Etherscan. Felizmente, Etherscan tem a magia para nos ajudar a fazer isso!

Observe que há um botão que nos permite **Verify and Publish** (Verificar e Publicar) o código-fonte do nosso contrato. Se seguirmos o link, seremos obrigados a selecionar manualmente nossas configurações de contrato e colar nosso código para publicar nosso código-fonte.

Felizmente para nós, o hardhat oferece uma maneira mais inteligente de fazer isso.. 

Volte para o projeto do hardhat e instale `@nomiclabs/hardhat-etherscan` executando o comando:
```
npm i -D @nomiclabs/hardhat-etherscan
```

Então no seu `hardhat.config.js` adicione o seguinte:

```javascript
require("@nomiclabs/hardhat-etherscan");

// Rest of code
...

module.exports = {
  solidity: "0.8.0",

  // Rest of the config
  ...,
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: "",
  }
};

```

Estamos quase lá! Você deve ter notado que o objeto `etherscan` em nossa configuração requer uma `apiKey`! Isso significa que você precisará de uma conta no Etherscan para obter esta chave.

Se você ainda não tem uma conta, vá para [https://etherscan.io/register](https://etherscan.io/register) para criar uma conta de usuário gratuita. Depois disso, vá para as configurações do seu perfil e em `API-KEYs` crie um novo apikey

![image](https://user-images.githubusercontent.com/60590919/139610459-b590bbc1-0d4e-4e78-920b-c45e61bf2d7e.png)

Legal, você conseguiu sua chave de API. É hora de voltar ao arquivo `hardhat.config.js` e alterar a propriedade `apiKey` para ser a chave recém-gerada.

**Nota: Não compartilhe sua chave da API do Etherscan com outras pessoas**

Estamos chegando ao último passo, eu prometo. Tudo o que resta agora é executar o comando

```
npx hardhat verify YOUR_CONTRACT_ADDRESS --network rinkeby 
```
Se tudo correr bem, você deverá ver algumas saídas no terminal. O meu é assim:

![image](https://user-images.githubusercontent.com/60590919/139611432-16d8c3fc-04b1-44c8-b58a-27f49e94d492.png)

Volte para a página do contrato no Rinkeby Etherscan seguindo o link retornado no terminal e você notará que o Etherscan magicamente (com a sua ajuda) transformou os bytecodes em um código Solidity muito legível.

![image](https://user-images.githubusercontent.com/60590919/139611635-3d1d7aae-8bb8-47f5-9396-6a4544badebf.png)

Todos podem ver o quão incrível é o seu smart contract agora!

Espere e tem mais. Existem agora duas novas sub-abas `Read Contract` & `Write Contract`, que podemos usá-los para interagir instantaneamente com nosso contrato inteligente on-chain. Muito legal!

![image](https://user-images.githubusercontent.com/60590919/139611805-b2a41039-ec79-402d-b198-4936d25ff277.png)


😍 Você conseguiu.
---------------

Super emocionante que você chegou ao fim. Um grande feito!

Antes de sair, certifique-se de adicionar alguns daqueles pequenos retoques finais da lição anterior, se desejar. Isso realmente faz a diferença. Quando estiver pronto, poste um link para seu projeto em #showcase. Seus colegas de classe serão os primeiros a cunhar alguns de seus incríveis NFTs!

Obrigado por contribuir para o futuro da web3 ao aprender essas coisas. O fato de você saber como isso funciona e como codificá-lo é um superpoder. Use seu poder com sabedoria ;).

🔮 Levando seu projeto adiante!
---------
