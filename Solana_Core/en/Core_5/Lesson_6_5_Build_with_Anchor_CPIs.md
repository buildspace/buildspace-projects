Back to the future. We're gonna come full circle and finish out or movie review program with CPIs.

This time, let’s: 
- Add instruction to create token mint with metadata
- Add instruction to add comments
- Mint tokens when creating a review
- Mint tokens when adding a comment

**Starter code**
- starter code: [https://beta.solpg.io/63184c17bb7e0b5f4ca6dfa5](https://beta.solpg.io/63184c17bb7e0b5f4ca6dfa5)
- We’ll be building on top of the previous PDA demo

The first thing we wanna do is define the `create_reward_mint` instruction:
```rs
pub fn create_reward_mint(
        ctx: Context<CreateTokenReward>,
        uri: String,
        name: String,
        symbol: String,
    ) -> Result<()> {
        msg!("Create Reward Token");

        let seeds = &["mint".as_bytes(), &[*ctx.bumps.get("reward_mint").unwrap()]];

        let signer = [&seeds[..]];

        let account_info = vec![
            ctx.accounts.metadata.to_account_info(),
            ctx.accounts.reward_mint.to_account_info(),
            ctx.accounts.reward_mint.to_account_info(),
            ctx.accounts.user.to_account_info(),
            ctx.accounts.token_metadata_program.to_account_info(),
            ctx.accounts.token_program.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
            ctx.accounts.rent.to_account_info(),
        ];

        invoke_signed(
            &create_metadata_accounts_v2(
                ctx.accounts.token_metadata_program.key(),
                ctx.accounts.metadata.key(),
                ctx.accounts.reward_mint.key(),
                ctx.accounts.reward_mint.key(),
                ctx.accounts.user.key(),
                ctx.accounts.user.key(),
                name,
                symbol,
                uri,
                None,
                0,
                true,
                true,
                None,
                None,
            ),
            account_info.as_slice(),
            &signer,
        )?;

        Ok(())
    }
```

This is long but dead simple! We're making a CPI to `create_metadata_account_v2` instruction on Token Metadata program.

Next, we see the `CreateTokenReward` context type.
```rs
#[derive(Accounts)]
pub struct CreateTokenReward<'info> {
    #[account(
        init,
        seeds = ["mint".as_bytes().as_ref()],
        bump,
        payer = user,
        mint::decimals = 6,
        mint::authority = reward_mint,

    )]
    pub reward_mint: Account<'info, Mint>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    pub token_program: Program<'info, Token>,

    /// CHECK:
    #[account(mut)]
    pub metadata: AccountInfo<'info>,
    /// CHECK:
    pub token_metadata_program: AccountInfo<'info>,
}
```

####  create `ErrorCode`

- Error code to check rating
- (Anchor handles the other checks we had in Native version)

```rust
#[error_code]
pub enum ErrorCode {
    #[msg("Rating greater than 5 or less than 1")]
    InvalidRating,
}
```

#### Update `add_movie_review`

- Add `ErrorCode` check
- Set `counter` on Comment Counter Account
- CPI to `mintTo` instruction to mint tokens to reviewer

```rust
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

        if rating > 5 || rating < 1 {
            msg!("Rating cannot be higher than 5");
            return err!(ErrorCode::InvalidRating);
        }

        let movie_review = &mut ctx.accounts.movie_review;
        movie_review.reviewer = ctx.accounts.initializer.key();
        movie_review.title = title;
        movie_review.rating = rating;
        movie_review.description = description;

        msg!("Movie Comment Counter Account Created");
        let movie_comment_counter = &mut ctx.accounts.movie_comment_counter;
        movie_comment_counter.counter = 0;
        msg!("Counter: {}", movie_comment_counter.counter);

        let seeds = &["mint".as_bytes(), &[*ctx.bumps.get("reward_mint").unwrap()]];

        let signer = [&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token::MintTo {
                mint: ctx.accounts.reward_mint.to_account_info(),
                to: ctx.accounts.token_account.to_account_info(),
                authority: ctx.accounts.reward_mint.to_account_info(),
            },
            &signer,
        );

        token::mint_to(cpi_ctx, 10000000)?;
        msg!("Minted Tokens");
        Ok(())
    }
```

#### Update `AddMovieReview` context

- initialize `movie_review`
- initialize `movie_comment_counter`
- use `init_if_needed` to initialize token account

```rust
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
    #[account(
        init,
        seeds = ["counter".as_bytes(), movie_review.key().as_ref()],
        bump,
        payer = initializer,
        space = 8 + 8
    )]
    pub movie_comment_counter: Account<'info, MovieCommentCounter>,
    #[account(mut,
        seeds = ["mint".as_bytes().as_ref()],
        bump
    )]
    pub reward_mint: Account<'info, Mint>,
    #[account(
        init_if_needed,
        payer = initializer,
        associated_token::mint = reward_mint,
        associated_token::authority = initializer
    )]
    pub token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub initializer: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
}
```

#### Add** `ErrorCode` to `update_movie_review`

- add `ErrorCode` check to `update_movie_review` instruction

```rust
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

        if rating > 5 || rating < 1 {
            msg!("Rating cannot be higher than 5");
            return err!(ErrorCode::InvalidRating);
        }

        let movie_review = &mut ctx.accounts.movie_review;
        movie_review.rating = rating;
        movie_review.description = description;

        Ok(())
    }
```

#### Add** `add_comment`

- Create `add_comment` instruction
- set `movie_comment` data
- increment `movie_comment_counter`
- CPI to `mintTo` instruction to mint tokens to reviewer

```rust
pub fn add_comment(ctx: Context<AddComment>, comment: String) -> Result<()> {
        msg!("Comment Account Created");
        msg!("Comment: {}", comment);

        let movie_comment = &mut ctx.accounts.movie_comment;
        let movie_comment_counter = &mut ctx.accounts.movie_comment_counter;

        movie_comment.review = ctx.accounts.movie_review.key();
        movie_comment.commenter = ctx.accounts.initializer.key();
        movie_comment.comment = comment;
        movie_comment.count = movie_comment_counter.counter;

        movie_comment_counter.counter += 1;

        let seeds = &["mint".as_bytes(), &[*ctx.bumps.get("reward_mint").unwrap()]];

        let signer = [&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token::MintTo {
                mint: ctx.accounts.reward_mint.to_account_info(),
                to: ctx.accounts.token_account.to_account_info(),
                authority: ctx.accounts.reward_mint.to_account_info(),
            },
            &signer,
        );

        token::mint_to(cpi_ctx, 5000000)?;
        msg!("Minted Tokens");

        Ok(())
    }
```

#### Add `AddComment` context

- initialize `movie_comment`
- use `init_if_needed` to initialize token account

```rust
#[derive(Accounts)]
#[instruction(comment:String)]
pub struct AddComment<'info> {
    #[account(
        init,
        seeds = [movie_review.key().as_ref(), &movie_comment_counter.counter.to_le_bytes()],
        bump,
        payer = initializer,
        space = 8 + 32 + 32 + 4 + comment.len() + 8
    )]
    pub movie_comment: Account<'info, MovieComment>,
    pub movie_review: Account<'info, MovieAccountState>,
    #[account(
        mut,
        seeds = ["counter".as_bytes(), movie_review.key().as_ref()],
        bump,
    )]
    pub movie_comment_counter: Account<'info, MovieCommentCounter>,
    #[account(mut,
        seeds = ["mint".as_bytes().as_ref()],
        bump
    )]
    pub reward_mint: Account<'info, Mint>,
    #[account(
        init_if_needed,
        payer = initializer,
        associated_token::mint = reward_mint,
        associated_token::authority = initializer
    )]
    pub token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub initializer: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
}
```

####  Build, Deploy, Test
Solution: [https://beta.solpg.io/6319c7bf77ea7f12846aee87](https://beta.solpg.io/6319c7bf77ea7f12846aee87)

- build and deploy
- test using SolPG

