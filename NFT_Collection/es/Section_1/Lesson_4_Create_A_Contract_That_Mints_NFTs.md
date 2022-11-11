*Nota: esta lección es más larga que las demás.*
Ahora que tenemos todos los scripts y lo básico listo para usar ahora vamos a acuñar algunos NFTs. Así se ve mi código de `MyEpicNFT.sol`:
```solidity
pragma solidity ^0.8.1;
// We first import some OpenZeppelin Contracts.
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";
// We inherit the contract we imported. This means we'll have access
// to the inherited contract's methods.
contract MyEpicNFT is ERC721URIStorage {
  // Magic given to us by OpenZeppelin to help us keep track of tokenIds.
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  // We need to pass the name of our NFTs token and its symbol.
  constructor() ERC721 ("SquareNFT", "SQUARE") {
    console.log("This is my NFT contract. Woah!");
  }
  // A function our user will hit to get their NFT.
  function makeAnEpicNFT() public {
     // Get the current tokenId, this starts at 0.
    uint256 newItemId = _tokenIds.current();
     // Actually mint the NFT to the sender using msg.sender.
    _safeMint(msg.sender, newItemId);
    // Set the NFTs data.
    _setTokenURI(newItemId, "blah");
    // Increment the counter for when the next NFT is minted.
    _tokenIds.increment();
  }
}
```
Muchas cosas están sucediendo aquí. Primero, verás que "heredo" un contrato de OpenZeppelin usando `is ERC721URIStorage` cuando declaro el contrato. Puedes leer más sobre la herencia [aquí](https://solidity-by-example.org/inheritance/), pero básicamente significa que podemos llamar a otros contratos del nuestro. ¡Es casi como importar funciones para que las usemos!
El estándar NFT se conoce como `ERC721` puedes leer un poco sobre este tema [aquí](https://eips.ethereum.org/EIPS/eip-721).
OpenZeppelin implementa el estándar NFT para nosotros y luego nos permite escribir nuestra propia lógica para personalizar el contrato. Eso significa que no necesitamos escribir código repetitivo.
Sería una locura escribir un servidor HTTP desde cero sin usar una biblioteca, ¿verdad? Por supuesto, a menos que quisieras explorarlo jajaja. Vamos a ponernos en marcha aquí.
Del mismo modo, ¡sería una locura escribir un contrato NFT desde cero! Puede explorar el contrato `ERC721` que heredamos [aquí](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol).
Veamos el paso a paso a través de la función `makeAnEpicNFT`.
```solidity
uint256 newItemId = _tokenIds.current();
```
¿Qué es `_tokenIds`? Recordemos el ejemplo de Picasso. El hizo 100 bocetos llamado boceto #1, boceto 2#, boceto #3, etc. Esos son los identificadores únicos.
Es lo mismo en este caso, estamos usando`_tokenIds` para realizar el seguimiento del identificador único de NFT, ¡y es solo un número! Se inicializa automáticamente en 0 cuando declaramos `private _tokenIds`. Entonces, cuando llamamos por primera vez a `makeAnEpicNFT`, `newItemId` es 0. Cuando lo ejecutamos nuevamente, `newItemId` será 1, ¡y así sucesivamente!
`_tokenIds` es una **variable de estado**, lo que significa que, si la cambiamos, el valor se almacena directamente en el contrato.
```solidity
_safeMint(msg.sender, newItemId);
```
Cuando hacemos `_safeMint(msg.sender, newItemId)` es más o menos decir: "mint the NFT with id `newItemId` to the user with address `msg.sender`". Aquí, `msg.sender` es una variable que [Solidity nos da](https://docs.soliditylang.org/en/develop/units-and-global-variables.html#block-and-transaction-properties)
y que fácilmente nos da acceso a la **dirección pública** del usuario que llama al contrato.
Lo increíble aquí es que esta es una **forma súper segura de obtener la dirección pública del usuario**. Mantener la dirección pública en secreto no es un problema, ¡eso ya es público! Todo el mundo lo ve. Pero, al usar `msg.sender`, no puede "falsificar" la dirección pública de otra persona a menos que tenga sus credenciales de cartera digital y hayas llamado al contrato en su nombre.
**No puedes llamar a un contrato de forma anónima**, debe tener las credenciales de la cartera conectadas. Esto es casi como "iniciar sesión" y autenticarse :).
```solidity
_setTokenURI(newItemId, "blah");
```
Luego hacemos, `_setTokenURI(newItemId, "blah")` que establecerá el identificador único de NFT y con los datos asociados con ese identificador único. Estamos configurando los datos reales que hacen que el NFT sea valioso. En este caso, lo estamos configurando como "blah", que... no es tan valioso;). Tampoco sigue el estándar de `ERC721`. Cubriremos `tokenURI` más adelante.
```solidity
_tokenIds.increment();
```
Después de acuñar el NFT, incrementamos `tokenIds` usando `_tokenIds.increment()` (que es una función que nos da OpenZeppelin). Esto asegura que la próxima vez que se acumule un NFT, tendrá un identificador`tokenIds` diferente. Nadie puede tener un `tokenIds` que ya haya sido acuñado también.
## 🎟 tokenURI ejecutándose localmente.
El `tokenURI` es donde viven los datos NFT reales. Y generalmente se **vincula** a un archivo JSON llamado metadatos que se parece a esto:
```bash
{
    "name": "Spongebob Cowboy Pants",
    "description": "A silent hero. A watchful protector.",
    "image": "https://i.imgur.com/v7U019j.png"
}
```
Puedes personalizar esto, pero casi todos los NFT tienen un nombre, una descripción y un enlace a algo como un video, una imagen, etc. ¡Incluso puede tener atributos personalizados! Tenga cuidado con la estructura de sus metadatos, si su estructura no coincide con los [Requisitos de OpenSea](https://docs.opensea.io/docs/metadata-standards), tu NFT (la imagen) aparecerá roto en el sitio web.
Todo esto es parte de los estándares `ERC721` y permite a las personas crear sitios web sobre datos NFT. Por ejemplo, [OpenSea](https://opensea.io/assets)
es un mercado para NFT. Y, cada NFT en OpenSea sigue el estándar de metadatos `ERC721` que facilita que las personas compren/vendan NFT. Imagina cada quien siguiera su propios estándar NFT y estructurara sus metadatos como quisiera, ¡sería un caos!
Podemos copiar los metadatos JSON `Spongebob Cowboy Pants` de la imagen de arriba y pegarlos [en este](https://jsonkeeper.com/)
sitio web. Este sitio web es solo un lugar fácil para que las personas alojen datos JSON y lo usaremos para mantener nuestros datos NFT por ahora. Una vez que haga clic en "Guardar", obtendrá un enlace al archivo JSON. (Por ejemplo, el mío es [`https://jsonkeeper.com/b/RUUS`](https://jsonkeeper.com/b/RUUS)). ¡Asegúrate de probar el enlace y de que todo se vea bien!
**Nota: Me encantaría que crearas tus propios metadatos JSON en lugar de copiar los míos. Utiliza una imagen, nombre y descripción de tu elección. ¡Tal vez quieras que tu NFT tenga una imagen de tu personaje de anime favorito, tu banda favorita, lo que sea! Personalízalo. ¡No te preocupes, lo podremos cambiar en el futuro!**
Si decidiste usar una imagen de tu elección, asegúrete de que la URL vaya directamente a la imagen real, ¡no al sitio web que aloja la imagen! Los enlaces directos de Imgur se ven así: `https://i.imgur.com/123123.png` no `https://imgur.com/gallery/123123`. La forma más fácil de saberlo es verificar si la URL termina en una extensión de imagen como `.png` o `.jpg`. Puedes hacer clic con el botón derecho en la imagen imgur y "copiar la dirección de la imagen". Esto te dará la URL correcta.
Vamos al contrato inteligente y cambiemos una línea. En vez de:
```solidity
_setTokenURI(newItemId, "blah")
```
Vamos a configurar el URI como el enlace a nuestro archivo JSON.

```solidity
_setTokenURI(newItemId, "INSERT_YOUR_JSON_URL_HERE");
```
¡Debajo de esta línea de código, también podemos agregar un `console.log` para ayudarnos a ver cuándo se acuña el NFT y por quién!
```solidity
console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);
```
## 🎉 Acuña un NFT localmente.
A partir de aquí, todo lo que tenemos que hacer es modificar nuestro archivo `run.js` para que llame a nuestra función `makeAnEpicNFT()`. Esto es lo que hay que hacer:
```javascript
const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory('MyEpicNFT');
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);
  // Call the function.
  let txn = await nftContract.makeAnEpicNFT()
  // Wait for it to be mined.
  await txn.wait()
  // Mint another NFT for fun.
  txn = await nftContract.makeAnEpicNFT()
  // Wait for it to be mined.
  await txn.wait()
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
Ejecútalo con el siguiente comando:
```bash
npx hardhat run scripts/run.js
```
Obtendrás algo como esto:
![Untitled](https://i.imgur.com/EfsOs5O.png)
¡Boom! ¡Acabamos de acuñar localmente un NFT con id `0` para nosotros! Entonces, sabemos que el código está funcionando y que nada falla. Impresionante. Siempre utiliza `run.js` para asegurarte de que las cosas funcionen localmente y no se bloqueen. ¡Es tu propio pequeño laboratorio de pruebas!
Entonces, en este momento, cada vez que alguien acuña un NFT con esta función, siempre es el mismo NFT: ¡Bob Esponja de Pantalones vaqueros! Aprenderemos en las próximas secciones cómo cambiar esto y que cada persona que acuñe un NFT obtenga uno aleatorio y único.
Pasemos al siguiente paso: implementar todo esto en una red de prueba :).
## 🎉 Implementación en Rinkeby y míralo en OpenSea
 Cuando usamos el archivo `run.js`, estamos trabajando localmente.
El siguiente paso es una red de prueba que puede considerar como un entorno de "prueba". Cuando lo implementemos, podremos **ver nuestro NFT en línea** y estamos un paso más cerca de llevar esto a los **usuarios reales.**
## 💳 Transacciones.
Bueno, cuando queremos realizar una acción en la cadena de bloques de Ethereum a esto lo llamamos *Transacciones*. Por ejemplo, enviar cierta cantidad de ETH a alguien es una transacción. Hacer algo que modifique o actualice una variable de nuestro contrato también se considera una transacción. Acuñar un NFT es una transacción porque estamos guardado datos en el contrato.

**Implementar un contrato inteligente se considera también una transacción.**
Recuerda, la Cadena de Bloques no tiene dueños, es un montón de computadoras conectadas alrededor del mundo administradas por **mineros** que tienen una copia de la Cadena de Bloques.
Cuando despleguemos nuestro contrato lo que haremos es decirles **a esos** mineros, “Oigan, este es un nuevo contrato, por favor añadan mi contrato inteligente a la cadena de bloques y díganles a todos que mi contrato funciona”.
Aquí es donde aparece [Alchemy](https://alchemy.com/?r=b93d1f12b8828a57).
Esencialmente, Alchemy nos ayuda a transmitir nuestra transacción de creación de contratos para los mineros la tomen lo antes posible, una vez que la transacción es minada se transmite a la cadena de bloques como una transacción legítima. Dado esto todos los mineros actualizan su copia de la cadena de bloques.
Esto es complicado, y no te preocupes si no lo entiendes por completo. Mientras más código escribas y sigas construyendo esta aplicación, naturalmente te irá haciendo mayor sentido.
Crea una cuenta de alchemy [aquí](https://alchemy.com/?r=b93d1f12b8828a57).
Por favor revisa el siguiente video para que veas como obtener tu “API KEY” para la red de pruebas.
[Loom](https://www.loom.com/share/21aa1d64ea634c0c9da8fc5faaf24283?t=0)
## 🕸️ Redes de pruebas.
No vamos a hacer una implementación en la “Red Principal de Ethereum” al final del proyecto. ¿porqué? Pues porque cuesta dinero real y no vale la pena. Apenas estamos aprendiendo. Vamos a utilizar una “red de pruebas” la cual es un clon de la red principal y utiliza tokens “falsos” para que podamos hacer todas las pruebas que queramos. Pero, también es importante saber que las redes de prueba también son operadas y mantenidas por mineros reales y que imitan escenarios del mundo real.
Por eso es increíble porque podremos probar nuestra aplicación en un escenario del mundo real y haremos lo siguiente:
1.	Transmitir nuestra transacción.
2.	Esperar a que sea reconocida por mineros reales.
3.	Esperar a que sea minada e integrada.
4.	Esperar a que sea transmitida hacia la cadena de bloques y que todos los mineros actualicen su copia.


## 🤑 Obtengamos un poco de dinero de prueba.
Existen algunas redes de prueba y vamos a usar una que se llama “Rinkeby” la cual es mantenida por la Fundación Ethereum.
Para poder hacer una implementación en Rinkeby necesitamos ether ficticio. ¿Porqué? Pues si quisieras hacer implementaciones en la red principal de Ethereum necesitas usar dinero real. Por lo que las redes de pruebas imitan el funcionamiento de la red principal, la única diferencia es que no hay dinero real involucrado.
Para poder obtener ETH ficticio necesitamos solicitarlo en la red. **Este ETH ficticio solo va a funcionar en la red de prueba especifica.** Podrás obtener un poco de ETH para Rinkeby mediante un “grifo”. Sólo busca uno que funcione LOL.
Para MyCrypto necesitas conectar tu cartera, hacer una cuenta y usar la misma liga para solicitar fondos. Para el grifo “oficial” de Rinkeby si la página dice que tiene 0 pares no vale la pena hacer la publicación de solicitud de en Twitter o Facebook.
Aquí hay algunos grifos donde puedes intentar obtener ether ficticio.
| Name             | Link                                  | Amount          | Time         |
| ---------------- | ------------------------------------- | --------------- | ------------ |
| MyCrypto         | https://app.mycrypto.com/faucet       | 0.01            | None         |
| Official Rinkeby | https://faucet.rinkeby.io/            | 3 / 7.5 / 18.75 | 8h / 1d / 3d |
| Chainlink        | https://faucets.chain.link/rinkeby    | 0.1             | None         |

## 🚀 Configura el archivo deploy.js
Es una buena práctica separar los comandos de implementación de la secuencia de comandos `run.js`. 
`run.js` es el que utilizamos mucho y queremos mantenerlo separado. Crea un archivo llamado `deploy.js` en la carpeta de `scripts`. Copie y pegue todo lo de `run.js` en `deploy.js`. Va a ser exactamente lo mismo ahora. Sin embargo, agregaremos algunas declaraciones de `console.log`.
```javascript
const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory('MyEpicNFT');
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);
  // Call the function.
  let txn = await nftContract.makeAnEpicNFT()
  // Wait for it to be mined.
  await txn.wait()
  console.log("Minted NFT #1")
  txn = await nftContract.makeAnEpicNFT()
  // Wait for it to be mined.
  await txn.wait()
  console.log("Minted NFT #2")
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
## 📈 Implementando en la red de Pruebas Rinkeby.
Vamos a necesitar hacer cambios el archivo `hardhat.config.js` el cuál podrás encontrar en el directorio raíz del contrato inteligente de nuestro proyecto.
```javascript
require('@nomiclabs/hardhat-waffle');
require("dotenv").config({ path: ".env" });
module.exports = {
  solidity: '0.8.1',
  networks: {
    rinkeby: {
      url: process.env.ALCHEMY_API_KEY_URL,
      accounts: [process.env.RINKEBY_PRIVATE_KEY],
    },
  },
};
```
Estamos configurando nuestro `hardhat.config.js` para usar variables env de forma segura, que son **process.env.ALCHEMY_API_KEY_URL** y **process.env.RINKEBY_PRIVATE_KEY**. Ahora debes abrir terminal y escribir:
```
npm install dotenv
```
Hacer esto solo instala el paquete `dotenv` que nos permite usar variables env.
Y ahora puede crear un archivo **.env** en la raíz del proyecto. Debe coincidir con la ruta que contiene el archivo **hardhat.config.js**.
Hay que obtener la URL del API del panel de control de Alchemy y pegarla. Luego, necesitarás tu clave **privada** de rinkeby (¡no la dirección pública!) esta se [obtener de metamask](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key) y debes pegarla allí también.
Abre el archivo **.env** y pega la información comentada como se muestra a continuación.
```
ALCHEMY_API_KEY_URL=<YOUR API URL>
RINKEBY_PRIVATE_KEY=<YOUR PRIVATE KEY>
```
No olvides quitar estos signos `<` `>` después de ingresar tu API URL y tu llave privada. 🔑

**Nota: NO VAYAS A ENVIAR ESTE ARCHIVO A GITHUB. ESTE ARCHIVO CONTIENE TU LLAVE PRIVADA. PODRÍAS SER HACKEADO, ROBADO, ESTAFADO. ESTA LLAVE PRIVADA ES LA MISMA QUE SE UTILIZA PARA LA RED PRINCIPAL DE ETHEREUM. ABRE TU ARCHIVO `.gitignore` Y AÑADE UNA LÍNEA PARA EL `.env` SI ES QUE NO EXISTE.**
Tu archivo `.gitignore` debería verse algo así:
```
node_modules
.env
coverage
coverage.json
typechain
#Hardhat files
cache
artifacts
```
¿Por qué necesita usar la clave privada? Porque para realizar una transacción como implementar un contrato, debes "iniciar sesión" en la cadena de bloques y firmar/implementar el contrato. Y pues el nombre de usuario es tu dirección pública y la contraseña es tu clave privada. Es como iniciar sesión en AWS o GCP para implementar.
Una vez que haya realizado la configuración, estamos listos para implementar con el script de implementación que escribimos anteriormente.
Ejecute este comando desde el directorio raíz de epic-nfts.
```bash
npx hardhat run scripts/deploy.js --network rinkeby
```
Generalmente, tarda entre 20 y 40 segundos en desplegarse. ¡No solo estamos desplegando! También estamos acuñando NFTs en `deploy.js`, por lo que podría tardar un poco. Tenemos que esperar a que la transacción sea extraída y tomada por los mineros. Bastante épico :). ¡Este comando hace todo eso!
Cuando lo ejecuto este es el resultado que obtengo (el tuyo se verá diferente):
![carbon (7).png](https://i.imgur.com/nLSX6PM.png)
¡Podemos asegurarnos de que todo funcionó correctamente usando [Rinkeby Etherscan](https://rinkeby.etherscan.io/) pegamos la dirección del contrato y ¡ver qué pasa!
Acostúmbrate a usar Etherscan porque es la forma más fácil de dar seguimiento de las implementaciones y notar si algo sale mal. Si no aparece en Etherscan, significa que aún se está procesando o que algo salió mal.
Si funcionó, IMPRESIONANTE, ACABAS DE IMPLEMENTAR UN CONTRATO SIIIIÍ.
## 🌊 Revísalo en OpenSea.
Lo creas o no. El NFT que acabas de acuñar estará disponible en el sitio web de pruebas de OpenSea.
Dirigete a [testnets.opensea.io](https://testnets.opensea.io/). Busca el NFT usando la dirección de tu contrato, es la dirección que obtuvimos al implementar así que podrás encontrarla en tu terminal. **No le des enter**, dale click a la colección que aparecerá al hacer la búsqueda.
![Untitled](https://i.imgur.com/ePDlYX1.png)
Así que, le das clic al nombre de tu colección que está en “Collections” y ¡verás los NFTs que acuñaste!
![Untitled](https://i.imgur.com/Q96NYK4.png)
VAMOS. ESTOY EMOCIONADO **POR** TI.
Bastante épico, creamos nuestro propio contrato NFT *y* acuñamos dos NFT. Épico. *Pero es un poco tonto*, ¿verdad? ¡Es la misma imagen de Bob Esponja cada vez! ¿Cómo podemos agregar algo de aleatoriedad a esto y generar cosas sobre la marcha? Eso es lo que vamos a estar haciendo a continuación :).
## 🙀 ¡Ayuda mis NFTs no se muestran en OpenSea!
**Si no puedes ver tu colección** y ésta no se muestra en OpenSea, espera unos minutos, en ocasiones a OpenSea le puede tomar algo así como 5 minutos. Mi consejo, si ya pasaron los cinco minutos y tus metadatos se ven así:
![Untitled](https://i.imgur.com/dVACrDl.png)
**Entonces, usa Rarible en lugar de OpenSea.** Rarible es otro mercado de NFTs como OpenSea. Te explico cómo hacerle para ver tus NFTs aquí:
1.	Dirigete a `rinkeby.rarible.com`.
2.	Crea este url: `https://rinkeby.rarible.com/token/INSERT_DEPLOY_CONTRACT_ADDRESS_HERE:INSERT_TOKEN_ID_HERE.`
Por ejemplo, este es para ver los míos:
https://rinkeby.rarible.com/token/0xb6be7bd567e737c878be478ae1ab33fcf6f716e0:0
Para los NFTs de Bob Esponja, Mi `tokenId` es `0` porque es el primer NFT que se acuña de este contrato.
**Si no ves tus NFT en OpenSea en unos minutos, intenta con Rarible y Rarible URL para lo que resta del proyecto.**
## 💻 El código.
[Aquí](https://gist.github.com/farzaa/483c04bd5929b92d6c4a194bd3c515a5) hay un enlace de cómo se ve nuestro código hasta este momento.
## 🚨 Reporte de avances.
WOOOOOOO. DATE UNAS PALMADITAS EN LA ESPALDA. IMPLEMENTASTE UN CONTRATO INTELIGENTE QUE ACUÑA NFTS. ¡¡GUAU!!
Buen trabajo :).
Deberías **twittear** que acabas de escribir e implementar tu contrato inteligente que puede acuñar NFT y etiquetar a @_buildspace. Incluye una captura de pantalla de la página de OpenSea/Rarible que muestra tu NFT :).
Deberías sentirte increíble por el hecho de que en realidad estás construyendo lo que todos los demás están hablando. Tienes superpoderes :).
*Gracias a las personas que ya han estado twitteando sobre nosotros, todos ustedes son leyendas <3.*
![](https://i.imgur.com/ftXoVsn.png)
![](https://i.imgur.com/HBMIgu2.png)
![](https://i.imgur.com/KwbO0Ib.png)
