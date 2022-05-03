📦 Armazenando mensagens em arrays usando structs
--------------------------------------------

Então, agora temos um aplicativo web completo que pode conversar com a blockchain!

Agora, se você se lembra, queremos que nosso aplicativo final seja um lugar onde as pessoas possam vir acenar para nós e nos enviar uma mensagem. Também queremos mostrar todas os tchauzinhos/mensagens anteriores que recebemos. É isso que faremos nesta aula!

Então, no final das aulas, queremos:

1\. Permitir que os usuários enviem uma mensagem junto com o tchauzinho.

2\. Ter esses dados salvos de alguma forma na blockchain.

3\. Mostrar esses dados em nosso site para que qualquer pessoa possa ver todas as pessoas que acenaram para nós e suas mensagens.

Confira meu código de contrato inteligente atualizado. Eu adicionei muitos comentários aqui para ajudá-lo a ver o que mudou :).


```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;

    /*
     * Um pouco de mágica, use o Google para entender o que são eventos em Solidity!
     */
    event NewWave(address indexed from, uint256 timestamp, string message);

    /*
     * Crio um struct Wave.
     * Um struct é basicamente um tipo de dados customizado onde nós podemos customizar o que queremos armazenar dentro dele
     */
    struct Wave {
        address waver; // Endereço do usuário que deu tchauzinho
        string message; // Mensagem que o usuário envio
        uint256 timestamp; // Data/hora de quando o usuário tchauzinhou.
    }

    /*
     * Declara a variável waves que permite armazenar um array de structs.
     * Isto que me permite armazenar todos os tchauzinhos que qualquer um tenha me enviado!
     */
    Wave[] waves;

    constructor() {
        console.log("EU SOU UM CONTRATO INTELIGENTE. POG.");
    }

    /*
     * Você notará que eu mudei um pouco a função de tchauzinho e agora requer uma string chamada _message. Esta é a mensagem que o nosso usuário enviou pelo frontend!
     */
    function wave(string memory _message) public {
        totalWaves += 1;
        console.log("%s tchauzinhou com a mensagem %s", msg.sender, _message);

        /*
         * Aqui é onde eu efetivamenet armazeno o tchauzinho no array.
         */
        waves.push(Wave(msg.sender, _message, block.timestamp));

        /*
         * Eu adicionei algo novo aqui. Use o Google para tentar entender o que é e depois me conte o que aprendeu em #general-chill-chat
         */
        emit NewWave(msg.sender, block.timestamp, _message);
    }

    /*
     * Adicionei uma função getAllWaves que retornará os tchauzinhos.
     * Isso permitirá recuperar os tchauzinhos a partir do nosso site!
     */
    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        // Opcional: Adicione esta linha se você quer ver o contrato imprimir o valor!
        // Também imprimirá em run.js.
        console.log("Temos %d tchauzinhos no total!", totalWaves);
        return totalWaves;
    }
}
```

🧐 Teste
----------

Sempre que alteramos nosso contrato, queremos alterar o `run.js` para testar a nova funcionalidade que adicionamos. É assim que sabemos que está funcionando como queremos! Veja como está o meu agora.

Aqui está meu `run.js` atualizado.


