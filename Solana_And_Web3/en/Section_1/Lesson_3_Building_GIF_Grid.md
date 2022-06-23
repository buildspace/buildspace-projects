We are moving right along here! At this point we have: setup our React app, built a connect to wallet button, setup some conditional rendering based on the state of the user's Solana wallet.

In our GIF Portal we want to be able to show GIFs that people submit to our app!

We just need to build the UI to handle this. Since we haven't written our Solana program just yet, we are going to use test data to make sure things are working as expected. Then all we will have to do is call the program later from our app (more on this soon).

### 🧪 Displaying test data

To start us off, we should talk about when we want our grid of GIFs to be rendered. If you think about it, the only time our GIF grid will be rendered is **when the user has connected + authorized their wallet to our app.**

That's pretty straight forward! So let's start by making some test data to knock out that first condition. Again, we will be updating this later in the project to use the data in your Solana program instead of the frontend.

Hang with me here!

At the top of your file in `App.js` go ahead and create a property called `TEST_GIFS` . In this property, you will be filling it with some of your favorite GIFs!

I'm going to build a theme around mine: **[Squid Game](https://en.wikipedia.org/wiki/Squid_Game) 🦑.** 

```javascript
const TEST_GIFS = [
	'https://i.giphy.com/media/eIG0HfouRQJQr1wBzz/giphy.webp',
	'https://media3.giphy.com/media/L71a8LW2UrKwPaWNYM/giphy.gif?cid=ecf05e47rr9qizx2msjucl1xyvuu47d7kf25tqt2lvo024uo&rid=giphy.gif&ct=g',
	'https://media4.giphy.com/media/AeFmQjHMtEySooOc8K/giphy.gif?cid=ecf05e47qdzhdma2y3ugn32lkgi972z9mpfzocjj6z1ro4ec&rid=giphy.gif&ct=g',
	'https://i.giphy.com/media/PAqjdPkJLDsmBRSYUp/giphy.webp'
]
```

This is your time to have some fun. Add as many GIFs to your test list and make them whatever theme you want. 

Maybe you want your website to be only anime themed GIFs. Maybe you want to it only be movie themed GIFs. Maybe you want only video game themed GIFs.

**Change your website's title and description to match the type of GIFs you want people to submit.**

```jsx
// Change this stuff. Make it themed to something you're interested in.
// Ex. memes, music, games, cute animals, whatever!
<p className="header">🖼 GIF Portal</p> 
<p className="sub-text">
  View your GIF collection in the metaverse ✨
</p>
```

I know it sounds dumb but these small changes actually will make your site just a little bit more fun. And, it might motivate you to finish it all the way through. 

NICE. We have some spicy GIFs to test out our app with now. So, how are we going to actually display this data? Remember when we wrote that `renderNotConnectedContainer` function? We are going to take the same approach this time, but render our grid of GIFs instead!

Let's start by creating a new function called `renderConnectedContainer`  right under the `renderNotConnectedContainer`. This will have some simple UI code that will map through all our GIF links and render them:

```jsx
const renderConnectedContainer = () => (
  <div className="connected-container">
    <div className="gif-grid">
      {TEST_GIFS.map(gif => (
        <div className="gif-item" key={gif}>
          <img src={gif} alt={gif} />
        </div>
      ))}
    </div>
  </div>
);
```

We are almost there! You probably saved your file and still haven't seen anything show up on your app! Remember - these render methods need to be **called** in order to be executed! Let's head down to where we added `{!walletAddress && renderNotConnectedContainer()}`. 

If we only want this to display when the user is connected to our app, what property can we use to decide this? Probably the `walletAddress` right? If we have a  `walletAddress` that must mean we have a connected wallet! Nice.

So, right under where you are called `renderNotConnectedContainer` let's go ahead and add this:

