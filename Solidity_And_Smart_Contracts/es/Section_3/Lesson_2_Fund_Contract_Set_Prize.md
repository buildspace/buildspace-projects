
## 💸 Envía ETH a las personas que te saluden.

Ahora lo que queremos hacer es enviar ETH a los usuarios que nos saluden. Por ejemplo, tal vez quieres que haya sólo un 1% de probabilidad 
de que alguien gane $5 por tan sólo saludarte. O, tal vez prefieres que todo mundo gane $0.01 en ETH cada vez que te mande saludos.

Incluso puedes enviar manualmente ETH a las personas cuyos mensajes te hayan gustado más. ¡Tal vez te enviaron una canción increíble!

**Enviar ETH de manera fácil es una parte central de los contratos inteligentes y también una de las mejores** así que ¡Hagámoslo!

Para comenzar vamos a enviar `0.0001 ETH` a todos los que nos saluden algo así como $0.31 :). Todo esto pasa en la red de pruebas así que es dinero falso.
Mira la función `wave` actualizada en `WavePortal.sol`.

```solidity
function wave(string memory _message) public {
    totalWaves += 1;
    console.log("%s has waved!", msg.sender);

    waves.push(Wave(msg.sender, _message, block.timestamp));

    emit NewWave(msg.sender, block.timestamp, _message);

    uint256 prizeAmount = 0.0001 ether;
    require(
        prizeAmount <= address(this).balance,
        "Trying to withdraw more money than the contract has."
    );
    (bool success, ) = (msg.sender).call{value: prizeAmount}("");
    require(success, "Failed to withdraw money from contract.");
}
```
Esto es increíble.

Con `prizeAmount` inicializamos el monto del premio. Solidity nos permite usar la palabra clave `ether` y así fácilmente podemos usar cantidades monetarias. 
¡Muy conveniente :)!

Tenemos algunas otras palabras clave. Puedes ver `require` lo cual básicamente revisa si la condición es cierta, si no fuera cierta se termina la función 
y se cancela la transacción. ¡Es una declaración muy elegante!

En este caso la condición es si: `prizeAmount <= address(this).balance`.

`address(this).balance` es el saldo de nuestro contrato.

¿Por qué? **Bueno, para que podamos enviar ETH a alguien, nuestro contrato debe tener ETH.**

Cómo funciona esto, cuando implementamos el contrato por primera vez, lo "financiamos" o “fondeamos” :). 
Pero nosotros ¡¡Hasta ahora, **nunca** hemos financiado nuestro contrato!! Siempre ha valido 0 ETH. ¡Eso significa que nuestro contrato no puede 
enviar ETH a las personas porque **simplemente no tiene saldo!** ¡Cubriremos este tema en la siguiente sección!

Esto es muy bueno

```solidity
require(prizeAmount <= address(this).balance, "Trying to withdraw more money than the contract has.");
```
Nos permite asegurarnos de que el *saldo del contrato* sea mayor que el *monto del premio*, y si lo es, ¡podemos seguir adelante con la entrega del premio! 
Si no `require`, esencialmente eliminará la transacción y dirá: "¡Oye, este contrato no puede pagarte!".

`(msg.sender).call{value: prizeAmount}("")` es la línea mágica donde enviamos dinero :). ¡La sintaxis es un poco rara! ¡Observa cómo pasamos el `prizeAmount`!

`require(success` es donde sabemos si la transacción fue exitosa :). Si no fuera así, marcaría la transacción como un error y diría 
`"Failed to withdraw money from contract."`

Bastante impresionante ¿no crees :)?

## 🏦 ¡Poner fondos al contrato para que podamos enviar ETH!

Ahora hemos configurado nuestro código para enviar ETH. ¡Qué bueno! Ahora debemos asegurarnos de que nuestro contrato tenga fondos, de lo contrario, 
¡no tenemos ETH para enviar!

