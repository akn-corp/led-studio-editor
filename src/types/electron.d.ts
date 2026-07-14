import type { LedEntry } from '@/routing'

export interface PreviewStartOptions {
  host?: string
  port?: number
}

export interface StateFramePayload {
  frameId: number
  entries: LedEntry[]
}

export interface ElectronPreviewAPI {
  start: (opts?: PreviewStartOptions) => Promise<{ ok: boolean; target?: { host: string; port: number } }>
  stop: () => Promise<{ ok: boolean }>
  sendFrame: (frame: StateFramePayload) => Promise<{ ok: boolean; packets?: number }>
}

export interface ElectronAPI {
  platform: string
  preview?: ElectronPreviewAPI
  getPathForFile?: (file: File) => string
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}

export {}
