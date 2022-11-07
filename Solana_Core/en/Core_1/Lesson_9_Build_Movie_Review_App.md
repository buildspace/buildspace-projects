To bring it all together, we're gonna build an on-chain movie review app - it'll let anyone submit reviews for their favourite movies, kinda like Rotten Tomatoes.

Set up the starter code in your Solana workspace:
```
git clone https://github.com/buildspace/solana-movie-frontend/
cd solana-movie-front-end
git checkout starter
npm i
```

If you run `npm run dev` you should see this on `localhost:3000`:

![](https://hackmd.io/_uploads/SkkWlupGi.png)

This is a plain Next.js app with some template components and some Solana dependencies installed to help you save time. There's a few mock reviews in there, take a look at the various components to get a feel for the app.

You'll notice we've moved the wallet context provider from `_app.tsx` to it's own component. It works the same, it's just more performant to keep it separate with bigger apps. All the app does right now is log your review into the console, we're going to set up the `handleTransactionSubmit` function in `Form.tsx`. Let's gooooooooooooo

#### 🗺 Define the schema
The first step in serializing is to create a schema/map for the data we want to serialize. We need to tell Borsh what the data will be called and the sizes of each item.

Start by installing `borsh`, run this in your terminal:
```
npm install @project-serum/borsh
```

Next head over to `Movie.ts` to import borsh and add the schema in the Movie class (do not copy paste this):
```ts
// We're importing borsh
import * as borsh from '@project-serum/borsh'

export class Movie {
    title: string;
    rating: number;
    description: string;
    
    // The constructor and the mocks will remain the same
    constructor(title: string, rating: number, description: string) {}
    static mocks: Movie[] = []

    // Here's our schema!
    borshInstructionSchema = borsh.struct([
		borsh.u8('variant'),
		borsh.str('title'),
		borsh.u8('rating'),
		borsh.str('description'),
	])
    
}
```

The Movie Review program expects instruction data to contain:

1. `variant` as an unsigned, 8-bit integer representing which instruction should be executed (in other words which function on the program should be called).
2. `title` as a string representing the title of the movie that you are reviewing.
3. `rating` as an unsigned, 8-bit integer representing the rating out of 5 that you are giving to the movie you are reviewing.
4. `description` as a string representing the written portion of the review you are leaving for the movie.

The schema needs to match what the program expects - including the order of items in the struct. When the program reads your data, it will deserialize in a defined order, if your order is different, the data it creates will be invalid. Since we're working with an already deployed program, I've given you the schema. Usually, you'd read the docs or look at the program code yourself!


#### 🌭 Create the serialize method
Now that we know what our data will look like, we need to write the method that will serialize it. Add this right below the schema in the Movie class:

```ts
    serialize(): Buffer {
		const buffer = Buffer.alloc(1000)
		this.borshInstructionSchema.encode({ ...this, variant: 0 }, buffer)
		return buffer.slice(0, this.borshInstructionSchema.getSpan(buffer))
	}
```
First we create an oversized buffer - this one is 1000 bytes. Why 1000 bytes? Cause I know it's enough to fit everything I want and leave extra space at the end. 

Next we use the schema we created to encode our data. `encode` takes in two values - the data we want to encode and where we want to store it. `this` refers to the current object we're in - so we deconstruct the movie object and pass it in with `...this`, it's like passing in `{ title, rating, description, variant }`. 

Finally - we remove the extra space in our buffer. `getSpan` is sorta like `array.length` - it gives us the index of the last used item in the buffer based on the schema so our buffer only contains the data we need and nothing else.

Here's what my final `Movie.ts` looks like:
```ts
import * as borsh from '@project-serum/borsh'

export class Movie {
    title: string;
    rating: number;
    description: string;

    constructor(title: string, rating: number, description: string) {
        this.title = title;
        this.rating = rating;
        this.description = description;
    }

    static mocks: Movie[] = [
        new Movie('The Shawshank Redemption', 5, `For a movie shot entirely in prison where there is no hope at all, shawshank redemption's main massage and purpose is to remind us of hope, that even in the darkest places hope exists, and only needs someone to find it. Combine this message with a brilliant screenplay, lovely characters and Martin freeman, and you get a movie that can teach you a lesson everytime you watch it. An all time Classic!!!`),
        new Movie('The Godfather', 5, `One of Hollywood's greatest critical and commercial successes, The Godfather gets everything right; not only did the movie transcend expectations, it established new benchmarks for American cinema.`),
        new Movie('The Godfather: Part II', 4, `The Godfather: Part II is a continuation of the saga of the late Italian-American crime boss, Francis Ford Coppola, and his son, Vito Corleone. The story follows the continuing saga of the Corleone family as they attempt to successfully start a new life for themselves after years of crime and corruption.`),
        new Movie('The Dark Knight', 5, `The Dark Knight is a 2008 superhero film directed, produced, and co-written by Christopher Nolan. Batman, in his darkest hour, faces his greatest challenge yet: he must become the symbol of the opposite of the Batmanian order, the League of Shadows.`),
    ]

    borshInstructionSchema = borsh.struct([
		borsh.u8('variant'),
		borsh.str('title'),
		borsh.u8('rating'),
		borsh.str('description'),
	])
    
    serialize(): Buffer {
		const buffer = Buffer.alloc(1000)
		this.borshInstructionSchema.encode({ ...this, variant: 0 }, buffer)
		return buffer.slice(0, this.borshInstructionSchema.getSpan(buffer))
	}
}
```

That's it! We're done with the serialization part. Let's review some movies :popcorn: 

#### 🤝 Creating transactions with data
The final piece of the puzzle is taking the users data, serializing it with the method we just made and creating a transaction with it.

Get started by updating the imports in `Form.tsx`:
```ts
import { FC } from 'react'
import { Movie } from '../models/Movie'
import { useState } from 'react'
import { Box, Button, FormControl, FormLabel, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Textarea } from '@chakra-ui/react'
import * as web3 from '@solana/web3.js'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
```

We'll need to set up an RPC connection and get wallet details before the `handleSubmit` function:
```ts
	const { connection } = useConnection();
	const { publicKey, sendTransaction } = useWallet();
