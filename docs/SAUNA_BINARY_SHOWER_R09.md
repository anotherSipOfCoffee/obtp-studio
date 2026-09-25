# Sauna R09 · binary features and generated exterior shower study

Status: planning geometry only. One pinned OBTP System Cassette 01 shell still supplies the slab, walls, roof, joints and envelope measurements. Studio adds an unroofed fixture study outside its east wall. No wall opening, supply, drain, platform support, privacy screen or roof is generated.

## Controls and allowed combinations

Size remains S, M or L. The remaining features are binary: wet lobby on/off, full-pass corridor on/off, indoor shower on/off and exterior wall shower on/off. One shower must remain on. Wet lobby and through corridor exclude one another. Both circulation features are unavailable at S and M; full-pass is unavailable with an exterior shower because its two end accesses plus the shower access have no screened site route. For L, both circulation features off selects a shared-changing plan. Switching size or shower mode selects a complete tested grid allocation; it cannot leave hidden lengths from an older layout.

| Size | Indoor only / both: modules, outside-wall area | Outdoor only: modules, outside-wall area | Exterior-only wet transition |
|---|---|---|---|
| S | 9, 24.93 m² | 8, 22.17 m² | 1.8 × 1.8 m; changing 6.48 m² is below the 2× advisory comparison, so occupancy needs a furnished trial. |
| M | 11, 30.44 m² | 9, 24.93 m² | 1.8 × 1.8 m; changing 8.64 m². |
| L, wet lobby | 14, 38.72 m² | 12, 33.20 m² | 1.8 × 1.8 m plus a separate 3.6 × 1.2 m wet lobby. |
| L, shared | 14, 38.72 m² | 10, 27.69 m² | 1.8 × 1.8 m; no dedicated interior shower. |

L indoor/shared instead uses a 1.8 × 3.0 m hot block, 1.8 × 4.2 m wash block and 3.6 × 3.6 m changing block. L through retains the earlier two-access indoor-only research geometry. These allocations are nominal 600 mm grid cells, not finished room dimensions or authorized occupancy. The outside-wall building footprint cap remains based on System's wall bounds and is checked with the existing 50 m² / 5 m / 6 m hard generator gate.

## What is generated

For outdoor-only and combined washing, the solver places a 900 × 900 mm shower/pad reservation 100 mm outside the east exterior wall, an aligned candidate 900 mm access edge, and an unroofed study model with pad, riser, arm and shower head. The same reservation is drawn outside the shell in the linked plan and exported as a separate `OBTP_OUTDOOR_SHOWER_STUDY` DXF BLOCK on an exterior study layer. Outdoor-only removes the indoor shower fixture and relabels its former room as a small wet transition. The cassette wall itself remains intact; an access edge is a **proposal**, never a manufactured opening. No cover, screen or roof is included. The accessory is excluded from the current outside-wall building footprint calculation because it is an unroofed exterior study; classification and area effects of any built pad, screen, canopy or utility assembly require site-specific legal and design review.

The 3D study objects are visually distinguished from the System cassette frame and omitted from the material schedule. The cut view shows the existing structural section, and the plan/DXF carry the shower and candidate access. The CAD file describes planning BLOCK/INSERT geometry and can be opened in DWG-capable software; there is no native DWG or approved manufacture file.

## Functional and technical holds

An outdoor-only year-round plan remains **functionally unverified** even when the equipment rectangles fit. It needs finished wet threshold, wind and ice-safe circulation, sufficient shelter/privacy, frost-safe water supply, a proper wastewater destination and site approval. Adding an exterior shower alongside an indoor washing room is a spatial candidate only; exterior hardware/services are still unbuilt. The [North American Sauna Society's auxiliary-space guidance](https://www.saunasociety.org/blog/2018/4/12/design-of-auxiliary-spaces-in-a-sauna) describes 1.5× washing and 2× changing as comparisons, not legal minima; a specific outdoor fixture's [installation manual](https://www.frostline.dk/wp-content/uploads/2023/11/Monteringsvejledning-3080-11-2023-1.pdf) imposes drainage and frost constraints that this sketch does not satisfy by itself.

Before treating the exterior choice as a solved preset, finish door/threshold and sauna heat-loss design, select the shower product and winter service strategy, verify ground drainage and wastewater rules for the specific site, assess an exterior screen or canopy in the legal area measurement, and revisit all dimensions with finished assemblies. Site-specific Lithuanian permit conditions remain separate from dimensional compliance. Matrix remains a separate study.
