### ✈️ Making your smart contract upgradable
Let's say you want to add some new functionality to your Terra dApp.

CosmWasm makes this super easy because all code is stored with unique IDs. Contract upgrades are called Migrations here.

First, you'll have to add support for a new type of message when deploying your contracts for the first time - `MigrateMsg`. Add this to `msg.rs`:

```rust
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct MigrateMsg {}
```

You can place this message anywhere, however; it is usually placed above the `InstantiateMsg` struct.

Now that MigrateMsg is defined, you will need to update `contract.rs`:

1. Update the import from crate::msg to include MigrateMsg:

```rust
use crate::msg::{SpeedResponse, InstantiateMsg, ExecuteMsg, QueryMsg, ScoreResponse, MigrateMsg};
```
2. Add the following method above instantiate:
```
#[cfg_attr(not(feature = "library"), entry_point)]
pub fn migrate(_deps: DepsMut, _env: Env, _msg: MigrateMsg) -> StdResult<Response> {
    Ok(Response::default())
}
```

Just like before, you define in `msg.rs` and implement in `contract.rs`. To deploy this as migrate-able:

```
terrain deploy clicker --signer test1 --set-signer-as-admin
```

Terrain makes our lives easy once again by letting us call this message using the CLI.

```
terrain contract:migrate clicker --signer test1
```

Done. Your contract has migrated to a new codebase without losing data!

### 👀 Add a wallet address label to our app
It'd be cool to show our users which wallets they're connected to the app with.

Make a `WalletAddress.js` file in the `terra-starter/src/components` directory and add this:

```javascript
import { useConnectedWallet } from '@terra-money/wallet-provider';

const WalletAddress = () => {
  const connectedWallet = useConnectedWallet();
  const { terraAddress } = { ...connectedWallet };
  
  return (
    <div>
      {terraAddress && (
        <button className="wallet-address">
          {terraAddress.slice(0, 5) + '...' + terraAddress.slice(-4)}
        </button>
      )}
    </div>
  );
};

export default WalletAddress;
```

The styles on this are fixed so you can use it on any page! I put it on the landing (App.js), the leaderboard and the guide pages.

To add it to a page:
```javascript
// Import it first
import WalletAddress from './components/WalletAddress';

// Call it in a render function!
  return (
    <main className="App">
      <header>
        <Link to="/" className="home-link">
          <div className="header-titles">
            <h1>⚔ Goblin War ⚔️</h1>
            <p>Only you can save us from Goblin town</p>
          </div>
        </Link>
        <WalletAddress />
      </header>

      <div className="score-board-container">
        <h3>Scoreboard</h3>
        {/* If loading, show loading, else render */}
        {loading ? (
          <div>Loading...</div>
        ) : (
          renderScores(scores)
        )}
        
        <div></div>
      </div>
    </main>
  );
```

### 🤑 Sending users UST
UST is a huge part of why Terra has been so successful. It's the primary stablecoin that people use on the chain and it's incredible how much you can do with it. 

It would be awesome if you could give top players UST! 

**Terra's super low gas fee means sending small amounts of money like this actually makes sense.** If you do this, you could even make a version of Patreon or BuyMeACoffee on Terra. Not that crazy. You have all the basic skills now.

Who needs Stripe and PayPal when you have a super low-gas fee blockchain that lets you make instant payments?!?

This is another thing I want you to figure out if you want by hanging out in the [Terra Discord](https://discord.com/invite/terra-money) or by asking your fellow buildspacers. Why am I not telling you the answers? Haha, because I want you to be active in the Terra community, figure shit out, and learn by struggling a bit.

Here's a few resources to get you started:

[Terra Wiki - Holding funds in smart contracts](https://terrawiki.org/en/tutorials/holding-funds-in-smart-contract)
[Common CosmWasm smart contract examples - Send UST](https://github.com/0x7183/common-cw-examples/tree/main/send)

Be nice in the Terra Discord and don't just ask random questions. Try hard yourself to search the Discord to see if anyone else has had the same question you have and always say ty when someone helps ;).