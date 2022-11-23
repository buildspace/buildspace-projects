To interact with a program using a frontend, we’ll need to create an Anchor `Program` object. 

The `Program` object provides a custom API to interact with a specific program by combining a program `IDL` and `Provider`.

To create the `Program` object, we’ll need the following:
- `Connection` - the cluster connection
- `Wallet` - default keypair used to pay for and sign transactions
- `Provider` - encapsulates the `Connection` to a Solana cluster and a `Wallet`
- `IDL` - file representing the structure of a program

Next, let’s go over each item to better understand how everything ties together.

#### IDL (Interface Description Language)
When an Anchor program is built, Anchor generates a JSON file called an `IDL`.

The IDL file contains the structure of the program and is used by the client to know how to interact with a specific program.

Here’s an example of using IDL for a counter program:

```json
{
  "version": "0.1.0",
  "name": "counter",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        { "name": "counter", "isMut": true, "isSigner": true },
        { "name": "user", "isMut": true, "isSigner": true },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": []
    },
    {
      "name": "increment",
      "accounts": [
        { "name": "counter", "isMut": true, "isSigner": false },
        { "name": "user", "isMut": false, "isSigner": true }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "Counter",
      "type": {
        "kind": "struct",
        "fields": [{ "name": "count", "type": "u64" }]
      }
    }
  ]
}
```

#### Provider
Before we can create a Program object using the `IDL`, we first need to create an Anchor `Provider` object. 

The `Provider` object represents the combination of two things:
- `Connection` - the connection to a Solana cluster (i.e. localhost, devnet, mainnet)
- `Wallet` -  a specified address used to pay for and sign transactions

The `Provider` is then able to send transactions to the Solana blockchain on behalf of a `Wallet` by including the wallet’s signature to outgoing transactions.

When using a frontend with Solana wallet provider, all outgoing transaction must still be approved by prompting the user.

The `AnchorProvider` constructor takes three parameters:
- `connection` - the `Connection` to the Solana cluster
- `wallet` - the `Wallet` object
- `opts` - optional parameter that specifies the confirmation options, using a default setting if one is not provided

```rs
/**
 * The network and wallet context used to send transactions paid for and signed
 * by the provider.
 */
export class AnchorProvider implements Provider {
  readonly publicKey: PublicKey;

  /**
   * @param connection The cluster connection where the program is deployed.
   * @param wallet     The wallet used to pay for and sign all transactions.
   * @param opts       Transaction confirmation options to use by default.
   */
  constructor(
    readonly connection: Connection,
    readonly wallet: Wallet,
    readonly opts: ConfirmOptions
  ) {
    this.publicKey = wallet.publicKey;
  }
  ...
}
```

Note that the `Wallet` object provided by the `useWallet` hook from `@solana/wallet-adapter-react` is not compatible with the `Wallet` object that the Anchor `Provider` expects.

So let’s do a comparison of AnchorWallet from useAnchorWallet and WalletContextState from useWallet.

The WalletContextState provides much more functionality, but the AnchorWallet is required to set up the Provider object. 

```ts
export interface AnchorWallet {
    publicKey: PublicKey;
    signTransaction(transaction: Transaction): Promise<Transaction>;
    signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>;
}
```

```ts
export interface WalletContextState {
    autoConnect: boolean;
    wallets: Wallet[];
    wallet: Wallet | null;
    publicKey: PublicKey | null;
    connecting: boolean;
    connected: boolean;
    disconnecting: boolean;
    select(walletName: WalletName): void;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    sendTransaction(transaction: Transaction, connection: Connection, options?: SendTransactionOptions): Promise<TransactionSignature>;
    signTransaction: SignerWalletAdapterProps['signTransaction'] | undefined;
    signAllTransactions: SignerWalletAdapterProps['signAllTransactions'] | undefined;
    signMessage: MessageSignerWalletAdapterProps['signMessage'] | undefined;
}
```

Additionally, use:
- The  `useAnchorWallet` hook to provides get the compatible `AnchorWallet`
- The `useConnection` hook to get the `Connection` to a Solana cluster.
- The `AnchorProvider` constructor to create the `Provider` object
- The `setProvider` to set the default provider on the client

```ts
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react"
import { AnchorProvider, setProvider } from "@project-serum/anchor"

const { connection } = useConnection()
const wallet = useAnchorWallet()

const provider = new AnchorProvider(connection, wallet, {})
setProvider(provider)
```

#### Program
The last step is to create a `Program` object. The `Program` object represents the combination of two things
- `IDL` - representing the structure of a program
- `Provider` - establishing the `Connection` to a cluster and a `Wallet` for signing

Import the program `IDL`.

Specify the programId of the program, which is often included in the IDL Alternatively, you can also explicitly state the programId.

When creating the Program object, the default Provider is used if one is not explicitly specified.

All together, the final setup looks something like this:
```ts
import idl from "./idl.json"
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react"
import { Program, Idl, AnchorProvider, setProvider } from "@project-serum/anchor"

const { connection } = useConnection()
const wallet = useAnchorWallet()

const provider = new AnchorProvider(connection, wallet, {})
setProvider(provider)

const programId = new PublicKey(idl.metadata.address)
const program = new Program(idl as Idl, programId)
```

