[https://vimeo.com/775481289](https://vimeo.com/775481289)



此时你可能已经埋头于你的代码中了。 微调您的模型，使您的网站看起来更简洁，更贴近您的想法。 但我希望你花一点时间退后一步，看看你从哪里开始，你现在在哪里，以及你要去哪里。

您可能刚刚听说过这个 GPT-3 的东西，或者已经对它感兴趣了一段时间，无论哪种方式，您都是通过在这个叫做 OpenAi playground 的东西上玩弄它开始的。 您学到了一些史诗般的知识，例如提示链接以及如何训练/使您的模型变得更好。

你利用了所有这些并建立了一个网站，任何人都可以继续使用你的自定义 AI。 你刚刚为人们提供了一种通过你自己的想法 + 网站访问 GPT-3 的方法，这真是史诗般的。

**现在** — 我们想带您更进一步，展示如何通过 chrome 扩展在互联网上的任何地方使用 GPT-3。

### 我们在建造什么？

建立一个人们可以在封闭环境中使用 GPT-3 的网站很酷，但是如果您可以在网络上的任何地方利用 GPT-3 的力量呢？ 正如我们所见，当 GPT-3 具有上下文和一堆可以使用的东西时，它会更强大——这就是提示链接的全部意义所在。

我们将通过构建一个 Chrome 浏览器扩展程序来实现这一点，该扩展程序允许我们将 GPT-3 响应注入在线文本编写器，这很像 OpenAI 游乐场。 我将继续我为该网站构建的博文作者想法，您也应该继续扩展您的想法！

### 为什么要构建扩展？

浏览器扩展被严重忽视。 它们基本上是修改互联网部分的简单方法，可以制作 **疯狂的*** 产品。 就在最近，PayPal 以 40 亿美元的价格收购了 Honey，这是一个浏览器扩展程序，可以在在线结账时添加优惠券🤯。

通过将浏览器扩展的多功能性与 GPT-3 拥有的庞大大脑相结合，您可以使用互联网上的任何东西来生成内容。 想象一下像 [Blackmagic](https://blackmagic.so/) 这样的扩展程序可以生成对推文的回复，哈哈。

这里的一个重要背景是，您需要将扩展重点放在**一个** 区域或网站上。 想想 Grammarly——它适用于`textarea`组件。 密码管理器只能使用`password`输入。 我将在一个网站上向您展示作弊代码，然后由您自行决定并构建您的疯狂想法:)。

### 扩展的工作原理

浏览器扩展非常简单——它们使用与您制作网站相同的材料制成：**HTML**、**CSS** 和 **JS**。 您可以将扩展程序想象成一个封闭的 Web 应用程序，它具有“幕后”功能，可以在 Chrome 中隐藏常规网站通常无法访问的内容！

我们要处理的三个主要部分是：

1. **弹出式 UI** - 使用纯 HTML/CSS 构建，这是用户单击扩展图标时看到的内容
2. **内容脚本** - 处理我们的扩展逻辑的 JS 文件，包括我们的弹出式 UI 的逻辑
3. **Service Worker** - 也是一个 JS 文件，这就像我们的服务器：它被加载以在需要时在后台处理任务，完成后它会空闲

![Untitled](https://i.imgur.com/qhkATwy.png)



如果您更直观，这里有一张方便的架构图，来自 [Chrome 文档](https://developer.chrome.com/docs/extensions/mv3/architecture-overview/)。

与大多数扩展一样，我们的扩展将从浏览器获取数据，对其进行一些处理，然后将响应注入 UI（我们所在的选项卡）。

**让我们开始吧！**

### 开始

通过克隆 [this repo](https://github.com/buildspace/gpt3-writer-extension-starter/tree/starter) 开始构建您的 $5b 浏览器扩展。 这里没有构建或设置步骤，文件就是您开始所需的全部。 由于这是基于 Chromium 的，它可以在几乎所有流行的浏览器上运行——Google Chrome（笑）、Brave 甚至 Microsoft Edge（我的 Edge 朋友都在其中）。

除了一些资产和 `manifest.json` 文件外，这里什么都没有。 `manifest.json` 文件有一堆元数据——它告诉浏览器扩展名为什么，它需要哪些资产，它运行需要什么权限，并标识要在后台和页面上运行的文件。

### 构建 manifest.json 文件

此扩展的目标是让您以当前的想法为基础。 例如，如果您正在创建博客文章生成器并且一直使用 Substack，则可以构建此扩展以与 Substack 一起使用，并将 GPT-3 生成的文本**直接**插入 Substack 的文本编辑器中。 它非常强大，您即将解锁这种新的力量。

我将继续构建我的神奇博客帖子生成器，并将其注入一个名为 [Calmly](https://www.calmlywriter.com/online/) 的网站。 这是一个我一直使用的文本编辑器。 再次 - **你可以在这里转轴。** 如果你对 GPT-3 能做什么有一个绝妙的想法 在特定的网站/应用程序上，去争取它。

但是——我将在此处向您展示的注入 Calmly 的策略可以在网络上的任何网站上使用——Reddit、Notion、Twitter，等等。

这是我们在 `manifest.json` 中为您提供的基本内容——现在是时候根据您的应用创意对其进行更改了：

```json
{
  // Change to your title
  "name": "magic blog post generator",
  // Change to your description
  "description": "highlight your blog post title, we'll generate the rest",
  "version": "1.0",
  "manifest_version": 3,
  // Update these assets in the folder
  "icons": {
    "48": "assets/48.png",
    "72": "assets/72.png",
    "96": "assets/96.png",
    "144": "assets/144.png"
  },
  "action": {
    "default_popup": "index.html",
    // Change the default title
    "default_title": "Generate blog post"
  }
}
```



如果你复制粘贴这个你需要删除评论顺便说一句：P

由于扩展程序完全可以成为在您的浏览器中运行的恶意软件，因此安全性对它们来说是一个大问题。 您需要明确声明您的扩展程序需要哪些权限。 确保添加这一行，稍后我们将解释：

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
  // Add this line
  "permissions": ["contextMenus", "tabs", "storage"]
}
```



### 为你的扩展创建一个 UI

我们的扩展将有一个超级基本的 UI。 此 UI 将用于输入我们的 OpenAI API 密钥。 你将需要这个，因为：

1. 你需要一个API密钥来调用GPT-3
2. 我们不只是想硬编码，所以我们要求用户提供
3. 我们希望它存储在扩展存储中，只能由计算机上的人访问

查看您的 `manifest.json` 文件并找到 `default_popup` 操作。 这是我们将创建的文件，用于在打开时显示在我们的扩展中！

在项目的根目录下创建一个新文件，名为 `index.html`

```html
<html>
    <head>
        <link rel="stylesheet" href="index.css">
    </head>
    <body>
        <div id="key_needed">
            <p>To get started, add your OpenAI API Key!</p>
            <input id="key_input" />
            <button id="save_key_button">Add key</button>
        </div>
        <div id="key_entered">
           <p>You entered your OpenAI API Key.</p>
           <button id="change_key_button">Change key</button>
        </div>
    </body>
    <script src="index.js"></script>
</html>
```



超级简单，只是一些导入和类。 当存储中有键时，我们将隐藏 `key_entered` 部分，否则我们将显示输入字段页面。

让我们继续使用 CSS 对所有这些进行样式设置。 首先，我们需要在项目的根目录下创建一个`index.css`  文件并设置它：

```css
body {
    min-width: 250px;
}

#key_entered {
    display: none;
}
```



同样，超级基本。 只需以 `key_entered` 作为隐藏的 `div` 开始，我们将使用 Javascript 来更改该属性。 这将引导我们找到也在 html 页面上导入的 `index.js` 文件。 继续并在此目录的根目录下创建一个 `index.js` 文件！

我们将从编写一些侦听器开始，当有人点击按钮我们就会知道！

```javascript
document.getElementById('save_key_button').addEventListener('click', saveKey);
document
  .getElementById('change_key_button')
  .addEventListener('click', changeKey);
```



你可以看到我们正在监听 `save_key_button` 和 `change_key_button`。 这些都将调用不同的函数。 让我们为它们设置函数声明，但从第一个侦听器开始并创建 `saveKey`：

```javascript
const saveKey = async () => {}

const changeKey = () => {}

document.getElementById('save_key_button').addEventListener('click', saveKey);
document
  .getElementById('change_key_button')
  .addEventListener('click', changeKey);
```



不错！ 我们要保存输入的 OpenAI API 密钥。 这可能会让人感觉不对，但别担心，这实际上是非常安全的。 在这里做的最安全的事情是创建一个完整的服务来处理这些请求——但我们会把它留给你🙂

它看起来像这样：

```javascript
const saveKey = () => {
  const input = document.getElementById('key_input');

  if (input) {
    const { value } = input;

    // Encode String
    const encodedValue = encode(value);

    // Save to google storage
    chrome.storage.local.set({ 'openai-key': encodedValue }, () => {
      document.getElementById('key_needed').style.display = 'none';
      document.getElementById('key_entered').style.display = 'block';
    });
  }
};
```



我们从输入框本身抓取输入值，然后对其进行一些 Base64 编码（这只会让肉眼难以读取），然后在谷歌存储中设置密钥，最后更改 CSS 设置以显示“ 你输入了密钥”对话框。

您可能会注意到您的应用程序在这里崩溃了——好吧，我们仍然需要添加 `encode` 功能！ 将放在 `saveKey` 函数正上方的超级简单的一行代码：
```javascript
const encode = (input) => {
  return btoa(input);
};
```



`btoa` 代表 [Binary to ASCII.](https://developer.mozilla.org/en-US/docs/Web/API/btoa) 我们在这里所做的只是更改格式 - 这是 *** ***不** 一点都不安全哈哈

最后，让我们为 `changeKey` 函数添加一些花哨的东西：
```javascript
const changeKey = () => {
  document.getElementById('key_needed').style.display = 'block';
  document.getElementById('key_entered').style.display = 'none';
};
```



这是一个非常简单的函数，可以在需要时显示`key_needed`用户界面以输入新的 API 密钥。 3 对 3 简单让 gooooo。

现在，你有这两种不同的状态，我们怎么知道先显示哪一个？ 我们实际上可以编写一个函数，在每次打开扩展时运行，以检查存储在我们的扩展存储中的密钥。 如果已经有密钥，则显示`key_entered`用户界面，否则显示`key_entered`用户界面。

在你的  `index.js`文件的顶部，继续添加这些东西：

```javascript
const checkForKey = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['openai-key'], (result) => {
      resolve(result['openai-key']);
    });
  });
};
```



我们在这里所做的只是检查我们状态中的密钥。 如果它在那里，请继续并返回它！ 我们在这里使用了一个承诺，因为我们需要等待回调在 [chrome.storage](http://chrome.storage) 部分被调用。 一旦它被调用，我们就可以解决我们的承诺。

最后，在文件的最底部调用它。 每次打开您的扩展程序时，都会运行：
```javascript
checkForKey().then((response) => {
  if (response) {
    document.getElementById('key_needed').style.display = 'none';
    document.getElementById('key_entered').style.display = 'block';
  }
});
```



我们等待承诺解决，然后我们相应地设置它。 如果密钥在那里，显示 `key_entered` 用户界面。 EZPZ。

我们已经写了 **QUITE** 了一点，但实际上还没有测试任何东西看它是否有效，哈哈。 如何快速轻松地测试您的扩展？ 检查这些步骤：

1. **转到扩展** - 前往您的浏览器并转到 `chrome://extensions`（请注意，如果您使用的是其他基于 chromium 的浏览器，这将有所不同）。 在这里您将看到一个扩展列表。
2.确保在右上角启用开发人员模式。
3. **加载解压后的扩展 -** 我们将在浏览器中加载我们的扩展以进行实际测试！ 导航到您的项目文件夹的**根目录**
4. **顺其自然** - 如果一切顺利，您应该会在扩展列表中看到您的扩展！
    
