### 🤖 Vamos pegar o código inicial

Comece indo para este [link do GitHub](https://github.com/buildspace/nft-drop-starter-project), onde você encontra o código do repositório inicial. A partir daqui, você deve pressionar o botão "Fork" no canto superior direito da página.

![https://camo.githubusercontent.com/9d6a1aa7765bed6299de46f335c6d289c2675623b4613b4487bc5fbbbeb9b97d/68747470733a2f2f692e696d6775722e636f6d2f7032465479414d2e706e67](https://camo.githubusercontent.com/9d6a1aa7765bed6299de46f335c6d289c2675623b4613b4487bc5fbbbeb9b97d/68747470733a2f2f692e696d6775722e636f6d2f7032465479414d2e706e67)

Massa! Quando você faz o fork deste repositório, na verdade você está criando uma cópia idêntica dele que fica no seu perfil do Github. Então agora você tem sua própria versão deste código que você pode editar para o conteúdo de sua escolha :). Isso também será útil quando estivermos prontos para implantar nosso aplicativo no Vercel 🤘.

O passo final aqui é transferir o repositório do fork que você acabou de fazer para a sua máquina local. Clique no botão "Code" (Código) e copie esse link!

![https://camo.githubusercontent.com/d7f456460c7a6526e7908c0664b8694f0945fb07523573cfbe307dbf5ffad55a/68747470733a2f2f692e696d6775722e636f6d2f3451744138774f2e706e67](https://camo.githubusercontent.com/d7f456460c7a6526e7908c0664b8694f0945fb07523573cfbe307dbf5ffad55a/68747470733a2f2f692e696d6775722e636f6d2f3451744138774f2e706e67)

Finalmente, vá para o seu terminal, dê um `cd` para qualquer diretório em que seu projeto ficará e execute o comando:


```
git clone SEU_LINK_DO_FORK
```


Aí está :). Hora de codificar!


### 🔌 Criando um botão de conexão de carteira com a Phantom Wallet

Para este projeto, usaremos uma carteira chamada [Phantom](https://phantom.app/). Esta é uma das principais extensões de carteira para Solana.

Antes de mergulharmos em qualquer código - certifique-se de ter baixado a extensão e configurado uma carteira Solana! Atualmente, a Phantom Wallet suporta **Chrome**, **Brave**, **Firefox** e **Edge**. Mas, como nota: só testamos este código no Brave e no Chrome.


### 👻 Usando o objeto Solana

Para que nosso site converse com nosso programa Solana, precisamos de alguma forma conectar nossa carteira (que é a extensão Phantom Wallet) a ele.

Assim que conectarmos nossa carteira ao nosso site, este terá permissão para executar funções do nosso programa em nosso nome. Se nossos usuários não conectarem suas carteiras, eles não poderão se comunicar com a blockchain Solana.

**Lembre-se, é como se autenticar em um site.** Se você não estiver "conectado" ao GMail, não poderá usar o produto de e-mail deles!

Vá até seu código e acesse `App.js` em `src`. É aqui que estará o principal ponto de entrada do nosso aplicativo.

Se você tiver a extensão Phantom Wallet instalada, ela injetará automaticamente um objeto especial chamado `solana` em seu objeto `window` que possui algumas funções mágicas. Isso significa que antes de fazermos qualquer coisa, precisamos verificar se isso existe. Se não existir, vamos dizer ao nosso usuário para fazer o download:


```javascript
import React, { useEffect } from 'react';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';

// Constantes
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // Ações

  /* Declare sua função */
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana && solana.isPhantom) {
          console.log('Phantom wallet encontrada!');
      } else {
        alert('Objeto Solana não encontrado! Consiga uma Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };

  /* Quando nosso componente for montado pela primeira vez, 
  vamos verificar se temos uma Phantom Wallet  */

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">🍭 Candy Drop</p>
          <p className="sub-text">Máquina de NFTs com cunhagem justa</p>
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`Criado na @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
```


Excelente! Não é tão difícil, certo? Vamos detalhar isso um pouco mais:


```javascript
const checkIfWalletIsConnected = async () => {
  try {
    const { solana } = window;

    if (solana && solana.isPhantom) {
        console.log('Phantom wallet encontrada!');
    } else {
      alert('Objeto Solana não encontrado! Consiga uma Phantom Wallet 👻');
    }
  } catch (error) {
    console.error(error);
  }
};
```


Nossa função aqui está verificando o objeto `window` em nosso DOM para ver se a extensão Phantom Wallet injetou o objeto `solana`. Se tivermos mesmo um objeto `solana`, também podemos verificar se é uma Phantom Wallet.

Como testamos este projeto inteiramente com as Phantom Wallets, recomendamos manter essa configuração. No entanto, nada o impede de explorar ou apoiar outras carteiras 👀.


```javascript
useEffect(() => {
  const onLoad = async () => {
    await checkIfWalletIsConnected();
  };
  window.addEventListener('load', onLoad);
  return () => window.removeEventListener('load', onLoad);
}, []);
```


Finalmente, só precisamos executar isso aqui!

No React, o hook `useEffect` é chamado uma vez na montagem do componente quando esse segundo parâmetro (o `[]`) está vazio! Então, isso é perfeito para nós. Assim que alguém acessa nosso aplicativo, podemos verificar se ele possui a Phantom Wallet instalada ou não. Isso será **muito importante** em breve.

Atualmente, a equipe da Phantom Wallet sugere esperar que a janela termine completamente o carregamento antes de verificar o objeto `solana`. Uma vez que este evento é chamado, podemos garantir que este objeto esteja disponível se o usuário tiver a extensão Phantom Wallet instalada.


### 🔒 Acessando a conta do usuário

Então, quando você executar isso, você deverá ver a linha "_Phantom wallet encontrada!_" impressa no console do site quando for inspecioná-lo.

![https://camo.githubusercontent.com/140bada2787e267afe24c054f7a8100d07c8143ddc9f2beac616ba9df8f746e9/68747470733a2f2f692e696d6775722e636f6d2f75794763534a342e706e67](https://camo.githubusercontent.com/140bada2787e267afe24c054f7a8100d07c8143ddc9f2beac616ba9df8f746e9/68747470733a2f2f692e696d6775722e636f6d2f75794763534a342e706e67)


_Para obter instruções adicionais sobre como executar seu aplicativo, consulte o `README.md` na raiz do seu projeto._

**LEGAL**.

Em seguida, precisamos realmente verificar se estamos **autorizados** a acessar a carteira do usuário. Assim que tivermos acesso a isso, podemos começar a ter acesso às funções do nosso programa Solana 🤘.

Basicamente, a **Phantom Wallet não simplesmente fornece as informações da nossa carteira para todos os sites que visitamos**. Ela só as fornece a sites que autorizamos. Até agora, **não** demos acesso explícito à Phantom para compartilhar as informações de nossa carteira.

A primeira coisa que precisamos fazer é verificar se um usuário nos deu permissão para usar sua carteira em nosso site - isso é como verificar se nosso usuário está "conectado". Tudo o que precisamos fazer é adicionar mais uma linha à nossa função `checkIfWalletIsConnected`. Confira o código abaixo:


```javascript
const checkIfWalletIsConnected = async () => {
  try {
    const { solana } = window;

    if (solana && solana.isPhantom) {
        console.log('Phantom wallet encontrada!');

        /* O objeto solana nos dá uma função que nos permitirá 
        conectar diretamente com a carteira do usuário! */

        const response = await solana.connect({ onlyIfTrusted: true });
        console.log(
          'Conectado com a Chave Pública:',
          response.publicKey.toString()
        );
    } else {
      alert('Objeto Solana não encontrado! Consiga uma Phantom Wallet 👻');
    }
  } catch (error) {
    console.error(error);
  }
};
```


É tão simples quanto chamar `connect`, que informa à Phantom Wallet que nosso site NFT está autorizado a acessar informações sobre essa carteira! Alguns de vocês podem estar se perguntando o que é essa propriedade `onlyIfTrusted`.

Se um usuário já conectou a carteira ao seu aplicativo, essa propriedade puxará imediatamente seus dados sem avisá-lo com outro pop-up de conexão! Bem bacana, né? Curioso para saber mais - [dê uma olhada neste documento](https://docs.phantom.app/integrating/establishing-a-connection#eagerly-connecting) da Phantom!

E é isso!

_Neste ponto, você ainda deve estar vendo apenas o log "Phantom Wallet encontrada!"_ em seu console!

Não se preocupe se você estiver vendo o erro "User Rejected Request" (solicitação do usuário rejeitada) no console. É totalmente esperado neste ponto do projeto ;), Está lá porque adicionamos esse parâmetro `onlyIfTrusted: true` dentro do método `connect`. Isso fará com que a carteira Phantom rejeite a solicitação de conexão do usuário por enquanto (como o nome do erro sugere 😁).

Por que isso? Bem, o método `connect` com o parâmetro `onlyIfTrusted` definido como `true` só será executado se o usuário já tiver autorizado uma conexão entre sua carteira e o aplicativo da web. **O que nunca fizeram até agora.** Vamos fazer isso em seguida :).


### 🚨 Relatório de progresso

Por favor faça isso, senão o Farza vai ficar triste :(

Poste uma captura de tela em `#progress` mostrando a mensagem "Phantom wallet encontrada!" no seu console. Pode parecer simples, mas, muitas pessoas não sabem como fazer essas coisas! É épico.
