## 🤯 Replit

We'll be using this thing called [Replit](https://replit.com/~)!

It is a browser-based IDE that lets us easily build web apps and deploy them all from the browser. It is super legit. Instead of having to set up a full local environment and write commands to deploy, it's all just given to us.

Note: **You don't have to use replit to build + deploy your site. If you want to work locally on VSCode and use Vercel/Heroku/AWS to deploy and are confident in your web dev skills -- that's totally cool. [Here](https://github.com/buildspace/buildspace-nft-course-starter) is a link to the base repo you can clone and work on locally.**

Make an account on Replit before moving on.

I've already created a basic react project that you can **fork** on Replit. **Just go [here](https://replit.com/@adilanchian/nft-starter-project?v=1), and near the right, you'll see the "Fork" button.** Be sure you're logged in, then click this.

You'll magically clone my repo and full IDE in your browser to work with the code. Once it stops loading and shows you some code click "run" at the top and you're good to go. Might take 2-4 min the first time.

**Please Note: As you go through this project, you may notice that we are referencing `.js` files. In Replit, if you are creating any new JavaScript files, you will need to use the `.jsx` extension instead! Replit has some performance fanciness that requires you use the `.jsx` file extension :).**

## 🦊 Setup Metamask

Awesome, we have a **deployed** React project we can easily work with. That was simple :).

Next, we need an Ethereum wallet. There are a bunch of these, but, for this project, we're going to use Metamask. Download the browser extension and set up your wallet [here](https://metamask.io/download.html). Even if you already have another wallet provider, just use Metamask for now.

Why do we need Metamask? Well. We need to be able to call functions on our smart contract that live on the blockchain. And, to do that we need to have a wallet that has our Ethereum address and private key.

**But, we need something to connect our website with our wallet, so that we can securely pass our wallet credentials to our website. Our website can then use those credentials to call our smart contract. Ultimately, you need to have valid credentials to access functions on smart contracts.**

It's almost like authentication. We need something to "login" to the blockchain and then use those login credentials to make API requests from our website.

So, go ahead and set it all up! Their setup flow is pretty self-explanatory :).

## 🚨Progress report

Post your wallet's public address in #progress along w/ a funny gif. It better be funny ;). 
