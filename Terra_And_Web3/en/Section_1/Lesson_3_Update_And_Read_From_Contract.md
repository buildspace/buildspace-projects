Epic. We're storing data on our Terra smart contract. Not many people know how to do this stuff, so, you should definitely feel like a bit of a wizard. This ecosystem is really early and you're at the center of the magic right now.

### 🥅 Create a Vector 
A number is cool, but we want to store more complex data! All these Starcraft named things have me nostalgic so I'm going to be making a simple game. We'll "map" player addresses to their scores. To do this we'll use [Vectors](https://doc.rust-lang.org/rust-by-example/std/vec.html), which are re-sizeable arrays of any object type.

Start by defining a vector for scores in `state.rs`:

```rust
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::Addr;
use cw_storage_plus::Item;

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct State {
    pub speed: i32,
    pub owner: Addr,
    // Here's the vector!
    pub scores: Vec<(Addr, u16)>,
}

// I've renamed this from `STATE` to `STORAGE` to avoid confusion lol
pub const STORAGE: Item<State> = Item::new("state");
```
**Note: Errors expected here.**

That was easy! The one thing here we haven't gone over is the [item](https://github.com/CosmWasm/cw-plus/tree/main/packages/storage-plus#item) thing at the bottom that we get from `cw_storage_plus`. It's a simple key value store that needs a type and a unique key. Remember how I said we'll rename the things named `state`? This is where we can do that. I renamed `STATE` to `STORAGE` to start.

Here's what each is:
* `STORAGE` is the object that contains the state items
* `state` is the **key** used to access the values inside `STORAGE`
* `State` is the struct we're defining right above it

Next, let's tell the world all about our scores. Here's our updated `msg.rs`:
```rust
// I've updated our imports
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use cosmwasm_std:: Addr;

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
  pub speed: i32,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
  // We won't need Increment and Reset from the template so we can remove them
  // Increment {},
  // Reset { speed: i32 },

  UpsertScore { score: u16 }, // This will add or update scores
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
  GetSpeed {},
  // Just like with GetSpeed, we declare an enum for scores too
  GetScores {},
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct SpeedResponse {
  pub speed: i32,
}

// Here's the response type for our scores, it's a vector of the same object type we defined in state.rs
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct ScoreResponse{
    pub scores: Vec<(Addr, u16)>,
}
```

You're a pro at this now so nothing here should surprise you. I added a bonus `UpsertScore` function that we'll implement later.

And now to bring it to life in `contract.rs`:
```rust
use cosmwasm_std::entry_point;
use cosmwasm_std::{to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult};
use cw2::set_contract_version;

use crate::error::ContractError;
//  I added ScoreResponse to our imports
use crate::msg::{SpeedResponse, InstantiateMsg, QueryMsg, ScoreResponse};
// I updated the import since we renamed STATE to STORAGE, STATE has also been renamed to STORAGE everywhere it appeared previously
use crate::state::{State, STORAGE};

const CONTRACT_NAME: &str = "crates.io:clicker";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
  deps: DepsMut,
  _env: Env,
  info: MessageInfo,
  msg: InstantiateMsg,
) -> Result<Response, ContractError> {

  let state = State {
    speed: msg.speed,
    owner: info.sender.clone(),
    // Since our state NEEDS to have a scores value, I'm just putting in an empty one
    scores: vec![],
  };

  set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
  STORAGE.save(deps.storage, &state)?;

  Ok(Response::new()
    .add_attribute("method", "instantiate")
    .add_attribute("owner", info.sender)
    .add_attribute("speed", msg.speed.to_string())
    // Scores is empty lol so we just send back an empty string as the value
    .add_attribute("scores", "".to_string()))
}


#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
  match msg {
    QueryMsg::GetSpeed {} => to_binary(&query_speed(deps)?),
    // Match case for the newly added GetScores query
    QueryMsg::GetScores {} => to_binary(&query_scores(deps)?),
  }
}

fn query_speed(deps: Deps) -> StdResult<SpeedResponse> {
  let state = STORAGE.load(deps.storage)?;
  Ok(SpeedResponse { speed: state.speed })
}

// Load from storage, return as a vector of (address, score) tuples
fn query_scores(deps: Deps) -> StdResult<ScoreResponse> {
  let state = STORAGE.load(deps.storage)?;
  Ok(ScoreResponse { scores: state.scores })
}
```

The comments here tell you everything that's happening. We're setting score to empty on instantiate and adding the query function to fetch its value. We're super close to the final piece so we'll just go next instead of fetching an empty scoreboard with Terrain lol.

