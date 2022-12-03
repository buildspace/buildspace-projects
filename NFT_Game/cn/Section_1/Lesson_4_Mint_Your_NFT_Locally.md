### ✨ 铸造NFTs

现在我们已经为角色设置好了所有数据，接下来要做的就是制作NFT。让我们回顾一下这个过程。这是我更新的合约，我在我修改/添加的行上面加了注释，让它更容易理解!

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

这里做了很多改变。

我要做的第一件事是创建两个状态变量，它们有点像合约上的永久全局变量。阅读他们[这里](https://ethereum.stackexchange.com/a/25556)。

```javascript
mapping(uint256 => CharacterAttributes) public nftHolderAttributes;
mapping(address => uint256) public nftHolders;
```

`nftHolderAttributes` 将是我们存储玩家的NFTs状态的地方。我们将NFT的id映射到一个`CharacterAttributes` 结构体。

记住，每个玩家都有自己的角色NFT。而且，每个NFT都有自己的状态，如“HP”、“攻击伤害”等。所以如果玩家172拥有一个“皮卡丘”NFT，而他们的皮卡丘NFT在战斗中失去了生命值**那么只有玩家172的皮卡丘NFT应该被更改**，其他人的皮卡丘应该保持不变!所以，我们将玩家角色等级数据存储在映射中。

接下来，我创建了`nftHolders` ，它基本上可以让我轻松地将用户的地址映射到他们所拥有的NFT的ID。例如，我将能够执行`nftHolders[INSERT_PUBLIC_ADDRESS_HERE]` ，就能立即知道该地址拥有什么NFT。将这些数据保存在合约中是很有帮助的，这样就很容易获得。

### ⚡️ ERC 721

You'll also see I "inherit" an OpenZeppelin contract using `is ERC721`  when I declare the contract. You can read more about inheritance [here](https://solidity-by-example.org/inheritance/), but basically, it means we can call other contracts from ours. It's almost like importing functions for us to use.

The NFT standard is known as `ERC721` which you can read a bit about [here](https://eips.ethereum.org/EIPS/eip-721). OpenZeppelin essentially implements the NFT standard for us and then lets us write our own logic on top of it to customize it. That means we don't need to write boilerplate code.

It'd be crazy to write a HTTP server from scratch without using a library, right? Of course, unless you wanted to explore lol. Similarly — it'd be crazy to just write an NFT contract from complete scratch! You can explore the `ERC721` contract we're inheriting from [here](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol).

您还会看到我在声明一个OpenZeppelin合约时，使用 `is ERC721`  来继承这个合约。你可以阅读更多关于继承的内容[在这里](https://solidity-by-example.org/inheritance/)，但基本上，这意味着我们可以从我们的合约中调用其他合约。这就像导入函数供我们使用。

NFT标准被称为“ERC721”，你可以在 [这里](https://eips.ethereum.org/EIPS/eip-721).读到一些相关内容。OpenZeppelin实际上为我们实现了NFT标准，然后让我们在其上编写自己的逻辑来定制它。这意味着我们不需要编写模版代码。

从头开始编写HTTP服务器而不使用库是很疯狂的，对吧?当然，除非你想探索，哈哈。同样的，从头开始编写NFT合同也太疯狂了!您可以从[这里](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol).探索继承的 `ERC721` 合约

```solidity
_tokenIds.increment();
```

因此， `_tokenIds` 从 `0`开始。它只是一个计数器。`increment()` 只是增加了1 -参见[这里](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/fa64a1ced0b70ab89073d5d0b6e01b0778f7e7d6/contracts/utils/Counters.sol#L32)。

**在构造函数**中，我将它加到 `1`。为什么?基本上是因为我不喜欢在代码中处理w/  `0`。在Solidity中， `0`是一个[默认值](https://docs.soliditylang.org/en/v0.8.14/control-structures.html#scoping-and-declarations)，我尝试远离默认值。现在就相信我吧;)。

我也有 `increment()` 在 `mintCharacterNFT` 中，但不要忘记添加它在 `constructor` ;)。

```solidity
function mintCharacterNFT(uint _characterIndex)
```

这个函数是实际铸造发生的地方。

首先，你会看到我们传入 `_characterIndex`. 。为什么?

因为玩家需要能够告诉我们他们想要的是哪个角色!例如，如果我做 `mintCharacterNFT(0)` ，那么角色 `defaultCharacters[0]` 将被铸造!

```solidity
uint256 newItemId = _tokenIds.current();
```

在这里我们定义了一个数字叫做`newItemId`。这是NFT本身的id。记住，每个NFT都是“唯一的”，我们做到这一点的方法是给每个令牌一个唯一的ID。这只是一个基本的计数器。 `_tokenIds.current()` 从0开始，但是，我们在`constructor` 中做了`_tokenIds.increment()` ，所以它将开始值为 `1`。

我们使用 `_tokenIds` 来跟踪nft的唯一标识符，它只是一个数字!当我们第一次调用`mintCharacterNFT`时，`newItemId` 是1。当我们再次运行它时，`newItemId` 将是2，以此类推!

`_tokenIds` 是**状态变量**，这意味着如果我们改变它，值将直接存储在合约上，就像一个永久保存在内存中的全局变量一样。

```solidity
_safeMint(msg.sender, newItemId). 
```

这是魔法线!当我们执行`_safeMint(msg.sender, newItemId)` ，这就相当于在说:“将id为`newItemId` 的NFT发送给地址为 `msg.sender`的用户”。在这里, `msg.sender`是一个变量，是由[Solidity本身提供](https://docs.soliditylang.org/en/develop/units-and-global-variables.html#block-and-transaction-properties)，它可以让我们轻松访问调用合约的人的**公共地址**。

**你不能匿名调用合约**，你需要有你的钱包凭证连接。这几乎就像“登录”和被验证:)。

最棒的是，**这是一种获取用户公共地址的超级安全方式**。公开地址本身不是个问题，它已经是公开的了!!每个人都看到了。但是，通过使用`msg.sender`你不能“伪造”别人的公共地址，除非你有他们的钱包凭证，并代表他们调用合约!

### 🎨 在NFT上保存动态数据

所以，随着玩家玩游戏，他们角色的某些属性也会改变，对吧?例如，如果我让我的角色攻击boss, boss就会反击!**在这种情况下，我的NFT的HP将需要下降。**我们需要一种方法来存储每个玩家的数据:

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

这里发生了很多事情!基本上，**我们的NFT与玩家的NFT的数据对应上了。但是，这些数据是动态的。例如，**假设我创建一个NFT。默认情况下，我的NFT以默认状态开始:

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

**记住，每个玩家都有自己的角色NFT，而NFT本身也拥有关于角色状态的数据。**

假设我的角色受到攻击并失去了50点HP，那么HP将从200变成150，对吧?这个值需要在NFT上改变!

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

In this case, our character name and character image **never** change, but it's HP value definitely does! **Our NFTs** must be able to maintain the state of our specific player's character.

This is why we need the variable `nftHolderAttributes` which maps the tokenId of the NFT to a struct of `CharacterAttributes`. It allows us to easily update values related to the player's NFT. That means as players play our game and their NFT's `hp` value changes (because the boss hits them), we actually change their `hp` value on `nftHolderAttributes`. And that's how we can store player-specific NFT data on our contract!

Next, we do:

或者我们希望我们的游戏拥有可升级的角色，即你可以给角色一把剑并添加10点攻击伤害(50 → 60)。然后，`attackDamage` 就需要在NFT上改变了!

人们通常认为NFTs元数据是不允许改变的，但事实并非如此。这实际上取决于创造者!!

在这种情况下，我们的角色名称和角色形象**永远不会改变**，但它的HP值却会改变!**我们的NFTs**必须能够维持特定玩家角色的状态。

这就是为什么我们需要变量 `nftHolderAttributes` ，它将NFT的tokenId映射到一个结构体`CharacterAttributes`。这让我们能够轻松地更新与玩家NFT相关的值。这意味着当玩家在玩我们的游戏时，他们的NFT的 `hp` 值发生了变化(因为boss击中了他们)，我们实际上是在 `nftHolderAttributes`上改变了他们的 `hp` 值。这就是我们如何在合约中存储特定于玩家的NFT数据的方法!

接下来，我们做:

```solidity
nftHolders[msg.sender] = newItemId;
```

将用户的公共钱包地址映射到 NFTs 的tokenId。这让我以后可以轻松地跟踪谁拥有哪些nft。

*注意:现在的设计是每个玩家在每个钱包中只能持有一个角色NFT。如果你愿意，你可以调整到玩家可以持有多个角色，但为了方便起见，我坚持每个玩家持有1个角色。这是我们的游戏，你想怎么做就怎么做。*

```solidity
_tokenIds.increment();
```

在创建NFT之后，我们使用 `_tokenIds.increment()`(这是OpenZeppelin提供给我们的函数)增加`_tokenIds` 。这可以确保下次生成NFT时，它将具有不同的 `_tokenIds` 标识符。没有人可以拥有已经创建的 `_tokenIds` 。

### 😳 本地运行

在 `run.js` 中，我们需要做的是调用`mintCharacterNFT`。我在`run.js` 中添加了以下几行，就在我们打印合约地址的地方。

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

当我们执行 `mintCharacterNFT(2)` 时，Hardhat将使用它为我们本地设置的**默认钱包**调用这个函数。这意味着是 `msg.sender` 将是我们本地钱包的公共地址!**这是Hardhat如此好用的另一个原因，**它很容易让我们使用默认的本地钱包！如果你自己建立本地钱包的话，这将是一个巨大的痛苦。

函数 `tokenURI` 是我们从 `ERC721` 中免费获得的，因为我们继承了它。

 `tokenURI` 是一个函数，它在每个NFT上返回附加到NFT的实际数据。所以当我调用`gameContract.tokenURI(1)` 时，它通常是在说，“去获取带有tokenId为1的NFT中的数据”，这将是第一个NFT。并且，它应该返回我的所有内容:我的角色的名字，我的角色的当前hp等等。

OpenSea、Rarible和Pixxiti等平台也可以点击按钮获取 `tokenURI` ，因为这是检索NFT元数据的标准方式。让我们再次运行我们的合约(记住命令是 `npx hardhat run scripts/run.js`)。

我的输出看起来像这样:

```plaintext
Done initializing Leo w/ HP 100, img https://i.imgur.com/pKd5Sdk.png
Done initializing Aang w/ HP 200, img https://i.imgur.com/xVu4vFL.png
Done initializing Pikachu w/ HP 300, img https://i.imgur.com/u7T87A6.png
Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Minted NFT w/ tokenId 1 and characterIndex 2
Token URI:
```

**Hmmmmmm。** Token URI什么也打印不出来!这意味着我们的NFT没有数据。但是等等，这说不通!我们不是已经用`nftHolderAttributes`设置了数据吗?

**不。`nftHolderAttributes`没有以任何方式附加到我们的NFT。这只是目前存在于合约中的一个映射。**我们接下来要做的是通过覆盖 `tokenURI` 来将它附加到 `nftHolderAttributes` )。

### ⭐️ 设置tokenURI

 `tokenURI` 实际上有一个特定的格式!它实际上期望NFT数据保存在**JSON**中。

让我们来看看怎么做:)。

在 `contracts` 下创建一个名为`libraries`的新文件夹。在libraries下面创建一个名为 `Base64.sol`的文件。从[这里](https://gist.github.com/farzaa/f13f5d9bda13af68cc96b54851345832)复制并粘贴代码到  `Base64.sol`。这基本上为我们提供了一些帮助函数，让我们可以将任何数据编码为Base64字符串—这是将一些数据编码为字符串的标准方法。别担心，您很快就会看到它是如何工作的!

我们需要将该库导入到我们的合约中。
为此，将以下代码片段与其他导入一起添加到合约文件的顶部附近。

```solidity
// Helper we wrote to encode in Base64
import "./libraries/Base64.sol";
```

接下来，我们在 `MyEpicGame.sol`.中编写一个名为 `tokenURI` 的函数。

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

这看起来很复杂。但是，这并不太疯狂!首先我们从这里开始:

```solidity
CharacterAttributes memory charAttributes = nftHolderAttributes[_tokenId];
```

这一行实际上是通过使用传入函数的 `_tokenId` 查询来获取这个特定的NFTs数据。所以，如果我执行 `tokenURI(256)` ，它将返回与第256个NFT相关的JSON数据(如果它存在的话!)

然后，我们将所有数据很好地打包到一个名为 `json`的变量中。JSON的结构看起来像这样:

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

您可以阅读更多关于数据结构的信息[在这里](https://docs.opensea.io/docs/metadata-standards#metadata-structure)。

所以，这可能看起来很疯狂，但它只是我们按照上面的格式构造数据:

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

我们**动态地**设置诸如NFTs名称、HP、AD等。*abi.encodePacked 只是组合字符串。*这真的很酷，因为我们可以改变像NFT的HP或图像之后，如果我们想，它会在NFT本身更新! ***因为这是动态的。*** 

此外，OpenSea等许多热门NFT网站也遵循了这一元数据标准。所以，我们在函数中所做的就是按照标准很好地格式化 `json` 变量!注意:`max_value` 不是必需的，但是，我决定添加它只是为了好玩。

```solidity
abi.encodePacked("data:application/json;base64,", json)
```

这句话其实有点难解释，直接给你看更容易!继续并运行 `run.js`.。这是我的输出:

```plaintext
Done initializing Leo w/ HP 100, img https://i.imgur.com/pKd5Sdk.png
Done initializing Aang w/ HP 200, img https://i.imgur.com/xVu4vFL.png
Done initializing Pikachu w/ HP 300, img https://i.imgur.com/u7T87A6.png
Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Minted NFT w/ tokenId 1 and characterIndex 2
Token URI: data:application/json;base64,eyJuYW1lIjogIlBpa2FjaHUgLS0gTkZUICM6IDEiLCAiZGVzY3JpcHRpb24iOiAiQ3JpdGljYWxIaXQgaXMgYSB0dXJuLWJhc2VkIE5GVCBnYW1lIHdoZXJlIHlvdSB0YWtlIHR1cm5zIHRvIGF0dGFjayB0aGUgYm9vcy4iLCAiaW1hZ2UiOiAiaHR0cHM6Ly9pLmltZ3VyLmNvbS91N1Q4N0E2LnBuZyIsICJhdHRyaWJ1dGVzIjogWyB7ICJ0cmFpdF90eXBlIjogIkhlYWx0aCBQb2ludHMiLCAidmFsdWUiOiAzMDAsICJtYXhfdmFsdWUiOjMwMH0sIHsgInRyYWl0X3R5cGUiOiAiQXR0YWNrIERhbWFnZSIsICJ2YWx1ZSI6IDI1fSBdfQ==
```

您将看到Token URI 现在实际打印出东西!很好I 继续并复制 `Token URI:`后整个字符串。例如，是这样的:

```plaintext
data:application/json;base64,eyJuYW1lIjogIlBpa2FjaHUgLS0gTkZUICM6IDEiLCAiZGVzY3JpcHRpb24iOiAiQ3JpdGljYWxIaXQgaXMgYSB0dXJuLWJhc2VkIE5GVCBnYW1lIHdoZXJlIHlvdSB0YWtlIHR1cm5zIHRvIGF0dGFjayB0aGUgYm9vcy4iLCAiaW1hZ2UiOiAiaHR0cHM6Ly9pLmltZ3VyLmNvbS91N1Q4N0E2LnBuZyIsICJhdHRyaWJ1dGVzIjogWyB7ICJ0cmFpdF90eXBlIjogIkhlYWx0aCBQb2ludHMiLCAidmFsdWUiOiAzMDAsICJtYXhfdmFsdWUiOjMwMH0sIHsgInRyYWl0X3R5cGUiOiAiQXR0YWNrIERhbWFnZSIsICJ2YWx1ZSI6IDI1fSBdfQ==
```

将该字符串粘贴到浏览器的URL栏中。你将看到的是这样的东西:

![Untitled](https://i.imgur.com/C3QmD2G.png)

BOOOOOOM ! !

基本上，我们所做的就是格式化我们的JSON文件，然后在Base64中**编码**它。因此，当我们在JSON文件前加上 `data:application/json;base64,`时，它会将JSON文件变成这个超长的编码字符串，浏览器可以读懂。

我们添加了 `data:application/json;base64,`，因为我们的浏览器需要知道如何读取我们传递给它的编码字符串。在这种情况下，我们说，

“嘿，我传递给你一个Base64编码的JSON文件，请正确地渲染它”。

同样，这被认为是大多数浏览器的标准，这是完美的，因为我们希望我们的NFT数据与尽可能多的现有系统兼容。

为什么我们要做Base64这些东西?基本上，这就是OpenSea、Rarible、Pixxiti等热门NFT网站喜欢我们直接从合约中传递JSON数据的原因。

**太棒了.**我们已经在本地正式创造了NFT，并且NFT以一种符合标准的方式附加了实际数据!

**我们准备将我们的NFT部署到Pixxiti:) **

### 🚨 进度报告!

当你将 `tokenURI` 粘贴到浏览器的地址栏时，发布你的JSON输出截图:)!
