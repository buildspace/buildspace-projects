### 💻 Build an NFT minter front-end
Welcome to your first week of SHIPPING. Every week you will have an entire section dedicated to taking your learnings and building it into your custom NFT staking app w/ loot boxes!

The whole point of these sections is to get you off localhost and building something real that others can use. All the builders that have come before you have found wild success from just putting their work out there and building in public. This is the moment you have been preparing for -- **let's do this thing 🤘.**

We are going to start on the front-end today to make these SLICK landing and mint pages.
![](https://hackmd.io/_uploads/BkAmmIZ7o.png)

The only functionality on the first screen is to connect to a user’s wallet. You can do this with the button at the top of the screen as well as the button in the middle.

![](https://hackmd.io/_uploads/B1hNm8W7j.png)

The second screen functionality will be implemented in the next core project, so no need to implement anything for the “mint buildoor” button.

#### 🕸 Set up project
We're starting from scratch, no templates this time! Set up a new Next.js app and add Chakra UI to it:

```bash!
npx create-next-app --typescript
cd
npm i @chakra-ui/react @emotion/react@^11 @emotion/styled@^11 framer-motion@^6 @chakra-ui/icons
npm i @solana/wallet-adapter-base @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets @solana/web3.js
```
**Note: Throughout this entire project we are going to be utilizing Typescript! You are more than welcome to use vanilla Javascript if you'd prefer :).**

If it asks to install `create-next-app`, say yes. You can name your app whatever you want, I named mine buildor lol.

Next you wanna add some assets. You can get them [here](https://cdn.disco.co/media%2FAssets_a68f5cab-20c9-45c7-b25c-43bc9dcd9e7d.zip) or you can make your own. You'll see five "avatar" files and a background svg. Put them in the public folder.

#### ✨ Set up Chakra UI
First order of business is setting up Chakra UI so we don't have to manually write a ton of CSS. We'll do this in `pages/_app.tsx`:
```ts
import type { AppProps } from "next/app"
import { ChakraProvider } from "@chakra-ui/react"

import { extendTheme } from "@chakra-ui/react"

const colors = {
  background: "#1F1F1F",
  accent: "#833BBE",
  bodyText: "rgba(255, 255, 255, 0.75)",
}

const theme = extendTheme({ colors })

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
        <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp
```

I'm going with some custom colours for mine, be sure you spice up yours as you like!

#### 🌶 Add some styling
Open up `styles/Home.module.css` and make it look like this:
```css
.container {
  background: #1F1F1F;
}
.wallet-adapter-button-trigger {
  background-color: #833BBE;
}
```
If you have a `globals.css` file in your styles folder, delete it. We won't be needing it!

Next up we have `index.tsx`, we'll update the imports to use Chakra UI and  render except for a single `<div className={styles.container}`. Then update the imports to:

```tsx
import { Box, Center, Spacer, Stack } from "@chakra-ui/react"
import type { NextPage } from "next"
import Head from "next/head"
import styles from "../styles/Home.module.css"

const Home: NextPage = () => {

  return (
    <div className={styles.container}>
      <Head>
        <title>Buildoors</title>
        <meta name="The NFT Collection for Buildoors" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box
        w="full"
        h="calc(100vh)"
        bgImage={"url(/home-background.svg)"}
        backgroundPosition="center"
      >
        <Stack w="full" h="calc(100vh)" justify="center">
					{ /* NavBar */ }

          <Spacer />
          <Center>
						{ /* If connected, the second view, otherwise the first */ }
                </Center>
          <Spacer />

          <Center>
            <Box marginBottom={4} color="white">
              <a
                href="https://twitter.com/_buildspace"
                target="_blank"
                rel="noopener noreferrer"
              >
                built with @_buildspace
              </a>
            </Box>
          </Center>
        </Stack>
      </Box>
    </div>
  )
}

export default Home
```

#### 🎫 Add a navigation bar
Now let’s build out the `NavBar`. Create a `components` folder and add a new file `NavBar.tsx`. We’ll build it as a horizontal stack with a spacer and a button for connecting the wallet:

```tsx
import { HStack, Spacer } from "@chakra-ui/react"
import { FC } from "react"
import styles from "../styles/Home.module.css"
import dynamic from "next/dynamic";

const WalletMultiButtonDynamic = dynamic(
	async () =>
		(await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
	{ ssr: false }
);

const NavBar: FC = () => {
  return (
    <HStack width="full" padding={4}>
      <Spacer />
			<WalletMultiButtonDynamic className={styles["wallet-adapter-button-trigger"]}/>
    </HStack>
  )
}

export default NavBar
```

We have `import dynamic from "next/dynamic"` to dynamically import `WalletMultiButton` from `@solana/wallet-adapter-react-ui` and assign it to `WalletMultiButtonDynamic` as follows:.

```tsx
const WalletMultiButtonDynamic = dynamic(
	async () =>
		(await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
	{ ssr: false }
);
```

This is because NextJS is server-side rendering and has no access to external dependency or component that relies on browser APIs like `window` before loading onto the client. This means NextJS can't interact with our wallets that are only available on the browser. `{ ssr: false }` disables server-rendering of the import. If you do not use dynamic import for your module, you will most likely encounter `Hydration failed because the initial UI does not match what was rendered on the server`. You can read more on dynamic imports [here](https://nextjs.org/docs/advanced-features/dynamic-import)!

Head back to `index.tsx`, import `NavBar` and put it at the top of the stack (I left a comment for where it should be):
```tsx
// Existing imports
import NavBar from "../components/NavBar"

const Home: NextPage = () => {

  return (
    <div className={styles.container}>
      <Head>

      <Box
        w="full"
        h="calc(100vh)"
        bgImage={"url(/home-background.svg)"}
        backgroundPosition="center"
      >
        <Stack w="full" h="calc(100vh)" justify="center">
         { /* NavBar */ }
          <NavBar />

// Rest of the file remains the same
```

At this point you still won't have anything on `localhost:3000` except a "Connect Wallet". Let's fix that.

#### 🏠 Create the landing page
Create a `Disconnected.tsx` file in the `components` folder and add the following:
```tsx
import { FC, MouseEventHandler, useCallback } from "react"
import {
  Button,
  Container,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react"
import { ArrowForwardIcon } from "@chakra-ui/icons"

const Disconnected: FC = () => {

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (event.defaultPrevented) {
        return
      }
    },
    []
  )

  return (
    <Container>
      <VStack spacing={20}>
        <Heading
          color="white"
          as="h1"
          size="3xl"
          noOfLines={2}
          textAlign="center"
        >
          Mint your buildoor. Earn $BLD. Level up.
        </Heading>
        <Button
          bgColor="accent"
          color="white"
          maxW="380px"
          onClick={handleClick}
        >
          <HStack>
            <Text>become a buildoor</Text>
            <ArrowForwardIcon />
          </HStack>
        </Button>
      </VStack>
    </Container>
  )
}

export default Disconnected
```

This will be our landing page - the first view that users see when they visit the site. You'll need to import it in `index.tsx` and place it in the middle of the render component (look for the comment again):
```tsx
// Existing imports
import Disconnected from '../components/Disconnected'

const Home: NextPage = () => {

  return (
    <div className={styles.container}>
      <Head>

      <Box
        w="full"
        h="calc(100vh)"
        bgImage={"url(/home-background.svg)"}
        backgroundPosition="center"
      >
        <Stack w="full" h="calc(100vh)" justify="center">
         { /* NavBar */ }
          <NavBar />

          <Spacer />
          <Center>
            <Disconnected />
          </Center>
          <Spacer />

// Rest of the file remains the same
```
Now if you look at `localhost:3000` you should see the landing page with the "become a buildoor" button. If you click it, nothing will happen. We don't like nothing happening, let's fix that!

#### 🔌 Connect to a user's wallet
We'll need lots of hooks here. Let's bring them in:
```
npm i @solana/wallet-adapter-base @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets @solana/web3.js
```

If you're building for a specific wallet, this is where you'd change things up, I'm just sticking with the defaults :D

Create a `WalletContextProvider.tsx` in `components` so we can chuck all this boilerplate in it:
```tsx
import { FC, ReactNode } from "react"
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { clusterApiUrl } from "@solana/web3.js"
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets"
import { useMemo } from "react"
require("@solana/wallet-adapter-react-ui/styles.css")

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const url = useMemo(() => clusterApiUrl("devnet"), [])
  const phantom = new PhantomWalletAdapter()

  return (
    <ConnectionProvider endpoint={url}>
      <WalletProvider wallets={[phantom]}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default WalletContextProvider
```

We'll need to import this in `_app.tsx`:
```tsx
import WalletContextProvider from '../components/WalletContextProvider'

<ChakraProvider theme={theme}>
	<WalletContextProvider>
		<Component {...pageProps} />
	</WalletContextProvider>
</ChakraProvider>
```
Now we also want the “become a buildoor” button to also connect you. In `Disconnected.tsx`, add these imports

```tsx
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { useWallet } from "@solana/wallet-adapter-react"
```

Then update the body of `Disconnected` before the render to the following:

```tsx
  const modalState = useWalletModal()
  const { wallet, connect } = useWallet()

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (event.defaultPrevented) {
        return
      }

      if (!wallet) {
        modalState.setVisible(true)
      } else {
        connect().catch(() => {})
      }
    },
    [wallet, connect, modalState]
  )
```
And voila, you should be able to connect!

#### 🎇 Create connected view
Now that we can connect, we need to update the view to show what it should look like when we’re connected. Let’s create a `Connected.tsx` file in the `components` directory
```tsx
import { FC } from "react"
import {
  Button,
  Container,
  Heading,
  HStack,
  Text,
  VStack,
  Image,
} from "@chakra-ui/react"
import { ArrowForwardIcon } from "@chakra-ui/icons"

const Connected: FC = () => {
  return (
    <VStack spacing={20}>
      <Container>
        <VStack spacing={8}>
          <Heading
            color="white"
            as="h1"
            size="2xl"
            noOfLines={1}
            textAlign="center"
          >
            Welcome Buildoor.
          </Heading>

          <Text color="bodyText" fontSize="xl" textAlign="center">
            Each buildoor is randomly generated and can be staked to receive
            <Text as="b"> $BLD</Text> Use your <Text as="b"> $BLD</Text> to
            upgrade your buildoor and receive perks within the community!
          </Text>
        </VStack>
      </Container>

      <HStack spacing={10}>
        <Image src="avatar1.png" alt="" />
        <Image src="avatar2.png" alt="" />
        <Image src="avatar3.png" alt="" />
        <Image src="avatar4.png" alt="" />
        <Image src="avatar5.png" alt="" />
      </HStack>

      <Button bgColor="accent" color="white" maxW="380px">
        <HStack>
          <Text>mint buildoor</Text>
          <ArrowForwardIcon />
        </HStack>
      </Button>
    </VStack>
  )
}

export default Connected
```

Now we’ve just got to find a way to show it on screen. Back in `index.tsx`, let’s add two imports:

```tsx
import { useWallet } from "@solana/wallet-adapter-react"
import Connected from "../components/Connected"
```

Now we can use the `useWallet` hook to get access to a variable telling us whether or not we are connected. We can use that to conditionally render the `Connected` vs `Disconnected` view.

```tsx
const Home: NextPage = () => {
  const { connected } = useWallet()

  return (
    <div className={styles.container}>
      <Head>
        <title>Buildoors</title>
        <meta name="The NFT Collection for Buildoors" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box
        w="full"
        h="calc(100vh)"
        bgImage={connected ? "" : "url(/home-background.svg)"}
        backgroundPosition="center"
      >
        <Stack w="full" h="calc(100vh)" justify="center">
          <NavBar />

          <Spacer />
          <Center>{connected ? <Connected /> : <Disconnected />}</Center>
          <Spacer />
```

And there we go! We’ve got the frontend set up and are well on our way to minting buildoors
