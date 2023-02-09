

### 构建你的第一个 service worker

现在开始有趣的事情——实际使用我们的扩展来调用 OpenAI。 我们调用 OpenAI 的方式与我们的网站略有不同。 在我们的网站上，我们有一些文本输入，它采用您输入的文本并调用我们为调用 OpenAI 而创建的特定 API 端点。 我们甚至使用了一个花哨的节点模块来调用它。 这次我们将做一些不同的事情。

目标是在我们的浏览器中突出显示文本，右键单击它，然后看到一个选项“生成博客文章”。 无论我们从 GPT-3 获得什么，我们都将直接注入我们的网站🙂。

**再次为我的扩展，我将与 [Calmly](https://www.calmlywriter.com/online/) 合作**。我建议您跟随 w/ Calmly。 之后，您将能够对要在其上生成文本的任何网站使用相同的流程。

为了让这一切正常工作，我们需要设置一个叫做 service worker 的东西。 您可以将其视为应用程序的服务器设置。 我们可以让我们的 UI 做一些事情，而我们的 service worker 在后台做所有的事情，而不是让我们所有的代码都在我们的 UI 中运行！

对于我们来说，我们需要去到 GPT-3，获取我们的完成结果并将其发送到 UI 以注入 Calmly 网络浏览器选项卡！ 中间会有几个步骤，但是唉，让我们从创建文件开始吧。

继续并创建一个 `scripts/contextMenuServiceWorker.js` 目录和文件。 我们要在这个文件中处理的第一件事是设置我们的 `contextMenu`！ 我们需要告诉我们的扩展程序哪个文件将用于我们的`service_worker.`。为此，让我们再次前往`manifest.json`文件并添加以下内容：
```json
{
  "name": "magic blog post generator",
  "description": "highlight your blog post title, we'll generate the rest",
  "version": "1.0",
  "manifest_version": 3,
  "icons": {
    "48": "assets/48.png",
    "72": "assets/72.png",
    "96": "assets/96.png",
    "144": "assets/144.png"
  },
  "action": {
    "default_popup": "index.html",
    "default_title": "Generate blog post"
  },
  // Add this thing here
  "background": {
    "service_worker": "scripts/contextMenuServiceWorker.js"
  },
  "permissions": ["contextMenus", "tabs", "storage"]
}
```



现在我们的扩展知道我们的 service worker，我们可以开始为我们的 `contextMenu` 项目编写逻辑了！

请记住，我们想要在 Calmly 中突出显示一些文本，右键单击它，然后能够选择一个选项“生成博客文章”。 看看这有多简单：

```javascript
// Add this in scripts/contextMenuServiceWorker.js
chrome.contextMenus.create({
  id: 'context-run',
  title: 'Generate blog post',
  contexts: ['selection'],
});

// Add listener
chrome.contextMenus.onClicked.addListener(generateCompletionAction);
```



很好，所以我们正在我们的菜单中创建一个新选项，该选项将显示为“生成博客文章”。 然后我们设置一个监听器，每当它被点击时调用这个叫做 `generateCompletionAction` 的东西。

让我们继续在我们设置监听器的上方创建它，然后我们可以查看我们的 `contextMenu`：

```javascript
// New function here
const generateCompletionAction = async (info) => {}

// Don't touch this
chrome.contextMenus.create({
  id: 'context-run',
  title: 'Generate blog post',
  contexts: ['selection'],
});

chrome.contextMenus.onClicked.addListener(generateCompletionAction);
```



**不错**。 不要忘记返回您的分机并按下重新加载按钮，否则您将看不到您的分机中应用的任何新代码！

让我们进入 Calmly 并开始写作🤘。 一旦你写下了一些东西，突出显示文本，右键单击它，然后检查一下：

![Untitled](https://i.imgur.com/YeT4PPn.png)


**WOAH** - 太恶心了。 疯狂这是多么容易对吗？ 这是我之前谈到的一些“幕后”内容 + 构建 Chrome 扩展程序的好处之一 :)。

正确——让这个选择做一些史诗般的事情。 我们将从捕获选择文本开始，并准备好为 GPT-3 打包！ 让我们首先将其添加到 `generateCompleteAction` 函数中：
```javascript
const generateCompletionAction = async (info) => {
  try {
    const { selectionText } = info;
    const basePromptPrefix = `
	Write me a detailed table of contents for a blog post with the title below.

	Title:
	`;
  } catch (error) {
    console.log(error);
  }
};
```



开始非常简单，您应该看起来很熟悉。 首先要注意的是，每次调用 `generateCompletionAction` 时，我们的侦听器都会传递一个 `info` 对象。 这个 homie 中有我们的 `selectionText` 属性（这是您突出显示的）。

一旦我们完成设置，我们就可以从我们的基本提示开始。 您已经从您的网站上获得了作弊代码，因此请随时在这里再次使用它们！

好的，我们已经准备好调用 GPT-3。 让我们首先在 `generateCompletionAction` 附近声明一个名为 `generate` 的新函数。 一旦你这样做了，就在你的  `basePromptPrefix` 下面添加一行，它将调用我们的生成函数：
```jsx
// Setup our generate function
const generate = async (prompt) => {}

const generateCompletionAction = async (info) => {
	try {
    const { selectionText } = info;
    const basePromptPrefix =
      `
      Write me a detailed table of contents for a blog post with the title below.

      Title:
      `;

		// Add this to call GPT-3
    const baseCompletion = await generate(`${basePromptPrefix}${selectionText}`);

    // Let's see what we get!
    console.log(baseCompletion.text)	
  } catch (error) {
    console.log(error);
  }
};
```



`generate` 函数实际上会节省相当多的时间（你很快就会看到）。 这将是我们用来调用 GPT-3 API 的所有代码。 您会立即注意到这看起来与我们的着陆页调用有很大不同。 那是因为我们使用了 OpenAI 的一个包库，它为我们设置了很多样板代码。 我们正在以`vanilla Javascript`的方式来做这件事嘿嘿。

嘿 - 你正在进入一些引擎盖下，看看你！ 酷，让我们写这个东西：
```javascript
// Function to get + decode API key
const getKey = () => {}

const generate = async (prompt) => {
  // Get your API key from storage
  const key = await getKey();
  const url = 'https://api.openai.com/v1/completions';
	
  // Call completions endpoint
  const completionResponse = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 1250,
      temperature: 0.7,
    }),
  });
	
  // Select the top choice and send back
  const completion = await completionResponse.json();
  return completion.choices.pop();
}
```


仅此而已！ 这里有几点需要注意——

1. 我们需要知道 API 调用的 url 是 `[https://api.openai.com/v1/completions](https://api.openai.com/v1/completions)` 。 您可以通过查看此 API 的文档找到它 :)
2. `getKey` 函数！ 还记得我们存储在扩展状态中的密钥吗？ 我们很快就会将逻辑添加到其中，但它的名字是根据它的作用命名的，哈哈。
3. 我们必须确保我们正在发出一个 `POST` 请求 + 在标头对象中包括我们的授权！ 这都是 OpenAI API 需要说的，“哟，我希望这个调用看起来像什么，你有权访问这些数据！”
4. 最后，身体。 我们传递我们希望 GPT-3 使用的选项。 这应该看起来很熟悉，因为这与您通过他们的库调用 GPT-3 时输入的数据相同

