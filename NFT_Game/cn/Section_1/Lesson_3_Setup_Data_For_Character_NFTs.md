### 🤔 What's an NFT?

Haha, this is a big question. Be sure to read through [this](https://github.com/buildspace/buildspace-projects/blob/main/NFT_Collection/en/Section_1/Lesson_1_What_Is_A_NFT.md) real quick to give you a little primer before moving on. As long as you have a *general idea* about what an NFT is, that's all you really need here!

### 😮 How we're going to use playable NFTs

Cool. We've got all our basic environment stuff set up! Let's take a step back to kinda explain this game we're making at a higher level again:

The goal of our game will be to destroy a boss. Let's say that boss has 1,000,000 HP. What players do is when they start the game, they mint a **character NFT** that has a certain amount of **Attack Damage** and **HP.** Players can order their **character NFT** to attack the boss and deal damage to it. Kinda like a Pokemon!

The goal? Players need to work together to attack the boss and bring its HP down to 0. The catch? Every time a player hit the boss, the boss hits the player back! If the NFT's HP goes below 0, the player's NFT **dies** and they can't hit the boss anymore. Players **can only have one character NFT in their wallet.** Once the character's NFT dies, it's game over. That means many players need to join forces to attack the boss and kill it.

**Note: If you want your player to be able to hold multiple character in their wallet (like Pokemon) feel free to make the modifications on your own!**

The important thing to know here is that the characters themselves are **NFTs**.

So, when a player goes to play the game:

1. They'll connect their wallet.
2. Our game will detect they don't have a character NFT in their wallet.
3. We'll let them choose a character and mint their own character NFT to play the game. Each character NFT has its own attributes stored on the NFT directly like: HP, Attack Damage, the image of the character, etc. So, when the character's HP hits 0, it would say `hp: 0` on the NFT itself.

**This is exactly how the world's most popular NFT games work :).**  We're going to build it ourselves! What we need to do first is basically set up our minting NFT code because, without that, players can't even get into our game to play!

### ✨ Setup the data for your NFTs

Time for the fun part, setting up our character NFTs. Each character will have a few attributes: an image, a name, HP value, and attack damage value. **These attributes will live directly on the NFT itself.** We may add some more attributes later on.

The way our character NFTs will work is there will only be a set # of characters (ex. 3). **But, an unlimited # of NFTs of each character can be minted.** Again, you can change this if you want — for example if you want only a small # of a certain character to be minted.

So that means if five people mint character #1, that means all five people will have the exact same character but each person will have a unique NFT and **each NFT holds its own state.** For example, if Player #245's NFT gets hit and loses HP, only their NFT should lose HP!

If that doesn't make sense, don't worry! Let's just jump in the code — it'll slowly make more sense.

The first thing we need to do is actually have a way to initialize a character's **default attributes** (ex. their default HP, default attack damage, default image, etc). For example, if we have a character named "Pikachu", then we need to set Pikachu's base HP, base attack damage, etc. 

I updated `MyEpicGame.sol` to look like this:

```javascript
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract MyEpicGame {
  // We'll hold our character's attributes in a struct. Feel free to add
  // whatever you'd like as an attribute! (ex. defense, crit chance, etc).
  struct CharacterAttributes {
    uint characterIndex;
    string name;
    string imageURI;        
    uint hp;
    uint maxHp;
    uint attackDamage;
  }
  // A lil array to help us hold the default data for our characters.
  // This will be helpful when we mint new characters and need to know
  // things like their HP, AD, etc.
  CharacterAttributes[] defaultCharacters;

  // Data passed in to the contract when it's first created initializing the characters.
  // We're going to actually pass these values in from run.js.
  constructor(
    string[] memory characterNames,
    string[] memory characterImageURIs,
    uint[] memory characterHp,
    uint[] memory characterAttackDmg
  )
  {
    // Loop through all the characters, and save their values in our contract so
    // we can use them later when we mint our NFTs.
    for(uint i = 0; i < characterNames.length; i += 1) {
      defaultCharacters.push(CharacterAttributes({
        characterIndex: i,
        name: characterNames[i],
        imageURI: characterImageURIs[i],
        hp: characterHp[i],
        maxHp: characterHp[i],
        attackDamage: characterAttackDmg[i]
      }));

      CharacterAttributes memory c = defaultCharacters[i];
      console.log("Done initializing %s w/ HP %s, img %s", c.name, c.hp, c.imageURI);
    }
  }
}
```

There is a lot happening here but essentially I'm passing in a bunch of values to my `constructor` to set up my characters. Why? Well — I need a way to tell my contract, "Hey — when a player requests a Pikachu NFT, please give that NFT this base HP, this base AD, this base image, etc".

Remember, the constructor runs only **once** when the contract is executed.

I take the character data in my `constructor` and store it nicely on the contract in a `struct` of type `CharacterAttributes`. Each `CharacterAttributes` holds the base attributes for each character. 

```solidity
struct CharacterAttributes {
  uint characterIndex;
  string name;
  string imageURI;        
  uint hp;
  uint maxHp;
  uint attackDamage;
}
```

I actually store each character in an array called `defaultCharacters`. 

```solidity
CharacterAttributes[] defaultCharacters;
```

All this gives me is easy access to each character. For example, I can just do `defaultCharacters[0]` and get access to the default attributes of the first character. This is useful for when we mint our NFTs and need to initialize their data!

We then need to update `run.js`. Here's what that looks like:

```javascript
const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
  const gameContract = await gameContractFactory.deploy(
    ["Leo", "Aang", "Pikachu"],       // Names
    ["https://i.imgur.com/pKd5Sdk.png", // Images
    "https://i.imgur.com/xVu4vFL.png", 
    "https://i.imgur.com/WMB6g9u.png"],
    [100, 200, 300],                    // HP values
    [100, 50, 25]                       // Attack damage values
  );
  await gameContract.deployed();
  console.log("Contract deployed to:", gameContract.address);
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

I'm not doing anything very fancy here. In `run.js` I basically define my three characters and their stats. My characters are Leonardo DiCaprio, Aang from Avatar, and Pikachu...lol. Each character basically has an: id, name, image, hp value, and attack value. 

For example, in this case `Aang` has 200 HP, and 50 Attack Damage. He has a lot of health, but his attacks don't hit as hard as Leonardo! Leonardo has less HP, but his attacks are more powerful. That means in the game he'll die faster, but will do lots of damage.

**You can balance your characters however you want :). Please don't copy my characters. Add three of your own.**

Okay, that's it :)!! When I run this using `npx hardhat run scripts/run.js` here's what I get:

```plaintext
Done initializing Leo w/ HP 100, img https://i.imgur.com/pKd5Sdk.png
Done initializing Aang w/ HP 200, img https://i.imgur.com/xVu4vFL.png
Done initializing Pikachu w/ HP 300, img https://i.imgur.com/WMB6g9u.png
Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

Boom! We've officially created three characters and are saving their data directly on our contract.

**Again**, **don't copy my characters. Come up with you own before moving on.**

Maybe your characters can be from your fav anime or video game.

Maybe you don't even want characters. Maybe instead you want people to mint "**weapons**" that players using in the game like a **sword**, **machine gun**, or a **laser cannon**.

Maybe you want your characters to have things like "mana", "energy", or "chakra" where your character can cast certain "spells" using these attributes.

**Customize your characters. It's what makes this fun + your own.** For example, I added Leonardo DiCaprio and Pikachu as characters because I thought it'd be funny as hell lol — and I chuckle every time I see it haha.

Changing around little things like the character will make you feel more like it's your own thing and you'll be a little more motivated to build this thing all the way :).

### 🚨 Progress report!

Post a screenshot in #progress introducing one of your characters -- perhaps post their image + let us know their name and amount of AD/HP they have!! 
