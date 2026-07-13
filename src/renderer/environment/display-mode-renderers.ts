import type Konva from 'konva'
import type { ColorGrid } from '@/engine'
import { getLedPreviewAppearance } from '@/engine'
import { LED_COLOR } from '@/renderer/environment/constants'
import type { DisplayMode } from '@/renderer/display-mode-store'

export interface DisplayModeDrawArgs {
  context: Konva.Context
  rows: number
  columns: number
  cellSize: number
  ledRadius: number
  colorGrid: ColorGrid
  gridWidth: number
  gridHeight: number
}

type DisplayModeRenderer = (args: DisplayModeDrawArgs) => void

const SIMULATION_GLOW_BLUR = 6
const SIMULATION_GRID_STROKE = 'rgba(255,255,255,0.08)'

function drawEditMode({ context, rows, columns, cellSize, ledRadius, colorGrid }: DisplayModeDrawArgs) {
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const { fill } = getLedPreviewAppearance(row, column, LED_COLOR, colorGrid)
      context.fillStyle = fill
      const x = column * cellSize + cellSize / 2
      const y = row * cellSize + cellSize / 2
      context.beginPath()
      context.arc(x, y, ledRadius, 0, Math.PI * 2)
      context.fill()
    }
  }
}

function drawSimulationMode({
  context,
  rows,
  columns,
  cellSize,
  ledRadius,
  colorGrid,
  gridWidth,
  gridHeight,
}: DisplayModeDrawArgs) {
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const color = colorGrid[row]?.[column]
      if (!color) continue

      const { fill } = getLedPreviewAppearance(row, column, LED_COLOR, colorGrid)
      const x = column * cellSize + cellSize / 2
      const y = row * cellSize + cellSize / 2

      context.shadowBlur = SIMULATION_GLOW_BLUR
      context.shadowColor = fill
      context.fillStyle = fill
      context.beginPath()
      context.arc(x, y, ledRadius, 0, Math.PI * 2)
      context.fill()
    }
  }

  context.shadowBlur = 0
  context.shadowColor = 'transparent'
  context.strokeStyle = SIMULATION_GRID_STROKE
  context.lineWidth = 1
  context.strokeRect(0.5, 0.5, gridWidth - 1, gridHeight - 1)
}

// Strategy/Registry keyed by DisplayMode, mirroring sub-item-renderer-registry.ts —
// same shape of problem (dispatch on a small closed set of variants that's
// expected to grow), same fix.
const displayModeRenderers: Record<DisplayMode, DisplayModeRenderer> = {
  edit: drawEditMode,
  simulation: drawSimulationMode,
}

function getDisplayModeRenderer(mode: DisplayMode): DisplayModeRenderer {
  return displayModeRenderers[mode] ?? drawEditMode
}

export { getDisplayModeRenderer }
