### 🙀 Building our boss

So, in our game our character NFT will be able to attack a boss. 

The whole goal of the game is to attack the boss and bring its HP to 0! But, the catch is that the boss has a lot of HP and every time we hit the boss it will hit us back and bring our HP down. If our character's HP falls below 0, then our character will no longer be able to hit the boss and it'll be “dead”.

Maybe in the future, someone else would be able to build a “revive” function that allows our dead NFTs to regain 100% health points ;). But for now, if our character dies it’s game over. And we can rest easy knowing our character did its best and took one for the team. That means we need other players to attack the boss as well, we can't do this alone.

Let’s first just build a basic boss struct and initialize its data, similar to how we did for our characters. The boss will basically have a name, an image, attack damage, and HP. The boss will *not* be an NFT. The boss’s data will just live on our smart contract.

We can add the following code right under where we declared `nftHolderAttributes`.

```solidity
struct BigBoss {
  string name;
  string imageURI;
  uint hp;
  uint maxHp;
  uint attackDamage;
}

BigBoss public bigBoss;

```

Pretty simple! Just a struct to hold the boss data in an organized way and a `bigBoss` variable as well that will hold our boss so that we can reference it in different functions.

Then, we can actually just initialize our boss right in our contract like this:

```solidity
constructor(
  string[] memory characterNames,
  string[] memory characterImageURIs,
  uint[] memory characterHp,
  uint[] memory characterAttackDmg,
  string memory bossName, // These new variables would be passed in via run.js or deploy.js.
  string memory bossImageURI,
  uint bossHp,
  uint bossAttackDamage
)
  ERC721("Heroes", "HERO")
{
  // Initialize the boss. Save it to our global "bigBoss" state variable.
  bigBoss = BigBoss({
    name: bossName,
    imageURI: bossImageURI,
    hp: bossHp,
    maxHp: bossHp,
    attackDamage: bossAttackDamage
  });

  console.log("Done initializing boss %s w/ HP %s, img %s", bigBoss.name, bigBoss.hp, bigBoss.imageURI);

  // All the other character code is below here is the same as before, just not showing it to keep things short!

```

Finally, we’d just change `run.js` and `deploy.js` to pass in params for our boss:

```javascript
const gameContract = await gameContractFactory.deploy(                        
  ["Leo", "Aang", "Pikachu"],       
  ["https://i.imgur.com/pKd5Sdk.png", 
  "https://i.imgur.com/xVu4vFL.png", 
  "https://i.imgur.com/u7T87A6.png"],
  [100, 200, 300],                    
  [100, 50, 25],
  "Elon Musk", // Boss name
  "https://i.imgur.com/AksR0tt.png", // Boss image
  10000, // Boss hp
  50 // Boss attack damage
);
```

Looks a bit ugly, but, that's it!

We now have a boss whose data lives on our contract. The boss I chose is `Elon Musk`. That means our players must band together to **destroy** Elon Musk. Why are we destroying Elon? No clue. I just thought it'd be funny to have characters like Aang the Airbender and Pikachu attacking Elon XD.

**Please choose your own boss — maybe it's Darth Vader? Maybe it's your uncle? Maybe it's your cat?** Whatever you choose, make sure it's your own!! Don't copy me :).

It would actually be funny if the boss was your pet dog, and, instead of trying to destroy your pet dog you're trying to get your dog to love you more. And, the more people that "pat" your dog on the head, the more your dog loves that player. You could even have a leaderboard of people who patted your dog the most lol.

Anyways, be creative. This is your project :).

### 👾 Retrieve player's NFT attributes

We're going to create a function `attackBoss`. Here's a little outline:

```solidity
function attackBoss() public {
  // Get the state of the player's NFT.
  // Make sure the player has more than 0 HP.
  // Make sure the boss has more than 0 HP.
  // Allow player to attack boss.
  // Allow boss to attack player.
}
```

Let's start!

The very first thing we need to do is **retrieve the player's character NFT state.** This would hold everything like their players HP, AD, etc. This data is held in `nftHolderAttributes` which requires the `tokenId` of the NFT. We can grab the `tokenId` from `nftHolders`! Check it out:

