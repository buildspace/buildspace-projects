### ✅ Executando um teste no devnet

Na verdade, gosto de executar um `anchor test` neste ponto antes de começar a integrar meu aplicativo da web. Isso poderia nos salvar de alguns erros aleatórios e irritantes.

Como nossa configuração está definida como devnet, o Anchor realmente executará nossos testes diretamente no devnet, que é exatamente o que queremos. Dessa forma, podemos garantir que nossas funções reais estejam funcionando corretamente no devnet!

Vá em frente, execute-o usando:

```bash
anchor test
```

Desde que nada tenha travado e esteja mostrando algo como:

```bash
Deploy success
🚀 Iniciando testes...
📝 Sua assinatura de transação 41aW8pAtFLyxgg1S54EATUSKSXB9LKe1qSGgLvuy3Fh58vWgiHuXK8jsrtRy5Spm32xCytXoNyJTMKVpa4ZHcnEB
👀 GIF Count 0
👀 GIF Count 1
👀 GIF List [
  {
    gifLink: 'insert_a_giphy_link_here',
    userAddress: PublicKey {
      _bn: <BN: 368327095334a46e8bf98ccfd43f4662111b633d3989f6f9df869306bcc64458>
    }
  }
```

Então você está pronto para continuar.

O que é realmente interessante aqui é que se você for ao [Solana Explorer](https://explorer.solana.com/?cluster=devnet) e colar o ID do seu programa (assim como você fez antes), você verá algumas novas transações lá. Estes foram causados ​​pelo teste que você acabou de executar! Sinta-se à vontade para verificá-los.

Devo mencionar algo super importante aqui. Quando você executou o `anchor test` agora, ele irá reimplantar o programa e então executar todas as funções no script.

Você pode estar se perguntando: "Por que ele foi re-implantado? Por que não está apenas falando com o programa já implantado? Além disso, se nós o re-implantamos, ele não teria sido implantado em um id de programa completamente diferente?".

**Então — os programas Solana são [atualizáveis](https://docs.solana.com/cli/deploy-a-program#redeploy-a-program).** Isso significa que, quando reimplantarmos, estamos atualizando o mesmo ID de programa para apontar para a versão mais recente do programa que implantamos. E, o que é legal aqui é que as *contas* com as quais os programas se comunicam ficarão juntas – lembre-se, essas contas mantêm dados relacionados ao programa.

**Isso significa que podemos atualizar programas enquanto mantemos os dados separados**. Muito legal né :)?

*Observação: isso é **muito** diferente do Ethereum, onde você nunca pode alterar um contrato inteligente depois de implantado!*

### 🤟 Conectando nosso arquivo IDL ao aplicativo da web

Então, agora temos um programa Solana implantado. Vamos conectá-lo ao nosso aplicativo da web :).

A primeira coisa que precisamos é o arquivo `idl` que foi magicamente gerado pelo `anchor build` antes sem você saber. Você deve vê-lo em `target/idl/myepicproject.json`.

O arquivo `idl` é na verdade apenas um arquivo JSON que contém algumas informações sobre nosso programa Solana, como os nomes de nossas funções e os parâmetros que elas aceitam. Isso ajuda nosso aplicativo da web a realmente saber como interagir com nosso programa implantado.

Você também verá na parte inferior que tem o nosso ID do programa! É assim que nosso aplicativo da web saberá a qual programa realmente se conectar. Existem *milhões* de programas implantados no Solana e este endereço é como nosso aplicativo da web pode obter acesso rápido ao nosso programa especificamente.

