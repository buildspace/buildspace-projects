💸 Envie ETH para pessoas que mandaram um tchauzinho para você
----------------------------------------

Agora o que queremos fazer é enviar um pouco de ETH para as pessoas que mandaram um tchauzinho para nós! Por exemplo, talvez você queira fazer isso onde há 1% de chance de alguém ganhar $5 mandando um tchauzinho para você. Ou talvez você queira fazer com que todos que acenem para você recebam $0,01 em ETH LOL.

Você pode até mesmo enviar ETH manualmente para as pessoas cujas mensagens você mais gostou. Talvez eles te enviaram uma música incrível!!

**Enviar ETH facilmente aos usuários é uma parte essencial dos contratos inteligentes e uma das partes mais legais deles**, então vamos fazer isso!

Para começar, vamos dar a todos que mandarem um tchauzinho para nós `0.0001 ETH`. Que era $ 0,28 no momento que escrevemos este artigo :). E tudo isso está acontecendo na testnet, então, é $ falso!

Confira minha função `wave` atualizada em `WavePortal.sol`.

```solidity
function wave(string memory _message) public {
    totalWaves += 1;
    console.log("%s tchauzinhou!", msg.sender);

    waves.push(Wave(msg.sender, _message, block.timestamp));

    emit NewWave(msg.sender, block.timestamp, _message);

    uint256 prizeAmount = 0.0001 ether;
    require(
        prizeAmount <= address(this).balance,
        "Tentando sacar mais dinheiro que o contrato possui."
    );
    (bool success, ) = (msg.sender).call{value: prizeAmount}("");
    require(success, "Falhou em sacar dinheiro do contrato.");
}
```

Isso é incrível.

Com `prizeAmount` eu apenas inicio o valor do prêmio. O Solidity na verdade nos permite usar a palavra-chave `ether` para que possamos representar facilmente valores monetários. Conveniente :)!

Também temos algumas palavras-chave novas. Você verá `require` que basicamente verifica se alguma condição é verdadeira. Se não for verdade, ele sairá da função e cancelará a transação. É como se fosse um "IF" chique!

Neste caso, está verificando se `prizeAmount <= address(this).balance`. Aqui, `address(this).balance` é o **saldo do próprio contrato.**

Por quê? **Bem, para enviarmos ETH para alguém, nosso contrato precisa ter ETH nele.**

Como isso funciona é que quando fazemos o deploy do contrato pela primeira vez, nós o "financiamos" :). Até agora, nós **nunca** financiamos nosso contrato!! Sempre valeu 0 ETH. Isso significa que nosso contrato não pode enviar ETH às pessoas porque **simplesmente não tem nenhum**! Abordaremos o financiamento na próxima seção!

O que é legal

```solidity
require(prizeAmount <= address(this).balance, "Tentando sacar mais dinheiro que o contrato possui.");
```

é que nos permite garantir que o *saldo do contrato* seja maior que o *valor do prêmio* e, se for, podemos avançar com a entrega do prêmio! Se não for, o `require` essencialmente matará a transação e será como, "Ei, este contrato não pode pagar você!".

`(msg.sender).call{value: prizeAmount}("")` é a linha mágica por onde enviamos dinheiro :). A sintaxe é um pouco estranha! Observe como passamos `prizeAmount`!

`require(success` é onde sabemos que a transação foi um sucesso :). Se não fosse, marcaria a transação como erro e diria `"Falha ao retirar dinheiro do contrato."`.

Muito legal né :)?

🏦 Financie o contrato para que possamos enviar ETH!
-----------------------------------------------

Agora configuramos nosso código para enviar ETH. Legal! Agora precisamos realmente garantir que nosso contrato seja financiado, caso contrário, não temos ETH para enviar!

Vamos trabalhar primeiro em `run.js`. Lembre-se, `run.js` é como nosso campo de testes, onde queremos ter certeza de que a funcionalidade principal de nossos contratos funciona antes de implantá-la. É **realmente difícil** depurar o código do contrato e o código do front-end ao mesmo tempo, por isso, separamos isso!

