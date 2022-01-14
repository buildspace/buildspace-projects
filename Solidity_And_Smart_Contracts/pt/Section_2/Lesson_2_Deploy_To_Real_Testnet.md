📤 Configurando o deploy na blockchain
-----------------------------------------

Vá em frente e feche o terminal que está rodando a sua rede local da blockchain, que é onde você rodou `npx hardhat node`. Nós não precisaremos mais dele ;). Eu só queria te mostrar como funciona deployar localmente.

A partir de agora nós vamos pra vida real, deployando numa blockchain de verdade. 

Abra uma conta na Alchemy [aqui](https://alchemy.com/?r=b93d1f12b8828a57).

Foi mal por pedir que abra tantas contas, mas, esse ecossistema é complexo e queremos usufruir de todas as ferramentas maravilhosas disponíveis. O que a Alchemy faz é nos dar um jeito simples de fazer o deploy na blockchain do Ethereum.

💳 Transações
---------------

Então, quando nós queremos realizar uma ação na blockchain do Ethereum nós a chamamos de *transação*. Por exemplo, enviar Ethereum para alguém é uma transação. Fazer algo que atualiza uma variável no nosso contrato também é considerado uma transação.

Quando chamamos a função `wave` e ela faz `totalWaves += 1`, isso é uma transação! **Deployar um contrato inteligente também é uma transação.**

Lembre-se, a blockchain não tem dono(a). Ela é um monte de computadores de **mineradores** do mundo todo que rodam uma cópia da blockchain.

Quando deployamos o nosso contrato, nós precisamos informar **todos esses** mineradores, "ow, esse é um novo contrato inteligente, por favor adicione-o na blockchain e informe todo mundo sobre isso".

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

Se as instruções acima não funcionarem, use o comando `/faucet` no canal #faucet-request e o nosso bot vai te mandar um pouco! Se você quiser um pouco mais, mande o endereço público da sua carteira e deixe um gif engraçado junto. Eu ou outra pessoa do projeto vai te mandar um pouco de ETH de mentira assim que pudermos. Quanto mais engraçado o gif, mais rápido vão te enviar o ETH de mentira KKKKKKK.

📈 Deploy na Rinkeby testnet.
---------------------------------

Nós precisaremos mudar nosso arquivo `hardhat.config.js`. Você pode encontrá-lo na pasta raiz do projeto do seu smart contract.

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

**Nota: NÃO FAÇA COMMIT DESTE ARQUIVO NO GITHUB. ELE TEM SUA CHAVE PRIVADA. VOCÊ SERÁ HACKEADO + ROUBADO. ESSA CHAVE É A MESMA DA CHAVE PRIVADA DA SUA MAINNET.** Nós falaremos sobre `.env` (variáveis de ambiente) depois e como manter essas coisas secretas.

Você pode copiar a URL da API da Alchemy na dashboard dela e colar no código. Depois, você vai precisar da sua chave **privada** da rinkeby (não é o seu endereço público!) que você pode pegar do metamask e colar no código também.

**Nota: Acesse a sua chave privada ao abrir o MetaMask, mudar a rede para "Rinkeby Test Network" e depois clicar nos três pontinhos e selecionar "Account Details" > "Export Private Key"**

Por quê você precisa usar sua chave privada? Para fazer uma transação como deployar um contrato, você precisa "logar" à blockchain. E, seu username é seu endereço público e sua senha é sua chave privada. É parecido com logar na AWS ou GCP para deployar.

Uma vez que você arrumou seu arquivo config está tudo pronto para deployar o script de deploy que escrevemos antes.

Rode este commando da pasta raiz do `my-wave-portal`. Perceba que tudo que nós fizemos foi mudar de `localhost` para `rinkeby`.

```bash
npx hardhat run scripts/deploy.js --network rinkeby
```

❤️ Deployado! 
-------------

Aqui está meu output

```bash
Deploying contracts with the account: 0xF79A3bb8d5b93686c4068E2A97eAeC5fE4843E7D
Account balance: 3198297774605223721
WavePortal address: 0xd5f08a0ae197482FA808cE84E00E97d940dBD26E
```

Copie aquele endereço do contrato deployado na ultima linha e salve-o em algum lugar. Não o perca! Você precisará dele para o frontend depois :). O seu será um pouco diferente do meu.

**Você acabou de deployar seu contracto. WOOOOOOOOO.**

Você pode pegar aquele endereço e colar no Etherscan [aqui](https://rinkeby.etherscan.io/). Etherscan é um lugar que nos mostra o estado da blockchain e nos ajuda a ver em que situação nossa transação se encontrar. Você pode ver sua transação aqui :). Pode demorar um pouquinho para aparecer!

Por exemplo, [aqui](https://rinkeby.etherscan.io/address/0xd5f08a0ae197482FA808cE84E00E97d940dBD26E) está o meu!

🚨 Antes de clicar em "Próxima Lição"
---------------------------------

**VOCÊ ACABOU DE FAZER MUITA COISA.**

Você deveria **tweetar** que você acabou de escrever e deployar seu primeiro smart contract e marcar @_buildspace. Se você quiser, coloque um print da página do Etherscan que mostra que seu contrato está na blockchain!

É muito importante você ter chegado até aqui. Você realmente criou e deployou algo na blockchain. **Caramba**. **Estou orgulhoso.**

Agora você é realmente uma pessoa que está "fazendo" a coisa que a maioria das pessoas estão apenas "falando" sobre.

Você está um passo mais próximo de se tornar mestre das artes da web3.

CONTINUE A NADAR :).

--

*Um obrigado para as pessoas que já estão tweetando sobre nós, todos vocês são lendas <3.*

![](https://i.imgur.com/1lMrpFh.png)

![](https://i.imgur.com/W9Xcn4A.png)

![](https://i.imgur.com/k3lJlls.png)
