# Single-source consolidation

[English entry](../../README.md) · [中文入口](../../README.zh-CN.md)

## Result

RSI Atlas is the sole active repository for documentation, diagrams, curated data, website templates and checks. The former external notebook tree is no longer an active maintenance location.

The migration preserved all **183 original notebook files**, **183,557,345 bytes**, with pre-move and post-move SHA-256 identity. A full local backup of the notebooks and the previous dirty draft was created before changes. The dirty Git draft was also retained in a local stash; it was not discarded.

The canonical repository starts from the latest published content and integrates the richer draft's four chapters, expanded original-overview mapping and versioned public evidence. Current builders regenerate the method map, architecture/flow assets, licensed figure catalog, English/Chinese entry pages and website.

## Active versus archived content

| Content | Maintenance policy |
|---|---|
| Public technical prose | Canonical `docs/` |
| Project-authored and explicitly licensed visuals | Canonical `pics/` with attribution |
| Curated records, updates, institutions and language data | Canonical `data/` |
| Viewer templates and checks | Canonical `scripts/` |
| Original notebook bytes, raw papers and historical acquisition data | Immutable local archive, ignored by Git |
| Internal engineering practice and original run material | Local-only private area, ignored and never published |
| Backup snapshots | Local-only rollback evidence, not a second maintained source |

Archive copies are historical records, not another editable publication tree. No raw PDF, private report, authentication data or original runtime log is required for public builds.

The earlier implementation worktree was moved into the local backup area and locked as a historical snapshot. Its branch and contents were preserved; it is no longer a parallel maintenance location. External notebook mirroring has been removed from the builder.

## Verification boundaries

- Every original notebook file is accounted for by its immutable archived bytes.
- Public chapter differences were compared before integration; richer content and explicit reading scopes were preserved.
- Local engineering references were rebased and their source hashes and browser walkthroughs rechecked without running training.
- Public export checks reject private paths and links to unpublished local-only files.
- The old live notebook path is retired. New work happens in this repository only.

The full per-file manifest and backup locations are local-only because they contain machine paths and private material. Public metadata intentionally reports aggregate preservation facts, not those confidential details.
