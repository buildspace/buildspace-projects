就像buildspace的所有东西一样，让我们​​直接进入而不解释任何东西，哈哈。我认为一旦你开始钻研它，你就会很快理解其中的很多内容。

### 访问 OpenAI

您需要做的第一件事是 [此处](https://beta.openai.com/playground) 在 OpenAI 上注册一个帐户。一旦你创建了一个新账户，OpenAI 将在你的账户中存入 18 美元。这足以让你四处乱逛、构建你的产品，甚至支持大约 100 个用户。非常棒。

创建帐户后，前往 [Playground](https://beta.openai.com/playground)。这是我们在开始编写任何代码之前要花一些时间的地方。

不要太担心右边的那些设置，我们会认识它们。只需确保您的模型（model）是`text-davinci-003`并确保“Temperature”设置为`0.7`。 **并且，还要确保“Maximum length”设置为“650”。**

*注意：如果您以前有过帐户，则需要使用不同的电子邮件创建一个新帐户，因为信用额度将在 3 个月后过期。*



### 提示的心态。

“提示”是您输入到 GPT-3 的内容。

我只想说清楚一件事——**接下来的 30 分钟可能非常神奇，也可能会很痛苦**。提示写起来真的很烦人，我只想让你知道这一点。

提示工程是一种技能——你不会一开始就擅长它，但没有关系。但是，一定要继续前进。 **请记住，您的目标是掌握该项目。没有别的。** 不要陷入试图让 **一件**  事情发挥作用。

我希望在学习提示工程时有一些技巧：

- 好的结果不会很快出现，我需要 6-12 次尝试才能获得提示，达到我认为不错的程度。不要指望第一次尝试就会有魔力。
- 快速迭代，不要太执着于你正在处理的特定提示。
- 如果你的输出最终没有我的那么好，那也没关系。 GPT-3 的输出甚至可以基于几个单词而有很大差异。
- 不要沉迷于让一个特定的提示起作用。尝试 6 到 12 次后，随意说去他妈的，要么 a) 从头开始​​提示并进行大量更改，要么 b) 继续下一课。

### 构建您的前几个提示来讲述一个故事。

您需要开始的就是给 GPT-3 一个提示，这是您用纯英语输入的初始文本。我知道这听起来很奇怪，但文本提示实际上是您“编程”模型的方式。

我想让您感受一下探索提示的过程，该提示从简单开始变得越来越复杂。我们要做的第一件事是让 GPT-3 输出一个定制的故事。我们走吧！

在游乐场输入以下内容：

```
Write me a few anime titles.
```



这是他输出给我的：

```
Write me a few anime titles.

1. Attack on Titan
2. Death Note
3. Naruto
4. One Piece
5. Tokyo Ghoul
```



*注意：您看到的可能有所不同，因为每次 GPT-3 运行时，每次都会在模型中注入随机性，因此输出会有所不同。*

很酷——这些是真实存在的动画。 那是因为 GPT-3 是根据互联网上的大量文本进行训练的。 请务必要求它为您写其他内容（例如有关电影、音乐等的内容）。

但是，我想要一些**更多**定制的东西！ 我想要一部以我为主角的**新**动漫。 继续并从 Playground 中删除所有内容。

我更改我的提示如下

```
Give me anime titles about a boy named Farza.
```



**确保您将提示更改为您自己想的提示**。我会在这个构建过程中经常说这一点——但是，不要逐字逐句地复制我的提示。 如果您所做的只是复制粘贴，那将是浪费时间。

用你自己的名字。 也许您不想要“动漫”片名，也许您想要“科幻”电影片名。 也许你不想要关于“男孩”的标题，也许你想要关于“龙”的标题。 发挥创意。 走着瞧吧。

当我运行我的提示时，我得到：

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



很酷！ 但是，仍然没有超级定制的感觉。 我觉得我以前听说过这些故事。 他们感觉并不新鲜。 **我们需要为 GPT-3 提供更多我们想要的信息。**

