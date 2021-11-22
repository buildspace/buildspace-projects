# The Hedera Public Netork

The Hedera Proof of Stake public network, powered by Hashgraph consensus, achieves the highest grade of security possible: asynchronous Byzantine Fault Tolerance (aBFT). Hedera supports transaction speeds of up to 10,000 tps, with 3-5 seconds for finality. The Hedera network transaction fees are pegged to the US dollar at $0.0001. With its high throughput, low fees, and quick finality, Hedera is a robust competitive Layer 1 distributed ledger.
## Services
The Hedera netowork consists of three core services: The Hedera Token Services (HTS), The Hedera Consensus Service (HCS), and our Smart Contract Service.

### Hedera Token Service

The Hedera Token Service enables the configuration, management, and transfer of native fungible and non-fungible tokens on the public Hedera network. Hedera Token Service offers high-throughput, native compliance configurations and on-chain programmability, such as atomic swaps. HCS is provided with the tools that support seamless interoperability with existing business solutions.

### Hedera Consensus Service

The Hedera Consensus Service (HCS) acts as a trust layer for any application and allows for the creation of an immutable and verifiable log of messages. Application messages are submitted to the Hedera network for consensus, given a trusted timestamp, and fairly ordered. Use HCS to track assets across a supply chain, create auditable events logs in an advertising platform, or even use it as a decentralized ordering service.

### Smart Contract Service

Smart contracts are key innovations, allowing for the execution of immutable programs. This supports untrusted parties to interact without having to come to a formal agreement. Smart contracts make up decentralized applications in Defi, gaming, and many more. Hedera supports all the native EVM smart contract languages. 

## Hbar

Hbar is the native hedera token that acts as the network fuel for the hedera network. Hbar is used to pay for transactions like transfers, the deployment of smart contracts, token creations, and other hedera services.

## Build Space Application

A unique capability of the hedera network is its fair ordering of transactions. Because transaction ordering is part of the consensus design and not up to the network validators, users are protected against front-running attacks. A fun and exciting project to build would be a smart contract that helps manage token economics. One such use case would be designing the contract to support a treasure hunt, where when a use submits a "flag" of some sort, they would receive tokens in exchange for finding and submitting the "flag." On a layer-1 protocol that doesn't have fair ordering, these transactions would immediately be front-run, but on hedera, this is possible. This design can allow developers to design any amount of incentives for their token users.
