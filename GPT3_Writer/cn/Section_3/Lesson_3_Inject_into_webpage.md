
让我们继续前进，首先在我们的 `scripts` 文件夹中创建一个名为 `content.js` 的全新文件，让一些听众继续前进！ 该文件将保存我们扩展前端的所有脚本，例如 DOM 操作🤘。

现在，为了让我们的扩展知道这是我们将用于前端脚本的文件，我们需要让 `manifest.json` 文件知道。 继续前进并将其添加到您的文件中：
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
  "background": {
    "service_worker": "scripts/contextMenuServiceWorker.js"
  },
  "permissions": ["contextMenus", "tabs", "storage"],
  // Add this array here
  "content_scripts": [
    {
      "matches": ["http://*/*", "https://*/*"],
      "js": ["scripts/content.js"]
    }
  ]
}
```



这个数组表示，对于我们访问的任何站点，允许我们在其上运行脚本代码来执行 DOM 操作等操作。

现在，如果我们决定现在就运行它，我们的 service worker 会收到一个错误，说我们的消息没有返回任何响应——连接已关闭。 我们的 `content.js` 文件在这里通过监听来自我们服务人员的消息来改变这一点。

让我们前往我们的`content.js`文件并设置我们的监听器：

```javascript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'inject') {
    const { content } = request;

    console.log(content);

    sendResponse({ status: 'success' });
  }
});
```



这看起来与我们的 `sendMessage` 函数非常相似，但相反！ 当此侦听器被触发时，它将收到 3 个道具，`request`、`sender` 和 `sendResponse`。 我们现在非常关心 `request` 和 `sendResponse`。

我们的请求将是包含好东西的对象——消息和内容。 但在我们处理任何事情之前，我们要确保检查我们的消息是否用于我们的注入操作。 如果是这样，让我们从中获取`content`。

现在，我们将打印出消息以我们的方式发送的任何内容，然后使用 `sendResponse` 回调发回一条消息，说一切都很完美，没有什么可怕的错误👀。

我们准备测试我们的消息功能！ 如果您以前从未使用过这种类型的消息传递，请准备好大吃一惊。 这个项目的很多部分都有一些疯狂的神奇时刻，这将是其中之一。

继续并重新加载您的扩展程序并返回 Calmly！ 在我们对此进行全面测试之前，请注意一些🚨非常重要的注意事项🚨-

1. 确保**刷新**你所在的任何选项卡，否则消息会有点不稳定
2. 要查看来自 `content.js` 的日志消息，只需在您的 Web 浏览器选项卡中打开控制台（而不是扩展日志）！ 请记住，这是我们正在处理的前端脚本 :)

如果你不刷新，东西将不会按预期工作。 如果你看错了控制台，你什么也看不到 :P

![Screenshot 2022-11-27 at 5.47.18 AM.png](https://i.imgur.com/8h7w1EJ.png)



**BOOM** — 就这样我们得到了我们的`generating...` 和 GTP-3 输出！

我们现在太接近了，这就是真正的定制发挥作用的地方。 到目前为止，如果您还没有将扩展程序更改为博客生成器以外的其他东西——现在花点时间考虑一下。 现在是时候将 GPT-3 的强大功能带到您想要做的任何网站。 相当狂野。

### 是时候了——注入Calmly

您可能会说，“该死的 Farza，您一直在大肆宣传这种注入方法，但您甚至都没有指出如何去做”。 好吧好吧，我们现在到了。

让我们回到我们的`content.js`文件。 当我们收到我们的内容时，我们希望以一种 Calmly（或您正在使用的网站）能够接收它并像您键入它一样呈现它的方式对其进行处理。

这可能是此流程中最困难的部分之一。 每个站点都以不同的方式执行此操作，并且包含不同的元素。 根据您计划使用的网站，您将需要深入研究大量 HTML 以了解它的结构！ 这是一个艰难的过程，但我的天啊，当你看到所有这些都融合在一起时，真是太神奇了。

继续在你的消息监听器中添加这两行 + 在 `content.js` 中声明一个新函数：
```javascript
// Declare new function
const insert = (content) => {}

