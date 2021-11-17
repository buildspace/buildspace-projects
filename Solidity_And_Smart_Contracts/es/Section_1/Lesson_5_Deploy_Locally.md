👀 Escribir un script para desplegar localmente
-------------------------------------

*"Espera, ¿no he desplegado ya en mi red local? "*.

Bueno, más o menos.

Recuerda que cuando ejecutas `scripts/run.js` en realidad estás:

1\. Creando una nueva red local de Ethereum.\
2\. Desplegando tu contrato.\
3\. Entonces, cuando el script termina, Hardhat automáticamente **destruye** esa red local.

Necesitamos una manera de mantener la red local viva. ¿Por qué? Bueno, piensa en un servidor local. Quieres mantenerlo vivo para poder seguir hablando con él. Por ejemplo, si tienes un servidor local con una API que has creado, quieres mantener ese servidor local vivo para poder trabajar en tu sitio web y probarlo.

Vamos a hacer lo mismo aquí.

Dirígete a tu terminal y crea una **nueva** ventana. En esta ventana, vuelve a tu proyecto `my-wave-portal`. Entonces, sigue adelante y ejecuta

```bash
npx hardhat node
```

BOOM.

Acabas de iniciar una red local de Ethereum que **se mantiene viva**. Y, como puedes ver Hardhat nos dio 20 cuentas para trabajar y les dio a todos 10000 ETH ¡ahora somos ricos! ¡Wow! El mejor proyecto de la historia.

Así que ahora mismo, esto es sólo un blockchain vacío. ¡No hay bloques!

¡Queremos crear un nuevo bloque y poner nuestro smart contract en él! Hagámoslo.

En la carpeta `scripts`, crea un archivo llamado `deploy.js`. Aquí está el código que debes incluir. Es muy similar a `run.js`.

```javascript
const main = async () => {
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();

  console.log('Desplegando contrato con la cuenta: ', deployer.address);
  console.log('Saldo de la cuenta: ', accountBalance.toString());

  const Token = await hre.ethers.getContractFactory('WavePortal');
  const portal = await Token.deploy();
  await portal.deployed();

  console.log('Dirección de WavePortal: ', portal.address);
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

🎉 DESPLIEGA
---------

El comando que vamos a ejecutar para desplegar localmente es:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

**Asegúrate de hacer esto desde el directorio** `my-wave-portal` **desde una ventana de terminal diferente. No queremos estropear la ventana de terminal que está manteniendo nuestra red local de Ethereum viva.**

Bien, una vez que lo ejecuto, esto esto es lo que obtengo:

![](https://i.imgur.com/ZXehYOk.png)

Épico.

¡Hemos desplegado el contrato, y también tenemos su dirección en el blockchain! Nuestro sitio web va a necesitar esto para saber dónde buscar su contrato en la blockchain. (Imagina que tuviera que buscar nuestro contrato en toda la blockchain. Eso sería... un rollo).

En tu terminal que mantiene viva la red local de Ethereum, ¡verás algo nuevo!

![](https://i.imgur.com/DmhZRJN.png)

INTERESANTE. Pero... ¿qué es el gas? ¿Qué significa el bloque #1? ¿Qué es el código grande junto a "Transaction"? Quiero que intentes buscar estas cosas en Google. Y haz preguntas en el #general-chill-chat :).


🚨 Antes de hacer click en "Next Lesson"
-------------------------------------------

En serio, date una palmadita en la espalda. Lo has hecho genial. A continuación, vamos a crear una web que interactue con nuestra red local de Ethereum y va a ser increíble. Dirígete a #progress y dime cómo te está yendo hasta ahora. Me encantaría que me dieras tu opinión.


🎁 Cierre de la Sección
------------------

¡Muy bien! Has llegado al final de la sección. ¡Revisa [este enlace](https://gist.github.com/adilanchian/9f745fdfa9186047e7a779c02f4bffb7) para asegurarte de que vas por buen camino con tu código!
