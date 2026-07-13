import { contextBridge, ipcRenderer } from 'electron'
import type { LedEntry } from '../src/routing/protocol.js'

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  preview: {
    start: (opts?: { host?: string; port?: number }) => ipcRenderer.invoke('preview:start', opts),
    stop: () => ipcRenderer.invoke('preview:stop'),
    sendFrame: (frame: { frameId: number; entries: LedEntry[] }) =>
      ipcRenderer.invoke('preview:sendFrame', frame),
  },
})