```javascript
return (
  <div className="App">
    <div className="container">
      <div className="header-container">
        <p className="header">🖼 GIF Portal</p>
        <p className="sub-text">
          View your GIF collection in the metaverse ✨
        </p>
        {!walletAddress && renderNotConnectedContainer()}
        {/* We just need to add the inverse here! */}
        {walletAddress && renderConnectedContainer()}
      </div>
      <div className="footer-container">
        <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
        <a
          className="footer-text"
          href={TWITTER_LINK}
          target="_blank"
          rel="noreferrer"
        >{`built on @${TWITTER_HANDLE}`}</a>
      </div>
    </div>
  </div>
);
```

***NOW,*** if you save your file with these changes you should see all your beautiful GIFs appear 😮.

*Note: if you're on a slow internet connection, the GIFs may take a while to load.*

You can see that everything just seems "to work". I provided some styling for this app, over in `App.css`, so you wouldn't have to worry too much about getting this setup.

At this point, you should make some changes to this file! This is where all your styling will live. I thought this sort of format would look cool, but you may have another setup that is even better!

![https://i.imgur.com/PtpFGIa.png](https://i.imgur.com/PtpFGIa.png)

For example, if your web app is a place where people submit GIFs of cute animals, then maybe the dark mode feel of the website right now won't really fly! Up to you. Change it as you please.

### 🔤 Creating a GIF input box

**Our app is taking form — and we're about 10-minutes away from getting into writing our first Solana program that will power our web app here w/ real data instead of hardcoded test data.**

Take a moment to look at the magic you've created :).

This is stuff that **TONS** of people in the world wish they knew how to do. Most people are just talking about this stuff on Twitter. But, you are actually taking the steps to do it. Mad props to you my friend.

It's time for us to think about how other people can add their own GIFs to our app. We are going to take an input approach here. When someone visits your app they are going be able to add a link to their favorite GIF which will then call our Solana program to handle the rest! For now, we are going to setup the input and action that will get called here.

Let's get started with the input. We only want this input box to be shown when the user has connected their wallet to our app. So, that means we will want to add this code to our `renderConnectedContainer` render method:

```jsx
const renderConnectedContainer = () => (
  <div className="connected-container">
    {/* Go ahead and add this input and button to start */}
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <input type="text" placeholder="Enter gif link!" />
      <button type="submit" className="cta-button submit-gif-button">Submit</button>
    </form>
    <div className="gif-grid">
      {TEST_GIFS.map((gif) => (
        <div className="gif-item" key={gif}>
          <img src={gif} alt={gif} />
        </div>
      ))}
    </div>
  </div>
);
```

The main things we added here are an `input` box and a submit `button` .

You can write in this input box and click the button or press enter, but you will notice nothing happens! We still need to write the logic and wire it up to the form submit.

For this, we are going to use a couple cool new attributes.

`onChange` is a function that gets fired every time the input box value changes. Again, if you're already a React Pro — you can blaze through this stuff.

To get this to work properly we are going to need to create a new state property called `inputValue` . Let's start there -

Right under `const [walletAddress, setWalletAddress] = useState(null);` add this:

```javascript
const [inputValue, setInputValue] = useState('');
```

Psh - EASY. Now we just need to hook this up to our input element! Head over to your `input` element and change it to look like this:

```jsx
<input
  type="text"
  placeholder="Enter gif link!"
  value={inputValue}
  onChange={onInputChange}
/>
```

You'll probably have an error here that says `onInputChange is not defined.` and `inputValue is not defined.` Well thats an easy fix, let's just define these! 

Right under your `connectWallet` function add this:

```javascript
const onInputChange = (event) => {
  const { value } = event.target;
  setInputValue(value);
};
```

This super, simple function will fire off as you type in the input box and then set the value of it to our `inputValue` property. This way, when we are ready to send out our GIF link to our Solana program, we can easily access that property to get the value.

Finally — lets wire up the form submit. Create a new function under the `connectWallet` action called `sendGif` :

```javascript
const sendGif = async () => {
  if (inputValue.length > 0) {
    console.log('Gif link:', inputValue);
  } else {
    console.log('Empty input. Try again.');
  }
};
```

First off, we are making this function `async` for later when we end up adding our interaction with our Solana program.

Then simply enough, we check to see if there is any input value in our input box. If there is print out the GIF link else, print out it's empty. Again, we will be revisiting this function later on for the full implementation :).

***HECK YA***. So go ahead and add a GIF link to your input box and open up your console! Once you press the submit button, you should see `Gif link: YOUR_GIF_LINK` . 

Wait a second, nothing happened?

That's because we still need to call this method in the `onSubmit` attribute on our form! Easy. Just update the `onSubmit` handler to call our new `sendGif` method.

```jsx
<form
  onSubmit={(event) => {
    event.preventDefault();
    sendGif();
  }}
>
```

Give it one more go and you should now see your link printed out in the console! 

### 🌈 Set GIF data in the state

Before we move on to the Solana portion of this, we need to setup just one more thing... actually fetching our data on load! Right now, we just blindly render `TEST_GIFS`.

The flow will look a little something like this:

1. Open up web app.
2. Connect wallet.
3. Fetch the GIF list from our Solana program once wallet is connected.

Since we have this test data setup, we can easily simulate this fetch so it's just plug and play when we are ready to actually call our program!

**We're doing a lot of set up here. Why? Because it'll be worth it later to not worry about this stuff.** Solana isn't ezpz, especially if you're new to Rust. So, it's better to set up dumb UI stuff now we can fully focus on our Solana program after.

Cool let's do this. We are going to hold our GIF list in a state property on our component. 

So, let's start by creating this state property right under our `walletAddress` declaration: 

```javascript
// State
const [walletAddress, setWalletAddress] = useState(null);
const [inputValue, setInputValue] = useState('');
const [gifList, setGifList] = useState([]);
```

Then we need to go ahead and setup another `useEffect` that will get called when our `walletAddress` state changes. Remember, we only want to fetch our GIF list when a user has connected their wallet to our app.

Right under your current `useEffect` **create another** `useEffect`.

```jsx
useEffect(() => {
  const onLoad = async () => {
    await checkIfWalletIsConnected();
  };
  window.addEventListener('load', onLoad);
  return () => window.removeEventListener('load', onLoad);
}, []);

useEffect(() => {
  if (walletAddress) {
    console.log('Fetching GIF list...');
    
    // Call Solana program here.

    // Set state
    setGifList(TEST_GIFS);
  }
}, [walletAddress]);
```

All we are saying here is if we have a `walletAddress` go ahead and run our fetch logic. Right now, we are just going to set our test data since we haven't setup the interaction with our program just yet! 

So, once our test data is set, we want to use it! For this we are going to head back to the `renderConnectedContainer` function and make a one line change:

```jsx
const renderConnectedContainer = () => (
    <div className="connected-container">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendGif();
        }}
      >
        <input
          type="text"
          placeholder="Enter gif link!"
          value={inputValue}
          onChange={onInputChange}
        />
        <button type="submit" className="cta-button submit-gif-button">
          Submit
        </button>
      </form>
      <div className="gif-grid">
        {/* Map through gifList instead of TEST_GIFS */}
        {gifList.map((gif) => (
          <div className="gif-item" key={gif}>
            <img src={gif} alt={gif} />
          </div>
        ))}
      </div>
    </div>
  );
```

Now let's add a few lines to sendGif() so that when you submit the form, it adds the GIF to gifList and clears the text field :

```javascript
const sendGif = async () => {
  if (inputValue.length > 0) {
    console.log('Gif link:', inputValue);
    setGifList([...gifList, inputValue]);
    setInputValue('');
  } else {
    console.log('Empty input. Try again.');
  }
};
```


It's that easy. Now when we change our `useEffect` to fetch the GIF list from our Solana program, we will have it all ready to go to be rendered!

**This is the base of our web app! EPIC.**

It's now time for us start building things out in our Solana program. We will come back to React every so often to run some tests and setup the final pieces of our decentralized app 🌌

### 🚨 Progress Report

*Please do this else Farza will be sad :(*

Post a screenshot of your epic GIF Grid for all to see in `#progress` :).
