[https://vimeo.com/775481176](https://vimeo.com/775481176)




让我们建造一些东西吧！

我已经向您展示了大量用例和提示类型。 你可能已经注意到，GPT-3 作为一个“通用助手”有点糟糕，但一旦你为特定任务提出了一个非常好的提示，它真的很好。 例如：写推文、产生创业点子、为歌曲创作歌词等。

一个好的提示可能需要您 15-20 分钟才能想出。 **但是，一旦你想出了这个提示，你就可以继续使用它来处理 1000 多个案例**。这就是我希望你记住的。

例如，我发现此提示会生成不错的着陆页标题：

```
Write a list of short landing page headlines in the style of Apple for a startup that builds the following:
```



从这里开始，我可以创建一个网站来帮助**任何人**生成登陆页面标题！ 他们所需要做的就是向我描述他们的启动情况，然后我将其插入此处的提示中。

OpenAI 的不足之处在于，这可以通过 API 完成，因此您可以创建真正定制的、由 GPT-3 提供支持的专用工具 + 您发现的神奇提示。

所以就像我在这个构建开始时向您展示的那样，我们将构建两个东西：

- 首先，一个**网络应用程序**，让任何人都可以使用 GPT-3 来实现您提出的特殊目的（例如，编写电影剧本、制作广告文案、生成一封情书，无论您想要什么） .
- 其次，一个 **Chrome 扩展**，让人们可以在他们想要的任何网站上使用你的 GPT-3 提示（例如，直接在 Twitter 中生成推文，直接在 LinkedIn 中生成一个很酷的帖子，为标题直接生成登录页面副本 网络流量等）。

### 克隆仓库。

如果您还不知道您的网络应用程序/Chrome 扩展程序的“特殊用途”——别担心！ 一步一步来。 让我们先让基础项目开始工作。

我们已经创建了一个项目，其中包含一个基本的 React/NextJS 项目 + 一些 CSS 来让你快速行动。 继续 [此处](https://github.com/buildspace/gpt3-writer-starter) 分叉项目。

为此，只需单击顶部的“**Fork**”，然后克隆分叉的 repo。 这会将 repo 分叉到您的个人帐户中，这将使以后推送代码/部署我们的项目变得更加容易。

另外，如果你感觉不错，也给它点一颗星吧！

![Untitled](https://i.imgur.com/bTgmHpL.png)



分叉回购后，继续克隆它，您的克隆 URL 将专属于您。 它应该是类似这样的：

```
https://github.com/YOUR_GITHUB_USERNAME_HERE/gpt3-writer-starter.git
```



从这开始，我们准备好了。 `cd` 进入项目，安装 `next`、`react` 和 `react-dom`，然后运行 `yarn` 来启动项目。

```

# cd into the repo
cd gpt3-writer-starter

# install next if you don't have it
yarn add next react react-dom

# run it
yarn dev
```



随后，前往“[localhost:3000](http://localhost:3000)”，您应该会看到以下内容：
![Untitled](https://i.imgur.com/5Ucablc.png)



**给那些非常熟悉 React 的人的注意事项** — 随意加速运行这部分构建。

**给那些***不太熟悉***React 的人的注意事项**——你不需要成为 React 专家也能做到这一点。 如果您在阅读本文时有一些不明白的地方，只需谷歌它们就好了。

### 添加一个文本框+生成按钮。

所以请记住——我们的目标是创建一个用户可以访问的网站，输入一些东西，然后让 GPT-3 为某些特定目的生成一些文本（例如生成金属歌曲标题，以奥巴马的语气生成演讲， 任何都可以）。

暂时不要担心更改标题或副标题。 暂时保留它们。 我们会到达那里！

我们要做的第一件事是添加一个用户可以输入内容的地方！ 所以，我们要添加一个 `textarea`。 继续并在 `index.js` 中使用以下代码添加它，再次 - 我添加了一些 CSS 来帮助您并确保一切看起来不错。

```jsx
const Home = () => {
  return (
    <div className="root">
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>sup, insert your headline here</h1>
          </div>
          <div className="header-subtitle">
            <h2>insert your subtitle here</h2>
          </div>
        </div>
        {/* Add this code here*/}
        <div className="prompt-container">
          <textarea placeholder="start typing here" className="prompt-box" />
        </div>
      </div>
      <div className="badge-container grow">
        <a
          href="https://buildspace.so/builds/ai-writer"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={buildspaceLogo} alt="buildspace logo" />
            <p>build with buildspace</p>
          </div>
        </a>
      </div>
    </div>
  );
};
```



*注意：每当我更改代码时，我都会在我更改/添加的部分上方添加一些注释，以方便您使用。 例如，在上面，我在为 `textarea` 添加的 div 上方添加了 `{/* Add this code here*/}` 注释。*

完成后，您将拥有如下所示的内容。 也尝试输入它以确保它按计划工作。

![Untitled](https://i.imgur.com/f3OCGVf.png)



`textarea` 非常酷，因为它为我们提供了一种让用户在我们的网络应用程序上输入的简单方法*并且*它为我们提供了一种实际捕获用户输入内容的简单方法**因此我们可以将其发送到 GPT-3 API稍后。

让我们设置那个捕获系统，这样我们就知道我们的用户在输入什么。 我们将为此添加一个 [React Hook](https://reactjs.org/docs/hooks-intro.html)——继续并在文件顶部导入 `useState`：

```jsx
import { useState } from 'react';
```



从那里，我们将创建两个新的状态变量：稍后我们将使用的`input`和`setInput`。 继续，这一行就在 `const Home = () => {` 的正下方。

```jsx
const [userInput, setUserInput] = useState('');
```



现在，让我们将这些变量用于您之前创建的`textarea`。

```jsx
<textarea
  className="prompt-box"
  placeholder="start typing here"
  value={userInput}
  onChange={onUserChangedText}
/>;
```



*注意：您的代码将在这里崩溃，因为我们还没有创建 `onUserChangedText` 函数。*

我们在这里做什么？ 好吧，首先，我们将`textarea`的`value`设置为 `userInput`，这意味着我们将在`textarea`中显示 `userInput` 变量中的任何内容。

然后我们有一个 `onChange` 参数——所以，每当用户输入时，它都会调用 `onUserChangedText`。 让我们继续写那个函数。 这很简单。 在你有  `const [input, setInput]`的地方添加这个：
```jsx
const onUserChangedText = (event) => {
  console.log(event.target.value);
  setUserInput(event.target.value);
};
```



所有这一切都是调用  `setUserInput` 并将其设置为 `textarea` 中的任何内容。 这样，`userInput` 的值将始终使用 `textarea` 中的任何内容进行更新。

简单的！ 让我们测试一下。 前往您的控制台并开始在您的`textarea`中输入以确保您正确捕获输入：

![Untitled](https://i.imgur.com/X6cS8xx.png)



看看它是如何为您输入的每个键丢弃一个事件的？ 我们正在获取该事件对象，抓取文本，打印它，然后将其保持在我们的输入状态。 现在随意删除 `console.log` 语句，这样它就不会聚集在您的控制台上。

现在，我们只想添加一个生成按钮，用户可以单击该按钮来生成一些魔法——稍后我们会将其连接到 GPT-3 API。 但现在，我们还只是将它设置为一个不执行任何操作的按钮。

```jsx
<div className="prompt-container">
  <textarea
    placeholder="start typing here"
    className="prompt-box"
    value={userInput}
    onChange={onUserChangedText}
  />
  {/* New code I added here */}
  <div className="prompt-buttons">
    <a className="generate-button" onClick={null}>
      <div className="generate">
        <p>Generate</p>
      </div>
    </a>
  </div>
</div>
```



我现在给它一个 `onClick={null}` ，稍后我们将编写一个函数将它连接到 GPT-3 API。

不错，你的应用现在应该看起来很辣，我们几乎所有的 UI 都已到位。

![Untitled](https://i.imgur.com/bf3JEzb.png)



### 确定你的标题+副标题。

此时，您得到了一个非常干净的网络应用程序，它可以让人们输入一些文本，我们稍后会将这些文本发送到 GPT-3。 见鬼了。

所以，现在在我们添加 GPT-3 之前，我们必须做一些非常重要的事情，我们需要确定标题 + 副标题。

想象一个随机的人攻击你的 GPT-3 作者，**你想让他们做什么？**

同样，仅将 GPT-3 用作通用助手有点糟糕 + 我们可以为此使用 Playground。 它有助于决定您希望这件事做的具体事情。

*你当然可以稍后更改它*，但在我们继续之前至少有一些你认为有点酷的东西是有帮助的。

这里有些例子：

- **标题**：生成有关加密的推文线程。 **副标题**：写一个简短的句子，说明您希望推文主题是关于什么的（例如以太坊及其价格，Solana 及其交易速度，比特币及其寿命）。
- **标题**：让唐纳德·特朗普向您解释一些事情。 **副标题：** 写下您希望唐纳德·特朗普向您解释的主题（例如核裂变、飞机的工作原理、生命的意义）。
- **标题：** 与龙珠 Z 中的悟空交谈 **副标题：** 给悟空写一条消息，向他询问任何事情（例如，生命的意义是什么，你是如何变得如此强大的，等等）。

这就像一个登陆页面！ 标题简短而亲切。 而且，副标题解释得更多一些。

另外，请注意每一个的具体性！ 用例越具体，GPT-3 的表现就会越好。 有太多的用例——GPT-3 可以做任何事情，从生成代码到编写令人惊叹的短信再到回复你的 Tinder 约会。 发挥创意。 享受它吧。

一旦你想出了你的标题+副标题，在代码中改变它！
```
<div className="header-title">
  <h1>sup, insert your headline here</h1>
</div>
<div className="header-subtitle">
  <h2>insert your subtitle here</h2>
</div>
```



对于我的 Web 应用程序，我将构建一些非常简单的东西 — 一个生成博客文章的工具，但我特别喜欢的是博客文章都具有 Paul Graham 的语气，因为我真的很喜欢他清晰简洁的风格。

我从博客文章中学到了**很多**——但是，通常很难找到好的。 特别是围绕不那么受欢迎的话题。

例如，前几天我在谷歌上搜索有关核裂变的信息，但所有的帖子要么非常技术性，要么非常简单。 此外，我讨厌他们中的大多数人的写作风格。

我想自己创造出非常优秀的东西来学习！ 另外，我什至可以在我自己的博客上使用生成的，这样它们对其他人有帮助。

我们走！

![Untitled](https://i.imgur.com/GxwnSCs.png)





请**不要复制**我的任何标题——想出你自己的具体用例。 添加你自己的旋转到这个东西。 否则，我保证这不会很有趣。

### 请这样做，否则 Farza 会很难过。

来吧，用你喜欢的新标题和副标题截取你的 GPT-3 编写器的屏幕截图。 在#progress 中分享它，以激励正在寻找出色用例的其他人。