import wallBandsData from './wall-bands.json' with { type: 'json' }

export interface WallBand {
  column: number
  entityStart: number
  entityCount: number
}

export interface WallMapping {
  columns: number
  bands: WallBand[]
}

const wallMapping = wallBandsData as WallMapping

export const ENTITY_ID_START = wallMapping.bands[0]?.entityStart ?? 100
const VISIBLE_ROWS = 128
const COLUMNS_PER_PHYSICAL_BAND = 2
const ASCENDING_LAST_VISIBLE_OFFSET = 128
const DESCENDING_FIRST_VISIBLE_OFFSET = 130

/**
 * Physical wall: 64 U-shaped bands of 259 LEDs.
 * Each band contains a hidden base LED, 128 visible LEDs going up,
 * a hidden top LED, 128 visible LEDs going down, then a hidden base LED.
 */
export function entityIdForCell(row: number, column: number): number | null {
  if (row < 0 || row >= VISIBLE_ROWS || column < 0 || column >= wallMapping.columns) return null

  const physicalBandIndex = Math.floor(column / COLUMNS_PER_PHYSICAL_BAND)
  const firstUniverse = wallMapping.bands[physicalBandIndex * COLUMNS_PER_PHYSICAL_BAND]
  if (!firstUniverse) return null

  if (column % COLUMNS_PER_PHYSICAL_BAND === 0) {
    return firstUniverse.entityStart + ASCENDING_LAST_VISIBLE_OFFSET - row
  }
  return firstUniverse.entityStart + DESCENDING_FIRST_VISIBLE_OFFSET + row
}

export function getWallColumns(): number {
  return wallMapping.columns
}

export interface WallLedChunk {
  startEntityId: number
  entryCount: number
}

const MAX_LED_ENTRIES_PER_CHUNK = 400

function chunkEntityRange(
  start: number,
  end: number,
  maxEntries = MAX_LED_ENTRIES_PER_CHUNK,
): WallLedChunk[] {
  const chunks: WallLedChunk[] = []
  let cursor = start
  while (cursor <= end) {
    const count = Math.min(maxEntries, end - cursor + 1)
    chunks.push({ startEntityId: cursor, entryCount: count })
    cursor += count
  }
  return chunks
}

/** Contiguous entity ranges per band — matches led-routing-hub getAllLedChunks(). */
export function getAllWallLedChunks(maxEntries = MAX_LED_ENTRIES_PER_CHUNK): WallLedChunk[] {
  const chunks: WallLedChunk[] = []
  for (const band of wallMapping.bands) {
    const end = band.entityStart + band.entityCount - 1
    chunks.push(...chunkEntityRange(band.entityStart, end, maxEntries))
  }
  return chunks
}

export { wallMapping }
