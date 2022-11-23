Now we can level up by adding CPIs to the mix.

Recall that CPIs are made using `invoke` and `invoke_signed`. 

Anchor also provide a format to make CPIs. Using this format requires access to a CPI module for the program you are invoking. Common programs have a crate you can use, ex `anchor_spl` for the token program. Otherwise, you would have to use the source code of the program you are invoking or a published IDL to generate the CPI module.

You can still use `invoke` and `invoke_signed` directly within an instruction if a CPI module is not available. Just as anchor instructions require a `Context` type, Anchor CPIs use a `CpiContext`.

The CpiContext provides all the accounts and seeds required by an instruction. The CpiContext::new is used when there are no PDA signers.

```rs
CpiContext::new(cpi_program, cpi_accounts)
```

`CpiContext::new_with_signer` is used when a PDA is required as a signer.

```rs
CpiContext::new_with_signer(cpi_program, cpi_accounts, seeds)
```

The `CpiContext` accepts:
- `accounts` - list of accounts
- `remaining_accounts` - if any
- `program` - program CPI is invoking
- `signer_seeds` - if a PDA is required to sign for the CPI

```rs
pub struct CpiContext<'a, 'b, 'c, 'info, T>
where
    T: ToAccountMetas + ToAccountInfos<'info>,
{
    pub accounts: T,
    pub remaining_accounts: Vec<AccountInfo<'info>>,
    pub program: AccountInfo<'info>,
    pub signer_seeds: &'a [&'b [&'c [u8]]],
}
```

`CpiContext::new` is used when `signer_seeds` is not required (not using a PDA to sign).

```rs
pub fn new(
			program: AccountInfo<'info>, 
			accounts: T
		) -> Self {
        Self {
            accounts,
            program,
            remaining_accounts: Vec::new(),
            signer_seeds: &[],
        }
    }
```

`CpiContext::new_with_signer` is used when seeds are signing for a PDA.

```rs
pub fn new_with_signer(
        program: AccountInfo<'info>,
        accounts: T,
        signer_seeds: &'a [&'b [&'c [u8]]],
    ) -> Self {
        Self {
            accounts,
            program,
            signer_seeds,
            remaining_accounts: Vec::new(),
        }
    }
```

The `anchor_spl` crate includes a `token` module to simply the process of making CPIs to the token program.

`Structs` are the list of accounts each respective token program instruction requires. `Functions` are the CPI to each respective instruction.

For example, here are the `MintTo` required accounts:
```rs
#[derive(Accounts)]
pub struct MintTo<'info> {
    pub mint: AccountInfo<'info>,
    pub to: AccountInfo<'info>,
    pub authority: AccountInfo<'info>,
}
```

Let’s also take a look at `mint_to` under the hood.

It uses the `CpiContext` to build a CPI to the `mint_to` instruction. It makes the CPI using `invoke_signed`.

```rs
pub fn mint_to<'a, 'b, 'c, 'info>(
    ctx: CpiContext<'a, 'b, 'c, 'info, MintTo<'info>>,
    amount: u64,
) -> Result<()> {
    let ix = spl_token::instruction::mint_to(
        &spl_token::ID,
        ctx.accounts.mint.key,
        ctx.accounts.to.key,
        ctx.accounts.authority.key,
        &[],
        amount,
    )?;
    solana_program::program::invoke_signed(
        &ix,
        &[
            ctx.accounts.to.clone(),
            ctx.accounts.mint.clone(),
            ctx.accounts.authority.clone(),
        ],
        ctx.signer_seeds,
    )
    .map_err(Into::into)
}
```

For example:
- `mint_to` CPI

```rs
let auth_bump = *ctx.bumps.get("mint_authority").unwrap();
let seeds = &[
    b"mint".as_ref(),
    &[auth_bump],
];
let signer = &[&seeds[..]];

let cpi_program = ctx.accounts.token_program.to_account_info();

let cpi_accounts = MintTo {
    mint: ctx.accounts.token_mint.to_account_info(),
    to: ctx.accounts.token_account.to_account_info(),
    authority: ctx.accounts.mint_authority.to_account_info()
};

let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);

token::mint_to(cpi_ctx, amount)?;
```

