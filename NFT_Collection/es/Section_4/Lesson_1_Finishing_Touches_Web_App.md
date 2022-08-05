## 🌊 Darle al usuario su enlace de OpenSea

¡Una cosa increíble es que después de acuñar el NFT le demos al usuario un enlace de su NFT en OpenSea que podrían compartir en Twitter o con sus amigos!
El enlace para un NFT en OpenSea se ve así:

`https://testnets.opensea.io/assets/0x88a3a1dd73f982e32764eadbf182c3126e69a5cb/9`
Básicamente estas son las variables.

`https://testnets.opensea.io/assets/INSERT_CONTRACT_ADDRESS_HERE/INSERT_TOKEN_ID_HERE`

**Nota: si está utilizando Rarible porque OpenSea tarda mucho en mostrar los metadatos de su NFT, la configuración del enlace de Rarible, ¡es muy similar! De hecho, a mí me gusta usar Rarible en lugar de OpenSea, generalmente es mucho más rápido en mostrar los metadatos. ¡Lo cual es bueno porque los usuarios pueden ver instantáneamente su NFT!**

El enlace para un NFT en Rarible se ve así:
`https://rinkeby.rarible.com/token/0xb6be7bd567e737c878be478ae1ab33fcf6f716e0:0`

Básicamente estas son las variables.
`https://rinkeby.rarible.com/token/INSERT_CONTRACT_ADDRESS_HERE:INSERT_TOKEN_ID_HERE`

Entonces, nuestra aplicación web tiene la dirección del contrato, ¡pero no la identificación del token! Entonces, tendremos que cambiar nuestro contrato para poder recuperar eso. hagámoslo.
Vamos a usar algo llamado `Events` en Solidity. Estos son como webhooks. ¡Escribamos parte del código y hagamos que funcione primero!
¡Agrega esta línea debajo de la línea donde creaste los tres arreglos de las palabras aleatorias!
`event NewEpicNFTMinted(address sender, uint256 tokenId);`
Después agrega esta línea de código al fondo de la función `makeAnEpicNFT` así que será la última línea de código en esa función:
`emit NewEpicNFTMinted(msg.sender, newItemId);`
En un nivel básico, los eventos son mensajes que arrojan nuestros contratos inteligentes que podemos capturar en nuestro cliente en tiempo real. En el caso de nuestro NFT, el hecho de que nuestra transacción sea minada **no significa que la transacción resulte en la acuñación del NFT**. ¡Podría haber fallado! Incluso si se hubiera producido un error, aún se habría extraído en el proceso.
Es por lo que uso eventos aquí. Puedo emitir `emit` un evento en el contrato y luego capturar ese evento en la interfaz. Ten en cuenta que durante el `event` envío el `newItemId` que necesitamos en la interfaz, ¿verdad :)?

