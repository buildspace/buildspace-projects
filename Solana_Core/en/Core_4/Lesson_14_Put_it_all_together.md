
#### Front-end Staking 
Can you feel it, the finish line is near...well, at least for this core. 😆

Our focus will be to get the instructions working, for staking and unstaking, on the front-end of the program.

In your front-end project, let's create a new `utils` folder in the root directory. Then create a file called `instructions.ts` and copy/paste the entire `instructions.ts` file from the nft staking project. As it's well over 200 lines of code, I won't paste it here. 😬 

Next we'll hop into the `StakeOptionsDisplay` file  (/<project-name>/components/StakeOptionsDisplay.rs). You'll notice we have three empty functions for `handleStake`, `handleUnstake` and `handleClaim`. This is our focus for this section.

As always, let's get our wallet and connection set up. 

```tsx
const walletAdapter = useWallet()
const { connection } = useConnection()
```

Let's check for a wallet first.

```tsx
if (!walletAdapter.connected || !walletAdapter.publicKey) {
  alert("Please connect your wallet")
  return
}
```

If that passes, we can set up our instruction. 

```tsx
const stakeInstruction = createStakingInstruction(
      walletAdapter.publicKey,
      nftTokenAccount,
      nftData.mint.address,
      nftData.edition.address,
      TOKEN_PROGRAM_ID, -- needs to be imported
      METADATA_PROGRAM_ID, -- needs to be imported
      PROGRAM_ID -- needs to be imported from constants.ts
    )
```

So, go into the `utils` folder, add a `constants.ts` file, add the following.

```tsx
import { PublicKey } from "@solana/web3.js"

export const PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_STAKE_PROGRAM_ID ?? ""
)
```

This is the program ID we are using in the instruction above. Make sure you have the correct program ID in your `env.local` file.

The stake instruction should be all set, next we'll create a transaction, and add the instruction, and send it.

```tsx
const transaction = new Transaction().add(stakeInstruction)

const signature = await walletAdapter.sendTransaction(transaction, connection)
```

Since this is an await, make sure to scroll up and make the `handleStake` callback `async`. In fact, all three of these functions should be async callbacks.

We can do a check to make sure it went through, so let's get the latest blockhash and confirm the transaction.

```tsx
const latestBlockhash = await connection.getLatestBlockhash()

await connection.confirmTransaction(
          {
            blockhash: latestBlockhash.blockhash,
            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
            signature: signature,
          },
          "finalized"
        )
      } catch (error) {
        console.log(error)
      }
      
     await checkStakingStatus()
```

After confirming the transaction we can check to see if we're still staking, so let's add this function toward the top of the `handleStake` code block. 

```tsx
const checkStakingStatus = useCallback(async () => {
    if (!walletAdapter.publicKey || !nftTokenAccount) {
      return
    }
```

We also need to add `walletAdapter` and `connection` as dependencies on the `handleStake` callback.

We're going to need some state fields, so scroll up and  add state for staking.

```tsx
const [isStaking, setIsStaking] = useState(isStaked)
```

Let's also change the parameter for `StakeOptionsDisplay` from `isStaking` to `isStaked`, or else our state won't work.

We also need to create a new file in `utils` called `accounts.ts` and copy over the file from our nft staking program utils folder. This will likely need an install for our borsh library.

The reason we're bringing this over is that every time we check state, we're going to check the stake account, and see what is the value of staked.

Then inside the callback for `checkStakingStatus`, we call `getStakeAccount`.

```tsx
const account = await getStakeAccount(
        connection,
        walletAdapter.publicKey,
        nftTokenAccount
      )
      
setIsStaking(account.state === 0)
    } catch (e) {
      console.log("error:", e)
    }
```

Since we'll be sending multiple transactions, let's go ahead and set up a helper function for confirming our transactions, we can paste in the code from above.

```tsx
const sendAndConfirmTransaction = useCallback(
    async (transaction: Transaction) => {
      try {
        const signature = await walletAdapter.sendTransaction(
          transaction,
          connection
        )
        const latestBlockhash = await connection.getLatestBlockhash()
        await connection.confirmTransaction(
          {
            blockhash: latestBlockhash.blockhash,
            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
            signature: signature,
          },
          "finalized"
        )
      } catch (error) {
        console.log(error)
      }

      await checkStakingStatus()
    },
    [walletAdapter, connection]
  )

```

