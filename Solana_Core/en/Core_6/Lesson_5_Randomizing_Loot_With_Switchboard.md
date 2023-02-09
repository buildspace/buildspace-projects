
Now we'll walk through the solution for the simple loot box implementation. We will create a new program, use it for creating a loot box, and retrieving an item from the loot box.

The solution code we'll be reviewing is one the solution-naive-loot-boxes branch of the [Anchor NFT Staking repository](https://github.com/Unboxed-Software/anchor-nft-staking-program/tree/solution-naive-loot-boxes).

I'll suggest it again, try to do his on your own instead of copy-pasting solution code.

While in the `programs` directory, you can use `anchor new <program-name>` to create a new program, we called it `lootbox-program`.

If you have a look, in the `Anchor.toml` file the ID for the nft-staking program is changed, and we added an ID for the loot box program. You need to update both of these on your end.

First, let's review the changes we made to the [original staking program](https://github.com/Unboxed-Software/anchor-nft-staking-program/blob/solution-naive-loot-boxes/programs/anchor-nft-staking/src/lib.rs).

If you scroll down to the `UserStakeInfo` object, we added the `total_earned` field. This basically tracks the user's staking journey, as they earn more over time, and as they hit new milestones that will earn them more loot box items.

Related to that, have a look at the `redeem_amount`. 

First you'll notice there are commented out notes, this is simply so we have enough tokens redeemed for testing purposes. Make sure comment/uncomment the right code for testing.

Scrolling down a bit further, you'll see this new line added.

`ctx.accounts.stake_state.total_earned += redeem_amount as u64;`

This is a way to track total earned, which starts at 0. Then you add the amount redeemed, which is the new total earned. 

You'll also see both the testing notes and the redeem amount change in the unstake function below.

Finally, one last change in this file. If your program is identical to mine, as we run this, we run out of space in the stack, simply due to adding this one new field. I chose a random account, and put a Box around it, to make sure it is allocated to the heap, instead of the stack, to address this space issue. You can do it on the user stake ATA, or any other account of your choosing.

`pub user_stake_ata: Box<Account<'info, TokenAccount>>,`

Alright, let's go into the files for the new lootbox program.

In the `Cargo.toml` you'll notice we added a new dependency for our original anchor-nft-staking program.

```
[dependencies]
anchor-lang = { version="0.25.0", features=["init-if-needed"] }
anchor-spl = "0.25.0"
anchor-nft-staking = { path = "../anchor-nft-staking", features = ["cpi"] }
```

Now let's hop into the main [loot box program](https://github.com/Unboxed-Software/anchor-nft-staking-program/blob/solution-naive-loot-boxes/programs/lootbox-program/src/lib.rs) file.

You'll notice in the use statements, we now import anchor nft staking, so we can check the total earned field.

``` rust
use anchor_lang::prelude::*;
use anchor_nft_staking::UserStakeInfo;
use anchor_spl::token;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Burn, Mint, MintTo, Token, TokenAccount},
};
```

In here, we have only two instructions, `open_lootbox` and `retrieve_item_from_lootbox`. The reason we have two is that when you say, give me something random from the loot box, and the program is deciding which of all the possible things to mint and give, then the client would have to pass in all of the possible mint accounts. This would make the program less dyanamic and add some overhead of checking a bunch of different accounts to make sure there are options, it's also really annoying on the client side. So, we created one for open loot box, which basically make sure that of all the possible mint options, give me one of them. We also chose this as the place to pay, this is where we will burn BLD tokens. As for the second instruction, at this point the client knows which mint they're getting, and can pass that in, and we can mint from that.

First, let's go through open lootbox, here are the accounts we need.

``` rust 
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
    pub lootbox_pointer: Account<'info, LootboxPointer>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    // Swap the next two lines out between prod/testing
    // #[account(mut)]
    #[account(
        mut,
        address="6YR1nuLqkk8VC1v42xJaPKvE9X9pnuqVAvthFUSDsMUL".parse::<Pubkey>().unwrap()
    )]
    pub stake_mint: Account<'info, Mint>,
    #[account(
        mut,
        associated_token::mint=stake_mint,
        associated_token::authority=user
    )]
    pub stake_mint_ata: Account<'info, TokenAccount>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    #[account(
        constraint=stake_state.user_pubkey==user.key(),
    )]
    pub stake_state: Account<'info, UserStakeInfo>,
}
```

You'll notice a new one called `lootbox_pointer`, it is a new type. It has a mint, a boolean of whether it is claimed or not, and is_initialized. 

