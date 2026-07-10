import dgram from 'node:dgram'
import { ipcMain } from 'electron'
import { encodeLedFrame, STATE_PORT } from './protocol.js'
import type { LedEntry } from './protocol.js'

interface PreviewTarget {
  host: string
  port: number
}

interface StateFramePayload {
  frameId: number
  entries: LedEntry[]
}

let sock: dgram.Socket | null = null
let target: PreviewTarget = { host: '127.0.0.1', port: STATE_PORT }

function ensureSocket(): dgram.Socket {
  if (!sock) {
    sock = dgram.createSocket('udp4')
  }
  return sock
}

function closeSocket() {
  if (sock) {
    sock.close()
    sock = null
  }
}

function sendStateFrame(frame: StateFramePayload) {
  const socket = ensureSocket()
  const packets = encodeLedFrame(frame.frameId, frame.entries)

  for (const packet of packets) {
    socket.send(Buffer.from(packet), target.port, target.host, (err) => {
      if (err) {
        console.error('[preview] UDP send error:', err.message)
      }
    })
  }
}

export function setupPreviewIpc() {
  ipcMain.handle('preview:start', (_event, opts?: Partial<PreviewTarget>) => {
    target = {
      host: opts?.host ?? '127.0.0.1',
      port: opts?.port ?? STATE_PORT,
    }
    ensureSocket()
    console.log(`[preview] UDP → ${target.host}:${target.port}`)
    return { ok: true, target }
  })

  ipcMain.handle('preview:stop', () => {
    closeSocket()
    console.log('[preview] stopped')
    return { ok: true }
  })

  ipcMain.handle('preview:sendFrame', (_event, frame: StateFramePayload) => {
    if (!sock) {
      ensureSocket()
    }
    sendStateFrame(frame)
    return { ok: true, packets: encodeLedFrame(frame.frameId, frame.entries).length }
  })
}

export function teardownPreviewIpc() {
  closeSocket()
}
