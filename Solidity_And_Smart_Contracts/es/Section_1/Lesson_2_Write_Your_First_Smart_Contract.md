👩💻 Escribamos un contrato
----------------------------

Mis 10s, lo hemos conseguido.

Vamos a pasar directamente a nuestro proyecto.

Construiremos un smart contract que nos permita enviar un 👋 a nuestro contrato y llevar la cuenta del total de saludos. ¡Esto va a ser útil porque en tu sitio, es posible que desees realizar un seguimiento de este #! Siéntete libre de cambiar esto para que se adapte a tu caso de uso.

Crea un archivo llamado **`WavePortal.sol`** bajo el directorio **`contracts`**. La estructura del archivo es muy importante cuando se utiliza Hardhat, así que, ¡ten cuidado aquí!

Vamos a empezar con la estructura con la que empiezan todos los contratos.

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    constructor() {
        console.log("Yo yo, Soy un contrato y soy inteligente");
    }
}
```

Nota: Es posible que desees descargar la extensión VS Code Solidity para facilitar el resaltado de sintaxis [aquí](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity).

```solidity
// SPDX-License-Identifier: UNLICENSED
```

Es un comentario interesante.  Se llama "identificador de licencia SPDX", siéntete libre de buscar en Google lo que es :).

```solidity
pragma solidity ^0.8.0;
```

Esta es la versión del compilador de Solidity que queremos que utilice nuestro contrato. Básicamente dice "cuando ejecutes esto, sólo quiero usar la versión 0.8.0 del compilador de Solidity, nada más bajo". Nota, asegúrate de que la versión del compilador es la misma en `hardhat.config.js`.

```solidity
import "hardhat/console.sol";
```

Un poco de magia que nos da Hardhat para hacer algunos logs por consola en nuestro contrato. Realmente es un reto depurar los smart contract, pero esta es una de los beneficios de Hardhat para hacernos la vida más fácil.

```solidity
contract WavePortal {
    constructor() {
        console.log("Yo yo, Soy un contrato y soy inteligente");
    }
}
```

Como ves, los smart contract se parecen bastante a una `clase` en otros lenguajes, ¡si es que has visto alguna! Una vez que inicialicemos este contrato por primera vez, ese constructor se ejecutará e imprimirá la línea. ¡Por favor, customiza el log para que diga lo que quieras :)!

¡En la próxima lección, ejecutaremos esto y veremos lo que pasa!

🚨 Antes de hacer click en "Next Lesson"
-------------------------------------------

*Nota: si no haces esto, Farza se pondrá muy triste :(.*

Ve a #progress y publica una captura de pantalla con tu contrato refachero :).
