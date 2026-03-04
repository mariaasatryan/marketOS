# Auto-deployment to GitHub Pages

**Every push to `main` automatically builds and deploys** your site to https://mariaasatryan.github.io/marketOS/

## One-time setup (required)

1. Open **https://github.com/mariaasatryan/marketOS**
2. Go to **Settings → Pages**
3. Under **Build and deployment**:
   - **Source:** **Deploy from a branch**
   - **Branch:** **main**
   - **Folder:** **/docs**
4. Click **Save**

After this, each push to `main` triggers the workflow: it builds the app, updates the `docs/` folder, and the site refreshes in 1–2 minutes.

---

## Why commits aren’t automatic

Git does not auto-commit. You decide when to commit so you control what’s included and can write clear messages. You need to run something like:

```bash
git add -A
git commit -m "Your message"
git push origin main
```

---

## One command: commit + push

To stage, commit, and push in one go:

```bash
npm run ship
```

This stages all changes, commits with a timestamp (if there are changes), and pushes to `main`. After a successful push, wait 1–2 minutes and check the site.

---

## Auto-push after every commit (optional)

Run **once**: `npm run push-hook`. After that, every `git commit` will auto-push the current branch to origin. You can still use `npm run ship` for add + commit + push in one go.

---

## If the site doesn’t load (404)

Do the **One-time setup** above (Settings → Pages → Deploy from a branch → **main** → **/docs**).  

Alternatively, you can use **GitHub Actions** as the source; then ensure the “Deploy to GitHub Pages” workflow has run at least once.
