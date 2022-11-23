## 🙉 Un comentario sobre GitHub

Si quieres subir este proyecto a un repositorio de Github no vayas a cargar tu archivo de configuración de Hardhat y que trae tu llave privada al repositorio. Te la pueden robar.
Yo uso dotenv para esto.
```bash
npm install --save dotenv
```
```javascript
require('@nomiclabs/hardhat-waffle');
require('dotenv').config();
module.exports = {
  solidity: '0.8.1',
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
Y tú archivo .env debe verse así:



```plaintext
STAGING_ALCHEMY_KEY=BLAHBLAH
PROD_ALCHEMY_KEY=BLAHBLAH
PRIVATE_KEY=BLAHBLAH
```
(no subas el archivo `.env` después de esto lol, asegúrate de que esté en su archivo `.gitignore`).
¿Recuerdas el cambio que hicimos a `.gitignore` anteriormente? Ahora puede revertirlo eliminando la línea `hardhat.config.js`, porque ahora ese archivo solo contiene variables que representan sus claves, y no la información real.
## 🌎 Actualiza y vuelve inmortales los NFTs con IPFS
Pensemos un momento sobre en dónde se están almacenando realmente los NFT en este momento. ¡Están en la cadena de bloques de Ethereum! Esto es increíble por muchas razones, pero tiene algunos problemas. Principalmente, es **muy costoso** debido a cuánto cuesta el almacenamiento en Ethereum. Los contratos también tienen un límite de duración, por lo que, si crea un SVG animado muy elegante que sea muy largo, puede ser que no funcione.
Afortunadamente, tenemos algo llamado [IPFS](https://en.wikipedia.org/wiki/InterPlanetary_File_System), que es esencialmente un sistema de archivos distribuido. Hoy, puede usar algo como S3 o almacenamiento GCP. Pero, para este proyecto podemos confiar en IPFS. ¡[Dale](https://decrypt.co/resources/how-to-use-ipfs-the-backbone-of-web3) una lectura rápida cuando puedas! Cubre una gran cantidad de buenos conocimientos básicos :). Realmente, todo lo que necesita saber es que IPFS es el estándar de la industria para almacenar activos NFT. Es inmutable, permanente y descentralizado.
Usarlo es bastante simple. Todo lo que necesita hacer es cargar sus NFT en IPFS y luego usar el hash de ID de contenido único en el contrato inteligente esto en lugar de la URL de Imgur o los datos SVG.
Primero, deberá cargar sus imágenes en un servicio que se especialice en "[fijar](https://docs.ipfs.io/how-to/pin-files/)", lo que significa que el archivo esencialmente se almacenará en caché para que sea fácilmente recuperable. Me gusta usar [**Pinata**](https://www.pinata.cloud/?utm_source=buildspace): te dan 1 GB de almacenamiento gratis, que es suficiente para miles de activos. Solo crea una cuenta, sube los archivos de imagen de tu personaje a través de su interfaz de usuario, ¡y listo!
![Untitled](https://i.imgur.com/lTpmIIj.png)
Continuemos y copiemos los archivos "CID". ¡Esta es la dirección de contenido del archivo en IPFS! podemos crear este enlace:


```javascript
https://cloudflare-ipfs.com/ipfs/INSERT_YOUR_CID_HERE
```
Si usas el **navegador Brave** (que tiene IPFS incorporado), puedes tan sólo escribir lo siguiente:
```javascript
ipfs://INSERT_YOUR_CID_HERE
```
¡Y eso realmente iniciará un nodo IPFS en tu máquina local y recuperará el archivo! Si intentas hacerlo en Chrome, sólo hará una búsqueda en Google jajaja. Tendrás que usar el enlace `cloudflare-ipfs`.
![Untitled](https://i.imgur.com/tWHtVbO.png)
A partir de aquí, solo necesitamos actualizar nuestra función `tokenURI` para anteponer `ipfs://`. A OpenSea le gusta cuando nuestro URI de imagen está estructurado así: `ipfs://INSERT_YOUR_CID_HERE`.
Así es como debe verse la función `_setTokenURI`
```javascript
_setTokenURI(newItemId, "ipfs://INSERT_YOUR_CID_HERE")
```
¡Y ahora ya sabes cómo usar IPFS! Sin embargo, hay un detalle que necesitamos arreglar: estamos generando dinámicamente el código SVG en la cadena. No podrás cargar archivos en IPFS desde los contratos internamente, deberás primero generar los SVG en el navegador o en un servidor dedicado, cargarlos en IPFS y pasar los CID a la función mint como una cadena.
Voy a dejar este tema aquí para que tu explores más de esto, pero a veces no querrás almacenar tus NFT en la cadena. Tal vez quieres tener un video como NFT. Hacerlo en cadena sería tremendamente costoso debido a las tarifas de gas.
Recordemos lo siguiente, un NFT es solo un archivo JSON que se vincula a algunos metadatos. Puedes poner este archivo JSON en IPFS. También puedes poner los datos (por ejemplo, una imagen, video, etc.) en IPFS. No te compliques demasiado :).
**Un gran porcentaje de los NFT actuales utilizan IPFS. Es la forma más popular de almacenar datos NFT en la actualidad.**
¡¡Explora más e investiga por ti mismo!! ;)


