All of last lesson was just preparing the mint account. Pregame is over, time for the main show. 

We're going to go into our review and comment workflows and add the necessary logic to mint tokens.

We'll start with the movie reviews. Head over to `processor.rs` and update `add_movie_review` to require additional accounts to be passed in:
```rs
// Inside add_movie_review
msg!("Adding movie review...");
msg!("Title: {}", title);
msg!("Rating: {}", rating);
msg!("Description: {}", description);

let account_info_iter = &mut accounts.iter();

let initializer = next_account_info(account_info_iter)?;
let pda_account = next_account_info(account_info_iter)?;
let pda_counter = next_account_info(account_info_iter)?;
let token_mint = next_account_info(account_info_iter)?;
let mint_auth = next_account_info(account_info_iter)?;
let user_ata = next_account_info(account_info_iter)?;
let system_program = next_account_info(account_info_iter)?;
let token_program = next_account_info(account_info_iter)?;
```

The new ones are:
- `token_mint` - the mint address of the token
- `mint_auth` - address of the authority of the token mint
- `user_ata` - user’s associated token account for this mint (where the tokens will be minted)
- `token_program` - address of the token program

Nothing special here, these are just the accounts you'd expect when dealing with tokens.

Remember the habit with building? Every time you add an account, add validation right after! Here's what we'll need to add anywhere in the `add_movie_review` function: 
```rs
msg!("deriving mint authority");
let (mint_pda, _mint_bump) = Pubkey::find_program_address(&[b"token_mint"], program_id);
let (mint_auth_pda, mint_auth_bump) =
    Pubkey::find_program_address(&[b"token_auth"], program_id);

if *token_mint.key != mint_pda {
    msg!("Incorrect token mint");
    return Err(ReviewError::IncorrectAccountError.into());
}

if *mint_auth.key != mint_auth_pda {
    msg!("Mint passed in and mint derived do not match");
    return Err(ReviewError::InvalidPDA.into());
}

if *user_ata.key != get_associated_token_address(initializer.key, token_mint.key) {
    msg!("Incorrect token mint");
    return Err(ReviewError::IncorrectAccountError.into());
}

if *token_program.key != TOKEN_PROGRAM_ID {
    msg!("Incorrect token program");
    return Err(ReviewError::IncorrectAccountError.into());
}
```

You've done this a few times by now, so this should be feeling familiar :)

Now we can move on to the minting! Right before the end of the program where we return `Ok(())`, we'll add this:
```rs
msg!("Minting 10 tokens to User associated token account");
invoke_signed(
    // Instruction
    &spl_token::instruction::mint_to(
        token_program.key,
        token_mint.key,
        user_ata.key,
        mint_auth.key,
        &[],
        10*LAMPORTS_PER_SOL,
    )?, // ? unwraps and returns the error if there is one
    // Account_infos
    &[token_mint.clone(), user_ata.clone(), mint_auth.clone()],
    // Seeds 
    &[&[b"token_auth", &[mint_auth_bump]]],
)?;

Ok(())
```

`mint_to` is an instruction from the SPL token crate so we'll also need to update the imports at the top:
```rs
// Existing imports
use spl_token::{instruction::{initialize_mint, mint_to}, ID as TOKEN_PROGRAM_ID};
```

And we're done with our reviews! Now every time someone leaves a review we'll send them 10 tokens.

We'll do the exact same thing for `add_comment` in `processor.rs`:
```rs
// Inside add_comment
let account_info_iter = &mut accounts.iter();

let commenter = next_account_info(account_info_iter)?;
let pda_review = next_account_info(account_info_iter)?;
let pda_counter = next_account_info(account_info_iter)?;
let pda_comment = next_account_info(account_info_iter)?;
let token_mint = next_account_info(account_info_iter)?;
let mint_auth = next_account_info(account_info_iter)?;
let user_ata = next_account_info(account_info_iter)?;
let system_program = next_account_info(account_info_iter)?;
let token_program = next_account_info(account_info_iter)?;

// Mint tokens here
msg!("deriving mint authority");
let (mint_pda, _mint_bump) = Pubkey::find_program_address(&[b"token_mint"], program_id);
let (mint_auth_pda, mint_auth_bump) =
    Pubkey::find_program_address(&[b"token_auth"], program_id);

if *token_mint.key != mint_pda {
    msg!("Incorrect token mint");
    return Err(ReviewError::IncorrectAccountError.into());
}

if *mint_auth.key != mint_auth_pda {
    msg!("Mint passed in and mint derived do not match");
    return Err(ReviewError::InvalidPDA.into());
}

if *user_ata.key != get_associated_token_address(commenter.key, token_mint.key) {
    msg!("Incorrect token mint");
    return Err(ReviewError::IncorrectAccountError.into());
}

if *token_program.key != TOKEN_PROGRAM_ID {
    msg!("Incorrect token program");
    return Err(ReviewError::IncorrectAccountError.into());
}

msg!("Minting 5 tokens to User associated token account");
invoke_signed(
    // Instruction
    &spl_token::instruction::mint_to(
        token_program.key,
        token_mint.key,
        user_ata.key,
        mint_auth.key,
        &[],
        5 * LAMPORTS_PER_SOL,
    )?,
    // Account_infos
    &[token_mint.clone(), user_ata.clone(), mint_auth.clone()],
    // Seeds
    &[&[b"token_auth", &[mint_auth_bump]]],
)?;

Ok(())
```

Make sure you don't duplicate the `Ok(())` cause that'll give you an error lol

Hopefully you're starting to see the patterns now. We have to write a lot of code when developing natively, but the overall workflows are rather simple and feel "pure". 

#### 🚀 Build, deploy and test
Time to earn some popcorn tokens 🍿

First we'll build and deploy
```
cargo build-bpf
solana program deploy PATH_TO_TARGET
```

Then we'll test initialize the token mint
```
git clone https://github.com/buildspace/solana-movie-token-client
cd solana-movie-token-client
npm install
```

Just like before, 
1. Update `PROGRAM_ID` in `index.ts`
2. Change connection to on line 67 to 
```js
const connection = new web3.Connection("http://localhost:8899");
```

Run `npm start` and your mint account will be initialized.

Finally, we'll use the front-end to send a movie review and get some tokens.

As always, you can use the front-end where you left it off last or spin up an ew instance from the right branch:
```
git clone https://github.com/buildspace/solana-movie-frontend/
cd solana-movie-frontend
git checkout solution-add-tokens
npm install
```

Update `PROGRAM_ID`, submit a review, leave a comment. You should now have tokens in Phantom!

#### 🚢 Ship challenge
To apply what you've learned about CPIs in this lesson, think about how you could incorporate them into the Student Intro program. You could do something similar to what we did in the demo and add some functionality to mint tokens to users when they introduce themselves. Or if you're feeling really ambitious, think about how you could take all that you have learned so far in the course and create something completely new from scratch.

If you decide to do something similar to the demo, feel free to use the same [script](https://github.com/buildspace/solana-movie-token-client) to call the `initialize_mint` instruction, or you can get creative and initialize the mint from a client and then transfer the mint authority to a program PDA. If you need to look at a potential solution, take a look at [this playground](https://beta.solpg.io/631f631a77ea7f12846aee8d).

Have fun with this and use it as an opportunity to push yourself!
