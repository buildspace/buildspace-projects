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
    "price": 0.1,
    "number": 3,
    "gatekeeper": null,
    "solTreasuryAccount": "<YOUR WALLET ADDRESS>",
    "splTokenAccount": null,
    "splToken": null,
    "goLiveDate": "05 Jan 2022 00:00:00 GMT",
    "endSettings": null,
    "whitelistMintSettings": null,
    "hiddenSettings": null,
    "storage": "pinata",
    "pinataJwt": "YOUR PINATA JWT TOKEN",
    "pinataGateway": "null",
    "ipfsInfuraProjectId": null,
    "ipfsInfuraSecret": null,
    "awsS3Bucket": null,
    "noRetainAuthority": false,
    "noMutable": false
}
```

I added `pinataJwt` and `pinataGateway`. I also set `storage` to `pinata`. Paste your JWT token in the `pinataJwt` property and you're good to go! Delete your `.cache` folder and run the upload command again:

```
ts-node ~/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts upload -e devnet -k ~/.config/solana/devnet.json -cp config.json ./assets
```

And you're done! You now have really high quality NFTs on the devnet. If you wanna learn more about IPFS, [check this out](https://decrypt.co/resources/how-to-use-ipfs-the-backbone-of-web3).

### 🚀 Deploy to the world

Deploying a React app has gotten so easy that there is no reason not to do it at this point lol. Plus, it's **free**. You've made it this far, deploying is the final step. Plus -- your fellow builders at buildspace must not be deprived of your NFTs!! Please give us the opportunity to mint your rare creations hehe.

I made a really quick video below on deploying via Vercel. If you don't want to use Vercel, all good. Use whatever you want.

Basically:
- Push your latest code up to Github. Don't commit `.cache`.
- Connect Vercel to your repo.
- Make sure to set your root to `app`.
- Add in your `.env` variables (since we won't be committing our `.env` file).
- Deploy.
- Done.

[Loom](https://www.loom.com/share/ce89a285b90a4b34ac358fce9ae7f92d)

Note: On Vercel, you will need to add 6th environment variable `CI=false`. This will make sure our build doesn't fail because of warnings.
![Untitled](https://i.imgur.com/wn2Uhj4.png).


### 😍 Hello, Solana Master

Super exciting that you made it to the end. Pretty big deal!! Solana is **super early** and very powerful and you've now gotten your hands dirty w/ the core tech. Hell yes. You have all the skills you need now to build your own NFT drops on Solana.

Thank you for contributing to the future of web3 by learning this stuff. The fact that you know how this works and how to code it up is a superpower. Use your power wisely ;).

### 🥞 Careers in Web3

Tons of people have also gotten full-time jobs at top web3 companies via buildspace. I'm constantly seeing people nail their interviews after they do a few buildspace projects.
![Untitled](https://i.imgur.com/CNzLdQc.png)

**People seem to think web3 just needs people who can code smart contracts or write code that interfaces w/ the blockchain. Not true.**

There is so much work to do and most of the work doesn't even have to do w/ smart contracts lol. **Being an engineer in web3 just means you take your web2 skills and apply them to web3.**

I want to quickly go over wtf it means to "work in web3" as an engineer. *Do you need to be a pro at Solana? Do you need to know how every little thing about the blockchain works?*

For example, let's say you're a great frontend engineer. If you finished this project, **you have almost everything you need to be a great frontend engineer at a web3 company**. For example, the company may say "Hey — pls go and build our connect to wallet feature" — and you'd already have a solid idea on how to do that :).

I just wanna inspire you to work in web3 lol. This shit is awesome. And it'd be cool if you gave it a shot ;).

Be sure you click "Work in Web3" on the left and fill out your profile if you haven't done so already!!! **We're partnered w/ some of the best web3 companies in the world (ex. Uniswap, OpenSea, Chainlink, Edge and Node, and more) and they want to hire devs from the buildspace network :).** You've already picked up a skill that is actually extremely valuable and companies are paying top dollar for awesome web3 engineers.

### 🤟 Your NFT!

We'll airdrop you your NFT within an hour and will email you once it's in your wallet. It's running on a cron job! If you don't get the email within 24-hours pls pls pls drop us a message in #feedback and tag @ **alec#8853**.

**Be sure to click the button at the bottom of this page and submit your final link. Otherwise, our system won't mark you as "complete".**

### 🌈 Before you head out

Go to **#showcase** in Discord and drop us a link to your final product that we can mess around with :).

Also, you should totally tweet out your final project and show the world your epic creation! What you did wasn't easy by any means. Maybe even make a little video showing off your project and attach that to the tweet. Make your tweet look pretty and show off!!

And if you feel up to it, tag @_buildspace :). **It gives us a ton of motivation whenever we see people ship their projects.** Plus, you can inspire someone else to get into Solana.

Give us that dopamine hit pls.

Lastly, what would also be awesome is if you told us in #feedback how you liked this project and the structure of the project. What did you love most about buildspace? What sucked? What would like us to change for future projects? Your feedback would be awesome!

See yah around!!!
