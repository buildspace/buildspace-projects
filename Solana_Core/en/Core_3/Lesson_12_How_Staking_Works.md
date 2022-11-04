You've almost done with your third week! Let's put everything you've learned to good use by building out the staking program associated with the NFT project you're working on (buildoors project).

We want you to build out everything for the staking program except the actual token functionality. What that means is anywhere that you would expect to interact with the token program, we’re just going to log a message or skip it and revisit next week.

For now, the main goal is to write a program that tracks the state of each user’s staking. Here are some broad steps:

**There should be 4 instructions:**

- InitializeStakeAccount - this creates a new account where we’re going to store state information about the staking process for each user/nft combination. The seeds for this PDA should be the user’s public key and the nft’s token account.

- Stake - this instruction typically is where the actual staking occurs. However, we’re not going to do any real staking at this point. We’re just going to update the “state” account to reflect that the token is staked, the time at which it’s staked, etc.

- Redeem - this is where you would send user’s their reward tokens based on how long they’ve been staking. But for now just log how many tokens they should get (you can just assume 1 token per unit of time for now) and update the state to reflect when they last redeemed tokens.

- Unstake - this is where you redeem any additional tokens and then unstake the NFT. For now, that just means updating state to reflect that the NFT isn’t staked and logging how many reward tokens they should get

This is challenging. Take a stab at architecting some of this on your own before referencing the solution or watching the video walkthrough. It’s okay if you don’t get it perfect. The struggle is part of the learning.
Hint: You can get time using solana_program::clock::Clock. Take a look at the [docs](https://docs.rs/solana-program/latest/solana_program/clock/struct.Clock.html) if you need.
Once you’ve tried all you can, feel free to look at the [solution code](https://beta.solpg.io/6328f26177ea7f12846aee9b). If you want to keep going, you’re welcome to get started on the UI for staking and interacting with this program.
