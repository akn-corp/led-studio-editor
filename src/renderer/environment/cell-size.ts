import { clamp } from '@/lib/utils'
import { VIEWPORT_PADDING } from '@/renderer/constants'
import { MAX_CELL_SIZE, MIN_CELL_SIZE } from '@/renderer/environment/constants'

function computeCellSize(
  rows: number,
  columns: number,
  viewportSize: { width: number; height: number },
) {
  if (viewportSize.width === 0 || viewportSize.height === 0) return MAX_CELL_SIZE

  return clamp(
    Math.min(
      (viewportSize.width - VIEWPORT_PADDING * 2) / columns,
      (viewportSize.height - VIEWPORT_PADDING * 2) / rows,
    ),
    MIN_CELL_SIZE,
    MAX_CELL_SIZE,
  )
}

export { computeCellSize }
