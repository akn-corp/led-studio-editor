import {
  validateWallMapping,
  type WallMapping,
} from '@/engine/wall-mapping'

export const DEFAULT_STATE_HOST = '127.0.0.1'
export const DEFAULT_STATE_PORT = 6455
export const DEFAULT_CONFIG_BASE_URL = 'http://127.0.0.1:6456'

export interface HubHealth {
  ok: boolean
  version?: number
  running?: boolean
  configApiPort?: number
  statePort?: number
}

export interface HubActiveProfile {
  id: string
  label: string
}

export async function fetchHubHealth(baseUrl = DEFAULT_CONFIG_BASE_URL): Promise<HubHealth> {
  const res = await fetch(`${trimSlash(baseUrl)}/api/health`)
  if (!res.ok) throw new Error(`Hub health HTTP ${res.status}`)
  return (await res.json()) as HubHealth
}

export async function fetchHubActiveProfile(
  baseUrl = DEFAULT_CONFIG_BASE_URL,
): Promise<HubActiveProfile> {
  const res = await fetch(`${trimSlash(baseUrl)}/api/active-profile`)
  if (!res.ok) throw new Error(`Hub profile HTTP ${res.status}`)
  return (await res.json()) as HubActiveProfile
}

export async function fetchHubWallBands(baseUrl = DEFAULT_CONFIG_BASE_URL): Promise<WallMapping> {
  const res = await fetch(`${trimSlash(baseUrl)}/api/wall-bands`)
  if (!res.ok) throw new Error(`Hub wall-bands HTTP ${res.status}`)
  const data = (await res.json()) as unknown
  const errors = validateWallMapping(data)
  if (errors.length) throw new Error(errors.join('; '))
  return data as WallMapping
}

export function parseWallBandsJson(text: string): WallMapping {
  let data: unknown
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error('JSON invalide')
  }
  const errors = validateWallMapping(data)
  if (errors.length) throw new Error(errors.join('; '))
  return data as WallMapping
}

function trimSlash(url: string): string {
  return url.replace(/\/+$/, '')
}
