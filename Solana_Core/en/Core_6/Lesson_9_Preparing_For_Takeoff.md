
Alright, let's hop into `/components/Lootbox.tsx`. Let's have a quick look at the layout before we dive into the logic.

We center everything and simply have three checks of whether there's an available lootbox, a stake account, and if the total earned number is greater than the lootbox. If yes, it renders a box with various options of, otherwise it says to keep staking. We'll shortly look at `handleRedeemLoot` or `handleOpenLootbox`.

```tsx
  return (
    <Center
      height="120px"
      width="120px"
      bgColor={"containerBg"}
      borderRadius="10px"
    >
      {availableLootbox &&
      stakeAccount &&
      stakeAccount.totalEarned.toNumber() >= availableLootbox ? (
        <Button
          borderRadius="25"
          onClick={mint ? handleRedeemLoot : handleOpenLootbox}
          isLoading={isConfirmingTransaction}
        >
          {mint
            ? "Redeem"
            : userAccountExists
            ? `${availableLootbox} $BLD`
            : "Enable"}
        </Button>
      ) : (
        <Text color="bodyText">Keep Staking</Text>
      )}
    </Center>
  )
```

In the function, first we have a ton of setup, with a lot of state. There's a useEffect to make sure we have a public key, a lootbox program and staking program, if those are all there, it calls `handleStateRefresh`.

```tsx
export const Lootbox = ({
  stakeAccount,
  nftTokenAccount,
  fetchUpstreamState,
}: {
  stakeAccount?: StakeAccount
  nftTokenAccount: PublicKey
  fetchUpstreamState: () => void
}) => {
  const [isConfirmingTransaction, setIsConfirmingTransaction] = useState(false)
  const [availableLootbox, setAvailableLootbox] = useState(0)
  const walletAdapter = useWallet()
  const { stakingProgram, lootboxProgram, switchboardProgram } = useWorkspace()
  const { connection } = useConnection()

  const [userAccountExists, setUserAccountExist] = useState(false)
  const [mint, setMint] = useState<PublicKey>()

  useEffect(() => {
    if (!walletAdapter.publicKey || !lootboxProgram || !stakingProgram) return

    handleStateRefresh(lootboxProgram, walletAdapter.publicKey)
  }, [walletAdapter, lootboxProgram])
```

The state refresh is packaged up as a separate function as it is called after every transaction as well. This simply calls two functions. 

```tsx
const handleStateRefresh = async (
    lootboxProgram: Program<LootboxProgram>,
    publicKey: PublicKey
  ) => {
    checkUserAccount(lootboxProgram, publicKey)
    fetchLootboxPointer(lootboxProgram, publicKey)
  }
```

`checkUserAccount` will get the user state PDA, and if it does exist, we call `setUserAccountExist` and set it to true.

```tsx
// check if UserState account exists
  // if UserState account exists also check if there is a redeemable item from lootbox
  const checkUserAccount = async (
    lootboxProgram: Program<LootboxProgram>,
    publicKey: PublicKey
  ) => {
    try {
      const [userStatePda] = PublicKey.findProgramAddressSync(
        [publicKey.toBytes()],
        lootboxProgram.programId
      )
      const account = await lootboxProgram.account.userState.fetch(userStatePda)
      if (account) {
        setUserAccountExist(true)
      } else {
        setMint(undefined)
        setUserAccountExist(false)
      }
    } catch {}
  }
```

`fetchLootboxPointer` which basically gets the lootbox pointer, to set the available lootbox and the mint, if it is redeemable.

```tsx
const fetchLootboxPointer = async (
    lootboxProgram: Program<LootboxProgram>,
    publicKey: PublicKey
  ) => {
    try {
      const [lootboxPointerPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("lootbox"), publicKey.toBytes()],
        LOOTBOX_PROGRAM_ID
      )

      const lootboxPointer = await lootboxProgram.account.lootboxPointer.fetch(
        lootboxPointerPda
      )

      setAvailableLootbox(lootboxPointer.availableLootbox.toNumber())
      setMint(lootboxPointer.redeemable ? lootboxPointer.mint : undefined)
    } catch (error) {
      console.log(error)
      setAvailableLootbox(10)
      setMint(undefined)
    }
  }
```

Back to the two main pieces of logic, one is `handleOpenLootbox`. It first checks to make sure we have all the necessary items to pass into the function, and then calls `openLootbox`.

```tsx
const handleOpenLootbox: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (event) => {
      if (
        event.defaultPrevented ||
        !walletAdapter.publicKey ||
        !lootboxProgram ||
        !switchboardProgram ||
        !stakingProgram
      )
        return

      openLootbox(
        connection,
        userAccountExists,
        walletAdapter.publicKey,
        lootboxProgram,
        switchboardProgram,
        stakingProgram
      )
    },
    [
      lootboxProgram,
      connection,
      walletAdapter,
      userAccountExists,
      walletAdapter,
      switchboardProgram,
      stakingProgram,
    ]
  )

```
`openLootbox` starts with a check to see if user account exists, if not, it calls `createInitSwitchboardInstructions` from the instruction file, which gives us back instructions and vrfKeypair. If that account does not exist, we have not initialized switchboard yet. 

