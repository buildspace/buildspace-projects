This is going to be one of the most epic parts of this project - bringing your candy machine and your NFTs to devnet.

This stage is a **three stage** process and something you will want to remember the flow for as you go through and test your full flow in the web app:

1. Upload your NFTs to [Arweave](https://www.arweave.org) (which is a decentralized file-store) and initialize your candy machine's config. 
2. Create your candy machine on Metaplex's contract.
3. Update your candy machine with the proper drop date for your NFTs — this is the date when people can actually start minting your NFTs.

### 🔑 **Setting up a Solana keypair.**

In order to get uploading, we need to set up a local Solana keypair. *Note: If you've done this in the past, still follow the instructions below.*

In order for us to upload the NFTs to Solana, we need to have a "local wallet" to work with in the command line. Remember, you can't talk to Solana unless you have wallet and wallet is basically a "keypair" which is public key and a private key. 

This can be done by running the command below. *Note: When it asks, no need to give it a passphrase, can just press enter and keep it empty.*

```plaintext
solana-keygen new --outfile ~/.config/solana/devnet.json
```

From here, we can set this keypair as our default keypair.

```plaintext
solana config set --keypair ~/.config/solana/devnet.json
```

Now, when we do `solana config get`, you should see `devnet.json` as the `Keypair Path` like below:

```plaintext
Config File: /Users/flynn/.config/solana/cli/config.yml
RPC URL: https://api.devnet.solana.com
WebSocket URL: wss://api.devnet.solana.com/ (computed)
Keypair Path: /Users/flynn/.config/solana/devnet.json
Commitment: confirmed
```

From here you can run

```plaintext
solana balance
```

And it should say `0 SOL`. We can't deploy stuff to Solana without SOL, writing data to the blockchain costs money. In this case, we're on dev net so we can just give ourselves fake SOL. Go ahead and run:

```plaintext
solana airdrop 2
```

After that's done, you can run `solana balance` again and bam you'll have some SOL. *Note: if you ever run out of fake SOL, you can just run this command again.*

### 🚀 **Upload the NFTs**

Before you upload, we still need to properly fill in `"INSERT_CREATOR_WALLET_ADDRESS_HERE"` on all three of our `json` files! This is **not** our Phantom wallet address. This address is our **local developer wallet address** which can be found by running:

```plaintext
solana address
```

Copy that address and paste it into all three of the `json` files filling in `"INSERT_CREATOR_WALLET_ADDRESS_HERE"`. Don't forget the quotation symbols.

Now we're going to use Metaplex's `upload` command to upload our NFTs that live in the `assets` folder.

Notice how we do `./assets` in the command below. That means we need to run this command from just one level outside of the `assets` folder.

```plaintext
ts-node ~/metaplex-foundation/metaplex/js/packages/cli/src/candy-machine-cli.ts upload ./assets --env devnet --keypair ~/.config/solana/devnet.json
```

*Note: if you get an error like "no such file or directory, scandir './assets'" it means you ran the command from the wrong place. Be sure to run it in the same directory where your `assets` folder is.*

The `upload` command is essentially saying - "Hey Metaplex CLI, take all the NFT pairs in my `assets` folder, upload them to Arweave, initialize the candy machine config holding the pointers to these NFTs, and then save that config on Solana's devnet".

As this command runs, you should see some output in the terminal about what NFT is currently being uploaded.

```plaintext
Beginning the upload for 3 (png+json) pairs
started at: 1638479624907
wallet public key: 5oXkroDifHqo91UPsPCQa3Bge4DvGZpJZ88S7WpDzDQE
Processing file: 0
initializing config
initialized config for a candy machine with publickey: fhUFs2RXDaMrFZSxeGEE88Aj7bcsZi2v4mLkPUaGF9E
lamport cost to store assets/0.png: 55492.25265338845
lamport cost to store assets/1.png: 55492.25265338845
lamport cost to store assets/2.png: 55492.25265338845
Writing indices 0-2
Done. Successful = true.
ended at: 2021-12-02T21:14:28.538Z. time taken: 00:00:43
```

See where it says "initialized config for a candy machine" and then spits out a key? You can actually copy/paste that key on Solana's Devnet Explorer [here](https://explorer.solana.com/?cluster=devnet) to see that it actually deployed to the blockchain. Give it a go!

Just a note: we have **not** created our actual candy machine, we just upload some files and created a config that our candy machine *could* use.

You'll notice here if you change your NFTs and run `upload` again, it won't actually upload anything new! The reason for that is there is `.cache` folder created that stores this data.

You will actually need to delete the `.cache` folder and run `upload` again. This will force the initialization of a new candy machine config. Be sure to do this if you want to make changes to your collection before you go live with it!

### ✅ **Verify NFTs**

Before moving on, verify your NFTs were actually uploaded by running the `verify` command:

```plaintext
ts-node ~/metaplex-foundation/metaplex/js/packages/cli/src/candy-machine-cli.ts verify --keypair ~/.config/solana/devnet.json
```

*Note: You'll notice here we don't tell this command anything about our NFTs. How then does it know what to verify? Well, the `.cache` folder has all the data. If you look inside `devnet-temp.json` you'll see all our data right there.*

Your output should look a bit like this if all went well:

```plaintext
wallet public key: 5oXkroDifHqo91UPsPCQa3Bge4DvGZpJZ88S7WpDzDQE
Name Naruto with https://arweave.net/lK4q7YUfzoAgu2EP5isxycfFCi5FzkFpV_CPjqtFeOs checked out
Name Sasuke with https://arweave.net/CDifkVEG9rRJEAUb2xRCGWSoPgvzwgNZW_s0bw6-E_c checked out
Name Sakura with https://arweave.net/cIWENtNbSRdj7nrcTwprRub26lxE0b_Amlq_xXsrm7c checked out
uploaded (3) out of (3)
ready to deploy!
```

Boom! You can see there the name's of my NFTs + their Arweave links.

Copy + paste one of those Arweave links into your browser and check out your NFT's metadata! Arweave is extremely cool. It stores data **permanently**. This is very different from the world of IPFS/Filecoin — where data is store peer-to-peer based on nodes that decide to keep the file around.

Arweave is pay once, store **forever**. They do this using an [algorithm](https://arwiki.wiki/#/en/storage-endowment#toc_Transaction_Pricing) they created that basically estimates the cost needed to store something forever based on how big it is. You can play around with the calculator [here](https://arweavefees.com/). For example, to store 1MB forever it costs `~$0.0083649802618`. Not bad!

You may be asking yourself — "well, who's paying to host my stuff then!?". Well if you look through the source code of the script [here](https://github.com/metaplex-foundation/metaplex/blob/59ab126e41e6d85b53c79ad7358964dadd12b5f4/js/packages/cli/src/helpers/upload/arweave.ts#L93), you'll see that Metaplex pays for it themselves for now to help you out!

### 😡 **Error to be aware of.**

If at any point you run into an error that looks like this:

```plaintext
/Users/flynn/metaplex-foundation/metaplex/js/packages/cli/src/candy-machine-cli.ts:53
      return fs.readdirSync(`${val}`).map(file => path.join(val, file));
                      ^
TypeError: Cannot read property 'candyMachineAddress' of undefined
    at /Users/flynn/metaplex-foundation/metaplex/js/packages/cli/src/candy-machine-cli.ts:649:53
    at step (/Users/flynn/metaplex-foundation/metaplex/js/packages/cli/src/candy-machine-cli.ts:53:23)
    at Object.next (/Users/flynn/metaplex-foundation/metaplex/js/packages/cli/src/candy-machine-cli.ts:34:53)
    at fulfilled (/Users/flynn/metaplex-foundation/metaplex/js/packages/cli/src/candy-machine-cli.ts:25:58)
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
```

Then it means the command can't access the `.cache` folder with the important data around your candy machine and NFTs. So if you get this error, be 100% sure you're running your candy machine commands from the same directory where you `.cache` and `assets` folders are. This is really easy to mess up since you might be in the ```app``` directory editing your web app and updating the candy machine in the future; double check your directory!!

### 🚨 Progress Report

*Please do this else Farza will be sad :(*

Post one of your Arweave links for your NFT in `#progress`!
