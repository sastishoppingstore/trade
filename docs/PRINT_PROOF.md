# URDU PRINT / PDF PROOF — real browser rendering

Date: 2026-11-03T12:39:47.368Z · Chromium 153 headless · shipped CSS `index-DnnaXXDk.css` · self-hosted WOFF2 fonts.
This is a **rendering fixture**: the markup mirrors `PrintDocument` classes and the text explicitly says
it is not a real customer, price or transaction. No server-side PDF library; PDF = Chromium `page.pdf()`.

| Viewport | Size | Nastaliq loaded | Naskh loaded | Rendered width | Screenshot |
|---|---|---|---|---|---|
| desktop | 1280x900 | true | true | 331 px | `docs/screenshots/urdu-print-desktop.jpg` |
| android-emulated | 390x844 | true | true | 271 px | `docs/screenshots/urdu-print-android-emulated.jpg` |

Real PDF: `docs/screenshots/urdu-invoice-proof.pdf` (A4, print media, Urdu joined correctly).

**Result: PASS** — both fonts loaded and Urdu headings rendered with non-zero width in both viewports.
**INCOMPLETE:** a *physical* Android Chrome device screenshot was not taken (only Android Chrome emulation
via viewport + user-agent). No fabricated screenshot of a real device is claimed.
