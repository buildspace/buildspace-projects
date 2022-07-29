
## 🎨 Termina tu interfaz de usuario, ¡hazla tuya!

¡Tienes toda la funcionalidad principal lista! Es momento de que realmente lo hagas tuyo si aún no lo has hecho. Cambia o modifica el CSS, 
cambia los textos, agrega algunos videos divertidos de YouTube, agrega tu biografía, lo que quieras. Haz que las cosas se vean geniales :).

**¡¡Usa al menos 30 minutos en esto si quieres!! ¡Te lo recomiendo mucho!**

Por cierto, mientras estamos haciendo las pruebas, -- puede ser que desees cambiar el temporizador de enfriamiento del contrato a 30 segundos 
en lugar de 15 minutos como este:

```
require(lastWavedAt[msg.sender] + 30 seconds < block.timestamp, "Must wait 30 seconds before waving again.");
```

¿Por qué? ¡Bueno, puede ser bastante molesto mientras estamos con las pruebas solo poder saludar cada 15 minutos!
Entonces, ¡cámbialo a 30 segundos!

Cuando implementes la versión final del contrato, ¡puedes configurarlo como quieras!

## ⛽️ Ajustemos el límite de gas.

Cuando intentes "saludar", podrás darte cuenta de que a veces obtienes un error que dice algo como "sin gas". ¿Por qué?

Metamask intentará estimar cuánto gas usará una transacción. ¡Pero, a veces sale mal! En este caso, se hace más difícil por el hecho de que 
hay algo de aleatoriedad involucrada. Entonces, si el contrato envía un premio, entonces el usuario debe pagar más gasolina 
ya que estamos ejecutando **más** código.

Estimar el gas es un problema difícil, pero hay una solución fácil para esto (para que nuestros usuarios no se enojen cuando falla una transacción) 
y es establecer un límite.

En App.js he cambiado la línea de código que envía el saludo a:

```solidity
wavePortalContract.wave(message, { gasLimit: 300000 })
```
Lo que hace este cambio es que el usuario pague una cantidad fija de gas de 300,000. Y, si no lo usan todo en la transacción, se les reembolsará automáticamente.
Entonces, si una transacción cuesta 250,000 de gas, *luego* de que finalice la transacción, se reembolsarán los 50,000 de gas sobrantes que el usuario no usó :).

## 🔍 Validando las transacciones.

Cuando el contrato se ha implementado y estamos probando con la interfaz de usuario y la cartera digital, al principio puede ser confuso 
determinar si la cuenta de la cartera fue recompensada con éxito con el premio. La cuenta habrá consumido cierta cantidad de gas y posiblemente 
haya sido recompensada con ETH. Entonces, ¿cómo podemos validar si el contrato funciona como se espera?

Para validar esto, puedes abrir la dirección del contrato en [Rinkeby Etherscan](https://rinkeby.etherscan.io/) y ver las transacciones que se han realizado. 
Aquí podrás ver información útil, incluido el método al que se llamó, que en este caso es`Wave`. Si haces click en una transacción de `Wave`, 
podrás notarlo en la propiedad `To`, ya que identificará que la dirección del contrato fue llamada. Si un usuario ganó el premio, notarás que el contrato 
ha transferido 0.0001 ETH desde la dirección del contrato a la dirección de la cuenta.

Tengamos en cuenta que el `Value` de la transacción sigue siendo 0 ETH, porque el usuario nunca pagó nada para inicializar el saludo. 
La transferencia de ETH internamente en un contrato inteligente se denomina "transacción interna" y puedes verla cambiando la pestaña en Etherscan.

## 🎤 Eventos.

¿Recuerdas cómo usamos esa línea de código mágica en nuestro contrato inteligente? Te dije que buscaras en Google cómo funcionan los eventos en Solidity. 
¡Hazlo ahora por favor si aún no lo hiciste!

```solidity
emit NewWave(msg.sender, block.timestamp, _message);
```

En un nivel básico, los eventos son mensajes que arrojan nuestros contratos inteligentes que podemos capturar en tiempo real.
Digamos que me estoy utilizando tu sitio web y lo acabo de abrir. Mientras hago esto, tu otro amigo Jeremy te manda un saludo. En este momento, 
la única forma en que vería el saludo de Jeremy es si actualizara la página. Esto parece malo. ¿No sería genial si pudiera saber que ese contrato 
se actualizó y que mi interfaz de usuario se actualice mágicamente?

Inclusive ahora, es un poco molesto cuando nosotros mismos enviamos un mensaje, y luego tenemos que esperar a que se extraiga y luego actualizar 
la página para ver toda la lista actualizada de mensajes, ¿verdad? Vamos a arreglar eso.

Revisemos este código donde actualicé `getAllWaves` en `App.js.` 

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
          address: wave.waver,
          timestamp: new Date(wave.timestamp * 1000),
          message: wave.message,
        };
      });

      setAllWaves(wavesCleaned);
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * Listen in for emitter events!
 */
