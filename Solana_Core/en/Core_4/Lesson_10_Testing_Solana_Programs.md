A robust testing process can minimize the amount of bugs developers introduce into production code by catching them before they pose a real issue. 

We'll be covering two types of tests in this lesson: unit tests and integration tests. 

**Unit tests** are small and more focused, testing one module in isolation at a time, and can test private interfaces. 

**Integration tests** are entirely external to your library and use your code in the same way any other external code would, using only the public interface and potentially exercising multiple modules per test.

#### 🔢 Unit tests
The purpose of unit tests is to test each unit of code in isolation from the rest of the code to quickly pinpoint where code is and isn’t working as expected.

Unit tests in Rust generally reside in the file with the code they are testing. 

Unit tests are declared inside a module named `tests` annotated with `cfg(test)` 
- Tests are defined in the `tests` module with the `#[test]` attribute.
- The `cfg` attribute stands for *configuration* and tells Rust that the following item should only be included given a certain configuration option.
- the `#[cfg(test)]` annotation tells Cargo to compile our test code only if we run `cargo test-bpf`.
- When running `cargo test-bpf`, every function inside this module marked as a test will be run.

You can also create helper functions that are not tests in the module
```rs
// Example testing module with a single test
#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        let result = 2 + 2;
        assert_eq!(result, 4);
    }

    fn helper_function() {
        doSomething()
    }
}
```

#### ❓ How to build unit tests
Use the `[solana_sdk](https://docs.rs/solana-sdk/latest/solana_sdk/)` crate to build unit tests for Solana programs. 

This crate is essentially the Rust equivalent of the `@solana/web3.js` Typescript package.

`[solana_program_test](https://docs.rs/solana-program-test/latest/solana_program_test/#)`  is also used for testing Solana programs and contains a BanksClient-based testing framework.

In the code snippet, we created a public key to use as our `program_id` and then initialized a `ProgramTest`. 

The `banks_client` returned from the `ProgramTest` will act as our interface into the testing environment 

The `payer` variable is a newly generated keypair with SOL that will be used to sign/pay for transactions. 

Then, we create a second `Keypair` and build our `Transaction` with the appropriate parameters. 

Finally, we used the `banks_client` that was returned when calling `ProgramTest::new` to process this transaction and check that the return value is equal to `Ok(_)`.

The function is annotated with the `#[tokio::test]` attribute.

Tokio is a Rust crate to help with writing asynchronous code. This just denotes our test function as async.
```rs
// Inside processor.rs
#[cfg(test)]
mod tests {
    use {
        super::*,
        assert_matches::*,
        solana_program::instruction::{AccountMeta, Instruction},
        solana_program_test::*,
        solana_sdk::{signature::Signer, transaction::Transaction, signer::keypair::Keypair},
    };

    #[tokio::test]
    async fn it_works() {
        let program_id = Pubkey::new_unique();

        let (mut banks_client, payer, recent_blockhash) = ProgramTest::new(
            "program_name",
            program_id,
            processor!(process_instruction),
        )
        .start()
        .await;

        let test_acct = Keypair::new();

        let mut transaction = Transaction::new_with_payer(
            &[Instruction {
                program_id,
                accounts: vec![
                    AccountMeta::new(payer.pubkey(), true),
                    AccountMeta::new(test_acct.pubkey(), true)
                ],
                data: vec![1, 2, 3],
            }],
            Some(&payer.pubkey()),
        );
        transaction.sign(&[&payer, &test_acct], recent_blockhash);

        assert_matches!(banks_client.process_transaction(transaction).await, Ok(_);
    }
}
```

#### ➕ Integration tests
Integration tests are meant to be entirely external to the code they are testing. 

These tests are meant to interact with your code via its public interface in the manner that it’s intended to be accessed by others. 

Their purpose is to test whether many parts of your library work together correctly. 

