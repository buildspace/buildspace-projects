Time to go pro. The Solana playground is an amazing tool to get started and deploy to the devnet. However, it's not yet fit for local development, which is how the pros do it. 

Local set up takes a few steps but it's a lot more powerful - you'll basically be running a local version of the Solana network on your machine. This comes with a host of benefits, including having practically infinite SOL.

There's two main parts to this setup - 
1. The Rust compiler
2. The Solana CLI 

**Windows users**
While the Solana CLI works on windows, it's a much better experience to run it on Linux - you won't run into windows specific issues and can use the same commands as MacOS/Linux users.

What you wanna do here is install Windows Subsystem for Linux. Check out the docs on how to do that [here](https://learn.microsoft.com/en-us/windows/wsl/install), they're super helpful. 

From this point onwards, every time I ask you to run a Solana command, you should be running it **inside** WSL2. I highly recommend installing the [Windows Terminal](https://apps.microsoft.com/store/detail/windows-terminal/9N0DX20HK701?hl=en-nz&gl=nz) app, it's got a slick UI and lets you easily switch to WSL2:

![](https://hackmd.io/_uploads/BJ7ZoX0No.png)

You're gonna install the Solana CLI and the Rust compiler *inside* WSL2. This is a separate environment from your Windows install, so you'll get errors if you try to run commands in the wrong place!!!

#### 🦀 Install the Rust compiler 
The best way to do this is by following the official guide. Check them out [here](https://www.rust-lang.org/tools/install).

#### 🏄‍♂️ Install the Solana CLI
I remember the time it used to take a few hours to get the Solana CLI up and running. These days it's just a couple commands!

You can find them for your specific operating system [here](https://docs.solana.com/cli/install-solana-cli-tools). 

**Windows users should follow the Linux install instructions!**

Once you're all done with install, you should get a version printed out instead of an error when your run
```
solana --version
```

If you're sure you've installed everything but are still getting errors, close all your terminal windows and try again in a new one.

#### ⚙ Solana config
The Solana CLI has a few things you can configure, such as which network you want to connect to and where your keypair is. You can get a report of the current config using this command:
```bash
solana config get
```

Here's what I see:
```
Config File: /home/endgame/.config/solana/cli/config.yml
RPC URL: http://localhost:8899
WebSocket URL: ws://localhost:8900/ (computed)
Keypair Path: /home/endgame/.config/solana/id.json
Commitment: confirmed
```

Interesting! Here's what each of these mean:
- `Config File` - the file Solana CLI is located on your computer
- `RPC URL` - endpoint you are using, connecting you to localhost, Devnet, or Mainnet
- `WebSocket URL` - the websocket to listen for events from the cluster you are targeting (computed when you set the `RPC URL`)
- `Keypair Path` - the keypair path used when running Solana CLI subcommands
- `Commitment` - provides a measure of the network confirmation and describes how finalized a block is at that point in time

You can use the `config set --url` command to change the `RPC URL`:
```
solana config set --url localhost

solana config set --url devnet

solana config set --url mainnet-beta
```

We devs need to press fewer keys in life so these can be shortened to:
```
solana config set --u l

solana config set --u d

solana config set --u m
```

wow so much time saved lets goooooooooo

**Keypairs**
You often need to test interactions using different keypairs, so the CLI has a simple way of managing your keypairs. It stores them in JSON files in your folders. Here's all the commands you'll need to know to work with them.

**Generate a new keypair**
```
solana-keygen new --outfile ~/<FILE_PATH>
```

**Set the default keypair**
```
solana config set --keypair ~/<FILE_PATH>
```

**Get the `publickey` of current default keypair**
```
solana address
```

**Get the SOL balance of current default keypair**
```
solana balance
```

**Airdrop to current default keypair**
```
solana airdrop 2
```

Make sure you keep these keypair files safe and don't use the same keypairs for testing and deployment! You don't wanna end up losing all your fancy NFTs cause you accidentally pushed your keypairs to a public GitHub repo.

**The local Validator**
The Solana CLI comes with a handy command to spin up a local validator. This is sort of like a local version of the Solana network that you can use to test your programs. It's a lot faster than deploying to Devnet and you can use it to test your programs without spending any devnet SOL.

You can start a local validator using
```
solana-test-validator
```

On WSL in Windows you'll need to run this command *before* trying to run the validator:
```
cd ~
```
We're changing directories to `~` so we're not in the mounted windows image inside WSL. This fixes some path stuff that breaks otherwise.

Next, open up another terminal window and enter 
```
solana logs
```

This will give you all transaction logs for the local network. Nothing will happen here until you make a transaciton, so open up a third terminal window and run 
```
solana address
solana airdrop 999 YOUR_ADDRESS
```
You should see the airdrop transaction come in! Pretty cool eh?

There's a whole lotta cool stuff you can do with logs and the local validator, like filtering logs to a specific program. Check out the docs [here](https://docs.solana.com/cli) for more cool stuff.

The one thing to keep in mind is that you need to keep the terminal window with `solana-test-validator` running for as long as you need the network to run. If you close it the network shuts down too. You can exit out of it using `CTRL` + `C` on Windows and `CMD` + `C` on Mac.

#### 🦾 Local program deployments
Now that you are armed with all the tools to develop locally, let's try out deploying a program locally!

To start, we'll need to *make* a Solana program. That's what we installed Rust for. All we need is a simple Rust project:

```
cargo new --lib local-program
cd local-program
code .
``` 

Cargo is like NPM for Rust. It'll generate all the boilerplate we need. `code .` will open up a VS Code window with that project (if this doesn't open vscode, don't sweat it, just open up your code editor to the root of that directory)

Open up `Cargo.toml` and add Solana dependencies to make this Rust project a Solana program:
```toml
[package]
name = "<PROJECT_DIRECTORY_NAME>"
version = "0.1.0"
edition = "2021"

[features]
no-entrypoint = []

[dependencies]
solana-program = "~1.8.14"

[lib]
crate-type = ["cdylib", "lib"]
```

We can't just deploy an empty file, so just open up `lib.rs` and add this:

```rs
use solana_program::{
    account_info::AccountInfo,
    entrypoint, 
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    msg, 
};

entrypoint!(process_instruction);

pub fn process_instruction(
    _program_id: &Pubkey,
    _accounts: &[AccountInfo],
    _instruction_data: &[u8],
    ) -> ProgramResult {
        msg!("Hello local Solana network!!");
        Ok(())
}
```

This is all we'll need! Next, we need to build this. Cargo comes with a special type of build command that matches the Solana loader:
```
cargo build-bpf
```

This will take a few minutes the first time, it gets faster after. You'll notice a new folder called "target" has appeared. This is where the compiled code is, ready to be deployed. You'll also notice a deploy command printed out at the bottom after you ran the build command. Copy and paste this in the terminal and your program will be deployed locally!
