### Walkthrough of Switchboard setup 🚶🏽🔀

**Overview**
We're going to build a basic program to request randomness using Switchboard. In this video we'll focus on the client-side setup for Switchboard in our test environment.

We'll first do the switchboard setup, which is in its own file at [/tests/utils/setupSwitchboard.ts](https://github.com/Unboxed-Software/anchor-nft-staking-program/blob/solution-randomize-loot/tests/utils/setupSwitchboard.ts).

This is the setup that lets us run our tests against it. Their documenation is very sparse, but we should do well enough for the randomization piece.

Let's review the code, here are the three imports we will need.

``` typescript
import { SwitchboardTestContext } from "@switchboard-xyz/sbv2-utils"
import * as anchor from "@project-serum/anchor"
import * as sbv2 from "@switchboard-xyz/switchboard-v2"
```

For the actual function, you'll notice the three items we pass in are provider, lootboxProgram and payer.

The first thing we do is load the devnet queue, which gives us a testing environment on devnet. The ID is the program ID for switchboard, and the 100,000,000 are switchboard tokens, which we need to access their stuff.

``` typescript
export const setupSwitchboard = async (provider, lootboxProgram, payer) => {

    const switchboard = await SwitchboardTestContext.loadDevnetQueue(
    provider,
    "F8ce7MsckeZAbAGmxjJNetxYXQa9mKr9nnrC3qKubyYy",
    100_000_000
  )
```

Then we have a bunch of logs to make sure everything is good and ready to go.

``` typescript
console.log(switchboard.mint.address.toString())

await switchboard.oracleHeartbeat()
const { queue, unpermissionedVrfEnabled, authority } =
await switchboard.queue.loadData()
console.log(`oracleQueue: ${switchboard.queue.publicKey}`)
console.log(`unpermissionedVrfEnabled: ${unpermissionedVrfEnabled}`)
console.log(`# of oracles heartbeating: ${queue.length}`)
console.log(
"\x1b[32m%s\x1b[0m",
`\u2714 Switchboard devnet environment loaded successfully\n`
  )
```

The const state is the key component in the above, it loads the switchboard queue data we need which we will use through the rest of the function.

We then create our verified random function (VRF) account. This is very particular to the part of swtichboard we're using. As you can see, it generates a new keypair.

``` typescript
// CREATE VRF ACCOUNT
// keypair for vrf account
const vrfKeypair = anchor.web3.Keypair.generate()
```

As part of creating the VRF account, we're going to need access to a couple of PDAs.

``` typescript
// find PDA used for our client state pubkey
const [userState] = anchor.utils.publicKey.findProgramAddressSync(
[vrfKeypair.publicKey.toBytes(), payer.publicKey.toBytes()],
lootboxProgram.programId
)

// lootboxPointerPda for callback
const [lootboxPointerPda] = anchor.web3.PublicKey.findProgramAddressSync(
[Buffer.from("lootbox"), payer.publicKey.toBuffer()],
lootboxProgram.programId
)
```

You'll see that we are using the vrf and payer public keys as seeds. In production, those will need to be static, it will only be the payer publickey. This code ensures that we have a different vrf keypair and user state every time we run the test so we don't run into any issues trying to recreate an account we've already created while testing.

Now we can create the VRF account using the sbv2 library, passing in the switchboard program, the keypair we want to the give the vrf account, the authority which is the userState PDA, the switchboard queue, and the callback. 

So, what will happen is that when we want a new random number, we're gonna do a CPI to the switchboard program to get a random number, and it has to know an instruction on our program to CPI back to, to give us the random number. As with all instructions, it has a program ID, a list of accounts, and the instruction data. As for the accounts, the first one is where it's going to write the data for us, then vrf account, the lootbox pointer PDA where we will write the mint that has been seleted, and finally the payer.

``` typescript
// create new vrf acount
  const vrfAccount = await sbv2.VrfAccount.create(switchboard.program, {
    keypair: vrfKeypair,
    authority: userState, // set vrfAccount authority as PDA
    queue: switchboard.queue,
    callback: {
      programId: lootboxProgram.programId,
      accounts: [
        { pubkey: userState, isSigner: false, isWritable: true },
        { pubkey: vrfKeypair.publicKey, isSigner: false, isWritable: false },
        { pubkey: lootboxPointerPda, isSigner: false, isWritable: true },
        { pubkey: payer.publicKey, isSigner: false, isWritable: false },
      ],
      ixData: new anchor.BorshInstructionCoder(lootboxProgram.idl).encode(
        "consumeRandomness",
        ""
      ),
    },
  })
```

Next we create what's called a permission account.

``` typescript
// CREATE PERMISSION ACCOUNT
  const permissionAccount = await sbv2.PermissionAccount.create(
    switchboard.program,
    {
      authority,
      granter: switchboard.queue.publicKey,
      grantee: vrfAccount.publicKey,
    }
  )
```

The authority field is what we got from the load data on the queue above. This is giving our vrf account permissions in switchboard.

Next, we're chaging the permission to be us, setting the authority to payer.

``` typescript
// If queue requires permissions to use VRF, check the correct authority was provided
  if (!unpermissionedVrfEnabled) {
    if (!payer.publicKey.equals(authority)) {
      throw new Error(
        `queue requires PERMIT_VRF_REQUESTS and wrong queue authority provided`
      )
    }

    await permissionAccount.set({
      authority: payer,
      permission: sbv2.SwitchboardPermission.PERMIT_VRF_REQUESTS,
      enable: true,
    })
  }
