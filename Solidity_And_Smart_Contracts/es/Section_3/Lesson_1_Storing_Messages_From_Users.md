📦 Almacenamiento de mensajes en arrays mediante structs
-------------------------------------------

Entonces, ¡ya tenemos una aplicación web completa que puede comunicarse con la blockchain!

Ahora, si recuerdas, queremos que nuestra aplicación final sea un lugar donde la gente pueda venir a saludar y enviarnos un mensaje. También queremos mostrar todos los saludos/mensajes anteriores que hemos recibido. Eso es lo que haremos en esta lección.

Así que al final de las lecciones queremos

1\. Permitir a los usuarios enviar un mensaje junto con su saludo.

2\. Que esos datos se guarden de alguna manera en la blockchain.

3\. Mostrar esos datos en nuestra web para que cualquiera pueda venir a ver todas las personas que nos han saludado y sus mensajes.

Fíjate en el smart contract actualizado. He añadido un montón de comentarios aquí para ayudarte a ver lo que ha cambiado :).

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;

    /*
     * Un poco de magia, googlea lo que son los eventos en Solidity
     */
    event NewWave(address indexed from, uint256 timestamp, string message);

    /*
     * He creado un struct llamado Wave.
     * Un struct es básicamente un datatype que nos permite customizar lo que queremos guardar en él.
     */
    struct Wave {
        address waver; // La cartera del usuario que ha saludado.
        string message; // El mensaje que nos ha dejado.
        uint256 timestamp; // El timestamp del momento en el que nos han saludado.
    }

    /*
     * Declaro la variable waves que me permite guardar una lista de structs.
     * ¡Esto es lo que nos permite guardar todos los saludos que nos manden!
     */
    Wave[] waves;

    constructor() {
        console.log("SOY UN SMART CONTRACT. YAY.");
    }

    /*
     * Notarás que he cambiado un poco la función wave un poco 
     * ahora requiere un string llamado _message. ¡Es el mensaje que
     * nos mandan del front!
     */
    function wave(string memory _message) public {
        totalWaves += 1;
        console.log("%s ha saludado!", msg.sender);

        /*
         * Aquí es donde guardamos realmente los datos de los saludos en la lista.
         */
        waves.push(Wave(msg.sender, _message, block.timestamp));

        /*
         * He añadido algunas cosillas aquí, ¡googléalo e intenta entender qué es!
         * Haznos saber lo que aprendes en #general-chill-chat
         */
        emit NewWave(msg.sender, block.timestamp, _message);
    }

    /*
     * he añadido la función getAllWaves que nos devuelve la lista de structs waves.
     * ¡Eso nos facilitará la ercuperación de los saludos desde la web!
     */
    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        // Opcional: ¡Añade esta línea si quieres que el contrato imprima el valor!
        // También lo vamos a imprimir en run.js.
        console.log("Tenemos %d saludos en total!", totalWaves);
        return totalWaves;
    }
}
```

🧐 Pruébalo
----------

Cada vez que cambiamos nuestro contrato, queremos cambiar `run.js` para probar la nueva funcionalidad que hemos añadido. ¡Así sabremos que funciona como queremos! Este es el aspecto que tiene el mío ahora.

Aquí está mi `run.js` actualizado. 

```javascript
const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();
  console.log('Dirección del contrato:', waveContract.address);

  let waveCount;
  waveCount = await waveContract.getTotalWaves();
  console.log(waveCount.toNumber());

  /**
   * ¡Enviemos unos cuantos saludos!
   */
  let waveTxn = await waveContract.wave('¡Un mensaje!');
  await waveTxn.wait(); // Esperar a que la transacción sea minada

  const [_, randomPerson] = await hre.ethers.getSigners();
  waveTxn = await waveContract.connect(randomPerson).wave('¡Otro mensaje!');
  await waveTxn.wait(); // Esperar a que la transacción sea minada

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

Esto es lo que obtengo en mi terminal cuando ejecuto esto usando `npx hardhat run scripts/run.js`.

![](https://i.imgur.com/oPKy2dP.png)

¡Boom! Bastante impresionante, ¿verdad :)? 

¡¡El array da un poco de miedo pero podemos ver los datos junto a las palabras `waver`, `message`, y `timestamp`!! Almacena correctamente nuestros mensajes `"Un mensaje"` y `"Otro mensaje"` :).

Nota: "timestamp" se nos devuelve como tipo "BigNumber". Aprenderemos a trabajar con él más adelante, pero que sepas que todo va bien.

Parece que las cosas funcionan, ¡vamos a pasar a nuestro **frontend** para poder ver todos nuestros saludos en la web!


✈️ Redespliegue
------------

Veamos, ahora que hemos actualizado nuestro contrato tenemos que hacer algunas cosas:

1\. Tenemos que desplegar de nuevo.

2\. Tenemos que actualizar la dirección del contrato en nuestro frontend.

3\. Tenemos que actualizar el archivo abi en nuestro frontend. 

**La gente constantemente se olvida de hacer estos 3 pasos cuando cambian su contrato. No lo olvides xd.**

