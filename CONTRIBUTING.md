# Maintaining RSI Atlas

**This repository is the only active source.** Do not recreate an external notebook mirror or hand-edit generated HTML.

## Source inputs

- `data/method-map.json`: foundational and original-overview coverage.
- `data/atlas-source-notes.json`: versioned mechanism notes.
- `data/research-updates.json`, `data/focus-methods.json`: primary-source updates, four focus methods and unresolved references.
- `data/institutions.json`: cited author affiliations / release publishers, not ownership or current employment.
- `data/ui-translations.json`: English summaries and bilingual UI metadata.
- `data/family-architectures.json`, `data/dynamic-scenes.json`, `data/paper-figures.json`: original category diagrams, mechanism paths and licensed paper figures.
- `scripts/*.template.html`: standalone viewers.

Preserve first dates, revision dates and publication-display dates separately. Unknown facts stay unknown. A named author credit or funding chair is not automatically an institution.

Both CSV exports are generated: `method-map.csv` mirrors the foundational input, while `atlas-methods.csv` includes the complete merged collection, institution names/IDs and date warnings. Do not edit them separately.

## Build and validate

```sh
node scripts/build-atlas.mjs
node scripts/validate-delivery.mjs
node --test scripts/*.test.mjs
```

The public build needs no packages, network, private files or models. Browser tests require Chrome/Chromium; a skip is explicit. Source-pinned implementation checks may additionally use `--source-root ../review-sources`.

Before publishing, verify that every tracked file belongs to the public export set. `.local/` is intentionally ignored and must never be force-added. Private engineering reports, archived originals, raw PDFs, logs, caches and backups are not publication inputs.

## Documentation and figures

Detailed technical chapters remain in Chinese; the homepage and README default to English and offer a visible Chinese switch. Keep meaning and evidence scope consistent when translating.

Family architecture is an author-created analytical view, representative flow is a specific mechanism, and a paper figure is a separately attributed original. Do not mix these layers. Original figures require explicit reusable licensing or permission, exact version/figure attribution, crop disclosure and an asset hash.

## Changes and evidence

Add a source URL and reading scope for factual claims. Tie institution labels to the cited paper version or official release, retain multiple affiliations and mark missing/unknown types. Do not turn announcement copy or a leaderboard number into a claim of recursive acceleration.

Generated files must rebuild deterministically. Keep failed attempts, uncertainty and unresolved sources; never backfill invented dates, affiliations, code links or experimental results.

## Publishing

Verify the intended GitHub account before pushing, and use an already-authorized repository identity. HTTPS credentials also need `workflow` permission when creating or changing Actions workflows. Never weaken access controls or include credentials in a remote URL.

After deployment, compare the remote commit and served HTML bytes with the verified checkout. The actual bilingual/focus/timeline browser regression can also target the live site:

```sh
RSI_ATLAS_TEST_URL=https://hyfine.github.io/rsi-atlas/ node --test scripts/timeline.test.mjs
```
