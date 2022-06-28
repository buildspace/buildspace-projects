## 🔗 What "on-chain" means and why it's important

We have a big problem right now with our NFTs.

What happens if imgur goes down? Well — then our `image` link is absolutely useless and our NFT is lost and our Spongebob is lost! Even worse, what happens if that website that hosts the JSON file goes down? Well — then our NFT is completely broken because the metadata wouldn't be accessible.

One way to fix this problem is to store all our NFT data "on-chain" meaning the data lives on the contract itself vs in the hands of a third-party. This means our NFT will truly be permanent :). In this case, the only situation where we lose our NFT data is if the blockchain itself goes down. And if that happens — well then we have bigger problems!

But, assuming the blockchain stays up forever — our NFT will be up forever! This is very appealing because it also means if you sell an NFT, the buyer can be confident the NFT won't break. Many popular projects use on-chain data, [Loot](https://techcrunch.com/2021/09/03/loot-games-the-crypto-world/) is one very popular example!

## 🖼  What are SVGs

A common way to store NFT data for images is using a SVG. A SVG is an image, but the image itself is built with code.

For example, here's a really simple SVG that renders a black box with some white text in the middle.

```html
<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">
    <style>.base { fill: white; font-family: serif; font-size: 14px; }</style>
    <rect width="100%" height="100%" fill="black" />
    <text x="50%" y="50%" class="base" dominant-baseline="middle" text-anchor="middle">EpicLordHamburger</text>
</svg>
```

Head to [this](https://www.svgviewer.dev/) website and paste in the code above to see it. Feel free to mess around with it.

This is really cool because it lets us create **images with code**.

SVGs can be customized **a lot.** You can even animate them lol. Feel free to read up more on them [here](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial).

## 🤘 What we're going to do

First, we're going to learn how to get all our NFT data on-chain. Our NFT is simply going to be a box with a **funny three-word combo at the center**. Just like the SVG above. We're going to hardcode the SVG above in our contract that says "EpicLordHamburger".

After that, we're going to learn how to *dynamically generate* these NFTs on our contract. So, **every time someone mints an NFT they'll get a different, hilarious three-word combo**. For example:

- EpicLordHamburger
- NinjaSandwichBoomerang
- SasukeInterstellarSwift

It's going to be epic :). Let's do this!
