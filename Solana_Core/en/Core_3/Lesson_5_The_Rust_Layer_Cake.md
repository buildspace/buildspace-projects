We've said hello. It's time to learn how to handle instruction data, just like we did with client-side development.

Before we get into building, I wanna go over some of the concepts we'll be using. Remember what I said about rules, abilities and interactions? I'll walk you through the abilities and rules you need to know to make a native Solana program. The word native is important here - a lot of what we'll learn here will be handled by Anchor later on. 

The reason we're learning native development is because it's important to understand how things work under the hood. Once you understand how things work at the atomic level, you'll be able to use tools like Anchor to build even more powerful programs. Think of it like a boss fight with different types of enemies - you need to learn how to counter each individual monster (and your abilities) before taking them all on at the same time.

When I first learned this stuff I had trouble understanding what I was missing, so I broke it down into "layers". Each topic you'll learn will be built on top of a layer of knowledge. If something doesn't make sense, go back to the the layers it's built on and make sure you understand them. 

**This is the Rust layer cake**. 
![](https://hackmd.io/_uploads/r1evwdmNj.png)
**Note** - layers are indicative of weight lol

#### 👶 Variable declaration and mutability
Variables. You know them. You've used them. You've probably even misspelled them. The only thing new about Rust variables is **mutability**. All variables in Rust are immutable by default - you can't change the value of a variable once it's been declared. 

All you gotta do is tell the compiler that you want a mutable variable by adding the `mut` keyword. Ezpz. If we don't provide the type, the compiler will infer it based on the data we provide. It will then enforce that we maintain that type over time.

![](https://hackmd.io/_uploads/HkFjnDQ4i.png)

#### 🍱 Structs
Structs are custom data structures: a way to group data together. They're a custom data type that you define, similar to objects in Javascript. Rust isn't fully object oriented - structs by themselves can't do anything except hold organized data. You can add stuff onto structs making them more like objects.

![](https://hackmd.io/_uploads/HJ4TCD7Ej.png)

#### 📜 Enums, variants & match
Enums are pretty simple - they're like drop-down lists in code. They force you to choose from a list of several possible variants. 

![](https://hackmd.io/_uploads/rJAQyuX4j.png)

The cool thing about enums in Rust is that you can (optionally) add data to them - making it almost like a mini if statement. In this example you're choosing the status of a traffic light. If it's on, you need to specify the colour - is it red, yellow or green? 

![](https://hackmd.io/_uploads/Bkzybd74s.png)

Enums are great when used in conjunction with match statements. They're a way to check the value of a variable and execute code based on the value - the same as switch statements in Javascript.

#### 📦 Implementations
Structs are pretty cool, but what if you could add functions to them? Meet implementations: they let you add methods to structs, making them a lot more like objects.

![](https://hackmd.io/_uploads/BkitZ_XEo.png)

If you're confused about what it means to "add methods to a struct" - think of it like giving abilities to a struct. You can have a plain `user` struct that has speed, health and damage. By using `impl` to add a `wordPerMinute` method, you could calculate the user's typing speed ⌨️.

#### 🎁 Traits
And finally, the top of the cake. Traits are similar to implementations - they add functionality to types. Think of them like qualities that types can have.

Going back to our `user` struct, if I added a `ThreeArms` trait, the user would be able to type 50% faster because they'd have an extra arm! Traits are a bit abstract, so let's look at a real scenario we'll use them in:

![](https://hackmd.io/_uploads/H13ZI_X4j.png)

As you'll remember, our instruction data comes in the form of a byte array (1s and 0s) and we deserialize it (convert it to a Rust type) in our program. We'll be using the `BorshDeserialize` trait to do this: it has a `deserialize` method that turns our data into a type we want. This means if we add the `BorshDeserialize` trait to our instruction struct, we can use the `deserialize` method to turn our instruction data instances into a Rust type.

Feel free to read that again if it's confusing lol, it took me a while to wrap my head around it.

Here's what that looks like in practice: 
![](https://hackmd.io/_uploads/S1U3FdXEj.png)

**Note** - A layer you might have forgotten about is **Macros:** they generate code.

In our case, traits are used in conjunction with macros. For example, the `BorshDeserialize` trait has two functions that must be implemented. `deserialize` and `try_from_slice`. We can use the `#[derive(BorshDeserialize)]` attribute to tell the compiler to implement those two functions for us on a given type (i.e. an instruction data struct).
The flow is:
* You add the trait to a struct through the macro
* The compiler will then look for the trait definition
* The compiler will then implement the underlying functions for that trait
* Your struct now has the functionality of the trait

What actually happens here is the macro generates the functions to deserialize strings on compile time. Using the trait we tell Rust: "Hey, I want to be able to deserialize strings, so please generate the code for me". 

The only requirement in our scenario is that Borsh needs to support all the struct data types (String in our case). If you have a custom data type not supported by borsh, you'll need to implement the functions yourself by adding onto the macro.

If this hasn't clicked yet, don't worry! I didn't get it until I saw the whole flow in action, so let's do that now!

#### 🎂 Putting it all together
We just went over a bunch of abstract topics built on top of each other. I can't imagine what a cake looks like if you just describe each layer, so let's put it all together!

Let's say we're building an on-chain note taking program. We'll keep it simple: all you can do is create, update and delete notes. We'll need an instruction to do each of these things, so let's make an enum for that:

![](https://hackmd.io/_uploads/S1U3FdXEj.png)

The byte arrays for each instruction variant will have their own data types, we've got those here!

Now that we know what the instruction data will look like, we need to convert it from bytes to these types. The first step is deserialization, which we'll do using the `BorshDeserialize` trait on a new struct we'll make just for the payload:
```rs
#[derive(BorshDeserialize)]
struct NoteInstructionPayload {
    id: u64,
    title: String,
    body: String
}
```
We've got the `title` and `body` in here because that's what's gonna be in the byte array. All borsh is doing is adding *support* for deserialization! It's not actually doing the deserialization. It's just adding the functions that we can call for deserialization.

Next, we need to actually use these functions to deserialize the data. We'll define this behaviour in an implementation. THIS IS MANUAL WORK (for now)! 

```rs
impl NoteInstruction {
    // Unpack inbound buffer to associated Instruction
    // The expected format for input is a Borsh serialized vector
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        // Take the first byte as the variant to
        // determine which instruction to execute
        let (&variant, rest) = input.split_first().ok_or(ProgramError::InvalidInstructionData)?;
        // Use the temporary payload struct to deserialize
        let payload = NoteInstructionPayload::try_from_slice(rest).unwrap();
        // Match the variant to determine which data struct is expected by
        // the function and return the TestStruct or an error
        Ok(match variant {
            0 => Self::CreateNote {
                title: payload.title,
                body: payload.body,
                id: payload.id
            },
            1 => Self::UpdateNote {
                title: payload.title,
                body: payload.body,
                id: payload.id
            },
            2 => Self::DeleteNote {
                id: payload.id
            },
            _ => return Err(ProgramError::InvalidInstructionData)
        })
    }
}
```
![](https://hackmd.io/_uploads/S1OOAdmEi.png)

This might look scary, but you'll be laughing at how simple it is very shortly! Let's break it down 🕺💃👯‍♂️

```rs
pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
```
Our unpack function will take the bytes from the instruction and return either a NoteInstruction type (that's what `Self` is) or a `ProgramError`.

```rs
let (&variant, rest) = input.split_first().ok_or(ProgramError::InvalidInstructionData)?;
```
Time for unpacking our data from bytes and calling the deserialize function.

In this program, the first byte in our instruction data is an integer that tells us which instruction we're dealing with. We need to do this because each instruction can have different data associated with it. Maybe we're writing a recipe program and instead of cooking a recipe we end up deleting it. We need to know which instruction we're dealing with so we can unpack the data properly. 

The way we do this is using Rusts built in `split_first` function. It takes in a slice of bytes and returns a tuple. The first element is the first byte in the slice and the second element is the rest of the slice. The `ok_or` just returns the `InvalidInstructionData` error from the `ProgramError` enum if the slice is empty. 

```rs
let payload = NoteInstructionPayload::try_from_slice(rest).unwrap();
```
Now we've got two variables we're working with - the instruction indicator and the payload (data) of the instruction. Borsh added the `try_from_slice` function to our payload struct so we can call that on `rest`, which is the payload variable. This is the deserialization happening! `unwrap` just returns the value from this function if there's no error.

We're almost there! So far we've:
* Defined our instruction data as a Rust type in an enum
* Defined our payload struct
* Declared the `BorshDeserialize` macro on the payload struct
* Created an implementation for the payload struct (bytes -> struct)
* Created an unpack function that takes in the instruction data and deserializes it

The last step in our unpack function is taking the deserialized data and converting it into an enum variant (i.e. an instruction data type).

```rs
Ok(match variant {
    0 => Self::CreateNote {
        title: payload.title,
        body: payload.body,
        id: payload.id
    },
    1 => Self::UpdateNote {
        title: payload.title,
        body: payload.body,
        id: payload.id
    },
    2 => Self::DeleteNote {
        id: payload.id
    },
    _ => return Err(ProgramError::InvalidInstructionData)
})
```
We'll do this using a match statement. By matching on the instruction indicator, we can return the correct variant of the enum. Think of this like creating a variable of the correct type using bits of data in the instruction.

And now you know what the cake looks like! I've found that you need a lot of mental RAM to fit each slice of the cake in your working memory at once, so it's okay if you need to go back and read this a few times.

This is a lot. It can be confusing. **Don't worry**: we'll practice a lot to get familiar with this. Trust that after some time and a few iterations doing this it'll start to make sense.

#### 🚀 Program logic
We've got our instruction data unpacked and ready to go. Now we need to write the logic for each instruction. This is the easy part! Deserialization is the time-consuming "huh wtf is going on" part (that Anchor will take care of for you).

![](https://hackmd.io/_uploads/Bk2AGKQ4j.png)

First thing we'll do is define the program entrypoint. The definition of the `process_instruction` function will be the same as it was for our Hello World program. Then we'll use the `unpack` function in the `NoteInstruction` implementation to get the instruction data. We can then match on the *type* using the `NoteInstruction` enum.

We don't have the logic here, we'll add that when we actually start building stuff!

#### 📂 A note on file structure
When writing a custom program, it's best to separate your code into different files. This lets you reuse code and makes it easier to find things.

![](https://hackmd.io/_uploads/ry-tBK7Eo.png)

In addition to the `lib.rs` file, we'll separate various parts of the program into different files. The most obvious one here is the `instruction.rs` file. This is where we'll define our instruction data types and the implementation for unpacking the instruction data.

**YOU'RE DOING GREAT** 👏👏👏 
I wanna take a moment to acknowledge how much effort you've put in. You're learning some pretty powerful stuff that can be used outside of Solana, Rust has a lot of applications. Solana can be difficult, here's a tweet from the founder of FormFunction, from almost exactly a year ago where he mentions how difficult he found it:

![](https://hackmd.io/_uploads/SktWDKmEi.png)

FormFunction has raised over $4.7m USD and is the best 1/1 NFT platform on Solana (IMO). Matt persevered and built something incredible. Can you imagine where you'll be in a year with these skills?
