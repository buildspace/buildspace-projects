## 📦 Almacenando mensajes con arreglos usando structs.

Entonces, ¡ahora tenemos una aplicación web completa que puede comunicarse con la cadena de bloques!

Ahora si recuerdas, queremos que nuestra aplicación final sea un lugar donde la gente pueda saludarnos y enviarnos un mensaje. 
También queremos mostrar todos los saludos/mensajes anteriores que hemos recibido. ¡Eso es lo que haremos en esta lección!

Así que al final de estas lecciones lo que queremos es:
1\. Permitir que los usuarios envíen un mensaje junto con el saludo.
2\. Tener estos datos guardados de alguna manera en la cadena de bloques.
3\. Mostrar los datos en nuestro sitio para que cualquiera pueda venir a ver a todas las personas que nos han saludado y poder ver sus mensajes.

Echa un vistazo a mi código actualizado. He agregado muchos comentarios para ayudarte a ver qué cambió :).

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;

    /*
     * A little magic, Google what events are in Solidity!
     */
    event NewWave(address indexed from, uint256 timestamp, string message);

    /*
     * I created a struct here named Wave.
     * A struct is basically a custom datatype where we can customize what we want to hold inside it.
     */
    struct Wave {
        address waver; // The address of the user who waved.
        string message; // The message the user sent.
        uint256 timestamp; // The timestamp when the user waved.
    }

    /*
     * I declare a variable waves that lets me store an array of structs.
     * This is what lets me hold all the waves anyone ever sends to me!
     */
    Wave[] waves;

    constructor() {
        console.log("I AM SMART CONTRACT. POG.");
    }

    /*
     * You'll notice I changed the wave function a little here as well and
     * now it requires a string called _message. This is the message our user
     * sends us from the frontend!
     */
    function wave(string memory _message) public {
        totalWaves += 1;
        console.log("%s waved w/ message %s", msg.sender, _message);

        /*
         * This is where I actually store the wave data in the array.
         */
        waves.push(Wave(msg.sender, _message, block.timestamp));

        /*
         * I added some fanciness here, Google it and try to figure out what it is!
         * Let me know what you learn in #general-chill-chat
         */
        emit NewWave(msg.sender, block.timestamp, _message);
    }

    /*
     * I added a function getAllWaves which will return the struct array, waves, to us.
     * This will make it easy to retrieve the waves from our website!
     */
    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        // Optional: Add this line if you want to see the contract print the value!
        // We'll also print it over in run.js as well.
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }
}
```
## 🧐 Probémoslo.

Cada vez que hagamos cambios en nuestro contrato, debemos cambiar run.js para probar la nueva funcionalidad que agreguemos. 
¡Así es como sabemos que está funcionando como queremos! Así es como se ve el mío en este momento.

```javascript
const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();
  console.log("Contract addy:", waveContract.address);

  let waveCount;
  waveCount = await waveContract.getTotalWaves();
  console.log(waveCount.toNumber());

  /**
   * Let's send a few waves!
   */
  let waveTxn = await waveContract.wave("A message!");
  await waveTxn.wait(); // Wait for the transaction to be mined

  const [_, randomPerson] = await hre.ethers.getSigners();
  waveTxn = await waveContract.connect(randomPerson).wave("Another message!");
  await waveTxn.wait(); // Wait for the transaction to be mined

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
Este es el mensaje que obtuve y deberás obtener en tu terminal cuando ejecutes lo siguiente:

`npx hardhat run scripts/run.js`.

![](https://i.imgur.com/oPKy2dP.png)

¡Boom! ¿Muy impresionante no crees?
¡El arreglo parece un poco aterrador, pero podemos ver los datos junto a las palabras`waver`, `message` y `timestamp`! 
Almacena correctamente nuestros mensajes `"A message"` and `"Another message"` :).

Nota: " timestamp " se nos devuelve como tipo "BigNumber". Aprenderemos cómo trabajar con él más tarde, ¡pero no hay nada malo aquí!
Parece que las cosas funcionan, pasemos a nuestra **interfaz** para que podamos ver todos nuestros saludos en el sitio web.

## ✈️ Volvamos a implementar.

Entonces, ahora que hemos actualizado nuestro contrato, debemos hacer algunas cosas:

1\. Necesitamos implementarlo nuevamente.
2\. Necesitamos actualizar la dirección del contrato inteligente en nuestra interfaz.
3\. Necesitamos actualizar el archivo ABI en nuestra interfaz.

**Generalmente las personas olvidan constantemente hacer estos 3 pasos cuando cambia su contrato. No lo olvides tú jajaja.**

