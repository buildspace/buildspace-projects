
We're hopping into the open lootbox instruction, first thing you'll notice, it requires a lot of accounts, 19 in total! 

Up until the stake_state, it is all information we've had before. 

Things we're adding related to switchboard: our user state, which we just initialized in init user. Then there are a bunch of switchboard accounts, which are the vrf account, the oracle queue account, queue authority, which is just a PDA for that authority, the data buffer account, permission account, escrow account, program state account, and switchboard program account itself.

You'll notice there are quite a few types we've not talked about, they're coming from the switchboard-v2 crate. Here are the two dependencies you'll need to add to the `Cargo.toml` to make all those types work.

```
switchboard-v2 = { version = "^0.1.14", features = ["devnet"] }
bytemuck = "1.7.2"
```
And the last two accounts are payer wallet, which is the token account associated with your swithboard token, it is how you pay for the randomness, and the recent blockhashes.

``` rust
use crate::*;
use anchor_lang::solana_program;

#[derive(Accounts)]
pub struct OpenLootbox<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        init_if_needed,
        payer = user,
        space = std::mem::size_of::<LootboxPointer>() + 8,
        seeds=["lootbox".as_bytes(), user.key().as_ref()],
        bump
    )]
    pub lootbox_pointer: Box<Account<'info, LootboxPointer>>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    // TESTING - Uncomment the next line during testing
    // #[account(mut)]
    // TESTING - Comment out the next three lines during testing
    #[account(
          mut,
          address="D7F9JnGcjxQwz9zEQmasksX1VrwFcfRKu8Vdqrk2enHR".parse::<Pubkey>().unwrap()
      )]
    pub stake_mint: Account<'info, Mint>,
    #[account(
        mut,
        associated_token::mint=stake_mint,
        associated_token::authority=user
    )]
    pub stake_mint_ata: Box<Account<'info, TokenAccount>>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    #[account(
        constraint=stake_state.user_pubkey==user.key(),
    )]
    pub stake_state: Box<Account<'info, UserStakeInfo>>,
    #[account(
        mut,
        // TESTING - Comment out these seeds for testing
        seeds = [
            user.key().as_ref(),
        ],
        // TESTING - Uncomment these seeds for testing
        // seeds = [
        //     vrf.key().as_ref(),
        //     user.key().as_ref()
        // ],
        bump = state.load()?.bump,
        has_one = vrf @ LootboxError::InvalidVrfAccount
    )]
    pub state: AccountLoader<'info, UserState>,

    // SWITCHBOARD ACCOUNTS
    #[account(mut,
        has_one = escrow
    )]
    pub vrf: AccountLoader<'info, VrfAccountData>,
    #[account(mut,
        has_one = data_buffer
    )]
    pub oracle_queue: AccountLoader<'info, OracleQueueAccountData>,
    /// CHECK:
    #[account(mut,
        constraint =
            oracle_queue.load()?.authority == queue_authority.key()
    )]
    pub queue_authority: UncheckedAccount<'info>,
    /// CHECK
    #[account(mut)]
    pub data_buffer: AccountInfo<'info>,
    #[account(mut)]
    pub permission: AccountLoader<'info, PermissionAccountData>,
    #[account(mut,
        constraint =
            escrow.owner == program_state.key()
            && escrow.mint == program_state.load()?.token_mint
    )]
    pub escrow: Account<'info, TokenAccount>,
    #[account(mut)]
    pub program_state: AccountLoader<'info, SbState>,
    /// CHECK:
    #[account(
        address = *vrf.to_account_info().owner,
        constraint = switchboard_program.executable == true
    )]
    pub switchboard_program: AccountInfo<'info>,

    // PAYER ACCOUNTS
    #[account(mut,
        constraint =
            payer_wallet.owner == user.key()
            && escrow.mint == program_state.load()?.token_mint
    )]
    pub payer_wallet: Account<'info, TokenAccount>,
    // SYSTEM ACCOUNTS
    /// CHECK:
    #[account(address = solana_program::sysvar::recent_blockhashes::ID)]
    pub recent_blockhashes: AccountInfo<'info>,
}
```

With the accounts behind us, here's what we're actually doing in the openlootbox implementation, remember this is where our logic sits.

