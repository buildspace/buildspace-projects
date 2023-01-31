
Like with all things buildspace, let’s just jump in without explaining anything lol. I think a lot of this you’ll understand pretty quickly once you start messing with it.

### Get access to OpenAI

First thing you’ll need to do is make an account on OpenAI [here](https://beta.openai.com/playground). Once you make a new account, OpenAI will drop $18 in credits to your account. This is more than enough for you to mess around, build your product, and even support ~100 users. Pretty awesome.

Once you make an account, head to the [Playground](https://beta.openai.com/playground). This is where we’ll be spending a bit of time before we even start writing any code.

Don’t worry too much about those settings on the right yet, we’ll get to them. Just make sure your model is `text-davinci-003` and make sure the “Temperature” is set to `0.7`. **And, also make sure `Maximum length` is set to `650`.**

*Note: if you had an account in the past, you’ll need to make a new w/ a different email and phone number because the credits expire after 3-months.*

### Prompt mentality.

A “prompt” is what you input to GPT-3.

I just want to be very clear about something — **the next 30m may be super magical, or they may be painful.** Prompts can be really fkin annoying to write and I just want you to know that.

Prompt engineering is a skill - you won’t be good at it to start, and that’s fine. But, just be sure to keep treading forward. **Remember, your goal is to ship this project. Nothing else.** Don’t get caught up in trying to get **one** thing to work.

Some tips I wish I had when I was learning prompt engineering:

- Good results won’t come ASAP, it takes me 6-12 attempts to get a prompt to a point where I think it’s decent. Don’t expect magic on the first try.
- Iterate fast, and don’t get too attached to specific prompts you’re working on.
- If your output doesn’t end up looking as good as mine, that’s fine. GPT-3’s output can vary wildly based on a few words even.
- Don’t get sucked in trying to make one specific prompt work. After 6-12 attempts, feel free to say fuck it and either a) start the prompt from scratch and change it up a ton or b) move on to the next lesson.

### Build your first few prompts to tell a story.

All you need to start is give GPT-3 a prompt which is the initial text that you input in plain English. I know it sounds weird, but the text prompt is actually how you “program” the model.

I want you to get a feel for the process of exploring a prompt that starts simple and gets more complex. And the first thing we’re going to do is have GPT-3 output a custom-written story. Let’s go!

In playground input the following:

```
Write me a few anime titles.
```

Here’s what it gives me:

```
Write me a few anime titles.

1. Attack on Titan
2. Death Note
3. Naruto
4. One Piece
5. Tokyo Ghoul
```

*Note: what you see may be different because each time GPT-3 runs, there is randomness injected in the model each time so that the outputs differ.*

Pretty cool — these are animes that actually exist. That’s because GPT-3 was trained on a large amount of text on the internet. Be sure to ask it to write you something else (ex. something around movies, music, whatever).

But, I want something **more** custom! I want titles to a **new** anime that features me as the main character. Go ahead and delete everything from Playground.

I’m going to change my prompt 

```
Give me anime titles about a boy named Farza.
```

**Make sure you change your prompt to be personal you.** I’ll be saying this a lot through this build — but, don’t copy my prompts word for word. If all you’re doing is copy-pasting this will be a waste of time.

Use your own name. Maybe you don’t want “anime” titles, maybe you want “sci-fi” movie titles. Maybe you don’t want titles about “a boy”, maybe you want titles around a “dragon”. Get creative. See what happens.

When I run my prompt I get:

```
Give me anime titles about a boy named Farza.

1. Farza and the Seven Seas

2. Farza and the Lost Kingdom

3. Farza and the Search for the Holy Grail

4. Farza and the Last Crusade

5. Farza and the Voyage to the New World

6. Farza and the Land of the Dragons

7. Farza and the Tower of Babel
```

Pretty cool! But, still doesn’t feel super custom. I feel like I’ve heard of these stories before. They don’t feel truly new. **We need to give GPT-3 more information around what we want.**

For now, I kinda like “Farza and the Lost Kingdom” — so, I’m going to take that and now build a simple prompt to output a story. Again, plz don’t copy + paste my prompts — use your own name, your own setting, etc. Maybe you want your story set in space, or underwater, maybe you want your story to include Elon Musk as your side kick — do whatever.

**Don’t just copy me.** If you just use what I give you it won’t be that magical. You need to be sure that you include your own interests in the prompts. Only then will you feel the magic.

