# studio 9120 — current guidance, R16

R16 is published. Schedule and assembly PDF downloads are authorized only for default Studio M (open sliders); leave Drive and Architecture unchanged. Latest explicit user instructions supersede historical release notes.

- Customer-facing name and metadata: **studio 9120**. Preserve existing presentation, Lithuanian default, choice-button parameters, Main-first navigation, Studio v1 reference and WikiHouse mode.
- System's `authoring/grasshopper/obtp` owns all construction geometry, room dimensions, part identities, drawings and quantities. Studio consumes the exact commit in `system.lock.json`; never duplicate geometry in the browser.
- The user permits measured grid/layout redesign; adopted R16 retains the 1200 × 900 planning grid after alternatives increased diversity. Both buildings have 2400 mm structural width; Sauna's room sequence and optional exterior storage/shower/seat remain. Studio centre remains a heated room with seasonal sliding glass.
- Facade boards remain visible but have a separate quantity schedule. Primary counts retain battens, trims and all other categories. Three-version counts are provisional manufacturing candidates, never engineering certification. Report resizing separately with the same-footprint control.
- Part-schedule and assembly PDFs are enabled; drawing/opening PDFs remain disabled; no gable option; Lithuanian `Plokščias`. Do not restore obsolete single-option or GH object-type-preview controls.
- Read current System `AGENTS.md` and `authoring/grasshopper/review-r15/` for decisions, exact baseline commits, counts, rejected experiments and unresolved engineering.
- Prepare the pinned System via `tools/prepare_system.py`; it verifies the checkout and caches byte-checked outputs. Tests cover source identity, cache integrity, both programs, languages, controls, drawings and mobile use.
- Native Rhino/GH, engineering capacities, fastening, supplier fit, handling weights and permit eligibility remain unverified. No outreach or invented prices/approvals.
- Preserve Git history. Remote writes use the GitHub connector. Historical documents remain references, not competing current instructions.
