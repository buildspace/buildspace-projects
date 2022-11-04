Time to make sure no one can mess with our Solana Movie Database (SMDB) program. We'll add some basic security measures, do some input validation, and add a `update_movie_review` instruction.

I'll get you started in a single click, check out this [Playground setup](https://beta.solpg.io/6322684077ea7f12846aee91).

The complete file structure is as follows:
- **lib.rs** - register modules
- **entrypoint.rs -** entry point to the program
- **instruction.rs -** serialize and deserialize instruction data
- **processor.rs -** program logic to process instructions
- **state.rs -** serialize and deserialize state
- **error.rs -** custom program errors

**Note changes in starter code compared to ending of “State Management”**  
In `processor.rs`:
- `account_len` in the `add_movie_review` function is changed to a fixed size of `1000`
- This way, we don’t have to worry about reallocating size or re-calculating rent when a user updates their movie review.

```rs
// from this
let account_len: usize = 1 + 1 + (4 + title.len()) + (4 + description.len());

// to this
let account_len: usize = 1000;
```

In `state.rs`
- implement `is_initialized` function that checks the `is_initialized` field on the `MovieAccountState` struct.
- implemented `Sealed` for `MovieAccountState`, which specifies that `MovieAccountState` has a known size and provides for some compiler optimizations.

```rs
// inside state.rs
impl Sealed for MovieAccountState {}

impl IsInitialized for MovieAccountState {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}
```

Let's start with some custom errors!

We'll need errors that we can use in the following situations:
- The update instruction has been invoked on an account that hasn't been initialized yet
- The provided PDA doesn't match the expected or derived PDA
- The input data is larger than the program allows
- The rating provided does not fall in the 1-5 range

In `error.rs`:
- create `ReviewError` enum
- implement conversion to `ProgramError`

```rs
// inside error.rs
use solana_program::{program_error::ProgramError};
use thiserror::Error;

#[derive(Debug, Error)]
pub enum ReviewError{
    // Error 0
    #[error("Account not initialized yet")]
    UninitializedAccount,
    // Error 1
    #[error("PDA derived does not equal PDA passed in")]
    InvalidPDA,
    // Error 2
    #[error("Input data exceeds max length")]
    InvalidDataLength,
    // Error 3
    #[error("Rating greater than 5 or less than 1")]
    InvalidRating,
}

impl From<ReviewError> for ProgramError {
    fn from(e: ReviewError) -> Self {
        ProgramError::Custom(e as u32)
    }
}
```

Head over to `processor.rs` and bring `ReviewError` into scope.

```rs
// inside processor.rs
use crate::error::ReviewError;
```

Next we'll add security checks to the `add_movie_review` function.

**Signer check**
- ensure that the `initializer` of a review is also a signer on the transaction.
```rs
let account_info_iter = &mut accounts.iter();

let initializer = next_account_info(account_info_iter)?;
let pda_account = next_account_info(account_info_iter)?;
let system_program = next_account_info(account_info_iter)?;

// add check here
if !initializer.is_signer {
    msg!("Missing required signature");
    return Err(ProgramError::MissingRequiredSignature)
}
```

**Account validation**
- make sure the `pda_account` passed in by the user is the `pda` we expect
```rs
let (pda, bump_seed) = Pubkey::find_program_address(&[initializer.key.as_ref(), title.as_bytes().as_ref(),], program_id);
if pda != *pda_account.key {
    msg!("Invalid seeds for PDA");
    return Err(ProgramError::InvalidArgument)
}
```

**Data validation**
- making sure `rating` falls within the 1 to 5 scale. We don't want 0 or 69 star reviews lol
```rs
if rating > 5 || rating < 1 {
    msg!("Rating cannot be higher than 5");
    return Err(ReviewError::InvalidRating.into())
}
```
- let’s also check that the content of the review does not exceed the allocated space
```rs
let total_len: usize = 1 + 1 + (4 + title.len()) + (4 + description.len());
if total_len > 1000 {
    msg!("Data length is larger than 1000 bytes");
    return Err(ReviewError::InvalidDataLength.into())
}
```

#### ⬆ Update movie review
And now for the fun part! Let's add the `update_movie_review` instruction.

We'll start by updating the `MovieInstruction` enum in the `instruction.rs` file:
```rs
// inside instruction.rs
pub enum MovieInstruction {
    AddMovieReview {
        title: String,
        rating: u8,
        description: String
    },
    UpdateMovieReview {
        title: String,
        rating: u8,
        description: String
    }
}
```
The Payload struct can stay the same since aside from the variant type, the instruction data is the same as what we used for `AddMovieReview`.

