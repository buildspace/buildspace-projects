We're starting from the ground up. The first Solana program we interacted with was the Ping program. Let's build it out from scratch using Anchor. You *can* do this on the playground, but I'll set it up locally cuz testing is easier.

What we wanna make is a pretty simple program:
- has one account
- stores a count of how many times a certain instruction has been called. 

This means we'll need two instructions, one to initialize that account and its data structure, and a second instruction to increment the count.


**Add `initialize` instruction**
- Within `#[program]`, implement `initialize` instruction
- `initialize`requires a `Context` of type `Initialize`and takes no additional instruction data
- In the instruction logic, set the `counter` account’s `count` field to `0`

```rs
pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = 0;
        msg!("Counter Account Created");
        msg!("Current Count: { }", counter.count);
        Ok(())
    }
```

**Implement `Context` type `Initialize`**
- Use the `#[derive(Accounts)]` macro to implement the `Initialize` `Context` type
- The `initialize` instruction requires:
    - `counter` - the counter account initialized in the instruction
    - `user` - payer for the initialization
    - `system_program` - the system program is required for the initialization of any new accounts
- Specify the Account types for account validation
- Use  the #[account(..)] attribute to define additional constraints

```rs
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 8)]
    pub counter: Account<'info, Counter>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}
```

**Implement `Counter`**
Use the #[account] attribute to define a new Counter account type
```rs
#[account]
pub struct Counter {
    pub count: u64,
}
```

**Add `increment` instruction**
- Within `#[program]`, implement an `increment`instruction to increment the `count` on an existing `counter` account
- `increment` requires a `Context` of type `Update` and takes no additional instruction data
- In the instruction logic, increment an existing counter account’s count field by 1

```rs
pub fn increment(ctx: Context<Update>) -> Result<()> {
    let counter = &mut ctx.accounts.counter;
    msg!("Previous Count: { }", counter.count);
    counter.count = counter.count.checked_add(1).unwrap();
    msg!("Counter Incremented");
    msg!("Current Count: { }", counter.count);
    Ok(())
}
```

**Implement `Context` type `Update`**
- Use the `#[derive(Accounts)]` macro to implement the `Update` `Context` type
- The `increment` instruction requires:
    - `counter` - an existing counter account to increment
    - `user` - payer for the transaction fee
- Specify the Account types for account validation
- Use  the #[account(..)] attribute to define additional constraints
```rs
#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub counter: Account<'info, Counter>,
    pub user: Signer<'info>,
}
```

**Build, Deploy, Test**
Solution: [https://beta.solpg.io/631b39c677ea7f12846aee8c](https://beta.solpg.io/631b39c677ea7f12846aee8c)
- build and deploy
- test using SolPG (Anchor testing supported)

#### 🚢 Ship challenge
Alright, time to put your skills to work and build something independently.

**Overview**
Because we're starting with very simple programs, yours will look almost identical to what we just created. It's useful to try and get to the point where you can write it from scratch without referencing prior code, so try not to copy and paste here.

**Action Steps**
1. Write a new program that initializes a `counter` account and set the `count` field using the an instruction data argument passed into the instruction.
2. Implement `initialize`, `increment` and `decrement` instructions
3. Following what we did in the demo, write testes for each instruction
4. Use `anchor deploy` to deploy your program. If you’re up for it, write a script like we’ve done previously to send transactions to your newly deployed program, then use Solana Explorer to look at the program logs.

As always, get creative with these challenges and take them beyond the basic instructions if you want - and have fun!

**Hints**
Try to do this independently if you can! But if you get stuck, feel free to reference the solution-decrement branch of [this repository](https://github.com/buildspace/anchor-counter-program/tree/solution-decrement).

