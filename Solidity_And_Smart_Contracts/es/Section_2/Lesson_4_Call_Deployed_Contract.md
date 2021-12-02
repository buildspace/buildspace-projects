📒 Lee desde la blockchain a través de nuestra web
-----------------------------------------------

Impresionante. Lo hemos conseguido. Hemos desplegado nuestra web. Hemos desplegado nuestro contrato. Hemos conectado nuestra cartera. Ahora tenemos que llamar a nuestro contrato desde la web usando las credenciales a las que tenemos acceso ahora desde Metamask.

¿Recuerdas? Nuestro smart contract tiene una función que recupera el número total de saludos.

```solidity
  function getTotalWaves() public view returns (uint256) {
      console.log("Tenemos un total de %d saludos!", totalWaves);
      return totalWaves;
  }
```

Vamos a llamar a esta función desde nuestra web :).

Adelante, escribe esta función justo debajo de nuestra función `connectWallet()`.

```javascript
const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Recuperado el recuento total de saludos...", count.toNumber());
      } else {
        console.log("¡El objeto Ethereum no existe!");
      }
    } catch (error) {
      console.log(error)
    }
}
```

Explicación rápida aquí:

```javascript
const provider = new ethers.providers.Web3Provider(ethereum);
const signer = provider.getSigner();
```

`ethers` es una librería que ayuda a nuestro frontend a hablar con nuestro contrato. Asegúrate de importarla al principio usando `import { ethers } from "ethers";`.

Un "Provider" es lo que usamos para hablar con los nodos de Ethereum. ¿Recuerdas que usamos Alchemy para **desplegar**? Bueno, en este caso usamos nodos que Metamask proporciona en segundo plano para enviar/recibir datos de nuestro contrato desplegado.

