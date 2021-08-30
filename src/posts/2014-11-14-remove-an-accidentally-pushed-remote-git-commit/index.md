---
layout: post
date: 2014-11-14
title: Remove an accidentally pushed remote git commit
// TODO: add a description
description: 
tags:
    - post
    - git
---

<!-- TODO: need to style code blocks with some better vertical padding -->
```bash
git checkout <branch name>
git checkout <commit sha>
git push -f -n # Do a dry run
git push -f # Do the damn thing
```