### 💽 Storing domain data on-chain

From here, let's add some fanciness to our contract.

The whole point of a name service is to help direct people to your place on the internet! Just like you type in [`google.com`](http://google.com) to get to Google, people will be able to use your name service to go to wherever they want! This is where we’ll do that. Users are going to send us a name and we’re going to give them a domain for that name! 

So, first thing we need is a function they can hit to register their domain and a place to store their names:

```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.10;

import "hardhat/console.sol";

contract Domains {
  // A "mapping" data type to store their names
  mapping(string => address) public domains;

  constructor() {
      console.log("THIS IS MY DOMAIN CONTRACT. NICE.");
  }

  // A register function that adds their names to our mapping
  function register(string calldata name) public {
      domains[name] = msg.sender;
      console.log("%s has registered a domain!", msg.sender);
  }

  // This will give us the domain owners' address
  function getAddress(string calldata name) public view returns (address) {
      return domains[name];
  }
}
```

Boom!

We added a few functions here, but also the `domains` [mapping](https://docs.soliditylang.org/en/v0.8.14/types.html#mapping-types) variable! A mapping is a simple data type that “maps” two values. In our case, we’re matching a string (domain name) to a wallet address. 

This variable is special because it's called a "state variable" and it's cool because it is stored **permanently** in the contract’s storage. Meaning anyone who calls the register function will permanently store data related to their domain right on our contract.

We also use some magic here with `msg.sender`. This is the wallet address of the person who called the function. This is awesome! It's like built-in authentication. We know exactly who called the function because in order to even call a smart contract function, you need to sign the transaction with a valid wallet!

In the future, we can write functions that only certain wallet addresses can hit. For example, we can change this function so that only wallets that own domains can update them. 

The `getAddress` function does exactly that - **it gets the wallet address of a domain owner**. You’ll notice a bunch of things in the function definition, so let’s take a look at those:

- `calldata` - this indicates the “location” of where the `name` argument should be stored. Since it costs real money to process data on the blockchain, Solidity lets you indicate where reference types should be stored. `calldata` is non-persistent and can’t be modified. We like this because it takes the least amount of gas!
- `public` - this is a visibility modifier. We want our function to be accessible by everyone, including other contracts.
- `view` -  this just means that the function is only viewing data on the contract, not modifying it.
- `returns (address)` - the function returns the domain owner's wallet address as the native Solidity address type. ezpz.

### ✅ Updating run.js to call our functions

It’s time to run again, but `run.js` needs to change before we do that! Now that we have some functions to call,  we can use `run.js` to manually test them out! Remember, `run.js` is our playground :).

When we deploy our contract to the blockchain (which we do when we run `domainContractFactory.deploy()`) our functions become available to be called on the blockchain because we used that special **public** keyword on our function.

Think of this like a public API endpoint!

So now we want to test those functions specifically!

```jsx
const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const domainContractFactory = await hre.ethers.getContractFactory('Domains');
  const domainContract = await domainContractFactory.deploy();
  await domainContract.deployed();
  console.log("Contract deployed to:", domainContract.address);
  console.log("Contract deployed by:", owner.address);
  
  const txn = await domainContract.register("doom");
  await txn.wait();

  const domainOwner = await domainContract.getAddress("doom");
  console.log("Owner of domain:", domainOwner);
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

**VSCode might auto-import `ethers`. We don't need to import `ethers`. So, make sure you have no imports. Remember, what we talked about last lesson about hre?**

### 🤔 How does it work?

```jsx
const [owner, randomPerson] = await hre.ethers.getSigners();
```

In order to deploy something to the blockchain, we need to have a wallet address! Hardhat does this for us magically in the background, but here I grabbed the wallet address of the contract owner and I also grabbed a random wallet address and called it `randomPerson`. This will make more sense in a moment.
I also added:

```jsx
console.log("Contract deployed by:", owner.address);
```

I'm doing this just to see the address of the person deploying our contract.

The last thing I added was this:

```jsx
const txn = await domainContract.register("doom");
await txn.wait();

const domainOwner = await domainContract.getAddress("doom");
console.log("Owner of domain:", domainOwner);
```

Just like before, lets manually call our new functions!

First I call the function to register the name “doom”. Then I call the `getAddress` function to return the owner of that domain. It’s wild how simple this was right?

Nice. Let’s run this then shall we? Run the script like you would normally:

```bash
npx hardhat run scripts/run.js
```

Here's my output:

![https://i.imgur.com/aOfyP0N.png](https://i.imgur.com/aOfyP0N.png)

**THIS IS WILD.** You’re registering domains on the **✨ blockchain ✨**

### 🎯 Storing records

Very nice! So, we now have a way to register domains on our smart contract! We now need a way to have that domain point to some data for us! At the end of the day, thats what a domain does right? Its a thing that points to something else, for example reddit.com points to Reddit’s servers.

**Think about this as your domain’s DNS settings. You know how you can go to Namecheap or Cloudflare and customize the DNS records associated w/ that domain? Same thing here. We’re building our DNS record system.**

With ENS, you can store a bunch of different stuff, like I showed previously. To complete the “Name Service” part of our app, we’re going to add records to each domain. This means we’ll connect each name to a value, sort of like a database. These values can be anything - wallet addresses, secret encrypted messages, Spotify links, the IP address to our servers, whatever you want!

I’m gonna go with strings cause I’ve been told I talk a lot, and now I want to talk on-chain. Here’s what my updated contract looks like:

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "hardhat/console.sol";

contract Domains {
  mapping(string => address) public domains;
  
  // Checkout our new mapping! This will store values
  mapping(string => string) public records;

  constructor() {
      console.log("Yo yo, I am a contract and I am smart");
  }

  function register(string calldata name) public {
      // Check that the name is unregistered (explained in notes)
      require(domains[name] == address(0));
      domains[name] = msg.sender;
      console.log("%s has registered a domain!", msg.sender);
  }

  function getAddress(string calldata name) public view returns (address) {
      return domains[name];
  }

  function setRecord(string calldata name, string calldata record) public {
      // Check that the owner is the transaction sender
      require(domains[name] == msg.sender);
      records[name] = record;
  }

  function getRecord(string calldata name) public view returns(string memory) {
      return records[name];
  }
}
```

Yup. It’s another mapping. The only new things here are the `require` statements. These are to stop other people from taking your domain or changing the record. Imagine if you had ordered a happy meal from McDonalds and someone changed your order to an Egg McMuffin. 😠

That’s what is happening here in your contract! If the require logic fails the transaction is **reverted,** meaning that blockchain data doesn’t change. 

Let’s take a look at these requires:

```solidity
require(domains[name] == address(0));
```

Here we’re checking that the address of the domain you’re trying to register is the same as the zero address. The zero address in Solidity is sort of like the void (in the literal sense) where everything comes from. When an address mapping is initialized, all entries in it point to the zero address. So if a domain hasn’t been registered, it’ll point to the zero address!

```solidity
require(domains[name] == msg.sender);
```

This one’s pretty easy - check that the transaction sender is the address that owns the domain. We don’t want to let *anyone* set our domain records.

### 🤝 Test other users

Alright - it’s time to test this thing out! It would be pretty boring if we could only send and register a domain!! We want everyone to use our domains :).

