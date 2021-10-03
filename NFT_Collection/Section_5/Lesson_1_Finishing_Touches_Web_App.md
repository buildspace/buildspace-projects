🌊 Give user their OpenSea link
--------------

One thing that’d be awesome is after the NFT is minted we actually give a link to their NFT on OpenSea that they’d be able to share on Twitter or with their friends!!

The link for an NFT on OpenSea looks like this:

`https://testnets.opensea.io/assets/0x88a3a1dd73f982e32764eadbf182c3126e69a5cb/9`

Basically, these are the variables.

`https://testnets.opensea.io/assets/INSERT_CONTRACT_ADDRESS_HERE/INSERT_TOKEN_ID_HERE`

So, our web app has the contract address, but not the token id! So, we’ll need to change up our contract to retrieve that. Let’s do it.

We’re going to be using something called `Events` in Solidity. These are sorta like webhooks. Lets write out some of the code and get it working first!

Add this line under the line where you create your three arrays with your random words!

`event NewEpicNFTMinted(address sender, uint256 tokenId);`

Then, add this line at very bottom of the `makeAnEpicNFT` function, so, this is the last line in the function:

`emit NewEpicNFTMinted(msg.sender, newItemId);`

At a basic level, events are messages our smart contracts throw out that we can capture on our client in real-time. In the case of our NFT, just because our transaction is mined **does not mean the transaction resulted in the NFT being minted**. It could have just error’d out!! Even if it error’d out, it would have still been mined in the process.

Thats why I use events here. I’m able to `emit` an event on the contract and then capture that event on the frontend. Notice in my `event` I send the `newItemId` which we need on the frontend, right :)?

Again, it’s sorta like a web hook. Except this is going to be the easiest webhook ever to setup lol.

Be sure to read more on events [here](https://docs.soliditylang.org/en/v0.4.21/contracts.html#events).

As always when we change our contract.

1. Redeploy.
2. Update contract address in `App.js`.
3. Update ABI file on the web app.

If you mess any of this up, you *will* get errors :).

Now on our frontend we add this magical line (I’ll show you where to put it in a bit).

```javascript
connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
	console.log(from, tokenId.toNumber())
	alert(`Hey there! We've minted your NFT. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: <https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`>)
});

```

Okay this is fkin epic. In real-time, we’ll capture the mint event, get the tokenId, and give the user their OpenSea link for their newly minted NFT.

The code for `App.js` and the contract is [here](https://gist.github.com/farzaa/5015532446dfdb267711592107a285a9). It’s really nothing fancy. Just setting up an event listener! I made sure to drop comments on lines I added to make it easy to see what I changed. Be sure to add a call to `setupEventListener()` in two places like I do in the code! Don't miss that :).

🖼 Colorful backgrounds!
--------------
Just for fun, I changed the contract to randomly pick a colorful background. I'm not going to go over the code here because it was just for fun but feel free to see the comments [here](https://gist.github.com/farzaa/b3b8ec8aded7e5876b8a1ab786347cc9). Remember if you change the contract you'll need to re-deploy, update the abi, and update the contract address.

😎 Set a limit on the # of minted NFTs
--------------
So, I challenge you to change your contract to only allow a set # of NFTs to be minted (for example, maybe you want only 50 NFTs to be minted max!!). It'd be even more epic if on your website it said something like `4/50 NFTs minted so far` or something like that to make your user feel super special when they get an NFT!!!

Hint, you'll need something in solidity called `require`. And, you'll like also need to create a function like `getTotalNFTsMintedSoFar` for your web app to call.


❌ Alert user when they’re on the wrong network.
--------------
Your website is **only** going to work on Rinkeby (since that's where your contract lives).

Be sure to add a nice message somewhere telling users about this. You can also make it dynamic if you want and [detect their network](https://ethereum.stackexchange.com/questions/85194/how-to-check-the-current-metamask-network) and then say something like, "Hey — I see you're connected to mainnet but this only works on Rinkeby!". You can make this as fancy as you want!

🙉 Mining animation
--------------
Some of your users might be super confused when they click mint and nothing happens for like 15 seconds lol! Maybe add a loading animation? Make it happen! Not covering it here :).


🐦 Add your Twitter
-----------------
Add your Twitter at the bottom :)! Already gave you a little template for it.

👀 Add a button to let people see the collection!
-----------------
Perhaps the most important part!

Usually, when people want to see an NFT collection, they look at it on OpenSea!! It's a super-easy way for people to get a feel for your collection. So if you link your friend your site, they'll know it's legit!!

Add a little button that says "🌊 View Collection on OpenSea" and then when your users clicks it, it links to your collection! Remember, your collections link changes every time you change the contract. So be sure to link your latest and final collection. For example, [this](https://testnets.opensea.io/collection/squarenft-vu901lkj40) is my collection.

Note: This link you'll need to hardcode. I left a variable at the top for you to fill in. It can't be dynamically generated unless you use the OpenSea API (which is overkill for now lol).


🚨 Progress report!
-----------------
You're nearly at the end :). Post a screenshot in #progress with that little pop up that that gives your user the direct OpenSea link!
