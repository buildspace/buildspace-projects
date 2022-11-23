If you’ve ever bought a domain using Shopify, Namecheap or GoDaddy, you’ve used a Domain Name Service (DNS).

ENS stands for Ethereum Name Service. They created the `.eth` domain that you see being used all over the place!

Okay — this is cool, but what’s the point? Well basically it means you can literally create your own domain service without asking anyone for permission.

Usually, you would have to go make deals with big ISP providers to have your domain accepted by them. For example, if you wanted to make the domain `.bingbongboopitybop` then all the big internet providers would need to accept it on their end. Else, the domain would just lead to a “Does not exist” error page.

Recently, I wanted to buy a `.af` domain, but it doesn’t exist! In this case, I could take inspiration from ENS and build my own ENS for the `.af` domain.

So, now that we know how hype Polygon is and what ENS is - how does this all fit into what we are building?

We’re going to be making a smaller version of ENS on the Polygon blockchain: we’ll let anyone buy a domain NFT and point it to something. This is awesome cause once your contract is on the blockchain, any data it has will be universal! Anyone can read the names and look at what it’s pointing to. And because blockchains are so unstoppable, no one can remove your data or kill your epic domain.

**Btw — making a new top level domain like `.dev` or `.net` takes 4-5 years and costs like $185,000+ in the web2 world. We’re going to do this IN A WEEKEND with at the cost of a few cups of coffee!**

### 🤔 The super cool (definitely not expensive) Ethereum Name Service

The biggest issue with ENS is the transaction fees. To register a name, you need to pay gas fees to the Ethereum blockchain. Here’s how much it would cost to register the domain name “ExpensiveNameService” for a year. $107 USD! That’s like 42 happy meals! Imagine how happy you’d be with 42 happy meals.

![https://i.imgur.com/AX7Z9cW.png](https://i.imgur.com/AX7Z9cW.png)

You might say “That’s okay, I’ll just register it for 10 years to save gas fees, it’ll only come out to ~$15/y”. Yeah sure, but it’s still too much for some folks.

The bigger issue is that any time you want to update a record or change wallets, you need to pay $30-$60 for gas. That adds up. How many happy meals are you missing out on??

These gas fees aren’t going away any time soon. You need to pay to store data on the blockchain and as long as people find it economical to do so, they’ll pay more than you. How cool would it be if we could build our dApps on a more scalable network that offers cheaper fees with the same amount of security? That’s what this project is going to be all about!

### 🤖 What can we do with a “name” service?

I like to think of name services like global APIs.

Everyone can access them and you can store data that can be queried. ENS lets you store a bunch of things, check out [t](https://app.ens.domains/name/brantly.eth/details)[his profile](https://app.ens.domains/name/cryptonerdtokyo.eth/details).

![https://i.imgur.com/PVFhcDZ.png](https://i.imgur.com/PVFhcDZ.png)

They have a lot of different things set, like usernames for various services,  email address, website, and even an NFT avatar!

Any website on the internet can access this data. How cool is that? Imagine never needing to upload your profile picture ever again. Everyone will know of my moustache.

### 💪 Let's get to work

We've been doing a lot of talking. Let's actually build our own little version of an ENS. By the end, hopefully all this becomes much more concrete and maybe you'll be on your way toward making the next hit web3 app ;).

### 🚨 Progress report!

Post in #progress your fav web app + domain combo! Help get everyone in the building mood 8)
