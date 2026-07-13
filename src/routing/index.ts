// Public surface of the routing boundary: everything here is specific to
// handing the engine's resolved per-LED color state off to *this* physical
// installation's wiring and transport (entity ids, wire protocol, live
// preview transmission). None of this belongs in engine/ — see
// ARCHITECTURE.md, "Handoff to the routing tool."
export { entityIdForCell, getWallColumns, wallMapping, ENTITY_ID_START } from '@/routing/wall-mapping'
export { getAllWallLedChunks } from '@/routing/wall-mapping'
export { encodeLedsChunk, encodeLedFrame, STATE_PORT, MAX_LED_ENTRIES_PER_CHUNK } from '@/routing/protocol'
export type { LedEntry } from '@/routing/protocol'
export { rasterizeWallFrame } from '@/routing/rasterize-wall-frame'
export { createPlaybackLoop } from '@/routing/playback-loop'
