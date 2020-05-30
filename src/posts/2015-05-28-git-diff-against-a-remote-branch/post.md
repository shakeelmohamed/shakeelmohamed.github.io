# git diff against a remote branch

This is equivalent to previewing a pull request, and it works great across remotes!

```bash
git diff -w --patience HEAD...origin/master
```

But, what are those crazy arguments? read my other [protip](../2015-04-21-an-actually-helpful-git-diff-of-your-uncommitted-changes) for an explanation.