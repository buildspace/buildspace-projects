Let’s put all that magic into action!

We’re going to adapt the Movie Review frontend to use Anchor IDL.

#### Download the starter code
- Note, starter code will not run until Anchor Setup complete
- In `./context/Anchor/MockWallet.ts`
- This is a temporary `AnchorWallet` to use before a wallet connects
    
    ```tsx
    import { Keypair } from "@solana/web3.js"
    
    const MockWallet = {
      publicKey: Keypair.generate().publicKey,
      signTransaction: () => Promise.reject(),
      signAllTransactions: () => Promise.reject(),
    }
    
    export default MockWallet
    ```
    

#### Anchor Setup

- In `./context/Anchor/index.tsx`
- Create  `WorkspaceProvider` context, and a `useWorkspace` hook
    - we will use the `useWorkspace` hook to access the `program` object in our components
    - this way, we only have to do the setup once

```tsx
import { createContext, useContext } from "react"
import {
  Program,
  AnchorProvider,
  Idl,
  setProvider,
} from "@project-serum/anchor"
import { MovieReview, IDL } from "./movie_review"
import { Connection, PublicKey } from "@solana/web3.js"
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react"
import MockWallet from "./MockWallet
const WorkspaceContext = createContext({})
const programId = new PublicKey("BouTUP7a3MZLtXqMAm1NrkJSKwAjmid8abqiNjUyBJSr")

interface WorkSpace {
  connection?: Connection
  provider?: AnchorProvider
  program?: Program<MovieReview>
}

const WorkspaceProvider = ({ children }: any) => {
  const wallet = useAnchorWallet() || MockWallet
  const { connection } = useConnection()

  const provider = new AnchorProvider(connection, wallet, {})

  setProvider(provider)
  const program = new Program(IDL as Idl, programId)
  const workspace = {
    connection,
    provider,
    program,
  }

  return (
    <WorkspaceContext.Provider value={workspace}>
      {children}
    </WorkspaceContext.Provider>
  )
}

const useWorkspace = (): WorkSpace => {
  return useContext(WorkspaceContext)
}

export { WorkspaceProvider, useWorkspace }
```

- In `..pages/_app.tsx`
- Wrapped the app in `WorkspaceProvider`
- Now we can use the `useWorkspace` hook in different components to access the `program` object

```rust
import "../styles/globals.css"
import type { AppProps } from "next/app"
import { ChakraProvider } from "@chakra-ui/react"
import WalletContextProvider from "../context/WalletContextProvider"
import { WorkspaceProvider } from "../context/Anchor"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WalletContextProvider>
      <ChakraProvider>
        <WorkspaceProvider>
          <Component {...pageProps} />
        </WorkspaceProvider>
      </ChakraProvider>
    </WalletContextProvider>
  )
}

export default MyApp
```

#### `Form.tsx`

- In `handleSubmit`
    - Implement toggle between `addMovieReview` and `updateMovieReview` instructions
- Note that Anchor can use the IDL to infer PDA accounts and other accounts (system program/ token program), so they do not have to be explicitly passed in

```tsx
import { FC } from "react"
import { useState } from "react"
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Textarea,
  Switch,
} from "@chakra-ui/react"
import * as anchor from "@project-serum/anchor"
import { getAssociatedTokenAddress } from "@solana/spl-token"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { useWorkspace } from "../context/Anchor"

export const Form: FC = () => {
  const [title, setTitle] = useState("")
  const [rating, setRating] = useState(0)
  const [description, setDescription] = useState("")
  const [toggle, setToggle] = useState(true)

  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()

  const workspace = useWorkspace()
  const program = workspace.program

  const handleSubmit = async (event: any) => {
    event.preventDefault()

    if (!publicKey || !program) {
      alert("Please connect your wallet!")
      return
    }

    const [mintPDA] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("mint")],
      program.programId
    )

    const tokenAddress = await getAssociatedTokenAddress(mintPDA, publicKey)

    const transaction = new anchor.web3.Transaction()

    if (toggle) {
      const instruction = await program.methods
        .addMovieReview(title, description, rating)
        .accounts({
          tokenAccount: tokenAddress,
        })
        .instruction()

      transaction.add(instruction)
    } else {
      const instruction = await program.methods
        .updateMovieReview(title, description, rating)
        .instruction()

      transaction.add(instruction)
    }

    try {
      let txid = await sendTransaction(transaction, connection)
      alert(
        `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`
      )
      console.log(
        `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`
      )
    } catch (e) {
      console.log(JSON.stringify(e))
      alert(JSON.stringify(e))
    }
  }

  return (
    <Box
      p={4}
      display={{ md: "flex" }}
      maxWidth="32rem"
      borderWidth={1}
      margin={2}
      justifyContent="center"
    >
      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel color="gray.200">Movie Title</FormLabel>
          <Input
            id="title"
            color="gray.400"
            onChange={(event) => setTitle(event.currentTarget.value)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel color="gray.200">Add your review</FormLabel>
          <Textarea
            id="review"
            color="gray.400"
            onChange={(event) => setDescription(event.currentTarget.value)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel color="gray.200">Rating</FormLabel>
          <NumberInput
            max={5}
            min={1}
            onChange={(valueString) => setRating(parseInt(valueString))}
          >
            <NumberInputField id="amount" color="gray.400" />
            <NumberInputStepper color="gray.400">
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <FormControl display="center" alignItems="center">
          <FormLabel color="gray.100" mt={2}>
            Update
          </FormLabel>
          <Switch
            id="update"
            onChange={(event) => setToggle((prevCheck) => !prevCheck)}
          />
        </FormControl>
        <Button width="full" mt={4} type="submit">
          Submit Review
        </Button>
      </form>
    </Box>
  )
}
```

