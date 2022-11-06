Time to graduate kindergarten. We know all about reading - you just make API calls to JSON RPC endpoints. Let's write to the blockchain!

#### 🔐 Keypairs
To write data to the blockchain, you need to submit transactions. Think of it like a data write command that can be *rejected* if certain conditions aren't met. 

To make sense of transactions and how they work, you'll need to know what key pairs are. As the name suggests, these are a pairing of keys - one is public, and the other is private. The public key points to the address of an account on the network and each pubkey has a corresponding private/secret key. 

The Web3.js library has a couple of helper functions to work with keypairs. You can generate keypairs and use them to get the public or secret keys.
```ts
// Create a new keypair
const ownerKeypair = Keypair.generate()

// Get the public key (address)
const publicKey = ownerKeypair.publicKey

// Get the secret key
const secretKey = ownerKeypair.secretKey
```

Secret keys can have a couple of different formats - 
1. Mnemonic phrase - this is the most common
```
pill tomorrow foster begin walnut borrow virtual kick shift mutual shoe scatter
```
2. A bs58 string - wallets sometimes export this
```
5MaiiCavjCmn9Hs1o3eznqDEhRwxo7pXiAYez7keQUviUkauRiTMD8DrESdrNjN8zd9mTmVhRvBJeg5vhyvgrAhG
```
3. Bytes - when writing code, we usually deal with the raw bytes as an array of numbers 
```!
[ 174, 47, 154, 16, 202, 193, 206, 113, 199, 190, 53, 133, 169, 175, 31, 56, 222, 53, 138, 189, 224, 216, 117,173, 10, 149, 53, 45, 73, 251, 237, 246, 15, 185, 186, 82, 177, 240, 148, 69, 241, 227, 167, 80, 141, 89, 240, 121, 121, 35, 172, 247, 68, 251, 226, 218, 48, 63, 176, 109, 168, 89, 238, 135, ]
```

If you already have a keypair you’d like to use, you can create a`Keypair` object from the secret key using the `Keypair.fromSecretKey()` function. You'll probably need to do this when deploying to the mainnet with real money, so make sure you inject the secret key using `.env` variables!!

```ts
//private key as an array of bytes
const secret = JSON.parse(process.env.PRIVATE_KEY ?? "") as number[]
const secretKey = Uint8Array.from(secret)
const keypairFromSecretKey = Keypair.fromSecretKey(secretKey)
```

What we're doing here is taking the private key in the bytes format and parsing it as an array of numbers, then casting that into a uint array. We use this uint array to create a keypair. **You don't need to know how this works**, but you can read more about it [here](https://solanacookbook.com/references/keypairs-and-wallets.html) and [here](https://mattmazur.com/2021/11/19/splitting-a-solana-keypair-into-a-public-and-private-keys/).

ALRIGHTY. Now you know more about Solana keypairs than 98% of Solana devs :sunglasses: 

Going back to Transaction Town. 

All modifications to data on the Solana network happen through transactions. All transactions interact with programs on the network - these can be system programs or user built programs. Transactions tell the program what they want to do with a bunch of instructions, and if they're valid, the program does the things!

Wtf do these instructions look like? They contain:
1. an identifier of the program you intend to invoke
2. an array of accounts that will be read from and/or written to
3. data structured as a byte array that is specified to the program being invoked

If this feels like a lot, don't worry, it'll all click as we get things going!

#### 🚆 Make & send a transaction
Let's make a transaction. We'll call the system program to transfer some SOL. Since we're interacting with the system program, there's helper functions in the web3.js library which make this super easy!

```ts
const transaction = new Transaction()

const sendSolInstruction = SystemProgram.transfer({
    fromPubkey: sender,
    toPubkey: recipient,
    lamports: LAMPORTS_PER_SOL * amount
})

transaction.add(sendSolInstruction)
```

That's all it takes to create a transfer transaction! You *can* add multiple instructions to one transaction and they'll be carried out sequentially. We'll try this later 😈

The web3.js library also comes with functions to send transactions. Here's how we'd send a transaction:
```ts
const signature = sendAndConfirmTransaction(
    connection,
    transaction,
    [senderKeypair]
)
```

You know everything here - the connection is how we talk to the network via the JSON RPC. The transaction is the thing we just made with the transfer instruction. The last argument is an array of signers. These are keypairs that "sign" the transaction so the Solana runtime and the program you're sending it to know who has authorized the transaction. Certain transactions require signatures from multiple parties so it's not always one address here.

Signing is necessary so we can only make changes that we are authorized to. Since this transaction moves SOL from one account to another, we need to prove that we control the account we're trying to send from.  

Now you know all about transactions and what the "conditions" I mentioned are :)

#### ✍ Instructions 
We kinda took the easy route with our last transaction. When working with non-native programs or programs that aren't built into the web3 library, we need to be very specific about the instructions we're creating. Here's the type that we need to pass into the constructor to create an instruction. Check it out -
```ts
export type TransactionInstructionCtorFields = {
  keys: Array<AccountMeta>;
  programId: PublicKey;
  data?: Buffer;
};
```

In essence, an instruction contains:
* An array of keys of type `AccountMeta`
* The public key/address of the program you're calling
* Optionally - a `Buffer` containing data to pass to the program

Starting with keys - each object in this array represents an account that will be read from or written to during a transaction's execution. This way the nodes know which accounts will be involved in the transaction, which speeds things up! This means you need to know the behavior of the program you are calling and ensure that you provide all of the necessary accounts in the array.

Each object in the keys array must include the following:

* `pubkey` - the public key of the account
* `isSigner` - a boolean representing whether or not the account is a signer on the transaction
* `isWritable` - a boolean representing whether or not the account is written to during the transaction's execution

The `programId` field is fairly self explanatory: it’s the public key associated with the program you want to interact with. Gotta know who you want to talk to!

We’ll be ignoring the data field for now and will revisit it in the future.

Here's an example of what this would look like in action:
```ts
async function callProgram(
    connection: web3.Connection,
    payer: web3.Keypair,
    programId: web3.PublicKey,
    programDataAccount: web3.PublicKey
) {
    const instruction = new web3.TransactionInstruction({
        // We only have one key here
        keys: [
            {
                pubkey: programDataAccount,
                isSigner: false,
                isWritable: true
            },
        ],
        
        // The program we're interacting with
        programId
        
        // We don't have any data here!
    })

    const sig = await web3.sendAndConfirmTransaction(
        connection,
        new web3.Transaction().add(instruction),
        [payer]
    )
}
```

Not all that hard! We got this :P

#### ⛽ Transaction fees
The only thing we haven't talked about: fees. Solana fees are so low that you might as well ignore them! Sadly as devs we have to pay attention to them lol. Fees on Solana behave similarly to EVM chains like Ethereum. Every time you submit a transaction, somebody on the network is providing space and processing power to make it happen. Fees incentivize people to provide that space and processing power.

The main thing to note is that the first signer included in the array of signers on a transaction is always the one responsible for paying the transaction fee. What happens if you don't have enough SOL? The transaction is dropped! 

When you're on devnet or on localhost, you can use `Solana airdrop` from the CLI to get devnet SOL. You can also use [SPL token faucet](https://spl-token-faucet.com/) to get SPL tokens (we'll learn what those are later :P).
