# studio 9120 — OBTP Studio

Customer website and configurator. The public configurator contains **Sauna M with storage** and **Studio M with storage**. Other design choices are fixed; alternatives remain visible but locked. The marketing homepage remains separate.

Model/drawing views and assembly, parts-schedule and loose-parts-layout PDFs use the same pinned System geometry. Public PDFs exclude facade cladding; the 3D model retains it. All are review outputs, not engineered construction instructions.

- [Start here](00_START_HERE.md) and [project rules](AGENTS.md).
- `system.lock.json` pins System; `tools/prepare_system.py` prepares assets and `tools/export_public.py` generates the two configurations/documents.
- `tools/generated_cache.py` checks cached output consistency. Run relevant tests and PDF/download checks when changing those outputs.
- Historical v1/v2 references are retained in source; they are not additional public preset choices.

GitHub owns this application's code. [Drive project documents](https://drive.google.com/drive/folders/1w4ZBlEJSDoW2iE9MoSV8V_f9AOT2Ja-C) hold planning/references, not a competing editable source tree. System GH R25 remains [separate review work](https://github.com/anotherSipOfCoffee/obtp-system/pull/24); cleanup does not repin Studio.

Pages publishes on main/manual dispatch. Documentation cleanup stays on a review branch and does not deploy.
