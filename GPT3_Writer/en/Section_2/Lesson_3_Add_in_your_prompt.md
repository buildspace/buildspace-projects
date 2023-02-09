

The first thing you need to do is figure out your **base prompt**. Basically, the formulas here is

```
finalPrompt = basePrompt + userInput
```

Then, that `finalPrompt` is what we send to GPT-3 from our API. Remember, the problem right now is that we **don’t have a `basePrompt`**. All we’re doing is sending `userInput` to GPT-3.

For example, let’s say you’re building a website that generates healthy recipes based on a list of ingredients your user gives you. You can imagine your user will give you something like this:

```jsx
broccoli, chicken, rice, beans, mayo, paprika
```

If all we do is send that to GPT-3, it won’t have any idea what to do.

That means you’d need a base prompt that will **expect** this sorta input. Here’s a simple base prompt I tried out in Playground based on the above example:

```
Write me a detailed step-by-step recipe by a professional chef for something healthy I can make with the following ingredients:

broccoli, chicken, paprika, rice, olive oil, butter, garlic, parsley, eggs

1. Heat up a large skillet.
2. While it's heating, cut broccoli into small florets.
3. Season chicken breasts with paprika, salt, and pepper.
4. In skillet, heat olive oil over medium-high heat.
5. Add chicken to the skillet and cook until browned and cooked through, about 4 minutes per side.
6. Remove chicken from skillet and set aside.
7. In the skillet, melt butter over medium heat.
8. Add garlic and cook until fragrant, about 1 minute.
9. Add broccoli and cook until tender, about 5 minutes.
10. Add cooked chicken back to the skillet.
11. Stir in cooked rice and parsley.
12. Make 4 wells in the rice mixture and crack an egg into each well.
13. Cover the skillet and cook until the eggs are cooked to your liking, about 5 minutes.
14. Serve immediately.
```

Pretty cool! In this case, my `basePrompt` is:

```
Write me a detailed step-by-step recipe by a professional chef for something healthy I can make with the following ingredients:
```

And, my `userInput` is:

```
broccoli, chicken, paprika, rice, olive oil, butter, garlic, parsley, eggs
```

So, let’s look at one more example which is what I’m working on — a blog post generator. I played around in Playground and found that this prompt did pretty well for me:

```
Write me a blog post in the style of Paul Graham with the title below. Please make sure the blog post goes in-depth on the topic and shows that the writer did their research.

Title: The Pros and Cons of Large Language Models

Language models are a type of artificial intelligence that are used to predict the next word in a sequence. They are trained on large amounts of data, and the larger the training data, the more accurate the predictions.

There are several advantages to using large language models. First, they can handle long sequences of text, which is important for tasks like translation and summarization. Second, they can learn from a large variety of data sources, including both formal and informal text. This allows them to capture the nuances of language use, which is difficult for smaller models.

However, large language models also have several disadvantages. First, they require a lot of computational power, which can be expensive. Second, they can be more difficult to interpret than smaller models, making it hard to understand why they make certain predictions. Finally, they can be biased towards the training data, which may not be representative of the real world.

Overall, large language models have both advantages and disadvantages. While they can be very powerful, they also come with some risks. When deciding whether or not to use a large language model, it is important to weigh the pros and cons carefully.
```

So, in this case my `basePrompt` **was:

```
Write me a blog post in the style of Paul Graham with the title below. Please make sure the blog post goes in-depth on the topic and shows that the writer did their research.

Title: 
```

And my `userInput` was the below title. This is the part that changes! Our users can give us whatever they want. But, our base prompt doesn’t change. 

```
The Pros and Cons of Large Language Models
```

Before moving ahead, figure out your `basePrompt` for whatever you’re working on. If you’re struggling, ask yourself first — **“What is my user inputting?”**. From there, you can work backward and think about a really good prompt for GPT-3.

**Spend like 5-10 minutes in Playground and do some prompt discovery**, also don’t forget to play around with your hyperparamaters! For me, I found that a temperature of `0.8` and a maximum length of `500` worked well for me.

But again, your results will be very different because you have your own usecase, so just play around with it.

### Add your base prompt to your API.

Cool — so at this point, you should have a `basePrompt` for your use-case. Take note of your hyperparameters as well. Next thing we gotta do is add some new stuff to to `api/generate.js`.

All you’ll need to do is paste in your base prompt to `basePromptPrefix`.

So for me, here’s how it looks:

```
const basePromptPrefix =
`
Write me a blog post in the style of Paul Graham with the title below. Please make sure the blog post goes in-depth on the topic and shows that the writer did their research.

Title:
`
```

