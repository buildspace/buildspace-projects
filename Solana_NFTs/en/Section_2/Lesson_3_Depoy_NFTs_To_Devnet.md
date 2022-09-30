This is going to be one of the most epic parts of this project - bringing your candy machine and your NFTs to devnet.

Candy Machine Sugar has made this process a lot simpler. With just one command, you'll do the following:

1. Upload your NFTs to [NFT Storage](https://nft.storage/) (which is a decentralized file-store) or which ever storage option you configured in your `config.json` and initialize your candy machine's config. 
2. Create your candy machine on Metaplex's contract.
3. Configure your candy machine with the price, number, go live date, and a bunch of other things.

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

### ⚙ **Configure your candy machine**
To tell your candy machine how it should behave, you need to configure it. Sugar makes this easy! Run `sugar create-config` in the root folder of your project (the same place as the assets folder) and fill up all the questions they asked. If not, you can just create a `config.json` in the root folder of your project. This is how your config should look

```json
{
  "price": 0.01,
  "number": 3,
  "gatekeeper": null,
  "creators": [
    {
      "address": "YOUR_WALLET_ADDRES",
      "share": 100
    }
  ],
  "solTreasuryAccount": "YOUR_WALLET_ADDRES",
  "splTokenAccount": null,
  "splToken": null,
  "goLiveDate": "2022-05-02T18:00:00+00:00",  // This is to specify when your mint will go live
  "endSettings": null,
  "whitelistMintSettings": null,
  "hiddenSettings": null,
  "freezeTime": null,
  "uploadMethod": "nft_storage", // This is to specify to use nft.storage to store your images
  "retainAuthority": true,
  "isMutable": true,
  "symbol": "NB",
  "sellerFeeBasisPoints": 1,
  "awsConfig": null,
  "nftStorageAuthToken": "YOUR_NFT_STORAGE_API_KEY",
  "shdwStorageAccount": null
}
```

**Note: You can go to [nft.storage](https://nft.storage/manage/) to create your API key.**

<img src="https://i.imgur.com/AuVl16x.png" />

For step 2, you can name it whatever you want. In order for me to easily identify which key belongs to which product, I named it `metaplex`.

This might seem a bit daunting at first, worry not! You only need to know about 5 of these! The rest add extra functionality that you can ignore for now. Let's go over the ones you need to know:

`price`: The price of each NFT. Duh.
`number`: How many NFTs you want to deploy. This needs to match the number of image + json pairs or stuff will break later. 
`solTreasuryAccount`: This is your wallet address, it's where the proceedings from SOL payments will go.
`goLiveDate`: When you want the minting to start. 
`storage`: This is where your NFTs will be stored. 

The only thing you'll need to change here is your wallet address. If you're deploying more than 3 NFTs, update the number! You can deploy up to 10 NFTs on the devnet.  

### **Alternative storage**
If you feel that nft.storage is not good and you are looking for an alternative image storage, you can consider using Bundlr. This is how your `config.js` should look.

```json
{
  "price": 1.0,
  "number": 10,
  "gatekeeper": null,
  "creators": [
    {
      "address": "YOUR_WALLET_ADDRES",
      "share": 100
    }
  ],
  "solTreasuryAccount": "YOUR_WALLET_ADDRES",
  "splTokenAccount": null,
  "splToken": null,
  "goLiveDate": "11 Aug 2022 18:19:16 +0000",
  "endSettings": null,
  "whitelistMintSettings": null,
  "hiddenSettings": null,
  "freezeTime": null,
  "uploadMethod": "bundlr",
  "retainAuthority": true,
  "isMutable": true,
  "symbol": "TEST",
  "sellerFeeBasisPoints": 500,
  "awsS3Bucket": null,
  "nftStorageAuthToken": null,
  "shdwStorageAccount": null
}
```


### 🚀 **Upload the NFTs and create your candy machine**

Now we're going to use Sugar's `upload` command to upload our NFTs that live in the `assets` folder and create the candy machine. Remember, this will happen all at once. 

Notice how we do `./assets` in the command below. That means we need to run this command from just one level outside of the `assets` folder.

```plaintext
sugar upload
```

*Note: if you get an error like "no such file or directory, scandir './assets'" it means you ran the command from the wrong place. Be sure to run it in the same directory where your `assets` folder is.*

The `upload` command is essentially saying - "Hey Sugar CLI, take all the NFT pairs in my `assets` folder, upload them to Bundlr, NFT.storage or whichever storaget I configured in `config.js`, initialize the candy machine config holding the pointers to these NFT".

As this command runs, you should see some output in the terminal about what NFT is currently being uploaded.

```plaintext
sean@DESKTOP-BMVDNJH:/mnt/c/Users/seanl/Desktop/test$ sugar create-config
[1/2] 🍬 Sugar interactive config maker
+--------------------+
| images    |      3 |
| metadata  |      3 |
+--------------------+

[2/4] 🖥  Initializing upload
▪▪▪▪▪ Connected

[3/4] 📤 Uploading image files 

Sending data: (Ctrl+C to abort)
[00:00:05] Upload successful ██████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████ 1/1

[4/4] 📤 Uploading metadata files 

Sending data: (Ctrl+C to abort)
[00:00:03] Upload successful ██████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████ 1/1

3/3 asset pair(s) uploaded.

✅ Command successful.
```

Now that all my NFTs are uploaded to NFT.Storage, Sugar should generate a `cache.json` file. You can take a look. It should look something like this

```json
{
  "program": {
    "candyMachine": "",
    "candyMachineCreator": "",
    "collectionMint": ""
  },
  "items": {
    "0": {
      "name": "Number #0001",
      "image_hash": "6e7fcf86a39f332caa9da55afff12f3bbf7de43458a0586e05c00c1c58a3dcbd",
      "image_link": "https://nftstorage.link/ipfs/bafybeidqys52bzlqnt4mclhmkzojtgs622pbsvwjqsn5vfwg5puqu7aimi/0.png",
      "metadata_hash": "8914d9935ddcf560152e40b0cdb2ecfa1086ab6225997c35d91373a88dc935bf",
      "metadata_link": "https://nftstorage.link/ipfs/bafybeih3n56rqtq5573dcdgiedh7hkukfmeqdd6wdsdpranyw322k7hrb4/0.json",
      "onChain": false
    },
    "1": {
      "name": "Number #0002",
      "image_hash": "003389bcc3b62044113897f81c3b39e2238b6b73218f73cfb51182db5a9a0635",
      "image_link": "https://nftstorage.link/ipfs/bafybeidqys52bzlqnt4mclhmkzojtgs622pbsvwjqsn5vfwg5puqu7aimi/1.png",
      "metadata_hash": "1c1a1bb8cb7b7bff0640fc87c69c6db0b6a404e648c81cdf9b08a8199e9bb1a7",
      "metadata_link": "https://nftstorage.link/ipfs/bafybeih3n56rqtq5573dcdgiedh7hkukfmeqdd6wdsdpranyw322k7hrb4/1.json",
      "onChain": false
    },
    "2": {
      "name": "Number #0003",
      "image_hash": "1e103f64268d4f67ee9591a5d63e565a42e7a72d8eb95523f1a5c079ad9181c1",
      "image_link": "https://nftstorage.link/ipfs/bafybeidqys52bzlqnt4mclhmkzojtgs622pbsvwjqsn5vfwg5puqu7aimi/2.png",
      "metadata_hash": "a5e48e419e40062e6b3e84f944e1d2372ee211894dddcd4c8029711d8bf78c5a",
      "metadata_link": "https://nftstorage.link/ipfs/bafybeih3n56rqtq5573dcdgiedh7hkukfmeqdd6wdsdpranyw322k7hrb4/2.json",
      "onChain": false
    }
  }
}
```

It should contain the link to each of the images that was uploaded to NFT.Storage. Let's proceed to deploy our NFTs on-chain. Run this in your terminal

```plaintext
sugar deploy
```

Your output should look something like this

```bash
sean@DESKTOP-BMVDNJH:/mnt/c/Users/seanl/Desktop/test$ sugar deploy
[1/2] 🍬 Creating candy machine
Candy machine ID: 9izUuhTxKhJ3qJTDtjR2UYNEvzTRiUiVebCqYdPNjxD8

[2/2] 📝 Writing config lines
Sending config line(s) in 1 transaction(s): (Ctrl+C to abort)
[00:00:02] Write config lines successful ██████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████ 1/1

✅ Command successful.
```

### ✅ **Verify NFTs**

Before moving on, verify your NFTs were actually uploaded by running the `verify` command:

```plaintext
sugar verify
```

**Note: You'll notice here we don't tell this command anything about our NFTs. How then does it know what to verify? Well, the `cache.json` file has all the data.**

Your output should look a bit like this if all went well:

```bash
sean@DESKTOP-BMVDNJH:/mnt/c/Users/seanl/Desktop/test$ sugar verify
[1/2] 🍬 Loading candy machine
▪▪▪▪▪ Completed

[2/2] 📝 Verification
Verifying 3 config line(s): (Ctrl+C to abort)
[00:00:01] Config line verification successful ████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████ 3/3

Verification successful. You're good to go!

See your candy machine at:
  -> https://www.solaneyes.com/address/9izUuhTxKhJ3qJTDtjR2UYNEvzTRiUiVebCqYdPNjxD8?cluster=devnet

✅ Command successful.
```

Boom! You are ready to go! You'll notice that there's a link provided in the terminal. Click on it and it should re-direct you to your NFT collection page. It should look something like this

<img src="https://i.imgur.com/XGo48BZ.png" />

If you look at the `cache.json` file, you'll find an attribute `image_link` attached to each of your NFT items. Copy + paste one of those links into your browser and check out your NFT's image. You'll also find another attribute `metadata_link` in each of your NFT items. Copy + paste it into your browser and you should be able to see your NFT's metadata! If you're using `Bundlr`, it will store your image on Arweave which stores data **permanently**. This is very different from the world of IPFS/Filecoin — where data is store peer-to-peer based on nodes that decide to keep the file around.

Arweave is pay once, store **forever**. They do this using an [algorithm](https://arwiki.wiki/#/en/storage-endowment#toc_Transaction_Pricing) they created that basically estimates the cost needed to store something forever based on how big it is. You can play around with the calculator [here](https://arweavefees.com/). For example, to store 1MB forever it costs `~$0.0083649802618`. Not bad!

### 🔨 **Update candy machine config.**
To update your candy machine config, all you need to do is update the `config.json` file and run this command:

```plaintext
sugar update
```

### 😡 **Error to be aware of.**

If at any point you run into an error that looks like this:

```plaintext
/Users/flynn/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts:53
      return fs.readdirSync(`${val}`).map(file => path.join(val, file));
                      ^
TypeError: Cannot read property 'candyMachineAddress' of undefined
    at /Users/flynn/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts:649:53
    at step (/Users/flynn/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts:53:23)
    at Object.next (/Users/flynn/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts:34:53)
    at fulfilled (/Users/flynn/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts:25:58)
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
```

Then it means the command can't access the `cache.json` file with the important data around your candy machine and NFTs. So if you get this error, be 100% sure you're running your Sugar commands from the same directory where your `cache.json` and `assets` folders are. This is really easy to mess up since you might be in the ```app``` directory editing your web app and updating the candy machine in the future; double check your directory!!

### 🚨 Progress Report

*Please do this else Farza will be sad :(*

Post one of your Arweave links for your NFT in `#progress`!
