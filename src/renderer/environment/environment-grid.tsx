import { useEffect, useRef } from 'react'
import { Layer, Rect, Shape } from 'react-konva'
import { resolveCoveringElement } from '@/engine'
import { LED_COLOR, SELECTION_COLOR } from '@/renderer/environment/constants'
import { computeCellSize } from '@/renderer/environment/cell-size'
import { clamp } from '@/lib/utils'
import { useScene } from '@/state/use-scene'
import { useViewport } from '@/state/use-viewport'

function EnvironmentGrid({ isSelected }: { isSelected?: boolean }) {
  const { environment, project } = useScene()
  const { rows, columns } = environment
  const { scale, size, setContentSize, setPosition } = useViewport()

  const hasCentered = useRef(false)

  const cellSize = computeCellSize(rows, columns, size)
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

  // Publish content bounds so the navbar's "Fit Page" can fit them without
  // needing to know how the grid computes its own dimensions.
  useEffect(() => {
    setContentSize({ width: gridWidth, height: gridHeight })
  }, [gridWidth, gridHeight, setContentSize])

  return (
    <Layer listening={false}>
      <Shape
        width={gridWidth}
        height={gridHeight}
        sceneFunc={(context, shape) => {
          for (let row = 0; row < rows; row++) {
            for (let column = 0; column < columns; column++) {
              const covering = resolveCoveringElement(project.elements, column + 0.5, row + 0.5)
              context.fillStyle = covering?.fill ?? LED_COLOR
              context.globalAlpha = covering?.opacity ?? 1
              const x = column * cellSize + cellSize / 2
              const y = row * cellSize + cellSize / 2
              context.beginPath()
              context.arc(x, y, ledRadius, 0, Math.PI * 2)
              context.fill()
            }
          }
          context.globalAlpha = 1
          context.fillStrokeShape(shape)
        }}
      />
      {isSelected && (
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
