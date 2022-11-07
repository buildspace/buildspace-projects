It's time to go back. All the way back to kindergarten. Remember what the first thing you ever learned was? The alphabet. Once you had conquered all 26, you learned how to read. That's where your journey to becoming a Solana developer began. The singular skill of reading English is what empowered you to become the glass-chewing gigabrain you are now. 

Time to do it again. We'll pick up where your kindy teacher should have left off - reading data from the blockchain. 

#### 👜 Accounts on Solana
Starting with the Solana Alphabet, we have A for accounts. We're starting with accounts because smart contracts on Solana, referred to as "programs", are stateless - meaning they don't store anything except code. Everything happens in accounts so they're central to Solana, they're used for storage, contracts, and for native blockchain programs.  

There are three types of accounts on Solana -  
1. Data accounts - these store data lol
2. Program accounts - these store executable programs (AKA smart contracts)
3. Native accounts - these are for core blockchain functions like Stake, Vote 

Native accounts are what the blockchain needs to function, we'll dive into that later. For now, we'll just work with data and program accounts.

Within data accounts, you have two further types -
1. System owned accounts
2. PDA (Program Derived Address) accounts

We'll get to what these actually are soon :tm:, just go along for now. 

Each account comes with a number of fields that you should know about: 

| Field      | Description                                    |
| ---------- | ---------------------------------------------- |
| lamports   | The number of lamports owned by this account   |
| owner      | The program owner of this account              |
| executable | Whether this account can process instructions (is executable)  |
| data       | The raw data byte array stored by this account |
| rent_epoch | The next epoch that this account will owe rent |

We're gonna focus only on stuff we need to know about right now, so if something doesn't make sense, just keep going - we'll start filling in the gaps as we go along.

Lamports are the smallest unit of Solana. If you're familiar with Ethereum ecosystem this is sorta like Gwei. One lamport = 0.000000001 SOL, so this field just tells us how much SOL the account has.

Each account has a public key - it acts like an address for the account. Ya know how your wallet has an address that you use for receiving those spicy NFTs? Same thing! Solana addresses are just base58 encoded strings.

`executable` is a boolean field that tells us if the account contains executable data. Data is what's stored in the account, and rent we'll cover later! 

Let's stick with the simple stuff for now :)

