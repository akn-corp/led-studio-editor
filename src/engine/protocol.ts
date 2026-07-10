import type { LedEntry, Rgb } from '@/engine/rasterize-leds'
import { getAllWallLedChunks } from '@/engine/wall-mapping'

export const LED_MAGIC = 'LEDS'
export const VERSION = 1
export const STATE_PORT = 6455
export const LED_HEADER_SIZE = 13
export const LED_ENTRY_SIZE = 3
export const MAX_LED_ENTRIES_PER_CHUNK = 400

export interface LedsChunkInput {
  frameId: number
  chunkIndex: number
  chunkCount: number
  startEntityId: number
  colors: Rgb[]
}

function writeAscii(view: DataView, offset: number, text: string) {
  for (let i = 0; i < text.length; i += 1) {
    view.setUint8(offset + i, text.charCodeAt(i))
  }
}

export function encodeLedsChunk(input: LedsChunkInput): Uint8Array {
  const { frameId, chunkIndex, chunkCount, startEntityId, colors } = input
  const entryCount = colors.length
  const buf = new Uint8Array(LED_HEADER_SIZE + entryCount * LED_ENTRY_SIZE)
  const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength)

  writeAscii(view, 0, LED_MAGIC)
  view.setUint8(4, VERSION)
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

/**
 * Encode a full LEDS frame per protocole-state.md:
 * each chunk carries contiguous entityIds starting at startEntityId.
 */
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
