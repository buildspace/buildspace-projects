Vá em frente e abra o `myepicproject` no VSCode.

Se você estiver no Windows, lembre-se de que tudo isso precisa ser feito com o WSL. Caso você não se lembre onde instalou tudo em sua instância do Ubuntu, siga estas etapas para voltar ao seu projeto:

Pressione `'windows' + R` para abrir a caixa `Executar`. É aqui que você pode digitar o comando `\\wsl$\Ubuntu` e uma janela do explorer deve aparecer.
Dentro dessas pastas, vá para a pasta `home` e depois para a pasta `username`. É aqui que você encontrará o `myepicproject`!

Você verá todas as coisas mágicas que a Anchor gerou para nós aqui.

**Exclua** o conteúdo de `programs/myepicproject/src/lib.rs` e `tests/myepicproject.js`. Na verdade, não exclua os arquivos, apenas o que há neles.

*Nota: eu realmente **não** instalei a extensão Rust para VSCode. Ele já tem _syntax highlighting_ para Rust nativamente.*

### 👶 Um programa básico

Vamos escrever nosso primeiro programa Solana! Este código Rust vai estar no arquivo `lib.rs`.

Aqui está o que irá se parecer:

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

Muita coisa acontecendo aqui, então vamos apenas passo a passo. Novamente, se você não conhece Rust - não se preocupe muito. Eu acho que você pode pegar essas coisas muito rapidamente. Você não vai se tornar um Rust Master assim, mas pode se preocupar com isso depois :).

```rust
use anchor_lang::prelude::*;
```

Uma simples declaração `use` no topo. Tipo como uma declaração de importação. Queremos importar muitas das ferramentas que o Anchor fornece para facilitar a escrita de programas Solana.

```rust
declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");
```

Nós vamos cobrir isso um pouco mais pra frente. Basicamente, este é o "ID do programa" e contém informações para Solana sobre como executar nosso programa. A Anchor gerou este para nós. Nós vamos mudá-lo mais tarde.

```rust
#[program]
```

É assim que dizemos ao nosso programa: "Ei - tudo neste pequeno módulo abaixo é nosso programa que queremos criar manipuladores para que outras pessoas possam chamar". Você verá como isso entra em jogo. Mas, essencialmente, isso nos permite chamar nosso programa Solana de nosso frontend por meio de uma solicitação `fetch`. Veremos essa sintaxe `#[blah]` em alguns lugares.

Eles são chamados de [macros](http://web.mit.edu/rust-lang_v1.25/arch/amd64_ubuntu1404/share/doc/rust/html/book/first-edition/macros.html) — e eles basicamente anexam o código ao nosso módulo. É como "herdar" uma classe.

```rust
pub mod myepicproject {
  use super::*;
  pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> Result <()> {
    Ok(())
  }
}
```

`pub mod` nos diz que este é um "[módulo](https://stevedonovan.github.io/rust-gentle-intro/4-modules.html)" Rust, que é uma maneira fácil de definir uma coleção de funções e variáveis — como uma classe, se você sabe o que é. E chamamos este módulo de `myepicproject`. Aqui nós escrevemos uma função `start_stuff_off` que pega algo chamado `Context` e gera um `Result <()>`. Você pode ver que esta função não faz nada exceto chamar `Ok(())` que é apenas um tipo `Result` sobre o qual você pode ler [aqui](https://doc.rust-lang.org/std/result/).

Então, realmente, essa coisa `start_stuff_off` é apenas uma função que outra pessoa pode chamar agora. Não faz nada agora, mas vamos mudar isso :).

```rust
#[derive(Accounts)]
pub struct StartStuffOff {}
```

Por último, temos essa coisa na parte inferior. Será mais óbvio por que isso é importante mais tarde. Mas basicamente é outro `macro`. Aqui, basicamente seremos capazes de especificar diferentes restrições de conta. Novamente, vai fazer mais sentido daqui a pouco hehe.

Vamos apenas colocar as coisas em funcionamento e ver o que acontece.

### 💎 Escreva um script para vê-lo funcionando localmente

Precisamos basicamente dizer ao Anchor como queremos que nosso programa seja executado e quais funções queremos chamar. Vá até `tests/myepicproject.js`. Na verdade, isso está escrito em Javascript :).

