Lets hop right into it — by the end of this section you’re going to have generated your first AI avatar image while getting into the insanity of prompts.

Why don’t we start with wtf a prompt even is? 

A prompt is like a magic spell - it’s a sentence or set of phrases that describes an image you want. You need to use the right words in the right order or things will get weird.

![](https://hackmd.io/_uploads/S1e-I649j.png)

We're going to be writing lots of prompts and we'll get into the advanced stuff quite quickly, so I suggest checking out this awesome [Prompt Engineering 101](https://buildspace.so/notes/prompt-engineering-101-sd) note from our resident prompt mastermind Jeffrey to get caught up. Check him out on [Twitter](https://twitter.com/ser_ando), he posts some crazy good shit there.

Just a heads up here: creating prompts is a skill. You won’t become a prompt god within 30 minutes. Most of your prompts will suck, but that’s okay. 

**When you’re bad at something, the only guarantee is that you will get better at it :)** 

There are a couple of places you can generate images, we are going to start with [DreamStudio](https://beta.dreamstudio.ai/) - it’s the official tool provided by Stability AI, the company behind Stable Diffusion, it’s got the latest version, and it lets you configure some important stuff.

![https://hackmd.io/_uploads/HyiEJG3ds.png](https://hackmd.io/_uploads/HyiEJG3ds.png)

You’ll start with 100 credits, which will be enough for 100-200 images based on your settings. Make sure you open up the settings and crank up the steps - the higher the # of steps, the greater the accuracy of the image. I went with 75 steps. You’ll also want to change the model to Stable Diffusion 2.1 (or whatever the latest one is). I also turned it down to two images per prompt cuz I don’t wanna blow through the credits lol. 

What I want you to do here is **find your style**. Play around with all the modifiers I’m gonna share. We’ll build up layer by layer, so you’ll have lots of chances to mix things up. 

I’m going to base my site on creating AI Avatars around the LOTR world. This is your time to pick a theme and go all in on it. Your app will end up 10x better if you have a direction to follow.

Alright, alright enough explaining — let’s do this.

### Art History/Theory crash course

Ya know how people joke about Art History being a useless degree? It's the complete opposite with AI art lol. Like Jeffrey mentioned in the 101 note - you need to know the techniques of real artists and the various styles so you know *how* to describe the next Creation of Adam.

These models aren't aliens from another planet - they're all of humanity squished into a single program. Everything we've put on the internet for the past decade has culminated into these gargantuan entities that label things just like us. 

We are going to generate epic art as we go through each pillar of what makes art so appealing. You’ll be able to see how each part interacts which each other and how they blend seamlessly together.

**As we take a journey through art history, we are going to actively be trying out prompts in DreamStudio! So, make sure it’s open and ready to rock 🤘.**

**Artist**

**Leonardo. Raphael. Michelangelo. Donatello.** 

Almost all of the world’s most renown artists have distinct art styles. The internet is full of their work and all sorts of derivatives - inspirations, tributes, imitations. This makes using artist names in prompts **incredibly** powerful.   

Artist names are going to have the **most** impact on the style of your image. It's going to be the base your image is built on and will be responsible for a good chunk of the vibe. 

If, like me, the only artists you know are the ones named after the Teenage Mutant Ninja Turtles, here’s a list of various artists you can try:

- James Gurney
- John Singer Sargent
- Edgar Degas
- Paul Cezanne
- Jan van Eyck

This specific modifier is a really tricky one - all text-to-image models are trained on art taken from the internet, without explicit permission from their creators. There’s a lot of ongoing discussions about **who** owns the images generated using these models and a lot of artists are angry because they don’t consent to their art being used for training. 

The names on this list weren’t chosen by accident - 4 of them are historically famous portrait artists (who are dead), the fifth is okay with their name being used for AI art.

All this is to say - **respect artists’ decisions and don’t use specific art styles without permission from their creators.**

You could go on sites like [ArtStation](https://www.artstation.com/) and [DeviantArt](https://www.deviantart.com/) to find more artists you like, or maybe take a shower and go to your local art museum, I promise it’ll be worth it and you’ll learn a lot more about art.

**Time to generate**

I live in Auckland, New Zealand - just an hour away from the Shire, so I’m gonna use SD to imagine Gandalf if he was made by Disney. Here’s my first prompt!

```json
A profile picture of Gandalf from Lord of the Rings in the style of Pixar, smiling, in front of The Shire
```

Pretty simple! You’ll learn that you don’t **need** a lot of detail in your prompts, you just have to be specific about what you want. This is an important distinction. I cranked up steps in the settings to 150 - this makes the results better but costs more GPU time. 

Here’s the best one I got back:

![](https://hackmd.io/_uploads/S1h7GWH9j.png)
Not bad. The hair is a bit wonky and he’s missing teeth, but this is just our first prompt :P

Let’s try changing up the medium!

**Medium**
**Acrylic. Watercolor. Microsoft Paint.** 

Vincent Van Gogh never made pixel art, but with the power of Stable Diffusion, you can find out what that might have looked like. 

Stick with more popular mediums like digital illustrations, paintings, and pixel art. The more content out there, the better Stable Diffusion will be at it. A shadow painting won't be as good as an oil painting because the internet has way more oil.

Here's a list of mediums you can play with:

- Acrylic painting
- Watercolor painting
- Pixel art
- Digital Illustration
- Marble sculpture
- Polaroid picture
- 3D render

Some of these mediums can be combined! Here’s a Dr Strange sculpture made with “chrome copper marble” that [Jeffrey conjured with MidJourney](https://twitter.com/ser_ando/status/1600335448039006208):

![](https://hackmd.io/_uploads/rJLILpVqi.png)

We truly are in the future.

I think I wanna see what a 3D render of Gandalf would look like. Here’s my updated prompt:

```
A Pixar style 3D render of Gandalf from Lord of the Rings, smiling with his mouth closed, in front of The Shire, green hills in the back
```

Not much has changed. I’ve added in “3D render” and left the rest as it is.

![](https://hackmd.io/_uploads/By4v8aNqj.png)

**Insane —** how frickin cool is this??

**Aesthetic**

You’ve got your medium and your artist. Next we’ve got the vibes — is this a lofi kinda mood or are we going cyberpunk?

Here are my favourites:

- Fantasy
- Vaporwave
- Cyberpunk
- Steampunk
- Gothic
- Sci-Fi, futuristic

[Here’s a massive list of aesthetics](https://aesthetics.fandom.com/wiki/List_of_Aesthetics) for you to check out. You can even make your own vibes! Here’s Dronecore fashion made with GPT-3:

![](https://hackmd.io/_uploads/BJxK8TE5s.png)

[Source](https://twitter.com/fabianstelzer/status/1599525776952414208)

I want something in fantasy colours so I went with this:

```
A Pixar style 3D artwork of Gandalf from Lord of the Rings, smiling with his mouth closed, in front of The Shire, green hills in the back, fantasy vivid colors
```

![](https://hackmd.io/_uploads/SJEqI6V5o.png)

This is starting to legit look like a Pixar version of LOTR lol.

**Descriptor**

The last ingredient I want to cover is the most vague one - it’s not one specific area, it’s general descriptors.

- **Time** 1970s, stone age, apocalypse, ancient, great depression, world war II, victorian
- **Seasons** Winter, summer, spring, autumn
- **Holidays** Eid, Christmas, Diwali, Easter, Halloween, Hanukkah
- **Details** Detailed, hyper-realistic, high definition, trending on ArtStation (yes, really)

Take a stab at this and add a couple of these descriptors to your prompt! When you get an image you like, make sure to drop it in `#prompts` in our Discord to show others what you came up with!

There’s **so much more** you can do with prompts. You could spend weeks learning all about how humans describe things. I’ll leave you to it with this one bit you need to remember:

**AI models are trained on almost all of human media on the internet** 

That means anything you can find on the internet this model probably knows about it too. Stills from famous movies. Fan art of characters. Breakdowns of iconic scenes from specific directors. Shots of varying camera angles, different films, resolutions, lighting, lenses, photo genres. The AI has seen all (except the NSFW stuff, they removed it :P).

I’ve found the internet is bigger than my immediate imagination, so if you can imagine it, it’s likely that the AI knows about it, you just need to find the right words. 

Here’s a few handy links with various examples of what words can do:

[**Medium**](https://docs.google.com/document/d/1_yQfkfrS-6PuTyYEVxs-GMSjF6dRpapIAsGANmxeYSg/edit)

[**Color**](https://docs.google.com/document/d/1XVfmu8313A4P6HudVDJVO5fqDxtiKoGzFjhSdgH7EYc/edit)

[**Camera**](https://docs.google.com/document/d/1kh853h409DeRTg-bVo_MSYXrWjMDRMX9kLq9XVFngus/edit)

[**Lighting**](https://docs.google.com/document/d/1qcpgNsA-M998zy0ngVvNcMs2AYHpMuAjAefM6p63Tp8/edit)

[**Film**](https://docs.google.com/document/d/1vM9izOU4bQIcrKxAZiw85Q826zb6kBsjUQKdawm3lyk/view)

Take a step back and look at your beautiful (and not so beautiful) creations. You are well on your way to generating the next wave of amazing art for the world — now let’s 10x that.

### Advanced configuration flags

Well, well, well — fancy seeing you here in the advanced section 😏. Hopefully you found some magic generating images with DreamStudio. Let’s see how we can make this even better by making it easier for SD to understand.

Most models out there have ways to configure settings *inside* your prompt. What you can do and how you do it depends on the model. For instance, DreamStudio let’s you combine multiple prompts with the pipe `|` character:

```
Portrait illustration of Gandalf from Lord of the Rings : 2.0 | The Shire in the background: 0.4 | Renaissance oil painting
```

The numbers after the prompt indicate the weight, which can go up +/-10.0. Click the question mark on the top left of the prompt input box for more detail

![](https://hackmd.io/_uploads/r1jo86Vcj.png)

Looks like I’ll have to push the weights on the background, but this is pretty good!

For the other models out there, they each have their different weights. If you decide to use something else, like Midjourney, make sure to checkout their manual!

### Negative prompts

We’ve talked a bunch about how to tell Stable Diffusion if you want something in your images, but what if you ***don’t*** want something? Let me show you :). 

You might have noticed I’ve been telling Stable Diffusion I want Gandalf to smile with his mouth closed for a bunch of prompts. This is cause it usually messed up his teeth. I can do the same thing by giving it a negative weight like this: `smiling:-1`

```
Renaissance portrait of Gandalf from Lord of the Rings in the style of The School of Athens, vibrant colours, highly detailed : 2.0 | The Shire in the background : 0.8 | Detailed baroque painting, Michelangelo Buonarroti, Raphael : 1.0 | Smiling: -1 | Duplication: -1
```

Here’s what I got:

![](https://hackmd.io/_uploads/r1vT8aE9i.png)

**WOW**. I’m liking classical art more and more. 

I increased the weight for the second block and two of these have the shire in the background! For the rest, I just Googled “famous renaissance paintings” cause I know Stable Diffusion will know all the popular ones. I picked the names and artists of the ones I liked and jumped into [Lexica](https://lexica.art/) - a search engine for Stable Diffusion.

I looked up artist names and even just the word `renaissance` to see what prompts do well. As someone that didn’t know the classical art period existed until I was 16, I think this is pretty good!

The one thing I don’t like here is how crowded the prompt is getting. Some services like Lexica have a dedicated field for negative prompts, check it out:

![](https://hackmd.io/_uploads/S1rAIaEqs.png)

It’s funny, this is considered “advanced”, but it’s really not that bad right? It’s more like you have more tools at your disposal to make your prompts even **better.**

### Please do this or Raza will be sad.
You should be on a **REALLY** good path for generating epic prompts! At this point take another 30m to mess around with prompts until you find one that blows you away.

Go ahead and copy your avatar and post it into `#prompts` on Discord. Make sure to include your prompt in the message to give some inspiration to others.