### 👛 Instalación de la extensión de la cartera Phantom Wallet

Para este proyecto vamos a usar una cartera llamada [Phantom](https://phantom.app/).

Esta es una de las principales extensiones de cartera para Solana y tiene el respaldo de Solana (para que compruebes que es legítima).

Antes de meternos al código, ¡asegúrate por favor de haber descargado la extensión y haber configurado la cartera Solana! Actualmente, Phantom Wallet es compatible con **Chrome**, **Brave**, **Firefox** y **Edge.** Pero, como nota: solo probamos este código en Brave y Chrome.

### 👻 Utilizando el objeto Solana

Para que nuestro sitio web se comunique con el programa de Solana, debemos conectar de alguna manera nuestra billetera (que es la extensión Phantom Wallet) al sitio web.
Una vez que los hayamos conectado, nuestro sitio web tendrá permiso para ejecutar funciones desde nuestro programa, en nuestro nombre. Si los usuarios no conectan su cartera, simplemente no podrán comunicarse con la cadena de bloques de Solana.

**Recuerda que esto, es como autenticarse en un sitio web.** ¡Si no has "iniciado sesión" en g-mail, entonces no podrás usar tu correo electrónico!

Vamos al código y en `App.js` en `src`. Aquí es donde estará el punto de entrada principal de nuestra aplicación.

Si tienes instalada la extensión Phantom Wallet, se inyectará automáticamente un objeto especial llamado 'solana' en su objeto 'window' que tiene algunas funciones mágicas. Esto significa que antes de hacer algo, debemos verificar si esto existe. Si no existe, digámosle a nuestro usuario que vaya a descargarlo:

```jsx
/*
 * We are going to be using the useEffect hook!
 */
import React, { useEffect } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Change this up to be your Twitter if you want.
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  /*
   * This function holds the logic for deciding if a Phantom Wallet is
   * connected or not
   */
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };

  /*
   * When our component first mounts, let's check to see if we have a connected
   * Phantom Wallet
   */
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
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
```
¡Genial! No está mal, ¿verdad? Vamos a desglosar esto un poco:

```jsx
const checkIfWalletIsConnected = async () => {
  try {
    const { solana } = window;
    if (solana) {
      if (solana.isPhantom) {
        console.log('Phantom wallet found!');
      }
    } else {
      alert('Solana object not found! Get a Phantom Wallet 👻');
    }
  } catch (error) {
    console.error(error);
  }
};
```
Nuestra función aquí es verificar que el objeto `window` en nuestro DOM para ver si la extensión Phantom Wallet ha inyectado el objeto `solana`. Si tenemos un objeto `solana`, también podemos verificar si es una cartera de Phantom.

Nosotros hemos probado este proyecto completamente con carteras Phantom, recomendamos seguir con esto. Aunque, nada te impide explorar o apoyar otras billeteras 👀.

```jsx
useEffect(() => {
  const onLoad = async () => {
    await checkIfWalletIsConnected();
  };
  window.addEventListener('load', onLoad);
  return () => window.removeEventListener('load', onLoad);
}, []);
```
En React, el hook `useEffect` se llama una vez durante el montaje del componente cuando ese segundo parámetro (el `[]`) está vacío. Entonces, esto es perfecto para nosotros. Tan pronto como alguien accede a nuestra aplicación, podemos verificar si tiene Phantom Wallet instalado o no. Esto será **muy importante** pronto.

Actualmente, el equipo de Phantom Wallet sugiere esperar a que la ventana termine de cargarse por completo antes de buscar el objeto `solana`. Una vez que se llamamos este evento, podemos garantizar que este objeto estará disponible si el usuario tiene instalada la extensión Phantom Wallet.

### 🔒 Accediendo a la cuenta del usuario

Entonces, cuando se ejecute este código, deberías poder ver esa línea *"¡Cartera Phantom encontrada!"* impresa en la consola del sitio web al inspeccionarla.

![Untitled](https://i.imgur.com/MZQlPl5.png)

**MUY BONITO.**

A continuación, vamos a verificar si estamos **autorizados** para acceder realmente a la cartera del usuario. Una vez que tengamos acceso a esto, podemos comenzar a obtener acceso a las funciones en nuestro programa Solana 🤘.

**Phantom Wallet no proporciona las credenciales de nuestra cartera a cada sitio web que visitamos**. Solo se lo da a los sitios web que autorizamos. De nuevo, ¡es como iniciar sesión! Pero, lo que estamos haciendo aquí es **comprobar si estamos "conectados".**

Todo lo que tenemos que hacer es agregar una línea más a nuestra función `checkIfWalletIsConnected`. Echa un vistazo al código a continuación:

```jsx
const checkIfWalletIsConnected = async () => {
  try {
    const { solana } = window;

    if (solana) {
      if (solana.isPhantom) {
        console.log('Phantom wallet found!');

        /*
         * The solana object gives us a function that will allow us to connect
         * directly with the user's wallet!
         */
        const response = await solana.connect({ onlyIfTrusted: true });
        console.log(
          'Connected with Public Key:',
          response.publicKey.toString()
        );
      }
    } else {
      alert('Solana object not found! Get a Phantom Wallet 👻');
    }
  } catch (error) {
    console.error(error);
  }
};
```
¡Es tan simple como llamar a `connect` le dice a Phantom Wallet que nuestro Portal GIF está autorizado para acceder a la información sobre esa cartera! Algunos de ustedes pueden preguntarse qué es esta propiedad `onlyIfTrusted`.

Si un usuario ya conectó su cartera con la aplicación, esta bandera extraerá inmediatamente sus datos sin pedírselo en otra ventana emergente de conexión. Bastante ingenioso, ¿no? Quieres saber más: [echa un vistazo a este documento]( https://docs.phantom.app/integrating/establishing-a-connection#eagerly-connecting
) de Phantom.

Caramba, y eso es todo. * En este punto, solo deberías ver "¡Cartera Phantom encontrada!" *!
¿Por qué pasa eso? Bueno, el método `connect` solo se ejecutará **si** el usuario ya autorizó una conexión a la aplicación. ** Lo que nunca se ha hecho hasta ahora. **

Entonces, ¡realicemos la inicialización de esta conexión!

### 🛍 Renderizar el botón de conexión a la cartera

Muy bien, ya estamos comprobando si un usuario ya está conectado a nuestra aplicación o no. ¿Pero, qué pasa si no están conectados? ¡No tenemos forma en nuestra aplicación de solicitar a Phantom Wallet que se conecte a nuestra aplicación!

Necesitamos crear un botón `connectWallet`. En el mundo de web3, conectar tu cartera es literalmente un botón "Registrarse/Iniciar sesión" integrado para los usuarios.

¿Estás listo para la experiencia de "Registrarte" más fácil de tu vida :)? Checa esto:

```jsx
import React, { useEffect } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // Actions
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            'Connected with Public Key:',
            response.publicKey.toString()
          );
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };

  /*
   * Let's define this method so our code doesn't break.
   * We will write the logic for this next!
   */
  const connectWallet = async () => {};

  /*
   * We want to render this UI when the user hasn't connected
   * their wallet to our app yet.
   */
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  // UseEffects
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
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
          {/* Render your connect to wallet button right here */}
          {renderNotConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
```

¡Qué agradable! Ahora deberás tener un botón degradado muy atractivo con la leyenda "Conectar a la billetera" en tu página.

![Untitled](https://i.imgur.com/TmZWnqn.png)

Lo más importante que hay que entender aquí son los **métodos de renderizado**.

*Nota: si ya estás familiarizado con los métodos React y render, siéntase libre de avanzar en esta sección.*

Estas son **funciones que sólo devuelven algún código de Interfaz de Usuario.** Solo queremos que nuestro botón "Conectar a la cartera" se muestre cuando alguien no haya conectado su billetera a nuestra aplicación.

Debes estar pensando: "¿*cómo controla nuestra aplicación cuándo mostrar y cuando no mostrar este botón?".*

***GRAN PUNTO***. Vamos a necesitar usar la cartera de otra persona para interactuar con nuestro programa más adelante. Entonces, ¿por qué no almacenamos estos datos de cartera en algún estado React? **Entonces** también podríamos usar eso como bandera para determinar si debemos mostrar u ocultar nuestro botón.

Primero deberás importar `useState` en el componente de la siguiente manera:

```jsx
import React, { useEffect, useState } from 'react';
```
Luego, justo encima de la función `checkIfWalletIsConnected`, continúa y agrega la siguiente declaración de estado:
```jsx
// State
const [walletAddress, setWalletAddress] = useState(null);
```
Muy bien. Entonces, ahora estamos listos para mantener algún estado, actualicemos algunas cosas en nuestro código aquí:
```jsx
import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // State
  const [walletAddress, setWalletAddress] = useState(null);

  // Actions
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            'Connected with Public Key:',
            response.publicKey.toString()
          );

          /*
           * Set the user's publicKey in state to be used later!
           */
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
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
      Connect to Wallet
    </button>
  );

  // UseEffects
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return (
    <div className="App">
			{/* This was solely added for some styling fanciness */}
			<div className={walletAddress ? 'authed-container' : 'container'}>
        <div className="header-container">
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
          {/* Add the condition to show this only if we don't have a wallet address */}
          {!walletAddress && renderNotConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
```

Mira, este React es elegante. Repasemos estos cambios rápido:

```jsx
const checkIfWalletIsConnected = async () => {
  try {
    const { solana } = window;

    if (solana) {
      if (solana.isPhantom) {
        console.log('Phantom wallet found!');
        const response = await solana.connect({ onlyIfTrusted: true });
        console.log(
          'Connected with Public Key:',
          response.publicKey.toString()
        );

        /*
         * Set the user's publicKey in state to be used later!
         */
        setWalletAddress(response.publicKey.toString());
      }
    } else {
      alert('Solana object not found! Get a Phantom Wallet 👻');
    }
  } catch (error) {
    console.error(error);
  }
};
```

Creo que esto se explica solo. Acabamos de conectar nuestra cartera Phantom y ahora recibimos los datos de la cartera del usuario. Ahora que ya logramos eso, avancemos y guardemos estos datos en nuestro estado para usarlos más tarde.

```jsx
{/* Add the condition to show this only if we don't have a wallet address */}
{!walletAddress && renderNotConnectedContainer()}
```

Esto es un código bastante bueno. Le estamos diciendo a React que solo llame a este método de renderizado si no hay una `walletAddress` establecida en nuestro estado. Esto se llama [**representación condicional**](https://reactjs.org/docs/conditional-rendering.html) y nos ayudará a realizar un seguimiento de los diferentes estados que queremos mostrar en nuestra aplicación.

```jsx
{/* This was solely added for some styling fanciness */}
<div className={walletAddress ? 'authed-container' : 'container'}>
```

Ahora que hemos visto algunas representaciones condicionales, ¡esperamos que esto tenga un poco de sentido para ti! ¡Queremos cambiar algunos de nuestros estilos CSS en función de si tenemos una `walletAddress` o no! Verás esta diferencia en la siguiente sección cuando construyamos la cuadrícula de GIFs.

### 🔥 Bueno, ahora REALMENTE conéctate a la cartera lol

¡Casi lo logramos! ¡Si haces clic en este nuevo botón, notarás que todavía no hace nada! ¡Qué diablos!, eso es bastante tonto 👎.

¿Recuerdas esa función que configuramos, pero aún no le agregamos ninguna lógica? Es hora de agregar la lógica de conexión a `connectWallet`:

```jsx
const connectWallet = async () => {
  const { solana } = window;

  if (solana) {
    const response = await solana.connect();
    console.log('Connected with Public Key:', response.publicKey.toString());
    setWalletAddress(response.publicKey.toString());
  }
};
```

¡Bastante simple! Llamemos a la función `connect` en el objeto `solana` para observar toda la fantasía de autorizar nuestro Portal GIF con la cartera digital del usuario. Ahora vamos a configurar la propiedad `walletAddress` para que nuestra página se actualice y elimine el botón Conectar Cartera.

¡Avancemos, actualiza la página y presiona el botón Conectar Cartera! Si todo funciona, finalmente debería ver aparecer la extensión Phantom Wallet así:

![https://i.imgur.com/XhaYIuk.png](https://i.imgur.com/XhaYIuk.png)

¡Una vez que presiones conectar, tu botón debería desaparecer! ¡¡¡VAMOS!!!

**Acabas de conectar una billetera Solana a tu aplicación. Esto es bastante salvaje. **

Ahora, si actualizas la página, se llamará la función `checkIfWalletIsConnected` y el botón debería desaparecer casi de inmediato 🤘.

¡Grandes logros aquí!

Tiene toda la configuración de interfaz de usuario básica y puedes "autenticar" fácilmente a un usuario con su cartera Solana. FUE FÁCIL.

A continuación, vamos a obtener toda la configuración con las funciones que necesitamos para llamar a nuestro programa Solana Y obtener algunos datos. ¡Nuestra aplicación web es un poco aburrida/vacía! Hay que cambiar eso :).

*Nota: en la configuración de Phantom (a la que puedes acceder haciendo clic en el engranaje cerca de la parte inferior derecha) verás una sección de "Aplicaciones de confianza". Aquí, vamos a ver nuestro URL de Replit, o `localhost:3000` si estás ejecutando la aplicación localmente. Eres libre de revocar esto si desea probar el caso de alguien que visita el sitio y nunca se conectó. Básicamente restablecerá el acceso de las carteras a este sitio.*

### 🚨 Informe de progreso
*Por favor haz esto sino Farza se pondrá triste :(*

Pon una captura de pantalla de tu consola en `#progress` mostrando tu clave pública con la cartera conectada. No te preocupes, puedes compartir tu clave pública. Por eso es "público" ;).
