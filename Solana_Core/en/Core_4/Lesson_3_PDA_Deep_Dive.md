Ah, the egg. Or as they're officially known: Program Derived Addresses. We've cooked with these before. Let's crack 'em open to see how they work.

PDAs serve two main functions:
1. Provide a [deterministic](https://www.google.com/search?q=define+deterministic) way to find the address of a program-owned account
2. Authorize the program from which a PDA was derived to sign on its behalf in the same way a user may sign with their private key

In other words, they're a secure key-value store for storage on the Solana network.

#### 🔎 Finding PDAs
So far every time we've needed to derive an address we've used a handy function provided to us. What does this function actually do? To find out, we need to learn how all Solana keypairs are made. 

Think back to what the point of a keypair is. It's a way to prove that you are who you say you are. We do this using a digital signature system. Solana keypairs are found on what is called the [Ed25519](https://ed25519.cr.yp.to/) Elliptic Curve (you don't need to know wtf this is).

![](https://hackmd.io/_uploads/r1CvHkFEo.png)

Since PDAs are controlled by programs, they don’t need private keys. So we make PDAs from addresses that are not on the Ed25519 curve. This effectively means they are public keys *without* a corresponding private key.

That’s it. You don’t need to understand Ed25519, or even what a digital signature algorithm is. All you need to know is that PDAs look like regular Solana addresses and are controlled by programs. If you feel like you want to learn this further, check out this cool video on [Digital Signatures](https://www.youtube.com/watch?v=s22eJ1eVLTU) from Computerphile. 

To find a PDA within a Solana program, we'll use the `find_program_address` function.

“Seeds” are optional inputs used in the `find_program_address` function to derive a PDA.For example, seeds can be any combination:
- instruction data
- hardcoded values
- other account public keys

The `find_program_address` function provides an additional seed called a "bump seed" to ensure that the result *is not* on the Ed25519 curve

Once a valid PDA is found, the function returns both:
- the PDA
- the bump that was used to derive the PDA

![](https://hackmd.io/_uploads/ryVdBkF4o.png)
```rs
let (pda, bump_seed) = Pubkey::find_program_address(&[user.key.as_ref(), user_input.as_bytes().as_ref(), "SEED".as_bytes()], program_id)
```

#### 🍳 Under the hood of `find_program_address` 
`find_program_address` is an imposter - it actually passes the input `seeds` and `program_id` to the `try_find_program_address` function

![](https://hackmd.io/_uploads/SJddB1t4s.png)
```rs
pub fn find_program_address(seeds: &[&[u8]], program_id: &Pubkey) -> (Pubkey, u8) {
    Self::try_find_program_address(seeds, program_id)
        .unwrap_or_else(|| panic!("Unable to find a viable program address bump seed"))
}
```

The `try_find_program_address` function then introduces the `bump_seed`.

The `bump_seed` is a `u8` variable with a value ranging between 0 to 255, which is appended to the optional input seeds which are then passed to the `create_program_address` function:

![](https://hackmd.io/_uploads/r1kFHkYEi.png)
```rs
pub fn try_find_program_address(seeds: &[&[u8]], program_id: &Pubkey) -> Option<(Pubkey, u8)> {

    let mut bump_seed = [std::u8::MAX];
    for _ in 0..std::u8::MAX {
        {
            let mut seeds_with_bump = seeds.to_vec();
            seeds_with_bump.push(&bump_seed);
            match Self::create_program_address(&seeds_with_bump, program_id) {
                Ok(address) => return Some((address, bump_seed[0])),
                Err(PubkeyError::InvalidSeeds) => (),
                _ => break,
            }
        }
        bump_seed[0] -= 1;
    }
    None

}
```

The `create_program_address` function performs a set of hash operations over the seeds and `program_id`. These operations compute a key, then verify if the computed key lies on the Ed25519 elliptic curve or not. 

If a valid PDA is found (i.e. an address that is off the curve), then the PDA is returned. Otherwise, an error is returned.
![](https://hackmd.io/_uploads/S1MYHJt4o.png)
```rs
pub fn create_program_address(
    seeds: &[&[u8]],
    program_id: &Pubkey,
) -> Result<Pubkey, PubkeyError> {

    let mut hasher = crate::hash::Hasher::default();
    for seed in seeds.iter() {
        hasher.hash(seed);
    }
    hasher.hashv(&[program_id.as_ref(), PDA_MARKER]);
    let hash = hasher.result();

    if bytes_are_curve_point(hash) {
        return Err(PubkeyError::InvalidSeeds);
    }

    Ok(Pubkey::new(hash.as_ref()))

}
```

To recap:
- The `find_program_address` function passes our input seeds and `program_id`
 to the `try_find_program_address` function.
- The `try_find_program_address` function adds a `bump_seed`
 (starting from 255) to our input seeds, then calls the `create_program_address` function until a valid PDA is found.
- Once found, both the PDA and the `bump_seed` are returned.

You don't need to remember all of that! The important thing is understanding what's happening when you call the `find_program_address` function at a high level.

#### 🤔 **Things to notes about PDAs**
- For the same input seeds, different valid bumps will generate different valid PDAs.
- The `bump_seed` returned by `find_program_address` will always be the first valid PDA found.
- This `bump_seed` is commonly referred to as the "*canonical bump*".
- The `find_program_address` function only returns a Program Derived *Address* and the bump seed used to derive it.
- The `find_program_address` function does *not* initialize a new account, nor is any PDA returned by the function necessarily associated with an account that stores data.

#### 🗺 Map to data stored in PDA accounts
Since programs themselves are stateless, all program state is managed through external accounts. This means we need to do a bunch of mapping to keep things linked.

The mappings between seeds and PDA accounts that you use will be highly dependent on your specific program. While this isn't a lesson on system design or architecture, it's worth calling out a few guidelines:
- Use seeds that will be known at the time of PDA derivation
- Be thoughtful about what data is grouped together into a single account
- Be thoughtful about the data structure used within each account
- Simpler is usually better

This was a lot! Again, you don't need to remember *everything* we've covered here. Let's build an on-chain commenting system to see how this all works in practice!