Up until we load our state, it is all the same as before. Once we load our state, we get our bump from the state, then the other two bumps, which we added in init user. We also drop state from memory. 


``` rust
let state = ctx.accounts.state.load()?;
let bump = state.bump.clone();
let switchboard_state_bump = state.switchboard_state_bump;
let vrf_permission_bump = state.vrf_permission_bump;
drop(state);
```

Next we get the switchboard program itself from the accounts list. Then we bulid the vrf request randomness, this is basically our context which we'll use for the CPI, which happens when we call `vrf_request_randomness` a few lines later.

Again, you'll notice some code to comment out for production vs. testing. We only use the vrf account for testing purposes. 

``` rust

let switchboard_program = ctx.accounts.switchboard_program.to_account_info();

let vrf_request_randomness = VrfRequestRandomness {
    authority: ctx.accounts.state.to_account_info(),
    vrf: ctx.accounts.vrf.to_account_info(),
    oracle_queue: ctx.accounts.oracle_queue.to_account_info(),
    queue_authority: ctx.accounts.queue_authority.to_account_info(),
    data_buffer: ctx.accounts.data_buffer.to_account_info(),
    permission: ctx.accounts.permission.to_account_info(),
    escrow: ctx.accounts.escrow.clone(),
    payer_wallet: ctx.accounts.payer_wallet.clone(),
    payer_authority: ctx.accounts.user.to_account_info(),
    recent_blockhashes: ctx.accounts.recent_blockhashes.to_account_info(),
    program_state: ctx.accounts.program_state.to_account_info(),
    token_program: ctx.accounts.token_program.to_account_info(),
};

let payer = ctx.accounts.user.key();
// TESTING - uncomment the following during tests
let vrf = ctx.accounts.vrf.key();
let state_seeds: &[&[&[u8]]] = &[&[vrf.as_ref(), payer.as_ref(), &[bump]]];
// TESTING - comment out the next line during tests
// let state_seeds: &[&[&[u8]]] = &[&[payer.as_ref(), &[bump]]];
```

This does the call to switchboard.

``` rust
msg!("requesting randomness");
vrf_request_randomness.invoke_signed(
    switchboard_program,
    switchboard_state_bump,
    vrf_permission_bump,
    state_seeds,
)?;

msg!("randomness requested successfully");
```

And finally, we change random requested and is initialized to true.

``` rust
ctx.accounts.lootbox_pointer.randomness_requested = true;
ctx.accounts.lootbox_pointer.is_initialized = true;
ctx.accounts.lootbox_pointer.available_lootbox = box_number * 2;

Ok(())
```

Let's hop back to the lootbox pointer struct, there's a `redeemable` property. This property lets our client observe the lootbox pointer account, once it goes from false to true, then we know that we've got the randomness back, and are ready to mint. This change happens in the consume randomness function.

``` rust
#[account]
pub struct LootboxPointer {
  pub mint: Pubkey,
  pub redeemable: bool,
  pub randomness_requested: bool,
  pub available_lootbox: u64,
  pub is_initialized: bool,
}
```

Let's hop over to that function and review. This is the one that gets called by switchboard, it is what we provided as the `callback` in `setupSwitchboard` file. The four accounts in the callback match the accounts in ConsumeRandomness, where loobox pointer and state are both mutable.

``` rust
use crate::state::*;
use crate::*;

#[derive(Accounts)]
pub struct ConsumeRandomness<'info> {
    #[account(
        mut,
        // TESTING - Comment out these seeds for testing
        seeds = [
            payer.key().as_ref(),
        ],
        // TESTING - Uncomment these seeds for testing
        // seeds = [
        //     vrf.key().as_ref(),
        //     payer.key().as_ref()
        // ],
        bump = state.load()?.bump,
        has_one = vrf @ LootboxError::InvalidVrfAccount
    )]
    pub state: AccountLoader<'info, UserState>,
    pub vrf: AccountLoader<'info, VrfAccountData>,
    #[account(
        mut,
        seeds=["lootbox".as_bytes(), payer.key().as_ref()],
        bump
      )]
    pub lootbox_pointer: Account<'info, LootboxPointer>,
    /// CHECK: ...
    pub payer: AccountInfo<'info>,
}
```

