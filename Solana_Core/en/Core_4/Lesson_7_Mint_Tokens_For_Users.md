Our movie review program is decent, but it's not very web3. All we're doing right now is using Solana as a database. Let's spice it up by giving people tokens for using our app! We'll mint tokens to someone every time they review a movie or leave a comment. Think of it like StackOverflow but with tokens instead of upvotes.

You can pick up where you left off in your last local environment, or set up a new one by copying [this](https://beta.solpg.io/6313104b88a7fca897ad7d19) or:
```
git clone https://github.com/buildspace/solana-movie-program/
cd solana-movie-program
git checkout solution-add-comments
npm i
```

We'll be using the SPL token program to make all of this magic happen so go ahead and update the dependencies in `Cargo.toml`:
```toml
[dependencies]
solana-program = "~1.10.29"
borsh = "0.9.3"
thiserror = "1.0.31"
spl-token = { version="3.2.0", features = [ "no-entrypoint" ] }
spl-associated-token-account = { version="=1.0.5", features = [ "no-entrypoint" ] }
```

Let's quickly test out that everything builds with these new dependencies with `cargo build-bpf`.

We're ready to get building!

#### 🤖 Set up the token mint
We'll start by creating a token mint. Reminder: a token mint is a special account that holds data about our token.

This is a new instruction, so we'll follow the same steps as we did when we added support for comments:
1. Update the instruction enum
2. Update the unpack function
3. Update the `process_instruction` funciton

From the top in `instruction.rs`, we've got the enum update:
```rs
pub enum MovieInstruction {
    AddMovieReview {
        title: String,
        rating: u8,
        description: String,
    },
    UpdateMovieReview {
        title: String,
        rating: u8,
        description: String,
    },
    AddComment {
        comment: String,
    },
    InitializeMint,
}
```

We won't need any fields here - all it takes to call that function is addresses!

Next, we'll update the unpack function:
```rs
impl MovieInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (&variant, rest) = input
            .split_first()
            .ok_or(ProgramError::InvalidInstructionData)?;
        Ok(match variant {
            0 => {
                let payload = MovieReviewPayload::try_from_slice(rest).unwrap();
                Self::AddMovieReview {
                    title: payload.title,
                    rating: payload.rating,
                    description: payload.description,
                }
            }
            1 => {
                let payload = MovieReviewPayload::try_from_slice(rest).unwrap();
                Self::UpdateMovieReview {
                    title: payload.title,
                    rating: payload.rating,
                    description: payload.description,
                }
            }
            2 => {
                let payload = CommentPayload::try_from_slice(rest).unwrap();
                Self::AddComment {
                    comment: payload.comment,
                }
            }
            // New variant added here
            3 => Self::InitializeMint,
            _ => return Err(ProgramError::InvalidInstructionData),
        })
    }
}
```

You'll immediately notice an error in the `process_instruction` match statement in `processor.rs` since we're not handling all the cases. Let's fix this by bringing in our new SPL imports and adding to the match statement:
```rs
// Update imports at the top
use solana_program::{
    //Existing imports within solana_program

    sysvar::{rent::Rent, Sysvar, rent::ID as RENT_PROGRAM_ID},
    native_token::LAMPORTS_PER_SOL,
    system_program::ID as SYSTEM_PROGRAM_ID
}
use spl_associated_token_account::get_associated_token_address;
use spl_token::{instruction::initialize_mint, ID as TOKEN_PROGRAM_ID};

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction = MovieInstruction::unpack(instruction_data)?;
    match instruction {
        MovieInstruction::AddMovieReview {
            title,
            rating,
            description,
        } => add_movie_review(program_id, accounts, title, rating, description),
        MovieInstruction::UpdateMovieReview {
            title,
            rating,
            description,
        } => update_movie_review(program_id, accounts, title, rating, description),
        MovieInstruction::AddComment { comment } => add_comment(program_id, accounts, comment),
        // New instruction handled here to initialize the mint account
        MovieInstruction::InitializeMint => initialize_token_mint(program_id, accounts),
    }
}
// Rest of the file remains the same
```

Finally, we can implement the `initialize_token_mint` account at the bottom of `processor.rs` after the `add_comment` function:
```rs
pub fn initialize_token_mint(program_id: &Pubkey, accounts: &[AccountInfo]) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();

    // The order of accounts is not arbitrary, the client will send them in this order
    // Whoever sent in the transaction
    let initializer = next_account_info(account_info_iter)?;
    // Token mint PDA - derived on the client
    let token_mint = next_account_info(account_info_iter)?;
    // Token mint authorirty (this should be you)
    let mint_auth = next_account_info(account_info_iter)?;
    // System program to create a new account
    let system_program = next_account_info(account_info_iter)?;
    // Solana Token program address
    let token_program = next_account_info(account_info_iter)?;
    // System account to calcuate the rent
    let sysvar_rent = next_account_info(account_info_iter)?;

    // Derive the mint PDA again so we can validate it
    // The seed is just "token_mint"
    let (mint_pda, mint_bump) = Pubkey::find_program_address(&[b"token_mint"], program_id);
    // Derive the mint authority so we can validate it
    // The seed is just "token_auth"
    let (mint_auth_pda, _mint_auth_bump) =
        Pubkey::find_program_address(&[b"token_auth"], program_id);

    msg!("Token mint: {:?}", mint_pda);
    msg!("Mint authority: {:?}", mint_auth_pda);

    // Validate the important accounts passed in
    if mint_pda != *token_mint.key {
        msg!("Incorrect token mint account");
        return Err(ReviewError::IncorrectAccountError.into());
    }

    if *token_program.key != TOKEN_PROGRAM_ID {
        msg!("Incorrect token program");
        return Err(ReviewError::IncorrectAccountError.into());
    }

    if *mint_auth.key != mint_auth_pda {
        msg!("Incorrect mint auth account");
        return Err(ReviewError::IncorrectAccountError.into());
    }

    if *system_program.key != SYSTEM_PROGRAM_ID {
        msg!("Incorrect system program");
        return Err(ReviewError::IncorrectAccountError.into());
    }

    if *sysvar_rent.key != RENT_PROGRAM_ID {
        msg!("Incorrect rent program");
        return Err(ReviewError::IncorrectAccountError.into());
    }

    // Calculate the rent
    let rent = Rent::get()?;
    // We know the size of a mint account is 82 (remember it lol)
    let rent_lamports = rent.minimum_balance(82);

    // Create the token mint PDA
    invoke_signed(
        &system_instruction::create_account(
            initializer.key,
            token_mint.key,
            rent_lamports,
            82, // Size of the token mint account
            token_program.key,
        ),
        // Accounts we're reading from or writing to 
        &[
            initializer.clone(),
            token_mint.clone(),
            system_program.clone(),
        ],
        // Seeds for our token mint account
        &[&[b"token_mint", &[mint_bump]]],
    )?;

    msg!("Created token mint account");

    // Initialize the mint account
    invoke_signed(
        &initialize_mint(
            token_program.key,
            token_mint.key,
            mint_auth.key,
            Option::None, // Freeze authority - we don't want anyone to be able to freeze!
            9, // Number of decimals
        )?,
        // Which accounts we're reading from or writing to
        &[token_mint.clone(), sysvar_rent.clone(), mint_auth.clone()],
        // The seeds for our token mint PDA
        &[&[b"token_mint", &[mint_bump]]],
    )?;

    msg!("Initialized token mint");

    Ok(())
}
```
At a high level, here's what's happening here:
1. Iterate through list of accounts to extract them
2. Derive token mint PDA
3. Validate all of the important accounts passed in: 
   1. Token mint account
   2. Mint authority account (this should be you)
   3. System program
   4. Token program
   5. Sysvar rent - the rent calculation account
4. Calculate rent for the mint account
5. Create the token mint PDA
6. Initialize the mint account

Go over the code comments, I added context wherever I could! 

You'll now be getting an error since we're calling a new error without declaring it. Pop open `error.rs` and add `IncorrectAccountError` to the `ReviewError` enum:
```rs
#[derive(Debug, Error)]
pub enum ReviewError {
    #[error("Account not initialized yet")]
    UninitializedAccount,

    #[error("PDA derived does not equal PDA passed in")]
    InvalidPDA,

    #[error("Input data exceeds max length")]
    InvalidDataLength,

    #[error("Rating greater than 5 or less than 1")]
    InvalidRating,

    // New error added
    #[error("Accounts do not match")]
    IncorrectAccountError,
}
```
Pretty self-explanatory :)

Open up the target folder in your file explorer and get rid of the keypair in the deploy folder. 

In your console:
```bash
cargo build-bpf
```
Copy and paste the deploy command that's printed out.

If you get `insufficient funds` just run `solana airdrop 2`.

Once you've deployed locally, it's time to test! We're going to use a local client script to test out initializing the account. Here's what you'll need to set up:

```bash
git clone https://github.com/buildspace/solana-movie-token-client
cd solana-movie-token-client
npm install
```

Before you can run the script you'll need to:
1. Update `PROGRAM_ID` in `index.ts`
2. Change connection to on line 67 to 
```js
const connection = new web3.Connection("http://localhost:8899");
```
3. Run `solana logs PROGRAM_ID_HERE` in a second console window

You should now have a console logging all the outputs for this program and are ready to run the script!

If you run `npm start` you should see the logs for the mint account creation :D
