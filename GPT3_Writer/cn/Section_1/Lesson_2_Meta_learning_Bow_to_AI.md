
创建好的提示并不容易！

就像我之前说的，创建提示是一种技能，你不会在 30 分钟内成为提示大神。我的目标只是给你足够的技能，这样你就可以在这个项目的后期继续构建一些有趣的东西。

让我告诉你另一个对你以后非常有用的技能——元-学习。

### 元-学习——使用 GPT-3 生成的内容作为提示。
我们必须做**很多工作**才能得到一个好故事，对吧？我们必须给它一个情节，一个恶棍，所有这些东西。我们不得不不断改变温度。

看起来工作量很大！

这是因为到目前为止，我们一直在做的事情被称为“**零样本学习**”——这是你不给 GPT-3 任何已经很好的例子的地方。您只希望它生成的第一件事是好的。有时，GPT-3 在场景中表现良好。 *但要知道零样本学习是 GPT-3 表现最差的地方。*

但是让 GPT-3 真正优秀的是你给它**例子**的地方。

但是，检查一下。这就是事情变得奇怪的地方。

我可以使用 GPT-3 生成的内容作为**示例**，这样它生成的下一个东西会更好。我要删除所有的 `Setting` 和 `Plot` 东西。我们不需要它。 **现在，GPT-3 有一个我们喜欢的故事的明确例子，所以我们不需要所有这些。**

**注意：在这一点上，确保你有一个你认为不错的生成故事！最坏的情况——复制我的故事。**

现在，我的提示看起来像这样，我在底部创建了一个关于“Elon and the Space Empire”的新提示——但再次注意我不需要提供设置、情节等，因为 GPT-3 已经有了一个例子。

这称为“**单次学习**”。因为 GPT-3 有一个它正在学习的例子！
```
Prompt: Tell me a full story with a beginning, middle, and end titled "Farza and the Lost Kingdom" set in the 1500s that feels like an anime.

Story: Farza was just a normal boy, living in a poor, broken kingdom that had been destroyed by Furqan. But little did he know that he had secret powers that could help him defeat the villain and take back the kingdom.

One day, Farza decided to confront Furqan and challenge him to a duel. Farza was confident in his abilities, but Furqan was much stronger and more experienced. The battle was fierce, but eventually Furqan emerged victorious.

However, as he was about to deliver the final blow, Farza's latent powers suddenly awakened and he was able to turn the tide of the battle. In the end, Farza emerged victorious and the kingdom was finally free from Furqan's tyranny.

Prompt: Tell me a full story with a beginning, middle, and end titled "Elon and the Space Empire" set in a dystopian future that feels like an anime where Elon Musk has the power to teleport.

Story:
```



我明确地使用了 `Prompt:` 和 `Story:` 只是为了让 GPT-3 知道上一个故事在哪里结束，下一个故事应该从哪里开始。就像我说的，我还在底部想出了一个新的故事情节，现在这是一部关于 Elon 的动画，他可以在其中传送以拯救银河系。这次我还要求它提供更多`童话式`故事与动画。

*注意：也请尝试其他类型：恐怖、喜剧、科幻等。另外，请不要复制我的 Elon 故事前提！想出你自己的。让您的故事与第一个故事大不相同*。

最疯狂的是当我运行它时，GPT-3 将**所有这些文本作为输入**并使用我们生成的之前的故事**作为它自己的例子。**

在运行之前，将右侧的`Maximum length`更改为 1000。我们稍后会详细讨论这个，但基本上，这是输入 + 生成输出的长度限制。我们会把它写成 1000——但这不会 *必然* 导致更长的故事。不过，它只是为样板房提供了这样做的空间。

