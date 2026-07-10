import { useState } from 'react'
import { useDroppable } from '@dnd-kit/react'
import { ElementActionToolbar } from '@/components/editor/canvas/element-action-toolbar'
import { EnvironmentControls } from '@/components/editor/canvas/environment-controls'
import { CANVAS_DROPPABLE_ID } from '@/components/editor/canvas/use-canvas-drop'
import { CanvasStage } from '@/renderer/canvas-stage'
import { ElementsLayer } from '@/renderer/elements/elements-layer'
import { EnvironmentGrid } from '@/renderer/environment/environment-grid'
import { useScene } from '@/state/use-scene'
import { useSelection } from '@/state/use-selection'
import { cn } from '@/lib/utils'

function EditorCanvas() {
  const [isEnvironmentPanelOpen, setIsEnvironmentPanelOpen] = useState(false)
  const { environment } = useScene()
  const { select } = useSelection()
  const { isDropTarget, ref } = useDroppable({ id: CANVAS_DROPPABLE_ID })

  const handleBackgroundClick = () => {
    if (!environment.isSetted) return
    setIsEnvironmentPanelOpen((open) => !open)
    select(null)
  }

  return (
    <div
      ref={ref}
      className={cn('absolute inset-0 overflow-hidden', isDropTarget ? 'bg-muted' : 'bg-muted/30')}
    >
      <CanvasStage onBackgroundClick={handleBackgroundClick}>
        {environment.isSetted && <EnvironmentGrid isSelected={isEnvironmentPanelOpen} />}
        <ElementsLayer />
      </CanvasStage>
      <ElementActionToolbar />
      {isEnvironmentPanelOpen && environment.isSetted && <EnvironmentControls />}
    </div>
  )
}

export { EditorCanvas }
