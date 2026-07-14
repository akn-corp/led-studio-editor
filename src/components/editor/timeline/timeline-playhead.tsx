import { useRef } from 'react'
import { offsetToTime, timeToOffset } from '@/components/editor/timeline/timeline-scale'

function TimelinePlayhead({
  currentTime,
  pixelsPerSecond,
  onSeek,
}: {
  currentTime: number
  pixelsPerSecond: number
  onSeek: (time: number) => void
}) {
  const lineRef = useRef<HTMLDivElement>(null)

  const seekFromClientX = (clientX: number) => {
    const track = lineRef.current?.offsetParent as HTMLElement | null
    if (!track) return
    const rect = track.getBoundingClientRect()
    onSeek(offsetToTime(clientX - rect.left, pixelsPerSecond))
  }

  return (
    <div
      ref={lineRef}
      className="pointer-events-none absolute inset-y-0 z-10 w-px bg-primary"
      style={{ left: timeToOffset(currentTime, pixelsPerSecond) }}
    >
      <div
        role="slider"
        aria-label="Playhead"
        aria-valuenow={currentTime}
        className="pointer-events-auto absolute -top-0.5 -left-1.5 h-3 w-3 -translate-y-1/2 rotate-45 cursor-ew-resize bg-primary"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId)
          seekFromClientX(e.clientX)
        }}
        onPointerMove={(e) => {
          if (e.buttons !== 1) return
          seekFromClientX(e.clientX)
        }}
      />
    </div>
  )
}

export { TimelinePlayhead }
