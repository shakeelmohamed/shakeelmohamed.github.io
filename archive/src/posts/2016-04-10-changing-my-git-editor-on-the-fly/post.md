# Changing My Git Editor On The Fly

I love using Sublime Text as do many developers these days, but I just can't use it regularly for git commit messages.

When I learned git 4 years ago I always used the default editor - vim. I don't particularly enjoy using vim, but it's the command-line editor I know best. For the longest time I would write inline commit messages, ie: `git commit -m "hello world"`.

## Then one day something crazy happened...

[![Tweet: Mo' money, mo' problems](./tweet.png)](https://twitter.com/_Shakeel/status/605207143042580480)

Since then, about 1 year ago, my default commit workflow has become the following

* `git commit`
* (vim launches)
* type `i`
* write awesome commit message
* type `esc` + `:wq`

Nothing special about it, but this workflow is so engrained in my muscle memory I can't seem to turn it off. So... what's the problem? Rebasing commits. Let's say my goal is to squash 10 commits - including merges, this involves editing several lines at once in the same way.

In the main [Zen Audio Player repo](https://github.com/zen-audio-player/zen-audio-player.github.io), I ran `git rebase -i HEAD~10`. Here's the workflow I'd need for either editor.

## In vim

![screenshot of vim](./vim.png)

* `j` to go down a line, skip the first commit
* `xxxx` to delete the 4 characters in `pick`
* `i` to start inserting text
* `s (squash)` or `f (fixup)`
* `esc`
* Repeat the previous 4 steps many times. Actually 48 more times since 50 commits are involved in this rebase!

Estimated completion time: 5 minutes

Probability of making a mistake: 50%

## So, what's the solution?

When in doubt, create a bash alias or function!
Since these are the only 2 editors, I've hardcoded 2 bash functions that will instantly change my git editor.


### Switch to sublime

```bash
gitsubl() {
    git config --global core.editor "subl -n -w"
}
```

### Switch to vim

```bash
gitvim() {
    git config --global core.editor "vim"
}
```

Now, whenever I need to do some rebasing:

* run `gitsubl`
* rebase away...
* run `gitvim` to go back to normal