```solidity
function attackBoss() public {
  // Get the state of the player's NFT.
  uint256 nftTokenIdOfPlayer = nftHolders[msg.sender];
  CharacterAttributes storage player = nftHolderAttributes[nftTokenIdOfPlayer];
  console.log("\nPlayer w/ character %s about to attack. Has %s HP and %s AD", player.name, player.hp, player.attackDamage);
  console.log("Boss %s has %s HP and %s AD", bigBoss.name, bigBoss.hp, bigBoss.attackDamage);
}
```

First, I grab the NFT's `tokenId` that the player owns using `nftHolders[msg.sender]`. 

So for example, if I minted the third NFT in the collection, `nftHolders[msg.sender]` would be equal to `3`!

I then grab the player's attributes using `nftHolderAttributes[nftTokenIdOfPlayer]`. I use the keyword `storage` here as well which will be more important a bit later. Basically, when we do `storage` and then do `player.hp = 0` then it would change the health value on the **NFT itself** to `0`.

In contrast, if we were to use `memory` instead of `storage` it would create a local copy of the variable within the scope of the function. That means if we did `player.hp = 0` it would only be that way within the function and wouldn't change the global value.

In `run.js` you can test this out by adding this anywhere under `gameContract.deployed();`:

```javascript
let txn;
txn = await gameContract.mintCharacterNFT(2);
await txn.wait();

txn = await gameContract.attackBoss();
await txn.wait();
```

Here we first mint a character w/ index `2`, which is the third character in our array! So for me, my third character is Pikachu. There's something very funny about having Pikachu attack Elon Musk in-game.

This is the first character NFT we've minted so it will automatically have an id of `1`. Why? Because `_tokenIds` starts off at 0, but then we increment it to `1` in the `constructor`. So, our first NFT will have an ID of `1` **not** `0`.

Then, we do `attackBoss()`. 

When I run this here's what I get.

```plaintext
Done initializing boss Elon Musk w/ HP 10000, img https://i.imgur.com/AksR0tt.png
Done initializing Leo w/ HP 100, img https://i.imgur.com/pKd5Sdk.png
Done initializing Aang w/ HP 200, img https://i.imgur.com/xVu4vFL.png
Done initializing Pikachu w/ HP 300, img https://i.imgur.com/u7T87A6.png
Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Minted NFT w/ tokenId 0 and characterId 2

Player w/ character Pikachu about to attack. Has 300 HP and 25 AD
Boss Elon Musk has 10000 HP and 50 AD
```

Looks good! `Pikachu` is about to attack our boss `Elon Musk` lol. Everything worked perfectly and we're now properly retrieving the NFT's state :).

### 🔍 Do some checks before attacking

Next, we just need to check that the **character has HP**, if the character is dead then they can't attack! We'll also need to make sure that the **boss has HP**. Can't attack a boss if it's already been destroyed.

A few things to note here - 

- You'll also notice the special keyword `require` here. Feel free to read more on it [here](https://ethereum.stackexchange.com/questions/60585/what-difference-between-if-and-require-in-solidity).
- If you are using VSCode, you may have a warning saying "Function state mutability can be restricted to view". Don't stress! This will all be fixed later on as we add more here :).

```solidity
function attackBoss() public {
  // Get the state of the player's NFT.
  uint256 nftTokenIdOfPlayer = nftHolders[msg.sender];
  CharacterAttributes storage player = nftHolderAttributes[nftTokenIdOfPlayer];

  console.log("\nPlayer w/ character %s about to attack. Has %s HP and %s AD", player.name, player.hp, player.attackDamage);
  console.log("Boss %s has %s HP and %s AD", bigBoss.name, bigBoss.hp, bigBoss.attackDamage);

  // Make sure the player has more than 0 HP.
  require (
    player.hp > 0,
    "Error: character must have HP to attack boss."
  );

  // Make sure the boss has more than 0 HP.
  require (
    bigBoss.hp > 0,
    "Error: boss must have HP to attack character."
  );
}
```

