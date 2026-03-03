# marketOS – Where Things Stand (Simple Overview)

You’re not an engineer, and that’s fine. Here’s what you have and what to do next.

---

## What you have

| Piece | What it is | Status |
|-------|------------|--------|
| **Code** | React app (Vite) in this repo | ✅ Edited in Cursor, pushed to GitHub |
| **Database & Auth** | **Supabase** (Postgres + login) | ⚠️ Code is wired for it; you must set it up once |
| **Hosting / “Launch”** | **GitHub Pages** (free) | ⚠️ Needs one-time settings; then every push = new version |
| **Your own domain** | e.g. market-os.tech | ❌ Not required; you can add it later |

So: **code is on GitHub**. **Database = Supabase.** **Site is (or will be) on GitHub Pages.** No separate server is required unless you decide you want one later.

---

## 1. Database (Supabase) – “Connect to a database”

The app **is** built to use Supabase. You only need to connect it once.

1. **Create or open a Supabase project**
   - Go to [supabase.com](https://supabase.com) → sign in → create a project (or use an existing one).
2. **Get two values from the dashboard**
   - **Project URL** (e.g. `https://xxxxx.supabase.co`)  
   - **Anon (public) key**  
   - In the project: **Settings → API**.
3. **Create a `.env` file in the project root** (same folder as `package.json`):
   ```env
   VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```
   Replace with your real URL and key. **Do not commit `.env`** (it’s in `.gitignore`).
4. **Create the tables**
   - In Supabase: **SQL Editor**.
   - Run the scripts from the `supabase/migrations/` folder (in order: `20250115000001_...`, then `20250115000002_...`, then `20250115000003_...`).
   - If something errors (e.g. “table already exists”), you can skip that part.

After this, the app will use **your** Supabase project (auth + database). No hardcoded keys are left in the repo.

---

## 2. Launch the site (GitHub Pages = your “server”)

The app is **not** on a separate server. It’s a **static site** on **GitHub Pages**. That’s enough for this frontend + Supabase setup.

**One-time setup:**

1. Open your repo: **https://github.com/mariaasatryan/marketOS**
2. **Settings → Pages**
3. Under **Build and deployment**:
   - **Source:** **Deploy from a branch**
   - **Branch:** **main**
   - **Folder:** **/docs**
4. Save.

After that, **every push to `main`** (e.g. with `npm run ship`) will update the site in 1–2 minutes at:

**https://mariaasatryan.github.io/marketOS/**

So: **GitHub Pages is where the app is “launched”; no other server is needed** unless you later move to Vercel/Netlify/etc.

---

## 3. Using your own domain (optional)

You had a CNAME for **market-os.tech**. You can use it like this:

1. In your **domain registrar** (where you bought market-os.tech), add a record:
   - Type: **CNAME**
   - Name: `www` (or `@` if the registrar supports it for root)
   - Value: **mariaasatryan.github.io**
2. In GitHub: **repo → Settings → Pages**:
   - Under “Custom domain”, enter **www.market-os.tech** (or **market-os.tech**).
   - Save. GitHub will show you what DNS to use if needed.

Then the same site will be reachable at your domain. The app code doesn’t need to change.

---

## 4. Quick checklist

- [ ] **Supabase:** Create/open project → copy URL + anon key → put them in `.env`.
- [ ] **Supabase:** Run the SQL from `supabase/migrations/` in the SQL Editor.
- [ ] **GitHub Pages:** Settings → Pages → Deploy from branch → **main** → **/docs**.
- [ ] **Deploy:** Run `npm run ship` (or push to `main`); wait 1–2 min and open https://mariaasatryan.github.io/marketOS/
- [ ] **Domain (optional):** Point market-os.tech to GitHub Pages and set the custom domain in the repo.

---

## 5. What was cleaned up

- **Removed** a duplicate file that had **Supabase URL and key written in the code** (`src/utils 2/env.ts`). That’s a security risk. The app now uses only the `.env` file (which you create locally and never commit).

You’re not lost: you have **code on GitHub**, **database = Supabase**, **hosting = GitHub Pages**. Configure Supabase and Pages once, then push when you want to update the site.
