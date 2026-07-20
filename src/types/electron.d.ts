export interface PreviewStartOptions {
  host?: string
  port?: number
}

export interface LedEntry {
  entityId: number
  r: number
  g: number
  b: number
}

export interface StateFramePayload {
  frameId: number
  entries: LedEntry[]
}

export interface WallBandPayload {
  column: number
  entityStart: number
  entityCount: number
}

export interface WallMappingPayload {
  columns: number
  bands: WallBandPayload[]
  generatedFrom?: string
  profile?: string
}

export interface ElectronPreviewAPI {
  start: (opts?: PreviewStartOptions) => Promise<{ ok: boolean; target?: { host: string; port: number } }>
  stop: () => Promise<{ ok: boolean }>
  sendFrame: (frame: StateFramePayload) => Promise<{ ok: boolean; packets?: number }>
  setWallBands: (data: WallMappingPayload) => Promise<{ ok: boolean; columns?: number; bands?: number }>
}

export interface ElectronAPI {
  platform: string
  preview?: ElectronPreviewAPI
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}

export {}
