Ya know how exciting it is seeing the shiny new iPhone? Rare NFTs are kinda like that. With good artists, even just looking at them can be fun. After all, art is for looking at! Let's figure out how we can display NFTs if we have just the Candy Machine address.

Can you guess what happens differently here? Yup, we just use a different method on the SDK!

![](https://hackmd.io/_uploads/rk5H8x3Xj.png)

Since there's no wallet here we don't need to use `walletAdapterIdentity` - just the metaplex object will do.

![](https://hackmd.io/_uploads/SJzR8g37o.png)

We have just a couple options here - `findByAddress` is the one we want. 

![](https://hackmd.io/_uploads/ByVuDlhmo.png)

Similar to the what we got for a single NFT, we'll get the metadata for the entire Candy Machine instance. The `items` field is an array of all the NFTs in the Candy Machine. Each item won't have the stuff we want, instead it'll point to a URI that we can fetch the assets from:

![](https://hackmd.io/_uploads/SyBkFe3Xo.png)

Since collections can get *massive*, we won't fetch all the NFTs at once. Instead, we'll only fetch the ones we want to display based on a pagination system.

Let's paint some pixels!

#### 🥁 Fetch a Candy Machine
You can continue where you left off in the previous section or use the same template we used last time (the starter branch is fine).

Pop into `FetchCandyMachine.tsx`. You'll see a bunch of setup has already been done for you. We're going to be fetching "pages" of items on the Candy Machine with the `getPage` function. Before we can do that, we'll have to fetch the Candy Machine metadata account.

Set up the `metaplex` object with a connection right above the empty `fetchCandyMachine` function:

```tsx
export const FetchCandyMachine: FC = () => {
	// placeholder CMv2 address
  const [candyMachineAddress, setCandyMachineAddress] = useState("")
  const [candyMachineData, setCandyMachineData] = useState(null)
  const [pageItems, setPageItems] = useState(null)
  const [page, setPage] = useState(1)

  const { connection } = useConnection()
  const metaplex = Metaplex.make(connection)
```

Make sure you add in your Candy Machine address when making the stateful variable:

```tsx
export const FetchCandyMachine: FC = () => {
  const [candyMachineAddress, setCandyMachineAddress] = useState("CM_ADDRESS_HERE")
  ...
```

Next we'll complete `fetchCandyMachine`. We'll use the `findByAddress` method we saw earlier.
```tsx
export const FetchCandyMachine: FC = () => {
	...

  // fetch candymachine by address
  const fetchCandyMachine = async () => {
    
    // Set page to 1 - we wanna be at the first page whenever we fetch a new Candy Machine
    setPage(1)

    // fetch candymachine data
    try {
      const candyMachine = await metaplex
        .candyMachines()
        .findByAddress({ address: new PublicKey(candyMachineAddress) })
        .run()

      setCandyMachineData(candyMachine)
    } catch (e) {
      alert("Please submit a valid CMv2 address.")
    }
  }
	...
}
``` 
**Note:** The latest version of the Metaplex CLI does not need `run()` at the end of function calls.

Now comes the important part - paginating through the CM data we'll get. Here's what the `getPage` function will look like:
```tsx
export const FetchCandyMachine: FC = () => {
	...

	// paging
  const getPage = async (page, perPage) => {
    const pageItems = candyMachineData.items.slice(
      (page - 1) * perPage,
      page * perPage
    )

    // fetch metadata of NFTs for page
    let nftData = []
    for (let i = 0; i < pageItems.length; i++) {
      let fetchResult = await fetch(pageItems[i].uri)
      let json = await fetchResult.json()
      nftData.push(json)
    }

    // set state
    setPageItems(nftData)
  }
	...
}
```

What we're doing here is slicing the `items` array into chunks of 10. Then we're fetching the metadata for each NFT in the page and storing it in `nftData`. Finally, we're setting the `pageItems` state variable to the `nftData` we just fetched.

This means at any time our app will only render the NFTs for the current page. Nice!

Let's fill in the `prev` and `next` functions:

```tsx
  // previous page
  const prev = async () => {
    if (page - 1 < 1) {
      setPage(1)
    } else {
      setPage(page - 1)
    }
  }

  // next page
  const next = async () => {
    setPage(page + 1)
  }
```
These will run when the user clicks the "Previous" and "Next" buttons, which only show up when `pageItems` is not empty (i.e. when we've fetched the NFTs for a CM).

Now we need a few `useEffects` to kick things off. The whole process can be slightly confusing at first look, so let's break it down step by step.

1. On page load run the `fetchCandyMachine` function (if `candyMachineAddress` is not empty)
2. Whenever fetching a candy machine with `fetchCandyMachine`, set `page` to 1 so you get the first page.
3. Whenever `candyMachineData` or `page` changes (i.e. new CM address entered or next.prev button clicked), load the page

Here's what this will look like in code:
```tsx
export const FetchNft: FC = () => {
	...
	
  // fetch placeholder candy machine on load
  useEffect(() => {
    fetchCandyMachine()
  }, [])

  // fetch metadata for NFTs when page or candy machine changes
  useEffect(() => {
    if (!candyMachineData) {
      return
    }
    getPage(page, 9)
  }, [candyMachineData, page])

}
```

Head over to `localhost:3000` and try it out! You should see the first page of NFTs from your Candy Machine.
