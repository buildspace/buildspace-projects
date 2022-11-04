Howdy! Ready to become a governer? No no, we're not doing that type of state management. The state we're talking about is the data of our program that's stored on-chain.

We've got a solid program that takes instrution data and prepares it for processing. To get to the execution bits we'll need to learn a bit more Rust.

#### 📝 Program state as a Rust data type
Part of how Solana maintains its speed and efficiency is the fact the the programs are stateless. This means you can't change data on the program - everything is stored in external accounts, typically ones that are owned by the program. Mostly these accounts are PDAs - we'll look at their data storage elements now and dive into the rest later. 

Just like how we convert instruction data to Rust types, we'll convert program state to Rust types to make it easier to work with. 

Think back to the `data` field in Solana accounts - it stores an array of raw bytes. We can represent this as Rust types by serializing and deserializing. 

![](https://hackmd.io/_uploads/SJrfKWr4i.png)

We'll be using borsh macros again:
![](https://hackmd.io/_uploads/SkrU5bS4o.png)

Data is transferred and stored as raw bytes, but is changed to Rust types when we want to work with it. Makes sense, yeah? 

#### 🏠 Space and rent
Yup, Solana has landlords too: the validators that store the state of the blockchain on their machines. 

Rent is paid in Lamports - the smallest unit of SOL (0.000000001 SOL = 1 Lamport) - based on the amount of space the account takes up. Here's a table of how much space in bytes common types take up:

![](https://hackmd.io/_uploads/SyxoWWrNj.png)

There's two ways to pay rent:
1. Pay rent on a per-epoch basis. This is like paying rent monthly - as long as you keep paying you get to stay. If the account doesn't have enough SOL, it gets reset and the data is lost.
2. Maintain a minimum balance equivalent to 2 years of rent. This makes the account *exempt* from rent. The logic here is that the hardware cost drops by 50% every 2 years, so if you have enough SOL to pay for 2 years of rent, you're good forever!

Being rent-exempt is *required* now, so #2 is the only option. The best part about this approach is that when you no longer need to store data, you can destroy the account and get your SOL back! Free storage on the blockchain (minus transaction fees) 🥳

Why have rent on the blockchain at all? Well, it's a way to prevent people from creating a bunch of accounts and never using them. This would be a waste of space and validator resources. This system is part of why storage is so cheap on Solana - unlike Ethereum, where my stupid Hello World NFT collection is going to be stored by all validators for eternity.

You can read more about this [here](https://docs.solana.com/implemented-proposals/rent), I think it's pretty cool!

#### 📊 Calculating rent
Calculating rent is easy - there's a helpful function for it. The tricky part is figuring out how much space you need.

Here's this would look like for our epic note-taking program: 
```rs
// Calculate account size required for struct NoteState
// 4 bytes to store the size of the subsequent dynamic data (string)
// 8 bytes to store the 64 bit interger for the id
let account_len: usize = (4 + title.len()) + (4 + body.len()) + 8;

// Calculate rent required
let rent = Rent::get()?;
let rent_lamports = rent.minimum_balance(account_len);
```

First thing we gotta do is calculate the total length of the data we're storing. We can do this by adding up the lengths of the strings and the 8 bytes for the id. 

In our case the `title` and `body` are dynamic data types (strings) - they can be of any length. We use the first 4 bytes to store the length of each item, so we add 4 to the length of each string.

Then we can use the `Rent::get()` function to get the rent for the account. Ezpz!

#### 📜 Program Derived Addresses
We've got our data from the instruction, we've calculated how much we need to pay for rent, now we need an account to toss it in. Hello PDAs! Remember the chicken and egg problem from the front-end? Same deal here! We'll derive the address of the account from the program ID and a set of seeds.

![](https://hackmd.io/_uploads/SJjCC-BEs.png)

We'll go into depth on how PDAs work in the future, for now all you need to know is the `find_program_address` function and that only the program in the `program_id` can sign for the PDA. It's like secure storage without needing a password.

#### 🛫 Cross Program Invocations
The last bit is to initialize the PDA (we only found the address in the last step). We'll use a Cross Program Invocation (CPI) to do this. As the name suggests, we'll be interacting with another program on the Solana network from within our program.

CPIs can be done using either `invoke` or `invoke_signed`:

![](https://hackmd.io/_uploads/Bk_ezfrNj.png)

`invoke` is used when you don't need to sign the transaction. `invoke_signed` is used when you need to sign the transaction. In our case we're the only ones that can sign for the PDA, so we'll use `invoke_signed`.

![](https://hackmd.io/_uploads/ryc9fzH4s.png)

Here's what that looks like. You're probably wondering "wtf is this stuff" - don't worry, we'll practice this next and it'll make sense :)

All we're doing here is creating a transaction inside a program using Rust, similar to how we did in our client using TypeScript. We've got a special `signers_seeds` thingy here that's required for the PDA.

#### ✂ Serializing and deserializing account data 

Once we've created a new account, we need to access and update the account's data field (which currently has empty bytes). This means deserializing its byte array into an instance of the type we created, updating the fields on that instance, then serializing that instance back into a byte array.

**Deserialize account data**
The first step to updating an account's data is to deserialize its data byte array into its Rust type. You can do this by first borrowing the data field on the account. This allows you to access the data without taking ownership. 

You can then use the try_from_slice_unchecked function to deserialize the data field of the borrowed account using the format of the type you created to represent the data. This gives you an instance of your Rust type so you can easily update fields using dot notation. If we were to do this with the note-taking app example we've been using, it would look like this:

```rs
let mut account_data = try_from_slice_unchecked::<NoteState>(note_pda_account.data.borrow()).unwrap();

account_data.title = title;
account_data.body = body;
account_data.id = id;
```

**Serialize account data**
Once the Rust instance representing the account's data has been updated with the appropriate values, you can "save" the data on the account.

This is done with the serialize function on the instance of the Rust type you created. You'll need to pass in a mutable reference to the account data. The syntax here is tricky, so don't worry if you don't understand it completely. Borrowing and references are two of the toughest concepts in Rust.

```rs
account_data.serialize(&mut &mut note_pda_account.data.borrow_mut()[..])?;
```
The above example converts the `account_data` object to a byte array and sets it to the `data` property on `note_pda_account`. This effectively saves the updated `account_data` variable to the data field of the new account. Now when a user fetches the `note_pda_account` and deserializes the data, it will display the updated data we’ve serialized into the account.

#### 📼 Recap - Put it all together
That was a lot. I had to take a break and come back to finish writing this. Let's recap the entire process end to end:
1. User creates a note by sending a transaction with the title, body, and id in bytes
2. Our program receives the instruction, extracts the data and formats it into a Rust type
3. We use the Rust type to calculate how much space our account needs + how much rent we need to pay
4. We derive the address of the account from the program ID and a set of seeds
5. We create the account with blank data using a CPI 
6. We deserialize the account data into a Rust type
7. We update the account data in Rust type with the data from the instruction
8. We serialize the Rust type back into raw bytes and save it to the account

THAT IS EVERYTHING MY FRIEND. YOU NOW KNOW HOW TO WRITE DATA TO ACCOUNTS ON SOLANA. I'M SCREAMING BECAUSE THIS IS MASSIVE. HERE IS A BIG W FOR YOU, TAKE IT, YOU DESERVE IT:

# **W**

### 🎥 Build a movie review program
Time to finish the job. No longer shall our epic movie reviews be logged onto the console - they shall be stored on the blockchain!

We'll be using the same program as before, you can [set it up from scratch here](https://beta.solpg.io/6295b25b0e6ab1eb92d947f7) or use the one from the previous section. 

#### 📝 Representing account data
We'll need a new Rust type to represent the data we're storing. Create a new file named `state.rs` and add `MovieAccountState` in it:

```rs 
use borsh::{BorshSerialize, BorshDeserialize};

#[derive(BorshSerialize, BorshDeserialize)]
pub struct MovieAccountState {
    pub is_initialized: bool,
    pub rating: u8,
    pub title: String
    pub description: String,
}
```

We've got both `BorshSerialize` and `BorshDeserialize` in here :)

Next we'll need to update `lib.rs` to bring everything we'll need into scope. Update the top of the file to look like this:

```rs
use solana_program::{
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    msg,
    account_info::{next_account_info, AccountInfo},
    system_instruction,
    program_error::ProgramError,
    sysvar::{rent::Rent, Sysvar},
    program::{invoke_signed},
    borsh::try_from_slice_unchecked,
};
use std::convert::TryInto;
pub mod instruction;
pub mod state;
use instruction::MovieInstruction;
use state::MovieAccountState;
use borsh::BorshSerialize;
```

Nice. I'll explain the new stuff as we need it. Let's head back to our `add_movie_review` and fill it in with actual logic instead of just printing.

#### ⏩ Iterating over accounts
The second argument passed into our `add_movie_review` function is an array of accounts. We can iterate over these to get their data and do stuff with it. We can do that with  `next_account_info` - it's a function that takes an iterator and returns the next item in a list safely. We can use it like this:

```rs
// Get Account iterator
let account_info_iter = &mut accounts.iter();

// Get accounts
let initializer = next_account_info(account_info_iter)?;
let pda_account = next_account_info(account_info_iter)?;
let system_program = next_account_info(account_info_iter)?;
```

Pretty cool eh? If the list is empty, we get a `ProgramError::NotEnoughAccountKeys` error. If we try to access an account that doesn't exist, we get a `ProgramError::MissingRequiredSignature` error.

#### 🥚 Deriving the PDA address
All we need to do this is one line (continue adding to `add_movie_review`):

```rs
let (pda, bump_seed) = Pubkey::find_program_address(&[initializer.key.as_ref(), title.as_bytes().as_ref(),], program_id);
```

The seeds here are:
1. The initializer's public key
2. The title of the movie 

#### 🧮 Calculate space and rent
We've gone over this before :)

```rs
// Calculate account size required
let account_len: usize = 1 + 1 + (4 + title.len()) + (4 + description.len());

// Calculate rent required
let rent = Rent::get()?;
let rent_lamports = rent.minimum_balance(account_len);
```

Your `add_movie_review` function should be getting a bit long. We still have two more bits left - creating the account and updating the data. Onwards!

#### 📝 Create the account
Time to make some cross program invocations!

```rs
// Create the account
invoke_signed(
    &system_instruction::create_account(
        initializer.key,
        pda_account.key,
        rent_lamports,
        account_len.try_into().unwrap(),
        program_id,
    ),
    &[initializer.clone(), pda_account.clone(), system_program.clone()],
    &[&[initializer.key.as_ref(), title.as_bytes().as_ref(), &[bump_seed]]],
)?;

msg!("PDA created: {}", pda);
```

`invoke_signed` is a transction to create the account. We're passing in the `create_account` instruction, the accounts we're using, and the seeds we're using to derive the PDA address.

The final thing we need to do is update the account data:
```rs
msg!("unpacking state account");
let mut account_data = try_from_slice_unchecked::<MovieAccountState>(&pda_account.data.borrow()).unwrap();
msg!("borrowed account data");

account_data.title = title;
account_data.rating = rating;
account_data.description = description;
account_data.is_initialized = true;

msg!("serializing account");
account_data.serialize(&mut &mut pda_account.data.borrow_mut()[..])?;
msg!("state account serialized");
```

We're using `try_from_slice_unchecked` to convert the raw bytes into a Rust type. We're then updating the data and serializing it back into raw bytes.

We are ready to build and ~~deploy~~ upgrade! (it may take a few minutes)

![](https://soldev.app/assets/movie-review-pt2-build-deploy.gif)

#### 🎉 Test it out
You know the drill. Copy the address. Set up a script to call the program (you can use the same one you used last time, no changes necessary). Run it. Check the fancy new account on Solana Explorer.

If you need a new setup:
```bash
git clone https://github.com/buildspace/solana-movie-client
cd solana-movie-client
npm install
```

Update the `programId` in `index.ts` to the address of your program and run `npm run start`. 

Hit the explorer link logged in the terminal and scroll down to the program logs section, here's what I've got:

![](https://hackmd.io/_uploads/BylJVNB4j.png)

We can see that our program interacted with the system program (via the CPI) to create an account (the PDA) and it added our review to it! A mighty fine review, if I do say so myself ;)

![](https://i.kym-cdn.com/photos/images/original/002/355/520/773.png)

#### 🚢 Ship challenge 
Now it’s your turn to build something independently. 

Recall that the Student Intro program takes a user's name and a short message as the `instruction_data` and creates an account to store the data on-chain.

Using what you've learned in this lesson, try to recreate the entirety of the Student Intro program.

**Hints:** 
In addition to taking a name a short message as instruction data, the program should:
1. Create a separate account for each student
2. Store `is_initialized` as a boolean, `name` as a string, and `msg` as a string in each account

**Solution Code:**
You can test your program by using this [frontend](https://github.com/buildspace/solana-student-intros-frontend). Remember to replace the program ID in the frontend code with the one you've deployed.

Try to do this independently if you can! But if you get stuck, feel free to reference the [solution code](https://beta.solpg.io/62b11ce4f6273245aca4f5b2).
