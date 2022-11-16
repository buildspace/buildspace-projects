### ✅ Ejecutar una prueba en devnet

De hecho, me gusta ejecutar una `anchor test` en este punto antes de comenzar a integrar mi aplicación web. Esto podría salvarnos de algunos errores aleatorios y molestos.

Debido a que nuestra configuración está establecida en devnet, Anchor en realidad ejecutará nuestras pruebas directamente en el devnet, que es exactamente lo que queremos. ¡De esa manera podemos asegurarnos de que nuestras funciones reales funcionen correctamente en devnet!

Continuemos y ejecutemos:

```bash
anchor test
```

Si nada falla y ves algo como:

```bash
Deploy success
🚀 Starting test...
📝 Your transaction signature 41aW8pAtFLyxgg1S54EATUSKSXB9LKe1qSGgLvuy3Fh58vWgiHuXK8jsrtRy5Spm32xCytXoNyJTMKVpa4ZHcnEB
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

Entonces estás listo para continuar.

Lo que es realmente interesante aquí es que si va a [Solana Explorer] (https://explorer.solana.com/?cluster=devnet) y pega la identificación del programa (tal como lo hiciste antes), verás algunas transacciones nuevas. ¡Estas son causadas por la prueba que acabas de ejecutar! Siéntete libre de revisarlas.

Debo mencionar algo súper importante aquí. Cuando ejecutaste `anchor test` en este momento, en realidad volverás a implementar el programa y luego ejecutarás todas las funciones en el script.

Es posible que tu pregunta sea: "¿Por qué se volvió a implementar? ¿Por qué no se comunica simplemente con el programa que ya se implementó? Además, si lo volviéramos a implementar, ¿no se habría implementado en una identificación de programa completamente diferente?".

** Entonces, los programas de Solana son [actualizables] (https://docs.solana.com/cli/deploy-a-program#redeploy-a-program). ** Eso significa que cuando volvemos a implementar estamos actualizando la misma identificación del programa para apuntar a la última versión del programa que implementamos. Y lo bueno aquí es que las *cuentas* con las que se comunican los programas permanecerán; recuerda esto, estas cuentas guardan datos relacionados con el programa.

**Eso significa que podemos actualizar los programas mientras mantenemos la pieza de datos separada**. Genial, ¿no es verdad :)?

*Nota: esto es **muy, muy** diferente de Ethereum, donde nunca podrás cambiar un contrato inteligente una vez que se implementa.*

### 🤟 Conectando nuestro archivo IDL a la aplicación web

Entonces, ahora tenemos un programa Solana implementado. Vamos a conectarlo a nuestra aplicación web :).

Lo primero que necesitamos es el archivo `idl` que `anchor build` generó mágicamente antes sin que lo supieras. Podrás verlo en `target/idl/myepicproject.json`.
El archivo `idl` es en realidad solo un archivo JSON que tiene información sobre nuestro programa Solana, como los nombres de nuestras funciones y los parámetros que aceptan. Esto ayuda a que nuestra aplicación web realmente sepa cómo interactuar con nuestro programa implementado.

¡También verás que cerca de la parte inferior está nuestra identificación de programa! Así es como nuestra aplicación web sabrá a qué programa conectarse realmente. Hay *millones* de programas implementados en Solana y esta dirección es cómo nuestra aplicación web puede obtener acceso rápido a nuestro programa específicamente.

![Untitled](https://i.imgur.com/bnorlgJ.png)

*Nota: si no ve el archivo idl o no ve un parámetro de "dirección" cerca de la parte inferior, ¡algo salió mal! Comienza nuevamente desde la sección "Implementar programa en la red de desarrollo" del proyecto.* Lección número 1 de esta sección.

Continuemos y copia todo el contenido en `target/idl/myepicproject.json`.

Dirígete a tu aplicación web.

En el directorio `src` de su aplicación de react **crea un archivo vacío** llamado `idl.json`. Debe estar en el mismo directorio que `App.js`. Entonces, tendrás el archivo en `app/src/idl.json`. Una vez que hayas creado el archivo, pega el contenido de `target/idl/myepicproject.json` en el nuevo archivo `app/src/idl.json`.

Finalmente, en `App.js`, continua e importa esto:

```javascript
import idl from './idl.json';
```

¡¡Esto es muy divertido!!

### 🌐 Cambia la red a la que se conecta Phantom

En este momento, Phantom estará conectado a Solana Mainnet. Necesitamos conectarnos a Solana Devnet. Podrás cambiar esto yendo a la configuración (haz clic en el pequeño icono del avatar en la parte superior izquierda), clic en "Ajustes para desarrolladores", clic en "Cambiar red" y luego haz clic en "Devnet". ¡Eso es todo lo que hay que hacer!

![Untitled](https://i.imgur.com/JWHwPJX.png)

### 👻 Fondear la Cartera de Phantom

También necesitamos financiar nuestra cartera Phantom con algún SOL falso. **Leer** **datos** de cuentas en Solana es gratis. Pero hacer cosas como crear cuentas y agregar datos a las cuentas cuesta SOL.

Necesitaráa la dirección pública asociada a tu cartera Phantom que podrás obtener en la parte superior haciendo clic en su dirección:

![ Screen Shot 2021-11-03 at 12.31.15 PM.png](https://i.imgur.com/3I2Wjv3.png)

Ahora, ejecuta esto desde tu terminal.

```bash
solana airdrop 2 INSERT_YOUR_PHANTOM_PUBLIC_ADDRESS_HERE  --url devnet
```

Ahora, cuando vayas a su cartera Phantom, deberás tener 2 SOL asociados con su billetera devnet. Eso está muy bien :).

### 🍔 Configure un `proveedor` de Solana en nuestra aplicación web

Para tu aplicación web, necesitaremos instalar dos paquetes. Debes instalarlos para el proyecto Anchor, también los usaremos en nuestra aplicación web :).

```bash
npm install @project-serum/anchor @solana/web3.js
```

*Nota: si estás trabajando en Replit, deberías tener estos ya preinstalados. Si no haces y comienzas a recibir errores más tarde, puedes instalar paquetes haciendo clic en "Shell" y luego ejecutando comandos como en una terminal normal. También tienen un elegante instalador de "Paquetes" en la barra lateral izquierda.*

¡Antes de que podamos interactuar con los paquetes que instalamos anteriormente, debemos importarlos a nuestra aplicación web! Debes agregar las siguientes líneas de código en la parte superior de App.js:

```javascript
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';
```

*Nota (solo para usuarios de Replit):*
*1. Si obtienes un error `global no está definido`(`global is not defined`)
 , cambie vite.config.js a:*
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

*2. Si obtienes un error relacionado con `buffer`, agrégalo a `App.jsx`:*
```javascript
import { Buffer } from 'buffer';
window.Buffer = Buffer;
```
Vamos a crear una función llamada `getProvider`. Incluye esto justo debajo de `onInputChange`. Aquí está el código a continuación.
```javascript
const getProvider = () => {
  const connection = new Connection(network, opts.preflightCommitment);
  const provider = new Provider(
    connection, window.solana, opts.preflightCommitment,
  );
  return provider;
}
```

Esto, por supuesto, arrojará un montón de errores ya que no tenemos ninguna de las variables jajaja. Pero básicamente somos nosotros creando un "proveedor" que es una **conexión autenticada a Solana**. ¡Mira cómo se necesita `window.solana` aquí!

¿Por qué? Porque para hacer un `proveedor` necesitamos una cartera conectada. **Ya lo hicimos antes** cuando hiciste clic en "Conectar" en Phantom, lo que te dio el permiso para dar acceso a nuestra aplicación web a nuestra cartera.

![https://i.imgur.com/vOUldRN.png](https://i.imgur.com/vOUldRN.png)

**No puedes comunicarte con Solana en absoluto a menos que tengas una cartera conectada. ¡Ni siquiera podemos recuperar datos de Solana a menos que tengamos una cartera conectada! **

Esta es una gran razón por la que Phantom es útil. Brinda a nuestros usuarios una forma simple y segura de conectar su cartera a nuestro sitio para que podamos crear un "proveedor" que nos permita hablar con los programas en Solana :).

Vamos a crear algunas variables que nos faltan. También tendremos que importar algunas cosas.

Continuemos y agrega este código en:

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

Todo esto es bastante sencillo y las cosas tendrán más sentido a medida que comencemos a usar estas variables más adelante.

`SystemProgram` es una referencia al [programa central](https://docs.solana.com/developing/runtime-facilities/programs#system-program) que ejecuta Solana del que ya hablamos. `Keypair.generate()` nos da algunos parámetros que necesitamos para crear la cuenta `BaseAccount` que contendrá los datos GIF para nuestro programa.

Luego, usamos `idl.metadata.address` para obtener la identificación de nuestro programa y luego especificamos que queremos asegurarnos de conectarnos a devnet haciendo `clusterApiUrl('devnet')`.

Esto de `preflightCommitment: "processed"` es interesante. Puedes leer un poco [aquí] (https://solana-labs.github.io/solana-web3.js/modules.html#Commitment). Básicamente, podemos elegir *cuándo* para recibir una confirmación de que nuestra transacción se ha realizado correctamente. Debido a que la cadena de bloques está completamente descentralizada, podemos elegir cuánto tiempo queremos esperar para una transacción. ¿Queremos esperar a que solo un nodo reconozca nuestra transacción? ¿Queremos esperar a que toda la cadena Solana reconozca nuestra transacción?

En este caso, simplemente esperamos que nuestra transacción sea confirmada por el *nodo al que estamos conectados*. En general, esto está bien, pero si quiere estar súper seguro, puede usar algo como `"finalizado"` en su lugar. Por ahora, sigamos con `"procesado"`.

### 🏈 Recuperar GIFs de la cuenta de nuestro programa

En realidad, ahora es muy simple llamar a nuestro programa ahora que tenemos todo configurado. Es un simple `buscar` para obtener la cuenta, similar a cómo llamarías a una API. ¿Recuerdas este pedazo de código?

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

¡Todavía estamos usando `TEST_GIFS`! Eso es aburrido. Vamos a nuestro programa. Debería devolvernos una lista vacía de GIF, ¿verdad? Ya que en realidad nunca agregamos ningún GIF todavía.

Vamos a cambiar esto a lo siguiente:

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

### 🤬 ¿¡Hay un error!?

Cuando actualices la página, obtendrás un error similar a este:

![Untitled](https://i.imgur.com/wUArqKJ.png)

Hmmmm — "La cuenta no existe".

Este error me confundió muchísimo cuando lo vi por primera vez. Originalmente, pensé que significaba que mi "cuenta" de billetera real no existía.
Pero, lo que este error realmente significa es que la `BaseAccount` de nuestro programa no existe.

¡Lo cual tiene sentido, aún no hemos inicializado la cuenta a través de `startStuffOff`! Nuestra cuenta no se crea mágicamente. Vamos a hacer eso.

### 🔥 Llama a la función `startStuffOff` para inicializar el programa

Construyamos una función simple para llamar a `startStuffOff`. ¡Vas a querer agregar esto en tu función `getProvider`!

¡Esto se ve exactamente como lo teníamos funcionando en el script de prueba!

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

Luego, necesitamos cambiar `renderConnectedContainer` para si alguno de  estos dos casos sucede.

1. El usuario ha conectado su cartera, pero la cuenta `BaseAccount` **no** se ha creado. Hagamos un botón para crear una cuenta.
2. El usuario conectó su cartera y `BaseAccount` existe, así que renderice `gifList` y permita que las personas envíen un GIF.
3. 
```jsx
const renderConnectedContainer = () => {
// If we hit this, it means the program account hasn't been initialized.
  if (gifList === null) {
    return (
      <div className="connected-container">
        <button className="cta-button submit-gif-button" onClick={createGifAccount}>
          Do One-Time Initialization For GIF Program Account
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

¡Esto es muy claro! Hice algunos cambios en `gifList.map`. ¡Pon atención con estos cambios!

###   ¡Vamos a probar lo que hicimos!

¡Continuamos y vamos a probarlo! Si actualizas la página y tiene la cartera conectada, verás "Hacer una inicialización única para la cuenta del programa GIF". Cuando hagas clic aquí, verás que Phantom te solicita que pagues la transacción con algunos SOL.

Si todo salió bien, verás esto en la consola:

![Untitled](https://i.imgur.com/0CdFajf.png)

Entonces, ¡aquí creamos una cuenta *y luego* recuperamos la cuenta en sí! ¡Y `gifList` está vacío ya que aún no hemos agregado ningún GIF a esta cuenta! **MUY BONITO.**

** Entonces, ahora notarás que cada vez que actualizamos la página, nos pide que creemos una cuenta nuevamente. Arreglaremos esto más tarde, pero ¿por qué sucede esto? Hice un pequeño video al respecto a continuación **

[Loom](https://www.loom.com/share/fc1cf249073e45d6bf31d985b4b11580)

### 🚨 Reporte de avances

*Por favor haz esto sino Farza se pondrá triste :(*

Publica una captura de pantalla en `#progress` con el mensaje "Obtuve la cuenta" (Got the account) en tu consola :).
