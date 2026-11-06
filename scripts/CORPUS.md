# Corpus Acquisition (private historical tooling)

The public repository ships an offline atlas builder and validator, not the historical acquisition pipeline. Corpus scripts, HTTP logs, snapshots, downloads, source clones, and operational backups remain private and are excluded from Git. The Markdown catalog is a broad, metadata-only discovery index, not a verified set of RSI algorithms.

The single-source migration archived these original tools and outputs under the ignored local area. Historical paths below describe the earlier pipeline, not active public inputs or a second maintained notebook tree.

## Commands

From the project directory:

```sh
node scripts/build-atlas.mjs
node scripts/validate-delivery.mjs
node --test scripts/*.test.mjs
```

The historical download policy is paused. Twenty-seven foundational and representative papers were retained privately; public entries link to primary sources. This is a storage decision, not a claim of full-text review. No public build downloads PDFs or executes research code.

`corpus-curate.mjs` defaults to a dry run. The explicit `--apply` flag verifies hashes before deleting only catalog-owned, unselected or redundant PDF/cache files under managed paper directories. Unknown files, symlinks, changed content, and original user files are not deletion candidates. The plan and per-file deletion journal preserve provenance. Rebuild reports after applying curation.

Individual stages: `snapshot`, `clone`, `discover`, `audit`, `follow`, `metadata`, `download`, `versions`, `report`, `verify`. Download entry points fail closed unless an explicit curated policy is enabled; `--limit` and `--retry-failed` cannot bypass the selection. Referenced-version downloads are disabled. The `all` command is not recommended under the current paused policy. Do not run stages that write the catalog concurrently. Metadata requests allow two requests per host; selected PDF acquisition is serial. No sleep/poll loops are used.

## Identity and Scope

The seven explicitly named original Markdown files and original HTML assets are frozen once in `data/original-snapshots`; newly authored survey material is not ingested. Original files and legacy PDFs are never renamed or deleted. Every source record retains file, line when identifiable, heading, bounded context, URL, repository SHA, and discovery depth.

Seven required survey repositories are graph-depth zero. Two explicitly requested related lists and relevant direct list links are graph-depth one. No further list recursion is performed. Referenced papers remain discoverable in the index, including adjacent fields, but discovery no longer grants permission to download a PDF. Only the reviewed selection is eligible for local retention. Method websites receive one page hop, limited to paper/PDF/repository links.

Identity uses arXiv, DOI, and OpenReview identifiers. Versions are retained explicitly. Cross-family merges require identifier evidence in primary metadata; titles alone never establish identity. Clear repository, model, organization, image, and homepage references remain auditable but are excluded from the paper denominator.

## Dates and Files

Normalized PDFs use `YYMMDD_MethodAbbreviation_Full Paper Title.pdf`. Exact dates are required. Dates with only year/month precision are not promoted to an invented day. arXiv v1 submission is distinct from latest revision; Crossref publication/posted fields are distinct from indexing/creation. OpenReview creation timestamps are not treated as verified public release dates.

Full titles are not truncated. Only `< > : " / \ | ? *`, ASCII control characters, and whitespace normalization affect the title in filenames. Names above 255 UTF-8 bytes are not silently shortened. Historical acquisition used `.bin` quarantine objects for PDFs without compliant naming metadata; curation removes unselected quarantine objects and retains their source URLs and prior status. Selected papers keep one normalized PDF, without extra referenced versions. Generated initialisms are labeled and are not represented as official method names.

Validation checks PDF magic, minimum 4096 bytes, a final EOF marker, and SHA256. These checks do not imply full-text reading or security analysis. All records retain `read_level: metadata_only`, `full_text_read: false`, and `classification_status: automated_unreviewed`.

## Historical Outputs (not shipped)

- `data/catalog.json`: authoritative catalog; `data/catalog-schema.json`: schema.
- `data/download-policy.json`: paused acquisition, selected IDs, and per-paper retention rationale.
- `data/curation-plan.json`, `curation-deletions.jsonl`, and `curation-summary.json`: deletion provenance and exact storage accounting.
- `catalog/classics.md`: selected papers and original-source links; the local documentation has a corresponding Chinese reading list with retained PDF links.
- `data/catalog.csv`: UTF-8 BOM CSV with spreadsheet formula injection protection.
- `data/corpus-summary.json`: exact aggregate counts and acquisition boundaries.
- `data/acquisition-report.md`: Chinese acquisition report.
- `data/paper-failures.json` and CSV: every unresolved, failed or quarantined candidate.
- `data/repositories.json`: clone results, original URL, graph depth, SHA, UTC snapshot.
- `data/overview-link-audit.json`: all unique overview external URLs with bounded HTTP results.
- `data/primary-page-follow.json`: every attempted primary-method page.
- `data/links.json`, `parsed-sources.json`, and `source-manifest.json`: provenance.
- `data/legacy-pdf-mapping.json`: original PDFs preserved, exact-hash mappings only.
- `data/runs.jsonl` and `data/logs`: execution and HTTP evidence.
- `catalog/`: paginated full Markdown catalog; any former notebook copy is now an immutable local archive, not a maintained mirror.
- Local PDFs: private paper storage; never in this public project.

The root ignore rules exclude historical outputs. Do not run acquisition commands from this public checkout: their implementations and required inputs are intentionally absent. Published JSON consists of curated method notes, primary verification, dynamics, and delivery evidence. Original full-text review records and catalog metadata have separate denominators.