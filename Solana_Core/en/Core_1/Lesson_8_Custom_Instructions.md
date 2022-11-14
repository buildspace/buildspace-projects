You now know how to read data and write to the network with simple transactions. Almost immediately, you'll find yourself looking to send data with your transactions. So let's see what it takes to tell the Solana blockchain your story.

The tricky thing about data in Solana is that programs are **stateless**. Unlike smart contracts in other blockchains like Ethereum, programs do not store any data, they just store logic.

![](https://hackmd.io/_uploads/S1Ondj8h5.png)
Pictured: Founder of Solana, Anatoly Yakovenko, making Solana.

Absolutely nothing is stored inside a Solana program. It doesn't know who the owner is or even who deployed it. Everything is stored inside accounts.

#### 📧 Instruction data
We're gonna peek under the hood for a bit. A lot of what we'll do in this section will be handled for us by libraries like Anchor in practice, but it's important to understand what goes on at the atomic instruction level.

Let's take a step back and look at where instruction data sits. 

![](https://hackmd.io/_uploads/ry_POU6zo.png)

Transactions can have one or more instructions, each instruction can have data. 

The big thing about instruction data is the format - it's **8-bit data**. "Bit" means it's machine code: 1s and 0s. 8 just refers to size, like 32 bit or 64 bit. If your instruction data is not in this format, the Solana runtime will not recognize it.

This is why Solana is so blazing fast! Instead of making the network convert your data, you give it converted data and it just processes it. Imagine if you had all the ingredients for a dish prepared before you started cooking - you'd be able to cook much faster cause you wouldn't have to chop stuff.

**You don't need to know how machine code works.** All you need to remember is that instruction data is of a certain type and that you need to convert your data to that type when you want to include it in instructions.

#### 🔨 Serialization & borsh
This is where serialization comes in - it's the process of converting regular code or data into an array of bytes (machine code: 1s and 0s).

We'll use the [Borsh](https://borsh.io/) serialization format in our projects cause it's got a convenient library we can use.

Let's look at how it works with an example - the goal is to equip an on-chain game item. For this we will need three pieces of data -
* `variant` - the name of the command we want to call (i.e. equip or remove)
* `playerId` - the ID of the player equipping the item
* `itemId` - the item we want to equip

There are four steps to serializing this data: 
1. Create schema/map for what your data is supposed to look like
2. Allocate a buffer for the data that's much larger than needed
3. Encode our data and add it into the buffer
4. Chop off the extra space at the end of the buffer

As web developers we never have to deal with low level stuff like this so I made this to make it feel less abstract:
![](https://hackmd.io/_uploads/HJRDW6xQj.png)

I hope this makes sense lol. Let's take a look at some code to see it in practice.

![](https://hackmd.io/_uploads/H1zgcNpfi.png)

We are going to start with creating a schema for the equip item instruction. We're making a borsh struct with the three pieces of data, all unsigned integers but of different sizes - 8, 16, and 256 bits.

Since our data is going to become a long list of 1s and 0s, we need to know where each data item starts and ends. This is why we give each item a specific size. When the program needs to read this data, it'll know where `variant` ends and `playerId` starts.

Imagine trying to slice sausages from a link while blindfolded. You'll only cut at the right spots if you know how long each sausage is.

![](https://hackmd.io/_uploads/B1mYFw6Mj.png)

In our example the second and third sausage would be a lot longer but I think you get the idea lol.

![](https://hackmd.io/_uploads/S1Xk6Iazo.png)

Steps two, three and four are happening here. We make a buffer 1000 bytes long. We encode our data and add it into the buffer. We then slice the end so it's only as long as it needs to be.

![](https://hackmd.io/_uploads/BysyTLpMj.png)

Once we have the data in the correct format, the rest is ezpz! This transaction should look familiar. The only "new" thing here is the optional `data` item that we didn't have before.

I've made few assumptions about your knowledge here - you know at a rough level what machine code is and how memory allocation comes in to play. You don't **need** to know all this stuff, I certainly don't. Just watch a video or two on YouTube till you have a general vibe of what's happening.

Not a lot of modern developers deal with byte buffers on a regular basis - it's considered low level, so don't worry if this feels unfamiliar or new. We'll build with it next so you can call yourself a Software **Engineer** 😎
