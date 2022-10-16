### ✨ Mint the NFTs

Now that we have all the data nicely set up for our characters, the next thing to do is actually mint the NFT. Let's go through that process. Here's my updated contract and I put a comment above lines I changed/added to make it easy!

```javascript
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// NFT contract to inherit from.
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Helper functions OpenZeppelin provides.
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


import "hardhat/console.sol";

// Our contract inherits from ERC721, which is the standard NFT contract!
contract MyEpicGame is ERC721 {

  struct CharacterAttributes {
    uint characterIndex;
    string name;
    string imageURI;        
    uint hp;
    uint maxHp;
    uint attackDamage;
  }

  // The tokenId is the NFTs unique identifier, it's just a number that goes
  // 0, 1, 2, 3, etc.
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  CharacterAttributes[] defaultCharacters;

  // We create a mapping from the nft's tokenId => that NFTs attributes.
  mapping(uint256 => CharacterAttributes) public nftHolderAttributes;

  // A mapping from an address => the NFTs tokenId. Gives me an ez way
  // to store the owner of the NFT and reference it later.
  mapping(address => uint256) public nftHolders;

  constructor(
    string[] memory characterNames,
    string[] memory characterImageURIs,
    uint[] memory characterHp,
    uint[] memory characterAttackDmg
    // Below, you can also see I added some special identifier symbols for our NFT.
    // This is the name and symbol for our token, ex Ethereum and ETH. I just call mine
    // Heroes and HERO. Remember, an NFT is just a token!
  )
    ERC721("Heroes", "HERO")
  {
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
      
      // Hardhat's use of console.log() allows up to 4 parameters in any order of following types: uint, string, bool, address
      console.log("Done initializing %s w/ HP %s, img %s", c.name, c.hp, c.imageURI);
    }

    // I increment _tokenIds here so that my first NFT has an ID of 1.
    // More on this in the lesson!
    _tokenIds.increment();
  }

  // Users would be able to hit this function and get their NFT based on the
  // characterId they send in!
  function mintCharacterNFT(uint _characterIndex) external {
    // Get current tokenId (starts at 1 since we incremented in the constructor).
    uint256 newItemId = _tokenIds.current();

    // The magical function! Assigns the tokenId to the caller's wallet address.
    _safeMint(msg.sender, newItemId);

    // We map the tokenId => their character attributes. More on this in
    // the lesson below.
    nftHolderAttributes[newItemId] = CharacterAttributes({
      characterIndex: _characterIndex,
      name: defaultCharacters[_characterIndex].name,
      imageURI: defaultCharacters[_characterIndex].imageURI,
      hp: defaultCharacters[_characterIndex].hp,
      maxHp: defaultCharacters[_characterIndex].maxHp,
      attackDamage: defaultCharacters[_characterIndex].attackDamage
    });

    console.log("Minted NFT w/ tokenId %s and characterIndex %s", newItemId, _characterIndex);
    
    // Keep an easy way to see who owns what NFT.
    nftHolders[msg.sender] = newItemId;

    // Increment the tokenId for the next person that uses it.
    _tokenIds.increment();
  }
}
```

A lot of stuff going on here.

