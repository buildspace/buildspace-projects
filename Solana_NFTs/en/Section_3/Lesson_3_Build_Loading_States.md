I think it's time to finally address these loading states.

Let's start by adding two different loading states here: **one when we are minting an NFT and one when we are fetching all minted items.**

This should make our UX slightly better. Else, it's pretty confusing for our users.

### 🤬 Create loading indicator for when NFT is minting.

Create some new states in your `CandyMachine` component.

```jsx
// State
const [machineStats, setMachineStats] = useState(null);
const [mints, setMints] = useState([]);
// Add these two state properties
const [isMinting, setIsMinting] = useState(false);
const [isLoadingMints, setIsLoadingMints] = useState(false);
```

Let's start with the `isMinting` property. This one is going to tell us when there is a mint in progress. Head over to your `mintToken` function and let's add two lines:

```jsx
const mintToken = async () => {
  try {
    // Add this here
    setIsMinting(true);
    const mint = web3.Keypair.generate();
    const token = await getTokenWallet(
      walletAddress.publicKey,
      mint.publicKey
    );

  // rest of code
  } catch (error) {
    let message = error.msg || 'Minting failed! Please try again!';

    // If we have an error set our loading flag to false
    setIsMinting(false);

    if (!error.msg) {
      if (error.message.indexOf('0x138')) {
      } else if (error.message.indexOf('0x137')) {
        message = `SOLD OUT!`;
      } else if (error.message.indexOf('0x135')) {
        message = `Insufficient funds to mint. Please fund your wallet.`;
      }
    } else {
      if (error.code === 311) {
        message = `SOLD OUT!`;
      } else if (error.code === 312) {
        message = `Minting period hasn't started yet.`;
      }
    }

    console.warn(message);
  }
}
```

So we handled the scenario where the mint starts and there is an error, but what about if the mint is successful?

Let's stay in the `mintToken` function and find the event listener that is setup with the changes we made. It should look something like this:
```jsx
if (notification.type === 'status') {
  console.log('Received status event');

  const { result } = notification;
  if (!result.err) {
    console.log('NFT Minted!');
    // Set our flag to false as our NFT has been minted!
    setIsMinting(false);
    await getCandyMachineState();
  }
}
```

BOOM. There you have it. Pretty simple right?

At this point all we need to do is add some logic for our UI. At the most basic level, your Mint NFT button should be disabled so people can't mint multiple NFTs at once! Let's go ahead and add a quick "one-liner" that will do that for us:

```jsx
<button
  className="cta-button mint-button"
  onClick={mintToken}
  // Add this disabled state and have it listen to isMinting
  disabled={isMinting}
>
  Mint NFT
</button>
```

Now when you go ahead and mint another NFT, you should not be able to click the button again. This can be improved even more by adding some gif or text saying that minting is in progress, but I will leave that up to you to add now that you have the basic code.

### 🤠 Create loading indicator for when NFTs are being fetched.

Finally, we are going to do the same thing for when we are fetching all currently minted NFTs. Head over to `getCandyMachineState` and add the following code:

```jsx

// Set loading flag.
setIsLoadingMints(true);

const data = await fetchHashTable(
  process.env.REACT_APP_CANDY_MACHINE_ID,
  true
);

if (data.length !== 0) {
  const requests = data.map(async (mint) => {
    try {
      const response = await fetch(mint.data.uri);
      const parse = await response.json();
      console.log("Past Minted NFT", mint)

      return parse.image;
    } catch(e) {
      console.error("Failed retrieving Minted NFT", mint);
      return null;
    }
  });

  const allMints = await Promise.all(requests);
  const filteredMints = allMints.filter(mint => mint !== null);
  setMints(filteredMints);
}

// Remove loading flag.
setIsLoadingMints(false);
```

Simple enough, we just added `setIsLoadingMints` at the top and at the bottom!

That should handle all the cases of our loading state! Let's add a simple piece of code that will show when we are fetching all minted items. Head to your components render method and add this small piece of code:

```jsx
return (
    machineStats && (
      <div className="machine-container">
        <p>{`Drop Date: ${machineStats.goLiveDateTimeString}`}</p>
        <p>{`Items Minted: ${machineStats.itemsRedeemed} / ${machineStats.itemsAvailable}`}</p>
        <button
          className="cta-button mint-button"
          onClick={mintToken}
          // Add this disabled state and have it listen to isMinting
          disabled={isMinting}
        >
          Mint NFT
        </button>
        {isLoadingMints && <p>LOADING MINTS...</p>}
        {mints.length > 0 && renderMintedItems()}
      </div>
    )
  );
```

You now have a full functioning Solana NFT drop site that you can load up with tons of NFTs and show off to your friends 😎.

Let's head over to final touches.

### 🚨 Progress Report

*Please do this else Farza will be sad :(*

In `#progress` use /giphy and post a GIF of your choice. Why? PFT. Why not.
