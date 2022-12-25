
Creating good prompts isn’t easy!

Like I said earlier, creating prompts is a skill and you won’t become a prompt god within 30-minutes. My goal is just to give you just enough skill so you can go on and build something interesting later on in this project.

Let me give you another skill that will be super useful to you later on — meta-learning.

### Meta-learning — using what GPT-3 generated as a prompt.
We had to do **a lot of work** to get a good story, right? We had to give it a plot, a villain, all that stuff. We had to keep changing the temperature.

Seems like a lot of work!

That’s because so far what we’ve been doing is called **“zero-shot learning”** — this is where you don’t give GPT-3 any example of something that’s already good. You just expect the first thing it generates to be good. Sometimes, GPT-3 does fine in the scenario. *But just know that zero-shot learning is where GPT-3 performs its worst.*

But the thing that makes GPT-3 really really good is where you give it **examples**.

But, check this out. This is where things get weird.

I can use what GPT-3 generated as an **example** so that the next thing it generates will be even better. I’m going to delete all the `Setting` and `Plot` stuff. We don’t need it. **Now, GPT-3 has a clear example of a story we like so we don’t need all of that.**

**Note: at this point, be sure you have a generated story that you think is decent! Worst case scenario — copy my story.**

Now, my prompt looks like this, where I created a new prompt at the bottom about “Elon and the Space Empire” — but notice once again I don’t need to provide a setting, plot, etc because GPT-3 already has an example.

This is called **“single-shot learning”**. Because GPT-3 has a single example it’s learning from!

```
Prompt: Tell me a full story with a beginning, middle, and end titled "Farza and the Lost Kingdom" set in the 1500s that feels like an anime.

Story: Farza was just a normal boy, living in a poor, broken kingdom that had been destroyed by Furqan. But little did he know that he had secret powers that could help him defeat the villain and take back the kingdom.

One day, Farza decided to confront Furqan and challenge him to a duel. Farza was confident in his abilities, but Furqan was much stronger and more experienced. The battle was fierce, but eventually Furqan emerged victorious.

However, as he was about to deliver the final blow, Farza's latent powers suddenly awakened and he was able to turn the tide of the battle. In the end, Farza emerged victorious and the kingdom was finally free from Furqan's tyranny.

Prompt: Tell me a full story with a beginning, middle, and end titled "Elon and the Space Empire" set in a dystopian future that feels like an anime where Elon Musk has the power to teleport.

Story:
```

I explicitly use `Prompt:` and `Story:` just so GPT-3 knows where the last story stopped, and where the next one should start. And like I said, I also came up with a new storyline at the bottom, now it’s an anime about Elon where he can teleport to save the galaxy. I also ask it this time for more of `fairy-tale type` story vs an anime.

*Note: Try out other genres as well: horror, comedy, sci-fi, etc. Also, please don’t copy my Elon story premise! Come up with your own. Make your story something widely different from the first story.*

What’s crazy here is when I run this, GPT-3 will take **all of this text as input** and use the previous story we generated **as an example for itself.**

Before you run this, change the `Maximum length` on the right to 1000. We’ll talk more about this later, but basically, this is the limit to how long the input + generated output can be. We’ll make it 1000 — this won’t *necessarily* lead to a longer story though. It just gives the model room to do so, though.