#### Summary
So for a quick summary:
- import the program `IDL`
- use `useConnection` hook to create connection with with cluster
- use `useAnchorWallet` hook to get the compatible `AnchorWallet`
- use `AnchorProvider` constructor to create the `Provider` object
- use `setProvider` to set the default `Provider`
- specify the `programId` either from the `IDL` or directly
- use the `Program` constructor to create the `Program` object

#### Anchor `MethodsBuilder`

Once the `Program` object is set up, we can use the Anchor `MethodsBuilder` to build transactions with instructions from our program. 

The `MethodsBuilder` uses the `IDL` to provides a simplified format building transaction to invoke program instructions.

The basic `MethodsBuilder` format includes the following:

- `program` - the program being invoked specified by the `programId` from the `Program` object
- `methods` -  builder API for all APIs on the program and includes all instructions from the `IDL`
- `instructionName` - the name of the specific instruction from the `IDL` to invoke
    - `instructionDataInputs` - include any instruction data required by the instruction within the parentheses after the instruction name
- `accounts`- requires as input a list of accounts required by the instruction being invoked
- `signers` - requires as input any additional signers required by the instruction
- `rpc` -  creates and sends a signed transaction with the specified instruction and returns a `TransactionSignature`.
- When using `.rpc`, the `Wallet` from the `Provider` is automatically included as a signer and does not have to be listed explicitly stated.

Note that if no additional signers are required by the instruction other than the `Wallet` specified with the `Provider`, the `.signer([])` line can be excluded.

```tsx
// sends transaction
const transactionSignature = await program.methods
  .instructionName(instructionDataInputs)
  .accounts({})
  .signers([])
  .rpc()
```

You can also build the transaction directly by changing `.rpc()` to `.transaction()`.  

This builds a `Transaction` object using the instruction specified.

```tsx
// creates transaction
const transaction = await program.methods
  .instructionName(instructionDataInputs)
  .accounts({})
  .transaction()

// sent transaction
await sendTransaction(transaction, connection)
```

Similarly, you can use the same format to build an instruction using `.instruction` and then manually add the instructions to a new transaction. 

This builds a `TransactionInstruction` object using the instruction specified.

```tsx
// creates first instruction
const instructionOne = await program.methods
  .instructionOneName(instructionOneDataInputs)
  .accounts({})
  .instruction()

// creates second instruction 
const instructionTwo = await program.methods
  .instructionTwoName(instructionTwoDataInputs)
  .accounts({})
  .instruction()

// add both instruction to one transaction
const transaction = new Transaction().add(instructionOne, instructionTwo)

// send transaction
await sendTransaction(transaction, connection)
```

In summary, the Anchor `MethodsBuilder` provides a simplified and more flexible way to interact with on-chain programs. You can build an instruction, a transaction, or build and send a transaction using basically the same format without having to manually serialize or deserialize the accounts or instruction data.

#### Send Transactions

Use the `sendTransaction` method from the `useWallet()` hook provided by `@solana/wallet-adapter-react` to send transactions with a wallet adapter.

The `sendTransaction` method prompts a connected wallet for approve and sign a transaction before sending.  

You can add the additionally signatures by including `{ signers: [] }`:

```tsx
import { useWallet } from "@solana/wallet-adapter-react"

const { sendTransaction } = useWallet()

...

sendTransaction(transaction, connection)
```

```tsx
sendTransaction(transaction, connection, { signers: [] })
```

#### Fetching Program Accounts

You can also use the `program` object to fetch the program account types. Use `fetch()` to fetch a single account. Use `all()` to fetch all accounts of a specified type. You can also use `memcmp` to filter the accounts to fetch.

```tsx
const account = await program.account.accountType.fetch(publickey)

const accounts = (await program.account.accountType.all())

const accounts =
	(await program.account.accountType.all([
	  {
	    memcmp: {
	      offset: 8,
	      bytes: publicKey.toBase58(),
	    },
	  },
	]))
```

#### Summary Example

Create a counter account and increment in single transaction. Additionally, fetch the counter account.

```tsx

const counter = Keypair.generate()
const transaction = new anchor.web3.Transaction()

const initializeInstruction = await program.methods
  .initialize()
  .accounts({
    counter: counter.publicKey,
  })
  .instruction()

const incrementInstruction = await program.methods
  .increment()
  .accounts({
    counter: counter.publicKey
  })
  .instruction()

transaction.add(initializeInstruction, incrementInstruction )

const transactionSignature = await sendTransaction(
  transaction,
  connection,
  {
    signers: [counter],
  }
).then((transactionSignature) => {
  return transactionSignature
})

const latestBlockHash = await connection.getLatestBlockhash()
await connection.confirmTransaction({
  blockhash: latestBlockHash.blockhash,
  lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
  signature: transactionSignature,
})

const counterAccount = await program.account.counter.fetch(counter.publicKey)
```
