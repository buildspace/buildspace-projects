Ok - estamos finalmente no ponto em que podemos salvar alguns GIFs. É tão fácil de fazer. Vamos apenas mudar um pouco nossa função `sendGif`, então agora chamamos `addGif` e, em seguida, chamamos `getGifList` para que nosso aplicativo da Web seja atualizado para mostrar nosso último GIF enviado!

```javascript
const sendGif = async () => {
  if (inputValue.length === 0) {
    console.log("No gif link given!")
    return
  }
  setInputValue('');
  console.log('Gif link:', inputValue);
  try {
    const provider = getProvider();
    const program = new Program(idl, programID, provider);

    await program.rpc.addGif(inputValue, {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      },
    });
    console.log("GIF successfully sent to program", inputValue)

    await getGifList();
  } catch (error) {
    console.log("Error sending GIF:", error)
  }
};
```

Agora, você poderá enviar um link, aprovar a transação via Phantom e seu aplicativo da web deverá mostrar o GIF que você acabou de enviar :).

### 🙈 Resolva o problema da conta não persistir

Então, já passamos por esse problema em que nossa conta está sendo redefinida toda vez que atualizamos a página. Vamos corrigi-lo.

O problema central é esta linha:

```javascript
let baseAccount = Keypair.generate();
```

O que está acontecendo aqui é que estamos gerando uma nova conta para o nosso programa conversar  **todas as vezes.** Então, a correção aqui é que só precisamos ter um par de chaves que todos os nossos usuários compartilhem.

No diretório `src`, vá em frente e crie um arquivo chamado `createKeyPair.js`. Lá, cole isso em:

```javascript
// Shoutout to Nader Dabit for helping w/ this!
// https://twitter.com/dabit3

const fs = require('fs')
const anchor = require("@project-serum/anchor")

const account = anchor.web3.Keypair.generate()

fs.writeFileSync('./keypair.json', JSON.stringify(account))
```

Tudo o que esse script faz é gravar um par de chaves diretamente em nosso sistema de arquivos, dessa forma, sempre que as pessoas acessarem nosso aplicativo da Web, todas carregarão o mesmo par de chaves.

Quando estiver pronto para executar isso, vá em frente e faça:

```bash
cd src
node createKeyPair.js
```

Certifique-se de rodar um `cd` no diretório que `createKeyPair.js` esteja localizado.

Isso gerará um arquivo chamado `keypair.json` com nosso par de chaves sofisticado :).

**Observação para usuários do Replit**: você pode executar comandos shell diretamente no Replit. Clique na palavra "Shell", depois faça `cd src` e depois `node createKeyPair.js` e funcionará como se você estivesse usando um terminal local!

Agora que temos este arquivo, só precisamos mudar um pouco o `App.js`. Na parte superior, você precisará importar o par de chaves assim:

```javascript
import kp from './keypair.json'
```

Em seguida, exclua `let baseAccount = Keypair.generate();`. Em vez disso, vamos substituí-lo por isso:

```javascript
const arr = Object.values(kp._keypair.secretKey)
const secret = new Uint8Array(arr)
const baseAccount = web3.Keypair.fromSecretKey(secret)
```

É isso. Agora, temos um par de chaves permanente! Se você atualizar a página, verá que depois de inicializar a conta - ela permanece mesmo após a atualização :)!!! Sinta-se à vontade para enviar alguns GIFs daqui.

Você também pode executar `createKeyPair.js` quantas vezes quiser e isso permitirá que você crie uma nova `BaseAccount`. No entanto, isso também significa que a nova conta estará completamente vazia e sem dados. É importante entender que você **não está excluindo contas se executar** `createKeyPair.js` novamente. Você está simplesmente criando uma nova conta para o seu programa apontar.

### 🚨 Relatório de progresso

*Faça isso senão o Dani vai ficar triste :(*

Você tem envios de GIFs funcionando !! Poste uma captura de tela em `#progress` com seus GIFs sendo recuperados do seu programa Solana :).