This is a PDA that is associated with the user, hence "lootbox" and `user` are its seeds. What this lets us do is that when we choose a mint, we can't return data to the client, instead we store it in the account somewhere. So, it is a PDA that the user can look at to retrieve their item.

Another thing of note, there's a line that starts with 'Swap' commented out, in order for the tests to work, uncomment these and comment out the other `stake_mint` attribute with the mind address in it.

``` rust
#[account]
pub struct LootboxPointer {
    mint: Pubkey,
    claimed: bool,
    is_initialized: bool,
}
```

Let's look at the instruction, first we check to see if it's a valid loot box.

They pass in a box number, and the instruction runs an infinite loop where for each iteration, if the number of BLD tokens it too low, we error. The other two paths are the that we either double the loot_box number, or (middle option) if we match on our loot_box number and box_number, we require the stake_state PDA's total earned is greater than or equal to the box_number that was passed in -- you'll have to have earned more than box number.

``` rust 
pub fn open_lootbox(ctx: Context<OpenLootbox>, box_number: u64) -> Result<()> {
    let mut loot_box = 10;
    loop {
        if loot_box > box_number {
            return err!(LootboxError::InvalidLootbox);
        }

        if loot_box == box_number {
            require!(
                ctx.accounts.stake_state.total_earned >= box_number,
                LootboxError::InvalidLootbox
            );
            break;
        } else {
            loot_box = loot_box * 2;
        }
    }

    require!(
        !ctx.accounts.lootbox_pointer.is_initialized || ctx.accounts.lootbox_pointer.claimed,
        LootboxError::InvalidLootbox
    );
```

Then we move on to the token burn, and burn the number of tokens that the box_number requires.

``` rust
    token::burn(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Burn {
                mint: ctx.accounts.stake_mint.to_account_info(),
                from: ctx.accounts.stake_mint_ata.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            },
        ),
        box_number * u64::pow(10, 2),
    )?;
```

Next we say, this is the available gear. This is hard-coded for now, this is the data in the `cache.json` file on the client side code. There are more dynamic ways to do this.

``` rust
    let available_gear: Vec<Pubkey> = vec![
        "DQmrQJkErmfe6a1fD2hPwdLSnawzkdyrKfSUmd6vkC89"
            .parse::<Pubkey>()
            .unwrap(),
        "A26dg2NBfGgU6gpFPfsiLpxwsV13ZKiD58zgjeQvuad"
            .parse::<Pubkey>()
            .unwrap(),
        "GxR5UVvQDRwB19bCsB1wJh6RtLRZUbEAigtgeAsm6J7N"
            .parse::<Pubkey>()
            .unwrap(),
        "3rL2p6LsGyHVn3iwQQYV9bBmchxMHYPice6ntp7Qw8Pa"
            .parse::<Pubkey>()
            .unwrap(),
        "73JnegAtAWHmBYL7pipcSTpQkkAx77pqCQaEys2Qmrb2"
            .parse::<Pubkey>()
            .unwrap(),
    ];
```

Then there's this pseudo-random thing, definitely not safe. We get the time, in seconds, then modulus over 5, to figure out which of those 5 items we should get. Once we get it, we assign it to the lootbox pointer.

``` rust

    let clock = Clock::get()?;
    let i: usize = (clock.unix_timestamp % 5).try_into().unwrap();
    // Add in randomness later for selecting mint
    let mint = available_gear[i];
    ctx.accounts.lootbox_pointer.mint = mint;
    ctx.accounts.lootbox_pointer.claimed = false;
    ctx.accounts.lootbox_pointer.is_initialized = true;

    Ok(())
}
```

We will work on actual randomness later, but this is sufficient for now. We will want to add a check later, to ensure they can't just open loot box over and over again, to get the item they prefer. As it is now, once they open the loot box, they can see what the item is. We can do a check to see if the lootbox pointer is initialized, if it is not, then we're good and can move forward. While they would be paying for each attempt, it's up to you if you want that to be a feature.


Alright, let's hop over to the retrieve instruction and look at the accounts needed.

``` rust 
#[derive(Accounts)]
pub struct RetrieveItem<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        seeds=["lootbox".as_bytes(), user.key().as_ref()],
        bump,
        constraint=lootbox_pointer.is_initialized
    )]
    pub lootbox_pointer: Account<'info, LootboxPointer>,
    #[account(
        mut,
        constraint=lootbox_pointer.mint==mint.key()
    )]
    pub mint: Account<'info, Mint>,
    #[account(
        init_if_needed,
        payer=user,
        associated_token::mint=mint,
        associated_token::authority=user
    )]
    pub user_gear_ata: Account<'info, TokenAccount>,
    /// CHECK: Mint authority - not used as account
    #[account(
        seeds=["mint".as_bytes()],
        bump
    )]
    pub mint_authority: UncheckedAccount<'info>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
```

