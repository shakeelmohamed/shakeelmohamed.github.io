# Magic Spells: Deploying an app to AWS OpsWorks

Newcomers to [Git](http://git-scm.com/) often struggle with the unintuitive verbiage and workflows, often referred to as “incantations”. I endured a similarly convoluted process (hence, “Magic Spells”) after setting up 4 applications on AWS OpsWorks for my senior project, Exbedia (more on that [here](../2015-03-19-hackers-first-logo-designing-in-powerpoint)). My goal with this post is to walk you through the mind-bending procedures required to setup a new app on AWS using OpsWorks.

> ## “I don’t know what these commands do, they’re incantations I use every time I make changes to this project.” — Hypothetical novice Git user

## GitHub Project Setup

OpsWorks has out of the box support for GitHub repositories, I’ll quickly go through the steps required to get a **public** repo deployed. I’ll describe the process for a simple [Node.js](https://nodejs.org/) app. OpsWorks expects 2 things from your Node.js app:

1. **It runs on port 80 or 443**
2. **Has a server.js file used as the entry point**

Setting the port number should be straightforward if you know where to look in your code, I wasn’t able to get OpsWorks to detect the **PORT** environment variable that many packages like [Express](http://expressjs.com/) use. The server.js entry point seems like a strange limitation, but it’s not that bad. The easiest way to handle this is by creating a symlink called `server.js`. On *nix systems, `cd` to your project’s directory and run:

```bash
ln -s <path_to_your_script> server.js
```

# The Magic Spells

Assuming you’ve completed those 2 steps, and pushed your code, let’s get this app deployed! These steps aren’t super detailed, and things can go wrong with AWS at any point in the process — patience is essential here. I spent about **3 hours** learning the the spells & their specific order before I finally got it right, hopefully this guide will save you some time.

**Here are the 25 magic spells:**

1. Login to AWS
2. Click on OpsWorks
3. Click “add stack” and give it a name
4. Click layers
5. Click add a layer
6. Pick a layer type (**Node.js**), and give it a name
7. Add the layer
8. Click add instance on the layer you just created
9. Click add an instance
10. On the new tab, enter a name, and click add
11. Click start on the instance you just created
12. **Wait, up to 10 minutes** for the instance to boot and be configured.
13. Click apps
14. Click add an app
15. Give it a name
16. Pick a type (**Node.js**), **it has to match the type from #6**
17. Enter the GitHub URL, ex: `https://github.com/<user>/<repo>.git`
18. Enter the git branch name of your repo (master, etc.)
19. Click add app
20. Click deploy
21. **You may have to wait if your instance hasn’t started yet** if you see “No running instances with the OpsWorks status online. You need to start instances before you can deploy your app.”
22. Click deploy
23. Wait for deployment to complete, it shouldn’t take more than a few minutes. Most of mine took under 3 minutes.
24. Click instances
25. Click on the public IP you see, and you should see your web app!


## Postmortem

Well, that was unpleasant.

As a casual [Heroku](https://www.heroku.com/) user, this process was significantly more painful and I can understand why many developers are using it. Once your initial OpsWork stack is setup, you can literally do a one click “Deploy App”, then AWS will pull the latest bits from GitHub and try to deploy your app.

Very soon I’ll be setting up continuous deployment with a private GitHub repository, and hope to write about that process as well.
