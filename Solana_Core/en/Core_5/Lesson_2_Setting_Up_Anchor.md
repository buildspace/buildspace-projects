Hello, friend. Welcome. You've arrived to the promised land. 

You've built Solana programs natively, just like the pioneers did. While you *can* continue building natively, using a framework makes things **a lot** easier and quicker. 

Think of all the stuff React takes care of when doing front-end development - you can do a lot more with just a little bit of code. Anchor is similar - it organizes a program in distinct sections that separates the instruction logic from account validation and security check. Just like how React handles state updates, Anchor handles a lot of basic stuff like account parsing and validation, serialization/deserialization, letting you build quicker!

AIt does this by bundling various boilerplate code into macros, allowing you to focus on the business logic of your program. Additionally, Anchor is designed to handling many common security checks while allowing you to easily define additional checks to help you build more secure programs.

TL;DR - Anchor makes you go fast by having to press fewer buttons!

#### 🗂 Anchor app structure
We *could* use Solpg but the latest version of Anchor has stuff extra spicy stuff so we'll set it up locally. Here’s how.

I'm expecting that you already have Rust and the Solana CLI installed (unless you skipped sections lol). You'll also need to **[install Yarn](https://yarnpkg.com/getting-started/install)**.

Once you're done, just head over to the [official Anchor docs](https://www.anchor-lang.com/docs/installation) and set it up. If everything went right, you should see a version printed out when you run `anchor --version`.

Alrighty! Let's set up a blank Solana program with Anchor:
```
anchor init <new-workspace-name>
```

This will set up the following structure:
- **`Anchor.toml`**: Anchor configuration file.
- **`Cargo.toml`**: Rust workspace configuration file.
- **`package.json`**: JavaScript dependencies file.
- **`programs/`**: Directory for Solana program crates.
- **`app/`**: You app frontend goes here.
- **`tests/`**: Your TypeScript integration tests live here.
- **`migrations/deploy.js`**: Deploy script to migrate to different versions of the program.
- The **`.anchor`** folder: It includes the most recent program logs and a local ledger that is used for testing

You can ignore pretty much all of these for now. Pop open `programs/workspace-name/src/lib.rs`. This looks *slightly* different than our native program. Anchor will define the entrypoint for us, and we'll use Rust attributes to tell Anchor what all of our stuff is so it can automate a bunch of work for us.

When we use `#[program]`, we're actually declaring a Rust macro that Anchor will use to generate all the necessary native Solana boilerplate for us.

The beauty of the Anchor CLI is that it integrates TypeScript tests too. Just gotta write them and use Anchor commands!

The build/deploy setup is the same as native programs, you just gotta use different commands. Here's how we build:
```
anchor build
```

This will take a few seconds and build the program in the workspace targeting Solana's BPF runtime and emits "IDLs" in the **`target/idl`** directory. You should also a similar output as when running `cargo build-bpf`, with a deploy command in the terminal.

Btw here's what you need to know about the target folder -
- `target/deploy`: generated keypair used to deploy program
- `target/idl`: .json IDL for the program 
- `target/types`: Typescript IDL - all the types we need

Wtf is an IDL? An [Interface Description Language](https://en.wikipedia.org/wiki/Interface_description_language) file is a JSON file that describes the interface of a program - it tells you what functions are available and what arguments they take. Think of it like an API documentation for your program.

We use the program IDL to figure out how to talk to it using clients (what functions are available, what args do they take, etc) and the Typescript IDL for the types. These are important because to make your program open-source, you need to publish a verified build and the IDL to the [Anchor Programs Registry](https://www.apr.dev/).

Now we wanna deploy. But we can't just yet! We need to do two more things - get the program address and set the network.

**Placeholder ID**
First, in the `lib.rs` file from before, there's a `declare_id!` macro, which has a default value in it, you'll notice it's the same value every time you start a new anchor program. So get your actual program's ID by running `anchor keys list`, then paste that value in -- this program ID was generated after running the build command. It also needs to be pasted into the `Anchor.toml` file.

The flow here is a bit weird - you write a program, build it with `anchor build`, get the address with `anchor keys list`, replace it in the declare macro at the top of the program and `Anchor.toml`, then deploy. 

Run this to get the actual address of the program:
```
anchor keys list
```

**Network**
The second problem we need to address: the default network for the program to deploy is localhost. We can either spin up a local validator, or hop into `Anchor.toml` and change the cluster to devnet.

I'm a pro that's gonna push straight to devnet, so I'm gonna open up `Anchor.toml` and change `cluster` to `devnet`, and if I have enough devnet SOL, I can just deploy with:
```
anchor deploy
```

We're done! You should hopefully have a "Deploy success" message with a program ID in the terminal.

Change your cluster to the localnet now so we can run a test. Anchor will automatically set up a local validator for the duration of the test! I love robots 🤖

Testing is easy:
```
anchor test
```

This will run an integration test suit against the configured cluster, deploying new versions of all workspace programs before running them.

That's it! You've just built, deployed, and tested your first Anchor program :D

Next, we're gonna write a custom Anchor program to experience the true power!
