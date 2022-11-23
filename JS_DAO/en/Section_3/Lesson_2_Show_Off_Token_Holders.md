### 🥺 Retrieve token holders on web app

It would be nice for all the members of our DAO to easily see all the people in the DAO who hold tokens along with how many tokens they hold. To do that, we’ll need to actually call our smart contracts from our client and retrieve that data.

Head over to `App.jsx`, then under `editionDrop`, add in your `token`.

```jsx
// Initialize our token contract
const { contract: token } = useContract('INSERT_TOKEN_ADDRESS', 'token');
```

We need this so we can interact with both of our ERC-1155 contract and our ERC-20 contract. From the ERC-1155, we’ll get all our members' addresses. From the ERC-20, we’ll retrieve the # of tokens each member has.

Next, add the following code under `const hasClaimedNFT...`:

```jsx
// Holds the amount of token each member has in state.
const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
// The array holding all of our members addresses.
const [memberAddresses, setMemberAddresses] = useState([]);

// A fancy function to shorten someones wallet address, no need to show the whole thing.
const shortenAddress = (str) => {
  return str.substring(0, 6) + '...' + str.substring(str.length - 4);
};

// This useEffect grabs all the addresses of our members holding our NFT.
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }

  // Just like we did in the 7-airdrop-token.js file! Grab the users who hold our NFT
  // with tokenId 0.
  const getAllAddresses = async () => {
    try {
      const memberAddresses = await editionDrop?.history.getAllClaimerAddresses(
        0,
      );
      setMemberAddresses(memberAddresses);
      console.log('🚀 Members addresses', memberAddresses);
    } catch (error) {
      console.error('failed to get member list', error);
    }
  };
  getAllAddresses();
}, [hasClaimedNFT, editionDrop?.history]);

// This useEffect grabs the # of token each member holds.
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }

  const getAllBalances = async () => {
    try {
      const amounts = await token?.history.getAllHolderBalances();
      setMemberTokenAmounts(amounts);
      console.log('👜 Amounts', amounts);
    } catch (error) {
      console.error('failed to get member balances', error);
    }
  };
  getAllBalances();
}, [hasClaimedNFT, token?.history]);

// Now, we combine the memberAddresses and memberTokenAmounts into a single array
const memberList = useMemo(() => {
  return memberAddresses.map((address) => {
    // We're checking if we are finding the address in the memberTokenAmounts array.
    // If we are, we'll return the amount of token the user has.
    // Otherwise, return 0.
    const member = memberTokenAmounts?.find(({ holder }) => holder === address);

    return {
      address,
      tokenAmount: member?.balance.displayValue || '0',
    };
  });
}, [memberAddresses, memberTokenAmounts]);
```

Looks like a lot at first! But just know we’re doing three things:

1. We’re calling `getAllClaimerAddresses` to get all the addresses of our members who hold an NFT from our ERC-1155 contract.

2. We’re calling `getAllHolderBalances` to get the token balances of everyone who holds our token on our ERC-20 contract.

3. We’re combining the data into `memberList` which is one nice array that combines both the member’s address and their token balance. Feel free to check out what `useMemo` does [here](https://reactjs.org/docs/hooks-reference.html#usememo). It’s a fancy way in React to store a computed variable.

Now, you may be asking yourself, “Can’t we just do `getAllHolderBalances` to grab everyone that holds our token?”. Well, basically, someone can be in our DAO and hold zero token! _And, that’s okay._ So still want them to show up on the list.

In my console, I get something like this where I am now successfully retrieving data from both of my contracts — the ERC-20 and my ERC-1155. Hell yes!! Feel free to mess around here and check out all the data.

![Untitled](https://i.imgur.com/qx8rfRZ.png)

### 🤯 Render member data on DAO Dashboard

Now that we have all the data held nicely in our React app’s state, let’s render it.

**Replace** `if (hasClaimedNFT) { }` with the following:

```jsx
// If the user has already claimed their NFT we want to display the internal DAO page to them
// only DAO members will see this. Render all the members + token amounts.
if (hasClaimedNFT) {
  return (
    <div className="member-page">
      <h1>🍪DAO Member Page</h1>
      <p>Congratulations on being a member</p>
      <div>
        <div>
          <h2>Member List</h2>
          <table className="card">
            <thead>
              <tr>
                <th>Address</th>
                <th>Token Amount</th>
              </tr>
            </thead>
            <tbody>
              {memberList.map((member) => {
                return (
                  <tr key={member.address}>
                    <td>{shortenAddress(member.address)}</td>
                    <td>{member.tokenAmount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
```

Pretty straightforward! We’re just rendering a nice little table that will show off data in our `memberList`. Once you check out your page, you’ll see something like the screenshot below! _Note: the centering is off, this was purposely done. We're going to add something else later!_

![Untitled](https://i.imgur.com/HZCHFak.png)

Epic. We now have a place for all our members to see other members on an internal, token-gated DAO dashboard. Awesome :).

### 🚨 Progress Report

_Please do this or Farza will be sad :(._

Go ahead and share a screenshot in `#progress` of your internal DAO dashboard showing off your current members + their token values!
