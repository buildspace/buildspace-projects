让我们退后一步，谈谈这一切是如何运作的。 Yah Stable Diffusion 是一种深度学习、文本到图像模型，但这意味着什么？？？ 理解它会让你更好地使用它。

**注意 -** *我将简化很多这些东西并坚持重要的部分。 这项技术是十年一遇的东西，你需要一个真正的博士才能理解，所以我会跳过数学哈哈。*

### 稳定扩散的基础

想想你看到的最后一张图片说明。 它可能在 Internet 某处的博客或文章中，而您掩盖了它。 那里有数十亿张这样的图片：高质量，免费提供，描述足够准确。 这些构成了图像生成模型的大部分训练数据。

你看，为了从文本生成图像，我们需要首先在大型图像数据集及其相应的文本描述上“训练”机器学习模型。 该训练数据用于教导模型文本描述中的单词与相应图像的视觉特征之间的关系。

**我们基本上给了计算机几十亿张图片，然后告诉它每张图片包含什么，有效地“教”它什么是东西。**

你知道那些验证码是如何要求你选择带有人行道或红绿灯的方框的吗？ 你实际上是在那里训练 AI 哈哈。

一旦我们教模型如何将文本描述中的单词与相应的图像联系起来，它就可以使用深度学习自行找出两者之间的关系。 “深度学习”的工作方式是创建具有相互连接的“神经元”层的神经网络，它处理和分析大量数据以解决诸如将文本与图像匹配等问题。

**所有这一切意味着它可以采用新的文字描述并制作相关的新图像。**

这一点并不是特别新——这项技术已经存在了一段时间，但它并没有产生非常高质量的结果。

![](https://hackmd.io/_uploads/H1q-DpE5i.png)

### 进入魔法

Stable Diffusion 的魔力发生在 CLIP(Contrastive Language-Image Pre-Training) 上。 这里发生了**很多**，所以让我们从嵌入的概念开始。

计算机看不到图像或文字。 它们不如我们头脑中拥有数十亿个 CPU 的一体机那么强大。

当我们看东西时，图像中的光会进入我们的眼睛，并被视网膜转换为电信号。 我们的大脑处理这些信号并识别我们正在看的东西。

计算机需要进行类似类型的处理——它们有一本字典，可以将单词片段映射到数字。 这称为文本嵌入。

通过将单词或图像表示为数值向量，我们可以将这些向量用作机器学习算法的输入，然后机器学习算法可以从数据中学习并做出预测或生成新数据。

![](https://hackmd.io/_uploads/BkFDw6Eqo.png)

[来源](https://www.youtube.com/watch?v=F1X4fHzF4mQ)

图像嵌入有几个额外的步骤——它们首先通过卷积神经网络 (CNN)，这是一种深度学习模型，旨在自动学习图像中的重要特征和模式。 这样我们就可以用数字向量表示图像的重要特征并用它做数学运算。

所以——**我们有一个文本嵌入和一个图像嵌入。 基本上是图像及其标题的数字表示。**

这就是 CLIP 的用武之地——它的工作是采用这两个嵌入并找到最相似的地方。 这就是给我们那些额外清晰的结果的原因，这些结果是真实的并且没有任何奇怪的伪像。 如果你想看到它的实际效果，[检查一下](https://huggingface.co/spaces/EleutherAI/clip-guided-diffusion)。

![](https://hackmd.io/_uploads/rJYFv6Nco.png)

[来源](https://www.youtube.com/watch?v=F1X4fHzF4mQ)

### 稳定扩散中的扩散

想想你见过的一堆圆形物体。 如果您只看足球，您怎么知道它与保龄球不同？ 它的样子，呃！

![足球恶作剧.gif](https://hackmd.io/_uploads/HybC9mB5o.gif)

你可能从来没有想过这个，但在你的脑海里，你至少有三个“轴”——一个是形状，一个是颜色，另一个可能是尺寸。 足球在这张图的一个位置，保龄球在另一个位置。

Stable Diffusion 做了类似的事情，除了它有**很多**更多的维度和变量。 在这里，我们的大脑被抛在了后面——它无法想象超过 3 个维度，但我们的模型有超过 500 个维度和数量惊人的变量。 这称为**潜在空间。**

![](https://hackmd.io/_uploads/SkK9v6Nco.png)

假设您正在训练机器学习模型以从文本生成猫图片。 在这种情况下，潜在空间将是一个空间，其中每个点代表不同的猫图片。 因此，如果您将一只毛茸茸的白猫的描述放入潜在空间，模型将在空间中导航并找到代表一只毛茸茸的白猫的点。 然后，它将使用该点作为起点来生成一张新的、相关的猫图片。

这就是我们的提示如此强大的原因 - **它们在我们无法想象的维度上发挥作用**。

我们需要数百个数学坐标来使用文本导航到一个点。 这就是为什么当我们添加更多修饰符时我们的结果会变得更好。

在这个空间中导航并找到与给定输入相关的点的过程称为扩散。 一旦找到最接近文本提示的点，它就会使用更多的 AI 魔法来生成输出图像。

![](https://hackmd.io/_uploads/HJEowaE5j.png)

[来源](https://www.youtube.com/watch?v=SVcsDDABEkM)

你有它！ 您现在了解了稳定扩散的基础工作。 如果您好奇并想深入了解，请查看 [这里](https://jalammar.github.io/illustrated-stable-diffusion/) 以获得对各个部分的详细解释。

您可能觉得理解其中的任何一个是如何工作的没有多大意义，但既然您这样做了，您将能够构建其他人甚至无法想到的东西。 在我撰写本文时，OpenAI 推出了其[新的和改进的嵌入模型](https://openai.com/blog/new-and-improved-embedding-model/)，它便宜了 99.8%。

GPT-3 的模型不是开源的，所以我们不能用它来制作自定义应用程序，但我们**可以**使用嵌入 API 直接匹配文本集。 这可以用于各种很棒的应用程序，比如推荐系统和自然语言搜索！

你刚刚学到的东西会复合并带你到你想不到的地方:)