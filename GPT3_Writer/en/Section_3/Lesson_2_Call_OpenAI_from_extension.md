

### Building your first service worker

Now for the fun stuff — actually using our extension to call OpenAI. The way we are going to call OpenAI is going to be a bit different from our website. On our website we had some text input that took the text that you typed in and called a specific API endpoint we made to call OpenAI. We even used a fancy node module to call it. We are going to be doing things a BIT differently this time around.

The goal is to highlight text in our browser, right click it, and see an option that says “Generate blog post”. Whatever we get from GPT-3 we will inject directly into our website 🙂.

**Again for my extension, I’ll be working with [Calmly](https://www.calmlywriter.com/online/).** I recommend you follow along w/ Calmly. Afterwords, you’ll be able to use the same flow for whatever website you want to generate text on.

To get this all working we’ll need to setup this thing called a service worker. You can think of this like a server setup for your app. Instead of having all our code run in our UI, we can have our UI do things while our service worker does everything in the background!

For us, we need to go out to GPT-3, get our completion result and send it to the UI to inject into the Calmly web browser tab! There will be a few steps in between, but alas lets start with creating the file lol.

Go ahead and make a `scripts/contextMenuServiceWorker.js` directory and file. The first thing we are going to tackle in this file is setting up our `contextMenu`! We need to tell our extension which file is going to be used for our `service_worker.` For this let’s head to the `manifest.json` file again and add this:

```json
{
  "name": "magic blog post generator",
  "description": "highlight your blog post title, we'll generate the rest",
  "version": "1.0",
  "manifest_version": 3,
  "icons": {
    "48": "assets/48.png",
    "72": "assets/72.png",
    "96": "assets/96.png",
    "144": "assets/144.png"
  },
  "action": {
    "default_popup": "index.html",
    "default_title": "Generate blog post"
  },
  // Add this thing here
  "background": {
    "service_worker": "scripts/contextMenuServiceWorker.js"
  },
  "permissions": ["contextMenus", "tabs", "storage"]
}
```

Now that our extension knows about our service worker, we can start with writing the logic for our `contextMenu` item!

Remember, we want to highlight some text in Calmly, right click it, and be able to select an option that says “Generate blog post”. Check out how simple this is:

```javascript
// Add this in scripts/contextMenuServiceWorker.js
chrome.contextMenus.create({
  id: 'context-run',
  title: 'Generate blog post',
  contexts: ['selection'],
});

// Add listener
chrome.contextMenus.onClicked.addListener(generateCompletionAction);
```

Nice so we are creating a new option in our menu that will read “Generate blog post”. Then we setup a listener for whenever that is clicked to call this thing called `generateCompletionAction`. 

Let’s go ahead and create that right above where we setup our listeners and then we can check out our `contextMenu`:

```javascript
// New function here
const generateCompletionAction = async (info) => {}

// Don't touch this
chrome.contextMenus.create({
  id: 'context-run',
  title: 'Generate blog post',
  contexts: ['selection'],
});

chrome.contextMenus.onClicked.addListener(generateCompletionAction);
```

**NICE**. Don’t forget to head back to your extension and press the reload button, else you won’t see any of your new code applied in your extension! 

Let’s jump into Calmly and start writing 🤘. Once you have some stuff written down, highlight the text, right click it, and check this out:

![Untitled](https://i.imgur.com/YeT4PPn.png)

**WOAH** — that’s pretty sick. Crazy how easy it was to this going right? This is some of the “under the hood” stuff I was talking about earlier + one of the benefits of building a Chrome extension :).

IGHT — lets get this selection to do something epic. We’re going to start by capturing the selection text and get it ready to package up for GPT-3! Lets start by adding this to the `generateCompleteAction` function:

```javascript
const generateCompletionAction = async (info) => {
  try {
    const { selectionText } = info;
    const basePromptPrefix = `
	Write me a detailed table of contents for a blog post with the title below.

	Title:
	`;
  } catch (error) {
    console.log(error);
  }
};
```

Pretty simple to start and things should look pretty familiar to you. First thing to note is everytime `generateCompletionAction` is called, our listener passed over an `info` object. This homie has our `selectionText` property in it (which is what you highlighted).

Once we get that setup, we can start with our base prompt. You already have the cheat codes from your website so feel free to use them again here!

Okay cool, we are ready to actually call GPT-3. Lets start by declaring a new function called `generate` right about `generateCompletionAction` .  Once you do that, add the line right under your `basePromptPrefix` that will call our generate function:

```jsx
// Setup our generate function
const generate = async (prompt) => {}

const generateCompletionAction = async (info) => {
	try {
    const { selectionText } = info;
    const basePromptPrefix =
      `
      Write me a detailed table of contents for a blog post with the title below.

      Title:
      `;

		// Add this to call GPT-3
    const baseCompletion = await generate(`${basePromptPrefix}${selectionText}`);

    // Let's see what we get!
    console.log(baseCompletion.text)	
  } catch (error) {
    console.log(error);
  }
};
```

The `generate` function is actually going to save quite a bit of time (you’ll see soon). This is going to be all the code that we use to call the GPT-3 API. You’ll notice right away that this looks pretty different from our landing page call. That’s because we used a package library from OpenAI that setup a lot of the boilerplate code for us. We are doing this the “vanilla Javascript” way hehe.

Hey — you’re getting into some under the hood shit, look at you! Cool, lets write this thing:

```javascript
// Function to get + decode API key
const getKey = () => {}

const generate = async (prompt) => {
  // Get your API key from storage
  const key = await getKey();
  const url = 'https://api.openai.com/v1/completions';
	
  // Call completions endpoint
  const completionResponse = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 1250,
      temperature: 0.7,
    }),
  });
	
  // Select the top choice and send back
  const completion = await completionResponse.json();
  return completion.choices.pop();
}
```

That’s all about it! A few things to note here —

1. We need to know the url of the API call which is `[https://api.openai.com/v1/completions](https://api.openai.com/v1/completions)` . You can find this by checking out the docs for this API :)
2. The `getKey` function! Remember the key we stored in our extension state? We are going to add the logic to that very soon, but it’s named as what it does lol.
3. We have to make sure we are making a `POST` request + including our Authorization in the header object! This is all needed for the OpenAI API to say, “Yo what I expect this call to look like and you have permission to access this data!”
4. Finally, the body. We pass in on the options we want GPT-3 to use. This should look very familiar as this is the same data you put in when calling GPT-3 through their library