现在，我有点喜欢“Farza and the Lost Kingdom”——所以，我要接受它，现在构建一个简单的提示来输出一个故事。 再次强调，请不要复制粘贴我的提示——使用你自己的名字、你自己的设置等。你可以让你的故事发生在太空或水下，你也可以让你的故事包括埃隆马斯克作为你的副手——无论如何都可以。

**不要只是复制我**。如果你只是使用我给你的东西，它就不会那么神奇。 您需要确保在提示中包含您自己的兴趣。 只有这样你才会感受到魔法。

```
Tell me a story titled "Farza and the Lost Kingdom" set in the 1500s that feels like an anime.
```



这是我得到的：

```
Tell me a story titled "Farza and the Lost Kingdom" set in the 1500s that feels like an anime.

Farza was a young girl living in the 1500s in a small kingdom that was on the verge of being taken over by a larger kingdom. One day, she stumbled upon a hidden passage that led her to a lost kingdom that was hidden away from the rest of the world. This kingdom was full of magical creatures and treasures, and Farza quickly realized that she was the only one who knew about it. She decided to keep it a secret and vowed to protect the kingdom and its inhabitants. Over the years, she became a powerful sorceress and led the kingdom to safety.

```



这很狂野。 **疯狂的是 GPT-3 知道一个好故事的结构是什么**。 这真的超级酷！，现在我需要做的就是为提示提供更多信息。

例如——在这种情况下，GPT-3 认为 Farza 是女孩，我是男孩！ 另外，我喜欢失落的王国充满秘密魔法类型的想法，我会保留它。 我也喜欢王国被别人夺走的想法。

但是，我觉得这个故事需要一个恶棍。

一起让它成为现实。

我更改提示以提供更多信息：Farza 是谁？ 设置是什么？ 谁是恶棍？ 我想要的基本情节是什么？
```
Tell me a story titled "Farza and the Lost Kingdom" set in the 1500s that feels like an anime.

Farza: a 26 year-old boy that doesn't know he has secret powers.
Setting: a poor, broken kingdom that's been destroyed by Furqan.
Furqan: the villain of the story, he's a mysterious figure with crazy powers.
Plot: Farza wants to beat Furqan and take the kingdom back.

Story:
```



*这里注意：我特别告诉 GPT-3 我希望我的故事从哪里开始我做的`故事：`。 这只是帮助 GPT-3 理解我们希望它立即开始输出故事。*

注意我在这里给 GPT-3 的所有东西！ `Farza`、`Setting`、`Furqan` 和 `Plot`。 我这样做是因为我想向 GPT-3 解释我想要什么。 同样，我们只想尽可能具体地告诉 GPT-3 我们想要什么。 它可以进行所有的创造性思维，但是，**我们需要给它基本的指导方针**。

**一定要创建自己的场景、情节、反派等**

使这部分变得简单的提示：*想想你最喜欢的节目、电影等。*混合和匹配它们中的元素。 这就是它变得有趣的地方，哈哈。 也许你的场景来自你最喜欢的科幻电影，你的情节来自你喜欢的一本书，而你的反派是埃隆·马斯克、汤姆·克鲁斯或某个随机的真人哈哈。

这是我运行提示时得到的：
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



**疯狂的。**

