👩‍💻 Vamos a escribir un contrato
----------------------------

Increíble, Lo hicimos.

Vamos a entrar directamente a nuestro proyecto.

Construyamos un contrato inteligente que nos permita enviar un 👋 a nuestro contrato y realizar un seguimiento del número total de "waves". Esto va a ser útil porque en tu sitio, ¡es posible que desees realizar un seguimiento de este número! Siéntete libre de cambiar esto para que se ajuste a tu caso de uso.

Crea un archivo llamado **`WavePortal.sol`** en el directorio **`contracts`** . La estructura de archivos es super importante para Hardhat, así que, ¡tenga mucho cuidado!

Vamos a comenzar con la estructura con la que empieza cada contrato.

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    constructor() {
        console.log("Yo yo, I am a contract and I am smart");
    }
}
```

Nota: Quizás quieras descargar la extensión de Solidity para VSCode para resaltar fácilmente la sintaxis. Puedes encontrarla [aquí](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity).

```solidity
// SPDX-License-Identifier: UNLICENSED
```

Solo un comentario elegante. Se le llama "SPDX license identifier", puedes googlear más al respecto :).

```solidity
pragma solidity ^0.8.0;
```

Esta es la versión del compilador de Solidity que queremos que nuestro contrato use. Esto básicamente dice "cuando ejecutes esto, solo quiero que uses la versión 0.8.0 del compilador de Solidity, ninguna menor". Asegúrese que la versión del compilador sea la misma en `hardhat.config.js`.

```solidity
import "hardhat/console.sol";
```

Un poco de magia que nos dio Hardhat para imprimir algunos logs en nuestro contrato. De hecho, es bastante difícil depurar contratos inteligentes pero esta es una de las cosas que nos da Hardhat para hacer nuestras vidas más fáciles.

```solidity
contract WavePortal {
    constructor() {
        console.log("Yo yo, I am a contract and I am smart");
    }
}
```

Entonces, los contratos inteligentes son una especie de "clase" en otros lenguajes, !si alguna vez los has visto! Una vez inicializado este contrato la primera vez, el constructor va a ejecutar e imprimir esa línea. Por favor ¡haz que esa línea diga lo que quieras ;)!

En la siguiente lección, ¡vamos a ejecutar esto y ver que obtenemos!


🚨 Antes de hacer click en "Siguiente Lección"
-------------------------------------------

*Nota: Si no haces esto, Farza se pondrá triste :(.*

Ve a #progress y comparte una captura de pantalla del código de tu contrato en el archivo `WavePortal.sol` ;).
