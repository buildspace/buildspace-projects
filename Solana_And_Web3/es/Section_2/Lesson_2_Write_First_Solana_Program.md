Continúenos y vamos a abrir `myepicproject` en VSCode.

Si estás en Windows, recuerda que todo esto debe hacerse con WSL. En caso de que no recuerdes dónde instalaste todo en la instancia de Ubuntu, sigamos estos pasos para volver al proyecto:

Presiona `'windows' + R` para abrir el cuadro `RUN`. Aquí es donde puedes escribir el comando `\\wsl$\Ubuntu` y aparecerá una ventana del explorador.
Dentro de estas carpetas, ve a la carpeta `home` y luego a la carpeta `username`. ¡Aquí es donde encontrarás `myepicproject`!

Verás todas las cosas mágicas que Anchor ha generado para nosotros aquí.

**Elimine** el contenido de `programs/myepicproject/src/lib.rs` y `tests/myepicproject.js`. En realidad, no elimines los archivos, solo lo que hay en ellos.
*Nota: **No** instalé la extensión Rust para VSCode. Ya tenía el resaltado de sintaxis de Rust listo para usar.*

### 👶 Un programa básico

¡Escribamos nuestro primer programa Solana! Este código de Rust vivirá en el archivo `lib.rs`.

Esto es lo que hay que hacer:

```rust
use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod myepicproject {
  use super::*;
  pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> Result <()> {
    Ok(())
  }
}

#[derive(Accounts)]
pub struct StartStuffOff {}
```

Muchas cosas están sucediendo aquí, así que revisemos línea por línea. Nuevamente, si no conoces Rust, no te preocupes. Creo que puedes aprender esto bastante rápido. No te convertirás en un Rust Master así, pero puedes preocuparte por eso más tarde :).

```rust
use anchor_lang::prelude::*;
```

Una simple declaración `use` en la parte superior. Algo así como una declaración de importación. Queremos importar muchas de las herramientas que Anchor nos proporciona para facilitar la escritura de programas de Solana.

```rust
declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");
```

Cubriremos esto un poco más tarde. Básicamente, esta es la "identificación del programa" y tiene información para Solana sobre cómo ejecutar nuestro programa. Anchor ha generado esto para nosotros. Lo vamos a cambiar más tarde.

```rust
#[program]
```

Así es como le decimos a nuestro programa: "Oye, todo este módulo es nuestro programa para el que queremos crear controladores para que otras personas puedan llamar". Verás cómo esto entra en juego. Pero, esencialmente, esto nos permite llamar a nuestro programa Solana desde nuestra interfaz a través de una solicitud de búsqueda. Veremos esta sintaxis `#[blah]` en algunos lugares.

Se llaman [macros](http://web.mit.edu/rust-lang_v1.25/arch/amd64_ubuntu1404/share/doc/rust/html/book/first-edition/macros.html), y sirven para adjuntar código a nuestro módulo. Es algo así como "heredar" una clase.

```rust
pub mod myepicproject {
  use super::*;
  pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> Result <()> {
    Ok(())
  }
}
```

`pub mod` nos dice que este es un "[módulo](https://stevedonovan.github.io/rust-gentle-intro/4-modules.html)" de Rust, que es una manera fácil de definir una colección de funciones y variables, algo así como una clase si sabes qué es eso. Y llamamos a este módulo `myepicproject`. Aquí escribimos una función `start_stuff_off` que toma algo llamado `Context` y genera un `Result <()>`. Puedes ver que esta función no hace nada excepto llamar a `Ok(())`, que es sólo un tipo de `Resultado` sobre el que puedes leer [aquí](https://doc.rust-lang.org/std/result /).

Entonces, realmente, esta cosa `start_stuff_off` es solo una función que alguien más puede llamar ahora. Actualmente no hace nada, pero cambiaremos eso :).

```rust
#[derive(Accounts)]
pub struct StartStuffOff {}
```

Por último, tenemos esta cosa en la parte inferior. Será más obvio por qué esto es importante más adelante. Pero básicamente es otra `macro`. Aquí, básicamente podremos especificar diferentes restricciones de cuenta. Nuevamente, tendrá más sentido en un momento, jeje.

Hagamos que las cosas funcionen y veamos qué sucede.

### 💎 Escriba un script para verlo funcionando localmente

Básicamente, debemos decirle a Anchor cómo queremos que se ejecute nuestro programa y qué funciones queremos llamar. Dirígete a `tests/myepicproject.js`. Esto en realidad está escrito en javascript :).

