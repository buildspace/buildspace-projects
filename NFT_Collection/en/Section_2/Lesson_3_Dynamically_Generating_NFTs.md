## 🔤 Randomly generate words on an image

Cool — we created a contract that's now minting NFTs all on-chain. But, it's still always the same NFT argh!!! Let's make it dynamic.

**I wrote out all the code [here](https://gist.github.com/farzaa/b788ba3a8dbaf6f1ef9af57eefa63c27) which will generate an SVG with a combination of three random words.**

I figure this would be the best way for people to kinda look at all the code at once and get a handle on how it's working.

I also wrote a comment above most of the lines I added/changed! When you look at this code, try and actually write it out yourself. Google the functions that you don't understand!

I do want to make a few notes on some of these lines.

## 📝 Pick your own words!

```solidity
string[] firstWords = ["YOUR_WORD", "YOUR_WORD", "YOUR_WORD", "YOUR_WORD", "YOUR_WORD", "YOUR_WORD"];

string[] secondWords = ["YOUR_WORD", "YOUR_WORD", "YOUR_WORD", "YOUR_WORD", "YOUR_WORD", "YOUR_WORD"];

string[] thirdWords = ["YOUR_WORD", "YOUR_WORD", "YOUR_WORD", "YOUR_WORD", "YOUR_WORD", "YOUR_WORD"];
```

These are our random words!! Please have fun with this. Just make sure each word is a single word with no spaces!

The funnier the words the better this will be lol. I liked making each array a certain theme. For example, `firstWords` could be the first names of your fav anime characters. Then, `secondWords` could be a food you like. And, `thirdWords` could be names of random animals. Have fun with it!!! Make this yours.

Here are some of mine. I like the first row to be words that feel like they "describe" something!

![](https://i.imgur.com/ADawgrB.png)

Perhaps you wanna generate a random band name. Perhaps you wanna generate random character names for your Dungeons and Dragons games. Do whatever you want. Maybe you don't give a shit about three word combinations and just want to make SVGs of pixel art penguins. Go for it. Do whatever you want :).

Note: I recommend like 15-20 words per array. I've noticed around 10 it's usually not random enough. 

## 🥴 Random numbers

```solidity
function pickRandomFirstWord
```

This function looks kinda funky. Right? Let's talk about how we're randomly picking stuff from the arrays.

So, generating a random number in smart contracts is widely known as a **difficult problem**.

Why? Well, think about how a random number is generated normally. When you generate a random number normally in a program, **it will take a bunch of different numbers from your computer as a source of randomness** like: the speed of the fans, the temperature of the CPU, the number of times you've pressed "L" at 3:52PM since you've bought the computer, your internet speed, and tons of other #s that are difficult for you to control. It takes **all** these numbers that are "random" and puts them together into an algorithm that generates a number that it feels is the best attempt at a truly "random" number. Make sense?

On the blockchain, there is **nearly no source of randomness**. It's deterministic and everything the contract sees, the public sees. Because of that, someone could game the system by just looking at the smart contract, seeing what #'s it relies on for randomness, and then the person could game it if they wanted to.


```solidity
random(string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId))));
```

What this is doing is it's taking two things: The actual string `FIRST_WORD` and a stringified version of the `tokenId`. I combine these two strings using `abi.encodePacked` and then that combined string is what I use as the source of randomness.

**This isn't true randomness.** But it's the best we got for now!

There are other ways to generate random numbers on the blockchain (check out [Chainlink](https://docs.chain.link/docs/chainlink-vrf/)) but Solidity doesn't natively give us anything reliable because it can't! All the #'s our contract can access are public and never truly random.

This can be a bit annoying for some application like ours here! In any case, no one is going to be attacking our tiny app but I want you to know all this when you're building a dApp that has millions of users!

## ✨  Creating the SVG dynamically

Check out the variable `string baseSvg` on the contract. This looks wild lol. Basically, the only piece of our SVG that ever changes is the three-word combo, right? So what we do is we create a `baseSvg` variable we can reuse over and over as we create new NFTs.

We then put all together using:

```
string memory finalSvg = string(abi.encodePacked(baseSvg, first, second, third, "</text></svg>"));
```

`</text></svg>` are the closing tags! So for `finalSvg` we're saying, "Hey — go combine my baseSVG, my three-word combo I just generated, and then my closing tags. That's it :)! It looks scary but all we're doing is working with the SVG code.

## 😎 Run it!

Once you write it all out, go ahead and run it using `npx hardhat run scripts/run.js`. Check out what's output by `console.log(finalSvg);`.

Here's what I get in my terminal.

```plaintext
This is my NFT contract. Woah!
Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3

--------------------
<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>SandwichSakuraNinja</text></svg>
--------------------

An NFT w/ ID 0 has been minted to 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266

--------------------
<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>GoatSasukeNinja</text></svg>
--------------------

An NFT w/ ID 1 has been minted to 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
```

Haha, that's a lot of stuff. Go ahead and copy one of the SVGs that was output in your terminal and paste it [here](https://www.svgviewer.dev/) to see what you get.

You'll be able to see the SVG that was generated! Here's mine:

![Untitled](https://i.imgur.com/uS8SXYu.png)

**LETS GOOOOOOOO!!!!** We randomly generated this in our contract! If you take the other SVG you generated, you'll notice it's different as well. It's all being generated on the fly. YAY.

👩‍💻 Dynamically generate the metadata.
------------------

Now, we need to actually set the JSON metadata! First, we need some helper functions. Create a folder called `libraries` under `contracts`. In `libraries` create a file named `Base64.sol` and copy-paste the code from [here](https://gist.github.com/farzaa/f13f5d9bda13af68cc96b54851345832) into there. This file has some helper functions created by someone else to help us convert our SVG and JSON to Base64 in Solidity.

Okay, now for our updated contract.

**Same thing, I wrote out all the code and added comments [here](https://gist.github.com/farzaa/dc45da3eb91a41913767f3eb4d7830f1).**

Feel free to copy-paste some of these pieces and understand how it works after you run it :). I sometimes like doing this because I can see the code run and understand how it works after!!

Once I run the contract now here's what I get:

```plaintext
Compilation finished successfully
This is my NFT contract. Woah!
Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3

--------------------
data:application/json;base64,eyJuYW1lIjogIlNhbmR3aWNoU2FrdXJhTmluamEiLCAiZGVzY3JpcHRpb24iOiAiQSBoaWdobHkgYWNjbGFpbWVkIGNvbGxlY3Rpb24gb2Ygc3F1YXJlcy4iLCAiaW1hZ2UiOiAiZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlCNGJXeHVjejBuYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2TWpBd01DOXpkbWNuSUhCeVpYTmxjblpsUVhOd1pXTjBVbUYwYVc4OUozaE5hVzVaVFdsdUlHMWxaWFFuSUhacFpYZENiM2c5SnpBZ01DQXpOVEFnTXpVd0p6NDhjM1I1YkdVK0xtSmhjMlVnZXlCbWFXeHNPaUIzYUdsMFpUc2dabTl1ZEMxbVlXMXBiSGs2SUhObGNtbG1PeUJtYjI1MExYTnBlbVU2SURJMGNIZzdJSDA4TDNOMGVXeGxQanh5WldOMElIZHBaSFJvUFNjeE1EQWxKeUJvWldsbmFIUTlKekV3TUNVbklHWnBiR3c5SjJKc1lXTnJKeUF2UGp4MFpYaDBJSGc5SnpVd0pTY2dlVDBuTlRBbEp5QmpiR0Z6Y3owblltRnpaU2NnWkc5dGFXNWhiblF0WW1GelpXeHBibVU5SjIxcFpHUnNaU2NnZEdWNGRDMWhibU5vYjNJOUoyMXBaR1JzWlNjK1UyRnVaSGRwWTJoVFlXdDFjbUZPYVc1cVlUd3ZkR1Y0ZEQ0OEwzTjJaejQ9In0=
--------------------

An NFT w/ ID 0 has been minted to 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266

--------------------
data:application/json;base64,eyJuYW1lIjogIkdvYXRTYXN1a2VOaW5qYSIsICJkZXNjcmlwdGlvbiI6ICJBIGhpZ2hseSBhY2NsYWltZWQgY29sbGVjdGlvbiBvZiBzcXVhcmVzLiIsICJpbWFnZSI6ICJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUI0Yld4dWN6MG5hSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNakF3TUM5emRtY25JSEJ5WlhObGNuWmxRWE53WldOMFVtRjBhVzg5SjNoTmFXNVpUV2x1SUcxbFpYUW5JSFpwWlhkQ2IzZzlKekFnTUNBek5UQWdNelV3Sno0OGMzUjViR1UrTG1KaGMyVWdleUJtYVd4c09pQjNhR2wwWlRzZ1ptOXVkQzFtWVcxcGJIazZJSE5sY21sbU95Qm1iMjUwTFhOcGVtVTZJREkwY0hnN0lIMDhMM04wZVd4bFBqeHlaV04wSUhkcFpIUm9QU2N4TURBbEp5Qm9aV2xuYUhROUp6RXdNQ1VuSUdacGJHdzlKMkpzWVdOckp5QXZQangwWlhoMElIZzlKelV3SlNjZ2VUMG5OVEFsSnlCamJHRnpjejBuWW1GelpTY2daRzl0YVc1aGJuUXRZbUZ6Wld4cGJtVTlKMjFwWkdSc1pTY2dkR1Y0ZEMxaGJtTm9iM0k5SjIxcFpHUnNaU2MrUjI5aGRGTmhjM1ZyWlU1cGJtcGhQQzkwWlhoMFBqd3ZjM1puUGc9PSJ9
--------------------

An NFT w/ ID 1 has been minted to 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
```

THIS IS EPIC.

WE JUST DYNAMICALLY GENERATED FULL NFTS. ON-CHAIN. THIS IS AN EPIC MOMENT.

If you take one of the `data:application/json;base64` blobs and drop it in your browser address bar, you'll see all the JSON metadata just like we had before. Except now, it's all done automatically and on our contract :).

👀 How tf does `finalTokenUri` work?
------------------

That big line with `string memory json = Base64.encode` may look pretty confusing, but, there is a much cleaner way to go about it.

```solidity
string memory json = Base64.encode(
    bytes(
        string(
            abi.encodePacked(
                '{'
                    '"name": "', combinedWord, '", '
                    '"description": "A highly acclaimed collection of squares.", '
                    '"image": "data:image/svg+xml;base64,', Base64.encode(bytes(finalSvg)), '"'
                '}'
            )
        )
    )
);
```

All we're doing is we're base64 encoding the JSON metadata! But — it's all **on-chain**. So, all that JSON will live on the contract itself.

We also dynamically add the `name` and the base64 encoded SVG as well!

Finally, we've got this `finalTokenUri` where we put it all together where we do:

```solidity
abi.encodePacked("data:application/json;base64,", json)
```

All that's happening here is we're putting it all together and adding that same old `data:application/json;base64,` we did before and then we append the base64 encoded json!!

## 🛠 Debugging the `finalTokenUri` content

Now that you have your tokenURI setup, how do we know if it's actually correct? After all, this holds all our data for our NFT! You can use a cool tool like - [NFT Preview](https://nftpreview.0xdev.codes/) to see a quick preview of the image and the contents of the json without deploying it again and again on the OpenSea testnet. 

To make it easier, you can pass the `tokenURI` code as a query parameter like this,

```solidity
string memory finalTokenUri = string(
    abi.encodePacked("data:application/json;base64,", json)
);

console.log("\n--------------------");
console.log(
    string(
        abi.encodePacked(
            "https://nftpreview.0xdev.codes/?code=",
            finalTokenUri
        )
    )
);
console.log("--------------------\n");
```
![image](https://i.imgur.com/CsBxROj.png)

## 🚀 Deploy to Goerli

The coolest part is we can just re-deploy without changing our script using:

```bash
npx hardhat run scripts/deploy.js --network goerli
```

Once we redeploy, you'll be able to see your NFTs on [https://testnets.opensea.io](https://testnets.opensea.io/) once you search the newly deployed contract address. Again, **don't click enter**. OpenSea is weird so you'll need to click the collection itself when it comes up.

Note: Remember to use `https://testnet.rarible.com/token/INSERT_DEPLOY_CONTRACT_ADDRESS_HERE:TOKEN_ID` if you're using Rarible.

Contracts are **permanent**. So, whenever we re-deploy our contract we're actually creating a whole new collection.

You should be able to see the new collection on OpenSea :)!

## 🤖 Allowing users to mint

Epic — we're now able to mint NFTs dynamically and we have this function `makeAnEpicNFT` that users can call. Lots of progress has been made!! Buuuuuut there's no way for random people to actually mint NFTs rn :(. 

All we need is a website that lets users mint an NFT themselves. 

So, let's build that :)!

## 🚨Progress report

If you got one, send a screenshot in #progress of your new dynamically generated NFT on OpenSea :). Also -- if you haven't tweeted an image of your hilarious NFT collection yet now is the time to do so!! Remember to tag @_buildspace!!! We'll RT as many people as we can!
