Welcome to Ship week! This whole week is dedicated to getting your project ready to ship. For us, that means the buildoors project. For you, it’ll be similar but hopefully with some personal flair!

The main thing that’s left to do is implement the loot box. For now, create a simple loot box implementation.

That means:

No verified randomness - you can stick with a simple pseudorandom implementation or not do randomness at all.

Be okay with a static solution, e.g. don’t make it so you can update the gear type later. Keep it simple for now.

You can and should get creative with this. And by that I don’t just mean “use different images.” Feel free to create your own architecture and really experiment. In the immortal words of Miss Frizzle: “Take chances, make mistakes, and get messy!”

Hints

That being said, here are a couple of pointers based on how we approached the loot box program (yes, we did it in a separate program):

We used fungible assets instead of NFTs for the gear distributed by a loot box.

We just modified the script used for creating the BLD token to make one “fungible asset” token per piece of gear.

The loot box is really just an idea - there’s not a token or anything representing it.

To assign (randomly or otherwise) from multiple possible mints, we needed to set up the program to have two separate transactions:

The first we called open_lootbox. It handles burning the $BLD tokens required to open a loot box, then pseudorandomly selects the gear to be minted to the caller, but then instead of minting it right then, stores the selection in a PDA associated to the user. Had to do this otherwise you’d have to pass all possible gear mints into the instruction which would be really annoying.
The second we called retrieve_item_from_lootbox. This one checks the aforementioned PDA and mints the specified gear to the user.
Again, don’t feel locked into our implementation. And try this out on your own before looking at our solution. And I don’t mean try it out for 20 minutes. This took me virtually an entire day to figure out so don’t be afraid to work independently for quite a bit before turning to our solution walkthrough.

Good luck!

