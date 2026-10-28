# Verification — 28 October 2026

## Engine

`node test.mjs` passes: sample objective/reconciliation, comparison with cheapest-route-first, invalid/duplicate inputs, zero supply, zero demand, safe-integer upper bound, and 160 seeded small networks compared with an independent exhaustive feasible-allocation oracle. The first handwritten sample cost expectation was wrong (195); tracing the actual shipments established170 and corrected the test. No algorithm defect or unearned result was hidden.

## Actual browser workflow

Local page loaded and calculated110/135units, weighted unmet25, cost170. Baseline weighted unmet85/cost145. Full6route delivery table and destination shortfalls observed. Reviewed checkbox enabled export; the downloaded JSON was parsed independently and contains original input, all6routes, baseline and review state. Editing the input invalidates the review and disables export. Malformed input displays a readable error; resetting the sample restores functionality. Keyboard Tab moved focus to the file input with a visible focus ring.

Responsive workflow ran in a390×844CSS-pixel iframe; narrow stacked layout and calculated results inspected. The browser viewport override did not actually resize the top-level viewport, so it was not counted as a mobile-device test. The saved screenshot is iframe-based QA. No physical phone, screen reader or manual file-picker import test performed.

## Demo and limitations

Public GitHub Pages deployment built successfully. The demo video is a captioned walkthrough assembled from actual tested browser-state captures; it is not a continuous screen recording or a field pilot. FFprobe reported about72seconds, H.264. A decoded midpoint frame was visually inspected for legibility. Public video hosting is still required before submission.

No real community inputs, user interviews, hydraulic/network simulation, water-safety validation or operational deployment. Priority weights are assumptions; the solver optimizes them rather than proving social fairness. No AI inference in runtime. Development assistance: OpenAI Codex, including source, test and documentation generation.
