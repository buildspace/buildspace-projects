
Now that we've successfully created token and NFTs. Let's move on to create our minting UI so that we can visually interact with our smart contract and allow other people to mint our NFTs on our browser! Isn't that cool? If you noticed, your website currently have a `minting` button but it doesn't have any functionality yet. Let's start be creating a function and add some logic to allow us to mint our NFT. If you don't have the starter code, you can clone it [here](https://github.com/buildspace/buildspace-buildoors/tree/solution-core-2-candy-machine)

Now, let's start by adding the following lines of code into your `newMint.tsx`. **Note: Do not copy and paste the code blindly. I'm only including what's necessary, you should figure out where these code are suppose to be placed. Hint: Should be below your `Container` element**

```javascript
// REST OF YOUR CODE
import { Button, Text, HStack } from "@chakra-ui/react";
import { MouseEventHandler, useCallback } from "react";
import { ArrowForwardIcon } from "@chakra-ui/icons";

const Home: NextPage = () => {
  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (event) => {},
    []
  );

  return (
    <MainLayout>
      {/* REST OF YOUR CODE */}
      <Image src="" alt="" />
      <Button
        bgColor="accent"
        color="white"
        maxWidth="380px"
        onClick={handleClick}
      >
        <HStack>
          <Text>stake my buildoor</Text>
          <ArrowForwardIcon />
        </HStack>
      </Button>
    </MainLayout>
  );
};
```

Once that's done, we can move over to `Connected.tsx` and add some codes. Just above `handleClick` function, we can add this `const router = useRouter()`. \*\*Remember to import the useRouter function above. Next, add `router.push("/newMint")` into your `handleClick` function. It should now look like this

```javascript
const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
  async (event) => {
    if (event.defaultPrevented) return;
    if (!walletAdapter.connected || !candyMachine) return;

    try {
      setIsMinting(true);
      const nft = await metaplex.candyMachines().mint({ candyMachine }).run();

      console.log(nft);
      router.push(`/newMint?mint=${nft.nft.address.toBase58()}`);
    } catch (error) {
      alert(error);
    } finally {
      setIsMinting(false);
    }
  },
  [metaplex, walletAdapter, candyMachine]
);
```

You should now be able to click on the `stake my buildoor` button and it should prompt you to approve the transaction from your phantom wallet. However, you might notice that once you've successfully approved the transaction, it'll refresh the page and causes your wallet to be logged out. Don't worry, we'll fix this in the next section.

Head over to `newMint.tsx`. We'll be creating an interface to fix this issue. Add this above your `Home` function.

```typescript
import { PublicKey } from "@solana/web3.js";

interface NewMintProps {
  mint: PublicKey;
}
```

Once that's done, it should look something like this

```javascript
// REST OF YOUR CODE
import { PublicKey } from "@solana/web3.js";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";

interface NewMintProps {
  mint: PublicKey;
}

const Home: NextPage<NewMintProps> = ({ mint }) => {
    const [metadata, setMetadat] = useState<any>()
    const { connection } = useConnection()
    const walletAdapter = useWallet()
    const metaplex = useMemo(() => {
        return Metaplex.make(connection).use(walletAdapterIdentity(walletAdapter))
    }, [connection, walletAdapter])

    useEffect(() => {
        // What this does is to allow us to find the NFT object
        // based on the given mint address
        metaplex.nfts().findByMint({ mintAddress: mint }).run()
            .then((nft) => {
                // We then fetch the NFT uri to fetch the NFT metadata
                fetch(nft.uri)
                    .then((res) => res.json())
                    .then((metadata) => {
                        setMetadata(metadata)
                    })
            })
    }, [mint, metaplex, walletAdapter])

  // REST OF YOUR CODE
};
```

Noticed how we call `setMetadata(metadata)` in our function above? This is to allow us to set the metadata object to the state so that we can use it to render the image. Now let's call the object in our `Image` element.

`<Image src={metadata?.image ?? ""} alt="" />`

We're almost there. If you try to mint a new NFT now, you'll notice that the website will throw an error saying that it is unable to read properties of undefined. We can fix this by adding a few lines of code at the bottom. Just slightly above your `export default NewMint`.

```javascript
NewMint.getInitialProps = async ({ query }) => {
  const { mint } = query;
  if (!mint) throw { error: "No mint" };

  try {
    const mintPubkey = new PublicKey(mint);
    return { mint: mintPubkey };
  } catch {
    throws({ error: "Invalid mint" });
  }
};
```

Awesome! Now that you've added all the necessary codes, you should be able to mint an NFT and be able to see that image. Here's how mine looks.

![](https://i.imgur.com/rXICsaQ.png)

#### 🛠️ Minor Fix
Notice how the website isn't displaying the content accurately as intended so to fix this, we'll need to head over to `WalletContextProvider.tsx` and modify some of the code.

Change

```javascript
const phantom = new PhantomWalletAdapter();
```

To

```javascript
const phantom = useMemo(() => new PhantomWalletAdapter(), []);
```

We also need to add a `autoConnect` prop to your `WalletProvider`. Like this

```javascript
<WalletProvider wallets={[phantom]} autoConnect={true}>
  <WalletModalProvider>{children}</WalletModalProvider>
</WalletProvider>
```

The reason why we need to use `useMemo` is because we want to prevent the wallet adapter to be constructed multiple times. You can learn more about useMemo [here](https://reactjs.org/docs/hooks-reference.html#usememo)
