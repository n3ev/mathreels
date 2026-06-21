# Putting MathReels online (free, ~10 minutes)

This deploys the whole app (frontend + backend + database) as **one free web
service on Render**. You get a public link like `https://mathreels.onrender.com`
that works on anyone's phone or laptop.

You only need two free accounts: **GitHub** (you have this) and **Render**.

---

## Step 1 - Put the code on GitHub

Open a terminal **inside the `math-reels` folder** and run these one at a time:

```bash
git init
git add .
git commit -m "MathReels POC"
```

Now make an empty repo on GitHub:

1. Go to https://github.com/new
2. Name it `mathreels` (Public or Private, either is fine).
3. Do **not** tick "Add a README" - leave it empty.
4. Click **Create repository**.

GitHub then shows a "push an existing repository" box. Copy the two lines it
gives you and run them. They look like this (use *your* username):

```bash
git remote add origin https://github.com/YOUR-USERNAME/mathreels.git
git branch -M main
git push -u origin main
```

Refresh the GitHub page - your code should be there.

---

## Step 2 - Deploy on Render

1. Go to https://render.com and sign up (the **"Sign up with GitHub"** button is
   easiest - it links the two accounts for you).
2. In the Render dashboard click **New +** -> **Blueprint**.
3. Pick your `mathreels` repository from the list and click **Connect**.
4. Render reads the included `render.yaml` and shows a service called
   **mathreels** on the **Free** plan. Click **Apply** / **Create**.
5. Watch the logs. The first build takes a few minutes (it installs everything,
   builds the site, and seeds the questions). When you see
   `🚀 MathReels running...` it's live.

At the top of the service page you'll see your URL, e.g.
`https://mathreels.onrender.com`. Open it, swipe through the reels - that's the
link you share with people.

---

## Good to know

- **Free tier sleeps.** If nobody has visited for ~15 minutes, the first load
  takes about 30 seconds to wake up. After that it's instant. Totally fine for
  showing people; just open the link a minute before a demo.
- **Progress resets on redeploy.** The database is re-seeded fresh each time the
  service restarts, so the question set is always clean. That's intentional for a
  demo.
- **Updating it later.** Make your changes, then in the terminal run
  `git add . && git commit -m "update" && git push`. Render redeploys
  automatically within a minute or two.
- **Custom name.** You can rename the service in Render's settings to change the
  `xxxxx.onrender.com` part (if the name is free).

---

## If something goes wrong

- **Build fails on `better-sqlite3`:** open the service's **Environment** tab and
  confirm there's a `NODE_VERSION` set to `20` (the blueprint sets this for you).
- **Page loads but questions don't appear:** check the **Logs** tab for a line
  like `Seeded 15 MathReels questions`. If it's missing, click
  **Manual Deploy -> Clear build cache & deploy**.
- **Still stuck:** copy the red error line from the Logs tab and send it to me.
