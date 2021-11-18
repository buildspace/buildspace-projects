😈 Elige al ganador al azar
-----------------------

Ahora mismo, nuestro código está configurado para dar a todos 0.0001 ETH cada vez. Nuestro contrato se quedará sin dinero bastante rápido, y entonces la diversión habrá terminado y necesitaremos añadir más fondos a nuestro contrato. En esta lección, vamos a ver cómo:

1\. Elegir un ganador **al azar**.

2\. Crear un mecanismo de **cooldown** para evitar que la gente te envíe spam intentando ganar el premio o molestarte.

Generemos primero al ganador aleatorio.

Generar un número aleatorio en los smart contracts es ampliamente conocido como un **problema difícil**.

¿Por qué? Bueno, piensa en cómo se genera un número aleatorio normalmente. Cuando generas un número aleatorio normalmente en un programa, **tomará un montón de números diferentes de tu ordenador como fuente de aleatoriedad** como: la velocidad de los ventiladores, la temperatura de la CPU, el número de veces que has pulsado "L" a las 3:52PM desde que compraste el ordenador, tu velocidad de Internet, y toneladas de otros # que son difíciles de controlar. Toma **todos** estos números que son "aleatorios" y los pone juntos en un algoritmo que genera un número que cree que es el mejor intento de un número verdaderamente "aleatorio". ¿Tiene sentido?

En la blockchain, no hay casi ninguna fuente de aleatoriedad. Todo lo que ve el contrato, lo ve el público. Por eso, alguien podría jugar con el sistema simplemente mirando el smart contract, viendo en qué números se basa para la aleatoriedad, y entonces la persona podría darle los números exactos que necesita para ganar.

Veamos el código abajo :).

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;

    /*
     * Usaremos esto más adelante para ayudar a generar un número aleatorio
     */
    uint256 private seed;

   event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        dirección waver;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;

    constructor() payable {
        console.log("¡El consrtuctor ha funcionado!");
        /*
         * Establecer la seed inicial
         */
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public {
        totalWaves += 1;
        console.log("%s ha saludado!", msg.sender);

        waves.push(Wave(msg.sender, _message, block.timestamp));

        /*
         * Generar una nueva seed para el próximo usuario que envíe un wave
         */
        seed = (block.difficulty + block.timestamp + seed) % 100;

        /*
         * Dar un 50% de posibilidades de que el usuario gane el premio.
         */
        if (seed <= 50)  {
            console.log("¡Has ganado %s!", msg.sender);

            /*
             * El mismo código que teníamos antes para enviar el premio.
             */
            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Intentando retirar más dinero del que tiene el contrato".
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "No se ha podido retirar el dinero del contrato.");
        }

        emit NewWave(msg.sender, block.timestamp, _message);
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        return totalWaves;
    }
}
```

Aquí, tomo dos números dados por Solidity, `block.difficulty` y `block.timestamp` y los combino para crear un número aleatorio. `block.difficulty` indica a los mineros lo difícil que será minar el bloque basándose en las transacciones del bloque. Los bloques se vuelven más difíciles por varias razones, pero, principalmente se vuelven más difíciles cuando hay más transacciones en el bloque (algunos mineros prefieren bloques más fáciles, pero, estos pagan menos). El "timestamp" del bloque es el sello de tiempo Unix que el bloque está siendo procesado.

Estos números son *bastante* aleatorios. Pero, técnicamente, tanto `block.difficulty` como `block.timestamp` podrían ser controlados por un atacante sofisticado. 

Para hacer esto más difícil, creo una variable `seed` que esencialmente cambiará cada vez que un usuario envíe un nuevo saludo. Entonces, combino estas tres variables para generar una nueva seed aleatoria. Luego sólo hago `% 100` que se asegurará de que el número se reduzca a un rango entre 0 - 100.

Eso es todo. Luego escribo una simple sentencia "if" para ver si la semilla es menor o igual a 50, si lo es -- ¡entonces el usuario gana el premio! Entonces, eso significa que el usuario tiene un 50% de posibilidades de ganar, ya que escribimos "seed <= 50". Puedes cambiar esto a lo que quieras :). ¡Yo lo hice al 50% porque es más fácil de probar de esa manera!

Es importante tener en cuenta que un ataque podría técnicamente romper tu sistema si realmente quisiera. Sólo que sería muy difícil. Hay otras formas de generar números aleatorios en la blockchain, pero Solidity no nos da nada fiable de forma nativa porque no puede. Todos los números a los que nuestro contrato puede acceder son públicos y *nunca* verdaderamente aleatorios.

En realidad, este es uno de los puntos fuertes del blockchain. ¡Pero, puede ser un poco molesto para algunas aplicaciones como la nuestra aquí!

¡En cualquier caso, nadie va a atacar nuestra pequeña aplicación pero quiero que sepas todo esto cuando construyas una dApp que tenga millones de usuarios!

Pruébalo
-------

¡Asegurémonos de que funciona! Aquí está mi `run.js` actualizado. ¡En este caso, sólo quiero asegurarme de que el saldo del contrato cambia en el caso de que la persona que saludó gane!

```javascript
const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther('0.1'),
  });
  await waveContract.deployed();
  console.log('Dirección del contrato:', waveContract.address);

  let contractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  );
  console.log(
    'Saldo del contrato:',
    hre.ethers.utils.formatEther(contractBalance)
  );

  /*
   * Probemos ahora con dos saludos
   */
  const waveTxn = await waveContract.wave('Este es el saludo #1');
  await waveTxn.wait();

  const waveTxn2 = await waveContract.wave('Este es el saludo #2');
  await waveTxn2.wait();

  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log(
    'Saldo del contrato:',
    hre.ethers.utils.formatEther(contractBalance)
  );

  let allWaves = await waveContract.getAllWaves();
  console.log(allWaves);
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

