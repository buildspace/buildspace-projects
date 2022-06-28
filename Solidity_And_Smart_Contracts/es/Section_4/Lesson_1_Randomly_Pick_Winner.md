
## 😈 Escoger a un ganador aleatoriamente.

¡Entonces, en este momento, nuestro código está configurado para dar al usuario de nuestra aplicación 0.0001 ETH cada vez que la utiliza! 
Nuestro contrato se quedará sin dinero bastante rápido, y luego la diversión terminará y necesitaremos agregar más fondos a nuestro contrato. 
En esta lección, los guiaré para lograr lo siguiente:

1\. Elegir un ganador **al azar.**
2\. Crear un mecanismo de **enfriamiento** para evitar que las personas nos saluden con spam en un intento de ganar el premio o solo molestar.

¡Hagamos primero la parte del ganador aleatorio!

Generar un número aleatorio en contratos inteligentes es ampliamente conocido como un **problema difícil.**

¿Por qué? Bueno, piensa en cómo se genera normalmente un número aleatorio. Cuando generas un número aleatorio normalmente en un programa, 
**tomará un montón de números diferentes de su computadora como fuente de aleatoriedad** como: la velocidad de los ventiladores, la temperatura de la CPU, 
la cantidad de veces que ha presionado " L" a las 3:52 p. m. desde que compraste la computadora, tu velocidad de Internet y muchos otros números que 
son difíciles de controlar para ti. Toma **todos** estos números que son "aleatorios" y los junta en un algoritmo que genera un número que considera que es el
mejor intento de un número verdaderamente "aleatorio". ¿Tiene sentido para ti?

Mientras que, en la cadena de bloques, **casi no hay fuentes de aleatoriedad.** Todo lo que ve el contrato, es público. 
Debido a eso, alguien podría jugar con el sistema simplemente mirando el contrato inteligente, viendo en qué números se basa para la aleatoriedad, 
y luego la persona podría usar los números exactos que necesita para ganar el premio.