And now, just call `sendAndConfirmTransaction` in the `handleStake` function.

#### Front-end Claim/Redeem
That should do it for `handleStake`. For unstake and claim, it's practically the same thing, with the added complexity of whether we will need to create the user's token account, for the reward token that they're going to get.

We can tackle `handleClaim` next.

Use the same alert we had above checking whether the wallet adapter is connected, and has a public key.

Next we'll check to see if the associated token account for rewards exists.

```tsx
const userStakeATA = await getAssociatedTokenAddress(
      STAKE_MINT,
      walletAdapter.publicKey
    )
```

Quickly hop over the `constants.ts` file we created and add this for our mint since we need `STAKE_MINT`.

```tsx
export const STAKE_MINT = new PublicKey(
  process.env.NEXT_PUBLIC_STAKE_MINT_ADDRESS ?? ""
)
```

Once we have the ATA, we need to call `getAccountInfo` which will either return an account or null.

```const account = await connection.getAccountInfo(userStakeATA)```

Then we create our transaction and check whether there's an account, if there isn't one, we call `createAssociatedTokenAccountInstruction`, otherwise we just call `createRedeemInstruction`.

```tsx
const transaction = new Transaction()

    if (!account) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          walletAdapter.publicKey,
          userStakeATA,
          walletAdapter.publicKey,
          STAKE_MINT
        )
      )
    }
    
    transaction.add(
      createRedeemInstruction(
        walletAdapter.publicKey,
        nftTokenAccount,
        nftData.mint.address,
        userStakeATA,
        TOKEN_PROGRAM_ID,
        PROGRAM_ID
      )
    )
```

Now we can call the helper transaction confirmation function created above.

```
await sendAndConfirmTransaction(transaction)
  }, [walletAdapter, connection, nftData, nftTokenAccount])
```

Finally, add our dependencies of `walletAdapter` and `connection` to the callback.

#### Front-end UnStaking
Now, onto `handleUnstake`, make sure to make async like the others. The following can just be copied over from `handleClaim`.

```tsx
if (
      !walletAdapter.connected ||
      !walletAdapter.publicKey ||
      !nftTokenAccount
    ) {
      alert("Please connect your wallet")
      return
    }

    const userStakeATA = await getAssociatedTokenAddress(
      STAKE_MINT,
      walletAdapter.publicKey
    )

    const account = await connection.getAccountInfo(userStakeATA)

    const transaction = new Transaction()

    if (!account) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          walletAdapter.publicKey,
          userStakeATA,
          walletAdapter.publicKey,
          STAKE_MINT
        )
      )
    }
```

Now we add instructions to our transaction, and call our helper function again.

```tsx
transaction.add(
      createUnstakeInstruction(
        walletAdapter.publicKey,
        nftTokenAccount,
        nftData.address,
        nftData.edition.address,
        STAKE_MINT,
        userStakeATA,
        TOKEN_PROGRAM_ID,
        METADATA_PROGRAM_ID,
        PROGRAM_ID
      )
    )

    await sendAndConfirmTransaction(transaction)
  }
```

#### Stake page edits
Let's hop over to `stake.tsx` (/<project-name>/pages/stake.tsx) and make a few changes related to the above.

First, we need to change the use of `isStaking` to `isStaked` as per our edit above. This is in the `<StakeOptionsDisplay>` component. We also need to add a field for `nftData` and give it the value of `nftData`, which we need a state for.

```const [nftData, setNftData] = useState<any>()```

Right now, we don't have the actual data. We'll use a useEffect where we call metaplex and find the nft data via the mint address.

```tsx
useEffect(() => {
    const metaplex = Metaplex.make(connection).use(
      walletAdapterIdentity(walletAdapter)
    )

    try {
      metaplex
        .nfts()
        .findByMint({ mintAddress: mint })
        .then((nft) => {
          console.log("nft data on stake page:", nft)
          setNftData(nft)
        })
    } catch (e) {
      console.log("error getting nft:", e)
    }
  }, [connection, walletAdapter])
```

