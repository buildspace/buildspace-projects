Remember the movie review program we interacted with in the first section? We're gonna build it out here. Feel free to review *other* stuff instead of movies, I'm not your dad. 

Head back to playground (the one from last lesson, not middle-school) and set up a new project. We'll start with the basic structure in `lib.rs`:

```rs
use solana_program::{
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    msg,
    account_info::AccountInfo,
};

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult {
    
    Ok(())
}
```

The usual so far. As with the note taking program, we'll start with defining instruction structures and creating the deserialization logic. 

#### 🔪 Deserialize instruction data
We'll do this in a new file called `instruction.rs`.
```rs
use borsh::{BorshDeserialize};
use solana_program::{program_error::ProgramError};

pub enum MovieInstruction {
    AddMovieReview {
        title: String,
        rating: u8,
        description: String
    }
}

#[derive(BorshDeserialize)]
struct MovieReviewPayload {
    title: String,
    rating: u8,
    description: String
}
```
The only things we need to bring in here are the `BorshDeserialize` macro and the `ProgramError` enum.

Even though we only have one instruction type, we'll still use an enum. We might decide to add more instructions later :)

You might be wondering why we need to specify types in the payload. The types are what tell Borsh where to split the bytes. Gotta know how long the sausages are before you can cut them up, remember?

The last thing we'll need here is the implementation for the `MovieInstruction` enum. Add this under the enum definition:

```rs
impl MovieInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        
				let (&variant, rest) = input.split_first().ok_or(ProgramError::InvalidInstructionData)?;
        
				let payload = MovieReviewPayload::try_from_slice(rest).unwrap();
        
        Ok(match variant {
            0 => Self::AddMovieReview {
                title: payload.title,
                rating: payload.rating,
                description: payload.description },
            _ => return Err(ProgramError::InvalidInstructionData)
        })
    }
}
```

You already know everything happening here! We're unpacking the instruction data and returning the correct variant of the enum.

Notice the `?;` when we're splitting the first byte.
```rs
let (&variant, rest) = input.split_first().ok_or(ProgramError::InvalidInstructionData)?;
```
This is a shorthand for returning an error and exiting the `unpack` function if the result of `split_first` is an error. It's like an easy try/catch. This is a common pattern in Rust, and you'll see it a lot.

```rs
let payload = MovieReviewPayload::try_from_slice(rest).unwrap();
```

I also wanna dive into `.unwrap();` a bit more: to “unwrap” something in Rust is to say, “Give me the result of the computation, and if there was an error, panic and stop the program.”. You might be thinking "Huh but why do we need to return something from the result of a function? Doesn't the `try_from_slice()` function return what we want?".

Nope. Rust has the `Option` type: a way to use Rust's type system to express the *possibility of absence*. This is **not** the same as `null` in other languages. `Option` is a type that can be either `Some` or `None`. `Some` is a value, `None` is the absence of a value. Why? Because sometimes you don't have a value, and that's okay. From the [docs](https://web.mit.edu/rust-lang_v1.25/arch/amd64_ubuntu1404/share/doc/rust/html/book/first-edition/error-handling.html#unwrapping-explained):
> Encoding the possibility of absence into the type system is an important concept because it will cause the compiler to force the programmer to handle that absence.

Rust teaches you to be a better developer! And now you know of another tiny slice of the Rust cake 🍰

#### 👀 Add the instruction to the program
The last bit here is bringing the instruction into the program. We'll do this in `lib.rs`:

```rs
pub mod instruction;
use instruction::{MovieInstruction};
```

Make sure you update the imports if you changed the enum name! 

For now we'll just log the instruction data to the console. Add this after the `process_instruction` function:

```rs
pub fn add_movie_review(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    title: String,
    rating: u8,
    description: String
) -> ProgramResult {

    msg!("Adding movie review...");
    msg!("Title: {}", title);
    msg!("Rating: {}", rating);
    msg!("Description: {}", description);

    Ok(())
}
```

Now we can update the `process_instruction` function to use the `unpack` and `add_movie_review` functions:

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
        }
    }
}
```
All we're doing here is unpacking the instruction data and then calling the `add_movie_review` function with the correct arguments.

Our program is now complete! Make sure you hit the deploy button and copy over the program id from the playground.

If that felt underwhelming, it's because we went over each part of this in the last lesson. Let's try adding a movie review to our program using a client.

#### ✍ Submit a movie review
We're speeding through this, let's goooooooooooooooo.

There's no need to write a script from scratch, I trust you know how to do it :)

Here's how you can set up a complete script with everything you'll need:
```bash
git clone https://github.com/buildspace/solana-movie-client
cd solana-movie-client
npm install
```

Open up `src/index.js` and update the program id on line 94 to the one you copied from the playground. If you changed up the program at all, here's where you'll need to update the client as well. 

Smack in `npm start` and you should get an explorer link in the terminal. Hit that bad boy and scroll down to the program instruction logs and you should see your movie review!

![](https://hackmd.io/_uploads/BkxCm27Ej.png)

EZPZ WE GOT THIS LEGOOOOOOOOOOOOOOOOO

#### 🚢 Ship challenge
For this lesson's challenge, try replicating the Student Intro program.

The program takes a user's name and a short message as the instruction_data and creates an account to store the data on-chain.

Using what you've learned in this lesson, build the Student Intro program to the point where you can print the name and message provided by the user to the program logs when the program is invoked.

**Solution code**
You can test your program by building this frontend and then checking the program logs on Solana Explorer. Remember to replace the program ID in the frontend code with the one you've deployed.

Try to do this independently if you can! But if you get stuck, feel free to reference the [solution code](https://beta.solpg.io/62b0ce53f6273245aca4f5b0).

I BELIEVE IN YOU.