Primero vamos a trabajar en `run.js`. Recuerda, `run.js` es nuestro campo de pruebas donde nos aseguraremos de que la funcionalidad central de nuestros 
contratos es correcta antes de implementarla. Es **muy difícil** depurar el código del contrato y el código de la interfaz al mismo tiempo, así que mejor 
lo separamos.

Vayamos a `run.js` y hagamos algunos cambios para asegurarnos de que todo funcione. Aquí está `run.js` actualizado.

```javascript
const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await waveContract.deployed();
  console.log("Contract addy:", waveContract.address);

  /*
   * Get Contract balance
   */
  let contractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  );
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  /*
   * Send Wave
   */
  let waveTxn = await waveContract.wave("A message!");
  await waveTxn.wait();

  /*
   * Get Contract balance to see what happened!
   */
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

La magia está en `hre.ethers.utils.parseEther("0.1"),`. Aquí es donde decimos, "implementa el contrato y ponle saldo de 0.1 ETH". 
Esto mandará ETH de mi cartera y lo usará para financiar el contrato. **Eso es todo**.

Luego en `hre.ethers.utils.formatEther(contractBalance)` hago prueba para ver si mi contrato realmente tiene un saldo de 0.1. 
¡Uso una función que `ethers` me da se llama `getBalance` y le pongo la dirección de mi contrato!

Pero luego, ¡también queremos ver que cuando invoquemos a `wave` si realmente 0.0001 ETH se eliminan correctamente del contrato! 
Es por eso que se vuelve a imprimir el saldo después de llamar a `wave`.
Ejecutamos.

```bash
npx hardhat run scripts/run.js
```
Verás que tenemos un pequeño error.
Algo así como:

```bash
Error: non-payable constructor cannot override value
```
¡Lo que esto quiere decir es que nuestro contrato no puede pagar el premio a la gente en este momento! 
Esta es una solución rápida que propongo, necesitamos agregar la palabra clave `payable` a nuestro constructor en `WavePortal.sol`. 
Revisa lo siguiente:

```solidity
constructor() payable {
  console.log("We have been constructed!");
}
```
Eso es todo. 
Ahora ejecutamos:

```bash
npx hardhat run scripts/run.js
```
Esto es lo que vamos a obtener:

![](https://i.imgur.com/8jZHL6b.png)

**Boom.**

Acabamos de enviar ETH de nuestro contrato, ¡gran éxito! ¡Y sabemos que fuimos exitosos porque el saldo del contrato se redujo en 0!0001 ETH de 0.1 a 0.0999!

## ✈️ Actualizar el código para poner fondos al contrato.

Necesitamos hacerle una pequeña actualización a `deploy.js`.

```javascript
const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.001"),
  });

  await waveContract.deployed();

  console.log("WavePortal address: ", waveContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
```
Todo lo que hice fue fondear el contrato 0.001 ETH así:

```javascript
const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.001"),
});
```

¡Siempre es bueno hacer las implementaciones en redes de prueba y con cantidades pequeñas de ETH para ir probando!
 ¡Y también agregué `await waveContract.deployed()` para que me sea más fácil saber cuándo se implementa!
¡Muy fácil!
Implementemos nuestro contrato usando la misma línea que hemos utilizado antes:

```bash
npx hardhat run scripts/deploy.js --network rinkeby
```

Ahora cuando vayamos a [Etherscan](https://rinkeby.etherscan.io/) y peguemos la dirección de nuestro contrato podrás ver que ahora nuestro contrato tiene un valor de 0.001 ETH. ¡Éxito!

**Recuerda de actualizar tu interfaz con la nueva dirección del contrato inteligente y el nuevo archivo ABI. De otra manera no va a funcionar.**

¡Haz pruebas de la función de saludos y asegúrate de que aún funcione!

## 🎁 Un detalle.

¡Echa un vistazo a [este enlace](https://gist.github.com/adilanchian/236fe9f3a56b73751060800cae3a780d) para ver todo el código escrito en esta sección!








