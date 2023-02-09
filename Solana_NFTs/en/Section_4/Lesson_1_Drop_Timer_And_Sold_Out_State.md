### ⏳ Building a drop timer

We have an awesome setup for dropping some fancy NFTs on a certain date. The only thing we are missing now is a cool way to show people that a drop is happening soon! Why don't we go ahead and add a countdown timer.

Right now, our "drop" already happened since we set the date to be in the past. Feel free to change the date to sometime in future in the config.json file and apply it using the `update_candy_machine` command. 

```plaintext
ts-node ~/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts update_candy_machine -e devnet  -k ~/.config/solana/devnet.json -cp config.json
```

Remember from a previous lesson: if at any point you run into an error that looks like this:
```plaintext
/Users/flynn/metaplex/js/packages/cli/src/candy-machine-cli.ts:53
      return fs.readdirSync(`${val}`).map(file => path.join(val, file));
                      ^
TypeError: Cannot read property 'candyMachineAddress' of undefined
    at /Users/flynn/metaplex/js/packages/cli/src/candy-machine-cli.ts:649:53
    at step (/Users/flynn/metaplex/js/packages/cli/src/candy-machine-cli.ts:53:23)
    at Object.next (/Users/flynn/metaplex/js/packages/cli/src/candy-machine-cli.ts:34:53)
    at fulfilled (/Users/flynn/metaplex/js/packages/cli/src/candy-machine-cli.ts:25:58)
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
```

Then it means the command can't access the .cache folder with the important data around your candy machine and NFTs. So if you get this error, be 100% sure you're running your candy machine commands from the same directory where you .cache and assets folders are.

This timer needs to do a few things:

1. Only be shown if the current date is before the drop date we setup
2. Should have a "countdown" style timer that counts down per second

There are many ways to go about doing this, but to keep our app a bit cleaner, we are going to make a different component that will handle the state and logic for our timer. You should already see a `CountdownTimer` folder. To get started create an `index.js` file in there and add the following code:

```jsx
import React, { useEffect, useState } from 'react';

const CountdownTimer = ({ dropDate }) => {
  // State
  const [timerString, setTimerString] = useState('');

  return (
    <div className="timer-container">
      <p className="timer-header">Candy Drop Starting In</p>
      {timerString && <p className="timer-value">{`⏰ ${timerString}`}</p>}
    </div>
  );
};

export default CountdownTimer;
```

Let's create a CSS file for our Countdown Timer component. Head over to your `styles` folder and create a new file named `CountdownTimer.css` and add this code in.

```css
.timer-container .timer-header {
  font-size: 20px;
  font-weight: bold;
}

.timer-container .timer-value {
  font-size: 18px;
}
```

Next, go over to `_app.js` to import your `CSS` file. It should look like this 

```javascript
// Rest of your code above 

import "../styles/App.css";
import "../styles/globals.css";
import "../styles/CandyMachine.css";
import "../styles/CountdownTimer.css";
import "@solana/wallet-adapter-react-ui/styles.css";

// Rest of your code below
```

We are setting up a simple React component that will hold some state and takes in a `dropDate`.

Sweet! Before we go any further, let's go over to the `app/components/CandyMachine/index.js` component and import this component. Feel free to put this anywhere at the top of the file:

```jsx
import CountdownTimer from '../CountdownTimer';
```

From here we can setup our logic to handle when to show this countdown timer.

In our case, we only want to show this component if the current date is **before** the drop date. **Else**, we'll go ahead and show the drop date and time.

Now that we have that figured out, let's write some code near the bottom of `app/components/CandyMachine/index.js`.

