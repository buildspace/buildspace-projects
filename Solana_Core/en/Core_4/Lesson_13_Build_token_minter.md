
#### Minting, Staking and more...
Alright, wow wow wow, we've come a long, let's get back to the NFT Staking Program. Today, we're gonna add all the token program interaction that's required to mint reward tokens to stakers, and to actually perform the staking operations. Unlike before, we're moving off of the Solana Playground, so we'll be doing all of this locally. Feel free to start with this code: [starter repo: solutions-sans-tokens branch](https://github.com/Unboxed-Software/solana-nft-staking-program/tree/solution-sans-tokens).

You'll notice a couple of different things here. There's now a 'TS' folder which has everything we previously had in our client project, in the Solana Playground.

One import modification is that in (/<project-name>/src/ts/src/utils/constants.ts), the `PROGRAM_ID` is being read from projects keypair.

```ts
const string = fs.readFileSync(
  "../target/deploy/solana_nft_staking_program-keypair.json",
  "utf8"
)

...

export const PROGRAM_ID = Keypair.fromSecretKey(secretKey).publicKey
```

ok, Ready! Let's get going, first change into the *TS* directory, and run *npm run start* -- hopefully you've already done *cargo build bpf* and *solana deploy*, and your clusters are set to be the same, if yes to all that, it should get up and running. You should see that stakes, redeems, and unstakes printing to the console. Patience young padawan, this will take a minute or two.

Assuming no errors 🎉, let's hop into the processor file: (/<project-name>/src/processor.rs).

First, let's address some imports with the following use statements:

```
use mpl_token_metadata::ID as mpl_metadata_program_id;
use spl_token::ID as spl_token_program_id;
```
Also, add `invoke` to *solana_program::program::{invoke_signed}* import.

Hop on down to the `process_stake` function, here we will make our first changes.

Get used to this, it'll happen often, we will find ourselves adding accounts, many accounts, to many places...so, time to add some accounts, which will allow us to actually work with the token program.

```
let nft_mint = next_account_info(account_info_iter)?;
let nft_edition = next_account_info(account_info_iter)?;
let stake_state = next_account_info(account_info_iter)?;
let program_authority = next_account_info(account_info_iter)?;
let token_program = next_account_info(account_info_iter)?;
let metadata_program = next_account_info(account_info_iter)?; 
```
#### Delegating and Freezing -- Staking
Next, we need to add this program as a delegate for our NFT, delegating authority of our NFT so the program can submit transactions on our behalf.

```rs
    msg!("Approving delegation");
    invoke(
        &spl_token::instruction::approve(
            &spl_token_program_id,
            nft_token_account.key,
            program_authority.key,
            user.key,
            &[user.key],
            1,
        )?,
        &[
            nft_token_account.clone(),
            program_authority.clone(),
            user.clone(),
            token_program.clone(),
        ],
    )?;
```

Now we can move onto the actual freezing of the token. We're not actually changing ownership of the token, simply freezing it so nothing can be done with the token while it is staking. Before we do that, we need to derive the pda for the program authority. In short, we're using a PDA on the program, to be the authority that is delegated as the authority on the token mint, for being able to freeze the account. 

Don't forget to throw in those checks to make sure the PDAs are being derived.

```
let (delegated_auth_pda, delegate_bump) =
        Pubkey::find_program_address(&[b"authority"], program_id);
        
if delegated_auth_pda != *program_authority.key {
        msg!("Invalid seeds for PDA");
        return Err(StakeError::InvalidPda.into());
    }
```

Back to the freezing itself, unlike the delegration approval, this one uses `invoke_signed` as it is signing from our program.


```rs
   msg!("freezing NFT token account");
    invoke_signed(
        &mpl_token_metadata::instruction::freeze_delegated_account(
            mpl_metadata_program_id,
            *program_authority.key,
            *nft_token_account.key,
            *nft_edition.key,
            *nft_mint.key,
        ),
        &[
            program_authority.clone(),
            nft_token_account.clone(),
            nft_edition.clone(),
            nft_mint.clone(),
            metadata_program.clone(),
        ],
        &[&[b"authority", &[delegate_bump]]],
    )?;
```

This is a PDA of our program that now has the authority to freeze the token. 🧊

That's that, let's hop on over to the typescript file (/<project-name>/ts/src/utils/instruction.rs) and add more accounts (see, I told ya, add more accounts and add more accounts and...) to the `createStakingInstruction` function, to get this working. 

You want to match the accounts we have in the `process_stake` function in the (/<project-name>/src/processor.rs) file, let's make sure to add :

```
nftMint: PublicKey,
nftEdition: PublicKey,
tokenProgram: PublicKey,
metadataProgram: PublicKey,
```
Next we add all those to the accounts below, in the right order, in the `TransactionInstruction`. The order matters.

...but first, pull in the authority account:

```
const [delegateAuthority] = PublicKey.findProgramAddressSync(
    [Buffer.from("authority")],
    programId
  )
```

There are a total of 5 new accounts you need to, again, make sure they are in order. Additionally, check to see which are writable and which are signers.

```
...
{
        pubkey: nftMint,
        isWritable: false,
        isSigner: false,
      },
      {
        pubkey: nftEdition,
        isWritable: false,
        isSigner: false,
      },
...
{
        pubkey: delegateAuthority,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: tokenProgram,
        isWritable: false,
        isSigner: false,
      },
      {
        pubkey: metadataProgram,
        isWritable: false,
        isSigner: false,
      },
```

#### Testing our staking functionality
Next, hop on over to the index file (/<project-name>/ts/src/index.rs), to add the same matching accounts where the `stakeInstruction` is created, in the `testStaking` function.

Here are the 4 additions:

```
    nft.mintAddress,
    nft.masterEditionAddress,
    TOKEN_PROGRAM_ID,
    METADATA_PROGRAM_ID,
```

```import { PROGRAM_ID as METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata"```

Time to test it our progress, make sure you're inside the `ts` director and do an `npm run start`.

Assuming no errors, let's pop back into the `processor.rs` file and add similar data to our `process_redeem` function.

#### Delegating and Freezing -- Redeeming

First, guess what, we add accounts -- there will be 4 of them!!

```rs
let stake_mint = next_account_info(account_info_iter)?;
let stake_authority = next_account_info(account_info_iter)?;
let user_stake_ata = next_account_info(account_info_iter)?;
let token_program = next_account_info(account_info_iter)?;
```

Back to validation for some of these new accounts. Let's derive our `stake_auth_pda`, then the validation for the pda with a custom error.

```rs
let (stake_auth_pda, auth_bump) = Pubkey::find_program_address(&[b"mint"], program_id);

if *stake_authority.key != stake_auth_pda {
        msg!("Invalid stake mint authority!");
        return Err(StakeError::InvalidPda.into());
    }
```

Scroll down a bit, after we figure out the `redeem_amount`, we will call an `invoke_signed`, to call the token program, to mint tokens. We need the various keys for the instruction, and then the required accounts, and finally the seeds for the auth. Don't forget to propogate the error with the `?` or the red squigglies lines won't leave you alone.

```rs
    invoke_signed(
        &spl_token::instruction::mint_to(
            token_program.key,
            stake_mint.key,
            user_stake_ata.key,
            stake_authority.key,
            &[stake_authority.key],
            redeem_amount.try_into().unwrap(),
        )?,
        &[
            stake_mint.clone(),
            user_stake_ata.clone(),
            stake_authority.clone(),
            token_program.clone(),
        ],
        &[&[b"mint", &[auth_bump]]],
    )?;
```

That should handle the minting in this file, but we have to go add the new accounts on the client side.

We hop back into the `instruction.ts` file from earlier, scroll down to `createRedeemInstruction` to add the accounts below.

```
mint: PublicKey,
userStakeATA: PublicKey,
tokenProgram: PublicKey,
```
Now, remember, some accounts are derived, in this instance, it's the authority account, so we don't need to add it manually.

Then hop down to the `TransactionInstruction` itself, first we derive the `mintAuth`.

```tsx
const [mintAuth] = PublicKey.findProgramAddressSync(
    [Buffer.from("mint")],
    programId
  )
```

Next hop into the `return new TransactionInstruction` to add the associated accounts, and whether they are writable and/or signable. Here are the 4 we need to add -- and remember, the order matters.

```tsx
{
    pubkey: mint,
    isWritable: true,
    isSigner: false,
  },
  {
    pubkey: mintAuth,
    isWritable: false,
    isSigner: false,
  },
  {
    pubkey: userStakeATA,
    isWritable: true,
    isSigner: false,
  },
  {
    pubkey: tokenProgram,
    isSigner: false,
    isWritable: false,
  },
```

That should be everything we need for redeeming. We finally need to hop back into the same `index.ts` file, and make sure we're calling this properly, but it's a bit involved, so first let's go back into `processor.rs` and finish the `process_unstake` function.

#### Delegating and Freezing -- UnStaking
Process unstake is basically combining everything we just did for staking and redeeming, so it'll require all of the accounts we just worked with.

Here are all the accounts we need to add:

```tsx
    let nft_mint = next_account_info(account_info_iter)?;
    let nft_edition = next_account_info(account_info_iter)?;
    ... (stake_state should be here from our previous code)
    let program_authority = next_account_info(account_info_iter)?;
    let stake_mint = next_account_info(account_info_iter)?;
    let stake_authority = next_account_info(account_info_iter)?;
    let user_stake_ata = next_account_info(account_info_iter)?;
    let token_program = next_account_info(account_info_iter)?;
    let metadata_program = next_account_info(account_info_iter)?;
```

We can scroll down and add a couple of validations, we are just copy/pasting from the `process_stake` and `process_redeem` functions:

```tsx
let (delegated_auth_pda, delegate_bump) =
        Pubkey::find_program_address(&[b"authority"], program_id);
if delegated_auth_pda != *program_authority.key {
        msg!("Invalid seeds for PDA");
        return Err(StakeError::InvalidPda.into());
    }

let (stake_auth_pda, auth_bump) = Pubkey::find_program_address(&[b"mint"], program_id);
if *stake_authority.key != stake_auth_pda {
        msg!("Invalid stake mint authority!");
        return Err(StakeError::InvalidPda.into());
    }
```

Alright, so this is quite new, we're going to "thaw" the NFT token account. If you recall, we froze it up above, so no we'll unfreeze it.

This code is the exact opposite of the freeze code above, we just have to change the helper function and use `thaw_delegated_account`.

```tsx
msg!("thawing NFT token account");
    invoke_signed(
        &mpl_token_metadata::instruction::thaw_delegated_account(
            mpl_metadata_program_id,
            *program_authority.key,
            *nft_token_account.key,
            *nft_edition.key,
            *nft_mint.key,
        ),
        &[
            program_authority.clone(),
            nft_token_account.clone(),
            nft_edition.clone(),
            nft_mint.clone(),
            metadata_program.clone(),
        ],
        &[&[b"authority", &[delegate_bump]]],
    )?;
```

Next, we need to revoke the delegation authority. This is similar, but not exactly the same as the approving of the delegation. We can remove the `program_authority` field as it's not necessary, and the `amount` from the approve helper function.

```tsx
msg!("Revoke delegation");
    invoke(
        &spl_token::instruction::revoke(
            &spl_token_program_id,
            nft_token_account.key,
            user.key,
            &[user.key],
        )?,
        &[
            nft_token_account.clone(),
            user.clone(),
            token_program.clone(),
        ],
    )?;
```

Finally, we will copy the `invoke_signed` from the redeem function, paste it under the `redeem_amount`.

```tsx
invoke_signed(
        &spl_token::instruction::mint_to(
            token_program.key,
            stake_mint.key,
            user_stake_ata.key,
            stake_authority.key,
            &[stake_authority.key],
            redeem_amount.try_into().unwrap(),
        )?,
        &[
            stake_mint.clone(),
            user_stake_ata.clone(),
            stake_authority.clone(),
            token_program.clone(),
        ],
        &[&[b"mint", &[auth_bump]]],
    )?;
```

Oh, one more thing, we didn't actually set the `redeem_amount`, we just used `unix_time` previously. So instead, put `100 * unit_time`, we can adjust this later. Make sure to make the change in both functions above.

That should be it here, back to `instruction.ts` file on the client side to add all the accounts. Scroll down to the `createUnstakeInstruction`, add the following as arguments.

```
nftMint: PublicKey,
nftEdition: PublicKey,
stakeMint: PublicKey,
userStakeATA: PublicKey,
tokenProgram: PublicKey,
metadataProgram: PublicKey,
```

Again, a few are derived automatically, so we don't have add manually.

Next we derive the `delegateAuthority` and `mintAuth`, this is identical to the code above.

```tsx
const [delegateAuthority] = PublicKey.findProgramAddressSync(
    [Buffer.from("authority")],
    programId
  )

const [mintAuth] = PublicKey.findProgramAddressSync(
    [Buffer.from("mint")],
    programId
  )
```

Finally, we add them all to the instruction. This is a lot of accounts, so we've just posted it all here, instead of just the ones we're adding. Save your eyes a bit of back and forth between functions and files. 

```
 {
    pubkey: nftHolder,
    isWritable: false,
    isSigner: true,
  },
  {
    pubkey: nftTokenAccount,
    isWritable: true,
    isSigner: false,
  },
  {
    pubkey: nftMint,
    isWritable: false,
    isSigner: false,
  },
  {
    pubkey: nftEdition,
    isWritable: false,
    isSigner: false,
  },
  {
    pubkey: stakeAccount,
    isWritable: true,
    isSigner: false,
  },
  {
    pubkey: delegateAuthority,
    isWritable: true,
    isSigner: false,
  },
  {
    pubkey: stakeMint,
    isWritable: true,
    isSigner: false,
  },
  {
    pubkey: mintAuth,
    isWritable: false,
    isSigner: false,
  },
  {
    pubkey: userStakeATA,
    isWritable: true,
    isSigner: false,
  },
  {
    pubkey: tokenProgram,
    isWritable: false,
    isSigner: false,
  },
  {
    pubkey: metadataProgram,
    isWritable: false,
    isSigner: false,
  },
```

#### Testing our functionality
Ok, ok, I know you can feel it, we're getting close...let's finally go back to the `index.ts` file to call out and test all the functions. We need the mint address for our token and token account for our user, for the `testRedeem` function, as well as the `createUnstakeInstruction`.

First we add the following to the `testRedeem` function parameters.

```
stakeMint: web3.PublicKey,
userStakeATA: web3.PublicKey
```

Then we add them to the `createRedeemInstruction` below.

```
stakeMint,
userStakeATA,
TOKEN_PROGRAM_ID,
PROGRAM_ID
```

Make the same additions as above to the `testUnstaking` function. 

Then for `createUnstakingInstruction`, add the following.

```
nft.mintAddress,
nft.masterEditionAddress,
stakeMint,
userStakeATA,
TOKEN_PROGRAM_ID,
METADATA_PROGRAM_ID,
```

Now scroll down to the call site in the `main()` function, you'll notice `testRedeem` and `testUnstaking` are both red as they need more info passed in.

First we need to declare the `stakeMint`, which we will hardcode for now, and `userStakeATA`, which calls a function that will create the ATA if it doesn't exist yet.  

```tsx
const stakeMint = new web3.PublicKey(
    "EMPTY FOR A MINUTE"
  )

const userStakeATA = await getOrCreateAssociatedTokenAccount(
    connection,
    user,
    stakeMint,
    user.publicKey
  )
```

...and now, change the calls to take the additional arguments:

```tsx
  await testRedeem(connection, user, nft, stakeMint, userStakeATA.address)
  await testUnstaking(connection, user, nft, stakeMint, userStakeATA.address)
```

#### Front-end edits to test functionality
We're briefly going to change to the front-end Buildoors project, into the `index.ts` file (/<project-name>/tokens/bld/index.ts). In here we are creating the BLD token with the `createBldToken` function. 

Inside that function, we call `token.CreateMint` the 3rd argument is the mint authority, which controls the minting. At first, this is a `payer.publicKey` for the intial call. In short order, we'll be changing the mint authority.

First we add a parameter to the *createBldToken* function.

``` programId: web3.PublicKey ```

Then scroll all the way down to the call site in main, and for the `await createBldToken` call, add the 3rd argument.

```new web3.PublicKey("USE YOUR PROGRAM ID")```

If you cannot find your program ID, you can deploy again and the console will show you the program ID you need.

Scroll back up, above `const tokenMint`, pull in `mintAuth`. You can find the auth for the below in redeem from the anchor-nft-staking program.

```tsx
const [mintAuth] = await web3.PublicKey.findProgramAddress(
    [Buffer.from("mint")],
    programId
  )
```

Scroll back down, after the `transactionSignature` is created, we'll set the new mint authority. (this is the change we mentioned above)

```tsx
await token.setAuthority(
    connection,
    payer,
    tokenMint,
    payer.publicKey,
    token.AuthorityType.MintTokens,
    mintAuth
  )
```

Now, we're able to recreate the BLD token with the new auth, and we can take that and add it to the `stakeMint` above.

```tsx
const stakeMint = new web3.PublicKey(
    "EMPTY FOR A MINUTE"
  )
```

#### Finally, test it all out
So, switch into the home directory and run `npm run create-bld-token`. Make sure you are set to devnet.

Check your build script, it should be:

```"creat-bld-token": "ts-node tokens/bld/index.ts"```

Once it is successfully finished, go grab your new mint key from the *cache.json* in the *tokens/bld* directory.

Now, we finally head back to the nft-staking program, and use this key in the `stakeMint` creation, 

```tsx
const stakeMint = new web3.PublicKey(
    "MINT KEY FROM CACHE.JSON"
  )
```

All should be set and working now, cd back into the ts directory, and test it all with *npm run start*. If all is well, your console should confirm initialization, staking, redeeming, and unstaking.

This was A LOT. Take a breath, you're crushing. This is super challenging, go back, review, do it again, whatever it takes -- if you can master this stuff, you'll be well on your way to becoming a solid Solana dev.
