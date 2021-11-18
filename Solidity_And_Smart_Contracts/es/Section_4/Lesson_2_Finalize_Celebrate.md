🎨 Finaliza tu UI, hazla tuya.
--------------------------------------

¡Tienes toda la funcionalidad básica hecha! Ahora, es el momento de que lo hagas tuyo, si no lo has hecho ya. Cambia el CSS, el texto, añade algunos videos divertidos de YouTube, añade tu propia biografía, lo que sea. Haz que las cosas se vean bien :).

**Dedica unos 30 minutos a esto. Te lo recomiendo.**

Por cierto, mientras probamos - es posible que quieras cambiar el temporizador de cooldown de tu contrato a unos 30 segundos en lugar de 15 minutos así:

```
require(lastWavedAt[msg.sender] + 30 seconds < block.timestamp, "Debe esperar 30 segundos antes de volver a saludar.");
```

¿Por qué? Bueno, puede ser molesto mientras estás probando que sólo puedas saludar cada 15 minutos. 

Así que he cambiado el mío a 30 segundos.

Cuando despliegues tu contrato **final**, ¡puedes cambiar esto a lo que quieras!

⛽️ Establecer el límite de gas
--------------------

Cuando intentas "saludar" ahora, puedes ver que a veces obtienes un error que se parece a "out of gas". ¿Por qué?

Bueno, básicamente Metamask tratará de estimar cuánto gas utilizará una transacción. Pero ¡a veces se equivoca! En este caso, se hace más difícil por el hecho de que tenemos algo de aleatoriedad involucrada. Por lo tanto, si el contrato envía un premio, entonces el saludo necesita pagar más gas ya que estamos ejecutando **más** código.

Estimar el gas es un problema difícil y una solución fácil para esto (para que nuestros usuarios no se enfaden cuando una transacción falle) es establecer un límite.

En App.js, he cambiado la línea que envía el saludo

```solidity
wavePortalContract.wave(message, { gasLimit: 300000 })
```

Lo que consigues es hacer que el usuario pague una cantidad fija de gas de 300.000. Y, si no lo usan todo en la transacción se les devolverá automáticamente.

Así, si una transacción cuesta 250.000  gas, entonces *después de *finalizar esa transacción se devolverán los 50.000 gas sobrantes que el usuario no utilizó :).

🔍 Validación de la transacción
---------------------------

Cuando tu contrato ha sido desplegado y lo estás probando con tu UI y tu cartera, puede ser confuso al principio determinar si la cuenta de tu monedero fue recompensada con éxito con el premio. Tu cuenta habrá consumido alguna cantidad de gas y potencialmente habrá sido recompensada con ETH. Entonces, ¿cómo puedes validar si tu contrato está funcionando como se esperaba?

Para validar, puedes abrir la dirección de tu contrato en [Rinkeby Etherscan](https://rinkeby.etherscan.io/) y ver las transacciones que han tenido lugar. Encontrarás todo tipo de información útil aquí, incluyendo el método que fue llamado, que en este caso es `Wave`. Si haces clic en una transacción de `Wave`, te darás cuenta de que en la propiedad `To`, identificará que se llamó a la dirección del contrato. Si el usuario ha ganado un premio, verás que en ese campo el contrato ha transferido 0.0001 ETH desde la dirección del contrato a la dirección de su cuenta.

Ten en cuenta que el `Value` de la transacción sigue siendo 0 ETH, porque el usuario nunca pagó nada para iniciar el saludo. La transferencia de ETH internamente desde un smart contract se llama "internal transfer". Valga la redundancia.

🎤 Eventos
---------

¿Recuerdas cómo usamos esa línea mágica de abajo en nuestro smart contract? Te dije que buscaras en Google cómo funcionan los eventos en Solidity. Por favor, ¡hazlo ahora si no lo has hecho ya!

```solidity
emit NewWave(msg.sender, block.timestamp, _message);
```

En resumen, los eventos son mensajes que nuestros contratos inteligentes lanzan y que podemos capturar en nuestro cliente en tiempo real.

Supongamos que estoy curioseando tu página web y la tengo abierta. Mientras lo hago, tu otro amigo Jeremy te saluda. Ahora mismo, la única manera de que vea el saludo de Jeremy es si actualizo mi página. Esto no parece muy divertido. ¿No sería genial si pudiera saber que ese contrato se ha actualizado y que mi interfaz de usuario se actualizara mágicamente?

Incluso ahora, es un poco molesto cuando nosotros mismos enviamos un mensaje, y luego tenemos que esperar a que sea minado y luego refrescar la página para ver toda la lista actualizada de mensajes, ¿verdad? Vamos a arreglar eso.

Fíjate cómo he actualizado el código de `getAllWaves` en `App.js.` 

```javascript
const getAllWaves = async () => {
  const { ethereum } = window;

  try {
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      const waves = await wavePortalContract.getAllWaves();

      const wavesCleaned = waves.map(wave => {
        return {
          dirección: wave.waver,
          timestamp: new Date(wave.timestamp * 1000),
          mensaje: wave.message,
        };
      });

      setAllWaves(wavesCleaned);
    } else {
      console.log("¡El objeto Ethereum no existe!");
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * ¡Escucha los eventos del emisor!
 */
useEffect(() => {
  let wavePortalContract;

  const onNewWave = (from, timestamp, message) => {
    console.log('NewWave', from, timestamp, message);
    setAllWaves(prevState => [
      ...prevState,
      {
        address: from,
        timestamp: new Date(timestamp * 1000),
        message: message,
      },
    ]);
  };

  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
    wavePortalContract.on('NewWave', onNewWave);
  }

  return () => {
    if (wavePortalContract) {
      wavePortalContract.off('NewWave', onNewWave);
    }
  };
}, []);
```

En la parte inferior verás el trozo de código mágico que he añadido :). Aquí, puedo "escuchar" cuando mi contrato lanza el evento `NewWave`. Como un webhook :). Bastante guay, ¿verdad?

