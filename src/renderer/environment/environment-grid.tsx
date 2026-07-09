import { useEffect, useRef } from 'react'
import type Konva from 'konva'
import { Layer, Rect, Shape, Stage } from 'react-konva'
import {
  LED_COLOR,
  MAX_CELL_SIZE,
  MIN_CELL_SIZE,
  SELECTION_COLOR,
} from '@/renderer/environment/constants'
import { VIEWPORT_PADDING, WHEEL_SCALE_STEP } from '@/renderer/constants'
import { clamp } from '@/lib/utils'
import { useScene } from '@/state/use-scene'
import { useViewport } from '@/state/use-viewport'

function EnvironmentGrid({
  onWallClick,
  isSelected,
}: {
  onWallClick?: () => void
  isSelected?: boolean
}) {
  const { environment } = useScene()
  const { rows, columns } = environment
  const { scale, position, size, setSize, setContentSize, setPosition, zoomTo } = useViewport()

  const containerRef = useRef<HTMLDivElement>(null)
  const hasCentered = useRef(false)

  // Denser grids get tighter spacing automatically
  // fits on screen without forcing the user to zoom out first.
  const cellSize =
    size.width > 0 && size.height > 0
      ? clamp(
          Math.min(
            (size.width - VIEWPORT_PADDING * 2) / columns,
            (size.height - VIEWPORT_PADDING * 2) / rows,
          ),
          MIN_CELL_SIZE,
          MAX_CELL_SIZE,
        )
      : MAX_CELL_SIZE
  const ledRadius = clamp(cellSize * 0.1, 1, 4)
  const gridWidth = columns * cellSize
  const gridHeight = rows * cellSize

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ width, height })
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [setSize])

  useEffect(() => {
    if (hasCentered.current || size.width === 0 || size.height === 0) return
    setPosition({
      x: (size.width - gridWidth) / 2,
      y: (size.height - gridHeight) / 2,
    })
    hasCentered.current = true
  }, [size, gridWidth, gridHeight, setPosition])

  // Publish content bounds so the navbar's "Fit Page" can fit them without
  useEffect(() => {
    setContentSize({ width: gridWidth, height: gridHeight })
  }, [gridWidth, gridHeight, setContentSize])

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault()
    const pointer = e.target.getStage()?.getPointerPosition()
    if (!pointer) return

    const zoomingIn = e.evt.deltaY < 0
    zoomTo(zoomingIn ? scale * WHEEL_SCALE_STEP : scale / WHEEL_SCALE_STEP, pointer)
  }

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    setPosition({ x: e.target.x(), y: e.target.y() })
  }

  return (
    <div ref={containerRef} className="size-full bg-neutral-800/50">
      <Stage
        width={size.width}
        height={size.height}
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        draggable
        onWheel={handleWheel}
        onDragEnd={handleDragEnd}
        onClick={onWallClick}
      >
        <Layer listening={false}>
          <Shape
            width={gridWidth}
            height={gridHeight}
            sceneFunc={(context, shape) => {
              context.fillStyle = LED_COLOR
              for (let row = 0; row < rows; row++) {
                for (let column = 0; column < columns; column++) {
                  const x = column * cellSize + cellSize / 2
                  const y = row * cellSize + cellSize / 2
                  context.beginPath()
                  context.arc(x, y, ledRadius, 0, Math.PI * 2)
                  context.fill()
                }
              }
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
      </Stage>
    </div>
  )
}

export { EnvironmentGrid }
