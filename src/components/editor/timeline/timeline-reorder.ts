import type { DragEndEvent } from '@dnd-kit/react'
import { useScene } from '@/state/use-scene'

const TIMELINE_ELEMENT_SORTABLE_GROUP = 'timeline-elements'

// Vertical reordering of element track rows, via the grip handle in
// element-track-row.tsx. Identifies a same-group drag purely by id lookup
// against the element list rather than trusting dnd-kit's own index
// bookkeeping — sidebar-to-canvas drags (handled separately by
// useCanvasDrop) naturally no-op here since neither side is a known
// element id.
function useTimelineReorder() {
  const { project, reorderElement } = useScene()

  const handleDragEnd = ({ operation }: DragEndEvent) => {
    const { source, target } = operation
    const sourceId = source?.id != null ? String(source.id) : null
    const targetId = target?.id != null ? String(target.id) : null
    if (!sourceId || !targetId || sourceId === targetId) return
    const elementIds = project.elements.map((element) => element.id)
    if (!elementIds.includes(sourceId) || !elementIds.includes(targetId)) return
    reorderElement(sourceId, targetId)
  }

  return { handleDragEnd }
}

export { useTimelineReorder, TIMELINE_ELEMENT_SORTABLE_GROUP }