useEffect(() => {
  let wavePortalContract;

  const onNewWave = (from, timestamp, message) => {
    console.log("NewWave", from, timestamp, message);
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
    wavePortalContract.on("NewWave", onNewWave);
  }

  return () => {
    if (wavePortalContract) {
      wavePortalContract.off("NewWave", onNewWave);
    }
  };
}, []);
```

En la parte inferior verás el código mágico que agregué :). Aquí, puedo "escuchar" cuando mi contrato lanza el evento `NewWave`. Como un webhook :). 
Bastante bueno, ¿verdad?

También puedo acceder a esos datos de ese evento en `message` y `from`. Aquí, hago `setAllWaves` cuando recibo este evento, lo que significa que el mensaje 
del usuario se agregará automáticamente a mi arreglo `allWaves` cuando recibamos el evento y nuestra interfaz de usuario se actualizará.

Esto es muy poderoso. Nos permite crear aplicaciones web que se actualizan en tiempo real :). Piensa que, si estuvieras haciendo algo como 
Uber o Twitter en la cadena de bloques, las aplicaciones web que se actualizan en tiempo real se vuelven muy importantes.

Quiero que juegues con esto y construyas lo que quieras :).

## 🙉 Un comentario sobre github.

**Si quieres subir este proyecto a un repositorio de Github no vayas a cargar tu archivo de configuración de Hardhat y que trae tu llave privada al repositorio. 
Te la pueden robar.**

Yo uso dotenv para esto.

```bash
npm install --save dotenv
```
Tu archivo hardhat.config.js se debe ver así:

```javascript
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
  solidity: "0.8.0",
  networks: {
    rinkeby: {
      url: process.env.STAGING_QUICKNODE_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
    mainnet: {
      chainId: 1,
      url: process.env.PROD_QUICKNODE_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
```

Y tú archivo .env debe verse así:

```
STAGING_QUICKNODE_KEY=BLAHBLAH
PROD_QUICKNODE_KEY=BLAHBLAH
PRIVATE_KEY=BLAHBLAH
```
Asegúrate de tener el archivo .env en el .gitignore.

## 🎉 ¡Esto ha sido todo!

Lo lograste. Implementaste un contrato inteligente y creaste una aplicación web que se comunica con él. Estas son dos habilidades que van a 
cambiar el mundo a medida que avanzamos hacia una realidad en la que las aplicaciones web descentralizadas se vuelven más comunes.

Espero que esta haya sido una introducción muy satisfactoria y divertida a web3 y espero que continúes tu viaje.
Los mantendré informados sobre nuevos proyectos en Discord :).

## 🤟 Tu NFT.

Te vamos a enviar un NFT dentro de una hora y te vamos a enviar un correo electrónico una vez que el NFT esté en tu cartera digital. 
Si no recibes el correo electrónico dentro de las próximas 24 horas, envía por favor un mensaje en #feedback y etiqueta @ **alec#8853**.

## 🚨 Antes de terminar.

Ve a #showcase en Discord y muéstranos tu producto final para podamos jugar :).

Además, ¡deberías twittear tu proyecto final y mostrarle al mundo esta creación épica! Lo que hiciste no fue fácil de ninguna manera. 
Tal vez podrías hacer un pequeño video mostrando el proyecto y adjuntarlo al tweet. Haz que tu tweet luzca bonito, presume :).

Y si te sientes motivado, etiqueta a @_buildspace :). Le daremos RT. Además, nos motiva mucho cada vez que vemos a la gente enviar sus proyectos.

Por último, sería increíble es si nos dijeras en #feedback lo que te gustó de este proyecto. ¿Qué fue lo que más te gustó de buildspace? 

¿Qué te gustaría que cambiemos para futuros proyectos? ¡Tus comentarios serían geniales para nosotros!

¡Nos vemos pronto!

## 🎁 Finalmente.

*LO HICISTE.* ¡Aplausos 👏! ¿Quieres ver todo el código que escribimos para esta sección? 
¡Haz clic en [este enlace](https://gist.github.com/adilanchian/93fbd2e06b3b5d3acb99b5723cebd925) para verlo todo!












