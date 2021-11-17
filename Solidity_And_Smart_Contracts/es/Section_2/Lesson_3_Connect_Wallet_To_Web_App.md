🌅 Utilizando window.ethereum()
--------------------------

Así pues, para que nuestra web pueda hablar con la blockchain, necesitamos conectar de alguna manera nuestra cartera a ella. Una vez que conectemos nuestra cartera a nuestro sitio web, éste tendrá permisos para llamar a los smart contracts en nuestro nombre. Recuerda, es como autenticarse en un sitio web.

Dirígete a Replit y ve a `App.js` bajo `src`, aquí es donde vamos a hacer todo nuestro trabajo.

Si hemos iniciado sesión en Metamask, se inyectará automáticamente un objeto especial llamado `ethereum` en nuestra ventana. Vamos a comprobar si tenemos eso primero.

```javascript
import React, { useEffect } from "react";
import './App.css';

const App = () => {
  const checkIfWalletIsConnected = () => {
    /*
    * Primero nos aseguramos de que tenemos acceso a window.ethereum
    */
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Asegúrate de que tienes Metamask!");
      return;
    } else {
      console.log("Tenemos el objeto ethereum", ethereum);
    }
  }

  /*
  * Esto ejecuta nuestra función cuando se carga la página.
  */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
  
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        👋 Holaaa!
        </div>

        <div className="bio">
          ¡Soy Farza! He trabajado en coche autónomos. Bastante guay ¿no? ¡Conecta tu cartera de Ethereum y mándame un saludo!
        </div>

        <button className="waveButton" onClick={null}>
          Salúdame
        </button>
      </div>
    </div>
  );
}

export default App
```

🔒 Ver si podemos acceder a la cuenta de los usuarios
-----------------------------------------

Cuando ejecutes esto, deberías ver esa línea "Tenemos el objeto ethereum" impresa en la consola de la web cuando vayas a inspeccionarla. Si estás usando Replit, asegúrate de que estás mirando la consola de la página web de tu proyecto, ¡no el espacio de trabajo de Replit! Puedes acceder a la consola de tu sitio web abriéndola en su propia ventana/pestaña y lanzando las herramientas de desarrollo. La URL debería ser algo así - `https://waveportal-starter-project.yourUsername.repl.co/`.

**SUBLIME.**

A continuación, tenemos que comprobar si estamos autorizados a acceder a la cartera del usuario. Una vez que tenemos acceso a esta, ¡podemos llamar a nuestro smart contract!

Básicamente, Metamask no da las credenciales de nuestra cartera a todos los sitios web que visitamos. Sólo se las da a los sitios web que autorizamos. De nuevo, ¡es como iniciar una sesión! Pero, lo que estamos haciendo aquí es **comprobar si estamos "conectados"**.

Mira el código de abajo.

```javascript
import React, { useEffect, useState } from "react";
import './App.css';

const App = () => {
  /*
  * Una state variable que usamos para almacenar la cartera pública de nuesrto usuario.
  */
  const [currentAccount, setCurrentAccount] = useState("");
  
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      
      if (!ethereum) {
        console.log("Asegúrate de que tienes Metamask!");
        return;
      } else {
        console.log("Tenemos el objeto ethereum", ethereum);
      }
      
      /*
      * Comprobar que estamos autorizados para acceder a la cartera del usuario
      */
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Cartera autorizada encontrada:", account);
        setCurrentAccount(account)
      } else {
        console.log("No se encontró ninguna cuenta autorizada")
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
          👋 Holaaa!
        </div>
    
        <div className="bio">
          ¡Soy Farza! He trabajado en coche autónomos. Bastante guay ¿no? ¡Conecta tu cartera de Ethereum y mándame un saludo!
        </div>
    
        <button className="waveButton" onClick={null}>
          Salúdame
        </button>
      </div>
    </div>
    );
  }
export default App
```


Así, usamos ese método especial `eth_accounts` para ver si estamos autorizados a acceder a alguna de las cuentas de la cartera del usuario. Una cosa a tener en cuenta es que el usuario podría tener varias cuentas en su cartera. En este caso, sólo tomamos la primera.

💰 Crear un botón para conectar la cartera
--------------------------------

Al ejecutar el código anterior, el console.log que se imprime debe ser `No se encontró ninguna cuenta autorizada`. ¿Por qué? Bueno, porque nunca le dijimos explícitamente a Metamask, "hey Metamask, por favor dale a este sitio web acceso a mi cartera". 

Necesitamos crear un botón `connectWallet`. En el mundo de Web3, conectar tu cartera es literalmente un botón de "Login" para tu usuario :). Compruébalo:


```javascript
import React, { useEffect, useState } from "react";
import './App.css';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Asegúrate de que tienes Metamask!");
        return;
      } else {
        console.log("Tenemos el objeto ethereum", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Cartera autorizada encontrada:", account);
        setCurrentAccount(account);
      } else {
        console.log("No se encontró ninguna cuenta autorizada")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implementa tu método connectWallet aquí
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Descarga Metamask");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Conectado ", accounts[0]);
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
        👋 Holaaa!
        </div>

        <div className="bio">
          ¡Soy Farza! He trabajado en coche autónomos. Bastante guay ¿no? ¡Conecta tu cartera de Ethereum y mándame un saludo!
        </div>

        <button className="waveButton" onClick={null}>
          Salúdame
        </button>
        
        {/*
        * Si no existe ninguna currentAccount renderiza este botón
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Conecta tu cartera
          </button>
        )}
      </div>
    </div>
  );
}

export default App
```

Nuestro código se está haciendo un poco largo pero puedes ver lo corta que es nuestra función `connectWallet`. En este caso, utilizo la función `eth_requestAccounts` porque literalmente estoy pidiendo a Metamask que me dé acceso a la cartera del usuario.

En la línea 67, también he añadido un botón para poder llamar a nuestra función `connectWallet`. Notarás que sólo muestro este botón si no tenemos "currentAccount". Si ya tenemos currentAccount, eso significa que ya tenemos acceso a una cuenta autorizada en la cartera del usuario.

🌐 ¡Conecta!
-----------

¡Es el momento de la magia! Echa un vistazo al vídeo de abajo:
[Loom](https://www.loom.com/share/1d30b147047141ce8fde590c7673128d?t=0)

🚨 Obligatorio: Antes de hacer clic en "Next Lesson"
-------------------------------------------

Acabamos de hacer mucho en las dos últimas lecciones. ¿Tienes alguna duda? ¡Asegúrate de preguntar en la #section-2-help!
