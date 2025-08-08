# Josh Schuler • @schulerj89

A lightweight, modern GitHub Pages site built with plain HTML/CSS/JS. Includes:

- Particle background canvas
- Glassmorphism cards and sticky header
- Dark/Light theme toggle with persistence
- Subtle 3D tilt cards and scroll reveal

## Local preview

You can just open `index.html` directly in a browser, or serve with a simple static server.

### Python (if installed)
- Python 3: `python -m http.server 8080`
- Python 2: `python -m SimpleHTTPServer 8080`

Then go to http://localhost:8080

## Deploy to GitHub Pages

Option A — User/Org site (recommended):
1. Name this repository exactly `schulerj89.github.io`.
2. Push `index.html`, `styles.css`, and `script.js` to the `main` branch.
3. Pages will be live at https://schulerj89.github.io

Option B — Project site (this repo name can be anything):
1. Push to GitHub.
2. In GitHub Settings → Pages, set Source to `Deploy from a branch`, pick `main` and `/ (root)`.
3. The site will be at `https://schulerj89.github.io/<repo-name>`.

## Customize
- Edit social links in `index.html` (About, Projects, Contact).
- Replace placeholder projects.
- Update email and LinkedIn URLs.
- Drop a `resume.pdf` in the repo root if you want the Resume link to work.

## License
MIT
