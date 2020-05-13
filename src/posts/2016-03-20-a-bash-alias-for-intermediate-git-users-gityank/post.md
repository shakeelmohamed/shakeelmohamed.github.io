# A bash alias for intermediate git users: gityank

As a git user, every once in a while you'll be doing a `git pull` and be blindsided by the following error:

```bash
git pull
There is no tracking information for the current branch.
Please specify which branch you want to merge with.
See git-pull(1) for details.

    git pull <remote> <branch>

If you wish to set tracking information for this branch you can do so with:

    git branch --set-upstream-to=<remote>/<branch> mybranch
```

So naturally, you groan.
Then proceed to copy/paste pieces of this enormous command, and maybe use shell auto-completion with something like zsh.

## What if I told you there was a better way?

<!-- TODO: replace with non-medium link -->

A while back I had to run this [incantation](https://medium.com/@_shakeel/magic-spells-deploying-an-app-to-aws-opsworks-d53018884dd1) several times every day while migrating a few git repos to different remotes. After 2 days of this madness, I had to create a bash function - and it's saved my sanity hundreds of times since then!

Without further adieu I present `gityank`; when you cant pull, yank!

```bash
gityank() {
    if [ "$#" -eq 0 ]; then
        1="$(gb)"
    elif [ "$#" -eq 1 ]; then
        git branch --set-upstream-to="origin/$1" $1
    else
        git branch --set-upstream-to="$1/$2" $2
    fi
}
```

The function itself is rather simple. The key is `git rev-parse --abbrev-ref HEAD`, which determines the current branch.
In my bash profile, I actually have it aliased to `gb`.