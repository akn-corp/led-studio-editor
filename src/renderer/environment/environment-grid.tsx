import { useEffect, useRef, useState } from 'react'
import type Konva from 'konva'
import { Layer, Rect, Shape, Stage } from 'react-konva'
import {
  LED_COLOR,
  MAX_CELL_SIZE,
  MAX_SCALE,
  MIN_CELL_SIZE,
  MIN_SCALE,
  SCALE_STEP,
  SELECTION_COLOR,
  VIEWPORT_PADDING,
} from '@/renderer/environment/constants'
import { clamp } from '@/lib/utils'
import { useScene } from '@/state/use-scene'

function EnvironmentGrid({
  onWallClick,
  isSelected,
}: {
  onWallClick?: () => void
  isSelected?: boolean
}) {
  const { environment } = useScene()
  const { rows, columns } = environment

  const containerRef = useRef<HTMLDivElement>(null)
  const hasCentered = useRef(false)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  // Denser grids get tighter spacing automatically so a 128x128 wall still
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
  }, [])

  useEffect(() => {
    if (hasCentered.current || size.width === 0 || size.height === 0) return
    setPosition({
      x: (size.width - gridWidth) / 2,
      y: (size.height - gridHeight) / 2,
    })
    hasCentered.current = true
  }, [size, gridWidth, gridHeight])

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault()
    const stage = e.target.getStage()
    const pointer = stage?.getPointerPosition()
    if (!stage || !pointer) return

    const pointTo = {
      x: (pointer.x - position.x) / scale,
      y: (pointer.y - position.y) / scale,
    }

    const zoomingIn = e.evt.deltaY < 0
    const nextScale = clamp(
      zoomingIn ? scale * SCALE_STEP : scale / SCALE_STEP,
      MIN_SCALE,
      MAX_SCALE,
    )

    setScale(nextScale)
    setPosition({
      x: pointer.x - pointTo.x * nextScale,
      y: pointer.y - pointTo.y * nextScale,
    })
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
        {/* One draw call for every LED instead of one Konva node each — the
            node-per-LED approach got slow well before 128x128 (16k+ nodes). */}
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
