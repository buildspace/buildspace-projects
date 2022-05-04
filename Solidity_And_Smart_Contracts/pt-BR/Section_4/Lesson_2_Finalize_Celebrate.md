🎨 Finalize sua interface de usuário e a personalize.
---------------------------------------

Você tem todas as funcionalidades principais! Agora, é hora de realmente tornar isso seu, se ainda não o fez. Altere o CSS, o texto, adicione alguns vídeos engraçados do YouTube, adicione sua própria biografia, seja o que for. Faça as coisas parecerem legais :).

** Gaste uns 30 minutos nisso se quiser!! Eu recomendo!**

Aliás, enquanto estamos testando -- você pode querer mudar o tempo de espera do seu contrato para 30 segundos em vez de 15 minutos assim:

```solidity
require(lastWavedAt[msg.sender] + 30 seconds < block.timestamp, "Deve aguardar 30 segundos antes de mandar um tchauzinho novamente.");
```

Por quê? Bem, pode ser irritante só conseguir mandar um tchauzinho a cada 15 minutos enquanto você está testando!

Então, eu mudei o meu para 30 segundos!

Ao implantar seu contrato **final**, você pode definir o que quiser!

⛽️ Definindo um limite de gas
--------------------

Agora, quando você tenta "mandar um tchauzinho", pode perceber que às vezes recebe um erro que se parece com "out of gas". Por quê?

Bem, basicamente a Metamask tentará estimar quanto gas a transação usará. Mas, às vezes calcula errado! Nesse caso, fica mais difícil pelo fato de termos alguma aleatoriedade envolvida. Portanto, se o contrato enviar um prêmio, o waver precisará pagar mais gas, pois estamos executando mais código.

Estimar o gas é um problema difícil e uma solução fácil para ele (para que nossos usuários não fiquem bravos quando uma transação falha) é definir um limite.

No App.js, alterei a linha que envia o tchauzinho para

```solidity
wavePortalContract.wave(message, { gasLimit: 300000 })
```

O que isso faz delimitar uma quantidade definida de gas de 300.000. E, se eles não usarem tudo na transação, serão reembolsados automaticamente.

Portanto, se uma transação custar 250.000 gas, então *depois* que a transação for finalizada, os 50.000 gas restantes que o usuário não usou serão reembolsados :).

🔍 Validando a transação
---------------------------

Quando seu contrato foi implantado e você o está testando com sua interface do usuário e sua carteira, pode ser confuso no início determinar se a conta da sua carteira foi recompensada com sucesso com o prêmio. Sua conta terá usado uma certa quantidade de gás e potencialmente será recompensada com ETH. Então, como você pode validar se seu contrato está funcionando conforme o esperado?

Para validar, você pode abrir seu endereço de contrato no [Rinkeby Etherscan](https://rinkeby.etherscan.io/) e visualizar as transações que ocorreram. Você encontrará todo tipo de informação útil aqui, incluindo o método que foi chamado, que neste caso é `Wave`. Se você clicar em uma transação `Wave`, você notará que na propriedade `To`, ela identificará que o endereço do contrato foi chamado. Se o usuário ganhou um prêmio, você notará nesse campo que o contrato transferiu 0.0001 ETH do endereço do contrato para o endereço da sua conta.

Observe que o `Value` da transação ainda é 0 ETH, pois o usuário nunca pagou nada para iniciar o tchauzinho. A transferência interna de ETH por um contrato inteligente é chamada de "transação interna".

🎤 Eventos
---------

Lembre-se de como usamos essa linha mágica abaixo em nosso contrato inteligente? Pedimos para você buscar no Google como os eventos no Solidity funcionam. Por favor, faça isso agora, se você ainda não fez!

```solidity
emit NewWave(msg.sender, block.timestamp, _message);
```

Em um nível básico, os eventos são mensagens que nossos contratos inteligentes lançam que podemos capturar em nosso cliente em tempo real.

Vamos dizer que estou relaxando no seu site e acabei de abri-lo. Enquanto estou fazendo isso, seu outro amigo Jeremy acena para você. No momento, a única maneira de ver o tchauzinho de Jeremy é atualizando minha página. Isso parece ruim. Não seria legal se eu pudesse saber que aquele contrato foi atualizado e ter minha UI magicamente atualizada?

Mesmo agora, é meio chato quando nós mesmos enviamos uma mensagem, e depois temos que esperar para que ela seja minerada e depois atualizar a página para ver toda a lista atualizada de mensagens, certo? Vamos corrigir isso.

Confira meu código aqui onde atualizei `getAllWaves` em `App.js.`

```javascript
const getAllWaves = async () => {
  const { ethereum } = window;

  try {
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      const waves = await wavePortalContract.getAllWaves();

      const wavesCleaned = waves.map(wave => {
        return {
          address: wave.waver,
          timestamp: new Date(wave.timestamp * 1000),
          message: wave.message,
        };
      });

      setAllWaves(wavesCleaned);
    } else {
      console.log("Objeto Ethereum inexistente!");
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * Escuta por eventos emitidos!
 */
useEffect(() => {
  let wavePortalContract;

  const onNewWave = (from, timestamp, message) => {
    console.log("NewWave", from, timestamp, message);
    setAllWaves(prevState => [
      ...prevState,
      {
        address: from,
        timestamp: new Date(timestamp * 1000),
        message: message,
      },
    ]);
  };

  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
    wavePortalContract.on("NewWave", onNewWave);
  }

  return () => {
    if (wavePortalContract) {
      wavePortalContract.off("NewWave", onNewWave);
    }
  };
}, []);
```

Na parte inferior, você verá a parte mágica do código que adicionei :). Aqui, posso realmente "ouvir" quando meu contrato lança o evento `NewWave`. Como um webhook :). Muito massa, certo?

