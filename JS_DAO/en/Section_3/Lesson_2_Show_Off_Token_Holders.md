### 🥺 Retrieve token holders on web app.

It would be nice for all the members of our DAO to easily see all the people in the DAO who hold tokens along with how many tokens they hold. To do that, we’ll need to actually call our smart contracts from our client and retrieve that data.

Let’s do it! Head over to `App.jsx`. At the top, import Ethers:

```jsx
import { ethers } from "ethers";
```

Then under `bundleDropModule`, add in your `tokenModule`.

```jsx
const tokenModule = sdk.getTokenModule(
  "INSERT_TOKEN_MODULE_ADDRESS"
);
```

We need this so we can interact with both of our ERC-1155 contract and our ERC-20 contract. From the ERC-1155, we’ll get all our member’s addresses. From the ERC-20, we’ll retrieve the # of tokens each member has.

Next, add the following code under `const [isClaiming, setIsClaiming] = useState(false)`:

```jsx
// Holds the amount of token each member has in state.
const [memberTokenAmounts, setMemberTokenAmounts] = useState({});
// The array holding all of our members addresses.
const [memberAddresses, setMemberAddresses] = useState([]);

// A fancy function to shorten someones wallet address, no need to show the whole thing. 
const shortenAddress = (str) => {
  return str.substring(0, 6) + "..." + str.substring(str.length - 4);
};

// This useEffect grabs all the addresses of our members holding our NFT.
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }
  
  // Just like we did in the 7-airdrop-token.js file! Grab the users who hold our NFT
  // with tokenId 0.
  bundleDropModule
    .getAllClaimerAddresses("0")
    .then((addresses) => {
      console.log("🚀 Members addresses", addresses)
      setMemberAddresses(addresses);
    })
    .catch((err) => {
      console.error("failed to get member list", err);
    });
}, [hasClaimedNFT]);

// This useEffect grabs the # of token each member holds.
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }

  // Grab all the balances.
  tokenModule
    .getAllHolderBalances()
    .then((amounts) => {
      console.log("👜 Amounts", amounts)
      setMemberTokenAmounts(amounts);
    })
    .catch((err) => {
      console.error("failed to get token amounts", err);
    });
}, [hasClaimedNFT]);

// Now, we combine the memberAddresses and memberTokenAmounts into a single array
const memberList = useMemo(() => {
  return memberAddresses.map((address) => {
    return {
      address,
      tokenAmount: ethers.utils.formatUnits(
        // If the address isn't in memberTokenAmounts, it means they don't
        // hold any of our token.
        memberTokenAmounts[address] || 0,
        18,
      ),
    };
  });
}, [memberAddresses, memberTokenAmounts]);
```

Looks like a lot at first! But just know we’re doing three things:

1) We’re calling `getAllClaimerAddresses` to get all the addresses of our members who hold an NFT from our ERC-1155 contract.

2) We’re calling `getAllHolderBalances` to get the token balances of everyone who hold’s our token on our ERC-20 contract.

3) We’re combining the data into `memberList` which is one nice array the combines both the member’s address and their token balance. Feel free to check out what `useMemo` does [here](https://reactjs.org/docs/hooks-reference.html#usememo). It’s a fancy way in React to store a computed variable. 

Now, you may be asking yourself, “Can’t we just do `getAllHolderBalances` to grab everyone that holds our token?”. Well, basically, someone can be in our DAO and hold zero token! *And, that’s okay.* So still want them to show up on the list.

In my console, I get something like this where I am now successfully retrieving data from both of my contracts — the ERC-20 and my ERC-1155. Hell yes!! Feel free to mess around here and check out all the data.

![Untitled](https://i.imgur.com/qx8rfRZ.png)

*Note: you may also see the message “Request-Rate Exceeded” from Ethers in your console. This is fine for now!*

### 🤯 Render member data on DAO Dashboard.

Now, that we have all the data held nicely in our React app’s state, let’s render it.

**Replace** `if (hasClaimedNFT) { }` with the following:

```jsx
// If the user has already claimed their NFT we want to display the interal DAO page to them
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
};
```

Pretty straightforward! We’re just rendering a nice little table that will show off data in our `memberList`. Once you check out your page, you’ll see something like the screenshot below! *Note: the centering is off, this was purposely done. We're going to add something else later!*

![Untitled](https://i.imgur.com/HZCHFak.png)

Epic. We now have a place for all our members to see other members on an internal, token-gated DAO dashboard. Awesome :).

### 🚨 Progress Report

*Please do this or Farza will be sad :(.*

Go ahead and share a screenshot in `#progress` of your internal DAO dashboard showing off your current members + their token values!
