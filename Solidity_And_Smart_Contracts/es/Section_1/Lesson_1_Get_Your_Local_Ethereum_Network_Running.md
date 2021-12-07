✅ Configura tu entorno para comenzar a trabajar con la blockchain
---------------------------------------------------

Antes que nada, necesitaremos tener nuestra red de Ethereum local funcionando. De esta manera podremos compilar y probar nuestro smart contract! ¿Has visto cuando debes configurar un entorno local antes de trabajar en un proyecto? ¡Lo mismo sucede aquí!

Por ahora, todo lo que necesitas saber es que un smart contract (o "contrato inteligente") es código que habita en la blockchain ("cadena de bloques", en inglés). La blockchain es un lugar público donde cualquiera puede leer y escribir datos de manera segura a cambio de una comisión. Piensa como si fuese AWS o Heroku, ¡pero en este caso no tiene un dueño!

Entonces, en este caso, queremos que la gente pueda 👋-arnos. En términos generales, queremos:

1\. **Escribiremos un contrato inteligente.** Ese contrato tiene toda la lógica acerca de cómo los 👋  son manejados. Sería como nuestro código del servidor.

2\. **Nuestro contrato inteligente será desplegado en la blockchain.** De esta manera, cualquiera en el mundo podrá acceder y ejecutar nuestro smart contract (si les damos permiso para hacerlo). Asique, si. Muy parecido a un servidor :) 

3\. **Construiremos un sitio cliente.** Que permitirá a la gente interactuar de manera simple con nuestro smart contract.

Explicaré ciertas cosas en profundidad en cuanto se necesite (por ejemplo, como funciona la minería, como los contratos inteligentes son compilados y ejecutados, etc) *pero por ahora enfoquémonos en que las cosas funcionen* 

Si tienes algun problema atravesando esta etapa, simplemente dejanos un mensaje en Discord en `#section-1-help`. 

✨ La magia de Hardhat
----------------------


Estaremos usando mucho una herramienta llamada Hardhat. Esta herramienta nos permitirá fácilmente configurar una red local de Ethereum y darnos ETH falso para pruebas, así como también algunas cuentas de prueba para realizar pruebas. Recuerda, es igual a un servidor local, excepto que el "servidor" es la blockchain. 

Primero necesitas tener node/npm. Si no lo tienes, dirígete [aquí](https://hardhat.org/tutorial/setting-up-the-environment.html).

Lo siguiente, deberemos ir a la terminal (Git Bash no funcionará). Dirígete a la ubicación donde quieras crear el directorio para el proyecto. Una vez allí, ejecuta los siguientes comandos:

```bash
mkdir my-wave-portal
cd my-wave-portal
npm init -y
npm install --save-dev hardhat
```

👏 Ejecutemos el script de prueba 
---------------------------

Genial, ya deberías tener Hardhat. Vamos a crear un proyecto de prueba.

Ejecuta:

```bash
npx hardhat
```

Elige la opción para crear un "sample project" (proyecto de prueba)

El proyecto de prueba te pedirá instalar hardhat-waffle y hardhat-ethers. Estas son utilidades que usaremos más tarde :)

Instala las demás dependencias en caso de que no lo haya hecho el script de por sí solo:

```bash
npm install --save-dev @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers
```

Finalmente, ejecuta `npx hardhat accounts` Y esto debería mostrar un montón de strings de este estilo:

`0xa0Ee7A142d267C1f36714E4a8F75612F20a79720`

Estas son direcciones de Ethereum que Hardhat genera para nosotros para simular usuarios reales en la blockchain. Esto nos ayudará mucho un poco más adelante en el proyecto cuando queramos simular usuarios que nos 👋-dan!

🌟 Ejecútalo
---------

Para verificar que todo esté funcionando, ejecuta:

```bash
 npx hardhat compile
```
Then run:

```bash
npx hardhat test
```

Deberías ver algo así:

![](https://i.imgur.com/rjPvls0.png)

Limpiemos un poco.

Abre el código del prouecto en tu editor de proyectos favorito. Yo prefiero VS Code! Queremos borrar todo lo que el script de prueba generó por nosotros. No necesitamos nada de eso. Somos pros ;)!

Ahora borra el archivo `sample-test.js` en la carpeta `test`. También borra `sample-script.js` en la carpeta `scripts`. Luego, borra `Greeter.sol` en la carpeta `contracts`. No borres las carpetas en sí!

🚨 Antes de que hagas click en "siguiente lección".
-------------------------------------------

*Nota: si no haces esto, Farza estará muy triste :(.*

Ve a #progress en Discord y postea una captura de pantalla de  **tu** terminal mostrando la salida de tu test! Acabas de ejecutar un smart contract, ¡es increíble! muéstralo :).

P.D: Si **no** tienes acceso a #progress, asegúrate de haber vinculado tu Discord. Únete al discord [aquí](https://discord.gg/mXDqs6Ubcc), encuéntranos en #general y te ayudaremos a obtener acceso a los demás canales!
