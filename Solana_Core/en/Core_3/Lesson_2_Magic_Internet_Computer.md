We've done a lot of really cool stuff so far. We've built clients of all sorts, created NFT collections, minted SPL tokens, and even built UIs to let other people interact with them. However, everything we've done so far has been with existing programs. 

You are now ready to become full-stack Solana developer and learn how to write your own programs.

Solana's ability to run arbitrary executable code is part of what makes it so powerful. Solana programs, similar to "smart contracts" in other blockchain environments, are quite literally the backbone of the Solana ecosystem. What this means is that Solana is basically a universal computer that **anyone** on the internet can access and run. You might be wondering *why* that's such a big deal, it definitely doesn't *feel* like it.

![](https://media.giphy.com/media/OijlHruJk544wGchMP/giphy.gif)

Think back to a time when your computer didn't have internet access. If you're a boomer like me, that may have been ~15 years ago when permanent internet wasn't a thing. Or maybe your mom turned off the wifi cause you were playing videos games nonstop. When not connected to all the other computers on the globe, your computer feels a lot less powerful.

That's exactly what not being connected to Solana is going to feel like. Blockchain networks are the next evolution of the internet - it's why this whole thing is being called "Web 3.0". Being able to securely and permissionlessly run repeatable code on opens a whole new world of possibilities. 

**It doesn't feel as magical a ”statically typed” languageyet because the magic is still being built by people like you.** The collection of programs grows daily as developers and creators dream up and deploy new programs.

#### 🤔 Wtf is Rust  
Solana programs are written in Rust - a low level programming language like C that is FASTTTTTTT. Before we get to the traditional "Hello World" program, I wanna talk a bit about *why* Rust is considered so difficult.

In short: Rust feels hard because it has a lot of rules. Think of video games with steep learning curves - DOTA, League of Legends, Starcraft, (even Chess or CSGO lol). These games have hundreds of unique characters/items/abilities, each with their own rules and interactions. To be able to win at these games, you have to learn all the rules and be aware of how they interact with each other.

Rust is a lot like that. It's a very opinionated language that forces you to think about your code in a different way. It's not a language you can just pick up and start writing programs in - it's a language that you have to learn and understand. 

This isn't meant to scare you - learning Rust isn't as hard as learning DOTA 💀. I just want to set the expectation and tell you that **WE HAVE IT FIGURED OUT**. Rust can be a lotta fun, it just takes a bit more effort than you're used to :) 

Just like with video games, we'll focus on one thing at a time, starting with the easy stuff and battling our way through the hard stuff as we level up ⚔️. 

We'll start with the bare minimum concepts we need to know to build our `Hello World` program - 
1. The module system
2. The Solana Program Entry Point
3. Functions
4. Enums
5. [References and borrowing](https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html) (sorta)

#### 🛹 The Solana Playground
We're gonna start our program development journey on the [Solana Playground](https://beta.solpg.io/). It's a browser based IDE that will handle all setup requirements and let us focus on Rust.

Pop it open and create a new project with the Native framework - we're keeping it vanilla 🌼. Anchor is a Rust framework for building on Solana, sorta like React is for the web. We'll learn how to build with it later, stick with Native for now.

You should get a `lib.rs` file with a sort of advanced Hello World program. Get rid of this - we're gonna make a simpler one.

Last thing you wanna do here is set up a playground wallet. You'll see a "Not Connected" button on the bottom left:

![](https://hackmd.io/_uploads/rJqKhKRmi.png)

Click it and it'll generate a Solana wallet for you and fund it with devnet SOL. You can save the keypair if you want, it helps when you're testing programs deployed by a specific keypair. I'm only gonna be building the hello-world program so I don't need it :P

Time to start writing some Rust! 🦀
