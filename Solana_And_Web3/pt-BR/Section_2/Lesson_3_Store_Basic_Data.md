No momento, nosso programa não faz literalmente nada haha. Vamos alterá-lo para armazenar alguns dados!

Nosso site permitirá que as pessoas enviem GIFs. Então, armazenar algo como um número `total_gifs` também seria muito útil.

### 🥞 Crie um número inteiro para armazenar a contagem de GIFs

Legal, então só queremos armazenar um inteiro básico com o número de `total_gifs` que as pessoas enviaram. Então, toda vez que alguém adiciona um novo gif, nós apenas fazemos `total_gifs += 1`.

Vamos pensar sobre isso.

Lembre-se anteriormente que eu disse que os programas Solana são **sem estado**. Eles **não** retêm dados permanentemente. Isso é muito diferente do mundo dos contratos inteligentes Ethereum – que guarda estado diretamente no contrato.

Mas, os programas Solana podem interagir com "contas".

Novamente, as contas são basicamente arquivos que os programas podem ler e gravar. A palavra "contas" é confusa e super merda. Por exemplo, quando você cria uma carteira no Solana — você cria uma "conta". Mas, seu programa também pode criar uma "conta" na qual possa gravar dados. Os próprios programas são considerados "contas".

**Tudo é conta lol**. Lembre-se de que uma conta não é apenas como sua carteira real - **é uma maneira geral de os programas passarem dados entre si**. Leia mais sobre eles [aqui](https://docs.solana.com/developing/programming-model/accounts).

Confira o código abaixo, eu adicionei alguns comentários também.

```rust
use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod myepicproject {
  use super::*;
  pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> Result <()> {
    // Obtem a referência da conta
    let base_account = &mut ctx.accounts.base_account;
    // Inicializa o total_gifs.
    base_account.total_gifs = 0;
    Ok(())
  }
}

// Anexa algumas variaveis ao contexto do StartStuffOff.
#[derive(Accounts)]
pub struct StartStuffOff<'info> {
    #[account(init, payer = user, space = 9000)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program <'info, System>,
}

// Conta para a Solana o que queremos guardar nessa conta.
#[account]
pub struct BaseAccount {
    pub total_gifs: u64,
}
```

**Muita coisa acontecendo aqui.** Vamos passar por elas.

### 🤠 Inicializando uma conta

Vamos verificar esta linha na parte inferior:

```rust
#[account]
pub struct BaseAccount {
    pub total_gifs: u64,
}
```

Isso é muito legal. Basicamente, ele diz ao nosso programa que tipo de conta ele pode fazer e o que manter dentro dela. Então, aqui, `BaseAccount` contém algo e é um inteiro chamado `total_gifs`.

Então, aqui nós realmente especificamos como inicializá-lo e o que manter em nosso contexto `StartStuffOff`.

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

Parece complicado rs.

Primeiro temos `[account(init, payer = user, space = 9000)]`. **Tudo o que estamos fazendo aqui é dizer a Solana como queremos inicializar `BaseAccount`.**

Observe que, se após executar o teste abaixo você receber o erro `Transaction simulation failed: Error processing Instruction 0: custom program error: 0x64`, será necessário alterar `space = 9000` para `space = 10000`. Se você olhar para [estes documentos do Anchor](https://project-serum.github.io/anchor/tutorials/tutorial-1.html#defining-a-program) você pode ver que eles definem um programa simples que declara `space = 8 + 8` (por exemplo, 8 kilobytes + 8 kilobytes). Quanto mais lógica adicionarmos ao nosso programa, mais espaço ele ocupará!

1. `init` dirá a Solana para criar uma nova conta pertencente ao nosso programa atual.
2. `payer = user` informa ao nosso programa quem está pagando pela criação da conta. Neste caso, é o `user` chamando a função.
3. Dizemos então `space = 9000` que alocará 9000 bytes de espaço para nossa conta. Você pode alterar este # se quiser, mas 9000 bytes são suficientes para o programa que vamos construir aqui!

Por que estamos pagando por uma conta? Bem - armazenar dados não é grátis! Como Solana funciona é que os usuários pagarão "aluguel" em suas contas. Você pode ler mais sobre isso [aqui](https://docs.solana.com/developing/programming-model/accounts#rent) e como o aluguel é calculado. Bem selvagem, certo? Se você não pagar aluguel, os validadores vão limpar a conta!

[Aqui está](https://docs.solana.com/storage_rent_economics) outro artigo dos docs sobre aluguel que eu também gostei!

> "Com essa abordagem, contas com dois anos de depósitos de aluguel garantidos estão isentas de cobranças de aluguel de rede. Ao manter esse saldo mínimo, a rede mais ampla se beneficia de uma liquidez reduzida e o titular da conta pode ter certeza de que sua `Account::data` serão retidos para acesso/uso contínuo."
> 

Temos então `pub user: Signer<'info>` que são dados passados para o programa que provam ao programa que o usuário que está chamando este programa realmente possui sua conta de carteira.

Finalmente, temos `pub system_program: Program` que é realmente muito legal. É basicamente uma referência ao [SystemProgram](https://docs.solana.com/developing/runtime-facilities/programs#system-program). O SystemProgram é o programa que basicamente roda Solana. É responsável por muitas coisas, mas uma das principais coisas que faz é criar contas no Solana. O SystemProgram é um programa que os criadores de Solana implantaram que outros programas como o nosso falam haha — tem um id de `11111111111111111111111111111111`.

Por último, fazemos isso em nossa função onde apenas pegamos `base_account` do contexto `StartStuffOff` fazendo `Context<StartStuffOff>`.

```rust
pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> Result <()> {
	// Obtem a referência da conta
  let base_account = &mut ctx.accounts.base_account;
  // Inicializa o total_gifs.
  base_account.total_gifs = 0;
  Ok(())
}
```

Boom! Novamente - muitas dessas coisas podem parecer confusas, especialmente se você é novo no Rust, mas **vamos continuar escrevendo e executando o código**. Eu acho que essas coisas fazem mais sentido quanto mais você escreve código → executa → obtém erros → corrige erros → repete.

*Nota: Fazemos `&mut` para obter uma "referência mutável" para `base_account`. Quando fazemos isso, na verdade nos dá o poder de fazer **alterações** em `base_account`. Caso contrário, simplesmente estaríamos trabalhando com uma "cópia local" de `base_account`.*

### 👋 Recuperar dados da conta

Vamos juntar tudo.

Então, podemos realmente recuperar os dados da conta agora também em javascript. Vá em frente e atualize o `myepicproject.js`. Adicionei alguns comentários nas linhas que alterei.

```javascript
const anchor = require('@project-serum/anchor');

// Precisa do programa do sistema, falaremos sobre isso em breve.
const { SystemProgram } = anchor.web3;

const main = async() => {
  console.log("🚀 Iniciando testes...")

  // Crie e defina o provedor. Nós o configuramos antes, mas precisávamos atualizá-lo, para que ele pudesse se comunicar com nosso frontend!
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Myepicproject;
	
  // Crie um par de chaves de conta para nosso programa usar.
  const baseAccount = anchor.web3.Keypair.generate();

  // Chame start_stuff_off, passe os parâmetros necessários!
  let tx = await program.rpc.startStuffOff({
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [baseAccount],
  });

  console.log("📝 Sua assinatura de transação", tx);

  // Obtem dados da conta.
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

`anchor.web3.Keypair.generate()` também pode ser meio confuso — por que estamos fazendo isso? Bem, basicamente é porque precisamos criar algumas credenciais para a `BaseAccount` que estamos criando.

A maior parte do script é o mesmo, mas você verá que passo para `startStuffOff` alguns parâmetros importantes que especificamos no struct `pub struct StartStuffOff`.

*Nota: observe também que em `lib.rs` a função é chamada `start_stuff_off` já que em Rust nós usamos snake case (`snake_case`) ao invés de camel case. Mas, em nosso arquivo javascript, usamos camel case e chamamos `startStuffOff`. Isso é algo bom que o Anchor faz por nós para que possamos seguir as melhores práticas, independentemente da linguagem que estamos usando. Você pode usar o snake case em Rust-land e camel case em JS-land.*

E talvez a parte mais legal de tudo isso seja onde chamamos:

```javascript
await program.account.baseAccount.fetch(baseAccount.publicKey)
console.log('👀 GIF Count', account.totalGifs.toString())
```

Aqui nós realmente recuperamos a conta que criamos e então acessamos `totalGifs`. Quando executo isso via `anchor test`, recebo:

```
🚀 Iniciando testes...
📝 Sua assinatura de transação
2KiCcXmdDyhMhJpnYpWXQy3FxuuqnNSANeaH1CBjvomuLZ8LfzDKHtDDB2LHfsfoVQZSyxoF1R39ao6VfTrD7bG7
👀 GIF Count 0
```

Yay! Está '0'! Isso é muito épico. Agora estamos chamando um programa *e* armazenando dados de uma maneira sem permissão na cadeia Solana. LEGAL.

### 👷‍♀️ Crie uma função para atualizar o contador GIF

Vamos criar uma nova função chamada `add_gif` que nos permite incrementar o contador GIF. Confira abaixo algumas das minhas mudanças.

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
  
	// Outra função uhul!
  pub fn add_gif(ctx: Context<AddGif>) -> Result <()> {
    // Obtem a referencia para a conta e incrementa total_gifs.
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

// Especifica que dados queremos no Contexto AddGif
// Obtendo um controle sobre o fluxo das coisas :)?
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

Bem simples! Perto da parte inferior eu adicionei:

```rust
#[derive(Accounts)]
pub struct AddGif<'info> {
  #[account(mut)]
  pub base_account: Account<'info, BaseAccount>,
}
```

Eu crio um `Context` chamado `AddGif` que tem acesso a uma referência mutável para `base_account`. É por isso que eu faço `#[account(mut)]`. Basicamente significa que eu posso realmente alterar o valor `total_gifs` armazenado em `BaseAccount`.

Caso contrário, posso alterar os dados nele dentro da minha função, mas na verdade *não mudaria* na minha conta. Agora, com uma referência "mutável" se eu mexer com `base_account` na minha função, isso mudará os dados da própria conta.

Por último, eu crio uma pequena função `add_gif`!

```rust
pub fn add_gif(ctx: Context<AddGif>) -> Result <()> {
    // Obtem a referencia para a conta e incrementa total_gifs.
    let base_account = &mut ctx.accounts.base_account;
    base_account.total_gifs += 1;
    Ok(())
}
```

Tudo o que faço é pegar a `base_account` que foi passada para a função via `Context<AddGif>`. Então, incremento o contador e pronto!!

Espero que você possa ver como o `Context` que configuramos na parte inferior do programa realmente se torna útil dentro da função. É basicamente uma boa maneira de dizer: "Ei, quando alguém chamar `add_gif` certifique-se de anexar o contexto `AddGif` a ele também para que o usuário possa acessar a `base_account` e o que mais estiver anexado a `AddGif`.

### 🌈 Atualize o script de teste... novamente!

Toda vez que atualizamos nosso programa, precisamos alterar nosso script para testar as mudanças! Vamos atualizar `myepicproject.js` para chamar `add_gif`.

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
	
  // Chama add_gif!
  await program.rpc.addGif({
    accounts: {
      baseAccount: baseAccount.publicKey,
    },
  });
  
  // Obtem a conta novamente e veja o que mudou.
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

Quando executo isso via `anchor test`, recebo:

```bash
🚀 Iniciando testes...
📝 Sua assinatura de transação 2Z9LZc5sFr8GHvwjZkrkqGJZ1hFNzZq2rTPV7jSEUjFoMZ16QQwPS2B7qqyNrmfFEpodHTBhvt5oSBi958mbwiR8
👀 GIF Count 0
👀 GIF Count 1
```

LEGAL. Agora estamos armazenando *e* alterando dados em nosso programa Solana. Épico.

*Nota: Você notará que quando você executar o `anchor test` novamente, ele iniciará o contador a partir de 0 novamente. Por quê? Bem - basicamente é porque sempre que executamos `anchor test` geramos um par de chaves para nossa conta via `anchor.web3.Keypair.generate()`. Isso realmente criará uma nova conta toda vez. Em nosso aplicativo da Web, nos certificaremos de resolver isso corretamente. Mas para fins de teste, é útil porque podemos começar com uma nova conta toda vez que testamos.*

### 🚨 Relatório de progresso

*Faça isso senão o Dani vai ficar triste :(*

Poste uma captura de tela do seu terminal mostrando sua contagem de GIFs incrementando em `#progress`!

Trabalho épico até agora :).
