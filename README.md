# Bake for Books — fundraiser website

A one-page site for a bake sale fundraiser supporting Afghan girls' education.
No backend, no database, no server — just static files you can edit, preview,
and publish for free.

## Files

- `index.html` — all page content and structure
- `styles.css` — all visual design (colors, fonts, layout, animations)
- `script.js` — mobile menu + scroll animations (~30 lines, zero dependencies)
- `images/` — put your bake sale photos here, then reference them in `index.html`
- `.gitignore` — tells Git which files to never track

## Before you publish: swap these placeholders

Search `index.html` for anything in `[BRACKETS]` and replace it:

- `[YOUR SCHOOL/CLUB NAME]` — hero subheading
- `[DATE, TIME]` and `[LOCATION]` — the bake sale section
- `[CHARITY NAME]` and its donate link (currently points to Malala Fund's
  Afghanistan page as a working example — swap for whoever you actually
  partner with)
- `[email@example.com]` / `[Instagram handle]` — footer
- The wordmark "Bake for Books" and the `<title>` tag — rename to whatever
  you're actually calling this

## Preview it locally

No installs needed:

1. Double-click `index.html` — it opens straight in your browser.
2. For live-reload while editing: install the "Live Server" extension in
   VS Code, right-click `index.html`, choose "Open with Live Server."

## Next steps

Once the content's final, this folder is ready for `git init` and a push to
GitHub Pages, Netlify, or Vercel — see the deployment walkthrough in chat.
