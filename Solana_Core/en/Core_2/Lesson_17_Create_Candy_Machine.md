Ready to put something in that `candy-machine` folder we made in the previous lesson but didn't use it? 

Let's start by creating a new assets folder in your `candy-machine` folder. Start by placing all your NFT images and metadatas in it. You can read more about how to prepare your NFT assets [here](https://docs.metaplex.com/developer-tools/sugar/guides/preparing-assets)

## Using Sugar CLI
Now that you've successfully created all your NFT assets, we can start deploying it by using the Sugar CLI. If for some reason you do not have it installed, you can follow the guide [here](https://docs.metaplex.com/developer-tools/sugar/overview/installation) to install the CLI.

Let's start navigating our terminal to the candy-machine folder by running `cd tokens/candy-machine/` and go ahead to launch Sugar CLI by running `sugar launch`. It should asks you a series of questions. Feel free to configure it however you want. Most importantly, make sure you set the price of NFT to `0` and storage method to `bundlr`. You can select `yes` to everything.

## ⬆️ Upload your NFT

Now that you've created your config file. You can start uploading your NFT by running `sugar upload` in the terminal. This will upload all your NFTs with it's metadata to your desired storage method. This is how it should look once you've successfully uploaded your NFTs.

![](https://i.imgur.com/ZIASXlj.png)

You should also see a `cache.json` file generated in your `candy-machine` folder. This will contain all the necessary information of your NFTs and its metadata. Copy the `collectionMint` address and paste it in https://explorer.solana.com/?cluster=devnet and you should be able to see your NFT similar to mine.

![](https://i.imgur.com/vS4mHcK.png)