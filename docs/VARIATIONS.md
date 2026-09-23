# Studio variations

V1 preserves the original dist/index.html from c70452343bcda8d24fc454f47f868fd8b4fd960b byte-for-byte in dist/v1/index.html. The selector preserves each iframe's in-memory state while switching. Direct links: #v1 and #v2; v2 is the default.

V2 uses System's assembly(), counts(), source meshes and SourceMeshView directly. system.lock.json pins the System commit; the Pages build copies its dist into the deployment only. Edit component definitions and placement rules in System, then deliberately advance the Studio pin. There is no live dependency on System main and no copied editable geometry catalogue in Studio.

V2 supports the existing open slice and layer/exploded inspection, not arbitrary building dimensions. Full view: F-S ×1, W-S ×2, R-S ×1, TIE-FULL ×24. Source roof defect and incomplete building scope remain visible. The inspection link opens the exact deployed System version; a separate link opens latest System.

Drive v75 is a dated earlier snapshot and is not updated by this change.

## Repeated assembly extension
V2 now calls System multiAssembly(bays, layer) for 1–8 modules at 600 mm pitch, with a fixed 4572 mm source span. Module range is a viewer cap, not a structural approval. Existing wall-pair ties connect adjacent front and back walls. Floor/floor and roof/roof seam fastenings remain unresolved and visible in the UI. Geometry is not stretched. Full-view count is 52N−24; four modules display 184 instances. See System docs/REPEATED_ASSEMBLY.md for transforms and source limits. V1 remains unchanged.
