📦 ¡Almacenar los datos!
------------------

A partir de aquí, agreguemos algo de fantasía a nuestro contrato.

Queremos poder dejar que alguien nos salude y luego almacenar ese saludo.

Entonces, ¡lo primero que necesitamos es una función que puedan usar para saludarnos!

Blockchain = Piensa en él como un proveedor en la nube, algo así como AWS, pero no es propiedad de nadie. Funciona con la potencia informática de las máquinas mineras de todo el mundo. Por lo general, estas personas se llaman mineros y les pagamos para que ejecuten nuestro código.

Un contrato inteligente = algo así como el código de nuestro servidor con diferentes funciones que la gente puede acceder.

Entonces, aquí está nuestro contrato actualizado para que podemos usar para "almacenar" saludos.

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;

    constructor() {
        console.log("Yo yo, I am a contract am I am smart");
    }

    function wave() public {
        totalWaves += 1;
        console.log("%s has waved!", msg.sender);
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }
}
```

¡Boom!

Entonces, así es como se escribe una función en Solidity. Y también agregamos una variable `totalWaves` que se inicializa automáticamente a 0. Pero esta variable es especial porque se llama "variable de estado" y es genial porque se almacena permanentemente en el almacenamiento del contrato.

También usamos algo de magia aquí con `msg.sender`. Esta es la dirección de billetera de la persona que llamó a la función. ¡Esto es asombroso! Es como una autenticación integrada. Sabemos exactamente quién llamó a la función porque para llamar a una función de un contrato inteligente, ¡se debe estar conectado con una billetera válida!

En el futuro, podemos escribir funciones a las que solo pueden acceder determinadas direcciones de billetera. Por ejemplo, podemos cambiar esta función para que solo nuestra dirección pueda enviar un saludo. ¡O tal vez donde solo tus amigos puedan saludarte!

✅ Actualizando run.js para llamar a nuestras funciones
---------------------------------------

¡Entonces, `run.js` necesita cambiar!

¿Por qué?

Bueno, necesitamos llamar manualmente a las funciones que hemos creado.

Básicamente, cuando desplegamos nuestro contrato en la blockchain (lo que hacemos cuando ejecutamos `waveContractFactory.deploy ()`), nuestras funciones están disponibles para ser llamadas en la blockchain porque usamos esa palabra clave especial **pública** en nuestra función.

Piense en esto como un punto final de API público :).

¡Así que ahora queremos probar esas funciones específicamente!


```javascript
const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();

  console.log("Contract deployed to:", waveContract.address);
  console.log("Contract deployed by:", owner.address);

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

**VSCode puede importar automáticamente `ethers`. No necesitamos importar `ethers`. Por lo tanto, asegúrate de no tener importaciones. ¿Recuerdas lo que hablamos en la última lección sobre hre?**

🤔 ¿Cómo funciona?
-----------------

```javascript
const [owner, randomPerson] = await hre.ethers.getSigners();
```

Para implementar algo la blockchain, ¡necesitamos tener una dirección de billetera! Hardhat hace esto por nosotros mágicamente en segundo plano, pero aquí tomé la dirección de billetera del propietario del contrato y también tomé una dirección de billetera aleatoria y la llamé `randomPerson`. Esto tendrá más sentido en un momento.

También agregué:

```javascript
console.log("Contract deployed by:", owner.address);
```

Hago esto solo para ver la dirección de la persona que despliega nuestro contrato. ¡Soy curioso!

Lo último que agregué fue esto:

```javascript
let waveCount;
waveCount = await waveContract.getTotalWaves();

let waveTxn = await waveContract.wave();
await waveTxn.wait();

waveCount = await waveContract.getTotalWaves();
```

Básicamente, ¡necesitamos llamar manualmente a nuestras funciones! Como haríamos con cualquier API normal. Primero llamo a la función para tomar el número de saludos totales. Luego, creo un saludo. Finalmente, tomo el waveCount una vez más para ver si cambió.

Ejecuta el script como lo harías normalmente:

```bash
npx hardhat run scripts/run.js
```

Aquí está mi salida:

![](https://i.imgur.com/NgfOns3.png)

Bastante impresionante, eh :)?

También puede ver la dirección de la billetera que saludo igual a la dirección que implementó el contrato. ¡Me saludé a mí mismo!

Así que nosotros:\
1 \. Llamamos nuestra función de saludar. \
2 \. Cambiamos la variable de estado. \
3 \. Leimos el nuevo valor de la variable.

Esta es prácticamente la base de la mayoría de los contratos inteligentes. Leer funciones. Escribir funciones. Y cambiar variables de estado. Tenemos los bloques de construcción que necesitamos para seguir trabajando en nuestro asombroso WavePortal.

🤝 Probar a otros usuarios
--------------------

Entonces, probablemente queremos que alguien más que nosotros nos envíe un saludo, ¿verdad? ¡Sería bastante aburrido si tan solo nosotros pudiéramos enviar un saludo! ¡Queremos que nuestro sitio web sea **multijugador**!

Mira esto. Agregué algunas líneas al final de la función. No voy a explicarlo mucho (pero has preguntas en #general-chill-chat). Básicamente, así es como podemos simular que otras personas acceden a nuestras funciones :). Mantente atento a las direcciones de billetera en tu terminal una vez que cambies el código y lo ejecutes.
```javascript
const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();

  console.log('Contract deployed to:', waveContract.address);
  console.log('Contract deployed by:', owner.address);

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

Los elementos nuevos agregados a este bloque de código son:

```javascript
waveTxn = await waveContract.connect(randomPerson).wave();
await waveTxn.wait();

waveCount = await waveContract.getTotalWaves();
```

🚨 Antes de que hagas clic en "Siguiente lección"
-------------------------------------------

* Nota: si no haces esto, Farza se pondrá muy triste :(.*

¡Personaliza un poco tu código! ¿Quizás quieras guardar algo más? Quiero que juegues. ¿Quizás deseas almacenar la dirección del remitente en un arreglo? ¿Quizás deseas almacenar un mapa de direcciones y recuentos de saludos para realizar un seguimiento de quién te está saludando con más frecuencia? Incluso si simplemente cambia los nombres de las variables y los nombres de las funciones para que sean algo que creas interesante. ¡Intenta no copiarme directamente! Piense en tu sitio web final y el tipo de funcionalidad que deseas. Crea la funcionalidad **que deseas**.

Una vez que hayas terminado aquí, asegúrese de publicar una captura de pantalla de la salida de tu terminal en #progress. 
