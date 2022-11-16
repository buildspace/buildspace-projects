De acuerdo, finalmente llegamos al punto en el que podemos guardar algunos GIF. Es tan fácil de hacer. Solo vamos a cambiar un poco nuestra función `sendGif` y agregar un último `import`, por lo que ahora llamamos a `addGif` y luego llamamos a `getGifList` para que nuestra aplicación web se actualice para mostrar nuestro último GIF enviado.

```javascript
// Otros imports...
// Agrega estas 2 nuevas líneas
import { Buffer } from "buffer";
window.Buffer = Buffer;
```

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

Ahora, podrás enviar un enlace, aprobar la transacción a través de Phantom y la aplicación web ahora deberías ver el GIF que acaba de enviar :).

### 🙈 Resolvamos el problema de la cuenta que se restablece

Entonces, ya analizamos este problema en el que nuestra cuenta se restablece cada vez que actualizamos la página. Arreglémoslo.

El problema central es esta línea:

```javascript
let baseAccount = Keypair.generate();
```

Lo que sucede aquí es que estamos generando una nueva cuenta para que nuestro programa hable **todas las veces**. Entonces, la solución aquí es que solo necesitamos tener un par de llaves que todos nuestros usuarios compartan.

En el directorio `src`, dirígete y crea un archivo llamado `createKeyPair.js`. Allí, pega esto:

```javascript
// Shoutout to Nader Dabit for helping w/ this!
// https://twitter.com/dabit3

const fs = require('fs')
const anchor = require("@project-serum/anchor")

const account = anchor.web3.Keypair.generate()

fs.writeFileSync('./keypair.json', JSON.stringify(account))
```

Lo que este script hace es escribir un par de claves directamente en nuestro sistema de archivos, de esa manera, cada vez que las personas ingresen a nuestra aplicación web, todos cargarán el mismo par de claves.

Cuando estés listo para ejecutar esto, siga adelante con esto:

```bash
cd src
node createKeyPair.js
```

Asegúrate de insertar un `cd` en el directorio `createKeyPair.js`.

Esto generará un archivo llamado `keypair.json` con nuestro elegante par de llaves :).

**Nota para los usuarios de Replit**: en realidad, puede ejecutar comandos de shell directamente en Replit. Haga clic en la palabra "Shell", luego escriba y ejecute `cd src` y luego `node createKeyPair.js` y funcionará como si estuviera usando una terminal local.

Ahora que tenemos este archivo, solo necesitamos cambiar un poco `App.js`. En la parte superior, deberás importar el par de claves de esta manera:

```javascript
import kp from './keypair.json'
```

A continuación, eliminemos `let baseAccount = Keypair.generate();`. Lo reemplazaremos con esto:

```javascript
const arr = Object.values(kp._keypair.secretKey)
const secret = new Uint8Array(arr)
const baseAccount = web3.Keypair.fromSecretKey(secret)
```

Eso es todo. ¡Ahora tenemos un par de llaves permanente! Si actualizas, verás que después de inicializar la cuenta, ¡permanece incluso después de actualizar :)! Intenta enviar algunos GIF desde aquí.

También puedes ejecutar `createKeyPair.js` tantas veces como quieras y esto te permitirá crear una nueva `BaseAccount`. Sin embargo, esto también significa que la nueva cuenta estará completamente vacía y no tendrá datos. Es importante comprender qué **no eliminará cuentas si ejecuta** `createKeyPair.js` nuevamente.

Simplemente debes crear una nueva cuenta para que apunte su programa.

### 🚨 Reporte de avances

*Por favor haz esto sino Farza se pondrá triste :(*

¡Tienes los envíos de GIF funcionando! Publica una captura de pantalla en `#progress` con sus GIF recuperados del programa Solana :).
