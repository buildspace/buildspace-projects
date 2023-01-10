至此，您已经训练了自己的 Dreambooth 模型。 太他妈的**疯了**。 你已经在做世界上 98% 的人都不知道该怎么做的事情。 希望您将其与您传奇的提示工程技能相结合，获得如下所示的一些图像：

![https://hackmd.io/_uploads/SJfjrpNqj.png](https://hackmd.io/_uploads/SJfjrpNqj.png)

我们将通过创建一个使用此模型的 Web 应用程序来更进一步！ 正如我们之前谈到的，您的 Web 应用程序将能够从任何 Web 浏览器生成您自己的头像。 更重要的是，您可以将其发送给朋友，他们可以根据您的自定义模型创建一些图像。 希望你有好朋友哈哈。

这样做的好处是你不必使用人脸（你的外星人脸太重要了，哈哈）。 但说真的，你可以训练一棵树、一座桥，甚至是你的吉他的模型。 真的很疯狂，看看你能在这里做什么。

### 获取启动代码
让我们继续并从 fork starter repo 开始。 我们将对其进行分叉，以便我们可以使用名为 [railway](https://railway.app/) 的工具轻松地将我们的应用程序生成器部署到世界各地！ [单击此处分叉存储库](https://github.com/buildspace/ai-avatar-starter/fork)。

继续克隆你全新的分支，在你最喜欢的文本编辑器（我使用的是 VSCode）中打开文件夹并运行命令 `npm i` 。 然后你就可以通过运行 npm run dev 来启动项目了

如果一切正常，您应该能够在您最喜欢的网络浏览器中导航到“[localhost:3000](http://localhost:3000)”并看到：

![https://hackmd.io/_uploads/H17PFTEqj.png](https://hackmd.io/_uploads/H17PFTEqj.png)

非常好！ 我们将使用 `next.js` 来为此构建我们的 UI + 单一 API :)。 如果您以前从未使用过 Next，请不要害怕。 我将带您探索这个框架的神奇之处。

**现在** — 继续并返回您的代码编辑器，让我们在这里获得一些基本的东西。

首先，改变你的单线！ 前往 `pages folder` 中的 `index.js` 文件，并使用您正在制作的生成器类型更新您的标题和描述。 我们将构建一个愚蠢的图片生成器，所以我将我的更改为 —“愚蠢的图片生成器”+ 将描述更改为“把我变成你想要的任何人！确保你在提示中称我为“abraza” ”。

```jsx
const Home = () => {
  return (
    <div className="root">
      <Head>
        {/* Add one-liner here */}
        <title>Silly picture generator | buildspace</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            {/* Add one-liner here */}
            <h1>Silly picture generator</h1>
          </div>
          <div className="header-subtitle">
            {/* Add description here */}
            <h2>
              Turn me into anyone you want! Make sure you refer to me as "abraza" in the prompt
            </h2>
          </div>
        </div>
      </div>
      <div className="badge-container grow">
        <a
          href="https://buildspace.so/builds/ai-avatar"
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

好东西。 这种感觉已经很好了。 接下来我们要设置的是一个供用户输入的地方！ 我们需要能够接收提示并将其发送到我们的推理 API。

我们将首先在包含描述的 div 下方添加一个提示容器：

```jsx
<div className="root">
  <Head>
    <title>Silly picture generator | buildspace</title>
  </Head>
  <div className="container">
    <div className="header">
      <div className="header-title">
        <h1>Silly picture generator</h1>
      </div>
      <div className="header-subtitle">
        <h2>
          Turn me into anyone you want! Make sure you refer to me as "abraza" in the prompt
        </h2>
      </div>
      {/* Add prompt container here */}
      <div className="prompt-container">
        <input className="prompt-box" />
      </div>
    </div>
  </div>
  <div className="badge-container grow">
    <a
      href="https://buildspace.so/builds/ai-avatar"
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
```

酷！ 我在这个项目的 `styles/styles.css` 文件中放置了一些基本的 css，但您可以随意将其更改为您想要的 - 请记住这是**您的**项目。

![https://hackmd.io/_uploads/rkvdK6N5o.png](https://hackmd.io/_uploads/rkvdK6N5o.png)

这将包含我们从用户那里获取 API 提示所需的所有 UI。 现在，为了实际捕获此输入，我们将需要创建一些状态属性。 继续并在文件顶部导入“useState”，然后创建一个“input”状态属性：

```jsx
// Add useState import to top of file
import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';

const Home = () => {
  // Create state property
  const [input, setInput] = useState('');
  
  return (
    // rest of code
  )
}

export default Home;
```

现在我们有办法保存某人在我们的输入框中写的内容，我们需要告诉我们的输入框读取该属性！ 回到您创建输入的位置并添加此属性：

```jsx
<div className="prompt-container">
  {/* Add value property */}
  <input className="prompt-box" value={input} />
</div>
```

酷——快到了！ 如果您开始输入您的输入，您将开始意识到没有显示任何内容。 那是因为当我们输入时，我们需要将更改保存到我们的“输入”状态。 为此，我们需要使用输入的“onChange”属性，并为其提供一个函数来获取文本并将其保存到我们的状态。

首先在你声明你的 `input` 的地方创建一个名为 `onChange` 的新函数：

```jsx
const Home = () => {
  const [input, setInput] = useState('');
  // Add this function
  const onChange = (event) => {
    setInput(event.target.value);
  };
  
  return (
    // rest of code	
  )
}

export default Home;
```

这将接受一个事件，我们只需获取该值并将其设置为我们的输入状态！

现在，我们只需要告诉我们的输入 UI 在您每次键入时调用此函数即可。 继续将 `onChange` 属性添加到您的输入中，如下所示：

```jsx
<div className="prompt-container">
  {/* Add onChange property */}
  <input className="prompt-box" value={input} onChange={onChange} />
</div>
```

继续并开始在输入框中键入内容，您现在应该会看到文本出现！ Ezpz 我的朋友——我们正在路上。 好的，现在开始激动人心的事情——**进行网络调用以从拥抱面使用我们的推理 API**。

如果您从未使用过 API，请不要害怕，您的想法即将被打破。

首先，我们实际上需要一种方法来运行我们的网络请求。 让我们创建一个按钮，它将接受我们的输入并将其发送到互联网。 为此，我们将添加更多 UI，如下所示：

```jsx
<div className="prompt-container">
  <input className="prompt-box" value={input} onChange={onChange} />
  {/* Add your prompt button in the prompt container */}
  <div className="prompt-buttons">
    <a className="generate-button">
      <div className="generate">
        <p>Generate</p>
      </div>
    </a>
  </div>
</div>
```

此时你应该看到这样的东西：

![https://hackmd.io/_uploads/rkSFt6N9s.png](https://hackmd.io/_uploads/rkSFt6N9s.png)

尝试点击按钮——没有任何反应，对吗？ 那是因为我们没有告诉按钮在点击时运行任何东西！ 为此，我们将做一些与我们对 `onChange` 事件所做的非常相似的事情。

首先在我们之前声明的 `onChange` 函数下创建一个名为 `generateAction` 的新函数：

```jsx
const Home = () => {
  const [input, setInput] = useState('');
  const onChange = (event) => {
    setInput(event.target.value);
  };
  // Add generateAction
  const generateAction = async () => {
    console.log('Generating...');	
  }
  
  return (
    // rest of code
  )
}

export default Home;
```

我们现在要添加一个 `console.log` 语句，以确保事情按我们预期的那样运行。

如果您尝试按下生成按钮，您会发现仍然没有任何反应。 我们需要告诉我们的按钮在被点击时运行这个函数。

返回到您声明生成按钮的位置，您将向其添加一个名为“onClick”的属性：

```jsx
<div className="prompt-container">
  <input className="prompt-box" value={input} onChange={onChange} />
  <div className="prompt-buttons">
    {/* Add onClick property here */}
    <a className="generate-button" onClick={generateAction}>
      <div className="generate">
        <p>Generate</p>
      </div>
    </a>
  </div>
</div>
```

史诗般的——一旦你这样做了，就去你的媒体并打开检查器并前往控制台选项卡。 当您单击生成按钮时，您应该看到 `Generating...` 打印出来，如下所示：

![https://hackmd.io/_uploads/Hke5t64cs.png](https://hackmd.io/_uploads/Hke5t64cs.png)

 看看这有多容易？ 您实际上已经完成了调用 API 的一半。