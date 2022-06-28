This is gonna be GOOD. I had so much fun making the store, putting in all sorts of nonsense that doesn't belong in a store. Imagine a store that sells imaginary items. 

We're going to start w/ one of the most magical things about web3, connecting to an app with your wallet.

We'll allow our user to essentially "log in" with their Solana wallet. Building auth is usually pretty hard. You need to have a database of usernames, password, etc. I hate how stores always ask for your email address, mother's maiden name, left sock size and Lichess ELO. Just let me buy my single copy of JavaScript for dummies and run away.

In this case it's a lot easier than you may think! Here's the plan:

1. Get the base web app code for this project (I provided some starter HTML/CSS so you can focus on the things that truly matter lol).
2. Write the code that will allow users to connect their Solana wallet and connect to your app to setup a basic "auth" state.
3. Set up an item you want to sell on IPFS.
4. Hop into writing the Solana Pay code to get paid.

It's going to be **PRETTY HYPE**.

One thing we really love at buildspace is the insane creativity people put into their projects. Make this project your own and do things however you see fit.

**If all you're doing is copy/pasting code then this won't be that fun.**

The base web app code I provide is just to get you started. Change things up. Maybe you hate the colors I used. Change it. Maybe you want to make the site more light mode (ew) themed. Do it.

If you end up changing things up, tag me in #progress and say - "Yo Raza I made your code better" and drop a screenshot.

Alright - let's do this.

### 🏁 Getting started
We are going to be using **Next.js** to build our web app. It's framework **build on top of React.js**. If you are already familiar with React, this will be a breeze. If you haven't done much React, don't worry! You can still make it through this project, but it may feel a bit more difficult.

Don't give up, though! The more you struggle the more you learn 🧠.

If you have no experience w/ React **or** Next - checkout [this intro tutorial](https://www.freecodecamp.org/news/nextjs-tutorial/) before you get started with this or maybe check out the intro docs [here](https://nextjs.org/learn/foundations/about-nextjs). Or don't do anything special, just hop in. Whatever works for you :).

You'll be a Next Wizard after this project if you aren't already 🧙‍♂!

I actually wrote this project in React first but migrated it to Next because of the built in server. It makes things soooo easy and you don't have to deal with Express.js. 

### ⬇️ Getting the code
Head over to [this link](https://github.com/buildspace/solana-pay-starter) and click "fork" on the top right. 

![](https://i.imgur.com/OnOIO2A.png)

Sweet! When you fork this repo, you are actually creating an identical copy of it that lives on your GitHub profile. So now you have your own version of this code that you can edit to your hearts content.

The final step here is to actually get your newly forked repo on your local machine. Click the "Code" button and copy that link!

Head to your terminal and cd into whatever directory your project will live in. I recommend putting it in a known folder where you have other projects. I'm putting mine on the Desktop.

```
# I'm running this in my "Desktop/" directory 
git clone YOUR_FORKED_LINK
cd solana-pay-starter
```
That's it! From there go ahead and run:

```
npm install
```

This may error if you don't have Node installed, which you can install via NVM by following [these instructions](https://github.com/nvm-sh/nvm#installing-and-updating).

Now you can run the web app locally with:

```
npm run dev
```

This should open up the app in your browser on localhost:3000. Your app is empty right now, just how we want it. This is going to be our blank canvas which we will spice up to our liking. For now, just update the text to whatever you want!

For those wanting to start from scratch: be warned! the Solana Pay libraries are brand spankin new. This means if you set up from scratch using Create-React-App you'll run into a [bunch of trouble](https://github.com/solana-labs/wallet-adapter/issues/241). I've gone through that trouble for you and made this ready-to-ship!

You might be wondering "Hmm, how does Raza make these? What secrets is he hiding from me?". Well, dear reader, one of the first things every project puts out is **templates**, so pioneers like *you* can spend time shipping instead of setting up. I looked through the docs and [found these starter templates](https://github.com/solana-labs/wallet-adapter/tree/master/packages/starter). All I did was convert the Next.js starter to JavaScript from Typescript and added a bunch of styling.

Just like that, you have a front-end setup for your store 😎. Here's what mine looks like:
![](https://hackmd.io/_uploads/Hy9JJK8Pq.png)


### 🚨 Progress Report
Please do this else Raza will be sad :(

Play around with your landing! Maybe call it something else? What type of stuff do you want to sell? This is your chance to be creative!

**Post a screenshot of your starter web app in #progress :).**
