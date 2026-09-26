# OBTP Studio agent rules
Keep this application separate from its siblings. Make coherent batches and ask questions only at material decisions. No supplier outreach. Never claim geometric studies are construction-ready. Update Drive/package only when requested. Preserve live hosting until a replacement deployment is confirmed. Do not commit credentials.
Preserve Studio appearance and behaviour unless explicitly asked to change it. Permit exemption remains a target, not a universal guarantee.


## Studio variations
The original generator is preserved in dist/v1/index.html as the v1 reference. Keep it inside Studio; do not move it into System. The shell provides Version as the first parameter inside each variation, preserving the v1 source file. V2 consumes the pinned System catalogue, meshes and renderer copied during deployment by tools/prepare_system.py; System remains their editable source. Do not duplicate or invent placement rules in Studio, stretch WikiHouse geometry or enable unsupported building controls. Update system.lock.json intentionally and verify the v1 reference and v2 assembly before deployment.

## Current configuration limits
The owner selected automatic structural opening placement, then required precise WikiHouse opening instructions before finishing it. Keep window/door controls unfinished and disabled until those instructions are verified for the pinned source. End-wall corner trials failed; do not imply closure is solved. Floor/roof seam ties now come from System's source-socket placements; see System docs/SEAM_CONNECTIONS.md and docs/OPENINGS_AND_ENDWALLS_CHECKPOINT.md.

## Master baseline and development branches — current owner policy
Google Drive holds the authoritative OBTP master baseline in OBTP_MASTER, organized into Studio, Architecture and System. GitHub repositories are downstream development branches and may contain valid work ahead of Drive. Never overwrite newer or unique branch work from a baseline. Compare exact commits/manifests, integrate deliberately, and record divergence; no automatic two-way synchronization.
Read the current System project/PROJECT_MAP.md and project/AGENT_GUIDE.md. Their links point to the active Drive master and historical recovery location. GitHub operations use the GitHub plugin only.
On 2026-09-24 the owner authorized publishing System first, validating both WikiHouse and Cassette 01, then publishing Studio v3 from that tested System revision. This supersedes the earlier no-deployment instruction for this release only. Preserve ordinary Git history, Studio v1 and WikiHouse. Architecture is outside this release; Drive remains the master baseline and is not automatically synchronized.
Before removal, verify a dated recovery snapshot outside active projects. Do not commit backup ZIPs, caches or nested historical packages. Source CAD bundles, licences, Studio v1, WikiHouse and useful Rhino reference evidence are intentional assets. Historical recovery content is excluded from normal builds and agent context unless recovery is requested.


## Cassette controls and connection research — 2026-09-24
Studio v3 owns its configuration UI and follows the WikiHouse control pattern: 1–8 modules, layers, exploded view and reset at 2,100 mm wall height. Import the pinned System generator and renderer; do not embed System's inspector as the Studio configurator. System owns modules, interfaces, source references and separate object/connection inspection. Read System docs/cassette/CONNECTIONS.md. Product candidates are not engineered connection releases: preserve capacity:null and fasteners:null. The 2,700 mm study remains System-only; narrow-panel racking and terminal hold-down fit remain open. The owner has authorized the System-first then Studio release and continuation fixes. Drive baseline updates remain separate.


## Canonical Sauna authoring — owner decision 2026-09-25
The owner explicitly authorized the GH-R03 website update after pausing earlier publishing. System `authoring/grasshopper/obtp/model.py` and `envelope.py` are the canonical Sauna geometry source, shared by Rhino/GH and offline web exports. Make geometry changes there first; never reimplement Sauna geometry or dimensional rules in Studio JavaScript. `export_web.py` compiles the finite website catalogue. Studio owns UI only and consumes a pinned System commit through system.lock.json. Keep native Rhino/GH acceptance distinct from portable geometry and browser checks. Six base layouts remain S/M/L × external storage. Current buyer defaults: terrace 1200 (600/1200), window 1200 (600/900/1200), vertical timber only; window on entrance facade within sauna room. Read authoring/grasshopper/CANONICAL_WORKFLOW.md in System.

## Customer language and information hierarchy
Lithuanian is the default; English remains selectable. Use natural Lithuanian customer copy, not literal technical translations. Keep the main configurator focused on product choices and preview. Technical notes, material quantities, detailed schedules and source links belong in Additional information. Language switching must preserve configuration and views. Geometry authority remains the System Python/GH source.

## R04 authoring and customer presentation
Model-derived drawings, measured dimension anchors and drawing exports belong to System authoring/grasshopper/obtp/drawings.py and sheets.py. Do not add independent browser geometry. Source DXF symbols carry a source checksum. Cake House-style controls and Koto-inspired neutral gallery/navigation are authorized; reserved photography fields remain empty. White appearance is a display override. Read RESEARCH_R04.md for insulation, 4480 mm gable reference height, legal/title-block and native Rhino acceptance limits.
