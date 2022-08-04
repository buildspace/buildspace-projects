## 📒 Leer desde la cadena de bloques a través de nuestro sitio web.

Increíble. ¡Lo logramos! Implementamos nuestro sitio web. También implementamos nuestro contrato y también ya conectamos nuestra cartera digital. 
Ahora necesitamos llamar a nuestro contrato desde nuestro sitio web usando las credenciales a las que tenemos acceso desde Metamask.

Nuestro contrato inteligente tiene implementada esta función que recupera el número total de saludos.

```solidity
  function getTotalWaves() public view returns (uint256) {
      console.log("We have %d total waves!", totalWaves);
      return totalWaves;
  }
```
Ahora vamos a llamar esta función desde nuestro sitio web.
Continuemos y escribamos esta función justo debajo de nuestra función `connectWallet()`

```javascript
const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
}
```
Breve explicación a continuación:

```javascript
const provider = new ethers.providers.Web3Provider(ethereum);
const signer = provider.getSigner();
```
`ethers` is una librería que ayuda a nuestra interfaz a comunicarse con nuestro contrato inteligente. 
Es importante que te asegures de importarla escribiendo hasta arriba usando: `import { ethers } from "ethers";`.

Un "Proveedor" es lo que usamos para comunicarnos con los nodos de Ethereum. ¿Recuerdas cómo usábamos QuickNode para **implementar**? 
Bueno, en este caso usamos nodos que Metamask proporciona en segundo plano para enviar/recibir datos de nuestro contrato implementado.

