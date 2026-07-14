import type { DragEndEvent } from '@dnd-kit/react'
import type { SidebarSubItem } from '@/components/editor/sidebar/sidebar-items'
import { DEFAULT_ENVIRONMENT, playbackStore } from '@/engine'
import { roundTo } from '@/lib/utils'
import { computeCellSize } from '@/renderer/environment/cell-size'
import { useScene } from '@/state/use-scene'
import { useSelection } from '@/state/use-selection'
import { useViewport } from '@/state/use-viewport'

const CANVAS_DROPPABLE_ID = 'editor-canvas'

function useCanvasDrop() {
  const { environment, setEnvironment, addElement } = useScene()
  const { select } = useSelection()
  const { scale, position, size } = useViewport()

  const handleDragEnd = ({ operation }: DragEndEvent) => {
    const { source, target } = operation
    if (target?.id !== CANVAS_DROPPABLE_ID) return

    const subItem = (source?.data as { subItem?: SidebarSubItem } | undefined)?.subItem
    if (!subItem) return

    if (subItem.isEnvironment) {
      setEnvironment({ ...DEFAULT_ENVIRONMENT, isSetted: true })
      return
    }

    if (!subItem.create) return

    const dropZoneElement = target.element
    if (!dropZoneElement) return

    // Screen position of the pointer at drop time, relative to the canvas
    // drop zone, then un-transformed through the Stage's own pan/zoom.
    const dropZoneRect = dropZoneElement.getBoundingClientRect()
    const pointer = operation.position.current
    const dropX = pointer.x - dropZoneRect.left
    const dropY = pointer.y - dropZoneRect.top
    const stageX = (dropX - position.x) / scale
    const stageY = (dropY - position.y) / scale

    const cellSize = computeCellSize(environment.rows, environment.columns, size)
    const element = subItem.create(environment, playbackStore.getCurrentTime())

    addElement({
      ...element,
      x: roundTo(stageX / cellSize - element.width / 2),
      y: roundTo(stageY / cellSize - element.height / 2),
    })
    select(element.id)
  }

  return { handleDragEnd }
}

export { useCanvasDrop, CANVAS_DROPPABLE_ID }
