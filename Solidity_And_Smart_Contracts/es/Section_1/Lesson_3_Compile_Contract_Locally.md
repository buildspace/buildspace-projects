## 🔥 Imitando el entorno blockchain para hacer pruebas

Lo hiciste. Has escrito un contrato inteligente. ¡Eres un campeón!

Ahora lo que necesitamos es\
1\. Compilarlo.\
2\. Desplegarlo en nuestra blockchain local.\
3\. Una vez allí, el console.log se ejecutará ;).

Vamos a hacer esto porque en el mundo real, los contratos inteligentes viven en la blockchain. Y, queremos que nuestro sitio web y contrato inteligente sea usado por gente real, así ellos puedan enviarnos 👋 o ¡hacer lo que tú quieras que hagan!.

Entonces, incluso cuando estamos trabajando localmente, queremos imitar ese entorno. Técnicamente, podríamos solo compilar y ejecutar el código de Solidity, pero lo que hace a Solidity mágico es cómo puede interactuar con la blockchain y las billeteras de Ethereum (vamos a ver más de esto en la siguiente lección). Por lo tanto, es mejor eliminar esto ahora mismo.

Vamos a escribir un "script" personalizado para que pueda manejar estos 3 pasos por nosotros.

¡Vamos a hacerlo!

## 📝 Crea un script para ejecutar nuestro contrato

Dirígete al directorio **`scripts`** y crea un archivo llamado **`run.js`**

Entonces, para probar un contrato inteligente tenemos que hacer un montón de cosas bien. Cómo: compilar, desplegar y ejecutar.

Nuestro script hará que sea muy fácil de iterar en nuestro contrato muy rápido :).

Entonces, esto es lo que **`run.js`** va a tener:

```javascript
const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();
  console.log("Contract deployed to:", waveContract.address);
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

Increíble.

## 🤔 ¿Cómo funciona?

Una vez más, línea por línea.

```javascript
const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
```

Esto va a compilar nuestro contrato y generar los archivos que necesitamos para trabajar con nuestro contrato en los directorios `artifacts`. Ve y revisa esto después de ejecutar esto ;).

```javascript
const waveContract = await waveContractFactory.deploy();
```

Esto es bastante elegante :). 

Lo que está pasando aquí es que Hardhat va a crear una red local de Ethereum para nosotros, pero solo para este contrato. Entonces, después que se complete el script, se va a destruir esa red local. Entonces, cada vez que ejecutes el contrato, esto va a crear una blockchain nueva. ¿Entonces cuál es el punto? Es como si se actualizara tu servidor local cada vez, para siempre empezar una versión limpia, lo que lo hace fácil de depurar errores.

```javascript
await waveContract.deployed();
```

Esperamos hasta que nuestro contrato esté oficialmente desplegado en ¡nuestra blockchain local! Nuestro `constructor` se ejecutará cuando hagamos el despliegue.

```javascript
console.log("Contract deployed to:", waveContract.address);
```

Finalmente, una vez que esté desplegado `waveContract.address` básicamente nos dará la dirección del contrato desplegado. Esta dirección es como realmente podemos encontrar nuestro contrato en la blockchain. Hay millones de contratos en la blockchain real. Por lo tanto, esta dirección ¡nos permite acceder fácilmente al contrato con el que estamos interesados en trabajar! Esto se volverá más importante más tarde cuando despleguemos a una red Ethereum real.

¡Vamos a ejecutarlo!

```bash
npx hardhat run scripts/run.js
```

Deberías ver como el `console.log` se ejecuta desde el contrato y también deberías ver ¡¡¡la dirección del contrato imprimirse!!! Esto es lo que obtengo:

![](https://i.imgur.com/ug79rOM.png)


## 🎩 Hardhat y HRE

En estos bloques de código deberás notar constantemente que usamos `hre.ethers`, pero ¿`hre` nunca fue importado en ningún lado? ¿Qué clase de brujería es esta?

Directamente desde la documentación de Hardhat puede ver esto:

> El entorno de ejecución de Hardhat, o HRE (por sus siglas en inglés), es un objeto que contiene toda la funcionalidad que Hardhat expone cuando esta corriendo una tarea, prueba o script. En realidad, Hardhat es el HRE.

Entonces, ¿qué significa esto? Bueno, cada vez que se ejecuta un comando en la terminal con `npx hardhat` tu obtienes el objeto `hre` construido sobre la marcha usando `hardhat.config.js` ¡especificado en tu código! Lo que significa, que tu nunca tienes que hacer ningún tipo de import en tus archivos como:

`const hre = require("hardhat")`

**TL;DR - Vas a ver muchas veces `hre` en nuestro código, ¡pero nunca importado en ningún lado!! Puedes revisar la documentación [Documentación Hardhat](https://hardhat.org/advanced/hardhat-runtime-environment.html) ¡para aprender más sobre esto!**

## 🚨 Antes de hacer click en "Siguiente Lección"

*Nota: Si no haces esto, Farza se pondrá triste :(.*

Ve a #progress y comparte una captura de pantalla de tu terminal con el resultado.

¡Asegúrate de hacer que el console.log diga lo que quieras! Ya has escrito tu propio contrato y ejecutarlo en tu propia blockchain WOOOOOOOOOO! ¡VAMOOOS!
