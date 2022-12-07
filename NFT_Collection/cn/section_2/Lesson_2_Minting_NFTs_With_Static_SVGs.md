### 🤘创建SVG

这是我们的黑框 SVG。

```html
<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">
    <style>.base { fill: white; font-family: serif; font-size: 14px; }</style>
    <rect width="100%" height="100%" fill="black" />
    <text x="50%" y="50%" class="base" dominant-baseline="middle" text-anchor="middle">EpicLordHamburger</text>
</svg>
```

接下来，我们想要一种方法来以某种方式在我们的 NFT 中获取这些数据，而无需将其托管在像 imgur 这样的地方（它随时可能出现故障或消失！）。 前往 [这个](https://www.utilities-online.info/base64) 网站，粘贴上面的完整 SVG 代码，然后单击“encode”以获取 base64 编码的 SVG。 现在，准备好施展魔法了吗？ 打开一个新浏览器窗口。在 URL 栏中粘贴：
```plaintext
data:image/svg+xml;base64,INSERT_YOUR_BASE64_ENCODED_SVG_HERE
```

例如，我的看起来像这样：
```plaintext
data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaW5ZTWluIG1lZXQiIHZpZXdCb3g9IjAgMCAzNTAgMzUwIj4NCiAgICA8c3R5bGU+LmJhc2UgeyBmaWxsOiB3aGl0ZTsgZm9udC1mYW1pbHk6IHNlcmlmOyBmb250LXNpemU6IDE0cHg7IH08L3N0eWxlPg0KICAgIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9ImJsYWNrIiAvPg0KICAgIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBjbGFzcz0iYmFzZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RXBpY0xvcmRIYW1idXJnZXI8L3RleHQ+DQo8L3N2Zz4=
```

我们将 SVG 代码转换成一个漂亮的字符串 :)， base64 基本上是将数据编码为字符串的公认标准。 所以当我们说 `data:image/svg+xml;base64` 时，它基本上是在说，“嘿，我给你 base64 编码的数据，请将它转换成 SVG ，谢谢！”。

将整个字符串 `data:image/svg+xml;base64,INSERT_YOUR_BASE64_ENCODED_SVG_HERE` 粘贴到浏览器的地址栏中，然后你就会看到 SVG！ 注意：如果出现错误，请仔细检查是否正确执行了所有步骤,这很容易搞砸:)。

好吧。这是一种让我们的 NFT 图像数据永久存储的方法。 世界上所有的数据中心都可能被毁坏，但由于我们有这个 base64 编码的字符串，只要我们有一台计算机和一个浏览器，我们总能看到 SVG。
![](https://i.imgur.com/f9mXVSb.png)

### ☠️摆脱 JSON 托管

还记得我们的 JSON 元数据吗？

好吧，我为我们的三词 NFT 稍微做一点点改动 :)。同样的操作，名称、描述和图像。 但是现在我们不再指向 imgur 链接，而是指向我们的 base64 编码字符串。
```json
{
    "name": "EpicLordHamburger",
    "description": "An NFT from the highly acclaimed square collection",
    "image": "data:image/svg+xml;base64,INSERT_YOUR_BASE64_ENCODED_SVG_HERE"
}
```

注意：不要忘记 `data:image/svg+xml;base64,INSERT_YOUR_BASE64_ENCODED_SVG_HERE` 两边的引号。

