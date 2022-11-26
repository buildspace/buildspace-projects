It's time to convert the NFT Staking Program and UI to Anchor! The buildoor project you've been working on is awesome as is, but it'll be simpler to work with moving forward if it's in Anchor. Go ahead and use what you've learned to:
1. Rewrite the program from scratch using Anchor. 
2. Add some solid test coverage to make sure you aren't letting security risks slip through the cracks
3. Replace complex UI code with calls to the Anchor method builder

You should spend a fair amount of time trying to do this independently. It's not a simple task, but you've got this. After a few hours if you feel stuck feel free to watch the video walkthroughs of our solution.


Let's do this and go over the shipped product. We will build out the staking program we've been working on, but instead of adding new functionality, we'll go through and replace it all with Anchor. 

Let's create a new project by running `anchor init anchor-nft-staking`, or a name of your own choosing. Hop into the `Anchor.toml` file and set seeds to `true`, and the cluster to `devnet`.

Then hop over to `/programs/anchor-nft-staking/Cargo.toml`, add the following dependencies.

```
anchor-lang = { version="0.25.0", features = ["init-if-needed"] }
anchor-spl = "0.25.0"
mpl-token-metadata = { version="1.4.1", features=["no-entrypoint"] }
```

Alright, open up the `lib.rs` file, let's build out our basic scaffolding.

Let's add the following imports, it'll become clear as we go along why each is needed.

``` rust 
use anchor_lang::solana_program::program::invoke_signed;
use anchor_spl::token;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Approve, Mint, MintTo, Revoke, Token, TokenAccount},
};
use mpl_token_metadata::{
    instruction::{freeze_delegated_account, thaw_delegated_account},
    ID as MetadataTokenId,
};
```

Let's change the name of the deafult function to `stake`, and its related Context to type `Stake`.

Then add a function called `redeem` with Context type of `Redeem`.

Finally, do the same for `unstake` with Context type of `Unstake`.

Those are the items we'll be building out, we'll first work on the struct for Stake.

We will need a PDA for the UserStakeInfo, and a StakeState enum for one of the fields of the PDA.

``` rust
#[account]
pub struct UserStakeInfo {
    pub token_account: Pubkey,
    pub stake_start_time: i64,
    pub last_stake_redeem: i64,
    pub user_pubkey: Pubkey,
    pub stake_state: StakeState,
    pub is_initialized: bool,
}

#[derive(Debug, PartialEq, AnchorDeserialize, AnchorSerialize, Clone)]
pub enum StakeState {
    Unstaked,
    Staked,
}
```

Let's also add a default value for StakeState which will set the value to unstaked.

``` rust 
impl Default for StakeState {
    fn default() -> Self {
        StakeState::Unstaked
    }
}

```

We will be using the Metadata program. Since this is relatively new, there isn't a type for it in the Anchor program. In order to use it like our other programs (e.g. System Program, Token Program, etc), we'll create a struct for it, and add an implementation called `id` that returns a `Pubkey`, which is the `MetadataTokenId`.

``` rust 
#[derive(Clone)]
pub struct Metadata;

impl anchor_lang::Id for Metadata {
    fn id() -> Pubkey {
        MetadataTokenId
    }
}
```

Ok, we can now get working on the staking bit. The struct needs a total of nine accounts, which you'll see below. A few things of note.

You'll notice the `nft_edition` is an `Unchecked` account, that's because there isn't a type for the edition account already created in the system. All unchecked accounts need to have a note so the system knows you'll add manual security checks, you'll see that below as `CHECK: Manual validation`.

As a reminder, the attributes on each account are security checks to ensure the account is of the right type, and can perform certain functions. As the user has to pay, and the NFT token account will be making changes, both have the `mut` attribute. Some accounts also need seeds as you'll notice below.

All the other accounts without any attributed have their own requisite security checks in Anchor, so we don't have to add any attributes.


