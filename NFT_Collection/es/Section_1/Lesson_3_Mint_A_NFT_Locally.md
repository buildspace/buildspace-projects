## 📝 Escribe tu contrato inicial.
*Nota: Si ya sabes cómo hacer muchas de las cosas en esta sección del proyecto "WavePortal" que ejecutamos en el pasado, ¡increíble! Superarás esto rápidamente :). Por qué gran parte de las actividades se repiten.*
Hagamos limpieza.
Queremos eliminar todo el código de inicio que generamos al compilar. ¿Por qué? ¡Pues porque vamos a escribir todo esto nosotros mismos! Así que elimina el archivo `sample-test.js` en `test`. Además, elimina `sample-script.js` en `scripts`. Luego, elimine `Greeter.sol` en `contracts`. **¡No vayas a eliminar las carpetas, sólo los archivos!**
Ahora, abre el proyecto en VSCode y vamos a empezar a escribir nuestro contrato NFT. Si nunca ha escrito un contrato inteligente, no te preocupe. **Solo sígueme. Googlea las cosas que no entiendes. Haz preguntas en Discord.**
Crea un archivo llamado `MyEpicNFT.sol` en el directorio `contracts`. La estructura de los archivos es super importante cuando utilizamos hardhat así que ten cuidado al hacerlo.
Nota: Yo recomiendo descargar la extensión de [Solidity](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity) para VSCode la cual brinda que la sintaxis resalte y es útil.
Siempre me gusta comenzar con un contrato inteligente realmente básico, solo para que las cosas vayan funcionando.
```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.1;
import "hardhat/console.sol";
contract MyEpicNFT {
    constructor() {
        console.log("This is my NFT contract. Whoa!");
    }
}
```

Nota: A veces, VSCode nos arroja errores que no son reales, por ejemplo, puede mostrar acerca de la importación de Hardhat y decir que no existe. Esto sucede porque el compilador de global de Solidity no está configurado adecuadamente de manera local. Si no sabes cómo solucionar esto, no te preocupes. Ignoremos esto por ahora. También te recomiendo que no uses la terminal de VSCode, ¡utiliza tu propia terminal! A veces, la terminal de VSCode da problemas si el compilador no está bien configurado.
Vamos a explicar línea por línea.
```solidity
// SPDX-License-Identifier: UNLICENSED
```
Esto es sólo un comentario elegante, es el identificador de licencia SPDX, puedes leer sobre esto [aquí](https://spdx.org/licenses/).
```solidity
pragma solidity ^0.8.1;
```
Esta es la versión del compilador de Solidity que queremos que nuestro contrato utilice. Básicamente lo que significa es “cuando ejecutes este código, solamente quiero usar un compilador de Solidity que sea versión 0.8.1 o mayor, pero, no más de 0.9.0. Nota, asegúrate que el compilador que vas a utilizar esta configurado adecuadamente (versión 0.8.1) en `hardhat.config.js`.
```solidity
import "hardhat/console.sol";
```
La magia que nos da Hardhat nos permite hacer algunos console logs en nuestro contrato. De hecho, es muy desafiante depurar contratos inteligentes, pero este es uno de los beneficios que Hardhat nos brinda para hacernos la vida más fácil.
```solidity
contract MyEpicNFT {
    constructor() {
        console.log("This is my NFT contract. Whoa!");
    }
}
```

Los contratos inteligentes se ven como una clase en otros lenguajes de programación. Una vez que inicialicemos el contrato el constructor se ejecutará e imprimirá esa línea. Por favor, personaliza y haz que esa línea diga lo que quieras. Diviértete un poco con eso.
## 😲 ¿Cómo lo ejecutamos?
Impresionante: ¡tenemos un contrato inteligente! Pero, no sabemos si funciona. Lo que necesitamos realmente es:
1.	Compilarlo.
2.	Implementarlo en nuestra cadena de bloques local.
3.	Una vez hecho esto, ejecutar el console.log.
Vamos a escribir un script que manejará estos 3 pasos para nosotros.
Dirígete al directorio `scripts` y crea un archivo al que llamaremos `run.js`. Esto es lo que `run.js` va a tener en su interior:

```javascript
const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory('MyEpicNFT');
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);
};
const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
runMain();
```
## 🤔 ¿Cómo funciona?
**Nota: VSCode auto importará ethers. No necesitamos importar ethers nosotros.**
Nuevamente revisemos línea por línea.
```javascript
const nftContractFactory = await hre.ethers.getContractFactory("MyEpicNFT");
```
Esto realmente compilará nuestro contrato y generará los archivos necesarios que necesitamos para trabajar con nuestro contrato en el directorio `artifacts`. Ve a verlo después de ejecutar esto :).
```javascript
const nftContract = await nftContractFactory.deploy();
```
Esto es bastante elegante :).
Lo que sucede aquí es que Hardhat creará una red Ethereum local para nosotros, pero solo para este contrato. Luego, después de que se complete el script, destruirá esa red local. Entonces, cada vez que ejecute el contrato, será una cadena de bloques nueva. ¿Cuál es el punto? Es como actualizar su servidor local cada vez, por lo que siempre comienza desde cero, lo que facilita la depuración de errores.
```javascript
await nftContract.deployed();
```
¡Nuestro contrato inteligente será oficialmente minado y se implementará en nuestra cadena de bloques local! Así es, hardhat creará "mineros" falsos en tu computadora para imitar la cadena de bloques real.
¡Nuestro `constructor` se ejecutará cuando este implementado el contrato inteligente!
```javascript
console.log("Contract deployed to:", nftContract.address);
```
Finalmente, una vez implementado, `nftContract.address` nos dará la dirección del contrato implementado. Esta dirección es con la que podremos encontrar nuestro contrato en la cadena de bloques. En este momento, en nuestra cadena de bloques local, solo somos nosotros. Entonces, esto no es tan genial.

