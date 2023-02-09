We'll be making a simple Hello World program on the playground. All it will do is a log a message in the transaction logs lol
 
#### 📦 The Rust Module System
Just like with our clients, we'll use a bunch of libraries so we don't have to write tons of boilerplate. Rust organizes code using what is collectively referred to as the “module system”. This is a lot like modules in Node.js or a namespace in C++.

Here's a handy visualisation:
![](https://hackmd.io/_uploads/ry_oJSams.png)
[Source](https://www.reddit.com/r/learnrust/comments/wb0gdt/visual_to_understandremember_packages_crates/)

The three parts of this system are:
- **Packages** - A package contains a collection of crates as well as a manifest file for specifying metadata and dependencies between packages. Think of it like `package.json` in Node.js.
- **Crates** - A crate is either a library or an executable program. The source code for a crate is usually subdivided into multiple modules. This is like a node module.
- **Modules** - A module separates code into logical units to provide isolated namespaces for organization, scope, and privacy of paths. These are basically individual files and folders.

#### 🛣 Paths and Scope
Just like how you can reuse components in React and modules in Node, Crate Modules can be reused within projects. The tricky thing with items within modules is that we need to know the *paths* leading to them for us to reference them.

Think of the crate structure as a tree where the crate is the base and modules are branches, each of which can have submodules or items that are additional branches.

One of the things we'll need is the `AccountInfo` struct from the `account_info` submodule, here's what it looks like:

![](https://hackmd.io/_uploads/S1bxlHams.png)

A struct is a custom data type btw. Think of it like a custom primitive data type, just like string or integer. Instead of just storing a single value, a struct can contain multiple values.

In Rust `::` is like `.` or `/`. So to reference the `AccountInfo` struct we would `::` to it like so:
```rs
    use solana_program::account_info::AccountInfo;
```
1. The base crate is `solana_program`
2. `solana_program` contains a module named `account_info`
3. `account_info` contains a struct named `AccountInfo`

It's common to see a series of `use` commands at the top of a Rust file, just like `import` or `require` statements. 

We also need a few other items. We can use curly brackets to bring in multiple items from a single module, a bit like destructuring in JS:
```rs
use solana_program::{
    account_info::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    msg
};
```
Pretty straightforward so far. The `AccountInfo` struct is a general purpose descriptor for Solana account data - it defines all the properties an account should have.

If you've never worked with a statically typed language like TypeScript or Java before, you might be wondering why we're importing "data types" like `PubKey` or `AccountInfo`. The TL;DR is that in Rust we need to define the types of our variables when we declare them. This helps us catch errors before compiling or running the code. So instead of your program crashing when it's on the blockchain executing a transaction, it crashes when you're developing and can more quickly get working code ready :) 

![](https://i.pinimg.com/originals/4c/68/1e/4c681e62914cc2b2b89d0762d7e5ea08.png)

I'll go over the rest of these items as we need them. Onwards for now!

#### 🏁 The Solana Program Entry Point
Think back to our Typsecript client. We had a `main` function in `index.ts` that was the entry point for our script. The same thing works with Rust scripts! Except we're not writing just *any* Rust script, we're writing one that will be run on Solana.

That's what our second `use` statement is for - it brings in the `entrypoint!` macro: a special kind of `main` function that Solana will use to run our instructions.

Macros are like code shortcuts - they're a way to write code that writes code. `entrypoint!(process_instruction);` will expand to a bunch of boilerplate code at compile time, sort of like a template. You don't need to know how macros work, but you can read more about them [here](https://doc.rust-lang.org/book/ch19-06-macros.html).

Our entrypoint function will call `process_instruction`, so here's what our `lib.rs` file should look like so far:
```rs
use solana_program::{
    account_info::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    msg
};

entrypoint!(process_instruction);
```

Now for the `process_instruction` function.

#### 🔨 Functions in Rust
Functions are pretty similar to Typescript - just need parameters, types and a return type. Add this under the `entrypoint!` macro:
```rs
pub fn process_instruction(
    //Arguments and their types
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
    // The return type (i.e. what data type the function returns)
) -> ProgramResult{
  // Leave the body empty for now :)
}
```

Our `process_instruction` function requires the following arguments:
- `program_id`: The public key of the program account. Required to verify that the program is being called by the correct account. Of type `&Pubkey`.
- `accounts`: which accounts the instruction touches. Required to be type `&[AccountInfo]`
- `instruction_data`: 8 bit instruction data from our transaction. Required to be type `&[u8]`

The `[]` mean that `AccountInfo` and `u8` are "slice" types - they're like arrays of unknown length. We don't call them arrays because they're lower level - a slice in Rust is a pointer to a block of memory 🤯 

We'll get to the `&` later :)

####  📜 The Result Enum
Time to meet our third `use` statement - `ProgramResult`. This is a Rust enum that represents the result of a Solana program execution.

Try to compile the script now by hitting the "Build" button in the bar on the left. You should get one warning and one error. Here's the error:
```
error[E0308]: mismatched types
  --> /src/lib.rs:12:6
   |
7  | pub fn process_instruction(
   |        ------------------- implicitly returns `()` as its body has no tail or `return` expression
...
12 | ) -> ProgramResult {
   |      ^^^^^^^^^^^^^ expected enum `Result`, found `()`
   |
   = note:   expected enum `Result<(), ProgramError>`
           found unit type `()`
```

I wanna take a moment to appreciate how beautiful Rust error messages are. It tells you exactly what's wrong, where it's wrong and how to fix it. I wonder how much hair I would have saved if Javascript was as nice 😢

Since our function body is empty, it's implicitly returning `()` - the empty tuple. The error message says it's expecting `Result`, but we declared the return type to be `ProgramResult`. Hmmmm what going on here 🤔?

This is because the Solana [`ProgramResult`](https://docs.rs/solana-sdk/1.4.9/solana_sdk/entrypoint/type.ProgramResult.html) type is using the Rust `Result` type:
```rs
pub type ProgramResult = Result<(), ProgramError>;
```

`Result` is a standard library type that represents two discrete outcomes: 
- success (`Ok`) or
- failure (`Err`)
```rs
pub enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

Think of it like HTTP error codes -- 200 is `Ok` and 404 is `Err`. So when we return `ProgramResult` we're saying that our function can either return `()` (an empty value) for success, or use the custom `ProgramError` enum to tell us exactly what went wrong. Useful!

Here's all we need to do to fix it:
```rs
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult{
  // Return Ok() for success
  Ok(())
}
```

#### 🚀 Deploy your first program
Our program is almost complete! The only thing missing is to actually say "Hello World", which we can do with the `msg!` macro. We won't do anything with the instruction data yet, so to avoid the "unused variable" warnings, just prefix the variable names with an underscore.

Here's what the complete `process_instruction` function looks like:
```rs
pub fn process_instruction(
    _program_id: &Pubkey,
    _accounts: &[AccountInfo],
    _instruction_data: &[u8]
) -> ProgramResult{
  msg!("Hello World!");
  Ok(())
}
```

If you hit build, you should see a green "Build successful" message in the console. Congrats! You've written your first Solana program 🎉

The playground makes it really easy to deploy this. Switch to the "Build and Deploy" tab on the top left below the "Explorer" icon and hit the "Deploy" button.
