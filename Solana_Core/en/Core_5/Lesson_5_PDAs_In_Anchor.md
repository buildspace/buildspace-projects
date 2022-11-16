### 🛣 PDAs in Anchor
Now you’re rocking. Let’s take this to 11.

In this lesson we’ll go over how use `#[account(...)]` attribute with the following constraints:

- `seeds` and `bump` - to initialize and validate PDAs
- `realloc` - to reallocate space on an account
- `close` - to close an account

#### 🛣 PDAs in Anchor
Recall that [PDAs](https://github.com/Unboxed-Software/solana-course/blob/main/content/pda.md) are derived using a list of optional seeds, a bump seed, and a `programId`. Anchor provides a convenient way to validate a PDA with the `seeds` and `bump` constraints.

![](https://hackmd.io/_uploads/B15mwpsHi.png)

During account validation, Anchor will derive a PDA using the seeds specified in the `seeds` constraint and verify that the account passed into the instruction matches the PDA found using the specified `seeds`.

When the bump constraint is included without specifying a specific bump, Anchor will default to using the canonical bump (the first bump that results in a valid PDA).

![](https://hackmd.io/_uploads/B1HVDpoSj.png)

In this example, the seeds and bump constraints are used to validate that the address of the pda_account is the expected PDA.

The `seeds` used derive the PDA include:
- `example_seed` - a hardcoded string value
- `user.key()` - the public key of the account passed in as the `user`
- `instruction_data` - the instruction data passed into the instruction.
    - You can access instruction data using the `#[instruction(...)]` attribute.

![](https://hackmd.io/_uploads/SJ2EwToHi.png)

- When using the `#[instruction(...)]` attribute, the instruction data must be in the order that was passed into the instruction.
- You can omit all arguments after the last one you need.

![](https://hackmd.io/_uploads/HJeHDasrs.png)

An error would result if the inputs were listed in a different order:

![](https://hackmd.io/_uploads/rJDBPpoBs.png)

You can combine the `init` constraint with the `seeds` and `bump` constraints to initialize an account using a PDA.

The `init` constraint must be used in combination with:
- `payer` - account specified to pay for the initialization
- `space` - space allocated to new account
- `system_program` - the `init` constraint requires `system_program` to exist in the account validation struct

By default init sets the owner of the created account to the currently executing program. 
- When using `init` with `seeds` and `bump` to initialize an account using a PDA, the owner must be the executing program.
- This is because creating an account requires a signature for which only the PDAs of the executing program can provide
- (i.e. the signature verification for the initialization of the PDA account would fail if the programId used to derive the PDA did not match the programId of the executing program).
- The `bump` value does not need to be specified since `init` uses `find_program_address` to derive the PDA.
- This means that the PDA will be derived using the canonical bump.
- When allocating `space` for an account initialized and owned by the executing Anchor program, remember that the first 8 bytes are reserved for a unique account discriminator that Anchor calculates and uses to identify the program account types.

#### 🧮 Realloc
More often than creating new accounts, you'll be updating existing ones. Anchor has the awesome `realloc` constraint that provides a simply way to reallocate space for existing accounts.

![](https://hackmd.io/_uploads/B1twP6jBs.png)

The `realloc` constraint must be used in combination with:
- `mut` - the account must be set as mutable
- `realloc::payer`  - the account to subtract or add lamports to depending on whether the reallocation is decreasing or increasing account space
- `realloc::zero` - boolean to specify if new memory should be zero initialized
- `system_program` - the `realloc` constraint requires `system_program` to exist in the account validation struct

For example, reallocate space for an account that stores a `data` field of type `String`.
- When using `String` types, an addition 4 bytes of space is used to store the length of the `String` in addition to the space allocated for the `String` itself.
- If the change in account data length is additive, lamports will be transferred from the `realloc::payer` into the program account in order to maintain rent exemption.
- If the change is subtractive, lamports will be transferred from the program account back into the `realloc::payer`.
- The `realloc::zero` constraint is required in order to determine whether the new memory should be zero initialized after reallocation.
- This constraint should be set to true in cases where you are expanding the space on an account that has previously been reduced.

#### ❌ Close
What happens when you're done with an account and don't want it to exist? You can close it!

This lets you free up space and you get the SOL paid for rent back! 

This is done using the `close` constraint:

![](https://hackmd.io/_uploads/HyxuD6iHo.png)

- The `close` constraint marks the account as closed at the end of the instruction’s execution by setting its discriminator to the `CLOSED_ACCOUNT_DISCRIMINATOR` and sends its lamports to a specified account.
- Setting the discriminator to a special variant makes account revival attacks (where a subsequent instruction adds the rent exemption lamports again) impossible.
- We are closing the `data_account` and sending the lamports allocated for rent to the `receiver` account.
- However, currently anyone can call the close instruction and close the `data_account`

![](https://hackmd.io/_uploads/SJHdDTorj.png)

- The `has_one` constraint can be used to check that an account passed into the instruction matched one stored on `data` field of an account
- You must use the naming convention on the `data` field of the account you are using the `has_one` constraint to check against
- To use `has_one = receiver`:
    - the `data` of the account to check against be have a `receiver` field
    - the account name in the `#[derive(Accounts)]` struct must also be called `receiver`
- Note that using with the `close` constraint is just an example and the `has_one` constraint can be used more generally