¿Por qué tenemos que hacer todo esto? Bueno, pues porque los contratos inteligentes son **inmutables**. No pueden cambiar. Son permanentes. 
Eso significa que cambiar un contrato requiere una redistribución completa. 
Esto también **restablecerá** todas las variables, ya que se trataría como un contrato nuevo. 
**Eso significa que perderíamos todos nuestros datos de los saludos si quisiéramos actualizar el código del contrato.**

**Bonificación**: en #general-chill-chat, ¿alguien puede decirme algunas formas de solucionarlo? 
¿Dónde más podríamos almacenar nuestros datos de saludos y donde podríamos actualizar el código de nuestro contrato y conservar nuestros datos originales? 
¡Déjame saber lo que encuentras!

Lo que tenemos que hacer es:

1\.	Implementar nuevamente utilizando: `npx hardhat run scripts/deploy.js --network rinkeby`
2\.	Cambiar `contractAddress` en`App.js` para que sea la nueva dirección de contrato que obtuvimos del paso anterior en la terminal, 
    tal como lo hicimos la primera vez que implementamos.
3\.	Obtener el archivo ABI actualizado de los `artifacts` como lo hicimos antes, copiarlo y pegarlo en Replit como lo hicimos antes. 
Si olvidaste cómo se hace esto, 
puedes volver a revisar la lección [aquí](https://app.buildspace.so/courses/CO02cf0f1c-f996-4f50-9669-cf945ca3fb0b/lessons/LE52134606-af90-47ed-9441-980479599350).

**Nuevamente e importante – deberás hacer estos pasos cada que quieras hacer cambios al código de tu contrato.**

## 🔌 Conectando todo a nuestro cliente.

Aquí puedes ver la nueva función que añadí a `App.js`.

```javascript
const [currentAccount, setCurrentAccount] = useState("");
  /*
   * All state property to store all waves
   */
  const [allWaves, setAllWaves] = useState([]);
  const contractAddress = "0xd5f08a0ae197482FA808cE84E00E97d940dBD26E";

  /*
   * Create a method that gets all waves from your contract
   */
  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();


        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }
  ```
¡Bastante simple y muy similar a las cosas en las que trabajamos previamente acerca de la forma en la que nos conectamos con el proveedor, 
obtener firmante y conectarnos al contrato! Hice un poco de magia aquí guardándolas muy bien en un arreglo que podemos usar más tarde. 
Puede usar console.log `waves` para ver qué obtienes si tienes algún problema.
  
Sin embargo, ¿dónde llamamos a esta nueva función `getAllWaves()`? Bueno, ¡queremos llamarlo cuando sepamos con certeza que el usuario tiene 
una cartera digital conectada con una cuenta autorizada porque necesitamos una cuenta autorizada para llamar al contrato! 
Sugerencia: debe llamar a esta función en algún lugar de `checkIfWalletIsConnected()`. Averígualo por tu cuenta. 

¡Recuerda, queremos llamarlo cuando sepamos con certeza que tenemos una cuenta conectada + autorizada!

¡Lo último que hice fue actualizar nuestro código HTML para mostrar los datos y que podamos verlos!

```javascript
return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          👋 Hey there!
        </div>

        <div className="bio">
          I am farza and I worked on self-driving cars so that's pretty cool right? Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
  ```
  Básicamente, lo que hace es reviso `allWaves`. Se crearon nuevos divs para cada saludo y mostramos esos datos en la pantalla.
  
## 🙀 ahh!! wave() está roto!

Bueno, en`App.js` nuestra función`wave()` no funciona. Si tratamos de dar un saludo nos muestra un error porque está esperando que se envíe un mensaje. 
Mientras, puedes arreglar esto codificando y fijando un mensaje como:

```
const waveTxn = await wavePortalContract.wave("this is a message")
```
Esto te lo dejo esto a ti: descubre cómo agregar un cuadro de texto que permita a los usuarios agregar su propio mensaje personalizado que pueden enviar 
a la función de saludos :).
¿La meta es? ¡Dar a tus usuarios la posibilidad de enviar mensaje personalizados usando un cuadro de texto en el que pueden escribir! 
¿O tal vez quieres que te envíen un enlace a un meme? ¿O un enlace de Spotify? ¡Tú decides!

## 👷‍♀️ ¡Ve a construir una interfaz de usuario!
¡Haz que esto se vea cómo quieres que se vea! No te enseñaré como hacer eso aquí. ¡No dudes en hacer preguntas en la #sección-3-help!



