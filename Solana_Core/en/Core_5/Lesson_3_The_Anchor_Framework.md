When building natively, we organized our program into multiple files, one for each concern. Since Anchor cuts down so much code, we'll now learn how it organizes the program into distinct sections in a single file 😎

We can combine everything into one file because Anchor abstracts away various repetitive tasks using macros. Instead of writing tons of code, we just put a macro in there and let Anchor do it for us. This also means we can separate the instruction logic from account validation and security checks.  

Before we move on, a quick reminder of some of the boring stuff we had to write a lot of boilerplate for:
- Account validation
- Security checks
- Serialization/deserialization

Anchor handles all of these for us using some Rust magic ✨ **and** it's designed to handle many common security concerns so you can build more secure programs!

#### 🍱 Anchor program structure
Let's take a look at the structure of an Anchor progam

![](https://hackmd.io/_uploads/S1sA-poHo.png)

This is a pretty simple program - it initializes a new account and updates the data field on the account with the data passed in from the instruction.

You'll notice each section starts with a macro or attribute, they all help expand the code you're writing.

We've got four sections:
- `declare_id!` - the program’s on-chain address (this replaces our entrypoint)
- `#[program]` - the program’s instruction logic
- `#[derive(Accounts)]` - list, validate, and deserialize accounts passed into an instruction
- `#[account]` - define custom account types for the program

#### 🗿 `declare_id!`
Let's get the `declare_id!` macro outta the way cuz it's pretty simple:
![](https://hackmd.io/_uploads/r17JMpsSs.png)

This is used to specify the on-chain address of the program (i.e. the `programId`). A new keypair is generated when an Anchor program is built for the first time (which you can get with `anchor keys list`). This keypair will be the default keypair used to deploy the program (unless otherise specified). The pubkey for this keypair is used as the the `programId` and specified in the `declare_id!` macro.

#### 👑 `#[program]`
![](https://hackmd.io/_uploads/rkskGaiHs.png)

The `#[program]` attribute defines the module (hence the `mod`) that contains all the program instructions. This is where you implement the logic for each instruction in your program. You'll create a public function for every instruction that your program supports. The account validation and security checks are separate from your program logic, so they're not here!

Every instruction will take two arguments, a "context" and instruction data. Anchor will automatically deserialize the instruction data, so we don't have to worry about that!

Before we can continue diving into the rest of these macros in more detail, we need to look at what this new `Context` thing inside the instruction logic is. We'll be going about three layers deep - native, Rust, Anchor, so stick with me here! 

#### 📝 Context
Think back to what we needed to do when handling an instruction natively. In our `process_instruction` functions, we passed in `program_id`, `accounts`, and `instruction_data`. You can group together everything other than the instruction data into instruction "context". Since our programs are stateless, they need to know the context of the instruction. This means with Anchor we only need two things for instructions - context, and the data.

Context is a struct that contains all the information about the current transaction. It's passed into every instruction handler and contains the following fields:
``` rust
pub struct Context<'a, 'b, 'c, 'info, T> {
    /// Currently executing program ID
    pub program_id: &'a Pubkey,
    /// Deserialized accounts
    pub accounts: &'b mut T,
    /// Remaining accounts given, but not deserialized or validated
    /// Be very careful when using this directly.
    pub remaining_accounts: &'c [AccountInfo<'info>],
    /// Bumps seeds found during constraint validation.
    /// This is provided as a convenience so that handlers 
    /// don't have to recalculate bump seeds or 
    /// pass them in as arguments.
    pub bumps: BTreeMap<String, u8>
}
```

Second layer - Rust.

We haven't talked much about "lifetimes" in Rust, which is the `'` in our arguments `'a, 'b, 'c, 'info`. Lifetimes are what the Rust compiler uses to keep track of how long references are valid for. The lifetime of `Context` is tied to every one of its properties that is denoted with a lifetime. It's basically saying, do not deallocate or dereference `Context` before all the other properties go away, so there are no dangling references. **We don't need to worry about understanding these** right now, it really won't impact much of what we'll be doing.

```rs
    pub accounts: &'b mut T,
```
The thing that matters is the `T`, it's a generic: a placeholder for a type. It indicates that `Context` will have a type inside of it, and that type can be one of many things, which will be decided at runtime. 

In this instance, it's a generic for the type of accounts. We will later define an accounts struct, that defines what are the accounts that come into this instruction, so that at the beginning of the instruction logic, we don't have to iterate over all of the accounts. It is another great abstraction of Anchor. 

**In simple words, we're telling Rust "Hey I don't know what the type of `accounts` will be, I'll tell you later when I actually want to use it".**

Third layer - Anchor.

At runtime, the `accounts` type changes from `T` to whatever we define in `InstructionAccounts`. Meaning our `instruction_one` function now has access to the accounts declared inside `InstructionAccounts`:
- The program id (`ctx.program_id`) of the executing program
- The accounts passed into the instruction (`ctx.accounts`)
- The remaining accounts (`ctx.remaining_accounts`). The `remaining_accounts` is a vector that contains all accounts that were passed into the instruction but are not declared in the `Accounts` struct. You'll almost never have to use this.
- The bumps for any PDAs accounts (`ctx.bumps`). By putting them here we don't have to recalculate them inside the instruction handlers.

#### ⌨ `#[derive(Accounts)]`
Phew. Back to our regularly scheduled Anchor breakdown, let's have a look at the `#[derive(Accounts)]` section, which is related to the `Context` type. 

![](https://hackmd.io/_uploads/S1CWz6oSo.png)

This is where we define the accounts that are passed into the instruction. The `#[derive(Accounts)]` macro tells Anchor to create the implementations necessary to parse these accounts do the account validation.

For example, `instruction_one` requires a `Context` argument of type `InstructionAccounts`.
The `#[derive(Accounts)]` macro is used to implement the `InstructionAccounts` struct which includes three accounts:
  - `account_name`
  - `user`
  - `system_program`

When `instruction_one` is invoked, the program:
  - Checks that the accounts passed into the instruction match the account types specified in the `InstructionAccounts` struct
  - Checks the accounts against any additional constraints specified (that's what the `#[account]` lines are)
  
If any accounts passed into `instruction_one` fails the account validation or security checks specified in the `InstructionAccounts` struct, then the instruction fails before ever running the instruction logic.

This saves us a lot of boilerplate - we don't have to specify addresses and checks for each account!

#### 🔎 `Account` type in Anchor
You probably remember the `AccountInfo` type from last week when we wrote a native program. We used this type every time we needed to deal with accounts - processing instructions, creating transactions, making CPIs. This type represented all the various accounts we could have - a PDA, a user account and even a system program. Thinking back, it's a bit weird that we used the same type to represent such varied arguments.

Anchor wraps the native type to give us a list new types that have differet types of validation built in - we'll never need to check if we own an account inside our instruction because we can declare it a certain type and that will do the validation for us!

Let's take a look at the common types, starting with `Account`:

![](https://hackmd.io/_uploads/rkDQG6iBi.png)

You'll notice that `account_name` is of type `Account`, which is basically a wrapper around `AccountInfo`, which we have used before with native development. What does it do here?

For the `account_name` account, the `Account` wrapper:
  - deserializes the `data` in the format of type `AccountStruct`
  - checks the program owner of the account also matches the specified account type.
  - When the account type specified in the `Accounts` wrapper is defined within the same crate using the `#[account]` macro, the program ownership check is against the `programId` defined in the `declare_id!` macro. (the executing program)

SO MUCH TIME SAVED!

#### 🖖 `Signer` type
Next up, we've got the `Signer` type. 

![](https://hackmd.io/_uploads/rJyVzpoHs.png)
This is used to validate that an account has signed the transaction. 

In this instance, we're specifying that the `user` account must be a signer of the instruction. We don't check for anything else - we don't care what the account type is or if the signer owns the account. 

If they haven't signed the transaction, the instruction fails!

#### 💻 `Program` type
![](https://hackmd.io/_uploads/rJsEf6jrj.png)

Finally, the `Program` type checks that the account passed in is the one we expect and that it's actually a program (executable).

I hope you're starting to see how Anchor makes things easy. Not only is this code a lot more compact, it's also easier to understand! You'll be able to understand what a program does much faster because everything has it's own type. Just gotta learn a few more "rules" in this layer :)

#### 🤔 Additional constraints
The only thing we haven't covered so far is the `#[account]` bits - both inside the `InstructionAccounts` struct and outside.

Let's take a look at the `#[account]` inside the `InstructionAccounts` struct first:
![](https://hackmd.io/_uploads/S1DtMTiBs.png)

This is where we specify additional constraints for the accounts. Anchor does a great job of basic validation, but it can also help us check a bunch of other stuff that we specify!

For `account_name`the `#[account(..)]` attribute specifies:
- `init` - creates the account via a CPI to the system program and initializes it (sets its account discriminator)
- `payer` - specifies `payer` for the initialization as the `user` account defined in the struct
- `space`- specifies the `space` that allocated for the account is 8 + 8 bytes.
  - The first 8 bytes is a discriminator that Anchor automatically adds to identify the account type.
  - The next 8 bytes allocates space for the data stored on the account as defined in the AccountStruct type.

I wanna go over that again. In **one single line**, we execute a CPI to the system program to create an account!!!!!!!!!!!!! How insane is that? We don't have to write any code to create an account, we just specify that we want it to be created and Anchor does the rest!

Finally, for the user account, there's a 'mut' attribute, it designates the account as mutable. Since the user will be paying for this, since it's balance will change, it needs to be mutable. 

#### `#[account]`
Stay with me just a bit longer, we're at the final strech!

![](https://hackmd.io/_uploads/S1Mcf6oBj.png)
The #[account] attribute is used to represent the data structure of a Solana account and implements the following traits:
- `AccountSerialize`
- `AccountDeserialize`
- `AnchorSerialize`
- `AnchorDeserialize`
- `Clone`
- `Discriminator`
- `Owner`

Long story short, the `#[account]` attribute enables serialization and deserialization, and implements the discriminator and owner traits for an account. 

- The discriminator is an 8 byte unique identifier for an account type and derived from first 8 bytes of the SHA256 of the account’s struct name.
- Any calls to `AccountDeserialize`’s `try_deserialize` will check this discriminator.
- If it doesn’t match, an invalid account was given, and the account deserialization will exit with an error.

The `#[account]` attribute also implements the `Owner` trait: 
- Using the `programId` declared by `declareId` of the crate `#[account]` is used in.
- Accounts initialized using an account type defined using the `#[account]` attribute within the program are owned by the program.

That's about it, that's the structure of how Anchor programs are built. That was a bit dense, but it was necessary to set us up as we move forward and use Anchor. Take a break and come back soon, it's time to build!

#### ‼ COME BACK SOON!
This is really fucking important - **You will not understand all of this right now.** 

That's okay. I didn't either. It took me **two days** to write this page. Once you've built out a program using Anchor, come back and go through this again. You'll have an easier time and things will make more sense.

Learning is a not a linear process, there will be ups and downs. You don't master the toughest topics in the universe by just reading about them once. Learn, build, learn better, build better.