Don't forget to get a connection and walletAdapter above, as we have done many times.

Alright, we're in a place where we can test things, let's do *npm run dev*, and open your localhost in the browser. Have it, push the buttons. 🔘 ⏏️ 🆒

#### A few more edits
So, a few things may need work...briefly, pop back into the `StakeOptionsDisplay` file, add the following useEffect before the `handleStake` function.

```tsx
useEffect(() => {
    checkStakingStatus()

    if (nftData) {
      connection
        .getTokenLargestAccounts(nftData.mint.address)
        .then((accounts) => setNftTokenAccount(accounts.value[0].address))
    }
  }, [nftData, walletAdapter, connection])
```

It's a quick check to make sure we have nft data, and if yes, setting a value for the nft token account. It's an nft, there's only one, so it'll be the first address, hence the index value of '0'.

Additionally add `nftData` as a dependency on all three of the callback functions.

Finally, inside `handleStake`, add this code before creating your transaction.

```tsx
const [stakeAccount] = PublicKey.findProgramAddressSync(
      [walletAdapter.publicKey.toBuffer(), nftTokenAccount.toBuffer()],
      PROGRAM_ID
    )
    
const transaction = new Transaction()

const account = await connection.getAccountInfo(stakeAccount)
    if (!account) {
      transaction.add(
        createInitializeStakeAccountInstruction(
          walletAdapter.publicKey,
          nftTokenAccount,
          PROGRAM_ID
        )
      )
    }
```

We need a stake account, a PDA on the program that stores the state data about your staking. The code above initializes that account for us, if we don't have one.

Alas, we are DONE with core 4. This last bit was kind of all over the place, so to make sure we didn't miss anything, we're pasting entire `StakeOptionsDisplay` file below. 

