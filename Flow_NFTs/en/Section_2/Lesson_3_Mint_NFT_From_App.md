Time to make the most magical part of our app - the mint button!

This is where you realise how convenient the Flow architecture is. Remember your transactions & scripts? You can use them on the front-end too! I've included common transactions and scripts inside the Cadence folder. For now we'll just need two of them, one of which you've used before 🤯

🚨**UPDATE NOTICE**🚨
You'll need to go into the script files and update the account address + contract name in all places! I've left the name as "BottomShot" in case you were lazy and didn't actually change your contracts name. If you don't change the address or the name, your mint function will probably just error lol

Head back to your `App.js` and let's get started building a `mint` function.

Start by importing the `mintNFT` transactions that we wrote earlier and a helper `getTotalSupply` script I've included:
```
#App.js
import { mintNFT } from "./cadence/transactions/mintNFT_tx";
import { getTotalSupply } from "./cadence/scripts/getTotalSupply_script";
```

Right after the authentication functions, add this mint function:
```js
  const mint = async() => {

    let _totalSupply;
    try {
      _totalSupply = await fcl.query({
        cadence: `${getTotalSupply}`
      })
    } catch(err) {console.log(err)}
    
    const _id = parseInt(_totalSupply) + 1;
    
    try {
      const transactionId = await fcl.mutate({
        cadence: `${mintNFT}`,
        args: (arg, t) => [
          arg(user.addr, types.Address), //address to which the NFT should be minted
          arg("CatMoji # "+_id.toString(), types.String), // Name
          arg("Cat emojis on the blockchain", types.String), // Description
          arg("ipfs://bafybeigmeykxsur4ya2p3nw6r7hz2kp3r2clhvzwiqaashhz5efhewkkgu/"+_id+".png", types.String),
        ],
        proposer: fcl.currentUser,
        payer: fcl.currentUser,
        limit: 99
      })
      console.log("Minting NFT now with transaction ID", transactionId);
      const transaction = await fcl.tx(transactionId).onceSealed();
      console.log("Testnet explorer link:", `https://testnet.flowscan.org/transaction/${transactionId}`);
      console.log(transaction);
      alert("NFT minted successfully!")
    } catch (error) {
      console.log(error);
      alert("Error minting NFT, please check the console for error details!")
    }
  }
```

This is a lot less daunting than it seems. Let's break it down step by step!

```
    let _totalSupply;
    try {
      _totalSupply = await fcl.query({
        cadence: `${getTotalSupply}`
      })
    } catch(err) {console.log(err)}
    
    const _id = parseInt(_totalSupply) + 1;
```
The first thing we do is use the getTotalSupply script to fetch the total number of minted NFTs. We use this number +1 as the ID of the next NFT. The new thing here is the `fcl.query` function call. FCL let's us run scripts to fetch *any* data we want from the blockchain. This is super useful cause you can just use scripts others have written to fetch stuff you need! We pass in an entire cadence file here. Feel free to check out `/cadence/scripts/getTotalSupply_script.js` to see what it looks like.

Right after, we have the meat of the function, the `mint` transaction:
```
const transactionId = await fcl.mutate({
  cadence: `${mintNFT}`,
  args: (arg, t) => [
    arg(user.addr, types.Address), //address to which the NFT should be minted (connected wallet)
    arg("CatMoji # "+_id.toString(), types.String), // Name
    arg("Cat emojis on the blockchain", types.String), // Description
    arg("ipfs://bafybeigmeykxsur4ya2p3nw6r7hz2kp3r2clhvzwiqaashhz5efhewkkgu/"+_id+".png", types.String),
  ],
  proposer: fcl.currentUser,
  payer: fcl.currentUser,
  limit: 99
})
```
Some of this may not make sense to you right now, and that's OKAY. Lemme give you a quick explanation of what's up here. We've used this transaction before, just in a different place!

This block creates a `mutate` request using FCL. "Mutate" means to change, this is just a write request! We have 5 arguments being passed in here:
- `cadence`: this is the mint transaction we wrote to mint an NFT locally. It tells the blockchain what to change.
- `args`: these are just the arguments for the transaction. This is where we pass in details like the name of the NFT and the link of the media. I'm using the `_id` field to step through the uploaded NFTs!
- `proposer`: the account sending the transaction
- `payer`: the account paying the gas fees (computation fees) for this transaction
- `limit`: the computation limit for this transaction. 

Remember, the library we imported called `@onflow/types`? Here we use it to tell FCL what the expected Flow datatype is so it can do the conversion (from string to address, for instance). The syntax for the `args` value is weird. For our Cadence transaction to work - it requires a very specific format. We convert our JS types inside the actual value for `args` to format our data in a way where Flow won't get mad at us :) 

`arg` in `(arg, t)` is a function, and it takes in two variables - the first being the value of the argument that needs to be passed in the flow transaction, and the second is the datatype.

You can read more about mutation [here](https://docs.onflow.org/fcl/reference/api/#mutate), the `arg` value [here](https://docs.onflow.org/fcl/reference/api/#argumentfunction) and transaction signers [here](https://docs.onflow.org/concepts/transaction-signing).

That's all there is to it!

```
console.log("Minting NFT now with transaction ID", transactionId);
const transaction = await fcl.tx(transactionId).onceSealed();
console.log("Testnet explorer link:", `https://testnet.flowscan.org/transaction/${transactionId}`);
console.log(transaction);
alert("NFT minted successfully!")
```

At the end we're just logging out the testnet explorer and the transaction object after it has been sealed on-chain, ensuring that the minting was successful!

Make a render function for this new button:
```js
  const RenderMintButton = () => {
    return (
      <div>
        <button className="cta-button button-glow" onClick={() => mint()}>
          Mint
        </button>
      </div>
    );
  }
```

And the last piece, update your JSX to use the mint button:
```jsx
{user && user.addr ? <RenderMintButton /> : <RenderLogin />}
```

Try it out and check your console. I'll `await` the result lol.

You should see a bunch of printouts in your browser console, including a link to the Flow testnet blockchain scanner called Flowscan. Click this link!
![](https://hackmd.io/_uploads/ByCIFffq5.png)


You can see the NFT being transferred to your account on the real network!
![](https://hackmd.io/_uploads/ByYOtR-59.png)

🎉 **CONGRATS!** 🎉 You just minted an NFT on the Flow blockchain!!!

This is a big deal. You wrote the contract. You deployed it. You built the React app. You talked to your contract. You did all of that. Call yourself a full-stack dev the way you're stacking these skills!

### 🚨 Progress report 🚨
Huuuuuuuuuuuuuuuuge milestone. Show it off! Post the minting transaction link on Flowscan in #progress.