chrome.runtime.onMessage.addListener(
  // This is the message listener
  (request, sender, sendResponse) => {
    if (request.message === 'inject') {
      const { content } = request;
			
      // Call this insert function
      const result = insert(content);
			
      // If something went wrong, send a failes status
      if (!result) {
        sendResponse({ status: 'failed' });
      }

      sendResponse({ status: 'success' });
    }
  }
);
```



chrome 可以如此轻松地连接到这些事件并添加我们自己的自定义逻辑，这真是太棒了。 我们将使用这个 `insert`函数来实际找到我们需要将输出注入并返回响应的正确 HTML。

在我们深入研究 `insert` 函数之前，我将布局我们应该遵循的流程，并在函数内添加注释，然后一一填写（这实际上称为伪代码）：
```javascript
const insert = (content) => {
  // Find Calmly editor input section

  // Grab the first p tag so we can replace it with our injection

  // Split content by \n

  // Wrap in p tags

  // Insert into HTML one at a time

  // On success return true
  return true;
};
```



恶心——这种类型的头脑风暴总能帮助我在不编写代码的情况下设置某种流程。 我需要采取哪些步骤才能到达我想去的地方，这变得非常清楚。 让我们从顶部开始，找到平静的编辑器输入部分。

为了在这里获得我们需要的一切，我们需要检查！ 如果您以前从未检查过网站，这将是一个很好的开始方式。 使用检查器可以帮助您调试代码、查看其他站点如何构建代码，甚至可以帮助您更快地开发！

您需要做的就是按 `CMD + OPTION + i` (macOS) 或 `CTRL + ALT + i` (Windows) 来获得一个包含页面所有元素的弹出窗口！

哇。 这里发生了很多狗屎事情，哈哈。 第一步是找到我们实际上可以从容地写进去的地方，因为那是我们试图插入文本的地方。
![Untitled](https://i.imgur.com/DiO4GiK.png)



在这里玩一会儿！ 您会注意到您可以使用光标将鼠标悬停在元素上或仅使用箭头键。 同样，Calmly 的目标是找到我输入“hi there :)”的 `div`。

更深入地看，我们可以看到在这个 `div` 中创建并插入了一个 `p` 标签。 但我们实际上在这里寻找什么？

我们基本上需要编写这样的代码——带我到这个 div 并插入一个带有一些文本的 `p` 标签。 好的，很好，我们可以做到！ 但是怎么办？ Javascript 来拯救！

`document` 元素有大量奇特的操作来帮助我们在 HTML 中查明特定元素并对其进行操作。

**进入代码时间：**

```javascript
// Find Calmly editor input section
const elements = document.getElementsByClassName('droid');

if (elements.length === 0) {
  return;
}

const element = elements[0];
```



所以这实际上很简单！ 如果你注意到，那个包含我们的 `p` 标签的 `div` 有一个名为 `droid` 的类。 我们有一个简单的方法来找到它——`getElementsByClassName`！

你会注意到它返回了一个包含这些项目的列表，因为从技术上讲，可以有多个具有这个类名的 div。 因为我们知道这是具有此类名称的最顶层的 div，所以可以安全地将其从顶部弹出。

现在我们要做一些奇怪的事情——删除 `droid` div 的第一个 `p` 元素：
```jsx
// Grab the first p tag so we can replace it with our injection
const pToRemove = element.childNodes[0];
pToRemove.remove();
```



这只是为了幻想，但本质上我们希望它感觉就像您正在提交一些东西并且它具有不同的加载状态。

想象一下你有一个看起来像这样的流程：
![Screenshot 2022-11-27 at 5.49.31 AM.png](https://i.imgur.com/Ivkr8cH.png)


如果在第一行替换它会好得多，对吧？ 所以这就是所有这两行在插入下一段内容之前所做的事情。

好的，很好——所以我们正在抓取一些 div 来操纵一些文本，很酷吧？ 现在让我们获取一些真实数据并将其弄乱以注入。

我们对 GPT-3 的回应实际上缩进得很好（谢谢 OpenAI）所以我们也想确保在这里遵守这一点！ 这是第 3 步的用武之地：
```javascript
// Split content by \n
const splitContent = content.split('\n');
```



如果您以前从未见过这个，那么它的意思就是“换行”。 这告诉您的文本编辑器将文本缩进到下一行。 缩进很重要，尤其是在博客文章中！ 它们有助于分解内容并强调某些部分。 所以我们要确保考虑到这一点。

如果我们看一下当我们按下回车键（或添加新行）时 Calmly 做了什么，它会添加这种类型的 HTML：
![Untitled](https://i.imgur.com/Kbo5ZLt.png)



这意味着如果我们遇到一个 `\n` 我们应该创建这个带有`br` 元素的 `p` 标签（中断）。

**好的 -** 所以为了捕捉这些东西，我们将实际遍历内容字符串并将其拆分为这些换行符。 这将帮助我们知道何时何地在 Calmly 中添加新行 :)。

为此，我们可以编写这段很酷的小代码：
```javascript
// Wrap in p tags
splitContent.forEach((content) => {
  const p = document.createElement('p');

  if (content === '') {
    const br = document.createElement('br');
    p.appendChild(br);
  } else {
    p.textContent = content;
  }

  // Insert into HTML one at a time
  element.appendChild(p);
});
```



首先，让我们遍历我们的内容字符串并将每一行放在一个 `p` 标签中！ 实际上，这包括通过代码创建一个新的`p`标签，然后将文本插入到元素的`textContent`中。

同样，如果我们点击 `\n`（也是 `''`），我们将在 `p` 标签内放置一个 `br` 元素！

最后，我们将那个构造精美的 `p` 标签附加到我们之前找到的 `droid` `div` 元素上。 我猜那些***就是***我们要找的机器人。

**很好很好很好** — 看起来我们已经准备好让这个东西正常运行 :)。 如果一切顺利，你刚刚解锁了一项非常酷的新技能——GPT-3 和 Chrome 扩展。

真的，这些东西不容易进入，而你在这里就是这样做的。 好吧，让我们看看这东西飞起来。

继续重新加载您的扩展程序，刷新您的网页并运行您的测试流程：
![Screenshot 2022-11-27 at 5.54.24 AM.png](https://i.imgur.com/x4kRkqO.png)


**哇，它很漂亮 🥲。** 这太疯狂了……你应该看到`generating...`，然后你的下一篇博文直接放到 Calmly 中！

恭喜我的朋友——**你做到了。**你现在可以在网络上的任何地方挂断 GPT-3 呼叫！

### 请这样做，否则 Farza 会很难过。

在 #progress 中张贴截图，展示注入脚本在 Calmly 中生成的文本。 惊人的工作！