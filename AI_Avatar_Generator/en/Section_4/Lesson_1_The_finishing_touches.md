### Hide your unique subject identifier

It’s kinda wack that your users have to type “abraza” to generate prompts of you. This is an easy fix! Just use the Javascript `replace()` function to hide it from them!

Right before you make the API call in `index.js` inside `generateAction` , put in something like this:

```jsx
const finalInput = input.replace(/raza/gi, 'abraza');

const response = await fetch('/api/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'image/jpeg',
  },
	body: JSON.stringify({ input: finalInput }),
});
```

`replace` takes in a regular expression, that’s what the `/raza/gi` fanciness is. You can use something like [AutoRegex](https://www.autoregex.xyz/) which is a GPT powered regex translator if you have various spellings or nicknames! Most of the time, `replace("name", "unique_ting")` will work just fine.

You can read up more about replace [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace), it’s pretty simple, and regular expressions [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) (they’re not simple at all 💀)

### Give your users some fancy prompts

Shall we bestow some of your magic onto your users? They’ll get much better results if you give them some prompts they can modify. They probably don’t know who all these fancy artists are, so let’s build some buttons that fill these prompts in!

I’m not gonna walk you through this, but really all this would be is a set of buttons that update the value of `input` in `index.js` to preset prompts. 

While you’re at it, might as well split up the input bar into the core 4 pieces - artist, medium, vibe, descriptors. This will train the users ***how*** to write good prompts without them even realising!

So you gotta build two things - 

1. A few buttons that auto populate the prompt input field with preset prompts
2. Four fields for each minor 

Here’s a messy mock-up of what this might look like:

![https://hackmd.io/_uploads/BJ_I96Vqo.png](https://hackmd.io/_uploads/BJ_I96Vqo.png)

All you’d have to do is `[concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/concat)` the fields together for the final prompt. Ezpz. 

These two bits are really important! Most devs don’t really think about how simple tweaks like these impact the user experience. By being explicit about what the user needs to describe, everyone from your grandma to your dog will be able to generate good stuff.

************************************************************************Designing simple products takes more work than messy, complicated products.************************************************************************

My design has lots of room for improvement. Should the artist field be a dropdown instead? Wtf is a descriptor? What do vibes even look like? 

I’ll leave it up to you to take it further, maybe store generated images and their prompts in a DB so your users can look at old results while they wait for new images to be generated? That’d be pretty cool!

### How do I let other people generate avatars of their own?

The big money maker. Getting people to generate their own images. There’s no way around training models - you’ll need to use Dreambooth to created a customised model **for each person**. This **********will********** cost money. The way the big players like Lensa and AvatarAI do it is renting bare metal GPUs via cloud providers like AWS or GCP.

Their entire operation is a programmatic way of the manual parts you did in this build.

If I had to guess, their flow is probably something like:

1. Get 5-10 images from user
2. Process images (resize, remove background)
3. Tune Stable Diffusion model with GPUs
4. Use predefined prompts to generate 50-100 images
5. Send user images, maybe delete their model

All of this is simple-ish to do programmatically. The trick here is getting GPUs for as cheap as possible. Idk if you can get GPUs as cheap as Lensa ($3.49 for 100 avatars lol), but the opportunity here is in steps #2 and #3 I think. 

There are awesome platforms out there that help you build these flows for a cheaper price such as, [banana.dev](https://banana.dev). We were able to get some credits from them to give you!

Complete this project, claim your NFT, and get instructions on how you can get access to 10 free hours of GPU time!

Maybe thats all you need to get your business going 🤘.

## Deploy with Railway
**GTFOL: Let’s go to prod.**

It’s time to [gtfol](https://www.urbandictionary.com/define.php?term=GTFOL&utm_source=buildspace.so&utm_medium=buildspace_project).

We don’t want to just stay on localhost, after all. That’d be boring! The whole point of this app is to let your friends and family create alternate realities with you.

Deploying a NextJS app has gotten **SUPER** easy - this should just take a few minutes — and then you’ll have a link to your creation you can share with the world.

Check out this vid to find out what you’ll need to do here :)

[https://vimeo.com/786521187](https://vimeo.com/786521187)
