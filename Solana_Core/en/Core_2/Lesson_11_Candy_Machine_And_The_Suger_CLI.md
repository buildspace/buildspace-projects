Now that we've minted a single NFT, we'll learn how to mint a collection of NFTs. We'll do this using **Candy Machine** - a Solana program that lets creators bring their assets on chain. It's not the only way to create a collection, but it's the standard on Solana as it has a bunch of helpful features like bot protection and secure randomisation. 

Since it's an on-chain program, everything is stored in accounts. You start by creating an instance of the Candy Machine for your collection. That's just an account which will store some important owner stuff and the configuration of your Candy Machine in a metadata field.

![](https://hackmd.io/_uploads/rywzo5i7j.png)

Notice that data field? That's where the metadata sits, it looks like this:

![](https://hackmd.io/_uploads/Skpzs5smo.png)

Again - there's a lot happening here, we'll get to each part as it's relevant.

To interact with the Candy Machine program, we'll use the [Sugar CLI](https://docs.metaplex.com/developer-tools/sugar/overview/introduction). It's a sweet (lol get it?) tool that lets you interact with the program directly from the command line.

#### 🛠 Install the CLIs
Before we can get into this, we'll need to install:
1. The Solana CLI - the Sugar CLI needs this. You can install it [here](https://docs.solana.com/cli/install-solana-cli-tools) for your OS.
2. The Sugar CLI - you can install it [here](https://docs.metaplex.com/developer-tools/sugar/overview/installation).

**Note** - If you want to keep CLI installs separate from your machine, you can set up the Solana CLI on Docker and then download the Sugar CLI. Docker image [here](https://hub.docker.com/r/solanalabs/solana). If you don't know what Docker is, don't worry about this!

If they were installed right, you should see version numbers instead of errors when you run `solana --version` and `sugar --version` in your terminal.

This is also a good time to set up your local Solana wallet on the devnet if you don't have one. Run these commands in your terminal:
```bash
solana config set --url devnet
solana-keygen new --outfile ~/.config/solana/devnet.json
solana airdrop 2
solana balance
```

This is doing exactly what our script in the local clients did, but in the terminal. 

#### 🍬 Set up your collection
This is going to be one of the hardest parts of the build: deciding what you want to make an NFT collection of. You'll need at least 5 images, one for each NFT in your collection. I'm going with some classic pepes because pepes just speak to me.

Make a new project folder in your Solana workspace and create an `assets` folder inside it. You need to pair each NFT asset with a metadata JSON file, numbering each pair from zero. So, your folder structure should look something like this:
```
...
|
|── assets
|   |── 0.png
|   |── 0.json
|   |...
|   |── 5.png
|   |── 5.json
|
|── node_modules
|── src
|── package.json
....
```

Here's what a JSON-file looks like:
![](https://hackmd.io/_uploads/SJWRa5iQs.png)

In practice, you'll write a script to generate these files, but for now, we'll just do it manually. You can start with [these](https://arweave.net/RhNCVZoqC6iO0xEL0DnsqZGPSG_CK_KeiU4vluOeIoI) example assets and replace the images with your own. Make sure you update the JSON files too!

You can optionally also add a `collection.json` with a matching `collection.png` - these will be used by marketplaces as the collection name, description, and thumbnail.

Here's a template:
```json
{
  "name": "Studious Crabs Collection",
  "symbol": "CRAB",
  "description": "Collection of 10 crabs seeking refuge from overfishing on the blockchain.",
  "image": "collection.png",
  "attributes": [],
  "properties": {
    "files": [
      {
        "uri": "collection.png",
        "type": "image/png"
      }
    ]
  }
}
```
Save the crabs 🦀 from the fishermen 🎣

All you should have right now is a single assets folder with the goods in it (and a ~ folder if you're on Windows).

#### 🍭 Configure your Candy Machine
The next thing we need to do is create a Candy Machine configuration file. This is what's used to create the on-chain Candy Machine instance. The Sugar CLI will walk you through the minimum requirements so you won't have to do this manually! Here's what it'll look like:

![](https://hackmd.io/_uploads/HJ_dJjsmi.png)

You know how they say that too much sugar is bad for you? The devs making the Sugar CLI sure thought so. All you need to set up a Candy Machine is the `launch` command. It does everything else for you.

![](https://hackmd.io/_uploads/B1a9kiomj.png)

#### 🚀 Launch your NFT collection
Smash in `sugar launch` in your terminal and hit y when it asks if you want to create a new configuration file. Answer the questions and you'll be left with a `config.json` file in your project folder.

Here are my answers:
```
✔ What is the price of each NFT? · 0.3
✔ Found 10 file pairs in "assets". Is this how many NFTs you will have in your candy machine? · ye
✔ Found symbol "CRAB" in your metadata file. Is this value correct? · no
✔ What is the symbol of your collection? Hit [ENTER] for no symbol. · PEPE
✔ What is the seller fee basis points? · 100
? What is your go live date? Many common formats are supported. · now
✔ How many creator wallets do you have? (max limit of 4) · 1
✔ Enter creator wallet address #1 · B1aLAAe4vW8nSQCetXnYqJfRxzTjnbooczwkUJAr7yMS
✔ Enter royalty percentage share for creator #1 (e.g., 70). Total shares must add to 100. · 100
? Which extra features do you want to use?  ·
✔ What is your SOL treasury address? · B1aLAAe4vW8nSQCetXnYqJfRxzTjnbooczwkUJAr7yMS
✔ What upload method do you want to use? · Bundlr
✔ Do you want to retain update authority on your NFTs? We HIGHLY recommend you choose yes. · yes
✔ Do you want your NFTs to remain mutable? We HIGHLY recommend you choose yes. · yes
```

You should get the `MISSING COLLECTION FILES IN ASSETS FOLDER` warning, dont worry about it, it because we didn't set up the `collection.png` and `collection.json` files at our `assets` folder. Go ahead and answer `y`. If you want to know a bit more about those files you can read more about it [here](https://docs.metaplex.com/developer-tools/sugar/guides/preparing-assets).

We don't need any special features for now. If you're curious, you can read more about them [here](https://docs.metaplex.com/developer-tools/sugar/learning/settings).

If something breaks or if you want to change your mind mid-way, you can just `CMD/CTRL+C` out of the process and start again. You can also edit the `config.json` file directly. The Sugar CLI prints out really helpful errors so if you get stuck, just read them and you'll probably figure it out.

If everything goes well, you'll have a `Command successful.` message in green at the end. Right above it, you'll have a SolanEyes link. Hit that link and you'll see your Candy Machine on the Solana Network! Copy the Candy Machine ID from here, we'll need it later.

If that wasn't magical enough, try minting an NFT with `sugar mint`. Simply delicious.

Sugar can also help with various actions once you've minted out your collection and are chilling in Bali, check out [the commands](https://docs.metaplex.com/developer-tools/sugar/reference/commands) if you're curious. 

#### 🌐 Create a front-end for your NFT collection
Hope you've had your dinner cause it's time for some more CANDY.

The Metaplex foundation has a slick React UI template you can use to create a front-end for your NFT collection. Let's set it up:

```bash
git clone https://github.com/metaplex-foundation/candy-machine-ui
cd candy-machine-ui
npm i
```

There's a lot happening here that we don't need to worry about. Rename `.env.example` to `.env` and paste in your Candy Machine ID that you copied earlier. 

```bash
REACT_APP_CANDY_MACHINE_ID=GNfbQEfMA1u1irEFnThTcrzDyefJsoa7sndACShaS5vC
```

This is all you need to do! Now if you run `npm start` you'll see a shiny UI on `localhost:3000` that you can use to mint your NFTs.

For Mac users: Run `export NODE_OPTIONS=--openssl-legacy-provider` in your terminal if you encounter [`error:0308010C:digital envelope routines::unsupported`](https://stackoverflow.com/questions/69692842/error-message-error0308010cdigital-envelope-routinesunsupported)

Once you've minted, check out the NFT in your wallet in the collectibles section.

![](https://hackmd.io/_uploads/HJzNRAo7i.png)

You'll notice that the minted NFT is not 1.png. This is because Candy Machine mints are randomised by default. 

We've only barely scraped the surface of what's possible with Candy Machine and the Sugar CLI. There's a lot more we'll cover later - the point of this section was to give you the breadth of knowledge you need to go really deep on your own. We're going to continue to go deeper as we build out our NFT project. 

#### 🚢 Ship challenge
Let's get your hands in the candy machine a bit more! 🍭

Get creative and test out other Candy Machine configurations by updating the `config.json` file and then running `sugar update`.


Examples:
* Modify `goLiveDate`
* Enable `gatekeeper` (captcha)
* Enable `whitelistMintSettings` 
  * requires creating token
* Request payment using `splToken` instead of native sol
  * requires creating token


**Hints**
The docs :)

https://docs.metaplex.com/developer-tools/sugar/learning/settings
