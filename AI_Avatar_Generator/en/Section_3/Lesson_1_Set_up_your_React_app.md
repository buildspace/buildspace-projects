By this point, you have trained your very own Dreambooth model. Thats fucking **nuts**. You’re already doing what 98% of the world has no idea how to do. Hopefully you combined that with your legendary prompt engineering skills to get some images that look like this:

![https://hackmd.io/_uploads/SJfjrpNqj.png](https://hackmd.io/_uploads/SJfjrpNqj.png)

We’re going to take this even further by creating a web app that uses this model! Like we talked about before, your web app will be able to generate an avatar of yourself from any web browser. More importantly, you’ll be able to send this off to friends and they can create some images based on your custom model. Hope you have nice friends lol.

The beauty of this is you don’t have to use a human face (ya alien faces count too lol). But in all seriousness, you can train a model of a tree, a bridge, or even your guitar. It’s freaking insane to see what you can work with here tbh.

### Get the starter code
Let’s go ahead and start by forking the starter repo. We are going to fork it so we can use a tool called [railway](https://railway.app/) to easily deploy our app generator to the world! [Click here to fork the repo](https://github.com/buildspace/ai-avatar-starter/fork). 

Go ahead and clone your brand new fork, open the folder in your favorite text editor (I’m using VSCode) and run the command `npm i` . Then you’ll be ready to start the project by running `npm run dev`

If everything worked, you should be able to navigate to [localhost:3000](http://localhost:3000) in your favorite web browser and see:

![https://hackmd.io/_uploads/H17PFTEqj.png](https://hackmd.io/_uploads/H17PFTEqj.png)

Very nice! We will be working with `next.js` to build our UI + single API for this :). If you’ve never used Next before, have no fear. I’m going to take you through the magical lands of this framework.

**NOW** — go ahead and head back to your code editor and let’s get some basic things in here. 

First, change your one-liner! Head to the `index.js` file in `pages folder` and update your title and description with the type of generator you’re making. We are going to be building a silly picture generator, so I’ll change mine to — “Silly picture generator” + change the description to "Turn me into anyone you want! Make sure you refer to me as "abraza" in the prompt".

```jsx
const Home = () => {
  return (
    <div className="root">
      <Head>
        {/* Add one-liner here */}
        <title>Silly picture generator | buildspace</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            {/* Add one-liner here */}
            <h1>Silly picture generator</h1>
          </div>
          <div className="header-subtitle">
            {/* Add description here */}
            <h2>
              Turn me into anyone you want! Make sure you refer to me as "abraza" in the prompt
            </h2>
          </div>
        </div>
      </div>
      <div className="badge-container grow">
        <a
          href="https://buildspace.so/builds/ai-avatar"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={buildspaceLogo} alt="buildspace logo" />
            <p>build with buildspace</p>
          </div>
        </a>
      </div>
    </div>
  );
};
```

Good stuff. This is already feeling really good. The next thing we are going to want to setup is a place for our users to type in! We need to be able to take in a prompt and send it over to our Inference API.

We are going to start by adding a prompt container right under the div holding our description:

```jsx
<div className="root">
  <Head>
    <title>Silly picture generator | buildspace</title>
  </Head>
  <div className="container">
    <div className="header">
      <div className="header-title">
        <h1>Silly picture generator</h1>
      </div>
      <div className="header-subtitle">
        <h2>
          Turn me into anyone you want! Make sure you refer to me as "abraza" in the prompt
        </h2>
      </div>
      {/* Add prompt container here */}
      <div className="prompt-container">
        <input className="prompt-box" />
      </div>
    </div>
  </div>
  <div className="badge-container grow">
    <a
      href="https://buildspace.so/builds/ai-avatar"
      target="_blank"
      rel="noreferrer"
    >
      <div className="badge">
        <Image src={buildspaceLogo} alt="buildspace logo" />
        <p>build with buildspace</p>
      </div>
    </a>
  </div>
</div>
```

Cool! I dropped some basic css in the `styles/styles.css` file in this project, but feel free to change this to however you want — remember this is **your** build.

![https://hackmd.io/_uploads/rkvdK6N5o.png](https://hackmd.io/_uploads/rkvdK6N5o.png)

This is going to hold all the UI we need for getting a prompt from our user to our API. Now, in order to actually capture this input we are going to need to create some state properties. Go ahead and import `useState` at the top of your file and then create an `input` state property:

```jsx
// Add useState import to top of file
import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';

const Home = () => {
  // Create state property
  const [input, setInput] = useState('');
  
  return (
    // rest of code
  )
}

export default Home;
```

Now that we have a way to hold what someone is writing in our input box, we need to tell our input box read from that property! Head back to where you created your input and add this property:

```jsx
<div className="prompt-container">
  {/* Add value property */}
  <input className="prompt-box" value={input} />
</div>
```

Cool — almost there! If you start typing into your input you’ll start to realize that there is nothing being shown. Well that’s because as we type we need to save the changes to our `input` state. In order to do that we need to use the `onChange` property of our input and give it a function that takes the text and saves it to our state.

Start by creating a new function right under where you declared your `input` called `onChange`:

```jsx
const Home = () => {
  const [input, setInput] = useState('');
  // Add this function
  const onChange = (event) => {
    setInput(event.target.value);
  };
  
  return (
    // rest of code	
  )
}

export default Home;
```

This will take in an event and we just take that value and set it in our input state! 

Now, we just need to tell our input UI to call this function every time you type. Go ahead and add the `onChange` property to your input like this:

```jsx
<div className="prompt-container">
  {/* Add onChange property */}
  <input className="prompt-box" value={input} onChange={onChange} />
</div>
```

Go ahead and start typing in the input box, you should now see text appear! Ezpz my friend — we are well on our way. Okay now for the exciting stuff — **making a network call to use our Inference API from hugging face**.

If you have never worked with APIs, have no fear, your mind is about to be blown. 

To start, we actually need a way to run our network request. Let’s create a button that will take our input and send it off to the internet. For that we are going to add some more UI like this:

```jsx
<div className="prompt-container">
  <input className="prompt-box" value={input} onChange={onChange} />
  {/* Add your prompt button in the prompt container */}
  <div className="prompt-buttons">
    <a className="generate-button">
      <div className="generate">
        <p>Generate</p>
      </div>
    </a>
  </div>
</div>
```

At this point you should see something like this:

![https://hackmd.io/_uploads/rkSFt6N9s.png](https://hackmd.io/_uploads/rkSFt6N9s.png)

Try clicking the button — nothing happens right? That’s because we haven’t told the button to run anything when clicked! For that we are going to do something very similar to what we did with the `onChange` event. 

Start by creating a new function right under the `onChange` function we declared earlier  called `generateAction` :

```jsx
const Home = () => {
  const [input, setInput] = useState('');
  const onChange = (event) => {
    setInput(event.target.value);
  };
  // Add generateAction
  const generateAction = async () => {
    console.log('Generating...');	
  }
  
  return (
    // rest of code
  )
}

export default Home;
```

We are going to add a `console.log` statement for now just to make sure things are running as we expect. 

If you try pressing the generate button you’ll notice nothing happens still. We need to tell our button to run this function when it is clicked. 

Go back to where you declared your generate button and you are going to add one more property to it called `onClick`:

```jsx
<div className="prompt-container">
  <input className="prompt-box" value={input} onChange={onChange} />
  <div className="prompt-buttons">
    {/* Add onClick property here */}
    <a className="generate-button" onClick={generateAction}>
      <div className="generate">
        <p>Generate</p>
      </div>
    </a>
  </div>
</div>
```

Epic — once you do that head over to your press and open the inspector and head to the Console tab. When you click the generate button you should see `Generating...` print out like this:

![https://hackmd.io/_uploads/Hke5t64cs.png](https://hackmd.io/_uploads/Hke5t64cs.png)

LFG. See how easy this is? You are literally half way there to call an API.