At this point (assuming you have a proper API key) you should be able to call GPT-3 just like you did in your landing page. Let’s just quickly implement our `getKey` function and then we are well on our way to get this thing shipped 🚢:

```javascript
const getKey = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['openai-key'], (result) => {
      if (result['openai-key']) {
        const decodedKey = atob(result['openai-key']);
        resolve(decodedKey);
      }
    });
  });
};
```

This should look just like `saveKey` function just in reverse.

I think it’s time for us to give this a test. This is a really exciting moment. You’re about to unlock infinite potential across all websites with this. **This first call means a lot.**

Go ahead and update your app in the extension page then go to calmly or whichever site you are using, and let this thing riiipppp. 

Wait a second, how do you know if anything happened? If you open up the browser console in developer settings, you’ll see… absolutely nothing!

This is because service workers have *********their own********* *consoles*. Head back to your extensions menu and click the service worker link. This will open up a new DevTools window - here you can see all the log statements coming from the service worker 🙂.

![Untitled](https://i.imgur.com/2RHaPDt.png)

Alright alright, lets try this one more time:

![Screenshot 2022-11-27 at 5.35.16 AM.png](https://i.imgur.com/MGC5R0l.png)

We are now officially calling GPT-3 from a Chrome extension, **holy shit.** You hit the trifecta here — calling GPT-3 from playground, web app, and chrome extension.

Now that we have our first prompt going, lets get our prompt chaining setup! Remember, prompt chaining is the secret sauce that will make your extension **truly** valuable.

Remember that `generate` function you wrote earlier? Here is the moment where it will save you time lol.

Head back to your `generateCompletionAction` and go ahead and add these last few lines:

```javascript
const generateCompletionAction = async (info) => {
  try {
    const { selectionText } = info;
    const basePromptPrefix = `
      Write me a detailed table of contents for a blog post with the title below.
			
      Title:
      `;

    const baseCompletion = await generate(
      `${basePromptPrefix}${selectionText}`
    );

    // Add your second prompt here
    const secondPrompt = `
      Take the table of contents and title of the blog post below and generate a blog post written in thwe style of Paul Graham. Make it feel like a story. Don't just list the points. Go deep into each one. Explain why.
      
      Title: ${selectionText}
      
      Table of Contents: ${baseCompletion.text}
      
      Blog Post:
      `;

    // Call your second prompt
    const secondPromptCompletion = await generate(secondPrompt);
  } catch (error) {
    console.log(error);
  }
};
```

LFG. That's it — reusable code is good code. We basically did the same exact thing we did with the first prompt, but just passed in the first prompt output!

Now all we need to do is inject this into Calmly. There is just one problem here — our service worker doesn’t have access to the DOM. It has no way of manipulating the UI… That's the entire point of this extension isn’t it?

Don’t worry — we got you.

### Communicating with the web app tab

First off if you don’t know what the DOM is drop a quick search on Google to understand a bit more about it. Your UI is the only piece of any website that has access to this and that’s because it needs to manipulate + interact with it! 

Things like your service worker have 0 clue what the DOM is and how to manipulate it. Just like a server, it runs code in its own environment and your DOM can’t access it.

That's where **messaging** comes into play! You can actually communicate between a service worker and DOM by sending a message like, “hey DOM, I have a message for ya. Check it out and do something with it”.

In our case, we are going to take our output from GPT-3 and send that to our front end to inject into the DOM of Calmly.

The flow is pretty simple, but helps to see it laid out. The game plan is:

1. Write a messenger in our service worker that sends messages to our UI
2. Create a new file that can listen for messages from our service worker
3. When we send a certain message, the extension injects a value into the DOM

Think of it like going to a restaurant and ordering food. You (the customer) are the app. The extension is a waiter. The chef can’t talk to you (just pretend they’re locked in the kitchen by Gordon Ramsay). You send the chef an order, and the extension takes to chef GPT-3 and brings back a delicious AI-generated dish. 

It’s actually pretty straightforward when you look at it from a higher level. Ight enough chatting lets build.

Head back to your `contextMenuServiceWorker.js`  file and add a new function called `sendMessage` right under where we declared `getKey`

```javascript
const sendMessage = (content) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0].id;

    chrome.tabs.sendMessage(
      activeTab,
      { message: 'inject', content },
      (response) => {
        if (response.status === 'failed') {
          console.log('injection failed.');
        }
      }
    );
  });
};
```

This block of code is doing a few things — 

1. First,  we’re looking for which tab is currently active. In order to send a message we need to do it in an active tab
2. We then use a fancy `sendMessage` function given to us from chrome. This takes 3 things — `tab`, `payload`, and `callback`. Our payload is going to include a message called `inject` and the content of whatever we have passed in
3. Finally, our message will respond with a status, to let us know things are working well 🤘

Niceee! So now that we have this, let’s start dropping some messages. We are going to add a few different types here:

1. A message for when we start generating a completion
2. A message for when we are ready to send over our final output
3. A message in case we have an error so the user can see what it is

Go ahead and head to the `generateCompletionAction` function and add these lines:

```jsx
const generateCompletionAction = async (info) => {
  try {
    // Send mesage with generating text (this will be like a loading indicator)
    sendMessage('generating...');

    const { selectionText } = info;
    const basePromptPrefix = `
      Write me a detailed table of contents for a blog post with the title below.
      
      Title:
      `;

      const baseCompletion = await generate(
        `${basePromptPrefix}${selectionText}`
      );
      
      const secondPrompt = `
        Take the table of contents and title of the blog post below and generate a blog post written in thwe style of Paul Graham. Make it feel like a story. Don't just list the points. Go deep into each one. Explain why.
        
        Title: ${selectionText}
        
        Table of Contents: ${baseCompletion.text}
        
        Blog Post:
		  `;
      
      const secondPromptCompletion = await generate(secondPrompt);
      
      // Send the output when we're all done
      sendMessage(secondPromptCompletion.text);
  } catch (error) {
    console.log(error);

    // Add this here as well to see if we run into any errors!
    sendMessage(error.toString());
  }
};
```

Okay okay okay. **WE GETTING SOMEWHERE NOW**. 

So we are sending messages, but we don’t have anything receiving it. It’s like you’re screaming at the top of your lungs in a forest, but no one is there to listen 😟. 

Since we want our UI to receive the message we should setup a listener over there. In order for us to do that, we need to create a file that handles scripts for us in on the UI side. That’s where the `content.js` file will come in.

### Please do this or Farza will be sad.

Post in #progress with your output from the OpenAI in the service worker console. This stuff is pretty advanced, good stuff :)!
