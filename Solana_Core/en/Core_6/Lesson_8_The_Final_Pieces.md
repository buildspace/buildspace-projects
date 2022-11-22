**Overview**

This is the final stretch! Congrats on getting here! This has been a wild ride for everyone. No matter the state of your NFT project, take a breath and pat yourself on the back. You’re awesome.

Now, assess what you have so far and think of the least amount of work you could do to get your project ready to ship. If that means skipping the Switchboard stuff for now, so be it.

Right now, it’s time to hook up your UI to your loot box and gear instructions, then do any final polish you need and get this thing shipped!

In our case, this means:

- Creating `GearItem` and `Lootbox` components in place of the mock `ItemBox` we’ve used for that part of the UI
- Adding an `instructions.ts` file where we create functions for:
- - Creating all the instructions required to initialize our lootbox and switchboard
- - Creating all the instructions required to open the lootbox
- - NOTE: this was pretty intense lol - have a look at our solution code but also give it a shot on your own
- Doing a whole lot of debugging and polishing

Honestly the list goes on. We added a bunch to multiple components to ensure state gets updated after transactions and on-chain changes. Even so, it’s not perfect. There’s always room to do more, but don’t let your perfectionism be your enemy. Do what you can and then ship!

**Solution code**

Our solution is on the `solution-lootboxes` branch of the [Buildoors repository](https://github.com/jamesrp13/buildspace-buildoors/tree/solution-lootboxes). There are a few commits in there that make it differ from what you last saw, so if you want to see all the changes make sure to [view the diff from last week’s branch](https://github.com/jamesrp13/buildspace-buildoors/compare/solution-core-5...solution-lootboxes?expand=1).

There are  walkthroughs, but go ahead and get started on your own first. Good luck!

**Overview**
Everything you need for the final project was in the last lesson. From here on out, it's you and the text baby. Let's do it!

This is what the final product should look like, this here screenshot is from one working example of this project.

![](https://i.imgur.com/YF5XxJr.png)

In this section, we'll focus on getting the loot box and gear functionality working. The final code can use some more polish, and there are a few minor bugs that need addressing, do with it as you wish before you ship.

A couple of notes, make sure to copy and paste over your new IDL every time you change the program. Double check your React hooks and dependencies. Try to break everything into small chunks as much as possible.


We're gonna dive into some of the code changes now. Lets hop into `/components/WorkspaceProvider.tsx`.

There are only a few changes, mostly to incorporate adding switchboard program.

There is one new useState.

`const [switchboardProgram, setProgramSwitchboard] = useState<any>()`

We then load the switchboard program, and a useEffect that sets the program switchboard, that way our workspace is always up to date on all of the programs that we need. Unless you're a React pro, this may be challenging, so feel free to reference this code in depth.

``` typescript
async function program() {
    let response = await loadSwitchboardProgram(
      "devnet",
      connection,
      ((provider as AnchorProvider).wallet as AnchorWallet).payer
    )
    return response
  }

useEffect(() => {
    program().then((result) => {
      setProgramSwitchboard(result)
      console.log("result", result)
    })
  }, [connection])
```

Ok, next we hop into the `instructions.ts` file in the `utils` folder, this is a new file. There are two public functions here, the `createOpenLootboxInstructions` instructions and the `createInitSwitchboardInstructions` instructions. The latter packages up initializing stuff on the swtichboard program, and initializing the user in the lootbox program. 

``` typescript
export async function createOpenLootboxInstructions(
  connection: Connection,
  stakingProgram: Program<AnchorNftStaking>,
  switchboardProgram: SwitchboardProgram,
  lootboxProgram: Program<LootboxProgram>,
  userPubkey: PublicKey,
  nftTokenAccount: PublicKey,
  box: number
): Promise<TransactionInstruction[]> {
  const [userStatePda] = PublicKey.findProgramAddressSync(
    [userPubkey.toBytes()],
    lootboxProgram.programId
  )

  const state = await lootboxProgram.account.userState.fetch(userStatePda)

  const accounts = await getAccountsAndData(
    lootboxProgram,
    switchboardProgram,
    userPubkey,
    state.vrf
  )

  return await createAllOpenLootboxInstructions(
    connection,
    stakingProgram,
    lootboxProgram,
    switchboardProgram,
    accounts,
    nftTokenAccount,
    box
  )
}
```


Further down, there is the `getAccountsAndData` function, it takes four fields as you can see, for the last one, you'll need to generate or fetch the vrf account beforehand. What this does is gets a few accounts, bumps and other data, packages it all up, and returns them all as one object. 

``` typescript
async function getAccountsAndData(
  lootboxProgram: Program<LootboxProgram>,
  switchboardProgram: SwitchboardProgram,
  userPubkey: PublicKey,
  vrfAccount: PublicKey
): Promise<AccountsAndDataSuperset> {
  const [userStatePda] = PublicKey.findProgramAddressSync(
    [userPubkey.toBytes()],
    lootboxProgram.programId
  )

  // required switchboard accoount
  const [programStateAccount, stateBump] =
    ProgramStateAccount.fromSeed(switchboardProgram)

  // required switchboard accoount
  const queueAccount = new OracleQueueAccount({
    program: switchboardProgram,
    // devnet permissionless queue
    publicKey: new PublicKey("F8ce7MsckeZAbAGmxjJNetxYXQa9mKr9nnrC3qKubyYy"),
  })

  // required switchboard accoount
  const queueState = await queueAccount.loadData()
  // wrapped SOL is used to pay for switchboard VRF requests
  const wrappedSOLMint = await queueAccount.loadMint()

  // required switchboard accoount
  const [permissionAccount, permissionBump] = PermissionAccount.fromSeed(
    switchboardProgram,
    queueState.authority,
    queueAccount.publicKey,
    vrfAccount
  )

  // required switchboard accoount
  // escrow wrapped SOL token account owned by the VRF account we will initialize
  const escrow = await spl.getAssociatedTokenAddress(
    wrappedSOLMint.address,
    vrfAccount,
    true
  )

  const size = switchboardProgram.account.vrfAccountData.size

  return {
    userPubkey: userPubkey,
    userStatePda: userStatePda,
    vrfAccount: vrfAccount,
    escrow: escrow,
    wrappedSOLMint: wrappedSOLMint,
    programStateAccount: programStateAccount,
    stateBump: stateBump,
    permissionBump: permissionBump,
    queueAccount: queueAccount,
    queueState: queueState,
    permissionAccount: permissionAccount,
    size: size,
  }
}
```

That object is defined at the bottom of the file as an interface, this is simply to make sure you have everything you need and are able to call them appropriately. While each instruction won't need every field in the object, it will make it easy for each instruction to get all access to the data it needs. 

``` typescript
interface AccountsAndDataSuperset {
  userPubkey: PublicKey
  userStatePda: PublicKey
  vrfAccount: PublicKey
  escrow: PublicKey
  wrappedSOLMint: spl.Mint
  programStateAccount: ProgramStateAccount
  stateBump: number
  permissionBump: number
  queueAccount: OracleQueueAccount
  queueState: any
  permissionAccount: PermissionAccount
  size: number
}
```

Let's dive into the `createInitSwitchboardInstructions`. It first generates a vrf keypair, it then calls `getAccountsAndData` to get us all the accounts we need. Then with `initSwitchboardLootboxUser`, it assembles the instructions. It then returns the instructions, as well as the vrf keypair, which is needed to sign.

``` typescript
export async function createInitSwitchboardInstructions(
  switchboardProgram: SwitchboardProgram,
  lootboxProgram: Program<LootboxProgram>,
  userPubkey: PublicKey
): Promise<{
  instructions: Array<TransactionInstruction>
  vrfKeypair: Keypair
}> {
  const vrfKeypair = Keypair.generate()

  const accounts = await getAccountsAndData(
    lootboxProgram,
    switchboardProgram,
    userPubkey,
    vrfKeypair.publicKey
  )

  const initInstructions = await initSwitchboardLootboxUser(
    switchboardProgram,
    lootboxProgram,
    accounts,
    vrfKeypair
  )

  return { instructions: initInstructions, vrfKeypair: vrfKeypair }
}
```

As for the `initSwitchboardLootboxUser`, we first get a PDA and the state bump.

``` typescript
async function initSwitchboardLootboxUser(
  switchboardProgram: SwitchboardProgram,
  lootboxProgram: Program<LootboxProgram>,
  accountsAndData: AccountsAndDataSuperset,
  vrfKeypair: Keypair
): Promise<Array<TransactionInstruction>> {
  // lootbox account PDA
  const [lootboxPointerPda] = await PublicKey.findProgramAddress(
    [Buffer.from("lootbox"), accountsAndData.userPubkey.toBytes()],
    lootboxProgram.programId
  )

  const stateBump = accountsAndData.stateBump
```
Then we start assembling an array of instructions. First thing we need to do is create an escrow associated token account, owned by the vrf keypair.

``` typescript
  const txnIxns: TransactionInstruction[] = [
    // create escrow ATA owned by VRF account
    spl.createAssociatedTokenAccountInstruction(
      accountsAndData.userPubkey,
      accountsAndData.escrow,
      vrfKeypair.publicKey,
      accountsAndData.wrappedSOLMint.address
    ),
```

Next is the set authority instruction. 
``` typescript
    // transfer escrow ATA owner to switchboard programStateAccount
    spl.createSetAuthorityInstruction(
      accountsAndData.escrow,
      vrfKeypair.publicKey,
      spl.AuthorityType.AccountOwner,
      accountsAndData.programStateAccount.publicKey,
      [vrfKeypair]
    ),
        
```

Then we call create account to create the vrf account.

``` typescript
    // request system program to create new account using newly generated keypair for VRF account
    SystemProgram.createAccount({
      fromPubkey: accountsAndData.userPubkey,
      newAccountPubkey: vrfKeypair.publicKey,
      space: accountsAndData.size,
      lamports:
        await switchboardProgram.provider.connection.getMinimumBalanceForRentExemption(
          accountsAndData.size
        ),
      programId: switchboardProgram.programId,
    }),
        
```

Then we use the switchboard program methods for vrf init, where we provide it the consume randomness callback. 

``` typescript
    // initialize new VRF account, included the callback CPI into lootbox program as instruction data
    await switchboardProgram.methods
      .vrfInit({
        stateBump,
        callback: {
          programId: lootboxProgram.programId,
          accounts: [
            {
              pubkey: accountsAndData.userStatePda,
              isSigner: false,
              isWritable: true,
            },
            {
              pubkey: vrfKeypair.publicKey,
              isSigner: false,
              isWritable: false,
            },
            { pubkey: lootboxPointerPda, isSigner: false, isWritable: true },
            {
              pubkey: accountsAndData.userPubkey,
              isSigner: false,
              isWritable: false,
            },
          ],
          ixData: new BorshInstructionCoder(lootboxProgram.idl).encode(
            "consumeRandomness",
            ""
          ),
        },
      })
      .accounts({
        vrf: vrfKeypair.publicKey,
        escrow: accountsAndData.escrow,
        authority: accountsAndData.userStatePda,
        oracleQueue: accountsAndData.queueAccount.publicKey,
        programState: accountsAndData.programStateAccount.publicKey,
        tokenProgram: spl.TOKEN_PROGRAM_ID,
      })
      .instruction(),
    // initialize switchboard permission account, required account
```

Next we use switchboard to call the permission init. 

``` typescript
    await switchboardProgram.methods
      .permissionInit({})
      .accounts({
        permission: accountsAndData.permissionAccount.publicKey,
        authority: accountsAndData.queueState.authority,
        granter: accountsAndData.queueAccount.publicKey,
        grantee: vrfKeypair.publicKey,
        payer: accountsAndData.userPubkey,
        systemProgram: SystemProgram.programId,
      })
      .instruction(),
```

And finally, we call our lootbox program init user, and return the instructions, which will get packaged up into a transaction by the caller. 

``` typescript
    await lootboxProgram.methods
      .initUser({
        switchboardStateBump: accountsAndData.stateBump,
        vrfPermissionBump: accountsAndData.permissionBump,
      })
      .accounts({
        // state: userStatePDA,
        vrf: vrfKeypair.publicKey,
        // payer: publicKey,
        // systemProgram: anchor.web3.SystemProgram.programId,
      })
      .instruction(),
  ]

  return txnIxns
}
```


Lastly, let's go over the `createOpenLootboxInstructions`. First we get the user state PDA, we have to actually fetch that account so we can pull the vrf keypair off of it. 

``` typescript
export async function createOpenLootboxInstructions(
  connection: Connection,
  stakingProgram: Program<AnchorNftStaking>,
  switchboardProgram: SwitchboardProgram,
  lootboxProgram: Program<LootboxProgram>,
  userPubkey: PublicKey,
  nftTokenAccount: PublicKey,
  box: number
): Promise<TransactionInstruction[]> {
  const [userStatePda] = PublicKey.findProgramAddressSync(
    [userPubkey.toBytes()],
    lootboxProgram.programId
  )

  const state = await lootboxProgram.account.userState.fetch(userStatePda)
```

Here we call `getAccountsAndData` to get all the accounts we need. Followed by `createAllOpenLootboxInstructions`, which we'll dive into next. 

``` typescript
  const accounts = await getAccountsAndData(
    lootboxProgram,
    switchboardProgram,
    userPubkey,
    state.vrf
  )

  return await createAllOpenLootboxInstructions(
    connection,
    stakingProgram,
    lootboxProgram,
    switchboardProgram,
    accounts,
    nftTokenAccount,
    box
  )
}
```

We get the wrapped token account, with wrapped SOL, as that's what we have to use to pay for requesting randomness. 

``` typescript 
async function createAllOpenLootboxInstructions(
  connection: Connection,
  stakingProgram: Program<AnchorNftStaking>,
  lootboxProgram: Program<LootboxProgram>,
  switchboardProgram: SwitchboardProgram,
  accountsAndData: AccountsAndDataSuperset,
  nftTokenAccount: PublicKey,
  box: number
): Promise<TransactionInstruction[]> {
  // user Wrapped SOL token account
  // wSOL amount is then transferred to escrow account to pay switchboard oracle for VRF request
  const wrappedTokenAccount = await spl.getAssociatedTokenAddress(
    accountsAndData.wrappedSOLMint.address,
    accountsAndData.userPubkey
  )
```
Next we get the `stakeTokenAccount` which is associated with the BLD, so you can use BLD tokens in exchange for opening a lootbox. Then the stake account to make sure you have earned enough BLD through staking, to open the lootbox.

``` typescript
  // user BLD token account, used to pay BLD tokens to call the request randomness instruction on Lootbox program
  const stakeTokenAccount = await spl.getAssociatedTokenAddress(
    STAKE_MINT,
    accountsAndData.userPubkey
  )

  const [stakeAccount] = PublicKey.findProgramAddressSync(
    [accountsAndData.userPubkey.toBytes(), nftTokenAccount.toBuffer()],
    stakingProgram.programId
  )
```
Here we start to assemble instructions. If there is no wrapped token account, we add an instruction for creating it. 

``` typescript
  let instructions: TransactionInstruction[] = []
  // check if a wrapped SOL token account exists, if not add instruction to create one
  const account = await connection.getAccountInfo(wrappedTokenAccount)
  if (!account) {
    instructions.push(
      spl.createAssociatedTokenAccountInstruction(
        accountsAndData.userPubkey,
        wrappedTokenAccount,
        accountsAndData.userPubkey,
        accountsAndData.wrappedSOLMint.address
      )
    )
  }
```

Then we push a transfer instruction for transferring SOL to wrapped SOL. Then an instruction for synching wrapped SOL balance. 

``` typescript
  // transfer SOL to user's own wSOL token account
  instructions.push(
    SystemProgram.transfer({
      fromPubkey: accountsAndData.userPubkey,
      toPubkey: wrappedTokenAccount,
      lamports: 0.002 * LAMPORTS_PER_SOL,
    })
  )
  // sync wrapped SOL balance
  instructions.push(spl.createSyncNativeInstruction(wrappedTokenAccount))
```

Finally we build and return our instruction for opening the lootbox, so the caller can package them up and send them.

``` typescript

  // Lootbox program request randomness instruction
  instructions.push(
    await lootboxProgram.methods
      .openLootbox(new BN(box))
      .accounts({
        user: accountsAndData.userPubkey,
        stakeMint: STAKE_MINT,
        stakeMintAta: stakeTokenAccount,
        stakeState: stakeAccount,
        state: accountsAndData.userStatePda,
        vrf: accountsAndData.vrfAccount,
        oracleQueue: accountsAndData.queueAccount.publicKey,
        queueAuthority: accountsAndData.queueState.authority,
        dataBuffer: accountsAndData.queueState.dataBuffer,
        permission: accountsAndData.permissionAccount.publicKey,
        escrow: accountsAndData.escrow,
        programState: accountsAndData.programStateAccount.publicKey,
        switchboardProgram: switchboardProgram.programId,
        payerWallet: wrappedTokenAccount,
        recentBlockhashes: SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
      })
      .instruction()
  )

  return instructions
}
```

That's it for instructions, let's go have a look at the new lootbox component, where these instructions will be used. 