As for the actual implementation, in the process instruction function, we first load the vrf and state account. Then we get the result buffer from the vrf account, and check to make sure it's not empty. 

``` rust 
impl ConsumeRandomness<'_> {
    pub fn process_instruction(ctx: &mut Context<Self>) -> Result<()> {
        let vrf = ctx.accounts.vrf.load()?;
        let state = &mut ctx.accounts.state.load_mut()?;

        let result_buffer = vrf.get_result()?;
        if result_buffer == [0u8; 32] {
            msg!("vrf buffer empty");
            return Ok(());
        }

        if result_buffer == state.result_buffer {
            msg!("result_buffer unchanged");
            return Ok(());
        }
```

Then we map the available gear. For now, we're just using constants defined below so we can necessary make changes as we our building our program. This give us a vector of public keys.

``` rust
        let available_gear: Vec<Pubkey> = Self::AVAILABLE_GEAR
            .into_iter()
            .map(|key| key.parse::<Pubkey>().unwrap())
            .collect();
```

The `value` variable is where we take our result buffer and turns it into a unsigned 8-bit integer, this is how switchboard recommended it be implemented, using the `bytemuck` crate. We finally use a modulo operator, with the max number of mints available, to randomly select one. 

``` rust
        // maximum value to convert randomness buffer
        let max_result = available_gear.len();
        let value: &[u8] = bytemuck::cast_slice(&result_buffer[..]);
        let i = (value[0] as usize) % max_result;
        msg!("The chosen mint index is {} out of {}", i, max_result);
```

We finally assign the value at the i'th index to mint, then assign it to the lootbox pointer mint, and changing the value of redeemable to true. This allows to observe it on the client side, and once it is true, the user can mint their gear.

``` rust
        let mint = available_gear[i];
        msg!("Next mint is {:?}", mint);
        ctx.accounts.lootbox_pointer.mint = mint;
        ctx.accounts.lootbox_pointer.redeemable = true;

        Ok(())
    }

    const AVAILABLE_GEAR: [&'static str; 5] = [
        "87QkviUPcxNqjdo1N6C4FrQe3ZiYdAyxGoT44ioDUG8m",
        "EypLPq3xBRREfpsdbyXfFjobVAnHsNerP892NMHWzrKj",
        "Ds1txTXZadjsjKtt2ybH56GQ2do4nbGc8nrSH3Ln8G9p",
        "EHPo4mSNCfYzX3Dtr832boZAiR8vy39eTsUfKprXbFus",
        "HzUvbXymUCBtubKQD9yiwWdivAbTiyKhpzVBcgD9DhrV",
    ];
}
```

As mentioned before, the retrieve item from lootbox instruction has hardly changed. If you have another look at it, you'll see it has no interaction with switchboard, hence no need to make any updates.

### Client-side interaction/testing
At last, we're gonna go over the tests related to switchboard stuff. We already reviewd the setupSwitchboard function to prepare the tests. Our first three tests are still for staking, redeeming, and unstaking. The next test is for init_user, which is pretty straight forward, we just need to pass in the swtichboard state bump and permission bump, and four acounts.

``` typescript
it("init user", async () => {
    const tx = await lootboxProgram.methods
      .initUser({
        switchboardStateBump: switchboardStateBump,
        vrfPermissionBump: permissionBump,
      })
      .accounts({
        state: userState,
        vrf: vrfAccount.publicKey,
        payer: wallet.pubkey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc()
  })
```

Next is the chooses mint pseudorandomly test, which is trickier. The first bit is similar to others. First we create a fake mint to mint this stuff. Then get or create an ATA, and mint to it. And our stake account, which would've been use to actually stake our NFT.

``` typescript
it("Chooses a mint pseudorandomly", async () => {
    const mint = await createMint(
      provider.connection,
      wallet.payer,
      wallet.publicKey,
      wallet.publicKey,
      2
    )
    const ata = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      wallet.payer,
      mint,
      wallet.publicKey
    )

    await mintToChecked(
      provider.connection,
      wallet.payer,
      mint,
      ata.address,
      wallet.payer,
      1000,
      2
    )

    const [stakeAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [wallet.publicKey.toBuffer(), nft.tokenAddress.toBuffer()],
      program.programId
    )
``` 

