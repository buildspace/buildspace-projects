We are coming up on the tail end here! We setup some UI, called our Inference API, and are handling scenarios for when our model is loading. I guess it’s time to actually display this image in the UI eh?

Let’s start with adding some UI elements in our render function like this:

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
      <div className="prompt-container">
        <input className="prompt-box" value={input} onChange={onChange} />
        <div className="prompt-buttons">
          <a
            className={
              isGenerating ? 'generate-button loading' : 'generate-button'
            }
            onClick={generateAction}
          >
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
    </div>
    {/* Add output container */}
    {img && (
      <div className="output-content">
        <Image src={img} width={512} height={512} alt={input} />
      </div>
    )}
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

Close to the bottom here you’ll see some logic that says, “if there is something in the `img` property display this Image”. 

Amazinggg, now what if we make this a bit cooler? When we press generate, lets remove the prompt from the input box and display it under the image that we show in our UI!

To do this go ahead and create yet another state property called `finalPrompt` here:

```jsx
const maxRetries = 20;
const [input, setInput] = useState('');
const [img, setImg] = useState('');
const [retry, setRetry] = useState(0);
const [retryCount, setRetryCount] = useState(maxRetries);
const [isGenerating, setIsGenerating] = useState(false);
// Add new state here
const [finalPrompt, setFinalPrompt] = useState('');
```

Now that we have that head to the `generateAction` function and add this line towards this bottom:

```jsx
const generateAction = async () => {
    console.log('Generating...');

    if (isGenerating && retry === 0) return;

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
      setIsGenerating(false);
      return;
    }

    // Set final prompt here
    setFinalPrompt(input);
    // Remove content from input box
    setInput('');
    setImg(data.image);
    setIsGenerating(false);
  };
```

We take the input and set it as a new property and then finally remove it from the current input.

Once we have that done, we have one more piece to do — display it! Head down to where you declared where you will be displaying the image and add this:

```jsx
{img && (
  <div className="output-content">
    <Image src={img} width={512} height={512} alt={finalPrompt} />
    {/* Add prompt here */}
    <p>{finalPrompt}</p>
  </div>
)}
```

LFG. We are ready to display some images, pretty freaking hype ngl. Let’s go and run a prompt and see our image in all it’s glory:

![https://hackmd.io/_uploads/rk_NcaVci.png](https://hackmd.io/_uploads/rk_NcaVci.png)

Wait… wtf? This image is broken AF lol. 

There is actually 1 more thing we need to do in order to get this to work properly. If you remember from our API , we were returning an `ArrayBuffer` to our frontend. Well, in order to display an image we need to convert that `ArrayBuffer` into a `base64` string. This is the only way that our frontend will understand what as an image!

For this, let’s had back to `generate.js` and we are going to create a new function called `bufferToBase64` :

```jsx
const bufferToBase64 = (buffer) => {
  let arr = new Uint8Array(buffer);
  const base64 = btoa(
    arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
  )
  return `data:image/png;base64,${base64}`;
};
```

It’s a super simple function that takes in a `arrayBuffer` and adds some image decorators to it so our UI will know it’s an image!

Now take that function and inside of our `generateAction` and add this function in the `ok` response:
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

  if (response.ok) {
    const buffer = await response.arrayBuffer();
    // Convert to base64
    const base64 = bufferToBase64(buffer);
    // Make sure to change to base64
    res.status(200).json({ image: base64 });
  } else if (response.status === 503) {
    const json = await response.json();
    res.status(503).json(json);
  } else {
    const json = await response.json();
    res.status(response.status).json({ error: response.statusText });
  }
};
```

**OKAY** — NOW this will work (I promise hehe). Give it one more run and watch all the glory of your web app take form 🥲. 

![https://hackmd.io/_uploads/ByhHqTVci.png](https://hackmd.io/_uploads/ByhHqTVci.png)

Take a moment to look back on the last few things you’ve done. You may have had 0 knowledge on training models and you now have officially trained your very own model (pretty insane tbh).

You can now take this site and make it better. You can even potentially start making revenue off of it!

I want to give you a few more ideas to work on in the next section that can level up your current page.