Eu também posso acessar esses dados nesse evento como `message` e `from`. Aqui, eu faço um `setAllWaves` quando recebo este evento, o que significa que a mensagem do usuário será automaticamente anexada ao meu array `allWaves` quando recebermos o evento e nossa interface do usuário será atualizada!

Isso é superpoderoso. Ele nos permite criar aplicativos web que são atualizados em tempo real :). Pense se você estivesse fazendo algo como um Uber ou Twitter na blockchain, aplicativos web que atualizam em tempo real se tornam mega importantes.

Eu quero que você brinque com isso e construa o que quiser :).


🙉 Uma nota no github
----------------

**Se estiver fazendo upload para o Github, não faça upload do arquivo de configuração do hardhat com sua chave privada para o seu repositório. Você será roubado.**

Eu uso dotenv para isso.

```bash
npm install --save dotenv
```

Seu arquivo hardhat.config.js seria algo como:

```javascript
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
  solidity: "0.8.0",
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

```
STAGING_ALCHEMY_KEY=BLAHBLAH
PROD_ALCHEMY_KEY=BLAHBLAH
PRIVATE_KEY=BLAHBLAH
```

Certifique-se de ter o .env em seu .gitignore.

🎉 É isto!
----------------

Você já fez isso. Você implantou um contrato inteligente e escreveu um aplicativo Web que fala com ele. Essas são duas habilidades que vão mudar ainda mais o mundo à medida que avançamos para uma realidade em que os aplicativos web descentralizados se tornam mais comuns.

Espero que esta tenha sido uma introdução divertida à web3 e espero que você continue sua jornada.

Manterei todos informados sobre novos projetos no Discord :).

🤟 Sua NFT!
-----------

Enviaremos sua NFT por airdrop dentro de uma hora e enviaremos um e-mail assim que ela estiver em sua carteira. Está rodando em um cron job! Se você não receber o e-mail em 24 horas, por favor, envie-nos uma mensagem em #feedback e marque @ **alec#8853**.


🚨 Antes de sair...
-------------------------
Acesse #showcase no Discord e nos mostre seu produto final com o qual podemos mexer :).

Além disso, twitte seu projeto final e mostre ao mundo sua criação épica! O que você fez não foi nada fácil. Talvez até faça um pequeno vídeo mostrando seu projeto e o adicione ao tweet. Faça seu tweet ficar bonito e mostre :).

E se você quiser, marque @_buildspace :). Vamos dar RT. Além disso, nos dá muita motivação sempre que vemos as pessoas enviarem seus projetos.

Por fim, o que também seria incrível é se você nos dissesse em #feedback como gostou deste projeto e da estrutura do projeto. O que você mais gostou no buildspace? O que gostaria que mudássemos para projetos futuros? Seu feedback seria incrível!!


Vejo você por aí!!!


🎁 Encerramento
----------

*VOCÊ CONSEGUIU.* Aplausos para todos 👏! Quer ver todo o código que escrevemos para esta seção? Clique [neste link](https://gist.github.com/adilanchian/93fbd2e06b3b5d3acb99b5723cebd925) para ver tudo!
