#!/usr/bin/env node
/**
 * Smoke test: encode a LEDS frame and send it to the routing hub on :6455.
 * Run: node scripts/test-udp-send.mjs
 *
 * Deliberately standalone (plain Node, zero project deps, no TS build step)
 * so it stays a trivial "is anything listening" check even if the rest of
 * the toolchain is broken. It re-implements the wire header/byte layout
 * from src/routing/protocol.ts (keep the two in sync if that format
 * changes) but its chunking is intentionally simpler — flat MAX-sized
 * slices of a fixed 8×8 test grid, not the real band-boundary-aware
 * chunking `encodeLedFrame` uses — since this only needs to prove packets
 * arrive, not match production framing exactly.
 */
import dgram from 'node:dgram'

const LED_HEADER_SIZE = 13
const LED_ENTRY_SIZE = 3
const MAX = 400

function encodeLedsChunk({ frameId, chunkIndex, chunkCount, startEntityId, colors }) {
  const entryCount = colors.length
  const buf = new Uint8Array(LED_HEADER_SIZE + entryCount * LED_ENTRY_SIZE)
  const view = new DataView(buf.buffer)
  for (let i = 0; i < 4; i++) buf[i] = 'LEDS'.charCodeAt(i)
  view.setUint8(4, 1)
  view.setUint16(5, frameId & 0xffff, true)
  view.setUint8(7, chunkIndex & 0xff)
  view.setUint8(8, chunkCount & 0xff)
  view.setUint16(9, startEntityId & 0xffff, true)
  view.setUint16(11, entryCount & 0xffff, true)
  let offset = LED_HEADER_SIZE
  for (const { r, g, b } of colors) {
    buf[offset++] = r & 0xff
    buf[offset++] = g & 0xff
    buf[offset++] = b & 0xff
  }
  return buf
}

function encodeLedFrame(frameId, entries) {
  const chunks = []
  for (let i = 0; i < entries.length; i += MAX) {
    chunks.push(entries.slice(i, i + MAX))
  }
  const chunkCount = chunks.length
  return chunks.map((chunk, chunkIndex) =>
    encodeLedsChunk({
      frameId,
      chunkIndex,
      chunkCount,
      startEntityId: chunk[0].entityId,
      colors: chunk,
    }),
  )
}

const host = process.env.ROUTING_HOST ?? '127.0.0.1'
const port = Number(process.env.ROUTING_PORT ?? 6455)
const rows = 8
const columns = 8

const entries = []
for (let row = 0; row < rows; row += 1) {
  for (let col = 0; col < columns; col += 1) {
    entries.push({ entityId: 100 + row * columns + col, r: 255, g: 0, b: 0 })
  }
}

const sock = dgram.createSocket('udp4')
const packets = encodeLedFrame(1, entries)
let sent = 0

for (const packet of packets) {
  sock.send(Buffer.from(packet), port, host, (err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    sent += 1
    if (sent === packets.length) {
      console.log(`[test-udp-send] ${sent} paquet(s) LEDS → ${host}:${port}`)
      sock.close()
    }
  })
}
