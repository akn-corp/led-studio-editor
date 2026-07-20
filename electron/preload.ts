import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  preview: {
    start: (opts?: { host?: string; port?: number }) => ipcRenderer.invoke('preview:start', opts),
    stop: () => ipcRenderer.invoke('preview:stop'),
    sendFrame: (frame: {
      frameId: number
      entries: { entityId: number; r: number; g: number; b: number }[]
    }) => ipcRenderer.invoke('preview:sendFrame', frame),
    setWallBands: (data: {
      columns: number
      bands: { column: number; entityStart: number; entityCount: number }[]
      generatedFrom?: string
      profile?: string
    }) => ipcRenderer.invoke('preview:setWallBands', data),
  },
})