*注：保持这个数字小。 OpenAI 根据你产生的量收费。 [此处](https://beta.openai.com/account/usage) 跟踪您剩余的信用额度。*

这是我运行提示后生成的内容：
```
Elon was just an ordinary boy living in a dystopian future where the space empire ruled with an iron fist. But Elon had a secret power - he could teleport.

One day, Elon decided to use his power to help the oppressed people of the space empire. He began by teleporting into the emperor's palace and stealing his prized space sword. Then, he teleported to different parts of the empire, freeing people from prison and helping them escape to safety.

Elon's acts of defiance quickly gained the attention of the space empire, and they began to hunt him down. However, no matter how hard they tried, they could never catch him.

Eventually, Elon's actions inspired others to start rising up against the space empire. With Elon leading the charge, they were finally able to overthrow the tyrannical regime and create a new, better society.
```



绝对他妈的疯了。想象埃隆传送到皇帝的宫殿偷他的“珍贵的太空剑”我要死了哈哈。

你看到这里的魔法了吗？

一切都在提示中。这需要一段时间，但一旦你到达那里，它就会疯狂。 **如果你还在为你的提示而苦苦挣扎**——这是意料之中的。继续搞乱温度，继续玩输入。如果您需要及时的帮助，请随时联系支持频道。

我每次都需要 6-12 次更改才能得到我想要的。例如，GPT-3 生成垃圾的第 2 个故事？好吧——然后也许对第二个故事的描述进行更改——提供更多的背景和细节。 GPT-3 的好坏取决于您的努力。

**如果你还没有想出一个你满意的可靠故事——那很好**。继续前进我的朋友。没有必要沉迷于特定的提示！

### 魔法：使用 GPT-3 作为真正的写作助手。

让我给你看一些超级恶心的东西。 GPT-3 真的很擅长完成你的想法。

因此，我们实际上可以通过让 GPT-3 完成我们的句子或**开始新的情况**来继续构建这个故事。

一探究竟。我只是要挑起一些狗屎。我就像俱乐部里那个想打架的乱七八糟的醉鬼。

我将**删除 Playground 中的所有内容**，只使用上面生成的我的 Elon 故事——*请确保你使用自己生成的故事，不要使用我的 Elon 故事！我一直在强调这一点，但我真的不想让你使用我的故事和前提。用你自己的*！

我在最后添加了一个新的场景，Elon 最终成为了坏人。我补充说，***“但是后来！一个转折！伊隆实际上是坏人。经过十年的和平，情况发生了变化。事实证明。***

继续为您的故事做同样的事情。请注意我没有完成我要让 GPT-3 为我做这句话的句子。

```
Elon was just an ordinary boy living in a dystopian future where the space empire ruled with an iron fist. But Elon had a secret power - he could teleport.

One day, Elon decided to use his power to help the oppressed people of the space empire. He began by teleporting into the emperor's palace and stealing his prized space sword. Then, he teleported to different parts of the empire, freeing people from prison and helping them escape to safety.

Elon's acts of defiance quickly gained the attention of the space empire, and they began to hunt him down. However, no matter how hard they tried, they could never catch him.

Eventually, Elon's actions inspired others to start rising up against the space empire. With Elon leading the charge, they were finally able to overthrow the tyrannical regime and create a new, better society.

But then! A twist! Elon was actually the bad guy. After a decade of peace, things changed. It turns out that
```


早些时候，你可能真的很难产生转折。 但是现在，它非常简单，因为 GPT-3 可以轻松地继续你的故事，因为它已经写了很多。

在这里提交后，您会看到 GPT-3 确实围绕这种新情况完成了您的句子。 这很酷，这是我得到的：

```
But then! A twist! Elon was actually the bad guy. After a decade of peace, things changed. It turns out that Elon had been using his power to mind control people and make them do his bidding. He had been using the revolution as a way to get more power for himself.

Now, the people of the space empire are once again living in fear, not knowing who to trust. But Elon is still out there somewhere, waiting for his chance to strike again...
```


哈哈哈——很疯狂。

**我想澄清一下——你可以继续这样做**。 **你可以使用 GPT-3 来完成任何想法。 应用层出不穷，**继续写一句话，让GPT-3多加几句，再写一句，看GPT-3生成什么，再加一句。

您可以使用相同的流程来撰写推文、产品说明、随笔、时事通讯、文章、博客等。 。

您可能会问，“如果我一直点击提交并让 GPT-3 继续运行会怎样？”。 试试看！ 转到您的故事，然后继续单击提交。 最终——GPT-3 将一遍又一遍地输出同样的东西。 为什么？

嗯，这个模型需要你（人类）不断地给它新的材料来处理，这样它才能更好地理解你的需要。 **它不擅长自己走**，同样，你需要引导它。 这也是您可以使故事更长的方法。

还有一个更有趣的方法可以让故事变长，我们稍后会讲到。

### Fk it 让我们写一首歌。

如果 GPT-3 可以生成故事——它*可能*可以生成一首歌哈哈。 如果它能生成一首歌，我们就可以非常具体地了解歌曲的歌词是关于什么的。 试着运行以下提示：

```
Write me a song that rhymes in the style of Drake that talks about black holes.
```



请务必将“Drake”替换为您喜欢的艺术家，并将“black holes”替换为您希望歌曲所表达的其他内容。 也许你想让你的歌是关于一个叫丽莎的女孩什么的。

我实际上得到了一个相当不错的输出：

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



如果你去 [这里](https://www.youtube.com/watch?v=pueqv3SS_qA)，然后前进到 0:25 并开始说唱上面的歌词，它实际上是合法的哈哈。

你甚至可以像这样搞笑：

```
Write me a song for pirates that explains why Python is better than Javascript:
```


或者，去他妈的，干脆写一首歌是一种完全不同的语言。

```
Write me a song in Hindi about a boy who lost his computer:
```


我会让你尝试上面的这个，它令人兴奋，因为它**结合了创意写作 + 现实世界的事实**。 去尝试让 Taylor Swift 写一首歌来解释如何玩 Super Smash Bros 之类的！ 你可以做任何事。

提示并不完美，因此结果可能不会令人惊奇，但一定要弄乱它。

向我们的一位建筑商 Naklecha 致敬，是他激发了这部分课程的灵感。 他实际上把这个故事解释器变成了一个成熟的产品[在这里](https://twitter.com/naklecha/status/1587046444854190081)，使用故事而不是歌曲。

### 向前

我们已经在没有一行代码的情况下完成了一些非常疯狂的事情，哈哈。 在这一点上，您可能会想到很多想法。

但再过一段时间，让我们继续在 Playground 中多玩**一点**——然后我们将开始编写一些代码。 我想向您展示一些更疯狂的事情，并引导您完成更多提示。 **如果你不擅长写提示，那么这些都不会有趣哈哈。**所以，我想确保你掌握了所有的秘密！

但是——等一下，这些东西是怎么工作的？

### 请这样做，否则 Farza 会很难过。

这里取得了一些重大进展！ 干得好。

再一次 — 继续提交 Playground 的屏幕截图，其中包含您最新的故事、歌曲或您想要展示的任何其他内容，并将其发布到 Discord 上的#prompts 中。

请连同图片一起包含您的**提示**，以便其他人轻松看到您的充满灵感的提示。