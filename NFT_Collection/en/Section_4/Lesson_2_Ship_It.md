🙉 A note on github
----------------

**If uploading to Github, don't upload your hardhat config file with your private key to your repo. You will get robbed.**

I use dotenv for this.

```bash
npm install --save dotenv
```

```javascript
require('@nomiclabs/hardhat-waffle');
require('dotenv').config();

module.exports = {
  solidity: '0.8.0',
  networks: {
    rinkeby: {
      url: process.env.STAGING_ALCHEMY_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
    mainnet: {
      chainId: 1,
      url: process.env.PROD_ALCHEMY_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
```

And your .env file would look something like:

```plaintext
STAGING_ALCHEMY_KEY=BLAHBLAH
PROD_ALCHEMY_KEY=BLAHBLAH
PRIVATE_KEY=BLAHBLAH
```

(don't commit your .env after this lol).

🌎 A note on IPFS
----------------
I'm just going to leave this for you to explore, but, sometimes you won't want to store your NFTs on-chain. Perhaps you want to have a video as an NFT. Doing it on-chain would be wildly expensive due to gas fees.

In this case, you could use something called [IPFS](https://docs.ipfs.io/concepts/what-is-ipfs/) which is sorta like a decentralized data storage system that no one actually owns. It's run by the people.

It's actually pretty easy to implement with a service called [Pinata](https://www.pinata.cloud/).

Remember, an NFT is just a JSON file at the end of the day that links to some metadata. You can put this JSON file up on IPFS. You can also put the NFT data itself (ex an image, video, etc) up on IPFS. Don't overcomplicate it :).

**A large percentage of NFTs use IPFS. It's the most popular way to store NFT data today.**

I'll leave it to you to explore!! ;)


😍 You've done it.
---------------
Super exciting that you made it to the end. Pretty big deal!

Before you head out, be sure to add a few of those little final touches from the previous lesson if you feel like it. Those really make the difference. When you're ready, post a link to your project in #showcase. Your fellow classmates will be the first to mint some of your awesome NFTs!

Thank you for contributing to the future of web3 by learning this stuff. The fact that you know how this works and how to code it up is a superpower. Use your power wisely ;).


🌈 Before you head out...
---------
Go to #showcase in Discord and show us your final product that we can mess around with :).

Also, should totally tweet out your final project and show the world your epic creation! What you did wasn't easy by any means. Maybe even make a little video showing off your project and attach that to the tweet. Make your tweet look pretty and show off :).

And if you feel up to it, tag @_buildspace :). We'll RT it. Plus, it gives us a ton of motivation whenever we see people ship their projects.

Lastly, what would also be awesome is if you told us in #feedback how you liked this project and the structure of the project. What did you love most about buildspace? What would like us to change for future projects? Your feedback would be awesome!!


See yah around!!!
