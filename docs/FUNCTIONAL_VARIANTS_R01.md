# Functional variant screen R01 · Sauna and Studio

Status: **research screen, not a design approval**. Generated envelope compliance is separate from functional suitability. No Studio v3 variation has a built exterior door, window, interior partition, sauna enclosure, shower, extraction or services; `technicalValid` remains false for Sauna. This study uses a small non-residential private sauna and a one-person clean design/work studio as explicit briefs. Different occupancy, washing practices or site access can change the ranking.

## Evidence and rule

Finnish-style bathing cycles between the heated room, washing/cooling and rest. The [North American Sauna Society's design guidance](https://www.saunasociety.org/design-guidelines) calls for convenient access to shower, changing and cooling/rest, and for heater, door, benches and vents to work together. Finnish sauna designer Lassi A. Liikkanen's [auxiliary-space study](https://www.saunasociety.org/blog/2018/4/12/design-of-auxiliary-spaces-in-a-sauna) uses **1.5× hot-room area for washing and 2× for changing as rules of thumb**, and cautions that more people may occupy auxiliary rooms than the hot room at one time. These are *comparators*, not Finnish or Lithuanian statutory minima. [Sun Sauna's planning advice](https://sunsauna.fi/en/blog/the-right-place-for-the-heater-and-the-door-in-the-sauna-room/) starts door placement from the bench/heater arrangement **and the shower-side layout**. The [Finnish Sauna Society's wet-room discussion](https://sauna.fi/saunatietoa/saunan-rakentaminen-ja-kaytto/saunan-rakennevaatimukset/) requires careful detailing of moisture and the sauna–washing interface.

We screen in this order:

1. **Geometry gate:** existing generated outside-wall area ≤ 50 m², modeled height ≤ 5 m, modeled support span ≤ 6 m. Failure prevents generation, as before.
2. **Task and adjacency gate:** for Sauna allocate distinct heat, washing and changing/rest; consider the actual path sauna ↔ shower ↔ rest and outside, plus whether wet traffic crosses a proposed dry seat. For this comparison a hot room below 1.8 × 1.8 m or a washing block below 1.8 × 1.8 m is screened out for the *current* heater/bench and shower-approach exercise. The 1.8 m study values are project assumptions, not code requirements. A current reference heater outside its nominal volume range is also screened out for that equipment. For Studio the one-person desk brief uses 10 m² of unpartitioned internal clear area as a lower research benchmark; smaller hobby uses may be evaluated separately.
3. **Unbuilt technical gate:** door positions/swings, bench/heater clearances, thermal/moisture assemblies, drains, ventilation, daylight, actual finished room sizes and structural openings. Even a spatial candidate stays **unverified** here. Never score mere block overlap or nominal area as a solved room.

The [Finnish Institute of Occupational Health](https://www.ttl.fi/oppimateriaalit/ergonomian-tietopankki/toimisto-ja-tietotyo) gives 10–12 m² as *recommended* for a one-person assigned office room, and stresses matching area to work and equipment. It is a comparison for a clean desk Studio, not a Lithuanian minimum. Workplace [lighting](https://www.ttl.fi/teemat/tyoturvallisuus/tyoturvallisuuslain-soveltamisopas/tyota-ja-tyoolosuhteita-koskevat-tarkemmat-saannokset/34-ss-tyopaikan-valaistus) must respond to the task and avoid glare. An art practice using coatings/aerosols needs task-specific extraction; [NIOSH](https://www.cdc.gov/niosh/engcontrols/ecd/detail30.html) describes local exhaust for paint and coating processes. Do not treat a window as proof of sufficient extraction.

## Run against existing 600 mm Cassette 01 options

Metrics below are from the **current System generator**, with the shared 4,572 mm setting-out width, 2,100 mm nominal wall height and outside-wall skins measured. Sauna block areas are **nominal grid allocations**, not finished rooms. The 10-module corridor variants use their 3+3 row defaults; a direct generator call previously fell through to the shared-layout 4+4 defaults and failed. The generator default is now corrected to match the UI.

| Sauna option | Modules | Outside-wall area | Heat / washing / changing | Extra route | Research judgment for this brief |
|---|---:|---:|---:|---:|---|
| Shared changing, one entry | 8 | 22.17 m² | 4.32 / 4.32 / 6.48 m² | none | Compact spatial candidate for few users; changing is below 2× heuristic, and wet users return through changing. |
| Shared changing, one entry | 10 | 27.69 m² | 4.32 / 4.32 / 10.80 m² | none | **Best current compact one-entry comparison**, pending a direct washing–sauna door and credible dry/wet interface. |
| Shared changing, two side entries | 10 | 27.69 m² | 4.32 / 4.32 / 10.80 m² | dry crossing through changing | Use only if two site accesses have a defined purpose; second structural opening/privacy burden brings no general private-sauna advantage. |
| Dead-end side corridor | 10 | 27.69 m² | 4.32 / 4.32 / 4.32 m² | 6.48 m² corridor | Spatially possible, but small changing/rest and large route allocation; rotated heater/bench fit not shown. Lower priority for an ordinary one-entry sauna. |
| Full-pass side corridor | 10 | 27.69 m² | 4.32 / 4.32 / 4.32 m² | 6.48 m² corridor | Purposeful **only when both end accesses and an independent through route are requirements**; rotated equipment layout and end-wall openings unresolved. |
| Wet lobby, two side entries | 12 | 33.20 m² | 4.32 / 4.32 / 10.80 m² | 4.32 m² wet landing | **Best current dry-changing spatial comparison** if separated wet circulation is needed; second exterior access is optional at concept level, but the current study draws two candidates. Waterproofing and actual door operations unresolved. |

None earns a technical pass. All have washing equal in area to the 4.32 m² hot room, below the **1.5× advisory**. That fact calls for a shower-use and equipment check, not an automatic rejection. A longer building with the original small wet rooms is not automatically better: for example 12-module shared changing grows to 15.12 m² while heat/washing remain 4.32 m² each. The 12-module wet lobby instead puts the extra 4.32 m² into separating the wet approaches. These comparisons explain the conditional recommendations; they are not numeric scores claiming building performance.

An exhaustive pass through 8–18 modules, five circulation choices, allowed widths and 2–15-row wet-room lengths finds **9,024 geometrically allocated parameter states**. The current heater-volume, minimum study-block and changing-area screens retain **664 spatial candidates**. These counts are *parameter combinations*, with many nearly identical plans; they do not mean 664 validated sauna designs. The remaining candidates still fail the unbuilt technical gate. The automated test records this coverage so changing the controls cannot silently turn obviously undersized room allocations into a functional pass.

The subsequent [R06 generative sub-block solver](SAUNA_SUBBLOCKS_R06.md) places the heater, bench, shower, seat and adjacent door candidates and rejects a further **11** of those 664 nominal candidates, leaving **653 geometric placement candidates**. That additional screen still cannot verify real openings, finished circulation or technical assemblies.

**Next Sauna test:** draw a single-entry heat ↔ washing ↔ changing/rest route using the ten-module shared shell; place a *candidate* direct sauna–washing door without colliding with the R02 heater, bench, shower and exhaust route. Compare its finished circulation against the 12-module wet-lobby proposal. Retain a second outside access or full-pass corridor only for a site brief that actually needs it. No exterior wall is cut until the structural-opening hold is resolved.

## Studio start

| Modules | Outside-wall area | Unpartitioned clear area | One-person clean desk brief |
|---:|---:|---:|---|
| 4 (current default) | 11.14 m² | 8.41 m² | Below the chosen 10 m² benchmark; do not present as a generally workable one-person desk Studio. Could suit a specific compact hobby task after a furniture test. |
| 5 | 13.90 m² | 10.92 m² | First spatial candidate for one dedicated desk. Test desk, chair movement, door approach and storage. |
| 6 | 16.66 m² | 13.42 m² | Better first detailed layout trial, allowing more margin for a real access and storage arrangement. |
| 8 | 22.17 m² | 18.44 m² | Candidate for larger drawing/art tables or two activities, pending task-specific equipment, lighting, extraction and service needs. |

The Studio currently has **no real windows or doors** because source opening instructions and structural details are on hold. The research screen therefore checks clear area only and marks every Studio spatial candidate as *unverified*, never a furnished or daylit working room. Next, define two task briefs—clean desk/design and dry art/table work—then draw actual workstation, access and storage envelopes at 5, 6 and 8 modules. Wet/solvent-based art is a separate ventilation/service review, not an automatic variant of the desk plan.

## Implementation boundary

`dist/v3/function-screen.js` applies only these explicit **brief-specific** spatial checks. It reports reasons and unresolved holds in Studio v3. It does **not** disable otherwise valid structural geometry or turn advisory ratios into regulations. The generator's dimensional constraints remain hard; functional results cannot override them. A final room classification requires finished dimensional/door/equipment evidence and engineering, not a heuristic score.