También puedo acceder a los datos en ese evento como `message` y `from`. Aquí, hago un `setAllWaves` cuando recibo este evento, lo que significa que el mensaje del usuario se añadirá automáticamente a mi lista `allWaves` cuando recibamos el evento y nuestra UI se actualizará.

Esto es súper potente. Nos permite crear aplicaciones web que se actualizan en tiempo real :). Piensa en si estuvieras haciendo algo como un Uber o Twitter en la blockchain, las aplicaciones web que se actualizan en tiempo real se vuelven mega importantes.

Quiero que hackees esto y construyas lo que quieras :).


🙉 Un apunte sobre github
----------------

**Si subes a Github, no subas tu archivo de configuración de hardhat con tu clave privada a tu repo. Te robarán.**

Yo uso dotenv para esto.

```bash
npm install --save dotenv
```

Tu archivo hardhat.config.js debe ser algo así

```javascript
require('@nomiclabs/hardhat-waffle');
require('dotenv').config();

module.exports = {
  solidity: '0.8.0',
  networks: {
    rinkeby: {
      url: process.env.STAGING_ALCHEMY_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
    mainnet: {
      chainId: 1,
      url: process.env.PROD_ALCHEMY_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
```

Y tu archivo .env debe ser algo así

```
STAGING_ALCHEMY_KEY=BLAHBLAH
PROD_ALCHEMY_KEY=BLAHBLAH
PRIVATE_KEY=BLAHBLAH
```

 Asegúrate de tener el .env en tu .gitignore.

🎉 Eso es todo
----------------

Lo conseguiste. Has desplegado un smart contract y has escrito una aplicación web que se comunica con él. Estas son dos habilidades que van a cambiar el mundo cada vez más a medida que avanzamos hacia una realidad donde las aplicaciones web descentralizadas se vuelven más comunes.

Espero que esto haya sido una introducción divertida a web3 y que continúes el viaje.

Os mantendré informados de los nuevos proyectos en el Discord :).


🚨 Antes de salir...
-------------------------
Ve a #showcase en Discord y muéstranos tu producto final con el que podamos trastear :).

Además, ¡deberías tuitear tu proyecto final y mostrar al mundo tu creación! Lo que hiciste no fue fácil para nada. Tal vez incluso puedas hacer un pequeño vídeo mostrando tu proyecto y adjuntarlo al tuit. Haz que tu tuit sea bonito y presume de él :).

Y si te animas, etiqueta a @_buildspace :). Le daremos un RT. Además, nos motiva mucho cada vez que vemos que la gente envía sus proyectos.

Por último, lo que también sería genial es que nos contaras en #feedback qué te ha parecido este proyecto y la estructura del mismo. ¿Qué es lo que más te ha gustado de Buildspace? ¿Qué te gustaría que cambiáramos para futuros proyectos? ¡¡Tu opinión nos vendría genial!!


¡¡¡Nos vemos por ahí!!!


🎁 Este es el final... ¿O no?
----------

*LO HICISTE* ¡Aplausos, aplausos 👏 ! ¿Quieres ver todo el código que escribimos para esta sección? ¡Haz clic en [este enlace](https://gist.github.com/adilanchian/93fbd2e06b3b5d3acb99b5723cebd925) para verlo todo!
