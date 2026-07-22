import { useState } from 'react'
import { useSortable } from '@dnd-kit/react/sortable'
import { Eye, EyeOff, Trash2, GripVertical } from 'lucide-react'
import type { Element } from '@/engine'
import { getElementKeyframeTimes, getPropertiesKeyframedAt } from '@/engine'
import { cn } from '@/lib/utils'
import { useScene } from '@/state/use-scene'
import { useSelection } from '@/state/use-selection'
import { usePlayback } from '@/state/use-playback'
import { ElementIcon } from '@/components/editor/timeline/element-icon'
import { TimelineClip } from '@/components/editor/timeline/timeline-clip'
import { TimelineLaneRow } from '@/components/editor/timeline/timeline-lane-row'
import { trackWidthFor } from '@/components/editor/timeline/timeline-scale'
import { TIMELINE_ELEMENT_SORTABLE_GROUP } from '@/components/editor/timeline/timeline-reorder'

function ElementTrackRow({
  element,
  elementIndex,
  allElements,
  duration,
  pixelsPerSecond,
}: {
  element: Element
  elementIndex: number
  allElements: Element[]
  duration: number
  pixelsPerSecond: number
}) {
  const { moveKeyframe, removeKeyframe, setElementMeta, removeElement } = useScene()
  const { selectedElementId, select } = useSelection()
  const { currentTime, seek } = usePlayback()
  const [dragging, setDragging] = useState<{ originalTime: number; time: number } | null>(null)
  const { ref, handleRef, isDragging } = useSortable({
    id: element.id,
    index: elementIndex,
    group: TIMELINE_ELEMENT_SORTABLE_GROUP,
  })

  const trackWidth = trackWidthFor(duration, pixelsPerSecond)
  const times = getElementKeyframeTimes(element)
  const isSelected = selectedElementId === element.id

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
      rootRef={ref}
      trackWidth={trackWidth}
      className={cn(isSelected && 'bg-primary/5', isDragging && 'opacity-40')}
      label={
        <>
          <GripVertical
            ref={handleRef}
            className="size-3 shrink-0 cursor-grab text-muted-foreground/50 active:cursor-grabbing"
          />
          <button
            type="button"
            aria-label={element.hidden ? 'Show element' : 'Hide element'}
            className="shrink-0 text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation()
              setElementMeta(element.id, { hidden: !element.hidden })
            }}
          >
            {element.hidden ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
          </button>
          <ElementIcon element={element} className="size-3.5 shrink-0" />
          <button
            type="button"
            aria-label="Delete element"
            className="ml-auto shrink-0 text-muted-foreground hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation()
              removeElement(element.id)
            }}
          >
            <Trash2 className="size-3.5" />
          </button>
        </>
      }
    >
      <TimelineClip
        element={element}
        otherElements={allElements}
        pixelsPerSecond={pixelsPerSecond}
        currentTime={currentTime}
        isSelected={isSelected}
        onSelect={() => select(element.id)}
      />
      {times.map((time) => {
        const displayTime = dragging && Math.abs(dragging.originalTime - time) < 0.001 ? dragging.time : time
        return (
          <div
            key={time}
            role="button"
            tabIndex={0}
            aria-label={`Keyframe at ${displayTime.toFixed(2)}s`}
            className="absolute top-1/2 z-10 size-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 cursor-ew-resize bg-yellow-300"
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
