✅ Configura tu entorno para comenzar a trabajar con la blockchain
---------------------------------------------------

Antes que nada, necesitaremos que nuestra red local Ethereum funcione. ¡Así es como podemos compilar y probar el código de nuestro contrato inteligente! ¿Sabes cómo necesitas transformar un entorno local para trabajar en él? ¡Lo mismo ocurre aquí!

Por ahora, todo lo que necesitas saber es que un contrato inteligente es un fragmento de código que vive en la blockchain. La blockchain es un lugar público donde cualquiera puede leer y escribir datos de forma segura por una tarifa. Piensa en ello como AWS o Heroku, ¡excepto que nadie lo posee!

Entonces, en este caso, queremos que la gente nos 👋 . El panorama general aquí es:

1 \. **Vamos a escribir un contrato inteligente.** Ese contrato tiene toda la lógica sobre cómo se manejan los 👋 s. Es como el código de tu servidor.

2 \. **Nuestro contrato inteligente se desplegará en la blockchain.** De esta manera, cualquier persona en el mundo podrá acceder y ejecutar nuestro contrato inteligente (si le damos permiso para hacerlo). Más o menos como un servidor :).

3 \. **Vamos a crear el cliente de una página web** que permitirá a las personas interactuar fácilmente con nuestro contrato inteligente en la blockchain.

Explicaré ciertas cosas en profundidad según sea necesario (por ejemplo, cómo funciona la minería, cómo se compilan y ejecutan los contratos inteligentes, etc.) *pero por ahora centrémonos en hacer que las cosas funcionen*.

Si tienes algún problema hasta aquí, solo envía un mensaje en Discord en `#section-1-help`.

✨ La magia de Hardhat
----------------------

1 \. Vamos a utilizar mucho una herramienta llamada Hardhat. Esta nos permitirá poner en marcha fácilmente una red Ethereum local y darnos ETH de prueba falsos y cuentas de prueba falsas con las que trabajar. Recuerda, es como un servidor local, excepto que el "servidor" es la blockchain.

2 \. Compila rápidamente contratos inteligentes y pruébalos en nuestra blockchain local.

Primero necesitarás obtener node/npm. Si no lo tienes, visita [aquí](https://hardhat.org/tutorial/setting-up-the-environment.html).

```bash
mkdir my-wave-portal
cd my-wave-portal
npm init -y
npm install --save-dev hardhat
```

👏 Pon en marcha el proyecto de muestra
---------------------------

Genial, ahora deberíamos tener Hardhat. Pongamos en marcha un proyecto de muestra.

Ejecuta:

```bash
npx hardhat
```

*Nota: si tienes instalado yarn con npm, puedes obtener errores como `npm ERR! could not determine executable to run`. En este caso, puedes hacer `yarn add hardhat`.*

Elige la opción para crear un proyecto de muestra. Di que sí a todo.

El proyecto de muestra te pedirá que instales hardhat-waffle y hardhat-ethers. Estos son otros beneficios que usaremos más adelante :).

Instala estas otras dependencias en caso de que no lo hiciera automáticamente.

```bash
npm install --save-dev @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers
```

Finalmente, ejecuta `npx hardhat accounts` y esto debería imprimir un montón de cadenas de texto que se ven así: 

`0xa0Ee7A142d267C1f36714E4a8F75612F20a79720`

Estas son direcciones de Ethereum que Hardhat genera para que simulemos usuarios reales en la blockchain. ¡Esto nos ayudará mucho más adelante en el proyecto cuando queramos simular usuarios 👋-nos!

🌟 Ejecútalo
---------

Para asegurarse de que todo funciona, ejecuta:

```bash
 npx hardhat compile
```

Luego ejecuta:

```bash
npx hardhat test
```

Deberías ver algo como esto:

![](https://i.imgur.com/rjPvls0.png)

Hagamos una pequeña limpieza.

Abre el código del proyecto ahora en tu editor de código favorito. ¡Me gusta más VSCode! Queremos eliminar todo el código de inicio generado para nosotros. No necesitamos nada de eso. Somos profesionales ;)!

Ahora elimina el archivo `sample-test.js` bajo `test`. También, elimina `sample-script.js` bajo `scripts`. Entonces, elimina `Greeter.sol` bajo `contracts`. ¡No borres las carpetas reales!

🚨 Antes de hacer clic en "Lección siguiente"
-------------------------------------------

*Nota: si no hace esto, Farza se pondrá muy triste :(.*

Dirígete a #progress y publica una captura de pantalla de **tu** terminal mostrando el resultado de la prueba. ¡Acabas de ejecutar un contrato inteligente, eso es algo grande! Muéstralo :).

PD: si **no** tienes acceso a #progress, asegúrate de conectar tu Discord, únete a Discord [aquí](https://discord.gg/mXDqs6Ubcc), contáctanos en #general ¡te ayudaremos a obtener acceso a los canales correctos!