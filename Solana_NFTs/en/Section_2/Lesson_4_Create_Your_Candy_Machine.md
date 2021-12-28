At this point we have our NFTs all uploaded to Arweave and we have a basic config for our candy machine up on devnet. But, we haven't actually "created" our candy machine. All we've done so far is set up assets.

### 👩‍💻 **Deploy candy machine to devnet**

To deploy your candy machine to Metaplex's contract, it's as easy as running this command in your terminal:

```plaintext
ts-node ~/metaplex-foundation/metaplex/js/packages/cli/src/candy-machine-cli.ts create_candy_machine --env devnet --keypair ~/.config/solana/devnet.json -p 1
```

This looks very similar to the upload command, but there are a few main differences:

- We use the `create_candy_machine` command in our CLI.
- We added a `-p` which sets the price of each NFT in our candy machine. Here we set each NFT to cost 1 SOL.

I want to make it very clear — you are **not** deploying a new candy machine from scratch here, you're adding a new candy machine to Metaplex's existing protocol. This was hard for me to wrap my head around in the past. Metaplex is kinda like a "Shopify for Solana NFTs" lol.

All our NFTs live on Metaplex's open protocol and only we can alter them. No one else can mess with them other than the creators. You can read more on it [here](https://docs.metaplex.com/architecture/deep_dive/token_vault).

Okay, so if all went well, you should see an output that looks a bit like this:

```plaintext
wallet public key: 5oXkroDifHqo91UPsPCQa3Bge4DvGZpJZ88S7WpDzDQE
create_candy_machine finished. candy machine pubkey: AsgXHgnJM6G6U5BXA9GxBdf3JJVuxRhbgRdYAcnKTW5u
```

You'll notice that your terminal will print out something that says `candy machine pubkey`. This is the address of our **deployed candy machine!**

Copy/paste this somewhere for later — we'll need it on our web app so our client knows what candy machine to talk to.

Be sure to check it out on Solana's Devnet Explorer [here](https://explorer.solana.com/?cluster=devnet) by copy/pasting the public address.

### 👀 **Set drop date**

**CONGRATS**. This is a HUGE step. You have a fully deployed minting machine ready to go on Solana's devnet!

But we are missing just one more thing - a drop date! Since our candy machine is now up in the wild for people to use we want to make sure that they can only mint from it on a certain date! It's all about that hype right :)?

The Metaplex CLI gives a really easy command for you to update your machine's data. Use this to set a drop date for your NFTs:

```plaintext
ts-node ~/metaplex-foundation/metaplex/js/packages/cli/src/candy-machine-cli.ts update_candy_machine --date "1 Dec 2021 00:12:00 GMT" --env devnet --keypair ~/.config/solana/devnet.json
```

For now, set your drop date to December 1st, 2021. **This is a past date.** We're doing this for debugging purposes for later down the line. But, just know you could change this date later whenever you want. 

Again, pretty simple command! Biggest changes here are:

- You are using the `update_candy_machine` command here to update your program on Solana devnet
- `--date` flag with the date and time you want your NFTs to "drop"

When I run this, I get:

```plaintext
wallet public key: 5oXkroDifHqo91UPsPCQa3Bge4DvGZpJZ88S7WpDzDQE
 - updated startDate timestamp: 1638317520 (1 Dec 2021 00:12:00 GMT)
update_candy_machine finished 4NGREDwboswWeScDJw9cAFCgqwYCJeUY8SKPbnuwpRNoj9gXvfXvdS6Un7AC6pxaQHZPuqCL6NUK8QSgdkNNg4rt
```

Once you have all of this in order, we are ready to call our minting machine from a web app. In the next few sections we'll go over how our web app can now talk to our deployed candy machine.

### 🚨 Progress Report

*Please do this else Farza will be sad :(*

In `#progress` drop a link to your deployed candy machine program on [Solana Explorer](https://explorer.solana.com/?cluster=devnet). Just search for your candy machine's pub key that was output above.
