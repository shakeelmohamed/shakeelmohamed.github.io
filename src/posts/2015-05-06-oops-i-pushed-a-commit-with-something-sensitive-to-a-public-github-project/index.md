---
layout: post
date: 2015-05-06
title: "\"Oops, I pushed a commit with something sensitive to a public GitHub project!\""
description: So you accidentally pushed a commit with some credentials. Shame on you. Here's a potential solution...
tags:
    - post
    - development
    - git
---

**So you accidentally pushed a commit with some credentials.** Shame on you.

Here's a potential solution:

1. Make the GitHub repository private
2. Rename the repository, maybe just append "-backup"
3. Make a note of the offending commits
4. Run `git fetch --all`
5. Create a new GitHub repo with the same name, this will break the automatic aliasing GitHub does when you rename a repo
6. Do all kinds of `rebase` and/or `filter-branch` locally to make sure the credentials don't exist at any commit. This might take a while if you have to `rebase` more than a few commits.
7. Run git garbage collection: `git gc --aggressive`
8. Make sure none of the offending SHAs exist, you can just `grep` inside the `.git` directory of your local repo.
9. Run `git push --all -f` to push all the branches, assuming you've already fetched them in step 4.

![Push all the branches](./push-all-the-branches.jpg)

## Preventing this in the future

* Tell the person who made the commit the consequences of what just happened.
* More importantly, try to figure out why it happened, maybe they were under a tight deadline and got a bit sloppy - it happens to the best of us.
* Try to store credentials in environment variables, config files that are added to your `.gitignore`, or any way you can keep them out of your code.

![Insanity Wolf](./insanity-wolf.jpg)