Continuemos y codifica esto:

```javascript
const anchor = require('@project-serum/anchor');

const main = async() => {
  console.log("🚀 Starting test...")

  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.Myepicproject;
  const tx = await program.rpc.startStuffOff();

  console.log("📝 Your transaction signature", tx);
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
```

Podemos ir línea por línea aquí. En primer lugar, `runMain` es solo un poco de magia de javascript para que nuestra función `main` se ejecute de forma asíncrona. No es nada especial realmente.

La verdadera magia ocurre aquí:

```javascript
anchor.setProvider(anchor.AnchorProvider.env());
const program = anchor.workspace.Myepicproject;
const tx = await program.rpc.startStuffOff();
```

Primero, le decimos a Anchor que configure nuestro proveedor. Entonces, obtiene estos datos de `solana config get`. En este caso, ¡se está apoderando de nuestro entorno local! De esta manera, Anchor sabe ejecutar nuestro código localmente (¡luego podremos probar nuestro código en devnet!).

Luego, tomamos `anchor.workspace.Myepicproject` y esta es una cosa genial que nos dio Anchor que compilará automáticamente nuestro código en `lib.rs` y lo va a implementar localmente en un validador local. Mucha magia en una sola línea y esta es una gran razón por la que Anchor es increíble.

* Nota: la estructura de nombres + carpetas es muy importante aquí. Anchor sabe mirar `programs/myepicproject/src/lib.rs` porque usamos `anchor.workspace.Myepicproject`.*
* 
Finalmente, en realidad llamamos a nuestra función que creamos al hacer `program.rpc.startStuffOff()` y la `await`, que esperará a que nuestro validador local "mine" la instrucción.

Antes de ejecutarlo, necesitamos hacer un cambio rápido.

En `Anchor.toml` queremos cambiar un poco las etiquetas `[scripts]`:

```
[scripts]
test = "node tests/myepicproject.js"
```

**¡Mantén todo lo demás en `Anchor.toml` igual!**

Finalmente, vamos a ejecutarlo usando:

```bash
anchor test
```

Esto es lo que obtengo cerca de la parte inferior:

```bash
🚀 Starting test...
📝 Your transaction signature 4EPghDAKXjtseY1dB4DT3xwpt18L1QrL8qbAJ3a3mRaTTZURkgBuUhN3sNhppDbwJNRL75fE53ucTBytoPWNEMAx
```

*Nota: si estás usando VSCode, ¡no te olvides de **guardar** todos los archivos que estás cambiando antes de ejecutar `anchor test`! En mi caso tuve muchos problemas porque pensé que había guardado el archivo, pero en realidad no lo hice :(.*

*Nota: si ve este error ` Attempt to load a program that does not exist`, puedes hacer `solana address -k target/deploy/myepicproject-keypair.json` y reemplazar con esta dirección cada ocurrencia en `lib.rs `, `Anchor.toml` y `myepicproject.js`.*

**BOOOOM. LO HICISTE.**

Siempre que vea una "firma de transacción", ¡está bien! Esto significa que llamaste con éxito a la función `startStuffOff` y esta firma es básicamente tu recibo.
Bastante épico. Ha escrito un programa de Solana, lo **implementaste en tu nodo local de Solana** y ahora estás interactuando con el programa implementado en tu red local de Solana.

** QUÉ BONITOOOO.** Sé que puede parecer que no es mucho, pero ahora tienes un flujo básico para hacer cosas.

1. Escribir código en `lib.rs`
2. Probar funciones específicas utilizando `tests/myepicproject.js`.
3. 
¡Acostúmbrate a usar este ciclo! Es la forma más rápida de iterar en los programas de Solana :).

### 🚨 Reporte de avances

*Por favor haz esto sino Farza se pondrá triste :(*

¡Publica una captura de pantalla de tu programa básico funcionando en `#progress`! Siempre es motivador para todos ver que vamos averiguando cosas.
