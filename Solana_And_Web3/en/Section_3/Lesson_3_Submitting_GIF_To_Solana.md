Okay — we are finally at the point where we can save some GIFs. It's so easy to do. We're just going to change up our `sendGif` function a little bit, and add one last  `import` so we now call `addGif` and then call `getGifList` so that our web app refreshes to show our latest submitted GIF!

```javascript
// Other imports...
// Add this 2 new lines
import { Buffer } from "buffer";
window.Buffer = Buffer;
```

```javascript
const sendGif = async () => {
  if (inputValue.length === 0) {
    console.log("No gif link given!")
    return
  }
  setInputValue('');
  console.log('Gif link:', inputValue);
  try {
    const provider = getProvider()
    const program = await getProgram(); 

    await program.rpc.addGif(inputValue, {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      },
    });
    console.log("GIF successfully sent to program", inputValue)

    await getGifList();
  } catch (error) {
    console.log("Error sending GIF:", error)
  }
};
```

Now, you'll be able to submit a link, approve the transaction via Phantom, and your web app should now show you the GIF you just submitted :).

### 🙈 Solve the issue of the account not persisting

So, we already went over this problem where our account is getting reset every time we refresh the page. Let's fix it.

The core problem is this line:

```javascript
let baseAccount = Keypair.generate();
```

What's happening here is we're generating a new account for our program to talk to **every time.** So, the fix here is we just need to have one keypair that all our users share.

Under the `src` directory, go ahead and create a file named `createKeyPair.js`. In there, paste this in:

```javascript
// Shoutout to Nader Dabit for helping w/ this!
// https://twitter.com/dabit3

const fs = require('fs')
const anchor = require("@project-serum/anchor")

const account = anchor.web3.Keypair.generate()

fs.writeFileSync('./keypair.json', JSON.stringify(account))
```

All this script does is it will write a key pair directly to our file system, that way anytime people come to our web app they'll all load the same key pair.

When you're ready to run this go ahead and do:

```bash
cd src
node createKeyPair.js
```

Make sure you `cd` into the directory `createKeyPair.js` is located.

This will generate a file named `keypair.json` with our fancy keypair :).

**Note for Replit users**: You can actually run shell commands directly in Replit. Click the word "Shell", then just do `cd src` and then `node createKeyPair.js` and it'll work as if you were using a local terminal!

Now that we have this file, we just need to change up `App.js` a little. At the top, you'll need to import the key pair like this:

```javascript
import kp from './keypair.json'
```

Next, delete `let baseAccount = Keypair.generate();`. Instead, we'll replace it with this:

```javascript
const arr = Object.values(kp._keypair.secretKey)
const secret = new Uint8Array(arr)
const baseAccount = web3.Keypair.fromSecretKey(secret)
```

That's it. Now, we have a permanent keypair! If you go and refresh, you'll see that after you initialize the account — it stays even after refresh :)!!! Feel free to submit a few GIFs from here.

You can also run `createKeyPair.js` as many times as you want and this will let you create a new `BaseAccount`. Though, this also means that the new account will be completely empty and have no data. It's important to understand you **aren't deleting accounts if you run** `createKeyPair.js` again. You're simply create a new account for your program to point to.

### 🚨 Progress Report

*Please do this else Farza will be sad :(*

You got GIFs submissions working!! Post a screenshot in `#progress` with your GIFs being retrieved from your Solana program :).
