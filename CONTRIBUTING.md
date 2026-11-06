# Maintaining RSI Atlas

**This repository is the only active source.** Do not recreate an external notebook mirror or hand-edit generated HTML.

## Source inputs

- `data/method-map.json`: foundational and original-overview coverage.
- `data/atlas-source-notes.json`: versioned mechanism notes.
- `data/research-updates.json`, `data/focus-methods.json`: primary-source updates, four focus methods and unresolved references.
- `data/institutions.json`: cited author affiliations / release publishers, not ownership or current employment.
- `data/ui-translations.json`: English summaries and bilingual UI metadata.
- `data/survey-guide.json`: bilingual cross-survey entry points, analytical questions and evidence scope; the full research synthesis is maintained in the Chinese chapters.
- `data/family-architectures.json`, `data/dynamic-scenes.json`, `data/paper-figures.json`: original category diagrams, mechanism paths and licensed paper figures.
- `scripts/*.template.html`: standalone viewers.

Preserve first dates, revision dates and publication-display dates separately. Unknown facts stay unknown. A named author credit or funding chair is not automatically an institution.

Both CSV exports are generated: `method-map.csv` mirrors the foundational input, while `atlas-methods.csv` includes the complete merged collection, institution names/IDs and date warnings. Do not edit them separately.

## Build and validate

```sh
node scripts/build-atlas.mjs
node scripts/validate-delivery.mjs
npm --prefix scripts ci --ignore-scripts
node --test scripts/*.test.mjs
```

The public build needs no packages, network, private files or models. Tests use development-only Markdown/TeX tools to parse and render every public formula. Browser tests require Chrome/Chromium; a skip is explicit. Source-pinned implementation checks may additionally use `--source-root ../review-sources`.

Before publishing, verify that every tracked file belongs to the public export set. `.local/` is intentionally ignored and must never be force-added. Private engineering reports, archived originals, raw PDFs, logs, caches and backups are not publication inputs.

## Documentation and figures

Detailed technical chapters remain in Chinese; the homepage and README default to English and offer a visible Chinese switch. Keep meaning and evidence scope consistent when translating.

Use GitHub-compatible math: named functions use `\mathrm{...}`, not the rejected `\operatorname` macro; stars use `^*` or `^\star`, not `^\*`. Keep TeX backslashes literal and reject control characters inside formulas. The math regression parses Markdown before rendering so inline code, fenced examples and currency are not mistaken for equations.

Use `\lt` instead of a literal less-than character inside formulas: GitHub's additional HTML decoding can otherwise treat a following variable as a tag and silently remove part of the expression.

Prefer fenced `math` blocks and GitHub's code-style inline math delimiters to protect stars, underscores and TeX escapes from Markdown processing. Keep a whitespace boundary before ordinary inline dollar math adjacent to prose, including Chinese punctuation. Local TeX rendering alone does not prove GitHub compatibility: CI checks both one-to-one recognition and the exact decoded TeX payload through GitHub's Markdown API. Run the same check locally with an authenticated `gh` CLI and `RSI_GITHUB_MATH_CHECK=1 node --test scripts/math.test.mjs`.

Family architecture is an author-created analytical view, representative flow is a specific mechanism, and a paper figure is a separately attributed original. Do not mix these layers. Original figures require explicit reusable licensing or permission, exact version/figure attribution, crop disclosure and an asset hash.

Family diagrams must differ in their mechanism topology, not only colors or labels. Preserve the distinct parameter loop, task–policy co-evolution, memory read/write, harness candidate search, independent evaluation tracks and meta-improver hierarchy. Public implementation previews must correspond to the pinned module/edge audit and remain visible in the portal and case chapters.

## Changes and evidence

Add a source URL and reading scope for factual claims. Tie institution labels to the cited paper version or official release, retain multiple affiliations and mark missing/unknown types. Do not turn announcement copy or a leaderboard number into a claim of recursive acceleration.

Generated files must rebuild deterministically. Keep failed attempts, uncertainty and unresolved sources; never backfill invented dates, affiliations, code links or experimental results.

## Publishing

Verify the intended GitHub account before pushing, and use an already-authorized repository identity. HTTPS credentials also need `workflow` permission when creating or changing Actions workflows. Never weaken access controls or include credentials in a remote URL.

After deployment, compare the remote commit and served HTML bytes with the verified checkout. The actual bilingual/focus/timeline browser regression can also target the live site:

```sh
RSI_ATLAS_TEST_URL=https://hyfine.github.io/rsi-atlas/ node --test scripts/timeline.test.mjs
```
