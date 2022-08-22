En este momento, nuestro programa literalmente no hace nada jaja. ¡Vamos a cambiarlo para almacenar algunos datos!

Nuestro sitio web permitirá que las personas envíen GIF. Por lo tanto, almacenar algo como un número `total_gifs` también sería muy útil.

### 🥞 Crea un número entero para almacenar el recuento de GIF

Genial, solo queremos almacenar un número entero básico con el número de `total_gifs` que la gente ha enviado. Entonces, cada vez que alguien agregue un nuevo gif, simplemente haríamos `total_gifs += 1`.

Pensemos en esto.

Recuerda que antes te dije que los programas de Solana son **sin estado**. **No** almacenan datos de forma permanente. Esto es muy diferente del mundo de los contratos inteligentes de Ethereum.

Pero, los programas de Solana pueden interactuar con "cuentas".

Nuevamente, las cuentas son básicamente archivos que los programas pueden leer y escribir. La palabra "cuentas" es confusa y no dice nada. Por ejemplo, cuando crea una billetera en Solana, crea una "cuenta". Pero, nuestro programa también puede crear una "cuenta" en la que puede escribir datos. Los propios programas se consideran "cuentas".

**Todo es una cuenta jajaja**. Solo recuerde que una cuenta no es como tu cartera real: **es una forma general para que los programas pasen datos entre sí**. Lee más sobre ellos [aquí] (https://docs.solana.com/developing/programming-model/accounts).

Usemos y revisemos el código a continuación, también agregué algunos comentarios.

```rust
use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod myepicproject {
  use super::*;
  pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> Result <()> {
    // Get a reference to the account.
    let base_account = &mut ctx.accounts.base_account;
    // Initialize total_gifs.
    base_account.total_gifs = 0;
    Ok(())
  }
}

// Attach certain variables to the StartStuffOff context.
#[derive(Accounts)]
pub struct StartStuffOff<'info> {
    #[account(init, payer = user, space = 9000)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program <'info, System>,
}

// Tell Solana what we want to store on this account.
#[account]
pub struct BaseAccount {
    pub total_gifs: u64,
}
```

**Están sucediendo muchas cosas aquí.** Vamos a repasarlo.

### 🤠 Inicializar una cuenta

Veamos esta línea de la parte final del código:

```rust
#[account]
pub struct BaseAccount {
    pub total_gifs: u64,
}
```

Esto es genial. Le dice a nuestro programa qué tipo de cuenta puede crear y qué almacenar dentro de ella. Así que aquí, `BaseAccount` contiene una cosa y es un número entero llamado `total_gifs`.

Luego aquí especificamos cómo inicializarlo y qué mantener en nuestro contexto `StartStuffOff`.

```rust
#[derive(Accounts)]
pub struct StartStuffOff<'info> {
    #[account(init, payer = user, space = 9000)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program <'info, System>,
}
```

Esto se ve complicado jajaja.

Primero tenemos `[account(init, payer = user, space = 9000)]`. **Todo lo que estamos haciendo aquí es decirle a Solana cómo queremos inicializar `BaseAccount`.**

Ten en cuenta que si después de ejecutar su prueba a continuación obtiene el error `Transaction simulation failed: Error processing Instruction 0: custom program error: 0x64`, deberá cambiar `space = 9000` a `space = 10000`. Si observas [estos documentos de anchor] (https://project-serum.github.io/anchor/tutorials/tutorial-1.html#defining-a-program) podrás ver que definen un programa simple que declara espacio = 8 + 8 (por ejemplo, 8 kilobytes + 8 kilobytes). ¡Cuanta más lógica agreguemos a nuestro programa, más espacio ocupará!

1. `init` le dirá a Solana que cree una nueva cuenta propiedad de nuestro programa actual.
2. `payer = user` le dice a nuestro programa quién está pagando por la creación de la cuenta. En este caso, es el `user` quien llama a la función.
3. Entonces decimos `space = 9000` que asignará 9000 bytes de espacio para nuestra cuenta. Puede cambiar este # si lo desea, ¡pero 9000 bytes son suficientes para el programa que vamos a construir!

¿Por qué estamos pagando por una cuenta? Bueno, ¡almacenar datos no es gratis! Cómo funciona Solana es que los usuarios pagarán "alquiler" en sus cuentas. Puede leer más [aquí] (https://docs.solana.com/developing/programming-model/accounts#rent) y cómo se calcula el alquiler. Bastante interesante, ¿verdad? ¡Si no pagas el alquiler, los validadores borrarán la cuenta!

[Aquí hay] (https://docs.solana.com/storage_rent_economics) ¡otro artículo de los documentos sobre alquiler que también me gustó!

> "Con este enfoque, las cuentas con dos años de depósitos de alquiler garantizados están exentas de los cargos de alquiler de la red. Al mantener este saldo mínimo, la red más amplia se beneficia de una liquidez reducida y el titular de la cuenta puede estar seguro de que su `Account::data` will be retained for continual access/usage."
>

Luego tenemos `pub user: Signer<'info>`, que son datos que pasan al programa que demuestran al programa que el usuario que llama a este programa realmente posee su cuenta de billetera.

Finalmente, tenemos `pub system_program: Program` que en realidad es bastante genial. Es básicamente una referencia al [SystemProgram](https://docs.solana.com/developing/runtime-facilities/programs#system-program). El SystemProgram es el programa que básicamente ejecuta Solana. Es responsable de muchas cosas, pero una de las principales cosas que hace es crear cuentas en Solana. SystemProgram es un programa que los creadores de Solana implementaron con el que otros programas como el nuestro hablan jaja — tiene una identificación de `111111111111111111111111111111111`.

Por último, hacemos esto en nuestra función donde simplemente tomamos `base_account` del contexto `StartStuffOff` haciendo `Context<StartStuffOff>`.

```rust
pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> Result <()> {
	// Get a reference to the account.
  let base_account = &mut ctx.accounts.base_account;
	// Initialize total_gifs.
  base_account.total_gifs = 0;
  Ok(())
}
```

¡Boom! Una vez más, muchas de estas cosas pueden parecer confusas, especialmente si eres nuevo en Rust, pero **sigamos escribiendo y ejecutando código**. Creo que esto tiene más sentido cuanto más se escribe código → ejecutar → obtener errores → corregir los errores → repetir.

*Nota: hacemos `&mut` para obtener una "referencia mutable" a `base_account`. Cuando hacemos esto, en realidad nos da el poder de hacer **cambios** a `base_account`. De lo contrario, simplemente estaríamos trabajando con una "copia local" de `base_account`.*

### 👋 Recuperar datos de la cuenta

Vamos a poner todo junto.
Entonces, en realidad podemos recuperar datos de cuenta ahora también en javascript. Continuemos y actualiza `myepicproject.js`. Agregué algunos comentarios en las líneas que cambié.

```javascript
const anchor = require('@project-serum/anchor');

// Need the system program, will talk about this soon.
const { SystemProgram } = anchor.web3;

const main = async() => {
  console.log("🚀 Starting test...")

  // Create and set the provider. We set it before but we needed to update it, so that it can communicate with our frontend!
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Myepicproject;
	
  // Create an account keypair for our program to use.
  const baseAccount = anchor.web3.Keypair.generate();

  // Call start_stuff_off, pass it the params it needs!
  let tx = await program.rpc.startStuffOff({
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [baseAccount],
  });

  console.log("📝 Your transaction signature", tx);

  // Fetch data from the account.
  let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF Count', account.totalGifs.toString())
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

`anchor.web3.Keypair.generate()` también puede ser un poco confuso, ¿por qué estamos haciendo esto? Bueno, es porque necesitamos crear algunas credenciales para la `BaseAccount` que estamos creando.

La mayor parte del script es el mismo, pero verá que paso `startStuffOff` algunos parámetros importantes que especificamos en la estructura `pub struct StartStuffOff`.

*Nota: observa también que en `lib.rs` la función se llama `start_stuff_off` ya que en Rust usamos el caso serpiente (`snake_case`) en lugar del camel case. Pero, en nuestro archivo javascript usamos camel case y lo llamamos `startStuffOff`. Esto es algo bueno que Anchor hace por nosotros para que podamos seguir las mejores prácticas independientemente del idioma que estemos usando. Puede usar el snake-case en Rust-land y el camel case en JS-land.*

Y quizás la parte más genial de todo esto es donde llamamos:

```javascript
await program.account.baseAccount.fetch(baseAccount.publicKey)
console.log('👀 GIF Count', account.totalGifs.toString())
```

Aquí recuperamos la cuenta que creamos y luego accedemos a `totalGifs`. Cuando ejecuto esto a través de `anchor test`, yo obtengo:

```
🚀 Starting test...
📝 Your transaction signature 2KiCcXmdDyhMhJpnYpWXQy3FxuuqnNSANeaH1CBjvomuLZ8LfzDKHtDDB2LHfsfoVQZSyxoF1R39ao6VfTrD7bG7
👀 GIF Count 0
```

¡Hurra! ¡Es '0'! Esto es bastante increíble. Ahora en realidad estamos llamando a un programa *y* almacenando datos sin permiso en la cadena Solana. MUY BONITO.

### 👷‍♀️ Crea una función para actualizar el contador de GIF

Vamos a crear una nueva función llamada `add_gif` que nos permita incrementar el contador de GIF. Echa un vistazo a algunos de mis cambios a continuación.

```rust
use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod myepicproject {
  use super::*;
  pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> Result <()> {
    let base_account = &mut ctx.accounts.base_account;
    base_account.total_gifs = 0;
    Ok(())
  }
  
	// Another function woo!
  pub fn add_gif(ctx: Context<AddGif>) -> Result <()> {
    // Get a reference to the account and increment total_gifs.
    let base_account = &mut ctx.accounts.base_account;
    base_account.total_gifs += 1;
    Ok(())
  }
}

#[derive(Accounts)]
pub struct StartStuffOff<'info> {
  #[account(init, payer = user, space = 9000)]
  pub base_account: Account<'info, BaseAccount>,
  #[account(mut)]
  pub user: Signer<'info>,
  pub system_program: Program <'info, System>,
}

// Specify what data you want in the AddGif Context.
// Getting a handle on the flow of things :)?
#[derive(Accounts)]
pub struct AddGif<'info> {
  #[account(mut)]
  pub base_account: Account<'info, BaseAccount>,
}

#[account]
pub struct BaseAccount {
    pub total_gifs: u64,
}
```

Bastante simple, en la parte inferior añadí:

```rust
#[derive(Accounts)]
pub struct AddGif<'info> {
  #[account(mut)]
  pub base_account: Account<'info, BaseAccount>,
}
```

Cree un `Context` llamado `AddGif` que tiene acceso a una referencia mutable a `base_account`. Es por eso por lo que hago `#[cuenta(mut)]`. Significa que puedo cambiar el valor `total_gifs` almacenado en `BaseAccount`.

Puedo cambiar los datos dentro de mi función, pero *en realidad no cambiaría* en mi cuenta. Ahora, con una referencia "mutable" si me meto con `base_account` en mi función, cambiará los datos en la cuenta misma.

¡Por último, creo una pequeña función `add_gif`!

```rust
pub fn add_gif(ctx: Context<AddGif>) -> Result <()> {
    // Get a reference to the account and increment total_gifs.
    let base_account = &mut ctx.accounts.base_account;
    base_account.total_gifs += 1;
    Ok(())
}
```

Todo lo que estamos haciendo es tomar la `base_account` que se pasó a la función a través de `Context<AddGif>`. ¡¡Luego, incremento el contador y listo!!
Espero que pueda ver un poco cómo el `Context` que configuramos cerca de la parte inferior del programa realmente se vuelve útil dentro de la función. Es básicamente una buena manera de decir: "Oye, cuando alguien llame a `add_gif`, asegúrate de adjuntar el contexto `AddGif` también para que el usuario pueda acceder a `base_account` y cualquier otra cosa que esté adjunta a `AddGif`.

### 🌈 Actualicemos el script de prueba... ¡otra vez!

¡Cada vez que actualizamos nuestro programa, necesitamos cambiar nuestro script para probar los cambios! Actualicemos `myepicproject.js` para llamar a `add_gif`.

```javascript
const anchor = require('@project-serum/anchor');
const { SystemProgram } = anchor.web3;

const main = async() => {
  console.log("🚀 Starting test...")

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Myepicproject;
  const baseAccount = anchor.web3.Keypair.generate();
  let tx = await program.rpc.startStuffOff({
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [baseAccount],
  });
  console.log("📝 Your transaction signature", tx);

  let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF Count', account.totalGifs.toString())
	
  // Call add_gif!
  await program.rpc.addGif({
    accounts: {
      baseAccount: baseAccount.publicKey,
    },
  });
  
  // Get the account again to see what changed.
  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF Count', account.totalGifs.toString())
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

Cuando ejecuto esto vía `anchor test` y obtengo:

```bash
🚀 Starting test...
📝 Your transaction signature 2Z9LZc5sFr8GHvwjZkrkqGJZ1hFNzZq2rTPV7jSEUjFoMZ16QQwPS2B7qqyNrmfFEpodHTBhvt5oSBi958mbwiR8
👀 GIF Count 0
👀 GIF Count 1
```

MUY BONITO. Ahora estamos almacenando *y* cambiando datos en nuestro programa Solana. Genial.

*Nota: Te darás cuenta de que cuando ejecutes `anchor test` nuevamente, el contador volverá a comenzar desde 0. ¿Por qué? Bueno, es porque cada vez que ejecutamos `anchor test` generamos un par de claves para nuestra cuenta a través de `anchor.web3.Keypair.generate()`. Esto realmente creará una nueva cuenta cada vez. En nuestra aplicación web, nos aseguraremos de abordar esto correctamente. Pero para fines de prueba es útil porque podemos comenzar con una cuenta nueva cada vez que hacemos una prueba.*

### 🚨 Reporte de avances

*Por favor haz esto sino Farza se pondrá triste :(*

¡Publica una captura de pantalla de tu terminal que muestra el aumento del recuento de GIF en `#progress`!

Gran Trabajo hasta ahora :).
