📦 ¡Guarda los datos!
------------------

A partir de aquí, vamos a añadir algo de fantasía a nuestro contrato.

Queremos ser capaces de dejar que alguien nos salude y luego almacenar ese saludo.

¡Así que lo primero que necesitamos es una función que puedan usar para saludarnos!

La blockchain = Piensa en ella como un proveedor de la nube, algo así como AWS, pero no es de nadie. Se ejecuta por la potencia de cálculo de las máquinas de minería en todo el mundo. Normalmente estas personas se llaman mineros y les pagamos para que ejecuten nuestro código.

Un smart contract = Algo así como el código de nuestro servidor con diferentes funciones que la gente puede llamar.

Así que, aquí está nuestro contrato actualizado que podemos usar para "almacenar" saludos.

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;

    constructor() {
        console.log("Yo yo, soy un contrato y soy inteligente");
    }

    function wave() public {
        totalWaves += 1;
        console.log("%s ha saludado!", msg.sender);
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("Tenemos un total de %d saludos!", totalWaves);
        return totalWaves;
    }
}
```

¡Boom!

Así es como se escribe una función en Solidity. Y, también añadimos una variable, `totalWaves`, que automáticamente se inicializa a 0. Pero, esta variable es especial porque se llama una "variable de estado" y es genial porque se almacena permanentemente en el almacenamiento del contrato.

También usamos algo de magia aquí con `msg.sender`. Esta es la dirección de la cartera de la persona que llamó a la función. ¡Esto es increíble! Es como una autenticación incorporada. Sabemos exactamente quién llamó a la función porque para llamar a una función de smart contract, necesitas estar conectado con una cartera válida.

En el futuro, podemos escribir funciones a las que sólo puedan acceder ciertas direcciones de billetera. Por ejemplo, podemos cambiar esta función para que sólo nuestra dirección pueda enviar un saludo. ¡O, tal vez, hacer que sólo tus amigos pueden saludarte!

✅ Actualizar run.js para llamar a nuestras funciones
---------------------------------------

¡Así que, `run.js` tiene que cambiar!

¿Por qué?

Bueno, necesitamos llamar manualmente a las funciones que hemos creado.

Básicamente, cuando desplegamos nuestro contrato en la blockchain (lo que hacemos cuando ejecutamos `waveContractFactory.deploy()`) nuestras funciones están disponibles para ser llamadas en la blockchain porque hemos utilizado esa palabra clave especial **public** en nuestra función.

Piensa en esto como un endpoint de la API pública :).

¡Así que ahora queremos probar esas funciones específicamente!

```javascript
const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
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
**VSCode podría autoimportar `ethers`. No necesitamos importar `ethers`. Así que, asegúrate de no tener importaciones. ¿Recuerdas lo que hablamos en la última lección sobre hre?**

🤔 ¿Cómo funciona?
-----------------

```javascript
const [owner, randomPerson] = await hre.ethers.getSigners();
```

Para poder desplegar algo en la blockchain, ¡necesitamos tener una dirección de cartera! Hardhat lo hace por nosotros mágicamente en segundo plano, pero aquí he cogido la dirección de cartera del propietario del contrato y también he cogido una dirección de cartera aleatoria y la he llamado `randomPerson`. Esto tendrá más sentido en un momento.

También he añadido:

```javascript
console.log("Contrato desplegado por:", owner.address);
```

Lo hago para ver la dirección de la persona que despliega nuestro contrato. Soy curioso.

Lo último que he añadido es esto

```javascript
let waveCount;
waveCount = await waveContract.getTotalWaves();

let waveTxn = await waveContract.wave();
await waveTxn.wait();

waveCount = await waveContract.getTotalWaves();
```

Básicamente, ¡tenemos que llamar manualmente a nuestras funciones! Al igual que lo haríamos con cualquier API normal. Primero llamo a la función para obtener el número de saludos totales. Luego, hago el saludo. Finalmente, tomo el waveCount una vez más para ver si ha cambiado.

Ejecuta el script como lo harías normalmente:

```bash
npx hardhat run scripts/run.js
```

Aquí está mi resultado:

![](https://i.imgur.com/NgfOns3.png)

Bastante impresionante, ¿eh :)?

También puedes ver que la dirección de la cartera que saludó es igual a la dirección que desplegó el contrato. ¡Me saludé a mí mismo!

Así que nosotros:\
1\. Llamamos a nuestra función de saludo.\
2\. Cambiamos la variable de estado.\
3\. Leímos el nuevo valor de la variable.

Esta es prácticamente la base de la mayoría de los smart contract. Leer funciones. escribir funciones y cambiar una variable de estado. Ahora tenemos la base que necesitamos para seguir trabajando en nuestro épico WavePortal.

Muy pronto, podremos llamar a estas funciones desde nuestra aplicación de react :).


🤝 Prueba de otros usuarios
--------------------

Probablemente queramos que alguien más que nosotros nos envíe un saludo ¿verdad? ¡¡Sería bastante aburrido si sólo pudiéramos enviar un saludo!! ¡Queremos hacer nuestra web **multijugador**!

Mira esto. He añadido unas líneas al final de la función. No voy a explicarlo mucho (pero por favor, haced preguntas en #general-chill-chat). Básicamente esto es como podemos simular que otras personas llaman a nuestras funciones :). Vigila las direcciones de la cartera en tu terminal una vez que cambies el código y lo ejecutes.

```javascript
const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();

  console.log('Contrato desplegado en:', waveContract.address);
  console.log('Contrato desplegado por:', owner.address);

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

Los nuevos elementos añadidos a este bloque de código son:

```javascript
waveTxn = await waveContract.connect(randomPerson).wave();
await waveTxn.wait();

waveCount = await waveContract.getTotalWaves();
```

🚨 Antes de hacer click en "Next Lesson"
-------------------------------------------

*Nota: si no haces esto, Farza se pondrá muy triste :(.*

¡¡Personaliza un poco tu código!! ¿Quizás quieras guardar algo más? Quiero que improvises. ¿Quizás quieras almacenar la dirección del remitente en un array? ¿Quizás quieras almacenar un diccionario de direcciones y recuentos de saludos para llevar la cuenta de quién te saluda más? Incluso si sólo cambias los nombres de las variables y los nombres de las funciones para que sean algo que te parezca interesante, es un gran progreso. Intenta no copiarme directamente. Piensa en tu sitio web final y en el tipo de funcionalidad que quieres. Construye la funcionalidad **que quieres**.

Una vez que hayas terminado, asegúrate de publicar una captura de pantalla del resultado de tu terminal en #progress.
