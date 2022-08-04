### 🛍 Renderizando o botão de conexão à carteira

Tudo bem. Já estamos verificando se um usuário já está conectado ao nosso aplicativo ou não. E se ele não estiver conectado? Não temos como, em nosso aplicativo, solicitar que a Phantom Wallet se conecte ao nosso aplicativo!

Precisamos criar um botão `connectWallet`. No mundo da web3, conectar sua carteira é literalmente como se tivéssemos um botão "Cadastre-se/Faça o Login" embutido em outro botão para uma melhor experiência do usuário.

Você está pronto para a experiência de cadastro mais fácil da sua vida :)? Confira o código abaixo. Deixei comentários nas linhas que modifiquei.


```jsx
import React, { useEffect } from 'react';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet encontrada!');
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            'Conectado com chave pública:',
            response.publicKey.toString()
          );
        }
      } else {
        alert('Objeto Solana não encontrado. Consiga uma Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };

  /* Vamos definir esse método para que nosso código não quebre. 
  Vamos escrever a lógica para isso a seguir! */

  const connectWallet = async () => {};

  /* Queremos renderizar essa interface do usuário quando o usuário 
  ainda não tiver conectado sua carteira ao nosso aplicativo. */

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Conectar à Carteira
    </button>
  );

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
          {/* Renderize seu botão para conectar à carteira aqui */}
          {renderNotConnectedContainer()}
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


Excelente! Agora você deve ter renderizado em sua página um botão com gradiente e uma aparência bem legal, que diz "Conectar à carteira".

![https://camo.githubusercontent.com/cbefae447d15aa767b115a5bd652b11a9b078c9cd5f0b04d625757997c270857/68747470733a2f2f692e696d6775722e636f6d2f3559326c5559502e706e67](https://camo.githubusercontent.com/cbefae447d15aa767b115a5bd652b11a9b078c9cd5f0b04d625757997c270857/68747470733a2f2f692e696d6775722e636f6d2f3559326c5559502e706e67)

**Queremos que nosso botão "Conectar à carteira" seja renderizado apenas quando nosso usuário não tiver realmente conectado sua carteira ao aplicativo.**

Então, por que não armazenamos esses dados da carteira em um estado do React? **Assim** poderíamos também usar isso como um sinal para determinar se devemos mostrar ou ocultar nosso botão.

Primeiro você precisará importar `useState` para seu componente dessa forma:


```jsx
import React, { useEffect, useState } from 'react';
```


Então, logo acima da sua função `checkIfWalletIsConnected`, vá em frente e adicione a seguinte declaração de estado:


```jsx
// Estado
const [walletAddress, setWalletAddress] = useState(null);
```


Excelente. Então, agora que estamos prontos para armazenar dados no estado, vamos atualizar algumas coisas em nosso código aqui:


```jsx
import React, { useEffect, useState } from 'react';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';

// Constantes
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // Estado
  const [walletAddress, setWalletAddress] = useState(null);

  // Ações
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet encontrada!');
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            'Conectado com chave pública:',
            response.publicKey.toString()
          );

          /* Definir a chave pública do usuário no estado
           para ser usada posteriormente! */

          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert('Objeto Solana não encontrado. Consiga uma Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {};

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Conectar à carteira
    </button>
  );

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
          {/*Adicione a condição para mostrar isso apenas se 
          não tivermos um endereço de carteira*/}
          {!walletAddress && renderNotConnectedContainer()}
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


Vamos revisar as mudanças bem rapidamente à seguir:


```jsx
const checkIfWalletIsConnected = async () => {
  try {
    const { solana } = window;

    if (solana) {
      if (solana.isPhantom) {
        console.log('Phantom wallet encontrada!');
        const response = await solana.connect({ onlyIfTrusted: true });
        console.log(
          'Conectado com Chave Pública:',
          response.publicKey.toString()
        );

        /* Definir a chave pública do usuário no estado para
         ser usada posteriormente! */

        setWalletAddress(response.publicKey.toString());
      }
    } else {
      alert('Objeto Solana não encontrado. Consiga uma Phantom Wallet 👻');
    }
  } catch (error) {
    console.error(error);
  }
};
```


