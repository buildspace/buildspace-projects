Before we get deep into coding up our domain service, let’s talk a little bit about why Polygon is an epic solution for this. 

This project is about making your own domain service — where people can buy their own domain from your smart contract and own it.

When you’re making people pay for things, you generally don’t want them to pay $40 in transaction fees, which is how much Ethereum transactions cost on a good day. This is where Polygon comes in!

Technically, Polygon is a protocol and framework that consists of a bunch of different blockchains. We're going to be building on their most popular chain - **the Polygon PoS chain**. What’s that? It's another chain that runs **alongside** the Ethereum and periodically submits **checkpoints** to it. Let's break it down a bit.

The Ethereum blockchain is referred to as a “layer 1” blockchain because we can build other blockchains **on top of it**. That’s exactly what the Polygon PoS chain is: it’s a blockchain built on top of Ethereum that runs in parallel, making it the second layer (hence, layer 2).

Imagine you were running a kitchen as a chef. It’d be pretty annoying for you to have to take the order, go back to the kitchen, cook it, and then serve it. You’d get backed up with traffic pretty quickly! Instead, you would hire a team of waiters to act as **a layer** between the kitchen and the customers. The waiters would then take the orders more efficiently and give them to the kitchen directly.

This is similar to the relationship Ethereum has with Polygon. Ethereum wasn’t built to handle an insane # of transactions so it gets back up quickly. Polygon is able to handle a higher transaction count and then it bundles up all those transactions up and deposits them to Ethereum as the final source of truth.

**Still doesn’t make any sense? Eh don’t worry about it. Once you start actually building on Polygon it’ll become 10X clearer :).**

Feel free to read more about L2 scaling solutions [here](https://mirror.xyz/dcbuilder.eth/QX_ELJBQBm1Iq45ktPsz8pWLZN1C52DmEtH09boZuo0).

### 💥 Polygon vs Ethereum

You might be thinking “Hmm, do I really want to learn how to use another blockchain???”.

Well, no! You don’t! Since the Polygon PoS chain is EVM (Ethereum Virtual Machine) compatible, everything that runs on the Ethereum can also run on Polygon without any changes

This makes it super easy to move contracts to Polygon so you don’t have to sell your kidneys to pay transaction fees. For most dApps, Polygon just makes a lot more sense because of how much faster and cheaper it is. All the popular Ethereum tools such as Hardhat, Remix, Truffle and Web3js work on Polygon; all you need to do is change the network you’re on!