``` rust 
#[derive(Accounts)]
pub struct Stake<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        mut,
        associated_token::mint=nft_mint,
        associated_token::authority=user
    )]
    pub nft_token_account: Account<'info, TokenAccount>,
    pub nft_mint: Account<'info, Mint>,
    /// CHECK: Manual validation
    #[account(owner=MetadataTokenId)]
    pub nft_edition: UncheckedAccount<'info>,
    #[account(
        init_if_needed,
        payer=user,
        space = std::mem::size_of::<UserStakeInfo>() + 8,
        seeds = [user.key().as_ref(), nft_token_account.key().as_ref()],
        bump
    )]
    pub stake_state: Account<'info, UserStakeInfo>,
    /// CHECK: Manual validation
    #[account(mut, seeds=["authority".as_bytes().as_ref()], bump)]
    pub program_authority: UncheckedAccount<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub metadata_program: Program<'info, Metadata>,
}
```

Before we move on, let's run anchor build so our first build gets going. Remember, this is our first build, so it'll generate our Program ID.

While that's running, create a new folder in the `tests` directory called `utils`. In there, create a file called `setupNft.ts`. Paste in the code below.

``` typescript
import {
  bundlrStorage,
  keypairIdentity,
  Metaplex,
} from "@metaplex-foundation/js"
import { createMint, getAssociatedTokenAddress } from "@solana/spl-token"
import * as anchor from "@project-serum/anchor"

export const setupNft = async (program, payer) => {
  const metaplex = Metaplex.make(program.provider.connection)
    .use(keypairIdentity(payer))
    .use(bundlrStorage())

  const nft = await metaplex
    .nfts()
    .create({
      uri: "",
      name: "Test nft",
      sellerFeeBasisPoints: 0,
    })

  console.log("nft metadata pubkey: ", nft.metadataAddress.toBase58())
  console.log("nft token address: ", nft.tokenAddress.toBase58())
  const [delegatedAuthPda] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("authority")],
    program.programId
  )
  const [stakeStatePda] = await anchor.web3.PublicKey.findProgramAddress(
    [payer.publicKey.toBuffer(), nft.tokenAddress.toBuffer()],
    program.programId
  )

  console.log("delegated authority pda: ", delegatedAuthPda.toBase58())
  console.log("stake state pda: ", stakeStatePda.toBase58())
  const [mintAuth] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("mint")],
    program.programId
  )

  const mint = await createMint(
    program.provider.connection,
    payer,
    mintAuth,
    null,
    2
  )
  console.log("Mint pubkey: ", mint.toBase58())

  const tokenAddress = await getAssociatedTokenAddress(mint, payer.publicKey)

  return {
    nft: nft,
    delegatedAuthPda: delegatedAuthPda,
    stakeStatePda: stakeStatePda,
    mint: mint,
    mintAuth: mintAuth,
    tokenAddress: tokenAddress,
  }
}

```

Next run `npm install @metaplex-foundation/js`. 

Then hop into `anchor-nft-staking.ts` in the `tests` directory. This is a default file created by Anchor.

Change the default line for the provider to two parts, so we have access to the provider when we need it later.

``` typescript
const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
```

Let's add wallet, which will allow us to expose a payer for our transactions.

``` typescript
const wallet = anchor.workspace.AnchorNftStaking.provider.wallet
```

Check in on your build, if it is completed, run `anchor deploy`, if it fails, you may need to airdrop some SOL to yourself.

After the build is done, run `anchor keys list` and get the program ID to put into `lib.rs` and `Anchor.toml` files. You may need to come back to this if the build takes a while.

Back to the test file.

Let's declare a few variable types we'll be needing for testing.

``` typescript
let delegatedAuthPda: anchor.web3.PublicKey
let stakeStatePda: anchor.web3.PublicKey
let nft: any
let mintAuth: anchor.web3.PublicKey
let mint: anchor.web3.PublicKey
let tokenAddress: anchor.web3.PublicKey
```

Now let's add a `before` function, which will get called before tests run. You'll notice the ";" syntax, it is what will destructure the return value and set all of these values. 

