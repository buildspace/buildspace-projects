## 🔗 “链上”的含义及其重要性

我们现在的 NFT 有一个大问题。

如果 imgur 出现故障会怎样？好吧——那么我们的“图像”链接就会完全失效，我们的 NFT 将会丢失，我们的 `Sponge baby Nft`也丢失了！更糟糕的是，如果托管 JSON 文件的网站出现故障怎么办？好吧——那么我们的 NFT 就完全崩溃了，因为无法访问元数据。

解决这个问题的一种方法是将我们所有的 NFT 数据存储在“链上”，这意味着数据存在合约本身而不是在第三方手中。这意味着我们的 NFT 将真正永久的存在 :)。在这种情况下，我们丢失 NFT 数据的唯一情况是区块链本身出现故障。如果发生这种情况——那么我们就有更大的问题了！

但是，假设区块链永远存在——我们的 NFT 也将永远存在！这非常有吸引力，因为这也意味着如果您出售 NFT，买家可以确信 NFT 不会损坏。许多蓝筹项目都使用链上数据，[Loot](https://techcrunch.com/2021/09/03/loot-games-the-crypto-world/) 就是是一个非常著名的例子！

### 🖼什么是 SVGs
为图像存储 NFT 数据的常用方法是使用SVG。SVG是一个图像，但图像本身是用代码构建的。

例如，这是一个非常简单的 SVG，它呈现一个黑框，中间有一些白色文本。
```html
<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">
    <style>.base { fill: white; font-family: serif; font-size: 14px; }</style>
    <rect width="100%" height="100%" fill="black" />
    <text x="50%" y="50%" class="base" dominant-baseline="middle" text-anchor="middle">EpicLordHamburger</text>
</svg>
```

前往 [这个](https://www.svgviewer.dev/) 网站并粘贴上面的代码以查看它。随意查看。

这真的很酷，因为它让我们可以用代码创建**图像**。

SVG 可以定制**很多。** 您甚至可以为它们制作动画，哈哈。 欢迎在 [此处](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial) 阅读更多关于它们的信息。

### 🤘我们要做什么

首先，我们将学习如何让我们所有的 NFT 数据上链。我们的 NFT 只是一个方框，中间有一个**有趣的三词组合**。 就像上面的 SVG 一样。 我们将在“EpicLordHamburger”的合约中对上面的 SVG 进行硬编码。

之后，我们将学习如何在合约上*动态生成*这些 NFT。 因此，**每次有人铸造 NFT 时，他们都会得到一个不同的、搞笑的三词组合**。 例如：

- EpicLordHamburger
- NinjaSandwichBoomerang
- SasukeInterstellarSwift

这将是史诗级的工作:)。 我们开工吧！
