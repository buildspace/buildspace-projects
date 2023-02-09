Here we go, let's make some progress on our buildoors NFT project. We have three things we want to accomplish in this core:

1. **Build the UI for our Staking page**

This is what we're aiming for:

![](https://i.imgur.com/j75QTYE.png)

Note that the squares that say “STAKING 4 DAYS” and “READY TO STAKE” wouldn’t be shown at the same time. Just show the one relevant to the current staking state of the NFT.

Mock data where necessary and just get the UI looking roughly how you want it. And just note that your UI doesn’t need to be exactly like this. Please personalize it. 

2. **Add the actual staking to our program**

Remember, we did some work to store state but the program isn’t actually staking the NFT or minting BLD tokens yet. We'll fix that!

3. Once the program is fully ready to go, it’s time to **go back to the UI and get it working.**

Specifically, the “claim $BLD,” “stake buildoor,” and “unstake buildoor” buttons should invoke the relevant instructions on the staking program.

- - - - - - -

As always, give this a shot independently. It’s not a trivial task so it may take a few hours or more.

 Once you’ve either finished or feel like you’re at your wit’s end, feel free to watch the upcoming videos walking through one possible solution in the next lessons.


#### Styling additions
Back to building out more of the UI, first we'll add some colors to the theme in our app file (/<project-name>/pages/_app.tsx). 

```tsx
const colors = {
  background: "#1F1F1F",
  accent: "#833BBE",
  bodyText: "rgba(255, 255, 255, 0.75)",
  secondaryPurple: "#CB8CFF",
  containerBg: "rgba(255, 255, 255, 0.1)",
  containerBgSecondary: "rgba(255, 255, 255, 0.05)",
  buttonGreen: "#7EFFA7",
}
```

#### NewMint routing
We'll navigate to the *NewMint* file (/<project-name>/pages/newMint.tsx) to implement the `handleClick` function which will route to a new page upon staking.
    
First, let's call `useRouter`, don't forget check for those pesky imports.
   
`const router = useRouter()`

Now jump into the event of this async function, and route to our new page, which we'll call `stake`. We'll also pass long the image since we already got it from the image source, so we don't have to load it again.
    
```tsx
const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (event) => {
      router.push(`/stake?mint=${mint}&imageSrc=${metadata?.image}`)
    },
    [router, mint, metadata]
  )
```
    
Alas, it is currently a dead path and would give us an error, so let's go create the actual page. This will be a new file in the pages directory (/<project-name>/pages/stake.tsx).
    
#### Stake landing page, left half
Let's create a NextPage for `Stake` and make sure the 'next' library import happens.
    
```tsx
const Stake: NextPage<StakeProps> = ({ mint, imageSrc }) => {
    return(
    <div></div>
    )
}
```
    
Let's create those all important props.
    
```tsx
interface StakeProps {
  mint: PublicKey
  imageSrc: string
}
```

Alright, we're moving alone here, so... a quick check with `npm run dev`, to make sure the front-end is rendering properly.
    
If you've been doing a lot of minting, you may want to reset your candy machine. 🍬📠 
    
Things are looking *niccceeee*.
    
**A brief break from the front end**...it is a best practice is to create environment variables which you can use in your front-end. Create an `env.local` file at the top level directory, and use this format
`NEXT_PUBLIC_<name of what you want>` to name your variables, which will then it will get injected into the browser side code, so then you can use it in your files. Then go on to replace the hard-coded keys in your code.
    
**And back to the stake page**...let's go address what we actually want to render on the page. We'll use a number of items from Chakra, so make sure your imports are autocompleting, or add them manually. If you're a front-end guru, feel free to evolve the design here, otherwise just follow along with my beautiful pixel skills. 👾👾👾
    
A lot of this is similar to what we've done before for our other pages, here are a couple of items to pay attention to:

1. There is a staking check with `isStaking` that affects whether the page will say "STAKING" or "UNSTAKED". This requires a `useState` which is initially set to `false`.

    `const [isStaking, setIsStaking] = useState(false)`

2. We want to display the level of the staker, so another useState is needed.
    
    `const [level, setLevel] = useState(1)`

Let's do another `npm run dev`...and ah, yes, we need some props so the page can display an image when we first visit, so let's make sure we call getInitialProps at the bottom of the file:
    
```tsx
Stake.getInitialProps = async ({ query }: any) => {
  const { mint, imageSrc } = query

  if (!mint || !imageSrc) throw { error: "no mint" }

  try {
    const mintPubkey = new PublicKey(mint)
    return { mint: mintPubkey, imageSrc: imageSrc }
  } catch {
    throw { error: "invalid mint" }
  }
}
```

#### Stake landing page, right half && the Stake Options Display component
Alright, we have the left half of the page mostly done, let's now focus on the right side, we need another VStack which will have some separate logic in it, for what needs to be displayed. Soooo, let's create a separate component called `StakeOptionsDisplay` (/<project-name>/components/StakeOptionsDisplay.tsx).
    
An obvious check here will be whether the buildoor is staking or not, we can start with that check, and build out the VStack. 
    
```tsx
export const StakeOptionsDisplay = ({
  isStaking,
  
}: {
  isStaking: boolean
  
}) => {
    return(
    )
}
```
    
While you follow along the design code, the props we'll be checking in various parts are:

1. isStaking will either display number of days staking, or "Ready to stake."
2. daysStaked, as a number
3. totalEarned, as a number
4. claimable, as a number
    
Here's the final product of what needs to be rendered, this is for those of you who prefer to paste the front-end code :P
    
```tsx
 return (
    <VStack
      bgColor="containerBg"
      borderRadius="20px"
      padding="20px 40px"
      spacing={5}
    >
      <Text
        bgColor="containerBgSecondary"
        padding="4px 8px"
        borderRadius="20px"
        color="bodyText"
        as="b"
        fontSize="sm"
      >
        {isStaking
          ? `STAKING ${daysStaked} DAY${daysStaked === 1 ? "" : "S"}`
          : "READY TO STAKE"}
      </Text>
      <VStack spacing={-1}>
        <Text color="white" as="b" fontSize="4xl">
          {isStaking ? `${totalEarned} $BLD` : "0 $BLD"}
        </Text>
        <Text color="bodyText">
          {isStaking ? `${claimable} $BLD earned` : "earn $BLD by staking"}
        </Text>
      </VStack>
      <Button
        onClick={isStaking ? handleClaim : handleStake}
        bgColor="buttonGreen"
        width="200px"
      >
        <Text as="b">{isStaking ? "claim $BLD" : "stake buildoor"}</Text>
      </Button>
      {isStaking ? <Button onClick={handleUnstake}>unstake</Button> : null}
    </VStack>
  )
```
    
As you've noticed, we need to build functions for `handleStake` and `handleClaim`, and `handleUnstake` -- we'll come back to these later in this core.
    
...and back to the stake file (/<project-name>/pages/stake.tsx) to import this component, and its necessary props.
    
#### Gear and Loot box component
Finally, let's build another component for the Gear and Loot boxes, we can call it ItemBox (/<project-name>/components/ItemBox.tsx).
    
This is a relatively simple one, just follow along with the video, and feel free to compare your code with this.
    
```tsx
import { Center } from "@chakra-ui/react"
import { ReactNode } from "react"

export const ItemBox = ({
  children,
  bgColor,
}: {
  children: ReactNode
  bgColor?: string
}) => {
  return (
    <Center
      height="120px"
      width="120px"
      bgColor={bgColor || "containerBg"}
      borderRadius="10px"
    >
      {children}
    </Center>
  )
}
```
    
That's it, feel free to move things around, design it as you'd like. Next we'll jump into staking program and add token stuff to it.

Nice work, we know this is getting more dense, and has a lot more detailed work -- take your time, review the code, and hit us up in Discord if you're not grokking something.
    