Vamos para `run.js` e fazemos algumas alterações para garantir que tudo funcione. Aqui está meu `run.js` atualizado.

```javascript
const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await waveContract.deployed();
  console.log("Endereço do contrato:", waveContract.address);

  /*
   * Consulta saldo do contrato
   */
  let contractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  );
  console.log(
    "Saldo do contrato:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  /*
   * Enviar tchauzinho
   */
  let waveTxn = await waveContract.wave("Uma mensagem!");
  await waveTxn.wait();

  /*
   * Recupera o saldo do contrato para verificar o que aconteceu!
   */
  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log(
    "Saldo do  contrato:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  let allWaves = await waveContract.getAllWaves();
  console.log(allWaves);
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

A mágica está em `hre.ethers.utils.parseEther("0.1"),`. É aqui que eu digo: "vá e faça o deploy do meu contrato e financie-o com 0.1 ETH". Isso removerá o ETH da minha carteira e o usará para financiar o contrato. **É isso**.

Eu então faço `hre.ethers.utils.formatEther(contractBalance)` para testar para ver se meu contrato realmente tem um saldo de 0.1. Eu uso uma função que o `ethers` me dá aqui chamada `getBalance` e passo o endereço do meu contrato!

Mas então, também queremos ver se quando chamamos `wave` se 0.0001 ETH é removido corretamente do contrato!! É por isso que eu imprimo o saldo novamente depois de chamar `wave`.

Quando nós executamos

```bash
npx hardhat run scripts/run.js
```

Você verá que nos deparamos com um pequeno erro!

Vai dizer algo como

```bash
Error: non-payable constructor cannot override value
```

O que isso está dizendo é que nosso contrato não pode pagar as pessoas agora! Esta é uma solução rápida, precisamos adicionar a palavra-chave `payable` ao nosso construtor em `WavePortal.sol`. Confira:

```solidity
constructor() payable {
  console.log("Contrato no ar!");
}
```

É isso :).

Agora, quando eu faço

```bash
npx hardhat run scripts/run.js
```

Isto é o que eu recebo:

![](https://i.imgur.com/JQyLSe4.png)

**Maravilhoso**.

Acabamos de enviar alguns ETH do nosso contrato, grande sucesso! E sabemos que conseguimos porque o saldo do contrato caiu 0.0001 ETH de 0.1 para 0.0999!

✈️ Atualize o script de implantação para financiar o contrato
----------------------------------------

Precisamos fazer uma pequena atualização no `deploy.js`.

```javascript
const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.001"),
  });

  await waveContract.deployed();

  console.log("Endereço do WavePortal: ", waveContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
```

Tudo o que fiz foi financiar o contrato 0.001 ETH assim:

```javascript
const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.001"),
});
```

Eu gosto de fazer o deploy em testnets com uma quantidade menor de ETH primeiro para testar!

E eu também adicionei `await waveContract.deployed()` para tornar mais fácil para eu saber quando ele foi implantado!

Fácil!

Vamos implantar nosso contrato usando a mesma linha antiga

```bash
npx hardhat run scripts/deploy.js --network rinkeby
```

Agora, quando você entrar em [Etherscan](https://rinkeby.etherscan.io/) e colar o endereço do seu contrato, verá que seu contrato agora tem um valor de 0.001 ETH! Sucesso!

**Lembre-se de atualizar seu frontend com o novo endereço do contrato *e* o novo arquivo ABI. Caso contrário, ele irá** **quebrar**.

Teste sua função de tchauzinho e verifique se ela ainda funciona!

🎁 Encerramento
----------

Há algo sobre o uso de ETH real para alimentar seus contratos, certo? Dê uma olhada em [este link](https://gist.github.com/danicuki/4fce48bc881766115370dbe2913b44fc) para ver todo o código escrito nesta seção!
