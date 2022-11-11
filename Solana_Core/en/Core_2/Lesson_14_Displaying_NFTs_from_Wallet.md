You know how it goes. Template time. However, as the things we're building get better, our templates will too. This time we'll be building on a template made from the [Solana dApp scaffold](https://github.com/solana-labs/dapp-scaffold). Like our previous templates, it's a Next.js app made using `create-next-app`. Unlike our previous templates, it's got a lot more happening. Worry not! We're still going to be using the same stuff

```bash
git clone https://github.com/buildspace/solana-display-nfts-frontend
cd solana-display-nfts-frontend
git checkout starter
npm i
npm run dev
```

You should see this on `localhost:3000`:

![](https://hackmd.io/_uploads/Skn7dJhXo.png)

The "Display NFT" page doesn't show anything yet - that's where you come in.

Open up `src/components/FetchNFT.tsx` and let's get going. We'll start off with Metaplex setup at the top of the component:
```tsx
export const FetchNft: FC = () => {
  const [nftData, setNftData] = useState([])

  const { connection } = useConnection()
  const wallet = useWallet()
  const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet))

  const fetchNfts = async () => {}

  return <div></div>
}
```

Looks familiar.

Now let's fill in the `fetchNfts` function. We'll use the `findAllByOwner` method we saw earlier. We'll also need to use the `useWallet` hook to get the wallet address.

```tsx
  const fetchNfts = async () => {
    if (!wallet.connected) {
      return
    }

    // fetch NFTs for connected wallet
    const nftResults = await metaplex
      .nfts()
      .findAllByOwner({ owner: wallet.publicKey })
      .run()

    // some nfts may not have a uri to fetch metadata! get rid of em
    const nftHasUri = nfts.filter((nft) => nft.uri)

    // fetch off chain metadata for each NFT
    const nftData = []
    for (let i = 0; i < nftHasUri.length; i++) {
      const { uri } = nftHasUri[i]
      const data = await fetcher(uri)
      const json = await data.json()
      nftData.push(json)
    }

    // set state
    setNftData(nftData)
  }
```

We wanna update which NFTs are displayed when the wallet changes, so we'll add a `useEffect` hook to call `fetchNfts` when the wallet changes right under the `fetchNfts` function:

```tsx
export const FetchNft: FC = () => {
	...

  const fetchNfts = async () => {
		...
  }

  // fetch nfts when connected wallet changes
  useEffect(() => {
    fetchNfts()
  }, [wallet])

  return <div></div>
}
```

Finally, we need to update the `return` statement to display the NFTs. We'll use the `nftData` state variable we created earlier.

```tsx
  return (
     <div>
      {nftData?.length && (
        <div className={styles.gridNFT}>
          {nftData.map((nft, i) => (
            <div key={i} >
              <ul>{nft.name}</ul>
              <img alt={nft.name} src={nft.image} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
```

We can now see our NFTs! 🎉 Here's what my wallet looks like 😆

![](https://hackmd.io/_uploads/SyhDsk2mo.png)

Back in the old days (circa Oct 2021) I had to do this all manually and I kept getting rate limited by the RPCs, so take a moment to be grateful to the Metaplex devs for this wonderful SDK!

Play around with `nftData` here. Log it to the console and try displaying other values like symbol or description! Maybe add a filter so users can only display NFTs from a specific collection?
