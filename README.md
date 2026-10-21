# SpecWatt Midterm Presentation

Animated HTML slides for the SpecWatt midterm presentation. The deck is
self-contained and does not require a build step or external JavaScript
packages.

The presentation contains seven slides for an eight-minute update:

- Slides 1–2: Jinglin, context and end-to-end evaluation plan.
- Slides 3–5: Shurui, kernel validation and A30 timing results.
- Slides 6–7: Muyun, EnergAIzer results, limitations, and next steps.

## Preview

From the repository root:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

Use Left/Right, Up/Down, Page Up/Page Down, Space, Home, or End to navigate.
The edge buttons also move between slides. Add a slide number as a URL hash,
for example `http://localhost:8000/#6`, to open a specific page.

## Structure

- `index.html`: responsive 16:9 presentation viewer.
- `slides/slide-XX.html`: individual 1600 x 900 pages.
- `slides/theme.css`: shared typography, color, layout, and entry animation.
- `scripts/deck.js`: navigation and iframe lifecycle.
- `scripts/slide-runtime.js`: per-slide scaling and animation replay.
- `scripts/chart.js`: native SVG rendering for the editable data charts.

The deck uses the verified 1B draft / 3B target midterm results. The A100
energy results are labeled as supported-kernel-only because the current
EnergAIzer interface rejects asymmetric FlashAttention shapes.
