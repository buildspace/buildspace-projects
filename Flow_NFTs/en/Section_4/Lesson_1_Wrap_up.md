### 🤔 A note on your mint function
The way our mint function has been set up is a bit unusual. We're doing two things that not a lot of people on Flow do:
1. We're giving everyone the ability to mint
2. We're passing in the NFT metadata from the front-end

The more secure way of doing NFT mints is by using an [NFTMinter resource](https://github.com/onflow/flow-nft/blob/master/contracts/ExampleNFT.cdc#L228). This resource gives accounts the capability to mint NFTs. Think of it like admin powers for a contract. 

Right now if someone wanted to mint a DogMoji NFT on our contract, they totally could! They'd just need to change the arguments being passed into the mint transaction. This can be done by just writing a custom transaction and running it using the Flow CLI tool lol. A better way to do NFT metadata is to store the IPFS hash on the contract and increment the file number using Cadence. This way people can't mint NFTs with all sorts of arbitrary values via your contract. 

I want you to explore the [docs](https://docs.onflow.org/), there are lots of tutorials and documentation out there. You should be able to implement these changes yourself now :)

### 🚀 Deploy to the world (GTFOL)
Deploying a React app has gotten so easy that there is no reason not to do it at this point lol. Plus, it's free. You've made it this far, deploying is the final step. Plus -- your fellow builders at buildspace must not be deprived of your NFTs!! Please give us the opportunity to mint your rare creations hehe.

Basically:

- Push your latest front-end code up to Github.
- Connect Vercel to your repo.
- Make sure you add your .env variables
- Deploy.
- Done.

Note: On Vercel, you will need to add an environment variable `CI=false`. This will make sure our build doesn't fail because of warnings.

![Environment variables](https://i.imgur.com/wn2Uhj4.png)


### 🥞 Careers in Web3
Tons of people have also gotten full-time jobs at top web3 companies via buildspace. I'm constantly seeing people nail their interviews after they do a few buildspace projects.

**People seem to think web3 just needs people who can code smart contracts or write code that interfaces w/ the blockchain. Not true.**

There is so much work to do and most of the work doesn't even have to do w/ smart contracts lol. Being an engineer in web3 just means you take your web2 skills and apply them to web3.

I want to quickly go over wtf it means to "work in web3" as an engineer. Do you need to be a pro at Flow? Do you need to know how every little thing about the blockchain works?

For example, let's say you're a great frontend engineer. If you finished this project, you have almost everything you need to be a great frontend engineer at a web3 company. For example, the company may say "Hey — pls go and build our NFT display feature" — and you'd already have a solid idea on how to do that :).

I just wanna inspire you to work in web3 lol. This shit is awesome. And it'd be cool if you gave it a shot ;).

Check out jobs at Flow [here](https://jobs.flowverse.co/), they're hiring for a bunch of cool roles!

### 🏝 YOUR FLOAT 
Now that you're a proper Flow Smart Contract Developer, we'll be sending you an ✨*exclusive*✨ token called a FLOAT in your email. 

It'll include a special code that you'll need to claim it. These are not transferrable so make sure you claim it with your main wallet! 

### 🌈 Before you head out
Go to #showcase in Discord and drop us a link to your final product that we can mess around with :).

Also, you should totally tweet out your final project and show the world your epic creation! What you did wasn't easy by any means. Maybe even make a little video showing off your project and attach that to the tweet. Make your tweet look pretty and show off!!

And if you feel up to it, tag @_buildspace :). It gives us a ton of motivation whenever we see people ship their projects. Plus, you can inspire someone else to get into Flow.

Give us that dopamine hit pls.

Lastly, what would also be awesome is if you told us in #feedback how you liked this project and the structure of the project. What did you love most about buildspace? What sucked? What would like us to change for future projects? Your feedback would be awesome!

[See yah around!!!](https://twitter.com/AlmostEfficient)

### ♥ Acknowledgements
Despite what it may seem like, I did **not** pump all of this content out by myself. I had **a lot** of help making this project build as amazing as it was.

Shoutouts to our AMAZING TAs (you should definitely follow them on Twitter): 
- [Rohit](https://twitter.com/rohithandique_) - Contract, front-end, template and a lot more
- [Matt](https://twitter.com/TopShotTurtles) - Ideas, parts of the guide, Flow maxi vibes
- [Sean](https://twitter.com/helloitsme_sl) - Front-end styling

A huge thanks to the entire Flow Devrel and education team for all their feedback:
Andrea, Alex, Srinjoy, Kim, Tyllen + everyone I've forgotten.

Last but def. not least, the #1 spot to learn Cadence development (buildspace is #0 ok shh):
Jacob Tucker & the Emerald City DAO.
