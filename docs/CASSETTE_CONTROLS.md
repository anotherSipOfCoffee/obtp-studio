# Studio-owned cassette configuration — 24 September 2026

The previous v3 embedded the complete System inspector. This conflated Studio configuration with System testing. V3 now owns its HTML, control state, rendering events and schedule presentation, following the existing WikiHouse v2 layout.

- Studio: number of modules 1–8, assembly layers, exploded view and reset. Four modules by default, 2,100 mm wall height, frame display with skins hidden. Configuration persists when switching variations.
- System: `OBTPCassette.generate`, module definitions, dimensions, placement rules, interface records, source evidence and detailed object/connection inspection.
- `system.lock.json` pins the exact System source. The build copies its `dist` and verifies that checkout before substitution. V3 loads the generator and renderer directly from that prepared dependency. It has no nested System iframe and duplicates no placement rules.
- The outer Studio variation frames remain to preserve independent v1/v2/v3 state. Studio v1 stays inside Studio. WikiHouse controls and geometry are preserved.
- System's taller-height, panel-visibility, object/connection inspection and Rhino export tools remain in System. They are not imported as Studio configuration controls.

`all` and `roof` currently show the same cassette frame because no engineered hardware is released. The matching layer selector preserves the WikiHouse interaction pattern without inventing connector meshes. Windows/doors remain on hold. Module quantities count cassettes, not screws or individual cut pieces.

Both v2 and v3 display the actual pinned System revision, substituted during preparation. The former hardcoded v2 revision was stale.

Run the development workflow on `dev/cassette-connections-studio-controls-20260924`. It prepares the exact dependency, runs both System geometry suites and tests the browser UI. The expanded test covers all 32 module/layer settings in v3, schedules, fixed comparison height, no inspector embedding, source revision display, explode/reset, switching state, WebGL, mobile overflow and the connection-report link. The workflow uploads an expiring prepared preview and screenshots; source remains durable in GitHub.

This branch is for review. No new live deployment or Drive baseline update is part of this batch. Drive baseline v76 remains behind these GitHub changes. Architecture has no System dependency and is unchanged. For design evidence and physical-validation holds, read System `docs/cassette/CONNECTIONS.md` or the prepared `system-source/cassette/connections.html`.