Vá em frente e codifique isso:

```javascript
const anchor = require('@project-serum/anchor');

const main = async() => {
  console.log("🚀 Iniciando testes...")

  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.Myepicproject;
  const tx = await program.rpc.startStuffOff();

  console.log("📝 Sua assinatura de transação", tx);
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

Podemos ir linha a linha aqui aqui. Em primeiro lugar, `runMain` é apenas uma mágica de javascript para fazer com que nossa função `main` seja executada de forma assíncrona. Nada de especial realmente.

A verdadeira magia acontece aqui:

```javascript
anchor.setProvider(anchor.AnchorProvider.env());
const program = anchor.workspace.Myepicproject;
const tx = await program.rpc.startStuffOff();
```

Primeiro, dizemos ao Anchor para definir nosso provedor. Então, ele obtém esses dados de `solana config get`. Neste caso, está pegando nosso ambiente local! Dessa forma, o Anchor sabe como executar nosso código localmente (mais tarde poderemos testar nosso código no devnet!).

Então, pegamos `anchor.workspace.Myepicproject` e isso é uma coisa super legal que nos foi dada pela Anchor que irá compilar automaticamente nosso código em `lib.rs` e implantá-lo localmente em um validador local. Muita magia em uma linha e esta é uma grande razão pela qual Anchor é incrível.

*Nota: Nomear + estrutura de pastas é mega importante aqui. Ex. O Anchor sabe olhar para `programs/myepicproject/src/lib.rs` porque nós usamos `anchor.workspace.Myepicproject`.*

Finalmente, nós chamamos nossa função que criamos fazendo `program.rpc.startStuffOff()` e então `await` que irá esperar que nosso validador local "mine" a instrução.

Antes de executá-lo, precisamos fazer uma mudança rápida.

Em `Anchor.toml` queremos mudar um pouco as tags `[scripts]`:

```
[scripts]
test = "node tests/myepicproject.js"
```

**Mantenha todo o resto em `Anchor.toml` igual!**

Por fim, vamos executá-lo usando:

```bash
anchor test
```

Aqui está o que recebi na parte de baixo:

```bash
🚀 Iniciando testes...
📝 Sua assinatura de transação 4EPghDAKXjtseY1dB4DT3xwpt18L1QrL8qbAJ3a3mRaTTZURkgBuUhN3sNhppDbwJNRL75fE53ucTBytoPWNEMAx
```

*Nota: Se você estiver usando o VSCode, não se esqueça de **salvar** todos os arquivos que você está alterando antes de executar o `anchor test`! Pessoalmente, tive muitos problemas porque pensei que salvei o arquivo, mas na realidade não salvei :(.*

*Nota: Se você vir este erro `Attempt to load a program that does not exist`, você pode fazer `solana address -k target/deploy/myepicproject-keypair.json` e substituir por este endereço cada ocorrência em `lib.rs `, `Anchor.toml` e `myepicproject.js`.*

**BOOOOM. VOCÊ FEZ ISSO.**

Contanto que você veja uma "assinatura de transação", você está bem! Isso significa que você chamou com sucesso a função `startStuffOff` e esta assinatura é basicamente o seu recibo.

Bem épico. Você escreveu um programa Solana, **implementou-o em seu nó Solana local** e agora está realmente falando com seu programa implantado em sua rede Solana local.

**NICEEEEEEE.** Eu sei que pode não parecer muito, mas agora você tem um fluxo básico para fazer as coisas.

1. Write code in `lib.rs`
2. Test specific functions using `tests/myepicproject.js`.

Acostume-se com este ciclo! É a maneira mais rápida de iterar em seus programas Solana :).

### 🚨 Relatório de progresso

*Faça isso senão o Dani vai ficar triste :(*

Poste uma captura de tela do seu teste básico funcionando em `#progress`! É sempre motivador para os outros ver as pessoas descobrindo as coisas.
