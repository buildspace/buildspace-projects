### ✨ Create the NFTs of your dreams.

The Metaplex CLI offers a really simple way to tell your candy machine what NFTs you have available, for what price, and much, much more. At the end of the day, an NFT is a JSON payload that has some asset attached to it. Thats exactly what we are going to be making here. 

Metaplex gives an easy to follow format that will allow us to run one command to upload all our NFTs to a spot that will hold everything for us. Let's start by creating a folder to hold all of our NFT data.

Open up the folder that has your `app` in it and create a new directory at the root level called `assets`. Here's what my structure looks like now:

![Untitled](https://i.imgur.com/1WwdmEA.png)

*Note: if you're on **Replit**, you can just create a folder locally named `assets` somewhere and that works as well. Doesn't really matter where you put it.*

In the `assets` we are going to have pairs of files that are associated to each other — the actual NFT asset (in our case, an image) and a `json` file with the metadata for that specific NFT that Metaplex needs to set everything up on our behalf.

You can load as many NFTs as you want in this machine, but we are going to start with just **three** to get you familiar with everything thats needed.

To keep track of which asset goes with each `json` metadata we want to give it a really simple naming convention — numbers! Each PNG is paired with it's own JSON file. Two things to note:
1. You need to start at 0.
2. There can be no gaps in the naming.

In our `assets` folder things are going to look like this:

```plaintext
// NFT #1
0.png
0.json

// NFT #2
1.png
1.json

// NFT #3
2.png
2.json
```

![Untitled](https://i.imgur.com/3warkmp.png)

Pretty straight forward right? `0.json` correlates to `0.png`, `1.json` correlates to `1.png` and so on. Now, you're probably wondering what we're going to be putting inside these `json` files.

Let's copy paste the following into `0.json`:

```json
{
    "name": "NAME_OF_NFT",
    "symbol": "",
    "description": "DESCRIBE_YOUR_NFT_COLLECTION_HERE",
    "seller_fee_basis_points": 500,
    "image": "0.png",
    "attributes": [
        {"trait_type": "Layer-1", "value": "0"},
        {"trait_type": "Layer-2", "value": "0"}, 
        {"trait_type": "Layer-3", "value": "0"},
        {"trait_type": "Layer-4", "value": "1"}
    ],
    "properties": {
        "creators": [{"address": "INSERT_CREATOR_WALLET_ADDRESS_HERE", "share": 100}],
        "files": [{"uri": "0.png", "type": "image/png"}]
    },
    "collection": {"name": "numbers", "family": "numbers"}
}


This is the base information you will need to get up and running with each NFT. Metaplex will take this data and store it **on-chain** for you. How nice. There are certain attributes that change for each `json` file like: `name`, `image`, and `uri`.

**Making a small configuration!**

Alright, now that we have our JSON files lets make one more so we can that will helps us update multiple drops! 
So outside your app and assets file make a new JSON file called `config.json` 

![Untitled](https://i.imgur.com/FDpfc6k.png)

Perfect now inside your `config.json` file go ahead and copy the following:

```json
{
    "price": 1.0,
    "number": 10,
    "gatekeeper": null,
    "solTreasuryAccount": "<YOUR WALLET ADDRESS>",
    "splTokenAccount": null,
    "splToken": null,
    "goLiveDate": "25 Dec 2021 00:00:00 GMT",
    "endSettings": null,
    "whitelistMintSettings": null,
    "hiddenSettings": null,
    "storage": "arweave-sol",
    "ipfsInfuraProjectId": null,
    "ipfsInfuraSecret": null,
    "awsS3Bucket": null,
    "noRetainAuthority": false,
    "noMutable": false
}
```
This JSON file will be how Candy Mchine is operated so the settings you use are super important when setting up your Candy Machine!
Some of the settings are pretty basic such as `price`, `solTreasuryAccount`, and `goLiveDate`. 
If you want more info on all the other settings Check out [here](https://docs.metaplex.com/candy-machine-v2/configuration)

**Now, this is the time for you to get insanely creative. Come up with three random NFTs for your collection.**

To start, I recommend just picking three PNGs you relate with. Maybe it's three of your fav album cover, three of your fav anime characters, three of your fav movie posters. Whatever!!

**Pick three of your favorite whatever.** 

I'm going to pick Naruto, Sasuke, and Sakura — my favorite anime trio :).

Note: Only PNGs are supported right now via the CLI. For other file types like MP4, MP3, HTML, etc you need to create a custom script. See Github issue [here](https://github.com/metaplex-foundation/metaplex/issues/511).

You can even add your own `collection` object if you wanted to give your collection a specific name. Check out an example [here](https://docs.metaplex.com/candy-machine-v2/preparing-assets#-image-0png).

Finally, make sure you replace `"INSERT_YOUR_WALLET_ADDRESS_HERE"` with your Phantom wallet address (don't forget the quotes). This is shown in the single NFT view and resolves to twitter handles if it is connected via Solana Name Service. You can have multiple creators in the `creators` array. The `share` attribute is the percentage of royalties that each creator will receive. Since you're the only creator here, you get everything!

### 🚨 Progress Report

*Please do this else Farza will be sad :(*

What are you making an NFT of? Show it off in `#progress`.