``` typescript
before(async () => {
    ;({ nft, delegatedAuthPda, stakeStatePda, mint, mintAuth, tokenAddress } =
      await setupNft(program, wallet.payer))
  })
```

Hop into the default test, change it so it says `it("Stakes", `. At first, we're just making sure the function gets called. We don't have our adtual stake function built out yet, so there's no logic being tested here.

``` typescript
it("Stakes", async () => {
    // Add your test here.
    await program.methods
      .stake()
      .accounts({
        nftTokenAccount: nft.tokenAddress,
        nftMint: nft.mintAddress,
        nftEdition: nft.masterEditionAddress,
        metadataProgram: METADATA_PROGRAM_ID,
      })
      .rpc()

  })
```

And now, run `anchor test`. Assuming it passes, it means we're passing the validation for accounts created in the Stake struct.

Back to our logic, here's a step-by-step of what needs to happen for staking to work. We need to get access to the clock, make sure the stake state is already initialized, and make sure it is not already staked.

In the stake function, let's first get the clock. 

``` rust
let clock = Clock::get().unwrap();
```

Next we create a CPI to delegate this program as the authority to freeze or thaw our NFT. First we set the CPI, then identify which accounts we are using, and finally set the authority.

``` rust
msg!("Approving delegate");

        let cpi_approve_program = ctx.accounts.token_program.to_account_info();
        let cpi_approve_accounts = Approve {
            to: ctx.accounts.nft_token_account.to_account_info(),
            delegate: ctx.accounts.program_authority.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };

let cpi_approve_ctx = CpiContext::new(cpi_approve_program, cpi_approve_accounts);
        token::approve(cpi_approve_ctx, 1)?;
```

Next we move onto actually freezing the token. First we set the authority bump, then we call invoke_signed and pass in all the necessary accounts, and an array of account infos, and lastly the seed and bump.

``` rust
msg!("Freezing token account");
        let authority_bump = *ctx.bumps.get("program_authority").unwrap();
        invoke_signed(
            &freeze_delegated_account(
                ctx.accounts.metadata_program.key(),
                ctx.accounts.program_authority.key(),
                ctx.accounts.nft_token_account.key(),
                ctx.accounts.nft_edition.key(),
                ctx.accounts.nft_mint.key(),
            ),
            &[
                ctx.accounts.program_authority.to_account_info(),
                ctx.accounts.nft_token_account.to_account_info(),
                ctx.accounts.nft_edition.to_account_info(),
                ctx.accounts.nft_mint.to_account_info(),
                ctx.accounts.metadata_program.to_account_info(),
            ],
            &[&[b"authority", &[authority_bump]]],
        )?;
```

And now, we set the data on our stake account.

``` rust 
ctx.accounts.stake_state.token_account = ctx.accounts.nft_token_account.key();
ctx.accounts.stake_state.user_pubkey = ctx.accounts.user.key();
ctx.accounts.stake_state.stake_state = StakeState::Staked;
ctx.accounts.stake_state.stake_start_time = clock.unix_timestamp;
ctx.accounts.stake_state.last_stake_redeem = clock.unix_timestamp;
ctx.accounts.stake_state.is_initialized = true;
```

Ah, let's hop to the top and add a security check, which also needs a custom error. Both bits of code are below, but put the custom error code at the bottom of the file, out of the way of the logic and structs.

``` rust
require!(
    ctx.accounts.stake_state.stake_state == StakeState::Unstaked,
    StakeError::AlreadyStaked
        );
```

``` rust
#[error_code]
pub enum StakeError {
    #[msg("NFT already staked")]
    AlreadyStaked,
}
```

Don't forget to restock your SOL before run a test again. 

Alright, that's it, let's go back into the test and add a bit more functionality to our stake test to see if the staking state is correct.

``` typescript
const account = await program.account.userStakeInfo.fetch(stakeStatePda)
    expect(account.stakeState === "Staked")
```

Run the test one more time and hope for the best!! 🤞

That's about it, our first instruction is working. In the next section, we'll work on the other two instructions, and then finally get working on client side stuff.
