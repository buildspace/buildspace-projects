Now that you have the program working, let's hop into the front-end code and adjust it for Anchor. This set up will take a minute, bear with me as we alter a few things.

First things first, let's bring in our IDL from our program. Simply copy and paste the entire file, both for the JSON and typescript format, into the `utils` folder.

Next, create a new component file called `WorkspaceProvider.ts`. To save a little time, we are pasting in this code from the movie review front-end we built, then changing instaces of movie review to anchor nft staking. You'll notice that we are importing `PROGRAM_ID` from the constants folder, go in there and make sure the program ID is the new one for our anchor nft staking program (as opposed to the one from our solana native program).

``` typescript
import { createContext, useContext } from "react"
import {
  Program,
  AnchorProvider,
  Idl,
  setProvider,
} from "@project-serum/anchor"
import { AnchorNftStaking, IDL } from "../utils/anchor_nft_staking"
import { Connection } from "@solana/web3.js"
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react"
import { PROGRAM_ID } from "../utils/constants"

const WorkspaceContext = createContext({})
const programId = PROGRAM_ID

interface Workspace {
  connection?: Connection
  provider?: AnchorProvider
  program?: Program<AnchorNftStaking>
}

const WorkspaceProvider = ({ children }: any) => {
  const wallet = useAnchorWallet() || MockWallet
  const { connection } = useConnection()

  const provider = new AnchorProvider(connection, wallet, {})
  setProvider(provider)

  const program = new Program(IDL as Idl, programId)
  const workspace = {
    connection,
    provider,
    program,
  }

  return (
    <WorkspaceContext.Provider value={workspace}>
      {children}
    </WorkspaceContext.Provider>
  )
}

const useWorkspace = (): Workspace => {
  return useContext(WorkspaceContext)
}

import { Keypair } from "@solana/web3.js"

const MockWallet = {
  publicKey: Keypair.generate().publicKey,
  signTransaction: () => Promise.reject(),
  signAllTransactions: () => Promise.reject(),
}

export { WorkspaceProvider, useWorkspace }
```

Also copy over the mock wallet file from movie review, or create a new component called `MockWallet.ts`, and paste in this code.

``` typscript
import { Keypair } from "@solana/web3.js"

const MockWallet = {
  publicKey: Keypair.generate().publicKey,
  signTransaction: () => Promise.reject(),
  signAllTransactions: () => Promise.reject(),
}

export default MockWallet
```

Make sure to install project serum, `npm install @project-serum/anchor`.

Now `npm run dev` and see if everything is working on localhost...if so, let's continue. 

Now that we're all set on imports and additional components, let's comb through the files and see where we can make things simpler since we're using Anchor now.

Jump into (/pages/_app.tsx) and add our new WorkspaceProvider, do make sure it gets imported.

``` typescript
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <WalletContextProvider>
        <WorkspaceProvider>
          <Component {...pageProps} />
        </WorkspaceProvider>
      </WalletContextProvider>
    </ChakraProvider>
  )
}
```

Hop over to `StakeOptionsDisplay.ts` in the components folder.

Let's import anchor.

`import * as anchor from @project-serum/anchor`

Under the declaration of the two state variables, let's define workspace.

`let workspace = useWorkspace()`

Then inside `checkStakingStatus` add this additional check, along with our other checks, to make sure we have `!workspace.program`.

``` typescript
if (
  !walletAdapter.connected ||
  !walletAdapter.publicKey ||
  !nftTokenAccount ||
  !workspace.program
    )
```

Now hop over to `/utils/accounts.ts`. You can delete all the borsh code, and replace the `getStakeAccount` code with this. This is one of the beauties of working with Anchor, we don't need to worry about serialization and deserialization.

``` typescript
export async function getStakeAccount(
  program: any,
  user: PublicKey,
  tokenAccount: PublicKey
): Promise<StakeAccount> {
  const [pda] = PublicKey.findProgramAddressSync(
    [user.toBuffer(), tokenAccount.toBuffer()],
    program.programId
  )

  const account = await program.account.userStakeInfo.fetch(pda)
  return account
}
```

It's already much simpler than before, right?!?

Back over to `checkStakingStatus` in `StakeOptionsDisplay`, where `getStakeAccount` is called, change the first argument from `connection` to `workspace.program`.

Go to your browser, make sure everything is still functional on localhost.

Back into StakeOptionsDisplay, scroll down to the `handleStake` function. 

Again, first add a check for `!workspace.program`. We're gonna want to add this to our `handleUnstake` and `handleClaim` functions soon enough.

You can immediately delete all this code from our previous work.

``` typescript
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
```

... and simply replace it with:

``` typescript
transaction.add(
  await workspace.program.methods
    .stake()
    .accounts({
      nftTokenAccount: nftTokenAccount,
      nftMint: nftData.mint.address,
      nftEdition: nftData.edition.address,
      metadataProgram: METADATA_PROGRAM_ID,
    })
    .instruction()
)
```

This also means a bunch of code we created in the instructions.ts file is no longer necessary. Again, hop over to the browser and test things out.

Assuming things are functioning as expected, let's tackle the `handleUnstake` code.

Let's dump this code as this is all handled by the program now.

``` typescript
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

Then inside the `transaction.add` get rid of the `createUnstakeInstruction` and replace it with this:

``` typescript
transaction.add(
  await workspace.program.methods
    .unstake()
    .accounts({
      nftTokenAccount: nftTokenAccount,
      nftMint: nftData.mint.address,
      nftEdition: nftData.edition.address,
      metadataProgram: METADATA_PROGRAM_ID,
      stakeMint: STAKE_MINT,
      userStakeAta: userStakeATA,
    })
    .instruction()
)
```

You'll notice it's the same accounts as `handleStake` plus a couple more for the stake mint and user ATA.

Finally, down to `handleClaim`, follow the same pattern of deleting, and the new transaction.add should look like this:

``` typescript
transaction.add(
  await workspace.program.methods
    .redeem()
    .accounts({
      nftTokenAccount: nftTokenAccount,
      stakeMint: STAKE_MINT,
      userStakeAta: userStakeATA,
    })
    .instruction()
)
```

You can now just delete the `instructions.ts` files all together. Do it!!! :)

Feel free to clean up your unused imports to clean up your file.

One more thing we need to do, inside the tokens directory, where we've made our reward token, we need to reinitialize this with the new program ID. In the `bld/index.ts` file, when `await createBldToken` is called, that's where the new program ID needs to be replaced. Then re-run `npm run create-bld-token` script. If we don't do this, our redeem won't work. 

This will create a new mint program ID, which you need to add to your environment variables.

That's it, we have some functionality working on the front-end. Next week, we'll do a ton more shipping using Anchor, for now we just wanted to show how much easier it is, and get the basic functions up and running. 
