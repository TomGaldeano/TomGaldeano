You start work on Computer B before Computer A pushed its changes.

On computer B before syncing
git checkout -b temp-work
git add .
git commit -m "WIP on Computer B"
git push origin temp-work

On Computer A (with unpushed changes)
git add .
git commit -m "Work from Computer A"
git push origin main

git fetch origin
git checkout main
git merge origin/temp-work
git push origin main
git branch -d temp-work
git push origin --delete temp-work


Commit and push your work:
On Computer B (before syncing)
git checkout main
git pull origin main

IF a did not merge 
git merge origin/temp-work
git push origin main
git branch -d temp-work
git push origin --delete temp-work
Save your work on a branch: