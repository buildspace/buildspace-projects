[https://vimeo.com/775481289](https://vimeo.com/775481289)

At this point you’re probably pretty buried in your code. Fine tuning your model, making your website look even cleaner and more connected to your idea. But I want you to take a minute to take a step back and look at where you started, where you are, and where you’re going.

You may have just heard about this GPT-3 thing or have been interested in it for a while, either way you started off by just playing around with it on this thing called OpenAi playground. You picked up some epic learnings like prompt chaining and how you can train / make your models even better.

You took all that and built out a website that anyone can go on and use your custom AI on. You have just given people a way to access the insanity of GPT-3 through your own idea + website and thats freaking epic.

**NOW** — we wanna take you one step further and show how you can use GPT-3 anywhere on the internet with chrome extensions.

### Wtf are we building?

Building a website where people can use GPT-3 in a closed environment is cool, but what if you could tap into the power of GPT-3 anywhere on the web? As we’ve seen, GPT-3 is way more powerful when it has context and a bunch of stuff to work with - that was the whole point of prompt chaining.

We’ll do this by building a Chrome browser extension that will let us inject GPT-3 responses into an online text writer, a lot like the OpenAI playground. I’m going to continue with the blog post writer idea I built for the website and you should also continue to extend your idea!

### Why build an extension?

Browser extensions are seriously overlooked. They’re basically an easy way to modify parts of the internet and can make **insane** products. Just recently, PayPal bought Honey, a browser extension that adds coupons to online checkouts for $4 billion 🤯. 

By combining the versatility of browser extensions with the massive brain that GPT-3 has, you can use anything on the internet to generate stuff. Imagine an extension like [Blackmagic](https://blackmagic.so/) that generates responses to tweets lol.

One important bit of context here is that you need to focus your extension on **one** area or website. Think of Grammarly - it works on `textarea` components. Password managers only work with `password` inputs. I’ll show you the cheat codes on one website and leave it up to you to take it and build whatever crazy ideas you have :).

### How an extension works

Browser extensions are pretty simple - they’re made with the same stuff you make websites with: **HTML**, **CSS** and **JS**. You can think of an extension as an enclosed web app that has “under the hood” functionality to secret things in Chrome that regular websites don’t usually get access to!

The three main parts we’re going to work with are:

1. **The popup UI** - built with plain HTML/CSS, this is what the user sees when they click the extension icon
2. **Content scripts** - JS files that handle the logic of our extension, including the logic of our popup UI
3. **The service worker** - also a JS file, this is like our server: it’s loaded to handle tasks in the background when needed and it goes idle after it’s done

![Untitled](https://i.imgur.com/qhkATwy.png)

In case you are more visual, here’s a handy graph of the architecture from the [Chrome docs](https://developer.chrome.com/docs/extensions/mv3/architecture-overview/).

Like most extensions, our extension will take data in from the browser, do some magic with it, and then inject a response into the UI (the tab we’re on). 

**LET’S GOOOOOOOOOOOOOOOOOOO!** 

### Getting started

Start building your $5b browser extension by cloning [this repo](https://github.com/buildspace/gpt3-writer-extension-starter). There’s no build or setup step here, the files are all you need to get going. Since this is Chromium-based, it’ll work on almost all the popular browsers - Google Chrome (lol), Brave and even Microsoft Edge (where my Edge homies at).

```
git clone https://github.com/buildspace/gpt3-writer-extension-starter
cd gpt3-writer-extension-starter/
```

There’s nothing in here except some assets and a `manifest.json` file. The `manifest.json` file has a bunch of metadata - it tells the browser what the extension is called, which assets it needs, what permissions are required for it to run and identifies which files to run in the background and on the page.

### Building the manifest.json file

The goal of this extension is for you to build on your current idea. For example, if you’re creating a blog post generator and you use Substack all the time, you can build this extension to work with Substack and insert your GPT-3 generated text **DIRECTLY** into Substack’s text editor. It’s pretty powerful and you’re about to unlock this new power.

I’m going to continue building on my magic blog post generator and inject it into a site called [Calmly](https://www.calmlywriter.com/online/). It’s a text editor I use all the time. Again - **you can pivot here.** If you have a kick-ass idea for what GPT-3 can do on a specific website/app, go for it.

But — the strategy I’m going to show you here to inject into Calmly can be used on any website on the web — Reddit, Notion, Twitter, whatever.

Here’s the basic stuff we’ve given you in `manifest.json`— this is the time to change it up to your app idea:

```json
{
  // Change to your title
  "name": "magic blog post generator",
  // Change to your description
  "description": "highlight your blog post title, we'll generate the rest",
  "version": "1.0",
  "manifest_version": 3,
  // Update these assets in the folder
  "icons": {
    "48": "assets/48.png",
    "72": "assets/72.png",
    "96": "assets/96.png",
    "144": "assets/144.png"
  },
  "action": {
    "default_popup": "index.html",
    // Change the default title
    "default_title": "Generate blog post"
  }
}
```

If you copy paste this you’ll need to remove comments btw :P

Because extensions can basically become malware that runs in your browser, security is a huge deal with them. You need to explicitly declare which permissions your extension needs. Make sure to add this line, we’ll explain later:

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
  // Add this line
  "permissions": ["contextMenus", "tabs", "storage"]
}
```

### Creating a UI for your extension

Our extension is going to have a super basic UI. This UI will be for inputting our OpenAI API key. You're going to need this because:

1. You need an API key to call GPT-3
2. We don’t just want to hardcode it, so we are asking the user for it
3. We want it stored in extension storage which can only be accessed by the person on the computer

This way we don't have to worry about OpenAI credits - the users do it all!

Take a look at your `manifest.json` file that and find the `default_popup` action. This is the file we will create to show up in our extension on open!

Create a new file at the root of your project called `index.html`

```html
<html>
    <head>
        <link rel="stylesheet" href="index.css">
    </head>
    <body>
        <div id="key_needed">
            <p>To get started, add your OpenAI API Key!</p>
            <input id="key_input" />
            <button id="save_key_button">Add key</button>
        </div>
        <div id="key_entered">
           <p>You entered your OpenAI API Key.</p>
           <button id="change_key_button">Change key</button>
        </div>
    </body>
    <script src="index.js"></script>
</html>
```

Super simple, just some imports and classes. We'll show the `key_needed` div when the storage is empty and hide it with the `key_entered` div when there is a key in storage.

Let’s move onto styling all of this with CSS. First we’ll need to create an `index.css` file at the root of your project and set it up with this:

```css
body {
    min-width: 250px;
}

#key_entered {
    display: none;
}
```

Again, super basic. Just start with `key_entered` as a hidden `div` and we will be using Javascript to change that property. That will lead us to the `index.js` file that is also imported on the html page. Go ahead and create a `index.js` file at the root of this directory as well!

We are going to start by writing some listeners so we know when buttons are clicked!

```javascript
document.getElementById('save_key_button').addEventListener('click', saveKey);
document
  .getElementById('change_key_button')
  .addEventListener('click', changeKey);
```

You can see we're listening to `save_key_button` and `change_key_button`. These will both call different functions. Let’s get the function declaration setup for both of them, but start with the first listener and create the `saveKey` :

```javascript
const saveKey = () => {}

const changeKey = () => {}

document.getElementById('save_key_button').addEventListener('click', saveKey);
document
  .getElementById('change_key_button')
  .addEventListener('click', changeKey);
```

Nice! We want to save the OpenAI API Key that is entered. This may feel sus, but don’t worry this is actually pretty safe. The safest thing to do here would be to create an entire service to handle these requests — but we’ll leave that up to you 🙂

Here’s what it looks like:

```javascript
const saveKey = () => {
  const input = document.getElementById('key_input');

  if (input) {
    const { value } = input;

    // Encode String
    const encodedValue = encode(value);

    // Save to google storage
    chrome.storage.local.set({ 'openai-key': encodedValue }, () => {
      document.getElementById('key_needed').style.display = 'none';
      document.getElementById('key_entered').style.display = 'block';
    });
  }
};
```

We’re grabbing the input value from the input box itself, then doing some Base64 encoding on it (this just makes it difficult to read to the naked eye), then setting the key in google storage and finally change CSS setting to show the “you have entered key” dialog.

You might be getting a JS error here — we still need to add the `encode` function! Super simple one-liner that you’ll put right above the `saveKey` function:

```javascript
const encode = (input) => {
  return btoa(input);
};
```
As the function name suggests, we're encoding whatever is passed in to something else. `btoa` stands for [Binary to ASCII.](https://developer.mozilla.org/en-US/docs/Web/API/btoa) All we’re doing here is changing the format - this is **not** secure at all lol

Finally, let’s add some fanciness to the `changeKey` function:

```javascript
const changeKey = () => {
  document.getElementById('key_needed').style.display = 'block';
  document.getElementById('key_entered').style.display = 'none';
};
```

This is a really simple function that enables the `key_needed` ui to be shown to enter a new API key if needed. 3 for 3 simplicity lets gooooo.

Now, you have these two different states, how do we know which one to show first? We can actually write a function that runs every time the extension is opened to check for a key stored in our extension storage. If there is already a key show the `key_entered` UI else show the `key_needed` UI.

At the top of your `index.js` file, go ahead and add this:

```javascript
const checkForKey = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['openai-key'], (result) => {
      resolve(result['openai-key']);
    });
  });
};
```

All we are doing here is checking for the key in our state. If it’s there go ahead and return it! We use a promise here because we need to wait for the callback to be called in the `chrome.storage` section. Once it’s called we can resolve our promise. 

Finally, call this at the very bottom of your file. Every time your extension is opened this will run:

```javascript
checkForKey().then((response) => {
  if (response) {
    document.getElementById('key_needed').style.display = 'none';
    document.getElementById('key_entered').style.display = 'block';
  }
});
```

We wait for the promise to resolve and then we set it accordingly. If the key is there, show the `key_entered` UI. EZPZ.

We have written **QUITE** a bit, but actually haven’t tested anything to see if it works lol. How can you test your extension quickly and easily? Check out these steps:

1. **Go to extensions** - Head to your browser and go to `chrome://extensions` (note this will be different if you are using another chromium based browser). Here you will see a list of extensions. 
2. Make sure you enable developer mode on the top right.
3. **Load unpacked extension -** We are going to get our extension loaded up in our browser to actually test out! Navigate to the **root** of your project folder
4. **Let it rip** - If all went well you should see your extension in all it’s glory in your list of extensions!
    
