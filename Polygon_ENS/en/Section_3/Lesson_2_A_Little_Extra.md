### 🦴 Fetch all domains

Alright - things are definitely taking shape right now. There is still a bit more we can do to make our contract even better and optimize it for our frontend, such as having a super easy way to fetch all minted domains — maybe we want to show off all the epic domains that have already been minted!!

The cool part about this is we can easily return this data from our smart contract! The best part - read transactions on the blockchain are free 🤑. So, we don’t have to worry about paying gas fees!

Take a look at this logic to see how we can do this:

```solidity
// Add this at the top of your contract next to the other mappings
mapping (uint => string) public names;

// Add this anywhere in your contract body
function getAllNames() public view returns (string[] memory) {
  console.log("Getting all names from contract");
  string[] memory allNames = new string[](_tokenIds.current());
  for (uint i = 0; i < _tokenIds.current(); i++) {
    allNames[i] = names[i];
    console.log("Name for token %d is %s", i, allNames[i]);
  }

  return allNames;
}
```

Pretty simple, right? You are a Solidity pro now so this should feel pretty familiar to what we did before!

We added a mapping to store mint IDs with domain names and a `view` function to iterate through all those names and put them in a list to send to us. There’s one bit missing though! We still need to set the mapping data! 

Add this to the bottom of your `register` function, right before the `_tokenIds.increment()`:

```solidity
names[newRecordId] = name;
```

Just like that you are able to retrieve all the domains minted on your contract 🤘

### 💔 Check domain validity on the contract

One thing that has probably been on your mind is - “Raza this is cool and all, but what happens if someone tries to mint a domain that is **really** long? Thats lame af 👎”

WELP - you’d be right! That is super lame. Right now, we’re checking if a domain is valid using JavaScript in our React app. This isn’t the best of ideas since someone can interact with our contract directly to mint an invalid domain! 

It actually makes more sense to do this on our contract:

```solidity
function valid(string calldata name) public pure returns(bool) {
  return StringUtils.strlen(name) >= 3 && StringUtils.strlen(name) <= 10;
}
```

Just like we were doing in our React app, we need to check if the domain name is between 3-10 characters (this is to help keep domain names short and clean). You should set this up to be whatever you want! Maybe you don’t like the letter W? For invalid names, you just need to return a `false`. Try to add all other sorts of blocks you can think of :)

### 🤬 Custom errors

One of the coolest things added in a recent version of Solidity is the ability to use custom error messages. These are really useful because you don’t need to repeat error message strings and, more importantly, they help us save gas when deploying! Cause who wants to spend more on gas? Creating them is super simple:

```solidity
error Unauthorized();
error AlreadyRegistered();
error InvalidName(string name);
```

You can put them anywhere! To use them:

```solidity
function setRecord(string calldata name, string calldata record) public {
  if (msg.sender != domains[name]) revert Unauthorized();
  records[name] = record;
}

function register(string calldata name) public payable {
  if (domains[name] != address(0)) revert AlreadyRegistered();
  if (!valid(name)) revert InvalidName(name);
  // Rest of register function remains unchanged
}
```

That’s it! If you deploy this contract, you’ll be doing a whole lot more than before. Don't forget to copy and paste your new contract address and contract ABI
to your React application!

Look at you, saving gas, being efficient, and checking domain validity on the blockchain. What’s next? Are you gonna **upgrade** your smart contracts? LOL

### 🚨Progress report

Post a screenshot of your fantastic, gas-efficient, error-handling smart contract in `#progress`!
