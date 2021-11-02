🤘 Create our SVG
--------------------

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

☠️ Get rid of the hosted JSON.
--------------------

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

Head to [this](https://www.utilities-online.info/base64) website again. Paste in your full JSON metadata with the base64 encoded SVG (should look sorta like what I have above) and then click "encode" to get you encoded JSON. 

Open a new tab. And in the URL bar paste this:

```plaintext
data:application/json;base64,INSERT_YOUR_BASE64_ENCODED_JSON_HERE
```

For example, mine looks like this:

```plaintext
data:application/json;base64,ewogICAgIm5hbWUiOiAiRXBpY0xvcmRIYW1idXJnZXIiLAogICAgImRlc2NyaXB0aW9uIjogIkFuIE5GVCBmcm9tIHRoZSBoaWdobHkgYWNjbGFpbWVkIHNxdWFyZSBjb2xsZWN0aW9uIiwKICAgICJpbWFnZSI6ICJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUI0Yld4dWN6MGlhSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNakF3TUM5emRtY2lJSEJ5WlhObGNuWmxRWE53WldOMFVtRjBhVzg5SW5oTmFXNVpUV2x1SUcxbFpYUWlJSFpwWlhkQ2IzZzlJakFnTUNBek5UQWdNelV3SWo0TkNpQWdJQ0E4YzNSNWJHVStMbUpoYzJVZ2V5Qm1hV3hzT2lCM2FHbDBaVHNnWm05dWRDMW1ZVzFwYkhrNklITmxjbWxtT3lCbWIyNTBMWE5wZW1VNklERTBjSGc3SUgwOEwzTjBlV3hsUGcwS0lDQWdJRHh5WldOMElIZHBaSFJvUFNJeE1EQWxJaUJvWldsbmFIUTlJakV3TUNVaUlHWnBiR3c5SW1Kc1lXTnJJaUF2UGcwS0lDQWdJRHgwWlhoMElIZzlJalV3SlNJZ2VUMGlOVEFsSWlCamJHRnpjejBpWW1GelpTSWdaRzl0YVc1aGJuUXRZbUZ6Wld4cGJtVTlJbTFwWkdSc1pTSWdkR1Y0ZEMxaGJtTm9iM0k5SW0xcFpHUnNaU0krUlhCcFkweHZjbVJJWVcxaWRYSm5aWEk4TDNSbGVIUStEUW84TDNOMlp6ND0iCn0=
```

When you paste that full URI into your browsers address bar, you'll see the full JSON in all it's glory. **BOOOOOM!** Now we have a way to keep our JSON metadata permanent and available forever.

Here's a screenshot of mine:

![Untitled](https://i.imgur.com/y1ZaYGf.png)

Note: It's **very easy** to mess up here when your encoding + copy-pasting stuff. So, be very careful!!! And double-check everything works. If things are breaking, follow all the steps again!


🚀 Change up our contract, deploy.
--------------------

Okay awesome, we've got this fancy base64 encoded JSON file. How do we get it on our contract? Simple head to `MyEpicNFT.sol` and — we just copy-paste the whole big string into our contract.

We just need to change one line.

```solidity
_setTokenURI(newItemId, "data:application/json;base64,INSERT_BASE_64_ENCODED_JSON_HERE")
```

For example, mine looks like:

```solidity
_setTokenURI(newItemId, "data:application/json;base64,ewogICAgIm5hbWUiOiAiRXBpY0xvcmRIYW1idXJnZXIiLAogICAgImRlc2NyaXB0aW9uIjogIkFuIE5GVCBmcm9tIHRoZSBoaWdobHkgYWNjbGFpbWVkIHNxdWFyZSBjb2xsZWN0aW9uIiwKICAgICJpbWFnZSI6ICJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUI0Yld4dWN6MGlhSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNakF3TUM5emRtY2lJSEJ5WlhObGNuWmxRWE53WldOMFVtRjBhVzg5SW5oTmFXNVpUV2x1SUcxbFpYUWlJSFpwWlhkQ2IzZzlJakFnTUNBek5UQWdNelV3SWo0TkNpQWdJQ0E4YzNSNWJHVStMbUpoYzJVZ2V5Qm1hV3hzT2lCM2FHbDBaVHNnWm05dWRDMW1ZVzFwYkhrNklITmxjbWxtT3lCbWIyNTBMWE5wZW1VNklERTBjSGc3SUgwOEwzTjBlV3hsUGcwS0lDQWdJRHh5WldOMElIZHBaSFJvUFNJeE1EQWxJaUJvWldsbmFIUTlJakV3TUNVaUlHWnBiR3c5SW1Kc1lXTnJJaUF2UGcwS0lDQWdJRHgwWlhoMElIZzlJalV3SlNJZ2VUMGlOVEFsSWlCamJHRnpjejBpWW1GelpTSWdaRzl0YVc1aGJuUXRZbUZ6Wld4cGJtVTlJbTFwWkdSc1pTSWdkR1Y0ZEMxaGJtTm9iM0k5SW0xcFpHUnNaU0krUlhCcFkweHZjbVJJWVcxaWRYSm5aWEk4TDNSbGVIUStEUW84TDNOMlp6ND0iCn0=")
```

Finally, let's deploy our updated contract, mint the NFT, and make sure it works properly on OpenSea! Deploy using the same command. I changed my deploy script a little to only mint one NFT instead of two, feel free to do the same!

```bash
npx hardhat run scripts/deploy.js --network rinkeby
```

Then same as before, wait a minute or two, take the contract address, search it on [https://testnets.opensea.io/](https://testnets.opensea.io/) and you should see your NFT there :). Again, don't click "Enter" when searching -- you need to actually click the collection when it pops up in the search bar.

Note: Remember to use `https://rinkeby.rarible.com/token/INSERT_DEPLOY_CONTRACT_ADDRESS_HERE:INSERT_TOKEN_ID_HERE` if OpenSea is being slow. 

![Untitled](https://i.imgur.com/Z2mKTpK.png)



📝Something Extra: Verify contract on Etherscan.
------------------
**Note: This section is totally optional, but is a really cool part about Etherscan that you should understand.**

If you select the **Contract** tab in Etherscan, you will notice a long list of text characters that starts from `0x608060405234801...` Hmm.. what could that be 🤔 ?

![image](https://user-images.githubusercontent.com/60590919/139609052-f4bba83c-f224-44b1-be74-de8eaf31b403.png)

It turns out that this long, gibberish looking group of characters is actually the bytecodes of the contract which you have deployed! Bytecodes represent a series of opcodes in the EVM that will perform instructions for us onchain.

This is a lot of new information to understand, so don't worry if it doesn't make much sense right now. Take a moment to look up what bytecodes and EVM mean! Use Google or reach out in the `#general-chill-chat` on Discord :). [This is also a cool article](https://ethervm.io/) about EVM opcodes by the way 🤘.

So, we know that bytecodes aren't readable to us. We want to be able to see the code we wrote right in Etherscan. Luckily, Etherscan has the magic to help us do that!

Notice that there is a prompt that requests us to **Verify and Publish** our contract source code. If we follow the link, we are required to manually select our contract settings and paste our code to publish our source code.

Luckily for us hardhat offers a smarter way of doing this. 

Head back to your hardhat project and install `@nomiclabs/hardhat-etherscan` by running the command:

```
npm i -D @nomiclabs/hardhat-etherscan
```

Then in your `hardhat.config.js` add the following
```
require("@nomiclabs/hardhat-etherscan");

// Rest of code
...

module.exports = {
  solidity: "0.8.0",

  // Rest of the config
  ...,
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: "",
  }
};

```

We are almost there! You may have noticed that the `etherscan` object in our config requires an `apiKey`! This means you will need an account with Etherscan to get this key.

If you don't have an account already, head to [https://etherscan.io/register](https://etherscan.io/register) to create a free user account. After which head to your profile settings and under `API-KEYs` create a new apikey 

![image](https://user-images.githubusercontent.com/60590919/139610459-b590bbc1-0d4e-4e78-920b-c45e61bf2d7e.png)

Sweet you got your API key. Time to head back to your `hardhat.config.js` file and change the `apiKey` property to be your newly generated key.

**Note: Do not share your Etherscan api key with others**

We are down to our last step I promise. All that remains now is to run the command

```
npx hardhat verify YOUR_CONTRACT_ADDRESS --network rinkeby _totalSupply
```

If everything runs smoothly, you should see some outputs in the terminal. Mine looks like this:

![image](https://user-images.githubusercontent.com/60590919/139611432-16d8c3fc-04b1-44c8-b58a-27f49e94d492.png)

Head back to contract page in Rinkeby Etherscan by following the link returned in the terminal and you will notice that Etherscan has magically (with your help) turned the bytecodes into a much readible Solidity code.

![image](https://user-images.githubusercontent.com/60590919/139611635-3d1d7aae-8bb8-47f5-9396-6a4544badebf.png)

Everyone is able to see how awesome your smart contract looks like now !

Wait and there is more. There are now two new sub tabs `Read Contract` & `Write Contract` which we are able to use them to instantly interact with our smart contract onchain. Pretty neat!

![image](https://user-images.githubusercontent.com/60590919/139611805-b2a41039-ec79-402d-b198-4936d25ff277.png)

🚨Progress report.
------------------------
If you get a fancy NFT, make sure to send a screenshot in #progress of it on OpenSea :).
