# R12 takeover and build diagnosis — 2026-09-26

Studio main is `fccb5bffa15d5424a8d915d8e17ac0cc7f4a3f97` (PR #35),
pinning System `bbd43fd4bd8c2044cc22333abb0d00d6ba375445`.
[Deployment 36258097858](https://github.com/anotherSipOfCoffee/obtp-studio/actions/runs/36258097858)
succeeded at 17:32 UTC / 20:32 Kyiv, including published browser regression.
The missing conversation completion message does not mean deployment failed.

R12 includes R11 presentation fixes, the common foundation assembly, roof support
geometry, component rationalisation/cutting-stock study, supplier records and four
PDF types per configuration. The pinned System RELEASE_R12.md records limitations.
Architecture and the Drive baseline remain separate and unchanged.

## Measured bottleneck

Preparation/export ran from 17:10:59.598 to 17:30:16.520 UTC: 19m17s for
324 configurations, 1,296 PDFs, geometry/plan exports and GH packages.
Non-browser regressions then took roughly six seconds. Browser setup/checks,
upload and deployment took most of the remaining two minutes.
Legacy Pages waiting was not the bottleneck in this run.

Review runs 36251323650 and 36251548659 took 21m08s and 13m05s and overlapped.
Each review and deployment invokes the complete exporter, even for an unchanged
System pin. These timings do not establish ChatGPT credit usage or explain its UI error.

## Follow-up implementation

Cache only dist/v3/generated, keyed by System revision, preparation code, exact
Python runtime/platform and export-library versions. Before reuse, verify the
complete SHA-256 inventory, source revision, geometry checksums, drawing sets and
GH packages. Regenerate missing, changed, incomplete or stale exports.
Refresh Studio HTML/version URLs and the System runtime on every build; retain
all geometry and browser regressions. Emit generation progress every 30 seconds
and cancel superseded review runs. Production concurrency remains unchanged.

The first miss still performs a full export. PR caches are scoped to the PR, so
the first main run may need its own full export. Later matching builds can reuse
the default-branch cache. New dependencies or source revisions correctly miss.
Warm-build speed is not yet measured.

## Remaining work (rough planning ranges, not commitments)

| Work | Effort / dependency |
|---|---|
| First full export and CI | Allow 15–25 minutes per cold run, based on observed builds. |
| Native Rhino 8 / GH acceptance | Several hours for layout, hatch, editing and PDF checks; longer if native defects appear. Requires a Rhino environment. |
| Supplier product fit and pricing | Several hours to reconcile published dimensions; quotations may take days. Custom openings are still candidates. No supplier outreach is authorized. |
| Foundation/roof attachment/thermal interfaces | Separate engineering work, potentially days or weeks; soil/site, loads and product inputs remain unresolved. Wind/snow remain paused. |
| Further component optimisation | Profile representative variants first. Existing cutting stock is a study, not global optimisation or 2D nesting; preserve supports and load paths. |

Priority: stabilise repeat builds, validate native Rhino output, resolve supplier
adapters/quotes, then advance engineering-dependent design. Software checks do
not close the engineering holds or make the package construction-ready.
