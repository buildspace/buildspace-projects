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