```
Tell me a story titled "Farza and the Lost Kingdom" set in the 1500s that feels like an anime.
```

Here’s what I get:

```
Tell me a story titled "Farza and the Lost Kingdom" set in the 1500s that feels like an anime.

Farza was a young girl living in the 1500s in a small kingdom that was on the verge of being taken over by a larger kingdom. One day, she stumbled upon a hidden passage that led her to a lost kingdom that was hidden away from the rest of the world. This kingdom was full of magical creatures and treasures, and Farza quickly realized that she was the only one who knew about it. She decided to keep it a secret and vowed to protect the kingdom and its inhabitants. Over the years, she became a powerful sorceress and led the kingdom to safety.

```

This is wild. **What’s crazy is that GPT-3 understands what the structure of a good story is**. This is a super cool base, now all I need to do is give the prompt a bit more info.

For example — in this case GPT-3 thinks Farza is a girl, I’m a boy! Also, I love the idea of the lost kingdom being full of secret magical type shit, I’ll keep that. I also love the idea that the kingdom was taken by someone else.

But, I feel like the story needs a villain.

Let’s make it happen.

I change my prompt to give it more info: Who is Farza? What’s the setting? Who’s the villain? What’s the basic plot I want? 

```
Tell me a story titled "Farza and the Lost Kingdom" set in the 1500s that feels like an anime.

Farza: a 26 year-old boy that doesn't know he has secret powers.
Setting: a poor, broken kingdom that's been destroyed by Furqan.
Furqan: the villain of the story, he's a mysterious figure with crazy powers.
Plot: Farza wants to beat Furqan and take the kingdom back.

Story:
```

*Note here: I specifically tell GPT-3 where I want my story to start my doing `Story:`. This simply helps GPT-3 to understand that we want it to immediately start outputting the story.*

Notice all the stuff I give GPT-3 here! `Farza`, `Setting`, `Furqan`, and `Plot`. I do this because I’m trying to explain to GPT-3 what I want. Again, we just want to be as specific as possible and literally tell GPT-3 what we want. It can do all the creative thinking, but, **we need to give it basic guidelines**.

**Be sure you create your own setting, plot, villain, etc.**

Tip to make this part easy: *think of your favorite shows, movies, etc.* Mix and match elements from them. That’s where this gets fun lol. Maybe your setting is from your favorite sci-fi movie, your plot is from a book your like, and your villain is Elon Musk, Tom Cruise, or some random real person lol.

Here’s what I get when I run the prompt:

```
Tell me a story titled "Farza and the Lost Kingdom" set in the 1500s that feels like an anime.

Farza: a 26 year-old boy that doesn't know he has secret powers.
Setting: a poor, broken kingdom that's been destroyed by Furqan.
Furqan: the villain of the story, he's a mysterious figure with crazy powers.
Plot: Farza wants to beat Furqan and take the kingdom back.

Story:

Farza had always been a bit of an outsider. He was born in a small village on the edge of the kingdom and never really fit in. He was always daydreaming about adventure and excitement, but it always seemed just out of reach.

One day, Farza stumbled upon a hidden cave. Inside, he found a magical sword. When he picked it up, he felt a surge of power. Suddenly, he knew he was destined for greatness.

He set out on a journey to find Furqan, the evil sorcerer who had destroyed the kingdom. Along the way, he made new friends and discovered his own hidden powers.

Eventually, he confronted Furqan and was able to defeat him. He took back the kingdom and became its rightful ruler.

Farza's story is one of courage, determination, and hope. It's an anime-inspired tale of a boy who found the strength to save his kingdom.
```

**Insane.**

