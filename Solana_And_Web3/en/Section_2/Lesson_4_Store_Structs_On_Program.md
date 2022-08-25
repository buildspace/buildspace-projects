Épico. Estamos armazenando dados em nosso programa Solana. Poucas pessoas sabem como fazer essas coisas, então você definitivamente deve se sentir como um mago. Este ecossistema é muito novo e você está no centro da magia agora.

Então, um contador é legal. Mas, queremos armazenar dados mais complexos!

Vamos agora configurá-lo onde podemos armazenar um array de structs com mais dados que nos interessam, como: *um link para o gif e o endereço público da pessoa que o enviou.* Então, poderemos recuperar esses dados em nosso cliente!

### 💎 Configure o Vec<ItemStruct>

Confira abaixo algumas das atualizações:

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

  // A função agora aceita um parâmetro gif_link do usuário. Também referenciamos o usuário do Contexto
  pub fn add_gif(ctx: Context<AddGif>, gif_link: String) -> Result <()> {
    let base_account = &mut ctx.accounts.base_account;
    let user = &mut ctx.accounts.user;

	// Constroi o struct.
    let item = ItemStruct {
      gif_link: gif_link.to_string(),
      user_address: *user.to_account_info().key,
    };
		
	// Adiciona ele ao vetor gif_list.
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

// Adicione o signatário que chama o método AddGif ao struct para que possamos salvá-lo
#[derive(Accounts)]
pub struct AddGif<'info> {
  #[account(mut)]
  pub base_account: Account<'info, BaseAccount>,
  #[account(mut)]
  pub user: Signer<'info>,
}

// Crie uma estrutura personalizada para trabalharmos.
#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ItemStruct {
    pub gif_link: String,
    pub user_address: Pubkey,
}

#[account]
pub struct BaseAccount {
    pub total_gifs: u64,
	// Anexe um vetor do tipo ItemStruct à conta.
    pub gif_list: Vec<ItemStruct>,
}
```

Começando de baixo novamente, você verá que `BaseAccount` agora tem um novo parâmetro chamado `gif_list`. É do tipo `Vec` que é basicamente a abreviação de `Vector`. Você pode ler sobre eles [aqui](https://doc.rust-lang.org/std/vec/struct.Vec.html). É basicamente uma matriz! Neste caso, ele contém um array de `ItemStruct`s.

Então eu tenho esse pedaço de código extravagante para declarar meu `ItemStruct`.

```rust
#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ItemStruct {
    pub gif_link: String,
    pub user_address: Pubkey,
}
```

Ele apenas contém uma `String` com um `gif_link` e uma `PubKey` com o `user_address` do usuário. Bem direto. Também temos essa loucura:

```rust
#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
```

É um pouco complexo, mas basicamente isso diz ao Anchor como serializar/desserializar a estrutura. Lembre-se, os dados estão sendo armazenados em uma "conta" certo? Essa conta é basicamente um arquivo e nós serializamos nossos dados em formato binário antes de armazená-los. Então, quando quisermos recuperá-lo, iremos realmente desserializá-lo.

Essa linha cuida disso para garantir que nossos dados sejam serializados/desserializados corretamente, pois estamos criando uma estrutura personalizada aqui.

Como eu descobri essas coisas? Bem - na verdade, eu mesmo vasculho os [docs](https://docs.rs/anchor-lang/0.4.0/anchor_lang/trait.AnchorSerialize.html) e apenas leio o código-fonte! Também faço perguntas no [Anchor Discord](https://discord.gg/8HwmBtt2ss)! Lembre-se, essas coisas são novas e cabe a você descobrir as respostas quando os documentos não as fornecem.

### 🤯 Atualize o script de teste e bum!

Como sempre, precisamos retornar ao nosso script de teste! Aqui estão as atualizações:

```javascript
const anchor = require('@project-serum/anchor');
const { SystemProgram } = anchor.web3;

const main = async() => {
  console.log("🚀 Iniciando testes...")

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
  console.log("📝 Sua assinatura de transação", tx);

  let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF Count', account.totalGifs.toString())

  // Você precisará agora passar um link do GIF para a função! Você também precisará passar o usuário que está enviando o GIF!
  await program.rpc.addGif("insert_a_giphy_link_here", {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  });
  
  // Chama a conta
  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF Count', account.totalGifs.toString())

  // Acessa o gif_list na conta
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

*Nota: não se esqueça de passar para `addGif` um link do GIF onde diz `insert_a_giphy_link_here` senão você receberá um erro confuso como: `baseAccount não fornecido`.*

Nada de novo aqui realmente! Um dos momentos mágicos para mim foi quando vi a saída de `console.log('👀 GIF List', account.gifList)`. É tão legal poder apenas anexar dados a uma conta e acessar dados por meio da conta.

É uma maneira muito estranha e nova de pensar em armazenar dados, mas é bem legal!!!

Aqui está a aparência da minha saída ao fazer o `anchor test`.

```bash
🚀 Iniciando testes...
📝 Sua assinatura de transação 3CuBdZx8ocXmzXRctvKkhttWHpP9knvAZnXQ9XyNcgr1xeqs6E3Hj9RVkEWSc2iEW15xXprKzip1hQw8o5kWVgsa
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

Chegamos bem longe. Agora não estamos apenas escrevendo e executando programas Solana, mas descobrimos como armazenar alguns dados complexos agora também! Yay :).

### 🚨 Relatório de progresso

*Faça isso senão Dani vai ficar triste :(*

Poste uma captura de tela do seu terminal mostrando suas estruturas de itens em `#progress`!

Muito difícil fazer tudo isso funcionar. Você está indo bem :).
