✅ Configura tu entorno para empezar a trabajar con la blockchain
---------------------------------------------------

Antes de nada, necesitaremos hacer funcionar nuestra red local de Ethereum. ¡Así podremos compilar y probar nuestro código smart contract! ¿Sabéis que hay que configurar un entorno local para poder trabajar en él? Pues lo mismo.

Por ahora, todo lo que necesitas saber es que un smart contract es una pieza de código que vive en la blockchain. La blockchain es un lugar público donde cualquiera puede leer y escribir datos de forma segura a cambio de una cuota. Piensa en ello como AWS o Heroku, ¡excepto que nadie lo posee!

Así que, en este caso, queremos que la gente nos 👋 . Los detalles aquí:

1\. **Vamos a escribir un smart contract.** Ese contrato tiene toda la lógica en torno a cómo se manejan los 👋 . Esto es como el código de tu servidor.

2\. **Después, vamos a desplegar el contrato a la blockchain.** De esta manera, cualquier persona en el mundo será capaz de acceder y ejecutar nuestro smart contract (si les damos permiso para hacerlo). O sea, más o menos como un servidor :).

3\. **Vamos a construir una web** que permitirá a la gente interactuar fácilmente con nuestro smart contract en la blockchain.

Explicaré ciertas cosas en profundidad según sea necesario (por ejemplo, cómo funciona la minería, cómo se compilan y ejecutan los smart contract, etc.) *pero por ahora vamos a centrarnos en hacer que las cosas funcionen*.

Si tienes algún problema a lo largo de esta sección, simplemente deja un mensaje en Discord en `#section-1-help`. 

✨ La magia de Hardhat
----------------------

1\. Vamos a usar mucho una herramienta llamada Hardhat. Esto nos permitirá montar una red local de Ethereum faciljmente, darnos ETH de prueba falsos y cuentas de prueba falsas para trabajar. Recuerda, es como un servidor local, excepto que el "servidor" es la blockchain.

2\. Compilar los smart contract y probarlos en nuestra blockchain local.

Primero necesitarás tener node/npm. Si no lo tienes dirígete [aquí](https://hardhat.org/tutorial/setting-up-the-environment.html).

A continuación, vamos a la terminal (Git Bash no funcionará). Ve al directorio en el que quieres trabajar. Una vez allí ejecuta estos comandos:

```bash
mkdir my-wave-portal
cd my-wave-portal
npm init -y
npm install --save-dev hardhat
```

👏 Pon en marcha el proyecto de ejemplo
---------------------------

Guay, ahora deberíamos tener hardhat. Vamos a poner en marcha un proyecto de ejemplo.

Ejecuta:

```bash
npx hardhat
```

Elige la opción de crear un proyecto de ejemplo (sample project). Di que sí a todo.

El proyecto de ejemplo te pedirá que instales hardhat-waffle y hardhat-ethers. Estas son otras cosillas que usaremos más tarde :).

Sigue adelante e instala estas otras dependencias en caso de que no lo haga automáticamente.

```bash
npm install --save-dev @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers
```

Por último, ejecuta `npx hardhat accounts` y esto debería imprimir un montón de texto que se parece a esto: 

`0xa0Ee7A142d267C1f36714E4a8F75612F20a79720`

Estas son direcciones de Ethereum que Hardhat genera por nosotros para simular usuarios reales en la blockchain. ¡Esto nos va a ayudar mucho más adelante en el proyecto cuando queramos simular usuarios 👋 !

🌟 Ejecútalo
---------

Para asegurarte de que todo funciona, ejecuta:

```bash
 npx hardhat compile
```
Luego ejecuta:

```bash
npx hardhat test
```

Deberías ver algo como esto

![](https://i.imgur.com/rjPvls0.png)

Vamos a hacer un poco de limpieza.

Abre el código del proyecto ahora en tu editor de código favorito. A mí me gusta VSCode. Queremos eliminar todo el código de inicio generado por defecto. No necesitamos nada de eso. ¡Somos profesionales ;)!

Borra el archivo `sample-test.js` en `test`.  También, borra `sample-script.js` en `scripts`. Luego, borra `Greeter.sol` en `contracts`. No borres las carpetas, solo los archivos.

🚨 Antes de hacer click en "Next Lesson"
-------------------------------------------

*Nota: si no haces esto, Farza se pondrá muy triste :(.*

¡Dirígete a #progress y publica una captura de pantalla de **tu** terminal mostrando el resultado de la prueba! Acabas de ejecutar un smart contract ¡Eso es algo tremendo! Enséñaselo a todos :).

P.D.: Si no tienes acceso a #progress, asegúrate de enlazar tu Discord, únete a Discord [aquí] (https://discord.gg/mXDqs6Ubcc), ¡Mándanos un mensaje en #general y te ayudaremos a conseguir acceso a los canales adecuados!