![Untitled](https://i.imgur.com/bnorlgJ.png)

*Observação: se você não vir o arquivo idl ou não vir um parâmetro "endereço" próximo à parte inferior, algo deu errado! Comece novamente na seção "Implantar programa no devnet" do projeto.*

Vá em frente e copie todo o conteúdo em `target/idl/myepicproject.json`.

Dirija-se ao seu aplicativo da web.

No diretório `src` do seu aplicativo React **crie um arquivo vazio** chamado `idl.json`. Ele deve estar no mesmo diretório que `App.js`. Então, para mim, eu tenho o arquivo em `app/src/idl.json`. Depois de criar o arquivo, cole o conteúdo de `target/idl/myepicproject.json` em seu `app/src/idl.json` recém-criado.

Por fim, em `App.js`, vá em frente e solte isso como uma importação:

```javascript
import idl from './idl.json';
```

Ótimo!! 

### 🌐 Altere a rede que o Phantom se conecta

Neste momento, o Phantom provavelmente está conectado à Solana Mainnet. Precisamos que se conecte à Solana Devnet. Você pode alterar isso acessando as configurações (clique na pequena engrenagem no canto inferior direito), clique em "Alterar rede" e clique em "Devnet". É isso!

![Untitled](https://i.imgur.com/JWHwPJX.png)

### 👻 Adicionar fundos à carteira Phantom

Também precisamos adicionar fundos à nossa carteira Phantom com algum SOL falso. **Ler** **dados** em contas no Solana é gratuito. Mas fazer coisas como criar contas e adicionar dados a contas custa SOL.

Você precisará do endereço público associado à sua carteira Phantom, que você pode pegar na parte superior clicando em seu endereço:

![Screen Shot 2021-11-03 at 12.31.15 PM.png](https://i.imgur.com/3I2Wjv3.png)

Agora, vá em frente e execute isso no seu terminal.

```bash
solana airdrop 2 INSIRA_SEU_ENDERECO_PHANTOM_AQUI  --url devnet
```

Agora, quando você voltar para sua carteira Phantom, deverá ter 2 SOL associados à sua carteira devnet. Legal :).

### 🍔 Configure um `provedor` Solana em nosso aplicativo da web

Em seu aplicativo Web, precisaremos instalar dois pacotes. Você deve se lembrar de ter instalado eles para o seu projeto Anchor, também os usaremos em nosso aplicativo da web :).

```bash
npm install @project-serum/anchor @solana/web3.js
```

*Nota: Se você estiver no Replit, você já deve tê-los pré-instalados. Se não tiver e começar a receber erros mais tarde, poderá instalar os pacotes clicando em "Shell" e executando comandos como em um terminal normal. Eles também têm um instalador sofisticado de "Pacotes" na barra lateral esquerda.*

Antes de podermos interagir com os pacotes que instalamos anteriormente, precisamos importá-los para nosso aplicativo da web! Adicione as seguintes linhas de código na parte superior do App.js:

```javascript
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';
```

*Nota: (somente para usuários Replit):*
*1. Se você receber um erro `global is not defined`, altere o vite.config.js para:*
```javascript
import reactRefresh from '@vitejs/plugin-react-refresh';
import { defineConfig } from "vite";
/**
 * https://vitejs.dev/config/
 * @type { import('vite').UserConfig }
 */
export default defineConfig({
  define: {
    global: {},
    process: {
      'env': {}
    } 
  },
  plugins: [reactRefresh()],
  server: {
    host: '0.0.0.0',
    hmr: {
      port: 443,
    }
  }
})
```

*2. Se você receber um erro relacionado ao `buffer`, adicione-o ao `App.jsx`:*
```javascript
import { Buffer } from 'buffer';
window.Buffer = Buffer;
```

Vamos criar uma função chamada `getProvider`. Adicione isso logo abaixo de `onInputChange` . Aqui está o código abaixo:

```javascript
const getProvider = () => {
  const connection = new Connection(network, opts.preflightCommitment);
  const provider = new Provider(
    connection, window.solana, opts.preflightCommitment,
  );
  return provider;
}
```

Isso, é claro, lançará um monte de erros, já que não temos nenhuma das variáveis lol. Mas, basicamente, somos nós criando um `provedor` que é uma **conexão autenticada com Solana**. Observe como `window.solana` é necessário aqui!

Por quê? Porque para fazer um `provedor` precisamos de uma carteira conectada. **Você já fez isso antes** ao clicar em "Conectar" no Phantom, o que deu permissão para dar acesso ao nosso aplicativo da web à nossa carteira.

![https://i.imgur.com/vOUldRN.png](https://i.imgur.com/vOUldRN.png)

**Você não pode se comunicar com Solana a menos que tenha uma carteira conectada. Não podemos nem mesmo recuperar dados de Solana a menos que tenhamos uma carteira conectada!**

Esta é uma grande razão pela qual o Phantom é útil. Ele oferece aos nossos usuários uma maneira simples e segura de conectar suas carteiras ao nosso site para que possamos criar um `provedor` que nos permita conversar com programas em Solana :).

Vamos criar algumas variáveis que estão faltando. Também precisaremos importar algumas coisas.

Vá em frente e adicione este código em:

```javascript
import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import { Connection, PublicKey, clusterApiUrl} from '@solana/web3.js';
import {
  Program, Provider, web3
} from '@project-serum/anchor';

import idl from './idl.json';

// SystemProgram is a reference to the Solana runtime!
const { SystemProgram, Keypair } = web3;

// Create a keypair for the account that will hold the GIF data.
let baseAccount = Keypair.generate();

// Get our program's id from the IDL file.
const programID = new PublicKey(idl.metadata.address);

// Set our network to devnet.
const network = clusterApiUrl('devnet');

// Controls how we want to acknowledge when a transaction is "done".
const opts = {
  preflightCommitment: "processed"
}

// All your other Twitter and GIF constants you had.

const App = () => {
	// All your other code.
}
```

Tudo bem direto e as coisas farão mais sentido quando começarmos a usar essas variáveis ​​mais tarde.

`SystemProgram` é uma referência ao [programa principal](https://docs.solana.com/developing/runtime-facilities/programs#system-program) que executa o Solana sobre o qual já falamos. `Keypair.generate()` nos dá alguns parâmetros que precisamos para criar a conta `BaseAccount` que conterá os dados GIF para nosso programa.

Então, usamos `idl.metadata.address` para obter o id do nosso programa e então especificamos que queremos ter certeza de nos conectar ao devnet fazendo `clusterApiUrl('devnet')`.

Essa coisa de `preflightCommitment: "processado"` é interessante. Você pode ler um pouco [aqui](https://solana-labs.github.io/solana-web3.js/modules.html#Commitment). Basicamente, podemos escolher *quando* receber uma confirmação de quando nossa transação foi bem-sucedida. Como o blockchain é totalmente descentralizado, podemos escolher quanto tempo queremos esperar por uma transação. Queremos esperar que apenas um nó reconheça nossa transação? Queremos esperar que toda a cadeia Solana reconheça nossa transação?

Nesse caso, simplesmente esperamos que nossa transação seja confirmada pelo *nó ao qual estamos conectados*. Isso geralmente é bom - mas se você quiser ter certeza absoluta, pode usar algo como `"finalized"`. Por enquanto, vamos continuar com `"processado"`.

### 🏈 Recupere GIFs da conta do nosso programa

Na verdade, é super simples chamar nosso programa agora que temos tudo configurado. É um simples `fetch` para obter a conta - semelhante a como você chamaria uma API. Lembra desse pedaço de código?

```javascript
useEffect(() => {
  if (walletAddress) {
    console.log('Fetching GIF list...');

    // Call Solana Program

    // Set state
    setGifList(TEST_GIFS);
  }
}, [walletAddress]);
```

Ainda estamos usando `TEST_GIFS`! Muito ruim. Vamos chamar nosso programa. Deve nos devolver uma lista vazia de GIFs, certo? Já que nunca adicionamos nenhum GIF ainda.

Vamos mudar isso para o seguinte:

```javascript
const getGifList = async() => {
  try {
    const provider = getProvider();
    const program = new Program(idl, programID, provider);
    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    
    console.log("Got the account", account)
    setGifList(account.gifList)

  } catch (error) {
    console.log("Error in getGifList: ", error)
    setGifList(null);
  }
}

useEffect(() => {
  if (walletAddress) {
    console.log('Fetching GIF list...');
    getGifList()
  }
}, [walletAddress]);
```

### 🤬 Hein? Um erro!?

Ao atualizar sua página, você receberá um erro semelhante a este:

![Sem título](https://i.imgur.com/wUArqKJ.png)

Hmmmm — "A conta não existe".

Esse erro me confundiu muito quando o vi pela primeira vez. Originalmente, pensei que significava que minha "conta" de carteira real não existia.

Mas, o que esse erro realmente significa é que a `BaseAccount` do nosso programa não existe.

O que faz sentido, ainda não inicializamos a conta via `startStuffOff`!! Nossa conta não é criada magicamente. Vamos fazer isso.

### 🔥 Chame `startStuffOff` para inicializar o programa

Vamos construir uma função simples para chamar `startStuffOff`. Você vai querer adicionar isso na sua função `getProvider`!

Isso se parece exatamente com o que funcionava no script de teste!

```javascript
const createGifAccount = async () => {
  try {
    const provider = getProvider();
    const program = new Program(idl, programID, provider);
    console.log("ping")
    await program.rpc.startStuffOff({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount]
    });
    console.log("Created a new BaseAccount w/ address:", baseAccount.publicKey.toString())
    await getGifList();

  } catch(error) {
    console.log("Error creating BaseAccount account:", error)
  }
}
```

Então, só precisamos alterar o `renderConnectedContainer` para considerar dois casos.

1. O usuário conectou sua carteira, mas a conta `BaseAccount` **não** foi criada. Dê a eles um botão para criar uma conta.
2. O usuário conectou sua carteira, e `BaseAccount` existe, então, renderize `gifList` e deixe as pessoas enviarem um GIF.

```jsx
const renderConnectedContainer = () => {
// If we hit this, it means the program account hasn't been initialized.
  if (gifList === null) {
    return (
      <div className="connected-container">
        <button className="cta-button submit-gif-button" onClick={createGifAccount}>
          Fazer inicialização única para conta do programa GIF
        </button>
      </div>
    )
  } 
  // Otherwise, we're good! Account exists. User can submit GIFs.
  else {
    return(
      <div className="connected-container">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            sendGif();
          }}
        >
          <input
            type="text"
            placeholder="Enter gif link!"
            value={inputValue}
            onChange={onInputChange}
          />
          <button type="submit" className="cta-button submit-gif-button">
            Submit
          </button>
        </form>
        <div className="gif-grid">
					{/* We use index as the key instead, also, the src is now item.gifLink */}
          {gifList.map((item, index) => (
            <div className="gif-item" key={index}>
              <img src={item.gifLink} />
            </div>
          ))}
        </div>
      </div>
    )
  }
}
```

Bem direto! Fiz algumas mudanças no `gifList.map`. Cuidado com elas!

### 🥳 Vamos testar!

Vamos em frente e testar! Se você atualizar a página e tiver sua carteira conectada, verá "Fazer inicialização única para conta do programa GIF". Quando você clicar aqui, você verá o Phantom solicitar que você pague pela transação com algum SOL !!

Se tudo correu bem, você verá isso no console:

![Sem título](https://i.imgur.com/0CdFajf.png)

Então, aqui nós criamos uma conta *e então* recuperamos a conta!! E, `gifList` está vazio, pois ainda não adicionamos nenhum GIF a esta conta!!! **NELEEEEE.**

**Então, agora você notará que toda vez que atualizamos a página - ela nos pede para criar uma conta novamente. Vamos corrigir isso mais tarde, mas por que isso acontece? Fiz um pequeno vídeo sobre isso abaixo**

[Tear](https://www.loom.com/share/fc1cf249073e45d6bf31d985b4b11580)


### 🚨 Relatório de progresso

*Faça isso senão o Dani vai ficar triste :(*

Poste uma captura de tela em `#progress` com o material "Peguei a conta" no seu console :).

