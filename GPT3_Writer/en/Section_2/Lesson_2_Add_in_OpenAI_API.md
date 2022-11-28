

So, now we need to call the OpenAI API!

We can’t just call this from our frontend because then **we’d expose our API key to users.** Anyone would be able to just open the inspect tab and easily take our key. And, we don’t want to do that because if we do, then anyone can just abuse our API key and cause us to spend a ton of money.

But remember — right now we’re still working off the $18 in credits OpenAI gave us initially. But even then, we don’t want anyone taking our API key and wasting all our credits! Again, you can see your usage [here](https://beta.openai.com/account/usage).

So, what we need to do is set up a backend to call OpenAI securely. Then, our frontend would call our backend function — that way our users would never be able to access our API key.

Usually, setting up a server is a massive pain.

But, we’re actually using something called NextJS right now — which is a framework for React. It makes it **************really************** easy to set up *backend* *serverless* *functions*. These are functions that just run in the cloud on-demand, so, we don’t need to maintain our own server. Problem solved.

It’s really easy, let's set it up!

### Add API Endpoint

We’re going to create a new serverless function that our frontend will use. Let me show you how easy it is with NextJS.

Create a new folder named `api` inside the `pages` folder. Inside the `api` directory, create a file named `generate.js`. Be careful with where you create the file or what you name it — NextJS does a lot of magic based on file names + file paths.

![Untitled](https://i.imgur.com/PdkI939.png)

In `api/generate.js` we’ll write our backend code to call OpenAI!

Go ahead and add the following:

```jsx
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
```

This is pretty straightforward, we’re using the OpenAI JS library to setup the API easily. But you’ll see here we need a `process.env.OPENAI_API_KEY`. This will come from our `.env` file which is a file that holds any secret information that you don’t want to push to GitHub by accident.

*Note: you could copy and paste your API key here directly, but, then when it goes to GitHub anyone would be able to see it!*

So, go ahead and create a file named `.env` in the root of your project. Inside it all you need is this:

```jsx
OPENAI_API_KEY=INSERT_YOUR_API_KEY_HERE
```

Generate your API key [here](https://beta.openai.com/account/api-keys) and paste it in. You **************don’t************** need to format the `.env` file, just paste it in as is without quotes or spaces as shown above!

Here’s how it looks on my end:

![Untitled](https://i.imgur.com/A0BsiHa.png)

*******************************Note: you may want to restart your terminal and do `yarn dev` again. Sometimes, our frontend won’t pick up the `.env` file without a restart.*

Cool, now let’s finish up `generate.js` to actually call the OpenAI API. Add the following code under the `const openai` line:

```jsx
const basePromptPrefix = "";
const generateAction = async (req, res) => {
  // Run first prompt
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-002',
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.7,
    max_tokens: 250,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  res.status(200).json({ output: basePromptOutput });
};

export default generateAction;
```

And bam, we’re done. We’ve created a serverless, backend function that securely calls OpenAI. Let’s break this down a little:

First, we’re using the `createCompletion` endpoint which you can check out [here](https://beta.openai.com/docs/api-reference/completions/create). It has *****a lot***** of options. The 4 most important things we need to give it is:

- `model` — Which is the model type we want to use. As of today, `text-davinci-002` is the most advanced model. You can explore other models [here](https://beta.openai.com/docs/models/gpt-3).
- `prompt` — This is the prompt we’re passing, just like we’d do in Playground. In this case, we pass it `basePromptPrefix` which is an empty string right now (we’ll use it later) and `req.body.userInput` which will be the input that the user enters in the `textarea` on the frontend that we send to this API function.
- `temperature` — We already know about this thing from Playground. You can play with it more later based on your use case.
- `max_tokens` — I’m setting this to `250` for now which is about 1,000 characters total. If you’re dealing with longer prompts + longer outputs, you can increase this number later. But for testing purposes better to keep it lower. I’ll definitely increase this later because I want longer blog posts generated for myself.

Believe it or not, this function is ready to be called from our frontend. That’s the magic of NextJS — it does the hard work of setting up a serverless backend for us.

### Hook up the magic button.

Let’s hook up our “Generate” button to call our fancy new API.

Drop the following code *under* wherever you have `const [userInput, setUserInput]`.

```jsx
const [apiOutput, setApiOutput] = useState('')
const [isGenerating, setIsGenerating] = useState(false)

const callGenerateEndpoint = async () => {
  setIsGenerating(true);
  
  console.log("Calling OpenAI...")
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userInput }),
  });

  const data = await response.json();
  const { output } = data;
  console.log("OpenAI replied...", output.text)

  setApiOutput(`${output.text}`);
  setIsGenerating(false);
}
```

Nothing too crazy here.

First, I created a state variable for `isGenerating`. This will let us easily create a loading state later so we can tell our users to wait for the OpenAI API to reply. Then, I create `apiOutput` — this will be where we story the output of the API we want to show the user.

Next, we hop into the `callGenerateEndpoint`. The summary:

- I call `setIsGenerating(true)` to set the loading state to `true`. At the bottom of the function, I do `setIsGenerating(false)` because that’s when we’re all done with the API and can set the loading state to `false`.
- I do a simple `fetch` to our API — notice the route I use: `/api/generate`. NextJS automatically creates this route for us based on the structure of our directory: `api/generate.js`. Pretty cool!
- From there, I convert the response to JSON by doing `await response.json()` and then pull out `output`. *****************************************Note: I’m using [object destructing](https://www.javascripttutorial.net/es6/javascript-object-destructuring/) here.*
- Finally, I use `setApiOutput` to actually set `apiOutput` with the actual text that GPT-3 output.

To test it all out, add `callGenerateEndpoint` to your “Generate” button’s `onClick` event by doing:

```jsx
<a className="generate-button" onClick={callGenerateEndpoint}>
  <div className="generate">
    <p>Generate</p>
  </div>
</a>
```

Now, go ahead and type something inside your `textarea` to test things out, hit generate, and you should see a response in the console as I have below:

![Untitled](https://i.imgur.com/QFkmaEs.png)

*************Note: OpenAI’s API may be slow sometimes.*************

### Add GPT-3’s output to our UI.

Let’s show the output on our UI. We already have the output in `apiOutput`, but we just need to show it! Here’s the code to do so:

```jsx
<div className="prompt-container">
  <textarea
    placeholder="start typing here"
    className="prompt-box"
    value={userInput}
    onChange={onUserChangedText}
  />
  <div className="prompt-buttons">
    <a className="generate-button" onClick={callGenerateEndpoint}>
      <div className="generate">
        <p>Generate</p>
      </div>
    </a>
  </div>
  {/* New code I added here */}
  {apiOutput && (
  <div className="output">
    <div className="output-header-container">
      <div className="output-header">
        <h3>Output</h3>
      </div>
    </div>
    <div className="output-content">
      <p>{apiOutput}</p>
    </div>
  </div>
)}
</div>
```

Nothing special really, I just display the output using `{apiOutput}` here within a `div` with the CSS class `output-content`. Feel free to check out the CSS in `styles.css` whenever, you can change things around if you want.

Here’s what it looks like for me when I test it.

![Untitled](https://i.imgur.com/sz7Dda7.png)

Damn, sucks to see Elon unhappy with the direction of Tesla. Hope he figures it out lol. *Note: your spacing might look different than mine, it depends on if GPT-3 outputs a new line basically.*

### Add a simple loading state.

Oneeeeeee more thing to add really fast — a loading state! We already have the loading state saved in `isGenerating` which will be `true` if we’re waiting on the API and `false` if we’re not.

All we need to do is display it! Here’s the code:

```jsx
<div className="prompt-buttons">
  <a
    className={isGenerating ? 'generate-button loading' : 'generate-button'}
    onClick={callGenerateEndpoint}
  >
    <div className="generate">
    {isGenerating ? <span className="loader"></span> : <p>Generate</p>}
    </div>
  </a>
</div>
```

I actually used some fancy stuff here. The first thing you see me doing is changing the `className` based on the value of `isGenerating`. If you’ve never seen the `? :` syntax, that’s called a [ternary operator](https://www.javascripttutorial.net/javascript-ternary-operator/). It works like this:

```jsx
ifThingThingIsTrue ? thenDoThis : elseDoThis
```

It’s basically a cleaner `if` + `else`.

So, if `isGenerating` is true we use the `generate-button loading` class which will reduce the opacity of our button. If it’s false, we’ll use the normal `generate-button` class which keeps it nice and bright.

I use the same logic under that.

If `isGenerating` is true, we show a loading animation and if it’s false we just show the word “Generate”! Simple. Here’s what the loading state should look  like:

![Untitled](https://i.imgur.com/2zYhvhJ.png)

### Please do this or Farza will be sad.

Go ahead and take a screenshot of your clean and simple web app w/ some output and post it in #progress! Nice work so far. Most people would have stopped or gotten distracted, but you’ve stayed focused. Let’s keep going. We still gotta get the fk off localhost!
