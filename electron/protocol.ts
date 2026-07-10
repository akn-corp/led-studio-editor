/** Art-Net state protocol encoder (mirrors src/engine/protocol.ts + protocole-state.md). */

import wallBands from '../src/config/wall-bands.json' with { type: 'json' }

export const STATE_PORT = 6455
export const LED_HEADER_SIZE = 13
export const LED_ENTRY_SIZE = 3
export const MAX_LED_ENTRIES_PER_CHUNK = 400

export interface Rgb {
  r: number
  g: number
  b: number
}

export interface LedEntry extends Rgb {
  entityId: number
}

interface WallLedChunk {
  startEntityId: number
  entryCount: number
}

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

function getAllWallLedChunks(maxEntries = MAX_LED_ENTRIES_PER_CHUNK): WallLedChunk[] {
  const chunks: WallLedChunk[] = []
  for (const band of wallBands.bands) {
    const end = band.entityStart + band.entityCount - 1
    chunks.push(...chunkEntityRange(band.entityStart, end, maxEntries))
  }
  return chunks
}

function writeAscii(view: DataView, offset: number, text: string) {
  for (let i = 0; i < text.length; i += 1) {
    view.setUint8(offset + i, text.charCodeAt(i))
  }
}

export function encodeLedsChunk(input: {
  frameId: number
  chunkIndex: number
  chunkCount: number
  startEntityId: number
  colors: Rgb[]
}): Uint8Array {
  const { frameId, chunkIndex, chunkCount, startEntityId, colors } = input
  const entryCount = colors.length
  const buf = new Uint8Array(LED_HEADER_SIZE + entryCount * LED_ENTRY_SIZE)
  const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength)

  writeAscii(view, 0, 'LEDS')
  view.setUint8(4, 1)
  view.setUint16(5, frameId & 0xffff, true)
  view.setUint8(7, chunkIndex & 0xff)
  view.setUint8(8, chunkCount & 0xff)
  view.setUint16(9, startEntityId & 0xffff, true)
  view.setUint16(11, entryCount & 0xffff, true)

  let offset = LED_HEADER_SIZE
  for (const color of colors) {
    buf[offset] = color.r & 0xff
    buf[offset + 1] = color.g & 0xff
    buf[offset + 2] = color.b & 0xff
    offset += LED_ENTRY_SIZE
  }

  return buf
}

function entriesToColorMap(entries: LedEntry[]): Map<number, Rgb> {
  const map = new Map<number, Rgb>()
  for (const entry of entries) {
    map.set(entry.entityId, { r: entry.r, g: entry.g, b: entry.b })
  }
  return map
}

export function encodeLedFrame(frameId: number, entries: LedEntry[]): Uint8Array[] {
  const colorByEntityId = entriesToColorMap(entries)
  const ledChunks = getAllWallLedChunks()
  const chunkCount = ledChunks.length
  const off: Rgb = { r: 0, g: 0, b: 0 }

  return ledChunks.map((chunk, chunkIndex) => {
    const colors: Rgb[] = []
    for (let i = 0; i < chunk.entryCount; i += 1) {
      const entityId = chunk.startEntityId + i
      colors.push(colorByEntityId.get(entityId) ?? off)
    }
    return encodeLedsChunk({
      frameId,
      chunkIndex,
      chunkCount,
      startEntityId: chunk.startEntityId,
      colors,
    })
  })
}
