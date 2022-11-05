Now that we have the wallet connection all set up, let's make our ping button actually do something!

Here's what 'PingButton.tsx' should look like: 
```ts
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as Web3 from '@solana/web3.js'
import { FC } from 'react'
import styles from '../styles/PingButton.module.css'

const PROGRAM_ID = new Web3.PublicKey("ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa")
const PROGRAM_DATA_PUBLIC_KEY = new Web3.PublicKey("Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod")

export const PingButton: FC = () => {
	const { connection } = useConnection();
	const { publicKey, sendTransaction } = useWallet();

	const onClick = () => {
		if (!connection || !publicKey) { 
			alert("Please connect your wallet first lol")
			return
		}

		const programId = new Web3.PublicKey(PROGRAM_ID)
		const programDataAccount = new Web3.PublicKey(PROGRAM_DATA_PUBLIC_KEY)
		const transaction = new Web3.Transaction()

		const instruction = new Web3.TransactionInstruction({
			keys: [
				{
					pubkey: programDataAccount,
					isSigner: false,
					isWritable: true
				},
			],
			programId
		});

		transaction.add(instruction)
		sendTransaction(transaction, connection).then(sig => {
			console.log(`Explorer URL: https://explorer.solana.com/tx/${sig}?cluster=devnet`)
		})
	}

	return (
		<div className={styles.buttonContainer} onClick={onClick}>
			<button className={styles.button}>Ping!</button>
		</div>
	)
}
```

A bunch of this should look pretty familiar to you - we're doing the exact same thing we did on our local client, just with React hooks! 

Time to test it out. Make sure your wallet is on the devnet - Settings -> Developer settings -> change network. Connect your wallet and hit that ping button, here's what you'll see:

![](https://hackmd.io/_uploads/ByAIZQnzj.png)

If you click confirm, your console will print out the transaction link. Just like before, scroll to the bottom and you'll see the number has gone up 🚀

You can now let users interact with apps! That $10k product you made last section? It is now a million dollar product. Think of all the programs out there - Metaplex, Serum, anything in the Solana Program Library - you now have the skills to hook them up to a UI and let people use them. You, my friend, can build the future. 

#### 🚢 Ship challenge - SOL sender
Time to flex those muscles.

In this challenge, use this [starter code](https://github.com/buildspace/solana-send-sol-frontend/tree/starter) to create an application that lets a user connect their Phantom wallet and send SOL to another account. Make sure you switch to the starter branch with `git checkout starter` after cloning.

Do this with two key steps:

* Wrap the starter application in the appropriate context providers.
* In the form component, set up the transaction and send it to the user’s wallet for approval.

At the end it should look like this!

![](https://hackmd.io/_uploads/rk1F473zs.png)

Don't forget to validate addresses!

When you're done, compare your solution to the solution code [here](https://github.com/buildspace/solana-send-sol-frontend/tree/main).
