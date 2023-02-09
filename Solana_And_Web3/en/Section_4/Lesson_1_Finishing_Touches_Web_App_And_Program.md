### ✈️ Making updates to your program

Let's say you want to add some new functionality to your Solana program.

I said earlier not to touch `lib.rs` because working locally and redeploying gets weird.

So, basically w/ Solana I almost *never* work on `localnet` usually. It's just really annoying to switch between `localnet` and `devnet` constantly.

Instead, I update my program and then, to test it, just run my script via `anchor test` on `tests/myepicproject.js` to make sure stuff is working and Anchor will actually run the test on `devnet` directly which is pretty cool.

Then, when I'm ready to test the updates to my program on my web app — I just do an `anchor deploy`. From there you need to make sure you grab the updated IDL file for your web app.

**Whenever you re-deploy, you need to update the IDL file on your web app**

Just like before, you'd need to upload your idl to solana but instead of calling `init` this time you will call `upgrade`
```
anchor idl upgrade -f target/idl/myepicproject.json `solana address -k target/deploy/myepicproject-keypair.json`
```

Now, I want to go over a couple of **optional** features you could add in that I think would be fun. Again, these are optional. I also won't be guiding you on how to build them. Will leave it to you to figure out.

### 🏠 Show off a user's public address on the web app

We're currently not using the user's public address for anything right now in:

```rust
pub struct ItemStruct {
    pub gif_link: String,
    pub user_address: Pubkey,
}
```

It might be cool to show off the user's public address under the GIF they submitted!! Doing something like `item.userAddress.toString()` on your web app should work. I'll let you figure out how to implement it if you want to.

### 🙉 Let users upvote GIFs

It'd be cool if each GIF started at 0 votes, and people could come in an "upvote" their favorite GIFs on your web app.

Not going to tell you how to make it though ;). Figure it out if you want to! Hint: you'll need to make an `update_item` function in your Solana program. In there, you'd need to figure out how to go inside `gif_list`, find the GIF that's being upvoted, and then do something like `votes += 1` on it.

See if you can figure it out!!

### 💰 Send a Solana "tip" to submitters of the best GIFs

One thing we didn't cover at all here is how to send money to other users!

It would be super cool if you loved a certain GIF submitted by another user SO MUCH that you could to send that user a little tip. Maybe like 50 cents or like a dollar worth of SOL. Maybe you'd click "tip", input how much SOL you wanted to tip, and click send to send it right to that user's wallet!

**Solana's super low gas fee means sending small amounts of money like this actually makes sense.** If you do this, you could even make a version of Patreon or BuyMeACoffee on Solana. Not that crazy. You have all the basic skills now.

Who needs Stripe and PayPal when you have a super low-gas fee blockchain that lets you make instant payments?!?

This is another thing I want you to figure out if you want by hanging out in the [Anchor Discord](https://discord.gg/8HwmBtt2ss) or by asking your fellow buildspacers. **Why am I not telling you the answers?** Haha, because I want you to be active in the Solana community, figure shit out, and learn by struggling a bit.

For example, here's me asking the same question lol:

![Untitled](https://i.imgur.com/b94aOcG.png)

Shoutout to cqfd#6977 btw, absolute legend!! He even got on a call w/ me to screenshare a bug I was getting. Be nice in the Anchor Discord and don't just ask random questions. Try hard yourself to search the Discord to see if anyone else has had the same question you have and always say ty when someone helps ;). 

Being nice goes a long way.

### 👍 A bunch of example programs

There are tons of example programs you can find in the Anchor repo [here](https://github.com/project-serum/anchor/tree/master/tests). You can look through different examples to figure out how to implement it yourself.
