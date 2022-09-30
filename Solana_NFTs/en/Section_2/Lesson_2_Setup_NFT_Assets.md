### ✨ Create the NFTs of your dreams

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
  "symbol": "SYMBOL_OF_NFT",
  "description": "Collection of 10 numbers on the blockchain. This is the number 1/10.",
  "image": "0.png",
  "attributes": [
    {
      "trait_type": "Number",
      "value": "0"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "0.png",
        "type": "image/png"
      }
    ],
  }
}
```

This is the base information you will need to get up and running with each NFT. Metaplex will take this data and store it **on-chain** for you. How nice. There are certain attributes that change for each `json` file like: `name`, `image`, and `uri`.

**Now, this is the time for you to get insanely creative. Come up with three random NFTs for your collection.**

To start, I recommend just picking three PNGs you relate with. Maybe it's three of your fav album cover, three of your fav anime characters, three of your fav movie posters. Whatever!!

**Pick three of your favorite whatever.** 

I'm going to pick Naruto, Sasuke, and Sakura — my favorite anime trio :).

Note: Only PNGs are supported right now via the CLI. For other file types like MP4, MP3, HTML, etc you need to create a custom script. See Github conversation [here](https://github.com/metaplex-foundation/metaplex/pull/1601).

You can even add your own `collection` object if you wanted to give your collection a specific name. Check out an example [here](https://docs.metaplex.com/developer-tools/sugar/guides/preparing-assets).

### 🚨 Progress Report

*Please do this else Farza will be sad :(*

What are you making an NFT of? Show it off in `#progress`.
