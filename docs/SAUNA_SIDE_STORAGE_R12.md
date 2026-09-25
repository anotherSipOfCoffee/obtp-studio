# Sauna R12 · side storage correction plans

The current Sauna UI has two inputs: S/M/L and optional side storage. All six options retain the same Cassette 01 shell and the same hot-room width (nominal 2.4 m). The shower is mandatory and outdoors; there is no indoor shower room or long corridor. The little entrance hall is beside the hot room. The optional 1.2 × 1.2 m store is **to the right of the hall, above the exterior shower in plan**, with a separate outside access proposal. Its exterior cassette floor, walls, roof, junction and access opening are **not generated**. Storage-on options are marked as research holds, not valid building outputs.

| Size | Sauna nominal width × length | Little hall nominal width × length | Cassette bays, storage off / on | Generated shell outside-wall plan area | Conservative shell + side annex rectangular bound |
| --- | --- | --- | ---: | ---: | ---: |
| S | 2.4 × 1.8 m | 1.2 × 1.8 m | 4 / 4 | 11.140704 m² | 14.776704 m² |
| M | 2.4 × 2.4 m | 1.2 × 2.4 m | 5 / 5 | 13.898304 m² | 18.434304 m² |
| L | 2.4 × 3.0 m | 1.2 × 3.0 m | 6 / 6 | 16.655904 m² | 22.091904 m² |

The last column is `(outside shell width + 1,500 mm) × outside shell length`, with the annex's intervening strip and unused length conservatively included. It screens the proposed layout against the 50 m² target. It is **not** a measured completed annex building area or a legal total floor area. Modelled shell height is 2.576 m; conservative roof support spacing is 4.572 m. Outdoor pad, structural foundations, future roof projections, regulatory building area classification and site conditions need separate review.

[Six-plan overview](SAUNA_SIDE_STORAGE_R12.svg) and the six editable DXF drawings use the same plan solver as the UI. CAD units are millimetres. Green/brown room boundaries are unbuilt partitions; the store boundary is on `ANNEX_UNBUILT`; shower and doors are candidates. CAD contains named equipment BLOCK/INSERT entities. A native DWG converter was unavailable in the current workspace, so these files are correctly identified as DXF and can be opened or saved as DWG with compatible CAD software. No DWG is simulated by renaming the file.

### Questions for the correction round

1. Is the side room at the intended edge and setback, or should it attach directly to the hall wall? Its current nominal west edge is 600 mm past the hall's east planning line; the actual outer shell ends about 114 mm before the store's west edge.
2. Should the store's independent exterior access remain on its east/right edge, or face the same front approach as the hall?
3. Is a 1.2 × 1.2 m store appropriately sized once wall linings, clear passage and shelving are considered?
4. For L, does extending only the sauna and little hall along the cassette length preserve sensible bench and heater positions? Heater model/clearances, ventilation, wet services and doors remain unverified.

This is an editable spatial study for review, not a construction or permit drawing. Site and land-use conditions must be verified separately.
