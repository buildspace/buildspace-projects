现在是我们编写实际调用 API 的逻辑的时候了。 让我们回到 `generateAction` 函数并开始添加：

```jsx
const generateAction = async () => {
  console.log('Generating...');

  // Add the fetch request
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'image/jpeg',
    },
    body: JSON.stringify({ input }),
  });

  const data = await response.json();
};
```


第一个代码块实际上会传到互联网上并说“嘿`/api/generate`你能接受我的输入并给我一个图像吗？” 收到响应后，我们希望将其转换为`JSON`格式，以便检查一些不同的内容。

漂亮，继续加油。 继续将此代码添加到将响应转换为`JSON`的位置：
```jsx
const generateAction = async () => {
  console.log('Generating...');

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'image/jpeg',
    },
    body: JSON.stringify({ input }),
  });
  
  const data = await response.json();

  // If model still loading, drop that retry time
  if (response.status === 503) {
    console.log('Model is loading still :(.')
    return;
  }

  // If another error, drop error
  if (!response.ok) {
    console.log(`Error: ${data.error}`);
    return;
  }
};
```

在这个块中，我们正在检查两种不同的状态——`503`和`ok`（实际上只是状态代码`200`）。

还记得当我们用他们的 UI 测试我们的模型时，有时它会有一个加载指示器说“模型正在加载”吗？ 那么，如果是这种情况，Hugging Face 将返回`503`状态！ 实际上真的很棒，因为我们可以毫无问题地处理这个问题。

然后我们检查是否有任何其他错误，如果有也确保捕获这些错误并为我们打印出来。

如果一切顺利（它总是应该对吗？）我们将拍摄我们的图像并将其保存到状态以进行显示。

好吧，首先，让我们创建一个名为`img`的新状态属性：
```jsx
const Home = () => {
  const [input, setInput] = useState('');
  // Create new state property
  const [img, setImg] = useState(''); 
  
  // rest of code
}

export default Home;
```


一切就绪后，我们可以返回到 `generateAction` 函数并将这一行添加到它的末尾：
```jsx
const generateAction = async () => {
  console.log('Generating...');

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'image/jpeg',
    },
    body: JSON.stringify({ input }),
  });
  
  const data = await response.json();

  if (response.status === 503) {
    console.log('Model still loading...');
    return;
  }

  if (!response.ok) {
    console.log(`Error: ${data.error}`);
    return;
  }

  // Set image data into state property
  setImg(data.image);
};
```


就是这样！ 此时，您已成功使用 Fetch 将请求发送到 Internet。 很神奇吧？

在你的输入中输入一些东西，旋转一下然后......等一下......它已经坏掉了哈哈。

![https://hackmd.io/_uploads/BJxjF6Nqo.png](https://hackmd.io/_uploads/BJxjF6Nqo.png)

我们有一个`404`？ `404` 通常意味着找不到端点（或 API）！ 我们在这里缺少一个非常重要的步骤 — **实际编写 API 代码。**

Next.js 的美妙之处在于，您可以在同一个项目中轻松启动无服务器功能，而不必担心服务器的任何托管/维护等。这非常酷，只需创建文件并在其中编写一些代码即可完成！ 为了让这个东西工作，让我们继续写我们的第一个端点:)。

继续，首先在 `pages` 目录中创建一个名为 `api` 的新文件夹。 在此目录中，您将创建一个名为 `generate.js` 的新文件。

Next.js 的惊人之处在于它如何使用文件夹结构来定义您的 API 路径。 例如，我们只是创建一个名为 `api` 的文件夹，并在该文件夹中创建一个名为 `generate` 的文件。 如果你回到你的 `index.js` 文件，你会注意到我们调用的 API 端点是 `api/generate`。 它实际上只是使用文件夹结构！

好的史诗——让我们写一些代码。 首先，让我们编写一个函数，当我们到达这个端点时将运行：
```jsx
const generateAction = async (req, res) => {
  console.log('Received request')
}

export default generateAction;
```


当我们经历这个时，你会开始看到这里有很多相似之处，但和以前一样，让我们在调用这个东西时记录一些东西。 唯一的区别是这些日志语句将显示在您运行 `npm run dev` 的终端中。

