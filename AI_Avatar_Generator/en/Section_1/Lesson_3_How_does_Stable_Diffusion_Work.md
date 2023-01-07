Let's take a step back and talk about how all this works. Yah Stable Diffusion is a deep learning, text-to-image model, but what does that mean??? Understanding it will make you a lot better at using it.

**Note -** *I’m going to be simplifying a lot of this stuff and sticking to the important bits. This tech is once in a decade type stuff that you’ll need an actual PhD to understand, so I’ll skip the math lol.*

### The basics behind Stable Diffusion

Think of the last image caption you saw. It was probably on a blog or article somewhere on the internet and you glossed over it. There’s billions of these images out there: high-ish-quality, available for free, described with sufficient accuracy. These make up the bulk of training data for image generation models.

You see, in order to generate images from text, we need to first “train” a machine learning model on a large dataset of images and their corresponding text descriptions.  This training data is used to teach the model the relationships between the words in the text descriptions and the visual features of the corresponding images.

**We basically give a computer a few billion images and tell it what each of those images contains, effectively “teaching” it what things are.** 

Ya know how those captchas ask you to select the boxes with the sidewalks or traffic lights? You’re actually training the AI there lol.

Once we teach the model how to link words in a text description to the corresponding images, it can use deep learning to figure out the relationships between the two on its own. The way “deep learning” works is it creates neural networks with layers of interconnected “neurons”, which process and analyse large amounts of data to solve problems like matching text to images.

**All of this means it can take a new text description and make a related new image.**

This bit isn’t particularly new - this tech has been around for a while and it doesn’t produce very high quality results. 

![](https://hackmd.io/_uploads/H1q-DpE5i.png)

### CLIPping into magic

The magic of Stable Diffusion happens with CLIP. There’s a **LOT** happening here, so let’s start with the concept of embeddings.

Computers don’t see images or words. They’re not as powerful as the all-in-one everything machine with billions of CPUs that sits in our head.

When we look at something, light from the image enters our eyes and is converted to electrical signals by the retina. Our brain processes these signals and recognizes the things we’re looking at. 

Computers need to do a similar type of processing - they have a dictionary that maps pieces of words to numbers. This is called text embedding.

By representing words or images as numerical vectors, we can use these vectors as input to machine learning algorithms, which can then learn from the data and make predictions or generate new data.

![](https://hackmd.io/_uploads/BkFDw6Eqo.png)

[Source](https://www.youtube.com/watch?v=F1X4fHzF4mQ)

Image embedding has a couple extra steps - they’re first passed through a convolutional neural network (CNN), which is a type of deep learning model that is designed to automatically learn the important features and patterns in the image. This way we can represent the important features of an image in a numerical vector and do math with it.

So — **we’ve got a text embedding and an image embedding. Basically a numerical representation of the image and it’s caption.** 

This is where CLIP comes in - its job is taking these two embeddings and finding the most similarities. This is what gives us those extra crisp results which are realistic and don’t have any weird artifacts. If you wanna see it in action, [check this out](https://huggingface.co/spaces/EleutherAI/clip-guided-diffusion).

![](https://hackmd.io/_uploads/rJYFv6Nco.png)

[Source](https://www.youtube.com/watch?v=F1X4fHzF4mQ)

### The Diffusion in Stable Diffusion

Think of a bunch of round objects that you’ve seen. How do you know a football is different from a bowling ball if you’re just looking at it? The way it looks, duh! 

![football-prank.gif](https://hackmd.io/_uploads/HybC9mB5o.gif)

You’ve probably never thought about this, but in your head, you’ve got at least three “axis” - one for shape, one for color, another for size maybe. Footballs are in one spot on this graph, bowling balls are on another.

Stable Diffusion does something similar, except it has a **lot** more dimensions and variables. Here our big brain gets left behind - it can’t visualize more than 3 dimensions, but our models have more than 500 dimensions and an insane number of variables. This is called **latent space.**

![](https://hackmd.io/_uploads/SkK9v6Nco.png)

Imagine you're training a machine learning model to generate cat pictures from text. The latent space in this case would be a space where each point represents a different cat picture. So, if you were to drop a description of a fluffy white cat into the latent space, the model would navigate through the space and find the point that represents a fluffy white cat. Then, it would use that point as a starting point to generate a new, related cat picture.

This right here is why our prompts are so powerful - **they're working in dimensions we literally can't imagine**. 

We need hundreds of mathematical coordinates to navigate to a point using text. This is why our results get better when we add more modifiers.

The process of navigating through this space and finding points that are related to a given input is called diffusion. Once it found the point closest to the text prompt, it works some more AI magic to generate the output image. 

![](https://hackmd.io/_uploads/HJEowaE5j.png)

[Source](https://www.youtube.com/watch?v=SVcsDDABEkM)

There you have it! You now know the ground work for Stable Diffusion. Check [this](https://jalammar.github.io/illustrated-stable-diffusion/) out for a detailed explanation of the various parts if you’re curious and want to dig deeper.

You might feel like there’s not much point in understanding how any of this works, but now that you do, you’ll be able to build things that others can’t even think of. As I was writing this, OpenAI launched its [new and improved embedding model](https://openai.com/blog/new-and-improved-embedding-model/), which is 99.8% cheaper. 

The model for GPT-3 isn’t open-source, so we can’t use it to make custom applications, but we **can** use the embeddings API to match sets of text directly. This can be used for all sorts of awesome apps, like recommendation systems and natural language search! 

The stuff you’ve just learned is going to compound and take you places you can’t think of :)
