## 🪟 Configuración de Solana en una máquina con Windows

** En primer lugar, ¡quiero agradecer ENORMEMENTE a nuestro Asistente Técnico, Raza! Sin Raza, esta guía no hubiera sido posible. Una vez que termines esta sección, asegúrate de darle amor a Raza en Discord (TooManyBags#3359)**

Este documento te guiará a través del proceso de configuración del entorno de Solana en tu máquina Windows local. El gran problema aquí es **Windows no es realmente compatible con Anchor en este momento.** Esto significa que necesitamos usar una plataforma que *es* compatible.

¡Windows te permite iniciar un entorno Linux para escenarios como este! Habrá algunos pasos adicionales para solucionar todo esto antes de comenzar a configurar todas las dependencias de Solana.

### 👩‍💻 Configurar WSL

Como dije anteriormente, técnicamente no vamos a usar Windows para este proyecto, ¡sino Linux! Windows cuanto con esto genial llamado [**Subsistema de Windows para Linux**](http://docs.microsoft.com/en-us/windows/wsl/). Si tienes mucha curiosidad sobre cómo funcionará todo esto, investiga un poco e informa a los demás en su cohorte.

Para comenzar con WSL, necesitaremos instalarlo. Continúe y abra `cmd.exe` en modo Administrador para comenzar y luego ejecutará este comando:

```bash
wsl --install
```

Este comando habilitará los componentes opcionales requeridos, descargará el kernel de Linux más reciente, establecerá WSL 2 como predeterminado e instalará una distribución de Linux (Ubuntu de manera predeterminada, a continuación, vamos a cambiar esto).

Si te interesa hacer una configuración un poco más personalizada, no dudes en consultar [esta guía de instalación] (https://docs.microsoft.com/en-us/windows/wsl/install).

Una vez finalizada esta instalación, **NECESITAS** reiniciar su computadora. Las cosas definitivamente no funcionarán si instala WSL y no reinicia su máquina. ¡Tómate un segundo para hacer eso y nos encontraremos aquí cuando lo hayas hecho!

### 📀 Instalación de Node.js

¡Genial! Ahora tienes un subsistema Linux disponible en la máquina. En realidad, es genial ver cómo funciona todo esto. Lo único que debes tener en cuenta es que este entorno se abstrae del entorno de Windows. Por lo tanto, no se puede acceder a todo en tu máquina con Windows en la instancia de Ubuntu. ¡Esto significa que no tenemos Node.js instalado, algo que necesitaremos para configurar el resto de nuestro entorno Solana!

Comencemos yendo al menú de búsqueda y escribiendo `Ubuntu`. Deberás ver una ventana emergente con la opción de shell de Ubuntu: siga adelante y has clic. ¡Ahora, algunos de ustedes pueden encontrarse con un error donde abren su terminal y luego dice que hay un error y cierra la terminal! Asegúrate de seguir estos dos pasos para solucionarlo:

**- Verificar que las características del subsistema Linux estén habilitadas**

Para esto, queremos asegurarnos de que la máquina esté realmente habilitada para usar WSL. En la barra de búsqueda, escribe "Características de Windows". Deberás ver una opción que dice algo como habilitar y deshabilitar las funciones de Windows. Adelante, elige eso. Ahora asegúrate de que las siguientes opciones estén marcadas:

- Subsistema de Windows para Linux
- Subsistema de Windows para Linux
- Plataforma de máquina virtual
- 
Una vez que tengas todo esto listo, reinicia la máquina de nuevo y ve si puedes abrir la terminal de Ubuntu. Si todavía tienes problemas, esto puede significar que tu CPU no tiene habilitada la virtualización.

**- Activar la virtualización.**

Esto suena más intenso de lo que realmente es. Esencialmente, algunas personas pueden no tener activada una función en su CPU. Vamos a asegurarnos de que esté encendido.

Para ello, deberás ingresar al BIOS de la máquina. No todas las computadoras pueden ingresar al BIOS de la misma manera. Recomendaría buscar cómo obtener acceso a su BIOS. Esto requerirá que reinicie su computadora, ¡así que asegúrate de abrirlo en otra máquina o en su teléfono!

A medida que la computadora se reinicia, presiona la tecla "DEL" y "F2". Una de estas teclas suele ser la forma de ingresar al BIOS de la computadora. En este punto, ir a la sección "Opciones avanzadas". Nuevamente, esto puede tener un nombre diferente, pero debería ser algo similar a más opciones.

Desde aquí, dirígete a una sección de CPU o una sección de Virtualización y asegúrate de que dice "Habilitado".

¡Estos dos pasos te pondrán en camino ahora! Si no funciona puedes comunicarte en el chat en Discord con cualquier error que tengas.

Ahora que tenemos Ubuntu Terminal listo para usar, podemos comenzar a instalar Node.js 😎. De hecho, vamos a usar algo llamado [nvm](https://github.com/nvm-sh/nvm). ¡Hará que sea increíblemente fácil instalar y cambiar versiones de Node!

Sigue [esta guía] (https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl) sobre cómo obtener esta configuración en WSL, pero esencialmente el flujo se verá así:

```
// Install Curl
sudo apt-get install curl

// Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash

// Restart Ubuntu Terminal

// Test if nvm exists - this will return "nvm" and not a version number if working correctly!
command -v nvm

// Install the latest version of Node.js
nvm install --lts
```

¡Es así de fácil! Una vez que tengas todo esto configurado, ¡estarás listo para volver a encarrilarte con el resto de su configuración! Recuerda: todos los comandos de tu terminal **NECESITAN** ejecutarse en esta Terminal de Ubuntu a partir de ahora.

### 🦀 Instalar Rust

¡En Solana, los programas están escritos en Rust! Si no conoces Rust no te preocupes. Siempre que sepa algún otro lenguaje, lo aprenderás en el transcurso de este proyecto.

Para instalar Rust solo usa este comando:

```bash
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

Una vez que hayas terminado, verifica:

```bash
rustup --version
```

Luego, el compilador de Rust debe estar instalado:

```bash
rustc --version
```

Por último, asegurémonos de que Cargo también funcione. Cargo es el administrador de paquetes de Rust.

```bash
cargo --version
```

Siempre y cuando todos estos comandos generen una versión y no tengan errores, ¡ya está listo!

### 🔥 Instalar Solana

Solana tiene una CLI súper agradable que será útil más adelante cuando queramos probar los programas que escribimos.
De nuevo, los pasos de instalación son bastante sencillos [aquí](https://docs.solana.com/cli/install-solana-cli-tools#use-solanas-install-tool). Hay pasos claros para instalar la CLI de Solana para Linux.

**No** te preocupe por actualizar a la última versión de Solana.

*Nota: Dependiendo del sistema, una vez que instales Solana, se puede generar un mensaje como "Actualice su variable de entorno PATH" y te dará una línea para copiar y ejecutar. Copie y ejecuta este comando para que la RUTA se configure correctamente.*

Una vez que hayas terminado de instalar, ejecuta esto para asegurarte de que todo funcione:

```bash
solana --version
```

Si al hacer esto se genera un número de versión, ¡está listo!

Lo siguiente es ejecutar estos dos comandos por separado:

```bash
solana config set --url localhost
solana config get
```

Esto generará algo así:

```bash
Config File: /Users/flynn/.config/solana/cli/config.yml
RPC URL: http://localhost:8899
WebSocket URL: ws://localhost:8900/ (computed)
Keypair Path: /Users/flynn/.config/solana/id.json
Commitment: confirmed
```

¡Esto significa que Solana está configurado para comunicarse con nuestra red local! Al desarrollar programas, trabajaremos con nuestra red Solana local para que podamos probar cosas rápidamente en nuestra computadora.

Lo último que debemos probar es que queremos asegurarnos de que podemos ejecutar un **nodo local de Solana**. Básicamente, ¿recuerdas que dijimos que la cadena Solana está dirigida por "validadores"? Bueno, en realidad podemos configurar un validador en nuestra computadora para probar nuestros programas.

```bash
solana-test-validator
```

Esto puede tomar un poco de tiempo para ejecutarse, pero una vez que esté funcionando, deberías ver algo como esto:

![Untitled](https://i.imgur.com/F2YwcAB.png)

¡¡Excelente!! Ahora estás ejecutando un validador local. Muy genial :).

Ahora, vamos adelante y da clic a CONTROL + C para detener el validador. **Nunca volveremos a usar `solana-test-validator` manualmente.** El flujo de trabajo que vamos a seguir ejecutará automáticamente el validador en segundo plano para nosotros. Solo quería mostrarte cómo funciona para que puedas comenzar a tener una idea de cómo funcionan las cosas mágicamente a medida que avanzamos;).

### ☕️ Instalar Mocha

Mocha es un marco de prueba pequeño y agradable para ayudarnos a probar nuestros programas Solana.

```bash
npm install -g mocha
```

¡Eso es todo! Vamos a usar esto más adelante :).

### ⚓️ La magia de Anchor

Vamos a usar mucho esta herramienta llamada "Anchor". Si conoces Hardhat del mundo de Ethereum, ¡es algo parecido! Excepto que está hecho para Solana. **Básicamente, hace que sea muy fácil para nosotros ejecutar los programas de Solana localmente e implementarlos en la cadena de Solana real cuando estemos listos.**

Anchor es un proyecto *muy reciente* dirigido por unos pocos desarrolladores principales. Es probable que te encuentres con algunos problemas. Asegúrate de unirse a [Anchor Discord](https://discord.gg/8HwmBtt2ss) y no dudes en hacer preguntas o [crear un tema](https://github.com/project-serum/anchor/issues) en su Github a medida que te encuentres con algún problema. Los desarrolladores son impresionantes. Tal vez incluso digas que eres de buildspace en #general en su Discord :).

**Por cierto, no te unas a su Discord y hagas preguntas aleatorias esperando que la gente te ayude. Buscar primero en su Discord para ver si alguien más ha tenido la misma pregunta. Proporciona tantos detalles e información sobre tus preguntas como sea posible. Haz que la gente quiera ayudarte jajaja.**

*En serio: únete a Discord, los desarrolladores son realmente útiles.*

Para instalar Anchor, ejecuta:

```bash
npm install --global yarn
```

Esto nos ayudará más adelante :)

Ahora ejecuta:

```bash
sudo apt-get update && sudo apt-get upgrade && sudo apt-get install -y pkg-config build-essential libudev-dev libssl-dev
cargo install --git https://github.com/project-serum/anchor anchor-cli --locked
```

¡Eso es todo! En este punto, puedes ejecutar este último comando para asegurarte de que Anchor esté listo para rockear 🤘:

```bash
anchor --version
```

Si lo hiciste funcionar, genial, ¡Ya tienes Anchor!

### 🏃‍♂️ Crea un proyecto de prueba y ejecútalo

Bien, *casi terminamos* jaja. Lo último que debemos hacer para finalizar la instalación es ejecutar un programa Solana localmente y asegurarnos de que realmente funcione.

Comencemos un proyecto estándar de Solana llamado `myepicproject`.

```
anchor init myepicproject --javascript
cd myepicproject
```

`anchor init` creará un montón de archivos/carpetas para nosotros. Es algo así como `create-react-app` en cierto modo. Vamos todo lo que se ha creado en este momento.

### 🔑 Crea un par de llaves local

Lo siguiente que debemos hacer es generar una cartera Solana local para trabajar. No se preocupe por crear una frase de contraseña por ahora, solo da clic a "Entrar" cuando se te pregunte.

```bash
solana-keygen new
```

Lo que esto hará es crear un par de claves Solana locales, que es algo así como una cartera local que usaremos para comunicarnos con nuestros programas a través de la línea de comandos. Si ejecutas `solana config get` verás algo llamado `Keypair Path`. Ahí es donde se ha creado la cartera, no dudes en echarle un vistazo :).

Si ejecutas:

```bash
solana address
```

Verás la dirección pública de tu cartera local que acabamos de crear.

###  🥳 Vamos a ejecutar nuestro programa

Cuando hicimos `anchor init`, creó un programa Solana básico para nosotros. Lo que queremos hacer ahora es:

1. Compilar nuestro programa.
2. Inicia `solana-test-validator` e implementa el programa en nuestra red Solana **local** con nuestra cartera. Esto es como implementar nuestro servidor local con código nuevo.
3. Realizar llamadas a funciones en nuestro programa desplegado. Esto es como acceder a una ruta específica en nuestro servidor para probar que funciona.

Anchor es increíble. Nos permite hacer todo esto en un solo paso ejecutando:

*Nota: asegúrate de **no** tener `solana-test-validator` ejecutándose en ningún otro lugar, ya que entrará en conflicto con Anchor. Me tomó un tiempo darme cuenta jajaja.*

```bash
anchor test
```

¡Esto puede tardar un poco la primera vez que lo ejecutes! ¡Mientras obtengas las palabras verdes en la parte inferior que dicen "1 passing", estás listo para comenzar! Infórmanos en Discord si tienes algún problema aquí.

![Untitled](https://i.imgur.com/V35KchA.png)

**Nota: si recibes el mensaje `node: --dns-result-order= is not allow in NODE_OPTIONS`, significa que tienes una versión anterior de Node y, técnicamente, ¡esto no pasó! Dado que probé todo esto con Node v16.13.0, te sugiero que actualices a esta versión.**

**Felicitaciones, has configurado con éxito tu entorno Solana :).** Ha sido todo un viaje, pero lo logramos familia.

### 🚨 Reporte de avances

*Por favor haz esto sino Farza se pondrá triste :(*

¡¡¡Todo eso fue bastante duro!!! Definitivamente una de las instalaciones más difíciles.

Publica una captura de pantalla de esto trabajando en `#progress` para que la gente sepa que lo lograste :).
¡Ahora vamos al [panel de buildspace] (https://app.buildspace.so/courses/CObd6d35ce-3394-4bd8-977e-cbee82ae07a3) para continuar!