```

As we'll need the switchboard account bump in a couple of instructions later, we pull that out, as well as the switchboardStateBump, which is the program account for switchboard.

``` typescript
// GET PERMISSION BUMP AND SWITCHBOARD STATE BUMP
  const [_permissionAccount, permissionBump] = sbv2.PermissionAccount.fromSeed(
    switchboard.program,
    authority,
    switchboard.queue.publicKey,
    vrfAccount.publicKey
  )

  const [switchboardStateAccount, switchboardStateBump] =
    sbv2.ProgramStateAccount.fromSeed(switchboard.program)
```

That is all the data we'll need to run our test to interact with both our program and switchboard, which we return at the end.

``` typescript
return {
    switchboard: switchboard,
    lootboxPointerPda: lootboxPointerPda,
    permissionBump: permissionBump,
    permissionAccount: permissionAccount,
    switchboardStateBump: switchboardStateBump,
    switchboardStateAccount: switchboardStateAccount,
    vrfAccount: vrfAccount,
  }
```

We end up calling this entire function in our testing environment setup in `anchor-nft-staking.ts`, so our before will now look like this.

``` typescript
before(async () => {
    ;({ nft, stakeStatePda, mint, tokenAddress } = await setupNft(
      program,
      wallet.payer
    ))
    ;({
      switchboard,
      lootboxPointerPda,
      permissionBump,
      switchboardStateBump,
      vrfAccount,
      switchboardStateAccount,
      permissionAccount,
    } = await setupSwitchboard(provider, lootboxProgram, wallet.payer))
  })
```

That's the primer on what we'll need for switchboard on the client side. 


### Walkthrough of init_user instruction 👶

First things first, for our lootbox program, we previously had everything in `lib.rs`, but it was getting big and unwieldy, so it's now broken up, [have a look](https://github.com/Unboxed-Software/anchor-nft-staking-program/tree/solution-randomize-loot/programs/lootbox-program) to see the file structure. 

Now the lib file is mostly just a bunch of use statements, the declare id macro, and our four instructions, which are not doing anything but calling to other files. 

Init_user will create the user state account that we'll share between our program and switchboard, it's like a liason account. 

Open lootbox is same as before, it will kick off the process of generating a random mint, but it won't finish the process, instead it will generate a CPI to call out to switchboard to ask for a random number. 

Consume randomness is what will be called by switchboard to give back the number in the instruction so we can use it, and finish the process when setting the mint. 

Retrieve item from lootbox is pretty much unchanged.


Let's jump into each, first init_user.

At the top, you'll find the init user context, and at the bottom is an implementation, where there's a function called process instruction, which does the logic previously in the lib file.

There are four accounts in the InitUser context. The state is our user state object, which has the vrf and payer key seeds, this is the version for testing. For production code, you only need the payer seed. We're doing this instead of using environment variables, just to save time. Then there's the vrf account, which switchboard does not load automatically, hence the constraint with the .load() call. There is likely a different way to do this with switchboard, but we're using the simplest/fastest path for now to get up and running, as always, feel free to explore and improve it. And finally, we have the payer and system program for creating a new account.


``` rust
use crate::*;

#[derive(Accounts)]
#[instruction(params: InitUserParams)]
pub struct InitUser<'info> {
  #[account(
        init,
        // TESTING - Comment out these seeds for testing
        // seeds = [
        //     payer.key().as_ref(),
        // ],
        // TESTING - Uncomment these seeds for testing
        seeds = [
            vrf.key().as_ref(),
            payer.key().as_ref()
        ],
        payer = payer,
        space = 8 + std::mem::size_of::<UserState>(),
        bump,
    )]
  pub state: AccountLoader<'info, UserState>,
  #[account(
        constraint = vrf.load()?.authority == state.key() @ LootboxError::InvalidVrfAuthorityError
    )]
  pub vrf: AccountLoader<'info, VrfAccountData>,
  #[account(mut)]
  pub payer: Signer<'info>,
  pub system_program: Program<'info, System>,
}

```

For the logic, we're grabbing an account called state, for we set the bump, switchboard state bump, the vrf permission bump, the vrf account and the user it is associated with. You'll notice there's a struct that simply has the two bumps we previously talked about.

``` rust
#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct InitUserParams {
  pub switchboard_state_bump: u8,
  pub vrf_permission_bump: u8,
}

impl InitUser<'_> {
  pub fn process_instruction(ctx: &Context<Self>, params: &InitUserParams) -> Result<()> {
    let mut state = ctx.accounts.state.load_init()?;
    *state = UserState::default();
    state.bump = ctx.bumps.get("state").unwrap().clone();
    state.switchboard_state_bump = params.switchboard_state_bump;
    state.vrf_permission_bump = params.vrf_permission_bump;
    state.vrf = ctx.accounts.vrf.key();
    state.user = ctx.accounts.payer.key();

    Ok(())
  }
}
```

Let's take a quick look at the [user state](https://github.com/Unboxed-Software/anchor-nft-staking-program/blob/solution-randomize-loot/programs/lootbox-program/src/state.rs) file so we know what it is.

The new thing here is the result buffer. This is where we pull out the randomness, they send it to us as a 32-byte array of random data, which we can turn into whatever randomness we need.

Notice there are two attributes added, the `[account(zero_copy)]` is what needs the loading piece, I simply used it as suggested in the switchboard examples.

``` rust
#[repr(packed)]
#[account(zero_copy)]
#[derive(Default)]
pub struct UserState {
  pub bump: u8,
  pub switchboard_state_bump: u8,
  pub vrf_permission_bump: u8,
  pub result_buffer: [u8; 32],
  pub vrf: Pubkey,
  pub user: Pubkey,
}
```

...and that's it for the init user, on we go.
