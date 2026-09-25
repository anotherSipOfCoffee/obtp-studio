# Shared Studio presets and dimensional gate

## Sauna planning blocks · 25 September 2026

The Sauna preset now contains a two-dimensional program grid inside the existing Cassette 01 structure. The six-column grid is 3,600 mm wide and has `(module count − 1)` rows of 600 mm. It fits inside the generated 4,182 mm clear width and `(600 × module count − 390)` mm clear length. The remaining 582 mm across the width and 210 mm across the length are **unallocated perimeter residual**, not finished rooms or fixed wall offsets. Block labels express allocated planning dimensions; partitions, finishes, benches and clear usable room dimensions remain unmeasured.

The front Changing/rest + access block spans all six columns and at least two rows. Behind it, Sauna and Washing/bathing have complementary widths (Sauna 2–4 columns; Washing the remaining 4–2 columns). Each wet block has an independently adjustable length of at least two rows. Both begin at the Changing/rest boundary, so their desired door locations can meet that block. If their lengths differ, the rear leftover strip is shown as Service/unassigned, with no implied plumbing installation. There is no dedicated corridor in this first layout family. Increasing the module count extends the changing block when wet lengths are held; decreasing it restricts wet lengths before geometry is generated.

The planning function validates integer steps, changing access depth, non-overlap, complete grid coverage and fit inside the generated clear envelope. The existing System generator, full exterior area/height/span gate, connection holds and export schedule remain the same. **This is a solved allocation of planning blocks, not a buildable sauna.** The illustrated block edges are not cassette partitions or doors. Heater model and clearances, bench fit, waterproofing/thermal assembly, falls and drainage, ventilation, actual internal openings, structural support and site conditions require further decisions and design.

Studio, Workshop and Sauna use `dist/v3/presets.js` to configure the same pinned `OBTPCassette.generate` implementation. Controls follow `Version → Preset → Number of modules`: the preset selector appears directly under Version only in v3 Cassette 01. Presets alter labels and spatial allowances, shown as a proportional concept diagram; they do not add partitions, openings, plumbing or thermal layers. Switching keeps the current module count, except Sauna raises counts below eight to eight. Studio v1 remains the original independent conceptual reference; v2 remains the WikiHouse assembly, with its own unchanged 1–8 bay controls.

## Existing measurements

- v1 `enclosedFootprint` is `(length bays − porch bays) × width bays × 0.6²` m² of grid plan, and `porchFootprint` is the other grid portion. Neither measures legal total floor area.
- v2 shows `bays × 600 mm` by `4,572 mm` setting-out and does not calculate floor or regulatory area. It remains an incomplete open assembly.
- v3 previously showed `scene.length × scene.width` setting-out, `scene.clear` inside dimensions, and nominal wall height `scene.height`. There was no area, full building height or support spacing calculation.

## Current geometric checks

The v3 gate regenerates the full cassette with skins and roof for measurement even if the viewer shows a frame layer without skins. It transforms every model asset into world coordinates with the pinned System `worldBounds` API. The outside wall bounding rectangle is `(wall max X − wall min X) × (wall max Y − wall min Y) / 1,000,000`. This **conservative outside-wall plan proxy** must be positive and at most **50.00 m²**. At 18 bays its dimensions are `4,596 × 10,824 mm`, so the proxy is **49.747104 m²**; 19 bays are not generated. The internal clear area estimate uses System `scene.clear[0] × scene.clear[1] / 1,000,000`, and is **43.534620 m²** at 18 bays. It excludes partition and finish deductions.

The height gate is `(max Z of all transformed floor/wall/roof assets − min(0, min Z)) / 1,000`, with a **5.000 m** maximum; it is **2.576 m** at the 2,100 mm wall option. The renderer's exploded offsets never affect the calculation. Ground level, foundations and roof finishes are not defined, so actual legal height remains unverified.

The span gate is the maximum of each generated roof cassette's transformed transverse X width and the System wall cassette pitch. It is **4.572 m** in the present 4.572 m wide system, against **6.000 m**. Longitudinal wall cassettes continue at 600 mm joints; the 10.8 m building length does not represent an unsupported roof span. This is a geometric roof bearing screen. Foundation/support points under the floor, lateral stability and engineering capacity are not specified, so legal structural spacing and actual support adequacy remain unverified.

Lithuanian I-group classification refers to **total floor area**, not this external rectangle. The external cap is intentionally stricter for the modelled single level but cannot certify statutory area without a complete enclosed plan and any other included spaces. The status reports only the modelled dimensional checks. Classification, use, site/land conditions and SLD need separate review. There is no generated valid opening for the larger Workshop access door or the Sauna wet room; both are design holds. Do not use the program allowance labels as a completed floor plan or technical specification.

The source System module study is extended from eight to eighteen repetitions on a dedicated development branch; all source connection interfaces retain null capacity and fasteners. Tests cover 36 geometric assemblies including 18 bays and retain the prior eight-bay inspection. This extends software geometry, not structural validation.
