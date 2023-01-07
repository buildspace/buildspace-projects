Let's write tests for our beloved Movie Review Program.

Setup - Starter: https://github.com/buildspace/solana-movie-program/tree/solution-add-tokens

- Add to `Cargo.toml`

```rust
[dev-dependencies]
assert_matches = "1.4.0"
solana-program-test = "~1.10.29"
solana-sdk = "~1.10.29"
```

#### Initialize testing framework

- Add to bottom of `processor.rs`

```rust
// Inside processor.rs
#[cfg(test)]
mod tests {
  use {
    super::*,
    assert_matches::*,
    solana_program::{
        instruction::{AccountMeta, Instruction},
        system_program::ID as SYSTEM_PROGRAM_ID,
    },
    solana_program_test::*,
    solana_sdk::{
        signature::Signer,
        transaction::Transaction,
        sysvar::rent::ID as SYSVAR_RENT_ID
    },
    spl_associated_token_account::{
        get_associated_token_address,
        instruction::create_associated_token_account,
    },
    spl_token:: ID as TOKEN_PROGRAM_ID,
  };
}
```

#### Helper function

- helper function to create initialize mint instruction
- add function inside the tests module so that the tests can call on it when needed.

```rust
// Inside the the tests modules
fn create_init_mint_ix(payer: Pubkey, program_id: Pubkey) -> (Pubkey, Pubkey, Instruction) {
  // Derive PDA for token mint authority
  let (mint, _bump_seed) = Pubkey::find_program_address(&[b"token_mint"], &program_id);
  let (mint_auth, _bump_seed) = Pubkey::find_program_address(&[b"token_auth"], &program_id);

  let init_mint_ix = Instruction {
      program_id: program_id,
      accounts: vec![
          AccountMeta::new_readonly(payer, true),
          AccountMeta::new(mint, false),
          AccountMeta::new(mint_auth, false),
          AccountMeta::new_readonly(SYSTEM_PROGRAM_ID, false),
          AccountMeta::new_readonly(TOKEN_PROGRAM_ID, false),
          AccountMeta::new_readonly(SYSVAR_RENT_ID, false)
      ],
      data: vec![3]
  };

  (mint, mint_auth, init_mint_ix)
}
```

#### Initialize mint test

- test `initialize_token_mint` instruction
- Our helper function returns a tuple of
    - `mint` pubkey,
    - `mint_auth` pubkey,
    - the `Instruction`
- Once the instruction is put together, we can add it to a `Transaction` and use the `banks_client` generated from the `ProgramTest` constructor to process it.
- use the `assert_matches!` macro to determine if the test passes or not

```rust
// First unit test
#[tokio::test]
async fn test_initialize_mint_instruction() {
    let program_id = Pubkey::new_unique();
    let (mut banks_client, payer, recent_blockhash) = ProgramTest::new(
        "pda_local",
        program_id,
        processor!(process_instruction),
    )
    .start()
    .await;

    // Call helper function
    let (_mint, _mint_auth, init_mint_ix) = create_init_mint_ix(payer.pubkey(), program_id);

    // Create transaction object with instructions, accounts, and input data
    let mut transaction = Transaction::new_with_payer(
        &[init_mint_ix,],
        Some(&payer.pubkey()),
    );
    transaction.sign(&[&payer], recent_blockhash);

    // Process transaction and compare the result
    assert_matches!(banks_client.process_transaction(transaction).await, Ok(_));
}
```

#### Add movie review test

- test `add_movie_review` instruction setup

```rust
// Second unit test
#[tokio::test]
async fn test_add_movie_review_instruction() {
  let program_id = Pubkey::new_unique();
  let (mut banks_client, payer, recent_blockhash) = ProgramTest::new(
      "pda_local",
      program_id,
      processor!(process_instruction),
  )
  .start()
  .await;

  // Call helper function
  let (mint, mint_auth, init_mint_ix) = create_init_mint_ix(payer.pubkey(), program_id);

}
```

- derive PDAs (in second test)
    - derive the review,
    - comment counter
    - user associated token account addresses.

```rust
// Create review PDA
let title: String = "Captain America".to_owned();
const RATING: u8 = 3;
let review: String = "Liked the movie".to_owned();
let (review_pda, _bump_seed) =
   Pubkey::find_program_address(&[payer.pubkey().as_ref(), title.as_bytes()], &program_id);

// Create comment PDA
let (comment_pda, _bump_seed) =
   Pubkey::find_program_address(&[review_pda.as_ref(), b"comment"], &program_id);

// Create user associate token account of token mint
let init_ata_ix: Instruction = create_associated_token_account(
   &payer.pubkey(),
   &payer.pubkey(),
   &mint,
);

let user_ata: Pubkey =
   get_associated_token_address(&payer.pubkey(), &mint);
```

- build transaction (still in second test)

```rust
// Concat data to single buffer
let mut data_vec = vec![0];
data_vec.append(
    &mut (TryInto::<u32>::try_into(title.len()).unwrap().to_le_bytes())
        .try_into()
        .unwrap(),
);
data_vec.append(&mut title.into_bytes());
data_vec.push(RATING);
data_vec.append(
    &mut (TryInto::<u32>::try_into(review.len())
        .unwrap()
        .to_le_bytes())
    .try_into()
    .unwrap(),
);
data_vec.append(&mut review.into_bytes());

// Create transaction object with instructions, accounts, and input data
let mut transaction = Transaction::new_with_payer(
    &[
    init_mint_ix,
    init_ata_ix,
    Instruction {
        program_id: program_id,
        accounts: vec![
            AccountMeta::new_readonly(payer.pubkey(), true),
            AccountMeta::new(review_pda, false),
            AccountMeta::new(comment_pda, false),
            AccountMeta::new(mint, false),
            AccountMeta::new_readonly(mint_auth, false),
            AccountMeta::new(user_ata, false),
            AccountMeta::new_readonly(SYSTEM_PROGRAM_ID, false),
            AccountMeta::new_readonly(TOKEN_PROGRAM_ID, false),
        ],
        data: data_vec,
    },
    ],
    Some(&payer.pubkey()),
);
transaction.sign(&[&payer], recent_blockhash);

// Process transaction and compare the result
assert_matches!(banks_client.process_transaction(transaction).await, Ok(_));
```

- run these tests with `cargo test-bpf`

#### 🚢 Ship challenge
Now that you know how to write unit tests in Rust, go ahead and add some tests more that you think are crucial to the functionality of the Movie Review or Student Introductions program.

If you want to go the extra mile, add some Typescript integration tests too. I know we didn’t go through those together, but it’s worth trying!

The further along in this program you get, the more some of these challenges will be open-ended so you can push yourself based on what *you* think you need. Don’t abuse that. Use it as an opportunity to make your learning more targeted.