[Aquí hay](https://docs.ethers.io/v5/api/signer/#signers) un enlace que explica lo que es un signer en la línea 2.

Conecta esta función a nuestro botón wave actualizando `onClick` de `null` a `wave`:

```html
<button className="waveButton" onClick={wave}>
    Salúdame
</button>
```

Impresionante.

Bueno, ahora mismo este código **no termina de funcionar**. En nuestro replit shell dirá:

![](https://i.imgur.com/JP2rryE.png)

¡Necesitamos esas dos variables!

Entonces ¿Recuerdas cuando desplegaste tu contrato y te dije que guardaras la dirección? ¡Esto es lo que está pidiendo!

Pero ¿qué es un ABI? Mucho antes mencioné cómo cuando compilas un contrato, éste crea un montón de archivos para ti bajo `artifacts`. Un ABI es uno de esos archivos.

🏠 Estableciendo la dirección de tu contrato
-----------------------------
 
¿Recuerdas cuando desplegaste tu contrato en la Rinkeby Testnet (flipante, por cierto)? El resultado de ese despliegue incluía la dirección de tu smart contract que debería ser algo así:

```
Desplegando contrato con la cuenta: 0xF79A3bb8d5b93686c4068E2A97eAeC5fE4843E7D
Saldo de la cuenta: 3198297774605223721
Dirección de WavePortal: 0xd5f08a0ae197482FA808cE84E00E97d940dBD26E
```

Tienes que acceder a esto en tu aplicación React. Es tan fácil como crear una nueva propiedad en tu archivo `App.js` llamada `contractAddress` y establecer su valor al  `WavePortal address` que se imprime en tu consola:

```javascript
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  /**
   * ¡Crea aquí una variable que contenga la dirección del contrato desplegado!
   **/
  const contractAddress = "0xd5f08a0ae197482FA808cE84E00E97d940dBD26E";
```

🛠 Obtener el contenido del archivo ABI
---------------------------
**¿Prefieres verme probando esto? ¡Echa un vistazo al vídeo de abajo!**
[Loom](https://www.loom.com/share/ddecf3caf54848a3a01edd740683ec48)

Fíjate, ¡ya estás a mitad de camino! Volvamos a nuestra carpeta de smart contracts.

Cuando compilas tu smart contract, el compilador escupe un montón de archivos que te permiten interactuar con el contrato. Puedes encontrar estos archivos en la carpeta `artifacts` ubicada en la raíz de tu proyecto de Solidity.

El archivo ABI es algo que nuestra aplicación web necesita para saber cómo comunicarse con nuestro contrato. Lee sobre esto [aquí](https://docs.soliditylang.org/en/v0.5.3/abi-spec.html).

El contenido del archivo ABI se puede encontrar en un archivo JSON en tu proyecto de Solidity:

`artifacts/contracts/WavePortal.sol/WavePortal.json`.


Entonces, la pregunta es ¿cómo podemos introducir este archivo JSON en nuestro frontend? ¡Para este proyecto vamos a hacer un poco de la vieja "copy pasta"!

Copia el contenido de `WavePortal.json` y luego dirígete a tu aplicación web. Vas a crear una nueva carpeta llamada `utils` bajo `src`. En `utils` crea un archivo llamado `WavePortal.json`. La ruta tiene que ser así:

`src/utils/WavePortal.json`


¡Pega todo el archivo JSON ahí!


Ahora que tienes tu archivo con todo el contenido ABI listo, es el momento de importarlo a tu archivo `App.js` y crear una referencia a él. Justo debajo de donde importaste `App.css` importa tu archivo JSON y crea tu referencia al contenido abi:


```javascript
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  
  const contractAddress = "0xd5f08a0ae197482FA808cE84E00E97d940dBD26E";
  /**
   * ¡Crea aquí una variable que haga referencia al contenido del abi!
   */
  const contractABI = abi.abi;
```
Echemos un vistazo a donde se utiliza realmente este contenido ABI:

```javascript
const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        /*
        * Aquí se utiliza contractABI
        */
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Recuperado el recuento total de saludos...", count.toNumber());
      } else {
        console.log("¡El objeto Ethereum no existe!");
      }
    } catch (error) {
      console.log(error)
    }
  }
  ```

Una vez que agregues ese archivo y hagas clic en el botón "Wave" -- **estarás leyendo oficialmente los datos de tu contrato en la blockchain a través de tu cliente web**. 

📝 Escribir datos
---------------

El código para escribir datos en nuestro contrato no es súper diferente al de la lectura de datos. La principal diferencia es que cuando queremos escribir nuevos datos en nuestro contrato, tenemos que notificar a los mineros para que la transacción pueda ser minada. Cuando leemos datos, no necesitamos hacer esto. Las lecturas son "gratuitas" porque todo lo que estamos haciendo es leer de la blockchain, **no la estamos cambiando.**

Aquí está el código que usaremos para saludar:

```javascript
const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Recuperado el recuento total de saludos...", count.toNumber());

        /*
        * Ejecutar el wave real de tu smart contract
        */
        const waveTxn = await wavePortalContract.wave();
        console.log("Minando...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Minado completado...", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Recuperado el recuento total de saludos...", count.toNumber());
      } else {
        console.log("¡El objeto Ethereum no existe!");
      }
    } catch (error) {
        console.log(error)
    }
  }
```

Bastante simple, ¿verdad :)?

Lo impresionante aquí es que mientras la transacción está siendo minada puedes imprimir el hash de la transacción, copiar/pegar en [Etherscan](https://rinkeby.etherscan.io/), y ver cómo se procesa en tiempo real :).

Cuando ejecutamos esto, verás que el recuento total de saludos se incrementa en 1. También verás que Metamask nos aparece y nos pide que paguemos "gas", el cual pagamos usando nuestros $ falsos. Hay un gran artículo sobre esto [aquí](https://ethereum.org/en/developers/docs/gas/). Intenta averiguar qué es el gas :).

🎉 ¡Está vivo!
----------

**NICEEEEEEE :).**

Esto pinta bien. Ahora tenemos un cliente real que puede leer y escribir datos en la blockchain. A partir de aquí, puedes hacer lo que quieras. Ya tienes lo básico. Puedes construir una versión descentralizada de Twitter. Puedes construir una forma de que la gente publique sus memes favoritos y permitir que la gente "dé propinas" con ETH a las personas que publiquen los mejores memes. Puedes construir un sistema de votación descentralizado que un país pueda utilizar para votar a un político donde todo sea abierto y claro. 

Las posibilidades son realmente infinitas.

🚨 Antes de hacer clic en "Next Lesson"
-------------------------------------------

*Nota: si no haces esto, Farza estará muy triste :(.*

Personaliza un poco tu sitio para mostrar el número total de saludos. Tal vez puedes mostrar una barra de carga mientras el saludo se está minando, lo que quieras. ¡Haz algo un poco diferente!

Una vez que sientas que estás listo, comparte el enlace a tu sitio web con nosotros en #progress para que podamos conectar nuestras carteras y saludarte :).

🎁 Repasemos
--------------------

Estás en camino de conquistar la web descentralizada. IMPRESIONANTE. ¡Echa un vistazo a todo el código que has escrito en esta sección visitando [este enlace](https://gist.github.com/adilanchian/71890bf4fcd8f78e94c77cf694b24659) para asegurarte de que vas por buen camino con tu código!
