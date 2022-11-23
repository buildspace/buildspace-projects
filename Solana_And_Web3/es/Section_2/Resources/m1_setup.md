## 🍎 Configuración de Solana en una máquina M1 macOS

** En primer lugar, ¡quiero agradecer ENORMEMENTE a nuestro Asistente Técnico, Nick! Sin Nick, esta guía no hubiera sido posible. Una vez que termines esta sección, asegúrate de darle amor a Nick en Discord (Nick_G#4818)**

Vamos a pasar **de esto no funciona en M1 masOS??** a

![ankin está funcionando Gif](https://media.giphy.com/media/CuMiNoTRz2bYc/giphy.gif)

**Muy rápido.**

Esta guía te ayudará a poner en funcionamiento el entorno de Solana en la máquina local (gracias a nuestro compañero constructor, **@billyjacoby#7369**, se burló de la primera guía sobre cómo configurar sin Rosetta). Hicimos modificaciones que harán que te conviertas en Solana Master más rápido y con menos dolores de cabeza 🙂.

¡Vamos a empezar!

### ⚙️ Instalación de Rust

¡En Solana, los programas están escritos en Rust! Si no conoces Rust no te preocupes. Siempre que sepas algún otro lenguaje, lo aprenderás en el transcurso de este proyecto.

Para instalar Rust abriremos nuestra terminal y ejecutaremos este comando:

```bash
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

Aparecerán múltiples opciones para instalar. Vamos a ir con el valor predeterminado ingresando 1 y luego ¡ingresar!
Una vez que haya terminado, continuemos y vamos a reiniciar la terminal y luego verificar que se instaló ingresando:

```bash
rustup --version
```

Luego, revisar que el compilador de Rust esté instalado:

```bash
rustc --version
```

Por último, asegurémonos de que Cargo también funcione. Cargo es el administrador de paquetes de Rust.

```bash
cargo --version
```

Siempre y cuando todos estos comandos generen una versión y no tengan errores, ¡ya está listo!

### 🔥Instalar Solana - ¡ESTO ES PARA LO QUE VENIMOS!

Vamos a construir desde el origen. ¿Qué significa esto? En resumen, nos permite construir Solana en nuestra computadora en lugar de descargar una versión preconstruida.

Vamos a descargar con este comando:

```bash
git clone https://github.com/solana-labs/solana.git/
```

Una vez que haya terminado de clonar, ingresaremos al directorio de Solana y revisaremos la rama de la versión `v1.8.2`:

```bash
cd solana
git checkout v1.8.2
```

`git checkout` solo está cambiando a una versión estable, por lo que podemos enviarnos algunos `$SOL` más adelante sin recibir este error `Error: error de respuesta RPC -32601: Método no encontrado`.

A continuación, vamos a ejecutar este comando:

```bash
./scripts/cargo-install-all.sh .
```

<details>
<summary>Having Problems?</summary>
Si te llega a aparecer un error similar a este: `greadlink: comando no encontrado`, deberás hacer dos cosas:
- Instale Brew usando `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"` (esto puede llevar un rato)
- Agrega Brew a su ruta usando `export PATH="/opt/homebrew/bin:$PATH"`
- Instala coreutils usando `brew install coreutils`
¡Luego ejecute el script anterior una vez más y ve si funciona!
Si eso genera un número de versión, ¡está listo!
</details>

Esto puede tomar algún tiempo, ¡así que no te preocupes! Una vez que se haya terminado de instalar, ejecuta esto para estar seguros de que todo funcione correctamente:

```bash
solana --version
```

Lo siguiente que vamos a hacer es ejecutar estos dos comandos por separado:

```bash
solana config set --url localhost
solana config get
```

Esto generará algo como esto:

```bash
Config File: /Users/nicholas-g/.config/solana/cli/config.yml
RPC URL: http://localhost:8899
WebSocket URL: ws://localhost:8900/ (computed)
Keypair Path: /Users/nicholas-g/.config/solana/id.json 
Commitment: confirmed 
```

¡Esto significa que Solana está configurado y se habla con nuestra red local! Al desarrollar programas, trabajaremos con nuestra red Solana local para que podamos probar cosas rápidamente en nuestra computadora.

Lo último que debemos probar es que queremos asegurarnos de que podemos ejecutar un nodo local de Solana. Básicamente, ¿recuerdas que dijimos que la cadena Solana está dirigida por "validadores"? Bueno, en realidad podemos configurar un validador en nuestra computadora para probar nuestros programas.

¡Primero, manda saludos a **@dimfled#9450** y envíale, amor! ¡Él ha 'visto cosas' construyendo con Solana recientemente y nos dio este paso para hacer que las cosas funcionen en M1!

Vamos a ejecutar nuestro validador Solana manualmente. Explicaré por qué necesitamos esto en breve:

```bash
solana-test-validator --no-bpf-jit
```

Esto puede tomar un poco de tiempo para comenzar, pero una vez que esté funcionando, deberás ver algo como esto:

![Untitled](https://i.imgur.com/FUjRage.jpg)

¡¡Excelente!! Ahora estás ejecutando un validador local. Muy genial :).

### ☕️ Instalación de Node, NPM y Mocha

Es muy probable que ya tengas Node y NPM. Cuando hago node --version obtengo v16.0.0. La versión mínima es v11.0.0. Si no tiene Node y NPM, consíguelo [aquí] (https://nodejs.org/en/download/).

Después de revisar eso, instalaremos esto llamado Mocha. Es un marco de prueba pequeño y agradable para ayudarnos a probar nuestros programas Solana.

```bash
npm install -g mocha
```

### ⚓️ La magia de Anchor

Vamos a usar mucho esta herramienta llamada "Anchor". Si conoces Hardhat del mundo de Ethereum, ¡es algo parecido! Excepto que está hecho para Solana. **Básicamente, hace que sea muy fácil para nosotros ejecutar los programas de Solana localmente e implementarlos en la cadena de Solana real cuando estemos listos.**

Anchor es un proyecto *muy reciente* dirigido por unos pocos desarrolladores principales. Es probable que te encuentres con algunos problemas. Únete a [Anchor Discord](https://discord.gg/8HwmBtt2ss) y no dudes en hacer preguntas o [crear un problema](https://github.com/project-serum/anchor/issues) en el Github a medida que te encuentres con problemas. Los desarrolladores son impresionantes. Tal vez incluso digas que eres de buildspace en #general en su Discord :).

**Por cierto, no te unas a su Discord y hagas preguntas aleatorias esperando que la gente te ayude. Esfuerzate primero por buscar en el Discord para ver si alguien más ha tenido la misma pregunta. Proporciona tanta información y detalle sobre tus preguntas como sea posible. Haz que la gente quiera ayudarte jajaja.**

*En serio: únete a Discord, los desarrolladores son realmente útiles.*

Para instalar Anchor, siga adelante y ejecute:

```bash
cargo install --git https://github.com/project-serum/anchor anchor-cli --locked
```

El comando anterior puede tardar un poco en ejecutarse. Una vez hecho esto, te pedirá que actualices su ruta, recuerda hacerlo.

Ejecutamos:

```bash
anchor --version
```

Si ya funciona, genial, ¡tienes Anchor!

También usaremos el módulo npm de Anchor y Solana Web3 JS; ¡ambos nos ayudarán a conectar nuestra aplicación web a nuestro programa Solana!

```bash
npm install @project-serum/anchor @solana/web3.js
```

### 🏃‍♂️ Crea un proyecto de prueba y ejecútalo

Bien, *casi terminamos* jaja. Lo último que debemos hacer para finalizar la instalación es ejecutar un programa Solana localmente y asegurarnos de que realmente funcione.

Antes de comenzar, fíjate de tener `yarn` instalado en tu máquina:

```bash
brew install yarn
```

Podemos hacer que el proyecto estándar de Solana se llame `myepicproject` con un comando fácil:

```bash
anchor init myepicproject --javascript
cd myepicproject
```

`anchor init` creará un montón de archivos/carpetas para nosotros. Es algo así como `create-react-app` en cierto modo. ¡Continua y abre el directorio del proyecto en VSCode y echa un vistazo!

Antes de ir directamente, ¿recuerdas cuando configuramos nuestro validador local como `solana-test-validator --no-bpf-jit`? Bueno, lo hicimos porque las cosas en este momento todavía son realmente nuevas con M1 Mac y Anchor.

Anchor en realidad ejecuta su propio validador, y en el M1 no lo hará y arrojará un error como - `FetchError: solicitud a http://localhost:8899/ falló` cuando vaya a ejecutar `anchor test`.

La solución en este momento es hacer que Anchor se ejecute con el validador de Solana.

Bien, ¡volvamos a eso! Abramos una nueva ventana de terminal y ejecutemos:

```bash
solana-test-validator --no-bpf-jit
```

### 🔑 Crea un par de llaves local

Para que podamos comunicarnos con nuestros programas Solana, necesitamos generar un par de claves. ¡Realmente todo lo que necesitas saber sobre esto es que nos permite firmar digitalmente para transacciones en Solana! ¿Todavía tienes curiosidad? [Eche un vistazo a esta página](https://solana-labs.github.io/solana-web3.js/classes/Keypair.html) para obtener más información.

```bash
solana-keygen new -o target/deploy/myepicproject-keypair.json
```

(No te preocupes por crear una frase de contraseña por ahora, ¡simplemente presiona "Enter" cuando te lo pida!)
Verás este par de claves en un archivo 'JSON' generado ubicado en 'target/deploy/myepicproject-keypair.json'.

Ahora ejecuta este comando:

```bash
solana address -k target/deploy/myepicproject-keypair.json
```

Esto devolverá el par de claves en la terminal. Vamos a copiar esa dirección y abrir nuestro proyecto en nuestro editor de código e ir a `Anchor.toml` en la raíz de nuestro proyecto y pegar esto en la línea dos reemplazando la dirección que ya está allí.

Ahora, volvamos a la terminal donde instalamos en nuestra carpeta de proyecto y ejecutaremos:

```bash
anchor test --skip-local-validator
```

¡Esto puede tomar un tiempo la primera vez que lo ejecutas! ¡Mientras obtenga las palabras verdes en la parte inferior que dicen "1 passing", estás listo para comenzar! Mantenme informado en Discord si llegas a tener problemas con esto.

![Untitled](https://i.imgur.com/V35KchA.png)


