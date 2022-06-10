## 💻 Set up a client

It's time to start working on our website! Our contract is pretty simple, but, let's learn how our front end can interact with our contract ASAP!

So, there are like 100 different ways to set up a basic react project and deploy it. I'm going to show you how to do it here in 10 minutes and by the end you'll actually have a react app fully deployed with its own domain and everything.

## 🤯 Replit

**Note: You don't have to use replit to build + deploy your site. If you want to use create-react-app + Vercel/Heroku/AWS -- that's totally cool. [Here](https://github.com/buildspace/waveportal-starter-project) is a link to the base repo you can clone and work on locally.**

We'll be using [Replit](https://replit.com/~)! It is a browser-based IDE that lets us easily build web apps and deploy them all from the browser. It is super legit. Instead of having to set up a full local environment and write commands to deploy, it's all just given to us.

Make an account on Replit before moving on.

I've already created a basic react project that you can **fork** on Replit. **Just go [here](https://replit.com/@adilanchian/waveportal-starter-project?v=1), and near the right you'll see the "Fork" button.** Be sure you're logged in, then click this. You'll magically clone my repo and full IDE in your browser to work with the code. Once it stops loading and shows you some code, click the "Run" button at the top. This can take a solid 2-3 minutes the first time. Basically, Replit is booting up your project and deploying it to an actual domain.

**Please Note: As you go through this project, you may notice that we are referencing `.js` files. In Replit, if you are creating any new JavaScript files, you will need to use the `.jsx` extension instead! Replit has some performance fanciness that requires you use the `.jsx` file extension :).**

I made a quick video going over how to edit code on Replit, deploy, get dark mode. Check it out below: 
[Loom](https://www.loom.com/share/8e8f47eacf6d448eb5d25b6908021035)

## 🦊 Metamask

Awesome, we have a **deployed** React project we can easily work with. That was simple :).

Next we need an Ethereum wallet. There are a bunch of these, but, for this project we're going to use Metamask. Download the browser extension and set up your wallet [here](https://metamask.io/download.html). Even if you already have another wallet provider, just use Metamask for now.

Why do we need Metamask? Well. We need to be able to call functions on our smart contract that live on the blockchain. And, to do that we need to have a wallet that has our Ethereum address and private key.

**But, we need something to connect our website with our wallet so we can securely pass our wallet credentials to our website so our website can use those credentials to call our smart contract. You need to have valid credentials to access functions on smart contracts.**

It's almost like authentication. We need something to "login" to the blockchain and then use those login credentials to make API requests from our website.

So, go ahead and set it all up! Their setup flow is pretty self-explanatory :).

## 🚨 Before you click "Next Lesson"

*Note: if you don't do this, Farza will be very sad :(.*

Share a link to your website and post it in #progress. Change up the CSS and text to be whatever you want. Maybe you want it to be more colorful? Maybe you don't care about waves and you want to make a decentralized Twitter clone? Do whatever you want this is your app :).