Units of code that work correctly on their own could have problems when integrated, so test coverage of the integrated code is important as well.'

#### ❓ How to build integration tests
To create integration tests, you first need to create a `tests` directory at the top level of your project’s directory.

We can then make as many test files as we want inside this `tests` directory, each file will act as its own integration test.
- Each file in the `tests` directory is a separate crate, so we will need to bring our library of code that we want to test into each file’s scope - that’s what the `use example_lib` line is doing.
- We don’t need to annotate the tests in the `tests` directory with `#[cfg(test)]` because Cargo will only compile files inside the `tests` directory when we run `cargo test-bpf`.

```rs
// Example of integration test inside /tests/integration_test.rs file
use example_lib;

#[test]
fn it_adds_two() {
    assert_eq!(4, example_lib::add_two(2));
}
```

Once you have tests written (either unit, integration, or both), all you need to do is run `cargo test-bpf` and they will execute.

The three sections of output include: 
- the unit tests,
- the integration test,
- the doc tests.
    - The doc tests are something that we won't cover in this lesson, but there is additional `Cargo` functionality to execute code examples in any documentation you might have in your code base.

```rs
cargo test
   Compiling adder v0.1.0 (file:///projects/adder)
    Finished test [unoptimized + debuginfo] target(s) in 1.31s
     Running unittests (target/debug/deps/adder-1082c4b063a8fbe6)

running 1 test
test tests::it_works ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running tests/integration_test.rs (target/debug/deps/integration_test-1082c4b063a8fbe6)

running 1 test
test it_adds_two ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

   Doc-tests adder

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```

#### 🔌 Integration Tests with Typescript
The alternative method to test your program is by deploying it to either Devnet or a local validator and sending transactions to it from some client that you created. 

