## 🤘 Create our SVG

Here's our black box SVG again.

```html
<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">
    <style>.base { fill: white; font-family: serif; font-size: 14px; }</style>
    <rect width="100%" height="100%" fill="black" />
    <text x="50%" y="50%" class="base" dominant-baseline="middle" text-anchor="middle">EpicLordHamburger</text>
</svg>
```

Next, we want a way to somehow get this data in our NFT without hosting it somewhere like imgur (which can go down or die at any moment!). Head to [this](https://www.utilities-online.info/base64) website. Paste in your full SVG code above and then click "encode" to get your base64 encoded SVG. Now, ready for some magic? Open a new tab. And in the URL bar paste this:

```plaintext
data:image/svg+xml;base64,INSERT_YOUR_BASE64_ENCODED_SVG_HERE
```

So for example, mine looks like this:

```plaintext
data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaW5ZTWluIG1lZXQiIHZpZXdCb3g9IjAgMCAzNTAgMzUwIj4NCiAgICA8c3R5bGU+LmJhc2UgeyBmaWxsOiB3aGl0ZTsgZm9udC1mYW1pbHk6IHNlcmlmOyBmb250LXNpemU6IDE0cHg7IH08L3N0eWxlPg0KICAgIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9ImJsYWNrIiAvPg0KICAgIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBjbGFzcz0iYmFzZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RXBpY0xvcmRIYW1idXJnZXI8L3RleHQ+DQo8L3N2Zz4=
```

We turned our SVG code into a nice string :). base64 is basically an accepted standard for encoding data into a string. So when we say `data:image/svg+xml;base64` it's basically saying, "Hey, I'm about to give you base64 encoded data please process it as a SVG, thank you!".

Take that whole string `data:image/svg+xml;base64,INSERT_YOUR_BASE64_ENCODED_SVG_HERE` and paste it in your browser's address bar and boom you'll see the SVG! Note: if you get an error, double-check you followed all the steps properly. It's easy to mess up :).

Okay, **epic**. This is a way to keep our NFTs image data permanent and available forever. All the data centers in the world can burn down but since we have this base64 encoded string, we would always see the SVG as long as we have a computer and a browser.

![Untitled](https://i.imgur.com/f9mXVSb.png)

## ☠️ Get rid of the hosted JSON

Remember our JSON metadata?

Well, I changed it just a little bit for our three-word NFTs :). Same thing! A name, description, and image. But now instead of pointing to an imgur link, we point to our base64 encoded string.

```json
{
    "name": "EpicLordHamburger",
    "description": "An NFT from the highly acclaimed square collection",
    "image": "data:image/svg+xml;base64,INSERT_YOUR_BASE64_ENCODED_SVG_HERE"
}
```

Note: don't forget the quotation marks around the `data:image/svg+xml;base64,INSERT_YOUR_BASE64_ENCODED_SVG_HERE`.

For example, mine looks like this:

```json
{
    "name": "EpicLordHamburger",
    "description": "An NFT from the highly acclaimed square collection",
    "image": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaW5ZTWluIG1lZXQiIHZpZXdCb3g9IjAgMCAzNTAgMzUwIj4NCiAgICA8c3R5bGU+LmJhc2UgeyBmaWxsOiB3aGl0ZTsgZm9udC1mYW1pbHk6IHNlcmlmOyBmb250LXNpemU6IDE0cHg7IH08L3N0eWxlPg0KICAgIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9ImJsYWNrIiAvPg0KICAgIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBjbGFzcz0iYmFzZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RXBpY0xvcmRIYW1idXJnZXI8L3RleHQ+DQo8L3N2Zz4="
}
```

