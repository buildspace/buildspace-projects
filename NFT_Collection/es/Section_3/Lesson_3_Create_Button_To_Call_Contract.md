## 💚 Acuñemos el NFT a través de nuestro sitio web.
Increíble. ¡Lo logramos! Implementamos nuestro sitio web. También implementamos nuestro contrato y también ya conectamos nuestra cartera digital. **Ahora necesitamos llamar a nuestro contrato desde nuestro sitio web** usando las credenciales a las que tenemos acceso desde Metamask.
Y recuerda que nuestro contrato tiene la función `makeAnEpicNFT` el cual sirve para acuñar un NFT. Bueno ahora necesitamos llamar esta función desde nuestra aplicación web. Continuemos y añadamos la siguiente función debajo de la función `connectWallet`.
```javascript
const askContractToMintNft = async () => {
  const CONTRACT_ADDRESS = "INSERT_YOUR_DEPLOYED_RINKEBY_CONTRACT_ADDRESS";
  try {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);
      console.log("Going to pop wallet now to pay gas...")
      let nftTxn = await connectedContract.makeAnEpicNFT();
      console.log("Mining...please wait.")
      await nftTxn.wait(); 
      console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error)
  }
}
```

Esto nos mostrará algunos errores. ¡No te preocupes! Los vamos a arreglar en un momento más. Ahora veamos el código un poco más a detalle.
```javascript
const provider = new ethers.providers.Web3Provider(ethereum);
const signer = provider.getSigner();
```
`ethers` is una librería que ayuda a nuestra interfaz a comunicarse con nuestro contrato inteligente. Es importante que te asegures de importarla escribiendo hasta arriba usando: `import { ethers } from "ethers";`.
Un "Proveedor" es lo que usamos para comunicarnos con los nodos de Ethereum. ¿Recuerdas cómo usábamos Alchemy para **implementar**? Bueno, en este caso usamos nodos que Metamask proporciona en segundo plano para enviar/recibir datos de nuestro contrato implementado.
[Aquí](https://docs.ethers.io/v5/api/signer/#signers) hay un link que nos explica que es un “signer” firmante en la línea de código 2.
```javascript
const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);
```
Revisaremos esto en un momento. Solo debes saber que esta línea es lo que realmente **crea la conexión con nuestro contrato**. Requiere: la dirección del contrato, algo llamado archivo `abi` y un `signer`. Estas son las tres cosas que siempre necesitamos para comunicarnos con contratos en la cadena de bloques.
¿Notaste cómo puse como puse como fijo `const CONTRACT_ADDRESS`? Asegúrate de cambiar esta variable a la dirección del contrato implementado del último contrato que se haya implementado. Si lo olvidaste o se te perdió, no te preocupes, simplemente implementa de nuevo el contrato y obtendrás una nueva dirección :).
```javascript
console.log("Going to pop wallet now to pay gas...")
let nftTxn = await connectedContract.makeAnEpicNFT();
console.log("Mining...please wait.")
await nftTxn.wait();
console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
```

El resto del código ya debería tener sentido para ti. ¡Es cómo el código con el que hemos estado implementando :)! ¡Llamamos a nuestro contrato usando `makeAnEpicNFT`, esperamos a que se extraiga y luego vinculamos la URL de Etherscan!
Finalmente, queremos llamar a esta función cuando alguien haga clic en el botón "Mint NFT".
```javascript
return (
  {currentAccount === "" 
    ? renderNotConnectedContainer()
    : (
      /** Add askContractToMintNft Action for the onClick event **/
      <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
        Mint NFT
      </button>
    )
  }
);
```
## 📂 ABI files
**Hice un video donde explico todo lo relacionado con el archivo ABI. Por favor míralo ya que se revisan cosas importantes.**
[Loom](https://www.loom.com/share/2d493d687e5e4172ba9d47eeede64a37)
Cuando compilas tu contrato inteligente, el compilador arroja una gran cantidad de archivos que se utilizan para interactuar con el contrato. Estos archivos los podrás encontrar en directorio `artifacts` el cual está localizado en la raíz de nuestro proyecto de Solidity.
El archivo ABI es algo que nuestra aplicación necesita para saber cómo comunicarse con nuestro contrato. Puedes leer más sobre este tema [aquí](https://docs.soliditylang.org/en/v0.8.14/abi-spec.html). 
El contenido del archivo ABI se puede encontrar en un archivo JSON en el proyecto de hardhat: `artifacts/contracts/MyEpicNFT.sol/MyEpicNFT.json`

Entonces, la pregunta es ¿cómo obtenemos este archivo JSON en nuestra interfaz? ¡Para este proyecto vamos a hacer "copiar y pegar".
Copia el contenido de `MyEpicNFT.json` y luego vamos a la aplicación web. Vas a crear una nueva carpeta llamada `utils` en `src`. En `utils`, crea un archivo llamado `MyEpicNFT.json`. Así que la ruta completa se verá así:
`src/utils/MyEpicNFT.json`
Pegue el contenido del archivo ABI allí mismo en nuestro nuevo archivo.
Ahora que ya tienes el archivo con todo el contenido del archivo ABI listo para ser usado, es momento de importar el archivo `App.js`. Solo va a ser:
```javascript
import myEpicNft from './utils/MyEpicNFT.json';
```
¡¡Y listo!! Ya no deberíamos tener más errores. Ahora estamos listos para acuñar algunos NFTs.
Todo lo que hay que hacer desde aquí es hacer clic en "Mint NFT", pagar el gas (usaremos ETH falso), esperemos a que se extraiga la transacción y ¡bam! El NFT debería aparecer en OpenSea de manera inmediata o en un lapso de 5-15 m como máximo.
Quizás te estés preguntando qué es el gas. No voy a responder eso aquí. Pero puedes empezar a investigar [aquí](https://ethereum.org/en/developers/docs/gas/) ;).
## 🤩 Pruebas
Ya debes poder acuñar un NFT directamente desde su sitio web. **¡¡¡Vamos!!! ESO ES GENIIIAL.** Básicamente, así es como funcionan todos los sitios de acuñación de NFT y este lo hiciste por ti mismo :).
De hecho, revisa y prueba todo lo que dice el video de ABI del que hablamos anteriormente. ¡Asegúrate de verlo!  Se repasan algunas cosas muy importantes sobre qué hacer cuando **cambias** tu contrato. Debido a que el contrato es permanente, los cambios requieren una nueva implementación, actualizar la dirección en la interfaz y, finalmente, actualice el archivo ABI en la interfaz.
## ✈️ Una nota sobre redespliegues del contrato
Digamos que queremos hacer cambios en nuestro contrato, debemos hacer algunas cosas:
1. Necesitamos implementarlo nuevamente.
2. Necesitamos actualizar la dirección del contrato inteligente en nuestra interfaz.
3. Necesitamos actualizar el archivo ABI en nuestra interfaz.

**Generalmente las personas olvidan constantemente hacer estos 3 pasos cuando hacen cambios en el contrato. No lo olvides tú jajaja.**
¿Por qué tenemos que hacer todo esto? Bueno, pues porque los contratos inteligentes son **inmutables**. No pueden cambiar. Son permanentes. Eso significa que cambiar un contrato requiere una redistribución completa. Esto también **restablecerá** todas las variables, ya que se trataría como un contrato nuevo. **Eso significa que perderíamos todos nuestros datos de los NFT si quisiéramos actualizar el código del contrato.**
## 🚨 Reporte de avances.
¡Publica una captura de pantalla de tu consola después de acuñar algunos NFT y muestra todos esos registros de consola `console.log`!

