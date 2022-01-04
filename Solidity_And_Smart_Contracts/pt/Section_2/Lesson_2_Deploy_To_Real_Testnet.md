📤 Configurando o deploy na blockchain
-----------------------------------------

Vá em frente e feche o terminal que está rodando a sua rede local da blockchain, que é onde você rodou `npx hardhat node`. Nós não precisaremos mais dele ;). Eu só queria te mostrar como funciona deployar localmente.

A partir de agora nós vamos pra vida real, deployando numa blockchain de verdade. 

Abra uma conta na Alchemy [aqui](https://alchemy.com/?r=b93d1f12b8828a57).

Foi mal por pedir que abra tantas contas, mas, esse ecossistema é complexo e queremos usufruir de todas as ferramentas maravilhosas disponíveis. O que a Alchemy faz é nos dar um jeito simples de deployar na blockchain do Ethereum.

💳 Transações
---------------

Então, quando nós queremos realizar uma ação na blockchain do Ethereum nós a chamamos de *transação*. Por exemplo, enviar Ethereum para alguém é uma transação. Fazer algo que atualiza uma variável no nosso contrato também é considerado uma transação.

Quando chamamos a função `wave` e ela faz `totalWaves += 1`, isso é uma transação! **Deployar um smart contract também é uma transação.**

Lembre-se, a blockchain não tem dono(a). Ela é um monte de computadores de **mineradores** do mundo todo que rodam uma cópia da blockchain.

Quando deployamos o nosso contrato, nós precisamos informar **todos esses** mineradores, "ow, esse é um novo smart contract, por favor adicione-o na blockchain e informe todo mundo sobre isso".

É aqui que o Alchemy entra.

Alchemy basicamente nos ajuda a transmitir a transação da criação do nosso contrato para que ele seja selecionado pelos mineradores o mais rápido possível. Uma vez que a transação transação é minerada, ela é transmitida para a blockchain como uma transação legítima. A partir daí, todo mundo atualiza sua cópia da blockchain.

Isso é complicado. Mas não se preocupe se não entender tudo por completo. Conforme você escreve mais código e realmente constroe esse app, naturalmente as coisas farão mais sentido. 

Por isso, faça uma conta na Alchemy [aqui](https://alchemy.com/?r=b93d1f12b8828a57).

Confira o video abaixo para ver como conseguir sua chave de API para uma testnet!
[Loom](https://www.loom.com/share/21aa1d64ea634c0c9da8fc5faaf24283)

🕸️ Testnets
------------

Nós não vamos deployar na "Ethereum mainnet" antes de terminar o projeto todo. Por quê? Porque custa $ de verdade e não vale a pena no momento! Nós vamos começar com a "testnet" que é um clone da "mainnet" mas ela usa $ de mentira para que possamos testar o quanto quisermos. Ah, é importante saber que as testnets são conduzidas por mineradores de verdade e imitam situações do mundo real.

Isso é muito bom porque podemos testar nossa aplicação em situções reais nas quais nós realmente iremos:

1\. Transmitir nossa transação

2\. Esperar para que ela seja selecionada por mineradoes de verdade

3\. Esperar para que seja minerada

4\. Esperar para que ela seja transmitada novamente para a blockchain pedindo para que todos os outros mineradores atualizem suas cópias

Portanto, você fará tudo isso nas próximas lições :).


🤑 Arrumando $ de mentirinha
------------------------

Existem algumas testnets por aí e nós iremos utilizar uma chamada "Rinkeby" que é apoiada pela fundação Ethereum.

Para deployar na Rinkeby, nós precisamos de ether de mentira. Por quê? Porque se você estivesse deployando na mainnet, você usaria dinheiro real! Logo, testnets copiam a forma que a mainnet funciona, a única diferença é que não tem dinheiro de verdade envolvido. 

Para conseguir ETH de mentira, nós temos que pedir um pouco para a rede. **Esse ETH de mentirinha só vai funcionar nessa testnet específica.** Você pode conseguir um pouco de ETH de mentira para a Rinkeby através de uma _faucet_. Confira se a sua carteira MetaMask está listando a "Rinkeby Test Network" antes de usar a faucet.

Para MyCrypto, clique no link e lá você precisará conectar sua carteira, criar uma conta, e então clicar no mesmo link para solicitar fundos. Para a faucet oficial da Rinkeby, se ela estiver listando 0 peers, nem vale a pena perder tempo fazendo um tweet/post público no Facebook.

| Nome             | Link                                  | Quantidade      | Tempo        |
| ---------------- | ------------------------------------- | --------------- | ------------ |
| MyCrypto         | https://app.mycrypto.com/faucet       | 0.01            | Nenhum       |
| Buildspace       | https://buildspace-faucet.vercel.app/ | 0.025           | 1d           |
| Ethily           | https://ethily.io/rinkeby-faucet/     | 0.2             | 1sem         |
| Official Rinkeby | https://faucet.rinkeby.io/            | 3 / 7.5 / 18.75 | 8h / 1d / 3d |
| Chainlink        | https://faucets.chain.link/rinkeby    | 0.1             | Nenhum       |


🙃 Está com dificuldade para conseguir ETH na Testnet?
-----------------------------------

Se as instruções acima não funcionarem, use o comando `/faucet` no canal #faucet-request e o nosso bot vai te mandar um pouco! Se você quiser um pouco mais, mande o endereço público da sua carteira e deixe um gif engraçado junto. Eu ou outra pessoa do projeto vai te mandar um pouco de ETH de mentira assim que pudermos. Quanto mais engraçado o gif, mais rápido vão te enviar o ETH de mentira LOL.
If the above doesn't work, use the `/faucet` command in the #faucet-request channel and our bot will send you some! If you want some more, send your public wallet address and drop a funny gif. Either me, or someone from the project will send you some fake ETH as soon as they can. The funnier the gif, the faster you will get sent fake ETH LOL.

📈 Deploy na Rinkeby testnet.
---------------------------------

We'll need to change our `hardhat.config.js` file. You can find this in the root directory of your smart contract project.

```javascript
require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.0",
  networks: {
    rinkeby: {
      url: "YOUR_ALCHEMY_API_URL",
      accounts: ["YOUR_PRIVATE_RINKEBY_ACCOUNT_KEY"],
    },
  },
};
```

**Note: DON'T COMMIT THIS FILE TO GITHUB. IT HAS YOUR PRIVATE KEY. YOU WILL GET HACKED + ROBBED. THIS PRIVATE KEY IS THE SAME AS YOUR MAINNET PRIVATE KEY.** We'll talk about `.env` variables later and how to keep this stuff secret.

You can grab your API URL from the Alchemy dashboard and paste that in. Then, you'll need your **private** rinkeby key (not your public address!) which you can grab from metamask and paste that in there as well.

**Note: Accessing your private key can be done by opening MetaMask, change the network to "Rinkeby Test Network" and then click the three dots and select "Account Details" > "Export Private Key"**

Why do you need to use your private key? Because in order to perform a transaction like deploying a contract, you need to "login" to the blockchain. And, your username is your public address and your password is your private key. It's kinda like logging into AWS or GCP to deploy.

Once you've got your config setup we're set to deploy with the deploy script we wrote earlier.

Run this command from the root directory of `my-wave-portal`. Notice all we do is change it from `localhost` to `rinkeby`.

```bash
npx hardhat run scripts/deploy.js --network rinkeby
```

❤️ Deployed! 
-------------

Here's my output:

```bash
Deploying contracts with the account: 0xF79A3bb8d5b93686c4068E2A97eAeC5fE4843E7D
Account balance: 3198297774605223721
WavePortal address: 0xd5f08a0ae197482FA808cE84E00E97d940dBD26E
```

Copy that address of the deployed contract in the last line and save it somewhere. Don't lose it! You'll need it for the frontend later :). Yours will be different from mine.

**You just deployed your contract. WOOOOOOOOO.**

You can actually take that address and then paste it into Etherscan [here](https://rinkeby.etherscan.io/). Etherscan is a place that just shows us the state of the blockchain and helps us see where our transaction is at. You should see your transaction here :). It may take a minute to show up!

For example, [here's](https://rinkeby.etherscan.io/address/0xd5f08a0ae197482FA808cE84E00E97d940dBD26E) mine!

🚨 Before you click "Next Lesson"
---------------------------------

**YOU JUST DID A LOT.**

You should totally **tweet** out that you just wrote and deployed your first smart contract and tag @_buildspace. If you want, include a screenshot of the Etherscan page that shows that your contract is on the blockchain!

It's a big deal that you got this far. You created and deployed something to the actual blockchain. **Holy shit**. **I'm proud of you.**

You're now someone who is actually "doing" the thing that mostly everyone else is just "talking" about.

You're a step closer to mastering the arts of web3.

KEEP GOING :).

--

*Ty to the people who have already been tweeting about us, y'all are legends <3.*

![](https://i.imgur.com/1lMrpFh.png)

![](https://i.imgur.com/W9Xcn4A.png)

![](https://i.imgur.com/k3lJlls.png)
