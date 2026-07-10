import { useEffect, useMemo, useRef } from 'react'
import type Konva from 'konva'
import { Layer, Rect, Shape } from 'react-konva'
import type { ColorGrid } from '@/engine/rasterize-scene'
import { composeColorGrid } from '@/engine/rasterize-scene'
import { getLedPreviewAppearance } from '@/engine/rasterize-leds'
import { LED_COLOR, SELECTION_COLOR } from '@/renderer/environment/constants'
import { computeCellSize } from '@/renderer/environment/cell-size'
import type { DisplayMode } from '@/renderer/display-mode-store'
import { clamp } from '@/lib/utils'
import { useDisplayMode } from '@/state/use-display-mode'
import { useScene } from '@/state/use-scene'
import { useViewport } from '@/state/use-viewport'

const SIMULATION_GLOW_BLUR = 6
const SIMULATION_GRID_STROKE = 'rgba(255,255,255,0.08)'

function drawEditMode(
  context: Konva.Context,
  rows: number,
  columns: number,
  cellSize: number,
  ledRadius: number,
  colorGrid: ColorGrid,
) {
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const { fill, opacity } = getLedPreviewAppearance(row, column, LED_COLOR, colorGrid)
      context.fillStyle = fill
      context.globalAlpha = opacity
      const x = column * cellSize + cellSize / 2
      const y = row * cellSize + cellSize / 2
      context.beginPath()
      context.arc(x, y, ledRadius, 0, Math.PI * 2)
      context.fill()
    }
  }
  context.globalAlpha = 1
}

function drawSimulationMode(
  context: Konva.Context,
  rows: number,
  columns: number,
  cellSize: number,
  ledRadius: number,
  colorGrid: ColorGrid,
  gridWidth: number,
  gridHeight: number,
) {
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
      context.globalAlpha = 1
      context.beginPath()
      context.arc(x, y, ledRadius, 0, Math.PI * 2)
      context.fill()
    }
  }

  context.shadowBlur = 0
  context.shadowColor = 'transparent'
  context.globalAlpha = 1
  context.strokeStyle = SIMULATION_GRID_STROKE
  context.lineWidth = 1
  context.strokeRect(0.5, 0.5, gridWidth - 1, gridHeight - 1)
}

function EnvironmentGrid({ isSelected }: { isSelected?: boolean }) {
  const { environment, project } = useScene()
  const { mode } = useDisplayMode()
  const { rows, columns } = environment
  const { scale, size, setContentSize, setPosition } = useViewport()

  const hasCentered = useRef(false)

  const cellSize = computeCellSize(rows, columns, size)
  const colorGrid = useMemo(() => composeColorGrid(project), [project])
  const ledRadius = clamp(cellSize * 0.1, 1, 4)
  const gridWidth = columns * cellSize
  const gridHeight = rows * cellSize

  useEffect(() => {
    if (hasCentered.current || size.width === 0 || size.height === 0) return
    setPosition({
      x: (size.width - gridWidth) / 2,
      y: (size.height - gridHeight) / 2,
    })
    hasCentered.current = true
  }, [size, gridWidth, gridHeight, setPosition])

  useEffect(() => {
    setContentSize({ width: gridWidth, height: gridHeight })
  }, [gridWidth, gridHeight, setContentSize])

  const sceneFunc = (context: Konva.Context, shape: Konva.Shape, displayMode: DisplayMode) => {
    if (displayMode === 'simulation') {
      drawSimulationMode(context, rows, columns, cellSize, ledRadius, colorGrid, gridWidth, gridHeight)
    } else {
      drawEditMode(context, rows, columns, cellSize, ledRadius, colorGrid)
    }
    context.fillStrokeShape(shape)
  }

  return (
    <Layer listening={false}>
      <Shape
        width={gridWidth}
        height={gridHeight}
        sceneFunc={(context, shape) => {
          sceneFunc(context, shape, mode)
        }}
      />
      {isSelected && mode === 'edit' && (
        <Rect
          x={0}
          y={0}
          width={gridWidth}
          height={gridHeight}
          stroke={SELECTION_COLOR}
          strokeWidth={2 / scale}
        />
      )}
    </Layer>
  )
}

export { EnvironmentGrid }
