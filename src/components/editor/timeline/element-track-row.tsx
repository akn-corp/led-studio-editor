import { useState } from 'react'
import { Square, Type } from 'lucide-react'
import type { Element } from '@/engine'
import { getElementKeyframeTimes, getPropertiesKeyframedAt } from '@/engine'
import { cn } from '@/lib/utils'
import { useScene } from '@/state/use-scene'
import { useSelection } from '@/state/use-selection'
import { usePlayback } from '@/state/use-playback'
import { TimelineLaneRow } from '@/components/editor/timeline/timeline-lane-row'
import { trackWidthFor } from '@/components/editor/timeline/timeline-scale'

const ELEMENT_ICON = { square: Square, text: Type } as const

function ElementTrackRow({
  element,
  duration,
  pixelsPerSecond,
}: {
  element: Element
  duration: number
  pixelsPerSecond: number
}) {
  const { moveKeyframe, removeKeyframe } = useScene()
  const { selectedElementId, select } = useSelection()
  const { seek } = usePlayback()
  const [dragging, setDragging] = useState<{ originalTime: number; time: number } | null>(null)

  const trackWidth = trackWidthFor(duration, pixelsPerSecond)
  const times = getElementKeyframeTimes(element)
  const Icon = ELEMENT_ICON[element.type]

  const commitDrag = () => {
    if (!dragging) return
    const properties = getPropertiesKeyframedAt(element, dragging.originalTime)
    for (const property of properties) {
      moveKeyframe(element.id, property, dragging.originalTime, dragging.time)
    }
    setDragging(null)
  }

  return (
    <TimelineLaneRow
      trackWidth={trackWidth}
      onLabelClick={() => select(element.id)}
      className={cn(selectedElementId === element.id && 'bg-primary/5')}
      label={
        <>
          <Icon className="size-3.5 shrink-0" />
          <span className="truncate capitalize">{element.type}</span>
        </>
      }
    >
      {times.map((time) => {
        const displayTime = dragging && Math.abs(dragging.originalTime - time) < 0.001 ? dragging.time : time
        return (
          <div
            key={time}
            role="button"
            tabIndex={0}
            aria-label={`Keyframe at ${displayTime.toFixed(2)}s`}
            className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 cursor-ew-resize bg-primary"
            style={{ left: displayTime * pixelsPerSecond }}
            onClick={(e) => {
              e.stopPropagation()
              select(element.id)
              seek(time)
            }}
            onDoubleClick={(e) => {
              e.stopPropagation()
              for (const property of getPropertiesKeyframedAt(element, time)) {
                removeKeyframe(element.id, property, time)
              }
            }}
            onPointerDown={(e) => {
              e.stopPropagation()
              e.currentTarget.setPointerCapture(e.pointerId)
              setDragging({ originalTime: time, time })
            }}
            onPointerMove={(e) => {
              if (e.buttons !== 1 || !dragging) return
              const lane = e.currentTarget.parentElement
              if (!lane) return
              const rect = lane.getBoundingClientRect()
              const next = (e.clientX - rect.left) / pixelsPerSecond
              setDragging({ ...dragging, time: Math.max(0, next) })
            }}
            onPointerUp={commitDrag}
          />
        )
      })}
    </TimelineLaneRow>
  )
}

export { ElementTrackRow }