![Screenshot 2022-11-27 at 5.20.23 AM.png](https://i.imgur.com/dvkOyi0.png)
    

Just like any other extension here, you should be able to see it in your list of extensions! Go ahead and click on it and see the magic **UNFOLD ✨**

![Screenshot 2022-11-23 at 5.14.09 PM.png](https://i.imgur.com/0h1mgyI.png)

Once you press add key your UI should change! Play around with it a few times to make sure it works!

And you’re done with the UI! Everything else with our extension will happen using context menus (the box that pops up when you right-click anywhere on the internet). 

You can do all sorts of stuff with the UI in extensions - use React, make them pop to the side, it’s a wild world. Come back to the UI later when you’re done with the rest, sidebars are fun to play with.

One big note here — **there is no hot reloading!**

So, every time you update your code, you have to go back to your list of extensions, find yours, and press the refresh button on the bottom right:

![Untitled](https://i.imgur.com/Ma9zU1C.png)

But that's not all! Remember that extensions are injected _into_ your browser tabs when the tab loads. Refreshing the extension alone is not enough. You also need to refresh the tab you're using it on. So the flow will go:

1. Change extension code in VS Code 
2. Reload extension in your browser
3. Reload any tab you want to use the extension on
4. Click the extension and add in the API key
5. Test!

You'll get used to this pretty quick :P

7/10 issues I'm seeing on Discord are because of this. There could be changes that you write that actually never applied to your bundle yet. Sometimes, if you're noticing that your code isn’t updating I recommend just deleting the extension and loading it from scratch.

### Please do this or Farza will be sad.

Post in #progress with a screenshot of your fancy new Chrome extension!
