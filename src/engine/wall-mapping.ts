import wallBandsData from '@/config/wall-bands.json'

export interface WallBand {
  column: number
  entityStart: number
  entityCount: number
}

export interface WallMapping {
  columns: number
  bands: WallBand[]
  generatedFrom?: string
  profile?: string
}

const DEFAULT_WALL_MAPPING = wallBandsData as WallMapping
let wallMapping: WallMapping = structuredClone(DEFAULT_WALL_MAPPING)

export function getWallMapping(): WallMapping {
  return wallMapping
}

export function getDefaultWallMapping(): WallMapping {
  return structuredClone(DEFAULT_WALL_MAPPING)
}

export function setWallMapping(data: WallMapping): WallMapping {
  const errors = validateWallMapping(data)
  if (errors.length) {
    throw new Error(errors.join('; '))
  }
  wallMapping = {
    columns: data.columns,
    bands: data.bands.map((band) => ({ ...band })),
    generatedFrom: data.generatedFrom,
    profile: data.profile,
  }
  return wallMapping
}

export function resetWallMapping(): WallMapping {
  return setWallMapping(getDefaultWallMapping())
}

export function validateWallMapping(data: unknown): string[] {
  const errors: string[] = []
  if (!data || typeof data !== 'object') {
    return ['Mapping invalide (objet attendu)']
  }
  const mapping = data as Partial<WallMapping>
  if (typeof mapping.columns !== 'number' || mapping.columns < 1) {
    errors.push('columns doit être un entier ≥ 1')
  }
  if (!Array.isArray(mapping.bands) || mapping.bands.length === 0) {
    errors.push('bands doit être un tableau non vide')
    return errors
  }
  if (typeof mapping.columns === 'number' && mapping.bands.length !== mapping.columns) {
    errors.push(`bands.length (${mapping.bands.length}) ≠ columns (${mapping.columns})`)
  }
  for (let i = 0; i < mapping.bands.length; i += 1) {
    const band = mapping.bands[i]
    if (
      typeof band?.column !== 'number' ||
      typeof band?.entityStart !== 'number' ||
      typeof band?.entityCount !== 'number' ||
      band.entityCount < 1
    ) {
      errors.push(`bande ${i} invalide`)
    }
  }
  return errors
}

/** @deprecated Prefer getEntityIdStart() — value can change after setWallMapping. */
export const ENTITY_ID_START = DEFAULT_WALL_MAPPING.bands[0]?.entityStart ?? 100

export function getEntityIdStart(): number {
  return wallMapping.bands[0]?.entityStart ?? 100
}

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
