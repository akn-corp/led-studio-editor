import { useRef, useState } from 'react'
import type { VideoCropRect } from '@/engine'
import { cn } from '@/lib/utils'

const MIN_SIZE = 0.1
const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

type Handle = 'move' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

interface DragOrigin {
  handle: Handle
  pointerStartClientX: number
  pointerStartClientY: number
  originCrop: VideoCropRect
  containerWidth: number
  containerHeight: number
}

function applyDrag(base: DragOrigin, clientX: number, clientY: number): VideoCropRect {
  const dx = (clientX - base.pointerStartClientX) / base.containerWidth
  const dy = (clientY - base.pointerStartClientY) / base.containerHeight
  const origin = base.originCrop

  if (base.handle === 'move') {
    const x = clamp01(Math.min(origin.x + dx, 1 - origin.width))
    const y = clamp01(Math.min(origin.y + dy, 1 - origin.height))
    return { ...origin, x: Math.max(0, x), y: Math.max(0, y) }
  }

  let { x, y, width, height } = origin
  if (base.handle.includes('left')) {
    const newX = clamp01(Math.min(origin.x + dx, origin.x + origin.width - MIN_SIZE))
    width = origin.x + origin.width - newX
    x = newX
  } else if (base.handle.includes('right')) {
    width = Math.max(MIN_SIZE, Math.min(origin.width + dx, 1 - origin.x))
  }
  if (base.handle.includes('top')) {
    const newY = clamp01(Math.min(origin.y + dy, origin.y + origin.height - MIN_SIZE))
    height = origin.y + origin.height - newY
    y = newY
  } else if (base.handle.includes('bottom')) {
    height = Math.max(MIN_SIZE, Math.min(origin.height + dy, 1 - origin.y))
  }
  return { x, y, width, height }
}

/**
 * Renders `crop` directly (no local shadow state) — the parent re-renders
 * with a fresh `crop` prop on every `onPatch` call during the drag, same
 * live-patch/commit split TimelineClip uses for move/trim.
 */
function VideoCropOverlay({
  crop,
  onPatch,
  onCommit,
}: {
  crop: VideoCropRect
  onPatch: (crop: VideoCropRect) => void
  onCommit: (crop: VideoCropRect) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [origin, setOrigin] = useState<DragOrigin | null>(null)

  const beginDrag = (handle: Handle, e: React.PointerEvent) => {
    e.stopPropagation()
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    e.currentTarget.setPointerCapture(e.pointerId)
    setOrigin({
      handle,
      pointerStartClientX: e.clientX,
      pointerStartClientY: e.clientY,
      originCrop: crop,
      containerWidth: rect.width,
      containerHeight: rect.height,
    })
  }

  const onDragMove = (e: React.PointerEvent) => {
    if (!origin || e.buttons !== 1) return
    onPatch(applyDrag(origin, e.clientX, e.clientY))
  }

  const commitDrag = (e: React.PointerEvent) => {
    if (!origin) return
    onCommit(applyDrag(origin, e.clientX, e.clientY))
    setOrigin(null)
  }

  const corners: Handle[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right']

  return (
    <div ref={containerRef} className="absolute inset-0">
      <div
        className="absolute cursor-move border-2 border-primary bg-primary/10"
        style={{
          left: `${crop.x * 100}%`,
          top: `${crop.y * 100}%`,
          width: `${crop.width * 100}%`,
          height: `${crop.height * 100}%`,
        }}
        onPointerDown={(e) => beginDrag('move', e)}
        onPointerMove={onDragMove}
        onPointerUp={commitDrag}
      >
        {corners.map((corner) => (
          <div
            key={corner}
            className={cn(
              'absolute size-3 rounded-full border-2 border-primary bg-background',
              corner.includes('top') ? '-top-1.5' : '-bottom-1.5',
              corner.includes('left') ? '-left-1.5 cursor-nwse-resize' : '-right-1.5 cursor-nesw-resize',
            )}
            onPointerDown={(e) => beginDrag(corner, e)}
            onPointerMove={onDragMove}
            onPointerUp={commitDrag}
          />
        ))}
      </div>
    </div>
  )
}

export { VideoCropOverlay }
