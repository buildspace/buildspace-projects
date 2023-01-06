

那么，现在我们需要调用 OpenAI API！

我们不能只从我们的前端调用它，因为那样的话**我们会向用户公开我们的 API 密钥。**任何人都可以打开检查选项卡并轻松拿走我们的密钥。 而且，我们不想这样做，因为如果我们这样做，那么任何人都可以滥用我们的 API 密钥并导致我们花费大量金钱。

但请记住——现在我们仍在使用 OpenAI 最初给我们的 18 美元信用额度。 但即便如此，我们也不希望任何人拿走我们的 API 密钥并浪费我们所有的积分！ 同样，您可以在 [此处](https://beta.openai.com/account/usage) 查看您的使用情况。

因此，我们需要做的是设置一个后端来安全地调用 OpenAI。 然后，我们的前端会调用我们的后端函数——这样我们的用户将永远无法访问我们的 API 密钥。

通常，设置服务器是一件非常痛苦的事情。

但是，我们现在实际上正在使用一种叫做 NextJS 的东西——它是 React 的一个框架。 它使 ** 真正*** 易于设置 *后端* *无服务器* *功能*。 这些是按需在云端运行的功能，因此，我们不需要维护自己的服务器。 问题解决了。

真的很简单，让我们开始吧！

### 添加 API 端点

我们将创建一个新的无服务器函数供我们的前端使用。 让我向您展示使用 NextJS 是多么容易。

在 `pages` 文件夹中创建一个名为 `api` 的新文件夹。 在 `api` 目录中，创建一个名为 `generate.js` 的文件。 在创建文件的位置或命名时要小心——NextJS 根据文件名 + 文件路径做了很多魔术。

![Untitled](https://i.imgur.com/PdkI939.png)



在 api/generate.js 中，我们将编写后端代码来调用 OpenAI！

继续并添加以下内容：

```jsx
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
```



这非常简单，我们使用 OpenAI JS 库轻松设置 API。 但是你会在这里看到我们需要一个 `process.env.OPENAI_API_KEY`。 这将来自我们的`.env`文件，该文件包含您不想意外推送到 GitHub 的任何秘密信息。

*注意：您可以直接在此处复制并粘贴您的 API 密钥，但是，当它转到 GitHub 时，任何人都可以看到它！*

因此，继续在项目的根目录中创建一个名为`.env` 的文件。 在它里面你需要的是：
```jsx
OPENAI_API_KEY=INSERT_YOUR_API_KEY_HERE
```



[此处](https://beta.openai.com/account/api-keys) 生成您的 API 密钥并将其粘贴进去。您 *** 不*** *** 需要格式化 `.env` 文件，只需按原样粘贴，不带引号或空格，如上所示！

这是我这边的样子：

![Untitled](https://i.imgur.com/A0BsiHa.png)



**注意：您可能需要重新启动终端并再次执行“yarn dev”。 有时，如果不重启，我们的前端将无法获取 `.env` 文件。*

太棒了，现在让我们完成 `generate.js` 来实际调用 OpenAI API。 在 `const openai` 行下添加以下代码：
```jsx
const basePromptPrefix = "";
const generateAction = async (req, res) => {
  // Run first prompt
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.7,
    max_tokens: 250,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  res.status(200).json({ output: basePromptOutput });
};

export default generateAction;
```


砰的一声，我们完成了。 我们创建了一个无服务器的后端函数，可以安全地调用 OpenAI。 让我们把这个分解一下：

首先，我们使用 `createCompletion` 端点，您可以在[此处](https://beta.openai.com/docs/api-reference/completions/create) 查看它。 它有 *** 很多*** 参数。 我们需要给它的4个最重要的参数是：

- `model`——我们要使用的模型类型。 截至目前，“text-davinci-003”是最先进的模型。 您可以[在此处](https://beta.openai.com/docs/models/gpt-3) 探索其他模型。
- `prompt` — 这是我们传递的提示符，就像我们在 Playground 中所做的那样。 在这种情况下，我们传递给它现在是一个空字符串的`basePromptPrefix`（我们稍后会用到它）和`req.body.userInput`，它将是用户在前端的`textarea`中输入的输入 我们发送给这个 API 函数。
- `temperature` — 我们已经从 Playground 了解到这件事。 您可以稍后根据您的用例使用它。
- `max_tokens` — 我现在将其设置为 `250`，总共大约 1,000 个字符。 如果你要处理更长的提示 + 更长的输出，你可以稍后增加这个数字。 但出于测试目的，最好将其保持在较低水平。 我以后肯定会增加这个，因为我想要为自己生成更长的博客文章。

信不信由你，这个函数已经准备好从我们的前端调用了。 这就是 NextJS 的神奇之处——它为我们完成了设置无服务器后端的艰巨工作。

### 连接魔术按钮。

让我们连接我们的“生成”按钮来调用我们新奇的 API。

将以下代码放在*下方*，只要您有 `const [userInput, setUserInput]`。

```jsx
const [apiOutput, setApiOutput] = useState('')
const [isGenerating, setIsGenerating] = useState(false)

const callGenerateEndpoint = async () => {
  setIsGenerating(true);
  
  console.log("Calling OpenAI...")
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userInput }),
  });

  const data = await response.json();
  const { output } = data;
  console.log("OpenAI replied...", output.text)

  setApiOutput(`${output.text}`);
  setIsGenerating(false);
}
```



这里没什么太疯狂的。

首先，我为 `isGenerating` 创建了一个状态变量。 这将使我们稍后轻松创建加载状态，以便我们可以告诉我们的用户等待 OpenAI API 回复。 然后，我创建 `apiOutput` — 这将是我们讲述要向用户展示的 API 输出的地方。

接下来，我们跳转到 `callGenerateEndpoint`。 总结：

- 我调用  `setIsGenerating(true)` 将加载状态设置为`true`。 在函数的底部，我执行了`setIsGenerating(false)`，因为那时我们已经完成了 API 的使用，可以将加载状态设置为`false`。
- 我对我们的 API 做了一个简单的 `fetch` — 注意我使用的路径：`/api/generate`。 NextJS 会根据我们的目录结构自动为我们创建这条路由：`api/generate.js`。 非常酷！
- 从那里，我通过执行 `await response.json()` 将响应转换为 JSON，然后提取 `output`。 ***注意：我正在使用 [object destructing ](https://www.javascripttutorial.net/es6/javascript-object-destructuring/) 在这里。*
- 最后，我使用 `setApiOutput` 将 `apiOutput` 实际设置为 GPT-3 输出的实际文本。

要全面测试，请通过执行以下操作将 `callGenerateEndpoint` 添加到“生成”按钮的 `onClick` 事件中：

```jsx
<a className="generate-button" onClick={callGenerateEndpoint}>
  <div className="generate">
    <p>Generate</p>
  </div>
</a>
```



现在，继续在你的  `textarea` 中输入一些东西来测试，点击生成，你应该在控制台中看到一个响应，如下所示：

![Untitled](https://i.imgur.com/QFkmaEs.png)



***注意：OpenAI 的 API 有时可能会很慢。***

### 将 GPT-3 的输出添加到我们的 UI。

让我们在 UI 上显示输出。 我们已经在`apiOutput`中有了输出，但我们只需要显示它！ 这是这样做的代码：

```jsx
<div className="prompt-container">
  <textarea
    placeholder="start typing here"
    className="prompt-box"
    value={userInput}
    onChange={onUserChangedText}
  />
  <div className="prompt-buttons">
    <a className="generate-button" onClick={callGenerateEndpoint}>
      <div className="generate">
        <p>Generate</p>
      </div>
    </a>
  </div>
  {/* New code I added here */}
  {apiOutput && (
  <div className="output">
    <div className="output-header-container">
      <div className="output-header">
        <h3>Output</h3>
      </div>
    </div>
    <div className="output-content">
      <p>{apiOutput}</p>
    </div>
  </div>
)}
</div>
```



没什么特别的，我只是在带有 CSS 类 `output-content` 的 `div` 中使用 `{apiOutput}` 来显示输出。 随时检查 `styles.css` 中的 CSS，如果需要，您可以更改周围的内容。

这是我测试时的样子。
![Untitled](https://i.imgur.com/sz7Dda7.png)



该死的，看到 Elon 对 Tesla 的发展方向不满意真是太糟糕了。 希望他能弄明白，哈哈。 *注意：你的间距可能看起来和我的不一样，这取决于 GPT-3 是否基本上输出一个新行。*

### 添加一个简单的加载状态。

一个 eeeeee 更多的东西要添加得非常快——加载状态！ 我们已经将加载状态保存在 `isGenerating`  中，如果我们正在等待 API，则为 `true`，否则为`false`。

我们需要做的就是展示它！ 这是代码：

```jsx
<div className="prompt-buttons">
  <a
    className={isGenerating ? 'generate-button loading' : 'generate-button'}
    onClick={callGenerateEndpoint}
  >
    <div className="generate">
    {isGenerating ? <span class="loader"></span> : <p>Generate</p>}
    </div>
  </a>
</div>
```


我实际上在这里使用了一些花哨的东西。 您看到我做的第一件事是根据 `isGenerating` 的值更改 `className`。 如果你从未见过 `? :` 语法，称为 [三元运算符](https://www.javascripttutorial.net/javascript-ternary-operator/)。 它的工作原理是这样的：

```jsx
ifThingThingIsTrue ? thenDoThis : elseDoThis
```



它基本上是一个更简洁的 `if` + `else`。

因此，如果 `isGenerating` 为真，我们将使用 `generate-button loading`类来降低按钮的不透明度。 如果它是假的，我们将使用普通的 `generate-button` 类来保持它的美观和明亮。

我在那之下使用相同的逻辑。

如果 `isGenerating` 为真，我们将显示一个加载动画，如果为假，我们只显示“生成”一词！ 很简单 加载状态应该是这样的：

![Untitled](https://i.imgur.com/2zYhvhJ.png)


### 请这样做，否则 Farza 会很难过。

继续并截取带有一些输出的干净简单的 Web 应用程序的屏幕截图，并将其发布在#progress 中！ 到目前为止做得很好。 大多数人都会停下来或分心，但你一直保持专注。 我们继续吧。 我们仍然需要脱离本地主机！