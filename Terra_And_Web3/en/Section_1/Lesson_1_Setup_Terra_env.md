### 🦾 What are we going to do?
The first thing we'll do is set up our environment so we can start building. We'll install all the system dependencies and then the special Terra stuff.

Once we're done, we'll write a smart contract from zero(ish) and deploy! Our contract will let us store data to the Terra blockchain, retrieve it, and update it.

After we've deployed, we'll hook it up to our React web application so we can interact with it!

#### 🪟 WINDOWS USERS!
The stuff we need to install currently only runs on MacOS and Linux devices. You're going to need to use Windows Subsystem for Linux 2. It's pretty easy, just check out [the official instructions](https://docs.microsoft.com/en-us/windows/wsl/install) and [this guide](https://www.codingwithcalvin.net/installing-docker-and-docker-compose-in-wsl2ubuntu-on-windows/) to install docker-compose in wsl2. Throughout this project, whenever I say "in a terminal", you'll need to open a terminal inside WSL2! I recommend also installing the [Windows Terminal](https://www.microsoft.com/en-us/p/windows-terminal/9n0dx20hk701) app, it's pretty slick.

### 🚢  Install Docker 
If you already have Docker with Docker compose installed, you can skip this.

We're going to need docker for running a local version of the Terra blockchain on our PC.

Go [here](https://www.docker.com/products/docker-desktop/) and download the installer for your operating system and chip. Follow the instructions to set it up. 

🍏 If you're on an M1 device, go for "Mac with Apple Chip". 

🪟 If you're on Windows, make sure you check "Install required Windows components for WSL 2" in the installer as we'll be using WSL 2. After install, head over to Docker settings and make sure you have "Use the WSL 2 based engine" checked.

🐧 Docker desktop for Mac OS and Windows comes with Docker Compose, which we will need. If you're on Linux, you'll also need to install Docker Compose separately.  

🚨 Finally, make sure you go to the Docker preferences and increase the memory (RAM) limit to at least 8 GB.

![](https://hackmd.io/_uploads/By6UNfRN5.png)

### 🛢 Install NodeJS v16 
If you already have NodeJS v16 installed, you can skip this.

We'll be using NodeJS and the Node Package Manager for a bunch of stuff, especially our React web app. I recommend installing Node with Node Version Manager (NVM). Launch a terminal and run these:

To download:
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

To install:
```
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```


If you face issues, check the troubleshooting steps listed [here](https://github.com/nvm-sh/nvm#installing-and-updating) to set it up. 

Once done, just run `nvm install v16` in your terminal to install it. Please note that you may have issues with other versions of Node, v16 is highly recommended.


### ⚙️ Install Rust
We're going to be writing our smart contracts in Rust.

Run this in your terminal:
```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```
Check that it was installed correctly with 
```
rustup -V
```
This should have printed out the version, I see
```
rustup 1.24.3 (ce5817a94 2021-5-31)
```

Now we're ready to configure Rust for Terra 
```
# 1. Set 'stable' as the default release channel:
rustup default stable

# 2. Add WASM as the compilation target:
rustup target add wasm32-unknown-unknown

# 3. Install the following packages to generate the contract:
cargo install cargo-generate --features vendored-openssl
cargo install cargo-run-script
```

### 🌎 Install Terrain and LocalTerra
If you've done Solidity development before, Terrain and LocalTerra combine to do what Hardhat does. We'll use LocalTerra to run a local network, and Terrain to deploy and test our smart contract. 

**Terrain**
Terrain is a development environment which will let us deploy and interact with contracts easily via the terminal. Setup is easy, just run:
```
npm install -g @terra-money/terrain
```

Done. You can check that it installed correctly with `terrain --version`. Here's what I see when I run this:
```
@terra-money/terrain/0.2.0 darwin-arm64 node-v16.14.2
```

**LocalTerra**
Finally, we'll set up LocalTerra, which (you guessed it) will let us run a local version of the Terra network. This means we won't have to deploy our contract to a testnet to play around with it! The faster we can test, the more we can build B)


I recommend creating a dedicated folder for your project. I'm calling mine `Learn-Terra` and putting it on the desktop. From now on, I'm going to start putting the  directories at the top of the command block so it's easier to keep track of. You can see I've added `#Desktop` at the top to remind you where these commands are supposed to be run.
```
# Desktop/
mkdir Learn-Terra
cd Learn-Terra
```
You can put this folder anywhere you want, just make sure you remember where you put it and only do Terra dev stuff here or you'll lose your progress. 

Now to download LocalTerra:
```
# Desktop/Learn-Terra
git clone --branch v0.5.2 --depth 1 https://github.com/terra-money/localterra
```

To actually run a local network, you'll have to navigate into that folder and run docker compose:
```
cd localterra
docker-compose up
```

You'll see a bunch of stuff printed out on terminal. The network will keep running as long as this terminal is running. You can stop it with `CTRL+C`. I recommend keeping it open and opening a new terminal window for using Terrain. 

**Windows users**
You might also need to start docker service in WSL2 if it's not started by running `dockerd` or `sudo dockerd`. Once that's done, you can then start running docker-compose up. If you ran `sudo dockerd`, you'll need to run `sudo docker-compose up`. Finally, if you're on the latest version of `docker-compose`, you may need to delete `pull_policy: always` in the `docker-compose.yml` file. You got this!


Ta-da! You're ready to start smart contract development for Terra. Let's try it out by deploying a simple contract.

### 🧪 Deploy a dApp and interact with it using Terrain
Now that we have everything set up, let's create and deploy a template contract. We'll use Terrain to generate a bunch of boilerplate files for us using the `terrain new` command. I'm calling my dApp `clicker-portal`, you can call it whatever you want. Open a new terminal window, navigate to the `Learn-Terra` directory and run: 
```
# Desktop/Learn-Terra/
terrain new clicker-portal
```

Navigate to your dApp folder and finish setup with
```
cd clicker-portal
npm install
```

Note: if you see a warning about vulnerabilities, don't worry about them right now! <br>
**DO NOT** run `npm audit fix`. It can break things!

And now to deploy:
```
terrain deploy counter --signer test1
```

After a bunch of compiling and downloading, you should see something like this printed in your terminal:
```
done
Finished, status of exit status: 0
storing wasm bytecode on chain... done
code is stored at code id: 1
instantiating contract with code id: 1... done
```
This may take a while (2-4 minutes) the first time. If it gets stuck on `Compiling cosmwasm-std v0.16.7` for longer than 2 minutes, just cancel the process with `CTRL+C` and try it again.

Way to go! You just uploaded and deployed your first Terra smart contract. Terrain makes interacting with it easy. In the same terminal, just run:
```
# Desktop/Learn-Terra/clicker-portal
# This will start the Terrain console
terrain console
# This will increment a value on our contract stored on-chain
await lib.increment()
# This will retrieve the value from the network
await lib.getCount()
# You should see {count: 1} printed here
```

We're now ready to start building our dApp! 

### 🏖 Take a break? Here's what you need to get back
If at any time during this project you close your editor or turn off your PC, here's what you'll need to do to get back:

1. Start the Docker Desktop application
2. Run LocalTerra  

Open the `localterra` folder in your terminal and run:
```
# Desktop/Learn-Terra/localterra/
docker-compose up
```
Your localterra folder should be inside your `Learn-Terra` folder.

3. Open a new terminal window and navigate to your dApp folder to run Terrain commands. I named mine "clicker-portal"
```
# Desktop/Learn-Terra/
cd clicker-portal
```

You're ready to go again!

### 🙈 Common issues
**LocalTerra**  
> I can't run LocalTerra! I get this when running `docker-compose up`:
```
Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?
```
You're not running the Docker Desktop application. Please start it first.

**Terrain**  
> `ENOENT`

Anything to do with `Code: ENOENT` means you're in the wrong directory (folder)! Make sure you're in the project folder created by Terrain (`clicker-portal`) and try again.


> I can't deploy with Terrain! I get this:
```
using pre-baked 'test1' wallet on localterra as signer
    Error: connect ECONNREFUSED 127.0.0.1:1317
    Code: ECONNREFUSED
```
You don't have a local Terra network running. Open a second terminal window, navigate to your `localterra` folder and run `docker-compose up` to start a local network. 

> I get ECONNRESET when deploying with Terrain:
```
using pre-baked 'test1' wallet on localterra as signer
    Error: socket hang up
    Code: ECONNRESET
```
Your local network hasn't finished setting up. Please wait 30 seconds and try again.


### 🚨 Progress Report
*Please do this else Raza will be sad :(*

That wasn't too bad!!! Docker and Terrain make things easier than doing everything yourself. Post a screenshot of your counter working in #progress so people know you made it :).