No siempre tendrás bonitos tutoriales como éste para guiarte sobre cómo probar tu código. Depende de ti averiguar 1) qué quieres probar 2) cómo probarlo. En este caso, sabía que quería asegurarme de que el saldo del contrato bajara en 0,0001 sólo en el caso de que se generara un número aleatorio inferior a 50.

Así que, cuando ejecuto el código anterior esto es lo que obtengo

![](https://i.imgur.com/ArXRCsp.png)

¡Boom! Funciona. Cuando se generó "79", el usuario no ganó el premio. Pero, cuando se generó el 23, ¡el usuario ganó! Y, el saldo del contrato bajó exactamente 0,0001. Muy bien :).

Cooldown para evitar a los spammers
-----------------------------

Impresionante. ¡Ahora tienes una forma de enviar ETH al azar a la gente! Podría ser útil añadir una función de calma a tu sitio para que la gente no pueda enviar oleadas de spam. ¿Por qué? Bueno, tal vez no quieras que sigan intentando ganar el premio una y otra vez saludándote. O tal vez no quieres que *sólo* *sus* mensajes llenen tu muro de mensajes.

Mira el código. He añadido comentarios donde he añadido nuevas líneas.

Utilizo una estructura de datos especial llamada [map](https://medium.com/upstate-interactive/mappings-in-solidity-explained-in-under-two-minutes-ecba88aff96e).

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    uint256 private seed;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;

    /*
     * Esto es un mapeo dirección => uint, lo que significa que puedo asociar una dirección con un número.
     * En este caso, voy a almacenar la dirección y la última vez que el usuario nos saludó.
     */
    mapping(address => uint256) public lastWavedAt;

    constructor() payable {
        console.log("¡El constructor ha funcionado!");
        /*
         * Establecer la seed inicial
         */
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public {
        /*
         *Necesitamos asegurarnos de que el timestamp actual es al menos 15 minutos mayor que el último que almacenamos
         */
        require(
            lastWavedAt[msg.sender] + 15 minutes < block.timestamp,
            "Espera 15m"
        );

        /*
         * Actualizar el timestamp actual que tenemos para el usuario
         */
        lastWavedAt[msg.sender] = block.timestamp;

        totalWaves += 1;
        console.log("%s ha saludado!", msg.sender);

        waves.push(Wave(msg.sender, _message, block.timestamp));

        /*
         * Generar una nueva seed para el próximo usuario que envíe un saludo
         */
        seed = (block.difficulty + block.timestamp + seed) % 100;

        if (seed <= 50) {
            console.log("¡Has ganado %s!", msg.sender);

            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Intentando retirar más dinero del que tiene el contrato".
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "No se ha podido retirar el dinero del contrato.");
        }

        emit NewWave(msg.sender, block.timestamp, _message);
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        return totalWaves;
    }
}
```


Prueba a ejecutar `npx hardhat run scripts/run.js` y mira el mensaje de error que te sale si intentas saludar dos veces seguidas sin esperar 15 minutos :).

¡Bam! ¡Y así es como se construyen los cooldowns!
