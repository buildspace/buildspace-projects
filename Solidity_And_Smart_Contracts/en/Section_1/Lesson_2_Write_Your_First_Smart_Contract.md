## 👩‍💻 Let's write a contract

Awesome, we made it.

We're just going to hop right into our project.

Let's build a smart contract that lets us send a 👋 to our contract and keep track of the total # of waves. This is going to be useful because on your site, you might want to keep track of this #! Feel free to change this to fit your use case.

Create a file named **`WavePortal.sol`** under the **`contracts`** directory. File structure is super important when using Hardhat, so, be careful here!

We're going to start out with the structure every contract starts out with.

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

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
pragma solidity ^0.8.17;
```

This is the version of the Solidity compiler we want our contract to use. It basically says "when running this, I only want to use version 0.8.17 of the Solidity compiler, nothing lower. Note, be sure that the compiler version is the same in `hardhat.config.js`.

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

## 🚨 Before you click "Next Lesson"

*Note: if you don't do this, Farza will be very sad :(.*

Go to #progress and post a screenshot of your fancy contract in the WavePortal.sol file :).
