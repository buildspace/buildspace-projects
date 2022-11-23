## 📦 Almacena los datos.

A partir de aquí vamos a ir agregando magia a nuestro contrato.

Queremos tener la posibilidad de que alguien nos envíe un saludo y sea almacenado en el contrato.

Así que necesitamos una función que nos ayude a hacer esto que buscamos.

La Cadena de Bloques piensa en ella como un proveedor de almacenamiento en la nube algo así como AWS, pero sin un único dueño y que funciona mediante el poder computacional de procesamiento de máquinas de minería en todo el mundo. A los que hacen esto les llamamos mineros y son los que reciben un pago cuando nosotros ejecutamos nuestro código.
Un contrato inteligente es como el código de nuestro servidor y que ejecuta distintas funciones que las personas pueden utilizar.

Entonces, este es el contrato actualizado que usaremos para “almacenar” saludos.

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;

    constructor() {
        console.log("Hey hey soy un contrato y soy inteligente");
    }

    function wave() public {
        totalW
        aves += 1;
        console.log("%s ha enviado un saludo", msg.sender);
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("Tenemos %d saludos totales", totalWaves);
        return totalWaves;
    }
}
```

¡¡Boom!!

Así es como se escribe una función en Solidity, también añadimos una variable `totalWaves` que automáticamente se inicializa en cero. Esta variable es especial porque es una “variable de estado” y eso es muy bueno porque se almacena de forma permanente en el contrato.

También hay magia aquí con `msg.sender`, aquí estará la dirección pública de la cartera digital del usuario que ejecuta la función. ¡Es increíble! es una autenticación integrada ya que podremos saber exactamente quien ejecuta la función porque para poder ejecutarla debiste haber conectado una cartera digital válida.

Más adelante podríamos escribir funciones en las que sólo determinadas carteras digitales podrían utilizar. Por ejemplo, podríamos modificar esta función para que sólo direcciones autorizadas puedan enviarnos un saludo o tal vez para que sólo tus amigos puedan enviarte saludos.

## ✅ Actualizando run.js para llamar a nuestras funciones.

¡Necesitamos hacer cambios en `run.js`!

¿Por qué?

Pues porque necesitamos llamar de manera manual a las funciones que hemos creado.
Básicamente, cuando desplegamos nuestro contrato a la cadena de bloques ( que es lo que hacer cuando ejecutamos `waveContractFactory.deploy()`) nuestras funciones se vuelven disponibles en la cadena de bloques porque usamos la palabra clave **public** o público en nuestra función.
Piensa que es como punto final de una API pública.

Ahora vamos a hacer pruebas en estas funciones:

```javascript
const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();

  console.log("Contrato desplegado en:", waveContract.address);
  console.log("Contrato desplegado por:", owner.address);

  let waveCount;
  waveCount = await waveContract.getTotalWaves();

  let waveTxn = await waveContract.wave();
  await waveTxn.wait();

  waveCount = await waveContract.getTotalWaves();
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

**El editor de código VSCode va a auto-importar `ethers`. No es necesario que importemos `ethers`, así que asegurate que no lo estés importando, ¿recuerdas de lo que hablamos la lección anterior acerca de HRE?**

## 🤔 ¿Y esto cómo funciona?

```javascript
const [owner, randomPerson] = await hre.ethers.getSigners();
```

Para implementar algo en la cadena de bloques necesitamos la dirección de una cartera digital. Hardhat hace esto por nosotros, además tomamos la dirección de la cartera del dueño del contrato y también tomé la dirección de una billetera aleatoria y la llamamos `randomPerson`. Esto hará sentido en un momento más.

También le añadimos:

```javascript
console.log("Contrato desplegado por:", owner.address);
```

Hice esto porque quiero ver la dirección de la persona que desplegó nuestro contrato. ¡Es que soy curioso!

Lo último que le añadí es:

```javascript
let waveCount;
waveCount = await waveContract.getTotalWaves();

let waveTxn = await waveContract.wave();
await waveTxn.wait();

waveCount = await waveContract.getTotalWaves();
```

Tenemos que llamar nuestras funciones manualmente, como cualquier API normal. Primero, llamo la función que nos dice el número de saludos totales, Después realizo un saludo y finalmente utilizo el waveCount o conteo de saludos una vez más para ver si ha cambiado.

Corremos el código como siempre:

```bash
npx hardhat run scripts/run.js
```
Éste es el resultado:

![](https://i.imgur.com/NgfOns3.png)

 ¿Bastante asombroso verdad?
 
También puedes ver la dirección de la cartera que envío un saludo y la que desplegó el contrato, en este caso ¡me saludé a mí mismo!

Así que:\
1\.	Llamamos a nuestra función de saludos.\
2\.	Hicimos cambios en la variable de estado.\
3\.	Leemos el nuevo valor de la variable.

Esto es prácticamente la base de la mayoría de los contratos inteligentes. Leer funciones y escribir funciones además de hacer cambios en la variable de estado. Ya tenemos los componentes básicos que necesitamos para poder seguir trabajando en nuestra aplicación.
Muy pronto vamos a poder llamar estas funciones, pero desde nuestra aplicación React en la que vamos a trabajar.

## 🤝 Hagamos pruebas con otros usuarios.

¿Vamos a necesitar de alguien más para que nos envié un saludo verdad? Sería muy aburrido que sólo pudiéramos enviar un saludo y ya. ¡Queremos que nuestro sitio web sea **multijugador**!

Miren esto. Añadí unas cuantas líneas de código al final de la función (si tienes dudas puedes hacer tus preguntas en #general-chill-chat). Pero básicamente esto es como podemos hacer simulaciones de que otras personas usan nuestras funciones. Observa las direcciones que aparecerán en tu terminal una vez que agregues este código y lo ejecutes.

```javascript
const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();

  console.log("Contrato desplegado en:", waveContract.address);
  console.log("Contrato desplegado por:", owner.address);

  let waveCount;
  waveCount = await waveContract.getTotalWaves();

  let waveTxn = await waveContract.wave();
  await waveTxn.wait();

  waveCount = await waveContract.getTotalWaves();

  waveTxn = await waveContract.connect(randomPerson).wave();
  await waveTxn.wait();

  waveCount = await waveContract.getTotalWaves();
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

Los elementos nuevos añadidos a este bloque de código son:

```javascript
waveTxn = await waveContract.connect(randomPerson).wave();
await waveTxn.wait();

waveCount = await waveContract.getTotalWaves();
```

## 🚨 Antes de pasar a la siguiente lección.

*Nota: si no haces esto Farza se pondrá muy triste :(.*

¡Personaliza tu código! Tal vez quieras almacenar algún otro dato, Haz algo distinto. ¿Quizás quieras almacenar la dirección del remitente en un arreglo? 
¿Quizás quieras almacenar un mapa de las direcciones y el conteo de saludos para que puedas saber quienes son los usuarios que más te saludan? 
Inclusive si tan sólo cambias el nombre de las variables y las funciones. ¡Haz cambios! No sólo copies lo que yo hice. 
Piensa que esto es tu sitio web con la funcionalidad que tu quieres. Construye la funcionalidad que **quieres que tu sitio tenga**.

Una vez que termines, asegúrate de publicar una captura de pantalla de tu terminal con el resultado final en #progress.

📝Tu respuesta.
🤔 Mándanos algunos comentarios.
¿Qué es lo que más te gusta acerca de Buildspace y que es lo que te gustaría se cambiara?
