## 🌅 Utilizando window.ethereum()

Entonces, para que nuestro sitio se comunique con la Cadena de Bloques, necesitamos buscar una manera de conectar nuestra cartera digital. 
Una vez hecho esto nuestro sitio va a contar con los permisos para llamar contratos inteligentes en nuestro nombre.

Vayamos a Replit y busquemos `App.jsx` que está sobre `src` ya que aquí es donde haremos todo el trabajo.
Si ya estas conectado a Metamask automáticamente se inyectará un objeto especial llamado `ethereum` en nuestra ventana. Revisemos que si lo tenemos:

```javascript
import React, { useEffect } from "react";
import "./App.css";

const App = () => {
  const checkIfWalletIsConnected = () => {
    /*
    * First make sure we have access to window.ethereum
    */
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
    } else {
      console.log("We have the ethereum object", ethereum);
    }
  }

  /*
  * This runs our function when the page loads.
  */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
          I am farza and I worked on self-driving cars so that's pretty cool right? Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={null}>
          Wave at Me
        </button>
      </div>
    </div>
  );
}

export default App
```
## 🔒 Ver si podemos acceder a la cuenta de los usuarios.

Cuando ejecutemos esto podremos ver que parece una línea que dice lo siguiente: Tenemos el objeto Ethereum” 
impreso en la consola de nuestro sitio web cuando lo analizas con la opción “inspeccionar”. 
Si estás usando Replit asegúrate que esto lo haces en la consola del projecto final no en el espacio de trabajo en Replit. 
Puedes acceder a la consola de tu sitio web abriéndolo en una pestaña o ventana y usando las herramientas de desarrollo. El URL debe ser algo por el estilo:

`https://waveportal-starter-project.yourUsername.repl.co/`

**MUY BIEN.**

A continuación, debemos verificar si estamos autorizados para acceder a la cartera del usuario. Una vez que tengamos acceso a esto, 
¡podemos llamar a nuestro contrato inteligente!
Básicamente, Metamask no proporciona las credenciales de nuestra cartera digital a cada sitio web al que vamos. 
Solo se lo da a los sitios web que autorizamos. Nuevamente, ¡es como iniciar sesión! Pero, lo que estamos haciendo aquí es **verificar si estamos "conectados".**

Revisemos el código a continuación:

```javascript
import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  /*
  * Just a state variable we use to store our user's public wallet.
  */
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          👋 Hey there!
        </div>

        <div className="bio">
          I am farza and I worked on self-driving cars so that's pretty cool right? Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={null}>
          Wave at Me
        </button>
      </div>
    </div>
    );
  }
export default App
```

Estamos usando el método especial `eth_accounts` para ver si contamos con la autorización para acceder a alguna de las cuentas de los usuarios en 
la cartera del usuario. Una cosa para tener en cuenta es que el usuario puede tener múltiples cuentas en su cartera. En este caso, solo tomamos el primero.

## 💰 Construyamos el botón “conectar cartera”.

Al ejecutar el código anterior el console.log nos imprime en la pantalla el mensaje: `No authorized account found`. 
¿Por qué? Bueno pues por qué nunca le dijimos de manera explicita a Metamask, “oye Metamask por favor dale acceso mi cartera a este sitio web”.
Necesitamos crear un botón `connectWallet`. En el mundo de Web3 conectar nuestra cartera es literalmente un botón de “Iniciar Sesión” para el usuario. Mira esto:

```javascript
import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
          I am farza and I worked on self-driving cars so that's pretty cool right? Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={null}>
          Wave at Me
        </button>

        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}

export default App
```
Nuestro código se está volviendo un poco largo. Pero se puede ver que la función de `connectWallet` lo corta que es. 
Para este caso, yo utilizo la función `eth_requestAccounts` porqué le estoy pidiendo a Metamask que me de acceso a la cartera digital del usuario.
En en código en la línea 67 añadí un botón para que podamos llamar a la función `connectWallet`. 
Notarás que sólo se muestra este botón si no existe una currentAccount, si ya teníamos una `currentAccount` eso significa que ya tenemos acceso a 
una cuenta autorizada en la cartera digital del usuario.

## 🌐 ¡Conexión!

Llego la hora de la magia. Por favor revisa el siguiente video:
[Loom](https://www.loom.com/share/1d30b147047141ce8fde590c7673128d?t=0)

## 🚨 Acción requerida: Antes de pasar a la “siguiente lección”.

Hemos hecho mucho en las últimas dos lecciones. ¿Tienes alguna pregunta? Si es así por favor hazlo en #section-2-help.