[Aquí](https://docs.ethers.io/v5/api/signer/#signers) hay un link que nos explica que es un “signer” firmante en la línea de código 2.

Conectamos esta función a nuestro botón de saludos actualizando y modificando la propiedad `onClick` de `null` a `wave`:

```html
<button className="waveButton" onClick={wave}>
    Wave at Me
</button>
```
Increíble.
Bueno este código **está roto** en Replit sale lo siguiente:

![](https://i.imgur.com/JP2rryE.png)

¡Necesitamos esas dos variables!

Bueno la dirección del contrato ya la tenemos ¿recuerdas? ¿Cuándo implementamos nuestro contrato y te comenté que guardaras esa dirección? 
Bueno esa es la que necesitamos.
Pero ¿qué es ABI? Hace varias lecciones te comenté que cuando compilas un contrato eso crea muchos archivos en el directorio `artifacts`. 
Un archivo ABI es uno de ellos.

## 🏠 Configuración de la dirección de su contrato.

Recuerdas cuando implementamos el contrato a la red de pruebas Rinkeby. Uno de los resultados que obtuvimos fue la dirección del contrato inteligente, 
el cual se ve así:

```
Deploying contracts with the account: 0xF79A3bb8d5b93686c4068E2A97eAeC5fE4843E7D
Account balance: 3198297774605223721
WavePortal address: 0xd5f08a0ae197482FA808cE84E00E97d940dBD26E
```
Debemos darle acceso a nuestra aplicación de React, y es tan fácil como crear una nueva propiedad en `App.js` un archivo llamado `contractAddress` y 
configurar el valor a la dirección de `WavePortal address` que aparece en la consola:

```javascript
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  /**
   * Create a variable here that holds the contract address after you deploy!
   */
  const contractAddress = "0xd5f08a0ae197482FA808cE84E00E97d940dBD26E";
```
## 🛠 Obtengamos el contenido del archivo ABI.

¡Mira nada más! Hemos avanzado más de la mitad del camino, ahora regresemos a la carpeta de nuestro contrato inteligente.

Cuando compilas tu contrato inteligente, el compilador arroja una gran cantidad de archivos que se utilizan para interactuar con el contrato. 
Estos archivos los podrás encontrar en directorio `artifacts` el cual está localizado en la raíz de nuestro proyecto de Solidity.

El archivo ABI es algo que nuestra aplicación necesita para saber como comunicarse con nuestro contrato. 
Puedes leer más sobre este tema [aquí](https://docs.soliditylang.org/en/v0.5.3/abi-spec.html).

El contenido del archivo ABI se puede encontrar en un archivo JSON en el proyecto de hardhat.

`artifacts/contracts/WavePortal.sol/WavePortal.json`

Entonces, la pregunta es ¿cómo obtenemos este archivo JSON en nuestra interfaz? ¡Para este proyecto vamos a hacer "copiar y pegar"!

Copia el contenido de `WavePortal.json y luego vamos a la aplicación web. Vas a crear una nueva carpeta llamada `utils` en `src`. 
En `utils`, crea un archivo llamado`WavePortal.json`. Así que la ruta completa se verá así:

`src/utils/WavePortal.json`

¡Pega el archivo JSON aquí!

Ahora que ya tienes el archivo con todo el contenido del archivo ABI listo para ser usado, es momento de importar el archivo `App.js` y crear una referencia a él. 
Debajo de donde importaste `App.css` ahí importa el archivo JSON y crea una referencia al contenido del archivo ABI.

```javascript
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/WavePortal.json";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");

  const contractAddress = "0xd5f08a0ae197482FA808cE84E00E97d940dBD26E";
  /**
   * Create a variable here that references the abi content!
   */
  const contractABI = abi.abi;
```
Observemos dónde está utilizando realmente este contenido de ABI:

```javascript
const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        /*
        * You're using contractABI here
        */
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }
  ```
Una vez que agregues ese archivo y hagas click en el botón "Wave", **estarás leyendo oficialmente los datos de su contrato en la cadena de bloques 
a través del cliente web**.

## 📝Escribiendo los datos

El código para escribir datos en nuestro contrato no es muy diferente al de leer datos. 
La diferencia más importante es que cuando queremos escribir nuevos datos en nuestro contrato, debemos notificar a los mineros para que se pueda minar la 
transacción y cuando leemos datos, no necesitamos hacer esto. Las lecturas son "gratuitas" porque todo lo que estamos haciendo es leer de la cadena de bloques, 
** no lo estamos cambiando. **

Aquí está el código para saludar:

```javascript
const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
        * Execute the actual wave from your smart contract
        */
        const waveTxn = await wavePortalContract.wave();
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }
```
¿Bastante simple verdad?
Lo increíble aquí es que, mientras se mina la transacción, puede ver el hash de la transacción, copiarlo/pegarlo en [Etherscan](https://rinkeby.etherscan.io/) 
y ver cómo se procesa en tiempo real :).

Cuando ejecutamos esto, verás que el recuento total de saludos aumenta en 1. También podrás ver que Metamask nos pide que paguemos "gas", 
que pagamos con nuestro dinero falso. Hay un gran artículo sobre esto [aquí](https://ethereum.org/en/developers/docs/gas/). Intenta averiguar qué es el gas :).

## 🎉Éxito.

**BUENÍSIMO :).**

Son cosas realmente buenas. Ahora tenemos un cliente real que puede leer y escribir datos en la cadena de bloques. Desde aquí, podrás hacer lo que quieras. 
Tienes lo básico para lograrlo. Puedes construir una versión descentralizada de Twitter. Puedes crear algo para que las personas publiquen sus memes favoritos 
y permitir que las personas "den propinas" con ETH a los que publican los mejores memes. Puedes construir un sistema de votación descentralizado que un país 
puede usar para votar de forma abierta y clara.

Las posibilidades son realmente infinitas.

## 🚨 Antes de que avances a la “siguiente lección”.

*Nota: Si no haces esto Farza estará muy triste. :(*

Personaliza todo lo que quieras tu sitio para mostrar el número total de saludos. Tal vez muestre una barra de carga mientras se extrae el saludo, lo que quieras. 
¡Haz algo un poco diferente!
Una vez que creas que ya está listo, compártenos el enlace a tu sitio web en #progress para que podamos conectar nuestras billeteras y saludarte :).

## 🎁 Un regalo.

Estas por buen camino a conquistar la web descentralizada. IMPRESIONANTE. 
Echa un vistazo a todo el código que escribiste en esta sección visitando [este enlace](https://gist.github.com/adilanchian/71890bf4fcd8f78e94c77cf694b24659) 
para asegurarte de que está al día con tu código.
