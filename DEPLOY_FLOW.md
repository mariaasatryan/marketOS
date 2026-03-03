# Auto-deployment to GitHub Pages

**Every push to `main` automatically builds and deploys** your site to https://mariaasatryan.github.io/marketOS/

## One-time setup (required)

1. Open **https://github.com/mariaasatryan/marketOS**
2. Go to **Settings → Pages**
3. Under **Build and deployment**:
   - **Source:** choose **Deploy from a branch**
   - **Branch:** **main**
   - **Folder:** **/docs**
4. Click **Save**

After this, every time you push to `main` (e.g. with `npm run ship`), the GitHub Action will build the app, update the `docs/` folder, and the site will refresh in 1–2 minutes.

---

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

## 4. If the site doesn’t load (404) – do this

The workflow now updates the **`docs/`** folder on every push. For the site to work:

1. Open your repo: **https://github.com/mariaasatryan/marketOS**
2. Go to **Settings → Pages** (left sidebar).
3. Under **Build and deployment**, set:
   - **Source:** **Deploy from a branch**
   - **Branch:** **main**
   - **Folder:** **/ (root)** → change to **/docs**
   - Click **Save**.

4. Wait 1–2 minutes. The site should be at: **https://mariaasatryan.github.io/marketOS/**

If you prefer to use **GitHub Actions** as the source instead, select **GitHub Actions** and ensure the “Deploy to GitHub Pages” workflow has run at least once.
