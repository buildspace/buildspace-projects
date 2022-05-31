Congrats. You're well on your way to becoming an e-commerce tycoon. Jeff Bezos who? 

### 🚢 Moving to the mainnet
My favourite part about this project is how there's **no deploy cost.** ANYONE can "deploy" this project for free and start generating income by selling their stuff. To start accepting transactions on the mainnet, you'll just have to update two variables. 

1. The "USDC" token address in `createTransaction.js`. The mainnet USDC SPL token address is `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`, so your statement should look like this:
```jsx
const usdcAddress = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
```
2. The `network` enum on `WalletAdapterNetwork` on `_app.js` and `createTransaction.js`:
```jsx
const network = WalletAdapterNetwork.Mainnet;
```

Ta-da! Your app is now taking **real money** on the mainnet. Magical.

### 🚀 Deploy to the world (GTFOL)
Deploying a React app has gotten so easy that there is no reason not to do it at this point lol. Plus, it's free. You've made it this far, deploying is the final step. Plus -- your fellow builders at buildspace must not be deprived of your NFTs!! Please give us the opportunity to mint your rare creations hehe.

**Note:** Since Vercel is a read-only filesystem, adding orders or products from the web-app **will not work!**. This is cuz your "database" json files will not save. If you don't want to use Vercel, all good. Use whatever you want.

Basically:

- Push your latest code up to Github. 
- Connect Vercel to your repo.
- Make sure you add your .env variables
- Deploy.
- Done.

Note: On Vercel, you will need to add 6th environment variable CI=false. This will make sure our build doesn't fail because of warnings.

![Vercel upload](https://i.imgur.com/wn2Uhj4.png)


### 😍 Hello, Solana Master
Super exciting that you made it to the end. Pretty big deal!! Solana is super early and very powerful and you've now gotten your hands dirty w/ the core tech. Hell yes. You have all the skills you need now to build your own Gumroad.

Thank you for contributing to the future of web3 by learning this stuff. The fact that you know how this works and how to code it up is a superpower. Use your power wisely ;).

### 🥞 Careers in Web3
Tons of people have also gotten full-time jobs at top web3 companies via buildspace. I'm constantly seeing people nail their interviews after they do a few buildspace projects.

![Nick being a boss at his job application](https://i.imgur.com/CNzLdQc.png)

**People seem to think web3 just needs people who can code smart contracts or write code that interfaces w/ the blockchain. Not true.**

There is so much work to do and most of the work doesn't even have to do w/ smart contracts lol. **Being an engineer in web3 just means you take your web2 skills and apply them to web3.**

I want to quickly go over wtf it means to "work in web3" as an engineer. Do you need to be a pro at Solana? Do you need to know how every little thing about the blockchain works?

For example, let's say you're a great frontend engineer. If you finished this project, you have almost everything you need to be a great frontend engineer at a web3 company. For example, the company may say "Hey — pls go and build our connect to wallet feature" — and you'd already have a solid idea on how to do that :).

I just wanna inspire you to work in web3 lol. This shit is awesome. And it'd be cool if you gave it a shot ;).

Be sure you click "Work" on the top and fill out your profile if you haven't done so already!!! We're partnered w/ some of the best web3 companies in the world (ex. Uniswap, OpenSea, Chainlink, Edge and Node, and more) and they want to hire devs from the buildspace network :). You've already picked up a skill that is actually extremely valuable and companies are paying top dollar for awesome web3 engineers.

### 🤟 Your NFT!
We'll airdrop you your NFT within an hour and will email you once it's in your wallet. It's running on a cron job! If you don't get the email within 24-hours pls pls pls drop us a message in #feedback and tag @ alec#8853.

Be sure to click the button at the bottom of this page and submit your final link. Otherwise, our system won't mark you as "complete".

### 🌈 Before you head out
Go to #showcase in Discord and drop us a link to your final product that we can mess around with :).

Also, you should totally tweet out your final project and show the world your epic creation! What you did wasn't easy by any means. Maybe even make a little video showing off your project and attach that to the tweet. Make your tweet look pretty and show off!!

And if you feel up to it, tag @_buildspace :). It gives us a ton of motivation whenever we see people ship their projects. Plus, you can inspire someone else to get into Solana.

Give us that dopamine hit pls.

Lastly, what would also be awesome is if you told us in #feedback how you liked this project and the structure of the project. What did you love most about buildspace? What sucked? What would like us to change for future projects? Your feedback would be awesome!

See yah around!!!
