
Back into the `lib.rs` file, down to the Redeem struct. It's quite similar to Stake, so we'll paste that code and edit as need be.

The ones we don't need are nft_mint, nft_edition, and program_authority. We need to change the constraints on nft_token_account to make the token authority be 'user' since we're not passing in the mint. 

For the stake_state account, it no longer needs to be initialized, so we just need the seeds and bump, and make it mutable. Let's add a couple of manual contraints for it as well.

``` rust
constraint = *user.key == stake_state.user_pubkey,
constraint = nft_token_account.key() == stake_state.token_account
```

Let's add a few other accounts, one is stake_mint, which needs to be mutable. This is the reward mint. 

``` rust 
#[account(mut)]
pub stake_mint: Account<'info, Mint>,
```

Another is stake_authority, which will be another Unchecked account, so let's add this check.

` #[account(seeds = ["mint".as_bytes().as_ref()], bump)]`

The user_stake_ata which is a TokenAccount, with these constraints.

``` rust
#[account(
        init_if_needed,
        payer=user,
        associated_token::mint=stake_mint,
        associated_token::authority=user
    )]
pub user_stake_ata: Account<'info, TokenAccount>,
```

The associated_token_program which is an AssociatedToken.

``` rust 
pub associated_token_program: Program<'info, AssociatedToken>,
```

And finally, replace metadata_program with rent.

``` rust 
pub rent: Sysvar<'info, Rent>,
```

Bringing our total number of accounts to 10. Here's all the code in one snippet.

``` rust
#[derive(Accounts)]
pub struct Redeem<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        mut,
        token::authority=user
    )]
    pub nft_token_account: Account<'info, TokenAccount>,
    #[account(
        mut,
        seeds = [user.key().as_ref(), nft_token_account.key().as_ref()],
        bump,
        constraint = *user.key == stake_state.user_pubkey,
        constraint = nft_token_account.key() == stake_state.token_account
    )]
    pub stake_state: Account<'info, UserStakeInfo>,
    #[account(mut)]
    pub stake_mint: Account<'info, Mint>,
    /// CHECK: manual check
    #[account(seeds = ["mint".as_bytes().as_ref()], bump)]
    pub stake_authority: UncheckedAccount<'info>,
    #[account(
        init_if_needed,
        payer=user,
        associated_token::mint=stake_mint,
        associated_token::authority=user
    )]
    pub user_stake_ata: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
```

Back over to the test file, write up a simple test to make sure the function fires. 

This should look quite similar to our stake test, just with different accounts passed in. Remember, a bunch of the accounts can just be inferred for testing, so we don't have to pass them all in.

``` typescript 
it("Redeems", async () => {
    await program.methods
      .redeem()
      .accounts({
        nftTokenAccount: nft.tokenAddress,
        stakeMint: mint,
        userStakeAta: tokenAddress,
      })
      .rpc()
```

...and run `anchor test`, and if all is ok and the two tests pass, let's hop into the function and write out the logic for redeem.

First things first, let's do a couple of checks, one to see if it is initialized. The other is to make sure it is already staked. We will need to add custom errors for both of these at the bottom of the file. 

``` rust 
require!(
    ctx.accounts.stake_state.is_initialized,
    StakeError::UninitializedAccount
);

require!(
    ctx.accounts.stake_state.stake_state == StakeState::Staked,
    StakeError::InvalidStakeState
);

...

#[msg("State account is uninitialized")]
    UninitializedAccount,

#[msg("Stake state is invalid")]
    InvalidStakeState,
```

Next, let's get our clock.

`let clock = Clock::get()?;`

Now we can add a couple of messages to keep track of things, and declare our time and redeem amount.

``` rust 
msg!(
            "Stake last redeem: {:?}",
            ctx.accounts.stake_state.last_stake_redeem
        );

        msg!("Current time: {:?}", clock.unix_timestamp);
        let unix_time = clock.unix_timestamp - ctx.accounts.stake_state.last_stake_redeem;
        msg!("Seconds since last redeem: {}", unix_time);
        let redeem_amount = (10 * i64::pow(10, 2) * unix_time) / (24 * 60 * 60);
        msg!("Elligible redeem amount: {}", redeem_amount);
```

Ok, now we'll actually mint the rewards. First we need our CpiContext with our program. Then we pass it accounts in the MintTo object, which includes the mint, who it is going to, and the authority. Lastly, we add our seeds, and the amount. 

``` rust 
msg!("Minting staking rewards");
token::mint_to(
    CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        MintTo {
            mint: ctx.accounts.stake_mint.to_account_info(),
            to: ctx.accounts.user_stake_ata.to_account_info(),
            authority: ctx.accounts.stake_authority.to_account_info(),
        },
        &[&[
            b"mint".as_ref(),
            &[*ctx.bumps.get("stake_authority").unwrap()],
        ]],
    ),
    redeem_amount.try_into().unwrap(),
)?;

```

That's all set, now we need to set our last stake redeem time, if we don't set this, they'll keep getting more rewards than they should.

``` rust 
ctx.accounts.stake_state.last_stake_redeem = clock.unix_timestamp;
    msg!(
    "Updated last stake redeem time: {:?}",
    ctx.accounts.stake_state.last_stake_redeem
    );
```

Hop back into the test for redeem, and add this. 

``` typescript
const account = await program.account.userStakeInfo.fetch(stakeStatePda)
    expect(account.stakeState === "Unstaked")
    const tokenAccount = await getAccount(provider.connection, tokenAddress)
```

You can definitely add more tests to make it more robust, for now we just want to get the basic functionality up and tested. Assuming all is good, we can move onto the unstake instruction. 