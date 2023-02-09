### 🦾 ¿Qué vamos a hacer?

Tenemos todo lo de nuestra aplicación web en su mayoría ya hechas. ¡Pero estamos usando datos falsos! Vamos a crear un programa de Solana que permita a los usuarios 1) enviar gifs al cuadro 2) guardarlos en la cadena de bloques de Solana 3) recuperar todos los GIF que se han enviado.

Una vez que hagamos esto, implementaremos nuestro programa Solana y lo conectaremos a nuestra aplicación web, ¡como si implementaras una API y luego la conectaras a la aplicación web!

### 📝 Un detalle sobre Solana antes de comenzar a usarlo

Estoy de acuerdo, entonces, siendo honesto, hacer que Solana funcione **no es algo fácil actualmente.**

Ahora, ¿eso significa esto que no vale la pena Solana? Ehhhh. No, no lo creo.
Creo que Solana es una pieza de tecnología que realmente está en una etapa **temprana** y, debido a que es tan temprana, cambia con frecuencia, por lo que es difícil simplemente buscar en Google una pregunta u obtener una respuesta clara y concisa de Solana Docs.

En 2015, estaba realmente interesado en el aprendizaje automático y esto todavía era bastante nuevo. Los documentos de aprendizaje automático apestaban y era difícil buscar una respuesta a una pregunta porque la mayoría de las veces yo era la primera persona que hacía esa pregunta jajaja. *Dependía de mí encontrar una respuesta y luego actualizar los documentos yo mismo.*

Ese es el precio de jugar con una pieza de tecnología emergente :).

Creo que Solana se encuentra en un lugar similar y realmente quiero dejarlo claro: **no esperes una experiencia de desarrollador súper limpia. Es probable que te encuentres con baches aleatorios y depende de ti encontrar una respuesta y ayudar a otros.**

Me gustó este [tweet] (https://twitter.com/armaniferrante/status/1434554725093949452) que presenta una idea similar.

** Dicho lo anterior, creo que Solana es increíblemente divertido una vez que lo configuras y te das cuenta de cómo funciona. es muy rápido,  Las tarifas de gas son muy baratas y mágicas. Es muy divertido ser parte de una comunidad que trabaja en una tecnología innovadora. Se siente como si fueras parte del equipo que está construyendo Solana :).**

### 🚦 Elige tu camino
La configuración de Solana comienza en tu máquina. Hay un montón de "detalles" en diferentes sistemas operativos. Si estás trabajando en una **máquina Intel macOS o una máquina Linux**, creo podrás continuar. Si estás en una **máquina con Windows o una máquina con macOS M1**, revisa los enlaces a continuación:

- [Configurar Solana en una máquina con Windows](https://github.com/buildspace/buildspace-projects/tree/main/Solana_And_Web3/es/Section_2/Resources/windows_setup.md)
- [Configurar Solana en una máquina M1 macOS](https://github.com/buildspace/buildspace-projects/tree/main/Solana_And_Web3/es/Section_2/Resources/m1_setup.md)

Buena suerte, ¡lo vamos a lograr!

### 🦀 Instalación de Rust

¡En Solana, los programas están escritos en Rust! Si no conoces Rust no te preocupes. Siempre que sepas algún otro lenguaje, lo irás aprendiendo en el transcurso de este proyecto.

Para instalar Rust, sigue los pasos de instalación [aquí] (https://doc.rust-lang.org/book/ch01-01-installation.html). Hay pasos claros para instalar Rust para Windows, Linux y Mac.

Una vez que lo hayas hecho, verifícalo haciendo lo siguiente:

```bash
rustup --version
```

Luego, aseguremos que el compilador de Rust esté instalado:

```bash
rustc --version
```

Por último, asegurémonos de que Cargo también funcione. Cargo es el administrador de paquetes de Rust.

```bash
cargo --version
```

Ya que todos esos comandos generen una versión y no tengan errores, ¡estamos listos!

### 🔥 Instalar Solana

Solana tiene una CLI súper agradable que será útil más adelante cuando queramos probar los programas que escribimos.
De nuevo, los pasos de instalación son bastante sencillos [aquí](https://docs.solana.com/cli/install-solana-cli-tools#use-solanas-install-tool). Hay pasos claros para instalar la CLI de Solana para Windows, Linux y Mac.

**No** te preocupes por actualizar a la última versión de Solana.

*Nota: Dependiendo de tu sistema, una vez que instales Solana, se puede generar un mensaje como "Actualice su variable de entorno PATH" y le dará una línea para copiar y ejecutar. Copie y ejecute ese comando para que tu RUTA o PATH se configure correctamente.*

Una vez que hayas terminado de instalar, ejecuta esto para asegurarse de que todo funcione:

```bash
solana --version
```

Si al ejecutar esto se genera un número de versión, ¡estás listo!

Lo siguiente que haremos es ejecutar estos dos comandos por separado:

```bash
solana config set --url localhost
solana config get
```

Se debe generar algo como esto:

```bash
Config File: /Users/flynn/.config/solana/cli/config.yml
RPC URL: http://localhost:8899
WebSocket URL: ws://localhost:8900/ (computed)
Keypair Path: /Users/flynn/.config/solana/id.json
Commitment: confirmed
```

¡Esto significa que Solana está configurada y se habla con nuestra red local! Al desarrollar programas, trabajaremos con nuestra red Solana local para que podamos probar cosas rápidamente en nuestra computadora.

Lo último que debemos probar es que queremos asegurarnos de que podemos ejecutar un **nodo local de Solana**. Básicamente, ¿recuerdas que dijimos que la cadena Solana está dirigida por "validadores"? Bueno, en realidad podemos configurar un validador en nuestra computadora para probar nuestros programas.

```bash
solana-test-validator
```

### Algunas notas para usuarios de Windows

Si eres un usuario Windows y el comando anterior no funciona, o recibes el siguiente error `Unable to connect to validator: Client error: test-ledger/admin.rpc does not exist`, asegúrate de hacer lo siguiente.

1. Abre WSL en lugar de Powershell.
2. Ingresa el comando `cd ~/` para salir del directorio de inicio
3. Ahora escribe `solana-test-validator`

Esto puede tomar un poco de tiempo para comenzar, pero una vez que esté funcionando, debería ver algo como esto:

![Untitled](https://i.imgur.com/F2YwcAB.png)

¡¡Boom!! Ahora estás ejecutando un validador local. Muy genial :).

Si está ejecutando un Intel Mac y ve el siguiente error, deberás instalar la biblioteca `OpenSSL`. La forma más fácil de hacer esto sería a través de brew así: `brew install openssl@1.1`

```bash
solana-gif-portal solana-test-validator
dyld: Library not loaded: /usr/local/opt/openssl@1.1/lib/libssl.1.1.dylib
  Referenced from: /Users/<your-username>/.local/share/solana/install/active_release/bin/solana-test-validator
  Reason: image not found
```

Ahora, sigamos adelante presionemos CONTROL + C para detener el validador. **Nunca volveremos a usar `solana-test-validator` manualmente.** El flujo de trabajo que vamos a seguir ejecutará automáticamente el validador en segundo plano para nosotros. Solo quería mostrarte cómo funciona para que puedas comenzar a tener una idea de cómo funcionan las cosas mágicamente a medida que avanzamos;).

### ☕️ Instalemos Node, NPM y Mocha

Es muy probable que ya tengas Node y NPM. Cuando hago `node --version` obtengo `v16.0.0`. La versión mínima es `v11.0.0`. Si no tienes Node y NPM, descárgalo [aquí] (https://nodejs.org/en/download/).

Después de instalarlo, asegúrate de instalar Mocha. Es un marco de prueba pequeño y agradable para ayudarnos a probar nuestros programas Solana.

```bash
npm install -g mocha
```

### ⚓️ La magia de Anchor

Vamos a usar mucho esta herramienta llamada "Anchor". Si conoces Hardhat del mundo de Ethereum, ¡es algo parecido! Excepto que está hecho para Solana. **Básicamente, hace que sea muy fácil para nosotros ejecutar los programas de Solana localmente e implementarlos en la cadena de Solana real cuando estemos listos.**

Anchor es un proyecto *muy reciente y nuevo* dirigido por unos pocos desarrolladores principales. Es probable que te encuentres con algunos problemas. Únete a [Anchor Discord](https://discord.gg/8HwmBtt2ss) y no dudes en hacer preguntas o [crear un tema de discusión](https://github.com/project-serum/anchor/issues) en su Github a medida que te encuentres con problemas. Los desarrolladores son increíbles. Tal vez incluso digas que eres de buildspace en #general en su Discord :).

**Por cierto, no te unas a su Discord y hagas preguntas aleatorias esperando que la gente te ayude. Esfuerzate por buscar en Discord para ver si alguien más ha tenido la misma pregunta que tú. Proporciona tanta información sobre tus preguntas como sea posible. Haz que la gente quiera ayudarte jajaja.**

*En serio: únete a Discord, los desarrolladores realmente quieren ayudar.*

La instalación de Anchor fue un poco problemática para mí, pero lo logré siguiendo los pasos a continuación. Vamos a hacerlo usando la fuente. *Nota: si estás usando Linux, hay algunas instrucciones especiales que puedes seguir [aquí](https://www.anchor-lang.com/docs/installation). Mac y Windows lo veremos a continuación. Además, si está usando Linux para Windows, ¡sigue los comandos de Linux!*

Para instalar Anchor, ejecuta lo siguiente:

```bash
cargo install --git https://github.com/project-serum/anchor anchor-cli --locked
```

Este comando puede tardar un poco en ejecutarse por completo. Una vez hecho esto, te puede pedirle que actualices su ruta, recuerda hacerlo.
Desde aquí ejecuta:

```bash
anchor --version
```

Si lograste hacerlo funcionar, genial, ¡ya tienes Anchor!
También usaremos el módulo npm de Anchor y Solana Web3 JS; ¡ambos nos ayudarán a conectar nuestra aplicación web a nuestro programa Solana!

```bash
npm install @project-serum/anchor @solana/web3.js
```

### 🏃‍♂️ Creemos un proyecto de prueba y ejecútalo

Bien, *casi terminamos* jaja. Lo último que debemos hacer para finalizar la instalación es ejecutar un programa Solana localmente y asegurarnos de que realmente funcione.

Comencemos un proyecto estándar de Solana llamado `myepicproject`.

```bash
anchor init myepicproject --javascript
cd myepicproject
```

### Notas para usuarios de Windows

1. Ejecute los comandos usando WSL2 y no powershell.
2. Si `cargo install --git https://github.com/project-serum/anchor avm --locked --force` te da errores. Consulta los documentos de usuario de Anchor. Es posible que debas instalar las dependencias de Linux (WSL). Para hacer esto, ejecuta `sudo apt-get update && sudo apt-get upgrade && sudo apt-get install -y pkg-config build-essential libudev-dev`
3. Si tiene problemas como `error: failed to run custom build command` para `openssl-sys v0.9.71`
, ejecuta `sudo apt install libssl-dev`.
4. Una vez que se hayan instalado estas dependencias, el comando del paso 2 debería funcionar.
5. Ahora configura la versión de Anchor con `avm use latest` y ya deberías estar listo para continuar.
`anchor init` creará un montón de archivos/carpetas para nosotros. Es algo así como `create-react-app` en cierto modo. Veremos todas las cosas que se han creado en este momento.

Si estás ejecutando el proyecto localmente y no tienes yarn instalado, `anchor init` fallará. Para resolver esto, puede instalar yarn ejecutando `npm install --global yarn`.

### 🔑 Crea un keypair local

Lo siguiente que vamos a hacer es generar una cartera digital Solana local para trabajar. No te preocupes por crear una frase de contraseña (passphrase) por ahora, simplemente da clic a "Entrar" cuando te pregunte.

```bash
solana-keygen new
```

Éste comando lo que hará es crear un keypair Solana local, que es algo así como nuestra cartera local que es lo que vamos a usar para comunicarnos con nuestros programas a través de la línea de comando. Si ejecutas `solana config get` verás algo llamado `Keypair Path`. Ahí es donde se ha creado la cartera, no dudes en echarle un vistazo :).

Si ejecutas:

```bash
solana address
```

Verás la dirección pública de su cartera local que acabamos de crear.

### 🥳  Vamos a ejecutar nuestro programa

Cuando hicimos `anchor init`, se creó un programa Solana básico. Lo que queremos hacer ahora es:

1. Compilar nuestro programa.
2. Inicie `solana-test-validator` e implemente el programa en nuestra red Solana **local** con nuestra cartera. Esto es como implementar nuestro servidor local con código nuevo.
3. Realizaremos llamadas a funciones en nuestro programa implementado. Esto es como acceder a una ruta específica en nuestro servidor para probar que funciona.

Anchor es increíble. Nos permite hacer todo esto en un solo paso ejecutando:

*Nota: asegúrate de que **no** tengas `solana-test-validator` ejecutándose en ningún otro lugar, ya que entrará en conflicto con Anchor.  A mí me tomó un tiempo darme cuenta jajaja.*

```bash
anchor test
```

¡Este comando puede tomar un tiempo la primera vez que lo ejecutas! Siempre y cuando obtengas las palabras verdes en la parte inferior que dicen "1 paso", ¡estamos listos para continuar! Mantennos informados en Discord si tienes problemas.

![Untitled](https://i.imgur.com/V35KchA.png)

**Nota: si recibes el mensaje `node: --dns-result-order= is not allowed in NODE_OPTIONS`, significa que estás trabajando en una versión anterior de Node y, técnicamente, ¡esto no pasó! Dado que yo probé todo esto con Node v16.13.0, te sugiero que actualices a esta versión. Actualizar Node es una molestia, obten más información aquí. Me gusta usar [nvm](https://heynode.com/tutorial/install-nodejs-locally-nvm/).**

**Nota: Si recibe este mensaje `Error: Your configured rpc port: 8899 is already in use` y no tienes una aplicación que esté escuchando el puerto 8899, intente ejecutar `solana-test-validator`, y en la pestaña de terminal`anchor test --skip-local-validator`. Ya debería funcionar bien.**

**Felicitaciones, has configurado con éxito un entorno Solana :).** Ha sido todo un viaje, pero lo logramos familia.

### 🚨 Reporte de avances

*Por favor haz esto sino Farza se pondrá triste :(*

¡¡¡Todo eso fue bastante duro!!! Definitivamente una de las instalaciones más difíciles.

Publica la captura de pantalla de tu entorno funcionando en `#progress` para que la gente sepa que lo lograste :).
