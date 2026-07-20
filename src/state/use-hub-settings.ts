import { useSyncExternalStore } from 'react'
import {
  DEFAULT_CONFIG_BASE_URL,
  DEFAULT_STATE_HOST,
  DEFAULT_STATE_PORT,
} from '@/engine/hub-config-client'

export interface HubSettings {
  stateHost: string
  statePort: number
  configBaseUrl: string
  syncOnPreviewStart: boolean
}

const STORAGE_KEY = 'led-studio.hub-settings'
const WALL_BANDS_CACHE_KEY = 'led-studio.wall-bands-cache'

const defaultSettings: HubSettings = {
  stateHost: DEFAULT_STATE_HOST,
  statePort: DEFAULT_STATE_PORT,
  configBaseUrl: DEFAULT_CONFIG_BASE_URL,
  syncOnPreviewStart: true,
}

let settings: HubSettings = loadSettings()
const listeners = new Set<() => void>()

function loadSettings(): HubSettings {
  if (typeof localStorage === 'undefined') return { ...defaultSettings }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaultSettings }
    return { ...defaultSettings, ...JSON.parse(raw) }
  } catch {
    return { ...defaultSettings }
  }
}

function persist() {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}

function emit() {
  for (const listener of listeners) listener()
}

export function getHubSettings(): HubSettings {
  return settings
}

export function updateHubSettings(patch: Partial<HubSettings>) {
  settings = { ...settings, ...patch }
  persist()
  emit()
}

export function cacheWallBandsJson(json: string) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(WALL_BANDS_CACHE_KEY, json)
}

export function readCachedWallBandsJson(): string | null {
  if (typeof localStorage === 'undefined') return null
  return localStorage.getItem(WALL_BANDS_CACHE_KEY)
}

export function useHubSettings(): HubSettings {
  return useSyncExternalStore(
    (onStoreChange) => {
      listeners.add(onStoreChange)
      return () => listeners.delete(onStoreChange)
    },
    () => settings,
    () => defaultSettings,
  )
}