Acho que isso é bem autoexplicativo. Acabamos de conectar nossa Phantom Wallet e agora recebemos os dados da carteira do usuário. Agora que temos esses dados, vamos salvá-los em nosso estado para usar mais tarde:


```jsx
{/* Adicione a condição para mostrar isso apenas se não tivermos um endereço de carteira*/}
{!walletAddress && renderNotConnectedContainer()}
```


Aqui, estamos dizendo ao React para chamar este método de renderização apenas se não houver nenhum `walletAddress` definido em nosso estado. Portanto, se não houver um endereço de carteira, isso significa que um usuário ainda não conectou sua carteira e devemos mostrar a ele o botão para conectá-la.


### 😅 Ok - agora realmente conecte-se à carteira (risos).

Estamos quase lá! Se você clicar no seu novo botão estiloso, perceberá que ele ainda não faz nada! Mas que droga - isso é bem chato 👎.

Lembra daquela função que configuramos, mas à qual ainda não adicionamos nenhuma lógica? É hora de adicionar a lógica de conexão à `connectWallet` :


```jsx
const connectWallet = async () => {
  const { solana } = window;

  if (solana) {
    const response = await solana.connect();
    console.log('Conectado com Chave Pública:', response.publicKey.toString());
    setWalletAddress(response.publicKey.toString());
  }
};
```


Simples demais! Quando o usuário quiser conectar sua carteira - chame a função `connect` no objeto `solana` para lidar com todo o processo de autorizar nosso aplicativo da web com a carteira do usuário. Assim que fizermos isso, teremos acesso às informações da carteira do usuário - por exemplo, o endereço da carteira!

Em seguida, vamos definir a propriedade `walletAddress` para que nossa página atualize e **remova** o botão “Conectar à Carteira” assim que nos conectarmos.

Vá em frente, atualize sua página e pressione o botão “Conectar à Carteira”! Se tudo funcionar, você finalmente verá a extensão Phantom Wallet ser exibida assim:

![https://camo.githubusercontent.com/2d9ea26baf7724388e56a01ad7c7f20bed247d1e7326f89cc3e7844dc833c6d0/68747470733a2f2f692e696d6775722e636f6d2f775851795745652e706e67](https://camo.githubusercontent.com/2d9ea26baf7724388e56a01ad7c7f20bed247d1e7326f89cc3e7844dc833c6d0/68747470733a2f2f692e696d6775722e636f6d2f775851795745652e706e67)

Assim que pressionar “Conectar”, seu botão deve desaparecer! VAMOS. NESSA. LOUCURA.

**Você acabou de conectar uma carteira Solana ao seu aplicativo. Isso é bem louco.**

Agora, se você atualizar a página, sua função `checkIfWalletIsConnected` será chamada e seu botão deve desaparecer quase imediatamente 🤘. Em seu console, você também verá sua chave pública na tela.

Grandes evoluções aqui! Você tem a sua configuração básica da interface do usuário e pode facilmente "autenticar" um usuário com sua carteira Solana. Bem fácil.

Em seguida, vamos nos preparar para configurar as funções que precisamos para chamar nosso programa Solana + mexer com alguns dados. Nosso aplicativo web ainda é meio entediante/vago! Vamos mudar isso :).

_Observação: nas configurações da Phantom (que você pode acessar clicando na engrenagem no canto inferior direito), você verá uma seção "Trusted Apps" (Aplicativos confiáveis). Nesta seção, você verá sua URL Replit, ou `localhost:3000` se estiver executando seu aplicativo localmente. Sinta-se à vontade para **revogar** isso se quiser testar o caso de alguém que acessa o seu site, mas que nunca tinha se conectado antes. Isso basicamente redefinirá o acesso de suas carteiras ao site e mostrará o botão "Conectar à carteira" novamente._


### 🚨 Relatório de progresso

Por favor faça isso, senão o Farza vai ficar triste :(

Publique em `#progress` uma captura de tela do seu console exibindo sua chave pública! Não se preocupe, é seguro compartilhar a chave pública :).