此时（假设您有适当的 API 密钥）您应该能够像在登录页面中那样调用 GPT-3。 让我们快速实现我们的 `getKey` 函数，然后我们就可以顺利地交付这个东西了 🚢：

```javascript
const getKey = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['openai-key'], (result) => {
      if (result['openai-key']) {
        const decodedKey = atob(result['openai-key']);
        resolve(decodedKey);
      }
    });
  });
};
```



这应该看起来就像 `saveKey` 函数相反。

我认为现在是我们进行测试的时候了。 这是一个非常激动人心的时刻。 您将以此释放所有网站的无限潜力。 **这第一个电话意义重大。**

继续并在扩展页面中更新您的应用程序，然后冷静地或您正在使用的任何网站，让这件事 riiipppp。

等一下，你怎么知道有没有发生什么事？ 如果你在开发者设置中打开浏览器控制台，你会看到……什么都没有！

这是因为服务人员有 ***他们自己的*** *控制台*。 返回您的扩展程序菜单并单击服务工作者链接。 这将打开一个新的 DevTools 窗口 - 在这里您可以看到来自 service worker 🙂 的所有日志语句。

![Untitled](https://i.imgur.com/2RHaPDt.png)



好吧好吧，让我们再试一次：
![Screenshot 2022-11-27 at 5.35.16 AM.png](https://i.imgur.com/MGC5R0l.png)



我们现在正式从 Chrome 扩展程序调用 GPT-3，**天哪。**你在这里击中了三重奏——从操场、网络应用程序和 chrome 扩展程序调用 GPT-3。

现在我们有了第一个提示，让我们进行提示链接设置！ 请记住，提示链接是使您的扩展**真正**有价值的秘密武器。

还记得你之前写的 `generate` 函数吗？ 这是可以为您节省时间的时刻，哈哈。

回到您的 `generateCompletionAction` 并继续并添加最后几行：

```javascript
const generateCompletionAction = async (info) => {
  try {
    const { selectionText } = info;
    const basePromptPrefix = `
      Write me a detailed table of contents for a blog post with the title below.
			
      Title:
      `;

    const baseCompletion = await generate(
      `${basePromptPrefix}${selectionText}`
    );

    // Add your second prompt here
    const secondPrompt = `
      Take the table of contents and title of the blog post below and generate a blog post written in thwe style of Paul Graham. Make it feel like a story. Don't just list the points. Go deep into each one. Explain why.
      
      Title: ${selectionText}
      
      Table of Contents: ${baseCompletion.text}
      
      Blog Post:
      `;

    // Call your second prompt
    const secondPromptCompletion = await generate(secondPrompt);
  } catch (error) {
    console.log(error);
  }
};
```




LFG 就是这样——可重用的代码就是好的代码。 我们基本上做了与第一个提示完全相同的事情，但只是传递了第一个提示输出！

现在我们需要做的就是将其注入 Calmly。 这里只有一个问题——我们的 service worker 没有访问 DOM 的权限。 它无法操纵 UI……这就是这个扩展的全部意义所在，不是吗？

别担心——我们找到你了。

### 与 web 应用程序选项卡通信

首先，如果您不知道 DOM 是什么，请在 Google 上快速搜索以了解更多信息。 您的 UI 是任何网站中唯一可以访问此内容的部分，那是因为它需要对其进行操作和交互！

像你的 service worker 这样的东西对 DOM 是什么以及如何操作它一无所知。 就像服务器一样，它在自己的环境中运行代码，你的 DOM 无法访问它。

这就是**消息传递**发挥作用的地方！ 实际上，你可以通过发送一条消息在 service worker 和 DOM 之间进行通信，比如“嘿 DOM，我有一条消息要告诉你。 检查一下并用它做点什么”。

在我们的例子中，我们将从 GPT-3 获取输出并将其发送到我们的前端以注入 Calmly 的 DOM。

流程非常简单，但有助于查看布局。 比赛计划是：

1. 在我们的 service worker 中编写一个 messenger 来向我们的 UI 发送消息
2. 创建一个新文件，可以监听来自 service worker 的消息
3. 当我们发送某个消息时，扩展会向 DOM 中注入一个值

可以把它想象成去餐馆点菜。 您（客户）就是应用程序。 分机是服务员。 厨师无法与您交谈（假装他们被戈登·拉姆齐锁在厨房里）。 您向厨师发送订单，扩展程序将转交给厨师 GPT-3，并带回美味的 AI 生成的菜肴。

当你从更高的层面看它时，它实际上非常简单。 足够的聊天让我们构建。

回到你的 `contextMenuServiceWorker.js` 文件并在我们声明 `getKey` 的地方添加一个名为 `sendMessage` 的新函数
```javascript
const sendMessage = (content) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0].id;

    chrome.tabs.sendMessage(
      activeTab,
      { message: 'inject', content },
      (response) => {
        if (response.status === 'failed') {
          console.log('injection failed.');
        }
      }
    );
  });
};
```



这段代码做了几件事——

1. 首先，我们要查找当前处于活动状态的选项卡。 为了发送消息，我们需要在活动选项卡中进行
2. 然后我们使用 chrome 提供的一个奇特的 `sendMessage` 函数。 这需要 3 个东西——`tab`、`payload` 和 `callback`。 我们的有效负载将包含一条名为 `inject`的消息以及我们传入的任何内容
3. 最后，我们的消息会回复一个状态，让我们知道事情进展顺利🤘

好样的！ 所以现在我们有了这个，让我们开始删除一些消息。 我们将在这里添加一些不同的类型：

1. 当我们开始生成完成时的消息
2. 当我们准备发送最终输出时的消息
3. 出现错误时的消息，以便用户可以看到它是什么

继续前往 `generateCompletionAction` 函数并添加以下行：

```jsx
const generateCompletionAction = async (info) => {
  try {
    // Send mesage with generating text (this will be like a loading indicator)
    sendMessage('generating...');

    const { selectionText } = info;
    const basePromptPrefix = `
      Write me a detailed table of contents for a blog post with the title below.
      
      Title:
      `;

      const baseCompletion = await generate(
        `${basePromptPrefix}${selectionText}`
      );
      
      const secondPrompt = `
        Take the table of contents and title of the blog post below and generate a blog post written in thwe style of Paul Graham. Make it feel like a story. Don't just list the points. Go deep into each one. Explain why.
        
        Title: ${selectionText}
        
        Table of Contents: ${baseCompletion.text}
        
        Blog Post:
		  `;
      
      const secondPromptCompletion = await generate(secondPrompt);
      
      // Send the output when we're all done
      sendMessage(secondPromptCompletion.text);
  } catch (error) {
    console.log(error);

    // Add this here as well to see if we run into any errors!
    sendMessage(error.toString());
  }
};
```



好吧好吧 **我们现在到了某个地方**。

所以我们正在发送消息，但我们没有收到任何消息。 这就像你在森林里用尽肺尖尖叫，但没有人在听 😟。

因为我们希望我们的 UI 接收消息，所以我们应该在那里设置一个监听器。 为了让我们做到这一点，我们需要在 UI 端创建一个文件来为我们处理脚本。 这就是 `content.js` 文件的用武之地。

### 请这样做，否则 Farza 会很难过。

在 #progress 中发布您在 Service Worker 控制台中从 OpenAI 获得的输出。 这东西很高级，好东西:)！