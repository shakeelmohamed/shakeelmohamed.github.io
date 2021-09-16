# An actually helpful git diff of your uncommitted changes

TL;DR

```bash
git diff -w --patience
```


So you just made a bunch of changes to a git project, good job. Now you want to review your changes before committing, even better. (I like where you're going with this, please continue.) Then you do what you usually do: `git diff` but this time, the entire file shows up as different.

Why does the diff say the entire file changed? A couple reasons could be:

1. Whitespace changes (tabs vs. spaces, indentation, etc.)
2. File contents got moved in a strange way (rearranging blocks of code, etc.)

So, I think that's sufficient justification for the `-w `flag which ignores whitespace.

Okay great, so now the diff is slightly less weird. But my extremely modified file(s) still has a messy diff... We can do better! Just be patient.

But, what the hell is that `--patience` flag? Long story short, patience is a different diff-ing algorithm (read more about it on [StackOverflow](http://stackoverflow.com/questions/4045017/what-is-git-diff-patience-for)). Using the patience algorithm when computing a diff can be helpful if the file has changed drastically, but in an unusual way. I've seen this come up when:

1. Merging very divergent branches
2. Immediately after a massive refactor
3. Changing variable and/or function names in a strange way - usually due to divergent branches

Now that that's out of the way, review your changes and...

```bash
git commit -m "Use git diff -w --patience if you're diffing this"
```