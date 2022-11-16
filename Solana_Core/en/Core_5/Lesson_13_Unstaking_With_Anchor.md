
Now that redeem and stake are complete, let's hop into unstake. The Unstake account struct will have 14 total accounts, a combination of what was in stake and redeem, so it is pasted below. Make sure the order is the same.

``` rust 
#[derive(Accounts)]
pub struct Unstake<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        mut,
        token::authority=user
    )]
    pub nft_token_account: Account<'info, TokenAccount>,
    pub nft_mint: Account<'info, Mint>,
    /// CHECK: Manual validation
    #[account(owner=MetadataTokenId)]
    pub nft_edition: UncheckedAccount<'info>,
    #[account(
        mut,
        seeds = [user.key().as_ref(), nft_token_account.key().as_ref()],
        bump,
        constraint = *user.key == stake_state.user_pubkey,
        constraint = nft_token_account.key() == stake_state.token_account
    )]
    pub stake_state: Account<'info, UserStakeInfo>,
    /// CHECK: manual check
    #[account(mut, seeds=["authority".as_bytes().as_ref()], bump)]
    pub program_authority: UncheckedAccount<'info>,
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
    pub metadata_program: Program<'info, Metadata>,
}
```

Easy enough on that one, let's write our basic test to make sure this works. We have to add the six accounts that are not inferred.

``` typescript
it("Unstakes", async () => {
    await program.methods
      .unstake()
      .accounts({
        nftTokenAccount: nft.tokenAddress,
        nftMint: nft.mintAddress,
        nftEdition: nft.masterEditionAddress,
        metadataProgram: METADATA_PROGRAM_ID,
        stakeMint: mint,
        userStakeAta: tokenAddress,
      })
      .rpc()
```

Run `anchor test` to make sure our account validation is set up properly.

Back to the actual function itself, this one is a bit larger than the last two. It is quite similar to redeem, to begin with, you can paste in that code, to save some typing.

We start off with the same two require statements. After those two, we need to 'thaw' our account. This code is very similar to the invoke_signed for freezing the account, we just need to reverse a couple of steps.

Assuming you pasted the redeem code, before you declare clock, add this. You'll notice it's nearly identical, but we're obviously calling the thawing function.

``` rust
msg!("Thawing token account");
    let authority_bump = *ctx.bumps.get("program_authority").unwrap();
    invoke_signed(
        &thaw_delegated_account(
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

Next we need to revoke the delegation, again, we can paste the code from before when we approved the delegate. Change the method from approve to revoke, and change the object. It will only require source and authority. Make sure to also change the varible names. Easier to look below and see that we're basically changing approve to revoke for the most part.

``` rust 
msg!("Revoking delegate");

    let cpi_revoke_program = ctx.accounts.token_program.to_account_info();
    let cpi_revoke_accounts = Revoke {
        source: ctx.accounts.nft_token_account.to_account_info(),
        authority: ctx.accounts.user.to_account_info(),
    };

    let cpi_revoke_ctx = CpiContext::new(cpi_revoke_program, cpi_revoke_accounts);
    token::revoke(cpi_revoke_ctx)?;
```

The remaining code remains the same as for the redeem function (which we just pasted), so the all the redeeming happens. Next we need to change the state for staked, add this line at the bottom.

``` rust
ctx.accounts.stake_state.stake_state = StakeState::Unstaked;
```

That wraps up unstaked, let' finish up the test by adding this check to make sure it's funcitoning properly.

``` typescript
const account = await program.account.userStakeInfo.fetch(stakeStatePda)
    expect(account.stakeState === "Unstaked")
```

Again, we can add a lot more testing to ensure everything working as we intend. I'll leave that in your hands.

That's it for our program for now. Hopefully it's pretty clear why working with Anchor is simpler and saves a lot of time. The front-end is next!!