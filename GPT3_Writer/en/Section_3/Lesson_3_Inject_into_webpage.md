

Let's go ahead and get some listeners going by first creating a brand new file in our `scripts` folder called `content.js`! This file will hold all of our scripts for the frontend of our extension, such as DOM manipulation 🤘.

Now, for our extension to know that this is the file that we will use for our frontend scripting, we need to let the `manifest.json` file know. Go ahead and head there and add this to your file:

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
  "background": {
    "service_worker": "scripts/contextMenuServiceWorker.js"
  },
  "permissions": ["contextMenus", "tabs", "storage"],
  // Add this array here
  "content_scripts": [
    {
      "matches": ["http://*/*", "https://*/*"],
      "js": ["scripts/content.js"]
    }
  ]
}
```

This array says, for any site we go on, allow us to run script code on it to do things like DOM manipulation.

Now, if we decided to just run this now, we would get an error in our service worker saying, no response was returned from our message — connection closed. Our `content.js` file is here to change that by being around to listen to messages from our service worker.

Lets head to our `content.js` file and setup our listener:

```javascript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'inject') {
    const { content } = request;

    console.log(content);

    sendResponse({ status: 'success' });
  }
});
```

This looks very similar to our `sendMessage` function, but in reverse! When this listener is triggered, it will receive 3 props, `request` , `sender` , and `sendResponse` . We really care about `request` and `sendResponse` right now.

Our request is going to be the object that holds the good stuff — message and content. But before we process anything, we want to make sure to check that our message is for our inject action. If so let’s grab the `content` from it. 

For now, we are going to just print out whatever the message sends our way and then use the `sendResponse` callback to send a message back saying things are perfect and nothing went horribly wrong 👀.

We are ready to test out our message functions! If you have never worked with this type of messaging before, get ready to be amazed. A lot of this project has some crazy magic moments and this will be one of them.

Go ahead and reload your extension and head back to Calmly! Before we test this fully a few 🚨VERY IMPORTANT NOTES 🚨-

1. Make sure to **refresh** whatever tab you’re on else the messaging will be a bit wonky
2. to see the log messages from `content.js` just open up the console in your web browser tab (not the extension logs)! Remember this is a front end script we are dealing with :)

If you don’t refresh, stuff will not work as expected. If you look at the wrong console, you won’t see anything :P

![Screenshot 2022-11-27 at 5.47.18 AM.png](https://i.imgur.com/8h7w1EJ.png)

**BOOM** — just like that we get our `generating...` and GTP-3 output! 

We’re sooo close now and this is where the true customization comes into play. By this point if you haven’t changed up your extension to be something other than a blog generator — take some time right now and think about it. This is your time to bring the power of GPT-3 to any website you want doing whatever you want. Pretty wild.

### It’s time — injecting into Calmly

You’re probably like, “damn Farza you keep hyping up this injection thing, but you haven’t even pointed at how to do it”. Alright alright, we here now.

Let’s dive right back into our `content.js` file. When we receive our content we want to take it and massage it in a way where Calmly (or the website you are using) will be able to receive it and render it as if you typed it.

This is probably one of the most difficult parts about this process. Every site does this different and has different elements on it. Depending on the sites you plan to use, you will need to dig through a lot of the HTML to understand how it’s structured! It’s a difficult process, but my goodness it’s amazing when you see it all come together.

Go ahead and add these two lines in your message listener + declare a new function in `content.js`:

```javascript
// Declare new function
const insert = (content) => {}

chrome.runtime.onMessage.addListener(
  // This is the message listener
  (request, sender, sendResponse) => {
    if (request.message === 'inject') {
      const { content } = request;
			
      // Call this insert function
      const result = insert(content);
			
      // If something went wrong, send a failed status
      if (!result) {
        sendResponse({ status: 'failed' });
      }

      sendResponse({ status: 'success' });
    }
  }
);
```

It’s awesome how chrome makes it so easy to hook into these events and add our own custom logic. We are going to use this `insert` function to actually find the proper HTML we need to inject our output into and then return a response.

Before we go super deep into the `insert` function, I’m going to layout the flow we should follow with comments inside the function and then fill it in one by one (this is actually called psuedo code):

```javascript
const insert = (content) => {
  // Find Calmly editor input section

  // Grab the first p tag so we can replace it with our injection

  // Split content by \n

  // Wrap in p tags

  // Insert into HTML one at a time

  // On success return true
  return true;
};
```

Sick — this type of brainstorming always helps me setup some sort of flow without writing code. It becomes super clear the steps I need to take to get to where I wanna go. Let’s start from the top then, finding the calmly editor input section.

To get everything we need here we are going to need to inspect! If you have never inspected a website before, this will be a great way to start. Using the inspector can help you debug code, see how other sites structure their code, and even help you develop faster!

All you need to do is press `CMD + OPTION + i` (macOS) or `CTRL + ALT + i` (Windows) to get a popup with all the elements of the page!

Wow. There is a lot of shit going on here lol. Step one though is to find where we can actually write in calmly because well, thats where we are trying to insert our text. 

![Untitled](https://i.imgur.com/DiO4GiK.png)

Play around in here for a bit! You’ll notice you can use your cursor to hover over elements or just your arrow keys. Again, the goal for Calmly is to find the `div` where I typed in “hi there :)”.

Looking deeper we can see a `p` tag is created and inserted inside this `div` . But what are we actually looking for here?

We essentially need to write code that says — take me to this div and insert a `p` tag with some text in it. Okay nice, we can do that! But how? Javascript to the rescue! 

The `document` element has tons of fancy operations to help us pinpoint specific elements in HTML and manipulate them.

**ALRIGHT CODE TIME:**

```javascript
// Find Calmly editor input section
const elements = document.getElementsByClassName('droid');