#### 📫 Reading from the network
Alright, we know what accounts are, how do we read them? We'll use something called a JSON RPC endpoint! Check out this diagram, you'd be the client here, trying to read stuff from the Solana network.  
![](https://hackmd.io/_uploads/HyGV685Gi.png)

You make an API call to the JSON RPC with the stuff you want, it communicates with the network and gives you the goodies.

If we wanted to get the balance of an account, here's what the API call would look like - 
```ts
async function getBalanceUsingJSONRPC(address: string): Promise<number> {
    const url = clusterApiUrl('devnet')
    console.log(url);
    return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "jsonrpc": "2.0",
            "id": 1,
            "method": "getBalance",
            "params": [
                address
            ]
        })
    }).then(response => response.json())
    .then(json => {
        if (json.error) {
            throw json.error
        }

        return json['result']['value'] as number;
    })
    .catch(error => {
        throw error
    })
}
```

A bunch of stuff is happening here. We're making a post request where the body has specific parameters telling the RPC what to do. We need to specify the version of the RPC, the id, the method, which in this case is get balance and the parameters that that method needs, which in this case is just address.

We have a bunch of boilerplate for a really simple method, so instead, we can use Solana’s Web3.js SDK. Here's what it takes:
```ts
async function getBalanceUsingWeb3(address: PublicKey): Promise<number> {
    const connection = new Connection(clusterApiUrl('devnet'));
    return connection.getBalance(address);
}
```

Ain't that pretty? All we need to do to get someone's Solana balance is these three lines. Imagine if it was that easy to get anyone's bank balance. 

Now you know how to read data from accounts on Solana! I know this may *seem* insignificant, but just using this one function, you can get the balance of **any** account on Solana. Imagine being able to get the bank balance of any bank account on the planet, that's how powerful this is.

#### 🤑 Build a balance fetcher
Time to build a universal balance fetcher (assuming the entire universe is on Solana). It'll be a simple but powerful app that will fetch the balance of any account on Solana.

Create a folder somewhere on your workspace. I'm putting mine on the desktop. Clone the [starter repo](https://github.com/buildspace/solana-intro-frontend/tree/starter) and set it up:

```bash!
git clone https://github.com/buildspace/solana-intro-frontend.git
cd solana-intro-frontend
git checkout starter
npm i
```

This is a simple Next.js app so you can start it up with `npm run dev` in the terminal once the dependencies are all installed. You should see this on localhost:

![](https://hackmd.io/_uploads/HklwcED9zj.png)

We've given you a plain Next.js app with some styling, if you enter something in the address field and hit the "Check SOL balance" button, you'll see a balance of 1,000 SOL. Time to make it work.

To start, you wanna install the Solana/web3.js library:
```bash
npm install @solana/web3.js
```

This will give us a super simple function to fetch the balance. Head over to `index.tsx` and import it at the top:
```js
import * as web3 from '@solana/web3.js'
```

Next, we'll work on the `addressSubmittedHandler` function. The first thing we wanna do here is convert the address from `string` to public key. Remember - the address isn't *actually* a string, we just represent it as one in JS.

```ts
  const addressSubmittedHandler = (address: string) => {
    const key = new web3.PublicKey(address);
    setAddress(address)
    setBalance(1000)
  }
```

This will validate that whatever you pass in is actually a Solana address. Now if you enter something that isn't a key in the address field, you'll see that the app crashes. Nice!

Now to use the key, we'll make a new connection to the JSON RPC. With the connection, we'll use the `getBalance` function and set the result with `setBalance`! Here's the completed function:

```ts
  const addressSubmittedHandler = (address: string) => {
    const key = new web3.PublicKey(address);
    setAddress(key.toBase58())

    const connection = new web3.Connection(web3.clusterApiUrl('devnet'))
    
    connection.getBalance(key).then(balance => {
      setBalance(balance / web3.LAMPORTS_PER_SOL)
    })
  }
```

A few new things here - 
* We're setting the address with `key.toBase58`. This is the encoding of Solana addresses as strings. 
* We're connecting to the `devnet` network. There's three networks - mainnet, testnet, and devnet. We'll use devnet for everything.
* We're converting the balance from Lamports to SOL - the balance is returned in Lamports, not SOL.

And we're done! If you paste in an address here, you'll see the balance. Make sure your account has devnet SOL on it! If it doesn't, you can use my account to test your app - `B1aLAAe4vW8nSQCetXnYqJfRxzTjnbooczwkUJAr7yMS`.

This is pretty good, but if you mess up the address, you get a nasty error. Let's add some error handling to take care of that  

```ts
  const addressSubmittedHandler = (address: string) => {
    try {
      setAddress(address)
      const key = new web3.PublicKey(address)
      const connection = new web3.Connection(web3.clusterApiUrl('devnet'))
      connection.getBalance(key).then(balance => {
        setBalance(balance / web3.LAMPORTS_PER_SOL)
      })
    } catch (error) {
      setAddress('')
      setBalance(0)
      alert(error)
    }
  }
```

You should now get a prompt instead :D

WOW. YOU JUST SHIPPED YOUR FIRST SOLANA APP. LFGGGGGGGGGGGGGGGG! 

#### 🚢 Ship challenge
Let’s put your knowledge to the test with a tiny challenge. Starting with the app you just finished, add another line item to the UI that displays whether or not the entered address is an executable account or not.

![](https://hackmd.io/_uploads/rJU2pwqzo.png)

To find out if an account is executable, you’ll:
1. Use the method `getAccountInfo` to get a JSON object with information about the account
2. Check its properties to find out if its executable
3. Add another call to useState that let’s you set the executable property value from the account info and display it in the UI

Here's an account address that is executable for testing - `ComputeBudget111111111111111111111111111111`.

Don't look at the solution until you've made a solid attempt on your own!!! This one's ezpz lemon squeezy.

When you're done, check out the reference on the challenge-solution branch [here](https://github.com/buildspace/solana-intro-frontend/tree/challenge-solution).
