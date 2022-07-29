### 🙉 A note on github

**If uploading to Github, don't upload your hardhat config file with your private key to your repo. You will get robbed.**

I use dotenv for this.

```javascript
npm install --save dotenv
```

```javascript
require('@nomiclabs/hardhat-waffle');
require('dotenv').config();

module.exports = {
  solidity: '0.8.0',
  networks: {
    rinkeby: {
      url: process.env.STAGING_QUICKNODE_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
    mainnet: {
      chainId: 1,
      url: process.env.PROD_QUICKNODE_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
```

And your .env file would look something like:

```javascript
STAGING_QUICKNODE_KEY=BLAHBLAH
PROD_QUICKNODE_KEY=BLAHBLAH
PRIVATE_KEY=BLAHBLAH
```

(don't commit your .env after this lol).

### 🌎 Get your image assets up in IPFS

Right now — our boss and character images are on Imgur.

**This isn't good**. If Imgur goes down or shutdown, our awesome characters are all gone and our NFTs are useless!!

Luckily we have something called [IPFS](https://en.wikipedia.org/wiki/InterPlanetary_File_System) which is essentially a distributed file system Today — you might use something like S3 or GCP Storage. But, in this case we can simply trust IPFS which is run by strangers who are using the network. Give [this](https://decrypt.co/resources/how-to-use-ipfs-the-backbone-of-web3) a quick read when you can! Covers a lot of good base knowledge :).

I won't be covering how to get your stuff up on IPFS + connected to your React app step-by-step, but, I will give you some pointers!

First, you'll need to upload your images to a service that specializes in "[pinning](https://docs.ipfs.io/how-to/pin-files/)" — which means your file will essentially be cached so its easily retrievable. I like using [Pinata](https://www.pinata.cloud/?utm_source=buildspace) as my pinning service — just make an account, upload your character's image files through their UI, and that's it! 

![Untitled](https://i.imgur.com/FAkx9yj.png)

Go ahead and copy the files "CID". This is the files content address on IPFS! What's cool now is we can create this link:

```javascript
https://cloudflare-ipfs.com/ipfs/INSERT_YOUR_CID_HERE
```

If you are using **Brave Browser** (which has IPFS built in) you can just type this paste into the URL:

```javascript
ipfs://INSERT_YOUR_CID_HERE
```

And that'll actually start an IPFS node on your local machine and retrieve the file! But again, I've only done this on **Brave.** If you try to do it on something like Chrome it just does a Google search lol.

![Untitled](https://i.imgur.com/vQ9Wsr0.png)

From here, you can change your imgur links in `run.js` to `ipfs` hashes! For the sake of example, I used the same CID for all my characters but in your case you would have three different ones, one for each character!

```javascript
const gameContract = await gameContractFactory.deploy(                        
    ["Leo", "Aang", "Pikachu"],       
    ["bafybeibsifcmwkufr7zwh5s3ekvjkfj5nnadjhweniz4p7lxqelt7mbp74", 
    "bafybeibsifcmwkufr7zwh5s3ekvjkfj5nnadjhweniz4p7lxqelt7mbp74", 
    "bafybeibsifcmwkufr7zwh5s3ekvjkfj5nnadjhweniz4p7lxqelt7mbp74"],
    [100, 200, 300],                    
    [100, 50, 25],
    "Elon Musk",
    "https://i.imgur.com/AksR0tt.png",
    10000,
    50
  ); 
```

From here, we just need to update our `tokenURI` function to prepend `ipfs://`. Basically, OpenSea likes when our image URI is structured like this: `ipfs://INSERT_YOUR_CID_HERE`. 

You may be asking why in `run.js` I didn't just directly link to `ipfs://INSERT_YOUR_CID_HERE` or `https://cloudflare-ipfs.com/ipfs/INSERT_YOUR_CID_HERE`. Basically — it's safer to just store the hash itself on the contract, it lets us be a bit more flexible, you'll see :).

So, I change the `json` variable in `tokenURI` to look like this:

```javascript
string memory json = Base64.encode(
      bytes(
        string(
          abi.encodePacked(
            '{"name": "',
            charAttributes.name,
            ' -- NFT #: ',
            Strings.toString(_tokenId),
            '", "description": "An epic NFT", "image": "ipfs://',
            charAttributes.imageURI,
            '", "attributes": [ { "trait_type": "Health Points", "value": ',strHp,', "max_value":',strMaxHp,'}, { "trait_type": "Attack Damage", "value": ',
            strAttackDamage,'} ]}'
          )
        )
      )
    );
```

All I did was prepend that little `ipfs://` after the `image` tag —  then I attach the CID! This will basically create our link. Note: It's really easy to mess this up so be careful w/ all the quotation marks! Here's what my metadata looks like now for example:

```javascript
{
	"name": "Pikachu -- NFT #: 1",
	"description": "An epic NFT",
	"image": "ipfs://bafybeibsifcmwkufr7zwh5s3ekvjkfj5nnadjhweniz4p7lxqelt7mbp74",
	"attributes": [{
		"trait_type": "Health Points",
		"value": 300,
		"max_value": 300
	}, {
		"trait_type": "Attack Damage",
		"value": 25
	}]
}
```

Epic, we're off imgur.

Platforms like OpenSea support `ipfs` links so this works out — they'll know how to read and render this! We now have a final issue — **rendering the image on our React app**!! If we just give our React app something like `ipfs://bafybeibsifcmwkufr7zwh5s3ekvjkfj5nnadjhweniz4p7lxqelt7mbp74` in the `src` tag of the `<img>` tag it won't work! Instead, in your React app, wherever you render the `src` tag of the image, simply do this: 

```javascript
<img src={`https://cloudflare-ipfs.com/ipfs/${INSERT_THE_CID_YOU_GET_FROM_YOUR_CONTRACT_HERE}`} />
```

Now, you may be asking yourself — what is Cloudflare doing here? Basically — they're running an IPFS node on our behalf and letting us use it to access files on the network. Technically, you could do this [yourself](https://dev.to/dabit3/uploading-files-to-ipfs-from-a-web-application-50a) as well if you truly wanted to!

**Bam — you're now using IPFS :). Wasn't that hard, right!? Tell all your friends. Tell your parents. Tell the world.**


## 🐸 Show all the other players in the game!

Right now, all you see is yourself and the boss -- what if you could see a list of all the other players? Perhaps you could show their wallet address, their character's image, and how much damage they've dealt to the boss!

**Would make it feel a lot more "multiplayer" :).**

Give it a try. Not going to explain it here but I think you have all the info you need to change the contract and the web app to make this happen! All you'll need to do is create a function like `getAllPlayers` and then call that from your web app + render the data nicely!



## ⚡️ Add in critical hit chance

Many games have a cool concept of a "critical hit", like Pokemon! Introducing RNG to games is really fun since it brings in "chance" to the game. It'd be cool if you implemented critical hits -- for example maybe there's a 5% chance that some of your characters hit for double the damage. Or maybe there's a 20% chance the boss's attack "misses" and the player gets away lucky!

It'd be cool if specific characters also had a higher chance of a critical hit than others! 

![](https://i.imgur.com/S0r7rfm.png)

Getting a **true** random number in Solidity is impossible. Feel free to read more on it [here](https://github.com/buildspace/buildspace-projects/blob/main/Solidity_And_Smart_Contracts/en/Section_4/Lesson_1_Randomly_Pick_Winner.md) from a past buildspace project.

This is where Chainlink comes in -- which is an oracle that can give us numbers that are truly random. Here's a guide on implementing it [here](https://www.youtube.com/watch?v=JqZWariqh5s). You can try to implement random numbers without Chainlink first, like how we do [here](https://github.com/buildspace/buildspace-projects/blob/main/Solidity_And_Smart_Contracts/en/Section_4/Lesson_1_Randomly_Pick_Winner.md).