完成该设置后，继续并重新运行 `npm run dev` 命令，然后继续并按下生成按钮。

![https://hackmd.io/_uploads/Byb3YaV9i.png](https://hackmd.io/_uploads/Byb3YaV9i.png)

如果您检查网络选项卡，您会看到您的请求正在处理 — **LFGGG。** 真正的大动作就在那里。

您可能会注意到它一直停留在待定状态，但别担心，我们很快就会修复它 :)。 您还应该注意到在您的 VSCode 终端中打印出“Received request”！

现在我们知道我们正在接收来自前端的请求，让我们实际做我们需要它做的事情吧，哈哈。

在 `generateAction`中，我们将从请求中获取输入开始。 还记得我们发送请求时发送的是输入文本吗？ 我们可以这样抓取它：
```jsx
const generateAction = async (req, res) => {
  console.log('Received request');
  // Go input from the body of the request
  const input = JSON.parse(req.body).input;
};

export default generateAction;
```

此时，我们将获得从 UI 发送过来的输入，并可以使用它在 Hugging Face 中调用我们的 Inference API。 为此，我们将编写另一个获取请求。

我要把它放在这里并解释更多：

```jsx
const generateAction = async (req, res) => {
  console.log('Received request');

  const input = JSON.parse(req.body).input;

  // Add fetch request to Hugging Face
  const response = await fetch(
    `https://api-inference.huggingface.co/models/buildspace/ai-avatar-generator`,
    {
      headers: {
        Authorization: `Bearer ${process.env.HF_AUTH_KEY}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        inputs: input,
      }),
    }
  );
};

export default generateAction;
```


这看起来应该与我们在前端看到的非常相似，只是增加了一些内容！

首先- url。 这个 url 是指向你的模型在Hugging Face的路径。 这是我的，但要找到你的，你只需要：

`https://api-inference.huggingface.co/models/{USERNAME}/{MODEL_NAME}`

接下来您会注意到我们的请求中有一个`headers`对象。 为了让 Hugging Face 允许我们使用他们的推理 API，我们需要有一个与我们的帐户相关联的 API 密钥。 此密钥将告诉 Hugging Face 我们有权访问此推理 API — **因此请务必保密。**

前往 [tokens](https://huggingface.co/settings/tokens) 页面并获取写入令牌 - 您**可以**使用为 Colab 生成的相同令牌，它会正常工作。

在我们的 `generateAction` 函数中，您会看到一些奇怪的语法，类似于 `processs.env.HF_AUTH_KEY`。 这是 Next.js 在不向用户公开的情况下读取密钥的特殊方式！ 想象一下，如果每次您登录网站时每个人都能看到您的密码，会怎样？ 这有助于阻止它！

首先，看一下 `.example.env` 文件。 这是为了向您展示我们需要如何正确设置我们的 API 密钥。 继续在项目的根目录下创建一个名为 `.env`  的新文件，并使用相同的设置，如下所示：
```jsx
HF_AUTH_KEY=YOUR_API_KEY_HERE
```


不要忘记在终端中使用 `CMD/CTRL` + `C` 并重新运行 `npm run dev` 以确保此文件已与您的构建一起编译，否则它可能无法被拾取！

**好吧** - 现在这里最后一件事是这个名为`body`的属性。 这是我们将从用户那里收到的输入并将其传递给 Hugging Face 的地方！ 您可能会注意到该对象具有名为 `inputs` 的属性。

如果你回到 Hugging Face 网站上的模型，打开网络检查器，然后运行另一个文本到图像。

![https://hackmd.io/_uploads/SygpY6N9o.png](https://hackmd.io/_uploads/SygpY6N9o.png)

在有效负载中，您会看到它期望 `inputs` 属性是我们输入的文本！ 这很酷，因为您只是做了一些逆向工程——在这里左右学习技能！ [您还可以在此处挖掘推理 api 详细参数文档](https://huggingface.co/docs/api-inference/detailed_parameters) :)

好吧好吧好吧——我们几乎准备好运行这个东西了。 在我们进行第一次尝试之前，让我们再添加 **FEW** 检查。 看看下面这段代码，把它放在你的 fetch 下：
```jsx
const generateAction = async (req, res) => {
  console.log('Received request');

  const input = JSON.parse(req.body).input;

  const response = await fetch(
    `https://api-inference.huggingface.co/models/buildspace/ai-avatar-generator`,
    {
      headers: {
        Authorization: `Bearer ${process.env.HF_AUTH_KEY}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        inputs: input,
      }),
    }
  );

  // Check for different statuses to send proper payload
  if (response.ok) {
    const buffer = await response.buffer();
    res.status(200).json({ image: buffer });
  } else if (response.status === 503) {
    const json = await response.json();
    res.status(503).json(json);
  } else {
    const json = await response.json();
    res.status(response.status).json({ error: response.statusText });
  }
};

export default generateAction;
```


这应该是不言自明的——我们正在检查三种不同的状态：`ok`、`503` 和任何其他错误！ 让我们再分解一下：

`ok` - 请记住，这基本上是任何成功的状态代码，如 `200`。 这意味着调用成功并且应该返回图像。 现在有趣的部分是获取我们的响应并将其转换为`buffer`。 为了让我们在 UI 中设置图像，我们需要将其转换为 UI 能够读取的形式。 让我们从缓冲区开始，看看会发生什么 :)。

`503` - 当我们的模型仍在加载时，我们将收到此消息。 此响应将包含两个属性 - `error` 和 `estimated_time` 。 `error` 只是一条消息，说明正在发生的事情，`estimated_time` 是加载模型可能需要多长时间。 我们将很快使用`estimated_time`来设置重试方法，请记住这一点！

`any other error` - 如果有任何其他错误，请将其发送回我们的 UI，说明问题所在 - 这个很简单。

**好的，很好。**我们在一个非常好的地方来测试我们在这里的第一次运行。 让我们继续看看会发生什么，并从那里继续建设！ 我建议让您的网络选项卡保持打开状态，以便您可以看到您的请求通过并完成 :)。

写一些提示，按生成，让我们看看会发生什么：

![https://hackmd.io/_uploads/SyARF64qo.png](https://hackmd.io/_uploads/SyARF64qo.png)

天哪，就这样，我收到了回复！ 你可以在这里看到我用我的缓冲区响应没问题！

现在，让我们稍微更改一下提示——哇，我们收到了 503 。 看起来我们的模型仍在此处加载：

![https://hackmd.io/_uploads/B1ag5aVqi.png](https://hackmd.io/_uploads/B1ag5aVqi.png)

嗯，所以我们有点问题，不是吗？ 当我们收到`503`时，我们需要在认为模型已加载时再次发出请求。

好吧，我们还有剩余的估计时间，为什么我们不在等待 x 秒后发送请求呢？

让我们回到我们的`index.js`文件，首先添加三样东西—— `maxRetries` 属性、`retryCount` 属性和 `retry`属性：
```jsx
const Home = () => {
  // Don't retry more than 20 times
  const maxRetries = 20;
  const [input, setInput] = useState('');
  const [img, setImg] = useState('');
  // Numbers of retries 
  const [retry, setRetry] = useState(0);
  // Number of retries left
  const [retryCount, setRetryCount] = useState(maxRetries);
  // rest of code
}

export default Home;
```

好的，这里介绍了很多新属性——但让我解释一下。 我们知道，当我们收到一个`503`时，我们会得到模型加载之前的时间（以秒为单位）。 这个数字可以改变，所以让我们确保在状态属性`retry`中设置它。

我们可以使用该属性设置一个计时器来等待 x 秒，但有时模型可能需要长达 10 分钟才能加载到内存中（像这样的免费实例的警告之一）我们不想保留 向此端点发送垃圾邮件 10 分钟。

这就是 `maxRetries` 的用武之地。尝试 20 次后，让我们在控制台中发送一条消息说：“嘿，你只需要等待更长的时间来加载这个东西，然后再尝试发出请求”。

最后，我们通过 `retryCount` 属性控制剩余的重试次数！ 每次请求后，我们都会倒数那个数字。

现在我们已经控制住了它，让我们在`index.js`中的`generateAction`函数中添加一些代码：
```jsx
const generateAction = async () => {
    console.log('Generating...');

    // If this is a retry request, take away retryCount
    if (retry > 0) {
      setRetryCount((prevState) => {
        if (prevState === 0) {
          return 0;
        } else {
          return prevState - 1;
        }
      });

      setRetry(0);
    }

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'image/jpeg',
      },
      body: JSON.stringify({ input }),
    });

    const data = await response.json();

    if (response.status === 503) {
      // Set the estimated_time property in state
      setRetry(data.estimated_time);
      return;
    }

    if (!response.ok) {
      console.log(`Error: ${data.error}`);
      return;
    }

    setImg(data.image);
  };
```

在最顶部，您会注意到我们检查重试次数是否大于 0。如果是，请将我们的 `retryCount` 减一，因为我们将要再次调用 Inference API。 然后我们将 `retry` 设置回 0。

然后您会注意到我们将 `retry` 属性设置为 `estimated_time` 的值。 现在我们知道我们应该等多久才能再次提出这个请求！

好酷！ 现在问题变成了，我们实际上在哪里调用这个重试？ 如果有重试，我们所做的就是处理它。

为此，我们将使用 React `useEffect`。 我们想要发生的是在“重试”属性更改时触发重试。 `useEffect` 非常适合这个，因为它会在某个属性更改时运行一些代码（就像 `retry` 一样）。

首先在 `index.js`的顶部导入 `useEffect`  ：
```jsx
// Add useEffect here
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';

const Home = () => {...}

export default Home
```


现在，在我们的渲染函数之上，我们将添加：
```jsx
const Home = () => {
	const maxRetries = 20;
  const [input, setInput] = useState('');
  const [img, setImg] = useState('');
  const [retry, setRetry] = useState(0);
  const [retryCount, setRetryCount] = useState(maxRetries);
  const onChange = (event) => {
    setInput(event.target.value);
  };
  
  const generateAction = async () => {...}
  
  // Add useEffect here
  useEffect(() => {
    const runRetry = async () => {
      if (retryCount === 0) {
        console.log(`Model still loading after ${maxRetries} retries. Try request again in 5 minutes.`);
        setRetryCount(maxRetries);
        return;
        }

      console.log(`Trying again in ${retry} seconds.`);

      await sleep(retry * 1000);

      await generateAction();
    };

    if (retry === 0) {
      return;
    }

    runRetry();
  }, [retry]);
	
  return (
    // rest of code
    );
};
```

好吧，这可能看起来很混乱，但我明白了——检查一下：
```jsx
if (retryCount === 0) {
  console.log(
    `Model still loading after ${maxRetries} retries. Try request again in 5 minutes.`
  );
  setRetryCount(maxRetries);
  return;
}
```

你会在另一个函数中看到这个函数吗？ 太古怪了，哈哈。

不要太担心为什么会在这里，但基本上我们需要在`useEffect`中运行一个 `async` 函数，我们就是这样做的！

这个功能是它的核心。 在这里，我们首先检查 `retryCount` 是否为 0，如果是，我们不再运行请求。 很简单！
```jsx
console.log(`Trying again in ${retry} seconds.`);

await sleep(retry * 1000);
```


如果我们还有一些重试，我们需要等待 `retry` 次数。 这就是 `sleep` 函数的用武之地！ 您可能已经注意到我们从未定义过它，所以让我们将其添加到我们的`useEffect`之上，如下所示：
```jsx
const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
```

我们正在使用`setTimeout`的奇特实现，以允许它“sleep”或“wait”直到它继续运行！ Promise 是 Javascript 中的一些乱七八糟的东西 — [在这里深入了解它们](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 如果您有兴趣！
```jsx
await generateAction();
```

最后，如果我们准备好摇滚——调用 `generateAction` ！ 这将贯穿我们在该函数中编写的初始检查:)。

在这个 `useEffect`中还有几点需要注意：
```jsx
if (retry === 0) {
  return;
}

runRetry();
```


我们希望在 `retry` 属性更改时实际运行 `runRetry`。 我们唯一需要验证的是 `retry` 是否为 0，因为该属性是用 0 初始化的。

因此，如果我们快速退后一步，这就是刚刚发生的事情：

- 我们编写了 `generate` API 并在收到 `503` 时进行捕获
- 如果我们收到 `503`，那就是通过设置 `retry` 属性在 x 秒后重试请求
- 一旦设置了 `retry`，检查我们是否达到了 `maxRetries` 如果没有，在 x 秒后运行请求

这是一些高级网络开发的东西，所以在运行这个东西之前给自己一个巨大的五分。 这里发生了很多事情，而你刚刚构建了它——**好狗屎**。

好吧，让我们继续在我们的网络浏览器中打开我们的控制台并尝试再次运行提示：

![https://hackmd.io/_uploads/B1DMc6Vqo.png](https://hackmd.io/_uploads/B1DMc6Vqo.png)

天啊——你在重试，太疯狂了！ 现在这将继续下去，直到您收到图像响应🤘

在运行此程序时，您可能会注意到 UI 感觉 **SUPER** 怪异。 你知道是否发生了什么事情的唯一方法是打开控制台，哈哈。 你不会告诉你妈妈在她的浏览器上打开控制台吧？ 让我们通过添加加载指示器来解决这个问题！

首先创建一个名为 `isGenerating`的新状态属性，我们已在其中声明了所有其他状态：
```jsx
const maxRetries = 20;
const [input, setInput] = useState('');
const [img, setImg] = useState('');
const [retry, setRetry] = useState(0);
const [retryCount, setRetryCount] = useState(maxRetries);
// Add isGenerating state
const [isGenerating, setIsGenerating] = useState(false);
```

然后前往 `generateAction` 函数并将它们添加到以下几个位置：

```jsx
const generateAction = async () => {
  console.log('Generating...');

  // Add this check to make sure there is no double click
  if (isGenerating && retry === 0) return;

  // Set loading has started
  setIsGenerating(true);

  if (retry > 0) {
    setRetryCount((prevState) => {
      if (prevState === 0) {
        return 0;
      } else {
        return prevState - 1;
      }
    });

    setRetry(0);
  }

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'image/jpeg',
    },
    body: JSON.stringify({ input }),
  });

  const data = await response.json();

  if (response.status === 503) {
    setRetry(data.estimated_time);
    return;
  }

  if (!response.ok) {
    console.log(`Error: ${data.error}`);
    // Stop loading
    setIsGenerating(false);
    return;
  }

  setImg(data.image);
  // Everything is all done -- stop loading!
  setIsGenerating(false);
};
```


你看这里有四个不同的点我们要使用这个状态。 现在我们正在更改此属性，让我们对其进行一些操作。 前往您的渲染函数并转到 `prompt-buttons` div 并添加以下内容：
```jsx
<div className="prompt-container">
  <input className="prompt-box" value={input} onChange={onChange} />
  <div className="prompt-buttons">
    {/* Tweak classNames to change classes */}
    <a
      className={
        isGenerating ? 'generate-button loading' : 'generate-button'
      }
      onClick={generateAction}
    >
      {/* Tweak to show a loading indicator */}
      <div className="generate">
        {isGenerating ? (
          <span className="loader"></span>
        ) : (
          <p>Generate</p>
        )}
      </div>
    </a>
  </div>
</div>
```



这个加载指示器周围的很多 CSS 都位于 `styles/styles.css` 中，因此请务必检查并更改它以适应您的流程 + 氛围。

现在我们有一个加载指示器集，让我们再试一次——输入另一个提示并让它撕裂：

![https://hackmd.io/_uploads/rJ27cpE9i.png](https://hackmd.io/_uploads/rJ27cpE9i.png)

Yooo loading indicator 工作正常！ 疯了。

**哇**。 我知道这篇文章很长，但请给自己一些荣誉。 你被扔进了这个项目中最困难的部分之一

### 请这样做，否则 Raza 会很难过。
这是一个非常兴奋的时刻。 前往 discord 中的`#progress`频道，并截取您正在运行的网络应用程序的屏幕截图！ 如果您看到其他人，也请给他们一些反馈 :)。你也可以发推特并`@bitcoinmaobuyi` 如果你想捐赠我们可以通过下面这个以太坊的地址：0x45ca2696d9a4f762c7a51a22a230797700e28794
这会让我们更有动力。