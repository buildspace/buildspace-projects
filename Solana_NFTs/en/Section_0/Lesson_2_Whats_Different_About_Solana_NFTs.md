### 🐸 Metaplex

To quickly review, our goal is to create a web app that lets users **connect their wallet, click mint, and receive an NFT from our collection in their wallet.** Simple enough!

We'll be doing this using [Metaplex](https://www.metaplex.com).

Basically, Metaplex is the NFT standard on Solana and has created a set of standardized tools and libraries to create NFTs. Over $1 billion in sales have been done so far on NFTs that use the Metaplex standard.

So... how does it work?

Well, let's compare! On Ethereum, to create an NFT what we'd do is create our own custom OpenZeppelin ERC-721 NFT contract and deploy that, right? Then when we want to mint an NFT, we just call the mint function on our custom contract.

Using Metaplex is **very** different. With Metaplex we **don't** need to write our own contract. Metaplex has already deployed its own standard NFT contracts that **any dev** can interact with and build their own NFT collections on.

This is kinda wild. It's like a smart-contract-as-a-service lol.

Some of you may be like "wtf that's lame I wanna create a custom program myself". You can totally do that. [Here's](https://github.com/metaplex-foundation/metaplex-program-library/blob/master/candy-machine/program/src/lib.rs) the code. But, it's quite complex. Why? Mostly because Solana allows for parallel transactions. So, your code needs to account for cases like "if 5 people go to mint an NFT at the same time and there are only 2 left, who get's it?".

In Ethereum this is easy. It's all synchronous and atomic so we don't need to think about that. But, part of Solana's sell is that it can do parallel transactions which makes it faster. **But, this makes the code more complex.** So, tools like Metaplex are extremely useful. They handle the edge cases for us and give us a smart contract we can interact with.

### 🍭 Candy Machine

We'll be talking about this thing called a "candy machine" a lot throughout the project. A candy machine is what Metaplex calls a basic NFT drop where users can come in, click mint, and get an NFT.

One thing that's very special about the candy machine is it won't accept a user's funds if there are no more NFTs to sell. Now, this may seem like a very trivial thing but in the world of parallel computing it's actually difficult. For example, lets look at this case:

1. There is one NFT left.
2. Person A and Person B click mint at the same time.
3. In parallel, the smart contract checks if Person A and Person B have the funds to pay for the NFT. They both do. It checks if there are any NFTs left, there are.
4. The programs withdraws funds from Person A's account and Person B's accounts to pay for the NFT.
5. The program goes to mint an NFT for Person B who happened to be processed first in parallel. Person A gets an error like — "No more NFTs".
6. Person A loses the race and is sad, and has now lost money on an NFT they never received. Person B is happy.

This is a classic problem in parallel computing. The fix is to use something called a [mutex](https://doc.rust-lang.org/std/sync/struct.Mutex.html) along with an [atomic transaction](https://en.wikipedia.org/wiki/Atomicity_(database_systems)) which are both decently complex to implement.

**Metaplex's candy machine implements this stuff for us :).**

Candy machine also has some other goodies it gives us as well which we'll cover later, but I hope this overview helps later down the line!! Feel free to come back to it once you get more into the candy machine stuff.

Note: We won't be explaining what NFTs are here. If you're confused around what an NFT is, check out [this](https://github.com/buildspace/buildspace-projects/blob/main/NFT_Collection/en/Section_1/Lesson_1_What_Is_A_NFT.md) quick bonus section we wrote.