Una vez más, es algo así como un web hook. Excepto que este será el webhook más fácil de configurar jajaja.
Puedes leer más sobre eventos [aquí](https://docs.soliditylang.org/en/v0.8.14/contracts.html#events).
Y, como siempre cuando hacemos cambios en nuestro contrato.
1. Redesplegamos
2. Actualice la dirección del contrato en App.js.
3. Actualice el archivo ABI en la aplicación web.
Si omites algo de esto, **obtendrás** errores :).
Ahora vamos a agregar esta línea mágica en nuestra interfaz (te voy a mostrar dónde debe ir en un momento).
```javascript
connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
	console.log(from, tokenId.toNumber())
	alert(`Hey there! We've minted your NFT. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: <https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}>`)
});
```
Bueno, esto es verdaderamente épico. Porque en tiempo real, capturamos el evento de acuñación, obtenemos el tokenId, daremos al usuario el enlace de OpenSea para su NFT recién acuñado.
El código para `App.js` y el contrato está [aquí](https://gist.github.com/farzaa/5015532446dfdb267711592107a285a9). Realmente no es nada lujoso. ¡Simplemente configuramos el detector de eventos! Me aseguré de dejar comentarios en las líneas que agregué para que sea más fácil para ti ver lo que cambio. ¡Asegúrate de agregar una llamada a `setupEventListener()` en dos lugares como lo hice yo en el código! No lo olvides :).
## 🖼 Fondos de color.
Solo por diversión, hice cambios en el contrato para elegir al azar un fondo de color. No voy a repasar el código aquí porque fue solo por diversión, pero puedes ver lo que hice [aquí](https://gist.github.com/farzaa/b3b8ec8aded7e5876b8a1ab786347cc9). Recuerden que, si cambian algo en el contrato, deberán volver a implementarlo, actualizar el abi y actualizar la dirección del contrato.

## 😎 Poner un límite al número de NFTs que se pueden acuñar.
¡Es un reto! Te desafío a que hagas cambios en el contrato para permitir que solo se acumule un número determinado de NFT. ¡quizás quieras que solo se generen 50 NFT como máximo! ¡Sería aún más increíble si en el sitio web viéramos algo así como `4/50 NFT acuñados hasta ahora` o algo así para que su usuario se sienta súper especial cuando obtiene un NFT!
Como sugerencia, necesitará usar algo en solidity llamado `require`. Y también debes crear una función como `getTotalNFTsMintedSoFar` que llame a la aplicación web.
## ❌ Generar una alerta al usuario cuando esté en una red incorrecta.
Nuestro sitio web **solo** funcionará en la red de pruebas Rinkeby (ahí es donde vive el contrato).
¡Vamos a agregar un mensaje para informar a los usuarios sobre esto!
Para esto, hacemos una solicitud RPC a la cadena de bloques para ver la ID de la cadena a la que se conecta nuestra billetera. (¿Por qué una cadena y no una red? [Buena pregunta!](https://ethereum.stackexchange.com/questions/37533/what-is-a-chainid-in-ethereum-how-is-it-different-than-networkid-and-how-is-it))
Ya hemos dirigido solicitudes a la cadena de bloques. Usamos `ethereum.request` con los métodos `eth_accounts` y `eth_requestAccounts`. Ahora usamos `eth_chainId` para obtener la ID.
```javascript
let chainId = await ethereum.request({ method: 'eth_chainId' });
console.log("Connected to chain " + chainId);
// String, hex code of the chainId of the Rinkebey test network
const rinkebyChainId = "0x4"; 
if (chainId !== rinkebyChainId) {
	alert("You are not connected to the Rinkeby Test Network!");
}
```
¡Listo, ahora el usuario sabrá si está en la red equivocada! Esta solicitud se ajusta a [EIP-695](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-695.md), por lo que devuelve el valor hexadecimal de la red como una cadena. Puede encontrar los ID de otras redes [aquí](https://docs.metamask.io/guide/ethereum-provider.html#chain-ids).


## 🙉 Animación mientras se mina la transacción.
¡Algunos de los usuarios de nuestra aplicación pueden estar confundidos cuando hacen clic en el botón para acuñar y no suceda nada durante 15 segundos jajaja! ¿Quizás agregar una animación de carga? ¡Haz que suceda! No se cubre aquí este tema. Hazlo tú mismo :).
## 🐦 Agrega tu Twitter.
Agrega tu dirección de Twitter al final. Ya te puse una plantilla que hace eso.
## 👀 Agrega un botón donde los usuarios puedan ver la colección.
¡ésta es la parte más importante!
Por lo general, cuando las personas quieren ver una colección de NFT, ¡lo hacen en OpenSea! Es una manera súper fácil para que las personas conozcan tu colección. ¡sabrán que es legítimo!
Agrega un pequeño botón que diga "🌊 Ver colección en OpenSea" y luego, cuando los usuarios hagan clic en él, ¡los llevará a tu colección! Pero recuerda, enlace cambia cada vez que cambia el contrato. Así que hay que asegurarnos de vincular la última colección. Por ejemplo, [esta](https://testnets.opensea.io/collection/squarenft-vu901lkj40) es mi colección.
Nota: Este enlace deberá fijarlo. Dejé una variable en la parte superior para que lo hagas. No se puede generar dinámicamente a menos que uses la API de OpenSea (que es una exageración por ahora jajaja).
## 🚨 Reporte de avances.
¡¡Estamos llegando al final!! Publica una captura de pantalla en #progress con una pequeña ventana emergente que le da al usuario su enlace directo a OpenSea.
