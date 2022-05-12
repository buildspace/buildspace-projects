One thing we’re doing that's super important to recognize is we’re actually changing our NFTs attributes.

For example, when we do `player.hp = player.hp - bigBoss.attackDamage;` it’s actually changing the `Health Points` attribute that shows up on OpenSea on the NFT itself. Let’s test this out to make sure it's working as expected!

### 👻 Deploy again and see the NFTs changing values

Copy all of `run.js` and overwrite whats in `deploy.js`. Here's what my `run.js` looks like right now:

```javascript
const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
  
  const gameContract = await gameContractFactory.deploy(                        
    ["Leo", "Aang", "Pikachu"],       
    ["https://i.imgur.com/pKd5Sdk.png", 
    "https://i.imgur.com/xVu4vFL.png", 
    "https://i.imgur.com/u7T87A6.png"],
    [100, 200, 300],                    
    [100, 50, 25],
    "Elon Musk",
    "https://i.imgur.com/AksR0tt.png",
    10000,
    50
  );

  await gameContract.deployed();
  console.log("Contract deployed to:", gameContract.address);

  let txn;
  // We only have three characters.
  // an NFT w/ the character at index 2 of our array.
  txn = await gameContract.mintCharacterNFT(2);
  await txn.wait();

  txn = await gameContract.attackBoss();
  await txn.wait();

  txn = await gameContract.attackBoss();
  await txn.wait();

  console.log("Done!");
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
```

Again, I just like keeping both separate since `deploy.js` I usually don't change much. What we mainly want to test now is the `attackBoss` function. It should change the HP on the NFT.

I deploy using `npx hardhat run scripts/deploy.js --network rinkeby`. From there, here's my output:

```plaintext
Contract deployed to: 0x02f59Dc14666c4480Ae4b477eFfF15949970dfeA 
```

Once you wait a few mins, sites like OpenSea or Rarible should show your NFT w/ it's update HP #.

So in this case, I minted one `Pikachu` character NFT and then had `Pikachu` attack `Elon Musk` twice. `Pikachu` **started at 300 HP**, so if he attacks Elon twice, then that means `Pikachu` should have 200 HP.

On OpenSea here's how it looks for me:

![](https://i.imgur.com/dv5Q2lR.png)

It's all working as intended!!! Yay!! Pikachu lost health!

Feel free to see it on Rarible as well. Just know Rarible is much slower in showing updated metadata! `https://rinkeby.rarible.com/token/INSERT_DEPLOY_CONTRACT_ADDRESS_HERE:INSERT_TOKEN_ID_HERE`.

![](https://i.imgur.com/Pwx4IOM.png)

**Note 1**: Don't see your updated stats on OpenSea or Rarible? **Tap that refresh button I circled there at the top right and wait a few minutes.** If you're using Rarible, I've noticed it takes a solid 10-20 min for it to update the stats on their end. *OpenSea is faster when it comes to updating metadata.*

**Note 2:** I should mention that the NFT itself is updated immediately on the contract once `attackBoss` is mined, but, these third-party sites like OpenSea and Rarible have their own caching mechanics.

### 👑 You dropped this

YOU DID IT.

This is a big deal, we've officially built an **interactive NFT.** Good stuff :).