Pero hay millones de contratos en la cadena de bloques real. ¡Entonces, esta dirección nos brinda fácil acceso al contrato con el que estamos interesados en trabajar! Esto será útil cuando implementemos la cadena de bloques real en unas pocas lecciones.
## 💨 Ejecútalo
Antes de ejecutar esto, asegúrate de cambiar `solidity: "0.8.4",` a `solidity: "0.8.1",` en `hardhat.config.js`.
Vamos a ejecutarlo, abre tu terminal y ejecuta lo siguiente:
```bash
npx hardhat run scripts/run.js
```
¡Veremos `console.log` ejecutarse desde el contrato y luego también veremos la dirección del contrato impresa! Esto es lo que obtendrás:
![Untitled](https://i.imgur.com/CSBimfv.png)
## 🎩 Hardhat y HRE
En estos bloques de código notarás constantemente que utilizamos `hre.ethers`, pero hre nunca se importa de ningún lugar. ¿qué tipo de brujería es esto?
De la documentación de hardhat podemos encontrar esto:
> Hardhat Runtime Environment, o HRE para abreviar, es un objeto que contiene toda la funcionalidad de Hardhat cuando ejecuta una tarea, prueba o script. En realidad, Hardhat es el HRE.
¿Qué significa esto? Que cada ocasión que ejecutas un comando en terminal que comience con `npx hardhat` vas a obtener un objeto hre construido sobre la marcha utilizando `hardhat.config.js` especificado en el código. Esto significa que nunca tendrá que hacer algún tipo de importación en los archivos como:
`const hardhat = require("hardhat")`
**Demasiado largo, no lo he leído – irás viendo que aparecerá hre muy seguido en el código, pero nunca será importará a ningún lado. ¡Revisa esta interesante [documentación de Hardhat](https://hardhat.org/advanced/hardhat-runtime-environment.html) para obtener más información al respecto!**
## 🚨 Reporte de avances
Publica una imagen en #progress con el resultado obtenido de `npx hardhat run scripts/run.js` :)
