import { composeColorGrid, rgbToCss, type ColorGrid } from '@/engine/rasterize-scene'
import { entityIdForCell } from '@/engine/wall-mapping'
import type { Project } from '@/engine/model/project'

export interface Rgb {
  r: number
  g: number
  b: number
}

export interface LedEntry extends Rgb {
  entityId: number
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

/** RGB for UDP export — uncovered LEDs are off (black). */
export function rasterizeLedFrame(project: Project): LedEntry[] {
  const grid = composeColorGrid(project)
  const { rows, columns } = project.environment
  const entries: LedEntry[] = []

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const entityId = entityIdForCell(row, column)
      if (entityId == null) continue

      const color = grid[row][column]
      entries.push({
        entityId,
        r: color?.r ?? 0,
        g: color?.g ?? 0,
        b: color?.b ?? 0,
      })
    }
  }

  return entries
}

/** Fill + opacity for Konva preview (uncovered = default LED grey). */
export function getLedPreviewAppearance(
  row: number,
  column: number,
  offFill: string,
  grid: ColorGrid,
): { fill: string; opacity: number } {
  const color = grid[row]?.[column]
  if (color) {
    return { fill: rgbToCss(color), opacity: 1 }
  }
  return { fill: offFill, opacity: 1 }
}
