Time to explore the full power of PDAs. We're going to build support for comments on our old Movie review program. 

Start by setting up a new project on your local environment. 

```
cargo new --lib movie-review-comments
cd movie-review-comments
```

Open up `Cargo.toml` so we can add the dependencies we need and specify other config:
```toml
[package]
name = "movie-review-comments"
version = "0.1.0"
edition = "2021"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[features]
no-entrypoint = []

[dependencies]
solana-program = "1.10.29"
borsh = "0.9.3"
thiserror = "1.0.31"

[lib]
crate-type = ["cdylib", "lib"]
```

You'll also need to bring over all the files and code we were using previously. [Here's the Movie review program as we left off](https://beta.solpg.io/6312eaf988a7fca897ad7d15), copy the file structure and the contents to your local project.

Once you're done, you can check that everything is in place by building the program:
```
cargo build-sbf
```

This will take a few minutes the first time you run it. If all goes well you should see a green "Finished" message.

We're ready to start smacking stuff together!

**A note before we begin**
This is a heavy lesson. We're gonna be writing a lot of code and it will probably seem overwhelming. You won't have to do even half as much work as this when writing a real program - **it will be a lot quicker**. We'll be learning how to use Anchor next week, which will make things a lot easier. We're going native to properly understand these concepts and build up your fundamentals.

#### 🤓 Structuring our data
The biggest piece when storing data is deciding *where* stuff goes and how it connects together. We want to store comments for each movie review. What does this look like on chain? When reading on the client, how do we find comments for a specific review?  This is what mapping is all about.

There's no hard "rules" for this stuff, you gotta use your computer engineer brain to figure out what to do here, just like a database schema. Generally, we want structure that:
- Is not overly complicated
- Makes data easily retrievable

The specific implementations will vary case by case, but there are a few common patterns that you'll see. Once you know what your options are for structuring and connecting stored data, you'll be able to reason to the best solution for your instance. 

Think about it like making dinner - once you learn how to cook certain ingredients, you'll be able to come up with dishes based on what you have on hand. That's how you learn to chuck an egg into a pot of instant noodles and call it gourmet ramen. I swear I didn't plan the egg analogy for PDAs all this time, it just happened. 

**Storing comments**
First thing we need to decide is where we'll store our comments. As you (hopefully) remember from `add_movie_review` - we're creating a new PDA for each movie review. So we could just add a big fat comment array to the PDA and we're done, right? Nope. Accounts have a limited size, so we'd run out of space pretty quickly.

Let's follow the same pattern we used for the movie reviews. We'll create a new PDA for each comment. This way we can store as many comments as we want! We'll need to link the comments to the review they belong to, so we'll use the movie review PD Address as a seed for the comment account.

**Reading comments**
Our structure will give us a theoretically infinite number of comments per movie review. However, there's nothing distingushing comments from each other for each movie review. How am we supposed to know how many comments there are for each movie review? 

We make another account to store this! And we can use a numbering system for the comment accounts to keep track of them. 

Confused? I sure was. Here's a handy diagram to help you visualize the structure:
![](https://hackmd.io/_uploads/ByLE_J6Eo.png)

For each movie review, we'll have **one** comment counter PDA, and many comment PDAs. I've also included the seeds for each PDA - they're how we'll fetch the account. 

This way if I want to get comment #5, I know I can find it in the account derived from the movie review PDA and `5`. 

#### 📦 Building the primitives
We want to make two new accounts to store stuff. Here's everything we'll need to do in our program to get there:
- Define structs to represent the comment counter and comment accounts
- Update the existing `MovieAccountState` to contain a discriminator (more on this later)
- Add an instruction variant to represent the `add_comment` instruction
- Update the existing `add_movie_review` instruction to include creating the comment counter account
- Create a new `add_comment` instruction

Let's start with structs for our new accounts. We'll need to define the data we'll be storing in each account. Open up `state.rs` and update it to this:

```rs
use borsh::{BorshSerialize, BorshDeserialize};
use solana_program::{
    // We're bringing in Pubkey
    program_pack::{IsInitialized, Sealed},
};

#[derive(BorshSerialize, BorshDeserialize)]
pub struct MovieAccountState {
    // Two new fields added - discriminator and reviewer
    pub discriminator: String,
    pub is_initialized: bool,
    pub reviewer: Pubkey,
    pub rating: u8,
    pub title: String,
    pub description: String,
}

// New struct for recording how many comments total
#[derive(BorshSerialize, BorshDeserialize)]
pub struct MovieCommentCounter {
    pub discriminator: String,
    pub is_initialized: bool,
    pub counter: u64,
}

// New struct for storing individual comments
#[derive(BorshSerialize, BorshDeserialize)]
pub struct MovieComment {
    pub discriminator: String,
    pub is_initialized: bool,
    pub review: Pubkey,
    pub commenter: Pubkey,
    pub comment: String,
    pub count: u64,
}

impl Sealed for MovieAccountState {}

impl IsInitialized for MovieAccountState {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}
```

Each of these new structs needs to be serializable, so we've got the Borsh derive macros in here. We've also got the `is_initialized` field to confirm if this account is ready to use or not. 

Now that we've got more than one type of account in this program, we need a way to distinguish between these different accounts. When we run `getProgramAccounts` on the client, we'll get all the accounts for our movie review program. That's what `discriminator` is for. We can filter the list of accounts by specifying what the first 8 bytes of the account data should be.

We can go with a string because we'll decide beforehand what the discriminator should be, so we'll know what to look for on our client when filtering. 

Next, we need to implement `IsInitialized` for each of these new structs. I just copy/pasted the implementation from `MovieAccountState` and put them next to it:

```rs
impl IsInitialized for MovieCommentCounter {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}

impl IsInitialized for MovieComment {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}
```

#### 📏 Define account size
If you head over to `add_movie_review` in `processor.rs` you'll see that we're calculating the size of the account as we create the account. This isn't very useful as the calculation isn't reusable, so we'll do that for these accounts in implementations here:

```rs
impl MovieAccountState {
    pub const DISCRIMINATOR: &'static str = "review";

    pub fn get_account_size(title: String, description: String) -> usize {
                // 4 bytes to store the size of the subsequent dynamic data (string)
        return (4 + MovieAccountState::DISCRIMINATOR.len())  
            + 1 // 1 byte for is_initialized (boolean)
            + 1 // 1 byte for rating 
            + (4 + title.len()) // 4 bytes to store the size of the subsequent dynamic data (string)
            + (4 + description.len()); // Same as above
    }
}

impl MovieComment {
    pub const DISCRIMINATOR: &'static str = "comment";

    pub fn get_account_size(comment: String) -> usize {
        return (4 + MovieComment::DISCRIMINATOR.len()) 
        + 1  // 1 byte for is_initialized (boolean)
        + 32 // 32 bytes for the movie review account key 
        + 32 // 32 bytes for the commenter key size
        + (4 + comment.len()) // 4 bytes to store the size of the subsequent dynamic data (string)
        + 8; // 8 bytes for the count (u64)
    }
}

impl MovieCommentCounter {
    pub const DISCRIMINATOR: &'static str = "counter";
    pub const SIZE: usize = (4 + MovieCommentCounter::DISCRIMINATOR.len()) + 1 + 8;
}

impl Sealed for MovieCommentCounter{}
```
Since the movie review account and the movie comment account have dynamic content, we need functions to get their sizes. Check out the comments in the code explaining what each byte is for!

`MovieCommentCounter` will always be the same size, so we can just declare a constant for it instead of a function. 

Btw we've also got our discriminator here! Since this will never change, we're using `'static` to create a [static constant](https://doc.rust-lang.org/rust-by-example/scope/lifetime/static_lifetime.html) that will remain the same for the entire duration of the program. Go over the code comments to find out what each byte is for :)

Finally, since we're doing implementations, I've also included `Sealed` for `MovieCommentCounter`. Reminder - the `Sealed` trait allows for some compiler optimizations when the size of the struct is known. `MovieCommentCounter` has a known, fixed size, so we need to implement it!

Here's what the outline of `state.rs` should look like now that you're done:
![](https://hackmd.io/_uploads/SkwZ4R2Vo.png)

To recap, for each account state we have:
- A struct to represent the data in the account
- An `is_initialized` function implementation that tells us if the account is ready
- A `get_account_size` function implementation to calculate the size of the content in each account
- A static `DISCRIMINATOR` constant to distinguish between accounts
- Optionally - a `Sealed` implementation if the account size is not dynamic.

#### 👨‍🏫 Update our instructions
Now that all of our state is taking care of, we can move on to upgrading our instruction handlers and implementing the actual comment logic. 

Starting with the instruciton handlers, we'll need to update our instruction enum to add support for comments in `instruction.rs`:
```rs
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
    },
    AddComment {
        comment: String
    }
}
```

The struct to represent the instruction data for this is gonna be pretty simple:
```rs
#[derive(BorshDeserialize)]
struct CommentPayload {
    comment: String
}
```

We'll need to refactor the `unpack` implementation a little bit. Since the payload for both our previous instructions (add and update) was the same, we could deserialize it before the match statement. Now that we've got comment with a different type of payload, we'll move the desrialization into the match statement. Check it out:
```rs
impl MovieInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (&variant, rest) = input.split_first().ok_or(ProgramError::InvalidInstructionData)?;
        Ok(match variant {
            0 => {
                // Payload moved into the match statement for each payload
                let payload = MovieReviewPayload::try_from_slice(rest).unwrap();
                Self::AddMovieReview {
                title: payload.title,
                rating: payload.rating,
                description: payload.description }
            },
            1 => {
                let payload = MovieReviewPayload::try_from_slice(rest).unwrap();
                Self::UpdateMovieReview {
                    title: payload.title,
                    rating: payload.rating,
                    description: payload.description
                }
            },
            2 => {
                // Comment payload uses it's own desrializer cause of the different data type
                let payload = CommentPayload::try_from_slice(rest).unwrap();
                Self::AddComment {
                    comment: payload.comment
                }
            }
            _ => return Err(ProgramError::InvalidInstructionData)
        })
    }
}
```

You should be getting used to this by now :)

Last bit here is updating the `match` statement in the `process_instruction`:
```rs
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult {
    let instruction = MovieInstruction::unpack(instruction_data)?;
    match instruction {
        MovieInstruction::AddMovieReview { title, rating, description } => {
            add_movie_review(program_id, accounts, title, rating, description)
        },

        MovieInstruction::UpdateMovieReview { title, rating, description } => {
            update_movie_review(program_id, accounts, title, rating, description)
        },

        MovieInstruction::AddComment { comment } => {
            add_comment(program_id, accounts, comment)
        }
    }
}
```

To recap what we did to add support for a new instruction:
1. Update instruction enum to include the new instruction
2. Add the instruction payload struct so we deserialize it
3. Update our `unpack` function to include the instruction type
4. Update the `match` statement in our `process_instruction` function to handle the processing

You'll probably be getting an error here cause `add_comment` doesn't exist yet, add a blank function to get rid of that for now:
```rs
pub fn add_comment(
  program_id: &Pubkey,
  accounts: &[AccountInfo],
  comment: String
) -> ProgramResult {
    Ok(())
    }
```

#### 🎬 Update `add_movie_review` to create comment counter account
Since all movie reviews will now need a counter account, we'll need to update the `add_movie_review` function to handle the creation of that account.

In `processor.rs`, within the `add_movie_review` function, let’s add a `pda_counter` to represent the new counter account we’ll be initializing along with the movie review account.

```rs
let account_info_iter = &mut accounts.iter();

let initializer = next_account_info(account_info_iter)?;
let pda_account = next_account_info(account_info_iter)?;
let system_program = next_account_info(account_info_iter)?;
// New account to store comment count
let pda_counter = next_account_info(account_info_iter)?;
```

A good habit to have is to also write out the validation for PDAs right when you create them. That way you'll never forget!

Put this right after the `pda_account` validation:
```rs
  let (counter_pda, counter_bump_seed) = Pubkey::find_program_address(
    &[pda.as_ref(), "comment".as_ref()],
    program_id
  )

  if counter_pda != *pda_counter.key {
      msg!("Invalid seeds for counter PDA");
      return Err(ProgramError::InvalidArgument)
  }
```

Remember how we moved account sizes to `state.rs`? Well, we'll need to use that here to calculate the size of the counter account. 

Replace `total_len` with a call to `MovieAccountState::get_account_size`:
```rs
let account_len: usize = 1000;

if MovieAccountState::get_account_size(title.clone(), description.clone()) > account_len {
    msg!("Data length is larger than 1000 bytes");
    return Err(ReviewError::InvalidDataLength.into());
}
```

We also added a `discriminator` field, so we'll have to update our `account_data` population section from the `MovieAccountState` struct:
```rs
account_data.discriminator = MovieAccountState::DISCRIMINATOR.to_string();
account_data.reviewer = *initializer.key;
account_data.title = title;
account_data.rating = rating;
account_data.description = description;
account_data.is_initialized = true;
```

Finally, add the logic to initialize the counter account right after that within the `add_movie_review` function:
```rs
msg!("Creating comment counter");
let rent = Rent::get()?;
let counter_rent_lamports = rent.minimum_balance(MovieCommentCounter::SIZE);

// Deriving the address and validating that the correct seeds were passed in
let (counter, counter_bump) =
    Pubkey::find_program_address(&[pda.as_ref(), "comment".as_ref()], program_id);
if counter != *pda_counter.key {
    msg!("Invalid seeds for PDA");
    return Err(ProgramError::InvalidArgument);
}

// Creating the comment counter account
invoke_signed(
    &system_instruction::create_account(
        initializer.key, // Rent payer 
        pda_counter.key, // Address who we're creating the account for
        counter_rent_lamports, // Amount of rent to put into the account
        MovieCommentCounter::SIZE.try_into().unwrap(), // Size of the account
        program_id,
    ),
    &[
        // List of accounts that will be read from/written to
        initializer.clone(),
        pda_counter.clone(),
        system_program.clone(),
    ],
    // Seeds for the PDA
    // PDA account 
    // The string "comment"
    &[&[pda.as_ref(), "comment".as_ref(), &[counter_bump]]],
)?;
msg!("Comment counter created");

// Deserialize the newly created counter account
let mut counter_data =
    try_from_slice_unchecked::<MovieCommentCounter>(&pda_counter.data.borrow()).unwrap();

msg!("checking if counter account is already initialized");
if counter_data.is_initialized() {
    msg!("Account already initialized");
    return Err(ProgramError::AccountAlreadyInitialized);
}

counter_data.discriminator = MovieCommentCounter::DISCRIMINATOR.to_string();
counter_data.counter = 0;
counter_data.is_initialized = true;
msg!("comment count: {}", counter_data.counter);
counter_data.serialize(&mut &mut pda_counter.data.borrow_mut()[..])?;

msg!("Comment counter initialized");
Ok(())
```

To recap what this fat block of code is doing:
1. Calculate the rent required for the comment counter account
2. Validate that the correct seeds are passed in for the PDA
3. Create the comment counter account with `invoke_signed`
4. Deserialize the data from the newly created account
5. Check if the account has already been initialized
6. Set the data, initialize the account
7. Serialize the data

Be sure to go over the comments, I've added context to each bit of code!

Phew. If this feels like a lot, that's cause it is! Take a break if you feel like it, the brain does some subconscious magic when you let it rest over new concepts.

Now when a new review is created, two accounts are initialized:
1. The first is the review account that stores the contents of the review. This is unchanged from the version of the program we started with.
2. The second account stores the counter for comments

#### 💬 Add support for comments
The last piece of the puzzle is to implement the `add_comment` function at the bottom of `processor.rs`:

Here's the steps we want to take in this function:
1. Iterating through accounts passed into the program.
2. Calculate the rent exempt amount for the new comment account
3. Derive the PDA for the comment account using the review address and the current comment count as seeds
4. Invoke the System Program to create the new comment account
5. Set the appropriate values to the newly created account
6. Serialize the account data and return from the function

```rs
pub fn add_comment(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    comment: String
) -> ProgramResult {
    msg!("Adding Comment...");
    msg!("Comment: {}", comment);

    let account_info_iter = &mut accounts.iter();

    let commenter = next_account_info(account_info_iter)?;
    let pda_review = next_account_info(account_info_iter)?;
    let pda_counter = next_account_info(account_info_iter)?;
    let pda_comment = next_account_info(account_info_iter)?;
    let system_program = next_account_info(account_info_iter)?;

    let mut counter_data = try_from_slice_unchecked::<MovieCommentCounter>(&pda_counter.data.borrow()).unwrap();

    let account_len = MovieComment::get_account_size(comment.clone());

    let rent = Rent::get()?;
    let rent_lamports = rent.minimum_balance(account_len);

    let (pda, bump_seed) = Pubkey::find_program_address(&[pda_review.key.as_ref(), counter_data.counter.to_be_bytes().as_ref(),], program_id);
    if pda != *pda_comment.key {
        msg!("Invalid seeds for PDA");
        return Err(ReviewError::InvalidPDA.into())
    }

    invoke_signed(
        &system_instruction::create_account(
        commenter.key,
        pda_comment.key,
        rent_lamports,
        account_len.try_into().unwrap(),
        program_id,
        ),
        &[commenter.clone(), pda_comment.clone(), system_program.clone()],
        &[&[pda_review.key.as_ref(), counter_data.counter.to_be_bytes().as_ref(), &[bump_seed]]],
    )?;

    msg!("Created Comment Account");

    let mut comment_data = try_from_slice_unchecked::<MovieComment>(&pda_comment.data.borrow()).unwrap();

    msg!("checking if comment account is already initialized");
    if comment_data.is_initialized() {
        msg!("Account already initialized");
        return Err(ProgramError::AccountAlreadyInitialized);
    }

    comment_data.discriminator = MovieComment::DISCRIMINATOR.to_string();
    comment_data.review = *pda_review.key;
    comment_data.commenter = *commenter.key;
    comment_data.comment = comment;
    comment_data.is_initialized = true;
    comment_data.serialize(&mut &mut pda_comment.data.borrow_mut()[..])?;

    msg!("Comment Count: {}", counter_data.counter);
    counter_data.counter += 1;
    counter_data.serialize(&mut &mut pda_counter.data.borrow_mut()[..])?;

    Ok(())
}
```

This is a lot of code that's doing stuff we already know, so I won't go over it again. 

We went over **a lot** of changes. [Here's](https://beta.solpg.io/6312eaf988a7fca897ad7d15) what the final version looks like, you can use it to compare if something is broken on your end! 

#### 🚀 Deploy the program
We're ready to deploy! 

Local deployment takes one more step than just hitting the deploy button on the playground.

First you'll want to build the program:
```
cargo build-bpf
```

Next, we can deploy:
```
solana program deploy <PATH>
```

Testing is easy, just set up this front-end:
```
git clone https://github.com/buildspace/solana-movie-frontend/
cd solana-movie-frontend
git checkout solution-add-comments
```

Before you can spam some quality movie reviews, you'll need to:
- Update the program address in `utils/constants.ts` 
- Set the endpoint in `WalletContextProvider.tsx` to `http://127.0.0.1:8899`
- Change Phantom network to localhost
- Get localhost SOL with `solana airdrop 2 PHANTOM_WALLET_ADDRESS`

You'll see the magic of comments start to happen on `localhost:3000` with `npm run dev`!

**Hot tip - local program logs**
Got errors? Something not working? You can check out program logs in localhost with
```
solana logs PROGRAM_ID
```

#### 🚢 Ship challenge
Now it’s your turn to build something independently by building on top of the Student Intro program that you've used in previous lessons.

Using what you've learned in this lesson, try applying what you've learned to the Student Intro Program. Your additions should make it possible for other users to reply to an intro.

To test it, you’ll either need to take the `solution-paging-account-data` branch of this frontend and add a component for displaying and submitting comments, or you can write a script that sends transactions to the program.

**Starter code:**
Feel free to use the `starter` branch of [this](https://github.com/buildspace/solana-student-intro-program) repository if you don’t have your previous code saved.

**Solution code:**
Try to do this independently if you can! If you get stuck though, feel free to reference the `solution-add-replies` branch.
