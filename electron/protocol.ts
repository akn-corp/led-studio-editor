/**
 * Main-process bridge to the single LEDS wire-protocol encoder in
 * src/routing/protocol.ts — kept as one implementation so the main and
 * renderer processes can't drift apart. Relative import, not the `@/`
 * alias: that's what reliably resolves across the Electron main/renderer
 * build boundary.
 */
export { encodeLedFrame, STATE_PORT } from '../src/routing/protocol.js'
export type { LedEntry } from '../src/routing/protocol.js'
