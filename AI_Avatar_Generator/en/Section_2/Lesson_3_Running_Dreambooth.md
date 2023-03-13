**Before you get started, make sure your Google Drive account has at least 5 GB of free space.** We’ll be saving the fine-tuned model to Gdrive, and it takes up about 2-3 gigs.

We’re going to be using an extra special version of Stable Diffusion which is optimised for memory. The best part? The entire training/tuning workflow will happen in Google Colab without writing a single line of code!

Be warned though - even though Colab is free, the resources aren’t permanently available. Make sure you have at least **60 minutes** free to go through this section, cause if you leave it running you might run out of free hours.

If you ***do*** need to leave at any time before training finishes, you’ll have to disconnect your runtime using the dropdown menu next to the RAM/Disk bars on the top right. This will reset your environment so when you come back next time you’ll have to start from the top (step 1 in the notebook).

![https://hackmd.io/_uploads/S17baDlYs.png](https://hackmd.io/_uploads/S17baDlYs.png)

Start by [clicking this link](https://colab.research.google.com/github/buildspace/diffusers/blob/main/examples/dreambooth/DreamBooth_Stable_Diffusion.ipynb). It’ll open up a Jupyter notebook in Colab. The first thing you wanna do is make sure you’re on the correct Google account. If you aren’t, click your profile on the top right and switch to an account with at least 5 gigs free.

Next, you wanna copy the notebook to your Gdrive. This will open it up in a new tab.

![](https://hackmd.io/_uploads/H1ONOTVco.png)

We’re ready to rumble! 

The notebook has a few extra bits that you can ignore on the first run. 

**Remember -** You’ll only need to run each block one time.  

The first block will connect our notebook to a virtual machine and show us what we’re connected to. This block also starts a timer — you only get a limited number of GPU hours for free.

![](https://hackmd.io/_uploads/SyBBupV5j.png)

**Set up environment**

The first thing we’re gonna do is sort out the requirements. Every time we open up a new Colab notebook, we’re connecting to a brand-new virtual machine. You’ll need to install requirements every time your machine disconnects - the state is cleared.

![](https://hackmd.io/_uploads/ryrUu6N9i.png)

This will take about 2-4m.

While that’s running, head over to [HuggingFace](https://huggingface.co?ref=buildspace) and sign up. Once you create an account, we are going to need to generate an access token! This will be used in the “Login to HuggingFace” section of Colab.

To grab this, just click on your profile, click “Settings” and the go to “Access Tokens” on the left :).

Here you will want to press “New token” at the bottom of the page. Name this thing whatever you want and make sure to give it the write role (more on this later) —

![](https://hackmd.io/_uploads/BJ1wdTNqi.png)

Chuck that bad boy into the token field and run when the requirements block is all done.

![](https://hackmd.io/_uploads/SyG_dpV9o.png)

**Hold up - wtf is HuggingFace?**

In order for us to go from text → image on our app, we’re going to need to run Stable Diffusion! For now, we’ll be able to do this in Colab, but Colab doesn’t have API endpoints it can expose. This means we need to be able to host and run SD somewhere - remember that it’s insanely GPU intensive, meaning it will only allow like 1% of the world to use our app lol.  

Luckily, the world has already been using cloud computing forever and we can rent NVIDIA’s newest GPUs no problemo 🤘. **BUT** — these fancy GPUs can cost $100s per month to just keep up. 

That’s where Hugging Face (🤗 ) comes in. It’s one of the world’s largest AI libraries out there looking to expand the world of AI through open source. 

A lot of braincells went into trying to figure out how we could make this free for all and are **HYPED AF**  to show you exactly how to do it.

But for now, lets head back to Colab.

Next, we need a fancy lib called xformers. These are an additional dependency that will seriously speed up how fast Stable Diffusion runs. You don’t need to know how this works, just that you should definitely use it whenever possible since it will 2x performance.

The version will need to be kept updated, it’s 0.0.15 at the time of writing - if this breaks, head over to `#section-2` help and tag the `@alec`.

**Configure your model**

Let’s take a lil breather here! You just did a lot of awesome stuff in Colab:

1. Got started with a free GPU from Google
2. Setup your HuggingFace account + created an Access Token
3. Installed some xformers

**The internet is crazy dude.**

Now we need to tell the notebook which model we want to use. Since we’re connecting to HuggingFace, we can read any public model on there. 

V2.1 is really wonky with prompts so I’m going with v1.5. You can try v2.1 later, for now just enter this path into the `MODEL_NAME` field and get going:

```
runwayml/stable-diffusion-v1-5
```

The way you choose a model is by putting in the path of the URL on HuggingFace. So `https://huggingface.co/runwayml/stable-diffusion-v1-5` becomes `runwayml/stable-diffusion-v1-5`.

Super important -- **make sure `save_to_gdrive` is checked!** That way if the notebook crashes for whatever reason, you won’t have to retrain your entire model again 🥲.

**Please note** — even though you **can** use other fine-tuned models, our notebook only supports Stable Diffusion v1.5 and v2.1. If you somehow got your hands on the MidJourney model, it won’t work here.

**Configure training resources**

The beauty of this model is that it’s incredibly optimised and can be configured to run with comparatively fewer resources. Luckily we won’t need to mess around with this - Google Colab will push it out.

Head over to step 5.5 so we can tell Stable Diffusion ***what*** we’re training it on.

**Instance prompt**: this describes exactly what your images are of. In our case it's whatever we decided as the name ("abraza" for me) and "man/woman/person". This is the **label** for the images we uploaded.

**Class prompt**: this just describes what else Stable Diffusion should relate your model to. "man", "woman" or "person" works :)

![](https://hackmd.io/_uploads/SJWi_TE9i.png)

**Step 6 -** **Upload images**

This one’s pretty straightforward! Run the block, a “Choose Files” button will pop up. Click choose files and upload the images we prepped earlier. 

![](https://hackmd.io/_uploads/r17adp4qi.png)

**Step 7 - Configure training options**

Wait, wait, wait. We are already getting ready to train this thing on our face? This feels like a magic trick has been exposed to you right? I hope you are seeing how doing this, while takes a solid amount of time, is actually so straight forward with the current tech out there! Let’s freaking run this thing 🤘

Okay, this next section may seem intimidating, but you don't have to touch most of it!

Again, I've left these in here if you really know what you're doing and want to customise your model, for your first time all you need to do is:

1. **Change `max_train_steps`**. You wanna keep this number lower than 2000 - the higher it goes, the longer training takes and the more "familiar" SD becomes with you. Keep this number small to avoid overfitting. The general rule of thumb here is 100 steps for each picture, plus 100 if you’re under 10 pics. So for 6 pictures, just set it to 700! If you think the results don’t look like you enough, just come back here and turn this number up lol
2. **Update `save_sample_prompt` to a prompt with your subject.** Right after training, this block will generate 4 images of you with this prompt. I recommend spazzing it up a bit more than just "Photo of xyz person", those come out quite boring. Put those prompting skills to use!

![](https://hackmd.io/_uploads/BJflFa4qs.png)

While the training is happening, take a moment to get up and stretch! Your back will thank you and you’ll be able to stare at screens for a much longer period of your life. 

![https://hackmd.io/_uploads/rJ2Zt6Nqs.png](https://hackmd.io/_uploads/rJ2Zt6Nqs.png)

When that’s all done, run through blocks 7.2 and 7.3 without any changes. You should see your first images!!!  

**YOU’RE A MACHINE LEARNING ENGINEER NOW WOOOOOO.**

Okay, well, maybe not just yet. 

Run through the next two blocks - you won’t need to change anything on this first run.

Step 8 converts the weights to a CKPT format - this is necessary if we want to upload it to HuggingFace and get inference endpoints. 

Step 9 prepares the converted model so it’s ready for inference. Again - you don’t need to know how this works, this bit is here in case you want to change the `model_path`. 

**Generate images**

We’re here - the promised land. Use your magic prompt powers and the unique subject identifier to make some magic happen.

You can turn up the inference steps to get more detailed results, or turn up the guidance scale to make the AI more obedient to your prompt. I like 7.5 for the guidance scale and 50 for the inference steps.

I’ve found it does best with well defined themes with lots of material online like TV shows, bands, fanart.

Here’s me as a Peaky Blinders character, a mafia boss, and if I were in Blink182:

![https://hackmd.io/_uploads/HygXHa49i.png](https://hackmd.io/_uploads/HygXHa49i.png)

I got all of these on the **first** try! **UNREAL.** 

Here’s the prompts I used:

```
1. concept art oil painting of [SUBJECT] by [ARTIST], extremely detailed, artstation, 4k

2. Portrait of [SUBJECT] in [TV SHOW], highly detailed digital painting, artstation, concept art, smooth, sharp focus, illustration, art by [ARTIST 1] and [ARTIST 2] and [ARTIST 3]

3. Portrait of [PERSON] as [CHARACTER], muscular, fantasy, intricate, elegant, highly detailed, digital painting, artstation, concept art, smooth, sharp focus, illustration, art by [ARTIST] and [ARTIST 2] and [ARTIST 3]
```

I mixed a few different artists here - the trick is to make sure their styles are similar. 

The big pot of gold that’s giving you all this magic is the 4GB `.CKPT` file in your Google Drive folder. That is what we’ve been working towards all this time - a custom Stable Diffusion model trained on **you (**or your cat).

Next, we’ll put it up on HuggingFace and set up a React app to let the world try it out!

### Upload to HuggingFace

The last step (#11) is extra special — it takes your custom-tuned model and all the necessary files and puts them on HuggingFace. 

When hosting models, there’s two big problems we usually need to solve — 

1. **Where do we host our fancy new model?**
2. **How do we actually call our hosted model?**

HuggingFace has solved both of these for us! It’s hosting our model and has inference API endpoints we can access.

You won’t need to do much here - just change the concept name (ex: SD-Raza) and put in a write token from HuggingFace (you can use the same one you generated at the beginning!), hit the run button, and watch the magic happen. 

![https://hackmd.io/_uploads/ByCNKTN5s.png](https://hackmd.io/_uploads/ByCNKTN5s.png)

Click the link and you’ll see this bit on the right side:

![https://hackmd.io/_uploads/BJMIKpNqi.png](https://hackmd.io/_uploads/BJMIKpNqi.png)

This is UI for your inference API! Put a prompt in there and see the magic happen :D

Once you press compute, you’ll notice that you’ll get a “Model is loading” message. This is one of the caveats of using hugging face as a free service. Since it costs so much money to keep this model in memory, Hugging Face will automatically clear your model out of their memory if your model isn’t being used. This saves them resources + money on a model that isn’t getting a lot of traffic.

Sometimes this process can take up to **5 minutes.** So don’t be alarmed if you are waiting multiple minutes. 

Just like that, you have an image generated, just like in Colab! Head over to your [usage link by clicking here](https://api-inference.huggingface.co/dashboard/usage). This thing is actually pretty cool. Hugging Face gives you 30K free characters (essentially credits to run these queries). Thats **PLENTY** to get you started :).

**Wow — you just created a custom model, hosted your model somewhere, AND now have an endpoint you can call in your web app 👀**

**Please do this or Raza will be sad**

The coolest part about MidJourney is the Discord server. You can see what everyone else is doing and it really inspires you. I want you to share your best prompts in `#prompts`. Tell us what works and what doesn’t! This new tech is a mystery, we can figure it out amongst ourselves :)