We'll also need to add this new variant to the `unpack` function in the same file:
```rs
// inside instruction.rs
impl MovieInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (&variant, rest) = input.split_first().ok_or(ProgramError::InvalidInstructionData)?;
        let payload = MovieReviewPayload::try_from_slice(rest).unwrap();
        Ok(match variant {
            0 => Self::AddMovieReview {
                title: payload.title,
                rating: payload.rating,
                description: payload.description },
            1 => Self::UpdateMovieReview {
                title: payload.title,
                rating: payload.rating,
                description: payload.description },
            _ => return Err(ProgramError::InvalidInstructionData)
        })
    }
}
```

Finally, let's add the `update_movie_review` to the match statement in the `process_instruction` function:
```rs
// inside processor.rs
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult {
    // unpack instruction data
    let instruction = MovieInstruction::unpack(instruction_data)?;
    match instruction {
        MovieInstruction::AddMovieReview { title, rating, description } => {
            add_movie_review(program_id, accounts, title, rating, description)
        },
        // add UpdateMovieReview to match against our new data structure
        MovieInstruction::UpdateMovieReview { title, rating, description } => {
            // make call to update function that we'll define next
            update_movie_review(program_id, accounts, title, rating, description)
        }
    }
}
```

Quick recap of all the places we had to update to add a new instruction:
1. `instruction.rs`:
    - add new variant to `MovieInstruction` enum
    - add new variant to `unpack` function
    - (optional) - add new payload struct
2. `processor.rs`:
    - add new variant to `process_instruction` match statement

And now we're ready to write the actual `update_movie_review` function!

We'll start by iterating through the accounts:
```rs
pub fn update_movie_review(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    _title: String,
    rating: u8,
    description: String
) -> ProgramResult {
    msg!("Updating movie review...");

    // Get Account iterator
    let account_info_iter = &mut accounts.iter();

    // Get accounts
    let initializer = next_account_info(account_info_iter)?;
    let pda_account = next_account_info(account_info_iter)?;
		
		Ok(())
}
```

This is a good time to check that the `pda_account.owner` is the same as the `program_id`:
```rs
if pda_account.owner != program_id {
    return Err(ProgramError::IllegalOwner)
}
```

Next we'll check that the signer is the same as the initializer:
```rs
if !initializer.is_signer {
    msg!("Missing required signature");
    return Err(ProgramError::MissingRequiredSignature)
}
```

Now we can unpack the data from the `pda_account`:
```rs
msg!("unpacking state account");
let mut account_data = try_from_slice_unchecked::<MovieAccountState>(&pda_account.data.borrow()).unwrap();
msg!("borrowed account data");
```

Final bit of validation on this fresh new data:
```rs
// Derive PDA and check that it matches client
let (pda, _bump_seed) = Pubkey::find_program_address(&[initializer.key.as_ref(), account_data.title.as_bytes().as_ref(),], program_id);

if pda != *pda_account.key {
    msg!("Invalid seeds for PDA");
    return Err(ReviewError::InvalidPDA.into())
}

if !account_data.is_initialized() {
    msg!("Account is not initialized");
    return Err(ReviewError::UninitializedAccount.into());
}

if rating > 5 || rating < 1 {
    msg!("Rating cannot be higher than 5");
    return Err(ReviewError::InvalidRating.into())
}

let total_len: usize = 1 + 1 + (4 + account_data.title.len()) + (4 + description.len());
if total_len > 1000 {
    msg!("Data length is larger than 1000 bytes");
    return Err(ReviewError::InvalidDataLength.into())
}
```

Phew, that's a whole lotta checks. Got me feeling like a bank teller lol

The last bit is to update the account info and serialize it to account:
```rs
account_data.rating = rating;
account_data.description = description;

account_data.serialize(&mut &mut pda_account.data.borrow_mut()[..])?;
```

WE DID IT! We've added a new instruction to our program and made it hella secure. Let's test it out!

BUILD -> UPGRADE -> COPY ADDRESS -> PASTE INTO FRONT-END 
```
git clone https://github.com/buildspace/solana-movie-frontend/
cd solana-movie-frontend
git checkout solution-update-reviews
npm install
```

Your front-end should now be displaying reviews! You can add a review and update your old ones!

#### 🚢 Ship challenge
Now it’s your turn to build something independently by building on top of the Student Intro program that you've used in previous lessons.

The Student Intro program is a Solana Program that lets students introduce themselves. The program takes a user's name and a short message as the `instruction_data` and creates an account to store the data on-chain.

Using what you've learned in this lesson, try applying what you've learned to the Student Intro Program. The program should:

1. Add an instruction allowing students to update their message
2. Implement the basic security checks we've learned in this lesson

Feel free to use [this starter code](https://beta.solpg.io/62b11ce4f6273245aca4f5b2).

Try to do this independently if you can! But if you get stuck, feel free to reference the [solution code](https://beta.solpg.io/62c9120df6273245aca4f5e8). Note that your code may look slightly different than the solution code depending on the checks you implement and the errors you write.
