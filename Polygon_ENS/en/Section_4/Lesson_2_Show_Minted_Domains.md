### 📝 Updating domain records

We made our domain records update-able on our contract, but we haven't built out that functionality on our app. What's the point of a permanent domain if we can't point it to different things over time to be hip with cool kidz? Imagine you had linked to a really cool YouTube video that got taken down or maybe you got a new favourite song? We should let everyone update their records! Let’s add this function next to our `mintDomain` function in App.js:

```jsx
const updateDomain = async () => {
  if (!record || !domain) { return }
  setLoading(true);
  console.log("Updating domain", domain, "with record", record);
    try {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);

      let tx = await contract.setRecord(domain, record);
      await tx.wait();
      console.log("Record set https://mumbai.polygonscan.com/tx/"+tx.hash);

      fetchMints();
      setRecord('');
      setDomain('');
    }
    } catch(error) {
      console.log(error);
    }
  setLoading(false);
}
```

Nothing new here, it’s just a smaller version of our `mintDomain` function. You’re a pro at this stuff now so I expect you to understand this hehe.

To actually call this, we’ll have to make some more changes to our `renderInputForm` function to show a `Set record` button. We'll also use a stateful variable to detect if we're in "edit" mode. I just called it `editing`. Here's the code:

```jsx
  const App = () => {
  // Add a new stateful variable at the start of our component next to all the old ones
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  
  // Here's the updated renderInputForm function (do not make a new one)
  const renderInputForm = () =>{
    if (network !== 'Polygon Mumbai Testnet') {
      return (
        <div className="connect-wallet-container">
          <p>Please connect to Polygon Mumbai Testnet</p>
          <button className='cta-button mint-button' onClick={switchNetwork}>Click here to switch</button>
        </div>
      );
    }

    return (
      <div className="form-container">
        <div className="first-row">
          <input
            type="text"
            value={domain}
            placeholder='domain'
            onChange={e => setDomain(e.target.value)}
          />
          <p className='tld'> {tld} </p>
        </div>

        <input
          type="text"
          value={record}
          placeholder='whats ur ninja power?'
          onChange={e => setRecord(e.target.value)}
        />
          {/* If the editing variable is true, return the "Set record" and "Cancel" button */}
          {editing ? (
            <div className="button-container">
              {/* This will call the updateDomain function we just made */}
              <button className='cta-button mint-button' disabled={loading} onClick={updateDomain}>
                Set record
              </button>  
              {/* This will let us get out of editing mode by setting editing to false */}
              <button className='cta-button mint-button' onClick={() => {setEditing(false)}}>
                Cancel
              </button>  
            </div>
          ) : (
            // If editing is not true, the mint button will be returned instead
            <button className='cta-button mint-button' disabled={loading} onClick={mintDomain}>
              Mint
            </button>  
          )}
      </div>
    );
  }
```

All that's happening here is we're rendering two different buttons if the app is in edit mode. The `Set record` button will call the update function we wrote and the cancel button will take us out of editing mode. 

### 🎞 Fetch mint records

You’ve done so much work! A youngling no more. Time to show the world all the awesome domains other people have purchased. We added a function in our contract to do that! Let’s pull it out lol

```jsx
// Add a stateful array at the top next to all the other useState calls
const [mints, setMints] = useState([]);

// Add this function anywhere in your component (maybe after the mint function)
const fetchMints = async () => {
  try {
    const { ethereum } = window;
    if (ethereum) {
      // You know all this
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);
        
      // Get all the domain names from our contract
      const names = await contract.getAllNames();
        
      // For each name, get the record and the address
      const mintRecords = await Promise.all(names.map(async (name) => {
      const mintRecord = await contract.records(name);
      const owner = await contract.domains(name);
      return {
        id: names.indexOf(name),
        name: name,
        record: mintRecord,
        owner: owner,
      };
    }));

    console.log("MINTS FETCHED ", mintRecords);
    setMints(mintRecords);
    }
  } catch(error){
    console.log(error);
  }
}

// This will run any time currentAccount or network are changed
useEffect(() => {
  if (network === 'Polygon Mumbai Testnet') {
    fetchMints();
  }
}, [currentAccount, network]);
```

This fetchMints function is fetching three things: 

1. All the domain names from the contract
2. The record for each domain name it got
3. The owner’s address for each domain name it got

