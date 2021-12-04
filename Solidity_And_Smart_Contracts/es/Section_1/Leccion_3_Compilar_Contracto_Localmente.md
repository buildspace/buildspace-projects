🔥 Imitando el ambiente de blockchain para hacer pruebas.
-----------------------------------------------

Lo has hecho! Escribiste un smart contract. Eres un campeón!

Ahora necesitamos realmente\
1\. Compilarlo.\
2\. Implementarlo en nuestro blockchain local.\
3\. Una vez que esté allí, ese console.log correrá :).

Necesitamos hacer esto porque en el mundo real, los contratos inteligentes viven en la Blockchain. ¡Y queremos que nuestro sitio web y nuestro contrato inteligente sean utilizados por personas reales para que puedan  o hacer lo que tú quieras que hagan!

Entonces, incluso cuando trabajamos localmente, queremos imitar ese entorno. Técnicamente, podríamos simplemente compilar y ejecutar el código de Solidity, pero lo que hace que Solidity sea mágico es cómo puede interactuar con las billeteras de blockchain y Ethereum (de lo que veremos más en la próxima lección). Entonces, es mejor simplemente hacer esto de una vez.

Vamos a escribir un script personalizado que haga esos tres pasos por nosotros.

¡Vamos a hacerlo! 

📝 Crear un script para correr nuestro contrato
-------------------------------------

Ve al directorio **`scripts`** y crea un archivo llamado **`run.js`.**

Para probar un contrato inteligente, tenemos que hacer un montón de cosas bien. Como: compilar, desplegar y luego ejecutar.

Nuestro script hará que sea fácil iterar en nuestro contrato muy rápido :).

Entonces, esto es lo que **`run.js`** va a tener:

```javascript
const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
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

Impresionante.

🤔 ¿Cómo funciona?
-----------------

De nuevo yendo línea por línea.

```javascript
const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
```

Esto realmente compilará nuestro contrato y generará los archivos necesarios que necesitamos para trabajar con nuestro contrato en el directorio `artifacts`. Ve a verlo después de ejecutar esto :).

```javascript
const waveContract = await waveContractFactory.deploy();
```


Esto es bastante elegante :).

Lo que está sucediendo aquí es que Hardhat creará una red Ethereum local para nosotros, pero solo para este contrato. Luego, después de que se complete el script, destruirá esa red local. Entonces, cada vez que ejecute el contrato, será una blockchain nueva. ¿Cuál es el punto de esto? Es como actualizar su servidor local cada vez para que siempre comience desde una pizarra limpia, lo que facilita la depuración de errores.

```javascript
await waveContract.deployed();
```

¡Esperaremos hasta que nuestro contrato se despliegue oficialmente en nuestra blockchain local! Nuestro `constructor` se ejecuta cuando desplegamos el contrato.

```javascript
console.log("Contract deployed to:", waveContract.address);
```

Finalmente, una vez desplegado, `waveContract.address` básicamente nos dará la dirección del contrato desplegado. Esta dirección es la forma en que podemos encontrar nuestro contrato en la blockchain. Hay millones de contratos en la blockchain real de Ethereum . Por lo tanto, esta dirección nos permite acceder fácilmente al contrato con el que estamos interesados ​​en trabajar. Esto será más importante un poco más adelante, una vez que lo despleguemos en una red Ethereum real.

¡Vamos a ejecutarlo!

```bash
npx hardhat run scripts/run.js
```

¡Deberías ver que tu `console.log` se ejecuta desde el contrato y luego también deberías ver la dirección del contrato impresa! Esto es lo que yo obtengo:

![](https://i.imgur.com/ug79rOM.png)


🎩 Hardhat y HRE
----------------

En estos bloques de código, notarás constantemente que usamos `hre.ethers`, pero` hre` nunca se importa a ningún lado. ¿Qué tipo de hechicería es esta?

Directamente desde los propios documentos de Hardhat notarás esto:

> El entorno de tiempo de ejecución de Hardhat, o HRE para abreviar, es un objeto que contiene toda la funcionalidad que expone Hardhat al ejecutar una tarea, prueba o script. En realidad, Hardhat es el HRE.

Entonces, ¿qué significa esto? Bueno, cada vez que ejecutas un comando de terminal que comienza con `npx hardhat`, obtienes este objeto` hre` construido sobre la marcha usando el `hardhat.config.js` especificado en tu código. Esto significa que nunca tendrá que realizar algún tipo de importación en sus archivos como:

`const hardhat = require ("hardhat")`

**Resumen: verás `hre` mucho en nuestro código, ¡pero nunca se importó a ningún lado! ¡Consulte esta interesante [documentación de Hardhat] (https://hardhat.org/advanced/hardhat-runtime-environment.html) para obtener más información al respecto!**

🚨 Antes de hacer clic en "Siguiente lección"
-------------------------------------------

* Nota: si no haces esto, Farza se pondrá muy triste :(

Ve a #progress y publica una captura de pantalla de tu terminal con el resultado.

¡Asegúrate de hacer que console.log sea lo que quieras! Ahora has escrito tu propio contrato y lo has ejecutado desplegándolo en una cadena de bloques local ¡WOOOOOOOOOOJOOOOOOO VAMOS!