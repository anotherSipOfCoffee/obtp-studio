# Sauna viewer R17

25 September 2026.

- Restored generated plywood panels. System owns the geometry and remains the only source of structural dimensions.
- Removed Generated plan from the viewer. The six submitted monochrome plans remain untouched.
- The submitted plan is contained in a fixed viewport without inner scrollbars. Aspect ratio and source line weights are preserved. This is a screen preview, not a promise of paper/physical drawing scale.
- Added a 90° rotation button for 3D and Cut. Orientation persists through layer and size changes; Reset returns to the original fixed view. Plan rotation is disabled to retain source orientation.
- No source geometry was rounded or snapped. Whole-millimetre dimensions and bounded decimal quantities are displayed; 4,572 mm is still a real legacy module dimension, not floating-point noise. Its quarter is 1,143 mm. Replacing that subdivision needs a different cassette width, not cosmetic rounding.
- New System opening and off-axis partition support reviews are linked through the existing System inspector. They remain design-development objects; the Sauna shell is not labelled as matching the source plans.

## Decision needed for the next geometry release

Use the owner's narrow Sauna layout as the authority and replace the legacy 4,572 mm transverse floor/roof with a narrow cassette. A candidate is 1,800 mm clear room depth plus the actual System wall buildup, retaining 600 mm planning increments along the length. This changes floor/roof geometry, perimeter support and connections; it must not be disguised as a rounding fix. Confirm exact datum (clear finished room, structural inside face or wall axis) before adapting all six plans. Actual wall/finish thickness then changes exterior dimensions rather than eroding the chosen clear room depth.

The user's earlier requirement to consult before correcting source-plan grid/connection mismatches remains in effect. Do not place doors into the mismatched earlier shell just to make them appear.
