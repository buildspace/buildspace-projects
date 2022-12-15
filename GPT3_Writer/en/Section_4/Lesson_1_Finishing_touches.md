
*Note: everything here is optional, except the last part titled “Deploy to prod”. Don’t skip that!*

### Optional: **make the extension work on whatever website you want**

You now have a Chrome extension that can literally inject into a web page and generate text using GPT-3 wherever the user is writing.

I really want you to take a step back and understand how crazy that is.

**You have new powers. The possibilities are endless.**

Today, I showed you how to get this thing working on Calmly which is a site that I use to a lot to write. But you can now follow the same exact instructions to get this thing working on whatever site you want -- Twitter, Gmail, Notion, Reddit, whatever.

Remember, the reason it won’t work on any site right now is because every site has a very different HTML structure. So, if you wanna get it working on another site you just gotta inspect that site’s HTML structure and then write some code specific to that site’s HTML. Just like we did with Calmly.

For example, Twitter has a much more complex structure as you can see below. But, could use the same strategy we used with Calmly though.

![Untitled](https://i.imgur.com/AVAy3fi.pngs)

Hope you also see how crazy Chrome Extensions are now as well haha. They give you an insane amount of power.

I wouldn’t be surprised if one of you takes your Chrome Extension to $1M in MRR. I would literally pay $49 a month for a Chrome Extension that did any of these things:

- Inject directly into Figma to help designers write test copy for my designs.
- Inject directly into Google Ads to help marketers write ad copy.
- Inject directly into Twitter help users reply to DMs faster, in a more personalized way. Kinda like autocomplete on Gmail.
- Inject directly into Webflow to help users write landing page copy while actually working on the landing page.
- Inject directly into Notion to help product teams come up with new ideas + write really good specs and keep track of them in one place.

The possibilities truly are endless.

Feel free to try and go get your extension working on your website of choice. Just know it’ll takes a solid amount of trial and error, not every site has an HTML structure as simple as Calmly!

### Optional: set up your Extension for download.

Let’s say you actually want to make your Chrome Extension available for download directly from the Chrome Store like most extensions. *BTW — the Chrome Store is supported on all Chromium browsers — that means Brave users, Edge users, etc can all add the extension from he Chrome Store.*

![Untitled](https://i.imgur.com/oHxDLjO.png)

Well, you’d need to actually submit it for approval which can take a few days. If you want to go down that path, you can read up on it [here](https://developer.chrome.com/docs/webstore/publish/). Highly recommend you explore this later once you’ve polished up your extension more.

But -- for now, what we can actually do is if someone wants to use your Extension we can just give them a download link to the code. Then, they can just do the same thing as you where they go to chrome://extensions/ and load the extension manually to their browser by doing “Load Unpacked”.

This may seem crappy, but, meh it’s better than nothing! Also, if users go through the pain of actually doing this, then that means they really want your product. You can always lessen the pain later once you know someone truly wants what you’ve built.

Go ahead and push your latest code to your repo for your extension. Github gives an easy way for people to download a ZIP file with the whole repo. Then, what’s cool now is you can link this repo directly on your web app!

On your web app, you can add something to the bottom like -- “Like this tool? Download the Extension” and then link your extension. That way people can get a taste of your tool from the web app and then download the extension if they’re curious.

Now, the web app + extension should feel more like an end-to-end product vs two separate things that aren’t related at all!

### Add some personalization

Before we deploy the web app, go ahead and make some final changes to it. Really make it feel like yours! Add images, gifs, change up the colors. Make it feel themed to whatever your use case is. Even just changing up button colors can go a long way to make this thing feel way more like yours.

### GTFOL: Let’s go to prod.

It’s time to [gtfol](https://www.urbandictionary.com/define.php?term=GTFOL).

We don’t want to just stay on localhost, after all. That’d be boring! After all, this GPT-3 writer thing is way more fun once you see how other people use it!

Also, deploying a NextJS app has gotten so easy and should just take a few minutes — and then you’ll have a link to your creation you can share with the world.

We’re going to be using [Railway](https://railway.app?referralCode=buildspace) which is deployment service like Vercel/Netlify. It’s **free** to use. You can use whatever you want though — ex. AWS, Netlify, etc.

The reason I'm going with Railway instead of Vercel is cuz on the Vercel Hobby plan serverless functions time out after 10 seconds. This sucks cause OpenAI can take 30-40 seconds to respond with longer prompts. You'll have to start the pro trial which will kill your app after 14 days unless you pay $20/m lol 

![](https://hackmd.io/_uploads/HkecEt3Pj.png)

Head over to Railway and connect your Github. Once you finish set up and accept their terms of service, you'll get 500 hours for free!

![](https://hackmd.io/_uploads/H1sWrFnvs.png)

All we need to do now is get your final code up on your Github Repo. Open up a new terminal window, `cd` into your project folder, and run:

```bash
git add .
git commit -m "latest build"
git push
```

*Note: we have a .gitignore file that stops us from accidentally committing the `.env` file and other files that we don’t want going to source control.*

Here's how you can deploy it on Railway:
[https://www.loom.com/share/15d1b1c45d0b46199d677ca3dc222d17](https://www.loom.com/share/15d1b1c45d0b46199d677ca3dc222d17)

**Note: Railway won't give you a domain lol**  
You'll have to generate it from the settings tab of your project:
![](https://hackmd.io/_uploads/ryTbIFhDi.png)

**YOU'RE DONE. LFG**
### Please do this or Farza will be sad.

Once you deploy your web app, take a screenshot of your deployed app and post it in #progress! Show the world that you’re off localhost.