Revisemos el código a continuación:

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;

    /*
     * We will be using this below to help generate a random number
     */
    uint256 private seed;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;

    constructor() payable {
        console.log("We have been constructed!");
        /*
         * Set the initial seed
         */
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public {
        totalWaves += 1;
        console.log("%s has waved!", msg.sender);

        waves.push(Wave(msg.sender, _message, block.timestamp));

        /*
         * Generate a new seed for the next user that sends a wave
         */
        seed = (block.difficulty + block.timestamp + seed) % 100;

        console.log("Random # generated: %d", seed);

        /*
         * Give a 50% chance that the user wins the prize.
         */
        if (seed <= 50) {
            console.log("%s won!", msg.sender);

            /*
             * The same code we had before to send the prize.
             */
            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
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
Aquí, tomo dos números que me dio Solidity, `block.difficulty` y `block.timestamp` y los combino para crear un número aleatorio. `block.difficulty` 
les dice a los mineros qué tan difícil será extraer el bloque en función de las transacciones en el bloque. 

Los bloques se vuelven más difíciles por varias razones, pero, principalmente, se vuelven más difíciles cuando hay más transacciones en el bloque 
(algunos mineros prefieren bloques más fáciles, pero estos pagan menos). `block.timestamp` es solo la marca de tiempo de Unix en la que se está procesando el bloque.
Estos números son *bastante* aleatorios. Pero, técnicamente, tanto `block.difficulty` como `block.timestamp` podrían ser controlados por un atacante sofisticado.

Para hacer esto más difícil, he creado una variable `seed` que cambiará cada vez que un usuario envíe un nuevo saludo. 
Entonces, combino estas tres variables para generar un nuevo valor aleatorio. 

Luego solo hago`% 100`, lo que asegurará que el número este en un rango entre 0 y 99.

¡Eso es todo! Luego, solo escribo una declaración if simple para ver si la semilla es menor o igual a 50, si lo es, -- ¡entonces el usuario gana el premio! 
Eso significa que el usuario tiene un 50% de posibilidades de ganar ya que escribimos `seed <= 50`. Puedes cambiar esto a lo que quieras :). 

¡Lo acabo de hacer al 50% porque es más fácil hacer pruebas!
Es importante ver aquí que un ataque técnicamente podría engañar a su sistema si realmente quisieran. Sería muy difícil. 
¡Hay otras formas de generar números aleatorios en la cadena de bloques, pero Solidity no nos brinda nada confiable de forma nativa porque no se puede! 
Todos los números a los que puede acceder nuestro contrato son públicos y *nunca* verdaderamente aleatorios.

En realidad, este es uno de los puntos fuertes de la cadena de bloques. ¡Pero puede ser un poco molesto para algunas aplicaciones como en este proyecto!
Bueno aún así nadie atacará nuestra aplicación, ¡pero es muy importante que sepas todo esto cuando estés creando una dApp que tenga millones de usuarios!

Pruébalo.
-------

Asegurémonos de que esto funciona. Aquí puedes ver `run.js` actualizado. Quiero asegurarme de que el saldo del contrato cambia en el caso de que alguien 
que haya enviado un saludo gane el premio.

```javascript
const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await waveContract.deployed();
  console.log("Contract addy:", waveContract.address);

  let contractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  );
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  /*
   * Let's try two waves now
   */
  const waveTxn = await waveContract.wave("This is wave #1");
  await waveTxn.wait();

  const waveTxn2 = await waveContract.wave("This is wave #2");
  await waveTxn2.wait();

  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log(
    "Contract balance:",
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

No siempre hay buenos tutoriales como este donde te vamos guiando sobre cómo hacer pruebas con tu código. 
Depende de ti averiguar dos cosas: ¿qué quiere probar? y ¿cómo probarlo? En este caso, quería asegurarme de que el saldo del contrato se redujera en 0.0001 
solo en el caso de que se genere un número aleatorio inferior a 50.

Cuando ejecuto el código anterior, esto es lo que obtendremos:

![](https://i.imgur.com/ArXRCsp.png)

¡Boom! Funciona. Cuando se generó "79", el usuario no ganó el premio. Pero, cuando se generó 23, ¡Este saludo ganó! Y, el saldo del contrato se redujo 
en exactamente 0.0001. ¡Qué bien! :).

## Hacer una función de enfriamiento para prevenir spammers.

Impresionante. ¡Ahora tienes una manera de enviar ETH aleatoriamente a las personas! Ahora, podría ser útil agregar una función de enfriamiento 
al sitio para que las personas no puedan enviar spam. ¿Por qué? Bueno, tal vez simplemente no quieras que sigan tratando de ganar el premio una 
y otra vez saludándote. O tal vez no quieras *llenen* tu muro de mensajes sin objeto.

Mira el código a continuación. Agregué comentarios en las partes donde agregué líneas nuevas.

Yo uso una estructura de datos especial llamada [map](https://medium.com/upstate-interactive/mappings-in-solidity-explained-in-under-two-minutes-ecba88aff96e).

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
     * This is an address => uint mapping, meaning I can associate an address with a number!
     * In this case, I'll be storing the address with the last time the user waved at us.
     */
    mapping(address => uint256) public lastWavedAt;

    constructor() payable {
        console.log("We have been constructed!");
        /*
         * Set the initial seed
         */
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public {
        /*
         * We need to make sure the current timestamp is at least 15-minutes bigger than the last timestamp we stored
         */
        require(
            lastWavedAt[msg.sender] + 15 minutes < block.timestamp,
            "Wait 15m"
        );

        /*
         * Update the current timestamp we have for the user
         */
        lastWavedAt[msg.sender] = block.timestamp;

        totalWaves += 1;
        console.log("%s has waved!", msg.sender);

        waves.push(Wave(msg.sender, _message, block.timestamp));

        /*
         * Generate a new seed for the next user that sends a wave
         */
        seed = (block.difficulty + block.timestamp + seed) % 100;

        if (seed <= 50) {
            console.log("%s won!", msg.sender);

            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than they contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
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
Actualiza y ejecuta un `npx hardhat run scripts/run.js` y notarás que aparece un mensaje de error si intentas saludar dos veces seguidas 
sin esperar al menos 15 minutos :).

¡Bam! ¡Y así es como construyes funciones de tiempos de reutilización!