*Note: here I use the backticks here instead of quotation marks; this is called a [template literal](https://www.w3schools.com/js/js_string_templates.asp). Basically, if we were to use just quotation marks then new lines wouldn’t be respected — it’d just be one big sentence with no new lines. And, I want new lines in my prompt!*

And believe it or not, that’s all you gotta do! in our prompt we already do:

```
prompt: `${basePromptPrefix}${req.body.userInput}`
```

This will combine the base prompt with whatever the user gives us.

I’m actually going to do add a `\n` to this at the end. Why? Well, GPT-3 does better on generation tasks when it knows where to start writing. So in this case, I specifically make it start writing on a new line:

```
prompt: `${basePromptPrefix}${req.body.userInput}\n`
```

**For example, if I didn’t have this** — GPT-3 would start writing directly after my title on the same line, so it might try and autocomplete my title instead of writing my actual blog post!

But, just know this isn’t needed for all usecases, depends on what you’re doing. Maybe you **do** want GPT-3 to autocomplete a phrase, in which case it makes sense to **not** have a `\n`.

For example, if you have this prompt:

```
My name is Abraham Lincoln and my opinion on ${req.body.userInput} is that
```

***Note: this is an example of a prompt where I inject user input in the middle of the base prompt.***

In this case above, we want Lincoln to start talking after `that` so we wouldn’t need a new line here.

Lastly, if you wanna change your `temperature` or `max_tokens` in `generate.js` go for it! I actually set my `max_tokens` to `1250` since I want GPT-3 to potentially give me longer posts.

*Note: remember, just because you make `max_tokens` higher, it doesn’t mean you’d magically get longer outputs. It all depends on the prompt.*

### Test it!

You should be able to head over to your web app now and give it a spin. I also changed my `placeholder` on my `textarea` with an example blog post title to help my user understand what they could type. You should do the same!

Changeup your subtitle if needed as well, make it really clear to your user what they need to do to get good results out of your prompt.

![Untitled](https://i.imgur.com/GXLzBtx.png)

### Improving your prompt + prompt chaining.

*Warning: if you end up struggling with this part, feel free to skip it completely and go to the next section. It’s not required, but it will make your results wayyyyy better. Though, it’s difficult because it requires a ton of experimentation/prompt engineering in Playground. Also, if your JS skills aren’t that strong — the code in this section may be tough for you as well.*

Cool, you got something working!

Now you just need to spend some time improving your prompt. I showed you a ton of tricks earlier in this build. For example, right now I’m doing zero-shot learning, where I’m not giving my prompt any examples! Even if I did single-shot learning, my results would improve a ton.

**If your results are meh and you’re doing zero-shot learning, try out a prompt with single-shot learning and see what happens.**

The main trick I showed you that can 10X the quality of your results is **prompt chaining**.

I can’t help you directly with your prompt, because everyone’s prompt is so different. But, I’ll show you how I used prompt chaining to 10X my results. And, you can apply my learnings to your build as well!

*Note: maybe you’re already happy with your results already, if so, cool! I still recommend you explore prompt chaining, you never know what you may get.*

So, here’s what I did, I went to Playground and:

1. In Playground #1, I made my first prompt generate a table of contents for my blog post.
2. In Playground #2, I made a second prompt to take that table of content from Playground #1 and generate a full blog post based off of it.

**In prompt chaining, the output of your first prompt generates content your second prompt can use to generate even more content.** Again, it’ll be different for each of you.

Here are my two prompts I came up with after a bunch of experimentation:

Prompt #1:

```
Write me a detailed table of contents for a blog post with the title below.

Title: USER_TITLE_GOES_HERE
```

Prompt #2:

```
Take the table of contents and title of the blog post below and generate a blog post written in the style of Paul Graham. Make it feel like a story. Don't just list the points. Go deep into each one. Explain why.

Title: USER_TITLE_GOES_HERE

Table of Contents: OUTPUT_FROM_PROMPT_ONE_HERE

Blog Post:
```

My second prompt builds on my first prompt, and this is what you need to do as well but for your own use-case.  It’s tricky, but, you got this.

**So, my new prompts ended up generating some insanely good results for me that were 10X better than my previous prompt**. I just messed around with it in two Playgrounds. Try out prompt chaining on your end for your use case! See what happens.

### Add prompt chaining in your API.

Now let’s set it up in `api/generate.js`!

Yours will look **very** different because you’ll have different prompts! **But, once again, I’m going to show you how I did mine so you can use the same strategy for yours.

We need to chain two API requests. Just like you’re using two Playgrounds and copy pasting results, we just need to do the same thing but all programatically. Here’s what we’re going to do:

1. API Request #1 takes Prompt #1 + user input
2. API Request #2 takes Prompt #2 + response from API Request #1.

Here’s my updated code in`generate.js`, I added comments as well to explain what I’m doing!

```jsx
const basePromptPrefix =
`
Write me a detailed table of contents for a blog post with the title below.

Title:
`

const generateAction = async (req, res) => {
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.8,
    max_tokens: 250,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  // I build Prompt #2.
  const secondPrompt = 
  `
  Take the table of contents and title of the blog post below and generate a blog post written in thwe style of Paul Graham. Make it feel like a story. Don't just list the points. Go deep into each one. Explain why.

  Title: ${req.body.userInput}

  Table of Contents: ${basePromptOutput.text}

  Blog Post:
  `
  
  // I call the OpenAI API a second time with Prompt #2
  const secondPromptCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${secondPrompt}`,
    // I set a higher temperature for this one. Up to you!
    temperature: 0.85,
		// I also increase max_tokens.
    max_tokens: 1250,
  });
  
  // Get the output
  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  // Send over the Prompt #2's output to our UI instead of Prompt #1's.
  res.status(200).json({ output: secondPromptOutput });
};

export default generateAction;
```

The most important line here is `const secondPrompt`. This is where I “build” my second prompt based on the output of `basePromptOutput`. I also use `${req.body.userInput}` here as well to give my model even more context. At the end, I change final JSON result to `{ output: secondPromptOutput }` so my user see’s the output of the second prompt on our UI.

No UI changes required here btw! All we’re doing is changing the backend.

So…how’s your product feeling now? Mines is absolutely insane now lol. It’s creating some A+ tier blog posts for me about everything from anime to nuclear fission to relationship advice. Beautiful.

### Please do this or Farza will be sad.

You’ve gotten so far. I’m proud af of you. **Give yourself a pat on the back, you’re doing some insane stuff!!** Go ahead and take a screenshot of your web app with one of your favorite prompts + outputs and post it in #progress. I want to see all the crazy shit y’all are generating lol.

Also, it’s time to **get your first user** — if you have someone near you, show them what you’re doing (ex. mom, friend, roomate, etc)! Pull them over, show them the crazy thing you built, and have them mess around in your web app. See what they say!