GPT-3 想出了一个**隐藏的洞穴**、**一把神奇的剑**，所有这些狗屎。从字面上看，感觉就像一部动漫。按照这个速度......也许我会拿 [我们刚刚筹集的 1000 万美元](https://buildspace.so/raise) 并将其用于旋转 buildspace 以成为一个动漫工作室而不是哈哈。

### 一些建议。

当我第一次弄乱 GPT-3 时，我痴迷于让我的确切提示/故事完美无缺。但是，那是我的错误。你的输出不会是完美的。

您只需要 15 分钟即可完成这段旅程。继续！

所以，如果你的故事还不是很酷，或者你注意到故事只有几句话，**你需要不断改进你的提示**。想象一下，你得到了你给 GPT-3 的东西，你能写出一个引人入胜的故事吗？

此外，您可以直接告诉 GPT-3 您想要什么。例如，如果你觉得你的故事感觉不太完整，你可以直接说“告诉我一个完整的故事，有开头、中间和结尾”。我实际上是后来添加的，效果非常好。

在这里多花点时间研究您的提示。 99% 的情况下，问题不在于 GPT-3。这是你的提示。你会在这个加班中变得更好！

几点建议：

- **你的故事每次只有 1-2 句话长吗？** 不用担心，没关系。我们稍后会向您展示一些修复方法。但是现在，尝试为 GPT-3 提供更多关于您的角色、您想要的情节和设置的信息。你的角色有趣吗？他们所在的世界是某个未来太空星球上的吗？为 GPT-3 做好一切准备！
- **没有一个好故事** ？尝试让您的故事与现实世界中的某些东西重新混合。你可以直接告诉 GPT-3 这样做。例如：`给我讲一个完整的故事，有开头、中间和结尾，标题为“Farza and the Magical Red Box”。这个故事应该结合权力的游戏和绝命毒师的共鸣。你给 GPT-3 的上下文和比较越多越好。
- **最重要的是**——不要沉迷于同一个故事/提示。尝试几次后，可以说去他妈的，然后删除整个提示并尝试一些全新的东西。

### Temperature

右边有一堆疯狂的选项。这些是“超参数”。主要的是“Temperature”。

“Temperature”基本上是您希望模型的风险程度。更高的“Temperature”意味着模型会更加精神错乱并犯更多错误。较低的“Temperature”意味着模型将承担更少的风险，并给出更标准的“正确答案”。

‘0.9’ 的较高温度更适合更有创意的事物，例如讲故事。较低的温度“0.1”更适合具有明确答案的提示。

让我们搞砸它。按照上面已经写好的提示，将温度设置为“0.9”，看看会发生什么。

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



好吧，这简直让我起鸡皮疙瘩。

*“然而，就在他即将发出最后一击时，法尔扎的潜能突然觉醒，他扭转了战局。”*

那是指环王类型的狗屎。

起初，这个故事似乎很标准。但是，最后一段——这就是魔法。 **GPT-3 为我生成了一个扭曲的结局**。因为我们让模型在更高的温度下承担更多的风险，所以它最终做了最危险的事情：写一个扭曲！

**你的故事可能*不会*有转机。**

事实上，当您设置更高的温度时，您的故事可能会*更糟*。您只需要自己弄清楚并测试不同的提示/温度组合。

这是提示工程游戏的全部内容！

*注意：如果你真的想在故事中获得一个转折——我能够通过这种格式获得一些更疯狂的转折，我从字面上要求一个转折结尾，并通常告诉 GPT-3 我希望转折结尾包括什么。我还发现举例说明哈利波特、绝命毒师、火影忍者等好故事会有所帮助。*
```
Tell me a full story with a beginning, middle, and end titled "Farza and the Magical Red Box". At the end of the story, include a crazy plot twist between Farza and the Red Box where something crazy happens to Farza. Make the story feel really awesome like Harry Potter.
```



**在运行这些** **不同的提示时，请不断调整温度**。我喜欢将温度每次更改 `0.1` 几次以进行测试。 此外，不同温度下的相同提示会产生截然不同的结果。

所以基本上这里的教训是：你需要调整的不仅仅是提示以获得好的结果，你还需要调整你的超参数。

没有情节转折？ 不要担心。 继续前行！ GPT-3 还有很多我们尚未解锁的功能，可以大大提高其性能。

### 请这样做，否则 Farza 会很难过。

继续在 Playground 中截取您的故事的屏幕截图，并将其发布到 Discord 上的#prompts。 连同图像，在消息中包含您的**提示**，以便其他人轻松看到您的提示以获得灵感。

而且，如果您正在寻找自己的灵感，您可以在那里找到一些！