## 📚 Un pequeño manual de blockchain.
Antes que nada, necesitas tener tu red local de Ethereum funcionando correctamente. Con esto vamos a poder compilar y hacer pruebas al código del contrato inteligente. Configurarás un entorno local para trabajar en él.
Por ahora, todo lo que necesitas saber es que un contrato inteligente es una pieza de código que vive en la cadena de bloques. La Cadena de Bloques es un lugar público que cualquiera puede leer e incluir datos de manera segura por una tarifa. Piensa en algo como AWS o Heroku con la excepción de que nadie es dueño de la información. Está dirigido por miles de personas al azar conocidos como “mineros”.
La idea central aquí será:
1 --	Vamos a escribir un contrato inteligente. El contrato tendrá toda la lógica de cómo funcionan los NFTs.
2 --	Nuestro contrato será desplegado a la cadena de Bloques. De esta forma cualquiera podrá entrar y usar nuestro contrato y podrán acuñar los NFTs.
3 --	Vamos a construir un sitio web para que las personas o usuarios puedan acuñar e interactuar fácilmente con nuestra colección de NFTs.
Te recomiendo que cuando puedas leas [estas](https://ethereum.org/en/developers/docs/intro-to-ethereum/) publicaciones, son los mejores artículos que podrás leer y son las mejores guías que podrás encontrar para entender el funcionamiento de Ethereum en mi opinión.
## ⚙️ Configuración del entorno local.
Vamos a utilizar una herramienta llamada Hardhat que nos permitirá compilar rápidamente contratos inteligentes y probarlos de manera local. Primero necesitan instalar node/npm. Si no lo tienes descárgalo aquí. (https://hardhat.org/tutorial/setting-up-the-environment.html?utm_source=buildspace.so&utm_medium=buildspace_project).
*Nota: Yo utilizaré en el node versión 16. Sé que algunas personas han recibido "errores de falta de memoria" o “out of memory errors” en versiones anteriores de node, así que, si eso sucede, ¡descarga la versión node 16!*
A continuación, vayamos a la terminal. Vamos a dirigirnos (con `cd`) al directorio en el que deseas trabajar. Una vez ahí, ejecuta estos comandos:
```bash
mkdir epic-nfts
cd epic-nfts
npm init -y
npm install --save-dev hardhat
```
Lo que sucederá aqui es, cuando ejecutas:
1. `mkdir epic-nfts` para crear un directorio llamado "epic-nfts".
2. `cd epic-nfts` para acceder al nuevo directorio creado.
3. `npm init -y` para generar un proyecto npm vacío sin tener que hacer ningún proceso interactivo. La -y es para señalar que si.
4. `npm install --save-dev hardhat` para instalar Hardhat.

Es posible que vean un mensaje sobre vulnerabilidades después de ejecutar el último comando e instalar Hardhat. Cada vez que se instala algo de NPM, se realiza una verificación de seguridad para ver si alguno de los paquetes de la biblioteca que se están instalando tienen alguna vulnerabilidad. ¡Esto es más una advertencia para que estés al tanto! ¡Busca un poco en Google sobre estas vulnerabilidades si quieres saber más!
## 🔨 Pongamos en marcha nuestro proyecto de muestra.
Excelente, Ya que tenemos Hardhat empecemos nuestro proyecto.
Inicializar:
```
npx hardhat
```
*Nota: Si en Windows estás usando Git Bash para instalar HardHatpodrías obtener un error en este paso (HH1). Puedes tratar de utilizar CMD en Windows para realizar la instalación. Puedes encontrar información adicional [aquí](https://github.com/nomiclabs/hardhat/issues/1400#issuecomment-824097242).*
Al instalar escoge la opción de crear un un proyecto de muestra simple. Ponle que si a todas las opciones que aparezcan.
El proyecto de muestra te va a solicitar que instales hardhat-waffle y hardhat-ethers. Estas herramientas las usaremos posteriormente y serán muy útiles.
Continuemos e instalemos estas dependencias en caso de que no se hayan instalado de forma automática.
```bash
npm install --save-dev @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers
```
También sería recomendable que instales algo llamado **OpenZeppelin** la cual es otra librería que se utiliza mucho desarrollar contratos inteligentes más seguros. Vamos a aprender de esto más adelante. Por ahora solo instálalo :)
```bash
npm install @openzeppelin/contracts
```
Ahora ejecuta:
```bash
npx hardhat run scripts/sample-script.js
```
Debes obtener algo así:
![Untitled](https://i.imgur.com/LIYT9tf.png)
¡¡Boom!! Si ves algo en tu pantalla significa que tu entorno local está configurado de manera adecuada **y** que además ya implementaste un contrato inteligente a tu cadena de bloques local.
Esto es bastante épico. Entraremos más a detalle en esto, pero básicamente lo que está sucediendo aquí paso a paso es:
1.	Hardhat compila el contrato inteligente desde solidity hacia bytecode.
2.	Hardhat activará una "cadena de bloques local" en tu computadora. ¡Es como una mini versión de prueba de Ethereum que se ejecuta en tu máquina y que sirve para hacer pruebas rápidamente!
3.	Hardhat "implementará" el contrato compilado en la cadena de bloques local. La dirección que ves al final de la imagen es nuestro contrato implementado, en nuestra mini versión de Ethereum.
Si tienes curiosidad, no dudes revisar el código del proyecto para ver cómo funciona. Específicamente, puedes revisar `Greeter.sol`, que es el contrato inteligente, y `sample-script.js`, que donde en realidad se ejecuta el contrato.
Una vez que haya terminado de explorar e investigar, vamos a la siguiente lección y comencemos a hacer nuestro propio contrato NFT.
## 🚨 Reporte de avances.
Publica una imagen de tu terminal con el resultado obtenido de `sample-script.js` en #progress en discord. :).
