import { useEffect, useMemo, useRef } from 'react'
import { Layer, Rect, Shape } from 'react-konva'
import { composeColorGrid, resolveSceneAtTime } from '@/engine'
import { SELECTION_COLOR } from '@/renderer/environment/constants'
import { computeCellSize } from '@/renderer/environment/cell-size'
import { getDisplayModeRenderer } from '@/renderer/environment/display-mode-renderers'
import { clamp } from '@/lib/utils'
import { useDisplayMode } from '@/state/use-display-mode'
import { usePlayback } from '@/state/use-playback'
import { useScene } from '@/state/use-scene'
import { useViewport } from '@/state/use-viewport'

function EnvironmentGrid({ isSelected }: { isSelected?: boolean }) {
  const { environment, project } = useScene()
  const { mode } = useDisplayMode()
  const { currentTime } = usePlayback()
  const { rows, columns } = environment
  const { scale, size, setContentSize, setPosition } = useViewport()

  const hasCentered = useRef(false)

  const cellSize = computeCellSize(rows, columns, size)
  const colorGrid = useMemo(
    () => composeColorGrid({ ...project, elements: resolveSceneAtTime(project, currentTime) }),
    [project, currentTime],
  )
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

  return (
    <Layer listening={false}>
      <Shape
        width={gridWidth}
        height={gridHeight}
        sceneFunc={(context, shape) => {
          getDisplayModeRenderer(mode)({
            context,
            rows,
            columns,
            cellSize,
            ledRadius,
            colorGrid,
            gridWidth,
            gridHeight,
          })
          context.fillStrokeShape(shape)
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
