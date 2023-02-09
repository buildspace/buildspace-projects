Today, we'll be writing our staking program and writing all necessary functions for staking without doing any token transfers first. I'll be walking through the process with you and explaining each steps so that you know what's going on. Let's start by going to [solana playground](https://beta.solpg.io/), click on `create a new project` and create a new folder named `src` with a file named `lib.rs` in it.

This is how your IDE should look

![](https://i.imgur.com/Pn7GlMD.png)

Now that you have everything set up, we'll proceed to create the remaining files similar to how we do it for the previous lessons. Let's go ahead and create the following 5 files in your `src` folder. The files are `entrypoint.rs`, `error.rs`, `instruction.rs`, `processor.rs`, and `state.rs`.

This is how it should look now

![](https://i.imgur.com/YBVDp9N.png)

We're all set! Now let's populate our `lib.rs` with the following code:

```rust
// Lib.rs
pub mod entrypoint;
pub mod error;
pub mod instruction;
pub mod processor;
pub mod state;
```

Go into `entrypoint.rs` and add the following code in

```rust
// Entrypoint.rs
use solana_program::{
    account_info::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey
};
use crate::processor;

// This macro will help process all incoming instructions
entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult {
    processor::process_instruction(program_id, accounts, instruction_data)?;
    Ok(())
}
```

When you run your code, you'll notice that this will throw an error because we did not define the `process_instruction` function in `processor.rs`. Let's create the function now. Head over to `processor.rs` and add the following code

```rust
// Processor.rs
use solana_program::{
    account_info::AccountInfo,
    entrypoint::ProgramResult,
    pubkey::Pubkey
};

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult {
    Ok(())
}
```

Now that we fix the error for `processor.rs`, you'll notice that there are still errors when you try to compile your code. That's because in your `lib.rs`, we are importing some of the modules that is empty. Don't worry about it though, we will fix it in the next section 😊 Before we jump into processing anything in `process_instruction`, we will need to write out our instructions in `instruction.rs`, so let's jump in and define our instructions.

Let's go ahead and create an enum `StakeInstruction` and add four instructions to it. What this basically do is to define what our instruction should do. Go ahead and copy-paste this code into your `instruction.rs`.

```rust
// Instruction.rs
use solana_program::{ program_error::ProgramError };

pub enum StakeInstruction {
    InitializeStakeAccount,
    Stake,
    Redeem,
    Unstake
}

impl StakeInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (&variant, _rest) = input.split_first().ok_or(ProgramError::InvalidInstructionData)?;
        Ok(match variant {
            0 => Self::InitializeStakeAccount,
            1 => Self::Stake,
            2 => Self::Redeem,
            3 => Self::Unstake,
            _ => return Err(ProgramError::InvalidInstructionData)
        })
    }
}
```

So let's do a break down of what we've done here. In the `instruction.rs`, we have created an enum to represent each discrete instruction and an unpack function to deserialize the data, which in this case is a single integer.

Let's jump back into `processor.rs` and define our `process_instruction` function:

```rust
// processor.rs
use solana_program:: {
    account_info:: { AccountInfo, next_account_info },
    entrypoint::ProgramResult,
    pubkey::Pubkey,
}
use crate::instruction::StakeInstruction;

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult {
    let instruction = StakeInstruction::unpack(instruction_data)?;

    match instruction {
        StakeInstruction::InitializeStakeAccount => process_initialize_stake_account(program_id, accounts),
        StakeInstruction::Stake => process_stake(program_id, accounts),
        StakeInstruction::Redeem => process_redeem(program_id, accounts),
        StakeInstruction::Unstake => process_unstake(program_id, accounts)
    }
}

/**
What this function does is to create a new PDA account that's unique to you
and your NFT. This will store the information about the state of your program
which will determine whether it's staked or not staked.
**/
fn process_initialize_stake_account(
    program_id: &Pubkey,
    accounts: &[AccountInfo]
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let user = next_account_info(account_info_iter)?;
    let nft_token = next_account_info(account_info_iter)?;
    let stake_state = next_account_info(account_info_iter)?;
    let system_program = next_account_info(account_info_iter)?;

    Ok(())
}

fn process_stake(
    program_id: &Pubkey,
    accounts: &[AccountInfo]
) -> ProgramResult {
    Ok(())
}

fn process_redeem(
    program_id: &Pubkey,
    accounts: &[AccountInfo]
) -> ProgramResult {
    Ok(())
}

fn process_unstake(
    program_id: &Pubkey,
    accounts: &[AccountInfo]
) -> ProgramResult {
    Ok(())
}
```

Notice how we have defined the variables in the `process_initialize_stake_account` function but it's not being used anywhere? That's because we need a struct to represent the current state of the program. So let's head over to `state.rs` and define our struct.

```rust
// state.rs
use borsh:: { BorshSerialize, BorshDeserialize };
use solana_program:: {
    program_pack::{ IsInitialized, Sealed },
    pubkey::Pubkey,
    clock::UnixTimestamp
};

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct UserStakeInfo {
    pub is_initialized: bool,
    pub token_account: Pubkey,
    pub stake_start_time: UnixTimestamp,
    pub last_stake_redeem: UnixTimestamp,
    pub user_pubkey: Pubkey,
    pub stake_state: StakeState,
}

impl Sealed for UserStakeInfo { }
impl IsInitialized for UserStakeInfo {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}

#[derive(BorshSerialize, BorshDeserialize, Debug, PartialEq)]
pub enum StakeState {
    Staked,
    Unstaked
}
```

#### 🚫 Custom Errors
Let's now head over to `error.rs` to define our custom error for our program.

```rust
// error.rs
use solana_program::{ program_error::ProgramError };
use thiserror::Error;

#[derive(Debug, Error)]
pub enum StakeError {
    #[error("Account not initialized yet")]
    UninitializedAccount,

    #[error("PDA derived does not equal PDA passed in")]
    InvalidPda,

    #[error("Invalid token account")]
    InvalidTokenAccount,

    #[error("Invalid stake account")]
    InvalidStakeAccount
}

impl From<StakeError> for ProgramError {
    fn from(e: StakeError) -> Self {
        ProgramError::Custom(e as u32)
    }
}
```

Awesome, now that you've successfully created the enums in `error.rs`, you should not be getting any errors when you run your program.

#### 🫙 Finalizing the code

Let's jump back into `processor.rs` and finish up the `process_initialize_stake_account` function.

```rust
// processor.rs
use solana_program::{
    account_info::{ AccountInfo, next_account_info },
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    msg,
    sysvar::{ rent::Rent, Sysvar },
    clock::Clock,
    program_pack::IsInitialized,
    system_instruction,
    program::invoke_signed,
    borsh::try_from_slice_unchecked,
    program_error::ProgramError
};
use borsh::BorshSerialize;
use crate::instruction::StakeInstruction;
use crate::error::StakeError;
use crate::state::{ UserStakeInfo, StakeState };

fn process_initialize_stake_account(
    program_id: &Pubkey,
    accounts: &[AccountInfo]
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let user = next_account_info(account_info_iter)?;
    let nft_token_account = next_account_info(account_info_iter)?;
    let stake_state = next_account_info(account_info_iter)?;
    let system_program = next_account_info(account_info_iter)?;

    let (stake_state_pda, bump_seed) = Pubkey::find_program_address(
        &[user.key.as_ref(), nft_token_account.key.as_ref()],
        program_id
    );

    // Check to ensure that you're using the right PDA
    if stake_state_pda != *stake_state.key {
        msg!("Invalid seeds for PDA");
        return Err(StakeError::InvalidPda.into());
    }

    let rent = Rent::get()?;
    let rent_lamports = rent.minimum_balance(UserStakeInfo::SIZE);

    msg!("Creating state account at {:?}", stake_state_pda);
    invoke_signed(
        &system_instruction::create_account(
            user.key,
            stake_state.key,
            rent_lamports,
            UserStakeInfo::SIZE.try_into().unwrap(),
            program_id
        ),
        &[user.clone(), stake_state.clone(), system_program.clone()],
        &[&[
            user.key.as_ref(),
            nft_token_account.key.as_ref(),
            &[bump_seed],
        ]],
    )?;

    // Let's create account
    let mut account_data = try_from_slice_unchecked::<UserStakeInfo>(&stake_state.data.borrow()).unwrap();

    if account_data.is_initialized() {
        msg!("Account already initialized");
        return Err(ProgramError::AccountAlreadyInitialized);
    }

    account_data.token_account = *nft_token_account.key;
    account_data.user_pubkey = *user.key;
    account_data.stake_state = StakeState::Unstaked;
    account_data.is_initialized = true;

    account_data.serialize(&mut &mut stake_state.data.borrow_mut()[..])?;

    Ok(())
}
```

Let's head over to `state.rs` and store the user take information with the appropriate data size. You can place this code above `impl Sealed`

```rust
// state.rs

impl UserStakeInfo {
    /**
        Here's how we determine the size of the data. In your UserStakeInfo in struct in state.rs, we have the following data.

        pub is_initialized: bool,                 // 1 bit
        pub token_account: Pubkey,                // 32 bits
        pub stake_start_time: UnixTimestamp,      // 64 bits
        pub last_stake_redeem: UnixTimestamp,     // 64 bits
        pub user_pubkey: Pubkey,                  // 32 bits
        pub stake_state: StakeState,              // 1 bit
    **/
    pub const SIZE: usize = 1 + 32 + 64 + 64 + 32 + 1;
}

```

Now that's a lot of code we just did there for `process_initialize_stake_account`. Don't worry if you don't understand anything yet. We'll be adding more code to populate the other functions. Let's move into `process_stake` function and use this code. Remember, this is only part of the code so please do not copy-paste it blindly.

```rust
// processor.rs

fn process_stake(
    program_id: &Pubkey,
    accounts: &[AccountInfo]
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let user = next_account_info(account_info_iter)?;
    let nft_token_account = next_account_info(account_info_iter)?;
    let stake_state = next_account_info(account_info_iter)?;

    let (stake_state_pda, _bump_seed) = Pubkey::find_program_address(
        &[user.key.as_ref(), nft_token_account.key.as_ref()],
        program_id,
    );

    if stake_state_pda != *stake_state.key {
        msg!("Invalid seeds for PDA");
        return Err(StakeError::InvalidPda.into());
    }

     // Let's create account
    let mut account_data = try_from_slice_unchecked::<UserStakeInfo>(&stake_state.data.borrow()).unwrap();

    if !account_data.is_initialized() {
        msg!("Account not initialized");
        return Err(ProgramError::UninitializedAccount.into());
    }

    let clock = Clock::get()?;

    account_data.token_account = *nft_token_account.key;
    account_data.user_pubkey = *user.key;
    account_data.stake_state = StakeState::Staked;
    account_data.stake_start_time = clock.unix_timestamp;
    account_data.last_stake_redeem = clock.unix_timestamp;
    account_data.is_initialized = true;

    account_data.serialize(&mut &mut stake_state.data.borrow_mut()[..])?;

    Ok(())
}
```

That's it! We now have completed our `process_stake` function. Let's move on to `process_redeem` now. The code will be fairly similar to the first 2 functions.

```rust
// process.rs

fn process_redeem(
    program_id: &Pubkey,
    accounts: &[AccountInfo]
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let user = next_account_info(account_info_iter)?;
    let nft_token_account = next_account_info(account_info_iter)?;
    let stake_state = next_account_info(account_info_iter)?;

    let (stake_state_pda, _bump_seed) = Pubkey::find_program_address(
        &[user.key.as_ref(), nft_token_account.key.as_ref()],
        program_id,
    );

    if stake_state_pda != *stake_state.key {
        msg!("Invalid seeds for PDA");
        return Err(StakeError::InvalidPda.into());
    }

    // For verification, we need to make sure it's the right signer
    if !user.is_signer {
        msg!("Missing required signature");
        return Err(ProgramError::MissingRequiredSignature);
    }

     // Let's create account
    let mut account_data = try_from_slice_unchecked::<UserStakeInfo>(&stake_state.data.borrow()).unwrap();

    if !account_data.is_initialized() {
        msg!("Account not initialized");
        return Err(ProgramError::UninitializedAccount.into());
    }

    if account_data.stake_state != StakeState::Staked {
        msg!("Stake account is not staking anything");
        return Err(ProgramError::InvalidArgument);
    }

    if *user.key != account_data.user_pubkey {
        msg!("Incorrect stake account for user");
        return Err(StakeError::InvalidStakeAccount.into());
    }

    if *nft_token_account.key != account_data.token_account {
        msg!("NFT Token account do not match");
        return Err(StakeError::InvalidTokenAccount.into());
    }

    let clock = Clock::get()?;
    let unix_time = clock.unix_timestamp - account_data.last_stake_redeem;
    let redeem_amount = unix_time;
    msg!("Redeeming {} tokens", redeem_amount);

    account_data.last_stake_redeem = clock.unix_timestamp;
    account_data.serialize(&mut &mut stake_state.data.borrow_mut()[..])?;

    Ok(())
}
```

Awesome! We're almost there now. Moving onto the last function `process_unstake`.

```rust
// process.rs

fn process_unstake(
    program_id: &Pubkey,
    accounts: &[AccountInfo]
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let user = next_account_info(account_info_iter)?;
    let nft_token_account = next_account_info(account_info_iter)?;
    let stake_state = next_account_info(account_info_iter)?;

    let (stake_state_pda, _bump_seed) = Pubkey::find_program_address(
        &[user.key.as_ref(), nft_token_account.key.as_ref()],
        program_id,
    );

    if stake_state_pda != *stake_state.key {
        msg!("Invalid seeds for PDA");
        return Err(StakeError::InvalidPda.into());
    }

    // For verification, we need to make sure it's the right signer
    if !user.is_signer {
        msg!("Missing required signature");
        return Err(ProgramError::MissingRequiredSignature);
    }

     // Let's create account
    let mut account_data = try_from_slice_unchecked::<UserStakeInfo>(&stake_state.data.borrow()).unwrap();

    if !account_data.is_initialized() {
        msg!("Account not initialized");
        return Err(ProgramError::UninitializedAccount.into());
    }

    if account_data.stake_state != StakeState::Staked {
        msg!("Stake account is not staking anything");
        return Err(ProgramError::InvalidArgument)
    }

    let clock = Clock::get()?;
    let unix_time = clock.unix_timestamp - account_data.last_stake_redeem;
    let redeem_amount = unix_time;
    msg!("Redeeming {} tokens", redeem_amount);

    msg!("Setting stake state to unstaked");
    account_data.stake_state = StakeState::Unstaked;
    account_data.serialize(&mut &mut stake_state.data.borrow_mut()[..]);

    Ok(())
}
```

LFG!!! We are finally done with all the function definitions. Now if you run the program, it should say `Build successful`. Awesome! We're all done with week 3! HALFWAYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
