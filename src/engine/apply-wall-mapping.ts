import {
  cacheWallBandsJson,
} from '@/state/use-hub-settings'
import { setWallMapping, type WallMapping } from '@/engine/wall-mapping'

/** Applique le mapping côté renderer + process Electron (si dispo). */
export async function applyWallMapping(mapping: WallMapping): Promise<WallMapping> {
  const applied = setWallMapping(mapping)
  cacheWallBandsJson(JSON.stringify(applied))
  await window.electronAPI?.preview?.setWallBands(applied)
  return applied
}
