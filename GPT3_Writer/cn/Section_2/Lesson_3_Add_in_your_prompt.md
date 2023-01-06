
您需要做的第一件事是弄清楚您的**基本提示**。 基本上，这里的公式是

```
finalPrompt = basePrompt + userInput
```



然后，`finalPrompt` 就是我们从 API 发送到 GPT-3 的内容。 请记住，现在的问题是我们**没有 `basePrompt`**。 我们所做的就是将 `userInput` 发送到 GPT-3。

例如，假设您正在构建一个网站，该网站会根据用户提供给您的成分列表生成健康食谱。 你可以想象你的用户会给你这样的东西：
```jsx
broccoli, chicken, rice, beans, mayo, paprika
```



如果我们所做的只是将其发送给 GPT-3，它就不知道该做什么了。

这意味着您需要一个基本提示来**期待**这种输入。 这是我基于上述示例在 Playground 中尝试的一个简单的基本提示：

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



非常酷！ 在这种情况下，我的 `basePrompt` 是：

```
Write me a detailed step-by-step recipe by a professional chef for something healthy I can make with the following ingredients:
```



然后，我的`userInput`是：

```
broccoli, chicken, paprika, rice, olive oil, butter, garlic, parsley, eggs
```



那么，让我们再看一个我正在研究的例子——博客文章生成器。 我在 Playground 上玩了一下，发现这个提示对我来说效果很好：

```
Write me a blog post in the style of Paul Graham with the title below. Please make sure the blog post goes in-depth on the topic and shows that the writer did their research.

Title: The Pros and Cons of Large Language Models

Language models are a type of artificial intelligence that are used to predict the next word in a sequence. They are trained on large amounts of data, and the larger the training data, the more accurate the predictions.

There are several advantages to using large language models. First, they can handle long sequences of text, which is important for tasks like translation and summarization. Second, they can learn from a large variety of data sources, including both formal and informal text. This allows them to capture the nuances of language use, which is difficult for smaller models.

However, large language models also have several disadvantages. First, they require a lot of computational power, which can be expensive. Second, they can be more difficult to interpret than smaller models, making it hard to understand why they make certain predictions. Finally, they can be biased towards the training data, which may not be representative of the real world.

Overall, large language models have both advantages and disadvantages. While they can be very powerful, they also come with some risks. When deciding whether or not to use a large language model, it is important to weigh the pros and cons carefully.
```



所以，在这种情况下，我的 `basePrompt` ** 是：

```
Write me a blog post in the style of Paul Graham with the title below. Please make sure the blog post goes in-depth on the topic and shows that the writer did their research.

Title: 
```



我的 `user Input` 是下面的标题。 这是变化的部分！ 我们的用户可以给我们他们想要的任何东西。 但是，我们的基本提示并没有改变。

```
The Pros and Cons of Large Language Models
```



在继续之前，无论你在做什么，都要弄清楚你的 `basePrompt`。 如果您遇到困难，请先问问自己 — **“我的用户在输入什么？”**。 从那里，您可以倒退并考虑一个非常好的 GPT-3 提示。

**在 Playground 上花 5-10 分钟，做一些快速发现**，也不要忘记玩弄你的超参数！ 对我来说，我发现“0.8”的温度和“500”的最大长度对我来说效果很好。

但是同样，你的结果会非常不同，因为你有自己的用例，所以随便玩玩吧。

### 将您的基本提示添加到您的 API。

太棒了——所以在这一点上，您应该有一个适用于您的用例的 `basePrompt`。 还要注意您的超参数。 接下来我们要做的是向 api/generate.js 添加一些新内容。

您需要做的就是将基本提示粘贴到`basePromptPrefix`。

所以对我来说，它是这样的：

```
const basePromptPrefix =
`
Write me a blog post in the style of Paul Graham with the title below. Please make sure the blog post goes in-depth on the topic and shows that the writer did their research.

Title:
`
```