#### `MovieList.tsx`

- In `fetchMyReviews`
    - Implement filter of `movieAccountState` accounts for reviews of connected wallet
- In `fetchAccounts`
    - Implement fetch all `movieAccountState` accounts
- Implement paging of reviews

```tsx
import { Card } from "./Card"
import { FC, useEffect, useState } from "react"
import {
  Button,
  Center,
  HStack,
  Input,
  Spacer,
  Heading,
} from "@chakra-ui/react"
import { useWorkspace } from "../context/Anchor"
import { useWallet } from "@solana/wallet-adapter-react"
import { useDisclosure } from "@chakra-ui/react"
import { ReviewDetail } from "./ReviewDetail"

export const MovieList: FC = () => {
  const { program } = useWorkspace()
  const [movies, setMovies] = useState<any | null>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [result, setResult] = useState<any | null>(null)
  const [selectedMovie, setSelectedMovie] = useState<any | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const wallet = useWallet()

  useEffect(() => {
    const fetchAccounts = async () => {
      if (program) {
        const accounts = (await program.account.movieAccountState.all()) ?? []

        const sort = [...accounts].sort((a, b) =>
          a.account.title > b.account.title ? 1 : -1
        )
        setMovies(sort)
      }
    }
    fetchAccounts()
  }, [])

  useEffect(() => {
    if (movies && search != "") {
      const filtered = movies.filter((movie: any) => {
        return movie.account.title
          .toLowerCase()
          .startsWith(search.toLowerCase())
      })
      setResult(filtered)
    }
  }, [search])

  useEffect(() => {
    if (movies && search == "") {
      const filtered = movies.slice((page - 1) * 3, page * 3)
      setResult(filtered)
    }
  }, [page, movies, search])

  const fetchMyReviews = async () => {
    if (wallet.connected && program) {
      const accounts =
        (await program.account.movieAccountState.all([
          {
            memcmp: {
              offset: 8,
              bytes: wallet.publicKey!.toBase58(),
            },
          },
        ])) ?? []

      const sort = [...accounts].sort((a, b) =>
        a.account.title > b.account.title ? 1 : -1
      )
      setResult(sort)
    } else {
      alert("Please Connect Wallet")
    }
  }

  const handleReviewSelected = (data: any) => {
    setSelectedMovie(data)
    onOpen()
  }

  return (
    <div>
      <Center>
        <Input
          id="search"
          color="gray.400"
          onChange={(event) => setSearch(event.currentTarget.value)}
          placeholder="Search"
          w="97%"
          mt={2}
          mb={2}
          margin={2}
        />
        <Button onClick={fetchMyReviews}>My Reviews</Button>
      </Center>
      <Heading as="h1" size="l" color="white" ml={4} mt={8}>
        Select Review To Comment
      </Heading>
      {selectedMovie && (
        <ReviewDetail isOpen={isOpen} onClose={onClose} movie={selectedMovie} />
      )}
      {result && (
        <div>
          {Object.keys(result).map((key) => {
            const data = result[key as unknown as number]
            return (
              <Card
                key={key}
                movie={data}
                onClick={() => {
                  handleReviewSelected(data)
                }}
              />
            )
          })}
        </div>
      )}
      <Center>
        {movies && (
          <HStack w="full" mt={2} mb={8} ml={4} mr={4}>
            {page > 1 && (
              <Button onClick={() => setPage(page - 1)}>Previous</Button>
            )}
            <Spacer />
            {movies.length > page * 3 && (
              <Button onClick={() => setPage(page + 1)}>Next</Button>
            )}
          </HStack>
        )}
      </Center>
    </div>
  )
}
```

#### `ReviewDetail.tsx`

- In `handleSubmit`
    - implement `addComment`
