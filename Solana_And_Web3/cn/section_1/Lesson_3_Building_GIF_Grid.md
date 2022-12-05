我们沿着正确的道路行进至此，我们已经设置了React应用，构建了一个连接到钱包的按钮，基于用户Solana钱包的状态设置了一些条件渲染。

在我们的GIF门户，我们希望能够显示提交到我们的dapp的GIF!

基于以上问题，我们只需要构建一个UI。因为我们还没有编写Solana程序，所以我们将使用测试数据来确保一切能够按预期工作。然后我们所要做的就是稍后从我们的应用程序调用该程序(稍后将详细介绍)。

### 🧪 显示测试数据
首先，我们应该讨论一下渲染GIF网格时机。如果您深思一下，会发现我们的 GIF网格唯一会被渲染的时间是**当用户连接并授权他们的钱包到我们的应用程序时。**

这很简单！因此，让我们首先制作一些测试数据来排除第一个条件。 同样，我们稍后将在项目中对此进行更新，以使用您的Solana程序中的数据而不是前端。

在`App.js` 文件的顶部创建一个名为`TEST_GIFS` 的属性。在此属性中，您将填入一些您最喜欢的GIF！

我将围绕 **[鱿鱼游戏](https://en.wikipedia.org/wiki/Squid_Game)🦑** 这一主题来创建。

```javascript
const TEST_GIFS = [
	'https://i.giphy.com/media/eIG0HfouRQJQr1wBzz/giphy.webp',
	'https://media3.giphy.com/media/L71a8LW2UrKwPaWNYM/giphy.gif?cid=ecf05e47rr9qizx2msjucl1xyvuu47d7kf25tqt2lvo024uo&rid=giphy.gif&ct=g',
	'https://media4.giphy.com/media/AeFmQjHMtEySooOc8K/giphy.gif?cid=ecf05e47qdzhdma2y3ugn32lkgi972z9mpfzocjj6z1ro4ec&rid=giphy.gif&ct=g',
	'https://i.giphy.com/media/PAqjdPkJLDsmBRSYUp/giphy.webp'
]
```
这应该是你的欢乐时刻。在你的测试列表中添加尽可能多的动图，让它们成为你喜欢的任何主题。

也许你想让你的网站显示动漫主题的GIF,也许你希望它是电影主题的GIF,也许你只想要电子游戏主题的GIF。

**修改你网站的标题和描述，以匹配人们提交的GIF类型**
```jsx
// Change this stuff. Make it themed to something you're interested in.
// Ex. memes, music, games, cute animals, whatever!
<p className="header">🖼 GIF Portal</p> 
<p className="sub-text">
  View your GIF collection in the metaverse ✨
</p>
```
我知道这听起来可能有些愚蠢，但这些小小的修改会让你的网站更加有趣。而且，这可能会激励你继续前行。

好了，我们现在有一些有趣的GIF来测试我们的dapp。我们要如何显示这些数据呢?还记得我们写`renderNotConnectedContainer`函数的时候吗?这次我们将采用同样的方法，但改为渲染GIF网格！

首先，让我们`renderNotConnectedContainer`下创建一个名为 `renderConnectedContainer`的新函数。将有一些简单的UI代码，映射我们所有的GIF链接并呈现出来：
```jsx
const renderConnectedContainer = () => (
  <div className="connected-container">
    <div className="gif-grid">
      {TEST_GIFS.map(gif => (
        <div className="gif-item" key={gif}>
          <img src={gif} alt={gif} />
        </div>
      ))}
    </div>
  </div>
);
```
您可能已经保存了文件，但仍然没有看到dapp中显示任何东西!记住——这些呈现方法需要被**调用**才能执行!让我们回到我们添加的`{!walletAddress && renderNotConnectedContainer()}`。

如果我们想在用户连接到我们的dapp时显示这些，我们添加什么属性?可能是`walletAddress`，对吧?如果我们有一个`walletAddress`，那一定意味着我们有一个连接的钱包!好了。

所以，在`renderNotConnectedContainer`函数下面继续添加这些代码:
```javascript
return (
  <div className="App">
    <div className="container">
      <div className="header-container">
        <p className="header">🖼 GIF Portal</p>
        <p className="sub-text">
          View your GIF collection in the metaverse ✨
        </p>
        {!walletAddress && renderNotConnectedContainer()}
        {/* We just need to add the inverse here! */}
        {walletAddress && renderConnectedContainer()}
      </div>
      <div className="footer-container">
        <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
        <a
          className="footer-text"
          href={TWITTER_LINK}
          target="_blank"
          rel="noreferrer"
        >{`built on @${TWITTER_HANDLE}`}</a>
      </div>
    </div>
  </div>
);  
```
现在，如果您保存这些更改后的代码，将为您呈现所有酷炫的GIF😮

注意：如果您的网速比较慢，GIF可能需要一段时间才能加载完成。

你可以看到，一切似乎已经“生效“。我在`app.css`中为这个dapp提供了一些样式，这样您就不必太担心设置了。

此时，您应该对`app.css`文件稍微进行一些修改。这是你所有网页显示样式的所在，虽然我认为这种格式看起来很酷，但你可能还有更好的设置！
![](https://s1.ax1x.com/2022/12/04/zsikE4.png)
比如，如果你的网页dapp是供人们提交可爱动物GIFs的地方，那么网站的暗黑模式可能并不适合。说到底，还是取决于你自己。

### 🔤创建一个GIF输入框
**我们的dapp正在成形——大概10分钟后开始编写我们的第一个Solana程序，它将为我们的web应用程序提供真实的数据，而不是硬编码的测试数据。

可以花点点时间来欣赏下你创造的魔法。

这是世界上许多人希望自己能过掌握的事情，大多数人只是在推特上谈论这些。但是，你才是真正去采取行到的人。真佩服你，我的朋友。

是时候让我们思考其他人如何将他们自己的GIFs添加到我们的网页dapp中了。

我们在这里将采取输入的方法，当有人访问你的dapp时，将能够添加指向他们最喜欢的GIF链接，然后调用我们的Solana程序来处理其它的!现在，我们将在此处设置调用的输入和操作。

让我们从输入开始。我们只希望当用户将他们的钱包连接到我们的dapp时，这个输入框能显示出来。所以，这意味着我们要将这段代码添加到我们的`renderConnectedContainer`渲染方法中:
```jsx
const renderConnectedContainer = () => (
  <div className="connected-container">
    {/* Go ahead and add this input and button to start */}
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <input type="text" placeholder="Enter gif link!" />
      <button type="submit" className="cta-button submit-gif-button">Submit</button>
    </form>
    <div className="gif-grid">
      {TEST_GIFS.map((gif) => (
        <div className="gif-item" key={gif}>
          <img src={gif} alt={gif} />
        </div>
      ))}
    </div>
  </div>
);
```
我们在这里添加的主要内容是`输入框`和`提交`按钮。

您可以在这个输入框中输入并单击按钮或按`Enter`键，但您注意到其实什么没有发生!我们仍然需要编写逻辑并将其连接到表单提交。

为此，我们将使用几个很酷的新属性。

`onChange`是一个函数，每次当输入框值改变时都会被触发。同样，如果您已经是React专业人士— 您可以让这些东西大放异彩。

为了让它正常工作，我们需要创建一个名为`inputValue` 的新状态属性。 让我们从这里开始：
在`const [walletAddress, setWalletAddress] = useState(null);`下添加如下代码：
```javascript
const [inputValue, setInputValue] = useState('');
```
很简单是吧。现在我们只需要把它连接到输入元素上,转到`input`元素，把它改成这样:
```jsx
<input
  type="text"
  placeholder="Enter gif link!"
  value={inputValue}
  onChange={onInputChange}
/>
```
你可能会在这里遇到`onInputChange is not defined`和`inputValue is not defined`的错误。好吧，这其实很好解决，让我们定义一下！

在`connectWallet`函数下添加如下代码：
```javascript
const onInputChange = (event) => {
  const { value } = event.target;
  setInputValue(value);
};
```
这个简单的函数将会在输入框键入内容时触发，然后将其值赋给为我们的`inputValue`属性。这样，当我们准备向Solana程序发送GIF链接时，就可以轻松地访问该属性以获取值。
最后，让我们连接表单确认提交。在`connectWallet`函数下创建一个新函数`sendGif`:
```javascript
const sendGif = async () => {
  if (inputValue.length > 0) {
    console.log('Gif link:', inputValue);
  } else {
    console.log('Empty input. Try again.');
  }
};
```

首先，当我们最终添加与Solana程序的交互时，我们将此函数设置为`async`(异步)。

然后很简单，我们检查输入框中是否有值输入。如果有，输出GIF链接，否则输出空。 同样，我们将在稍后重新访问此功能以进行完整的实施 :)。

所以继续吧，在输入框中添加GIF链接，打开控制台！按下提交按钮后，您将看到`Gif link:YOUR_Gif_link`。

等待一会后，发现没有发生任何事？

这是因为我们仍然需要在表单的`onSubmit`属性中调用此法!很容易只需要更新`onSubmit`处理程序来调用我们新的`sendGif`方法就行了。

```jsx
<form
  onSubmit={(event) => {
    event.preventDefault();
    sendGif();
  }}
>
```
再试一下，现在您应该看到您的链接在控制台中输出来了!

### 🌈 设置GIF数据状态

在我们继续讨论Solana分部之前，我们还需要设置一件事......实际上就是在加载时获取我们的真实数据！现在，我们只是盲目地渲染`TEST_GIFS`(测试数据)。

流程看起来有点是这样：
1. 打开网页dapp。
2. 连接钱包。
3. 连接钱包后，从我们的Solana程序中获取GIF列表。

因为我们有设置测试数据，可以很容易地模拟这个获取，所以当我们准备好实际调用程序时，它就是即插即用的！

我们在这里做了很多的布置。为什么?因为这些布置是值得的，以至于我们以后无需在担心这些。Solana不是那么容易的，特别如果你是Rust新手。所以，最好现在就设置好UI让我们可以完全专注于Solana的程序。

Cool，那我们开始吧。我们将GIF列表保存在组件的状态属性中。

所以，让我们从在`walletAddress`声明下创建这个状态属性开始:

```javascript
// State
const [walletAddress, setWalletAddress] = useState(null);
const [inputValue, setInputValue] = useState('');
const [gifList, setGifList] = useState([]);
```
然后我们需要继续设置另一个`useEffect`函数，当我们的`walletAddress`状态改变时它会被调用。请记住，我们只想在用户将钱包连接到dapp时获取我们的GIF列表。

在您当前的 `useEffect`下**创建另一个**`useEffect`。

```jsx
useEffect(() => {
  const onLoad = async () => {
    await checkIfWalletIsConnected();
  };
  window.addEventListener('load', onLoad);
  return () => window.removeEventListener('load', onLoad);
}, []);

useEffect(() => {
  if (walletAddress) {
    console.log('Fetching GIF list...');
    
    // Call Solana program here.

    // Set state
    setGifList(TEST_GIFS);
  }
}, [walletAddress]);
```

我们这里要说的是，如果我们有一个`walletAddress`就可以继续运行我们的获取逻辑。现在，我们只是要设置测试数据，因为我们还没有设置与程序的交互！

因此，一旦我们的测试数据设置好，我们就想可以使用它!为此，我们将返回到`renderConnectedContainer`函数，并做一行代码更改:

```jsx
const renderConnectedContainer = () => (
    <div className="connected-container">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendGif();
        }}
      >
        <input
          type="text"
          placeholder="Enter gif link!"
          value={inputValue}
          onChange={onInputChange}
        />
        <button type="submit" className="cta-button submit-gif-button">
          Submit
        </button>
      </form>
      <div className="gif-grid">
        {/* Map through gifList instead of TEST_GIFS */}
        {gifList.map((gif) => (
          <div className="gif-item" key={gif}>
            <img src={gif} alt={gif} />
          </div>
        ))}
      </div>
    </div>
  );
```

现在让我们在`sendGif()`中添加几行代码，这样当你提交表单时，它会将GIF添加到gifList并清除文本字段:

```javascript
const sendGif = async () => {
  if (inputValue.length > 0) {
    console.log('Gif link:', inputValue);
    setGifList([...gifList, inputValue]);
    setInputValue('');
  } else {
    console.log('Empty input. Try again.');
  }
};
```

就是这么简单。现在，当我们改变`useEffect`从我们的Solana程序中获取GIF列表时，我们就可以准备好进行渲染了!

**这是我们网络应用程序的基础！EPIC。** 现在是时候开始在Solana计划中构建内容了。 我们会时不时地回到**React**来运行一些测试并设置我们dapp的最终部分🌌

### 🚨 进度证明提交

*请一定记得提交，要不然Fraza会伤心的💔 

在`#progress`频道中发布一张史诗般的GIF网格截图，以供所有人查看😍










