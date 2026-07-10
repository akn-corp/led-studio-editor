import { useParams } from 'react-router'
import { EditorCanvas } from '@/components/editor/canvas/editor-canvas'
import { useCanvasDrop } from '@/components/editor/canvas/use-canvas-drop'
import { EditorInspector } from '@/components/editor/inspector/editor-inspector'
import { EditorNavbar } from '@/components/editor/navbar/editor-navbar'
import { EditorSidebar } from '@/components/editor/sidebar/editor-sidebar'
import { EditorTimeline } from '@/components/editor/timeline/editor-timeline'
import { useSelection } from '@/state/use-selection'
import { cn } from '@/lib/utils'
import { DragDropProvider } from '@dnd-kit/react'

function Editor() {
  const { projectId } = useParams<{ projectId: string }>()
  const { selectedElementId } = useSelection()
  const { handleDragEnd } = useCanvasDrop()

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <div className="relative isolate h-screen w-screen overflow-hidden">
        <EditorCanvas />
        <div className="pointer-events-none absolute inset-0 z-10 flex gap-4 pt-10">
          <EditorSidebar />
          <div className={cn('relative flex-1 mb-3', !selectedElementId && 'mr-4')}>
            <EditorTimeline />
          </div>
          {selectedElementId && <EditorInspector />}
        </div>

        <EditorNavbar projectId={projectId} />
      </div>
    </DragDropProvider>
  )
}

export default Editor
