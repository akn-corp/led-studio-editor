import { useEffect, useRef, type ReactNode } from 'react'
import type Konva from 'konva'
import { Stage } from 'react-konva'
import { WHEEL_SCALE_STEP } from '@/renderer/constants'
import { useViewport } from '@/state/use-viewport'

function CanvasStage({
  children,
  onBackgroundClick,
}: {
  children: ReactNode
  onBackgroundClick?: () => void
}) {
  const { scale, position, size, setSize, setPosition, zoomTo } = useViewport()
  const containerRef = useRef<HTMLDivElement>(null)

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

  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
      onBackgroundClick?.()
    }
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
        onClick={handleClick}
      >
        {children}
      </Stage>
    </div>
  )
}

export { CanvasStage }
