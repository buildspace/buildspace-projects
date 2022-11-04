Now that we've deployed our program, we can interact with it. You've done this a bunch already in the previous sections! You can either set up a local client with `create-solana-client` like before or use the playground.

I'm gonna stick with the playground cause it's faster :P

First you'll need to get your program ID. This can be found under the "Program Credentials" tab:
![](https://hackmd.io/_uploads/SJWuDC1Nj.png)

Now for our TS script. Head back to the "Explorer" tab and open up `client.ts` under the `Client` section on the left. Here's what we'll need:
```ts
const programId = new web3.PublicKey(
  "REPLACE_WITH_YOUR_PROGRAM_ID"
);

async function sayHello(
  payer: web3.Keypair
): Promise<web3.TransactionSignature> {
  const transaction = new web3.Transaction();

  const instruction = new web3.TransactionInstruction({
    keys: [], // We're not using any accounts yet
    programId,
    // No need to add data here!
  });

  transaction.add(instruction);

  const transactionSignature = await web3.sendAndConfirmTransaction(
    pg.connection,
    transaction,
    [payer]
  );

  return transactionSignature;
}

async function main() {
  const transactionSignature = await sayHello(pg.wallet.keypair);

  console.log(
    `Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
  );
}

main();
```
This should be looking familiar. The two things that change with the playground are how we access our keypair and how we connect to the devnet. The `pg` object is avaiable to us globally and contains both of these.

You should see a transaction logged in the console when you run this script. Open up the link and scroll all the way down. You'll see your message!

![](https://hackmd.io/_uploads/HJzPY014o.png)

#### 🚢 Ship challenge
Now it’s your turn to build something independently. Because we're starting with very simple programs, the program you make will look almost identical to what we just created. It's useful to try and get to the point where you can write it from scratch without referencing prior code, so try not to copy and paste here.

Write a new program in the Solana Playground that uses the msg! macro to print your own message to the program log. Build and deploy your program like we did in the demo. Write a client-side script that invokes your newly deployed program, then use Solana Explorer to check that your message was printed in the program logs. 

This is a pretty freeform challenges, so feel free to go off script and experiment. Get creative and have fun!

In addition to creating a simple program, it’s probably worth playing around with Rust a bit more. Check out the [Rust book](https://doc.rust-lang.org/book/) and use the [Rust Playground](https://play.rust-lang.org/) to get a better idea of how the language works so you can be ahead of the curve when we dive into more challenging Solana Program topics.

Maybe make the program log out a randomised message using a combination of words instead of a static message? 