A couple of things of note. The mint account is for the gear they're claiming. The mint authority is the mint PDA we assigned in our client-side script. 

As for the logic for this. First we require that the lootbox pointer is not already claimed.

``` rust 
pub fn retrieve_item_from_lootbox(ctx: Context<RetrieveItem>) -> Result<()> {
    require!(
        !ctx.accounts.lootbox_pointer.claimed,
        LootboxError::AlreadyClaimed
    );
```

We then mint it to you.
``` rust
    token::mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.user_gear_ata.to_account_info(),
                authority: ctx.accounts.mint_authority.to_account_info(),
            },
            &[&[
                b"mint".as_ref(),
                &[*ctx.bumps.get("mint_authority").unwrap()],
            ]],
        ),
        1,
    )?;
```

Finally, we set claimed to true.

``` rust
    ctx.accounts.lootbox_pointer.claimed = true;

    Ok(())
}
```

Make sure you don't miss the code for the custom errors we created at the bttom of the file.

``` rust 
#[error_code]
enum LootboxError {
    #[msg("Mint already claimed")]
    AlreadyClaimed,

    #[msg("Haven't staked long enough for this loot box or invalid loot box number")]
    InvalidLootbox,
}
```

That's about it. If you've not already implemented this, have a go at it, get some tests running. Try to do it independently. 

A brief look at the tests, they're all in a [single file](https://github.com/Unboxed-Software/anchor-nft-staking-program/blob/solution-naive-loot-boxes/tests/anchor-nft-staking.ts). You'll notice we added two more, "Chooses a mint pseudorandomly" and "Mints the selected gear". Reminder, go to the places we had 'Swap' and change the lines of code for the tests to work. Then run the tests, they should all be working as expected. 

### Randomize loot with Switchboard's verified 🔀

**Task**
Now that you’ve got simple loot boxes working, let’s see if we can level up with true randomness using Switchboard (well, technically still pseudorandom but multiple orders of magnitude better).

Switchboard is a decentralized oracle network built on Solana. An oracle is a gateway between blockchains and the real world, providing mechanisms to arrive at a consensus for data given multiple sources. In the case of randomness, that means providing a verifiable pseudorandom result that you simply can’t get without an oracle. This is key to having a loot box implementation that can’t be “cheated.”

Interacting with an Oracle is an exercise that brings together literally everything we’ve learned throughout this course. You typically need the following flow:

Some sort of client-side setup directly with the oracle programInitialization of oracle-specific accounts (usually PDAs) with your own program. A CPI call from your program to the oracle program that requests specific data. In this case, a verifiably random buffer. An instruction that the oracle can call on your program to deliver the requested information. An instruction that does whatever your program is trying to do with the requested data

**Documentation**
So, first things first. Documentation is still sparse across Web3, but you can read a brief overview about Switchboard’s Verifiable Randomness [here](https://docs.switchboard.xyz/solana/randomness). Then you should read through their [Integration docs](https://docs.switchboard.xyz/solana/randomness/integration).

You’ll likely still come away from that with a lot of questions. That’s okay. Don’t feel demoralized. We’re flexing some necessary “figure-it-out” muscles.

The next thing you can do is look at their [step by step walkthrough](https://github.com/switchboard-xyz/vrf-demo-walkthrough) for getting randomness. This will take you through the process of setting up a switchboard environment, initializing your requesting client, issuing a CPI to the `request_randomness` instruction, adding a `consume_randomness` instruction to your program that Switchboard can invoke to provide randomness, and more.

**Final note**
This is going to be challenging. It’s meant to be. It’s the culmination of a lot of work trying to understand Solana over the last six weeks. There are videos with an overview of using Switchboard in our loot box program.

Feel free to watch them right away. Normally I tell you to wait until you've done some independent work, but the documentation on Switchboard is sparse enough that it'll be helpful to view the walkthrough ASAP. What I will say though is to not copy and past my solution. Instead, watch the walkthrough and then try to recreate something similar on your own. If you are ready to reference solution code before we have the walkthrough up, feel free to look at the `solution-randomize-lootbranch` [here](https://github.com/Unboxed-Software/anchor-nft-staking-program/tree/solution-randomize-loot).

You might not get this working before the end of the week. This is doable, but may take more time hacking this week than you have. That’s okay. You can still ship with your simple pseudorandom solution from before and then retrofit with more robust randomness later. Just create a new branch and do your best with Switchboard. 

You’ve got this. Good luck!