*Note: Keep this number small. OpenAI charges based on how much you’re generating. Keep track of how much credit you have left [here](https://beta.openai.com/account/usage).*

Here’s what was generated after I ran the prompt:

```
Elon was just an ordinary boy living in a dystopian future where the space empire ruled with an iron fist. But Elon had a secret power - he could teleport.

One day, Elon decided to use his power to help the oppressed people of the space empire. He began by teleporting into the emperor's palace and stealing his prized space sword. Then, he teleported to different parts of the empire, freeing people from prison and helping them escape to safety.

Elon's acts of defiance quickly gained the attention of the space empire, and they began to hunt him down. However, no matter how hard they tried, they could never catch him.

Eventually, Elon's actions inspired others to start rising up against the space empire. With Elon leading the charge, they were finally able to overthrow the tyrannical regime and create a new, better society.
```

Absolutely fucking insane. Imagining Elon teleporting into the emperors palace to steal his “prized space sword” killed me lol.

Do you see the magic here?

It’s all in the prompt. It takes a while but once you get there it’s insane. **If you’re still struggling with your prompt** — that’s expected. Keep messing with the temperature, keep playing with the input. Feel free to ping the support channel if you need prompt help.

It takes me like 6-12 changes every time to get what I want. For example, is the 2nd story that GPT-3 generates trash? Well — then maybe make changes to the 2nd stories description — give more context + details. GPT-3 is only as good as you make it.

**If you still haven’t come up with a solid story you’re happy with — that’s fine**. Keep on treading forward my friend. No point in getting obsessed with particular prompts!

### Magic: Using GPT-3 as a true writing assistant.

Let me show you something super sick. GPT-3 is really good at completing your thought.

So, we can actually continue building this story by just letting GPT-3 finish our sentence or **starting a new situation**.

Check it out. I’m just gonna stir some shit up. I’m like that chaotic drunk dude at the club looking for a fight.

I’m going to **delete everything** in Playground and use just my Elon story generated above — *be sure you take your own story that was generated, don’t use my Elon story! I keep stressing this, but I really don’t want you to use my stories and premises. Get your own!*

I added a new situation at the end where Elon ends up being the bad guy. I added, ***“But then! A twist! Elon was actually the bad guy. After a decade of peace, things changed. It turns out that”.***

Go ahead and do the same for your story. Notice how I didn’t finish the sentence I’m going to let GPT-3 do that for me.

```
Elon was just an ordinary boy living in a dystopian future where the space empire ruled with an iron fist. But Elon had a secret power - he could teleport.

One day, Elon decided to use his power to help the oppressed people of the space empire. He began by teleporting into the emperor's palace and stealing his prized space sword. Then, he teleported to different parts of the empire, freeing people from prison and helping them escape to safety.

Elon's acts of defiance quickly gained the attention of the space empire, and they began to hunt him down. However, no matter how hard they tried, they could never catch him.

Eventually, Elon's actions inspired others to start rising up against the space empire. With Elon leading the charge, they were finally able to overthrow the tyrannical regime and create a new, better society.

But then! A twist! Elon was actually the bad guy. After a decade of peace, things changed. It turns out that
```

Earlier, it may have been really hard for you to generate a twist. But now, it’s pretty straight forward because GPT-3 can easily continue your story since so much of it is already written.

Once you submit here, you’ll see that GPT-3 literally finishes your sentence around this new situation. It’s pretty cool, here’s what I got:

```
But then! A twist! Elon was actually the bad guy. After a decade of peace, things changed. It turns out that Elon had been using his power to mind control people and make them do his bidding. He had been using the revolution as a way to get more power for himself.

Now, the people of the space empire are once again living in fear, not knowing who to trust. But Elon is still out there somewhere, waiting for his chance to strike again...
```

LOL — pretty wild.

**I want to be very clear — you can keep doing this**. **You can use GPT-3 to complete any thought. The applications are endless,** Keep writing a sentence, let GPT-3 add a few more, write another sentence, see what GPT-3 generates, add another sentence.

You could use this same flow to write tweets, product descriptions, essays, newsletters, articles, blogs, whatever. .

You may be asking, “What happens if I keep clicking Submit and just let GPT-3 keep going by itself?”. Try it out! Go to your story, and keep clicking submit. Eventually — GPT-3 will keep outputting the same thing over and over. Why?

Well, the model needs you (the human) to keep giving it new material to work with so it can better understand what you need. **It isn’t good at just going off on its own**, again, you need to guide it. This is also how you can keep making the story longer.

There is a more interesting way to make the story longer we’ll talk about later.

### Fk it let’s write a song.

If GPT-3 can generate stories — it can *probably* generate a song lol. And if it can generate a song, we can probably be really specific about what the lyrics of the songs are about. Run this prompt on your own:

```
Write me a song that rhymes in the style of Drake that talks about black holes.
```

Be sure to replace “Drake” with an artist you like and replace “black holes” with something else you want your song to be about. Maybe you want your song to be about a girl named Lisa or something.

I actually got a pretty decent output:

```
I'm falling into a black hole
And I can't get out
I'm trapped in this dark space
With no way to escape

I keep falling deeper
Into the abyss
There's no bottom
To this place

I'm spinning faster
And faster
Toward the center
Of this hole

Gravity is pulling me
In tighter
And tighter
Until I'm obsolete
```

If you go [here](https://www.youtube.com/watch?v=pueqv3SS_qA), and forward to 0:25 and start rapping the lyrics above it’s actually legit lol.

You can even do hilarious shit like this:

```
Write me a song for pirates that explains why Python is better than Javascript:
```

Or, fuck it just write a song is a completely different language.

```
Write me a song in Hindi about a boy who lost his computer:
```

I’ll let you play around with this one above, it’s mind-blowing because it **combines creative writing + real-world facts**. Go try and have Taylor Swift write a song explaining how to play Super Smash Bros or something! You can do whatever.

The prompt isn’t perfect so the results may not be amazing, but be sure to mess around with it.

Shoutout out to one of our builders Naklecha who inspired this part of the lesson. He actually turned this story explainer thing into a fully-fledged product [here](https://twitter.com/naklecha/status/1587046444854190081) that uses stories instead of songs.

### Onwards

We’ve already done some pretty crazy shit without a single line of code lol. You can probably imagine tons of ideas at this point.

But for a bit longer, let’s keep messing around in the Playground a **little** bit more — and then we’ll hop to writing some code. I want to show you a few more crazy things and walk you through a few more prompts. **If you suck at writing prompts, none of this will be fun lol.** So, I wanna make sure you got all the secrets!

But — wait a second, how tf does all this stuff even work?

### Please do this or Farza will be sad.

Some big progress was made here! Nice work.

Once again — go ahead and take a screenshot of Playground with your latest story, song, or whatever else you want to show and post it into #prompts on Discord.

Along with the image plz include your **prompt** to make it easy for others to easily see your prompt for inspo.