```tsx
import { VStack, Text, Button } from "@chakra-ui/react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { PublicKey, Transaction } from "@solana/web3.js"
import { useCallback, useEffect, useState } from "react"
import {
  createInitializeStakeAccountInstruction,
  createRedeemInstruction,
  createStakingInstruction,
  createUnstakeInstruction,
} from "../utils/instructions"
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token"
import { PROGRAM_ID as METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata"
import { PROGRAM_ID, STAKE_MINT } from "../utils/constants"
import { getStakeAccount } from "../utils/accounts"

export const StakeOptionsDisplay = ({
  nftData,
  isStaked,
  daysStaked,
  totalEarned,
  claimable,
}: {
  nftData: any
  isStaked: boolean
  daysStaked: number
  totalEarned: number
  claimable: number
}) => {
  const walletAdapter = useWallet()
  const { connection } = useConnection()

  const [isStaking, setIsStaking] = useState(isStaked)
  const [nftTokenAccount, setNftTokenAccount] = useState<PublicKey>()

  const checkStakingStatus = useCallback(async () => {
    if (!walletAdapter.publicKey || !nftTokenAccount) {
      return
    }

    try {
      const account = await getStakeAccount(
        connection,
        walletAdapter.publicKey,
        nftTokenAccount
      )

      console.log("stake account:", account)

      setIsStaking(account.state === 0)
    } catch (e) {
      console.log("error:", e)
    }
  }, [walletAdapter, connection, nftTokenAccount])

  useEffect(() => {
    checkStakingStatus()

    if (nftData) {
      connection
        .getTokenLargestAccounts(nftData.mint.address)
        .then((accounts) => setNftTokenAccount(accounts.value[0].address))
    }
  }, [nftData, walletAdapter, connection])

  const handleStake = useCallback(async () => {
    if (
      !walletAdapter.connected ||
      !walletAdapter.publicKey ||
      !nftTokenAccount
    ) {
      alert("Please connect your wallet")
      return
    }

    const [stakeAccount] = PublicKey.findProgramAddressSync(
      [walletAdapter.publicKey.toBuffer(), nftTokenAccount.toBuffer()],
      PROGRAM_ID
    )

    const transaction = new Transaction()

    const account = await connection.getAccountInfo(stakeAccount)
    if (!account) {
      transaction.add(
        createInitializeStakeAccountInstruction(
          walletAdapter.publicKey,
          nftTokenAccount,
          PROGRAM_ID
        )
      )
    }

    const stakeInstruction = createStakingInstruction(
      walletAdapter.publicKey,
      nftTokenAccount,
      nftData.mint.address,
      nftData.edition.address,
      TOKEN_PROGRAM_ID,
      METADATA_PROGRAM_ID,
      PROGRAM_ID
    )

    transaction.add(stakeInstruction)

    await sendAndConfirmTransaction(transaction)
  }, [walletAdapter, connection, nftData, nftTokenAccount])

  const sendAndConfirmTransaction = useCallback(
    async (transaction: Transaction) => {
      try {
        const signature = await walletAdapter.sendTransaction(
          transaction,
          connection
        )
        const latestBlockhash = await connection.getLatestBlockhash()
        await connection.confirmTransaction(
          {
            blockhash: latestBlockhash.blockhash,
            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
            signature: signature,
          },
          "finalized"
        )
      } catch (error) {
        console.log(error)
      }

      await checkStakingStatus()
    },
    [walletAdapter, connection]
  )

  const handleUnstake = useCallback(async () => {
    if (
      !walletAdapter.connected ||
      !walletAdapter.publicKey ||
      !nftTokenAccount
    ) {
      alert("Please connect your wallet")
      return
    }

    const userStakeATA = await getAssociatedTokenAddress(
      STAKE_MINT,
      walletAdapter.publicKey
    )

    const account = await connection.getAccountInfo(userStakeATA)

    const transaction = new Transaction()

    if (!account) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          walletAdapter.publicKey,
          userStakeATA,
          walletAdapter.publicKey,
          STAKE_MINT
        )
      )
    }

    transaction.add(
      createUnstakeInstruction(
        walletAdapter.publicKey,
        nftTokenAccount,
        nftData.address,
        nftData.edition.address,
        STAKE_MINT,
        userStakeATA,
        TOKEN_PROGRAM_ID,
        METADATA_PROGRAM_ID,
        PROGRAM_ID
      )
    )

    await sendAndConfirmTransaction(transaction)
  }, [walletAdapter, connection, nftData, nftTokenAccount])

  const handleClaim = useCallback(async () => {
    if (
      !walletAdapter.connected ||
      !walletAdapter.publicKey ||
      !nftTokenAccount
    ) {
      alert("Please connect your wallet")
      return
    }

    const userStakeATA = await getAssociatedTokenAddress(
      STAKE_MINT,
      walletAdapter.publicKey
    )

    const account = await connection.getAccountInfo(userStakeATA)

    const transaction = new Transaction()

    if (!account) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          walletAdapter.publicKey,
          userStakeATA,
          walletAdapter.publicKey,
          STAKE_MINT
        )
      )
    }

    transaction.add(
      createRedeemInstruction(
        walletAdapter.publicKey,
        nftTokenAccount,
        nftData.mint.address,
        userStakeATA,
        TOKEN_PROGRAM_ID,
        PROGRAM_ID
      )
    )

    await sendAndConfirmTransaction(transaction)
  }, [walletAdapter, connection, nftData, nftTokenAccount])

  return (
    <VStack
      bgColor="containerBg"
      borderRadius="20px"
      padding="20px 40px"
      spacing={5}
    >
      <Text
        bgColor="containerBgSecondary"
        padding="4px 8px"
        borderRadius="20px"
        color="bodyText"
        as="b"
        fontSize="sm"
      >
        {isStaking
          ? `STAKING ${daysStaked} DAY${daysStaked === 1 ? "" : "S"}`
          : "READY TO STAKE"}
      </Text>
      <VStack spacing={-1}>
        <Text color="white" as="b" fontSize="4xl">
          {isStaking ? `${totalEarned} $BLD` : "0 $BLD"}
        </Text>
        <Text color="bodyText">
          {isStaking ? `${claimable} $BLD earned` : "earn $BLD by staking"}
        </Text>
      </VStack>
      <Button
        onClick={isStaking ? handleClaim : handleStake}
        bgColor="buttonGreen"
        width="200px"
      >
        <Text as="b">{isStaking ? "claim $BLD" : "stake buildoor"}</Text>
      </Button>
      {isStaking ? <Button onClick={handleUnstake}>unstake</Button> : null}
    </VStack>
  )
}
```