```tsx
const openLootbox = async (
    connection: Connection,
    userAccountExists: boolean,
    publicKey: PublicKey,
    lootboxProgram: Program<LootboxProgram>,
    switchboardProgram: SwitchboardProgram,
    stakingProgram: Program<AnchorNftStaking>
  ) => {
    if (!userAccountExists) {
      const { instructions, vrfKeypair } =
        await createInitSwitchboardInstructions(
          switchboardProgram,
          lootboxProgram,
          publicKey
        )
```

We then create a new transaction, add the instructions and call `sendAndConfirmTransaction`, which we created. It takes an object as the vrfKeypair as a signer. 

```tsx
      const transaction = new Transaction()
      transaction.add(...instructions)
      sendAndConfirmTransaction(connection, walletAdapter, transaction, {
        signers: [vrfKeypair],
      })
    } 
...
```


Let's hop out of the logic and look at `sendAndConfirmTransaction`. First we set that we're loading with `setIsConfirmingTransaction(true)`.

Then we call to send the transaction, but we pass it options, which is optional as we don't always have it. This is how we can send the signer of vrfKeypair, but we don't always do that.

Once it confirms, we use `await Promise.all` where we call `handleStateRefresh` and `fetchUpstreamState`. The latter comes in as a prop, it's basically the fetch state function on the stake component. 

```tsx
const sendAndConfirmTransaction = async (
    connection: Connection,
    walletAdapter: WalletContextState,
    transaction: Transaction,
    options?: SendTransactionOptions
  ) => {
    setIsConfirmingTransaction(true)

    try {
      const signature = await walletAdapter.sendTransaction(
        transaction,
        connection,
        options
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

      console.log("Transaction complete")
      await Promise.all([
        handleStateRefresh(lootboxProgram!, walletAdapter.publicKey!),
        fetchUpstreamState(),
      ])
    } catch (error) {
      console.log(error)
      throw error
    } finally {
      setIsConfirmingTransaction(false)
    }
  }
```
Now back to the else statement for the `handleOpenLootbox`, this is the logic for when the account does exist. So we set the open lootbo instruction and send those. Then call `sendAndConfirmTransaction`. Once confirmed, that function will set is confirming to false, so we then set it true again. 

```tsx
...
    else {
      const instructions = await createOpenLootboxInstructions(
        connection,
        stakingProgram,
        switchboardProgram,
        lootboxProgram,
        publicKey,
        nftTokenAccount,
        availableLootbox
      )

      const transaction = new Transaction()
      transaction.add(...instructions)
      try {
        await sendAndConfirmTransaction(connection, walletAdapter, transaction)
        setIsConfirmingTransaction(true)
```