```

And now the meat, the `handleTransactionSubmit` function. This will look pretty familiar to your previous transactions, except for the serialization bit: make a transaction, make an instruction, submit transaction. 

Here's what the first half will look like:
```ts
    const handleTransactionSubmit = async (movie: Movie) => {
        if (!publicKey) {
            alert('Please connect your wallet!')
            return
        }
    
        const buffer = movie.serialize()
        const transaction = new web3.Transaction()
    
        const [pda] = await web3.PublicKey.findProgramAddress(
            [publicKey.toBuffer(), new TextEncoder().encode(movie.title)],
            new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID)
        )
    }
```
You should recognize all of this except `pda`. Think back to the requirements of an instruction. It needs the program ID it will interact with, optional data, and the list of accounts it will read from or write to. Since we're submitting data for storage on the network, a new account will be created to store it (remember Patrick from Spongebob - programs are stateless and everything is in accounts).

Patrick was referencing PDAs (Program Derived Address)! This is an account for storing our movie review. You may start noticing that we run into the good 'ol classic "chicken and egg" situation...

![](https://hackmd.io/_uploads/Hyle1yZQj.png)

We need to know the account address to make a valid transaction, and we need the transaction to be processed to create the account. The solution? A theoretical egg. If both the transaction creators, and the program, use the same process to choose the address, we can **derive** the address before the transaction is processed.

That's what the `web3.PublicKey.findProgramAddress` method is doing. It takes in two variables: the seeds, and the program that generated it (the movie review program). In our case the seeds are the the senders' address and the title of the movie. With this app, I'm telling you the seed requirements, usually you'd either read the docs, look at the program code, or maybe reverse engineer it.

To complete the `handleTransactionSubmit` function all you need to do is a create an instruction and send it, here's the full code: 
```ts
    const handleTransactionSubmit = async (movie: Movie) => {
        if (!publicKey) {
            alert('Please connect your wallet!')
            return
        }
    
        const buffer = movie.serialize()
        const transaction = new web3.Transaction()
    
        const [pda] = await web3.PublicKey.findProgramAddress(
            [publicKey.toBuffer(), new TextEncoder().encode(movie.title)],
            new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID)
        )
    
        const instruction = new web3.TransactionInstruction({
            keys: [
                {
                    // Your account will pay the fees, so it's writing to the network
                    pubkey: publicKey,
                    isSigner: true,
                    isWritable: false,
                },
                {
                    // The PDA will store the movie review 
                    pubkey: pda,
                    isSigner: false,
                    isWritable: true
                },
                {
                    // The system program will be used for creating the PDA
                    pubkey: web3.SystemProgram.programId,
                    isSigner: false,
                    isWritable: false
                }
            ],
            // Here's the most important part!
            data: buffer,
            programId: new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID)
        })
    
        transaction.add(instruction)
    
        try {
            let txid = await sendTransaction(transaction, connection)
            console.log(`Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`)
        } catch (e) {
            alert(JSON.stringify(e))
        }
    }
```

Go over the code comments, I explain why we need each address in the instruction keys array. 

And thats a wrap! Make sure your wallet is on the devnet and that you have devnet SOL and head over to `localhost:3000`. Submit a review and visit the explorer link logged in your console. Scroll all the way down and you'll see your movie name along with a bunch of other stuff:

![](https://hackmd.io/_uploads/ryoHHy-ms.png)

Wow. You just wrote custom data the Solana network. 

Give yourself a pat on the back, this is not simple stuff! By this point some people may have dropped off from this program, give them some motivation and show them what you've built! If you've gotten this far, I have no doubt you'll get all the way to the end :)


#### 🚢 Ship challenge
Time to give that brain some more wrinkles 🧠

Go ahead and create an application that lets builders in Solana Core introduce themselves! We are going to be using that Solana program at this address `HdE95RSVsdb315jfJtaykXhXY478h53X6okDupVfY9yf`. It will end up looking similar to the Movie Review app:

![](https://hackmd.io/_uploads/ryJ4PJWms.png)

**Starter code**
You can set up using

```
git clone https://github.com/buildspace/solana-student-intros-frontend.git
cd solana-student-intros-frontend
git checkout starter
npm i
```
Hints:
The program expects the instruction data to contain the following in order:
1. `variant` as an unsigned, 8-bit integer representing the instruction to call (should be 0 in this case)
2. `name` as a string
3. `message` as a string

Note that the program derives each Student Intro account using the PublicKey of the connected wallet (and nothing else). This means that each PublicKey can only initialize one Student Intro account and a transaction will fail if you submit twice using the same PublicKey. 

As always, try to do this independently first, but if you get too stuck or just want to compare your solution to ours, have a look at the `solution-serialize-instruction-data` branch in [this](https://github.com/buildspace/solana-student-intros-frontend/tree/solution-serialize-instruction-data) repository.