- Note that Anchor can use the IDL to infer PDA accounts and other accounts (system program/ token program), so they do not have to be explicitly passed in

```tsx
import {
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Stack,
  FormControl,
} from "@chakra-ui/react"
import { FC, useState } from "react"
import * as anchor from "@project-serum/anchor"
import { getAssociatedTokenAddress } from "@solana/spl-token"
import { CommentList } from "./CommentList"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { useWorkspace } from "../context/Anchor"
import BN from "bn.js"

interface ReviewDetailProps {
  isOpen: boolean
  onClose: any
  movie: any
}

export const ReviewDetail: FC<ReviewDetailProps> = ({
  isOpen,
  onClose,
  movie,
}: ReviewDetailProps) => {
  const [comment, setComment] = useState("")
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  const { program } = useWorkspace()

  const handleSubmit = async (event: any) => {
    event.preventDefault()

    if (!publicKey || !program) {
      alert("Please connect your wallet!")
      return
    }

    const movieReview = new anchor.web3.PublicKey(movie.publicKey)

    const [movieReviewCounterPda] =
      await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from("counter"), movieReview.toBuffer()],
        program.programId
      )

    const [mintPDA] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("mint")],
      program.programId
    )

    const tokenAddress = await getAssociatedTokenAddress(mintPDA, publicKey)

    const transaction = new anchor.web3.Transaction()

    const instruction = await program.methods
      .addComment(comment)
      .accounts({
        movieReview: movieReview,
        movieCommentCounter: movieReviewCounterPda,
        tokenAccount: tokenAddress,
      })
      .instruction()

    transaction.add(instruction)

    try {
      let txid = await sendTransaction(transaction, connection)
      alert(
        `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`
      )
      console.log(
        `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`
      )
    } catch (e) {
      console.log(JSON.stringify(e))
      alert(JSON.stringify(e))
    }
  }

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            textTransform="uppercase"
            textAlign={{ base: "center", md: "center" }}
          >
            {movie.account.title}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack textAlign={{ base: "center", md: "center" }}>
              <p>{movie.account.description}</p>
              <form onSubmit={handleSubmit}>
                <FormControl isRequired>
                  <Input
                    id="title"
                    color="black"
                    onChange={(event) => setComment(event.currentTarget.value)}
                    placeholder="Submit a comment..."
                  />
                </FormControl>
                <Button width="full" mt={4} type="submit">
                  Send
                </Button>
              </form>
              <CommentList movie={movie} />
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  )
}
```

#### `CommentList.tsx`

- In `fetch`
    - fetch `movieComment` accounts and filter for a specific movie review account
- Implement paging of comments

```tsx
import {
  Button,
  Center,
  HStack,
  Spacer,
  Stack,
  Box,
  Heading,
} from "@chakra-ui/react"
import { FC, useState, useEffect } from "react"
import { useWorkspace } from "../context/Anchor"

interface CommentListProps {
  movie: any
}

export const CommentList: FC<CommentListProps> = ({
  movie,
}: CommentListProps) => {
  const [page, setPage] = useState(1)
  const [comments, setComments] = useState<any[]>([])
  const [result, setResult] = useState<any[]>([])
  const { program } = useWorkspace()

  useEffect(() => {
    const fetch = async () => {
      if (program) {
        const comments = await program.account.movieComment.all([
          {
            memcmp: {
              offset: 8,
              bytes: movie.publicKey.toBase58(),
            },
          },
        ])

        const sort = [...comments].sort((a, b) =>
          a.account.count > b.account.count ? 1 : -1
        )
        setComments(comments)
        const filtered = sort.slice((page - 1) * 3, page * 3)
        setResult(filtered)
      }
    }
    fetch()
  }, [page])

  return (
    <div>
      <Heading as="h1" size="l" ml={4} mt={2}>
        Existing Comments
      </Heading>
      {result.map((comment, index) => (
        <Box
          p={4}
          textAlign={{ base: "left", md: "left" }}
          display={{ md: "flex" }}
          maxWidth="32rem"
          borderWidth={1}
          margin={2}
          key={index}
        >
          <div>{comment.account.comment}</div>
        </Box>
      ))}
      <Stack>
        <Center>
          <HStack w="full" mt={2} mb={8} ml={4} mr={4}>
            {page > 1 && (
              <Button onClick={() => setPage(page - 1)}>Previous</Button>
            )}
            <Spacer />
            {comments.length > page * 3 && (
              <Button onClick={() => setPage(page + 1)}>Next</Button>
            )}
          </HStack>
        </Center>
      </Stack>
    </div>
  )
}
```

Run it with:
```tsx
npm run dev
```

Congrats! you made it. Our next lesson is the grand finale for you to build and ship.