But wait — where will our fancy new JSON file go? Right now, we host it on [this](https://jsonkeeper.com/) random website. If that website goes down, our beautiful NFT is gone forever! Here's what we're going to do. **We're going to base64 encode our entire JSON file.** Just like we encoded our SVG.

Head to [this](https://www.utilities-online.info/base64) website again. Paste in your full JSON metadata with the base64 encoded SVG (should look sorta like what I have above) and then click "encode" to get your encoded JSON. 

Open a new tab. And in the URL bar paste this:

```plaintext
data:application/json;base64,INSERT_YOUR_BASE64_ENCODED_JSON_HERE
```

For example, mine looks like this:

```plaintext
data:application/json;base64,ewogICAgIm5hbWUiOiAiRXBpY0xvcmRIYW1idXJnZXIiLAogICAgImRlc2NyaXB0aW9uIjogIkFuIE5GVCBmcm9tIHRoZSBoaWdobHkgYWNjbGFpbWVkIHNxdWFyZSBjb2xsZWN0aW9uIiwKICAgICJpbWFnZSI6ICJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUI0Yld4dWN6MGlhSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNakF3TUM5emRtY2lJSEJ5WlhObGNuWmxRWE53WldOMFVtRjBhVzg5SW5oTmFXNVpUV2x1SUcxbFpYUWlJSFpwWlhkQ2IzZzlJakFnTUNBek5UQWdNelV3SWo0TkNpQWdJQ0E4YzNSNWJHVStMbUpoYzJVZ2V5Qm1hV3hzT2lCM2FHbDBaVHNnWm05dWRDMW1ZVzFwYkhrNklITmxjbWxtT3lCbWIyNTBMWE5wZW1VNklERTBjSGc3SUgwOEwzTjBlV3hsUGcwS0lDQWdJRHh5WldOMElIZHBaSFJvUFNJeE1EQWxJaUJvWldsbmFIUTlJakV3TUNVaUlHWnBiR3c5SW1Kc1lXTnJJaUF2UGcwS0lDQWdJRHgwWlhoMElIZzlJalV3SlNJZ2VUMGlOVEFsSWlCamJHRnpjejBpWW1GelpTSWdaRzl0YVc1aGJuUXRZbUZ6Wld4cGJtVTlJbTFwWkdSc1pTSWdkR1Y0ZEMxaGJtTm9iM0k5SW0xcFpHUnNaU0krUlhCcFkweHZjbVJJWVcxaWRYSm5aWEk4TDNSbGVIUStEUW84TDNOMlp6ND0iCn0=
```

When you paste that full URI into your browsers address bar, you'll see the full JSON in all its glory. **BOOOOOM!** Now we have a way to keep our JSON metadata permanent and available forever.

Here's a screenshot of mine:

![Untitled](https://i.imgur.com/y1ZaYGf.png)

Note: It's **very easy** to mess up here when you're encoding + copy-pasting stuff. So, be very careful!!! And double-check everything works. If things are breaking, follow all the steps again!


## 🚀 Change up our contract, deploy

Okay awesome, we've got this fancy base64 encoded JSON file. How do we get it on our contract? Simple head to `MyEpicNFT.sol` and — we just copy-paste the whole big string into our contract.

We just need to change one line in `tokenURI()`

```solidity
return string(
    abi.encodePacked(
        "data:application/json;base64,",
        "INSERT_BASE_64_ENCODED_JSON_HERE"
    )
)
```

For example, mine looks like:

```solidity
return string(
    abi.encodePacked(
        "data:application/json;base64,",
        "ewogICAgIm5hbWUiOiAiRXBpY0xvcmRIYW1idXJnZXIiLAogICAgImRlc2NyaXB0aW9uIjogIkFuIE5GVCBmcm9tIHRoZSBoaWdobHkgYWNjbGFpbWVkIHNxdWFyZSBjb2xsZWN0aW9uIiwKICAgICJpbWFnZSI6ICJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUI0Yld4dWN6MGlhSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNakF3TUM5emRtY2lJSEJ5WlhObGNuWmxRWE53WldOMFVtRjBhVzg5SW5oTmFXNVpUV2x1SUcxbFpYUWlJSFpwWlhkQ2IzZzlJakFnTUNBek5UQWdNelV3SWo0TkNpQWdJQ0E4YzNSNWJHVStMbUpoYzJVZ2V5Qm1hV3hzT2lCM2FHbDBaVHNnWm05dWRDMW1ZVzFwYkhrNklITmxjbWxtT3lCbWIyNTBMWE5wZW1VNklERTBjSGc3SUgwOEwzTjBlV3hsUGcwS0lDQWdJRHh5WldOMElIZHBaSFJvUFNJeE1EQWxJaUJvWldsbmFIUTlJakV3TUNVaUlHWnBiR3c5SW1Kc1lXTnJJaUF2UGcwS0lDQWdJRHgwWlhoMElIZzlJalV3SlNJZ2VUMGlOVEFsSWlCamJHRnpjejBpWW1GelpTSWdaRzl0YVc1aGJuUXRZbUZ6Wld4cGJtVTlJbTFwWkdSc1pTSWdkR1Y0ZEMxaGJtTm9iM0k5SW0xcFpHUnNaU0krUlhCcFkweHZjbVJJWVcxaWRYSm5aWEk4TDNSbGVIUStEUW84TDNOMlp6ND0iCn0="
    )
)
```

Finally, let's deploy our updated contract, mint the NFT, and make sure it works properly on OpenSea! Deploy using the same command. I changed my deploy script a little to only mint one NFT instead of two, feel free to do the same!

```bash
npx hardhat run scripts/deploy.js --network goerli
```

Then same as before, wait a minute or two, take the contract address, search it on [https://testnets.opensea.io](https://testnets.opensea.io) and you should see your NFT there :). Again, don't click "Enter" when searching -- you need to actually click the collection when it pops up in the search bar.

Note: Remember to use `https://testnets.opensea.io/assets/goerli/INSERT_DEPLOY_CONTRACT_ADDRESS_HERE/TOKEN_ID`. 

![Untitled](https://i.imgur.com/Z2mKTpK.png)

## 🚨Progress report

If you get a fancy NFT, make sure to send a screenshot of it on OpenSea in the `#progress` channel in Discord! 