例如，我的看起来是这样：
```json
{
    "name": "EpicLordHamburger",
    "description": "An NFT from the highly acclaimed square collection",
    "image": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaW5ZTWluIG1lZXQiIHZpZXdCb3g9IjAgMCAzNTAgMzUwIj4NCiAgICA8c3R5bGU+LmJhc2UgeyBmaWxsOiB3aGl0ZTsgZm9udC1mYW1pbHk6IHNlcmlmOyBmb250LXNpemU6IDE0cHg7IH08L3N0eWxlPg0KICAgIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9ImJsYWNrIiAvPg0KICAgIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBjbGFzcz0iYmFzZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RXBpY0xvcmRIYW1idXJnZXI8L3RleHQ+DQo8L3N2Zz4="
}
```
但是等等——我们神奇的 JSON 文件会去哪里？ 现在，我们将其托管在 [这个](https://jsonkeeper.com/) 随机网站上。 如果该网站出现故障，我们漂亮的 NFT 将永远消失！这就现在是我们要做的。 **我们将对整个 JSON 文件进行 base64 编码。** 就像我们对 SVG 进行编码一样。

再次前往 [这个](https://www.utilities-online.info/base64) 网站，使用 base64 编码的 SVG 粘贴完整的 JSON 元数据（应该看起来像我上面的那样），然后单击“encode”以获取编码的 JSON。

在浏览器中打开一个新标签页，然后在 URL 栏粘贴这个:
```plaintext
data:application/json;base64,INSERT_YOUR_BASE64_ENCODED_JSON_HERE
```

比如，我的看起来是这样：
```plaintext
data:application/json;base64,ewogICAgIm5hbWUiOiAiRXBpY0xvcmRIYW1idXJnZXIiLAogICAgImRlc2NyaXB0aW9uIjogIkFuIE5GVCBmcm9tIHRoZSBoaWdobHkgYWNjbGFpbWVkIHNxdWFyZSBjb2xsZWN0aW9uIiwKICAgICJpbWFnZSI6ICJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUI0Yld4dWN6MGlhSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNakF3TUM5emRtY2lJSEJ5WlhObGNuWmxRWE53WldOMFVtRjBhVzg5SW5oTmFXNVpUV2x1SUcxbFpYUWlJSFpwWlhkQ2IzZzlJakFnTUNBek5UQWdNelV3SWo0TkNpQWdJQ0E4YzNSNWJHVStMbUpoYzJVZ2V5Qm1hV3hzT2lCM2FHbDBaVHNnWm05dWRDMW1ZVzFwYkhrNklITmxjbWxtT3lCbWIyNTBMWE5wZW1VNklERTBjSGc3SUgwOEwzTjBlV3hsUGcwS0lDQWdJRHh5WldOMElIZHBaSFJvUFNJeE1EQWxJaUJvWldsbmFIUTlJakV3TUNVaUlHWnBiR3c5SW1Kc1lXTnJJaUF2UGcwS0lDQWdJRHgwWlhoMElIZzlJalV3SlNJZ2VUMGlOVEFsSWlCamJHRnpjejBpWW1GelpTSWdaRzl0YVc1aGJuUXRZbUZ6Wld4cGJtVTlJbTFwWkdSc1pTSWdkR1Y0ZEMxaGJtTm9iM0k5SW0xcFpHUnNaU0krUlhCcFkweHZjbVJJWVcxaWRYSm5aWEk4TDNSbGVIUStEUW84TDNOMlp6ND0iCn0=
```

当您将该完整的 URI 粘贴到浏览器地址栏时，您将看到完整的 JSON。 **BOOOOOM！** 现在我们有办法让我们的 JSON 元数据永久保存。

这是我的屏幕截图：
![Untitled](https://i.imgur.com/y1ZaYGf.png)

*注意：当你encode+复制粘贴这些时，这里**很容易**搞砸。 所以，要非常小心！ 并仔细检查一切是否正常， 如果出现问题，请再次执行所有步骤！*

## 🚀 修改我们的合约代码，然后部署

好的，太棒了，我们有了这个神器的 base64 编码的 JSON 文件。 我们要怎样把它写进合约里？ 只需转到`MyEpicNFT.sol`文件，然后将整个字符串复制粘贴到我们的合约中。

我们只需要修改 `tokenURI()` 中的一行代码：
```solidity
return string(
    abi.encodePacked(
        "data:application/json;base64,",
        "INSERT_BASE_64_ENCODED_JSON_HERE"
    )
)

例如，看起来像我这样的：
```solidity
return string(
    abi.encodePacked(
        "data:application/json;base64,",
        "ewogICAgIm5hbWUiOiAiRXBpY0xvcmRIYW1idXJnZXIiLAogICAgImRlc2NyaXB0aW9uIjogIkFuIE5GVCBmcm9tIHRoZSBoaWdobHkgYWNjbGFpbWVkIHNxdWFyZSBjb2xsZWN0aW9uIiwKICAgICJpbWFnZSI6ICJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUI0Yld4dWN6MGlhSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNakF3TUM5emRtY2lJSEJ5WlhObGNuWmxRWE53WldOMFVtRjBhVzg5SW5oTmFXNVpUV2x1SUcxbFpYUWlJSFpwWlhkQ2IzZzlJakFnTUNBek5UQWdNelV3SWo0TkNpQWdJQ0E4YzNSNWJHVStMbUpoYzJVZ2V5Qm1hV3hzT2lCM2FHbDBaVHNnWm05dWRDMW1ZVzFwYkhrNklITmxjbWxtT3lCbWIyNTBMWE5wZW1VNklERTBjSGc3SUgwOEwzTjBlV3hsUGcwS0lDQWdJRHh5WldOMElIZHBaSFJvUFNJeE1EQWxJaUJvWldsbmFIUTlJakV3TUNVaUlHWnBiR3c5SW1Kc1lXTnJJaUF2UGcwS0lDQWdJRHgwWlhoMElIZzlJalV3SlNJZ2VUMGlOVEFsSWlCamJHRnpjejBpWW1GelpTSWdaRzl0YVc1aGJuUXRZbUZ6Wld4cGJtVTlJbTFwWkdSc1pTSWdkR1Y0ZEMxaGJtTm9iM0k5SW0xcFpHUnNaU0krUlhCcFkweHZjbVJJWVcxaWRYSm5aWEk4TDNSbGVIUStEUW84TDNOMlp6ND0iCn0="
    )
)
```

最后，让我们部署更新后的合约并铸造 NFT，以及确保它能在 OpenSea 上正常显示！ 使用相同的命令进行部署， 我稍微修改了我的部署脚本，只铸造一个 NFT 而不是两个，你也可以随意更改代码已凸显其个性化！

```bash
npx hardhat run scripts/deploy.js --network goerli
```

然后和以前一样，等待一两分钟，直到输出合约地址，在 [https://testnets.opensea.io](https://testnets.opensea.io) 上搜索该合约地址，你应该会在那里看到你的 NFT :) 。同样，搜索时不要单击“Enter”——当NFT系列在搜索栏中弹出时，您需要实际点击击该系列。

*注意：请记得使用 `https://testnets.opensea.io/assets/goerli/INSERT_DEPLOY_CONTRACT_ADDRESS_HERE/TOKEN_ID`。*
![](https://i.imgur.com/Z2mKTpK.png)

### 🚨进度证明提交

如果您已成功铸造了精美的 NFT，请务必在 Discord 的`#progress`频道中发布它在 OpenSea 上的屏幕截图！