First thing I do is create two state variables which are sorta like permanent global variables on the contract. Read about them [here](https://ethereum.stackexchange.com/a/25556).

```javascript
mapping(uint256 => CharacterAttributes) public nftHolderAttributes;
mapping(address => uint256) public nftHolders;
```

`nftHolderAttributes` will be where we store the state of the player's NFTs. We map the the NFT's id to a `CharacterAttributes` struct.

Remember, every player has their own character NFT. And, every single NFT has their own state like `HP`, `Attack Damage`, etc! So if Player #172 owns a "Pikachu" NFT and their Pikachu NFT loses health in a battle **then only Player 172's Pikachu NFT should be changed** everyone else's Pikachu should stay the same! So, we store this player character level data in a map.

Next, I have `nftHolders` which basically lets me easily map the address of a user to the ID of the NFT they own. For example, I would be able to do `nftHolders[INSERT_PUBLIC_ADDRESS_HERE]` and instantly know what NFT  that address owns. It's just helpful to keep this data on the contract so it's easily accessible. 

### ⚡️ ERC 721

You'll also see I "inherit" an OpenZeppelin contract using `is ERC721`  when I declare the contract. You can read more about inheritance [here](https://solidity-by-example.org/inheritance/), but basically, it means we can call other contracts from ours. It's almost like importing functions for us to use.

The NFT standard is known as `ERC721` which you can read a bit about [here](https://eips.ethereum.org/EIPS/eip-721). OpenZeppelin essentially implements the NFT standard for us and then lets us write our own logic on top of it to customize it. That means we don't need to write boilerplate code.

It'd be crazy to write a HTTP server from scratch without using a library, right? Of course, unless you wanted to explore lol. Similarly — it'd be crazy to just write an NFT contract from complete scratch! You can explore the `ERC721` contract we're inheriting from [here](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol).

```solidity
_tokenIds.increment();
```

So, `_tokenIds` starts at `0`. It's just a counter. `increment()` just adds 1 - see [here](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/fa64a1ced0b70ab89073d5d0b6e01b0778f7e7d6/contracts/utils/Counters.sol#L32).

**In the constructor** I increment it to `1`.  Why?  Basically because I don't like dealing w/ `0`s in my code. In Solidity, `0` is a [default value](https://docs.soliditylang.org/en/v0.8.14/control-structures.html#scoping-and-declarations) and I try to stay away from default values. Just trust me on it for now ;).

I also have `increment()` in `mintCharacterNFT` but don't forget to add it in the `constructor` as well ;).

```solidity
function mintCharacterNFT(uint _characterIndex)
```

This function is where the actual minting is happening.

First, you'll see that we pass in `_characterIndex`. Why?

Well, because players need to be able to tell us **which character they want**! For example, if I do `mintCharacterNFT(0)` then the character w/ the stats of `defaultCharacters[0]` is minted!

```solidity
uint256 newItemId = _tokenIds.current();
```

From there we have a number called `newItemId`. This is the id of the NFT itself. Remember, each NFT is "unique" and the way we do this is we give each token a unique ID. It's just a basic counter. `_tokenIds.current()` starts at 0, but, we did `_tokenIds.increment()` in the `constructor` so it'll be at `1`. 

We're using `_tokenIds` to keep track of the NFTs unique identifier, and it's just a number! So, when we first call `mintCharacterNFT`, `newItemId` is 1. When we run it again, `newItemId` will be 2, and so on!

`_tokenIds` is **state** **variable** which means if we change it, the value is stored on the contract directly like a global variable that stays permanently in memory.

```solidity
_safeMint(msg.sender, newItemId). 
```

This is the magic line! When we do `_safeMint(msg.sender, newItemId)` it's pretty much saying: "mint the NFT with id `newItemId` to the user with address `msg.sender`". Here, `msg.sender` is a variable [Solidity itself provides](https://docs.soliditylang.org/en/develop/units-and-global-variables.html#block-and-transaction-properties) that easily gives us access to the **public address** of the person calling the contract.

**You can't call a contract anonymously**, you need to have your wallet credentials connected. This is almost like "signing in" and being authenticated :).

What's awesome here is this is a **super-secure way to get the user's public address**. Keeping the public address itself a secret isn't an issue, it's already public!! Everyone sees it. But, by using `msg.sender` you can't "fake" someone else's public address unless you had their wallet credentials and called the contract on their behalf!

### 🎨 Holding dynamic data on an NFT

So, as players play the game, certain values on their character will change, right? For example, If I have my character attack the boss, the boss will hit back! **In that case, my NFT's HP would need to go down.** We need a way to store this data per player:

```solidity
nftHolderAttributes[newItemId] = CharacterAttributes({
  characterIndex: _characterIndex,
  name: defaultCharacters[_characterIndex].name,
  imageURI: defaultCharacters[_characterIndex].imageURI,
  hp: defaultCharacters[_characterIndex].hp,
  maxHp:defaultCharacters[_characterIndex].maxHp,
  attackDamage: defaultCharacters[_characterIndex].attackDamage
});
```

A lot happening here! Basically, **our NFT holds data related to our player's NFT. But, this data is dynamic. For example,** let's say I create an NFT. By default my NFT starts with default stats like:

```json
{
  characterIndex: 1,
  name: "Aang",
  imageURI: "https://i.imgur.com/xVu4vFL.png",
  hp: 200,
  maxHp: 200,
  attackDamage: 50
} 
```

**Remember**, **every player has their own character NFT and the NFT itself holds data on the state of the character.**

Let's say my character is attacked and loses 50 HP, well then HP would go from 200 → 150, right? That value would need to change on the NFT! 

```json
{
  characterIndex: 1,
  name: "Aang",
  imageURI: "https://i.imgur.com/xVu4vFL.png",
  hp: 150,
  maxHp: 200,
  attackDamage: 50
} 
```

Or maybe we want our game to have **upgradeable** characters, where you can give your character a sword and add +10 attack damage from 50 → 60. Then, `attackDamage` would need to change on the NFT!

People often think that NFTs metadata isn't allowed to change, but, that's not true. It's actually up to the creator!!!

In this case, our character name and character image **never** change, but it's HP value definitely does! **Our NFTs** must be able to maintain the state of our specific player's character.

This is why we need the variable `nftHolderAttributes` which maps the tokenId of the NFT to a struct of `CharacterAttributes`. It allows us to easily update values related to the player's NFT. That means as players play our game and their NFT's `hp` value changes (because the boss hits them), we actually change their `hp` value on `nftHolderAttributes`. And that's how we can store player-specific NFT data on our contract!

Next, we do:

```solidity
nftHolders[msg.sender] = newItemId;
```

Map the user's public wallet address to the NFTs tokenId. What this lets me do later is easily keep track of who owns which NFTs.

*Note: Right now this is designed where each player can only hold one character NFT per wallet address. If you wanted, you could adjust this to where players can hold multiple characters but I stuck with 1 character per player for the sake of ease! This is our game, do whatever the heck you want.*

```solidity
_tokenIds.increment();
```

After the NFT is minted, we increment `_tokenIds` using `_tokenIds.increment()` (which is a function OpenZeppelin gives us). This makes sure that next time an NFT is minted, it'll have a different `_tokenIds` identifier. No one can have a `_tokenIds` that's already been minted.

### 😳 Running it locally

In `run.js` what we need to do is actually call `mintCharacterNFT`. I added the following lines to `run.js` right under where we print out the contract address.

```javascript

let txn;
// We only have three characters.
// an NFT w/ the character at index 2 of our array.
txn = await gameContract.mintCharacterNFT(2);
await txn.wait();

// Get the value of the NFT's URI.
let returnedTokenUri = await gameContract.tokenURI(1);
console.log("Token URI:", returnedTokenUri);

```

When we do `mintCharacterNFT(2)` Hardhat will actually call this function with a **default wallet** that it sets up for us locally. So that means `msg.sender` will be the public address of our local wallet! **This is another reason Hardhat is so nice,** it easily lets us use default local wallets!! This is usually a massive pain to set up yourself.

The function `tokenURI` is something we get for free from `ERC721` since we inherited from it. 

Basically, `tokenUri` is a function on **every NFT** that returns the **actual data** attached to the NFT. So when I call `gameContract.tokenURI(1)` it's basically saying, *"go get me the data inside the NFT with tokenId 1"*, which would be the first NFT minted. And, it should give me back everything like: my character's name, my character's current hp, etc.

Platforms like OpenSea, Rarible, and Pixxiti know to hit `tokenURI` since that's the standard way to retrieve the NFTs metadata. Let's try running our contract again (remember the command is `npx hardhat run scripts/run.js`)

My output looks like this:

```plaintext
Done initializing Leo w/ HP 100, img https://i.imgur.com/pKd5Sdk.png
Done initializing Aang w/ HP 200, img https://i.imgur.com/xVu4vFL.png
Done initializing Pikachu w/ HP 300, img https://i.imgur.com/u7T87A6.png
Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Minted NFT w/ tokenId 1 and characterIndex 2
Token URI:
```

**Hmmmmmm**. Token URI prints out nothing! That means we have no data attached to our NFT. But wait, that makes no sense! Didn't we already set our data up with `nftHolderAttributes`?

**Nope. `nftHolderAttributes` hasn't actually attached to our NFT in any way. It's just a mapping that lives on the contract right now.** What we're going to do next is basically attach `nftHolderAttributes` to the `tokenURI` by overriding it :).

### ⭐️ Setup tokenURI

The `tokenURI` actually has a specific format! It's actually expecting the NFT data in **JSON**.

Let's go over how to do this :).

Create a new folder under `contracts` called `libraries`. Create a file named `Base64.sol` and drop it under libraries. Copy and paste the code from [here](https://gist.github.com/farzaa/f13f5d9bda13af68cc96b54851345832) into `Base64.sol`. This basically provides us with some helper functions to let us encode any data into a Base64 string — which is a standard way to encode some piece of data into a string. Don't worry, you'll see how it works in a bit!


We'll need to import that library into our contract.
For that, add the following snippet near the top of your file, with the other imports.
```solidity
// Helper we wrote to encode in Base64
import "./libraries/Base64.sol";
``` 

Next, we write a function called `tokenURI` in `MyEpicGame.sol`.

```solidity
function tokenURI(uint256 _tokenId) public view override returns (string memory) {
  CharacterAttributes memory charAttributes = nftHolderAttributes[_tokenId];

  string memory strHp = Strings.toString(charAttributes.hp);
  string memory strMaxHp = Strings.toString(charAttributes.maxHp);
  string memory strAttackDamage = Strings.toString(charAttributes.attackDamage);

  string memory json = Base64.encode(
    abi.encodePacked(
      '{"name": "',
      charAttributes.name,
      ' -- NFT #: ',
      Strings.toString(_tokenId),
      '", "description": "This is an NFT that lets people play in the game Metaverse Slayer!", "image": "',
      charAttributes.imageURI,
      '", "attributes": [ { "trait_type": "Health Points", "value": ',strHp,', "max_value":',strMaxHp,'}, { "trait_type": "Attack Damage", "value": ',
      strAttackDamage,'} ]}'
    )
  );

  string memory output = string(
    abi.encodePacked("data:application/json;base64,", json)
  );
  
  return output;
}
```

This looks pretty complex. But, it's not too crazy! First we start here:

```solidity
CharacterAttributes memory charAttributes = nftHolderAttributes[_tokenId];
```

This line actually **retrieves** this specific NFTs data by querying for it using it's `_tokenId` that was passed in to the function. So, if I did `tokenURI(256)` it would return the JSON data related the 256th NFT (if it existed!).

Then, we take all that data and pack it nicely in a variable named `json`. The JSON's structure looks sorta like this (when it's all cleaned up):

```json
{
  "name": "Aang",
  "description": "This is a description", 
  "image": "https://i.imgur.com/xVu4vFL.png", 
  "attributes": [
		{ "trait_type": "Health Points", "value": 200, "max_value": 200 },
		{ "trait_type": "Attack Damage", "value": 50 }
	], 
}
```

You can read more on the structure of the data [here](https://docs.opensea.io/docs/metadata-standards#metadata-structure).

So, this may look pretty crazy but it's just us structuring the data to follow the format above:

```solidity
string memory json = Base64.encode(
  abi.encodePacked(
        '{"name": "',
        charAttributes.name,
        ' -- NFT #: ',
        Strings.toString(_tokenId),
        '", "description": "This is an NFT that lets people play in the game Metaverse Slayer!", "image": "',
        charAttributes.imageURI,
        '", "attributes": [ { "trait_type": "Health Points", "value": ',strHp,', "max_value":',strMaxHp,'}, { "trait_type": "Attack Damage", "value": ',
        strAttackDamage,'} ]}'
  )
);
```

We **dynamically** set things like the NFTs name, HP, AD, etc. *Note: abi.encodePacked just combines strings.* This is really cool because we can change things like the NFTs HP or image later if we wanted and it'd update on the NFT itself! **It's dynamic.**

Also, this metadata standard is followed by tons of popular NFT websites like OpenSea. So, all we're doing in the function is we're nicely formatting our `json` variable to follow the standards! Note: `max_value` isn't required, but, I decided to just add it in for fun.

```solidity
abi.encodePacked("data:application/json;base64,", json)
```

This line is actually kinda hard to explain, it's easier to just show you! Go ahead and run `run.js`. Here's my output:

```plaintext
Done initializing Leo w/ HP 100, img https://i.imgur.com/pKd5Sdk.png
Done initializing Aang w/ HP 200, img https://i.imgur.com/xVu4vFL.png
Done initializing Pikachu w/ HP 300, img https://i.imgur.com/u7T87A6.png
Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Minted NFT w/ tokenId 1 and characterIndex 2
Token URI: data:application/json;base64,eyJuYW1lIjogIlBpa2FjaHUgLS0gTkZUICM6IDEiLCAiZGVzY3JpcHRpb24iOiAiQ3JpdGljYWxIaXQgaXMgYSB0dXJuLWJhc2VkIE5GVCBnYW1lIHdoZXJlIHlvdSB0YWtlIHR1cm5zIHRvIGF0dGFjayB0aGUgYm9vcy4iLCAiaW1hZ2UiOiAiaHR0cHM6Ly9pLmltZ3VyLmNvbS91N1Q4N0E2LnBuZyIsICJhdHRyaWJ1dGVzIjogWyB7ICJ0cmFpdF90eXBlIjogIkhlYWx0aCBQb2ludHMiLCAidmFsdWUiOiAzMDAsICJtYXhfdmFsdWUiOjMwMH0sIHsgInRyYWl0X3R5cGUiOiAiQXR0YWNrIERhbWFnZSIsICJ2YWx1ZSI6IDI1fSBdfQ==
```

You'll see that Token URI now actually prints stuff out! **Nice!** Go ahead and copy that whole string after `Token URI:`. For example, mines looks like this:

```plaintext
data:application/json;base64,eyJuYW1lIjogIlBpa2FjaHUgLS0gTkZUICM6IDEiLCAiZGVzY3JpcHRpb24iOiAiQ3JpdGljYWxIaXQgaXMgYSB0dXJuLWJhc2VkIE5GVCBnYW1lIHdoZXJlIHlvdSB0YWtlIHR1cm5zIHRvIGF0dGFjayB0aGUgYm9vcy4iLCAiaW1hZ2UiOiAiaHR0cHM6Ly9pLmltZ3VyLmNvbS91N1Q4N0E2LnBuZyIsICJhdHRyaWJ1dGVzIjogWyB7ICJ0cmFpdF90eXBlIjogIkhlYWx0aCBQb2ludHMiLCAidmFsdWUiOiAzMDAsICJtYXhfdmFsdWUiOjMwMH0sIHsgInRyYWl0X3R5cGUiOiAiQXR0YWNrIERhbWFnZSIsICJ2YWx1ZSI6IDI1fSBdfQ==
```

Paste that string into the URL bar of your browser. What you'll see is something that looks like this:

![Untitled](https://i.imgur.com/C3QmD2G.png)

BOOOOOOM!!!

Basically, what we did was we formatted our JSON file and then **encoded** **it** in Base64. So it turns the JSON file into this super long, encoded string that is readable by our browser when we prepend it with `data:application/json;base64,`.

We add `data:application/json;base64,` because our browser needs to know how to read the encoded string we're passing it. In this case we're saying, 

"Hey, I'm passing you a Base64 encoded JSON file, please render it properly". 

Again, this is considered a standard for a majority of browsers which is perfect because we want our NFTs data to be compatible with as many existing systems as possible. 

Why are we doing all this Base64 stuff? Well, basically this is how popular NFT websites like OpenSea, Rarible, Pixxiti, and many others prefer when we pass them JSON data from our contract directly :).

**Awesome**. So, we're at the point we are officially minting NFTs locally and the NFT has actual data attached to it in a way that properly follows standards!

**We're ready to deploy our NFT to Pixxiti :).**

### 🚨 Progress report!

Post a screenshot of your JSON output when you paste in the `tokenURI` into your browser's address bar :)!