¿Por qué necesitamos hacer todo esto? Bueno, es porque los smart contracts son **inmutables.** No pueden cambiar. Son permanentes. Eso significa que cambiar un contrato requiere una redistribución completa. Esto también **restablecerá** todas las variables ya que sería tratado como un contrato nuevo. **Eso significa que perderíamos todos los datos de saludos si quisiéramos actualizar el código del contrato.**

**Bonus**: En #general-chill-chat, ¿alguien puede decirme alguna solución? ¿En qué lugar podríamos almacenar nuestros datos de saludos y así poder actualizar el código de nuestro contrato y mantener nuestros datos originales? Hay bastantes soluciones ¡dinos lo que encuentras!

Así que lo que hay que hacer ahora es

1\. Desplegar de nuevo usando `npx hardhat run scripts/deploy.js --network rinkeby`.

2\. Cambiar `contractAddress` en `App.js` para que sea la nueva dirección del contrato que obtuvimos en el paso anterior en el terminal, tal y como hicimos la primera vez que desplegamos.

3\. Obtén el archivo abi actualizado de `artifacts` como hicimos antes y cópialo y pégalo en Replit. Si olvidaste cómo hacer esto, asegúrate de revisar la lección [aquí](https://app.buildspace.so/courses/CO02cf0f1c-f996-4f50-9669-cf945ca3fb0b/lessons/LE52134606-af90-47ed-9441-980479599350) y ver el video que hice sobre los archivos ABI a continuación: 
[Loom](https://www.loom.com/share/ddecf3caf54848a3a01edd740683ec48).

**De nuevo -- necesitas hacer esto cada vez que cambies el código de tus contratos.**

🔌 Enchufando todo a nuestro cliente
----------------------------------

Aquí está la nueva función que he añadido a `App.js`.

```javascript
const [currentAccount, setCurrentAccount] = useState("");
  /*
   *Propiedad de estado para almacenar todos los saludos
   */
  const [allWaves, setAllWaves] = useState([]);
  const contractAddress = "0xd5f08a0ae197482FA808cE84E00E97d940dBD26E";

  /*
   * Crea un método que obtenga todos los saludos de tu contrato
   */
  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Llama al método getAllWaves desde tu Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();
        

        /*
         * Sólo necesitamos la dirección, el timestamp y el mensaje en nuestro UI, así que
         * elígelos
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            dirección: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            mensaje: wave.mensaje
          });
        });

        /*
         * Almacena nuestros datos en React State
         */
        setAllWaves(wavesCleaned);
      } else {
        console.log("¡El objeto Ethereum no existe!")
      }
    } catch (error) {
      console.log(error);
    }
  }
  ```

Bastante simple y muy similar a lo que hemos trabajado antes para conectarnos al proveedor, obtenemos el signer y nos conectamos al contrato. Hago un poco de magia aquí haciendo un bucle a través de todos nuestros saludos y guardándolos en un array que podemos usar más tarde. Siéntete libre de usar console.log `waves` para ver lo que obtienes allí si tienes problemas.

¿Dónde llamamos a la nueva función `getAllWaves()`? Bueno, queremos llamarla cuando sepamos con certeza que el usuario tiene una cartera conectada con una cuenta autorizada, porque necesitamos una cuenta autorizada para llamarla. Pista: tienes que llamar a esta función en algún lugar de `checkIfWalletIsConnected()`. Te dejo que lo descubras. Recuerda, queremos llamarla cuando sepamos con seguridad que tenemos una cuenta conectada + autorizada.

Lo último que hice fue actualizar nuestro código HTML para que nos muestre los datos.

```javascript
return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        👋 Holaaa!
        </div>

        <div className="bio">
          ¡Soy Farza! He trabajado en coche autónomos. Bastante guay ¿no? ¡Conecta tu cartera de Ethereum y mándame un saludo!
        </div>

        <button className="waveButton" onClick={null}>
          Salúdame
        </button>
        
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Conecta tu cartera
          </button>
        )}

        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Dirección: {wave.address}</div>
              <div>Tiempo: {wave.timestamp.toString()}</div>
              <div>Mensaje: {wave.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
  ```

Básicamente, lo que hago es recorrer `allWaves` y crear nuevos divs para cada uno de los saludos y mostrar esos datos en la pantalla.

🙀 ¡Ah! ¡`wave()` está roto!
---------------------------

¡Así que, en `App.js`, nuestra función `wave()` ya no funciona! ¡Si intentamos saludar nos dará un error porque espera que se envíe un mensaje ahora con ella! Por ahora, puedes arreglar esto programando un mensaje como

```
const waveTxn = await wavePortalContract.wave("esto es un mensaje")
```

Te dejo esto a ti: averigua cómo añadir un cuadro de texto que permita a los usuarios añadir su propio mensaje personalizado que puedan enviar a la función wave :).

¿El objetivo? Quieres dar a tus usuarios la posibilidad de enviarte un mensaje personalizado mediante un cuadro de texto que puedan escribir. ¿O tal vez quieres que te envíen un enlace a un meme? ¿O un enlace a Spotify? ¡Tú decides!

👷 ¡Construye una UI!
--------------------

¡Ve a hacer que esto se vea como quieres que se vea! No te voy a enseñar mucho de cómo hacerlo aquí. ¡Siéntete libre de hacer preguntas en la #section-3-help!