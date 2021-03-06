## 馃摝 Almacenando mensajes con arreglos usando structs.

Entonces, 隆ahora tenemos una aplicaci贸n web completa que puede comunicarse con la cadena de bloques!

Ahora si recuerdas, queremos que nuestra aplicaci贸n final sea un lugar donde la gente pueda saludarnos y enviarnos un mensaje. 
Tambi茅n queremos mostrar todos los saludos/mensajes anteriores que hemos recibido. 隆Eso es lo que haremos en esta lecci贸n!

As铆 que al final de estas lecciones lo que queremos es:
1\. Permitir que los usuarios env铆en un mensaje junto con el saludo.
2\. Tener estos datos guardados de alguna manera en la cadena de bloques.
3\. Mostrar los datos en nuestro sitio para que cualquiera pueda venir a ver a todas las personas que nos han saludado y poder ver sus mensajes.

Echa un vistazo a mi c贸digo actualizado. He agregado muchos comentarios para ayudarte a ver qu茅 cambi贸 :).

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
## 馃 Prob茅moslo.

Cada vez que hagamos cambios en nuestro contrato, debemos cambiar run.js para probar la nueva funcionalidad que agreguemos. 
隆As铆 es como sabemos que est谩 funcionando como queremos! As铆 es como se ve el m铆o en este momento.

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
Este es el mensaje que obtuve y deber谩s obtener en tu terminal cuando ejecutes lo siguiente:

`npx hardhat run scripts/run.js`.

![](https://i.imgur.com/oPKy2dP.png)

隆Boom! 驴Muy impresionante no crees?
隆El arreglo parece un poco aterrador, pero podemos ver los datos junto a las palabras`waver`, `message` y `timestamp`! 
Almacena correctamente nuestros mensajes `"A message"` and `"Another message"` :).

Nota: " timestamp " se nos devuelve como tipo "BigNumber". Aprenderemos c贸mo trabajar con 茅l m谩s tarde, 隆pero no hay nada malo aqu铆!
Parece que las cosas funcionan, pasemos a nuestra **interfaz** para que podamos ver todos nuestros saludos en el sitio web.

## 鉁堬笍 Volvamos a implementar.

Entonces, ahora que hemos actualizado nuestro contrato, debemos hacer algunas cosas:

1\. Necesitamos implementarlo nuevamente.
2\. Necesitamos actualizar la direcci贸n del contrato inteligente en nuestra interfaz.
3\. Necesitamos actualizar el archivo ABI en nuestra interfaz.

**Generalmente las personas olvidan constantemente hacer estos 3 pasos cuando cambia su contrato. No lo olvides t煤 jajaja.**

驴Por qu茅 tenemos que hacer todo esto? Bueno, pues porque los contratos inteligentes son **inmutables**. No pueden cambiar. Son permanentes. 
Eso significa que cambiar un contrato requiere una redistribuci贸n completa. 
Esto tambi茅n **restablecer谩** todas las variables, ya que se tratar铆a como un contrato nuevo. 
**Eso significa que perder铆amos todos nuestros datos de los saludos si quisi茅ramos actualizar el c贸digo del contrato.**

**Bonificaci贸n**: en #general-chill-chat, 驴alguien puede decirme algunas formas de solucionarlo? 
驴D贸nde m谩s podr铆amos almacenar nuestros datos de saludos y donde podr铆amos actualizar el c贸digo de nuestro contrato y conservar nuestros datos originales? 
隆D茅jame saber lo que encuentras!

Lo que tenemos que hacer es:

1\.	Implementar nuevamente utilizando: `npx hardhat run scripts/deploy.js --network rinkeby`
2\.	Cambiar `contractAddress` en`App.js` para que sea la nueva direcci贸n de contrato que obtuvimos del paso anterior en la terminal, 
    tal como lo hicimos la primera vez que implementamos.
3\.	Obtener el archivo ABI actualizado de los `artifacts` como lo hicimos antes, copiarlo y pegarlo en Replit como lo hicimos antes. 
Si olvidaste c贸mo se hace esto, 
puedes volver a revisar la lecci贸n [aqu铆](https://app.buildspace.so/courses/CO02cf0f1c-f996-4f50-9669-cf945ca3fb0b/lessons/LE52134606-af90-47ed-9441-980479599350).

**Nuevamente e importante 鈥? deber谩s hacer estos pasos cada que quieras hacer cambios al c贸digo de tu contrato.**

## 馃攲 Conectando todo a nuestro cliente.

Aqu铆 puedes ver la nueva funci贸n que a帽ad铆 a `App.js`.

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
隆Bastante simple y muy similar a las cosas en las que trabajamos previamente acerca de la forma en la que nos conectamos con el proveedor, 
obtener firmante y conectarnos al contrato! Hice un poco de magia aqu铆 guard谩ndolas muy bien en un arreglo que podemos usar m谩s tarde. 
Puede usar console.log `waves` para ver qu茅 obtienes si tienes alg煤n problema.
  
Sin embargo, 驴d贸nde llamamos a esta nueva funci贸n `getAllWaves()`? Bueno, 隆queremos llamarlo cuando sepamos con certeza que el usuario tiene 
una cartera digital conectada con una cuenta autorizada porque necesitamos una cuenta autorizada para llamar al contrato! 
Sugerencia: debe llamar a esta funci贸n en alg煤n lugar de `checkIfWalletIsConnected()`. Aver铆gualo por tu cuenta. 

隆Recuerda, queremos llamarlo cuando sepamos con certeza que tenemos una cuenta conectada + autorizada!

隆Lo 煤ltimo que hice fue actualizar nuestro c贸digo HTML para mostrar los datos y que podamos verlos!

```javascript
return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          馃憢 Hey there!
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
  B谩sicamente, lo que hace es reviso `allWaves`. Se crearon nuevos divs para cada saludo y mostramos esos datos en la pantalla.
  
## 馃檧 ahh!! wave() est谩 roto!

Bueno, en`App.js` nuestra funci贸n`wave()` no funciona. Si tratamos de dar un saludo nos muestra un error porque est谩 esperando que se env铆e un mensaje. 
Mientras, puedes arreglar esto codificando y fijando un mensaje como:

```
const waveTxn = await wavePortalContract.wave("this is a message")
```
Esto te lo dejo esto a ti: descubre c贸mo agregar un cuadro de texto que permita a los usuarios agregar su propio mensaje personalizado que pueden enviar 
a la funci贸n de saludos :).
驴La meta es? 隆Dar a tus usuarios la posibilidad de enviar mensaje personalizados usando un cuadro de texto en el que pueden escribir! 
驴O tal vez quieres que te env铆en un enlace a un meme? 驴O un enlace de Spotify? 隆T煤 decides!

## 馃懛鈥嶁檧锔? 隆Ve a construir una interfaz de usuario!
隆Haz que esto se vea c贸mo quieres que se vea! No te ense帽ar茅 como hacer eso aqu铆. 隆No dudes en hacer preguntas en la #secci贸n-3-help!



