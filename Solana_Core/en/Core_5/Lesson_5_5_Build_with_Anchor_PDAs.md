Before we move on to CPIs, let’s show the world what these PDAs can do. 🎸

We’ll create a Movie Review program using the Anchor framework.

This program will allow users to:

- Use a PDA to initialize a new Movie Review account to store the review
- Update the content of an existing Movie Review account
- Close an existing Movie Review account

#### Setup
Head over to [https://beta.solpg.io/](https://beta.solpg.io/), create a SolPG wallet if you don't have one, and replace default code in `[lib.rs](http://lib.rs)` with:

```rs
use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod movie_review {
    use super::*;

}
```

#### 🎥 `MovieAccountState`
The first thing we'll start with is defining the state accounts.  
```rs
use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod movie_review {
    use super::*;

}

#[account]
pub struct MovieAccountState {
    pub reviewer: Pubkey,    // 32
    pub rating: u8,          // 1
    pub title: String,       // 4 + len()
    pub description: String, // 4 + len()
}
```

Each movie review account will store:
  - `reviewer` - user creating the review
  - `rating` - rating for the movie
  - `title` - title of the movie
  - `description` - content of the review

Pretty straightforward so far!

#### 🎬 Add movie reviews
Thanks to Anchor can skip all the validation and security and go straight to adding the `add_move_review` function:
```rs
#[program]
pub mod movie_review{
    use super::*;

    pub fn add_movie_review(
        ctx: Context<AddMovieReview>,
        title: String,
        description: String,
        rating: u8,
    ) -> Result<()> {
        msg!("Movie Review Account Created");
        msg!("Title: {}", title);
        msg!("Description: {}", description);
        msg!("Rating: {}", rating);
        
        let movie_review = &mut ctx.accounts.movie_review;
        movie_review.reviewer = ctx.accounts.initializer.key();
        movie_review.title = title;
        movie_review.rating = rating;
        movie_review.description = description;
        Ok(())
    }
}

...
```

This should all be looking very familiar - it's a concise version of the native movie review program we built.

Let's add the `Context` for this:

```rs
#[program]
pub mod movie_review {
    use super::*;
		
		...
}

#[derive(Accounts)]
#[instruction(title:String, description:String)]
pub struct AddMovieReview<'info> {
    #[account(
        init,
        seeds = [title.as_bytes(), initializer.key().as_ref()],
        bump,
        payer = initializer,
        space = 8 + 32 + 1 + 4 + title.len() + 4 + description.len()
    )]
    pub movie_review: Account<'info, MovieAccountState>,
    #[account(mut)]
    pub initializer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

...
```

Again, we're doing the same thing we did natively, but with the magic of Anchor. 

We're initializing a new `movie_review` account with a PDA derived using two `seeds`:
- `title` - the title of the movie from the instruction data
- `initializer.key()` - the public key of the `initializer` creating the movie review

We're also doing the `space` allocation to the new account based on the structure of the `MovieAccountState` account type right here.

#### 🎞 Update movie reviews
Instead of testing this tiny program, we can just finish it out! Here's what the update function will look like:

```rs
#[program]
pub mod movie_review {
    use super::*;

		...

    pub fn update_movie_review(
        ctx: Context<UpdateMovieReview>,
        title: String,
        description: String,
        rating: u8,
    ) -> Result<()> {
        msg!("Updating Movie Review Account");
        msg!("Title: {}", title);
        msg!("Description: {}", description);
        msg!("Rating: {}", rating);

        let movie_review = &mut ctx.accounts.movie_review;
        movie_review.rating = rating;
        movie_review.description = description;

        Ok(())
    }

}

...
```

The data arguments are the same as `add_movie_review`. The main thing that changes here is the `Context` we pass in. Let's define it:

```rs
#[program]
pub mod movie_review {
    use super::*;
		
		...
}

#[derive(Accounts)]
#[instruction(title:String, description:String)]
pub struct UpdateMovieReview<'info> {
    #[account(
        mut,
        seeds = [title.as_bytes(), initializer.key().as_ref()],
        bump,
        realloc = 8 + 32 + 1 + 4 + title.len() + 4 + description.len(),
        realloc::payer = initializer,
        realloc::zero = true,
    )]
    pub movie_review: Account<'info, MovieAccountState>,
    #[account(mut)]
    pub initializer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

...
```

We're using the `seeds` and `bump` constraints to validate that `movie_review` account. Since the space taken up will likely change, we're using the `realloc` constraint to have Anchor handle the reallocation of space and rent for the account based on the length of the updated description.

The `realloc::payer` constraint specifies that any additional lamports required or refunded will come from or be send to the initializer account.

The `realloc::zero` constraint is set to `true` because the `movie_review` account may be updated multiple times either shrinking or expanding the space allocated to the account.


#### ❌ Close Movie Review
The last bit here is to implement the `close` instruction to close an existing `movie_review` account. All we need here is a `Context` type of `Close`, no data necessary!

```rs
#[program]
pub mod movie_review {
    use super::*;
		
		...

    pub fn close(_ctx: Context<Close>) -> Result<()> {
        Ok(())
    }

}

...
```

And the `Context` for this:

```rs
#[program]
pub mod movie_review {
    use super::*;
		
		...
}

#[derive(Accounts)]
pub struct Close<'info> {
    #[account(mut, close = reviewer, has_one = reviewer)]
    movie_review: Account<'info, MovieAccountState>,
    #[account(mut)]
    reviewer: Signer<'info>,
}

...
```

We're using the `close` constraint to specify we are closing the `movie_review` account and that the rent should be refunded to the `reviewer` account. 

The `has_one` constraint is used to restrict closing the account - the `reviewer` account must match the `reviewer` on the Movie Review account.

We're all done! Test it out, it'll behave the same as the old native movie review program. You can compare with the solution code [here](https://beta.solpg.io/631b39c677ea7f12846aee8c) if something goes wrong :)

#### 🚢 Ship challenge
Now it’s your turn to build something independently. Because we're starting with very simple programs, yours will look almost identical to what we just created. It's useful to try and get to the point where you can write it from scratch without referencing prior code, so try not to copy and paste here.

1. Write a new program that initializes a `counter` account and set the `count` field using the an instruction data argument passed into the instruction
2. Implement `initialize`, `increment` and `decrement` instructions
3. Following what we did in the demo, write testes for each instruction
4. Use `anchor deploy` to deploy your program. If you’re up for it, write a script like we’ve done previously to send transactions to your newly deployed program, then use Solana Explorer to look at the program logs.

As always, get creative with these challenges and take them beyond the basic instructions if you want - and have fun!

Try to do this independently if you can! But if you get stuck, feel free to reference the `solution-decrement` branch of [this repository](https://github.com/Unboxed-Software/anchor-counter-program/tree/solution-decrement).