if (elements.length === 0) {
  return;
}

const element = elements[0];
```

So this is actually pretty simple! If you noticed, that `div` that holds our `p` tags, has a class named `droid`. We have an easy way to find this — `getElementsByClassName` ! 

You’ll notice it returns a list of these items, because technically there can be multiple divs with this classname. Since we know this is the topmost div with this class name it’s safe to just pop it off the top.

Now we are going to do something a lil weird — remove the first `p` element of the `droid` div:

```jsx
// Grab the first p tag so we can replace it with our injection
const pToRemove = element.childNodes[0];
pToRemove.remove();
```

This is just for fanciness sake, but essentially we want it to feel like you are submitting something and it has different loading states. 

Imagine you had a flow that looked like this:

![Screenshot 2022-11-27 at 5.49.31 AM.png](https://i.imgur.com/Ivkr8cH.png)

Would be much better if this was replaced on the first line, right? So thats all these two lines are doing before inserting the next piece of content.

Okay nice — so we are grabbing some divs manipulating some text, pretty cool right? Now lets take some real data and mess with that to inject.

Our response from GPT-3 is actually nicely indented (yo thanks OpenAI) so we want to make sure to abide by that here as well! This is where step 3 comes in:

```javascript
// Split content by \n
const splitContent = content.split('\n');
```

If you have never seen this before, all it means is “new line”. This tells your text editor to indent text to the next line. Indentations are a pretty big deal, especially in a blog post! They help breakup content and show emphasize on certain parts. So we want to make sure to account for this.

If we take a look at what Calmly does when we press enter (or add a new line) it adds this type of HTML:

![Untitled](https://i.imgur.com/Kbo5ZLt.png)

That means if we encounter a `\n` we should create this `p` tag with a `br` element in it (break). 

**ALRIGHT -** so to capture this stuff, we are going to actually go through the content string and split it at these newline characters. This will help us to know where and when to add a new line in Calmly :).

To do that we can write this cool little piece of code:

```javascript
// Wrap in p tags
splitContent.forEach((content) => {
  const p = document.createElement('p');

  if (content === '') {
    const br = document.createElement('br');
    p.appendChild(br);
  } else {
    p.textContent = content;
  }

  // Insert into HTML one at a time
  element.appendChild(p);
});
```

First thing’s first, lets go through our content string and put each line in a `p` tag! Really this consists of creating a new `p` tag via code and then inserting the text into the `textContent` of the element.

Again, if we hit a `\n` (which also is `''` ) we are going to put a `br` element inside the `p` tag!

Finally, we take that beautifully constructed `p` tag and append it to the `droid` `div` element that we found earlier. I guess those *****were***** the droids we were looking for.

**WELL WELL WELL** — looks like we are ready to give this thing a proper run :). If things work out you have just unlocked a crazy cool new skill — GPT-3 AND Chrome extensions. 

For real, this stuff is not easy to get into and you’re out here doing just that. Alright lets see this thing fly.

Go ahead reload your extension, refresh your webpage and run through your testing flow:

![Screenshot 2022-11-27 at 5.54.24 AM.png](https://i.imgur.com/x4kRkqO.png)

**WOW it’s beautiful 🥲.** This is insane… You should have seen `generating...` and then your next blog post drop right into Calmly!

Congratulations my friend — **YOU DID IT.** You can now drop GPT-3 calls anywhere on the web! 

### Please do this or Farza will be sad.

Post a screenshot in #progress showing off the text generated in Calmly by the injection script. Amazing work!
