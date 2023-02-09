If you’re going to build, you have to prepare to defend. In this lesson, we’ll cover basic pitfalls to look out for. This is far from a comprehensive overview of program security, but it will help you to think like an attacker and ask the important question: how do I break this?

#### 😡 Custom errors
Rust has a very powerful error handling system. You've already run into some of the rules in place and how the compiler forces you to handle unhappy paths. 

Here's how we'd create custom errors for our note taking program:
![](https://hackmd.io/_uploads/SJL604r4s.png)
```rs
use solana_program::{program_error::ProgramError};
use thiserror::Error;

#[derive(Error)]
pub enum NoteError {
  #[error("Wrong note owner")]
  Forbidden,

  #[error("Text is too long")]
  InvalidLength
}
```
The derive macro attribute takes the error trait and applies it to `NoteError` enum, giving it a default implementation to make them errors.

We'll then give each error type its own `#[error("...")]` notation to provide an error message. 

**Returning custom errors**
Errors returned by the program must be of type `ProgramError` 
use `impl` to convert our custom error and the `ProgramError` type

![](https://hackmd.io/_uploads/HkQ4-HSNi.png)

In a Solana Program we can only return errors of type `ProgramError` from the `solana_program` crate. We can implement the `From` trait to convert our custom error into a `ProgramError` type.

```rs
impl From<NoteError> for ProgramError {
    fn from(e: NoteError) -> Self {
        ProgramError::Custom(e as u32)
    }
}
```

Then when we need to actually return the error, we use the `into()` method to convert the error into an instance of `ProgramError`
```rs
if pda != *note_pda.key {
    return Err(NoteError::Forbidden.into());
}
```

#### 🔓 Basic Security
There are a few basic security measures you can take to make your program more secure:
- Ownership checks - verify an account is owned by the program
- Signer checks - verify an account has signed a transaction
- General Account Validation - verify an account is the expected account
- Data Validation - verify inputs provided by a user

Generally speaking, you should always validate the inputs you receive from a user. This is especially important when you're dealing with user-provided data. Remember - programs **don't store state**. They don't know who their owner is and they won't check who is calling them unless you tell them to.

**Ownership Checks**  
An ownership check verifies that an account is owned by the expected program. Gotta make sure only you can hit it

A user can potentially send data which matches the data struct of an account but created by a different program. 

![](https://hackmd.io/_uploads/HJKg7BHNj.png)
```rs
if note_pda.owner != program_id {
    return Err(ProgramError::InvalidNoteAccount);
}
```

**Signer checks**
A signer check simply verifies that an account has signed a transaction

![](https://hackmd.io/_uploads/r1WtXSBEj.png)

```rs
if !initializer.is_signer {
    msg!("Missing required signature");
    return Err(ProgramError::MissingRequiredSignature)
}
```
For example, we would want to verify that the note creator signed the transaction before we process the `update` instruction. Otherwise, anyone can update another user's notes by simply passing in the user's public key as the initializer.

**Data validation**
When appropriate, you should also validate instruction data provided by the client.

![](https://hackmd.io/_uploads/SJYRXHH4j.png)

For example, you may have a game program where a user can allocate character attribute points to various categories.

You may want to verify that the existing allocation of points plus the new allocation doesn't exceed a maximum
```rs
if character.agility + new_agility > 100 {
    msg!("Attribute points cannot exceed 100");
    return Err(AttributeError::TooHigh.into())
}
```
Or, the character may have an allowance of attribute points they can allocate and you want to make sure they don't exceed that allowance.

```rs
if attribute_allowance > new_agility {
    msg!("Trying to allocate more points than allowed");
    return Err(AttributeError::ExceedsAllowance.into())
}
```

**Integer overflow and underflow**
Rust integers have fixed sizes, meaning they can only support a specific range of numbers. An arithmetic operation that results in a higher or lower value than what is supported by the range will cause the resulting value to wrap around. 

![](https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Nuclear_Gandhi.png/1280px-Nuclear_Gandhi.png)

If you've ever heard of [Nuclear Ghandi](https://en.wikipedia.org/wiki/Nuclear_Gandhi) from the video game Civilization - this is what causes it. He's supposed to be a really chill and peaceful leader with a really low aggression stat. But the devs didn't validate that the stat wouldn't overflow, so it went from 0 to 255 and he became a nuclear warlord with max aggression instead. Oops.

To avoid integer overflow and underflow, either:
1. Have logic in place that ensures overflow or underflow *cannot* happen or
2. Use checked math like `checked_add` instead of `+`

```rs
let first_int: u8 = 5;
let second_int: u8 = 255;
let sum = first_int.checked_add(second_int);
```

Think of all the programs out there that aren't taking even these basic security measures. Imagine the bug bounties 🥵🤑
