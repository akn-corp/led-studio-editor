import { rgbToCss, type ColorGrid } from '@/engine/rasterize-scene'

export interface Rgb {
  r: number
  g: number
  b: number
}

export function hexToRgb(hex: string): Rgb {
  const normalized = hex.replace('#', '').trim()
  if (normalized.length === 3) {
    const r = parseInt(normalized[0] + normalized[0], 16)
    const g = parseInt(normalized[1] + normalized[1], 16)
    const b = parseInt(normalized[2] + normalized[2], 16)
    return { r, g, b }
  }
  if (normalized.length === 6) {
    return {
      r: parseInt(normalized.slice(0, 2), 16),
      g: parseInt(normalized.slice(2, 4), 16),
      b: parseInt(normalized.slice(4, 6), 16),
    }
  }
  return { r: 0, g: 0, b: 0 }
}

/** Fill color for Konva preview (uncovered = default LED grey). */
export function getLedPreviewAppearance(
  row: number,
  column: number,
  offFill: string,
  grid: ColorGrid,
): { fill: string } {
  const color = grid[row]?.[column]
  return { fill: color ? rgbToCss(color) : offFill }
}
