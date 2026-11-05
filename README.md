# CHOLA DIGITAL MUSEUM – Explore the Glory of the Chola Dynasty

Vanilla HTML, CSS and JavaScript. Historical data lives in JSON. No build step, no mandatory backend.

## Structure
- `index.html`, `css/style.css` (Ancient Heritage theme), `js/app.js`, `js/config.js`
- `data/` kings, temples, timeline (events and battles), quiz, history (facts, guide knowledge base, gallery, culture topics)
- `tests/smoke_test.py` and `tests/render_test.js`
- `worker/` optional proxy for a live AI guide

## Run locally
Data is loaded with `fetch`, so serve over http (not file://):
`python3 -m http.server 8000` then open http://localhost:8000

## Tests
`python3 tests/smoke_test.py` (needs Python 3 and Node). It validates the JSON, checks palette and file links, serves the site over HTTP, then renders every page and exercises quiz scoring, levels, restart, search and bookmarks in a stubbed DOM. It is not a real browser test.

## Guide
The guide uses a local keyword knowledge base and is labelled as a demo, not AI. To connect a live model, deploy `worker/` (Cloudflare Worker keeping the API key secret) and set `aiEndpoint` in `js/config.js`. The worker was not tested.

## Deploy to GitHub Pages
Push the folder to a repo, then Settings → Pages → Deploy from branch → `main` / root.

## Limits
- Languages: English and Tamil. Tamil covers the interface, ruler and temple names, short role summaries, temple descriptions, the timeline, battles, king biographies, culture pages, the quiz, daily facts, map labels, the demo guide, About and narration. Only a few small messages (loading, errors, footer) are still English. The Tamil text was written by an AI and has not been reviewed by a native-speaking historian; please have it checked.
- All 13 kings have profiles with context and achievements; the later kings’ entries are shorter because less is firmly established.
- Images are original stylised SVG illustrations; real photos are linked from Wikimedia Commons, not bundled. No portraits are used.
- Map is schematic, not to scale.
- Not tested in real browsers or on devices; narration depends on the voices installed on the device.
- Sources: K. A. Nilakanta Sastri, *The Cholas*; UNESCO. Verify before academic use.
