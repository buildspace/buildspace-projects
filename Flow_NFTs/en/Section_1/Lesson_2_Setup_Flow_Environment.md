One of the big things the Flow playground can't do is deploy contracts to the testnet. Time to graduate from the playground to a proper development environment. 

### 🤠 Install the Cadence VS Code extension
First, [download and install VS Code](https://code.visualstudio.com/download) if you don't have it already. We're gonna need the Cadence extension which is officially available for VS Code and unofficialy for the [IntelliJ platform](https://github.com/cadence-tools/cadence-for-intellij-platform#installation).

MacOS/Linux users can install the extension from the marketplace:
![](https://hackmd.io/_uploads/HyJKJIdK5.png)

**WINDOWS USERS!**
Due to issues with the latest version (0.7.0) of the extension on Windows, you'll have to install Windows Subsystem for Linux and do this entire project inside WSL. This is pretty easy! Check out [the official instructions](https://docs.microsoft.com/en-us/windows/wsl/install) and follow complete installation. Throughout this project, whenever I say "in a terminal", you'll need to open a terminal inside WSL2! This is easier if you install the Remote WSL `https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl` extension which will let you remotely work in Linux.

Here's a video I made explaining this process:

[Loom](https://www.loom.com/share/39909f64123a400ebd113d8382a0c726)

If you can't set up WSL on your machine, you'll have to use manually install an older version of the Cadence extension.

Launch the terminal and run these commands:
```
git clone -b submissions/issue-3/koala https://github.com/onflow/vscode-cadence.git
cd vscode-candence
npm i
npm run package
code --install-extension cadence-0.6.4.vsix
```

This will download the older version, navigate into its folder, install the dependencies, build it, and then install it into VS Code. You'll also need to disable automatic updates so VSCode doesn't update it lol, open settings (CTRL+,) and search for extension auto update and make sure it's set to none!

![](https://hackmd.io/_uploads/rJ940HuY9.png)

Please note that while the older version runs, it has issues with the emulator. I highly recommend setting up WSL!  

### 🤠 Install the Cadence extension for the IntelliJ platform
As mentioned, the extension isn't officially supported on IntelliJ. It's also missing some features (at the time of writing), so I'll leave it up to you to decide if you want to use it. I recommend just sticking with VS Code. You can find the IntelliJ version [here](https://github.com/cadence-tools/cadence-for-intellij-platform#installation).
![](https://user-images.githubusercontent.com/231274/175892621-ac4e8764-36b5-4f4a-b16d-2a214bd0ee0a.png)


### 🎮 Install the Flow CLI
Next, we're going to install the Flow CLI. This is easy!

**Mac Users**
Open up your terminal and inject this Homebrew.
```
brew install flow-cli
```

**Linux and WSL users**
Run this in your terminal:
```
sh -ci "$(curl -fsSL https://storage.googleapis.com/flow-cli/install.sh)"
```
If `flow version` is unrecognized after this, run `export PATH=$PATH:/home/YOUR_MACHINE_NAME_HERE/.local/bin`

**Windows** 
If you installed WSL, run the Linux command that's above ^.

If you wanna try your luck on native Windows, open up PowerShell and run:
```
iex "& { $(irm 'https://storage.googleapis.com/flow-cli/install.ps1') }"
```

That's it! You can check your install by running 
```
flow version
```

Here's what I see on Windows:
![](https://hackmd.io/_uploads/r12cwfUO9.png)

And on MacOS:
![](https://hackmd.io/_uploads/SyhyiK_K5.png)

Your version might be different, that's okay! 

The Flow CLI lets us do a bunch of cool stuff. We can use it to talk to the Flow network, deploy contracts and even send transactions. Let's use it to set up a Flow project!

### 🐣 Set up a Flow project
Alrighty, we're ready to get started. Create a `Learn-Flow` folder somewhere on your machine. This folder will contain all of our project files. I'm gonna keep mine on the desktop.

```
# Desktop/
mkdir Learn-Flow
cd Learn-Flow
```

Now let's create a folder for our smart contract and initialise a flow project in it
```
# Desktop/Learn-Flow
mkdir FlowNFTs
cd FlowNFTs
flow init
```

![](https://hackmd.io/_uploads/Bkd8HIOtq.png)

This will create a `flow.json` file which has basic configuration details for the Flow blockchain. You can read more about these on [the configuration page here](https://docs.onflow.org/flow-cli/configuration/).

We'll work with this file a bunch so you'll learn all about it soon!

🚨**RESTART EDITOR HERE**🚨
It's a good idea to restart your VSCode editor here so the installed Cadence extension detects that you're about to write flow and kicks in!

You can open the `FlowNFTs` folder in VS Code by entering `code .` in the terminal. If this doesn't do anything, you haven't installed the shell command on your machine. You can install it by launching the command palette (`CMD/CTRL`+`SHIFT`+`P`) and typing "shell command".

![](https://hackmd.io/_uploads/ByLsN8dYq.png)

### 🔥 Deploy a contract locally
So quick recap, we have our FLOW CLI installed, we initialized our FLOW project and we set up our testnet account. Cool beans. Let's now write a simple contract and deploy it locally.

In your `FlowNFTs` folder, create a `contracts` directory, and make an NFT contract file. I'm calling mine `BottomShot.cdc` (the opposite of TopShot lol), you can call it whatever you want.

Open this file in VS Code and add this baby NFT contract in it:
```cdc
pub contract BottomShot {

    // Declare an NFT resource type
    pub resource NFT {
        // The ID that differentiates each NFT
        pub let id: UInt64

        // String mapping to hold metadata
        pub var metadata: {String: String}

        // Initialize both fields in the init function
        init(initID: UInt64) {
            self.id = initID
            self.metadata = {}
        }
    }

    // Create a single new NFT and save it to account storage
    init() {
        self.account.save<@NFT>(<-create NFT(initID: 1), to: /storage/BottomShot1)
    }
}
```
This contract is pretty straightforward. It lets you create individual NFTs which have just two attributes: the ID and the metadata string. We

```
self.account.save<@NFT>(<-create NFT(initID: 1), to: /storage/BottomShot1)
```
This is where we create an NFT. We're not checking IDs so it's possible to create multiple NFTs with the same ID, which is okay for now. We're not setting the metadata string so this is a very useless NFT haha

Syntax breakdown:
- `self.account.save`: Call the save function on the account that deployed this contract
- `<@NFT>`: We're saving a resource of type NFT
- `<-`: Moving a resource (can't use "=")
- `create NFT(initID: 1)`: Creating an NFT, passing in the id argument 1
- `to: /storage/BottomShot1`: The second argument the save function takes - where we want to save it

Next we're gonna do something pretty magical: we're going to create a blockchain!

The Flow CLI comes with something called the Flow Emulator - a lightweight tool that emulates the behaviour of the real Flow network. It basically creates a local Flow blockchain on your machine. You can start it by running this in your terminal
```
flow emulator
```

Since this is emulating a real blockchain network, you will need to keep the terminal running to keep the blockchain alive. 

**NOTE - EXTENSION ISSUES** 
The Cadence extension sometimes doesn't detect that you've started your emulator. If you see a "Emulator is Offline" message at the start of your contract file, close the terminal window running the emulator and click the message in your file instead.

![](https://hackmd.io/_uploads/SyllhDjdFc.png)

This will start the terminal in its own window and will attach it to the extension. 
![](https://hackmd.io/_uploads/S15uOodYc.png)

Let's deploy a contract on this local blockchain. Create a new terminal window and run this:
```
flow accounts add-contract BottomShot ./contracts/BottomShot.cdc
```

The syntax here is 
```
flow accounts add-contract <name> <filename>
```

This will add the contract to our local emulator, here's what my terminal shows:

![](https://hackmd.io/_uploads/rk-2nqdY9.png)

As long as the terminal that has my emulator is running, this contract will be accessible there. 

**NOTE - EXTENSION ISSUES!**
Again, the extension can sometimes not detect that you've just deployed a contract. If this happens to you, just restart your editor and **only** use the extension prompts! Don't use the commands!

![](https://hackmd.io/_uploads/HkDjFoOF5.png)

Nicely done! That's how easy it is to develop locally on Flow. We're now ready to go all the way with a proper NFT contract, not just one that makes blank NFTs.

### 🚨 Progress report
Hi there Flow smart contract writer. 

Post a screenshot of your terminal output showing the contract deployed locally!
