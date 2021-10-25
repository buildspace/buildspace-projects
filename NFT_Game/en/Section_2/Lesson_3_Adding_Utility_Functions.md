Below I'm going to be going over a few functions. These won't seem really useful right now, but, they'll be insanely useful when we start working on our web app.

### ✅ Build function to check if user has a character NFT.

We need a way to check if a user has a character NFT we've given them, and then retrieve the NFT's attributes if the NFT exists. Why?

When users go to play our game and connect their wallet to our web app, **we need to be able to retrieve their NFT so they can play the game  and so we know stuff like their NFT's HP, AD, etc —  else we need to tell them to mint one.**

Here's how we're going to setup the function:

```solidity
function checkIfUserHasNFT() public view returns (CharacterAttributes memory) {
  // Get the tokenId of the user's character NFT
  // If the user has a tokenId in the map, return their character.
  // Else, return an empty character.
}
```

The plan here is to return `CharacterAttributes` filled with the state of the user's NFT is they have one. If they don't have an NFT for our game in their wallet, we return an empty `CharacterAttributes`.

```solidity
function checkIfUserHasNFT() public view returns (CharacterAttributes memory) {
  // Get the tokenId of the user's character NFT
  uint256 userNftTokenId = nftHolders[msg.sender];
  // If the user has a tokenId in the map, return their character.
  if (userNftTokenId > 0) {
    return nftHolderAttributes[userNftTokenId];
  }
  // Else, return an empty character.
  else {
    CharacterAttributes memory emptyStruct;
    return emptyStruct;
   }
}
```

Why do we do `userNftTokenId > 0`? Well, basically there's [no way](https://ethereum.stackexchange.com/a/13029) to check if a key in a map exists. We set up our map like this: `mapping(address => uint256) public nftHolders`. No matter what key we look for, there will be a default value of `0`.

This is a problem for user's with NFT tokenId of `0`. That's why earlier, I did `_tokenIds.increment()` in the constructor! That way, **no one is allowed to have tokenId `0`**. This is one of those cases where we need to be smart in how we set up our code because of some of the quirks of Solidity :).

### 🎃 Retrieve all default characters.

Our web app is going to have a "character select screen" for new players so they can choose which character NFT they want to mint!

This is pretty straight forward function to write :).

```solidity
function getAllDefaultCharacters() public view returns (CharacterAttributes[] memory) {
  return defaultCharacters;
}
```

Ezpz!

You may be asking yourself, "Why are we building functions to get single variables? Can't we somehow access these variables directly from the contract?". Yes, you can! But, it's just best practice to create `get` functions :). Makes everything nice and organized.

### 💀 Retrieve the boss.

We need to be able to retrieve the boss. Why? Well — when our player is playing the game our app will need to be able to show them stuff like the boss's HP, name, image, etc!

This is also very staright forward just like our `getAllDefaultCharacters` function.

```solidity
function getBigBoss() public view returns (BigBoss memory) {
  return bigBoss;
}
```

That's it!

### 🧠 Adding in `Event`s to our contract.

When we call `mintCharacterNFT`, how do we know it's **actually** done? When we do:

```javascript
let txn = await gameContract.mintCharacterNFT(1);
await txn.wait(); 
```

This will basically return when the transaction has been **mined**. But, how do we know if the NFT was actually minted successfully?? *It's possible that our transaction was mined, but failed for some reason* (ex. b/c of an edge case bug in our code). It's also possible that our transaction was **mined**, **but then [later dropped](https://www.reddit.com/r/ethereum/comments/m4mmy9/etherscan_dropped_my_transaction_why/)** (ex. by changes in gas fees).

We only want to tell the user "Hey, your NFT was minted" when we're sure the function actually ran without any errors.

And you may ask yourself, "Hey, can't we just return a value from `mintCharacterNFT`? We'd return `true` if the NFT was minted successfully and `false` if there was some sort of error. Well — [we can't do that either](https://ethereum.stackexchange.com/a/88122). You can't return values from a transaction.

We can return values from `view` functions easily because these are simple read-only calls, they are not state changing transactions.

Luckily, we have a solution and they're called [Events](https://ethereum.stackexchange.com/a/11232). These are basically like webhooks. We can "fire" an event from Solidity, and then "catch" that event on our web app. Pretty freaking cool right :)? Let's do it!

Create these two events, can add them under where we create `mapping(address => uint256) public nftHolders`. We need to basically tell Solidity the format of our events before we start firing them.

I also added an `AttackComplete` event which will be useful when we build our UI for "attacking" the boss — since we'll need to know if we successfully attacked the boss!

```solidity
event CharacterNFTMinted(address sender, uint256 tokenId, uint256 characterIndex);
event AttackComplete(uint newBossHp, uint newPlayerHp);
```

The first event, `CharacterNFTMinted` we're going to fire when we finish minting an NFT for our user! This will allow us to notify them when we're done minting the NFT! So, we can actually fire this event by adding this line to the very bottom of our `mintCharacterNFT` function (right after the `_tokenIds.increment();` part) :

```solidity
emit CharacterNFTMinted(msg.sender, newItemId, _characterIndex);
```

Boom! That's it. Now our web app will be able to "catch" this event (kinda like a web hook we can **listen** to) when the NFT is officially done minting. We'll cover how to catch the event later. 

Next we have the `AttackComplete` event. This would fire when we've officially attacked our boss. You can see the events return  to us the boss's new hp and the player's new hp!

This is pretty cool because we can catch this event on our client and it's going to allow us to update the player + boss's HP dynamically without them needing to reload the page. It'll feel like a legit game.

All we need to do is add this line to the bottom of the `attackBoss` function:

```solidity
emit AttackComplete(bigBoss.hp, player.hp);
```

That's it :). Let's move on to our web app!!