It puts these in an array and sets the array as our mints. Let’s get minty.

Btw - I added this to the bottom of my `mintDomain` function as well so our app updates when we mint a domain ourselves. We’re waiting two seconds to make sure the transaction is mined. Now our users can see their mints in real-time!

```jsx
const mintDomain = async () => {
  // Don't run if the domain is empty
  if (!domain) { return }
  // Alert the user if the domain is too short
  if (domain.length < 3) {
    alert('Domain must be at least 3 characters long');
    return;
  }
  // Calculate price based on length of domain (change this to match your contract)	
  // 3 chars = 0.5 MATIC, 4 chars = 0.3 MATIC, 5 or more = 0.1 MATIC
  const price = domain.length === 3 ? '0.5' : domain.length === 4 ? '0.3' : '0.1';
  console.log("Minting domain", domain, "with price", price);
  try {
      const { ethereum } = window;
      if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);

      console.log("Going to pop wallet now to pay gas...")
          let tx = await contract.register(domain, {value: ethers.utils.parseEther(price)});
          // Wait for the transaction to be mined
      const receipt = await tx.wait();

      // Check if the transaction was successfully completed
      if (receipt.status === 1) {
        console.log("Domain minted! https://mumbai.polygonscan.com/tx/"+tx.hash);
        
        // Set the record for the domain
        tx = await contract.setRecord(domain, record);
        await tx.wait();

        console.log("Record set! https://mumbai.polygonscan.com/tx/"+tx.hash);
        
        // Call fetchMints after 2 seconds
        setTimeout(() => {
          fetchMints();
        }, 2000);

        setRecord('');
        setDomain('');
      } else {
        alert("Transaction failed! Please try again");
      }
      }
    } catch(error) {
      console.log(error);
    }
}
```

### 🧙 Render minted domains

Alright, we’re almost done, hang in there! Now that we have these, we can just render them at the bottom:

```jsx
// Add this render function next to your other render functions
const renderMints = () => {
  if (currentAccount && mints.length > 0) {
    return (
      <div className="mint-container">
        <p className="subtitle"> Recently minted domains!</p>
        <div className="mint-list">
          { mints.map((mint, index) => {
            return (
              <div className="mint-item" key={index}>
                <div className='mint-row'>
                  <a className="link" href={`https://testnets.opensea.io/assets/mumbai/${CONTRACT_ADDRESS}/${mint.id}`} target="_blank" rel="noopener noreferrer">
                    <p className="underlined">{' '}{mint.name}{tld}{' '}</p>
                  </a>
                  {/* If mint.owner is currentAccount, add an "edit" button*/}
                  { mint.owner.toLowerCase() === currentAccount.toLowerCase() ?
                    <button className="edit-button" onClick={() => editRecord(mint.name)}>
                      <img className="edit-icon" src="https://img.icons8.com/metro/26/000000/pencil.png" alt="Edit button" />
                    </button>
                    :
                    null
                  }
                </div>
          <p> {mint.record} </p>
        </div>)
        })}
      </div>
    </div>);
  }
};

// This will take us into edit mode and show us the edit buttons!
const editRecord = (name) => {
  console.log("Editing record for", name);
  setEditing(true);
  setDomain(name);
}
```

This is a bunch of React, the only thing fancy is the `mints.map` section. What it does is it takes each item in the the `mints` array and renders some HTML for it. It uses the values of the items in the actual HTML with `mint.name` and `mint.id`. Pretty sick! You can call this function under all the other render functions :)

This is what my final render section looks like:

```jsx
{!currentAccount && renderNotConnectedContainer()}
{currentAccount && renderInputForm()}
{mints && renderMints()}
```

And this is what it renders to:

![https://i.imgur.com/EWZCQ0a.png](https://i.imgur.com/EWZCQ0a.png)

Looking goooooooooooooooooooooooood! See the tiny pencils? They let you edit the records for each domain you own.

### 🥂 Show “domain minted” popup

The minting process on our app is kinda bland right now. You press a button. Something happens. Here’s a challenge for you: Display a popup that tells the user their domain has been minted. Check out how we’re sending them to OpenSea in the `renderMints` function for a hint :)

### 🚨Progress report

Your app should be looking super fancy right now! Post the finished product in #progress. I can’t wait to see all your cool takes on this project :)
