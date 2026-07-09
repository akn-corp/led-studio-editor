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
    <div className="relative isolate h-screen w-screen overflow-hidden">
      <EditorCanvas />
      <EditorSidebar />
      <EditorTimeline />
      {isInspectorOpen && <EditorInspector />}
      <EditorNavbar projectId={projectId} />
    </div>
  )
}

export default Editor
