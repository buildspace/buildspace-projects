
### Getting tasty photos of yourself
**The time has come -- time to start training.** 

The first thing you’ll need to do is gather training data. Since we’re making AI avatars of ourselves, we’ll have to get a bunch of pictures. For your first run, I recommend going with 5-10 images. These can’t just be your average selfies though, we have to be very careful with what we teach the AI.

Here’s a few rules for your pics:

1. **Pictures should contain only you** - no friends, dogs, samosas, aunties
2. **Clear backgrounds -** If you can’t get white backgrounds, use [https://remove.bg/](https://remove.bg/) to remove them entirely
3. **Picture quality** - Pictures should be well lit
4. **Picture size** - At least 720p at the minimum. You **can** use laptop webcams but you need to be in a well-lit place (super important!)

You gotta be careful here - more images do **not** mean better results! For my first set I used 19 pics and it came out pretty meh. The big mistake I made was using a blue background in **every** picture. I taught SD that I always have a blue background, so it generated results with blue backgrounds!

![](https://hackmd.io/_uploads/H1hAD6Ncj.png)

Let’s take some pics!! Grab your phone, webcam, DSLR — whatever you got and get snappin. Your pictures should show off features that you want SD to learn about. Maybe you tighten your jawline or get a Zac Efron haircut. Up to you lol. Check out the pics I took below:

![](https://hackmd.io/_uploads/rJxzOpEqo.png)

Once you’ve got all your pics and are happy with the backgrounds, we can prep them for processing. The main thing we need to do here is to resize them to 512x512 because that’s the size of all the images we’ll be generating. Head over to [Birme](https://www.birme.net/?target_width=512&target_height=512) and resize all your pics to 512x512. 

The last thing you need to do is rename all your pics with a unique label. SD has millions of data points for what a “man”, “woman” or “handsome AI developer” looks like. It probably has lots of results for your first name as well. So we need to give you, the subject, a distinct name that we can use in prompts.

I’m mashing my first and last names to get “abraza”. So in a prompt I’d go “Oil paint portrait of **abraza** as a professional wrestler by Vincent Van Gogh”.

Pretty simple eh? You can try a couple of different angles, but make sure they’re close-up pics. Torso pics work too, but keep it above the belt.

Our data is ready! Onwards!

### Training with Google Colab

The main event - **training**. This is where things start to get **REALLY** cool.

Since this is really compute intensive, we’ll need some powerful GPUs for this. Don’t have a beefy GPU? Worry not! Google Colab to the rescue! 

Google Colab is basically just an IDE inside a browser. It’s connected to the Google Cloud Platform so we never have to install any base dependencies and get lots of free compute. Thanks Google!

We’ll be using Python for this part, except you won’t actually have to write any Python or set up a Python environment! This will be done with the magic of Jupyter notebooks.

Checkout this quick TL;DR on Jupyter notebooks on Google Colab:

[https://www.loom.com/share/8fca2d8ef42642d4b5e76ed5279c67d3](https://www.loom.com/share/8fca2d8ef42642d4b5e76ed5279c67d3)

We **can** use Jupyter notebooks in VS Code, but we’ll be using Google Colab cause we get free compute! Who can say no to a free Tesla T4 GPU?  

Colab notebooks can be shared like files, so I’ll just give you a link that you can copy over to your Google Drive. 

Let’s goooooo!