We then load data from the vrf account, and get our authority and dataBuffer from the switchboard queue. Then we call open lootbox, which needs all the appropriate accounts...there are quite a few. Most come from the setupSwitchboard function, and a couple from the switchboard queue we just grabbed.

``` typescript

    const vrfState = await vrfAccount.loadData()
    const { authority, dataBuffer } = await switchboard.queue.loadData()

    await lootboxProgram.methods
      .openLootbox(new BN(10))
      .accounts({
        user: wallet.publicKey,
        stakeMint: mint,
        stakeMintAta: ata.address,
        stakeState: stakeAccount,
        state: userState,
        vrf: vrfAccount.publicKey,
        oracleQueue: switchboard.queue.publicKey,
        queueAuthority: authority,
        dataBuffer: dataBuffer,
        permission: permissionAccount.publicKey,
        escrow: vrfState.escrow,
        programState: switchboardStateAccount.publicKey,
        switchboardProgram: switchboard.program.programId,
        payerWallet: switchboard.payerTokenWallet,
        recentBlockhashes: anchor.web3.SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
      })
      .rpc()
```

Then we have this awaitCallback function where we pass in lootbox program, pointer PDA and pick a time of 20 seconds, where we'll wait to see if that lootbox pointer updates with the new mint. 

``` typescript

    await awaitCallback(
      lootboxProgram,
      lootboxPointerPda,
      20_000,
      "Didn't get random mint"
    )
  })
```

Below is the await callback function, feel free to paste this. In here you'll see how it just sits there and waits. It looks for account changes on the lootbox pointer, and if there are changes, it checks the lootbox pointer to see if the redeemable has been set to true, if so, it resolves it and the callback is done, and we're good. If it doesn't happen in 20 seconds, it will error out with the "Didn't get random mint" error.

``` typescript
async function awaitCallback(
  program: Program<LootboxProgram>,
  lootboxPointerAddress: anchor.web3.PublicKey,
  timeoutInterval: number,
  errorMsg = "Timed out waiting for VRF Client callback"
) {
  let ws: number | undefined = undefined
  const result: boolean = await promiseWithTimeout(
    timeoutInterval,
    new Promise((resolve: (result: boolean) => void) => {
      ws = program.provider.connection.onAccountChange(
        lootboxPointerAddress,
        async (
          accountInfo: anchor.web3.AccountInfo<Buffer>,
          context: anchor.web3.Context
        ) => {
          const lootboxPointer = await program.account.lootboxPointer.fetch(
            lootboxPointerAddress
          )

          if (lootboxPointer.redeemable) {
            resolve(true)
          }
        }
      )
    }).finally(async () => {
      if (ws) {
        await program.provider.connection.removeAccountChangeListener(ws)
      }
      ws = undefined
    }),
    new Error(errorMsg)
  ).finally(async () => {
    if (ws) {
      await program.provider.connection.removeAccountChangeListener(ws)
    }
    ws = undefined
  })

  return result
}
```

And at last, the test for minting the selected gear. It gets the lootbox pointer, gets the mint from that, and the ATA we need for it to work. Then we check to see if we had that same gear before, in case we're running this multiple times. Then we call retrieve item from lootbox, and double check to make sure the new gear amount is the previous number plus one. 

``` typescript
it("Mints the selected gear", async () => {
    const [pointerAddress] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("lootbox"), wallet.publicKey.toBuffer()],
      lootboxProgram.programId
    )

    const pointer = await lootboxProgram.account.lootboxPointer.fetch(
      pointerAddress
    )

    let previousGearCount = 0
    const gearAta = await getAssociatedTokenAddress(
      pointer.mint,
      wallet.publicKey
    )
    try {
      let gearAccount = await getAccount(provider.connection, gearAta)
      previousGearCount = Number(gearAccount.amount)
    } catch (error) {}

    await lootboxProgram.methods
      .retrieveItemFromLootbox()
      .accounts({
        mint: pointer.mint,
        userGearAta: gearAta,
      })
      .rpc()

    const gearAccount = await getAccount(provider.connection, gearAta)
    expect(Number(gearAccount.amount)).to.equal(previousGearCount + 1)
  })
})
```

Now run it all and hope it works. If it doesn't work immediately, do not be disheartened. It took a couple of days to debug it on our end. 