Refactoring this we get:
```rs
token::mint_to(
    CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        token::MintTo {
            mint: ctx.accounts.mint_account.to_account_info(),
            to: ctx.accounts.token_account.to_account_info(),
            authority: ctx.accounts.mint_authority.to_account_info(),
        },
        &[&[
            b"mint", 
            &[*ctx.bumps.get("mint_authority").unwrap()],
        ]]
    ),
    amount,
)?;
```

#### ❌ Anchor errors
AnchorErrors can be divided into 
- Anchor Internal Errors that the framework returns from inside its own code
- Custom errors which the user (you!) can return

**AnchorErrors** provide a range of information like 
- the error name and number
- location in the code where the anchor was thrown
- the account that violated a constraint

Ultimately, all programs return the same Error: The `[ProgramError](https://docs.rs/solana-program/latest/solana_program/program_error/enum.ProgramError.html)`.

Anchor has many different internal error codes. These are not meant to be used by users, but it's useful to study the reference to learn about the mappings between codes and their causes.

Custom Error code numbers start at the custom error offset. 

You can add errors that are unique to your program by using the error_code attribute. Simply add it to an enum with a name of your choice. You can then use the variants of the enum as errors in your program. 

Additionally, you can add a message attributed to the individual variants. Clients will then display this error message if the error occurs.To actually throw an error use the err! or the error! macro. These add file and line information to the error that is then logged by anchor.

```rs
#[program]
mod hello_anchor {
    use super::*;
    pub fn set_data(ctx: Context<SetData>, data: MyAccount) -> Result<()> {
        if data.data >= 100 {
            return err!(MyError::DataTooLarge);
        }
        ctx.accounts.my_account.set_inner(data);
        Ok(())
    }
}

#[error_code]
pub enum MyError {
    #[msg("MyAccount may only hold data below 100")]
    DataTooLarge
}
```

You can use the `require` macro to simplify writing errors. The code above can be simplified to this (Note that the `>=` flips to `<`)

```rs
#[program]
mod hello_anchor {
    use super::*;
    pub fn set_data(ctx: Context<SetData>, data: MyAccount) -> Result<()> {
        require!(data.data < 100, MyError::DataTooLarge);
        ctx.accounts.my_account.set_inner(data);
        Ok(())
    }
}

#[error_code]
pub enum MyError {
    #[msg("MyAccount may only hold data below 100")]
    DataTooLarge
}
```

#### `init_if_needed` constraint
Initialize an account if it does not exist. If it does exist, still check against any additional constraints.

For example, an associated token account:
```rs
#[program]
mod example {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init_if_needed,
        payer = payer, 
        associated_token::mint = mint, 
        associated_token::authority = payer
    )]
    pub token_account: Account<'info, TokenAccount>,
    pub mint: Account<'info, Mint>,
     #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}
```

Here’s the code that `init_if_needed` generates (code snippet from `anchor expand` command):
```rs
let token_account: anchor_lang::accounts::account::Account<TokenAccount> = {
    if !true
    || AsRef::<AccountInfo>::as_ref(&token_account).owner
    == &anchor_lang::solana_program::system_program::ID
    {
      let payer = payer.to_account_info();
      let cpi_program = associated_token_program.to_account_info();
      let cpi_accounts = anchor_spl::associated_token::Create {
        payer: payer.to_account_info(),
        associated_token: token_account.to_account_info(),
        authority: payer.to_account_info(),
        mint: mint.to_account_info(),
        system_program: system_program.to_account_info(),
        token_program: token_program.to_account_info(),
        rent: rent.to_account_info(),
      };
      let cpi_ctx = anchor_lang::context::CpiContext::new(
        cpi_program,
        cpi_accounts,
      );
      anchor_spl::associated_token::create(cpi_ctx)?;
    }
  ...
}
```
