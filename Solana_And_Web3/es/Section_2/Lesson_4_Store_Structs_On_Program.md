Increíble. Estamos almacenando datos en nuestro programa Solana. No mucha gente sabe cómo hacer estas cosas, así que definitivamente deberías sentirte como un gran hechicero. Este ecosistema es realmente reciente y estás en el centro de la magia en este momento.

Entonces, el contador es genial. ¡Pero queremos almacenar datos más complejos!

Ahora, configurémoslo donde podamos almacenar una serie de estructuras con más datos que nos interesen como: *un enlace al gif y la dirección pública de la persona que lo envió.* Luego, podremos recuperar estos datos en nuestro cliente!

### 💎 Configurar Vec<ItemStruct>
  
Echa un vistazo a algunas de las actualizaciones a continuación:
  
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

  // The function now accepts a gif_link param from the user. We also reference the user from the Context
  pub fn add_gif(ctx: Context<AddGif>, gif_link: String) -> Result <()> {
    let base_account = &mut ctx.accounts.base_account;
    let user = &mut ctx.accounts.user;

	// Build the struct.
    let item = ItemStruct {
      gif_link: gif_link.to_string(),
      user_address: *user.to_account_info().key,
    };
		
	// Add it to the gif_list vector.
    base_account.gif_list.push(item);
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

// Add the signer who calls the AddGif method to the struct so that we can save it
#[derive(Accounts)]
pub struct AddGif<'info> {
  #[account(mut)]
  pub base_account: Account<'info, BaseAccount>,
  #[account(mut)]
  pub user: Signer<'info>,
}

// Create a custom struct for us to work with.
#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ItemStruct {
    pub gif_link: String,
    pub user_address: Pubkey,
}

#[account]
pub struct BaseAccount {
    pub total_gifs: u64,
	// Attach a Vector of type ItemStruct to the account.
    pub gif_list: Vec<ItemStruct>,
}
```
  
Comenzando desde la parte inferior nuevamente, podrás ver que `BaseAccount` ahora tiene un nuevo parámetro llamado `gif_list`. Es del tipo `Vec`, que es básicamente la abreviatura de `Vector`. Puede leer sobre ellos [aquí] (https://doc.rust-lang.org/std/vec/struct.Vec.html). ¡Es básicamente una matriz! En este caso, contiene una matriz de `ItemStruct`s.
  
Luego tengo este elegante código para declarar mi `ItemStruct`.
  
```rust
#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ItemStruct {
    pub gif_link: String,
    pub user_address: Pubkey,
}
```
  
Solo contiene una `String` con un `gif_link` y una `PubKey` con la `user_address` del usuario. Muy claro. También tenemos esto muy loco:
  
```rust
#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
```
  
Es un poco complejo, pero básicamente le dice a Anchor cómo serializar/de serializar la estructura. Recordemos, los datos se almacenan en una "cuenta", ¿verdad? Esa cuenta es básicamente un archivo y serializamos nuestros datos en formato binario antes de almacenarlos. Luego, cuando queramos recuperarlo, lo de serializaremos.
  
Esta línea se ocupa de eso para asegurarse de que nuestros datos estén correctamente serializados/de serializados, ya que estamos creando una estructura personalizada aquí.
  
¿Cómo descubrí todo esto? Bueno, de hecho, revisé los [documentos](https://docs.rs/anchor-lang/0.4.0/anchor_lang/trait.AnchorSerialize.html) y leí el código fuente. ¡También hago muchas preguntas en el [Discord de Anchor](https://discord.gg/8HwmBtt2ss)! Recuerda, este material es nuevo y depende de uno mismo descubrir las respuestas cuando los documentos no las proporcionan.
  
### 🤯 ¡Actualiza el script de prueba y boom!
  
Como siempre, ¡necesitamos volver a nuestro script de prueba! Aquí están las actualizaciones:
  
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

  // You'll need to now pass a GIF link to the function! You'll also need to pass in the user submitting the GIF!
  await program.rpc.addGif("insert_a_giphy_link_here", {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  });
  
  // Call the account.
  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF Count', account.totalGifs.toString())

  // Access gif_list on the account!
  console.log('👀 GIF List', account.gifList)
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
  
*Nota: no te olvides de que `addGif` pasa un enlace GIF donde dice `insert_a_giphy_link_here`, de lo contrario obtendrá un error muy confuso como: `baseAccount not added`.*
  
¡Nada nuevo todavía! Uno de los momentos mágicos para mí fue cuando vi el resultado de `console.log('👀 GIF List', account.gifList)`. Es genial poder simplemente adjuntar datos a una cuenta y acceder a los datos a través de la cuenta.
  
Es una forma realmente extraña y nueva de pensar sobre el almacenamiento de datos, ¡pero es genial!
  
Así es como se veía mi resultado al hacer `anchor test`.
  
```bash
🚀 Starting test...
📝 Your transaction signature 3CuBdZx8ocXmzXRctvKkhttWHpP9knvAZnXQ9XyNcgr1xeqs6E3Hj9RVkEWSc2iEW15xXprKzip1hQw8o5kWVgsa
👀 GIF Count 0
👀 GIF Count 1
👀 GIF List [
  {
    gifLink: 'insert_a_giphy_link_here',
    userAddress: PublicKey {
      _bn: <BN: 69f90845012df1b26922a9e895b073309e647c36e9052f7c9ec29793b8be9e99>
    }
  }
]
```
  
Hemos llegado bastante lejos. Ahora no solo estamos escribiendo y ejecutando programas de Solana, sino que también hemos descubierto cómo almacenar algunos datos complejos. Hurra :).

### 🚨 Reporte de avances.
  
*Por favor haz esto sino Farza se pondrá triste :(*
  
¡Publica una captura de pantalla de la terminal donde muestre las estructuras de tus elementos en `#progress`!
  
Bastante difícil hacer que todo esto funcione. Lo estás haciendo genial :).
