import { useParams } from 'react-router'
import { EditorCanvas } from '@/components/editor/canvas/editor-canvas'
import { EditorInspector } from '@/components/editor/inspector/editor-inspector'
import { EditorNavbar } from '@/components/editor/navbar/editor-navbar'
import { EditorSidebar } from '@/components/editor/sidebar/editor-sidebar'
import { EditorTimeline } from '@/components/editor/timeline/editor-timeline'

function Editor() {
  const { projectId } = useParams<{ projectId: string }>()
  // TODO: wire to real selection state — inspector opens once an element is selected
  const isInspectorOpen = false

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <div className="flex h-full w-full">
        <EditorSidebar />
        <div className="relative flex-1 overflow-hidden">
          <EditorCanvas />
          <EditorTimeline />
        </div>
        {isInspectorOpen && <EditorInspector />}
      </div>

      <EditorNavbar projectId={projectId} />
    </div>
  )
}

export default Editor
