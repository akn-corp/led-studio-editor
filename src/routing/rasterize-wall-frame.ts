import { composeColorGrid } from '@/engine'
import type { Project } from '@/engine'
import { entityIdForCell } from '@/routing/wall-mapping'
import type { LedEntry } from '@/routing/protocol'

/**
 * Maps the engine's resolved per-cell color state onto this wall's physical
 * entity ids. This is the actual routing boundary: everything upstream of
 * `composeColorGrid` (which element covers which cell, what color it
 * resolves to) is the editor's job; only the entity-id lookup below is
 * specific to this physical installation's wiring.
 */
export function rasterizeWallFrame(project: Project): LedEntry[] {
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