## 📝 Verifiquemos el contrato en Etherscan
¿Sabías que puedes mostrar el código fuente de tu contrato inteligente al mundo? Si lo haces, esto permitirá que su lógica sea realmente transparente. Sobre todo, fiel al espíritu de una cadena de bloques pública. ¡Todos los que deseen interactuar con tu contrato inteligente en la cadena de bloques pueden ver la lógica del contrato! Para hacer esto, Etherscan tiene una función llamada **Verificar Contrato**. [Aquí](https://rinkeby.etherscan.io/address/0x902ebbecafc54f7a8013a9d7954e7355309b50e6#code) hay un ejemplo de cómo se verá un contrato verificado. 
Por favor examina el contrato inteligente.
Si selecciona la pestaña **Contrato** en Etherscan, notarás que hay una larga lista de caracteres de texto que comienza desde `0x608060405234801...` mmm... ¿qué es esto🤔?
![image](https://user-images.githubusercontent.com/60590919/139609052-f4bba83c-f224-44b1-be74-de8eaf31b403.png)
¡Pues resulta que este grupo largo y de aspecto incomprensible de caracteres son en realidad los códigos de bytes del contrato que has implementado! Los códigos de bytes representan una serie de códigos de operación en el EVM que ejecutarán instrucciones en cadena.
Esta es mucha información nueva. No te preocupes si ahora no te hace mucho sentido en este momento. ¡Busca que significan los bytecodes y EVM! Use Google o haz preguntas en `#general-chill-chat` en Discord :). Por cierto, [Este también es](https://ethervm.io/) un artículo genial sobre los códigos de operación EVM 🤘.
Entonces, sabemos que los bytecodes no son legibles para nosotros. Queremos poder ver el código que escribimos directamente en Etherscan. ¡Afortunadamente, Etherscan tiene la magia para ayudarnos a hacer eso!
Hay un aviso que nos solicita que **Verifiquemos y Publiquemos** el código fuente de nuestro contrato. Si seguimos este enlace, debemos seleccionar manualmente nuestra configuración de contrato y pegar nuestro código para publicar nuestro código fuente.
Afortunadamente para nosotros, Hardhat ofrece una forma más inteligente de hacerlo.
Dirígete a tu proyecto de Hardhat y vamos a instalar `@nomiclabs/hardhat-etherscan` ejecutando el comando:
```
npm i -D @nomiclabs/hardhat-etherscan
```



Luego en `hardhat.config.js` añade el siguiente código:
```javascript
require("@nomiclabs/hardhat-etherscan");
// Rest of code
...
module.exports = {
  solidity: "0.8.1",
  // Rest of the config
  ...,
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: "",
  }
};
```
¡Casi terminamos! ¡Notaste que el objeto `etherscan` en nuestra configuración requiere una `apiKey`! Esto significa que necesitará una cuenta de Etherscan para obtener esta clave.
Si aún no tienes una, dirígete a [https://etherscan.io/register](https://etherscan.io/register) para crear una cuenta de usuario gratuita. Después ve hacia la configuración de tu perfil y, en `API-KEYs`, crea una nueva apikey.
![image](https://user-images.githubusercontent.com/60590919/139610459-b590bbc1-0d4e-4e78-920b-c45e61bf2d7e.png)
Genial ahora tienes tu clave API. Vamos al archivo `hardhat.config.js` y cambia la propiedad `apiKey` para que sea su clave recién generada.
**Nota: No compartas esta clave API de Etherscan con otras personas.**
Ya estamos en nuestro último paso, lo prometo. Todo lo que falta ahora es ejecutar este comando:
```
npx hardhat verify YOUR_CONTRACT_ADDRESS --network rinkeby 
```

Si todo funciona sin problemas, deberías ver estos resultados en tu terminal. El mío se ve así:
![image](https://user-images.githubusercontent.com/60590919/139611432-16d8c3fc-04b1-44c8-b58a-27f49e94d492.png)
Regresemos a la página del contrato en Rinkeby Etherscan dando clic al enlace que se muestra en la terminal y notarás que Etherscan ha convertido mágicamente ( y con tu ayuda) a los bytecodes en un código Solidity mucho más legible.
![image](https://user-images.githubusercontent.com/60590919/139611635-3d1d7aae-8bb8-47f5-9396-6a4544badebf.png)
¡Ahora todos pueden ver lo increíble que se ve tu contrato inteligente!
Pero espera aún hay más. Hay dos nuevas subpestañas Leer contrato y Escribir contrato (`Read Contract` & `Write Contract`) que podemos usar para interactuar instantáneamente con nuestro contrato inteligente en cadena.
![image](https://user-images.githubusercontent.com/60590919/139611805-b2a41039-ec79-402d-b198-4936d25ff277.png)
## 😍 ¡Lo lograste!
Es súper emocionante que hayas llegado hasta el final. ¡Es un gran logro!
Antes de irte, por favor agrega algunos toques finales de la lección anterior si quieres. Eso es lo realmente marca la diferencia. Cuando estés listo, publica un enlace de tu proyecto en #showcase. ¡Tus compañeros de clase serán los primeros en acuñar algunos de tus increíbles NFT!
Gracias por tu contribución al futuro de web3 aprendiendo estas cosas. El hecho de que sepas cómo funciona esto y cómo codificarlo es un superpoder. Usa tu poder sabiamente ;).
## 🔮 ¡Lleva tu proyecto más allá!
¡Qué lo que aprendiste en este proyecto sea solo el comienzo! Hay mucho más que puedes hacer con NFT y contratos inteligentes, aquí hay algunos ejemplos sobre lo que puedes investigar más ✨
**Vender los NFTs**: en este momento, tus usuarios solo tienen que pagar tarifas de gas o comisiones para acuñar tus increíbles nft y ¡no obtendrás nada de ese dinero! Hay varias formas de modificar tu contrato inteligente que harán que el usuario te pague para realizar sus transacciones, como agregar pagos ```payable``` al contrato y usar ```require``` para establecer una cantidad mínima. Dado que aquí se trata de dinero real, es mejor investigar con cuidado y pregunte a los expertos si el código es seguro. ¡OpenZeppelin tiene un foro donde puedes hacer preguntas como ésta [aquí!](https://forum.openzeppelin.com/t/implementation-of-sellable-nft/5517/)

**Añadir regalías**: ¡también puede añadirle regalías a tu contrato inteligente lo cual te daría un porcentaje de cada venta futura de tu NFT! Puedes leer más de este tema aquí: [EIP-2981: Estándar de regalías NFT](https://eips.ethereum.org/EIPS/eip-2981)
**Haz pruebas de tus contratos localmente**: si desea probar sus contratos de manera más exhaustiva sin implementar una red de prueba como Rinkeby, ¡Hardhat, te permite hacerlo! ¡La mejor manera de lograrlo es abrir una ventana de terminal separada, dirigirse al directorio de su proyecto, luego ejecutar el nodo ```npx hardhat node``` y mantener esa ventana abierta! Al igual que al comienzo del proyecto, verás un montón de cuentas con mucho ether. ¡En esta otra ventana de terminal puedes ejecutar tus scripts de prueba y ver cómo se afecta la ventana de node!
## 🤟 ¡Tu NFT!
Te vamos a enviar un NFT dentro de una hora y te vamos a enviar un correo electrónico una vez que el NFT esté en tu cartera digital. Si no recibes el correo electrónico dentro de las próximas 24 horas, envía por favor un mensaje en #feedback y etiqueta @ **alec#8853**.
## 🌈 Antes de terminar
Ve a #showcase en Discord y muéstranos tu producto final para podamos jugar :).
Además, ¡deberías twittear tu proyecto final y mostrarle al mundo esta creación épica! Lo que hiciste no fue fácil de ninguna manera. Tal vez podrías hacer un pequeño video mostrando el proyecto y adjuntarlo al tweet. Haz que tu tweet luzca bonito, presume :).
Y si te sientes motivado, etiqueta a @_buildspace :). Le daremos RT. Además, nos motiva mucho cada vez que vemos a la gente enviar sus proyectos.
Por último, sería increíble es si nos dijeras en #feedback lo que te gustó de este proyecto. ¿Qué fue lo que más te gustó de buildspace? ¿Qué te gustaría que cambiemos para futuros proyectos? ¡Tus comentarios serían geniales para nosotros! 
¡Nos vemos pronto!

