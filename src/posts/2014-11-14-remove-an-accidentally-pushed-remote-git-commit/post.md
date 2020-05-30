# Remove an accidentally pushed remote git commit

```bash
git checkout <branch name>
git checkout <commit sha>
git push -f -n # Do a dry run
git push -f # Do the damn thing
```