![Screenshot 2022-11-27 at 5.20.23 AM.png](https://i.imgur.com/dvkOyi0.png)
    



就像这里的任何其他扩展一样，您应该能够在您的扩展列表中看到它！ 继续点击它，看看魔法 **UNFOLD ✨**

![Screenshot 2022-11-23 at 5.14.09 PM.png](https://i.imgur.com/0h1mgyI.png)



一旦你按下添加键，你的用户界面就会改变！ 试玩几次以确保它有效！

你已经完成了 UI！ 我们的扩展程序的其他所有内容都将使用上下文菜单（当您在互联网上的任何地方右键单击时弹出的框）发生。

你可以用扩展中的 UI 做各种各样的事情——使用 React，让它们弹出到一边，这是一个狂野的世界。 完成其余部分后，稍后返回 UI，边栏很有趣。

这里有一个重要提示 — **没有热重载！**

因此，每次更新代码时，您都必须返回扩展列表，找到您的扩展列表，然后按右下角的刷新按钮：

![Untitled](https://i.imgur.com/Ma9zU1C.png)



如果您在构建时遇到扩展问题，请务必刷新它！ 您编写的更改可能实际上从未应用到您的包中。 有时，如果您注意到您的代码没有更新，我建议您只删除扩展并从头开始加载它。

### 请这样做，否则 Farza 会很难过。

在#progress 中发布您喜欢的新 Chrome 扩展程序的屏幕截图！