```jsx
// Create render function
const renderDropTimer = () => {
  // Get the current date and dropDate in a JavaScript Date object
  const currentDate = new Date();
  const dropDate = new Date(candyMachine.state.goLiveData * 1000);

  // If currentDate is before dropDate, render our Countdown component
  if (currentDate < dropDate) {
    console.log('Before drop date!');
    // Don't forget to pass over your dropDate!
    return <CountdownTimer dropDate={dropDate} />;
  }

  // Else let's just return the current drop date
  return <p>{`Drop Date: ${candyMachine.state.goLiveDateTimeString}`}</p>;
};

return (
  candyMachine.state && (
    <div className="machine-container">
      {/* Add this at the beginning of our component */}
      {renderDropTimer()}
      <p>{`Items Minted: ${candyMachine.state.itemsRedeemed} / ${candyMachine.state.itemsAvailable}`}</p>
      <button
        className="cta-button mint-button"
        onClick={mintToken}
      >
        Mint NFT
      </button>
      {mints.length > 0 && renderMintedItems()}
      {isLoadingMints && <p>LOADING MINTS...</p>}
    </div>
  )
);
```

We're just using some basic conditional rendering and calling it in our components render function. Give your page a quick refresh and see what appears!

*Note: if you need to mess around with different dates, don't forget you can use the `update_candy_machine` CLI command to change that to whatever you'd like!*

Nice. We can head back to the `CountdownTimer` component to get the rest of the logic setup. We want to see the timer countdown in realtime. We are going to use a bit of JavaScript fanciness to achieve this, but don't worry the logic is super straight forward.

```jsx
// Our useEffect will run on component load
useEffect(() => {
  console.log('Setting interval...');

  // Use setInterval to run this piece of code every second
  const interval = setInterval(() => {
    const currentDate = new Date().getTime();
    const distance = dropDate - currentDate;

    // Here it's as easy as doing some time math to get the different properties
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // We have our desired output, set it in state!
    setTimerString(`${days}d ${hours}h ${minutes}m ${seconds}s`);

    // If our distance passes zero this means that it's drop time!
    if (distance < 0) {
      console.log('Clearing interval...');
      clearInterval(interval);
    }
  }, 1000);

  // Anytime our component unmounts let's clean up our interval
  return () => {
    if (interval) {
      clearInterval(interval);
    }
  };
}, []);
```

Feel free to just copy paste all this lol time stuff I rarely understand I almost always copy paste it from StackOverflow hehe.

That's it!

You have a simple countdown timer that will help your fans know when to come back and mint one of your NFTs.

![Untitled](https://i.imgur.com/OINimrr.png)

### 📭 Building your "Sold Out" state

One last thing that could be a really cool add (which is also easy to do) is showing a "Sold Out" state when your machine runs out of NFTs to mint!

Remember — your drop only has a set number of NFTs that are available.

We can figure this out by checking two properties - `itemsRedeemed` and `itemsAvailable` on our `candyMachine.state` property! On top of this we are going to add a bit of fanciness to only show our mint button when we have items to mint and the NFT drop date has been reached!

This should be a really easy one to do! Let's head over to our `CandyMachine` component and head to the components render function. Add the following:

```jsx
return (
  candyMachine && candyMachine.state && (
    <div className="machine-container">
      {renderDropTimer()}
      <p>{`Items Minted: ${candyMachine.state.itemsRedeemed} / ${candyMachine.state.itemsAvailable}`}</p>
        {/* Check to see if these properties are equal! */}
        {candyMachine.state.itemsRedeemed === candyMachine.state.itemsAvailable ? (
          <p className="sub-text">Sold Out 🙊</p>
        ) : (
          <button
            className="cta-button mint-button"
            onClick={mintToken}
          >
            Mint NFT
          </button>
        )}
    </div>
  )
);
```

![Untitled](https://i.imgur.com/fYEzoeg.png)

Looking good!

### 🎨 CSS Magic

Spend a little time just cleaning up some CSS and making stuff look better. Add your own copy. Don't use any of the lame copy I gave you. We're done with all the logic for our store now :).

### 🚨 Progress Report

*Please do this else Farza will be sad :(*

In `#progress` post a screenshot of your web app!
