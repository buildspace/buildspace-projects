If you're a gamer, you've probably played a game that's had a massive boss fight. The type that is impossible to take down by one person so you have to join forces with friends and gang up on them. Think Thanos vs The Avengers.

The secret to beating them is collaboration. Everyone works together to amplify their powers. Solana gives you these superpowers of collaboration: [composability](https://en.wikipedia.org/wiki/Composability) is a key design principal in its architecture.

![](https://media.giphy.com/media/rj12FejFUysTK/giphy.gif)

What unlocks this power? Cross program invocation - or CPIs.

Think of your final NFT staking project. We're doing a lot of token related stuff (stake, redeem, unstake) in there **that we don't have to build** - we just make calls to the token program and it handles it for us. 

#### 🔀 Cross Program Invocation
A Cross-Program Invocation is a direct call from one program into another. Just as any client can call any program using the JSON RPC, any program can call any other program directly. 

CPIs essentially turn the entire Solana ecosystem into one giant API that is at your disposal as a developer.

#### 🤔 How to make a CPI
You've made CPIs a couple times before, so this should look familiar!

CPIs are made using the [invoke](https://docs.rs/solana-program/1.10.19/solana_program/program/fn.invoke.html) or [invoke_signed](https://docs.rs/solana-program/1.10.19/solana_program/program/fn.invoke_signed.html) function from the `solana_program` crate. 

CPIs extend the signer privileges of the caller to the callee.
- `invoke` passes the original transaction signature to the program you are invoking.
- `invoke_signed` uses PDAs to have your program "sign" the instruction

```rs
// Used when there are not signatures for PDAs needed
pub fn invoke(
    instruction: &Instruction,
    account_infos: &[AccountInfo<'_>]
) -> ProgramResult

// Used when a program must provide a 'signature' for a PDA, hence the signer_seeds parameter
pub fn invoke_signed(
    instruction: &Instruction,
    account_infos: &[AccountInfo<'_>],
    signers_seeds: &[&[&[u8]]]
) -> ProgramResult
```

![](https://hackmd.io/_uploads/rJpVnT6Eo.png)

The `Instruction` type has the following definition:

- `program_id` - the public key of the program you are going to invoke
- `account` - a list of account metadata as a vector. You need to include every account that the invoked program will read from or write to
- `data` - a byte buffer representing the data being passed to the callee program as a vector

Depending on the program you're making the call to, there may be a crate available with helper functions for creating the `Instruction` object. Both the `accounts` and `data` fields are of type `Vec`, or vector. You can use the [vec](https://doc.rust-lang.org/std/macro.vec.html) macro to construct a vector using array notation

```rs
pub struct Instruction {
    pub program_id: Pubkey,
    pub accounts: Vec<AccountMeta>,
    pub data: Vec<u8>,
}
```

![](https://hackmd.io/_uploads/H1QOhTTEo.png)

The `accounts` field of the `Instruction` struct expects a vector of type [AccountMeta](https://docs.rs/solana-program/latest/solana_program/instruction/struct.AccountMeta.html). The `AccountMeta` struct looks like this:

```rust
pub struct AccountMeta {
    pub pubkey: Pubkey,
    pub is_signer: bool,
    pub is_writable: bool,
}
```

For example:
- `AccountMeta::new` - indicates writable
- `AccountMeta::read_only` - indicates *not* writable
- `(account1_pubkey, true)` - indicates account is signer
- `(account2_pubkey, false)` - indicates account is *not* signer

```rust
use solana_program::instruction::AccountMeta;

let accounts = vec![
    AccountMeta::new(account1_pubkey, true),
    AccountMeta::new(account2_pubkey, false),
		AccountMeta::read_only(account3_pubkey, false),
    AccountMeta::read_only(account4_pubkey, true),
]
```

Here's an example of how to create the `Instruction` 
- `accounts` - vector of `AccountMeta` that the instruction requires
- `data` - the serialized instruction data that an instruction requires
- `programId` -  the program being invoked
- use `solana_program::instruction::Instruction` to create the new `Instruction`

```rust
use solana_program::instruction::{AccountMeta, Instruction},

let accounts = vec![
    AccountMeta::new(account1_pubkey, true),
    AccountMeta::new(account2_pubkey, false),
		AccountMeta::read_only(account3_pubkey, false),
    AccountMeta::read_only(account4_pubkey, true),
];

struct InstructionData {
    amount: u8,
}

let data = BorshSerialize.try_to_vec(InstructionData { amount: 1 });

let instruction = Instruction {
    program_id: *program_id,
    accounts,
    data,
};
```

#### 📜 Pass a list of accounts

Under the hood, both `invoke` and `invoke_signed` are just transactions, so we'll need to pass in a list  of `account_info` objects. 

Copy each `account_info` object that you need to pass into the CPI using the [Clone](https://docs.rs/solana-program/1.10.19/solana_program/account_info/struct.AccountInfo.html#impl-Clone) trait that is implemented on the `account_info` struct in the `solana_program` crate.

![](https://hackmd.io/_uploads/r1gJ6T6Ns.png)

This `Clone` trait returns a copy of the [account_info](https://docs.rs/solana-program/1.10.19/solana_program/account_info/struct.AccountInfo.html) instance.

```rust
&[first_account.clone(), second_account.clone(), third_account.clone()]
```

#### 🏒 CPI with `invoke`

![](https://hackmd.io/_uploads/SJ8baa6Es.png)

Remember - invoke is like passing on a transaction, the program doing it doesn't touch it at all. This means there's no need to include a signature because the Solana runtime passes along the original signature passed into your program.

#### 🏑 CPI with `invoke_signed`

![](https://hackmd.io/_uploads/rJki6TaEj.png)

Whenever we're working with PDAs, we'll use `invoke_signed` and pass in the seeds.

The Solana runtime will internally call [create_program_address](https://docs.rs/solana-program/1.4.4/solana_program/pubkey/struct.Pubkey.html#method.create_program_address) using the seeds provided and the `program_id` of the calling program. It then compares the result against the addresses supplied in the instruction. If any of the account addresses match the PDA, then the `is_signer` flag on that account is set to true.

It's like an efficiency shortcut!

#### 😲 Best Practices and Common Pitfalls
![](https://hackmd.io/_uploads/SkLB0pa4s.png)

There are some common errors you might receive when executing a CPI, they usually mean you are constructing the CPI with incorrect information. 

“signer privilege escalated” means that you are incorrectly signing for the address in the instruction. 

If you are using `invoke_signed` and receive this error, then it likely means that the seeds you are providing are incorrect.

```rust
EF1M4SPfKcchb6scq297y8FPCaLvj5kGjwMzjTM68wjA's signer privilege escalated
Program returned error: "Cross-program invocation with unauthorized signer or writable account"
```

Another similar error is thrown when an account that's written to isn't marked as `writable` inside the `AccountMeta` struct.

Here's a bunch of other scenarios that can break things:
- Any account whose data may be mutated by the program during execution must be specified as writable.
- Writing to an account that was not specified as writable will cause the transaction to fail.
- Writing to an account that is not owned by the program will cause the transaction to fail.
- Any account whose lamport balance may be mutated by the program during execution must be specified as writable.
- During execution, mutating the lamports of an account that was not specified as writable will cause the transaction to fail.
- While subtracting lamports from an account not owned by the program will cause the transaction to fail, adding lamports to any account is allowed, as long is it is mutable.

```rust
2qoeXa9fo8xVHzd2h9mVcueh6oK3zmAiJxCTySM5rbLZ's writable privilege escalated
Program returned error: "Cross-program invocation with unauthorized signer or writable account"
```

This just here is that you can't mess around with accounts without explicitly declaring in the transaction that you'll be messing around with them. You don't need to remember all these scenarios, just remember the fundamentals of transactions from the first section - **you must declare all accounts you're reading from or writing to.**

#### 🤔 What's the point
CPIs are a very important feature of the Solana ecosystem and they make all programs deployed interoperable with each other. This creates the opportunity for building new protocols and applications on top of what’s already been built, just like building blocks or Lego bricks. 

Composability is a big part of what makes crypto so unique and CPIs are what makes this possible on Solana.

Another important aspect of CPIs is that they allow programs to sign for their PDAs. As you have probably noticed by now, PDAs are used very frequently in Solana development because they allow programs to control specific addresses in such a way that no external user can generate transactions with valid signatures for those addresses.
