

### 隐藏您的唯一主题标识符

您的用户必须键入“abraza”才能生成您的提示，这有点奇怪。 这是一个简单的修复！ 只需使用 Javascript `replace()` 函数来隐藏它！

在 `generateAction` 中的 `index.js` 调用 API 之前，输入如下内容：
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

`replace` 接受一个正则表达式，这就是 `/raza/gi` 的花哨之处。 如果您有各种拼写或昵称，您可以使用 [AutoRegex](https://www.autoregex.xyz/) 之类的东西，这是一个 GPT 支持的正则表达式翻译器！ 大多数时候，`replace("name", "unique_ting")` 会工作得很好。

您可以在 [此处](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace) 阅读更多关于替换的信息，它非常简单，而且正则表达式 [此处](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)（它们一点都不简单💀）

### 给你的用户一些花哨的提示

我们可以将您的一些魔力传授给您的用户吗？ 如果你给他们一些他们可以修改的提示，他们会得到更好的结果。 他们可能不知道所有这些花哨的艺术家是谁，所以让我们构建一些按钮来填充这些提示！

我不会带你完成这个，但实际上所有这些都是一组按钮，它们将`index.js`中的`input`值更新为预设提示。

当你这样做的时候，不妨将输入栏分成核心的 4 个部分——艺术家、媒介、氛围、描述符。 这将训练用户***如何***在他们甚至没有意识到的情况下写出好的提示！

所以你必须建立两件事 -

1. 几个自动填充预设提示的提示输入字段的按钮
2. 每个描述四个字段

这是一个混乱的模型，它可能看起来像：

![https://hackmd.io/_uploads/BJ_I96Vqo.png](https://hackmd.io/_uploads/BJ_I96Vqo.png)



您所要做的就是 [`concat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/concat) 将字段组合在一起以获得最终提示。 Ezpz。

这两点真的很重要！ 大多数开发人员并没有真正考虑过这些简单的调整会如何影响用户体验。 通过明确说明用户需要描述的内容，从您的祖母到您的狗，每个人都能够生成好东西。

**设计简单的产品比设计杂乱、复杂的产品需要更多的工作。**

我的设计有很大的改进空间。 艺术家字段应该改为下拉列表吗？ Wtf 是一个描述符？ 共鸣是什么样子的？

我会把它留给你进一步处理，也许将生成的图像及其提示存储在数据库中，以便你的用户在等待生成新图像时可以查看旧结果？ 那会很酷！

### 如何让其他人生成自己的头像？

赚钱的大佬。 让人们生成自己的图像。 没有办法绕过训练模型——您需要使用 Dreambooth 为每个人创建一个定制模型**。 这**会**花钱。 Lensa 和 AvatarAI 等大公司的做法是通过 AWS 或 GCP 等云提供商租用裸机 GPU。

他们的整个操作是您在此构建中所做的手动部分的编程方式。

如果我不得不猜测，他们的流程可能是这样的：

1.从用户那里获取5-10张图片
2.处理图像（调整大小，删除背景）
3. 使用 GPU 调整稳定扩散模型
4.使用预定义提示生成50-100张图片
5. 发送用户图片，可能删除他们的模型

所有这些都可以通过编程方式轻松完成。 这里的诀窍是以尽可能便宜的价格获得 GPU。 如果你能买到像 Lensa 一样便宜的 GPU（100 个化身 3.49 美元，哈哈），我想知道，但我认为这里的机会是在步骤 #2 和 #3 中。

有很棒的平台可以帮助您以更便宜的价格构建这些流程，例如 [banana.dev](https://banana.dev)。 确保在最后领取你的 NFT 以从他们那里获得一些疯狂的信用。 也许这就是您开展业务所需的一切🤘。

## 部署铁路
**GTFOL：让我们开始生产吧。**

是时候 [gtfol](https://www.urbandictionary.com/define.php?term=GTFOL&utm_source=buildspace.so&utm_medium=buildspace_project)。

毕竟，我们不想只留在本地主机上。 那会很无聊！ 这个应用程序的全部意义在于让您的朋友和家人与您一起创造替代现实。

部署 NextJS 应用程序变得**超级**简单——这应该只需要几分钟——然后你就会有一个指向你可以与世界分享的创作的链接。

查看此视频以了解您需要在此处执行的操作

[https://vimeo.com/786802338](https://vimeo.com/786802338)