Uma coisa que estamos fazendo que é super importante de se reconhecer é que estamos mudando os atributos das nossas NFTs.

Por exemplo, quando fazmos `player.hp = player.hp - bigBoss.attackDamage;` estamos na verdade mudando o atributo de Health Points que aparece no OpenSea na NFT. Vamos testar isso para ter certeza que está funcionando como o esperado!

### 👻 Fazer deploy de novo e ver as NFTs mudando de valor.

Copie tudo de `run.js` e sobrescreva o que está em `deploy.js`. Aqui está como o meu `run.js` se parece:

```javascript
const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory("MyEpicGame");

  const gameContract = await gameContractFactory.deploy(
    ["Leo", "Aang", "Pikachu"],
    [
      "https://i.imgur.com/pKd5Sdk.png",
      "https://i.imgur.com/xVu4vFL.png",
      "https://i.imgur.com/u7T87A6.png",
    ],
    [100, 200, 300],
    [100, 50, 25],
    "Elon Musk",
    "https://i.imgur.com/AksR0tt.png",
    10000,
    50
  );

  await gameContract.deployed();
  console.log("Contrato deployado no endereço:", gameContract.address);

  let txn;
  // Só temos 3 personagens.
  // Uma NFT com personagem no index 2 da nossa array.
  txn = await gameContract.mintCharacterNFT(2);
  await txn.wait();

  txn = await gameContract.attackBoss();
  await txn.wait();

  txn = await gameContract.attackBoss();
  await txn.wait();

  console.log("Done!");
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
```

De novo, eu só gosto de manter os dois separados já que `deploy.js` não muda muito. O que queremos testar aqui é a função `attackBoss`. Ela deve mudar o HP no NFT.

Eu faço o deploy usando `npx hardhat run scripts/deploy.js --network goerli`. A partir daí, aqui está meu output:

```plaintext
Contrato deployado no endereço: 0x02f59Dc14666c4480Ae4b477eFfF15949970dfeA
```

Uma vez que esperar alguns minutos, sites como o OpenSea ou o Rarible devem mostrar sua NFT com o HP atualizado.

Então nesse caso, eu mintei um `Pikachu` NFT e fiz ele atacar o `Elon Musk` duas vezes. `Pikachu` começou **com 300 de HP**, então se ele atacar o Elon duas vezes, significa que agora ele deve ter 200 de HP (pois Elon ataca de volta).

No OpenSea, aqui está como isso se parece pra mim:

![](https://i.imgur.com/dv5Q2lR.png)

Está tudo funcionando como deveria!! Oba!! Pikachu perdeu vida!!

Sinta-se livre para ver no Rarible também. Só saiba que o Rarible é um pouco mais lento para mostrar metadados atualizados! `https://goerli.rarible.com/token/INSERT_DEPLOY_CONTRACT_ADDRESS_HERE:INSERT_TOKEN_ID_HERE`.

![](https://i.imgur.com/Pwx4IOM.png)

**Nota 1:** Não vê suas estatísticas atualizadas no OpenSea ou no Rarible? **Clique no botão de recarregar que eu destaquei em cima na direita e espere alguns minutos.** Se estiver usando o Rarible, eu notei que pode levar de 10-20 min para atualizar as estatísticas. _OpenSea é mais rápido nesse quesito_.

**Nota 2:** Eu devo mencionar que a NFT é atualizada imediatamente no contrato uma vez que `attackBoss` é minerado, mas esses third-party como OpenSea e o Rarible tem suas próprias mecânicas de caching.

### 👑 Você deixou cair isso.

VOCÊ CONSEGUIU!

Isso é uma grande coisa, conseguimos oficialmente construir uma **NFT interativa.** Coisa boa :).