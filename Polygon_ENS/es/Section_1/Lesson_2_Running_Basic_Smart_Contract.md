### 👶 Vamos a escribir un contrato

*Nota: Si ya sabes como hacer muchas de las cosas the estás sección por el [proyecto "WavePortal"](https://app.buildspace.so/projects/CO02cf0f1c-f996-4f50-9669-cf945ca3fb0b) que hicimos en el pasado, fantastico! Podras hacer esto rapido :). Una buena parte se repite.*

Bien, lo hicimos. Ya estamos listo para escribir contratos inteligentes. Vamos a saltar directamente a nuestro proyecto. Abre el directorio del proyecto en tu editor de codigo favorito, A mi me gusta VSCode. Si nunca has escrito un contrato inteligente no te preocupes. **Sigue las indicaciones. Googlea cosas que no entiendas. pregunta en el Discord.**

Crea un archivo con el nombre `Domains.sol` dentro de `contracts` . La estructura de los directorios es muy importante cuando usas Hardhat, así que, se cuidadoso aquí!

Note: Te recomiendo descargar la  [extensión de Solidity](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity) para VSCode el cual te da un buen resaltado de sintaxis.

Siempre me gusta empezar con un contrato bastante simple, para tener resultados mientras avanzamos.

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.10;

import "hardhat/console.sol";

contract Domains {
  constructor() {
    console.log("ESTE ES MI CONTRATO DE DOMINIOS");
  }
}
```

Nota: En ocasiones VSCode lanzara errores que no son realmente un problema. Por ejemplo, podría subrayar el hardhat import y decir que no existe. Esto pasa porque tu compilador global de Solidity no está configurado localmente. Si no sabes como solucionar eso, no te preocupes. Ignoralo por ahora. También, te recomiendo no usar la terminal dentro de VSCode, usa tu propia terminal por separado! a veces la terminal de VSCode da problemas con el compilador.

Vamos linea por linea aquí.

```solidity
// SPDX-License-Identifier: UNLICENSED
```

Es solo un comentario elegante.  es llamando un "SPDX license identifier", sientete libre de googlear que es :).

```solidity
pragma solidity ^0.8.10;
```

Esta es la versión del compilador de Solidity que queremos usar en nuestro contrato. Es basicamente decir "cuando se ejecute esto, quiero que solo se usa la versión 0.8.10 del compilador de Solidity, nada menos. Nota, asegurate estar usando la versión 0.8.10 del compilador en `hardhat.config.js`.

```solidity
import "hardhat/console.sol";
```

Debido a algo de magia dada a nosotros por Hardhat podemos hacer algunos console logs en nuestros contratos. Es bastante dificil resolver errores en un contrato inteligente pero está es una de las herraminetas que hardhat nos da para hacer nuestra vida más facil.

```solidity
contract Domains{
    constructor() {
        console.log("ESTE ES MI CONTRATO DE DOMINIOS.");
    }
}

```

El contrato inteligente se ve como una `clase` en otros lenguajes, si alguna vez has visto alguno de esos! una vez que inicializemos esté contrato por primera vez, el constructor se ejecutara e imprimira esa linea. Por favor cambia esa linea a lo que quieras. Diviertete un poco con eso.

### **😲 Como lo ejecutamos?**

Increible — tenemos un contrato inteligente! pero, todavía no sabemos si funciona. necesitamos:

1. Compilarlo.
2. Desplegarlo a nuestra blockchain local.
3. Una vez este ahí, el `console.log` se ejecutara.

Vamos a escribir un script que maneje esos 3 pasos por nosotros.

Dirijite al directorio `scripts` y crea un archivo llamado `run.js`. esto es lo que `run.js` va a contener:

```jsx
const main = async () => {
  const domainContractFactory = await hre.ethers.getContractFactory('Domains');
  const domainContract = await domainContractFactory.deploy();
  await domainContract.deployed();
  console.log("Contrato desplegado en la dirección: ", domainContract.address);
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

`run.js` es nuestra zona de pruebas para hacer desastres con nuestro contrato inteligente!

### **🤔 Como funciona?**

**Nota: VSCode tal vez añada el import de ethers. No necesitamos importar ethers o nada más. Asi que, asegurate de no importar nada.**

Nuevamente, linea por linea.

```jsx
const domainContractFactory = await hre.ethers.getContractFactory('Domains');
```

Esto va a compilar nuestro contrato y generar los archivos necesarios para trabajar con nuestro contrato en el directorio `artifacts` . Puedes ir mirarlo después de ejecutar esto :).

```jsx
const domainContract = await domainContractFactory.deploy();
```

Esto es bastante elegante :).

Lo que está pasando aquí es qué Hardhat creara una red Ethereum local para nosotros, **pero solo para esté script**. Una vez que el script termine, se destruira la red local. Así que, cada vez que despliegues el contrato será en una blockchain nueva. Cual es el punto? Es como reiniciar tu servidor local cada vez para iniciar con un estado más limpio, así es más facil encontrar errores.

```jsx
await domainContract.deployed();
```

Esperaremos hasta que el contrato esté minado y desplegado en nuestra blockchain local! así es, hardhat realmente crea "mineros" falsos en tu computadora para intentar imitar una blockchain real.

Nuestro `constructor` se ejecuta una vez el contrato este desplegado!

```jsx
console.log("Contrato desplegado en la dirección: ", domainContract.address);
```

Finalmente, una vez que esté desplegado `domainContract.address` nos dara la dirección de nuestro contrato. Está dirección es como encontramos nuestro contrato en la blockchain. Ahora mismo en nuestra blockchain local estamos solo nosotros. Así que, esto no es tan emocionante.

Pero, hay millones de contratos en blockchain reales. De está manera las direcciones nos dan una acceso facil al contrato con el que estamos interesados en interactuar! Esto sera util cuando despleguemos a una blockchain en unas pocas lecciones.

### **💨 Ejecutalo.**

Antes de ejecutar esto, asegurate de cambiar `solidity: "0.8.4",` a `solidity: "0.8.10",` en tu `hardhat.config.js`.

Vamos a ejecutarlo! Abre tu terminal y ejecuta el comando:

```bash
npx hardhat run scripts/run.js
```

Deberías ver tus `console.log` se ejecuntan junto con el contrato y deberías ver la dirección del contrato en tu terminal!!!

### **🎩 Hardhat y HRE**

En estos bloques de codigo notaras que constantemente usamos `hre.ethers`, pero `hre` nunca es importado en ninguna parte? que clase de hechicería es esta?

Directamente en la documentación de Hardhat, notaras esto:

> El Entorno de Ejecución de Hardhat(en ingles "Hardhat Runtime Environment"), o su abreviación HRE, es un objeto que contiene toda la funcionalidad que Hardhat expone cuando se ejecuta una tarea, prueba o script. En realidad, Hardhat es el HRE.
> 

Qué significa esto? Cada vez que en tu terminal escribas un comando que inicie con `npx hardhat` obtendras este objeto `hre` creado en el momento usando `hardhat.config.js` con la configuración declarada en tu codigo! Esto significa que nunca vas a tener que importar de alguna manera en tus archivos como:

`const hardhat = require("hardhat")`

**Resumiendo - estaras viendo `hre` mucho en nuestro codigo, pero nunca importado en ninguna parte! Dale un ojo a la [Documentación de Hardhat](https://hardhat.org/advanced/hardhat-runtime-environment.html) para aprender más!**

### **🚨 Reporte de progreso!**

Publica una captura de pantalla en #progress con el resultado de `npx hardhat run scripts/run.js` :).