Check this out - I added a few lines at the bottom of the function. I'm not going to explain it much (but please ask questions in #general-chill-chat). Basically this is how we can simulate other people hitting our functions :).

```jsx
const main = async () => {
  // The first return is the deployer, the second is a random account
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const domainContractFactory = await hre.ethers.getContractFactory('Domains');
  const domainContract = await domainContractFactory.deploy();
  await domainContract.deployed();
  console.log("Contract deployed to:", domainContract.address);
  console.log("Contract deployed by:", owner.address);

  let txn = await domainContract.register("doom");
  await txn.wait();

  const domainAddress = await domainContract.getAddress("doom");
  console.log("Owner of domain doom:", domainAddress);

  // Trying to set a record that doesn't belong to me!
  txn = await domainContract.connect(randomPerson).setRecord("doom", "Haha my domain now!");
  await txn.wait();
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

The newest items added to this code block are:

```jsx
txn = await domainContract.connect(randomPerson).setRecord("doom", "Haha my domain now!");
await txn.wait();
```

**Running this script will give you an error! WE WANT AN ERROR.** That’s because we’re trying to set a record for a domain that isn’t ours. Now we know our require statements work. Nice. 

### 🚨 Before you click "Next Lesson"

*Note: if you don't do this, Raza will be very sad :(*

Customize your code a little!! Feel free to play around with the contract and `run.js` file and register multiple domains and set all sorts of records. Maybe you want people to map their domain to their email address — so `raza.mycustomdomain` would map to my email. Or maybe you want people to be able to add the IP address of their personal website as a record. You could even have the domain map to an SVG of the persons favorite meme lol. 

Whatever you want! The supported data types are the limit! 

Even if you just change up the variable names and function names to be something you think is interesting that's a big deal. Try to not straight up copy me! Think of your final website and the kind of functionality you want. Build the functionality **you want**.

Once you're all done here, be sure to post a screenshot of your terminal output in #progress.
