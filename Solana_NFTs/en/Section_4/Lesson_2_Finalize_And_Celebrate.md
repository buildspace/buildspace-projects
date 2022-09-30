### 🌍 Upgrade your NFTs with IPFS
When deploying on the devnet, you don't have to worry about storing your NFTs cause Metaplex let's you upload up to 10 assets for free. This is super helpful, but you can't rely on them for going to the mainnet lol. 

What happens for the mainnet? You could go the standard route and upload them to Arweave, but that'll cost you quite a bit. Instead, we can use something called [IPFS](https://en.wikipedia.org/wiki/InterPlanetary_File_System). In a nutshell, it's a decentralized file storage system, similar to Arweave, but **a lot** cheaper (sometimes even free). I've found it easiest to use [**Pinata**](https://www.pinata.cloud/?utm_source=buildspace) to upload to IPFS. Plus they give you 1 GB of storage for free, which is enough for 1000s of assets. I didn't actually deploy to the mainnet but I used Pinata anyway cuz it let's you upload way bigger files.

Using it is pretty simple, once you've signed up for an account, select "API Keys" from the dropdown menu in the top right. 

![API KEY](https://i.imgur.com/3Cp92wu.png)

Create a new key and make sure `pinFileToIPFS` access is enabled. 

![Pinata config](https://i.imgur.com/QBCmGSv.png)

Once you create the key, you'll see a popup with all the secrets. Copy the JWT token and keep it handy. Now we just update our `config.json` file with 2 new properties:

```json
{
  "price": 0.01,
  "number": 3,
  "gatekeeper": null,
  "creators": [
    {
      "address": "YOUR WALLET ADDRESS",
      "share": 100      // Make sure the total share amongst all creators sums up to exactly 100
    }
  ],
  "solTreasuryAccount": "YOUR WALLET ADDRESS",
  "splTokenAccount": null,
  "splToken": null,
  "goLiveDate": "2022-05-02T18:00:00+00:00",
  "endSettings": null,
  "whitelistMintSettings": null,
  "hiddenSettings": null,
  "freezeTime": null,
  "uploadMethod": "nft_storage",
  "retainAuthority": true,
  "isMutable": true,
  "symbol": "NB",
  "sellerFeeBasisPoints": 1,
  "awsConfig": null,
  "nftStorageAuthToken": "YOUR_NFT_STORAGE_API_KEY",
  "shdwStorageAccount": null
}
```

I added `nft_storage`. I also set `uploadMethod` to `nft_storage`. Paste your [nft.storage](https://nft.storage/) API key in the `nftStorageAuthToken` property and you're good to go! Delete your `cache.json` folder and run the upload command again:

```
sugar upload
```

And you're done! You now have really high quality NFTs on the devnet. If you wanna learn more about IPFS, [check this out](https://decrypt.co/resources/how-to-use-ipfs-the-backbone-of-web3).

### 🚀 Deploy to the world

Deploying a React app has gotten so easy that there is no reason not to do it at this point lol. Plus, it's **free**. You've made it this far, deploying is the final step. Plus -- your fellow builders at buildspace must not be deprived of your NFTs!! Please give us the opportunity to mint your rare creations hehe.

I made a really quick video below on deploying via Vercel. If you don't want to use Vercel, all good. Use whatever you want.

Basically:
- Push your latest code up to Github. Don't commit `cache.json`.
- Connect Vercel to your repo.
- Make sure to set your root to `app`.
- Add in your `.env.local` variables (since we won't be committing our `.env.local` file).
- Deploy.
- Done.

To be extra safe, make sure to create a `.gitignore` file in your `root` folder so that it will automatically ignore all the files and not push to GitHub. This is how my `gitignore` looks like:

```javascript
.DS_Store
.env
.env.local
node_modules
cache.json
config.json
```

[Loom](https://www.loom.com/share/ce89a285b90a4b34ac358fce9ae7f92d)

Note: On Vercel, you will need to add 6th environment variable `CI=false`. This will make sure our build doesn't fail because of warnings.
![Untitled](https://i.imgur.com/wn2Uhj4.png).


### 😍 Hello, Solana Master

Super exciting that you made it to the end. Pretty big deal!! Solana is **super early** and very powerful and you've now gotten your hands dirty w/ the core tech. Hell yes. You have all the skills you need now to build your own NFT drops on Solana.

Thank you for contributing to the future of web3 by learning this stuff. The fact that you know how this works and how to code it up is a superpower. Use your power wisely ;).


### 🌈 Before you head out

Go to **#showcase** in Discord and drop us a link to your final product that we can mess around with :).

Also, you should totally tweet out your final project and show the world your epic creation! What you did wasn't easy by any means. Maybe even make a little video showing off your project and attach that to the tweet. Make your tweet look pretty and show off!!

And if you feel up to it, tag @_buildspace :). **It gives us a ton of motivation whenever we see people ship their projects.** Plus, you can inspire someone else to get into Solana.

Give us that dopamine hit pls.

Lastly, what would also be awesome is if you told us in #feedback how you liked this project and the structure of the project. What did you love most about buildspace? What sucked? What would like us to change for future projects? Your feedback would be awesome!

See yah around!!!