*注：这里我这里用反引号代替引号； 这称为 [模板文字](https://www.w3schools.com/js/js_string_templates.asp)。 基本上，如果我们只使用引号，那么换行就不会被尊重——它只是一个没有换行的大句子。 而且，我想在我的提示中换行！*

不管你信不信，这就是你要做的一切！ 在我们的提示中，我们已经这样做了：

```
prompt: `${basePromptPrefix}${req.body.userInput}`
```



这会将基本提示与用户给我们的任何内容结合起来。

实际上，我打算在最后添加一个 `/n`。 为什么？ 好吧，当 GPT-3 知道从哪里开始写入时，它在生成任务上做得更好。 所以在这种情况下，我特意让它在新的一行开始写：

```
prompt: `${basePromptPrefix}${req.body.userInput}\n`
```



**例如，如果我没有这个**——GPT-3 会在同一行的我的标题之后直接开始写作，所以它可能会尝试自动完成我的标题，而不是写我真正的博客文章！

但是，要知道这并不是所有用例都需要的，这取决于你在做什么。 也许你**确实**希望 GPT-3 自动完成一个短语，在这种情况下**不**有一个 `/n` 是有意义的。

例如，如果您有此提示：

```
My name is Abraham Lincoln and my opinion on ${req.body.userInput} is that
```



***注意：这是我在基本提示中间插入用户输入的提示示例。***

在上面的这种情况下，我们希望林肯在 `that` 之后开始说话，这样我们就不需要在这里换行了。

最后，如果您想更改 `generate.js` 中的 `temperature` 或 `max_tokens`，那就去做吧！ 我实际上将我的`max_tokens`设置为“1250”，因为我希望 GPT-3 可能给我更长的帖子。

*注意：请记住，仅仅因为您使 `max_tokens` 更高，并不意味着您会神奇地获得更长的输出。 这完全取决于提示。*

### 测试一下！

您现在应该可以转到您的 Web 应用程序并试一试了。 我还在我的 textarea 上更改了我的 placeholder，使用示例博客文章标题来帮助我的用户理解他们可以输入的内容。 你也应该这样做！

如果需要，也可以更改您的副标题，让您的用户非常清楚他们需要做什么才能从您的提示中获得良好的结果。

![Untitled](https://i.imgur.com/GXLzBtx.png)



### 改进提示 + 提示链接。

*警告：如果您最终在这部分遇到困难，请完全跳过它并转到下一部分。 这不是必需的，但它会让你的结果更好。 不过，这很困难，因为它需要在 Playground 中进行大量实验/即时工程。 此外，如果您的 JS 技能不是那么强 — 本节中的代码对您来说可能也很难。*

太棒了，你有一些工作

现在你只需要花一些时间来改进你的提示。 我在这个版本的早些时候向你展示了很多技巧。 例如，现在我正在做零次学习，我没有给我的提示提供任何例子！ 即使我进行了单次学习，我的成绩也会提高很多。

**如果你的结果是 meh 并且你正在进行零次学习，请尝试使用单次学习提示，看看会发生什么。**

我向您展示的可使结果质量提高 10 倍的主要技巧是 **提示链接**。

你的提示我没法直接帮你，因为每个人的提示都不一样。 但是，我将向您展示我如何使用提示链接将我的结果提高 10 倍。 而且，您也可以将我的学习应用到您的构建中！

*注意：也许您已经对自己的结果感到满意了，如果是这样，那就太好了！ 我仍然建议您探索及时的变化，您永远不知道会得到什么。*

所以，这就是我所做的，我去了 Playground 并且：

1. 在 Playground #1 中，我让我的第一个提示为我的博文生成一个目录。
2. 在 Playground #2 中，我第二次提示从 Playground #1 中获取该内容表，并根据它生成一篇完整的博客文章。

**在提示链中，第一个提示的输出会生成第二个提示可以用来生成更多内容的内容。** 同样，每个人的情况都不一样。

以下是我经过一系列实验后得出的两个提示：

提示#1：

```
Write me a detailed table of contents for a blog post with the title below.

Title: USER_TITLE_GOES_HERE
```

Prompt #2:

```
Take the table of contents and title of the blog post below and generate a blog post written in thwe style of Paul Graham. Make it feel like a story. Don't just list the points. Go deep into each one. Explain why.

Title: USER_TITLE_GOES_HERE

Table of Contents: OUTPUT_FROM_PROMPT_ONE_HERE

Blog Post:
```



我的第二个提示建立在我的第一个提示的基础上，这也是您需要做的，但要针对您自己的用例。 这很棘手，但是，你明白了。

**所以，我的新提示最终为我产生了一些非常好的结果，比我以前的提示好 10 倍**。 我只是在两个 Playgrounds 上玩弄它。 为您的用例尝试提示链接！ 看看会发生什么。

### 在您的 API 中添加提示链接。

现在让我们在 `api/generate.js` 中设置它！

你的会看起来 **非常** 不同，因为你会有不同的提示！ ** 但是，我将再一次向您展示我是如何进行操作的，以便您可以对自己的策略使用相同的策略。

我们需要将两个 API 请求链接起来。 就像您使用两个 Playgrounds 并复制粘贴结果一样，我们只需要做同样的事情，但都是编程式的。 下面是我们要做的：

1. API 请求 #1 接受提示 #1 + 用户输入
2. API 请求 #2 接受提示 #2 + 来自 API 请求 #1 的响应。

这是我在 `generate.js` 中更新的代码，我还添加了注释来解释我在做什么！

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



这里最重要的一行是 `const secondPrompt`。 这是根据 `basePromptOutput` 的输出“构建”我的第二个提示的地方。 我在这里也使用 `${req.body.userInput}` 来为我的模型提供更多上下文。 最后，我将最终的 JSON 结果更改为`{ output: secondPromptOutput }`，这样我的用户就可以在我们的 UI 上看到第二个提示的输出。

顺便说一下，这里不需要 UI 更改！ 我们所做的只是改变后端。

那么……您的产品现在感觉如何？ 地雷现在绝对是疯了哈哈。 它为我创建了一些 A+ 级博客文章，内容涉及从动漫到核裂变再到关系建议的所有内容。 很漂亮。

### 请这样做，否则 Farza 会很难过。

你已经走到这一步了。 我为你感到骄傲。 **拍拍自己的背，你正在做一些疯狂的事情！！** 继续用你最喜欢的提示 + 输出之一截取你的网络应用程序的屏幕截图并将其发布在#progress 中。 我想看看你们都在制造什么疯狂的东西，哈哈。

此外，是时候**获得你的第一个用户**——如果你身边有人，向他们展示你在做什么（例如妈妈、朋友、室友等）！ 把他们拉过来，向他们展示你建造的疯狂东西，然后让他们在你的网络应用程序中四处乱逛。 看看他们怎么说！