### 🔫 Attack the boss!!

Attacking is actually *not* super easy.

Basically, we're working w/ `uint` right now. That's an "[unsigned integer](https://solidity-by-example.org/primitives/)" meaning it can't be negative! This gets kinda weird. Let's say the boss has 10 HP left and our character has 50 AD. That means we'd need to do `10 HP - 50 AD` to calculate the boss's new HP, which would be `-40`. But, we're working w/ `uint` so we can't deal w/ negative numbers!

**We'd get an overflow or underflow error.**

We **could** use `int` which allows us to store negative numbers. But, this gets messy because most libraries like OpenZeppelin or Hardhat don't have decent support for `int` in their library functions. For example, we use `Strings.toString` which only works with `uint`. `console.log` also doesn't work w/ `int` easily.

  

So, it's worth sticking w/ `uint` just for the sake of ease for now.

Basically, the workaround is to simply check if we're going to get a negative number. If we are, then set the boss's HP to 0 manually instead of letting it become negative. 

Let's start diving into the code we already wrote here to is makes more sense!

```solidity
function attackBoss() public {
  // Get the state of the player's NFT.
  uint256 nftTokenIdOfPlayer = nftHolders[msg.sender];
  CharacterAttributes storage player = nftHolderAttributes[nftTokenIdOfPlayer];

  console.log("\nPlayer w/ character %s about to attack. Has %s HP and %s AD", player.name, player.hp, player.attackDamage);
  console.log("Boss %s has %s HP and %s AD", bigBoss.name, bigBoss.hp, bigBoss.attackDamage);

  // Make sure the player has more than 0 HP.
  require (
    player.hp > 0,
    "Error: character must have HP to attack boss."
  );

  // Make sure the boss has more than 0 HP.
  require (
    bigBoss.hp > 0,
    "Error: boss must have HP to attack character."
  );
  
  // Allow player to attack boss.
  if (bigBoss.hp < player.attackDamage) {
    bigBoss.hp = 0;
  } else {
    bigBoss.hp = bigBoss.hp - player.attackDamage;
  }
}
```

`bigBoss.hp < player.attackDamage` is just checking if the boss will have its HP reduced to below 0 based on the players attack damage. For example, if `bigBoss.hp` was 10 and `player.attackDamage` was 30, then we know the boss will have its HP reduced below 0 which would cause an error! So, we just check that case, and then set the boss hp to 0 manually. Otherwise, we just do `bigBoss.hp = bigBoss.hp - player.attackDamage` which will reduce the boss's HP based on how much damage the player does!

### 🔪 Add logic for the boss to attack the player

We also need to make sure the player's HP doesn't turn into a negative number as well because the player's HP is a `uint` as well! So we do:

```solidity
function attackBoss() public {
  // Get the state of the player's NFT.
  uint256 nftTokenIdOfPlayer = nftHolders[msg.sender];
  CharacterAttributes storage player = nftHolderAttributes[nftTokenIdOfPlayer];

  console.log("\nPlayer w/ character %s about to attack. Has %s HP and %s AD", player.name, player.hp, player.attackDamage);
  console.log("Boss %s has %s HP and %s AD", bigBoss.name, bigBoss.hp, bigBoss.attackDamage);
  
  // Make sure the player has more than 0 HP.
  require (
    player.hp > 0,
    "Error: character must have HP to attack boss."
  );

  // Make sure the boss has more than 0 HP.
  require (
    bigBoss.hp > 0,
    "Error: boss must have HP to attack character."
  );
  
  // Allow player to attack boss.
  if (bigBoss.hp < player.attackDamage) {
    bigBoss.hp = 0;
  } else {
    bigBoss.hp = bigBoss.hp - player.attackDamage;
  }

  // Allow boss to attack player.
  if (player.hp < bigBoss.attackDamage) {
    player.hp = 0;
  } else {
    player.hp = player.hp - bigBoss.attackDamage;
  }
  
  // Console for ease.
  console.log("Player attacked boss. New boss hp: %s", bigBoss.hp);
  console.log("Boss attacked player. New player hp: %s\n", player.hp);
}
```

