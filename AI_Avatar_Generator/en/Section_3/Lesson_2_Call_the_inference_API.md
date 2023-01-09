It’s time for us to now write the logic that is actually going to call our API. Let’s head back to the `generateAction` function and start by adding this:

```jsx
const generateAction = async () => {
  console.log('Generating...');

  // Add the fetch request
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'image/jpeg',
    },
    body: JSON.stringify({ input }),
  });

  const data = await response.json();
};
```

This first block of code is the piece that will actually go out to the internet and say “hey `/api/generate` can you take my input and give me back an image?” Once we get a response back, we want to convert it to `JSON` format so we can check for a few different things.

Beautiful, let’s keep going. Go ahead and add this code right under where you are converting the response to `JSON`:

```jsx
const generateAction = async () => {
  console.log('Generating...');

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'image/jpeg',
    },
    body: JSON.stringify({ input }),
  });
  
  const data = await response.json();

  // If model still loading, drop that retry time
  if (response.status === 503) {
    console.log('Model is loading still :(.')
    return;
  }

  // If another error, drop error
  if (!response.ok) {
    console.log(`Error: ${data.error}`);
    return;
  }
};
```

In this block we are checking for two different statuses — `503` and `ok` (which is really just status code of `200`). 

Remember when we were testing our model on hugging face with their UI and sometimes it would have a loading indicator saying “Model is loading”? Well, Hugging Face will return a status of `503` if this is the case! Actually really great, because we can handle this no problemo.

We are then checking to see if there are any other errors, if there is also make sure to catch those and print them out for us.

If everything goes well (as it always should right?) we are going to take our image and save it into state to display. 

Alright, first things first, lets create a new state property called `img`:

```jsx
const Home = () => {
  const [input, setInput] = useState('');
  // Create new state property
  const [img, setImg] = useState(''); 
  
  // rest of code
}

export default Home;
```

Once you have that all set, we can go back into the `generateAction` function and add this line to the end of it:

```jsx
const generateAction = async () => {
  console.log('Generating...');

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'image/jpeg',
    },
    body: JSON.stringify({ input }),
  });
  
  const data = await response.json();

  if (response.status === 503) {
    console.log('Model still loading...');
    return;
  }

  if (!response.ok) {
    console.log(`Error: ${data.error}`);
    return;
  }

  // Set image data into state property
  setImg(data.image);
};
```

And that’s it! At this point you are successfully using Fetch to send a request out to the internet. Pretty magical right? 

Type something in your input, give it a spin and… wait a second… it’s insanely broken lol.

![https://hackmd.io/_uploads/BJxjF6Nqo.png](https://hackmd.io/_uploads/BJxjF6Nqo.png)

We got a `404`? A `404` usually means that the endpoint (or API) could not be found! There is one very important step we are missing here — **actually write the API code.**

The beauty of Next.js is that you can easily spin up serverless functions within the same project and not worry about any of the hosting / maintenance of servers / etc. It’s insanely cool and done by just creating files and writing some code in them! To get this thing working, let’s go ahead and write our first endpoint :).

Go ahead and start by creating a new folder in the `pages` directory called `api` . Within this directory you are going to create a new file called `generate.js`. 

The amazing thing about Next.js is how it uses folder structures to define your API path. For example, we just create a folder called `api` and in that folder a file called `generate` . If you go back to your `index.js` file you’ll notice that the API endpoint we are calling is `api/generate`. It literally just uses the folder structure!

Okay epic — let’s write some code. First thing is first, let’s write a function that will be run when we hit this endpoint:

```jsx
const generateAction = async (req, res) => {
  console.log('Received request')
}

export default generateAction;
```

You’re going to start to see a lot of similarities here as we go through this, but same as before, lets log some stuff out when this thing is called. Only difference is these log statements will show up in your terminal where you ran `npm run dev` . 

Once you have that setup, go ahead and rerun the `npm run dev` command and go ahead and press the generate button.

![https://hackmd.io/_uploads/Byb3YaV9i.png](https://hackmd.io/_uploads/Byb3YaV9i.png)

If you inspect the network tab, you’ll see your request going through — **LFGGG.** Big moves right there for real. 

You may notice it stays stuck on pending, but don’t sweat it we are going to fix that soon :). You should also notice that in your VSCode terminal “Received request” printed out!

Now that we know we are receiving requests from our frontend, let’s actually do the things we need it to do lol.

Inside the `generateAction` we are going to start by grabbing the input from our request. Remember we are sending over the input text when we send the request? We can grab it like this:

```jsx
const generateAction = async (req, res) => {
  console.log('Received request');
  // Go input from the body of the request
  const input = JSON.parse(req.body).input;
};

export default generateAction;
```

