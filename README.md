# OBTP Studio

Three variations in the selector: v1 original conceptual reference, v2 WikiHouse, v3 independent OBTP Cassette 01 research prototype. The default remains v2.

System is the source for v2/v3 geometry and assembly rules. system.lock.json pins its exact commit; tools/prepare_system.py verifies the checked-out commit and copies its dist tree to dist/system-source. Do not commit that reproducible copy. Studio v1 remains byte-identical to the pre-task reference.

Read 00_START_HERE.md and AGENTS.md for the Drive master / GitHub development policy. Changes are on dev/obtp-independent-v1-20260923; main/live are unchanged. The new read-only Check Studio development variations workflow builds and tests a downloadable preview, without deploying.

The existing Pages workflow publishes on main or manual execution. It is preserved but not authorized to run in this task. For local inspection of a prepared preview, serve its dist folder with python -m http.server 8765 --directory dist and open http://localhost:8765/#v3.