GPT-3 came up with this whole idea of a **hidden cave**, **a magical sword**, all this shit. It literally feels like an anime. At this rate…maybe I’ll take [the $10M we just raised](https://buildspace.so/raise) and spend it on pivoting buildspace to become an anime studio instead lol.

### Some recommendations.

When I was first messing with GPT-3, I was obsessed with getting my exact prompt/story perfect. But, that was my mistake.  Your output will not be perfect.

You’re only like 15-minutes into this journey. Keep going!

So, if your story isn’t that cool yet or you’re noticing that the story is only a few sentences, **you need to keep improving your prompt**. Imagine you were given what you give GPT-3, would you be able to write a compelling story?

Also, you can literally tell GPT-3 what you want. For example, if you feel like your story doesn’t feel very complete you can literally say `Tell me a full story with a beginning, middle, and end`. I actually added this later and it worked super well.

Take some time here to fk around with your prompt. 99% of the time, it isn’t GPT-3 that’s the problem. It’s your prompt. You’ll get better at this overtime!

Few recommendations:

- **Is your story just 1-2 sentences long every time?** No worries, it’s okay. We’ll show you some fixes for this later on. But for now, try to give GPT-3 more info about your character, the plot you want, and the setting. Is your character funny? Is the world they’re in on some futuristic space planet? Set it all up for GPT-3!
- **Not getting a good story?** Try and make your story something that remixes something in the real world. You can literally tell GPT-3 to do so. For example: `Tell me a full story with a beginning, middle, and end titled "Farza and the Magical Red Box". This story should combine vibes from Game of Thrones and Breaking Bad.`. The more context and comparisons you give GPT-3, the better.
- **And most importantly** — don’t get obsessed with the same story/prompt. After a few attempts, it’s fine to say fuck it and delete your whole prompt and try something wildly new.

### Temperature

There are a bunch of crazy options on the right. These are “hyperparameters”. The main one is “Temperature”.

Temperature is basically how risky you want the model to be. A higher temperature means the model will be a bit more unhinged and make more mistakes. A lower temperature means the model will take less risks and just give the more standard “right answer”.

A higher temperature of `0.9` is better for more creative things, like telling a story. A lower temperature of `0.1` is better for prompts with well-defined answers.

Let’s mess with it. Take the prompt you already wrote above, and set the temperature to `0.9` and see what happens.

```
Tell me a full story with a beginning, middle, and end titled "Farza and the Lost Kingdom" set in the 1500s that feels like an anime.

Farza: a 26 year-old boy that doesn't know he has secret powers.
Setting: a poor, broken kingdom that's been destroyed by Furqan.
Furqan: the villain of the story, he's a mysterious figure with crazy powers.
Plot: Farza wants to beat Furqan and take the kingdom back.

Story:

Farza was just a normal boy, living in a poor, broken kingdom that had been destroyed by Furqan. But little did he know that he had secret powers that could help him defeat the villain and take back the kingdom.

One day, Farza decided to confront Furqan and challenge him to a duel. Farza was confident in his abilities, but Furqan was much stronger and more experienced. The battle was fierce, but eventually Furqan emerged victorious.

However, as he was about to deliver the final blow, Farza's latent powers suddenly awakened and he was able to turn the tide of the battle. In the end, Farza emerged victorious and the kingdom was finally free from Furqan's tyranny.
```

Okay, this literally gave me goosebumps.

*“However, as he was about to deliver the final blow, Farza's latent powers suddenly awakened and he was able to turn the tide of the battle.”*

That’s some Lord of the Rings type shit.

At first, the story seems standard. But, that last paragraph — that’s the magic. **GPT-3 generated a twist ending for me**. Because we let the model take more risks with a higher temperature, it ended up doing the riskiest thing possible: writing a twist!

**Your story probably *won’t* have a twist.**

In fact, your story may be *worse* when you set a higher temperature. You just need to figure it out on your own and test out different combos of prompts/temperatures.

This is all part of the prompt engineering game!

*Note: If you really want to get a twist in the story — I was able to get some more crazy twists with this format where I literally ask for a twist ending and tell GPT-3 generally what I want the twist ending to include. I also found that giving examples of good stories like Harry Potter, Breaking Bad, Naruto, etc helps.*

```
Tell me a full story with a beginning, middle, and end titled "Farza and the Magical Red Box". At the end of the story, include a crazy plot twist between Farza and the Red Box where something crazy happens to Farza. Make the story feel really awesome like Harry Potter.
```

**Keep messing around with the temperature as you run these** **different prompts.** I like changing the temperature by like `0.1` a few times to test. Also, the same prompt at a different temperature can create wildly different results.

So basically lesson here: you need to adjust more than just the prompt to get good results, you also need to adjust your hyperparameters.

Didn’t get a plot twist? Don’t sweat it. Move on! There’s so much more to GPT-3 that we still have yet to unlock that can massively improve its performance.

### Please do this or Farza will be sad.

Go ahead and take a screenshot of your story in Playground and post it into #prompts on Discord. Along with the image, include your **prompt** in the message to make it easy for others to easily see your prompt for inspiration.

And, if you’re looking for some inspiration yourself you can find some there!