Finally, this is the logic for waiting to see when the mint gets deposited into the lootbox pointer, so we can redeem it. (this code is only working intermittently, don't rely on it, and fix it if you can).

```tsx
    const [lootboxPointerPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("lootbox"), publicKey.toBytes()],
      lootboxProgram.programId
    )

    const id = await connection.onAccountChange(
      lootboxPointerPda,
      async (_) => {
        try {
          const account = await lootboxProgram.account.lootboxPointer.fetch(
            lootboxPointerPda
          )
          if (account.redeemable) {
            setMint(account.mint)
            connection.removeAccountChangeListener(id)
            setIsConfirmingTransaction(false)
          }
        } catch (error) {
          console.log("Error in waiter:", error)
        }
      }
    )
  } catch (error) {
    console.log(error)
  }
}
}
```

A quick hop over to the `/pages/stake.tsx`. A small modification where we say if there is `nftData` and `nftTokenAccount`, then display lootbox and pass in the stake account, the nft token account, and call fetchstate with the mint address as the fetch state upstream prop.

```tsx
<HStack>
  {nftData && nftTokenAccount && (
    <Lootbox
      stakeAccount={stakeAccount}
      nftTokenAccount={nftTokenAccount}
      fetchUpstreamState={() => {
        fetchstate(nftData.mint.address)
      }}
    />
  )}
</HStack>
```

Now hope back over and let's review `handleRedeemLoot`, which is a lot more straightfoward. We first get the associated token. Then we create a new trasnaction with our `retrieveItemFromLootbox` function, and then send and confirm the transaction.

```tsx
const handleRedeemLoot: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (event) => {
      if (
        event.defaultPrevented ||
        !walletAdapter.publicKey ||
        !lootboxProgram ||
        !mint
      )
        return

      const userGearAta = await getAssociatedTokenAddress(
        mint,
        walletAdapter.publicKey
      )

      const transaction = new Transaction()
      transaction.add(
        await lootboxProgram.methods
          .retrieveItemFromLootbox()
          .accounts({
            mint: mint,
            userGearAta: userGearAta,
          })
          .instruction()
      )

      sendAndConfirmTransaction(connection, walletAdapter, transaction)
    },
    [walletAdapter, lootboxProgram, mint]
  )
```

That was a lot, we hopped around quite a bit, so if you need to reference the code for the whole file, have a [look here](https://github.com/jamesrp13/buildspace-buildoors/blob/solution-lootboxes/components/Lootbox.tsx).



Alas, let's have a look at the `GearItem` component. This one is a bit less complicated, and much shorter.

```tsx
import { Center, Image, VStack, Text } from "@chakra-ui/react"
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { useEffect, useState } from "react"

export const GearItem = ({
  item,
  balance,
}: {
  item: string
  balance: number
}) => {
  const [metadata, setMetadata] = useState<any>()
  const { connection } = useConnection()
  const walletAdapter = useWallet()

  useEffect(() => {
    const metaplex = Metaplex.make(connection).use(
      walletAdapterIdentity(walletAdapter)
    )

    const mint = new PublicKey(item)

    try {
      metaplex
        .nfts()
        .findByMint({ mintAddress: mint })
        .run()
        .then((nft) => fetch(nft.uri))
        .then((response) => response.json())
        .then((nftData) => setMetadata(nftData))
    } catch (error) {
      console.log("error getting gear token:", error)
    }
  }, [item, connection, walletAdapter])

  return (
    <VStack>
      <Center
        height="120px"
        width="120px"
        bgColor={"containerBg"}
        borderRadius="10px"
      >
        <Image src={metadata?.image ?? ""} alt="gear token" padding={4} />
      </Center>
      <Text color="white" as="b" fontSize="md" width="100%" textAlign="center">
        {`x${balance}`}
      </Text>
    </VStack>
  )
}
```

The layout is quite similar to the last one, but now we display an image, with the metadata on the gear token as the source. Below it, we display the number of each gear token you have. 

As for the logic, we pass in the item, as a base58 encoded string representing the mint of the token, and how many you have.

In the useEffect, we create a metaplex object. We turn that string for `item` into a public key. Then call metaplex to find items by the mint. We get back the nft, call fetch on the uri of the nft, which gets us the off-chain metadata. We take that response, turn it into a json, and set it as the metadata, which gives us an image property which we can show in the return call.

Back to the `stake.tsx` file. First we add a line for state for gear balances.

`const [gearBalances, setGearBalances] = useState<any>({})`

We then call it inside of fetchSate.

In fetch state, we set balances to an empty object. Then loop through our different gear options, and get the ATA for the current user, that's associated with that mint. That gives us an address, which we use to get the account, and set the balances for that specific gear mint, to the number we have. After that loop, we call `setGearBalances(balances)`.

So in the UI, we check to see if the length of gear balances is great than zero, then we show all the gear stuff, or don't show it at all.

```ts
<HStack spacing={10} align="start">
  {Object.keys(gearBalances).length > 0 && (
    <VStack alignItems="flex-start">
      <Text color="white" as="b" fontSize="2xl">
        Gear
      </Text>
      <SimpleGrid
        columns={Math.min(2, Object.keys(gearBalances).length)}
        spacing={3}
      >
        {Object.keys(gearBalances).map((key, _) => {
          return (
            <GearItem
              item={key}
              balance={gearBalances[key]}
              key={key}
            />
          )
        })}
      </SimpleGrid>
    </VStack>
  )}
  <VStack alignItems="flex-start">
    <Text color="white" as="b" fontSize="2xl">
      Loot Box
    </Text>
    <HStack>
      {nftData && nftTokenAccount && (
        <Lootbox
          stakeAccount={stakeAccount}
          nftTokenAccount={nftTokenAccount}
          fetchUpstreamState={() => {
            fetchstate(nftData.mint.address)
          }}
        />
      )}
    </HStack>
  </VStack>
</HStack>
```

That's it for checking for and displaying gear. Here's the [code in the repo](https://github.com/jamesrp13/buildspace-buildoors/blob/solution-lootboxes/components/GearItem.tsx) for your reference. 

What happens next is in your hands. You can decide out which bugs you want to fix, and which you're ok to live with. Get everything off localhost and get it shipped, so you can share a public link.

...and if you're feeling up to it, get it production ready, and deploy it to mainnet. There are obviously many more improvements you can and should make before going live on mainnet, e.g. fixing the bugs, adding more checks, have more NFTs, etc -- if you're up for it, get it out there! 