Our contract is starting to take shape. But, we’re just giving away mappings right now. You can’t really view them in your wallet or on OpenSea. That’s not very cash money. What we’re going to do here is **turn our domains into NFTs that are viewable on OpenSea** and sell them for different amounts depending on how long the domain is.

By the way, **ENS domains are just NFTs under the hood.** It’s unique and only one wallet can hold a certain domain at a time.

If you want to learn about what an NFT is, click [here](https://github.com/buildspace/buildspace-projects/blob/main/NFT_Collection/en/Section_1/Lesson_1_What_Is_A_NFT.md) for a primer before moving on. As long as you have a *general idea* about what an NFT is, you’re gucci!

### 💰 Getting paid and going .ninja

Weirdly enough, we haven’t actually put a TLD (top-level domain) like `.eth` in our contract. No more! Let’s setup a domain that we want our friends to be able to mint! I’m going `.ninja` 🥷 

**Please change this to whatever you vibe with**. Maybe it’s “.fren”, “.vibes” or just “.toast”:

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

// Don't forget to add this import
import { StringUtils } from "./libraries/StringUtils.sol";
import "hardhat/console.sol";

contract Domains {
  // Here's our domain TLD!
  string public tld;

  mapping(string => address) public domains;
  mapping(string => string) public records;
		
  // We make the contract "payable" by adding this to the constructor
  constructor(string memory _tld) payable {
    tld = _tld;
    console.log("%s name service deployed", _tld);
  }
		
  // This function will give us the price of a domain based on length
  function price(string calldata name) public pure returns(uint) {
    uint len = StringUtils.strlen(name);
    require(len > 0);
    if (len == 3) {
      return 5 * 10**17; // 5 MATIC = 5 000 000 000 000 000 000 (18 decimals). We're going with 0.5 Matic cause the faucets don't give a lot
    } else if (len == 4) {
      return 3 * 10**17; // To charge smaller amounts, reduce the decimals. This is 0.3
    } else {
      return 1 * 10**17;
    }
  }
  // Added "payable" modifier to register function
  function register(string calldata name) public payable{
    require(domains[name] == address(0));
    
    uint _price = price(name);

    // Check if enough Matic was paid in the transaction
    require(msg.value >= _price, "Not enough Matic paid");

    domains[name] = msg.sender;
    console.log("%s has registered a domain!", msg.sender);
  }
  // Other functions unchanged
}
```

*Note: We still need the* `getAddress`, `setRecord` *and* `getRecord` *functions, they’re just unchanged so I removed them to keep this short.*

You’ll notice something extra spice here! We added `payable` to `register`.

I also added:

```solidity
uint _price = price(name);  
require(msg.value >= _price, "Not enough Matic paid");
```

Here we check if the “value” of the “msg” sent is above a certain amount. “Value” is the amount of Matic sent and “msg” is the transaction. 

I want you to take a minute to appreciate how insane this is. With just one line of code, we can add payments to our app. No API keys needed. No auth. No callbacks from payment providers. 

This is the beauty of the blockchain. It’s built for transacting value. If the transaction doesn’t have enough Matic, it gets reverted and nothing changes.

Looking closer at the price function, we see that it is a pure function - meaning it doesn’t read or modify contract state. It’s just a helper. Could we do it on the front-end using JavaScript etc.? Yeah, but it wouldn’t be as secure! Here, we calculate final price on-chain.

**I’ve set up mine to return prices based on the length of the domain. Shorter domains are more expensive!**

Since the MATIC token has 18 decimals, we need to put `* 10**18` at the end of the prices.

```solidity
function price(string calldata name) public pure returns(uint) {
  uint len = StringUtils.strlen(name);
  require(len > 0);
  if (len == 3) {
    return 5 * 10**17; // 5 MATIC = 5 000 000 000 000 000 000 (18 decimals). We're going with 0.5 Matic cause the faucets don't give a lot
  } else if (len == 4) {
    return 3 * 10**17; // To charge smaller amounts, reduce the decimals. This is 0.3
  } else {
    return 1 * 10**17;
  }
}
```

*Note: **You will need to reduce prices to mint on the Mumbai testnet!** If you charge like 1 Matic, you’re going to run out of testnet funds very quickly. You can charge anything when running locally, but be careful when you’re on a real test network.* 

As for the rest, we added three things:

- `import { StringUtils }` - we are importing a helper file. I’ll go over this shortly.
- A public string called `tld` - this will record what your epic domain ends with (ex. `.ninja`).
- `string memory _tld` in the constructor - the constructor runs only once! This is how we’re setting the public `tld` variable.

For the new import - get [this file](https://gist.github.com/AlmostEfficient/669ac250214f30347097a1aeedcdfa12) and put it in a new folder called “libraries” in the contracts folder. Strings in Solidity are weird so we need a custom function to check their length. This function converts them to bytes first, making it much more gas efficient! Yay for savings!

The `tld` string and constructor changes are pretty straightforward. We’ll use this string later. 

![https://i.imgur.com/1lZJzfa.png](https://i.imgur.com/1lZJzfa.png)

Our contract is ready to get paid. Now we take money from everyone who wants our awesome domains. Ready for the most amazing payment experience you’ll ever build? 

You know the drill - let’s head to our `run.js` and update it like this:

```jsx
const main = async () => {
  const domainContractFactory = await hre.ethers.getContractFactory('Domains');
  // We pass in "ninja" to the constructor when deploying
  const domainContract = await domainContractFactory.deploy("ninja");
  await domainContract.deployed();

  console.log("Contract deployed to:", domainContract.address);

  // We're passing in a second variable - value. This is the moneyyyyyyyyyy
  let txn = await domainContract.register("mortal",  {value: hre.ethers.utils.parseEther('0.1')});
  await txn.wait();

  const address = await domainContract.getAddress("mortal");
  console.log("Owner of domain mortal:", address);

  const balance = await hre.ethers.provider.getBalance(domainContract.address);
  console.log("Contract balance:", hre.ethers.utils.formatEther(balance));
}

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

So what are we actually doing here?

I want the end of all registered domains to be `.ninja`. This means we need to pass in `ninja` to our deploy function to initial our `tld` property! Next, to register a domain, we need to actually call our register function. Remember this takes in two arguments:

- The domain you want to register
- **The price of the domain (including gas) in Matic**

We use a special `parseEther` function because units [work differently in Solidity](https://docs.soliditylang.org/en/v0.8.14/units-and-global-variables.html#units-and-globally-available-variables). This will send 0.1 Matic from my wallet to the contract as payment. Once that happens, the domain will be minted to my wallet address.

**BOOM. That’s it.** That’s how easy it is taking payments with smart contracts! No silly payment processors, signups, random credit card fees. One line of code. EZPZ.

Go ahead and run your script! Once you do that you should see something a little like this:

![https://i.imgur.com/nLCRCKl.png](https://i.imgur.com/nLCRCKl.png)

**LETS GO**. With just this simple contract code, we were essentially able to get the main actions of our ENS ready to go !! Take a moment to appreciate the hype here - it’s incredible 🥲.

It doesn’t stop here though - we are about to make this domain 10x cooler with some NFTs 👀.

### 💎 Non Fungible Domains

We’re going to be doing something magical here - turning our domain mappings into **✨NFTs ✨**! 

If you head to OpenSea today and you own an ENS domain, you can actually see something like this:

![https://i.imgur.com/fs9TVN5.png](https://i.imgur.com/fs9TVN5.png)

We’re going to do the exact same thing! You might be thinking - why do we need to make our domains NFTs? What’s the point? 

Well, if you think about traditional web2 domains, they're already NFTs. There can only ever be one domain for each name. Multiple people can't own the same domain. When you buy a domain, you actually own and control the only copy on the entire internet! So we're just bringing that over, but even better cause you can trade/transfer these very easily.

At the end of the day, your ENS domain is just a token right? Let’s go ahead and solidify our domain on the blockchain forever with an NFT 🤘

Before we dive into the code let’s go over what we are actually going to do here:

1. Use a contract from OpenZeppelin to easily mint ERC721 tokens
2. Create SVGs for our NFT and use on chain storage
3. Setup token metadata (the data the NFT will hold)
4. Mint it!

At the end of the day - **we want to take our newly registered domain and create an NFT out of it.**

This is all the code changes we need right now. This will be explained step by step right after:

```jsx
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

// We first import some OpenZeppelin Contracts.
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {StringUtils} from "./libraries/StringUtils.sol";
// We import another help function
import "@openzeppelin/contracts/utils/Base64.sol";

import "hardhat/console.sol";

// We inherit the contract we imported. This means we'll have access
// to the inherited contract's methods.
contract Domains is ERC721URIStorage {
  // Magic given to us by OpenZeppelin to help us keep track of tokenIds.
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  string public tld;
  
  // We'll be storing our NFT images on chain as SVGs
  string svgPartOne = '<svg xmlns="http://www.w3.org/2000/svg" width="270" height="270" fill="none"><path fill="url(#B)" d="M0 0h270v270H0z"/><defs><filter id="A" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse" height="270" width="270"><feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity=".225" width="200%" height="200%"/></filter></defs><path d="M72.863 42.949c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-10.081 6.032-6.85 3.934-10.081 6.032c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-8.013-4.721a4.52 4.52 0 0 1-1.589-1.616c-.384-.665-.594-1.418-.608-2.187v-9.31c-.013-.775.185-1.538.572-2.208a4.25 4.25 0 0 1 1.625-1.595l7.884-4.59c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v6.032l6.85-4.065v-6.032c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595L41.456 24.59c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-14.864 8.655a4.25 4.25 0 0 0-1.625 1.595c-.387.67-.585 1.434-.572 2.208v17.441c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l10.081-5.901 6.85-4.065 10.081-5.901c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v9.311c.013.775-.185 1.538-.572 2.208a4.25 4.25 0 0 1-1.625 1.595l-7.884 4.721c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-7.884-4.59a4.52 4.52 0 0 1-1.589-1.616c-.385-.665-.594-1.418-.608-2.187v-6.032l-6.85 4.065v6.032c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l14.864-8.655c.657-.394 1.204-.95 1.589-1.616s.594-1.418.609-2.187V55.538c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595l-14.993-8.786z" fill="#fff"/><defs><linearGradient id="B" x1="0" y1="0" x2="270" y2="270" gradientUnits="userSpaceOnUse"><stop stop-color="#cb5eee"/><stop offset="1" stop-color="#0cd7e4" stop-opacity=".99"/></linearGradient></defs><text x="32.5" y="231" font-size="27" fill="#fff" filter="url(#A)" font-family="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif" font-weight="bold">';
  string svgPartTwo = '</text></svg>';

  mapping(string => address) public domains;
  mapping(string => string) public records;

  constructor(string memory _tld) payable ERC721("Ninja Name Service", "NNS") {
    tld = _tld;
    console.log("%s name service deployed", _tld);
  }

  function register(string calldata name) public payable {
    require(domains[name] == address(0));

    uint256 _price = price(name);
    require(msg.value >= _price, "Not enough Matic paid");
    
    // Combine the name passed into the function  with the TLD
    string memory _name = string(abi.encodePacked(name, ".", tld));
    // Create the SVG (image) for the NFT with the name
    string memory finalSvg = string(abi.encodePacked(svgPartOne, _name, svgPartTwo));
    uint256 newRecordId = _tokenIds.current();
    uint256 length = StringUtils.strlen(name);
    string memory strLen = Strings.toString(length);

    console.log("Registering %s.%s on the contract with tokenID %d", name, tld, newRecordId);

    // Create the JSON metadata of our NFT. We do this by combining strings and encoding as base64
    string memory json = Base64.encode(
        abi.encodePacked(
            '{'
                '"name": "', _name,'", '
                '"description": "A domain on the Funk name service", '
                '"image": "data:image/svg+xml;base64,', Base64.encode(bytes(finalSvg)), '", '
                '"length": "', strLen, '"'
            '}'
        )
    );

    string memory finalTokenUri = string( abi.encodePacked("data:application/json;base64,", json));

    console.log("\n--------------------------------------------------------");
    console.log("Final tokenURI", finalTokenUri);
    console.log("--------------------------------------------------------\n");

    _safeMint(msg.sender, newRecordId);
    _setTokenURI(newRecordId, finalTokenUri);
    domains[name] = msg.sender;

    _tokenIds.increment();
  }

  // We still need the price, getAddress, setRecord and getRecord functions, they just don't change
}
```

*Note: We still need the `price`, `getAddress`, `setRecord` *and* `getRecord` *functions, they’re just unchanged so I removed them to keep this short. MAKE SURE YOU DON'T FORGET THEM!* 

This might seem overwhelming. Worry not, young padawan! I’m the Kenobi to your Skywalker (just pls don't betray me like in the movies, ty). Let’s take it from the top:

```solidity
// We first import some OpenZeppelin Contracts.
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// We import more another help function
import "@openzeppelin/contracts/utils/Base64.sol";

contract Domains is ERC721URIStorage {
```

Just like with `StringUtils`, we’re importing existing contracts. This time we’re importing them from OpenZeppelin. Then we “inherit” them using `ERC721URIStorage` when we declare the domains contract. You can read more about inheritance [here](https://solidity-by-example.org/inheritance/), but basically, it means we can call other contracts from ours. It's almost like importing functions for us to use!

So what do we get from this?

We are able to mint NFTs using the standard known as `ERC721` which you can read more about [here](https://eips.ethereum.org/EIPS/eip-721). OpenZeppelin essentially implements the NFT standard for us and then lets us write our own logic on top of it to customize it. That means we don't need to write boilerplate code. It would be crazy to write a HTTP server from scratch without using a library, right? Similarly — it'd be crazy to just write an NFT contract from complete scratch! 

As for `Base64` - it has some helper functions created by someone else to help us convert the SVG used for our NFT image and the JSON for its metadata to `Base64` in Solidity.

```solidity
using Counters for Counters.Counter;
Counters.Counter private _tokenIds;
```

Next, at the top of your contract, you’ll see `counters`. Wtf? Why do we need a library to count stuff? We don’t **need** one, it’s just better to import one that is gas efficient and built for NFTs.

We're going to be using `_tokenIds` to keep track of the NFTs unique identifier. It's a number that's automatically initialized to 0 when we declare `private _tokenIds`. 

So, when we first call `register` , `newRecordId` is 0. When we run it again, `newRecordId`will be 1, and so on! Remember, `_tokenIds` is a **state variable** which means if we change it, the value is stored on the contract directly.

```solidity
constructor(string memory _tld) payable ERC721("Ninja Name Service", "NNS") {
  tld = _tld;
  console.log("%s name service deployed", _tld);
}
```

At this point we are telling our contract to bring in all the ERC721 contract info we want to inherit! The only thing we need to provide are:

- the NFT Collection’s Name, I called mine `Ninja Name Service`.
- the NFT’s Symbol, I called mine `NNS`.

This is your time to shine! Make sure to change this to whatever you want :)

Now we’re going to design our NFT. This is a very important part of your app. The NFT is what everyone will see in their wallets and on OpenSea. It needs to be really frickin awesome! We're actually going to be storing our NFTs on the Polygon blockchain itself. A lot of NFTs are just links that point to an image hosting service. If these services go down, your NFT no longer has an image! By putting it on the blockchain, it becomes permanent.

To do this, we're going to use an SVG - an image that is built with code. Here's the SVG code for a square box with a gradient, the Polygon logo, and our domain text:

```html
<svg xmlns="http://www.w3.org/2000/svg" width="270" height="270" fill="none">
	<path fill="url(#B)" d="M0 0h270v270H0z"/>
		<defs>
			<filter id="A" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse" height="270" width="270">
				<feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity=".225" width="200%" height="200%"/>
			</filter>
		</defs>
	<path d="M72.863 42.949c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-10.081 6.032-6.85 3.934-10.081 6.032c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-8.013-4.721a4.52 4.52 0 0 1-1.589-1.616c-.384-.665-.594-1.418-.608-2.187v-9.31c-.013-.775.185-1.538.572-2.208a4.25 4.25 0 0 1 1.625-1.595l7.884-4.59c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v6.032l6.85-4.065v-6.032c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595L41.456 24.59c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-14.864 8.655a4.25 4.25 0 0 0-1.625 1.595c-.387.67-.585 1.434-.572 2.208v17.441c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l10.081-5.901 6.85-4.065 10.081-5.901c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v9.311c.013.775-.185 1.538-.572 2.208a4.25 4.25 0 0 1-1.625 1.595l-7.884 4.721c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-7.884-4.59a4.52 4.52 0 0 1-1.589-1.616c-.385-.665-.594-1.418-.608-2.187v-6.032l-6.85 4.065v6.032c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l14.864-8.655c.657-.394 1.204-.95 1.589-1.616s.594-1.418.609-2.187V55.538c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595l-14.993-8.786z" fill="#fff"/>
	<defs>
		<linearGradient id="B" x1="0" y1="0" x2="270" y2="270" gradientUnits="userSpaceOnUse">
			<stop stop-color="#cb5eee"/><stop offset="1" stop-color="#0cd7e4" stop-opacity=".99"/>
		</linearGradient>
	</defs>
	<text x="32.5" y="231" font-size="27" fill="#fff" filter="url(#A)" font-family="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif" font-weight="bold">
		mortal.ninja
	</text>
</svg>
```

Kind of looks like an HTML file, yeah? You don’t need to know how to ***write*** SVGs. There are lots of tools that will let you make them for free. I used Figma to make this one. 

Head to [this](https://www.svgviewer.dev/) website and paste in the code above to see it. Feel free to mess around with it.

This is really cool because it lets us create **images with code**.

SVGs can be customized **a lot.** You can even animate them lol. Feel free to read up more on them [here](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial). Once you’re done with your NFT, make sure you hit “optimize on the SVGViewer website. That will compress them so they fit in your contract.

**SICK**. I have been jamming to the Mortal Kombat theme song so this is what my final NFT looks like 😎:

![https://i.imgur.com/epYuKfc.png](https://i.imgur.com/epYuKfc.png)

Make sure you customise your SVG! Maybe you want a rainbow emoji instead of the polygon logo. If you’re so bold - you could even try an animated SVG 👀 

Just be aware that **contracts have a length limit**! 

Don’t make an incredibly complex SVG that is super duper long. The way ENS does it is they generate the SVG using a web server at the time of registration and store it off-chain. You can do something similar!

```solidity
  string svgPartOne = '<svg xmlns="http://www.w3.org/2000/svg" width="270" height="270" fill="none"><path fill="url(#B)" d="M0 0h270v270H0z"/><defs><filter id="A" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse" height="270" width="270"><feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity=".225" width="200%" height="200%"/></filter></defs><path d="M72.863 42.949c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-10.081 6.032-6.85 3.934-10.081 6.032c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-8.013-4.721a4.52 4.52 0 0 1-1.589-1.616c-.384-.665-.594-1.418-.608-2.187v-9.31c-.013-.775.185-1.538.572-2.208a4.25 4.25 0 0 1 1.625-1.595l7.884-4.59c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v6.032l6.85-4.065v-6.032c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595L41.456 24.59c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-14.864 8.655a4.25 4.25 0 0 0-1.625 1.595c-.387.67-.585 1.434-.572 2.208v17.441c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l10.081-5.901 6.85-4.065 10.081-5.901c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v9.311c.013.775-.185 1.538-.572 2.208a4.25 4.25 0 0 1-1.625 1.595l-7.884 4.721c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-7.884-4.59a4.52 4.52 0 0 1-1.589-1.616c-.385-.665-.594-1.418-.608-2.187v-6.032l-6.85 4.065v6.032c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l14.864-8.655c.657-.394 1.204-.95 1.589-1.616s.594-1.418.609-2.187V55.538c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595l-14.993-8.786z" fill="#fff"/><defs><linearGradient id="B" x1="0" y1="0" x2="270" y2="270" gradientUnits="userSpaceOnUse"><stop stop-color="#cb5eee"/><stop offset="1" stop-color="#0cd7e4" stop-opacity=".99"/></linearGradient></defs><text x="32.5" y="231" font-size="27" fill="#fff" filter="url(#A)" font-family="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif" font-weight="bold">';
  string svgPartTwo = '</text></svg>';
```

This looks a bit funny. Basically, all we’re doing here is creating an SVG based on our domain. We split the SVG into two and put our domain in between them.

```solidity
string memory _name = string(abi.encodePacked(name, ".", tld));
string memory finalSvg = string(abi.encodePacked(svgPartOne, _name, svgPartTwo));
```

Let’s take a quick look at this `abi.encodePacked` thing.

Remember how I said strings in Solidity are weird? Well, you also can’t combine strings directly. Instead, you have to use the `encodePacked` function to turn a bunch of strings into bytes and then combines them!

```jsx
string(abi.encodePacked(svgPartOne, _name, svgPartTwo))
```

This is the magic line where we actually combine the SVG code w/ our domain. It’s like doing `<svg>my domain</svg>`. Once you see this contract run, this will make a ton more sense! 

Now that we have a sick asset that will show off our domain, let’s go deeper into the register function to see how our metadata is being constructed.

```solidity
function register(string calldata name) public payable {
  require(domains[name] == address(0));

  uint256 _price = price(name);
  require(msg.value >= _price, "Not enough Matic paid");
  
  string memory _name = string(abi.encodePacked(name, ".", tld));
  string memory finalSvg = string(abi.encodePacked(svgPartOne, _name, svgPartTwo));
  uint256 newRecordId = _tokenIds.current();
  uint256 length = StringUtils.strlen(name);
  string memory strLen = Strings.toString(length);

  console.log("Registering %s on the contract with tokenID %d", name, newRecordId);

  string memory json = Base64.encode(
        abi.encodePacked(
            '{'
                '"name": "', _name,'", '
                '"description": "A domain on the Funk name service", '
                '"image": "data:image/svg+xml;base64,', Base64.encode(bytes(finalSvg)), '", '
                '"length": "', strLen, '"'
            '}'
        )
    );

  string memory finalTokenUri = string( abi.encodePacked("data:application/json;base64,", json));
    
  console.log("\n--------------------------------------------------------");
  console.log("Final tokenURI", finalTokenUri);
  console.log("--------------------------------------------------------\n");

  _safeMint(msg.sender, newRecordId);
  _setTokenURI(newRecordId, finalTokenUri);
  domains[name] = msg.sender;

  _tokenIds.increment();
}
```

You actually already know like half of this! The only things we haven’t covered are the use of `_tokenIds` and the `json` thingy. 

For `json` -- NFTs use JSON to store details like the name, description, attributes and the media. What we’re doing with `json` is combining strings with `abi.encodePacked` to make a JSON object. We’re then encoding it as a Base64 string before setting it as the token URI.

All you need to know about `_tokenIds` is that it’s an object that lets us access and set our NFT’s unique token number. Each NFT has a unique `id` and this helps us make sure of that. The two lines below are the magical lines that actually create our NFT.

```jsx
// Mint the NFT to newRecordId
_safeMint(msg.sender, newRecordId);

// Set the NFTs data -- in this case the JSON blob w/ our domain's info!
_setTokenURI(newRecordId, finalTokenUri);
```

I added a console log that will print the `finalTokenUri` to the console. If you take one of the `data:application/json;base64` blobs and drop it in your browser address bar, you'll see all the JSON metadata!

### 🥸 Mint an NFT domain locally

Holy cow. We are ready to run our contract! Everything seems to be in order for us to generate a spicy domain NFT and mint it on our local blockchain!

You can just run `npx hardhat run scripts/run.js` to get going. The big difference is what the console outputs. Here’s what mine looks like (I shortened the URI for this screenshot):

![https://i.imgur.com/nOpI3oD.png](https://i.imgur.com/nOpI3oD.png)

If you copy the `tokenURI` and paste it in the browser, you’ll see a JSON object. If you paste the image blob inside the JSON object in another tab, you’ll get your NFT image!

![https://i.imgur.com/UDQC0Wn.png](https://i.imgur.com/UDQC0Wn.png)

### 🚨Progress report

TAKE A BREATH.

PAT YOURSELF ON THE BACK.

YOU JUST MADE A DOMAIN SERVICE.

AND YOU’RE DYNAMICALLY GENERATING SVGS ON-CHAIN.

AND YOU’RE CAPTURING PAYMENTS ON POLYGON.

**This is tough stuff. Way to go!**

Post a screenshot of your awesome custom NFT-domain in #progress and maybe even tweet it out to show people what you’re up to — be sure to tag `@_buildspace` ;) 