Write client testing script in Typescript using:
- the [Mocha testing framework](https://mochajs.org/)
- with the [Chai assertion library](https://www.chaijs.com/).

Install Mocha and Chai with `npm install mocha chai`

Then update the `package.json` file inside your Typescript project. This tells the compiler to execute the Typescript file or files inside the `/test` directory when the command `npm run test` is run.

You’ll have to make sure the path here is the correct path to where your testing script is located.
```json
// Inside package.json
"scripts": {
        "test": "mocha -r ts-node/register ./test/*.ts"
    },
```

Mocha testing sections are declared with the describe keyword, which tells the compiler that mocha tests are inside of it.
- Inside the `describe` section, each test is designated with `it`
- The Chai package is used to determine whether or not each test passes, it has an expect
 function that can easily compare values. 

```js
describe("begin tests", async () => {
    // First Mocha test
    it('first test', async () => {
        // Initialization code here to send the transaction
        ...
        // Fetch account info and deserialize
        const acct_info = await connection.getAccountInfo(pda)
        const acct = acct_struct.decode(acct_info.data)

        // Compare the value in the account to what you expect it to be
        chai.expect(acct.num).to.equal(1)
    }
})
```

Running `npm run test` will execute all of the tests inside the `describe` block and return something like this indicating whether or not each one has passed or failed.

```
> scripts@1.0.0 test
> mocha -r ts-node/register ./test/*.ts

    ✔ first test (1308ms)
    ✔ second test

    2 passing (1s)
```

#### ❌ Error codes
Program errors are often displayed in a hexadecimal representation of the error’s decimal index inside the error enum of the program that returned it.

For example, if you were to receive an error sending a transaction to the SPL Token Program with the error code `0x01`, the decimal equivalent of this is 1. 

[Looking at the source code of the Token Program](https://github.com/solana-labs/solana-program-library/blob/master/token/program/src/error.rs), we can see that the error located at this index in the program's error enum is `InsufficientFunds`. 

You'll need to have access to the source code of any program that returns a custom program error code to translate it.

#### 📜 Program Logs
Solana makes it very easy to create new custom logs with the `msg!()` macro

![](https://hackmd.io/_uploads/ry4bc_RNo.png)

Note when writing unit tests in Rust, you cannot use the `msg!()` macro to log information within the test itself.  

You’ll have to use the Rust native `println!()` macro. 

`msg!()` statements inside the program code will still work, you just can't log within the test with it.

#### 🧮 Compute Budgets
Developing on a blockchain comes with some unique constraints, one of those on Solana is the compute budget.

The compute budget is meant to prevent a program from abusing resources. 

When the program consumes its entire budget or exceeds a bound, the runtime halts the program and returns an error. 

By default the compute budget is set the product of 200k compute units * number of instructions, with a max of 1.4M compute units.

The Base Fee is 5,000 Lamports. A microLamport is 0.000001 Lamports.

Use `ComputeBudgetProgram.setComputeUnitLimit({ units: number })` to set the new compute budget.

`ComputeBudgetProgram.setComputeUnitPrice({ microLamports: number })` will increase the transaction fee above the base fee (5,000 Lamports). 

- The value provided in microLamports will be multiplied by the CU budget to determine the Prioritization Fee in Lamports.
- For example, if your CU budget is 1M CU, and you add 1 microLamport/CU, the Prioritization Fee will be 1 Lamport (1M * 0.000001).
- The total fee will then be 5001 Lamports.

To change the compute budget for a transaction, you must make the one of the first three instructions of the transaction the instruction that sets the budget.

```ts
const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({ 
  units: 1000000 
});

const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({ 
  microLamports: 1 
});

const transaction = new Transaction()
.add(modifyComputeUnits)
.add(addPriorityFee)
.add(
    SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: toAccount,
      lamports: 10000000,
    })
  );
```

The function `sol_log_compute_units()` is available to use to print exactly how many compute units are remaining for the program to consume within the current instruction.

```rs
use solana_program::log::sol_log_compute_units;

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {

    sol_log_compute_units();

...
}
```

#### 📦 Stack size
Every program has access to 4KB of stack frame size when executing. All values in Rust are stack allocated by default. 

In a systems programming language like Rust, whether a value is on the stack or the heap can make a large difference - especially when working within a constrained environment like a blockchain. 

You'll start to run into issues with using up all of the 4KB of memory when working with larger, more complex programs. 

This is often called "blowing the stack", or [stack overflow](https://en.wikipedia.org/wiki/Stack_overflow). 

Programs can reach the stack limit two ways: 
- either some dependent crates may include functionality that violates the stack frame restrictions,
- or the program itself can reach the stack limit at runtime.

Here's an example of the error message you might see when the stack violation is originating from a dependent crate.
```
Error: Function _ZN16curve25519_dalek7edwards21EdwardsBasepointTable6create17h178b3d2411f7f082E Stack offset of -30728 exceeded max offset of -4096 by 26632 bytes, please minimize large stack variables
```

If a program reaches it's 4KB stack at runtime, it will halt and return an `AccessViolation` error:
```
Program failed to complete: Access violation in stack frame 3 at address 0x200003f70 of size 8 by instruction #5128
```

To get around this, you can either refactor your code to make it more memory efficient or allocate some memory to the heap instead. 

All programs have access to a 32KB runtime heap that can help you free up some memory on the stack. 

To do so, you'll have to make use of the [Box](https://doc.rust-lang.org/std/boxed/struct.Box.html) struct. 

A box is a smart pointer to a heap allocated value of type `T`. 

Boxed values can be dereferenced using the `*` operator.

In this example, the value returned from the Pubkey::create_program_address, which is just a public key, will be stored on the heap and the authority_pubkey variable will hold a pointer to the location on the heap where the public key is stored. 

```rs
let authority_pubkey = Box::new(Pubkey::create_program_address(authority_signer_seeds, program_id)?);

if *authority_pubkey != *authority_info.key {
      msg!("Derived lending market authority {} does not match the lending market authority provided {}");
      return Err();
}
```