That's it! If `player.hp < bigBoss.attackDamage` then that means the boss will cause the player's hp to fall below 0 which would cause an error. So we check for that, and then manually just do `player.hp = 0`. Else, we set the player's new health using `player.hp = player.hp - bigBoss.attackDamage;`.

Before you run this, make sure `run.js` calls `attackBoss` twice :).

```javascript
let txn;
txn = await gameContract.mintCharacterNFT(2);
await txn.wait();

txn = await gameContract.attackBoss();
await txn.wait();

txn = await gameContract.attackBoss();
await txn.wait();
```

Now when I run `run.js` here's what I get:

```plaintext
Done initializing boss Elon Musk w/ HP 10000, img https://i.imgur.com/AksR0tt.png
Done initializing Leo w/ HP 100, img https://i.imgur.com/pKd5Sdk.png
Done initializing Aang w/ HP 200, img https://i.imgur.com/xVu4vFL.png
Done initializing Pikachu w/ HP 300, img https://i.imgur.com/u7T87A6.png
Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Minted NFT w/ tokenId 0 and characterId 2

Player w/ character Pikachu about to attack. Has 300 HP and 25 AD
Boss Elon Musk has 10000 HP and 50 AD
Player attacked boss. New boss hp: 9975
Boss attacked player. New player hp: 250

Player w/ character Pikachu about to attack. Has 250 HP and 25 AD
Boss Elon Musk has 9975 HP and 50 AD
Player attacked boss. New boss hp: 9950
Boss attacked player. New player hp: 200
```

**Is everything working?** Let's see. Looks like `Pikachu` attacked `Elon Musk` with `25 AD` and Elon's health dropped from `10000` to `9975` which is right! Then Elon attacks Pikachu w/ `50 AD` and Pikachu's health drops from `300` to `250`. Looks like everything is working nicely :).

You can see when we attack a second time, the updated HP values are used for both the character and the boss :).

Feel free to test this function by trying out a boss w/ `1 HP` or trying out a player w/ `1 HP` by just playing around w/ values passed to the constructor in `run.js`. 

For example, if I give the player `1 HP` here's what I get:

```plaintext
Done initializing boss Elon Musk w/ HP 10000, img https://i.imgur.com/AksR0tt.png
Done initializing Leo w/ HP 100, img https://i.imgur.com/pKd5Sdk.png
Done initializing Aang w/ HP 200, img https://i.imgur.com/xVu4vFL.png
Done initializing Pikachu w/ HP 300, img https://i.imgur.com/u7T87A6.png
Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Minted NFT w/ tokenId 0 and characterId 2

Player w/ character Pikachu about to attack. Has 1 HP and 25 AD
Boss Elon Musk has 10000 HP and 50 AD
Player attacked boss. New boss hp: 9975
Boss attacked player. New player hp: 0

Player w/ character Pikachu about to attack. Has 0 HP and 25 AD
Boss Elon Musk has 9975 HP and 50 AD
Error: VM Exception while processing transaction: reverted with reason string 'Error: character must have HP to attack boss.'
    at MyEpicGame.attackBoss (contracts/MyEpicGame.sol:88)
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
    at runNextTicks (node:internal/process/task_queues:65:3)
    at listOnTimeout (node:internal/timers:526:9)
    at processTimers (node:internal/timers:500:7)
    at HardhatNode._mineBlockWithPendingTxs (/Users/flynn/Developer/epic-game/node_modules/hardhat/src/internal/hardhat-network/provider/node.ts:1582:23)
    at HardhatNode.mineBlock (/Users/flynn/Developer/epic-game/node_modules/hardhat/src/internal/hardhat-network/provider/node.ts:435:16)
    at EthModule._sendTransactionAndReturnHash (/Users/flynn/Developer/epic-game/node_modules/hardhat/src/internal/hardhat-network/provider/modules/eth.ts:1494:18)
```

