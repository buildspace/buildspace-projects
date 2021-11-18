💸 Envía ETH a la gente que te saluda
----------------------------------------

¡Ahora lo que queremos hacer es enviar ETH a la gente que nos saluda! Por ejemplo, tal vez quieras hacer que haya un 1% de posibilidades de que alguien gane 5 dólares por saludarte. O tal vez quieras hacer que todos los que te saluden reciban $0.01 en ETH por saludarte.

Incluso puedes hacer que puedas enviar manualmente ETH a las personas cuyos mensajes te hayan gustado más. ¡¡Quizás te enviaron un temazo!!

**Enviar ETH a los usuarios fácilmente es una parte central de los smart contracts y una de las cosas más chulas**, así que, ¡hagámoslo!

Para empezar, vamos a dar a todos los que nos saluden `0,0001 ETH`. Que son 0,31 dólares :). ¡Y todo esto sucederá en la testnet, por lo que, es dinero falso!

Mira mi función `wave` actualizada en `WavePortal.sol`.

```solidity
function wave(string memory _message) public {
    totalWaves += 1;
    console.log("%s ha saludado!", msg.sender);

    waves.push(Wave(msg.sender, _message, block.timestamp));

    emit NewWave(msg.sender, block.timestamp, _message);

    uint256 prizeAmount = 0.0001 ether;
    require(
        prizeAmount <= address(this).balance,
        "Intentando retirar más dinero del que tiene el contrato".
    );
    (bool success, ) = (msg.sender).call{value: prizeAmount}("");
    require(success, "No se ha podido retirar el dinero del contrato.");
}
```

Esto es bastante impresionante.

Con `prizeAmount` acabo de iniciar una cantidad de premio. De hecho, Solidity nos permite utilizar la palabra clave `ether` para poder representar fácilmente cantidades monetarias. ¡Fácil :)!

También hemos usado algunas palabras clave nuevas. Verás `require` que básicamente comprueba que alguna condición es verdadera. Si no es verdadera, saldrá de la función y cancelará la transacción. Es como una sentencia "if" tuneada.

En este caso, está comprobando si `prizeAmount <= address(this).balance`. Aquí, `address(this).balance` es el **saldo del propio contrato.**

¿Por qué? **Bueno, para que podamos enviar ETH a alguien, nuestro contrato necesita tener ETH en él.

Cómo funciona esto es cuando desplegamos por primera vez el contrato, lo "financiamos" :). Hasta ahora, ¡nunca hemos financiado nuestro contrato! Siempre ha valido 0 ETH. ¡Eso significa que nuestro contrato no puede enviar ETH a la gente porque **simplemente no tiene ninguno**! Cubriremos la financiación en la siguiente sección.

Lo que mola de

```solidity
require(prizeAmount <= address(this).balance, "Intentando retirar más dinero del que tiene el contrato.");
```

es que nos permite asegurarnos de que el *saldo del contrato* es mayor que la *cantidad del premio*, y si lo es, ¡podemos seguir adelante con la entrega del premio! Si no lo es `require` esencialmente parará la transacción y será como, "¡Oye, este contrato no puede pagarte!". 

`(msg.sender).call{value: prizeAmount}("")` es la línea mágica donde enviamos el dinero :). ¡La sintaxis es un poco rara! ¡Fíjate en que le pasamos `prizeAmount`!

`require(success` es lo que nos permite saber si la transacción ha sido un éxito :). Si no lo fuera, marcaría la transacción como un error y diría `"No se ha podido retirar el dinero del contrato."`.

Genial, ¿verdad :)?

🏦 ¡Financia el contrato para poder enviar ETH!
-----------------------------------------------

Hemos configurado nuestro código para enviar ETH. ¡Bien! Ahora tenemos que asegurarnos de que nuestro contrato está financiado, de lo contrario, ¡no tendremos ETH para enviar!

Primero vamos a trabajar en `run.js`. Recuerda, `run.js` es como nuestro campo de pruebas donde queremos asegurarnos de que la funcionalidad principal de nuestros contratos funciona antes de ir a desplegarlo. Es muy difícil depurar el código del contrato y el código de la interfaz al mismo tiempo, así que lo separamos.

