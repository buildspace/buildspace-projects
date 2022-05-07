📤 Configurando para o deploy na blockchain
-----------------------------------------

Vá em frente e feche o terminal com sua rede local da blockchain em execução, onde você executou o `npx hardhat node`. Não precisaremos mais ;). Eu só queria mostrar como o deploy funciona localmente.

Agora vamos fazer o negócio real, implantando na blockchain real.

Vá em frente e [faça uma conta na Alchemy](https://alchemy.com/?r=a724fda46ee746e0).

Desculpe por ter feito tantas contas, mas esse ecossistema é complexo e queremos aproveitar as ferramentas incríveis que existem. O que a Alchemy faz é nos dar uma maneira simples de implantar na blockchain Ethereum real.

💳 Transações
---------------

Então, quando queremos realizar uma ação no blockchain Ethereum, chamamos isso de *transação*. Por exemplo, enviar Ethereum para alguém é uma transação. Fazer algo que atualize uma variável em nosso contrato também é considerado uma transação.

Então, quando chamamos `wave` e ele faz `totalWaves += 1`, isso é uma transação! **O deploy de um contrato inteligente também é uma transação.**

Lembre-se, a blockchain não tem dono. É apenas um monte de computadores ao redor do mundo administrados por **mineradores** que possuem uma cópia da blockchain.

Quando implantamos nosso contrato, precisamos dizer a **todos** mineradores: "ei, este é um novo contrato inteligente, adicione meu contrato inteligente à blockchain e também conte a todos sobre isso".

É aí que entra o Alchemy.

O Alchemy essencialmente nos ajuda a transmitir nossa transação de criação de contrato para que possa ser coletada pelos mineradores o mais rápido possível. Depois que a transação é minerada, ela é transmitida para a blockchain como uma transação legítima. A partir daí, todos atualizam sua cópia da blockchain.

Isso é complicado. E, não se preocupe se você não entender completamente. À medida que você escreve mais código e realmente constrói este aplicativo, naturalmente fará mais sentido.

Então, [faça uma conta no Alchemy](https://alchemy.com/?r=a724fda46ee746e0).

Confira o vídeo abaixo para ver como obter sua chave de API para uma rede de teste!
[Loom](https://www.loom.com/share/35aabe54c3294ef88145a03c311f1933)

🕸️ Redes de teste (Testnets)
------------

Nós não vamos implantar na "mainnet Ethereum" (rede principal produtiva) até o final. Por quê? Porque custa dinheiro real e não vale a pena para fazer testes e quebrar tudo! Vamos começar na "testnet" que é um clone da "mainnet", mas usa dinheiro falso para que possamos testar as coisas o quanto quisermos. Mas é importante saber que as redes de teste são executadas por mineradores reais e imitam cenários do mundo real.

Isso é incrível porque podemos testar nosso aplicativo em um cenário do mundo real onde iremos:

1\. Transmitir nossa transação

2\. Esperar que ela seja selecionada por mineradores reais

3\. Aguardar até que seja minerada

4\. Esperar que seja transmitida de volta para a blockchain dizendo a todos os outros mineradores para atualizar suas cópias

Então, você fará tudo isso nas próximas lições :).

🤑 Conseguindo $ falso
------------------------

Existem algumas redes de teste por aí e a que usaremos é chamada de "Rinkeby", que é administrada pela fundação Ethereum.

Para implantar na Rinkeby, precisamos de **ether** falso. Por quê? Porque se você estivesse implantando na rede principal Ethereum real, usaria dinheiro real! Então, as testnets copiam como a rede principal funciona, a única diferença é que nenhum dinheiro real está envolvido.

Para obter ETH falso, temos que pedir à alguma rede. **Este ETH falso só funcionará nesta rede de teste específica.** Você pode pegar algum ETH falso para Rinkeby através de um **faucet** (torneira). Certifique-se de que sua carteira MetaMask esteja definida como "Rinkeby Test Network" antes de usar a faucet.

Seguem alguns _faucets_ onde você pode solicitar ETH falso para a rede _Rinkeby_.

| Nome | Link | Quantidade | Tempo |
| ---------------- | -------------------------- | --------------- | ------------ |
| MyCrypto | https://app.mycrypto.com/faucet | 0,01 | Nenhum |
| Buildspace | https://buildspace-faucet.vercel.app/ | 0,025 | 1d |
| Ethily | https://ethily.io/rinkeby-faucet/ | 0,2 | 1s |
| Rinkeby Oficial | https://faucet.rinkeby.io/ | 3 / 7,5 / 18,75 | 8h / 1d / 3d |
| Chainlink | https://faucets.chain.link/rinkeby | 0,1 | Nenhum |

Para o MyCrypto, você precisará conectar sua carteira, criar uma conta e clicar no mesmo link novamente para solicitar fundos.

🙃 Está com problemas para obter ETH na Testnet?
-----------------------------------

Se os links acima não funcionarem, entre no [Discord da web3dev](https://discord.web3dev.com.br/) e use o comando `/faucet` no canal #faucet-request e que o bot enviará alguns para você! Se você quiser mais, envie seu endereço de carteira pública e solte um gif engraçado. Ou eu ou alguém do projeto enviará ETH falso assim que puder. Quanto mais engraçado o gif, mais rápido você receberá uma ETH falso LOL.

📈 Faça o deploy na rede de teste Rinkeby.
----------------------------------

Precisaremos alterar nosso arquivo `hardhat.config.js`. Você pode encontrá-lo no diretório raiz do seu projeto de contrato inteligente.

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

🚨 **Atenção:** NÃO FAÇA COMMIT DESTE ARQUIVO NO GITHUB. ELE POSSUI A SUA CHAVE PRIVADA. VOCÊ VAI SER HACKEADO + ROUBADO SE ESSA CHAVE VAZAR. ESTA CHAVE PRIVADA É A MESMA DA MAINNET. NÃO USE UMA 

Falaremos sobre variáveis `.env` mais tarde e como manter essas coisas em segredo.

Você pode pegar a URL da API no painel do Alchemy e colá-lo. Em seguida, você precisará da sua chave **privada** rinkeby (não sua chave pública!), que você pode pegar da Metamask e colá-la lá também.

ℹ️ **Nota:** O acesso à sua chave privada pode ser feito abrindo a MetaMask, alterando a rede para "Rinkeby Test Network" e depois clicando nos três pontos e selecionando "Account Details" > "Export Private Key"

Por que você precisa usar sua chave privada? Porque para realizar uma transação como o deploy de um contrato, você precisa "fazer login" na blockchain. E, seu nome de usuário é seu endereço público e sua senha é sua chave privada. É como fazer login na AWS ou no GCP para fazer o deploy.

Uma vez que você tenha sua configuração, estamos prontos para realizar o deploy com o script que escrevemos anteriormente.

Execute este comando a partir do diretório raiz do `meu-portal-tchauzinho`. Observe que tudo o que fazemos é alterá-lo de `localhost` para `rinkeby`.

```bash
npx hardhat run scripts/deploy.js --network rinkeby
```

❤️ Implantado!
-------------

Aqui está saída da execução:

```bash
Deploying contracts with the account: 0xF79A3bb8d5b93686c4068E2A97eAeC5fE4843E7D
Account balance: 3198297774605223721
WavePortal address: 0xd5f08a0ae197482FA808cE84E00E97d940dBD26E
```

Copie esse endereço do contrato implantado na última linha e salve-o em algum lugar. Não o perca! Você precisará dele para o frontend mais tarde :). O seu será diferente do meu.

**Você acabou de fazer o deploy do seu contrato. UAAAAAAAAU!** 🤩

Você pode pegar esse endereço e [colá-lo no Etherscan](https://rinkeby.etherscan.io/). Etherscan é um lugar que apenas nos mostra o estado da blockchain e nos ajuda a ver onde está nossa transação. Você deve ver sua transação aqui. Pode ser que demore um minuto para aparecer!

Por exemplo, [aqui está a minha](https://rinkeby.etherscan.io/address/0x56A61F82549fD077E4B9F74C6Ae6a75209F43A8b)!

🚨 Antes de clicar em "Próxima lição"
----------------------------------

**VOCÊ FEZ MUITO.** 👏🏼👏🏼👏🏼

Você deve **twittar** que acabou de escrever e implantar seu primeiro contrato inteligente e marcar @web3dev_. Se desejar, inclua uma captura da página do Etherscan que mostre que seu contrato está na blockchain!

É um grande negócio você ter chegado até aqui. Você criou e implantou algo na blockchain real. **Puta que la merda. Estamos muito orgulhosos de você.** 😃

Você agora é alguém que está realmente "fazendo" o que quase todo mundo está apenas "falando".

Você está um passo mais perto de dominar as artes da web3.

CONTINUE :)

--

*Reconheça as pessoas que já twittaram sobre nós, vocês são lendas <3.*

![](https://i.imgur.com/qXzAAY2.png)

![](https://i.imgur.com/9OWqnaE.png)
