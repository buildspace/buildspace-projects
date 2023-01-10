我们来到这里的结束部分！ 我们设置了一些 UI，称为我们的推理 API，并在我们的模型加载时处理场景。 我想是时候在 UI 中实际显示此图像了，嗯？

让我们从在我们的渲染函数中添加一些 UI 元素开始，如下所示：
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
      <div className="prompt-container">
        <input className="prompt-box" value={input} onChange={onChange} />
        <div className="prompt-buttons">
          <a
            className={
              isGenerating ? 'generate-button loading' : 'generate-button'
            }
            onClick={generateAction}
          >
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
    </div>
    {/* Add output container */}
    {img && (
      <div className="output-content">
        <Image src={img} width={512} height={512} alt={input} />
      </div>
    )}
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


靠近底部，您会看到一些逻辑，“如果 `img`属性中有内容，则显示此图像”。

Amazinggg，现在如果我们让它更酷一点呢？ 当我们按下生成时，让我们从输入框中删除提示并将其显示在我们在 UI 中显示的图像下方！

为此，请继续并在此处创建另一个名为`finalPrompt`的状态属性：
```jsx
const maxRetries = 20;
const [input, setInput] = useState('');
const [img, setImg] = useState('');
const [retry, setRetry] = useState(0);
const [retryCount, setRetryCount] = useState(maxRetries);
const [isGenerating, setIsGenerating] = useState(false);
// Add new state here
const [finalPrompt, setFinalPrompt] = useState('');
```

现在我们已经知道了 `generateAction` 函数并将这一行添加到底部：
```jsx
const generateAction = async () => {
    console.log('Generating...');

    if (isGenerating && retry === 0) return;

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
      setIsGenerating(false);
      return;
    }

    // Set final prompt here
    setFinalPrompt(input);
    // Remove content from input box
    setInput('');
    setImg(data.image);
    setIsGenerating(false);
  };
```


我们获取输入并将其设置为新属性，然后最终将其从当前输入中删除。

完成后，我们还有一件事情要做——展示它！ 前往您声明要显示图像的位置并添加以下内容：
```jsx
{img && (
  <div className="output-content">
    <Image src={img} width={512} height={512} alt={finalPrompt} />
    {/* Add prompt here */}
    <p>{finalPrompt}</p>
  </div>
)}
```

我们已经准备好展示一些图片，非常疯狂的炒作 ngl。 让我们去运行一个提示，看看我们的图像的所有荣耀：

![https://hackmd.io/_uploads/rk_NcaVci.png](https://hackmd.io/_uploads/rk_NcaVci.png)

等等……卧槽？ 此图像已损坏 AF 大声笑。

实际上，为了让它正常工作，我们还需要做一件事。 如果您还记得我们的 API，我们会向前端返回一个`buffer`。 那么，为了显示图像，我们需要将该`buffer`转换为`base64`字符串。 这是我们的前端理解图像的唯一方法！

为此，让我们回到 `generate.js`，我们将创建一个名为 `bufferToBase64` 的新函数：

```jsx
const bufferToBase64 = (buffer) => {
  const base64 = buffer.toString('base64');
  return `data:image/png;base64,${base64}`;
};
```



这是一个超级简单的函数，它接受一个`buffer`并向它添加一些图像装饰器，这样我们的 UI 就会知道它是一个图像！

现在在我们的 `generateAction` 中获取该函数，并将该函数添加到 `ok` 响应中：
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

  if (response.ok) {
    const buffer = await response.buffer();
    // Convert to base64
    const base64 = bufferToBase64(buffer);
    // Make sure to change to base64
    res.status(200).json({ image: base64 });
  } else if (response.status === 503) {
    const json = await response.json();
    res.status(503).json(json);
  } else {
    const json = await response.json();
    res.status(response.status).json({ error: response.statusText });
  }
};
```

**好的** — 现在这将起作用（我保证呵呵）。 再运行一次，看看你的网络应用程序的所有荣耀都形成了🥲。

![https://hackmd.io/_uploads/ByhHqTVci.png](https://hackmd.io/_uploads/ByhHqTVci.png)

花点时间回顾一下你最近所做的几件事。 您可能对训练模型的了解为 0，而您现在已经正式训练了您自己的模型（说实话，相当疯狂）。

您现在可以使用该站点并使其变得更好。 您甚至可以开始从中获利！

我想在下一节中为您提供更多想法，以提升当前页面的水平。