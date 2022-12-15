### 🤔 什么是NFT ?

哈哈，这是个大问题。在继续学习之前，一定要快速阅读[这篇文章](https://github.com/buildspace/buildspace-projects/blob/main/NFT_Collection/en/Section_1/Lesson_1_What_Is_A_NFT.md)，给你一点入门知识。只要你对NFT有一个*大致的概念*，这就是你真正需要的!

### 😮我们将如何使用可玩性NFTs

酷。我们已经把所有基本的环境设置好了!让我们回过头来再次解释一下我们正在创造的这款游戏:

我们游戏的目标是消灭一个boss。假设boss拥有1,000,000 HP。玩家所做的是，当他们开始游戏时，他们创造了一个拥有一定**攻击伤害**和**HP的**角色NFT**。**玩家可以命令自己的**角色NFT**攻击boss并对其造成伤害。有点像口袋妖怪!

我们的目标吗?玩家需要合作攻击boss，将其HP降至0。每当玩家攻击boss时，boss也会反击玩家!如果NFT的HP低于0，玩家的NFT就会死亡，他们就不能再打boss了。玩家**只能在钱包中拥有一个角色NFT。**一旦角色的NFT死亡，游戏就结束了。这意味着许多玩家需要联合起来攻击boss并杀死它。

**注意:如果你希望你的玩家能够在他们的钱包中容纳多个角色(如Pokemon)，你可以自己进行修改!**

这里要知道的重要事情是，字符本身是**NFTs**。

所以，当玩家开始玩游戏时:

1. 他们会连接他们的钱包。
2. 我们的游戏将检测到他们的钱包中是否拥有角色NFT。
3. 没有角色NFT，我们将让他们选择一个角色并创造自己的角色NFT来玩游戏。每个角色的NFT都有自己的属性并直接存储在NFT中，比如:HP、攻击伤害、角色的形象等。所以，当角色的HP达到0时，它会在NFT上显示“HP: 0”。

**这正是世界上最流行的NFT游戏的运作方式:)**。我们要自己建造它!我们首先需要做的是设置我们的铸造NFT代码，因为如果没有它，玩家甚至无法进入我们的游戏!

### ✨ 为NFTs设置数据

到了有趣的部分，设置我们的角色NFTs。每个角色都有一些属性:图像、名字、HP值和攻击伤害值。**这些属性将直接存在于NFT本身。**稍后我们可能会添加更多的属性。

我们的角色 NFTs的工作方式是只有一组#字符(例如3)。**但是，每个角色的 NFT数量是无限的。**同样，如果您愿意，您可以更改这一点——例如，如果您只想要一个特定字符的小#被铸造。

这意味着如果5个人创造了第1个角色，这5个人将拥有完全相同的角色，**但每个人将拥有独特的NFT并且每个NFT拥有自己的状态。**例如，如果245号玩家的NFT被击中并失去HP，那么只有他们的NFT应该失去HP!

如果你不明白，别担心!让我们直接进入代码-它会慢慢变得更有意义。

我们需要做的第一件事便是找到一种方法去初始化角色的默认属性(例如他们的默认HP，默认攻击伤害，默认图像等)。例如，如果我们拥有一个名为“皮卡丘”的角色，那么我们便需要设置皮卡丘的基础HP，基础攻击伤害等。

我更新了 `MyEpicGame.sol` 。看起来像这样:

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

这里发生了很多事情，但本质上我传递了一堆值给我的 `constructor` 来设置我的角色。为什么?我需要告诉我的合约，“嘿——当玩家要求皮卡丘NFT时，请给NFT这个基础HP，这个基础AD，这个基础图像等等。”

记住，在执行合约时， `constructor` 只运行**一次**。

我在我的 `constructor` 中获取字符数据，并将其漂亮地存储在类型为 `CharacterAttributes`的`struct` 中。每个' `CharacterAttributes`包含每个角色的基本属性。

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

我将每个角色存储在一个名为 `defaultCharacters`的数组中。

```solidity
CharacterAttributes[] defaultCharacters;
```

所有这些都让我很容易接触到每个角色。例如，我可以只执行 `defaultCharacters[0]` ，并获得对第一个角色的默认属性的访问。当我们创建我们的NFTs并需要初始化它们的数据时，这是很有用的!

然后我们需要更新`run.js`。这是它看起来的样子:

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

我没有做什么特别的事情。在 `run.js` 中，我定义了我的三个角色和他们的属性。我的角色是莱昂纳多·迪卡普里奥、《阿凡达》中的安昂和皮卡丘……哈哈。每个角色基本上都有一个:id、名称、图像、hp值和攻击值。

例如，在这种情况下，安昂有200点HP和50点攻击伤害。他有很多的生命值，但他的攻击不像莱昂纳多那么严重!莱昂纳多的HP更少，但他的攻击更强大。这意味着在游戏中他会死得更快，但会造成很大的伤害。

**你可以平衡你的角色:)。请不要模仿我的角色。再加三个你自己的。**

好了，就这样:)!!当我使用`npx hardhat run scripts/run.js` 运行时这是我得到的:

```plaintext
Done initializing Leo w/ HP 100, img https://i.imgur.com/pKd5Sdk.png
Done initializing Aang w/ HP 200, img https://i.imgur.com/xVu4vFL.png
Done initializing Pikachu w/ HP 300, img https://i.imgur.com/WMB6g9u.png
Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

Boom!我们已经正式创建了三个角色，并将他们的数据直接保存在我们的合约中。

**再次强调不要复制我的角色。在继续前行之前，拿出你自己的想法。**

也许你的角色可以来自你最喜欢的动漫或电子游戏。

也许你根本不想要角色。也许你想让玩家制作“武器”，让玩家在游戏中使用，比如剑、机关枪或激光炮。

也许你想让角色拥有“法力”、“能量”或“脉轮”这样的东西，让角色能够使用这些属性施放特定的“法术”。

**定制你的角色。这是你自己的乐趣。**例如，我添加了莱昂纳多·迪卡普里奥和皮卡丘作为角色，因为我认为这将是有趣的，哈哈-我笑每次我都能看到它哈哈。

改变像角色这样的小事情会让你觉得这是你自己的事情，你会更有动力去创造这个东西:)

### 🚨 进度报告!

在#progress 中发布一个介绍你的角色的截图——也许是发布他们的图片，让我们知道他们的名字和伤害/HP数量!!
