🔥 Imitar el entorno de la blockchain para probar
-----------------------------------------------

Lo conseguiste. Has escrito un smart contract. ¡Eres un campeón!

Ahora tenemos que \
1\. Compilarlo.\
2\. Desplegarlo en nuestra blockchain local.\
3\. Una vez que esté allí, se ejecutará ese console.log :).

Necesitamos hacer esto porque en el mundo real, los smart contract viven en la blockchain. ¡Y, queremos que nuestro sitio web y el smart contract sean utilizados por personas reales para que puedan 👋  o hacer lo que quieras que hagan!

Así que, incluso cuando estamos trabajando localmente queremos imitar ese entorno. Técnicamente, podríamos simplemente compilar y ejecutar el código de Solidity, pero lo que hace que Solidity sea mágico es cómo puede interactuar con la blockchain y las carteras de Ethereum (que veremos en la próxima lección). Así que, mejor hacerlo ahora mismo.

Vamos a escribir un script personalizado que maneje esos 3 pasos por nosotros.

¡Vamos!

📝 Construir un script para ejecutar nuestro contrato
-------------------------------------

Entra en el directorio **`scripts`** y crea un archivo llamado **`run.js`.** 

Después, para probar un smart contract tenemos que hacer un montón de cosas como toca. Entre otras: compilar, desplegar, y luego ejecutar.

Nuestro script hará que sea realmente fácil iterar en nuestro contrato súper rápido :).

Así que esto es lo que tendrá **`run.js`**:

```javascript
const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();
  console.log("Contrato desplegado en:", waveContract.address);
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

Impresionante.

🤔 ¿Cómo funciona?
-----------------

De nuevo yendo línea por línea.

```javascript
const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
```

Esto compilará nuestro contrato y generará los archivos necesarios para trabajar con nuestro contrato en el directorio `artifacts`. Ve a comprobarlo después de ejecutar esto :).

```javascript
const waveContract = await waveContractFactory.deploy();
```

Esto es bastante guay :). 

Lo que sucede aquí es que Hardhat creará una red local de Ethereum para nosotros, pero sólo para este contrato. Entonces, después de que el script se complete, destruirá esa red local. Así, cada vez que se ejecute el contrato, será un blockchain nuevo. ¿Qué sentido tiene esto? Es como refrescar tu servidor local cada vez, así que siempre empiezas de cero, lo que facilita la depuración de errores.

```Javascript
await waveContract.deployed();
```

Esperaremos a que nuestro contrato se despliegue oficialmente en nuestra blockchain local. Nuestro `constructor` se ejecuta cuando realmente se despliega.

```javascript
console.log("Contrato desplegado en:", waveContract.address);
```

Finalmente, una vez desplegado, `waveContract.address` nos dará la dirección del contrato desplegado. Esta dirección es la forma en la que podemos encontrar nuestro contrato en la blockchain. Hay millones de contratos en la blockchain. Por lo tanto, esta dirección nos permite acceder fácilmente al contrato con el que nos interesa trabajar. Esto será más importante un poco más adelante una vez que desplegamos a una red real de Ethereum.

¡Vamos a ejecutarlo!

```bash
npx hardhat run scripts/run.js
```

¡¡¡Deberías ver tu `console.log` ejecutado desde el contrato y también deberías ver la dirección del contrato impresa!!! Esto es lo que obtengo:

![](https://i.imgur.com/ug79rOM.png)


🎩 Hardhat & HRE
----------------

En estos bloques de código te darás cuenta constantemente de que usamos `hre.ethers`, pero `hre` no se importa en ningún sitio ¿Qué tipo de brujería es esta?

Si lees directamente los propios documentos de Hardhat te darás cuenta de esto:

> El ardhat Runtime Environment, o HRE para abreviar, es un objeto que contiene toda la funcionalidad que Hardhat expone al ejecutar una tarea, prueba o script. En realidad, Hardhat es el HRE.

¿Qué significa esto? ¡Bueno, cada vez que ejecutes un comando de terminal que empiece por `npx hardhat` estarás obteniendo este objeto `hre` construido sobre la marcha usando el `hardhat.config.js` especificado en tu código! Esto significa que nunca tendrás que hacer ningún tipo de importación en tus archivos como:

`const hre = require("hardhat")`

**Para que lo entiendas, verás `hre` muchas veces en nuestro código, ¡pero nunca importado en ningún sitio! ¡Mira esta genial [documentación de Hardhat](https://hardhat.org/advanced/hardhat-runtime-environment.html) para aprender más sobre ello!

🚨 Antes de hacer click en "Next Lesson"
-------------------------------------------

*Nota: si no haces esto, Farza se pondrá muy triste :(.*

Ve a #progress y publica una captura de pantalla de tu terminal con el resultado.

¡Asegúrate de hacer ese console.log como quieras! Ahora has escrito tu propio contrato y lo has ejecutado desplegando en una blockchain local WOOOOOOOOOO VAMOOOOOS.