```javascript
const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();
  console.log("Endereço do contrato:", waveContract.address);

  let waveCount;
  waveCount = await waveContract.getTotalWaves();
  console.log(waveCount.toNumber());

  /**
   * Deixe-me enviar alguns tchauzinhos!
   */
  let waveTxn = await waveContract.wave("Uma mensagem!");
  await waveTxn.wait(); // aguarda a transação ser minerada

  const [_, randomPerson] = await hre.ethers.getSigners();
  waveTxn = await waveContract.connect(randomPerson).wave("Outra mensagem!");
  await waveTxn.wait(); // aguarda a transação ser minerada

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

Aqui está o que eu recebo no meu terminal quando eu executo `npx hardhat run scripts/run.js`.

![](https://i.imgur.com/VfA0vuK.png)

Muito legal né :)?

O array parece um pouco assustador, mas podemos ver os dados ao lado das palavras `waver`, `message` e `timestamp`!! Ele armazena corretamente nossas mensagens `"Uma mensagem"` e `"Outra mensagem"` :).

Nota: "timestamp" é devolvido para nós como tipo "BigNumber". Vamos aprender a trabalhar com isso mais tarde, mas saiba que não há nada de errado aqui!

Parece que as coisas estão funcionando, vamos para o nosso **frontend** para que possamos ver todos os nossos tchauzinhos em nosso site!

✈️ Re-deploy
------------

Então, agora que atualizamos nosso contrato, precisamos fazer algumas coisas:

1\. Precisamos deployar novamente.

2\. Precisamos atualizar o endereço do contrato em nosso front-end.

3\. Precisamos atualizar o arquivo ABI em nosso frontend.

**As pessoas constantemente se esquecem de fazer esses 3 passos quando mudam de contrato. Não esqueça rs.**

Por que precisamos fazer tudo isso? Bem, é porque os contratos inteligentes são **imutáveis.** Eles não podem mudar. Eles são permanentes. Isso significa que a alteração de um contrato requer um deploy completo. Isso também **redefinirá** todas as variáveis, pois seria tratado como um novo contrato. **Isso significa que perderíamos todos os nossos dados de tchauzinhos se quiséssemos atualizar o código do contrato.**

**Bônus**: no canal #chat-geral, alguém pode me sugerir soluções? Onde mais poderíamos armazenar nossos dados de tchauzinhos de forma a permitir a atualização do código do contrato, mas mantendo os dados originais por perto? Existem algumas soluções aqui, deixe-me saber o que você encontra!

Então o que você precisa fazer agora é:

1\. Faça do redeploy usando `npx hardhat run scripts/deploy.js --network rinkeby`

2\. Altere `contractAddress` em `App.js` para ser o novo endereço do contrato obtido no terminal na etapa acima, assim como fizemos antes da primeira vez que implantamos.

3\. Obtenha o arquivo ABI atualizado de `artifacts` tal qual fizemos antes e copie e cole no Replit como fizemos antes. Se você esqueceu como fazer isso, certifique-se de rever a lição anterior e/ou assista o vídeo que fizemos sobre os arquivos ABI abaixo:
[Tear](https://www.loom.com/share/2a5794fca9064a059dca1989cdfa2c37).

**Novamente -- você precisa fazer isso toda vez que alterar o código de seus contratos.**

🔌 Conectando tudo ao nosso cliente
----------------------------------

Então, aqui está a nova função que adicionei ao `App.js`.

So, here's the new function I added to `App.js`.

```javascript
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const contractAddress = "0xd289A2e424dE94E9dcfFE03Ae050961Df70a4474";
  const contractABI = abi.abi;

    /*
   * Método para consultar todos os tchauzinhos do contrato
   */
  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Chama o método getAllWaves do seu contrato inteligente
         */
        const waves = await wavePortalContract.getAllWaves();


        /*
         * Apenas precisamos do endereço, data/horário, e mensagem na nossa tela, então vamos selecioná-los
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        /*
         * Armazenando os dados
         */
        setAllWaves(wavesCleaned);
      } else {
        console.log("Objeto Ethereum não existe!")
      }
    } catch (error) {
      console.log(error);
    }
  }
  ```

Bastante simples e muito semelhante às coisas em que trabalhamos anteriormente, como estamos nos conectando ao provedor, obtendo o signatário e nos conectando ao contrato! Eu faço um pouco de mágica aqui percorrendo todas os nossos tchauzinhos e salvando-os em uma matriz que podemos usar mais tarde. Sinta-se à vontade para realizar console.log na variável `waves` para ver o que você obtém se estiver tendo problemas.

Mas onde chamamos essa nova função `getAllWaves()`? Bem -- queremos chamá-la quando tivermos certeza de que o usuário tem uma carteira conectada com uma conta autorizada porque precisamos de uma conta autorizada para chamá-la! Dica: você tem que chamar esta função em algum lugar em `checkIfWalletIsConnected()`. Vou deixar para você descobrir. Lembre-se, queremos chamá-la quando tivermos certeza de que temos uma conta conectada + autorizada!

A última coisa que fiz foi atualizar nosso código HTML para renderizar os dados para nós vermos!

```javascript
return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Olá Pessoal!
        </div>

        <div className="bio">
        Eu sou o danicuki e já trabalhei com música, sabia? Legal, né? Conecte sua carteira  Ethereum wallet e me manda um tchauzinho!
        </div>

        <button className="waveButton" onClick={wave}>
          Mandar Tchauzinho 🌟
        </button>
        {/*
        * Se não existir currentAccount, apresente este botão
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Conectar carteira
          </button>
        )}

        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Endereço: {wave.address}</div>
              <div>Data/Horário: {wave.timestamp.toString()}</div>
              <div>Mensagem: {wave.message}</div>
            </div>)
        })}
      </div>
      
    </div>
  );
  ```

Basicamente, eu apenas passo pelo `allWaves` e crio novas divs para cada tchauzinho e mostro esses dados em tela.

🙀 Ah!! `wave()` está quebrado!
---------------------------

Então, em `App.js`, nossa função `wave()` não funciona mais! Se tentarmos acenar, ele nos dará um erro porque está esperando que uma mensagem seja enviada por ele! Por enquanto, você pode corrigir isso codificando uma mensagem como:

```
const waveTxn = await wavePortalContract.wave("esta é uma mensagem")
```

Vou deixar isso para você: descubra como adicionar uma caixa de texto que permite aos usuários adicionar sua própria mensagem personalizada que eles podem enviar para a função wave :).

O objetivo? Você quer dar aos seus usuários a capacidade de enviar uma mensagem personalizada usando uma caixa de texto que eles podem digitar! Ou talvez você queira que eles enviem um link para um meme? Ou um link do Spotify? Você decide!

👷‍♀️ Vá construir uma interface para o usuário!
--------------------

Vá fazer essa coisa parecer como você quer que fique! Eu não vou te ensinar muito disso aqui. Sinta-se à vontade para fazer perguntas na #seção-3-ajuda!