### ✍️ Build a function to add and update scores
Alright, now for the big one: creating a function to add or update scores. All this time there's been a big piece missing from our contract - the `execute` message handler. It works a lot like the `query` message handler. Here's what our final `contract.rs` looks like, I added comments for the new stuff:
```rust
#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult};
use cw2::set_contract_version;

use crate::error::ContractError;
//  I added ExecuteMsg to our imports
use crate::msg::{SpeedResponse, InstantiateMsg, ExecuteMsg, QueryMsg, ScoreResponse};
use crate::state::{State, STORAGE};

const CONTRACT_NAME: &str = "crates.io:clicker";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
  deps: DepsMut,
  _env: Env,
  info: MessageInfo,
  msg: InstantiateMsg,
) -> Result<Response, ContractError> {

  let state = State {
    speed: msg.speed,
    owner: info.sender.clone(),
    scores: vec![],
  };

  set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
  STORAGE.save(deps.storage, &state)?;

  Ok(Response::new()
    .add_attribute("method", "instantiate")
    .add_attribute("owner", info.sender)
    .add_attribute("speed", msg.speed.to_string())
    .add_attribute("scores", "".to_string()))
}

// Here's our execute message handler, we need `info` as a parameter too
#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
  deps: DepsMut,
  _env: Env,
  info: MessageInfo,
  msg: ExecuteMsg,
) -> Result<Response, ContractError> {
  match msg {
    // `score` is being passing in, we'll pass that forward
    ExecuteMsg::UpsertScore { score } => try_upsert_score(deps, info, score),
    }
}

// Here's our main upsert function - it adds a score if the address doesn't exist, or updates it if it does
fn try_upsert_score(
  deps: DepsMut,
  info: MessageInfo,
  score: u16,
) -> Result<Response, ContractError> {
  let mut state = STORAGE.load(deps.storage)?;
  let sender = info.sender.clone();
  let scores = &mut state.scores;
  let index = scores.iter().position(|(s, _)| s == &sender);
  match index {
    Some(i) => {
      scores[i].1 = score;
    },
    None => {
      scores.push((sender.clone(), score));
    }
  }
  STORAGE.save(deps.storage, &state)?;
  Ok(Response::new()
    .add_attribute("method", "upsert")
    .add_attribute("player", info.sender)
    .add_attribute("score", score.to_string()))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
  match msg {
    QueryMsg::GetSpeed {} => to_binary(&query_speed(deps)?),
    QueryMsg::GetScores {} => to_binary(&query_scores(deps)?),
  }
}

fn query_speed(deps: Deps) -> StdResult<SpeedResponse> {
  let state = STORAGE.load(deps.storage)?;
  Ok(SpeedResponse { speed: state.speed })
}

fn query_scores(deps: Deps) -> StdResult<ScoreResponse> {
  let state = STORAGE.load(deps.storage)?;
  Ok(ScoreResponse { scores: state.scores })
}
```

We know the `public fn execute` bit quite well by now. Let's take a look at the `try_upsert_score` function line by line, which is the heart of our contract.

```rust
fn try_upsert_score( deps: DepsMut, info: MessageInfo, score: u16 ) -> Result<Response, ContractError> {
  // Declare all the variables we'll need 
  let mut state = STORAGE.load(deps.storage)?;
  let sender = info.sender.clone();
  let scores = &mut state.scores;

  // Iterate (loop) through all scores values and check if the address is the sender
  let index = scores.iter().position(|(s, _)| s == &sender);
  match index {
    Some(i) => {
      scores[i].1 = score;
    },
    None => {
      scores.push((sender.clone(), score));
    }
  }

  STORAGE.save(deps.storage, &state)?;
  Ok(Response::new()
    .add_attribute("method", "upsert")
    .add_attribute("player", info.sender)
    .add_attribute("score", score.to_string()))
}
```
The first thing this function does is it declares all the necessary variables. We pull out the current state from storage, the sender's address from `MessageInfo`, and the scores vector from the state. We use `clone()` to make a copy instead of transferring ownership. For `scores`, we get a mutable reference of the vector in state, which lets us directly update the actual item in blockchain storage. 

Then we iterate through the values of our `scores` vector to check if the value of the first element (`s`) is our sender's address. If it finds it, it returns the index. If it doesn't, it returns `None`. We then match the values of `index` - if it's *something*, we use it to set the score. If it's `None`, we push it to our scores vector. Isn't Rust pretty?

And now to test, back to our `index.js` file
```javascript
// Desktop/Learn-Terra/clicker-portal/lib/index.js
module.exports = ({ wallets, refs, config, client }) => ({
  getSpeed: () => client.query("clicker", { get_speed: {} }),
  getScores: () => client.query("clicker", { get_scores: {} }),

  upsertScore: (score, signer = wallets.validator) =>
    client.execute(signer, "clicker", { upsert_score: { score } }),
});
```
One weird thing here is the function names. In `msg.rs`, we declare the enum as `GetSpeed` but here we use `getSpeed` and `get_speed`. Wtf? The first one is the JS function that is run via the Terrain console. You can call it whatever. The second one is the actual Rust function. You'll notice `#[serde(rename_all = "snake_case")]` in our `msg.rs` file. This renames our functions from `GetSpeed` to `get_speed` at build time. I couldn't find out why though, if you figure it out, be sure to share in the #general-chill-chat!

Moment of truth, let's see if this works 💀

Here's what you want to run:
```
# Desktop/Learn-Terra/clicker-portal/
terrain deploy clicker --signer test1
# After it deploys
terrain console
await lib.getSpeed();
await lib.getScores();
await lib.upsertScore(23)
await lib.getScores();
```

You should see your address and score printed out! 
```
{ scores: [ [ 'terra1dcegyrekltswvyy0xy69ydgxn9x8x32zdtapd8', 23 ] ] }
```

LET'S GOOOOOOO! You're storing data on a blockchain. What you've done is HUGE! 

Imagine if this were some other type of data. Voting records. Bank balances. Product registrations. You've built an app that lets anyone submit data and read from it. It's an immortal entity that is part of the most popular stablecoin network on the planet. There's billions of $UST in circulation and over a million active users. You can now plug into all of that.

If you haven't celebrated, my god please do it now. This is HUGE. You are well on your way to becoming a web3 legend 🤘.

### 🚨 Progress Report
*Please do this else Raza will be sad :(*

Post a screenshot of your terminal showing your score from Terrain in #progress!

Pretty tough to get all this working. You're doing great :).
