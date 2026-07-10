export { sceneStore } from '@/engine/scene-store'
export { DEFAULT_ENVIRONMENT, ENVIRONMENT_LIMITS } from '@/engine/model/environment'
export type { Environment } from '@/engine/model/environment'
export type { Project } from '@/engine/model/project'
export type { Element, ElementChanges, SquareElement, TextElement } from '@/engine/model/element'
export { createSquareElement, createTextElement } from '@/engine/model/element-factory'
export { resolveCoveringElement } from '@/engine/coverage'
export {
  rasterizeLedFrame,
  getLedPreviewAppearance,
  hexToRgb,
} from '@/engine/rasterize-leds'
export type { Rgb, LedEntry } from '@/engine/rasterize-leds'
export { composeColorGrid, rgbToCss } from '@/engine/rasterize-scene'
export type { ColorGrid } from '@/engine/rasterize-scene'
export { entityIdForCell, getWallColumns, wallMapping, ENTITY_ID_START } from '@/engine/wall-mapping'
export { encodeLedsChunk, encodeLedFrame, STATE_PORT, MAX_LED_ENTRIES_PER_CHUNK } from '@/engine/protocol'
export { getAllWallLedChunks } from '@/engine/wall-mapping'
export { createPlaybackLoop } from '@/engine/playback-loop'
