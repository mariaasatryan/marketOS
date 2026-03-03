# Why code isn’t committed or published automatically

## 1. Commits are never automatic (by design)

Git does **not** auto-commit your changes. You decide when to create a commit so that:

- You control what goes into each commit
- You don’t commit broken or half-finished work
- You can write clear commit messages

So you always need to run something like:

```bash
git add -A
git commit -m "Your message"
git push origin main
```

## 2. Publishing (deploy) *is* automatic after you push

As soon as you **push to `main`**:

1. GitHub runs the **“Deploy to GitHub Pages”** workflow (see `.github/workflows/deploy.yml`).
2. The workflow builds the app and deploys it to GitHub Pages.
3. The site updates at: **https://mariaasatryan.github.io/marketOS/**

So: **commit + push** = **publish**. No extra manual deploy step.

## 3. One command to commit and push

To “publish” in one go (commit all changes and push so the workflow runs):

```bash
npm run ship
```

This will:

- Stage all changes (`git add -A`)
- Show a short status
- If there are changes: commit with a timestamp and push to `main`
- If there are no changes: do nothing (except show status)

After a successful push, wait 1–2 minutes and check the site.

## 4. If the site doesn’t update

- Make sure you’re pushing to the **`main`** branch.
- In the repo: **Settings → Pages** → **Source** should be **“GitHub Actions”**.
- In the **Actions** tab, check that **“Deploy to GitHub Pages”** runs and succeeds after your push.
