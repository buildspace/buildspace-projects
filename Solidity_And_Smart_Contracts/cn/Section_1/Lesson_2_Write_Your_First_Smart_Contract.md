anymose 2021-12-14

👩‍💻 让我们写一个智能合约
----------------------------

太棒了，我们做到了！Awesome, we made it.

我们将直接开始开始项目。We're just going to hop right into our project.

让我们来编写一个智能合约发送 👋 到合约上并记录一共有多少次 # 挥动。因为在你的网站上可能会经常需要统计 # 次数，所以它是非常重要的。请根据你的实际需要做出适合你的修改。 Let's build a smart contract that lets us send a 👋 to our contract and keep track of the total # of waves. This is going to be useful because on your site, you might want to keep track of this #! Feel free to change this to fit your use case.

Create a file named **`WavePortal.sol`** under the **`contracts`** directory. File structure is super important when using Hardhat, so, be careful here!

We're going to start out with the structure every contract starts out with.

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    constructor() {
        console.log("Yo yo, I am a contract and I am smart");
    }
}
```

Note: You may want to download the VS Code Solidity extension for easy syntax highlighting [here](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity).

```solidity
// SPDX-License-Identifier: UNLICENSED
```

Just a fancy comment.  It's called a "SPDX license identifier", feel free to Google what it is :).

```solidity
pragma solidity ^0.8.0;
```

This is the version of the Solidity compiler we want our contract to use. It basically says "when running this, I only want to use version 0.8.0 of the Solidity compiler, nothing lower. Note, be sure that the compiler version is the same in `hardhat.config.js`.

```solidity
import "hardhat/console.sol";
```

Some magic given to us by Hardhat to do some console logs in our contract. It's actually challenging to debug smart contracts but this is one of the goodies Hardhat gives us to make life easier.

```solidity
contract WavePortal {
    constructor() {
        console.log("Yo yo, I am a contract and I am smart");
    }
}
```

So, smart contracts sort of look like a `class` in other languages, if you've ever seen those! Once we initialize this contract for the first time, that constructor will run and print out that line. Please make that line say whatever you want :)!

In the next lesson, we'll run this and see what we get!

🚨 Before you click "Next Lesson"
-------------------------------------------

*Note: if you don't do this, Farza will be very sad :(.*

Go to #progress and post a screenshot of your fancy contract in the WavePortal.sol file :).
