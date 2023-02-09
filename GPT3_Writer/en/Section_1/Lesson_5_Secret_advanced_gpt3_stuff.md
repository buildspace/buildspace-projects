
I want to go over a few more prompt types, and then we’ll hop into some code.

### Prompt chaining — a highly underrated strategy.

One thing that you can do that’s pretty insane with GPT-3 is prompt chaining — this is where you use the output of one prompt as input to another prompt.

Lemme show you — **let’s say I want to write a tweet thread about startups.**

I really like Paul Graham’s writing style, so I asked GPT-3 to write me an essay about this thing I’ve been thinking about where startups aren’t all about “solving a problem”. When we started buildspace, we weren’t trying to solve a problem we were just messing around. I think when all we do is focus on problems, the startup loses its soul. To me, I believe more in understanding the user.

What’s something you’d want to see a startup essay on? Ask Paul Graham! Come up with your own prompt.

Here’s my prompt — I left the sentence open at the end because I want GPT-3 to complete it.

```
Help me write an essay in the style of Paul Graham, the co-founder of Y-Combinator.

I don't think it's always about "solving a problem", sometimes it's worth thinking about
```

Then, GPT-3 filled it in.

```
Help me write an essay in the style of Paul Graham, the co-founder of Y-Combinator.

I don't think it's always about "solving a problem", sometimes it's worth thinking about the problem in a different way.

In the early days of a startup, it's often more important to focus on building something people want, than on solving a particular problem. It's easier to change your approach later, once you have a better understanding of what people want and what the problem is.

This is why I often encourage founders to start by building something small and simple, rather than trying to solve a big problem from the start. It's important to get feedback from users as early as possible, so you can validate your assumptions and course correct if necessary.

Of course, there are exceptions to this rule and some problems are so big and complex that it makes sense to focus on them from the start. But in general, I think it's more important to focus on building something people want, than on solving a particular problem.
```

Pretty good actually!! But, I want to turn these into a thread of tweets.

Let me show you something wild. Open a new tab with an empty Playground. So, you should have two tabs now. One with the essay (Playground #1), and one empty (Playground #2).

In Playground #2, go ahead and write this prompt:

```
Take the essay below and turn it into a tweet thread; number the tweets and show breaks in between.
```

Now, underneath there — copy paste the output from Playground #1. So for me it looks like this:

```
Take the essay below and turn it into a tweet thread.

I don't think it's always about "solving a problem", sometimes it's worth thinking about the problem in a different way. In the early days of a startup, it's often more important to focus on building something people want, than on solving a particular problem. It's easier to change your approach later, once you have a better understanding of what people want and what the problem is. This is why I often encourage founders to start by building something small and simple, rather than trying to solve a big problem from the start. It's important to get feedback from users as early as possible, so you can validate your assumptions and course correct if necessary. Of course, there are exceptions to this rule and some problems are so big and complex that it makes sense to focus on them from the start. But in general, I think it's more important to focus on building something people want, than on solving a particular problem.
```

When I run Playground #2, here’s what’s generated:

```
1/ It's not always about "solving a problem". Sometimes it's more important to focus on building something people want. 

2/ This is why I often encourage founders to start by building something small and simple, rather than trying to solve a big problem from the start. 

3/ It's important to get feedback from users as early as possible, so you can validate your assumptions and course correct if necessary. 

4/ Of course, there are exceptions to this rule and some problems are so big and complex that it makes sense to focus on them from the start. 

5/ But in general, I think it's more important to focus on building something people want, than on solving a particular problem.
```

Insane, right? You now have a Twitter thread in 2m about a thought you had — and it sounds super legit as well. It’s really concise and clear, which is exactly how Paul Graham writes.

Now anyone can be a thought leader lol.

**This is called prompt chaining.** We took the output from the prompt in Playground #1 and plugged it into another specialized prompt in Playground #2. You can keep doing this, and it’ll get even better at a specialized task.

Why does this work so well?

Well again — GPT-3 does better when 1) you give it more examples 2) you are highly specific in terms of what you ask from it. Prompt chaining blends these two!

Here are other examples of prompts you can chain:

- *generate a table of contents for a blog → write a sentence for each section → for each sentence, write two paragraphs → done*
- **generate a sad love story about a boy and a girl → generate a rap chorus → generate a chorus that rhymes and has lyrics in the style of drake → generate the intro and outro verse based on the chorus → done.**
- **generate headline landing page copy for a product → generate more detailed copy for the product → generate ad copy targeted to 26-year-olds in Pakistan → done**

Prompt chaining is **highly** underrated and not talked about much. It really lets you get really great performance for specific tasks you have in mind. Shoutout to my buddy [Sharif](https://twitter.com/sharifshameem) for showing me it!

### Build a startup with GPT-3 end-to-end: from idea to VC pitch. In 5-minutes.

Let’s put those prompt skills to the test and build a startup with GPT-3 — from idea to landing to a VC pitch. The hardest part about starting a startup is usually coming up with good ideas, so let’s ask GPT-3!

I’m going to ask for good ideas around GPT-3 and reading because I feel like GPT-3 is super cool, and reading is something everyone wants to do! I also told it specifically to generate ideas for things a kid could use. I did this because I used to run a company called [ZipSchool](https://mobile.twitter.com/FarzaTV/status/1488965852519022592) which made science content for kids.

```
Give me some cool startup ideas around ML and reading for kids:
```

Be sure to ask it to generate ideas around stuff you’re interested in!

Again, be as specific as you can. What tech do you want your startup to use? Whats the audience you’re interested in? What’s something you really want the product to do?

My output is actually really cool.

```
Give me some cool startup ideas around GPT-3 and reading for kids:

1. A GPT-3-powered reading app that can customize reading material for each individual child based on their reading level, interests, and needs.

2. A GPT-3-powered app that can generate personalized reading material for kids based on their interests and areas of need.

3. A GPT-3-powered app that can read aloud to kids, highlighting words as it goes so they can follow along.

4. A GPT-3-powered app that can answer questions kids have about the material they're reading, helping them to understand and engage with the text.
```

I love that first idea — it’s beautiful.

Imagine if kids could learn to read with custom stories generated just for them.

The stories would be perfect for them. GPT-3 could even generate stories they really like (ex. detective stories, adventure stories, etc). The stories could even include the names of the characters they come up with. They could be in their own stories. Plus, we could even tell GPT-3 to use certain types of vocabulary to make sure the reading level is just right.

**Before moving on, be sure to generate an idea you kinda like in an industry you think is interesting — VR, crypto, AR, gaming, FinTech, consumer, etc. You’ll need to play around a lot with the industry, audience, etc. As always, don’t copy me! Get good at prompts!**

### Write landing copy for your fictional startup.

Now check this out, I’m going to take that output and chain it to a new prompt. I want to go deeper here and write some landing page copy. **Landing page copy is always super difficult for me** because it’s hard to be short, sweet, and descriptive.

I’ve always loved Apple’s marketing/copy! Let’s generate it like that:

Open a Playground #2. Here’s the initial prompt:

```
Write a list of short landing page headlines in the style of Apple for a startup that builds the following:

<insert the generated idea from above here>
```

So for me, my full chained prompt looks like this, all I did was take the idea that GPT-3 generated for me. Again, you should change your prompt — maybe you like other brands like Disney or Nike better. Maybe you like headlines that are more inspirational! Again, you just need to make sure you tell GPT-3 what you want.

```
Write a list of short landing page headlines in the style of Apple for a startup that builds the following:

A GPT-3-powered reading app that can customize reading material for each individual child based on their reading level, interests, and needs.
```

Here’s what was generated for me:

```
1. The ultimate reading app for kids – powered by GPT-3!
2. Customize reading material for each child – based on their reading level, interests, and needs.
3. The perfect reading app for kids of all ages and abilities!
4. Get your kids reading with the help of GPT-3!
5. The best reading app for kids – GPT-3 powered!
```

Pretty good! But we can do better. In the prompt, we should include who this product is for! After all, a landing page is usually super optimized toward a specific user type.

I’m going to specify parents for mine because I imagine I’m going to be marketing mainly toward parents who give the app to their little kids. I also don’t want confusing words like “GPT-3” in it since most people don’t even know what that is.

I won’t cover this example much more, but be sure to try it out yourself.

Here’s my prompt if you wanna check it out:

```
Write a list of short landing page headlines in the style of Apple for a startup. Write the copy to appeal to parents with kids in kindergarten. Don't include confusing terms like GPT-3 in it. The startup builds:

<insert the generated idea from above here>
```

### Write a pitch!

Amazing! We now have an idea + a landing page headline — now we just need to create a business plan and raise some money from a few VCs! But damn, writing pitches is tough. Time to ask GPT-3 to make us one.

Here’s the prompt I created, fill it in with your startup idea that GPT-3 generated from above. I also include the basic pieces of a pitch that Y-Combinator says to include [here](https://www.ycombinator.com/library/2u-how-to-build-your-seed-round-pitch-deck).

```
Write me a pitch to a VC for a startup that includes the problem it's solving, the solution, market size, and the business plan. This startup builds a:
```

Here’s my full prompt with the idea below — feel free to edit the idea that GPT-3 spit out if you need to. If you feel like you want to rephrase the idea or if you have another idea, just change up the prompt as needed:

```
Write me a pitch to a VC for a startup that includes the problem it's solving, the solution, market size, and the business plan. This startup builds a: GPT-3-powered reading app that can customize reading material for each individual child based on their reading level, interests, and needs.
```

And once I run this the output is pretty insane:

```
Hi, 

Our startup is developing a GPT-3-powered reading app that can customize reading material for each individual child based on their reading level, interests, and needs. By using natural language processing and machine learning, our app is able to provide a personalized reading experience for every child. 

The reading app market is growing rapidly and is expected to be worth $2.4 billion by 2025. Our app will be available for a monthly subscription of $9.99. 

We have a strong team of experienced developers and educators who are committed to making our app the best it can be. We have a clear business plan and are confident in our ability to execute it. 

We would love to have the opportunity to pitch our startup to you and answer any questions you may have. Thank you for your time!
```

**GPT-3 literally wrote me a pitch better than 99% of founders lol.**

It includes all the good stuff — the market size, the biz plan, the team, etc. It even includes the fact that the app would cost $9.99 a month lol. It could have done a better job at explaining the problem though. But, we can just change our prompt and tell GPT-3 to make sure it focuses on that more.

Again, your generated pitch might suck right now. Take the time to play with the prompt.

Just be really specific with GPT-3 — *“include a description of the monthly subscription”*, *“include a description of the market size”*, *“include how we plan to spend the money”,* etc. You can even do things like *“Write me an email pitch to a VC for a startup in the style of Paul Graham”* or any other founder you think is legit!

Whenever you read your output and think, “Man! I wish GPT-3 gave me more of X thing” — just literally ask GPT-3 for X thing!

### Let’s build something for real.

Hope this was a fun little adventure for you — my hope is you’re bursting with ideas around cool shit you can make. A website to help people write landing page copy, an app to help people write better tweets, a tool to help script writers create more interesting worlds, etc.

The use-cases with GPT-3 are literally endless and I only covered a few. Hell, this thing can even generate RegEx for you — [check out this thing built by one of our alumni](https://twitter.com/gd3kr/status/1545370626273120256) that went **viral**.

I haven’t even shown you stuff it can do with code! [This](https://www.buildgpt3.com/) is a really good website I recommend you scroll through for more examples of prompts and use cases + demos.

And hey! I even gave you a free startup idea with this reading app for kids that generates stories with GPT-3 lol. Even gave you a free cold email to send to VCs! Hope one of y’all can raise a few million off of it lol.

Update: lol one of our alumni is [working on it now.](https://onceuponabot.com/) Can use it for free rn!

### Please do this or Farza will be sad.

Got ideas for something you’d wanna build? I know this build is titled “build your A.I writing assistant” but feel free to build whatever the fk you want lol. Random crazy ideas:

- An AI fitness coach where people can choose who they want to be their coach, imagine Goku giving your workout advice and workout plans.
- A writing assistant for Notion that helps people write clear product docs — it would take the spec as input and output a version of the spec that’s more clear and more actionable.
- A tool that generates really good titles for YouTube videos and automatically A/B tests them to see which one gets more views.
- A recipe generator that takes the list of ingredients in your fridge and gives you a recipe for something you can make with it.

The ideas are endless.

Before moving on, come up with your own wild idea you think would be cool. Once you got one, post it in #ideas. Feel free to check the channel out for ideas other people have as well for inspiration! 

*P.S: Most ideas can be tested pretty quickly in Playground. Whatever you have an idea — write a quick prompt for it in Playground and see how it goes. Iterate!*