Vayamos a `run.js` y hagamos algunos cambios para asegurarnos de que todo funciona. Aquí está mi `run.js` actualizado.

```javascript
const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther('0.1'),
  });
  await waveContract.deployed();
  console.log('Dirección del contrato:', waveContract.address);

  /*
   * Obtener el saldo del contrato
   */
  let contractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  );
  console.log(
    'Saldo del contrato:',
    hre.ethers.utils.formatEther(contractBalance)
  );

  /*
   * Enviar saludo
   */
  let waveTxn = await waveContract.wave('¡Un mensaje!');
  await waveTxn.wait();

  /*
   * ¡Obtener el balance del contrato para ver qué ha pasado!
   */
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

La magia está en `hre.ethers.utils.parseEther('0.1'),`. Aquí es donde digo, "ve y despliega mi contrato y fináncialo con 0.1 ETH". Esto sacará ETH de mi cartera, y lo utilizará para financiar el contrato. **Hecho.**

Luego hago `hre.ethers.utils.formatEther(contractBalance)` para comprobar si mi contrato tiene realmente un saldo de 0,1. Uso una función que me da `ethers` llamada `getBalance` y le paso la dirección de mi contrato.

¡¡Pero entonces, también queremos ver si cuando llamamos a `wave` 0.0001 ETH se retira correctamente del contrato!! Por eso vuelvo a imprimir el saldo después de llamar a `wave`.

Cuando ejecutes 

```bash
npx hardhat run scripts/run.js
```

Verás que nos encontramos con un pequeño error.

Nos dirá algo como

```bash
Error: non-payable constructor cannot override value
```

Lo que esto dice es que nuestro contrato no puede pagar a la gente en este momento. Esto se soluciona fácilmente, tenemos que añadir la palabra clave `payable` a nuestro constructor en `WavePortal.sol`. Pruébalo:

```solidity
constructor() payable {
  console.log("¡El constructor ha funcionado!");
}
```

Eso es todo :).

Ahora, cuando hago 

```bash
npx hardhat run scripts/run.js
```

Esto es lo que obtengo:

![](https://i.imgur.com/8jZHL6b.png)

**Boom**.

Acabamos de enviar algunos ETH desde nuestro contrato, ¡victoria! ¡Y, sabemos que tuvimos éxito porque el saldo del contrato bajó en 0.0001 ETH de 0.1 a 0.0999!

✈️ Actualizar el script de despliegue para financiar el contrato
----------------------------------------

Tenemos que hacer una pequeña actualización en `deploy.js`.

```javascript
const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther('0.001'),
  });

  await waveContract.deployed();

  console.log('Dirección de WavePortal: ', waveContract.address);
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

Todo lo que hice fue financiar el contrato con 0.001 ETH así:

```javascript
const waveContract = await waveContractFactory.deploy({
    valor: hre.ethers.utils.parseEther('0.001'),
});
```
¡Lo mejor es desplegar en redes de prueba con una pequeña cantidad de ETH primero para probar!

 ¡Y también añadí `await waveContract.deployed()` para que me sea fácil saber cuándo se ha desplegado!

¡Fácil!

Vamos a desplegar nuestro contrato utilizando la misma línea de siempre

```bash
npx hardhat run scripts/deploy.js --network rinkeby
```

¡Ahora cuando vayas a [Etherscan](https://rinkeby.etherscan.io/) y pegues la dirección de tu contrato verás que tu contrato ahora tiene un valor de 0.001 ETH! ¡Olé!

**Recuerda actualizar tu frontend con la nueva dirección del contrato *y* el nuevo archivo ABI. De lo contrario, se** **romperá**. 

¡Prueba tu función wave y asegúrese de que todavía funciona!

🎁 Repasemos
----------

Se siente algo especial cuando usamos ETH real para alimentar nuestros contratos ¿verdad? ¡Echa un vistazo a [este enlace](https://gist.github.com/adilanchian/236fe9f3a56b73751060800cae3a780d) para ver todo el código escrito en esta sección!