At this point we will have the input that is sent over from the UI and can use it to call our Inference API in Hugging Face. For that we are going to write another fetch request. 

I’m going to drop it here and will explain more:

```jsx
const generateAction = async (req, res) => {
  console.log('Received request');

  const input = JSON.parse(req.body).input;

  // Add fetch request to Hugging Face
  const response = await fetch(
    `https://api-inference.huggingface.co/models/buildspace/ai-avatar-generator`,
    {
      headers: {
        Authorization: `Bearer ${process.env.HF_AUTH_KEY}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        inputs: input,
      }),
    }
  );
};

export default generateAction;
```

This should look pretty similar to what we saw on the frontend, except with some additions! 

First off — the url. This url is the path that points to your model in hugging face. This is mine, but to find yours all you need is this: 

`https://api-inference.huggingface.co/models/{USERNAME}/{MODEL_NAME}`

The next thing you’ll notice is there is a `headers` object in our request. In order for Hugging Face to allow us to use their Inference API, we need to have an API key associated with our account. This key will tell Hugging Face we are authorized to access this Inference API — **so make sure to keep it secret.**

Head over to the [tokens](https://huggingface.co/settings/tokens) page and get a write token - you **can** use the same one you generated for your Colab, it’ll work fine.

In our `generateAction` function you’ll see some weird syntax that looks like this `processs.env.HF_AUTH_KEY`. This is a special way for Next.js to read secret keys like this without exposing it to the user! Imagine if everyone could see your password every time you logged into a website? This helps stop that!

To start, take a look at the `.example.env` file. This was created to show you how we need to properly set our API key. Go ahead and create a new file called `.env` at the root of your project and use the same setup like so:

```jsx
HF_AUTH_KEY=YOUR_API_KEY_HERE
```

Don’t forget to `CMD/CTRL` + `C` the terminal and rerun `npm run dev` to make sure this file is compiled with your build else it may not get picked up!

**ALRIGHT** — now last thing here this property called `body`. This is where we will take the input we received from the user and and pass it along to Hugging Face! You may notice that the object has this property called `inputs` . 

If you head back to your model on the Hugging Face website, open up the network inspector, and run another text to image.

![https://hackmd.io/_uploads/SygpY6N9o.png](https://hackmd.io/_uploads/SygpY6N9o.png)

In the payload you’ll see that it is expecting the `inputs` property to be the text we entered! This is cool, because you just did a bit of reverse engineering — picking up skills left and right out here! [You can also dig through the inference api detailed parameters docs here](https://huggingface.co/docs/api-inference/detailed_parameters) :)

Okay okay okay — we are almost ready to run this thing. Let’s add a **FEW** more checks before we do our first try. Take a look at this code below and drop it in under your fetch:

```jsx
const generateAction = async (req, res) => {
  console.log('Received request');

  const input = JSON.parse(req.body).input;

  const response = await fetch(
    `https://api-inference.huggingface.co/models/buildspace/ai-avatar-generator`,
    {
      headers: {
        Authorization: `Bearer ${process.env.HF_AUTH_KEY}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        inputs: input,
      }),
    }
  );

  // Check for different statuses to send proper payload
  if (response.ok) {
    const buffer = await response.arrayBuffer();
    res.status(200).json({ image: buffer });
  } else if (response.status === 503) {
    const json = await response.json();
    res.status(503).json(json);
  } else {
    const json = await response.json();
    res.status(response.status).json({ error: response.statusText });
  }
};

export default generateAction;
```

This should be pretty self explanatory — we are checking for three different statuses: `ok`, `503`, and any other error! Let’s break these down a bit more:

`ok` - Remember this is essentially any successful status code like a `200`. This means the call was a success and it should return back the image. Now the interesting part here is taking our response and converting it into an `arrayBuffer` . In order for us to set our image in our UI we will need to convert it into a form that our UI will be able to read. Let’s start with a an ArrayBuffer and see what happens :). 

`503` - We will receive this when our model is still loading. This response will include two properties — `error` and `estimated_time` . `error` will just be a message stating what is happening and `estimated_time` is how much longer it may take to load the model. We will be using the `estimated_time` to setup a retry method soon so keep that in mind!

`any other error` - If there are any other errors, send it back to our UI with what the problem is — this one’s easy.

**OKAY NICE.** We’re at a really good spot to test our first run here. Let’s go ahead and see what happens and keep building from there! I suggest keeping your network tab open so you can see your request go through and complete :). 

Write some prompt, press generate and let’s see what happens:

![https://hackmd.io/_uploads/SyARF64qo.png](https://hackmd.io/_uploads/SyARF64qo.png)

Holy shit just like that and I received a response! You can see here that I responded with my ArrayBuffer no problem! 

Now, let’s change the prompt a tad — woh we received a 503 😅. Looks like our model is still loading here:

![https://hackmd.io/_uploads/B1ag5aVqi.png](https://hackmd.io/_uploads/B1ag5aVqi.png)

Hmmm so we have a bit of a problem then don’t we? When we receive a `503` we need to make the request again when we think the model has loaded. 

Well, we have the estimated time left, why don’t we just send a request after waiting x number of seconds? 

Let’s head back to our `index.js` file and start by adding three things — a `maxRetries` property, `retryCount` property and `retry` property:

```jsx
const Home = () => {
  // Don't retry more than 20 times
  const maxRetries = 20;
  const [input, setInput] = useState('');
  const [img, setImg] = useState('');
  // Numbers of retries 
  const [retry, setRetry] = useState(0);
  // Number of retries left
  const [retryCount, setRetryCount] = useState(maxRetries);
  // rest of code
}

export default Home;
```

Okay a lot of new properties were introduced here — but let me explain. We know that when we receive a `503` that we get the number (in seconds) of how long until the model loads. This number can change so let’s make sure to set that in a state property, `retry`. 

We can use that property to setup a timer to wait for x number of seconds, but sometimes models can take up to 10 minutes to load into memory (one of the caveats of a free instance like this) and we don’t want to keep spamming this endpoint for 10 minutes. 

Thats where the `maxRetries` comes in. After 20 tries, let’s just drop a message in the console saying — “hey you just need to wait longer for this thing to load before trying to make a request”. 

Finally, we control the retries left with the `retryCount` property! After each request we will count down that number.

Now that we got that under control, lets add a bit of code to our `generateAction` function in `index.js`:

```jsx
const generateAction = async () => {
    console.log('Generating...');

    // If this is a retry request, take away retryCount
    if (retry > 0) {
      setRetryCount((prevState) => {
        if (prevState === 0) {
          return 0;
        } else {
          return prevState - 1;
        }
      });

      setRetry(0);
    }

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'image/jpeg',
      },
      body: JSON.stringify({ input }),
    });

    const data = await response.json();

    if (response.status === 503) {
      // Set the estimated_time property in state
      setRetry(data.estimated_time);
      return;
    }

    if (!response.ok) {
      console.log(`Error: ${data.error}`);
      return;
    }

    setImg(data.image);
  };
```

At the very top you’ll notice that we check if retry is greater than 0. If it is, set our `retryCount` to be one less since we are about to make another call to the Inference API. Then we will set `retry` back to 0.

Then you’ll notice that we set the `retry` property with the value of `estimated_time` . Now we know how long we should wait until making this request again!

Okay cool! Now the problem becomes, where do we actually call this retry? All we’ve done is handle it if there is a retry. 

For this we are going to use React `useEffect`. What we want to happen is to trigger a retry when the `retry` property changes. `useEffect` is perfect for this because it will run some code anytime a certain property changes (just like `retry` ). 

Start by importing `useEffect` at the top of `index.js`:

```jsx
// Add useEffect here
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';

const Home = () => {...}

export default Home
```

Now, right above our render function we are going to add this:

```jsx
const Home = () => {
	const maxRetries = 20;
  const [input, setInput] = useState('');
  const [img, setImg] = useState('');
  const [retry, setRetry] = useState(0);
  const [retryCount, setRetryCount] = useState(maxRetries);
  const onChange = (event) => {
    setInput(event.target.value);
  };
  
  const generateAction = async () => {...}
  
  // Add useEffect here
  useEffect(() => {
    const runRetry = async () => {
      if (retryCount === 0) {
        console.log(`Model still loading after ${maxRetries} retries. Try request again in 5 minutes.`);
        setRetryCount(maxRetries);
        return;
        }

      console.log(`Trying again in ${retry} seconds.`);

      await sleep(retry * 1000);

      await generateAction();
    };

    if (retry === 0) {
      return;
    }

    runRetry();
  }, [retry]);
	
  return (
    // rest of code
    );
};
```

Okay this may look pretty confusing, but I got you — check it:

```jsx
if (retryCount === 0) {
  console.log(
    `Model still loading after ${maxRetries} retries. Try request again in 5 minutes.`
  );
  setRetryCount(maxRetries);
  return;
}
```

You’ll see this function inside another function? That’s wacky lol. 

Don’t worry too much about why this is here, but basically we need to run an `async` function inside an `useEffect` and this is how we do it! 

This function is the meat of it. Here we are first checking to see if `retryCount` is 0, if it is we don’t run anymore requests. Pretty simple!

```jsx
console.log(`Trying again in ${retry} seconds.`);

await sleep(retry * 1000);
```

If we have some retries left, we need to wait the `retry` amount. Thats where the `sleep` function comes in! You may have noticed that we never defined that, so let’s actually add this right above our `useEffect` like this:

```jsx
const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
```

We are using a fancy implementation of `setTimeout` to allow it to “sleep” or “wait” until it keeps going! Promises are some wild shit in Javascript — [take a deeper look at them here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) if you are interested!

```jsx
await generateAction();
```

Finally, if we are ready to rock — call `generateAction` ! This will run through the initial checks we wrote in that function :). 

A couple more things to note in this `useEffect` :

```jsx
if (retry === 0) {
  return;
}

runRetry();
```

We want to actually run `runRetry` when the `retry` property changes. The only thing we need to verify is if `retry` is 0 since the property is initialized with 0.

So if we step back real quick this is what just went down:

- We wrote our `generate` API and are capturing if we receive a `503`
- If we receive a `503` thats retry the request in x number seconds by setting the `retry` property
- Once `retry` is set, check to see if we have reached `maxRetries` if not, run the request after x number of seconds

This is some advanced web dev stuff so give yourself a massive high five before running this thing. Tons of stuff happening here and you just built it — **good shit**.

Alright, lets go ahead and open our console in our web browser and try running a prompt one more time:

![https://hackmd.io/_uploads/B1DMc6Vqo.png](https://hackmd.io/_uploads/B1DMc6Vqo.png)

Holy shit — you are making retries, thats nuts! Now this will keep going until you receive an image response 🤘

You may notice while running this that the UI feels **SUPER** wack. The only way you know if something is happening is if you open the console lol. You aren’t going to tell your mom to open the console on her browser right? Let’s fix that by adding a loading indicator!

Start by creating a new state property called `isGenerating` where we have declared all of our other state:

```jsx
const maxRetries = 20;
const [input, setInput] = useState('');
const [img, setImg] = useState('');
const [retry, setRetry] = useState(0);
const [retryCount, setRetryCount] = useState(maxRetries);
// Add isGenerating state
const [isGenerating, setIsGenerating] = useState(false);
```

Then head to the `generateAction` function and add them in these few spots:

```jsx
const generateAction = async () => {
  console.log('Generating...');

  // Add this check to make sure there is no double click
  if (isGenerating && retry === 0) return;

  // Set loading has started
  setIsGenerating(true);

  if (retry > 0) {
    setRetryCount((prevState) => {
      if (prevState === 0) {
        return 0;
      } else {
        return prevState - 1;
      }
    });

    setRetry(0);
  }

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'image/jpeg',
    },
    body: JSON.stringify({ input }),
  });

  const data = await response.json();

  if (response.status === 503) {
    setRetry(data.estimated_time);
    return;
  }

  if (!response.ok) {
    console.log(`Error: ${data.error}`);
    // Stop loading
    setIsGenerating(false);
    return;
  }

  setImg(data.image);
  // Everything is all done -- stop loading!
  setIsGenerating(false);
};
```

You see here there are four different spots we are going to use this state. Now that we are changing this property, lets do something with it. Head to your render function and go to the `prompt-buttons` div and add this:

```jsx
<div className="prompt-container">
  <input className="prompt-box" value={input} onChange={onChange} />
  <div className="prompt-buttons">
    {/* Tweak classNames to change classes */}
    <a
      className={
        isGenerating ? 'generate-button loading' : 'generate-button'
      }
      onClick={generateAction}
    >
      {/* Tweak to show a loading indicator */}
      <div className="generate">
        {isGenerating ? (
          <span className="loader"></span>
        ) : (
          <p>Generate</p>
        )}
      </div>
    </a>
  </div>
</div>
```

A lot of the CSS around this loading indicator is located in `styles/styles.css` so make sure to go check it out and change it to fit your flow + vibe.

Now that we have a loading indicator set, let’s give this another spin — type in another prompt and let it rip:

![https://hackmd.io/_uploads/rJ27cpE9i.png](https://hackmd.io/_uploads/rJ27cpE9i.png)

Yooo loading indicator working just as expected! Freaking insane.

**WOW**. I know this was pretty long, but give yourself some kudos. You got threw one of the most difficult parts of this program

### Please do this or Raza will be sad.
This is a pretty dope moment. Head over to the `#progress` channel in discord and drop a screenshot of your web app that you have running! If you see someone elses, leave them some feedback as well :).
