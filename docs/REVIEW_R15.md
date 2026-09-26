# studio 9120 review revision

Consumes canonical System `1c191ea4c7ef6afa2dfb5399015f23d594d1de96` (System PR #20). Review only; do not merge or publish.

The customer brand is studio 9120 in visible copy and metadata. Sauna and Studio use the canonical 900 × 1200 planning grid and 2400 mm structural width. Keep Main-first navigation, existing controls, Lithuanian/English, Plokščias, disabled PDFs and no gable. Facade is visible, with a separately labelled finish-board schedule; counts retain battens, trims and other layers.

Additional information shows original, first-cell and revised candidate counts, physical pieces, assembly groups and the cladding-exclusion effect for the selected configuration. The same-footprint figure isolates construction changes. A standalone six-model comparison includes model-derived plans, full-catalogue totals and engineering limits. It is generated in System and copied with pinned exports; Studio adds no geometry formulas.

The 75% goal is not achieved: combined provisional catalogue types 459 → 381 → 361, a 21.4% reduction from original and 5.2% from first cells. At the same footprint the revised catalogue is 380, only 0.3% below first cells. Actual manufacturing identities cannot be certified while material grades, machining and connections remain unspecified.

The non-deploying CI workflow produces `studio-development-preview` and comparison screenshots. These are review artifacts; the production website remains unchanged. The standalone `dist/v3/generated/review/index.html` opens directly without a server; the complete configurator requires serving the `dist` directory locally.

Cloud CI run 36269662595 passed all browser checks and generated visual review artifacts. The follow-up pin normalizes the original Sauna finished-area measure; part counts and geometry are unchanged. The single-enabled-system selector and obsolete wood-only count are removed, and build progress excludes schedule files from the configuration count.