So, you can see the first attack went through properly, `Boss attacked player. New player hp: 0`. Awesome! Our function worked perfectly. Our character's HP was going to be negative, so, it was set to `0`! Yay!

But, the 2nd time we attack we error out with: `Error: character must have HP to attack boss`. Which is correct!! This is pretty much like throwing an error on your API when something goes wrong.

NICEEEEE — our `attackBoss` function is basically done. We'll add some more magic to it later but for now we're good to go. We officially have our game logic **on-chain** :).

### Bonus round (for the over-achievers)!

If you want to add some more spice to your attack logic, how about we add some chance into the mix? That is to say, what if your attack might miss-- or your boss? In the following section, we will look at a code snippet that can be used to generate pseudo-random numbers on chain! 

Word of warning, using pseudo-random numbers should be done only in low-stakes situations! These functions are subject to 'gaming' in a number of ways, and if you ever need to get random numbers in a contract you plan to deploy to mainnet, you should use [Chainlink VRF](https://docs.chain.link/docs/vrf/v2/introduction/) or something like it. Since we aren't deploying to mainnet, we will get away with the easy route for now!

Introducing: [keccak256](https://keccak.team/keccak_specs_summary.html), a really powerful hashing algorithm, but knowing anything past that is pretty in the weeds- feel free to read up on it after the lesson.

Alright, enough talking, let's see some code.

```solidity
contract MyEpicGame {
...
uint randNonce = 0; // this is used to help ensure that the algorithm has different inputs every time
...

function randomInt(uint _modulus) internal returns(uint) {
   randNonce++;                                                     // increase nonce
   return uint(keccak256(abi.encodePacked(now,                      // an alias for 'block.timestamp'
                                          msg.sender,               // your address
                                          randNonce))) % _modulus;  // modulo using the _modulus argument
 }
}
```

There are a few things to dissect here. Starting from the top, we had to instantiate a new state variable called `randNonce`, you can call it anything you want though ;). We'll use it later as input to our hashing function. Following that, we have a function declaration, and you may notice a new item in it: `internal`-- this just means it can only be called from within the contract itself. 

Finaly the elephant in the room: `uint(keccak256(abi.encodePacked(now, msg.sender, randNonce))) % _modulus;` don't stress if this looks intimidating. All we're doing is sending a stream of data into the keccak256 function, which returns a hash to us (think of something that looks like your wallet public address), *and then we're ignoring everything in that hash except for the last digit*. That's it! Insert these snippets into the contract, and we are almost ready! 

With the function written and ready for use, we just need to go and insert it into the existing attack functions. Here's how you could do it in one method (you'll have to do it yourself on the other attack function, but I have faith in your abilities!):

```solidity
console.log("%s swings at %s...", player.name, bigBoss.name);        
        if (bigBoss.hp < player.attackDamage) {
            bigBoss.hp = 0;
            console.log("The boss is dead!");
        } else {
            if (randMod(10) > 5) {                                 // by passing 10 as the mod, we elect to only grab the last digit (0-9) of the hash!
                bigBoss.hp = bigBoss.hp - player.attackDamage;
                console.log("%s attacked boss. New boss hp: %s", player.name, bigBoss.hp);
            } else {
                console.log("%s missed!\n", player.name);
            }
        }
```

If implemented correctly, the output might look something like this when we run `npx hardhat run scripts/run.js`:

```plaintext
Aang swings at Elon...
Aang missed!

Elon swings at Aang...
Elon attacked Aang. New player hp: 50

...

Aang swings at Elon...
Aang missed!

Elon swings at Aang...
Elon attacked Aang. New player hp: 0
```

Bad luck for Aang, but good luck for you-- because you've just conquered pseudo-random number generation in Solidity!

I emplore you to play around with this. What if you wanted to make the chance something other than 50-50? You might add a 'luck' or 'defense' stat to your character and boss structs, so that these values can be added to the ABI and made dynamic with the rest of your character's traits! It would take a bit of refactoring, but your code would be much more robust (and interesting) for it!
