# CrossLife Website

Informational site for CrossLife, published at https://crosslife.org.

## Layout

- `site/`: the public website (static HTML, CSS and JS). This is the only folder GitHub Pages deploys.
- `content/`: study content (course JSON and lesson Markdown) held for the CrossLife app. It is **not** deployed.
- `.github/workflows/deploy.yml`: deploys `site/` to GitHub Pages on every push to `main`.

## Pages

| Page | Purpose |
|---|---|
| `index.html` | Home: mission, channels, featured studies, app, book |
| `about.html` | Mission, vision, approach, languages |
| `beliefs.html` | Statement of faith and areas of liberty |
| `studies.html` | Study catalog (status only; lessons ship in the app) |
| `app.html` | CrossLife app, coming soon, with launch sign-up |
| `book.html` | *The Story of Salvation*, coming soon, with sign-up |
| `contact.html` | Contact form |

## Forms

All forms post to Web3Forms. The access key is in `site/js/site.js`. Submissions go to the email address registered with that key. Each form sets its own `subject`, so contact messages and sign-ups can be told apart.

## Local preview

```bash
cd site && python3 -m http.server 8000
```
