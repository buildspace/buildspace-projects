Alright! You’ve deployed a fancy domain smart contract, shipped a sick React application that lets people mint your domains, and now the money is pouring in. Time to buy a Bored Ape and post memes on Twitter all day!

But wait - you can’t just yet! Not because Twitter is harmful in those doses, but because you didn’t create a way to withdraw your funds! How do you get access to the money people are paying for the domains?

### 👻 Function modifiers and the withdraw function

Let’s fix that. Heading back over to our contract, let’s add the following at the bottom:

```solidity
modifier onlyOwner() {
  require(isOwner());
  _;
}

function isOwner() public view returns (bool) {
  return msg.sender == owner;
}

function withdraw() public onlyOwner {
  uint amount = address(this).balance;
  
  (bool success, ) = msg.sender.call{value: amount}("");
  require(success, "Failed to withdraw Matic");
} 
```

You probably are experiencing an error right now. Don’t worry, this is expected! Lets go ahead and break this down a bit:

The first thing we create is a function `modifier`. This allows us to change the behavior of functions. Think of them like a prettier way to implement `require` statements. All our modifier does is require that the `isOwner()` function returns true. If it doesn’t, any function declared with this modifier will fail.

The weird part of it is the `_;` at the end. All it really means is that any function using the modifier should be executed **after** the require. So if `_;` was before the require, the withdraw function would be called first, then the require, which would be kind of useless since it would revert anyway.

As for the `withdraw()` function, all it does is it fetches the balance of the contract and sends it to the requester (which has to be the owner for the function to run). This is a simple way of withdrawing your funds. `msg.sender.call{value: amount}("")` is the magic line where we send money :). The syntax is a little weird! Notice how we pass it `amount`! `require(success` is where we know the transaction was a success :). If it wasn't, it'd mark the transaction as an error and say `"Failed to withdraw Matic"`.

### 🤠 Setting contract owner

Now to fix that pesky `owner` error, all you need to do is create a global `owner` variable at the top of your contract and set in in the constructor, like this:

```solidity
address payable public owner;

constructor(string memory _tld) ERC721 ("Ninja Name Service", "NNS") payable {
  owner = payable(msg.sender);
  tld = _tld;
  console.log("%s name service deployed", _tld);
}
```

The cool thing about this variable is we’ve set it as a `payable` type. This just means that the owner’s address can receive payments. Yup. You need to explicitly declare that. You can read more about it [here](https://solidity-by-example.org/payable/).

Now you can withdraw the funds in the contract! Financial independence here we come! Woohoo! 

### 🏦 Test it out

Let’s try to rob our own contract 😈. I’ll be the getaway driver, you set up the `run.js` script:

```jsx
const main = async () => {
  const [owner, superCoder] = await hre.ethers.getSigners();
  const domainContractFactory = await hre.ethers.getContractFactory('Domains');
  const domainContract = await domainContractFactory.deploy("ninja");
  await domainContract.deployed();

  console.log("Contract owner:", owner.address);

  // Let's be extra generous with our payment (we're paying more than required)
  let txn = await domainContract.register("a16z",  {value: hre.ethers.utils.parseEther('1234')});
  await txn.wait();

  // How much money is in here?
  const balance = await hre.ethers.provider.getBalance(domainContract.address);
  console.log("Contract balance:", hre.ethers.utils.formatEther(balance));

  // Quick! Grab the funds from the contract! (as superCoder)
  try {
    txn = await domainContract.connect(superCoder).withdraw();
    await txn.wait();
  } catch(error){
    console.log("Could not rob contract");
  }

  // Let's look in their wallet so we can compare later
  let ownerBalance = await hre.ethers.provider.getBalance(owner.address);
  console.log("Balance of owner before withdrawal:", hre.ethers.utils.formatEther(ownerBalance));

  // Oops, looks like the owner is saving their money!
  txn = await domainContract.connect(owner).withdraw();
  await txn.wait();
  
  // Fetch balance of contract & owner
  const contractBalance = await hre.ethers.provider.getBalance(domainContract.address);
  ownerBalance = await hre.ethers.provider.getBalance(owner.address);

  console.log("Contract balance after withdrawal:", hre.ethers.utils.formatEther(contractBalance));
  console.log("Balance of owner after withdrawal:", hre.ethers.utils.formatEther(ownerBalance));
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

![https://i.imgur.com/3ieh5KW.png](https://i.imgur.com/3ieh5KW.png)

When you run this script with `npx hardhat run scripts/run.js`, you’ll notice that the catch block after the attempted robbery was triggered, meaning our attempt failed! Whoops.

What’s happening here is when we call the `withdraw()` function as a random person (`superCoder`), the modifier checks that we’re not the owner and reverts the transaction. But when we withdraw as the owner, the tokens come through! If you want, you can log the error in the try catch block to see what the contract says.

### 🚨Progress report

*Please do this else Raza will be sad :(*

Post a screenshot in `#progress` of your console after you try to rob your contract.
