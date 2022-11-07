Writing data to network accounts is only half the battle, the other half is reading it. In the first section, we used functions built into the Web3.js library to read stuff. That's only possible for absolutely essential data like balances and transaction details. As we saw in last section, all the good stuff is in PDAs.

#### 🧾 Program Derived Addresses
Accounts are talk of the town with Solana. If you have heard the word account, you probably have caught someone talking about PDAs. A PDA is a special type of account on Solana used for storing data. **Except it isn't an account** - they actually go by *Addresses* instead of accounts because they don't have private keys. They can only be controlled by the program that created them.

![](https://hackmd.io/_uploads/ryYMLtRnq.png)

Regular Solana accounts are made with the [Ed25519](https://ed25519.cr.yp.to/) signature system - something that gives us a public key *and* a private key. Since PDAs are controlled by programs, they don't *need* private keys. So we make PDAs from addresses that are not on the Ed25519 curve.

![](https://hackmd.io/_uploads/SkSYqg-Qi.png)

Sometimes,`findProgramAddress` gives us a key that is on the curve (meaning it has a private key too) so we add a an optional "bump" parameter to take it off the curve.

That's it. You don't need to understand Ed25519, or even what a digital signature algorithm is. All you need to know is that PDAs look like regular Solana addresses and are controlled by programs.

The reason you need to know how PDAs work is because they're a deterministic way for on-chain and off-chain programs to locate data. Think of it like a key-value store. `seeds`, `programId` and `bump` combine to make the key, and the value whatever the network has stored at that address. This allows us to reliably and consistently find data stored on the network if we know what the key is.

Thanks to PDAs, we have a universal database accessible by all programs on Solana. Think back to the first program we interacted with - we pinged it and it incremented a number. Here's how you might find data shared by all accounts interacting with a program:

![](https://hackmd.io/_uploads/H1h-1W-7i.png)

This is sorta like a global variable in Javascript.

What if you wanted to store a separate counter for each user? Use their public key as the seed:
![](https://hackmd.io/_uploads/rJ8ZgbWQs.png)

Maybe you wanna make an on-chain note taking system where every user can store their own notes? Combine public key with an identifier:

![](https://hackmd.io/_uploads/rk3Ngbb7o.png)

Just remember that either you or the caller must **pay** to store stuff and there's a **10 megabyte** limit per account, so you need to be intentional with what you choose to put on-chain.

#### 🎢 Deserialization
Once you've located the account you want to read from, you'll need to deserialize the data so your apps can work with it. Think back to the first thing we learned in this program - accounts and what they contain. Here's a refresher:

| Field      | Description                                    |
| ---------- | ---------------------------------------------- |
| lamports   | The number of lamports owned by this account   |
| owner      | The program owner of this account              |
| executable | Whether this account can process instructions (is executable)  |
| data       | The raw data byte array stored by this account |
| rent_epoch | The next epoch that this account will owe rent |

The data field contains a massive array of bytes. Just like how we converted readable data to bytes for instructions, we'll do the opposite here: convert an array of bytes to data our apps can work with. This is when the real magic starts and you truly feel like you're surfing on glass 😎

We meet our old, new best friend Mr Borsh here:
![](https://hackmd.io/_uploads/rkye7WZ7i.png)

The steps are similar to what we did with serialization:
1. Create a schema/map of what's stored in the byte array
2. Use the schema to decode the data
3. Extract the items we want 

This should be feeling familiar, but if not, it'll make sense when we put it into action!

#### Build a deserializer 
Ever thought you'd be building a deserializer? Welp -- we're gonna pick up where we left off with our movie review app. You can continue with the project you had last section (recommended) or you can set up with a finished version:

```
git clone https://github.com/buildspace/solana-movie-frontend.git
cd solana-movie-frontend
git checkout solution-serialize-instruction-data
npm i 
```

When you run `npm run dev`, you'll see a bunch of mock data. Unlike fake yeezys, fake data is lame. Let's keep it real in `Movie.ts` (only copy/paste the new stuff):

```ts
import * as borsh from '@project-serum/borsh'

export class Movie {
	title: string;
	rating: number;
	description: string;

	...

        static borshAccountSchema = borsh.struct([
		borsh.bool('initialized'),
		borsh.u8('rating'),
		borsh.str('title'),
		borsh.str('description'),
	])

	static deserialize(buffer?: Buffer): Movie|null {
		if (!buffer) {
			return null
		}

		try {
			const { title, rating, description } = this.borshAccountSchema.decode(buffer)
			return new Movie(title, rating, description)
		} catch(error) {
			console.log('Deserialization error:', error)
			return null
		}
	}
}
```

Just like with serializing, we've got a schema and a method. The schema has:

1. `initialized` as a boolean representing whether or not the account has been initialized.
2. `rating` as an unsigned, 8-bit integer representing the rating out of 5 that the reviewer gave the movie.
3. `title` as a string representing the title of the reviewed movie.
4. `description` as a string representing the written portion of the review.

Looks familiar! The good stuff is in `deserialize`. The return type here can be `Movie` OR `null`, since it's possible the account doesn't have *any* data in it at all.

Finally, we'll need to fetch data from the PDA use this method on page load. We're doing this in `MovieList.tsx`:

```ts
import { Card } from './Card'
import { FC, useEffect, useState } from 'react'
import { Movie } from '../models/Movie'
import * as web3 from '@solana/web3.js'

const MOVIE_REVIEW_PROGRAM_ID = 'CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN'

export const MovieList: FC = () => {
    const connection = new web3.Connection(web3.clusterApiUrl('devnet'))
    const [movies, setMovies] = useState<Movie[]>([])

    useEffect(() => {
        connection.getProgramAccounts(new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID))
        .then(async (accounts) => {
            const movies: Movie[] = accounts.reduce((accum: Movie[], { pubkey, account }) => {
                const movie = Movie.deserialize(account.data)
                if (!movie) {
                    return accum
                }

                return [...accum, movie]
            }, [])
            setMovies(movies)
        })
    }, [])
    
    return (
        <div>
            {
                movies.map((movie, i) => <Card key={i} movie={movie} /> )
            }
        </div>
    )
}
```

Just like before, we set up imports and a connection. The main changes are in the `useEffect`.

```ts
connection.getProgramAccounts(new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID))
```
Before we can fetch the movie reviews, we need to fetch the accounts that contain them. We do this by getting **all** the program accounts for the movie reivew program with our reliable friend `getProgramAccounts`. 

```ts
        .then(async (accounts) => {
            const movies: Movie[] = accounts.reduce((accum: Movie[], { pubkey, account }) => {
                // Try to extract movie item from account data
                const movie = Movie.deserialize(account.data)
                
                // If the account does not have a review, movie will be null
                if (!movie) {
                    return accum
                }

                return [...accum, movie]
            }, [])
            setMovies(movies)
        })
```
To store our movie reviews, we'll create an array of type `Movie`. To populate it, we'll use `reduce` to deserialize each account and try to destructure a `movie` item. If the account has movie data in it this will work! If it doesn't, movie will be null and we can just return the accumulated movie list.

If this seems confusing, walk through the code line by line and make sure you know how the [`reduce`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) method works.

Make sure you're running `npm run dev` and head over to `localhost:3000`, you should see a bunch of random reviews that other builders have added :D

#### 🚢 Ship challenge 
We can serialize and deserialize data now. Nice. Let's switch gears to the Student Intros app we started in the serialization section.

The goal: update the app to fetch and deserialize the program's account data. The Solana program that supports this is at: `HdE95RSVsdb315jfJtaykXhXY478h53X6okDupVfY9yf`

You can start with where you left of in the last challenge or you can grab the code from [this](https://github.com/buildspace/solana-student-intros-frontend/tree/solution-serialize-instruction-data) repository. Make sure you're starting from the `solution-serialize-instruction-data` branch.

**Hints:**
Create the account buffer layout in `StudentIntro.ts`. The account data contains:
1. `initialized` as an unsigned, 8-bit integer representing whether or not the account has been initialized
2. `name` as a string representing the student's name
3. `message` as a string representing the message the student shared about their Solana journey

Create a static method in `StudentIntro.ts` that will use the buffer layout to deserialize an account data buffer into a `StudentIntro` object.

In the `StudentIntroList` component's `useEffect`, get the program's accounts and deserialize their data into a list of `StudentIntro` objects.

**Solution code:**
As always, try to do this independently first, but if you get too stuck or just want to compare your solution to ours, have a look at the `solution-deserialize-account-data` branch in [this](https://github.com/buildspace/solana-student-intros-frontend/tree/solution-deserialize-account-data) repository.

Good luck!
